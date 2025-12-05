# Setup Guide

Complete step-by-step guide to set up and run the Marketplace Application.

## Prerequisites

### Backend
- Python 3.11 or higher
- PostgreSQL 15 or higher
- Redis (for WebSocket support)
- Cloudinary account (for image storage)
- Firebase account (for push notifications)

### Frontend
- Node.js 18 or higher
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

## Backend Setup

### Option 1: Local Development (Without Docker)

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb marketplace_db
   
   # Or using psql:
   psql -U postgres
   CREATE DATABASE marketplace_db;
   ```

5. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   SECRET_KEY=your-secret-key-here-generate-with-django-secret-key-generator
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   
   DB_NAME=marketplace_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
   
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
   ```

6. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```
   Follow prompts to create admin account.

8. **Create sample categories (optional):**
   ```bash
   python manage.py shell
   ```
   ```python
   from listings.models import Category
   Category.objects.create(name="Electronics", slug="electronics")
   Category.objects.create(name="Furniture", slug="furniture")
   Category.objects.create(name="Clothing", slug="clothing")
   Category.objects.create(name="Vehicles", slug="vehicles")
   Category.objects.create(name="Books", slug="books")
   exit()
   ```

9. **Start Redis server:**
   ```bash
   redis-server
   ```

10. **Run development server:**
    ```bash
    python manage.py runserver
    ```
    
    Server will run on `http://localhost:8000`

11. **Access admin panel:**
    Navigate to `http://localhost:8000/admin` and login with superuser credentials.

### Option 2: Docker Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create `.env` file** (same as above)

3. **Build and run:**
   ```bash
   docker-compose up --build
   ```

4. **Run migrations:**
   ```bash
   docker-compose exec web python manage.py migrate
   ```

5. **Create superuser:**
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

## Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   API_BASE_URL=http://localhost:8000/api
   WS_BASE_URL=ws://localhost:8000
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
   ```

4. **Start Expo development server:**
   ```bash
   npm start
   ```
   
   Or:
   ```bash
   expo start
   ```

5. **Run on device:**
   - **iOS Simulator:** Press `i` in terminal
   - **Android Emulator:** Press `a` in terminal
   - **Physical Device:** 
     - Install Expo Go app
     - Scan QR code from terminal
     - Make sure device and computer are on same network

## Cloudinary Setup

1. **Create Cloudinary account:**
   - Go to https://cloudinary.com
   - Sign up for free account

2. **Get credentials:**
   - Cloud Name
   - API Key
   - API Secret

3. **Create upload preset:**
   - Go to Settings > Upload
   - Create unsigned upload preset
   - Set signing mode to "Unsigned"
   - Save preset name

4. **Add to environment variables:**
   - Backend: Add to `.env`
   - Frontend: Add to `.env`

## Firebase Setup (Optional - for Push Notifications)

1. **Create Firebase project:**
   - Go to https://console.firebase.google.com
   - Create new project

2. **Download service account key:**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save as JSON file

3. **Add to backend `.env`:**
   ```env
   FIREBASE_CREDENTIALS_PATH=/path/to/firebase-credentials.json
   ```

## Testing the Application

### Backend Testing

1. **Test API endpoints:**
   ```bash
   # Register user
   curl -X POST http://localhost:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"testpass123","password2":"testpass123"}'
   
   # Login
   curl -X POST http://localhost:8000/api/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"testpass123"}'
   ```

2. **Access admin panel:**
   - Navigate to `http://localhost:8000/admin`
   - Login with superuser credentials
   - Test listing approval workflow

### Frontend Testing

1. **Register/Login:**
   - Open app
   - Register new account or login
   - Verify authentication works

2. **Create Listing:**
   - Tap "+" button on home screen
   - Fill in listing details
   - Upload images
   - Submit listing
   - Verify listing appears (may need admin approval)

3. **Test Chat:**
   - Open a listing from another user
   - Tap "Chat with Seller"
   - Send messages
   - Verify real-time updates

## Common Issues

### Backend Issues

**Database connection error:**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Redis connection error:**
- Verify Redis is running: `redis-cli ping`
- Should return `PONG`
- Check Redis host/port in `.env`

**Migration errors:**
- Delete migration files (except `__init__.py`)
- Run `python manage.py makemigrations` again
- Run `python manage.py migrate`

### Frontend Issues

**Cannot connect to API:**
- Verify backend is running
- Check `API_BASE_URL` in `.env`
- For physical device, use computer's IP: `http://192.168.1.X:8000/api`

**WebSocket connection fails:**
- Verify Redis is running
- Check `WS_BASE_URL` in `.env`
- Use `ws://` not `http://` for WebSocket URL

**Image upload fails:**
- Verify Cloudinary credentials
- Check upload preset is set to "Unsigned"
- Verify CORS settings in Cloudinary

## Production Deployment

### Backend Production

1. **Set production environment:**
   ```env
   DEBUG=False
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com
   ```

2. **Collect static files:**
   ```bash
   python manage.py collectstatic
   ```

3. **Use Gunicorn:**
   ```bash
   gunicorn --bind 0.0.0.0:8000 --workers 4 marketplace.wsgi:application
   ```

4. **Set up Nginx:**
   - Use provided `nginx.conf` as reference
   - Configure SSL certificates
   - Set up reverse proxy

### Frontend Production

1. **Update environment variables:**
   - Set production API URLs
   - Update WebSocket URL

2. **Build for production:**
   ```bash
   expo build:android
   # or
   expo build:ios
   ```

   Or use EAS Build:
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

## Next Steps

1. Customize categories for your marketplace
2. Configure email settings for notifications
3. Set up production database
4. Configure CDN for static files
5. Set up monitoring and logging
6. Configure backup strategy

## Support

For issues or questions:
1. Check API documentation in `API_DOCUMENTATION.md`
2. Review error logs
3. Check Django/React Native documentation


