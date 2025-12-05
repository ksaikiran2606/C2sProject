# 📱 Connect Your Phone via USB - Quick Steps

## ✅ Expo is Running!

Your Expo server is already running on port 8081. Now let's connect your phone.

## 🚀 Step-by-Step Instructions

### Step 1: Find the Expo Terminal
- Look for a terminal/PowerShell window that shows Metro bundler output
- If you can't find it, you may need to start a new one (see below)

### Step 2: Make Sure Your Phone is Ready
- ✅ USB debugging enabled (Settings → Developer Options → USB Debugging)
- ✅ Phone connected via USB cable
- ✅ **Expo Go app installed** on your phone (from Google Play Store)

### Step 3: Connect via Expo

**Option A: If you can see the Expo terminal:**
1. In the Expo terminal, press **`a`** (for Android)
2. Expo will detect your USB-connected device
3. The app will install and launch on your phone

**Option B: If you can't see the terminal, start a new one:**

Open a NEW PowerShell terminal and run:
```powershell
cd C:\Users\DELL\OneDrive\Desktop\CoolProject\frontend
npm start
```

Wait for:
- Metro bundler to compile
- QR code to appear
- Then press **`a`** for Android

### Step 4: If Expo Doesn't Detect Your Device

**For USB debugging, you have two options:**

**Method 1: Use Expo Go (Easier - No ADB needed)**
- Make sure phone and computer are on the same WiFi
- In Expo terminal, you'll see a QR code
- Open **Expo Go** app on your phone
- Scan the QR code
- The app will load

**Method 2: Direct USB Install (Requires ADB)**
- Install Android Studio (includes ADB)
- Or install standalone Platform Tools
- Then run: `npx expo run:android`

## 🔧 Troubleshooting

### Can't See Metro Bundler Output?
1. Open a new PowerShell terminal
2. Navigate to frontend folder:
   ```powershell
   cd C:\Users\DELL\OneDrive\Desktop\CoolProject\frontend
   ```
3. Run:
   ```powershell
   npm start
   ```
4. You should now see the Metro bundler output

### Phone Not Detected?
- Try a different USB cable (use a data cable, not just charging)
- Try a different USB port
- Make sure USB debugging is enabled
- Check your phone for "Allow USB debugging?" prompt

### Expo Go Not Working?
- Make sure Expo Go is installed from Google Play Store
- Make sure phone and computer are on same WiFi network
- Try scanning the QR code again

## 📝 Quick Commands

**Start Expo (if not running):**
```powershell
cd frontend
npm start
```

**Start with Android directly:**
```powershell
cd frontend
npm run android
```

**Check if Expo is running:**
```powershell
netstat -ano | findstr :8081
```

---

**Your Expo server is running! Open the terminal where it's running and press 'a' for Android!** 🎉

