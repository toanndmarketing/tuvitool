---
title: Prompt Tử Vi V10 - Phương Pháp Hiện Đại
status: DRAFT
version: 1.0.0
created: 2026-03-04
---

## 1. Overview

Thiết kế lại toàn bộ hệ thống prompt luận giải Tử Vi Đẩu Số, chuyển từ phong cách "thầy bói truyền thống" (bi kịch hóa, nặng tâm linh) sang phong cách **"Chuyên gia phân tích cuộc đời"** (khách quan, đa chiều, ứng dụng thực tế trong xã hội Việt Nam hiện đại 2025-2026).

## 2. Vấn đề hiện tại (Pain Points)

- **PP1**: AI bi kịch hóa các sao hung (Địa Kiếp, Hóa Kỵ, Phá Quân) → phán "phá sản, ly hôn" trong khi thực tế người dùng ổn định.
- **PP2**: Nặng khái niệm tâm linh ("nghiệp quả", "vong theo", "phần âm") ở TOÀN BỘ 12 cung → gây sợ hãi không cần thiết.
- **PP3**: Không phân biệt bối cảnh xã hội hiện đại vs truyền thống. VD: Phá Quân ở cung Tài = "phá sản" (xưa) vs "tái đầu tư, đổi mới mô hình kinh doanh" (nay).
- **PP4**: Thiếu cân bằng Cát/Hung — chỉ nhìn thấy Hung mà bỏ qua các sao hóa giải.
- **PP5**: Cấu trúc template quá cứng (🔵🟡🔴 NGHIỆP LỰC mọi cung) → lặp lại và máy móc.

## 3. User Scenarios

- **US1**: As a Vietnamese user born in 1982, I want an astrology reading that reflects modern Vietnam (business, family dynamics, career) so that I can get practical advice instead of generic doom predictions.
- **US2**: As a business owner, I want the system to interpret Phá Quân + Tham Lang as entrepreneurial traits instead of "destruction" so that the reading matches my real-life success.
- **US3**: As a young professional (25-40), I want concise, actionable advice with modern language so that I can apply it to career decisions, relationships and financial planning.
- **US4**: As someone who values spirituality, I want detailed Phúc Đức analysis but not karma/ghost talk in every palace so that the reading feels balanced.

## 4. Functional Requirements

### FR01: Phương pháp luận giải — "Tân Tam Hợp Tổng Hợp"

- Nền tảng: **Tam Hợp Phái** (phổ biến nhất VN, dễ hiểu với người dùng đại chúng)
- Bổ sung: **Tứ Hóa** (Hóa Lộc/Quyền/Khoa/Kỵ) cho phần vận hạn chi tiết
- Kỹ thuật: **Biến Cung** (Khâm Thiên Môn) cho phần "hai gia đình"
- Mới: **Bảng quy đổi cách cục hiện đại** — map cách cục cổ sang vai trò xã hội 2025

### FR02: Nguyên tắc "Cát Hung Song Toàn"

- Mỗi cung phải có CẢ mặt tốt VÀ mặt xấu, không thiên lệch
- Sao hung đi cùng phúc tinh → phải kết luận hóa giải
- Tỷ lệ Cát/Hung trong bài viết: Tối thiểu 40% Cát, tối đa 60% Hung

### FR03: Phân vùng tâm linh

- Chỉ có cung PHÚC ĐỨC được phân tích sâu về nghiệp quả, phần âm, mộ phần
- 11 cung còn lại: 100% tập trung thực tế đời sống

### FR04: Bảng Quy Đổi Cách Cục Hiện Đại

| Cách cục cổ | Diễn giải cổ | Diễn giải hiện đại 2025 |
|---|---|---|
| Sát Phá Tham | Võ tướng, chiến tranh | Doanh nhân, startup founder, nhà đầu tư |
| Cơ Nguyệt Đồng Lương | Quan văn, mưu sĩ | Chuyên gia, consultant, công chức cao cấp |
| Tử Phủ Vũ Tướng | Hoàng đế, đại thần | CEO, quản lý cấp cao, nhà tài chính |
| Liêm Trinh + Thất Sát | Tù tội, chiến trận | Luật sư, bác sĩ, quân nhân, cảnh sát |
| Phá Quân thủ Tài | Phá sản | Tái đầu tư, mở rộng, sửa sang liên tục |
| Tham Lang thủ Mệnh | Đào hoa, tửu sắc | Kinh doanh dịch vụ, F&B, nghệ thuật, marketing |
| Địa Kiếp/Địa Không | Phá hoại, mất trắng | Tư duy đột phá, sáng tạo, dám rủi ro |

### FR05: Cấu trúc output (Giữ nguyên bố cục v9)

1. ⭐ Tổng Quan Lá Số & Biến Cố Năm
2. 🏛️ Luận Giải Chi Tiết 12 Cung (không giới hạn độ dài)
3. ⏳ Vận Hạn Đại Vận & 12 Tháng
4. 💡 Lời Khuyên & Chiến Lược Cải Vận

### FR06: Tone giọng

- Phong cách: "Anh/Chị tư vấn viên cuộc sống" — gần gũi, sắc sảo, có chiều sâu
- Không phán xét, không dọa dẫm, không mơ hồ
- Mỗi nhận định phải có CĂN CỨ SAO + GIẢI THÍCH thực tế

## 5. Non-Functional Requirements

- NFR01: Token output AI phải đủ dài (>= 8000 tokens) để phân tích 12 cung chi tiết
- NFR02: Prompt size phải <= 4000 tokens để tối ưu chi phí API
- NFR03: Cache AI response 720 giờ (30 ngày)

## 6. Success Criteria

- [ ] SC01: Test case Nữ 11/05/1982 6h sáng → Luận giải KHÔNG có từ "phá sản", "ly hôn chắc chắn", "vong theo" ở các cung ngoài Phúc Đức
- [ ] SC02: Cung Tài Bạch có Phá Quân → Output phải đề cập "tái đầu tư, mở rộng" thay vì chỉ "hao tán"
- [ ] SC03: Mỗi cung phải có ít nhất 1 điểm Cát và 1 điểm Hung
- [ ] SC04: Phần Nghiệp quả/Phần âm CHỈ xuất hiện ở cung Phúc Đức
- [ ] SC05: Bài luận giải >= 6000 ký tự (đủ chi tiết)
