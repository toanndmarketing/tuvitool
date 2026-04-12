# tu-vi-la-so — Claude Code Instructions

Dự án: tu-vi-la-so
Tech: Express.js + Vanilla JS + SQLite + Google Gemini AI

## PHÁP LỆNH TỐI CAO
- Tuân thủ `.agent/memory/constitution.md`.
- Docker-First: KHÔNG chạy node/python trên host.
- Ports: **8950** (local), **8900** (production).
- **KHÔNG có Next.js/React/Vue** — Frontend là Vanilla HTML/JS/CSS.
- Phản hồi bằng Tiếng Việt.
- KHÔNG hard-code URLs, Tokens, Keys. Dùng `.env`.

## Tech Stack
- Backend: Express.js 4.21 (Node.js 20)
- Database: SQLite (better-sqlite3)
- Frontend: Vanilla HTML + JS + CSS (NO framework)
- AI: Google Gemini API
- Auth: In-memory Bearer token
- Container: Docker (tuvi-app:8950)

## Architecture
- `public/` — Static frontend files
- `server/` — Express API backend
- `data/` — SQLite DB + test data
- `server/prompts/` — AI prompt templates

## Domain Rules
- Tử Vi logic changes → MUST verify with `/test-tuvi` workflow
- Reference: `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md`

## Build & Test
- Build: `docker compose build`
- Run: `docker compose up -d`
- Logs: `docker compose logs -f tuvi-app`
- Stop: `docker compose down`
