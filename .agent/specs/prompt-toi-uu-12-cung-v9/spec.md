---
title: Tối Ưu Prompt 12 Cung — Thực Tế, Đầy Đủ, Không Mơ Hồ (v9)
status: DRAFT
version: 1.0.0
created: 2026-02-28
feature: prompt-toi-uu-12-cung-v9
parent-spec: luan-giai-12-cung-chi-tiet/spec.md (v2.0.0)
---

## 1. Overview

Nâng cấp prompt từ v8 lên **v9** với mục tiêu: mỗi cung được diễn giải **độc lập, đầy đủ, không mơ hồ** — dựa trực tiếp trên các sao chiếu vào cung đó (chính tinh + phụ tinh + tứ hóa + lưu tinh). Riêng 4 vấn đề trọng yếu: **Hôn nhân, Con cái, Bố mẹ (Phụ mẫu), Phần âm Phúc đức** — diễn giải không giới hạn độ dài, bóc tách từng khía cạnh dựa trên toàn bộ sao chiếu liên quan.

> **Triết lý v9:** AI không được phép nói chung chung kiểu "có thể có xáo trộn trong hôn nhân" — phải nói thẳng: **Vì sao A + sao B gặp nhau trong cung Phu Thê, dẫn đến cụ thể là: vợ/chồng có tính cách X, quan hệ sẽ xảy ra vấn đề Y vào thời điểm Z.**

## 2. User Scenarios

- **US1**: Là người dùng, khi đọc tới cung PHU THÊ, tôi muốn biết: vợ/chồng tôi là người thế nào (tính cách, ngoại hình), ai nắm quyền trong hôn nhân, có nguy cơ ly hôn không, mẹ chồng/nàng dâu có sóng ngầm không — được giải thích bằng TÊN SAO CỤ THỂ gây ra điều đó.

- **US2**: Là người dùng, khi đọc cung TỬ TỨC, tôi muốn biết: có bao nhiêu con, con trai hay con gái, đứa nào khắc/hợp với mình, tài năng thực tế của từng đứa — không phải câu trả lời chung chung.

- **US3**: Là người dùng, khi đọc cung PHỤ MẪU, tôi muốn biết rõ: bố/mẹ ĐẺ sức khỏe thế nào, ai mất trước, ai hỗ trợ mình, cung này KHAI THÁC đúng góc nhìn "con cái nhìn ngược lên cha mẹ" chứ không phải chỉ là "bề trên/cấp trên" mơ hồ.

- **US4**: Là người dùng, khi đọc cung PHÚC ĐỨC, tôi muốn biết: dòng họ nội có phúc hay mỏng, mồ mả tổ tiên có vấn đề gì, có vong theo hay không, cần làm gì để hóa giải — giải thích rõ TỪNG SAO nào chỉ điều đó.

- **US5**: Là người dùng, tôi muốn mỗi cung bắt đầu bằng câu KHẲNG ĐỊNH (không mơ hồ) + sau đó mới bóc chi tiết từng layer — không bắt đầu bằng "Cung này có thể..." hay "Tùy theo...".

- **US6**: Là người dùng, tôi muốn các thông tin về NGUYÊN NHÂN sao nào → tác động gì phải xuất hiện trong từng mục (không chỉ nói kết quả mà không có căn cứ).

- **US7**: Là người dùng, tôi muốn 4 cung ưu tiên (PHU THÊ, TỬ TỨC, PHỤ MẪU, PHÚC ĐỨC) được dành nhiều không gian hơn hẳn, không có giới hạn câu, bóc hết mọi góc cạnh.

- **US8**: Là người dùng, tôi muốn từng cung được gắn "tiêu đề tóm tắt tình trạng thực tế" kiểu headline báo — ví dụ: **[PHU THÊ — "Vợ mạnh chồng yếu, tranh quyền ngầm"** hay **[TỬ TỨC — "Khó con đầu, con thứ phất"]**.

## 3. Functional Requirements

### FR01 — Cấu trúc mỗi cung (BẮT BUỘC)

Mỗi cung phải có đủ cấu trúc sau, theo thứ tự:

```
[TÊN CUNG] — "[Headline tóm tắt tình hình]"
Sao chính: [liệt kê sao chính tinh + trạng thái + các tứ hóa + hung cát nổi bật]

🔵 THỰC TẠI: [Khẳng định thẳng — đang thế nào? Căn cứ sao nào?]
🟡 TIỀM ẨN: [Điều gì sắp đến? Vận hạn nào kích hoạt?]
🔴 NGHIỆP LỰC: [Nợ đời/pattern lặp đi lặp lại — liên quan cung Phúc Đức thế nào?]

📌 TÁC ĐỘNG THỰC TẾ: [2-4 câu cụ thể về lĩnh vực chính của cung — tiền/tình/nghề/sức khỏe]

👨‍👩‍👧 BÊN NHÀ ĐẺ: [Ảnh hưởng từ/tới gia đình ruột. Cụ thể: ai, làm gì, tích cực hay tiêu cực?]

💍 BÊN NHÀ VỢ/CHỒNG: [Ảnh hưởng từ/tới nhà phối ngẫu. Nếu chưa cưới → dạng dự báo.]

⏳ VẬN HẠN: [Đại vận hiện tại + tiểu vận ảnh hưởng cung này ra sao?]
```

---

### FR02 — 4 Cung Ưu Tiên: Diễn Giải Không Giới Hạn

**Áp dụng cho: PHU THÊ, TỬ TỨC, PHỤ MẪU, PHÚC ĐỨC**

#### FR02a — CUNG PHU THÊ (Hôn nhân)

AI BẮT BUỘC phân tích đủ 8 góc cạnh sau, không được bỏ sót:

1. **Tuổi kết hôn dự kiến**: Sao nào → tuổi hôn nhân sớm/muộn?
2. **Ngoại hình vợ/chồng**: Chính tinh cung Phu Thê → mô tả thể chất, vóc dáng, nét mặt.
3. **Tính cách vợ/chồng**: Sao nào → tính nổi bật (mạnh mẽ, hiền lành, tham tiền, hay ghen...)?
4. **Phân tích quyền lực hôn nhân**: Ai nắm quyền? Sao nào → vợ mạnh hay chồng mạnh?
5. **Nguy cơ ly hôn/ngoại tình**: Đa Đào Hồng Loan/Tham Lang/Liêm Trinh trong cung → có nguy cơ không? Mức độ?
6. **Quan hệ mẹ chồng – nàng dâu / bố vợ – con rể**: Cung Phụ Mẫu tính từ cung Phu Thê → soi thái độ nhà chồng/vợ.
7. **Cha mẹ đẻ có ủng hộ cuộc hôn nhân không**: Cung Phụ Mẫu gốc + Hóa Kỵ/Lộc.
8. **Hạn nguy hiểm nhất cho hôn nhân**: Năm/đại vận nào dễ xảy ra xung đột/ly hôn?

---

#### FR02b — CUNG TỬ TỨC (Con cái)

AI BẮT BUỘC phân tích đủ 6 góc cạnh:

1. **Số lượng con thực tế**: Sao dày/thưa → mấy con? Có bị sảy/mất không?
2. **Giới tính dự đoán**: Dương tinh nhiều → con trai; Âm tinh nhiều → con gái.
3. **Con đầu hợp hay khắc**: Sao trong cung nhìn ra cha/mẹ → khắc hay không?
4. **Tính cách từng đứa con**: Mô tả dựa trên sao chủ cung.
5. **Tài năng nổi bật**: Văn hay Võ? Nghiệp khoa bảng hay kinh doanh?
6. **Hậu vận con cái với cha mẹ**: Lúc già con có nuôi dưỡng không? Hay bỏ mặc?

---

#### FR02c — CUNG PHỤ MẪU (Bố mẹ)

AI BẮT BUỘC phân tích đủ 7 góc cạnh, **PHÂN BIỆT RÕ BỐ và MẸ**:

1. **Bố và mẹ ai mạnh hơn trong gia đình**: Thái Dương ứng Bố, Thái Âm ứng Mẹ → ai vượng, ai hãm?
2. **Sức khỏe bố mẹ**: Sao nào → ai dễ ốm liên quan đến bộ phận gì?
3. **Ai mất trước**: Hóa Kỵ + sát tinh trên Thái Dương hay Thái Âm → dự đoán.
4. **Bố mẹ có hỗ trợ tài chính không**: Hóa Lộc trong cung Phụ Mẫu → có hay không?
5. **Ảnh hưởng bố mẹ đến tính cách**: Cung Phụ Mẫu chiếu Mệnh → điều gì hình thành tính cách?
6. **Bố mẹ CHỒNG/VỢ** (tức là Phụ Mẫu tính từ Phu Thê): Thái độ nhà chồng/vợ với mình là gì?
7. **Hạn nguy hiểm cho bố mẹ**: Năm nào đặc biệt cần chú ý sức khỏe bố/mẹ?

---

#### FR02d — CUNG PHÚC ĐỨC (Phần âm / Phúc đức)

AI BẮT BUỘC phân tích đủ 8 góc cạnh:

1. **Phúc dày hay mỏng**: Chính tinh + sao hỗ trợ → mức độ phúc phần tổ tiên để lại.
2. **Dòng họ NỘI hay NGOẠI phúc hơn**: Thái Dương → bên Nội; Thái Âm → bên Ngoại.
3. **Mộ phần tổ tiên có vấn đề không**: Hóa Kỵ/sát tinh → xáo trộn mộ phần đời nào?
4. **Có vong theo hay không**: Địa Không, Địa Kiếp, Thiên Không kết hợp → mô tả tình trạng.
5. **Ảnh hưởng phần âm BÊN NHÀ VỢ/CHỒNG**: Phúc Đức tính từ Phu Thê → dòng họ bên kia có "xung" với bên này không?
6. **Cần hóa giải gì**: Loại hình địa điểm (Chùa/ Đền/ Miếu) + hành động cụ thể (thắp hương / quy y / làm phúc).
7. **Thiện nguyện phù hợp Ngũ Hành**: Hành Mệnh → nên làm thiện nguyện dạng gì?
8. **Đời nào ảnh hưởng lớn nhất**: Sao động cung Phúc Đức trong đại vận/tiểu vận nào → cần đặc biệt chú ý?

---

### FR03 — Nguyên tắc Ngôn ngữ & Văn phong

- **CẤM hoàn toàn**: "có thể", "có lẽ", "đôi khi", "tùy trường hợp", "không chắc chắn".
- **BẮT BUỘC**: Mỗi nhận định phải gắn với SAO CỤ THỂ gây ra. Ví dụ: "Vì Hóa Kỵ đóng cung Phu Thê → hôn nhân có xung đột tài chính" chứ không phải "Hôn nhân có thể gặp trắc trở".
- **Câu đầu tiên của mỗi cung**: Phải là KHẲNG ĐỊNH trực tiếp, không mở đầu bằng câu lý thuyết chung.
- **Giải thích từ chuyên môn**: Nếu dùng tên sao → phải có ngoặc đơn giải thích tác động thực tế ngay sau đó.

### FR04 — Không Giới Hạn Độ Dài 4 Cung Ưu Tiên

- 4 cung: PHU THÊ, TỬ TỨC, PHỤ MẪU, PHÚC ĐỨC → KHÔNG CÓ giới hạn câu. Bóc hết mọi sao chiếu liên quan.
- 8 cung còn lại: tối thiểu 5 câu cho mỗi layer, ưu tiên tác động thực tế.

### FR05 — Headline Bắt Buộc

Mỗi cung phải có headline ngắn tóm tắt tình trạng thực tế trong dấu ngoặc kép ngay sau tên cung.
Ví dụ:

- `[PHU THÊ — "Vợ mạnh chồng yếu, tranh quyền ngầm cả đời"]`
- `[TỬ TỨC — "Khó con đầu, con thứ hai mới phát"]`
- `[PHỤ MẪU — "Mẹ cột sống gia đình, bố sức khỏe yếu"]`
- `[PHÚC ĐỨC — "Phúc dày bên Nội, mộ phần bên Ngoại cần chăm sóc"]`

### FR06 — Phụ Cung Hỗ Trợ (Chuyển Cung Logic)

Prompt phải chỉ dẫn AI dùng kỹ thuật chuyển cung để soi:

- Bố mẹ chồng/vợ = **Phụ Mẫu tính từ Phu Thê**
- Anh em vợ/chồng = **Huynh Đệ tính từ Phu Thê**
- Phúc đức nhà chồng/vợ = **Phúc Đức tính từ Phu Thê**
- Con cái với nhà nội/ngoại = **Tử Tức kết hợp Phúc Đức**

### FR07 — PROMPT_VERSION Bump

- Bump từ v8 → **v9** trong file `tuvi_master.v9.prompt` + cập nhật `app.js` để load file mới.

## 4. Non-Functional Requirements

- **NFR01**: Prompt file không vượt quá **20000 ký tự** (tăng do 4 cung ưu tiên chi tiết hơn).
- **NFR02**: `maxOutputTokens` giữ nguyên **16384** hoặc tăng lên **24576** nếu cần thiết.
- **NFR03**: Thời gian phản hồi AI chấp nhận ≤ 60 giây.
- **NFR04**: Không hard-code tên người, ngày sinh, hay bất kỳ thông tin cá nhân nào trong prompt template.

## 5. Success Criteria

- [x] SC01: Mỗi cung có đủ cấu trúc 7 phần (FR01) — headline + 3 tầng + 3 lớp nhà đẻ/nhà vợ/vận hạn.
- [x] SC02: Cung PHU THÊ phân tích đủ 8 góc cạnh (FR02a).
- [x] SC03: Cung TỬ TỨC phân tích đủ 6 góc cạnh (FR02b).
- [x] SC04: Cung PHỤ MẪU phân tích đủ 7 góc cạnh, phân biệt rõ bố/mẹ đẻ vs bố/mẹ vợ/chồng (FR02c).
- [x] SC05: Cung PHÚC ĐỨC phân tích đủ 8 góc cạnh về phần âm (FR02d).
- [x] SC06: Không có câu nào dùng từ mơ hồ "có thể, có lẽ, đôi khi" (FR03).
- [x] SC07: Mỗi nhận định gắn tên sao cụ thể (FR03).
- [x] SC08: File prompt mới `tuvi_master.v9.prompt` được tạo.
- [x] SC09: `app.js` load đúng file v9.
- [x] SC10: PROMPT_VERSION = v9.
