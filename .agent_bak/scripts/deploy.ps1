# Deploy Production Script - Tử Vi Tool
# Usage: .\deploy.ps1 [-Message "commit message"]

param(
    [string]$Message = "Update: Deploy to production"
)

$SERVER = "root@15.235.210.4"
$PROJECT_PATH = "/home/tuvitool"

Write-Host "🚀 Starting deployment to tuvi.demowebest.site..." -ForegroundColor Cyan

# Step 1: Check git status
Write-Host "`n📊 Step 1: Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📝 Changes detected:" -ForegroundColor Yellow
    git status --short
    
    # Step 2: Add changes
    Write-Host "`n➕ Step 2: Adding changes..." -ForegroundColor Yellow
    git add .
    
    # Step 3: Commit
    Write-Host "`n💾 Step 3: Committing changes..." -ForegroundColor Yellow
    git commit -m $Message
    
    # Step 4: Push
    Write-Host "`n⬆️  Step 4: Pushing to GitHub..." -ForegroundColor Yellow
    git push origin master
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to push to GitHub!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ No local changes to commit" -ForegroundColor Green
}

# Step 5: Pull on server
Write-Host "`n⬇️  Step 5: Pulling latest code on server..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && git pull origin master"

# Step 6: Rebuild containers
Write-Host "`n🏗️  Step 6: Rebuilding containers..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && docker compose up -d --build"

# Step 7: Wait for containers
Write-Host "`n⏳ Step 7: Waiting for containers..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Step 8: Check status
Write-Host "`n📊 Step 8: Checking container status..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && docker compose ps"

# Step 9: Show logs
Write-Host "`n📝 Step 9: Recent logs..." -ForegroundColor Yellow
ssh $SERVER "cd $PROJECT_PATH && docker compose logs --tail=20"

# Step 10: Health check
Write-Host "`n🏥 Step 10: Testing API health..." -ForegroundColor Yellow
$healthCheck = ssh $SERVER "curl -s http://localhost:8950/api/health"
Write-Host $healthCheck -ForegroundColor White

# Step 11: Domain check
Write-Host "`n🌐 Step 11: Testing domain..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://tuvi.demowebest.site" -Method Head -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Domain is accessible! (Status: $($response.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Domain check failed: $_" -ForegroundColor Yellow
}

Write-Host "`n✅ Deployment completed!" -ForegroundColor Green
Write-Host "🔗 Visit: https://tuvi.demowebest.site" -ForegroundColor Cyan
Write-Host "`n📊 To view live logs, run:" -ForegroundColor Yellow
Write-Host "   ssh $SERVER 'cd $PROJECT_PATH && docker compose logs -f'" -ForegroundColor White

