# ✅ Backend Successfully Deployed! Next Steps

## 🎉 Congratulations!

Your Django backend is now running on Railway! Here's what to do next:

## Step 1: Get Your Railway Backend URL

### Option A: From Railway Dashboard
1. Go to **Railway Dashboard**: https://railway.app
2. Click your service **"C2sProject"**
3. Click **"Settings"** tab
4. Scroll to **"Domains"** section
5. Click **"Generate Domain"** (if not already generated)
6. **Copy the URL** (e.g., `https://c2sproject-production-xxxx.up.railway.app`)

### Option B: From Railway CLI
```powershell
cd backend
railway domain
```

## Step 2: Update Frontend Configuration

I've created a script to automatically update your frontend configuration:

```powershell
.\update-frontend-config.ps1
```

This script will:
- ✅ Get your Railway backend URL
- ✅ Update `frontend/app.json` with the correct URLs
- ✅ Test the backend connection
- ✅ Show you what was updated

**OR** manually update `frontend/app.json`:

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-railway-url.railway.app/api",
      "wsBaseUrl": "wss://your-railway-url.railway.app"
    }
  }
}
```

## Step 3: Test Your Backend

### Test Health Endpoint:
```
https://your-railway-url.railway.app/health/
```
Should return: `{"status": "ok", "service": "marketplace-api"}`

### Test API Endpoint:
```
https://your-railway-url.railway.app/api/listings/
```
Should return listings (empty array `[]` if no listings yet)

## Step 4: Update CORS (If Needed)

If you get CORS errors when connecting from frontend, update `backend/marketplace/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:19006',
    'http://localhost:19007',
    'https://your-frontend-domain.com',  # Add your frontend domain
]
```

**Note:** With `ALLOWED_HOSTS = ['*']`, CORS should work for most cases.

## Step 5: Test Frontend Connection

1. **Start your frontend:**
   ```powershell
   cd frontend
   npm start
   ```

2. **Test the app:**
   - Try logging in
   - Try fetching listings
   - Check browser console for errors

3. **If you see CORS errors:**
   - Update CORS settings (Step 4)
   - Redeploy backend (Railway auto-redeploys on push)

## Step 6: Verify Everything Works

### ✅ Backend Checklist:
- [ ] Backend shows "Online" in Railway dashboard
- [ ] Health endpoint returns `{"status": "ok"}`
- [ ] API endpoints return data (or empty arrays)
- [ ] No errors in Railway logs

### ✅ Frontend Checklist:
- [ ] `app.json` updated with Railway URL
- [ ] Frontend can connect to backend
- [ ] API calls work
- [ ] No CORS errors

## 🚀 Optional: Deploy Frontend

If you want to deploy your frontend:

### For Mobile Apps:
- Use **Expo EAS Build** to create APK/IPA files
- Or use **Expo Go** for testing

### For Web:
- Deploy to **Vercel** or **Netlify**
- Update CORS to allow your frontend domain

## 📋 Quick Reference

### Your Backend URLs:
- **API Base:** `https://your-railway-url.railway.app/api`
- **Health Check:** `https://your-railway-url.railway.app/health/`
- **Admin Panel:** `https://your-railway-url.railway.app/admin/`
- **WebSocket:** `wss://your-railway-url.railway.app`

### Important Files:
- `frontend/app.json` - Frontend configuration
- `backend/marketplace/settings.py` - Backend settings (CORS, etc.)

## 🆘 Troubleshooting

### CORS Errors
- Update `CORS_ALLOWED_ORIGINS` in `backend/marketplace/settings.py`
- Add your frontend domain
- Push changes to trigger redeploy

### Connection Refused
- Check Railway URL is correct
- Verify backend is "Online" in Railway
- Check Railway logs for errors

### API Not Responding
- Test endpoints directly in browser
- Check Railway logs
- Verify environment variables are set

---

## 🎯 What's Next?

1. **Run the update script:**
   ```powershell
   .\update-frontend-config.ps1
   ```

2. **Test your frontend:**
   ```powershell
   cd frontend
   npm start
   ```

3. **Start using your app!** 🎉

---

**Need help? Check Railway logs or share any errors you see!**

