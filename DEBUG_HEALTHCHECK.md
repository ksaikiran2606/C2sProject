# 🔍 Debug Healthcheck Failure

## Current Status

Build: ✅ Successful  
Healthcheck: ❌ Failing  
Issue: App not responding on `/api/listings/`

## Possible Causes

1. **App not starting** - Check Railway logs
2. **Database connection failing** - App crashes on startup
3. **Port mismatch** - App listening on wrong port
4. **Missing environment variables** - SECRET_KEY, etc.

## 🔧 What I've Fixed

1. ✅ Added `/health/` endpoint (doesn't require database)
2. ✅ Updated healthcheck path to `/health/` (simpler)
3. ✅ Improved startup script with better logging
4. ✅ Added retry logic for migrations

## 📋 Next Steps

### Step 1: Check Railway Logs

**This is the most important step!**

1. Go to Railway Dashboard
2. Click your service
3. Click **"Logs"** tab
4. Look for error messages

**What to look for:**
- "Starting Django Application"
- "Running database migrations..."
- "Starting Gunicorn server..."
- Any error messages (red text)

### Step 2: Common Errors & Fixes

**Error: "Database connection refused"**
- **Fix:** Make sure PostgreSQL is added to Railway project
- Railway automatically sets `DATABASE_URL`

**Error: "SECRET_KEY not set"**
- **Fix:** Add `SECRET_KEY` variable in Railway
- Generate: `-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})`

**Error: "No such table"**
- **Fix:** Migrations didn't run
- Check if migrations are running in logs
- Run manually: `railway run python manage.py migrate`

**Error: "Module not found"**
- **Fix:** Check `requirements.txt` has all dependencies
- Rebuild deployment

**No errors but app not starting:**
- Check if gunicorn is starting
- Check if port is correct
- Check if app is listening

### Step 3: Verify Environment Variables

In Railway → Your Service → Variables:

**Required:**
- `SECRET_KEY` (must be set)
- `DEBUG=False`
- `ALLOWED_HOSTS=*.railway.app`

**Auto-set by Railway:**
- `DATABASE_URL` (when PostgreSQL added)
- `REDIS_URL` (when Redis added)
- `PORT` (automatically set)

### Step 4: Test Health Endpoint

After deployment, test:
- `https://your-url.railway.app/health/`
- Should return: `{"status": "ok", "service": "marketplace-api"}`

If this works but `/api/listings/` doesn't, it's a database issue.

## 🆘 Still Not Working?

### Get Detailed Logs:

1. **Railway Logs:**
   - Service → Logs tab
   - Look for startup messages

2. **Deployment Logs:**
   - Service → Deployments → Latest → View Logs
   - See build and startup process

3. **Run Commands Manually:**
   ```powershell
   cd backend
   railway link
   railway run python manage.py migrate
   railway run python manage.py check
   ```

### Check Database Connection:

```powershell
railway run python manage.py dbshell
```

If this fails, database isn't connected.

---

**The key is checking Railway logs to see what's actually happening!** 🔍

