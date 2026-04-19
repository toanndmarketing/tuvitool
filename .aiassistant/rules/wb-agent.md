# 🛡️ WB-Agent Rules — tu-vi-la-so

Tech: Express.js + Vanilla JS + SQLite + Google Gemini AI

## Pháp lệnh
- Docker-First. KHÔNG chạy node/python trên host.
- Ports: **8950** (local), **8900** (production).
- **KHÔNG Next.js/React/Vue** — Vanilla HTML/JS/CSS.
- Phản hồi bằng Tiếng Việt.
- KHÔNG hard-code URLs/Tokens/Keys. Dùng `.env`.
- Frontend: Global functions. Backend: CommonJS require().
- Domain accuracy: Verify với `/test-tuvi` khi sửa logic Tử Vi.

## Build
- `docker compose build` → `docker compose up -d`
- Logs: `docker compose logs -f tuvi-app`

