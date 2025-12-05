# 🚀 How to Start the Application

## Quick Start Guide

### Option 1: Start Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```
Backend will run at: `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Scan QR code with Expo Go app on your phone

### Option 2: Start Backend Only (Test API)

```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

Test the API:
- Admin Panel: http://localhost:8000/admin
- API Base: http://localhost:8000/api
- API Docs: See `API_DOCUMENTATION.md`

## 📱 Running on Physical Device

1. Make sure your phone and computer are on the same WiFi network
2. Start the backend server
3. Start Expo: `cd frontend && npm start`
4. Find your computer's IP address:
   ```powershell
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```
5. Update `frontend/app.json`:
   ```json
   "extra": {
     "apiBaseUrl": "http://192.168.1.100:8000/api",
     "wsBaseUrl": "ws://192.168.1.100:8000"
   }
   ```
6. Scan QR code with Expo Go app

## 🔧 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Use a different port
python manage.py runserver 8001
```

**Database errors:**
```bash
python manage.py migrate
```

### Frontend Issues

**Metro bundler cache:**
```bash
cd frontend
npm start -- --clear
```

**Node modules issues:**
```bash
cd frontend
rm -rf node_modules
npm install --legacy-peer-deps
```

**Expo not starting:**
```bash
npx expo start --clear
```

## ✅ Verification Checklist

- [ ] Backend server running on port 8000
- [ ] Can access http://localhost:8000/admin
- [ ] Can login to admin (admin/admin123)
- [ ] Frontend Expo server started
- [ ] Can see QR code or simulator opens
- [ ] App loads without errors

## 🎯 Next Steps After Starting

1. **Create Categories** (via admin panel):
   - Electronics, Furniture, Clothing, Vehicles, Books

2. **Test User Registration**:
   - Open app → Register → Create account

3. **Create a Listing**:
   - Login → Tap "+" → Add listing with images

4. **Test Chat**:
   - Create two accounts
   - One user creates listing
   - Other user opens listing → Chat with Seller

## 📝 Default Credentials

**Admin Panel:**
- URL: http://localhost:8000/admin
- Username: `admin`
- Password: `admin123`

**Note:** Change admin password after first login!


