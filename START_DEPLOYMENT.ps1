# ============================================
# Start Deployment - Interactive Guide
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Deployment Process" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Login to Railway" -ForegroundColor Yellow
Write-Host "This will open your browser for authentication..." -ForegroundColor White
$railwayLogin = Read-Host "Press Enter to login to Railway (or type 'skip' to do it later)"
if ($railwayLogin -ne 'skip') {
    railway login
}

Write-Host ""
Write-Host "Step 2: Login to Expo" -ForegroundColor Yellow
Write-Host "This will open your browser for authentication..." -ForegroundColor White
$expoLogin = Read-Host "Press Enter to login to Expo (or type 'skip' to do it later)"
if ($expoLogin -ne 'skip') {
    eas login
}

Write-Host ""
Write-Host "Step 3: Deploy Backend" -ForegroundColor Yellow
$deployBackend = Read-Host "Ready to deploy backend? (y/n)"
if ($deployBackend -eq 'y') {
    Write-Host "Starting backend deployment..." -ForegroundColor Green
    & .\deploy-backend.ps1
} else {
    Write-Host "Skipping backend deployment. Run deploy-backend.ps1 later." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 4: Deploy Frontend" -ForegroundColor Yellow
Write-Host "Note: You need your backend URL from Step 3 first!" -ForegroundColor White
$deployFrontend = Read-Host "Ready to deploy frontend? (y/n)"
if ($deployFrontend -eq 'y') {
    Write-Host "Starting frontend deployment..." -ForegroundColor Green
    & .\deploy-frontend.ps1
} else {
    Write-Host "Skipping frontend deployment. Run deploy-frontend.ps1 later." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Deployment Process Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

