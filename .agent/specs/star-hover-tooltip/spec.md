---
title: Star Hover Tooltip — Mô tả sao khi hover trên lá số
status: DRAFT
version: 1.0.0
created: 2026-03-17
reference: "CanChi - vibe.j2team.org (UI/UX mẫu)"
---

## 1. Overview

Khi người dùng xem lá số Tử Vi, hover chuột vào tên sao (chính tinh hoặc phụ tinh) sẽ hiển thị một popup tooltip nhỏ với mô tả ngắn gọn về ý nghĩa, đặc tính, và tác dụng của sao đó. Tính năng này giúp người dùng — kể cả người mới — hiểu ngay nội dung lá số mà không cần tra cứu bên ngoài.

**Tham chiếu UI**: Layout và hành vi hover được lấy cảm hứng từ [vibe.j2team.org/canchi](https://vibe.j2team.org/canchi/). Chỉ tham khảo UI/UX, KHÔNG tham khảo logic tính toán.

## 2. User Scenarios

- **US1**: As a **Người dùng xem lá số**, I want to **hover vào tên sao trên lá số** và thấy ngay mô tả ngắn gọn, so that **tôi hiểu ý nghĩa sao đó mà không cần tra cứu thêm**.

- **US2**: As a **Người dùng mobile**, I want to **chạm/tap vào tên sao** và thấy tooltip hiện lên, so that **trải nghiệm trên mobile cũng tương tự desktop**.

- **US3**: As a **Người dùng xem lá số**, I want to **hover vào các thành phần khác (tên cung, Tuần/Triệt, Trường Sinh)** và thấy giải thích ngắn, so that **tôi hiểu cấu trúc lá số toàn diện**.

## 3. Functional Requirements

### FR01: Star Tooltip Data
- Mỗi sao (chính tinh + phụ tinh) PHẢI có dữ liệu mô tả bao gồm:
  - **Tên sao** (hiển thị đậm)
  - **Ngũ hành** (Kim/Mộc/Thủy/Hỏa/Thổ)
  - **Phân loại** (Cát tinh / Hung tinh / Trung tính)
  - **Mô tả ngắn** (1-2 câu về ý nghĩa chính)
- Dữ liệu mô tả được lưu trong file JS riêng biệt (data layer), KHÔNG hard-code vào render.

### FR02: Tooltip UI
- Tooltip xuất hiện khi **hover** (desktop) hoặc **tap** (mobile) vào tên sao.
- Tooltip có:
  - Nền tối (dark), bo góc, đổ bóng nhẹ.
  - Chữ trắng/sáng, font-size nhỏ (11-12px).
  - Width tối đa 14rem (~224px).
  - Vị trí: phía trên hoặc phía dưới phần tử, tự điều chỉnh nếu bị cắt bởi viewport.
- Tooltip hiện/ẩn bằng **CSS pure** (`:hover` + `display: none/block`) — KHÔNG cần JavaScript cho cơ chế hiện/ẩn cơ bản.
- Trên mobile: sử dụng CSS `:active` hoặc minimal JS để toggle.

### FR03: Tooltip cho các thành phần khác
- **Tuần/Triệt**: Hiển thị giải thích "Tuần trung" / "Triệt lộ" kèm tác dụng (giảm cát/hung).
- **Tên cung**: Hiển thị ý nghĩa cung đó trong lá số (Mệnh, Phụ Mẫu, Tài Bạch...).
- **Trường Sinh**: Hiển thị giải thích trạng thái Trường Sinh (Dưỡng, Trường Sinh, Mộc Dục...).

### FR04: Visual Cursor
- Tất cả phần tử có tooltip PHẢI có `cursor: help` để báo hiệu cho người dùng biết có tooltip.

### FR05: Color by Ngũ Hành
- Tên sao trong tooltip (và trên lá số) đã có màu theo ngũ hành:
  - 🔴 Hỏa: `#f87171` (red-400)
  - 🟢 Mộc: `#34d399` (emerald-400)
  - 🟡 Thổ: `#fbbf24` (amber-400)
  - ⚪ Kim: `#d4d4d8` (zinc-300)
  - 🔵 Thủy: `#38bdf8` (sky-400)

## 4. Non-Functional Requirements

- **NFR01**: Tooltip phải hiện trong < 100ms (CSS transition, không delay).
- **NFR02**: Tooltip KHÔNG được che khuất lá số đến mức khó đọc (max-width cố định).
- **NFR03**: Dữ liệu tooltip sao ≥ 100 sao (bao phủ toàn bộ chính tinh + phụ tinh phổ biến).
- **NFR04**: Tooltip PHẢI responsive — trên mobile không bị tràn ra ngoài viewport.
- **NFR05**: Performance: Thêm tooltip KHÔNG được tăng thời gian render lá số > 50ms.

## 5. Success Criteria

- [ ] SC01: Hover vào bất kỳ chính tinh nào → tooltip hiện mô tả + ngũ hành + phân loại.
- [ ] SC02: Hover vào phụ tinh → tooltip hiện mô tả ngắn.
- [ ] SC03: Hover vào Tuần/Triệt → tooltip giải thích ý nghĩa.
- [ ] SC04: Hover vào tên cung → tooltip giải thích ý nghĩa cung.
- [ ] SC05: Trên mobile (responsive), tap vào sao → tooltip hiện lên.
- [ ] SC06: Tất cả sao có dữ liệu mô tả (≥ 100 sao).
- [ ] SC07: `cursor: help` trên mọi phần tử có tooltip.
- [ ] SC08: Tooltip không bị tràn viewport trên desktop và mobile.
