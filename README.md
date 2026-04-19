# Tử Vi Lá Số Tool

Ứng dụng tính toán và phân tích Tử Vi Lá Số với tích hợp AI (Google Gemini).

## 🌟 Tính năng

- ✅ **Tính toán Tử Vi Lá Số** - Tự động tính toán lá số dựa trên ngày giờ sinh
- ✅ **Chuyển đổi Âm Dương Lịch** - Hỗ trợ chuyển đổi chính xác
- ✅ **Phân tích AI** - Tích hợp Google Gemini AI để phân tích sâu (yêu cầu đăng nhập)
- ✅ **Xác thực người dùng** - Hệ thống đăng nhập bảo mật
- ✅ **Giao diện thân thiện** - UI hiện đại, dễ sử dụng
- ✅ **Trường phái đa dạng** - Kết hợp Nam Phái, Bắc Phái (Tứ Hóa) và Khâm Thiên Môn ([Chi tiết](ASTROLOGY_METHODOLOGY.md))

### Tech Stack (V2)

- **Next.js 16 (App Router)** - Framework chính
- **React 19** - Thư viện frontend
- **Prisma & SQLite** - ORM / Database
- **Tailwind CSS** - UI Styling
- **PNPM Workspaces** - Monorepo package manager
- **Google Gemini API** - AI phân tích chuyên sâu

### DevOps

- **Docker + Docker Compose** - Containerization
- **Port 8950** - Mặc định cho local development

### DevOps

- **Docker + Docker Compose** - Containerization
- **Port 8900** - Public frontend & API

## 📦 Cài đặt

### Yêu cầu

- Docker & Docker Compose
- Git

### Bước 1: Clone repository

```bash
git clone git@github.com:toanndmarketing/tuvitool.git
cd tuvitool
```

### Bước 2: Cấu hình môi trường

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Chỉnh sửa .env và thêm API key của bạn
# GEMINI_API_KEY=your_api_key_here
```

### Bước 3: Chạy ứng dụng

```bash
# Build và start Docker containers
docker compose up -d

# Xem logs
docker compose logs -f
```

### Bước 4: Truy cập ứng dụng

Mở trình duyệt và truy cập: `http://localhost:8900`

## 🔐 Xác thực

### Tạo tài khoản mới

1. Truy cập trang chủ
2. Click "Đăng nhập" → "Đăng ký"
3. Nhập thông tin: username, email, password
4. Đăng nhập để sử dụng tính năng AI

### Tài khoản demo (nếu có)

```
Username: demo
Password: demo123
```

## 📚 API Documentation

### Endpoints chính

#### 1. Đăng ký

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### 2. Đăng nhập

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### 3. Phân tích AI (yêu cầu xác thực)

```http
POST /api/ai/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "chartData": {...},
  "birthInfo": {...}
}
```

## 🔧 Development

### Cấu trúc thư mục Monorepo

```
tu-vi-la-so/
├── apps/
│   └── web/            # Next.js 16 Application (Mọi logic UI, API Routes)
│       ├── prisma/     # Prisma schema và local SQLite db
│       ├── src/        # Source code
│       └── package.json 
├── packages/           # Các packages dùng chung (Tương lai)
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── .env
```

### Chạy local (không dùng Docker)

Sử dụng PNPM ở thư mục gốc:

```bash
pnpm install
pnpm dev
```

## 🐛 Troubleshooting

### Lỗi kết nối database

```bash
# Xóa database cũ và khởi tạo lại
rm data/tuvi.db
docker compose restart
```

### Lỗi Gemini API

- Kiểm tra API key trong file `.env`
- Đảm bảo API key còn hạn sử dụng
- Xem logs: `docker compose logs server`

### Port 8900 đã được sử dụng

```bash
# Kiểm tra port đang dùng
netstat -ano | findstr 8900

# Đổi port trong docker-compose.yml
```

## 📝 License

MIT License - Xem file LICENSE để biết thêm chi tiết

## 👥 Contributors

- **Toan Nguyen** - Initial work

## 🙏 Acknowledgments

- Google Gemini API
- Tử Vi calculation algorithms
- Vietnamese Lunar Calendar conversion

---

**Note**: Đây là tool phục vụ mục đích nghiên cứu và giải trí. Kết quả chỉ mang tính chất tham khảo.
