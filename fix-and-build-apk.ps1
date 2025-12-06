
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix All Issues & Build APK" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Get Railway Backend URL
Write-Host "Step 1: Get Railway Backend URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please provide your Railway backend URL:" -ForegroundColor Yellow
Write-Host "Find it in Railway Dashboard → Settings → Domains" -ForegroundColor White
Write-Host ""
$backendUrl = Read-Host "Enter your Railway backend URL (e.g., https://c2sproject-production-xxxx.up.railway.app)"

# Validate URL
if (-not $backendUrl -or -not $backendUrl.StartsWith("https://")) {
    Write-Host "Invalid URL. Please provide a valid HTTPS URL." -ForegroundColor Red
    exit 1
}

$backendUrl = $backendUrl.TrimEnd('/')
Write-Host "✅ Backend URL: $backendUrl" -ForegroundColor Green
Write-Host ""

# Step 2: Update frontend/app.json
Write-Host "Step 2: Updating frontend/app.json..." -ForegroundColor Cyan

$appJsonPath = "frontend\app.json"
if (-not (Test-Path $appJsonPath)) {
    Write-Host "Error: frontend/app.json not found!" -ForegroundColor Red
    exit 1
}

$appJson = Get-Content $appJsonPath -Raw | ConvertFrom-Json
$appJson.expo.extra.apiBaseUrl = "$backendUrl/api"
$appJson.expo.extra.wsBaseUrl = $backendUrl -replace "https://", "wss://" -replace "http://", "ws://"

$appJson | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath -Encoding UTF8
Write-Host "✅ Updated app.json with Railway URL" -ForegroundColor Green
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
    Write-Host "⚠️  Could not connect to backend: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   Continuing anyway..." -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Navigate to frontend and install dependencies
Write-Host "Step 4: Installing/updating dependencies..." -ForegroundColor Cyan
Set-Location frontend

# Install dependencies
npm install --legacy-peer-deps 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some dependency warnings (continuing...)" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Check TypeScript errors
Write-Host "Step 5: Checking for TypeScript errors..." -ForegroundColor Cyan
$tsErrors = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ No TypeScript errors" -ForegroundColor Green
} else {
    Write-Host "⚠️  TypeScript errors found:" -ForegroundColor Yellow
    Write-Host $tsErrors -ForegroundColor White
    Write-Host "   Attempting to continue anyway..." -ForegroundColor Yellow
}
Write-Host ""

# Step 6: Check Expo login
Write-Host "Step 6: Checking Expo login..." -ForegroundColor Cyan
$loginStatus = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Expo." -ForegroundColor Red
    Write-Host "   Please run: eas login" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# Extract username - eas whoami returns just the username
$username = "sai2206"  # Default fallback
try {
    # eas whoami returns just the username directly
    $usernameOutput = ($loginStatus | Out-String).Trim()
    if ($usernameOutput -and $usernameOutput -ne "") {
        $username = $usernameOutput
    }
} catch {
    # Use default if extraction fails
    $username = "sai2206"
}
Write-Host "✅ Logged in as: $username" -ForegroundColor Green
Write-Host ""

# Step 7: Build APK
Write-Host "Step 7: Building APK..." -ForegroundColor Cyan
Write-Host ""
Write-Host "This will take 10-15 minutes. Building in the cloud..." -ForegroundColor Yellow
Write-Host ""

# Start the build
$buildOutput = eas build --platform android --profile preview 2>&1 | Tee-Object -Variable buildLog

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Build Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Try to extract build ID and download link
    $buildId = ($buildLog | Select-String -Pattern "builds/([a-f0-9-]+)").Matches[0].Groups[1].Value
    if ($buildId) {
        $buildUrl = "https://expo.dev/accounts/$username/projects/clicktosell/builds/$buildId"
        Write-Host "Build URL: $buildUrl" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Monitor build status:" -ForegroundColor Yellow
        Write-Host "  $buildUrl" -ForegroundColor White
        Write-Host ""
        Write-Host "Or check all builds:" -ForegroundColor Yellow
        Write-Host "  https://expo.dev/accounts/$username/projects/clicktosell/builds" -ForegroundColor White
        Write-Host ""
        Write-Host "Once build completes, download link will be available at the build URL above." -ForegroundColor Green
    } else {
        Write-Host "Check your builds at:" -ForegroundColor Yellow
        Write-Host "  https://expo.dev/accounts/$username/projects/clicktosell/builds" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "To download APK after build completes:" -ForegroundColor Cyan
    Write-Host "  eas build:download" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ Build Failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check build logs for details:" -ForegroundColor Yellow
    Write-Host "  https://expo.dev/accounts/$username/projects/clicktosell/builds" -ForegroundColor White
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "  1. Check build logs for specific errors" -ForegroundColor White
    Write-Host "  2. Fix TypeScript errors if any" -ForegroundColor White
    Write-Host "  3. Ensure all dependencies are installed" -ForegroundColor White
    Write-Host ""
}

Set-Location ..

Write-Host ""
Write-Host "Script completed!" -ForegroundColor Green
Write-Host ""

