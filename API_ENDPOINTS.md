# API Endpoints Reference

## Base URL
```
http://localhost:3001/api/v1
```

## Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "meta": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "details": { ... }
}
```

## Authentication Endpoints

### Register
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response (201):
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    },
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Logout
**POST** `/auth/logout`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful"
}
```

## User Endpoints

### Get Current User Profile
**GET** `/users/profile`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "bio": "I am a creator",
    "isActive": true,
    "createdAt": "2024-01-30T10:00:00Z"
  }
}
```

### Update Profile
**PATCH** `/users/profile`

**Note:** Username and Email cannot be updated once created. Only creator profile details can be updated.

Headers:
```
Authorization: Bearer <token>
Content-Type: application/json
```

Request:
```json
{
  "creatorProfile": {
    "fullName": "Jane Smith",
    "bio": "I am a content creator",
    "profileImage": "https://example.com/profile.jpg",
    "socials": {
      "twitter": "https://twitter.com/janesmith",
      "instagram": "https://instagram.com/janesmith",
      "youtube": "https://youtube.com/@janesmith"
    }
  }
}
```

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource updated successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "creatorProfile": {
      "fullName": "Jane Smith",
      "bio": "I am a content creator",
      "profileImage": "https://example.com/profile.jpg",
      "socials": {
        "twitter": "https://twitter.com/janesmith",
        "instagram": "https://instagram.com/janesmith",
        "youtube": "https://youtube.com/@janesmith"
      }
    }
  }
}
```

### Delete Account
**DELETE** `/users/profile`

Headers:
```
Authorization: Bearer <token>
```

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource deleted successfully"
}
```

### Get User by ID
**GET** `/users/:id`

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "bio": "I am a creator",
    "isActive": true,
    "createdAt": "2024-01-30T10:00:00Z"
  }
}
```

### Get All Users (Paginated)
**GET** `/users?page=1&limit=20`

Query Parameters:
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page, max: 100

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "createdAt": "2024-01-30T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Health Check

### Get Health Status
**GET** `/health`

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service is healthy",
  "data": {
    "timestamp": "2024-01-30T10:00:00Z"
  }
}
```

## API Version

### Get API Version
**GET** `/api/version`

Response (200):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "API Version",
  "data": {
    "version": "v1"
  }
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Error Examples

### Validation Error (400)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

## Rate Limiting

Current limits:
- **Global**: 100 requests per 15 minutes
- **Auth**: 5 login attempts per 15 minutes

Headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706605200
```

## Pagination

All list endpoints support pagination:

```
GET /endpoint?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

Token obtained from login/register response.

---

For detailed documentation, see [README.md](README.md)
