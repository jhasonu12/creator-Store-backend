# PROJECT ARCHITECTURE

## Overview
Creator World Backend is built following enterprise-level software engineering patterns and best practices for scalability, maintainability, and production readiness.

## Architecture Pattern: Layered (N-Tier) Architecture

### Layer 1: Presentation Layer (Routes & Controllers)
- Express.js routes define API endpoints
- Controllers handle HTTP requests/responses
- Request validation at middleware level
- Response formatting standardized

### Layer 2: Application/Business Logic Layer (Services)
- Services contain core business logic
- Orchestrate repository calls
- Handle business rule validation
- Implement caching strategy

### Layer 3: Data Access Layer (Repositories)
- Repositories abstract database operations
- Use Prisma ORM for type-safe queries
- Single responsibility per repository
- Reusable query methods

### Layer 4: Database Layer
- PostgreSQL for persistent storage
- Prisma as ORM
- Redis for caching and sessions

## Directory Structure Rationale

```
src/
├── config/                    # Centralized configuration
│   ├── environment.ts        # Environment variables
│   ├── database.ts           # Database client singleton
│   └── redis.ts              # Redis client singleton
│
├── controllers/              # HTTP request handlers
│   └── *.controller.ts       # One controller per feature
│
├── services/                 # Business logic
│   └── *.service.ts          # One service per feature
│
├── repositories/             # Data access layer
│   └── *.repository.ts       # One repository per entity
│
├── routes/                   # API endpoint definitions
│   └── *.routes.ts           # One routes file per feature
│
├── middleware/               # Express middleware
│   ├── auth.ts              # Authentication
│   ├── errorHandler.ts      # Error handling
│   ├── validation.ts        # Request validation
│   └── logger.ts            # Request logging
│
├── dto/                      # Data transfer objects
│   └── *.dto.ts              # Type-safe request/response
│
├── validators/               # Joi validation schemas
│   └── *.validator.ts        # Input validation
│
├── utils/                    # Utility functions
│   ├── logger.ts            # Winston logger
│   ├── errorHandler.ts      # Error classes
│   ├── helpers.ts           # JWT, hashing utilities
│   ├── cache.ts             # Redis caching
│   └── pagination.ts        # Pagination helpers
│
├── constants/                # Application constants
│   └── messages.ts          # Standard messages
│
└── models/                   # (Future) TypeORM or similar
```

## Data Flow Example: User Registration

```
HTTP Request
    ↓
POST /auth/register
    ↓
Routes (auth.routes.ts)
    ↓ validateRequest middleware
Validation (user.validator.ts)
    ↓
Controller (auth.controller.ts)
    ↓ calls
Service (auth.service.ts)
    ↓ calls
Repository (user.repository.ts)
    ↓ calls
Prisma
    ↓
PostgreSQL
    ↓
Response (formatted JSON)
```

## Key Design Patterns

### 1. Dependency Injection (Simple Pattern)
```typescript
// Controllers instantiate services
class AuthController {
  private authService = new AuthService();
}

// Services instantiate repositories
class AuthService {
  private userRepository = new UserRepository();
}

// Can be upgraded to DI container (InversifyJS, etc.)
```

### 2. Repository Pattern
```typescript
// Abstracts data access
class UserRepository {
  async findById(id: string): Promise<User | null> { }
  async create(data: CreateUserDTO): Promise<User> { }
  async update(id: string, data: UpdateUserDTO): Promise<User> { }
}

// Service uses repository
class UserService {
  constructor(private repo = new UserRepository()) { }
}
```

### 3. Service Layer Pattern
```typescript
// Business logic separated from HTTP concerns
class UserService {
  async registerUser(dto: CreateUserDTO): Promise<any> {
    // All business logic here
    // Can be reused for different delivery mechanisms
  }
}
```

### 4. Data Transfer Objects (DTOs)
```typescript
// Separate API contracts from database models
interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
}

interface UserResponseDTO {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}
```

### 5. Validation Pipeline
```typescript
// Joi schemas for validation
const createUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// Middleware applies validation
router.post('/', validateRequest(createUserSchema), controller.create);
```

### 6. Error Handling
```typescript
// Centralized AppError
throw new AppError(400, 'User not found', true);

// Caught by error middleware
// Formatted and logged automatically
```

### 7. Caching Strategy
```typescript
// Redis cache for performance
const user = await cacheGetOrSet(
  `user:${userId}`,
  () => repository.findById(userId),
  3600
);
```

## Scalability Considerations

### Horizontal Scaling
- Stateless services (tokens stored client-side)
- Redis for shared session data
- Database connection pooling configured
- Load balancer friendly

### Database Optimization
- Indexes on frequently queried fields
- Connection pooling (min: 2, max: 10)
- Migrations tracked with Prisma
- N+1 query prevention with includes

### Caching Strategy
- User data cached for 1 hour
- Invalidated on updates
- Pattern-based cache clearing
- Configurable TTL per entity

### Code Performance
- Pagination for large datasets
- Selective field queries
- Lazy loading where applicable
- Indexed searches

## Security Implementation

### Authentication
- JWT with expiration
- Refresh token rotation
- Secure password hashing (bcrypt)
- Token validation middleware

### Input Validation
- Joi schemas for all inputs
- Type safety with TypeScript
- SQL injection prevention via Prisma
- XSS prevention via JSON responses

### Security Middleware
- Helmet.js for security headers
- CORS configuration
- Rate limiting ready
- HTTPS enforced in production

### Environment Security
- Sensitive data in environment variables
- .env file never committed
- Secrets rotated regularly
- Production credentials never in code

## Monitoring & Observability

### Logging
- Winston logger configured
- Request/response logging
- Error logging with stack traces
- Activity logging to database

### Health Checks
- /health endpoint
- Database connectivity
- Redis connectivity
- Service dependencies

## Testing Strategy

### Unit Tests
- Service layer logic
- Repository queries
- Utility functions
- Error handling

### Integration Tests
- API endpoints
- Database operations
- Redis caching
- Authentication flow

### Test Coverage Goals
- 70% overall coverage
- Controllers: 80%
- Services: 80%
- Utils: 90%

## Future Enhancements

### Phase 1 (Current)
- Core authentication
- User management
- Basic product/order structure
- Redis caching

### Phase 2
- Payment integration (Stripe)
- Email notifications
- File uploads (S3)
- Advanced search

### Phase 3
- WebSocket support
- Real-time notifications
- Analytics
- Admin dashboard API

### Phase 4
- GraphQL layer
- Machine learning recommendations
- Advanced metrics
- Distributed tracing

## CI/CD Pipeline

### GitHub Actions Workflow
1. **Build**: Install dependencies
2. **Lint**: Check code quality
3. **Type Check**: TypeScript validation
4. **Build**: Compile to JavaScript
5. **Test**: Run test suite
6. **Security**: Vulnerability scanning
7. **Deploy**: (on main branch)

## Deployment Strategy

### Local Development
- `npm run dev` with hot reload
- Prisma Studio for database
- Redis running locally
- .env with local config

### Staging
- Docker containers
- Real database instance
- Real Redis instance
- Same env config as production

### Production
- Docker containers on Kubernetes
- Managed database service
- Redis cluster
- Environment-specific secrets
- CI/CD auto-deployment

## Performance Metrics

### Target Response Times
- Simple queries: < 50ms
- Complex queries: < 200ms
- External calls: < 1s
- P95: < 500ms

### Throughput
- 1000+ req/s per instance
- Horizontal scaling: n × 1000
- Database: connection pooling

### Caching Hit Rates
- User data: 80%+
- Product data: 70%+
- Overall: 60%+

## Maintenance Guidelines

### Code Reviews
- Peer review required
- Architecture compliance check
- Security review
- Performance impact analysis

### Version Management
- Semantic versioning
- Changelog maintained
- Breaking changes documented
- Deprecation period

### Documentation
- README for setup
- API documentation
- Architecture docs (this file)
- Code comments for complex logic

---

This architecture ensures the project can scale from startup to enterprise, maintain code quality, and adapt to changing requirements while following established software engineering best practices.
