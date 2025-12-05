# OLX-Style Marketplace Mobile Application

A complete, production-ready marketplace mobile application built with React Native (Expo) and Django REST Framework.

## Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for token management

### Backend
- Django 4.2.7
- Django REST Framework
- PostgreSQL
- Django Channels (WebSockets for real-time chat)
- Cloudinary for image storage
- Firebase Cloud Messaging (FCM) for push notifications
- JWT Authentication (SimpleJWT)

## Features

### User Features
- User registration and authentication (JWT)
- View all product listings
- Search listings by keyword, category, and location
- Add product listings with multiple images
- Edit and delete own listings
- Mark favorite items
- Real-time chat between buyers and sellers (WebSockets)
- Push notifications for new messages, offers, and listing approvals

### Admin Panel Features
- Django admin customization
- Approve/Reject product listings
- View and manage users
- Delete flagged items

## Project Structure

```
.
├── backend/
│   ├── marketplace/          # Django project
│   ├── users/                     # User app
│   ├── listings/               # Listings app
│   ├── chat/                   # Chat app
│   ├── notifications/         # Notifications app
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── screens/            # App screens
│   │   ├── services/          # API services
│   │   └── constants/         # Constants and config
│   ├── App.tsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your configuration:
   - Database credentials
   - Cloudinary credentials
   - Firebase credentials path
   - Secret key

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server:**
   ```bash
   python manage.py runserver
   ```

### Backend with Docker

1. **Build and run with Docker Compose:**
   ```bash
   cd backend
   docker-compose up --build
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `API_BASE_URL` - Backend API URL
   - `WS_BASE_URL` - WebSocket URL
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_UPLOAD_PRESET` - Your Cloudinary upload preset

4. **Start Expo development server:**
   ```bash
   npm start
   ```

5. **Run on device:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### Listings Endpoints

- `GET /api/listings/` - Get all listings (with pagination, search, filters)
- `GET /api/listings/{id}/` - Get listing details
- `POST /api/listings/` - Create new listing
- `PUT /api/listings/{id}/` - Update listing
- `DELETE /api/listings/{id}/` - Delete listing
- `GET /api/listings/categories/` - Get all categories
- `POST /api/listings/{id}/favorite/` - Add to favorites
- `DELETE /api/listings/{id}/favorite/` - Remove from favorites
- `GET /api/listings/favorites/` - Get user favorites
- `GET /api/listings/my_listings/` - Get user's listings

### Chat Endpoints

- `GET /api/chat/rooms/` - Get all chat rooms
- `GET /api/chat/rooms/{id}/` - Get chat room details
- `POST /api/chat/rooms/create_or_get/` - Create or get chat room
- `POST /api/chat/rooms/{id}/send_message/` - Send message (REST fallback)
- `POST /api/chat/rooms/{id}/mark_read/` - Mark messages as read

### WebSocket Chat

- `ws://localhost:8000/ws/chat/{room_id}/` - WebSocket connection for real-time chat

### Notifications Endpoints

- `GET /api/notifications/` - Get all notifications
- `POST /api/notifications/{id}/mark_read/` - Mark notification as read
- `POST /api/notifications/mark_all_read/` - Mark all as read
- `GET /api/notifications/unread_count/` - Get unread count

## Color Theme

The application uses a strict color scheme:
- **Primary Green:** `#34B66C`
- **White:** `#FFFFFF`

All UI components follow this color scheme.

## Database Schema

### Models
- **User** - Custom user model with phone, location, FCM token
- **Category** - Product categories
- **Listing** - Product listings with status (pending/approved/rejected/sold)
- **ListingImage** - Multiple images per listing
- **Favorite** - User favorites
- **ChatRoom** - Chat rooms between buyers and sellers
- **Message** - Chat messages
- **Notification** - User notifications

All models include proper indexes for search optimization.

## Deployment

### Backend Production Deployment

1. Set `DEBUG=False` in `.env`
2. Set proper `ALLOWED_HOSTS`
3. Configure production database
4. Set up static files: `python manage.py collectstatic`
5. Use Gunicorn: `gunicorn --bind 0.0.0.0:8000 marketplace.wsgi:application`
6. Configure Nginx as reverse proxy (see `nginx.conf`)

### Frontend Production Build

1. Update environment variables for production API URLs
2. Build with Expo: `expo build:android` or `expo build:ios`
3. Or use EAS Build: `eas build --platform android`

## Security Notes

- JWT tokens with refresh mechanism
- Password validation
- CORS configured for allowed origins
- SQL injection protection (Django ORM)
- XSS protection
- CSRF protection for admin panel

## License

This project is provided as-is for educational and commercial use.


