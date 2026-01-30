---
title: "Справочник по Skills: 11 библиотек навыков | Everything Claude Code"
sidebarTitle: "5-минутный справочник по 11 навыкам"
subtitle: "Справочник по Skills: 11 библиотек навыков"
description: "Изучите применение 11 библиотек навыков Everything Claude Code. Освойте стандарты кодирования, шаблоны бэкенда/фронта, рабочий процесс TDD и аудит безопасности для повышения эффективности разработки."
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

# Полный справочник по Skills: подробное описание 11 библиотек навыков

## Чему вы научитесь

- Быстро находить и понимать содержание и назначение всех 11 библиотек навыков
- Правильно применять стандарты кодирования, архитектурные шаблоны и лучшие практики в процессе разработки
- Знать, какой навык использовать в какой ситуации для повышения эффективности и качества кода
- Освоить ключевые навыки: рабочий процесс TDD, аудит безопасности, непрерывное обучение

## Ваша текущая проблема

Столкнувшись с 11 библиотеками навыков в проекте, вы можете:

- **Не помнить все навыки**: coding-standards, backend-patterns, security-review... какие навыки когда использовать?
- **Не знать, как применять**: навыки упоминают неизменяемые паттерны, процесс TDD, но как это реализовать?
- **Не знать, к кому обратиться за помощью**: проблемы с безопасностью - какой навык использовать? разработка бэкенда - какой навык?
- **Отношения между навыками и агентами**: в чём разница между Skills и Agents? когда использовать Agent, а когда Skill?

Этот справочный документ поможет вам всесторонне понять содержание каждого навыка, сценарии использования и методы применения.

---

## Обзор Skills

Everything Claude Code содержит 11 библиотек навыков, каждая из которых имеет чёткие цели и сценарии использования:

| Библиотека навыков | Цель | Приоритет | Сценарии использования |
|--- | --- | --- | ---|
| **coding-standards** | Единые стандарты кодирования, лучшие практики | P0 | Общее кодирование, TypeScript/JavaScript/React |
| **backend-patterns** | Шаблоны архитектуры бэкенда, дизайн API | P0 | Разработка Node.js, Express, Next.js API routes |
| **frontend-patterns** | Шаблоны фронтенд-разработки, оптимизация производительности | P0 | React, Next.js, управление состоянием |
| **tdd-workflow** | Рабочий процесс разработки через тестирование | P0 | Разработка новых функций, исправление багов, рефакторинг |
| **security-review** | Аудит безопасности и обнаружение уязвимостей | P0 | Аутентификация и авторизация, валидация ввода, обработка чувствительных данных |
| **continuous-learning** | Автоматическое извлечение повторно используемых паттернов | P1 | Долгосрочные проекты, накопление знаний |
| **strategic-compact** | Стратегическое сжатие контекста | P1 | Длинные сессии, сложные задачи |
| **eval-harness** | Фреймворк для разработки, управляемой оценкой | P1 | Оценка AI-разработки, тестирование надёжности |
| **verification-loop** | Комплексная система верификации | P1 | Проверка перед PR, контроль качества |
| **project-guidelines-example** | Пример руководства по проекту | P2 | Пользовательские стандарты проекта |
| **clickhouse-io** | Шаблоны анализа ClickHouse | P2 | Высокопроизводительные аналитические запросы |

::: info Skills vs Agents

**Skills** — это определения рабочих процессов и база знаний предметной области, предоставляющие паттерны, лучшие практики и нормативные рекомендации.

**Agents** — это специализированные субагенты, выполняющие сложные задачи в конкретных областях (планирование, аудит, отладка).

Они дополняют друг друга: Skills предоставляют структуру знаний, Agents выполняют конкретные задачи.
:::

---

## 1. coding-standards (стандарты кодирования)

### Основные принципы

#### 1. Приоритет читаемости
- Код читается гораздо чаще, чем пишется
- Чёткие имена переменных и функций
- Самодокументирующийся код лучше комментариев
- Согласованное форматирование

#### 2. Принцип KISS (Keep It Simple, Stupid)
- Используйте самое простое эффективное решение
- Избегайте чрезмерного проектирования
- Не преждевременно оптимизируйте
- Понятность > умный код

#### 3. Принцип DRY (Don't Repeat Yourself)
- Извлекайте общую логику в функции
- Создавайте повторно используемые компоненты
- Делитесь служебными функциями между модулями
- Избегайте копипаст-программирования

#### 4. Принцип YAGNI (You Aren't Gonna Need It)
- Не создавайте функциональность до того, как она понадобится
- Избегайте спекулятивных обобщений
- Увеличивайте сложность только при необходимости
- Начинайте просто, рефакторьте при необходимости

### Неизменяемый паттерн (CRITICAL)

::: warning Критическое правило

Всегда создавайте новые объекты, никогда не модифицируйте существующие! Это один из самых важных принципов качества кода.
:::

**❌ Неправильно**: прямое изменение объекта

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ Правильно**: создание нового объекта

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Лучшие практики TypeScript/JavaScript

#### Именование переменных

```typescript
// ✅ GOOD: описательные имена
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ BAD: неясные имена
const q = 'election'
const flag = true
const x = 1000
```

#### Именование функций

```typescript
// ✅ GOOD: паттерн глагол-существительное
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ BAD: неясно или только существительные
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### Обработка ошибок

```typescript
// ✅ GOOD: всесторонняя обработка ошибок
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

// ❌ BAD: без обработки ошибок
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### Параллельное выполнение

```typescript
// ✅ GOOD: по возможности параллельное выполнение
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ BAD: ненужное последовательное выполнение
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### Лучшие практики React

#### Структура компонентов

```typescript
// ✅ GOOD: функциональный компонент с типами
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

// ❌ BAD: без типов, неясная структура
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### Пользовательские Hooks

```typescript
// ✅ GOOD: повторно используемый пользовательский hook
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

// Использование
const debouncedQuery = useDebounce(searchQuery, 500)
```

#### Обновление состояния

```typescript
// ✅ GOOD: функциональное обновление состояния
const [count, setCount] = useState(0)

// Обновление на основе предыдущего состояния
setCount(prev => prev + 1)

// ❌ BAD: прямая ссылка на состояние
setCount(count + 1)  // Может быть устаревшим в асинхронных сценариях
```

### Стандарты дизайна API

#### REST API соглашения

```
GET    /api/markets              # Список всех рынков
GET    /api/markets/:id          # Получить конкретный рынок
POST   /api/markets              # Создать новый рынок
PUT    /api/markets/:id          # Обновить рынок (полностью)
PATCH  /api/markets/:id          # Обновить рынок (частично)
DELETE /api/markets/:id          # Удалить рынок

# Параметры запроса для фильтрации
GET /api/markets?status=active&limit=10&offset=0
```

#### Формат ответа

```typescript
// ✅ GOOD: согласованная структура ответа
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

// Успешный ответ
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// Ответ с ошибкой
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### Валидация ввода

```typescript
import { z } from 'zod'

// ✅ GOOD: валидация схемы
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
    // Продолжаем обработку валидированных данных
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

### Организация файлов

#### Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── markets/           # Страницы рынков
│   └── (auth)/           # Страницы аутентификации (группа маршрутов)
├── components/            # React компоненты
│   ├── ui/               # Общие UI компоненты
│   ├── forms/            # Компоненты форм
│   └── layouts/          # Компоненты макетов
├── hooks/                # Пользовательские React hooks
├── lib/                  # Утилиты и конфигурация
│   ├── api/             # API клиент
│   ├── utils/           # Вспомогательные функции
│   └── constants/       # Константы
├── types/                # Типы TypeScript
└── styles/              # Глобальные стили
```

### Лучшие практики производительности

#### Мемоизация

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD: мемоизация дорогостоящих вычислений
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GOOD: мемоизация функций обратного вызова
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### Ленивая загрузка

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: ленивая загрузка тяжёлых компонентов
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### Стандарты тестирования

#### Структура тестов (паттерн AAA)

```typescript
test('calculates similarity correctly', () => {
  // Arrange (подготовка)
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act (выполнение)
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert (проверка)
  expect(similarity).toBe(0)
})
```

#### Именование тестов

```typescript
// ✅ GOOD: описательные имена тестов
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ BAD: неясные имена тестов
test('works', () => { })
test('test search', () => { })
```

### Обнаружение запахов кода

#### 1. Длинные функции

```typescript
// ❌ BAD: функция более 50 строк
function processMarketData() {
  // 100 строк кода
}

// ✅ GOOD: разделение на небольшие функции
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

#### 2. Глубокая вложенность

```typescript
// ❌ BAD: 5+ уровней вложенности
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // что-то делаем
        }
      }
    }
  }
}

// ✅ GOOD: ранний возврат
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// что-то делаем
```

#### 3. Магические числа

```typescript
// ❌ BAD: необъяснённые числа
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GOOD: именованные константы
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---

## 2. backend-patterns (шаблоны бэкенда)

### Паттерны дизайна API

#### RESTful API структура

```typescript
// ✅ URL на основе ресурсов
GET    /api/markets                 # Список ресурсов
GET    /api/markets/:id             # Получить один ресурс
POST   /api/markets                 # Создать ресурс
PUT    /api/markets/:id             # Заменить ресурс
PATCH  /api/markets/:id             # Обновить ресурс
DELETE /api/markets/:id             # Удалить ресурс

// ✅ Параметры запроса для фильтрации, сортировки, пагинации
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### Паттерн Repository

```typescript
// Абстракция логики доступа к данным
interface MarketRepository {
  findAll(filters?: MarketFilters): Promise<Market[]>
  findById(id: string): Promise<Market | null>
  create(data: CreateMarketDto): Promise<Market>
  update: string, data: UpdateMarketDto): Promise<Market>
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

  // Другие методы...
}
```

#### Паттерн Service Layer

```typescript
// Разделение бизнес-логики и доступа к данным
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // Бизнес-логика
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // Получение полных данных
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // Сортировка по схожести
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // Реализация векторного поиска
  }
}
```

#### Паттерн Middleware

```typescript
// Конвейер обработки запроса/ответа
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

// Использование
export default withAuth(async (req, res) => {
  // Обработчик может получить доступ к req.user
})
```

### Паттерны базы данных

#### Оптимизация запросов

```typescript
// ✅ GOOD: выбираем только нужные столбцы
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ BAD: выбираем всё
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### Предотвращение проблемы N+1

```typescript
// ❌ BAD: проблема N+1 запросов
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N запросов
}

// ✅ GOOD: пакетное получение
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 запрос
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### Паттерн транзакций

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Использование транзакции Supabase
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// SQL функция в Supabase
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Транзакция начинается автоматически
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- Откат происходит автоматически
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### Стратегии кэширования

#### Слой кэширования Redis

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // Сначала проверяем кэш
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // Промах кэша - получаем из базы данных
    const market = await this.baseRepo.findById(id)

    if (market) {
      // Кэшируем на 5 минут
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### Паттерны обработки ошибок

#### Централизованный обработчик ошибок

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

  // Логируем неожиданные ошибки
  console.error('Unexpected error:', error)

  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 })
}

// Использование
export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return errorHandler(error, request)
  }
}
```

#### Экспоненциальный откат с повторными попытками

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
        // Экспоненциальный откат: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Использование
const data = await fetchWithRetry(() => fetchFromAPI())
```

### Аутентификация и авторизация

#### Проверка JWT токена

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

// Использование в API route
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

#### Управление доступом на основе ролей

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

// Использование
export const DELETE = requirePermission('delete')(async (request: Request) => {
  // Обработчик с проверкой разрешений
})
```

### Ограничение скорости запросов

#### Простой ограничитель скорости в памяти

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

    // Удаляем старые запросы за пределами окна
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // Превышен лимит скорости
    }

    // Добавляем текущий запрос
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 запросов/минуту

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // Продолжаем обработку запроса
}
```

### Фоновые задачи и очереди

#### Простой паттерн очереди

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
    // Логика выполнения задачи
  }
}

// Для индексации рынков
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // Добавляем в очередь вместо блокировки
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### Логирование и мониторинг

#### Структурированное логирование

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

// Использование
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

## 3. frontend-patterns (шаблоны фронтенда)

### Паттерны компонентов

#### Композиция вместо наследования

```typescript
// ✅ GOOD: композиция компонентов
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

// Использование
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

#### Составные компоненты

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

// Использование
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

#### Паттерн Render Props

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

// Использование
<DataLoader<Market[]> url="/api/markets">
  {(markets, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <Error error={error} />
    return <MarketList markets={markets!} />
  }}
</DataLoader>
```

### Паттерны пользовательских Hooks

#### Hook управления состоянием

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// Использование
const [isOpen, toggleOpen] = useToggle()
```

#### Hook асинхронного получения данных

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

// Использование
const { data: markets, loading, error, refetch } = useQuery(
  'markets',
  () => fetch('/api/markets').then(r => r.json()),
  {
    onSuccess: data => console.log('Fetched', data.length, 'markets'),
    onError: err => console.error('Failed:', err)
  }
)
```

#### Hook debounce

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

// Использование
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

### Паттерны управления состоянием

#### Паттерн Context + Reducer

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

### Оптимизация производительности

#### Мемоизация

```typescript
// ✅ useMemo для дорогостоящих вычислений
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallback для функций, передаваемых дочерним компонентам
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// ✅ React.memo для чистых компонентов
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

#### Разделение кода и ленивая загрузка

```typescript
import { lazy, Suspense } from 'react'

// ✅ Ленивая загрузка тяжёлых компонентов
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

#### Виртуализация длинных списков

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // Оценочная высота строки
    overscan: 5  // Дополнительные элементы для рендеринга
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

### Паттерны обработки форм

#### Управляемая форма с валидацией

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
      // Обработка успеха
    } catch (error) {
      // Обработка ошибок
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

      {/* Другие поля */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

### Паттерн Error Boundary

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

  componentDid componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

// Использование
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Паттерны анимации

#### Анимации Framer Motion

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ Анимация списка
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

// ✅ Анимация модального окна
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

### Паттерны доступности

#### Навигация с клавиатуры

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
      {/* Реализация выпадающего списка */}
    </div>
  )
}
```

#### Управление фокусом

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущий сфокусированный элемент
      previousFocusRef.current = document.activeElement as HTMLElement

      // Перемещаем фокус на модальное окно
      modalRef.current?.focus()
    } else {
      // Восстанавливаем фокус при закрытии
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

## 4. tdd-workflow (рабочий процесс TDD)

### Когда активировать

- Написание новых функций или функциональности
- Исправление багов или проблем
- Рефакторинг существующего кода
- Добавление API endpoints
- Создание новых компонентов

### Основные принципы

#### 1. Сначала тесты
Всегда пишите тесты сначала, затем пишите код, чтобы тесты проходили.

#### 2. Требования к покрытию
- Минимум 80% покрытия (unit + integration + E2E)
- Покрытие всех граничных случаев
- Тестирование сценариев ошибок
- Проверка граничных условий

#### 3. Типы тестов

##### Unit тесты
- Изолированные функции и служебные функции
- Логика компонентов
- Чистые функции
- Вспомогательные функции и утилиты

##### Integration тесты
- API endpoints
- Операции с базой данных
- Взаимодействие сервисов
- Внешние API вызовы

##### E2E тесты (Playwright)
- Ключевые пользовательские потоки
- Полные рабочие процессы
- Пользовательская автоматизация
- UI взаимодействие

### Шаги рабочего процесса TDD

#### Шаг 1: Написание пользовательского пути

```
Как [роль], я хочу [действие], чтобы [выгода]

Пример:
Как пользователь, я хочу семантический поиск рынков,
чтобы находить связанные рынки даже без точных ключевых слов.
```

#### Шаг 2: Генерация тестовых случаев

Создание комплексных тестовых случаев для каждого пользовательского пути:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // Реализация теста
  })

  it('handles empty query gracefully', async () => {
    // Тестирование граничного случая
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // Тестирование деградации
  })

  it('sorts results by similarity score', async () => {
    // Тестирование логики сортировки
  })
})
```

#### Шаг 3: Запуск тестов (должны провалиться)

```bash
npm test
# Тесты должны провалиться - мы ещё не реализовали
```

#### Шаг 4: Реализация кода

Напишите минимальный код для прохождения тестов:

```typescript
// Реализация, управляемая тестами
export async function searchMarkets(query: string) {
  // Реализуйте здесь
}
```

#### Шаг 5: Повторный запуск тестов

```bash
npm test
# Тесты теперь должны проходить
```

#### Шаг 6: Рефакторинг

Улучшение качества кода при сохранении зелёных тестов:
- Удаление дублирующегося кода
- Улучшение именования
- Оптимизация производительности
- Повышение читаемости

#### Шаг 7: Проверка покрытия

```bash
npm run test:coverage
# Проверка достижения 80%+ покрытия
```

### Паттерны тестирования

#### Паттерн unit тестов (Jest/Vitest)

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

#### Паттерн integration тестов API

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
    // Мокирование сбоя базы данных
    const request = new NextRequest('http://localhost/api/markets')
    // Тестирование обработки ошибок
  })
})
```

#### Паттерн E2E тестов (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // Навигация на страницу рынков
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // Проверка загрузки страницы
  await expect(page.locator('h1')).toContainText('Markets')

  // Поиск рынков
  await page.fill('input[placeholder="Search markets"]', 'election')

  // Ожидание debounce и результатов
  await page.waitForTimeout(600)

  // Проверка отображения результатов поиска
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // Проверка наличия поискового слова в результатах
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // Фильтрация по статусу
  await page.click('button:has-text("Active")')

  // Проверка отфильтрованных результатов
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // Сначала авторизуемся
  await page.goto('/creator-dashboard')

  // Заполнение формы создания рынка
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // Отправка формы
  await page.click('button[type="submit"]')

  // Проверка сообщения об успехе
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // Проверка перенаправления на страницу рынка
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### Организация тестовых файлов

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # Unit тесты
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # Integration тесты
└── e2e/
    ├── markets.spec.ts               # E2E тесты
    ├── trading.spec.ts
    └── auth.spec.ts
```

### Мокирование внешних сервисов

#### Мокирование Supabase

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

#### Мокирование Redis

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### Мокирование OpenAI

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // Мокирование 1536-мерного вложения
  ))
}))
```

### Проверка покрытия тестами

#### Запуск отчёта о покрытии

```bash
npm run test:coverage
```

#### Пороги покрытия

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

### Распространённые ошибки тестирования

#### ❌ Ошибка: тестирование деталей реализации

```typescript
// Не тестируйте внутреннее состояние
expect(component.state.count).toBe(5)
```

#### ✅ Правильно: тестирование видимого пользователем поведения

```typescript
// Тестируйте то, что видит пользователь
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ Ошибка: хрупкие селекторы

```typescript
// Легко ломается
await page.click('.css-class-xyz')
```

#### ✅ Правильно: семантические селекторы

```typescript
// Устойчиво к изменениям
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ Ошибка: отсутствие изоляции тестов

```typescript
// Тесты зависят друг от друга
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* зависит от предыдущего теста */ })
```

#### ✅ Правильно: независимые тесты

```typescript
// Каждый тест настраивает свои данные
test('creates user', () => {
  const user = createTestUser()
  // Логика теста
})

test('updates user', () => {
  const user = createTestUser()
  // Логика обновления
})
```

### Непрерывное тестирование

#### Режим наблюдения во время разработки

```bash
npm test -- --watch
# Тесты автоматически запускаются при изменении файлов
```

#### Хуки перед коммитом

```bash
# Запускается перед каждым коммитом
npm test && npm run lint
```

#### Интеграция CI/CD

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Лучшие практики

1. **Сначала тесты** - всегда TDD
2. **Одно утверждение на тест** - фокус на одном поведении
3. **Описательные имена тестов** - объясняйте, что тестируется
4. **Arrange-Act-Assert** - чёткая структура теста
5. **Мокирование внешних зависимостей** - изоляция unit тестов
6. **Тестирование граничных случаев** - null, undefined, пустые, большие значения
7. **Тестирование путей ошибок** - не только счастливый путь
8. **Держите тесты быстрыми** - unit тесты < 50ms
9. **Очистка после тестов** - без побочных эффектов
10. **Проверка отчётов о покрытии** - выявление пробелов

### Показатели успеха

- Достижение 80%+ покрытия кода
- Все тесты проходят (зелёные)
- Нет пропущенных или отключённых тестов
- Быстрое выполнение тестов (unit тесты < 30s)
- E2E тесты покрывают ключевые пользовательские потоки
- Тесты ловят баги перед продакшеном

::: tip Помните

Тестирование не является необязательным. Это страховка, поддерживающая уверенный рефакторинг, быструю разработку и надёжность продакшена.
:::

---

## 5. security-review (аудит безопасности)

### Когда активировать

- Реализация аутентификации или авторизации
- Обработка пользовательского ввода или загрузки файлов
- Создание новых API endpoints
- Обработка ключей или учётных данных
- Реализация платёжной функциональности
- Хранение или передача чувствительных данных
- Интеграция сторонних API

### Чеклист безопасности

#### 1. Управление ключами

##### ❌ Никогда не делайте этого

```typescript
const apiKey = "sk-proj-xxxxx"  // Жёстко закодированный ключ
const dbPassword = "password123" // В исходном коде
```

##### ✅ Всегда делайте это

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// Проверка наличия ключа
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### Проверка
- [ ] Нет жёстко закодированных API ключей, токенов или паролей
- [ ] Все ключи в переменных окружения
- [ ] `.env.local` в .gitignore
- [ ] Нет ключей в истории Git
- [ ] Продакшн ключи на хостинговой платформе (Vercel, Railway)

#### 2. Валидация ввода

##### Всегда валидируйте пользовательский ввод

```typescript
import { z } from 'zod'

// Определение схемы валидации
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// Валидация перед обработкой
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

##### Валидация загрузки файлов

```typescript
function validateFileUpload(file: File) {
  // Проверка размера (5MB максимум)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // Проверка типа
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Проверка расширения
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### Проверка
- [ ] Весь пользовательский ввод валидируется схемой
- [ ] Загрузка файлов ограничена (размер, тип, расширение)
- [ ] Пользовательский ввод не используется напрямую в запросах
- [ ] Валидация белым списком (не чёрным)
- [ ] Сообщения об ошибках не раскрывают чувствительную информацию

#### 3. Предотвращение SQL инъекций

##### ❌ Никогда не конкатенируйте SQL

```typescript
// Опасно - уязвимость SQL инъекции
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ Всегда используйте параметризованные запросы

```typescript
// Безопасно - параметризованный запрос
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// Или с использованием сырого SQL
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

##### Проверка
- [ ] Все запросы к базе данных используют параметризованные запросы
- [ ] Нет конкатенации строк в SQL
- [ ] Правильное использование ORM/построителя запросов
- [ ] Запросы Supabase правильно экранированы

#### 4. Аутентификация и авторизация

##### Обработка JWT токенов

```typescript
// ❌ Неправильно: localStorage (уязвим к XSS)
localStorage.setItem('token', token)

// ✅ Правильно: httpOnly cookies
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### Проверка авторизации

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // Всегда сначала проверяйте авторизацию
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // Продолжаем удаление
  await db.users.delete({ where: { id: userId } })
}
```

##### Row Level Security (Supabase)

```sql
-- Включаем RLS на всех таблицах
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Пользователи могут видеть только свои данные
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Пользователи могут обновлять только свои данные
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### Проверка
- [ ] Токены хранятся в httpOnly cookies (не localStorage)
- [ ] Проверка авторизации перед чувствительными операциями
- [ ] Row Level Security включена в Supabase
- [ ] Реализовано управление доступом на основе ролей
- [ ] Безопасное управление сессиями

#### 5. Предотвращение XSS

##### Очистка HTML

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Всегда очищайте предоставленный пользователем HTML
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

##### Content Security Policy

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

##### Проверка
- [ ] Пользовательский HTML очищен
- [ ] Настроены CSP заголовки
- [ ] Нет непроверенного динамического рендеринга контента
- [ ] Используйте встроенную защиту XSS React

#### 6. Защита от CSRF

##### CSRF токены

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

  // Обработка запроса
}
```

##### SameSite Cookies

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### Проверка
- [ ] CSRF токены на операциях изменения состояния
- [ ] Все cookies используют SameSite=Strict
- [ ] Реализован паттерн double-submit cookie

#### 7. Ограничение скорости

##### Ограничение скорости API

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов на окно
  message: 'Too many requests'
})

// Применение к routes
app.use('/api/', limiter)
```

##### Дорогие операции

```typescript
// Агрессивное ограничение скорости для поиска
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 10, // 10 запросов в минуту
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### Проверка
- [ ] Ограничение скорости на всех API endpoints
- [ ] Более строгие ограничения на дорогие операции
- [ ] Ограничение скорости на основе IP
- [ ] Ограничение скорости на основе пользователя (аутентифицированный)

#### 8. Раскрытие чувствительных данных

##### Логирование

```typescript
// ❌ Неправильно: логирование чувствительных данных
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ Правильно: редактирование чувствительных данных
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### Сообщения об ошибках

```typescript
// ❌ Неправильно: раскрытие внутренних деталей
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ Правильно: общее сообщение об ошибке
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### Проверка
- [ ] Нет паролей, токенов или ключей в логах
- [ ] Общие сообщения об ошибках для пользователей
- [ ] Подробные ошибки в логах сервера
- [ ] Нет стеков для пользователей

#### 9. Безопасность блокчейна (Solana)

##### Проверка кошелька

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

##### Проверка транзакции

```typescript
async function verifyTransaction(transaction: Transaction) {
  // Проверка получателя
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // Проверка суммы
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // Проверка достаточного баланса пользователя
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### Проверка
- [ ] Проверка подписи кошелька
- [ ] Проверка деталей транзакции
- [ ] Проверка баланса перед транзакцией
- [ ] Нет слепого подписания транзакций

#### 10. Безопасность зависимостей

##### Регулярные обновления

```bash
# Проверка уязвимостей
npm audit

# Автоматическое исправление исправимых проблем
npm audit fix

# Обновление зависимостей
npm update

# Проверка устаревших пакетов
npm outdated
```

##### Lock файлы

```bash
# Всегда коммитить lock файлы
git add package-lock.json

# Используется в CI/CD для воспроизводимых сборок
npm ci  # вместо npm install
```

##### Проверка
- [ ] Зависимости актуальны
- [ ] Нет известных уязвимостей (npm audit clean)
- [ ] Lock файлы закоммичены
- [ ] Dependabot включён на GitHub
- [ ] Регулярные обновления безопасности

### Тестирование безопасности

#### Автоматизированное тестирование безопасности

```typescript
// Тестирование аутентификации
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// Тестирование авторизации
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// Тестирование валидации ввода
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// Тестирование ограничения скорости
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### Чеклист безопасности перед деплоем

Перед любым продакшн деплоем:

- [ ] **Ключи**: нет жёстко закодированных ключей, все в переменных окружения
- [ ] **Валидация ввода**: весь пользовательский ввод валидирован
- [ ] **SQL инъекции**: все запросы параметризованы
- [ ] **XSS**: пользовательский контент очищен
- [ ] **CSRF**: защита включена
- [ ] **Аутентификация**: правильная обработка токенов
- [ ] **Авторизация**: проверки ролей на месте
- [ ] **Ограничение скорости**: включено на всех endpoints
- [ ] **HTTPS**: принудительно в продакшене
- [ ] **Безопасные заголовки**: CSP, X-Frame-Options настроены
- [ ] **Обработка ошибок**: нет чувствительных данных в ошибках
- [ ] **Логирование**: нет чувствительных данных в логах
- [ ] **Зависимости**: актуальны, без уязвимостей
- [ ] **Row Level Security**: включена в Supabase
- [ ] **CORS**: правильно настроен
- [ ] **Загрузка файлов**: валидирована (размер, тип)
- [ ] **Подпись кошелька**: проверена (если блокчейн)

::: tip Помните

Безопасность не является необязательной. Одна уязвимость может поставить под угрозу всю платформу. При сомнениях выбирайте осторожный подход.
:::

---

## 6. continuous-learning (непрерывное обучение)

### Как это работает

Этот навык запускается как **Stop hook** в конце каждой сессии:

1. **Оценка сессии**: проверка, достаточно ли сообщений в сессии (по умолчанию: 10+)
2. **Обнаружение паттернов**: идентификация извлекаемых паттернов из сессии
3. **Извлечение навыков**: сохранение полезных паттернов в `~/.claude/skills/learned/`

### Конфигурация

Отредактируйте `config.json` для настройки:

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

### Типы паттернов

| Паттерн | Описание |
|--- | ---|
| `error_resolution` | Как решать конкретные ошибки |
| `user_corrections` | Паттерны из исправлений пользователя |
| `workarounds` | Решения для странностей фреймворка/библиотеки |
| `debugging_techniques` | Эффективные методы отладки |
| `project_specific` | Специфические для проекта соглашения |

### Настройка Hook

Добавьте в ваш `~/.claude/settings.json`:

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

### Зачем использовать Stop Hook?

- **Лёгковесный**: запускается только один раз в конце сессии
- **Неблокирующий**: не добавляет задержку к каждому сообщению
- **Полный контекст**: доступ к полной истории сессии

### Связанные материалы

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - раздел непрерывного обучения
- Команда `/learn` - ручное извлечение паттернов в середине сессии

---

## 7. strategic-compact (стратегическое сжатие)

### Зачем использовать стратегическое сжатие?

Автоматическое сжатие срабатывает в произвольной точке:
- Обычно в середине задачи, теряя важный контекст
- Без осознания границ логических задач
- Может прервать сложные многошаговые операции

Стратегическое сжатие на логических границах:
- **После исследования, перед выполнением** - сжатие исследовательского контекста, сохранение плана реализации
- **После завершения вехи** - новый старт для следующего этапа
- **Перед основным изменением контекста** - очистка исследовательского контекста перед разными задачами

### Как это работает

Скрипт `suggest-compact.sh` запускается на PreToolUse (Edit/Write) и:

1. **Отслеживает вызовы инструментов** - подсчитывает количество вызовов инструментов в сессии
2. **Обнаружение порога** - предлагает при достижении настраиваемого порога (по умолчанию: 50 вызовов)
3. **Периодические напоминания** - напоминает каждые 25 вызовов после достижения порога

### Настройка Hook

Добавьте в ваш `~/.claude/settings.json`:

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

### Конфигурация

Переменные окружения:
- `COMPACT_THRESHOLD` - вызовы инструментов перед первым предложением (по умолчанию: 50)

### Лучшие практики

1. **Сжатие после планирования** - после завершения плана, сжатие и новый старт
2. **Сжатие после отладки** - очистка контекста разрешения ошибок перед продолжением
3. **Не сжимайте во время реализации** - сохраняйте контекст для связанных изменений
4. **Читайте предложения** - Hook говорит вам **когда**, вы решаете **нужно ли**

### Связанные материалы

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - раздел оптимизации токенов
- Хуки персистентности памяти - сохранение состояния после сжатия

---

## 8. eval-harness (оценочный инструмент)

### Философия

Разработка, управляемая оценкой, рассматривает оценку как "unit тесты для AI-разработки":
- Определение ожидаемого поведения перед реализацией
- Непрерывный запуск оценок во время разработки
- Отслеживание регрессий при каждом изменении
- Измерение надёжности с помощью метрик pass@k

### Типы оценок

#### Оценка функциональности

Тестирование того, что Claude ранее не мог делать:
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion1
  - [ ] Criterion2
  - [ ] Criterion3
Expected Output: Description of expected result
```

#### Оценка регрессии

Обеспечение того, что изменения не ломают существующую функциональность:
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

### Типы оценщиков

#### 1. Оценщик на основе кода

Использование детерминированных проверок кода:
```bash
# Проверка наличия ожидаемого паттерна в файле
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# Проверка прохождения тестов
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# Проверка успешности сборки
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. Оценщик на основе модели

Использование Claude для оценки открытых выводов:
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

#### 3. Человеческий оценщик

Маркировка для ручного обзора:
```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

### Метрики

#### pass@k

"хотя бы один успех в k попытках"
- pass@1: успешность первой попытки
- pass@3: успешность в течение 3 попыток
- Типичная цель: pass@3 > 90%

#### pass^k

"все k испытаний успешны"
- Более высокий порог надёжности
- pass^3: 3 последовательных успеха
- Используется для критических путей

### Рабочий процесс оценки

#### 1. Определение (перед кодированием)

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

#### 2. Реализация

Напишите код для прохождения определённых оценок.

#### 3. Оценка

```bash
# Запуск оценок функциональности
[Run each capability eval, record PASS/FAIL]

# Запуск оценок регрессии
npm test -- --testPathPattern="existing"

# Генерация отчёта
```

#### 4. Отчёт

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

### Паттерны интеграции

#### Перед реализацией

```
/eval define feature-name
```
Создаёт файл определения оценки в `.claude/evals/feature-name.md`

#### Во время реализации

```
/eval check feature-name
```
Запускает текущие оценки и сообщает статус

#### После реализации

```
/eval report feature-name
```
Генерирует полный отчёт об оценке

### Хранение оценок

Храните оценки в проекте:

```
.claude/
  evals/
    feature-xyz.md      # Определение оценки
    feature-xyz.log     # История запусков оценок
    baseline.json       # Базовая линия регрессии
```

### Лучшие практики

1. **Определите оценки перед кодированием** - заставляет чётко думать о критериях успеха
2. **Часто запускайте оценки** - раннее обнаружение регрессий
3. **Отслеживайте pass@k во времени** - мониторинг тенденций надёжности
4. **Используйте оценщики кода, когда возможно** - детерминизм > вероятность
5. **Безопасный человеческий обзор** - никогда не полностью автоматизируйте проверки безопасности
6. **Держите оценки быстрыми** - медленные оценки не будут запускаться
7. **Версионируйте оценки вместе с кодом** - оценки - первоклассные артефакты

### Пример: добавление аутентификации

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

## 9. verification-loop (цикл верификации)

### Когда использовать

Вызывайте этот навык в следующих случаях:
- После завершения функции или значительных изменений кода
- Перед созданием PR
- Когда вы хотите убедиться, что проверки качества пройдены
- После рефакторинга

### Этапы верификации

#### Этап 1: Проверка сборки

```bash
# Проверка, собирается ли проект
npm run build 2>&1 | tail -20
# или
pnpm build 2>&1 | tail -20
```

Если сборка не удалась, остановитесь и исправьте перед продолжением.

#### Этап 2: Проверка типов

```bash
# Проект TypeScript
npx tsc --noEmit 2>&1 | head -30

# Проект Python
pyright . 2>&1 | head -30
```

Сообщите обо всех ошибках типов. Исправьте критические ошибки перед продолжением.

#### Этап 3: Проверка Lint

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### Этап 4: Набор тестов

```bash
# Запуск тестов с покрытием
npm run test -- --coverage 2>&1 | tail -50

# Проверка порогов покрытия
# Цель: 80% минимум
```

Сообщите:
- Всего тестов: X
- Прошло: X
- Неудачно: X
- Покрытие: X%

#### Этап 5: Сканирование безопасности

```bash
# Проверка ключей
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Проверка console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### Этап 6: Обзор diff

```bash
# Показать изменённое содержимое
git diff --stat
git diff HEAD~1 --name-only
```

Проверьте каждый изменённый файл на:
- Непреднамеренные изменения
- Отсутствие обработки ошибок
- Потенциальные граничные случаи

### Формат вывода

После запуска всех этапов сгенерируйте отчёт верификации:

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

### Непрерывный режим

Для длинных сессий запускайте верификацию каждые 15 минут или после значительных изменений:

```markdown
Установите ментальную контрольную точку:
- После завершения каждой функции
- После завершения компонента
- Перед переходом к следующей задаче

Запуск: /verify
```

### Интеграция с Hooks

Этот навык дополняет PostToolUse hooks, но обеспечивает более глубокую верификацию. Hooks ловят проблемы немедленно; этот навык обеспечивает всесторонний обзор.

---

## 10. project-guidelines-example (пример руководства по проекту)

Это пример навыка, специфичного для проекта. Используйте его как шаблон для собственных проектов.

Основан на реальном продакшн-приложении: [Zenith](https://zenith.chat) - платформа для обнаружения клиентов на базе AI.

### Когда использовать

Ссылайтесь на этот навык при работе с конкретным проектом, для которого он был разработан. Навыки проекта содержат:
- Обзор архитектуры
- Структуру файлов
- Паттерны кода
- Требования к тестированию
- Рабочий процесс деплоя

---

## 11. clickhouse-io (ClickHouse I/O)

### Обзор

ClickHouse — это система управления базами данных, ориентированная на столбцы, для онлайн-аналитической обработки (OLAP). Она оптимизирована для быстрых аналитических запросов на больших наборах данных.

**Ключевые возможности:**
- Хранение по столбцам
- Сжатие данных
- Параллельное выполнение запросов
- Распределённые запросы
- Анализ в реальном времени

### Паттерны дизайна таблиц

#### Движок MergeTree (наиболее распространённый)

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

#### ReplacingMergeTree (дедупликация)

```sql
-- Для данных, которые могут иметь дубликаты (например, из нескольких источников)
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

#### AggregatingMergeTree (предварительная агрегация)

```sql
-- Для поддержания агрегированных метрик
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- Запрос агрегированных данных
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

### Паттерны оптимизации запросов

#### Эффективная фильтрация

```sql
-- ✅ GOOD: сначала используем индексированные столбцы
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ BAD: сначала фильтруем по неиндексированным столбцам
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### Агрегация

```sql
-- ✅ GOOD: используем специфичные агрегатные функции ClickHouse
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

-- ✅ Использование quantile для процентилей (более эффективно, чем percentile)
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### Паттерны вставки данных

#### Пакетная вставка (рекомендуется)

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

// ✅ Пакетная вставка (эффективно)
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

// ❌ Отдельная вставка (медленно)
async function insertTrade(trade: Trade) {
  // Не делайте это в цикле!
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### Потоковая вставка

```typescript
// Для непрерывного импорта данных
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

### Материализованные представления

#### Агрегация в реальном времени

```sql
-- Создание материализованного представления для почасовой статистики
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

-- Запрос материализованного представления
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

### Мониторинг производительности

#### Производительность запросов

```sql
-- Проверка медленных запросов
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

#### Статистика таблиц

```sql
-- Проверка размера таблиц
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

### Распространённые аналитические запросы

#### Анализ временных рядов

```sql
-- Ежедневные активные пользователи
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- Анализ удержания
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

#### Анализ воронки

```sql
-- Воронка конверсии
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

#### Анализ когорт

```sql
-- Когорты пользователей по месяцу регистрации
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

### Паттерны конвейеров данных

#### Паттерн ETL

```typescript
// Извлечение, преобразование, загрузка
async function etlPipeline() {
  // 1. Извлечение из источника
  const rawData = await extractFromPostgres()

  // 2. Преобразование
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. Загрузка в ClickHouse
  await bulkInsertToClickHouse(transformed)
}

// Запуск периодически
setInterval(etlPipeline, 60 * 60 * 1000)  // Каждый час
```

#### Захват изменяющихся данных (CDC)

```typescript
// Прослушивание изменений PostgreSQL и синхронизация с ClickHouse
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

### Лучшие практики

#### 1. Стратегия секционирования
- Секционирование по времени (обычно месяц или день)
- Избегайте слишком большого количества секций (влияние на производительность)
- Используйте тип DATE как ключ секционирования

#### 2. Ключ сортировки
- Сначала разместите наиболее часто фильтруемые столбцы
- Учитывайте кардинальность (высокая кардинальность приоритетна)
- Сортировка влияет на сжатие

#### 3. Типы данных
- Используйте минимальный подходящий тип (UInt32 vs UInt64)
- Используйте LowCardinality для повторяющихся строк
- Используйте Enum для категориальных данных

#### 4. Избегайте
- SELECT * (указывайте столбцы)
- FINAL (слияние данных перед запросом)
- Слишком много JOIN (денормализация при анализе)
- Мелкие частые вставки (используйте пакетные)

#### 5. Мониторинг
- Отслеживайте производительность запросов
- Мониторьте использование диска
- Проверяйте операции слияния
- Просматривайте журнал медленных запросов

::: tip Помните

ClickHouse отлично справляется с аналитическими рабочими нагрузками. Проектируйте таблицы под ваши паттерны запросов, используйте пакетные вставки и используйте материализованные представления для агрегации в реальном времени.
:::

---

## Предпросмотр следующего урока

> В следующем уроке мы изучим **[Справочник по Scripts API](../scripts-api/)**.
>
> Вы узнаете:
> - Интерфейсы скриптов Node.js и служебные функции
> - Механизм обнаружения менеджеров пакетов
> - Детали реализации скриптов Hooks
> - Методы использования наборов тестов

---

## Итоги урока

11 библиотек навыков Everything Claude Code предоставляют всестороннюю поддержку знаний для процесса разработки:

1. **coding-standards** - единые стандарты кодирования, неизменяемые паттерны, лучшие практики
2. **backend-patterns** - паттерны архитектуры бэкенда, дизайн API, оптимизация базы данных
3. **frontend-patterns** - паттерны React/Next.js, управление состоянием, оптимизация производительности
4. **tdd-workflow** - рабочий процесс разработки через тестирование, 80%+ покрытие
5. **security-review** - OWASP Top 10, валидация ввода, обнаружение уязвимостей
6. **continuous-learning** - автоматическое извлечение повторно используемых паттернов, накопление знаний
7. **strategic-compact** - стратегическое сжатие контекста, оптимизация токенов
8. **eval-harness** - разработка, управляемая оценкой, тестирование надёжности
9. **verification-loop** - комплексная система верификации, контроль качества
10. **project-guidelines-example** - пример конфигурации проекта, шаблон архитектуры
11. **clickhouse-io** - паттерны анализа ClickHouse, высокопроизводительные запросы

Помните, что эти библиотеки навыков — это компас качества вашего кода. Правильное их применение в процессе разработки может значительно повысить эффективность разработки и качество кода.

---

## Приложение: Справочник по исходному коду

<details>
<summary><strong>Нажмите, чтобы раскрыть расположение исходного кода</strong></summary>

> Время обновления: 2026-01-25

| Библиотека навыков | Путь к файлу | Номер строки |
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
|--- | --- | ---|

**Ключевые принципы**:
- **coding-standards**: неизменяемые паттерны, файлы < 800 строк, функции < 50 строк, 80%+ покрытие тестами
- **backend-patterns**: паттерн Repository, разделение Service Layer, параметризованные запросы, кэширование Redis
- **frontend-patterns**: композиция компонентов, пользовательские Hooks, Context + Reducer, мемоизация, ленивая загрузка
- **tdd-workflow**: сначала тесты, unit/integration/E2E тесты, проверка покрытия тестами
- **security-review**: проверки OWASP Top 10, валидация ввода, предотвращение SQL инъекций, предотвращение XSS

**Связанные Agents**:
- **tdd-guide**: руководство по процессу TDD
- **code-reviewer**: обзор качества кода и стиля
- **security-reviewer**: обнаружение уязвимостей безопасности
- **architect**: дизайн архитектуры и выбор паттернов

</details>
