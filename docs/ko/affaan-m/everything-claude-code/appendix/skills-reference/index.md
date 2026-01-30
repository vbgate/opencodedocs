---
title: "Skills 참조: 11개 기술 라이브러리 | Everything Claude Code"
sidebarTitle: "5분 안에 11개 기술 속성"
subtitle: "Skills 참조: 11개 기술 라이브러리"
description: "Everything Claude Code의 11개 기술 라이브러리 활용법을 학습하세요. 코딩 표준, 백엔드/프론트엔드 패턴, TDD 워크플로우, 보안 검토를 마스터하여 개발 효율성을 높이세요."
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

# Skills 완전 참조: 11개 기술 라이브러리 상세 가이드

## 학습 완료 후 할 수 있는 것

- 11개 기술 라이브러리의 내용과 용도를 빠르게 찾고 이해하기
- 개발 과정에서 코딩 표준, 아키텍처 패턴, 모범 사례를 올바르게 적용하기
- 개발 효율성과 코드 품질을 높이기 위해 어떤 기술을 언제 사용할지 알기
- TDD 워크플로우, 보안 검토, 지속적 학습 등 핵심 기술 마스터하기

## 현재 당신이 겪고 있는 문제

프로젝트의 11개 기술 라이브러리를 마주하면 다음과 같은 어려움을 겪을 수 있습니다:

- **모든 기술을 기억하기 어려움**: coding-standards, backend-patterns, security-review... 어떤 기술을 언제 사용해야 할까?
- **적용 방법을 모름**: 기술에서 불변 패턴, TDD 프로세스를 언급하지만 구체적으로 어떻게 작동할까?
- **어떤 기술을 사용할지 모름**: 보안 문제가 발생하면 어떤 기술을 사용해야 할까? 백엔드 개발에는 어떤 기술을 사용해야 할까?
- **기술과 Agent의 관계**: Skills와 Agents의 차이점은 무엇일까? 언제 Agent를 사용하고 언제 Skill을 사용해야 할까?

이 참조 문서는 각 기술의 내용, 적용 시나리오, 사용 방법을 포괄적으로 이해하는 데 도움을 줍니다.

---

## Skills 개요

Everything Claude Code는 11개의 기술 라이브러리를 포함하며, 각 기술은 명확한 목표와 적용 시나리오를 가지고 있습니다:

| 기술 라이브러리 | 목표 | 우선순위 | 사용 시나리오 |
| --- | --- | --- | --- |
| **coding-standards** | 통일된 코딩 규범, 모범 사례 | P0 | 일반 코딩, TypeScript/JavaScript/React |
| **backend-patterns** | 백엔드 아키텍처 패턴, API 설계 | P0 | Node.js, Express, Next.js API 라우트 개발 |
| **frontend-patterns** | 프론트엔드 개발 패턴, 성능 최적화 | P0 | React, Next.js, 상태 관리 |
| **tdd-workflow** | 테스트 주도 개발 워크플로우 | P0 | 새 기능 개발, 버그 수정, 리팩토링 |
| **security-review** | 보안 검토 및 취약점 탐지 | P0 | 인증/인가, 입력 검증, 민감 데이터 처리 |
| **continuous-learning** | 재사용 가능한 패턴 자동 추출 | P1 | 장기 프로젝트, 지식 축적 |
| **strategic-compact** | 전략적 컨텍스트 압축 | P1 | 긴 세션, 복잡한 작업 |
| **eval-harness** | 평가 주도 개발 프레임워크 | P1 | AI 개발 평가, 신뢰성 테스트 |
| **verification-loop** | 종합 검증 시스템 | P1 | PR 전 검증, 품질 검사 |
| **project-guidelines-example** | 프로젝트 가이드라인 예제 | P2 | 커스텀 프로젝트 규범 |
| **clickhouse-io** | ClickHouse 분석 패턴 | P2 | 고성능 분석 쿼리 |

::: info Skills vs Agents

**Skills**는 워크플로우 정의와 도메인 지식 라이브러리로, 패턴, 모범 사례, 규범 가이드를 제공합니다.

**Agents**는 전문화된 서브 에이전트로, 특정 도메인의 복잡한 작업(예: 계획, 검토, 디버깅)을 실행합니다.

두 가지는 상호 보완적입니다: Skills는 지식 프레임워크를 제공하고, Agents는 구체적인 작업을 실행합니다.
:::

---

## 1. coding-standards（코딩 표준）

### 핵심 원칙

#### 1. 가독성 우선

- 코드는 작성되는 횟수보다 읽히는 횟수가 훨씬 많습니다
- 명확한 변수 및 함수 명명
- 주석보다 자체 설명적인 코드
- 일관된 포맷팅

#### 2. KISS 원칙（Keep It Simple, Stupid）

- 가장 간단하고 효과적인 솔루션 사용
- 과도한 설계 방지
- 조기 최적화 금지
- 이해하기 쉬움 > 영리한 코드

#### 3. DRY 원칙（Don't Repeat Yourself）

- 공통 로직을 함수로 추출
- 재사용 가능한 컴포넌트 생성
- 모듈 간 유틸리티 함수 공유
- 복사-붙여넣기 프로그래밍 방지

#### 4. YAGNI 원칙（You Aren't Gonna Need It）

- 필요하기 전에 기능을 구축하지 마세요
- 추측성 일반화 방지
- 필요할 때만 복잡성 추가
- 간단하게 시작하고 필요할 때 리팩토링

### 불변 패턴（CRITICAL）

::: warning 핵심 규칙

항상 새 객체를 생성하고, 기존 객체를 절대 수정하지 마세요! 이것은 코드 품질의 가장 중요한 원칙 중 하나입니다.
:::

**❌ 잘못된 방법**: 객체 직접 수정

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 올바른 방법**: 새 객체 생성

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### TypeScript/JavaScript 모범 사례

#### 변수 명명

```typescript
// ✅ GOOD: 설명적인 명명
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ BAD: 불명확한 명명
const q = 'election'
const flag = true
const x = 1000
```

#### 함수 명명

```typescript
// ✅ GOOD: 동사-명사 패턴
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ BAD: 불명확하거나 명사만 있음
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### 오류 처리

```typescript
// ✅ GOOD: 포괄적인 오류 처리
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

// ❌ BAD: 오류 처리 없음
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### 병렬 실행

```typescript
// ✅ GOOD: 가능한 한 병렬 실행
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ BAD: 불필요한 순차 실행
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### React 모범 사례

#### 컴포넌트 구조

```typescript
// ✅ GOOD: 타입이 있는 함수 컴포넌트
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

// ❌ BAD: 타입 없음, 구조 불명확
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### 커스텀 Hooks

```typescript
// ✅ GOOD: 재사용 가능한 커스텀 hook
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

// 사용
const debouncedQuery = useDebounce(searchQuery, 500)
```

#### 상태 업데이트

```typescript
// ✅ GOOD: 함수형 상태 업데이트
const [count, setCount] = useState(0)

// 이전 상태 기반 업데이트
setCount(prev => prev + 1)

// ❌ BAD: 상태 직접 참조
setCount(count + 1)  // 비동기 시나리오에서 오래된 값일 수 있음
```

### API 설계 표준

#### REST API 규약

```
GET    /api/markets              # 모든 마켓 나열
GET    /api/markets/:id          # 특정 마켓 가져오기
POST   /api/markets              # 새 마켓 생성
PUT    /api/markets/:id          # 마켓 업데이트(전체)
PATCH  /api/markets/:id          # 마켓 업데이트(부분)
DELETE /api/markets/:id          # 마켓 삭제

# 쿼리 파라미터로 필터링
GET /api/markets?status=active&limit=10&offset=0
```

#### 응답 형식

```typescript
// ✅ GOOD: 일관된 응답 구조
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

// 성공 응답
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// 오류 응답
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### 입력 검증

```typescript
import { z } from 'zod'

// ✅ GOOD: 스키마 검증
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
    // 검증된 데이터로 계속 처리
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

### 파일 구조

#### 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── markets/           # 마켓 페이지
│   └── (auth)/           # 인증 페이지(라우트 그룹)
├── components/            # React 컴포넌트
│   ├── ui/               # 공통 UI 컴포넌트
│   ├── forms/            # 폼 컴포넌트
│   └── layouts/          # 레이아웃 컴포넌트
├── hooks/                # 커스텀 React hooks
├── lib/                  # 유틸리티 및 설정
│   ├── api/             # API 클라이언트
│   ├── utils/           # 헬퍼 함수
│   └── constants/       # 상수
├── types/                # TypeScript 타입
└── styles/              # 전역 스타일
```

### 성능 모범 사례

#### 메모이제이션

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD: 비용이 많이 드는 계산 메모이제이션
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GOOD: 콜백 함수 메모이제이션
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### 지연 로딩

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: 무거운 컴포넌트 지연 로딩
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### 테스트 표준

#### 테스트 구조（AAA 패턴）

```typescript
test('calculates similarity correctly', () => {
  // Arrange（준비）
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act（실행）
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert（단언）
  expect(similarity).toBe(0)
})
```

#### 테스트 명명

```typescript
// ✅ GOOD: 설명적인 테스트 이름
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ BAD: 모호한 테스트 이름
test('works', () => { })
test('test search', () => { })
```

### 코드 스멜 감지

#### 1. 긴 함수

```typescript
// ❌ BAD: 50줄 이상의 함수
function processMarketData() {
  // 100줄의 코드
}

// ✅ GOOD: 작은 함수로 분할
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

#### 2. 깊은 중첩

```typescript
// ❌ BAD: 5+ 레벨 중첩
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // 무언가 수행
        }
      }
    }
  }
}

// ✅ GOOD: 조기 반환
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// 무언가 수행
```

#### 3. 매직 넘버

```typescript
// ❌ BAD: 설명되지 않은 숫자
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GOOD: 명명된 상수
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---
## 2. backend-patterns（백엔드 패턴）

### API 설계 패턴

#### RESTful API 구조

```typescript
// ✅ 리소스 기반 URL
GET    /api/markets                 # 리소스 나열
GET    /api/markets/:id             # 단일 리소스 가져오기
POST   /api/markets                 # 리소스 생성
PUT    /api/markets/:id             # 리소스 교체
PATCH  /api/markets/:id             # 리소스 업데이트
DELETE /api/markets/:id             # 리소스 삭제

// ✅ 쿼리 파라미터로 필터링, 정렬, 페이징
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### Repository 패턴

```typescript
// 데이터 접근 로직 추상화
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

  // 기타 메서드...
}
```

#### Service 레이어 패턴

```typescript
// 비즈니스 로직과 데이터 접근 분리
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // 비즈니스 로직
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // 전체 데이터 가져오기
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // 유사도로 정렬
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // 벡터 검색 구현
  }
}
```

#### 미들웨어 패턴

```typescript
// 요청/응답 처리 파이프라인
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

// 사용
export default withAuth(async (req, res) => {
  // 핸들러는 req.user에 접근 가능
})
```

### 데이터베이스 패턴

#### 쿼리 최적화

```typescript
// ✅ GOOD: 필요한 컬럼만 선택
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ BAD: 모든 것 선택
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### N+1 쿼리 방지

```typescript
// ❌ BAD: N+1 쿼리 문제
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N번 쿼리
}

// ✅ GOOD: 일괄 가져오기
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1번 쿼리
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### 트랜잭션 패턴

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Supabase 트랜잭션 사용
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// Supabase의 SQL 함수
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- 트랜잭션 자동 시작
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- 롤백 자동 발생
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### 캐싱 전략

#### Redis 캐시 레이어

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // 먼저 캐시 확인
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // 캐시 미스 - 데이터베이스에서 가져오기
    const market = await this.baseRepo.findById(id)

    if (market) {
      // 5분간 캐시
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### 오류 처리 패턴

#### 중앙 집중식 오류 핸들러

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

  // 예상치 못한 오류 로깅
  console.error('Unexpected error:', error)

  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 })
}

// 사용
export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return errorHandler(error, request)
  }
}
```

#### 지수 백오프 재시도

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
        // 지수 백오프: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// 사용
const data = await fetchWithRetry(() => fetchFromAPI())
```

### 인증 및 인가

#### JWT 토큰 검증

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

// API 라우트에서 사용
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

#### 역할 기반 접근 제어

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

// 사용
export const DELETE = requirePermission('delete')(async (request: Request) => {
  // 권한 검사가 포함된 핸들러
})
```

### 속도 제한

#### 간단한 인메모리 속도 제한기

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

    // 윈도우 밖의 오래된 요청 제거
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // 속도 제한 초과
    }

    // 현재 요청 추가
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 요청/분

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // 요청 계속 처리
}
```

### 백그라운드 작업 및 큐

#### 간단한 큐 패턴

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
    // 작업 실행 로직
  }
}

// 마켓 인덱싱용
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // 블로킹 대신 큐에 추가
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### 로깅 및 모니터링

#### 구조화된 로깅

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

// 사용
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
## 3. frontend-patterns（프론트엔드 패턴）

### 컴포넌트 패턴

#### 상속보다 조합

```typescript
// ✅ GOOD: 컴포넌트 조합
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

// 사용
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

#### 복합 컴포넌트

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

// 사용
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

#### Render Props 패턴

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

// 사용
<DataLoader<Market[]> url="/api/markets">
  {(markets, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <Error error={error} />
    return <MarketList markets={markets!} />
  }}
</DataLoader>
```

### 커스텀 Hooks 패턴

#### 상태 관리 Hook

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// 사용
const [isOpen, toggleOpen] = useToggle()
```

#### 비동기 데이터 가져오기 Hook

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

// 사용
const { data: markets, loading, error, refetch } = useQuery(
  'markets',
  () => fetch('/api/markets').then(r => r.json()),
  {
    onSuccess: data => console.log('Fetched', data.length, 'markets'),
    onError: err => console.error('Failed:', err)
  }
)
```

#### 디바운스 Hook

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

// 사용
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

### 상태 관리 패턴

#### Context + Reducer 패턴

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

### 성능 최적화

#### 메모이제이션

```typescript
// ✅ useMemo로 비용이 많이 드는 계산 메모이제이션
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallback으로 자식 컴포넌트에 전달되는 함수 메모이제이션
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// ✅ React.memo로 순수 컴포넌트 메모이제이션
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

#### 코드 분할 및 지연 로딩

```typescript
import { lazy, Suspense } from 'react'

// ✅ 무거운 컴포넌트 지연 로딩
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

#### 긴 목록 가상화

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // 예상 행 높이
    overscan: 5  // 추가 렌더링할 항목
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

### 폼 처리 패턴

#### 검증이 있는 제어 폼

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
      // 성공 처리
    } catch (error) {
      // 오류 처리
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

      {/* 기타 필드 */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

### 오류 경계 패턴

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

// 사용
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 애니메이션 패턴

#### Framer Motion 애니메이션

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ 목록 애니메이션
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

// ✅ 모달 애니메이션
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

### 접근성 패턴

#### 키보드 내비게이션

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
      {/* 드롭다운 구현 */}
    </div>
  )
}
```

#### 포커스 관리

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // 현재 포커스 요소 저장
      previousFocusRef.current = document.activeElement as HTMLElement

      // 모달로 포커스 이동
      modalRef.current?.focus()
    } else {
      // 닫을 때 포커스 복원
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

## 4. tdd-workflow（TDD 워크플로우）

### 활성화 시점

- 새 기능 또는 기능 작성
- 버그 또는 이슈 수정
- 기존 코드 리팩토링
- API 엔드포인트 추가
- 새 컴포넌트 생성

### 핵심 원칙

#### 1. 테스트 우선

항상 테스트를 먼저 작성한 다음 테스트를 통과하는 코드를 작성합니다.

#### 2. 커버리지 요구사항

- 최소 80% 커버리지（단위 + 통합 + E2E）
- 모든 엣지 케이스 커버
- 오류 시나리오 테스트
- 경계 조건 검증

#### 3. 테스트 유형

##### 단위 테스트

- 독립 함수 및 유틸리티
- 컴포넌트 로직
- 순수 함수
- 헬퍼 함수 및 유틸리티

##### 통합 테스트

- API 엔드포인트
- 데이터베이스 작업
- 서비스 상호작용
- 외부 API 호출

##### E2E 테스트（Playwright）

- 핵심 사용자 플로우
- 완전한 워크플로우
- 브라우저 자동화
- UI 상호작용

### TDD 워크플로우 단계

#### 1단계: 사용자 여정 작성

```
[역할]로서, 나는 [작업]을 원합니다, [이익]을 위해

예시:
사용자로서, 나는 시맨틱 검색 마켓을 원합니다,
정확한 키워드 없이도 관련 마켓을 찾을 수 있도록.
```

#### 2단계: 테스트 케이스 생성

각 사용자 여정에 대한 포괄적인 테스트 케이스 생성:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // 테스트 구현
  })

  it('handles empty query gracefully', async () => {
    // 엣지 케이스 테스트
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // 폴백 동작 테스트
  })

  it('sorts results by similarity score', async () => {
    // 정렬 로직 테스트
  })
})
```

#### 3단계: 테스트 실행（실패해야 함）

```bash
npm test
# 테스트가 실패해야 함 - 아직 구현하지 않았음
```

#### 4단계: 코드 구현

테스트를 통과하는 최소한의 코드 작성:

```typescript
// 테스트 주도 구현
export async function searchMarkets(query: string) {
  // 여기에 구현
}
```

#### 5단계: 테스트 다시 실행

```bash
npm test
# 이제 테스트가 통과해야 함
```

#### 6단계: 리팩토링

테스트를 그린 상태로 유지하면서 코드 품질 개선:
- 중복 코드 제거
- 명명 개선
- 성능 최적화
- 가독성 향상

#### 7단계: 커버리지 검증

```bash
npm run test:coverage
# 80%+ 커버리지 달성 확인
```

### 테스트 패턴

#### 단위 테스트 패턴（Jest/Vitest）

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

#### API 통합 테스트 패턴

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
    // 데이터베이스 실패 모킹
    const request = new NextRequest('http://localhost/api/markets')
    // 오류 처리 테스트
  })
})
```

---
#### E2E 테스트 패턴（Playwright）

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // 마켓 페이지로 이동
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // 페이지 로드 확인
  await expect(page.locator('h1')).toContainText('Markets')

  // 마켓 검색
  await page.fill('input[placeholder="Search markets"]', 'election')

  // 디바운스 및 결과 대기
  await page.waitForTimeout(600)

  // 검색 결과 표시 확인
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // 결과에 검색어 포함 확인
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // 상태별 필터링
  await page.click('button:has-text("Active")')

  // 필터링된 결과 확인
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // 먼저 로그인
  await page.goto('/creator-dashboard')

  // 마켓 생성 폼 작성
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // 폼 제출
  await page.click('button[type="submit"]')

  // 성공 메시지 확인
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // 마켓 페이지로 리다이렉트 확인
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### 테스트 파일 구조

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # 단위 테스트
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # 통합 테스트
└── e2e/
    ├── markets.spec.ts               # E2E 테스트
    ├── trading.spec.ts
    └── auth.spec.ts
```

### 외부 서비스 모킹

#### Supabase 모킹

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

#### Redis 모킹

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### OpenAI 모킹

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // 1536차원 임베딩 모킹
  ))
}))
```

### 테스트 커버리지 검증

#### 커버리지 보고서 실행

```bash
npm run test:coverage
```

#### 커버리지 임계값

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

### 일반적인 테스트 오류

#### ❌ 잘못됨: 구현 세부사항 테스트

```typescript
// 내부 상태 테스트하지 마세요
expect(component.state.count).toBe(5)
```

#### ✅ 올바름: 사용자 가시 동작 테스트

```typescript
// 사용자가 보는 것 테스트
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ 잘못됨: 취약한 선택자

```typescript
// 쉽게 깨짐
await page.click('.css-class-xyz')
```

#### ✅ 올바름: 시맨틱 선택자

```typescript
// 변경에 탄력적
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ 잘못됨: 테스트 격리 없음

```typescript
// 테스트가 서로 의존
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* 이전 테스트에 의존 */ })
```

#### ✅ 올바름: 독립적인 테스트

```typescript
// 각 테스트가 자체 데이터 설정
test('creates user', () => {
  const user = createTestUser()
  // 테스트 로직
})

test('updates user', () => {
  const user = createTestUser()
  // 업데이트 로직
})
```

### 지속적 테스트

#### 개발 중 워치 모드

```bash
npm test -- --watch
# 파일 변경 시 테스트 자동 실행
```

#### 커밋 전 훅

```bash
# 매 커밋 전 실행
npm test && npm run lint
```

#### CI/CD 통합

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### 모범 사례

1. **테스트 먼저 작성** - 항상 TDD
2. **테스트당 하나의 단언** - 단일 동작에 집중
3. **설명적인 테스트 이름** - 테스트 내용 설명
4. **Arrange-Act-Assert** - 명확한 테스트 구조
5. **외부 의존성 모킹** - 단위 테스트 격리
6. **엣지 케이스 테스트** - Null, undefined, 빈 값, 큰 값
7. **오류 경로 테스트** - 해피 패스만이 아님
8. **테스트를 빠르게 유지** - 단위 테스트 < 50ms
9. **테스트 후 정리** - 부작용 없음
10. **커버리지 보고서 검토** - 격차 식별

### 성공 지표

- 80%+ 코드 커버리지 달성
- 모든 테스트 통과（그린）
- 건너뛰거나 비활성화된 테스트 없음
- 빠른 테스트 실행（단위 테스트 < 30s）
- E2E 테스트가 핵심 사용자 플로우 커버
- 프로덕션 전에 테스트가 버그 포착

::: tip 기억하세요

테스트는 선택 사항이 아닙니다. 자신감 있는 리팩토링, 빠른 개발, 프로덕션 안정성을 지원하는 안전망입니다.
:::

---

## 5. security-review（보안 검토）

### 활성화 시점

- 인증 또는 인가 구현
- 사용자 입력 또는 파일 업로드 처리
- 새 API 엔드포인트 생성
- 비밀 키 또는 자격 증명 처리
- 결제 기능 구현
- 민감한 데이터 저장 또는 전송
- 타사 API 통합

### 보안 체크리스트

#### 1. 비밀 키 관리

##### ❌ 절대 하지 마세요

```typescript
const apiKey = "sk-proj-xxxxx"  // 하드코딩된 키
const dbPassword = "password123" // 소스 코드에
```

##### ✅ 항상 이렇게 하세요

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// 키 존재 확인
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### 검증 단계

- [ ] 하드코딩된 API 키, 토큰 또는 비밀번호 없음
- [ ] 모든 비밀 키가 환경 변수에 있음
- [ ] `.env.local`이 .gitignore에 있음
- [ ] Git 히스토리에 비밀 키 없음
- [ ] 프로덕션 비밀 키가 호스팅 플랫폼에 있음（Vercel, Railway）

#### 2. 입력 검증

##### 항상 사용자 입력 검증

```typescript
import { z } from 'zod'

// 검증 스키마 정의
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// 처리 전 검증
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

##### 파일 업로드 검증

```typescript
function validateFileUpload(file: File) {
  // 크기 확인（5MB 최대）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // 타입 확인
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // 확장자 확인
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### 검증 단계

- [ ] 모든 사용자 입력이 스키마로 검증됨
- [ ] 파일 업로드 제한（크기, 타입, 확장자）
- [ ] 쿼리에서 사용자 입력 직접 사용 안 함
- [ ] 화이트리스트 검증（블랙리스트 아님）
- [ ] 오류 메시지가 민감한 정보 누출 안 함

#### 3. SQL 인젝션 방지

##### ❌ 절대 SQL 연결하지 마세요

```typescript
// 위험 - SQL 인젝션 취약점
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ 항상 매개변수화된 쿼리 사용

```typescript
// 안전 - 매개변수화된 쿼리
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// 또는 원시 SQL 사용
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

##### 검증 단계

- [ ] 모든 데이터베이스 쿼리가 매개변수화된 쿼리 사용
- [ ] SQL에 문자열 연결 없음
- [ ] ORM/쿼리 빌더 올바르게 사용
- [ ] Supabase 쿼리가 올바르게 정리됨

#### 4. 인증 및 인가

##### JWT 토큰 처리

```typescript
// ❌ 잘못됨: localStorage（XSS 공격에 취약）
localStorage.setItem('token', token)

// ✅ 올바름: httpOnly 쿠키
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### 인가 확인

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // 항상 먼저 인가 확인
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // 삭제 계속
  await db.users.delete({ where: { id: userId } })
}
```

##### 행 수준 보안（Supabase）

```sql
-- 모든 테이블에서 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 볼 수 있음
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 데이터만 업데이트할 수 있음
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### 검증 단계

- [ ] 토큰이 httpOnly 쿠키에 저장됨（localStorage 아님）
- [ ] 민감한 작업 전 인가 확인
- [ ] Supabase에서 행 수준 보안 활성화
- [ ] 역할 기반 접근 제어 구현
- [ ] 안전한 세션 관리

#### 5. XSS 방지

##### HTML 정리

```typescript
import DOMPurify from 'isomorphic-dompurify'

// 항상 사용자 제공 HTML 정리
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

##### 콘텐츠 보안 정책

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

##### 검증 단계

- [ ] 사용자 제공 HTML 정리
- [ ] CSP 헤더 구성
- [ ] 검증되지 않은 동적 콘텐츠 렌더링 없음
- [ ] React 내장 XSS 보호 사용

#### 6. CSRF 보호

##### CSRF 토큰

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

  // 요청 처리
}
```

##### SameSite 쿠키

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### 검증 단계

- [ ] 상태 변경 작업에 CSRF 토큰 있음
- [ ] 모든 쿠키가 SameSite=Strict 사용
- [ ] 이중 제출 쿠키 패턴 구현

#### 7. 속도 제한

##### API 속도 제한

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 윈도우당 100개 요청
  message: 'Too many requests'
})

// 라우트에 적용
app.use('/api/', limiter)
```

##### 비용이 많이 드는 작업

```typescript
// 검색에 대한 공격적인 속도 제한
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10, // 분당 10개 요청
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### 검증 단계

- [ ] 모든 API 엔드포인트에 속도 제한
- [ ] 비용이 많이 드는 작업에 더 엄격한 제한
- [ ] IP 기반 속도 제한
- [ ] 사용자 기반 속도 제한（인증됨）

#### 8. 민감한 데이터 노출

##### 로깅

```typescript
// ❌ 잘못됨: 민감한 데이터 로깅
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ 올바름: 민감한 데이터 편집
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### 오류 메시지

```typescript
// ❌ 잘못됨: 내부 세부 정보 노출
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ 올바름: 일반 오류 메시지
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### 검증 단계

- [ ] 로그에 비밀번호, 토큰 또는 키 없음
- [ ] 사용자에게 일반 오류 메시지
- [ ] 서버 로그에 상세한 오류
- [ ] 사용자에게 스택 트레이스 없음

---
#### 9. 블록체인 보안（Solana）

##### 지갑 검증

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

##### 트랜잭션 검증

```typescript
async function verifyTransaction(transaction: Transaction) {
  // 수신자 검증
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // 금액 검증
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // 사용자가 충분한 잔액을 가지고 있는지 검증
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### 검증 단계

- [ ] 지갑 서명 검증
- [ ] 트랜잭션 세부 정보 검증
- [ ] 트랜잭션 전 잔액 확인
- [ ] 블라인드 트랜잭션 서명 없음

#### 10. 의존성 보안

##### 정기 업데이트

```bash
# 취약점 확인
npm audit

# 수정 가능한 문제 자동 수정
npm audit fix

# 의존성 업데이트
npm update

# 오래된 패키지 확인
npm outdated
```

##### 락 파일

```bash
# 항상 락 파일 커밋
git add package-lock.json

# CI/CD에서 재현 가능한 빌드를 위해 사용
npm ci  # npm install 대신
```

##### 검증 단계

- [ ] 의존성이 최신 상태
- [ ] 알려진 취약점 없음（npm audit clean）
- [ ] 락 파일 커밋됨
- [ ] GitHub에서 Dependabot 활성화
- [ ] 정기 보안 업데이트

### 보안 테스트

#### 자동화된 보안 테스트

```typescript
// 인증 테스트
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// 인가 테스트
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// 입력 검증 테스트
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// 속도 제한 테스트
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### 배포 전 보안 체크리스트

모든 프로덕션 배포 전에:

- [ ] **비밀 키**: 하드코딩된 키 없음, 모두 환경 변수에 있음
- [ ] **입력 검증**: 모든 사용자 입력이 검증됨
- [ ] **SQL 인젝션**: 모든 쿼리가 매개변수화됨
- [ ] **XSS**: 사용자 콘텐츠가 정리됨
- [ ] **CSRF**: 보호가 활성화됨
- [ ] **인증**: 올바른 토큰 처리
- [ ] **인가**: 역할 확인이 제자리에 있음
- [ ] **속도 제한**: 모든 엔드포인트에서 활성화됨
- [ ] **HTTPS**: 프로덕션에서 강제됨
- [ ] **보안 헤더**: CSP, X-Frame-Options 구성됨
- [ ] **오류 처리**: 오류에 민감한 데이터 없음
- [ ] **로깅**: 로그에 민감한 데이터 없음
- [ ] **의존성**: 최신, 취약점 없음
- [ ] **행 수준 보안**: Supabase에서 활성화됨
- [ ] **CORS**: 올바르게 구성됨
- [ ] **파일 업로드**: 검증됨（크기, 타입）
- [ ] **지갑 서명**: 검증됨（블록체인인 경우）

::: tip 기억하세요

보안은 선택 사항이 아닙니다. 하나의 취약점이 전체 플랫폼을 위험에 빠뜨릴 수 있습니다. 의심스러우면 신중한 쪽을 선택하세요.
:::

---

## 6. continuous-learning（지속적 학습）

### 작동 방식

이 기술은 각 세션 종료 시 **Stop hook**으로 실행됩니다:

1. **세션 평가**: 세션에 충분한 메시지가 있는지 확인（기본값: 10+）
2. **패턴 감지**: 세션에서 추출 가능한 패턴 식별
3. **기술 추출**: 유용한 패턴을 `~/.claude/skills/learned/`에 저장

### 구성

`config.json`을 편집하여 커스터마이징:

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

### 패턴 유형

| 패턴 | 설명 |
| --- | --- |
| `error_resolution` | 특정 오류 해결 방법 |
| `user_corrections` | 사용자 수정에서 나온 패턴 |
| `workarounds` | 프레임워크/라이브러리 특이점 해결책 |
| `debugging_techniques` | 효과적인 디버깅 방법 |
| `project_specific` | 프로젝트별 규약 |

### Hook 설정

`~/.claude/settings.json`에 추가:

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

### Stop Hook을 사용하는 이유?

- **경량**: 세션 종료 시 한 번만 실행
- **비차단**: 각 메시지에 지연 추가 안 함
- **완전한 컨텍스트**: 전체 세션 기록에 접근 가능

### 관련 자료

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 지속적 학습 섹션
- `/learn` 명령 - 세션 중간에 수동으로 패턴 추출

---

## 7. strategic-compact（전략적 압축）

### 전략적 압축을 사용하는 이유?

자동 압축은 임의의 지점에서 트리거됩니다:
- 일반적으로 작업 중간에, 중요한 컨텍스트 손실
- 논리적 작업 경계 인식 없음
- 복잡한 다단계 작업 중단 가능

논리적 경계에서의 전략적 압축:
- **탐색 후, 실행 전** - 연구 컨텍스트 압축, 구현 계획 유지
- **마일스톤 완료 후** - 다음 단계를 위한 새로운 시작
- **주요 컨텍스트 전환 전** - 다른 작업 전에 연구 컨텍스트 정리

### 작동 방식

`suggest-compact.sh` 스크립트는 PreToolUse（Edit/Write）에서 실행되며:

1. **도구 호출 추적** - 세션의 도구 호출 횟수 계산
2. **임계값 감지** - 구성 가능한 임계값에서 제안（기본값: 50회 호출）
3. **정기 알림** - 임계값 후 25회 호출마다 알림

### Hook 설정

`~/.claude/settings.json`에 추가:

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

### 구성

환경 변수:
- `COMPACT_THRESHOLD` - 첫 제안 전 도구 호출 횟수（기본값: 50）

### 모범 사례

1. **계획 후 압축** - 계획 완료 후, 압축하여 다시 시작
2. **디버깅 후 압축** - 계속하기 전에 오류 해결 컨텍스트 정리
3. **구현 중 압축하지 마세요** - 관련 변경 사항에 대한 컨텍스트 유지
4. **제안 읽기** - Hook이 **언제**를 알려주고, 당신이 **여부**를 결정

### 관련 자료

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 토큰 최적화 섹션
- Memory persistence hooks - 압축 후 유지되는 상태 지속

---

## 8. eval-harness（평가 도구）

### 철학

평가 주도 개발은 평가를 "AI 개발의 단위 테스트"로 봅니다:
- 구현 전 예상 동작 정의
- 개발 중 지속적으로 평가 실행
- 각 변경의 회귀 추적
- pass@k 메트릭으로 신뢰성 측정

### 평가 유형

#### 기능 평가

Claude가 이전에 할 수 없었던 것 테스트:
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion1
  - [ ] Criterion2
  - [ ] Criterion3
Expected Output: Description of expected result
```

#### 회귀 평가

변경 사항이 기존 기능을 깨뜨리지 않는지 확인:
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

### 채점자 유형

#### 1. 코드 기반 채점자

코드를 사용한 결정론적 확인:
```bash
# 파일에 예상 패턴이 포함되어 있는지 확인
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# 테스트가 통과하는지 확인
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# 빌드가 성공하는지 확인
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. 모델 기반 채점자

Claude를 사용하여 개방형 출력 평가:
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

#### 3. 인간 채점자

인간 검토를 위해 표시:
```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

### 메트릭

#### pass@k

"k번 시도 중 최소 한 번 성공"
- pass@1: 첫 시도 성공률
- pass@3: 3번 내 성공률
- 일반적인 목표: pass@3 > 90%

#### pass^k

"모든 k번 시도가 성공"
- 더 높은 신뢰성 임계값
- pass^3: 3번 연속 성공
- 중요 경로에 사용

### 평가 워크플로우

#### 1. 정의（코딩 전）

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

#### 2. 구현

정의된 평가를 통과하는 코드 작성.

#### 3. 평가

```bash
# 기능 평가 실행
[Run each capability eval, record PASS/FAIL]

# 회귀 평가 실행
npm test -- --testPathPattern="existing"

# 보고서 생성
```

#### 4. 보고

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

### 통합 패턴

#### 구현 전

```
/eval define feature-name
```
`.claude/evals/feature-name.md`에 평가 정의 파일 생성

#### 구현 중

```
/eval check feature-name
```
현재 평가 실행 및 상태 보고

#### 구현 후

```
/eval report feature-name
```
전체 평가 보고서 생성

### 평가 저장소

프로젝트에 평가 저장:

```
.claude/
  evals/
    feature-xyz.md      # 평가 정의
    feature-xyz.log     # 평가 실행 기록
    baseline.json       # 회귀 기준선
```

### 모범 사례

1. **코딩 전 평가 정의** - 성공 기준에 대한 명확한 사고 강제
2. **평가 자주 실행** - 회귀를 조기에 포착
3. **시간 경과에 따라 pass@k 추적** - 신뢰성 추세 모니터링
4. **가능한 한 코드 채점자 사용** - 결정론적 > 확률적
5. **보안은 인간 검토** - 보안 검사를 완전히 자동화하지 마세요
6. **평가를 빠르게 유지** - 느린 평가는 실행되지 않음
7. **코드와 함께 평가 버전 관리** - 평가는 일급 아티팩트

### 예시: 인증 추가

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

## 9. verification-loop（검증 루프）

### 사용 시점

다음 상황에서 이 기술 호출:
- 기능 또는 주요 코드 변경 완료 후
- PR 생성 전
- 품질 검사 통과를 확인하고 싶을 때
- 리팩토링 후

### 검증 단계

#### 단계 1: 빌드 검증

```bash
# 프로젝트가 빌드되는지 확인
npm run build 2>&1 | tail -20
# 또는
pnpm build 2>&1 | tail -20
```

빌드 실패 시, 중지하고 계속하기 전에 수정.

#### 단계 2: 타입 검사

```bash
# TypeScript 프로젝트
npx tsc --noEmit 2>&1 | head -30

# Python 프로젝트
pyright . 2>&1 | head -30
```

모든 타입 오류 보고. 계속하기 전에 중요한 오류 수정.

#### 단계 3: Lint 검사

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### 단계 4: 테스트 스위트

```bash
# 커버리지와 함께 테스트 실행
npm run test -- --coverage 2>&1 | tail -50

# 커버리지 임계값 확인
# 목표: 80% 최소
```

보고:
- 총 테스트 수: X
- 통과: X
- 실패: X
- 커버리지: X%

#### 단계 5: 보안 스캔

```bash
# 비밀 키 확인
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# console.log 확인
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### 단계 6: Diff 검토

```bash
# 변경된 내용 표시
git diff --stat
git diff HEAD~1 --name-only
```

각 변경된 파일 검토:
- 예상치 못한 변경
- 누락된 오류 처리
- 잠재적 엣지 케이스

### 출력 형식

모든 단계 실행 후, 검증 보고서 생성:

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

### 지속 모드

긴 세션의 경우, 15분마다 또는 주요 변경 후 검증 실행:

```markdown
정신적 체크포인트 설정:
- 각 함수 완료 후
- 컴포넌트 완료 후
- 다음 작업으로 이동하기 전

실행: /verify
```

### Hooks와의 통합

이 기술은 PostToolUse hooks를 보완하지만 더 깊은 검증을 제공합니다. Hooks는 즉시 문제를 포착하고, 이 기술은 포괄적인 검토를 제공합니다.

---

## 10. project-guidelines-example（프로젝트 가이드라인 예제）

이것은 프로젝트별 기술의 예제입니다. 자신의 프로젝트를 위한 템플릿으로 사용하세요.

실제 프로덕션 애플리케이션 기반: [Zenith](https://zenith.chat) - AI 기반 고객 발견 플랫폼.

### 사용 시점

설계된 특정 프로젝트를 작업할 때 이 기술을 참조하세요. 프로젝트 기술에는 다음이 포함됩니다:
- 아키텍처 개요
- 파일 구조
- 코드 패턴
- 테스트 요구사항
- 배포 워크플로우

---
## 11. clickhouse-io（ClickHouse I/O）

### 개요

ClickHouse는 온라인 분석 처리(OLAP)를 위한 열 지향 데이터베이스 관리 시스템입니다. 대규모 데이터 세트에서 빠른 분석 쿼리를 위해 최적화되어 있습니다.

**주요 기능:**
- 열 지향 스토리지
- 데이터 압축
- 병렬 쿼리 실행
- 분산 쿼리
- 실시간 분석

### 테이블 설계 패턴

#### MergeTree 엔진（가장 일반적）

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

#### ReplacingMergeTree（중복 제거）

```sql
-- 중복이 있을 수 있는 데이터용（예: 여러 소스에서）
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

#### AggregatingMergeTree（사전 집계）

```sql
-- 집계 메트릭 유지용
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- 집계 데이터 쿼리
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

### 쿼리 최적화 패턴

#### 효율적인 필터링

```sql
-- ✅ GOOD: 인덱스 열 먼저 사용
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ BAD: 비인덱스 열 먼저 필터링
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### 집계

```sql
-- ✅ GOOD: ClickHouse 특정 집계 함수 사용
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

-- ✅ 백분위수에 quantile 사용（percentile보다 효율적）
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### 데이터 삽입 패턴

#### 일괄 삽입（권장）

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

// ✅ 일괄 삽입（효율적）
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

// ❌ 개별 삽입（느림）
async function insertTrade(trade: Trade) {
  // 루프에서 이렇게 하지 마세요!
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### 스트리밍 삽입

```typescript
// 연속 데이터 가져오기용
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

### 구체화된 뷰

#### 실시간 집계

```sql
-- 시간별 통계를 위한 구체화된 뷰 생성
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

-- 구체화된 뷰 쿼리
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

### 성능 모니터링

#### 쿼리 성능

```sql
-- 느린 쿼리 확인
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

#### 테이블 통계

```sql
-- 테이블 크기 확인
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

### 일반적인 분석 쿼리

#### 시계열 분석

```sql
-- 일일 활성 사용자
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- 리텐션 분석
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

#### 퍼널 분석

```sql
-- 전환 퍼널
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

#### 코호트 분석

```sql
-- 가입 월별 사용자 코호트
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

### 데이터 파이프라인 패턴

#### ETL 패턴

```typescript
// 추출, 변환, 로드
async function etlPipeline() {
  // 1. 소스에서 추출
  const rawData = await extractFromPostgres()

  // 2. 변환
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. ClickHouse에 로드
  await bulkInsertToClickHouse(transformed)
}

// 정기적으로 실행
setInterval(etlPipeline, 60 * 60 * 1000)  // 매시간
```

#### 변경 데이터 캡처（CDC）

```typescript
// PostgreSQL 변경 사항 수신 및 ClickHouse에 동기화
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

### 모범 사례

#### 1. 파티셔닝 전략

- 시간별 파티션（일반적으로 월 또는 일）
- 너무 많은 파티션 방지（성능 영향）
- 파티션 키로 DATE 타입 사용

#### 2. 정렬 키

- 가장 자주 필터링되는 열을 먼저 배치
- 카디널리티 고려（높은 카디널리티 우선）
- 정렬이 압축에 영향

#### 3. 데이터 타입

- 가장 작은 적절한 타입 사용（UInt32 vs UInt64）
- 반복되는 문자열에 LowCardinality 사용
- 범주형 데이터에 Enum 사용

#### 4. 피해야 할 것

- SELECT *（열 지정）
- FINAL（쿼리 전 데이터 병합）
- 너무 많은 JOIN（분석 시 비정규화）
- 작고 빈번한 삽입（대신 일괄 처리）

#### 5. 모니터링

- 쿼리 성능 추적
- 디스크 사용량 모니터링
- 병합 작업 확인
- 느린 쿼리 로그 검토

::: tip 기억하세요

ClickHouse는 분석 워크로드에서 뛰어난 성능을 발휘합니다. 쿼리 패턴에 맞게 테이블을 설계하고, 일괄 삽입하며, 실시간 집계를 위해 구체화된 뷰를 활용하세요.
:::

---

## 다음 강의 예고

> 다음 강의에서는 **[Scripts API 참조](../scripts-api/)**를 학습합니다.
>
> 배울 내용:
> - Node.js 스크립트 인터페이스 및 유틸리티 함수
> - 패키지 매니저 감지 메커니즘
> - Hooks 스크립트 구현 세부 사항
> - 테스트 스위트 사용 방법

---

## 이 강의 요약

Everything Claude Code의 11개 기술 라이브러리는 개발 프로세스에 포괄적인 지식 지원을 제공합니다:

1. **coding-standards** - 통일된 코딩 규범, 불변 패턴, 모범 사례
2. **backend-patterns** - 백엔드 아키텍처 패턴, API 설계, 데이터베이스 최적화
3. **frontend-patterns** - React/Next.js 패턴, 상태 관리, 성능 최적화
4. **tdd-workflow** - 테스트 주도 개발 워크플로우, 80%+ 커버리지
5. **security-review** - OWASP Top 10, 입력 검증, 취약점 탐지
6. **continuous-learning** - 재사용 가능한 패턴 자동 추출, 지식 축적
7. **strategic-compact** - 전략적 컨텍스트 압축, 토큰 최적화
8. **eval-harness** - 평가 주도 개발, 신뢰성 테스트
9. **verification-loop** - 종합 검증 시스템, 품질 검사
10. **project-guidelines-example** - 프로젝트 구성 예제, 아키텍처 템플릿
11. **clickhouse-io** - ClickHouse 분석 패턴, 고성능 쿼리

기억하세요, 이러한 기술 라이브러리는 코드 품질의 나침반입니다. 개발 과정에서 올바르게 적용하면 개발 효율성과 코드 품질을 크게 향상시킬 수 있습니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기술 라이브러리 | 파일 경로 | 라인 |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**핵심 원칙**:
- **coding-standards**: 불변 패턴, 파일 < 800줄, 함수 < 50줄, 80%+ 테스트 커버리지
- **backend-patterns**: Repository 패턴, Service 레이어 분리, 매개변수화된 쿼리, Redis 캐싱
- **frontend-patterns**: 컴포넌트 조합, 커스텀 Hooks, Context + Reducer, 메모이제이션, 지연 로딩
- **tdd-workflow**: 테스트 우선, 단위/통합/E2E 테스트, 테스트 커버리지 검증
- **security-review**: OWASP Top 10 검사, 입력 검증, SQL 인젝션 방지, XSS 방지

**관련 Agents**:
- **tdd-guide**: TDD 프로세스 가이드
- **code-reviewer**: 코드 품질 및 스타일 검토
- **security-reviewer**: 보안 취약점 탐지
- **architect**: 아키텍처 설계 및 패턴 선택

</details>
