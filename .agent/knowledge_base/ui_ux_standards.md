# 🎨 UI/UX Standards (Phân hệ Huyền Học Tử Vi)

Chuẩn mực UI/UX này được tinh chỉnh chuyên biệt cho thiết kế ứng dụng Huyền học / Tử Vi Đẩu Số, tập trung vào **sự huyền bí, sang trọng, thông tin dày đặc nhưng dễ đọc (High Data Density)**.

## 🌈 Brand Palette (Ngũ Hành & Vũ Trụ)
Bảng màu ưu tiên Dark Mode (thể hiện bầu trời / các vì sao) kết hợp với màu của Ngũ Hành để gắn tag cho các vì sao.

```typescript
colors: {
  // Theme vũ trụ (Background chính)
  space: {
    bg: '#0F172A', // Slate 900
    card: '#1E293B', // Slate 800
    border: '#334155', // Slate 700
  },
  // Typography
  ink: {
    DEFAULT: '#F8FAFC', // Slate 50
    muted: '#94A3B8', // Slate 400
    gold: '#F59E0B', // Cát tinh / Quan trọng
  },
  // Ngũ Hành (Dùng cho màu chữ các sao)
  elements: {
    metal: '#CBD5E1',   // Kim (Trắng/Xám)
    wood: '#10B981',    // Mộc (Xanh lá)
    water: '#3B82F6',   // Thuỷ (Xanh dương/Đen)
    fire: '#EF4444',    // Hoả (Đỏ)
    earth: '#EAB308',   // Thổ (Vàng/Nâu)
  },
  // Phân loại sao
  stars: {
    major: '#F472B6',   // Chính tinh (Hồng/Đậm)
    minor: '#60A5FA',   // Phụ tinh
    bad: '#7F1D1D',     // Hung/Sát tinh
  }
}
```

## 🔡 Typography (Cổ Điển phối Hiện Đại)
- Lĩnh vực Huyền học đòi hỏi sự nghiêm túc, nên sử dụng **Serif font** cho Tiêu đề (Cung/Chính tinh) và **Sans-serif (Modern)** cho chỉ số/diễn giải dài.
- **H1 (Destiny Title)**: `font-serif text-3xl font-extrabold text-ink-gold` (VD: Noto Serif / Playfair)
- **H2 (Palace Name)**: `font-serif text-2xl font-bold` (Tên cung: Mệnh, Tài, Quan...)
- **Body (Luận giải)**: `font-sans text-base leading-relaxed text-ink-muted` (VD: Inter / Roboto)

## 📐 Layout Lá Số (Astrology Chart Grid)
Ứng dụng Tử Vi bắt buộc phải có chuẩn Layout 12 ô.
- **Grid Container**: Sử dụng CSS Grid 4x4.
  `grid-cols-4 grid-rows-4 gap-1` hoặc `gap-2`.
- **Thiên Bàn (Trung cung)**: Chiếm 4 ô giữa (`col-start-2 col-span-2 row-start-2 row-span-2`), dùng khu vực này để hiển thị Thông tin đương số (Năm sinh, Bát Tự, Mệnh/Cục).
- **Địa Bàn (12 Cung xung quanh)**: Các ô phải fix tỷ lệ Vuông (aspect-square) hoặc hình chữ nhật đứng tuỳ mobile/desktop.

## 🧱 Core Components (Đặc Thù Tử Vi)

### 1. Palace Card (Ô Cung Tử Vi)
- **Style**: `bg-space-card border border-space-border hover:border-ink-gold transition-colors overflow-hidden`
- **Cấu trúc 1 Ô Cung**:
  - *Góc trên phải*: Tên Cung (Mệnh, Phụ Mẫu...).
  - *Góc dưới phải*: Địa Chi (Tý, Sửu...).
  - *Cột trái*: Danh sách Chính tinh (Chữ to, Miếu/Vượng/Hãm).
  - *Cột phải*: Danh sách Phụ tinh/Sát tinh.
  - *Góc trái dưới*: Tuổi đại vận (Ví dụ: 12, 22, 32...).

### 2. Element Badges
- Tag hiển thị ngũ hành cục hoặc ngũ hành sao: Hình tròn nhỏ hoặc tag siêu bé `text-[10px] px-1 bg-opacity-20` theo màu `elements`.

## ✨ Micro-animations
- Không nên bay lượn màu mè quá lố phá vỡ vẻ trang nghiêm.
- **Focus Xung Chiếu / Tam Hợp**: Mọi tương tác Hover vào 1 Cung -> Dùng opacity/highlight để làm sáng Cung đó và 3 cung Tam Hợp/Xung Chiếu. Đây là UX cốt lõi của user xem Tử Vi. Điểm chạm (Hover state) này đáng giá nhất.

## ✅ Tử Vi UI/UX Checklist
- [ ] Chữ các sao phải phân biệt rõ bằng màu (Cát/Hung/Sát/Hóa).
- [ ] Responsive lá số: Lên mobile có thể hiển thị dạng List Dropdown thay vì cố ép 12 ô bé tí teo.
- [ ] Hover vào cung nào, highlight Tam Phương Tứ Chính của cung đó.
