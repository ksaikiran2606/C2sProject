# 📱 Build APK with Railway Backend - Complete Guide

## ✅ Your Backend is Deployed on Railway!

Since your backend is on Railway, the APK will work from anywhere (not just your local network).

## 🎯 Step-by-Step Process

### Step 1: Get Your Railway Backend URL

1. **Go to Railway Dashboard:** https://railway.app
2. **Click your service:** "C2sProject"
3. **Click "Settings" tab**
4. **Find "Domains" section**
5. **Copy your Railway URL** (e.g., `https://c2sproject-production-xxxx.up.railway.app`)

**OR** if you already have it, share it with me and I'll update the config!

### Step 2: Update Frontend Configuration

I'll update `frontend/app.json` with your Railway URL so the APK connects to your deployed backend.

**Current config (local):**
```json
"apiBaseUrl": "http://192.168.1.8:8000/api"
```

**Will be updated to (Railway):**
```json
"apiBaseUrl": "https://your-railway-url.railway.app/api"
```

### Step 3: Build the APK

Once the config is updated, build the APK:

```powershell
cd frontend
eas login          # First time only - creates free Expo account
eas build --platform android --profile preview
```

**Build time:** ~10-15 minutes (happens in the cloud)

### Step 4: Download and Install APK

1. **Get download link** from EAS (shown in terminal or Expo dashboard)
2. **Download APK** to your computer
3. **Transfer to phone** (USB, email, or cloud storage)
4. **Install:**
   - Enable "Install from Unknown Sources" in phone Settings → Security
   - Open APK file
   - Tap "Install"

## 🚀 Quick Commands

```powershell
# 1. Update frontend config (I'll do this once you share Railway URL)
# 2. Navigate to frontend
cd frontend

# 3. Login to Expo (first time only)
eas login

# 4. Build APK
eas build --platform android --profile preview
```

## ✅ Benefits of Using Railway Backend

- ✅ **Works from anywhere** - No need to be on same WiFi
- ✅ **Always online** - Backend runs 24/7
- ✅ **HTTPS secure** - Encrypted connections
- ✅ **No local server needed** - Backend is in the cloud

## 📋 Checklist

- [ ] Get Railway backend URL
- [ ] Update `frontend/app.json` with Railway URL
- [ ] Login to Expo (`eas login`)
- [ ] Build APK (`eas build --platform android --profile preview`)
- [ ] Download APK
- [ ] Install on phone

---

**Share your Railway backend URL and I'll update the config, then you can build the APK!**

