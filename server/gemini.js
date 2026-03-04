/**
 * ============================================
 * GEMINI.JS - Gemini AI Integration v2
 * Hướng 2: Gửi compact raw data → AI tự luận giải
 * Không dùng template cứng, AI đọc tổ hợp sao thật
 * ============================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('[GEMINI] ⚠️ GEMINI_API_KEY chưa được cấu hình! AI interpretation sẽ không hoạt động.');
}

/**
 * Prompt version — tăng khi thay đổi prompt format/structure
 * Cache cũ sẽ tự động bị miss khi version thay đổi
 */
const PROMPT_VERSION = 'v11.0';

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
        promptVersion: PROMPT_VERSION,
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
    const HUNG_TINH_NANG = ['Kình Dương', 'Đà La', 'Hoả Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];

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

        // Trọng số cung: đếm yếu tố nặng
        let heavyCount = 0;
        (p.phuTinh || []).forEach(s => {
            if (HUNG_TINH_NANG.includes(s.name)) heavyCount++;
            if (s.hoa === 'Kỵ') heavyCount++;
            if (s.luuHoa === 'Kỵ') heavyCount++;
        });
        (p.chinhTinh || []).forEach(s => {
            if (s.hoa === 'Kỵ') heavyCount++;
            if (s.luuHoa === 'Kỵ') heavyCount++;
        });
        if (p.tuanTriet && p.tuanTriet.triet) heavyCount++;
        if (heavyCount >= 3) value.weight = 'HEAVY';

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

            // Nguyệt hạn 12 tháng (gửi đầy đủ thay vì chỉ top/bottom)
            if (ln.nguyetHan && ln.nguyetHan.length > 0) {
                vanHanInfo.nguyetHan = ln.nguyetHan.map(m => ({
                    t: m.thang,
                    cung: m.cungName,
                    e: m.energy,
                    lv: m.level,
                    ky: m.hasHoaKy || false
                }));
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

        // Đại Vận Tứ Hóa (Giai đoạn 3 - Trung Châu Phái)
        if (vh.luuNienAnalysis && vh.luuNienAnalysis.daiVanTuHoa) {
            const dvth = vh.luuNienAnalysis.daiVanTuHoa;
            vanHanInfo.daiVanTuHoa = {
                canDaiVan: dvth.canDaiVan,
                tuHoa: dvth.items.map(i =>
                    `ĐV ${i.hoaName}: ${i.saoName} → ${i.cungName}`
                )
            };
            // Kỵ trùng phùng cảnh báo
            if (dvth.kyTrungPhung) {
                vanHanInfo.kyTrungPhung = dvth.kyTrungPhung.description;
            }
        }
    }

    // Specials
    const dacBiet = (data.specials || []).map(s => `${s.title}: ${s.content}`);

    // 3 năm trước (tóm tắt điểm nhấn)
    let ungSo3NamTruoc = undefined;
    if (data.prevYears && data.prevYears.length > 0) {
        ungSo3NamTruoc = data.prevYears.map(s => ({
            nam: s.nam,
            daiVan: s.daiVan ? s.daiVan.cungName : null,
            tieuVan: s.tieuVan ? s.tieuVan.cungName : null,
            nangLuong: s.nangLuong ? s.nangLuong.tongHop : null,
            suKien: s.suKien ? s.suKien.slice(0, 3) : null,
            rating: s.rating || null
        }));
    }

    // === HINTS CHO 4 NGÁCH CHUYÊN SÂU ===
    // (Data sao đã có đầy đủ trong `cung`, chỉ bổ sung thông tin chưa có)
    const dienTrachPalace = palaces.find(p => p.cungName === 'ĐIỀN TRẠCH');

    return {
        gioiTinh: ov.gioiTinh === 'nam' ? 'Nam' : 'Nữ',
        amDuong: ov.amDuong,
        thuan: ov.thuan,
        menh: `${ov.menhNapAm} (${ov.hanhMenh})`,
        cuc: `${ov.cucName} (${ov.hanhCuc})`,
        chuMenh: ov.chuMenh,
        chuThan: ov.chuThan,
        namXem: data.yearView,
        tinhHeMenh: data.tinhHeMenh || undefined,
        cung: cungData,
        dacBiet: dacBiet.length > 0 ? dacBiet : undefined,
        vanHan: vanHanInfo,
        ungSo3NamTruoc: ungSo3NamTruoc,
        // Hints bổ sung (info chưa có trong cung)
        hanhMenh: ov.hanhMenh || null,
        chiDienTrach: dienTrachPalace ? dienTrachPalace.chiName : null
    };
}

/**
 * Build prompt system instruction v8 (Loaded from file)
 */
function buildPrompt(data) {
    const compactData = buildCompactData(data);
    const namXem = data.yearView || new Date().getFullYear();

    let systemInstruction = '';
    try {
        const promptPath = path.join(__dirname, 'prompts', 'tuvi_system.v11.prompt');
        systemInstruction = fs.readFileSync(promptPath, 'utf8');

        // Replace placeholders
        systemInstruction = systemInstruction.replace(/{{namXem}}/g, namXem);

    } catch (err) {
        console.error('[GEMINI] Failed to read system prompt file:', err.message);
        systemInstruction = 'Bạn là chuyên gia Tử Vi. Hãy phân tích dữ liệu JSON sau:';
    }

    return systemInstruction + '\n\n## DATA LÁ SỐ NĂM ' + namXem + ' (JSON):\n```json\n' + JSON.stringify(compactData, null, 1) + '\n```';
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
                maxOutputTokens: 24576,
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
 * Hỗ trợ: [CUNG_NAME] brackets, plain text header, markdown ###
 */
function parseAiResponse(text) {
    const PALACE_NAMES = ['MỆNH', 'HUYNH ĐỆ', 'PHU THÊ', 'TỬ TỨC', 'TÀI BẠCH', 'TẬT ÁCH',
        'THIÊN DI', 'NÔ BỘC', 'QUAN LỘC', 'ĐIỀN TRẠCH', 'PHÚC ĐỨC', 'PHỤ MẪU'];

    // Các section đặc biệt (không phải cung) — v7.0: gộp CON CÁI/PHỐI NGẪU/MỘ PHẦN vào 12 cung
    const SPECIAL_SECTIONS = [
        { keywords: ['TỔNG QUAN'], title: 'Tổng Quan Lá Số', icon: '⭐' },
        { keywords: ['ĐẠI VẬN HIỆN TẠI', 'ĐẠI VẬN'], title: 'Đại Vận Hiện Tại', icon: '🔄' },
        { keywords: ['ỨNG SỐ', 'ỨNG NGHIỆM', '3 NĂM TRƯỚC', 'NĂM TRƯỚC'], title: 'Ứng Số Các Năm Trước', icon: '📊' },
        { keywords: ['TIỂU HẠN', 'TIỂU VẬN'], title: 'Tiểu Hạn Năm', icon: '📅' },
        { keywords: ['LỜI KHUYÊN'], title: 'Lời Khuyên Tổng Hợp', icon: '💡' },
        { keywords: ['VẬN HẠN NĂM'], title: 'Vận Hạn Năm', icon: '📅' },
        { keywords: ['LỘ TRÌNH TU TÂM', 'TU TÂM'], title: 'Lộ Trình Tu Tâm', icon: '🧘' }
    ];

    let processedText = text;

    // Tự động thêm --- trước mỗi [CUNG] hoặc heading ### nếu chưa có
    PALACE_NAMES.forEach(pName => {
        const escaped = pName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match [CUNG_NAME] hoặc 1. [CUNG_NAME] hoặc **[CUNG_NAME]**
        const regBracket = new RegExp('([^\\-])\\s*((?:\\d+\\.?\\s*)?\\*?\\*?\\[(' + escaped + ')\\]\\*?\\*?)', 'gi');
        processedText = processedText.replace(regBracket, '$1\n---\n$2');
        // Match ### heading (#### 1. Cung MỆNH, ### Cung MỆNH, ### 🏛️ MỆNH, etc.)
        const regHeading = new RegExp('([^\\-])\\s*(#+\\s*(?:\\d+\\.?\\s*)?(?:Cung\\s+)?(?:🏛️\\s*)?' + escaped + ')', 'gi');
        processedText = processedText.replace(regHeading, '$1\n---\n$2');
    });

    // Thêm --- trước các special section headings
    SPECIAL_SECTIONS.forEach(spec => {
        spec.keywords.forEach(kw => {
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regHeading = new RegExp('([^\\-])\\s*(#+\\s*(?:[🔮⭐📊📅💡🔄🏛️🙏]*\\s*)?' + escaped + ')', 'gi');
            processedText = processedText.replace(regHeading, '$1\n---\n$2');
        });
    });

    const sections = processedText.split('---').map(s => s.trim()).filter(s => s.length > 0);

    const result = {
        sections: [],
        palaceSections: {},
        raw: text
    };

    sections.forEach((section) => {
        let content = section
            .replace(/\*\*/g, '')
            .replace(/^\s*(PHẦN|PHAN)\s*\d+[:.]\s*/i, '')
            .trim();

        // === Try match PALACE (cung) ===
        let matchedPalace = null;
        for (let i = 0; i < PALACE_NAMES.length; i++) {
            const pName = PALACE_NAMES[i];
            const escaped = pName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Pattern 1: [CUNG_NAME] hoặc **[CUNG_NAME]**
            const regBracket = new RegExp('^\\s*(?:\\d+\\.?\\s*)?\\*?\\*?\\[(' + escaped + ')\\]\\*?\\*?\\s*[:\\-]?\\s*', 'i');
            // Pattern 2: ### Cung CUNG_NAME hoặc #### 1. Cung CUNG_NAME hoặc ### 🏛️ CUNG_NAME
            const regHeading = new RegExp('^\\s*#{1,4}\\s*(?:\\d+\\.?\\s*)?(?:Cung\\s+)?(?:🏛️\\s*)?' + escaped + '\\s*$', 'im');
            // Pattern 3: Chỉ CUNG_NAME ở đầu dòng (all caps, không phải inline)
            const regPlain = new RegExp('^\\s*(?:\\d+\\.?\\s*)?' + escaped + '\\s+(Cung|Đây|Tại|Mặc|Với|Không|Có|Cuộc|Sự|Đương|Nhìn|Tính)', 'i');

            if (regBracket.test(content)) {
                matchedPalace = pName;
                content = content.replace(regBracket, '').trim();
                break;
            }
            if (regHeading.test(content)) {
                matchedPalace = pName;
                content = content.replace(regHeading, '').trim();
                break;
            }
            if (regPlain.test(content)) {
                matchedPalace = pName;
                content = content.replace(new RegExp('^\\s*' + escaped + '\\s+', 'i'), '').trim();
                break;
            }
        }

        if (matchedPalace) {
            content = content
                .replace(/^(LUẬN GIẢI|PHÂN TÍCH)\s*(CUNG)?\s*/i, '')
                .replace(/^#+\s*/gm, '') // Strip remaining headers
                .trim();
            result.palaceSections[matchedPalace] = content;
            return;
        }

        // === Try match SPECIAL section ===
        let matchedSpecial = null;
        for (let i = 0; i < SPECIAL_SECTIONS.length; i++) {
            const spec = SPECIAL_SECTIONS[i];
            for (let j = 0; j < spec.keywords.length; j++) {
                const kw = spec.keywords[j];
                const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regKw = new RegExp('(^|\\n)\\s*#{0,4}\\s*(?:[🔮⭐📊📅💡🔄📋🏛️🙏]*\\s*)?' + escaped, 'i');
                if (regKw.test(content)) {
                    matchedSpecial = spec;
                    // Strip the heading line
                    content = content.replace(new RegExp('^\\s*#{0,4}\\s*(?:[🔮⭐📊📅💡🔄📋🏛️🙏]*\\s*)?' + escaped + '[^\\n]*\\n?', 'i'), '').trim();
                    break;
                }
            }
            if (matchedSpecial) break;
        }

        if (matchedSpecial) {
            content = content.replace(/^#+\s*/gm, '').trim();
            result.sections.push({
                title: matchedSpecial.title,
                icon: matchedSpecial.icon,
                content: content
            });
            return;
        }

        // === Unmatched section: infer from content ===
        let title = 'Phân Tích';
        let icon = '📌';

        const contentLower = content.toLowerCase();
        if (contentLower.includes('tổng quan') || contentLower.includes('lá số này')) {
            title = 'Tổng Quan Lá Số'; icon = '⭐';
        } else if (contentLower.includes('đại vận')) {
            title = 'Đại Vận Hiện Tại'; icon = '🔄';
        } else if (contentLower.includes('lời khuyên') || contentLower.includes('khuyên đương số')) {
            title = 'Lời Khuyên Tổng Hợp'; icon = '💡';
        } else if (contentLower.includes('tiểu hạn') || contentLower.includes('tháng')) {
            title = 'Tiểu Hạn Năm'; icon = '📅';
        } else if (contentLower.includes('ứng số') || contentLower.includes('năm trước')) {
            title = 'Ứng Số Các Năm Trước'; icon = '📊';
        } else if (contentLower.includes('vận hạn')) {
            title = 'Vận Hạn Năm'; icon = '📅';
        } else if (contentLower.includes('hóa giải') || contentLower.includes('tu tâm')) {
            title = 'Hóa Giải & Tu Tâm'; icon = '🙏';
        }

        content = content
            .replace(/^(TỔNG QUAN[^\n]*|VẬN HẠN[^\n]*|LỜI KHUYÊN[^\n]*|ĐẠI VẬN[^\n]*|ỨNG SỐ[^\n]*|TIỂU HẠN[^\n]*)\n?/i, '')
            .replace(/^#+\s*/gm, '')
            .trim();

        if (content.length > 20) {
            result.sections.push({ title, icon, content });
        }
    });

    if (result.sections.length === 0 && Object.keys(result.palaceSections).length === 0) {
        result.sections.push({ title: 'Phân Tích AI', icon: '🤖', content: text });
    }

    return result;
}

module.exports = {
    generateAiInterpretation
};
