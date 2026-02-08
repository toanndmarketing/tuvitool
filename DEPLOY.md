# 🚀 Quick Deployment Guide

## Thông tin Server Production

- **Domain**: <https://tuvi.demowebest.site>
- **Server IP**: 15.235.210.4
- **User**: root (SSH Key)
- **Path**: /home/tuvitool
- **Port**: 8900
- **SSL**: Cloudflare Flexible (đã bật)

---

## 📋 Deploy lần đầu (First Time Setup)

### Bước 1: Setup Nginx (chỉ cần làm 1 lần)

```powershell
# Chạy từ local machine
cd d:\Project\tu-vi-la-so
.\.agent\scripts\setup-nginx-remote.ps1
```

### Bước 2: Deploy ứng dụng

```powershell
# Chạy script deploy tự động
.\.agent\scripts\deploy.ps1
```

### Bước 3: Verify

- Truy cập: <https://tuvi.demowebest.site>
- Kiểm tra trang chủ load được
- Test đăng ký/đăng nhập
- Test tính toán Tử Vi

---

## 🔄 Deploy Update (các lần sau)

Khi có code mới cần deploy:

```powershell
# Commit code mới
git add .
git commit -m "Your commit message"
git push

# Deploy lên production
.\.agent\scripts\deploy.ps1
```

---

## 📖 Deploy thủ công (Manual)

Nếu muốn deploy từng bước thủ công, xem workflow chi tiết:

```powershell
# Xem workflow
cat .agent\workflows\deploy-production.md
```

Hoặc chạy từng lệnh:

```powershell
# 1. Pull code mới
ssh root@15.235.210.4 "cd /home/tuvitool && git pull origin master"

# 2. Copy .env
scp .env root@15.235.210.4:/home/tuvitool/.env

# 3. Rebuild containers
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose down && docker compose up -d --build"

# 4. Xem logs
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose logs -f"
```

---

## 🔍 Monitoring & Troubleshooting

### Xem logs real-time

```powershell
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose logs -f"
```

### Kiểm tra container status

```powershell
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose ps"
```

### Restart service

```powershell
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose restart"
```

### Kiểm tra Nginx

```powershell
ssh root@15.235.210.4 "nginx -t && systemctl status nginx"
```

### Xem Nginx logs

```powershell
ssh root@15.235.210.4 "tail -f /var/log/nginx/tuvi.demowebest.site.error.log"
```

---

## 🔐 Environment Variables

File `.env` cần có các biến sau:

```env
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret for authentication
JWT_SECRET=your_random_secret_key_here

# Server Port (default: 3000, mapped to 8900 in Docker)
PORT=3000
```

**Lưu ý**: File `.env` KHÔNG được commit vào Git, phải copy thủ công lên server.

---

## 📦 Backup Database

```powershell
# Download database từ server về local
scp root@15.235.210.4:/home/tuvitool/data/tuvi.db ./backup/tuvi-$(Get-Date -Format 'yyyyMMdd-HHmmss').db

# Restore database lên server
scp ./backup/tuvi-backup.db root@15.235.210.4:/home/tuvitool/data/tuvi.db
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose restart"
```

---

## 🆘 Emergency Rollback

```powershell
# SSH vào server
ssh root@15.235.210.4

# Xem commit history
cd /home/tuvitool
git log --oneline -10

# Rollback về commit trước
git reset --hard <commit-hash>
docker compose up -d --build
```

---

## ✅ Health Check

Sau khi deploy, kiểm tra:

- [ ] Domain accessible: <https://tuvi.demowebest.site>
- [ ] Homepage loads correctly
- [ ] Login/Register works
- [ ] Tử Vi calculation works
- [ ] AI analysis works (with valid API key)
- [ ] No errors in logs
- [ ] Database persists data

---

## 📞 Support

Nếu gặp vấn đề:

1. Kiểm tra logs: `docker compose logs`
2. Kiểm tra Nginx: `nginx -t`
3. Kiểm tra DNS Cloudflare
4. Kiểm tra SSL setting (phải là Flexible)
5. Kiểm tra port 8900 không bị conflict

---

**Last Updated**: 2026-02-08
