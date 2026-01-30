---
title: "Referencia de Skills: 11 Librerías de Skills | Everything Claude Code"
sidebarTitle: "Referencia Rápida de 11 Skills en 5 Minutos"
subtitle: "Referencia de Skills: 11 Librerías de Skills"
description: "Aprende a aplicar las 11 librerías de skills de Everything Claude Code. Domina los estándares de código, patrones de backend/frontend, flujo TDD y revisión de seguridad para mejorar la eficiencia de desarrollo."
tags:
  - "skills"
  - "estándares-de-código"
  - "patrones-de-backend"
  - "patrones-de-frontend"
  - "flujo-tdd"
  - "revisión-de-seguridad"
prerequisite:
  - "start-quickstart"
order: 210
---

# Referencia Completa de Skills: 11 Librerías de Skills Explicadas

## Lo que podrás hacer después de aprender

- Buscar y entender rápidamente el contenido y propósito de las 11 librerías de skills
- Aplicar correctamente estándares de código, patrones de arquitectura y mejores prácticas durante el desarrollo
- Saber qué skill usar en cada momento para mejorar la eficiencia y calidad del código
- Dominar habilidades clave como flujo TDD, revisión de seguridad y aprendizaje continuo

## Tu situación actual

Frente a las 11 librerías de skills en tu proyecto, es posible que:

- **No recuerdes todos los skills**: coding-standards, backend-patterns, security-review... ¿Qué skill se usa en qué momento?
- **No sepas cómo aplicarlos**: Los skills mencionan el patrón inmutable, el proceso TDD, pero ¿cómo se hace exactamente?
- **No sepas a quién acudir**: ¿Qué skill se usa para problemas de seguridad? ¿Cuál para desarrollo backend?
- **La relación entre Skills y Agents**: ¿Cuál es la diferencia entre Skills y Agents? ¿Cuándo usar uno u otro?

Esta referencia te ayudará a comprender completamente el contenido, escenarios de aplicación y métodos de uso de cada skill.

---

## Visión General de Skills

Everything Claude Code incluye 11 librerías de skills, cada una con objetivos y escenarios de aplicación específicos:

| Librería de Skill | Objetivo | Prioridad | Escenario de Uso |
| --- | --- | --- | --- |
| **coding-standards** | Estandarizar código, mejores prácticas | P0 | Codificación general, TypeScript/JavaScript/React |
| **backend-patterns** | Patrones de arquitectura backend, diseño de APIs | P0 | Desarrollo con Node.js, Express, Next.js API routes |
| **frontend-patterns** | Patrones de desarrollo frontend, optimización de rendimiento | P0 | React, Next.js, gestión de estado |
| **tdd-workflow** | Flujo de desarrollo guiado por pruebas | P0 | Nuevas funcionalidades, corrección de bugs, refactorización |
| **security-review** | Revisión de seguridad y detección de vulnerabilidades | P0 | Autorización, validación de entrada, manejo de datos sensibles |
| **continuous-learning** | Extracción automática de patrones reutilizables | P1 | Proyectos a largo plazo, preservación de conocimiento |
| **strategic-compact** | Compresión estratégica de contexto | P1 | Sesiones largas, tareas complejas |
| **eval-harness** | Framework de desarrollo impulsado por evaluación | P1 | Evaluación de desarrollo IA, pruebas de confiabilidad |
| **verification-loop** | Sistema de verificación integral | P1 | Verificación antes de PR, control de calidad |
| **project-guidelines-example** | Ejemplo de guías de proyecto | P2 | Personalización de especificaciones de proyecto |
| **clickhouse-io** | Patrones de análisis con ClickHouse | P2 | Consultas analíticas de alto rendimiento |

::: info Skills vs Agents

**Skills** son definiciones de flujo de trabajo y bases de conocimiento, proporcionando patrones, mejores prácticas y guía de especificaciones.

**Agents** son subagentes especializados que ejecutan tareas complejas en dominios específicos (como planificación, revisión, depuración).

Ambos se complementan: Skills proporcionan el marco de conocimiento, Agents ejecutan tareas específicas.
:::

---

## 1. coding-standards (Estándares de Código)

### Principios Fundamentales

#### 1. Legibilidad Primero
- El código se lee muchas más veces de lo que se escribe
- Nombres claros de variables y funciones
- Código autoexplicativo优于注释
- Formato consistente

#### 2. Principio KISS (Keep It Simple, Stupid)
- Usar la solución más simple efectiva
- Evitar el sobre-diseño
- No optimizar prematuramente
- Entender > Código inteligente

#### 3. Principio DRY (Don't Repeat Yourself)
- Extraer lógica común a funciones
- Crear componentes reutilizables
- Compartir funciones utilitarias entre módulos
- Evitar programación de copiar y pegar

#### 4. Principio YAGNI (You Aren't Gonna Need It)
- No construir funcionalidad antes de necesitarla
- Evitar generalizaciones especulativas
- Agregar complejidad solo cuando sea necesario
- Empezar simple, refactorizar cuando sea necesario

### Patrón Inmutable (CRÍTICO)

::: warning Regla Clave

¡Siempre crea nuevos objetos, nunca modifiques los existentes! Esta es una de las reglas más importantes para la calidad del código.
:::

**❌ Práctica Incorrecta**: Modificar objetos directamente

```javascript
function updateUser(user, name) {
  user.name = name  // ¡MUTACIÓN!
  return user
}
```

**✅ Práctica Correcta**: Crear nuevos objetos

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Mejores Prácticas de TypeScript/JavaScript

#### Nombres de Variables

```typescript
// ✅ BIEN: Nombres descriptivos
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ MAL: Nombres poco claros
const q = 'election'
const flag = true
const x = 1000
```

#### Nombres de Funciones

```typescript
// ✅ BIEN: Patrón verbo-sustantivo
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ MAL: Nombres poco claros o solo sustantivos
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### Manejo de Errores

```typescript
// ✅ BIEN: Manejo completo de errores
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

// ❌ MAL: Sin manejo de errores
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### Ejecución en Paralelo

```typescript
// ✅ BIEN: Ejecutar en paralelo cuando sea posible
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ MAL: Ejecución secuencial innecesaria
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### Mejores Prácticas de React

#### Estructura de Componentes

```typescript
// ✅ BIEN: Componente funcional con tipos
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

// ❌ MAL: Sin tipos, estructura poco clara
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### Custom Hooks

```typescript
// ✅ BIEN: Hook reutilizable
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

// Uso
const debouncedQuery = useDebounce(searchQuery, 500)
```

#### Actualizaciones de Estado

```typescript
// ✅ BIEN: Actualización funcional del estado
const [count, setCount] = useState(0)

// Actualización basada en el estado anterior
setCount(prev => prev + 1)

// ❌ MAL: Referencia directa al estado
setCount(count + 1)  // Puede estar desactualizado en escenarios asíncronos
```

### Estándares de Diseño de APIs

#### Convenciones REST API

```
GET    /api/markets              # Listar todos los mercados
GET    /api/markets/:id          # Obtener un mercado específico
POST   /api/markets              # Crear un nuevo mercado
PUT    /api/markets/:id          # Actualizar mercado (completo)
PATCH  /api/markets/:id          # Actualizar mercado (parcial)
DELETE /api/markets/:id          # Eliminar mercado

# Parámetros de consulta para filtrado
GET /api/markets?status=active&limit=10&offset=0
```

#### Formato de Respuesta

```typescript
// ✅ BIEN: Estructura de respuesta consistente
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

// Respuesta exitosa
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// Respuesta de error
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### Validación de Entrada

```typescript
import { z } from 'zod'

// ✅ BIEN: Validación con Schema
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
    // Continuar procesando datos validados
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

### Organización de Archivos

#### Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Rutas API
│   ├── markets/           # Páginas de mercados
│   └── (auth)/           # Páginas de autenticación (route group)
├── components/            # Componentes React
│   ├── ui/               # Componentes UI genéricos
│   ├── forms/            # Componentes de formularios
│   └── layouts/          # Componentes de layout
├── hooks/                # Custom React hooks
├── lib/                  # Utilidades y configuración
│   ├── api/             # Cliente API
│   ├── utils/           # Funciones de ayuda
│   └── constants/       # Constantes
├── types/                # Tipos TypeScript
└── styles/              # Estilos globales
```

### Mejores Prácticas de Rendimiento

#### Memorización

```typescript
import { useMemo, useCallback } from 'react'

// ✅ BIEN: Memorizar cálculos costosos
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ BIEN: Memorizar callbacks
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ BIEN: Lazy loading de componentes pesados
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### Estándares de Pruebas

#### Estructura de Pruebas (Patrón AAA)

```typescript
test('calculates similarity correctly', () => {
  // Arrange (Preparar)
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act (Actuar)
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert (Afirmar)
  expect(similarity).toBe(0)
})
```

#### Nombres de Pruebas

```typescript
// ✅ BIEN: Nombres descriptivos de pruebas
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ MAL: Nombres de pruebas poco claros
test('works', () => { })
test('test search', () => { })
```

### Detección de Code Smell

#### 1. Funciones Largas

```typescript
// ❌ MAL: Función de más de 50 líneas
function processMarketData() {
  // 100 líneas de código
}

// ✅ BIEN: Dividir en funciones pequeñas
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

#### 2. Anidación Profunda

```typescript
// ❌ MAL: 5+ niveles de anidación
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // Hacer algo
        }
      }
    }
  }
}

// ✅ BIEN: Retornos tempranos
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// Hacer algo
```

#### 3. Números Mágicos

```typescript
// ❌ MAL: Números sin explicación
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ BIEN: Constantes nombradas
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---

## 2. backend-patterns (Patrones de Backend)

### Patrones de Diseño de APIs

#### Estructura RESTful API

```typescript
// ✅ URLs basadas en recursos
GET    /api/markets                 # Listar recursos
GET    /api/markets/:id             # Obtener recurso individual
POST   /api/markets                 # Crear recurso
PUT    /api/markets/:id             # Reemplazar recurso
PATCH  /api/markets/:id             # Actualizar recurso
DELETE /api/markets/:id             # Eliminar recurso

// ✅ Parámetros de consulta para filtrado, ordenamiento, paginación
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### Patrón Repository

```typescript
// Abstraer lógica de acceso a datos
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

  // Otros métodos...
}
```

#### Patrón de Capa de Servicio

```typescript
// Separar lógica de negocio de acceso a datos
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // Lógica de negocio
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // Obtener datos completos
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // Ordenar por similitud
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // Implementación de búsqueda vectorial
  }
}
```

#### Patrón de Middleware

```typescript
// Pipeline de manejo de solicitud/respuesta
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

// Uso
export default withAuth(async (req, res) => {
  // El handler puede acceder a req.user
})
```

### Patrones de Base de Datos

#### Optimización de Consultas

```typescript
// ✅ BIEN: Seleccionar solo las columnas necesarias
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ MAL: Seleccionar todo
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### Prevención de Consultas N+1

```typescript
// ❌ MAL: Problema de consultas N+1
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N consultas
}

// ✅ BIEN: Obtención en lote
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 consulta
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### Patrón de Transacción

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Usar transacción de Supabase
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// Función SQL en Supabase
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- La transacción comienza automáticamente
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- El rollback ocurre automáticamente
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### Estrategias de Caché

#### Capa de Caché Redis

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // Primero verificar caché
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // Cache miss - obtener de base de datos
    const market = await this.baseRepo.findById(id)

    if (market) {
      // Caché por 5 minutos
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### Patrones de Manejo de Errores

#### Manejador de Errores Centralizado

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

  // Registrar errores inesperados
  console.error('Unexpected error:', error)

  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 })
}

// Uso
export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return errorHandler(error, request)
  }
}
```

#### Reintento con Backoff Exponencial

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
        // Backoff exponencial: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Uso
const data = await fetchWithRetry(() => fetchFromAPI())
```

### Autenticación y Autorización

#### Verificación de Tokens JWT

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

// Uso en rutas API
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

#### Control de Acceso Basado en Roles

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

// Uso
export const DELETE = requirePermission('delete')(async (request: Request) => {
  // Handler con verificación de permisos
})
```

### Rate Limiting

#### Rate Limiter Simple en Memoria

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

    // Eliminar solicitudes antiguas fuera de la ventana
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // Rate limit excedido
    }

    // Agregar solicitud actual
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 solicitudes/minuto

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // Continuar procesando solicitud
}
```

### Tareas en Segundo Plano y Colas

#### Patrón de Cola Simple

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
    // Lógica de ejecución del job
  }
}

// Para indexación de mercados
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // Agregar a la cola en lugar de bloquear
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### Logging y Monitoreo

#### Logging Estructurado

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

// Uso
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

## 3. frontend-patterns (Patrones de Frontend)

### Patrones de Componentes

#### Composición sobre Herencia

```typescript
// ✅ BIEN: Composición de componentes
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

// Uso
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

#### Componentes Compuestos

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

// Uso
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

#### Patrón Render Props

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

// Uso
<DataLoader<Market[]> url="/api/markets">
  {(markets, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <Error error={error} />
    return <MarketList markets={markets!} />
  }}
</DataLoader>
```

### Patrones de Custom Hooks

#### Hook de Gestión de Estado

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// Uso
const [isOpen, toggleOpen] = useToggle()
```

#### Hook de Fetching de Datos Asíncrono

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

// Uso
const { data: markets, loading, error, refetch } = useQuery(
  'markets',
  () => fetch('/api/markets').then(r => r.json()),
  {
    onSuccess: data => console.log('Fetched', data.length, 'markets'),
    onError: err => console.error('Failed:', err)
  }
)
```

#### Hook de Debounce

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

// Uso
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

### Patrones de Gestión de Estado

#### Patrón Context + Reducer

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

### Optimización de Rendimiento

#### Memorización

```typescript
// ✅ useMemo para cálculos costosos
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallback para funciones pasadas a componentes hijos
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// ✅ React.memo para componentes puros
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

#### Code Splitting y Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ Lazy loading de componentes pesados
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

#### Virtualización de Listas Largas

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // Altura de fila estimada
    overscan: 5  // Elementos adicionales a renderizar
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

### Patrones de Manejo de Formularios

#### Formularios Controlados con Validación

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
      // Manejo de éxito
    } catch (error) {
      // Manejo de error
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

      {/* Otros campos */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

### Patrones de Error Boundary

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

// Uso
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Patrones de Animación

#### Animaciones con Framer Motion

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ Animaciones de lista
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

// ✅ Animaciones de modal
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

### Patrones de Accesibilidad

#### Navegación por Teclado

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
      {/* Implementación del dropdown */}
    </div>
  )
}
```

#### Gestión de Foco

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Guardar elemento de foco actual
      previousFocusRef.current = document.activeElement as HTMLElement

      // Mover foco al modal
      modalRef.current?.focus()
    } else {
      // Restaurar foco al cerrar
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

## 4. tdd-workflow (Flujo TDD)

### Cuándo Activar

- Escribir nuevas funcionalidades o características
- Corregir bugs o problemas
- Refactorizar código existente
- Agregar endpoints de API
- Crear nuevos componentes

### Principios Fundamentales

#### 1. Escribir Pruebas Primero
Siempre escribir la prueba primero, luego el código para hacer que la prueba pase.

#### 2. Requisitos de Cobertura
- Mínimo 80% de cobertura (unitario + integración + E2E)
- Cubrir todos los casos edge
- Probar escenarios de error
- Verificar condiciones límite

#### 3. Tipos de Pruebas

##### Pruebas Unitarias
- Funciones independientes y utilitarias
- Lógica de componentes
- Funciones puras
- Funciones helper y utilitarias

##### Pruebas de Integración
- Endpoints de API
- Operaciones de base de datos
- Interacciones de servicios
- Llamadas a APIs externas

##### Pruebas E2E (Playwright)
- Flujos críticos de usuario
- Flujos de trabajo completos
- Automatización de navegador
- Interacciones de UI

### Pasos del Flujo TDD

#### Paso 1: Escribir Historia de Usuario

```
Como [rol], quiero [acción], para [beneficio]

Ejemplo:
Como usuario, quiero buscar mercados semánticamente,
para encontrar mercados relacionados incluso sin palabras clave exactas.
```

#### Paso 2: Generar Casos de Prueba

Crear casos de prueba exhaustivos para cada historia de usuario:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // Test de implementación
  })

  it('handles empty query gracefully', async () => {
    // Test de caso edge
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // Test de comportamiento de fallback
  })

  it('sorts results by similarity score', async () => {
    // Test de lógica de ordenamiento
  })
})
```

#### Paso 3: Ejecutar Pruebas (Deben Fallar)

```bash
npm test
# Las pruebas deben fallar - aún no hemos implementado
```

#### Paso 4: Implementar Código

Escribir el código mínimo para que las pruebas pasen:

```typescript
// Implementación guiada por pruebas
export async function searchMarkets(query: string) {
  // Implementar aquí
}
```

#### Paso 5: Ejecutar Pruebas de Nuevo

```bash
npm test
# Las pruebas ahora deben pasar
```

#### Paso 6: Refactorizar

Mejorar la calidad del código mientras las pruebas se mantienen verdes:
- Eliminar código duplicado
- Mejorar nombres
- Optimizar rendimiento
- Aumentar legibilidad

#### Paso 7: Verificar Cobertura

```bash
npm run test:coverage
# Verificar alcanzar 80%+ de cobertura
```

### Patrones de Pruebas

#### Patrón de Pruebas Unitarias (Jest/Vitest)

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

#### Patrón de Pruebas de Integración de API

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
    // Simular fallo de base de datos
    const request = new NextRequest('http://localhost/api/markets')
    // Test de manejo de errores
  })
})
```

#### Patrón de Pruebas E2E (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // Navegar a la página de mercados
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // Verificar que la página cargó
  await expect(page.locator('h1')).toContainText('Markets')

  // Buscar mercados
  await page.fill('input[placeholder="Search markets"]', 'election')

  // Esperar debounce y resultados
  await page.waitForTimeout(600)

  // Verificar que se muestran resultados de búsqueda
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // Verificar que los resultados contienen el término de búsqueda
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // Filtrar por estado
  await page.click('button:has-text("Active")')

  // Verificar resultados filtrados
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // Primero iniciar sesión
  await page.goto('/creator-dashboard')

  // Llenar formulario de creación de mercado
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // Enviar formulario
  await page.click('button[type="submit"]')

  // Verificar mensaje de éxito
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // Verificar redirección a página del mercado
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### Organización de Archivos de Pruebas

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # Pruebas unitarias
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # Pruebas de integración
└── e2e/
    ├── markets.spec.ts               # Pruebas E2E
    ├── trading.spec.ts
    └── auth.spec.ts
```

### Simulación de Servicios Externos

#### Simulación de Supabase

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

#### Simulación de Redis

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### Simulación de OpenAI

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // Simular embedding de 1536 dimensiones
  ))
}))
```

### Verificación de Cobertura de Pruebas

#### Ejecutar Reporte de Cobertura

```bash
npm run test:coverage
```

#### Umbrales de Cobertura

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

### Errores Comunes en Pruebas

#### ❌ Error: Probar Detalles de Implementación

```typescript
// No probar estado interno
expect(component.state.count).toBe(5)
```

#### ✅ Correcto: Probar Comportamiento Visible para Usuario

```typescript
// Probar lo que el usuario ve
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ Error: Selectores Frágiles

```typescript
//容易断裂
await page.click('.css-class-xyz')
```

#### ✅ Correcto: Selectores Semánticos

```typescript
// Resistente a cambios
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ Error: Sin Aislamiento de Pruebas

```typescript
// Pruebas相互依赖
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* Depende de la prueba anterior */ })
```

#### ✅ Correcto: Pruebas Independientes

```typescript
// Cada prueba configura sus propios datos
test('creates user', () => {
  const user = createTestUser()
  // Lógica de prueba
})

test('updates user', () => {
  const user = createTestUser()
  // Lógica de actualización
})
```

### Pruebas Continuas

#### Modo Watch Durante Desarrollo

```bash
npm test -- --watch
# Pruebas se ejecutan automáticamente al cambiar archivos
```

#### Hooks Pre-commit

```bash
# Ejecutar antes de cada commit
npm test && npm run lint
```

#### Integración CI/CD

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Mejores Prácticas

1. **Escribir pruebas primero** - Siempre TDD
2. **Una aserción por prueba** - Enfocarse en un solo comportamiento
3. **Nombres descriptivos de pruebas** - Explicar qué prueba
4. **Arrange-Act-Assert** - Estructura clara de pruebas
5. **Simular dependencias externas** - Aislar pruebas unitarias
6. **Probar casos edge** - Null, undefined, vacío, valores grandes
7. **Probar rutas de error** - No solo el happy path
8. **Mantener pruebas rápidas** - Pruebas unitarias < 50ms
9. **Limpieza después de pruebas** - Sin efectos secundarios
10. **Revisar reportes de cobertura** - Identificar brechas

### Métricas de Éxito

- 80%+ de cobertura de código lograda
- Todas las pruebas pasando (verde)
- Sin pruebas saltadas o deshabilitadas
- Ejecución rápida de pruebas (unitarias < 30s)
- Pruebas E2E cubren flujos críticos de usuario
- Pruebas capturan bugs antes de producción

::: tip Recordar

Las pruebas no son opcionales. Son la red de seguridad que permite refactorización confiante, desarrollo rápido y confiabilidad en producción.
:::

---

## 5. security-review (Revisión de Seguridad)

### Cuándo Activar

- Implementar autenticación o autorización
- Manejar entrada de usuario o cargas de archivos
- Crear nuevos endpoints de API
- Manejar claves o credenciales
- Implementar funcionalidades de pago
- Almacenar o transmitir datos sensibles
- Integrar APIs de terceros

### Lista de Verificación de Seguridad

#### 1. Gestión de Claves

##### ❌ Nunca hacer esto

```typescript
const apiKey = "sk-proj-xxxxx"  // Clave hardcodeada
const dbPassword = "password123" // En código fuente
```

##### ✅ Siempre hacer esto

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// Verificar que la clave existe
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### Pasos de Verificación
- [ ] Sin API keys, tokens o passwords hardcodeados
- [ ] Todas las claves en variables de entorno
- [ ] `.env.local` en .gitignore
- [ ] Sin claves en historial de Git
- [ ] Claves de producción en plataforma托管 (Vercel, Railway)

#### 2. Validación de Entrada

##### Siempre validar entrada de usuario

```typescript
import { z } from 'zod'

// Definir esquema de validación
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// Validar antes de procesar
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

##### Validación de Carga de Archivos

```typescript
function validateFileUpload(file: File) {
  // Verificación de tamaño (5MB máximo)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // Verificación de tipo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Verificación de extensión
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### Pasos de Verificación
- [ ] Toda entrada de usuario validada con esquemas
- [ ] Cargas de archivos limitadas (tamaño, tipo, extensión)
- [ ] Entrada de usuario no usada directamente en consultas
- [ ] Validación whitelist (no blacklist)
- [ ] Mensajes de error no revelan información sensible

#### 3. Prevención de Inyección SQL

##### ❌ Nunca concatenar SQL

```typescript
// Peligroso - Vulnerabilidad a inyección SQL
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ Siempre usar consultas parametrizadas

```typescript
// Seguro - Consultas parametrizadas
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// O usar SQL nativo
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

##### Pasos de Verificación
- [ ] Todas las consultas de base de datos usan consultas parametrizadas
- [ ] Sin concatenación de strings en SQL
- [ ] Uso correcto de ORM/constructor de consultas
- [ ] Consultas de Supabase correctamente saneadas

#### 4. Autenticación y Autorización

##### Manejo de Tokens JWT

```typescript
// ❌ Error: localStorage (Vulnerable a XSS)
localStorage.setItem('token', token)

// ✅ Correcto: Cookies httpOnly
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### Verificaciones de Autorización

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // Siempre verificar autorización primero
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // Continuar con eliminación
  await db.users.delete({ where: { id: userId } })
}
```

##### Seguridad a Nivel de Fila (Supabase)

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Usuarios solo pueden ver sus propios datos
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Usuarios solo pueden actualizar sus propios datos
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### Pasos de Verificación
- [ ] Tokens almacenados en cookies httpOnly (no localStorage)
- [ ] Verificaciones de autorización antes de operaciones sensibles
- [ ] Seguridad a nivel de fila habilitada en Supabase
- [ ] Control de acceso basado en roles implementado
- [ ] Gestión segura de sesiones

#### 5. Prevención de XSS

##### Saneamiento de HTML

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Siempre sane HTML proporcionado por usuario
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

##### Política de Seguridad de Contenido

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

##### Pasos de Verificación
- [ ] Saneamiento de HTML proporcionado por usuario
- [ ] Headers CSP configurados
- [ ] Sin renderizado de contenido dinámico sin verificar
- [ ] Usar protección XSS incorporada de React

#### 6. Protección CSRF

##### Tokens CSRF

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

  // Procesar solicitud
}
```

##### Cookies SameSite

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### Pasos de Verificación
- [ ] Tokens CSRF en operaciones que cambian estado
- [ ] Todas las cookies con SameSite=Strict
- [ ] Implementado patrón de doble envío de cookie

#### 7. Rate Limiting

##### Rate Limiting de API

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 solicitudes por ventana
  message: 'Too many requests'
})

// Aplicar a rutas
app.use('/api/', limiter)
```

##### Operaciones Costosas

```typescript
// Rate limiting agresivo para búsquedas
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 solicitudes por minuto
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### Pasos de Verificación
- [ ] Rate limiting en todos los endpoints de API
- [ ] Límites más estrictos en operaciones costosas
- [ ] Rate limiting basado en IP
- [ ] Rate limiting basado en usuario (autenticado)

#### 8. Exposición de Datos Sensibles

##### Logging

```typescript
// ❌ Error: Registrar datos sensibles
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ Correcto: Editar datos sensibles
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### Mensajes de Error

```typescript
// ❌ Error: Exponer detalles internos
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ Correcto: Mensajes de error genéricos
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### Pasos de Verificación
- [ ] Sin passwords, tokens o claves en logs
- [ ] Mensajes de error genéricos para usuarios
- [ ] Errores detallados en logs del servidor
- [ ] Sin stack traces para usuarios

#### 9. Seguridad Blockchain (Solana)

##### Verificación de Wallet

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

##### Verificación de Transacción

```typescript
async function verifyTransaction(transaction: Transaction) {
  // Verificar receptor
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // Verificar monto
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // Verificar que usuario tiene saldo suficiente
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### Pasos de Verificación
- [ ] Verificación de firma de wallet
- [ ] Verificación de detalles de transacción
- [ ] Verificación de saldo antes de transacción
- [ ] Sin firma de transacciones a ciegas

#### 10. Seguridad de Dependencias

##### Actualizaciones Regulares

```bash
# Verificar vulnerabilidades
npm audit

# Auto-reparar problemas reparables
npm audit fix

# Actualizar dependencias
npm update

# Verificar paquetes obsoletos
npm outdated
```

##### Archivos de Bloqueo

```bash
# Siempre commitear archivos de bloqueo
git add package-lock.json

# Usar en CI/CD para builds reproducibles
npm ci  # En lugar de npm install
```

##### Pasos de Verificación
- [ ] Dependencias actualizadas
- [ ] Sin vulnerabilidades conocidas (npm audit clean)
- [ ] Archivos de bloqueo commitados
- [ ] Dependabot habilitado en GitHub
- [ ] Actualizaciones de seguridad regulares

### Pruebas de Seguridad

#### Pruebas de Seguridad Automatizadas

```typescript
// Probar autenticación
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// Probar autorización
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// Probar validación de entrada
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// Probar rate limiting
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### Lista de Verificación de Seguridad Pre-Despliegue

Antes de cualquier despliegue a producción:

- [ ] **Claves**: Sin claves hardcodeadas, todas en variables de entorno
- [ ] **Validación de entrada**: Toda entrada de usuario validada
- [ ] **Inyección SQL**: Todas las consultas parametrizadas
- [ ] **XSS**: Contenido de usuario saneado
- [ ] **CSRF**: Protección habilitada
- [ ] **Autenticación**: Manejo correcto de tokens
- [ ] **Autorización**: Verificaciones de rol en su lugar
- [ ] **Rate limiting**: Habilitado en todos los endpoints
- [ ] **HTTPS**: Forzado en producción
- [ ] **Headers de seguridad**: CSP, X-Frame-Options configurados
- [ ] **Manejo de errores**: Sin datos sensibles en errores
- [ ] **Logging**: Sin datos sensibles en logs
- [ ] **Dependencias**: Actualizadas, sin vulnerabilidades
- [ ] **Seguridad a nivel de fila**: Habilitado en Supabase
- [ ] **CORS**: Configurado correctamente
- [ ] **Cargas de archivos**: Validadas (tamaño, tipo)
- [ ] **Firmas de wallet**: Verificadas (si es blockchain)

::: tip Recordar

La seguridad no es opcional. Una vulnerabilidad puede comprometer toda la plataforma. En caso de duda, elegir el lado de la precaución.
:::

---

## 6. continuous-learning (Aprendizaje Continuo)

### Cómo Funciona

Este skill se ejecuta como **hook Stop** al final de cada sesión:

1. **Evaluación de sesión**: Verificar si la sesión tiene suficientes mensajes (default: 10+)
2. **Detección de patrones**: Identificar patrones extraíbles de la sesión
3. **Extracción de skills**: Guardar patrones útiles en `~/.claude/skills/learned/`

### Configuración

Editar `config.json` para personalizar:

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

### Tipos de Patrones

| Patrón | Descripción |
| --- | --- |
| `error_resolution` | Cómo resolver errores específicos |
| `user_corrections` | Patrones de correcciones de usuarios |
| `workarounds` | Soluciones a peculiaridades de frameworks/bibliotecas |
| `debugging_techniques` | Métodos efectivos de depuración |
| `project_specific` | Convenciones específicas del proyecto |

### Configuración de Hooks

Agregar a tu `~/.claude/settings.json`:

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

### Por Qué Usar Stop Hook?

- **Ligero**: Solo se ejecuta una vez al final de la sesión
- **No bloqueante**: No añade latencia a cada mensaje
- **Contexto completo**: Puede acceder al registro completo de la sesión

### Relacionado

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Sección de aprendizaje continuo
- Comando `/learn` - Extracción manual de patrones a mitad de sesión

---

## 7. strategic-compact (Compresión Estratégica)

### Por Qué Usar Compresión Estratégica?

La compresión automática se activa en puntos arbitrarios:
- Típicamente a mitad de tarea, perdiendo contexto importante
- Sin conciencia de límites lógicos de tareas
- Puede interrumpir operaciones complejas de múltiples pasos

Compresión estratégica en límites lógicos:
- **Después de exploración, antes de ejecución** - Comprimir contexto de investigación, preservar plan de implementación
- **Después de completar hitos** - Nuevo comienzo fresco para la siguiente fase
- **Antes de转换 de contexto principal** - Limpiar contexto de investigación antes de diferentes tareas

### Cómo Funciona

El script `suggest-compact.sh` se ejecuta en PreToolUse (Edit/Write) y:

1. **Rastrear llamadas a herramientas** - Contar llamadas a herramientas en la sesión
2. **Detección de umbral** - Sugerir en umbral configurable (default: 50 llamadas)
3. **Recordatorios periódicos** - Recordar cada 25 llamadas después del umbral

### Configuración de Hooks

Agregar a tu `~/.claude/settings.json`:

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

### Configuración

Variables de entorno:
- `COMPACT_THRESHOLD` - Llamadas a herramientas antes de primera sugerencia (default: 50)

### Mejores Prácticas

1. **Comprimir después de planificar** - Después de completar planificación, comprimir para reiniciar
2. **Comprimir después de depurar** - Limpiar contexto de resolución de errores antes de continuar
3. **No comprimir durante implementación** - Mantener contexto para cambios relacionados
4. **Leer sugerencias** - El hook te dice **cuándo**, tú decides **si**

### Relacionado

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Sección de optimización de tokens
- Memory persistence hooks - Estado persistente después de compresión

---

## 8. eval-harness (Herramienta de Evaluación)

### Filosofía

El desarrollo impulsado por evaluación ve las evaluaciones como "pruebas unitarias para desarrollo IA":
- Definir comportamiento esperado antes de implementar
- Ejecutar evaluaciones continuamente durante desarrollo
- Rastrear regresiones de cada cambio
- Medir confiabilidad con métricas pass@k

### Tipos de Evaluaciones

#### Evaluaciones de Funcionalidad

Probar cosas que Claude no podía hacer antes:
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion1
  - [ ] Criterion2
  - [ ] Criterion3
Expected Output: Description of expected result
```

#### Evaluaciones de Regresión

Asegurar que cambios no rompen funcionalidad existente:
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

### Tipos de Scorers

#### 1. Scorers Basados en Código

Usar verificaciones deterministas con código:
```bash
# Verificar que archivo contiene patrón esperado
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# Verificar que pruebas pasan
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# Verificar que build pasa
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. Scorers Basados en Modelo

Usar Claude para evaluar salidas abiertas:
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

#### 3. Scorers Humanos

Marcar para revisión humana:
```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

### Métricas

#### pass@k

"Al menos un éxito en k intentos"
- pass@1: Tasa de éxito en primer intento
- pass@3: Tasa de éxito dentro de 3 intentos
- Objetivo típico: pass@3 > 90%

#### pass^k

"Todos los k intentos exitosos"
- Umbral de confiabilidad más alto
- pass^3: 3 éxitos consecutivos
- Usado para paths críticos

### Flujo de Evaluación

#### 1. Definir (Antes de Codificar)

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

#### 2. Implementar

Escribir código para pasar las evaluaciones definidas.

#### 3. Evaluar

```bash
# Ejecutar evaluaciones de funcionalidad
[Run each capability eval, record PASS/FAIL]

# Ejecutar evaluaciones de regresión
npm test -- --testPathPattern="existing"

# Generar reporte
```

#### 4. Reportar

```markdown
EVAL REPORT: feature-xyz
======================

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

### Patrones de Integración

#### Antes de Implementar

```
/eval define feature-name
```
Crear archivo de definición de evaluación en `.claude/evals/feature-name.md`

#### Durante Implementación

```
/eval check feature-name
```
Ejecutar evaluación actual y reportar estado

#### Después de Implementar

```
/eval report feature-name
```
Generar reporte completo de evaluación

### Almacenamiento de Evaluaciones

Almacenar evaluaciones en el proyecto:

```
.claude/
  evals/
    feature-xyz.md      # Definición de evaluación
    feature-xyz.log     # Historial de ejecuciones de evaluación
    baseline.json       # Baseline de regresión
```

### Mejores Prácticas

1. **Definir evaluaciones antes de codificar** - Forzar pensamiento claro sobre criterios de éxito
2. **Ejecutar evaluaciones frecuentemente** - Capturar regresiones temprano
3. **Rastrear pass@k con el tiempo** - Monitorear tendencias de confiabilidad
4. **Usar scorers de código cuando sea posible** - Determinista > Probabilístico
5. **Revisión humana segura** - Nunca automatizar completamente verificaciones de seguridad
6. **Mantener evaluaciones rápidas** - Evaluaciones lentas no se ejecutarán
7. **Versionar evaluaciones con código** - Evaluaciones son artefactos de primera clase

### Ejemplo: Agregar Autenticación

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

## 9. verification-loop (Loop de Verificación)

### Cuándo Usar

Llamar a este skill cuando:
- Terminar una funcionalidad o cambio de código importante
- Antes de crear un PR
- Cuando quieras asegurar que los checks de calidad pasan
- Después de refactorización

### Fases de Verificación

#### Fase 1: Verificación de Build

```bash
# Verificar que el proyecto construye
npm run build 2>&1 | tail -20
# o
pnpm build 2>&1 | tail -20
```

Si el build falla, detener y corregir antes de continuar.

#### Fase 2: Verificación de Tipos

```bash
# Proyectos TypeScript
npx tsc --noEmit 2>&1 | head -30

# Proyectos Python
pyright . 2>&1 | head -30
```

Reportar todos los errores de tipo. Corregir errores críticos antes de continuar.

#### Fase 3: Verificación de Lint

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### Fase 4: Suite de Pruebas

```bash
# Ejecutar pruebas con cobertura
npm run test -- --coverage 2>&1 | tail -50

# Verificar umbral de cobertura
# Objetivo: Mínimo 80%
```

Reportar:
- Total de pruebas: X
- Pasaron: X
- Fallaron: X
- Cobertura: X%

#### Fase 5: Escaneo de Seguridad

```bash
# Verificar claves
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Verificar console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### Fase 6: Revisión de Diff

```bash
# Mostrar qué cambió
git diff --stat
git diff HEAD~1 --name-only
```

Revisar cada archivo cambiado por:
- Cambios inesperados
- Falta manejo de errores
- Potenciales casos edge

### Formato de Salida

Después de ejecutar todas las fases, generar reporte de verificación:

```
VERIFICATION REPORT
================

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

### Patrón Continuo

Para sesiones largas, ejecutar verificación cada 15 minutos o después de cambios importantes:

```markdown
Establecer un checkpoint mental:
- Después de completar cada función
- Después de completar cada componente
- Antes de pasar a la siguiente tarea

Ejecutar: /verify
```

### Integración con Hooks

Este skill complementa los hooks PostToolUse, pero proporciona verificación más profunda. Los hooks capturan problemas inmediatamente; este skill proporciona revisión exhaustiva.

---

## 10. project-guidelines-example (Ejemplo de Guías de Proyecto)

Este es un ejemplo de skill específico de proyecto. Úsalo como plantilla para tus propios proyectos.

Basado en una aplicación de producción real: [Zenith](https://zenith.chat) - Plataforma de descubrimiento de clientes impulsada por IA.

### Cuándo Usar

Consultar este skill cuando trabajes en el proyecto específico para el que está diseñado. Los skills de proyecto incluyen:
- Visión general de arquitectura
- Estructura de archivos
- Patrones de código
- Requisitos de pruebas
- Flujo de despliegue

---

## 11. clickhouse-io (ClickHouse I/O)

### Visión General

ClickHouse es un sistema de gestión de bases de datos orientado a columnas para procesamiento analítico en línea (OLAP). Está optimizado para consultas analíticas rápidas en grandes conjuntos de datos.

**Características Clave:**
- Almacenamiento orientado a columnas
- Compresión de datos
- Ejecución de consultas en paralelo
- Consultas distribuidas
- Análisis en tiempo real

### Patrones de Diseño de Tablas

#### Motor MergeTree (Más Común)

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

#### ReplacingMergeTree (Deduplicación)

```sql
-- Para datos que pueden tener duplicados (ej. de múltiples fuentes)
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

#### AggregatingMergeTree (Pre-agregación)

```sql
-- Para mantener métricas agregadas
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- Consultar datos agregados
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

### Patrones de Optimización de Consultas

#### Filtrado Eficiente

```sql
-- ✅ BIEN: Primero usar columnas indexadas
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ MAL: Primero filtrar columnas no indexadas
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### Agregación

```sql
-- ✅ BIEN: Usar funciones de agregación específicas de ClickHouse
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

-- ✅ Usar quantile como percentil (más eficiente que percentile)
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### Patrones de Inserción de Datos

#### Inserción en Lotes (Recomendado)

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

// ✅ Inserción en lote (eficiente)
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

// ❌ Inserción individual (lenta)
async function insertTrade(trade: Trade) {
  // ¡No hacer esto en un bucle!
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### Inserción por Streaming

```typescript
// Para importación continua de datos
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

### Vistas Materializadas

#### Agregación en Tiempo Real

```sql
-- Crear vista materializada para estadísticas por hora
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

-- Consultar vista materializada
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

### Monitoreo de Rendimiento

#### Rendimiento de Consultas

```sql
-- Ver consultas lentas
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

#### Estadísticas de Tablas

```sql
-- Ver tamaño de tablas
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

### Consultas Analíticas Comunes

#### Análisis de Series Temporales

```sql
-- Usuarios activos diarios
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- Análisis de retención
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

#### Análisis de Embudo

```sql
-- Embudo de conversión
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

#### Análisis de Cohortes

```sql
-- Cohortes de usuarios por mes de registro
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

### Patrones de Pipeline de Datos

#### Patrón ETL

```typescript
// Extraer, transformar, cargar
async function etlPipeline() {
  // 1. Extraer de fuente
  const rawData = await extractFromPostgres()

  // 2. Transformar
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. Cargar a ClickHouse
  await bulkInsertToClickHouse(transformed)
}

// Ejecutar periódicamente
setInterval(etlPipeline, 60 * 60 * 1000)  // Cada hora
```

#### Captura de Datos Cambiados (CDC)

```typescript
// Escuchar cambios de PostgreSQL y sincronizar a ClickHouse
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

### Mejores Prácticas

#### 1. Estrategia de Particionamiento
- Particionar por tiempo (típicamente mes o día)
- Evitar demasiadas particiones (impacto en rendimiento)
- Usar tipo DATE como clave de partición

#### 2. Claves de Ordenamiento
- Colocar primero las columnas filtradas más frecuentemente
- Considerar cardinalidad (alta cardinalidad primero)
- El ordenamiento afecta la compresión

#### 3. Tipos de Datos
- Usar el tipo mínimo apropiado (UInt32 vs UInt64)
- Usar LowCardinality para strings repetidos
- Usar Enum para datos categóricos

#### 4. Evitar
- SELECT * (especificar columnas)
- FINAL (fusionar datos antes de consultar)
- Demasiados JOINs (desnormalizar durante análisis)
- Inserciones pequeñas frecuentes (en su lugar, usar lotes)

#### 5. Monitoreo
- Rastrear rendimiento de consultas
- Monitorear uso de disco
- Verificar operaciones de merge
- Revisar logs de consultas lentas

::: tip Recordar

ClickHouse destaca en cargas de trabajo analíticos. Diseña tablas para tus patrones de consulta, inserta en lotes y aprovecha vistas materializadas para agregación en tiempo real.
:::

---

## Siguiente Lección

> En la próxima lección aprenderás **[Referencia de Scripts API](../scripts-api/)**.
>
> Aprenderás sobre:
> - Interfaces de scripts Node.js y funciones de utilidad
> - Mecanismo de detección de gestores de paquetes
> - Detalles de implementación de scripts Hooks
> - Cómo usar套件 de pruebas

---

## Resumen de Esta Lección

Las 11 librerías de skills de Everything Claude Code proporcionan soporte integral de conocimiento para el proceso de desarrollo:

1. **coding-standards** - Estándares de código unificados, patrón inmutable, mejores prácticas
2. **backend-patterns** - Patrones de arquitectura backend, diseño de APIs, optimización de base de datos
3. **frontend-patterns** - Patrones de React/Next.js, gestión de estado, optimización de rendimiento
4. **tdd-workflow** - Flujo de desarrollo guiado por pruebas, 80%+ de cobertura
5. **security-review** - OWASP Top 10, validación de entrada, detección de vulnerabilidades
6. **continuous-learning** - Extracción automática de patrones reutilizables, preservación de conocimiento
7. **strategic-compact** - Compresión estratégica de contexto, optimización de tokens
8. **eval-harness** - Desarrollo impulsado por evaluación, pruebas de confiabilidad
9. **verification-loop** - Sistema de verificación integral, control de calidad
10. **project-guidelines-example** - Ejemplo de configuración de proyecto, plantilla de arquitectura
11. **clickhouse-io** - Patrones de análisis ClickHouse, consultas de alto rendimiento

Recuerda, estas librerías de skills son la brújula para la calidad de tu código. Aplicarlas correctamente durante el desarrollo puede mejorar significativamente la eficiencia y calidad del código.

---

## Apéndice: Referencia de Código Fuente

<details>
<summary><strong>Haz clic para ver ubicaciones de código fuente</strong></summary>

> Tiempo de actualización: 2026-01-25

| Librería de Skill | Ruta de Archivo | Línea |
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

**Principios Clave**:
- **coding-standards**: Patrón inmutable, archivos < 800 líneas, funciones < 50 líneas, 80%+ cobertura de pruebas
- **backend-patterns**: Patrón Repository, separación de capa Service, consultas parametrizadas, caché Redis
- **frontend-patterns**: Composición de componentes, custom hooks, Context + Reducer, memorización, lazy loading
- **tdd-workflow**: Pruebas primero, pruebas unitarias/integración/E2E, verificación de cobertura de pruebas
- **security-review**: Revisión OWASP Top 10, validación de entrada, prevención de inyección SQL, prevención de XSS

**Agents Relacionados**:
- **tdd-guide**: Guía de proceso TDD
- **code-reviewer**: Revisión de calidad y estilo de código
- **security-reviewer**: Detección de vulnerabilidades de seguridad
- **architect**: Diseño de arquitectura y selección de patrones

</details>
