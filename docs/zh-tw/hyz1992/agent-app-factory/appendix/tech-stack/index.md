---
title: "技術堆疊詳解：Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "技術堆疊詳解"
subtitle: "技術堆疊詳解：了解生成應用使用的技術堆疊"
description: "深入瞭解 AI App Factory 生成的應用技術堆疊，包括後端（Node.js + Express + Prisma）和前端（React Native + Expo）的完整技術選型、工具鏈和最佳實踐。"
tags:
  - "技術堆疊"
  - "後端"
  - "前端"
  - "部署"
order: 240
---

# 技術堆疊詳解

AI App Factory 生成的應用使用一套經過驗證的生產就緒技術堆疊，專注於快速 MVP 開發和後續擴展性。本文檔詳細解釋每個技術選擇的原因和使用場景。

---

## 學完你能做什麼

- 了解生成應用的技術選型理由
- 掌握前後端技術堆疊的核心工具和框架
- 理解為什麼選擇這些技術而非其他方案
- 知道如何根據專案需求調整技術配置

---

## 核心技術概覽

生成的應用採用**全堆疊 TypeScript**方案，確保前後端類型安全和開發體驗一致。

| 層級 | 技術選型 | 版本 | 用途 |
|------|---------|------|------|
| **後端執行環境** | Node.js | 16+ | JavaScript 伺服器端執行環境 |
| **後端語言** | TypeScript | 5+ | 類型安全的 JavaScript 超集 |
| **後端框架** | Express | 4.x | 輕量級 Web 框架，構建 RESTful API |
| **ORM** | Prisma | 5.x | 類型安全的資料庫存取層 |
| **開發資料庫** | SQLite | - | 零配置檔案資料庫，快速原型 |
| **生產資料庫** | PostgreSQL | - | 生產環境關聯式資料庫 |
| **前端框架** | React Native | - | 跨平台行動應用開發 |
| **前端工具鏈** | Expo | - | React Native 開發和建構工具 |
| **前端導覽** | React Navigation | 6+ | 原生級導覽體驗 |
| **狀態管理** | React Context API | - | 輕量級狀態管理（MVP 階段） |
| **HTTP 客戶端** | Axios | - | 瀏覽器和 Node.js HTTP 客戶端 |

---

## 後端技術堆疊詳解

### Node.js + TypeScript

**為什麼選擇 Node.js？**

- ✅ **生態豐富**：npm 擁有全球最大的套件生態系統
- ✅ **前後端統一**：團隊只需掌握一門語言
- ✅ **開發效率高**：事件驅動、非阻塞 I/O 適合即時應用
- ✅ **社群活躍**：大量開源庫和解決方案

**為什麼選擇 TypeScript？**

- ✅ **類型安全**：編譯時捕獲錯誤，減少執行時期 bug
- ✅ **開發體驗好**：智慧提示、自動補全、重構支援
- ✅ **程式碼可維護**：明確的介面定義提升團隊協作效率
- ✅ **與 Prisma 完美配合**：自動生成類型定義

**配置範例**：

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

**為什麼選擇 Express？**

- ✅ **成熟穩定**：最受歡迎的 Node.js Web 框架
- ✅ **中介軟體豐富**：認證、日誌、CORS 等開箱即用
- ✅ **靈活性高**：不強制專案結構，可自由組織
- ✅ **社群支援好**：大量教學和問題解決方案

**典型專案結構**：

```
src/
├── config/         # 配置檔案
│   ├── swagger.ts  # Swagger API 文檔配置
│   └── index.ts    # 應用配置
├── lib/            # 工具庫
│   ├── logger.ts   # 日誌工具
│   └── prisma.ts   # Prisma 單例
├── middleware/     # 中介軟體
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # 路由定義
│   ├── items.ts
│   └── index.ts
├── controllers/    # 控制器層
│   ├── items.controller.ts
│   └── index.ts
├── services/       # 業務邏輯層
│   └── items.service.ts
├── validators/     # 輸入驗證
│   └── items.validator.ts
├── __tests__/      # 測試檔案
│   └── items.test.ts
├── app.ts          # Express 應用
└── index.ts        # 應用入口
```

**核心中介軟體**：

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// 安全中介軟體
app.use(helmet());                          // 安全標頭
app.use(cors(corsOptions));                 // CORS 配置

// 請求處理中介軟體
app.use(express.json());                    // JSON 解析
app.use(compression());                     // 回應壓縮
app.use(requestLogger);                    // 請求日誌

// 錯誤處理中介軟體（最後）
app.use(errorHandler);

export default app;
```

### Prisma ORM

**為什麼選擇 Prisma？**

- ✅ **類型安全**：自動生成 TypeScript 類型定義
- ✅ **遷移管理**：宣告式 schema，自動生成遷移腳本
- ✅ **開發體驗好**：IntelliSense 支援、錯誤提示清晰
- ✅ **多資料庫支援**：SQLite、PostgreSQL、MySQL 等
- ✅ **效能優秀**：查詢最佳化、連線池管理

**典型 Schema 範例**：

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // 開發環境
  // provider = "postgresql"   // 生產環境
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

  @@index([createdAt])  // 手動建立索引用於排序
}
```

**常用資料庫操作**：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 建立
const item = await prisma.item.create({
  data: { title: '午餐', amount: 25.5 }
});

// 查詢（支援分頁）
const items = await prisma.item.findMany({
  take: 20,       // 限制數量
  skip: 0,        // 偏移量
  orderBy: { createdAt: 'desc' }
});

// 更新
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: '晚餐' }
});

// 刪除
await prisma.item.delete({
  where: { id: 1 }
});
```

### 資料庫選擇

**開發環境：SQLite**

- ✅ **零配置**：檔案資料庫，無需安裝服務
- ✅ **快速啟動**：適合本地開發和快速迭代
- ✅ **可移植**：整個資料庫就是一個 `.db` 檔案
- ❌ **不支援並發寫入**：多程序同時寫入會衝突
- ❌ **不適合生產**：效能和並發能力有限

**生產環境：PostgreSQL**

- ✅ **功能完整**：支援複雜查詢、事務、JSON 類型
- ✅ **效能優秀**：支援高並發、複雜索引
- ✅ **穩定可靠**：企業級資料庫，久經考驗
- ✅ **生態成熟**：備份、監控工具豐富

**資料庫遷移策略**：

```bash
# 開發環境 - 使用 SQLite
DATABASE_URL="file:./dev.db"

# 生產環境 - 使用 PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database"

# 建立遷移
npx prisma migrate dev --name add_item_category

# 生產部署
npx prisma migrate deploy

# 重置資料庫（開發環境）
npx prisma migrate reset
```

---

## 前端技術堆疊詳解

### React Native + Expo

**為什麼選擇 React Native？**

- ✅ **跨平台**：一套程式碼執行在 iOS 和 Android
- ✅ **原生效能**：編譯為原生元件，非 WebView
- ✅ **熱更新**：Expo 支援無需重新發布的更新
- ✅ **元件豐富**：社群提供大量高品質元件

**為什麼選擇 Expo？**

- ✅ **快速啟動**：無需配置複雜的原生開發環境
- ✅ **統一工具鏈**：統一的開發、建構、部署流程
- ✅ **Expo Go**：掃碼即可在真機預覽
- ✅ **EAS Build**：雲端建構，支援 App Store 發布

**專案結構**：

```
src/
├── api/           # API 呼叫
│   ├── client.ts  # Axios 實例
│   └── items.ts   # Items API
├── components/    # 可複用元件
│   └── ui/        # 基礎 UI 元件
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # 自定義 Hooks
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # 導覽配置
│   └── RootNavigator.tsx
├── screens/       # 頁面元件
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # 樣式和主題
│   └── theme.ts
└── types/         # TypeScript 類型
    └── index.ts
```

**典型頁面範例**：

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
    return <Text>載入失敗: {error.message}</Text>;
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

**為什麼選擇 React Navigation？**

- ✅ **官方推薦**：React Native 官方導覽方案
- ✅ **類型安全**：TypeScript 支援完整的導覽參數類型
- ✅ **原生體驗**：提供堆疊導覽、標籤導覽等原生導覽模式
- ✅ **深度連結**：支援 URL Scheme 和深度連結

**導覽配置範例**：

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 定義導覽參數類型
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
          options={{ title: '首頁' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `詳情 ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 狀態管理

**React Context API（MVP 階段）**

適合簡單應用，零依賴：

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

**Zustand（中等複雜度應用）**

輕量級狀態管理庫，API 簡潔：

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

## 開發工具鏈

### 測試框架

**後端：Vitest**

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

### API 文檔：Swagger/OpenAPI

生成的應用自動包含 Swagger UI，可透過 `http://localhost:3000/api-docs` 存取。

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
  apis: ['./src/routes/*.ts'], // 掃描路由註解
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 日誌和監控

**後端日誌：winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// 使用範例
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**前端監控**：記錄 API 請求耗時、錯誤和效能指標。

---

## 部署工具

### Docker + docker-compose

生成的應用包含 `Dockerfile` 和 `docker-compose.yml`，支援容器化部署。

**docker-compose.yml 範例**：

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

自動化測試、建構和部署流程：

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

## 技術堆疊選擇原則

AI App Factory 選擇這套技術堆疊的核心原則：

### 1. 簡單優先

- 選擇成熟穩定的技術，降低學習成本
- 避免過度設計，聚焦核心功能
- 零配置啟動，快速驗證想法

### 2. 類型安全

- 前後端統一使用 TypeScript
- Prisma 自動生成資料庫類型
- React Navigation 類型安全的導覽參數

### 3. 生產就緒

- 包含完整的測試覆蓋
- 提供部署配置（Docker、CI/CD）
- 日誌、監控、錯誤處理完備

### 4. 可擴展性

- 預留擴展點（如快取、訊息佇列）
- 支援資料庫遷移（SQLite → PostgreSQL）
- 模組化架構，便於拆分和重構

### 5. MVP 聚焦

- 明確非目標，不引入認證、授權等非核心功能
- 頁面數量限制（最多 3 頁）
- 快速交付，後續迭代

---

## 常見問題

### Q: 為什麼不用 NestJS？

**A**: NestJS 是一個優秀的框架，但 MVP 階段過於複雜。Express 更輕量、更靈活，適合快速原型。如果後續專案規模增長，可以考慮遷移到 NestJS。

### Q: 為什麼不用 MongoDB？

**A**: 大多數 MVP 應用的資料模型是關聯式的，PostgreSQL 或 SQLite 更合適。MongoDB 適合文件型資料，除非明確需要 NoSQL 特性，否則不建議使用。

### Q: 為什麼不用 Redux？

**A**: Redux 適合大型應用，但學習成本高。MVP 階段使用 React Context API 或 Zustand 足夠。如果後續狀態管理變得複雜，可以再引入 Redux Toolkit。

### Q: 為什麼不用 GraphQL？

**A**: RESTful API 更簡單，適合大多數 CRUD 應用。GraphQL 的優勢在於靈活查詢和減少請求次數，但 MVP 階段 REST API 已經足夠，且 Swagger 文檔更完善。

### Q: 為什麼不用 Next.js？

**A**: Next.js 是 React 框架，適合 SSR 和 Web 應用。本專案目標是生成行動應用，React Native 是更好的選擇。如果需要 Web 版本，可以使用 React Native Web。

---

## 技術堆疊對比

### 後端框架對比

| 框架 | 優勢 | 劣勢 | 適用場景 |
|------|------|------|---------|
| **Express** | 輕量、靈活、生態豐富 | 需手動配置結構 | 中小型應用、API 服務 |
| **NestJS** | 類型安全、模組化、依賴注入 | 學習曲線陡峭、過度設計 | 大型企業應用 |
| **Fastify** | 高效能、內建驗證 | 生態較小 | 高並發場景 |
| **Koa** | 輕量、中介軟體優雅 | 文檔和生態不如 Express | 需要 fine-grained 控制的場景 |

### 前端框架對比

| 框架 | 優勢 | 劣勢 | 適用場景 |
|------|------|------|---------|
| **React Native** | 跨平台、原生效能、生態豐富 | 需要學習原生開發 | iOS + Android 應用 |
| **Flutter** | 效能優秀、UI 一致 | Dart 語言生態較小 | 需要極致效能的場景 |
| **Ionic** | Web 技術堆疊、快速上手 | 非 Native 效能 | 簡單混合應用 |

### 資料庫對比

| 資料庫 | 優勢 | 劣勢 | 適用場景 |
|--------|------|------|---------|
| **PostgreSQL** | 功能完整、效能優秀 | 需要獨立部署 | 生產環境 |
| **SQLite** | 零配置、輕量 | 不支援並發寫入 | 開發環境、小型應用 |
| **MySQL** | 流行、文檔豐富 | 功能略遜 PostgreSQL | 傳統 Web 應用 |

---

## 擴展建議

隨著專案發展，可以考慮以下擴展：

### 短期擴展（v1.1）

- 新增 Redis 快取層
- 引入 Elasticsearch 搜尋
- 實現認證和授權（JWT）
- 新增 WebSocket 即時通訊

### 中期擴展（v2.0）

- 遷移到微服務架構
- 引入訊息佇列（RabbitMQ/Kafka）
- 新增 CDN 加速
- 實現多語言支援

### 長期擴展

- 引入 GraphQL API
- 實現 Serverless 架構
- 新增 AI/ML 功能
- 實現多租戶支援

---

## 下一課預告

> 下一課我們學習 **[CLI 命令參考](../cli-commands/)**。
>
> 你會學到：
> - `factory init` 如何初始化專案
> - `factory run` 如何執行流水線
> - `factory continue` 如何在新會話繼續執行
> - 其他常用命令的參數和用法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 功能        | 檔案路徑                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------- |
| 技術堆疊總覽   | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (第 211-230 行) |
| 技術架構指南 | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| 程式碼生成指南 | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| 後端模板     | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| 前端模板     | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**關鍵技術堆疊配置**：
- **後端**：Node.js + Express + Prisma + SQLite/PostgreSQL
- **前端**：React Native + Expo + React Navigation + Zustand
- **測試**：Vitest（後端）+ Jest（前端）
- **部署**：Docker + GitHub Actions

**為什麼選擇這些技術**：
- **簡單優先**：零配置啟動，快速驗證想法
- **類型安全**：TypeScript + Prisma 類型自動生成
- **生產就緒**：完整測試、文檔、部署配置
- **可擴展性**：預留快取、訊息佇列等擴展點

</details>
