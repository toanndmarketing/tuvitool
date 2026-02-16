# WP10: Testing & Quality Assurance

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 8 (Success Criteria)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — All modules
- Workflow: `/test-tuvi`

## Goal

Full test suite, accuracy verification, performance benchmarks, bug fixes, documentation.

## Test Matrix

### Functional Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| 1 | Golden Test (NDT 1996) | `/test-tuvi` workflow | Match reference data |
| 2 | Birth 1950 (Canh Dần) | Manual | Correct Cục + stars |
| 3 | Birth 1975 (Ất Mão) | Manual | Correct Cục + stars |
| 4 | Birth 2000 (Canh Thìn) | Manual | Correct Cục + stars |
| 5 | Birth 2025 (Ất Tỵ) | Manual | Correct Cục + stars |

### Edge Cases

| # | Case | What to Check |
|---|------|--------------|
| 1 | Tháng nhuận | AmLich conversion handles leap month |
| 2 | Giờ Tý (23h-1h) | Day boundary handling |
| 3 | Ngày 30 AL | Star placement doesn't overflow |
| 4 | Cục 6 boundary | Lookup table edge |

### Thần Số Học Tests

| # | Name | Check |
|---|------|-------|
| 1 | Nguyễn Đức Toàn | Full calculation |
| 2 | Trần Thị Hồng Ánh | Complex diacritics |
| 3 | Lê Văn B | Short name |
| 4 | Phạm Thị Thanh Thủy | Long name |
| 5 | Đỗ Ý | Minimal vowels |

### Performance

| Metric | Target | Method |
|--------|--------|--------|
| Chart calculation | < 100ms | `performance.now()` |
| AI response | < 30s | Server timing |
| Docker start | < 15s | Stopwatch |
| Page load | < 3s | Lighthouse |

## Subtasks

- T084: Run `/test-tuvi` workflow
- T085-T087: Date + name variations
- T088-T089: Auth + rate limit tests
- T090: Docker persistence test
- T091: Performance benchmarks
- T092: Lighthouse audit
- T093: Bug fix pass
- T094: Documentation update

## Acceptance Criteria

1. All 10 Success Criteria from spec.md pass
2. Zero critical bugs remaining
3. README.md updated with current architecture
4. Performance targets met
