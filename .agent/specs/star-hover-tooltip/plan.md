---
title: Technical Plan — Star Hover Tooltip
status: DRAFT
version: 1.0.0
created: 2026-03-17
spec: star-hover-tooltip/spec.md
---

## 1. Overview

Implement tooltips khi hover vào sao trên lá số Tử Vi, giống UI/UX của vibe.j2team.org.

**Scope thay đổi**: 3 files (1 NEW + 2 MODIFY), không ảnh hưởng logic tính toán.

## 2. Architecture

### Component Diagram

```
tu-vi-star-descriptions.js [NEW]  ← Data layer (mô tả 100+ sao)
         ↓
tu-vi-render.js [MODIFY]          ← Render tooltip HTML wrapper
         ↓
styles.css [MODIFY]               ← Tooltip CSS (hover hiện/ẩn)
```

### Kỹ thuật Tooltip (CSS-only)

Giống mẫu vibe.j2team.org: **KHÔNG cần JavaScript** cho hiện/ẩn tooltip.

```html
<!-- Pattern cho mỗi sao -->
<span class="star-tooltip-wrap">
  <span class="star-main">Tử Vi</span>
  <span class="star-tooltip">
    <b>Tử Vi</b> — Thổ | Cát tinh<br>
    Vua của 14 chính tinh, chủ về quyền uy, danh vọng.
  </span>
</span>
```

```css
.star-tooltip-wrap { position: relative; cursor: help; }
.star-tooltip { display: none; position: absolute; bottom: 100%; ... }
.star-tooltip-wrap:hover .star-tooltip { display: block; }
```

## 3. Data Model

### File: `tu-vi-star-descriptions.js` [NEW]

```javascript
const STAR_DESCRIPTIONS = {
  // 14 Chính Tinh
  'Tử Vi': {
    nguHanh: 'Thổ',
    loai: 'Cát tinh',
    moTa: 'Vua của 14 chính tinh, chủ quyền uy, danh vọng, phú quý.'
  },
  'Thiên Cơ': {
    nguHanh: 'Mộc',
    loai: 'Cát tinh',
    moTa: 'Chủ trí tuệ, mưu lược, khéo léo, giỏi tính toán.'
  },
  // ... 100+ sao
};

// Mô tả cung
const CUNG_DESCRIPTIONS = {
  'Mệnh': 'Cung chủ về bản mệnh, tính cách, diện mạo...',
  // ... 12 cung
};

// Mô tả Trường Sinh
const TRUONG_SINH_DESCRIPTIONS = {
  'Trường sinh': 'Sinh trưởng, phát triển, khởi đầu thuận lợi.',
  // ... 12 trạng thái
};

// Tuần Triệt
const TUAN_TRIET_DESCRIPTIONS = {
  'Tuần': 'Tuần trung: Vùng ẩn tàng, sao bị che khuất...',
  'Triệt': 'Triệt lộ: Vùng bị cắt đứt, sao bị giảm lực...'
};
```

## 4. File Changes

### 4.1. [NEW] `public/tu-vi-star-descriptions.js`

**Nội dung**: Object chứa mô tả 100+ sao (14 chính tinh + 60+ phụ tinh + 20+ sao lưu niên), 12 cung, 12 Trường Sinh, Tuần/Triệt.

**Cấu trúc mỗi sao**:
- `nguHanh`: Kim/Mộc/Thủy/Hỏa/Thổ
- `loai`: Cát tinh/Hung tinh/Trung tính
- `moTa`: 1-2 câu mô tả ngắn

---

### 4.2. [MODIFY] `public/tu-vi-render.js`

**Thay đổi 1**: Hàm `renderPalaceCell()` — wrap mỗi sao trong tooltip container:

```diff
- html += `<span class="star-main">${s.name}${getHoaSuffixHtml(s)}</span> `;
+ html += renderStarWithTooltip(s, 'star-main');
```

**Thay đổi 2**: Thêm hàm mới `renderStarWithTooltip(sao, cssClass)`:
- Lookup STAR_DESCRIPTIONS[sao.name]
- Render wrapper `<span class="star-tooltip-wrap">` + tooltip content

**Thay đổi 3**: Tooltip cho tên cung, Tuần/Triệt, Trường Sinh trong header/footer.

---

### 4.3. [MODIFY] `public/styles.css`

Thêm ~40 dòng CSS mới cho tooltip:

- `.star-tooltip-wrap` — `position: relative; display: inline-block; cursor: help;`
- `.star-tooltip` — `display: none; position: absolute; z-index: 50;` + dark bg, rounded, shadow
- `.star-tooltip-wrap:hover .star-tooltip` — `display: block;`
- Media query mobile: `.star-tooltip-wrap:active .star-tooltip` — `display: block;`

---

### 4.4. [MODIFY] `public/index.html`

Thêm 1 dòng `<script>` để load file `tu-vi-star-descriptions.js` (TRƯỚC `tu-vi-render.js`).

## 5. Constitution Compliance Check

| Rule | Status |
|------|--------|
| §1 Docker-First | ✅ Chỉ sửa frontend static files, chạy qua Docker |
| §2 Security | ✅ Không ảnh hưởng production safety |
| §3 No hard-code | ✅ Dữ liệu tách riêng file, không hard-code vào render |
| §4 Workflow | ✅ Tuân thủ Specify → Plan → Tasks → Implement |

## 6. Verification Plan

### Automated (Browser Test)

1. **Mở lá số** tại `http://localhost:8950` (hoặc port Docker)
2. **Nhập thông tin** → bấm "Xem lá số"
3. **Hover vào chính tinh** → phải thấy tooltip hiện lên với nội dung mô tả
4. **Hover vào phụ tinh** → phải thấy tooltip
5. **Hover vào Tuần/Triệt** → phải thấy giải thích
6. **Hover vào tên cung** → phải thấy mô tả cung
7. **Kiểm tra cursor** → tất cả phần tử có tooltip phải có `cursor: help`

### Manual Verification (User)

1. Anh mở lá số → hover qua các sao → kiểm tra tooltip hiện đúng, đẹp
2. Thu hẹp viewport → kiểm tra tooltip không bị tràn
3. So sánh trực quan với mẫu vibe.j2team.org
