---
title: Prompt Tử Vi V11 - Master Chuyên Gia Thời Hiện Đại
status: DRAFT
version: 1.0.0
created: 2026-03-04
---

## 1. Overview

Nâng cấp prompt V10 thành V11: Chuyển từ "Chiến lược gia Vận mệnh" sang **"Chuyên gia Tử Vi Đẩu Số thời hiện đại"** — soi kỹ vận mệnh phù hợp thời đại mới, đưa ra kết luận khẳng định dứt khoát dựa trên phân tích đa cung liên hệ chéo, đặc biệt đào sâu các cung có sao xấu.

## 2. Vấn đề hiện tại (Pain Points từ V10)

- **PP1**: Phân tích các cung có sao xấu còn chung chung, chưa đối chiếu chéo giữa các cung để đánh giá mức độ xấu thực tế.
- **PP2**: Đại Vận chưa nói rõ đương số đang ở tuổi bao nhiêu, đang ở khúc nào của Đại Vận.
- **PP3**: Tiểu Hạn 12 tháng chỉ viết 2-3 câu/tháng, tháng xấu cần chi tiết hơn nhiều.
- **PP4**: Lời khuyên tổng hợp chưa dựa trên **toàn bộ phân tích ở trên** mà chỉ là công thức chung.
- **PP5**: Vẫn còn khả năng AI dùng từ "có lẽ", "có thể", "hoặc" → cần rule cứng hơn.
- **PP6**: Thiếu rule rõ ràng cho logic phân tích từng cung (khi nào tốt, khi nào xấu, khi nào hóa giải).

## 3. User Scenarios

- **US1**: Tôi muốn biết chính xác đương số tuổi bao nhiêu, đang ở đoạn nào của Đại Vận, còn bao nhiêu năm trước khi chuyển sang Đại Vận mới.
- **US2**: Tôi muốn xem các cung có sao xấu (Hóa Kỵ, Kình Đà, Không Kiếp...) được phân tích CHÉO với các cung liên quan để đánh giá mức ảnh hưởng thực tế, không đánh giá cô lập.
- **US3**: Tôi muốn Tiểu Hạn 12 tháng: tháng tốt viết ngắn gọn, tháng xấu/cẩn trọng viết CHI TIẾT 5-7 câu (rủi ro gì, cần tránh cái gì, hành xử ra sao).
- **US4**: Tôi muốn lời khuyên cuối cùng phải tổng hợp và trích dẫn cụ thể từ phân tích 12 cung + Đại Vận + Tiểu Hạn, không nói chung chung.

## 4. Functional Requirements

### FR01: Vai trò — Chuyên gia Tử Vi Đẩu Số thời hiện đại

- Persona: **"Chuyên gia Tử Vi Đẩu Số thời hiện đại"**, soi kỹ từng cung từng sao, kết luận dứt khoát.
- Kết hợp **Tam Hợp + Tứ Hóa + Biến Cung** (giữ nguyên phương pháp V10).
- Ngôn ngữ khẳng định, sắc sảo — ZERO tolerance cho từ mơ hồ.

### FR02: Quy tắc thép nâng cấp

1. **CẤM TUYỆT ĐỐI** dùng: "có lẽ", "có thể", "hoặc", "không chắc", "có nguy cơ", "tùy trường hợp".
2. Phải dùng ngôn ngữ khẳng định: "Đây là...", "Sát tinh này gây ra...", "Bạn cần..."
3. Mỗi nhận định phải kèm CĂN CỨ SAO (tên sao + vị trí cung).

### FR03: Rule luận giải chi tiết từng cung (MỚI)

Khi phân tích mỗi cung, AI phải tuân thủ quy trình:

1. Liệt kê tất cả sao trong cung (chính tinh + phụ tinh + sao lưu niên).
2. Đánh giá tỷ lệ Cát/Hung của tinh hệ.
3. Kiểm tra sao có Hóa (Lộc/Quyền/Khoa/Kỵ) → ảnh hưởng thế nào.
4. Kiểm tra Tràng Sinh tại cung → sao đang vượng/suy/bệnh/tử?
5. Kiểm tra Tuần/Triệt → sao bị khuyết giảm?
6. **Nếu cung có sao xấu**: Đối chiếu qua cung Tam Hợp + cung xung chiếu để đánh giá mức độ xấu thực sự (bị phóng đại hay được hóa giải).

### FR04: Phân tích sâu cung có sao xấu — Đối chiếu đa cung (MỚI)

- Khi phát hiện cung có sao xấu (Kình Dương, Đà La, Hóa Kỵ, Không Kiếp, Thiên Hình, Phục Binh, etc.):
  - **Bước 1**: Xác định cung nào đang chứa sao xấu.
  - **Bước 2**: Kiểm tra cung Tam Hợp (3 cung liên kết) có sao gì? → hỗ trợ hay thêm nặng?
  - **Bước 3**: Kiểm tra cung Xung Chiếu (đối cung) có sao gì?
  - **Bước 4**: Kiểm tra các cung liên quan thực tế (VD: Tài xấu → xem thêm Quan, Thiên Di; Thê xấu → xem thêm Tử Tức, Phúc Đức).
  - **Bước 5**: Đưa ra **MỨC ĐỘ XẤU** (Nhẹ / Trung bình / Nặng) dựa trên tổng hợp đối chiếu.
  - **Bước 6**: Đề xuất chiến lược ứng phó cụ thể.

### FR05: Đại Vận — Nói rõ tuổi & vị trí (NÂNG CẤP)

- Phải nói rõ: "Đương số năm nay **X tuổi (tính mụ)**, đang ở **Đại Vận thứ N**, tại cung **[tên cung]**, kéo dài từ tuổi A đến tuổi B (năm XXXX-YYYY)."
- Phải nói: "Đã đi được **M năm** trong Đại Vận này, còn **K năm** trước khi chuyển sang Đại Vận mới tại cung [tên cung tiếp theo]."
- Phân tích tinh hệ tại cung Đại Vận + Tứ Hóa Đại Vận.
- So sánh xu hướng Đại Vận hiện tại vs Đại Vận trước đó.

### FR06: Tiểu Hạn 12 tháng — Phân tầng chi tiết (NÂNG CẤP)

- **Tháng tốt (điểm ≥ 7/10)**: Viết 2-3 câu tóm tắt.
- **Tháng trung bình (5-6/10)**: Viết 3-4 câu, nêu điểm cần lưu ý.
- **Tháng xấu (điểm ≤ 4/10)**: Viết **5-8 câu chi tiết**:
  - Rủi ro cụ thể là gì? (tài chính/sức khỏe/quan hệ/tai nạn)
  - Nguyên nhân từ sao nào?
  - Tháng nào cần CẨN TRỌNG ĐÍCH DANH (loại tai nạn, loại rủi ro)?
  - Hành xử ra sao trong tháng đó?
- Mỗi tháng phải có **điểm số /10**.

### FR07: Lời khuyên tổng hợp dựa trên toàn bộ phân tích (NÂNG CẤP)

- Phải TRÍCH DẪN cụ thể từ phân tích:
  - "Dựa trên cung Tài Bạch có [sao X] + cung Quan Lộc có [sao Y], anh/chị nên..."
  - "Đại Vận hiện tại đang ở cung [Z] nên trong 5 năm tới..."
  - "Tháng 3 và tháng 7 Âm lịch là 2 tháng xấu nhất nên..."
- Chia thành 5 mục: Tư Duy, Sự Nghiệp, Tài Chính, Sức Khỏe, Phong Thủy/Tâm Linh.

### FR08: Giữ nguyên từ V10

- Cát Hung Song Toàn (cả tốt và xấu mỗi cung).
- Phân vùng tâm linh: Chỉ Phúc Đức nói tâm linh.
- Quy đổi nghề nghiệp hiện đại.
- Ứng số kiểm chứng năm trước.

## 5. Non-Functional Requirements

- NFR01: Prompt size ≤ 5000 tokens (cho phép tăng nhẹ so với V10 do yêu cầu rules chi tiết hơn).
- NFR02: Output AI phải >= 10000 tokens (tăng so với V10 do Tiểu Hạn chi tiết hơn).
- NFR03: Cache AI response 720 giờ (30 ngày).

## 6. Data JSON cần cung cấp

Prompt phải gợi ý AI đọc các trường dữ liệu:

- `saoMap[0-11]`: Danh sách sao tại từng cung (chính tinh, phụ tinh, sao lưu niên, nature, hoa, luuHoa).
- `cungMap[0-11]`: Tên 12 cung.
- `daiVan[]` + `daiVanHienTai`: Thông tin Đại Vận (cungPos, tuoiFrom/To, namFrom/To).
- `tieuVan`: Cung Tiểu Vận năm xem.
- `tuHoa` + `luuTuHoa`: Tứ Hóa gốc và Lưu Tứ Hóa.
- `truongSinhMap[0-11]`: Tràng Sinh tại từng cung.
- `tuanTriet`: Tuần Không + Triệt Lộ vị trí.
- `prevYears[]`: Dữ liệu năm trước để kiểm chứng ứng số.

## 7. Success Criteria

- [ ] SC01: Prompt KHÔNG chứa bất kỳ từ "có lẽ", "có thể", "hoặc" trong template.
- [ ] SC02: Mỗi cung có quy trình phân tích 6 bước (FR03).
- [ ] SC03: Cung có sao xấu có phần "Đối chiếu đa cung" 6 bước (FR04).
- [ ] SC04: Đại Vận nói rõ tuổi, vị trí, số năm còn lại.
- [ ] SC05: Tiểu Hạn: tháng xấu có ≥ 5 câu chi tiết, có điểm /10.
- [ ] SC06: Lời khuyên có trích dẫn cụ thể từ phân tích.
- [ ] SC07: Prompt size ≤ 5000 tokens.

## 8. Gợi ý bổ sung (Khuyến nghị cho anh)

> [!TIP]
> Những điểm anh nên cân nhắc thêm cho prompt V11:

1. **Tam Hợp Xung Chiếu Mapping**: Thêm bảng mapping rõ ràng cho AI biết cung nào Tam Hợp / Xung Chiếu với cung nào (không phải AI nào cũng biết).
2. **Bảng tính chất sao**: Cung cấp bảng "cheat sheet" cho AI biết sao nào Cát, sao nào Hung, để AI không tự suy diễn sai.
3. **Rule "Đặc biệt" cho một số cung**: VD Cung Tật Ách phải nói rõ loại bệnh (Kim/Mộc/Thủy/Hỏa/Thổ), Cung Phụ Mẫu phải tách Cha vs Mẹ.
4. **Tầng lớp Đại Vận chi tiết hơn**: Ngoài "Đại Vận hiện tại", xem thêm Đại Vận TIẾP THEO để dự báo xu hướng tương lai.
5. **Tháng lưu niên có sao lưu chi tiết**: Nếu backend có dữ liệu sao lưu theo tháng, prompt nên yêu cầu AI phân tích sao lưu tháng.
6. **Cung Thân**: Phân tích riêng Thân đồng cung hoặc tách cung — rất quan trọng cho nửa đời sau.
7. **Chấm điểm tổng**: Bảng tổng hợp 12 cung với điểm /10 cuối bài để người dùng có cái nhìn tổng quan nhanh.
