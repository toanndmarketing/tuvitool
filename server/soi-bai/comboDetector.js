/**
 * ============================================
 * COMBO DETECTOR - Pattern Matching
 * ============================================
 */

const COMBOS = [
    {
        id: 'dong-mo',
        name: 'Động Mộ',
        check: (cards) => {
            const hasSevenBich = cards.some(c => c.rank === '7' && c.suit === 'Bích');
            const hasChuon = cards.some(c => c.suit === 'Chuồn');
            return hasSevenBich && hasChuon;
        },
        description: 'Mồ mả đang trong tình trạng nguy cấp, có thể bị rễ cây xâm hại hoặc biến dạng.',
        severity: 'Cực kỳ nguy hiểm'
    },
    {
        id: 'dat-ket',
        name: 'Đất Kết (Long mạch)',
        check: (cards) => {
            const hasAceCo = cards.some(c => c.rank === 'A' && c.suit === 'Cơ');
            const hasAceRo = cards.some(c => c.rank === 'A' && c.suit === 'Rô');
            return hasAceCo && hasAceRo;
        },
        description: 'Đất long mạch cực hiếm, vượng phu ích tử, cầu tài lộc tất thành.',
        severity: 'Đại cát'
    },
    {
        id: 'tranh-chap',
        name: 'Tranh chấp Vong linh',
        check: (cards) => {
            const hasJBich = cards.some(c => c.rank === 'J' && c.suit === 'Bích');
            const hasSevenChuon = cards.some(c => c.rank === '7' && c.suit === 'Chuồn');
            return hasJBich && hasSevenChuon;
        },
        description: 'Có sự tranh giành chủ quyền tâm linh trên đất, âm dương hỗn loạn.',
        severity: 'Nguy hiểm trung bình'
    }
];

function detectCombos(cards) {
    const detected = [];
    COMBOS.forEach(combo => {
        if (combo.check(cards)) {
            detected.push({
                name: combo.name,
                description: combo.description,
                severity: combo.severity
            });
        }
    });
    return detected;
}

module.exports = {
    detectCombos
};
