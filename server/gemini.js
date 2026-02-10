/**
 * ============================================
 * GEMINI.JS - Gemini AI Integration
 * Tổng hợp diễn giải Tử Vi bằng AI
 * Key được bảo mật phía server
 * ============================================
 */

const crypto = require('crypto');
const db = require('./db');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('[GEMINI] ⚠️ GEMINI_API_KEY chưa được cấu hình! AI interpretation sẽ không hoạt động.');
}

/**
 * Tạo cache key dựa trên cấu trúc "DNA" của lá số
 * Nếu 2 người khác nhau có cùng vị trí các sao => Dùng chung 1 kết quả AI
 */
function createCacheKey(data) {
    const ov = data.overview || {};
    const palaces = data.palaces || [];

    // Tạo DNA từ 12 cung: Tên cung + Các sao (đã sắp xếp để đảm bảo key đồng nhất)
    const palaceDNA = palaces.map(p => {
        const chinh = (p.chinhTinh || []).map(s => s.name + (s.hoa || '')).sort().join(',');
        const phu = (p.phuTinh || []).map(s => s.name + (s.hoa || '')).sort().join(',');
        return `${p.cungName}:${chinh}|${phu}`;
    }).join(';');

    const keyData = JSON.stringify({
        gender: ov.gioiTinh,
        yearView: data.yearView,
        cuc: ov.cucName,
        menh: ov.menhNapAm,
        cungMenh: ov.cungMenhPos,
        vanHan: data.vanHan ? { dv: data.vanHan.daiVan?.cungName, tv: data.vanHan.tieuVan?.cungName } : null,
        dna: palaceDNA
    });
    return crypto.createHash('md5').update(keyData).digest('hex');
}

/**
 * Gọi Gemini API để tổng hợp diễn giải
 */
async function generateAiInterpretation(interpretationData) {
    if (!GEMINI_API_KEY) {
        return { error: 'Phân tích chuyên sâu không khả dụng', fallback: true };
    }

    try {
        // Check cache
        const cacheKey = createCacheKey(interpretationData);
        const cached = db.getAiCache(cacheKey);
        if (cached) {
            console.log('[GEMINI] Cache hit:', cacheKey);
            return JSON.parse(cached);
        }

        console.log('[GEMINI] Generating AI interpretation...');

        // Build prompt
        const prompt = buildPrompt(interpretationData);

        const requestBody = JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
                topP: 0.9
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        // Retry logic cho rate limit (429)
        const MAX_RETRIES = 3;
        let response;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody
            });

            if (response.status === 429 && attempt < MAX_RETRIES) {
                // Parse retryDelay từ response nếu có hoặc dùng mặc định tăng dần
                let waitSec = 10 * (attempt + 1); // 10s, 20s, 30s
                try {
                    const errBody = await response.json();
                    const retryInfo = errBody?.error?.details?.find(d => d.retryDelay);
                    if (retryInfo?.retryDelay) {
                        waitSec = parseInt(retryInfo.retryDelay) || waitSec;
                    }
                } catch (_) { }
                console.log(`[GEMINI] 429 Rate limited, retry ${attempt + 1}/${MAX_RETRIES} after ${waitSec}s...`);
                await new Promise(r => setTimeout(r, waitSec * 1000));
                continue;
            }
            break;
        }

        if (!response.ok) {
            const errText = await response.text();
            console.error('[GEMINI] API Error:', response.status, errText);
            return { error: `Lỗi phân tích: ${response.status}`, fallback: true };
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error('[GEMINI] Empty response');
            return { error: 'Không nhận được phản hồi', fallback: true };
        }

        // Parse AI response
        const aiResult = parseAiResponse(text);

        // Cache result (30 ngày = 720h để tiết kiệm token tối đa)
        db.setAiCache(cacheKey, JSON.stringify(aiResult), 720);

        console.log('[GEMINI] AI interpretation generated and cached');
        return aiResult;

    } catch (err) {
        console.error('[GEMINI] Error:', err.message);
        return { error: err.message, fallback: true };
    }
}

/**
 * Build prompt cho Gemini - Per-Palace format
 * Trả về phân tích theo TỪNG CUNG thay vì sections chung
 */
function buildPrompt(data) {
    const ov = data.overview || {};
    const palaces = data.palaces || [];
    const specials = data.specials || [];

    let palaceInfo = palaces.map(p => {
        const stars = [
            ...(p.chinhTinh || []).map(s => {
                let detail = s.name;
                if (s.hoa) detail += ` (Hoá ${s.hoa})`;
                if (s.detail) detail += ` - ${s.detail}`;
                else if (s.short) detail += ` - ${s.short}`;
                return detail;
            }),
            ...(p.phuTinh || []).map(s => {
                let detail = s.name;
                if (s.hoa) detail += ` (Hoá ${s.hoa})`;
                if (s.short) detail += ` - ${s.short}`;
                return detail;
            })
        ].join('; ');
        const overall = p.overall || '';
        const hourDep = p.isHourDependent ? `[PHỤ THUỘC GIỜ SINH: ${p.hourDependentReason}]` : '';
        return `- ${p.cungName} (${p.chiName}) [Rating: ${p.rating}/5] ${hourDep}: ${stars || 'Không có chính tinh'}. ${overall}`;
    }).join('\n');

    let specialInfo = specials.map(s => `- ${s.title}: ${s.content}`).join('\n');

    // Vận Hạn info
    let vanHanInfo = '';
    if (data.vanHan) {
        const vh = data.vanHan;
        vanHanInfo = `\n## VẬN HẠN NĂM ${data.yearView || ''}:\n`;
        if (vh.daiVan) {
            const dvSao = (vh.daiVan.chinhTinh || []).map(s => s.name + (s.hoa ? ` (Hoá ${s.hoa})` : '')).join(', ');
            vanHanInfo += `- Đại Vận: Cung ${vh.daiVan.cungName} (${vh.daiVan.chiName}), tuổi ${vh.daiVan.tuoiFrom}-${vh.daiVan.tuoiTo}, năm ${vh.daiVan.namFrom}-${vh.daiVan.namTo}. Chính tinh: ${dvSao || 'Không có'}. Rating: ${vh.daiVan.rating}/5\n`;
        }
        if (vh.tieuVan) {
            vanHanInfo += `- Tiểu Vận: Cung ${vh.tieuVan.cungName} (${vh.tieuVan.chiName}), ${vh.tieuVan.tuoi} tuổi. Chính tinh: ${(vh.tieuVan.chinhTinh || []).join(', ') || 'Không có'}\n`;
        }
        if (vh.luuTuHoa) {
            vanHanInfo += `- Lưu Tứ Hoá: Lộc→${vh.luuTuHoa['Hoá Lộc']}, Quyền→${vh.luuTuHoa['Hoá Quyền']}, Khoa→${vh.luuTuHoa['Hoá Khoa']}, Kỵ→${vh.luuTuHoa['Hoá Kỵ']}\n`;
        }
    }

    return `Bạn là chuyên gia Tử Vi Đẩu Số hàng đầu Việt Nam. Hãy phân tích lá số sau.

## QUY TẮC VIẾT:
- Dùng danh xưng "Đương số". KHÔNG nhắc tên riêng.
- KHÔNG liệt kê lại tên sao (người dùng đã thấy danh sách sao trong giao diện).
- Mỗi cung viết NGẮN GỌN 2-4 câu, tập trung vào ý NGHĨA THỰC TẾ và LỜI KHUYÊN cụ thể.
- KHÔNG lặp lại thông tin giữa các cung. Mỗi cung chỉ viết điểm ĐẶC TRƯNG nhất.
- Viết phong cách chuyên gia: điềm đạm, sắc sảo, đi thẳng vào vấn đề.

## THÔNG TIN LÁ SỐ:
- Giới tính: ${ov.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}
- Giờ sinh: ${data.hour || 'Không xác định'}
- Âm Dương: ${ov.amDuong} (${ov.thuan ? 'Thuận hành' : 'Nghịch hành'})
- Mệnh: ${ov.menhNapAm} (Hành ${ov.hanhMenh})
- Cục: ${ov.cucName} (Hành ${ov.hanhCuc})

## CHI TIẾT 12 CUNG:
${palaceInfo}

## ĐẶC BIỆT:
${specialInfo || 'Không có'}
${vanHanInfo}

## FORMAT BẮT BUỘC:
Chia bài viết bằng dấu "---". Cấu trúc:

1. **TỔNG QUAN** (3-5 câu: tóm tắt vận mệnh, điểm nổi bật nhất).
2. 12 đoạn **LUẬN GIẢI CUNG** — mỗi đoạn bắt đầu bằng [MỆNH], [PHỤ MẪU]... Ngăn cách bằng "---". Mỗi cung 2-4 câu.
3. **VẬN HẠN NĂM ${data.yearView || ''}** (3-5 câu).
4. **LỜI KHUYÊN** (3-5 câu thiết thực).

KHÔNG viết "Phần 1:...", "Phần 2:...".
Viết bằng Tiếng Việt.`;
}

/**
 * Parse AI response thành structured data
 * Hỗ trợ cả format mới (per-palace [CUNG_NAME]) và format cũ (8 sections)
 */
function parseAiResponse(text) {
    // Tiền xử lý: Nếu AI quên dấu --- giữa các cung, ta tự insert bằng regex
    const PALACE_NAMES = ['MỆNH', 'PHỤ MẪU', 'PHÚC ĐỨC', 'ĐIỀN TRẠCH', 'QUAN LỘC', 'NÔ BỘC',
        'THIÊN DI', 'TẬT ÁCH', 'TÀI BẠCH', 'TỬ TỨC', 'PHU THÊ', 'HUYNH ĐỆ'];

    let processedText = text;
    // Tự động thêm --- trước mỗi [CUNG] nếu chưa có
    PALACE_NAMES.forEach(pName => {
        const escaped = pName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('([^\\-])\\s*\\[(' + escaped + ')\\]', 'gi');
        processedText = processedText.replace(regex, '$1\n---\n[$2]');
    });

    const sections = processedText.split('---').map(s => s.trim()).filter(s => s.length > 0);

    const result = {
        sections: [],      // Phần tổng quan (overview + vận hạn + lời khuyên)
        palaceSections: {}, // Per-palace AI content { 'MỆNH': '...', 'PHỤ MẪU': '...' }
        raw: text
    };

    let overviewSections = [];
    let hasPalaceFormat = false;

    sections.forEach((section) => {
        // Clean bold markers, numbering, and "PHẦN X" headers
        let content = section
            .replace(/\*\*/g, '')
            .replace(/^\s*(PHẦN|PHAN)\s*\d+[:.]?\s*/i, '') // Xoá "PHẦN 1:", "PHẦN 2."
            .replace(/^\d+[:.]?\s*/gm, '') // Xoá "1.", "2:" ở đầu dòng
            .trim();

        // Check nếu section bắt đầu bằng [CUNG_NAME]
        let matchedPalace = null;
        for (let i = 0; i < PALACE_NAMES.length; i++) {
            const pName = PALACE_NAMES[i];
            const escaped = pName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('^\\s*\\[(' + escaped + ')\\]\\s*', 'i');
            if (regex.test(content)) {
                matchedPalace = pName;
                content = content.replace(regex, '').trim();
                break;
            }
        }

        if (matchedPalace) {
            hasPalaceFormat = true;
            content = content
                .replace(/^(LUẬN GIẢI|PHÂN TÍCH)\s*(CUNG)?\s*/i, '')
                .trim();
            result.palaceSections[matchedPalace] = content;
        } else {
            overviewSections.push(content);
        }
    });

    const overviewTitles = ['Tổng Quan Vận Mệnh', 'Vận Hạn Năm', 'Lời Khuyên'];
    const overviewIcons = ['🌟', '📅', '💡'];

    if (hasPalaceFormat) {
        overviewSections.forEach((content, i) => {
            // Xác định title dựa trên keyword trong content nếu i > 0
            let title = overviewTitles[i] || `Phân Tích ${i + 1}`;
            let icon = overviewIcons[i] || '📌';

            if (content.toLowerCase().includes('vận hạn') || content.toLowerCase().includes('năm ' + new Date().getFullYear())) {
                title = 'Vận Hạn Năm'; icon = '📅';
            } else if (content.toLowerCase().includes('lời khuyên') || content.toLowerCase().includes('khuyên đương số')) {
                title = 'Lời Khuyên'; icon = '💡';
            }

            content = content
                .replace(/^(TỔNG QUAN VẬN MỆNH|TỔNG QUAN|VẬN HẠN.*|LỜI KHUYÊN):?\s*/i, '')
                .trim();

            result.sections.push({ title, icon, content });
        });
    } else {
        // Fallback cũ
        const fallbackTitles = ['Tổng Quan Vận Mệnh', 'Giờ Sinh', 'Tính Cách', 'Sự Nghiệp', 'Tình Duyên', 'Sức Khỏe', 'Vận Hạn', 'Lời Khuyên'];
        const fallbackIcons = ['🌟', '⏰', '👤', '💼', '💕', '🏥', '📅', '💡'];

        sections.forEach((section, i) => {
            let content = section.replace(/\*\*/g, '').replace(/^\d+[:.]?\s*/gm, '').trim();
            result.sections.push({
                title: fallbackTitles[i] || `Phần ${i + 1}`,
                icon: fallbackIcons[i] || '📌',
                content: content
            });
        });
    }

    if (result.sections.length === 0 && Object.keys(result.palaceSections).length === 0) {
        result.sections.push({ title: 'Phân Tích AI', icon: '🤖', content: text });
    }

    return result;
}

module.exports = {
    generateAiInterpretation
};
