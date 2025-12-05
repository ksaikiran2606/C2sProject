# 🚀 Quick Deployment Guide

Deploy your entire project (backend + frontend) in minutes!

## ⚡ Quick Start

### Step 1: Check Prerequisites
```powershell
.\check-prerequisites.ps1
```

This will verify:
- ✅ Node.js
- ✅ Python
- ✅ Git
- ✅ Railway CLI
- ✅ EAS CLI

### Step 2: Deploy Everything
```powershell
.\deploy-all.ps1
```

This single command will:
1. Deploy backend to Railway
2. Deploy frontend using EAS Build
3. Update configurations automatically

---

## 📋 Manual Deployment

### Backend Deployment

1. **Login to Railway:**
   ```powershell
   railway login
   ```

2. **Deploy backend:**
   ```powershell
   .\deploy-backend.ps1
   ```

3. **Follow the prompts:**
   - Create/link Railway project
   - Add PostgreSQL database
   - Add Redis
   - Set environment variables
   - Deploy!

4. **Save your backend URL** (you'll need it for frontend)

### Frontend Deployment

1. **Login to Expo:**
   ```powershell
   eas login
   ```

2. **Update app.json** with your backend URL:
   ```json
   {
     "expo": {
       "extra": {
         "apiBaseUrl": "https://your-backend.railway.app/api",
         "wsBaseUrl": "wss://your-backend.railway.app"
       }
     }
   }
   ```

3. **Deploy frontend:**
   ```powershell
   .\deploy-frontend.ps1
   ```

4. **Choose build type:**
   - Android APK (for direct installation)
   - Android AAB (for Play Store)
   - iOS (requires Apple Developer account)
   - Web (for web deployment)

---

## 🔧 Installation (If Needed)

### Install Railway CLI
```powershell
winget install --id Railway.Railway
```

### Install EAS CLI
```powershell
npm install -g eas-cli
```

---

## 📝 What Gets Deployed

### Backend (Railway)
- ✅ Django REST API
- ✅ PostgreSQL Database
- ✅ Redis (for WebSockets)
- ✅ Automatic SSL/HTTPS
- ✅ 24/7 uptime

### Frontend (EAS Build)
- ✅ React Native app
- ✅ Production APK/AAB
- ✅ Optimized build
- ✅ Ready for distribution

---

## 🎯 After Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.railway.app/api/listings/`
   - Should return JSON data

2. **Download Frontend:**
   - Check Expo dashboard: https://expo.dev
   - Download APK
   - Install on device

3. **Test App:**
   - Open app
   - Login/Register
   - Create listing
   - Test chat

---

## 📚 Full Documentation

See `DEPLOY_CLI_GUIDE.md` for detailed instructions.

---

## 🆘 Need Help?

- **Backend Issues:** Check Railway logs: `railway logs`
- **Frontend Issues:** Check Expo dashboard build logs
- **Connection Issues:** Verify URLs in `app.json` use `https://` and `wss://`

---

**Ready to deploy? Run `.\deploy-all.ps1` now!** 🚀

