---
title: Module Soi Bài 52 Lá - Hệ Chuyên Gia Tâm Linh Digital
status: DRAFT
version: 1.0.0
created: 2026-03-23
---

## 1. Overview

Module "Soi Bài 52 Lá" là hệ chuyên gia (Expert System) mô phỏng năng lượng của các thầy dùng bài Tây (52 lá) để soi đất cát và mồ mả. Hệ thống phân tách 4 hình thức xem (Scanning Modes), sử dụng Weighting Logic (trọng số) để đưa ra kết luận, và hiển thị trực quan lá bài với giao diện premium.

## 2. User Scenarios

- **US1**: As a **người dùng**, I want to **bốc ngẫu nhiên một bộ lá bài Tây**, so that **hệ thống phân tích năng lượng đất cát dựa trên các lá đã bốc**.
- **US2**: As a **người dùng**, I want to **xem lá bài trực quan (hình ảnh lá bài)**, so that **tôi có trải nghiệm chân thực như đang xem bài thật**.
- **US3**: As a **người dùng**, I want to **chọn hình thức xem (Scanning Mode)**, so that **kết quả phân tích tập trung vào mục đích cụ thể (soi đất, soi mộ, soi thực thể, dự báo)**.
- **US4**: As a **người dùng**, I want to **nhận kết quả phân tích chi tiết dạng JSON/UI**, so that **tôi hiểu được tình trạng đất, mồ mả, thực thể tâm linh, và mức Cát/Hung**.
- **US5**: As a **người dùng**, I want to **nhận gợi ý hóa giải**, so that **tôi biết cách xử lý nếu kết quả xấu (bồi đất, tạ lễ, di dời rễ cây, v.v.)**.
- **US6**: As a **người dùng**, I want to **xem combo đặc biệt được phát hiện**, so that **tôi biết ngay các tình huống đặc thù như "Động Mộ", "Đất Kết", "Tranh chấp"**.

## 3. Functional Requirements

### 3.1. Bộ bài 52 lá (Deck Engine)
- **FR01**: Hệ thống biểu diễn đầy đủ 52 lá bài Tây (4 chất × 13 giá trị), KHÔNG có Joker.
- **FR02**: Mỗi lá bài có metadata: `suit` (Bích/Chuồn/Cơ/Rô), `rank` (A,2-10,J,Q,K), `suitWeight`, `depthLayer`, `element` (Kim/Mộc/Thủy/Hỏa/Thổ).
- **FR03**: Hệ thống xáo bài (shuffle) bằng thuật toán PRNG (Pseudo-Random Number Generator) kết hợp Seed để đảm bảo tính nhất quán.
- **FR04**: Người dùng lật **9 lá (Cửu Cung)** hoặc **13 lá (Thập nhị cung + 1 lá Bản mệnh)** tùy chọn (cấu hình qua UI/ENV `CARD_DRAW_COUNT`, default = 9). Số lượng lá nhiều tạo độ sâu cho quẻ.
- **FR21**: **Cơ chế Time-Lock Seed (Tâm Linh Xác Thực)**: Seed xáo bài được sinh ra từ `[Họ Tên] + [Năm Sinh] + [Giới Tính] + [Can Chi Giờ Âm Lịch hiện tại]`. 
  - *Kết quả:* Cùng một người xem, nếu bấm bốc liên tục trong cùng 1 Canh Giờ Âm Lịch (2 tiếng đồng hồ), hệ thống sẽ **luôn trả ra 1 quẻ bài y hệt nhau**. Điều này loại bỏ yếu tố "bấm random liên tục để chọn quẻ tốt" của máy tính, phản ánh đúng "Hữu duyên" trong tâm linh. Đổi sang Canh Giờ khác, năng lượng vũ trụ thay đổi -> quẻ mới.

### 3.2. Bảng giải mã (Decoding Table)
- **FR05**: Trọng số theo Chất (Suit):
  - `Bích` (♠): Âm khí +10, Element = Thổ/Âm. Cảnh báo: Mồ mả, đất nghịch.
  - `Chuồn` (♣): Biến động +5, Element = Mộc. Cảnh báo: Rễ cây, sụt lún, tranh chấp.
  - `Cơ` (♥): Sinh khí +10, Element = Thủy. Cảnh báo: Mạch nước, tình cảm gia đạo.
  - `Rô` (♦): Tài lộc +10, Element = Kim. Cảnh báo: Vật cứng dưới đất, tiền bạc.
- **FR06**: Tầng tác động theo Rank:
  - `2-5`: Bề mặt (0m - 1m).
  - `6-9`: Tầng sâu (1m - 3m).
  - `10, J, Q, K`: Tầng tâm linh (năng lượng vô hình).
  - `Ace`: Nguyên tố gốc (năng lượng cực mạnh).

### 3.3. Bốn Scanning Modes
- **FR07 - Mode 1: Soi Địa Tầng (Physical Soil Scan)**:
  - Tập trung: Rô (Kim) + Cơ (Thủy).
  - Output: Độ khô/ẩm, mạch nước ngầm, kim loại/đá tảng dưới đất.
  - Trọng số ưu tiên: Rô ×2, Cơ ×1.5 trong mode này.
- **FR08 - Mode 2: Soi Mồ Mả & Hài Cốt (Ancestral Grave Scan)**:
  - Tập trung: Bích (Thổ/Âm) + Chuồn (Mộc/Rễ cây).
  - Output: Huyệt mộ yên ổn hay bị động, mộ vô danh, rễ cây đâm quan quách.
  - Trọng số ưu tiên: Bích ×2, Chuồn ×1.5.
- **FR09 - Mode 3: Soi Thực Thể Tâm Linh (Entity Detection)**:
  - Tập trung: Lá hình người (J, Q, K).
  - Output: Danh tính "người quản lý" đất (Thổ địa, Bà cô tổ, Vong tiền chủ), thái độ (Đồng thuận/Quấy phá).
  - Trọng số ưu tiên: J/Q/K ×3.
- **FR10 - Mode 4: Dự báo Cát - Hung (Risk & Opportunity)**:
  - Tập trung: Tỷ lệ Đỏ(Cơ+Rô)/Đen(Bích+Chuồn) và các lá Ace.
  - Output: Đất hợp ở, kinh doanh, hay thờ tự.
  - Trọng số ưu tiên: Ace ×3, Red/Black ratio.

### 3.4. Pattern Matching (Combo)
- **FR11**: Combo "Động Mộ": `7 Bích` + `bất kỳ lá Chuồn` → Cảnh báo mộ phần đang bị xâm hại.
- **FR12**: Combo "Đất Kết" (Long mạch): `Ace Cơ` + `Ace Rô` → Đất cực kỳ tốt, long mạch tụ khí.
- **FR13**: Combo "Tranh chấp": `J Bích` + `7 Chuồn` → Có vong linh tranh chấp đất.
- **FR14**: Hệ thống phải extensible — dễ thêm combo mới qua config/data file.

### 3.5. Output
- **FR15**: API trả về JSON có cấu trúc:
  ```json
  {
    "cards_drawn": [...],
    "scan_summary": { "verdict": "Tốt|Xấu|Trung bình", "confidence": 0-100 },
    "authentication": {
      "seed_hash": "...",
      "time_lock": "Giờ Tý (23:00 - 01:00)",
      "is_cached": true/false // True nếu người dùng bấm liên tục trong cùng 1 giờ
    },
    ...
  }
  ```
- **FR16**: UI hiển thị lá bài trực quan (SVG/CSS cards), animation lật bài.
- **FR17**: UI kết quả 4 section tương ứng 4 modes, có icon và color-code.

### 3.6. Tích hợp hệ thống
- **FR18**: Trang `/soi-bai` riêng (tương tự `/iching`), có tab mới trong navigation.
- **FR19**: API endpoint: `POST /api/soi-bai/draw` — bốc bài và phân tích.
- **FR20**: API endpoint: `GET /api/soi-bai/decode/:suit/:rank` — tra cứu nghĩa 1 lá.

## 4. Non-Functional Requirements

- **NFR01**: Response time API soi bài < 500ms (pure logic, không gọi AI).
- **NFR02**: Lá bài SVG/CSS phải render < 1s trên mobile.
- **NFR03**: Combo detection phải O(n²) hoặc tốt hơn (n = số lá bốc, tối đa 7).
- **NFR04**: Code module phải tách biệt hoàn toàn với module Tử Vi và Thần Số Học.
- **NFR05**: Responsive design — mobile-first, card layout phải đẹp trên 320px+.

## 5. Success Criteria

- [ ] SC01: Bốc bài random 5 lá, mỗi lần bốc cho kết quả khác nhau.
- [ ] SC02: Tất cả 4 Scanning Modes trả về phân tích có ý nghĩa.
- [ ] SC03: Ít nhất 3 combo (Động Mộ, Đất Kết, Tranh chấp) được detect chính xác.
- [ ] SC04: UI hiển thị lá bài trực quan, có animation lật bài.
- [ ] SC05: API trả JSON đúng schema đã định nghĩa.
- [ ] SC06: Trang `/soi-bai` hoạt động và có trong navigation.
- [ ] SC07: Test case cho deck shuffle, combo detection, weight calculation pass.

## 6. Domain Knowledge — Phân tích chuyên sâu

### 6.1. Cơ sở lý thuyết: Tại sao bài Tây lại soi được đất?

Trong truyền thống tâm linh Việt Nam, bộ bài Tây 52 lá được xem như "la bàn năng lượng" vì:

- **4 chất = 4 Nguyên tố**: Rô (Kim), Cơ (Thủy), Chuồn (Mộc), Bích (Thổ) — tương ứng Ngũ Hành (thiếu Hỏa, vì Hỏa = năng lượng của người soi, là chính thầy).
- **13 giá trị = 13 cấp độ năng lượng**: Từ nhẹ (2) đến cực mạnh (Ace).
- **52 lá = 52 tuần/năm**: Biểu tượng chu kỳ thời gian hoàn chỉnh.

### 6.2. Ý nghĩa chi tiết từng lá hình người

| Lá | Bích (♠) | Chuồn (♣) | Cơ (♥) | Rô (♦) |
|-----|----------|-----------|--------|--------|
| **J** (Lính) | Vong lính gác mộ, không cho ai đến gần | Rễ cây trẻ đang bò, nguy cơ tương lai | Mạch nước nhỏ chảy ngang | Người tìm vàng, khoáng sản |
| **Q** (Nữ hoàng) | Bà cô tổ, nữ vong cai quản | Cây mẹ đại thụ, rễ đã bám sâu | Dòng sông ngầm, nguồn nước lớn | Tài sản quý chôn dưới đất |
| **K** (Vua) | Thổ công, Thần đất, ông tổ | Rừng già, hệ rễ cổ thụ chằng chịt | Long mạch chính, huyệt phát | Mỏ khoáng, nền móng cũ |

### 6.3. Ý nghĩa các lá Ace

| Ace | Ý nghĩa |
|-----|----------|
| **Ace Bích** | Huyệt mộ cổ, năng lượng âm cực mạnh, có mộ lớn hoặc từ đường cũ |
| **Ace Chuồn** | Gốc đại thụ ngàn năm, hệ sinh thái ngầm phong phú |
| **Ace Cơ** | Long mạch chính, "rồng phun nước", đất phát con cháu |
| **Ace Rô** | Kho báu dưới đất, nền móng cung điện/đền đài cổ |

### 6.4. Remedy Suggestion Matrix

| Tình huống | Giải pháp |
|------------|-----------|
| Âm khí cao (Bích nhiều) | Tạ lễ cúng đất, đốt vàng mã, mời thầy giải hạn |
| Rễ cây xâm hại (Chuồn nhiều) | Chặt cây, dọn rễ, bồi đất, đắp lại mộ |
| Mạch nước ngầm mạnh (Cơ nhiều) | Gia cố móng, thoát nước, tránh đào sâu |
| Vật cứng dưới đất (Rô nhiều) | Khảo sát địa chất, dùng máy dò kim loại xác nhận |
| Combo Động Mộ | Di dời mộ đúng ngày, cúng tạ thổ thần |
| Combo Động Mộ | Di dời mộ đúng ngày, cúng tạ thổ thần |
| Combo Tranh chấp | Lập đàn giải oan, dâng lễ hòa giải |
| Combo Đất Kết | Giữ nguyên, cúng tạ ơn, KHÔNG đào xới thêm |

### 6.5. Tại sao phải lật nhiều lá và dùng Seed thời gian?
- **Tại sao lật 9 hoặc 13 lá?** Trong tâm linh, 1 hoặc 3 lá chỉ trả lời câu hỏi Có/Không (Bói Dịch). Để "Soi Căn" (quét toàn diện mảnh đất), các thầy thường rải bộ bài ra theo Cửu Cung (9 ô) hoặc Thập Nhị Cung (12 ô viền + 1 ô tâm lõi = 13 lá). Việc lật nhiều lá tạo ra *Tổ hợp (Combo)* và *Trọng số (Weight)* chuẩn hơn, khử nhiễu (noise) của 1 lá đơn độc.
- **Tính xác thực (Authenticity):** Máy tính dùng hàm ngẫu nhiên vô hướng (`Math.random`). Nhưng quẻ tâm linh phụ thuộc vào *Thời điểm* và *Con người*. Bằng cách khóa Seed xáo bài vào **Giờ Âm Lịch (ví dụ Giờ Ngọ 11h-13h)**, năng lượng bị "khóa" trong 2 canh giờ đó. Người xem có bấm 100 lần trong giờ Ngọ vẫn chỉ ra 1 quẻ duy nhất. Điều này ép người xem phải có sự tôn trọng (Tâm thành thì linh), không thể spam để tìm kết quả vừa ý. Năng lượng vũ trụ chỉ chuyển dịch khi bước sang "Giờ Mùi". Đi kèm mã `seed_hash` để họ tự kiểm chứng tính minh bạch.
