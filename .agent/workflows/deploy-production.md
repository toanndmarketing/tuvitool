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
- **Port**: 8900

---

## Workflow Steps

### 1. Kiểm tra kết nối server

```bash
ssh root@15.235.210.4 "echo 'Server connected successfully'"
```

### 2. Clone repository và setup thư mục (lần đầu)

```bash
ssh root@15.235.210.4 "cd /home && git clone git@github.com:toanndmarketing/tuvitool.git || echo 'Repository already exists'"
```

### 3. Pull latest code từ Git

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && git pull origin master"
```

### 4. Copy file .env từ local lên server

```bash
scp d:\Project\tu-vi-la-so\.env root@15.235.210.4:/home/tuvitool/.env
```

### 5. Kiểm tra Docker đã cài trên server chưa

```bash
ssh root@15.235.210.4 "docker --version && docker compose version"
```

### 6. Stop containers cũ (nếu có)

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose down"
```

### 7. Build và start containers mới

// turbo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose up -d --build"
```

### 8. Kiểm tra containers đang chạy

// turbo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose ps"
```

### 9. Xem logs để verify

// turbo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose logs --tail=50"
```

### 10. Test API endpoint

// turbo

```bash
ssh root@15.235.210.4 "curl -s http://localhost:8900/api/health || echo 'Health check endpoint not available'"
```

### 11. Cấu hình Nginx reverse proxy (nếu chưa có)

```bash
ssh root@15.235.210.4 "cat > /etc/nginx/sites-available/tuvi.demowebest.site << 'EOF'
server {
    listen 80;
    server_name tuvi.demowebest.site;

    # Cloudflare Flexible SSL - chỉ cần HTTP
    location / {
        proxy_pass http://localhost:8900;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
"
```

### 12. Enable Nginx site và reload

```bash
ssh root@15.235.210.4 "ln -sf /etc/nginx/sites-available/tuvi.demowebest.site /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"
```

### 13. Verify deployment qua domain

```bash
curl -I https://tuvi.demowebest.site
```

---

## Post-Deployment Checklist

✅ Containers đang chạy healthy
✅ API endpoint response OK
✅ Nginx reverse proxy hoạt động
✅ Domain accessible qua HTTPS (Cloudflare SSL)
✅ Database được khởi tạo
✅ Logs không có error nghiêm trọng

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

### Lỗi: Port 8900 đã được sử dụng

```bash
ssh root@15.235.210.4 "netstat -tulpn | grep 8900"
ssh root@15.235.210.4 "docker compose down"
```

### Lỗi: Database không khởi tạo

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose exec server ls -la /app/data/"
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose restart server"
```

### Lỗi: Nginx 502 Bad Gateway

```bash
ssh root@15.235.210.4 "docker compose ps"
ssh root@15.235.210.4 "docker compose logs server"
ssh root@15.235.210.4 "curl http://localhost:8900"
```

### Xem logs real-time

```bash
ssh root@15.235.210.4 "cd /home/tuvitool && docker compose logs -f"
```

---

## Notes

- **Cloudflare SSL Flexible**: Server chỉ cần HTTP (port 80), Cloudflare tự động handle HTTPS
- **Database**: SQLite file được mount từ `./data` volume
- **Environment**: File `.env` phải được copy thủ công (không commit vào Git)
- **Backup**: Nên backup folder `/home/tuvitool/data` định kỳ
