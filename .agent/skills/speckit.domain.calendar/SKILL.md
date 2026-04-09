---
name: "speckit.domain.calendar"
description: "Logic Lịch Pháp, Can Chi (Bát Tự) & UTC+7 cho ứng dụng Tử Vi."
---

# speckit.domain.calendar — Calendar & Chronology Logic

Kỹ năng này xác định các quy tắc tính toán lịch Âm/Dương và nguyên lý Can Chi Bát Tự.

## 1. NGUYÊN TẮC CƠ BẢN (MÚI GIỜ UTC+7)
- Hệ thống Tử Vi này được thiết kế dựa trên **Lịch Âm Việt Nam (Hồ Ngọc Đức)**, múi giờ mặc định là `UTC+7`.
- **Cảnh báo Lệch Ngày:** Lịch Âm Việt Nam và Lịch Âm Trung Quốc (UTC+8) có độ trễ do múi giờ, đôi khi dẫn đến Mùng 1 Âm lịch lệch nhau 1 ngày. Khi gọi thư viện chuyển lịch (như `lunar-javascript` hay `iztro`), phải luôn khai báo/pass Múi giờ là `+7` hoặc set `locale: 'vn'`.

## 2. QUY TẮC "THÁNG NHUẬN" (LEAP MONTH)
- Tháng nhuận âm lịch xảy ra định kỳ. 
- **Nguyên tắc bốc quẻ/lập lá số Tử Vi chuẩn (Đa số các phái):** Tự động coi nửa đầu tháng nhuận là tháng hiện tại, nửa sau tháng nhuận được tính là tháng tiếp theo. HOẶC ưu tiên sử dụng config mặc định của thư viện Tử Vi (vd: `iztro` có thuộc tính `leapMonth` parameter). Khi code form nhập liệu đầu vào, **bắt buộc** phải có checkbox `[x] Gồm tháng nhuận`.

## 3. THUẬT TOÁN CAN CHI (CƠ BẢN)

### 3.1. Tính Chi năm (Địa Chi - 12 Con Giáp):
`Branch = (Year - 3) % 12`
_Mapping:_ 0=Hợi(Hai), 1=Tý(Zi), 2=Sửu(Chou), 3=Dần(Yin)... 

### 3.2. Tính Can năm (Thiên Can - 10 Can):
`Stem = (Year - 3) % 10`
_Mapping:_ 0=Quý(Gui), 1=Giáp(Jia), 2=Ất(Yi), 3=Bính(Bing)... 

### 3.3. Quy tắc "Giờ Tý" (Rat Hour & Đổi Ngày/Cross-day):
- Một ngày bắt đầu từ **11:00 PM (23:00) đêm hôm trước**.
- **Giờ Tý đầu (Early Rat):** 00:00 - 00:59 (Tính vào ngày hiện tại).
- **Giờ Tý quá (Late Rat):** 23:00 - 23:59 (Tính vào **Ngày Hôm Sau** - Tomorrow).
- *Chú ý:* Khi code hàm nhận tham số giờ, nếu truyền vào `23:30`, hàm lập lá số PHẢI cộng ngày Sinh Dương Lịch (hoặc m Lịch) thêm 1 ngày.

## 4. CHỈ THỊ (ACTION RULES)
Khi nhận yêu cầu: *"Viết hàm Date utils cho Lá số Tử Vi"*
- **Agent Hành động:** Check ngay yếu tố: 1. Có check giờ Tý gác đêm không? 2. Có truyền tham số `leapMonth` không? 3. Hàm get timezone có lock lại ở UTC+7 hay bị lấy Timezone theo System của Server (Ví dụ AWS Server ở US thì `new Date().getHours()` sẽ sai toét)?
- **Nghiêm cấm:** Dùng hàm `Date.now()` thuần tuý mà không inject timezone offset `+7` của Việt Nam.
