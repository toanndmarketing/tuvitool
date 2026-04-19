# TỬ VI LOGIC ENGINE - Knowledge Base v2.0

> **Nguồn gốc:** Tử Vi Đẩu Số Toàn Thư (陈希夷 → 潘希尹 bổ), Trung Châu Phái (王亭之), truyền thống Tam Hợp Phái Việt Nam.
> **Codebase:** `apps/web/src/lib/astrology/` (TypeScript — Next.js 16)
> **Cập nhật:** 2026-04-20

---

## 0. TỔNG QUAN THUẬT TOÁN LẬP LÁ SỐ

Quy trình lập hoàn chỉnh 1 lá số Tử Vi gồm **7 bước tuần tự**, mỗi bước phụ thuộc kết quả bước trước:

```
Input(Ngày DL, Giờ_Chi, Giới tính, Năm xem)
  │
  ├─ [1] Chuyển Dương → Âm Lịch (AmLich.ts)
  ├─ [2] Xác định Can Chi Năm/Tháng/Ngày/Giờ (AmLich.ts)
  ├─ [3] An Mệnh, Thân, 12 Cung (TuViCalc.ts)
  ├─ [4] Định Cục (Ngũ Hành Cục) (TuViCalc.ts)
  ├─ [5] An 14 Chính Tinh + 90+ Phụ Tinh (TuViSao.ts)
  ├─ [6] Gán Tứ Hóa + Miếu/Vượng/Hãm (TuViStarStatus.ts)
  └─ [7] Tính Đại Vận, Tiểu Hạn, Lưu Niên (TuViCalc.ts + TuViLuuNien.ts)
         │
         └── Output: ChartMatrix JSON (TuViEngine.ts)
```

---

## 1. CƠ SỞ LÝ LUẬN & TRƯỜNG PHÁI

### 1.1 Trường phái chính: Tam Hợp Phái (三合派) — Cổ truyền Việt Nam

Đặc trưng:
1. **Luận dựa trên quan hệ vị trí cung**: Tam Hợp, Xung Chiếu (Đối cung), Giáp Cung, Lục Hợp.
2. **Miếu/Vượng/Đắc/Bình/Hãm** đóng vai trò trọng yếu trong đánh giá sao.
3. **Bộ sao kết hợp** (40+ cặp) quyết định luận giải từng cung.
4. **KHÔNG dùng Phi Hóa / Phi Tinh** (kỹ thuật đặc trưng của Phi Tinh Tứ Hóa phái Đài Loan).

### 1.2 Bảng Tứ Hóa: Trung Châu Phái (中州派 — Vương Đình Chi), biến thể Việt Nam

Bảng Tứ Hóa là **điểm khác biệt lớn nhất** giữa các trường phái. Code hiện tại sử dụng bảng Trung Châu Phái với 2 điều chỉnh theo truyền thống Nam Phái Việt Nam:

| Can | Hóa Lộc | Hóa Quyền | Hóa Khoa | Hóa Kỵ | Ghi chú trường phái |
|-----|---------|-----------|---------|--------|---------------------|
| Giáp | Liêm Trinh | Phá Quân | Vũ Khúc | Thái Dương | Đồng thuận các phái |
| Ất | Thiên Cơ | Thiên Lương | Tử Vi | Thái Âm | Đồng thuận |
| Bính | Thiên Đồng | Thiên Cơ | Văn Xương | Liêm Trinh | Đồng thuận |
| Đinh | Thái Âm | Thiên Đồng | Thiên Cơ | Cự Môn | Đồng thuận |
| **Mậu** | Tham Lang | Thái Âm | **Hữu Bật** | Thiên Cơ | Trung Châu dùng Hữu Bật; Toàn Thư dùng Thiên Lương |
| Kỷ | Vũ Khúc | Tham Lang | Thiên Lương | Văn Khúc | Đồng thuận |
| **Canh** | Thái Dương | Vũ Khúc | **Thái Âm** | Thiên Đồng | Nam Phái VN: Thái Âm. Trung Châu gốc: Thiên Phủ |
| Tân | Cự Môn | Thái Dương | Văn Khúc | Văn Xương | Đồng thuận |
| **Nhâm** | Thiên Lương | Tử Vi | **Tả Phụ** | Vũ Khúc | Nam Phái VN: Tả Phụ. Trung Châu gốc: Thiên Phủ |
| Quý | Phá Quân | Cự Môn | Thái Âm | Tham Lang | Đồng thuận |

> **⚠️ QUAN TRỌNG — Khác biệt cốt lõi Mậu/Canh/Nhâm:**
> - Trung Châu Phái gốc (Vương Đình Chi): **KHÔNG** cho Tả Phụ, Hữu Bật hóa Khoa. Thay vào đó dùng **Thiên Phủ**.
> - Code hiện tại theo biến thể Việt Nam (Nam Phái truyền thống), **CHO** Hữu Bật (Mậu) và Tả Phụ (Nhâm) hóa Khoa.
> - Đây là lựa chọn có chủ đích, đã verified. **KHÔNG ĐƯỢC thay đổi** trừ khi anh yêu cầu chuyển sang phái khác.

### 1.3 So sánh nhanh các trường phái

| Đặc điểm | Codebase (Tam Hợp + Trung Châu biến thể) | Phi Tinh Tứ Hóa (Đài Loan) | Toàn Thư Phái |
|-----------|-------------------------------------------|-----------------------------|---------------|
| Bảng Tứ Hóa | Trung Châu (biến thể VN) | Riêng (nhiều bản) | Toàn Thư |
| Phi Hóa xuyên cung | ❌ KHÔNG | ✅ Kỹ thuật core | ❌ KHÔNG |
| Miếu/Hãm 14 sao | ✅ 5 cấp chi tiết | Ít quan trọng | ✅ Có |
| Đại Vận bắt đầu | = Cục số (tuổi) | Khác biệt | = Cục số |
| Bộ sao kết hợp | 40+ cặp, rất quan trọng | Ít dùng | Có dùng |

---

## 2. CHI TIẾT THUẬT TOÁN LẬP LÁ SỐ (THEO SÁCH CỔ)

### 2.1 Bước 1 — Ngũ Hổ Độn (五虎遁): Tìm Can Dần

Quyết định Can Chi cho 12 cung, dựa trên Thiên Can năm sinh:

```
Khẩu quyết (Ngũ Hổ Độn):
  Giáp/Kỷ → Bính Dần    (canDan = 2)
  Ất/Canh  → Mậu Dần    (canDan = 4)
  Bính/Tân → Canh Dần    (canDan = 6)
  Đinh/Nhâm→ Nhâm Dần    (canDan = 8)
  Mậu/Quý → Giáp Dần    (canDan = 0)
```

**Code:** `TuViCalc.ts` dòng 167 — `canDanMap = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]` ✅ Chính xác.

### 2.2 Bước 2 — An Cung Mệnh & Cung Thân

**Sách cổ (紫微斗数全书):**
- **Mệnh:** Từ cung Dần (index 2) khởi tháng Giêng, đếm **thuận** theo tháng, rồi từ cung đó đếm **nghịch** theo giờ.
- **Thân:** Từ cung Dần khởi tháng Giêng, đếm thuận theo tháng, rồi từ cung đó đếm **thuận** theo giờ.

**Công thức:**
```
Mệnh = (2 + thángAL - 1 - chiGiờ) mod 12
Thân = (2 + thángAL - 1 + chiGiờ) mod 12
```

**Code:** `TuViCalc.ts` dòng 144-158 ✅ Chính xác, khớp hoàn toàn với Toàn Thư.

### 2.3 Bước 3 — Định Cục (Ngũ Hành Cục)

Dựa vào Can Chi cung Mệnh (lấy Can từ Ngũ Hổ Độn, Chi là vị trí cung Mệnh) → quy vào 60 Hoa Giáp → tra Nạp Âm Ngũ Hành:

| Cục | Hành | Khởi Tràng Sinh |
|-----|------|-----------------|
| 2 | Thuỷ | Thân (8) |
| 3 | Mộc | Hợi (11) |
| 4 | Kim | Tỵ (5) |
| 5 | Thổ | Thân (8) |
| 6 | Hoả | Dần (2) |

**Code:** `TuViCalc.ts` dòng 164-192 + dòng 286-308. Bảng Nạp Âm 60 Hoa Giáp đầy đủ 30 cặp (60 vị trí). ✅

### 2.4 Bước 4 — An 14 Chính Tinh (Core Algorithm)

#### a) An Tử Vi

Vị trí Tử Vi = f(Cục, Ngày Âm Lịch). Theo khẩu quyết cổ:

> *"Cục số trừ nhật số, Thương số cung tiền tẩu; Nhược kiến số vô dư, tiện yếu khởi hổ khẩu."*

Code sử dụng **bảng tra (lookup table)** 5 Cục × 30 ngày, đây là cách triển khai chính xác nhất, tránh lỗi tính tay.

**Code:** `TuViSao.ts` dòng 35-46 ✅

#### b) An nhóm Tử Vi (6 sao — đi NGHỊCH)

Từ vị trí Tử Vi, các sao còn lại được an theo quy tắc cố định:

```
Tử Vi (gốc)
  → lùi 1 cung → Thiên Cơ
  → bỏ cách 1 cung (Nhật nguyệt không có sao)
  → lùi tiếp → Thái Dương (-3)
  → lùi tiếp → Vũ Khúc (-4)
  → lùi tiếp → Thiên Đồng (-5)
  → bỏ cách 2 cung
  → Liêm Trinh (-8)
```

**Code:** Offset [-1, -3, -4, -5, -8] tại `TuViSao.ts` dòng 56-65 ✅ Khớp Toàn Thư.

#### c) An nhóm Thiên Phủ (8 sao — đi THUẬN)

Thiên Phủ đối xứng Tử Vi qua **trục Dần-Thân**: `ThiênPhủ = (4 - TửVi) mod 12`

Từ Thiên Phủ, an thuận:
```
Thiên Phủ → +1 Thái Âm → +2 Tham Lang → +3 Cự Môn
→ +4 Thiên Tướng → +5 Thiên Lương → +6 Thất Sát
→ bỏ 3 cung → +10 Phá Quân
```

**Code:** `TuViSao.ts` dòng 75-88 ✅ Khớp hoàn toàn.

### 2.5 Bước 5 — An Phụ Tinh (90+ sao)

#### Phụ tinh theo THÁNG sinh:
| Sao | Khởi | Hướng | Công thức |
|-----|------|-------|-----------|
| Tả Phụ | Thìn (4) | Thuận | (4 + tháng - 1) % 12 |
| Hữu Bật | Tuất (10) | Nghịch | (10 - tháng + 1) % 12 |
| Thiên Hình | Dậu (9) | Thuận | (9 + tháng - 1) % 12 |
| Thiên Diêu | Sửu (1) | Thuận | (1 + tháng - 1) % 12 |

#### Phụ tinh theo GIỜ sinh:
| Sao | Khởi | Hướng | Công thức |
|-----|------|-------|-----------|
| Văn Xương | Tuất (10) | Nghịch | (10 - giờ) % 12 |
| Văn Khúc | Thìn (4) | Thuận | (4 + giờ) % 12 |
| Địa Không | Hợi (11) | Nghịch | (11 - giờ) % 12 |
| Địa Kiếp | Hợi (11) | Thuận | (11 + giờ) % 12 |

#### Phụ tinh theo CAN năm:
| Sao | Bảng tra (index 0-9 = Giáp-Quý) |
|-----|----------------------------------|
| Lộc Tồn | [2, 3, 5, 6, 5, 6, 8, 9, 11, 0] (Dần Mão Tỵ Ngọ Tỵ Ngọ Thân Dậu Hợi Tý) |
| Kình Dương | Lộc Tồn + 1 |
| Đà La | Lộc Tồn - 1 |
| Thiên Khôi | [1, 0, 11, 11, 1, 0, 7, 6, 3, 3] |
| Thiên Việt | [7, 8, 9, 9, 7, 8, 1, 2, 5, 5] |

#### Hoả Tinh & Linh Tinh (Phức tạp — theo Chi Năm + Giờ)

Khẩu quyết cổ (đã xác nhận qua sách gốc 紫微斗数安星诀):
```
Dần Ngọ Tuất (2,6,10): Hoả khởi Sửu(1), Linh khởi Mão(3)
Thân Tý Thìn (8,0,4):  Hoả khởi Dần(2), Linh khởi Tuất(10)
Tỵ Dậu Sửu (5,9,1):   Hoả khởi Mão(3), Linh khởi Tuất(10)
Hợi Mão Mùi (11,3,7):  Hoả khởi Dậu(9), Linh khởi Tuất(10)
```

Sau đó từ cung khởi, đếm thuận/nghịch theo giờ sinh.

> **⚠️ LƯU Ý QUAN TRỌNG về Thuận/Nghịch Hoả Linh:**
> Theo sách cổ chuẩn, Hoả Tinh và Linh Tinh an **THUẬN** theo giờ (không phân biệt Âm Dương giới tính). Tuy nhiên, codebase hiện tại áp dụng biến thể: Dương Nam/Âm Nữ → Hoả thuận, Linh nghịch; Âm Nam/Dương Nữ → ngược lại. Đây là biến thể phổ biến tại Việt Nam, giữ nguyên.

**Code:** `TuViSao.ts` dòng 183-214 ✅ khớp biến thể VN.

---

## 3. MIẾU VƯỢNG ĐẮC BÌNH HÃM — 14 CHÍNH TINH

5 cấp độ: **Miếu** (cực mạnh) → **Vượng** (mạnh) → **Đắc** (khá) → **Bình** (trung bình) → **Hãm** (yếu/xấu).

| Sao | Miếu | Vượng | Hãm | Ghi chú |
|---|---|---|---|---|
| Tử Vi | Ngọ, Tỵ | Thìn, Mùi | Không hãm | Đế tinh, luôn tối thiểu Bình |
| Thiên Cơ | Tý, Dần | Mão, Ngọ | Tỵ, Dậu | |
| Thái Dương | Mão, Thìn, Tỵ, Ngọ | Dần | Dậu, Tuất, Hợi, Tý | Nhật xuất = Miếu (sáng), Nhật nhập = Hãm (tối) |
| Vũ Khúc | Thìn, Tuất | Sửu, Mùi | Mão, Dậu | |
| Thiên Đồng | Dần, Thân | Tý, Ngọ | Tỵ, Hợi | |
| Liêm Trinh | Thân, Dậu | Dần, Mão | Tỵ, Hợi | |
| Thiên Phủ | Sửu, Mùi, Tý, Ngọ | Dần, Thân | Mão, Dậu | |
| Thái Âm | Dậu, Tuất, Hợi, Tý | Thân | Mão, Thìn, Tỵ, Ngọ | Nguyệt sáng = Miếu (đêm), Nguyệt tối = Hãm (ngày) |
| Tham Lang | Thìn, Tuất | Dần, Thân | Tỵ, Hợi | |
| Cự Môn | Tý, Thìn | Sửu, Mùi | Tỵ, Hợi | |
| Thiên Tướng | Sửu, Mùi | Dần, Thân | Tỵ, Hợi | |
| Thiên Lương | Tý, Ngọ | Dần, Thân | Tỵ, Hợi | |
| Thất Sát | Dần, Thân | Tý, Ngọ | Thìn, Tuất | |
| Phá Quân | Tý, Ngọ | Dần, Thân | Thìn, Tuất | |

### Nguyên tắc vận dụng
- Sao **miếu/vượng**: Phát huy tối đa ưu điểm, giảm hung tính (VD: Thất Sát miếu tại Dần → uy quyền, lãnh đạo)
- Sao **hãm**: Ưu điểm giảm, nhược điểm tăng (VD: Thái Dương hãm tại Hợi → mắt kém, cha bất lợi)
- **Cát tinh hãm** → trở thành trung tính hoặc nhẹ hung
- **Hung tinh miếu** → trở thành trung tính hoặc nhẹ cát

---

## 4. QUY TẮC LUẬN GIẢI — TAM PHƯƠNG TỨ CHÍNH

### 4.1 Xung Chiếu (Đối cung)
- Cung đối diện (cách 6 cung) có ảnh hưởng **TRỰC TIẾP** lên cung đang xét
- Sao ở cung đối chiếu tác động **50-70%** so với sao đóng trực tiếp
- `doi_cung = (cung_pos + 6) % 12`

### 4.2 Tam Hợp (Hội chiếu)
- 3 cung tạo thành tam giác đều: cách nhau 4 cung
- Sao ở tam hợp ảnh hưởng **30-50%**
- `tam_hop = [(cung_pos + 4) % 12, (cung_pos + 8) % 12]`

### 4.3 Giáp Cung (Kẹp cung)
- 2 cung liền kề "kẹp" cung giữa
- Giáp cát (Tả Hữu giáp, Xương Khúc giáp) → **rất tốt**
- Giáp hung (Kình Đà giáp, Hoả Linh giáp) → **rất xấu**
- `giap = [(cung_pos + 1) % 12, (cung_pos - 1 + 12) % 12]`

### 4.4 Tuần Không & Triệt Lộ

**Tuần Không (空):** Sao rơi vào → giảm 50% hiệu lực (cả cát lẫn hung đều giảm).
**Triệt Lộ (截):** Sao rơi vào → bị chặn/chậm trễ, giảm 30-50%.

Bảng Triệt theo Can năm:
```
Giáp/Kỷ: Thân, Dậu (8, 9)
Ất/Canh:  Ngọ, Mùi (6, 7)
Bính/Tân: Thìn, Tỵ (4, 5)
Đinh/Nhâm: Dần, Mão (2, 3)
Mậu/Quý: Tý, Sửu (0, 1)
```

---

## 5. ĐẠI VẬN, TIỂU HẠN & LƯU NIÊN

### 5.1 Đại Vận (大限)
- Mỗi Đại Vận kéo dài **10 năm**.
- Tuổi bắt đầu = Cục số (Thuỷ 2 → bắt đầu tuổi 2, Hoả 6 → bắt đầu tuổi 6).
- **Thuận** (Dương Nam, Âm Nữ): Mệnh → Phụ Mẫu → Phúc Đức (tăng index).
- **Nghịch** (Âm Nam, Dương Nữ): Mệnh → Huynh Đệ → Phu Thê (giảm index).

### 5.2 Tiểu Hạn (小限)
- Vòng 12 năm lặp lại. Khởi cung phụ thuộc Tam Hợp Chi năm sinh:
```
Thân Tý Thìn (8,0,4): khởi Tuất (10)
Tỵ Dậu Sửu (5,9,1):  khởi Mùi (7)
Dần Ngọ Tuất (2,6,10): khởi Thìn (4)
Hợi Mão Mùi (11,3,7): khởi Sửu (1)
```
- Nam đi **thuận**, Nữ đi **nghịch**.

### 5.3 Lưu Niên (流年)
- Cung Lưu Niên = Chi năm xem. Đơn giản và trực tiếp.
- Lưu Tứ Hóa = Tứ Hóa theo Can năm xem (cùng bảng với sinh niên).

### 5.4 Logic kết hợp
| Đại Vận | Tiểu Hạn | Kết luận |
|---------|----------|----------|
| Tốt | Tốt | Năm rất thuận lợi |
| Tốt | Xấu | Có thử thách nhưng vượt được |
| Xấu | Tốt | Cơ hội nhỏ trong bối cảnh khó khăn |
| Xấu | Xấu | Nhiều sóng gió, cần đề phòng cao |

---

## 6. BỘ SAO KẾT HỢP ĐẶC BIỆT

### 6.1 Đại Hung (intensity 9-10)
1. **Tứ Sát hội tụ** (Kình-Đà-Hoả-Linh cùng cung/tam hợp) → Tai nạn nghiêm trọng
2. **Sát-Phá-Liêm** (Liêm Trinh + Thất Sát + Phá Quân) → Biến cố lớn
3. **Cự Kỵ + Kình/Đà** → Thị phi cực nặng, kiện tụng
4. **Không-Kiếp tại/chiếu Tài Bạch** → Phá sản
5. **Tang Môn + Bạch Hổ + Thiên Khốc** (Phúc Đức/Mệnh) → Tang sự

### 6.2 Đại Cát (intensity 8-10)
1. **Tử Phủ đồng cung** → Quý nhân tối cao
2. **Song Lộc hội** (Lộc Tồn + Hoá Lộc cùng cung/tam hợp) → Đại phát tài
3. **Khôi-Việt-Xương-Khúc** tứ quý nhân → Thăng tiến, đỗ đạt
4. **Tả-Hữu giáp cung** → Quý nhân phù trợ hai bên
5. **Lộc Mã đồng hương** (Thiên Mã + Lộc Tồn + Hoá Lộc) → Phát tài từ kinh doanh

### 6.3 Bộ Tâm Linh / Âm Phần (niche)
1. **Tang Môn + Điếu Khách** tại Phúc Đức → Mồ mả bất ổn
2. **Cô Thần + Quả Tú** tại Phúc Đức/Mệnh → Cần tu hành, thờ cúng
3. **Thiên Khốc + Thiên Hư** tại Phúc Đức → Âm khí nặng
4. **Liêm-Hình-Phá** tại Phúc → Phần mộ bị xâm phạm

---

## 7. QUY TẮC BẤT DI BẤT DỊCH

1. ❌ **KHÔNG thêm logic Phi Hóa / Phi Tinh** — trái với trường phái.
2. ❌ **Bảng Tứ Hóa KHÔNG ĐƯỢC THAY ĐỔI** — đã verified.
3. ❌ Mọi thay đổi quy tắc an sao **PHẢI có nguồn tham khảo** rõ ràng từ sách cổ.
4. ✅ Mọi thay đổi logic → **PHẢI chạy `/test-tuvi`** để verify accuracy.

---

*Knowledge Base Version: 2.0*
*Updated: 2026-04-20*
*Sources: 紫微斗数全书, 中州派 (王亭之), Tam Hợp Phái VN, Codebase V2 TypeScript*
