# Build APK with Railway Backend - Complete Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build APK with Railway Backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Get Railway Backend URL
Write-Host "Step 1: Get Railway Backend URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please provide your Railway backend URL:" -ForegroundColor Yellow
Write-Host "You can find it in Railway Dashboard:" -ForegroundColor White
Write-Host "  1. Go to https://railway.app" -ForegroundColor White
Write-Host "  2. Click your service (C2sProject)" -ForegroundColor White
Write-Host "  3. Click 'Settings' tab" -ForegroundColor White
Write-Host "  4. Find 'Domains' section" -ForegroundColor White
Write-Host "  5. Copy the URL (e.g., https://c2sproject-production-xxxx.up.railway.app)" -ForegroundColor White
Write-Host ""
$backendUrl = Read-Host "Enter your Railway backend URL"

# Validate URL
if (-not $backendUrl -or -not $backendUrl.StartsWith("https://")) {
    Write-Host "Invalid URL. Please provide a valid HTTPS URL." -ForegroundColor Red
    exit 1
}

# Remove trailing slash
$backendUrl = $backendUrl.TrimEnd('/')

Write-Host ""
Write-Host "Backend URL: $backendUrl" -ForegroundColor Green
Write-Host ""

# Step 2: Update frontend/app.json
Write-Host "Step 2: Updating frontend/app.json..." -ForegroundColor Cyan

$appJsonPath = "frontend\app.json"
if (-not (Test-Path $appJsonPath)) {
    Write-Host "Error: frontend/app.json not found!" -ForegroundColor Red
    exit 1
}

# Read and update app.json
$appJson = Get-Content $appJsonPath -Raw | ConvertFrom-Json

# Update API URLs
$appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
$appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"

# Save updated app.json
$appJson | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath -Encoding UTF8

Write-Host "✅ Frontend configuration updated!" -ForegroundColor Green
Write-Host "   API URL: $($appJson.expo.extra.apiBaseUrl)" -ForegroundColor White
Write-Host "   WebSocket URL: $($appJson.expo.extra.wsBaseUrl)" -ForegroundColor White
Write-Host ""

# Step 3: Test backend connection
Write-Host "Step 3: Testing backend connection..." -ForegroundColor Cyan
try {
    $healthCheckUrl = "$backendUrl/health/"
    $response = Invoke-WebRequest -Uri $healthCheckUrl -Method Get -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not connect to backend. Make sure it's running." -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}

Write-Host ""

# Step 4: Check Expo login
Write-Host "Step 4: Checking Expo login..." -ForegroundColor Cyan
$loginStatus = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Not logged in to Expo." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please login first:" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  eas login" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again, or run:" -ForegroundColor Yellow
    Write-Host "  cd frontend" -ForegroundColor White
    Write-Host "  eas build --platform android --profile preview" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Logged in to Expo!" -ForegroundColor Green
Write-Host ""

# Step 5: Build APK
Write-Host "Step 5: Building APK..." -ForegroundColor Cyan
Write-Host ""
Write-Host "This will take 10-15 minutes. The build happens in the cloud." -ForegroundColor Yellow
Write-Host "You'll get a download link when it's done." -ForegroundColor Yellow
Write-Host ""

# Navigate to frontend
Set-Location frontend

# Start the build
eas build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Build Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check your build status at:" -ForegroundColor Cyan
    Write-Host "  https://expo.dev/accounts/[your-username]/builds" -ForegroundColor White
    Write-Host ""
    Write-Host "You'll receive a download link when the build completes." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Build failed. Check the error messages above." -ForegroundColor Red
    Write-Host ""
}

Set-Location ..

