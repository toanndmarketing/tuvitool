# Feature Specification: Tử Vi Lá Số Platform

**Feature Branch**: `001-tuvi-laso-platform`
**Created**: 2026-02-16
**Status**: Draft
**Input**: Đặc tả toàn diện hệ thống Tử Vi Lá Số - tính toán lá số Tử Vi cổ truyền, Thần Số Học Pythagoras, và phân tích AI chuyên sâu qua Google Gemini.

---

## 1. Tổng Quan Dự Án

### 1.1 Mô tả

**Tử Vi Lá Số Tool** là ứng dụng web **single-page** chuyên tính toán và phân tích:
- **Tử Vi** (Chinese Astrology / Zi Wei Dou Shu): Lá số 12 cung, 14 chính tinh, 60+ phụ tinh, Đại Vận, Tiểu Vận, Lưu Niên
- **Thần Số Học** (Pythagorean Numerology): 15+ chỉ số từ ngày sinh và họ tên

Tích hợp **Google Gemini AI** để cung cấp phân tích sâu, cá nhân hóa dựa trên tổ hợp sao thật trong lá số.

### 1.2 Tech Stack

| Thành Phần | Công Nghệ | Phiên Bản |
|---|---|---|
| **Backend Runtime** | Node.js | 20 (Alpine) |
| **Web Framework** | Express.js | ^4.21.0 |
| **Database** | SQLite (better-sqlite3) | ^11.7.0 |
| **AI Engine** | Google Gemini API | gemini-2.0-flash |
| **Security** | Helmet + express-rate-limit | ^8.0.0 / ^7.4.0 |
| **Frontend** | Vanilla HTML5 + CSS3 + JavaScript | ES6+ |
| **Containerization** | Docker + Docker Compose | Alpine-based |
| **Port** | 8950 | Fixed |

### 1.3 Kiến Trúc Tổng Quan

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
│                                                          │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │ app.js   │  │ auth.js   │  │ am-lich.js           │  │
│  │ (Router) │  │ (Session) │  │ (Solar→Lunar convert)│  │
│  └────┬─────┘  └─────┬─────┘  └──────────┬───────────┘  │
│       │               │                    │              │
│  ┌────┴────────────────┴────────────────────┴──────────┐  │
│  │              TỬ VI ENGINE (Client-side)              │  │
│  │  ┌─────────┐  ┌──────────┐  ┌───────────────────┐   │  │
│  │  │tu-vi-   │  │tu-vi-    │  │tu-vi-star-        │   │  │
│  │  │calc.js  │  │sao.js    │  │patterns.js        │   │  │
│  │  │(Mệnh,   │  │(14 Chính │  │(Miếu Hãm, Bộ sao │   │  │
│  │  │Thân,Cục)│  │ +60 Phụ) │  │ đặc biệt)         │   │  │
│  │  └─────────┘  └──────────┘  └───────────────────┘   │  │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────────────┐   │  │
│  │  │tu-vi-    │ │tu-vi-event-│ │tu-vi-event-      │   │  │
│  │  │luu-nien  │ │scanner.js  │ │rules.js          │   │  │
│  │  │.js       │ │(Logic Eng.)│ │(26 rules×4 cats) │   │  │
│  │  └──────────┘ └────────────┘ └──────────────────┘   │  │
│  │  ┌──────────┐ ┌────────────┐ ┌──────────────────┐   │  │
│  │  │tu-vi-    │ │tu-vi-      │ │tu-vi-render.js   │   │  │
│  │  │interpret │ │templates   │ │(4x4 Grid Layout) │   │  │
│  │  │.js       │ │.js         │ │                   │   │  │
│  │  └──────────┘ └────────────┘ └──────────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │         THẦN SỐ HỌC ENGINE (Client-side)            │  │
│  │  ┌────────────┐ ┌─────────────┐ ┌───────────────┐   │  │
│  │  │than-so-    │ │than-so-hoc- │ │than-so-hoc-   │   │  │
│  │  │hoc.js      │ │data.js      │ │render.js      │   │  │
│  │  │(Engine)    │ │(Luận giải)  │ │(UI Render)    │   │  │
│  │  └────────────┘ └─────────────┘ └───────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / REST API
┌──────────────────────────┴──────────────────────────────┐
│                     SERVER (Express.js)                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│  │server.js │  │db.js     │  │gemini.js             │   │
│  │(Routes)  │  │(SQLite)  │  │(AI Integration)      │   │
│  └──────────┘  └──────────┘  └──────────────────────┘   │
│                                                          │
│  Storage: ./data/tuvi.db (SQLite)                        │
└──────────────────────────────────────────────────────────┘
```

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Tính Toán Lá Số Tử Vi (Priority: P0)

Một người dùng nhập thông tin sinh (ngày/giờ/giới tính), hệ thống tính toán đầy đủ lá số Tử Vi với 12 cung, 14 chính tinh, 60+ phụ tinh, vòng Tràng Sinh, Đại Vận, Tiểu Vận, vận hạn lưu niên, và hiển thị lên giao diện lưới 4×4 chuẩn.

**Why this priority**: Đây là chức năng core, nền tảng của toàn bộ ứng dụng. Không có tính toán chính xác thì mọi phân tích phía sau đều vô nghĩa.

**Independent Test**: Nhập thông tin sinh chuẩn Nguyễn Đức Toàn (14/07/1996, giờ Thìn, Nam) → so sánh kết quả với bảng tham chiếu chuẩn.

**Acceptance Scenarios**:

1. **Given** người dùng chọn ngày Dương lịch 14/07/1996, **When** hệ thống chuyển đổi, **Then** Âm lịch trả về đúng: 29 tháng 5 năm Bính Tý.
2. **Given** thông tin sinh (Bính Tý, tháng 5, giờ Thìn, Nam), **When** tính toán, **Then** Cung Mệnh ở đúng vị trí, Mệnh Nạp Âm = "Giản Hạ Thuỷ" (hoặc theo bảng Nạp Âm 60 Hoa Giáp).
3. **Given** lá số đã tính Cục và Mệnh, **When** an sao, **Then** 14 chính tinh (Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh + Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân) được đặt đúng vị trí.
4. **Given** 14 chính tinh đã an, **When** an phụ tinh, **Then** tất cả phụ tinh (Tả Phụ, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt, Lộc Tồn, Kình Dương, Đà La, Thiên Mã, Tứ Hóa, Hoả Tinh, Linh Tinh, Địa Không, Địa Kiếp, vòng Bác Sĩ 12 sao...) nằm đúng vị trí.
5. **Given** lá số hoàn chỉnh, **When** render, **Then** hiển thị lưới 4×4 với 12 cung xung quanh + 2×2 trung tâm, mỗi cung hiển thị: tên cung, Địa Chi prefix, danh sách sao (chính tinh đỏ, phụ tinh xanh, lưu niên vàng), trạng thái Tràng Sinh, thông tin Tuần/Triệt.

---

### User Story 2 - Phân Tích Vận Hạn Lưu Niên (Priority: P0)

Một người dùng chọn năm xem, hệ thống tự động:
- An sao lưu niên (Lưu Thái Tuế, Lưu Kình Dương, Lưu Đà La, Lưu Thiên Mã, Lưu Lộc Tồn, Lưu Tứ Hóa, Lưu Văn Xương, Lưu Văn Khúc, Lưu Thiên Khôi, Lưu Thiên Việt...) 
- Quét toàn bộ lá số bằng Event Scanner (26 rules × 4 categories)
- Luận giải chi tiết P2-P6 (Lưu Tứ Hóa, Trigger Logic, Lưu Thái Tuế, Nguyệt Hạn 12 tháng, Energy Score)

**Why this priority**: Vận hạn lưu niên là thông tin được người dùng quan tâm nhất - trả lời câu hỏi "Năm nay tôi gặp gì?"

**Independent Test**: Với data chuẩn Nguyễn Đức Toàn, xem năm 2026, so sánh events + patterns + energy score.

**Acceptance Scenarios**:

1. **Given** lá số và năm xem 2026, **When** an sao lưu niên, **Then** các sao lưu được đặt đúng vị trí dựa trên Can Chi năm xem.
2. **Given** sao lưu đã an, **When** Event Scanner quét, **Then** trả về events thuộc 4 nhóm: Địa Ốc & Âm Phần (RS01-RS07), Sức Khỏe (H01-H08), Quan Hệ & Thị Phi (RC01-RC07), Hỷ Tín & Vận May (C01-C07).
3. **Given** events đã quét, **When** scan patterns, **Then** nhận diện các Bộ sao đặc biệt (Đại Hung, Đại Cát, Tâm Linh) trên toàn bộ 12 cung.
4. **Given** toàn bộ dữ liệu, **When** render interpretation, **Then** hiển thị tổng quan lá số, chi tiết từng cung, vận hạn, events, AI analysis section.

---

### User Story 3 - Phân Tích AI Chuyên Sâu via Gemini (Priority: P1)

Một người dùng đã đăng nhập yêu cầu phân tích AI chuyên sâu. Hệ thống gửi compact data đến Google Gemini API, nhận lại luận giải sâu theo phong cách chuyên gia Tử Vi, hiển thị trong UI.

**Why this priority**: AI analysis tạo giá trị khác biệt so với các tool Tử Vi thông thường, nhưng phụ thuộc vào Engine đã chạy đúng.

**Independent Test**: Đăng nhập → Tạo lá số → Click "Phân tích AI" → Nhận kết quả AI structured.

**Acceptance Scenarios**:

1. **Given** người dùng chưa đăng nhập, **When** click "Phân tích AI", **Then** hiển thị modal yêu cầu đăng nhập.
2. **Given** người dùng đã đăng nhập, **When** yêu cầu AI analysis, **Then** hệ thống gửi compact data (chỉ raw data tối thiểu: mệnh, cục, sao, cung) đến Gemini API.
3. **Given** Gemini trả về response, **When** parse kết quả, **Then** structured thành các sections per-palace `[CUNG_NAME]` hoặc 8 general sections.
4. **Given** cùng tổ hợp sao (cache key = "DNA" của lá số), **When** 2 người khác nhau có cùng vị trí sao, **Then** dùng chung 1 kết quả AI (cache 24h).
5. **Given** Gemini API lỗi hoặc timeout, **When** có cache cũ trong DB, **Then** trả về cache. **When** không có cache, **Then** hiển thị lỗi thân thiện.

---

### User Story 4 - Tính Toán Thần Số Học Pythagoras (Priority: P1)

Người dùng chuyển sang tab "Thần Số Học", nhập ngày sinh + họ tên đầy đủ → hệ thống tính toán 15+ chỉ số Pythagoras và render kết quả luận giải.

**Why this priority**: Thần Số Học là tính năng bổ sung nâng giá trị sản phẩm, hoạt động độc lập với Tử Vi.

**Independent Test**: Nhập "Nguyễn Đức Toàn", 14/07/1996 → kiểm tra Số Chủ Đạo, Biểu đồ 3×3, Mũi tên cá tính.

**Acceptance Scenarios**:

1. **Given** ngày sinh 14/07/1996, **When** tính Số Chủ Đạo (Life Path), **Then** kết quả = reduceToSingleDigit(1+4 + 0+7 + 1+9+9+6), giữ Master Number (11, 22, 33).
2. **Given** họ tên "Nguyễn Đức Toàn", **When** xử lý tiếng Việt, **Then** bỏ dấu thành "nguyen duc toan", áp dụng LETTER_MAP Pythagoras để tính Soul Urge (nguyên âm), Personality (phụ âm), Expression (tất cả).
3. **Given** đầy đủ input, **When** tính toán, **Then** trả về: Life Path, Birth Day, Attitude, Soul Urge, Personality, Expression, Maturity, Personal Year/Month, Birth Chart 3×3, Arrows, Missing/Dominant Numbers, Pinnacle Cycles, Challenge Numbers, Bridge Numbers.
4. **Given** kết quả đã tính, **When** render UI, **Then** hiển thị 7 sections: Thông tin cá nhân, Số Chủ Đạo, Biểu đồ 3×3, Chỉ số từ tên, Năm cá nhân timeline, Chu kỳ đỉnh cao, Số thiếu & mạnh.

---

### User Story 5 - Xác Thực Người Dùng (Priority: P1)

Người dùng đăng nhập để unlock tính năng AI phân tích chuyên sâu. Hệ thống dùng session-based auth đơn giản (in-memory token).

**Why this priority**: Bảo vệ API Gemini (có cost) khỏi lạm dụng.

**Independent Test**: Thử đăng nhập sai → lỗi. Đăng nhập đúng → token 30 phút. Gọi AI API → thành công.

**Acceptance Scenarios**:

1. **Given** credentials đúng (match env AUTH_USERNAME + AUTH_PASSWORD), **When** POST `/api/auth/login`, **Then** trả về token string, lưu in-memory với expiry 30 phút.
2. **Given** token hợp lệ, **When** gửi request POST `/api/interpret/ai` với Bearer token, **Then** middleware `requireAuth` cho phép đi tiếp.
3. **Given** token hết hạn hoặc sai, **When** gọi API AI, **Then** trả về 401 Unauthorized.
4. **Given** đăng nhập thành công, **When** client lưu session vào sessionStorage, **Then** session auto-expire sau 30 phút.

---

### Edge Cases

- **Ngày Âm lịch nhuận**: Khi tháng sinh Âm lịch là tháng nhuận, hệ thống PHẢI xử lý đúng offset New Moon.
- **Giờ sinh Tý tảo/Tý chính**: Tý (23h-1h) có thể thuộc ngày trước hoặc ngày sau, ảnh hưởng Can Chi ngày → ảnh hưởng toàn bộ lá số.
- **Tên tiếng Việt có dấu**: Bỏ dấu PHẢI chính xác cho tất cả ký tự Unicode Việt (ư, ơ, ă, ê, ô, đ...).
- **Master Numbers**: Reduce PHẢI giữ 11, 22, 33 khi `keepMaster = true`.
- **Gemini rate limit**: API có giới hạn requests/phút. Hệ thống PHẢI có `aiLimiter` riêng.
- **Cache collision**: Cache key DÃ hash phải đủ chi tiết để tránh collision giữa 2 lá số gần giống.
- **Empty star positions**: Có cung không chứa chính tinh → render PHẢI xử lý array rỗng.

---

## 3. Requirements *(mandatory)*

### Functional Requirements

#### Module Tử Vi (M-TV)

- **FR-TV-001**: Hệ thống PHẢI chuyển đổi Dương lịch → Âm lịch chính xác (thuật toán Hồ Ngọc Đức) với timezone +7.
- **FR-TV-002**: Hệ thống PHẢI tính Can Chi năm/tháng/ngày/giờ từ dữ liệu Âm lịch.
- **FR-TV-003**: Hệ thống PHẢI xác định Âm/Dương (theo Can năm + giới tính) và chiều thuận/nghịch.
- **FR-TV-004**: Hệ thống PHẢI tính đúng vị trí Cung Mệnh = `(2 + thangAL - 1 - chiGio + 12) % 12`.
- **FR-TV-005**: Hệ thống PHẢI tính đúng vị trí Cung Thân = `(chiGio + thangAL - 1 + 2) % 12`.
- **FR-TV-006**: Hệ thống PHẢI xác định Cục (Ngũ Hành Cục: 2-6) dựa vào Can năm + Cung Mệnh.
- **FR-TV-007**: Hệ thống PHẢI xác định Mệnh Nạp Âm từ bảng 60 Hoa Giáp.
- **FR-TV-008**: Hệ thống PHẢI an 14 chính tinh theo 2 nhóm: Tử Vi (6 sao, đi nghịch) + Thiên Phủ (8 sao, đi thuận).
- **FR-TV-009**: Hệ thống PHẢI an đầy đủ 60+ phụ tinh theo đúng quy tắc (theo tháng, giờ, Can năm, Chi năm, ngày).
- **FR-TV-010**: Hệ thống PHẢI an vòng Tràng Sinh (12 trạng thái) theo Cục và chiều thuận/nghịch.
- **FR-TV-011**: Hệ thống PHẢI an Tuần Không + Triệt Lộ chính xác.
- **FR-TV-012**: Hệ thống PHẢI an 12 cung (Mệnh → Phụ Mẫu) đi ngược chiều kim đồng hồ từ Cung Mệnh.
- **FR-TV-013**: Hệ thống PHẢI tính Đại Vận (theo Cục × tuổi khởi hành) và Tiểu Vận.
- **FR-TV-014**: Hệ thống PHẢI an sao Lưu Niên đầy đủ (Lưu Thái Tuế, Lưu Kình Dương, Lưu Đà La, Lưu Thiên Mã, Lưu Lộc Tồn, Lưu Tứ Hóa, Lưu Văn Xương, Lưu Văn Khúc, Lưu Thiên Khôi, Lưu Thiên Việt, Lưu Tả Phụ, Lưu Hữu Bật).
- **FR-TV-015**: Hệ thống PHẢI xác định Miếu/Vượng/Đắc/Hãm cho 14 chính tinh theo bảng chuẩn.
- **FR-TV-016**: Hệ thống PHẢI nhận diện 5 Bộ Đại Hung (Tứ Sát hội tụ, Sát Phá Liêm, Cự Kỵ hung, Liêm Tham đồng hãm, Diêu Kỵ Song Hao), 5 Bộ Đại Cát, 3 Bộ Tâm Linh.
- **FR-TV-017**: Hệ thống PHẢI quét 26 event rules × 4 categories (Địa Ốc 7, Sức Khỏe 8, Quan Hệ 6, Hỷ Tín 5+) với threshold scoring.
- **FR-TV-018**: Hệ thống PHẢI render lá số dạng lưới 4×4 (12 cung ngoài + 2×2 center) với CSS grid.

#### Module Lưu Niên Nâng Cao (M-LN)

- **FR-LN-001**: Hệ thống PHẢI luận giải Lưu Tứ Hóa (P2) - Lw Lộc/Quyền/Khoa/Kỵ rơi vào cung nào → ý nghĩa theo LUU_HOA_MEANING map.
- **FR-LN-002**: Hệ thống PHẢI phân tích Trigger Logic (P3) - overlay hung tinh gốc + hung tinh lưu → hệ số nhân cảnh báo.
- **FR-LN-003**: Hệ thống PHẢI phân tích Lưu Thái Tuế (P4) - cung bị "động" + tương tác sao gốc.
- **FR-LN-004**: Hệ thống PHẢI phân tích Nguyệt Hạn 12 tháng (P5) - mỗi tháng: cung qua + sao + điểm năng lượng.
- **FR-LN-005**: Hệ thống PHẢI tính Energy Score (P6) - 3 trụ: Tài chính, Sức khỏe, Tình cảm (JSON format).
- **FR-LN-006**: Hệ thống PHẢI so sánh vận hạn năm trước (buildPrevYearSummary) để ứng số.

#### Module Thần Số Học (M-TSH)

- **FR-TSH-001**: Hệ thống PHẢI tính 15+ chỉ số Pythagoras: Life Path, Birth Day, Attitude, Soul Urge, Personality, Expression, Maturity, Personal Year/Month, Birth Chart 3×3, Arrows, Missing/Dominant, Pinnacle Cycles (4 chu kỳ), Challenge Numbers (4 chu kỳ), Bridge Numbers.
- **FR-TSH-002**: Hệ thống PHẢI xử lý tên tiếng Việt: bỏ dấu Unicode → chữ Latin thuần → map sang số Pythagoras.
- **FR-TSH-003**: Hệ thống PHẢI hỗ trợ Master Numbers (11, 22, 33) - KHÔNG rút gọn trong Life Path và Expression.
- **FR-TSH-004**: Hệ thống PHẢI có data luận giải chi tiết cho tất cả chỉ số (LIFE_PATH, BIRTH_DAY, ATTITUDE, SOUL_URGE, PERSONALITY, EXPRESSION, PERSONAL_YEAR, ARROW meanings).
- **FR-TSH-005**: Hệ thống PHẢI render Biểu đồ 3×3 Pythagoras (layout: 369/258/147) với highlight số có/thiếu.

#### Module Authentication (M-AUTH)

- **FR-AUTH-001**: Hệ thống PHẢI xác thực user bằng username/password khớp với biến ENV.
- **FR-AUTH-002**: Hệ thống PHẢI cấp token random (32 bytes hex) với thời hạn 30 phút.
- **FR-AUTH-003**: Hệ thống PHẢI validate token qua middleware `requireAuth` cho các endpoint AI.
- **FR-AUTH-004**: Hệ thống PHẢI lưu token in-memory (Map) - auto-expire khi hết hạn.
- **FR-AUTH-005**: Client PHẢI lưu session vào `sessionStorage` (không persist qua tab mới hoặc reload browser).

#### Module AI Interpretation (M-AI)

- **FR-AI-001**: Hệ thống PHẢI gửi compact JSON data đến Gemini API (không nhồi template text, chỉ raw data).
- **FR-AI-002**: Hệ thống PHẢI build cache key từ "DNA" lá số: Cục + Mệnh + vị trí sao + Chi năm xem → MD5 hash.
- **FR-AI-003**: Hệ thống PHẢI cache AI response vào SQLite với TTL 24 giờ.
- **FR-AI-004**: Hệ thống PHẢI parse AI response thành structured sections (per-palace hoặc 8 general sections).
- **FR-AI-005**: Hệ thống PHẢI build prompt system instruction với role "Chuyên gia Tử Vi kinh nghiệm 30+ năm".
- **FR-AI-006**: Compact data PHẢI bao gồm: thông tin cơ bản, 12 cung (sao + trạng thái Miếu/Hãm), vận hạn, lưu niên, so sánh năm trước.

#### Module API & Server (M-API)

- **FR-API-001**: Hệ thống PHẢI serve static files từ `public/` directory.
- **FR-API-002**: Hệ thống PHẢI cung cấp API: `GET /api/interpretations/sao`, `GET /api/interpretations/cung`, `GET /api/interpretations/special`, `GET /api/interpretations/all`.
- **FR-API-003**: Hệ thống PHẢI cung cấp API: `POST /api/auth/login` (rate limited).
- **FR-API-004**: Hệ thống PHẢI cung cấp API: `POST /api/interpret/ai` (rate limited + auth required).
- **FR-API-005**: Hệ thống PHẢI serve SPA fallback: tất cả routes → `index.html`.
- **FR-API-006**: Hệ thống PHẢI apply Helmet security headers + CORS + CSP.
- **FR-API-007**: Hệ thống PHẢI apply rate limiting: API general (100 req/15min), AI specific (10 req/15min).

### Non-Functional Requirements

- **NFR-001**: Thời gian tính toán lá số (client-side) PHẢI < 100ms.
- **NFR-002**: AI response time (bao gồm Gemini API) PHẢI < 30 giây.
- **NFR-003**: UI PHẢI responsive trên mobile (min 320px) và desktop.
- **NFR-004**: Ứng dụng PHẢI chạy hoàn toàn trong Docker container trên port 8950.
- **NFR-005**: Database (SQLite) PHẢI persistent qua Docker volume `./data`.
- **NFR-006**: Tất cả ENV variables PHẢI configurable qua file `.env`.
- **NFR-007**: Security: PHẢI validate tất cả input, escape HTML output, không expose stack trace.
- **NFR-008**: Tất cả dữ liệu Tử Vi (sao, cung, template) PHẢI hardcode chính xác theo sách chuẩn - KHÔNG được AI hallucinate.

---

## 4. Data Models

### 4.1 Database Schema (SQLite)

```sql
-- Bảng diễn giải Sao
CREATE TABLE IF NOT EXISTS sao_interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sao_name TEXT UNIQUE NOT NULL,       -- Tên sao: "Tử Vi", "Thiên Cơ"...
    sao_type TEXT NOT NULL,               -- "chinh" | "phu"
    nature TEXT NOT NULL,                 -- "cat" | "hung" | "trung"
    overview TEXT,                        -- Tổng quan ý nghĩa
    in_menh TEXT,                         -- Khi tại cung Mệnh
    in_tai TEXT,                          -- Khi tại cung Tài Bạch
    in_quan TEXT,                         -- Khi tại cung Quan Lộc
    in_phu_the TEXT,                      -- Khi tại cung Phu Thê
    in_tat_ach TEXT                       -- Khi tại cung Tật Ách
);

-- Bảng diễn giải Cung
CREATE TABLE IF NOT EXISTS cung_interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cung_name TEXT UNIQUE NOT NULL,       -- "MỆNH", "PHU THÊ"...
    overview TEXT,                        -- Tổng quan ý nghĩa cung
    with_chinh_tinh TEXT,                 -- Khi có chính tinh
    with_sat_tinh TEXT                    -- Khi có sát tinh
);

-- Bảng diễn giải đặc biệt
CREATE TABLE IF NOT EXISTS special_interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    condition_key TEXT UNIQUE NOT NULL,   -- Key: "song_loc", "cu_ky_menh"...
    condition_name TEXT,                  -- Tên điều kiện
    description TEXT,                     -- Mô tả chi tiết
    advice TEXT                           -- Lời khuyên
);

-- Cache AI responses
CREATE TABLE IF NOT EXISTS ai_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cache_key TEXT UNIQUE NOT NULL,       -- MD5 hash of chart DNA
    response TEXT NOT NULL,               -- JSON string of AI response
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL          -- TTL 24 hours
);
```

### 4.2 Frontend Data Objects

```javascript
// LasoData - Object chính chứa toàn bộ thông tin lá số
{
    // Input
    hoTen: string,
    gioiTinh: "nam" | "nu",
    ngaySinh: "YYYY-MM-DD",  // Dương lịch
    
    // Âm lịch
    ngayAL: number,          // 1-30
    thangAL: number,         // 1-12
    namAL: number,           // Năm âm lịch
    chiGio: number,          // 0-11 (Tý-Hợi)
    
    // Can Chi
    canNamIndex: number,     // 0-9
    chiNamIndex: number,     // 0-11
    
    // Core calculations  
    cungMenh: number,        // Vị trí cung Mệnh (0-11)
    cungThan: number,        // Vị trí cung Thân (0-11)
    cucValue: number,        // 2-6 (Ngũ Hành Cục)
    menhNapAm: string,       // "Hải Trung Kim"...
    hanhMenh: string,        // "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ"
    hanhCuc: string,         // Hành của Cục
    thuan: boolean,          // Thuận/Nghịch
    amDuong: string,         // "Dương Nam" | "Âm Nữ"...
    
    // Maps
    cungMap: { [pos: number]: string },      // 0-11 → tên cung
    saoMap: { [pos: number]: SaoInfo[] },    // 0-11 → danh sách sao
    truongSinhMap: { [pos: number]: string },// 0-11 → trạng thái Tràng Sinh
    
    // Tuần Triệt
    tuanKhong: [number, number],             // 2 vị trí Tuần Không
    trietLo: [number, number],               // 2 vị trí Triệt Lộ
    
    // Tứ Hóa
    tuHoa: { loc: string, quyen: string, khoa: string, ky: string },
    
    // Đại Vận & Tiểu Vận
    daiVan: DaiVanInfo[],
    tieuVan: TieuVanInfo[],
    
    // Năm xem
    namXem: number,
    chiNamXem: number,
    thaiTuePos: number,
    
    // Lưu Niên
    luuNienSao: { [pos: number]: SaoInfo[] },
    luuTuHoa: { loc: string, quyen: string, khoa: string, ky: string }
}

// SaoInfo
{
    name: string,           // "Tử Vi"
    type: "chinh" | "phu" | "luu",
    nature: "cat" | "hung" | "trung",
    hoa?: "Lộc" | "Quyền" | "Khoa" | "Kỵ",
    mieuHam?: "mieu" | "vuong" | "dac" | "ham"
}
```

### 4.3 Thần Số Học Data Object

```javascript
// NumerologyResult
{
    input: { fullName, day, month, year, namXem },
    lifePath: number,        // 1-9, 11, 22, 33
    birthDay: number,
    attitude: number,
    soulUrge: number,        // Từ nguyên âm
    personality: number,     // Từ phụ âm
    expression: number,      // Từ tất cả chữ cái
    maturity: number,        // lifePath + expression
    personalYear: number,
    personalMonth: number,
    birthChart: { [1-9]: count },  // Biểu đồ 3×3
    arrows: { present: Arrow[], absent: Arrow[] },
    missingNumbers: number[],
    dominantNumbers: number[],
    pinnacles: Pinnacle[4],
    challenges: Challenge[4],
    bridgeNumbers: { [pair]: number },
    nameBreakdown: { vowels: [], consonants: [], all: [] }
}
```

---

## 5. API Endpoints

### 5.1 Authentication

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/api/auth/login` | No | 100/15min | Đăng nhập, trả về token |

**Request**:
```json
{ "username": "string", "password": "string" }
```

**Response 200**:
```json
{ "token": "hex_string_64_chars" }
```

**Response 401**:
```json
{ "error": "Sai thông tin đăng nhập" }
```

### 5.2 Interpretation Data

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| GET | `/api/interpretations/sao` | No | 100/15min | Tất cả data diễn giải sao |
| GET | `/api/interpretations/cung` | No | 100/15min | Tất cả data diễn giải cung |
| GET | `/api/interpretations/special` | No | 100/15min | Data diễn giải đặc biệt |
| GET | `/api/interpretations/all` | No | 100/15min | Combined: sao + cung + special |

**Response `/api/interpretations/all` 200**:
```json
{
    "sao": {
        "Tử Vi": { "type": "chinh", "nature": "cat", "overview": "...", "in_menh": "...", ... }
    },
    "cung": {
        "MỆNH": { "overview": "...", "with_chinh_tinh": "...", "with_sat_tinh": "..." }
    },
    "special": {
        "song_loc": { "name": "...", "description": "...", "advice": "..." }
    }
}
```

### 5.3 AI Interpretation

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | `/api/interpret/ai` | Bearer Token | 10/15min | Gọi Gemini AI phân tích |

**Request**: Full `interpretationData` object (overview, cung details, vận hạn, lưu niên data)

**Response 200**:
```json
{
    "sections": { ... },    // Structured AI analysis
    "cached": false,
    "model": "gemini-2.0-flash"
}
```

### 5.4 Health Check

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| GET | `/api/health` | No | None | Docker healthcheck |

---

## 6. Module Dependencies & File Map

### 6.1 Server-side Files

| File | Size | Responsibility |
|---|---|---|
| `server/server.js` | 9.5 KB | Express app, routes, middleware, auth logic |
| `server/db.js` | 25 KB | SQLite setup, seed data, query functions |
| `server/gemini.js` | 19 KB | Gemini API integration, prompt building, cache, response parsing |
| `server/package.json` | 433 B | Dependencies declaration |

### 6.2 Client-side Files (Execution Order)

| File | Size | Dependencies | Responsibility |
|---|---|---|---|
| `public/am-lich.js` | 11.3 KB | None | Chuyển đổi Solar↔Lunar, Can Chi |
| `public/tu-vi-calc.js` | 20.5 KB | AmLich | Tính toán core: Mệnh, Thân, Cục, Cung, Tràng Sinh, Đại/Tiểu Vận, Tuần/Triệt |
| `public/tu-vi-sao.js` | 31.9 KB | None (dùng index) | An 14 chính tinh + 60+ phụ tinh |
| `public/tu-vi-star-patterns.js` | 63.9 KB | None (data) | Bảng Miếu Hãm, 13+ bộ sao đặc biệt |
| `public/tu-vi-event-rules.js` | 25.6 KB | None (data) | 26 event rules × 4 categories |
| `public/tu-vi-templates.js` | 28.1 KB | None (data) | Mẫu lời luận giải, severity config |
| `public/tu-vi-event-scanner.js` | 27.7 KB | TuViStarPatterns, TuViEventRules, TuViTemplates | Logic engine: rule evaluation, pattern scanning |
| `public/tu-vi-luu-nien.js` | 24.2 KB | AmLich | P2-P6 phân tích lưu niên nâng cao |
| `public/tu-vi-render.js` | 14.1 KB | AmLich | Render lưới 4×4, center cell, Đại Vận timeline |
| `public/tu-vi-interpret.js` | 65 KB | TuViLuuNien, TuViEventScanner, AUTH | Orchestration: load data, analyze all, render full |
| `public/than-so-hoc.js` | 17.4 KB | None | Engine Pythagoras: 15+ calculations |
| `public/than-so-hoc-data.js` | 36.7 KB | None (data) | Data luận giải tất cả chỉ số |
| `public/than-so-hoc-render.js` | 29 KB | ThanSoHoc, ThanSoHocData | Render UI 7 sections |
| `public/auth.js` | 6.6 KB | None | Session management, login modal |
| `public/app.js` | 17.4 KB | All above | Orchestrator: form events, tab switching, generateChart() |
| `public/styles.css` | 82.6 KB | None | Full CSS (responsive, themes) |
| `public/index.html` | 10.5 KB | All JS + CSS | Single HTML page, form, sections |

### 6.3 Dependency Graph

```
app.js (Main Orchestrator)
├── AmLich (Solar↔Lunar conversion)
├── TuViCalc (Core calculations) → AmLich
├── TuViSao (Star placement)
├── TuViStarPatterns (Star attributes data)
├── TuViEventRules (Event rules data)
├── TuViTemplates (Template strings)
├── TuViEventScanner (Event engine) → TuViStarPatterns, TuViEventRules, TuViTemplates
├── TuViLuuNien (Advanced annual) → AmLich
├── TuViRender (Grid rendering) → AmLich
├── TuViInterpret (Full interpretation) → TuViLuuNien, TuViEventScanner, AUTH
├── ThanSoHoc (Numerology engine)
├── ThanSoHocData (Numerology meanings)
├── ThanSoHocRender (Numerology UI) → ThanSoHoc, ThanSoHocData
└── AUTH (Authentication)
```

---

## 7. Infrastructure & Deployment

### 7.1 Docker Configuration

- **Base Image**: `node:20-alpine`
- **Build deps**: `python3 make g++` (for better-sqlite3 native bindings)
- **Port**: `8950`
- **Volumes**: `./data:/app/data` (database persistence), `./public:/app/public` (live dev)
- **Healthcheck**: `GET http://127.0.0.1:8950/api/health` every 30s
- **Restart Policy**: `unless-stopped`

### 7.2 Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | 8950 | Server port |
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key |
| `GEMINI_MODEL` | No | gemini-2.0-flash | Gemini model version |
| `NODE_ENV` | No | production | Environment mode |
| `AUTH_USERNAME` | Yes | - | Auth username |
| `AUTH_PASSWORD` | Yes | - | Auth password |

---

## 8. Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tính toán lá số Tử Vi 100% chính xác so với bảng tham chiếu chuẩn (verified với test data Nguyễn Đức Toàn).
- **SC-002**: Tất cả 14 chính tinh + 60+ phụ tinh đặt đúng vị trí — verified bằng script tự động.
- **SC-003**: Event Scanner quét đúng events với threshold scoring — compared với manual analysis.
- **SC-004**: Thần Số Học tính đúng 15+ chỉ số — verified bằng cross-reference với ứng dụng chuẩn khác.
- **SC-005**: AI response được cache và serve từ cache khi cùng DNA — verified bằng second request cùng data.
- **SC-006**: Auth flow bảo vệ đúng endpoint AI — verified bằng test 401 without token.
- **SC-007**: UI responsive trên mobile 320px — verified bằng Chrome DevTools.
- **SC-008**: Docker container start < 15s, healthcheck pass < 30s.
- **SC-009**: Client-side calculation time < 100ms — verified bằng `performance.now()`.
- **SC-010**: Chuyển đổi Âm Dương lịch chính xác cho range 1900-2100 — verified bằng so sánh với nguồn tham chiếu.

---

## 9. Tham Chiếu Kỹ Thuật

### 9.1 Thuật Toán Tử Vi Cốt Lõi

- **An Tử Vi**: Lookup table theo Cục (2-6) × Ngày AL (1-30) → vị trí (0-11)
- **Nhóm Tử Vi**: Từ Tử Vi đi nghịch: offset [-1, -3, -4, -5, -8] → Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh
- **Nhóm Thiên Phủ**: Đối xứng qua trục Dần-Thân: `(4 - TuViPos + 12) % 12`, rồi đi thuận: +1,+2,+3,+4,+5,+6,+10 → 7 sao
- **Cục**: Bảng lookup 10 Can × 12 Cung Mệnh → giá trị 2-6

### 9.2 Thuật Toán Âm Dương Lịch

- **Nguồn**: Hồ Ngọc Đức (Đại học Leipzig)
- **Core**: Julian Day Number ↔ Solar Date, New Moon calculation, Sun Longitude
- **Timezone**: Fixed +7 (Vietnam)

### 9.3 Thần Số Học Pythagoras

- **Letter Map**: A=1, B=2, ..., I=9, J=1, K=2, ..., R=9, S=1, ..., Z=8
- **Master Numbers**: 11 (Khai Sáng), 22 (Kiến Tạo), 33 (Chữa Lành)
- **Biểu đồ 3×3**: Layout chuẩn Pythagoras (369 / 258 / 147)
- **Pinnacle Cycles**: 4 giai đoạn đời, khởi đầu tại tuổi (36 - Life Path)
