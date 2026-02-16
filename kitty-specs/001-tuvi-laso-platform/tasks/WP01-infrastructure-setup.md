# WP01: Infrastructure & Docker Setup

## Context

- Spec: `kitty-specs/001-tuvi-laso-platform/spec.md` Section 7
- Plan: `kitty-specs/001-tuvi-laso-platform/plan.md` — Infrastructure section

## Goal

Đảm bảo Docker environment chạy ổn định, DB seed đúng, ENV config đầy đủ, healthcheck pass.

## Subtasks

- T001: Verify Dockerfile → `Dockerfile`
- T002: Verify docker-compose.yml → `docker-compose.yml`
- T003: Verify ENV files → `.env.example`, `.env`
- T004: Validate ENV startup logic → `server/server.js`
- T005: Verify .gitignore → `.gitignore`
- T006: Test Docker build
- T007: Test Docker run + healthcheck

## Acceptance Criteria

1. `docker compose build --no-cache` succeeds
2. `docker compose up -d` → container starts < 15s
3. `curl http://localhost:8950/api/health` → 200 OK
4. Missing GEMINI_API_KEY → server exit with error
5. All 6 ENV vars documented in `.env.example`

## Files to Modify/Review

- `Dockerfile`
- `docker-compose.yml`
- `.env` / `.env.example`
- `.gitignore`
- `server/server.js` (ENV validation section)
