---
title: "Estándares de Código: Convenciones de TypeScript, Estructura de Archivos y Códigos de Error | Tutorial de AI App Factory"
sidebarTitle: "Estándares de Código"
subtitle: "Estándares de Código: Convenciones de TypeScript, Estructura de Archivos y Códigos de Error"
description: "Aprende los estándares de codificación TypeScript, estructura de archivos, requisitos de comentarios y sistema de códigos de error que el código generado por AI App Factory debe seguir. Este tutorial explica en detalle las normas generales, especificaciones de TypeScript, normas para backend y frontend, especificaciones de Prisma, normas de comentarios y el sistema unificado de códigos de error, ayudándote a comprender y mantener la calidad del código generado."
tags:
  - "Apéndice"
  - "Estándares de Código"
  - "TypeScript"
  - "Códigos de Error"
prerequisite:
  - "start-init-project"
order: 230
---

# Estándares de Código: Convenciones de TypeScript, Estructura de Archivos y Códigos de Error

## Lo que aprenderás

- ✅ Comprender los estándares de codificación que debe seguir el código generado por AI App Factory
- ✅ Dominar los tipos de TypeScript y las convenciones de nomenclatura
- ✅ Conocer la estructura de archivos y la organización del código de backend y frontend
- ✅ Aprender a utilizar el sistema unificado de códigos de error

## Idea clave

El código generado por AI App Factory debe seguir estándares de codificación unificados para garantizar que la calidad del código sea consistente, mantenible y fácil de entender. Estos estándares cubren el formato general, el sistema de tipos de TypeScript, el diseño de la arquitectura de backend y frontend, el estilo de comentarios y el mecanismo de manejo de errores.

**¿Por qué necesitamos estándares de código?**

- **Consistencia**: El estilo del código generado por todos los Agentes es uniforme, reduciendo el costo de aprendizaje
- **Mantenibilidad**: Nombres y estructuras claros facilitan las modificaciones posteriores
- **Legibilidad**: El código estandarizado permite a los miembros del equipo comprender rápidamente la intención
- **Seguridad**: Un sistema de tipos estricto y el manejo de errores reducen los errores en tiempo de ejecución

---

## I. Normas Generales

### 1.1 Idioma y formato

| Proyecto | Norma |
|----------|-------|
| Idioma | TypeScript (modo estricto) |
| Sangría | 2 espacios |
| Final de línea | LF (Unix) |
| Codificación | UTF-8 |
| Longitud máxima de línea | 100 caracteres (código), 80 caracteres (comentarios) |
| Punto y coma | Obligatorio |
| Comillas | Comillas simples (cadenas), comillas dobles (atributos JSX) |

### 1.2 Normas de nomenclatura

| Tipo | Estilo | Ejemplo |
|------|--------|---------|
| Nombre de archivo (normal) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| Nombre de archivo (componente) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| Nombre de archivo (prueba) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| Variable | camelCase | `userName`, `isLoading` |
| Función | camelCase | `getUserById`, `formatDate` |
| Clase/interfaz/tipo | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| Constante | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| Propiedad privada | Sin prefijo de guion bajo | Usar la palabra clave private de TypeScript |
| Variable booleana | Prefijo is/has/can | `isActive`, `hasPermission`, `canEdit` |
| Manejador de eventos | Prefijo handle | `handleClick`, `handleSubmit` |
| Hook | Prefijo use | `useItems`, `useAuth` |

::: tip Consejos de nomenclatura
Un buen nombre debe ser **autoexplicativo**, sin necesidad de comentarios adicionales para explicar su propósito. Por ejemplo, `isValid` es más claro que `check`, y `getUserById` es más específico que `getData`.
:::

### 1.3 Organización de archivos

**Responsabilidad única de cada archivo**:
- Un componente por archivo
- Un servicio por archivo
- Los tipos relacionados pueden colocarse en el mismo archivo types.ts

**Orden de importación**:
```typescript
// 1. Módulos integrados de Node.js
import path from 'path';

// 2. Dependencias externas
import express from 'express';
import { z } from 'zod';

// 3. Módulos internos (rutas absolutas)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. Importaciones relativas
import { UserService } from './userService';
import type { User } from './types';
```

---

## II. Normas de TypeScript

### 2.1 Definición de tipos

**Priorizar el uso de interface para definir tipos de objetos**:
```typescript
// ✅ Bueno
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ Evitar (a menos que necesite tipos unión o tipos mapeados)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Definir tipos para todas las API públicas**:
```typescript
// ✅ Bueno
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

// ❌ Evitar
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 Aserciones de tipos

::: warning Prohibido usar any
En el código generado **está absolutamente prohibido** usar el tipo `any`. Se debe usar `unknown` y agregar guards de tipo.
:::

**Evitar el uso de `any`**:
```typescript
// ✅ Bueno
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data se infiere como User
}

// ❌ Evitar
const data: any = JSON.parse(text);
```

**Usar guards de tipo**:
```typescript
// ✅ Bueno
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ Evitar
const user = data as User; // Aserción insegura
```

### 2.3 Genéricos

**Usar nombres significativos para los parámetros genéricos**:
```typescript
// ✅ Bueno
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ Evitar
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## III. Normas de Backend

### 3.1 Rutas de Express

**Usar Router para organizar rutas**:
```typescript
// ✅ Bueno
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
// ✅ Bueno
GET    /api/items         // Lista
GET    /api/items/:id     // Detalles
POST   /api/items         // Crear
PUT    /api/items/:id     // Actualizar
DELETE /api/items/:id     // Eliminar

// ❌ Evitar
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 Controladores

**Mantener los controladores simples**:
```typescript
// ✅ Bueno
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

### 3.3 Capa de servicios

**La lógica de negocio debe estar en la capa de servicios**:
```typescript
// ✅ Bueno
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

### 3.4 Manejo de errores

**Usar una clase de error unificada**:
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
throw new AppError(404, 'Item not found');
throw new AppError(400, 'Validation failed', errors);
```

**Middleware de manejo global de errores**:
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

  // En producción ocultar errores internos
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

## IV. Normas de Frontend

### 4.1 Estructura de componentes

**Formato de componentes funcionales**:
```tsx
// ✅ Bueno
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

### 4.2 Normas de Hooks

**Los Hooks personalizados devuelven objetos**:
```typescript
// ✅ Bueno
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

### 4.3 Normas de estilo

**Usar StyleSheet**:
```typescript
// ✅ Bueno
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

// ❌ Evitar estilos en línea
<View style={{ flex: 1, padding: 16 }}>
```

**Usar sistema de temas**:
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

### 4.4 Navegación

**Parámetros de navegación con tipo seguro**:
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

## V. Normas de Prisma

### 5.1 Definición de Schema

**Nombres de modelos en PascalCase singular**:
```prisma
// ✅ Bueno
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

### 5.2 Normas de consulta

**Usar select para limitar los campos devueltos**:
```typescript
// ✅ Bueno (solo devuelve los campos necesarios)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Evitar (devuelve todos los campos, incluida información sensible)
const users = await prisma.user.findMany();
```

---

## VI. Normas de comentarios

### 6.1 Cuándo agregar comentarios

**Escenarios que requieren comentarios**:
- Lógica de negocio compleja
- Decisiones de diseño no obvias
- Razones de optimización de rendimiento
- Interfaces públicas de API

**Escenarios que no requieren comentarios**:
- Código autoexplicativo
- Getters/setters simples
- Implementaciones obvias

### 6.2 Formato de comentarios

```typescript
// ✅ Bueno - explica por qué
// Usar actualización optimista para mejorar la experiencia del usuario, revertir si falla
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // Revertir
    throw new Error('Update failed');
  }
};

// ❌ Evitar - explica qué (el código ya lo dice)
// Establecer items
setItems(newItems);
```

::: tip Principio de comentarios
Los comentarios deben explicar **por qué**, no **qué**. El buen código debe ser autoexplicativo; los comentarios solo complementan información que no se puede ver directamente en el código.
:::

---

## VII. Normas de códigos de error

### 7.1 Estructura del código de error

**Definición de formato**:
```
[MODULE_ERROR]_[ERROR_TYPE]_[SPECIFIC_ERROR]

Ejemplo: AUTH_VALIDATION_INVALID_EMAIL
```

**Normas de nomenclatura**:
- **Todo en mayúsculas**: Usar SCREAMING_SNAKE_CASE
- **Módulo de negocio**: 2-4 caracteres, que representa el módulo funcional (como AUTH, USER, ITEM)
- **Tipo de error**: Tipos de error comunes (como VALIDATION, NOT_FOUND, FORBIDDEN)
- **Error específico**: Descripción detallada (opcional)

### 7.2 Tipos de error estándar

#### 1. Errores de validación (VALIDATION)

**Código de estado HTTP**: 400

| Código de error | Descripción | Escenario de ejemplo |
|-----------------|-------------|---------------------|
| `[MODULE]_VALIDATION_REQUIRED` | Falta campo obligatorio | No se proporcionó title al crear |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | Formato incorrecto | Formato de email incorrecto |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | Fuera de rango | amount < 0 o > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | Valor duplicado | El email ya existe |

**Ejemplos**:
```typescript
AUTH_VALIDATION_REQUIRED       // Falta campo obligatorio
AUTH_VALIDATION_INVALID_EMAIL  // Formato de email incorrecto
ITEM_VALIDATION_OUT_OF_RANGE   // Monto fuera de rango
```

#### 2. Errores de no encontrado (NOT_FOUND)

**Código de estado HTTP**: 404

| Código de error | Descripción | Escenario de ejemplo |
|-----------------|-------------|---------------------|
| `[MODULE]_NOT_FOUND` | El recurso no existe | El ID consultado no existe |
| `[MODULE]_ROUTE_NOT_FOUND` | La ruta no existe | Acceder a un endpoint no definido |

**Ejemplos**:
```typescript
ITEM_NOT_FOUND   // El ID del Item no existe
USER_NOT_FOUND   // El ID del User no existe
```

#### 3. Errores de permiso (FORBIDDEN / UNAUTHORIZED)

**Código de estado HTTP**: 401 (no autenticado), 403 (sin permiso)

| Código de error | Descripción | Escenario de ejemplo |
|-----------------|-------------|---------------------|
| `AUTH_UNAUTHORIZED` | No iniciado sesión o Token inválido | JWT expirado |
| `[MODULE]_FORBIDDEN` | Sin permiso de acceso | Intentar acceder a datos de otros |

**Ejemplos**:
```typescript
AUTH_UNAUTHORIZED     // Token expirado o ausente
ITEM_FORBIDDEN        // Intentar eliminar Item de otro usuario
```

#### 4. Errores de conflicto (CONFLICT)

**Código de estado HTTP**: 409

| Código de error | Descripción | Escenario de ejemplo |
|-----------------|-------------|---------------------|
| `[MODULE]_CONFLICT_DUPLICATE` | Conflicto de recursos | Crear un recurso ya existente |
| `[MODULE]_CONFLICT_STATE` | Conflicto de estado | La operación no coincide con el estado actual |

**Ejemplos**:
```typescript
USER_CONFLICT_DUPLICATE   // El email ya está registrado
ITEM_CONFLICT_STATE       // No se puede eliminar un proyecto completado
```

#### 5. Errores de servidor (INTERNAL_ERROR)

**Código de estado HTTP**: 500

| Código de error | Descripción | Escenario de ejemplo |
|-----------------|-------------|---------------------|
| `INTERNAL_ERROR` | Error interno desconocido | Fallo en la conexión a la base de datos |
| `DATABASE_ERROR` | Error de base de datos | Fallo en la consulta de Prisma |
| `EXTERNAL_SERVICE_ERROR` | Error de servicio externo | Fallo de API de terceros |

**Ejemplos**:
```typescript
INTERNAL_ERROR             // Error de servidor genérico
DATABASE_ERROR             // Fallo en la operación de base de datos
EXTERNAL_SERVICE_ERROR     // Fallo en la llamada a API de terceros
```

#### 6. Errores de límite de velocidad (RATE_LIMIT)

**Código de estado HTTP**: 429

| Código de error | Descripción | Escenario de ejemplo |
|-----------------|-------------|---------------------|
| `RATE_LIMIT_EXCEEDED` | Excedido el límite de frecuencia de solicitudes | Más de 100 solicitudes en 1 minuto |

### 7.3 Formato de respuesta de error

**Estructura de respuesta estándar**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Código de error
    message: string;        // Mensaje de error amigable para el usuario
    details?: unknown;      // Información detallada (opcional, solo en desarrollo)
    timestamp?: string;     // Marca de tiempo (opcional)
    path?: string;          // Ruta de solicitud (opcional)
  };
}
```

**Ejemplos de respuesta**:

**Error de validación**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Falta campo obligatorio: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**Error de no encontrado**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "No se encontró el elemento con ID 123"
  }
}
```

**Error de servidor**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Error en la operación de base de datos, por favor intente más tarde"
  }
}
```

### 7.4 Definición de clases de error

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

// Error de validación
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// Error de no encontrado
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// Error de permiso
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Acceso no autorizado') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// Error de conflicto
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// Error de servidor
export class InternalError extends AppError {
  constructor(message: string = 'Error interno del servidor') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 Constantes de códigos de error

**`src/constants/error-codes.ts`**:
```typescript
// Códigos de error del módulo Item
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// Códigos de error del módulo User
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// Códigos de error de autenticación
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 Ejemplos de uso

**Capa de servicio**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `No se encontró el elemento con ID ${id}`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        'Falta campo obligatorio: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        'El monto no puede ser negativo',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 Manejo de errores en el frontend

**Mapeo de códigos de error**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // Errores de Item
  ITEM_NOT_FOUND: 'El elemento no existe',
  ITEM_VALIDATION_REQUIRED: 'Por favor complete los campos obligatorios',
  ITEM_VALIDATION_INVALID_AMOUNT: 'El monto debe ser mayor que 0',

  // Errores de User
  USER_NOT_FOUND: 'El usuario no existe',
  USER_CONFLICT_DUPLICATE: 'El email ya está registrado',
  USER_VALIDATION_INVALID_EMAIL: 'Formato de email incorrecto',

  // Errores de autenticación
  AUTH_UNAUTHORIZED: 'Por favor inicie sesión primero',

  // Errores generales
  INTERNAL_ERROR: 'Error del servidor, por favor intente más tarde',
  RATE_LIMIT_EXCEEDED: 'Demasiadas solicitudes, por favor intente más tarde',

  // Error predeterminado
  DEFAULT: 'Operación fallida, por favor intente más tarde',
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

// Interceptor de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // Devolver error estandarizado
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## VIII. Prohibiciones

Las siguientes prácticas están **absolutamente prohibidas** en el código generado:

1. **Usar el tipo `any`** - Usar `unknown` y agregar guards de tipo
2. **Codificar información sensible** - Usar variables de entorno
3. **Ignorar el manejo de errores** - Todas las operaciones async necesitan try-catch
4. **Usar `console.log` para depuración** - Usar registros estructurados
5. **Estilos en línea** - Usar StyleSheet
6. **Omitir definiciones de tipo** - Todas las interfaces públicas necesitan tipos
7. **Usar `var`** - Usar `const` o `let`
8. **Usar `==`** - Usar `===`
9. **Modificar parámetros de función** - Crear nuevos objetos/arreglos
10. **Anidación de if superior a 3 niveles** - Retorno anticipado o dividir función

---

## Preguntas frecuentes

### 1. ¿Por qué está prohibido usar el tipo any?

::: warning Seguridad de tipos
El tipo `any` omite la verificación de tipos de TypeScript, lo que conduce a errores en tiempo de ejecución. Usar `unknown` y agregar guards de tipo asegura la seguridad de tipos mientras se mantiene la flexibilidad.
:::

**Comparación de ejemplos**:
```typescript
// ❌ Peligroso
function processData(data: any) {
  return data.value; // Si data no tiene la propiedad value, el error ocurrirá en tiempo de ejecución
}

// ✅ Seguro
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### 2. ¿Cómo compartir las definiciones de códigos de error entre frontend y backend?

Se puede compartir de las siguientes maneras:

1. **Compartir archivos de tipos**: Exportar tipos de códigos de error en el proyecto backend, el frontend los obtiene a través de la API o sincroniza manualmente
2. **Monorepo**: Frontend y backend en el mismo repositorio, se pueden importar directamente
3. **OpenAPI/Swagger**: Definir códigos de error en la documentación de API, el frontend genera automáticamente los tipos

### 3. ¿Cómo hacer que los códigos de error admitan varios idiomas?

**Enfoque recomendado**:
```typescript
// Backend: devuelve código de error y parámetros
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// Frontend: mapear código de error a mensajes localizados
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  es: { ITEM_VALIDATION_REQUIRED: 'Falta campo obligatorio' },
};
```

### 4. ¿Cómo depurar problemas relacionados con códigos de error?

1. **Ver los registros del backend**: Confirmar si el código de error se lanzó correctamente
2. **Verificar el mapeo del frontend**: Confirmar si hay una entrada correspondiente en `ERROR_MESSAGES`
3. **Usar el panel de red**: Ver la respuesta de error completa devuelta por la API
4. **Mostrar detalles en desarrollo**: En el entorno de desarrollo se devuelve información detallada del error

---

## Resumen de la lección

En esta lección explicamos en detalle las normas que debe seguir el código generado por AI App Factory:

- ✅ **Normas generales**: Formato de idioma, normas de nomenclatura, organización de archivos
- ✅ **Normas de TypeScript**: Definición de tipos, aserciones de tipos, genéricos
- ✅ **Normas de backend**: Rutas de Express, controladores, capa de servicios, manejo de errores
- ✅ **Normas de frontend**: Estructura de componentes, normas de Hooks, normas de estilo, navegación
- ✅ **Normas de Prisma**: Definición de Schema, normas de consulta
- ✅ **Normas de comentarios**: Cuándo agregar comentarios, formato de comentarios
- ✅ **Normas de códigos de error**: Estructura de códigos de error, tipos de error estándar, formato de respuesta de error
- ✅ **Prohibiciones**: 10 prácticas absolutamente prohibidas

Seguir estas normas garantiza que el código generado sea consistente en calidad, mantenible y fácil de entender.

---

## Próxima lección

> En la próxima lección aprenderemos **[Detalles de la pila tecnológica](../tech-stack/)**.
>
> Aprenderás:
> - La pila tecnológica utilizada por las aplicaciones generadas
> - La combinación de Node.js + Express + Prisma + React Native
> - Características y mejores prácticas de cada pila tecnológica

---

## Apéndice: Referencia del código fuente

<details>
<summary><strong>Haz clic para expandir y ver la ubicación del código fuente</strong></summary>

> Fecha de actualización: 2026-01-29

| Función | Ruta de archivo | Número de línea |
|---------|-----------------|-----------------|
| Documento de estándares de código | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| Normas de códigos de error | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**Normas clave**:
- **Estándares de código**: Normas generales, normas de TypeScript, normas de backend, normas de frontend, normas de Prisma, normas de comentarios, configuración de ESLint, prohibiciones
- **Normas de códigos de error**: Estructura de códigos de error, tipos de error estándar (VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR, RATE_LIMIT), formato de respuesta de error, manejo de errores de frontend y backend

**Configuraciones clave**:
- **ESLint de backend**: La regla `@typescript-eslint/no-explicit-any` está configurada como `error`
- **ESLint de frontend**: La regla `@typescript-eslint/no-explicit-any` está configurada como `error`
- **Formato de código de error**: `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **Estructura de respuesta de error**: Incluye `success`, `error.code`, `error.message`, `error.details`

</details>
