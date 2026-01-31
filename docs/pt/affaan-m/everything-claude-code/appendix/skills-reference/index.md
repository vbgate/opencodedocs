---
title: "Referência de Skills: 11 Bibliotecas de Skills | Everything Claude Code"
sidebarTitle: "Referência de 11 Skills em 5 Minutos"
subtitle: "Referência de Skills: 11 Bibliotecas de Skills"
description: "Aprenda as 11 bibliotecas de skills do Everything Claude Code. Domine padrões de codificação, backend/frontend, fluxo de trabalho TDD e revisão de segurança para melhorar a eficiência do desenvolvimento."
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

# Referência Completa de Skills: Detalhes das 11 Bibliotecas de Skills

## O Que Você Poderá Fazer Após Aprender

- Pesquisar e entender rapidamente o conteúdo e a finalidade de todas as 11 bibliotecas de skills
- Aplicar corretamente padrões de codificação, arquitetura e melhores práticas durante o desenvolvimento
- Saber quando usar qual skill para melhorar a eficiência do desenvolvimento e a qualidade do código
- Dominar habilidades-chave como fluxo de trabalho TDD, revisão de segurança e aprendizado contínuo

## Seus Desafios Atuais

Ao enfrentar as 11 bibliotecas de skills no projeto, você pode:

- **Não conseguir lembrar todas as skills**: coding-standards, backend-patterns, security-review... Quais skills usar e quando?
- **Não saber como aplicar**: As skills mencionam padrões imutáveis e fluxo TDD, mas como operar especificamente?
- **Não saber qual pedir ajuda**: Qual skill usar para problemas de segurança? Qual skill usar para desenvolvimento backend?
- **A relação entre skills e Agents**: Qual é a diferença entre skills e Agents? Quando usar Agent e quando usar Skill?

Este documento de referência ajuda você a entender completamente o conteúdo, cenários de aplicação e métodos de uso de cada skill.

---

## Visão Geral das Skills

O Everything Claude Code contém 11 bibliotecas de skills, cada uma com objetivos e cenários de aplicação claros:

| Skill | Objetivo | Prioridade | Cenário de Uso |
| --- | --- | --- | --- |
| **coding-standards** | Padronizar convenções de codificação e melhores práticas | P0 | Codificação geral, TypeScript/JavaScript/React |
| **backend-patterns** | Padrões de arquitetura backend e design de API | P0 | Desenvolvimento Node.js, Express, Next.js API Routes |
| **frontend-patterns** | Padrões de desenvolvimento frontend e otimização de performance | P0 | React, Next.js, gerenciamento de estado |
| **tdd-workflow** | Fluxo de trabalho de desenvolvimento orientado a testes | P0 | Desenvolvimento de novas funcionalidades, correção de bugs, refatoração |
| **security-review** | Revisão de segurança e detecção de vulnerabilidades | P0 | Autenticação e autorização, validação de entrada, processamento de dados sensíveis |
| **continuous-learning** | Extração automática de padrões reutilizáveis | P1 | Projetos de longo prazo, acumulação de conhecimento |
| **strategic-compact** | Compressão estratégica de contexto | P1 | Sessões longas, tarefas complexas |
| **eval-harness** | Framework de desenvolvimento orientado a avaliação | P1 | Avaliação de desenvolvimento com IA, testes de confiabilidade |
| **verification-loop** | Sistema de verificação abrangente | P1 | Verificação pré-PR, verificação de qualidade |
| **project-guidelines-example** | Exemplo de diretrizes de projeto | P2 | Especificações de projeto personalizadas |
| **clickhouse-io** | Padrões de análise ClickHouse | P2 | Consultas analíticas de alta performance |

::: info Skills vs Agents

**Skills** são definições de fluxo de trabalho e bases de conhecimento de domínio, fornecendo padrões, melhores práticas e orientações de especificação.

**Agents** são sub-agentes especializados que executam tarefas complexas em domínios específicos (como planejamento, revisão, depuração).

Os dois se complementam: Skills fornecem o framework de conhecimento, Agents executam tarefas específicas.
:::

---

## 1. coding-standards (Padrões de Codificação)

### Princípios Fundamentais

#### 1. Legibilidade em Primeiro Lugar
- O código é lido muito mais vezes do que é escrito
- Nomes claros de variáveis e funções
- Código autoexplicativo é melhor que comentários
- Formatação consistente

#### 2. Princípio KISS (Keep It Simple, Stupid)
- Use a solução mais simples que funcione
- Evite over-engineering
- Não faça otimização prematura
- Fácil de entender > Código inteligente

#### 3. Princípio DRY (Don't Repeat Yourself)
- Extraia lógica comum para funções
- Crie componentes reutilizáveis
- Compartilhe funções utilitárias entre módulos
- Evite programação copiar-colar

#### 4. Princípio YAGNI (You Aren't Gonna Need It)
- Não construa funcionalidades antes de precisar
- Evite generalizações especulativas
- Adicione complexidade apenas quando necessário
- Comece simples, refatore quando necessário

### Padrão Imutável (CRÍTICO)

::: warning Regra Crítica

Sempre crie novos objetos, nunca modifique objetos existentes! Este é um dos princípios mais importantes da qualidade do código.
:::

**❌ Maneira Errada**: Modificar objeto diretamente

```javascript
function updateUser(user, name) {
  user.name = name  // MUTAÇÃO!
  return user
}
```

**✅ Maneira Correta**: Criar novo objeto

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### Melhores Práticas TypeScript/JavaScript

#### Nomenclatura de Variáveis

```typescript
// ✅ BOM: Nomenclatura descritiva
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ RUIM: Nomenclatura pouco clara
const q = 'election'
const flag = true
const x = 1000
```

#### Nomenclatura de Funções

```typescript
// ✅ BOM: Padrão verbo-substantivo
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ RUIM: Pouco claro ou apenas substantivo
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

#### Tratamento de Erros

```typescript
// ✅ BOM: Tratamento de erros abrangente
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

// ❌ RUIM: Sem tratamento de erros
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

#### Execução Paralela

```typescript
// ✅ BOM: Executar em paralelo quando possível
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ RUIM: Execução sequencial desnecessária
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### Melhores Práticas React

#### Estrutura de Componentes

```typescript
// ✅ BOM: Componente de função com tipos
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

// ❌ RUIM: Sem tipos, estrutura pouco clara
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

#### Hooks Personalizados

```typescript
// ✅ BOM: Hook personalizado reutilizável
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

#### Atualização de Estado

```typescript
// ✅ BOM: Atualização funcional de estado
const [count, setCount] = useState(0)

// Atualização baseada no estado anterior
setCount(prev => prev + 1)

// ❌ RUIM: Referência direta ao estado
setCount(count + 1)  // Pode ficar desatualizado em cenários assíncronos
```

### Padrões de Design de API

#### Convenções de API REST

```
GET    /api/markets              # Listar todos os mercados
GET    /api/markets/:id          # Obter mercado específico
POST   /api/markets              # Criar novo mercado
PUT    /api/markets/:id          # Atualizar mercado (completo)
PATCH  /api/markets/:id          # Atualizar mercado (parcial)
DELETE /api/markets/:id          # Excluir mercado

# Parâmetros de consulta para filtragem
GET /api/markets?status=active&limit=10&offset=0
```

#### Formato de Resposta

```typescript
// ✅ BOM: Estrutura de resposta consistente
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

// Resposta de sucesso
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// Resposta de erro
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

#### Validação de Entrada

```typescript
import { z } from 'zod'

// ✅ BOM: Validação com schema
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
    // Continuar processando dados validados
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

### Organização de Arquivos

#### Estrutura de Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Rotas de API
│   ├── markets/           # Páginas de mercado
│   └── (auth)/           # Páginas de autenticação (grupo de rotas)
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI genéricos
│   ├── forms/            # Componentes de formulário
│   └── layouts/          # Componentes de layout
├── hooks/                # Hooks React personalizados
├── lib/                  # Utilitários e configurações
│   ├── api/             # Cliente de API
│   ├── utils/           # Funções auxiliares
│   └── constants/       # Constantes
├── types/                # Tipos TypeScript
└── styles/              # Estilos globais
```

### Melhores Práticas de Performance

#### Memoização

```typescript
import { useMemo, useCallback } from 'react'

// ✅ BOM: Memoizar cálculos custosos
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ BOM: Memoizar funções de callback
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

#### Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ BOM: Lazy load de componentes pesados
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

---

## 2. backend-patterns (Padrões de Backend)

### Padrões de Design de API

#### Estrutura de API RESTful

```typescript
// ✅ URLs baseadas em recursos
GET    /api/markets                 # Listar recursos
GET    /api/markets/:id             # Obter recurso único
POST   /api/markets                 # Criar recurso
PUT    /api/markets/:id             # Substituir recurso
PATCH  /api/markets/:id             # Atualizar recurso
DELETE /api/markets/:id             # Excluir recurso

// ✅ Parâmetros de consulta para filtragem, ordenação e paginação
GET /api/markets?status=active&sort=volume&limit=20&offset=0
```

#### Padrão Repository

```typescript
// Abstrair lógica de acesso a dados
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

  // Outros métodos...
}
```

#### Padrão de Camada de Serviço

```typescript
// Separar lógica de negócio do acesso a dados
class MarketService {
  constructor(private marketRepo: MarketRepository) {}

  async searchMarkets(query: string, limit: number = 10): Promise<Market[]> {
    // Lógica de negócio
    const embedding = await generateEmbedding(query)
    const results = await this.vectorSearch(embedding, limit)

    // Obter dados completos
    const markets = await this.marketRepo.findByIds(results.map(r => r.id))

    // Ordenar por pontuação de similaridade
    return markets.sort((a, b) => {
      const scoreA = results.find(r => r.id === a.id)?.score || 0
      const scoreB = results.find(r => r.id === b.id)?.score || 0
      return scoreA - scoreB
    })
  }

  private async vectorSearch(embedding: number[], limit: number) {
    // Implementação de busca vetorial
  }
}
```

#### Padrão de Middleware

```typescript
// Pipeline de processamento de requisição/resposta
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
  // O manipulador pode acessar req.user
})
```

### Padrões de Banco de Dados

#### Otimização de Consultas

```typescript
// ✅ BOM: Selecionar apenas colunas necessárias
const { data } = await supabase
  .from('markets')
  .select('id, name, status, volume')
  .eq('status', 'active')
  .order('volume', { ascending: false })
  .limit(10)

// ❌ RUIM: Selecionar tudo
const { data } = await supabase
  .from('markets')
  .select('*')
```

#### Prevenção de Consultas N+1

```typescript
// ❌ RUIM: Problema de consultas N+1
const markets = await getMarkets()
for (const market of markets) {
  market.creator = await getUser(market.creator_id)  // N consultas
}

// ✅ BOM: Busca em lote
const markets = await getMarkets()
const creatorIds = markets.map(m => m.creator_id)
const creators = await getUsers(creatorIds)  // 1 consulta
const creatorMap = new Map(creators.map(c => [c.id, c]))

markets.forEach(market => {
  market.creator = creatorMap.get(market.creator_id)
})
```

#### Padrão de Transações

```typescript
async function createMarketWithPosition(
  marketData: CreateMarketDto,
  positionData: CreatePositionDto
) {
  // Usar transação do Supabase
  const { data, error } = await supabase.rpc('create_market_with_position', {
    market_data: marketData,
    position_data: positionData
  })

  if (error) throw new Error('Transaction failed')
  return data
}

// Função SQL no Supabase
CREATE OR REPLACE FUNCTION create_market_with_position(
  market_data jsonb,
  position_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  -- Transação inicia automaticamente
  INSERT INTO markets VALUES (market_data);
  INSERT INTO positions VALUES (position_data);
  RETURN jsonb_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    -- Rollback ocorre automaticamente
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### Estratégias de Cache

#### Camada de Cache Redis

```typescript
class CachedMarketRepository implements MarketRepository {
  constructor(
    private baseRepo: MarketRepository,
    private redis: RedisClient
  ) {}

  async findById(id: string): Promise<Market | null> {
    // Verificar cache primeiro
    const cached = await this.redis.get(`market:${id}`)

    if (cached) {
      return JSON.parse(cached)
    }

    // Cache miss - buscar do banco de dados
    const market = await this.baseRepo.findById(id)

    if (market) {
      // Cache por 5 minutos
      await this.redis.setex(`market:${id}`, 300, JSON.stringify(market))
    }

    return market
  }

  async invalidateCache(id: string): Promise<void> {
    await this.redis.del(`market:${id}`)
  }
}
```

### Padrões de Tratamento de Erros

#### Manipulador de Erros Centralizado

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

  // Logar erros inesperados
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

#### Retry com Backoff Exponencial

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

### Autenticação e Autorização

#### Validação de Token JWT

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

// Uso em rotas de API
export async function GET(request: Request) {
  const user = await requireAuth(request)

  const data = await getDataForUser(user.userId)

  return NextResponse.json({ success: true, data })
}
```

#### Controle de Acesso Baseado em Função

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
  // Handler com verificação de permissão
})
```

### Rate Limiting

#### Rate Limiter Simples em Memória

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

    // Remover requisições antigas fora da janela
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      return false  // Excedeu o limite de taxa
    }

    // Adicionar requisição atual
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }
}

const limiter = new RateLimiter()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  const allowed = await limiter.checkLimit(ip, 100, 60000)  // 100 requisições/minuto

  if (!allowed) {
    return NextResponse.json({
      error: 'Rate limit exceeded'
    }, { status: 429 })
  }

  // Continuar processando requisição
}
```

### Tarefas em Segundo Plano e Filas

#### Padrão de Fila Simples

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
    // Lógica de execução do job
  }
}

// Para indexação de mercados
interface IndexJob {
  marketId: string
}

const indexQueue = new JobQueue<IndexJob>()

export async function POST(request: Request) {
  const { marketId } = await request.json()

  // Adicionar à fila em vez de bloquear
  await indexQueue.add({ marketId })

  return NextResponse.json({ success: true, message: 'Job queued' })
}
```

### Logs e Monitoramento

#### Logs Estruturados

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

## 3. frontend-patterns (Padrões de Frontend)

### Padrões de Componentes

#### Composição sobre Herança

```typescript
// ✅ BOM: Composição de componentes
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

#### Componentes Compostos

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

#### Padrão Render Props

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

### Padrões de Hooks Personalizados

#### Hook de Gerenciamento de Estado

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

#### Hook de Busca de Dados Assíncronos

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

### Padrões de Gerenciamento de Estado

#### Padrão Context + Reducer

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

### Otimização de Performance

#### Memoização

```typescript
// ✅ useMemo para cálculos custosos
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ useCallback para funções passadas a componentes filhos
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

#### Code Splitting e Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ Lazy load de componentes pesados
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

#### Virtualização de Listas Longas

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualMarketList({ markets }: { markets: Market[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: markets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,  // Altura estimada da linha
    overscan: 5  // Itens extras para renderizar
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

### Padrões de Tratamento de Formulários

#### Formulário Controlado com Validação

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
      // Tratamento de sucesso
    } catch (error) {
      // Tratamento de erro
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

      {/* Outros campos */}

      <button type="submit">Create Market</button>
    </form>
  )
}
```

### Padrões de Error Boundary

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

### Padrões de Animação

#### Animações com Framer Motion

```typescript
import { motion, AnimatePresence } from 'framer-motion'

// ✅ Animação de lista
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

// ✅ Animação de modal
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

### Padrões de Acessibilidade

#### Navegação por Teclado

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
      {/* Implementação do dropdown */}
    </div>
  )
}
```

#### Gerenciamento de Foco

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Salvar elemento com foco atual
      previousFocusRef.current = document.activeElement as HTMLElement

      // Mover foco para o modal
      modalRef.current?.focus()
    } else {
      // Restaurar foco ao fechar
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

## 4. tdd-workflow (Fluxo de Trabalho TDD)

### Quando Ativar

- Escrever novas funcionalidades ou recursos
- Corrigir bugs ou problemas
- Refatorar código existente
- Adicionar endpoints de API
- Criar novos componentes

### Princípios Fundamentais

#### 1. Testes Primeiro
Sempre escreva os testes primeiro, depois escreva o código para fazer os testes passarem.

#### 2. Requisitos de Cobertura
- Cobertura mínima de 80% (unidade + integração + E2E)
- Cobrir todos os casos de borda
- Testar cenários de erro
- Validar condições de limite

#### 3. Tipos de Testes

##### Testes de Unidade
- Funções e utilitários independentes
- Lógica de componentes
- Funções puras
- Funções auxiliares e utilitários

##### Testes de Integração
- Endpoints de API
- Operações de banco de dados
- Interações de serviços
- Chamadas a APIs externas

##### Testes E2E (Playwright)
- Fluxos críticos do usuário
- Workflows completos
- Automação de browser
- Interações de UI

### Etapas do Fluxo de Trabalho TDD

#### Etapa 1: Escrever a Jornada do Usuário

```
Como [papel], eu quero [ação], para que [benefício]

Exemplo:
Como usuário, eu quero busca semântica de mercados,
para que eu possa encontrar mercados relevantes mesmo sem palavras-chave exatas.
```

#### Etapa 2: Gerar Casos de Teste

Crie casos de teste abrangentes para cada jornada do usuário:

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // Implementação do teste
  })

  it('handles empty query gracefully', async () => {
    // Testar caso de borda
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // Testar comportamento de fallback
  })

  it('sorts results by similarity score', async () => {
    // Testar lógica de ordenação
  })
})
```

#### Etapa 3: Executar Testes (Deve Falhar)

```bash
npm test
# Os testes devem falhar - ainda não implementamos
```

#### Etapa 4: Implementar o Código

Escreva o código mínimo para fazer os testes passarem:

```typescript
// Implementação guiada pelos testes
export async function searchMarkets(query: string) {
  // Implementar aqui
}
```

#### Etapa 5: Executar Testes Novamente

```bash
npm test
# Os testes agora devem passar
```

#### Etapa 6: Refatorar

Melhore a qualidade do código enquanto mantém os testes verdes:
- Remover código duplicado
- Melhorar nomenclatura
- Otimizar performance
- Melhorar legibilidade

#### Etapa 7: Verificar Cobertura

```bash
npm run test:coverage
# Verificar se atingiu 80%+ de cobertura
```

### Padrões de Testes

#### Padrão de Testes de Unidade (Jest/Vitest)

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

#### Padrão de Testes de Integração de API

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
    // Simular falha do banco de dados
    const request = new NextRequest('http://localhost/api/markets')
    // Testar tratamento de erro
  })
})
```

#### Padrão de Testes E2E (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // Navegar para a página de mercados
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // Verificar que a página carregou
  await expect(page.locator('h1')).toContainText('Markets')

  // Buscar mercados
  await page.fill('input[placeholder="Search markets"]', 'election')

  // Aguardar debounce e resultados
  await page.waitForTimeout(600)

  // Verificar que os resultados da busca são exibidos
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // Verificar que os resultados contêm o termo de busca
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // Filtrar por status
  await page.click('button:has-text("Active")')

  // Verificar resultados filtrados
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // Fazer login primeiro
  await page.goto('/creator-dashboard')

  // Preencher formulário de criação de mercado
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // Submeter formulário
  await page.click('button[type="submit"]')

  // Verificar mensagem de sucesso
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // Verificar redirecionamento para a página do mercado
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

### Organização de Arquivos de Teste

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # Testes de unidade
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # Testes de integração
└── e2e/
    ├── markets.spec.ts               # Testes E2E
    ├── trading.spec.ts
    └── auth.spec.ts
```

### Mock de Serviços Externos

#### Mock do Supabase

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

#### Mock do Redis

```typescript
jest.mock('@/lib/redis', () => ({
  searchMarketsByVector: jest.fn(() => Promise.resolve([
    { slug: 'test-market', similarity_score: 0.95 }
  ])),
  checkRedisHealth: jest.fn(() => Promise.resolve({ connected: true }))
}))
```

#### Mock do OpenAI

```typescript
jest.mock('@/lib/openai', () => ({
  generateEmbedding: jest.fn(() => Promise.resolve(
    new Array(1536).fill(0.1) // Simular embedding de 1536 dimensões
  ))
}))
```

### Validação de Cobertura de Testes

#### Executar Relatório de Cobertura

```bash
npm run test:coverage
```

#### Limiares de Cobertura

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

### Erros Comuns em Testes

#### ❌ Erro: Testar Detalhes de Implementação

```typescript
// Não testar estado interno
expect(component.state.count).toBe(5)
```

#### ✅ Correto: Testar Comportamento Visível ao Usuário

```typescript
// Testar o que o usuário vê
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

#### ❌ Erro: Seletores Frágeis

```typescript
// Quebra facilmente
await page.click('.css-class-xyz')
```

#### ✅ Correto: Seletores Semânticos

```typescript
// Resiliente a mudanças
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

#### ❌ Erro: Sem Isolamento de Testes

```typescript
// Testes dependem uns dos outros
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* depende do teste anterior */ })
```

#### ✅ Correto: Testes Independentes

```typescript
// Cada teste configura seus próprios dados
test('creates user', () => {
  const user = createTestUser()
  // Lógica de teste
})

test('updates user', () => {
  const user = createTestUser()
  // Lógica de atualização
})
```

### Testes Contínuos

#### Modo Watch Durante o Desenvolvimento

```bash
npm test -- --watch
# Testes rodam automaticamente quando arquivos mudam
```

#### Hook Pré-commit

```bash
# Rodar antes de cada commit
npm test && npm run lint
```

#### Integração CI/CD

```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Melhores Práticas

1. **Testes Primeiro** - Sempre TDD
2. **Uma Asserção por Teste** - Foco em comportamento único
3. **Nomes Descritivos de Testes** - Explique o que está sendo testado
4. **Arrange-Act-Assert** - Estrutura clara de teste
5. **Mock de Dependências Externas** - Isole testes de unidade
6. **Testar Casos de Borda** - Null, undefined, vazio, valores grandes
7. **Testar Caminhos de Erro** - Não apenas o caminho feliz
8. **Manter Testes Rápidos** - Testes de unidade < 50ms
9. **Limpar Após Testes** - Sem efeitos colaterais
10. **Revisar Relatórios de Cobertura** - Identificar lacunas

### Métricas de Sucesso

- 80%+ de cobertura de código alcançada
- Todos os testes passando (verde)
- Sem testes pulados ou desabilitados
- Execução rápida de testes (unidade < 30s)
- Testes E2E cobrindo fluxos críticos do usuário
- Testes capturando bugs antes da produção

::: tip Lembre-se

Testes não são opcionais. Eles são a rede de segurança que permite refatoração confiante, desenvolvimento rápido e confiabilidade em produção.
:::

---

## 5. security-review (Revisão de Segurança)

### Quando Ativar

- Implementar autenticação ou autorização
- Processar entrada de usuário ou upload de arquivos
- Criar novos endpoints de API
- Lidar com chaves ou credenciais
- Implementar funcionalidade de pagamento
- Armazenar ou transmitir dados sensíveis
- Integrar APIs de terceiros

### Checklist de Segurança

#### 1. Gerenciamento de Chaves

##### ❌ Nunca Faça Isso

```typescript
const apiKey = "sk-proj-xxxxx"  // Chave hardcoded
const dbPassword = "password123" // No código fonte
```

##### ✅ Sempre Faça Isso

```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// Validar que a chave existe
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

##### Passos de Validação
- [ ] Sem chaves de API, tokens ou senhas hardcoded
- [ ] Todas as chaves em variáveis de ambiente
- [ ] `.env.local` no .gitignore
- [ ] Sem chaves no histórico do Git
- [ ] Chaves de produção na plataforma de hospedagem (Vercel, Railway)

#### 2. Validação de Entrada

##### Sempre Valide Entrada do Usuário

```typescript
import { z } from 'zod'

// Definir schema de validação
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// Validar antes de processar
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

##### Validação de Upload de Arquivos

```typescript
function validateFileUpload(file: File) {
  // Verificação de tamanho (máximo 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // Verificação de tipo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Verificação de extensão
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

##### Passos de Validação
- [ ] Toda entrada de usuário validada com schema
- [ ] Uploads de arquivo limitados (tamanho, tipo, extensão)
- [ ] Não usar entrada de usuário diretamente em queries
- [ ] Validação com whitelist (não blacklist)
- [ ] Mensagens de erro não revelam informações sensíveis

#### 3. Prevenção de SQL Injection

##### ❌ Nunca Concatene SQL

```typescript
// Perigoso - Vulnerabilidade de SQL Injection
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

##### ✅ Sempre Use Queries Parametrizadas

```typescript
// Seguro - Query parametrizada
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

// Ou usando SQL raw
await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

##### Passos de Validação
- [ ] Todas as queries de banco de dados usam queries parametrizadas
- [ ] Sem concatenação de strings em SQL
- [ ] Uso correto de ORM/query builder
- [ ] Queries do Supabase corretamente sanitizadas

#### 4. Autenticação e Autorização

##### Manipulação de Tokens JWT

```typescript
// ❌ Errado: localStorage (vulnerável a XSS)
localStorage.setItem('token', token)

// ✅ Certo: cookies httpOnly
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

##### Verificações de Autorização

```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // Sempre verificar autorização primeiro
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // Prosseguir com a exclusão
  await db.users.delete({ where: { id: userId } })
}
```

##### Row Level Security (Supabase)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Usuários só podem ver seus próprios dados
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Usuários só podem atualizar seus próprios dados
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

##### Passos de Validação
- [ ] Tokens armazenados em cookies httpOnly (não localStorage)
- [ ] Verificações de autorização antes de operações sensíveis
- [ ] Row Level Security habilitado no Supabase
- [ ] Controle de acesso baseado em função implementado
- [ ] Gerenciamento de sessão seguro

#### 5. Prevenção de XSS

##### Sanitização de HTML

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Sempre sanitizar HTML fornecido pelo usuário
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

##### Passos de Validação
- [ ] HTML fornecido pelo usuário sanitizado
- [ ] Headers CSP configurados
- [ ] Sem renderização dinâmica de conteúdo não validado
- [ ] Usar proteção XSS embutida do React

#### 6. Proteção CSRF

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

  // Processar requisição
}
```

##### Cookies SameSite

```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

##### Passos de Validação
- [ ] Tokens CSRF em operações de alteração de estado
- [ ] Todos os cookies usando SameSite=Strict
- [ ] Implementar padrão de double-submit cookie

#### 7. Rate Limiting

##### Rate Limiting de API

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por janela
  message: 'Too many requests'
})

// Aplicar a rotas
app.use('/api/', limiter)
```

##### Operações Custosas

```typescript
// Rate limiting agressivo para busca
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 requisições por minuto
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

##### Passos de Validação
- [ ] Rate limiting em todos os endpoints de API
- [ ] Limites mais estritos em operações custosas
- [ ] Rate limiting baseado em IP
- [ ] Rate limiting baseado em usuário (autenticado)

#### 8. Exposição de Dados Sensíveis

##### Logging

```typescript
// ❌ Errado: Logar dados sensíveis
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// ✅ Certo: Editar dados sensíveis
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

##### Mensagens de Erro

```typescript
// ❌ Errado: Expor detalhes internos
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// ✅ Certo: Mensagens de erro genéricas
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

##### Passos de Validação
- [ ] Sem senhas, tokens ou chaves nos logs
- [ ] Mensagens de erro para usuários são genéricas
- [ ] Erros detalhados nos logs do servidor
- [ ] Sem stack traces para usuários

#### 9. Segurança Blockchain (Solana)

##### Verificação de Carteira

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

##### Verificação de Transação

```typescript
async function verifyTransaction(transaction: Transaction) {
  // Verificar destinatário
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  // Verificar valor
  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  // Verificar que o usuário tem saldo suficiente
  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

##### Passos de Validação
- [ ] Assinaturas de carteira verificadas
- [ ] Detalhes de transação verificados
- [ ] Verificação de saldo antes da transação
- [ ] Sem assinatura cega de transações

#### 10. Segurança de Dependências

##### Atualizações Regulares

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente problemas corrigíveis
npm audit fix

# Atualizar dependências
npm update

# Verificar pacotes desatualizados
npm outdated
```

##### Lock Files

```bash
# Sempre commitar lock files
git add package-lock.json

# Usar em CI/CD para builds reproduzíveis
npm ci  # ao invés de npm install
```

##### Passos de Validação
- [ ] Dependências atualizadas
- [ ] Sem vulnerabilidades conhecidas (npm audit clean)
- [ ] Lock files commitados
- [ ] Dependabot habilitado no GitHub
- [ ] Atualizações de segurança regulares

### Testes de Segurança

#### Testes de Segurança Automatizados

```typescript
// Testar autenticação
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// Testar autorização
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// Testar validação de entrada
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// Testar rate limiting
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

### Checklist Pré-deploy de Segurança

Antes de qualquer deploy para produção:

- [ ] **Chaves**: Sem chaves hardcoded, todas em variáveis de ambiente
- [ ] **Validação de Entrada**: Toda entrada de usuário validada
- [ ] **SQL Injection**: Todas as queries parametrizadas
- [ ] **XSS**: Conteúdo de usuário sanitizado
- [ ] **CSRF**: Proteção habilitada
- [ ] **Autenticação**: Manipulação correta de tokens
- [ ] **Autorização**: Verificações de função em vigor
- [ ] **Rate Limiting**: Habilitado em todos os endpoints
- [ ] **HTTPS**: Enforçado em produção
- [ ] **Headers de Segurança**: CSP, X-Frame-Options configurados
- [ ] **Tratamento de Erros**: Sem dados sensíveis em erros
- [ ] **Logging**: Sem dados sensíveis nos logs
- [ ] **Dependências**: Atualizadas, sem vulnerabilidades
- [ ] **Row Level Security**: Habilitado no Supabase
- [ ] **CORS**: Configurado corretamente
- [ ] **Upload de Arquivos**: Validado (tamanho, tipo)
- [ ] **Assinaturas de Carteira**: Verificadas (se blockchain)

::: tip Lembre-se

Segurança não é opcional. Uma vulnerabilidade pode comprometer toda a plataforma. Em caso de dúvida, opte pelo lado da cautela.
:::

---

## 6. continuous-learning (Aprendizado Contínuo)

### Como Funciona

Esta skill funciona como um **Stop hook** que roda no final de cada sessão:

1. **Avaliação de Sessão**: Verifica se a sessão tem mensagens suficientes (padrão: 10+)
2. **Detecção de Padrões**: Identifica padrões extraíveis da sessão
3. **Extração de Skills**: Salva padrões úteis em `~/.claude/skills/learned/`

### Configuração

Edite `config.json` para personalizar:

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

### Tipos de Padrões

| Padrão | Descrição |
| --- | --- |
| `error_resolution` | Como resolver erros específicos |
| `user_corrections` | Padrões de correções do usuário |
| `workarounds` | Soluções para peculiaridades de frameworks/bibliotecas |
| `debugging_techniques` | Métodos eficazes de debugging |
| `project_specific` | Convenções específicas do projeto |

### Configuração do Hook

Adicione ao seu `~/.claude/settings.json`:

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

### Por Que Usar o Hook Stop?

- **Leve**: Roda apenas uma vez no final da sessão
- **Não-bloqueante**: Não adiciona latência a cada mensagem
- **Contexto Completo**: Pode acessar o histórico completo da sessão

### Relacionados

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Seção de aprendizado contínuo
- Comando `/learn` - Extração manual de padrões durante a sessão

---

## 7. strategic-compact (Compactação Estratégica)

### Por Que Usar Compactação Estratégica?

Compactação automática dispara em pontos arbitrários:
- Geralmente no meio da tarefa, perdendo contexto importante
- Sem consciência dos limites lógicos da tarefa
- Pode interromper operações complexas de múltiplos passos

Compactação estratégica em limites lógicos:
- **Após exploração, antes de execução** - Compactar contexto de pesquisa, reter plano de implementação
- **Após completar marco** - Novo começo para a próxima fase
- **Antes de mudança major de contexto** - Limpar contexto de pesquisa antes de tarefas diferentes

### Como Funciona

O script `suggest-compact.sh` roda em PreToolUse (Edit/Write) e:

1. **Rastrear Chamadas de Ferramenta** - Conta chamadas de ferramenta na sessão
2. **Detecção de Limiar** - Sugere em limiar configurável (padrão: 50 chamadas)
3. **Lembretes Periódicos** - Lembra a cada 25 chamadas após o limiar

### Configuração do Hook

Adicione ao seu `~/.claude/settings.json`:

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

### Configuração

Variáveis de ambiente:
- `COMPACT_THRESHOLD` - Chamadas de ferramenta antes da primeira sugestão (padrão: 50)

### Melhores Práticas

1. **Compactar após planejamento** - Após completar o plano, compactar para recomeçar
2. **Compactar após debugging** - Limpar contexto de resolução de erro antes de continuar
3. **Não compactar durante implementação** - Reter contexto para mudanças relacionadas
4. **Ler as sugestões** - O hook diz **quando**, você decide **se**

### Relacionados

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Seção de otimização de tokens
- Hooks de persistência de memória - Persistir estado após compactação

---

## 8. eval-harness (Harness de Avaliação)

### Filosofia

O desenvolvimento orientado a avaliação trata avaliações como "testes de unidade para desenvolvimento com IA":
- Definir comportamento esperado antes da implementação
- Executar avaliações continuamente durante o desenvolvimento
- Rastrear regressões a cada mudança
- Usar métricas pass@k para medir confiabilidade

### Tipos de Avaliação

#### Avaliações de Capacidade

Testar coisas que Claude não conseguia fazer antes:
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion1
  - [ ] Criterion2
  - [ ] Criterion3
Expected Output: Description of expected result
```

#### Avaliações de Regressão

Garantir que mudanças não quebrem funcionalidade existente:
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

### Tipos de Graders

#### 1. Graders Baseados em Código

Verificações determinísticas usando código:
```bash
# Verificar se arquivo contém padrão esperado
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# Verificar se testes passam
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# Verificar se build funciona
npm run build && echo "PASS" || echo "FAIL"
```

#### 2. Graders Baseados em Modelo

Usar Claude para avaliar saídas abertas:
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

#### 3. Graders Humanos

Sinalizar para revisão humana:
```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

### Métricas

#### pass@k

"Pelo menos uma vez bem-sucedido em k tentativas"
- pass@1: Taxa de sucesso na primeira tentativa
- pass@3: Taxa de sucesso em 3 tentativas
- Meta típica: pass@3 > 90%

#### pass^k

"Todas as k tentativas bem-sucedidas"
- Limiar de confiabilidade mais alto
- pass^3: 3 sucessos consecutivos
- Usado para caminhos críticos

### Fluxo de Trabalho de Avaliação

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

Escreva código para passar nas avaliações definidas.

#### 3. Avaliar

```bash
# Executar avaliações de capacidade
[Run each capability eval, record PASS/FAIL]

# Executar avaliações de regressão
npm test -- --testPathPattern="existing"

# Gerar relatório
```

#### 4. Reportar

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

### Padrões de Integração

#### Antes da Implementação

```
/eval define feature-name
```
Cria arquivo de definição de avaliação em `.claude/evals/feature-name.md`

#### Durante a Implementação

```
/eval check feature-name
```
Executa avaliações atuais e reporta status

#### Após a Implementação

```
/eval report feature-name
```
Gera relatório completo de avaliação

### Armazenamento de Avaliações

Armazenar avaliações no projeto:

```
.claude/
  evals/
    feature-xyz.md      # Definição da avaliação
    feature-xyz.log     # Histórico de execuções
    baseline.json       # Baseline de regressão
```

### Melhores Práticas

1. **Definir avaliações antes de codificar** - Força pensamento claro sobre critérios de sucesso
2. **Executar avaliações frequentemente** - Capturar regressões cedo
3. **Rastrear pass@k ao longo do tempo** - Monitorar tendências de confiabilidade
4. **Usar graders de código quando possível** - Determinístico > Probabilístico
5. **Revisão humana para segurança** - Nunca automatizar completamente verificações de segurança
6. **Manter avaliações rápidas** - Avaliações lentas não são executadas
7. **Versionar avaliações com o código** - Avaliações são artefatos de primeira classe

### Exemplo: Adicionar Autenticação

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

## 9. verification-loop (Loop de Verificação)

### Quando Usar

Invoque esta skill quando:
- Após completar uma funcionalidade ou mudança significativa de código
- Antes de criar um PR
- Quando quiser garantir que verificações de qualidade passam
- Após refatoração

### Fases de Verificação

#### Fase 1: Validação de Build

```bash
# Verificar se o projeto builda
npm run build 2>&1 | tail -20
# ou
pnpm build 2>&1 | tail -20
```

Se o build falhar, pare e corrija antes de continuar.

#### Fase 2: Verificação de Tipos

```bash
# Projetos TypeScript
npx tsc --noEmit 2>&1 | head -30

# Projetos Python
pyright . 2>&1 | head -30
```

Reporte todos os erros de tipo. Corrija erros críticos antes de continuar.

#### Fase 3: Verificação de Lint

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

#### Fase 4: Suite de Testes

```bash
# Rodar testes com cobertura
npm run test -- --coverage 2>&1 | tail -50

# Verificar limiar de cobertura
# Meta: 80% mínimo
```

Reporte:
- Total de testes: X
- Passaram: X
- Falharam: X
- Cobertura: X%

#### Fase 5: Scan de Segurança

```bash
# Verificar chaves
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Verificar console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

#### Fase 6: Revisão de Diff

```bash
# Mostrar o que mudou
git diff --stat
git diff HEAD~1 --name-only
```

Revisar para cada arquivo alterado:
- Mudanças inesperadas
- Falta de tratamento de erro
- Possíveis casos de borda

### Formato de Saída

Após rodar todas as fases, gerar um relatório de verificação:

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

### Modo Contínuo

Para sessões longas, rode verificação a cada 15 minutos ou após mudanças significativas:

```markdown
Estabeleça um checkpoint mental:
- Após completar cada função
- Após completar um componente
- Antes de mudar para a próxima tarefa

Execute: /verify
```

### Integração com Hooks

Esta skill complementa hooks de PostToolUse, mas fornece verificação mais profunda. Hooks capturam problemas imediatamente; esta skill fornece revisão abrangente.

---

## 10. project-guidelines-example (Exemplo de Diretrizes de Projeto)

Este é um exemplo de skill específica de projeto. Use como template para seus próprios projetos.

Baseado em aplicação de produção real: [Zenith](https://zenith.chat) - Plataforma de descoberta de clientes impulsionada por IA.

### Quando Usar

Consulte esta skill quando estiver trabalhando no projeto específico para o qual foi projetada. Skills de projeto contêm:
- Visão geral da arquitetura
- Estrutura de arquivos
- Padrões de código
- Requisitos de teste
- Workflows de deploy

---

## 11. clickhouse-io (I/O ClickHouse)

### Visão Geral

ClickHouse é um sistema de gerenciamento de banco de dados orientado a colunas para processamento analítico online (OLAP). É otimizado para consultas analíticas rápidas em grandes conjuntos de dados.

**Características Principais:**
- Armazenamento orientado a colunas
- Compressão de dados
- Execução paralela de queries
- Queries distribuídas
- Análise em tempo real

### Padrões de Design de Tabelas

#### Engine MergeTree (Mais Comum)

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

#### ReplacingMergeTree (Desduplicação)

```sql
-- Para dados que podem ter duplicatas (ex: de múltiplas fontes)
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

#### AggregatingMergeTree (Pré-agregação)

```sql
-- Para manter métricas agregadas
CREATE TABLE market_stats_hourly (
    hour DateTime,
    market_id String,
    total_volume AggregateFunction(sum, UInt64),
    total_trades AggregateFunction(count, UInt32),
    unique_users AggregateFunction(uniq, String)
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, market_id);

-- Consultar dados agregados
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

### Padrões de Otimização de Queries

#### Filtragem Eficiente

```sql
-- ✅ BOM: Usar colunas indexadas primeiro
SELECT *
FROM markets_analytics
WHERE date >= '2025-01-01'
  AND market_id = 'market-123'
  AND volume > 1000
ORDER BY date DESC
LIMIT 100;

-- ❌ RUIM: Filtrar colunas não indexadas primeiro
SELECT *
FROM markets_analytics
WHERE volume > 1000
  AND market_name LIKE '%election%'
  AND date >= '2025-01-01';
```

#### Agregação

```sql
-- ✅ BOM: Usar funções de agregação específicas do ClickHouse
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

-- ✅ Usar quantile para percentis (mais eficiente que percentile)
SELECT
    quantile(0.50)(trade_size) AS median,
    quantile(0.95)(trade_size) AS p95,
    quantile(0.99)(trade_size) AS p99
FROM trades
WHERE created_at >= now() - INTERVAL 1 HOUR;
```

### Padrões de Inserção de Dados

#### Inserção em Lote (Recomendado)

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

// ✅ Inserção em lote (eficiente)
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

// ❌ Inserção individual (lenta)
async function insertTrade(trade: Trade) {
  // Não faça isso em loop!
  await clickhouse.query(`
    INSERT INTO trades VALUES ('${trade.id}', ...)
  `).toPromise()
}
```

#### Inserção em Streaming

```typescript
// Para importação contínua de dados
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

### Views Materializadas

#### Agregação em Tempo Real

```sql
-- Criar view materializada para estatísticas por hora
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

-- Consultar view materializada
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

### Monitoramento de Performance

#### Performance de Queries

```sql
-- Verificar queries lentas
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

#### Estatísticas de Tabelas

```sql
-- Verificar tamanho das tabelas
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

### Queries Analíticas Comuns

#### Análise de Série Temporal

```sql
-- Usuários ativos diários
SELECT
    toDate(timestamp) AS date,
    uniq(user_id) AS daily_active_users
FROM events
WHERE timestamp >= today() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;

-- Análise de retenção
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

#### Análise de Funil

```sql
-- Funil de conversão
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

#### Análise de Cohort

```sql
-- Cohort de usuários por mês de cadastro
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

### Padrões de Pipeline de Dados

#### Padrão ETL

```typescript
// Extract, Transform, Load
async function etlPipeline() {
  // 1. Extrair da fonte
  const rawData = await extractFromPostgres()

  // 2. Transformar
  const transformed = rawData.map(row => ({
    date: new Date(row.created_at).toISOString().split('T')[0],
    market_id: row.market_slug,
    volume: parseFloat(row.total_volume),
    trades: parseInt(row.trade_count)
  }))

  // 3. Carregar no ClickHouse
  await bulkInsertToClickHouse(transformed)
}

// Executar periodicamente
setInterval(etlPipeline, 60 * 60 * 1000)  // A cada hora
```

#### Change Data Capture (CDC)

```typescript
// Ouvir mudanças no PostgreSQL e sincronizar com ClickHouse
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

### Melhores Práticas

#### 1. Estratégia de Particionamento
- Particionar por tempo (geralmente mês ou dia)
- Evitar muitas partições (impacto na performance)
- Usar tipo DATE para chave de partição

#### 2. Chaves de Ordenação
- Colocar colunas mais frequentemente filtradas primeiro
- Considerar cardinalidade (alta cardinalidade primeiro)
- Ordenação afeta compressão

#### 3. Tipos de Dados
- Usar tipo mínimo apropriado (UInt32 vs UInt64)
- Usar LowCardinality para strings repetidas
- Usar Enum para dados categóricos

#### 4. Evitar
- SELECT * (especificar colunas)
- FINAL (mergeia dados antes da query)
- Muitos JOINs (desnormalize para análise)
- Inserções pequenas frequentes (use lotes)

#### 5. Monitoramento
- Rastrear performance de queries
- Monitorar uso de disco
- Verificar operações de merge
- Revisar logs de queries lentas

::: tip Lembre-se

O ClickHouse brilha em workloads analíticos. Projete tabelas para seus padrões de query, insira em lotes e aproveite views materializadas para agregações em tempo real.
:::

---

## Próxima Aula

> Na próxima aula aprenderemos sobre **[Scripts API Reference](../scripts-api/)**.
>
> Você vai aprender:
> - Interfaces de script Node.js e funções utilitárias
> - Mecanismos de detecção de gerenciador de pacotes
> - Detalhes de implementação de scripts de Hooks
> - Como usar a suíte de testes

---

## Resumo da Aula

As 11 bibliotecas de skills do Everything Claude Code fornecem suporte abrangente de conhecimento para o processo de desenvolvimento:

1. **coding-standards** - Padronização de convenções de codificação, padrões imutáveis, melhores práticas
2. **backend-patterns** - Padrões de arquitetura backend, design de API, otimização de banco de dados
3. **frontend-patterns** - Padrões React/Next.js, gerenciamento de estado, otimização de performance
4. **tdd-workflow** - Fluxo de trabalho de desenvolvimento orientado a testes, cobertura 80%+
5. **security-review** - OWASP Top 10, validação de entrada, prevenção de SQL injection, prevenção de XSS
6. **continuous-learning** - Extração automática de padrões reutilizáveis, acumulação de conhecimento
7. **strategic-compact** - Compactação estratégica de contexto, otimização de tokens
8. **eval-harness** - Desenvolvimento orientado a avaliação, testes de confiabilidade
9. **verification-loop** - Sistema de verificação abrangente, verificação de qualidade
10. **project-guidelines-example** - Exemplo de configuração de projeto, template de arquitetura
11. **clickhouse-io** - Padrões de análise ClickHouse, queries de alta performance

Lembre-se, estas bibliotecas de skills são a bússola da qualidade do seu código. Aplique-as corretamente durante o desenvolvimento para melhorar significativamente a eficiência do desenvolvimento e a qualidade do código.

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Última atualização: 2026-01-25

| Skill | Caminho do Arquivo | Linha |
| --- | --- | --- |
| coding-standards | skills/coding-standards/index.md | 1 |
| backend-patterns | skills/backend-patterns/index.md | 1 |
| frontend-patterns | skills/frontend-patterns/index.md | 1 |
| tdd-workflow | skills/tdd-workflow/index.md | 1 |
| security-review | skills/security-review/index.md | 1 |
| continuous-learning | skills/continuous-learning/index.md | 1 |
| strategic-compact | skills/strategic-compact/index.md | 1 |
| eval-harness | skills/eval-harness/index.md | 1 |
| verification-loop | skills/verification-loop/index.md | 1 |
| project-guidelines-example | skills/project-guidelines-example/index.md | 1 |
| clickhouse-io | skills/clickhouse-io/index.md | 1 |

**Princípios-Chave**:
- **coding-standards**: Padrões imutáveis, arquivos < 800 linhas, funções < 50 linhas, cobertura de testes 80%+
- **backend-patterns**: Padrão Repository, separação de camada de Service, queries parametrizadas, cache Redis
- **frontend-patterns**: Composição de componentes, Hooks personalizados, Context + Reducer, memoização, lazy loading
- **tdd-workflow**: Testes primeiro, testes de unidade/integração/E2E, validação de cobertura de testes
- **security-review**: Verificação OWASP Top 10, validação de entrada, prevenção de SQL injection, prevenção de XSS

**Agents Relacionados**:
- **tdd-guide**: Orientação de fluxo TDD
- **code-reviewer**: Revisão de qualidade e estilo de código
- **security-reviewer**: Detecção de vulnerabilidades de segurança
- **architect**: Design de arquitetura e seleção de padrões

</details>
