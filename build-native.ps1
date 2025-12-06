# Native Build Script - Works for Android and iOS
# This uses prebuild to create native projects

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Native Build (Android + iOS)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$frontendDir = "C:\Users\DELL\OneDrive\Desktop\CoolProject\frontend"

# Navigate to frontend
Set-Location $frontendDir
Write-Host "Current directory: $(Get-Location)" -ForegroundColor White
Write-Host ""

# Step 1: Prebuild
Write-Host "Step 1: Running prebuild..." -ForegroundColor Yellow
Write-Host "This creates android/ and ios/ folders" -ForegroundColor White
Write-Host ""

$prebuild = Read-Host "Run prebuild? This will create native folders (Y/N)"
if ($prebuild -eq "Y" -or $prebuild -eq "y") {
    npx expo prebuild
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Prebuild failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ Prebuild completed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Skipping prebuild..." -ForegroundColor Yellow
    Write-Host ""
}

# Step 2: Build Android
Write-Host "Step 2: Building Android APK..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "android") {
    Set-Location android
    
    Write-Host "Building release APK..." -ForegroundColor Cyan
    .\gradlew assembleRelease
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ Android APK Built Successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "APK Location:" -ForegroundColor Cyan
        Write-Host "  android/app/build/outputs/apk/release/app-release.apk" -ForegroundColor White
        Write-Host ""
        
        $apkPath = "app\build\outputs\apk\release\app-release.apk"
        if (Test-Path $apkPath) {
            $apkSize = (Get-Item $apkPath).Length / 1MB
            Write-Host "APK Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Green
        }
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "  ❌ Android Build Failed" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Make sure Android Studio and Android SDK are installed." -ForegroundColor Yellow
    }
} else {
    Write-Host "Android folder not found. Run prebuild first!" -ForegroundColor Red
}

Write-Host ""
Write-Host "For iOS:" -ForegroundColor Cyan
Write-Host "  1. cd ios" -ForegroundColor White
Write-Host "  2. pod install (if on Mac)" -ForegroundColor White
Write-Host "  3. Open clicktosell.xcworkspace in Xcode" -ForegroundColor White
Write-Host "  4. Build in Xcode" -ForegroundColor White
Write-Host ""

