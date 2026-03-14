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
    "fullName": "John Doe",
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
**Scenario:** Update creator profile information including profile image, bio, full name, and social media links. Username and email cannot be updated once created. Use when a user/creator edits their profile settings.

**Endpoint:** `PATCH /users/profile`

**Note:** Only creator profile fields can be updated. Username and email are immutable after account creation.

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "creatorProfile": {
      "fullName": "Jane Doe",
      "profileImage": "https://example.com/profile.jpg",
      "bio": "Digital creator and entrepreneur",
      "socials": {
        "applePodcast": "https://podcasts.apple.com/janedoe",
        "facebook": "https://facebook.com/janedoe",
        "instagram": "jane_doe",
        "link": "https://janedoe.com",
        "linkedin": "https://linkedin.com/in/janedoe",
        "mailTo": "jane@example.com",
        "pinterest": "https://pinterest.com/janedoe",
        "spotify": "https://open.spotify.com/artist/janedoe",
        "tiktok": "janedoe",
        "twitter": "https://twitter.com/janedoe",
        "youtube": "https://youtube.com/@janedoe"
      }
    }
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "username": "johndoe",
    "creatorProfile": {
      "fullName": "Jane Doe",
      "profileImage": "https://example.com/profile.jpg",
      "bio": "Digital creator and entrepreneur",
      "socials": {
        "applePodcast": "https://podcasts.apple.com/janedoe",
        "facebook": "https://facebook.com/janedoe",
        "instagram": "jane_doe",
        "link": "https://janedoe.com",
        "linkedin": "https://linkedin.com/in/janedoe",
        "mailTo": "jane@example.com",
        "pinterest": "https://pinterest.com/janedoe",
        "spotify": "https://open.spotify.com/artist/janedoe",
        "tiktok": "janedoe",
        "twitter": "https://twitter.com/janedoe",
        "youtube": "https://youtube.com/@janedoe"
      }
    }
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
        "role": "USER",
        "createdAt": "2026-02-15T10:30:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "email": "user2@example.com",
        "username": "janedoe",
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

## Product Management Endpoints

**Product & Page Architecture:**
- **Products:** Contain catalog information only (title, type, thumbnail, styling, CTA)
- **Pages:** Are sales/checkout pages that reference products via `productId` foreign key
- Products do NOT include pages in their response - pages are accessed separately via store endpoints
- When a product is created, a default checkout page is automatically created with `price: 0`
- Pricing and page-level configuration are stored in the page's `data` JSON schema
- Multiple pages can reference the same product (e.g., different pricing variants for upsells)

### 1. Get All Products
**Scenario:** Fetch all products created by the authenticated creator. Use in product listing/dashboard to show inventory.

**Endpoint:** `GET /products`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "creatorId": "550e8400-e29b-41d4-a716-446655440002",
      "type": "DIGITAL",
      "title": "Complete Web Development Course",
      "subtitle": "From basics to advanced concepts",
      "thumbnailUrl": "https://example.com/course-thumbnail.jpg",
      "displayStyle": "Callout",
      "ctaButtonText": "Enroll Now",
      "status": 0,
      "position": 0,
      "createdAt": "2026-02-20T10:30:00Z",
      "updatedAt": "2026-02-20T10:30:00Z",
      "pages": [
        {
          "id": "aa0e8400-e29b-41d4-a716-446655440001",
          "type": "checkout",
          "status": 1,
          "data": {
            "title": "Complete Web Development Course",
            "productId": "990e8400-e29b-41d4-a716-446655440001",
            "price": 99.99,
            "currency": "USD",
            "discountPrice": 79.99,
            "isDiscountPriceAvailable": true
          },
          "createdAt": "2026-02-20T10:30:00Z",
          "updatedAt": "2026-02-20T10:30:00Z",
          "blocks": [
            {
              "id": "bb0e8400-e29b-41d4-a716-446655440001",
              "type": "hero",
              "position": 0,
              "data": {
                "headline": "Learn Web Development",
                "subheadline": "Master modern technologies",
                "cta_text": "Enroll Now"
              },
              "createdAt": "2026-02-20T10:30:00Z",
              "updatedAt": "2026-02-20T10:30:00Z"
            }
          ]
        }
      ]
    },
    {
      "id": "991e8400-e29b-41d4-a716-446655440002",
      "creatorId": "550e8400-e29b-41d4-a716-446655440002",
      "type": "COURSE",
      "title": "Advanced React Patterns",
      "subtitle": "Master advanced React concepts and hooks",
      "thumbnailUrl": "https://example.com/react-course.jpg",
      "displayStyle": "Preview",
      "ctaButtonText": "Enroll Now",
      "status": 0,
      "position": 1,
      "createdAt": "2026-02-21T14:15:00Z",
      "updatedAt": "2026-02-21T14:15:00Z",
      "pages": [
        {
          "id": "aa0e8400-e29b-41d4-a716-446655440002",
          "type": "checkout",
          "status": 0,
          "data": {
            "title": "Advanced React Patterns - Checkout",
            "productId": "991e8400-e29b-41d4-a716-446655440002",
            "price": 0,
            "currency": "USD",
            "discountPrice": null,
            "isDiscountPriceAvailable": false
          },
          "createdAt": "2026-02-21T14:15:00Z",
          "updatedAt": "2026-02-21T14:15:00Z",
          "blocks": []
        }
      ]
    }
  ]
}
```

---

### 2. Get Single Product
**Scenario:** Fetch details of a specific product. Use to display product information on product pages.

**Endpoint:** `GET /products/:id`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/products/990e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product retrieved successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "creatorId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "DIGITAL",
    "title": "Complete Web Development Course",
    "subtitle": "From basics to advanced concepts",
    "thumbnailUrl": "https://example.com/course-thumbnail.jpg",
    "displayStyle": "Callout",
    "ctaButtonText": "Enroll Now",
    "status": 0,
    "position": 0,
    "createdAt": "2026-02-20T10:30:00Z",
    "updatedAt": "2026-02-20T10:30:00Z",
    "pages": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440001",
        "type": "checkout",
        "status": 1,
        "data": {
          "title": "Complete Web Development Course",
          "productId": "990e8400-e29b-41d4-a716-446655440001",
          "price": 99.99,
          "currency": "USD",
          "discountPrice": 79.99,
          "isDiscountPriceAvailable": true
        },
        "createdAt": "2026-02-20T10:30:00Z",
        "updatedAt": "2026-02-20T10:30:00Z",
        "blocks": [
          {
            "id": "bb0e8400-e29b-41d4-a716-446655440001",
            "type": "hero",
            "position": 0,
            "data": {
              "headline": "Learn Web Development",
              "subheadline": "Master modern technologies",
              "cta_text": "Enroll Now"
            },
            "createdAt": "2026-02-20T10:30:00Z",
            "updatedAt": "2026-02-20T10:30:00Z"
          }
        ]
      }
    ]
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product not found"
}
```

---

### 3. Create Product
**Scenario:** Create a new product with custom styling, branding options, and CTA buttons. Pricing is managed separately in the checkout page.

**Endpoint:** `POST /products`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "DIGITAL",
    "title": "Advanced JavaScript Mastery",
    "subtitle": "Master modern JavaScript concepts and best practices",
    "thumbnailUrl": "https://example.com/js-course.jpg",
    "displayStyle": "Callout",
    "ctaButtonText": "Enroll Now"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product created successfully",
  "data": {
    "id": "992e8400-e29b-41d4-a716-446655440003",
    "creatorId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "DIGITAL",
    "title": "Advanced JavaScript Mastery",
    "subtitle": "Master modern JavaScript concepts and best practices",
    "thumbnailUrl": "https://example.com/js-course.jpg",
    "slug": "advanced-javascript-mastery",
    "displayStyle": "Callout",
    "ctaButtonText": "Enroll Now",
    "status": 0,
    "position": 0,
    "createdAt": "2026-02-22T09:45:00Z",
    "updatedAt": "2026-02-22T09:45:00Z"
  }
}
```

**Note:** A checkout page is automatically created when the product is created. Pricing (price, discountPrice, currency) is stored in the checkout page's `data` schema and can be updated via the page update endpoint.

---

### 4. Update Product
**Scenario:** Edit product details including title, styling, and CTA customization. Pricing updates should be done via the associated checkout page.

**Endpoint:** `PATCH /products/:id`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/products/992e8400-e29b-41d4-a716-446655440003 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Advanced JavaScript Mastery - Complete Edition",
    "thumbnailUrl": "https://example.com/js-course-updated.jpg",
    "displayStyle": "Preview",
    "ctaButtonText": "Join Now"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product updated successfully",
  "data": {
    "id": "992e8400-e29b-41d4-a716-446655440003",
    "creatorId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "DIGITAL",
    "title": "Advanced JavaScript Mastery - Complete Edition",
    "currency": "USD",
    "thumbnailUrl": "https://example.com/js-course-updated.jpg",
    "slug": "advanced-javascript-mastery-complete-edition",
    "displayStyle": "Preview",
    "ctaButtonText": "Join Now",
    "status": 0,
    "position": 0,
    "createdAt": "2026-02-22T09:45:00Z",
    "updatedAt": "2026-02-22T11:20:00Z"
  }
}
```

---

### 5. Update Product Status
**Scenario:** Update a product's status to any allowed state (DRAFT, PUBLISHED, ARCHIVED). Use when launching a product, archiving it, or reverting to draft.

**Endpoint:** `PATCH /products/:id/status`

**Request Body:**
```json
{
  "status": 0 | 1 | 2
}
```

**Status Values:**
- `0` = DRAFT
- `1` = PUBLISHED
- `2` = ARCHIVED

#### Example 1: Publish a Product
**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/products/992e8400-e29b-41d4-a716-446655440003/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": 1
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product status updated successfully",
  "data": {
    "id": "992e8400-e29b-41d4-a716-446655440003",
    "creatorId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "DIGITAL",
    "title": "Advanced JavaScript Mastery - Complete Edition",
    "description": "Master closures, async/await, promises, decorators, and advanced JavaScript patterns. Includes 50+ code examples and real-world projects.",
    "price": 129.99,
    "currency": "USD",
    "thumbnailUrl": "https://example.com/js-course-updated.jpg",
    "status": 1,
    "position": 0,
    "createdAt": "2026-02-22T09:45:00Z",
    "updatedAt": "2026-02-22T11:25:00Z"
  }
}
```

#### Example 2: Archive a Product
**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/products/992e8400-e29b-41d4-a716-446655440003/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": 2
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product status updated successfully",
  "data": {
    "id": "992e8400-e29b-41d4-a716-446655440003",
    "creatorId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "DIGITAL",
    "title": "Advanced JavaScript Mastery - Complete Edition",
    "description": "Master closures, async/await, promises, decorators, and advanced JavaScript patterns. Includes 50+ code examples and real-world projects.",
    "price": 129.99,
    "currency": "USD",
    "thumbnailUrl": "https://example.com/js-course-updated.jpg",
    "status": 2,
    "position": 0,
    "createdAt": "2026-02-22T09:45:00Z",
    "updatedAt": "2026-02-22T11:30:00Z"
  }
}
```

#### Example 3: Revert to Draft
**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/products/992e8400-e29b-41d4-a716-446655440003/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": 0
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product status updated successfully",
  "data": {
    "id": "992e8400-e29b-41d4-a716-446655440003",
    "creatorId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "DIGITAL",
    "title": "Advanced JavaScript Mastery - Complete Edition",
    "description": "Master closures, async/await, promises, decorators, and advanced JavaScript patterns. Includes 50+ code examples and real-world projects.",
    "price": 129.99,
    "currency": "USD",
    "thumbnailUrl": "https://example.com/js-course-updated.jpg",
    "status": 0,
    "position": 0,
    "createdAt": "2026-02-22T09:45:00Z",
    "updatedAt": "2026-02-22T11:35:00Z"
  }
}
```

**Valid Status Values:**
- `DRAFT`: Product is in draft mode, not visible to customers
- `PUBLISHED`: Product is live and available for sale
- `ARCHIVED`: Product is hidden from sales without being deleted

**Error Response (400 Bad Request - Invalid Status):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid status. Allowed values: 0 (DRAFT), 1 (PUBLISHED), 2 (ARCHIVED)"
}
```

---

### 6. Delete Product
**Scenario:** Permanently delete a product. Use when removing unwanted or test products.

**Endpoint:** `DELETE /products/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/v1/products/992e8400-e29b-41d4-a716-446655440003 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product deleted successfully"
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to delete this product"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product not found"
}
```

---

### 7. Reorder Products
**Scenario:** Change the order/position of products in the creator's product list. Use to organize products for display or prioritization.

**Endpoint:** `PATCH /products/reorder`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/products/reorder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "products": [
      {
        "id": "992e8400-e29b-41d4-a716-446655440003",
        "position": 0
      },
      {
        "id": "991e8400-e29b-41d4-a716-446655440002",
        "position": 1
      },
      {
        "id": "990e8400-e29b-41d4-a716-446655440001",
        "position": 2
      }
    ]
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products reordered successfully",
  "data": [
    {
      "id": "992e8400-e29b-41d4-a716-446655440003",
      "creatorId": "550e8400-e29b-41d4-a716-446655440002",
      "type": "DIGITAL",
      "title": "Advanced JavaScript Mastery",
      "description": "Master closures, async/await, promises, and advanced JavaScript patterns to become a professional developer",
      "price": 149.99,
      "currency": "USD",
      "thumbnailUrl": "https://example.com/js-course.jpg",
      "status": "DRAFT",
      "position": 0,
      "createdAt": "2026-02-22T09:45:00Z",
      "updatedAt": "2026-02-22T09:45:00Z"
    },
    {
      "id": "991e8400-e29b-41d4-a716-446655440002",
      "creatorId": "550e8400-e29b-41d4-a716-446655440002",
      "type": "COURSE",
      "title": "Advanced React Patterns",
      "description": "Master advanced React concepts, hooks, state management, and performance optimization",
      "price": 79.99,
      "currency": "USD",
      "thumbnailUrl": "https://example.com/react-course.jpg",
      "status": "DRAFT",
      "position": 1,
      "createdAt": "2026-02-21T14:15:00Z",
      "updatedAt": "2026-02-21T14:15:00Z"
    },
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "creatorId": "550e8400-e29b-41d4-a716-446655440002",
      "type": "DIGITAL",
      "title": "Complete Web Development Course",
      "description": "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch",
      "price": 99.99,
      "currency": "USD",
      "thumbnailUrl": "https://example.com/course-thumbnail.jpg",
      "status": "PUBLISHED",
      "position": 2,
      "createdAt": "2026-02-20T10:30:00Z",
      "updatedAt": "2026-02-20T10:30:00Z"
    }
  ]
}
```

**Error Response (403 Forbidden - No Permission):**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to update product [product-id]"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product [product-id] not found"
}
```

---

## Store Builder Endpoints

The store builder consists of 3 main components: **Stores** (container), **Sections** (link-in-bio), **Pages** (product funnels), and **Blocks** (page builder).

### STORE MANAGEMENT

#### Get Creator Store
**Scenario:** Fetch creator's complete dashboard data including store details, creator profile, sections, pages with blocks, and theme settings. Use when accessing the store dashboard or during onboarding to load all necessary data for the page builder.

**Endpoint:** `GET /stores/self`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/stores/self \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Store data retrieved successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "creatorId": "660e8400-e29b-41d4-a716-446655440001",
    "type": "linksite",
    "status": 1,
    "slug": "my-awesome-store",
    "name": "My Awesome Store",
    "description": "Welcome to my store!",
    "createdAt": "2026-02-18T10:30:00Z",
    "updatedAt": "2026-02-18T10:30:00Z",
    "creatorProfile": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "fullName": "Jane Doe",
      "profileImage": "https://example.com/profile.jpg",
      "bio": "Digital creator and entrepreneur",
      "socials": {
        "twitter": "https://twitter.com/janedoe",
        "instagram": "jane_doe",
        "youtube": "https://youtube.com/@janedoe"
      }
    },
    "sections": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440001",
        "type": "title",
        "position": 0,
        "status": 1,
        "data": {
          "text": "Welcome to My Store",
          "fontSize": "32px",
          "color": "#000000"
        },
        "createdAt": "2026-02-18T10:30:00Z",
        "updatedAt": "2026-02-18T10:30:00Z"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440002",
        "type": "product_link",
        "position": 1,
        "status": 1,
        "data": {
          "productId": "990e8400-e29b-41d4-a716-446655440001",
          "title": "My Digital Course",
          "description": "Learn web development"
        },
        "createdAt": "2026-02-18T10:30:00Z",
        "updatedAt": "2026-02-18T10:30:00Z"
      }
    ],
    "pages": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440001",
        "productId": "990e8400-e29b-41d4-a716-446655440001",
        "type": "checkout",
        "status": 1,
        "data": {
          "title": "Complete Web Development Course",
          "productId": "990e8400-e29b-41d4-a716-446655440001",
          "price": 99.99,
          "currency": "USD",
          "discountPrice": 79.99,
          "isDiscountPriceAvailable": true
        },
        "createdAt": "2026-02-18T10:30:00Z",
        "updatedAt": "2026-02-18T10:30:00Z",
        "blocks": [
          {
            "id": "bb0e8400-e29b-41d4-a716-446655440001",
            "type": "hero",
            "position": 0,
            "data": {
              "headline": "Learn Web Development",
              "subheadline": "Master modern technologies",
              "cta_text": "Enroll Now",
              "background_image": "https://..."
            },
            "createdAt": "2026-02-18T10:30:00Z",
            "updatedAt": "2026-02-18T10:30:00Z"
          },
          {
            "id": "bb0e8400-e29b-41d4-a716-446655440002",
            "type": "testimonial",
            "position": 1,
            "data": {
              "author": "John Developer",
              "role": "Software Engineer",
              "text": "This course transformed my career!",
              "image": "https://..."
            },
            "createdAt": "2026-02-18T10:30:00Z",
            "updatedAt": "2026-02-18T10:30:00Z"
          }
        ]
      }
    ],
    "theme": {
      "id": "cc0e8400-e29b-41d4-a716-446655440001",
      "config": {
        "primaryColor": "#FF6B35",
        "secondaryColor": "#F7F7F7",
        "fontFamily": "Poppins",
        "fontSize": "16px",
        "borderRadius": "12px",
        "buttonStyle": "rounded"
      },
      "updatedAt": "2026-02-18T10:30:00Z"
    }
  }
}
```

---

#### Update Store Settings
**Scenario:** Update store name, description, or type. Use when creator edits store settings.

**Endpoint:** `PATCH /stores/:id`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Updated Store Name",
    "description": "Updated description",
    "type": "hybrid"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Store updated successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "creatorId": "550e8400-e29b-41d4-a716-446655440002",
    "type": "hybrid",
    "status": 1,
    "slug": "my-awesome-store",
    "name": "Updated Store Name",
    "description": "Updated description",
    "createdAt": "2026-02-18T10:30:00Z",
    "updatedAt": "2026-02-18T11:30:00Z"
  }
}
```

---

### SECTIONS (Link-in-bio Vertical Layout)

#### Get All Store Sections
**Scenario:** Fetch all sections for a store's link-in-bio homepage. Use to render the public storefront.

**Endpoint:** `GET /stores/:storeId/sections`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/sections
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Sections retrieved successfully",
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "storeId": "660e8400-e29b-41d4-a716-446655440001",
      "type": "title",
      "status": 1,
      "position": 0,
      "data": {
        "text": "Welcome to My Store",
        "fontSize": "32px",
        "color": "#000000"
      }
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "storeId": "660e8400-e29b-41d4-a716-446655440001",
      "type": "product_link",
      "status": 1,
      "position": 1,
      "data": {
        "productId": "880e8400-e29b-41d4-a716-446655440001",
        "title": "My Digital Course",
        "description": "Learn web development"
      }
    }
  ]
}
```

---

#### Create Section
**Scenario:** Add a new section to the link-in-bio homepage. Use when creating titles, product links, dividers, etc.

**Endpoint:** `POST /stores/:storeId/sections`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/sections \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "product_link",
    "position": 2,
    "data": {
      "productId": "880e8400-e29b-41d4-a716-446655440002",
      "title": "Advanced Web Dev Course",
      "description": "Master React, Node.js, and more",
      "button_text": "Enroll Now"
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Section created successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "type": "product_link",
    "status": 1,
    "position": 2,
    "data": {
      "productId": "880e8400-e29b-41d4-a716-446655440002",
      "title": "Advanced Web Dev Course",
      "description": "Master React, Node.js, and more",
      "button_text": "Enroll Now"
    }
  }
}
```

---

#### Update Section
**Scenario:** Edit section content and styling. Use when modifying section text, links, or appearance.

**Endpoint:** `PATCH /sections/:id`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/stores/sections/770e8400-e29b-41d4-a716-446655440003 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "data": {
      "productId": "880e8400-e29b-41d4-a716-446655440002",
      "title": "Master Web Development",
      "description": "Complete full-stack course - 50% off!",
      "button_text": "Get Course"
    }
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Section updated successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "type": "product_link",
    "status": 1,
    "position": 2,
    "data": {
      "productId": "880e8400-e29b-41d4-a716-446655440002",
      "title": "Master Web Development",
      "description": "Complete full-stack course - 50% off!",
      "button_text": "Get Course"
    }
  }
}
```

---

#### Delete Section
**Scenario:** Remove a section from the store. Use when deleting unwanted links or content.

**Endpoint:** `DELETE /sections/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/v1/stores/sections/770e8400-e29b-41d4-a716-446655440003 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Section deleted successfully"
}
```

---

#### Reorder Sections (Atomic)
**Scenario:** Rearrange section order on the link-in-bio homepage. Use when organizing links.

**Endpoint:** `PATCH /stores/:storeId/sections/order`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/sections/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "sections": [
      {"id": "770e8400-e29b-41d4-a716-446655440001", "position": 2},
      {"id": "770e8400-e29b-41d4-a716-446655440002", "position": 1},
      {"id": "770e8400-e29b-41d4-a716-446655440003", "position": 0}
    ]
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Sections reordered successfully",
  "data": [...]
}
```

---

### PAGES (Product Landing Pages)

**Note:** Pages must reference a product (via required `productId` parameter). Pricing/content is stored in `data`, while lead form and downloadable assets are root-level page fields. The schema includes:
- `title` (required): Page title (1-200 characters)
- `productId` (required): Associated product UUID - every page must link to a product
- `price` (optional): Product price (0 or more, 2 decimal places)
- `currency` (optional): ISO 4217 code (USD, EUR, etc.)
- `discountPrice` (optional): Discounted price or null
- `isDiscountPriceAvailable` (optional): Boolean flag for discount availability
- `form` (optional, root-level): Form configuration for lead capture with `collectName` and `collectEmail` boolean flags (both default to `true` when omitted)
- `digitalAssets` (optional, root-level): Array of downloadable files with `url`, `name`, and `assetType` ('file' or 'link') for each asset
- Additional fields can be added as needed

**Auto-Creation:** A checkout page is automatically created with default pricing when a product is created. Pages are ordered by creation date (newest first).

#### Get All Store Pages
**Scenario:** Fetch all sales/product pages for a store. Use to display list of pages in builder. Pages are returned ordered by creation date (newest first).

**Endpoint:** `GET /stores/:storeId/pages`

**Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pages retrieved successfully",
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "storeId": "660e8400-e29b-41d4-a716-446655440001",
      "productId": "990e8400-e29b-41d4-a716-446655440001",
      "type": "checkout",
      "status": 1,
      "data": {
        "title": "Course Landing Page",
        "price": 99.99,
        "currency": "USD",
        "discountPrice": 79.99,
        "isDiscountPriceAvailable": true
      },
      "form": {
        "collectName": true,
        "collectEmail": true
      },
      "digitalAssets": [],
      "createdAt": "2026-03-03T10:00:00Z",
      "updatedAt": "2026-03-03T10:00:00Z"
    }
  ]
}
```

---

#### Get Single Page
**Scenario:** Fetch a specific page configuration for editing in the page builder. Returns page with all data fields.

**Endpoint:** `GET /pages/:id`

**Response (200 OK):**
```
curl -X POST http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "checkout",
    "productId": "990e8400-e29b-41d4-a716-446655440001",
    "data": {
      "title": "Complete Web Development Course",
      "price": 99.99,
      "currency": "USD",
      "discountPrice": 79.99,
      "isDiscountPriceAvailable": true
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Page created successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440002",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "productId": "990e8400-e29b-41d4-a716-446655440001",
    "type": "checkout",
    "status": 0,
    "data": {
      "title": "Complete Web Development Course",
      "price": 99.99,
      "currency": "USD",
      "discountPrice": 79.99,
      "isDiscountPriceAvailable": true
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [],
    "createdAt": "2026-03-03T10:00:00Z",
    "updatedAt": "2026-03-03T10:00:00Z"
  }
}
```

---

#### Update Page
**Scenario:** Edit page settings, pricing, or content. Use in the page builder editor.

**Endpoint:** `PATCH /pages/:id`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "data": {
      "title": "Master Web Development - 50% Off",
      "price": 119.99,
      "currency": "USD",
      "discountPrice": 59.99,
      "isDiscountPriceAvailable": true
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [
      {
        "url": "https://cdn.example.com/starter-guide.pdf",
        "name": "Starter Guide.pdf",
        "assetType": "file"
      }
    ]
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Page updated successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440002",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "productId": "990e8400-e29b-41d4-a716-446655440001",
    "type": "checkout",
    "status": 0,
    "data": {
      "title": "Master Web Development - 50% Off",
      "price": 119.99,
      "currency": "USD",
      "discountPrice": 59.99,
      "isDiscountPriceAvailable": true
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [
      {
        "url": "https://cdn.example.com/starter-guide.pdf",
        "name": "Starter Guide.pdf",
        "assetType": "file"
      }
    ],
    "createdAt": "2026-03-03T10:00:00Z",
    "updatedAt": "2026-03-03T10:05:00Z"
  }
}
```

---

#### Create Page with Form Configuration (Lead Capture)
**Scenario:** Create a page that collects customer information (name and/or email) before checkout.

**Endpoint:** `POST /stores/:storeId/pages`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "checkout",
    "productId": "990e8400-e29b-41d4-a716-446655440001",
    "data": {
      "title": "Course Registration",
      "price": 99.99,
      "currency": "USD"
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Page created successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "productId": "990e8400-e29b-41d4-a716-446655440001",
    "type": "checkout",
    "status": 0,
    "data": {
      "title": "Course Registration",
      "price": 99.99,
      "currency": "USD"
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [],
    "createdAt": "2026-03-07T10:00:00Z",
    "updatedAt": "2026-03-07T10:00:00Z"
  }
}
```

---

#### Create Page with Digital Assets (Downloadable Files)
**Scenario:** Create a digital download page that includes files for customers to download (PDFs, guides, templates, etc.).

**Endpoint:** `POST /stores/:storeId/pages`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/pages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "digital-download",
    "productId": "990e8400-e29b-41d4-a716-446655440002",
    "data": {
      "title": "Complete Marketing Templates Bundle",
      "price": 49.99,
      "currency": "USD"
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [
      {
        "url": "https://cdn.example.com/marketing-guide.pdf",
        "name": "Marketing Strategy Guide.pdf",
        "assetType": "file"
      },
      {
        "url": "https://cdn.example.com/email-templates.zip",
        "name": "Email Templates.zip",
        "assetType": "file"
      },
      {
        "url": "https://cdn.example.com/social-media-calendar.xlsx",
        "name": "Social Media Calendar.xlsx",
        "assetType": "file"
      }
    ]
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Page created successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440004",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "productId": "990e8400-e29b-41d4-a716-446655440002",
    "type": "digital-download",
    "status": 0,
    "data": {
      "title": "Complete Marketing Templates Bundle",
      "price": 49.99,
      "currency": "USD"
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [
      {
        "url": "https://cdn.example.com/marketing-guide.pdf",
        "name": "Marketing Strategy Guide.pdf",
        "assetType": "file"
      },
      {
        "url": "https://cdn.example.com/email-templates.zip",
        "name": "Email Templates.zip",
        "assetType": "file"
      },
      {
        "url": "https://cdn.example.com/social-media-calendar.xlsx",
        "name": "Social Media Calendar.xlsx",
        "assetType": "file"
      }
    ],
    "createdAt": "2026-03-07T10:00:00Z",
    "updatedAt": "2026-03-07T10:00:00Z"
  }
}
```

---

### PAGE BLOCKS (Reviews & FAQs)

**Note:** Pages are automatically deleted when their associated product is deleted (CASCADE delete).

Checkout pages support two types of blocks: **Testimonials (Reviews)** and **FAQs**. These provide social proof and answer customer questions.

#### Get All Page Blocks
**Scenario:** Fetch all review and FAQ blocks within a checkout page.

**Endpoint:** `GET /pages/:pageId/blocks`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002/blocks
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blocks retrieved successfully",
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "pageId": "880e8400-e29b-41d4-a716-446655440002",
      "type": "testimonial",
      "position": 0,
      "data": {
        "name": "Jane Doe",
        "image": "https://example.com/jane.jpg",
        "content": "This course completely transformed my understanding of web development. The instructor's teaching style was excellent!",
        "rating": 5
      },
      "createdAt": "2026-03-07T10:00:00Z",
      "updatedAt": "2026-03-07T10:00:00Z"
    },
    {
      "id": "991e8400-e29b-41d4-a716-446655440001",
      "pageId": "880e8400-e29b-41d4-a716-446655440002",
      "type": "faq",
      "position": 1,
      "data": {
        "question": "Do I need any prior experience?",
        "answer": "No, this course is designed for complete beginners. We start with the fundamentals and progress step by step."
      },
      "createdAt": "2026-03-07T11:00:00Z",
      "updatedAt": "2026-03-07T11:00:00Z"
    }
  ]
}
```

---

#### Create Block (Testimonial)
**Scenario:** Add a customer review/testimonial to the checkout page.

**Endpoint:** `POST /pages/:pageId/blocks`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002/blocks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "testimonial",
    "position": 0,
    "data": {
      "name": "Jane Doe",
      "image": "https://example.com/jane.jpg",
      "content": "This course completely transformed my career! I landed my dream job within 3 months.",
      "rating": 5
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Block created successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440002",
    "pageId": "880e8400-e29b-41d4-a716-446655440002",
    "type": "testimonial",
    "position": 0,
    "data": {
      "name": "Jane Doe",
      "image": "https://example.com/jane.jpg",
      "content": "This course completely transformed my career! I landed my dream job within 3 months.",
      "rating": 5
    },
    "createdAt": "2026-03-07T10:00:00Z",
    "updatedAt": "2026-03-07T10:00:00Z"
  }
}
```

#### Create Block (FAQ)
**Scenario:** Add a frequently asked question to the checkout page.

**Endpoint:** `POST /pages/:pageId/blocks`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002/blocks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "faq",
    "position": 1,
    "data": {
      "question": "What payment methods do you accept?",
      "answer": "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers."
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Block created successfully",
  "data": {
    "id": "991e8400-e29b-41d4-a716-446655440002",
    "pageId": "880e8400-e29b-41d4-a716-446655440002",
    "type": "faq",
    "position": 1,
    "data": {
      "question": "What payment methods do you accept?",
      "answer": "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers."
    },
    "createdAt": "2026-03-07T11:00:00Z",
    "updatedAt": "2026-03-07T11:00:00Z"
  }
}
```

---

#### Update Block
**Scenario:** Edit a testimonial or FAQ block content.

**Endpoint:** `PATCH /pages/blocks/:id`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/blocks/990e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "data": {
      "name": "Jane Doe",
      "image": "https://example.com/jane.jpg",
      "content": "Absolutely fantastic course! The best investment I made in my career.",
      "rating": 5
    }
  }'
```

---

#### Delete Block
**Scenario:** Remove a testimonial or FAQ from the checkout page.

**Endpoint:** `DELETE /pages/blocks/:id`

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/v1/pages/blocks/990e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Block deleted successfully"
}
```

---

#### Reorder Blocks (Atomic)
**Scenario:** Change the order of testimonials and FAQs on the checkout page.

**Endpoint:** `PATCH /pages/:pageId/blocks/order`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002/blocks/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "blocks": [
      {"id": "990e8400-e29b-41d4-a716-446655440002", "position": 0},
      {"id": "991e8400-e29b-41d4-a716-446655440002", "position": 1},
      {"id": "992e8400-e29b-41d4-a716-446655440002", "position": 2}
    ]
  }'
```

---

### THEME

#### Get Store Theme
**Scenario:** Fetch the store's theme settings (colors, fonts, etc.). Use to display theme customization options.

**Endpoint:** `GET /stores/:storeId/theme`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/theme
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Theme retrieved successfully",
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "config": {
      "primaryColor": "#FF6B35",
      "secondaryColor": "#F7F7F7",
      "fontFamily": "Poppins",
      "fontSize": "16px",
      "borderRadius": "12px",
      "buttonStyle": "rounded"
    },
    "updatedAt": "2026-02-18T10:30:00Z"
  }
}
```

---

#### Update Theme
**Scenario:** Customize store colors, fonts, and styles. Use in theme settings.

**Endpoint:** `PATCH /stores/:storeId/theme`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/stores/660e8400-e29b-41d4-a716-446655440001/theme \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "config": {
      "primaryColor": "#2563EB",
      "secondaryColor": "#FFFFFF",
      "fontFamily": "Inter",
      "fontSize": "16px",
      "borderRadius": "8px",
      "buttonStyle": "pill"
    }
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Theme updated successfully",
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "config": {
      "primaryColor": "#2563EB",
      "secondaryColor": "#FFFFFF",
      "fontFamily": "Inter",
      "fontSize": "16px",
      "borderRadius": "8px",
      "buttonStyle": "pill"
    },
    "updatedAt": "2026-02-18T11:30:00Z"
  }
}
```

---

## Public Store Endpoints

> **Note:** These endpoints do not require authentication and are used for public storefront access.

### 1. Get Store by Slug (Public Storefront)
**Scenario:** Retrieve a public store's full data including products, sections, pages, and theme configuration. Use this for displaying the public storefront/landing page.

**Endpoint:** `GET /public/store/:slug`

**Parameters:**
- `slug` (string, required) - The store slug identifier (e.g., "mystore", "johndoe-creations")

**Request:**
```bash
curl -X GET http://localhost:3001/public/store/mystore \
  -H "Content-Type: application/json"
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Store data retrieved successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "creatorId": "550e8400-e29b-41d4-a716-446655440001",
    "slug": "mystore",
    "name": "My Store",
    "description": "Welcome to my creative store",
    "type": "linksite",
    "status": 1,
    "createdAt": "2026-02-18T10:00:00Z",
    "updatedAt": "2026-02-28T12:30:00Z",
    "creatorProfile": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "fullName": "John Doe",
      "profileImage": "https://example.com/profiles/john.jpg",
      "bio": "Creative entrepreneur and digital artist",
      "socials": {
        "twitter": "https://twitter.com/johndoe",
        "instagram": "https://instagram.com/johndoe"
      }
    },
    "products": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "type": "digital",
        "title": "E-book: Digital Marketing Guide",
        "description": "Comprehensive guide to modern digital marketing strategies",
        "price": "29.99",
        "currency": "USD",
        "thumbnailUrl": "https://example.com/products/ebook-thumbnail.jpg",
        "status": "PUBLISHED",
        "position": 0,
        "createdAt": "2026-02-18T10:00:00Z",
        "updatedAt": "2026-02-28T11:00:00Z"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440001",
        "type": "service",
        "title": "Coaching Session",
        "description": "1-on-1 coaching session for aspiring entrepreneurs",
        "price": "99.99",
        "currency": "USD",
        "thumbnailUrl": "https://example.com/products/coaching.jpg",
        "status": "PUBLISHED",
        "position": 1,
        "createdAt": "2026-02-18T10:30:00Z",
        "updatedAt": "2026-02-28T11:00:00Z"
      }
    ],
    "sections": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440001",
        "type": "hero",
        "position": 0,
        "status": "PUBLISHED",
        "data": {
          "title": "Welcome to My Creative Store",
          "description": "Discover premium content and services",
          "backgroundColor": "#FFFFFF",
          "ctaText": "Shop Now"
        },
        "createdAt": "2026-02-18T10:00:00Z",
        "updatedAt": "2026-02-28T11:00:00Z"
      }
    ],
    "pages": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440001",
        "slug": "about",
        "type": "custom",
        "position": 0,
        "status": "PUBLISHED",
        "data": {
          "title": "About Me",
          "content": "Learn more about my journey..."
        },
        "createdAt": "2026-02-18T10:00:00Z",
        "updatedAt": "2026-02-28T11:00:00Z",
        "blocks": [
          {
            "id": "bb0e8400-e29b-41d4-a716-446655440001",
            "type": "text",
            "position": 0,
            "data": {
              "content": "I started this journey..."
            },
            "createdAt": "2026-02-18T10:00:00Z",
            "updatedAt": "2026-02-28T11:00:00Z"
          }
        ]
      }
    ],
    "theme": {
      "id": "cc0e8400-e29b-41d4-a716-446655440001",
      "config": {
        "primaryColor": "#2563EB",
        "secondaryColor": "#FFFFFF",
        "fontFamily": "Inter",
        "fontSize": "16px",
        "borderRadius": "8px",
        "buttonStyle": "rounded"
      },
      "updatedAt": "2026-02-28T12:30:00Z"
    }
  }
}
```

**Error Response (404 Not Found):**
```bash
curl -X GET http://localhost:3001/public/store/nonexistent \
  -H "Content-Type: application/json"
```

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Store not found or is not active",
  "data": null
}
```

---

### Page Builder - Optimized API Endpoints

#### Update Page (Data, Type, or ProductId)
**Scenario:** Editor updates page content, type, or associated product. Use for pricing updates, form configuration, digital assets, and page settings.

**Endpoint:** `PATCH /pages/:id`

**Request - Update Page Data:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "data": {
      "title": "Master Web Development - Updated",
      "price": 119.99,
      "currency": "USD",
      "discountPrice": 79.99,
      "isDiscountPriceAvailable": true
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [
      {
        "url": "https://cdn.example.com/starter-guide.pdf",
        "name": "Starter Guide.pdf",
        "assetType": "file"
      }
    ]
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Page updated successfully",
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440002",
    "storeId": "660e8400-e29b-41d4-a716-446655440001",
    "productId": "990e8400-e29b-41d4-a716-446655440001",
    "type": "checkout",
    "status": 0,
    "data": {
      "title": "Master Web Development - Updated",
      "price": 119.99,
      "currency": "USD",
      "discountPrice": 79.99,
      "isDiscountPriceAvailable": true
    },
    "form": {
      "collectName": true,
      "collectEmail": true
    },
    "digitalAssets": [
      {
        "url": "https://cdn.example.com/starter-guide.pdf",
        "name": "Starter Guide.pdf",
        "assetType": "file"
      }
    ],
    "createdAt": "2026-03-07T10:00:00Z",
    "updatedAt": "2026-03-07T10:15:00Z"
  }
}
```

**Request - Update Page Type:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "digital-download"
  }'
```

**Request - Associate with Different Product:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "productId": "990e8400-e29b-41d4-a716-446655440099"
  }'
```

---

#### Update Block (Testimonial/FAQ)
**Scenario:** User edits a testimonial or FAQ on the checkout page. Updates the block data while preserving position.

**Endpoint:** `PATCH /pages/blocks/:id`

**Request - Update Testimonial:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/blocks/990e8400-e29b-41d4-a716-446655440005 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "testimonial",
    "data": {
      "name": "Jane Smith",
      "image": "https://example.com/jane-smith.jpg",
      "content": "This course completely transformed my career. The hands-on projects were invaluable.",
      "rating": 5
    }
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Block updated successfully",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440005",
    "pageId": "880e8400-e29b-41d4-a716-446655440002",
    "type": "testimonial",
    "position": 0,
    "data": {
      "name": "Jane Smith",
      "image": "https://example.com/jane-smith.jpg",
      "content": "This course completely transformed my career. The hands-on projects were invaluable.",
      "rating": 5
    },
    "createdAt": "2026-03-07T10:00:00Z",
    "updatedAt": "2026-03-07T10:20:00Z"
  }
}
```

---

#### Reorder Blocks (Drag & Drop)
**Scenario:** User reorders testimonials and FAQs on the page via drag-and-drop. Batch update all positions in single request.

**Endpoint:** `PATCH /pages/:pageId/blocks/order`

**Request:**
```bash
curl -X PATCH http://localhost:3001/api/v1/pages/880e8400-e29b-41d4-a716-446655440002/blocks/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "blocks": [
      {
        "id": "991e8400-e29b-41d4-a716-446655440001",
        "position": 0
      },
      {
        "id": "990e8400-e29b-41d4-a716-446655440005",
        "position": 1
      },
      {
        "id": "992e8400-e29b-41d4-a716-446655440001",
        "position": 2
      }
    ]
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blocks reordered successfully",
  "data": {
    "pageId": "880e8400-e29b-41d4-a716-446655440002",
    "reorderedCount": 3,
    "blocks": [
      {
        "id": "991e8400-e29b-41d4-a716-446655440001",
        "position": 0,
        "type": "faq"
      },
      {
        "id": "990e8400-e29b-41d4-a716-446655440005",
        "position": 1,
        "type": "testimonial"
      },
      {
        "id": "992e8400-e29b-41d4-a716-446655440001",
        "position": 2,
        "type": "testimonial"
      }
    ]
  }
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
---

## File Upload Endpoints

### 1. Get Presigned URL for Upload
**Scenario:** Get a presigned URL from S3 to upload files directly. First step of 3-step upload process.

**Endpoint:** `POST /files/presigned-url`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/files/presigned-url \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "originalFilename": "document.pdf",
    "contentType": "application/pdf",
    "entityType": "profile",
    "folder": "documents",
    "expiresIn": 3600
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Presigned URL generated successfully",
  "data": {
    "fileId": "550e8400-e29b-41d4-a716-446655440001",
    "presignedUrl": "https://creator-media-store-files.s3.ap-south-1.amazonaws.com/uploads/documents/1772957294015-ryfmkkvdf0b-document.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&...",
    "s3Key": "uploads/documents/1772957294015-ryfmkkvdf0b-document.pdf",
    "bucket": "creator-media-store-files"
  }
}
```

**Request Body Parameters:**
- `originalFilename` (required): Filename with extension
- `contentType` (required): MIME type (e.g., application/pdf, image/jpeg)
- `entityType` (optional): Entity type - "product", "profile", "document" (default: "profile")
- `productId` (optional): Product UUID (required if entityType is "product")
- `folder` (optional): S3 folder path (default: "assets")
- `expiresIn` (optional): URL expiration time in seconds (default: 3600)

---

### 2. Upload File to S3 Using Presigned URL
**Scenario:** Upload file directly to S3 using presigned URL. Second step of 3-step upload process.

**Important:** This is a direct upload to S3, NOT to your backend!

**Endpoint:** `PUT <presignedUrl>`

**Request (Upload PDF):**
```bash
# Get presigned URL first (from Step 1)
PRESIGNED_URL="https://creator-media-store-files.s3.ap-south-1.amazonaws.com/uploads/documents/1772957294015-ryfmkkvdf0b-document.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&..."

# Upload file to S3
curl -X PUT "$PRESIGNED_URL" \
  -H "Content-Type: application/pdf" \
  --data-binary @./document.pdf
```

**Request (Upload Image):**
```bash
# For JPG image
PRESIGNED_URL="https://creator-media-store-files.s3.ap-south-1.amazonaws.com/uploads/profile/..."

curl -X PUT "$PRESIGNED_URL" \
  -H "Content-Type: image/jpeg" \
  --data-binary @./profile-image.jpg
```

**Request (Upload Word Document):**
```bash
# For DOCX file
PRESIGNED_URL="https://creator-media-store-files.s3.ap-south-1.amazonaws.com/uploads/documents/..."

curl -X PUT "$PRESIGNED_URL" \
  -H "Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document" \
  --data-binary @./document.docx
```

**Response:**
- Status: 200 OK
- Empty body (S3 returns no content on successful PUT)

**Important Notes:**
- ✅ Use correct `Content-Type` header matching file type
- ✅ Use `--data-binary` for binary files (images, PDFs, etc.)
- ✅ Do NOT include Authorization header (presigned URL has built-in auth)
- ✅ Do NOT modify the presigned URL

---

### 3. Register File in Database
**Scenario:** After file is uploaded to S3, register it in database. Third step of 3-step upload process.

**Endpoint:** `POST /files/register`

**Request:**
```bash
curl -X POST http://localhost:3001/api/v1/files/register \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "550e8400-e29b-41d4-a716-446655440001",
    "s3Key": "uploads/documents/1772957294015-ryfmkkvdf0b-document.pdf",
    "fileSize": 2048576
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File registered successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "productId": null,
    "userId": "user-uuid",
    "fileUrl": "https://creator-media-store-files.s3.ap-south-1.amazonaws.com/uploads/documents/1772957294015-ryfmkkvdf0b-document.pdf",
    "fileSize": 2048576,
    "status": "uploaded",
    "s3Key": "uploads/documents/1772957294015-ryfmkkvdf0b-document.pdf",
    "entityType": "profile",
    "createdAt": "2026-03-08T10:00:00Z",
    "updatedAt": "2026-03-08T10:00:00Z"
  }
}
```

**Request Body Parameters:**
- `fileId` (required): File ID from presigned URL response
- `s3Key` (required): S3 key from presigned URL response
- `fileSize` (required): File size in bytes

---

### 4. Get Product Files
**Scenario:** Retrieve all files associated with a product.

**Endpoint:** `GET /files/products/:productId`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/files/products/550e8400-e29b-41d4-a716-446655440001
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product files retrieved successfully",
  "data": [
    {
      "id": "file-uuid-1",
      "productId": "product-uuid",
      "userId": "user-uuid",
      "fileUrl": "https://creator-media-store-files.s3.ap-south-1.amazonaws.com/...",
      "fileSize": 2048576,
      "status": "uploaded",
      "s3Key": "uploads/documents/...",
      "entityType": "product",
      "createdAt": "2026-03-08T10:00:00Z"
    }
  ]
}
```

---

### 5. Get File Info
**Scenario:** Get metadata for a specific file.

**Endpoint:** `GET /files/:fileId`

**Request:**
```bash
curl -X GET http://localhost:3001/api/v1/files/550e8400-e29b-41d4-a716-446655440001
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File info retrieved successfully",
  "data": {
    "id": "file-uuid",
    "productId": null,
    "userId": "user-uuid",
    "fileUrl": "https://creator-media-store-files.s3.ap-south-1.amazonaws.com/...",
    "fileSize": 2048576,
    "status": "uploaded",
    "s3Key": "uploads/documents/...",
    "entityType": "profile"
  }
}
```

---

### 6. Get Download URL (Signed)
**Scenario:** Generate a time-limited signed URL for downloading a private file.

**Endpoint:** `GET /files/:fileId/download`

**Request:**
```bash
curl -X GET "http://localhost:3001/api/v1/files/550e8400-e29b-41d4-a716-446655440001/download?expiresIn=7200" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Download URL generated successfully",
  "data": {
    "downloadUrl": "https://creator-media-store-files.s3.ap-south-1.amazonaws.com/uploads/documents/...?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=..."
  }
}
```

**Query Parameters:**
- `expiresIn` (optional): URL expiration time in seconds (60-86400, default: 3600)

---

### 7. Delete File
**Scenario:** Delete a file from S3 and database.

**Endpoint:** `DELETE /files/:fileId`

**Request:**
```bash
curl -X DELETE http://localhost:3001/api/v1/files/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "File deleted successfully"
}
```

---

## File Upload Flow Example

```bash
#!/bin/bash

# Configuration
TOKEN="YOUR_JWT_TOKEN"
FILE_PATH="./document.pdf"
API_BASE="http://localhost:3001/api/v1"

echo "📁 Step 1: Get presigned URL..."
RESPONSE=$(curl -s -X POST "$API_BASE/files/presigned-url" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "originalFilename": "document.pdf",
    "contentType": "application/pdf",
    "entityType": "profile"
  }')

PRESIGNED_URL=$(echo $RESPONSE | jq -r '.data.presignedUrl')
FILE_ID=$(echo $RESPONSE | jq -r '.data.fileId')
S3_KEY=$(echo $RESPONSE | jq -r '.data.s3Key')

echo "✅ Presigned URL received: $PRESIGNED_URL"
echo "   File ID: $FILE_ID"
echo "   S3 Key: $S3_KEY"

echo -e "\n📤 Step 2: Upload file to S3..."
curl -X PUT "$PRESIGNED_URL" \
  -H "Content-Type: application/pdf" \
  --data-binary @"$FILE_PATH"

echo -e "\n✅ File uploaded to S3"

echo -e "\n💾 Step 3: Register file in database..."
FILE_SIZE=$(stat -f%z "$FILE_PATH")  # macOS (use 'stat -c%s' on Linux)
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/files/register" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"fileId\": \"$FILE_ID\",
    \"s3Key\": \"$S3_KEY\",
    \"fileSize\": $FILE_SIZE
  }")

echo "✅ File registered successfully!"
echo $REGISTER_RESPONSE | jq '.data'
```

---

## Postman Collection Steps

1. **Environment Setup:**
   - Set `{{baseUrl}}` = `http://localhost:3001/api/v1`
   - Set `{{token}}` = Your JWT token from login

2. **Step 1 - Get Presigned URL:**
   ```
   POST {{baseUrl}}/files/presigned-url
   Headers: Authorization: Bearer {{token}}
   Body: (JSON from Step 3.1 example)
   ```
   - Extract `presignedUrl`, `fileId`, `s3Key` to environment variables

3. **Step 2 - Upload to S3:**
   ```
   PUT {{presignedUrl}}
   Headers: Content-Type: application/pdf
   Body: Select "binary" mode and choose your file
   ```

4. **Step 3 - Register File:**
   ```
   POST {{baseUrl}}/files/register
   Headers: Authorization: Bearer {{token}}
   Body: (JSON from Step 3.3 example)
   ```

---

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
7. **File Upload Testing:**
   - Test with different file types (PDF, images, documents)
   - Verify correct Content-Type headers
   - Check file size limits (MAX_FILE_SIZE in .env)
   - Verify S3 file appearance after upload
   - Test file deletion and S3 removal

---

---

## Product Field Reference

### DisplayStyle Options
The `displayStyle` field controls how products are presented:
- `Button` - Simple button/link style (default)
- `Callout` - Highlighted callout box with emphasis
- `Preview` - Rich preview with thumbnail and description

### Slug Auto-Generation
When creating a product, the API automatically generates a unique slug from the product title:
- Title: "Advanced JavaScript Mastery" → slug: "advanced-javascript-mastery"
- Title: "Web Development Guide" → slug: "web-development-guide"

**Duplicate Handling:** If a slug already exists for your store:
- First duplicate: "my-product-1"
- Second duplicate: "my-product-2"
- Pattern: Numeric suffixes are automatically appended to ensure uniqueness

**Slug Uniqueness:** Slugs are unique per creator store, allowing multiple creators to use the same slug.

---

## Date Last Updated
March 8, 2026

---