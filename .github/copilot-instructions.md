# tu-vi-la-so — Copilot Instructions

Dự án: tu-vi-la-so
Tech: Express.js + Vanilla JS + SQLite + Google Gemini AI

## PHÁP LỆNH TỐI CAO
- Tuân thủ `.agent/memory/constitution.md`.
- Docker-First: KHÔNG chạy node/python trên host.
- Ports: **8950** (local), **8900** (production).
- **KHÔNG có Next.js/React/Vue** — Frontend là Vanilla HTML/JS/CSS.
- Phản hồi bằng Tiếng Việt.
- KHÔNG hard-code URLs, Tokens, Keys. Dùng `.env`.

## Architecture
- `public/` — Static frontend (Vanilla HTML/JS/CSS)
- `server/` — Express API backend (CommonJS)
- `data/` — SQLite DB + test data
- `server/prompts/` — AI prompt templates
- Frontend: Global functions (NO import/export)
- Backend: CommonJS require()

## Domain Rules
- Tử Vi logic changes → MUST verify accuracy
- Reference: `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md`

## Build & Test
- Build: `docker compose build`
- Run: `docker compose up -d`
- Logs: `docker compose logs -f tuvi-app`
