/**
 * ============================================
 * REMEDY SUGGESTION - Matrix hóa giải
 * ============================================
 */

function generateRemedies(cards, combos, fullAnalysis) {
    const remedies = [];
    
    // Check combos for immediate remedies
    combos.forEach(combo => {
        if (combo.name === 'Động Mộ') {
            remedies.push('Mở rộng huyệt mộ, rào chắn móng, di dời rễ cây gốc hoặc bồi đắp lại đất bị sụt lún.');
            remedies.push('Làm lễ tạ mộ và xin lỗi tiền nhân, mời thầy cạo rễ nếu đã xâm nhập sâu.');
        } else if (combo.name === 'Tranh chấp Vong linh') {
            remedies.push('Lập đàn cầu siêu cho những linh hồn còn lưu lạc trên đất, tạ lễ Thổ Địa để phân định ranh giới.');
        } else if (combo.name === 'Đất Kết (Long mạch)') {
            remedies.push('Giữ nguyên hiện trạng, không được đào xới bừa bãi hoặc xây dựng phá vỡ cảnh quan linh thiêng.');
        }
    });

    // Check suit distribution
    const counts = { 'Bích': 0, 'Chuồn': 0, 'Cơ': 0, 'Rô': 0 };
    cards.forEach(c => counts[c.suit]++);

    if (counts['Bích'] >= 3) {
        remedies.push('Âm khí đất này quá nặng. Nên đặt các linh vật bằng đồng (Kim khắc Thổ/Âm), hoặc thường xuyên thắp hương bái tạ.');
    }
    if (counts['Chuồn'] >= 3) {
        remedies.push('Cẩn thận các rễ cây lớn gần móng hoặc mồ mả, nên xử lý triệt để các góc sụt lún.');
    }
    if (counts['Cơ'] >= 3) {
        remedies.push('Cần xử lý thoát nước tốt, nếu là mạch đào sâu nên gia cố móng bằng bê tông cường độ cao.');
    }

    // Default if good
    if (remedies.length === 0) {
        remedies.push('Đất rạng ngời sinh khí, chỉ cần tạ ơn Thổ Địa hàng quý là đủ.');
    }

    return Array.from(new Set(remedies)); // Unique list
}

module.exports = {
    generateRemedies
};
