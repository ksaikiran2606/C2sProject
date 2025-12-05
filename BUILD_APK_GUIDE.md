# 📱 Build APK - Complete Guide

## ✅ Yes! You Can Build an APK Right Now!

You can generate an APK file that you can install directly on your Android phone. Here's how:

---

## 🚀 Quick Steps to Build APK

### Step 1: Login to Expo (First Time Only)

```powershell
cd frontend
eas login
```

You'll need to:
- Create a free Expo account (if you don't have one)
- Or login with existing account

### Step 2: Build the APK

```powershell
cd frontend
eas build --platform android --profile preview
```

This will:
- ✅ Build your app in the cloud (no Android Studio needed!)
- ✅ Generate an APK file
- ✅ Give you a download link

**Build time:** ~10-15 minutes

---

## 📥 After Build Completes

1. **Download the APK:**
   - EAS will give you a download link
   - Or check: https://expo.dev/accounts/[your-username]/builds

2. **Transfer to Phone:**
   - Download APK to your computer
   - Transfer to phone via USB or email
   - Or scan QR code from EAS dashboard

3. **Install on Phone:**
   - Enable "Install from Unknown Sources" in phone settings
   - Open the APK file
   - Tap "Install"

---

## ⚠️ Important: Update API URLs for Phone

**Before building**, you need to update the API URLs so your phone can connect to your backend:

### Option 1: Update app.json (Recommended)

1. **Find your computer's IP address:**
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., `192.168.1.100`)

2. **Update `frontend/app.json`:**
   ```json
   "extra": {
     "apiBaseUrl": "http://192.168.1.100:8000/api",
     "wsBaseUrl": "ws://192.168.1.100:8000"
   }
   ```
   Replace `192.168.1.100` with YOUR computer's IP

3. **Make sure backend is running:**
   ```powershell
   cd backend
   python manage.py runserver 0.0.0.0:8000
   ```
   (The `0.0.0.0` allows connections from other devices)

### Option 2: Use Environment Variables

Create `frontend/.env`:
```
API_BASE_URL=http://192.168.1.100:8000/api
WS_BASE_URL=ws://192.168.1.100:8000
```

---

## 🔧 Alternative: Local Build (Requires Android Studio)

If you have Android Studio installed, you can build locally:

```powershell
cd frontend
npx expo run:android --variant release
```

This will:
- Build APK locally
- Install directly to connected phone
- Faster than cloud build

**APK location:** `frontend/android/app/build/outputs/apk/release/app-release.apk`

---

## 📋 Build Profiles Explained

- **`preview`**: APK for testing (no Google Play requirements)
- **`production`**: AAB for Google Play Store (requires signing)
- **`development`**: Development build with debugging

For now, use **`preview`** to get an APK quickly!

---

## 🎯 Quick Command Reference

```powershell
# Login to Expo
eas login

# Build APK (preview)
eas build --platform android --profile preview

# Build APK (production - requires signing)
eas build --platform android --profile production

# Check build status
eas build:list

# Download build
eas build:download
```

---

## ✅ Checklist Before Building

- [ ] EAS CLI installed (`eas --version`)
- [ ] Logged in to Expo (`eas login`)
- [ ] Updated API URLs in `app.json` (use your computer's IP)
- [ ] Backend server running on `0.0.0.0:8000`
- [ ] Phone and computer on same WiFi network

---

## 🚨 Troubleshooting

### "Build failed" error
- Check `app.json` for syntax errors
- Make sure all dependencies are installed (`npm install`)

### "Cannot connect to backend"
- Make sure backend is running: `python manage.py runserver 0.0.0.0:8000`
- Check firewall allows port 8000
- Verify IP address is correct in `app.json`

### "APK won't install"
- Enable "Install from Unknown Sources" in phone settings
- Settings → Security → Unknown Sources → Enable

---

## 🎉 After Installation

1. **Open the app** on your phone
2. **Make sure backend is running** on your computer
3. **Test the app!**

The app will connect to your backend running on your computer (as long as they're on the same WiFi).

---

**Ready to build? Run: `eas build --platform android --profile preview`** 🚀

