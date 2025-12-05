# Start Backend Server for Phone Connection
# This script starts the Django backend server so your phone can connect to it

Write-Host "`n🚀 Starting Backend Server for Phone Connection...`n" -ForegroundColor Green

# Navigate to backend directory
Set-Location ..\backend

# Activate virtual environment if it exists
if (Test-Path "venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & .\venv\Scripts\Activate.ps1
}

# Start server on 0.0.0.0 to allow connections from phone
Write-Host "Starting Django server on 0.0.0.0:8000..." -ForegroundColor Yellow
Write-Host "Your phone can now connect to: http://192.168.1.8:8000`n" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

python manage.py runserver 0.0.0.0:8000

