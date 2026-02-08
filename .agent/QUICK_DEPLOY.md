# 🚀 Quick Deploy Guide

## Cách sử dụng workflow /deploy-production

### Option 1: Dùng workflow trực tiếp (Recommended)

Chỉ cần gọi:

```
/deploy-production
```

Agent sẽ tự động:

1. ✅ Check git status
2. ✅ Add & commit changes (nếu có)
3. ✅ Push to GitHub
4. ✅ Pull code trên server
5. ✅ Rebuild containers
6. ✅ Verify deployment

---

### Option 2: Dùng deploy script

```powershell
# Deploy với commit message mặc định
.\.agent\scripts\deploy.ps1

# Deploy với custom commit message
.\.agent\scripts\deploy.ps1 -Message "feat: Add new feature"
```

---

## Workflow đã được đơn giản hóa

### ✅ Bỏ qua các bước

- ❌ Setup Nginx (đã setup sẵn)
- ❌ Copy .env file (đã có trên server)
- ❌ Clone repository (đã clone rồi)
- ❌ Test connection (không cần thiết)

### ✅ Chỉ tập trung vào

1. **Git operations** - Commit & push code
2. **Server update** - Pull latest code
3. **Container rebuild** - Deploy changes
4. **Verification** - Health check & domain test

---

## Khi nào dùng gì?

### Dùng `/deploy-production` khi

- ✅ Có code changes cần deploy
- ✅ Muốn tự động commit & push
- ✅ Muốn deploy nhanh nhất

### Dùng script `deploy.ps1` khi

- ✅ Muốn custom commit message
- ✅ Muốn control từng bước
- ✅ Muốn xem output chi tiết

### Restart nhanh (không có code changes)

```powershell
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose restart"
```

---

## Thông tin Production

- **Domain**: <https://tuvi.demowebest.site>
- **Server**: 15.235.210.4
- **Path**: /home/tuvitool
- **Port**: 8950
- **Nginx**: ✅ Configured (port 8950 → domain)

---

## Troubleshooting

### Nếu domain không hoạt động

```powershell
# Check Nginx config
ssh root@15.235.210.4 "cat /etc/nginx/sites-enabled/tuvi.demowebest.site.conf"

# Reload Nginx
ssh root@15.235.210.4 "nginx -t && systemctl reload nginx"
```

### Nếu container không start

```powershell
# Check logs
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose logs -f"

# Restart containers
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose restart"
```

---

**Last Updated**: 2026-02-08
