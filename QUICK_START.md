# ⚡ Quick Start - Marketplace App

## 🎯 Everything is Ready!

Your marketplace application is fully set up and ready to run.

## 🚀 Start in 2 Steps

### Step 1: Start Backend (Terminal 1)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```
✅ Backend running at: http://localhost:8000

### Step 2: Start Frontend (Terminal 2)
```powershell
cd frontend
npm start
```
✅ Then press `i` (iOS) or `a` (Android) or scan QR code

## 📋 What's Already Done

✅ Backend dependencies installed  
✅ Database configured (SQLite)  
✅ Migrations applied  
✅ Admin user created (admin/admin123)  
✅ Frontend dependencies installed  
✅ Environment configured  

## 🔗 Important URLs

- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin
- **API Docs:** See `API_DOCUMENTATION.md`

## 🎨 App Features Ready

- ✅ User registration & login
- ✅ Product listings with images
- ✅ Search & filter
- ✅ Favorites
- ✅ Real-time chat (needs Redis)
- ✅ Admin approval workflow

## ⚙️ Optional: Configure Services

**Cloudinary (for image uploads):**
1. Sign up at https://cloudinary.com
2. Get credentials
3. Update `frontend/app.json` → `extra` section

**Redis (for WebSocket chat):**
- Install Redis or use Docker
- Start Redis server
- Chat will work automatically

**PostgreSQL (for production):**
- Set `USE_POSTGRES=True` in `backend/.env`
- Configure database credentials
- Run migrations again

## 🐛 Need Help?

See:
- `START_SERVERS.md` - Detailed startup guide
- `SETUP_GUIDE.md` - Complete setup instructions
- `API_DOCUMENTATION.md` - API reference

---

**Ready to go! Start the servers and begin building! 🚀**


