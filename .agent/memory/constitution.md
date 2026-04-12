# 📜 Project Constitution — tu-vi-la-so

## §0 WB-Agent Protocol (BẮT BUỘC)
- **BẮT BUỘC**: Mọi hoạt động phát triển, kiểm thử, triển khai PHẢI sử dụng `wb-agent`.
- **Pipeline**: Tuân thủ nghiêm ngặt: Specify → Plan → Tasks → Implement.
- **Tools**: Chỉ sử dụng workflows trong `.agent/workflows/` để thực hiện task.

## §1 Infrastructure (DOCKER-FIRST)
- **Mặc định dùng Docker** cho cả Local và Production. KHÔNG chạy `npm`/`node`/`python` trực tiếp trên host.
- **Local**: `docker-compose.yml` — service `tuvi-app`, port **8950**.
- **Production**: Server `15.235.210.4`, path `/home/tuvitool`, port **8900** (mapped qua Nginx).
- **Domain**: `tuvi.demowebest.site` (Cloudflare Flexible SSL).
- **Volumes**:
  - `./data:/app/data` — SQLite DB persist
  - `./public:/app/public` — Frontend files (hot-reload)
  - `./server/tuvi-cli.js:/app/server/tuvi-cli.js` — CLI tool

## §2 Tech Stack (Chính xác — KHÔNG ĐỔI trừ khi được phê duyệt)
- **Backend**: Express.js 4.21 trên Node.js 20 Alpine
- **Database**: SQLite (better-sqlite3) — file `data/tuvi.db`
- **Frontend**: Vanilla HTML + JavaScript + CSS — KHÔNG có React/Next.js/Vue
- **AI**: Google Gemini API (gemini-2.0-flash-exp), prompt file tại `server/prompts/`
- **Auth**: In-memory Bearer token (crypto.randomBytes), TTL 30 phút
- Libs: helmet, express-rate-limit, cors, dotenv, seedrandom

## §3 Security & Production Safety
- **CẤM**: `docker compose down -v` trên Production.
- **CẤM**: Deploy thủ công (PHẢI dùng workflow `/deploy-production`).
- **Xác nhận**: Yêu cầu xác nhận trước khi Deep Clean, Deploy Prod, hoặc Delete Data.
- **Rate Limiting**:
  - API chung: 30 req/phút
  - AI endpoint: 5 req/phút
- **Auth bypass**: Localhost & `SKIP_AUTH=true` tự động skip auth.

## §4 Code Standards & ENV
- **CẤM hard-code**: URLs, API keys, Tokens, Credentials, Default Text.
- **ENV**: Tất cả sensitive vars trong `.env`. Document trong `.env.example`.
- **Validate**:
  - Critical (`GEMINI_API_KEY`, `AUTH_USERNAME`, `AUTH_PASSWORD`): `throw new Error()`.
  - Optional (`GEMINI_MODEL`): `console.warn()`.
- **Prefix convention**: Dự án này KHÔNG dùng `NEXT_PUBLIC_*` (không có Next.js).

## §5 Domain Accuracy (ĐẶC BIỆT QUAN TRỌNG)
- Mọi thay đổi logic Tử Vi **PHẢI** cross-check với tài liệu chuẩn:
  - `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md` — baseline test data
  - `ASTROLOGY_METHODOLOGY.md` — methodology reference
- Sử dụng skills domain-specific: `speckit.domain.ziwei.*`, `speckit.domain.calendar`
- Khi sửa an sao → PHẢI chạy test workflow `/test-tuvi` để verify.

## §6 Workflow & Scripting
- **Tự động hóa**: Tạo script khi gặp lỗi hoặc task lặp lại.
- **Git**: Lưu script vào `.agent/scripts/`, commit vào VCS.
- **Update**: Cập nhật workflow tương ứng sau khi tạo script mới.
- **Deploy**: Dùng `.agent/scripts/deploy.ps1` hoặc workflow `/deploy-production`.
