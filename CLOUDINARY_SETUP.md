# 🔧 Cloudinary Setup (Optional for Development)

## Current Status
Cloudinary is **not configured**. The app will work in development mode using local image URIs, but for production you should set up Cloudinary.

## Quick Setup (Optional)

### 1. Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Get your credentials from the dashboard

### 2. Configure Backend
Add to `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Configure Frontend
Add to `frontend/.env` (or `app.json`):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Create Upload Preset
1. Go to Cloudinary Dashboard → Settings → Upload
2. Create an "Unsigned" upload preset
3. Set it to "Allow unsigned uploads"
4. Copy the preset name to your frontend config

## Development Mode
**You can skip Cloudinary setup for now!** The app will work with local image URIs in development mode. Just note that images won't persist across page refreshes.

---

**For now, you can test the app without Cloudinary!** 🚀


