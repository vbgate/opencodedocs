---
title: "Подробное руководство по стеку технологий: Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "Подробное руководство по стеку технологий"
subtitle: "Подробное руководство по стеку технологий: узнайте о технологиях, используемых в генерируемых приложениях"
description: "Углубленное изучение технологического стека приложений, генерируемых AI App Factory, включая бэкенд (Node.js + Express + Prisma) и фронтенд (React Native + Expo): полный выбор технологий, инструментарий и лучшие практики."
tags:
- "Стек технологий"
- "Бэкенд"
- "Фронтенд"
- "Развертывание"
order: 240
---

# Подробное руководство по стеку технологий

Приложения, генерируемые AI App Factory, используют проверенный производственный стек технологий, ориентированный на быструю разработку MVP и последующее масштабирование. В этом документе подробно объясняется причина выбора каждой технологии и сценарии её использования.

---

## Что вы узнаете

- Поймете обоснование выбора технологий для генерируемых приложений
- Освоите основные инструменты и фреймворки стека технологий
- Поймете, почему выбраны именно эти технологии, а не альтернативы
- Узнаете, как настраивать технологии в зависимости от требований проекта

---

## Обзор основных технологий

Генерируемые приложения используют **полный стек TypeScript**, обеспечивающий безопасность типов и единообразный опыт разработки как на бэкенде, так и на фронтенде.

| Уровень | Технология | Версия | Назначение |
| --- | --- | --- | --- |
| **Среда выполнения бэкенда** | Node.js | 16+ | Серверная среда выполнения JavaScript |
| **Язык бэкенда** | TypeScript | 5+ | Надмножество JavaScript с безопасностью типов |
| **Фреймворк бэкенда** | Express | 4.x | Легковесный веб-фреймворк для создания RESTful API |
| **ORM** | Prisma | 5.x | Безопасный слой доступа к базе данных |
| **База данных для разработки** | SQLite | - | База данных без конфигурации для быстрого прототипирования |
| **База данных для продакшена** | PostgreSQL | - | Реляционная база данных для продакшена |
| **Фреймворк фронтенда** | React Native | - | Кроссплатформенная разработка мобильных приложений |
| **Инструментарий фронтенда** | Expo | - | Инструменты разработки и сборки для React Native |
| **Навигация фронтенда** | React Navigation | 6+ | Нативный опыт навигации |
| **Управление состоянием** | React Context API | - | Легковесное управление состоянием (на этапе MVP) |
| **HTTP-клиент** | Axios | - | HTTP-клиент для браузера и Node.js |

---

## Подробное руководство по стеку бэкенда

### Node.js + TypeScript

**Почему Node.js?**

- ✅ **Богатая экосистема**: npm — крупнейшая в мире экосистема пакетов
- ✅ **Единый язык**: команда осваивает только один язык
- ✅ **Высокая эффективность разработки**: событийно-ориентированная, неблокирующая модель I/O подходит для приложений реального времени
- ✅ **Активное сообщество**: множество open-source библиотек и решений

**Почему TypeScript?**

- ✅ **Безопасность типов**: ошибки выявляются на этапе компиляции, что снижает количество багов во время выполнения
- ✅ **Отличный опыт разработки**: интеллектуальные подсказки, автодополнение, поддержка рефакторинга
- ✅ **Поддерживаемость кода**: четкое определение интерфейсов повышает эффективность командной работы
- ✅ **Идеальная интеграция с Prisma**: автоматическая генерация определений типов

**Пример конфигурации**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Фреймворк Express

**Почему Express?**

- ✅ **Зрелость и стабильность**: самый популярный веб-фреймворк для Node.js
- ✅ **Богатые middleware**: аутентификация, логирование, CORS и многое другое из коробки
- ✅ **Высокая гибкость**: не навязывает структуру проекта, можно организовывать свободно
- ✅ **Хорошая поддержка сообщества**: множество руководств и решений проблем

**Типичная структура проекта**:

```
src/
├── config/          # Файлы конфигурации
│   ├── swagger.ts   # Конфигурация Swagger API документации
│   └── index.ts     # Конфигурация приложения
├── lib/             # Утилиты
│   ├── logger.ts    # Утилита логирования
│   └── prisma.ts    # Singleton Prisma
├── middleware/      # Middleware
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/          # Определения маршрутов
│   ├── items.ts
│   └── index.ts
├── controllers/     # Слой контроллеров
│   ├── items.controller.ts
│   └── index.ts
├── services/        # Слой бизнес-логики
│   └── items.service.ts
├── validators/      # Валидация входных данных
│   └── items.validator.ts
├── __tests__/       # Тестовые файлы
│   └── items.test.ts
├── app.ts           # Приложение Express
└── index.ts         # Точка входа приложения
```

**Основные middleware**:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware безопасности
app.use(helmet());           // Заголовки безопасности
app.use(cors(corsOptions));  // Конфигурация CORS

// Middleware обработки запросов
app.use(express.json());     // Парсинг JSON
app.use(compression());      // Сжатие ответов
app.use(requestLogger);      // Логирование запросов

// Middleware обработки ошибок (последним)
app.use(errorHandler);

export default app;
```

### Prisma ORM

**Почему Prisma?**

- ✅ **Безопасность типов**: автоматическая генерация определений TypeScript
- ✅ **Управление миграциями**: декларативная схема, автоматическая генерация скриптов миграции
- ✅ **Отличный опыт разработки**: поддержка IntelliSense, четкие сообщения об ошибках
- ✅ **Поддержка нескольких баз данных**: SQLite, PostgreSQL, MySQL и другие
- ✅ **Высокая производительность**: оптимизация запросов, управление пулом соединений

**Типичный пример Schema**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"      // Среда разработки
  // provider = "postgresql" // Среда продакшена
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Item {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  amount      Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([createdAt]) // Ручное создание индекса для сортировки
}
```

**Часто используемые операции с базой данных**:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Создание
const item = await prisma.item.create({
  data: { title: 'Обед', amount: 25.5 }
});

// Запрос (с поддержкой пагинации)
const items = await prisma.item.findMany({
  take: 20,              // Ограничение количества
  skip: 0,               // Смещение
  orderBy: { createdAt: 'desc' }
});

// Обновление
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: 'Ужин' }
});

// Удаление
await prisma.item.delete({
  where: { id: 1 }
});
```

### Выбор базы данных

**Среда разработки: SQLite**

- ✅ **Нулевая конфигурация**: файловая база данных, не требует установки сервиса
- ✅ **Быстрый старт**: подходит для локальной разработки и быстрой итерации
- ✅ **Переносимость**: вся база данных — это один файл `.db`
- ❌ **Не поддерживает параллельную запись**: конфликты при одновременной записи нескольких процессов
- ❌ **Не подходит для продакшена**: ограниченная производительность и возможности параллелизма

**Среда продакшена: PostgreSQL**

- ✅ **Полный функционал**: поддержка сложных запросов, транзакций, типа JSON
- ✅ **Высокая производительность**: поддержка высокой параллельности, сложных индексов
- ✅ **Стабильность и надежность**: корпоративная база данных, проверенная временем
- ✅ **Зрелая экосистема**: богатый инструментарий резервного копирования и мониторинга

**Стратегия миграции базы данных**:

```bash
# Среда разработки — использование SQLite
DATABASE_URL="file:./dev.db"

# Среда продакшена — использование PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# Создание миграции
npx prisma migrate dev --name add_item_category

# Развертывание в продакшене
npx prisma migrate deploy

# Сброс базы данных (среда разработки)
npx prisma migrate reset
```

---

## Подробное руководство по стеку фронтенда

### React Native + Expo

**Почему React Native?**

- ✅ **Кроссплатформенность**: один код работает на iOS и Android
- ✅ **Нативная производительность**: компилируется в нативные компоненты, а не WebView
- ✅ **Горячие обновления**: Expo поддерживает обновления без повторной публикации
- ✅ **Богатые компоненты**: сообщество предоставляет множество качественных компонентов

**Почему Expo?**

- ✅ **Быстрый старт**: не требует сложной настройки нативной среды разработки
- ✅ **Единый инструментарий**: единый процесс разработки, сборки и развертывания
- ✅ **Expo Go**: сканируйте QR-код для предпросмотра на реальном устройстве
- ✅ **EAS Build**: облачная сборка с поддержкой публикации в App Store

**Структура проекта**:

```
src/
├── api/              # Вызовы API
│   ├── client.ts     # Экземпляр Axios
│   └── items.ts      # Items API
├── components/       # Переиспользуемые компоненты
│   └── ui/           # Базовые UI-компоненты
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/            # Пользовательские Hooks
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/       # Конфигурация навигации
│   └── RootNavigator.tsx
├── screens/          # Компоненты экранов
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/           # Стили и темы
│   └── theme.ts
└── types/            # Типы TypeScript
    └── index.ts
```

**Пример типичного экрана**:

```typescript
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useItems } from '@/hooks/useItems';
import { Card } from '@/components/ui/Card';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';

export function HomeScreen() {
  const { data, loading, error, refresh } = useItems();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <Text>Ошибка загрузки: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card title={item.title} description={item.description} />
        )}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

### React Navigation

**Почему React Navigation?**

- ✅ **Официальная рекомендация**: официальное решение для навигации в React Native
- ✅ **Безопасность типов**: TypeScript поддерживает полную типизацию параметров навигации
- ✅ **Нативный опыт**: предоставляет нативные режимы навигации, такие как стековая и таб-навигация
- ✅ **Глубокие ссылки**: поддержка URL Scheme и глубоких ссылок

**Пример конфигурации навигации**:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Определение типов параметров навигации
export type RootStackParamList = {
  Home: undefined;
  Detail: { itemId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Главная' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `Детали ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Управление состоянием

**React Context API (на этапе MVP)**

Подходит для простых приложений, нулевые зависимости:

```typescript
import React, { createContext, useContext, useState } from 'react';

interface ItemsContextType {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }) {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (item: Omit<Item, 'id'>) => {
    setItems([...items, { ...item, id: Date.now() }]);
  };

  return (
    <ItemsContext.Provider value={{ items, addItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems должен использоваться внутри ItemsProvider');
  }
  return context;
}
```

**Zustand (приложения средней сложности)**

Легковесная библиотека управления состоянием с простым API:

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ItemsStore {
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  removeItem: (id: number) => void;
}

export const useItemsStore = create<ItemsStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((state) => ({
            items: [...state.items, { ...item, id: Date.now() }]
          })),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id)
          })),
      }),
      { name: 'items-storage' } // Персистентность в AsyncStorage
    )
  )
);
```

---

## Инструментарий разработки

### Фреймворк тестирования

**Бэкенд: Vitest**

```typescript
// src/__tests__/items.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Items API', () => {
  it('should return items list', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

**Фронтенд: Jest + React Native Testing Library**

```typescript
// src/screens/__tests__/HomeScreen.test.tsx
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  it('should render without crashing', () => {
    render(<HomeScreen />);
  });

  it('should show loading state initially', () => {
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### API документация: Swagger/OpenAPI

Генерируемые приложения автоматически включают Swagger UI, доступный по адресу `http://localhost:3000/api-docs`.

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Сканирование комментариев маршрутов
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Логирование и мониторинг

**Логирование бэкенда: winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// Примеры использования
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**Мониторинг фронтенда**: запись времени выполнения API-запросов, ошибок и метрик производительности.

---

## Инструменты развертывания

### Docker + docker-compose

Генерируемые приложения включают `Dockerfile` и `docker-compose.yml`, поддерживая контейнеризованное развертывание.

**Пример docker-compose.yml**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/appdb
    depends_on:
      - postgres
```

### CI/CD: GitHub Actions

Автоматизация тестирования, сборки и развертывания:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
```

---

## Принципы выбора стека технологий

Основные принципы выбора стека технологий AI App Factory:

### 1. Простота в приоритете

- Выбор зрелых и стабильных технологий для снижения затрат на обучение
- Избегание чрезмерного проектирования, фокус на основной функционал
- Запуск без конфигурации, быстрая проверка идей

### 2. Безопасность типов

- Единое использование TypeScript на бэкенде и фронтенде
- Prisma автоматически генерирует типы базы данных
- React Navigation с безопасностью типов параметров навигации

### 3. Готовность к продакшену

- Полное покрытие тестами
- Предоставление конфигураций развертывания (Docker, CI/CD)
- Полное логирование, мониторинг и обработка ошибок

### 4. Масштабируемость

- Резервирование точек расширения (например, кэширование, очереди сообщений)
- Поддержка миграции базы данных (SQLite → PostgreSQL)
- Модульная архитектура для удобства разделения и рефакторинга

### 5. Фокус на MVP

- Четкое определение того, что не входит в цели, без внедрения аутентификации, авторизации и других неосновных функций
- Ограничение количества страниц (максимум 3)
- Быстрая доставка, последующие итерации

---

## Часто задаваемые вопросы

### В: Почему не NestJS?

**О**: NestJS — отличный фреймворк, но слишком сложный для этапа MVP. Express более легковесный и гибкий, подходит для быстрого прототипирования. Если проект масштабируется, можно рассмотреть миграцию на NestJS.

### В: Почему не MongoDB?

**О**: Большинство MVP-приложений имеют реляционную модель данных, для которой PostgreSQL или SQLite более подходят. MongoDB подходит для документо-ориентированных данных, и не рекомендуется использовать, если явно не требуются возможности NoSQL.

### В: Почему не Redux?

**О**: Redux подходит для крупных приложений, но имеет высокие затраты на обучение. На этапе MVP достаточно React Context API или Zustand. Если управление состоянием усложняется, можно внедрить Redux Toolkit.

### В: Почему не GraphQL?

**О**: RESTful API проще и подходит для большинства CRUD-приложений. Преимущества GraphQL — гибкие запросы и сокращение количества запросов, но для этапа MVP REST API достаточно, а документация Swagger более полная.

### В: Почему не Next.js?

**О**: Next.js — это React-фреймворк, подходящий для SSR и веб-приложений. Цель этого проекта — генерация мобильных приложений, для которых React Native является лучшим выбором. Если требуется веб-версия, можно использовать React Native Web.

---

## Сравнение стеков технологий

### Сравнение бэкенд-фреймворков

| Фреймворк | Преимущества | Недостатки | Сценарии использования |
| --- | --- | --- | --- |
| **Express** | Легковесный, гибкий, богатая экосистема | Требует ручной настройки структуры | Приложения среднего размера, API-сервисы |
| **NestJS** | Безопасность типов, модульность, внедрение зависимостей | Крутая кривая обучения, чрезмерное проектирование | Крупные корпоративные приложения |
| **Fastify** | Высокая производительность, встроенная валидация | Меньшая экосистема | Сценарии с высокой параллельностью |
| **Koa** | Легковесный, элегантные middleware | Документация и экосистема уступают Express | Сценарии, требующие тонкого контроля |

### Сравнение фронтенд-фреймворков

| Фреймворк | Преимущества | Недостатки | Сценарии использования |
| --- | --- | --- | --- |
| **React Native** | Кроссплатформенность, нативная производительность, богатая экосистема | Требуется изучение нативной разработки | Приложения iOS + Android |
| **Flutter** | Отличная производительность, единообразный UI | Меньшая экосистема Dart | Сценарии, требующие максимальной производительности |
| **Ionic** | Веб-стек технологий, быстрый старт | Не нативная производительность | Простые гибридные приложения |

### Сравнение баз данных

| База данных | Преимущества | Недостатки | Сценарии использования |
| --- | --- | --- | --- |
| **PostgreSQL** | Полный функционал, отличная производительность | Требует отдельного развертывания | Среда продакшена |
| **SQLite** | Нулевая конфигурация, легковесная | Не поддерживает параллельную запись | Среда разработки, небольшие приложения |
| **MySQL** | Популярность, богатая документация | Функционал уступает PostgreSQL | Традиционные веб-приложения |

---

## Рекомендации по расширению

По мере развития проекта можно рассмотреть следующие расширения:

### Краткосрочное расширение (v1.1)

- Добавление слоя кэширования Redis
- Внедрение поиска Elasticsearch
- Реализация аутентификации и авторизации (JWT)
- Добавление WebSocket для коммуникации в реальном времени

### Среднесрочное расширение (v2.0)

- Миграция на микросервисную архитектуру
- Внедрение очередей сообщений (RabbitMQ/Kafka)
- Добавление CDN-ускорения
- Реализация многоязычной поддержки

### Долгосрочное расширение

- Внедрение GraphQL API
- Реализация Serverless-архитектуры
- Добавление функций AI/ML
- Реализация поддержки мультиарендности

---

## Анонс следующего урока

> В следующем уроке мы изучим **[Справочник по командам CLI](../cli-commands/)**.
>
> Вы узнаете:
> - Как `factory init` инициализирует проект
> - Как `factory run` запускает конвейер
> - Как `factory continue` продолжает выполнение в новой сессии
> - Параметры и использование других часто используемых команд

---

## Приложение: Справка по исходному коду

<details>
<summary><strong>Нажмите, чтобы развернуть и посмотреть расположение исходного кода</strong></summary>

> Обновлено: 2026-01-29

| Функция | Путь к файлу |
| --- | --- |
| Обзор стека технологий | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (строки 211-230) |
| Руководство по технической архитектуре | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| Руководство по генерации кода | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| Шаблон бэкенда | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| Шаблон фронтенда | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**Ключевой стек технологий**:
- **Бэкенд**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **Фронтенд**: React Native + Expo + React Navigation + Zustand
- **Тестирование**: Vitest (бэкенд) + Jest (фронтенд)
- **Развертывание**: Docker + GitHub Actions

**Почему выбраны именно эти технологии**:
- **Простота в приоритете**: запуск без конфигурации, быстрая проверка идей
- **Безопасность типов**: TypeScript + автоматическая генерация типов Prisma
- **Готовность к продакшену**: полное тестирование, документация, конфигурации развертывания
- **Масштабируемость**: резервирование точек расширения для кэширования, очередей сообщений и т.д.

</details>
