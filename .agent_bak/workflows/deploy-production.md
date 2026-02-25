---
description: Deploy Tử Vi Tool to Production Server (tuvi.demowebest.site)
---

# Deploy Production - Tử Vi Tool

Deploy ứng dụng Tử Vi lên server production tại `tuvi.demowebest.site`.

## Server Information

- **IP**: 15.235.210.4
- **User**: root
- **Auth**: SSH Key
- **Domain**: tuvi.demowebest.site
- **SSL**: Cloudflare Flexible (đã bật)
- **Path**: /home/tuvitool
- **Port**: 8950

---

## Workflow Steps

### 1. Kiểm tra Git status local

// turbo

```bash
git status
```

### 2. Add changes (nếu có)

```bash
git add .
```

### 3. Commit changes

```bash
git commit -m "Update: [mô tả thay đổi]"
```

### 4. Push to GitHub

// turbo

```bash
git push origin master
```

### 5. Pull latest code trên server

// turbo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && git pull origin master"
```

### 6. Rebuild và restart containers

// turbo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose up -d --build"
```

### 7. Kiểm tra container status

// turbo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose ps"
```

### 8. Xem logs

// turbo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose logs --tail=30"
```

### 9. Test API health

// turbo

```bash
ssh root@15.235.210.4 "curl -s http://localhost:8950/api/health"
```

### 10. Verify domain

// turbo

```bash
curl -I https://tuvi.demowebest.site
```

---

## Post-Deployment Checklist

✅ Code pushed to GitHub
✅ Server pulled latest code
✅ Containers rebuilt successfully
✅ API health check OK
✅ Domain accessible (200 OK)

---

## Quick Deploy (No Changes)

Nếu chỉ cần restart containers mà không có code changes:

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose restart"
```

---

## Rollback (nếu cần)

### Quay về commit trước

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && git log --oneline -5"
# Chọn commit hash cần rollback
ssh root@15.235.210.4 "cd /home/tuvitool && git reset --hard <commit-hash> && docker compose up -d --build"
```

---

## Troubleshooting

### Lỗi: Port 8950 đã được sử dụng

```bash
ssh root@15.235.210.4 "netstat -tulpn | grep 8950"
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose down"
```

### Lỗi: Git pull conflict

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && git stash && git pull origin master"
```

### Xem logs real-time

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose logs -f"
```

---

## Notes

- **Port**: Container chạy trên port 8950 (không phải 8900)
- **Nginx**: Đã được setup sẵn, không cần config lại
- **Database**: SQLite file được mount từ `./data` volume
- **Environment**: File `.env` không được commit vào Git
