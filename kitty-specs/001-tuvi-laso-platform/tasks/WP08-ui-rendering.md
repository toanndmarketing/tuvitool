# WP08: UI/UX & Rendering

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 2 (all stories), Section 3 (FR-TV-018)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — UI aspects of all modules

## Goal

Giao diện đẹp, responsive, 4×4 grid Tử Vi render đúng, color-coded stars, tab switching smooth.

## Grid Layout (4×4)

```
┌────────┬────────┬────────┬────────┐
│  巳 Tỵ │  午 Ngọ│  未 Mùi│  申 Thân│
│  (4)   │  (5)   │  (6)   │  (7)   │
├────────┼────────┴────────┼────────┤
│  辰 Thìn│               │  酉 Dậu│
│  (3)   │   CENTER CELL  │  (8)   │
├────────┤  (Mệnh, Thân,  ├────────┤
│  卯 Mão│   Cục, Nạp Âm) │  戌 Tuất│
│  (2)   │                │  (9)   │
├────────┼────────┬────────┼────────┤
│  寅 Dần │  丑 Sửu│  子 Tý │  亥 Hợi│
│  (1)   │  (0)   │  (11)  │  (10)  │
└────────┴────────┴────────┴────────┘
```

## Star Color Coding

| Type | Color | CSS |
|------|-------|-----|
| Chính tinh | Đỏ | #c0392b |
| Phụ tinh | Xanh | #2980b9 |
| Sao lưu niên | Vàng | #f39c12 |
| Tứ Hóa marker | Original color + badge | (Lộc/Quyền/Khoa/Kỵ) |

## Subtasks

- T066-T069: Grid rendering + center cell + Đại Vận timeline
- T070: Tab switching (Tử Vi ↔ Thần Số Học)
- T071-T072: Responsive CSS + form UX
- T073: Login modal
- T074: Thần Số Học render (7 sections + 3×3 chart)
- T075: Cross-browser testing

## Acceptance Criteria

1. 4×4 grid displays correctly on desktop (1200px)
2. Each cell shows: cung name, Địa Chi, star list (color-coded), Tràng Sinh state
3. Center cell shows: Mệnh, Thân, Cục, Nạp Âm, Âm/Dương
4. Mobile (320px): grid readable with horizontal scroll or stacked
5. Tab switch smooth (no full page reload)
6. TSH Birth Chart 3×3 renders with highlighted/missing numbers
7. Login modal opens/closes correctly
8. No horizontal overflow on any viewport

## Files to Review

- `public/tu-vi-render.js` (14.1KB)
- `public/than-so-hoc-render.js` (29KB)
- `public/styles.css` (82.6KB)
- `public/index.html` (10.5KB)
- `public/app.js` (17.4KB)
- `public/auth.js` (6.6KB)
