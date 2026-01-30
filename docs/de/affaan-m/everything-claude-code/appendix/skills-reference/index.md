---
title: "Skills-Referenz: 11 Skill-Bibliotheken | Everything Claude Code"
sidebarTitle: "5-Minuten-Schnellreferenz für 11 Skills"
subtitle: "Skills-Referenz: 11 Skill-Bibliotheken"
description: "Erfahren Sie mehr über die 11 Skill-Bibliotheken von Everything Claude Code. Meistern Sie Codierungsstandards, Backend/Frontend-Muster, TDD-Workflows und Sicherheitsüberprüfungen zur Steigerung der Entwicklungseffizienz."
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

# Vollständige Skills-Referenz: Detaillierte Erklärung der 11 Skill-Bibliotheken

## Was Sie nach diesem Kurs können

- Schnelles Suchen und Verstehen des Inhalts und Zwecks aller 11 Skill-Bibliotheken
- Korrekte Anwendung von Codierungsstandards, Architekturmustern und Best Practices während der Entwicklung
- Wissen, wann Sie welche Skill zur Steigerung der Entwicklungseffizienz und Codequalität verwenden
- Beherrschung von TDD-Workflows, Sicherheitsüberprüfungen, kontinuierlichem Lernen und anderen Schlüsselkompetenzen

## Ihre aktuellen Herausforderungen

面对项目中的 11 个技能库,您 könnten:

- **Nicht alle Skills erinnern**: coding-standards, backend-patterns, security-review... Welche Skills wann verwenden?
- **Nicht wissen, wie man anwendet**: Die Skills erwähnen unveränderliche Muster, TDD-Abläufe, aber wie genau funktioniert das?
- **Nicht wissen, wen man um Hilfe bittet**: Welchen Skill bei Sicherheitsproblemen verwenden? Welchen bei der Backend-Entwicklung?
- **Verhältnis Skills zu Agents**: Was ist der Unterschied zwischen Skills und Agents? Wann verwendet man Agenten, wann Skills?

Diese Referenzdokumentation hilft Ihnen, den Inhalt, Anwendungsszenarien und Verwendungsmethoden jeder Skill umfassend zu verstehen.

---

## Skills-Übersicht

Everything Claude Code enthält 11 Skill-Bibliotheken, jede mit klaren Zielen und Anwendungsszenarien:

| Skill-Bibliothek | Ziel | Priorität | Anwendungsszenarien |
|--- | --- | --- | ---|
| **coding-standards** | Einheitliche Codierungsstandards, Best Practices | P0 | Allgemeines Codieren, TypeScript/JavaScript/React |
| **backend-patterns** | Backend-Architekturmuster, API-Design | P0 | Node.js, Express, Next.js API-Routen-Entwicklung |
| **frontend-patterns** | Frontend-Entwicklungsmuster, Performance-Optimierung | P0 | React, Next.js, Zustandsverwaltung |
| **tdd-workflow** | Testgetriebene Entwicklungs-Workflows | P0 | Neue Funktionen, Bug-Fixes, Refactoring |
| **security-review** | Sicherheitsüberprüfung und Schwachstellenerkennung | P0 | Authentifizierung/Autorisierung, Eingabevalidierung, Verarbeitung sensibler Daten |
| **continuous-learning** | Automatische Extraktion wiederverwendbarer Muster | P1 | Langfristige Projekte, Wissensakkumulation |
| **strategic-compact** | Strategische Kontextkomprimierung | P1 | Lange Sitzungen, komplexe Aufgaben |
| **eval-harness** | Evaluationsgetriebenes Entwicklungs-Framework | P1 | AI-Entwicklungsevaluierung, Zuverlässigkeitstests |
| **verification-loop** | Umfassendes Verifikationssystem | P1 | PR-Vorverifizierung, Qualitätsprüfung |
| **project-guidelines-example** | Beispiel für Projektrichtlinien | P2 | Benutzerdefinierte Projektspezifikationen |
| **clickhouse-io** | ClickHouse-Analysenmuster | P2 | Hochleistungsanalyseabfragen |

::: info Skills vs Agents

**Skills** sind Workflow-Definitionen und Wissensdatenbanken, die Muster, Best Practices und Spezifikationsrichtlinien bereitstellen.

**Agents** sind spezialisierte Unter-Agenten, die komplexe Aufgaben in spezifischen Bereichen ausführen (wie Planung, Überprüfung, Debugging).

Beide ergänzen sich gegenseitig: Skills stellen den Wissensrahmen bereit, Agents führen spezifische Aufgaben aus.
:::

---

## 1. coding-standards (Codierungsstandards)

### Kernprinzipien

#### 1. Lesbarkeit hat Vorrang
- Code wird häufiger gelesen als geschrieben
- Klare Variablen- und Funktionsbenennung
- Selbsterklärender Code ist besser als Kommentare
- Einheitliches Format

#### 2. KISS-Prinzip (Keep It Simple, Stupid)
- Verwenden Sie die einfachste wirksame Lösung
- Vermeiden Sie Over-Engineering
- Keine vorzeitige Optimierung
- Verständlichkeit > schlauber Code

#### 3. DRY-Prinzip (Don't Repeat Yourself)
- Extrahieren Sie gemeinsame Logik in Funktionen
- Erstellen Sie wiederverwendbare Komponenten
- Teilen Sie Utility-Funktionen modulübergreifend
- Vermeiden Sie Copy-Paste-Programmierung

#### 4. YAGNI-Prinzip (You Aren't Gonna Need It)
- Erstellen Sie keine Funktionen, bevor Sie sie brauchen
- Vermeiden Sie spekulative Verallgemeinerung
- Fügen Sie nur bei Bedarf Komplexität hinzu
- Beginnen Sie einfach, refaktorisieren Sie bei Bedarf

### Unveränderliches Muster (CRITICAL)

::: warning Wichtige Regel

Erstellen Sie immer neue Objekte, ändern Sie niemals vorhandene Objekte! Dies ist eines der wichtigsten Prinzipien der Codequalität.
:::

**❌ Falscher Ansatz**: Objekt direkt ändern

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ Richtiger Ansatz**: Neues Objekt erstellen

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### TypeScript/JavaScript Best Practices

#### Variablennamen

```typescript
// ✅ GUT: Beschreibende Benennung
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ SCHLECHT: Unklare Benennung
const q = 'election'
const flag = true
const x = 1000
```

#### Funktionsnamen

```typescript
// ✅ GUT: Verb-Substantiv-Muster
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ SCHLECHT: Unklar oder nur Substantive
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### Fehlerbehandlung

```typescript
// ✅ GUT: Umfassende Fehlerbehandlung
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

// ❌ SCHLECHT: Keine Fehlerbehandlung
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### Parallele Ausführung

```typescript
// ✅ GUT: Parallele Ausführung wo möglich
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ SCHLECHT: Unnötige sequenzielle Ausführung
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### React Best Practices

#### Komponentenstruktur

```typescript
// ✅ GUT: Funktionskomponente mit Typen
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

// ❌ SCHLECHT: Keine Typen, unklare Struktur
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### Benutzerdefinierte Hooks

```typescript
// ✅ GUT: Wiederverwendbarer benutzerdefinierter Hook
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

// Verwendung
const debouncedQuery = useDebounce(searchQuery, 500)
```

#### Zustandsaktualisierung

```typescript
// ✅ GUT: Funktionale Zustandsaktualisierung
const [count, setCount] = useState(0)

// Aktualisierung basierend auf vorherigem Zustand
setCount(prev => prev + 1)

// ❌ SCHLECHT: Direkter Zustandsbezug
setCount(count + 1)  // Könnte in asynchronen Szenarien veraltet sein
```

### API-Design-Standards

#### REST-API-Konventionen

```
GET    /api/markets              # Alle Märkte auflisten
GET    /api/markets/:id          # Bestimmten Markt abrufen
POST   /api/markets              # Neuen Markt erstellen
PUT    /api/markets/:id          # Markt aktualisieren (vollständig)
PATCH  /api/markets/:id          # Markt aktualisieren (teilweise)
DELETE /api/markets/:id          # Markt löschen

# Abfrageparameter für Filterung
GET /api/markets?status=active&limit=10&offset=0
```

#### Antwortformat

```typescript
// ✅ GUT: Konsistente Antwortstruktur
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

// Erfolgsantwort
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// Fehlerantwort
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### Eingabevalidierung

```typescript
import { z } from 'zod'

// ✅ GUT: Schema-Validierung
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
    // Mit validierten Daten fortfahren
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

### Dateiorganisation

#### Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API-Routen
│   ├── markets/           # Marktseiten
│   └── (auth)/           # Authentifizierungsseiten (Routing-Gruppe)
├── components/            # React-Komponenten
│   ├── ui/               # Allgemeine UI-Komponenten
│   ├── forms/            # Formularkomponenten
│   └── layouts/          # Layout-Komponenten
├── hooks/                # Benutzerdefinierte React-Hooks
├── lib/                  # Utilities und Konfiguration
│   ├── api/             # API-Clients
│   ├── utils/           # Hilfsfunktionen
│   └── constants/       # Konstanten
├── types/                # TypeScript-Typen
└── styles/              # Globale Styles
```

### Performance-Best Practices

#### Memoisierung

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GUT: Teure Berechnungen memoisieren
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GUT: Callback-Funktionen memoisieren
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ GUT: Lazy Loading für schwere Komponenten
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### Teststandards

#### Teststruktur (AAA-Muster)

```typescript
test('calculates similarity correctly', () => {
  // Arrange (Vorbereiten)
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act (Ausführen)
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert (Bestätigen)
  expect(similarity).toBe(0)
})
```

#### Testnamen

```typescript
// ✅ GUT: Beschreibende Testnamen
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ SCHLECHT: Vage Testnamen
test('works', () => { })
test('test search', () => { })
```

### Code-Geruchserkennung

#### 1. Lange Funktionen

```typescript
// ❌ SCHLECHT: Funktion über 50 Zeilen
function processMarketData() {
  // 100 Zeilen Code
}

// ✅ GUT: In kleine Funktionen aufteilen
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

#### 2. Tiefe Verschachtelung

```typescript
// ❌ SCHLECHT: 5+ Ebenen Verschachtelung
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // Etwas tun
        }
      }
    }
  }
}

// ✅ GUT: Vorzeitiges Return
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// Etwas tun
```

#### 3. Magische Zahlen

```typescript
// ❌ SCHLECHT: Unerklärte Zahlen
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GUT: Benannte Konstanten
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

---

## 2. backend-patterns (Backend-Muster)

### API-Design-Muster

#### RESTful-API-Struktur

```typescript
// ✅ Ressourcenbasierte URLs
GET    /api/markets                 # Ressourcen auflisten
GET    /api/markets/:id             # Einzelne Ressource abrufen
POST   /api/markets                 # Ressource erstellen
PUT    /api/markets/:id             # Ressource ersetzen
PATCH  /api/markets/:id             # Ressource aktualisieren
DELETE /api/markets/:id             # Ressource löschen

// ✅ Abfrageparameter für Filterung, Sortierung, Paginierung
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### Repository-Muster

```typescript
// Datenzugriffslogik abstrahieren
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

  // Andere Methoden...
}
```

#### Service-Layer-Muster

```typescript
// Geschäftslogik vom Datenzugang trennen
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // Geschäftslogik
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // Vollständige Daten abrufen
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // Nach Ähnlichkeit sortieren
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // Vektorsuche-Implementierung
  }
}
```

#### Middleware-Muster

```typescript
// Request/Response-Verarbeitungspipeline
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

// Verwendung
export default withAuth(async (req, res) => {
  // Handler hat Zugriff auf req.user
})
```

### Datenbankmuster

#### Abfrageoptimierung

```typescript
// ✅ GUT: Nur benötigte Spalten auswählen
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ SCHLECHT: Alles auswählen
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### N+1-Abfrage-Verhinderung

```typescript
// ❌ SCHLECHT: N+1-Abfrage-Problem
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N Abfragen
}

// ✅ GUT: Batch-Abfrage
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 Abfrage
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### Transaktionsmuster

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Supabase-Transaktion verwenden
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// SQL-Funktion in Supabase
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Transaktion beginnt automatisch
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback erfolgt automatisch
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### Caching-Strategien

#### Redis-Caching-Layer

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // Zuerst Cache prüfen
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // Cache-Miss - aus Datenbank abrufen
    const market = await this.baseRepo.findById(id)

    if (market) {
      // 5 Minuten cachen
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### Fehlerbehandlungsmuster

#### Zentralisierter Fehler-Handler

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

  // Unerwartete Fehler protokollieren
  console.error('Unexpected error:', error)

  return NextResponse.json({
    success: false,
    error: 'Internal server error'
  }, { status: 500 })
}

// Verwendung
export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return errorHandler(error, request)
  }
}
```

#### Exponentielles Backoff-Retry

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
        // Exponentielles Backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Verwendung
const data = await fetchWithRetry(() => fetchFromAPI())
```

### Authentifizierung und Autorisierung

#### JWT-Token-Verifizierung

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

// In API-Route verwenden
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

#### Rollenbasierte Zugriffssteuerung

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

// Verwendung
export const DELETE = requirePermission('delete')(async (request: Request) => {
  // Handler mit Berechtigungsprüfung
})
```

### Rate Limiting

#### Einfacher In-Memory-Rate-Limiter

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

    // Alte Anfragen außerhalb des Fensters entfernen
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // Rate-Limit überschritten
    }

    // Aktuelle Anfrage hinzufügen
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 Anfragen/Minute

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // Mit Anfrage fortfahren
}
```

### Hintergrundtasks und Warteschlangen

#### Einfaches Warteschlangenmuster

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
    // Aufgaben-Ausführungslogik
  }
}

// Für Markt-Indizierung
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // Zur Warteschlange hinzufügen statt zu blockieren
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### Logging und Monitoring

#### Strukturiertes Logging

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

// Verwendung
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

## 3. frontend-patterns (Frontend-Muster)

### Komponentenmuster

#### Komposition über Vererbung

```typescript
// ✅ GUT: Komponentenkomposition
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

// Verwendung
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

#### Compound Components

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

// Verwendung
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

#### Render Props-Muster

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

// Verwendung
<DataLoader<Market[]> url="/api/markets">
  {(markets, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <Error error={error} />
    return <MarketList markets={markets!} />
  }}
</DataLoader>
```

### Benutzerdefinierte Hooks-Muster

#### Zustandsverwaltungs-Hook

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// Verwendung
const [isOpen, toggleOpen] = useToggle()
```

#### Asynchroner Datenabruf-Hook

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

// Verwendung
const { data: markets, loading, error, refetch } = useQuery(
  'markets',
  () => fetch('/api/markets').then(r => r.json()),
  {
    onSuccess: data => console.log('Fetched', data.length, 'markets'),
    onError: err => console.error('Failed:', err)
  }
)
```

#### Debounce-Hook

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

// Verwendung
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

### Zustandsverwaltungsmuster

#### Context + Reducer-Muster

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

### Performance-Optimierung

#### Memoisierung

```typescript
// ✅ useMemo für teure Berechnungen
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallback für Funktionen, die an untergeordnete Komponenten übergeben werden
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// ✅ React.memo für reine Komponenten
export const MarketCard = React.memo<MarketCardProps>(({ market }) => {
  return (
    <div className="market-card">
      <h3>{market.name}</h3>
      <p>{market.description}</p>
    </div>
  )
})
```

#### Code-Splitting und Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ Lazy Loading für schwere Komponenten
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

#### Virtualisierung langer Listen

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // Geschätzte Zeilenhöhe
    overscan: 5  // Zusätzlich gerenderte Elemente
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

### Formularverarbeitungsmuster

#### Kontrolliertes Formular mit Validierung

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
      // Erfolgshandling
    } catch (error) {
      // Fehlerbehandlung
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

      {/* Andere Felder */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

### Fehlergrenze-Muster

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

// Verwendung
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Animationsmuster

#### Framer Motion Animationen

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ Listenanimationen
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

// ✅ Modal-Animationen
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

### Barrierefreiheitsmuster

#### Tastaturnavigation

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
      {/* Dropdown-Implementierung */}
    </div>
  )
}
```

#### Fokus-Management

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Aktuelles Fokus-Element speichern
      previousFocusRef.current = document.activeElement as HTMLElement

      // Fokus zum Modal bewegen
      modalRef.current?.focus()
    } else {
      // Fokus beim Schließen wiederherstellen
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

## 4. tdd-workflow (TDD-Workflow)

### Wann aktivieren

- Neue Funktionen oder Features schreiben
- Bugs oder Probleme beheben
- Bestehenden Code refaktorieren
- API-Endpunkte hinzufügen
- Neue Komponenten erstellen

### Kernprinzipien

#### 1. Test zuerst
Schreiben Sie immer zuerst Tests, dann Code, damit die Tests bestanden werden.

#### 2. Abdeckungsanforderungen
- Mindestens 80% Abdeckung (Unit + Integration + E2E)
- Alle Randfälle abdecken
- Fehlerszenarien testen
- Grenzwerte validieren

#### 3. Testtypen

##### Unit-Tests
- Unabhängige Funktionen und Utility-Funktionen
- Komponentenlogik
- Reine Funktionen
- Hilfsfunktionen und Utilities

##### Integrationstests
- API-Endpunkte
- Datenbankoperationen
- Dienstinteraktionen
- Externe API-Aufrufe

##### E2E-Tests (Playwright)
- Wichtige Benutzerabläufe
- Vollständige Workflows
- Browser-Automatisierung
- UI-Interaktionen

### TDD-Workflow-Schritte

#### Schritt 1: Benutzerreise schreiben

```
Als [Rolle] möchte ich [Aktion], damit [Vorteil]

Beispiel:
Als Benutzer möchte ich Märkte semantisch durchsuchen,
damit ich auch ohne genaue Schlüsselwörter relevante Märkte finde.
```

#### Schritt 2: Testfälle generieren

Erstellen Sie umfassende Testfälle für jede Benutzerreise:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // Test-Implementierung
  })

  it('handles empty query gracefully', async () => {
    // Randfall testen
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // Fallback-Verhalten testen
  })

  it('sorts results by similarity score', async () => {
    // Sortierlogik testen
  })
})
```

#### Schritt 3: Tests ausführen (sollten fehlschlagen)

```bash
npm test
# Tests sollten fehlschlagen - wir haben noch nicht implementiert
```

#### Schritt 4: Code implementieren

Schreiben Sie minimalen Code, damit die Tests bestanden werden:

```typescript
// Durch Tests gesteuerte Implementierung
export async function searchMarkets(query: string) {
  // Implementierung hier
}
```

#### Schritt 5: Tests erneut ausführen

```bash
npm test
# Tests sollten jetzt bestehen
```

#### Schritt 6: Refactoring

Codequalität verbessern, während Tests grün bleiben:
- Duplizierten Code entfernen
- Benennung verbessern
- Performance optimieren
- Lesbarkeit erhöhen

#### Schritt 7: Abdeckung validieren

```bash
npm run test:coverage
# Validieren, dass 80%+ Abdeckung erreicht ist
```

### Testmuster

#### Unit-Test-Muster (Jest/Vitest)

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

#### API-Integrationstest-Muster

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
    // Datenbankausfall simulieren
    const request = new NextRequest('http://localhost/api/markets')
    // Fehlerbehandlung testen
  })
})
```

#### E2E-Test-Muster (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // Zu Marktseite navigieren
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // Validieren, dass Seite geladen ist
  await expect(page.locator('h1')).toContainText('Markets')

  // Märkte suchen
  await page.fill('input[placeholder="Search markets"]', 'election')

  // Auf Debounce und Ergebnisse warten
  await page.waitForTimeout(600)

  // Validieren, dass Suchergebnisse angezeigt werden
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // Validieren, dass Ergebnisse Suchbegriff enthalten
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // Nach Status filtern
  await page.click('button:has-text("Active")')

  // Gefilterte Ergebnisse validieren
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // Zuerst einloggen
  await page.goto('/creator-dashboard')

  // Markterstellungsformular ausfüllen
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // Formular absenden
  await page.click('button[type="submit"]')

  // Erfolgsnachricht validieren
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // Umleitung zur Marktseite validieren
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### Testdateiorganisation

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # Unit-Tests
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # Integrationstests
└── e2e/
    ├── markets.spec.ts               # E2E-Tests
    ├── trading.spec.ts
    └── auth.spec.ts
```

### Externe Services mocken

#### Supabase-Mock

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

#### Redis-Mock

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### OpenAI-Mock

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // Mock für 1536-dimensionales Embedding
  ))
}))
```

### Testabdeckungsvalidierung

#### Abdeckungsbericht ausführen

```bash
npm run test:coverage
```

#### Abdeckungsschwellenwerte

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

### Häufige Testfehler

#### ❌ Fehler: Implementierungsdetails testen

```typescript
// Internen Zustand nicht testen
expect(component.state.count).toBe(5)
```

#### ✅ Richtig: Benutzer Sichtbares Verhalten testen

```typescript
// Was der Benutzer sieht
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ Fehler: Selektoren anfällig für Änderungen

```typescript
// Brechen leicht
await page.click('.css-class-xyz')
```

#### ✅ Richtig: Semantische Selektoren

```typescript
 resilient gegenüber Änderungen
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ Fehler: Keine Testisolierung

```typescript
// Tests voneinander abhängig
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* hängt vom vorherigen Test ab */ })
```

#### ✅ Richtig: Unabhängige Tests

```typescript
// Jeder Test setzt seine eigenen Daten
test('creates user', () => {
  const user = createTestUser()
  // Testlogik
})

test('updates user', () => {
  const user = createTestUser()
  // Aktualisierungslogik
})
```

### Kontinuierliches Testen

#### Watch-Modus während der Entwicklung

```bash
npm test -- --watch
# Tests laufen automatisch bei Dateiänderungen
```

#### Pre-Commit-Hooks

```bash
# Vor jedem Commit ausführen
npm test && npm run lint
```

#### CI/CD-Integration

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Best Practices

1. **Zuerst Tests schreiben** - Immer TDD
2. **Ein Assertion pro Test** - Fokus auf ein Verhalten
3. **Beschreibende Testnamen** - Erklären, was getestet wird
4. **Arrange-Act-Assert** - Klare Teststruktur
5. **Externe Abhängigkeiten mocken** - Unit-Tests isolieren
6. **Randfälle testen** - Null, undefined, leer, große Werte
7. **Fehlerpfade testen** - Nicht nur Happy Path
8. **Tests schnell halten** - Unit-Tests < 50ms
9. **Nach Tests aufräumen** - Keine Nebenwirkungen
10. **Abdeckungsberichte prüfen** - Lücken identifizieren

### Erfolgskriterien

- 80%+ Codeabdeckung erreicht
- Alle Tests bestehen (grün)
- Keine übersprungenen oder deaktivierten Tests
- Schnelle Testausführung (Unit-Tests < 30s)
- E2E-Tests decken wichtige Benutzerabläufe ab
- Tests fangen Bugs vor der Produktion ab

::: tip Erinnern Sie sich

Tests sind nicht optional. Sie sind ein Sicherheitsnetz, das selbstbewusstes Refactoring, schnelle Entwicklung und Produktionszuverlässigkeit ermöglicht.
:::

---

## 5. security-review (Sicherheitsüberprüfung)

### Wann aktivieren

- Authentifizierung oder Autorisierung implementieren
- Benutzereingaben oder Dateiuploads verarbeiten
- Neue API-Endpunkte erstellen
- Schlüssel oder Anmeldeinformationen verarbeiten
- Zahlungsfunktionen implementieren
- Sensitive Daten speichern oder übertragen
- Drittanbieter-APIs integrieren

### Sicherheitscheckliste

#### 1. Schlüsselverwaltung

##### ❌ Niemals tun

```typescript
const apiKey = "sk-proj-xxxxx"  // Hardcodierter Schlüssel
const dbPassword = "password123" // Im Quellcode
```

##### ✅ Immer tun

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// Schlüsselexistenz validieren
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### Validierungsschritte
- [ ] Keine hardcodierten API-Schlüssel, Token oder Passwörter
- [ ] Alle Schlüssel in Umgebungsvariablen
- [ ] `.env.local` in .gitignore
- [ ] Keine Schlüssel im Git-Verlauf
- [ ] Produktionsschlüssel auf Hosting-Plattform (Vercel, Railway)

#### 2. Eingabevalidierung

##### Benutzereingaben immer validieren

```typescript
import { z } from 'zod'

// Validierungsschema definieren
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// Vor Verarbeitung validieren
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

##### Dateiupload-Validierung

```typescript
function validateFileUpload(file: File) {
  // Größenprüfung (5 MB Maximum)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // Typprüfung
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Erweiterungsprüfung
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### Validierungsschritte
- [ ] Alle Benutzereingaben mit Schema validiert
- [ ] Dateiuploads eingeschränkt (Größe, Typ, Erweiterung)
- [ ] Benutzereingaben nicht direkt in Abfragen verwenden
- [ ] Whitelist-Validierung (nicht Blacklist)
- [ ] Fehlermeldungen geben keine sensiblen Informationen preis

#### 3. SQL-Injection-Verhinderung

##### ❌ Niemals SQL verketten

```typescript
// Gefährlich - SQL-Injection-Schwachstelle
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ Immer parametrisierte Abfragen verwenden

```typescript
// Sicher - parametrisierte Abfrage
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// Oder rohes SQL verwenden
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

##### Validierungsschritte
- [ ] Alle Datenbankabfragen verwenden parametrisierte Abfragen
- [ ] Keine String-Verkettung in SQL
- [ ] ORM/Query-Builder korrekt verwenden
- [ ] Supabase-Abfragen korrekt bereinigt

#### 4. Authentifizierung und Autorisierung

##### JWT-Token-Verarbeitung

```typescript
// ❌ Falsch: localStorage (anfällig für XSS)
localStorage.setItem('token', token)

// ✅ Richtig: httpOnly cookies
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### Autorisierungsprüfung

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // Immer zuerst Autorisierung validieren
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // Mit Löschung fortfahren
  await db.users.delete({ where: { id: userId } })
}
```

##### Row Level Security (Supabase)

```sql
-- RLS auf allen Tabellen aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Benutzer können nur ihre eigenen Daten sehen
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Benutzer können nur ihre eigenen Daten aktualisieren
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### Validierungsschritte
- [ ] Token in httpOnly cookies (nicht localStorage)
- [ ] Autorisierungsprüfung vor sensiblen Operationen
- [ ] Row Level Security in Supabase aktiviert
- [ ] Rollenbasierte Zugriffssteuerung implementiert
- [ ] Sichere Sitzungsverwaltung

#### 5. XSS-Verhinderung

##### HTML bereinigen

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Benutzer bereitgestelltes HTML immer bereinigen
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

##### Validierungsschritte
- [ ] Benutzer bereitgestelltes HTML bereinigt
- [ ] CSP-Header konfiguriert
- [ ] Keine unvalidierte dynamische Inhaltswiedergabe
- [ ] React-interne XSS-Schutz verwenden

#### 6. CSRF-Schutz

##### CSRF-Token

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

  // Anfrage verarbeiten
}
```

##### SameSite Cookies

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### Validierungsschritte
- [ ] CSRF-Token bei Zustandsänderungsoperationen
- [ ] Alle Cookies mit SameSite=Strict
- [ ] Double Submit Cookie-Muster implementiert

#### 7. Rate Limiting

##### API-Rate Limiting

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 100, // 100 Anfragen pro Fenster
  message: 'Too many requests'
})

// Auf Route anwenden
app.use('/api/', limiter)
```

##### Teure Operationen

```typescript
// Aggressives Rate Limiting für Suche
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 10, // 10 Anfragen pro Minute
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### Validierungsschritte
- [ ] Rate Limiting auf allen API-Endpunkten
- [ ] Strengere Limits auf teure Operationen
- [ ] IP-basiertes Rate Limiting
- [ ] Benutzerbasiertes Rate Limiting (authentifiziert)

#### 8. Exposition sensibler Daten

##### Protokollierung

```typescript
// ❌ Falsch: Sensible Daten protokollieren
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ Richtig: Sensible Daten redigieren
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### Fehlermeldungen

```typescript
// ❌ Falsch: Interne Details exponieren
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ Richtig: Generische Fehlermeldungen
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### Validierungsschritte
- [ ] Keine Passwörter, Token oder Schlüssel in Protokollen
- [ ] Generische Fehlermeldungen für Benutzer
- [ ] Detaillierte Fehler in Serverprotokollen
- [ ] Keine Stack-Traces für Benutzer

#### 9. Blockchain-Sicherheit (Solana)

##### Wallet-Verifizierung

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

##### Transaktionsverifizierung

```typescript
async function verifyTransaction(transaction: Transaction) {
  // Empfänger verifizieren
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // Betrag verifizieren
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // Verifizieren, dass Benutzer genügend Guthaben hat
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### Validierungsschritte
- [ ] Wallet-Signatur verifiziert
- [ ] Transaktionsdetails verifiziert
- [ ] Guthabenprüfung vor Transaktion
- [ ] Keine Blind-Transaktionssignaturen

#### 10. Abhängigkeitssicherheit

##### Regelmäßige Updates

```bash
# Schwachstellen prüfen
npm audit

# Automatisch behebbare Probleme beheben
npm audit fix

# Abhängigkeiten aktualisieren
npm update

# Veraltete Pakete prüfen
npm outdated
```

##### Lock-Dateien

```bash
# Immer Lock-Dateien committen
git add package-lock.json

# Für reproduzierbare Builds in CI/CD
npm ci  # nicht npm install
```

##### Validierungsschritte
- [ ] Abhängigkeiten sind aktuell
- [ ] Keine bekannten Schwachstellen (npm audit clean)
- [ ] Lock-Dateien committet
- [ ] Dependabot auf GitHub aktiviert
- [ ] Regelmäßige Sicherheitsupdates

### Sicherheitstests

#### Automatisierte Sicherheitstests

```typescript
// Authentifizierung testen
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// Autorisierung testen
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// Eingabevalidierung testen
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// Rate Limiting testen
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### Sicherheitscheckliste vor der Bereitstellung

Vor jeder Produktionsbereitstellung:

- [ ] **Schlüssel**: Keine hardcodierten Schlüssel, alle in Umgebungsvariablen
- [ ] **Eingabevalidierung**: Alle Benutzereingaben validiert
- [ ] **SQL-Injection**: Alle Abfragen parametrisiert
- [ ] **XSS**: Benutzerinhalte bereinigt
- [ ] **CSRF**: Schutz aktiviert
- [ ] **Authentifizierung**: Korrekte Token-Verarbeitung
- [ ] **Autorisierung**: Rollenprüfungen vorhanden
- [ ] **Rate Limiting**: Auf allen Endpunkten aktiviert
- [ ] **HTTPS**: In Produktion erzwungen
- [ ] **Sicherheitsheader**: CSP, X-Frame-Options konfiguriert
- [ ] **Fehlerbehandlung**: Keine sensiblen Daten in Fehlern
- [ ] **Protokollierung**: Keine sensiblen Daten in Protokollen
- [ ] **Abhängigkeiten**: Aktuell, keine Schwachstellen
- [ ] **Row Level Security**: In Supabase aktiviert
- [ ] **CORS**: Korrekt konfiguriert
- [ ] **Dateiuploads**: Validiert (Größe, Typ)
- [ ] **Wallet-Signaturen**: Verifiziert (falls Blockchain)

::: tip Erinnern Sie sich

Sicherheit ist nicht optional. Eine einzige Schwachstelle kann die gesamte Plattform gefährden. Im Zweifel wählen Sie die vorsichtigere Seite.
:::

---

## 6. continuous-learning (Kontinuierliches Lernen)

### Funktionsweise

Dieser Skill wird als **Stop hook** am Ende jeder Sitzung ausgeführt:

1. **Sitzungsauswertung**: Prüft, ob die Sitzung genügend Nachrichten hat (Standard: 10+)
2. **Musterverdeckung**: Identifiziert extrahierbare Muster aus der Sitzung
3. **Skill-Extraktion**: Speichert nützliche Muster in `~/.claude/skills/learned/`

### Konfiguration

Bearbeiten Sie `config.json` zur Anpassung:

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

### Mustertypen

| Muster | Beschreibung |
|--- | ---|
| `error_resolution` | Wie bestimmte Fehler gelöst werden |
| `user_corrections` | Muster aus Benutzerkorrekturen |
| `workarounds` | Lösungen für Framework/Library-Quirks |
| `debugging_techniques` | Effektive Debugging-Methoden |
| `project_specific` | Projektspezifische Konventionen |

### Hook-Einrichtung

Fügen Sie zu Ihrem `~/.claude/settings.json` hinzu:

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

### Warum Stop Hook verwenden?

- **Leichtgewicht**: Läuft nur einmal am Ende der Sitzung
- **Nicht blockierend**: Fügt keiner Nachricht Verzögerungen hinzu
- **Vollständiger Kontext**: Hat Zugriff auf den kompletten Sitzungsverlauf

### Verwandt

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Abschnitt kontinuierliches Lernen
- `/learn` Befehl - Manuelle Musterverarbeitung während einer Sitzung

---

## 7. strategic-compact (Strategische Komprimierung)

### Warum strategische Komprimierung?

Automatische Komprimierung wird an beliebigen Punkten ausgelöst:
- Meistens mitten in einer Aufgabe, verliert wichtigen Kontext
- Kein Bewusstsein für logische Aufgabengrenzen
- Kann komplexe Multi-Schritt-Operationen unterbrechen

Strategische Komprimierung an logischen Grenzen:
- **Nach Erkundung, vor Ausführung** - Forschungskontext komprimieren, Implementierungsplan behalten
- **Nach Meilensteinen** - Neuer Start für nächste Phase
- **Vor größeren Kontextwechseln** - Forschungskontext vor anderen Aufgaben bereinigen

### Funktionsweise

Das Skript `suggest-compact.sh` läuft auf PreToolUse (Edit/Write) und:

1. **Tool-Aufrufe verfolgen** - Zählt Tool-Aufrufe in der Sitzung
2. **Schwellenerkennung** - Schlägt bei konfigurierbarem Schwellenwert vor (Standard: 50 Aufrufe)
3. **Regelmäßige Erinnerungen** - Erinnert alle 25 Aufrufe nach Erreichen des Schwellenwerts

### Hook-Einrichtung

Fügen Sie zu Ihrem `~/.claude/settings.json` hinzu:

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

### Konfiguration

Umgebungsvariablen:
- `COMPACT_THRESHOLD` - Tool-Aufrufe vor erstem Vorschlag (Standard: 50)

### Best Practices

1. **Nach Planung komprimieren** - Nach Planabschluss neu beginnen
2. **Nach Debugging komprimieren** - Fehlerlösungskontext vor Fortfahren bereinigen
3. **Nicht während Implementierung komprimieren** - Kontext für verwandte Änderungen behalten
4. **Vorschläge lesen** - Hook sagt Ihnen **wann**, Sie entscheiden **ob**

### Verwandt

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Abschnitt Token-Optimierung
- Memory persistence hooks - Persistenz des Zustands nach Komprimierung

---

## 8. eval-harness (Evaluierungs-Harness)

### Philosophie

Evaluationsgetriebene Entwicklung betrachtet Evaluierungen als "Unit-Tests für AI-Entwicklung":
- Erwartetes Verhalten vor Implementierung definieren
- Während der Entwicklung kontinuierlich Evaluierungen ausführen
- Regressionen bei jeder Änderung verfolgen
- Zuverlässigkeit mit pass@k-Metriken messen

### Evaluierungstypen

#### Funktionsevaluationen

Testet Dinge, die Claude vorher nicht konnte:
```markdown
[CAPABILITY EVAL: feature-name]
Task: Beschreibung dessen, was Claude erreichen soll
Success Criteria:
  - [ ] Kriterium1
  - [ ] Kriterium2
  - [ ] Kriterium3
Expected Output: Beschreibung des erwarteten Ergebnisses
```

#### Regressionsevaluationen

Stellt sicher, dass Änderungen vorhandene Funktionen nicht beschädigen:
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA oder Checkpoint-Name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y bestanden (zuvor Y/Y)
```

### Bewertertypen

#### 1. Code-basierte Bewerters

Verwenden Sie deterministische Codeprüfungen:
```bash
# Prüft, ob Datei erwartetes Muster enthält
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# Prüft, ob Tests bestehen
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# Prüft, ob Build erfolgreich ist
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. Modellbasierte Bewerters

Verwenden Sie Claude zur Bewertung offener Ausgaben:
```markdown
[MODEL GRADER PROMPT]
Bewerten Sie folgende Codeänderung:
1. Löst sie das genannte Problem?
2. Ist sie gut strukturiert?
3. Werden Randfälle behandelt?
4. Ist Fehlerbehandlung angemessen?

Score: 1-5 (1=schlecht, 5=ausgezeichnet)
Reasoning: [Erklärung]
```

#### 3. Manuelle Bewerters

Markiert für manuelle Überprüfung:
```markdown
[HUMAN REVIEW REQUIRED]
Change: Beschreibung dessen, was geändert wurde
Reason: Warum manuelle Überprüfung benötigt wird
Risk Level: LOW/MEDIUM/HIGH
```

### Metriken

#### pass@k

"Mindestens ein Erfolg in k Versuchen"
- pass@1: Erfolgsrate beim ersten Versuch
- pass@3: Erfolgsrate innerhalb von 3 Versuchen
- Typisches Ziel: pass@3 > 90%

#### pass^k

"Alle k Versuche erfolgreich"
- Höhere Zuverlässigkeitsschwelle
- pass^3: 3 aufeinanderfolgende Erfolge
- Für kritische Pfade

### Evaluierungs-Workflow

#### 1. Definition (vor Codierung)

```markdown
## EVAL DEFINITION: feature-xyz

### Capability Evals
1. Kann neues Benutzerkonto erstellen
2. Kann E-Mail-Format validieren
3. Kann Passwort sicher hashen

### Regression Evals
1. Vorhandener Login funktioniert noch
2. Sitzungsverwaltung unverändert
3. Logout-Flow intakt

### Success Metrics
- pass@3 > 90% für Funktionsevaluationen
- pass^3 = 100% für Regressionsevaluationen
```

#### 2. Implementierung

Code schreiben, der definierte Evaluationen besteht.

#### 3. Evaluation

```bash
# Funktionsevaluationen ausführen
[Run each capability eval, record PASS/FAIL]

# Regressionsevaluationen ausführen
npm test -- --testPathPattern="existing"

# Bericht generieren
```

#### 4. Bericht

```markdown
EVAL REPORT: feature-xyz
=======================

Capability Evals:
  create-user:     PASS (pass@1)
  validate-email:  PASS (pass@2)
  hash-password:   PASS (pass@1)
  Overall:         3/3 bestanden

Regression Evals:
  login-flow:      PASS
  session-mgmt:    PASS
  logout-flow:     PASS
  Overall:         3/3 bestanden

Metrics:
  pass@1: 67% (2/3)
  pass@3: 100% (3/3)

Status: READY FOR REVIEW
```

### Integrationsmuster

#### Vor Implementierung

```
/eval define feature-name
```
Erstellt Evaluierungsdefinitionsdatei in `.claude/evals/feature-name.md`

#### Während Implementierung

```
/eval check feature-name
```
Führt aktuelle Evaluation aus und meldet Status

#### Nach Implementierung

```
/eval report feature-name
```
Generiert vollständigen Evaluierungsbericht

### Evaluierungsspeicherung

Speichern Sie Evaluationen im Projekt:

```
.claude/
  evals/
    feature-xyz.md      # Evaluierungsdefinition
    feature-xyz.log     # Evaluierungsausführungs-Verlauf
    baseline.json       # Regressionsbaseline
```

### Best Practices

1. **Evaluierungen vor Codierung definieren** - Erzwingt klares Nachdenken über Erfolgskriterien
2. **Evaluationen häufig ausführen** - Regressionen frühzeitig erkennen
3. **pass@k über Zeit verfolgen** - Zuverlässigkeitstrends überwachen
4. **Code-Bewerter wenn möglich verwenden** - Deterministisch > probabilistisch
5. **Sichere manuelle Überprüfung** - Sicherheitsprüfungen niemals vollständig automatisieren
6. **Evaluationen schnell halten** - Langsame Evaluierungen werden nicht ausgeführt
7. **Evaluationen mit Code versionieren** - Evaluationen sind erstklassige Artefakte

### Beispiel: Authentifizierung hinzufügen

```markdown
## EVAL: add-authentication

### Phase 1: Define (10 min)
Capability Evals:
- [ ] User kann sich mit E-Mail/Passwort registrieren
- [ ] User kann sich mit gültigen Anmeldeinformationen einloggen
- [ ] Ungültige Anmeldeinformationen werden mit ordentlichem Fehler abgelehnt
- [ ] Sitzungen bleiben über Seitenladevorgänge hinweg bestehen
- [ ] Logout bereinigt Sitzung

Regression Evals:
- [ ] Öffentliche Routen immer noch zugänglich
- [ ] API-Antworten unverändert
- [ ] Datenbankschema kompatibel

### Phase 2: Implement (variiert)
[Code schreiben]

### Phase 3: Evaluate
Run: /eval check add-authentication

### Phase 4: Report
EVAL REPORT: add-authentication
===============================
Capability: 5/5 bestanden (pass@3: 100%)
Regression: 3/3 bestanden (pass^3: 100%)
Status: SHIP IT
```

---

## 9. verification-loop (Verifikationsschleife)

### Wann verwenden

Rufen Sie diesen Skill auf, wenn:
- Eine Funktion oder große Codeänderung abgeschlossen ist
- Vor Erstellung eines PR
- Wenn Sie sicherstellen möchten, dass Qualitätsprüfungen bestehen
- Nach Refactoring

### Verifikationsphasen

#### Phase 1: Build-Verifizierung

```bash
# Prüfen, ob Projekt erstellt wird
npm run build 2>&1 | tail -20
# oder
pnpm build 2>&1 | tail -20
```

Wenn Build fehlschlägt, stoppen und vor dem Fortfahren beheben.

#### Phase 2: Typprüfung

```bash
# TypeScript-Projekt
npx tsc --noEmit 2>&1 | head -30

# Python-Projekt
pyright . 2>&1 | head -30
```

Alle Typfehler melden. Kritische Fehler vor dem Fortfahren beheben.

#### Phase 3: Lint-Prüfung

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### Phase 4: Testsuite

```bash
# Tests mit Abdeckung ausführen
npm run test -- --coverage 2>&1 | tail -50

# Abdeckungsschwellen prüfen
# Ziel: 80% Minimum
```

Bericht:
- Gesamtanzahl Tests: X
- Bestanden: X
- Fehlgeschlagen: X
- Abdeckung: X%

#### Phase 5: Sicherheits-Scan

```bash
# Schlüssel prüfen
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# console.log prüfen
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### Phase 6: Diff-Überprüfung

```bash
# Geänderte Inhalte anzeigen
git diff --stat
git diff HEAD~1 --name-only
```

Für jede geänderte Datei überprüfen:
- Unerwartete Änderungen
- Fehlende Fehlerbehandlung
- Mögliche Randfälle

### Ausgabeformat

Nach Ausführen aller Phasen Verifikationsbericht generieren:

```
VERIFICATION REPORT
=================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y bestanden, Z% Abdeckung)
Security:  [PASS/FAIL] (X Probleme)
Diff:      [X Dateien geändert]

Overall:   [READY/NOT READY] für PR

Issues to Fix:
1. ...
2. ...
```

### Kontinuierlicher Modus

Für lange Sitzungen Verifizierung alle 15 Minuten oder nach großen Änderungen ausführen:

```markdown
Psychischen Checkpoint setzen:
- Nach jeder Funktion
- Nach jeder Komponente
- Vor Wechsel zur nächsten Aufgabe

Run: /verify
```

### Integration mit Hooks

Dieser Skill ergänzt PostToolUse-Hooks, bietet aber tiefere Verifizierung. Hooks fangen Probleme sofort; dieser Skill bietet umfassende Überprüfung.

---

## 10. project-guidelines-example (Projektrichtlinien-Beispiel)

Dies ist ein Beispiel für ein projektspezifischen Skill. Verwenden Sie es als Vorlage für Ihre eigenen Projekte.

Basierend auf einer echten Produktionsanwendung: [Zenith](https://zenith.chat) - KI-gestützte Kundenentdeckungsplattform.

### Wann verwenden

Beziehen Sie sich bei der Arbeit an einem bestimmten Projekt, für das es entworfen wurde, auf diesen Skill. Projektskills enthalten:
- Architekturübersicht
- Dateistruktur
- Codierungsmuster
- Testanforderungen
- Deployment-Workflows

---

## 11. clickhouse-io (ClickHouse I/O)

### Übersicht

ClickHouse ist ein spaltenorientiertes Datenbankverwaltungssystem für Online Analytical Processing (OLAP). Es ist für schnelle Analyseabfragen auf großen Datensätzen optimiert.

**Wichtige Funktionen:**
- Spaltenorientierte Speicherung
- Datenkomprimierung
- Parallele Abfrageausführung
- Verteilte Abfragen
- Echtzeitanalyse

### Tabellen-Design-Muster

#### MergeTree-Engine (am häufigsten)

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

#### ReplacingMergeTree (Deduplizierung)

```sql
-- Für Daten, die Duplikate haben können (z.B. aus mehreren Quellen)
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

#### AggregatingMergeTree (Voraggregation)

```sql
-- Zur Aufrechterhaltung aggregierter Kennzahlen
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- Aggregierte Daten abfragen
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

### Abfrageoptimierungsmuster

#### Effiziente Filterung

```sql
-- ✅ GUT: Indexspalten zuerst verwenden
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ SCHLECHT: Nicht-indexierte Spalten zuerst filtern
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### Aggregation

```sql
-- ✅ GUT: ClickHouse-spezifische Aggregationsfunktionen verwenden
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

-- ✅ quantile für Perzentile verwenden (effizienter als percentile)
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### Dateneinfügungsmuster

#### Masseneinfügung (empfohlen)

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

// ✅ Masseneinfügung (effizient)
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

// ❌ Einzelneinfügung (langsam)
async function insertTrade(trade: Trade) {
  // Nicht in einer Schleife tun!
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### Streaming-Einfügung

```typescript
// Für kontinuierlichen Datenimport
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

### Materialisierte Ansichten

#### Echtzeitaggregation

```sql
-- Materialisierte Ansicht für stündliche Statistiken erstellen
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

-- Materialisierte Ansicht abfragen
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

### Performance-Überwachung

#### Abfrageperformance

```sql
-- Langsame Abfragen prüfen
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

#### Tabellenstatistiken

```sql
-- Tabellengröße prüfen
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

### Häufige Analyseabfragen

#### Zeitreihenanalyse

```sql
-- Täglich aktive Benutzer
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- Retention-Analyse
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

#### Trichteranalyse

```sql
-- Konversionstrichter
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

#### Kohortenanalyse

```sql
-- Benutzerkohorten nach Anmeldemonat
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

### Datenpipelinemuster

#### ETL-Muster

```typescript
// Extrahieren, Transformieren, Laden
async function etlPipeline() {
  // 1. Aus Quelle extrahieren
  const rawData = await extractFromPostgres()

  // 2. Transformieren
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. In ClickHouse laden
  await bulkInsertToClickHouse(transformed)
}

// Regelmäßig ausführen
setInterval(etlPipeline, 60 * 60 * 1000)  // Stündlich
```

#### Change Data Capture (CDC)

```typescript
// PostgreSQL-Updates abhören und an ClickHouse synchronisieren
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

### Best Practices

#### 1. Partitionierungsstrategie
- Nach Zeit partitionieren (meist Monat oder Tag)
- Zu viele Partitionen vermeiden (Performance-Auswirkungen)
- DATE-Typ als Partitionsschlüssel verwenden

#### 2. Sortierschlüssel
- Am häufigsten gefilterte Spalten zuerst platzieren
- Kardinalität berücksichtigen (hohe Kardinalität priorisieren)
- Sortierung beeinflusst Komprimierung

#### 3. Datentypen
- Kleinsten geeigneten Typ verwenden (UInt32 vs UInt64)
- LowCardinality für wiederkehrende Strings verwenden
- Enum für kategorische Daten verwenden

#### 4. Vermeiden
- SELECT * (Spalten angeben)
- FINAL (Daten vor Abfrage zusammenführen)
- Zu viele JOINs (bei Analyse denormalisieren)
- Kleine häufige Einfügungen (stattdessen Batch)

#### 5. Überwachung
- Abfrageperformance verfolgen
- Festplattennutzung überwachen
- Zusammenführungsvorgänge prüfen
- Langsame Abfrageprotokolle prüfen

::: tip Erinnern Sie sich

ClickHouse glänzt bei Analyseworkloads. Designen Sie Tabellen für Ihre Abfragemuster, fügen Sie massenhaft ein und nutzen Sie materialisierte Ansichten für Echtzeitaggregation.
:::

---

## Nächste Lektion Vorschau

> In der nächsten Lektion lernen wir **[Scripts API-Referenz](../scripts-api/)**.
>
> Sie werden lernen:
> - Node.js-Skriptschnittstellen und Utility-Funktionen
> - Paketmanager-Erkennungsmechanismen
> - Implementierungsdetails von Hooks-Skripten
> - Verwendungsmethoden der Testsuite

---

## Zusammenfassung dieser Lektion

Die 11 Skill-Bibliotheken von Everything Claude Code bieten umfassende Wissensunterstützung für den Entwicklungsprozess:

1. **coding-standards** - Einheitliche Codierungsstandards, unveränderliche Muster, Best Practices
2. **backend-patterns** - Backend-Architekturmuster, API-Design, Datenbankoptimierung
3. **frontend-patterns** - React/Next.js-Muster, Zustandsverwaltung, Performance-Optimierung
4. **tdd-workflow** - Testgetriebene Entwicklungs-Workflows, 80%+ Abdeckung
5. **security-review** - OWASP Top 10, Eingabevalidierung, Schwachstellenerkennung
6. **continuous-learning** - Automatische Extraktion wiederverwendbarer Muster, Wissensakkumulation
7. **strategic-compact** - Strategische Kontextkomprimierung, Token-Optimierung
8. **eval-harness** - Evaluationsgetriebene Entwicklung, Zuverlässigkeitstests
9. **verification-loop** - Umfassendes Verifikationssystem, Qualitätsprüfung
10. **project-guidelines-example** - Projektkonfigurationsbeispiel, Architekturvorlage
11. **clickhouse-io** - ClickHouse-Analysenmuster, Hochleistungsabfragen

Denken Sie daran, dass diese Skill-Bibliotheken der Kompass für Ihre Codequalität sind. Wenn Sie sie während der Entwicklung korrekt anwenden, können Sie die Entwicklungseffizienz und Codequalität erheblich steigern.

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcodeposition anzuzeigen</strong></summary>

> Aktualisiert am: 2026-01-25

| Skill-Bibliothek | Dateipfad | Zeilennummer |
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

**Wichtige Prinzipien**:
- **coding-standards**: Unveränderliche Muster, Dateien < 800 Zeilen, Funktionen < 50 Zeilen, 80%+ Testabdeckung
- **backend-patterns**: Repository-Muster, Service-Layer-Trennung, parametrisierte Abfragen, Redis-Caching
- **frontend-patterns**: Komponentenkomposition, benutzerdefinierte Hooks, Context + Reducer, Memoisierung, Lazy Loading
- **tdd-workflow**: Tests zuerst, Unit/Integration/E2E-Tests, Testabdeckungsvalidierung
- **security-review**: OWASP Top 10-Prüfungen, Eingabevalidierung, SQL-Injection-Verhinderung, XSS-Verhinderung

**Verwandte Agents**:
- **tdd-guide**: TDD-Workflow-Anleitung
- **code-reviewer**: Codequalitäts- und Stilüberprüfung
- **security-reviewer**: Sicherheitslückenerkennung
- **architect**: Architekturdesign und Musterauswahl

</details>
