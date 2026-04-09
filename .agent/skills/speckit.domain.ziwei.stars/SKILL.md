---
name: "speckit.domain.ziwei.stars"
description: "Thuật toán An 108 Sao Tử Vi Đẩu Số (Chính Tinh, Phụ Tinh, Tứ Hóa)."
---

# speckit.domain.ziwei.stars — Stars Placement Logic

Kỹ năng này xác định các quy tắc cốt lõi về sự phân bổ của 108 sao trong Tử Vi. Khi thiết kế code, AI cần chia cụm sao này thành các module độc lập.

## 1. VÒNG CHÍNH TINH (MAJOR STARS ALGORITHM)
Có 14 chính tinh, chia thành 2 vòng cốt lõi phụ thuộc nhau:

### 1.1 Vòng Tử Vi (Phụ thuộc: Ngày Sinh & Cục Số)
- Vị trí Tử Vi (Zi Wei) được tính thông qua bảng tra chéo giữa **Ngày Dương/Âm Lịch** và **Ngũ Hành Cục**.
- Từ cung có Tử Vi, các sao còn lại được an theo thứ tự **Nghịch** (ngược chiều kim đồng hồ):
  `Tử Vi -> Thiên Cơ -> (Cách 1 cung) -> Thái Dương -> Vũ Khúc -> Thiên Đồng -> (Cách 2 cung) -> Liêm Trinh`.

### 1.2 Vòng Thiên Phủ (Phụ thuộc: Vị trí sao Tử Vi)
- **Quy tắc tuyệt đối:** Thiên Phủ luôn đối xứng với Tử Vi qua trục Dần - Thân (Index: 2 và 8). Nghĩa là `Vi_Index + Phu_Index = 14 (hoặc 2)`.
- Từ cung có Thiên Phủ, các sao còn lại được an theo thứ tự **Thuận** (cùng chiều kim đồng hồ):
  `Thiên Phủ -> Thái Âm -> Tham Lang -> Cự Môn -> Thiên Tướng -> Thiên Lương -> Thất Sát -> (Cách 3 cung) -> Phá Quân`.

## 2. VÒNG SÁT TINH & CÁT TINH (DEPENDENCIES)
Khi viết hàm `placeMinorStars()`, phải cấu trúc dữ liệu theo nhóm dependency để dễ maintain:

*   **Nhóm theo Năm Sinh (Can Chi của Năm):** Lộc Tồn, Kình Dương (+1 Lộc Tồn), Đà La (-1 Lộc Tồn), Thiên Khôi, Thiên Việt, Tuần, Triệt, vòng Thái Tuế (12 sao).
*   **Nhóm theo Tháng Sinh:** Tả Phù (tính từ Thìn, đi thuận đến tháng), Hữu Bật (tính từ Tuất, đi nghịch đến tháng).
*   **Nhóm theo Giờ Sinh:** Văn Xương (từ Tuất nghịch đến giờ), Văn Khúc (từ Thìn thuận đến giờ), Địa Không (từ Hợi nghịch đến giờ), Địa Kiếp (từ Hợi thuận đến giờ).

## 3. TỨ HOÁ (THE FOUR TRANSFORMATIONS)
Tứ Hoá là hệ thống "Modifier" (Trạng thái thay đổi) ghép chung với 14 Chính Tinh, bao gồm: `Khoa` (Ke), `Quyền` (Quan), `Lộc` (Lu), `Kỵ` (Ji).
- Đừng bao giờ hardcode 18 sao Tứ Hoá như các sao độc lập. Hãy map chúng như một property của sao gốc. (VD: Thái Dương Hóa Kỵ).
- Có 3 loại Tứ Hóa cần phân biệt cấu trúc Database:
  1. **Năm Sinh Tứ Hóa (Birth Year Hua):** Áp dụng lên lá số gốc (Mệnh Bàn). Phụ thuộc Thiên Can năm sinh.
  2. **Đại Vận Tứ Hóa (Decade Hua):** Tính theo Thiên Can của cung Đại Vận hiện tại.
  3. **Lưu Niên Tứ Hóa (Annual Hua):** Tính theo Thiên Can của Năm hiện hành.

## 4. CHỈ THỊ (ACTION RULES)
Khi thiết kế Database Schema cho Sao (Stars):
- Phải thiết kế bảng/collection kiểu `[ { star: "tianji", type: "major", brightness: "Vượng", modifiers: ["HuaLu"] } ]`.
- Tránh việc lưu dưới dạng text thô `[ "Thiên Cơ (V) (Lộc)" ]`, điều này sẽ giết chết khả năng AI phân tích Cách cục sau này.
