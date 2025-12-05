# 🔧 Clear Browser Storage (If Still Getting 401 Errors)

If you're still seeing 401 errors after refreshing, clear the browser's stored tokens:

## Method 1: Clear via Browser Console

1. Open browser console (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:19006`
4. Delete these keys:
   - `access_token`
   - `refresh_token`
   - `user`
5. Refresh the page

## Method 2: Clear via Console Command

1. Open browser console (F12)
2. Run this command:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

## Method 3: Clear All Site Data

1. Press **F12** to open DevTools
2. Right-click the refresh button
3. Select **"Empty Cache and Hard Reload"**

---

**After clearing, refresh the page and the 401 errors should be gone!**


