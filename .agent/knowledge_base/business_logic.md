# 💼 Business Logic — tu-vi-la-so

## Mô tả dự án
Ứng dụng Huyền Học Việt Nam tích hợp AI, cung cấp 4 công cụ chính:

### 1. Tử Vi Đẩu Số (Core Feature)
- **Input**: Tên, giới tính, ngày/giờ sinh (Dương hoặc Âm lịch), năm xem
- **Processing**: Lập lá số 12 cung, an 108+ sao, tính Cục, Tứ Hóa
- **Output**: Bảng lá số dạng lưới, diễn giải từng cung, cách cục
- **Chế độ Sinh đôi**: Hỗ trợ 2 đương số A/B cùng ngày sinh
- **AI Deep Analysis**: Gửi data compact → Gemini → parse structured response
- **Lưu Niên**: Phân tích vận hạn năm xem (Đại Vận, Tiểu Hạn, Nguyệt Hạn, Sự kiện)

### 2. Thần Số Học (Tab 2)
- **Input**: Cùng form với Tử Vi
- **Processing**: Tính các Con Số Chủ Đạo (Pythagoras)
- **Output**: Biểu đồ con số, diễn giải ý nghĩa

### 3. Kinh Dịch — Gieo Quẻ (/iching)
- **Input**: Phương thức gieo (coin), số lần (3 hoặc 6)
- **Processing**: Random + hexagram lookup
- **Output**: Quẻ + hoá quẻ + diễn giải

### 4. Soi Bài 52 Lá (/soi-bai)
- **Input**: Rút lá (count), tên, năm, giới tính, chủ đề
- **Processing**: Shuffle + draw + combo detection + remedy suggestion
- **Output**: Ý nghĩa lá bài + combo + lời khuyên

## Frontend Architecture (Vanilla JS)
| File | Size | Chức năng |
|------|------|-----------|
| `app.js` | 34KB | Main controller, form handling, tab switching |
| `am-lich.js` | 11KB | Solar ↔ Lunar calendar conversion |
| `tu-vi-calc.js` | 21KB | Core: 12 cung, Cục, an Mệnh/Thân |
| `tu-vi-sao.js` | 32KB | An 108+ sao algorithms |
| `tu-vi-render.js` | 27KB | Chart grid rendering |
| `tu-vi-interpret.js` | 69KB | Interpretation engine |
| `tu-vi-star-patterns.js` | 69KB | Hội Chiếu & Cách Cục (Tam Phương Tứ Chính) |
| `tu-vi-event-rules.js` | 26KB | Event rules definitions |
| `tu-vi-event-scanner.js` | 29KB | Event scanning engine |
| `tu-vi-luu-nien.js` | 26KB | Lưu Niên analysis |
| `tu-vi-dai-van-hoa.js` | 7KB | Đại Vận Tứ Hóa |
| `tu-vi-tinh-he.js` | 26KB | Tinh Hệ visualization |
| `tu-vi-templates.js` | 28KB | Template rendering |
| `tu-vi-star-descriptions.js` | 27KB | Star descriptions data |
| `than-so-hoc.js` | 17KB | Numerology core |
| `than-so-hoc-data.js` | 37KB | Numerology data |
| `than-so-hoc-render.js` | 29KB | Numerology render |
| `styles.css` | 95KB | Master stylesheet |
| `auth.js` | 7KB | Auth handling |

## Backend Architecture (Express)
| File | Size | Chức năng |
|------|------|-----------|
| `server.js` | 12KB | Routes, middleware, auth, static serve |
| `db.js` | 25KB | SQLite setup, seed, queries |
| `gemini.js` | 23KB | AI integration, prompt builder, response parser |
| `tuvi-cli.js` | 4KB | CLI testing tool |
| `iching/hexagramService.js` | 3KB | Hexagram casting service |
| `soi-bai/` | ~24KB | Card reading engine (6 files) |

## AI Integration (Gemini)
- **Prompt version**: v11.0
- **System prompt**: `server/prompts/tuvi_system.v11.prompt` (~10KB)
- **Data format**: Compact JSON (palace DNA, star positions, Tứ Hóa, Vận Hạn)
- **Cache**: MD5-based key, 30 ngày TTL, SQLite storage
- **Retry**: 3 retries on 429 with exponential backoff
- **Max tokens**: 24,576 output tokens

## Core Business Rules
1. **Tử Vi calculations MUST be accurate** — cross-check with `data/TEST_CHUAN_NGUYEN_DUC_TOAN.md`
2. **All calculations run client-side** (JavaScript in browser) — server only provides data & AI
3. **AI responses are cached** by "chart DNA" — same star positions = same cache hit
4. **Auth only gates AI feature** — basic calculations are free/public
5. **Âm Lịch conversion** uses embedded algorithm, independent of external APIs