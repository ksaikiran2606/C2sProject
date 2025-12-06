# Create placeholder assets for Expo build

Write-Host "Creating placeholder assets..." -ForegroundColor Cyan

$assetsDir = "frontend\assets"

# Create assets directory if it doesn't exist
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
}

# Check if we have logo.jpg to use as base
$logoPath = Join-Path $assetsDir "logo.jpg"
if (Test-Path $logoPath) {
    Write-Host "Using logo.jpg as base for assets..." -ForegroundColor Yellow
    Copy-Item $logoPath (Join-Path $assetsDir "icon.png") -Force
    Copy-Item $logoPath (Join-Path $assetsDir "splash.png") -Force
    Copy-Item $logoPath (Join-Path $assetsDir "adaptive-icon.png") -Force
    Copy-Item $logoPath (Join-Path $assetsDir "favicon.png") -Force
    Write-Host "✅ Created assets from logo.jpg" -ForegroundColor Green
} else {
    Write-Host "⚠️  logo.jpg not found. You'll need to add icon.png and splash.png manually." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Quick fix: Download placeholder images:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://via.placeholder.com/1024" -ForegroundColor White
    Write-Host "  2. Save as: frontend/assets/icon.png" -ForegroundColor White
    Write-Host "  3. Save as: frontend/assets/splash.png" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Checking assets..." -ForegroundColor Cyan
$requiredAssets = @("icon.png", "splash.png", "adaptive-icon.png", "favicon.png")
foreach ($asset in $requiredAssets) {
    $assetPath = Join-Path $assetsDir $asset
    if (Test-Path $assetPath) {
        Write-Host "  ✅ $asset" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $asset (missing)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green

