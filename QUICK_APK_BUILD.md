# 🚀 Build APK - Quick Steps (Copy & Paste)

## ✅ Everything is Ready!

Your configuration is already set up:
- ✅ EAS CLI installed
- ✅ `eas.json` configured
- ✅ API URL set to your IP: `192.168.1.8:8000`
- ✅ Build profile ready

## 📋 Just Run These 3 Commands:

### Step 1: Navigate to Frontend
```powershell
cd C:\Users\DELL\OneDrive\Desktop\CoolProject\frontend
```

### Step 2: Login to Expo (First Time Only)
```powershell
eas login
```
- If you don't have an account, it will help you create one (free)
- Enter your email/username and password when prompted

### Step 3: Build the APK
```powershell
eas build --platform android --profile preview
```

**That's it!** The build will:
- ✅ Happen in the cloud (no Android Studio needed)
- ✅ Take 10-15 minutes
- ✅ Give you a download link for the APK

---

## 📥 After Build Completes:

1. **You'll see a download link** in the terminal
2. **Or check:** https://expo.dev (login and go to Builds)
3. **Download the APK** to your computer
4. **Transfer to phone** (USB, email, or cloud storage)
5. **Install on phone:**
   - Enable "Install from Unknown Sources" in Settings → Security
   - Open the APK file
   - Tap "Install"

---

## ⚠️ Before Using the APK:

Make sure your **backend is running** so the app can connect:

```powershell
cd C:\Users\DELL\OneDrive\Desktop\CoolProject\backend
python manage.py runserver 0.0.0.0:8000
```

The `0.0.0.0` allows your phone to connect from the same WiFi network.

---

## 🎯 Quick Copy-Paste (All at Once):

```powershell
# Step 1: Go to frontend
cd C:\Users\DELL\OneDrive\Desktop\CoolProject\frontend

# Step 2: Login (first time only)
eas login

# Step 3: Build APK
eas build --platform android --profile preview
```

---

## ✅ Status Check:

- [x] EAS CLI installed
- [x] Configuration ready
- [x] API URL configured (192.168.1.8:8000)
- [ ] Login to Expo (you need to do this)
- [ ] Build APK (run after login)

**You're 90% done! Just login and build!** 🎉

