---
title: "程式碼規範：TypeScript 編碼規範、檔案結構與錯誤碼 | AI App Factory 教學"
sidebarTitle: "程式碼規範"
subtitle: "程式碼規範：TypeScript 編碼規範、檔案結構與錯誤碼"
description: "學習 AI App Factory 生成程式碼應遵循的 TypeScript 編碼規範、檔案結構、註解要求和錯誤碼系統。本教學詳細講解通用規範、TypeScript 規範、前後端規範、Prisma 規範、註解規範和統一錯誤碼系統，幫助你理解和維護生成程式碼的品質。"
tags:
  - "附錄"
  - "程式碼規範"
  - "TypeScript"
  - "錯誤碼"
prerequisite:
  - "start-init-project"
order: 230
---

# 程式碼規範：TypeScript 編碼規範、檔案結構與錯誤碼

## 學完你能做什麼

- ✅ 理解 AI App Factory 生成的程式碼應遵循的編碼規範
- ✅ 掌握 TypeScript 型別和命名規範
- ✅ 了解前後端程式碼的檔案結構和組織方式
- ✅ 學會統一錯誤碼系統的使用方法

## 核心思路

AI App Factory 生成的程式碼必須遵循統一的編碼規範，確保程式碼品質一致、可維護、易於理解。這些規範涵蓋通用格式、TypeScript 型別系統、前後端架構設計、註解風格和錯誤處理機制。

**為什麼需要程式碼規範？**

- **一致性**：所有 Agent 生成的程式碼風格統一，降低學習成本
- **可維護性**：清晰的命名和結構讓後續修改更容易
- **可讀性**：規範的程式碼讓團隊成員快速理解意圖
- **安全性**：嚴格的型別系統和錯誤處理減少執行時錯誤

---

## 一、通用規範

### 1.1 語言和格式

| 項目 | 規範 |
|------|------|
| 語言 | TypeScript (嚴格模式) |
| 縮排 | 2 空格 |
| 行尾 | LF (Unix) |
| 編碼 | UTF-8 |
| 最大行長 | 100 字元 (程式碼), 80 字元 (註解) |
| 分號 | 必須使用 |
| 引號 | 單引號 (字串), 雙引號 (JSX 屬性) |

### 1.2 命名規範

| 類型 | 風格 | 範例 |
|------|------|------|
| 檔名 (普通) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| 檔名 (元件) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| 檔名 (測試) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| 變數 | camelCase | `userName`, `isLoading` |
| 函式 | camelCase | `getUserById`, `formatDate` |
| 類別/介面/型別 | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| 常數 | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| 私有屬性 | 不使用底線前綴 | 使用 TypeScript private 關鍵字 |
| 布林變數 | is/has/can 前綴 | `isActive`, `hasPermission`, `canEdit` |
| 事件處理器 | handle 前綴 | `handleClick`, `handleSubmit` |
| Hook | use 前綴 | `useItems`, `useAuth` |

::: tip 命名技巧
好的命名應該**自解釋**，不需要額外註解說明用途。例如 `isValid` 比 `check` 更清晰，`getUserById` 比 `getData` 更具體。
:::

### 1.3 檔案組織

**每個檔案單一職責**:
- 一個元件一個檔案
- 一個服務一個檔案
- 相關的型別可以放在同一個 types.ts 檔案

**匯入順序**:
```typescript
// 1. Node.js 內建模組
import path from 'path';

// 2. 外部依賴
import express from 'express';
import { z } from 'zod';

// 3. 內部模組 (絕對路徑)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. 相對路徑匯入
import { UserService } from './userService';
import type { User } from './types';
```

---

## 二、TypeScript 規範

### 2.1 型別定義

**優先使用 interface 定義物件型別**:
```typescript
// ✅ 好
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ 避免 (除非需要聯合型別或映射型別)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**為所有公共 API 定義型別**:
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

### 2.2 型別斷言

::: warning 禁止使用 any
生成程式碼中**絕對禁止**使用 `any` 型別，必須使用 `unknown` 並添加型別守衛。
:::

**避免使用 `any`**:
```typescript
// ✅ 好
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data 被推斷為 User
}

// ❌ 避免
const data: any = JSON.parse(text);
```

**使用型別守衛**:
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
const user = data as User; // 不安全的斷言
```

### 2.3 泛型

**為泛型參數使用有意義的名稱**:
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

## 三、後端規範

### 3.1 Express 路由

**使用 Router 組織路由**:
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
GET    /api/items/:id     // 詳情
POST   /api/items         // 建立
PUT    /api/items/:id     // 更新
DELETE /api/items/:id     // 刪除

// ❌ 避免
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 控制器

**保持控制器簡潔**:
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

### 3.3 服務層

**業務邏輯放在服務層**:
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

### 3.4 錯誤處理

**使用統一的錯誤類**:
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

**全域錯誤處理中介軟體**:
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

  // 生產環境隱藏內部錯誤
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

## 四、前端規範

### 4.1 元件結構

**函式元件格式**:
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

### 4.2 Hook 規範

**自訂 Hook 回傳物件**:
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

### 4.3 樣式規範

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

// ❌ 避免內聯樣式
<View style={{ flex: 1, padding: 16 }}>
```

**使用主題系統**:
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

### 4.4 導覽

**型別安全的導覽參數**:
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

## 五、Prisma 規範

### 5.1 Schema 定義

**模型命名使用 PascalCase 單數**:
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

### 5.2 查詢規範

**使用 select 限制回傳欄位**:
```typescript
// ✅ 好 (只回傳需要的欄位)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ 避免 (回傳所有欄位包括敏感資訊)
const users = await prisma.user.findMany();
```

---

## 六、註解規範

### 6.1 何時添加註解

**需要註解的場景**:
- 複雜的業務邏輯
- 非顯而易見的設計決策
- 效能最佳化的原因
- API 的公共介面

**不需要註解的場景**:
- 自解釋的程式碼
- 簡單的 getter/setter
- 明顯的實現

### 6.2 註解格式

```typescript
// ✅ 好 - 解釋為什麼
// 使用樂觀更新提升使用者體驗，失敗時回滾
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // 回滾
    throw new Error('Update failed');
  }
};

// ❌ 避免 - 解釋是什麼 (程式碼已經說明)
// 設定 items
setItems(newItems);
```

::: tip 註解原則
註解應該解釋**為什麼**而不是**是什麼**。好的程式碼應該自解釋，註解只補充無法從程式碼中直接看出來的資訊。
:::

---

## 七、錯誤碼規範

### 7.1 錯誤碼結構

**格式定義**:
```
[業務模組]_[錯誤類型]_[具體錯誤]

範例: AUTH_VALIDATION_INVALID_EMAIL
```

**命名規範**:
- **全大寫**: 使用 SCREAMING_SNAKE_CASE
- **業務模組**: 2-4 個字元，表示功能模組（如 AUTH, USER, ITEM）
- **錯誤類型**: 通用錯誤類型（如 VALIDATION, NOT_FOUND, FORBIDDEN）
- **具體錯誤**: 詳細描述（可選）

### 7.2 標準錯誤類型

#### 1. 驗證錯誤 (VALIDATION)

**HTTP 狀態碼**: 400

| 錯誤碼 | 說明 | 範例場景 |
|--------|------|----------|
| `[MODULE]_VALIDATION_REQUIRED` | 缺少必填欄位 | 建立時未提供 title |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | 格式不正確 | email 格式錯誤 |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | 超出範圍 | amount < 0 或 > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | 重複值 | email 已存在 |

**範例**:
```typescript
AUTH_VALIDATION_REQUIRED       // 缺少必填欄位
AUTH_VALIDATION_INVALID_EMAIL  // 郵箱格式錯誤
ITEM_VALIDATION_OUT_OF_RANGE   // 金額超出範圍
```

#### 2. 未找到錯誤 (NOT_FOUND)

**HTTP 狀態碼**: 404

| 錯誤碼 | 說明 | 範例場景 |
|--------|------|----------|
| `[MODULE]_NOT_FOUND` | 資源不存在 | 查詢的 ID 不存在 |
| `[MODULE]_ROUTE_NOT_FOUND` | 路由不存在 | 存取未定義的端點 |

**範例**:
```typescript
ITEM_NOT_FOUND   // Item ID 不存在
USER_NOT_FOUND   // User ID 不存在
```

#### 3. 權限錯誤 (FORBIDDEN / UNAUTHORIZED)

**HTTP 狀態碼**: 401 (未認證), 403 (無權限)

| 錯誤碼 | 說明 | 範例場景 |
|--------|------|----------|
| `AUTH_UNAUTHORIZED` | 未登入或 Token 無效 | JWT 過期 |
| `[MODULE]_FORBIDDEN` | 無權存取 | 嘗試存取他人資料 |

**範例**:
```typescript
AUTH_UNAUTHORIZED     // Token 過期或缺失
ITEM_FORBIDDEN        // 嘗試刪除他人的 Item
```

#### 4. 衝突錯誤 (CONFLICT)

**HTTP 狀態碼**: 409

| 錯誤碼 | 說明 | 範例場景 |
|--------|------|----------|
| `[MODULE]_CONFLICT_DUPLICATE` | 資源衝突 | 建立已存在的資源 |
| `[MODULE]_CONFLICT_STATE` | 狀態衝突 | 操作不符合當前狀態 |

**範例**:
```typescript
USER_CONFLICT_DUPLICATE   // Email 已註冊
ITEM_CONFLICT_STATE       // 已完成的專案不能刪除
```

#### 5. 伺服器錯誤 (INTERNAL_ERROR)

**HTTP 狀態碼**: 500

| 錯誤碼 | 說明 | 範例場景 |
|--------|------|----------|
| `INTERNAL_ERROR` | 未知內部錯誤 | 資料庫連線失敗 |
| `DATABASE_ERROR` | 資料庫錯誤 | Prisma 查詢失敗 |
| `EXTERNAL_SERVICE_ERROR` | 外部服務錯誤 | 第三方 API 失敗 |

**範例**:
```typescript
INTERNAL_ERROR             // 通用伺服器錯誤
DATABASE_ERROR             // 資料庫操作失敗
EXTERNAL_SERVICE_ERROR     // 第三方 API 呼叫失敗
```

#### 6. 限流錯誤 (RATE_LIMIT)

**HTTP 狀態碼**: 429

| 錯誤碼 | 說明 | 範例場景 |
|--------|------|----------|
| `RATE_LIMIT_EXCEEDED` | 超過請求頻率限制 | 1 分鐘內請求超過 100 次 |

### 7.3 錯誤回應格式

**標準回應結構**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // 錯誤碼
    message: string;        // 使用者友善的錯誤訊息
    details?: unknown;      // 詳細資訊（可選，僅開發環境）
    timestamp?: string;     // 時間戳（可選）
    path?: string;          // 請求路徑（可選）
  };
}
```

**回應範例**:

**驗證錯誤**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "缺少必填欄位: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**未找到錯誤**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "未找到 ID 為 123 的專案"
  }
}
```

**伺服器錯誤**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "資料庫操作失敗，請稍後重試"
  }
}
```

### 7.4 錯誤類別定義

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

// 驗證錯誤
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// 未找到錯誤
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// 權限錯誤
export class UnauthorizedError extends AppError {
  constructor(message: string = '未授權存取') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// 衝突錯誤
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// 伺服器錯誤
export class InternalError extends AppError {
  constructor(message: string = '伺服器內部錯誤') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 錯誤碼常數

**`src/constants/error-codes.ts`**:
```typescript
// 專案模組錯誤碼
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// 使用者模組錯誤碼
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// 認證錯誤碼
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 使用範例

**Service 層**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `未找到 ID 為 ${id} 的專案`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        '缺少必填欄位: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        '金額不能為負數',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 前端錯誤處理

**錯誤碼映射**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // 專案錯誤
  ITEM_NOT_FOUND: '專案不存在',
  ITEM_VALIDATION_REQUIRED: '請填寫必填欄位',
  ITEM_VALIDATION_INVALID_AMOUNT: '金額必須大於 0',

  // 使用者錯誤
  USER_NOT_FOUND: '使用者不存在',
  USER_CONFLICT_DUPLICATE: '該郵箱已註冊',
  USER_VALIDATION_INVALID_EMAIL: '郵箱格式不正確',

  // 認證錯誤
  AUTH_UNAUTHORIZED: '請先登入',

  // 通用錯誤
  INTERNAL_ERROR: '伺服器錯誤，請稍後重試',
  RATE_LIMIT_EXCEEDED: '請求過於頻繁，請稍後重試',

  // 預設錯誤
  DEFAULT: '操作失敗，請稍後重試',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**API 客戶端**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// 回應攔截器
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // 回傳標準化的錯誤
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## 八、禁止事項

以下實踐在生成的程式碼中**絕對禁止**:

1. **使用 `any` 型別** - 使用 `unknown` 並添加型別守衛
2. **硬編碼敏感資訊** - 使用環境變數
3. **忽略錯誤處理** - 所有 async 操作需要 try-catch
4. **使用 `console.log` 偵錯** - 使用結構化日誌
5. **內聯樣式** - 使用 StyleSheet
6. **跳過型別定義** - 所有公共介面需要型別
7. **使用 `var`** - 使用 `const` 或 `let`
8. **使用 `==`** - 使用 `===`
9. **修改函式參數** - 建立新物件/陣列
10. **巢狀超過 3 層的 if** - 提前回傳或拆分函式

---

## 常見問題

### 1. 為什麼禁止使用 any 型別？

::: warning 型別安全
`any` 型別會繞過 TypeScript 的型別檢查，導致執行時錯誤。使用 `unknown` 並添加型別守衛可以在保持靈活性的同時確保型別安全。
:::

**範例對比**:
```typescript
// ❌ 危險
function processData(data: any) {
  return data.value; // 如果 data 沒有 value 屬性，執行時才會報錯
}

// ✅ 安全
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### 2. 前後端如何共享錯誤碼定義？

可以透過以下方式共享：

1. **型別檔案共享**：在後端專案中匯出錯誤碼型別，前端透過 API 獲取或手動同步
2. **Monorepo**：前後端在同一倉庫，可以直接引用
3. **OpenAPI/Swagger**：在 API 文件中定義錯誤碼，前端自動生成型別

### 3. 錯誤碼如何支援多語言？

**推薦做法**:
```typescript
// 後端：回傳錯誤碼和參數
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// 前端：根據錯誤碼對映到本地化訊息
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  zh: { ITEM_VALIDATION_REQUIRED: '缺少必填欄位' },
};
```

### 4. 如何偵錯錯誤碼相關的問題？

1. **檢視後端日誌**：確認錯誤碼是否正確拋出
2. **檢查前端對映**：確認 `ERROR_MESSAGES` 中是否有對應條目
3. **使用網路面板**：檢視 API 回傳的完整錯誤回應
4. **開發環境顯示 details**：開發環境下會回傳詳細的錯誤資訊

---

## 本課小結

本課我們詳細講解了 AI App Factory 生成的程式碼應遵循的規範：

- ✅ **通用規範**：語言格式、命名規範、檔案組織
- ✅ **TypeScript 規範**：型別定義、型別斷言、泛型
- ✅ **後端規範**：Express 路由、控制器、服務層、錯誤處理
- ✅ **前端規範**：元件結構、Hook 規範、樣式規範、導覽
- ✅ **Prisma 規範**：Schema 定義、查詢規範
- ✅ **註解規範**：何時添加註解、註解格式
- ✅ **錯誤碼規範**：錯誤碼結構、標準錯誤類型、錯誤回應格式
- ✅ **禁止事項**：10 項絕對禁止的實踐

遵循這些規範可以確保生成的程式碼品質一致、可維護、易於理解。

---

## 下一課預告

> 下一課我們學習 **[技術棧詳解](../tech-stack/)**。
>
> 你會學到：
> - 生成的應用使用的技術棧
> - Node.js + Express + Prisma + React Native 的組合
> - 各技術棧的特性和最佳實踐

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 功能 | 檔案路徑 | 行號 |
|------|----------|------|
| 程式碼規範文件 | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| 錯誤碼規範 | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**關鍵規範**：
- **程式碼規範**：通用規範、TypeScript 規範、後端規範、前端規範、Prisma 規範、註解規範、ESLint 配置、禁止事項
- **錯誤碼規範**：錯誤碼結構、標準錯誤類型（VALIDATION、NOT_FOUND、FORBIDDEN、CONFLICT、INTERNAL_ERROR、RATE_LIMIT）、錯誤回應格式、前後端錯誤處理

**關鍵配置**：
- **後端 ESLint**：`@typescript-eslint/no-explicit-any` 規則設定為 `error`
- **前端 ESLint**：`@typescript-eslint/no-explicit-any` 規則設定為 `error`
- **錯誤碼格式**：`[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **錯誤回應結構**：包含 `success`、`error.code`、`error.message`、`error.details`

</details>
