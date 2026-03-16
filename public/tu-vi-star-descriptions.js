/**
 * ============================================
 * TỬ VI STAR DESCRIPTIONS - Mô tả sao cho tooltip
 * Data layer: ngũ hành, phân loại, mô tả ngắn
 * ============================================
 */

const STAR_DESCRIPTIONS = {
    // =====================
    // 14 CHÍNH TINH
    // =====================
    'Tử Vi': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Vua của 14 chính tinh, chủ quyền uy, danh vọng, phú quý. Tượng trưng vua chúa, người lãnh đạo.'
    },
    'Thiên Cơ': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Chủ trí tuệ, mưu lược, khéo léo, tính toán giỏi. Có tài biến hóa, thích hợp nghề tham mưu.'
    },
    'Thái Dương': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Tượng Mặt trời, chủ quang minh, chính trực, bác ái. Đại diện người cha, nam giới trong gia đình.'
    },
    'Vũ Khúc': {
        nguHanh: 'Kim',
        loai: 'Trung tính',
        moTa: 'Chủ tài lộc, kinh doanh, cương quyết, cứng rắn. Sao tài tinh hàng đầu, giỏi quản lý tài chính.'
    },
    'Thiên Đồng': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Chủ phúc đức, hòa nhã, lạc quan, hưởng thụ. Tính tình hiền lành, thích cuộc sống an nhàn.'
    },
    'Liêm Trinh': {
        nguHanh: 'Hỏa',
        loai: 'Trung tính',
        moTa: 'Sao đa tính chất: có thể cát, có thể hung. Chủ hình pháp, quan chức, tình cảm phức tạp.'
    },
    'Thiên Phủ': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Kho tàng của trời, chủ tài lộc, ổn định, bảo thủ. Tượng vợ vua, sao an khang thịnh vượng.'
    },
    'Thái Âm': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Tượng Mặt trăng, chủ thanh tao, nhàn nhã, điền sản. Đại diện người mẹ, nữ giới trong gia đình.'
    },
    'Tham Lang': {
        nguHanh: 'Mộc',
        loai: 'Trung tính',
        moTa: 'Sao ham muốn, đa tài đa nghệ, giao thiệp rộng. Giỏi ăn nói, có tài ngoại giao nhưng đa dục.'
    },
    'Cự Môn': {
        nguHanh: 'Thủy',
        loai: 'Trung tính',
        moTa: 'Sao khẩu thiệt, thị phi, nhưng cũng chủ tài ăn nói giỏi. Thích hợp luật sư, giảng viên, tranh biện.'
    },
    'Thiên Tướng': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Chủ ấn tín, quý nhân phù trợ, đứng đắn, ngay thẳng. Tượng trưng quyền lực, chức vị.'
    },
    'Thiên Lương': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Sao ấm phúc, bác ái, che chở. Chủ thọ, phúc đức dày, thích hợp nghề y, giáo dục, từ thiện.'
    },
    'Thất Sát': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Sao sát tinh, cương liệt, quyết đoán, dám nghĩ dám làm. Có chí tiến thủ mạnh nhưng hay gặp trắc trở.'
    },
    'Phá Quân': {
        nguHanh: 'Thủy',
        loai: 'Trung tính',
        moTa: 'Sao phá cách, đổi mới, cách mạng. Thích phá bỏ cái cũ, xây cái mới, đời hay biến động.'
    },

    // =====================
    // PHỤ TINH - Lục Cát Tinh
    // =====================
    'Tả Phụ': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao phụ tá bên trái, chủ quý nhân giúp đỡ, bạn bè tốt. Tăng cường sức mạnh cho chính tinh.'
    },
    'Hữu Bật': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao phụ tá bên phải, chủ quý nhân ám trợ. Cùng Tả Phụ tạo cặp phụ tá mạnh nhất.'
    },
    'Văn Xương': {
        nguHanh: 'Kim',
        loai: 'Cát tinh',
        moTa: 'Sao văn chương chính, chủ học vấn, khoa bảng, thi cử. Giỏi văn chương, nghệ thuật, diễn đạt.'
    },
    'Văn Khúc': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao văn nghệ, tài hoa, âm nhạc, mỹ thuật. Cùng Văn Xương hợp thành cặp khoa giáp.'
    },
    'Thiên Khôi': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Quý nhân dương (hiện rõ), chủ gặp quý nhân phù trợ, thi cử đỗ đạt, được cấp trên nâng đỡ.'
    },
    'Thiên Việt': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Quý nhân âm (ngầm), chủ gặp quý nhân ám trợ. Cùng Thiên Khôi tạo sao đôi Quý nhân.'
    },
    'Lộc Tồn': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao tài lộc chính, chủ tiền bạc, của cải dồi dào. Thuộc nhóm tài tinh hàng đầu trong Tử Vi.'
    },
    'Thiên Mã': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Sao di chuyển, chủ đi xa, xuất ngoại, thăng tiến. Gặp Lộc Tồn thành "Lộc Mã giao trì" rất tốt.'
    },

    // =====================
    // PHỤ TINH - Lục Sát Tinh
    // =====================
    'Kình Dương': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Sao sát mạnh nhất, chủ cứng đầu, tranh đấu, tai nạn. Nhưng cũng cho sức mạnh, ý chí kiên cường.'
    },
    'Đà La': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Sao quấn quít, chủ ưu phiền, trì trệ, vướng mắc. Tác dụng âm thầm, dai dẳng hơn Kình Dương.'
    },
    'Hoả Tinh': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao nóng nảy, bùng nổ, chủ tai họa đột ngột. Hay gây biến cố bất ngờ, tính tình nóng vội.'
    },
    'Linh Tinh': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao ẩn hung, âm thầm nhưng mãnh liệt. Gây trắc trở kiểu âm ỉ, dai dẳng, khó lường.'
    },
    'Địa Không': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao hư không, chủ mất mát, hao tài, bất ngờ trắng tay. Nhưng cũng cho tư duy siêu thoát, sáng tạo.'
    },
    'Địa Kiếp': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao kiếp nạn, chủ tai họa, cướp đoạt, mất mát. Cùng Địa Không gọi là "Không Kiếp" đáng sợ nhất.'
    },

    // =====================
    // PHỤ TINH - Tứ Hoá
    // =====================
    'Hoá Lộc': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Tượng tài lộc, may mắn, thuận lợi. Sao nào gặp Hoá Lộc thì phát huy tốt nhất.'
    },
    'Hoá Quyền': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Tượng quyền lực, chủ động, kiểm soát. Tăng sức mạnh và ảnh hưởng cho sao gặp.'
    },
    'Hoá Khoa': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Tượng danh tiếng, học vấn, thanh cao. Mang lại sự nổi tiếng và uy tín.'
    },
    'Hoá Kỵ': {
        nguHanh: 'Thủy',
        loai: 'Hung tinh',
        moTa: 'Tượng trở ngại, thị phi, kỵ húy. Gây trắc trở, phiền phức cho sao và cung gặp phải.'
    },

    // =====================
    // PHỤ TINH - Khác
    // =====================
    'Thiên Khốc': {
        nguHanh: 'Thủy',
        loai: 'Hung tinh',
        moTa: 'Sao nước mắt, chủ buồn phiền, khóc lóc, tang tóc. Gặp hung tinh thêm bi ai.'
    },
    'Thiên Hư': {
        nguHanh: 'Thủy',
        loai: 'Hung tinh',
        moTa: 'Sao hư hao, chủ hao tốn, mất mát tinh thần. Gặp sao xấu dễ suy sụp, hoang tưởng.'
    },
    'Thiên Hình': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao hình phạt, chủ pháp luật, hình sự, phẫu thuật. Người có sao này hay liên quan đến luật pháp.'
    },
    'Thiên Diêu': {
        nguHanh: 'Thủy',
        loai: 'Trung tính',
        moTa: 'Sao sắc đẹp, quyến rũ, duyên dáng nhưng đa tình. Chủ nghệ thuật, thẩm mỹ, tình cảm phức tạp.'
    },
    'Thiên Y': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao y dược, chủ sức khỏe, chữa bệnh, bếp núc. Thích hợp nghề y, dược, nấu ăn.'
    },
    'Đào Hoa': {
        nguHanh: 'Mộc',
        loai: 'Trung tính',
        moTa: 'Sao tình duyên, chủ sắc đẹp, hấp dẫn, lãng mạn. Đa tình, dễ vướng vào chuyện tình cảm.'
    },
    'Hồng Loan': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao hôn nhân, chủ duyên đẹp, kết hôn, hạnh phúc gia đạo. Sao hỉ sự tốt lành.'
    },
    'Thiên Hỷ': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao vui mừng, chủ tin vui, sinh nở, hỉ sự. Đối cung Hồng Loan, cùng chủ hôn nhân.'
    },
    'Thai Phụ': {
        nguHanh: 'Kim',
        loai: 'Cát tinh',
        moTa: 'Sao phụ tá tai (học), chủ văn chương, khoa giáp. Hỗ trợ Văn Xương, Văn Khúc.'
    },
    'Phong Cáo': {
        nguHanh: 'Kim',
        loai: 'Cát tinh',
        moTa: 'Sao phong tước, chủ chức vụ, phong thưởng. Tượng trưng vinh hiển, được tuyên dương.'
    },
    'Thiên Quan': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Sao quan tước, chủ gặp quý nhân trong quan trường. Hỗ trợ sự nghiệp, thăng tiến.'
    },
    'Thiên Phúc': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao phúc đức, chủ phúc lộc trời cho. Được ấm phúc từ tổ tiên, gia đình.'
    },
    'Quốc Ấn': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao ấn tín quốc gia, chủ chức quyền, danh vị. Tượng trưng quyền lực chính danh.'
    },
    'Đường Phù': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Sao phù hiệu, chủ bằng cấp, chứng chỉ, giấy tờ hành chính. Liên quan đến giấy tờ pháp lý.'
    },
    'Thiên La': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Lưới trời ở Thìn, chủ bị ràng buộc, hạn chế. Cùng Địa Võng tạo vùng "La Võng" không thuận.'
    },
    'Địa Võng': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Lưới đất ở Tuất, chủ vướng mắc, khó thoát. Cùng Thiên La tạo vùng khó khăn.'
    },
    'Kiếp Sát': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao cướp đoạt, chủ tai nạn, mất mát bất ngờ. Gặp sao hung thêm nguy hiểm.'
    },
    'Tang Môn': {
        nguHanh: 'Mộc',
        loai: 'Hung tinh',
        moTa: 'Sao tang tóc, chủ đám ma, chia ly, buồn phiền. Gặp Bạch Hổ thêm nặng.'
    },
    'Bạch Hổ': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Sao hổ trắng, chủ tang chế, kiện tụng, máu huyết. Gặp cát tinh giảm hung.'
    },
    'Điếu Khách': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao viếng tang, chủ đi phúng điếu, liên lụy tang tóc. Thường đi cùng Tang Môn.'
    },
    'Cô Thần': {
        nguHanh: 'Thổ',
        loai: 'Hung tinh',
        moTa: 'Sao cô đơn (nam), chủ lẻ loi, khó kết bạn. Ảnh hưởng hôn nhân, duyên phận muộn màng.'
    },
    'Quả Tú': {
        nguHanh: 'Thổ',
        loai: 'Hung tinh',
        moTa: 'Sao góa bụa (nữ), chủ cô đơn, thiếu thốn tình cảm. Cùng Cô Thần báo hiệu duyên muộn.'
    },
    'Thiên Không': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao trống rỗng, chủ mất mát, hư ảo, không thực. Nhưng cũng cho tư duy thoát tục, triết lý.'
    },

    // =====================
    // VÒNG BÁC SĨ (12 sao)
    // =====================
    'Bác Sĩ': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao thông minh, học rộng, chủ trí tuệ, kiến thức. Tượng trưng người có học.'
    },
    'Lực Sĩ': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Sao sức mạnh, chủ dũng mãnh, quyền uy. Tượng trưng sức mạnh thể chất và tinh thần.'
    },
    'Thanh Long': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Sao rồng xanh, chủ vui mừng, hỉ sự, thăng tiến. Báo hiệu tin lành, may mắn.'
    },
    'Tiểu Hao': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao hao nhỏ, chủ mất mát vặt, tốn kém lặt vặt. Không quá nghiêm trọng nhưng phiền toái.'
    },
    'Tướng Quân': {
        nguHanh: 'Mộc',
        loai: 'Trung tính',
        moTa: 'Sao chỉ huy, chủ cương quyết, lãnh đạo. Có tính chất quân sự, ra lệnh.'
    },
    'Tấu Thư': {
        nguHanh: 'Kim',
        loai: 'Cát tinh',
        moTa: 'Sao văn thư, chủ giấy tờ, hợp đồng, giao dịch tốt. Liên quan pháp lý thuận lợi.'
    },
    'Phi Liêm': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao bay liêm, chủ thị phi, kiện tụng, miệng lưỡi. Dễ bị vu khống, kiện cáo.'
    },
    'Hỷ Thần': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Sao hỉ sự, chủ vui mừng, tin tốt lành. Mang lại không khí vui vẻ, lạc quan.'
    },
    'Bệnh Phù': {
        nguHanh: 'Thổ',
        loai: 'Hung tinh',
        moTa: 'Sao bệnh tật, chủ ốm đau, sức khỏe kém. Cần chú ý sức khỏe khi gặp sao này.'
    },
    'Đại Hao': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao hao lớn, chủ tổn thất nặng, phá tán, tiêu hao. Nghiêm trọng hơn Tiểu Hao nhiều.'
    },
    'Phục Binh': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao phục kích, chủ tiểu nhân, bẫy rập, lừa lọc. Cẩn thận với người xung quanh.'
    },
    'Quan Phủ': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao quan phủ, chủ kiện tụng, vấn đề pháp lý. Dễ gặp chuyện liên quan tòa án.'
    },

    // =====================
    // PHỤ TINH - Đặc biệt
    // =====================
    'Tam Thai': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao văn chương phụ, chủ khoa giáp, danh vị. Hỗ trợ thi cử, học tập.'
    },
    'Bát Tọa': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Sao chức quyền phụ, chủ ngôi vị, phẩm hàm. Hỗ trợ sự nghiệp, thăng tiến.'
    },
    'Thiểu Dương': {
        nguHanh: 'Hỏa',
        loai: 'Trung tính',
        moTa: 'Sao dương nhỏ, chủ năng lượng dương, hoạt bát. Ảnh hưởng nhẹ đến tính cách.'
    },
    'Thiểu Âm': {
        nguHanh: 'Thủy',
        loai: 'Trung tính',
        moTa: 'Sao âm nhỏ, chủ nội tâm, trầm lặng, nhạy cảm. Ảnh hưởng nhẹ đến tình cảm.'
    },
    'Thiên Tài': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao tài năng trời cho, chủ năng khiếu bẩm sinh. Giỏi một lĩnh vực nào đó một cách tự nhiên.'
    },
    'Thiên Thọ': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao trường thọ, chủ sức khỏe tốt, sống lâu. Phúc đức, bản tính nhân hậu.'
    },
    'Long Trì': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Ao rồng, chủ văn chương, vinh hiển. Cùng Phượng Các tạo cặp "Long Phượng" quý.'
    },
    'Phượng Các': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Gác phượng, chủ danh vọng, khoa bảng. Cùng Long Trì báo hiệu vinh quang.'
    },
    'Lưu Hà': {
        nguHanh: 'Thủy',
        loai: 'Trung tính',
        moTa: 'Sao sông ngòi, chủ nước, thủy tai, nhưng cũng chủ di chuyển thuận lợi đường thủy.'
    },
    'Thiên Trù': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao bếp trời, chủ ẩm thực, bếp núc, no đủ. Tượng trưng cuộc sống được cung phụng.'
    },
    'Giải Thần': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Sao giải cứu, chủ hóa giải tai ương, thoát nạn. Làm giảm nhẹ tác dụng của hung tinh.'
    },
    'Địa Giải': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao giải hạn bên đất, chủ hóa giải nạn ở mặt đất. Hỗ trợ Giải Thần.'
    },
    'Thiên Đức': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Sao đức trời, chủ phúc đức, được trời phù hộ. Giảm nhẹ hung tinh trong cung.'
    },
    'Nguyệt Đức': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Sao đức trăng, chủ phúc đức, nhân từ. Cùng Thiên Đức bảo vệ, che chở.'
    },
    'Thiên Giải': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao hóa giải trời, chủ giải trừ nạn ách, thoát hiểm. Gặp hung tinh thì giảm xấu.'
    },
    'Ân Quang': {
        nguHanh: 'Mộc',
        loai: 'Cát tinh',
        moTa: 'Sao ân huệ, chủ được chiếu cố, ban ơn. Tượng trưng sự che chở từ bề trên.'
    },
    'Thiên Quý': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao quý nhân trời, chủ gặp quý nhân giúp đỡ. Tương tự Thiên Khôi, Thiên Việt nhưng nhẹ hơn.'
    },
    'Đẩu Quân': {
        nguHanh: 'Hỏa',
        loai: 'Trung tính',
        moTa: 'Nguyệt tướng, chủ tinh thần chiến đấu. Vị trí khởi đầu để luận lưu niên.'
    },
    'Phúc Đức': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Sao phúc đức, chủ phúc lành, được hưởng. Gia đình hòa thuận, con cháu hiếu thảo.'
    },
    'Long Đức': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Sao đức rồng, chủ quý nhân, phúc lộc. Năm gặp Long Đức hay có tin vui.'
    },
    'Thiên Thương': {
        nguHanh: 'Thổ',
        loai: 'Hung tinh',
        moTa: 'Sao thương tích trời, chủ tổn thương, bệnh tật. Liên quan đến sức khỏe, tai nạn.'
    },
    'Thiên Sứ': {
        nguHanh: 'Thủy',
        loai: 'Hung tinh',
        moTa: 'Sao sứ giả, chủ bệnh tật, cung tật ách không tốt. Hay mang tin xấu liên quan sức khỏe.'
    },
    'Tuế Phá': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao phá tuế, chủ phá hoại, tổn thất. Đối cung Thái Tuế, gây xung đột.'
    },
    'Phá Toái': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao tan vỡ, chủ phá vỡ, hỏng việc. Gây trở ngại, kế hoạch không thành.'
    },
    'Hoa Cái': {
        nguHanh: 'Kim',
        loai: 'Trung tính',
        moTa: 'Lọng hoa, chủ cô độc nhưng tao nhã. Người có tài nghệ thuật nhưng hay cô đơn, kiêu ngạo.'
    },
    'Quan Phù': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao quan phù (lưu niên), chủ kiện tụng, thưa gửi. Năm gặp cần cẩn thận pháp lý.'
    },
    'Thái Tuế': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao tuổi, chủ rắc rối, thị phi. Năm Thái Tuế chiếu mệnh cần đề phòng.'
    },
    'Trực Phù': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao trực phù, chủ tai nạn, kiện tụng. Liên quan đến pháp luật và tranh chấp.'
    },
    'Tử Phù': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Sao tử phù, chủ rắc rối lặt vặt, phiền hà. Ảnh hưởng nhẹ nhưng liên tục.'
    },

    // =====================
    // SAO LƯU NIÊN (prefix "Lưu")
    // =====================
    'Lưu Thái Tuế': {
        nguHanh: 'Hỏa',
        loai: 'Trung tính',
        moTa: 'Thái Tuế năm xem, đánh dấu cung chi năm hiện tại. Ảnh hưởng chủ đạo trong năm.'
    },
    'Lưu Thiên Mã': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Thiên Mã năm xem, chủ di chuyển, thay đổi trong năm. Có thể xuất ngoại, chuyển nhà.'
    },
    'Lưu Lộc Tồn': {
        nguHanh: 'Thổ',
        loai: 'Cát tinh',
        moTa: 'Lộc Tồn năm xem, chủ tài lộc trong năm. Năm có Lưu Lộc Tồn vào mệnh rất tốt.'
    },
    'Lưu Kình Dương': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Kình Dương năm xem, chủ trắc trở, tranh chấp trong năm. Cần cẩn thận.'
    },
    'Lưu Đà La': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Đà La năm xem, chủ ưu phiền, trì trệ trong năm. Công việc hay bị vướng mắc.'
    },
    'Lưu Thiên Khôi': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Thiên Khôi năm xem, chủ gặp quý nhân trong năm. Thi cử, phỏng vấn thuận lợi.'
    },
    'Lưu Thiên Việt': {
        nguHanh: 'Hỏa',
        loai: 'Cát tinh',
        moTa: 'Thiên Việt năm xem, chủ quý nhân ám trợ trong năm. Được giúp đỡ ngầm.'
    },
    'Lưu Tang Môn': {
        nguHanh: 'Mộc',
        loai: 'Hung tinh',
        moTa: 'Tang Môn năm xem, cẩn thận chuyện tang tóc, chia ly trong năm.'
    },
    'Lưu Bạch Hổ': {
        nguHanh: 'Kim',
        loai: 'Hung tinh',
        moTa: 'Bạch Hổ năm xem, chủ kiện tụng, máu huyết trong năm. Cẩn thận tai nạn.'
    },
    'Lưu Điếu Khách': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Điếu Khách năm xem, liên quan đến viếng tang, buồn phiền trong năm.'
    },
    'Lưu Hồng Loan': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Hồng Loan năm xem, chủ duyên mới, kết hôn trong năm. Năm đẹp cho tình duyên.'
    },
    'Lưu Đào Hoa': {
        nguHanh: 'Mộc',
        loai: 'Trung tính',
        moTa: 'Đào Hoa năm xem, chủ tình duyên, gặp gỡ trong năm. Dễ có mối quan hệ mới.'
    },
    'Lưu Thiên Hỷ': {
        nguHanh: 'Thủy',
        loai: 'Cát tinh',
        moTa: 'Thiên Hỷ năm xem, chủ hỉ sự, tin vui trong năm. Có thể sinh con, kết hôn.'
    },
    'Lưu Hoả Tinh': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Hoả Tinh năm xem, chủ biến cố bất ngờ, nóng nảy trong năm.'
    },
    'Lưu Linh Tinh': {
        nguHanh: 'Hỏa',
        loai: 'Hung tinh',
        moTa: 'Linh Tinh năm xem, chủ trắc trở âm thầm trong năm. Dai dẳng, khó lường.'
    }
};

// =====================
// MÔ TẢ 12 CUNG
// =====================
const CUNG_DESCRIPTIONS = {
    'MỆNH': 'Cung chủ yếu nhất, quyết định tính cách, diện mạo, vận mệnh tổng thể của đương số.',
    'PHỤ MẪU': 'Cung cha mẹ, phản ánh quan hệ với cha mẹ, gia phong, sự giáo dục từ nhỏ.',
    'PHÚC ĐỨC': 'Cung phúc phần, phản ánh phúc đức tổ tiên để lại, đời sống tinh thần, tâm linh.',
    'ĐIỀN TRẠCH': 'Cung nhà cửa, đất đai, bất động sản, tài sản cố định.',
    'QUAN LỘC': 'Cung sự nghiệp, công danh, đường quan, nghề nghiệp.',
    'NÔ BỘC': 'Cung bạn bè, cấp dưới, nhân viên, quan hệ xã hội.',
    'THIÊN DI': 'Cung di chuyển, xuất ngoại, quan hệ bên ngoài, xa nhà.',
    'TẬT ÁCH': 'Cung sức khỏe, bệnh tật, tai nạn, thể chất.',
    'TÀI BẠCH': 'Cung tiền bạc, thu nhập, cách kiếm tiền, quản lý tài chính.',
    'TỬ TỨC': 'Cung con cái, khả năng sinh nở, quan hệ với con.',
    'PHU THÊ': 'Cung hôn nhân, vợ chồng, đối tác, mối quan hệ tình duyên.',
    'HUYNH ĐỆ': 'Cung anh chị em, bạn thân, đồng nghiệp gần gũi.'
};

// =====================
// MÔ TẢ 12 TRƯỜNG SINH
// =====================
const TRUONG_SINH_DESCRIPTIONS = {
    'Trường Sinh': 'Khởi đầu sinh trưởng, phát triển thuận lợi, tràn đầy sức sống.',
    'Mộc Dục': 'Giai đoạn tắm rửa, làm sạch — biến đổi, bất ổn nhẹ nhưng cần thiết.',
    'Quan Đới': 'Đội mũ, mang đai — bắt đầu trưởng thành, có trách nhiệm.',
    'Lâm Quan': 'Ra làm quan — sự nghiệp phát triển mạnh, đỉnh cao sức lực.',
    'Đế Vượng': 'Cực thịnh, đỉnh cao nhất — tốt nhưng vật cực tắc phản.',
    'Suy': 'Bắt đầu đi xuống, sức lực giảm dần, cần bảo tồn.',
    'Bệnh': 'Ốm yếu, suy giảm — cần chú ý sức khỏe, không nên mạo hiểm.',
    'Tử': 'Suy kiệt, tĩnh lặng — giai đoạn tĩnh, nghỉ ngơi, không phát triển.',
    'Mộ': 'Cất giấu, tích trữ — tiềm ẩn, chưa phát, nên tích lũy.',
    'Tuyệt': 'Dứt hẳn, tận cùng — nhưng cũng là khởi đầu cho chu kỳ mới.',
    'Thai': 'Mầm mống, hoài thai — bắt đầu hình thành, tiềm năng mới.',
    'Dưỡng': 'Nuôi dưỡng, trưởng thành — chuẩn bị cho giai đoạn sinh ra.'
};

// =====================
// MÔ TẢ TUẦN TRIỆT
// =====================
const TUAN_TRIET_DESCRIPTIONS = {
    'Tuần': 'Tuần trung: Vùng ẩn tàng, sao bị che khuất. Hung tinh gặp Tuần thì bớt hung, cát tinh gặp Tuần thì chậm phát.',
    'Triệt': 'Triệt lộ: Vùng bị cắt đứt, sao trong cung bị giảm lực. Gặp cát tinh thì giảm tốt, gặp hung tinh thì giảm xấu.'
};
