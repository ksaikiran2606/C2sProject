# APK Build Script
# This script will help you build an APK for your app

Write-Host "`n🚀 Starting APK Build Process...`n" -ForegroundColor Green

# Check if logged in
Write-Host "Checking Expo login status..." -ForegroundColor Yellow
$loginStatus = eas whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Not logged in to Expo. Please login first:`n" -ForegroundColor Red
    Write-Host "Run: eas login" -ForegroundColor Cyan
    Write-Host "`nOr create a new account at: https://expo.dev/signup`n" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Logged in to Expo`n" -ForegroundColor Green

# Start the build
Write-Host "Starting APK build..." -ForegroundColor Yellow
Write-Host "This will take 10-15 minutes. You'll get a download link when it's done.`n" -ForegroundColor Cyan

eas build --platform android --profile preview

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build started successfully!`n" -ForegroundColor Green
    Write-Host "Check your build status at: https://expo.dev/accounts/[your-username]/builds" -ForegroundColor Cyan
    Write-Host "You'll receive a download link when the build completes.`n" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Build failed. Check the error messages above.`n" -ForegroundColor Red
}

