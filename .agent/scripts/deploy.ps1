# Deploy Production Script - Tử Vi Tool
# Usage: .\deploy.ps1

$SERVER = "root@15.235.210.4"
$PROJECT_PATH = "/home/tuvitool"
$LOCAL_ENV = "d:\Project\tu-vi-la-so\.env"

Write-Host "🚀 Starting deployment to tuvi.demowebest.site..." -ForegroundColor Cyan

# Step 1: Test connection
Write-Host "`n📡 Step 1: Testing server connection..." -ForegroundColor Yellow
ssh $SERVER "echo 'Connected successfully'"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cannot connect to server!" -ForegroundColor Red
    exit 1
}

# Step 2: Clone or update repository
Write-Host "`n📦 Step 2: Updating code from Git..." -ForegroundColor Yellow
ssh $SERVER "cd /home && git clone git@github.com:toanndmarketing/tuvitool.git 2>/dev/null || (cd $PROJECT_PATH && git pull origin master)"

# Step 3: Copy .env file
Write-Host "`n🔐 Step 3: Uploading .env file..." -ForegroundColor Yellow
if (Test-Path $LOCAL_ENV) {
    scp $LOCAL_ENV "${SERVER}:${PROJECT_PATH}/.env"
} else {
    Write-Host "⚠️  Warning: .env file not found at $LOCAL_ENV" -ForegroundColor Yellow
}

# Step 4: Stop old containers
Write-Host "`n🛑 Step 4: Stopping old containers..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && docker compose down"

# Step 5: Build and start new containers
Write-Host "`n🏗️  Step 5: Building and starting containers..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && docker compose up -d --build"

# Step 6: Wait for containers to be healthy
Write-Host "`n⏳ Step 6: Waiting for containers to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 7: Check container status
Write-Host "`n📊 Step 7: Checking container status..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && docker compose ps"

# Step 8: Show logs
Write-Host "`n📝 Step 8: Recent logs..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && docker compose logs --tail=30"

# Step 9: Test health endpoint
Write-Host "`n🏥 Step 9: Testing health endpoint..." -ForegroundColor Yellow
ssh $SERVER "curl -s http://localhost:8900/ | head -n 5 || echo 'Service starting...'"

# Step 10: Test domain
Write-Host "`n🌐 Step 10: Testing domain..." -ForegroundColor Yellow
$response = curl -I https://tuvi.demowebest.site 2>&1
if ($response -match "200|301|302") {
    Write-Host "✅ Domain is accessible!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Domain check: $response" -ForegroundColor Yellow
}

Write-Host "`n✅ Deployment completed!" -ForegroundColor Green
Write-Host "🔗 Visit: https://tuvi.demowebest.site" -ForegroundColor Cyan
Write-Host "`n📊 To view live logs, run:" -ForegroundColor Yellow
Write-Host "   ssh $SERVER 'cd $PROJECT_PATH && docker compose logs -f'" -ForegroundColor White
