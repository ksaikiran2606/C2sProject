# 📱 Simple Steps - Build APK (Beginner Friendly)

## 🎯 Goal
Create an APK file you can install on your Android phone.

## 📋 What You Need
- ✅ Computer with internet
- ✅ Android phone
- ✅ 15 minutes of time

## 🚀 Step-by-Step Instructions

### STEP 1: Open PowerShell
1. Press **Windows Key** (on keyboard)
2. Type: `PowerShell`
3. Press **Enter**

### STEP 2: Go to Your Project Folder
**Copy and paste this:**
```powershell
cd C:\Users\DELL\OneDrive\Desktop\CoolProject\frontend
```
**Press Enter**

### STEP 3: Install Dependencies
**Copy and paste this:**
```powershell
npm install --legacy-peer-deps
```
**Press Enter**
- Wait 1-2 minutes
- You'll see "up to date" when done

### STEP 4: Build Your APK
**Copy and paste this:**
```powershell
eas build --platform android --profile preview
```
**Press Enter**
- ⏳ Wait 10-15 minutes
- Don't close the window!
- You'll see progress

### STEP 5: Get Download Link
**When build finishes:**
- You'll see a download link in PowerShell
- OR go to: https://expo.dev/accounts/sai2206/projects/clicktosell/builds
- Click latest build → Download button

### STEP 6: Install on Phone
1. **Download APK** to computer
2. **Transfer to phone** (USB, email, or cloud)
3. **Open APK** on phone
4. **Allow installation** (enable "Unknown Sources" if asked)
5. **Install** and open app!

## 🆘 If It Fails

### Check the Error:
1. Go to Expo build page
2. Click "Prepare project" (red X)
3. Read the error
4. Share it with me

### Or Try Again:
Sometimes it's a temporary issue. Just run Step 4 again!

## ✅ Everything is Ready!

I've already fixed:
- ✅ All code errors
- ✅ Missing files
- ✅ Configuration issues

**Just follow the steps above!** 🎉

---

## 📝 Quick Copy-Paste Commands

**Copy all these at once:**
```powershell
cd C:\Users\DELL\OneDrive\Desktop\CoolProject\frontend
npm install --legacy-peer-deps
eas build --platform android --profile preview
```

**Then wait for the build to complete!**

---

**That's it! Simple and easy!** 😊

