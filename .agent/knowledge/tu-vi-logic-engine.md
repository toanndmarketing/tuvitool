# TỬ VI LOGIC ENGINE - Knowledge Base v1.0

## MỤC ĐÍCH

Xây dựng hệ thống dữ liệu luận giải có chiều sâu, vượt xa việc chỉ đếm cát/hung tinh rồi cho rating.
Logic Engine này giúp AI Agent tự "đào bới" khi gặp bất kỳ bộ sao nào → luận ra hạn/vận cụ thể.

---

## 1. PHÂN LOẠI HẠN VẬN (EVENT CATEGORIES)

### 1.1 Nhóm Địa Ốc & Âm Phần (`realty_spiritual`)

| ID | Event | Focus Houses | Star Combinations (Fixed) | Dynamic Stars (Lưu Niên) | Intensity | Description Template |
|---|---|---|---|---|---|---|
| RS01 | Sửa nhà / Xây nhà | Điền Trạch | Thiên Phủ + Thái Âm (cát), Liêm Trinh + Phá Quân (biến động) | Lưu Thiên Mã + Lưu Lộc Tồn tại Điền | 7 | `Đương số có khả năng {sửa/xây} nhà trong giai đoạn này do {lý do sao}` |
| RS02 | Mua đất / Bất động sản | Điền Trạch, Tài Bạch | Thiên Phủ miếu + Lộc Tồn, hoặc Vũ Khúc + Tham Lang | Lưu Hoá Lộc chiếu Điền | 8 | `Năm có cơ hội đầu tư bất động sản do {sao} hội tại cung Điền` |
| RS03 | Động mồ mả | Phúc Đức | Tang Môn + Điếu Khách, Thiên Khốc + Thiên Hư | Lưu Thái Tuế xung Phúc Đức | 9 | `Cần lưu ý phần mộ tổ tiên, có dấu hiệu {bất ổn/động chuyển} do {sao}` |
| RS04 | Thờ cúng / Lập bàn thờ | Phúc Đức, Điền Trạch | Hỷ Thần + Thiên Phúc + Tấu Thư | Lưu Hoá Khoa tại Phúc | 6 | `Đương số nên {lập/sửa} bàn thờ gia tiên. Sao {sao} gợi ý {hành động}` |
| RS05 | Thay đổi bàn thờ / di dời | Phúc Đức, Thiên Di | Cô Thần + Quả Tú + Phá Quân tại Phúc | Lưu Thái Tuế + Tang Môn xung Phúc | 8 | `Năm nay cần xem xét vị trí thờ phụng, có dấu hiệu {cần di chuyển/sắp xếp lại}` |
| RS06 | Vận tâm linh / Mộ phần không yên | Phúc Đức | Liêm Trinh + Thiên Hình + Bạch Hổ | Lưu Kình Dương chiếu Phúc | 9 | `Tổ tiên có phần không yên, cần {hoá giải}. Biểu hiện: {triệu chứng}` |
| RS07 | Gia sản / Thừa kế | Điền Trạch, Phúc Đức | Thiên Phủ + Tử Vi, Hoá Lộc tại Điền | Lưu Hoá Lộc + Lưu Thiên Mã tại Điền | 7 | `Có khả năng nhận thừa kế hoặc tài sản gia đình do {sao}` |

### 1.2 Nhóm Thân Thể (`health`)

| ID | Event | Focus Houses | Star Combinations | Dynamic Stars | Intensity | Description Template |
|---|---|---|---|---|---|---|
| H01 | Tai nạn chân tay | Tật Ách, Mệnh | Kình Dương + Đà La, Thất Sát + Phá Quân | Lưu Kình Dương + Lưu Đà La song chiếu Tật | 9 | `Cần đề phòng tai nạn liên quan {bộ phận}, đặc biệt tháng {tháng}` |
| H02 | Mổ xẻ / Phẫu thuật | Tật Ách | Thiên Hình + Bạch Hổ + Kình Dương | Lưu Thiên Mã xung Tật Ách | 8 | `Có dấu hiệu cần phẫu thuật do {sao}. Nên chủ động khám sức khỏe` |
| H03 | Bệnh về máu huyết | Tật Ách | Liêm Trinh + Thất Sát, Tham Lang + Hoả Tinh | Lưu Hoá Kỵ tại Tật + Thiên Hình | 8 | `Lưu ý bệnh về {máu/huyết áp/tim mạch}. Sao {sao} gợi ý {chi tiết}` |
| H04 | Thị lực / Mắt | Tật Ách | Thái Dương + Hoả Tinh (miếu), Thái Dương hãm + Hoá Kỵ | Lưu Hoá Kỵ chiếu Thái Dương | 7 | `Cần bảo vệ thị lực, đặc biệt khi {sao Thái Dương hãm}` |
| H05 | Va chạm nhỏ / Xây xước | Tật Ách | Hoả Tinh + Linh Tinh | Lưu Kình Dương tại Tật | 5 | `Có hạn nhẹ về va chạm, nên cẩn trọng khi {di chuyển/thể thao}` |
| H06 | Bệnh u bướu / Thận | Tật Ách | Thiên Cơ + Hoá Kỵ, Cự Môn + Hoá Kỵ | Lưu Hoá Kỵ trùng Hoá Kỵ gốc | 9 | `Cần đặc biệt lưu ý khám sức khỏe toàn diện do {bộ sao}` |
| H07 | Tinh thần / Stress | Tật Ách, Mệnh | Thiên Đồng + Thiên Lương (hãm), Cự Môn + Đà La | - | 6 | `Sức khỏe tinh thần cần được chú ý, dễ {lo lắng/mất ngủ}` |

### 1.3 Nhóm Quan Hệ & Thị Phi (`relationship_conflict`)

| ID | Event | Focus Houses | Star Combinations | Dynamic Stars | Intensity | Description Template |
|---|---|---|---|---|---|---|
| RC01 | Kiện tụng | Quan Lộc, Nô Bộc | Cự Môn + Hoá Kỵ, Thiên Hình + Quan Phủ | Lưu Hoá Kỵ tại Quan + Lưu Đà La | 9 | `Nguy cơ vướng kiện tụng do {sao}. Cần thận trọng {lĩnh vực}` |
| RC02 | Tranh chấp đất đai | Điền Trạch, Quan Lộc | Phá Quân + Hoá Kỵ tại Điền, Cự Môn xung chiếu Điền | Lưu Thái Tuế + Lưu Kình Dương | 9 | `Vấn đề đất đai/bất động sản cần cẩn trọng. {Sao} gợi ý tranh chấp` |
| RC03 | Thị phi công sở | Quan Lộc, Nô Bộc | Cự Môn + Đà La, Thiên Hình + Phá Quân | Lưu Hoá Kỵ chiếu Quan Lộc | 7 | `Cần đề phòng thị phi nơi công sở. {Sao} cảnh báo {chi tiết}` |
| RC04 | Thay đổi cộng sự | Nô Bộc, Quan Lộc | Thiên Mã + Phá Quân tại Nô, Liêm Trinh + Thiên Hình | Lưu Thiên Mã xung Nô Bộc | 7 | `Có sự thay đổi trong quan hệ cộng sự/đối tác do {sao}` |
| RC05 | Bội phản / Lừa đảo | Nô Bộc | Liêm Trinh + Tham Lang + Hoá Kỵ | Lưu Hoá Kỵ trùng Nô Bộc | 8 | `Cần cẩn trọng với đối tác, có dấu hiệu {sao} gợi ý phản bội` |
| RC06 | Tai tiếng / Scandal | Mệnh, Quan Lộc | Cự Môn + Hoá Kỵ + Đào Hoa | Lưu Đào Hoa + Lưu Hoá Kỵ | 8 | `Cần giữ gìn danh tiếng, tránh {hành động} dễ gây hiểu lầm` |

### 1.4 Nhóm Hỷ Tín (`celebration`)

| ID | Event | Focus Houses | Star Combinations | Dynamic Stars | Intensity | Description Template |
|---|---|---|---|---|---|---|
| C01 | Cưới hỏi | Phu Thê, Mệnh | Hồng Loan + Thiên Hỷ, Đào Hoa + Tả Phụ + Hữu Bật | Lưu Hồng Loan xung chiếu Phu Thê | 8 | `Năm có dấu hiệu {hỷ sự tình cảm}. Sao {sao} gợi ý {chi tiết}` |
| C02 | Sinh con | Tử Tức | Thiên Đồng + Thái Âm (miếu), Thai Phụ + Tả Phụ | Lưu Hoá Lộc tại Tử Tức | 8 | `Đường con cái thuận lợi. {Sao} gợi ý {giới tính/đặc điểm}` |
| C03 | Mua xe | Tài Bạch, Điền Trạch | Thiên Mã + Lộc Tồn, Vũ Khúc + Hoá Lộc | Lưu Thiên Mã + Lưu Lộc Tồn | 6 | `Có cơ hội sắm sửa phương tiện. {Sao Thiên Mã} gợi ý di chuyển mới` |
| C04 | Thăng tiến | Quan Lộc | Tử Vi + Hoá Quyền, Thái Dương + Hoá Lộc | Lưu Hoá Quyền chiếu Quan Lộc | 8 | `Cơ hội thăng tiến rõ rệt do {sao}. Nên chủ động trong {thời điểm}` |
| C05 | Trúng thưởng / Tài lộc bất ngờ | Tài Bạch | Thiên Mã + Hoá Lộc + Lộc Tồn, "Song Lộc" | Lưu Hoá Lộc trùng Lộc Tồn gốc | 7 | `Có dấu hiệu tài lộc bất ngờ, cơ hội {phát tài từ hướng}` |
| C06 | Du lịch / Xuất ngoại | Thiên Di | Thiên Mã + Hoá Lộc, Tả Phụ + Hữu Bật | Lưu Thiên Mã tại Thiên Di | 5 | `Cơ hội di chuyển xa, du lịch hoặc công tác nước ngoài` |

---

## 2. BỘ SAO KẾT HỢP ĐẶC BIỆT (STAR COMBINATION PATTERNS)

### 2.1 Bộ Đại Hung (Cực xấu, intensity 9-10)

```
1. "Tứ Sát hội tụ" (Kình-Đà-Hoả-Linh cùng cung hoặc tam hợp)
   → Tai nạn nghiêm trọng, bệnh nặng
   → Template: "Năm này có tứ sát hội tụ tại cung {cung}, cực kỳ nguy hiểm."

2. "Liêm Trinh + Thất Sát + Phá Quân" (Sát-Phá-Liêm)
   → Biến cố lớn, thay đổi toàn bộ cuộc sống
   → Template: "Bộ Sát-Phá-Liêm tại {cung} báo hiệu biến cố mạnh."

3. "Cự Môn + Hoá Kỵ + Kình/Đà"
   → Thị phi cực nặng, kiện tụng, tai tiếng
   → Template: "Cự Kỵ + hung tinh tại {cung} → thị phi nặng nề."

4. "Địa Không + Địa Kiếp cùng cung/đối chiếu Tài Bạch"
   → Phá sản, mất tài sản lớn
   → Template: "Không-Kiếp ảnh hưởng tài vận, cần đề phòng {tổn thất lớn}."

5. "Tang Môn + Bạch Hổ + Thiên Khốc" (tại Phúc Đức hoặc Mệnh)
   → Tang sự, tang tóc trong gia đình
   → Template: "Bộ sao tang chế tại {cung} cảnh báo {sự mất mát}."
```

### 2.2 Bộ Đại Cát (Cực tốt, intensity 8-10)

```
1. "Tử Vi + Thiên Phủ" (cùng cung)
   → Quý nhân tối cao, quyền quý
   → Template: "Tử-Phủ hội tại {cung}, đại quý nhân phù trợ."

2. "Song Lộc hội" (Lộc Tồn + Hoá Lộc cùng cung hoặc tam hợp)
   → Tài lộc dồi dào, phát tài
   → Template: "Song Lộc hội tại {cung} → tài vận cực vượng."

3. "Khôi-Việt-Xương-Khúc" (tứ quý nhân)
   → Thăng tiến, thi cử đỗ đạt, được đề bạt
   → Template: "Bốn quý nhân hội tại {cung} → danh tiếng, học vấn tỏa sáng."

4. "Tả Phụ + Hữu Bật giáp cung" (hoặc tam hợp)
   → Có quý nhân hai bên phù trợ
   → Template: "Tả-Hữu giáp {cung} → quý nhân phù trợ từ hai phía."

5. "Thiên Mã + Lộc Tồn + Hoá Lộc"
   → "Lộc Mã đồng hương" → phát tài từ di chuyển, kinh doanh
   → Template: "Lộc Mã đồng hương tại {cung} → phát tài từ ngoại giao/kinh doanh."
```

### 2.3 Bộ Âm Phần / Tâm Linh (Quan trọng cho mảng niche)

```
1. "Tang Môn + Điếu Khách" (tại Phúc Đức)
   → Âm phần bất ổn, mồ mả cần tu sửa
   → Template: "Tang-Điếu tại Phúc Đức → tổ tiên có phần không yên."

2. "Cô Thần + Quả Tú" (tại Phúc Đức hoặc Mệnh)
   → Cô đơn về tâm linh, cần tu hành, thờ cúng
   → Template: "Cô-Quả tại {cung} → nên chú trọng thờ phụng gia tiên."

3. "Hỷ Thần + Thiên Phúc + Tấu Thư" (tại Điền/Phúc)
   → Liên quan lập bàn thờ, sửa sang nơi thờ phụng
   → Template: "Bộ Hỷ-Phúc-Tấu tại {cung} → nên {sửa/lập} bàn thờ gia tiên."

4. "Thiên Khốc + Thiên Hư" (tại Phúc Đức)
   → Âm khí nặng, mồ mả cần di dời hoặc xây lại
   → Template: "Khốc-Hư tại Phúc → cần kiểm tra phần mộ."

5. "Liêm Trinh + Thiên Hình + Phá Quân" (tại Phúc)
   → Phúc đức bị phá, mồ mả bị xâm phạm
   → Template: "Bộ hình phá tại Phúc → phần mộ tổ tiên có vấn đề nghiêm trọng."

6. "Thái Âm hãm + Hoá Kỵ" (tại Phúc Đức)
   → Mẹ/bà ngoại bất lợi, âm phần bên ngoại có vấn đề
   → Template: "Thái Âm Kỵ tại Phúc → cần xem xét phần mộ bên ngoại."
```

---

## 3. QUY TẮC LUẬN GIẢI CHUYÊN SÂU

### 3.1 Xung Chiếu (Đối cung)

- Cung đối diện (cách 6 cung) có ảnh hưởng TRỰC TIẾP lên cung đang xét
- Sao ở cung đối chiếu tác động **50-70%** so với sao đóng trực tiếp
- Ví dụ: Hoá Kỵ ở cung Thiên Di → ảnh hưởng mạnh lên cung Mệnh
- **Logic code**: `doi_cung = (cung_pos + 6) % 12`

### 3.2 Tam Hợp (Hội chiếu)

- 3 cung tạo thành tam giác đều: cách nhau 4 cung
- Sao ở tam hợp ảnh hưởng **30-50%**
- Ví dụ: Cung Mệnh ở Tý → tam hợp với Thìn và Thân
- **Logic code**: `tam_hop = [(cung_pos + 4) % 12, (cung_pos + 8) % 12]`

### 3.3 Giáp Cung (Kẹp cung)

- 2 cung liền kề bên trái và phải cùng "kẹp" cung giữa
- Sao ở giáp cung ảnh hưởng **20-40%**
- Giáp cát → tốt. Giáp hung → xấu
- **Logic code**: `giap = [(cung_pos + 1) % 12, (cung_pos - 1 + 12) % 12]`

### 3.4 Tuần / Triệt xử lý

**Tuần Không (空):**

- Sao rơi vào vị trí Tuần → **giảm 50%** hiệu lực
- Cát tinh bị Tuần → giảm tốt
- Hung tinh bị Tuần → **CŨNG giảm hung** (tốt)
- Đặc biệt: Địa Không, Địa Kiếp bị Tuần → gần như vô hiệu

**Triệt Lộ (截):**

- Sao rơi vào vị trí Triệt → **bị chặn**, hiệu lực giảm 30-50%
- Triệt thường gây **chậm trễ** hơn là triệt tiêu hoàn toàn
- Cát tinh bị Triệt → "phúc đến muộn" (hạn tốt đến chậm)
- Hung tinh bị Triệt → "họa giảm nhẹ" (hạn xấu bớt nặng)

### 3.5 Đại Vận + Tiểu Vận kết hợp

**Nguyên tắc:**

1. **Đại Vận** = "Môi trường" → xác định xu hướng tổng thể 10 năm
2. **Tiểu Vận** = "Biến cố" → xác định sự kiện cụ thể trong năm
3. **Lưu Niên** = "Trigger" → kích hoạt những gì Đại Vận + Tiểu Vận đã "chuẩn bị"

**Logic kết hợp:**

- Đại Vận tốt + Tiểu Vận tốt → Năm rất thuận lợi
- Đại Vận tốt + Tiểu Vận xấu → Năm có thử thách nhưng vượt qua được
- Đại Vận xấu + Tiểu Vận tốt → Năm có cơ hội nhỏ trong bối cảnh khó khăn
- Đại Vận xấu + Tiểu Vận xấu → Năm nhiều sóng gió, cần đề phòng

**Lưu Tứ Hoá tác động:**

- Lưu Hoá Lộc trùng cung có Hoá Lộc gốc → "Song Lộc hội" (đại phát tài)
- Lưu Hoá Kỵ trùng cung có Hoá Kỵ gốc → "Song Kỵ" (đại hung)
- Lưu Hoá Kỵ chiếu cung Đại Vận → Kích hoạt hạn xấu
- Lưu Hoá Lộc chiếu cung Đại Vận → Xúc tác thuận lợi

---

## 4. MIẾU-VƯỢNG-HÃM CỦA 14 CHÍNH TINH

Mỗi sao có các trạng thái: **Miếu** (rất mạnh), **Vượng** (mạnh), **Đắc** (khá), **Bình** (bình thường), **Hãm** (yếu/xấu).

Trạng thái này phụ thuộc vào **cung nào** sao đóng (Địa Chi).

| Sao | Miếu | Vượng | Hãm |
|---|---|---|---|
| Tử Vi | Ngọ, Tỵ | Thìn, Mùi | Không hãm (đế tinh) |
| Thiên Cơ | Tý, Dần | Mão, Ngọ | Tỵ, Dậu |
| Thái Dương | Mão, Thìn, Tỵ, Ngọ | Dần | Dậu, Tuất, Hợi, Tý |
| Vũ Khúc | Thìn, Tuất | Sửu, Mùi | Mão, Dậu |
| Thiên Đồng | Dần, Thân | Tý, Ngọ | Tỵ, Hợi |
| Liêm Trinh | Thân, Dậu | Dần, Mão | Tỵ, Hợi |
| Thiên Phủ | Sửu, Mùi, Tý, Ngọ | Dần, Thân | Mão, Dậu |
| Thái Âm | Dậu, Tuất, Hợi, Tý | Thân | Mão, Thìn, Tỵ, Ngọ |
| Tham Lang | Thìn, Tuất | Dần, Thân | Tỵ, Hợi |
| Cự Môn | Tý, Thìn | Sửu, Mùi | Tỵ, Hợi |
| Thiên Tướng | Sửu, Mùi | Dần, Thân | Tỵ, Hợi |
| Thiên Lương | Tý, Ngọ | Dần, Thân | Tỵ, Hợi |
| Thất Sát | Dần, Thân | Tý, Ngọ | Thìn, Tuất |
| Phá Quân | Tý, Ngọ | Dần, Thân | Thìn, Tuất |

### Ứng dụng miếu-hãm vào luận giải

- Sao **miếu/vượng**: Phát huy tối đa ưu điểm, giảm hung tính
  - VD: Thất Sát miếu tại Dần → uy quyền, lãnh đạo (tốt)
  - VD: Thất Sát hãm tại Tuất → hung bạo, sát phạt (xấu)
- Sao **hãm**: Ưu điểm giảm, nhược điểm tăng
  - VD: Thái Dương hãm tại Hợi → mắt kém, cha bất lợi, sự nghiệp trầm
- Sao **cát hãm** → trở thành **trung tính hoặc nhẹ hung**
- Sao **hung miếu** → trở thành **trung tính hoặc nhẹ cát**

---

## 5. LOGIC MAPPING (ALGORITHM PSEUDO-CODE)

### 5.1 Quét sự kiện (Event Scanning)

```typescript
function scanEvents(lasoData, yearView) {
    const events = [];
    
    for (const eventRule of EVENT_RULES) {
        const score = evaluateRule(eventRule, lasoData, yearView);
        if (score >= eventRule.threshold) {
            events.push({
                ...eventRule,
                score,
                description: renderTemplate(eventRule.template, lasoData)
            });
        }
    }
    
    return events.sort((a, b) => b.score - a.score);
}

function evaluateRule(rule, lasoData, yearView) {
    let score = 0;
    
    // 1. Check focus houses
    for (const house of rule.focusHouses) {
        const housePos = findCungPosition(house, lasoData.cungMap);
        const stars = lasoData.saoMap[housePos];
        
        // 2. Check fixed star combinations
        const fixedMatch = matchStarCombination(rule.starCombinations, stars);
        score += fixedMatch * FIXED_WEIGHT;
        
        // 3. Check dynamic (lưu niên) stars
        const dynamicMatch = matchDynamicStars(rule.dynamicStars, stars);
        score += dynamicMatch * DYNAMIC_WEIGHT;
        
        // 4. Check xung chiếu
        const doiCung = getDoiCung(housePos);
        const doiStars = lasoData.saoMap[doiCung];
        score += matchXungChieu(rule, doiStars) * XUNG_WEIGHT;
        
        // 5. Check tam hợp
        const tamHop = getTamHop(housePos);
        for (const thPos of tamHop) {
            score += matchTamHop(rule, lasoData.saoMap[thPos]) * TAM_HOP_WEIGHT;
        }
        
        // 6. Adjust for Tuần/Triệt
        score = adjustTuanTriet(score, housePos, lasoData.tuanTriet);
    }
    
    // 7. Combine with Đại Vận + Tiểu Vận
    score = combineDaiTieuVan(score, rule, lasoData);
    
    return score;
}
```

### 5.2 Render luận giải

```typescript
function generateInterpretation(events, lasoData) {
    const interpretations = [];
    
    for (const event of events) {
        // Build ngữ cảnh
        const context = buildContext(event, lasoData);
        
        // Generate lời luận
        const text = fillTemplate(event.template, {
            ...context,
            intensity: event.score,
            year: lasoData.yearView,
            daiVanInfo: lasoData.daiVanHienTai,
            tieuVanInfo: lasoData.tieuVan
        });
        
        interpretations.push({
            category: event.category,
            title: event.title,
            text,
            severity: event.score >= 8 ? 'critical' : event.score >= 6 ? 'important' : 'info',
            advice: generateAdvice(event, lasoData)
        });
    }
    
    return interpretations;
}
```

---

## 6. STYLE LỜI LUẬN GIẢI

### Nguyên tắc

1. **Giọng điệu**: Điềm đạm, chuyên nghiệp, không doạ nạt
2. **Cấu trúc**: [Nhận định] → [Lý do sao] → [Thời điểm] → [Lời khuyên]
3. **Danh xưng**: Luôn dùng "Đương số" (không dùng tên riêng)
4. **Tránh**: Cực đoan, khẳng định tuyệt đối, gây hoang mang

### Mẫu câu theo severity

**Critical (8-10):**
> "Đương số cần đặc biệt lưu ý trong năm này, khi bộ {sao A} + {sao B} hội tại cung {cung}.
> Điều này gợi ý {sự kiện}. Nên {lời khuyên cụ thể} để hóa giải."

**Important (6-7):**
> "Trong giai đoạn Đại Vận qua cung {cung}, {sao} cho thấy xu hướng {sự kiện}.
> Đương số nên {lời khuyên}."

**Info (1-5):**
> "Năm nay có dấu hiệu nhẹ về {sự kiện} do {sao} tại {cung}.
> Không đáng lo ngại nhưng nên {lưu ý nhỏ}."

---

## 7. LỘ TRÌNH ÁP DỤNG VÀO CODE

### Phase A: Data Layer (TypeScript Interfaces + Constants)

- File: `data/tu-vi-event-rules.ts` → Toàn bộ EVENT_RULES constant
- File: `data/tu-vi-star-patterns.ts` → Bộ sao kết hợp + miếu/hãm
- File: `data/tu-vi-interpretation-templates.ts` → Templates lời luận

### Phase B: Logic Engine (JavaScript)

- File: `public/tu-vi-event-scanner.js` → scanEvents() + evaluateRule()
- Tích hợp vào `tu-vi-interpret.js` → analyzeVanHan() sử dụng event scanner

### Phase C: AI Enhancement

- Cập nhật `server/gemini.js` → buildPrompt() include event scan results
- AI sẽ có "gợi ý" từ event scanner, sau đó tự luận thêm chi tiết

---

*Knowledge Base Version: 1.0*
*Created: 2026-02-10*
*Author: Tử Vi Logic Engine Architecture*
