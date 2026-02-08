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
        yearView: data.yearView, // Phân tích theo năm nên cần giữ năm xem
        cuc: ov.cucName,
        menh: ov.menhNapAm,
        cungMenh: ov.cungMenhPos,
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
 * Build prompt cho Gemini
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

    return `Bạn là chuyên gia Tử Vi Đẩu Số hàng đầu Việt Nam. Hãy phân tích tổng hợp lá số sau một cách chuyên sâu.
LƯU Ý QUAN TRỌNG: Hãy sử dụng danh xưng "Đương số" xuyên suốt bài viết, KHÔNG nhắc đến tên riêng cụ thể của người xem để đảm bảo tính khách quan.

## THÔNG TIN LÁ SỐ:
- Giới tính: ${ov.gioiTinh === 'nam' ? 'Nam' : 'Nữ'}
- Giờ sinh: ${data.hour || 'Không xác định'}
- Âm Dương: ${ov.amDuong} (${ov.thuan ? 'Thuận hành' : 'Nghịch hành'})
- Mệnh: ${ov.menhNapAm} (Hành ${ov.hanhMenh})
- Cục: ${ov.cucName} (Hành ${ov.hanhCuc})
- Chủ Mệnh: ${ov.chuMenh} | Chủ Thân: ${ov.chuThan}

## CHI TIẾT 12 CUNG (đã kèm diễn giải cơ bản của từng sao):
${palaceInfo}

## ĐẶC BIỆT:
${specialInfo || 'Không có điều kiện đặc biệt'}

## YÊU CẦU:
Dựa trên thông tin chi tiết từng sao trong từng cung ở trên, hãy viết bài phân tích tổng hợp chuyên sâu. Giải thích ý nghĩa thực tiễn, không dùng thuật ngữ khó hiểu. Cấu trúc:

1. **TỔNG QUAN VẬN MỆNH** (3-5 câu): Nhận xét tổng quát, điểm mạnh/yếu nổi bật
2. **LUẬN GIẢI GIỜ SINH** (3-4 câu): Phân tích tầm quan trọng của giờ sinh đối với lá số này. Nêu rõ các đặc điểm tính cách hoặc vận hạn bị ảnh hưởng mạnh bởi giờ sinh (như vị trí Mệnh/Thân). Lưu ý người xem nếu giờ sinh không chính xác thì phần này và toàn bộ lá số sẽ thay đổi.
3. **TÍNH CÁCH & CON NGƯỜI** (3-5 câu): Tính cách, phong thái, điểm đặc biệt
4. **SỰ NGHIỆP & TÀI CHÍNH** (3-5 câu): Hướng nghề nghiệp phù hợp, tiềm năng tài chính
5. **TÌNH DUYÊN & GIA ĐÌNH** (3-5 câu): Đường tình cảm, gia đình, con cái
6. **SỨC KHỎE** (2-3 câu): Điểm cần lưu ý về sức khỏe
7. **LỜI KHUYÊN** (3-4 câu): Lời khuyên thiết thực, cụ thể

Mỗi phần viết chi tiết, dễ hiểu. KHÔNG dùng markdown header. Mỗi phần cách nhau bởi "---".
Viết bằng Tiếng Việt.`;
}

/**
 * Parse AI response thành structured data
 */
function parseAiResponse(text) {
    const sections = text.split('---').map(s => s.trim()).filter(s => s.length > 0);

    const titles = [
        'Tổng Quan Vận Mệnh',
        'Luận Giải Giờ Sinh',
        'Tính Cách & Con Người',
        'Sự Nghiệp & Tài Chính',
        'Tình Duyên & Gia Đình',
        'Sức Khỏe',
        'Lời Khuyên'
    ];

    const icons = ['🌟', '⏰', '👤', '💼', '💕', '🏥', '💡'];

    const result = {
        sections: [],
        raw: text
    };

    sections.forEach((section, i) => {
        // Remove bold markers, numbering
        let content = section
            .replace(/\*\*/g, '')
            .replace(/^\d+\.\s*/gm, '')
            .replace(/^(TỔNG QUAN VẬN MỆNH|LUẬN GIẢI GIỜ SINH|TÍNH CÁCH.*|SỰ NGHIỆP.*|TÌNH DUYÊN.*|SỨC KHỎE|LỜI KHUYÊN):?\s*/i, '')
            .trim();

        result.sections.push({
            title: titles[i] || `Phần ${i + 1}`,
            icon: icons[i] || '📌',
            content: content
        });
    });

    // If parsing failed, return raw
    if (result.sections.length === 0) {
        result.sections.push({
            title: 'Phân Tích AI',
            icon: '🤖',
            content: text
        });
    }

    return result;
}

module.exports = {
    generateAiInterpretation
};
