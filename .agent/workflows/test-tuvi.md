---
description: Chạy test Tử Vi full analysis với data chuẩn Nguyễn Đức Toàn, output ra JSON + Markdown
---

# Test Tử Vi Full Analysis

## Thông tin test data

| Trường | Giá trị |
|---|---|
| Họ tên | Nguyễn Đức Toàn |
| Ngày sinh DL | 28/01/1991 |
| Giờ sinh | Ngọ (11h-13h) - index 6 |
| Giới tính | Nam |
| Năm xem | 2026 |
| Mệnh | Lộ Bàng Thổ |
| Cục | Thổ ngũ cục (5) |
| Cung Mệnh | Mùi (index 7) |
| Thuận/Nghịch | THUẬN |

## Data chuẩn để verify

- File gốc: `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md`
- 14 Chính tinh verified ✓
- Tứ Hóa gốc (Can Canh) + Lưu Tứ Hóa (Can Bính) verified ✓
- Đại Vận hiện tại: Tuất (ĐIỀN TRẠCH) 35-44 tuổi ✓
- Tiểu Vận 2026: Dần (TẬT ÁCH) ✓

## Các bước chạy test

### 1. Copy test script vào container

// turbo

```
docker cp .agent/scripts/test-tuvi-full.js tuvi-la-so:/app/test-tuvi-full.js
```

### 2. Chạy test trong Docker

// turbo

```
docker exec -w /app tuvi-la-so node test-tuvi-full.js
```

### 3. Copy kết quả ra local

// turbo

```
docker cp tuvi-la-so:/app/data/test-output.json data/test-output.json; docker cp tuvi-la-so:/app/data/test-output.md data/test-output.md
```

### 4. Mở file kết quả

Sau khi chạy xong, kiểm tra 2 file:

- `data/test-output.json` — Data thô JSON đầy đủ
- `data/test-output.md` — Báo cáo Markdown dễ đọc

## Output bao gồm

| Module | Nội dung |
|---|---|
| P1 | Sao Lưu Niên (Tang Môn, Bạch Hổ, Điếu Khách, Hồng Loan, Đào Hoa, Thiên Hỷ, Hoả Tinh, Linh Tinh) |
| P2 | Lưu Tứ Hóa luận giải theo từng cung |
| P3 | Trigger Logic - Hung tinh chồng overlay (severity + multiplier) |
| P4 | Lưu Thái Tuế tương tác (Đại Vận, Tiểu Vận conflicts) |
| P5 | Nguyệt Hạn 12 tháng (energy 0-100, level, Hóa Lộc/Kỵ flags) |
| P6 | Energy Score Dashboard (Tài chính, Sức khỏe, Tình cảm, Overall) |
| Events | Event Scanner + 31 rules (RS, H, RC, C + EXTRA) |
| Patterns | Star Patterns detection |

## Troubleshooting

- Nếu lỗi `Cannot find module`: Kiểm tra container `tuvi-la-so` đang chạy (`docker ps`)
- Nếu module undefined: Copy lại source files vào container trước khi test
- Nếu cần rebuild: `docker compose up -d --build` tại `d:\Project\tu-vi-la-so`
