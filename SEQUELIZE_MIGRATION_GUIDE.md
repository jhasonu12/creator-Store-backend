# Prisma to Sequelize Migration Guide

## Overview
This project has been successfully migrated from Prisma ORM to Sequelize ORM. This document outlines the changes and how to get started.

## What Changed

### 1. **Dependencies**
- **Removed**: `@prisma/client`, `prisma`
- **Added**: `sequelize`, `pg`, `pg-hstore`, `sequelize-cli`

### 2. **Database Configuration**
- **Old**: Single `DATABASE_URL` environment variable
- **New**: Individual database configuration variables:
  ```
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  DATABASE_USER=postgres
  DATABASE_PASSWORD=password
  DATABASE_NAME=creator_world
  ```

### 3. **Models**
- **Old**: Models defined in `schema.prisma`, auto-generated types in `@prisma/client`
- **New**: Model definitions in TypeScript files under `src/models/`
  - `src/models/User.ts`
  - `src/models/Profile.ts`
  - `src/models/Creator.ts`
  - `src/models/Product.ts`
  - `src/models/Order.ts`
  - `src/models/OrderItem.ts`
  - `src/models/Payment.ts`
  - `src/models/Review.ts`
  - And more...

### 4. **Repositories**
- **Old**: Using Prisma client methods (`prisma.user.findUnique()`, `prisma.user.create()`, etc.)
- **New**: Using Sequelize methods (`User.findByPk()`, `User.create()`, etc.)

### 5. **Database Initialization**
- **Old**: `getPrismaClient()` from `@config/database`
- **New**: `getSequelizeInstance()` from `@config/database`

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

### 3. Run Database Migrations
```bash
# Create database tables
npm run db:migrate

# (Optional) Seed the database
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Available Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only --prefer-ts-exts src/index.ts",
  "build": "tsc",
  "start": "node dist/src/index.js",
  "db:migrate": "sequelize-cli db:migrate",
  "db:migrate:undo": "sequelize-cli db:migrate:undo",
  "db:seed": "sequelize-cli db:seed:all",
  "lint": "eslint src --ext .ts",
  "test": "jest"
}
```

## Key Differences: Prisma vs Sequelize

### Finding Records
```typescript
// Prisma
const user = await prisma.user.findUnique({ where: { id } });

// Sequelize
const user = await User.findByPk(id);
```

### Creating Records
```typescript
// Prisma
const user = await prisma.user.create({ data: { email, username, password } });

// Sequelize
const user = await User.create({ email, username, password });
```

### Updating Records
```typescript
// Prisma
const user = await prisma.user.update({ where: { id }, data: { firstName } });

// Sequelize
const user = await User.findByPk(id);
await user.update({ firstName });
```

### Querying with Filters
```typescript
// Prisma
const users = await prisma.user.findMany({
  where: { status: 'active' },
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' }
});

// Sequelize
const users = await User.findAll({
  where: { status: 'active' },
  offset: 0,
  limit: 10,
  order: [['createdAt', 'DESC']]
});
```

### Relationships
```typescript
// Prisma
const user = await prisma.user.findUnique({
  where: { id },
  include: { profile: true, orders: true }
});

// Sequelize
const user = await User.findByPk(id, {
  include: ['profile', 'orders']
});
```

## Database Schema

The database includes the following tables:
- **users** - User accounts
- **profiles** - User profile information
- **creators** - Creator profile data
- **products** - Products/services
- **orders** - Customer orders
- **order_items** - Line items in orders
- **payments** - Payment records
- **reviews** - Product reviews
- **subscribers** - Subscription relationships
- **subscriptions** - Paid subscriptions
- **subscription_tiers** - Subscription tier definitions
- **activity_logs** - Audit trail

## API Integration

The API endpoints remain the same. The backend services layer handles all database operations transparently:

```typescript
// Controllers use services (services layer unchanged)
const user = await userService.getUserById(userId);

// Services use repositories (repositories updated to use Sequelize)
const user = await userRepository.findById(userId);

// Repositories use Sequelize models
const user = await User.findByPk(userId);
```

## Environment Configuration

Create a `.env` file with:
```
NODE_ENV=development
PORT=3001
API_VERSION=v1

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=creator_world
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your_secret_key
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists or create it: `createdb creator_world`

### Migration Issues
```bash
# Undo last migration
npm run db:migrate:undo

# Check migration status
sequelize-cli db:migrate:status
```

### Model Association Issues
- Associations are defined in `src/models/index.ts`
- Ensure models are initialized before associations are set up
- Use eager loading with `include` in Sequelize queries

## Next Steps

1. Test all API endpoints
2. Run the test suite: `npm test`
3. Build for production: `npm run build`
4. Deploy with: `npm start`

## Reference Links

- [Sequelize Documentation](https://sequelize.org/)
- [Sequelize CLI](https://github.com/sequelize/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
