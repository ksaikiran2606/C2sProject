# 📱 USB Debugging Guide for Mobile Development

## ✅ Yes, USB Debugging is Possible!

You can run your Expo React Native app on a physical Android device via USB debugging. This is often more reliable than WiFi and doesn't require both devices to be on the same network.

## 🚀 Setup Steps for Android USB Debugging

### Step 1: Enable USB Debugging on Your Android Device

1. **Enable Developer Options:**
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to **Settings** → **Developer Options**
   - Toggle **USB Debugging** ON
   - (Optional) Enable **Stay Awake** (keeps screen on while charging)

3. **Authorize Your Computer:**
   - Connect your phone to your computer via USB
   - On your phone, you'll see a prompt: "Allow USB debugging?"
   - Check **"Always allow from this computer"** and tap **OK**

### Step 2: Install Android Debug Bridge (ADB)

ADB is included with Android Studio, but you can also install it standalone:

**Option A: Install Android Studio (Recommended)**
1. Download from: https://developer.android.com/studio
2. Install Android Studio
3. ADB will be in: `C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools`

**Option B: Install Standalone Platform Tools**
1. Download from: https://developer.android.com/tools/releases/platform-tools
2. Extract to a folder (e.g., `C:\platform-tools`)
3. Add to PATH environment variable

### Step 3: Verify USB Connection

Open PowerShell and check if your device is detected:

```powershell
# Navigate to platform-tools (adjust path if needed)
cd C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools

# Check connected devices
.\adb devices
```

You should see your device listed:
```
List of devices attached
ABC123XYZ    device
```

If you see "unauthorized", check your phone for the USB debugging authorization prompt.

### Step 4: Run Expo with USB Connection

**Method 1: Automatic Detection (Easiest)**
```powershell
cd frontend
npm start
```

When Expo starts:
- Press `a` for Android
- Expo will automatically detect your USB-connected device
- The app will install and launch on your phone

**Method 2: Explicit Android Mode**
```powershell
cd frontend
npm run android
```

This directly targets Android and will use your USB-connected device.

**Method 3: Using ADB Forwarding (For Development Server)**
If you want to use `localhost` on your device (instead of your computer's IP):

```powershell
# Forward port 8081 (Metro bundler) to device
.\adb reverse tcp:8081 tcp:8081

# Forward port 8000 (Django backend) to device
.\adb reverse tcp:8000 tcp:8000
```

Then update `frontend/app.json`:
```json
"extra": {
  "apiBaseUrl": "http://localhost:8000/api",
  "wsBaseUrl": "ws://localhost:8000"
}
```

### Step 5: Start Backend Server

Make sure your Django backend is running:

```powershell
# Terminal 2
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

## 🔧 Troubleshooting

### Device Not Detected
- **Check USB cable:** Use a data cable, not just a charging cable
- **Try different USB port:** Some ports work better than others
- **Reinstall drivers:** Windows may need to install device drivers
- **Check USB mode:** On your phone, when connected, change USB mode to "File Transfer" or "PTP"

### "adb: command not found"
- Add ADB to your PATH:
  ```powershell
  # Add to PATH permanently
  [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools", "User")
  ```
- Or use full path: `C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools\adb.exe`

### App Won't Connect to Backend
- If using USB, you need to use your computer's IP address (not localhost)
- Find your IP: `ipconfig` (look for IPv4 Address)
- Update `frontend/app.json`:
  ```json
  "extra": {
    "apiBaseUrl": "http://192.168.1.100:8000/api",  // Your computer's IP
    "wsBaseUrl": "ws://192.168.1.100:8000"
  }
  ```
- Or use ADB port forwarding (see Method 3 above)

### "Expo Go" Not Installing
- Make sure you have **Expo Go** app installed from Google Play Store
- Or build a development build: `npx expo run:android` (requires Android Studio)

### Metro Bundler Connection Issues
```powershell
# Reset Metro bundler
cd frontend
npm start -- --clear

# Or kill and restart
# Press Ctrl+C, then:
npm start
```

## 📱 Alternative: Development Build (More Control)

If you want more control and don't want to use Expo Go:

```powershell
cd frontend

# Build and install directly to device
npx expo run:android
```

This will:
- Build a native Android app
- Install it directly to your USB-connected device
- Give you full debugging capabilities

**Requirements:**
- Android Studio installed
- Android SDK configured
- USB debugging enabled

## 🎯 Quick Reference Commands

```powershell
# Check connected devices
adb devices

# Forward Metro bundler port
adb reverse tcp:8081 tcp:8081

# Forward Django backend port
adb reverse tcp:8000 tcp:8000

# Start Expo
cd frontend
npm start
# Then press 'a' for Android

# Or directly
npm run android

# View device logs
adb logcat
```

## ✅ Verification Checklist

- [ ] USB debugging enabled on phone
- [ ] Phone connected via USB
- [ ] `adb devices` shows your device
- [ ] Backend server running on port 8000
- [ ] Expo development server started
- [ ] App installed and running on device

---

**You're all set! Connect your phone via USB and run `npm run android` in the frontend directory!** 🎉

