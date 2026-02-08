/**
 * ============================================
 * THẦN SỐ HỌC - DỮ LIỆU LUẬN GIẢI
 * Ý nghĩa chi tiết của từng chỉ số
 * Theo Lê Đỗ Quỳnh Hương (Nhân Số Học)
 * ============================================
 */

const ThanSoHocData = (function () {
    'use strict';

    // =====================
    // LUẬN GIẢI SỐ CHỦ ĐẠO (Life Path)
    // =====================
    const LIFE_PATH = {
        1: {
            title: 'Số 1 - Người Tiên Phong',
            keywords: ['Độc lập', 'Lãnh đạo', 'Sáng tạo', 'Quyết đoán'],
            strengths: 'Bạn là người có tinh thần độc lập cao, tự tin và kiên định. Bạn sinh ra để dẫn đầu, luôn muốn tự mình khám phá và tạo ra con đường riêng. Khả năng sáng tạo và tập trung giúp bạn hoàn thành mọi mục tiêu đề ra.',
            weaknesses: 'Đôi khi quá cá nhân, ngại hợp tác, bướng bỉnh và khó chấp nhận ý kiến người khác. Cần học cách lắng nghe và chia sẻ hơn.',
            career: 'Doanh nhân, lãnh đạo, quản lý, nghệ sĩ độc lập, nhà sáng chế, lập trình viên.',
            love: 'Bạn cần một người bạn đời tôn trọng sự độc lập của bạn nhưng cũng giúp bạn kết nối cảm xúc sâu sắc hơn.',
            mission: 'Phát triển sự sáng tạo, dẫn dắt và truyền cảm hứng cho mọi người xung quanh.'
        },
        2: {
            title: 'Số 2 - Người Hòa Giải',
            keywords: ['Nhạy cảm', 'Trực giác', 'Hòa bình', 'Hợp tác'],
            strengths: 'Bạn sở hữu trực giác nhạy bén, có lòng trắc ẩn, nhìn thấu hai mặt của vấn đề. Khả năng hòa giải và kết nối con người là thiên phú đặc biệt của bạn. Bạn tinh tế, yêu chuộng hòa bình.',
            weaknesses: 'Dễ bị tổn thương, nhạy cảm quá mức, hay do dự và thiếu quyết đoán. Đôi khi quá phụ thuộc vào người khác.',
            career: 'Nhà tư vấn, nhà ngoại giao, nghệ sĩ, nhà tâm lý, giáo viên, chăm sóc sức khỏe.',
            love: 'Bạn là người yêu thủy chung, cần sự ổn định và tình cảm chân thành trong mối quan hệ.',
            mission: 'Trở thành sứ giả hòa bình, kết nối mọi người và mang lại sự hài hòa cho cuộc sống.'
        },
        3: {
            title: 'Số 3 - Người Biểu Đạt',
            keywords: ['Sáng tạo', 'Giao tiếp', 'Lạc quan', 'Nghệ thuật'],
            strengths: 'Bạn có khả năng biểu đạt xuất sắc, tràn đầy năng lượng sáng tạo và lạc quan. Bạn truyền cảm hứng cho người khác bằng lời nói, nghệ thuật hoặc hành động. Bạn yêu thích cuộc sống và lan tỏa niềm vui.',
            weaknesses: 'Có thể hời hợt, thiếu kiên nhẫn, phung phí năng lượng vào nhiều việc cùng lúc. Dễ mất tập trung và hay bỏ dở giữa chừng.',
            career: 'Nhà văn, nghệ sĩ, MC, diễn giả, thiết kế, marketing, truyền thông.',
            love: 'Bạn cần một mối quan hệ đầy màu sắc, vui vẻ và kích thích trí tuệ lẫn cảm xúc.',
            mission: 'Sáng tạo, truyền cảm hứng và mang niềm vui đến cho cuộc sống thông qua nghệ thuật biểu đạt.'
        },
        4: {
            title: 'Số 4 - Người Xây Dựng',
            keywords: ['Ổn định', 'Kỷ luật', 'Trách nhiệm', 'Thực tế'],
            strengths: 'Bạn là người thiên về thực tế, chăm chỉ với tính kỷ luật và trách nhiệm cao. Khả năng tổ chức, lập kế hoạch và xây dựng nền tảng vững chắc là thế mạnh đặc biệt. Kiên trì, trung thành, đáng tin cậy.',
            weaknesses: 'Bảo thủ, ngại thay đổi, kém linh hoạt. Đôi khi quá cứng nhắc trong suy nghĩ và hành động, khó chấp nhận sự bất ngờ.',
            career: 'Kỹ sư, kế toán, kiến trúc sư, quản lý dự án, ngân hàng, bất động sản.',
            love: 'Bạn coi trọng sự trung thành và ổn định trong tình cảm, cần người bạn đời đáng tin cậy.',
            mission: 'Xây dựng một cuộc sống vững chắc, có trật tự và mang lại sự an toàn cho mọi người.'
        },
        5: {
            title: 'Số 5 - Người Tự Do',
            keywords: ['Phiêu lưu', 'Tự do', 'Linh hoạt', 'Khám phá'],
            strengths: 'Bạn có trực giác mạnh mẽ, yêu thích sự tự do và khám phá. Tư duy mở, linh hoạt, sáng tạo và tràn đầy năng lượng. Bạn dễ thích nghi với mọi hoàn cảnh và truyền cảm hứng cho người khác bằng tinh thần phiêu lưu.',
            weaknesses: 'Bốc đồng, thiếu kiên nhẫn, nhanh chán và đôi khi thiếu trách nhiệm. Khó gắn bó lâu dài với một thứ.',
            career: 'Du lịch, báo chí, marketing, kinh doanh, nhiếp ảnh, nghệ sĩ biểu diễn.',
            love: 'Bạn cần tự do trong mối quan hệ, nhưng cũng cần sự kết nối sâu sắc để không trở nên cô đơn.',
            mission: 'Khám phá thế giới, trải nghiệm mọi góc cạnh cuộc sống, mang sự thay đổi tích cực đến cho xã hội.'
        },
        6: {
            title: 'Số 6 - Người Nuôi Dưỡng',
            keywords: ['Yêu thương', 'Trách nhiệm', 'Gia đình', 'Hài hòa'],
            strengths: 'Bạn là người tràn đầy tình yêu thương, có trách nhiệm cao với gia đình và cộng đồng. Bạn có khả năng chăm sóc, nuôi dưỡng và mang lại sự hài hòa cho mọi người. Bạn coi trọng cái đẹp và sự hoàn hảo.',
            weaknesses: 'Hay lo lắng quá mức, cầu toàn, kiểm soát. Đôi khi quên chăm sóc bản thân vì quá quan tâm đến người khác.',
            career: 'Bác sĩ, giáo viên, nhân viên xã hội, nghệ sĩ, thiết kế nội thất, tư vấn gia đình.',
            love: 'Bạn là người yêu hết mình, coi trọng gia đình và mong muốn xây dựng một tổ ấm hoàn hảo.',
            mission: 'Nuôi dưỡng tình yêu, mang lại sự hài hòa và cái đẹp cho cuộc sống.'
        },
        7: {
            title: 'Số 7 - Người Tìm Kiếm',
            keywords: ['Trí tuệ', 'Nội tâm', 'Chiêm nghiệm', 'Phân tích'],
            strengths: 'Bạn có tính cách hướng nội, thích suy nghĩ sâu xa và tìm kiếm chân lý. Trực giác nhạy bén, khả năng phân tích sắc bén. Bạn yêu kiến thức, ham học hỏi và luôn muốn hiểu bản chất sự vật.',
            weaknesses: 'Sống khép kín, lạnh lùng bề ngoài, khó gần. Đôi khi quá hoài nghi, cô đơn và tách biệt với thế giới bên ngoài.',
            career: 'Nhà khoa học, nhà nghiên cứu, triết gia, lập trình viên, nhà phân tích, nhà tâm linh.',
            love: 'Bạn cần không gian riêng nhưng cũng khao khát sự kết nối tâm hồn sâu sắc.',
            mission: 'Tìm kiếm chân lý, chiêm nghiệm cuộc sống và biến kiến thức thành giá trị thực tiễn.'
        },
        8: {
            title: 'Số 8 - Người Quyền Lực',
            keywords: ['Quyền lực', 'Thành công', 'Tài chính', 'Lãnh đạo'],
            strengths: 'Bạn có tư duy lãnh đạo, khả năng quản lý tài chính và ý chí mạnh mẽ. Tự lập, tầm nhìn xa, kỷ luật cao. Bạn tập trung vào kết quả thực tế và có khả năng tạo dựng sự giàu có, thịnh vượng.',
            weaknesses: 'Thích kiểm soát, quyền lực quá mức, dễ bị cuốn vào vật chất. Cần học cách cân bằng giữa tiền bạc và tình cảm.',
            career: 'CEO, doanh nhân, tài chính, ngân hàng, bất động sản, luật sư, chính trị gia.',
            love: 'Bạn cần người bạn đời hiểu và tôn trọng tham vọng của bạn, đồng thời giúp bạn mềm mỏng hơn.',
            mission: 'Làm chủ các nguồn lực, xây dựng thịnh vượng và dùng quyền lực để phục vụ cộng đồng.'
        },
        9: {
            title: 'Số 9 - Người Nhân Ái',
            keywords: ['Lý tưởng', 'Nhân ái', 'Cống hiến', 'Trí tuệ'],
            strengths: 'Bạn có tâm hồn rộng mở, luôn hướng đến phục vụ và cống hiến. Tính cách mạnh mẽ, đáng tin cậy, trực giác mạnh. Khả năng lắng nghe, thấu hiểu và truyền cảm hứng cho người khác.',
            weaknesses: 'Cầu toàn, làm việc theo cảm hứng, đôi khi lý tưởng hóa mọi thứ. Dễ bị kiệt sức khi cho đi quá nhiều.',
            career: 'Bác sĩ, nhà giáo dục, nghệ sĩ, nhà hoạt động xã hội, nhà truyền giáo, từ thiện.',
            love: 'Bạn yêu mãnh liệt và sâu sắc, cần tìm người có cùng tầm nhìn và giá trị sống.',
            mission: 'Phục vụ nhân loại, nâng cao đời sống cộng đồng và lan tỏa tình yêu thương đến mọi người.'
        },
        11: {
            title: 'Số 11 - Người Khai Sáng (Master Number)',
            keywords: ['Trực giác', 'Khai sáng', 'Truyền cảm hứng', 'Tâm linh'],
            strengths: 'Bạn sở hữu năng lượng tinh thần vượt trội, trực giác phi thường và sự nhạy cảm đặc biệt. Bạn có tầm nhìn xa trông rộng, khả năng truyền cảm hứng và ảnh hưởng sâu sắc đến người khác. Đây là số Master hiếm gặp.',
            weaknesses: 'Áp lực nội tâm lớn, dễ bị lo lắng, bất an. Đôi khi khó thực hiện được những lý tưởng quá cao của mình.',
            career: 'Nhà tâm linh, nghệ sĩ, nhà lãnh đạo tinh thần, nhà thơ, nhà tư vấn, diễn giả.',
            love: 'Bạn cần một mối quan hệ sâu sắc về mặt tâm hồn, vượt xa sự thu hút bề ngoài.',
            mission: 'Truyền cảm hứng và khai sáng cho nhân loại thông qua trí tuệ trực giác và tầm nhìn tâm linh.'
        },
        22: {
            title: 'Số 22 - Người Kiến Tạo (Master Number)',
            keywords: ['Kiến tạo', 'Tầm nhìn', 'Lãnh đạo', 'Thành tựu vĩ đại'],
            strengths: 'Bạn là "Master Builder" - người có khả năng biến giấc mơ vĩ đại thành hiện thực. Kết hợp trực giác của số 11 với tính thực tế của số 4. Tiềm năng vô hạn, tư duy thiên tài, chăm chỉ và kỷ luật.',
            weaknesses: 'Áp lực quá lớn từ tiềm năng, có thể cảm thấy bất an hoặc tự đánh giá thấp bản thân. Đôi khi trở nên kiêu ngạo.',
            career: 'Doanh nhân lớn, chính trị gia, kiến trúc sư, kỹ sư, nhà đầu tư, nhà lãnh đạo.',
            love: 'Bạn cần người bạn đời hiểu được tầm nhìn và hỗ trợ bạn xây dựng những điều vĩ đại.',
            mission: 'Xây dựng những công trình vĩ đại, tạo ảnh hưởng lớn và để lại di sản cho nhân loại.'
        },
        33: {
            title: 'Số 33 - Người Chữa Lành (Master Number)',
            keywords: ['Tình yêu', 'Nhân ái', 'Chữa lành', 'Phụng sự'],
            strengths: 'Bạn là "Master Healer" - có rung động tinh thần rất cao, khả năng sáng tạo, chữa lành và truyền cảm hứng phi thường. Sự ấm áp, tình yêu thuần khiết và lòng nhân ái vĩ đại là đặc trưng của bạn.',
            weaknesses: 'Cầu toàn đến khó tính, khó quản lý cảm xúc. Có thể hy sinh quá nhiều cho người khác đến mức tự làm hại bản thân.',
            career: 'Bác sĩ, nhà trị liệu, giáo viên, nhà từ thiện, nghệ sĩ, nhà hoạt động xã hội.',
            love: 'Bạn yêu với cả trái tim, sẵn sàng hy sinh vì người mình yêu, nhưng cần giữ ranh giới lành mạnh.',
            mission: 'Truyền bá tình yêu, chữa lành cộng đồng và trở thành tấm gương về tình yêu vĩ đại.'
        }
    };

    // =====================
    // LUẬN GIẢI NGÀY SINH (Birth Day)
    // =====================
    const BIRTH_DAY = {
        1: 'Tài năng lãnh đạo, tiên phong, sáng tạo. Bạn sinh ra với khả năng đứng đầu và tự mình quyết định.',
        2: 'Tài năng hợp tác, hòa giải, ngoại giao. Bạn có khả năng kết nối con người và giải quyết xung đột.',
        3: 'Tài năng biểu đạt, giao tiếp, nghệ thuật. Bạn có sức hút tự nhiên và khả năng truyền đạt xuất sắc.',
        4: 'Tài năng tổ chức, xây dựng nền tảng. Bạn giỏi lập kế hoạch và tạo dựng mọi thứ từ con số không.',
        5: 'Tài năng thích nghi, linh hoạt. Bạn có khả năng tự do di chuyển giữa các lĩnh vực một cách dễ dàng.',
        6: 'Tài năng nuôi dưỡng, chăm sóc. Bạn có khiếu thẩm mỹ và tình yêu thương vô điều kiện.',
        7: 'Tài năng phân tích, nghiên cứu. Bạn có trí tuệ sâu sắc và trực giác nhạy bén.',
        8: 'Tài năng quản lý, tài chính. Bạn có năng lực kinh doanh bẩm sinh và khả năng tạo dựng thịnh vượng.',
        9: 'Tài năng nhân đạo, lý tưởng. Bạn có tâm hồn rộng mở và khả năng truyền cảm hứng cho người khác.',
        11: 'Tài năng trực giác phi thường, khai sáng. Bạn là người có khả năng nhìn xa trông rộng đặc biệt.',
        22: 'Tài năng kiến tạo vĩ đại. Bạn sinh ra để xây dựng những điều to lớn và để lại dấu ấn.'
    };

    // =====================
    // LUẬN GIẢI SỐ THÁI ĐỘ
    // =====================
    const ATTITUDE = {
        1: 'Ấn tượng đầu tiên: Tự tin, mạnh mẽ, quyết đoán. Bạn cho người khác cảm giác tin cậy và bản lĩnh.',
        2: 'Ấn tượng đầu tiên: Nhẹ nhàng, thân thiện, lắng nghe. Bạn tạo cảm giác an toàn và đáng tin cậy.',
        3: 'Ấn tượng đầu tiên: Vui vẻ, lạc quan, thu hút. Bạn mang năng lượng tích cực đến cho mọi người.',
        4: 'Ấn tượng đầu tiên: Đáng tin cậy, chững chạc, ổn định. Bạn cho người khác cảm giác vững chắc.',
        5: 'Ấn tượng đầu tiên: Năng động, thú vị, cuốn hút. Bạn tạo ấn tượng mạnh bởi sự phiêu lưu và linh hoạt.',
        6: 'Ấn tượng đầu tiên: Ấm áp, quan tâm, tận tụy. Bạn khiến người khác cảm thấy được yêu thương.',
        7: 'Ấn tượng đầu tiên: Bí ẩn, sâu sắc, trí tuệ. Bạn tạo sự tò mò và tôn trọng từ người khác.',
        8: 'Ấn tượng đầu tiên: Quyền lực, chuyên nghiệp, thành công. Bạn tỏa ra aura của sự thành công.',
        9: 'Ấn tượng đầu tiên: Nhân hậu, rộng lượng, trí tuệ. Bạn khiến người khác muốn lắng nghe và tin tưởng.'
    };

    // =====================
    // LUẬN GIẢI SỐ LINH HỒN
    // =====================
    const SOUL_URGE = {
        1: 'Tâm hồn bạn khao khát sự độc lập và khả năng tự kiểm soát cuộc đời mình. Bạn muốn được dẫn đầu và không chịu phụ thuộc.',
        2: 'Tâm hồn bạn tìm kiếm sự hòa hợp, tình bạn và kết nối cảm xúc sâu sắc. Bạn muốn được yêu thương và yêu thương.',
        3: 'Tâm hồn bạn khao khát được biểu đạt bản thân qua sáng tạo và nghệ thuật. Bạn muốn được thấy, được nghe và được ngưỡng mộ.',
        4: 'Tâm hồn bạn tìm kiếm sự ổn định, trật tự và an toàn. Bạn muốn xây dựng một nền tảng vững chắc cho cuộc sống.',
        5: 'Tâm hồn bạn khao khát tự do và trải nghiệm mới. Bạn muốn được sống, được cảm nhận và khám phá thế giới.',
        6: 'Tâm hồn bạn tìm kiếm tình yêu, gia đình và sự hài hòa. Bạn muốn được chăm sóc và nuôi dưỡng người thân.',
        7: 'Tâm hồn bạn khao khát hiểu biết sâu sắc và chân lý. Bạn muốn tìm kiếm ý nghĩa cuộc sống vượt xa bề mặt.',
        8: 'Tâm hồn bạn tìm kiếm thành công vật chất và sự công nhận. Bạn muốn tạo dựng giá trị lâu dài cho thế giới.',
        9: 'Tâm hồn bạn khao khát cống hiến cho nhân loại. Bạn muốn để lại dấu ấn tốt đẹp và giúp đỡ mọi người.',
        11: 'Tâm hồn bạn tìm kiếm sự khai sáng tinh thần. Bạn có nhu cầu sâu xa về sự giác ngộ và truyền cảm hứng.',
        22: 'Tâm hồn bạn khao khát xây dựng những điều vĩ đại. Bạn muốn biến giấc mơ thành hiện thực ở quy mô lớn.',
        33: 'Tâm hồn bạn tràn ngập tình yêu và mong muốn chữa lành thế giới. Bạn muốn phụng sự nhân loại bằng tình yêu vô điều kiện.'
    };

    // =====================
    // LUẬN GIẢI SỐ NHÂN CÁCH
    // =====================
    const PERSONALITY = {
        1: 'Người khác nhìn bạn như một người mạnh mẽ, tự tin và có khả năng lãnh đạo. Bạn toát ra vẻ độc lập và quyết đoán.',
        2: 'Người khác thấy bạn dịu dàng, thân thiện và dễ gần. Bạn toát ra sự ấm áp và đáng tin cậy.',
        3: 'Người khác cảm nhận bạn là người vui vẻ, lạc quan và có sức hút. Bạn toát ra năng lượng tích cực.',
        4: 'Người khác thấy bạn đáng tin cậy, có trách nhiệm và kiên định. Bạn toát ra sự vững vàng và ổn định.',
        5: 'Người khác nhìn bạn như người năng động, phiêu lưu và thú vị. Bạn toát ra sự tự do và linh hoạt.',
        6: 'Người khác cảm nhận bạn ấm áp, quan tâm và tận tụy. Bạn toát ra tình yêu thương và sự chăm sóc.',
        7: 'Người khác thấy bạn bí ẩn, trí tuệ và sâu sắc. Bạn toát ra vẻ tinh tế và đáng kính.',
        8: 'Người khác nhìn bạn như người thành công, quyền lực và có uy tín. Bạn toát ra sự chuyên nghiệp.',
        9: 'Người khác cảm nhận bạn rộng lượng, nhân hậu và đáng ngưỡng mộ. Bạn toát ra tầm nhìn và trí tuệ.',
        11: 'Người khác thấy bạn có chiều sâu tâm linh, truyền cảm hứng và có sức hút đặc biệt.',
        22: 'Người khác nhìn bạn như người có tầm nhìn vĩ đại, có khả năng thay đổi thế giới.',
        33: 'Người khác cảm nhận bạn là người tràn đầy tình yêu, có khả năng chữa lành và phụng sự.'
    };

    // =====================
    // LUẬN GIẢI SỐ SỨ MỆNH
    // =====================
    const EXPRESSION = {
        1: 'Sứ mệnh của bạn là phát triển khả năng lãnh đạo, sự độc lập và sáng tạo. Bạn có tối đa tiềm năng để trở thành người tiên phong trong lĩnh vực của mình.',
        2: 'Sứ mệnh của bạn là phát triển khả năng hợp tác, ngoại giao và hòa giải. Bạn có tiềm năng trở thành người kết nối xuất sắc.',
        3: 'Sứ mệnh của bạn là phát triển khả năng sáng tạo và biểu đạt. Bạn có tiềm năng mang niềm vui và cảm hứng đến cho thế giới.',
        4: 'Sứ mệnh của bạn là xây dựng nền tảng vững chắc cho bản thân và người khác. Bạn có tiềm năng tạo dựng những giá trị bền vững.',
        5: 'Sứ mệnh của bạn là khám phá, phiêu lưu và mang sự thay đổi tích cực. Bạn có tiềm năng trải nghiệm phong phú nhất cuộc đời.',
        6: 'Sứ mệnh của bạn là nuôi dưỡng, chăm sóc và mang tình yêu đến cho mọi người. Bạn có tiềm năng tạo dựng gia đình và cộng đồng hạnh phúc.',
        7: 'Sứ mệnh của bạn là tìm kiếm chân lý, tri thức và sự giác ngộ. Bạn có tiềm năng trở thành người thầy, nhà hiền triết.',
        8: 'Sứ mệnh của bạn là tạo dựng thịnh vượng và sử dụng quyền lực một cách khôn ngoan. Bạn có tiềm năng tạo ra tài sản vật chất và tinh thần lớn.',
        9: 'Sứ mệnh của bạn là phụng sự nhân loại và truyền cảm hứng cho thế giới. Bạn có tiềm năng để lại di sản vĩ đại cho cộng đồng.',
        11: 'Sứ mệnh của bạn là khai sáng và nâng cao nhận thức tâm linh cho nhân loại. Bạn mang sứ mệnh đặc biệt.',
        22: 'Sứ mệnh của bạn là kiến tạo những công trình vĩ đại có ảnh hưởng đến nhiều người. Sứ mệnh Master Builder.',
        33: 'Sứ mệnh của bạn là chữa lành và nâng đỡ nhân loại bằng tình yêu vĩ đại. Sứ mệnh Master Healer.'
    };

    // =====================
    // LUẬN GIẢI NĂM CÁ NHÂN
    // =====================
    const PERSONAL_YEAR = {
        1: { title: 'Năm Khởi Đầu Mới', desc: 'Đây là năm bắt đầu chu kỳ 9 năm mới. Thời điểm tuyệt vời để khởi nghiệp, bắt đầu dự án mới, thay đổi cuộc sống. Hãy mạnh dạn hành động theo trực giác.' },
        2: { title: 'Năm Hợp Tác & Kiên Nhẫn', desc: 'Năm để xây dựng mối quan hệ, hợp tác và lắng nghe. Kiên nhẫn là chìa khóa. Đừng vội vàng, hãy để mọi thứ phát triển tự nhiên.' },
        3: { title: 'Năm Sáng Tạo & Biểu Đạt', desc: 'Năm tràn đầy năng lượng sáng tạo. Hãy biểu đạt bản thân, theo đuổi nghệ thuật, giao tiếp và tận hưởng cuộc sống.' },
        4: { title: 'Năm Xây Dựng Nền Tảng', desc: 'Năm để làm việc chăm chỉ, xây dựng nền tảng vững chắc. Tập trung vào kỷ luật, sức khỏe và tổ chức cuộc sống.' },
        5: { title: 'Năm Thay Đổi & Tự Do', desc: 'Năm mang đến nhiều thay đổi bất ngờ. Hãy linh hoạt, sẵn sàng đón nhận cơ hội mới. Du lịch, phiêu lưu và trải nghiệm.' },
        6: { title: 'Năm Gia Đình & Trách Nhiệm', desc: 'Năm tập trung vào gia đình, tình yêu và trách nhiệm. Có thể có sự kiện lớn liên quan đến gia đình: kết hôn, sinh con, tân gia.' },
        7: { title: 'Năm Nội Tâm & Nghiên Cứu', desc: 'Năm để suy ngẫm, học hỏi và phát triển tinh thần. Hãy dành thời gian cho bản thân, thiền định và tìm kiếm ý nghĩa sâu xa.' },
        8: { title: 'Năm Thành Công & Quyền Lực', desc: 'Năm thu hoạch, thành công tài chính và sự nghiệp. Cơ hội để thăng tiến, đầu tư và tạo dựng vị thế. Hãy tận dụng!' },
        9: { title: 'Năm Kết Thúc & Sẻ Chia', desc: 'Năm cuối của chu kỳ 9 năm. Thời điểm để buông bỏ, kết thúc những gì không còn phù hợp, chuẩn bị cho chu kỳ mới.' },
        11: { title: 'Năm Master - Khai Sáng', desc: 'Năm đặc biệt của số Master 11. Trực giác được nâng cao, nhiều cơ hội về mặt tinh thần và khai sáng.' },
        22: { title: 'Năm Master - Kiến Tạo', desc: 'Năm đặc biệt của số Master 22. Cơ hội xây dựng những dự án lớn, tạo ảnh hưởng sâu rộng.' }
    };

    // =====================
    // LUẬN GIẢI MŨI TÊN
    // =====================
    const ARROWS = {
        // Mũi tên mạnh (Strength)
        'Mũi tên Kế hoạch': {
            icon: '📋',
            desc: 'Bạn có khả năng lập kế hoạch và tổ chức xuất sắc. Bạn suy nghĩ trước khi hành động, đặt mục tiêu rõ ràng và làm việc hiệu quả theo hệ thống.'
        },
        'Mũi tên Ý chí': {
            icon: '💪',
            desc: 'Bạn có ý chí mạnh mẽ, kiên định và quyết tâm cao. Một khi đã quyết định, bạn sẽ theo đuổi đến cùng. Sức bền tinh thần phi thường.'
        },
        'Mũi tên Hoạt động': {
            icon: '🚀',
            desc: 'Bạn là người hành động, năng nổ và nhiệt huyết. Bạn không chỉ nghĩ mà còn biến ý tưởng thành hiện thực ngay lập tức.'
        },
        'Mũi tên Thực tế': {
            icon: '🏗️',
            desc: 'Bạn rất thực tế, chân thực và đáng tin cậy. Bạn tin vào những gì mắt thấy tai nghe, giỏi giải quyết vấn đề thực tiễn.'
        },
        'Mũi tên Cân bằng Cảm xúc': {
            icon: '⚖️',
            desc: 'Bạn có khả năng cân bằng cảm xúc tuyệt vời, thấu hiểu và đồng cảm. Bạn là người có trí tuệ cảm xúc cao.'
        },
        'Mũi tên Trí tuệ': {
            icon: '🧠',
            desc: 'Bạn có trí nhớ tốt, trí tuệ sắc bén và khả năng phân tích logic xuất sắc. Bạn học nhanh và nắm bắt vấn đề hiệu quả.'
        },
        'Mũi tên Quyết tâm': {
            icon: '🎯',
            desc: 'Bạn có sự quyết tâm kiên cường, kiên trì theo đuổi mục tiêu. Không gì có thể ngăn cản bạn trên con đường đã chọn.'
        },
        'Mũi tên Tâm linh': {
            icon: '🔮',
            desc: 'Bạn có trực giác tâm linh nhạy bén, khả năng cảm nhận và chấp nhận mọi thăng trầm cuộc sống với sự bình thản.'
        },
        // Mũi tên yếu (Weakness)
        'Mũi tên Hỗn loạn': {
            icon: '🌪️',
            desc: 'Bạn gặp khó khăn trong việc lập kế hoạch và tổ chức. Cần rèn luyện kỹ năng sắp xếp và quản lý thời gian.'
        },
        'Mũi tên Uất giận': {
            icon: '😤',
            desc: 'Bạn dễ bị tích tụ sự ức chế và khó kiểm soát cảm xúc tiêu cực. Cần học cách giải tỏa stress lành mạnh.'
        },
        'Mũi tên Thụ động': {
            icon: '😴',
            desc: 'Bạn thiếu động lực hành động, hay trì hoãn. Cần rèn luyện thói quen chủ động và bắt tay vào việc ngay.'
        },
        'Mũi tên Viển vông': {
            icon: '☁️',
            desc: 'Bạn thiên về lý tưởng hơn thực tế. Cần rèn luyện kỹ năng thực hành và tiếp xúc với thực tế nhiều hơn.'
        },
        'Mũi tên Nhạy cảm Quá mức': {
            icon: '💧',
            desc: 'Bạn dễ bị tổn thương và nhạy cảm quá mức. Cần xây dựng sự tự tin và bản lĩnh cảm xúc.'
        },
        'Mũi tên Trí nhớ Kém': {
            icon: '🔍',
            desc: 'Bạn có thể gặp khó khăn với trí nhớ và tư duy logic. Cần rèn luyện bằng đọc sách, giải đố và ghi chép.'
        },
        'Mũi tên Do dự': {
            icon: '❓',
            desc: 'Bạn hay lưỡng lự, thiếu quyết đoán, dễ bị dao động. Cần rèn luyện sự quyết đoán và tin vào bản thân.'
        },
        'Mũi tên Hoài nghi': {
            icon: '🤔',
            desc: 'Bạn cần bằng chứng cụ thể mới tin, khó chấp nhận những điều trừu tượng. Hãy mở lòng hơn với thế giới.'
        }
    };

    // =====================
    // LUẬN GIẢI SỐ THIẾU
    // =====================
    const MISSING_NUMBERS = {
        1: 'Thiếu số 1: Cần rèn luyện sự tự tin, khả năng tự lập và quyết đoán. Bạn có thể hay phụ thuộc vào người khác.',
        2: 'Thiếu số 2: Cần phát triển sự nhạy cảm, lắng nghe và khả năng hợp tác. Bạn có thể thiếu kiên nhẫn trong giao tiếp.',
        3: 'Thiếu số 3: Cần mở rộng khả năng biểu đạt và sáng tạo. Bạn có thể ngại thể hiện bản thân trước đám đông.',
        4: 'Thiếu số 4: Cần xây dựng tính kỷ luật và khả năng tổ chức. Bạn có thể thiếu sự kiên nhẫn trong công việc.',
        5: 'Thiếu số 5: Cần chấp nhận sự thay đổi và linh hoạt hơn. Bạn có thể ngại rời khỏi vùng an toàn.',
        6: 'Thiếu số 6: Cần phát triển trách nhiệm gia đình và tình yêu thương. Bạn có thể xa cách trong các mối quan hệ.',
        7: 'Thiếu số 7: Cần phát triển trực giác, sự chiêm nghiệm và tìm kiếm chiều sâu cuộc sống. Bạn có thể sống quá bề ngoài.',
        8: 'Thiếu số 8: Cần rèn luyện khả năng quản lý tài chính và quyền lực. Bạn có thể gặp khó khăn với tiền bạc.',
        9: 'Thiếu số 9: Cần mở rộng lòng nhân ái và khả năng cống hiến. Bạn có thể quá tập trung vào bản thân.'
    };

    // =====================
    // LUẬN GIẢI SỐ TRÙNG LẶP
    // =====================
    const DOMINANT_NUMBERS = {
        1: {
            2: 'Hai số 1: Khả năng biểu đạt tốt, tự tin giao tiếp và diễn đạt ý kiến.',
            3: 'Ba số 1: Rất nói nhiều, đôi khi giống như "máy nói". Cần học cách lắng nghe.',
            4: 'Bốn số 1 trở lên: Quá hiếm, cho thấy khả năng biểu đạt vượt trội nhưng cần kiểm soát.'
        },
        2: {
            2: 'Hai số 2: Trực giác mạnh, nhạy cảm với cảm xúc người khác.',
            3: 'Ba số 2: Quá nhạy cảm, dễ bị tổn thương và cần bảo vệ cảm xúc.',
            4: 'Bốn số 2 trở lên: Cực kỳ nhạy cảm, cần thiền định và cân bằng nội tâm.'
        },
        3: {
            2: 'Hai số 3: Trí tưởng tượng phong phú, sáng tạo tốt.',
            3: 'Ba số 3: Tưởng tượng quá mức, đôi khi xa rời thực tế. Cần thực tế hơn.',
            4: 'Bốn số 3 trở lên: Sống trong thế giới tưởng tượng, cần kết nối với thực tại.'
        },
        4: {
            2: 'Hai số 4: Rất thực tế, có hệ thống, giỏi tổ chức công việc.',
            3: 'Ba số 4: Quá cứng nhắc, máy móc, cần linh hoạt hơn.',
            4: 'Bốn số 4 trở lên: Cực kỳ kỷ luật nhưng có thể trở nên bảo thủ cực đoan.'
        },
        5: {
            2: 'Hai số 5: Cảm xúc mạnh, khả năng thúc đẩy động lực tốt.',
            3: 'Ba số 5: Cảm xúc quá mạnh, dễ bị chi phối, cần kiểm soát cảm xúc.',
            4: 'Bốn số 5 trở lên: Bạo lực cảm xúc, cần rèn luyện EQ rất nhiều.'
        },
        6: {
            2: 'Hai số 6: Sáng tạo cao, lo lắng quá mức cho người thân.',
            3: 'Ba số 6: Lo lắng cực đoan, cần buông bỏ sự kiểm soát.',
            4: 'Bốn số 6 trở lên: Lo lắng đến mức bệnh hoạn, cần hỗ trợ tâm lý.'
        },
        7: {
            2: 'Hai số 7: Phải trải qua mất mát để học bài học cuộc sống.',
            3: 'Ba số 7: Cuộc sống nhiều thử thách, đặc biệt về tình cảm và sức khỏe.',
            4: 'Bốn số 7 trở lên: Thử thách nặng nề, cần phát triển tâm linh mạnh mẽ.'
        },
        8: {
            2: 'Hai số 8: Rất nhạy cảm nhưng che giấu giỏi, chú trọng chi tiết.',
            3: 'Ba số 8: Cầu toàn quá mức, không bao giờ hài lòng.',
            4: 'Bốn số 8 trở lên: Cầu toàn cực đoan, gây áp lực cho bản thân và người khác.'
        },
        9: {
            2: 'Hai số 9: Lý tưởng cao, có tham vọng lớn và mục đích sống rõ ràng.',
            3: 'Ba số 9: Lý tưởng hóa quá mức, sống trong thế giới hoàn hảo tưởng tượng.',
            4: 'Bốn số 9 trở lên: Hoàn toàn tách rời thực tế, cần kết nối với đời sống thực.'
        }
    };

    // =====================
    // LUẬN GIẢI SỐ THÁCH THỨC
    // =====================
    const CHALLENGES = {
        0: 'Thách thức số 0: Tất cả hoặc không thách thức nào. Bạn có thể chọn bất kỳ điều gì để tập trung phát triển.',
        1: 'Thách thức số 1: Cần phát triển sự tự tin và khả năng đứng vững trên đôi chân mình, không phụ thuộc.',
        2: 'Thách thức số 2: Cần phát triển sự nhạy cảm, kiên nhẫn và khả năng hợp tác với người khác.',
        3: 'Thách thức số 3: Cần phát triển khả năng biểu đạt và sáng tạo, tránh phung phí năng lượng.',
        4: 'Thách thức số 4: Cần xây dựng kỷ luật, tính tổ chức và sự kiên nhẫn trong làm việc.',
        5: 'Thách thức số 5: Cần học cách cân bằng giữa tự do và trách nhiệm, tránh quá phóng túng.',
        6: 'Thách thức số 6: Cần cân bằng giữa chăm sóc người khác và chăm sóc bản thân mình.',
        7: 'Thách thức số 7: Cần phát triển niềm tin, sự tin tưởng và khả năng kết nối tâm linh.',
        8: 'Thách thức số 8: Cần xây dựng mối quan hệ lành mạnh với tiền bạc và quyền lực.'
    };

    // =====================
    // LUẬN GIẢI CHU KỲ ĐỈNH CAO
    // =====================
    const PINNACLES = {
        1: 'Đỉnh cao số 1: Giai đoạn phát triển sự độc lập, lãnh đạo và sáng tạo cá nhân.',
        2: 'Đỉnh cao số 2: Giai đoạn phát triển mối quan hệ, hợp tác và trực giác.',
        3: 'Đỉnh cao số 3: Giai đoạn bùng nổ sáng tạo, biểu đạt và giao tiếp.',
        4: 'Đỉnh cao số 4: Giai đoạn xây dựng nền tảng, làm việc chăm chỉ và kỷ luật.',
        5: 'Đỉnh cao số 5: Giai đoạn thay đổi, phiêu lưu và mở rộng trải nghiệm.',
        6: 'Đỉnh cao số 6: Giai đoạn tập trung gia đình, tình yêu và trách nhiệm xã hội.',
        7: 'Đỉnh cao số 7: Giai đoạn suy ngẫm, học hỏi sâu và phát triển tinh thần.',
        8: 'Đỉnh cao số 8: Giai đoạn thành công tài chính, quyền lực và ảnh hưởng.',
        9: 'Đỉnh cao số 9: Giai đoạn phụng sự, hoàn thành sứ mệnh và cống hiến.',
        11: 'Đỉnh cao số 11: Giai đoạn khai sáng tinh thần đặc biệt.',
        22: 'Đỉnh cao số 22: Giai đoạn kiến tạo những dự án vĩ đại.'
    };

    // Public API
    return {
        LIFE_PATH,
        BIRTH_DAY,
        ATTITUDE,
        SOUL_URGE,
        PERSONALITY,
        EXPRESSION,
        PERSONAL_YEAR,
        ARROWS,
        MISSING_NUMBERS,
        DOMINANT_NUMBERS,
        CHALLENGES,
        PINNACLES
    };

})();
