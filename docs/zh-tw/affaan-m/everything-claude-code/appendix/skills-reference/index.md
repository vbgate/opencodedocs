
#### 自定義 Hooks

```typescript
// ✅ GOOD: 可複用的自定義 hook
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

#### 狀態更新

```typescript
// ✅ GOOD: 函式式狀態更新
const [count, setCount] = useState(0)

// 基於前一個狀態的更新
setCount(prev => prev + 1)

// ❌ BAD: 直接引用狀態
setCount(count + 1)  // 在非同步場景中可能過時
```

### API 設計標準

#### REST API 約定

```
GET    /api/markets              # 列出所有市場
GET    /api/markets/:id          # 獲取特定市場
POST   /api/markets              # 建立新市場
PUT    /api/markets/:id          # 替換市場（完整）
PATCH  /api/markets/:id          # 更新市場（部分）
DELETE /api/markets/:id          # 刪除市場

# 查詢參數用於過濾、排序、分頁
GET /api/markets?status=active&limit=10&offset=0
```

#### 響應格式

```typescript
// ✅ GOOD: 一致的響應結構
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

// 成功響應
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// 錯誤響應
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### 輸入驗證

```typescript
import { z } from 'zod'

// ✅ GOOD: Schema 驗證
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
    // 繼續處理驗證後的數據
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

### 文件組織

#### 項目結構

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── markets/           # 市場頁面
│   └── (auth)/           # 認證頁面（路由組）
├── components/            # React 元件
│   ├── ui/               # 通用 UI 元件
│   ├── forms/            # 表單元件
│   └── layouts/          # 佈局元件
├── hooks/                # 自定義 React hooks
├── lib/                  # 工具和配置
│   ├── api/             # API 客戶端
│   ├── utils/           # 輔助函數
│   └── constants/       # 常數
├── types/                # TypeScript 類型
└── styles/              # 全局樣式
```

### 性能最佳實踐

#### 記憶化

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD: 記憶化昂貴的計算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GOOD: 記憶化回調函數
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### 懶加載

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: 懶加載重型元件
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### 測試標準

#### 測試結構（AAA 模式）

```typescript
test('calculates similarity correctly', () => {
  // Arrange（準備）
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act（執行）
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert（斷言）
  expect(similarity).toBe(0)
})
```

#### 測試命名

```typescript
// ✅ GOOD: 描述性測試名稱
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ BAD: 模糊的測試名稱
test('works', () => { })
test('test search', () => { })
```

### 代碼異味檢測

#### 1. 長函數

```typescript
// ❌ BAD: 函數超過 50 行
function processMarketData() {
  // 100 行代碼
}

// ✅ GOOD: 拆分為小函數
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

#### 2. 深層嵌套

```typescript
// ❌ BAD: 5+ 層嵌套
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // 做一些事情
        }
      }
    }
  }
}

// ✅ GOOD: 提前返回
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// 做一些事情
```

#### 3. 魔法數字

```typescript
// ❌ BAD: 未解釋的數字
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GOOD: 命名常數
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---

## 2. backend-patterns（後端模式）

### API 設計模式

#### RESTful API 結構

```typescript
// ✅ 基於資源的 URL
GET    /api/markets                 # 列出資源
GET    /api/markets/:id             # 獲取單個資源
POST   /api/markets                 # 建立資源
PUT    /api/markets/:id             # 替換資源
PATCH  /api/markets/:id             # 更新資源
DELETE /api/markets/:id             # 刪除資源

// ✅ 查詢參數用於過濾、排序、分頁
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### Repository 模式

```typescript
// 抽象資料存取邏輯
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

  // 其他方法...
}
```

#### Service 層模式

```typescript
// 業務邏輯與資料存取分離
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // 業務邏輯
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // 獲取完整資料
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // 按相似度排序
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // 向量搜尋實現
  }
}
```

#### 中介軟體模式

```typescript
// 請求/響應處理管道
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
  // 處理程式可以訪問 req.user
})
```

### 資料庫模式

#### 查詢優化

```typescript
// ✅ GOOD: 只選擇需要的列
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ BAD: 選擇所有內容
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### N+1 查詢預防

```typescript
// ❌ BAD: N+1 查詢問題
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N 次查詢
}

// ✅ GOOD: 批次獲取
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 次查詢
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### 事務模式

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // 使用 Supabase 事務
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// Supabase 中的 SQL 函數
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- 事務自動開始
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- 回滾自動發生
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### 快取策略

#### Redis 快取層

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // 先檢查快取
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // 快取未命中 - 從資料庫獲取
    const market = await this.baseRepo.findById(id)

    if (market) {
      // 快取 5 分鐘
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### 錯誤處理模式

#### 集中式錯誤處理器

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

  // 記錄意外錯誤
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

#### 指數退避重試

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
        // 指數退避：1s, 2s, 4s
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

### 認證與授權

#### JWT 令牌驗證

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

// 在 API 路由中使用
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

#### 基於角色的存取控制

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
  // 帶權限檢查的處理程式
})
```

### 速率限制

#### 簡單的記憶體速率限制器

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

    // 移除視窗外的舊請求
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // 超過速率限制
    }

    // 添加當前請求
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 請求/分鐘

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // 繼續處理請求
}
```

### 後台任務與佇列

#### 簡單佇列模式

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
    // 任務執行邏輯
  }
}

// 用於索引市場
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // 添加到佇列而不是阻塞
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### 日誌與監控

#### 結構化日誌

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

## 3. frontend-patterns（前端模式）

### 元件模式

#### 組合優於繼承

```typescript
// ✅ GOOD: 元件組合
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

#### 複合元件

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

#### Render Props 模式

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

### 自定義 Hooks 模式

#### 狀態管理 Hook

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

#### 非同步資料獲取 Hook

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

#### 防抖 Hook

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

### 狀態管理模式

#### Context + Reducer 模式

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

### 性能優化

#### 記憶化

```typescript
// ✅ useMemo 用於昂貴的計算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallback 用於傳遞給子組件的函數
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// ✅ React.memo 用於純組件
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

#### 代碼分割與懶加載

```typescript
import { lazy, Suspense } from 'react'

// ✅ 懶加載重型組件
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

#### 長列表虛擬化

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // 估算的行高
    overscan: 5  // 額外渲染的項目
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

### 表單處理模式

#### 帶驗證的受控表單

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
      // 成功處理
    } catch (error) {
      // 錯誤處理
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

      {/* 其他字段 */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

### 錯誤邊界模式

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

### 動畫模式

#### Framer Motion 動畫

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ 列表動畫
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

// ✅ 模態框動畫
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

### 可訪問性模式

#### 鍵盤導航

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
      {/* 下拉框實現 */}
    </div>
  )
}
```

#### 焦點管理

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // 保存當前焦點元素
      previousFocusRef.current = document.activeElement as HTMLElement

      // 焦點移動到模態框
      modalRef.current?.focus()
    } else {
      // 關閉時恢復焦點
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

## 4. tdd-workflow（TDD 工作流程）

### 何時啟用

- 編寫新功能或功能
- 修復 Bug 或問題
- 重構現有代碼
- 新增 API 端點
- 建立新元件

### 核心原則

#### 1. 測試先行
始終先寫測試，然後編寫代碼使測試通過。

#### 2. 覆蓋率要求
- 最低 80% 覆蓋率（單元 + 整合 + E2E）
- 覆蓋所有邊緣情況
- 測試錯誤場景
- 驗證邊界條件

#### 3. 測試類型

##### 單元測試
- 獨立函式和工具函式
- 元件邏輯
- 純函式
- 輔助函式和工具

##### 整合測試
- API 端點
- 資料庫操作
- 服務互動
- 外部 API 呼叫

##### E2E 測試（Playwright）
- 關鍵使用者流程
- 完整的工作流程
- 瀏覽器自動化
- UI 互動

### TDD 工作流程步驟

#### 步驟 1：編寫使用者旅程

```
作為 [角色]，我想要 [操作]，以便 [利益]

範例：
作為使用者，我想要語意搜尋市場，
以便即使沒有精確關鍵詞也能找到相關市場。
```

#### 步驟 2：生成測試用例

為每個使用者旅程建立全面的測試用例：

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // 測試實現
  })

  it('handles empty query gracefully', async () => {
    // 測試邊緣情況
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // 測試降級行為
  })

  it('sorts results by similarity score', async () => {
    // 測試排序邏輯
  })
})
```

#### 步驟 3：執行測試（應該失敗）

```bash
npm test
# 測試應該失敗 - 我們還沒有實現
```

#### 步驟 4：實現代碼

編寫最小代碼使測試通過：

```typescript
// 由測試引導的實現
export async function searchMarkets(query: string) {
  // 實現這裡
}
```

#### 步驟 5：再次執行測試

```bash
npm test
# 測試現在應該通過
```

#### 步驟 6：重構

在保持測試綠色的同時改進代碼品質：
- 移除重複代碼
- 改進命名
- 最佳化效能
- 增強可讀性

#### 步驟 7：驗證覆蓋率

```bash
npm run test:coverage
# 驗證達到 80%+ 覆蓋率
```

### 測試模式

#### 單元測試模式（Jest/Vitest）

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

#### API 整合測試模式

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
    // 模擬資料庫失敗
    const request = new NextRequest('http://localhost/api/markets')
    // 測試錯誤處理
  })
})
```

#### E2E 測試模式（Playwright）

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // 導航到市場頁面
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // 驗證頁面已載入
  await expect(page.locator('h1')).toContainText('Markets')

  // 搜尋市場
  await page.fill('input[placeholder="Search markets"]', 'election')

  // 等待防抖和結果
  await page.waitForTimeout(600)

  // 驗證顯示搜尋結果
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // 驗證結果包含搜尋詞
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // 按狀態過濾
  await page.click('button:has-text("Active")')

  // 驗證過濾後的結果
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // 先登入
  await page.goto('/creator-dashboard')

  // 填寫市場建立表單
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // 提交表單
  await page.click('button[type="submit"]')

  // 驗證成功訊息
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // 驗證重定向到市場頁面
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### 測試文件組織

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # 單元測試
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # 整合測試
└── e2e/
    ├── markets.spec.ts               # E2E 測試
    ├── trading.spec.ts
    └── auth.spec.ts
```

### 模擬外部服務

#### Supabase 模擬

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

#### Redis 模擬

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### OpenAI 模擬

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // 模擬 1536 維嵌入
  ))
}))
```

### 測試覆蓋率驗證

#### 執行覆蓋率報告

```bash
npm run test:coverage
```

#### 覆蓋率閾值

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

### 常見測試錯誤

#### ❌ 錯誤：測試實現細節

```typescript
// 不要測試內部狀態
expect(component.state.count).toBe(5)
```

#### ✅ 正確：測試使用者可見行為

```typescript
// 測試使用者看到的內容
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ 錯誤：脆弱選擇器

```typescript
// 容易斷裂
await page.click('.css-class-xyz')
```

#### ✅ 正確：語義化選擇器

```typescript
// 對更改具有彈性
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ 錯誤：沒有測試隔離

```typescript
// 測試相互依賴
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* 依賴上一個測試 */ })
```

#### ✅ 正確：獨立的測試

```typescript
// 每個測試設定自己的資料
test('creates user', () => {
  const user = createTestUser()
  // 測試邏輯
})

test('updates user', () => {
  const user = createTestUser()
  // 更新邏輯
})
```

### 持續測試

#### 開發期間的監視模式

```bash
npm test -- --watch
# 文件更改時測試自動執行
```

#### 提交前鉤子

```bash
# 每次提交前執行
npm test && npm run lint
```

#### CI/CD 整合

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### 最佳實踐

1. **先寫測試** - 始終 TDD
2. **每個測試一個斷言** - 專注於單一行為
3. **描述性測試名稱** - 解釋測試內容
4. **Arrange-Act-Assert** - 清晰的測試結構
5. **模擬外部依賴** - 隔離單元測試
6. **測試邊緣情況** - Null、undefined、空、大值
7. **測試錯誤路徑** - 不僅僅是快樂路徑
8. **保持測試快速** - 單元測試 < 50ms
9. **測試後清理** - 無副作用
10. **審查覆蓋率報告** - 識別缺口

### 成功指標

- 80%+ 代碼覆蓋率實現
- 所有測試通過（綠色）
- 無跳過或禁用的測試
- 快速測試執行（單元測試 < 30s）
- E2E 測試覆蓋關鍵使用者流程
- 測試在生產前捕獲 Bug

::: tip 記住

測試不是可選的。它們是支援自信重構、快速開發和生產可靠性的安全網。
:::

---

## 5. security-review（安全審查）

### 何時啟用

- 實現認證或授權
- 處理使用者輸入或檔案上傳
- 建立新的 API 端點
- 處理金鑰或憑證
- 實現支付功能
- 儲存或傳輸敏感資料
- 整合第三方 API

### 安全檢查清單

#### 1. 金鑰管理

##### ❌ 永遠不要這樣做

```typescript
const apiKey = "sk-proj-xxxxx"  // 硬編碼金鑰
const dbPassword = "password123" // 在原始碼中
```

##### ✅ 始終這樣做

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// 驗證金鑰存在
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### 驗證步驟
- [ ] 無硬編碼 API 金鑰、令牌或密碼
- [ ] 所有金鑰在環境變數中
- [ ] `.env.local` 在 .gitignore 中
- [ ] Git 歷史中無金鑰
- [ ] 生產金鑰在託管平臺（Vercel、Railway）

#### 2. 輸入驗證

##### 始終驗證使用者輸入

```typescript
import { z } from 'zod'

// 定義驗證模式
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// 處理前驗證
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

##### 檔案上傳驗證

```typescript
function validateFileUpload(file: File) {
  // 大小檢查（5MB 最大）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // 型別檢查
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // 副檔名檢查
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### 驗證步驟
- [ ] 所有使用者輸入用模式驗證
- [ ] 檔案上傳限制（大小、型別、副檔名）
- [ ] 不直接在查詢中使用使用者輸入
- [ ] 白名單驗證（不是黑名單）
- [ ] 錯誤訊息不洩露敏感資訊

#### 3. SQL 注入預防

##### ❌ 永遠不要連線 SQL

```typescript
// 危險 - SQL 注入漏洞
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ 始終使用引數化查詢

```typescript
// 安全 - 引數化查詢
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// 或使用原始 SQL
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

##### 驗證步驟
- [ ] 所有資料庫查詢使用引數化查詢
- [ ] SQL 中無字串連線
- [ ] 正確使用 ORM/查詢構建器
- [ ] Supabase 查詢正確清理

#### 4. 認證與授權

##### JWT 令牌處理

```typescript
// ❌ 錯誤：localStorage（易受 XSS 攻擊）
localStorage.setItem('token', token)

// ✅ 正確：httpOnly cookies
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### 授權檢查

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // 始終首先驗證授權
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // 繼續刪除
  await db.users.delete({ where: { id: userId } })
}
```

##### 行級安全性（Supabase）

```sql
-- 在所有表上啟用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 使用者只能檢視自己的資料
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 使用者只能更新自己的資料
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### 驗證步驟
- [ ] 令牌儲存在 httpOnly cookies（不是 localStorage）
- [ ] 敏感操作前的授權檢查
- [ ] Supabase 中啟用行級安全性
- [ ] 實現基於角色的存取控制
- [ ] 安全的會話管理

#### 5. XSS 預防

##### 清理 HTML

```typescript
import DOMPurify from 'isomorphic-dompurify'

// 始終清理使用者提供的 HTML
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

##### 內容安全策略

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

##### 驗證步驟
- [ ] 清理使用者提供的 HTML
- [ ] 配置 CSP 頭
- [ ] 無未驗證的動態內容渲染
- [ ] 使用 React 內建的 XSS 保護

#### 6. CSRF 保護

##### CSRF 令牌

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

  // 處理請求
}
```

##### SameSite Cookies

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### 驗證步驟
- [ ] 狀態更改操作上有 CSRF 令牌
- [ ] 所有 cookie 使用 SameSite=Strict
- [ ] 實現雙重提交 cookie 模式

#### 7. 速率限制

##### API 速率限制

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100, // 每視窗 100 個請求
  message: 'Too many requests'
})

// 應用到路由
app.use('/api/', limiter)
```

##### 昂貴操作

```typescript
// 搜尋的激進速率限制
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分鐘
  max: 10, // 每分鐘 10 個請求
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### 驗證步驟
- [ ] 所有 API 端點上的速率限制
- [ ] 昂貴操作上更嚴格的限制
- [ ] 基於 IP 的速率限制
- [ ] 基於使用者的速率限制（已認證）

#### 8. 敏感資料暴露

##### 日誌記錄

```typescript
// ❌ 錯誤：記錄敏感資料
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ 正確：編輯敏感資料
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### 錯誤訊息

```typescript
// ❌ 錯誤：暴露內部細節
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ 正確：通用錯誤訊息
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### 驗證步驟
- [ ] 日誌中無密碼、令牌或金鑰
- [ ] 使用者的錯誤訊息通用
- [ ] 伺服器日誌中詳細的錯誤
- [ ] 向使用者無堆疊跟蹤

#### 9. 區塊鏈安全（Solana）

##### 錢包驗證

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

##### 交易驗證

```typescript
async function verifyTransaction(transaction: Transaction) {
  // 驗證接收者
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // 驗證金額
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // 驗證使用者有足夠餘額
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### 驗證步驟
- [ ] 驗證錢包簽名
- [ ] 驗證交易詳情
- [ ] 交易前餘額檢查
- [ ] 無盲交易簽名

#### 10. 依賴安全

##### 定期更新

```bash
# 檢查漏洞
npm audit

# 自動修復可修復的問題
npm audit fix

# 更新依賴
npm update

# 檢查過時的包
npm outdated
```

##### 鎖檔案

```bash
# 始終提交鎖檔案
git add package-lock.json

# 在 CI/CD 中用於可重現構建
npm ci  # 而不是 npm install
```

##### 驗證步驟
- [ ] 依賴是最新的
- [ ] 無已知漏洞（npm audit clean）
- [ ] 提交鎖檔案
- [ ] GitHub 上啟用 Dependabot
- [ ] 定期安全更新

### 安全測試

#### 自動化安全測試

```typescript
// 測試認證
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// 測試授權
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// 測試輸入驗證
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// 測試速率限制
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### 部署前安全檢查清單

在任何生產部署之前：

- [ ] **金鑰**：無硬編碼金鑰，全部在環境變數中
- [ ] **輸入驗證**：所有使用者輸入已驗證
- [ ] **SQL 注入**：所有查詢引數化
- [ ] **XSS**：使用者內容已清理
- [ ] **CSRF**：保護已啟用
- [ ] **認證**：正確的令牌處理
- [ ] **授權**：角色檢查已到位
- [ ] **速率限制**：在所有端點上啟用
- [ ] **HTTPS**：生產中強制執行
- [ ] **安全頭**：CSP、X-Frame-Options 已配置
- [ ] **錯誤處理**：錯誤中無敏感資料
- [ ] **日誌記錄**：日誌中無敏感資料
- [ ] **依賴**：最新，無漏洞
- [ ] **行級安全性**：Supabase 中已啟用
- [ ] **CORS**：正確配置
- [ ] **檔案上傳**：已驗證（大小、型別）
- [ ] **錢包簽名**：已驗證（如果是區塊鏈）

::: tip 記住

安全不是可選的。一個漏洞可能會危及整個平臺。如有疑問，選擇謹慎的一方。
:::

---

## 6. continuous-learning（持續學習）

### 工作原理

此技能作為 **Stop hook** 在每次會話結束時執行：

1. **會話評估**：檢查會話是否有足夠的訊息（預設：10+）
2. **模式檢測**：從會話中識別可提取的模式
3. **技能提取**：將有用的模式儲存到 `~/.claude/skills/learned/`

### 配置

編輯 `config.json` 進行自定義：

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

### 模式類型

| 模式 | 描述 |
| --- | ---|
| `error_resolution` | 如何解決特定錯誤 |
| `user_corrections` | 來自使用者更正的模式 |
| `workarounds` | 框架/庫怪癖的解決方案 |
| `debugging_techniques` | 有效的除錯方法 |
| `project_specific` | 專案特定的約定 |

### Hook 設定

新增到你的 `~/.claude/settings.json`：

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

### 為什麼使用 Stop Hook？

- **輕量級**：僅在會話結束時執行一次
- **非阻塞**：不會給每條訊息增加延遲
- **完整上下文**：可以存取完整的會話記錄

### 相關

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 持續學習部分
- `/learn` 命令 - 會話中途手動提取模式

---

## 7. strategic-compact（策略性壓縮）

### 為什麼使用策略性壓縮？

自動壓縮在任意點觸發：
- 通常在任務中間，丟失重要上下文
- 無邏輯任務邊界的意識
- 可能中斷複雜的多步驟操作

邏輯邊界的策略性壓縮：
- **探索後、執行前** - 壓縮研究上下文，保留實施計劃
- **完成里程碑後** - 為下一階段的新開始
- **主要上下文轉換前** - 在不同任務前清除研究上下文

### 工作原理

`suggest-compact.sh` 指令碼在 PreToolUse（Edit/Write）上執行並：

1. **跟蹤工具呼叫** - 計算會話中的工具呼叫次數
2. **閾值檢測** - 在可配置閾值時建議（預設：50 次呼叫）
3. **定期提醒** - 閾值後每 25 次呼叫提醒一次

### Hook 設定

新增到你的 `~/.claude/settings.json`：

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

### 配置

環境變數：
- `COMPACT_THRESHOLD` - 首次建議前的工具呼叫（預設：50）

### 最佳實踐

1. **規劃後壓縮** - 計劃完成後，壓縮重新開始
2. **除錯後壓縮** - 繼續前清除錯誤解決上下文
3. **不要在實施中壓縮** - 為相關更改保留上下文
4. **閱讀建議** - Hook 告訴你**什麼時候**，你決定**是否**

### 相關

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Token 最佳化部分
- Memory persistence hooks - 持久化壓縮後保持的狀態

---

## 8. eval-harness（評估工具）

### 哲學

評估驅動開發將評估視為"AI 開發的單元測試"：
- 實現前定義預期行為
- 開發期間連續執行評估
- 跟蹤每次更改的回歸
- 使用 pass@k 指標測量可靠性

### 評估類型

#### 功能評估

測試 Claude 以前做不到的事情：
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion1
  - [ ] Criterion2
  - [ ] Criterion3
Expected Output: Description of expected result
```

#### 回歸評估

確保更改不會破壞現有功能：
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

### 評分器類型

#### 1. 基於代碼的評分器

使用代碼的確定性檢查：
```bash
# 檢查檔案是否包含預期模式
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# 檢查測試是否通過
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# 檢查構建是否成功
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. 基於模型的評分器

使用 Claude 評估開放式輸出：
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

#### 3. 人工評分器

標記供人工審查：
```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

### 指標

#### pass@k

"k 次嘗試中至少有一次成功"
- pass@1：首次嘗試成功率
- pass@3：3 次內成功率
- 典型目標：pass@3 > 90%

#### pass^k

"所有 k 次試驗都成功"
- 可靠性門檻更高
- pass^3：3 次連續成功
- 用於關鍵路徑

### 評估工作流程

#### 1. 定義（編碼前）

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

#### 2. 實現

編寫代碼通過定義的評估。

#### 3. 評估

```bash
# 執行功能評估
[Run each capability eval, record PASS/FAIL]

# 執行回歸評估
npm test -- --testPathPattern="existing"

# 生成報告
```

#### 4. 報告

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

### 整合模式

#### 實施前

```
/eval define feature-name
```
在 `.claude/evals/feature-name.md` 建立評估定義檔案

#### 實施期間

```
/eval check feature-name
```
執行當前評估並報告狀態

#### 實施後

```
/eval report feature-name
```
生成完整評估報告

### 評估儲存

將評估儲存在專案中：

```
.claude/
  evals/
    feature-xyz.md      # 評估定義
    feature-xyz.log     # 評估執行歷史
    baseline.json       # 回歸基準
```

### 最佳實踐

1. **編碼前定義評估** - 強制對成功標準的清晰思考
2. **頻繁執行評估** - 儘早捕獲回歸
3. **隨時間跟蹤 pass@k** - 監控可靠性趨勢
4. **儘可能使用代碼評分器** - 確定性 > 機率性
5. **安全的人工審查** - 永遠不要完全自動化安全檢查
6. **保持評估快速** - 慢評估不會被執行
7. **評估隨代碼版本化** - 評估是一流工件

### 示例：新增認證

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
=============================
Capability: 5/5 passed (pass@3: 100%)
Regression: 3/3 passed (pass^3: 100%)
Status: SHIP IT
```

---

## 9. verification-loop（驗證迴圈）

### 何時使用

在以下情況下呼叫此技能：
- 完成功能或重大代碼更改後
- 建立 PR 之前
- 當你想要確保品質檢查通過時
- 重構後

### 驗證階段

#### 階段 1：構建驗證

```bash
# 檢查專案是否構建
npm run build 2>&1 | tail -20
# 或
pnpm build 2>&1 | tail -20
```

如果構建失敗，停止並繼續之前修復。

#### 階段 2：型別檢查

```bash
# TypeScript 專案
npx tsc --noEmit 2>&1 | head -30

# Python 專案
pyright . 2>&1 | head -30
```

報告所有型別錯誤。繼續之前修復關鍵錯誤。

#### 階段 3：Lint 檢查

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### 階段 4：測試套件

```bash
# 執行帶覆蓋率的測試
npm run test -- --coverage 2>&1 | tail -50

# 檢查覆蓋率閾值
# 目標：80% 最低
```

報告：
- 總測試數：X
- 通過：X
- 失敗：X
- 覆蓋率：X%

#### 階段 5：安全掃描

```bash
# 檢查金鑰
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# 檢查 console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### 階段 6：Diff 審查

```bash
# 顯示更改的內容
git diff --stat
git diff HEAD~1 --name-only
```

審查每個更改檔案的：
- 意外更改
- 缺少錯誤處理
- 潛在邊緣情況

### 輸出格式

執行所有階段後，生成驗證報告：

```
VERIFICATION REPORT
=================

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

### 持續模式

對於長會話，每 15 分鐘或重大更改後執行驗證：

```markdown
設定一個心理檢查點：
- 完成每個函式後
- 完成元件後
- 移動到下一個任務前

執行：/verify
```

### 與 Hooks 整合

此技能補充 PostToolUse hooks，但提供更深入的驗證。Hooks 立即捕獲問題；此技能提供全面審查。

---

## 10. project-guidelines-example（專案指南示例）

這是一個專案特定技能的示例。將其用作自己專案的模板。

基於真實生產應用：[Zenith](https://zenith.chat) - AI 驅動的客戶發現平臺。

### 何時使用

在處理為其設計的特定專案時參考此技能。專案技能包含：
- 架構概述
- 檔案結構
- 代碼模式
- 測試要求
- 部署工作流程

---

## 11. clickhouse-io（ClickHouse I/O）

### 概述

ClickHouse 是用於線上分析處理（OLAP）的面向列的資料庫管理系統。它針對大資料集上的快速分析查詢進行了最佳化。

**關鍵特性：**
- 面向列的儲存
- 資料壓縮
- 並行查詢執行
- 分散式查詢
- 實時分析

### 表設計模式

#### MergeTree 引擎（最常見）

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

#### ReplacingMergeTree（去重）

```sql
-- 對於可能有重複的資料（例如，來自多個來源）
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

#### AggregatingMergeTree（預聚合）

```sql
-- 用於維護聚合指標
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- 查詢聚合資料
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

### 查詢最佳化模式

#### 高效過濾

```sql
-- ✅ GOOD: 首先使用索引列
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ BAD: 首先過濾非索引列
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### 聚合

```sql
-- ✅ GOOD: 使用 ClickHouse 特定聚合函式
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

-- ✅ 使用 quantile 作為百分位數（比 percentile 更高效）
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### 資料插入模式

#### 批次插入（推薦）

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

// ✅ 批次插入（高效）
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

// ❌ 單獨插入（慢）
async function insertTrade(trade: Trade) {
  // 不要在迴圈中這樣做！
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### 流式插入

```typescript
// 用於連續資料匯入
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

### 物化檢視

#### 實時聚合

```sql
-- 為每小時統計建立物化檢視
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

-- 查詢物化檢視
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

### 性能監控

#### 查詢性能

```sql
-- 檢查慢查詢
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

#### 表統計

```sql
-- 檢查表大小
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

### 常見分析查詢

#### 時間序列分析

```sql
-- 每日活躍使用者
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- 留存分析
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

#### 漏斗分析

```sql
-- 轉化漏斗
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

#### 隊列分析

```sql
-- 按註冊月的使用者隊列
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

### 資料管道模式

#### ETL 模式

```typescript
// 提取、轉換、載入
async function etlPipeline() {
  // 1. 從源提取
  const rawData = await extractFromPostgres()

  // 2. 轉換
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. 載入到 ClickHouse
  await bulkInsertToClickHouse(transformed)
}

// 定期執行
setInterval(etlPipeline, 60 * 60 * 1000)  // 每小時
```

#### 變更資料捕獲（CDC）

```typescript
// 監聽 PostgreSQL 更改並同步到 ClickHouse
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

### 最佳實踐

#### 1. 分割槽策略
- 按時間分割槽（通常是月或天）
- 避免太多分割槽（效能影響）
- 使用 DATE 型別作為分割槽鍵

#### 2. 排序鍵
- 首先放置最頻繁過濾的列
- 考慮基數（高基數優先）
- 排序影響壓縮

#### 3. 資料型別
- 使用最小適當型別（UInt32 vs UInt64）
- 對重複字串使用 LowCardinality
- 對分類資料使用 Enum

#### 4. 避免
- SELECT *（指定列）
- FINAL（在查詢前合併資料）
- 太多 JOIN（分析時反規範化）
- 小頻繁插入（改為批次）

#### 5. 監控
- 跟蹤查詢效能
- 監控磁碟使用
- 檢查合併操作
- 審查慢查詢日誌

::: tip 記住

ClickHouse 在分析工作負載上表現出色。為你的查詢模式設計表，批次插入，並利用物化檢視進行實時聚合。
:::

---

## 下一課預告

> 下一課我們學習 **[Scripts API 參考](../scripts-api/)**。
>
> 你會學到：
> - Node.js 指令碼介面和工具函式
> - 包管理器檢測機制
> - Hooks 指令碼的實現細節
> - 測試套件的使用方法

---

## 本課小結

Everything Claude Code 的 11 個技能庫為開發過程提供了全面的知識支援：

1. **coding-standards** - 統一編碼規範、不可變模式、最佳實踐
2. **backend-patterns** - 後端架構模式、API 設計、資料庫最佳化
3. **frontend-patterns** - React/Next.js 模式、狀態管理、效能最佳化
4. **tdd-workflow** - 測試驅動開發工作流程、80%+ 覆蓋率
5. **security-review** - OWASP Top 10、輸入驗證、漏洞檢測
6. **continuous-learning** - 自動提取可複用模式、知識沉澱
7. **strategic-compact** - 策略性上下文壓縮、Token 最佳化
8. **eval-harness** - 評估驅動開發、可靠性測試
9. **verification-loop** - 綜合驗證系統、品質檢查
10. **project-guidelines-example** - 專案配置示例、架構模板
11. **clickhouse-io** - ClickHouse 分析模式、高效能查詢

記住，這些技能庫是你代碼品質的指南針。在開發過程中正確應用它們，可以顯著提升開發效率和代碼品質。

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 技能庫 | 檔案路徑 | 行號 |
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|
| --- | --- | ---|

**關鍵原則**：
- **coding-standards**: 不可變模式、檔案 < 800 行、函式 < 50 行、80%+ 測試覆蓋率
- **backend-patterns**: Repository 模式、Service 層分離、引數化查詢、Redis 快取
- **frontend-patterns**: 元件組合、自定義 Hooks、Context + Reducer、記憶化、懶加載
- **tdd-workflow**: 測試先行、單元/整合/E2E 測試、測試覆蓋率驗證
- **security-review**: OWASP Top 10 檢查、輸入驗證、SQL 注入預防、XSS 預防

**相關 Agents**：
- **tdd-guide**: TDD 流程指導
- **code-reviewer**: 代碼品質和風格審查
- **security-reviewer**: 安全漏洞檢測
- **architect**: 架構設計和模式選擇

</details>
