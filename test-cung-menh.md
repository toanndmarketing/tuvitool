# KIỂM TRA QUY TẮC TÍNH CUNG MỆNH VÀ CUNG THÂN

## Quy tắc chuẩn từ sách cổ

### Địa Chi (12 cung cố định)

```
Index:  0    1     2     3    4     5    6     7     8     9     10    11
Chi:    Tý   Sửu   Dần   Mão  Thìn  Tỵ   Ngọ   Mùi   Thân  Dậu   Tuất  Hợi
```

### Tháng Âm Lịch mapping

```
Tháng 1  = Dần  (index 2)
Tháng 2  = Mão  (index 3)
Tháng 3  = Thìn (index 4)
Tháng 4  = Tỵ   (index 5)
Tháng 5  = Ngọ  (index 6)
Tháng 6  = Mùi  (index 7)
Tháng 7  = Thân (index 8)
Tháng 8  = Dậu  (index 9)
Tháng 9  = Tuất (index 10)
Tháng 10 = Hợi  (index 11)
Tháng 11 = Tý   (index 0)
Tháng 12 = Sửu  (index 1)
```

### Giờ sinh mapping

```
Giờ Tý   = index 0  (23h-01h)
Giờ Sửu  = index 1  (01h-03h)
Giờ Dần  = index 2  (03h-05h)
Giờ Mão  = index 3  (05h-07h)
Giờ Thìn = index 4  (07h-09h)
Giờ Tỵ   = index 5  (09h-11h)
Giờ Ngọ  = index 6  (11h-13h)
Giờ Mùi  = index 7  (13h-15h)
Giờ Thân = index 8  (15h-17h)
Giờ Dậu  = index 9  (17h-19h)
Giờ Tuất = index 10 (19h-21h)
Giờ Hợi  = index 11 (21h-23h)
```

---

## CUNG MỆNH - Quy tắc chuẩn

**Bước 1:** Từ Dần (tháng 1), đếm THUẬN đến tháng sinh
**Bước 2:** Từ cung tháng sinh, đếm NGƯỢC theo giờ sinh (bắt đầu từ giờ Tý = 0)

### Ví dụ 1: Tháng 1, Giờ Tý (0)

- Bước 1: Tháng 1 = Dần (index 2)
- Bước 2: Từ Dần, đếm ngược 0 bước (giờ Tý) = Dần (index 2)
- **Kết quả: Cung Mệnh = Dần (2)**

### Ví dụ 2: Tháng 1, Giờ Mão (3)

- Bước 1: Tháng 1 = Dần (index 2)
- Bước 2: Từ Dần, đếm ngược 3 bước:
  - Bước 0: Dần (2)
  - Bước 1: Sửu (1)
  - Bước 2: Tý (0)
  - Bước 3: Hợi (11)
- **Kết quả: Cung Mệnh = Hợi (11)**

### Ví dụ 3: Tháng 11, Giờ Tý (0)

- Bước 1: Tháng 11 = Tý (index 0)
- Bước 2: Từ Tý, đếm ngược 0 bước = Tý (index 0)
- **Kết quả: Cung Mệnh = Tý (0)**

### Ví dụ 4: Tháng 3, Giờ Ngọ (6)

- Bước 1: Tháng 3 = Thìn (index 4)
- Bước 2: Từ Thìn, đếm ngược 6 bước:
  - Bước 0: Thìn (4)
  - Bước 1: Mão (3)
  - Bước 2: Dần (2)
  - Bước 3: Sửu (1)
  - Bước 4: Tý (0)
  - Bước 5: Hợi (11)
  - Bước 6: Tuất (10)
- **Kết quả: Cung Mệnh = Tuất (10)**

---

## CÔNG THỨC TÍNH

### Cung Mệnh

```javascript
// Tháng AL mapping: tháng 1 = Dần (2), tháng 2 = Mão (3)...
// Công thức: vị trí tháng - giờ
let viTriThang = (thangAL + 1) % 12;  // tháng 1->2, tháng 2->3, ..., tháng 11->0, tháng 12->1
let cungMenh = ((viTriThang - chiGio) % 12 + 12) % 12;
```

### Kiểm tra công thức hiện tại

```javascript
// Code hiện tại:
let pos = ((2 + thangAL - 1 - chiGio) % 12 + 12) % 12;
// = ((thangAL + 1 - chiGio) % 12 + 12) % 12;
```

**✅ CÔNG THỨC ĐÚNG!**

---

## CUNG THÂN - Quy tắc chuẩn

**Bước 1:** Từ Dần (tháng 1), đếm THUẬN đến tháng sinh
**Bước 2:** Từ cung tháng sinh, đếm THUẬN theo giờ sinh (bắt đầu từ giờ Tý = 0)

### Ví dụ 1: Tháng 1, Giờ Tý (0)

- Bước 1: Tháng 1 = Dần (index 2)
- Bước 2: Từ Dần, đếm thuận 0 bước = Dần (index 2)
- **Kết quả: Cung Thân = Dần (2)**

### Ví dụ 2: Tháng 1, Giờ Mão (3)

- Bước 1: Tháng 1 = Dần (index 2)
- Bước 2: Từ Dần, đếm thuận 3 bước:
  - Bước 0: Dần (2)
  - Bước 1: Mão (3)
  - Bước 2: Thìn (4)
  - Bước 3: Tỵ (5)
- **Kết quả: Cung Thân = Tỵ (5)**

### Ví dụ 3: Tháng 11, Giờ Tý (0)

- Bước 1: Tháng 11 = Tý (index 0)
- Bước 2: Từ Tý, đếm thuận 0 bước = Tý (index 0)
- **Kết quả: Cung Thân = Tý (0)**

### Ví dụ 4: Tháng 3, Giờ Ngọ (6)

- Bước 1: Tháng 3 = Thìn (index 4)
- Bước 2: Từ Thìn, đếm thuận 6 bước:
  - Bước 0: Thìn (4)
  - Bước 1: Tỵ (5)
  - Bước 2: Ngọ (6)
  - Bước 3: Mùi (7)
  - Bước 4: Thân (8)
  - Bước 5: Dậu (9)
  - Bước 6: Tuất (10)
- **Kết quả: Cung Thân = Tuất (10)**

---

## CÔNG THỨC TÍNH

### Cung Thân

```javascript
// Công thức: vị trí tháng + giờ
let viTriThang = (thangAL + 1) % 12;
let cungThan = (viTriThang + chiGio) % 12;
```

### Kiểm tra công thức hiện tại

```javascript
// Code hiện tại:
let pos = ((2 + thangAL - 1 + chiGio) % 12 + 12) % 12;
// = ((thangAL + 1 + chiGio) % 12 + 12) % 12;
```

**✅ CÔNG THỨC ĐÚNG!**

---

## 12 CUNG CHỨC NĂNG - Quy tắc chuẩn

Từ Cung Mệnh, đi **NGƯỢC CHIỀU KIM ĐỒNG HỒ** (index giảm dần):

```
Cung 0: MỆNH          (vị trí cung Mệnh)
Cung 1: HUYNH ĐỆ      (cung Mệnh - 1)
Cung 2: PHU THÊ       (cung Mệnh - 2)
Cung 3: TỬ TỨC       (cung Mệnh - 3)
Cung 4: TÀI BẠCH      (cung Mệnh - 4)
Cung 5: TẬT ÁCH       (cung Mệnh - 5)
Cung 6: THIÊN DI      (cung Mệnh - 6)
Cung 7: NÔ BỘC        (cung Mệnh - 7)
Cung 8: QUAN LỘC      (cung Mệnh - 8)
Cung 9: ĐIỀN TRẠCH    (cung Mệnh - 9)
Cung 10: PHÚC ĐỨC     (cung Mệnh - 10)
Cung 11: PHỤ MẪU      (cung Mệnh - 11)
```

### Kiểm tra code hiện tại

```javascript
// Code hiện tại trong anCung():
function anCung(cungMenhPos) {
    let result = {};
    for (let i = 0; i < 12; i++) {
        let pos = (cungMenhPos + i) % 12;  // ❌ SAI! Đang đi THUẬN
        result[pos] = CUNG_NAMES[i];
    }
    return result;
}
```

**❌ LỖI: Code đang đi THUẬN (cộng i), nhưng theo quy tắc phải đi NGƯỢC (trừ i)**

### Công thức đúng

```javascript
function anCung(cungMenhPos) {
    let result = {};
    for (let i = 0; i < 12; i++) {
        let pos = ((cungMenhPos - i) % 12 + 12) % 12;  // ✅ ĐÚNG: đi ngược
        result[pos] = CUNG_NAMES[i];
    }
    return result;
}
```

---

## KẾT LUẬN

### ✅ ĐÚNG

1. Công thức tính **Cung Mệnh** - ĐÚNG
2. Công thức tính **Cung Thân** - ĐÚNG

### ❌ SAI

1. Hàm **anCung()** - SAI: Đang đi thuận thay vì ngược

---

## FIX CẦN THỰC HIỆN

Sửa hàm `anCung()` trong file `tu-vi-calc.js` dòng 334-341:

```javascript
// TRƯỚC (SAI):
function anCung(cungMenhPos) {
    let result = {};
    for (let i = 0; i < 12; i++) {
        let pos = (cungMenhPos + i) % 12;  // ❌ Đi thuận
        result[pos] = CUNG_NAMES[i];
    }
    return result;
}

// SAU (ĐÚNG):
function anCung(cungMenhPos) {
    let result = {};
    for (let i = 0; i < 12; i++) {
        let pos = ((cungMenhPos - i) % 12 + 12) % 12;  // ✅ Đi ngược
        result[pos] = CUNG_NAMES[i];
    }
    return result;
}
```
