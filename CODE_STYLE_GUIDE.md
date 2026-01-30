# Code Style Guide

## TypeScript

### Naming Conventions

#### Files
- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Repositories: `*.repository.ts`
- Routes: `*.routes.ts`
- DTOs: `*.dto.ts`
- Validators: `*.validator.ts`

#### Classes
```typescript
// PascalCase for classes
export class UserService { }
export class ProductRepository { }
export class AuthController { }
```

#### Functions
```typescript
// camelCase for functions
export function hashPassword(password: string): Promise<string> { }
export const validateEmail = (email: string): boolean => { };
```

#### Constants
```typescript
// UPPER_SNAKE_CASE for constants
export const MAX_FILE_SIZE = 52428800;
export const DEFAULT_PAGE_SIZE = 20;
```

#### Variables
```typescript
// camelCase for variables
const userId = req.user.id;
let totalPrice = 0;
```

### Type Annotations

```typescript
// Always specify return types
export async function getUser(id: string): Promise<User | null> {
  // ...
}

// Always type parameters
function processData(data: UserDTO, options: ProcessOptions): void {
  // ...
}

// Use interfaces for objects
interface User {
  id: string;
  email: string;
  name: string;
}

// Use enums for fixed values
enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
```

## Code Organization

### Import Order
```typescript
// 1. External dependencies
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// 2. Internal modules with aliases
import { UserService } from '@services/user.service';
import { logger } from '@utils/logger';
import { AppError } from '@utils/errorHandler';

// 3. Constants
import { RESPONSE_MESSAGES } from '@constants/messages';
```

### Class Organization
```typescript
export class UserService {
  // 1. Private properties
  private repository = new UserRepository();
  private cache = new CacheService();

  // 2. Constructor
  constructor() { }

  // 3. Public methods
  public async getUser(id: string): Promise<UserDTO> { }

  // 4. Protected methods
  protected validateUser(user: User): boolean { }

  // 5. Private methods
  private toDTO(user: User): UserDTO { }
}
```

### Method Organization
```typescript
export class UserController {
  private service = new UserService();

  // Public methods follow HTTP verb naming
  getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Implementation
  });

  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Implementation
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Implementation
  });

  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Implementation
  });
}
```

## Code Style Rules

### Strings
```typescript
// Use single quotes
const message = 'User not found';
const path = '/api/v1/users';

// Use template literals for interpolation
const message = `User ${userId} not found`;
```

### Line Length
```typescript
// Maximum 100 characters per line
// Break long lines appropriately
const result = await userRepository.findByEmailWithRelations(
  email,
  { include: { profile: true, orders: true } }
);
```

### Comments
```typescript
// Single line comments for clarification
const count = users.length; // Total user count

// Multi-line comments for complex logic
/**
 * Validates user email format
 * @param email - Email to validate
 * @returns true if valid, false otherwise
 */
function validateEmail(email: string): boolean {
  // Implementation
}

// JSDoc comments for exported functions
/**
 * Creates a new user in the database
 * 
 * @param dto - User data transfer object
 * @returns Created user response DTO
 * @throws {AppError} If user already exists
 */
export async function createUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
  // Implementation
}
```

### Error Handling
```typescript
// Always use AppError for business logic errors
if (!user) {
  throw new AppError(404, 'User not found');
}

// Log errors properly
catch (error) {
  logger.error('Failed to fetch user', { userId, error });
  throw new AppError(500, 'Internal server error');
}
```

### Async/Await
```typescript
// Always use async/await instead of .then()
async function processUser(userId: string): Promise<void> {
  const user = await userRepository.findById(userId);
  await userService.updateProfile(user.id);
}

// Not: 
// userRepository.findById(userId).then(...).catch(...)
```

### Arrow Functions vs Function Declarations
```typescript
// Use arrow functions for class methods and callbacks
class Service {
  private method = async (id: string): Promise<void> => {
    // Implementation
  };
}

// Use function declarations for standalone functions
export async function helper(value: string): Promise<string> {
  // Implementation
}
```

## Express Patterns

### Routes
```typescript
import { Router } from 'express';
import { UserController } from '@controllers/user.controller';
import { authMiddleware } from '@middleware/auth';

const router = Router();
const controller = new UserController();

/**
 * @route GET /users/:id
 * @description Get user by ID
 * @access Public
 */
router.get('/:id', controller.getUser);

/**
 * @route POST /users
 * @description Create new user
 * @access Private
 */
router.post('/', authMiddleware, controller.createUser);

export default router;
```

### Controllers
```typescript
import { asyncHandler, sendResponse } from '@utils/errorHandler';

export class UserController {
  private service = new UserService();

  getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.getUser(req.params.id);
    sendResponse(res, 200, 'User fetched', user);
  });
}
```

## Validation

### Joi Schemas
```typescript
// Group validation schemas by feature
export const createUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().optional(),
  }),
});

// Use in routes
router.post(
  '/',
  validateRequest(createUserSchema),
  controller.createUser
);
```

## Database Queries

### Prisma Usage
```typescript
// Use select for specific fields
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    username: true,
    profile: true,
  },
});

// Use include for relations
const order = await prisma.order.findUnique({
  where: { id },
  include: { items: true, user: { select: { email: true } } },
});

// Pagination
const { skip, take } = getPaginationParams(page, limit);
const [users, total] = await Promise.all([
  prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
  prisma.user.count(),
]);
```

## Testing

### Test File Structure
```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
    service = new UserService(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user by id', async () => {
      // Arrange
      const userId = 'test-id';
      const mockUser = { id: userId, email: 'test@test.com' };
      jest.spyOn(repository, 'findById').mockResolvedValue(mockUser);

      // Act
      const result = await service.getUser(userId);

      // Assert
      expect(result).toEqual(mockUser);
      expect(repository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error if user not found', async () => {
      // Arrange
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUser('invalid-id')).rejects.toThrow('User not found');
    });
  });
});
```

## Documentation

### README Structure
```markdown
# Project Name

## Features
- Feature 1
- Feature 2

## Installation
1. Step 1
2. Step 2

## Usage
```

### Code Comments
```typescript
// Only comment complex logic
// Simple, self-documenting code doesn't need comments

// ❌ Avoid obvious comments
const age = 25; // User's age

// ✅ Comment complex business logic
// Calculate discount: 10% for high volume, 5% for regular
const discount = totalQuantity > 100 ? 0.1 : 0.05;
```

## Linting Rules

Enforced by ESLint:
- No `console.log` (use logger instead)
- No unused variables
- Single quotes for strings
- Semicolons required
- 2-space indentation
- No `any` types (use strict typing)

Run: `npm run lint:fix` to auto-fix violations

---

**Key Principle**: Write code as if someone else needs to understand it in 6 months.
