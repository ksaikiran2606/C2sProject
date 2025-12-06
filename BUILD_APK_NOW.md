# 📱 Build APK Now - Quick Guide

## ✅ Your Backend is on Railway!

Since your backend is deployed on Railway, your APK will work from anywhere!

## 🚀 Quick Steps

### Option 1: Use the Script (Easiest)

I've created a script that does everything:

```powershell
.\build-apk-with-railway.ps1
```

This script will:
1. ✅ Ask for your Railway backend URL
2. ✅ Update `frontend/app.json` automatically
3. ✅ Test the backend connection
4. ✅ Check Expo login
5. ✅ Build the APK

### Option 2: Manual Steps

#### Step 1: Get Railway Backend URL

1. Go to **Railway Dashboard:** https://railway.app
2. Click **"C2sProject"** service
3. Click **"Settings"** tab
4. Find **"Domains"** section
5. **Copy your URL** (e.g., `https://c2sproject-production-xxxx.up.railway.app`)

#### Step 2: Update Frontend Config

Share your Railway URL with me, and I'll update `frontend/app.json` for you!

Or manually edit `frontend/app.json`:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-railway-url.railway.app/api",
      "wsBaseUrl": "wss://your-railway-url.railway.app"
    }
  }
}
```

#### Step 3: Login to Expo (First Time Only)

```powershell
cd frontend
eas login
```

- Create free Expo account if needed
- Enter email/username and password

#### Step 4: Build APK

```powershell
cd frontend
eas build --platform android --profile preview
```

**Build time:** ~10-15 minutes

#### Step 5: Download APK

1. **Get download link** from terminal or Expo dashboard
2. **Download APK** to your computer
3. **Transfer to phone** (USB, email, cloud storage)
4. **Install:**
   - Enable "Install from Unknown Sources" in Settings → Security
   - Open APK file
   - Tap "Install"

## 📋 What You Need

- [ ] Railway backend URL (get from Railway Dashboard)
- [ ] Expo account (free - created during `eas login`)
- [ ] Internet connection (build happens in cloud)

## ✅ After APK is Built

Your APK will:
- ✅ Connect to Railway backend automatically
- ✅ Work from anywhere (no local server needed)
- ✅ Use HTTPS (secure connection)
- ✅ Work 24/7 (backend is always online)

## 🎯 Quick Command

**Just run this:**
```powershell
.\build-apk-with-railway.ps1
```

**Then follow the prompts!**

---

**Ready to build? Run the script or share your Railway URL and I'll update the config!**

