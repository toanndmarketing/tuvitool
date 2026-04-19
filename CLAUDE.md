# tu-vi-la-so — Claude Code Instructions

Dự án: tu-vi-la-so
Tech: Next.js 16 + React 19 + PNPM Monorepo + Prisma + Google Gemini AI

## PHÁP LỆNH TỐI CAO
- Tuân thủ `.agent/memory/constitution.md`.
- Docker-First: KHÔNG chạy node/python trên host.
- Ports: **8950** (local), **8900** (production).
- **Frontend/Backend**: Next.js 16 tại thư mục `apps/web` (PNPM). Mở rộng qua packages.
- Phản hồi bằng Tiếng Việt.
- KHÔNG hard-code URLs, Tokens, Keys. Dùng `.env`.

## Tech Stack
- Framework: Next.js 16 (App Router)
- Database: Prisma + SQLite (`apps/web/prisma`)
- Package Manager: PNPM Workspaces
- AI: Google Gemini AI SDK
- Container: Docker (tuvi-app:8950)

## Architecture
- `apps/web/` — Frontend & Backend API Route
- `packages/` — Monorepo shared libraries (nếu có)
- `apps/web/prisma/dev.db` — Database SQLite

## Domain Rules
- Tử Vi logic changes → MUST verify with `/test-tuvi` workflow
- Reference: `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md`

## Build & Test
- Build: `docker compose build`
- Run: `docker compose up -d`
- Logs: `docker compose logs -f tuvi-app`
- Stop: `docker compose down`
