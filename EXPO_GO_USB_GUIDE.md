# 📱 Using Expo Go with USB Connection

## ✅ Easy Solution - No Android SDK Needed!

You don't need Android Studio or ADB to use your app on your phone. Expo Go makes it easy!

## 🚀 Quick Steps

### Step 1: Install Expo Go on Your Phone
1. Open **Google Play Store** on your Android phone
2. Search for **"Expo Go"**
3. Install the app (it's free)

### Step 2: Make Sure Your Phone is Connected
- Connect your phone to computer via USB
- Make sure phone and computer are on the **same WiFi network**
- (USB connection helps with stability, but WiFi is needed for Expo Go)

### Step 3: Start Expo and Scan QR Code
1. In your Expo terminal (where you see the Metro bundler), you should see a **QR code**
2. Open **Expo Go** app on your phone
3. Tap **"Scan QR code"** in Expo Go
4. Point your phone camera at the QR code in the terminal
5. The app will load on your phone!

## 🔧 If You Don't See QR Code

In the Expo terminal, you can:
- Press `r` to reload
- Press `?` to see all commands
- The QR code should appear automatically

## 📝 Alternative: Use Tunnel Mode

If WiFi is an issue, you can use Expo's tunnel mode:

```powershell
cd frontend
npx expo start --tunnel
```

This creates a tunnel so your phone can connect even on different networks (slower but works anywhere).

---

**This is the easiest way! Just install Expo Go and scan the QR code!** 🎉

