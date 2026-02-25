#!/bin/bash
# Setup Nginx for Tử Vi Tool - Port 8950

DOMAIN="tuvi.demowebest.site"
PORT="8950"

echo "🔧 Setting up Nginx for $DOMAIN on port $PORT..."

# Create Nginx config
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name tuvi.demowebest.site;

    location / {
        proxy_pass http://localhost:8950;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    access_log /var/log/nginx/tuvi.demowebest.site.access.log;
    error_log /var/log/nginx/tuvi.demowebest.site.error.log;
}
EOF

echo "✅ Nginx config created"

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
echo "✅ Site enabled"

nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded"
    echo ""
    echo "🎉 Setup completed!"
    echo "🔗 Your site should be accessible at: https://$DOMAIN"
else
    echo "❌ Nginx config has errors. Please check and fix."
    exit 1
fi
