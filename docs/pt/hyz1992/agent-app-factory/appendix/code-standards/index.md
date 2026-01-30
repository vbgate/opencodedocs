---
title: "Padrões de Código: Convenções TypeScript, Estrutura de Arquivos e Códigos de Erro | Tutorial do AI App Factory"
sidebarTitle: "Padrões de Código"
subtitle: "Padrões de Código: Convenções TypeScript, Estrutura de Arquivos e Códigos de Erro"
description: "Aprenda as convenções de codificação TypeScript, estrutura de arquivos, requisitos de comentários e sistema de códigos de erro que o código gerado pelo AI App Factory deve seguir. Este tutorial cobre detalhadamente convenções gerais, convenções TypeScript, convenções front-end e back-end, convenções Prisma, convenções de comentários e sistema unificado de códigos de erro, ajudando você a entender e manter a qualidade do código gerado."
tags:
  - "Apêndice"
  - "Padrões de Código"
  - "TypeScript"
  - "Códigos de Erro"
prerequisite:
  - "start-init-project"
order: 230
---

# Padrões de Código: Convenções TypeScript, Estrutura de Arquivos e Códigos de Erro

## O Que Você Vai Aprender

- ✅ Entender as convenções de codificação que o código gerado pelo AI App Factory deve seguir
- ✅ Dominar as convenções de tipos e nomenclatura do TypeScript
- ✅ Conhecer a estrutura de arquivos e organização do código front-end e back-end
- ✅ Aprender a usar o sistema unificado de códigos de erro

## Conceito Central

O código gerado pelo AI App Factory deve seguir convenções de codificação unificadas para garantir qualidade consistente, manutenibilidade e facilidade de compreensão. Essas convenções abrangem formatação geral, sistema de tipos TypeScript, design de arquitetura front-end e back-end, estilo de comentários e mecanismos de tratamento de erros.

**Por que precisamos de padrões de código?**

- **Consistência**: Todo código gerado pelos Agents segue o mesmo estilo, reduzindo a curva de aprendizado
- **Manutenibilidade**: Nomenclatura e estrutura claras facilitam modificações futuras
- **Legibilidade**: Código padronizado permite que membros da equipe entendam rapidamente a intenção
- **Segurança**: Sistema de tipos rigoroso e tratamento de erros reduzem erros em tempo de execução

---

## 1. Convenções Gerais

### 1.1 Linguagem e Formatação

| Item | Convenção |
| --- | --- |
| Linguagem | TypeScript (modo estrito) |
| Indentação | 2 espaços |
| Fim de linha | LF (Unix) |
| Codificação | UTF-8 |
| Comprimento máximo de linha | 100 caracteres (código), 80 caracteres (comentários) |
| Ponto e vírgula | Obrigatório |
| Aspas | Aspas simples (strings), aspas duplas (atributos JSX) |

### 1.2 Convenções de Nomenclatura

| Tipo | Estilo | Exemplo |
| --- | --- | --- |
| Nome de arquivo (comum) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| Nome de arquivo (componente) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| Nome de arquivo (teste) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| Variável | camelCase | `userName`, `isLoading` |
| Função | camelCase | `getUserById`, `formatDate` |
| Classe/Interface/Tipo | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| Constante | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| Propriedade privada | Sem prefixo underscore | Use a palavra-chave `private` do TypeScript |
| Variável booleana | Prefixo is/has/can | `isActive`, `hasPermission`, `canEdit` |
| Manipulador de evento | Prefixo handle | `handleClick`, `handleSubmit` |
| Hook | Prefixo use | `useItems`, `useAuth` |

::: tip Dicas de Nomenclatura
Uma boa nomenclatura deve ser **autoexplicativa**, sem necessidade de comentários adicionais para explicar o propósito. Por exemplo, `isValid` é mais claro que `check`, e `getUserById` é mais específico que `getData`.
:::

### 1.3 Organização de Arquivos

**Cada arquivo com responsabilidade única**:
- Um componente por arquivo
- Um serviço por arquivo
- Tipos relacionados podem ficar no mesmo arquivo types.ts

**Ordem de importações**:
```typescript
// 1. Módulos nativos do Node.js
import path from 'path';

// 2. Dependências externas
import express from 'express';
import { z } from 'zod';

// 3. Módulos internos (caminho absoluto)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. Importações com caminho relativo
import { UserService } from './userService';
import type { User } from './types';
```

---

## 2. Convenções TypeScript

### 2.1 Definição de Tipos

**Prefira interface para definir tipos de objeto**:
```typescript
// ✅ Bom
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ Evite (exceto quando precisar de union types ou mapped types)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Defina tipos para todas as APIs públicas**:
```typescript
// ✅ Bom
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

// ❌ Evite
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 Asserção de Tipos

::: warning Proibido usar any
No código gerado é **absolutamente proibido** usar o tipo `any`. Deve-se usar `unknown` e adicionar type guards.
:::

**Evite usar `any`**:
```typescript
// ✅ Bom
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data é inferido como User
}

// ❌ Evite
const data: any = JSON.parse(text);
```

**Use type guards**:
```typescript
// ✅ Bom
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ Evite
const user = data as User; // asserção insegura
```

### 2.3 Generics

**Use nomes significativos para parâmetros genéricos**:
```typescript
// ✅ Bom
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ Evite
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## 3. Convenções Back-end

### 3.1 Rotas Express

**Use Router para organizar rotas**:
```typescript
// ✅ Bom
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

**Nomenclatura RESTful**:
```typescript
// ✅ Bom
GET    /api/items         // Lista
GET    /api/items/:id     // Detalhes
POST   /api/items         // Criar
PUT    /api/items/:id     // Atualizar
DELETE /api/items/:id     // Excluir

// ❌ Evite
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 Controllers

**Mantenha os controllers simples**:
```typescript
// ✅ Bom
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

### 3.3 Camada de Serviço

**Lógica de negócio na camada de serviço**:
```typescript
// ✅ Bom
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
      throw new AppError(404, 'Item não encontrado');
    }
    return item;
  },

  async create(data: CreateItemDto) {
    return prisma.item.create({ data });
  },
};
```

### 3.4 Tratamento de Erros

**Use uma classe de erro unificada**:
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

// Uso
throw new AppError(404, 'Item não encontrado');
throw new AppError(400, 'Validação falhou', errors);
```

**Middleware global de tratamento de erros**:
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

  // Ocultar erros internos em produção
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : error.message;

  res.status(500).json({
    success: false,
    error: { message },
  });
}
```

---

## 4. Convenções Front-end

### 4.1 Estrutura de Componentes

**Formato de componente funcional**:
```tsx
// ✅ Bom
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

### 4.2 Convenções de Hooks

**Hooks personalizados retornam objetos**:
```typescript
// ✅ Bom
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

### 4.3 Convenções de Estilos

**Use StyleSheet**:
```typescript
// ✅ Bom
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

// ❌ Evite estilos inline
<View style={{ flex: 1, padding: 16 }}>
```

**Use sistema de temas**:
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

### 4.4 Navegação

**Parâmetros de navegação com type safety**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Create: undefined;
};

// Uso
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: 1 });
```

---

## 5. Convenções Prisma

### 5.1 Definição de Schema

**Nomes de modelos em PascalCase singular**:
```prisma
// ✅ Bom
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

### 5.2 Convenções de Consulta

**Use select para limitar campos retornados**:
```typescript
// ✅ Bom (retorna apenas campos necessários)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Evite (retorna todos os campos incluindo informações sensíveis)
const users = await prisma.user.findMany();
```

---

## 6. Convenções de Comentários

### 6.1 Quando Adicionar Comentários

**Cenários que precisam de comentários**:
- Lógica de negócio complexa
- Decisões de design não óbvias
- Razões para otimização de desempenho
- Interfaces públicas de API

**Cenários que não precisam de comentários**:
- Código autoexplicativo
- Getters/setters simples
- Implementações óbvias

### 6.2 Formato de Comentários

```typescript
// ✅ Bom - explica o porquê
// Usa atualização otimista para melhorar UX, reverte em caso de falha
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // reverte
    throw new Error('Atualização falhou');
  }
};

// ❌ Evite - explica o quê (o código já diz)
// Define items
setItems(newItems);
```

::: tip Princípio de Comentários
Comentários devem explicar **por quê** e não **o quê**. Bom código deve ser autoexplicativo, comentários apenas complementam informações que não podem ser vistas diretamente no código.
:::

---

## 7. Convenções de Códigos de Erro

### 7.1 Estrutura do Código de Erro

**Definição do formato**:
```
[MÓDULO_NEGÓCIO]_[TIPO_ERRO]_[ERRO_ESPECÍFICO]

Exemplo: AUTH_VALIDATION_INVALID_EMAIL
```

**Convenções de nomenclatura**:
- **Maiúsculas**: Use SCREAMING_SNAKE_CASE
- **Módulo de negócio**: 2-4 caracteres, representa o módulo funcional (ex: AUTH, USER, ITEM)
- **Tipo de erro**: Tipo genérico de erro (ex: VALIDATION, NOT_FOUND, FORBIDDEN)
- **Erro específico**: Descrição detalhada (opcional)

### 7.2 Tipos de Erro Padrão

#### 1. Erros de Validação (VALIDATION)

**Código HTTP**: 400

| Código de Erro | Descrição | Cenário de Exemplo |
| --- | --- | --- |
| `[MODULE]_VALIDATION_REQUIRED` | Campo obrigatório ausente | Não forneceu title ao criar |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | Formato incorreto | Formato de email inválido |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | Fora do intervalo | amount < 0 ou > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | Valor duplicado | Email já existe |

**Exemplos**:
```typescript
AUTH_VALIDATION_REQUIRED       // Campo obrigatório ausente
AUTH_VALIDATION_INVALID_EMAIL  // Formato de email inválido
ITEM_VALIDATION_OUT_OF_RANGE   // Valor fora do intervalo
```

#### 2. Erros de Não Encontrado (NOT_FOUND)

**Código HTTP**: 404

| Código de Erro | Descrição | Cenário de Exemplo |
| --- | --- | --- |
| `[MODULE]_NOT_FOUND` | Recurso não existe | ID consultado não existe |
| `[MODULE]_ROUTE_NOT_FOUND` | Rota não existe | Acesso a endpoint não definido |

**Exemplos**:
```typescript
ITEM_NOT_FOUND   // Item ID não existe
USER_NOT_FOUND   // User ID não existe
```

#### 3. Erros de Permissão (FORBIDDEN / UNAUTHORIZED)

**Código HTTP**: 401 (não autenticado), 403 (sem permissão)

| Código de Erro | Descrição | Cenário de Exemplo |
| --- | --- | --- |
| `AUTH_UNAUTHORIZED` | Não logado ou Token inválido | JWT expirado |
| `[MODULE]_FORBIDDEN` | Sem permissão de acesso | Tentativa de acessar dados de outro usuário |

**Exemplos**:
```typescript
AUTH_UNAUTHORIZED     // Token expirado ou ausente
ITEM_FORBIDDEN        // Tentativa de excluir Item de outro usuário
```

#### 4. Erros de Conflito (CONFLICT)

**Código HTTP**: 409

| Código de Erro | Descrição | Cenário de Exemplo |
| --- | --- | --- |
| `[MODULE]_CONFLICT_DUPLICATE` | Conflito de recurso | Criar recurso já existente |
| `[MODULE]_CONFLICT_STATE` | Conflito de estado | Operação não compatível com estado atual |

**Exemplos**:
```typescript
USER_CONFLICT_DUPLICATE   // Email já registrado
ITEM_CONFLICT_STATE       // Projeto concluído não pode ser excluído
```

#### 5. Erros de Servidor (INTERNAL_ERROR)

**Código HTTP**: 500

| Código de Erro | Descrição | Cenário de Exemplo |
| --- | --- | --- |
| `INTERNAL_ERROR` | Erro interno desconhecido | Falha na conexão com banco de dados |
| `DATABASE_ERROR` | Erro de banco de dados | Falha na consulta Prisma |
| `EXTERNAL_SERVICE_ERROR` | Erro de serviço externo | Falha em API de terceiros |

**Exemplos**:
```typescript
INTERNAL_ERROR             // Erro genérico do servidor
DATABASE_ERROR             // Falha na operação do banco de dados
EXTERNAL_SERVICE_ERROR     // Falha na chamada de API de terceiros
```

#### 6. Erros de Rate Limit (RATE_LIMIT)

**Código HTTP**: 429

| Código de Erro | Descrição | Cenário de Exemplo |
| --- | --- | --- |
| `RATE_LIMIT_EXCEEDED` | Limite de frequência excedido | Mais de 100 requisições em 1 minuto |

### 7.3 Formato de Resposta de Erro

**Estrutura de resposta padrão**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Código de erro
    message: string;        // Mensagem amigável ao usuário
    details?: unknown;      // Detalhes (opcional, apenas em desenvolvimento)
    timestamp?: string;     // Timestamp (opcional)
    path?: string;          // Caminho da requisição (opcional)
  };
}
```

**Exemplos de resposta**:

**Erro de validação**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Campo obrigatório ausente: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**Erro de não encontrado**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Item com ID 123 não encontrado"
  }
}
```

**Erro de servidor**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Operação no banco de dados falhou, tente novamente mais tarde"
  }
}
```

### 7.4 Definição de Classes de Erro

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

// Erro de validação
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// Erro de não encontrado
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// Erro de permissão
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Acesso não autorizado') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// Erro de conflito
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// Erro de servidor
export class InternalError extends AppError {
  constructor(message: string = 'Erro interno do servidor') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 Constantes de Códigos de Erro

**`src/constants/error-codes.ts`**:
```typescript
// Códigos de erro do módulo de itens
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// Códigos de erro do módulo de usuários
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// Códigos de erro de autenticação
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 Exemplo de Uso

**Camada de Serviço**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `Item com ID ${id} não encontrado`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        'Campo obrigatório ausente: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        'O valor não pode ser negativo',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 Tratamento de Erros no Front-end

**Mapeamento de códigos de erro**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // Erros de item
  ITEM_NOT_FOUND: 'Item não existe',
  ITEM_VALIDATION_REQUIRED: 'Por favor, preencha os campos obrigatórios',
  ITEM_VALIDATION_INVALID_AMOUNT: 'O valor deve ser maior que 0',

  // Erros de usuário
  USER_NOT_FOUND: 'Usuário não existe',
  USER_CONFLICT_DUPLICATE: 'Este email já está registrado',
  USER_VALIDATION_INVALID_EMAIL: 'Formato de email inválido',

  // Erros de autenticação
  AUTH_UNAUTHORIZED: 'Por favor, faça login primeiro',

  // Erros genéricos
  INTERNAL_ERROR: 'Erro no servidor, tente novamente mais tarde',
  RATE_LIMIT_EXCEEDED: 'Muitas requisições, tente novamente mais tarde',

  // Erro padrão
  DEFAULT: 'Operação falhou, tente novamente mais tarde',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**Cliente API**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Interceptor de resposta
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // Retorna erro padronizado
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## 8. Práticas Proibidas

As seguintes práticas são **absolutamente proibidas** no código gerado:

1. **Usar tipo `any`** - Use `unknown` e adicione type guards
2. **Hardcode de informações sensíveis** - Use variáveis de ambiente
3. **Ignorar tratamento de erros** - Todas as operações async precisam de try-catch
4. **Usar `console.log` para debug** - Use logs estruturados
5. **Estilos inline** - Use StyleSheet
6. **Pular definição de tipos** - Todas as interfaces públicas precisam de tipos
7. **Usar `var`** - Use `const` ou `let`
8. **Usar `==`** - Use `===`
9. **Modificar parâmetros de função** - Crie novos objetos/arrays
10. **Aninhamento de if maior que 3 níveis** - Retorne antecipadamente ou divida em funções

---

## Perguntas Frequentes

### 1. Por que é proibido usar o tipo any?

::: warning Segurança de Tipos
O tipo `any` ignora a verificação de tipos do TypeScript, causando erros em tempo de execução. Usar `unknown` e adicionar type guards mantém a flexibilidade enquanto garante segurança de tipos.
:::

**Comparação de exemplos**:
```typescript
// ❌ Perigoso
function processData(data: any) {
  return data.value; // Se data não tiver propriedade value, só dará erro em runtime
}

// ✅ Seguro
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Formato de dados inválido');
}
```

### 2. Como compartilhar definições de códigos de erro entre front-end e back-end?

Pode ser compartilhado das seguintes formas:

1. **Compartilhamento de arquivos de tipos**: Exporte tipos de códigos de erro no projeto back-end, front-end obtém via API ou sincroniza manualmente
2. **Monorepo**: Front-end e back-end no mesmo repositório, pode referenciar diretamente
3. **OpenAPI/Swagger**: Defina códigos de erro na documentação da API, front-end gera tipos automaticamente

### 3. Como suportar múltiplos idiomas nos códigos de erro?

**Abordagem recomendada**:
```typescript
// Back-end: retorna código de erro e parâmetros
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// Front-end: mapeia código de erro para mensagem localizada
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  pt: { ITEM_VALIDATION_REQUIRED: 'Campo obrigatório ausente' },
};
```

### 4. Como debugar problemas relacionados a códigos de erro?

1. **Verifique logs do back-end**: Confirme se o código de erro está sendo lançado corretamente
2. **Verifique mapeamento no front-end**: Confirme se há entrada correspondente em `ERROR_MESSAGES`
3. **Use painel de rede**: Veja a resposta completa de erro da API
4. **Mostre details em desenvolvimento**: Em ambiente de desenvolvimento, informações detalhadas de erro são retornadas

---

## Resumo da Aula

Nesta aula, explicamos detalhadamente as convenções que o código gerado pelo AI App Factory deve seguir:

- ✅ **Convenções gerais**: Formatação de linguagem, convenções de nomenclatura, organização de arquivos
- ✅ **Convenções TypeScript**: Definição de tipos, asserção de tipos, generics
- ✅ **Convenções back-end**: Rotas Express, controllers, camada de serviço, tratamento de erros
- ✅ **Convenções front-end**: Estrutura de componentes, convenções de hooks, convenções de estilos, navegação
- ✅ **Convenções Prisma**: Definição de schema, convenções de consulta
- ✅ **Convenções de comentários**: Quando adicionar comentários, formato de comentários
- ✅ **Convenções de códigos de erro**: Estrutura de códigos de erro, tipos de erro padrão, formato de resposta de erro
- ✅ **Práticas proibidas**: 10 práticas absolutamente proibidas

Seguir essas convenções garante que o código gerado tenha qualidade consistente, seja manutenível e fácil de entender.

---

## Próxima Aula

> Na próxima aula aprenderemos **[Detalhes da Stack Tecnológica](../tech-stack/)**.
>
> Você aprenderá:
> - A stack tecnológica usada nos aplicativos gerados
> - A combinação Node.js + Express + Prisma + React Native
> - Características e melhores práticas de cada tecnologia

---

## Apêndice: Referência de Código Fonte

<details>
<summary><strong>Clique para expandir e ver localização do código fonte</strong></summary>

> Atualizado em: 2026-01-29

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Documentação de padrões de código | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| Convenções de códigos de erro | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**Convenções principais**:
- **Padrões de código**: Convenções gerais, convenções TypeScript, convenções back-end, convenções front-end, convenções Prisma, convenções de comentários, configuração ESLint, práticas proibidas
- **Convenções de códigos de erro**: Estrutura de códigos de erro, tipos de erro padrão (VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR, RATE_LIMIT), formato de resposta de erro, tratamento de erros front-end e back-end

**Configurações principais**:
- **ESLint back-end**: Regra `@typescript-eslint/no-explicit-any` definida como `error`
- **ESLint front-end**: Regra `@typescript-eslint/no-explicit-any` definida como `error`
- **Formato de código de erro**: `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **Estrutura de resposta de erro**: Contém `success`, `error.code`, `error.message`, `error.details`

</details>
