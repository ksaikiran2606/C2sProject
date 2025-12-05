# 🚀 Deploy Now - Step by Step Guide

Follow these steps to deploy your entire project. **Open PowerShell and run each command.**

---

## 📋 Step 1: Login to Railway

Open PowerShell and run:

```powershell
railway login
```

This will:
- Open your browser
- Ask you to authenticate with Railway
- Complete the login process

**Verify login:**
```powershell
railway whoami
```

---

## 📋 Step 2: Login to Expo

In the same PowerShell window:

```powershell
eas login
```

Enter your Expo email/username and password when prompted.

**Verify login:**
```powershell
eas whoami
```

---

## 📋 Step 3: Deploy Backend to Railway

### 3.1 Navigate to Backend Directory

```powershell
cd backend
```

### 3.2 Initialize Railway Project

```powershell
railway init
```

Choose:
- **"Create new project"** (if first time)
- Or **"Link existing project"** (if you already have one)

### 3.3 Add PostgreSQL Database

```powershell
railway add postgresql
```

Or via Railway dashboard:
1. Go to https://railway.app
2. Open your project
3. Click **"+ New"** → **"Database"** → **"PostgreSQL"**

### 3.4 Add Redis

```powershell
railway add redis
```

Or via Railway dashboard:
1. Click **"+ New"** → **"Database"** → **"Redis"**

### 3.5 Set Environment Variables

Generate a secret key first (run this in PowerShell):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
```

Copy the output, then set variables:

```powershell
# Required variables
railway variables set SECRET_KEY="paste-your-generated-key-here"
railway variables set DEBUG=False
railway variables set USE_POSTGRES=True
railway variables set ALLOWED_HOSTS="*.railway.app"

# Optional: Cloudinary (if you have it)
railway variables set CLOUDINARY_CLOUD_NAME="your-cloud-name"
railway variables set CLOUDINARY_API_KEY="your-api-key"
railway variables set CLOUDINARY_API_SECRET="your-api-secret"
```

**Note:** Database and Redis connection details are automatically set by Railway.

### 3.6 Deploy Backend

```powershell
railway up
```

This will:
- Build your Django app
- Deploy it to Railway
- Take 2-5 minutes

### 3.7 Get Your Backend URL

```powershell
railway domain
```

**SAVE THIS URL!** You'll need it for frontend.

Example output: `https://your-app-production.up.railway.app`

### 3.8 Run Database Migrations

```powershell
railway run python manage.py migrate
```

### 3.9 Create Superuser (Optional)

```powershell
railway run python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### 3.10 Test Backend

Open your browser and visit:
```
https://your-backend-url.railway.app/api/listings/
```

You should see JSON data (or empty array `[]`).

---

## 📋 Step 4: Deploy Frontend

### 4.1 Navigate to Frontend Directory

```powershell
cd ..\frontend
```

### 4.2 Install Dependencies

```powershell
npm install
```

### 4.3 Update app.json with Backend URL

Edit `frontend/app.json` and update these lines:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-backend-url.railway.app/api",
      "wsBaseUrl": "wss://your-backend-url.railway.app",
      "cloudinaryCloudName": "your-cloud-name",
      "cloudinaryUploadPreset": "your-preset"
    }
  }
}
```

**Important:**
- Replace `your-backend-url.railway.app` with your actual Railway URL
- Use `https://` (not `http://`)
- Use `wss://` for WebSocket (not `ws://`)

### 4.4 Build Android APK

```powershell
eas build --platform android --profile production
```

This will:
- Build your app in the cloud
- Take 10-20 minutes
- Upload to Expo servers

**Follow the prompts:**
- Choose build type: **APK** (for direct installation)
- Wait for build to complete

### 4.5 Check Build Status

```powershell
eas build:list
```

### 4.6 Download APK

Once build is complete:

```powershell
eas build:download
```

Or download from Expo dashboard:
- Visit: https://expo.dev
- Go to your project → Builds
- Download the latest Android APK

---

## 📋 Step 5: Test Your Deployed App

1. **Install APK** on your Android device
2. **Open the app**
3. **Test features:**
   - Login/Register
   - View listings
   - Create listing
   - Chat functionality

---

## ✅ Deployment Complete!

Your app is now:
- ✅ **Backend running 24/7** on Railway
- ✅ **Frontend APK ready** for distribution
- ✅ **No local computer needed**
- ✅ **Works from anywhere**

---

## 🆘 Troubleshooting

### Backend Issues

**"Deployment failed"**
```powershell
railway logs
```
Check the logs for errors.

**"Database connection error"**
- Verify PostgreSQL is added: `railway status`
- Check environment variables: `railway variables`

**"CORS errors"**
- Add your frontend URL to CORS_ALLOWED_ORIGINS
- Or set `CORS_ALLOW_ALL_ORIGINS=True` for testing

### Frontend Issues

**"Build failed"**
- Check Expo dashboard for build logs
- Verify `app.json` has correct URLs
- Ensure using `https://` and `wss://`

**"App can't connect"**
- Verify backend URL in `app.json`
- Test backend: Visit `https://your-backend.railway.app/api/listings/`
- Check backend is running: `railway status`

---

## 📚 Quick Commands Reference

### Backend (Railway)
```powershell
railway login              # Login
railway init              # Initialize project
railway add postgresql    # Add database
railway add redis         # Add Redis
railway up                # Deploy
railway logs             # View logs
railway status             # Check status
railway domain           # Get URL
railway variables        # View variables
```

### Frontend (EAS)
```powershell
eas login                 # Login
eas build --platform android --profile production  # Build APK
eas build:list           # List builds
eas build:download       # Download latest build
```

---

**Ready? Start with Step 1: `railway login`** 🚀

