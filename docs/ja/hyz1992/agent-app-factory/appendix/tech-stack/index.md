---
title: "技術スタック詳細解説：Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "技術スタック詳細"
subtitle: "技術スタック詳細解説：生成アプリで使用される技術スタックを理解する"
description: "AI App Factory が生成するアプリの技術スタックを深く理解。バックエンド（Node.js + Express + Prisma）とフロントエンド（React Native + Expo）の完全な技術選定、ツールチェーン、ベストプラクティスを網羅。"
tags:
  - "技術スタック"
  - "バックエンド"
  - "フロントエンド"
  - "デプロイ"
order: 240
---

# 技術スタック詳細解説

AI App Factory が生成するアプリは、MVP 開発の迅速化と将来の拡張性に焦点を当てた、実証済みの本番対応型技術スタックを採用しています。このドキュメントでは、各技術選定の理由と使用シナリオを詳細に解説します。

---

## 学習内容

- 生成アプリの技術選定の理由を理解する
- バックエンドとフロントエンドの技術スタックのコアツールとフレームワークを習得する
- なぜ他の選択肢ではなくこれらの技術を選んだのかを理解する
- プロジェクト要件に応じて技術設定を調整する方法を知る

---

## コア技術概要

生成されたアプリは **フルスタック TypeScript** を採用し、バックエンドとフロントエンドの型安全性と一貫した開発体験を確保します。

| 層 | 技術選定 | バージョン | 用途 |
|------|---------|------|------|
| **バックエンド実行環境** | Node.js | 16+ | JavaScript サーバーサイド実行環境 |
| **バックエンド言語** | TypeScript | 5+ | 型安全な JavaScript スーパーセット |
| **バックエンドフレームワーク** | Express | 4.x | 軽量 Web フレームワーク、RESTful API 構築用 |
| **ORM** | Prisma | 5.x | 型安全なデータベースアクセス層 |
| **開発用データベース** | SQLite | - | ゼロ設定のファイルデータベース、高速プロトタイピング |
| **本番用データベース** | PostgreSQL | - | 本番環境向けリレーショナルデータベース |
| **フロントエンドフレームワーク** | React Native | - | クロスプラットフォームモバイルアプリ開発 |
| **フロントエンドツールチェーン** | Expo | - | React Native 開発・ビルドツール |
| **フロントエンドナビゲーション** | React Navigation | 6+ | ネイティブレベルのナビゲーション体験 |
| **ステート管理** | React Context API | - | 軽量ステート管理（MVP 段階） |
| **HTTP クライアント** | Axios | - | ブラウザと Node.js 用 HTTP クライアント |

---

## バックエンド技術スタック詳細解説

### Node.js + TypeScript

**なぜ Node.js を選んだのか？**

- ✅ **豊富なエコシステム**: npm は世界最大のパッケージエコシステムを誇る
- ✅ **フロントエンドとの統一**: チームは 1 つの言語だけで済む
- ✅ **高い開発効率**: イベント駆動・非ブロック I/O はリアルタイムアプリに最適
- ✅ **活発なコミュニティ**: 多数のオープンソースライブラリとソリューション

**なぜ TypeScript を選んだのか？**

- ✅ **型安全性**: コンパイル時にエラーを捕捉し、ランタイムバグを削減
- ✅ **優れた開発体験**: インテリセンス、自動補完、リファクタリングサポート
- ✅ **保守性**: 明確なインターフェース定義でチーム協業効率を向上
- ✅ **Prisma との完璧な連携**: 型定義の自動生成

**設定例**：

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

### Express フレームワーク

**なぜ Express を選んだのか？**

- ✅ **成熟した安定性**: 最も人気のある Node.js Web フレームワーク
- ✅ **豊富なミドルウェア**: 認証、ログ、CORS などがすぐに使える
- ✅ **高い柔軟性**: プロジェクト構造を強制せず、自由に組織化できる
- ✅ **優れたコミュニティサポート**: 多数のチュートリアルと問題解決ソリューション

**典型的なプロジェクト構造**：

```
src/
├── config/         # 設定ファイル
│   ├── swagger.ts  # Swagger API ドキュメント設定
│   └── index.ts    # アプリ設定
├── lib/            # ユーティリティライブラリ
│   ├── logger.ts   # ロガー
│   └── prisma.ts   # Prisma シングルトン
├── middleware/     # ミドルウェア
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # ルート定義
│   ├── items.ts
│   └── index.ts
├── controllers/    # コントローラー層
│   ├── items.controller.ts
│   └── index.ts
├── services/       # ビジネスロジック層
│   └── items.service.ts
├── validators/     # 入力バリデーション
│   └── items.validator.ts
├── __tests__/      # テストファイル
│   └── items.test.ts
├── app.ts          # Express アプリ
└── index.ts        # アプリエントリーポイント
```

**コアミドルウェア**：

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// セキュリティミドルウェア
app.use(helmet());                          // セキュリティヘッダー
app.use(cors(corsOptions));                 // CORS 設定

// リクエスト処理ミドルウェア
app.use(express.json());                    // JSON 解析
app.use(compression());                     // レスポンス圧縮
app.use(requestLogger);                    // リクエストログ

// エラーハンドリングミドルウェア（最後に配置）
app.use(errorHandler);

export default app;
```

### Prisma ORM

**なぜ Prisma を選んだのか？**

- ✅ **型安全性**: TypeScript 型定義の自動生成
- ✅ **マイグレーション管理**: 宣言的スキーマ、マイグレーションスクリプトの自動生成
- ✅ **優れた開発体験**: IntelliSense サポート、明確なエラーメッセージ
- ✅ **複数データベース対応**: SQLite、PostgreSQL、MySQL など
- ✅ **優れたパフォーマンス**: クエリ最適化、接続プール管理

**典型的なスキーマ例**：

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // 開発環境
  // provider = "postgresql"   // 本番環境
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

  @@index([createdAt])  // ソート用に手動でインデックス作成
}
```

**一般的なデータベース操作**：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 作成
const item = await prisma.item.create({
  data: { title: '昼食', amount: 25.5 }
});

// クエリ（ページネーション対応）
const items = await prisma.item.findMany({
  take: 20,       // 数量制限
  skip: 0,        // オフセット
  orderBy: { createdAt: 'desc' }
});

// 更新
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: '夕食' }
});

// 削除
await prisma.item.delete({
  where: { id: 1 }
});
```

### データベース選択

**開発環境：SQLite**

- ✅ **ゼロ設定**: ファイルデータベース、サービスのインストール不要
- ✅ **高速起動**: ローカル開発と高速イテレーションに最適
- ✅ **移植性**: データベース全体が 1 つの `.db` ファイル
- ❌ **同時書き込み非対応**: マルチプロセスでの同時書き込みで競合発生
- ❌ **本番には不適**: パフォーマンスと同時実行能力に制限あり

**本番環境：PostgreSQL**

- ✅ **完全な機能**: 複雑なクエリ、トランザクション、JSON 型をサポート
- ✅ **優れたパフォーマンス**: 高同時実行、複雑なインデックスをサポート
- ✅ **安定性と信頼性**: エンタープライズ級データベース、実績豊富
- ✅ **成熟したエコシステム**: バックアップ、監視ツールが豊富

**データベースマイグレーション戦略**：

```bash
# 開発環境 - SQLite を使用
DATABASE_URL="file:./dev.db"

# 本番環境 - PostgreSQL を使用
DATABASE_URL="postgresql://user:password@host:5432/database"

# マイグレーション作成
npx prisma migrate dev --name add_item_category

# 本番デプロイ
npx prisma migrate deploy

# データベースリセット（開発環境）
npx prisma migrate reset
```

---

## フロントエンド技術スタック詳細解説

### React Native + Expo

**なぜ React Native を選んだのか？**

- ✅ **クロスプラットフォーム**: 1 つのコードベースで iOS と Android に対応
- ✅ **ネイティブパフォーマンス**: ネイティブコンポーネントにコンパイルされ、WebView ではない
- ✅ **OTA アップデート**: Expo は再公開なしのアップデートをサポート
- ✅ **豊富なコンポーネント**: コミュニティが多数の高品質コンポーネントを提供

**なぜ Expo を選んだのか？**

- ✅ **高速起動**: 複雑なネイティブ開発環境の設定不要
- ✅ **統一されたツールチェーン**: 開発、ビルド、デプロイの一貫したフロー
- ✅ **Expo Go**: QR コードスキャンで実機プレビューが可能
- ✅ **EAS Build**: クラウドビルド、App Store 公開をサポート

**プロジェクト構造**：

```
src/
├── api/           # API 呼び出し
│   ├── client.ts  # Axios インスタンス
│   └── items.ts   # Items API
├── components/    # 再利用可能なコンポーネント
│   └── ui/        # 基本 UI コンポーネント
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # カスタム Hooks
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # ナビゲーション設定
│   └── RootNavigator.tsx
├── screens/       # 画面コンポーネント
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # スタイルとテーマ
│   └── theme.ts
└── types/         # TypeScript 型
    └── index.ts
```

**典型的な画面例**：

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
    return <Text>読み込み失敗: {error.message}</Text>;
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

**なぜ React Navigation を選んだのか？**

- ✅ **公式推奨**: React Native 公式ナビゲーションソリューション
- ✅ **型安全**: TypeScript による完全なナビゲーション引数型サポート
- ✅ **ネイティブ体験**: スタックナビゲーション、タブナビゲーションなどのネイティブナビゲーションパターンを提供
- ✅ **ディープリンク**: URL Scheme とディープリンクをサポート

**ナビゲーション設定例**：

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ナビゲーション引数型定義
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
          options={{ title: 'ホーム' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `詳細 ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### ステート管理

**React Context API（MVP 段階）**

シンプルなアプリに適しており、依存関係ゼロ：

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

**Zustand（中程度の複雑さのアプリ）**

軽量ステート管理ライブラリ、シンプルな API：

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
      { name: 'items-storage' } // AsyncStorage に永続化
    )
  )
);
```

---

## 開発ツールチェーン

### テストフレームワーク

**バックエンド：Vitest**

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

**フロントエンド：Jest + React Native Testing Library**

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

### API ドキュメント：Swagger/OpenAPI

生成されたアプリには自動的に Swagger UI が含まれ、`http://localhost:3000/api-docs` からアクセス可能です。

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
  apis: ['./src/routes/*.ts'], // ルートコメントをスキャン
};

export const swaggerSpec = swaggerJsdoc(options);
```

### ログと監視

**バックエンドログ：winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// 使用例
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**フロントエンド監視**: API リクエスト時間、エラー、パフォーマンス指標を記録します。

---

## デプロイツール

### Docker + docker-compose

生成されたアプリには `Dockerfile` と `docker-compose.yml` が含まれ、コンテナ化デプロイをサポートします。

**docker-compose.yml 例**：

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

自動テスト、ビルド、デプロイフロー：

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

## 技術スタック選定の原則

AI App Factory がこの技術スタックを選んだコア原則：

### 1. シンプル優先

- 成熟した安定した技術を選び、学習コストを削減
- 過度な設計を避け、コア機能に集中
- ゼロ設定で起動し、アイデアを素早く検証

### 2. 型安全

- フロントエンドとバックエンドで TypeScript を統一
- Prisma によるデータベース型の自動生成
- 型安全なナビゲーション引数（React Navigation）

### 3. 本番対応

- 完全なテストカバレッジを含む
- デプロイ設定を提供（Docker、CI/CD）
- ログ、監視、エラーハンドリングが完備

### 4. 拡張性

- 拡張ポイントを予め用意（キャッシュ、メッセージキューなど）
- データベースマイグレーションをサポート（SQLite → PostgreSQL）
- モジュラーアーキテクチャで分割とリファクタリングを容易に

### 5. MVP に集中

- 非目標を明確にし、認証・承認などの非コア機能は導入しない
- 画面数を制限（最大 3 ページ）
- 高速デリバリー、後続のイテレーション

---

## よくある質問

### Q: なぜ NestJS を使わないのですか？

**A**: NestJS は優秀なフレームワークですが、MVP 段階では複雑すぎます。Express はより軽量で柔軟性が高く、高速なプロトタイピングに適しています。後続のプロジェクト規模が大きくなれば、NestJS への移行を検討できます。

### Q: なぜ MongoDB を使わないのですか？

**A**: 大多数の MVP アプリのデータモデルはリレーショナル型であり、PostgreSQL または SQLite がより適しています。MongoDB はドキュメント型データに適していますが、明確に NoSQL 特性が必要でない限り、使用は推奨されません。

### Q: なぜ Redux を使わないのですか？

**A**: Redux は大規模アプリに適していますが、学習コストが高いです。MVP 段階では React Context API または Zustand で十分です。後続でステート管理が複雑になってから Redux Toolkit を導入できます。

### Q: なぜ GraphQL を使わないのですか？

**A**: RESTful API はよりシンプルで、大多数の CRUD アプリに適しています。GraphQL の利点は柔軟なクエリとリクエスト回数の削減ですが、MVP 段階では REST API で十分であり、Swagger ドキュメントもより充実しています。

### Q: なぜ Next.js を使わないのですか？

**A**: Next.js は React フレームワークであり、SSR と Web アプリに適しています。このプロジェクトの目標はモバイルアプリの生成であり、React Native がより良い選択です。Web 版が必要な場合は、React Native Web を使用できます。

---

## 技術スタック比較

### バックエンドフレームワーク比較

| フレームワーク | 利点 | 欠点 | 適用シナリオ |
|------|------|------|---------|
| **Express** | 軽量、柔軟性、豊富なエコシステム | 手動で構造を設定する必要がある | 中小規模アプリ、API サービス |
| **NestJS** | 型安全、モジュラー、依存性注入 | 急な学習曲線、過度な設計 | 大企業向けアプリ |
| **Fastify** | 高パフォーマンス、内蔵バリデーション | エコシステムが小さい | 高同時実行シナリオ |
| **Koa** | 軽量、エレガントなミドルウェア | ドキュメントとエコシステムは Express に劣る | 細かい制御が必要なシナリオ |

### フロントエンドフレームワーク比較

| フレームワーク | 利点 | 欠点 | 適用シナリオ |
|------|------|------|---------|
| **React Native** | クロスプラットフォーム、ネイティブパフォーマンス、豊富なエコシステム | ネイティブ開発の学習が必要 | iOS + Android アプリ |
| **Flutter** | 優れたパフォーマンス、UI の一貫性 | Dart 言語のエコシステムが小さい | 最高パフォーマンスが必要なシナリオ |
| **Ionic** | Web 技術スタック、高速習得 | ネイティブパフォーマンスではない | シンプルなハイブリッドアプリ |

### データベース比較

| データベース | 利点 | 欠点 | 適用シナリオ |
|--------|------|------|---------|
| **PostgreSQL** | 完全な機能、優れたパフォーマンス | 独立したデプロイが必要 | 本番環境 |
| **SQLite** | ゼロ設定、軽量 | 同時書き込み非対応 | 開発環境、小規模アプリ |
| **MySQL** | 人気、豊富なドキュメント | 機能は PostgreSQL やや劣る | 従来の Web アプリ |

---

## 拡張の提案

プロジェクトの成長に伴い、以下の拡張を検討できます：

### 短期的な拡張（v1.1）

- Redis キャッシュ層の追加
- Elasticsearch 検索の導入
- 認証と承認の実装（JWT）
- WebSocket リアルタイム通信の追加

### 中期的な拡張（v2.0）

- マイクロサービスアーキテクチャへの移行
- メッセージキューの導入（RabbitMQ/Kafka）
- CDN 加速の追加
- 多言語対応の実装

### 長期的な拡張

- GraphQL API の導入
- Serverless アーキテクチャの実装
- AI/ML 機能の追加
- マルチテナント対応の実装

---

## 次の回の予告

> 次の回では **[CLI コマンドリファレンス](../cli-commands/)** を学びます。
>
> 学べること：
> - `factory init` でプロジェクトを初期化する方法
> - `factory run` でパイプラインを実行する方法
> - `factory continue` で新しいセッションで実行を続ける方法
> - その他のよく使うコマンドの引数と使い方

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-29

| 機能        | ファイルパス                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------- |
| 技術スタック概要   | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (第 211-230 行) |
| 技術アーキテクチャガイド | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| コード生成ガイド | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| バックエンドテンプレート     | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| フロントエンドテンプレート     | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**主要な技術スタック設定**：
- **バックエンド**：Node.js + Express + Prisma + SQLite/PostgreSQL
- **フロントエンド**：React Native + Expo + React Navigation + Zustand
- **テスト**：Vitest（バックエンド）+ Jest（フロントエンド）
- **デプロイ**：Docker + GitHub Actions

**なぜこれらの技術を選んだのか**：
- **シンプル優先**：ゼロ設定で起動、アイデアを素早く検証
- **型安全**：TypeScript + Prisma による型自動生成
- **本番対応**：完全なテスト、ドキュメント、デプロイ設定
- **拡張性**：キャッシュ、メッセージキューなどの拡張ポイントを用意

</details>
