---
title: Đại Vận Tứ Hóa & Lục Thập Tinh Hệ
status: CLARIFIED
version: 1.0.0
created: 2026-02-25
truong_phai: Tam Hợp Phái + Trung Châu (Vương Đình Chi)
---

## 1. Overview

Bổ sung 2 tính năng nâng cao cho hệ thống Tử Vi Đẩu Số, nâng cấp độ chính xác luận giải vận hạn và profiling tính cách:

- **Đại Vận Tứ Hóa**: Tính 4 Hóa riêng cho mỗi giai đoạn Đại Vận (10 năm), dựa trên Thiên Can của cung Đại Vận, cho phép luận giải xu hướng 10 năm chi tiết hơn.
- **Lục Thập Tinh Hệ**: 60 tổ hợp chính tinh (14 sao đi theo cặp/nhóm tại 12 cung), module hóa luận giải tính cách và số mệnh sâu hơn theo phương pháp Vương Đình Chi.

## 2. User Scenarios

### US1: Đại Vận Tứ Hóa

- **US1.1**: As a user (người xem lá số), I want to see the Tứ Hóa (4 transformations) specific to my current Đại Vận period, so that I can understand the 10-year trend more precisely beyond just knowing which palace the Đại Vận falls in.

- **US1.2**: As a user, I want to see Đại Vận Hóa Kỵ falling into which palace, so that I know which area of life faces the most pressure during this 10-year period.

- **US1.3**: As a user viewing Gemini AI analysis, I want the AI to incorporate Đại Vận Tứ Hóa data into its interpretation, so that the AI can provide more nuanced 10-year trend analysis.

### US2: Lục Thập Tinh Hệ (60 Star Combinations)

- **US2.1**: As a user, I want to see a character profile based on the specific star combination at my Mệnh palace (e.g., "Tử-Phá tại Mão/Dậu"), so that I understand my personality archetype beyond generic star descriptions.

- **US2.2**: As a user, I want each palace to show the relevant tinh hệ (star system) interpretation rather than listing individual stars, so that I get a more coherent narrative about each aspect of my life.

- **US2.3**: As a user, I want to see how the tinh hệ at each palace interacts with the Đại Vận and Lưu Niên, so that I understand how my base tendencies are affected by current timing.

## 3. Functional Requirements

### FR-A: Đại Vận Tứ Hóa

- **FR-A01**: Tính Đại Vận Tứ Hóa (4 Hóa) cho mỗi giai đoạn Đại Vận, sử dụng hàm `anTuHoa()` hiện có với Thiên Can của cung Đại Vận (Can lấy từ bảng Can Cung theo Can Năm Sinh + vị trí cung Đại Vận).
- **FR-A02**: Hiển thị 4 Đại Vận Hóa trên UI, nằm trong phần Vận Hạn, dưới thông tin Đại Vận hiện tại.
- **FR-A03**: Tích hợp Đại Vận Tứ Hóa vào Event Scanner: nếu Đại Vận Hóa Kỵ rơi vào focus house của event rule → tăng score (bonus weight).
- **FR-A04**: Tích hợp Đại Vận Tứ Hóa vào compact data gửi cho Gemini AI, thêm field `daiVanTuHoa` vào `vanHanInfo`.
- **FR-A05**: Phát hiện "Đại Vận Hóa Kỵ + Lưu Hóa Kỵ cùng cung" (Kỵ trùng phùng) → cảnh báo severity critical.
- **FR-A06**: Tính Can cho mỗi cung Đại Vận theo quy tắc: từ Can năm sinh + vị trí cung → tra bảng Can cung (Thiên Can khởi theo Can năm).

### FR-B: Lục Thập Tinh Hệ

- **FR-B01**: Tạo data structure cho 60 tổ hợp tinh hệ, mỗi entry gồm: `id`, `stars` (array tên sao), `palaces` (array cung có thể xuất hiện), `profile` (mô tả tính cách 3-5 câu), `strengths`, `weaknesses`, `advice`.
- **FR-B02**: Hàm `getTinhHe(cungPos, saoMap)` — xác định tinh hệ nào đang đóng tại 1 cung, dựa trên chính tinh trong cung đó.
- **FR-B03**: Hiển thị tinh hệ interpretation trên UI cho cung Mệnh (ưu tiên) và 11 cung còn lại.
- **FR-B04**: Tích hợp tinh hệ data vào compact data gửi cho Gemini AI, thêm field `tinhHeMenh` vào dữ liệu.
- **FR-B05**: Mỗi tinh hệ phải có luận giải khác nhau tùy cung đóng (VD: Tử-Phá tại Mão khác Tử-Phá tại Dậu về chi tiết, dù cùng archetype).
- **FR-B06**: Tối thiểu 20 tinh hệ phổ biến nhất trong v1.0, mở rộng lên 60 trong v1.1.

## 4. Non-Functional Requirements

- **NFR01**: Response time tính Đại Vận Tứ Hóa < 10ms (chỉ là tra bảng, không tốn resource).
- **NFR02**: File `tu-vi-tinh-he.js` (dữ liệu 60 tinh hệ) < 80KB gzipped.
- **NFR03**: KHÔNG thay đổi logic an sao hiện tại (`tu-vi-sao.js`) — chỉ thêm module mới.
- **NFR04**: KHÔNG thay đổi bảng Tứ Hóa hiện tại — chỉ gọi lại hàm `anTuHoa()` với Can cung Đại Vận.
- **NFR05**: Backward compatible — UI/API cũ vẫn hoạt động bình thường nếu module mới bị disable.
- **NFR06**: Trường phái: Tuân thủ 100% Tam Hợp Phái + Trung Châu Phái. KHÔNG thêm Phi Hóa.

## 5. Success Criteria

- [ ] SC01: Đại Vận Tứ Hóa được tính đúng cho ít nhất 3 test cases (3 Can năm khác nhau).
- [ ] SC02: Đại Vận Hóa Kỵ hiển thị trên UI cùng info Đại Vận.
- [ ] SC03: Event Scanner tăng score khi Đại Vận Hóa Kỵ trùng focus house.
- [ ] SC04: Gemini AI nhận Đại Vận Tứ Hóa data và đề cập trong bài luận.
- [ ] SC05: Ít nhất 20 tinh hệ phổ biến có data đầy đủ (profile + luận giải theo cung).
- [ ] SC06: Cung Mệnh hiển thị tinh hệ interpretation trên UI.
- [ ] SC07: Test case Nguyễn Đức Toàn (1991-Tân Mùi) cho kết quả Đại Vận Tứ Hóa đúng.
- [ ] SC08: Performance: không tăng page load time quá 50ms.

## 6. Constraints (từ Constitution)

- Docker-First: mọi thay đổi phải chạy trong container.
- Port 8950: KHÔNG thay đổi.
- ENV: mọi config (nếu có) phải qua `.env`.
- Trường phái: Tam Hợp + Trung Châu. KHÔNG Phi Hóa.

## 7. Error Cases

- **E01**: Nếu Can cung Đại Vận không xác định được (edge case: vị trí cung không hợp lệ) → fallback về null, UI ẩn section Đại Vận Tứ Hóa.
- **E02**: Nếu cung không có chính tinh (Vô Chính Diệu) → tinh hệ = "VCD" (Vô Chính Diệu), luận giải theo tam hợp + xung chiếu.
- **E03**: Nếu tinh hệ chưa có trong database (chưa đủ 60) → hiển thị "Đang cập nhật" thay vì crash.
