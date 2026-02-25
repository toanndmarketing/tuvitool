/**
 * ============================================
 * TỬ VI TINH HỆ - Lục Thập Tinh Hệ (v1.0: 20 bộ)
 * Module hóa 14 chính tinh thành 20 tổ hợp phổ biến
 * Nguồn: Vương Đình Chi - Đẩu Số Lục Thập Tinh Hệ
 * ============================================
 */

const TuViTinhHe = (function () {
    'use strict';

    // =====================
    // 20 TINH HỆ PHỔ BIẾN v1.0
    // =====================

    const TINH_HE_DATA = [
        // ===== TỬ VI HỆ =====
        {
            id: 'tu-phu',
            name: 'Tử Phủ',
            stars: ['Tử Vi', 'Thiên Phủ'],
            palaces: [2, 8], // Dần, Thân
            archetype: 'Quân vương tề gia',
            profile: 'Đương số mang khí chất lãnh đạo bẩm sinh, vừa có uy quyền của Tử Vi vừa có sự ổn định của Thiên Phủ. Tính cách trầm ổn, biết cách quản lý và thu phục lòng người. Thích hợp làm quản lý, chủ doanh nghiệp, hoặc vị trí có ảnh hưởng. Đời sống vật chất thường đầy đủ, ít thiếu thốn.',
            strengths: ['Lãnh đạo bẩm sinh', 'Ổn định tài chính', 'Uy tín cao', 'Được quý nhân giúp đỡ'],
            weaknesses: ['Kiêu ngạo tiềm ẩn', 'Khó chịu khi bị người khác chỉ dạo', 'Dễ tự mãn'],
            byPalace: {
                'MỆNH': 'Con người đĩnh đạc, khí chất vương giả. Cuộc đời ổn định, ít sóng gió lớn. Phù hợp vai trò lãnh đạo.',
                'QUAN LỘC': 'Sự nghiệp vững chắc, dễ đạt vị trí cao. Thường là chủ doanh nghiệp hoặc quản lý cấp cao.',
                'TÀI BẠCH': 'Tài chính dồi dào, có nhiều nguồn thu. Khéo quản lý tiền bạc, ít khi thiếu thốn.',
                'PHU THÊ': 'Đối tượng có khí chất, gia cảnh tốt. Hôn nhân ổn định nhưng cần tránh gia trưởng.'
            }
        },
        {
            id: 'tu-pha',
            name: 'Tử Phá',
            stars: ['Tử Vi', 'Phá Quân'],
            palaces: [3, 9], // Mão, Dậu
            archetype: 'Tiên phá hậu thành',
            profile: 'Đương số có tính cách quyết đoán và dám phá vỡ khuôn mẫu. Tử Vi mang uy quyền, Phá Quân mang tính cách mạng — tạo nên con người không chấp nhận sự bình thường. Đời sống nhiều biến động nhưng thường có kết quả tốt đẹp cuối cùng.',
            strengths: ['Can đảm đổi mới', 'Sáng tạo', 'Lãnh đạo kiểu đổi mới', 'Không ngại thử thách'],
            weaknesses: ['Bốc đồng', 'Khó thỏa hiệp', 'Dễ gây đổ vỡ trước khi xây'],
            byPalace: {
                'MỆNH': 'Con người phá cách, tiên phong. Cuộc đời tiên phá hậu thành — phải trải biến cố mới thành công.',
                'QUAN LỘC': 'Sự nghiệp nhiều biến động, thích hợp lĩnh vực đổi mới, startup, technology.',
                'TÀI BẠCH': 'Tài chính lên xuống thất thường. Có thể phát tài lớn nhưng cũng dễ mất lớn.',
                'PHU THÊ': 'Hôn nhân sóng gió giai đoạn đầu, ổn định dần về sau. Cần người bạn đời bao dung.'
            }
        },
        {
            id: 'tu-sat',
            name: 'Tử Sát',
            stars: ['Tử Vi', 'Thất Sát'],
            palaces: [5, 11], // Tỵ, Hợi
            archetype: 'Đế tọa sát quyền',
            profile: 'Đương số phi thường về ý chí và quyết tâm. Tử Vi là vua, Thất Sát là tướng — khi hợp nhất tạo nên con người vừa có quyền uy vừa có sức mạnh hành động. Thường thành đạt trong lĩnh vực cần quyết đoán và dám chấp nhận rủi ro.',
            strengths: ['Ý chí vượt trội', 'Quyết đoán', 'Thành đạt sớm', 'Bản lĩnh phi thường'],
            weaknesses: ['Cô độc trên đỉnh', 'Áp lực tự tạo', 'Khó tin người'],
            byPalace: {
                'MỆNH': 'Con người bản lĩnh, quyết đoán. Cuộc đời nhiều thử thách nhưng thành tựu lớn. Dễ giàu nhưng cũng dễ cô đơn.',
                'QUAN LỘC': 'Sự nghiệp thuộc top đầu, phù hợp quân sự, an ninh, hoặc CEO. Áp lực lớn nhưng thành công xứng đáng.'
            }
        },
        {
            id: 'tu-tham',
            name: 'Tử Tham',
            stars: ['Tử Vi', 'Tham Lang'],
            palaces: [3, 9], // Mão, Dậu (xung chiếu)
            archetype: 'Đào hoa kề ngai vàng',
            profile: 'Đương số có đời sống phong phú về vật chất lẫn tình cảm. Tử Vi là uy quyền, Tham Lang là ham muốn — tạo nên con người vừa có địa vị vừa ham hưởng thụ. Nếu biết tiết chế, đây là cách cục rất tốt cho kinh doanh giải trí, ẩm thực, nghệ thuật.',
            strengths: ['Giao tiếp xuất sắc', 'Duyên dáng', 'Kinh doanh giỏi', 'Đa tài'],
            weaknesses: ['Ham vui', 'Dễ sa đà', 'Tình cảm phức tạp'],
            byPalace: {
                'MỆNH': 'Con người đa tài, duyên dáng. Thích hưởng thụ nhưng vẫn biết cách kiếm tiền. Cần cảnh giác đào hoa.',
                'PHU THÊ': 'Đối tượng quyến rũ, cuốn hút. Tình cảm nhiều sóng gió nhưng đời sống phong phú.'
            }
        },

        // ===== THIÊN CƠ HỆ =====
        {
            id: 'co-luong',
            name: 'Cơ Lương',
            stars: ['Thiên Cơ', 'Thiên Lương'],
            palaces: [4, 10], // Thìn, Tuất
            archetype: 'Quân sư mưu lược',
            profile: 'Đương số có trí tuệ sắc sảo và tâm hồn nhân hậu. Thiên Cơ là mưu lược, Thiên Lương là lương thiện — tạo nên con người vừa thông minh vừa có đạo đức. Phù hợp nghề tư vấn, giáo dục, y tế, hoặc nghiên cứu.',
            strengths: ['Trí tuệ cao', 'Nhân hậu', 'Phân tích giỏi', 'Được tin tưởng'],
            weaknesses: ['Hay lo lắng', 'Thiếu quyết đoán', 'Nghĩ nhiều hơn làm'],
            byPalace: {
                'MỆNH': 'Con người thông minh, hay suy tư. Phù hợp công việc trí tuệ. Cần tránh overthinking.',
                'QUAN LỘC': 'Sự nghiệp ổn định trong lĩnh vực giáo dục, y tế, tư vấn. Được đồng nghiệp nể trọng.'
            }
        },
        {
            id: 'co-cu',
            name: 'Cơ Cự',
            stars: ['Thiên Cơ', 'Cự Môn'],
            palaces: [3, 9], // Mão, Dậu
            archetype: 'Biện tài vô song',
            profile: 'Đương số có khẩu tài xuất chúng, biện luận giỏi. Thiên Cơ cho trí mưu, Cự Môn cho khả năng ăn nói — phù hợp luật sư, MC, giảng viên, sales. Nhưng dễ gây thị phi nếu không kiểm soát lời nói.',
            strengths: ['Ăn nói giỏi', 'Phân tích sắc bén', 'Thuyết phục'],
            weaknesses: ['Thị phi', 'Hay cãi', 'Đa nghi'],
            byPalace: {
                'MỆNH': 'Con người ăn nói sắc sảo, thích tranh luận. Dễ thành công bằng miệng nhưng cũng dễ thất bại vì miệng.',
                'QUAN LỘC': 'Phù hợp nghề truyền thông, pháp luật, giảng dạy. Cần tránh thị phi nơi công sở.'
            }
        },
        {
            id: 'co-am',
            name: 'Cơ Âm',
            stars: ['Thiên Cơ', 'Thái Âm'],
            palaces: [2, 8], // Dần, Thân
            archetype: 'Nghệ sĩ mơ mộng',
            profile: 'Đương số nhạy cảm, giàu cảm xúc và trí tưởng tượng. Thiên Cơ là trí tuệ, Thái Âm là tình cảm — tạo nên tâm hồn nghệ sĩ. Phù hợp lĩnh vực nghệ thuật, thiết kế, sáng tạo nội dung.',
            strengths: ['Sáng tạo', 'Nhạy cảm', 'Tinh tế', 'Giàu cảm xúc'],
            weaknesses: ['Dễ dao động', 'Hay buồn', 'Thiếu thực tế'],
            byPalace: {
                'MỆNH': 'Con người tinh tế, mơ mộng. Tâm hồn nghệ sĩ. Cần người bạn đời thực tế để cân bằng.',
                'TÀI BẠCH': 'Kiếm tiền nhờ sáng tạo nhưng không ổn định. Cần quản lý tài chính cẩn thận.'
            }
        },

        // ===== THÁI DƯƠNG + THÁI ÂM =====
        {
            id: 'nhat-nguyet',
            name: 'Nhật Nguyệt',
            stars: ['Thái Dương', 'Thái Âm'],
            palaces: [1, 7], // Sửu, Mùi
            archetype: 'Âm Dương hài hòa',
            profile: 'Đương số được cha mẹ phù hộ mạnh mẽ. Thái Dương là cha/nam, Thái Âm là mẹ/nữ — khi cùng cung tạo sự cân bằng Âm Dương. Đặc biệt luận về gia đình, cha mẹ, và phúc đức.',
            strengths: ['Gia đình hỗ trợ', 'Cân bằng', 'Phúc đức tốt', 'Ôn hòa'],
            weaknesses: ['Lệ thuộc gia đình', 'Thiếu cá tính', 'Khó tự lập'],
            byPalace: {
                'MỆNH': 'Con người ôn hòa, hiền lành. Phúc đức cha mẹ tốt. Cần phát triển cá tính riêng.',
                'PHỤ MẪU': 'Cha mẹ hài hòa, gia đình ấm áp. Được thừa hưởng nhiều từ gia đình.',
                'PHÚC ĐỨC': 'Phúc đức rất dày, tổ tiên phù hộ. Đời sống tinh thần phong phú.'
            }
        },

        // ===== VŨ KHÚC HỆ =====
        {
            id: 'vu-tuong',
            name: 'Vũ Tướng',
            stars: ['Vũ Khúc', 'Thiên Tướng'],
            palaces: [2, 8], // Dần, Thân
            archetype: 'Tướng quân tài cán',
            profile: 'Đương số có năng lực quản lý tài chính xuất sắc kết hợp với tính cách ngay thẳng. Vũ Khúc là tiền tài, Thiên Tướng là chính trực — rất phù hợp ngành tài chính, ngân hàng, kế toán.',
            strengths: ['Quản lý tiền giỏi', 'Chính trực', 'Đáng tin cậy'],
            weaknesses: ['Cứng nhắc', 'Khó linh hoạt', 'Stress vì trách nhiệm'],
            byPalace: {
                'MỆNH': 'Con người ngay thẳng, có trách nhiệm. Giỏi quản lý nhưng hơi cứng nhắc.',
                'TÀI BẠCH': 'Tài chính ổn định, quản lý tốt. Phù hợp đầu tư an toàn.'
            }
        },
        {
            id: 'vu-sat',
            name: 'Vũ Sát',
            stars: ['Vũ Khúc', 'Thất Sát'],
            palaces: [3, 9], // Mão, Dậu
            archetype: 'Chiến tướng tài ba',
            profile: 'Đương số có quyết tâm sắt đá trong việc kiếm tiền và xây dựng sự nghiệp. Vũ Khúc + Thất Sát đều là sao "kim" tính — mạnh mẽ, quyết liệt, không ngại va chạm.',
            strengths: ['Quyết đoán', 'Kiếm tiền giỏi', 'Bản lĩnh'],
            weaknesses: ['Cô đơn', 'Hay xung đột', 'Khó thỏa hiệp'],
            byPalace: {
                'MỆNH': 'Con người mạnh mẽ, quyết liệt. Thành công nhờ bản lĩnh nhưng đời sống tình cảm cô đơn.',
                'QUAN LỘC': 'Sự nghiệp đột phá, phù hợp kinh doanh độc lập hoặc ngành cạnh tranh cao.'
            }
        },
        {
            id: 'vu-tham',
            name: 'Vũ Tham',
            stars: ['Vũ Khúc', 'Tham Lang'],
            palaces: [1, 7], // Sửu, Mùi
            archetype: 'Thương gia đào hoa',
            profile: 'Đương số vừa giỏi kiếm tiền vừa biết hưởng thụ. Vũ Khúc mang tài lộc, Tham Lang mang ham muốn và đào hoa. Rất giỏi kinh doanh, đặc biệt ngành dịch vụ, giải trí, ẩm thực.',
            strengths: ['Kinh doanh giỏi', 'Giao tiếp tốt', 'Đa tài', 'Biết hưởng thụ'],
            weaknesses: ['Đào hoa', 'Ham vui', 'Dễ tiêu hoang'],
            byPalace: {
                'MỆNH': 'Con người đa tài, biết kiếm tiền biết xài tiền. Đào hoa là điểm cần kiểm soát.',
                'TÀI BẠCH': 'Tài chính phong phú nhưng hay tiêu hoang. Cần kỷ luật chi tiêu.'
            }
        },
        {
            id: 'vu-pha',
            name: 'Vũ Phá',
            stars: ['Vũ Khúc', 'Phá Quân'],
            palaces: [5, 11], // Tỵ, Hợi
            archetype: 'Phá để xây tài',
            profile: 'Đương số có tài năng kiếm tiền bằng cách phá vỡ khuôn mẫu cũ. Vũ Khúc là tiền, Phá Quân là phá — kiếm tiền bằng cách tạo ra thị trường mới, sản phẩm mới.',
            strengths: ['Đổi mới tài chính', 'Dám thử', 'Sáng tạo kinh doanh'],
            weaknesses: ['Tài chính bất ổn', 'Dễ phá sản rồi làm lại', 'Liều lĩnh'],
            byPalace: {
                'MỆNH': 'Cuộc đời nhiều biến động tài chính. Phá rồi xây, xây rồi phá — nhưng cuối cùng thường thành công.',
                'TÀI BẠCH': 'Tài chính lên xuống thất thường. Cần quỹ dự phòng. Phù hợp kinh doanh mạo hiểm.'
            }
        },

        // ===== THIÊN ĐỒNG HỆ =====
        {
            id: 'dong-luong',
            name: 'Đồng Lương',
            stars: ['Thiên Đồng', 'Thiên Lương'],
            palaces: [2, 8], // Dần, Thân
            archetype: 'Phúc hậu nhân đức',
            profile: 'Đương số hiền lành, phúc đức dày. Thiên Đồng an nhàn + Thiên Lương nhân đức — con người thích cuộc sống yên bình, giàu lòng trắc ẩn. Phù hợp ngành giáo dục, y tế, từ thiện.',
            strengths: ['Hiền lành', 'Phúc đức', 'Được yêu quý', 'An nhiên'],
            weaknesses: ['Thụ động', 'Thiếu tham vọng', 'Dễ bị lợi dụng'],
            byPalace: {
                'MỆNH': 'Con người hiền hậu, sống thanh đạm. Ít tham vọng nhưng cuộc đời bình an. Phúc đức gia đình tốt.',
                'PHÚC ĐỨC': 'Phúc đức rất dày, tâm hồn thanh thản. Phù hợp tu tâm dưỡng tính.'
            }
        },
        {
            id: 'dong-am',
            name: 'Đồng Âm',
            stars: ['Thiên Đồng', 'Thái Âm'],
            palaces: [0, 6], // Tý, Ngọ
            archetype: 'Thủy nhu đa cảm',
            profile: 'Đương số giàu cảm xúc, tinh tế và mơ mộng. Hai sao "thủy" tính — nhu mì, nhạy cảm. Phù hợp lĩnh vực nghệ thuật, âm nhạc, văn chương.',
            strengths: ['Nhạy cảm', 'Nghệ thuật', 'Tinh tế', 'Giàu tình cảm'],
            weaknesses: ['Yếu đuối', 'Dễ buồn', 'Thiếu quyết đoán', 'Hay dao động'],
            byPalace: {
                'MỆNH': 'Con người mềm mại, đa cảm. Năng khiếu nghệ thuật cao. Cần môi trường ổn định.',
                'PHU THÊ': 'Tình cảm lãng mạn nhưng dễ tổn thương. Cần đối tượng nhẹ nhàng, thấu hiểu.'
            }
        },
        {
            id: 'dong-cu',
            name: 'Đồng Cự',
            stars: ['Thiên Đồng', 'Cự Môn'],
            palaces: [3, 9], // Mão, Dậu
            archetype: 'An nhàn mà hay lo',
            profile: 'Đương số muốn sống an nhàn (Thiên Đồng) nhưng lại hay lo nghĩ, thắc mắc (Cự Môn). Mâu thuẫn nội tại — vừa muốn nghỉ ngơi vừa không yên tâm. Cần học cách buông bỏ.',
            strengths: ['Phân tích tốt', 'Thận trọng', 'Biết lo xa'],
            weaknesses: ['Lo lắng quá mức', 'Hay nghi ngờ', 'Khó thư giãn'],
            byPalace: {
                'MỆNH': 'Con người thân thiện bề ngoài nhưng hay lo nghĩ bên trong. Cần tập thiền hoặc yoga.',
                'TẬT ÁCH': 'Sức khỏe tinh thần cần chú ý. Dễ stress, mất ngủ, lo âu.'
            }
        },

        // ===== LIÊM TRINH HỆ =====
        {
            id: 'liem-tham',
            name: 'Liêm Tham',
            stars: ['Liêm Trinh', 'Tham Lang'],
            palaces: [5, 11], // Tỵ, Hợi
            archetype: 'Đào hoa lửa cháy',
            profile: 'Đương số sống mãnh liệt về tình cảm. Liêm Trinh là lửa + Tham Lang là đào hoa — tạo nên con người nồng nhiệt, quyến rũ, sống hết mình. Giỏi trong lĩnh vực nghệ thuật biểu diễn, giải trí.',
            strengths: ['Quyến rũ', 'Nhiệt huyết', 'Sáng tạo', 'Đam mê'],
            weaknesses: ['Đào hoa nặng', 'Dễ sa vào tình ái', 'Nóng nảy'],
            byPalace: {
                'MỆNH': 'Con người nồng nhiệt, đam mê. Đào hoa mạnh. Cần kiểm soát cảm xúc.',
                'PHU THÊ': 'Hôn nhân nhiều sóng gió tình ái. Cần tìm đối tượng hiểu và chấp nhận.'
            }
        },
        {
            id: 'liem-sat',
            name: 'Liêm Sát',
            stars: ['Liêm Trinh', 'Thất Sát'],
            palaces: [1, 7], // Sửu, Mùi
            archetype: 'Hỏa Sát uy quyền',
            profile: 'Đương số mạnh mẽ và dũng cảm. Liêm Trinh (lửa) + Thất Sát (kim) — cương trực, không sợ đối đầu. Phù hợp ngành quân sự, an ninh, phẫu thuật, hoặc kinh doanh cạnh tranh.',
            strengths: ['Dũng cảm', 'Uy dũng', 'Quyết đoán'],
            weaknesses: ['Hung hãn', 'Độc đoán', 'Dễ va chạm'],
            byPalace: {
                'MỆNH': 'Con người cương trực, không ngại va chạm. Thường thành đạt trong môi trường áp lực cao.',
                'TẬT ÁCH': 'Sức khỏe liên quan lửa: tim mạch, huyết áp. Cần kiểm tra định kỳ.'
            }
        },
        {
            id: 'liem-pha',
            name: 'Liêm Phá',
            stars: ['Liêm Trinh', 'Phá Quân'],
            palaces: [3, 9], // Mão, Dậu
            archetype: 'Đốt đồng mở lối',
            profile: 'Đương số sống mãnh liệt với khát vọng thay đổi. Liêm Trinh đốt cháy, Phá Quân phá vỡ — đời sống đầy biến động. Tiên phá hậu thành nhưng quá trình gian nan.',
            strengths: ['Dám mạo hiểm', 'Tạo ra cái mới', 'Không ngại khó'],
            weaknesses: ['Biến động lớn', 'Dễ phá hỏng quan hệ', 'Bốc đồng'],
            byPalace: {
                'MỆNH': 'Cuộc đời nhiều biến cố. Không có đường nào bằng phẳng nhưng mỗi biến cố là một bài học.',
                'QUAN LỘC': 'Sự nghiệp nhiều lần thay đổi. Phù hợp ngành cần cải cách, đổi mới.'
            }
        },

        // ===== TỔ HỢP KHÁC =====
        {
            id: 'sat-pha',
            name: 'Sát Phá',
            stars: ['Thất Sát', 'Phá Quân'],
            palaces: [5, 11], // Tỵ, Hợi (xung chiếu)
            archetype: 'Tướng quân xông pha',
            profile: 'Đương số có bản lĩnh phi thường, dám lao vào nơi nguy hiểm. Thất Sát + Phá Quân đều là sao "sát" — tạo ra con người không biết sợ. Vận mệnh có nhiều thử thách nhưng ai vượt qua sẽ thành tựu lớn.',
            strengths: ['Bản lĩnh phi thường', 'Dám làm dám chịu', 'Kiên cường'],
            weaknesses: ['Hung hãn', 'Cô đơn', 'Nhiều kẻ thù'],
            byPalace: {
                'MỆNH': 'Con người mạnh mẽ phi thường, đời sống nhiều sóng gió. Thành công từ gian khổ.',
                'QUAN LỘC': 'Sự nghiệp khốc liệt, phù hợp lĩnh vực cần bản lĩnh: quân đội, thể thao, kinh doanh mạo hiểm.'
            }
        },
        {
            id: 'cu-nhat',
            name: 'Cự Nhật',
            stars: ['Cự Môn', 'Thái Dương'],
            palaces: [2, 8], // Dần, Thân
            archetype: 'Mặt trời xua bóng tối',
            profile: 'Đương số có khả năng hóa giải bóng tối (Cự Môn = thị phi) bằng ánh sáng (Thái Dương = quang minh). Cự Nhật miếu = thị phi hóa thành danh tiếng. Cự Nhật hãm = thị phi khó gỡ.',
            strengths: ['Ăn nói giỏi + uy tín', 'Biến thị phi thành danh', 'Ngoại giao xuất sắc'],
            weaknesses: ['Nhiều thị phi', 'Dễ bị đồn đại', 'Phụ thuộc miếu/hãm'],
            byPalace: {
                'MỆNH': 'Miếu: Con người quang minh, được nể trọng. Hãm: Thị phi bủa vây, cần cẩn trọng lời nói.',
                'QUAN LỘC': 'Phù hợp nghề truyền thông, ngoại giao, phát ngôn. Thành/bại đều bởi miệng.'
            }
        }
    ];

    // =====================
    // LOGIC FUNCTIONS
    // =====================

    /**
     * Xác định tinh hệ tại 1 cung dựa trên chính tinh trong cung
     * @param {number} cungPos - Vị trí cung (0-11)
     * @param {Object} saoMap - Map sao
     * @returns {Object|null} Tinh hệ object hoặc null nếu không tìm thấy
     */
    function getTinhHe(cungPos, saoMap) {
        if (!saoMap || !saoMap[cungPos]) return null;

        var chinhTinh = [];
        var saoList = saoMap[cungPos] || [];

        for (var i = 0; i < saoList.length; i++) {
            if (saoList[i].type === 'chinh') {
                chinhTinh.push(saoList[i].name);
            }
        }

        if (chinhTinh.length === 0) {
            // Vô Chính Diệu
            return {
                id: 'vcd',
                name: 'Vô Chính Diệu',
                stars: [],
                archetype: 'Trống rỗng chờ chiếu',
                profile: 'Cung Vô Chính Diệu — cần xem tam hợp và xung chiếu để đánh giá. Đây là cung "trống" về chính tinh, tốt hay xấu phụ thuộc hoàn toàn vào sao chiếu tới.',
                strengths: ['Linh hoạt', 'Chịu ảnh hưởng tốt nếu có cát tinh chiếu'],
                weaknesses: ['Thiếu chủ đạo', 'Phụ thuộc ngoại lực'],
                byPalace: {}
            };
        }

        // Tìm trong database
        for (var t = 0; t < TINH_HE_DATA.length; t++) {
            var th = TINH_HE_DATA[t];
            var matchCount = 0;

            for (var s = 0; s < th.stars.length; s++) {
                if (chinhTinh.indexOf(th.stars[s]) >= 0) {
                    matchCount++;
                }
            }

            // Match tất cả sao của tinh hệ
            if (matchCount === th.stars.length) {
                return th;
            }
        }

        // Không tìm thấy trong database → trả về chính tinh đơn
        if (chinhTinh.length === 1) {
            return {
                id: 'don-' + chinhTinh[0].toLowerCase().replace(/\s/g, '-'),
                name: chinhTinh[0] + ' độc tọa',
                stars: chinhTinh,
                archetype: chinhTinh[0] + ' một mình cai quản cung',
                profile: chinhTinh[0] + ' độc tọa tại cung — sao phát huy tối đa tính chất riêng, không bị pha trộn. Cần xem miếu/hãm và phụ tinh đi kèm.',
                strengths: ['Tính chất thuần khiết'],
                weaknesses: ['Thiếu bổ trợ'],
                byPalace: {}
            };
        }

        // Nhiều chính tinh nhưng chưa có trong database
        return {
            id: 'other-' + chinhTinh.join('-').toLowerCase().replace(/\s/g, '-'),
            name: chinhTinh.join(' + '),
            stars: chinhTinh,
            archetype: 'Đang cập nhật',
            profile: 'Tổ hợp ' + chinhTinh.join(' + ') + ' — chưa có trong cơ sở dữ liệu tinh hệ v1.0. Đang phát triển thêm.',
            strengths: [],
            weaknesses: [],
            byPalace: {}
        };
    }

    /**
     * Lấy text luận giải tinh hệ theo cung
     * @param {string} tinhHeId - ID tinh hệ
     * @param {string} cungName - Tên cung (VD: 'MỆNH', 'TÀI BẠCH')
     * @returns {string} Text luận giải
     */
    function getProfileText(tinhHeId, cungName) {
        for (var i = 0; i < TINH_HE_DATA.length; i++) {
            if (TINH_HE_DATA[i].id === tinhHeId) {
                var th = TINH_HE_DATA[i];
                // Thử lấy luận giải theo cung
                if (th.byPalace && th.byPalace[cungName]) {
                    return th.byPalace[cungName];
                }
                // Fallback: profile chung
                return th.profile;
            }
        }
        return '';
    }

    /**
     * Lấy tinh hệ cho tất cả 12 cung
     * @returns {Object} { 0: tinhHe, 1: tinhHe, ... }
     */
    function getAllTinhHe(saoMap) {
        var result = {};
        for (var i = 0; i < 12; i++) {
            result[i] = getTinhHe(i, saoMap);
        }
        return result;
    }

    // =====================
    // EXPORTS
    // =====================

    return {
        getTinhHe: getTinhHe,
        getProfileText: getProfileText,
        getAllTinhHe: getAllTinhHe,
        TINH_HE_DATA: TINH_HE_DATA
    };
})();
