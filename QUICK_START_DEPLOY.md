# ⚡ Quick Start - Deploy in 5 Steps

## Step 1: Login to Railway
```powershell
railway login
```
→ Browser opens → Complete authentication → Done!

## Step 2: Login to Expo
```powershell
eas login
```
→ Enter email → Enter password → Done!

## Step 3: Deploy Backend

**Option A: Railway Dashboard (Easiest)**
1. Go to: https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select: `ksaikiran2606/C2sProject`
4. Set Root Directory: `/backend`
5. Add PostgreSQL: "+ New" → "Database" → "PostgreSQL"
6. Add Redis: "+ New" → "Database" → "Redis"
7. Set Variables (in service → Variables):
   - `SECRET_KEY` = (generate random string)
   - `DEBUG` = `False`
   - `USE_POSTGRES` = `True`
   - `ALLOWED_HOSTS` = `*.railway.app`
8. Generate Domain: Settings → Generate Domain
9. Copy the URL!

**Option B: CLI**
```powershell
cd backend
railway init
railway add postgresql
railway add redis
railway variables set SECRET_KEY="random-key"
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"
railway up
railway domain
railway run python manage.py migrate
cd ..
```

## Step 4: Update Frontend

Edit `frontend/app.json`:
```json
"extra": {
  "apiBaseUrl": "https://YOUR-BACKEND-URL.railway.app/api",
  "wsBaseUrl": "wss://YOUR-BACKEND-URL.railway.app"
}
```

Then:
```powershell
git add frontend/app.json
git commit -m "Update production URLs"
git push origin main
```

## Step 5: Build Frontend
```powershell
cd frontend
npm install
eas build --platform android --profile production
eas build:download
```

**Done! Install APK on your phone!** 🎉

---

**For detailed instructions, see: STEP_BY_STEP_DEPLOYMENT.md**

