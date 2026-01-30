# Creator World Backend

A production-grade Node.js + Express.js backend API for a Stan-store like platform, built with TypeScript, PostgreSQL, Redis, and modern software engineering practices.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Caching](#caching)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

- **Type-Safe**: Full TypeScript support with strict mode
- **Production Ready**: Error handling, logging, security middleware
- **Scalable Architecture**: Repository pattern, service layer, dependency injection
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis for performance optimization
- **Authentication**: JWT-based auth with refresh tokens
- **Validation**: Request validation with Joi
- **API Versioning**: API v1 support
- **Comprehensive Logging**: Winston logger for all events
- **Testing**: Jest test suite ready
- **Security**: Helmet, CORS, rate limiting prepared
- **Code Quality**: ESLint, Prettier configured

## 📦 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 12
- Redis >= 6.0
- Git

## 🚀 Installation

### 1. Clone and Setup

```bash
cd creator-world-be
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/creator_world
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_secret_key_here
```

### 3. Database Setup

```bash
# Run migrations
npm run prisma:migrate

# Seed initial data
npm run prisma:seed
```

## 📁 Project Structure

```
creator-world-be/
├── src/
│   ├── config/              # Configuration files
│   │   ├── environment.ts   # Environment variables
│   │   ├── database.ts      # Database connection
│   │   └── redis.ts         # Redis client
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── repositories/        # Data access layer
│   │   ├── user.repository.ts
│   │   └── product.repository.ts
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   └── user.routes.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # Authentication
│   │   ├── validation.ts    # Request validation
│   │   ├── errorHandler.ts  # Error handling
│   │   └── logger.ts        # Request logging
│   ├── dto/                 # Data transfer objects
│   │   ├── user.dto.ts
│   │   └── product.dto.ts
│   ├── validators/          # Request validators
│   │   ├── user.validator.ts
│   │   └── product.validator.ts
│   ├── utils/               # Utility functions
│   │   ├── logger.ts
│   │   ├── errorHandler.ts
│   │   ├── helpers.ts       # JWT, password hashing
│   │   ├── cache.ts         # Caching utilities
│   │   └── pagination.ts
│   ├── constants/           # Constants
│   │   └── messages.ts
│   ├── app.ts               # Express app setup
│   └── index.ts             # Entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeds
├── tests/                   # Test files
├── .env.example             # Environment template
├── tsconfig.json            # TypeScript config
├── jest.config.js           # Jest config
├── .eslintrc.json           # ESLint config
├── .prettierrc.json         # Prettier config
└── package.json
```

## 🏃 Running the Server

### Development

```bash
npm run dev
```

Server will start at `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## 🔗 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201)**
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
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "I'm a creator",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Get User by ID
```http
GET /users/:id
```

#### Get All Users (Paginated)
```http
GET /users?page=1&limit=20
```

## 🗄️ Database

### Schema Overview

- **User**: Core user entity with authentication
- **Profile**: Extended user profile information
- **Creator**: Creator profile and settings
- **Product**: Products/services offered by creators
- **Order**: Customer orders
- **Subscription**: Subscription management
- **Review**: Product reviews and ratings
- **ActivityLog**: Activity tracking

### Migrations

```bash
# Create a new migration
npm run prisma:migrate -- --name migration_name

# View database in GUI
npm run prisma:studio

# Seed data
npm run prisma:seed
```

## 💾 Caching Strategy

Redis is used for:
- User data caching
- Session management
- Rate limiting
- API response caching

### Cache Usage Example

```typescript
import { cacheGetOrSet } from '@utils/cache';

const user = await cacheGetOrSet(
  `user:${userId}`,
  () => fetchUserFromDB(userId),
  3600 // 1 hour TTL
);
```

## 🔐 Authentication

JWT-based authentication with:
- Access token (expires in 24 hours)
- Refresh token (expires in 7 days)
- Token validation middleware
- Password hashing with bcrypt

### Protected Routes

Add `@authMiddleware` to protect routes:

```typescript
router.get('/profile', authMiddleware, controller.getProfile);
```

## ⚠️ Error Handling

Centralized error handling with:
- Custom `AppError` class
- Error middleware
- Structured error responses
- Winston logging

### Error Response Format

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

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Coverage report
npm test:coverage
```

## 👨‍💻 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### Adding New Features

1. Create DTOs in `src/dto/`
2. Create validators in `src/validators/`
3. Create repository in `src/repositories/`
4. Create service in `src/services/`
5. Create controller in `src/controllers/`
6. Create routes in `src/routes/`
7. Add route to `src/app.ts`

## 🚢 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/creator_world
REDIS_HOST=redis.host
REDIS_PORT=6379
JWT_SECRET=your_super_secure_secret_key
```

### Docker (Optional)

```bash
docker build -t creator-world-be .
docker run -p 3001:3001 creator-world-be
```

### GitHub Actions CI/CD

CI/CD workflows are configured in `.github/workflows/`

## 📚 Best Practices Implemented

- ✅ Repository Pattern for data access
- ✅ Service layer for business logic
- ✅ DTOs for type safety
- ✅ Request validation with Joi
- ✅ Error handling middleware
- ✅ Centralized logging
- ✅ Caching strategy
- ✅ Environment-based configuration
- ✅ Dependency injection
- ✅ Type safety with TypeScript
- ✅ Security middleware (Helmet, CORS)
- ✅ API versioning
- ✅ Request/response formatting
- ✅ Pagination
- ✅ Code linting and formatting

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For support, email support@creatorworld.com or open an issue on GitHub.

---

**Built with ❤️ using Node.js, Express, and TypeScript**
