# ============================================
# Complete Deployment Script
# ============================================
# This script deploys both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Complete Project Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will deploy:" -ForegroundColor Yellow
Write-Host "  1. Backend (Django) to Railway" -ForegroundColor White
Write-Host "  2. Frontend (React Native) using EAS Build" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Continue with deployment? (y/n)"
if ($continue -ne 'y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Deploy Backend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Deploying Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

& .\deploy-backend.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Backend deployment failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}

# Get backend URL
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Backend Deployment Complete!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
$backendUrl = Read-Host "Enter your deployed backend URL (e.g., https://your-app.railway.app)"

if (-not $backendUrl) {
    Write-Host "Backend URL is required for frontend deployment." -ForegroundColor Red
    exit 1
}

# Deploy Frontend
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Deploying Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Update frontend app.json with backend URL before deployment
Write-Host "Updating frontend configuration with backend URL..." -ForegroundColor Yellow
Set-Location frontend

$appJson = Get-Content app.json -Raw | ConvertFrom-Json
$appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
$appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"
$appJson | ConvertTo-Json -Depth 10 | Out-File -FilePath app.json -Encoding UTF8

Write-Host "Updated frontend configuration:" -ForegroundColor Green
Write-Host "  API URL: $($appJson.expo.extra.apiBaseUrl)" -ForegroundColor Cyan
Write-Host "  WebSocket URL: $($appJson.expo.extra.wsBaseUrl)" -ForegroundColor Cyan

Set-Location ..

& .\deploy-frontend.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your project has been deployed:" -ForegroundColor Cyan
Write-Host "  Backend: $backendUrl" -ForegroundColor White
Write-Host "  Frontend: Check Expo dashboard for build status" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Test your backend API: $backendUrl/api/listings/" -ForegroundColor White
Write-Host "  2. Download your frontend build from Expo dashboard" -ForegroundColor White
Write-Host "  3. Install the APK on your device and test" -ForegroundColor White
Write-Host ""

