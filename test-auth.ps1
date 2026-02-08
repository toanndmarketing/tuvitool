# Test Auth API với PowerShell
# Chạy: .\test-auth.ps1

$API_BASE = "http://localhost:8950"

Write-Host "🧪 Testing Auth Flow...`n" -ForegroundColor Cyan

# Test 1: Login với credentials đúng
Write-Host "1️⃣ Test Login - Correct Credentials" -ForegroundColor Yellow
try {
    $loginBody = @{
        username = "tuvisteven"
        password = "2134jsad@#@!%asgg"
    } | ConvertTo-Json

    $loginResp = Invoke-WebRequest -Uri "$API_BASE/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -UseBasicParsing

    if ($loginResp.StatusCode -eq 200) {
        $data = $loginResp.Content | ConvertFrom-Json
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "   Token: $($data.token.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host "   Expires in: $($data.expiresIn) seconds`n" -ForegroundColor Gray

        # Test 2: Gọi AI API với token
        Write-Host "2️⃣ Test AI API - With Valid Token" -ForegroundColor Yellow
        $aiBody = @{
            overview = @{
                amDuong = "Dương"
                menhNapAm = "Test"
                hanhMenh = "Kim"
                cucName = "Test Cục"
                hanhCuc = "Thuỷ"
                chuMenh = "Test"
                chuThan = "Test"
                thuan = $true
            }
            palaces = @()
            specials = @()
            name = "Test User"
            dob = "2000-01-01"
            hour = 0
            yearView = 2026
        } | ConvertTo-Json -Depth 10

        $headers = @{
            "Authorization" = "Bearer $($data.token)"
        }

        try {
            $aiResp = Invoke-WebRequest -Uri "$API_BASE/api/interpret/ai" `
                -Method POST `
                -ContentType "application/json" `
                -Headers $headers `
                -Body $aiBody `
                -UseBasicParsing

            Write-Host "✅ AI API accessible with token!`n" -ForegroundColor Green
        } catch {
            Write-Host "❌ AI API failed: $($_.Exception.Message)`n" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 3: Login với credentials sai
Write-Host "3️⃣ Test Login - Wrong Credentials" -ForegroundColor Yellow
try {
    $wrongBody = @{
        username = "wrong"
        password = "wrong"
    } | ConvertTo-Json

    $wrongResp = Invoke-WebRequest -Uri "$API_BASE/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $wrongBody `
        -UseBasicParsing
    
    Write-Host "❌ Should return 401 for wrong credentials`n" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly rejected wrong credentials`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

# Test 4: Gọi AI API không có token
Write-Host "4️⃣ Test AI API - Without Token" -ForegroundColor Yellow
try {
    $noTokenBody = @{
        overview = @{ test = $true }
        palaces = @()
        specials = @()
    } | ConvertTo-Json

    $noTokenResp = Invoke-WebRequest -Uri "$API_BASE/api/interpret/ai" `
        -Method POST `
        -ContentType "application/json" `
        -Body $noTokenBody `
        -UseBasicParsing
    
    Write-Host "❌ Should return 401 for missing token`n" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly rejected request without token`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)`n" -ForegroundColor Red
    }
}

Write-Host "✅ All tests completed!" -ForegroundColor Cyan
