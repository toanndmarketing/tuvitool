# 🔐 Auth Login - Quick Start

## ✅ Status: READY

Hệ thống auth login đã được triển khai thành công!

---

## 🚀 Cách Sử Dụng

### 1. Mở Ứng Dụng

```
http://localhost:8950
```

### 2. Lập Lá Số

- Nhập thông tin như bình thường
- Click "Lập Lá Số"
- Lá số sẽ hiển thị ngay lập tức

### 3. Xem AI Phân Tích

- Scroll xuống phần "🔮 Phân Tích Chuyên Sâu"
- **Modal login sẽ tự động hiển thị**
- Nhập credentials:

  ```
  Username: tuvisteven
  Password: 2134jsad@#@!%asgg
  ```

- Click "Đăng nhập"
- AI phân tích sẽ hiển thị sau vài giây

---

## 🧪 Test API

Chạy test script để verify:

```powershell
.\test-auth.ps1
```

Expected output:

```
✅ Login successful!
✅ AI API accessible with token!
✅ Correctly rejected wrong credentials
✅ Correctly rejected request without token
✅ All tests completed!
```

---

## 📖 Tài Liệu Chi Tiết

- **AUTH_GUIDE.md** - Hướng dẫn sử dụng đầy đủ
- **IMPLEMENTATION_SUMMARY.md** - Chi tiết kỹ thuật

---

## 🔧 Cấu Hình

Credentials được lưu trong `.env`:

```bash
AUTH_USERNAME=tuvisteven
AUTH_PASSWORD=2134jsad@#@!%asgg
```

Để đổi credentials:

1. Edit `.env`
2. Restart container: `docker compose restart`

---

## 🛡️ Bảo Mật

- ✅ Token-based authentication
- ✅ Session timeout: 30 phút
- ✅ Rate limiting: 5 AI requests/phút
- ✅ ENV-based credentials
- ✅ Protected AI endpoint

---

## 📞 Troubleshooting

### Server không chạy?

```bash
docker compose up -d
docker compose logs -f tuvi-app
```

### Test API

```bash
.\test-auth.ps1
```

### Check container

```bash
docker compose ps
```

---

## ✨ Features

- 🔐 **Secure Login** - Token-based auth
- 🎨 **Premium UI** - Glassmorphism modal
- ⚡ **Fast** - Minimal overhead
- 📱 **Responsive** - Mobile-friendly
- 🚀 **Production-ready** - Full error handling

---

**Server**: <http://localhost:8950>  
**Status**: ✅ Running  
**Auth**: ✅ Enabled
