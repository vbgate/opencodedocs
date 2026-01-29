---
title: "Skills 参考: 11 个技能库 | Everything Claude Code"
sidebarTitle: "5 分钟速查 11 个技能"
subtitle: "Skills 参考: 11 个技能库"
description: "学习 Everything Claude Code 的 11 个技能库应用。掌握编码标准、后端/前端模式、TDD 工作流和安全审查，提升开发效率。"
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

# Skills 完整参考：11 个技能库详解

## 学完你能做什么

- 快速查找和理解所有 11 个技能库的内容和用途
- 在开发过程中正确应用编码标准、架构模式和最佳实践
- 知道何时使用哪个技能来提升开发效率和代码质量
- 掌握 TDD 工作流、安全审查、持续学习等关键技能

## 你现在的困境

面对项目中的 11 个技能库，你可能会：

- **记不住所有技能**：coding-standards、backend-patterns、security-review... 哪些技能在什么时候用？
- **不知道如何应用**：技能提到了不可变模式、TDD 流程，但具体怎么操作？
- **不知道找哪个帮忙**：遇到安全问题用哪个技能？后端开发用哪个技能？
- **技能和 Agent 的关系**：技能和 Agents 有什么区别？什么时候用 Agent，什么时候用 Skill？

这份参考文档帮你全面了解每个技能的内容、应用场景和使用方法。

---

## Skills 概览

Everything Claude Code 包含 11 个技能库，每套技能都有明确的目标和应用场景：

| 技能库 | 目标 | 优先级 | 使用场景 |
| ------- | ---- | ------ | -------- |
| **coding-standards** | 统一编码规范、最佳实践 | P0 | 通用编码、TypeScript/JavaScript/React |
| **backend-patterns** | 后端架构模式、API 设计 | P0 | Node.js、Express、Next.js API 路由开发 |
| **frontend-patterns** | 前端开发模式、性能优化 | P0 | React、Next.js、状态管理 |
| **tdd-workflow** | 测试驱动开发工作流 | P0 | 新功能开发、Bug 修复、重构 |
| **security-review** | 安全审查和漏洞检测 | P0 | 认证授权、输入验证、敏感数据处理 |
| **continuous-learning** | 自动提取可复用模式 | P1 | 长期项目、知识沉淀 |
| **strategic-compact** | 策略性上下文压缩 | P1 | 长会话、复杂任务 |
| **eval-harness** | 评估驱动开发框架 | P1 | AI 开发评估、可靠性测试 |
| **verification-loop** | 综合验证系统 | P1 | PR 前验证、质量检查 |
| **project-guidelines-example** | 项目指南示例 | P2 | 自定义项目规范 |
| **clickhouse-io** | ClickHouse 分析模式 | P2 | 高性能分析查询 |

::: info Skills vs Agents

**Skills** 是工作流定义和领域知识库，提供模式、最佳实践和规范指导。

**Agents** 是专业化子代理，执行特定领域的复杂任务（如规划、审查、调试）。

两者相辅相成：Skills 提供知识框架，Agents 执行具体任务。
:::

---

## 1. coding-standards（编码标准）

### 核心原则

#### 1. 可读性优先
- 代码被阅读的次数远多于被编写的次数
- 清晰的变量和函数命名
- 自解释的代码优于注释
- 一致的格式

#### 2. KISS 原则（Keep It Simple, Stupid）
- 使用最简单的有效解决方案
- 避免过度设计
- 不做过早优化
- 容易理解 > 聪明代码

#### 3. DRY 原则（Don't Repeat Yourself）
- 提取公共逻辑到函数
- 创建可复用组件
- 跨模块共享工具函数
- 避免复制粘贴编程

#### 4. YAGNI 原则（You Aren't Gonna Need It）
- 不要在需要之前构建功能
- 避免推测性的泛化
- 只在需要时增加复杂度
- 从简单开始，需要时重构

### 不可变模式（CRITICAL）

::: warning 关键规则

始终创建新对象，绝不修改现有对象！这是代码质量最重要的原则之一。
:::

**❌ 错误做法**：直接修改对象

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 正确做法**：创建新对象

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### TypeScript/JavaScript 最佳实践

#### 变量命名

```typescript
// ✅ GOOD: 描述性命名
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ BAD: 不清楚的命名
const q = 'election'
const flag = true
const x = 1000
```

#### 函数命名

```typescript
// ✅ GOOD: 动词-名词模式
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ BAD: 不清楚或只有名词
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### 错误处理

```typescript
// ✅ GOOD: 全面的错误处理
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

// ❌ BAD: 没有错误处理
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### 并行执行

```typescript
// ✅ GOOD: 尽可能并行执行
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ BAD: 不必要的顺序执行
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### React 最佳实践

#### 组件结构

```typescript
// ✅ GOOD: 带类型的函数组件
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

// ❌ BAD: 没有类型，结构不清楚
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### 自定义 Hooks

```typescript
// ✅ GOOD: 可复用的自定义 hook
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

#### 状态更新

```typescript
// ✅ GOOD: 函数式状态更新
const [count, setCount] = useState(0)

// 基于前一个状态的更新
setCount(prev => prev + 1)

// ❌ BAD: 直接引用状态
setCount(count + 1)  // 在异步场景中可能过时
```

### API 设计标准

#### REST API 约定

```
GET    /api/markets              # 列出所有市场
GET    /api/markets/:id          # 获取特定市场
POST   /api/markets              # 创建新市场
PUT    /api/markets/:id          # 更新市场（完整）
PATCH  /api/markets/:id          # 更新市场（部分）
DELETE /api/markets/:id          # 删除市场

# 查询参数用于过滤
GET /api/markets?status=active&limit=10&offset=0
```

#### 响应格式

```typescript
// ✅ GOOD: 一致的响应结构
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

// 成功响应
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// 错误响应
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### 输入验证

```typescript
import { z } from 'zod'

// ✅ GOOD: Schema 验证
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
    // 继续处理验证后的数据
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

### 文件组织

#### 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── markets/           # 市场页面
│   └── (auth)/           # 认证页面（路由组）
├── components/            # React 组件
│   ├── ui/               # 通用 UI 组件
│   ├── forms/            # 表单组件
│   └── layouts/          # 布局组件
├── hooks/                # 自定义 React hooks
├── lib/                  # 工具和配置
│   ├── api/             # API 客户端
│   ├── utils/           # 辅助函数
│   └── constants/       # 常量
├── types/                # TypeScript 类型
└── styles/              # 全局样式
```

### 性能最佳实践

#### 记忆化

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD: 记忆化昂贵的计算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GOOD: 记忆化回调函数
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### 懒加载

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: 懒加载重型组件
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### 测试标准

#### 测试结构（AAA 模式）

```typescript
test('calculates similarity correctly', () => {
  // Arrange（准备）
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act（执行）
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert（断言）
  expect(similarity).toBe(0)
})
```

#### 测试命名

```typescript
// ✅ GOOD: 描述性测试名称
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ BAD: 模糊的测试名称
test('works', () => { })
test('test search', () => { })
```

### 代码异味检测

#### 1. 长函数

```typescript
// ❌ BAD: 函数超过 50 行
function processMarketData() {
  // 100 行代码
}

// ✅ GOOD: 拆分为小函数
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

#### 2. 深层嵌套

```typescript
// ❌ BAD: 5+ 层嵌套
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

#### 3. 魔法数字

```typescript
// ❌ BAD: 未解释的数字
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GOOD: 命名常量
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---

## 2. backend-patterns（后端模式）

### API 设计模式

#### RESTful API 结构

```typescript
// ✅ 基于资源的 URL
GET    /api/markets                 # 列出资源
GET    /api/markets/:id             # 获取单个资源
POST   /api/markets                 # 创建资源
PUT    /api/markets/:id             # 替换资源
PATCH  /api/markets/:id             # 更新资源
DELETE /api/markets/:id             # 删除资源

// ✅ 查询参数用于过滤、排序、分页
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### Repository 模式

```typescript
// 抽象数据访问逻辑
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

#### Service 层模式

```typescript
// 业务逻辑与数据访问分离
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // 业务逻辑
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // 获取完整数据
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // 按相似度排序
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // 向量搜索实现
  }
}
```

#### 中间件模式

```typescript
// 请求/响应处理管道
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
  // 处理程序可以访问 req.user
})
```

### 数据库模式

#### 查询优化

```typescript
// ✅ GOOD: 只选择需要的列
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ BAD: 选择所有内容
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### N+1 查询预防

```typescript
// ❌ BAD: N+1 查询问题
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N 次查询
}

// ✅ GOOD: 批量获取
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 次查询
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### 事务模式

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // 使用 Supabase 事务
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// Supabase 中的 SQL 函数
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- 事务自动开始
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- 回滚自动发生
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### 缓存策略

#### Redis 缓存层

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // 先检查缓存
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // 缓存未命中 - 从数据库获取
    const market = await this.baseRepo.findById(id)

    if (market) {
      // 缓存 5 分钟
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### 错误处理模式

#### 集中式错误处理器

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

  // 记录意外错误
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

#### 指数退避重试

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
        // 指数退避：1s, 2s, 4s
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

### 认证与授权

#### JWT 令牌验证

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

#### 基于角色的访问控制

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
  // 带权限检查的处理程序
})
```

### 速率限制

#### 简单的内存速率限制器

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

    // 移除窗口外的旧请求
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // 超过速率限制
    }

    // 添加当前请求
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 请求/分钟

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // 继续处理请求
}
```

### 后台任务与队列

#### 简单队列模式

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
    // 任务执行逻辑
  }
}

// 用于索引市场
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // 添加到队列而不是阻塞
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### 日志与监控

#### 结构化日志

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

### 组件模式

#### 组合优于继承

```typescript
// ✅ GOOD: 组件组合
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

#### 复合组件

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

### 自定义 Hooks 模式

#### 状态管理 Hook

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

#### 异步数据获取 Hook

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

### 状态管理模式

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

### 性能优化

#### 记忆化

```typescript
// ✅ useMemo 用于昂贵的计算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallback 用于传递给子组件的函数
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// ✅ React.memo 用于纯组件
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

#### 代码分割与懒加载

```typescript
import { lazy, Suspense } from 'react'

// ✅ 懒加载重型组件
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

#### 长列表虚拟化

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // 估算的行高
    overscan: 5  // 额外渲染的项目
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

### 表单处理模式

#### 带验证的受控表单

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
      // 成功处理
    } catch (error) {
      // 错误处理
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

### 错误边界模式

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

### 动画模式

#### Framer Motion 动画

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ 列表动画
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

// ✅ 模态框动画
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

### 可访问性模式

#### 键盘导航

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
      {/* 下拉框实现 */}
    </div>
  )
}
```

#### 焦点管理

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // 保存当前焦点元素
      previousFocusRef.current = document.activeElement as HTMLElement

      // 焦点移动到模态框
      modalRef.current?.focus()
    } else {
      // 关闭时恢复焦点
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

## 4. tdd-workflow（TDD 工作流）

### 何时激活

- 编写新功能或功能
- 修复 Bug 或问题
- 重构现有代码
- 添加 API 端点
- 创建新组件

### 核心原则

#### 1. 测试先行
始终先写测试，然后编写代码使测试通过。

#### 2. 覆盖率要求
- 最低 80% 覆盖率（单元 + 集成 + E2E）
- 覆盖所有边缘情况
- 测试错误场景
- 验证边界条件

#### 3. 测试类型

##### 单元测试
- 独立函数和工具函数
- 组件逻辑
- 纯函数
- 辅助函数和工具

##### 集成测试
- API 端点
- 数据库操作
- 服务交互
- 外部 API 调用

##### E2E 测试（Playwright）
- 关键用户流程
- 完整的工作流
- 浏览器自动化
- UI 交互

### TDD 工作流步骤

#### 步骤 1：编写用户旅程

```
作为 [角色]，我想要 [操作]，以便 [利益]

示例：
作为用户，我想要语义搜索市场，
以便即使没有精确关键词也能找到相关市场。
```

#### 步骤 2：生成测试用例

为每个用户旅程创建全面的测试用例：

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // 测试实现
  })

  it('handles empty query gracefully', async () => {
    // 测试边缘情况
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // 测试降级行为
  })

  it('sorts results by similarity score', async () => {
    // 测试排序逻辑
  })
})
```

#### 步骤 3：运行测试（应该失败）

```bash
npm test
# 测试应该失败 - 我们还没有实现
```

#### 步骤 4：实现代码

编写最小代码使测试通过：

```typescript
// 由测试引导的实现
export async function searchMarkets(query: string) {
  // 实现这里
}
```

#### 步骤 5：再次运行测试

```bash
npm test
# 测试现在应该通过
```

#### 步骤 6：重构

在保持测试绿色的同时改进代码质量：
- 移除重复代码
- 改进命名
- 优化性能
- 增强可读性

#### 步骤 7：验证覆盖率

```bash
npm run test:coverage
# 验证达到 80%+ 覆盖率
```

### 测试模式

#### 单元测试模式（Jest/Vitest）

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

#### API 集成测试模式

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
    // 模拟数据库失败
    const request = new NextRequest('http://localhost/api/markets')
    // 测试错误处理
  })
})
```

#### E2E 测试模式（Playwright）

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // 导航到市场页面
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // 验证页面已加载
  await expect(page.locator('h1')).toContainText('Markets')

  // 搜索市场
  await page.fill('input[placeholder="Search markets"]', 'election')

  // 等待防抖和结果
  await page.waitForTimeout(600)

  // 验证显示搜索结果
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // 验证结果包含搜索词
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // 按状态过滤
  await page.click('button:has-text("Active")')

  // 验证过滤后的结果
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // 先登录
  await page.goto('/creator-dashboard')

  // 填写市场创建表单
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // 提交表单
  await page.click('button[type="submit"]')

  // 验证成功消息
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // 验证重定向到市场页面
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### 测试文件组织

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # 单元测试
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # 集成测试
└── e2e/
    ├── markets.spec.ts               # E2E 测试
    ├── trading.spec.ts
    └── auth.spec.ts
```

### 模拟外部服务

#### Supabase 模拟

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

#### Redis 模拟

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### OpenAI 模拟

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // 模拟 1536 维嵌入
  ))
}))
```

### 测试覆盖率验证

#### 运行覆盖率报告

```bash
npm run test:coverage
```

#### 覆盖率阈值

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

### 常见测试错误

#### ❌ 错误：测试实现细节

```typescript
// 不要测试内部状态
expect(component.state.count).toBe(5)
```

#### ✅ 正确：测试用户可见行为

```typescript
// 测试用户看到的内容
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ 错误：脆弱的选择器

```typescript
// 容易断裂
await page.click('.css-class-xyz')
```

#### ✅ 正确：语义化选择器

```typescript
// 对更改具有弹性
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ 错误：没有测试隔离

```typescript
// 测试相互依赖
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* 依赖上一个测试 */ })
```

#### ✅ 正确：独立的测试

```typescript
// 每个测试设置自己的数据
test('creates user', () => {
  const user = createTestUser()
  // 测试逻辑
})

test('updates user', () => {
  const user = createTestUser()
  // 更新逻辑
})
```

### 持续测试

#### 开发期间的监视模式

```bash
npm test -- --watch
# 文件更改时测试自动运行
```

#### 提交前钩子

```bash
# 每次提交前运行
npm test && npm run lint
```

#### CI/CD 集成

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### 最佳实践

1. **先写测试** - 始终 TDD
2. **每个测试一个断言** - 专注于单一行为
3. **描述性测试名称** - 解释测试内容
4. **Arrange-Act-Assert** - 清晰的测试结构
5. **模拟外部依赖** - 隔离单元测试
6. **测试边缘情况** - Null、undefined、空、大值
7. **测试错误路径** - 不仅仅是快乐路径
8. **保持测试快速** - 单元测试 < 50ms
9. **测试后清理** - 无副作用
10. **审查覆盖率报告** - 识别缺口

### 成功指标

- 80%+ 代码覆盖率实现
- 所有测试通过（绿色）
- 无跳过或禁用的测试
- 快速测试执行（单元测试 < 30s）
- E2E 测试覆盖关键用户流程
- 测试在生产前捕获 Bug

::: tip 记住

测试不是可选的。它们是支持自信重构、快速开发和生产可靠性的安全网。
:::

---

## 5. security-review（安全审查）

### 何时激活

- 实现认证或授权
- 处理用户输入或文件上传
- 创建新的 API 端点
- 处理密钥或凭据
- 实现支付功能
- 存储或传输敏感数据
- 集成第三方 API

### 安全检查清单

#### 1. 密钥管理

##### ❌ 永远不要这样做

```typescript
const apiKey = "sk-proj-xxxxx"  // 硬编码密钥
const dbPassword = "password123" // 在源代码中
```

##### ✅ 始终这样做

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// 验证密钥存在
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### 验证步骤
- [ ] 无硬编码 API 密钥、令牌或密码
- [ ] 所有密钥在环境变量中
- [ ] `.env.local` 在 .gitignore 中
- [ ] Git 历史中无密钥
- [ ] 生产密钥在托管平台（Vercel、Railway）

#### 2. 输入验证

##### 始终验证用户输入

```typescript
import { z } from 'zod'

// 定义验证模式
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// 处理前验证
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

##### 文件上传验证

```typescript
function validateFileUpload(file: File) {
  // 大小检查（5MB 最大）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // 类型检查
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // 扩展名检查
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### 验证步骤
- [ ] 所有用户输入用模式验证
- [ ] 文件上传限制（大小、类型、扩展名）
- [ ] 不直接在查询中使用用户输入
- [ ] 白名单验证（不是黑名单）
- [ ] 错误消息不泄露敏感信息

#### 3. SQL 注入预防

##### ❌ 永远不要连接 SQL

```typescript
// 危险 - SQL 注入漏洞
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ 始终使用参数化查询

```typescript
// 安全 - 参数化查询
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

##### 验证步骤
- [ ] 所有数据库查询使用参数化查询
- [ ] SQL 中无字符串连接
- [ ] 正确使用 ORM/查询构建器
- [ ] Supabase 查询正确清理

#### 4. 认证与授权

##### JWT 令牌处理

```typescript
// ❌ 错误：localStorage（易受 XSS 攻击）
localStorage.setItem('token', token)

// ✅ 正确：httpOnly cookies
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### 授权检查

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // 始终首先验证授权
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // 继续删除
  await db.users.delete({ where: { id: userId } })
}
```

##### 行级安全性（Supabase）

```sql
-- 在所有表上启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的数据
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 用户只能更新自己的数据
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### 验证步骤
- [ ] 令牌存储在 httpOnly cookies（不是 localStorage）
- [ ] 敏感操作前的授权检查
- [ ] Supabase 中启用行级安全性
- [ ] 实现基于角色的访问控制
- [ ] 安全的会话管理

#### 5. XSS 预防

##### 清理 HTML

```typescript
import DOMPurify from 'isomorphic-dompurify'

// 始终清理用户提供的 HTML
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

##### 内容安全策略

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

##### 验证步骤
- [ ] 清理用户提供的 HTML
- [ ] 配置 CSP 头
- [ ] 无未验证的动态内容渲染
- [ ] 使用 React 内置的 XSS 保护

#### 6. CSRF 保护

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

  // 处理请求
}
```

##### SameSite Cookies

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### 验证步骤
- [ ] 状态更改操作上有 CSRF 令牌
- [ ] 所有 cookie 使用 SameSite=Strict
- [ ] 实现双重提交 cookie 模式

#### 7. 速率限制

##### API 速率限制

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每窗口 100 个请求
  message: 'Too many requests'
})

// 应用到路由
app.use('/api/', limiter)
```

##### 昂贵操作

```typescript
// 搜索的激进速率限制
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: 10, // 每分钟 10 个请求
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### 验证步骤
- [ ] 所有 API 端点上的速率限制
- [ ] 昂贵操作上更严格的限制
- [ ] 基于 IP 的速率限制
- [ ] 基于用户的速率限制（已认证）

#### 8. 敏感数据暴露

##### 日志记录

```typescript
// ❌ 错误：记录敏感数据
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ 正确：编辑敏感数据
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### 错误消息

```typescript
// ❌ 错误：暴露内部细节
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ 正确：通用错误消息
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### 验证步骤
- [ ] 日志中无密码、令牌或密钥
- [ ] 用户的错误消息通用
- [ ] 服务器日志中详细的错误
- [ ] 向用户无堆栈跟踪

#### 9. 区块链安全（Solana）

##### 钱包验证

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

##### 交易验证

```typescript
async function verifyTransaction(transaction: Transaction) {
  // 验证接收者
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // 验证金额
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // 验证用户有足够余额
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### 验证步骤
- [ ] 验证钱包签名
- [ ] 验证交易详情
- [ ] 交易前余额检查
- [ ] 无盲交易签名

#### 10. 依赖安全

##### 定期更新

```bash
# 检查漏洞
npm audit

# 自动修复可修复的问题
npm audit fix

# 更新依赖
npm update

# 检查过时的包
npm outdated
```

##### 锁文件

```bash
# 始终提交锁文件
git add package-lock.json

# 在 CI/CD 中用于可重现构建
npm ci  # 而不是 npm install
```

##### 验证步骤
- [ ] 依赖是最新的
- [ ] 无已知漏洞（npm audit clean）
- [ ] 提交锁文件
- [ ] GitHub 上启用 Dependabot
- [ ] 定期安全更新

### 安全测试

#### 自动化安全测试

```typescript
// 测试认证
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// 测试授权
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// 测试输入验证
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// 测试速率限制
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### 部署前安全检查清单

在任何生产部署之前：

- [ ] **密钥**：无硬编码密钥，全部在环境变量中
- [ ] **输入验证**：所有用户输入已验证
- [ ] **SQL 注入**：所有查询参数化
- [ ] **XSS**：用户内容已清理
- [ ] **CSRF**：保护已启用
- [ ] **认证**：正确的令牌处理
- [ ] **授权**：角色检查已到位
- [ ] **速率限制**：在所有端点上启用
- [ ] **HTTPS**：生产中强制执行
- [ ] **安全头**：CSP、X-Frame-Options 已配置
- [ ] **错误处理**：错误中无敏感数据
- [ ] **日志记录**：日志中无敏感数据
- [ ] **依赖**：最新，无漏洞
- [ ] **行级安全性**：Supabase 中已启用
- [ ] **CORS**：正确配置
- [ ] **文件上传**：已验证（大小、类型）
- [ ] **钱包签名**：已验证（如果是区块链）

::: tip 记住

安全不是可选的。一个漏洞可能会危及整个平台。如有疑问，选择谨慎的一方。
:::

---

## 6. continuous-learning（持续学习）

### 工作原理

此技能作为 **Stop hook** 在每次会话结束时运行：

1. **会话评估**：检查会话是否有足够的消息（默认：10+）
2. **模式检测**：从会话中识别可提取的模式
3. **技能提取**：将有用的模式保存到 `~/.claude/skills/learned/`

### 配置

编辑 `config.json` 进行自定义：

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

### 模式类型

| 模式 | 描述 |
|-------|------|
| `error_resolution` | 如何解决特定错误 |
| `user_corrections` | 来自用户更正的模式 |
| `workarounds` | 框架/库怪癖的解决方案 |
| `debugging_techniques` | 有效的调试方法 |
| `project_specific` | 项目特定的约定 |

### Hook 设置

添加到你的 `~/.claude/settings.json`：

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

### 为什么使用 Stop Hook？

- **轻量级**：仅在会话结束时运行一次
- **非阻塞**：不会给每条消息增加延迟
- **完整上下文**：可以访问完整的会话记录

### 相关

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 持续学习部分
- `/learn` 命令 - 会话中途手动提取模式

---

## 7. strategic-compact（策略性压缩）

### 为什么使用策略性压缩？

自动压缩在任意点触发：
- 通常在任务中间，丢失重要上下文
- 无逻辑任务边界的意识
- 可能中断复杂的多步骤操作

逻辑边界的策略性压缩：
- **探索后、执行前** - 压缩研究上下文，保留实施计划
- **完成里程碑后** - 为下一阶段的新开始
- **主要上下文转换前** - 在不同任务前清除研究上下文

### 工作原理

`suggest-compact.sh` 脚本在 PreToolUse（Edit/Write）上运行并：

1. **跟踪工具调用** - 计算会话中的工具调用次数
2. **阈值检测** - 在可配置阈值时建议（默认：50 次调用）
3. **定期提醒** - 阈值后每 25 次调用提醒一次

### Hook 设置

添加到你的 `~/.claude/settings.json`：

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

环境变量：
- `COMPACT_THRESHOLD` - 首次建议前的工具调用（默认：50）

### 最佳实践

1. **规划后压缩** - 计划完成后，压缩重新开始
2. **调试后压缩** - 继续前清除错误解决上下文
3. **不要在实施中压缩** - 为相关更改保留上下文
4. **阅读建议** - Hook 告诉你**什么时候**，你决定**是否**

### 相关

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Token 优化部分
- Memory persistence hooks - 持久化压缩后保持的状态

---

## 8. eval-harness（评估工具）

### 哲学

评估驱动开发将评估视为"AI 开发的单元测试"：
- 实现前定义预期行为
- 开发期间连续运行评估
- 跟踪每次更改的回归
- 使用 pass@k 指标测量可靠性

### 评估类型

#### 功能评估

测试 Claude 以前做不到的事情：
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion1
  - [ ] Criterion2
  - [ ] Criterion3
Expected Output: Description of expected result
```

#### 回归评估

确保更改不会破坏现有功能：
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

### 评分器类型

#### 1. 基于代码的评分器

使用代码的确定性检查：
```bash
# 检查文件是否包含预期模式
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# 检查测试是否通过
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# 检查构建是否成功
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. 基于模型的评分器

使用 Claude 评估开放式输出：
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

#### 3. 人工评分器

标记供人工审查：
```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

### 指标

#### pass@k

"k 次尝试中至少有一次成功"
- pass@1：首次尝试成功率
- pass@3：3 次内成功率
- 典型目标：pass@3 > 90%

#### pass^k

"所有 k 次试验都成功"
- 可靠性门槛更高
- pass^3：3 次连续成功
- 用于关键路径

### 评估工作流

#### 1. 定义（编码前）

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

#### 2. 实现

编写代码通过定义的评估。

#### 3. 评估

```bash
# 运行功能评估
[Run each capability eval, record PASS/FAIL]

# 运行回归评估
npm test -- --testPathPattern="existing"

# 生成报告
```

#### 4. 报告

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

### 集成模式

#### 实施前

```
/eval define feature-name
```
在 `.claude/evals/feature-name.md` 创建评估定义文件

#### 实施期间

```
/eval check feature-name
```
运行当前评估并报告状态

#### 实施后

```
/eval report feature-name
```
生成完整评估报告

### 评估存储

将评估存储在项目中：

```
.claude/
  evals/
    feature-xyz.md      # 评估定义
    feature-xyz.log     # 评估运行历史
    baseline.json       # 回归基线
```

### 最佳实践

1. **编码前定义评估** - 强制对成功标准的清晰思考
2. **频繁运行评估** - 尽早捕获回归
3. **随时间跟踪 pass@k** - 监控可靠性趋势
4. **尽可能使用代码评分器** - 确定性 > 概率性
5. **安全的人工审查** - 永远不要完全自动化安全检查
6. **保持评估快速** - 慢评估不会被运行
7. **评估随代码版本化** - 评估是一流工件

### 示例：添加认证

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

## 9. verification-loop（验证循环）

### 何时使用

在以下情况下调用此技能：
- 完成功能或重大代码更改后
- 创建 PR 之前
- 当你想要确保质量检查通过时
- 重构后

### 验证阶段

#### 阶段 1：构建验证

```bash
# 检查项目是否构建
npm run build 2>&1 | tail -20
# 或
pnpm build 2>&1 | tail -20
```

如果构建失败，停止并继续之前修复。

#### 阶段 2：类型检查

```bash
# TypeScript 项目
npx tsc --noEmit 2>&1 | head -30

# Python 项目
pyright . 2>&1 | head -30
```

报告所有类型错误。继续之前修复关键错误。

#### 阶段 3：Lint 检查

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### 阶段 4：测试套件

```bash
# 运行带覆盖率的测试
npm run test -- --coverage 2>&1 | tail -50

# 检查覆盖率阈值
# 目标：80% 最低
```

报告：
- 总测试数：X
- 通过：X
- 失败：X
- 覆盖率：X%

#### 阶段 5：安全扫描

```bash
# 检查密钥
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# 检查 console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### 阶段 6：Diff 审查

```bash
# 显示更改的内容
git diff --stat
git diff HEAD~1 --name-only
```

审查每个更改文件的：
- 意外更改
- 缺少错误处理
- 潜在边缘情况

### 输出格式

运行所有阶段后，生成验证报告：

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

### 持续模式

对于长会话，每 15 分钟或重大更改后运行验证：

```markdown
设置一个心理检查点：
- 完成每个函数后
- 完成组件后
- 移动到下一个任务前

运行：/verify
```

### 与 Hooks 集成

此技能补充 PostToolUse hooks，但提供更深入的验证。Hooks 立即捕获问题；此技能提供全面审查。

---

## 10. project-guidelines-example（项目指南示例）

这是一个项目特定技能的示例。将其用作自己项目的模板。

基于真实生产应用：[Zenith](https://zenith.chat) - AI 驱动的客户发现平台。

### 何时使用

在处理为其设计的特定项目时参考此技能。项目技能包含：
- 架构概述
- 文件结构
- 代码模式
- 测试要求
- 部署工作流

---

## 11. clickhouse-io（ClickHouse I/O）

### 概述

ClickHouse 是用于在线分析处理（OLAP）的面向列的数据库管理系统。它针对大数据集上的快速分析查询进行了优化。

**关键特性：**
- 面向列的存储
- 数据压缩
- 并行查询执行
- 分布式查询
- 实时分析

### 表设计模式

#### MergeTree 引擎（最常见）

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
-- 对于可能有重复的数据（例如，来自多个来源）
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

#### AggregatingMergeTree（预聚合）

```sql
-- 用于维护聚合指标
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- 查询聚合数据
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

### 查询优化模式

#### 高效过滤

```sql
-- ✅ GOOD: 首先使用索引列
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ BAD: 首先过滤非索引列
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### 聚合

```sql
-- ✅ GOOD: 使用 ClickHouse 特定聚合函数
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

-- ✅ 使用 quantile 作为百分位数（比 percentile 更高效）
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### 数据插入模式

#### 批量插入（推荐）

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

// ✅ 批量插入（高效）
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

// ❌ 单独插入（慢）
async function insertTrade(trade: Trade) {
  // 不要在循环中这样做！
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### 流式插入

```typescript
// 用于连续数据导入
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

### 物化视图

#### 实时聚合

```sql
-- 为每小时统计创建物化视图
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

-- 查询物化视图
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

### 性能监控

#### 查询性能

```sql
-- 检查慢查询
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

#### 表统计

```sql
-- 检查表大小
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

### 常见分析查询

#### 时间序列分析

```sql
-- 每日活跃用户
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
-- 转化漏斗
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

#### 队列分析

```sql
-- 按注册月的用户队列
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

### 数据管道模式

#### ETL 模式

```typescript
// 提取、转换、加载
async function etlPipeline() {
  // 1. 从源提取
  const rawData = await extractFromPostgres()

  // 2. 转换
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. 加载到 ClickHouse
  await bulkInsertToClickHouse(transformed)
}

// 定期运行
setInterval(etlPipeline, 60 * 60 * 1000)  // 每小时
```

#### 变更数据捕获（CDC）

```typescript
// 监听 PostgreSQL 更改并同步到 ClickHouse
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

### 最佳实践

#### 1. 分区策略
- 按时间分区（通常是月或天）
- 避免太多分区（性能影响）
- 使用 DATE 类型作为分区键

#### 2. 排序键
- 首先放置最频繁过滤的列
- 考虑基数（高基数优先）
- 排序影响压缩

#### 3. 数据类型
- 使用最小适当类型（UInt32 vs UInt64）
- 对重复字符串使用 LowCardinality
- 对分类数据使用 Enum

#### 4. 避免
- SELECT *（指定列）
- FINAL（在查询前合并数据）
- 太多 JOIN（分析时反规范化）
- 小频繁插入（改为批量）

#### 5. 监控
- 跟踪查询性能
- 监控磁盘使用
- 检查合并操作
- 审查慢查询日志

::: tip 记住

ClickHouse 在分析工作负载上表现出色。为你的查询模式设计表，批量插入，并利用物化视图进行实时聚合。
:::

---

## 下一课预告

> 下一课我们学习 **[Scripts API 参考](../scripts-api/)**。
>
> 你会学到：
> - Node.js 脚本接口和工具函数
> - 包管理器检测机制
> - Hooks 脚本的实现细节
> - 测试套件的使用方法

---

## 本课小结

Everything Claude Code 的 11 个技能库为开发过程提供了全面的知识支持：

1. **coding-standards** - 统一编码规范、不可变模式、最佳实践
2. **backend-patterns** - 后端架构模式、API 设计、数据库优化
3. **frontend-patterns** - React/Next.js 模式、状态管理、性能优化
4. **tdd-workflow** - 测试驱动开发工作流、80%+ 覆盖率
5. **security-review** - OWASP Top 10、输入验证、漏洞检测
6. **continuous-learning** - 自动提取可复用模式、知识沉淀
7. **strategic-compact** - 策略性上下文压缩、Token 优化
8. **eval-harness** - 评估驱动开发、可靠性测试
9. **verification-loop** - 综合验证系统、质量检查
10. **project-guidelines-example** - 项目配置示例、架构模板
11. **clickhouse-io** - ClickHouse 分析模式、高性能查询

记住，这些技能库是你代码质量的指南针。在开发过程中正确应用它们，可以显著提升开发效率和代码质量。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 技能库 | 文件路径 | 行号 |
|-------|---------|------|
| coding-standards | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | 1-521 |
| backend-patterns | [`skills/backend-patterns/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/backend-patterns/SKILL.md) | 1-583 |
| frontend-patterns | [`skills/frontend-patterns/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/frontend-patterns/SKILL.md) | 1-632 |
| continuous-learning | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| strategic-compact | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| tdd-workflow | [`skills/tdd-workflow/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/tdd-workflow/SKILL.md) | 1-410 |
| security-review | [`skills/security-review/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/security-review/SKILL.md) | 1-495 |
| eval-harness | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |
| verification-loop | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| project-guidelines-example | [`skills/project-guidelines-example/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/project-guidelines-example/SKILL.md) | 1-346 |
| clickhouse-io | [`skills/clickhouse-io/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/clickhouse-io/SKILL.md) | 1-430 |

**关键原则**：
- **coding-standards**: 不可变模式、文件 < 800 行、函数 < 50 行、80%+ 测试覆盖率
- **backend-patterns**: Repository 模式、Service 层分离、参数化查询、Redis 缓存
- **frontend-patterns**: 组件组合、自定义 Hooks、Context + Reducer、记忆化、懒加载
- **tdd-workflow**: 测试先行、单元/集成/E2E 测试、测试覆盖率验证
- **security-review**: OWASP Top 10 检查、输入验证、SQL 注入预防、XSS 预防

**相关 Agents**：
- **tdd-guide**: TDD 流程指导
- **code-reviewer**: 代码质量和风格审查
- **security-reviewer**: 安全漏洞检测
- **architect**: 架构设计和模式选择

</details>
