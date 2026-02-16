# WP04: Lưu Niên Advanced Analysis — P2-P6

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 2 (User Story 2), Section 3 (FR-LN-001 to FR-LN-006)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — M2 Module

## Goal

Pipeline phân tích lưu niên nâng cao hoàn chỉnh: sao lưu, P2-P6 full, buildPrevYearSummary.

## Analysis Phases

| Phase | Code | Description | Output |
|-------|------|-------------|--------|
| P2 | Lưu Tứ Hóa | Lw Lộc/Quyền/Khoa/Kỵ → cung → meaning | Structured text per Hóa |
| P3 | Trigger Logic | Hung gốc + hung lưu overlay → hệ số nhân | Warning multiplier |
| P4 | Lưu Thái Tuế | Cung "động" + tương tác sao gốc | Cung analysis |
| P5 | Nguyệt Hạn | 12 tháng: cung + sao + năng lượng | Monthly array |
| P6 | Energy Score | 3 trụ: Tài chính/Sức khỏe/Tình cảm | JSON {0-100, 0-100, 0-100} |

## Subtasks

- T030: Lưu niên star placement (12+ sao)
- T031-T035: P2 through P6 reviews
- T036: buildPrevYearSummary
- T037: Full pipeline integration

## Acceptance Criteria

1. 12 sao lưu placed correctly for 2026 (Bính Ngọ)
2. P2: Lưu Tứ Hóa mapped to correct cung with correct meaning
3. P3: Trigger multiplier activates when hung gốc + hung lưu overlap
4. P5: 12 monthly entries with energy values
5. P6: JSON with 3 keys, values 0-100
6. PrevYear summary successfully builds for comparison

## Files to Review

- `public/tu-vi-luu-nien.js` (24.2KB)
