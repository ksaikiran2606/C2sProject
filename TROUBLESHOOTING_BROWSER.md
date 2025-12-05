# 🔧 Troubleshooting Browser Connection

## Current Issue
Browser shows "ERR_CONNECTION_REFUSED" - server not accessible

## ✅ What I Did

1. **Stopped** all existing Node processes
2. **Started** Expo in a **NEW terminal window** so you can see output
3. **Checking** if server starts properly

## 📝 What to Do Now

### Step 1: Check the New Terminal Window
A new PowerShell window should have opened showing:
- Expo/Metro bundler output
- Any error messages
- "Web is waiting on http://localhost:8081" when ready

### Step 2: Look for These Messages

**Good Signs:**
```
Metro waiting on...
Web is waiting on http://localhost:8081
```

**Error Signs:**
- Red error messages
- "Cannot find module"
- Port already in use
- Compilation errors

### Step 3: If You See Errors

**Common Fixes:**

1. **Port Already in Use:**
   ```powershell
   # Kill process on port 8081
   netstat -ano | findstr :8081
   # Note the PID, then:
   taskkill /PID <PID> /F
   ```

2. **Missing Dependencies:**
   ```powershell
   cd frontend
   npm install
   ```

3. **Clear Cache:**
   ```powershell
   cd frontend
   npm start -- --web --clear
   ```

### Step 4: When Server is Ready

1. **Wait for:** "Web is waiting on http://localhost:8081"
2. **Then:** Visit http://localhost:8081 in browser
3. **Or:** Refresh if browser is already open

## 🔍 Manual Check

**Check if server is running:**
```powershell
netstat -ano | findstr :8081
```

If you see output, server is running!

## ✅ Expected Result

- Terminal shows "Web is waiting on http://localhost:8081"
- Browser loads the app (not error page)
- You see login/register screen

---

**Check the new terminal window for status!** 🔍


