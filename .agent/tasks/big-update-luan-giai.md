---
title: "Big Update - Nâng Cấp Data Luận Giải Tử Vi"
status: pending
priority: critical
created: 2026-02-10
depends_on: dai-van-tieu-van
knowledge_ref: .agent/knowledge/tu-vi-logic-engine.md
---

# Big Update: Nâng Cấp Toàn Bộ Hệ Thống Luận Giải

## TẠI SAO CẦN THAY ĐỔI?

### Vấn đề hiện tại

1. **Luận giải nông**: Chỉ đếm cát/hung tinh → cho rating → output câu generic
2. **Không có event detection**: Không phát hiện được các "bộ sao" đặc trưng cho từng loại hạn
3. **Thiếu chiều sâu tâm linh**: Chưa xử lý mảng âm phần, mồ mả, thờ cúng
4. **AI prompt thiếu context**: Gemini chỉ nhận danh sách sao, không nhận biết pattern
5. **Không xét xung chiếu/tam hợp**: Bỏ qua ảnh hưởng từ cung đối chiếu và tam hợp

### Giải pháp: Logic Engine Architecture

Xây hệ thống **quét sự kiện** (Event Scanner) dựa trên:

- Data schema → Quy tắc nhận diện từng loại hạn
- Logic Engine → Tự động map bộ sao ↔ sự kiện
- AI Enhancement → Gemini nhận kết quả scan → luận sâu hơn

---

## PHASE 1: Data Layer (TypeScript Constants) ⭐⭐⭐

### Mục tiêu

Xây dựng bộ dữ liệu quy tắc dạng constant objects, có thể tích hợp trực tiếp.

### Files cần tạo

#### 1.1 `public/tu-vi-event-rules.js`

```javascript
/**
 * TỬ VI EVENT RULES - Bộ quy tắc nhận diện sự kiện
 * Mỗi rule = 1 loại hạn/vận có thể xảy ra
 */
const TuViEventRules = {
    // 4 categories chính
    CATEGORIES: {
        realty_spiritual: { name: 'Địa Ốc & Âm Phần', icon: '🏠', color: '#8B4513' },
        health: { name: 'Sức Khỏe & Thân Thể', icon: '🏥', color: '#DC143C' },
        relationship_conflict: { name: 'Quan Hệ & Thị Phi', icon: '⚖️', color: '#4169E1' },
        celebration: { name: 'Hỷ Tín', icon: '🎉', color: '#FFD700' }
    },

    // Bộ rules (tham chiếu knowledge base)
    RULES: [
        // RS01 - RS07: Nhóm Địa Ốc & Âm Phần
        // H01 - H07: Nhóm Thân Thể
        // RC01 - RC06: Nhóm Quan Hệ & Thị Phi
        // C01 - C06: Nhóm Hỷ Tín
    ]
};
```

**Chi tiết data cần implement:**

- [ ] **26 rules** (7 + 7 + 6 + 6) từ knowledge base
- [ ] Mỗi rule có: `id`, `category`, `focusHouses`, `fixedStars`, `dynamicStars`, `threshold`, `intensity`, `template`
- [ ] Mỗi template có 3 variant: critical, important, info

#### 1.2 `public/tu-vi-star-patterns.js`

```javascript
/**
 * BỘ SAO KẾT HỢP - Pattern matching
 */
const TuViStarPatterns = {
    // Bộ Đại Hung (5 patterns)
    HUNG_PATTERNS: [...],
    
    // Bộ Đại Cát (5 patterns)
    CAT_PATTERNS: [...],
    
    // Bộ Âm Phần / Tâm Linh (6 patterns)
    SPIRITUAL_PATTERNS: [...],
    
    // Miếu-Vượng-Hãm 14 chính tinh
    MIEU_HAM: {
        'Tử Vi': { mieu: [6, 5], vuong: [4, 7], ham: [] },
        'Thiên Cơ': { mieu: [0, 2], vuong: [3, 6], ham: [5, 9] },
        // ... tất cả 14 tinh
    }
};
```

**Chi tiết data cần implement:**

- [ ] 16 star combination patterns
- [ ] 14 miếu-vượng-hãm entries
- [ ] Nature modifiers khi miếu vs hãm

#### 1.3 `public/tu-vi-templates.js`

```javascript
/**
 * TEMPLATES LỜI LUẬN GIẢI
 * Phong cách chuyên gia lâu năm, điềm đạm, sắc sảo
 */
const TuViTemplates = {
    // Templates theo severity
    critical: { prefix: '⚠️', style: 'warning' },
    important: { prefix: '📌', style: 'info' },
    info: { prefix: '💡', style: 'subtle' },
    
    // Templates theo category
    byCategory: {
        realty_spiritual: [...],
        health: [...],
        relationship_conflict: [...],
        celebration: [...]
    },
    
    // Lời khuyên hóa giải
    adviceTemplates: {
        tang_mon: 'Nên thăm viếng, tu sửa mộ phần tổ tiên...',
        tu_sat: 'Nên cẩn trọng di chuyển, tránh mạo hiểm...',
        // ...
    }
};
```

### Acceptance Criteria Phase 1

- [ ] 3 file .js được tạo với đầy đủ data
- [ ] Data đúng với knowledge base
- [ ] Có JSDoc cho mỗi constant
- [ ] Không hard-code text (dùng template)

---

## PHASE 2: Logic Engine (Event Scanner) ⭐⭐⭐⭐

### Mục tiêu

Xây dựng module `tu-vi-event-scanner.js` có khả năng:

1. Quét 12 cung + xung chiếu + tam hợp + giáp cung
2. Match bộ sao với rules
3. Tính trọng số có xét Tuần/Triệt
4. Output danh sách events có score + severity

### File cần tạo: `public/tu-vi-event-scanner.js`

```javascript
const TuViEventScanner = (function() {
    'use strict';
    
    // === Core Functions ===
    
    // 1. Lấy cung đối chiếu
    function getDoiCung(pos) { return (pos + 6) % 12; }
    
    // 2. Lấy tam hợp
    function getTamHop(pos) { return [(pos + 4) % 12, (pos + 8) % 12]; }
    
    // 3. Lấy giáp cung
    function getGiapCung(pos) { return [(pos + 1) % 12, (pos - 1 + 12) % 12]; }
    
    // 4. Tìm vị trí cung theo tên
    function findCungPos(cungName, cungMap) {
        for (let i = 0; i < 12; i++) {
            if (cungMap[i] && cungMap[i].includes(cungName.toUpperCase())) return i;
        }
        return -1;
    }
    
    // 5. Match bộ sao
    function matchStarCombo(requiredStars, actualStars) {
        const actualNames = actualStars.map(s => s.name);
        return requiredStars.filter(s => actualNames.includes(s)).length;
    }
    
    // 6. Check miếu/hãm
    function getStarStatus(starName, cungPos) {
        const mieuHam = TuViStarPatterns.MIEU_HAM[starName];
        if (!mieuHam) return 'binh';
        if (mieuHam.mieu.includes(cungPos)) return 'mieu';
        if (mieuHam.vuong && mieuHam.vuong.includes(cungPos)) return 'vuong';
        if (mieuHam.ham.includes(cungPos)) return 'ham';
        return 'binh';
    }
    
    // 7. Điều chỉnh Tuần/Triệt
    function adjustTuanTriet(score, cungPos, tuanTriet) {
        if (tuanTriet.tuan.includes(cungPos)) score *= 0.5;
        if (tuanTriet.triet.includes(cungPos)) score *= 0.7;
        return score;
    }
    
    // === Main Scanner ===
    function scan(lasoData) {
        const events = [];
        const rules = TuViEventRules.RULES;
        
        for (const rule of rules) {
            const result = evaluateRule(rule, lasoData);
            if (result.score >= rule.threshold) {
                events.push(result);
            }
        }
        
        return events.sort((a, b) => b.score - a.score);
    }
    
    function evaluateRule(rule, lasoData) {
        // ... (implement theo pseudo-code trong knowledge base)
    }
    
    return { scan, getDoiCung, getTamHop, getGiapCung };
})();
```

### Acceptance Criteria Phase 2

- [ ] `scan()` trả về array events đúng format
- [ ] Xung chiếu hoạt động (test: nếu Hoá Kỵ ở Thiên Di → detect ảnh hưởng Mệnh)
- [ ] Tam hợp hoạt động (test: sao ở cung tam hợp được tính)
- [ ] Giáp cung hoạt động
- [ ] Tuần/Triệt giảm score đúng
- [ ] Test với ít nhất 3 lá số khác nhau

---

## PHASE 3: Integration (Tích hợp vào hệ thống hiện tại) ⭐⭐⭐

### 3.1 `public/tu-vi-interpret.js` update

**Cập nhật `analyzeVanHan()`:**

```javascript
function analyzeVanHan(lasoData) {
    // Existing code...
    
    // MỚI: Event scanning
    const events = TuViEventScanner.scan(lasoData);
    
    // Thêm events vào result
    return {
        daiVan: {...},
        tieuVan: {...},
        luuTuHoa: {...},
        events: events,  // ← MỚI
        overall: generateOverallFromEvents(events),  // ← TỐT HƠN
        rating: calculateRatingFromEvents(events)     // ← CHÍNH XÁC HƠN
    };
}
```

**Cập nhật `renderInterpretation()`:**

- Thêm section "Sự Kiện Quan Trọng" trước Palace cards
- Mỗi event = 1 card với severity badge (⚠️/📌/💡)
- Click expand để xem chi tiết + lời khuyên

### 3.2 `public/index.html` update

- Load 3 file data mới (`<script>` tags)
- Load `tu-vi-event-scanner.js`

### 3.3 `public/styles.css` update

- Thêm styles cho event cards
- Severity colors: critical (red), important (amber), info (blue)
- Animation khi expand

### Acceptance Criteria Phase 3

- [ ] Events hiển thị trong phần Vận Hạn
- [ ] Severity badges hoạt động
- [ ] Expandable cards
- [ ] Mobile responsive
- [ ] Không break UI hiện tại

---

## PHASE 4: AI Enhancement ⭐⭐

### 4.1 `server/gemini.js` update

**Cập nhật `buildPrompt()`:**

```javascript
// Thêm section events vào prompt
let eventInfo = '';
if (data.vanHan && data.vanHan.events) {
    eventInfo = '\n## SỰ KIỆN PHÁT HIỆN TỪ EVENT SCANNER:\n';
    data.vanHan.events.forEach(e => {
        eventInfo += `- [${e.severity}] ${e.title}: ${e.description}\n`;
    });
    eventInfo += '\nHãy phân tích sâu hơn các sự kiện trên, đặc biệt các sự kiện Critical.\n';
}
```

**Cập nhật parseAiResponse():**

- Thêm section "Sự Kiện & Dự Báo" vào titles/icons

### 4.2 System Prompt Upgrade

- Cung cấp knowledge base (thu gọn) như một phần của system context
- AI sẽ biết cách diễn giải bộ sao thay vì chỉ liệt kê

### Acceptance Criteria Phase 4

- [ ] AI prompt có event scan results
- [ ] AI response đề cập đến events cụ thể
- [ ] Lời luận mang phong cách "chuyên gia lâu năm"
- [ ] Đặc biệt phần âm phần/tâm linh phải sâu

---

## THỨ TỰ TRIỂN KHAI

| # | Phase | Files | Độ phức tạp | Dep | Ước lượng |
|---|---|---|---|---|---|
| 1 | Data Layer | 3 files mới | ⭐⭐⭐ | Không | 2-3 sessions |
| 2 | Logic Engine | 1 file mới | ⭐⭐⭐⭐ | Phase 1 | 2-3 sessions |
| 3 | Integration | 4 files sửa | ⭐⭐⭐ | Phase 2 | 1-2 sessions |
| 4 | AI Enhancement | 1 file sửa | ⭐⭐ | Phase 3 | 1 session |

---

## FILE MAP

```
public/
├── tu-vi-event-rules.js      ← Phase 1: 26 event rules + categories
├── tu-vi-star-patterns.js     ← Phase 1: 16 patterns + miếu/hãm
├── tu-vi-templates.js         ← Phase 1: Templates luận giải
├── tu-vi-event-scanner.js     ← Phase 2: Logic Engine
├── tu-vi-interpret.js         ← Phase 3: Integration (sửa)
├── tu-vi-render.js            ← Phase 3: Render event cards (sửa)
├── styles.css                 ← Phase 3: Styles mới (sửa)
├── index.html                 ← Phase 3: Load files mới (sửa)
└── ...

server/
├── gemini.js                  ← Phase 4: Enhanced prompts (sửa)
└── ...

.agent/
├── knowledge/
│   └── tu-vi-logic-engine.md  ← Knowledge Base (đã tạo)
└── tasks/
    ├── dai-van-tieu-van.md    ← Task cũ (dependency)
    └── big-update-luan-giai.md ← Task này
```

---

## TEST STRATEGY

### Test Case 1: Âm phần detection

- Input: Lá số có Tang Môn + Điếu Khách tại cung Phúc Đức
- Expected: Event RS03 fired, severity = critical
- Verify: Description đề cập "mồ mả tổ tiên"

### Test Case 2: Tai nạn detection

- Input: Kình Dương + Đà La + Hoả Tinh tại Tật Ách
- Expected: Event H01 fired, severity = critical
- Verify: Description đề cập "tai nạn chân tay"

### Test Case 3: Cưới hỏi detection

- Input: Hồng Loan + Thiên Hỷ tại Phu Thê + Lưu Đào Hoa chiếu
- Expected: Event C01 fired, severity = important
- Verify: Description đề cập "hỷ sự"

### Test Case 4: Tuần/Triệt giảm score

- Input: Tang Môn bị Tuần ở Phúc Đức
- Expected: Event RS03 score giảm 50%
- Verify: Severity giảm từ critical → important hoặc info
