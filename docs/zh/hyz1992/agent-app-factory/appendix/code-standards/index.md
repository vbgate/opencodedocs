---
title: "代码规范：TypeScript 编码规范、文件结构与错误码 | AI App Factory 教程"
sidebarTitle: "代码规范"
subtitle: "代码规范：TypeScript 编码规范、文件结构与错误码"
description: "学习 AI App Factory 生成代码应遵循的 TypeScript 编码规范、文件结构、注释要求和错误码系统。本教程详细讲解通用规范、TypeScript 规范、前后端规范、Prisma 规范、注释规范和统一错误码系统，帮助你理解和维护生成代码的质量。"
tags:
  - "附录"
  - "代码规范"
  - "TypeScript"
  - "错误码"
prerequisite:
  - "start-init-project"
order: 230
---

# 代码规范：TypeScript 编码规范、文件结构与错误码

## 学完你能做什么

- ✅ 理解 AI App Factory 生成的代码应遵循的编码规范
- ✅ 掌握 TypeScript 类型和命名规范
- ✅ 了解前后端代码的文件结构和组织方式
- ✅ 学会统一错误码系统的使用方法

## 核心思路

AI App Factory 生成的代码必须遵循统一的编码规范，确保代码质量一致、可维护、易于理解。这些规范涵盖通用格式、TypeScript 类型系统、前后端架构设计、注释风格和错误处理机制。

**为什么需要代码规范？**

- **一致性**：所有 Agent 生成的代码风格统一，降低学习成本
- **可维护性**：清晰的命名和结构让后续修改更容易
- **可读性**：规范的代码让团队成员快速理解意图
- **安全性**：严格的类型系统和错误处理减少运行时错误

---

## 一、通用规范

### 1.1 语言和格式

| 项目 | 规范 |
|------|------|
| 语言 | TypeScript (严格模式) |
| 缩进 | 2 空格 |
| 行尾 | LF (Unix) |
| 编码 | UTF-8 |
| 最大行长 | 100 字符 (代码), 80 字符 (注释) |
| 分号 | 必须使用 |
| 引号 | 单引号 (字符串), 双引号 (JSX 属性) |

### 1.2 命名规范

| 类型 | 风格 | 示例 |
|------|------|------|
| 文件名 (普通) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| 文件名 (组件) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| 文件名 (测试) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| 变量 | camelCase | `userName`, `isLoading` |
| 函数 | camelCase | `getUserById`, `formatDate` |
| 类/接口/类型 | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| 常量 | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| 私有属性 | 不使用下划线前缀 | 使用 TypeScript private 关键字 |
| 布尔变量 | is/has/can 前缀 | `isActive`, `hasPermission`, `canEdit` |
| 事件处理器 | handle 前缀 | `handleClick`, `handleSubmit` |
| Hook | use 前缀 | `useItems`, `useAuth` |

::: tip 命名技巧
好的命名应该**自解释**，不需要额外注释说明用途。例如 `isValid` 比 `check` 更清晰，`getUserById` 比 `getData` 更具体。
:::

### 1.3 文件组织

**每个文件单一职责**:
- 一个组件一个文件
- 一个服务一个文件
- 相关的类型可以放在同一个 types.ts 文件

**导入顺序**:
```typescript
// 1. Node.js 内置模块
import path from 'path';

// 2. 外部依赖
import express from 'express';
import { z } from 'zod';

// 3. 内部模块 (绝对路径)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. 相对路径导入
import { UserService } from './userService';
import type { User } from './types';
```

---

## 二、TypeScript 规范

### 2.1 类型定义

**优先使用 interface 定义对象类型**:
```typescript
// ✅ 好
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ 避免 (除非需要联合类型或映射类型)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**为所有公共 API 定义类型**:
```typescript
// ✅ 好
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

// ❌ 避免
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 类型断言

::: warning 禁止使用 any
生成代码中**绝对禁止**使用 `any` 类型，必须使用 `unknown` 并添加类型守卫。
:::

**避免使用 `any`**:
```typescript
// ✅ 好
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data 被推断为 User
}

// ❌ 避免
const data: any = JSON.parse(text);
```

**使用类型守卫**:
```typescript
// ✅ 好
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ 避免
const user = data as User; // 不安全的断言
```

### 2.3 泛型

**为泛型参数使用有意义的名称**:
```typescript
// ✅ 好
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ 避免
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## 三、后端规范

### 3.1 Express 路由

**使用 Router 组织路由**:
```typescript
// ✅ 好
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

**RESTful 命名**:
```typescript
// ✅ 好
GET    /api/items         // 列表
GET    /api/items/:id     // 详情
POST   /api/items         // 创建
PUT    /api/items/:id     // 更新
DELETE /api/items/:id     // 删除

// ❌ 避免
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 控制器

**保持控制器简洁**:
```typescript
// ✅ 好
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

### 3.3 服务层

**业务逻辑放在服务层**:
```typescript
// ✅ 好
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

### 3.4 错误处理

**使用统一的错误类**:
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

// 使用
throw new AppError(404, 'Item not found');
throw new AppError(400, 'Validation failed', errors);
```

**全局错误处理中间件**:
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

  // 生产环境隐藏内部错误
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

## 四、前端规范

### 4.1 组件结构

**函数组件格式**:
```tsx
// ✅ 好
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

### 4.2 Hook 规范

**自定义 Hook 返回对象**:
```typescript
// ✅ 好
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

### 4.3 样式规范

**使用 StyleSheet**:
```typescript
// ✅ 好
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

// ❌ 避免内联样式
<View style={{ flex: 1, padding: 16 }}>
```

**使用主题系统**:
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

### 4.4 导航

**类型安全的导航参数**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Create: undefined;
};

// 使用
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: 1 });
```

---

## 五、Prisma 规范

### 5.1 Schema 定义

**模型命名使用 PascalCase 单数**:
```prisma
// ✅ 好
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

### 5.2 查询规范

**使用 select 限制返回字段**:
```typescript
// ✅ 好 (只返回需要的字段)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ 避免 (返回所有字段包括敏感信息)
const users = await prisma.user.findMany();
```

---

## 六、注释规范

### 6.1 何时添加注释

**需要注释的场景**:
- 复杂的业务逻辑
- 非显而易见的设计决策
- 性能优化的原因
- API 的公共接口

**不需要注释的场景**:
- 自解释的代码
- 简单的 getter/setter
- 明显的实现

### 6.2 注释格式

```typescript
// ✅ 好 - 解释为什么
// 使用乐观更新提升用户体验，失败时回滚
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // 回滚
    throw new Error('Update failed');
  }
};

// ❌ 避免 - 解释是什么 (代码已经说明)
// 设置 items
setItems(newItems);
```

::: tip 注释原则
注释应该解释**为什么**而不是**是什么**。好的代码应该自解释，注释只补充无法从代码中直接看出来的信息。
:::

---

## 七、错误码规范

### 7.1 错误码结构

**格式定义**:
```
[业务模块]_[错误类型]_[具体错误]

示例: AUTH_VALIDATION_INVALID_EMAIL
```

**命名规范**:
- **全大写**: 使用 SCREAMING_SNAKE_CASE
- **业务模块**: 2-4 个字符，表示功能模块（如 AUTH, USER, ITEM）
- **错误类型**: 通用错误类型（如 VALIDATION, NOT_FOUND, FORBIDDEN）
- **具体错误**: 详细描述（可选）

### 7.2 标准错误类型

#### 1. 验证错误 (VALIDATION)

**HTTP 状态码**: 400

| 错误码 | 说明 | 示例场景 |
|--------|------|----------|
| `[MODULE]_VALIDATION_REQUIRED` | 缺少必填字段 | 创建时未提供 title |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | 格式不正确 | email 格式错误 |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | 超出范围 | amount < 0 或 > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | 重复值 | email 已存在 |

**示例**:
```typescript
AUTH_VALIDATION_REQUIRED       // 缺少必填字段
AUTH_VALIDATION_INVALID_EMAIL  // 邮箱格式错误
ITEM_VALIDATION_OUT_OF_RANGE   // 金额超出范围
```

#### 2. 未找到错误 (NOT_FOUND)

**HTTP 状态码**: 404

| 错误码 | 说明 | 示例场景 |
|--------|------|----------|
| `[MODULE]_NOT_FOUND` | 资源不存在 | 查询的 ID 不存在 |
| `[MODULE]_ROUTE_NOT_FOUND` | 路由不存在 | 访问未定义的端点 |

**示例**:
```typescript
ITEM_NOT_FOUND   // Item ID 不存在
USER_NOT_FOUND   // User ID 不存在
```

#### 3. 权限错误 (FORBIDDEN / UNAUTHORIZED)

**HTTP 状态码**: 401 (未认证), 403 (无权限)

| 错误码 | 说明 | 示例场景 |
|--------|------|----------|
| `AUTH_UNAUTHORIZED` | 未登录或 Token 无效 | JWT 过期 |
| `[MODULE]_FORBIDDEN` | 无权访问 | 尝试访问他人数据 |

**示例**:
```typescript
AUTH_UNAUTHORIZED     // Token 过期或缺失
ITEM_FORBIDDEN        // 尝试删除他人的 Item
```

#### 4. 冲突错误 (CONFLICT)

**HTTP 状态码**: 409

| 错误码 | 说明 | 示例场景 |
|--------|------|----------|
| `[MODULE]_CONFLICT_DUPLICATE` | 资源冲突 | 创建已存在的资源 |
| `[MODULE]_CONFLICT_STATE` | 状态冲突 | 操作不符合当前状态 |

**示例**:
```typescript
USER_CONFLICT_DUPLICATE   // Email 已注册
ITEM_CONFLICT_STATE       // 已完成的项目不能删除
```

#### 5. 服务器错误 (INTERNAL_ERROR)

**HTTP 状态码**: 500

| 错误码 | 说明 | 示例场景 |
|--------|------|----------|
| `INTERNAL_ERROR` | 未知内部错误 | 数据库连接失败 |
| `DATABASE_ERROR` | 数据库错误 | Prisma 查询失败 |
| `EXTERNAL_SERVICE_ERROR` | 外部服务错误 | 第三方 API 失败 |

**示例**:
```typescript
INTERNAL_ERROR             // 通用服务器错误
DATABASE_ERROR             // 数据库操作失败
EXTERNAL_SERVICE_ERROR     // 第三方 API 调用失败
```

#### 6. 限流错误 (RATE_LIMIT)

**HTTP 状态码**: 429

| 错误码 | 说明 | 示例场景 |
|--------|------|----------|
| `RATE_LIMIT_EXCEEDED` | 超过请求频率限制 | 1 分钟内请求超过 100 次 |

### 7.3 错误响应格式

**标准响应结构**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // 错误码
    message: string;        // 用户友好的错误消息
    details?: unknown;      // 详细信息（可选，仅开发环境）
    timestamp?: string;     // 时间戳（可选）
    path?: string;          // 请求路径（可选）
  };
}
```

**响应示例**:

**验证错误**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "缺少必填字段: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**未找到错误**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "未找到 ID 为 123 的项目"
  }
}
```

**服务器错误**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "数据库操作失败，请稍后重试"
  }
}
```

### 7.4 错误类定义

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

// 验证错误
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// 未找到错误
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// 权限错误
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授权访问') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// 冲突错误
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// 服务器错误
export class InternalError extends AppError {
  constructor(message: string = '服务器内部错误') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 错误码常量

**`src/constants/error-codes.ts`**:
```typescript
// 项目模块错误码
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// 用户模块错误码
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// 认证错误码
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 使用示例

**Service 层**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `未找到 ID 为 ${id} 的项目`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        '缺少必填字段: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        '金额不能为负数',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 前端错误处理

**错误码映射**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // 项目错误
  ITEM_NOT_FOUND: '项目不存在',
  ITEM_VALIDATION_REQUIRED: '请填写必填字段',
  ITEM_VALIDATION_INVALID_AMOUNT: '金额必须大于 0',

  // 用户错误
  USER_NOT_FOUND: '用户不存在',
  USER_CONFLICT_DUPLICATE: '该邮箱已注册',
  USER_VALIDATION_INVALID_EMAIL: '邮箱格式不正确',

  // 认证错误
  AUTH_UNAUTHORIZED: '请先登录',

  // 通用错误
  INTERNAL_ERROR: '服务器错误，请稍后重试',
  RATE_LIMIT_EXCEEDED: '请求过于频繁，请稍后重试',

  // 默认错误
  DEFAULT: '操作失败，请稍后重试',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**API 客户端**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // 返回标准化的错误
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## 八、禁止事项

以下实践在生成的代码中**绝对禁止**:

1. **使用 `any` 类型** - 使用 `unknown` 并添加类型守卫
2. **硬编码敏感信息** - 使用环境变量
3. **忽略错误处理** - 所有 async 操作需要 try-catch
4. **使用 `console.log` 调试** - 使用结构化日志
5. **内联样式** - 使用 StyleSheet
6. **跳过类型定义** - 所有公共接口需要类型
7. **使用 `var`** - 使用 `const` 或 `let`
8. **使用 `==`** - 使用 `===`
9. **修改函数参数** - 创建新对象/数组
10. **嵌套超过 3 层的 if** - 提前返回或拆分函数

---

## 常见问题

### 1. 为什么禁止使用 any 类型？

::: warning 类型安全
`any` 类型会绕过 TypeScript 的类型检查，导致运行时错误。使用 `unknown` 并添加类型守卫可以在保持灵活性的同时确保类型安全。
:::

**示例对比**:
```typescript
// ❌ 危险
function processData(data: any) {
  return data.value; // 如果 data 没有 value 属性，运行时才会报错
}

// ✅ 安全
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### 2. 前后端如何共享错误码定义？

可以通过以下方式共享：

1. **类型文件共享**：在后端项目中导出错误码类型，前端通过 API 获取或手动同步
2. **Monorepo**：前后端在同一仓库，可以直接引用
3. **OpenAPI/Swagger**：在 API 文档中定义错误码，前端自动生成类型

### 3. 错误码如何支持多语言？

**推荐做法**:
```typescript
// 后端：返回错误码和参数
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// 前端：根据错误码映射到本地化消息
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  zh: { ITEM_VALIDATION_REQUIRED: '缺少必填字段' },
};
```

### 4. 如何调试错误码相关的问题？

1. **查看后端日志**：确认错误码是否正确抛出
2. **检查前端映射**：确认 `ERROR_MESSAGES` 中是否有对应条目
3. **使用网络面板**：查看 API 返回的完整错误响应
4. **开发环境显示 details**：开发环境下会返回详细的错误信息

---

## 本课小结

本课我们详细讲解了 AI App Factory 生成的代码应遵循的规范：

- ✅ **通用规范**：语言格式、命名规范、文件组织
- ✅ **TypeScript 规范**：类型定义、类型断言、泛型
- ✅ **后端规范**：Express 路由、控制器、服务层、错误处理
- ✅ **前端规范**：组件结构、Hook 规范、样式规范、导航
- ✅ **Prisma 规范**：Schema 定义、查询规范
- ✅ **注释规范**：何时添加注释、注释格式
- ✅ **错误码规范**：错误码结构、标准错误类型、错误响应格式
- ✅ **禁止事项**：10 项绝对禁止的实践

遵循这些规范可以确保生成的代码质量一致、可维护、易于理解。

---

## 下一课预告

> 下一课我们学习 **[技术栈详解](../tech-stack/)**。
>
> 你会学到：
> - 生成的应用使用的技术栈
> - Node.js + Express + Prisma + React Native 的组合
> - 各技术栈的特性和最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 代码规范文档 | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| 错误码规范 | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**关键规范**：
- **代码规范**：通用规范、TypeScript 规范、后端规范、前端规范、Prisma 规范、注释规范、ESLint 配置、禁止事项
- **错误码规范**：错误码结构、标准错误类型（VALIDATION、NOT_FOUND、FORBIDDEN、CONFLICT、INTERNAL_ERROR、RATE_LIMIT）、错误响应格式、前后端错误处理

**关键配置**：
- **后端 ESLint**：`@typescript-eslint/no-explicit-any` 规则设置为 `error`
- **前端 ESLint**：`@typescript-eslint/no-explicit-any` 规则设置为 `error`
- **错误码格式**：`[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **错误响应结构**：包含 `success`、`error.code`、`error.message`、`error.details`

</details>
