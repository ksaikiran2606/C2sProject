# ============================================
# Interactive Deployment Runner
# ============================================
# This script guides you through deployment step by step

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Project Deployment Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will guide you through deploying your project." -ForegroundColor White
Write-Host "You'll need to complete some steps manually (login, etc.)" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Ready to start? (y/n)"
if ($continue -ne 'y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 1: Login to Railway" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Opening Railway login..." -ForegroundColor Yellow
Write-Host "A browser window will open for authentication." -ForegroundColor White
Write-Host ""
Start-Sleep -Seconds 2

# Try to open Railway login
try {
    Start-Process "railway" -ArgumentList "login" -NoNewWindow -Wait -ErrorAction SilentlyContinue
} catch {
    Write-Host "Please run this command manually in a new PowerShell window:" -ForegroundColor Yellow
    Write-Host "  railway login" -ForegroundColor Cyan
}

Write-Host ""
$railwayDone = Read-Host "Have you completed Railway login? (y/n)"
if ($railwayDone -ne 'y') {
    Write-Host "Please complete Railway login first, then run this script again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 2: Login to Expo" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Opening Expo login..." -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 2

# Try to open Expo login
try {
    Start-Process "eas" -ArgumentList "login" -NoNewWindow -Wait -ErrorAction SilentlyContinue
} catch {
    Write-Host "Please run this command manually in a new PowerShell window:" -ForegroundColor Yellow
    Write-Host "  eas login" -ForegroundColor Cyan
}

Write-Host ""
$expoDone = Read-Host "Have you completed Expo login? (y/n)"
if ($expoDone -ne 'y') {
    Write-Host "Please complete Expo login first, then run this script again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 3: Deploy Backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting backend deployment..." -ForegroundColor Yellow
Write-Host ""

# Navigate to backend
Set-Location backend

# Initialize Railway project
Write-Host "Initializing Railway project..." -ForegroundColor Yellow
railway init

Write-Host ""
Write-Host "Adding PostgreSQL database..." -ForegroundColor Yellow
railway add postgresql

Write-Host ""
Write-Host "Adding Redis..." -ForegroundColor Yellow
railway add redis

Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow

# Generate secret key
$secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
Write-Host "Generated SECRET_KEY: $secretKey" -ForegroundColor Green

# Set variables
railway variables set SECRET_KEY=$secretKey
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

Write-Host ""
Write-Host "Environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
Write-Host "This may take 2-5 minutes..." -ForegroundColor White

railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Backend deployed successfully!" -ForegroundColor Green
    
    # Get backend URL
    Write-Host ""
    Write-Host "Getting backend URL..." -ForegroundColor Yellow
    $backendUrl = railway domain 2>&1 | Select-String -Pattern "https://" | ForEach-Object { $_.Line.Trim() }
    
    Write-Host ""
    Write-Host "Your backend URL:" -ForegroundColor Cyan
    Write-Host "  $backendUrl" -ForegroundColor Green
    Write-Host ""
    
    # Save URL to file
    $backendUrl | Out-File -FilePath "..\backend-url.txt" -Encoding UTF8
    
    # Run migrations
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    railway run python manage.py migrate
    
    Write-Host ""
    Write-Host "Backend deployment complete!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Backend deployment failed. Check logs with: railway logs" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 4: Deploy Frontend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Read backend URL
if (Test-Path "backend-url.txt") {
    $backendUrl = Get-Content "backend-url.txt" -Raw | ForEach-Object { $_.Trim() }
    Write-Host "Using backend URL: $backendUrl" -ForegroundColor Cyan
} else {
    $backendUrl = Read-Host "Enter your backend URL (e.g., https://your-app.railway.app)"
}

Write-Host ""
Write-Host "Updating frontend configuration..." -ForegroundColor Yellow

# Navigate to frontend
Set-Location frontend

# Update app.json
$appJson = Get-Content app.json -Raw | ConvertFrom-Json
$appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
$appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"
$appJson | ConvertTo-Json -Depth 10 | Out-File -FilePath app.json -Encoding UTF8

Write-Host "Updated app.json:" -ForegroundColor Green
Write-Host "  API URL: $($appJson.expo.extra.apiBaseUrl)" -ForegroundColor Cyan
Write-Host "  WebSocket URL: $($appJson.expo.extra.wsBaseUrl)" -ForegroundColor Cyan

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Building Android APK..." -ForegroundColor Yellow
Write-Host "This will take 10-20 minutes..." -ForegroundColor White
Write-Host ""

$buildConfirm = Read-Host "Start build now? (y/n)"
if ($buildConfirm -eq 'y') {
    eas build --platform android --profile production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Frontend build complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Download your APK:" -ForegroundColor Yellow
        Write-Host "  eas build:download" -ForegroundColor Cyan
        Write-Host "  Or visit: https://expo.dev" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Build failed. Check Expo dashboard for logs." -ForegroundColor Red
    }
} else {
    Write-Host "Build skipped. Run manually: eas build --platform android --profile production" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your project is deployed:" -ForegroundColor Cyan
Write-Host "  Backend: $backendUrl" -ForegroundColor White
Write-Host "  Frontend: Check Expo dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test backend: $backendUrl/api/listings/" -ForegroundColor White
Write-Host "  2. Download APK from Expo dashboard" -ForegroundColor White
Write-Host "  3. Install and test on your device" -ForegroundColor White
Write-Host ""

