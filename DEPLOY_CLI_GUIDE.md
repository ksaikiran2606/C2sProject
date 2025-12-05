# 🚀 CLI Deployment Guide

Complete guide to deploy your entire project (backend + frontend) using command-line tools.

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **Python** (v3.11 or higher)
   - Already installed (used for backend)

3. **Git** (for version control)
   - Already installed

4. **Railway Account** (for backend hosting)
   - Sign up at: https://railway.app
   - Free tier available ($5/month credit)

5. **Expo Account** (for frontend builds)
   - Sign up at: https://expo.dev
   - Free tier available

---

## 🛠️ Installation Steps

### Step 1: Install Railway CLI

**Windows (PowerShell):**
```powershell
winget install --id Railway.Railway
```

**Or download manually:**
- Visit: https://github.com/railwayapp/cli/releases
- Download the Windows installer
- Run the installer

**Verify installation:**
```powershell
railway --version
```

### Step 2: Install EAS CLI

```powershell
npm install -g eas-cli
```

**Verify installation:**
```powershell
eas --version
```

---

## 🚀 Quick Deployment

### Option 1: Deploy Everything (Recommended)

Run the master deployment script:

```powershell
.\deploy-all.ps1
```

This will:
1. Deploy backend to Railway
2. Deploy frontend using EAS Build
3. Update frontend configuration automatically

### Option 2: Deploy Separately

**Deploy Backend Only:**
```powershell
.\deploy-backend.ps1
```

**Deploy Frontend Only:**
```powershell
.\deploy-frontend.ps1
```

---

## 📝 Detailed Deployment Steps

### Backend Deployment (Railway)

1. **Login to Railway:**
   ```powershell
   railway login
   ```
   - This will open your browser for authentication

2. **Navigate to backend:**
   ```powershell
   cd backend
   ```

3. **Initialize Railway project:**
   ```powershell
   railway init
   ```
   - Choose "Create new project" or "Link existing project"

4. **Add PostgreSQL database:**
   ```powershell
   railway add postgresql
   ```
   - Or add via Railway dashboard: "+ New" → "Database" → "PostgreSQL"

5. **Add Redis:**
   ```powershell
   railway add redis
   ```
   - Or add via Railway dashboard: "+ New" → "Database" → "Redis"

6. **Set environment variables:**
   ```powershell
   # Required variables
   railway variables set SECRET_KEY="your-random-secret-key-here"
   railway variables set DEBUG=False
   railway variables set USE_POSTGRES=True
   railway variables set ALLOWED_HOSTS="*.railway.app"
   
   # Optional: Cloudinary (for image storage)
   railway variables set CLOUDINARY_CLOUD_NAME="your-cloud-name"
   railway variables set CLOUDINARY_API_KEY="your-api-key"
   railway variables set CLOUDINARY_API_SECRET="your-api-secret"
   ```

   **Note:** Database and Redis connection details are automatically set by Railway.

7. **Deploy:**
   ```powershell
   railway up
   ```

8. **Run migrations:**
   ```powershell
   railway run python manage.py migrate
   ```

9. **Create superuser (optional):**
   ```powershell
   railway run python manage.py createsuperuser
   ```

10. **Get your backend URL:**
    ```powershell
    railway domain
    ```
    - Save this URL! You'll need it for frontend configuration.

---

### Frontend Deployment (EAS Build)

1. **Login to Expo:**
   ```powershell
   eas login
   ```

2. **Navigate to frontend:**
   ```powershell
   cd frontend
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Update app.json with backend URL:**
   
   Edit `frontend/app.json` and update:
   ```json
   {
     "expo": {
       "extra": {
         "apiBaseUrl": "https://your-backend.railway.app/api",
         "wsBaseUrl": "wss://your-backend.railway.app",
         "cloudinaryCloudName": "your-cloud-name",
         "cloudinaryUploadPreset": "your-preset"
       }
     }
   }
   ```
   
   **Important:**
   - Use `https://` for API (not `http://`)
   - Use `wss://` for WebSocket (not `ws://`)
   - Replace `your-backend.railway.app` with your actual Railway URL

5. **Build Android APK:**
   ```powershell
   eas build --platform android --profile production
   ```

6. **Build Android AAB (for Play Store):**
   ```powershell
   # Update eas.json first: set buildType to "app-bundle"
   eas build --platform android --profile production
   ```

7. **Build iOS (requires Apple Developer account):**
   ```powershell
   eas build --platform ios --profile production
   ```

8. **Build for Web:**
   ```powershell
   npx expo export:web
   ```
   - Output will be in `web-build/` directory
   - Deploy to Vercel, Netlify, or any static hosting

9. **Check build status:**
   ```powershell
   eas build:list
   ```

10. **Download build:**
    ```powershell
    eas build:download
    ```

---

## 🔧 Environment Variables Reference

### Backend (Railway)

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | ✅ Yes | Django secret key (generate random string) |
| `DEBUG` | ✅ Yes | Set to `False` for production |
| `USE_POSTGRES` | ✅ Yes | Set to `True` |
| `ALLOWED_HOSTS` | ✅ Yes | `*.railway.app` or your custom domain |
| `DATABASE_URL` | ✅ Auto | Automatically set by Railway PostgreSQL |
| `REDIS_URL` | ✅ Auto | Automatically set by Railway Redis |
| `CORS_ALLOWED_ORIGINS` | ⚠️ Optional | Frontend URLs (comma-separated) |
| `CLOUDINARY_CLOUD_NAME` | ⚠️ Optional | For image storage |
| `CLOUDINARY_API_KEY` | ⚠️ Optional | For image storage |
| `CLOUDINARY_API_SECRET` | ⚠️ Optional | For image storage |

### Frontend (app.json)

| Variable | Required | Description |
|----------|----------|-------------|
| `apiBaseUrl` | ✅ Yes | Backend API URL (e.g., `https://app.railway.app/api`) |
| `wsBaseUrl` | ✅ Yes | WebSocket URL (e.g., `wss://app.railway.app`) |
| `cloudinaryCloudName` | ⚠️ Optional | Cloudinary cloud name |
| `cloudinaryUploadPreset` | ⚠️ Optional | Cloudinary upload preset |

---

## 🧪 Testing After Deployment

### Test Backend

1. **Check API endpoint:**
   ```powershell
   curl https://your-backend.railway.app/api/listings/
   ```
   - Should return JSON data

2. **Check admin panel:**
   - Visit: `https://your-backend.railway.app/admin/`
   - Login with superuser credentials

### Test Frontend

1. **Download APK** from Expo dashboard
2. **Install on Android device**
3. **Open app** and test:
   - Login/Register
   - View listings
   - Create listing
   - Chat functionality
   - Notifications

---

## 🐛 Troubleshooting

### Backend Issues

**"Deployment failed"**
- Check Railway logs: `railway logs`
- Verify all environment variables are set
- Check database connection

**"Database connection error"**
- Verify PostgreSQL is added to Railway project
- Check `DATABASE_URL` is set automatically
- Ensure `USE_POSTGRES=True`

**"CORS errors"**
- Add frontend URL to `CORS_ALLOWED_ORIGINS`
- Check `ALLOWED_HOSTS` includes your domain

### Frontend Issues

**"Build failed"**
- Check build logs in Expo dashboard
- Verify `app.json` has correct URLs
- Ensure all dependencies are installed

**"App can't connect to backend"**
- Verify backend URL in `app.json`
- Check backend is running (visit URL in browser)
- Ensure using `https://` not `http://`

**"WebSocket not working"**
- Use `wss://` not `ws://` for production
- Check Redis is running on Railway
- Verify WebSocket endpoint is accessible

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Django Deployment:** https://docs.djangoproject.com/en/4.2/howto/deployment/
- **Expo Deployment:** https://docs.expo.dev/distribution/introduction/

---

## ✅ Deployment Checklist

### Backend:
- [ ] Railway CLI installed
- [ ] Logged in to Railway
- [ ] PostgreSQL database added
- [ ] Redis added
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Migrations run
- [ ] Superuser created (optional)
- [ ] Backend URL saved

### Frontend:
- [ ] EAS CLI installed
- [ ] Logged in to Expo
- [ ] Dependencies installed
- [ ] `app.json` updated with backend URL
- [ ] Build completed successfully
- [ ] APK downloaded
- [ ] App tested on device

---

## 🎉 After Deployment

✅ **Backend runs 24/7** in the cloud  
✅ **No local computer needed**  
✅ **App works from anywhere**  
✅ **Multiple users can use simultaneously**  
✅ **Professional production setup**

**Your app is live!** 🚀

