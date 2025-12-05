# ============================================
# Frontend Deployment Script - EAS Build
# ============================================
# This script builds and deploys the React Native frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend Deployment - EAS Build" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeInstalled) {
    Write-Host "Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js version: $(node --version)" -ForegroundColor Green

# Check if EAS CLI is installed
Write-Host "Checking EAS CLI installation..." -ForegroundColor Yellow
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue

if (-not $easInstalled) {
    Write-Host "EAS CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install EAS CLI. Exiting." -ForegroundColor Red
        exit 1
    }
}
Write-Host "EAS CLI version: $(eas --version)" -ForegroundColor Green

# Navigate to frontend directory
Write-Host "Navigating to frontend directory..." -ForegroundColor Yellow
Set-Location frontend

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies. Exiting." -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Check if logged in to Expo
Write-Host "Checking Expo login status..." -ForegroundColor Yellow
$loginStatus = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Expo. Please login..." -ForegroundColor Yellow
    eas login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to login to Expo. Exiting." -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

# Update app.json with production URLs
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  IMPORTANT: Update Production URLs" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Before building, you need to update app.json with your deployed backend URL." -ForegroundColor Yellow
Write-Host ""
$backendUrl = Read-Host "Enter your backend URL (e.g., https://your-app.railway.app)"

if ($backendUrl) {
    Write-Host "Updating app.json with production URLs..." -ForegroundColor Yellow
    
    # Read app.json
    $appJson = Get-Content app.json -Raw | ConvertFrom-Json
    
    # Update URLs
    $appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
    $appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"
    
    # Save app.json
    $appJson | ConvertTo-Json -Depth 10 | Out-File -FilePath app.json -Encoding UTF8
    Write-Host "Updated app.json with production URLs." -ForegroundColor Green
    Write-Host "  API URL: $($appJson.expo.extra.apiBaseUrl)" -ForegroundColor Cyan
    Write-Host "  WebSocket URL: $($appJson.expo.extra.wsBaseUrl)" -ForegroundColor Cyan
} else {
    Write-Host "Skipping URL update. Make sure app.json has correct production URLs!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Choose build type:" -ForegroundColor Yellow
Write-Host "1. Android APK (for direct installation)" -ForegroundColor Cyan
Write-Host "2. Android AAB (for Google Play Store)" -ForegroundColor Cyan
Write-Host "3. iOS (requires Apple Developer account)" -ForegroundColor Cyan
Write-Host "4. Web (for web deployment)" -ForegroundColor Cyan
$buildChoice = Read-Host "Enter choice (1-4)"

$buildProfile = "production"
$platform = ""

switch ($buildChoice) {
    "1" {
        $platform = "android"
        Write-Host "Building Android APK..." -ForegroundColor Yellow
        # Update eas.json for APK build
        $easJson = Get-Content eas.json -Raw | ConvertFrom-Json
        $easJson.build.production.android.buildType = "apk"
        $easJson | ConvertTo-Json -Depth 10 | Out-File -FilePath eas.json -Encoding UTF8
    }
    "2" {
        $platform = "android"
        Write-Host "Building Android AAB..." -ForegroundColor Yellow
        # Update eas.json for AAB build
        $easJson = Get-Content eas.json -Raw | ConvertFrom-Json
        $easJson.build.production.android.buildType = "app-bundle"
        $easJson | ConvertTo-Json -Depth 10 | Out-File -FilePath eas.json -Encoding UTF8
    }
    "3" {
        $platform = "ios"
        Write-Host "Building iOS app..." -ForegroundColor Yellow
    }
    "4" {
        $platform = "web"
        Write-Host "Building for web..." -ForegroundColor Yellow
    }
    default {
        Write-Host "Invalid choice. Defaulting to Android APK." -ForegroundColor Yellow
        $platform = "android"
    }
}

if ($platform -eq "web") {
    # Build for web using Expo
    Write-Host "Building web version..." -ForegroundColor Yellow
    npx expo export:web
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  Web Build Successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Web build is in: frontend/web-build/" -ForegroundColor Cyan
        Write-Host "You can deploy this to:" -ForegroundColor Yellow
        Write-Host "  - Vercel: vercel deploy" -ForegroundColor White
        Write-Host "  - Netlify: netlify deploy" -ForegroundColor White
        Write-Host "  - GitHub Pages" -ForegroundColor White
        Write-Host "  - Any static hosting service" -ForegroundColor White
    }
} else {
    # Build using EAS
    Write-Host ""
    Write-Host "Starting EAS build..." -ForegroundColor Yellow
    Write-Host "This will build your app in the cloud. It may take 10-20 minutes." -ForegroundColor Yellow
    Write-Host ""
    
    $confirm = Read-Host "Continue with build? (y/n)"
    if ($confirm -eq 'y') {
        eas build --platform $platform --profile $buildProfile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "  Build Successful!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Your build is complete!" -ForegroundColor Cyan
            Write-Host "Check the Expo dashboard for download link:" -ForegroundColor Yellow
            Write-Host "  https://expo.dev/accounts/[your-account]/projects/clicktosell/builds" -ForegroundColor White
            Write-Host ""
            Write-Host "You can also download it via CLI:" -ForegroundColor Yellow
            Write-Host "  eas build:list" -ForegroundColor White
            Write-Host "  eas build:download" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "  Build Failed!" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "Check the build logs for errors." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Build cancelled." -ForegroundColor Yellow
    }
}

Set-Location ..
Write-Host ""
Write-Host "Frontend deployment process completed!" -ForegroundColor Cyan

