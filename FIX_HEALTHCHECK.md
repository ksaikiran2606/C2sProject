# 🔧 Fix Healthcheck Failure

## ❌ The Problem

Your build succeeded, but the healthcheck is failing because:
1. The app isn't starting properly
2. Database connection might be failing
3. Railway provides `DATABASE_URL` but settings.py wasn't using it

## ✅ The Fix

I've updated `backend/marketplace/settings.py` to:
- ✅ Use Railway's `DATABASE_URL` automatically
- ✅ Use Railway's `REDIS_URL` automatically
- ✅ Fallback to individual env vars if needed

I've also updated the Dockerfile to use Railway's `PORT` variable.

## 📋 What You Need to Do

### Step 1: Make Sure PostgreSQL is Added

1. **In Railway Dashboard:**
   - Go to your project
   - Make sure PostgreSQL database is added
   - Railway automatically sets `DATABASE_URL`

### Step 2: Make Sure Redis is Added (Optional but Recommended)

1. **In Railway Dashboard:**
   - Add Redis database
   - Railway automatically sets `REDIS_URL`

### Step 3: Verify Environment Variables

1. **Go to your service → "Variables" tab**
2. **Make sure these are set:**
   - `SECRET_KEY` (required)
   - `DEBUG=False` (required)
   - `ALLOWED_HOSTS=*.railway.app` (required)
   - `USE_POSTGRES=True` (optional - Railway's DATABASE_URL takes precedence)

**Note:** Railway automatically sets:
- `DATABASE_URL` (when PostgreSQL is added)
- `REDIS_URL` (when Redis is added)
- `PORT` (for the app to listen on)

### Step 3: Push Updated Code

The updated settings.py is ready. Push it:

```powershell
git add backend/marketplace/settings.py backend/Dockerfile
git commit -m "Fix: Use Railway DATABASE_URL and REDIS_URL automatically"
git push origin main
```

### Step 4: Railway Will Redeploy

- Railway will automatically redeploy with the new code
- The app should now start correctly
- Healthcheck should pass ✅

## ✅ Verify It's Working

1. **Check Deployment Status:**
   - Should show "Active" (green) ✅
   - No more "Healthcheck failed" ❌

2. **Check Logs:**
   - Click "Logs" tab
   - Should see: "Starting gunicorn..."
   - Should see: "Listening at: http://0.0.0.0:XXXX"
   - No database connection errors

3. **Test Backend:**
   - Visit: `https://your-url.railway.app/api/listings/`
   - Should see JSON data or `[]`

## 🆘 Still Failing?

### Check Logs:
1. Click service → "Logs" tab
2. Look for error messages
3. Common issues:
   - "Database connection refused" → PostgreSQL not added
   - "No such table" → Migrations not run
   - "Port already in use" → Shouldn't happen with Railway

### Run Migrations:
If database is connected but tables don't exist:

```powershell
cd backend
railway link
railway run python manage.py migrate
```

---

**After pushing the updated code, Railway will redeploy and the healthcheck should pass!** 🚀

