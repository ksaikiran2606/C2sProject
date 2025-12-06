# Setup Script for Android Build
# This checks and installs requirements for native Android build

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Android Build Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Java
Write-Host "Checking Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java not found" -ForegroundColor Red
    Write-Host "  Install Java JDK 17+ from: https://adoptium.net" -ForegroundColor Yellow
}

Write-Host ""

# Check Android SDK
Write-Host "Checking Android SDK..." -ForegroundColor Yellow
$androidHome = $env:ANDROID_HOME
if ($androidHome) {
    Write-Host "✓ ANDROID_HOME: $androidHome" -ForegroundColor Green
} else {
    Write-Host "✗ ANDROID_HOME not set" -ForegroundColor Red
    Write-Host "  Install Android Studio from: https://developer.android.com/studio" -ForegroundColor Yellow
    Write-Host "  Then set ANDROID_HOME environment variable" -ForegroundColor Yellow
}

Write-Host ""

# Check if Android Studio is installed
$androidStudioPaths = @(
    "$env:LOCALAPPDATA\Programs\Android\Android Studio",
    "$env:ProgramFiles\Android\Android Studio",
    "$env:ProgramFiles(x86)\Android\Android Studio"
)

$androidStudioFound = $false
foreach ($path in $androidStudioPaths) {
    if (Test-Path $path) {
        Write-Host "✓ Android Studio found: $path" -ForegroundColor Green
        $androidStudioFound = $true
        break
    }
}

if (-not $androidStudioFound) {
    Write-Host "✗ Android Studio not found" -ForegroundColor Red
    Write-Host "  Download from: https://developer.android.com/studio" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install Android Studio:" -ForegroundColor Yellow
Write-Host "   https://developer.android.com/studio" -ForegroundColor White
Write-Host ""
Write-Host "2. Install Android SDK:" -ForegroundColor Yellow
Write-Host "   - Open Android Studio" -ForegroundColor White
Write-Host "   - Tools > SDK Manager" -ForegroundColor White
Write-Host "   - Install Android SDK Platform 33+" -ForegroundColor White
Write-Host ""
Write-Host "3. Set Environment Variables:" -ForegroundColor Yellow
Write-Host "   ANDROID_HOME=C:\Users\DELL\AppData\Local\Android\Sdk" -ForegroundColor White
Write-Host "   Add to PATH: %ANDROID_HOME%\platform-tools" -ForegroundColor White
Write-Host ""
Write-Host "4. Then run: .\build-native.ps1" -ForegroundColor Green
Write-Host ""

