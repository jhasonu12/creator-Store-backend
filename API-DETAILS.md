# API Details & Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication

All protected endpoints require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### 1. User Signup

### 2. Creator Signup
Register a new creator with slug and profile.

**Endpoint:** `POST /auth/creator-signup`

**Access:** Public

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "creator@example.com",
  "username": "creator123",
  "password": "SecurePass123",
  "slug": "my-store",
  "fullName": "Jane Doe",
  "timezone": "UTC",
  "countryCode": "US"
}
```

**Joi Validation Schema:**
```javascript
{
  email: string (email format) - required,
  username: string (alphanumeric, 3-30 chars) - required,
  password: string (min 8 chars) - required,
  slug: string (alphanumeric, 3-30 chars) - required,
  fullName: string - required,
  timezone: string - optional (default: 'UTC'),
  countryCode: string (2 chars) - optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "email": "creator@example.com",
      "username": "creator123",
      "role": "CREATOR"
    },
    "creatorProfile": {
      "fullName": "Jane Doe",
      "timezone": "UTC"
    },
    "storeSlug": "my-store",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/creator-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "username": "creator123",
    "password": "SecurePass123",
    "slug": "my-store",
    "fullName": "Jane Doe",
    "timezone": "UTC",
    "countryCode": "US"
  }'
```

**Notes:**
- Atomic transaction: StoreSlug reservation → User creation → CreatorProfile creation → Slug activation
- All operations succeed or fail together (rollback on error)
- Slug must be unique across the platform
- Trial period for creators: 30 days from signup

---

### 3. User Login
Authenticate user and receive tokens.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Joi Validation Schema:**
```javascript
{
  email: string (email format) - required,
  password: string - required
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "user@example.com",
      "username": "johndoe",
      "role": "USER"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

**Notes:**
- Access token expires in 24 hours
- Refresh token expires in 7 days
- Keep tokens secure in httpOnly cookies in production

---

### 4. Refresh Access Token
Generate new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Access:** Public

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Joi Validation Schema:**
```javascript
{
  refreshToken: string - required
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refresh successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid, expired, or revoked token
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid or expired refresh token"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Notes:**
- Old refresh token is automatically revoked after new token is issued
- Implements token rotation for enhanced security
- Prevents replay attacks by invalidating old tokens

---

### 5. User Logout
Logout user and revoke all refresh tokens.

**Endpoint:** `POST /auth/logout`

**Access:** Private (requires authentication)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Notes:**
- Revokes all active refresh tokens for the user
- Clears user cache entries
- Logs logout event for analytics
- User must login again to create new session

---

### 6. Get Current User
Retrieve the authenticated user's profile data.

**Endpoint:** `GET /auth/me`

**Access:** Private (requires authentication)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User data retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "USER",
    "isEmailVerified": false,
    "isVerified": false,
    "createdAt": "2026-02-17T10:30:00Z"
  }
}
```

**Error Responses:**

- **401 Unauthorized** - Missing or invalid token
```json
{
  "success": false,
  "statusCode": 401,
  "message": "User not authenticated"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Notes:**
- Returns currently authenticated user's profile
- Requires valid access token
- Includes email verification and user verification status
- Shows account creation timestamp

---

## Store Slug Endpoints

### 1. Check Slug Availability
Check if a store slug/name is available for registration.

**Endpoint:** `GET /store-slugs/check`

**Access:** Public

**Query Parameters:**
```
slug: string (required) - The slug to check (3-30 characters, lowercase letters, numbers, hyphens only)
```

**Response (200 OK) - Available:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Slug is available",
  "data": {
    "available": true
  }
}
```

**Response (200 OK) - Unavailable:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Slug is already in use",
  "data": {
    "available": false
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid slug format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Slug must be between 3 and 30 characters"
}
```

**cURL Examples:**

Available slug:
```bash
curl -X GET "http://localhost:3001/api/v1/store-slugs/check?slug=my-awesome-store"
```

Unavailable slug:
```bash
curl -X GET "http://localhost:3001/api/v1/store-slugs/check?slug=my-store"
```

**Notes:**
- Slug must be 3-30 characters long
- Only lowercase letters, numbers, and hyphens allowed
- Reserved slugs expire after 24 hours if not activated
- Returns availability status without requiring authentication
- Useful for real-time slug validation in signup form
- Can be called from frontend to provide instant feedback to users

---

## Common Error Responses

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
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized access"
}
```

### Conflict (409)
```json
{
  "success": false,
  "statusCode": 409,
  "message": "User with this email already exists"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing or invalid credentials |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server-side error |

---

## Authentication Flow

### 1. User Registration/Login
```
POST /auth/signup or /auth/login
  ↓
Receive accessToken & refreshToken
  ↓
Store tokens securely
```

### 2. Protected API Requests
```
GET /api/resource
Authorization: Bearer <accessToken>
  ↓
Token validated
  ↓
Resource returned
```

### 3. Token Refresh
```
Token expires (24h for access, 7d for refresh)
  ↓
POST /auth/refresh
  ↓
New tokens issued
  ↓
Old refresh token revoked
```

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Store tokens in secure httpOnly cookies** instead of localStorage
3. **Implement CORS** properly to restrict origins
4. **Use token rotation** (already implemented)
5. **Set short expiration times** for access tokens
6. **Validate all inputs** with Joi schemas (enforced for all endpoints)
7. **Never expose tokens** in logs or error messages
8. **Implement rate limiting** on auth endpoints
9. **Use strong passwords** (minimum 8 characters enforced)

---

## Testing Checklist

- [ ] User can sign up with valid credentials
- [ ] Creator can sign up with slug reservation
- [ ] Duplicate email/username rejected with 409
- [ ] Invalid email format rejected with 400
- [ ] Login with valid credentials returns tokens
- [ ] Login with invalid credentials returns 401
- [ ] Protected endpoints reject requests without token
- [ ] Refresh token allows new access token
- [ ] Old refresh token revoked after refresh
- [ ] Logout revokes all refresh tokens
- [ ] All Joi validations are enforced

---

## Date Last Updated
February 15, 2026

---

## API Version
v1

---

## Future Endpoints to Document

- [ ] User profile endpoints (GET, PUT, DELETE)
- [ ] Creator profile endpoints
- [ ] Product CRUD endpoints
- [ ] Order and payment endpoints
- [ ] Course and lesson endpoints
- [ ] Analytics endpoints
- [ ] Marketplace endpoints
- [ ] Ad/sponsored product endpoints
