# WP06: AI Interpretation Pipeline

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 2 (User Story 3), Section 3 (FR-AI-001 to FR-AI-006)
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — M4 Module

## Goal

Gemini AI integration: prompt builder quality, cache correctness, response parser accuracy, error resilience.

## Pipeline Architecture

```
Client compact data → POST /api/interpret/ai
    → buildCacheKey(DNA) → MD5 hash
    → checkCache(hash) → SQLite ai_cache
    → (miss) buildPrompt(data) → system + user message
    → Gemini API call (gemini-2.0-flash)
    → parseResponse(rawText) → structured sections
    → saveCache(hash, response, TTL=24h)
    → JSON response to client
```

## Subtasks

- T050: Prompt builder quality (system instruction = expert 30+ years)
- T051: Compact data format (minimal raw data, no template text)
- T052: Cache key = MD5(Cục + Mệnh + sao positions + Chi năm xem)
- T053: SQLite cache CRUD with TTL
- T054: Response parser (per-palace or 8 general sections)
- T055: Error handling (timeout → fallback → error message)
- T056: Rate limiter (10 req/15min for AI endpoint)
- T057: Full round-trip integration test

## Acceptance Criteria

1. Prompt includes structured role definition
2. Compact data ≤ 5KB (not bloated with templates)
3. Cache key different for same person + different year
4. Cache hit returns same response, `cached: true`
5. Gemini timeout → serve old cache if exists
6. Rate limit: 11th request in 15min → 429 Too Many Requests

## Files to Review

- `server/gemini.js` (19KB)
- `server/db.js` (cache functions)
- `server/server.js` (rate limiter config)
