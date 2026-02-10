/**
 * ============================================
 * TỬ VI TEMPLATES - Mẫu lời luận giải
 * Phong cách chuyên gia lâu năm, điềm đạm, sắc sảo
 * ============================================
 */

const TuViTemplates = (function () {
    'use strict';

    // =====================
    // SEVERITY CONFIG
    // =====================

    const SEVERITY = {
        critical: { prefix: '⚠️', label: 'Cần lưu ý đặc biệt', cssClass: 'event-critical', color: '#DC143C' },
        important: { prefix: '📌', label: 'Đáng chú ý', cssClass: 'event-important', color: '#FF8C00' },
        info: { prefix: '💡', label: 'Gợi ý', cssClass: 'event-info', color: '#4169E1' }
    };

    // =====================
    // TEMPLATES LUẬN GIẢI THEO EVENT ID
    // =====================
    // Mỗi template có 3 variant: long (chi tiết), short (tóm tắt), advice (lời khuyên)
    // Dùng placeholder: {cung}, {sao}, {sao_list}, {nam_xem}, {dai_van_cung}, {tieu_van_cung}

    const TEMPLATES = {
        // ========== NHÓM ĐỊA ỐC & ÂM PHẦN ==========

        RS01: {
            long: 'Đương số có dấu hiệu thay đổi về nhà cửa trong giai đoạn này. Cung Điền Trạch có {sao_list} hội tụ, gợi ý việc sửa sang, xây dựng hoặc cải tạo nơi ở. Đây là xu hướng tự nhiên của lá số, không phải điềm xấu.',
            short: 'Có xu hướng sửa nhà hoặc thay đổi nơi ở do {sao_list} tại Điền Trạch.',
            advice: 'Nên chọn ngày tốt để khởi công. Tránh hướng Thái Tuế. Nếu chưa có kế hoạch cụ thể, đây là thời điểm tốt để lên phương án.'
        },
        RS02: {
            long: 'Lá số cho thấy cơ hội tốt về bất động sản. {sao_list} hội tại cung Điền Trạch và Tài Bạch, tạo nên thế vượng cho việc mua bán đất đai, nhà cửa. Tài Lộc chiếu Điền gợi ý nguồn tài chính sẽ đến để hiện thực hóa.',
            short: 'Cơ hội đầu tư bất động sản với {sao_list} vượng tại Điền/Tài.',
            advice: 'Nên tìm hiểu kỹ trước khi quyết định. Hướng tốt: theo cung có Lộc Tồn. Tháng có Lưu Thiên Mã qua Điền Trạch là thời điểm vàng.'
        },
        RS03: {
            long: 'Đương số cần đặc biệt lưu ý về phần mồ mả tổ tiên. Bộ {sao_list} hội tại cung Phúc Đức là dấu hiệu rõ rệt về phần mộ bất ổn. Âm phần có thể bị ảnh hưởng bởi ngoại cảnh (ngập nước, sạt lở, cây cối xâm lấn) hoặc có vấn đề cần tu sửa. Tổ tiên có phần chưa được yên, ảnh hưởng đến vận khí con cháu.',
            short: 'Mồ mả tổ tiên cần được quan tâm. {sao_list} tại Phúc Đức cảnh báo âm phần bất ổn.',
            advice: 'Nên đi thăm viếng, tu sửa mộ phần sớm. Cúng giỗ chu đáo hơn. Nếu lâu không đi tảo mộ, nên sắp xếp trong thời gian gần. Có thể mời thầy phong thủy xem lại vị trí mộ.'
        },
        RS04: {
            long: 'Lá số gợi ý về việc thờ cúng và bàn thờ gia tiên. Bộ {sao_list} tại cung {cung} liên quan đến việc lập mới hoặc sửa sang bàn thờ. Đây là hướng cát, nếu thực hiện đúng cách sẽ tăng phúc đức cho gia đình.',
            short: 'Nên xem xét sắp xếp bàn thờ gia tiên. {sao_list} tại {cung} gợi ý hỷ sự tâm linh.',
            advice: 'Nên chọn ngày tốt, mời thầy xem hướng thờ phù hợp. Tránh tự ý di chuyển bàn thờ khi chưa xem ngày.'
        },
        RS05: {
            long: 'Đương số có dấu hiệu cần thay đổi vị trí thờ phụng trong nhà. {sao_list} tại cung Phúc Đức và Thiên Di gợi ý sự di dời hoặc thay đổi bàn thờ là cần thiết. Có thể do chuyển nhà, sửa nhà, hoặc bàn thờ hiện tại không đúng vị trí phong thủy.',
            short: 'Cần xem xét thay đổi vị trí bàn thờ do {sao_list} tại Phúc/Thiên Di.',
            advice: 'Nhất định phải mời thầy phong thủy trước khi di dời bàn thờ. Chọn ngày Hoàng Đạo, tránh tháng 7 Âm.'
        },
        RS06: {
            long: 'Đây là cảnh báo nghiêm trọng về phần tâm linh. Bộ {sao_list} tại cung Phúc Đức cho thấy phần mộ tổ tiên đang gặp vấn đề đáng lo ngại. Có thể mộ bị xâm phạm, động chạm, hoặc có hiện tượng bất thường liên quan đến âm phần. Ảnh hưởng trực tiếp đến sức khỏe và vận khí của đương số và gia đình.',
            short: 'Cảnh báo: {sao_list} tại Phúc Đức → phần mộ tổ tiên có vấn đề nghiêm trọng.',
            advice: 'Cần kiểm tra phần mộ gấp. Nếu có hiện tượng bất thường (mộ nứt, nước ngập, đất sụt), cần tu sửa ngay. Nên cúng giải hạn, làm lễ an vị cho tổ tiên.'
        },
        RS07: {
            long: 'Lá số cho thấy vận về gia sản và tài sản gia đình. {sao_list} tại cung Điền Trạch và Phúc Đức gợi ý khả năng nhận thừa kế, chia tài sản, hoặc được hưởng phúc từ tổ tiên. Đây thường là dấu hiệu thuận lợi.',
            short: 'Có cơ hội về gia sản, thừa kế do {sao_list} tại Điền/Phúc.',
            advice: 'Nên giữ hòa khí trong gia đình, tránh tranh chấp. Bàn bạc với gia đình về vấn đề tài sản một cách cởi mở.'
        },

        // ========== NHÓM SỨC KHỎE ==========

        H01: {
            long: 'Đương số cần đặc biệt cẩn trọng về an toàn thân thể. Bộ {sao_list} tại cung Tật Ách cảnh báo nguy cơ tai nạn liên quan đến chân tay, xương khớp. Kình Dương chủ về đao kiếm, va chạm. Kết hợp với hung tinh khác, nên đề phòng gãy xương, bong gân.',
            short: 'Đề phòng tai nạn: {sao_list} tại Tật Ách cảnh báo chân tay, xương khớp.',
            advice: 'Cẩn trọng khi lái xe, di chuyển. Tránh các hoạt động mạo hiểm, thể thao nguy hiểm. Nên khám sức khỏe xương khớp định kỳ.'
        },
        H02: {
            long: 'Có dấu hiệu về khả năng phải phẫu thuật hoặc can thiệp y khoa. Bộ {sao_list} tại Tật Ách với Thiên Hình (dao kéo) và Bạch Hổ (máu me) gợi ý ca mổ. Không nhất thiết là xấu — có thể là mổ chủ động để cải thiện sức khỏe.',
            short: 'Dấu hiệu phẫu thuật: {sao_list} tại Tật Ách. Nên chủ động khám.',
            advice: 'Nên chủ động khám sức khỏe tổng quát. Nếu có bệnh cần mổ, đây là năm nên làm. Chọn bệnh viện uy tín, bác sĩ giỏi.'
        },
        H03: {
            long: 'Lá số cảnh báo về sức khỏe hệ tuần hoàn. {sao_list} tại Tật Ách liên quan đến máu huyết, tim mạch, huyết áp. Liêm Trinh chủ máu, kết hợp hung tinh gợi ý vấn đề về hệ tuần hoàn cần được theo dõi.',
            short: 'Lưu ý tim mạch, huyết áp: {sao_list} tại Tật Ách cảnh báo máu huyết.',
            advice: 'Khám tim mạch định kỳ. Kiểm soát huyết áp. Tránh stress, rượu bia. Chú ý chế độ ăn lành mạnh.'
        },
        H04: {
            long: 'Đương số cần chú ý bảo vệ thị lực. Thái Dương trong Tử Vi chủ về mắt, khi ở trạng thái hãm hoặc gặp Hoá Kỵ sẽ ảnh hưởng đến thị lực. {sao_list} tại vị trí hiện tại gợi ý nên đi khám mắt.',
            short: 'Bảo vệ thị lực: Thái Dương {trạng_thái} gợi ý mắt cần chú ý.',
            advice: 'Đi khám mắt định kỳ. Giảm thời gian nhìn màn hình. Bổ sung vitamin A, B. Đeo kính bảo vệ khi ra nắng.'
        },
        H05: {
            long: 'Có hạn nhẹ về va chạm, xây xước trong sinh hoạt hàng ngày. {sao_list} tại Tật Ách không quá nghiêm trọng nhưng nên cẩn trọng hơn khi di chuyển, đặc biệt các tháng có Lưu Kình Dương đi qua.',
            short: 'Hạn nhẹ va chạm: {sao_list} tại Tật Ách. Không nghiêm trọng.',
            advice: 'Cẩn trọng khi di chuyển, đặc biệt tháng 3, 6, 9 Âm lịch. Kiểm tra phương tiện trước khi đi xa.'
        },
        H06: {
            long: 'Đương số cần khám sức khỏe toàn diện. {sao_list} kết hợp Hoá Kỵ tại Tật Ách là dấu hiệu cần đặc biệt lưu ý. Thiên Cơ Kỵ liên quan u bướu, Cự Môn Kỵ liên quan thận, tiêu hóa. Không nên chủ quan.',
            short: 'Cần khám toàn diện: {sao_list} + Hoá Kỵ tại Tật Ách cảnh báo bệnh tiềm ẩn.',
            advice: 'Khám sức khỏe tổng quát sớm nhất có thể. Đặc biệt kiểm tra các chỉ số bất thường. Phát hiện sớm = điều trị hiệu quả.'
        },
        H07: {
            long: 'Sức khỏe tinh thần cần được quan tâm. {sao_list} tại cung {cung} gợi ý đương số dễ bị stress, lo lắng, mất ngủ trong giai đoạn này. Thiên Đồng-Thiên Lương hãm → tâm trạng thất thường. Cự Môn-Đà La → suy nghĩ tiêu cực.',
            short: 'Lưu ý sức khỏe tinh thần: {sao_list} gợi ý stress, lo lắng.',
            advice: 'Dành thời gian nghỉ ngơi. Tập thiền, yoga. Chia sẻ với người thân. Nếu cần, tìm chuyên gia tâm lý hỗ trợ.'
        },

        // ========== NHÓM QUAN HỆ & THỊ PHI ==========

        RC01: {
            long: 'Đương số có nguy cơ vướng vào kiện tụng, tranh chấp pháp lý. {sao_list} ảnh hưởng cung Quan Lộc, Cự Môn chủ khẩu thiệt, khi gặp Hoá Kỵ + Thiên Hình trở nên rất nặng nề. Có thể liên quan đến hợp đồng, kinh doanh, hoặc tranh chấp cá nhân.',
            short: 'Nguy cơ kiện tụng: {sao_list} tại Quan Lộc cảnh báo pháp lý.',
            advice: 'Rà soát lại tất cả hợp đồng. Không ký kết giấy tờ quan trọng khi chưa có luật sư tư vấn. Giữ bằng chứng mọi giao dịch.'
        },
        RC02: {
            long: 'Vấn đề đất đai, bất động sản cần đặc biệt cẩn trọng. {sao_list} ảnh hưởng cung Điền Trạch gợi ý tranh chấp quyền sở hữu, ranh giới, hoặc kiện tụng liên quan đến nhà đất. Phá Quân Kỵ tại Điền → thay đổi đột ngột về tài sản.',
            short: 'Tranh chấp đất đai: {sao_list} cảnh báo vấn đề nhà đất, sở hữu.',
            advice: 'Kiểm tra sổ đỏ, giấy tờ nhà đất ngay. Không mua bán đất trong năm này nếu không chắc chắn. Giữ nguyên hiện trạng, tránh thay đổi.'
        },
        RC03: {
            long: 'Môi trường công sở có nhiều thị phi trong giai đoạn này. {sao_list} tại Quan Lộc/Nô Bộc gợi ý đồng nghiệp gây khó, bị nói xấu sau lưng, hoặc hiểu lầm với cấp trên. Cự Môn + Đà La = lời nói gây hại.',
            short: 'Thị phi công sở: {sao_list} tại Quan/Nô. Cẩn trọng lời nói.',
            advice: 'Giữ im lặng là vàng. Không tham gia bàn tán. Tập trung vào công việc, để kết quả nói thay lời. Ghi chép lại các cuộc họp quan trọng.'
        },
        RC04: {
            long: 'Quan hệ cộng sự, đối tác có sự thay đổi. {sao_list} tại Nô Bộc gợi ý có người rời đi hoặc có đối tác mới. Thiên Mã + Phá Quân = di chuyển + thay đổi mạnh trong quan hệ hợp tác.',
            short: 'Thay đổi cộng sự: {sao_list} gợi ý biến động quan hệ đối tác.',
            advice: 'Rà soát lại các thỏa thuận hợp tác. Chuẩn bị phương án dự phòng. Không đặt hết trứng vào một giỏ.'
        },
        RC05: {
            long: 'Đương số cần cẩn trọng với đối tác kinh doanh và người xung quanh. {sao_list} kết hợp Hoá Kỵ tại Nô Bộc cảnh báo nguy cơ bị lừa đảo, phản bội, hoặc mất tiền do tin người. Liêm-Tham Kỵ = bội nghĩa, tham lam.',
            short: 'Cảnh báo bội phản: {sao_list} + Kỵ tại Nô Bộc. Cẩn trọng đối tác.',
            advice: 'Không cho vay tiền lớn. Kiểm tra kỹ đối tác trước khi hợp tác. Mọi thỏa thuận phải có giấy tờ, hợp đồng rõ ràng.'
        },
        RC06: {
            long: 'Danh tiếng cần được bảo vệ. {sao_list} tại Mệnh/Quan Lộc cảnh báo nguy cơ bị tai tiếng, scandal, đặc biệt liên quan đến quan hệ tình cảm hoặc lời nói. Cự Môn Kỵ + Đào Hoa = thị phi tình ái public.',
            short: 'Nguy cơ tai tiếng: {sao_list} cảnh báo scandal, đặc biệt tình cảm.',
            advice: 'Giữ gìn hình ảnh cá nhân. Tránh quan hệ mập mờ. Cẩn trọng trên mạng xã hội. Không để người khác chụp ảnh/quay phim ở tình huống nhạy cảm.'
        },

        // ========== NHÓM HỶ TÍN ==========

        C01: {
            long: 'Đường tình cảm có nhiều thuận lợi. {sao_list} hội tại Phu Thê gợi ý hỷ sự về hôn nhân. Hồng Loan chủ hỷ, Thiên Hỷ chủ khánh, khi hội tụ là dấu hiệu mạnh về cưới hỏi, đính hôn. Nếu đã có đôi, năm nay nên tiến tới.',
            short: 'Hỷ sự tình cảm: {sao_list} tại Phu Thê. Năm thuận lợi cho cưới hỏi.',
            advice: 'Nếu đã có người yêu, đây là thời điểm vàng để kết hôn. Nếu chưa, tích cực mở rộng quan hệ xã hội. Chọn tháng có Hồng Loan đi qua Phu Thê.'
        },
        C02: {
            long: 'Đường con cái thuận lợi. {sao_list} tại Tử Tức gợi ý tin vui về con cái. Thiên Đồng miếu + Thái Âm = con ngoan, khỏe mạnh. Thai Phụ = mang thai. Nếu đang có kế hoạch sinh con, năm nay rất phù hợp.',
            short: 'Tin vui con cái: {sao_list} tại Tử Tức gợi ý sinh nở thuận lợi.',
            advice: 'Thời điểm phù hợp để sinh con. Chú ý sức khỏe thai phụ. Chọn tháng tốt nếu kế hoạch hóa gia đình.'
        },
        C03: {
            long: 'Lá số gợi ý cơ hội sắm sửa phương tiện di chuyển. {sao_list} với Thiên Mã (xe cộ, di chuyển) kết hợp Lộc Tồn (tài lộc) cho thấy thời điểm thuận lợi để mua xe hoặc phương tiện mới.',
            short: 'Cơ hội mua xe: {sao_list} gợi ý sắm phương tiện di chuyển.',
            advice: 'Chọn ngày tốt, hướng hợp mệnh để đi lấy xe. Nên mua vào tháng có Lưu Thiên Mã qua Tài Bạch.'
        },
        C04: {
            long: 'Sự nghiệp đang trên đà thăng tiến. {sao_list} tại Quan Lộc với Hoá Quyền cho thấy cơ hội thăng chức, đề bạt rõ rệt. Tử Vi chủ quý, Thái Dương miếu chủ danh, kết hợp = danh vọng tỏa sáng.',
            short: 'Cơ hội thăng tiến: {sao_list} + Hoá Quyền tại Quan Lộc.',
            advice: 'Chủ động thể hiện năng lực. Đây là thời điểm nên xin thăng chức, đổi việc tốt hơn, hoặc khởi nghiệp. Nắm bắt cơ hội, đừng do dự.'
        },
        C05: {
            long: 'Tài vận có dấu hiệu bất ngờ tốt đẹp. {sao_list} tại Tài Bạch, đặc biệt nếu có Song Lộc hội (Lộc Tồn + Hoá Lộc) thì khả năng phát tài rất cao. Lộc Mã đồng hương = tiền đến từ di chuyển, kinh doanh.',
            short: 'Tài lộc bất ngờ: {sao_list} với Song Lộc hội tại Tài Bạch.',
            advice: 'Nắm bắt cơ hội kinh doanh, đầu tư. Tuy nhiên vẫn cần tính toán cẩn thận, không nên "all-in". Đa dạng hóa nguồn thu.'
        },
        C06: {
            long: 'Lá số gợi ý cơ hội đi xa, du lịch hoặc công tác nước ngoài. {sao_list} tại Thiên Di với Thiên Mã = di chuyển thuận lợi, máy bay, tàu xe. Nếu có cơ hội du học, xuất ngoại, nên tận dụng.',
            short: 'Du lịch/công tác xa: {sao_list} tại Thiên Di gợi ý di chuyển thuận lợi.',
            advice: 'Thời điểm tốt cho chuyến đi xa. Đi về hướng có Lưu Thiên Mã. Nếu có cơ hội hợp tác quốc tế, đừng bỏ lỡ.'
        },

        // ========== NHÓM BỔ SUNG - SAO LƯU MỚI ==========

        H08: {
            long: 'Đương số cần đặc biệt lưu ý về tang chế, buồn phiền trong năm nay. {sao_list} hội tại cung {cung} là dấu hiệu rõ rệt. Lưu Tang Môn + Lưu Bạch Hổ năm nay kích hoạt hung tinh gốc, tăng khả năng gặp sự kiện đau buồn liên quan đến người thân lớn tuổi, cha mẹ hoặc tổ tiên.',
            short: 'Cảnh báo tang chế: {sao_list} tại {cung}. Chú ý sức khỏe người thân.',
            advice: 'Quan tâm sức khỏe cha mẹ, người thân lớn tuổi. Đi thăm viếng thường xuyên. Chuẩn bị tâm lý cho những sự kiện không mong muốn. Cúng giải hạn đầu năm.'
        },
        H09: {
            long: 'Năm nay sao lưu niên hung mạnh kích hoạt vào các cung sức khỏe. {sao_list} cho thấy nguy cơ tai nạn, va chạm cao hơn bình thường. Lưu Hoả/Linh Tinh năm nay chồng lên hung tinh gốc, tạo nên hạn "Sát Tinh kích hoạt" — cần cực kỳ cẩn trọng.',
            short: 'Tai nạn lưu niên: {sao_list}. Hung tinh lưu niên kích hoạt hung tinh gốc.',
            advice: 'Tuyệt đối cẩn trọng khi lái xe, di chuyển. Tránh leo trèo, thám hiểm, thể thao mạo hiểm. Khám sức khỏe định kỳ. Tháng có Lưu Kình Dương đi qua Tật Ách là tháng cần đề phòng cao nhất.'
        },
        C07: {
            long: 'Duyên hôn nhân lưu niên rất thuận lợi. {sao_list} hội tại cung {cung}, đặc biệt Lưu Hồng Loan/Thiên Hỷ năm nay kích hoạt cát tinh gốc về tình duyên. Đây là năm đặc biệt tốt cho người độc thân tìm bạn đời, hoặc cho cặp đôi tiến tới hôn nhân.',
            short: 'Duyên hôn nhân: {sao_list} tại {cung}. Năm tốt cho cưới hỏi.',
            advice: 'Nếu đã có đôi, năm nay nên cưới. Nếu chưa, tích cực giao lưu. Tháng có Lưu Hồng Loan qua Phu Thê là thời điểm tốt nhất. Chọn ngày cưới theo phong thủy.'
        },
        C08: {
            long: 'Có dấu hiệu tin vui bất ngờ đến trong năm nay. {sao_list} với Lưu Thiên Hỷ năm nay mang đến năng lượng hỉ khánh. Có thể liên quan đến thăng chức, sinh con, cưới hỏi hoặc may mắn bất ngờ.',
            short: 'Hỉ sự bất ngờ: {sao_list} mang tin vui. Lưu Thiên Hỷ kích hoạt.',
            advice: 'Giữ tâm thế lạc quan. Nắm bắt cơ hội khi đến. Chia sẻ niềm vui với người thân. Không kiêu ngạo khi gặp may.'
        },
        RC07: {
            long: 'Sức khỏe cha mẹ/người thân lớn tuổi cần đặc biệt quan tâm năm nay. {sao_list} tại cung Phụ Mẫu, kết hợp Lưu Tang Môn/Bạch Hổ năm nay kích hoạt → cha mẹ dễ phát bệnh hoặc gặp biến cố sức khỏe. Thái Dương hãm = bố, Thái Âm hãm = mẹ có vấn đề.',
            short: 'Sức khỏe cha mẹ: {sao_list} tại Phụ Mẫu. Lưu Tang Môn kích hoạt.',
            advice: 'Đưa cha mẹ đi khám sức khỏe tổng quát ngay. Quan tâm chăm sóc nhiều hơn. Chuẩn bị quỹ dự phòng y tế. Thường xuyên thăm nom nếu ở xa.'
        }
    };

    // =====================
    // OVERALL TEMPLATES
    // =====================
    // Tổng hợp đánh giá dựa trên tổ hợp events

    const OVERALL = {
        excellent: {
            rating: 5,
            icon: '🌟',
            text: 'Vận hạn năm {nam_xem} cực kỳ thuận lợi. Đại Vận qua cung {dai_van_cung} hội nhiều cát tinh, Tiểu Vận tại {tieu_van_cung} bổ trợ tốt. Đương số nên chủ động nắm bắt mọi cơ hội, đây là thời điểm vàng để phát triển.'
        },
        good: {
            rating: 4,
            icon: '😊',
            text: 'Năm {nam_xem} khá thuận lợi, nhiều yếu tố hỗ trợ. Đại Vận tại {dai_van_cung} mang đến nền tảng tốt. Cần nỗ lực bản thân để phát huy tối đa vận may.'
        },
        average: {
            rating: 3,
            icon: '⚖️',
            text: 'Vận hạn năm {nam_xem} bình thường, cát hung lẫn lộn. Đại Vận tại {dai_van_cung}, Tiểu Vận tại {tieu_van_cung}. Nên cẩn trọng trong quyết định lớn, giữ thế ổn định.'
        },
        challenging: {
            rating: 2,
            icon: '⚡',
            text: 'Năm {nam_xem} nhiều thách thức. Đại Vận qua {dai_van_cung} gặp một số hung tinh. Tuy nhiên, đây cũng là cơ hội rèn luyện. Tu tâm dưỡng đức sẽ giúp vượt qua.'
        },
        difficult: {
            rating: 1,
            icon: '🛡️',
            text: 'Vận hạn năm {nam_xem} cần đặc biệt cẩn trọng. Nhiều hung tinh hội tại Đại Vận ({dai_van_cung}) và Tiểu Vận ({tieu_van_cung}). Nên giữ thế phòng thủ, không khởi sự lớn, tập trung bảo toàn. Tu tâm tích đức là giải pháp tốt nhất.'
        }
    };

    // =====================
    // ĐẠI VẬN QUA CUNG - TEMPLATES
    // =====================
    // Ý nghĩa khi Đại Vận đi qua từng cung

    const DAI_VAN_CUNG = {
        'MỆNH': {
            text: 'Đại Vận qua cung Mệnh: Giai đoạn tự định nghĩa bản thân, thay đổi lớn về con người và nhận thức.',
            focus: 'Bản thân, tính cách, sức khỏe tổng thể'
        },
        'HUYNH ĐỆ': {
            text: 'Đại Vận qua cung Huynh Đệ: Quan hệ anh chị em, bạn bè chí cốt có vai trò quan trọng.',
            focus: 'Anh chị em, bạn bè, hợp tác ngang vai'
        },
        'PHU THÊ': {
            text: 'Đại Vận qua cung Phu Thê: Giai đoạn ảnh hưởng mạnh bởi hôn nhân, tình cảm đôi lứa.',
            focus: 'Hôn nhân, tình cảm, đối tác đời sống'
        },
        'TỬ TỨC': {
            text: 'Đại Vận qua cung Tử Tức: Giai đoạn liên quan đến con cái, sáng tạo, hoa quả của lao động.',
            focus: 'Con cái, sáng tạo, di sản'
        },
        'TÀI BẠCH': {
            text: 'Đại Vận qua cung Tài Bạch: Tài chính là chủ đề trung tâm, cơ hội hoặc thách thức về tiền bạc.',
            focus: 'Tài chính, thu nhập, đầu tư'
        },
        'TẬT ÁCH': {
            text: 'Đại Vận qua cung Tật Ách: Sức khỏe cần được ưu tiên, dễ phát sinh bệnh nếu không phòng ngừa.',
            focus: 'Sức khỏe, bệnh tật, thể chất'
        },
        'THIÊN DI': {
            text: 'Đại Vận qua cung Thiên Di: Giai đoạn di chuyển nhiều, quan hệ xã hội rộng, hoạt động bên ngoài.',
            focus: 'Di chuyển, xuất ngoại, quan hệ xã hội'
        },
        'NÔ BỘC': {
            text: 'Đại Vận qua cung Nô Bộc: Quan hệ với cấp dưới, đối tác, khách hàng chi phối vận mệnh.',
            focus: 'Cấp dưới, đối tác, khách hàng'
        },
        'QUAN LỘC': {
            text: 'Đại Vận qua cung Quan Lộc: Sự nghiệp là trọng tâm, cơ hội thăng tiến hoặc thay đổi nghề.',
            focus: 'Sự nghiệp, công việc, thăng tiến'
        },
        'ĐIỀN TRẠCH': {
            text: 'Đại Vận qua cung Điền Trạch: Nhà cửa, bất động sản, tài sản cố định là chủ đề chính.',
            focus: 'Nhà cửa, bất động sản, tài sản'
        },
        'PHÚC ĐỨC': {
            text: 'Đại Vận qua cung Phúc Đức: Giai đoạn ảnh hưởng bởi phúc đức tổ tiên, tâm linh, tôn giáo.',
            focus: 'Phúc đức, tâm linh, tổ tiên, tôn giáo'
        },
        'PHỤ MẪU': {
            text: 'Đại Vận qua cung Phụ Mẫu: Cha mẹ, cấp trên, thầy cô có ảnh hưởng lớn đến vận mệnh.',
            focus: 'Cha mẹ, cấp trên, học vấn'
        }
    };

    // =====================
    // HELPER: Fill template
    // =====================

    /**
     * Thay thế placeholder trong template
     * @param {string} template - Template với {placeholder}
     * @param {Object} data - Data để fill
     * @returns {string} Filled template
     */
    function fillTemplate(template, data) {
        if (!template) return '';
        return template.replace(/\{(\w+)\}/g, function (match, key) {
            return data[key] !== undefined ? data[key] : match;
        });
    }

    /**
     * Lấy template cho 1 event
     * @param {string} eventId - VD: 'RS03'
     * @param {string} variant - 'long' | 'short' | 'advice'
     * @param {Object} data - Data để fill placeholder
     * @returns {string}
     */
    function getEventText(eventId, variant, data) {
        const tmpl = TEMPLATES[eventId];
        if (!tmpl) return '';
        return fillTemplate(tmpl[variant] || tmpl.short, data || {});
    }

    /**
     * Lấy overall template theo rating
     * @param {number} avgRating - Rating trung bình (1-5)
     * @param {Object} data - Data để fill
     * @returns {Object} { rating, icon, text }
     */
    function getOverallText(avgRating, data) {
        let key;
        if (avgRating >= 4.5) key = 'excellent';
        else if (avgRating >= 3.5) key = 'good';
        else if (avgRating >= 2.5) key = 'average';
        else if (avgRating >= 1.5) key = 'challenging';
        else key = 'difficult';

        const tmpl = OVERALL[key];
        return {
            rating: tmpl.rating,
            icon: tmpl.icon,
            text: fillTemplate(tmpl.text, data || {})
        };
    }

    /**
     * Lấy luận giải Đại Vận qua cung
     * @param {string} cungName - Tên cung (VD: 'MỆNH')
     * @returns {Object} { text, focus }
     */
    function getDaiVanCungText(cungName) {
        return DAI_VAN_CUNG[cungName] || { text: '', focus: '' };
    }

    // =====================
    // EXPORTS
    // =====================

    return {
        SEVERITY,
        TEMPLATES,
        OVERALL,
        DAI_VAN_CUNG,
        fillTemplate,
        getEventText,
        getOverallText,
        getDaiVanCungText
    };
})();
