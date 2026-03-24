/**
 * ============================================
 * ORCHESTRATOR - Module Soi Bài 52 Lá
 * ============================================
 */

const { drawCards } = require('./cardDeck');
const { getCardMeaning, getNguHanh, checkCompatibility } = require('./decodingTable');
const { fullScan } = require('./scannerEngine');
const { detectCombos } = require('./comboDetector');
const { generateRemedies } = require('./remedySuggestion');

/**
 * Lấy Khóa Năm hiện tại (Annual Time-Lock)
 */
function getCurrentYearLock() {
    const currentYear = new Date().getFullYear();
    return { name: `Năm ${currentYear}`, period: `01/01/${currentYear} - 31/12/${currentYear}` };
}

/**
 * Lấy Khóa Tháng
 */
function getCurrentMonthLock() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const lastDay = new Date(year, month, 0).getDate();
    return { name: `Tháng ${month}/${year}`, period: `01/${month}/${year} - ${lastDay}/${month}/${year}` };
}

/**
 * Lấy Khóa Ngày
 */
function getCurrentDayLock() {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return { name: `Ngày ${day}/${month}/${year}`, period: `00:00 - 23:59 (${day}/${month}/${year})` };
}

function getTopicHint(topic) {
    if (topic === 'entity') {
        return "Năng lượng Vong Linh & Thực Thể thường lưu động theo Tháng. Quẻ này đã được khóa trong trọn 1 Tháng. Nếu gieo lại trong tháng này, kết quả sẽ không đổi để đảm bảo tính nhất quán của Thánh Ý.";
    } else if (topic === 'opportunity') {
        return "Cơ hội Mua Bán hoặc Cát Hung biến ảo theo Ngày. Quẻ này đã được khóa cứng cho hôm nay. Bất kể bạn gieo lại bao nhiêu lần trong ngày, hệ thống vẫn giữ nguyên 1 quẻ hợp duyên nhất với bạn.";
    } else {
        return "Năng lượng đất trạch/mồ mả có tính Tĩnh. Quẻ soi cát hung thường chỉ có giá trị biến chuyển trong vòng 1 năm. Máy chủ đã 'Khóa Quẻ' theo định luật này. Trong suốt năm nay, nếu gieo lại bạn vẫn chỉ nhận duy nhất 1 quẻ bài tương ứng.";
    }
}

function performSoiBai(options = {}) {
    const { count: drawCount, name, year, gender, topic } = options;
    const count = drawCount || parseInt(process.env.CARD_DRAW_COUNT) || 9;
    
    // --- 1. Tạo Time-Lock Seed ---
    let currentTimeLock;
    if (topic === 'entity') currentTimeLock = getCurrentMonthLock();
    else if (topic === 'opportunity') currentTimeLock = getCurrentDayLock();
    else currentTimeLock = getCurrentYearLock();
    const cleanName = (name || 'Anonymous').trim().toLowerCase();
    const cleanYear = year || 'Unknown';
    const cleanGender = gender || 'Unknown';
    
    // Khóa Quẻ: Chuỗi Seed Hash
    const seedString = `${cleanName}-${cleanYear}-${cleanGender}-${currentTimeLock.name}`;
    
    // Rút thẻ
    const cards = drawCards(count, seedString);
    
    // Add meaning to each card
    const cardsWithMeaning = cards.map(c => ({
        ...c,
        interpretation: getCardMeaning(c)
    }));

    // Perform analysis
    const analysis = fullScan(cards);
    const combos = detectCombos(cards);
    const remedies = generateRemedies(cards, combos, analysis);

    // Personal Compatibility Analysis
    let compatibility = null;
    if (year) {
        const personElement = getNguHanh(parseInt(year));
        
        // Find dominant element in cards
        const elementCounts = {};
        cards.forEach(c => {
            elementCounts[c.element] = (elementCounts[c.element] || 0) + 1;
        });
        
        // Get the most frequent element
        const dominantElement = Object.entries(elementCounts).sort((a, b) => b[1] - a[1])[0][0];
        const compResult = checkCompatibility(personElement, dominantElement);
        
        compatibility = {
            person_name: name || 'Ẩn danh',
            person_element: personElement,
            land_dominant_element: dominantElement,
            result_type: compResult.type,
            description: compResult.text
        };

        // Special check for Gender Mapping (FR from thinking)
        const luckyCard = gender === 'nu' ? 'Q' : 'K';
        const hasIdentityCard = cards.some(c => c.rank === luckyCard);
        if (hasIdentityCard) {
            remedies.push(`Đã tìm thấy lá bài đại diện cho ${gender === 'nu' ? 'Nữ chủ (Q)' : 'Nam chủ (K)'}, báo hiệu cơ duyên của bạn với mảnh đất rất gần.`);
        }
    }

    // Calculate overall verdict
    let verdict = 'Trung bình';
    let overallScore = 0;
    Object.values(analysis).forEach(m => overallScore += m.score);

    if (overallScore > 30) verdict = 'Đại Cát (Đất cực lành)';
    else if (overallScore > 10) verdict = 'Cát (Đất tốt)';
    else if (overallScore < -20) verdict = 'Hung (Âm khí nặng)';
    else if (overallScore < 0) verdict = 'Bất lợi (Đất nghịch)';

    return {
        timestamp: new Date().toISOString(),
        user_info: { name, year, gender },
        authentication: {
            seed_hash: seedString,
            time_lock: `${currentTimeLock.name} (${currentTimeLock.period})`,
            is_time_locked: true,
            hint: getTopicHint(topic)
        },
        cards_drawn: cardsWithMeaning,
        scan_summary: {
            verdict: verdict,
            overall_score: overallScore,
            confidence: 85
        },
        compatibility: compatibility,
        detailed_analysis: analysis,
        combos_detected: combos,
        remedy_suggestion: remedies
    };
}

module.exports = {
    performSoiBai,
    getCardMeaning
};
