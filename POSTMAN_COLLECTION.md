# Postman Collection & cURL Examples

Base URL: `http://localhost:3001/api/v1`

---

## Authentication Endpoints

### 1. User Signup
**Scenario:** Basic user registration without creator profile. Use when a user wants to register as a regular customer/subscriber.

**Endpoint:** `POST /auth/signup`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePass123"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration successful",
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

---

### 2. Creator Signup
**Scenario:** Register as a creator with a unique store slug. Use when someone wants to sell products or create a subscription business.

**Endpoint:** `POST /auth/creator-signup`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/creator-signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "creator@example.com",
    "username": "creator123",
    "password": "SecurePass123",
    "slug": "my-store",
    "fullName": "Jane Doe",
    "timezone": "US/Eastern",
    "countryCode": "US"
  }'
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
      "timezone": "US/Eastern"
    },
    "storeSlug": "my-store",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. User Login
**Scenario:** Authenticate an existing user and get access/refresh tokens. Use when a user wants to log in to their account.

**Endpoint:** `POST /auth/login`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
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

---

### 4. Refresh Access Token
**Scenario:** Get a new access token using the refresh token when the access token expires. Use before making API calls if the access token has expired.

**Endpoint:** `POST /auth/refresh`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
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

---

### 5. Get Current User
**Scenario:** Fetch the authenticated user's profile information. Use after login to display user details in the dashboard.

**Endpoint:** `GET /auth/me`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

---

### 6. User Logout
**Scenario:** End the user session and revoke all refresh tokens. Use when a user clicks the logout button.

**Endpoint:** `POST /auth/logout`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful"
}
```

---

## Store Slug Endpoints

### 1. Check Store Slug Availability
**Scenario:** Verify if a store name/slug is available before creator signup. Use in real-time validation on the signup form to provide instant feedback.

**Endpoint:** `GET /store-slugs/check`

**Requests:**

**Available Slug:**
```bash
curl -X GET "http://localhost:3001/api/v1/store-slugs/check?slug=my-awesome-store"
```

**Unavailable Slug:**
```bash
curl -X GET "http://localhost:3001/api/v1/store-slugs/check?slug=my-store"
```

**Invalid Format:**
```bash
curl -X GET "http://localhost:3001/api/v1/store-slugs/check?slug=My%20Store" \
  -H "Content-Type: application/json"
```

**Responses:**

**Available (200 OK):**
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

**Unavailable (200 OK):**
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

**Reserved (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Slug is reserved. Please try again later",
  "data": {
    "available": false
  }
}
```

**Validation Error (400 Bad Request):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "details": [
    {
      "field": "slug",
      "message": "Slug can only contain lowercase letters, numbers, and hyphens"
    }
  ]
}
```

---

## User Profile Endpoints

### 1. Get User Profile
**Scenario:** Fetch the authenticated user's detailed profile information. Use to display user info in account settings.

**Endpoint:** `GET /users/profile`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatars/johndoe.jpg",
    "bio": "Digital creator and entrepreneur",
    "role": "USER",
    "isEmailVerified": true,
    "createdAt": "2026-02-17T10:30:00Z"
  }
}
```

---

### 2. Update User Profile
**Scenario:** Update user's profile information (name, bio, avatar). Use when user edits their account settings.

**Endpoint:** `PATCH /users/profile`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "bio": "Digital creator, educator, and entrepreneur",
    "avatar": "https://example.com/avatars/johnsmith.jpg"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Smith",
    "avatar": "https://example.com/avatars/johnsmith.jpg",
    "bio": "Digital creator, educator, and entrepreneur",
    "role": "USER"
  }
}
```

---

### 3. Delete User Account
**Scenario:** Permanently delete the user account and all associated data. Use when user requests account deletion. Requires careful confirmation.

**Endpoint:** `DELETE /users/profile`

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Account deleted successfully"
}
```

---

### 4. Get All Users (Paginated)
**Scenario:** Fetch a list of all users for admin dashboard or user discovery. Use for displaying user lists with pagination.

**Endpoint:** `GET /users`

**Requests:**

**Default Pagination:**
```bash
curl -X GET http://localhost:3001/api/v1/users
```

**With Pagination Parameters:**
```bash
curl -X GET "http://localhost:3001/api/v1/users?page=1&limit=20"
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "email": "user1@example.com",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "role": "USER",
        "createdAt": "2026-02-15T10:30:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "email": "user2@example.com",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "role": "CREATOR",
        "createdAt": "2026-02-16T15:45:00Z"
      }
    ]
  }
}
```

---

### 5. Get User by ID
**Scenario:** Fetch a specific user's public profile information. Use when displaying user profiles to other users or admins.

**Endpoint:** `GET /users/:id`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/users/550e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://example.com/avatars/johndoe.jpg",
    "bio": "Digital creator and entrepreneur",
    "role": "USER",
    "createdAt": "2026-02-17T10:30:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found"
}
```

---

## Common Status Codes

| Code | Meaning | Example Use |
|------|---------|-------------|
| 200 | OK - Request successful | Successful GET, PATCH, DELETE |
| 201 | Created - Resource created | Successful signup/login |
| 400 | Bad Request - Validation error | Invalid slug format, missing fields |
| 401 | Unauthorized - Invalid credentials | Wrong password, expired token |
| 404 | Not Found - Resource doesn't exist | User ID not found |
| 409 | Conflict - Resource already exists | Email/username already taken |
| 500 | Internal Server Error | Server-side error |

---

## Testing Tips

1. **Always save tokens** after login/signup for subsequent requests
2. **Use Bearer tokens** in Authorization header for protected endpoints
3. **Test validation** by sending invalid data (empty strings, wrong formats, etc.)
4. **Check pagination** by varying page and limit parameters
5. **Verify token expiry** by waiting 24 hours or using expired tokens
6. **Use different scenarios** to test all business logic paths

---

## Date Last Updated
February 17, 2026

---

