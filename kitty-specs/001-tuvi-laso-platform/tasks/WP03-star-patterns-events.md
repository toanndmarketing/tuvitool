# WP03: Star Patterns & Event Scanner

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 3 (FR-TV-015 to FR-TV-017)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — M1/M2 overlap

## Goal

Verify Miếu/Hãm bảng tra, Bộ sao đặc biệt recognition, và Event Scanner 26 rules × 4 categories.

## Subtasks

- T021: Miếu/Vượng/Đắc/Hãm table for 14 chính tinh
- T022-T023: 5 Bộ Đại Hung + 5 Bộ Đại Cát + 3 Bộ Tâm Linh
- T024-T027: Event rules by category (RS, H, RC, C)
- T028: Threshold scoring
- T029: Full scan integration

## Event Categories

| Category | Code | Rules | Description |
|----------|------|-------|-------------|
| Địa Ốc & Âm Phần | RS01-RS07 | 7 | Nhà cửa, đất đai, tâm linh |
| Sức Khỏe | H01-H08 | 8 | Bệnh tật, tai nạn |
| Quan Hệ & Thị Phi | RC01-RC07 | 6-7 | Kiện cáo, xung đột |
| Hỷ Tín & Vận May | C01-C07 | 5+ | Thăng tiến, may mắn |

## Acceptance Criteria

1. Miếu/Hãm cho 14 chính tinh match sách chuẩn
2. All 13 special patterns (5 Đại Hung + 5 Đại Cát + 3 Tâm Linh) detected correctly
3. Event Scanner returns events with correct category, priority, severity
4. Threshold scoring filters low-confidence events

## Files to Review

- `public/tu-vi-star-patterns.js` (63.9KB)
- `public/tu-vi-event-rules.js` (25.6KB)
- `public/tu-vi-event-scanner.js` (27.7KB)
- `public/tu-vi-templates.js` (28.1KB)
