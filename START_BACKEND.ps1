# Start Backend Server for Phone Connection
# This script starts the backend so your phone can connect to it

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Navigate to backend directory
$backendPath = "C:\Users\DELL\OneDrive\Desktop\CoolProject\backend"
Set-Location $backendPath

Write-Host "📁 Backend directory: $backendPath" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "✅ Activating virtual environment..." -ForegroundColor Yellow
    & .\venv\Scripts\Activate.ps1
} else {
    Write-Host "⚠️  Virtual environment not found. Using system Python..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔌 Starting Django server on 0.0.0.0:8000..." -ForegroundColor Cyan
Write-Host "   (This allows your phone to connect from the same WiFi)" -ForegroundColor Gray
Write-Host ""
Write-Host "📱 Your phone should connect to: http://192.168.1.8:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "─────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Start the server
python manage.py runserver 0.0.0.0:8000

