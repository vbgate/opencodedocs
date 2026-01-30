---
title: "코드 규칙: TypeScript 코딩 표준, 파일 구조 및 오류 코드 | AI App Factory 튜토리얼"
sidebarTitle: "코드 규칙"
subtitle: "코드 규칙: TypeScript 코딩 표준, 파일 구조 및 오류 코드"
description: "AI App Factory에서 생성한 코드가 따라야 할 TypeScript 코딩 표준, 파일 구조, 주석 요구사항 및 오류 코드 시스템을 학습합니다. 본 튜토리얼은 일반 표준, TypeScript 표준, 프론트엔드/백엔드 표준, Prisma 표준, 주석 표준 및 통합 오류 코드 시스템을 상세히 설명하여 생성된 코드의 품질을 이해하고 유지 관리하는 데 도움을 줍니다."
tags:
  - "부록"
  - "코드 규칙"
  - "TypeScript"
  - "오류 코드"
prerequisite:
  - "start-init-project"
order: 230
---

# 코드 규칙: TypeScript 코딩 표준, 파일 구조 및 오류 코드

## 학습 후 가능한 것

- ✅ AI App Factory가 생성하는 코드가 따라야 할 코딩 표준 이해
- ✅ TypeScript 유형 및 명명 규칙 숙지
- ✅ 프론트엔드/백엔드 코드의 파일 구조 및 조직 방식 이해
- ✅ 통합 오류 코드 시스템 사용 방법 학습

## 핵심 개념

AI App Factory가 생성하는 코드는 통일된 코딩 표준을 준수해야 하며, 이는 코드 품질의 일관성, 유지 관리성, 이해도를 보장합니다. 이러한 표준은 일반 형식, TypeScript 유형 시스템, 프론트엔드/백엔드 아키텍처 설계, 주석 스타일 및 오류 처리 메커니즘을 포함합니다.

**코드 규칙이 필요한 이유는 무엇인가요?**

- **일관성**: 모든 Agent가 생성하는 코드 스타일이 통일되어 학습 비용 감소
- **유지 관리성**: 명확한 명명 및 구조로 이후 수정이 용이
- **가독성**: 규범적인 코드로 팀원이 의도를 빠르게 이해
- **안전성**: 엄격한 유형 시스템 및 오류 처리로 런타임 오류 감소

---

## 1. 일반 표준

### 1.1 언어 및 형식

| 항목 | 표준 |
|------|------|
| 언어 | TypeScript (엄격 모드) |
| 들여쓰기 | 2 공백 |
| 줄 끝 | LF (Unix) |
| 인코딩 | UTF-8 |
| 최대 줄 길이 | 100 문자 (코드), 80 문자 (주석) |
| 세미콜론 | 필수 사용 |
| 따옴표 | 작은따옴표 (문자열), 큰따옴표 (JSX 속성) |

### 1.2 명명 규칙

| 유형 | 스타일 | 예시 |
|------|------|------|
| 파일명 (일반) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| 파일명 (컴포넌트) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| 파일명 (테스트) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| 변수 | camelCase | `userName`, `isLoading` |
| 함수 | camelCase | `getUserById`, `formatDate` |
| 클래스/인터페이스/유형 | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| 상수 | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| 프라이빗 속성 | 밑줄 접두사 사용 안 함 | TypeScript private 키워드 사용 |
| 불리언 변수 | is/has/can 접두사 | `isActive`, `hasPermission`, `canEdit` |
| 이벤트 핸들러 | handle 접두사 | `handleClick`, `handleSubmit` |
| Hook | use 접두사 | `useItems`, `useAuth` |

::: tip 명명 팁
좋은 명명은 **자체 설명적**이어야 하며, 추가 주석 없이 용도를 알 수 있어야 합니다. 예를 들어 `isValid`는 `check`보다 명확하고, `getUserById`는 `getData`보다 구체적입니다.
:::

### 1.3 파일 조직

**각 파일에 단일 책임**:
- 하나의 컴포넌트당 하나의 파일
- 하나의 서비스당 하나의 파일
- 관련 유형은 동일한 types.ts 파일에 배치 가능

**가져오기 순서**:
```typescript
// 1. Node.js 내장 모듈
import path from 'path';

// 2. 외부 종속성
import express from 'express';
import { z } from 'zod';

// 3. 내부 모듈 (절대 경로)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. 상대 경로 가져오기
import { UserService } from './userService';
import type { User } from './types';
```

---

## 2. TypeScript 표준

### 2.1 유형 정의

**객체 유형 정의에는 interface 우선 사용**:
```typescript
// ✅ 좋음
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ 피함 (유니온 유형이나 매핑 유형이 필요한 경우 제외)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**모든 공용 API에 유형 정의**:
```typescript
// ✅ 좋음
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

// ❌ 피함
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 유형 단언

::: warning any 사용 금지
생성된 코드에서는 `any` 유형을 **절대 사용하지 않으며**, 반드시 `unknown`을 사용하고 유형 가드를 추가해야 합니다.
:::

**`any` 사용 피하기**:
```typescript
// ✅ 좋음
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data가 User로 추론됨
}

// ❌ 피함
const data: any = JSON.parse(text);
```

**유형 가드 사용**:
```typescript
// ✅ 좋음
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ 피함
const user = data as User; // 안전하지 않은 단언
```

### 2.3 제네릭

**제네릭 매개변수에는 의미 있는 이름 사용**:
```typescript
// ✅ 좋음
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ 피함
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## 3. 백엔드 표준

### 3. Express 라우팅

**Router로 라우트 조직**:
```typescript
// ✅ 좋음
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

**RESTful 명명**:
```typescript
// ✅ 좋음
GET    /api/items         // 목록
GET    /api/items/:id     // 상세
POST   /api/items         // 생성
PUT    /api/items/:id     // 업데이트
DELETE /api/items/:id     // 삭제

// ❌ 피함
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3. 컨트롤러

**컨트롤러 간결 유지**:
```typescript
// ✅ 좋음
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

### 3.3 서비스 계층

**비즈니스 로직은 서비스 계층에 배치**:
```typescript
// ✅ 좋음
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

### 3.4 오류 처리

**통합 오류 클래스 사용**:
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

// 사용
throw new AppError(404, 'Item not found');
throw new AppError(400, 'Validation failed', errors);
```

**전역 오류 처리 미들웨어**:
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

  // 프로덕션 환경에서 내부 오류 숨기기
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

## 4. 프론트엔드 표준

### 4.1 컴포넌트 구조

**함수 컴포넌트 형식**:
```tsx
// ✅ 좋음
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

### 4.2 Hook 표준

**사용자 정의 Hook은 객체 반환**:
```typescript
// ✅ 좋음
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

### 4.3 스타일 표준

**StyleSheet 사용**:
```typescript
// ✅ 좋음
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

// ❌ 인라인 스타일 피함
<View style={{ flex: 1, padding: 16 }}>
```

**테마 시스템 사용**:
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

### 4.4 내비게이션

**유형 안전한 내비게이션 매개변수**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Create: undefined;
};

// 사용
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: 1 });
```

---

## 5. Prisma 표준

### 5.1 Schema 정의

**모델 명명에는 PascalCase 단수형 사용**:
```prisma
// ✅ 좋음
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

### 5.2 쿼리 표준

**select로 반환 필드 제한**:
```typescript
// ✅ 좋음 (필요한 필드만 반환)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ 피함 (민감 정보를 포함한 모든 필드 반환)
const users = await prisma.user.findMany();
```

---

## 6. 주석 표준

### 6.1 주석 추가 시점

**주석이 필요한 경우**:
- 복잡한 비즈니스 로직
- 명백하지 않은 설계 결정
- 성능 최적화의 이유
- API의 공용 인터페이스

**주석이 필요 없는 경우**:
- 자체 설명적인 코드
- 단순한 getter/setter
- 명백한 구현

### 6.2 주석 형식

```typescript
// ✅ 좋음 - 이유 설명
// 낙관적 업데이트로 사용자 경험 향상, 실패 시 롤백
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // 롤백
    throw new Error('Update failed');
  }
};

// ❌ 피함 - 내용 설명 (코드가 이미 설명함)
// items 설정
setItems(newItems);
```

::: tip 주석 원칙
주석은 **무엇인가**가 아니라 **왜 그런가**를 설명해야 합니다. 좋은 코드는 자체 설명적이어야 하며, 주석은 코드에서 직접 알 수 없는 정보만 보충해야 합니다.
:::

---

## 7. 오류 코드 표준

### 7.1 오류 코드 구조

**형식 정의**:
```
[비즈니스 모듈]_[오류 유형]_[구체적 오류]

예: AUTH_VALIDATION_INVALID_EMAIL
```

**명명 규칙**:
- **모두 대문자**: SCREAMING_SNAKE_CASE 사용
- **비즈니스 모듈**: 2~4 문자, 기능 모듈 나타냄 (예: AUTH, USER, ITEM)
- **오류 유형**: 일반 오류 유형 (예: VALIDATION, NOT_FOUND, FORBIDDEN)
- **구체적 오류**: 상세 설명 (선택 사항)

### 7.2 표준 오류 유형

#### 1. 검증 오류 (VALIDATION)

**HTTP 상태 코드**: 400

| 오류 코드 | 설명 | 예시 시나리오 |
|--------|------|----------|
| `[MODULE]_VALIDATION_REQUIRED` | 필수 필드 누락 | 생성 시 title 제공 안 함 |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | 형식이 올바르지 않음 | email 형식 오류 |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | 범위 초과 | amount < 0 또는 > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | 중복 값 | email 이미 존재 |

**예시**:
```typescript
AUTH_VALIDATION_REQUIRED       // 필수 필드 누락
AUTH_VALIDATION_INVALID_EMAIL  // 이메일 형식 오류
ITEM_VALIDATION_OUT_OF_RANGE   // 금액 범위 초과
```

#### 2. 찾을 수 없는 오류 (NOT_FOUND)

**HTTP 상태 코드**: 404

| 오류 코드 | 설명 | 예시 시나리오 |
|--------|------|----------|
| `[MODULE]_NOT_FOUND` | 리소스 존재하지 않음 | 쿼리 ID가 존재하지 않음 |
| `[MODULE]_ROUTE_NOT_FOUND` | 라우트 존재하지 않음 | 정의되지 않은 엔드포인트 액세스 |

**예시**:
```typescript
ITEM_NOT_FOUND   // Item ID 존재하지 않음
USER_NOT_FOUND   // User ID 존재하지 않음
```

#### 3. 권한 오류 (FORBIDDEN / UNAUTHORIZED)

**HTTP 상태 코드**: 401 (미인증), 403 (권한 없음)

| 오류 코드 | 설명 | 예시 시나리오 |
|--------|------|----------|
| `AUTH_UNAUTHORIZED` | 로그인 안 함 또는 Token 무효 | JWT 만료 |
| `[MODULE]_FORBIDDEN` | 액세스 권한 없음 | 타인 데이터 액세스 시도 |

**예시**:
```typescript
AUTH_UNAUTHORIZED     // Token 만료 또는 누락
ITEM_FORBIDDEN        // 타인의 Item 삭제 시도
```

#### 4. 충돌 오류 (CONFLICT)

**HTTP 상태 코드**: 409

| 오류 코드 | 설명 | 예시 시나리오 |
|--------|------|----------|
| `[MODULE]_CONFLICT_DUPLICATE` | 리소스 충돌 | 이미 존재하는 리소스 생성 |
| `[MODULE]_CONFLICT_STATE` | 상태 충돌 | 현재 상태에 맞지 않는 작업 |

**예시**:
```typescript
USER_CONFLICT_DUPLICATE   // Email 이미 등록됨
ITEM_CONFLICT_STATE       // 완료된 항목은 삭제할 수 없음
```

#### 5. 서버 오류 (INTERNAL_ERROR)

**HTTP 상태 코드**: 500

| 오류 코드 | 설명 | 예시 시나리오 |
|--------|------|----------|
| `INTERNAL_ERROR` | 알 수 없는 내부 오류 | 데이터베이스 연결 실패 |
| `DATABASE_ERROR` | 데이터베이스 오류 | Prisma 쿼리 실패 |
| `EXTERNAL_SERVICE_ERROR` | 외부 서비스 오류 | 타사 API 실패 |

**예시**:
```typescript
INTERNAL_ERROR             // 일반 서버 오류
DATABASE_ERROR             // 데이터베이스 작업 실패
EXTERNAL_SERVICE_ERROR     // 타사 API 호출 실패
```

#### 6. 속도 제한 오류 (RATE_LIMIT)

**HTTP 상태 코드**: 429

| 오류 코드 | 설명 | 예시 시나리오 |
|--------|------|----------|
| `RATE_LIMIT_EXCEEDED` | 요청 빈도 제한 초과 | 1분 내 100회 이상 요청 |

### 7.3 오류 응답 형식

**표준 응답 구조**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // 오류 코드
    message: string;        // 사용자 친화적 오류 메시지
    details?: unknown;      // 상세 정보 (선택 사항, 개발 환경만)
    timestamp?: string;     // 타임스탬프 (선택 사항)
    path?: string;          // 요청 경로 (선택 사항)
  };
}
```

**응답 예시**:

**검증 오류**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "필수 필드 누락: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**찾을 수 없는 오류**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "ID가 123인 항목을 찾을 수 없습니다"
  }
}
```

**서버 오류**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "데이터베이스 작업 실패, 나중에 다시 시도해 주세요"
  }
}
```

### 7.4 오류 클래스 정의

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

// 검증 오류
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// 찾을 수 없는 오류
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// 권한 오류
export class UnauthorizedError extends AppError {
  constructor(message: string = '인증되지 않은 액세스') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// 충돌 오류
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// 서버 오류
export class InternalError extends AppError {
  constructor(message: string = '서버 내부 오류') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 오류 코드 상수

**`src/constants/error-codes.ts`**:
```typescript
// 항목 모듈 오류 코드
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// 사용자 모듈 오류 코드
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// 인증 오류 코드
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 사용 예시

**Service 계층**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `ID가 ${id}인 항목을 찾을 수 없습니다`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        '필수 필드 누락: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        '금액은 음수일 수 없습니다',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 프론트엔드 오류 처리

**오류 코드 매핑**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // 항목 오류
  ITEM_NOT_FOUND: '항목이 존재하지 않습니다',
  ITEM_VALIDATION_REQUIRED: '필수 필드를 입력해 주세요',
  ITEM_VALIDATION_INVALID_AMOUNT: '금액은 0보다 커야 합니다',

  // 사용자 오류
  USER_NOT_FOUND: '사용자가 존재하지 않습니다',
  USER_CONFLICT_DUPLICATE: '해당 이메일은 이미 등록되었습니다',
  USER_VALIDATION_INVALID_EMAIL: '이메일 형식이 올바르지 않습니다',

  // 인증 오류
  AUTH_UNAUTHORIZED: '먼저 로그인해 주세요',

  // 일반 오류
  INTERNAL_ERROR: '서버 오류가 발생했습니다. 나중에 다시 시도해 주세요',
  RATE_LIMIT_EXCEEDED: '요청이 너무 빈번합니다. 나중에 다시 시도해 주세요',

  // 기본 오류
  DEFAULT: '작업 실패. 나중에 다시 시도해 주세요',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**API 클라이언트**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // 표준화된 오류 반환
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## 8. 금지 사항

생성된 코드에서 다음 관행은 **절대 금지**됩니다:

1. **`any` 유형 사용** - `unknown` 사용 및 유형 가드 추가
2. **민감 정보 하드코딩** - 환경 변수 사용
3. **오류 처리 무시** - 모든 async 작업에 try-catch 필요
4. **`console.log`로 디버깅** - 구조화된 로그 사용
5. **인라인 스타일** - StyleSheet 사용
6. **유형 정의 건너뛰기** - 모든 공용 인터페이스에 유형 필요
7. **`var` 사용** - `const` 또는 `let` 사용
8. **`==` 사용** - `===` 사용
9. **함수 매개변수 수정** - 새 객체/배열 생성
10. **3층 이상 중첩된 if** - 조기 반환 또는 함수 분할

---

## 자주 묻는 질문

### 1. any 유형 사용을 금지하는 이유는 무엇인가요?

::: warning 유형 안전성
`any` 유형은 TypeScript의 유형 검사를 우회하여 런타임 오류를 유발할 수 있습니다. `unknown`을 사용하고 유형 가드를 추가하면 유연성을 유지하면서 유형 안전성을 보장할 수 있습니다.
:::

**예시 비교**:
```typescript
// ❌ 위험
function processData(data: any) {
  return data.value; // data에 value 속성이 없으면 런타임에 오류 발생
}

// ✅ 안전
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### 2. 프론트엔드/백엔드 간 오류 코드 정의를 공유하는 방법은 무엇인가요?

다음 방법으로 공유할 수 있습니다:

1. **유형 파일 공유**: 백엔드 프로젝트에서 오류 코드 유형을 내보내고, 프론트엔드가 API를 통해 가져오거나 수동으로 동기화
2. **Monorepo**: 프론트엔드/백엔드가 동일한 저장소에 있어 직접 참조 가능
3. **OpenAPI/Swagger**: API 문서에서 오류 코드 정의, 프론트엔드가 자동으로 유형 생성

### 3. 오류 코드로 다국어를 지원하는 방법은 무엇인가요?

**권장 방법**:
```typescript
// 백엔드: 오류 코드와 매개변수 반환
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// 프론트엔드: 오류 코드를 현지화된 메시지에 매핑
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  zh: { ITEM_VALIDATION_REQUIRED: '缺少必填字段' },
};
```

### 4. 오류 코드 관련 문제를 디버깅하는 방법은 무엇인가요?

1. **백엔드 로그 확인**: 오류 코드가 올바르게 throw되는지 확인
2. **프론트엔드 매핑 확인**: `ERROR_MESSAGES`에 해당 항목이 있는지 확인
3. **네트워크 패널 사용**: API가 반환하는 전체 오류 응답 확인
4. **개발 환경에서 details 표시**: 개발 환경에서 상세 오류 정보 반환

---

## 이 장 요약

이 장에서는 AI App Factory가 생성하는 코드가 따라야 할 표준을 상세히 설명했습니다:

- ✅ **일반 표준**: 언어 형식, 명명 규칙, 파일 조직
- ✅ **TypeScript 표준**: 유형 정의, 유형 단언, 제네릭
- ✅ **백엔드 표준**: Express 라우트, 컨트롤러, 서비스 계층, 오류 처리
- ✅ **프론트엔드 표준**: 컴포넌트 구조, Hook 표준, 스타일 표준, 내비게이션
- ✅ **Prisma 표준**: Schema 정의, 쿼리 표준
- ✅ **주석 표준**: 주석 추가 시점, 주석 형식
- ✅ **오류 코드 표준**: 오류 코드 구조, 표준 오류 유형, 오류 응답 형식
- ✅ **금지 사항**: 절대 금지되는 10가지 관행

이러한 표준을 준수하면 생성된 코드의 품질이 일관되고 유지 관리가 용이하며 이해하기 쉽습니다.

---

## 다음 장 예고

> 다음 장에서 **[기술 스택 상세 설명](../tech-stack/)**을 학습합니다.
>
> 학습할 내용:
> - 생성된 애플리케이션에서 사용하는 기술 스택
> - Node.js + Express + Prisma + React Native 조합
> - 각 기술 스택의 특성과 모범 사례

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-29

| 기능 | 파일 경로 | 행 번호 |
|------|----------|------|
| 코드 규칙 문서 | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| 오류 코드 표준 | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**핵심 표준**:
- **코드 규칙**: 일반 표준, TypeScript 표준, 백엔드 표준, 프론트엔드 표준, Prisma 표준, 주석 표준, ESLint 구성, 금지 사항
- **오류 코드 표준**: 오류 코드 구조, 표준 오류 유형(VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR, RATE_LIMIT), 오류 응답 형식, 프론트엔드/백엔드 오류 처리

**핵심 구성**:
- **백엔드 ESLint**: `@typescript-eslint/no-explicit-any` 규칙을 `error`로 설정
- **프론트엔드 ESLint**: `@typescript-eslint/no-explicit-any` 규칙을 `error`로 설정
- **오류 코드 형식**: `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **오류 응답 구조**: `success`, `error.code`, `error.message`, `error.details` 포함

</details>
