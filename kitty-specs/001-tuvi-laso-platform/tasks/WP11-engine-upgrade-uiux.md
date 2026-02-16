# WP11: Engine Upgrade & UI/UX Enhancement

## Goal

Bổ sung logic tính toán còn thiếu (Lục Hợp, Relationship Map Sao-Cung) và nâng cấp UI/UX responsive + thêm tính năng tải ảnh lá số.

## Context

- WP01-WP10 đã hoàn thành, engine cơ bản chạy đúng
- Phân tích từ doc "Phân tích Tử Vi Đẩu Số_ Bổ sung & Nâng cấp" phát hiện 2 logic missing
- `calculateStarWeight()` đã export nhưng chưa module nào gọi
- CSS chưa có media queries → lá số vỡ trên mobile
- Chưa có nút tải ảnh lá số

## Deliverables

### A. Logic Engine Missing (tu-vi-star-patterns.js + tu-vi-event-scanner.js)

1. **Lục Hợp (Nhị Hợp)**: 6 cặp Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi
   - Function `getLucHop(pos)` → trả vị trí cung hợp
   - Tích hợp vào `collectStars()` trong event-scanner
   - Weight: 0.35 (nhẹ hơn Tam Hợp nhưng mạnh hơn Giáp Cung)
2. **Relationship Map Sao-Cung**: Quan hệ Ngũ Hành giữa sao và cung
   - Bảng tra Hành 12 Cung (Chi → Hành)
   - Bảng tra Hành 14 Chính Tinh
   - Function `getHanhRelationSaoCung(starName, cungPos)` → sinh/khắc/hòa
   - Tích hợp vào `analyzeCung()` trong interpret

### B. Tích hợp `calculateStarWeight()`

- Gọi trong `analyzeCung()` cho từng sao → xuất ra `starWeight`
- Hiển thị weight bar visual trong luận giải

### C. UI/UX Responsive

1. **Lá số 4x4 grid responsive**:
   - Desktop: grid 4 cột bình thường
   - Tablet (≤1024px): scale down font, padding
   - Mobile (≤768px): chuyển sang layout dọc scrollable hoặc scale transform
2. **Nội dung luận giải responsive**: card layout co giãn
3. **Đại Vận timeline responsive**: horizontal scroll trên mobile

### D. Tải Ảnh Lá Số

- Nút "📷 Tải Ảnh" cạnh nút In
- Sử dụng html2canvas (CDN) để capture `.chart-grid` → download PNG
- Watermark tự động

## Test

- Lập lá số Nguyễn Đức Toàn (28/01/1991, giờ Ngọ, Nam, xem 2026)
- Verify Lục Hợp hiển thị đúng trong luận giải
- Verify Relationship Map hiển thị đúng
- Verify responsive trên Chrome DevTools (iPhone 14, iPad, Desktop)
- Verify tải ảnh PNG thành công
