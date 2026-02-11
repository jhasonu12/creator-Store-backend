# Creator World Backend - Documentation Index

## 📚 Essential Documentation

### Getting Started
- **[README.md](./README.md)** - Project overview, features, and setup
- **[QUICK_START_SEQUELIZE.md](./QUICK_START_SEQUELIZE.md)** - 5-minute quick start guide

### Sequelize Migration (Completed Feb 11, 2026)
- **[SEQUELIZE_MIGRATION_GUIDE.md](./SEQUELIZE_MIGRATION_GUIDE.md)** - Complete migration guide with Prisma vs Sequelize differences
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Detailed summary of all changes made
- **[MIGRATION_VERIFICATION.md](./MIGRATION_VERIFICATION.md)** - Migration verification checklist

### Development & Architecture
- **[PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)** - System architecture and design patterns
- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Complete API endpoint documentation
- **[CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md)** - Code style and conventions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment and production setup

## 🗂️ Project Structure

```
creator-world-be/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Sequelize initialization
│   │   ├── environment.ts
│   │   ├── redis.ts
│   │   └── sequelize-config.js
│   ├── models/           # Sequelize models (12 models)
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic layer
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── validators/       # Input validation
│   ├── dto/              # Data transfer objects
│   ├── utils/            # Utility functions
│   ├── constants/        # Constants
│   ├── app.ts            # Express app setup
│   └── index.ts          # Entry point
├── src/migrations/       # Database migrations (12 files)
├── src/seeders/          # Database seeders
├── tests/                # Test files
├── .sequelizerc           # Sequelize CLI config
├── package.json
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🚀 Quick Commands

```bash
# Setup & Installation
npm install                 # Install dependencies
npm run db:migrate         # Run database migrations
npm run db:seed            # Seed database with sample data

# Development
npm run dev                # Start development server with hot reload
npm run build              # Compile TypeScript
npm run type-check         # Type checking

# Database
npm run db:migrate:undo    # Rollback last migration
npm run db:seed            # Run seeders

# Code Quality
npm run lint               # ESLint check
npm run lint:fix           # Fix ESLint issues
npm run format             # Format with Prettier
npm run format:check       # Check formatting

# Testing
npm test                   # Run tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report

# Production
npm run build              # Build for production
npm start                  # Run production build
```

## 🗄️ Database

**ORM**: Sequelize ^6.35.2
**Database**: PostgreSQL
**Tables**: 12 (Users, Products, Orders, Reviews, Subscriptions, etc.)

### Database Setup
```bash
# Create database
createdb creator_world

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

## 🔐 Configuration

### Environment Variables (.env)
```
NODE_ENV=development
PORT=3001
API_VERSION=v1

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=creator_world

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h
```

See [.env.example](./.env.example) for all available options.

## 📖 Model Definitions

Models are defined in `src/models/`:
- **User** - User accounts with verification
- **Profile** - Extended user profile
- **Creator** - Creator profile with earnings
- **Product** - Products/services
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Payment** - Payment records
- **Review** - Product reviews
- **Subscriber** - Subscription relationships
- **Subscription** - Paid subscriptions
- **SubscriptionTier** - Tier definitions
- **ActivityLog** - Audit trail

## 🔗 API Versioning

All endpoints are under `/api/v1/`:
- `http://localhost:3001/api/v1/auth`
- `http://localhost:3001/api/v1/users`
- `http://localhost:3001/api/v1/products`

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🐳 Docker

### Build Image
```bash
docker build -t creator-world-be .
```

### Run with Docker Compose
```bash
docker-compose up
```

## 📋 Recent Changes

### Sequelize Migration (Feb 11, 2026)
- ✅ Migrated from Prisma to Sequelize
- ✅ Created 13 TypeScript models
- ✅ Created 12 database migrations
- ✅ Updated all repositories
- ✅ Cleaned up project files
- ✅ Updated documentation

### Removed Files
- Old documentation files (outdated)
- Test API script
- Logs and build directories
- Prisma configuration

## 🤝 Contributing

1. Read [CODE_STYLE_GUIDE.md](./CODE_STYLE_GUIDE.md)
2. Follow the established patterns
3. Create migrations for database changes
4. Write tests for new features
5. Keep documentation updated

## 📞 Support

- **Architecture**: See [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)
- **API Docs**: See [API_ENDPOINTS.md](./API_ENDPOINTS.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Migration Guide**: See [SEQUELIZE_MIGRATION_GUIDE.md](./SEQUELIZE_MIGRATION_GUIDE.md)

---

**Last Updated**: February 11, 2026
**Status**: Production Ready
**ORM**: Sequelize
**Database**: PostgreSQL
