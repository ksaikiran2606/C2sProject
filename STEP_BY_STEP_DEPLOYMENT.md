# 🚀 Step-by-Step Deployment Guide

Complete guide to login and deploy your frontend and backend.

---

## 📋 STEP 1: Login to Railway (Backend)

### What is Railway?
Railway is where your Django backend will be hosted.

### How to Login:

1. **Open PowerShell** (in your project directory)

2. **Run this command:**
   ```powershell
   railway login
   ```

3. **What happens:**
   - A browser window will automatically open
   - You'll see Railway's login page
   - Choose one of these options:
     - **Sign in with GitHub** (Recommended - if your GitHub is connected)
     - **Sign in with Email** (Enter your email and password)
     - **Sign up** (If you don't have an account - it's free!)

4. **Complete authentication:**
   - If using GitHub: Click "Authorize Railway"
   - If using Email: Enter credentials and click "Sign In"
   - If signing up: Fill the form and create account

5. **Verify login:**
   - Return to PowerShell
   - You should see: `Logged in as [your-email]`
   - Or run: `railway whoami` to check

**✅ Step 1 Complete when you see: "Logged in as [your-email]"**

---

## 📋 STEP 2: Login to Expo (Frontend)

### What is Expo?
Expo is where your React Native app will be built into an APK.

### How to Login:

1. **In the same PowerShell window, run:**
   ```powershell
   eas login
   ```

2. **You'll be asked:**
   ```
   Log in to EAS with email or username
   Email or username:
   ```

3. **Enter your credentials:**
   - If you have an Expo account: Enter your email/username
   - If you don't have an account:
     - Enter any email (it will create account)
     - You'll be asked for password
     - Follow the prompts to create account

4. **Complete login:**
   - Enter password when prompted
   - Press Enter

5. **Verify login:**
   - You should see: `Logged in as [your-email]`
   - Or run: `eas whoami` to check

**✅ Step 2 Complete when you see: "Logged in as [your-email]"**

---

## 📋 STEP 3: Deploy Backend to Railway

After logging in to Railway, follow these steps:

### Option A: Using Railway Dashboard (EASIEST - Recommended)

1. **Open Railway Dashboard:**
   - Go to: https://railway.app
   - You should be logged in automatically

2. **Create New Project:**
   - Click the **"+ New Project"** button (top right)
   - Select **"Deploy from GitHub repo"**
   - If first time: Authorize Railway to access GitHub
   - Select your repository: **`ksaikiran2606/C2sProject`**
   - Click **"Deploy Now"**

3. **Configure Service:**
   - Railway will start deploying
   - Click on the service that was created
   - Go to **"Settings"** tab
   - Find **"Root Directory"**
   - Set it to: **`/backend`**
   - Click **"Save"**
   - Railway will redeploy automatically

4. **Add PostgreSQL Database:**
   - In your project, click **"+ New"** button
   - Select **"Database"** → **"PostgreSQL"**
   - Railway will create it automatically
   - Connection details are auto-configured

5. **Add Redis:**
   - Click **"+ New"** again
   - Select **"Database"** → **"Redis"**
   - Railway will create it automatically

6. **Set Environment Variables:**
   - Go to your service (the Django one)
   - Click **"Variables"** tab
   - Click **"+ New Variable"** for each:
   
   **Variable 1:**
   - Name: `SECRET_KEY`
   - Value: Generate a random string (see below)
   
   **Variable 2:**
   - Name: `DEBUG`
   - Value: `False`
   
   **Variable 3:**
   - Name: `USE_POSTGRES`
   - Value: `True`
   
   **Variable 4:**
   - Name: `ALLOWED_HOSTS`
   - Value: `*.railway.app`

   **To generate SECRET_KEY:**
   - In PowerShell, run:
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
   ```
   - Copy the output and paste as SECRET_KEY value

7. **Get Your Backend URL:**
   - Go to your service → **"Settings"** tab
   - Find **"Domains"** section
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://c2sproject-production.up.railway.app`)
   - **SAVE THIS URL!** You'll need it for frontend

8. **Run Database Migrations:**
   - Go to your service → **"Deployments"** tab
   - Click on the latest deployment
   - Click **"View Logs"**
   - Or use CLI (in PowerShell, in backend folder):
   ```powershell
   cd backend
   railway run python manage.py migrate
   ```

**✅ Step 3 Complete when:**
- Backend is deployed (green status in Railway)
- You have your backend URL
- Migrations are run

---

### Option B: Using Railway CLI (Command Line)

If you prefer command line:

1. **Navigate to backend:**
   ```powershell
   cd backend
   ```

2. **Initialize Railway project:**
   ```powershell
   railway init
   ```
   - Choose: "Create new project" or "Link existing project"

3. **Add PostgreSQL:**
   ```powershell
   railway add postgresql
   ```

4. **Add Redis:**
   ```powershell
   railway add redis
   ```

5. **Generate Secret Key:**
   ```powershell
   $secretKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 50 | ForEach-Object {[char]$_})
   Write-Host $secretKey
   ```
   Copy the output.

6. **Set Environment Variables:**
   ```powershell
   railway variables set SECRET_KEY="paste-your-secret-key-here"
   railway variables set DEBUG=False
   railway variables set USE_POSTGRES=True
   railway variables set ALLOWED_HOSTS="*.railway.app"
   ```

7. **Deploy:**
   ```powershell
   railway up
   ```
   Wait 3-5 minutes for deployment.

8. **Get Backend URL:**
   ```powershell
   railway domain
   ```
   Copy the URL.

9. **Run Migrations:**
   ```powershell
   railway run python manage.py migrate
   ```

10. **Go back to project root:**
    ```powershell
    cd ..
    ```

**✅ Step 3 Complete when you have your backend URL**

---

## 📋 STEP 4: Update Frontend Configuration

Now you need to tell your frontend where your backend is:

1. **You should have your backend URL from Step 3**
   - Example: `https://c2sproject-production.up.railway.app`

2. **Edit `frontend/app.json`:**
   - Open the file: `frontend/app.json`
   - Find the `extra` section (around line 31-36)
   - Update it to:
   ```json
   "extra": {
     "apiBaseUrl": "https://YOUR-BACKEND-URL.railway.app/api",
     "wsBaseUrl": "wss://YOUR-BACKEND-URL.railway.app",
     "cloudinaryCloudName": "",
     "cloudinaryUploadPreset": ""
   }
   ```
   - Replace `YOUR-BACKEND-URL` with your actual Railway URL
   - **Important:** 
     - Use `https://` (not `http://`)
     - Use `wss://` for WebSocket (not `ws://`)

3. **Example:**
   If your backend URL is `https://c2sproject-production.up.railway.app`, then:
   ```json
   "extra": {
     "apiBaseUrl": "https://c2sproject-production.up.railway.app/api",
     "wsBaseUrl": "wss://c2sproject-production.up.railway.app",
     "cloudinaryCloudName": "",
     "cloudinaryUploadPreset": ""
   }
   ```

4. **Save the file**

**✅ Step 4 Complete when app.json is updated with your backend URL**

---

## 📋 STEP 5: Push Changes to GitHub

1. **Commit the changes:**
   ```powershell
   git add frontend/app.json
   git commit -m "Update production URLs for deployment"
   ```

2. **Push to GitHub:**
   ```powershell
   git push origin main
   ```

**✅ Step 5 Complete when changes are pushed to GitHub**

---

## 📋 STEP 6: Build Frontend APK

1. **Navigate to frontend:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies (if not done):**
   ```powershell
   npm install
   ```

3. **Build Android APK:**
   ```powershell
   eas build --platform android --profile production
   ```

4. **What happens:**
   - EAS will ask some questions:
     - **Build type:** Choose "APK" (for direct installation)
     - **Confirm:** Type "y" to confirm
   - Build will start in the cloud
   - **This takes 10-20 minutes** - be patient!
   - You'll see progress in the terminal

5. **Wait for build to complete:**
   - You'll see: "Build finished"
   - Build ID will be shown
   - You can also check: https://expo.dev

**✅ Step 6 Complete when build finishes successfully**

---

## 📋 STEP 7: Download APK

1. **Download via CLI:**
   ```powershell
   eas build:download
   ```
   - This will download the APK to your current directory

2. **Or download from Expo Dashboard:**
   - Go to: https://expo.dev
   - Click on your project
   - Go to "Builds" tab
   - Click on the latest build
   - Click "Download" button

3. **APK Location:**
   - Usually in: `frontend/` directory
   - File name: Something like `app-release.apk`

**✅ Step 7 Complete when you have the APK file**

---

## 📋 STEP 8: Install and Test

1. **Transfer APK to your Android phone:**
   - Email it to yourself
   - Or use USB cable
   - Or upload to Google Drive and download on phone

2. **Install APK:**
   - On your phone, open the APK file
   - Allow "Install from unknown sources" if prompted
   - Click "Install"
   - Wait for installation

3. **Open the app:**
   - Find "ClickToSell" app icon
   - Tap to open

4. **Test the app:**
   - Try to register/login
   - View listings
   - Create a listing
   - Test chat (if available)

**✅ Step 8 Complete when app works on your phone!**

---

## 🎉 Deployment Complete!

Your app is now:
- ✅ **Backend running 24/7** on Railway
- ✅ **Frontend APK ready** for installation
- ✅ **No local computer needed**
- ✅ **Works from anywhere**

---

## 🆘 Troubleshooting

### Railway Login Issues:
- **"Cannot login"**: Make sure browser is open and you complete authentication
- **"Unauthorized"**: Try logging out and in again: `railway logout` then `railway login`

### Expo Login Issues:
- **"Not logged in"**: Make sure you entered correct email/password
- **"Account not found"**: Create account first at https://expo.dev

### Backend Deployment Issues:
- **"Deployment failed"**: Check Railway logs in dashboard
- **"Database error"**: Make sure PostgreSQL is added and `USE_POSTGRES=True`
- **"Can't connect"**: Check `ALLOWED_HOSTS` includes `*.railway.app`

### Frontend Build Issues:
- **"Build failed"**: Check Expo dashboard for error logs
- **"Can't connect to backend"**: Verify backend URL in `app.json` uses `https://`
- **"WebSocket error"**: Make sure using `wss://` not `ws://`

---

## 📞 Quick Reference

**Railway Dashboard:** https://railway.app  
**Expo Dashboard:** https://expo.dev  
**Your GitHub Repo:** https://github.com/ksaikiran2606/C2sProject

**Common Commands:**
```powershell
railway login          # Login to Railway
railway status         # Check deployment status
railway logs           # View logs
railway domain         # Get backend URL

eas login              # Login to Expo
eas build:list         # List builds
eas build:download    # Download latest build
```

---

**Ready to start? Begin with STEP 1: `railway login`** 🚀

