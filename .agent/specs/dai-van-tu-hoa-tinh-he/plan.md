---
title: Technical Plan - Đại Vận Tứ Hóa & Lục Thập Tinh Hệ
status: APPROVED
version: 1.0.0
created: 2026-02-25
---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Browser (Client)                    │
│ ┌──────────────────────────────────────────────────┐ │
│ │ tu-vi-calc.js     — Thêm: tinhCanCung()          │ │
│ │ tu-vi-sao.js      — Thêm: anDaiVanTuHoa()        │ │
│ │ tu-vi-tinh-he.js  — MỚI: 60 tinh hệ data + API   │ │
│ │ tu-vi-luu-nien.js — Thêm: analyzeDaiVanTuHoa()    │ │
│ │ tu-vi-render.js   — Thêm: UI sections             │ │
│ │ tu-vi-event-scanner.js — Thêm: DV Tứ Hóa bonus    │ │
│ └──────────────────────────────────────────────────┘ │
│                         │                            │
│              HTTP/Fetch API                          │
│                         ▼                            │
│ ┌──────────────────────────────────────────────────┐ │
│ │ server/gemini.js — Thêm: daiVanTuHoa + tinhHe    │ │
│ │                    vào buildCompactData()          │ │
│ └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Nguyên tắc thiết kế

1. **Additive only**: Chỉ THÊM code/module mới, KHÔNG sửa logic an sao hiện tại
2. **Backward compatible**: Mọi function mới trả null/[] nếu data chưa sẵn sàng
3. **Reuse hàm có sẵn**: `anTuHoa()` đã có → gọi lại với Can cung Đại Vận

## 2. Data Model

### 2.1. Đại Vận Tứ Hóa (ĐV TH)

```javascript
// Output structure khi tính Đại Vận Tứ Hóa
{
  canDaiVan: 'Giáp',                    // Thiên Can cung Đại Vận
  tuHoa: {
    'Hoá Lộc': 'Liêm Trinh',           // Tên sao được Hóa
    'Hoá Quyền': 'Phá Quân',
    'Hoá Khoa': 'Vũ Khúc',
    'Hoá Kỵ': 'Thái Dương'
  },
  hoaKyCung: 5,                         // Vị trí cung mà Đại Vận Hóa Kỵ rơi vào
  hoaKyCungName: 'TẬT ÁCH',            // Tên cung đó
  hoaLocCung: 8,                         // Vị trí cung Đại Vận Hóa Lộc
  hoaLocCungName: 'PHU THÊ'
}
```

### 2.2. Tính Can Cung (Ngũ Hổ Độn)

Quy tắc: Từ Thiên Can năm sinh, xác định Can cung Dần, rồi đếm thuận đến cung cần tính.

```javascript
// Bảng Can cung Dần theo Can năm
const CAN_CUNG_DAN = {
  0: 2, // Giáp, Kỷ → Bính Dần (Can index 2)
  1: 4, // Ất, Canh → Mậu Dần (Can index 4)
  2: 6, // Bính, Tân → Canh Dần (Can index 6)
  3: 8, // Đinh, Nhâm → Nhâm Dần (Can index 8)
  4: 0  // Mậu, Quý → Giáp Dần (Can index 0)
};

function tinhCanCung(canNam, cungPos) {
  const canDanIndex = CAN_CUNG_DAN[canNam % 5];
  // Từ Dần (2) đến cungPos, đếm thuận
  const offset = ((cungPos - 2) % 12 + 12) % 12;
  return (canDanIndex + offset) % 10;
}
```

### 2.3. Lục Thập Tinh Hệ Data

```javascript
// Cấu trúc 1 tinh hệ
{
  id: 'tu-pha',
  name: 'Tử Phá',
  stars: ['Tử Vi', 'Phá Quân'],
  palaces: ['Mão', 'Dậu'],         // Cung có thể xuất hiện (cùng cung)
  archetype: 'Tiên phá hậu thành',
  
  // Luận giải chung
  profile: 'Tính cách quyết đoán, dám phá vỡ khuôn mẫu...',
  strengths: ['Gan dạ', 'Đổi mới', 'Lãnh đạo'],
  weaknesses: ['Bốc đồng', 'Khó hòa hợp'],
  
  // Luận giải theo cung (nếu có)
  byPalace: {
    'MỆNH': 'Con người phá cách, tiên phong...',
    'QUAN LỘC': 'Sự nghiệp nhiều biến động nhưng đột phá...',
    'PHU THÊ': 'Hôn nhân sóng gió đầu, ổn sau...'
  }
}
```

### 2.4. Danh sách 20 Tinh Hệ v1.0

| # | ID | Tên | Sao | Cung | Độ phổ biến |
|---|-----|------|------|------|------------|
| 1 | tu-phu | Tử Phủ | Tử Vi + Thiên Phủ | Dần, Thân | ⭐⭐⭐⭐⭐ |
| 2 | tu-pha | Tử Phá | Tử Vi + Phá Quân | Mão, Dậu | ⭐⭐⭐⭐ |
| 3 | tu-sat | Tử Sát | Tử Vi + Thất Sát | Tỵ, Hợi | ⭐⭐⭐⭐ |
| 4 | tu-tham | Tử Tham | Tử Vi + Tham Lang | Mão, Dậu (xung) | ⭐⭐⭐ |
| 5 | co-luong | Cơ Lương | Thiên Cơ + Thiên Lương | Thìn, Tuất | ⭐⭐⭐⭐ |
| 6 | co-cu | Cơ Cự | Thiên Cơ + Cự Môn | Mão, Dậu | ⭐⭐⭐ |
| 7 | co-am | Cơ Âm | Thiên Cơ + Thái Âm | Dần, Thân | ⭐⭐⭐ |
| 8 | nhat-nguyet | Nhật Nguyệt | Thái Dương + Thái Âm | Sửu, Mùi | ⭐⭐⭐⭐⭐ |
| 9 | vu-tuong | Vũ Tướng | Vũ Khúc + Thiên Tướng | Dần, Thân | ⭐⭐⭐ |
| 10 | vu-sat | Vũ Sát | Vũ Khúc + Thất Sát | Mão, Dậu | ⭐⭐⭐ |
| 11 | vu-tham | Vũ Tham | Vũ Khúc + Tham Lang | Sửu, Mùi | ⭐⭐⭐⭐ |
| 12 | vu-pha | Vũ Phá | Vũ Khúc + Phá Quân | Tỵ, Hợi | ⭐⭐⭐ |
| 13 | dong-luong | Đồng Lương | Thiên Đồng + Thiên Lương | Dần, Thân | ⭐⭐⭐ |
| 14 | dong-am | Đồng Âm | Thiên Đồng + Thái Âm | Tý, Ngọ | ⭐⭐⭐ |
| 15 | dong-cu | Đồng Cự | Thiên Đồng + Cự Môn | Mão, Dậu | ⭐⭐⭐ |
| 16 | liem-tham | Liêm Tham | Liêm Trinh + Tham Lang | Tỵ, Hợi | ⭐⭐⭐⭐ |
| 17 | liem-sat | Liêm Sát | Liêm Trinh + Thất Sát | Sửu, Mùi | ⭐⭐⭐ |
| 18 | liem-pha | Liêm Phá | Liêm Trinh + Phá Quân | Mão, Dậu | ⭐⭐⭐ |
| 19 | sat-pha | Sát Phá | Thất Sát + Phá Quân | Tỵ, Hợi (xung) | ⭐⭐⭐ |
| 20 | cu-nhat | Cự Nhật | Cự Môn + Thái Dương | Dần, Thân | ⭐⭐⭐⭐ |

## 3. Files Affected

### New Files (2)

| File | Purpose | ~Size |
|------|---------|-------|
| `public/tu-vi-dai-van-hoa.js` | Tính Đại Vận Tứ Hóa + Can cung | ~150 lines |
| `public/tu-vi-tinh-he.js` | Data 20 tinh hệ + getTinhHe() | ~600 lines |

### Modified Files (5)

| File | Changes | Impact |
|------|---------|--------|
| `public/tu-vi-calc.js` | Export thêm `tinhCanCung()` vào TuViCalc | Low |
| `public/tu-vi-luu-nien.js` | Thêm `analyzeDaiVanTuHoa()` | Low |
| `public/tu-vi-event-scanner.js` | Thêm DV Hóa Kỵ bonus vào `evaluateRule()` | Low |
| `public/tu-vi-render.js` | Thêm UI section cho DV Tứ Hóa + Tinh Hệ | Medium |
| `server/gemini.js` | Thêm `daiVanTuHoa` + `tinhHeMenh` vào `buildCompactData()` | Low |
| `public/index.html` | Thêm `<script>` tags cho 2 file mới | Low |

## 4. API Contracts

### Không thêm API mới

Tất cả logic tính toán chạy client-side (giống kiến trúc hiện tại). Chỉ bổ sung data vào compact data trước khi gửi Gemini.

### Data flow

```
1. User input → TuViCalc.calculate() [hiện có]
2. → TuViSao.anSao() [hiện có]
3. → TuViDaiVanHoa.calculate(daiVan, canNam, saoMap) [MỚI]
4. → TuViTinhHe.getTinhHe(cungPos, saoMap) [MỚI]
5. → TuViLuuNien.analyzeFull() [cập nhật thêm DV Tứ Hóa]
6. → TuViEventScanner.scan() [cập nhật thêm DV Hóa Kỵ bonus]
7. → Gemini AI buildCompactData() [cập nhật thêm 2 fields]
```

## 5. Constitution Compliance Check

| Rule | Status | Note |
|------|--------|------|
| §1 Docker-First | ✅ | Không đổi infrastructure |
| §1 Port 8950 | ✅ | Không đổi port |
| §2 Security | ✅ | Không sensitive data |
| §3 No hard-code | ✅ | Không có URLs/keys mới |
| §3 ENV | ✅ | Không cần ENV mới |
| Trường phái | ✅ | Tam Hợp + Trung Châu, KHÔNG Phi Hóa |

## 6. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Tính Can cung sai | Low | High | Test với 3+ cases đã verified bằng tay |
| Tinh hệ data sai | Medium | Medium | So sánh với sách Vương Đình Chi |
| UI clutter | Low | Medium | Collapsible sections, mặc định thu gọn |
| Performance | Very Low | Low | Chỉ tra bảng, ~1ms |
