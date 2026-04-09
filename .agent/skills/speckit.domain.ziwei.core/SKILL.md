---
name: "speckit.domain.ziwei.core"
description: "Logic Lập Khung Bàn (12 Cung), An Mệnh Thân & Cục Số."
---

# speckit.domain.ziwei.core — Base Layout & Destinations

Kỹ năng này chịu trách nhiệm cho các thuật toán định hình khung sườn (skeleton) của một Lá số Tử Vi: Địa bàn 12 cung, ví trí cung Mệnh/Thân, và tính toán Ngũ Hành Cục.

## 1. MÔ HÌNH ĐỊA BÀN UI (UI LAYOUT MODEL)
Khi code giao diện (Frontend) hoặc cấu trúc Array cho lá số Tử Vi, phải đảm bảo thứ tự của 12 cung địa chi luôn bắt đầu và cố định:
- Địa bàn Tử vi là một hình chữ nhật rỗng ruột (Trung cung chứa thông tin Mệnh chủ).
- Có 12 ô xếp xung quanh.
- **Quy tắc Index (0-11):** 
  - Index 0 thường map với cung `Dần` (Góc trái dưới cùng) hoặc tuỳ kiến trúc, nhưng theo thư viện chuẩn `iztro`: Index vòng quay xuôi kim đồng hồ từ Tý, Sửu, Dần. 
  - Tý (Dưới cùng bên phải 1 chút).

## 2. QUY TẮC AN MỆNH - THÂN (DESTINY/BODY PALACES)
Mọi việc luận giải đều xoay quanh Mệnh cung. 
Thuật toán (Tham khảo, nhắc AI khi review code tự lặp):
- Lấy cung **Dần làm tháng 1 (Giêng)**.
- **An Mệnh:** Từ Dần, đếm thuận (Dần, Mão, Thìn...) tới Tháng sinh Âm lịch. Từ cung đó, đếm nghịch (Ngược chiều kim đồng hồ: Tý, Hợi, Tuất...) tới Giờ sinh. Dừng ở đâu, đó là **Cung Mệnh**.
- **An Thân:** Từ Dần, đếm thuận (Dần, Mão, Thìn...) tới Tháng sinh. Từ cung đó tiếp tục đếm **thuận** tới Giờ sinh. Dừng ở đâu, đó là **Cung Thân**.
*Lưu ý code: Đếm Mệnh nghịch (-), Đếm Thân thuận (+).*

## 3. THUẬT TOÁN ĐỊNH CỤC SỐ (ELEMENT PHASE)
Ngũ hành Cục (Cục Số) là hệ số vòng quay cực kỳ quan trọng, quyết định vị trí vì sao trung tâm - Tử Vi, đồng thời định đoạt chu kì phát triển (Đại vận bắt đầu từ bao nhiêu tuổi).
- Có 5 Cục: Thuỷ Nhị Cục (2), Mộc Tam Cục (3), Kim Tứ Cục (4), Thổ Ngũ Cục (5), Hỏa Lục Cục (6).
- Thuật toán định Cục cần sử dụng **Can của Cung Mệnh** và **Chi của Cung Mệnh** ghép với bảng Lục Thập Hoa Giáp Nạp Âm.

## 4. QUY TRÌNH CHẠY ĐẠI VẬN (DECADE CYCLE)
- **Điểm bắt đầu:** Tại cung Mệnh, Đại vận đầu tiên bắt đầu bằng tuổi bằng Cục Số. (Ví dụ: Thổ Ngũ Cục -> Bắt đầu 5 tuổi, 15, 25, 35...).
- **Hướng chạy:** Dựa vào Âm/Dương của (Can) Năm Sinh và Giới tính (Nam/Nữ).
  - Cùng dấu (Âm Nữ, Dương Nam): Chạy Thuận chiều kim đồng hồ (+1 index).
  - Trái dấu (Âm Nam, Dương Nữ): Chạy Nghịch chiều kim đồng hồ (-1 index).

## 5. CHỈ THỊ (ACTION RULES)
Khi yêu cầu lập trình vòng Đại Vận (Decades):
- Dừng ngay suy nghĩ for-loop đơn giản. Phải tạo hàm xác định `YinYangGender()` trả về `isForward` (boolean).
- Khởi tạo array đại vận bằng cách duyệt từ `palace[LifeIndex]` và update giá trị bắt đầu bằng `ElementPhaseValue` (Cục số).
