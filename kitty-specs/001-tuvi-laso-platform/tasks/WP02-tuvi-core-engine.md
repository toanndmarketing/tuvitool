# WP02: Tử Vi Calculation Engine — Core

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 2 (User Story 1), Section 3 (FR-TV-001 to FR-TV-018)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — M1 Module

## Goal

Verify + fix toàn bộ pipeline tính toán Tử Vi: Âm lịch → Can Chi → Mệnh/Thân/Cục → An 14 chính tinh + 60+ phụ tinh → Tràng Sinh → Đại/Tiểu Vận → Tuần/Triệt.

## Reference Data

- **Golden Test**: `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md`
- Input: Nguyễn Đức Toàn, 14/07/1996, giờ Thìn (7-9h), Nam
- Expected: Âm lịch 29/5 Bính Tý

## Subtasks

- T008-T009: AmLich accuracy + Can Chi
- T010-T013: Mệnh, Thân, Cục, Nạp Âm
- T014-T015: 14 chính tinh + 60+ phụ tinh
- T016-T017: Tràng Sinh + Tuần/Triệt
- T018-T019: Đại/Tiểu Vận + 12 cung naming
- T020: Golden test comparison

## Critical Algorithms

1. **Cung Mệnh**: `(2 + thangAL - 1 - chiGio + 12) % 12`
2. **Cung Thân**: `(chiGio + thangAL - 1 + 2) % 12`
3. **Nhóm Tử Vi**: TuViPos → [-1,-3,-4,-5,-8] → Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh
4. **Nhóm Thiên Phủ**: đối xứng `(4 - TuViPos + 12) % 12` → +1,+2,+3,+4,+5,+6,+10
5. **Cục**: lookup table 10 Can × 12 Cung Mệnh → 2-6

## Acceptance Criteria

1. AmLich 14/07/1996 → 29/5 Bính Tý ✓
2. Cung Mệnh, Thân đúng vị trí
3. 14 chính tinh đúng vị trí (so với reference)
4. Tất cả phụ tinh đúng
5. Đại Vận periods & ages correct
6. Tuần Không + Triệt Lộ positions correct

## Files to Review

- `public/am-lich.js` (11.3KB)
- `public/tu-vi-calc.js` (20.5KB)
- `public/tu-vi-sao.js` (31.9KB)
