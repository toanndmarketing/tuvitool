/**
 * ============================================
 * DECODING TABLE - Module Soi Bài 52 Lá
 * ============================================
 */

const SUIT_MEANINGS = {
    'Bích': {
        name: 'Bích (♠) - Âm Khí',
        keyword: 'Mồ mả, đất nghịch, âm khí cao',
        element: 'Thổ / Âm',
        description: 'Đại diện cho đất đai, mồ mả, năng lượng của những người đã khuất hoặc âm khí đang tồn tại.'
    },
    'Chuồn': {
        name: 'Chuồn (♣) - Biến Động',
        keyword: 'Rễ cây, sụt lún, tranh chấp',
        element: 'Mộc',
        description: 'Đại diện cho thực vật, rễ cây đâm sâu, hoặc các chuyển động cơ học ngầm dưới lòng đất.'
    },
    'Cơ': {
        name: 'Cơ (♥) - Sinh Khí',
        keyword: 'Mạch nước, sinh lực, đạo đức gia môn',
        element: 'Thủy',
        description: 'Đại diện cho mạch nước ngầm, độ ẩm, sinh khí và các mối quan hệ tình cảm của người sống trên đất.'
    },
    'Rô': {
        name: 'Rô (♦) - Tài Lộc',
        keyword: 'Vật cứng dưới đất, tiền bạc',
        element: 'Kim',
        description: 'Đại diện cho kim loại, đá tảng, phế tích cổ hoặc các giá trị vật chất tiềm ẩn dưới lòng đất.'
    }
};

const FACE_CARDS_MEANING = {
    'J-Bích': 'Vong lính gác mộ hoặc người quản gia đã khuất cực kỳ nghiêm khắc.',
    'Q-Bích': 'Bà cô tổ hoặc nữ vong linh cai quản khu vực này.',
    'K-Bích': 'Thổ địa hoặc vong nam tiền chủ có quyền năng cao.',
    'J-Chuồn': 'Rễ cây trẻ (tơ) đang phát triển mạnh, cần lưu ý tương lai.',
    'Q-Chuồn': 'Cây đại thụ mẹ, hệ rễ đã bao trùm diện rộng.',
    'K-Chuồn': 'Rừng rễ cây lâu năm, có thể đã đâm vào móng/mộ.',
    'J-Cơ': 'Mạch nước nhỏ hoặc dòng nước thay đổi theo mùa.',
    'Q-Cơ': 'Dòng sông ngầm hoặc hồ chứa nước bên dưới.',
    'K-Cơ': 'Long mạch chính đang tụ khí, cực tốt cho việc cầu tự.',
    'J-Rô': 'Phế tích kim loại vụn hoặc đá nhỏ rải rác.',
    'Q-Rô': 'Tài sản quý hoặc vật dụng giá trị của tiền nhân để lại.',
    'K-Rô': 'Mỏ khoáng sản hoặc nền móng cung điện/đền đài cổ.'
};

const ACE_MEANING = {
    'Bích': 'Huyệt mộ cổ lâu năm, năng lượng cực kỳ lạnh.',
    'Chuồn': 'Gốc cây tổ ngàn năm giữ linh khí cho vùng đất.',
    'Cơ': 'Dòng mạch nước thiêng, được ví như cam lộ.',
    'Rô': 'Vàng bạc, ngọc ngà tích tụ từ linh khí đất trời.'
};

/**
 * Tính Mệnh (Ngũ Hành) dựa trên năm sinh
 */
function getNguHanh(year) {
    const canWeights = { 
        'Giáp': 1, 'Ất': 1, 'Bính': 2, 'Đinh': 2, 
        'Mậu': 3, 'Kỷ': 3, 'Canh': 4, 'Tân': 4, 
        'Nhâm': 5, 'Quý': 5 
    };
    const chiWeights = { 
        'Tý': 0, 'Sửu': 0, 'Ngọ': 0, 'Mùi': 0,
        'Dần': 1, 'Mão': 1, 'Thân': 1, 'Dậu': 1,
        'Thìn': 2, 'Tỵ': 2, 'Tuất': 2, 'Hợi': 2
    };

    const canIndex = (year + 6) % 10;
    const chiIndex = (year + 8) % 12;
    const itemsCAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
    const itemsCHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

    const canVal = canWeights[itemsCAN[canIndex]];
    const chiVal = chiWeights[itemsCHI[chiIndex]];
    
    let sum = canVal + chiVal;
    if (sum > 5) sum -= 5;

    const nguHanhMap = { 1: 'Kim', 2: 'Thủy', 3: 'Hỏa', 4: 'Thổ', 5: 'Mộc' };
    return nguHanhMap[sum] || 'Thổ';
}

/**
 * Kiểm tra tương sinh tương khắc
 */
function checkCompatibility(personElement, landmarkElement) {
    // Map landmark elements to standard 5 elements
    const standardMap = {
        'Thổ / Âm': 'Thổ',
        'Mộc': 'Mộc',
        'Thủy': 'Thủy',
        'Kim': 'Kim'
    };
    const target = standardMap[landmarkElement] || landmarkElement;

    const relationships = {
        'Kim': { sinh: 'Thủy', khac: 'Mộc', duocSinh: 'Thổ', biKhac: 'Hỏa' },
        'Thủy': { sinh: 'Mộc', khac: 'Hỏa', duocSinh: 'Kim', biKhac: 'Thổ' },
        'Mộc': { sinh: 'Hỏa', khac: 'Thổ', duocSinh: 'Thủy', biKhac: 'Kim' },
        'Hỏa': { sinh: 'Thổ', khac: 'Kim', duocSinh: 'Mộc', biKhac: 'Thủy' },
        'Thổ': { sinh: 'Kim', khac: 'Thủy', duocSinh: 'Hỏa', biKhac: 'Mộc' }
    };

    const rel = relationships[personElement];
    if (target === personElement) return { type: 'Bình hòa', text: 'Đất và người đồng nhất năng lượng, sự nghiệp ổn định.' };
    if (target === rel.sinh) return { type: 'Tiết khí', text: 'Người nuôi dưỡng đất, vất vả nhưng có hậu.' };
    if (target === rel.khac) return { type: 'Chế khắc', text: 'Người làm chủ được đất, mọi việc theo ý mình.' };
    if (target === rel.duocSinh) return { type: 'Tương sinh', text: 'Đất nuôi dưỡng người, cực kỳ hưng vượng, sức khỏe dồi dào.' };
    if (target === rel.biKhac) return { type: 'Tương khắc', text: 'Đất khắc người, dễ hao tổn sinh lực, cần hóa giải.' };

    return { type: 'Trung tính', text: 'Năng lượng đất và người không xung đột.' };
}

function getCardMeaning(card) {
    const key = `${card.rank}-${card.suit}`;
    
    let meaning = '';
    if (['J', 'Q', 'K'].includes(card.rank)) {
        meaning = FACE_CARDS_MEANING[key];
    } else if (card.rank === 'A') {
        meaning = ACE_MEANING[card.suit];
    } else {
        const intensity = card.rankValue > 5 ? 'Sâu' : 'Nông';
        meaning = `${intensity} - Tác động vào ${SUIT_MEANINGS[card.suit].keyword.toLowerCase()}.`;
    }

    return {
        suitInfo: SUIT_MEANINGS[card.suit],
        meaning: meaning,
        depth: card.depthLayer
    };
}

module.exports = {
    SUIT_MEANINGS,
    getCardMeaning,
    getNguHanh,
    checkCompatibility
};
