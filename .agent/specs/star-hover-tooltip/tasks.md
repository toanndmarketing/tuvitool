---
title: Task Breakdown — Star Hover Tooltip
status: DRAFT
version: 1.0.0
created: 2026-03-17
plan: star-hover-tooltip/plan.md
---

## Tasks (3 tasks, thứ tự dependency)

### Task 1: Tạo data mô tả sao `tu-vi-star-descriptions.js` [NEW]
- **File**: `public/tu-vi-star-descriptions.js`
- **Mô tả**: Object STAR_DESCRIPTIONS (100+ sao), CUNG_DESCRIPTIONS (12 cung), TRUONG_SINH_DESCRIPTIONS (12 trạng thái), TUAN_TRIET_DESCRIPTIONS
- **Dependency**: Không
- **Est**: ≤ 15 phút

### Task 2: Thêm CSS tooltip styles [MODIFY]
- **File**: `public/styles.css`
- **Mô tả**: Thêm ~40 dòng CSS cho `.star-tooltip-wrap`, `.star-tooltip`, `:hover` show/hide, responsive mobile
- **Dependency**: Không
- **Est**: ≤ 10 phút

### Task 3: Sửa render để wrap sao trong tooltip [MODIFY]
- **Files**: `public/tu-vi-render.js`, `public/index.html`
- **Mô tả**: Thêm hàm `renderStarWithTooltip()`, sửa `renderPalaceCell()` để wrap sao + cung + Tuần/Triệt, thêm `<script>` tag
- **Dependency**: Task 1, Task 2
- **Est**: ≤ 15 phút
