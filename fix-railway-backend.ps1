# Fix Railway Backend Visibility Issue
# This script ensures backend folder is properly committed and pushed to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Railway Backend Visibility" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check current directory
$projectRoot = "C:\Users\DELL\OneDrive\Desktop\CoolProject"
Set-Location $projectRoot

Write-Host "Step 1: Checking project structure..." -ForegroundColor Yellow
Write-Host "  Project Root: $projectRoot" -ForegroundColor White
Write-Host "  Git repo exists: $(Test-Path .git)" -ForegroundColor White
Write-Host "  Backend exists: $(Test-Path backend)" -ForegroundColor White
Write-Host "  Frontend exists: $(Test-Path frontend)" -ForegroundColor White
Write-Host ""

# Step 2: Check backend files in git
Write-Host "Step 2: Checking backend files in git..." -ForegroundColor Yellow
$backendFiles = git ls-files backend/ | Measure-Object
Write-Host "  Backend files tracked: $($backendFiles.Count)" -ForegroundColor White
Write-Host ""

# Step 3: Check git status
Write-Host "Step 3: Checking git status..." -ForegroundColor Yellow
git status --short | Select-Object -First 10
Write-Host ""

# Step 4: Add all files
Write-Host "Step 4: Adding all files to git..." -ForegroundColor Yellow
git add .
Write-Host "  ✓ Files added" -ForegroundColor Green
Write-Host ""

# Step 5: Commit
Write-Host "Step 5: Committing changes..." -ForegroundColor Yellow
$commitMessage = "Fix: Ensure backend folder is properly committed for Railway deployment"
git commit -m $commitMessage
Write-Host "  ✓ Changes committed" -ForegroundColor Green
Write-Host ""

# Step 6: Check remote
Write-Host "Step 6: Checking remote repository..." -ForegroundColor Yellow
$remote = git remote get-url origin
Write-Host "  Remote: $remote" -ForegroundColor White
Write-Host ""

# Step 7: Push to GitHub
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "  This will push all changes including backend folder..." -ForegroundColor White
Write-Host ""
$push = Read-Host "  Push to GitHub now? (Y/N)"
if ($push -eq "Y" -or $push -eq "y") {
    git push origin main
    Write-Host ""
    Write-Host "  ✓ Pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Skipped push. Run manually: git push origin main" -ForegroundColor Yellow
}
Write-Host ""

# Step 8: Verify backend on GitHub
Write-Host "Step 8: Verification steps..." -ForegroundColor Yellow
Write-Host ""
Write-Host "  IMPORTANT: Do these steps in Railway:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Go to Railway Dashboard" -ForegroundColor White
Write-Host "  2. Select your service (C2sProject)" -ForegroundColor White
Write-Host "  3. Click 'Settings' tab" -ForegroundColor White
Write-Host "  4. Find 'Root Directory' setting" -ForegroundColor White
Write-Host "  5. Set it to: backend" -ForegroundColor Green
Write-Host "  6. Save and redeploy" -ForegroundColor White
Write-Host ""
Write-Host "  Verify on GitHub:" -ForegroundColor Cyan
Write-Host "  - Go to: https://github.com/ksaikiran2606/C2sProject" -ForegroundColor White
Write-Host "  - Check that 'backend/' folder is visible" -ForegroundColor White
Write-Host "  - Click into it to verify files are there" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Fix Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

