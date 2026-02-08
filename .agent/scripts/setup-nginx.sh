#!/bin/bash
# Setup Nginx for Tử Vi Tool
# Run on server: bash setup-nginx.sh

DOMAIN="tuvi.demowebest.site"
PORT="8900"

echo "🔧 Setting up Nginx for $DOMAIN..."

# Create Nginx config
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name tuvi.demowebest.site;

    # Cloudflare Flexible SSL - only HTTP needed
    # Cloudflare handles HTTPS termination

    location / {
        proxy_pass http://localhost:8900;
        proxy_http_version 1.1;
        
        # WebSocket support (if needed)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Disable cache for proxy
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/tuvi.demowebest.site.access.log;
    error_log /var/log/nginx/tuvi.demowebest.site.error.log;
}
EOF

echo "✅ Nginx config created"

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

echo "✅ Site enabled"

# Test Nginx config
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid"
    
    # Reload Nginx
    systemctl reload nginx
    echo "✅ Nginx reloaded"
    
    echo ""
    echo "🎉 Setup completed!"
    echo "🔗 Your site should be accessible at: https://$DOMAIN"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Make sure Docker container is running on port $PORT"
    echo "   2. Check Cloudflare DNS is pointing to this server"
    echo "   3. Verify Cloudflare SSL is set to 'Flexible'"
else
    echo "❌ Nginx config has errors. Please check and fix."
    exit 1
fi
