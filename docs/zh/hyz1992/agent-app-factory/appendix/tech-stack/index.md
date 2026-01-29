---
title: "技术栈详解：Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "技术栈详解"
subtitle: "技术栈详解：了解生成应用使用的技术栈"
description: "深入了解 AI App Factory 生成的应用技术栈，包括后端（Node.js + Express + Prisma）和前端（React Native + Expo）的完整技术选型、工具链和最佳实践。"
tags:
  - "技术栈"
  - "后端"
  - "前端"
  - "部署"
order: 240
---

# 技术栈详解

AI App Factory 生成的应用使用一套经过验证的生产就绪技术栈，专注于快速 MVP 开发和后续扩展性。本文档详细解释每个技术选择的原因和使用场景。

---

## 学完你能做什么

- 了解生成应用的技术选型理由
- 掌握前后端技术栈的核心工具和框架
- 理解为什么选择这些技术而非其他方案
- 知道如何根据项目需求调整技术配置

---

## 核心技术概览

生成的应用采用**全栈 TypeScript**方案，确保前后端类型安全和开发体验一致。

| 层级 | 技术选型 | 版本 | 用途 |
|------|---------|------|------|
| **后端运行时** | Node.js | 16+ | JavaScript 服务端运行环境 |
| **后端语言** | TypeScript | 5+ | 类型安全的 JavaScript 超集 |
| **后端框架** | Express | 4.x | 轻量级 Web 框架，构建 RESTful API |
| **ORM** | Prisma | 5.x | 类型安全的数据库访问层 |
| **开发数据库** | SQLite | - | 零配置文件数据库，快速原型 |
| **生产数据库** | PostgreSQL | - | 生产环境关系型数据库 |
| **前端框架** | React Native | - | 跨平台移动应用开发 |
| **前端工具链** | Expo | - | React Native 开发和构建工具 |
| **前端导航** | React Navigation | 6+ | 原生级导航体验 |
| **状态管理** | React Context API | - | 轻量级状态管理（MVP 阶段） |
| **HTTP 客户端** | Axios | - | 浏览器和 Node.js HTTP 客户端 |

---

## 后端技术栈详解

### Node.js + TypeScript

**为什么选择 Node.js？**

- ✅ **生态丰富**：npm 拥有全球最大的包生态系统
- ✅ **前后端统一**：团队只需掌握一门语言
- ✅ **开发效率高**：事件驱动、非阻塞 I/O 适合实时应用
- ✅ **社区活跃**：大量开源库和解决方案

**为什么选择 TypeScript？**

- ✅ **类型安全**：编译时捕获错误，减少运行时 bug
- ✅ **开发体验好**：智能提示、自动补全、重构支持
- ✅ **代码可维护**：明确的接口定义提升团队协作效率
- ✅ **与 Prisma 完美配合**：自动生成类型定义

**配置示例**：

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

### Express 框架

**为什么选择 Express？**

- ✅ **成熟稳定**：最流行的 Node.js Web 框架
- ✅ **中间件丰富**：认证、日志、CORS 等开箱即用
- ✅ **灵活性高**：不强制项目结构，可自由组织
- ✅ **社区支持好**：大量教程和问题解决方案

**典型项目结构**：

```
src/
├── config/         # 配置文件
│   ├── swagger.ts  # Swagger API 文档配置
│   └── index.ts    # 应用配置
├── lib/            # 工具库
│   ├── logger.ts   # 日志工具
│   └── prisma.ts   # Prisma 单例
├── middleware/     # 中间件
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # 路由定义
│   ├── items.ts
│   └── index.ts
├── controllers/    # 控制器层
│   ├── items.controller.ts
│   └── index.ts
├── services/       # 业务逻辑层
│   └── items.service.ts
├── validators/     # 输入验证
│   └── items.validator.ts
├── __tests__/      # 测试文件
│   └── items.test.ts
├── app.ts          # Express 应用
└── index.ts        # 应用入口
```

**核心中间件**：

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// 安全中间件
app.use(helmet());                          // 安全头
app.use(cors(corsOptions));                 // CORS 配置

// 请求处理中间件
app.use(express.json());                    // JSON 解析
app.use(compression());                     // 响应压缩
app.use(requestLogger);                    // 请求日志

// 错误处理中间件（最后）
app.use(errorHandler);

export default app;
```

### Prisma ORM

**为什么选择 Prisma？**

- ✅ **类型安全**：自动生成 TypeScript 类型定义
- ✅ **迁移管理**：声明式 schema，自动生成迁移脚本
- ✅ **开发体验好**：IntelliSense 支持、错误提示清晰
- ✅ **多数据库支持**：SQLite、PostgreSQL、MySQL 等
- ✅ **性能优秀**：查询优化、连接池管理

**典型 Schema 示例**：

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // 开发环境
  // provider = "postgresql"   // 生产环境
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

  @@index([createdAt])  // 手动创建索引用于排序
}
```

**常用数据库操作**：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 创建
const item = await prisma.item.create({
  data: { title: '午餐', amount: 25.5 }
});

// 查询（支持分页）
const items = await prisma.item.findMany({
  take: 20,       // 限制数量
  skip: 0,        // 偏移量
  orderBy: { createdAt: 'desc' }
});

// 更新
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: '晚餐' }
});

// 删除
await prisma.item.delete({
  where: { id: 1 }
});
```

### 数据库选择

**开发环境：SQLite**

- ✅ **零配置**：文件数据库，无需安装服务
- ✅ **快速启动**：适合本地开发和快速迭代
- ✅ **可移植**：整个数据库就是一个 `.db` 文件
- ❌ **不支持并发写入**：多进程同时写入会冲突
- ❌ **不适合生产**：性能和并发能力有限

**生产环境：PostgreSQL**

- ✅ **功能完整**：支持复杂查询、事务、JSON 类型
- ✅ **性能优秀**：支持高并发、复杂索引
- ✅ **稳定可靠**：企业级数据库，久经考验
- ✅ **生态成熟**：备份、监控工具丰富

**数据库迁移策略**：

```bash
# 开发环境 - 使用 SQLite
DATABASE_URL="file:./dev.db"

# 生产环境 - 使用 PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# 创建迁移
npx prisma migrate dev --name add_item_category

# 生产部署
npx prisma migrate deploy

# 重置数据库（开发环境）
npx prisma migrate reset
```

---

## 前端技术栈详解

### React Native + Expo

**为什么选择 React Native？**

- ✅ **跨平台**：一套代码运行在 iOS 和 Android
- ✅ **原生性能**：编译为原生组件，非 WebView
- ✅ **热更新**：Expo 支持无需重新发布的更新
- ✅ **组件丰富**：社区提供大量高质量组件

**为什么选择 Expo？**

- ✅ **快速启动**：无需配置复杂的原生开发环境
- ✅ **统一工具链**：统一的开发、构建、部署流程
- ✅ **Expo Go**：扫码即可在真机预览
- ✅ **EAS Build**：云端构建，支持 App Store 发布

**项目结构**：

```
src/
├── api/           # API 调用
│   ├── client.ts  # Axios 实例
│   └── items.ts   # Items API
├── components/    # 可复用组件
│   └── ui/        # 基础 UI 组件
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # 自定义 Hooks
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # 导航配置
│   └── RootNavigator.tsx
├── screens/       # 页面组件
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # 样式和主题
│   └── theme.ts
└── types/         # TypeScript 类型
    └── index.ts
```

**典型页面示例**：

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
    return <Text>加载失败: {error.message}</Text>;
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

**为什么选择 React Navigation？**

- ✅ **官方推荐**：React Native 官方导航方案
- ✅ **类型安全**：TypeScript 支持完整的导航参数类型
- ✅ **原生体验**：提供栈导航、标签导航等原生导航模式
- ✅ **深度链接**：支持 URL Scheme 和深度链接

**导航配置示例**：

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 定义导航参数类型
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
          options={{ title: '首页' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `详情 ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 状态管理

**React Context API（MVP 阶段）**

适合简单应用，零依赖：

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

**Zustand（中等复杂度应用）**

轻量级状态管理库，API 简洁：

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
      { name: 'items-storage' } // 持久化到 AsyncStorage
    )
  )
);
```

---

## 开发工具链

### 测试框架

**后端：Vitest**

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

**前端：Jest + React Native Testing Library**

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

### API 文档：Swagger/OpenAPI

生成的应用自动包含 Swagger UI，可通过 `http://localhost:3000/api-docs` 访问。

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
  apis: ['./src/routes/*.ts'], // 扫描路由注释
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 日志和监控

**后端日志：winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// 使用示例
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**前端监控**：记录 API 请求耗时、错误和性能指标。

---

## 部署工具

### Docker + docker-compose

生成的应用包含 `Dockerfile` 和 `docker-compose.yml`，支持容器化部署。

**docker-compose.yml 示例**：

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

### CI/CD：GitHub Actions

自动化测试、构建和部署流程：

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

## 技术栈选择原则

AI App Factory 选择这套技术栈的核心原则：

### 1. 简单优先

- 选择成熟稳定的技术，降低学习成本
- 避免过度设计，聚焦核心功能
- 零配置启动，快速验证想法

### 2. 类型安全

- 前后端统一使用 TypeScript
- Prisma 自动生成数据库类型
- React Navigation 类型安全的导航参数

### 3. 生产就绪

- 包含完整的测试覆盖
- 提供部署配置（Docker、CI/CD）
- 日志、监控、错误处理完备

### 4. 可扩展性

- 预留扩展点（如缓存、消息队列）
- 支持数据库迁移（SQLite → PostgreSQL）
- 模块化架构，便于拆分和重构

### 5. MVP 聚焦

- 明确非目标，不引入认证、授权等非核心功能
- 页面数量限制（最多 3 页）
- 快速交付，后续迭代

---

## 常见问题

### Q: 为什么不用 NestJS？

**A**: NestJS 是一个优秀的框架，但 MVP 阶段过于复杂。Express 更轻量、更灵活，适合快速原型。如果后续项目规模增长，可以考虑迁移到 NestJS。

### Q: 为什么不用 MongoDB？

**A**: 大多数 MVP 应用的数据模型是关系型的，PostgreSQL 或 SQLite 更合适。MongoDB 适合文档型数据，除非明确需要 NoSQL 特性，否则不建议使用。

### Q: 为什么不用 Redux？

**A**: Redux 适合大型应用，但学习成本高。MVP 阶段使用 React Context API 或 Zustand 足够。如果后续状态管理变得复杂，可以再引入 Redux Toolkit。

### Q: 为什么不用 GraphQL？

**A**: RESTful API 更简单，适合大多数 CRUD 应用。GraphQL 的优势在于灵活查询和减少请求次数，但 MVP 阶段 REST API 已经足够，且 Swagger 文档更完善。

### Q: 为什么不用 Next.js？

**A**: Next.js 是 React 框架，适合 SSR 和 Web 应用。本项目目标是生成移动应用，React Native 是更好的选择。如果需要 Web 版本，可以使用 React Native Web。

---

## 技术栈对比

### 后端框架对比

| 框架 | 优势 | 劣势 | 适用场景 |
|------|------|------|---------|
| **Express** | 轻量、灵活、生态丰富 | 需手动配置结构 | 中小型应用、API 服务 |
| **NestJS** | 类型安全、模块化、依赖注入 | 学习曲线陡峭、过度设计 | 大型企业应用 |
| **Fastify** | 高性能、内置验证 | 生态较小 | 高并发场景 |
| **Koa** | 轻量、中间件优雅 | 文档和生态不如 Express | 需要 fine-grained 控制的场景 |

### 前端框架对比

| 框架 | 优势 | 劣势 | 适用场景 |
|------|------|------|---------|
| **React Native** | 跨平台、原生性能、生态丰富 | 需要学习原生开发 | iOS + Android 应用 |
| **Flutter** | 性能优秀、UI 一致 | Dart 语言生态较小 | 需要极致性能的场景 |
| **Ionic** | Web 技术栈、快速上手 | 非 Native 性能 | 简单混合应用 |

### 数据库对比

| 数据库 | 优势 | 劣势 | 适用场景 |
|--------|------|------|---------|
| **PostgreSQL** | 功能完整、性能优秀 | 需要独立部署 | 生产环境 |
| **SQLite** | 零配置、轻量 | 不支持并发写入 | 开发环境、小型应用 |
| **MySQL** | 流行、文档丰富 | 功能略逊 PostgreSQL | 传统 Web 应用 |

---

## 扩展建议

随着项目发展，可以考虑以下扩展：

### 短期扩展（v1.1）

- 添加 Redis 缓存层
- 引入 Elasticsearch 搜索
- 实现认证和授权（JWT）
- 添加 WebSocket 实时通信

### 中期扩展（v2.0）

- 迁移到微服务架构
- 引入消息队列（RabbitMQ/Kafka）
- 添加 CDN 加速
- 实现多语言支持

### 长期扩展

- 引入 GraphQL API
- 实现 Serverless 架构
- 添加 AI/ML 功能
- 实现多租户支持

---

## 下一课预告

> 下一课我们学习 **[CLI 命令参考](../cli-commands/)**。
>
> 你会学到：
> - `factory init` 如何初始化项目
> - `factory run` 如何运行流水线
> - `factory continue` 如何在新会话继续执行
> - 其他常用命令的参数和用法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能        | 文件路径                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------- |
| 技术栈总览   | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (第 211-230 行) |
| 技术架构指南 | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| 代码生成指南 | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| 后端模板     | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| 前端模板     | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**关键技术栈配置**：
- **后端**：Node.js + Express + Prisma + SQLite/PostgreSQL
- **前端**：React Native + Expo + React Navigation + Zustand
- **测试**：Vitest（后端）+ Jest（前端）
- **部署**：Docker + GitHub Actions

**为什么选择这些技术**：
- **简单优先**：零配置启动，快速验证想法
- **类型安全**：TypeScript + Prisma 类型自动生成
- **生产就绪**：完整测试、文档、部署配置
- **可扩展性**：预留缓存、消息队列等扩展点

</details>
