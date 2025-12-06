# Script to update frontend configuration with Railway backend URL

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Update Frontend Configuration" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Get Railway backend URL
Write-Host "Getting Railway backend URL..." -ForegroundColor Yellow

# Try to get URL from Railway CLI
$backendUrl = ""
try {
    $railwayDomain = railway domain 2>&1
    if ($railwayDomain -match "https://") {
        $backendUrl = ($railwayDomain | Select-String -Pattern "https://[^\s]+").Matches[0].Value
    }
} catch {
    Write-Host "Could not get URL from Railway CLI" -ForegroundColor Yellow
}

# If not found, ask user
if (-not $backendUrl) {
    Write-Host ""
    Write-Host "Please provide your Railway backend URL:" -ForegroundColor Cyan
    Write-Host "You can find it in Railway Dashboard:" -ForegroundColor White
    Write-Host "  1. Go to Railway Dashboard" -ForegroundColor White
    Write-Host "  2. Click your service (C2sProject)" -ForegroundColor White
    Write-Host "  3. Click 'Settings' tab" -ForegroundColor White
    Write-Host "  4. Look for 'Domains' section" -ForegroundColor White
    Write-Host "  5. Copy the URL (e.g., https://c2sproject-production-xxxx.up.railway.app)" -ForegroundColor White
    Write-Host ""
    $backendUrl = Read-Host "Enter your Railway backend URL"
}

# Remove trailing slash if present
$backendUrl = $backendUrl.TrimEnd('/')

# Validate URL
if (-not $backendUrl -or -not $backendUrl.StartsWith("https://")) {
    Write-Host "Invalid URL. Please provide a valid HTTPS URL." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Backend URL: $backendUrl" -ForegroundColor Green
Write-Host ""

# Update frontend/app.json
Write-Host "Updating frontend/app.json..." -ForegroundColor Yellow

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

Write-Host "Frontend configuration updated!" -ForegroundColor Green
Write-Host ""
Write-Host "Updated values:" -ForegroundColor Cyan
Write-Host "  API Base URL: $($appJson.expo.extra.apiBaseUrl)" -ForegroundColor White
Write-Host "  WebSocket URL: $($appJson.expo.extra.wsBaseUrl)" -ForegroundColor White
Write-Host ""

# Test backend connection
Write-Host "Testing backend connection..." -ForegroundColor Yellow
try {
    $healthCheckUrl = "$backendUrl/health/"
    $response = Invoke-WebRequest -Uri $healthCheckUrl -Method Get -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
        Write-Host "   Health check: $($response.Content)" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  Could not connect to backend. Make sure it's running." -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Next Steps" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Test your frontend:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "2. If you get CORS errors, update backend/marketplace/settings.py:" -ForegroundColor Cyan
Write-Host "   Add your frontend domain to CORS_ALLOWED_ORIGINS" -ForegroundColor White
Write-Host ""
Write-Host "3. Test API endpoints in your app" -ForegroundColor Cyan
Write-Host ""

