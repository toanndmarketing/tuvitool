/**
 * ============================================
 * TỬ VI STAR PATTERNS - Bộ sao kết hợp & Miếu Hãm
 * Data nền tảng cho Event Scanner
 * ============================================
 */

const TuViStarPatterns = (function () {
    'use strict';

    // =====================
    // MIẾU - VƯỢNG - HÃM 14 CHÍNH TINH
    // =====================
    // mieu = Miếu (rất mạnh), vuong = Vượng (mạnh), dac = Đắc (khá), ham = Hãm (yếu/xấu)
    // Index: 0=Tý, 1=Sửu, 2=Dần, 3=Mão, 4=Thìn, 5=Tỵ, 6=Ngọ, 7=Mùi, 8=Thân, 9=Dậu, 10=Tuất, 11=Hợi

    const MIEU_HAM = {
        'Tử Vi': {
            mieu: [6, 5],        // Ngọ, Tỵ
            vuong: [4, 7],       // Thìn, Mùi
            dac: [1, 2, 8],      // Sửu, Dần, Thân
            ham: []              // Đế tinh không hãm
        },
        'Thiên Cơ': {
            mieu: [0, 2],        // Tý, Dần
            vuong: [3, 6],       // Mão, Ngọ
            dac: [8, 11],        // Thân, Hợi
            ham: [5, 9]          // Tỵ, Dậu
        },
        'Thái Dương': {
            mieu: [3, 4, 5, 6],  // Mão, Thìn, Tỵ, Ngọ (ban ngày)
            vuong: [2],          // Dần
            dac: [1, 7],         // Sửu, Mùi
            ham: [9, 10, 11, 0]  // Dậu, Tuất, Hợi, Tý (ban đêm)
        },
        'Vũ Khúc': {
            mieu: [4, 10],       // Thìn, Tuất
            vuong: [1, 7],       // Sửu, Mùi
            dac: [2, 8],         // Dần, Thân
            ham: [3, 9]          // Mão, Dậu
        },
        'Thiên Đồng': {
            mieu: [2, 8],        // Dần, Thân
            vuong: [0, 6],       // Tý, Ngọ
            dac: [1, 7],         // Sửu, Mùi
            ham: [5, 11]         // Tỵ, Hợi
        },
        'Liêm Trinh': {
            mieu: [8, 9],        // Thân, Dậu
            vuong: [2, 3],       // Dần, Mão
            dac: [4, 10],        // Thìn, Tuất
            ham: [5, 11]         // Tỵ, Hợi
        },
        'Thiên Phủ': {
            mieu: [1, 7, 0, 6],  // Sửu, Mùi, Tý, Ngọ
            vuong: [2, 8],       // Dần, Thân
            dac: [4, 10],        // Thìn, Tuất
            ham: [3, 9]          // Mão, Dậu
        },
        'Thái Âm': {
            mieu: [9, 10, 11, 0], // Dậu, Tuất, Hợi, Tý (ban đêm)
            vuong: [8],           // Thân
            dac: [1, 7],          // Sửu, Mùi
            ham: [3, 4, 5, 6]     // Mão, Thìn, Tỵ, Ngọ (ban ngày)
        },
        'Tham Lang': {
            mieu: [4, 10],       // Thìn, Tuất
            vuong: [2, 8],       // Dần, Thân
            dac: [0, 6],         // Tý, Ngọ
            ham: [5, 11]         // Tỵ, Hợi
        },
        'Cự Môn': {
            mieu: [0, 4],        // Tý, Thìn
            vuong: [1, 7],       // Sửu, Mùi
            dac: [2, 8],         // Dần, Thân
            ham: [5, 11]         // Tỵ, Hợi
        },
        'Thiên Tướng': {
            mieu: [1, 7],        // Sửu, Mùi
            vuong: [2, 8],       // Dần, Thân
            dac: [0, 6],         // Tý, Ngọ
            ham: [5, 11]         // Tỵ, Hợi
        },
        'Thiên Lương': {
            mieu: [0, 6],        // Tý, Ngọ
            vuong: [2, 8],       // Dần, Thân
            dac: [1, 7],         // Sửu, Mùi
            ham: [5, 11]         // Tỵ, Hợi
        },
        'Thất Sát': {
            mieu: [2, 8],        // Dần, Thân
            vuong: [0, 6],       // Tý, Ngọ
            dac: [1, 7],         // Sửu, Mùi
            ham: [4, 10]         // Thìn, Tuất
        },
        'Phá Quân': {
            mieu: [0, 6],        // Tý, Ngọ
            vuong: [2, 8],       // Dần, Thân
            dac: [1, 7],         // Sửu, Mùi
            ham: [4, 10]         // Thìn, Tuất
        }
    };

    // =====================
    // BỘ ĐẠI HUNG (5 patterns)
    // =====================

    const HUNG_PATTERNS = [
        {
            id: 'HP01',
            name: 'Tứ Sát hội tụ',
            desc: 'Kình-Đà-Hoả-Linh cùng cung hoặc tam hợp chiếu',
            stars: ['Kình Dương', 'Đà La', 'Hoả Tinh', 'Linh Tinh'],
            minMatch: 3,
            scope: 'cung_tam_hop',
            intensity: 10,
            effect: 'Tai nạn nghiêm trọng, bệnh nặng, biến cố bất ngờ',
            advice: 'Cực kỳ cẩn trọng di chuyển, tránh mạo hiểm, nên tu tâm dưỡng đức.',
            effectByHouse: {
                'MỆNH': 'Bản thân gặp tai nạn, bệnh nặng, biến cố nghiêm trọng ảnh hưởng trực tiếp đến sức khỏe và cuộc sống.',
                'PHỤ MẪU': 'Cha mẹ dễ gặp tai nạn, bệnh nặng hoặc biến cố bất ngờ. Cần đặc biệt quan tâm sức khỏe cha mẹ.',
                'PHÚC ĐỨC': 'Tổ tiên bất an, phúc đức bị phá. Phần mộ có vấn đề, gia đình nhiều biến cố truyền kiếp.',
                'ĐIỀN TRẠCH': 'Nhà cửa dễ gặp hỏa hoạn, thiên tai, hư hỏng nặng. Bất động sản tổn thất.',
                'QUAN LỘC': 'Sự nghiệp gặp biến cố lớn, mất chức, phá sản do tai nạn hoặc sai lầm nghiêm trọng.',
                'NÔ BỘC': 'Bạn bè, thuộc hạ phản bội, gây tai họa. Coi chừng bị hãm hại bởi người thân cận.',
                'THIÊN DI': 'Cực kỳ nguy hiểm khi đi xa, tai nạn giao thông, bất ngờ nơi đất khách.',
                'TẬT ÁCH': 'Bệnh nặng, phẫu thuật, tai nạn ảnh hưởng thể xác nghiêm trọng.',
                'TÀI BẠCH': 'Phá sản, mất tài sản lớn do biến cố bất ngờ, bị cướp, bị lừa.',
                'TỬ TỨC': 'Con cái gặp tai nạn, bệnh tật hoặc mang lại nhiều phiền muộn. Sinh nở khó khăn.',
                'PHU THÊ': 'Hôn nhân biến cố lớn, vợ/chồng gặp nạn hoặc ly tán đột ngột.',
                'HUYNH ĐỆ': 'Anh chị em gặp tai nạn, bất hòa nghiêm trọng, tranh giành gia sản.'
            }
        },
        {
            id: 'HP02',
            name: 'Sát Phá Liêm',
            desc: 'Thất Sát + Phá Quân + Liêm Trinh hội (tất cả đều hãm)',
            stars: ['Thất Sát', 'Phá Quân', 'Liêm Trinh'],
            minMatch: 2,
            scope: 'cung_tam_hop',
            intensity: 9,
            requireHam: true,
            effect: 'Biến cố lớn, thay đổi toàn bộ cuộc sống, phá sản hoặc tai họa',
            advice: 'Nên giữ thế thủ, không khởi sự lớn, tập trung bảo toàn.',
            effectByHouse: {
                'MỆNH': 'Cuộc đời nhiều sóng gió, biến cố liên miên, phá rồi xây lại nhiều lần. Cần kiên cường.',
                'PHỤ MẪU': 'Cha mẹ gia cảnh suy sụp, có thể mất sớm hoặc gia đình ly tán. Ít được phúc ấm.',
                'PHÚC ĐỨC': 'Phúc đức tổ tiên bị phá, dòng họ suy vi. Âm phần bất ổn nghiêm trọng.',
                'ĐIỀN TRẠCH': 'Nhà cửa hư hỏng, tài sản tiêu tán, bất động sản thua lỗ hoặc bị phá sản.',
                'QUAN LỘC': 'Sự nghiệp đổ vỡ, phá sản, mất chức. Kinh doanh thua lỗ nặng nề.',
                'NÔ BỘC': 'Thuộc hạ phản trắc, bạn bè lừa dối, bị hãm hại bởi kẻ tiểu nhân.',
                'THIÊN DI': 'Ra ngoài gặp nhiều hiểm nguy, cuộc sống xa nhà đầy sóng gió và bất trắc.',
                'TẬT ÁCH': 'Bệnh tật nặng, phẫu thuật nguy hiểm, sức khỏe suy kiệt.',
                'TÀI BẠCH': 'Tài chính sụp đổ, phá sản, nợ nần chồng chất.',
                'TỬ TỨC': 'Con cái ngỗ nghịch, phá gia chi tử, hoặc hiếm muộn, sinh nở gian nan.',
                'PHU THÊ': 'Hôn nhân tan vỡ, vợ/chồng phản bội hoặc gặp tai ương.',
                'HUYNH ĐỆ': 'Anh chị em bất hòa, tranh đoạt, hoặc anh em gặp nạn.'
            }
        },
        {
            id: 'HP03',
            name: 'Cự Kỵ hung',
            desc: 'Cự Môn + Hoá Kỵ + Kình/Đà (thêm hung tinh)',
            stars: ['Cự Môn'],
            requireHoa: 'Kỵ',
            extraHung: ['Kình Dương', 'Đà La'],
            minMatch: 1,
            scope: 'cung_doi',
            intensity: 9,
            effect: 'Thị phi cực nặng, kiện tụng, tai tiếng, mất uy tín',
            advice: 'Tránh tranh cãi, không ký kết hợp đồng quan trọng, cẩn trọng lời nói.',
            effectByHouse: {
                'MỆNH': 'Bản thân dễ bị thị phi, vu khống, kiện tụng. Lời nói gây họa, uy tín bị tổn hại nghiêm trọng.',
                'PHỤ MẪU': 'Cha mẹ bất hòa, cãi vã liên miên. Quan hệ với cha mẹ xung khắc, khẩu thiệt.',
                'PHÚC ĐỨC': 'Tổ tiên có oan khuất, nội tâm bất an, hay lo lắng. Phúc đức giảm sút vì miệng tiếng.',
                'ĐIỀN TRẠCH': 'Nhà cửa bị tranh chấp, kiện tụng bất động sản. Hàng xóm gây thị phi.',
                'QUAN LỘC': 'Sự nghiệp gặp thị phi, bị đồng nghiệp vu khống, kiện tụng pháp lý trong công việc.',
                'NÔ BỘC': 'Bạn bè, thuộc hạ nói xấu sau lưng, phản trắc. Bị hãm hại bởi chính người tin tưởng.',
                'THIÊN DI': 'Ra ngoài gặp miệng tiếng, bị vu oan nơi đất khách. Đi đâu cũng gặp thị phi.',
                'TẬT ÁCH': 'Bệnh liên quan miệng, họng, tiêu hóa. Tinh thần bất ổn do thị phi.',
                'TÀI BẠCH': 'Tài chính bị tổn thất do kiện tụng, bị lừa đảo, hợp đồng gian dối.',
                'TỬ TỨC': 'Con cái hay cãi lý, bướng bỉnh, gây rắc rối. Quan hệ cha con/mẹ con xung khắc.',
                'PHU THÊ': 'Vợ chồng cãi vã liên miên, khẩu thiệt, miệng lưỡi gây chia rẽ hôn nhân.',
                'HUYNH ĐỆ': 'Anh chị em xung đột, nói xấu lẫn nhau, tranh giành tài sản.'
            }
        },
        {
            id: 'HP04',
            name: 'Không Kiếp phá tài',
            desc: 'Địa Không + Địa Kiếp cùng cung hoặc đối chiếu Tài Bạch',
            stars: ['Địa Không', 'Địa Kiếp'],
            minMatch: 2,
            scope: 'cung_doi',
            targetHouse: 'TÀI BẠCH',
            intensity: 9,
            effect: 'Phá sản, mất tài sản lớn, đầu tư thua lỗ nặng',
            advice: 'Không đầu tư mạo hiểm, giữ tiền mặt, tránh vay nợ lớn.',
            effectByHouse: {
                'TÀI BẠCH': 'Tài chính trống rỗng, phá sản, đầu tư thua lỗ nặng. Tiền bạc như muối bỏ biển.'
            }
        },
        {
            id: 'HP05',
            name: 'Bộ tang chế',
            desc: 'Tang Môn + Bạch Hổ + Thiên Khốc tại Mệnh hoặc Phúc Đức',
            stars: ['Tang Môn', 'Bạch Hổ', 'Thiên Khốc'],
            minMatch: 2,
            scope: 'cung',
            targetHouse: ['MỆNH', 'PHÚC ĐỨC'],
            intensity: 9,
            effect: 'Tang sự, tang tóc trong gia đình, mất mát người thân',
            advice: 'Quan tâm sức khỏe người lớn tuổi trong gia đình, thăm viếng mộ phần.',
            effectByHouse: {
                'MỆNH': 'Bản thân gặp tang tóc, chia ly, mất mát người thân thiết nhất.',
                'PHÚC ĐỨC': 'Tổ tiên bất an, tang tóc trong dòng họ, phần mộ cần tu sửa gấp.'
            }
        }
    ];

    // =====================
    // BỘ ĐẠI CÁT (5 patterns)
    // =====================

    const CAT_PATTERNS = [
        {
            id: 'CP01',
            name: 'Tử Phủ hội',
            desc: 'Tử Vi + Thiên Phủ cùng cung hoặc tam hợp',
            stars: ['Tử Vi', 'Thiên Phủ'],
            minMatch: 2,
            scope: 'cung_tam_hop',
            intensity: 10,
            effect: 'Quý nhân tối cao, quyền quý, phú quý song toàn',
            advice: 'Nắm bắt cơ hội lớn, có quý nhân phù trợ từ nhiều phía.',
            effectByHouse: {
                'MỆNH': 'Bản mệnh quý nhân, phú quý song toàn, quyền quý hiển hách. Cuộc đời hanh thông, được nhiều người nể trọng.',
                'PHỤ MẪU': 'Cha mẹ giàu sang, có địa vị xã hội cao. Được phúc ấm lớn từ gia đình, cha mẹ phú quý.',
                'PHÚC ĐỨC': 'Phúc đức tổ tiên rất lớn, dòng họ hưng vượng. Âm phần tốt đẹp, phúc trạch thâm hậu.',
                'ĐIỀN TRẠCH': 'Nhà cửa khang trang, bất động sản phát đạt. Tài sản cố định dồi dào, gia sản vững vàng.',
                'QUAN LỘC': 'Sự nghiệp cực thịnh, dễ đạt chức vụ cao. Quyền hành lớn, được cấp trên trọng dụng.',
                'NÔ BỘC': 'Thuộc hạ trung thành, giỏi giang. Bạn bè toàn quý nhân, được nhiều người phò trợ.',
                'THIÊN DI': 'Xuất ngoại hanh thông, đi đâu cũng được quý nhân đón tiếp. Xa nhà gặp nhiều may mắn.',
                'TẬT ÁCH': 'Sức khỏe tốt, ít bệnh nặng. Nếu có bệnh cũng gặp thầy giỏi chữa khỏi.',
                'TÀI BẠCH': 'Tài lộc cực vượng, tiền tài dồi dào, phú quý bền vững. Nguồn thu đa dạng, giàu có.',
                'TỬ TỨC': 'Con cái hiếu thuận, thành đạt, có con quý tử. Đời sau hưởng phú quý, nối nghiệp cha mẹ.',
                'PHU THÊ': 'Bạn đời giàu có, có uy quyền. Hôn nhân cao quý, vợ/chồng có địa vị xã hội tốt.',
                'HUYNH ĐỆ': 'Anh chị em hòa thuận, giàu có. Được sự giúp đỡ lớn từ anh em trong gia đình.'
            },
            adviceByHouse: {
                'MỆNH': 'Bản mệnh rất tốt, nên tự tin phát huy tối đa năng lực. Quý nhân luôn bên cạnh.',
                'PHỤ MẪU': 'Nên giữ gìn quan hệ tốt với cha mẹ, phát huy phúc ấm gia đình.',
                'TỬ TỨC': 'Đầu tư cho giáo dục con cái, con sẽ thành đạt và báo hiếu.',
                'NÔ BỘC': 'Nên mở rộng quan hệ xã hội, quý nhân rất nhiều xung quanh.',
                'QUAN LỘC': 'Thời điểm tốt thăng tiến, có thể nhận chức vụ quan trọng.',
                'TÀI BẠCH': 'Mạnh dạn đầu tư, tài lộc đang ở thời kỳ cực thịnh.'
            }
        },
        {
            id: 'CP02',
            name: 'Song Lộc hội',
            desc: 'Lộc Tồn + Hoá Lộc cùng cung hoặc tam hợp',
            stars: ['Lộc Tồn'],
            requireHoa: 'Lộc',
            minMatch: 1,
            scope: 'cung_tam_hop',
            intensity: 9,
            effect: 'Tài lộc dồi dào, phát tài, thu nhập tăng mạnh',
            advice: 'Thời điểm tốt để đầu tư, mở rộng kinh doanh.',
            effectByHouse: {
                'MỆNH': 'Bản thân hưởng tài lộc dồi dào, tiền bạc đến dễ dàng. Cuộc sống sung túc.',
                'PHỤ MẪU': 'Cha mẹ giàu có, tài chính dồi dào. Được thừa hưởng tài sản từ gia đình.',
                'PHÚC ĐỨC': 'Phúc lộc từ tổ tiên, dòng họ có truyền thống giàu có. Phần mộ tốt mang tài lộc.',
                'ĐIỀN TRẠCH': 'Nhà cửa đất đai phát tài, bất động sản tăng giá mạnh. Nên đầu tư địa ốc.',
                'QUAN LỘC': 'Sự nghiệp phát tài, lương bổng tăng mạnh, kinh doanh lãi lớn.',
                'NÔ BỘC': 'Bạn bè mang đến cơ hội tài chính, hợp tác kinh doanh có lợi.',
                'THIÊN DI': 'Phát tài khi đi xa, kinh doanh xuất ngoại thuận lợi, thu nhập từ nước ngoài.',
                'TẬT ÁCH': 'Sức khỏe tốt giúp kiếm tiền. Có thể phát tài từ ngành y, dược.',
                'TÀI BẠCH': 'Tài chính CỰC VƯỢNG, Song Lộc tại Tài Bạch là đại cát. Phát tài lớn.',
                'TỬ TỨC': 'Con cái mang đến tài lộc, có con giỏi kiếm tiền. Đầu tư cho con có lãi.',
                'PHU THÊ': 'Vợ/chồng giàu có, hôn nhân mang đến tài lộc. Phát tài nhờ bạn đời.',
                'HUYNH ĐỆ': 'Anh chị em giàu có, hợp tác kinh doanh với anh em rất có lợi.'
            }
        },
        {
            id: 'CP03',
            name: 'Tứ Quý Nhân',
            desc: 'Thiên Khôi + Thiên Việt + Văn Xương + Văn Khúc hội',
            stars: ['Thiên Khôi', 'Thiên Việt', 'Văn Xương', 'Văn Khúc'],
            minMatch: 3,
            scope: 'cung_tam_hop',
            intensity: 8,
            effect: 'Thăng tiến, thi cử đỗ đạt, được đề bạt, danh tiếng tỏa sáng',
            advice: 'Tốt cho học vấn, thi cử, xin việc, thăng chức.',
            effectByHouse: {
                'MỆNH': 'Bản thân thông minh xuất chúng, thi cử đỗ đạt, thăng tiến nhanh. Nhiều quý nhân phò trợ.',
                'PHỤ MẪU': 'Cha mẹ có học vấn cao, gia đình nề nếp. Được cha mẹ dạy dỗ tốt, gia phong tốt.',
                'PHÚC ĐỨC': 'Dòng họ có truyền thống hiếu học, phúc đức từ học vấn. Tổ tiên đỗ đạt.',
                'ĐIỀN TRẠCH': 'Nhà cửa đẹp đẽ, nhiều sách vở, văn phòng làm việc tốt.',
                'QUAN LỘC': 'Sự nghiệp thăng tiến nhờ tài năng, được đề bạt, danh tiếng trong ngành.',
                'NÔ BỘC': 'Bạn bè toàn người có học, quý nhân trí thức giúp đỡ.',
                'THIÊN DI': 'Đi xa gặp quý nhân, du học thành công, nổi tiếng nơi đất khách.',
                'TẬT ÁCH': 'Sức khỏe được quý nhân chăm sóc, gặp bác sĩ giỏi khi cần.',
                'TÀI BẠCH': 'Phát tài nhờ tri thức, kiếm tiền bằng chất xám. Thu nhập từ giáo dục, nghiên cứu.',
                'TỬ TỨC': 'Con cái thông minh, học giỏi, thi đỗ đạt cao. Con quý tử hiếu học.',
                'PHU THÊ': 'Bạn đời có học vấn, thông minh. Hôn nhân tri kỷ, hiểu nhau.',
                'HUYNH ĐỆ': 'Anh chị em đều giỏi giang, học hành thành đạt, hỗ trợ nhau.'
            }
        },
        {
            id: 'CP04',
            name: 'Tả Hữu giáp',
            desc: 'Tả Phụ + Hữu Bật giáp cung hoặc tam hợp',
            stars: ['Tả Phụ', 'Hữu Bật'],
            minMatch: 2,
            scope: 'cung_giap',
            intensity: 8,
            effect: 'Quý nhân phù trợ mạnh từ hai phía, được giúp đỡ',
            advice: 'Có thể nhờ cậy người xung quanh, quý nhân xuất hiện khi cần.',
            effectByHouse: {
                'MỆNH': 'Bản thân được nhiều quý nhân phò tá từ hai phía, gặp khó luôn có người giúp.',
                'PHỤ MẪU': 'Cha mẹ được nhiều người kính trọng, giúp đỡ. Gia đình có nhiều mối quan hệ tốt.',
                'PHÚC ĐỨC': 'Phúc đức được bảo vệ từ hai phía, tổ tiên phù hộ mạnh.',
                'ĐIỀN TRẠCH': 'Nhà cửa được hàng xóm quý mến, bất động sản nhờ người giới thiệu mà phát.',
                'QUAN LỘC': 'Sự nghiệp được cấp trên và đồng nghiệp hỗ trợ mạnh, dễ thăng tiến.',
                'NÔ BỘC': 'Bạn bè, thuộc hạ vô cùng trung thành, luôn sẵn sàng giúp đỡ.',
                'THIÊN DI': 'Ra ngoài gặp quý nhân từ nhiều phía, được giúp đỡ nơi đất khách.',
                'TẬT ÁCH': 'Sức khỏe được nhiều người quan tâm, bệnh có người chăm sóc.',
                'TÀI BẠCH': 'Tài chính được quý nhân hỗ trợ, có người cho vay khi cần, đầu tư có người chỉ dẫn.',
                'TỬ TỨC': 'Con cái được nhiều người thương yêu, giúp đỡ. Sinh nở thuận lợi.',
                'PHU THÊ': 'Tình duyên được mai mối tốt, hôn nhân có quý nhân vun đắp.',
                'HUYNH ĐỆ': 'Anh chị em đoàn kết, hỗ trợ lẫn nhau mạnh mẽ.'
            }
        },
        {
            id: 'CP05',
            name: 'Lộc Mã đồng hương',
            desc: 'Thiên Mã + Lộc Tồn cùng cung (hoặc thêm Hoá Lộc)',
            stars: ['Thiên Mã', 'Lộc Tồn'],
            minMatch: 2,
            scope: 'cung',
            intensity: 9,
            effect: 'Phát tài từ di chuyển, kinh doanh, buôn bán, ngoại giao',
            advice: 'Rất tốt cho kinh doanh, xuất nhập khẩu, công tác xa.',
            effectByHouse: {
                'MỆNH': 'Bản thân phát tài nhờ di chuyển, buôn bán xa. Năng động, giỏi giao tế, kinh doanh phát đạt.',
                'PHỤ MẪU': 'Cha mẹ phát tài từ kinh doanh, buôn bán. Gia đình có truyền thống thương mại.',
                'PHÚC ĐỨC': 'Phúc đức từ tổ tiên kinh thương, dòng họ có nền tảng buôn bán lâu đời.',
                'ĐIỀN TRẠCH': 'Bất động sản thuận lợi, mua bán nhà đất có lãi. Di chuyển đổi nhà tốt.',
                'QUAN LỘC': 'Sự nghiệp phát triển nhờ kinh doanh, xuất nhập khẩu, công tác xa.',
                'NÔ BỘC': 'Bạn bè trong giới kinh doanh, quan hệ thương mại rộng rãi.',
                'THIÊN DI': 'Đi xa phát tài lớn, xuất ngoại kinh doanh CỰC VƯỢNG. Lộc Mã tại Thiên Di là đại cát.',
                'TẬT ÁCH': 'Di chuyển nhiều nhưng sức khỏe tốt, có tiền chữa bệnh khi cần.',
                'TÀI BẠCH': 'Tài chính phát đạt nhờ buôn bán, thương mại. Tiền tài từ nhiều nguồn.',
                'TỬ TỨC': 'Con cái phát triển xa nhà, du học thành tài. Con có năng khiếu kinh doanh.',
                'PHU THÊ': 'Bạn đời là doanh nhân, giỏi kinh doanh. Hôn nhân phát tài nhờ bạn đời.',
                'HUYNH ĐỆ': 'Anh chị em kinh doanh giỏi, hợp tác buôn bán với anh em có lợi.'
            }
        }
    ];

    // =====================
    // BỘ ÂM PHẦN / TÂM LINH (6 patterns)
    // =====================

    const SPIRITUAL_PATTERNS = [
        {
            id: 'SP01',
            name: 'Tang Điếu hội Phúc',
            desc: 'Tang Môn + Điếu Khách tại cung Phúc Đức',
            stars: ['Tang Môn', 'Điếu Khách'],
            minMatch: 2,
            scope: 'cung',
            targetHouse: 'PHÚC ĐỨC',
            intensity: 9,
            effect: 'Âm phần bất ổn, mồ mả cần tu sửa, tổ tiên có phần không yên',
            advice: 'Nên đi thăm viếng, tu sửa mộ phần tổ tiên. Cúng giỗ chu đáo.',
            effectByHouse: {
                'PHÚC ĐỨC': 'Tổ tiên bất an, phần mộ cần tu sửa gấp. Gia đạo có điều không yên do âm phần.'
            }
        },
        {
            id: 'SP02',
            name: 'Cô Quả tại Phúc/Mệnh',
            desc: 'Cô Thần + Quả Tú tại Phúc Đức hoặc Mệnh',
            stars: ['Cô Thần', 'Quả Tú'],
            minMatch: 1,
            scope: 'cung',
            targetHouse: ['PHÚC ĐỨC', 'MỆNH'],
            intensity: 7,
            effect: 'Cô đơn về tâm linh, thiếu phúc từ tổ tiên, cần tu hành thờ cúng',
            advice: 'Nên chú trọng thờ phụng gia tiên, làm việc thiện tích đức.',
            effectByHouse: {
                'MỆNH': 'Bản thân cô đơn về tâm linh, thiếu phúc ấm. Cần tu hành, tích đức bổ phúc.',
                'PHÚC ĐỨC': 'Tổ tiên cô quạnh, thiếu người thờ phụng. Phần mộ lạnh lẽo, cần quan tâm.'
            }
        },
        {
            id: 'SP03',
            name: 'Hỷ Phúc Tấu hội',
            desc: 'Hỷ Thần + Thiên Phúc + Tấu Thư tại Điền/Phúc',
            stars: ['Hỷ Thần', 'Thiên Phúc', 'Tấu Thư'],
            minMatch: 2,
            scope: 'cung',
            targetHouse: ['ĐIỀN TRẠCH', 'PHÚC ĐỨC'],
            intensity: 6,
            effect: 'Nên lập hoặc sửa bàn thờ gia tiên, thay đổi vị trí thờ phụng',
            advice: 'Thời điểm tốt để sắp xếp lại bàn thờ, mời thầy xem hướng thờ.',
            effectByHouse: {
                'ĐIỀN TRẠCH': 'Nhà cửa nên thay đổi vị trí bàn thờ, sắp xếp lại phong thủy thờ cúng.',
                'PHÚC ĐỨC': 'Tổ tiên muốn được thờ phụng chu đáo hơn. Nên lập bàn thờ mới hoặc tu sửa.'
            }
        },
        {
            id: 'SP04',
            name: 'Khốc Hư tại Phúc',
            desc: 'Thiên Khốc + Thiên Hư tại Phúc Đức',
            stars: ['Thiên Khốc', 'Thiên Hư'],
            minMatch: 2,
            scope: 'cung',
            targetHouse: 'PHÚC ĐỨC',
            intensity: 8,
            effect: 'Âm khí nặng, mồ mả cần di dời hoặc xây lại, phần mộ bị ảnh hưởng bởi ngoại cảnh',
            advice: 'Kiểm tra phần mộ tổ tiên, xem có bị ngập nước, cây cối xâm lấn hay không.',
            effectByHouse: {
                'PHÚC ĐỨC': 'Phần mộ tổ tiên bị ảnh hưởng bởi ngoại cảnh — ngập nước, cây xâm lấn, hoang phế. Cần tu sửa gấp.'
            }
        },
        {
            id: 'SP05',
            name: 'Hình Phá tại Phúc',
            desc: 'Liêm Trinh + Thiên Hình + Phá Quân tại Phúc',
            stars: ['Liêm Trinh', 'Thiên Hình', 'Phá Quân'],
            minMatch: 2,
            scope: 'cung_doi',
            targetHouse: 'PHÚC ĐỨC',
            intensity: 9,
            effect: 'Phúc đức bị phá, mồ mả bị xâm phạm, tổ tiên bất an nghiêm trọng',
            advice: 'Cần kiểm tra gấp phần mộ, có thể bị đào xới, động chạm. Cúng giải hạn.',
            effectByHouse: {
                'PHÚC ĐỨC': 'Phúc đức tổ tiên bị phá nghiêm trọng. Phần mộ có thể bị xâm phạm, đào xới. Cần kiểm tra và giải hạn gấp.'
            }
        },
        {
            id: 'SP06',
            name: 'Thái Âm hãm Kỵ tại Phúc',
            desc: 'Thái Âm hãm + Hoá Kỵ tại Phúc Đức',
            stars: ['Thái Âm'],
            requireHoa: 'Kỵ',
            requireHam: true,
            minMatch: 1,
            scope: 'cung',
            targetHouse: 'PHÚC ĐỨC',
            intensity: 8,
            effect: 'Mẹ/bà ngoại bất lợi, âm phần bên ngoại có vấn đề, phần mộ bên ngoại cần xem xét',
            advice: 'Kiểm tra phần mộ bên ngoại, quan tâm sức khỏe mẹ/bà ngoại.',
            effectByHouse: {
                'PHÚC ĐỨC': 'Mẹ hoặc bà ngoại bất lợi sức khỏe. Phần mộ bên ngoại có vấn đề cần xem xét.'
            }
        }
    ];

    // =====================
    // TRỌNG SỐ ẢNH HƯỞNG
    // =====================

    const WEIGHTS = {
        TRUC_TIEP: 1.0,     // Sao đóng trực tiếp trong cung
        XUNG_CHIEU: 0.6,    // Cung đối diện (cách 6)
        TAM_HOP: 0.4,       // Tam hợp (cách 4, cách 8)
        LUC_HOP: 0.35,      // Lục Hợp / Nhị Hợp (cặp hợp nhau)
        GIAP_CUNG: 0.3,     // 2 cung kề bên
        MIEU_BONUS: 1.3,    // Sao miếu → tăng 30% hiệu lực
        VUONG_BONUS: 1.15,  // Sao vượng → tăng 15%
        HAM_PENALTY: 0.6,   // Sao hãm → giảm 40% (cát → yếu, hung → nhẹ hơn)
        HAM_HUNG_FLIP: 1.4, // Sao cát hãm → trở thành hung nhẹ (tăng tác hại)
        TUAN_PENALTY: 0.5,  // Bị Tuần → giảm 50%
        TRIET_PENALTY: 0.7, // Bị Triệt → giảm 30%
        HOA_LOC_BONUS: 1.5, // Hoá Lộc → tăng 50%
        HOA_QUYEN_BONUS: 1.4, // Hoá Quyền → tăng 40%
        HOA_KHOA_BONUS: 1.3,  // Hoá Khoa → tăng 30%
        HOA_KY_PENALTY: 1.6,  // Hoá Kỵ → tăng 60% hung tính
        LUU_HOA_WEIGHT: 0.8,  // Lưu Hoá → 80% so với Hoá gốc
        SONG_KY_MULTIPLIER: 2.0, // Song Kỵ (gốc + lưu) → nhân đôi
        SONG_LOC_MULTIPLIER: 1.8  // Song Lộc → nhân 1.8
    };

    // =====================
    // LỤC HỢP (NHỊ HỢP) — 6 cặp Địa Chi hợp nhau
    // =====================

    /**
     * 6 cặp Lục Hợp:
     * Tý(0)-Sửu(1), Dần(2)-Hợi(11), Mão(3)-Tuất(10),
     * Thìn(4)-Dậu(9), Tỵ(5)-Thân(8), Ngọ(6)-Mùi(7)
     */
    const LUC_HOP_MAP = {
        0: 1,   // Tý → Sửu
        1: 0,   // Sửu → Tý
        2: 11,  // Dần → Hợi
        3: 10,  // Mão → Tuất
        4: 9,   // Thìn → Dậu
        5: 8,   // Tỵ → Thân
        6: 7,   // Ngọ → Mùi
        7: 6,   // Mùi → Ngọ
        8: 5,   // Thân → Tỵ
        9: 4,   // Dậu → Thìn
        10: 3,  // Tuất → Mão
        11: 2   // Hợi → Dần
    };

    const LUC_HOP_NAMES = {
        0: 'Tý-Sửu (Thổ)', 1: 'Tý-Sửu (Thổ)',
        2: 'Dần-Hợi (Mộc)', 11: 'Dần-Hợi (Mộc)',
        3: 'Mão-Tuất (Hoả)', 10: 'Mão-Tuất (Hoả)',
        4: 'Thìn-Dậu (Kim)', 9: 'Thìn-Dậu (Kim)',
        5: 'Tỵ-Thân (Thuỷ)', 8: 'Tỵ-Thân (Thuỷ)',
        6: 'Ngọ-Mùi (Nhật Nguyệt)', 7: 'Ngọ-Mùi (Nhật Nguyệt)'
    };

    /**
     * Lấy cung Lục Hợp (Nhị Hợp) của 1 cung
     * @param {number} pos - vị trí cung (0-11)
     * @returns {number} vị trí cung hợp
     */
    function getLucHop(pos) {
        return LUC_HOP_MAP[pos];
    }

    /**
     * Lấy tên cặp Lục Hợp
     */
    function getLucHopName(pos) {
        return LUC_HOP_NAMES[pos] || '';
    }

    // =====================
    // HÀNH 12 CUNG (Địa Chi → Ngũ Hành)
    // =====================

    const HANH_CUNG = {
        0: 'Thuỷ',  // Tý
        1: 'Thổ',   // Sửu
        2: 'Mộc',   // Dần
        3: 'Mộc',   // Mão
        4: 'Thổ',   // Thìn
        5: 'Hoả',   // Tỵ
        6: 'Hoả',   // Ngọ
        7: 'Thổ',   // Mùi
        8: 'Kim',   // Thân
        9: 'Kim',   // Dậu
        10: 'Thổ',  // Tuất
        11: 'Thuỷ'  // Hợi
    };

    // =====================
    // HÀNH 14 CHÍNH TINH
    // =====================

    const HANH_SAO = {
        'Tử Vi': 'Thổ',
        'Thiên Cơ': 'Mộc',
        'Thái Dương': 'Hoả',
        'Vũ Khúc': 'Kim',
        'Thiên Đồng': 'Thuỷ',
        'Liêm Trinh': 'Hoả',
        'Thiên Phủ': 'Thổ',
        'Thái Âm': 'Thuỷ',
        'Tham Lang': 'Thuỷ',
        'Cự Môn': 'Thuỷ',
        'Thiên Tướng': 'Thuỷ',
        'Thiên Lương': 'Mộc',
        'Thất Sát': 'Kim',
        'Phá Quân': 'Thuỷ'
    };

    /**
     * Phân tích quan hệ Ngũ Hành Sao ↔ Cung
     * @param {string} starName - Tên sao
     * @param {number} cungPos - Vị trí cung (0-11)
     * @returns {Object} { relation, hanhSao, hanhCung, text, ratingBonus }
     */
    function getHanhRelationSaoCung(starName, cungPos) {
        var hanhSao = HANH_SAO[starName];
        var hanhCung = HANH_CUNG[cungPos];
        if (!hanhSao || !hanhCung) return null;

        // Bảng Sinh-Khắc
        var sinh = { 'Kim': 'Thuỷ', 'Thuỷ': 'Mộc', 'Mộc': 'Hoả', 'Hoả': 'Thổ', 'Thổ': 'Kim' };
        var khac = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thuỷ': 'Hoả', 'Hoả': 'Kim', 'Thổ': 'Thuỷ' };

        var relation, text, ratingBonus;

        if (hanhSao === hanhCung) {
            relation = 'dong_hanh';
            text = hanhSao + ' = ' + hanhCung + ' → Đồng hành, hài hoà ổn định';
            ratingBonus = 1;
        } else if (sinh[hanhCung] === hanhSao) {
            relation = 'cung_sinh_sao';
            text = hanhCung + ' sinh ' + hanhSao + ' → Cung sinh Sao, được đất nuôi dưỡng';
            ratingBonus = 2;
        } else if (sinh[hanhSao] === hanhCung) {
            relation = 'sao_sinh_cung';
            text = hanhSao + ' sinh ' + hanhCung + ' → Sao sinh Cung, hao lực nhưng vẫn khá';
            ratingBonus = 0;
        } else if (khac[hanhCung] === hanhSao) {
            relation = 'cung_khac_sao';
            text = hanhCung + ' khắc ' + hanhSao + ' → Cung khắc Sao, sao bị kìm hãm';
            ratingBonus = -1;
        } else if (khac[hanhSao] === hanhCung) {
            relation = 'sao_khac_cung';
            text = hanhSao + ' khắc ' + hanhCung + ' → Sao khắc Cung, mạnh mẽ nhưng bất ổn';
            ratingBonus = -1;
        } else {
            relation = 'trung_tinh';
            text = hanhSao + ' / ' + hanhCung + ' → Trung tính';
            ratingBonus = 0;
        }

        return {
            relation: relation,
            hanhSao: hanhSao,
            hanhCung: hanhCung,
            text: text,
            ratingBonus: ratingBonus
        };
    }

    // =====================
    // HELPER FUNCTIONS
    // =====================

    /**
     * Xác định trạng thái miếu/hãm của 1 sao tại 1 cung
     * @returns {string} 'mieu' | 'vuong' | 'dac' | 'binh' | 'ham'
     */
    function getStarStatus(starName, cungPos) {
        const entry = MIEU_HAM[starName];
        if (!entry) return 'binh';
        if (entry.mieu && entry.mieu.includes(cungPos)) return 'mieu';
        if (entry.vuong && entry.vuong.includes(cungPos)) return 'vuong';
        if (entry.dac && entry.dac.includes(cungPos)) return 'dac';
        if (entry.ham && entry.ham.includes(cungPos)) return 'ham';
        return 'binh';
    }

    /**
     * Lấy weight modifier theo trạng thái miếu/hãm
     * @param {string} status - 'mieu' | 'vuong' | 'dac' | 'binh' | 'ham'
     * @param {string} nature - 'cat' | 'hung' | 'trung'
     * @returns {number} weight multiplier
     */
    function getStatusWeight(status, nature) {
        switch (status) {
            case 'mieu':
                return nature === 'hung' ? 0.7 : WEIGHTS.MIEU_BONUS; // Hung miếu → bớt xấu
            case 'vuong':
                return nature === 'hung' ? 0.85 : WEIGHTS.VUONG_BONUS;
            case 'ham':
                return nature === 'cat' ? WEIGHTS.HAM_HUNG_FLIP : WEIGHTS.HAM_PENALTY; // Cát hãm → xấu, Hung hãm → bớt xấu
            default:
                return 1.0;
        }
    }

    /**
     * Lấy cung đối chiếu (xung chiếu)
     */
    function getDoiCung(pos) {
        return (pos + 6) % 12;
    }

    /**
     * Lấy 2 cung tam hợp
     */
    function getTamHop(pos) {
        return [(pos + 4) % 12, (pos + 8) % 12];
    }

    /**
     * Lấy 2 cung giáp (kề bên)
     */
    function getGiapCung(pos) {
        return [(pos + 1) % 12, ((pos - 1) + 12) % 12];
    }

    /**
     * Kiểm tra sao có bị Tuần không
     */
    function isTuan(pos, tuanTriet) {
        return tuanTriet && tuanTriet.tuan && tuanTriet.tuan.includes(pos);
    }

    /**
     * Kiểm tra sao có bị Triệt không
     */
    function isTriet(pos, tuanTriet) {
        return tuanTriet && tuanTriet.triet && tuanTriet.triet.includes(pos);
    }

    /**
     * Tính weight tổng hợp cho 1 sao tại 1 vị trí
     * Bao gồm: miếu/hãm, Hoá, Tuần/Triệt
     */
    function calculateStarWeight(sao, cungPos, tuanTriet) {
        let weight = 1.0;

        // 1. Miếu/Hãm (chỉ áp dụng cho chính tinh)
        if (sao.type === 'chinh') {
            const status = getStarStatus(sao.name, cungPos);
            weight *= getStatusWeight(status, sao.nature);
        }

        // 2. Hoá
        if (sao.hoa === 'Lộc') weight *= WEIGHTS.HOA_LOC_BONUS;
        if (sao.hoa === 'Quyền') weight *= WEIGHTS.HOA_QUYEN_BONUS;
        if (sao.hoa === 'Khoa') weight *= WEIGHTS.HOA_KHOA_BONUS;
        if (sao.hoa === 'Kỵ') weight *= WEIGHTS.HOA_KY_PENALTY;

        // 3. Lưu Hoá
        if (sao.luuHoa === 'Lộc') weight *= WEIGHTS.LUU_HOA_WEIGHT * WEIGHTS.HOA_LOC_BONUS;
        if (sao.luuHoa === 'Kỵ') weight *= WEIGHTS.LUU_HOA_WEIGHT * WEIGHTS.HOA_KY_PENALTY;

        // 4. Song Kỵ / Song Lộc
        if (sao.hoa === 'Kỵ' && sao.luuHoa === 'Kỵ') weight *= WEIGHTS.SONG_KY_MULTIPLIER;
        if (sao.hoa === 'Lộc' && sao.luuHoa === 'Lộc') weight *= WEIGHTS.SONG_LOC_MULTIPLIER;

        // 5. Tuần/Triệt
        if (isTuan(cungPos, tuanTriet)) weight *= WEIGHTS.TUAN_PENALTY;
        if (isTriet(cungPos, tuanTriet)) weight *= WEIGHTS.TRIET_PENALTY;

        return weight;
    }

    // =====================
    // CẶP SAO KẾT HỢP (STAR COMBOS)
    // 40+ cặp quan trọng nhất trong Tử Vi Đẩu Số
    // =====================

    const STAR_COMBOS = [
        // === TỬ VI + X ===
        {
            stars: ['Tử Vi', 'Tham Lang'], name: 'Tử Tham', nature: 'mixed',
            effect: 'Đào Hoa Cửa Rồng - sang trọng nhưng đa tình, dễ sa vào tửu sắc. Miếu vượng thì phú quý phong lưu.',
            mieu: 'Phú quý phong lưu, đào hoa có vận, hưởng phúc nhưng cần giữ chừng mực.',
            ham: 'Sa đắm tửu sắc, tổn hao tài lộc, gia đình bất ổn.'
        },
        {
            stars: ['Tử Vi', 'Phá Quân'], name: 'Tử Phá', nature: 'mixed',
            effect: 'Phá cách lớn - dám phá bỏ cũ lập mới. Miếu thì như vua cách mạng, hãm thì bại hoại.',
            mieu: 'Đại thay đổi mang lại đại thành công, phá rồi lập lại lớn hơn.',
            ham: 'Phá hoại không kiểm soát, tài sản tiêu tán, sự nghiệp đổ vỡ.'
        },
        {
            stars: ['Tử Vi', 'Thiên Phủ'], name: 'Tử Phủ', nature: 'cat',
            effect: 'Vua có kho tàng - đại cát, giàu sang, quyền quý bậc nhất. Cần gặp ở cung Mệnh mới thực sự phát.',
            mieu: 'Đại phú đại quý, sự nghiệp vững chãi, tiền tài dồi dào.',
            ham: 'Chỉ có hư danh, lực bất tòng tâm.'
        },
        {
            stars: ['Tử Vi', 'Thiên Tướng'], name: 'Tử Tướng', nature: 'cat',
            effect: 'Vua có tướng giỏi - được nhiều quý nhân phò tá, dễ thành công lớn.',
            mieu: 'Được bề trên tin dùng, đại quý nhân chiếu mệnh, sự nghiệp hanh thông.',
            ham: 'Quý nhân ít, phải tự lực cánh sinh nhiều hơn.'
        },
        {
            stars: ['Tử Vi', 'Thất Sát'], name: 'Tử Sát', nature: 'mixed',
            effect: 'Vua cầm binh - uy quyền lừng lẫy nhưng cô đơn. Tốt cho sự nghiệp, kém cho gia đình.',
            mieu: 'Uy quyền hiển hách, có khả năng lãnh đạo lớn, thành tựu trong quân sự, kinh doanh.',
            ham: 'Cô độc, sát phạt quá mức, dễ mất tất cả.'
        },

        // === THIÊN CƠ + X ===
        {
            stars: ['Thiên Cơ', 'Thiên Lương'], name: 'Cơ Lương', nature: 'cat',
            effect: 'Mưu trí + phúc đức - người hiền trí, hay giúp đỡ người khác, có phúc đức che chở.',
            mieu: 'Trí tuệ sáng suốt, phúc thọ song toàn, thành công nhờ nhân đức.',
            ham: 'Hay lo lắng viển vông, thiếu thực tế, tính toán nhưng không hành động.'
        },
        {
            stars: ['Thiên Cơ', 'Cự Môn'], name: 'Cơ Cự', nature: 'mixed',
            effect: 'Mưu trí + khẩu thiệt - giỏi biện luận nhưng hay gây tranh cãi, cần kiểm soát lời nói.',
            mieu: 'Tài ăn nói xuất chúng, thành công nhờ biện luận. Tốt cho luật sư, thầy giáo.',
            ham: 'Thị phi, khẩu thiệt liên miên, mưu kế hại người lại hại mình.'
        },
        {
            stars: ['Thiên Cơ', 'Thái Âm'], name: 'Cơ Âm', nature: 'cat',
            effect: 'Mưu trí + dịu dàng - thông minh, tế nhị, có tài quản lý gia đình. Tốt cho nữ mệnh.',
            mieu: 'Thông minh nhu mì, tài quản lý ngầm, gia đạo hòa thuận.',
            ham: 'Đa sầu đa cảm, ưu phiền làm suy kiệt tinh thần.'
        },

        // === THÁI DƯƠNG + X ===
        {
            stars: ['Thái Dương', 'Thái Âm'], name: 'Nhật Nguyệt', nature: 'cat',
            effect: 'Mặt trời + Mặt trăng - Âm Dương hài hòa, đại cát. Cả 2 phải ở đúng vị trí sáng mới tốt.',
            mieu: 'Âm Dương đồng tề, phú quý vinh hoa, gia đình hòa thuận.',
            ham: 'Nhật Nguyệt phản bối, cha mẹ ly tán, tình duyên trắc trở.'
        },
        {
            stars: ['Thái Dương', 'Cự Môn'], name: 'Nhật Cự', nature: 'mixed',
            effect: 'Mặt trời soi sáng bóng tối - Cự Môn (ám tinh) gặp Thái Dương thì hết ám.',
            mieu: 'Thái Dương sáng xua tan chướng ngại của Cự Môn, tài năng tỏa sáng, danh tiếng lừng lẫy.',
            ham: 'Thái Dương tối không giải được Cự Môn, thị phi càng nặng.'
        },

        // === VŨ KHÚC + X ===
        {
            stars: ['Vũ Khúc', 'Tham Lang'], name: 'Vũ Tham', nature: 'mixed',
            effect: 'Tài tinh + Đào hoa - giỏi kinh doanh, giao tế rộng, nhưng ham vui dễ hao tài.',
            mieu: 'Tài năng kinh doanh xuất sắc, tài lộc dồi dào nhờ giao tế.',
            ham: 'Tham lam vô độ, hao tài vì tửu sắc, dễ sa vào cờ bạc.'
        },
        {
            stars: ['Vũ Khúc', 'Thiên Phủ'], name: 'Vũ Phủ', nature: 'cat',
            effect: 'Tài + Kho - đại tài, tích lũy giỏi, bền vững. Một trong những cặp giàu nhất.',
            mieu: 'Giàu có bền vững, tài năng quản lý xuất sắc, đất đai, bất động sản phát.',
            ham: 'Tiền bạc bấp bênh, kho rỗng, chi nhiều hơn thu.'
        },
        {
            stars: ['Vũ Khúc', 'Thiên Tướng'], name: 'Vũ Tướng', nature: 'cat',
            effect: 'Tài + Ấn - có tài lại được người bảo hộ, dễ thành công trong kinh doanh.',
            mieu: 'Được quý nhân phò trợ về tài chính, sự nghiệp ổn định.',
            ham: 'Tài chính bất ổn, thiếu người hỗ trợ.'
        },
        {
            stars: ['Vũ Khúc', 'Thất Sát'], name: 'Vũ Sát', nature: 'hung',
            effect: 'Tài + Sát - cương mãnh quyết liệt, sự nghiệp sóng gió, tài lộc bất ổn.',
            mieu: 'Dám làm dám chịu, kinh doanh mạo hiểm nhưng lãi lớn.',
            ham: 'Phá sản, mất mát nặng nề, tranh đấu khốc liệt.'
        },
        {
            stars: ['Vũ Khúc', 'Phá Quân'], name: 'Vũ Phá', nature: 'hung',
            effect: 'Tài + Hao - làm ra bao nhiêu tiêu bấy nhiêu, tài lộc không bền.',
            mieu: 'Tài năng đột phá, phá cách kinh doanh nhưng cần kiểm soát chi tiêu.',
            ham: 'Tiêu tán tài sản, nợ nần, hao hụt liên miên.'
        },

        // === THIÊN ĐỒNG + X ===
        {
            stars: ['Thiên Đồng', 'Thái Âm'], name: 'Đồng Âm', nature: 'cat',
            effect: 'Phúc + Mẫu - phúc lộc dồi dập, an nhàn, hưởng thụ. Rất tốt cho nữ mệnh.',
            mieu: 'Cuộc sống an nhàn phú quý, mẹ hiền gia đạo hòa thuận.',
            ham: 'Ỷ lại, thiếu ý chí, ham hưởng thụ quá mức.'
        },
        {
            stars: ['Thiên Đồng', 'Thiên Lương'], name: 'Đồng Lương', nature: 'cat',
            effect: 'Phúc + Thọ - cực tốt về phúc đức, sống thọ. Tốt cho cung Phúc Đức.',
            mieu: 'Phúc đức đầy đủ, sống thọ, tâm từ bi, được người kính trọng.',
            ham: 'Phúc mỏng, lo âu nhiều, thích an nhàn nhưng không được.'
        },
        {
            stars: ['Thiên Đồng', 'Cự Môn'], name: 'Đồng Cự', nature: 'mixed',
            effect: 'Phúc + Ám - nửa tốt nửa xấu, cuộc sống nhiều mâu thuẫn nội tâm.',
            mieu: 'Biết cách hưởng phúc dù có khó khăn, ăn nói khéo léo.',
            ham: 'Bất mãn, than vãn, miệng lưỡi gây họa.'
        },

        // === LIÊM TRINH + X ===
        {
            stars: ['Liêm Trinh', 'Thất Sát'], name: 'Liêm Sát', nature: 'hung',
            effect: 'CỰC HUNG - Tù + Sát = nhà tù + chiến tranh. Miếu thì dũng tướng, hãm thì tù tội.',
            mieu: 'Uy phong lẫm liệt, dũng tướng nơi chiến trường, thành đạt nhờ gan dạ.',
            ham: 'Tù tội, tai họa, đâm chém, pháp luật.'
        },
        {
            stars: ['Liêm Trinh', 'Tham Lang'], name: 'Liêm Tham', nature: 'mixed',
            effect: 'Tù + Đào hoa - đam mê, tửu sắc quá mức. Miếu thì tài hoa, hãm thì truỵ lạc.',
            mieu: 'Đa tài, hấp dẫn, nghệ thuật giỏi, duyên dáng.',
            ham: 'Say đắm tửu sắc, hao tài, dễ dính pháp luật vì sắc.'
        },
        {
            stars: ['Liêm Trinh', 'Phá Quân'], name: 'Liêm Phá', nature: 'hung',
            effect: 'Tù + Phá - hung dữ, phá hoại mạnh, cuộc đời sóng gió.',
            mieu: 'Dám phá vỡ xiềng xích, tinh thần cách mạng, thành công trong lĩnh vực mạo hiểm.',
            ham: 'Phá sản, tù tội, tai nạn, bệnh tật nặng.'
        },
        {
            stars: ['Liêm Trinh', 'Thiên Phủ'], name: 'Liêm Phủ', nature: 'cat',
            effect: 'Thiên Phủ cứu Liêm Trinh - kho tàng che chở sự nóng nảy, giàu có nhưng nghiêm khắc.',
            mieu: 'Giàu có, uy quyền, quản lý giỏi, tài chính vững.',
            ham: 'Tham lam, bủn xỉn, gia trưởng.'
        },
        {
            stars: ['Liêm Trinh', 'Thiên Tướng'], name: 'Liêm Tướng', nature: 'cat',
            effect: 'Tù + Ấn - Thiên Tướng che chở giảm hung của Liêm Trinh, quý nhân giúp qua nạn.',
            mieu: 'Được quý nhân cứu giúp qua mọi kiếp nạn, sự nghiệp ổn định.',
            ham: 'Quý nhân bạc đãi, phải tự đối mặt hiểm nguy.'
        },

        // === THAM LANG + X ===
        {
            stars: ['Tham Lang', 'Hoả Tinh'], name: 'Tham Hỏa', nature: 'cat',
            effect: 'ĐỘT PHÁT - Tham Lang gặp Hoả Tinh sẽ đột phát giàu có, thường là giàu bất ngờ.',
            mieu: 'Đại phát tài, giàu bất ngờ, một bước thành danh.',
            ham: 'Giàu nhanh mất nhanh, phát rồi bại, không bền.'
        },
        {
            stars: ['Tham Lang', 'Linh Tinh'], name: 'Tham Linh', nature: 'cat',
            effect: 'ĐỘT PHÁT - Tương tự Tham Hoả, đột phát nhưng ít mạnh hơn.',
            mieu: 'Phát tài bất ngờ, cơ hội đến nhanh.',
            ham: 'Phát rồi tan, tiền bạc không giữ được.'
        },

        // === CỰ MÔN + X ===
        {
            stars: ['Cự Môn', 'Đà La'], name: 'Cự Đà', nature: 'hung',
            effect: 'Ám + Quanh co - thị phi nặng, bị vu oan, khẩu thiệt liên miên.',
            mieu: 'Tài biện luận nhưng bị nghi ngờ, miệng tiếng xấu lan xa.',
            ham: 'Bị hãm hại, vu khống, thị phi dẫn đến tù tội.'
        },

        // === THẤT SÁT + X ===
        {
            stars: ['Thất Sát', 'Phá Quân'], name: 'Sát Phá', nature: 'hung',
            effect: 'Sát + Phá - cực kỳ biến động, cuộc đời sóng gió tận cùng.',
            mieu: 'Đại dũng tướng, phá bỏ mọi rào cản, thành tựu phi thường nếu kiên trì.',
            ham: 'Tai họa liên miên, phá hoại khốc liệt, thân bại danh liệt.'
        },
        {
            stars: ['Thất Sát', 'Kình Dương'], name: 'Sát Kình', nature: 'hung',
            effect: 'CỰC SAT - sự cương mãnh cùng cực, tuyệt đối không tránh được sóng gió.',
            mieu: 'Can đảm phi thường, anh hùng nơi chiến trận, thành công nhờ bản lĩnh.',
            ham: 'Tai nạn, gãy xương, chấn thương nặng, sát thương.'
        },

        // === PHÁ QUÂN + X ===
        {
            stars: ['Phá Quân', 'Kình Dương'], name: 'Phá Kình', nature: 'hung',
            effect: 'Phá + Sát - phá hoại + cương mãnh, cuộc đời nhiều thử thách lớn.',
            mieu: 'Phá cách mạnh mẽ, dám nghĩ dám làm nhưng phải trả giá.',
            ham: 'Tổn thất nặng nề, tai nạn, phá sản.'
        },

        // === PHỤ TINH QUAN TRỌNG ===
        {
            stars: ['Tả Phụ', 'Hữu Bật'], name: 'Tả Hữu', nature: 'cat',
            effect: 'Cánh tay phải trái - đại quý, nhiều người phò tá, dễ thành công nhờ quan hệ.',
            mieu: 'Quý nhân đầy, được giúp đỡ từ mọi phía, sự nghiệp thuận lợi.',
            ham: 'Bạn bè phản trắc, bị hại bởi chính người thân cận.'
        },
        {
            stars: ['Văn Xương', 'Văn Khúc'], name: 'Song Văn', nature: 'cat',
            effect: 'Đôi Văn tinh - tài hoa học vấn, giỏi cả văn lẫn nghệ, dễ đỗ đạt.',
            mieu: 'Tài hoa xuất chúng, học vấn cao, văn chương nổi tiếng.',
            ham: 'Hoa Đào kiếp, tài hoa bạc mệnh, giỏi nhưng không phát.'
        },
        {
            stars: ['Thiên Khôi', 'Thiên Việt'], name: 'Khôi Việt', nature: 'cat',
            effect: 'Đôi Quý nhân - được trời độ, gặp hung cũng hóa cát, luôn có người giúp.',
            mieu: 'Đại quý nhân chiếu mệnh, mọi việc đều có người giúp đỡ vượt qua.',
            ham: 'Quý nhân ít, phải tự xoay xở.'
        },
        {
            stars: ['Kình Dương', 'Đà La'], name: 'Song Sát', nature: 'hung',
            effect: 'Đôi Sát tinh - hung mãnh cùng cực, tai họa bất ngờ, thị phi.',
            mieu: 'Can đảm, dám đương đầu, thắng được nghịch cảnh.',
            ham: 'Tai nạn nặng, bị hãm hại, kiện tụng.'
        },
        {
            stars: ['Hoả Tinh', 'Linh Tinh'], name: 'Song Hỏa', nature: 'hung',
            effect: 'Đôi Hung tinh - bất ổn, nóng nảy, tai họa do lửa hoặc nổ.',
            mieu: 'Nhanh nhạy, quyết đoán nhanh.',
            ham: 'Cháy nổ, tai nạn bất ngờ, mất mát.'
        },
        {
            stars: ['Địa Không', 'Địa Kiếp'], name: 'Song Không', nature: 'hung',
            effect: 'Đôi Không Vong - trống rỗng tận cùng, mất mát, hao tài. Nhưng tốt cho tu hành, triết học.',
            mieu: 'Tư duy siêu thoát, tài năng sáng tạo phi thường, triết gia.',
            ham: 'Mất tất cả, phá sản, trống rỗng, cô đơn tuyệt đối.'
        },
        {
            stars: ['Lộc Tồn', 'Thiên Mã'], name: 'Lộc Mã', nature: 'cat',
            effect: 'Phát Tài nhờ di chuyển - buôn bán xa, xuất ngoại làm giàu, xuất khẩu.',
            mieu: 'Giàu nhờ buôn bán xa, xuất ngoại phát tài, di chuyển nhiều.',
            ham: 'Tài lộc bấp bênh do đi xa, hao tổn đường đi.'
        },
        {
            stars: ['Đào Hoa', 'Hồng Loan'], name: 'Đào Loan', nature: 'cat',
            effect: 'Tình duyên cực thịnh - hấp dẫn, nhiều người theo đuổi, dễ cưới hỏi.',
            mieu: 'Duyên phận tốt, hôn nhân hạnh phúc, bạn đời xinh đẹp/giỏi giang.',
            ham: 'Đa tình, dễ ngoại tình, tình cảm phức tạp.'
        },
        {
            stars: ['Tang Môn', 'Bạch Hổ'], name: 'Tang Bạch', nature: 'hung',
            effect: 'Tang + Sát = tang tóc, chia ly, mất mát người thân.',
            mieu: 'Nếu ở cung giải ách thì giải được hung.',
            ham: 'Tang sự, mất mát, chia ly đau đớn.'
        },
        {
            stars: ['Thiên Hình', 'Thiên Riêu'], name: 'Hình Riêu', nature: 'hung',
            effect: 'Hình phạt + Dâm - dễ dính scandal tình ái, bị xử phạt vì sắc dục.',
            mieu: 'Nghiêm khắc với bản thân trong chuyện tình cảm.',
            ham: 'Scandal tình ái, bị phạt vì tội liên quan dâm.'
        },
    ];

    /**
     * Phát hiện cặp sao kết hợp tại 1 cung
     * @param {Array} saoList - Danh sách sao tại cung
     * @param {number} cungPos - Vị trí cung (0-11)
     * @returns {Array} Danh sách combo detected
     */
    function detectCombos(saoList, cungPos) {
        var detected = [];
        var starNames = saoList.map(function (s) { return s.name; });

        for (var i = 0; i < STAR_COMBOS.length; i++) {
            var combo = STAR_COMBOS[i];
            var allPresent = true;
            for (var j = 0; j < combo.stars.length; j++) {
                if (starNames.indexOf(combo.stars[j]) === -1) {
                    allPresent = false;
                    break;
                }
            }
            if (!allPresent) continue;

            // Xác định miếu/hãm dựa trên chính tinh đầu tiên
            var mainStar = combo.stars[0];
            var status = getStarStatus(mainStar, cungPos);
            var isMieu = (status === 'mieu' || status === 'vuong');
            var isHam = (status === 'ham');

            detected.push({
                name: combo.name,
                stars: combo.stars,
                nature: combo.nature,
                effect: combo.effect,
                detail: isHam ? combo.ham : (isMieu ? combo.mieu : combo.effect),
                status: status,
                isMieu: isMieu,
                isHam: isHam
            });
        }
        return detected;
    }

    // =====================
    // THÁI DƯƠNG / THÁI ÂM SÁNG TỐI
    // =====================

    /**
     * Kiểm tra Thái Dương sáng hay tối
     * Sáng: Mão(3) → Thân(8) (ban ngày)
     * Tối: Dậu(9) → Dần(2) (ban đêm)
     */
    function isThaiDuongSang(cungPos) {
        return [2, 3, 4, 5, 6, 7, 8].indexOf(cungPos) >= 0;
    }

    /**
     * Kiểm tra Thái Âm sáng hay tối
     * Sáng: Dậu(9) → Dần(2) (ban đêm = Thái Âm sáng)
     * Tối: Mão(3) → Thân(8) (ban ngày = Thái Âm tối)
     */
    function isThaiAmSang(cungPos) {
        return [0, 1, 2, 8, 9, 10, 11].indexOf(cungPos) >= 0;
    }

    /**
     * Luận Thái Dương sáng/tối
     */
    function luanThaiDuong(cungPos) {
        if (isThaiDuongSang(cungPos)) {
            return {
                trangThai: 'sáng',
                text: 'Thái Dương tại cung ban ngày, tỏa sáng rực rỡ. Tốt cho danh tiếng, sự nghiệp, quan hệ xã hội. Đặc biệt tốt cho nam mệnh.',
                rating: 2
            };
        } else {
            return {
                trangThai: 'tối',
                text: 'Thái Dương tại cung ban đêm, ánh sáng yếu. Hao tổn cha hoặc chồng, tổn thương sức khỏe mắt. Danh tiếng bị che mờ.',
                rating: -2
            };
        }
    }

    /**
     * Luận Thái Âm sáng/tối
     */
    function luanThaiAm(cungPos) {
        if (isThaiAmSang(cungPos)) {
            return {
                trangThai: 'sáng',
                text: 'Thái Âm tại cung ban đêm, sáng tỏ dịu dàng. Tốt cho tài lộc, gia đình, mẹ, vợ. Đặc biệt tốt cho nữ mệnh.',
                rating: 2
            };
        } else {
            return {
                trangThai: 'tối',
                text: 'Thái Âm tại cung ban ngày, ánh trăng mờ nhạt. Tổn thương mẹ hoặc vợ, tình duyên trắc trở, ưu phiền.',
                rating: -2
            };
        }
    }

    // =====================
    // VÔ CHÍNH DIỆU (cung không có chính tinh)
    // =====================

    /**
     * Luận Vô Chính Diệu
     * Khi cung không có 14 chính tinh → lấy đối cung (cung xung chiếu) làm chủ
     */
    function luanVoChinhDieu(cungPos, cungName, saoMap, cungMap) {
        var doiPos = getDoiCung(cungPos);
        var doiCungName = cungMap ? cungMap[doiPos] : '';
        var doiSaoList = saoMap ? (saoMap[doiPos] || []) : [];
        var doiChinh = doiSaoList.filter(function (s) { return s.type === 'chinh'; });
        var doiChinhNames = doiChinh.map(function (s) { return s.name; }).join(', ');

        // Kiểm tra phụ tinh trong cung gốc có đáng kể không
        var gocSao = saoMap ? (saoMap[cungPos] || []) : [];
        var catPhu = gocSao.filter(function (s) { return s.nature === 'cat' && s.type !== 'chinh'; });
        var hungPhu = gocSao.filter(function (s) { return s.nature === 'hung' && s.type !== 'chinh'; });

        var text = 'Cung ' + cungName + ' Vô Chính Diệu — không có 14 chính tinh tọa thủ. ';
        text += 'Lấy đối cung ' + doiCungName + ' (' + (doiChinhNames || 'không có') + ') chiếu sang làm chủ đạo. ';
        if (catPhu.length > hungPhu.length) {
            text += 'Phụ tinh cát nhiều, bù đắp phần nào cho Vô Chính Diệu.';
        } else if (hungPhu.length > catPhu.length) {
            text += 'Phụ tinh hung nhiều, Vô Chính Diệu kèm hung tinh → cần đặc biệt cẩn trọng.';
        } else {
            text += 'Phụ tinh phải đảm nhiệm vai trò chính, cuộc đời chịu ảnh hưởng lớn từ môi trường bên ngoài.';
        }

        return {
            isVoChinhDieu: true,
            doiCungPos: doiPos,
            doiCungName: doiCungName,
            doiChinhTinh: doiChinhNames,
            text: text,
            rating: catPhu.length > hungPhu.length + 1 ? 0 : -1
        };
    }

    // =====================
    // TRÀNG SINH LUẬN GIẢI
    // =====================

    var TRUONG_SINH_LUAN = {
        'Trường Sinh': { rating: 2, text: 'Trường Sinh — khởi đầu tốt đẹp, sinh lực dồi dào, được nuôi dưỡng, phát triển thuận lợi.' },
        'Mộc Dục': { rating: 0, text: 'Mộc Dục — giai đoạn tắm gội, đào hoa mạnh, dễ sa vào cám dỗ sắc dục. Cần giữ mình.' },
        'Quan Đới': { rating: 1, text: 'Quan Đới — bắt đầu trưởng thành, có ý chí phấn đấu, được đề bạt hoặc thăng tiến.' },
        'Lâm Quan': { rating: 2, text: 'Lâm Quan — đại vượng, sự nghiệp hanh thông, quan lộc đạt đỉnh cao. Rất tốt cho công danh.' },
        'Đế Vượng': { rating: 3, text: 'Đế Vượng — CỰC THỊNH, sung mãn nhất, quyền lực tột đỉnh. Nhưng thịnh rồi sẽ suy.' },
        'Suy': { rating: -1, text: 'Suy — bắt đầu suy giảm, khí lực yếu dần, cần biết tiết chế để duy trì phúc lộc.' },
        'Bệnh': { rating: -2, text: 'Bệnh — sức khỏe suy yếu, nhiều bệnh tật, tinh thần mệt mỏi. Cần chú ý bảo dưỡng.' },
        'Tử': { rating: -3, text: 'Tử — suy kiệt, cùng cực, nhưng ẩn chứa mầm hồi sinh. Cần kiên trì vượt qua.' },
        'Mộ': { rating: -1, text: 'Mộ — cất giấu, tích trữ. Tốt cho tích lũy tài sản, nhưng khó phát triển đột phá.' },
        'Tuyệt': { rating: -2, text: 'Tuyệt — dứt đoạn, kết thúc chu kỳ cũ. Khó khăn nhưng là tiền đề cho cái mới.' },
        'Thai': { rating: 1, text: 'Thai — mầm mống mới, khởi đầu mới, hy vọng mới. Như thai nhi đang hình thành.' },
        'Dưỡng': { rating: 1, text: 'Dưỡng — được nuôi dưỡng chăm sóc, phúc đức tích lũy, chuẩn bị ra đời.' }
    };

    /**
     * Lấy luận giải Tràng Sinh tại 1 cung
     */
    function luanTruongSinh(truongSinhName) {
        return TRUONG_SINH_LUAN[truongSinhName] || { rating: 0, text: '' };
    }

    // =====================
    // NẠP ÂM LUẬN GIẢI
    // =====================

    var NAP_AM_LUAN = {
        'Hải Trung Kim': 'Vàng dưới biển — tiềm ẩn sâu xa, cần thời cơ mới phát. Người kiên nhẫn, cẩn thận.',
        'Lô Trung Hoả': 'Lửa trong lò — mạnh mẽ nhưng bị giới hạn. Cần môi trường tốt để bùng phát.',
        'Đại Lâm Mộc': 'Cây đại thụ rừng xanh — vững chãi, phát triển bền vững, nhiều người dựa vào.',
        'Lộ Bàng Thổ': 'Đất bên đường — lộ thiên, ai cũng thấy. Cuộc đời nhiều người biết.',
        'Kiếm Phong Kim': 'Vàng đầu kiếm — sắc bén, cương trực, quyết đoán. Thành công nhờ năng lực bản thân.',
        'Sơn Đầu Hoả': 'Lửa trên núi — rực rỡ nhưng khó kiểm soát. Nổi bật nhưng dễ mất phương hướng.',
        'Giản Hạ Thuỷ': 'Nước dưới khe — nhỏ nhưng chảy đều, kiên trì bền bỉ. Phát triển từ từ.',
        'Thành Đầu Thổ': 'Đất trên thành — cao quý, vững vàng, nền tảng tốt. Được bảo vệ.',
        'Bạch Lạp Kim': 'Vàng nến trắng — mỏng manh nhưng có giá trị. Cần được trân trọng.',
        'Dương Liễu Mộc': 'Cây liễu — mềm mại, dịu dàng, thích nghi tốt. Uyển chuyển vượt khó.',
        'Tuyền Trung Thuỷ': 'Nước trong suối — trong sạch, thanh cao. Cuộc sống thanh bình.',
        'Ốc Thượng Thổ': 'Đất trên nóc nhà — được bảo vệ, ổn định. An cư lạc nghiệp.',
        'Tích Lịch Hoả': 'Lửa sấm sét — mạnh mẽ, bùng phát bất ngờ. Đại khí muộn thành.',
        'Tùng Bách Mộc': 'Cây tùng bách — bất khuất, kiên cường, trường thọ. Không sợ gian khổ.',
        'Trường Lưu Thuỷ': 'Nước chảy dài — bền bỉ, không ngừng. Phát triển liên tục, tài lộc đều đặn.',
        'Sa Trung Kim': 'Vàng trong cát — cần gạn lọc mới thấy giá trị. Khó khăn ban đầu, sau phát.',
        'Sơn Hạ Hoả': 'Lửa dưới núi — tiềm ẩn, bùng phát khi có cơ hội. Âm thầm rất mạnh.',
        'Bình Địa Mộc': 'Cây đồng bằng — phát triển thường, không quá nổi bật nhưng ổn định.',
        'Bích Thượng Thổ': 'Đất trên vách — cao nhưng mỏng, cần nền tảng vững. Danh vọng cần giữ gìn.',
        'Kim Bạc Kim': 'Vàng lá mỏng — bóng bẩy, sang trọng bề ngoài. Cần tích lũy nội lực.',
        'Phú Đăng Hoả': 'Lửa đèn dầu — nhỏ nhưng soi sáng. Trí tuệ, hướng dẫn người khác.',
        'Thiên Hà Thuỷ': 'Nước sông Ngân — cao quý, thanh tao, nhưng xa vời. Người lý tưởng.',
        'Đại Trạch Thổ': 'Đất nền nhà lớn — vững chãi, to lớn, bền vững. Gia sản dồi dào.',
        'Thoa Xuyến Kim': 'Vàng trang sức — đẹp đẽ, quý giá. Cuộc sống sung túc.',
        'Tang Đố Mộc': 'Cây dâu — nuôi tằm dệt lụa, siêng năng, cần mẫn. Thành công nhờ lao động.',
        'Đại Khê Thuỷ': 'Nước khe lớn — mạnh mẽ, dồi dào. Tài năng phong phú.',
        'Sa Trung Thổ': 'Đất trong cát — cần bồi đắp mới vững. Khởi nghiệp khó, về sau ổn.',
        'Thiên Thượng Hoả': 'Lửa trên trời — rực rỡ nhất, sáng nhất. Đại quý nhưng ở trên cao.',
        'Thạch Lựu Mộc': 'Cây thạch lựu — hoa đẹp quả ngon. Cuộc sống viên mãn.',
        'Đại Hải Thuỷ': 'Nước biển lớn — bao la, sâu thẳm. Tầm nhìn rộng, đại khí.'
    };

    /**
     * Lấy luận giải Nạp Âm
     */
    function luanNapAm(menhNapAm) {
        return NAP_AM_LUAN[menhNapAm] || '';
    }

    // =====================
    // CONTEXTUAL EFFECT HELPER
    // =====================

    /**
     * Lấy effect/advice theo ngữ cảnh cung
     * @param {Object} pattern - Pattern object
     * @param {string} cungName - Tên cung (VD: 'MỆNH', 'TỬ TỨC')
     * @returns {Object} { effect, advice }
     */
    function getContextualEffect(pattern, cungName) {
        var effect = pattern.effect;
        var advice = pattern.advice;

        // Ưu tiên effectByHouse nếu có
        if (pattern.effectByHouse && pattern.effectByHouse[cungName]) {
            effect = pattern.effectByHouse[cungName];
        }
        if (pattern.adviceByHouse && pattern.adviceByHouse[cungName]) {
            advice = pattern.adviceByHouse[cungName];
        }

        return { effect: effect, advice: advice };
    }

    // =====================
    // EXPORTS
    // =====================

    return {
        MIEU_HAM,
        HUNG_PATTERNS,
        CAT_PATTERNS,
        SPIRITUAL_PATTERNS,
        STAR_COMBOS,
        TRUONG_SINH_LUAN,
        NAP_AM_LUAN,
        WEIGHTS,
        LUC_HOP_MAP,
        HANH_CUNG,
        HANH_SAO,
        getStarStatus,
        getStatusWeight,
        getDoiCung,
        getTamHop,
        getGiapCung,
        getLucHop,
        getLucHopName,
        getHanhRelationSaoCung,
        isTuan,
        isTriet,
        calculateStarWeight,
        detectCombos,
        isThaiDuongSang,
        isThaiAmSang,
        luanThaiDuong,
        luanThaiAm,
        luanVoChinhDieu,
        luanTruongSinh,
        luanNapAm,
        getContextualEffect
    };
})();
