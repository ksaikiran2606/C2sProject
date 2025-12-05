# Build APK Script - Run this to build your APK
# Make sure you're in the frontend directory

Write-Host "🚀 Starting APK Build Process..." -ForegroundColor Green
Write-Host ""

# Check if logged in
Write-Host "Checking Expo login status..." -ForegroundColor Yellow
$loginStatus = eas whoami 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in. Please login first:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run this command:" -ForegroundColor Cyan
    Write-Host "  eas login" -ForegroundColor White
    Write-Host ""
    Write-Host "Then come back and run this script again, or run:" -ForegroundColor Yellow
    Write-Host "  eas build --platform android --profile preview" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Logged in!" -ForegroundColor Green
Write-Host ""

# Start the build
Write-Host "📦 Starting APK build..." -ForegroundColor Yellow
Write-Host "This will take 10-15 minutes. The build happens in the cloud." -ForegroundColor Cyan
Write-Host ""

eas build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build started successfully!" -ForegroundColor Green
    Write-Host "Check your Expo dashboard for the download link." -ForegroundColor Cyan
    Write-Host "Or run: eas build:list" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Build failed. Check the error above." -ForegroundColor Red
}

