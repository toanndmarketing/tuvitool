# WP05: Thần Số Học Engine

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 2 (User Story 4), Section 3 (FR-TSH-001 to FR-TSH-005)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — M3 Module

## Goal

Verify Pythagoras engine: 15+ indices, Vietnamese name handling, meaning data, UI render.

## 15+ Indices

| # | Index | From | Master? |
|---|-------|------|---------|
| 1 | Life Path | Date of birth | Yes (11,22,33) |
| 2 | Birth Day | Day only | No |
| 3 | Attitude | Day + Month | No |
| 4 | Soul Urge | Vowels in name | Yes |
| 5 | Personality | Consonants in name | Yes |
| 6 | Expression | All letters | Yes |
| 7 | Maturity | LP + Expression | No |
| 8 | Personal Year | Day + Month + Year | No |
| 9 | Personal Month | PY + Month | No |
| 10 | Birth Chart 3×3 | All digits in DOB | N/A |
| 11 | Arrows | Patterns in chart | N/A |
| 12 | Missing Numbers | Zeros in chart | N/A |
| 13 | Dominant Numbers | High count in chart | N/A |
| 14 | Pinnacle Cycles (×4) | Complex formula | No |
| 15 | Challenge Numbers (×4) | Subtraction | No |
| 16 | Bridge Numbers | Differences | No |

## Vietnamese Diacritics Removal

```
ắ,ằ,ẳ,ẵ,ặ,ă → a    ấ,ầ,ẩ,ẫ,ậ,â → a
á,à,ả,ã,ạ → a        é,è,ẻ,ẽ,ẹ → e
ế,ề,ể,ễ,ệ,ê → e     í,ì,ỉ,ĩ,ị → i
ó,ò,ỏ,õ,ọ → o        ố,ồ,ổ,ỗ,ộ,ô → o
ớ,ờ,ở,ỡ,ợ,ơ → o     ú,ù,ủ,ũ,ụ → u
ứ,ừ,ử,ữ,ự,ư → u     ý,ỳ,ỷ,ỹ,ỵ → y
đ → d
```

## Acceptance Criteria

1. Life Path 14/07/1996 → correct value (with Master Number handling)
2. Name "Nguyễn Đức Toàn" → correct vowel/consonant split
3. Birth Chart 3×3 with correct digit counts
4. Arrow detection matches Pythagoras standard
5. Pinnacle Cycles start at age (36 - LP)
6. UI renders all 7 sections without errors

## Files to Review

- `public/than-so-hoc.js` (17.4KB)
- `public/than-so-hoc-data.js` (36.7KB)
- `public/than-so-hoc-render.js` (29KB)
