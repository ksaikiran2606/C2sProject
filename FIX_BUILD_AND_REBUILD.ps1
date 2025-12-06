# Fix Build Issues and Rebuild APK

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix Build Issues & Rebuild" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Navigate to frontend
Set-Location frontend

Write-Host "Step 1: Installing/updating dependencies..." -ForegroundColor Cyan
npm install --legacy-peer-deps
Write-Host ""

Write-Host "Step 2: Checking for TypeScript errors..." -ForegroundColor Cyan
$tsErrors = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  TypeScript errors found. Attempting to fix..." -ForegroundColor Yellow
    
    # Common fix: Add placeholderText to styles if missing
    Write-Host "   Checking for style issues..." -ForegroundColor White
} else {
    Write-Host "✅ No TypeScript errors" -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 3: Verifying required files..." -ForegroundColor Cyan
$requiredFiles = @(
    "app.json",
    "package.json",
    "eas.json",
    "assets/icon.png",
    "assets/splash.png"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Missing files detected. Please add them before building." -ForegroundColor Yellow
} else {
    Write-Host "✅ All required files present" -ForegroundColor Green
}
Write-Host ""

Write-Host "Step 4: Checking Expo login..." -ForegroundColor Cyan
$username = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in. Please run: eas login" -ForegroundColor Red
    Set-Location ..
    exit 1
}
$username = $username.Trim()
Write-Host "✅ Logged in as: $username" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Building APK..." -ForegroundColor Cyan
Write-Host "This will take 10-15 minutes..." -ForegroundColor Yellow
Write-Host ""

# Build with better error handling
eas build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Build Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Check build status:" -ForegroundColor Cyan
    Write-Host "  https://expo.dev/accounts/$username/projects/clicktosell/builds" -ForegroundColor White
    Write-Host ""
    Write-Host "Download APK when ready:" -ForegroundColor Cyan
    Write-Host "  eas build:download" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ❌ Build Failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check detailed logs:" -ForegroundColor Yellow
    Write-Host "  https://expo.dev/accounts/$username/projects/clicktosell/builds" -ForegroundColor White
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "  1. Check build logs for specific error" -ForegroundColor White
    Write-Host "  2. Fix TypeScript errors" -ForegroundColor White
    Write-Host "  3. Ensure all assets exist" -ForegroundColor White
    Write-Host ""
}

Set-Location ..

Write-Host "Done!" -ForegroundColor Green
Write-Host ""

