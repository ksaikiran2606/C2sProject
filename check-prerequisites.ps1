# ============================================
# Prerequisites Check Script
# ============================================
# This script checks if all required tools are installed

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Checking Prerequisites" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if ($nodeInstalled) {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Node.js not found" -ForegroundColor Red
    Write-Host "    Install from: https://nodejs.org/" -ForegroundColor Yellow
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
$npmInstalled = Get-Command npm -ErrorAction SilentlyContinue
if ($npmInstalled) {
    $npmVersion = npm --version
    Write-Host "  ✓ npm installed: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ npm not found" -ForegroundColor Red
    $allGood = $false
}

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
$pythonInstalled = Get-Command python -ErrorAction SilentlyContinue
if ($pythonInstalled) {
    $pythonVersion = python --version
    Write-Host "  ✓ Python installed: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Python not found" -ForegroundColor Red
    Write-Host "    Install from: https://www.python.org/" -ForegroundColor Yellow
    $allGood = $false
}

# Check Git
Write-Host "Checking Git..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if ($gitInstalled) {
    $gitVersion = git --version
    Write-Host "  ✓ Git installed: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Git not found" -ForegroundColor Red
    Write-Host "    Install from: https://git-scm.com/" -ForegroundColor Yellow
    $allGood = $false
}

# Check Railway CLI
Write-Host "Checking Railway CLI..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if ($railwayInstalled) {
    $railwayVersion = railway --version 2>&1
    Write-Host "  ✓ Railway CLI installed: $railwayVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Railway CLI not found" -ForegroundColor Red
    Write-Host "    Install with: winget install --id Railway.Railway" -ForegroundColor Yellow
    Write-Host "    Or download from: https://github.com/railwayapp/cli/releases" -ForegroundColor Yellow
    $allGood = $false
}

# Check EAS CLI
Write-Host "Checking EAS CLI..." -ForegroundColor Yellow
$easInstalled = Get-Command eas -ErrorAction SilentlyContinue
if ($easInstalled) {
    $easVersion = eas --version 2>&1
    Write-Host "  ✓ EAS CLI installed: $easVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ EAS CLI not found" -ForegroundColor Red
    Write-Host "    Install with: npm install -g eas-cli" -ForegroundColor Yellow
    $allGood = $false
}

# Check Railway login
Write-Host "Checking Railway login..." -ForegroundColor Yellow
if ($railwayInstalled) {
    $railwayWhoami = railway whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Logged in to Railway: $railwayWhoami" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Not logged in to Railway" -ForegroundColor Yellow
        Write-Host "    Run: railway login" -ForegroundColor Yellow
    }
}

# Check Expo login
Write-Host "Checking Expo login..." -ForegroundColor Yellow
if ($easInstalled) {
    $expoWhoami = eas whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Logged in to Expo: $expoWhoami" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Not logged in to Expo" -ForegroundColor Yellow
        Write-Host "    Run: eas login" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "  All prerequisites installed!" -ForegroundColor Green
    Write-Host "  You're ready to deploy!" -ForegroundColor Green
} else {
    Write-Host "  Some prerequisites are missing." -ForegroundColor Red
    Write-Host "  Please install missing tools and run this script again." -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

