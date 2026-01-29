---
title: "Code Standards: TypeScript Guidelines, File Structure & Error Codes | AI App Factory Tutorial"
sidebarTitle: "Code Standards"
subtitle: "Code Standards: TypeScript Guidelines, File Structure & Error Codes"
description: "Learn TypeScript coding standards, file structure, comment requirements, and error code system for AI App Factory generated code. Covers general standards, TypeScript rules, frontend/backend guidelines, Prisma standards, comment styles, and unified error code system."
tags:
  - "Appendix"
  - "Code Standards"
  - "TypeScript"
  - "Error Codes"
prerequisite:
  - "start-init-project"
order: 230
---

# Code Standards: TypeScript Guidelines, File Structure & Error Codes

## What You'll Learn

- ✅ Understand the coding standards that AI App Factory generated code must follow
- ✅ Master TypeScript types and naming conventions
- ✅ Learn the file structure and organization of frontend and backend code
- ✅ Understand how to use the unified error code system

## Core Concept

AI App Factory generated code must follow unified coding standards to ensure consistent code quality, maintainability, and readability. These standards cover general formatting, TypeScript type system, frontend/backend architecture design, comment style, and error handling mechanisms.

**Why do we need coding standards?**

- **Consistency**: All Agent-generated code has a unified style, reducing learning costs
- **Maintainability**: Clear naming and structure make subsequent modifications easier
- **Readability**: Standardized code allows team members to quickly understand intentions
- **Security**: Strict type system and error handling reduce runtime errors

---

## 1. General Standards

### 1.1 Language and Formatting

| Item | Standard |
|------|----------|
| Language | TypeScript (strict mode) |
| Indentation | 2 spaces |
| Line Endings | LF (Unix) |
| Encoding | UTF-8 |
| Max Line Length | 100 characters (code), 80 characters (comments) |
| Semicolons | Required |
| Quotes | Single quotes (strings), Double quotes (JSX attributes) |

### 1.2 Naming Conventions

| Type | Style | Example |
|------|-------|---------|
| Filename (regular) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| Filename (component) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| Filename (test) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| Variables | camelCase | `userName`, `isLoading` |
| Functions | camelCase | `getUserById`, `formatDate` |
| Classes/Interfaces/Types | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| Constants | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| Private properties | No underscore prefix | Use TypeScript private keyword |
| Boolean variables | is/has/can prefix | `isActive`, `hasPermission`, `canEdit` |
| Event handlers | handle prefix | `handleClick`, `handleSubmit` |
| Hooks | use prefix | `useItems`, `useAuth` |

::: tip Naming Tips
Good naming should be **self-explanatory**, without needing extra comments to explain purpose. For example, `isValid` is clearer than `check`, and `getUserById` is more specific than `getData`.
:::

### 1.3 File Organization

**Single responsibility per file**:
- One component per file
- One service per file
- Related types can be placed in the same types.ts file

**Import order**:
```typescript
// 1. Node.js built-in modules
import path from 'path';

// 2. External dependencies
import express from 'express';
import { z } from 'zod';

// 3. Internal modules (absolute paths)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. Relative path imports
import { UserService } from './userService';
import type { User } from './types';
```

---

## 2. TypeScript Standards

### 2.1 Type Definitions

**Prefer interface for object types**:
```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ Avoid (unless you need union types or mapped types)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Define types for all public APIs**:
```typescript
// ✅ Good
interface CreateUserDto {
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

function createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
  // ...
}

// ❌ Avoid
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 Type Assertions

::: warning Prohibit any
Generated code **strictly prohibits** using `any` type. Must use `unknown` and add type guards.
:::

**Avoid using `any`**:
```typescript
// ✅ Good
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data is inferred as User
}

// ❌ Avoid
const data: any = JSON.parse(text);
```

**Use type guards**:
```typescript
// ✅ Good
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ Avoid
const user = data as User; // Unsafe assertion
```

### 2.3 Generics

**Use meaningful names for generic parameters**:
```typescript
// ✅ Good
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ Avoid
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## 3. Backend Standards

### 3.1 Express Routes

**Use Router to organize routes**:
```typescript
// ✅ Good
// src/routes/items.ts
import { Router } from 'express';
import { itemController } from '@/controllers/item';
import { validateRequest } from '@/middleware/validation';
import { createItemSchema, updateItemSchema } from '@/validators/item';

const router = Router();

router.get('/', itemController.list);
router.get('/:id', itemController.getById);
router.post('/', validateRequest(createItemSchema), itemController.create);
router.put('/:id', validateRequest(updateItemSchema), itemController.update);
router.delete('/:id', itemController.remove);

export default router;
```

**RESTful naming**:
```typescript
// ✅ Good
GET    /api/items         // List
GET    /api/items/:id     // Detail
POST   /api/items         // Create
PUT    /api/items/:id     // Update
DELETE /api/items/:id     // Delete

// ❌ Avoid
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 Controllers

**Keep controllers concise**:
```typescript
// ✅ Good
export const itemController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await itemService.findAll();
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await itemService.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },
};
```

### 3.3 Service Layer

**Business logic in service layer**:
```typescript
// ✅ Good
// src/services/item.ts
export const itemService = {
  async findAll() {
    return prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new AppError(404, 'Item not found');
    }
    return item;
  },

  async create(data: CreateItemDto) {
    return prisma.item.create({ data });
  },
};
```

### 3.4 Error Handling

**Use unified error class**:
```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Usage
throw new AppError(404, 'Item not found');
throw new AppError(400, 'Validation failed', errors);
```

**Global error handling middleware**:
```typescript
// src/middleware/errorHandler.ts
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        details: error.details,
      },
    });
  }

  // Hide internal errors in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message;

  res.status(500).json({
    success: false,
    error: { message },
  });
}
```

---

## 4. Frontend Standards

### 4.1 Component Structure

**Function component format**:
```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // ...
  },
  text: {
    // ...
  },
});
```

### 4.2 Hook Standards

**Custom hooks return objects**:
```typescript
// ✅ Good
export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    // ...
  };

  const create = async (data: CreateItemDto) => {
    // ...
  };

  return {
    items,
    loading,
    error,
    refresh,
    create,
  };
}
```

### 4.3 Style Standards

**Use StyleSheet**:
```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// ❌ Avoid inline styles
<View style={{ flex: 1, padding: 16 }}>
```

**Use theme system**:
```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#2563eb',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    background: '#ffffff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },
};
```

### 4.4 Navigation

**Type-safe navigation parameters**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Create: undefined;
};

// Usage
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: 1 });
```

---

## 5. Prisma Standards

### 5.1 Schema Definition

**Model naming uses PascalCase singular**:
```prisma
// ✅ Good
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5.2 Query Standards

**Use select to limit returned fields**:
```typescript
// ✅ Good (only return needed fields)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Avoid (return all fields including sensitive information)
const users = await prisma.user.findMany();
```

---

## 6. Comment Standards

### 6.1 When to Add Comments

**Scenarios that need comments**:
- Complex business logic
- Non-obvious design decisions
- Reasons for performance optimizations
- Public API interfaces

**Scenarios that don't need comments**:
- Self-explanatory code
- Simple getter/setter
- Obvious implementations

### 6.2 Comment Format

```typescript
// ✅ Good - explain why
// Use optimistic updates to improve user experience, rollback on failure
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // Rollback
    throw new Error('Update failed');
  }
};

// ❌ Avoid - explain what (code already explains)
// Set items
setItems(newItems);
```

::: tip Comment Principle
Comments should explain **why** rather than **what**. Good code should be self-explanatory, and comments only supplement information not directly visible from the code.
:::

---

## 7. Error Code Standards

### 7.1 Error Code Structure

**Format definition**:
```
[Business_Module]_[Error_Type]_[Specific_Error]

Example: AUTH_VALIDATION_INVALID_EMAIL
```

**Naming conventions**:
- **All uppercase**: Use SCREAMING_SNAKE_CASE
- **Business module**: 2-4 characters, representing functional module (e.g., AUTH, USER, ITEM)
- **Error type**: Generic error type (e.g., VALIDATION, NOT_FOUND, FORBIDDEN)
- **Specific error**: Detailed description (optional)

### 7.2 Standard Error Types

#### 1. Validation Errors (VALIDATION)

**HTTP Status Code**: 400

| Error Code | Description | Example Scenario |
|------------|-------------|------------------|
| `[MODULE]_VALIDATION_REQUIRED` | Missing required field | Title not provided when creating |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | Incorrect format | Email format error |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | Out of range | amount < 0 or > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | Duplicate value | Email already exists |

**Examples**:
```typescript
AUTH_VALIDATION_REQUIRED       // Missing required field
AUTH_VALIDATION_INVALID_EMAIL  // Email format error
ITEM_VALIDATION_OUT_OF_RANGE   // Amount out of range
```

#### 2. Not Found Errors (NOT_FOUND)

**HTTP Status Code**: 404

| Error Code | Description | Example Scenario |
|------------|-------------|------------------|
| `[MODULE]_NOT_FOUND` | Resource does not exist | Queried ID does not exist |
| `[MODULE]_ROUTE_NOT_FOUND` | Route does not exist | Accessing undefined endpoint |

**Examples**:
```typescript
ITEM_NOT_FOUND   // Item ID does not exist
USER_NOT_FOUND   // User ID does not exist
```

#### 3. Permission Errors (FORBIDDEN / UNAUTHORIZED)

**HTTP Status Code**: 401 (unauthenticated), 403 (no permission)

| Error Code | Description | Example Scenario |
|------------|-------------|------------------|
| `AUTH_UNAUTHORIZED` | Not logged in or invalid token | JWT expired |
| `[MODULE]_FORBIDDEN` | No permission to access | Attempting to access others' data |

**Examples**:
```typescript
AUTH_UNAUTHORIZED     // Token expired or missing
ITEM_FORBIDDEN        // Attempting to delete others' Item
```

#### 4. Conflict Errors (CONFLICT)

**HTTP Status Code**: 409

| Error Code | Description | Example Scenario |
|------------|-------------|------------------|
| `[MODULE]_CONFLICT_DUPLICATE` | Resource conflict | Creating existing resource |
| `[MODULE]_CONFLICT_STATE` | State conflict | Operation doesn't match current state |

**Examples**:
```typescript
USER_CONFLICT_DUPLICATE   // Email already registered
ITEM_CONFLICT_STATE       // Completed project cannot be deleted
```

#### 5. Server Errors (INTERNAL_ERROR)

**HTTP Status Code**: 500

| Error Code | Description | Example Scenario |
|------------|-------------|------------------|
| `INTERNAL_ERROR` | Unknown internal error | Database connection failed |
| `DATABASE_ERROR` | Database error | Prisma query failed |
| `EXTERNAL_SERVICE_ERROR` | External service error | Third-party API failed |

**Examples**:
```typescript
INTERNAL_ERROR             // Generic server error
DATABASE_ERROR             // Database operation failed
EXTERNAL_SERVICE_ERROR     // Third-party API call failed
```

#### 6. Rate Limit Errors (RATE_LIMIT)

**HTTP Status Code**: 429

| Error Code | Description | Example Scenario |
|------------|-------------|------------------|
| `RATE_LIMIT_EXCEEDED` | Exceeded request frequency limit | More than 100 requests in 1 minute |

### 7.3 Error Response Format

**Standard response structure**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Error code
    message: string;        // User-friendly error message
    details?: unknown;      // Detailed information (optional, development only)
    timestamp?: string;     // Timestamp (optional)
    path?: string;          // Request path (optional)
  };
}
```

**Response examples**:

**Validation error**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**Not found error**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Item with ID 123 not found"
  }
}
```

**Server error**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Database operation failed, please try again later"
  }
}
```

### 7.4 Error Class Definition

**`src/lib/errors.ts`**:
```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Validation error
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// Not found error
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// Permission error
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// Conflict error
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// Server error
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 Error Code Constants

**`src/constants/error-codes.ts`**:
```typescript
// Item module error codes
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// User module error codes
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// Authentication error codes
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 Usage Examples

**Service layer**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `Item with ID ${id} not found`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        'Missing required field: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        'Amount cannot be negative',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 Frontend Error Handling

**Error code mapping**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // Item errors
  ITEM_NOT_FOUND: 'Item does not exist',
  ITEM_VALIDATION_REQUIRED: 'Please fill in required fields',
  ITEM_VALIDATION_INVALID_AMOUNT: 'Amount must be greater than 0',

  // User errors
  USER_NOT_FOUND: 'User does not exist',
  USER_CONFLICT_DUPLICATE: 'This email is already registered',
  USER_VALIDATION_INVALID_EMAIL: 'Email format is incorrect',

  // Authentication errors
  AUTH_UNAUTHORIZED: 'Please log in first',

  // Generic errors
  INTERNAL_ERROR: 'Server error, please try again later',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',

  // Default error
  DEFAULT: 'Operation failed, please try again later',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**API client**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // Return standardized error
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## 8. Prohibited Practices

The following practices are **strictly prohibited** in generated code:

1. **Using `any` type** - Use `unknown` and add type guards
2. **Hardcoding sensitive information** - Use environment variables
3. **Ignoring error handling** - All async operations need try-catch
4. **Using `console.log` for debugging** - Use structured logging
5. **Inline styles** - Use StyleSheet
6. **Skipping type definitions** - All public interfaces need types
7. **Using `var`** - Use `const` or `let`
8. **Using `==`** - Use `===`
9. **Modifying function parameters** - Create new objects/arrays
10. **Nesting more than 3 levels of if** - Early return or split function

---

## FAQ

### 1. Why is using any type prohibited?

::: warning Type Safety
The `any` type bypasses TypeScript's type checking, leading to runtime errors. Using `unknown` and adding type guards ensures type safety while maintaining flexibility.
:::

**Example comparison**:
```typescript
// ❌ Dangerous
function processData(data: any) {
  return data.value; // Runtime error if data has no value property
}

// ✅ Safe
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### 2. How do frontend and backend share error code definitions?

You can share them through:

1. **Type file sharing**: Export error code types in the backend project, frontend fetches via API or manually syncs
2. **Monorepo**: Frontend and backend in the same repository, can directly reference
3. **OpenAPI/Swagger**: Define error codes in API documentation, frontend auto-generates types

### 3. How do error codes support internationalization?

**Recommended approach**:
```typescript
// Backend: return error code and parameters
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// Frontend: map error code to localized messages
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  zh: { ITEM_VALIDATION_REQUIRED: '缺少必填字段' },
};
```

### 4. How to debug error code related issues?

1. **Check backend logs**: Confirm error code is thrown correctly
2. **Check frontend mapping**: Confirm there's a corresponding entry in `ERROR_MESSAGES`
3. **Use network panel**: View the complete error response returned by API
4. **Show details in development**: Development environment returns detailed error information

---

## Lesson Summary

In this lesson, we covered in detail the standards that AI App Factory generated code must follow:

- ✅ **General standards**: Language formatting, naming conventions, file organization
- ✅ **TypeScript standards**: Type definitions, type assertions, generics
- ✅ **Backend standards**: Express routes, controllers, service layer, error handling
- ✅ **Frontend standards**: Component structure, hook standards, style standards, navigation
- ✅ **Prisma standards**: Schema definition, query standards
- ✅ **Comment standards**: When to add comments, comment format
- ✅ **Error code standards**: Error code structure, standard error types, error response format
- ✅ **Prohibited practices**: 10 strictly prohibited practices

Following these standards ensures consistent code quality, maintainability, and readability.

---

## Next Up

> In the next lesson, we learn **[Tech Stack Details](../tech-stack/)**.
>
> You will learn:
> - The tech stack used by generated applications
> - The combination of Node.js + Express + Prisma + React Native
> - Features and best practices of each technology

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Feature | File Path | Line Numbers |
|---------|-----------|--------------|
| Code standards document | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| Error code standards | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**Key Standards**:
- **Code standards**: General standards, TypeScript standards, backend standards, frontend standards, Prisma standards, comment standards, ESLint configuration, prohibited practices
- **Error code standards**: Error code structure, standard error types (VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR, RATE_LIMIT), error response format, frontend/backend error handling

**Key Configuration**:
- **Backend ESLint**: `@typescript-eslint/no-explicit-any` rule set to `error`
- **Frontend ESLint**: `@typescript-eslint/no-explicit-any` rule set to `error`
- **Error code format**: `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **Error response structure**: Contains `success`, `error.code`, `error.message`, `error.details`

</details>
