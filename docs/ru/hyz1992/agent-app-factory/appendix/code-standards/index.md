---
title: "Стандарты кода: TypeScript, структура файлов и коды ошибок | AI App Factory"
sidebarTitle: "Стандарты кода"
subtitle: "Стандарты кода: TypeScript, структура файлов и коды ошибок"
description: "Изучите стандарты кодирования TypeScript, структуру файлов, требования к комментариям и систему кодов ошибок, которым должен следовать код, генерируемый AI App Factory. Этот учебник подробно объясняет общие стандарты, стандарты TypeScript, стандарты frontend и backend, стандарты Prisma, стандарты комментариев и унифицированную систему кодов ошибок, помогая вам понять и поддерживать качество генерируемого кода."
tags:
  - "Приложение"
  - "Стандарты кода"
  - "TypeScript"
  - "Коды ошибок"
prerequisite:
  - "start-init-project"
order: 230
---

# Стандарты кода: TypeScript, структура файлов и коды ошибок

## Что вы узнаете

- ✅ Поймете, каким стандартам кодирования должен следовать код, генерируемый AI App Factory
- ✅ Освоите типы TypeScript и соглашения об именовании
- ✅ Узнаете о структуре файлов и организации кода frontend и backend
- ✅ Научитесь использовать унифицированную систему кодов ошибок

## Основная идея

Код, генерируемый AI App Factory, должен следовать единым стандартам кодирования, обеспечивая согласованное качество кода, удобство сопровождения и легкость понимания. Эти стандарты охватывают общее форматирование, систему типов TypeScript, архитектурный дизайн frontend и backend, стиль комментариев и механизмы обработки ошибок.

**Зачем нужны стандарты кода?**

- **Согласованность**: Весь код, генерируемый агентами, имеет единый стиль, что снижает затраты на обучение
- **Удобство сопровождения**: Четкие имена и структура облегчают последующие изменения
- **Читаемость**: Стандартизированный код позволяет членам команды быстро понять намерения
- **Безопасность**: Строгая система типов и обработка ошибок снижают количество ошибок времени выполнения

---

## 1. Общие стандарты

### 1.1 Язык и формат

| Параметр | Стандарт |
| --- | --- |
| Язык | TypeScript (строгий режим) |
| Отступы | 2 пробела |
| Конец строки | LF (Unix) |
| Кодировка | UTF-8 |
| Максимальная длина строки | 100 символов (код), 80 символов (комментарии) |
| Точка с запятой | Обязательна |
| Кавычки | Одинарные (строки), двойные (атрибуты JSX) |

### 1.2 Соглашения об именовании

| Тип | Стиль | Примеры |
| --- | --- | --- |
| Имя файла (обычное) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| Имя файла (компонент) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| Имя файла (тест) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| Переменные | camelCase | `userName`, `isLoading` |
| Функции | camelCase | `getUserById`, `formatDate` |
| Классы/Интерфейсы/Типы | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| Константы | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| Приватные свойства | Без префикса подчеркивания | Используйте ключевое слово private TypeScript |
| Булевы переменные | Префикс is/has/can | `isActive`, `hasPermission`, `canEdit` |
| Обработчики событий | Префикс handle | `handleClick`, `handleSubmit` |
| Хуки | Префикс use | `useItems`, `useAuth` |

::: tip Совет по именованию
Хорошее имя должно быть **самодокументируемым**, не требуя дополнительных комментариев. Например, `isValid` понятнее, чем `check`, а `getUserById` конкретнее, чем `getData`.
:::

### 1.3 Организация файлов

**Принцип единственной ответственности для каждого файла**:
- Один компонент — один файл
- Один сервис — один файл
- Связанные типы можно помещать в один файл types.ts

**Порядок импортов**:
```typescript
// 1. Встроенные модули Node.js
import path from 'path';

// 2. Внешние зависимости
import express from 'express';
import { z } from 'zod';

// 3. Внутренние модули (абсолютные пути)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. Относительные импорты
import { UserService } from './userService';
import type { User } from './types';
```

---

## 2. Стандарты TypeScript

### 2.1 Определение типов

**Предпочитайте interface для определения объектных типов**:
```typescript
// ✅ Хорошо
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ Избегайте (если только не нужны объединенные или отображаемые типы)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Определяйте типы для всех публичных API**:
```typescript
// ✅ Хорошо
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

// ❌ Избегайте
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 Утверждения типов

::: warning Запрещено использование any
В генерируемом коде **абсолютно запрещено** использовать тип `any`, вместо этого используйте `unknown` и добавляйте защиту типов.
:::

**Избегайте использования `any`**:
```typescript
// ✅ Хорошо
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data выводится как User
}

// ❌ Избегайте
const data: any = JSON.parse(text);
```

**Используйте защиту типов**:
```typescript
// ✅ Хорошо
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ Избегайте
const user = data as User; // небезопасное утверждение
```

### 2.3 Обобщения (Generics)

**Используйте осмысленные имена для параметров обобщений**:
```typescript
// ✅ Хорошо
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ Избегайте
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## 3. Стандарты backend

### 3.1 Маршруты Express

**Используйте Router для организации маршрутов**:
```typescript
// ✅ Хорошо
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

**RESTful именование**:
```typescript
// ✅ Хорошо
GET /api/items       // Список
GET /api/items/:id   // Детали
POST /api/items      // Создание
PUT /api/items/:id   // Обновление
DELETE /api/items/:id // Удаление

// ❌ Избегайте
GET /api/getItems
POST /api/createItem
POST /api/items/delete/:id
```

### 3.2 Контроллеры

**Держите контроллеры простыми**:
```typescript
// ✅ Хорошо
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

### 3.3 Слой сервисов

**Бизнес-логика в слое сервисов**:
```typescript
// ✅ Хорошо
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

### 3.4 Обработка ошибок

**Используйте единый класс ошибок**:
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

// Использование
throw new AppError(404, 'Item not found');
throw new AppError(400, 'Validation failed', errors);
```

**Глобальный middleware обработки ошибок**:
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

  // В production скрываем внутренние ошибки
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

## 4. Стандарты frontend

### 4.1 Структура компонентов

**Формат функциональных компонентов**:
```tsx
// ✅ Хорошо
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

### 4.2 Стандарты хуков

**Пользовательские хуки возвращают объект**:
```typescript
// ✅ Хорошо
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

### 4.3 Стандарты стилей

**Используйте StyleSheet**:
```typescript
// ✅ Хорошо
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

// ❌ Избегайте встроенных стилей
<View style={{ flex: 1, padding: 16 }}>
```

**Используйте систему тем**:
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

### 4.4 Навигация

**Типобезопасные параметры навигации**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Create: undefined;
};

// Использование
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: 1 });
```

---

## 5. Стандарты Prisma

### 5.1 Определение схемы

**Именование моделей в PascalCase единственном числе**:
```prisma
// ✅ Хорошо
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5.2 Стандарты запросов

**Используйте select для ограничения возвращаемых полей**:
```typescript
// ✅ Хорошо (возвращаем только нужные поля)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Избегайте (возвращаем все поля включая конфиденциальные)
const users = await prisma.user.findMany();
```

---

## 6. Стандарты комментариев

### 6.1 Когда добавлять комментарии

**Сценарии, требующие комментариев**:
- Сложная бизнес-логика
- Неочевидные проектные решения
- Причины оптимизации производительности
- Публичные интерфейсы API

**Сценарии, не требующие комментариев**:
- Самодокументируемый код
- Простые getter/setter
- Очевидные реализации

### 6.2 Формат комментариев

```typescript
// ✅ Хорошо - объясняем почему
// Используем оптимистичное обновление для улучшения UX, откатываем при ошибке
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // откат
    throw new Error('Update failed');
  }
};

// ❌ Избегайте - объясняем что (код уже говорит сам за себя)
// Устанавливаем items
setItems(newItems);
```

::: tip Принцип комментирования
Комментарии должны объяснять **почему**, а не **что**. Хороший код должен быть самодокументируемым, комментарии дополняют только ту информацию, которую нельзя понять непосредственно из кода.
:::

---

## 7. Стандарты кодов ошибок

### 7.1 Структура кода ошибки

**Формат определения**:
```
[БИЗНЕС_МОДУЛЬ]_[ТИП_ОШИБКИ]_[КОНКРЕТНАЯ_ОШИБКА]

Пример: AUTH_VALIDATION_INVALID_EMAIL
```

**Соглашения об именовании**:
- **Все заглавные**: используйте SCREAMING_SNAKE_CASE
- **Бизнес-модуль**: 2-4 символа, обозначающие функциональный модуль (например, AUTH, USER, ITEM)
- **Тип ошибки**: общие типы ошибок (например, VALIDATION, NOT_FOUND, FORBIDDEN)
- **Конкретная ошибка**: подробное описание (опционально)

### 7.2 Стандартные типы ошибок

#### 1. Ошибки валидации (VALIDATION)

**HTTP код**: 400

| Код ошибки | Описание | Пример сценария |
| --- | --- | --- |
| `[MODULE]_VALIDATION_REQUIRED` | Отсутствует обязательное поле | Создание без указания title |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | Некорректный формат | Неправильный формат email |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | Вне диапазона | amount < 0 или > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | Дублирующееся значение | Email уже существует |

**Примеры**:
```typescript
AUTH_VALIDATION_REQUIRED       // Отсутствует обязательное поле
AUTH_VALIDATION_INVALID_EMAIL  // Некорректный формат email
ITEM_VALIDATION_OUT_OF_RANGE   // Сумма вне диапазона
```

#### 2. Ошибки "не найдено" (NOT_FOUND)

**HTTP код**: 404

| Код ошибки | Описание | Пример сценария |
| --- | --- | --- |
| `[MODULE]_NOT_FOUND` | Ресурс не существует | Запрошенный ID не найден |
| `[MODULE]_ROUTE_NOT_FOUND` | Маршрут не существует | Доступ к неопределенному endpoint |

**Примеры**:
```typescript
ITEM_NOT_FOUND   // Item ID не существует
USER_NOT_FOUND   // User ID не существует
```

#### 3. Ошибки доступа (FORBIDDEN / UNAUTHORIZED)

**HTTP код**: 401 (не аутентифицирован), 403 (нет прав)

| Код ошибки | Описание | Пример сценария |
| --- | --- | --- |
| `AUTH_UNAUTHORIZED` | Не вошел в систему или невалидный токен | JWT истек |
| `[MODULE]_FORBIDDEN` | Нет прав доступа | Попытка доступа к чужим данным |

**Примеры**:
```typescript
AUTH_UNAUTHORIZED  // Токен истек или отсутствует
ITEM_FORBIDDEN     // Попытка удалить чужой Item
```

#### 4. Ошибки конфликта (CONFLICT)

**HTTP код**: 409

| Код ошибки | Описание | Пример сценария |
| --- | --- | --- |
| `[MODULE]_CONFLICT_DUPLICATE` | Конфликт ресурсов | Создание существующего ресурса |
| `[MODULE]_CONFLICT_STATE` | Конфликт состояния | Операция не соответствует текущему состоянию |

**Примеры**:
```typescript
USER_CONFLICT_DUPLICATE  // Email уже зарегистрирован
ITEM_CONFLICT_STATE      // Завершенный проект нельзя удалить
```

#### 5. Ошибки сервера (INTERNAL_ERROR)

**HTTP код**: 500

| Код ошибки | Описание | Пример сценария |
| --- | --- | --- |
| `INTERNAL_ERROR` | Неизвестная внутренняя ошибка | Ошибка подключения к базе данных |
| `DATABASE_ERROR` | Ошибка базы данных | Ошибка запроса Prisma |
| `EXTERNAL_SERVICE_ERROR` | Ошибка внешнего сервиса | Ошибка стороннего API |

**Примеры**:
```typescript
INTERNAL_ERROR           // Общая ошибка сервера
DATABASE_ERROR           // Ошибка операции с базой данных
EXTERNAL_SERVICE_ERROR   // Ошибка вызова стороннего API
```

#### 6. Ошибки ограничения частоты (RATE_LIMIT)

**HTTP код**: 429

| Код ошибки | Описание | Пример сценария |
| --- | --- | --- |
| `RATE_LIMIT_EXCEEDED` | Превышен лимит запросов | Более 100 запросов за минуту |

### 7.3 Формат ответа об ошибке

**Стандартная структура ответа**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;        // Код ошибки
    message: string;     // Понятное пользователю сообщение об ошибке
    details?: unknown;   // Подробная информация (опционально, только в dev)
    timestamp?: string;  // Временная метка (опционально)
    path?: string;       // Путь запроса (опционально)
  };
}
```

**Примеры ответов**:

**Ошибка валидации**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Отсутствует обязательное поле: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**Ошибка "не найдено"**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Проект с ID 123 не найден"
  }
}
```

**Ошибка сервера**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Ошибка операции с базой данных, попробуйте позже"
  }
}
```

### 7.4 Определение классов ошибок

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

// Ошибка валидации
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// Ошибка "не найдено"
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// Ошибка доступа
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Неавторизованный доступ') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// Ошибка конфликта
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// Ошибка сервера
export class InternalError extends AppError {
  constructor(message: string = 'Внутренняя ошибка сервера') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 Константы кодов ошибок

**`src/constants/error-codes.ts`**:
```typescript
// Коды ошибок модуля проектов
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// Коды ошибок модуля пользователей
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// Коды ошибок аутентификации
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 Примеры использования

**Слой сервисов**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `Проект с ID ${id} не найден`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        'Отсутствует обязательное поле: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        'Сумма не может быть отрицательной',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 Обработка ошибок на frontend

**Сопоставление кодов ошибок**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // Ошибки проектов
  ITEM_NOT_FOUND: 'Проект не существует',
  ITEM_VALIDATION_REQUIRED: 'Пожалуйста, заполните обязательные поля',
  ITEM_VALIDATION_INVALID_AMOUNT: 'Сумма должна быть больше 0',

  // Ошибки пользователей
  USER_NOT_FOUND: 'Пользователь не существует',
  USER_CONFLICT_DUPLICATE: 'Этот email уже зарегистрирован',
  USER_VALIDATION_INVALID_EMAIL: 'Некорректный формат email',

  // Ошибки аутентификации
  AUTH_UNAUTHORIZED: 'Пожалуйста, войдите в систему',

  // Общие ошибки
  INTERNAL_ERROR: 'Ошибка сервера, попробуйте позже',
  RATE_LIMIT_EXCEEDED: 'Слишком много запросов, попробуйте позже',

  // Ошибка по умолчанию
  DEFAULT: 'Операция не удалась, попробуйте позже',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**API клиент**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Перехватчик ответов
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // Возвращаем стандартизированную ошибку
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## 8. Запрещенные практики

Следующие практики **абсолютно запрещены** в генерируемом коде:

1. **Использование типа `any`** — используйте `unknown` и добавляйте защиту типов
2. **Хардкод конфиденциальной информации** — используйте переменные окружения
3. **Игнорирование обработки ошибок** — все async операции требуют try-catch
4. **Использование `console.log` для отладки** — используйте структурированное логирование
5. **Встроенные стили** — используйте StyleSheet
6. **Пропуск определения типов** — все публичные интерфейсы требуют типов
7. **Использование `var`** — используйте `const` или `let`
8. **Использование `==`** — используйте `===`
9. **Изменение параметров функций** — создавайте новые объекты/массивы
10. **Вложенность if более 3 уровней** — используйте ранний возврат или разбивайте функции

---

## Часто задаваемые вопросы

### 1. Почему запрещено использовать тип any?

::: warning Безопасность типов
Тип `any` обходит проверку типов TypeScript, что приводит к ошибкам времени выполнения. Использование `unknown` с защитой типов обеспечивает безопасность типов при сохранении гибкости.
:::

**Сравнение примеров**:
```typescript
// ❌ Опасно
function processData(data: any) {
  return data.value; // Если у data нет свойства value, ошибка произойдет во время выполнения
}

// ✅ Безопасно
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data format');
}
```

### 2. Как frontend и backend могут совместно использовать определения кодов ошибок?

Можно использовать следующие подходы:

1. **Совместное использование файлов типов**: Экспортируйте типы кодов ошибок в backend проекте, frontend получает их через API или синхронизирует вручную
2. **Monorepo**: Frontend и backend в одном репозитории, можно напрямую импортировать
3. **OpenAPI/Swagger**: Определяйте коды ошибок в документации API, frontend автоматически генерирует типы

### 3. Как коды ошибок поддерживают мультиязычность?

**Рекомендуемый подход**:
```typescript
// Backend: возвращаем код ошибки и параметры
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// Frontend: сопоставляем код ошибки с локализованным сообщением
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  ru: { ITEM_VALIDATION_REQUIRED: 'Отсутствует обязательное поле' },
};
```

### 4. Как отлаживать проблемы, связанные с кодами ошибок?

1. **Просмотр логов backend**: Подтвердите, что код ошибки правильно выбрасывается
2. **Проверка сопоставления frontend**: Подтвердите, что в `ERROR_MESSAGES` есть соответствующая запись
3. **Использование панели сети**: Просмотрите полный ответ об ошибке от API
4. **Отображение details в dev**: В development окружении возвращается подробная информация об ошибке

---

## Резюме урока

В этом уроке мы подробно рассмотрели стандарты, которым должен следовать код, генерируемый AI App Factory:

- ✅ **Общие стандарты**: язык и формат, соглашения об именовании, организация файлов
- ✅ **Стандарты TypeScript**: определение типов, утверждения типов, обобщения
- ✅ **Стандарты backend**: маршруты Express, контроллеры, слой сервисов, обработка ошибок
- ✅ **Стандарты frontend**: структура компонентов, стандарты хуков, стандарты стилей, навигация
- ✅ **Стандарты Prisma**: определение схемы, стандарты запросов
- ✅ **Стандарты комментариев**: когда добавлять комментарии, формат комментариев
- ✅ **Стандарты кодов ошибок**: структура кода ошибки, стандартные типы ошибок, формат ответа об ошибке
- ✅ **Запрещенные практики**: 10 абсолютно запрещенных практик

Соблюдение этих стандартов обеспечивает согласованное качество кода, удобство сопровождения и легкость понимания.

---

## Следующий урок

> В следующем уроке мы изучим **[Подробнее о технологическом стеке](../tech-stack/)**.
>
> Вы узнаете:
> - Какой технологический стек используется в генерируемых приложениях
> - Комбинацию Node.js + Express + Prisma + React Native
> - Характеристики и лучшие практики каждого технологического стека

---

## Приложение: Справка по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть и посмотреть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-29

| Функция | Путь к файлу | Номера строк |
| --- | --- | --- |
| Документация по стандартам кода | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| Стандарты кодов ошибок | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**Ключевые стандарты**:
- **Стандарты кода**: общие стандарты, стандарты TypeScript, стандарты backend, стандарты frontend, стандарты Prisma, стандарты комментариев, конфигурация ESLint, запрещенные практики
- **Стандарты кодов ошибок**: структура кода ошибки, стандартные типы ошибок (VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR, RATE_LIMIT), формат ответа об ошибке, обработка ошибок frontend и backend

**Ключевая конфигурация**:
- **Backend ESLint**: правило `@typescript-eslint/no-explicit-any` установлено в `error`
- **Frontend ESLint**: правило `@typescript-eslint/no-explicit-any` установлено в `error`
- **Формат кода ошибки**: `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **Структура ответа об ошибке**: содержит `success`, `error.code`, `error.message`, `error.details`

</details>
