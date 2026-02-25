# Master Identity - Tử Vi Lá Số Tool

- **Tên dự án:** Tử Vi Lá Số - Công cụ tính toán và phân tích Tử Vi
- **Chủ sở hữu:** Toan Nguyen (toanndmarketing)
- **Địa điểm:** Ha Noi, Viet Nam
- **Domain:** tuvi.demowebest.site
- **Repository:** <git@github.com>:toanndmarketing/tuvitool.git

## Mô tả dự án

Ứng dụng web tính toán Tử Vi Lá Số tự động với tích hợp AI phân tích chuyên sâu:

- **Frontend:** HTML5 + Vanilla JavaScript (đơn giản, không framework)
- **Backend:** Node.js + Express + SQLite
- **AI:** Google Gemini API (phân tích lá số)
- **Auth:** JWT-based authentication

## Trường Phái Tử Vi Đẩu Số

Codebase theo **trường phái Tam Hợp Phái (三合派)** — phái cổ truyền phổ biến nhất Việt Nam, kết hợp bảng Tứ Hóa từ **Trung Châu Phái (中州派 — Vương Đình Chi)**.

### Phương pháp luận giải: Tam Hợp Phái

- **Tam Hợp chiếu** (3 cung cách nhau 120°, weight 0.4)
- **Xung Chiếu** (cung đối diện cách 6, weight 0.6)
- **Giáp Cung** (2 cung kề bên, weight 0.3)
- **Lục Hợp / Nhị Hợp** (6 cặp Địa Chi hợp, weight 0.35)
- **KHÔNG dùng Phi Tinh / Phi Hóa xuyên cung** (kiểu Đài Loan)

### Bảng Tứ Hóa: Trung Châu Phái (biến thể VN)

Điểm nhận dạng so với các phái khác:

| Can | Đặc điểm nhận dạng | Trung Châu gốc | Code hiện tại |
|-----|---------------------|----------------|---------------|
| Mậu | Hóa Khoa | Hữu Bật | ✅ Hữu Bật |
| Canh | Hóa Khoa | Thiên Phủ | Thái Âm (biến thể VN) |
| Nhâm | Hóa Khoa | Thiên Phủ | Tả Phụ (biến thể VN) |

- Phái **Toàn Thư / Nhất Diệp**: Can Mậu Hóa Khoa = Thiên Lương (KHÁC)
- Phái **Phi Tinh Đài Loan**: Bảng Tứ Hóa riêng, kèm Phi Hóa xuyên cung (KHÁC hoàn toàn)

### Hệ thống Miếu Vượng Hãm: 4 cấp truyền thống

`Miếu → Vượng → Đắc → Hãm` (14 chính tinh, chi tiết trong `tu-vi-star-patterns.js`)

### Đại Vận: Cổ truyền Việt Nam

- Tuổi bắt đầu = giá trị Cục (VD: Thuỷ Nhị Cục → 2 tuổi)
- Mỗi Đại Vận = 10 năm
- Thuận/Nghịch theo Âm Dương giới tính

### An sao: Truyền thống chuẩn

- 14 Chính Tinh: Tử Vi hệ (6 sao, đi nghịch) + Thiên Phủ hệ (8 sao, đi thuận, đối xứng qua Dần-Thân)
- Thiên Phủ = `(4 - TửVi) % 12`
- 60+ Phụ Tinh & Lưu Niên sao
- Vòng Bác Sĩ (12 sao, khởi từ Lộc Tồn)
- Tuần Không + Triệt Lộ

### ⚠️ Lưu ý khi phát triển

1. **KHÔNG thêm logic Phi Hóa / Phi Tinh** — trái với trường phái hiện tại
2. **Bảng Tứ Hóa KHÔNG ĐƯỢC THAY ĐỔI** — đã verified theo Trung Châu Phái
3. Khi có comment `"for some traditions"` trong code (VD: Hoả Tinh nhóm Tỵ-Dậu-Sửu) → đây là điểm khác biệt giữa các trường phái, giữ nguyên lựa chọn hiện tại

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js 20, Express.js
- **Database:** SQLite (file-based, lưu trong `/data`)
- **AI:** Google Gemini API (gemini-2.0-flash-exp)
- **Auth:** JWT + bcrypt
- **Deployment:** Docker (single container)

## Kiến trúc đơn giản

```
┌─────────────────────────────────────┐
│         Browser (Client)            │
│   HTML + CSS + Vanilla JS           │
└──────────────┬──────────────────────┘
               │ HTTP/Fetch API
┌──────────────▼──────────────────────┐
│      Express Server (Port 8950)     │
│  ├─ /api/auth/*  (đăng ký/đăng nhập)│
│  ├─ /api/ai/*    (phân tích Gemini) │
│  └─ /*           (static files)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   SQLite Database (data/tuvi.db)    │
│   - users table                     │
│   - analysis_history table          │
└─────────────────────────────────────┘
```

## Port Registry

| Service | Port | Status |
|---------|------|--------|
| Tử Vi App (All-in-one) | 8950 | ✅ Running |

**Lưu ý:** Port 8950 KHÔNG được thay đổi (đã deploy production).

## Nguyên tắc phát triển

1. **Đơn giản là tốt nhất:** Không dùng framework phức tạp, giữ code dễ đọc
2. **Vanilla JavaScript:** Không React/Vue, chỉ dùng JS thuần
3. **File-based Database:** SQLite đủ dùng, không cần PostgreSQL
4. **Docker Single Container:** Tất cả chạy trong 1 container
5. **AI Optional:** Tính năng AI chỉ dành cho user đã đăng nhập
6. **No Hard-code:** API keys, URLs phải lưu trong `.env`

## Tính năng chính

### ✅ Đã hoàn thành

- Tính toán Tử Vi Lá Số (12 cung, sao, cục)
- Chuyển đổi Âm Dương lịch
- Hệ thống đăng ký/đăng nhập (JWT)
- Phân tích AI với Gemini
- UI responsive, hiện đại
- Docker deployment

### 🔄 Đang phát triển

- Lưu lịch sử tra cứu
- Export PDF lá số
- Chia sẻ kết quả

## Quy tắc code

### Frontend (Vanilla JS)

- Tách module: `app.js`, `auth.js`, `tu-vi-calc.js`, `tu-vi-render.js`
- Dùng `async/await` cho API calls
- Xử lý error rõ ràng, hiển thị message cho user
- Responsive mobile-first

### Backend (Express)

- RESTful API design
- Middleware: `authMiddleware` cho protected routes
- Error handling tập trung
- Validate input (username, email, password)
- Rate limiting cho AI endpoints

### Database (SQLite)

- Schema đơn giản: `users`, `analysis_history`
- Không dùng ORM (chỉ cần `better-sqlite3`)
- Auto-create database nếu chưa tồn tại

### Environment Variables

```env
PORT=8950
GEMINI_API_KEY=<your_key>
JWT_SECRET=<random_secret>
NODE_ENV=production
```

## Deployment

- **Production:** tuvi.demowebest.site (Nginx reverse proxy)
- **Docker:** Single container, restart policy `unless-stopped`
- **Data persistence:** Volume mount `./data:/app/data`
- **Healthcheck:** `/api/health` endpoint
