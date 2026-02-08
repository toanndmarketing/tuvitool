# Upload and run Nginx setup script on server
# Usage: .\setup-nginx-remote.ps1

$SERVER = "root@15.235.210.4"
$SCRIPT_PATH = "d:\Project\tu-vi-la-so\.agent\scripts\setup-nginx.sh"

Write-Host "📤 Uploading Nginx setup script to server..." -ForegroundColor Cyan

# Upload script
scp $SCRIPT_PATH "${SERVER}:/tmp/setup-nginx.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Script uploaded successfully" -ForegroundColor Green
    
    Write-Host "`n🔧 Running setup script on server..." -ForegroundColor Yellow
    
    # Make executable and run
    ssh $SERVER "chmod +x /tmp/setup-nginx.sh && bash /tmp/setup-nginx.sh"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Nginx setup completed!" -ForegroundColor Green
        Write-Host "🔗 Visit: https://tuvi.demowebest.site" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Setup failed. Check the output above." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Failed to upload script" -ForegroundColor Red
}
