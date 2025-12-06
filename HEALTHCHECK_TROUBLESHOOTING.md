# 🔍 Healthcheck Troubleshooting Guide

## ✅ Latest Fixes Applied

1. **Fixed Dockerfile CMD** - Changed from `["./start.sh"]` to `["/bin/bash", "./start.sh"]` to ensure bash script runs correctly
2. **Improved error handling** - Better logging and error messages in startup script
3. **Removed --preload flag** - Can cause issues with Django initialization

## 🚨 If Healthcheck Still Fails

### Step 1: Check Railway Logs (CRITICAL!)

**This is the most important step!**

1. Go to Railway Dashboard: https://railway.app
2. Click your service (C2sProject)
3. Click **"Logs"** tab
4. Look at the **most recent deployment logs**

**What to look for:**

✅ **Good signs:**
- "Starting Django Application"
- "PORT: XXXX"
- "Running database migrations..."
- "Starting Gunicorn server..."
- "Booting worker..."

❌ **Error signs:**
- "ERROR: Cannot import WSGI application"
- "Module not found"
- "SECRET_KEY not set"
- "Database connection refused"
- "No such file or directory"
- Any Python traceback/error

### Step 2: Common Errors & Solutions

#### Error: "ERROR: Cannot import WSGI application"

**Possible causes:**
1. Missing `SECRET_KEY` environment variable
2. Django settings error
3. Missing Python dependencies

**Solution:**
1. Go to Railway → Your Service → Variables
2. Check if `SECRET_KEY` is set
3. If not, add it:
   - Name: `SECRET_KEY`
   - Value: Generate with PowerShell:
     ```powershell
     -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
     ```
4. Railway will auto-redeploy

#### Error: "Database connection refused" or "DATABASE_URL not set"

**Solution:**
1. In Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway automatically sets `DATABASE_URL`
4. Service will redeploy

**Note:** The health endpoint doesn't require a database, but Django initialization might fail if database config is invalid.

#### Error: "Module not found" or "No module named X"

**Solution:**
1. Check `backend/requirements.txt` has all dependencies
2. Rebuild deployment (Railway will do this automatically on push)

#### Error: "No such file or directory: ./start.sh"

**Solution:**
- This shouldn't happen with the latest fix
- If it does, check that `start.sh` is in the `backend/` directory
- Make sure it's committed to git

#### No errors but server not starting

**Check:**
1. Is gunicorn starting? Look for "Starting Gunicorn server..." in logs
2. Is it binding to the correct port? Look for "Binding to: 0.0.0.0:XXXX"
3. Are there any worker errors? Look for "Booting worker..." messages

### Step 3: Verify Environment Variables

**In Railway → Your Service → Variables tab:**

**Required:**
- ✅ `SECRET_KEY` (MUST be set - generate random string)
- ✅ `DEBUG=False` (for production)
- ✅ `ALLOWED_HOSTS=*.railway.app` (or leave default - it's included in defaults)

**Auto-set by Railway:**
- ✅ `DATABASE_URL` (when PostgreSQL is added)
- ✅ `PORT` (automatically set - don't override)
- ✅ `REDIS_URL` (if Redis is added)

### Step 4: Test Health Endpoint Manually

Once deployed, try accessing:
```
https://your-app.railway.app/health/
```

**Expected response:**
```json
{"status": "ok", "service": "marketplace-api"}
```

**If you get:**
- `502 Bad Gateway` - Server not starting
- `503 Service Unavailable` - Server starting but not ready
- `404 Not Found` - URL routing issue
- `Connection refused` - Server not listening

### Step 5: Alternative Startup Script

If `start.sh` has issues, you can switch to the simpler script:

1. Edit `backend/Dockerfile`
2. Change:
   ```dockerfile
   CMD ["/bin/bash", "./start.sh"]
   ```
   To:
   ```dockerfile
   CMD ["/bin/bash", "./start-simple.sh"]
   ```
3. Commit and push

## 📋 Quick Checklist

Before checking logs, verify:

- [ ] **PostgreSQL is added** to Railway project
- [ ] **SECRET_KEY is set** in Variables tab
- [ ] **DEBUG=False** in Variables tab
- [ ] **ALLOWED_HOSTS** includes `*.railway.app` (or use default)
- [ ] **Latest code is pushed** to GitHub
- [ ] **Railway has redeployed** (check deployment status)

## 🔧 Debug Commands

If you have Railway CLI access:

```bash
# Check environment variables
railway variables

# Run migrations manually
railway run python manage.py migrate

# Test Django setup
railway run python manage.py check

# Test WSGI import
railway run python -c "from marketplace.wsgi import application; print('OK')"
```

## 📞 Still Need Help?

If healthcheck still fails after checking logs:

1. **Copy the exact error message** from Railway logs
2. **Check which step fails:**
   - Build? (unlikely - build is successful)
   - Deploy? (check if container starts)
   - Healthcheck? (check if server is running)

3. **Common issues:**
   - Missing SECRET_KEY (most common)
   - Database not added
   - Port binding issue
   - Django settings error

---

**Remember:** The health endpoint at `/health/` doesn't require a database, so if the server starts, the healthcheck should pass. If it's failing, the server likely isn't starting at all - check the logs!

