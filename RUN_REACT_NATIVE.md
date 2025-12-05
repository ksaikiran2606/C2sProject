# 📱 Running React Native App

## ✅ App is Starting!

The Expo development server is starting. You should see:

1. **Metro Bundler** compiling
2. **QR Code** in the terminal
3. **Options** to run on device/simulator

## 🚀 How to Run the App

### Option 1: iOS Simulator (Mac only)
- Press `i` in the terminal
- iOS simulator will open automatically

### Option 2: Android Emulator
- Press `a` in the terminal
- Android emulator will open (if installed)

### Option 3: Physical Device
1. Install **Expo Go** app on your phone:
   - iOS: App Store
   - Android: Google Play Store

2. Make sure phone and computer are on same WiFi

3. Scan the QR code shown in terminal with:
   - iOS: Camera app
   - Android: Expo Go app

## ⚠️ Important: Backend Must Be Running!

Before using the app, make sure the Django backend is running:

```powershell
# Terminal 2 - Start Backend
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

The app needs the backend API at `http://localhost:8000/api`

## 🔧 Troubleshooting

### App won't connect to backend?
- Make sure backend is running on port 8000
- Check `frontend/app.json` has correct API URL
- For physical device, use your computer's IP address

### Metro bundler errors?
```powershell
cd frontend
npm start -- --clear
```

### Can't see QR code?
- Check terminal window is large enough
- Try pressing `r` to reload
- Check Expo Go app is installed

## 📝 Quick Commands

**Start Frontend:**
```powershell
cd frontend
npm start
```

**Start Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

**Clear cache and restart:**
```powershell
cd frontend
npm start -- --clear
```

---

**Check your terminal for the QR code and options!** 🎉


