# ============================================
# Backend Deployment Script - Railway CLI
# ============================================
# This script deploys the Django backend to Railway

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Deployment - Railway CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
Write-Host "Checking Railway CLI installation..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "Railway CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host "Please install Railway CLI from: https://docs.railway.app/develop/cli" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For Windows, run:" -ForegroundColor Yellow
    Write-Host "  winget install --id Railway.Railway" -ForegroundColor Green
    Write-Host ""
    Write-Host "Or download from: https://github.com/railwayapp/cli/releases" -ForegroundColor Yellow
    Write-Host ""
    $install = Read-Host "Press Enter after installing Railway CLI, or type 'skip' to continue"
    if ($install -eq 'skip') {
        Write-Host "Skipping Railway CLI check. Please install manually." -ForegroundColor Red
        exit 1
    }
}

# Navigate to backend directory
Write-Host "Navigating to backend directory..." -ForegroundColor Yellow
Set-Location backend

# Check if logged in to Railway
Write-Host "Checking Railway login status..." -ForegroundColor Yellow
$loginStatus = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Railway. Please login..." -ForegroundColor Yellow
    railway login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to login to Railway. Exiting." -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

# Initialize Railway project (if not already initialized)
if (-not (Test-Path ".railway")) {
    Write-Host "Initializing Railway project..." -ForegroundColor Yellow
    railway init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize Railway project. Exiting." -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

# Link to existing project or create new
Write-Host ""
Write-Host "Do you want to:" -ForegroundColor Yellow
Write-Host "1. Link to existing Railway project" -ForegroundColor Cyan
Write-Host "2. Create a new Railway project" -ForegroundColor Cyan
$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    railway link
} else {
    Write-Host "Creating new Railway project..." -ForegroundColor Yellow
    railway project create
}

# Add PostgreSQL database
Write-Host ""
Write-Host "Adding PostgreSQL database..." -ForegroundColor Yellow
Write-Host "In Railway dashboard, click '+ New' -> 'Database' -> 'PostgreSQL'" -ForegroundColor Yellow
Write-Host "Or run: railway add postgresql" -ForegroundColor Yellow
$addDb = Read-Host "Press Enter after adding PostgreSQL database, or type 'skip' to continue"
if ($addDb -ne 'skip') {
    railway add postgresql
}

# Add Redis
Write-Host ""
Write-Host "Adding Redis..." -ForegroundColor Yellow
Write-Host "In Railway dashboard, click '+ New' -> 'Database' -> 'Redis'" -ForegroundColor Yellow
Write-Host "Or run: railway add redis" -ForegroundColor Yellow
$addRedis = Read-Host "Press Enter after adding Redis, or type 'skip' to continue"
if ($addRedis -ne 'skip') {
    railway add redis
}

# Set environment variables
Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow
Write-Host "You need to set these variables in Railway dashboard or via CLI:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Required variables:" -ForegroundColor Cyan
Write-Host "  - SECRET_KEY (generate a random string)" -ForegroundColor White
Write-Host "  - DEBUG=False" -ForegroundColor White
Write-Host "  - USE_POSTGRES=True" -ForegroundColor White
Write-Host "  - ALLOWED_HOSTS=*.railway.app" -ForegroundColor White
Write-Host "  - CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com" -ForegroundColor White
Write-Host ""
Write-Host "Optional variables:" -ForegroundColor Cyan
Write-Host "  - CLOUDINARY_CLOUD_NAME" -ForegroundColor White
Write-Host "  - CLOUDINARY_API_KEY" -ForegroundColor White
Write-Host "  - CLOUDINARY_API_SECRET" -ForegroundColor White
Write-Host "  - FIREBASE_CREDENTIALS_PATH" -ForegroundColor White
Write-Host ""

# Generate SECRET_KEY
$secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
Write-Host "Generated SECRET_KEY: $secretKey" -ForegroundColor Green
Write-Host ""

# Set variables via CLI
Write-Host "Setting environment variables via CLI..." -ForegroundColor Yellow
railway variables set SECRET_KEY=$secretKey
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

Write-Host ""
Write-Host "Database and Redis connection details are automatically set by Railway." -ForegroundColor Green
Write-Host "You can view them in Railway dashboard -> Variables tab." -ForegroundColor Green
Write-Host ""

# Create railway.json for build configuration
Write-Host "Creating Railway configuration..." -ForegroundColor Yellow
$railwayConfig = @{
    build = @{
        builder = "NIXPACKS"
    }
    deploy = @{
        startCommand = "gunicorn --bind 0.0.0.0:$PORT marketplace.wsgi:application"
        healthcheckPath = "/api/listings/"
        healthcheckTimeout = 100
        restartPolicyType = "ON_FAILURE"
        restartPolicyMaxRetries = 10
    }
} | ConvertTo-Json -Depth 10

$railwayConfig | Out-File -FilePath "railway.json" -Encoding UTF8
Write-Host "Created railway.json configuration file." -ForegroundColor Green

# Create Procfile for Railway
Write-Host "Creating Procfile..." -ForegroundColor Yellow
"web: gunicorn --bind 0.0.0.0:`$PORT marketplace.wsgi:application" | Out-File -FilePath "Procfile" -Encoding UTF8
Write-Host "Created Procfile." -ForegroundColor Green

# Deploy to Railway
Write-Host ""
Write-Host "Deploying to Railway..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Deployment Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Get deployment URL
    $deploymentUrl = railway domain
    Write-Host "Your backend is deployed at:" -ForegroundColor Cyan
    Write-Host "  $deploymentUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "API Base URL:" -ForegroundColor Cyan
    Write-Host "  $deploymentUrl/api" -ForegroundColor Green
    Write-Host ""
    Write-Host "WebSocket URL:" -ForegroundColor Cyan
    Write-Host "  wss://$deploymentUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Update frontend/app.json with these URLs!" -ForegroundColor Yellow
    Write-Host ""
    
    # Run migrations
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    railway run python manage.py migrate
    
    Write-Host ""
    Write-Host "Creating superuser (optional)..." -ForegroundColor Yellow
    $createSuperuser = Read-Host "Do you want to create a superuser? (y/n)"
    if ($createSuperuser -eq 'y') {
        railway run python manage.py createsuperuser
    }
    
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Deployment Failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Check Railway dashboard for logs." -ForegroundColor Yellow
}

Set-Location ..
Write-Host ""
Write-Host "Backend deployment process completed!" -ForegroundColor Cyan

