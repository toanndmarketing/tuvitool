# WP09: Database & Interpretation Data

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 4 (Data Models), Section 5 (API Endpoints)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — DB aspects

## Goal

SQLite schema + seed data chính xác, API queries return correct data, cache system works.

## Database Tables

| Table | Rows (approx) | Purpose |
|-------|---------------|---------|
| sao_interpretations | 30-40 | Meaning of each star in each palace |
| cung_interpretations | 12 | Meaning of each palace |
| special_interpretations | 20+ | Special patterns, combos |
| ai_cache | Dynamic | Cached AI responses with TTL |

## Subtasks

- T076: DB initialization (4 tables, indexes)
- T077-T079: Seed data verification (sao, cung, special)
- T080: ai_cache CRUD + TTL expiry
- T081: Query functions review
- T082: Data accuracy vs reference books
- T083: Integration test (seed → query → API response)

## Acceptance Criteria

1. DB auto-creates on first run if not exists
2. Seed data inserts only if tables empty (idempotent)
3. `GET /api/interpretations/sao` → all stars with type/nature/per-palace meanings
4. `GET /api/interpretations/cung` → all 12 palace meanings
5. `GET /api/interpretations/all` → combined response
6. ai_cache expired rows cleaned up on each read
7. better-sqlite3 WAL mode enabled for concurrent reads

## Files to Review

- `server/db.js` (25KB)
