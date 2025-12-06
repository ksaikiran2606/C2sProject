# 🎉 Backend is Live! Get URL and Update Frontend

## ✅ Healthcheck is Passing!

Your backend is successfully running! The healthcheck shows:
- ✅ Status: 200 OK
- ✅ Endpoint: `/health/` responding
- ✅ Railway healthcheck working

## Step 1: Get Your Railway Backend URL

### From Railway Dashboard:

1. **Go to:** https://railway.app
2. **Click your service:** "C2sProject"
3. **Click "Settings" tab**
4. **Scroll to "Domains" section**
5. **You'll see your URL** (e.g., `https://c2sproject-production-xxxx.up.railway.app`)

**OR**

1. **Click "Deployments" tab**
2. **Click the latest deployment**
3. **Look for the domain/URL** in the deployment details

### Your URL will look like:
- `https://c2sproject-production-xxxx.up.railway.app`
- Or similar Railway domain

## Step 2: Share Your URL

**Once you have the URL, you can:**

1. **Run the update script:**
   ```powershell
   .\update-frontend-config.ps1
   ```
   (It will ask for your URL)

2. **OR share the URL with me** and I'll update the frontend config for you

3. **OR manually update** `frontend/app.json`:
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

Once you have the URL, test these:

1. **Health Check:**
   ```
   https://your-railway-url.railway.app/health/
   ```
   Should return: `{"status": "ok", "service": "marketplace-api"}`

2. **API Endpoint:**
   ```
   https://your-railway-url.railway.app/api/listings/
   ```
   Should return listings (empty array `[]` if no listings yet)

## Step 4: Update Frontend

After updating `frontend/app.json`:

1. **Restart your frontend:**
   ```powershell
   cd frontend
   npm start
   ```

2. **Test the connection** in your app

3. **Check for CORS errors** (if any, we'll fix them)

---

## 🚀 Quick Action

**Share your Railway backend URL and I'll update the frontend configuration for you!**

Or run:
```powershell
.\update-frontend-config.ps1
```

---

**Your backend is live and working! 🎉**

