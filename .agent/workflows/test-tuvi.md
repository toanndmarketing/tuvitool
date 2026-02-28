---
description: Chạy test Tử Vi full analysis với data chuẩn Nguyễn Đức Toàn, output ra JSON + Markdown
---

# 🧪 Workflow Test Luận Giải Tử Vi

Workflow này giúp kiểm tra tính ổn định và chất lượng luận giải của AI sau khi nâng cấp Prompt.

## Các bước thực hiện

1. **Chuẩn bị file test**: Đảm bảo file `server/test-tuvi-toan.js` tồn tại với data mẫu của đương số Nguyễn Đức Toàn.
// turbo
2. **Rebuild Container**: Đồng bộ code mới vào Docker container.

   ```powershell
   docker compose build tuvi-app; docker compose up -d
   ```

// turbo
3. **Chạy Test**: Thực thi script test trong môi trường Docker.

   ```powershell
   docker compose exec tuvi-app node server/test-tuvi-toan.js
   ```

4. **Kiểm tra kết quả**: AI phải trả về bản luận giải có đủ các phần:
   - Nhân dạng (Nốt ruồi, vết sẹo).
   - Âm phần, mộ phần (Cung Phúc Đức).
   - Tai nạn đích danh (Cung Tật ÁCH).
   - Vận hạn 12 tháng năm 2026.

## Kết quả lưu trữ

Kết quả sau khi chạy được lưu tại: `server/test_output_nguyen_duc_toan.md` trong container (và máy host nếu có mount volume).
