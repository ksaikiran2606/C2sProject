# 🚀 Deploy from GitHub - Quick Guide

Your repository: https://github.com/ksaikiran2606/C2sProject.git

## Option 1: Railway Dashboard (Easiest - Recommended)

### Backend Deployment:

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app
   - Login/Sign up

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access GitHub
   - Select repository: `ksaikiran2606/C2sProject`
   - Click "Deploy Now"

3. **Configure Service:**
   - Railway will detect Django automatically
   - **Set Root Directory:** `/backend`
   - Railway will auto-detect and deploy

4. **Add PostgreSQL:**
   - In your project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway auto-configures connection

5. **Add Redis:**
   - Click "+ New" again
   - Select "Database" → "Redis"

6. **Set Environment Variables:**
   - Go to your service → "Variables" tab
   - Add these variables:
     ```
     SECRET_KEY=your-random-secret-key-here
     DEBUG=False
     USE_POSTGRES=True
     ALLOWED_HOSTS=*.railway.app
     ```
   - Database and Redis URLs are auto-set by Railway

7. **Get Your Backend URL:**
   - Go to service → "Settings" → "Generate Domain"
   - Copy the URL (e.g., `https://your-app.railway.app`)

8. **Run Migrations:**
   - In Railway dashboard, go to service → "Deployments"
   - Click on latest deployment → "View Logs"
   - Or use CLI: `railway run python manage.py migrate`

---

## Option 2: Railway CLI (Command Line)

Run this script:
```powershell
.\deploy-from-github.ps1
```

Or manually:

```powershell
# 1. Login to Railway
railway login

# 2. Navigate to backend
cd backend

# 3. Initialize project
railway init

# 4. Link to GitHub (when prompted, select your repo)
# Or create new project from GitHub:
railway project create
# Then link: railway link

# 5. Add databases
railway add postgresql
railway add redis

# 6. Set environment variables
railway variables set SECRET_KEY="generate-random-key"
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

# 7. Deploy
railway up

# 8. Get URL
railway domain

# 9. Run migrations
railway run python manage.py migrate
```

---

## Frontend Deployment

After backend is deployed:

1. **Update frontend/app.json** with your backend URL:
   ```json
   {
     "expo": {
       "extra": {
         "apiBaseUrl": "https://your-backend.railway.app/api",
         "wsBaseUrl": "wss://your-backend.railway.app"
       }
     }
   }
   ```

2. **Commit and push to GitHub:**
   ```powershell
   git add frontend/app.json
   git commit -m "Update production URLs"
   git push origin main
   ```

3. **Build with EAS:**
   ```powershell
   cd frontend
   eas login
   eas build --platform android --profile production
   ```

4. **Download APK:**
   ```powershell
   eas build:download
   ```

---

## Quick Commands

### Generate Secret Key (PowerShell):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
```

### Check Deployment Status:
```powershell
railway status
railway logs
```

### View Builds:
```powershell
eas build:list
```

---

**Start with Railway Dashboard (Option 1) - it's the easiest!** 🚀

