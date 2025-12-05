# 🔍 Check Your Authentication Status

## Quick Check in Browser Console

Open browser console (F12) and run:

```javascript
// Check if you have tokens stored
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
console.log('User:', localStorage.getItem('user'));
```

## If No Tokens Found

You need to **login or register** first!

1. **Register a new account:**
   - Go to Register screen
   - Fill in the form
   - You'll be automatically logged in

2. **Or login:**
   - Go to Login screen
   - Enter username and password
   - Login

## After Login

Try creating a listing again - it should work!

---

**The 401 error means you're not logged in!** 🔐


