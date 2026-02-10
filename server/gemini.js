/**
 * ============================================
 * GEMINI.JS - Gemini AI Integration v2
 * Hướng 2: Gửi compact raw data → AI tự luận giải
 * Không dùng template cứng, AI đọc tổ hợp sao thật
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

    const palaceDNA = palaces.map(p => {
        const chinh = (p.chinhTinh || []).map(s => s.name + (s.hoa || '') + (s.luuHoa || '')).sort().join(',');
        const phu = (p.phuTinh || []).map(s => s.name + (s.hoa || '') + (s.luuHoa || '')).sort().join(',');
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
 * Build compact JSON data cho Gemini
 * Chỉ gửi raw data tối thiểu, không nhồi template text
 */
function buildCompactData(data) {
    const ov = data.overview || {};
    const palaces = data.palaces || [];

    // Build 12 cung compact
    const cungData = {};
    palaces.forEach(p => {
        const saoList = [];

        // Chính tinh
        (p.chinhTinh || []).forEach(s => {
            let entry = s.name;
            if (s.statusText) entry += ` [${s.statusText}]`;
            if (s.hoa) entry += ` (Hoá ${s.hoa})`;
            if (s.luuHoa) entry += ` (Lưu Hoá ${s.luuHoa})`;
            if (s.nhaiNguyetInfo) entry += ` [${s.nhaiNguyetInfo.trangThai}]`;
            saoList.push(entry);
        });

        // Phụ tinh quan trọng
        (p.phuTinh || []).forEach(s => {
            let entry = s.name;
            if (s.hoa) entry += ` (Hoá ${s.hoa})`;
            if (s.luuHoa) entry += ` (Lưu Hoá ${s.luuHoa})`;
            entry += s.nature === 'cat' ? '(+)' : s.nature === 'hung' ? '(-)' : '(~)';
            saoList.push(entry);
        });

        const key = `${p.cungName} (${p.chiName})`;
        const value = {
            sao: saoList,
            rating: p.rating
        };

        // Thêm info đặc biệt nếu có
        if (p.voChinhDieu) value.voChinhDieu = true;
        if (p.tuanTriet) value.tuanTriet = p.tuanTriet.tuan ? 'Tuần' : 'Triệt';
        if (p.combos && p.combos.length > 0) {
            value.combos = p.combos.map(c => `${c.name} (${c.stars.join('+')}): ${c.nature}`);
        }
        if (p.isHourDependent) value.phuThuocGio = true;

        cungData[key] = value;
    });

    // Tứ Hoá gốc
    const tuHoaInfo = {};
    if (data.vanHan && data.vanHan.luuTuHoa) {
        Object.entries(data.vanHan.luuTuHoa).forEach(([key, val]) => {
            tuHoaInfo[key] = val;
        });
    }

    // Vận Hạn
    let vanHanInfo = null;
    if (data.vanHan) {
        const vh = data.vanHan;
        vanHanInfo = {};

        if (vh.daiVan) {
            vanHanInfo.daiVan = `${vh.daiVan.cungName} (${vh.daiVan.chiName}), tuổi ${vh.daiVan.tuoiFrom}-${vh.daiVan.tuoiTo}`;
            if (vh.daiVan.chinhTinh && vh.daiVan.chinhTinh.length > 0) {
                vanHanInfo.daiVan += ', chính tinh: ' + vh.daiVan.chinhTinh.map(s => s.name + (s.hoa ? `(${s.hoa})` : '')).join(', ');
            }
        }

        if (vh.tieuVan) {
            vanHanInfo.tieuVan = `${vh.tieuVan.cungName} (${vh.tieuVan.chiName}), ${vh.tieuVan.tuoi} tuổi`;
        }

        // Lưu Niên Analysis summary
        if (vh.luuNienAnalysis) {
            const ln = vh.luuNienAnalysis;

            // Lưu Tứ Hóa
            if (ln.luuTuHoa && ln.luuTuHoa.length > 0) {
                vanHanInfo.luuTuHoa = ln.luuTuHoa.map(h =>
                    `${h.hoaName}: ${h.saoName} → ${h.cungName}`
                );
            }

            // Hung tinh overlay
            if (ln.hungTinhOverlay && ln.hungTinhOverlay.length > 0) {
                vanHanInfo.hungTinh = ln.hungTinhOverlay.map(a =>
                    `${a.cungName} (${a.severity}): ${[...a.hungGoc, ...a.hungLuu].join(', ')}${a.hasLuuHoaKy ? ' +Lưu Hóa Kỵ' : ''}`
                );
            }

            // Thái Tuế
            if (ln.thaiTue) {
                vanHanInfo.thaiTue = `${ln.thaiTue.taiTueCung} (${ln.thaiTue.taiTueChiName})`;
                if (ln.thaiTue.cungGiai) vanHanInfo.thaiTueGiai = ln.thaiTue.cungGiai;
            }

            // Energy Score
            if (ln.energyScore) {
                vanHanInfo.nangLuong = {
                    taiChinh: ln.energyScore.taiChinh.score,
                    sucKhoe: ln.energyScore.sucKhoe.score,
                    tinhCam: ln.energyScore.tinhCam.score,
                    tongHop: ln.energyScore.overall
                };
            }

            // Nguyệt hạn tóm tắt (chỉ gửi tháng tốt/xấu nhất)
            if (ln.nguyetHan && ln.nguyetHan.length > 0) {
                const sorted = [...ln.nguyetHan].sort((a, b) => b.energy - a.energy);
                vanHanInfo.thangTot = sorted.slice(0, 2).map(m => `T${m.thang}: ${m.cungName} (${m.energy}/100)`);
                vanHanInfo.thangXau = sorted.slice(-2).reverse().map(m => `T${m.thang}: ${m.cungName} (${m.energy}/100)`);
            }
        }

        // Events
        if (vh.events && vh.events.length > 0) {
            vanHanInfo.suKien = vh.events.map(e =>
                `${e.severityInfo?.icon || ''} ${e.title} (${e.severity}, score ${e.combinedScore}) tại ${e.palace}`
            );
        }

        // Patterns
        if (vh.patterns && vh.patterns.length > 0) {
            vanHanInfo.boSao = vh.patterns.map(p =>
                `${p.patternName} tại ${p.cungName}: ${p.effect}`
            );
        }
    }

    // Specials
    const dacBiet = (data.specials || []).map(s => `${s.title}: ${s.content}`);

    return {
        gioiTinh: ov.gioiTinh === 'nam' ? 'Nam' : 'Nữ',
        amDuong: ov.amDuong,
        thuan: ov.thuan,
        menh: `${ov.menhNapAm} (${ov.hanhMenh})`,
        cuc: `${ov.cucName} (${ov.hanhCuc})`,
        chuMenh: ov.chuMenh,
        chuThan: ov.chuThan,
        namXem: data.yearView,
        cung: cungData,
        dacBiet: dacBiet.length > 0 ? dacBiet : undefined,
        vanHan: vanHanInfo
    };
}

/**
 * Build prompt system instruction v3
 * Chi tiết hơn, thêm so sánh năm trước
 */
function buildPrompt(data) {
    const compactData = buildCompactData(data);
    const namXem = data.yearView || new Date().getFullYear();
    const namTruoc = namXem - 1;

    // Thêm data năm trước nếu có
    let prevYearSection = '';
    if (data.prevYear) {
        prevYearSection = `\n\n## DATA NĂM TRƯỚC (${namTruoc}) ĐỂ SO SÁNH ỨNG SỐ:\n\`\`\`json\n${JSON.stringify(data.prevYear, null, 1)}\n\`\`\``;
    }

    const systemInstruction = `Bạn là chuyên gia Tử Vi Đẩu Số hàng đầu Việt Nam, có 30+ năm kinh nghiệm luận giải. Bạn nổi tiếng với lối phân tích SẮC SẢO, THỰC TẾ, không nói chung chung.

## NHIỆM VỤ:
Phân tích CHI TIẾT lá số Tử Vi dưới đây. Data JSON là KẾT QUẢ TÍNH TOÁN CHÍNH XÁC từ hệ thống, bao gồm 12 cung với vị trí sao thật, tứ hoá, miếu/vượng/đắc/hãm, vận hạn, energy score.

## PHƯƠNG PHÁP LUẬN GIẢI (tuân thủ chặt):
1. **Tam Hợp**: Xem xét 3 cung tam hợp (Mệnh-Tài-Quan, Phụ Mẫu-Tật Ách-Nô Bộc, Huynh Đệ-Thiên Di-Điền Trạch, Phu Thê-Tử Tức-Phúc Đức) để đánh giá tổng thể mỗi lĩnh vực.
2. **Xung Chiếu**: Cung đối diện ảnh hưởng trực tiếp. Ví dụ: Mệnh ↔ Thiên Di, Tài ↔ Phúc.
3. **Tứ Hoá Xuyên Cung**: Hoá Lộc/Kỵ rơi vào cung nào → ảnh hưởng cung đó. Đặc biệt Lưu Hoá Kỵ.
4. **Miếu/Hãm**: Sao miếu/vượng phát huy tối đa, sao hãm giảm lực hoặc phản tác dụng.
5. **Tuần/Triệt**: Sao bị Tuần giảm lực, bị Triệt triệt tiêu.
6. **Vô Chính Diệu**: Cung VCĐ cần xem tam hợp + xung chiếu để đánh giá.
7. **Ứng số năm trước**: Nếu có data năm ${namTruoc}, so sánh xem vận hạn năm trước có ứng nghiệm gì không → dự đoán xu hướng năm ${namXem}.

## QUY TẮC BẮT BUỘC:
1. Dùng danh xưng "Đương số". KHÔNG nhắc tên.
2. KHÔNG liệt kê lại tên sao — người dùng đã thấy trên giao diện lá số.
3. Mỗi cung viết **4-6 câu**. Phải gồm: (a) Đặc điểm chính, (b) Ảnh hưởng thực tế, (c) Lời khuyên cụ thể.
4. KHÔNG lặp thông tin giữa các cung. Mỗi cung tập trung điểm ĐẶC TRƯNG NHẤT.
5. Chú ý đặc biệt: hung tinh overlay, Song Kỵ, Song Lộc, bộ sao cách cục đặc biệt.
6. Phong cách: điềm đạm, sắc sảo, đi thẳng vào vấn đề. Không sáo rỗng. KHÔNG nói "nhìn chung", "nói chung".
7. Phải đề cập rõ ảnh hưởng CỤ THỂ tới công việc/tiền bạc/sức khỏe/tình cảm — đây là điều người xem quan tâm nhất.

## FORMAT OUTPUT:
Chia bài bằng "---". Cấu trúc:

1. TỔNG QUAN (5-7 câu: tóm tắt vận mệnh, đặc trưng lá số, thế mạnh/yếu điểm nổi bật)
---
[MỆNH] 4-6 câu
---
[PHỤ MẪU] 4-6 câu
---
[PHÚC ĐỨC] 4-6 câu
---
[ĐIỀN TRẠCH] 4-6 câu
---
[QUAN LỘC] 4-6 câu
---
[NÔ BỘC] 4-6 câu
---
[THIÊN DI] 4-6 câu
---
[TẬT ÁCH] 4-6 câu
---
[TÀI BẠCH] 4-6 câu
---
[TỬ TỨC] 4-6 câu
---
[PHU THÊ] 4-6 câu
---
[HUYNH ĐỆ] 4-6 câu
---
VẬN HẠN NĂM ${namXem} (5-8 câu: đại vận + tiểu vận + lưu niên + energy. Nếu có data năm ${namTruoc}, mở đầu bằng 1-2 câu SO SÁNH với năm trước)
---
LỜI KHUYÊN (5-7 câu: thiết thực, cụ thể theo từng lĩnh vực: sự nghiệp, tài chính, sức khỏe, tình cảm)

KHÔNG viết "Phần 1:", "Phần 2:".
Viết bằng Tiếng Việt.`;

    return systemInstruction + '\n\n## DATA LÁ SỐ NĂM ' + namXem + ' (JSON):\n```json\n' + JSON.stringify(compactData, null, 1) + '\n```' + prevYearSection;
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

        console.log('[GEMINI] Generating AI interpretation (v2 compact)...');

        // Build prompt
        const prompt = buildPrompt(interpretationData);

        // Log prompt size for monitoring
        console.log(`[GEMINI] Prompt size: ${prompt.length} chars (${Math.round(prompt.length / 4)} est. tokens)`);

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
                let waitSec = 10 * (attempt + 1);
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

        const responseData = await response.json();
        const text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error('[GEMINI] Empty response');
            return { error: 'Không nhận được phản hồi', fallback: true };
        }

        // Log usage stats
        const usage = responseData?.usageMetadata;
        if (usage) {
            console.log(`[GEMINI] Tokens: prompt=${usage.promptTokenCount}, response=${usage.candidatesTokenCount}, total=${usage.totalTokenCount}`);
        }

        // Parse AI response
        const aiResult = parseAiResponse(text);

        // Cache result (30 ngày = 720h)
        db.setAiCache(cacheKey, JSON.stringify(aiResult), 720);

        console.log('[GEMINI] AI interpretation generated and cached');
        return aiResult;

    } catch (err) {
        console.error('[GEMINI] Error:', err.message);
        return { error: err.message, fallback: true };
    }
}

/**
 * Parse AI response thành structured data
 * Hỗ trợ cả format mới (per-palace [CUNG_NAME]) và format cũ (8 sections)
 */
function parseAiResponse(text) {
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
        sections: [],
        palaceSections: {},
        raw: text
    };

    let overviewSections = [];
    let hasPalaceFormat = false;

    sections.forEach((section) => {
        let content = section
            .replace(/\*\*/g, '')
            .replace(/^\s*(PHẦN|PHAN)\s*\d+[:.]?\s*/i, '')
            .replace(/^\d+[:.]?\s*/gm, '')
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
            let title = overviewTitles[i] || `Phân Tích ${i + 1}`;
            let icon = overviewIcons[i] || '📌';

            if (content.toLowerCase().includes('vận hạn') || content.toLowerCase().includes('năm ')) {
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
