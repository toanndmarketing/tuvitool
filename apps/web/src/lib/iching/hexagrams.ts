/**
 * 64 Quẻ Kinh Dịch — Dữ liệu tiếng Việt
 * Format: index = binary value (top-to-bottom, yang=1, yin=0)
 */

export interface Hexagram {
  id: number;
  name: string;
  unicode: string;
  binary: string;
  judgment: string;
  image: string;
}

// Full 64 hexagrams indexed by binary conversion (0-63)
const HEXAGRAMS_RAW: Record<number, Hexagram> = {
  0:  { id: 2,  name: "Khôn ☷☷ (Thuần Khôn)",     unicode: "䷁", binary: "000000", judgment: "Đất thuận theo trời, nhu thuận mà tiến, lợi cho người nữ. Tiên mê hậu đắc chủ.", image: "Đất trùng lặp, quân tử lấy đức dày mà chở vật." },
  1:  { id: 24, name: "Phục ☷☳ (Địa Lôi Phục)",    unicode: "䷗", binary: "000001", judgment: "Quay trở lại, hanh thông. Ra vào không bệnh. Bảy ngày trở lại.", image: "Sấm ở trong đất, các bậc tiên vương đóng cửa ngày Đông Chí." },
  2:  { id: 7,  name: "Sư ☷☵ (Địa Thủy Sư)",       unicode: "䷆", binary: "000010", judgment: "Quân đội, trượng phu chỉ huy thì cát, tiểu nhân thì hung.", image: "Nước trong đất, quân tử dung dân xây tường." },
  3:  { id: 19, name: "Lâm ☷☱ (Địa Trạch Lâm)",    unicode: "䷒", binary: "000011", judgment: "Đến gần, hanh thông. Đến tháng 8 thì hung.", image: "Đất trên chằm, quân tử dạy dỗ không mệt mỏi." },
  4:  { id: 15, name: "Khiêm ☷☶ (Địa Sơn Khiêm)",  unicode: "䷎", binary: "000100", judgment: "Khiêm tốn, hanh thông, quân tử có kết thúc tốt.", image: "Núi trong đất, quân tử bớt nhiều thêm ít, cân bằng sự vật." },
  5:  { id: 36, name: "Minh Di ☷☲ (Địa Hỏa Minh Di)", unicode: "䷣", binary: "000101", judgment: "Ánh sáng bị che lấp, lợi cho sự kiên nhẫn trong gian nan.", image: "Sáng vào trong đất, quân tử trị dân dùng tối mà sáng." },
  6:  { id: 46, name: "Thăng ☷☴ (Địa Phong Thăng)", unicode: "䷭", binary: "000110", judgment: "Đi lên, hanh thông lớn. Gặp đại nhân không lo, tiến về phương Nam thì cát.", image: "Cây mọc trong đất, quân tử thuận đức tích tiểu thành đại." },
  7:  { id: 11, name: "Thái ☷☰ (Địa Thiên Thái)",   unicode: "䷊", binary: "000111", judgment: "Nhỏ đi lớn đến, cát hanh thông.", image: "Trời đất giao hòa, vua tài bổ trợ đạo trời đất." },
  8:  { id: 16, name: "Dự ☳☷ (Lôi Địa Dự)",         unicode: "䷏", binary: "001000", judgment: "Vui vẻ, lợi cho việc lập quân đội, hành quân.", image: "Sấm vang đất, tiên vương dựng nhạc tôn đức." },
  9:  { id: 51, name: "Chấn ☳☳ (Thuần Chấn)",       unicode: "䷲", binary: "001001", judgment: "Sấm đến kinh hoàng. Cười nói vui vẻ. Sấm trăm dặm, không rơi thìa rượu.", image: "Sấm chồng sấm, quân tử sợ hãi tu tỉnh." },
  10: { id: 40, name: "Giải ☳☵ (Lôi Thủy Giải)",    unicode: "䷧", binary: "001010", judgment: "Giải thoát, lợi Tây Nam. Không có chỗ đi thì quay về mà cát.", image: "Sấm mưa làm, quân tử tha lỗi giảm tội." },
  11: { id: 54, name: "Quy Muội ☳☱ (Lôi Trạch Quy Muội)", unicode: "䷵", binary: "001011", judgment: "Em gái đi lấy chồng, chinh thì hung, không lợi gì.", image: "Sấm trên đầm, quân tử biết sự tệ qua vĩnh cửu." },
  12: { id: 62, name: "Tiểu Quá ☳☶ (Lôi Sơn Tiểu Quá)", unicode: "䷽", binary: "001100", judgment: "Hơi quá, hanh thông. Lợi cho sự kiên nhẫn, việc nhỏ thì được, việc lớn thì không.", image: "Sấm trên núi, quân tử hành vi quá cung kính." },
  13: { id: 55, name: "Phong ☳☲ (Lôi Hỏa Phong)",   unicode: "䷶", binary: "001101", judgment: "Dồi dào, vua đến. Chớ lo, thích hợp với giữa trưa.", image: "Sấm chớp đều đến, quân tử xử kiện phạt tội." },
  14: { id: 32, name: "Hằng ☳☴ (Lôi Phong Hằng)",   unicode: "䷟", binary: "001110", judgment: "Bền lâu, hanh thông, không lỗi. Lợi cho sự kiên nhẫn, lợi cho hướng đi.", image: "Sấm gió, quân tử giữ vững không đổi phương." },
  15: { id: 34, name: "Đại Tráng ☳☰ (Lôi Thiên Đại Tráng)", unicode: "䷡", binary: "001111", judgment: "Mạnh mẽ lớn lao, lợi cho sự kiên nhẫn.", image: "Sấm trên trời, quân tử không làm gì phi lễ." },
  16: { id: 8,  name: "Tỷ ☵☷ (Thủy Địa Tỷ)",        unicode: "䷇", binary: "010000", judgment: "Thân cận, cát. Xem xét quẻ nguyên, kiên nhẫn mãi mãi không lỗi. Kẻ bất an đến, người sau thì hung.", image: "Nước trên đất, tiên vương lập vạn quốc thân chư hầu." },
  17: { id: 3,  name: "Truân ☵☳ (Thủy Lôi Truân)",   unicode: "䷂", binary: "010001", judgment: "Khó khăn ban đầu, hanh thông lớn, lợi cho sự kiên nhẫn. Chưa nên đi đâu, lợi cho lập người phụ tá.", image: "Mây sấm, quân tử kinh luân." },
  18: { id: 29, name: "Khảm ☵☵ (Thuần Khảm)",       unicode: "䷜", binary: "010010", judgment: "Hố sâu chồng chất, có niềm tin thì vượt qua. Hành động có giá trị.", image: "Nước chồng nước, quân tử hành đức không mệt." },
  19: { id: 60, name: "Tiết ☵☱ (Thủy Trạch Tiết)",   unicode: "䷻", binary: "010011", judgment: "Tiết chế, hanh thông. Tiết chế cay đắng thì không thể kiên nhẫn.", image: "Nước trên đầm, quân tử chế độ số lượng, nghị đức hạnh." },
  20: { id: 39, name: "Kiển ☵☶ (Thủy Sơn Kiển)",    unicode: "䷦", binary: "010100", judgment: "Khó khăn, lợi Tây Nam, không lợi Đông Bắc. Lợi gặp đại nhân, kiên nhẫn thì cát.", image: "Nước trên núi, quân tử phản tỉnh tu đức." },
  21: { id: 63, name: "Ký Tế ☵☲ (Thủy Hỏa Ký Tế)", unicode: "䷾", binary: "010101", judgment: "Đã xong, hanh thông nhỏ. Lợi kiên nhẫn. Đầu cát cuối loạn.", image: "Nước trên lửa, quân tử lo nghĩ phòng hoạn." },
  22: { id: 48, name: "Tỉnh ☵☴ (Thủy Phong Tỉnh)",  unicode: "䷯", binary: "010110", judgment: "Giếng nước, đổi làng không đổi giếng. Không mất không được, đi đi lại lại.", image: "Gió trên nước, quân tử khuyến dân giúp nhau." },
  23: { id: 5,  name: "Nhu ☵☰ (Thủy Thiên Nhu)",     unicode: "䷄", binary: "010111", judgment: "Chờ đợi, có niềm tin, sáng hanh thông. Kiên nhẫn thì cát, lợi cho qua sông lớn.", image: "Mây lên trời, quân tử ăn uống yến tiệc vui vẻ." },
  24: { id: 45, name: "Tụy ☱☷ (Trạch Địa Tụy)",     unicode: "䷬", binary: "011000", judgment: "Tụ hội, hanh thông. Vua đến miếu thờ. Lợi gặp đại nhân, lợi kiên nhẫn.", image: "Đầm trên đất, quân tử trừ binh khí, giới phòng bất trắc." },
  25: { id: 17, name: "Tùy ☱☳ (Trạch Lôi Tùy)",     unicode: "䷐", binary: "011001", judgment: "Theo, hanh thông lớn. Lợi kiên nhẫn, không lỗi.", image: "Đầm có sấm, quân tử ngày tối vào nhà nghỉ ngơi." },
  26: { id: 47, name: "Khốn ☱☵ (Trạch Thủy Khốn)",  unicode: "䷮", binary: "011010", judgment: "Khốn cùng, hanh thông. Kiên nhẫn, đại nhân cát. Không lỗi, có lời không đáng tin.", image: "Đầm không nước, quân tử trí mạng toại chí." },
  27: { id: 58, name: "Đoài ☱☱ (Thuần Đoài)",       unicode: "䷹", binary: "011011", judgment: "Vui vẻ, hanh thông. Lợi cho sự kiên nhẫn.", image: "Đầm nối liền, quân tử bạn hữu giảng tập." },
  28: { id: 31, name: "Hàm ☱☶ (Trạch Sơn Hàm)",     unicode: "䷞", binary: "011100", judgment: "Cảm ứng, hanh thông. Lợi kiên nhẫn, lấy nữ thì cát.", image: "Đầm trên núi, quân tử hư tâm đón nhận người." },
  29: { id: 49, name: "Cách ☱☲ (Trạch Hỏa Cách)",   unicode: "䷰", binary: "011101", judgment: "Thay đổi, ngày kỷ tị thì được tin. Hanh thông lớn, lợi kiên nhẫn. Hối hận mất.", image: "Đầm có lửa, quân tử trị lịch sáng thời." },
  30: { id: 28, name: "Đại Quá ☱☴ (Trạch Phong Đại Quá)", unicode: "䷛", binary: "011110", judgment: "Quá lớn, cột trụ cong. Lợi cho hướng đi, hanh thông.", image: "Đầm ngập cây, quân tử đứng một mình không sợ, rời đời không buồn." },
  31: { id: 43, name: "Quải ☱☰ (Trạch Thiên Quải)",  unicode: "䷪", binary: "011111", judgment: "Quyết đoán, dâng lên triều vua. Kêu gọi thành thật, có nguy hiểm. Từ ấp mình mà đi.", image: "Đầm trên trời, quân tử ban lộc xuống dưới, kiêng hãnh đức." },
  32: { id: 23, name: "Bác ☶☷ (Sơn Địa Bác)",       unicode: "䷖", binary: "100000", judgment: "Bóc lột, không lợi cho hướng đi.", image: "Núi đất liền, bề trên hậu bên dưới để vững nhà." },
  33: { id: 27, name: "Di ☶☳ (Sơn Lôi Di)",          unicode: "䷚", binary: "100001", judgment: "Nuôi dưỡng, kiên nhẫn thì cát. Xem xét cái nuôi, tự tìm cái ăn cho miệng.", image: "Sấm dưới núi, quân tử cẩn thận lời nói, tiết chế ăn uống." },
  34: { id: 4,  name: "Mông ☶☵ (Sơn Thủy Mông)",     unicode: "䷃", binary: "100010", judgment: "Non nớt, hanh thông. Ta không tìm trẻ, trẻ tìm ta. Hỏi lần đầu báo, hỏi lại thì khinh.", image: "Suối chân núi, quân tử nuôi đức quả quyết." },
  35: { id: 41, name: "Tổn ☶☱ (Sơn Trạch Tổn)",     unicode: "䷨", binary: "100011", judgment: "Bớt đi, có niềm tin thì cát lớn. Không lỗi, lợi cho hướng đi.", image: "Đầm dưới núi, quân tử trừng giận bớt dục." },
  36: { id: 52, name: "Cấn ☶☶ (Thuần Cấn)",         unicode: "䷳", binary: "100100", judgment: "Núi, dừng lưng không thấy thân. Đi sân không thấy người, không lỗi.", image: "Núi chồng núi, quân tử suy nghĩ không ra ngoài vị trí." },
  37: { id: 22, name: "Bí ☶☲ (Sơn Hỏa Bí)",         unicode: "䷕", binary: "100101", judgment: "Trang sức, hanh thông. Việc nhỏ thì lợi cho hướng đi.", image: "Lửa dưới núi, quân tử sáng suốt chính trị không dám xử liệt." },
  38: { id: 18, name: "Cổ ☶☴ (Sơn Phong Cổ)",       unicode: "䷑", binary: "100110", judgment: "Sửa chữa, hanh thông lớn. Lợi qua sông lớn. Trước ngày giáp 3 ngày, sau ngày giáp 3 ngày.", image: "Gió dưới núi, quân tử chấn dân dục đức." },
  39: { id: 26, name: "Đại Súc ☶☰ (Sơn Thiên Đại Súc)", unicode: "䷙", binary: "100111", judgment: "Tích lớn, lợi kiên nhẫn. Không ăn nhà, cát. Lợi qua sông lớn.", image: "Trời trong núi, quân tử biết nhiều lời xưa việc cũ để nuôi đức." },
  40: { id: 35, name: "Tấn ☲☷ (Hỏa Địa Tấn)",       unicode: "䷢", binary: "101000", judgment: "Tiến lên, vua ban ngựa nhiều, ngày gặp 3 lần.", image: "Sáng ra trên đất, quân tử tự sáng minh đức." },
  41: { id: 21, name: "Phệ Hạp ☲☳ (Hỏa Lôi Phệ Hạp)", unicode: "䷔", binary: "101001", judgment: "Cắn hợp, hanh thông. Lợi dùng ngục tụng.", image: "Sấm chớp, tiên vương sáng phạt sửa luật." },
  42: { id: 64, name: "Vị Tế ☲☵ (Hỏa Thủy Vị Tế)", unicode: "䷿", binary: "101010", judgment: "Chưa xong, hanh thông. Cáo con qua sông ướt đuôi, không lợi.", image: "Lửa trên nước, quân tử thận trọng phân biệt vật để định vị." },
  43: { id: 38, name: "Khuê ☲☱ (Hỏa Trạch Khuê)",   unicode: "䷥", binary: "101011", judgment: "Trái ngược, việc nhỏ thì cát.", image: "Lửa trên đầm, quân tử đồng mà khác." },
  44: { id: 56, name: "Lữ ☲☶ (Hỏa Sơn Lữ)",         unicode: "䷷", binary: "101100", judgment: "Lữ hành, hanh thông nhỏ. Lữ kiên nhẫn thì cát.", image: "Lửa trên núi, quân tử sáng suốt thận trọng dùng hình phạt." },
  45: { id: 30, name: "Ly ☲☲ (Thuần Ly)",            unicode: "䷝", binary: "101101", judgment: "Lửa, lợi kiên nhẫn. Hanh thông. Nuôi bò mẹ thì cát.", image: "Sáng chồng sáng, đại nhân kế tục sáng soi bốn phương." },
  46: { id: 50, name: "Đỉnh ☲☴ (Hỏa Phong Đỉnh)",   unicode: "䷱", binary: "101110", judgment: "Vạc, cát lớn lao, hanh thông.", image: "Gió dưới lửa, quân tử chính vị ngưng mệnh." },
  47: { id: 14, name: "Đại Hữu ☲☰ (Hỏa Thiên Đại Hữu)", unicode: "䷍", binary: "101111", judgment: "Sở hữu lớn, hanh thông lớn.", image: "Lửa trên trời, quân tử ngăn ác dương thiện, thuận trời an mệnh." },
  48: { id: 20, name: "Quán ☴☷ (Phong Địa Quán)",    unicode: "䷓", binary: "110000", judgment: "Quan sát, rửa tay chưa dâng lễ. Có niềm tin ngẩng trông.", image: "Gió trên đất, tiên vương xem các phương dạy dân." },
  49: { id: 42, name: "Ích ☴☳ (Phong Lôi Ích)",      unicode: "䷩", binary: "110001", judgment: "Thêm vào, lợi cho hướng đi. Lợi qua sông lớn.", image: "Gió sấm, quân tử thấy thiện thì theo, có lỗi thì sửa." },
  50: { id: 59, name: "Hoán ☴☵ (Phong Thủy Hoán)",   unicode: "䷺", binary: "110010", judgment: "Tan rã, hanh thông. Vua đến miếu thờ. Lợi qua sông lớn, lợi kiên nhẫn.", image: "Gió trên nước, tiên vương hiến cho trời lập miếu." },
  51: { id: 61, name: "Trung Phu ☴☱ (Phong Trạch Trung Phu)", unicode: "䷼", binary: "110011", judgment: "Niềm tin ở giữa, cá heo cát. Lợi qua sông lớn, lợi kiên nhẫn.", image: "Gió trên đầm, quân tử nghị ngục hoãn tử." },
  52: { id: 53, name: "Tiệm ☴☶ (Phong Sơn Tiệm)",   unicode: "䷴", binary: "110100", judgment: "Tiến dần, nữ quy cát. Lợi kiên nhẫn.", image: "Cây trên núi, quân tử cư hiền đức thiện tục." },
  53: { id: 37, name: "Gia Nhân ☴☲ (Phong Hỏa Gia Nhân)", unicode: "䷤", binary: "110101", judgment: "Gia đình, lợi cho nữ kiên nhẫn.", image: "Gió từ lửa ra, quân tử lời có chất thực, hành vi bền vững." },
  54: { id: 57, name: "Tốn ☴☴ (Thuần Tốn)",         unicode: "䷸", binary: "110110", judgment: "Gió, hanh thông nhỏ. Lợi hướng đi, lợi gặp đại nhân.", image: "Gió theo gió, quân tử thuận mệnh hành sự." },
  55: { id: 9,  name: "Tiểu Súc ☴☰ (Phong Thiên Tiểu Súc)", unicode: "䷈", binary: "110111", judgment: "Tích nhỏ, hanh thông. Mây dày nhưng không mưa, từ vùng ngoại ô phía Tây.", image: "Gió trên trời, quân tử sửa văn đức." },
  56: { id: 12, name: "Bĩ ☰☷ (Thiên Địa Bĩ)",       unicode: "䷋", binary: "111000", judgment: "Bế tắc, người xấu. Không lợi cho quân tử kiên nhẫn. Lớn đi nhỏ đến.", image: "Trời đất không giao, quân tử kiệm đức tránh nan." },
  57: { id: 25, name: "Vô Vọng ☰☳ (Thiên Lôi Vô Vọng)", unicode: "䷘", binary: "111001", judgment: "Không sai lầm, hanh thông lớn. Lợi kiên nhẫn. Sai lầm thì tai họa, không lợi hướng đi.", image: "Sấm dưới trời, vạn vật đều không vọng. Tiên vương nuôi vạn vật." },
  58: { id: 6,  name: "Tụng ☰☵ (Thiên Thủy Tụng)",   unicode: "䷅", binary: "111010", judgment: "Kiện tụng, có niềm tin bị chặn. Cẩn thận thì cát. Kết thúc thì hung. Lợi gặp đại nhân, không lợi qua sông.", image: "Trời cùng nước trái chiều, quân tử mưu sự để bắt đầu." },
  59: { id: 10, name: "Lý ☰☱ (Thiên Trạch Lý)",      unicode: "䷉", binary: "111011", judgment: "Bước đi, giẫm đuôi hổ mà hổ không cắn. Hanh thông.", image: "Trời trên đầm, quân tử phân biệt trên dưới, định chí dân." },
  60: { id: 33, name: "Độn ☰☶ (Thiên Sơn Độn)",      unicode: "䷠", binary: "111100", judgment: "Ẩn tránh, hanh thông. Nhỏ lợi kiên nhẫn.", image: "Trời dưới núi, quân tử xa tiểu nhân không ghét mà nghiêm." },
  61: { id: 13, name: "Đồng Nhân ☰☲ (Thiên Hỏa Đồng Nhân)", unicode: "䷌", binary: "111101", judgment: "Cùng người ở đồng rộng, hanh thông. Lợi qua sông lớn, lợi quân tử kiên nhẫn.", image: "Trời cùng lửa, quân tử phân tộc biện vật." },
  62: { id: 44, name: "Cấu ☰☴ (Thiên Phong Cấu)",    unicode: "䷫", binary: "111110", judgment: "Gặp gỡ, nữ mạnh. Chớ lấy nữ.", image: "Gió dưới trời, vua ban lệnh bảo bốn phương." },
  63: { id: 1,  name: "Càn ☰☰ (Thuần Càn)",          unicode: "䷀", binary: "111111", judgment: "Trời, hanh thông, lợi kiên nhẫn lớn lao.", image: "Trời trùng lặp, quân tử tự cường không ngừng." },
};

/**
 * Tìm quẻ theo binary index
 */
export function getHexagramByBinary(binaryIndex: number): Hexagram | null {
  return HEXAGRAMS_RAW[binaryIndex] || null;
}

/**
 * Tìm quẻ theo ID (1-64)
 */
export function getHexagramById(id: number): Hexagram | null {
  for (const hex of Object.values(HEXAGRAMS_RAW)) {
    if (hex.id === id) return hex;
  }
  return null;
}
