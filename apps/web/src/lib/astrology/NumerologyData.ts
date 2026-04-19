/**
 * THẦN SỐ HỌC - DỮ LIỆU LUẬN GIẢI
 * Theo phương pháp Pythagoras
 */

export interface NumerologyDescription {
    title?: string;
    keywords?: string[];
    strengths?: string;
    weaknesses?: string;
    career?: string;
    love?: string;
    mission?: string;
    desc?: string;
}

export const LIFE_PATH_DATA: Record<number, NumerologyDescription> = {
    1: {
        title: 'Số 1 - Người Tiên Phong',
        keywords: ['Độc lập', 'Lãnh đạo', 'Sáng tạo', 'Quyết đoán'],
        strengths: 'Bạn là người có tinh thần độc lập cao, tự tin và kiên định. Bạn sinh ra để dẫn đầu, luôn muốn tự mình khám phá và tạo ra con đường riêng.',
        weaknesses: 'Đôi khi quá cá nhân, ngại hợp tác, bướng bỉnh và khó chấp nhận ý kiến người khác.',
        career: 'Doanh nhân, lãnh đạo, quản lý, nghệ sĩ độc lập, nhà sáng chế, lập trình viên.',
        love: 'Bạn cần một người bạn đời tôn trọng sự độc lập của bạn nhưng cũng giúp bạn kết nối cảm xúc sâu sắc hơn.',
        mission: 'Phát triển sự sáng tạo, dẫn dắt và truyền cảm hứng cho mọi người xung quanh.'
    },
    2: {
        title: 'Số 2 - Người Hòa Giải',
        keywords: ['Nhạy cảm', 'Trực giác', 'Hòa bình', 'Hợp tác'],
        strengths: 'Bạn sở hữu trực giác nhạy bén, có lòng trắc ẩn, nhìn thấu hai mặt của vấn đề. Khả năng hòa giải và kết nối con người là thiên phú đặc biệt.',
        weaknesses: 'Dễ bị tổn thương, nhạy cảm quá mức, hay do dự và thiếu quyết đoán.',
        career: 'Nhà tư vấn, nhà ngoại giao, nghệ sĩ, nhà tâm lý, giáo viên, chăm sóc sức khỏe.',
        mission: 'Trở thành sứ giả hòa bình, kết nối mọi người và mang lại sự hài hòa cho cuộc sống.'
    },
    3: {
        title: 'Số 3 - Người Biểu Đạt',
        keywords: ['Sáng tạo', 'Giao tiếp', 'Lạc quan', 'Nghệ thuật'],
        strengths: 'Bạn có khả năng biểu đạt xuất sắc, tràn đầy năng lượng sáng tạo và lạc quan. Bạn truyền cảm hứng cho người khác bằng lời nói.',
        weaknesses: 'Có thể hời hợt, thiếu kiên nhẫn, phung phí năng lượng vào nhiều việc cùng lúc.',
        career: 'Nhà văn, nghệ sĩ, MC, diễn giả, thiết kế, marketing, truyền thông.',
        mission: 'Sáng tạo, truyền cảm hứng và mang niềm vui đến cho cuộc sống.'
    },
    4: {
        title: 'Số 4 - Người Xây Dựng',
        keywords: ['Ổn định', 'Kỷ luật', 'Trách nhiệm', 'Thực tế'],
        strengths: 'Bạn là người thiên về thực tế, chăm chỉ với tính kỷ luật và trách nhiệm cao. Khả năng tổ chức, lập kế hoạch xuất sắc.',
        weaknesses: 'Bảo thủ, ngại thay đổi, kém linh hoạt. Đôi khi quá cứng nhắc.',
        career: 'Kỹ sư, kế toán, kiến trúc sư, quản lý dự án, ngân hàng, bất động sản.',
        mission: 'Xây dựng một cuộc sống vững chắc, có trật tự và mang lại sự an toàn cho mọi người.'
    },
    5: {
        title: 'Số 5 - Người Tự Do',
        keywords: ['Phiêu lưu', 'Tự do', 'Linh hoạt', 'Khám phá'],
        strengths: 'Bạn có trực giác mạnh mẽ, yêu thích sự tự do và khám phá. Tư duy mở, linh hoạt và tràn đầy năng lượng.',
        weaknesses: 'Bốc đồng, thiếu kiên nhẫn, nhanh chán và đôi khi thiếu trách nhiệm.',
        career: 'Du lịch, báo chí, marketing, kinh doanh, nhiếp ảnh, nghệ sĩ biểu diễn.',
        mission: 'Khám phá thế giới, trải nghiệm mọi góc cạnh cuộc sống.'
    },
    6: {
        title: 'Số 6 - Người Nuôi Dưỡng',
        keywords: ['Yêu thương', 'Trách nhiệm', 'Gia đình', 'Hài hòa'],
        strengths: 'Bạn là người tràn đầy tình yêu thương, có trách nhiệm cao với gia đình. Khả năng nuôi dưỡng và mang lại sự hài hòa.',
        weaknesses: 'Hay lo lắng quá mức, cầu toàn, kiểm soát.',
        career: 'Bác sĩ, giáo viên, nhân viên xã hội, nghệ sĩ, thiết kế nội thất.',
        mission: 'Nuôi dưỡng tình yêu, mang lại sự hài hòa và cái đẹp cho cuộc sống.'
    },
    7: {
        title: 'Số 7 - Người Tìm Kiếm',
        keywords: ['Trí tuệ', 'Nội tâm', 'Chiêm nghiệm', 'Phân tích'],
        strengths: 'Bạn hướng nội, thích suy nghĩ sâu xa và tìm kiếm chân lý. Trực giác nhạy bén, khả năng phân tích sắc bén.',
        weaknesses: 'Sống khép kín, lạnh lùng bề ngoài, khó gần. Đôi khi quá hoài nghi.',
        career: 'Nhà khoa học, nhà nghiên cứu, triết gia, lập trình viên, nhà tâm linh.',
        mission: 'Tìm kiếm chân lý, chiêm nghiệm cuộc sống và chia sẻ trí tuệ.'
    },
    8: {
        title: 'Số 8 - Người Quyền Lực',
        keywords: ['Quyền lực', 'Thành công', 'Tài chính', 'Lãnh đạo'],
        strengths: 'Bạn có tư duy lãnh đạo, khả năng quản lý tài chính và ý chí mạnh mẽ. Tự lập, tầm nhìn xa.',
        weaknesses: 'Thích kiểm soát, quyền lực quá mức, dễ bị cuốn vào vật chất.',
        career: 'CEO, doanh nhân, tài chính, ngân hàng, bất động sản, chính trị gia.',
        mission: 'Làm chủ các nguồn lực, xây dựng thịnh vượng và dùng quyền lực phục vụ cộng đồng.'
    },
    9: {
        title: 'Số 9 - Người Nhân Ái',
        keywords: ['Lý tưởng', 'Nhân ái', 'Cống hiến', 'Trí tuệ'],
        strengths: 'Bạn có tâm hồn rộng mở, luôn hướng đến phục vụ và cống hiến. Đáng tin cậy, trực giác mạnh.',
        weaknesses: 'Cầu toàn, làm việc theo cảm hứng, dễ bị kiệt sức vì lý tưởng hóa.',
        career: 'Bác sĩ, nhà giáo dục, nghệ sĩ, nhà hoạt động xã hội, từ thiện.',
        mission: 'Phục vụ nhân loại, nâng cao đời sống cộng đồng và lan tỏa yêu thương.'
    },
    11: {
        title: 'Số 11 - Người Khai Sáng (Master)',
        keywords: ['Trực giác', 'Khai sáng', 'Tâm linh'],
        strengths: 'Bạn sở hữu năng lượng tinh thần vượt trội, trực giác phi thường. Tầm nhìn xa trông rộng.',
        mission: 'Truyền cảm hứng và khai sáng thông qua trí tuệ trực giác.'
    },
    22: {
        title: 'Số 22 - Người Kiến Tạo (Master)',
        keywords: ['Kiến tạo', 'Tầm nhìn', 'Thành tựu'],
        strengths: 'Bạn là "Master Builder" - có khả năng biến giấc mơ vĩ đại thành hiện thực. Kết hợp trực giác và thực tế.',
        mission: 'Xây dựng những công trình vĩ đại và để lại di sản cho nhân loại.'
    },
    33: {
        title: 'Số 33 - Người Chữa Lành (Master)',
        keywords: ['Tình yêu', 'Nhân ái', 'Chữa lành'],
        strengths: 'Rung động tinh thần rất cao, khả năng sáng tạo và chữa lành phi thường. Tình yêu thuần khiết.',
        mission: 'Truyền bá tình yêu, chữa lành cộng đồng và phụng sự nhân loại.'
    }
};

export const BIRTH_DAY_DATA: Record<number, string> = {
    1: 'Tài năng lãnh đạo, tiên phong, sáng tạo. Bạn sinh ra với khả năng đứng đầu.',
    2: 'Tài năng hợp tác, hòa giải, ngoại giao. Bạn có khả năng kết nối con người.',
    3: 'Tài năng biểu đạt, giao tiếp, nghệ thuật. Bạn có sức hút tự nhiên.',
    4: 'Tài năng tổ chức, xây dựng nền tảng. Bạn giỏi lập kế hoạch.',
    5: 'Tài năng thích nghi, linh hoạt. Bạn có khả năng thay đổi linh hoạt.',
    6: 'Tài năng nuôi dưỡng, chăm sóc. Bạn có khiếu thẩm mỹ và tình yêu thương.',
    7: 'Tài năng phân tích, nghiên cứu. Bạn có trí tuệ sâu sắc.',
    8: 'Tài năng quản lý, tài chính. Bạn có năng lực kinh doanh bẩm sinh.',
    9: 'Tài năng nhân đạo, lý tưởng. Bạn có tâm hồn rộng mở.',
    11: 'Tài năng trực giác phi thường, khai sáng.',
    22: 'Tài năng kiến tạo vĩ đại. Bạn sinh ra để xây dựng những điều to lớn.'
};

export const ATTITUDE_DATA: Record<number, string> = {
    1: 'Tự tin, mạnh mẽ, quyết đoán. Bạn cho người khác cảm giác tin cậy.',
    2: 'Nhẹ nhàng, thân thiện, lắng nghe. Bạn tạo cảm giác an toàn.',
    3: 'Vui vẻ, lạc quan, thu hút. Bạn mang năng lượng tích cực.',
    4: 'Đáng tin cậy, chững chạc, ổn định. Bạn cho người khác cảm giác vững chắc.',
    5: 'Năng động, thú vị, cuốn hút. Bạn tạo ấn tượng bởi sự phiêu lưu.',
    6: 'Ấm áp, quan tâm, tận tụy. Bạn khiến người khác cảm thấy được yêu thương.',
    7: 'Bí ẩn, sâu sắc, trí tuệ. Bạn tạo sự tò mò và tôn trọng.',
    8: 'Quyền lực, chuyên nghiệp, thành công. Bạn tỏa ra aura của sự thành đạt.',
    9: 'Nhân hậu, rộng lượng, trí tuệ. Bạn khiến người khác muốn lắng nghe.'
};

export const ARROW_DATA: Record<string, { icon: string; desc: string }> = {
    'Mũi tên Kế hoạch': { icon: '📋', desc: 'Lập kế hoạch và tổ chức xuất sắc. Suy nghĩ kỹ trước khi hành động.' },
    'Mũi tên Ý chí': { icon: '💪', desc: 'Ý chí mạnh mẽ, kiên định. Sức bền tinh thần phi thường.' },
    'Mũi tên Hoạt động': { icon: '🚀', desc: 'Người hành động, năng nổ. Biến ý tưởng thành hiện thực nhanh chóng.' },
    'Mũi tên Thực tế': { icon: '🏗️', desc: 'Thực tế, đáng tin cậy. Giỏi giải quyết vấn đề thực tiễn.' },
    'Mũi tên Cân bằng Cảm xúc': { icon: '⚖️', desc: 'Trí tuệ cảm xúc cao, thấu hiểu và đồng cảm.' },
    'Mũi tên Trí tuệ': { icon: '🧠', desc: 'Trí nhớ tốt, trí tuệ sắc bén, phân tích logic xuất sắc.' },
    'Mũi tên Quyết tâm': { icon: '🎯', desc: 'Quyết tâm kiên cường, không gì có thể ngăn cản.' },
    'Mũi tên Tâm linh': { icon: '🔮', desc: 'Trực giác tâm linh nhạy bén, chấp nhận cuộc sống bình thản.' },
    'Mũi tên Hỗn loạn': { icon: '🌪️', desc: 'Gặp khó khăn trong việc lập kế hoạch. Cần rèn luyện tính ngăn nắp.' },
    'Mũi tên Uất giận': { icon: '😤', desc: 'Dễ tích tụ uất ức. Cần học cách giải tỏa stress lành mạnh.' },
    'Mũi tên Thụ động': { icon: '😴', desc: 'Thiếu động lực, hay trì hoãn. Cần rèn luyện sự chủ động.' },
    'Mũi tên Viển vông': { icon: '☁️', desc: 'Thiên về lý tưởng, xa rời thực tế. Cần rèn kỹ năng thực hành.' },
    'Mũi tên Nhạy cảm Quá mức': { icon: '💧', desc: 'Dễ bị tổn thương. Cần xây dựng bản lĩnh cảm xúc.' },
    'Mũi tên Trí nhớ Kém': { icon: '🔍', desc: 'Gặp khó khăn với logic và trí nhớ. Cần rèn luyện trí não.' },
    'Mũi tên Do dự': { icon: '❓', desc: 'Lưỡng lự, thiếu quyết đoán. Cần tin vào bản thân hơn.' },
    'Mũi tên Hoài nghi': { icon: '🤔', desc: 'Khó chấp nhận những điều trừu tượng. Cần mở lòng hơn.' }
};

export const PERSONAL_YEAR_DATA: Record<number, { title: string; desc: string }> = {
    1: { title: 'Năm Khởi Đầu Mới', desc: 'Bắt đầu chu kỳ 9 năm mới. Thời điểm tuyệt vời để khởi nghiệp, thay đổi cuộc sống.' },
    2: { title: 'Năm Hợp Tác & Kiên Nhẫn', desc: 'Xây dựng mối quan hệ và lắng nghe. Kiên nhẫn là chìa khóa.' },
    3: { title: 'Năm Sáng Tạo & Biểu Đạt', desc: 'Tràn đầy năng lượng sáng tạo. Hãy tận hưởng cuộc sống.' },
    4: { title: 'Năm Xây Dựng Nền Tảng', desc: 'Làm việc chăm chỉ, tổ chức cuộc sống kỷ luật.' },
    5: { title: 'Năm Thay Đổi & Tự Do', desc: 'Nhiều thay đổi bất ngờ. Du lịch và trải nghiệm mới.' },
    6: { title: 'Năm Gia Đình & Trách Nhiệm', desc: 'Tập trung vào tình yêu và gia đình. Trách nhiệm cao.' },
    7: { title: 'Năm Nội Tâm & Nghiên Cứu', desc: 'Suy ngẫm, học hỏi và phát triển tinh thần.' },
    8: { title: 'Năm Thành Công & Quyền Lực', desc: 'Năm thu hoạch, thành công tài chính và sự nghiệp.' },
    9: { title: 'Năm Kết Thúc & Sẻ Chia', desc: 'Buông bỏ những gì không còn phù hợp, chuẩn bị chu kỳ mới.' }
};
