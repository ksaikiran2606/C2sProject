# 🚀 Complete Deployment Guide - Deploy Frontend & Backend

## 🎯 Goal: Deploy So You Don't Need to Run Locally!

Once deployed, your app will work **24/7** without running anything on your computer!

---

## 📋 Deployment Overview

### What We'll Deploy:
1. **Backend (Django)** → Cloud hosting (Railway, Render, etc.)
2. **Database (PostgreSQL)** → Managed database service
3. **Redis** → For WebSocket/chat functionality
4. **Frontend (APK)** → Rebuild with production API URLs

### After Deployment:
- ✅ App works from anywhere (no local computer needed)
- ✅ Backend runs 24/7 in the cloud
- ✅ Multiple users can use the app simultaneously
- ✅ No need to keep your computer on

---

## 🎯 Option 1: Railway (Easiest - Recommended) ⭐

**Railway** is the easiest platform - it auto-detects Django and handles everything!

### Backend Deployment on Railway:

#### Step 1: Create Railway Account
1. Go to: https://railway.app
2. Sign up with GitHub (free tier available)

#### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account
4. Select your repository

#### Step 3: Add PostgreSQL Database
1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL database automatically
4. Note the connection details (shown in Variables tab)

#### Step 4: Add Redis
1. Click **"+ New"** again
2. Select **"Database"** → **"Redis"**
3. Redis will be created automatically

#### Step 5: Configure Environment Variables
In your Railway service, go to **Variables** tab and add:

```env
# Django Settings
SECRET_KEY=your-super-secret-key-here-generate-random-string
DEBUG=False
ALLOWED_HOSTS=*.railway.app,your-custom-domain.com

# Database (Railway auto-provides these, but verify)
DATABASE_URL=postgresql://... (auto-set by Railway)
DB_HOST=containers-us-west-xxx.railway.app
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=xxx
DB_PORT=5432

# Redis (Railway auto-provides)
REDIS_URL=redis://... (auto-set by Railway)
REDIS_HOST=containers-us-west-xxx.railway.app
REDIS_PORT=6379

# CORS - Allow your frontend
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:19006

# Cloudinary (Optional - for image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Step 6: Deploy
1. Railway will auto-detect Django
2. It will run: `pip install -r requirements.txt`
3. Run migrations automatically
4. Your backend will be live at: `https://your-app.railway.app`

#### Step 7: Get Your Backend URL
- Railway gives you a URL like: `https://clicktosell-production.up.railway.app`
- **Copy this URL** - you'll need it for the frontend!

---

## 🎯 Option 2: Render (Free Tier Available)

### Backend Deployment on Render:

#### Step 1: Create Account
1. Go to: https://render.com
2. Sign up (free tier available)

#### Step 2: Create PostgreSQL Database
1. Dashboard → **"New +"** → **"PostgreSQL"**
2. Name: `marketplace-db`
3. Region: Choose closest
4. Click **"Create Database"**
5. Note the **Internal Database URL**

#### Step 3: Create Redis Instance
1. **"New +"** → **"Redis"**
2. Name: `marketplace-redis`
3. Click **"Create Redis"**

#### Step 4: Create Web Service
1. **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Settings:
   - **Name:** `clicktosell-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command:** `gunicorn --bind 0.0.0.0:$PORT marketplace.wsgi:application`
   - **Instance Type:** Free (or paid for better performance)

#### Step 5: Add Environment Variables
In Render dashboard → Environment Variables:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_URL=postgres://... (from PostgreSQL service)
REDIS_URL=redis://... (from Redis service)
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### Step 6: Deploy
- Render will build and deploy automatically
- Your backend URL: `https://your-app.onrender.com`

---

## 🎯 Option 3: DigitalOcean App Platform

### Step 1: Create Account
1. Go to: https://www.digitalocean.com
2. Sign up (get $200 free credit)

### Step 2: Create App
1. Go to **App Platform**
2. **"Create App"** → Connect GitHub
3. Select your repository

### Step 3: Configure
- **Type:** Web Service
- **Build Command:** `pip install -r requirements.txt`
- **Run Command:** `gunicorn marketplace.wsgi:application --bind 0.0.0.0:8080`
- Add PostgreSQL and Redis databases
- Set environment variables

---

## 🔧 Update Frontend for Production

After deploying backend, update frontend to use production URLs:

### Step 1: Update `app.json`

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-backend.railway.app/api",
      "wsBaseUrl": "wss://your-backend.railway.app",
      "cloudinaryCloudName": "your_cloud_name",
      "cloudinaryUploadPreset": "your_preset"
    }
  }
}
```

**Important:**
- Use `https://` for API (not `http://`)
- Use `wss://` for WebSocket (not `ws://`)
- Replace `your-backend.railway.app` with your actual backend URL

### Step 2: Rebuild APK with Production URLs

```powershell
cd frontend
eas build --platform android --profile production
```

This creates a new APK that connects to your deployed backend!

---

## 📝 Complete Deployment Checklist

### Backend:
- [ ] Choose hosting platform (Railway/Render/DigitalOcean)
- [ ] Create account
- [ ] Deploy backend
- [ ] Set up PostgreSQL database
- [ ] Set up Redis
- [ ] Configure environment variables
- [ ] Run migrations
- [ ] Test backend URL (visit in browser)
- [ ] Get backend URL for frontend

### Frontend:
- [ ] Update `app.json` with production backend URL
- [ ] Change `http://` to `https://`
- [ ] Change `ws://` to `wss://`
- [ ] Rebuild APK: `eas build --platform android --profile production`
- [ ] Download new APK
- [ ] Install on phone
- [ ] Test app (should work without local backend!)

---

## 🔒 Security Checklist for Production

- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Set proper `ALLOWED_HOSTS`
- [ ] Use HTTPS (most platforms provide SSL automatically)
- [ ] Configure CORS properly
- [ ] Set up Cloudinary for image storage
- [ ] Use environment variables (never commit secrets!)

---

## 🧪 Testing After Deployment

1. **Test Backend API:**
   ```bash
   curl https://your-backend.railway.app/api/listings/
   ```
   Should return JSON data

2. **Test WebSocket:**
   - Check if WebSocket endpoint is accessible
   - Test chat functionality in app

3. **Test App:**
   - Install new APK on phone
   - Open app
   - Should load listings from deployed backend
   - Try login, create listing, chat

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| **Railway** | $5/month credit | $20/month |
| **Render** | Free (with limits) | $7/month+ |
| **DigitalOcean** | $200 credit | $12/month+ |
| **Heroku** | No free tier | $7/month+ |

**Recommendation:** Start with **Railway** or **Render** free tier!

---

## 🚨 Common Issues

### "Backend not accessible"
- Check `ALLOWED_HOSTS` includes your domain
- Verify environment variables are set
- Check platform logs for errors

### "Database connection failed"
- Verify database credentials
- Check database is running
- Ensure `DATABASE_URL` is correct

### "WebSocket not working"
- Use `wss://` not `ws://` for production
- Check Redis is running
- Verify WebSocket endpoint is accessible

### "CORS errors"
- Add your frontend domain to `CORS_ALLOWED_ORIGINS`
- Check CORS middleware is enabled

---

## 📚 Next Steps

1. **Deploy backend** to Railway/Render
2. **Update frontend** `app.json` with production URL
3. **Rebuild APK** with production configuration
4. **Test everything** works
5. **Share APK** - users can install and use without your computer!

---

## 🎉 After Deployment

✅ **Backend runs 24/7** in the cloud  
✅ **No local computer needed**  
✅ **App works from anywhere**  
✅ **Multiple users can use simultaneously**  
✅ **Professional production setup**

**You're done! Your app is live!** 🚀

