---
title: Nâng cấp Prompt Luận Giải Tử Vi Chuyên Sâu
status: CLARIFIED
version: 1.1.0
created: 2026-02-25
clarified: 2026-02-25
---

## 1. Overview

Nâng cấp toàn diện prompt luận giải Tử Vi Đẩu Số — cả **rawdata prompt** (để user copy sang ChatGPT/Gemini bên ngoài) lẫn **Gemini system prompt** (AI tự động) — tạo ra bản luận giải chuyên nghiệp, chi tiết 12 cung, có trọng số cung nặng/nhẹ, bao gồm đại vận, ứng số 3 năm trước dạng bảng, tiểu hạn theo tháng có trọng số, và format mẫu chuẩn thầy Tử Vi.

## 2. User Scenarios

- **US1**: Là người dùng, tôi muốn copy **rawdata prompt** đã soạn sẵn chuyên nghiệp, paste vào ChatGPT/Gemini/Claude bên ngoài, để nhận bản luận giải chi tiết đầy đủ 12 cung mà không cần tự viết prompt.

- **US2**: Là người dùng, tôi muốn AI **tự động luận giải** (Gemini built-in) theo format chuyên nghiệp gồm: tiêu đề, thông tin đương số, 12 cung phân tích, đại vận, ứng số, tiểu hạn tháng, lời khuyên — giống bản luận của thầy Tử Vi thật.

- **US3**: Là người dùng, tôi muốn các cung có **nhiều sao nặng** (hung tinh, Hóa Kỵ, Song Kỵ, Kỵ trùng phùng) được AI **luận giải kỹ hơn** (nhiều câu hơn, cảnh báo rõ ràng hơn), để tôi biết cung nào cần đặc biệt chú ý.

- **US4**: Là người dùng, tôi muốn bản luận giải có **bảng ứng số 3 năm trước** (N-3, N-2, N-1) — chỉ gồm điểm nhấn vận hạn nổi bật — để AI nhìn lại xem có ứng nghiệm gì → dự đoán xu hướng năm xem.

- **US5**: Là người dùng, tôi muốn bản luận có **chi tiết tiểu hạn từng tháng** (12 tháng) theo trọng số — tháng nặng luận kỹ hơn, tháng bình thường chỉ 1-2 câu — để tôi biết tháng nào cần đặc biệt chú ý.

- **US6**: Là người dùng, sau khi nhận bản luận giải, tôi muốn có thể **chat tiếp** để hỏi sâu hơn về một cung hoặc vấn đề cụ thể, mà AI vẫn giữ ngữ cảnh lá số.

## 3. Functional Requirements

### 3.1 Rawdata Prompt (Copy Button) [CLARIFIED: Chi tiết hơn Gemini, có format mẫu + hướng dẫn]

- **FR01**: Rawdata prompt phải bao gồm:
  - **(a)** Tiêu đề: "Luận giải lá số Tử Vi chi tiết cho Đương Số [tên]"
  - **(b)** Thông tin đương số: Ngày sinh (ÂL + DL), giờ sinh, giới tính, Mệnh Nạp Âm, Hành Mệnh, Cục, Âm Dương thuận/nghịch, Tinh Hệ Mệnh
  - **(c)** Data 12 cung với đầy đủ: chính tinh + trạng thái (miếu/vượng/đắc/hãm) + tứ hóa + phụ tinh + lưu tinh
  - **(d)** Thông tin đại vận hiện tại + Đại Vận Tứ Hóa
  - **(e)** Thông tin tiểu vận + Lưu Tứ Hóa
  - **(f)** Nguyệt hạn 12 tháng (nếu có data)
  - **(g)** Data ứng số 3 năm trước (N-3, N-2, N-1) — chỉ điểm nhấn nổi bật, không phải full 12 cung
  - **(h)** Kỵ trùng phùng, Song Kỵ, Song Lộc (nếu phát hiện)

- **FR02**: Rawdata prompt phải có **hướng dẫn FORMAT OUTPUT** rõ ràng cho AI bên ngoài, bao gồm cấu trúc mẫu bắt buộc (FR12). Vì AI bên ngoài chưa có context, rawdata cần instruction đầy đủ hơn Gemini.

- **FR03**: Rawdata prompt phải có chỉ dẫn **cung nặng = luận kỹ hơn**: "Cung nào có ≥3 yếu tố nặng → viết 8-12 câu. Cung bình thường → 4-6 câu."
  - [CLARIFIED] Yếu tố nặng = hung tinh chính (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp) + Hóa Kỵ + Lưu Hóa Kỵ + Tuần/Triệt.

- **FR04**: Rawdata prompt phải có instruction "Sau phần luận giải chính, thêm 1 dòng: *Bạn có thể hỏi tiếp chi tiết về bất kỳ cung nào.*" để user biết chat tiếp.

### 3.2 Gemini System Prompt (Auto AI) [CLARIFIED: Nhẹ hơn Rawdata, không cần format mẫu riêng]

- **FR05**: Gemini prompt phải có format output tương tự rawdata nhưng KHÔNG cần instruction chi tiết (vì đã có system prompt sẵn). Cấu trúc: Tiêu đề → Thông tin đương số → Tổng quan (có cách cục) → 12 cung → Đại vận → Ứng số → Tiểu hạn tháng → Lời khuyên.

- **FR06**: Gemini prompt phải có rule **trọng số cung**: Cung có ≥3 yếu tố nặng → phân tích dài hơn (8-12 câu), highlight cảnh báo. Cung bình thường → 4-6 câu.

- **FR07**: Gemini prompt phải yêu cầu AI liệt kê **tiểu hạn 12 tháng theo trọng số**:
  - [CLARIFIED] Tháng có vận hạn nặng/lớn (hung tinh, Kỵ, sự kiện đặc biệt) → 3-4 câu chi tiết + cảnh báo
  - Tháng bình thường → 1-2 câu tóm tắt
  - Đánh giá mức độ mỗi tháng: 🟢 Tốt / 🟡 Bình thường / 🔴 Xấu

- **FR08**: Gemini prompt phải yêu cầu **ứng số 3 năm trước** (N-3, N-2, N-1):
  - [CLARIFIED] Chỉ cần bảng tóm tắt điểm nhấn vận hạn nổi bật mỗi năm (1-2 câu/năm), KHÔNG phải phân tích đầy đủ 12 cung. Mục đích: nhìn lại xem ứng số có khớp không → dự đoán xu hướng năm xem.

### 3.3 Data Enhancement

- **FR09**: Compact data phải bổ sung **trọng số cung** (heavy/normal):
  - [CLARIFIED] Đếm số yếu tố nặng: hung tinh chính (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp) + Hóa Kỵ gốc + Lưu Hóa Kỵ + Tuần/Triệt
  - Gắn tag `weight: "heavy"` nếu ≥3 yếu tố nặng.

- **FR10**: Compact data phải bao gồm data **3 năm trước** (N-3, N-2, N-1):
  - [CLARIFIED] Mỗi năm CHỈ cần summary tóm tắt: đại vận cung nào, tiểu vận cung nào, energy score tổng hợp, sự kiện nổi bật (nếu có). KHÔNG cần full 12 cung.

- **FR11**: Compact data phải bao gồm **nguyệt hạn 12 tháng** chi tiết: tháng, cung, energy, sao hung/cát chính.

### 3.4 Tổng Quan — Cách Cục [CLARIFIED: Thêm mới từ gợi ý I2]

- **FR13**: Phần TỔNG QUAN lá số phải yêu cầu AI **nhận diện cách cục nổi bật** của lá số. Ví dụ:
  - "Sát Phá Tham triều viên" — cách cục võ tướng
  - "Cơ Nguyệt Đồng Lương" — cách cục công chức
  - "Tử Phủ Vũ Tướng" — cách cục phú quý
  - "Nhật Nguyệt đồng minh/phản bối" — cách cục sáng/tối
  - "Song Lộc triều viên" — cách cục đại phú

### 3.5 Luận Cung Phu Thê [CLARIFIED: Thêm mới từ gợi ý I4]

- **FR14**: Khi luận cung **Phu Thê**, AI phải đặc biệt chú ý các sao tình duyên: Đào Hoa, Hồng Loan, Thiên Hỷ, Thiên Diêu, Phong Cáo → phân tích ảnh hưởng đến tình cảm, hôn nhân.

### 3.6 Hóa Giải [CLARIFIED: Luôn có, từ gợi ý I3]

- **FR15**: Phần **Lời Khuyên** LUÔN có mục Hóa Giải — dù lá số nhẹ cũng phải có lời khuyên tu tâm, dưỡng đức, tích phúc (đặc trưng Tử Vi). Lá số nặng → hóa giải cụ thể hơn (hướng cúng sao, phương hướng, thời điểm).

### 3.7 Thứ Tự 12 Cung Output [CLARIFIED: Chuẩn Tử Vi, từ gợi ý I1]

- **FR16**: Thứ tự luận 12 cung theo **chuẩn Tử Vi truyền thống**:
  Mệnh → Huynh Đệ → Phu Thê → Tử Tức → Tài Bạch → Tật Ách → Thiên Di → Nô Bộc → Quan Lộc → Điền Trạch → Phúc Đức → Phụ Mẫu

### 3.8 Rawdata Prompt Template (Mẫu format output)

- **FR12**: Format mẫu output mà rawdata prompt yêu cầu AI bên ngoài tạo ra:

```
# 🔮 LUẬN GIẢI LÁ SỐ TỬ VI CHI TIẾT
## Đương Số: [Tên]

### 📋 Thông Tin Đương Số
- Ngày sinh: [ÂL] / [DL]
- Giờ sinh: [giờ] | Giới tính: [Nam/Nữ]
- Mệnh: [Nạp Âm] ([Hành]) | Cục: [Tên cục]
- Âm Dương: [Thuận/Nghịch] | Tinh Hệ: [Tên] ([Archetype])

---

### ⭐ TỔNG QUAN LÁ SỐ
[7-10 câu: tổng quan vận mệnh, đặc trưng nổi bật, thế mạnh/yếu điểm chính]
**Cách cục nổi bật:** [Nhận diện cách cục chính, ví dụ: Sát Phá Tham, Cơ Nguyệt Đồng Lương...]

---

### 🏛️ LUẬN GIẢI 12 CUNG
(Thứ tự: Mệnh → Huynh Đệ → Phu Thê → Tử Tức → Tài Bạch → Tật Ách → Thiên Di → Nô Bộc → Quan Lộc → Điền Trạch → Phúc Đức → Phụ Mẫu)

#### 1. Cung MỆNH
[4-12 câu tùy trọng số. Gồm: đặc trưng, ảnh hưởng thực tế, lời khuyên]
(Cung có ≥3 yếu tố nặng → 8-12 câu. Cung bình thường → 4-6 câu.)

#### 2. Cung HUYNH ĐỆ
...
(tiếp tục cho đến cung PHỤ MẪU)

---

### 🔄 ĐẠI VẬN HIỆN TẠI ([tuổi từ] - [tuổi đến])
[5-8 câu: cung đại vận, sao chính tinh, ĐV Tứ Hóa, Kỵ trùng phùng nếu có, xu hướng 10 năm]

---

### 📊 ỨNG SỐ 3 NĂM TRƯỚC
| Năm | Điểm nhấn vận hạn nổi bật | Ứng nghiệm? |
|-----|--------------------------|-------------|
| [N-3] | [1-2 câu điểm nhấn] | [Nhận xét] |
| [N-2] | [1-2 câu điểm nhấn] | [Nhận xét] |
| [N-1] | [1-2 câu điểm nhấn] | [Nhận xét] |
→ Xu hướng cho năm [N]: [1-2 câu]

---

### 📅 TIỂU HẠN NĂM [Năm xem]
[3-5 câu tổng quan tiểu vận năm]

#### Chi tiết 12 tháng (trọng số):
- **Tháng 1** 🟢/🟡/🔴: [1-2 câu nếu bình thường, 3-4 câu nếu tháng nặng/đặc biệt]
- **Tháng 2** ...: ...
- ...
- **Tháng 12** ...: ...

---

### 💡 LỜI KHUYÊN TỔNG HỢP
- **Sự nghiệp**: [2-3 câu]
- **Tài chính**: [2-3 câu]
- **Sức khỏe**: [2-3 câu]
- **Tình cảm**: [2-3 câu]
- **🙏 Hóa giải & Tu tâm**: [2-4 câu — LUÔN có, dù lá số nhẹ hay nặng]

---
*Bạn có thể hỏi tiếp chi tiết về bất kỳ cung hoặc lĩnh vực nào.*
```

## 4. Non-Functional Requirements

- **NFR01**: [CLARIFIED] Rawdata prompt không vượt quá **12000 ký tự** (ChatGPT/Claude hỗ trợ tốt, cần đủ room cho 3 năm trước + 12 tháng).
- **NFR02**: Gemini prompt không vượt quá 12000 ký tự (để fit context window).
- **NFR03**: Bản luận giải mẫu (FR12) dài khoảng 3000-5000 từ — đủ chuyên sâu nhưng không quá dài.
- **NFR04**: Thời gian build rawdata < 500ms (tính thêm 3 năm trước → cần thêm thời gian tính toán).
- **NFR05**: Backward-compatible: không ảnh hưởng user flow hiện có.

## 5. Success Criteria

- [ ] SC01: Rawdata prompt (copy) bao gồm đầy đủ: tiêu đề, thông tin đương số, 12 cung data, đại vận, tiểu vận, nguyệt hạn, hướng dẫn format output chi tiết + format mẫu (FR12).
- [ ] SC02: Gemini prompt có format output mới (nhẹ hơn rawdata) bao gồm: Tiêu đề → Thông tin → Tổng quan (có cách cục) → 12 cung (trọng số) → Đại vận → Ứng số → Tiểu hạn tháng → Lời khuyên.
- [ ] SC03: Cung có ≥3 yếu tố nặng (hung tinh chính + Hóa Kỵ + Tuần/Triệt) được gắn tag "heavy" → AI luận 8-12 câu thay vì 4-6 câu.
- [ ] SC04: Data 3 năm trước (N-3, N-2, N-1) được tính toán và đưa vào prompt dạng bảng tóm tắt (điểm nhấn nổi bật, không phải full 12 cung).
- [ ] SC05: Nguyệt hạn 12 tháng chi tiết xuất hiện trong prompt, tuân thủ trọng số (tháng nặng → 3-4 câu, bình thường → 1-2 câu).
- [ ] SC06: Output từ AI follow đúng mẫu FR12 khi paste rawdata vào ChatGPT/Gemini bên ngoài.
- [ ] SC07: Cuối bản luận có dòng invite "hỏi tiếp chi tiết" để hỗ trợ chat follow-up.
- [ ] SC08: Phần Tổng Quan có nhận diện cách cục nổi bật.
- [ ] SC09: Cung Phu Thê luận đặc biệt chú ý sao tình duyên (Đào Hoa, Hồng Loan, Thiên Hỷ...).
- [ ] SC10: Phần Lời Khuyên LUÔN có mục Hóa Giải & Tu Tâm.
- [ ] SC11: Thứ tự 12 cung output đúng chuẩn Tử Vi truyền thống (Mệnh → ... → Phụ Mẫu).
