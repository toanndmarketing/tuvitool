---
title: Nâng cấp Prompt Luận Giải Tử Vi Chuyên Sâu
status: CLARIFIED
version: 1.2.0
created: 2026-02-25
clarified: 2026-02-28
---

## 1. Overview

Nâng cấp toàn diện prompt luận giải Tử Vi Đẩu Số — cả **rawdata prompt** (để user copy sang ChatGPT/Gemini bên ngoài) lẫn **Gemini system prompt** (AI tự động) — tạo ra bản luận giải chuyên nghiệp, chi tiết 12 cung, có trọng số cung nặng/nhẹ, bao gồm đại vận, ứng số 3 năm trước dạng bảng, tiểu hạn theo tháng có trọng số, và format mẫu chuẩn thầy Tử Vi.

**Đặc biệt: Bổ sung cấp độ Deep Analysis (Giải phẫu lá số) với độ chi tiết cao nhất về Nhân dạng, Phần âm, và Lộ trình tu tập.**

## 2. User Scenarios

- **US1**: Là người dùng, tôi muốn copy **rawdata prompt** đã soạn sẵn chuyên nghiệp, paste vào ChatGPT/Gemini/Claude bên ngoài, để nhận bản luận giải chi tiết đầy đủ 12 cung mà không cần tự viết prompt.

- **US2**: Là người dùng, tôi muốn AI **tự động luận giải** (Gemini built-in) theo format chuyên nghiệp gồm: tiêu đề, thông tin đương số, 12 cung phân tích, đại vận, ứng số, tiểu hạn tháng, lời khuyên — giống bản luận của thầy Tử Vi thật.

- **US3**: Là người dùng, tôi muốn các cung có **nhiều sao nặng** (hung tinh, Hóa Kỵ, Song Kỵ, Kỵ trùng phùng) được AI **luận giải kỹ hơn** (nhiều câu hơn, cảnh báo rõ ràng hơn), để tôi biết cung nào cần đặc biệt chú ý.

- **US4**: Là người dùng, tôi muốn bản luận giải có **bảng ứng số 3 năm trước** (N-3, N-2, N-1) — chỉ gồm điểm nhấn vận hạn nổi bật — để AI nhìn lại xem có ứng nghiệm gì → dự đoán xu hướng năm xem.

- **US5**: Là người dùng, tôi muốn bản luận có **chi tiết tiểu hạn từng tháng** (12 tháng) theo trọng số — tháng nặng luận kỹ hơn, tháng bình thường chỉ 1-2 câu — để tôi biết tháng nào cần đặc biệt chú ý.

- **US6**: Là người dùng, sau khi nhận bản luận giải, tôi muốn có thể **chat tiếp** để hỏi sâu hơn về một cung hoặc vấn đề cụ thể, mà AI vẫn giữ ngữ cảnh lá số.

- **US7**: [CLARIFIED] Là người dùng, tôi muốn AI soi rõ **nhân dạng, vết sẹo, nốt ruồi** và **thứ bậc trong gia đình**. AI được phép mô tả linh hoạt dựa trên sự tương hỗ của Tứ Hóa và Miếu Hãm.

- **US8**: [CLARIFIED] Là người dùng, tôi muốn biết chi tiết về **mộ phần tổ tiên**, sự phù hộ của gia tiên đời nào và các vấn đề tâm linh. Yêu cầu chỉ định **Loại hình** địa điểm hóa giải (Chùa, Đền, Miếu...) thay vì địa danh cụ thể.

- **US9**: [CLARIFIED] Là người dùng, tôi muốn AI bóc tách mỗi cung thành 3 tầng: **Thực tại, Tiềm ẩn và Nghiệp lực**. Trong đó Nghiệp lực được xác định bằng cách đối chiếu tương quan với cung Phúc Đức gốc.

- **US10**: [CLARIFIED] Là người dùng, tôi muốn có **Lộ trình Tu Tâm** chi tiết theo thời gian và gợi ý loại hình thiện nguyện phù hợp Ngũ Hành.

## 3. Functional Requirements

### 3.1 Rawdata Prompt (Copy Button)

- **FR01**: Rawdata prompt phải bao gồm:
  - **(a)** Tiêu đề: "Luận giải lá số Tử Vi chi tiết cho Đương Số [tên]"
  - **(b)** Thông tin đương số: Ngày sinh (ÂL + DL), giờ sinh, giới tính, Mệnh Nạp Âm, Hành Mệnh, Cục, Âm Dương thuận/nghịch, Tinh Hệ Mệnh
  - **(c)** Data 12 cung với đầy đủ: chính tinh + trạng thái (miếu/vượng/đắc/hãm) + tứ hóa + phụ tinh + lưu tinh
  - **(d)** Thông tin đại vận hiện tại + Đại Vận Tứ Hóa
  - **(e)** Thông tin tiểu vận + Lưu Tứ Hóa
  - **(f)** Nguyệt hạn 12 tháng (nếu có data)
  - **(g)** Data ứng số 3 năm trước (N-3, N-2, N-1) — chỉ điểm nhấn nổi bật, không phải full 12 cung
  - **(h)** Kỵ trùng phùng, Song Kỵ, Song Lộc (nếu phát hiện)
  - **(i)** [Mới] Hints bổ sung: HanhMenh, ChiDienTrach

- **FR02**: Rawdata prompt phải có **hướng dẫn FORMAT OUTPUT** rõ ràng cho AI bên ngoài, bao gồm cấu trúc mẫu bắt buộc (FR12).

- **FR03**: Rawdata prompt phải có chỉ dẫn **cung nặng = luận kỹ hơn**: "Cung nào có ≥3 yếu tố nặng → viết 8-12 câu. Cung bình thường → 4-6 câu."
  - Yếu tố nặng = hung tinh chính (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp) + Hóa Kỵ + Lưu Hóa Kỵ + Tuần/Triệt.

- **FR04**: Rawdata prompt phải có instruction "Sau phần luận giải chính, thêm 1 dòng: *Bạn có thể hỏi tiếp chi tiết về bất kỳ cung nào.*"

### 3.2 Gemini System Prompt (Auto AI)

- **FR05**: Gemini prompt phải có format output tương tự rawdata. Cấu trúc: Tiêu đề → Thông tin đương số → Tổng quan → 12 cung → Đại vận → Ứng số → Tiểu hạn tháng → Lời khuyên → **Con Cái chi tiết → Phối Ngẫu chi tiết → Mộ Phần & Tâm Linh → Lộ trình Tu Tâm**.

- **FR06**: Gemini prompt phải có rule **trọng số cung**: Cung nặng (weight="HEAVY") → phân tích dài hơn (8-12 câu), highlight cảnh báo. Cung thường → 4-6 câu.

- **FR07**: Gemini prompt phải yêu cầu AI liệt kê **tiểu hạn 12 tháng theo trọng số**:
  - Tháng nặng/biến cố (Lưu Kỵ, sát tinh) → 3-4 câu chi tiết + cảnh báo sự kiện cụ thể (bỏng, ngã, hỏng đồ, thị phi).
  - Tháng bình thường → 1-2 câu tóm tắt.
  - Đánh giá mức độ mỗi tháng: 🟢 Tốt / 🟡 Bình thường / 🔴 Xấu.

- **FR08**: Gemini prompt phải yêu cầu **ứng số 3 năm trước** (N-3, N-2, N-1).

### 3.3 Deep Analysis Requirements [CLARIFIED]

- **FR17**: [CLARIFIED] **Luận giải 3 tầng**: Tại mỗi cung quan trọng (Mệnh, Phu, Tử, Tài, Quan, Phúc), AI phải bóc tách 3 tầng. **Nghiệp lực** được luận dựa trên sự đối chiếu với cung Phúc Đức gốc (thịnh/suy).

- **FR18**: [CLARIFIED] **Nhân dạng & Thứ bậc**: Mô tả linh hoạt dựa trên sự tương hỗ của Tứ Hóa và Miếu Hãm của chính tinh.

- **FR19**: [CLARIFIED] **Phần Âm chi tiết**: Xác định đời phát/động. Chỉ rõ **Loại hình** địa điểm hóa giải (Chùa, Đền, Miếu...) và cách thức thực hiện.

- **FR20**: [CLARIFIED] **Lộ trình Tu Tâm**: Gợi ý loại hình thiện nguyện phù hợp Ngũ Hành và lộ trình theo quý.

### 3.4 Data Enhancement

- **FR09**: Compact data phải bổ sung **trọng số cung** (heavy/normal).

- **FR10**: Compact data phải bao gồm data **3 năm trước** (N-3, N-2, N-1).

- **FR11**: Compact data phải bao gồm **nguyệt hạn 12 tháng** chi tiết.

- **FR21**: [Mới] Compact data bổ sung hints: `hanhMenh` (luận phong thủy), `chiDienTrach` (luận hướng nhà).

### 3.5 Tổng Quan — Cách Cục

- **FR13**: Phần TỔNG QUAN lá số phải yêu cầu AI **nhận diện cách cục nổi bật**.

### 3.6 Luận Cung Phu Thê & Tử Tức

- **FR14**: Phu Thê: đặc biệt chú ý sao tình duyên, nhân dạng, thứ bậc.
- **FR22**: [Mới] Tử Tức: Luận theo 5 bước (Giới tính → Số lượng → Tính cách → Hợp/Khắc → Tài năng).

### 3.7 Hóa Giải

- **FR15**: Lời Khuyên luôn có mục Hóa Giải. Tách riêng section LỘ TRÌNH TU TÂM.

### 3.8 Thứ Tự 12 Cung Output

- **FR16**: Thứ tự chuẩn: Mệnh → Huynh Đệ → Phu Thê → Tử Tức → Tài Bạch → Tật Ách → Thiên Di → Nô Bộc → Quan Lộc → Điền Trạch → Phúc Đức → Phụ Mẫu.

### 3.9 Prompt Template & Văn phong

- **FR23**: [Mới] Văn phong: **Sắc sảo, đanh thép**, đi thẳng vào sự thật trần trụi nhất, không kiêng dè. KHÔNG dùng ngôn ngữ vague (maybe, perhaps).
- **FR12**: Cập nhật format mẫu bao gồm các section mới.

## 4. Non-Functional Requirements

- **NFR01**: Rawdata prompt không vượt quá **12000 ký tự**.
- **NFR02**: Gemini prompt không vượt quá **12000 ký tự**.
- **NFR06**: [Mới] Tăng `maxOutputTokens` lên **12288** để chứa đủ nội dung Deep Analysis.

## 5. Success Criteria

- [x] SC01: Rawdata prompt đầy đủ thông tin nâng cao và hướng dẫn format.
- [x] SC02: Gemini prompt áp dụng văn phong đanh thép và các rules mới.
- [x] SC03: Hệ thống parser nhận diện được các section mới: Con Cái Chi Tiết, Phối Ngẫu Chi Tiết, Mộ Phần & Tâm Linh, Lộ Trình Tu Tâm.
- [x] SC04: Mỗi cung quan trọng bóc tách đủ 3 tầng Thực tại/Tiềm ẩn/Nghiệp lực.
- [x] SC05: Chỉ dẫn hóa giải phần âm và tu tâm cụ thể theo thời gian/địa địa điểm (Loại hình).
- [x] SC06: AI luận giải được nhân dạng linh hoạt theo Tứ Hóa/Miếu Hãm.
- [x] SC07: Hệ thống tính toán và gửi đủ hints (Hành Mệnh, Chi Điền Trạch) cho AI.
- [x] SC08: PROMPT_VERSION được bump lên v6.0.
