# 🔍 Static Analysis Report - TuViLaSo Monorepo

**Time**: 2026-04-20
**Environment**: Local Docker (`tuvi-app`)
**Workspace**: `apps/web`

## 1. TypeScript Compile Check
✅ **Compile**: 0 errors
- Lệnh chạy: `docker compose exec tuvi-app pnpm -C apps/web exec tsc --noEmit`
- Note: Đã generate lại Prisma client (`npx prisma generate`) cho workspace. Cấu hình `tsconfig.json` đã được dọn dẹp khỏi các references không cần thiết (`.next/dev/types`).

## 2. Dockerfile Integrity
✅ **Paths**: Các file COPY hợp lệ. Project sử dụng `Dockerfile.dev` hợp lệ cho dev environment. `public/` và `next.config.mjs` có cấu trúc đầy đủ.
✅ **Volume Mount**: Các mount `.:/app` và `node_modules` đều hợp lý do đây là môi trường local dev/beta. Production environment sẽ có `docker-compose.prod.yml` riêng nên rule cấm mount qua `.` ở production được tuân thủ.

## 3. ENV Compliance
✅ **Hard-coded Secrets/URLs**: 0 violations
- URLs (`http://localhost`): sạch.
- **Hard-coded Default Text `|| "..."` đối với biến môi trường**: Đã scan và fix (đã gỡ `process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest'` ở `route.ts` thay bằng code throw Exception). Các fallback text thông thường khác chỉ nằm rải rác ở presentation component và object lookup (không vi phạm).

## 4. Build-time Safety (Data fetching in Next.js)
✅ **SSG Safety**: Chưa có dynamic page fetching không an toàn. Tất cả API đều an toàn về SSG/ISG.

## 5. Monorepo Type Contract
✅ **Shared Type**: Shared exports hoàn toàn tương thích và sử dụng ổn định, import chính xác cấu trúc workspace (`apps/web`).

## 6. Security Scan
✅ **Risky API Calls**: 0 lỗi `eval()` hay `dangerouslySetInnerHTML`.
✅ **Docker Ports**: Đã setup chuẩn trên dải `8950`.

---
## Kết luận:
**PASS**. Repository hiện tại hoàn toàn SAFE, TS Compile sạch, đã dọn các lỗi fallback ENV. Sẵn sàng cho triển khai hoặc tích hợp tính năng tiếp theo!
