# 🚂 Railway Deployment - Simple Step-by-Step Guide

Your deployment failed because Railway needs to know where your backend code is. Follow these exact steps:

---

## ✅ STEP 1: Delete the Failed Deployment

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app
   - You should see your "C2sProject" project

2. **Delete the Failed Service:**
   - Click on the failed service (the one showing "Build failed")
   - Go to **"Settings"** tab (at the top)
   - Scroll down to **"Danger Zone"**
   - Click **"Delete Service"**
   - Confirm deletion

**Why?** We need to start fresh with correct settings.

---

## ✅ STEP 2: Create New Deployment (Correct Way)

1. **In Railway Dashboard:**
   - You should be in your "C2sProject" project
   - Click **"+ New"** button (top right or in the sidebar)

2. **Select "GitHub Repo":**
   - Choose **"GitHub Repo"** option
   - If asked to authorize, click **"Authorize Railway"**
   - Select your repository: **`ksaikiran2606/C2sProject`**
   - Click **"Deploy Now"**

3. **Wait for Initial Deployment:**
   - Railway will start deploying
   - Let it finish (even if it fails - we'll fix it)

---

## ✅ STEP 3: Set Root Directory (IMPORTANT!)

This is the most important step that fixes the error!

1. **Click on the Service:**
   - Click on the service that was just created (it might be named "C2sProject" or similar)

2. **Go to Settings:**
   - Click **"Settings"** tab (at the top of the page)

3. **Find "Root Directory":**
   - Scroll down to find **"Root Directory"** section
   - You'll see a text box (probably empty or showing `/`)

4. **Set Root Directory:**
   - **Type exactly:** `backend`
   - (Just the word "backend" - no slash, no quotes)
   - Click **"Save"** or **"Update"**

5. **Railway will Redeploy:**
   - After saving, Railway will automatically redeploy
   - This time it should work!

**Why this fixes it:** Railway needs to know your Django code is in the `/backend` folder, not the root.

---

## ✅ STEP 4: Add PostgreSQL Database

1. **In Your Project:**
   - Click **"+ New"** button again
   - Select **"Database"**
   - Choose **"PostgreSQL"**

2. **Wait for Creation:**
   - Railway will create the database automatically
   - Connection details are auto-configured
   - You don't need to do anything else!

---

## ✅ STEP 5: Add Redis

1. **Click "+ New" again:**
   - Select **"Database"**
   - Choose **"Redis"**

2. **Wait for Creation:**
   - Railway will create Redis automatically
   - Connection details are auto-configured

---

## ✅ STEP 6: Set Environment Variables

1. **Go to Your Service:**
   - Click on your Django service (the one you deployed, not the databases)

2. **Go to Variables Tab:**
   - Click **"Variables"** tab (at the top)

3. **Add These Variables One by One:**

   Click **"+ New Variable"** for each:

   **Variable 1:**
   - Name: `SECRET_KEY`
   - Value: Generate a random string (see below)
   - Click **"Add"**

   **Variable 2:**
   - Name: `DEBUG`
   - Value: `False`
   - Click **"Add"**

   **Variable 3:**
   - Name: `USE_POSTGRES`
   - Value: `True`
   - Click **"Add"**

   **Variable 4:**
   - Name: `ALLOWED_HOSTS`
   - Value: `*.railway.app`
   - Click **"Add"**

4. **Generate SECRET_KEY:**
   - Open PowerShell
   - Run this command:
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
   ```
   - Copy the output (long random string)
   - Paste it as the SECRET_KEY value in Railway

**Note:** Railway automatically sets `DATABASE_URL` and `REDIS_URL` - you don't need to add those!

---

## ✅ STEP 7: Generate Domain (Get Your Backend URL)

1. **Go to Your Service:**
   - Click on your Django service

2. **Go to Settings:**
   - Click **"Settings"** tab

3. **Find "Domains" Section:**
   - Scroll to **"Domains"** section

4. **Generate Domain:**
   - Click **"Generate Domain"** button
   - Railway will create a URL like: `https://c2sproject-production.up.railway.app`
   - **COPY THIS URL!** You'll need it for frontend

---

## ✅ STEP 8: Run Database Migrations

1. **Open PowerShell:**
   - Navigate to your project:
   ```powershell
   cd C:\Users\DELL\OneDrive\Desktop\CoolProject
   ```

2. **Navigate to Backend:**
   ```powershell
   cd backend
   ```

3. **Link to Railway (if not already):**
   ```powershell
   railway link
   ```
   - Select your project when prompted

4. **Run Migrations:**
   ```powershell
   railway run python manage.py migrate
   ```

5. **Create Superuser (Optional):**
   ```powershell
   railway run python manage.py createsuperuser
   ```
   - Enter username, email, password when prompted

---

## ✅ STEP 9: Verify Deployment

1. **Check Deployment Status:**
   - In Railway dashboard, your service should show **"Active"** (green)
   - No more "Build failed" errors

2. **Test Your Backend:**
   - Open a new browser tab
   - Visit: `https://your-backend-url.railway.app/api/listings/`
   - You should see JSON data (or empty array `[]`)
   - If you see data, **SUCCESS!** ✅

3. **Test Admin Panel:**
   - Visit: `https://your-backend-url.railway.app/admin/`
   - Login with superuser credentials
   - If you can login, **SUCCESS!** ✅

---

## 🎉 Backend Deployed!

Your backend is now:
- ✅ Running 24/7 on Railway
- ✅ Connected to PostgreSQL database
- ✅ Connected to Redis
- ✅ Accessible via HTTPS URL

---

## 📝 Next Steps: Deploy Frontend

After backend is working:

1. **Update `frontend/app.json`:**
   - Open `frontend/app.json`
   - Update with your Railway URL:
   ```json
   "extra": {
     "apiBaseUrl": "https://your-backend-url.railway.app/api",
     "wsBaseUrl": "wss://your-backend-url.railway.app"
   }
   ```

2. **Build Frontend:**
   ```powershell
   cd frontend
   eas login
   eas build --platform android --profile production
   ```

---

## 🆘 Troubleshooting

### "Build failed" Error:
- **Check:** Root Directory is set to `backend` (not `/backend` or empty)
- **Fix:** Go to Settings → Root Directory → Type `backend` → Save

### "Database connection error":
- **Check:** PostgreSQL is added to project
- **Check:** `USE_POSTGRES=True` variable is set
- **Fix:** Railway auto-sets `DATABASE_URL` - don't add it manually

### "Can't access backend URL":
- **Check:** Domain is generated in Settings
- **Check:** Service shows "Active" status
- **Check:** `ALLOWED_HOSTS=*.railway.app` is set

### Still having issues?
- Check Railway logs: Click on service → "Logs" tab
- Check deployment logs: Click on service → "Deployments" → Click latest → "View Logs"

---

## 📋 Quick Checklist

- [ ] Deleted failed deployment
- [ ] Created new deployment from GitHub
- [ ] Set Root Directory to `backend`
- [ ] Added PostgreSQL database
- [ ] Added Redis database
- [ ] Set all 4 environment variables
- [ ] Generated domain and copied URL
- [ ] Ran database migrations
- [ ] Tested backend URL in browser
- [ ] Backend is working! ✅

---

**Follow these steps exactly, and your backend will deploy successfully!** 🚀

