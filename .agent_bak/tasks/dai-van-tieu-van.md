---
title: "Diễn Giải Đại Vận & Tiểu Vận"
status: pending
priority: high
created: 2026-02-10
---

# Task: Diễn Giải Đại Vận & Tiểu Vận

## 1. BỐI CẢNH & MỤC TIÊU

### Hiện trạng

- Hệ thống hiện tại đã có đầy đủ:
  - **Tính toán cơ bản**: Mệnh, Thân, Cục, 12 Cung, Tràng Sinh, Tuần Triệt (`tu-vi-calc.js`)
  - **An sao**: 14 Chính Tinh + ~60 Phụ Tinh + Tứ Hoá (`tu-vi-sao.js`)
  - **Diễn giải tĩnh**: Phân tích từng cung với rating + chính tinh + phụ tinh (`tu-vi-interpret.js`)
  - **AI phân tích**: Gemini AI tổng hợp chuyên sâu (`server/gemini.js`)
  - **Lưu niên**: Có trường "Năm Xem" nhưng chỉ dùng cho Thái Tuế, chưa có Đại Vận/Tiểu Vận
- **CHƯA CÓ**: Tính toán Đại Vận, Tiểu Vận, Lưu Niên chi tiết, và diễn giải vận hạn theo thời gian

### Mục tiêu

Thêm hệ thống **Đại Vận** (10 năm) và **Tiểu Vận** (1 năm) hoàn chỉnh, bao gồm:

1. Tính toán chính xác cung khởi và thứ tự Đại Vận / Tiểu Vận
2. An sao lưu niên (Lưu Thái Tuế, Lưu Thiên Mã, Lưu Tứ Hoá...)
3. Render timeline Đại Vận trực quan (dạng bảng/timeline)
4. Diễn giải chi tiết cung Đại Vận + Tiểu Vận hiện tại
5. Tích hợp vào AI prompt để Gemini phân tích vận hạn

---

## 2. LÝ THUYẾT TỬ VI - ĐẠI VẬN & TIỂU VẬN

### 2.1 Đại Vận (大運) - Vận hạn 10 năm

**Quy tắc cốt lõi:**

- Đại Vận khởi từ **cung Mệnh**, mỗi Đại Vận kéo dài **10 năm** (= giá trị Cục)
- Đại Vận **bắt đầu chạy** từ tuổi = giá trị Cục:
  - Thuỷ nhị cục (2): bắt đầu từ tuổi 2
  - Mộc tam cục (3): bắt đầu từ tuổi 3
  - Kim tứ cục (4): bắt đầu từ tuổi 4
  - Thổ ngũ cục (5): bắt đầu từ tuổi 5
  - Hoả lục cục (6): bắt đầu từ tuổi 6
- **Chiều di chuyển**:
  - Dương Nam / Âm Nữ (thuận): đi **thuận** chiều kim đồng hồ (Mệnh → Phụ Mẫu → Phúc Đức → ...)
  - Âm Nam / Dương Nữ (nghịch): đi **nghịch** (Mệnh → Huynh Đệ → Phu Thê → ...)
- Mỗi Đại Vận rơi vào **1 cung trong lá số**, mang theo ý nghĩa của cung đó + các sao đóng trong cung

**Công thức:**

```
tuoiBatDau = cucValue  // VD: Kim tứ cục → tuổi 4
khoangCach = 10        // Mỗi đại vận 10 năm

Đại Vận thứ i (i=0,1,2,...11):
  - Tuổi: tuoiBatDau + i*10  →  tuoiBatDau + (i+1)*10 - 1
  - Năm: namSinh + tuoiBatDau + i*10 - 1  →  namSinh + tuoiBatDau + (i+1)*10 - 2
  - Cung: 
    + Thuận: (cungMenhPos + i) % 12       // theo chiều cung (Mệnh→Phụ Mẫu→Phúc Đức)
    + Nghịch: (cungMenhPos - i + 12) % 12 // ngược lại
```

**LƯU Ý QUAN TRỌNG VỀ CHIỀU ĐI:**

- Chiều đi Đại Vận là theo thứ tự **CÁC CUNG** (Mệnh → Phụ Mẫu → Phúc Đức...), KHÔNG phải theo Địa Chi
- Thuận: Mệnh → Phụ Mẫu → Phúc Đức → Điền Trạch → Quan Lộc → Nô Bộc → Thiên Di → Tật Ách → Tài Bạch → Tử Tức → Phu Thê → Huynh Đệ
- Nghịch: Mệnh → Huynh Đệ → Phu Thê → Tử Tức → Tài Bạch → Tật Ách → Thiên Di → Nô Bộc → Quan Lộc → Điền Trạch → Phúc Đức → Phụ Mẫu

### 2.2 Tiểu Vận (小運) - Vận hạn 1 năm

**Quy tắc:**

- Tiểu Vận xác định cung ảnh hưởng trong **1 năm cụ thể**
- Khởi từ cung theo **chi năm sinh**:
  - Nam khởi cung Dần (index 2) tại tuổi 1
  - Nữ khởi cung Thân (index 8) tại tuổi 1
- **Chiều di chuyển**:
  - Dương Nam / Âm Nữ: thuận (tăng index)
  - Âm Nam / Dương Nữ: nghịch (giảm index)

**Công thức:**

```
tuoi = namXem - namSinhAL + 1  // Tuổi mụ

Nếu gioiTinh === 'nam':
  khoi = 2  // Dần
Nếu gioiTinh === 'nu':
  khoi = 8  // Thân

Nếu thuận:
  cungTieuVan = (khoi + tuoi - 1) % 12
Nếu nghịch:
  cungTieuVan = ((khoi - tuoi + 1) % 12 + 12) % 12
```

### 2.3 Sao Lưu Niên (流年星)

Các sao cần an cho năm xem (dựa trên **Can Chi năm xem**, KHÔNG phải năm sinh):

| Sao | Cách tính | Dựa vào |
|-----|-----------|---------|
| Lưu Thái Tuế | = Chi năm xem | Chi năm xem |
| Lưu Thiên Mã | Theo bảng Thiên Mã | Chi năm xem |
| Lưu Lộc Tồn | Theo bảng Lộc Tồn | Can năm xem |
| Lưu Kình Dương | Lộc Tồn + 1 | Can năm xem |
| Lưu Đà La | Lộc Tồn - 1 | Can năm xem |
| Lưu Tứ Hoá | Theo bảng Tứ Hoá | Can năm xem |
| Lưu Văn Xương | Theo bảng Văn Xương | Chi năm xem (thay giờ bằng chi năm) |
| Lưu Văn Khúc | Theo bảng Văn Khúc | Chi năm xem |
| Lưu Thiên Khôi | Theo bảng Khôi | Can năm xem |
| Lưu Thiên Việt | Theo bảng Việt | Can năm xem |

---

## 3. KẾ HOẠCH TRIỂN KHAI

### Phase 1: Tính toán Đại Vận & Tiểu Vận (`tu-vi-calc.js`)

**File sửa:** `public/tu-vi-calc.js`

**Thêm functions:**

```javascript
// 1. Tính Đại Vận
function tinhDaiVan(cucValue, cungMenhPos, thuan, namSinhAL) {
    // Return array 12 Đại Vận: [{ index, cungPos, tuoiFrom, tuoiTo, namFrom, namTo }]
}

// 2. Tính Tiểu Vận  
function tinhTieuVan(gioiTinh, thuan, namSinhAL, namXem) {
    // Return { cungPos, tuoi }
}

// 3. Xác định Đại Vận hiện tại theo năm xem
function getDaiVanHienTai(daiVanList, namXem, namSinhAL) {
    // Return Đại Vận object đang active
}
```

**Cập nhật `calculate()`:**

- Thêm `daiVan`, `tieuVan`, `daiVanHienTai` vào kết quả trả về

**Export thêm:** `tinhDaiVan`, `tinhTieuVan`, `getDaiVanHienTai`

---

### Phase 2: An sao Lưu Niên (`tu-vi-sao.js`)

**File sửa:** `public/tu-vi-sao.js`

**Thêm functions:**

```javascript
// An sao lưu niên theo Can Chi năm xem
function anSaoLuuNien(canNamXem, chiNamXem) {
    // Return { 'Lưu Thái Tuế': pos, 'Lưu Thiên Mã': pos, ... }
}

// An Lưu Tứ Hoá (Tứ Hoá theo Can năm xem, KHÔNG phải năm sinh)
function anLuuTuHoa(canNamXem) {
    // Dùng lại bảng anTuHoa() nhưng với can năm xem
    // Return { 'Lưu Hoá Lộc': saoName, ... }
}
```

**Cập nhật `anSao()`:**

- Nhận thêm param `canChiNamXem` từ `lasoData`
- Gọi `anSaoLuuNien()` và add sao lưu niên vào `saoMap` với type `'luu'`
- Store `luuTuHoa` vào `lasoData`

---

### Phase 3: Render Đại Vận Timeline (`tu-vi-render.js` + `styles.css`)

**File sửa:** `public/tu-vi-render.js`

**Thêm function:**

```javascript
// Render bảng Đại Vận 
function renderDaiVanTimeline(lasoData) {
    // Render table/timeline hiển thị:
    // - 12 hàng Đại Vận (tuổi từ-đến, năm từ-đến)
    // - Highlight Đại Vận hiện tại
    // - Tên cung + các sao chính trong cung Đại Vận
    // - Tiểu Vận hiện tại
}
```

**Cập nhật `render()`:**

- Thêm section Đại Vận Timeline sau lá số 4x4

**File sửa:** `public/styles.css`

- Thêm styles cho `.dai-van-timeline`, `.dai-van-row`, `.dai-van-active`, `.tieu-van-badge`

---

### Phase 4: Diễn giải Đại Vận & Tiểu Vận (`tu-vi-interpret.js`)

**File sửa:** `public/tu-vi-interpret.js`

**Thêm functions:**

```javascript
// Phân tích cung Đại Vận hiện tại
function analyzeDaiVan(daiVanHienTai, lasoData) {
    // Lấy sao trong cung Đại Vận
    // So sánh với cung gốc (Mệnh, Tài Bạch...)
    // Kiểm tra Lưu Tứ Hoá va chạm
    // Return { cungName, saoList, rating, analysis }
}

// Phân tích Tiểu Vận
function analyzeTieuVan(tieuVan, lasoData) {
    // Tương tự analyzeDaiVan nhưng cho Tiểu Vận
}

// Tổng hợp vận hạn năm xem
function analyzeVanHan(lasoData) {
    // Kết hợp Đại Vận + Tiểu Vận + Lưu Niên → đánh giá tổng thể năm
    // Return { daiVan, tieuVan, luuNien, tongQuat, rating }
}
```

**Cập nhật `interpret()`:**

- Thêm `vanHan` vào kết quả interpretation

**Cập nhật `renderInterpretation()`:**

- Thêm card "Vận Hạn Năm [namXem]" với:
  - Đại Vận đang chạy (cung nào, sao gì)
  - Tiểu Vận năm nay (cung nào)
  - Các sao Lưu Niên quan trọng
  - Đánh giá tổng thể + lời khuyên

---

### Phase 5: Tích hợp AI Gemini (`server/gemini.js`)

**File sửa:** `server/gemini.js`

**Cập nhật `buildPrompt()`:**

- Thêm section "VẬN HẠN NĂM XEM" vào prompt:

```
## VẬN HẠN NĂM [namXem]:
- Đại Vận: Cung [tên cung] (tuổi X-Y), các sao: [...]
- Tiểu Vận: Cung [tên cung]
- Sao Lưu Niên: Lưu Thái Tuế tại [cung], Lưu Tứ Hoá: [...]
```

**Cập nhật `parseAiResponse()`:**

- Thêm section "Vận Hạn Năm" vào titles/icons

**Cập nhật prompt yêu cầu:**

- Thêm mục "8. VẬN HẠN NĂM [namXem]" yêu cầu AI phân tích:
  - Đại Vận hiện tại ảnh hưởng gì
  - Tiểu Vận năm nay ra sao
  - Sao Lưu Niên tác động thế nào
  - Tháng nào cần lưu ý

**Cập nhật `createCacheKey()`:**

- Thêm thông tin Đại Vận/Tiểu Vận vào cache key (vì khác năm xem → khác kết quả)

---

### Phase 6 (Optional): Database diễn giải vận hạn

**File sửa:** `server/db.js`

**Thêm table:**

```sql
CREATE TABLE IF NOT EXISTS van_han_interpret (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    condition_key TEXT UNIQUE NOT NULL,  -- VD: 'dai_van_menh', 'dai_van_tai_bach'
    title TEXT,
    icon TEXT DEFAULT '🔮',
    description TEXT,
    advice TEXT
);
```

**Seed data:**

- Diễn giải cho Đại Vận đi qua từng cung (12 entries)
- Diễn giải cho Tiểu Vận đi qua từng cung (12 entries)
- Diễn giải khi Lưu Tứ Hoá rơi vào cung quan trọng

---

## 4. THỨ TỰ TRIỂN KHAI (ưu tiên)

| # | Phase | File chính | Độ phức tạp | Phụ thuộc |
|---|-------|-----------|-------------|-----------|
| 1 | Tính toán Đại Vận & Tiểu Vận | `tu-vi-calc.js` | ⭐⭐ | Không |
| 2 | An sao Lưu Niên | `tu-vi-sao.js` | ⭐⭐ | Phase 1 |
| 3 | Render Timeline | `tu-vi-render.js`, `styles.css` | ⭐⭐⭐ | Phase 1 |
| 4 | Diễn giải vận hạn | `tu-vi-interpret.js` | ⭐⭐⭐ | Phase 1, 2 |
| 5 | AI Gemini tích hợp | `server/gemini.js` | ⭐⭐ | Phase 4 |
| 6 | DB diễn giải (optional) | `server/db.js` | ⭐ | Không |

---

## 5. FILE MAP (Tất cả files cần sửa)

```
public/
├── tu-vi-calc.js       ← Phase 1: Thêm tinhDaiVan(), tinhTieuVan()
├── tu-vi-sao.js        ← Phase 2: Thêm anSaoLuuNien(), cập nhật anSao()
├── tu-vi-render.js     ← Phase 3: Thêm renderDaiVanTimeline()
├── tu-vi-interpret.js  ← Phase 4: Thêm analyzeDaiVan(), analyzeVanHan()
├── styles.css          ← Phase 3: Thêm CSS cho Đại Vận timeline
├── app.js              ← Cập nhật generateChart() để truyền data mới
└── index.html          ← Không cần sửa (render động bằng JS)

server/
├── gemini.js           ← Phase 5: Cập nhật prompt + parser
└── db.js               ← Phase 6 (optional): Thêm table van_han_interpret
```

---

## 6. ACCEPTANCE CRITERIA

### Must-have

- [ ] Tính đúng 12 Đại Vận (cung + khoảng tuổi) theo Cục và thuận/nghịch
- [ ] Tính đúng Tiểu Vận theo năm xem
- [ ] Highlight Đại Vận đang chạy trong timeline
- [ ] Hiển thị sao chính trong cung Đại Vận / Tiểu Vận
- [ ] Diễn giải card "Vận Hạn" trong phần Diễn Giải Lá Số
- [ ] Khi đổi "Năm Xem" → Đại Vận/Tiểu Vận cập nhật đúng

### Nice-to-have

- [ ] An sao Lưu Niên (Lưu Thái Tuế, Lưu Tứ Hoá...)
- [ ] AI Gemini phân tích vận hạn chi tiết
- [ ] DB lưu diễn giải chuẩn cho từng cung Đại Vận
- [ ] Animation khi click vào Đại Vận trên timeline
- [ ] Mobile responsive cho timeline

---

## 7. TEST CASES

### Case 1: Nam, Giáp Tý (2024), Kim tứ cục, Dương Nam (thuận)

- Đại Vận 1: Cung Mệnh, tuổi 4-13
- Đại Vận 2: Cung Phụ Mẫu, tuổi 14-23 (thuận = đi về Phụ Mẫu)
- Tiểu Vận tuổi 3 (năm 2026): tính theo công thức

### Case 2: Nữ, Ất Sửu (2025), nghịch

- Đại Vận đi nghịch: Mệnh → Huynh Đệ → Phu Thê...
- Tiểu Vận khởi từ Thân (index 8)

### Verify bằng

- So sánh với website tử vi uy tín (tuvi.cohoc.vn, xemtuvi.mobi)
- Check ít nhất 3 lá số khác nhau (nam thuận, nữ thuận, nam nghịch)
