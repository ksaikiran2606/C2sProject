# ============================================
# Complete Deployment Script
# Deploys Backend + Frontend from GitHub
# ============================================

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Complete Project Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/ksaikiran2606/C2sProject.git" -ForegroundColor White
Write-Host ""

# Step 1: Check Prerequisites
Write-Host "STEP 1: Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

$allGood = $true

# Check Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if ($railwayInstalled) {
    Write-Host "  ✓ Railway CLI installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Railway CLI not found" -ForegroundColor Red
    Write-Host "    Install: winget install --id Railway.Railway" -ForegroundColor Yellow
    $allGood = $false
}

# Check EAS CLI
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue
if ($easInstalled) {
    Write-Host "  ✓ EAS CLI installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ EAS CLI not found" -ForegroundColor Red
    Write-Host "    Install: npm install -g eas-cli" -ForegroundColor Yellow
    $allGood = $false
}

# Check Node.js
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if ($nodeInstalled) {
    Write-Host "  ✓ Node.js installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js not found" -ForegroundColor Red
    $allGood = $false
}

if (-not $allGood) {
    Write-Host ""
    Write-Host "Please install missing prerequisites first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 2: Authentication" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check Railway login
Write-Host "Checking Railway authentication..." -ForegroundColor Yellow
$railwayCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Not logged in to Railway" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please login to Railway:" -ForegroundColor Cyan
    Write-Host "  1. Open a NEW PowerShell window" -ForegroundColor White
    Write-Host "  2. Run: railway login" -ForegroundColor White
    Write-Host "  3. Complete browser authentication" -ForegroundColor White
    Write-Host "  4. Return here and press Enter" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter after logging in to Railway"
    
    # Verify login
    $railwayCheck = railway whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Still not logged in. Please try again." -ForegroundColor Red
        exit 1
    }
}
Write-Host "  ✓ Logged in to Railway" -ForegroundColor Green

# Check Expo login
Write-Host "Checking Expo authentication..." -ForegroundColor Yellow
$expoCheck = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ⚠ Not logged in to Expo" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please login to Expo:" -ForegroundColor Cyan
    Write-Host "  Run: eas login" -ForegroundColor White
    Write-Host "  Enter your Expo credentials" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter after logging in to Expo"
    
    # Verify login
    $expoCheck = eas whoami 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Still not logged in. Please try again." -ForegroundColor Red
        exit 1
    }
}
Write-Host "  ✓ Logged in to Expo" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 3: Deploy Backend to Railway" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Choose deployment method:" -ForegroundColor Yellow
Write-Host "  1. Railway Dashboard (Recommended - Easiest)" -ForegroundColor Cyan
Write-Host "  2. Railway CLI (Command Line)" -ForegroundColor Cyan
Write-Host ""
$method = Read-Host 'Enter choice (1 or 2)'

if ($method -eq "1") {
    Write-Host ""
    Write-Host "Follow these steps in Railway Dashboard:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Go to: https://railway.app" -ForegroundColor White
    Write-Host "2. Click 'New Project'" -ForegroundColor White
    Write-Host "3. Select 'Deploy from GitHub repo'" -ForegroundColor White
    Write-Host "4. Select repository: ksaikiran2606/C2sProject" -ForegroundColor White
    Write-Host "5. After deployment starts:" -ForegroundColor White
    Write-Host "   - Click on the service" -ForegroundColor White
    Write-Host "   - Settings → Root Directory → Set to: /backend" -ForegroundColor White
    Write-Host "6. Add PostgreSQL: + New → Database → PostgreSQL" -ForegroundColor White
    Write-Host "7. Add Redis: + New → Database → Redis" -ForegroundColor White
    Write-Host "8. Set Environment Variables (in service → Variables):" -ForegroundColor White
    Write-Host "   - SECRET_KEY (generate random string)" -ForegroundColor White
    Write-Host "   - DEBUG=False" -ForegroundColor White
    Write-Host "   - USE_POSTGRES=True" -ForegroundColor White
    Write-Host "   - ALLOWED_HOSTS=*.railway.app" -ForegroundColor White
    Write-Host "9. Generate domain: Settings → Generate Domain" -ForegroundColor White
    Write-Host ""
    $backendUrl = Read-Host 'Enter your Railway backend URL (e.g., https://your-app.railway.app)'
    
} else {
    # CLI Deployment
    Write-Host ""
    Write-Host "Deploying via Railway CLI..." -ForegroundColor Yellow
    
    Set-Location backend
    
    # Initialize
    Write-Host "Initializing Railway project..." -ForegroundColor Yellow
    railway init
    
    # Add databases
    Write-Host "Adding PostgreSQL..." -ForegroundColor Yellow
    railway add postgresql
    
    Write-Host "Adding Redis..." -ForegroundColor Yellow
    railway add redis
    
    # Generate secret key
    Write-Host "Generating secret key..." -ForegroundColor Yellow
    $secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
    
    # Set variables
    Write-Host "Setting environment variables..." -ForegroundColor Yellow
    railway variables set SECRET_KEY=$secretKey
    railway variables set DEBUG=False
    railway variables set USE_POSTGRES=True
    railway variables set ALLOWED_HOSTS="*.railway.app"
    
    # Deploy
    Write-Host ""
    Write-Host "Deploying to Railway..." -ForegroundColor Yellow
    Write-Host "This may take 3-5 minutes..." -ForegroundColor White
    railway up
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backend deployed successfully!" -ForegroundColor Green
        
        # Get URL
        Write-Host "Getting backend URL..." -ForegroundColor Yellow
        $backendUrl = railway domain 2>&1 | Select-String -Pattern "https://" | ForEach-Object { $_.Line.Trim() }
        
        if (-not $backendUrl) {
            $backendUrl = Read-Host "Enter your Railway backend URL"
        }
        
        # Run migrations
        Write-Host "Running database migrations..." -ForegroundColor Yellow
        railway run python manage.py migrate
        
    } else {
        Write-Host "Deployment failed. Check logs: railway logs" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
    
    Set-Location ..
}

# Save backend URL
$backendUrl | Out-File -FilePath "backend-url.txt" -Encoding UTF8
Write-Host ""
Write-Host "Backend URL saved: $backendUrl" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 4: Update Frontend Configuration" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location frontend

# Update app.json
Write-Host "Updating frontend/app.json with production URLs..." -ForegroundColor Yellow
$appJson = Get-Content app.json -Raw | ConvertFrom-Json
$appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
$appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"
$appJson | ConvertTo-Json -Depth 10 | Out-File -FilePath app.json -Encoding UTF8

Write-Host "Updated configuration:" -ForegroundColor Green
Write-Host "  API URL: $($appJson.expo.extra.apiBaseUrl)" -ForegroundColor Cyan
Write-Host "  WebSocket URL: $($appJson.expo.extra.wsBaseUrl)" -ForegroundColor Cyan

# Commit changes
Write-Host ""
Write-Host "Committing changes to GitHub..." -ForegroundColor Yellow
Set-Location ..
git add frontend/app.json
git commit -m "Update production URLs for deployment"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Changes pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "Failed to push. Please push manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  STEP 5: Build Frontend" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Set-Location frontend

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

# Build
Write-Host ""
Write-Host "Building Android APK..." -ForegroundColor Yellow
Write-Host "This will take 10-20 minutes..." -ForegroundColor White
Write-Host ""

$buildConfirm = Read-Host "Start build now? (y/n)"
if ($buildConfirm -eq 'y') {
    eas build --platform android --profile production
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Build complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Download APK:" -ForegroundColor Yellow
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
Write-Host "  Frontend: Check Expo dashboard for build status" -ForegroundColor White
Write-Host ""
Write-Host "Test your deployment:" -ForegroundColor Yellow
Write-Host "  Backend API: $backendUrl/api/listings/" -ForegroundColor White
Write-Host "  Admin Panel: $backendUrl/admin/" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Download APK from Expo dashboard" -ForegroundColor White
Write-Host "  2. Install on your device" -ForegroundColor White
Write-Host "  3. Test all features" -ForegroundColor White
Write-Host ""

