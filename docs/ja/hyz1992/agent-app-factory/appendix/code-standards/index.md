---
title: "コード規約: TypeScript コーディング規約、ファイル構造とエラーコード | AI App Factory チュートリアル"
sidebarTitle: "コード規約"
subtitle: "コード規約: TypeScript コーディング規約、ファイル構造とエラーコード"
description: "AI App Factory によるコード生成に適用される TypeScript コーディング規約、ファイル構造、コメント要件、エラーコードシステムについて学習します。本チュートリアルでは、共通規約、TypeScript 規約、フロントエンド/バックエンド規約、Prisma 規約、コメント規約、統一エラーコードシステムを詳しく解説し、生成コードの品質を理解・維持するのに役立ちます。"
tags:
  - "付録"
  - "コード規約"
  - "TypeScript"
  - "エラーコード"
prerequisite:
  - "start-init-project"
order: 230
---

# コード規約: TypeScript コーディング規約、ファイル構造とエラーコード

## 学習後にできること

- ✅ AI App Factory によるコード生成に適用されるコーディング規約を理解する
- ✅ TypeScript の型と命名規約を習得する
- ✅ フロントエンド/バックエンドコードのファイル構造と構成方法を理解する
- ✅ 統一エラーコードシステムの使用方法を習得する

## コアコンセプト

AI App Factory により生成されるコードは、統一されたコーディング規約に従う必要があります。これにより、コード品質の一貫性、保守性、理解しやすさが確保されます。これらの規約は、一般的なフォーマット、TypeScript 型システム、フロントエンド/バックエンドアーキテクチャ設計、コメントスタイル、エラーハンドリング機構を含みます。

**なぜコード規約が必要か？**

- **一貫性**: すべての Agent によるコード生成スタイルが統一され、学習コストが低減されます
- **保守性**: 明確な命名と構造により、後続の変更が容易になります
- **可読性**: 規約に従ったコードにより、チームメンバーが意図を素早く理解できます
- **安全性**: 厳格な型システムとエラーハンドリングにより、ランタイムエラーが減少します

---

## 一、共通規約

### 1.1 言語とフォーマット

| 項目 | 規約 |
|------|------|
| 言語 | TypeScript (厳格モード) |
| インデント | 2 スペース |
| 改行 | LF (Unix) |
| エンコーディング | UTF-8 |
| 最大行長 | 100 文字 (コード), 80 文字 (コメント) |
| セミコロン | 必須 |
| 引用符 | シングルクォート (文字列), ダブルクォート (JSX 属性) |

### 1.2 命名規約

| 型 | スタイル | 例 |
|------|------|------|
| ファイル名 (通常) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| ファイル名 (コンポーネント) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| ファイル名 (テスト) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| 変数 | camelCase | `userName`, `isLoading` |
| 関数 | camelCase | `getUserById`, `formatDate` |
| クラス/インターフェース/型 | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| 定数 | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| プライベートプロパティ | アンダースコア接頭辞不使用 | TypeScript private キーワードを使用 |
| ブール変数 | is/has/can 接頭辞 | `isActive`, `hasPermission`, `canEdit` |
| イベントハンドラ | handle 接頭辞 | `handleClick`, `handleSubmit` |
| Hook | use 接頭辞 | `useItems`, `useAuth` |

::: tip 命名テクニック
良い命名は**自己説明的**であり、追加コメントなしで用途が分かるべきです。例えば `isValid` は `check` より明確で、`getUserById` は `getData` より具体的です。
:::

### 1.3 ファイル構成

**各ファイルの単一責任**:
- 1 コンポーネント = 1 ファイル
- 1 サービス = 1 ファイル
- 関連する型は同じ types.ts ファイルにまとめても良い

**インポート順序**:
```typescript
// 1. Node.js 組み込みモジュール
import path from 'path';

// 2. 外部依存
import express from 'express';
import { z } from 'zod';

// 3. 内部モジュール (絶対パス)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. 相対パスインポート
import { UserService } from './userService';
import type { User } from './types';
```

---

## 二、TypeScript 規約

### 2.1 型定義

**オブジェクト型の定義には interface を優先**:
```typescript
// ✅ 良い
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ 避ける (共用体型やマッピング型が必要な場合を除く)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**すべての公開 API に型を定義**:
```typescript
// ✅ 良い
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

// ❌ 避ける
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 型アサーション

::: warning any の使用禁止
生成コードでは**絶対に** `any` 型を使用せず、代わりに `unknown` を使用し型ガードを追加してください。
:::

**`any` の使用を避ける**:
```typescript
// ✅ 良い
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data は User 型として推論される
}

// ❌ 避ける
const data: any = JSON.parse(text);
```

**型ガードの使用**:
```typescript
// ✅ 良い
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ 避ける
const user = data as User; // 安全でないアサーション
```

### 2.3 ジェネリクス

**ジェネリクスパラメータに意味のある名前を使用**:
```typescript
// ✅ 良い
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ 避ける
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## 三、バックエンド規約

### 3.1 Express ルーティング

**Router を使用してルートを整理**:
```typescript
// ✅ 良い
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
// ✅ 良い
GET    /api/items         // 一覧
GET    /api/items/:id     // 詳細
POST   /api/items         // 作成
PUT    /api/items/:id     // 更新
DELETE /api/items/:id     // 削除

// ❌ 避ける
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 コントローラー

**コントローラーをシンプルに保つ**:
```typescript
// ✅ 良い
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

### 3.3 サービス層

**ビジネスロジックはサービス層に配置**:
```typescript
// ✅ 良い
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

### 3.4 エラーハンドリング

**統一されたエラークラスを使用**:
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

**グローバルエラーハンドリングミドルウェア**:
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

  // 本番環境では内部エラーを隠蔽
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

## 四、フロントエンド規約

### 4.1 コンポーネント構造

**関数コンポーネントのフォーマット**:
```tsx
// ✅ 良い
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

### 4.2 Hook 規約

**カスタム Hook はオブジェクトを返す**:
```typescript
// ✅ 良い
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

### 4.3 スタイル規約

**StyleSheet の使用**:
```typescript
// ✅ 良い
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

// ❌ インラインスタイルを避ける
<View style={{ flex: 1, padding: 16 }}>
```

**テーマシステムの使用**:
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

### 4.4 ナビゲーション

**型安全なナビゲーションパラメータ**:
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

## 五、Prisma 規約

### 5.1 Schema 定義

**モデル名は PascalCase 単数形**:
```prisma
// ✅ 良い
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

### 5.2 クエリ規約

**select を使用して返却フィールドを制限**:
```typescript
// ✅ 良い (必要なフィールドのみ返す)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ 避ける (機密情報を含むすべてのフィールドを返す)
const users = await prisma.user.findMany();
```

---

## 六、コメント規約

### 6.1 コメントを追加するタイミング

**コメントが必要なシナリオ**:
- 複雑なビジネスロジック
- 自明でない設計上の決定
- パフォーマンス最適化の理由
- API の公開インターフェース

**コメントが不要なシナリオ**:
- 自明なコード
- 単純な getter/setter
- 明らかな実装

### 6.2 コメントフォーマット

```typescript
// ✅ 良い - なぜを説明
// 楽観的更新でユーザー体験を向上し、失敗時にロールバック
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // ロールバック
    throw new Error('Update failed');
  }
};

// ❌ 避ける - 何を説明 (コードがすでに説明している)
// items を設定
setItems(newItems);
```

::: tip コメントの原則
コメントは**なぜ**を説明すべきであり、**何**を説明するべきではありません。良いコードは自明であるべきで、コメントはコードから直接見えない情報を補完するのみです。
:::

---

## 七、エラーコード規約

### 7.1 エラーコード構造

**フォーマット定義**:
```
[ビジネスモジュール]_[エラータイプ]_[具体的なエラー]

例: AUTH_VALIDATION_INVALID_EMAIL
```

**命名規約**:
- **全大文字**: SCREAMING_SNAKE_CASE を使用
- **ビジネスモジュール**: 機能モジュールを表す 2-4 文字（例: AUTH, USER, ITEM）
- **エラータイプ**: 一般的なエラータイプ（例: VALIDATION, NOT_FOUND, FORBIDDEN）
- **具体的なエラー**: 詳細な説明（オプション）

### 7.2 標準エラータイプ

#### 1. 検証エラー (VALIDATION)

**HTTP ステータスコード**: 400

| エラーコード | 説明 | 例のシナリオ |
|--------|------|----------|
| `[MODULE]_VALIDATION_REQUIRED` | 必須フィールドが欠落 | 作成時に title が提供されない |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | フォーマットが不正 | email フォーマットエラー |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | 範囲外 | amount < 0 または > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | 重複値 | email が既に存在 |

**例**:
```typescript
AUTH_VALIDATION_REQUIRED       // 必須フィールドが欠落
AUTH_VALIDATION_INVALID_EMAIL  // メールフォーマットエラー
ITEM_VALIDATION_OUT_OF_RANGE   // 金額が範囲外
```

#### 2. 未検出エラー (NOT_FOUND)

**HTTP ステータスコード**: 404

| エラーコード | 説明 | 例のシナリオ |
|--------|------|----------|
| `[MODULE]_NOT_FOUND` | リソースが存在しない | クエリした ID が存在しない |
| `[MODULE]_ROUTE_NOT_FOUND` | ルートが存在しない | 未定義のエンドポイントにアクセス |

**例**:
```typescript
ITEM_NOT_FOUND   // Item ID が存在しない
USER_NOT_FOUND   // User ID が存在しない
```

#### 3. 権限エラー (FORBIDDEN / UNAUTHORIZED)

**HTTP ステータスコード**: 401 (未認証), 403 (権限なし)

| エラーコード | 説明 | 例のシナリオ |
|--------|------|----------|
| `AUTH_UNAUTHORIZED` | 未ログインまたは Token が無効 | JWT 期限切れ |
| `[MODULE]_FORBIDDEN` | アクセス権限なし | 他人のデータにアクセスしようとする |

**例**:
```typescript
AUTH_UNAUTHORIZED     // Token 期限切れまたは欠落
ITEM_FORBIDDEN        // 他人の Item を削除しようとする
```

#### 4. 競合エラー (CONFLICT)

**HTTP ステータスコード**: 409

| エラーコード | 説明 | 例のシナリオ |
|--------|------|----------|
| `[MODULE]_CONFLICT_DUPLICATE` | リソース競合 | 既存リソースを作成しようとする |
| `[MODULE]_CONFLICT_STATE` | 状態競合 | 現在の状態では操作できない |

**例**:
```typescript
USER_CONFLICT_DUPLICATE   // Email が既に登録済み
ITEM_CONFLICT_STATE       // 完了済みプロジェクトは削除不可
```

#### 5. サーバーエラー (INTERNAL_ERROR)

**HTTP ステータスコード**: 500

| エラーコード | 説明 | 例のシナリオ |
|--------|------|----------|
| `INTERNAL_ERROR` | 不明な内部エラー | データベース接続失敗 |
| `DATABASE_ERROR` | データベースエラー | Prisma クエリ失敗 |
| `EXTERNAL_SERVICE_ERROR` | 外部サービスエラー | サードパーティ API 失敗 |

**例**:
```typescript
INTERNAL_ERROR             // 一般的なサーバーエラー
DATABASE_ERROR             // データベース操作失敗
EXTERNAL_SERVICE_ERROR     // サードパーティ API 呼び出し失敗
```

#### 6. レート制限エラー (RATE_LIMIT)

**HTTP ステータスコード**: 429

| エラーコード | 説明 | 例のシナリオ |
|--------|------|----------|
| `RATE_LIMIT_EXCEEDED` | リクエスト頻度制限超過 | 1 分間に 100 回を超えるリクエスト |

### 7.3 エラーレスポンスフォーマット

**標準レスポンス構造**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // エラーコード
    message: string;        // ユーザーフレンドリーなエラーメッセージ
    details?: unknown;      // 詳細情報（オプション、開発環境のみ）
    timestamp?: string;     // タイムスタンプ（オプション）
    path?: string;          // リクエストパス（オプション）
  };
}
```

**レスポンス例**:

**検証エラー**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "必須フィールドが欠落: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**未検出エラー**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "ID 123 の項目が見つかりません"
  }
}
```

**サーバーエラー**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "データベース操作に失敗しました。後ほど再試行してください"
  }
}
```

### 7.4 エラークラス定義

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

// 検証エラー
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// 未検出エラー
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// 権限エラー
export class UnauthorizedError extends AppError {
  constructor(message: string = '未認証アクセス') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// 競合エラー
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// サーバーエラー
export class InternalError extends AppError {
  constructor(message: string = 'サーバー内部エラー') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 エラーコード定数

**`src/constants/error-codes.ts`**:
```typescript
// 項目モジュールエラーコード
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// ユーザーモジュールエラーコード
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// 認証エラーコード
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 使用例

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
        `ID ${id} の項目が見つかりません`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        '必須フィールドが欠落: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        '金額は負数にできません',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 フロントエンドエラーハンドリング

**エラーコードマッピング**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // 項目エラー
  ITEM_NOT_FOUND: '項目が存在しません',
  ITEM_VALIDATION_REQUIRED: '必須フィールドを入力してください',
  ITEM_VALIDATION_INVALID_AMOUNT: '金額は 0 より大きくする必要があります',

  // ユーザーエラー
  USER_NOT_FOUND: 'ユーザーが存在しません',
  USER_CONFLICT_DUPLICATE: 'このメールアドレスは既に登録されています',
  USER_VALIDATION_INVALID_EMAIL: 'メールアドレスの形式が正しくありません',

  // 認証エラー
  AUTH_UNAUTHORIZED: 'ログインしてください',

  // 共通エラー
  INTERNAL_ERROR: 'サーバーエラーです。後ほど再試行してください',
  RATE_LIMIT_EXCEEDED: 'リクエストが多すぎます。後ほど再試行してください',

  // デフォルトエラー
  DEFAULT: '操作に失敗しました。後ほど再試行してください',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**API クライアント**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // 標準化されたエラーを返す
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

以下のプラクティスは生成コードで**絶対に禁止**されています:

1. **`any` 型の使用** - `unknown` を使用し型ガードを追加
2. **機密情報のハードコーディング** - 環境変数を使用
3. **エラーハンドリングの無視** - すべての async 操作には try-catch が必要
4. **`console.log` によるデバッグ** - 構造化ログを使用
5. **インラインスタイル** - StyleSheet を使用
6. **型定義のスキップ** - すべての公開インターフェースに型が必要
7. **`var` の使用** - `const` または `let` を使用
8. **`==` の使用** - `===` を使用
9. **関数パラメータの変更** - 新しいオブジェクト/配列を作成
10. **3 レベルを超える if のネスト** - 早期リターンまたは関数分割

---

## よくある質問

### 1. なぜ any 型は禁止されているのですか？

::: warning 型安全性
`any` 型は TypeScript の型チェックをバイパスし、ランタイムエラーを引き起こします。`unknown` を使用し型ガードを追加することで、柔軟性を保ちつつ型安全性を確保できます。
:::

**比較例**:
```typescript
// ❌ 危険
function processData(data: any) {
  return data.value; // data が value プロパティを持たない場合、ランタイムでエラー
}

// ✅ 安全
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### 2. フロントエンドとバックエンドでエラーコード定義を共有するには？

以下の方法で共有できます：

1. **型ファイル共有**: バックエンドプロジェクトからエラーコード型をエクスポートし、フロントエンドは API 経由で取得または手動で同期
2. **Monorepo**: フロントエンドとバックエンドを同一リポジトリで管理し、直接参照可能
3. **OpenAPI/Swagger**: API ドキュメントでエラーコードを定義し、フロントエンドで型を自動生成

### 3. エラーコードはどうやって多言語をサポートしますか？

**推奨される方法**:
```typescript
// バックエンド：エラーコードとパラメータを返す
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// フロントエンド：エラーコードをローカライズされたメッセージにマッピング
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  ja: { ITEM_VALIDATION_REQUIRED: '必須フィールドが欠落しています' },
};
```

### 4. エラーコード関連の問題をデバッグするには？

1. **バックエンドログを確認**: エラーコードが正しくスローされているか確認
2. **フロントエンドマッピングを確認**: `ERROR_MESSAGES` に対応するエントリがあるか確認
3. **ネットワークパネルを使用**: API からの完全なエラーレスポンスを確認
4. **開発環境で details を表示**: 開発環境では詳細なエラー情報が返されます

---

## 本レッスンのまとめ

本レッスンでは、AI App Factory によるコード生成に適用される規約を詳しく解説しました：

- ✅ **共通規約**: 言語フォーマット、命名規約、ファイル構成
- ✅ **TypeScript 規約**: 型定義、型アサーション、ジェネリクス
- ✅ **バックエンド規約**: Express ルーティング、コントローラー、サービス層、エラーハンドリング
- ✅ **フロントエンド規約**: コンポーネント構造、Hook 規約、スタイル規約、ナビゲーション
- ✅ **Prisma 規約**: Schema 定義、クエリ規約
- ✅ **コメント規約**: コメント追加のタイミング、コメントフォーマット
- ✅ **エラーコード規約**: エラーコード構造、標準エラータイプ、エラーレスポンスフォーマット
- ✅ **禁止事項**: 絶対に禁止される 10 のプラクティス

これらの規約に従うことで、生成されるコードの品質が一貫性を持ち、保守可能で理解しやすいものになります。

---

## 次回レッスンの予告

> 次回は **[技術スタック詳解](../tech-stack/)** を学習します。
>
> 学べる内容：
> - 生成されるアプリケーションで使用される技術スタック
> - Node.js + Express + Prisma + React Native の組み合わせ
> - 各技術スタックの特性とベストプラクティス

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日: 2026-01-29

| 機能 | ファイルパス | 行番号 |
|------|----------|------|
| コード規約ドキュメント | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| エラーコード規約 | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**主な規約**:
- **コード規約**: 共通規約、TypeScript 規約、バックエンド規約、フロントエンド規約、Prisma 規約、コメント規約、ESLint 設定、禁止事項
- **エラーコード規約**: エラーコード構造、標準エラータイプ（VALIDATION、NOT_FOUND、FORBIDDEN、CONFLICT、INTERNAL_ERROR、RATE_LIMIT）、エラーレスポンスフォーマット、フロントエンド/バックエンドエラーハンドリング

**主な設定**:
- **バックエンド ESLint**: `@typescript-eslint/no-explicit-any` ルールを `error` に設定
- **フロントエンド ESLint**: `@typescript-eslint/no-explicit-any` ルールを `error` に設定
- **エラーコードフォーマット**: `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **エラーレスポンス構造**: `success`、`error.code`、`error.message`、`error.details` を含む

</details>
