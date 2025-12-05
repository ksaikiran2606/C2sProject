# 🚀 START DEPLOYMENT NOW

Follow these exact steps to deploy your project from GitHub.

## ⚡ Quick Start (5 minutes)

### Step 1: Login to Railway

Open PowerShell and run:
```powershell
railway login
```
- Browser will open
- Complete authentication
- Return to terminal

### Step 2: Login to Expo

```powershell
eas login
```
- Enter your Expo email/username
- Enter password

### Step 3: Deploy Backend

**Option A: Using Railway Dashboard (EASIEST)**

1. Go to: https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway → Select **`ksaikiran2606/C2sProject`**
5. After deployment starts:
   - Click on the service
   - Go to **"Settings"** → **"Root Directory"**
   - Set to: **`/backend`**
   - Save
6. Add PostgreSQL:
   - Click **"+ New"** → **"Database"** → **"PostgreSQL"**
7. Add Redis:
   - Click **"+ New"** → **"Database"** → **"Redis"**
8. Set Environment Variables:
   - Go to service → **"Variables"** tab
   - Add:
     ```
     SECRET_KEY=generate-random-key-here
     DEBUG=False
     USE_POSTGRES=True
     ALLOWED_HOSTS=*.railway.app
     ```
   - Generate secret key: Run in PowerShell:
     ```powershell
     -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
     ```
9. Get Backend URL:
   - Service → **"Settings"** → **"Generate Domain"**
   - Copy URL (e.g., `https://c2sproject-production.up.railway.app`)

**Option B: Using Railway CLI**

```powershell
cd backend
railway init
railway add postgresql
railway add redis

# Generate secret key
$secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})

# Set variables
railway variables set SECRET_KEY=$secretKey
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

# Deploy
railway up

# Get URL
railway domain

# Run migrations
railway run python manage.py migrate
```

### Step 4: Update Frontend Configuration

Edit `frontend/app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://YOUR-BACKEND-URL.railway.app/api",
      "wsBaseUrl": "wss://YOUR-BACKEND-URL.railway.app"
    }
  }
}
```

Replace `YOUR-BACKEND-URL` with your actual Railway URL.

### Step 5: Commit and Push Changes

```powershell
git add frontend/app.json
git commit -m "Update production URLs"
git push origin main
```

### Step 6: Build Frontend

```powershell
cd frontend
npm install
eas build --platform android --profile production
```

Wait 10-20 minutes for build to complete.

### Step 7: Download APK

```powershell
eas build:download
```

Or visit: https://expo.dev → Your project → Builds → Download

---

## ✅ Verification

1. **Test Backend:**
   - Visit: `https://your-backend.railway.app/api/listings/`
   - Should return JSON (or empty array `[]`)

2. **Test Admin:**
   - Visit: `https://your-backend.railway.app/admin/`
   - Login with superuser credentials

3. **Test Frontend:**
   - Install APK on device
   - Open app
   - Test login, create listing, chat

---

## 🆘 Troubleshooting

**Backend not deploying?**
- Check Railway logs: `railway logs`
- Verify root directory is `/backend`
- Check environment variables are set

**Database connection error?**
- Verify PostgreSQL is added
- Check `USE_POSTGRES=True` is set
- Railway auto-sets `DATABASE_URL`

**Frontend can't connect?**
- Verify backend URL in `app.json`
- Use `https://` not `http://`
- Use `wss://` not `ws://`
- Test backend URL in browser first

---

**Ready? Start with Step 1: `railway login`** 🚀

