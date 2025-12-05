# ============================================
# Complete Deployment from GitHub Repository
# ============================================
# This script deploys both backend and frontend using GitHub

$GITHUB_REPO = "https://github.com/ksaikiran2606/C2sProject.git"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploying from GitHub Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Repository: $GITHUB_REPO" -ForegroundColor White
Write-Host ""

# Check if Railway CLI is installed
Write-Host "Checking Railway CLI..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "Railway CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Please install: winget install --id Railway.Railway" -ForegroundColor Yellow
    exit 1
}

# Check if EAS CLI is installed
Write-Host "Checking EAS CLI..." -ForegroundColor Yellow
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue
if (-not $easInstalled) {
    Write-Host "EAS CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g eas-cli
}

# Check Railway login
Write-Host "Checking Railway login..." -ForegroundColor Yellow
$railwayStatus = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Railway. Please login..." -ForegroundColor Yellow
    Write-Host "Run: railway login" -ForegroundColor Cyan
    Write-Host "This will open your browser for authentication." -ForegroundColor White
    Write-Host ""
    $login = Read-Host "Press Enter after logging in to Railway, or type 'skip' to continue"
    if ($login -eq 'skip') {
        Write-Host "Skipping Railway login. Please login manually first." -ForegroundColor Red
        exit 1
    }
}

# Check Expo login
Write-Host "Checking Expo login..." -ForegroundColor Yellow
$expoStatus = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Expo. Please login..." -ForegroundColor Yellow
    Write-Host "Run: eas login" -ForegroundColor Cyan
    Write-Host ""
    $login = Read-Host "Press Enter after logging in to Expo, or type 'skip' to continue"
    if ($login -eq 'skip') {
        Write-Host "Skipping Expo login. Please login manually first." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 1: Deploy Backend to Railway" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Navigate to backend
Set-Location backend

# Initialize Railway project
Write-Host "Initializing Railway project..." -ForegroundColor Yellow
railway init

# Link to GitHub repository
Write-Host ""
Write-Host "Linking to GitHub repository..." -ForegroundColor Yellow
Write-Host "In Railway dashboard:" -ForegroundColor White
Write-Host "  1. Go to https://railway.app" -ForegroundColor White
Write-Host "  2. Create new project" -ForegroundColor White
Write-Host "  3. Select 'Deploy from GitHub repo'" -ForegroundColor White
Write-Host "  4. Select repository: ksaikiran2606/C2sProject" -ForegroundColor White
Write-Host "  5. Set root directory to: /backend" -ForegroundColor White
Write-Host ""

# Add PostgreSQL
Write-Host "Adding PostgreSQL database..." -ForegroundColor Yellow
railway add postgresql

# Add Redis
Write-Host "Adding Redis..." -ForegroundColor Yellow
railway add redis

# Generate and set environment variables
Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow

# Generate secret key
$secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
Write-Host "Generated SECRET_KEY" -ForegroundColor Green

# Set variables
railway variables set SECRET_KEY=$secretKey
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

Write-Host "Environment variables set!" -ForegroundColor Green

# Deploy
Write-Host ""
Write-Host "Deploying backend to Railway..." -ForegroundColor Yellow
Write-Host "This may take 3-5 minutes..." -ForegroundColor White

railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Backend deployed successfully!" -ForegroundColor Green
    
    # Get backend URL
    $backendUrl = railway domain 2>&1 | Select-String -Pattern "https://" | ForEach-Object { $_.Line.Trim() }
    
    if (-not $backendUrl) {
        Write-Host "Getting backend URL from Railway..." -ForegroundColor Yellow
        $backendUrl = Read-Host "Enter your Railway backend URL (e.g., https://your-app.railway.app)"
    }
    
    Write-Host ""
    Write-Host "Backend URL: $backendUrl" -ForegroundColor Cyan
    
    # Save URL
    $backendUrl | Out-File -FilePath "..\backend-url.txt" -Encoding UTF8
    
    # Run migrations
    Write-Host ""
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    railway run python manage.py migrate
    
    Write-Host ""
    Write-Host "Backend deployment complete!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Backend deployment failed. Check Railway logs: railway logs" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 2: Deploy Frontend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Read backend URL
if (Test-Path "backend-url.txt") {
    $backendUrl = Get-Content "backend-url.txt" -Raw | ForEach-Object { $_.Trim() }
} else {
    $backendUrl = Read-Host "Enter your backend URL"
}

# Navigate to frontend
Set-Location frontend

# Update app.json with production URLs
Write-Host "Updating frontend configuration..." -ForegroundColor Yellow
$appJson = Get-Content app.json -Raw | ConvertFrom-Json
$appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
$appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"
$appJson | ConvertTo-Json -Depth 10 | Out-File -FilePath app.json -Encoding UTF8

Write-Host "Updated app.json:" -ForegroundColor Green
Write-Host "  API URL: $($appJson.expo.extra.apiBaseUrl)" -ForegroundColor Cyan
Write-Host "  WebSocket URL: $($appJson.expo.extra.wsBaseUrl)" -ForegroundColor Cyan

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build with EAS
Write-Host ""
Write-Host "Building Android APK with EAS..." -ForegroundColor Yellow
Write-Host "This will take 10-20 minutes..." -ForegroundColor White
Write-Host ""

$buildConfirm = Read-Host "Start build? (y/n)"
if ($buildConfirm -eq 'y') {
    eas build --platform android --profile production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Frontend build complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Download APK:" -ForegroundColor Yellow
        Write-Host "  eas build:download" -ForegroundColor Cyan
        Write-Host "  Or visit: https://expo.dev" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Build failed. Check Expo dashboard for logs." -ForegroundColor Red
    }
}

Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: $backendUrl" -ForegroundColor Cyan
Write-Host "Frontend: Check Expo dashboard for build status" -ForegroundColor Cyan
Write-Host ""

