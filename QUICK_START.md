# Creator World Backend - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your local PostgreSQL and Redis connections
```

### 3. Initialize Database
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs at: `http://localhost:3001/api/v1`

## Testing the API

### Register User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'
```

### Get Profile (Replace TOKEN with jwt)
```bash
curl -X GET http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure Explanation

- **config/**: Database, Redis, and environment configuration
- **controllers/**: Handle HTTP requests and responses
- **services/**: Contain business logic
- **repositories/**: Interact with database via Prisma
- **routes/**: Define API endpoints
- **middleware/**: Auth, validation, error handling, logging
- **dto/**: Data transfer objects for type safety
- **utils/**: Helper functions and utilities
- **validators/**: Request validation schemas

## Key Commands

```bash
npm run dev              # Development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm start                # Run production build
npm test                 # Run tests
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run prisma:studio   # Open Prisma GUI
```

## Folder Structure for Adding Features

When adding a new feature (e.g., Products), create:

```
src/
├── dto/products.dto.ts           # Product data structures
├── validators/products.validator.ts # Input validation
├── repositories/product.repository.ts # Database operations
├── services/product.service.ts   # Business logic
├── controllers/product.controller.ts # HTTP handlers
└── routes/product.routes.ts      # API endpoints
```

Then import routes in `src/app.ts`:
```typescript
import productRoutes from '@routes/product.routes';
app.use(`/api/v1/products`, productRoutes);
```

## Important Notes

- All routes are versioned (`/api/v1`)
- Protected routes require `Authorization: Bearer <token>` header
- Responses follow a standard format (see README.md)
- Caching is automatic via Redis
- Logging includes all API requests and errors

## Troubleshooting

**Database connection failed**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env

**Redis connection failed**
- Ensure Redis is running
- Check REDIS_HOST and REDIS_PORT in .env

**Port already in use**
- Change PORT in .env or: `PORT=3002 npm run dev`

**JWT errors**
- Update JWT_SECRET in .env
- Ensure token is passed correctly in Authorization header
