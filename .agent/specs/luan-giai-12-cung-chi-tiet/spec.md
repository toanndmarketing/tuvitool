---
title: Luận Giải 12 Cung Tử Vi Chi Tiết — Phiên bản Giải Phẫu Toàn Diện
status: DRAFT
version: 2.0.0
created: 2026-02-28
feature: prompt-enhancement-12-cung
parent-spec: prompt-luan-giai-chuyen-sau/spec.md (v1.2.0)
---

## 1. Overview

Nâng cấp logic Prompt luận giải Tử Vi từ mức "tóm tắt mỗi cung 4-12 câu" lên mức **Giải phẫu toàn diện** — mỗi cung được phân tích dưới nhiều lớp ý nghĩa thực tiễn: tác động cụ thể tới cuộc đời, mối liên hệ với nhà đẻ (bên cha mẹ ruột) và nhà phối ngẫu (bên gia đình chồng/vợ), cùng các biến thể theo vận hạn.

> **Triết lý:** Trong Tử Vi Đẩu Số, mỗi cung KHÔNG chỉ phản ánh 1 khía cạnh duy nhất. Cung MỆNH không chỉ là "bản thân" mà còn ảnh hưởng đến cách gia đình hai bên nhìn nhận đương số. Cung PHU THÊ không chỉ là "hôn nhân" mà còn phản ánh sự giao thoa giữa hai dòng họ. Feature này yêu cầu AI bóc tách các tầng ý nghĩa đó.

## 2. Nghiên Cứu: Ý Nghĩa Thật Sự Của 12 Cung

### 📐 BẢNG PHÂN RÃ 12 CUNG — TÁC ĐỘNG ĐA CHIỀU

| Cung | Ý nghĩa chính | Tác động thực tế (thường bị bỏ sót) | Liên hệ Nhà Đẻ | Liên hệ Nhà Phối Ngẫu |
|------|---------------|--------------------------------------|-----------------|------------------------|
| **MỆNH** | Bản thân, tính cách, tướng mạo, vận mệnh tổng thể | Cách người khác nhìn nhận mình. Quyết định "aura" khi giao tiếp. Ảnh hưởng đến sự thành bại trong mọi lĩnh vực. | Là "mặt tiền" của dòng họ — mệnh tốt = gia đình nở mày nở mặt. | Là hình ảnh mà nhà chồng/vợ đánh giá trước khi cưới. |
| **HUYNH ĐỆ** | Anh chị em ruột, bạn bè thân, đồng nghiệp ngang hàng | Khả năng hợp tác, quan hệ đối tác kinh doanh, tình bạn giữa các cổ đông. | Anh chị em BÊN NHÀ ĐẺ — ai giúp được, ai ganh ghét. | Anh chị em BÊN VỢ/CHỒNG (em vợ, anh rể...) — hòa thuận hay xung đột. |
| **PHU THÊ** | Hôn nhân, người phối ngẫu, tình duyên | Tuổi kết hôn, đặc điểm ngoại hình vợ/chồng, hạnh phúc hay lục đục. Soi cả tình nhân/người thứ 3. | Cha mẹ đẻ có đồng ý cuộc hôn nhân không? Có sự xung đột "giữ con" từ nhà đẻ? | Nhà chồng/vợ đối xử thế nào? Mẹ chồng/nàng dâu có mâu thuẫn? |
| **TỬ TỨC** | Con cái, hậu duệ, tình dục, sáng tạo | Số lượng con, giới tính, tính cách, tài năng đặc biệt. Cung này còn nói về khả năng sáng tạo và hậu vận. | Cháu nội/ngoại — con mình có hiếu thảo với ông bà BÊN NỘI không? | Con mình có gần gũi ông bà BÊN NGOẠI (nhà vợ/chồng) không? |
| **TÀI BẠCH** | Tiền bạc, thu nhập, khả năng kiếm tiền | Nguồn thu chính (kinh doanh/lương), cách chi tiêu, có giữ được tiền không. | Có được thừa kế từ nhà đẻ? Cha mẹ có cho vốn ban đầu? | Vợ/chồng có mang tiền vào nhà? Có phải nuôi nhà chồng/vợ? |
| **TẬT ÁCH** | Sức khỏe, bệnh tật, tai nạn, tâm bệnh | Bệnh mãn tính, bộ phận dễ tổn thương, tâm lý stress. | Di truyền bệnh từ dòng họ NỘI/NGOẠI? | Vợ/chồng có ảnh hưởng đến sức khỏe mình? (Stress hôn nhân → bệnh) |
| **THIÊN DI** | Di chuyển, đi xa, quan hệ xã hội bên ngoài | Có nên làm ăn xa nhà? Người nơi khác có giúp mình không? Soi về hình ảnh công khai. | Có rời xa nhà đẻ để lập nghiệp? Xa cha mẹ có phát hay suy? | Có phải theo vợ/chồng đi xa? Xa nhà chồng/vợ có thuận lợi hơn? |
| **NÔ BỘC** | Thuộc hạ, nhân viên, bạn bè, quý nhân | Có quý nhân giúp đỡ? Cấp dưới có trung thành? Bạn bè có lợi dụng? | Bạn bè thời thơ ấu (từ quê/nhà đẻ) có giúp ích? | Bạn bè /quan hệ xã hội phát sinh SAU khi cưới — có thuận lợi? |
| **QUAN LỘC** | Sự nghiệp, nghề nghiệp, danh vọng, quyền lực | Nghề phù hợp, thời điểm thăng tiến, có quyền lực không, kinh doanh hay làm thuê. | Cha mẹ đẻ có truyền nghề/truyền ngôi? Có kế thừa sự nghiệp gia đình? | Vợ/chồng có hỗ trợ/cản trở sự nghiệp? Nhà vợ/chồng có cho cơ hội? |
| **ĐIỀN TRẠCH** | Nhà cửa, bất động sản, tài sản cố định | Khả năng mua nhà, có đất thừa kế, nhà ở tốt hay xấu (phong thủy). | Có được thừa kế nhà đất từ cha mẹ? Nhà đẻ có cho ở nhờ? | Ở nhà chồng/vợ hay ra riêng? Mua nhà chung hay riêng? |
| **PHÚC ĐỨC** | Phúc phần tổ tiên, âm đức, tâm linh, "gốc rễ" | Đường mộ phần, sự phù hộ/tréo ngoe từ gia tiên. Cung này là GỐC RỄ quyết định mọi cung khác. | Dòng họ NỘI phúc dày hay mỏng? Mộ phần ông bà nội có ổn? | Dòng họ VỢ/CHỒNG có âm đức không? Khi cưới vào có bị ảnh hưởng phần âm nhà bên kia? |
| **PHỤ MẪU** | Cha mẹ, cấp trên, thầy cô, người bảo trợ | Quan hệ với cha mẹ đẻ, sự hỗ trợ từ cấp trên, có quý nhân bề trên nâng đỡ? | Cha mẹ ĐẺ cụ thể — khỏe mạnh hay ốm yếu? Giàu hay nghèo? Phúc hay khắc? | Cha mẹ VỢ/CHỒNG — tức BỐ MẸ CHỒNG/VỢ — thái độ ra sao? Có hỗ trợ hay gây khó dễ? |

### 🔗 CÁC BỘ TAM HỢP & CHIẾU — GÓC NHÌN "2 GIA ĐÌNH"

| Bộ Tam Hợp | Ý nghĩa tổng thể | Góc nhìn "Nhà Đẻ" | Góc nhìn "Nhà Chồng/Vợ" |
|-------------|-------------------|---------------------|--------------------------|
| **Mệnh → Tài → Quan** | Năng lực + Tiền + Nghề = Thành tựu cá nhân | Nhà đẻ có cho vốn & truyền nghề? | Nhà chồng/vợ có hỗ trợ sự nghiệp? |
| **Huynh Đệ → Thiên Di → Điền Trạch** | Anh em + Bên ngoài + Nhà cửa = Vị thế xã hội | Anh em ruột có giúp mua nhà? | Anh em vợ/chồng có tranh chấp đất? |
| **Phu Thê → Tử Tức → Phúc Đức** | Duyên số + Con cái + Gốc rễ = Hạnh phúc gia đình | Nhà đẻ có ảnh hưởng đến hôn nhân? | Phúc đức 2 bên có giao thoa? |
| **Phụ Mẫu → Tật Ách → Nô Bộc** | Bề trên + Sức khỏe + Quý nhân = Chỗ dựa | Cha mẹ đẻ có lo cho sức khỏe? | Bố mẹ chồng/vợ có là chỗ dựa? |

## 3. User Scenarios

- **US1**: Là người dùng, khi đọc luận giải cung MỆNH, tôi muốn hiểu không chỉ tính cách mà còn **cách nhà đẻ và nhà chồng/vợ nhìn nhận tôi** — để biết mình có được yêu quý hai bên hay không.

- **US2**: Là người dùng, khi đọc cung HUYNH ĐỆ, tôi muốn biết **anh chị em bên nhà đẻ** có giúp đỡ được không, và cả **anh chị em bên nhà vợ/chồng** (em vợ, chị chồng) liệu có hòa thuận hay gây rắc rối.

- **US3**: Là người dùng, khi đọc cung PHU THÊ, tôi muốn hiểu sâu về **quan hệ mẹ chồng - nàng dâu** / **bố vợ - con rể**, cũng như cha mẹ đẻ có chấp nhận cuộc hôn nhân không.

- **US4**: Là người dùng, khi đọc cung TÀI BẠCH, tôi muốn biết tôi có được **thừa kế tài sản từ nhà đẻ** không, và vợ/chồng có **mang tiền vào nhà hay rút tiền ra**.

- **US5**: Là người dùng, khi đọc cung ĐIỀN TRẠCH, tôi muốn biết tôi sẽ **ở nhà cha mẹ, nhà chồng/vợ, hay ra riêng**, và có được thừa kế bất động sản không.

- **US6**: Là người dùng, khi đọc cung PHÚC ĐỨC, tôi muốn biết **phúc đức dòng họ bên Nội** và **bên Ngoại/bên vợ/chồng** — đặc biệt khi cưới vào dòng họ bên kia, phần âm của 2 bên có "xung" nhau không.

- **US7**: Là người dùng, khi đọc cung PHỤ MẪU, tôi muốn AI phân tích riêng: Cha mẹ ĐẺ thế nào, và **Bố mẹ CHỒNG/VỢ** thái độ ra sao — cung này kết hợp cung PHU THÊ sẽ cho thấy rõ.

- **US8**: Là người dùng, tôi muốn mỗi cung được luận dưới dạng **khung phân tích chuẩn** (Ý nghĩa → Tác động cụ thể → Nhà đẻ → Nhà chồng/vợ → Vận hạn) để dễ hiểu, dễ so sánh.

- **US9**: Là người dùng, nếu AI luận một cung mà **không đủ data sao** để suy luận về nhà chồng/vợ (ví dụ: chưa cưới), tôi muốn AI ghi rõ "Khi lập gia đình, cung này sẽ ảnh hưởng..." thay vì bỏ trống.

## 4. Functional Requirements

### 4.1 Khung Phân Tích Mỗi Cung (FR01)

Mỗi cung trong 12 cung phải được luận theo **5 lớp** sau (trình tự bắt buộc):

| Lớp | Tên | Nội dung |
|-----|-----|----------|
| L1 | **Ý nghĩa & Tổng quát** | Luận tổng thể cung theo chính tinh + phụ tinh + tứ hóa. Bóc tách 3 tầng 🔵🟡🔴 (cho 6 cung trọng yếu). |
| L2 | **Tác động thực tế** | Ảnh hưởng CỤ THỂ tới cuộc sống: tiền bạc/sức khỏe/nghề nghiệp/tình cảm — tùy đặc trưng cung. |
| L3 | **Nhà Đẻ (Bên Nội/Ngoại)** | Soi ảnh hưởng từ/tới gia đình cha mẹ ruột, anh chị em ruột, dòng họ gốc. |
| L4 | **Nhà Phối Ngẫu** | Soi ảnh hưởng từ/tới gia đình vợ/chồng (bố mẹ chồng/vợ, anh em bên kia). |
| L5 | **Biến thiên theo Vận Hạn** | Đại vận hiện tại + Tiểu vận đang ảnh hưởng cung này ra sao? |

### 4.2 Logic Soi "Nhà Đẻ vs Nhà Phối Ngẫu" (FR02)

Để AI luận được "2 gia đình", cần áp dụng **quy tắc chuyển cung** sau (logic Tử Vi cổ điển):

| Cung gốc | Soi Nhà Đẻ bằng cách | Soi Nhà Phối Ngẫu bằng cách |
|-----------|----------------------|------------------------------|
| MỆNH | Kết hợp PHỤ MẪU + HUYNH ĐỆ + PHÚC ĐỨC | Kết hợp PHU THÊ (phối ngẫu là "cửa ngõ" nhà bên kia) |
| HUYNH ĐỆ | Trực tiếp = anh em ruột | PHU THÊ chuyển = anh em bên vợ/chồng (Huynh Đệ tính từ cung Phu Thê) |
| PHU THÊ | PHỤ MẪU (cha mẹ đẻ chấp nhận hôn nhân?) | Soi trực tiếp + PHÚC ĐỨC (dòng họ bên kia) |
| TỬ TỨC | Con vs nhà nội = PHÚC ĐỨC + TỬ TỨC | Con vs nhà ngoại = Phúc Đức tính từ Phu Thê |
| TÀI BẠCH | Thừa kế = ĐIỀN TRẠCH + PHỤ MẪU | Vợ/chồng mang tiền = PHU THÊ + Hóa Lộc xuyên cung |
| TẬT ÁCH | Di truyền bệnh = PHỤ MẪU + PHÚC ĐỨC | Stress hôn nhân = PHU THÊ + TẬT ÁCH tương hỗ |
| THIÊN DI | Xa nhà = mối quan hệ xa PHỤ MẪU | Theo vợ/chồng đi xa = PHU THÊ + THIÊN DI |
| NÔ BỘC | Bạn bè cũ = thời trẻ con, gốc gác | Bạn bè mới = sau khi cưới, qua vợ/chồng giới thiệu |
| QUAN LỘC | Cha mẹ truyền nghề = PHỤ MẪU + QUAN LỘC | Nhà vợ/chồng cho cơ hội = PHU THÊ + TÀI BẠCH |
| ĐIỀN TRẠCH | Thừa kế đất nhà đẻ = ĐIỀN TRẠCH gốc | Ở nhà chồng/vợ = PHU THÊ + ĐIỀN TRẠCH chuyển cung |
| PHÚC ĐỨC | Dòng họ NỘI = Thái Dương + cung gốc | Dòng họ VỢ/CHỒNG = Thái Âm + Phúc Đức tính từ Phu Thê |
| PHỤ MẪU | Cha mẹ ĐẺ = cung gốc | Bố mẹ CHỒNG/VỢ = Phụ Mẫu tính từ cung Phu Thê |

### 4.3 Số câu tối thiểu mỗi cung (FR03)

| Loại cung | Min câu | Max câu | Ghi chú |
|-----------|---------|---------|---------|
| Cung HEAVY (nặng sao) | 12 | 20 | Bắt buộc đủ 5 lớp L1-L5 |
| Cung trọng yếu (MỆNH, PHU, TỬ, TÀI, QUAN, PHÚC) | 10 | 18 | Bắt buộc 3 tầng 🔵🟡🔴 + đủ L3-L4 |
| Cung thường | 6 | 12 | L3-L4 có thể gộp 1-2 câu |

### 4.4 Output Format Mới Mỗi Cung (FR04)

```
[TÊN CUNG] — "Tiêu đề ngắn tóm tắt tình hình cung"

🔵 Thực tại: ... (nếu cung trọng yếu)
🟡 Tiềm ẩn: ...
🔴 Nghiệp lực: ...

📌 Tác động thực tế: [2-4 câu cụ thể về tiền/sự nghiệp/sức khỏe/tình cảm tùy đặc trưng cung]

👨‍👩‍👧 Bên nhà đẻ: [1-3 câu — ảnh hưởng từ/tới gia đình ruột]

💍 Bên nhà vợ/chồng: [1-3 câu — ảnh hưởng từ/tới gia đình phối ngẫu]

⏳ Vận hạn: [1-2 câu — đại vận/tiểu vận đang ảnh hưởng cung này]
```

### 4.5 Quy Tắc Khi Chưa Lập Gia Đình (FR05)

- Nếu đương số còn trẻ hoặc chưa cưới → Lớp L4 (Nhà Phối Ngẫu) viết dưới dạng **dự báo**: "Khi lập gia đình..."
- Nếu đương số đã ly hôn → Ghi chú "Duyên trước đã tan, xét tái hôn..."

### 4.6 Token Budget tăng (FR06)

- Tăng `maxOutputTokens` từ **12288** lên **16384** để đủ không gian cho 12 cung chi tiết 5 lớp.

### 4.7 Cập nhật Rawdata Prompt (FR07)

- Cập nhật template prompt ở `public/app.js` (phần Copy) để bao gồm khung phân tích 5 lớp và format output mới.

### 4.8 Cập nhật Gemini System Prompt (FR08)

- Cập nhật `server/gemini.js` > `buildPrompt()` để bao gồm:
  - Rule mới về 5 lớp phân tích.
  - Logic chuyển cung (FR02).
  - Format output mới cho mỗi cung (FR04).
  - Quy tắc khi chưa lập gia đình (FR05).

### 4.9 PROMPT_VERSION Bump (FR09)

- Bump `PROMPT_VERSION` từ `v6.0` lên `v7.0` để invalidate cache.

## 5. Non-Functional Requirements

- **NFR01**: Rawdata prompt không vượt quá **15000 ký tự** (tăng từ 12000 do output dài hơn).
- **NFR02**: Gemini prompt không vượt quá **15000 ký tự**.
- **NFR03**: `maxOutputTokens` = **16384**.
- **NFR04**: Thời gian AI response chấp nhận ≤ 45 giây (tăng từ 30s vì output dài hơn).

## 6. Success Criteria

- [ ] SC01: Mỗi cung trong 12 cung phải có đủ 5 lớp phân tích (L1-L5).
- [ ] SC02: Tối thiểu 6 cung (MỆNH, PHU, TỬ, TÀI, QUAN, PHÚC) phải có nội dung về "Nhà đẻ" và "Nhà vợ/chồng".
- [ ] SC03: Cung HUYNH ĐỆ phải phân biệt rõ anh em BÊN NHÀ ĐẺ vs anh em BÊN VỢ/CHỒNG.
- [ ] SC04: Cung PHỤ MẪU phải luận riêng cha mẹ ĐẺ vs bố mẹ CHỒNG/VỢ.
- [ ] SC05: Cung PHÚC ĐỨC phải soi được phúc đức dòng họ BÊN NỘI vs BÊN VỢ/CHỒNG.
- [ ] SC06: Cung TÀI BẠCH phải đề cập thừa kế nhà đẻ vs tài chính mang vào từ vợ/chồng.
- [ ] SC07: Cung ĐIỀN TRẠCH phải nêu rõ: ở nhà ai? Thừa kế đất bên nào?
- [ ] SC08: Format output có icon phân tách rõ ràng (📌 👨‍👩‍👧 💍 ⏳).
- [ ] SC09: `PROMPT_VERSION` được bump lên v7.0.
- [ ] SC10: `maxOutputTokens` = 16384.
- [ ] SC11: Parser (`parseAiResponse`) nhận diện đúng format cung mới.
