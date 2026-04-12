# tu-vi-la-so — Agent Instructions

Dự án: tu-vi-la-so
Tech: Express.js + Vanilla JS + SQLite + Google Gemini AI

## 1. PHÁP LỆNH TỐI CAO
- Tuân thủ nghiêm ngặt file `.agent/memory/constitution.md`.
- Docker-First: Mọi hoạt động code và chạy app phải diễn ra trong container. KHÔNG chạy node/python trên host.
- Ports: **8950** (local), **8900** (production). Tuân thủ lấy port từ biến môi trường (.env).
- **KHÔNG có Next.js/React/Vue** — Frontend là Vanilla HTML/JS/CSS.

## 2. WB-AGENT PROTOCOL
- Mọi task phải đi qua quy trình: Specify → Plan → Tasks → Implement.
- Sử dụng Workflows trong `.agent/workflows/` và Skills trong `.agent/skills/`.

## 3. NGÔN NGỮ & CODE
- Phản hồi developer hoàn toàn bằng Tiếng Việt.
- 15-Minute Rule: Mỗi task phải atomic, ≤ 15 phút, ảnh hưởng ≤ 3 files.
- PowerShell 5.1+, ngăn cách lệnh bằng dấu `;` (KHÔNG dùng `&&`).
- KHÔNG hard-code URLs, Tokens, Keys. Dùng ENV vars (`.env`).

## 4. AN TOÀN
- KHÔNG chạy `docker compose down -v` trên Production.
- Tạo script tự động (`.agent/scripts/`) cho lỗi lặp lại.
- Kiểm tra logs ngay khi lỗi: `docker compose logs -f tuvi-app`.

## 5. AGENTIC MODE SYNC (Antigravity Only)
- **Task Tracking**: Sử dụng `task_boundary` để đồng bộ trạng thái với `@speckit.tasks` (tasks.md).
- **Planning Artifacts**: Luôn tạo `implementation_plan.md` khi thực hiện các thay đổi lớn (atomic > 3 files).
- **Verification**: Sau khi hoàn thành task, sử dụng `walkthrough.md` để đối chiếu kết quả với `spec.md`.


## Build & Test
- Build: `docker compose build`
- Run: `docker compose up -d`
- Logs: `docker compose logs -f tuvi-app`
- Stop: `docker compose down`
- Test Tử Vi: Chạy workflow `/test-tuvi`
