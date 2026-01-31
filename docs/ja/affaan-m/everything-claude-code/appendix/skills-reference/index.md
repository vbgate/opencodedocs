---
title: "Skillsリファレンス: 11個のスキルライブラリ | Everything Claude Code"
sidebarTitle: "11個のスキルを5分で確認"
subtitle: "Skillsリファレンス: 11個のスキルライブラリ"
description: "Everything Claude Codeの11個のスキルライブラリの活用方法を学びます。コーディング規約、バックエンド/フロントエンドのパターン、TDDワークフロー、セキュリティレビューをマスターし、開発効率を向上させます。"
tags:
  - "skills"
  - "coding-standards"
  - "backend-patterns"
  - "frontend-patterns"
  - "tdd-workflow"
  - "security-review"
prerequisite:
  - "start-quickstart"
order: 210
---

# Skills 完全リファレンス: 11個のスキルライブラリ詳解

## 学習後にできること

- 11個のスキルライブラリの内容と用途を素早く見つけて理解する
- 開発プロセスにおいてコーディング規約、アーキテクチャパターン、ベストプラクティスを正しく適用する
- どのスキルをいつ使えば開発効率とコード品質が向上するかを知る
- TDDワークフロー、セキュリティレビュー、継続的な学習などの重要なスキルをマスターする

## 現在の悩み

プロジェクトにある11個のスキルライブラリに対して、あなたは次のような悩みを持つかもしれません：

- **すべてのスキルを覚えられない**: coding-standards、backend-patterns、security-review... どのスキルをいつ使えばいいの？
- **適用方法がわからない**: 不変パターン、TDDフローについて言及されているが、具体的にどう操作すればいいの？
- **どれに頼ればいいかわからない**: セキュリティ問題にはどのスキル？バックエンド開発にはどのスキル？
- **スキルとエージェントの関係**: スキルとエージェントの違いは？いつエージェントを使い、いつスキルを使う？

このリファレンスドキュメントは、各スキルの内容、使用シーン、使い方を包括的に理解できるようにサポートします。

---

## Skills 概要

Everything Claude Codeには11個のスキルライブラリが含まれており、各スキルには明確な目標と使用シーンがあります：

| スキルライブラリ | 目標 | 優先度 | 使用シーン |
|--- | --- | --- | ---|
| **coding-standards** | コーディング規約とベストプラクティスの統一 | P0 | 一般的なコーディング、TypeScript/JavaScript/React |
| **backend-patterns** | バックエンドアーキテクチャパターン、API設計 | P0 | Node.js、Express、Next.js APIルート開発 |
| **frontend-patterns** | フロントエンド開発パターン、パフォーマンス最適化 | P0 | React、Next.js、状態管理 |
| **tdd-workflow** | テスト駆動開発ワークフロー | P0 | 新機能開発、バグ修正、リファクタリング |
| **security-review** | セキュリティレビューと脆弱性検出 | P0 | 認証認可、入力検証、機密データ処理 |
| **continuous-learning** | 再利用可能なパターンの自動抽出 | P1 | 長期プロジェクト、知識の蓄積 |
| **strategic-compact** | 戦略的コンテキスト圧縮 | P1 | 長時間セッション、複雑なタスク |
| **eval-harness** | 評価駆動開発フレームワーク | P1 | AI開発評価、信頼性テスト |
| **verification-loop** | 包括的検証システム | P1 | PR前検証、品質チェック |
| **project-guidelines-example** | プロジェクトガイドラインの例 | P2 | カスタムプロジェクト規約 |
| **clickhouse-io** | ClickHouse分析パターン | P2 | 高性能分析クエリ |

::: info Skills vs Agents

**Skills**はワークフロー定義とドメイン知識ベースであり、パターン、ベストプラクティス、規約のガイダンスを提供します。

**Agents**は専門化されたサブエージェントであり、特定ドメインの複雑なタスク（計画、レビュー、デバッグなど）を実行します。

両者は補完関係にあります：Skillsは知識フレームワークを提供し、Agentsは具体的なタスクを実行します。
:::

---

## 1. coding-standards（コーディング規約）

### コア原則

#### 1. 可読性優先
- コードは書かれる回数よりも読まれる回数がはるかに多い
- 明確な変数名と関数名
- コメントより自己説明的なコード
- 一貫したフォーマット

#### 2. KISS原則（Keep It Simple, Stupid）
- 最もシンプルな有効なソリューションを使用
- 過度な設計を避ける
- 早期最適化をしない
- 理解しやすさ > 賢いコード

#### 3. DRY原則（Don't Repeat Yourself）
- 共通ロジックを関数に抽出
- 再利用可能なコンポーネントを作成
- モジュール間でユーティリティ関数を共有
- コピーペーストプログラミングを避ける

#### 4. YAGNI原則（You Aren't Gonna Need It）
- 必要になる前に機能を構築しない
- 推測的な汎化を避ける
- 必要なときにのみ複雑さを追加
- シンプルから始め、必要に応じてリファクタリング

### 不変パターン（CRITICAL）

::: warning 重要ルール

常に新しいオブジェクトを作成し、既存のオブジェクトを決して変更しないでください！これはコード品質において最も重要な原則の1つです。
:::

**❌ 間違ったやり方**: オブジェクトを直接変更

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 正しいやり方**: 新しいオブジェクトを作成

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### TypeScript/JavaScript ベストプラクティス

#### 変数命名

```typescript
// ✅ GOOD: 説明的な命名
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ BAD: 不明確な命名
const q = 'election'
const flag = true
const x = 1000
```

#### 関数命名

```typescript
// ✅ GOOD: 動詞-名詞パターン
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ BAD: 不明確または名詞のみ
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### エラーハンドリング

```typescript
// ✅ GOOD: 包括的なエラーハンドリング
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// ❌ BAD: エラーハンドリングなし
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### 並列実行

```typescript
// ✅ GOOD: 可能な限り並列実行
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ BAD: 不要な順次実行
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### React ベストプラクティス

#### コンポーネント構造

```typescript
// ✅ GOOD: 型付き関数コンポーネント
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// ❌ BAD: 型なし、構造不明確
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### カスタムフック

```typescript
// ✅ GOOD: 再利用可能なカスタムフック
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// 使用
const debouncedQuery = useDebounce(searchQuery, 500)
```

#### 状態更新

```typescript
// ✅ GOOD: 関数型状態更新
const [count, setCount] = useState(0)

// 前の状態に基づいた更新
setCount(prev => prev + 1)

// ❌ BAD: 状態を直接参照
setCount(count + 1)  // 非同期シーンで古くなる可能性がある
```

### API設計規約

#### REST API 規約

```
GET    /api/markets              # すべての市場をリスト
GET    /api/markets/:id          # 特定の市場を取得
POST   /api/markets              # 新しい市場を作成
PUT    /api/markets/:id          # 市場を更新（完全）
PATCH  /api/markets/:id          # 市場を更新（部分）
DELETE /api/markets/:id          # 市場を削除

# クエリパラメータはフィルタリングに使用
GET /api/markets?status=active&limit=10&offset=0
```

#### レスポンスフォーマット

```typescript
// ✅ GOOD: 一貫性のあるレスポンス構造
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// 成功レスポンス
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// エラーレスポンス
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### 入力検証

```typescript
import { z } from 'zod'

// ✅ GOOD: スキーマ検証
const CreateMarketSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  endDate: z.string().datetime(),
  categories: z.array(z.string()).min(1)
})

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const validated = CreateMarketSchema.parse(body)
    // 検証済みデータの処理を続行
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
  }
}
```

### ファイル構成

#### プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API ルート
│   ├── markets/           # 市場ページ
│   └── (auth)/           # 認証ページ（ルートグループ）
├── components/            # React コンポーネント
│   ├── ui/               # 汎用UIコンポーネント
│   ├── forms/            # フォームコンポーネント
│   └── layouts/          # レイアウトコンポーネント
├── hooks/                # カスタムReactフック
├── lib/                  # ユーティリティと設定
│   ├── api/             # APIクライアント
│   ├── utils/           # ヘルパー関数
│   └── constants/       # 定数
├── types/                # TypeScript 型
└── styles/              # グローバルスタイル
```

### パフォーマンス ベストプラクティス

#### メモ化

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD: 高価な計算をメモ化
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GOOD: コールバック関数をメモ化
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### 遅延ロード

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: 重いコンポーネントを遅延ロード
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### テスト規約

#### テスト構造（AAAパターン）

```typescript
test('calculates similarity correctly', () => {
  // Arrange（準備）
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act（実行）
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert（アサーション）
  expect(similarity).toBe(0)
})
```

#### テスト命名

```typescript
// ✅ GOOD: 説明的なテスト名
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ BAD: 曖昧なテスト名
test('works', () => { })
test('test search', () => { })
```

### コードスメル検出

#### 1. 長い関数

```typescript
// ❌ BAD: 50行を超える関数
function processMarketData() {
  // 100行のコード
}

// ✅ GOOD: 小さな関数に分割
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

#### 2. 深いネスト

```typescript
// ❌ BAD: 5層以上のネスト
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // 何かをする
        }
      }
    }
  }
}

// ✅ GOOD: 早期リターン
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// 何かをする
```

#### 3. マジックナンバー

```typescript
// ❌ BAD: 説明のない数値
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GOOD: 名前付き定数
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---

## 2. backend-patterns（バックエンドパターン）

### API設計パターン

#### RESTful API構造

```typescript
// ✅ リソースベースのURL
GET    /api/markets                 # リソースをリスト
GET    /api/markets/:id             # 単一リソースを取得
POST   /api/markets                 # リソースを作成
PUT    /api/markets/:id             # リソースを置換
PATCH  /api/markets/:id             # リソースを更新
DELETE /api/markets/:id             # リソースを削除

// ✅ クエリパラメータはフィルタリング、ソート、ページネーションに使用
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### リポジトリパターン

```typescript
// データアクセスロジックを抽象化
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
  create(data: CreateMarketDto): Promise<Market>
  update(id: string, data: UpdateMarketDto): Promise<Market>
  delete(id: string): Promise<void>
}

class SupabaseMarketRepository implements MarketRepository {
  async findAll(filters?: MarketFilters): Promise<Market[]> {
    let query = supabase.from('markets').select('*')

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data
  }

  // その他のメソッド...
}
```

#### サービスレイヤーパターン

```typescript
// ビジネスロジックとデータアクセスの分離
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // ビジネスロジック
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // 完全なデータを取得
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // 類似度でソート
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // ベクトル検索の実装
  }
}
```

#### ミドルウェアパターン

```typescript
// リクエスト/レスポンス処理パイプライン
export function withAuth(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
      const user = await verifyToken(token)
      req.user = user
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' })
    }
  }
}

// 使用
export default withAuth(async (req, res) => {
  // ハンドラーはreq.userにアクセス可能
})
```

### データベースパターン

#### クエリ最適化

```typescript
// ✅ GOOD: 必要なカラムのみを選択
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ BAD: すべてを選択
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### N+1クエリ防止

```typescript
// ❌ BAD: N+1クエリ問題
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N回のクエリ
}

// ✅ GOOD: 一括取得
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1回のクエリ
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### トランザクションパターン

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Supabaseトランザクションを使用
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// SupabaseのSQL関数
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- トランザクションは自動的に開始
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- ロールバックは自動的に発生
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### キャッシュ戦略

#### Redisキャッシュレイヤー

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // 最初にキャッシュを確認
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // キャッシュミス - データベースから取得
    const market = await this.baseRepo.findById(id)

    if (market) {
      // 5分間キャッシュ
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### エラーハンドリングパターン

#### 集中的エラーハンドラー

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export function errorHandler(error: unknown, req: Request): Response {
  if (error instanceof ApiError) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: error.statusCode })
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: error.errors
    }, { status: 400 })
  }

  // 予期しないエラーをログ
  console.error('Unexpected error:', error)

  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 })
}

// 使用
export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return errorHandler(error, request)
  }
}
```

#### 指数バックオフリトライ

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (i < maxRetries - 1) {
        // 指数バックオフ: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// 使用
const data = await fetchWithRetry(() => fetchFromAPI())
```

### 認証と認可

#### JWTトークン検証

```typescript
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'user'
}

export function verifyToken(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    return payload
  } catch (error) {
    throw new ApiError(401, 'Invalid token')
  }
}

export async function requireAuth(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    throw new ApiError(401, 'Missing authorization token')
  }

  return verifyToken(token)
}

// APIルートで使用
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

#### ロールベースアクセス制御

```typescript
type Permission = 'read' | 'write' | 'delete' | 'admin'

interface User {
  id: string
  role: 'admin' | 'moderator' | 'user'
}

const rolePermissions: Record<User['role'], Permission[]> = {
  admin: ['read', 'write', 'delete', 'admin'],
  moderator: ['read', 'write', 'delete'],
  user: ['read', 'write']
}

export function hasPermission(user: User, permission: Permission): boolean {
  return rolePermissions[user.role].includes(permission)
}

export function requirePermission(permission: Permission) {
  return async (request: Request) => {
    const user = await requireAuth(request)

    if (!hasPermission(user, permission)) {
      throw new ApiError(403, 'Insufficient permissions')
    }

    return user
  }
}

// 使用
export const DELETE = requirePermission('delete')(async (request: Request) => {
  // 権限チェック付きハンドラー
})
```

### レート制限

#### シンプルなインメモリレートリミッター

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>()

  async checkLimit(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): Promise<boolean> {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []

    // ウィンドウ外の古いリクエストを削除
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // レート制限超過
    }

    // 現在のリクエストを追加
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100リクエスト/分

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // リクエスト処理を続行
}
```

### バックグラウンドタスクとキュー

#### シンプルキューパターン

```typescript
class JobQueue<T> {
  private queue: T[] = []
  private processing = false

  async add(job: T): Promise<void> {
    this.queue.push(job)

    if (!this.processing) {
      this.process()
    }
  }

  private async process(): Promise<void> {
    this.processing = true

    while (this.queue.length > 0) {
      const job = this.queue.shift()!

      try {
        await this.execute(job)
      } catch (error) {
        console.error('Job failed:', error)
      }
    }

    this.processing = false
  }

  private async execute(job: T): Promise<void> {
    // タスク実行ロジック
  }
}

// 市場のインデックス作成用
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // ブロックする代わりにキューに追加
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### ログとモニタリング

#### 構造化ロギング

```typescript
interface LogContext {
  userId?: string
  requestId?: string
  method?: string
  path?: string
  [key: string]: unknown
}

class Logger {
  log(level: 'info' | 'warn' | 'error', message: string, context?: LogContext) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    }

    console.log(JSON.stringify(entry))
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, error: Error, context?: LogContext) {
    this.log('error', message, {
      ...context,
      error: error.message,
      stack: error.stack
    })
  }
}

const logger = new Logger()

// 使用
export async function GET(request: Request) {
  const requestId = crypto.randomUUID()

  logger.info('Fetching markets', {
    requestId,
    method: 'GET',
    path: '/api/markets'
  })

  try {
    const markets = await fetchMarkets()
    return NextResponse.json({ success: true, data: markets })
  } catch (error) {
    logger.error('Failed to fetch markets', error as Error, { requestId })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## 3. frontend-patterns（フロントエンドパターン）

### コンポーネントパターン

#### 継承よりコンポジション

```typescript
// ✅ GOOD: コンポーネントコンポジション
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return <div className={`card card-${variant}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}

// 使用
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

#### 複合コンポーネント

```typescript
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export function Tabs({ children, defaultTab }: {
  children: React.ReactNode
  defaultTab: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>
}

export function Tab({ id, children }: { id: string, children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')

  return (
    <button
      className={context.activeTab === id ? 'active' : ''}
      onClick={() => context.setActiveTab(id)}
    >
      {children}
    </button>
  )
}

// 使用
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

#### Render Propsパターン

```typescript
interface DataLoaderProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

export function DataLoader<T>({ url, children }: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return <>{children(data, loading, error)}</>
}

// 使用
<DataLoader<Market[]> url="/api/markets">
  {(markets, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <Error error={error} />
    return <MarketList markets={markets!} />
  }}
</DataLoader>
```

### カスタムフックパターン

#### 状態管理フック

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// 使用
const [isOpen, toggleOpen] = useToggle()
```

#### 非同期データ取得フック

```typescript
interface UseQueryOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: UseQueryOptions<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [fetcher, options])

  useEffect(() => {
    if (options?.enabled !== false) {
      refetch()
    }
  }, [key, refetch, options?.enabled])

  return { data, error, loading, refetch }
}

// 使用
const { data: markets, loading, error, refetch } = useQuery(
  'markets',
  () => fetch('/api/markets').then(r => r.json()),
  {
    onSuccess: data => console.log('Fetched', data.length, 'markets'),
    onError: err => console.error('Failed:', err)
  }
)
```

#### デバウンスフック

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// 使用
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

### 状態管理パターン

#### Context + Reducerパターン

```typescript
interface State {
  markets: Market[]
  selectedMarket: Market | null
  loading: boolean
}

type Action =
  | { type: 'SET_MARKETS'; payload: Market[] }
  | { type: 'SELECT_MARKET'; payload: Market }
  | { type: 'SET_LOADING'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MARKETS':
      return { ...state, markets: action.payload }
    case 'SELECT_MARKET':
      return { ...state, selectedMarket: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

const MarketContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
} | undefined>(undefined)

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    markets: [],
    selectedMarket: null,
    loading: false
  })

  return (
    <MarketContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketContext.Provider>
  )
}

export function useMarkets() {
  const context = useContext(MarketContext)
  if (!context) throw new Error('useMarkets must be used within MarketProvider')
  return context
}
```

### パフォーマンス最適化

#### メモ化

```typescript
// ✅ useMemoは高価な計算に使用
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallbackは子コンポーネントに渡す関数に使用
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// ✅ React.memoは純粋コンポーネントに使用
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

#### コード分割と遅延ロード

```typescript
import { lazy, Suspense } from 'react'

// ✅ 重いコンポーネントを遅延ロード
const HeavyChart = lazy(() => import('./HeavyChart'))
const ThreeJsBackground = lazy(() => import('./ThreeJsBackground'))

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>

      <Suspense fallback={null}>
        <ThreeJsBackground />
      </Suspense>
    </div>
  )
}
```

#### 長いリストの仮想化

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // 推定行高
    overscan: 5  // 余分にレンダリングするアイテム数
  })

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <MarketCard market={markets[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### フォーム処理パターン

#### 検証付き管理フォーム

```typescript
interface FormData {
  name: string
  description: string
  endDate: string
}

interface FormErrors {
  name?: string
  description?: string
  endDate?: string
}

export function CreateMarketForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    endDate: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name must be under 200 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    try {
      await createMarket(formData)
      // 成功処理
    } catch (error) {
      // エラー処理
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Market name"
      />
      {errors.name && <span className="error">{errors.name}</span>}

      {/* その他のフィールド */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

### エラーバウンダリーパターン

```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// 使用
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### アニメーションパターン

#### Framer Motionアニメーション

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ リストアニメーション
export function AnimatedMarketList({ markets }: { markets: Market[] }) {
  return (
    <AnimatePresence>
      {markets.map(market => (
        <motion.div
          key={market.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <MarketCard market={market} />
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

// ✅ モーダルアニメーション
export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### アクセシビリティパターン

#### キーボードナビゲーション

```typescript
export function Dropdown({ options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        onSelect(options[activeIndex])
        setIsOpen(false)
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      onKeyDown={handleKeyDown}
    >
      {/* ドロップダウンの実装 */}
    </div>
  )
}
```

#### フォーカス管理

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // 現在のフォーカス要素を保存
      previousFocusRef.current = document.activeElement as HTMLElement

      // フォーカスをモーダルに移動
      modalRef.current?.focus()
    } else {
      // 閉じるときにフォーカスを復元
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  return isOpen ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      {children}
    </div>
  ) : null
}
```

---

## 4. tdd-workflow（TDDワークフロー）

### いつアクティブにするか

- 新しい機能や機能の記述
- バグや問題の修正
- 既存コードのリファクタリング
- APIエンドポイントの追加
- 新しいコンポーネントの作成

### コア原則

#### 1. テストファースト
常に最初にテストを書き、テストを通すためのコードを記述します。

#### 2. カバレッジ要件
- 最低80%カバレッジ（単体 + 統合 + E2E）
- すべてのエッジケースをカバー
- エラーシナリオをテスト
- 境界条件を検証

#### 3. テストタイプ

##### 単体テスト
- 独立した関数とユーティリティ関数
- コンポーネントロジック
- 純粋関数
- ヘルパー関数とユーティリティ

##### 統合テスト
- APIエンドポイント
- データベース操作
- サービスインタラクション
- 外部API呼び出し

##### E2Eテスト（Playwright）
- 重要なユーザーフロー
- 完全なワークフロー
- ブラウザ自動化
- UIインタラクション

### TDDワークフローのステップ

#### ステップ1: ユーザージャーニーを記述

```
As [役割], I want [操作], So that [利益]

例：
ユーザーとして、市場の意味検索をしたい、
正確なキーワードがなくても関連市場を見つけるために。
```

#### ステップ2: テストケースを生成

各ユーザージャーニーの包括的なテストケースを作成します：

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // テスト実装
  })

  it('handles empty query gracefully', async () => {
    // エッジケースのテスト
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // 低下動作のテスト
  })

  it('sorts results by similarity score', async () => {
    // ソートロジックのテスト
  })
})
```

#### ステップ3: テストを実行（失敗するはず）

```bash
npm test
# テストは失敗するはず - まだ実装していない
```

#### ステップ4: コードを実装

テストを通すための最小限のコードを記述します：

```typescript
// テストに導かれた実装
export async function searchMarkets(query: string) {
  // ここに実装
}
```

#### ステップ5: 再度テストを実行

```bash
npm test
# テストは現在通るはず
```

#### ステップ6: リファクタリング

テストを緑色に保ちながらコード品質を改善：
- 重複コードを削除
- 命名を改善
- パフォーマンスを最適化
- 可読性を向上

#### ステップ7: カバレッジを検証

```bash
npm run test:coverage
# 80%以上のカバレッジを検証
```

### テストパターン

#### 単体テストパターン（Jest/Vitest）

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

#### API統合テストパターン

```typescript
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('GET /api/markets', () => {
  it('returns markets successfully', async () => {
    const request = new NextRequest('http://localhost/api/markets')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('validates query parameters', async () => {
    const request = new NextRequest('http://localhost/api/markets?limit=invalid')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it('handles database errors gracefully', async () => {
    // データベース障害をモック
    const request = new NextRequest('http://localhost/api/markets')
    // エラーハンドリングをテスト
  })
})
```

#### E2Eテストパターン（Playwright）

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // 市場ページに移動
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // ページがロードされたことを検証
  await expect(page.locator('h1')).toContainText('Markets')

  // 市場を検索
  await page.fill('input[placeholder="Search markets"]', 'election')

  // デバウンスと結果を待機
  await page.waitForTimeout(600)

  // 検索結果が表示されることを検証
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // 結果に検索語が含まれることを検証
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // ステータスでフィルタリング
  await page.click('button:has-text("Active")')

  // フィルタリングされた結果を検証
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // 最初にログイン
  await page.goto('/creator-dashboard')

  // 市場作成フォームに入力
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // フォームを送信
  await page.click('button[type="submit"]')

  // 成功メッセージを検証
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // 市場ページへのリダイレクトを検証
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### テストファイル構成

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # 単体テスト
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # 統合テスト
└── e2e/
    ├── markets.spec.ts               # E2Eテスト
    ├── trading.spec.ts
    └── auth.spec.ts
```

### 外部サービスのモック化

#### Supabaseモック

```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [{ id: 1, name: 'Test Market' }],
          error: null
        }))
      }))
    }))
  }
}))
```

#### Redisモック

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### OpenAIモック

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // 1536次元埋め込みのモック
  ))
}))
```

### テストカバレッジ検証

#### カバレッジレポートの実行

```bash
npm run test:coverage
```

#### カバレッジ閾値

```json
{
  "jest": {
    "coverageThresholds": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### 一般的なテストエラー

#### ❌ エラー: 実装詳細をテスト

```typescript
// 内部状態をテストしない
expect(component.state.count).toBe(5)
```
#### ✅ 正解: ユーザー視認可能な動作をテスト

```typescript
// ユーザーが見るものをテスト
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ エラー: 脆弱なセレクタ

```typescript
// 壊れやすい
await page.click('.css-class-xyz')
```

#### ✅ 正解: 意味的なセレクタ

```typescript
// 変更に強い
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ エラー: テスト分離なし

```typescript
// テストが相互に依存
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* 前のテストに依存 */ })
```

#### ✅ 正解: 独立したテスト

```typescript
// 各テストが自分のデータをセットアップ
test('creates user', () => {
  const user = createTestUser()
  // テストロジック
})

test('updates user', () => {
  const user = createTestUser()
  // 更新ロジック
})
```

### 継続的テスト

#### 開発中のウォッチモード

```bash
npm test -- --watch
# ファイル変更時にテストが自動的に実行
```

#### コミット前フック

```bash
# 各コミット前に実行
npm test && npm run lint
```

#### CI/CD統合

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### ベストプラクティス

1. **テストファースト** - 常にTDD
2. **各テスト1つのアサーション** - 単一の動作に集中
3. **説明的なテスト名** - テスト内容を説明
4. **Arrange-Act-Assert** - 明確なテスト構造
5. **外部依存関係をモック化** - 単体テストを分離
6. **エッジケースをテスト** - Null、undefined、空、大きな値
7. **エラーパスをテスト** - ハッピーパスだけではない
8. **テストを高速に保つ** - 単体テスト < 50ms
9. **テスト後のクリーンアップ** - 副作用なし
10. **カバレッジレポートをレビュー** - ギャップを特定

### 成功指標

- 80%以上のコードカバレッジ実現
- すべてのテストが通過（緑）
- スキップまたは無効化されたテストなし
- 高速なテスト実行（単体テスト < 30s）
- E2Eテストが重要なユーザーフローをカバー
- 本番前にテストがバグを検出

::: tip 覚えておくこと

テストはオプションではありません。自信を持ったリファクタリング、高速な開発、本番環境の信頼性を支える安全網です。
:::

---

## 5. security-review（セキュリティレビュー）

### いつアクティブにするか

- 認証や認可の実装
- ユーザー入力やファイルアップロードの処理
- 新しいAPIエンドポイントの作成
- キーや資格情報の処理
- 支払い機能の実装
- 機密データの保存または送信
- サードパーティAPIの統合

### セキュリティチェックリスト

#### 1. キー管理

##### ❌ 絶対にやってはいけないこと

```typescript
const apiKey = "sk-proj-xxxxx"  // ハードコードされたキー
const dbPassword = "password123" // ソースコード内
```

##### ✅ 常にやるべきこと

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// キーの存在を検証
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### 検証ステップ
- [ ] ハードコードされたAPIキー、トークン、パスワードなし
- [ ] すべてのキーが環境変数にある
- [ ] `.env.local`が.gitignoreにある
- [ ] Git履歴にキーがない
- [ ] 本番キーがホスティングプラットフォーム（Vercel、Railway）にある

#### 2. 入力検証

##### 常にユーザー入力を検証

```typescript
import { z } from 'zod'

// 検証スキーマを定義
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// 処理前に検証
export async function createUser(input: unknown) {
  try {
    const validated = CreateUserSchema.parse(input)
    return await db.users.create(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    throw error
  }
}
```

##### ファイルアップロード検証

```typescript
function validateFileUpload(file: File) {
  // サイズチェック（5MB最大）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // タイプチェック
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // 拡張子チェック
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### 検証ステップ
- [ ] すべてのユーザー入力がスキーマで検証されている
- [ ] ファイルアップロード制限（サイズ、タイプ、拡張子）
- [ ] ユーザー入力をクエリで直接使用しない
- [ ] ホワイトリスト検証（ブラックリストではない）
- [ ] エラーメッセージが機密情報を漏らさない

#### 3. SQLインジェクション防止

##### ❌ 絶対にSQLを連結しない

```typescript
# 危険 - SQLインジェクション脆弱性
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ 常にパラメータ化クエリを使用

```typescript
// 安全 - パラメータ化クエリ
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// または生SQLを使用
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

##### 検証ステップ
- [ ] すべてのデータベースクエリがパラメータ化クエリを使用
- [ ] SQLでの文字列連結なし
- [ ] ORM/クエリビルダーが正しく使用されている
- [ ] Supabaseクエリが正しくサニタイズされている

#### 4. 認証と認可

##### JWTトークン処理

```typescript
// ❌ エラー: localStorage（XSS脆弱性）
localStorage.setItem('token', token)

// ✅ 正解: httpOnly cookies
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### 認可チェック

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // 常に最初に認可を検証
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // 削除を続行
  await db.users.delete({ where: { id: userId } })
}
```

##### 行レベルセキュリティ（Supabase）

```sql
-- すべてのテーブルでRLSを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のデータのみを参照可能
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- ユーザーは自分のデータのみを更新可能
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### 検証ステップ
- [ ] トークンがhttpOnly cookiesに格納（localStorageではない）
- [ ] 機密操作前の認可チェック
- [ ] Supabaseで行レベルセキュリティが有効化
- [ ] ロールベースアクセス制御の実装
- [ ] 安全なセッション管理

#### 5. XSS防止

##### HTMLサニタイズ

```typescript
import DOMPurify from 'isomorphic-dompurify'

// 常にユーザー提供のHTMLをサニタイズ
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

##### コンテンツセキュリティポリシー

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.example.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

##### 検証ステップ
- [ ] ユーザー提供のHTMLをサニタイズ
- [ ] CSPヘッダーを設定
- [ ] 検証されていない動的コンテンツのレンダリングなし
- [ ] Reactの組み込みXSS保護を使用

#### 6. CSRF保護

##### CSRFトークン

```typescript
import { csrf } from '@/lib/csrf'

export async function POST(request: Request) {
  const token = request.headers.get('X-CSRF-Token')

  if (!csrf.verify(token)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  // リクエストを処理
}
```

##### SameSite Cookies

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### 検証ステップ
- [ ] 状態変更操作にCSRFトークン
- [ ] すべてのcookieでSameSite=Strict
- [ ] ダブルサブミットcookieパターンを実装

#### 7. レート制限

##### APIレート制限

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // ウィンドウあたり100リクエスト
  message: 'Too many requests'
})

// ルートに適用
app.use('/api/', limiter)
```

##### 高価な操作

```typescript
// 検索の積極的なレート制限
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分
  max: 10, // 分あたり10リクエスト
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### 検証ステップ
- [ ] すべてのAPIエンドポイントにレート制限
- [ ] 高価な操作により厳しい制限
- [ ] IPベースのレート制限
- [ ] ユーザーベースのレート制限（認証済み）

#### 8. 機密データ露出

##### ロギング

```typescript
// ❌ エラー: 機密データをログ
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ 正解: 機密データを編集
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### エラーメッセージ

```typescript
// ❌ エラー: 内部詳細を露出
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ 正解: 一般的なエラーメッセージ
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### 検証ステップ
- [ ] ログにパスワード、トークン、キーなし
- [ ] ユーザーへのエラーメッセージは一般的
- [ ] サーバーログに詳細なエラー
- [ ] ユーザーへのスタックトレースなし

#### 9. ブロックチェーンセキュリティ（Solana）

##### ウォレット検証

```typescript
import { verify } from '@solana/web3.js'

async function verifyWalletOwnership(
  publicKey: string,
  signature: string,
  message: string
) {
  try {
    const isValid = verify(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      Buffer.from(publicKey, 'base64')
    )
    return isValid
  } catch (error) {
    return false
  }
}
```

##### 取引検証

```typescript
async function verifyTransaction(transaction: Transaction) {
  // 受信者を検証
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // 金額を検証
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // ユーザーが十分な残高を持っているか確認
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### 検証ステップ
- [ ] ウォレット署名を検証
- [ ] 取引詳細を検証
- [ ] 取引前の残高チェック
- [ ] 盲目的な取引署名なし

#### 10. 依存関係セキュリティ

##### 定期的な更新

```bash
# 脆弱性をチェック
npm audit

# 修正可能な問題を自動修正
npm audit fix

# 依存関係を更新
npm update

# 古いパッケージをチェック
npm outdated
```

##### ロックファイル

```bash
# 常にロックファイルをコミット
git add package-lock.json

# CI/CDで再現可能ビルドに使用
npm ci  # npm installではなく
```

##### 検証ステップ
- [ ] 依存関係が最新
- [ ] 既知の脆弱性なし（npm audit clean）
- [ ] ロックファイルをコミット
- [ ] GitHubでDependabotを有効化
- [ ] 定期的なセキュリティ更新

### セキュリティテスト

#### 自動セキュリティテスト

```typescript
// 認証テスト
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// 認可テスト
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// 入力検証テスト
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// レート制限テスト
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### デプロイ前セキュリティチェックリスト

本番デプロイの前に：

- [ ] **キー**: ハードコードされたキーなし、すべて環境変数
- [ ] **入力検証**: すべてのユーザー入力が検証済み
- [ ] **SQLインジェクション**: すべてのクエリがパラメータ化
- [ ] **XSS**: ユーザーコンテンツがサニタイズ済み
- [ ] **CSRF**: 保護が有効化
- [ ] **認証**: 正しいトークン処理
- [ ] **認可**: ロールチェックが実装
- [ ] **レート制限**: すべてのエンドポイントで有効化
- [ ] **HTTPS**: 本番で強制
- [ ] **セキュリティヘッダー**: CSP、X-Frame-Optionsが設定済み
- [ ] **エラーハンドリング**: エラーに機密データなし
- [ ] **ロギング**: ログに機密データなし
- [ ] **依存関係**: 最新、脆弱性なし
- [ ] **行レベルセキュリティ**: Supabaseで有効化
- [ ] **CORS**: 正しく設定
- [ ] **ファイルアップロード**: 検証済み（サイズ、タイプ）
- [ ] **ウォレット署名**: 検証済み（ブロックチェーンの場合）

::: tip 覚えておくこと

セキュリティはオプションではありません。1つの脆弱性がプラットフォーム全体を危険に晒す可能性があります。疑わしい場合は、慎重な方を選択してください。
:::

---

## 6. continuous-learning（継続的学習）

### 動作原理

このスキルは各セッションの終了時に**Stop hook**として実行されます：

1. **セッション評価**: セッションに十分なメッセージがあるか確認（デフォルト：10以上）
2. **パターン検出**: セッションから抽出可能なパターンを識別
3. **スキル抽出**: 有用なパターンを`~/.claude/skills/learned/`に保存

### 設定

`config.json`を編集してカスタマイズ：

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

### パターンタイプ

| パターン | 説明 |
|--- | ---|
| `error_resolution` | 特定のエラーを解決する方法 |
| `user_corrections` | ユーザー修正からのパターン |
| `workarounds` | フレームワーク/ライブラリの癖に対する回避策 |
| `debugging_techniques` | 効果的なデバッグ方法 |
| `project_specific` | プロジェクト固有の規約 |

### Hook設定

`~/.claude/settings.json`に追加：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

### なぜStop Hookを使うのか

- **軽量**: セッションの終了時に1回だけ実行
- **非ブロッキング**: 各メッセージに遅延を追加しない
- **完全なコンテキスト**: 完全なセッション履歴にアクセス可能

### 関連

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 継続的学習セクション
- `/learn`コマンド - セッション中に手動でパターンを抽出

---

## 7. strategic-compact（戦略的圧縮）

### なぜ戦略的圧縮を使うのか

自動圧縮は任意の時点でトリガー：
- 通常はタスクの途中で、重要なコンテキストを失う
- 論理的なタスク境界の意識がない
- 複雑なマルチステップ操作を中断する可能性がある

論理的な境界での戦略的圧縮：
- **探索後、実行前** - 研究コンテキストを圧縮、実装計画を維持
- **マイルストーン完了後** - 次のフェーズの新しい開始
- **主要なコンテキスト切り替え前** - 異なるタスクの前に研究コンテキストをクリア

### 動作原理

`suggest-compact.sh`スクリプトはPreToolUse（Edit/Write）で実行され：

1. **ツール呼び出しを追跡** - セッション内のツール呼び出し回数をカウント
2. **閾値検出** - 設定可能な閾値で提案（デフォルト：50回呼び出し）
3. **定期リマインダー** - 閾値後25回呼び出しごとにリマインド

### Hook設定

`~/.claude/settings.json`に追加：

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "tool == \"Edit\" || tool == \"Write\"",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
      }]
    }]
  }
}
```

### 設定

環境変数：
- `COMPACT_THRESHOLD` - 最初の提案前のツール呼び出し（デフォルト：50）

### ベストプラクティス

1. **計画後に圧縮** - 計画完了後、圧縮で再開
2. **デバッグ後に圧縮** - 続行する前にエラー解決コンテキストをクリア
3. **実装中に圧縮しない** - 関連する変更のためにコンテキストを維持
4. **提案を読む** - Hookが「いつ」を伝え、あなたが「かどうか」を決める

### 関連

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Token最適化セクション
- Memory persistence hooks - 圧縮後に維持された状態を永続化

---

## 8. eval-harness（評価ハーネス）

### 哲学

評価駆動開発は評価を「AI開発の単体テスト」として扱います：
- 実装前に期待される動作を定義
- 開発中に継続的に評価を実行
- 各変更の回帰を追跡
- pass@k指標で信頼性を測定

### 評価タイプ

#### 機能評価

Claudeが以前できなかったことをテスト：
```markdown
[CAPABILITY EVAL: feature-name]
Task: Claudeが達成すべきことの説明
Success Criteria:
  - [ ] 基準1
  - [ ] 基準2
  - [ ] 基準3
Expected Output: 期待される結果の説明
```

#### 回帰評価

変更が既存の機能を破壊しないことを確認：
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHAまたはチェックポイント名
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

### 評価者タイプ

#### 1. コードベース評価者

コードの決定的チェックを使用：
```bash
# ファイルが期待されるパターンを含むかチェック
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# テストが通るかチェック
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# ビルドが成功するかチェック
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. モデルベース評価者

Claudeを使用して開放的な出力を評価：
```markdown
[MODEL GRADER PROMPT]
Evaluate following code change:
1. Does it solve stated problem?
2. Is it well-structured?
3. Are edge cases handled?
4. Is error handling appropriate?

Score: 1-5 (1=poor, 5=excellent)
Reasoning: [explanation]
```

#### 3. 人力評価者

手動レビューのためにマーク：
```markdown
[HUMAN REVIEW REQUIRED]
Change: 何が変更されたかの説明
Reason: なぜ手動レビューが必要か
Risk Level: LOW/MEDIUM/HIGH
```

### 指標

#### pass@k

「k回の試行で少なくとも1回成功」
- pass@1: 初回試行成功率
- pass@3: 3回以内の成功率
- 典型的な目標: pass@3 > 90%

#### pass^k

「すべてのk回の試行が成功」
- より高い信頼性閾値
- pass^3: 3回連続成功
- 重要なパスに使用

### 評価ワークフロー

#### 1. 定義（コーディング前）

```markdown
## EVAL DEFINITION: feature-xyz

### Capability Evals
1. Can create new user account
2. Can validate email format
3. Can hash password securely

### Regression Evals
1. Existing login still works
2. Session management unchanged
3. Logout flow intact

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

#### 2. 実装

定義された評価を通過するコードを記述。

#### 3. 評価

```bash
# 機能評価を実行
[Run each capability eval, record PASS/FAIL]

# 回帰評価を実行
npm test -- --testPathPattern="existing"

# レポートを生成
```

#### 4. レポート

```markdown
EVAL REPORT: feature-xyz
=======================

Capability Evals:
  create-user:     PASS (pass@1)
  validate-email:  PASS (pass@2)
  hash-password:   PASS (pass@1)
  Overall:         3/3 passed

Regression Evals:
  login-flow:      PASS
  session-mgmt:    PASS
  logout-flow:     PASS
  Overall:         3/3 passed

Metrics:
  pass@1: 67% (2/3)
  pass@3: 100% (3/3)

Status: READY FOR REVIEW
```

### 統合パターン

#### 実装前

```
/eval define feature-name
```
`.claude/evals/feature-name.md`に評価定義ファイルを作成

#### 実装中

```
/eval check feature-name
```
現在の評価を実行して状態を報告

#### 実装後

```
/eval report feature-name
```
完全な評価レポートを生成

### 評価の保存

評価をプロジェクトに保存：

```
.claude/
  evals/
    feature-xyz.md      # 評価定義
    feature-xyz.log     # 評価実行履歴
    baseline.json       # 回帰ベースライン
```

### ベストプラクティス

1. **コーディング前に評価を定義** - 成功基準の明確な思考を強制
2. **頻繁に評価を実行** - 回帰を早期に捕捉
3. **時間とともにpass@kを追跡** - 信頼性トレンドを監視
4. **可能な限りコード評価者を使用** - 決定論 > 確率論
5. **手動レビューを安全に** - セキュリティチェックを完全に自動化しない
6. **評価を高速に保つ** - 遅い評価は実行されない
7. **評価をコードでバージョン管理** - 評価は第一級のアーティファクト

### 例: 認証の追加

```markdown
## EVAL: add-authentication

### Phase 1: Define (10 min)
Capability Evals:
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

Regression Evals:
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Phase 2: Implement (varies)
[Write code]

### Phase 3: Evaluate
Run: /eval check add-authentication

### Phase 4: Report
EVAL REPORT: add-authentication
============================
Capability: 5/5 passed (pass@3: 100%)
Regression: 3/3 passed (pass^3: 100%)
Status: SHIP IT
```

---

## 9. verification-loop（検証ループ）

### いつ使用するか

このスキルを次の場合に呼び出します：
- 機能または重大なコード変更の完了後
- PRの作成前
- 品質チェックが通過していることを確認したいとき
- リファクタリング後

### 検証フェーズ

#### フェーズ1: ビルド検証

```bash
# プロジェクトがビルドするかチェック
npm run build 2>&1 | tail -20
# または
pnpm build 2>&1 | tail -20
```

ビルドが失敗した場合、停止して修正を続行。

#### フェーズ2: 型チェック

```bash
# TypeScriptプロジェクト
npx tsc --noEmit 2>&1 | head -30

# Pythonプロジェクト
pyright . 2>&1 | head -30
```

すべての型エラーを報告。続行前に重要なエラーを修正。

#### フェーズ3: Lintチェック

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### フェーズ4: テストスイート

```bash
# カバレッジ付きでテストを実行
npm run test -- --coverage 2>&1 | tail -50

# カバレッジ閾値をチェック
# 目標: 80%最低
```

報告：
- 総テスト数: X
- 通過: X
- 失敗: X
- カバレッジ: X%

#### フェーズ5: セキュリティスキャン

```bash
# キーをチェック
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# console.logをチェック
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### フェーズ6: Diffレビュー

```bash
# 変更内容を表示
git diff --stat
git diff HEAD~1 --name-only
```

各変更ファイルをレビュー：
- 予期しない変更
- エラーハンドリングの欠落
- 潜在的なエッジケース

### 出力フォーマット

すべてのフェーズを実行した後、検証レポートを生成：

```
VERIFICATION REPORT
===================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...
```

### 継続モード

長いセッションでは、15分ごとまたは重大な変更後に検証を実行：

```markdown
心理的チェックポイントを設定：
- 各関数の完了後
- 各コンポーネントの完了後
- 次のタスクに移動する前

実行: /verify
```

### Hooksとの統合

このスキルはPostToolUse hooksを補完しますが、より深い検証を提供します。Hooksは即座に問題を捕捉;このスキルは包括的なレビューを提供。

---

## 10. project-guidelines-example（プロジェクトガイドラインの例）

これはプロジェクト固有スキルの例です。独自のプロジェクトのテンプレートとして使用してください。

本番アプリケーションに基づく: [Zenith](https://zenith.chat) - AI駆動顧客発見プラットフォーム。

### いつ使用するか

設計された特定のプロジェクトを扱う際にこのスキルを参照。プロジェクトスキルには次が含まれます：
- アーキテクチャ概要
- ファイル構造
- コードパターン
- テスト要件
- デプロイワークフロー

---

## 11. clickhouse-io（ClickHouse I/O）

### 概要

ClickHouseはオンライン分析処理（OLAP）用のカラム指向データベース管理システムです。大きなデータセットでの高速な分析クエリに最適化されています。

**主要な特徴：**
- カラム指向ストレージ
- データ圧縮
- 並列クエリ実行
- 分散クエリ
- リアルタイム分析

### テーブル設計パターン

#### MergeTreeエンジン（最も一般的）

```sql
CREATE TABLE markets_analytics (
    date Date,
    market_id String,
    market_name String,
    volume UInt64,
    trades UInt32,
    unique_traders UInt32,
    avg_trade_size Float64,
    created_at DateTime
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, market_id)
SETTINGS index_granularity = 8192;
```

#### ReplacingMergeTree（重複排除）

```sql
-- 重複する可能性のあるデータ（例：複数のソースから）
CREATE TABLE user_events (
    event_id String,
    user_id String,
    event_type String,
    timestamp DateTime,
    properties String
) ENGINE = ReplacingMergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (user_id, event_id, timestamp)
PRIMARY KEY (user_id, event_id);
```

#### AggregatingMergeTree（事前集計）

```sql
-- 集計指標を維持
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- 集計データをクエリ
SELECT
    hour,
    market_id,
    sumMerge(total_volume) AS volume,
    countMerge(total_trades) AS trades,
    uniqMerge(unique_users) AS users
FROM market_stats_hourly
WHERE hour >= toStartOfHour(now() - INTERVAL 24 HOUR)
GROUP BY hour, market_id
ORDER BY hour DESC;
```

### クエリ最適化パターン

#### 効率的なフィルタリング

```sql
-- ✅ GOOD: 最初にインデックス列を使用
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ BAD: 最初に非インデックス列をフィルタリング
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### 集計

```sql
-- ✅ GOOD: ClickHouse固有の集計関数を使用
SELECT
    toStartOfDay(created_at) AS day,
    market_id,
    sum(volume) AS total_volume,
    count() AS total_trades,
    uniq(trader_id) AS unique_traders,
    avg(trade_size) AS avg_size
FROM trades
WHERE created_at >= today() - INTERVAL 7 DAY
GROUP BY day, market_id
ORDER BY day DESC, total_volume DESC;

-- ✅ quantileを百分位数として使用（percentileより効率的）
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### データ挿入パターン

#### バルク挿入（推奨）

```typescript
import { ClickHouse } from 'clickhouse'

const clickhouse = new ClickHouse({
  url: process.env.CLICKHOUSE_URL,
  port: 8123,
  basicAuth: {
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD
  }
})

// ✅ バルク挿入（効率的）
async function bulkInsertTrades(trades: Trade[]) {
  const values = trades.map(trade => `(
    '${trade.id}',
    '${trade.market_id}',
    '${trade.user_id}',
    ${trade.amount},
    '${trade.timestamp.toISOString()}'
  )`).join(',')

  await clickhouse.query(`
    INSERT INTO trades (id, market_id, user_id, amount, timestamp)
    VALUES ${values}
  `).toPromise()
}

// ❌ 個別挿入（遅い）
async function insertTrade(trade: Trade) {
  // ループ内でこれをしないでください！
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### ストリーミング挿入

```typescript
// 連続データインポート用
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

async function streamInserts() {
  const stream = clickhouse.insert('trades').stream()

  for await (const batch of dataSource) {
    stream.write(batch)
  }

  await stream.end()
}
```

### マテリアライズドビュー

#### リアルタイム集計

```sql
-- 時間別統計のマテリアライズドビューを作成
CREATE MATERIALIZED VIEW market_stats_hourly_mv
TO market_stats_hourly
AS SELECT
    toStartOfHour(timestamp) AS hour,
    market_id,
    sumState(amount) AS total_volume,
    countState() AS total_trades,
    uniqState(user_id) AS unique_users
FROM trades
GROUP BY hour, market_id;

-- マテリアライズドビューをクエリ
SELECT
    hour,
    market_id,
    sumMerge(total_volume) AS volume,
    countMerge(total_trades) AS trades,
    uniqMerge(unique_users) AS users
FROM market_stats_hourly
WHERE hour >= now() - INTERVAL 24 HOUR
GROUP BY hour, market_id;
```

### パフォーマンスモニタリング

#### クエリパフォーマンス

```sql
-- 遅いクエリをチェック
SELECT
    query_id,
    user,
    query,
    query_duration_ms,
    read_rows,
    read_bytes,
    memory_usage
FROM system.query_log
WHERE type = 'QueryFinish'
  AND query_duration_ms > 1000
  AND event_time >= now() - INTERVAL 1 HOUR
ORDER BY query_duration_ms DESC
LIMIT 10;
```

#### テーブル統計

```sql
-- テーブルサイズをチェック
SELECT
    database,
    table,
    formatReadableSize(sum(bytes)) AS size,
    sum(rows) AS rows,
    max(modification_time) AS latest_modification
FROM system.parts
WHERE active
GROUP BY database, table
ORDER BY sum(bytes) DESC;
```

### 一般的な分析クエリ

#### タイムシリーズ分析

```sql
-- デイリーアクティブユーザー
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- リテンション分析
SELECT
    signup_date,
    countIf(days_since_signup = 0) AS day_0,
    countIf(days_since_signup = 1) AS day_1,
    countIf(days_since_signup = 7) AS day_7,
    countIf(days_since_signup = 30) AS day_30
FROM (
    SELECT
        user_id,
        min(toDate(timestamp)) AS signup_date,
        toDate(timestamp) AS activity_date,
        dateDiff('day', signup_date, activity_date) AS days_since_signup
    FROM events
    GROUP BY user_id, activity_date
)
GROUP BY signup_date
ORDER BY signup_date DESC;
```

#### ファネル分析

```sql
-- コンバージョンファネル
SELECT
    countIf(step = 'viewed_market') AS viewed,
    countIf(step = 'clicked_trade') AS clicked,
    countIf(step = 'completed_trade') AS completed,
    round(clicked / viewed * 100, 2) AS view_to_click_rate,
    round(completed / clicked * 100, 2) AS click_to_completion_rate
FROM (
    SELECT
        user_id,
        session_id,
        event_type AS step
    FROM events
    WHERE event_date = today()
)
GROUP BY session_id;
```

#### コホート分析

```sql
-- 登録月別ユーザーコホート
SELECT
    toStartOfMonth(signup_date) AS cohort,
    toStartOfMonth(activity_date) AS month,
    dateDiff('month', cohort, month) AS months_since_signup,
    count(DISTINCT user_id) AS active_users
FROM (
    SELECT
        user_id,
        min(toDate(timestamp)) OVER (PARTITION BY user_id) AS signup_date,
        toDate(timestamp) AS activity_date
    FROM events
)
GROUP BY cohort, month, months_since_signup
ORDER BY cohort, months_since_signup;
```

### データパイプラインパターン

#### ETLパターン

```typescript
// 抽取、変換、ロード
async function etlPipeline() {
  // 1. ソースから抽出
  const rawData = await extractFromPostgres()

  // 2. 変換
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. ClickHouseにロード
  await bulkInsertToClickHouse(transformed)
}

// 定期的実行
setInterval(etlPipeline, 60 * 60 * 1000)  // 毎時間
```

#### 変更データキャプチャ（CDC）

```typescript
// PostgreSQLの変更をリッスンしてClickHouseに同期
import { Client } from 'pg'

const pgClient = new Client({ connectionString: process.env.DATABASE_URL })

pgClient.query('LISTEN market_updates')

pgClient.on('notification', async (msg) => {
  const update = JSON.parse(msg.payload)

  await clickhouse.insert('market_updates', [
    {
      market_id: update.id,
      event_type: update.operation,  // INSERT, UPDATE, DELETE
      timestamp: new Date(),
      data: JSON.stringify(update.new_data)
    }
  ])
})
```

### ベストプラクティス

#### 1. パーティション戦略
- 時間でパーティション分割（通常は月または日）
- パーティションが多すぎないように（パフォーマンス影響）
- パーティションキーにDATE型を使用

#### 2. ソートキー
- 最も頻繁にフィルタリングする列を最初に配置
- 基数を考慮（高基数優先）
- ソートは圧縮に影響

#### 3. データ型
- 最小適切な型を使用（UInt32 vs UInt64）
- 繰り返し文字列にLowCardinalityを使用
- カテゴリデータにEnumを使用

#### 4. 避けるべきこと
- SELECT *（列を指定）
- FINAL（クエリ前にデータをマージ）
- 多すぎるJOIN（分析時に非正規化）
- 小さな頻繁な挿入（代わりにバルク）

#### 5. モニタリング
- クエリパフォーマンスを追跡
- ディスク使用を監視
- マージ操作をチェック
- 遅いクエリログをレビュー

::: tip 覚えておくこと

ClickHouseは分析ワークロードで優れています。クエリパターン用にテーブルを設計し、バルク挿入を行い、リアルタイム集計にマテリアライズドビューを活用してください。
:::

---

## 次のレッスンの予告

> 次のレッスンでは**[Scripts APIリファレンス](../scripts-api/)**を学習します。
>
> 学習内容：
> - Node.jsスクリプトインターフェースとユーティリティ関数
> - パッケージマネージャー検出メカニズム
> - Hooksスクリプトの実装詳細
> - テストスイートの使用方法

---

## 本レッスンのまとめ

Everything Claude Codeの11個のスキルライブラリは、開発プロセスに包括的な知識サポートを提供します：

1. **coding-standards** - コーディング規約の統一、不変パターン、ベストプラクティス
2. **backend-patterns** - バックエンドアーキテクチャパターン、API設計、データベース最適化
3. **frontend-patterns** - React/Next.jsパターン、状態管理、パフォーマンス最適化
4. **tdd-workflow** - テスト駆動開発ワークフロー、80%以上カバレッジ
5. **security-review** - OWASP Top 10、入力検証、脆弱性検出
6. **continuous-learning** - 再利用可能なパターンの自動抽出、知識の蓄積
7. **strategic-compact** - 戦略的コンテキスト圧縮、Token最適化
8. **eval-harness** - 評価駆動開発、信頼性テスト
9. **verification-loop** - 包括的検証システム、品質チェック
10. **project-guidelines-example** - プロジェクト設定の例、アーキテクチャテンプレート
11. **clickhouse-io** - ClickHouse分析パターン、高性能クエリ

これらのスキルライブラリはコード品質の羅針盤であることを覚えておいてください。開発プロセス中に正しく適用することで、開発効率とコード品質を大幅に向上させることができます。

---

## 付録: ソースコード参照

<details>
<summary><strong>クリックしてソースコード位置を展開</strong></summary>

> 更新日時: 2026-01-25

| スキルライブラリ | ファイルパス | 行号 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**重要な原則**：
- **coding-standards**: 不変パターン、ファイル < 800行、関数 < 50行、80%以上テストカバレッジ
- **backend-patterns**: Repositoryパターン、Serviceレイヤー分離、パラメータ化クエリ、Redisキャッシュ
- **frontend-patterns**: コンポーネントコンポジション、カスタムフック、Context + Reducer、メモ化、遅延ロード
- **tdd-workflow**: テストファースト、単体/統合/E2Eテスト、テストカバレッジ検証
- **security-review**: OWASP Top 10チェック、入力検証、SQLインジェクション防止、XSS防止

**関連エージェント**：
- **tdd-guide**: TDDプロセスガイダンス
- **code-reviewer**: コード品質とスタイルレビュー
- **security-reviewer**: セキュリティ脆弱性検出
- **architect**: アーキテクチャ設計とパターン選択

</details>
