# tu-vi-la-so — Copilot Instructions

Dự án: tu-vi-la-so
Tech: Next.js 16 + React 19 + PNPM Monorepo + Prisma + Google Gemini AI

## PHÁP LỆNH TỐI CAO
- Tuân thủ `.agent/memory/constitution.md`.
- Docker-First: KHÔNG chạy node/python trên host.
- Ports: **8950** (local), **8900** (production).
- **Frontend/Backend**: Next.js 16 tại `apps/web` (PNPM Workspaces).
- Phản hồi bằng Tiếng Việt.
- KHÔNG hard-code URLs, Tokens, Keys. Dùng `.env`.

## Architecture
- `apps/` — Chứa ứng dụng Next.js (ví dụ `apps/web`)
- `packages/` — Chứa các package dùng chung.
- Khuyến nghị sử dụng chuẩn TypeScript và App Router của Next.js 16. Mọi UI đều dùng Tailwind CSS.

## Domain Rules
- Tử Vi logic changes → MUST verify accuracy
- Reference: `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md`

## Build & Test
- Build: `docker compose build`
- Run: `docker compose up -d`
- Logs: `docker compose logs -f tuvi-app`
