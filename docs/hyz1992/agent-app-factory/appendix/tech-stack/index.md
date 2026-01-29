---
title: "Tech Stack Explained: Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "Tech Stack"
subtitle: "Tech Stack Explained: Understand the technology stack used in generated applications"
description: "Deep dive into the AI App Factory generated application tech stack, including backend (Node.js + Express + Prisma) and frontend (React Native + Expo) complete technology selection, toolchain, and best practices."
tags:
  - "tech stack"
  - "backend"
  - "frontend"
  - "deployment"
order: 240
---

# Tech Stack Explained

AI App Factory generated applications use a proven production-ready tech stack, focused on rapid MVP development and future scalability. This document explains in detail the reasons for each technology choice and its use cases.

---

## What You'll Learn

- Understand the technology selection rationale for generated applications
- Master the core tools and frameworks of the frontend and backend tech stack
- Understand why these technologies were chosen over other alternatives
- Know how to adjust tech configuration based on project requirements

---

## Core Technology Overview

Generated applications adopt a **full-stack TypeScript** solution, ensuring frontend and backend type safety and consistent development experience.

| Layer | Technology | Version | Purpose |
|------|------------|---------|---------|
| **Backend Runtime** | Node.js | 16+ | JavaScript server-side runtime |
| **Backend Language** | TypeScript | 5+ | Type-safe JavaScript superset |
| **Backend Framework** | Express | 4.x | Lightweight web framework for building RESTful APIs |
| **ORM** | Prisma | 5.x | Type-safe database access layer |
| **Development Database** | SQLite | - | Zero-config file database for rapid prototyping |
| **Production Database** | PostgreSQL | - | Production relational database |
| **Frontend Framework** | React Native | - | Cross-platform mobile app development |
| **Frontend Toolchain** | Expo | - | React Native development and build tools |
| **Frontend Navigation** | React Navigation | 6+ | Native-level navigation experience |
| **State Management** | React Context API | - | Lightweight state management (MVP stage) |
| **HTTP Client** | Axios | - | Browser and Node.js HTTP client |

---

## Backend Tech Stack Explained

### Node.js + TypeScript

**Why Node.js?**

- ✅ **Rich ecosystem**: npm has the world's largest package ecosystem
- ✅ **Unified frontend and backend**: Teams only need to master one language
- ✅ **High development efficiency**: Event-driven, non-blocking I/O suitable for real-time applications
- ✅ **Active community**: Large number of open-source libraries and solutions

**Why TypeScript?**

- ✅ **Type safety**: Catch errors at compile time, reduce runtime bugs
- ✅ **Great developer experience**: Intelligent hints, auto-completion, refactoring support
- ✅ **Code maintainability**: Clear interface definitions improve team collaboration efficiency
- ✅ **Perfect integration with Prisma**: Auto-generate type definitions

**Configuration Example**:

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

### Express Framework

**Why Express?**

- ✅ **Mature and stable**: Most popular Node.js web framework
- ✅ **Rich middleware**: Authentication, logging, CORS ready out of the box
- ✅ **High flexibility**: No enforced project structure, organize freely
- ✅ **Good community support**: Large number of tutorials and problem solutions

**Typical Project Structure**:

```
src/
├── config/         # Configuration files
│   ├── swagger.ts  # Swagger API documentation config
│   └── index.ts    # Application config
├── lib/            # Utility libraries
│   ├── logger.ts   # Logging utility
│   └── prisma.ts   # Prisma singleton
├── middleware/     # Middleware
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # Route definitions
│   ├── items.ts
│   └── index.ts
├── controllers/    # Controller layer
│   ├── items.controller.ts
│   └── index.ts
├── services/       # Business logic layer
│   └── items.service.ts
├── validators/     # Input validation
│   └── items.validator.ts
├── __tests__/      # Test files
│   └── items.test.ts
├── app.ts          # Express app
└── index.ts        # Application entry point
```

**Core Middleware**:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());                          // Security headers
app.use(cors(corsOptions));                 // CORS configuration

// Request processing middleware
app.use(express.json());                    // JSON parsing
app.use(compression());                     // Response compression
app.use(requestLogger);                    // Request logging

// Error handling middleware (last)
app.use(errorHandler);

export default app;
```

### Prisma ORM

**Why Prisma?**

- ✅ **Type safety**: Auto-generate TypeScript type definitions
- ✅ **Migration management**: Declarative schema, auto-generate migration scripts
- ✅ **Great developer experience**: IntelliSense support, clear error messages
- ✅ **Multi-database support**: SQLite, PostgreSQL, MySQL, etc.
- ✅ **Excellent performance**: Query optimization, connection pool management

**Typical Schema Example**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // Development environment
  // provider = "postgresql"   // Production environment
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

  @@index([createdAt])  // Manually create index for sorting
}
```

**Common Database Operations**:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
const item = await prisma.item.create({
  data: { title: 'Lunch', amount: 25.5 }
});

// Query (with pagination support)
const items = await prisma.item.findMany({
  take: 20,       // Limit count
  skip: 0,        // Offset
  orderBy: { createdAt: 'desc' }
});

// Update
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: 'Dinner' }
});

// Delete
await prisma.item.delete({
  where: { id: 1 }
});
```

### Database Selection

**Development Environment: SQLite**

- ✅ **Zero config**: File database, no need to install service
- ✅ **Quick start**: Suitable for local development and rapid iteration
- ✅ **Portable**: Entire database is a single `.db` file
- ❌ **No concurrent write support**: Multiple processes writing simultaneously will conflict
- ❌ **Not suitable for production**: Limited performance and concurrency

**Production Environment: PostgreSQL**

- ✅ **Feature complete**: Supports complex queries, transactions, JSON types
- ✅ **Excellent performance**: Supports high concurrency, complex indexes
- ✅ **Stable and reliable**: Enterprise-grade database, battle-tested
- ✅ **Mature ecosystem**: Rich backup, monitoring tools

**Database Migration Strategy**:

```bash
# Development environment - Use SQLite
DATABASE_URL="file:./dev.db"

# Production environment - Use PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# Create migration
npx prisma migrate dev --name add_item_category

# Production deployment
npx prisma migrate deploy

# Reset database (development environment)
npx prisma migrate reset
```

---

## Frontend Tech Stack Explained

### React Native + Expo

**Why React Native?**

- ✅ **Cross-platform**: Single codebase runs on iOS and Android
- ✅ **Native performance**: Compiles to native components, not WebView
- ✅ **OTA updates**: Expo supports updates without republishing
- ✅ **Rich components**: Community provides many high-quality components

**Why Expo?**

- ✅ **Quick start**: No need to configure complex native development environment
- ✅ **Unified toolchain**: Unified development, build, deployment workflow
- ✅ **Expo Go**: Preview on real device by scanning QR code
- ✅ **EAS Build**: Cloud builds, supports App Store publishing

**Project Structure**:

```
src/
├── api/           # API calls
│   ├── client.ts  # Axios instance
│   └── items.ts   # Items API
├── components/    # Reusable components
│   └── ui/        # Basic UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # Custom Hooks
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # Navigation config
│   └── RootNavigator.tsx
├── screens/       # Page components
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # Styles and themes
│   └── theme.ts
└── types/         # TypeScript types
    └── index.ts
```

**Typical Page Example**:

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
    return <Text>Loading failed: {error.message}</Text>;
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

**Why React Navigation?**

- ✅ **Official recommendation**: React Native official navigation solution
- ✅ **Type safety**: TypeScript supports complete navigation parameter types
- ✅ **Native experience**: Provides stack navigation, tab navigation, and other native navigation patterns
- ✅ **Deep linking**: Supports URL Scheme and deep linking

**Navigation Configuration Example**:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Define navigation parameter types
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
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `Detail ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### State Management

**React Context API (MVP Stage)**

Suitable for simple applications, zero dependencies:

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
    throw new Error('useItems must be used within ItemsProvider');
  }
  return context;
}
```

**Zustand (Medium Complexity Applications)**

Lightweight state management library, simple API:

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
      { name: 'items-storage' } // Persist to AsyncStorage
    )
  )
);
```

---

## Development Toolchain

### Testing Framework

**Backend: Vitest**

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

**Frontend: Jest + React Native Testing Library**

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

### API Documentation: Swagger/OpenAPI

Generated applications automatically include Swagger UI, accessible via `http://localhost:3000/api-docs`.

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
  apis: ['./src/routes/*.ts'], // Scan route comments
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Logging and Monitoring

**Backend Logging: winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// Usage example
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**Frontend Monitoring**: Record API request latency, errors, and performance metrics.

---

## Deployment Tools

### Docker + docker-compose

Generated applications include `Dockerfile` and `docker-compose.yml`, supporting containerized deployment.

**docker-compose.yml Example**:

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

Automated testing, building, and deployment workflow:

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

## Tech Stack Selection Principles

AI App Factory selects this tech stack based on core principles:

### 1. Simplicity First

- Choose mature, stable technologies to reduce learning costs
- Avoid over-design, focus on core functionality
- Zero-config startup, rapid idea validation

### 2. Type Safety

- Unified TypeScript for frontend and backend
- Prisma auto-generates database types
- React Navigation type-safe navigation parameters

### 3. Production Ready

- Complete test coverage
- Deployment configuration included (Docker, CI/CD)
- Comprehensive logging, monitoring, error handling

### 4. Scalability

- Reserved extension points (caching, message queues)
- Support database migration (SQLite → PostgreSQL)
- Modular architecture for easy refactoring

### 5. MVP Focus

- Clear non-goals, no authentication, authorization, or non-core features
- Page count limit (maximum 3 pages)
- Rapid delivery, subsequent iterations

---

## FAQ

### Q: Why not NestJS?

**A**: NestJS is an excellent framework, but too complex for the MVP stage. Express is lighter and more flexible, suitable for rapid prototyping. If the project scale grows later, consider migrating to NestJS.

### Q: Why not MongoDB?

**A**: Most MVP applications have relational data models, PostgreSQL or SQLite are more suitable. MongoDB is suitable for document data. Unless you explicitly need NoSQL features, it's not recommended.

### Q: Why not Redux?

**A**: Redux is suitable for large applications but has a high learning cost. For the MVP stage, React Context API or Zustand is sufficient. If state management becomes complex later, Redux Toolkit can be introduced.

### Q: Why not GraphQL?

**A**: RESTful API is simpler and suitable for most CRUD applications. GraphQL's advantage is flexible queries and reducing request count, but REST API is sufficient for the MVP stage, and Swagger documentation is more complete.

### Q: Why not Next.js?

**A**: Next.js is a React framework suitable for SSR and web applications. This project's goal is to generate mobile applications, React Native is a better choice. If a web version is needed, React Native Web can be used.

---

## Tech Stack Comparison

### Backend Framework Comparison

| Framework | Advantages | Disadvantages | Use Cases |
|-----------|------------|---------------|-----------|
| **Express** | Lightweight, flexible, rich ecosystem | Manual structure configuration | Small to medium apps, API services |
| **NestJS** | Type-safe, modular, dependency injection | Steep learning curve, over-design | Large enterprise applications |
| **Fastify** | High performance, built-in validation | Smaller ecosystem | High concurrency scenarios |
| **Koa** | Lightweight, elegant middleware | Documentation and ecosystem not as good as Express | Scenarios requiring fine-grained control |

### Frontend Framework Comparison

| Framework | Advantages | Disadvantages | Use Cases |
|-----------|------------|---------------|-----------|
| **React Native** | Cross-platform, native performance, rich ecosystem | Need to learn native development | iOS + Android applications |
| **Flutter** | Excellent performance, consistent UI | Smaller Dart language ecosystem | Scenarios requiring extreme performance |
| **Ionic** | Web tech stack, quick to start | Non-native performance | Simple hybrid applications |

### Database Comparison

| Database | Advantages | Disadvantages | Use Cases |
|----------|------------|---------------|-----------|
| **PostgreSQL** | Feature complete, excellent performance | Needs separate deployment | Production environment |
| **SQLite** | Zero config, lightweight | No concurrent write support | Development environment, small apps |
| **MySQL** | Popular, rich documentation | Slightly less feature-complete than PostgreSQL | Traditional web applications |

---

## Extension Suggestions

As the project grows, consider the following extensions:

### Short-term Extensions (v1.1)

- Add Redis caching layer
- Introduce Elasticsearch search
- Implement authentication and authorization (JWT)
- Add WebSocket real-time communication

### Medium-term Extensions (v2.0)

- Migrate to microservices architecture
- Introduce message queues (RabbitMQ/Kafka)
- Add CDN acceleration
- Implement multi-language support

### Long-term Extensions

- Introduce GraphQL API
- Implement Serverless architecture
- Add AI/ML features
- Implement multi-tenant support

---

## Next Lesson Preview

> In the next lesson, we'll learn **[CLI Command Reference](../cli-commands/)**.
>
> You'll learn:
> - How `factory init` initializes projects
> - How `factory run` runs the pipeline
> - How `factory continue` continues execution in a new session
> - Parameters and usage of other common commands

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Feature | File Path |
|-----------|-----------|
| Tech stack overview | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (lines 211-230) |
| Tech architecture guide | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| Code generation guide | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| Backend template | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| Frontend template | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**Key tech stack configuration**:
- **Backend**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **Frontend**: React Native + Expo + React Navigation + Zustand
- **Testing**: Vitest (backend) + Jest (frontend)
- **Deployment**: Docker + GitHub Actions

**Why these technologies were chosen**:
- **Simplicity first**: Zero-config startup, rapid idea validation
- **Type safety**: TypeScript + Prisma auto-generated types
- **Production ready**: Complete tests, documentation, deployment configuration
- **Scalability**: Reserved extension points for caching, message queues, etc.

</details>
