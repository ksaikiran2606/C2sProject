# Simple Deployment Script
# Deploys Backend and Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploying Project" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Railway login
Write-Host "Checking Railway login..." -ForegroundColor Yellow
railway whoami 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Railway first:" -ForegroundColor Red
    Write-Host "  railway login" -ForegroundColor Yellow
    exit 1
}
Write-Host "Railway: Logged in" -ForegroundColor Green

# Check Expo login
Write-Host "Checking Expo login..." -ForegroundColor Yellow
eas whoami 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Expo first:" -ForegroundColor Red
    Write-Host "  eas login" -ForegroundColor Yellow
    exit 1
}
Write-Host "Expo: Logged in" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deploying Backend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location backend

# Initialize Railway
Write-Host "Initializing Railway project..." -ForegroundColor Yellow
railway init

# Add databases
Write-Host "Adding PostgreSQL..." -ForegroundColor Yellow
railway add postgresql

Write-Host "Adding Redis..." -ForegroundColor Yellow
railway add redis

# Generate and set secret key
$secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
Write-Host "Setting environment variables..." -ForegroundColor Yellow
railway variables set SECRET_KEY=$secretKey
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

# Deploy
Write-Host ""
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend deployed!" -ForegroundColor Green
    
    # Get URL
    $backendUrl = railway domain 2>&1 | Select-String -Pattern "https://" | ForEach-Object { $_.Line.Trim() }
    if (-not $backendUrl) {
        Write-Host "Enter your Railway backend URL:" -ForegroundColor Yellow
        $backendUrl = Read-Host
    }
    
    Write-Host "Backend URL: $backendUrl" -ForegroundColor Cyan
    
    # Save URL
    $backendUrl | Out-File -FilePath "..\backend-url.txt" -Encoding UTF8
    
    # Run migrations
    Write-Host "Running migrations..." -ForegroundColor Yellow
    railway run python manage.py migrate
    
} else {
    Write-Host "Backend deployment failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deploying Frontend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Read backend URL
if (Test-Path "backend-url.txt") {
    $backendUrl = Get-Content "backend-url.txt" -Raw | ForEach-Object { $_.Trim() }
} else {
    Write-Host "Enter your backend URL:" -ForegroundColor Yellow
    $backendUrl = Read-Host
}

Set-Location frontend

# Update app.json
Write-Host "Updating frontend configuration..." -ForegroundColor Yellow
$appJson = Get-Content app.json -Raw | ConvertFrom-Json
$appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
$appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"
$appJson | ConvertTo-Json -Depth 10 | Out-File -FilePath app.json -Encoding UTF8

Write-Host "Configuration updated" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Commit and push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Set-Location ..
git add frontend/app.json
git commit -m "Update production URLs"
git push origin main

# Build
Write-Host ""
Write-Host "Building Android APK..." -ForegroundColor Yellow
Write-Host "This takes 10-20 minutes..." -ForegroundColor White
Set-Location frontend

eas build --platform android --profile production

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Deployment Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Backend: $backendUrl" -ForegroundColor Cyan
    Write-Host "Frontend: Check Expo dashboard" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Download APK: eas build:download" -ForegroundColor Yellow
} else {
    Write-Host "Build failed. Check Expo dashboard" -ForegroundColor Red
}

Set-Location ..

