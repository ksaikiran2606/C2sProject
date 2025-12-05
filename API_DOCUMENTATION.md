# API Documentation

Complete API reference for the Marketplace Application.

## Base URL
```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register/`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "password2": "securepassword123",
  "phone_number": "+1234567890",
  "location": "New York, NY"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "phone_number": "+1234567890",
    "location": "New York, NY"
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Login
**POST** `/auth/login/`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response:** Same as Register

### Logout
**POST** `/auth/logout/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**
```json
{
  "message": "Successfully logged out"
}
```

### Refresh Token
**POST** `/auth/token/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Get Profile
**GET** `/auth/profile/`

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "profile_picture": "https://...",
  "location": "New York, NY",
  "fcm_token": "firebase_token_here"
}
```

### Update Profile
**PUT** `/auth/profile/`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "phone_number": "+1234567890",
  "location": "New York, NY",
  "fcm_token": "firebase_token_here"
}
```

**Response:** Same as Get Profile

---

## Listings Endpoints

### Get All Listings
**GET** `/listings/`

**Query Parameters:**
- `search` - Search in title, description, location
- `category` - Filter by category ID
- `location` - Filter by location
- `ordering` - Order by: `price`, `-price`, `created_at`, `-created_at`
- `page` - Page number for pagination

**Example:**
```
GET /listings/?search=laptop&category=1&ordering=-created_at&page=1
```

**Response:**
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/listings/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "MacBook Pro 2023",
      "description": "Brand new MacBook...",
      "price": "1999.00",
      "category": {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics"
      },
      "location": "New York, NY",
      "seller": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "status": "approved",
      "images": [
        {
          "id": 1,
          "image": "https://cloudinary.com/...",
          "is_primary": true
        }
      ],
      "is_favorited": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Listing Details
**GET** `/listings/{id}/`

**Response:** Single listing object (same structure as in list)

### Create Listing
**POST** `/listings/`

**Request Body:**
```json
{
  "title": "MacBook Pro 2023",
  "description": "Brand new MacBook Pro...",
  "price": "1999.00",
  "category_id": 1,
  "location": "New York, NY",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

**Response:** Created listing object

### Update Listing
**PUT** `/listings/{id}/`

**Request Body:** Same as Create (all fields required)

**PATCH** `/listings/{id}/` - Partial update

**Response:** Updated listing object

### Delete Listing
**DELETE** `/listings/{id}/`

**Response:** 204 No Content

### Get Categories
**GET** `/listings/categories/`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics"
  },
  {
    "id": 2,
    "name": "Furniture",
    "slug": "furniture"
  }
]
```

### Toggle Favorite
**POST** `/listings/{id}/favorite/` - Add to favorites

**DELETE** `/listings/{id}/favorite/` - Remove from favorites

**Response:**
```json
{
  "message": "Added to favorites"
}
```

### Get Favorites
**GET** `/listings/favorites/`

**Response:**
```json
[
  {
    "id": 1,
    "listing": {
      "id": 1,
      "title": "MacBook Pro 2023",
      ...
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Get My Listings
**GET** `/listings/my_listings/`

**Response:** Array of listing objects

---

## Chat Endpoints

### Get Chat Rooms
**GET** `/chat/rooms/`

**Response:**
```json
[
  {
    "id": 1,
    "listing": {
      "id": 1,
      "title": "MacBook Pro 2023",
      "price": "1999.00",
      "images": [...]
    },
    "buyer": {
      "id": 2,
      "username": "buyer_user"
    },
    "seller": {
      "id": 1,
      "username": "john_doe"
    },
    "last_message": {
      "id": 10,
      "sender": {
        "id": 2,
        "username": "buyer_user"
      },
      "content": "Is this still available?",
      "is_read": false,
      "created_at": "2024-01-15T11:00:00Z"
    },
    "unread_count": 2,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
]
```

### Get Chat Room Details
**GET** `/chat/rooms/{id}/`

**Response:**
```json
{
  "id": 1,
  "listing": {...},
  "buyer": {...},
  "seller": {...},
  "messages": [
    {
      "id": 1,
      "sender": {
        "id": 2,
        "username": "buyer_user"
      },
      "content": "Hello",
      "is_read": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T11:00:00Z"
}
```

### Create or Get Chat Room
**POST** `/chat/rooms/create_or_get/`

**Request Body:**
```json
{
  "listing_id": 1
}
```

**Response:** Chat room details (same as Get Chat Room Details)

### Send Message (REST fallback)
**POST** `/chat/rooms/{id}/send_message/`

**Request Body:**
```json
{
  "content": "Hello, is this still available?"
}
```

**Response:**
```json
{
  "id": 11,
  "sender": {
    "id": 2,
    "username": "buyer_user"
  },
  "content": "Hello, is this still available?",
  "is_read": false,
  "created_at": "2024-01-15T11:30:00Z"
}
```

### Mark Messages as Read
**POST** `/chat/rooms/{id}/mark_read/`

**Response:**
```json
{
  "message": "Messages marked as read"
}
```

---

## WebSocket Chat

### Connect to Chat Room
**WebSocket** `ws://localhost:8000/ws/chat/{room_id}/`

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/chat/1/');
```

**Send Message:**
```json
{
  "message": "Hello, is this still available?"
}
```

**Receive Message:**
```json
{
  "id": 11,
  "sender": {
    "id": 2,
    "username": "buyer_user"
  },
  "content": "Hello, is this still available?",
  "created_at": "2024-01-15T11:30:00Z"
}
```

**Note:** WebSocket requires authentication. The connection should include the JWT token in the query string or headers (implementation depends on your WebSocket client).

---

## Notifications Endpoints

### Get Notifications
**GET** `/notifications/`

**Response:**
```json
[
  {
    "id": 1,
    "notification_type": "message",
    "title": "New Message",
    "message": "You have a new message from john_doe",
    "listing": {
      "id": 1,
      "title": "MacBook Pro 2023"
    },
    "is_read": false,
    "created_at": "2024-01-15T11:00:00Z"
  }
]
```

### Mark Notification as Read
**POST** `/notifications/{id}/mark_read/`

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

### Mark All as Read
**POST** `/notifications/mark_all_read/`

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

### Get Unread Count
**GET** `/notifications/unread_count/`

**Response:**
```json
{
  "count": 5
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message here"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Pagination

List endpoints support pagination with the following query parameters:
- `page` - Page number (default: 1)
- Page size is 20 items per page

**Response includes:**
- `count` - Total number of items
- `next` - URL to next page (null if last page)
- `previous` - URL to previous page (null if first page)
- `results` - Array of items for current page

---

## Image Upload

Images should be uploaded to Cloudinary first, then the secure URL should be sent to the API.

**Cloudinary Upload:**
1. Upload image to Cloudinary using your upload preset
2. Get the secure URL from Cloudinary response
3. Include the URL in the `images` array when creating/updating listings

**Example Cloudinary Upload:**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('upload_preset', 'your_upload_preset');
formData.append('cloud_name', 'your_cloud_name');

const response = await fetch('https://api.cloudinary.com/v1_1/{cloud_name}/image/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();
const imageUrl = data.secure_url;
```


