/**
 * ============================================
 * DB.JS - SQLite Database Setup & Seed
 * Lưu trữ nội dung diễn giải Tử Vi
 * ============================================
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'tuvi.db');

let db;

function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        initTables();
        seedData();
    }
    return db;
}

function initTables() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS sao_interpret (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sao_name TEXT UNIQUE NOT NULL,
            icon TEXT DEFAULT '⭐',
            short_desc TEXT,
            detail TEXT,
            good_aspects TEXT,
            bad_aspects TEXT,
            nature TEXT DEFAULT 'trung',
            sao_type TEXT DEFAULT 'phu',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS cung_interpret (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cung_name TEXT UNIQUE NOT NULL,
            icon TEXT DEFAULT '🔮',
            description TEXT,
            key_aspects TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS special_interpret (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            condition_key TEXT UNIQUE NOT NULL,
            title TEXT,
            icon TEXT DEFAULT '⚠️',
            description TEXT,
            advice TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS ai_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cache_key TEXT UNIQUE NOT NULL,
            response TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME
        );
    `);
}

function seedData() {
    // Check if already seeded
    const count = db.prepare('SELECT COUNT(*) as cnt FROM sao_interpret').get();
    if (count.cnt > 0) return;

    console.log('[DB] Seeding interpretation data...');

    // =====================
    // SEED SAO INTERPRET
    // =====================
    const insertSao = db.prepare(`
        INSERT OR IGNORE INTO sao_interpret (sao_name, icon, short_desc, detail, good_aspects, bad_aspects, nature, sao_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const saoData = [
        // 14 Chính Tinh
        ['Tử Vi', '👑', 'Đế Tinh - Vua của các sao',
            'Tử Vi là sao Đế Tinh, chủ về cao quý, quyền uy, sang trọng. Người có Tử Vi tọa Mệnh thường có phong thái đường bệ, tự tin, hay được người khác kính trọng. Tuy nhiên Tử Vi cần có bộ sao phụ tá tốt đi kèm mới phát huy hết uy lực, nếu đứng một mình thì như vua không có quần thần, khó thành đại sự.',
            'Quý phái, nhiều quý nhân phù trợ, sự nghiệp thăng tiến',
            'Cô độc khi đứng một mình, dễ kiêu ngạo, chủ quan', 'cat', 'chinh'],
        ['Thiên Cơ', '⚙️', 'Mưu Tinh - Sao mưu trí',
            'Thiên Cơ chủ về trí tuệ, mưu lược, cơ biến. Đây là sao của người thông minh, nhanh nhạy, giỏi tính toán và thích nghi. Thiên Cơ tọa Mệnh cho người biết lo toan, có tài xoay xở.',
            'Thông minh, khéo léo, tài ứng biến, phù hợp làm quân sư',
            'Hay lo lắng, đa mưu túc trí nhưng thiếu quyết đoán', 'cat', 'chinh'],
        ['Thái Dương', '☀️', 'Dương Tinh - Mặt trời',
            'Thái Dương chủ về quang minh, chính đại, hào phóng. Sao này đại diện cho nam giới, cha, chồng. Ở cung ban ngày (Mão-Thân) thì sáng, cung đêm (Dậu-Dần) thì tối. Thái Dương sáng sủa rất tốt cho sự nghiệp và danh tiếng.',
            'Rộng rãi, chính trực, có danh tiếng, tốt cho nam',
            'Khi hãm thì tổn thương cha hoặc chồng, hao tài', 'cat', 'chinh'],
        ['Vũ Khúc', '⚔️', 'Tài Tinh - Sao tài lộc',
            'Vũ Khúc là Tài Tinh, chủ về tài năng, tiền bạc, quả quyết. Người có Vũ Khúc thường mạnh mẽ, dứt khoát, có tài làm kinh doanh và quản lý tài chính. Tuy nhiên Vũ Khúc cũng mang tính cương cường, dễ cô đơn.',
            'Có tài kinh doanh, quả đoán, tài lộc dồi dào',
            'Cô khắc, cứng rắn, đời sống tình cảm không suôn sẻ', 'trung', 'chinh'],
        ['Thiên Đồng', '🌸', 'Phúc Tinh - Sao phúc đức',
            'Thiên Đồng là Phúc Tinh, chủ về phúc đức, an nhàn, hưởng thụ. Người có Thiên Đồng thường hiền lành, dễ thương, thích cuộc sống vui vẻ thanh thản. Sao này rất tốt khi ở cung Phúc Đức.',
            'Phúc hậu, hiền lành, cuộc sống an nhàn, nhiều may mắn',
            'Thiếu ý chí phấn đấu, dễ ỷ lại, hưởng thụ quá mức', 'cat', 'chinh'],
        ['Liêm Trinh', '🔥', 'Tù Tinh - Sao song tính',
            'Liêm Trinh mang tính lưỡng diện: tốt thì là sao Quan, xấu thì là sao Tù (tù tội). Đây là sao của sự nhiệt tình, đam mê, liêm chính nhưng cũng nóng nảy. Liêm Trinh gặp Sát tinh (Thất Sát, Phá Quân) thì rất hung.',
            'Năng động, đam mê, có khả năng lãnh đạo',
            'Nóng tính, dễ gặp thị phi, có thể liên quan pháp luật', 'trung', 'chinh'],
        ['Thiên Phủ', '🏛️', 'Kho Tinh - Sao kho tàng',
            'Thiên Phủ là Kho Tinh, chủ về giàu có, ổn định, bảo thủ. Đây là một trong những sao tốt nhất, đem lại sự sung túc, an ổn. Thiên Phủ tọa Mệnh thường cho người có của ăn của để, biết tích trữ.',
            'Giàu có, ổn định, được nhiều người tin cậy',
            'Bảo thủ, thiếu sáng tạo, quá thận trọng', 'cat', 'chinh'],
        ['Thái Âm', '🌙', 'Âm Tinh - Mặt trăng',
            'Thái Âm đại diện cho nữ giới, mẹ, vợ, và sự dịu dàng, nhu mì. Giống Thái Dương, sao này cũng phân biệt sáng/tối: cung đêm (Dậu-Dần) thì sáng, cung ngày (Mão-Thân) thì tối. Thái Âm sáng rất tốt cho nữ mệnh.',
            'Dịu dàng, tao nhã, tốt cho nữ, được hưởng phúc từ mẹ',
            'Khi hãm thì ưu phiền, mẹ yếu, tình cảm trắc trở', 'cat', 'chinh'],
        ['Tham Lang', '🎭', 'Đào Hoa Tinh - Sao tham vọng',
            'Tham Lang là sao Đào Hoa nhất trong 14 chính tinh, chủ về dục vọng, giao tế, tài năng nghệ thuật. Người có Tham Lang mạnh thường hấp dẫn, đa tài, nhưng cũng tham lam, đam mê quá mức.',
            'Đa tài, hấp dẫn, tài giao tiếp, năng lực nghệ thuật',
            'Tham lam, đam mê tửu sắc, không biết đủ', 'trung', 'chinh'],
        ['Cự Môn', '🗣️', 'Ám Tinh - Sao khẩu thiệt',
            'Cự Môn là Ám Tinh, chủ về khẩu thiệt, thị phi, che lấp. Tuy nhiên Cự Môn cũng đại diện cho tài ăn nói, biện luận. Người có Cự Môn mạnh có thể thành công nhờ miệng lưỡi (luật sư, diễn giả, kinh doanh).',
            'Tài ăn nói, biện luận giỏi, sắc sảo',
            'Hay bị thị phi, khẩu thiệt, đa nghi, khó tin người', 'trung', 'chinh'],
        ['Thiên Tướng', '🛡️', 'Ấn Tinh - Sao ấn tín',
            'Thiên Tướng là sao Ấn, chủ về che chở, bảo hộ, nhân hậu. Đây là sao quý nhân, người có Thiên Tướng thường được giúp đỡ, lại khéo dung hòa các mối quan hệ.',
            'Nhiều quý nhân, nhân hậu, được bảo hộ, kín đáo',
            'Dễ bị lợi dụng lòng tốt, thiếu chủ kiến riêng', 'cat', 'chinh'],
        ['Thiên Lương', '📚', 'Âm Phúc Tinh - Sao phúc thọ',
            'Thiên Lương chủ về phúc đức, thọ mệnh, liêm chính. Là sao Âm Phúc, thường che chở ngấm ngầm. Người có Thiên Lương thường sống lâu, được phúc ẩn, có tâm từ thiện.',
            'Phúc thọ, liêm khiết, được che chở vô hình',
            'Quá lý tưởng, khó thích nghi môi trường phức tạp', 'cat', 'chinh'],
        ['Thất Sát', '⚡', 'Sát Tinh - Sao chiến đấu',
            'Thất Sát là sao Sát, chủ về chiến đấu, quả cảm, quyết liệt. Đây là sao của tướng lĩnh, người can đảm, dám nghĩ dám làm. Thất Sát mạnh cho người có khí phách, nhưng cuộc đời nhiều sóng gió.',
            'Can đảm, quả cảm, có khí phách, dám đương đầu',
            'Bất ổn, nhiều sóng gió, dễ xung đột, cô đơn', 'hung', 'chinh'],
        ['Phá Quân', '💥', 'Hao Tinh - Sao phá cách',
            'Phá Quân chủ về phá bỏ cái cũ, lập cái mới, biến động. Người có Phá Quân mạnh thường không yên phận, luôn muốn thay đổi, đổi mới. Sao này tốt cho những người tiên phong, cách mạng.',
            'Sáng tạo, dám phá lệ, tinh thần đổi mới',
            'Phá hoại, không ổn định, hay thay đổi, hao tổn', 'trung', 'chinh'],

        // Phụ Tinh chính
        ['Tả Phụ', '🤝', 'Quý nhân trái, trợ giúp đắc lực', null, 'Nhiều bạn bè, quý nhân giúp đỡ', null, 'cat', 'phu'],
        ['Hữu Bật', '🤝', 'Quý nhân phải, âm thầm trợ giúp', null, 'Được bề trên nâng đỡ, nhiều cơ hội', null, 'cat', 'phu'],
        ['Văn Xương', '📝', 'Văn tinh - Học hành, thi cử', null, 'Thông minh, học giỏi, có bằng cấp', null, 'cat', 'phu'],
        ['Văn Khúc', '🎵', 'Văn tinh - Tài nghệ, nghệ thuật', null, 'Có tài nghệ thuật, khéo ăn nói', null, 'cat', 'phu'],
        ['Thiên Khôi', '⭐', 'Quý nhân trên (Dương quý)', null, 'Được quý nhân nam giúp, may mắn', null, 'cat', 'phu'],
        ['Thiên Việt', '⭐', 'Quý nhân dưới (Âm quý)', null, 'Được quý nhân nữ giúp, hanh thông', null, 'cat', 'phu'],
        ['Lộc Tồn', '💰', 'Tài Lộc tinh', null, 'Tài lộc ổn định, tiết kiệm', null, 'cat', 'phu'],
        ['Kình Dương', '🗡️', 'Sát tinh - Cương mãnh', null, 'Can đảm, quyết đoán khi ở miếu vượng', 'Xung đột, tai nạn, tính cương cường', 'hung', 'phu'],
        ['Đà La', '🌀', 'Sát tinh - Quanh co', null, 'Kiên nhẫn, chậm nhưng chắc', 'Trở ngại, đày đọa, tốn hao', 'hung', 'phu'],
        ['Hoả Tinh', '🔥', 'Hung tinh - Nóng nảy', null, null, 'Nóng giận, tai họa bất ngờ', 'hung', 'phu'],
        ['Linh Tinh', '⚡', 'Hung tinh - Chớp nhoáng', null, null, 'Bất ổn, lo lắng, thay đổi đột ngột', 'hung', 'phu'],
        ['Địa Không', '🕳️', 'Hung tinh - Trống rỗng', null, null, 'Hao tài, mất mát, trống không', 'hung', 'phu'],
        ['Địa Kiếp', '💀', 'Hung tinh - Kiếp nạn', null, null, 'Tai kiếp, tổn thất nặng nề', 'hung', 'phu'],
        ['Thiên Mã', '🐎', 'Di chuyển, xuất ngoại', null, 'Hay di chuyển, cơ hội ở xa', null, 'cat', 'phu'],
        ['Đào Hoa', '🌺', 'Sắc đẹp, tình duyên', null, 'Duyên dáng, hấp dẫn', null, 'trung', 'phu'],
        ['Hồng Loan', '💕', 'Hỷ tinh - Hôn nhân', null, 'Kết hôn, tình duyên tốt đẹp', null, 'cat', 'phu'],
        ['Thiên Hỷ', '🎉', 'Hỷ sự', null, 'Tin vui, may mắn', null, 'cat', 'phu'],

        // Phụ Tinh bổ sung (v2)
        ['Tang Môn', '⚰️', 'Tang tóc, chia ly', null, null, 'Tang sự, mất mát, buồn phiền', 'hung', 'phu'],
        ['Bạch Hổ', '🐅', 'Hung tinh - Tang vận', null, null, 'Tang sự, tai nạn đổ máu, thú dữ', 'hung', 'phu'],
        ['Thiên Hình', '⚖️', 'Hình phạt, pháp luật', null, 'Công bằng, nghiêm minh', 'Kiện tụng, hình phạt, phẫu thuật', 'hung', 'phu'],
        ['Thiên Riêu', '🌹', 'Đào hoa ám - sắc dục', null, 'Quyến rũ, có duyên ngầm', 'Tình ái phức tạp, đam mê sắc dục', 'trung', 'phu'],
        ['Thiên Y', '💊', 'Sao chữa bệnh', null, 'Có duyên với y học, hay gặp thầy thuốc giỏi', null, 'cat', 'phu'],
        ['Cô Thần', '😔', 'Cô đơn, lẻ loi (nam)', null, null, 'Cô đơn, lẻ loi, thiếu bạn đời. Nặng hơn cho nam mệnh.', 'hung', 'phu'],
        ['Quả Tú', '😢', 'Cô đơn, góa bụa (nữ)', null, null, 'Cô quả, lẻ bóng, hôn nhân trắc trở. Nặng hơn cho nữ mệnh.', 'hung', 'phu'],
        ['Kiếp Sát', '💀', 'Sát tinh - Kiếp nạn bất ngờ', null, null, 'Tai nạn bất ngờ, nguy hiểm tính mạng', 'hung', 'phu'],
        ['Thai Phụ', '🤰', 'Sao thai sản', null, 'Thuận lợi chuyện sinh nở, con cái', null, 'cat', 'phu'],
        ['Quốc Ấn', '🏅', 'Ấn tín quốc gia', null, 'Uy tín, chức vụ nhà nước, bằng cấp', null, 'cat', 'phu'],
        ['Đường Phù', '📜', 'Sao chiếu cố', null, 'Được đề bạt, nâng đỡ, giấy tờ thuận lợi', null, 'cat', 'phu'],
        ['Thiên Quan', '🎖️', 'Quý nhân quan chức', null, 'Được quý nhân giúp trong chuyện quan chức, pháp luật', null, 'cat', 'phu'],
        ['Thiên Phúc', '🍀', 'Phúc tinh', null, 'Được hưởng phúc lộc, hay gặp may', null, 'cat', 'phu'],
        ['Thiên La', '🕸️', 'Lưới trời - Trói buộc', null, null, 'Bị ràng buộc, mắc kẹt, khó thoát', 'hung', 'phu'],
        ['Địa Võng', '🪤', 'Lưới đất - Trói buộc', null, null, 'Bị trói buộc ở phương dưới, mắc kẹt', 'hung', 'phu'],
        ['Thiên Thương', '💫', 'Tổn thương từ trời', null, null, 'Bệnh tật bẩm sinh, tổn thương không lường trước', 'hung', 'phu'],
        ['Thiên Sứ', '🕊️', 'Sứ giả trời', null, 'Có duyên với tâm linh, tôn giáo', 'Gặp nhiều biến cố, thay đổi do số phận', 'trung', 'phu'],
        ['Điếu Khách', '🎗️', 'Viếng tang, chia buồn', null, null, 'Hay gặp chuyện buồn, viếng tang thường xuyên', 'hung', 'phu'],
        ['Phục Binh', '🥷', 'Ẩn sĩ, phục kích', null, null, 'Bị phản bội, bẫy ngầm, mưu hại từ trong tối', 'hung', 'phu'],
        ['Lưu Hà', '🌊', 'Nước mắt, sầu bi', null, null, 'Hay khóc, sầu bi, buồn phiền liên tục', 'hung', 'phu'],
        ['Thiên Đức', '⭐', 'Đức trời ban', null, 'Được phúc đức che chở, gặp hung hóa cát', null, 'cat', 'phu'],
        ['Nguyệt Đức', '🌝', 'Đức mặt trăng', null, 'Được âm đức che chở, nữ quý nhân giúp', null, 'cat', 'phu'],
        ['Hóa Quyền', '👑', 'Biến thể quyền lực', null, 'Tăng quyền lực, uy tín, chức vụ', null, 'cat', 'phu'],
        ['Hóa Lộc', '💎', 'Biến thể tài lộc', null, 'Tăng tài lộc, may mắn, hanh thông', null, 'cat', 'phu'],
        ['Hóa Khoa', '📖', 'Biến thể học vấn', null, 'Tăng học vấn, danh tiếng, bằng cấp', null, 'cat', 'phu'],
        ['Hóa Kỵ', '⛔', 'Biến thể trở ngại', null, null, 'Gây trở ngại, thị phi, bế tắc', 'hung', 'phu'],
        ['Tấu Thư', '📋', 'Văn thư, giấy tờ', null, 'Thuận lợi giấy tờ, thi cử, hợp đồng', null, 'cat', 'phu'],
        ['Phi Liêm', '🦅', 'Bay liệng, bất ổn', null, null, 'Bất ổn, không yên chỗ, hay di chuyển', 'hung', 'phu'],
        ['Đại Hao', '💸', 'Hao tổn lớn', null, null, 'Hao tài lớn, chi tiêu không kiểm soát', 'hung', 'phu'],
        ['Tiểu Hao', '💳', 'Hao tổn nhỏ', null, null, 'Hao tài nhỏ, lặt vặt, không tích lũy được', 'hung', 'phu'],
        ['Thanh Long', '🐉', 'Rồng xanh - Hỷ tinh', null, 'Tin vui, hỷ sự, ngoại giao tốt', null, 'cat', 'phu'],
        ['Quan Phủ', '🏛️', 'Quan phủ, kiện tụng', null, null, 'Kiện tụng, dính líu pháp luật', 'hung', 'phu'],
        ['Bác Sĩ', '🩺', 'Sao khởi đầu vòng Bác Sĩ', null, 'Trí tuệ, học hỏi, chữa bệnh', null, 'cat', 'phu'],
        ['Lực Sĩ', '💪', 'Sức mạnh, quyền lực', null, 'Có sức mạnh, quyền lực, thể lực tốt', null, 'cat', 'phu'],
        ['Tướng Quân', '🎯', 'Chiến tướng, xung phong', null, 'Dũng cảm, dám làm, tinh thần lãnh đạo', 'Hay xung đột, gây sự', 'trung', 'phu'],
    ];

    const insertSaoTx = db.transaction(() => {
        for (const s of saoData) {
            insertSao.run(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]);
        }
    });
    insertSaoTx();

    // =====================
    // SEED CUNG INTERPRET
    // =====================
    const insertCung = db.prepare(`
        INSERT OR IGNORE INTO cung_interpret (cung_name, icon, description, key_aspects)
        VALUES (?, ?, ?, ?)
    `);

    const cungData = [
        ['MỆNH', '🏠', 'Cung Mệnh thể hiện tính cách, phẩm chất, vận mệnh tổng quát của đương số. Đây là cung quan trọng nhất trong lá số Tử Vi.',
            JSON.stringify(['Tính cách', 'Ngoại hình', 'Vận mệnh tổng quát', 'Khả năng phát triển'])],
        ['HUYNH ĐỆ', '👥', 'Cung Huynh Đệ cho biết mối quan hệ anh chị em, bạn bè thân thiết, đồng nghiệp.',
            JSON.stringify(['Anh chị em', 'Bạn bè', 'Quan hệ đồng nghiệp', 'Hỗ trợ lẫn nhau'])],
        ['PHU THÊ', '💑', 'Cung Phu Thê xem về hôn nhân, vợ chồng, người yêu. Cho biết duyên phận tình cảm.',
            JSON.stringify(['Hôn nhân', 'Duyên phận', 'Tính cách bạn đời', 'Hạnh phúc gia đình'])],
        ['TỬ TỨC', '👶', 'Cung Tử Tức xem về con cái, hậu vận qua con. Cũng liên quan đến khả năng sinh sản.',
            JSON.stringify(['Con cái', 'Số con', 'Tương lai con cái', 'Phúc đức nối dõi'])],
        ['TÀI BẠCH', '💎', 'Cung Tài Bạch xem về tài chính, tiền bạc, cách kiếm tiền và giữ tiền.',
            JSON.stringify(['Thu nhập', 'Cách kiếm tiền', 'Khả năng tích lũy', 'Nguồn tài chính'])],
        ['TẬT ÁCH', '🏥', 'Cung Tật Ách xem về sức khỏe, bệnh tật, tai nạn. Cần lưu ý các sao hung đóng tại đây.',
            JSON.stringify(['Sức khỏe', 'Bệnh tật', 'Tai nạn', 'Thể chất'])],
        ['THIÊN DI', '✈️', 'Cung Thiên Di xem về đi xa, xuất ngoại, cuộc sống bên ngoài, quan hệ xã hội.',
            JSON.stringify(['Di chuyển', 'Xuất ngoại', 'Quan hệ xã hội', 'Sự nghiệp bên ngoài'])],
        ['NÔ BỘC', '🤝', 'Cung Nô Bộc (Giao Hữu) xem về người giúp việc, thuộc cấp, bạn bè phổ thông.',
            JSON.stringify(['Thuộc cấp', 'Bạn bè xã giao', 'Mối quan hệ phục vụ', 'Nhân sự'])],
        ['QUAN LỘC', '🏢', 'Cung Quan Lộc xem về sự nghiệp, học vấn, công danh, chức vụ.',
            JSON.stringify(['Sự nghiệp', 'Học vấn', 'Chức vụ', 'Thành tựu công việc'])],
        ['ĐIỀN TRẠCH', '🏡', 'Cung Điền Trạch xem về nhà cửa, bất động sản, tài sản cố định.',
            JSON.stringify(['Nhà cửa', 'Đất đai', 'Bất động sản', 'Tài sản thừa kế'])],
        ['PHÚC ĐỨC', '🙏', 'Cung Phúc Đức xem về phúc phần gia tộc, đạo đức, tổ tiên, sự an lạc tinh thần.',
            JSON.stringify(['Phúc phần', 'Gia tộc', 'Đạo đức', 'An lạc tinh thần'])],
        ['PHỤ MẪU', '👨‍👩‍👧', 'Cung Phụ Mẫu xem về cha mẹ, cấp trên, thầy cô, người bảo hộ.',
            JSON.stringify(['Cha mẹ', 'Cấp trên', 'Thầy cô', 'Người bảo hộ'])],
    ];

    const insertCungTx = db.transaction(() => {
        for (const c of cungData) {
            insertCung.run(c[0], c[1], c[2], c[3]);
        }
    });
    insertCungTx();

    // =====================
    // SEED SPECIAL INTERPRET
    // =====================
    const insertSpecial = db.prepare(`
        INSERT OR IGNORE INTO special_interpret (condition_key, title, icon, description, advice)
        VALUES (?, ?, ?, ?, ?)
    `);

    const specialData = [
        ['am_duong_nghich_ly', 'Âm Dương Nghịch Lý', '⚠️',
            'Lá số có Âm Dương nghịch lý (Âm Nam hoặc Dương Nữ). Điều này có nghĩa vòng sao an theo chiều nghịch, tạo nên sự trái khoáy trong vận mệnh. Người có lá số nghịch lý thường phải đối mặt với nhiều thử thách để trưởng thành, nhưng nếu vượt qua sẽ có thành tựu đặc biệt.',
            'Cần kiên trì, biến khó khăn thành động lực phát triển.'],
        ['cuc_khac_menh', 'Cục Khắc Mệnh', '⚠️',
            'Cục khắc Mệnh. Đây là dấu hiệu cuộc đời nhiều thử thách, thường phải tự lập từ nhỏ, ít được cha mẹ hỗ trợ. Tuy nhiên, người Cục khắc Mệnh nếu kiên trì sẽ rèn được bản lĩnh vững vàng.',
            'Cần tự lập, rèn bản lĩnh, biến nghịch cảnh thành sức mạnh.'],
        ['than_menh_dong_cung', 'Thân Mệnh Đồng Cung', '🔄',
            'Cung Thân và cung Mệnh ở cùng một vị trí. Điều này có nghĩa số phận trước và sau trung niên không có sự thay đổi lớn. Nếu cung Mệnh tốt thì cả đời tốt, nếu xấu thì cần nỗ lực nhiều hơn để cải thiện.',
            'Tập trung phát triển bản thân ở giai đoạn đầu đời.'],
        ['tu_hoa', 'Tứ Hoá (Bốn phép biến hoá)', '✨',
            'Tứ Hoá là bốn phép biến hoá quan trọng nhất trong Tử Vi, gồm Hoá Lộc (tài lộc, may mắn), Hoá Quyền (quyền lực, uy tín), Hoá Khoa (học vấn, danh tiếng), và Hoá Kỵ (trở ngại, thị phi). Cung chứa Hoá Kỵ cần đặc biệt lưu ý.',
            'Phát huy Hoá Lộc/Quyền/Khoa, cẩn trọng cung chứa Hoá Kỵ.'],
    ];

    const insertSpecialTx = db.transaction(() => {
        for (const s of specialData) {
            insertSpecial.run(s[0], s[1], s[2], s[3], s[4]);
        }
    });
    insertSpecialTx();

    console.log('[DB] Seed complete!');
}

// =====================
// QUERY FUNCTIONS
// =====================

function getAllSaoInterpret() {
    return getDb().prepare('SELECT * FROM sao_interpret ORDER BY id').all();
}

function getSaoByName(name) {
    return getDb().prepare('SELECT * FROM sao_interpret WHERE sao_name = ?').get(name);
}

function getAllCungInterpret() {
    return getDb().prepare('SELECT * FROM cung_interpret ORDER BY id').all();
}

function getCungByName(name) {
    return getDb().prepare('SELECT * FROM cung_interpret WHERE cung_name = ?').get(name);
}

function getAllSpecialInterpret() {
    return getDb().prepare('SELECT * FROM special_interpret ORDER BY id').all();
}

function getSpecialByKey(key) {
    return getDb().prepare('SELECT * FROM special_interpret WHERE condition_key = ?').get(key);
}

// AI Cache
function getAiCache(key) {
    const row = getDb().prepare("SELECT * FROM ai_cache WHERE cache_key = ? AND (expires_at IS NULL OR expires_at > datetime('now'))").get(key);
    return row ? row.response : null;
}

function setAiCache(key, response, ttlHours = 24) {
    getDb().prepare(`
        INSERT OR REPLACE INTO ai_cache (cache_key, response, expires_at)
        VALUES (?, ?, datetime('now', '+' || ? || ' hours'))
    `).run(key, response, ttlHours);
}

module.exports = {
    getDb,
    getAllSaoInterpret,
    getSaoByName,
    getAllCungInterpret,
    getCungByName,
    getAllSpecialInterpret,
    getSpecialByKey,
    getAiCache,
    setAiCache
};
