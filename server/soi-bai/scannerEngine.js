/**
 * ============================================
 * SCANNER ENGINE - 4 Scanning Modes
 * ============================================
 */

function scanPhysicalSoil(cards) {
    const roCards = cards.filter(c => c.suit === 'Rô');
    const coCards = cards.filter(c => c.suit === 'Cơ');
    
    let dryMoistRatio = 0;
    roCards.forEach(c => dryMoistRatio += c.rankValue);
    coCards.forEach(c => dryMoistRatio -= (c.rankValue / 2));

    const verdict = dryMoistRatio > 10 ? 'Đất khô ráo, có nhiều đá tảng/kim loại bên dưới.' : 
                    dryMoistRatio < -5 ? 'Đất ẩm ướt, mạch nước ngầm dồi dào.' :
                    'Đất cân bằng giữa Kim (đá) và Thủy (nước).';

    return {
        title: 'Soi Địa Tầng (Physical Soil Scan)',
        icon: '🌍',
        results: [
            verdict,
            `Tìm thấy ${roCards.length} lá Kim (Rô) báo hiệu vật cứng hoặc đá tảng.`,
            `Tìm thấy ${coCards.length} lá Thủy (Cơ) báo hiệu mạch nước ngầm.`
        ],
        score: dryMoistRatio
    };
}

function scanAncestralGrave(cards) {
    const bichCards = cards.filter(c => c.suit === 'Bích');
    const chuonCards = cards.filter(c => c.suit === 'Chuồn');

    const totalWeight = (bichCards.length * 20) + (chuonCards.length * 10);
    
    let graveStatus = 'Thanh thản, mộ phần yên ổn.';
    if (totalWeight > 50) graveStatus = 'Mồ mả đang bị động mạnh, cần chú ý gốc rễ cây hoặc sụt lún.';
    else if (totalWeight > 25) graveStatus = 'Mồ mả ở mức trung bình, có chút huyên náo của âm khí.';

    return {
        title: 'Soi Mồ Mả & Hài Cốt (Ancestral Grave)',
        icon: '🕯️',
        results: [
            graveStatus,
            `Phát hiện ${bichCards.length} lá Âm (Bích) thể hiện sự tồn tại của mộ phần.`,
            `Phát hiện ${chuonCards.length} lá Mộc (Chuồn) thể hiện sự xâm lấn của rễ cây hoặc biến động đất đai.`
        ],
        score: totalWeight
    };
}

function scanEntityDetection(cards) {
    const headCards = cards.filter(c => ['J', 'Q', 'K'].includes(c.rank));
    
    let entitiesFound = [];
    headCards.forEach(c => {
        let name = '';
        if (c.rank === 'J') name = 'Lính/Vong tiền chủ';
        else if (c.rank === 'Q') name = 'Bà Cô Tổ/Nữ thần đất';
        else name = 'Thổ Địa/Thần Linh/Vua Đất';
        entitiesFound.push(`${name} (${c.suit})`);
    });

    const reaction = cards.filter(c => ['Cơ', 'Rô'].includes(c.suit)).length > 
                    cards.filter(c => ['Bích', 'Chuồn'].includes(c.suit)).length ? 
                    'Thái độ: Hoan hỉ, đồng thuận, ủng hộ gia chủ.' : 
                    'Thái độ: Nghiêm khắc, có phần quấy phá hoặc chưa bằng lòng.';

    return {
        title: 'Soi Thực Thể Tâm Linh (Entity Detection)',
        icon: '👻',
        results: [
            headCards.length > 0 ? `Đã phát hiện thực thể quản lý: ${entitiesFound.join(', ')}.` : 'Không thấy thực thể mạnh hiển lộ.',
            reaction
        ],
        score: headCards.length * 10
    };
}

function scanRiskOpportunity(cards) {
    const redCount = cards.filter(c => c.color === 'red').length;
    const blackCount = cards.filter(c => c.color === 'black').length;
    const aceCount = cards.filter(c => c.rank === 'A').length;

    let useCase = 'Đất ở trung bình.';
    if (redCount > blackCount + 2) useCase = 'Đất cực tốt để kinh doanh, buôn bán phát đạt.';
    else if (blackCount > redCount + 2) useCase = 'Đất nặng âm khí, chỉ hợp để thờ tự hoặc làm nhà kho, đình chùa.';
    else if (redCount > blackCount) useCase = 'Đất lành chim đậu, hợp để ở lâu dài, con cái thành đạt.';

    if (aceCount > 0) useCase += ` Có năng lượng Ace hiển thị (${aceCount} lá), mảnh đất này có gốc gác linh thiêng hoặc long mạch lớn.`;

    return {
        title: 'Dự báo Cát - Hung (Risk & Opportunity)',
        icon: '⚖️',
        results: [
            `Tỷ lệ Đỏ/Đen: ${redCount}/${blackCount}.`,
            useCase
        ],
        score: (redCount - blackCount) * 5 + (aceCount * 15)
    };
}

function fullScan(cards) {
    return {
        physicalSoil: scanPhysicalSoil(cards),
        ancestralGrave: scanAncestralGrave(cards),
        entityDetection: scanEntityDetection(cards),
        riskOpportunity: scanRiskOpportunity(cards)
    };
}

module.exports = {
    fullScan
};
