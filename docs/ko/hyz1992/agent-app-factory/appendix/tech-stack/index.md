---
title: "기술 스택 상세: Node.js + Express + Prisma + React Native | Agent App Factory"
sidebarTitle: "기술 스택 상세"
subtitle: "기술 스택 상세: 생성 앱에 사용되는 기술 스택 이해"
description: "AI App Factory가 생성하는 앱의 기술 스택을 심층적으로 이해하세요. 백엔드(Node.js + Express + Prisma)와 프론트엔드(React Native + Expo)의 전체 기술 선택, 도구 체인 및 모범 사례를 다룹니다."
tags:
  - "기술 스택"
  - "백엔드"
  - "프론트엔드"
  - "배포"
order: 240
---

# 기술 스택 상세

AI App Factory가 생성하는 앱은 빠른 MVP 개발과 향후 확장성에 중점을 둔 검증된 프로덕션 준비 기술 스택을 사용합니다. 이 문서에서는 각 기술 선택의 이유와 사용 시나리오를 자세히 설명합니다.

---

## 학습 완료 후 달성할 수 있는 것

- 생성 앱의 기술 선택 이유 이해
- 프론트엔드 및 백엔드 기술 스택의 핵심 도구와 프레임워크 숙달
- 다른 솔루션 대신 이 기술들을 선택한 이유 이해
- 프로젝트 요구사항에 따라 기술 구성을 조정하는 방법 파악

---

## 핵심 기술 개요

생성된 앱은 프론트엔드와 백엔드의 유형 안전성과 개발 경험을 일관되게 유지하는 **풀스택 TypeScript** 솔루션을 채택합니다.

| 레벨 | 기술 선택 | 버전 | 용도 |
|------|---------|------|------|
| **백엔드 런타임** | Node.js | 16+ | JavaScript 서버 측 실행 환경 |
| **백엔드 언어** | TypeScript | 5+ | 유형 안전 JavaScript 슈퍼셋 |
| **백엔드 프레임워크** | Express | 4.x | RESTful API 구축을 위한 경량 웹 프레임워크 |
| **ORM** | Prisma | 5.x | 유형 안전 데이터베이스 액세스 레이어 |
| **개발 데이터베이스** | SQLite | - | 설정 불필요 파일 데이터베이스, 빠른 프로토타이핑 |
| **프로덕션 데이터베이스** | PostgreSQL | - | 프로덕션 환경 관계형 데이터베이스 |
| **프론트엔드 프레임워크** | React Native | - | 크로스 플랫폼 모바일 앱 개발 |
| **프론트엔드 도구 체인** | Expo | - | React Native 개발 및 빌드 도구 |
| **프론트엔드 네비게이션** | React Navigation | 6+ | 네이티브 수준 네비게이션 경험 |
| **상태 관리** | React Context API | - | 경량 상태 관리 (MVP 단계) |
| **HTTP 클라이언트** | Axios | - | 브라우저 및 Node.js HTTP 클라이언트 |

---

## 백엔드 기술 스택 상세

### Node.js + TypeScript

**Node.js를 선택한 이유는 무엇인가요?**

- ✅ **풍부한 에코시스템**: npm은 세계 최대의 패키지 에코시스템을 보유
- ✅ **프론트엔드와 백엔드 통일**: 팀이 단일 언어만 숙지하면 됨
- ✅ **높은 개발 효율성**: 이벤트 기반, 논블로킹 I/O는 실시간 앱에 적합
- ✅ **활성 커뮤니티**: 풍부한 오픈 소스 라이브러리 및 솔루션

**TypeScript를 선택한 이유는 무엇인가요?**

- ✅ **유형 안전성**: 컴파일 시점에 오류를 포착, 런타임 버그 감소
- ✅ **우수한 개발 경험**: 스마트 힌트, 자동 완성, 리팩터링 지원
- ✅ **코드 유지보수성**: 명확한 인터페이스 정의는 팀 협업 효율성 향상
- ✅ **Prisma와 완벽한 조화**: 유형 정의 자동 생성

**구성 예시**:

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

### Express 프레임워크

**Express를 선택한 이유는 무엇인가요?**

- ✅ **성숙하고 안정적**: 가장 인기 있는 Node.js 웹 프레임워크
- ✅ **풍부한 미들웨어**: 인증, 로깅, CORS 등 즉시 사용 가능
- ✅ **높은 유연성**: 프로젝트 구조를 강제하지 않고 자유롭게 구성 가능
- ✅ **좋은 커뮤니티 지원**: 풍부한 튜토리얼 및 문제 해결 방안

**전형적인 프로젝트 구조**:

```
src/
├── config/         # 구성 파일
│   ├── swagger.ts  # Swagger API 문서 구성
│   └── index.ts    # 애플리케이션 구성
├── lib/            # 유틸리티 라이브러리
│   ├── logger.ts   # 로깅 도구
│   └── prisma.ts   # Prisma 싱글톤
├── middleware/     # 미들웨어
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── routes/         # 라우터 정의
│   ├── items.ts
│   └── index.ts
├── controllers/    # 컨트롤러 레이어
│   ├── items.controller.ts
│   └── index.ts
├── services/       # 비즈니스 로직 레이어
│   └── items.service.ts
├── validators/     # 입력 유효성 검사
│   └── items.validator.ts
├── __tests__/      # 테스트 파일
│   └── items.test.ts
├── app.ts          # Express 애플리케이션
└── index.ts        # 애플리케이션 엔트리 포인트
```

**핵심 미들웨어**:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// 보안 미들웨어
app.use(helmet());                          // 보안 헤더
app.use(cors(corsOptions));                 // CORS 구성

// 요청 처리 미들웨어
app.use(express.json());                    // JSON 파싱
app.use(compression());                     // 응답 압축
app.use(requestLogger);                    // 요청 로깅

// 오류 처리 미들웨어 (마지막)
app.use(errorHandler);

export default app;
```

### Prisma ORM

**Prisma를 선택한 이유는 무엇인가요?**

- ✅ **유형 안전성**: TypeScript 유형 정의 자동 생성
- ✅ **마이그레이션 관리**: 선언적 스키마, 마이그레이션 스크립트 자동 생성
- ✅ **우수한 개발 경험**: IntelliSense 지원, 명확한 오류 메시지
- ✅ **다중 데이터베이스 지원**: SQLite, PostgreSQL, MySQL 등
- ✅ **우수한 성능**: 쿼리 최적화, 연결 풀 관리

**전형적인 스키마 예시**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"           // 개발 환경
  // provider = "postgresql"   // 프로덕션 환경
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

  @@index([createdAt])  // 정렬을 위한 수동 인덱스 생성
}
```

**일반적인 데이터베이스 작업**:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 생성
const item = await prisma.item.create({
  data: { title: '점심', amount: 25.5 }
});

// 조회 (페이지네이션 지원)
const items = await prisma.item.findMany({
  take: 20,       // 수량 제한
  skip: 0,        // 오프셋
  orderBy: { createdAt: 'desc' }
});

// 업데이트
const updated = await prisma.item.update({
  where: { id: 1 },
  data: { title: '저녁' }
});

// 삭제
await prisma.item.delete({
  where: { id: 1 }
});
```

### 데이터베이스 선택

**개발 환경: SQLite**

- ✅ **설정 불필요**: 파일 데이터베이스, 서버 설치 불필요
- ✅ **빠른 시작**: 로컬 개발 및 빠른 반복에 적합
- ✅ **이식성**: 전체 데이터베이스가 `.db` 파일 하나
- ❌ **동시 쓰기 미지원**: 여러 프로세스가 동시에 쓰면 충돌 발생
- ❌ **프로덕션 부적합**: 성능 및 동시 처리 능력 제한

**프로덕션 환경: PostgreSQL**

- ✅ **완전한 기능**: 복잡한 쿼리, 트랜잭션, JSON 유형 지원
- ✅ **우수한 성능**: 높은 동시성, 복잡한 인덱스 지원
- ✅ **안정적이고 신뢰성 있는 엔터프라이즈급 데이터베이스, 검증됨**
- ✅ **성숙한 에코시스템**: 백업, 모니터링 도구 풍부

**데이터베이스 마이그레이션 전략**:

```bash
# 개발 환경 - SQLite 사용
DATABASE_URL="file:./dev.db"

# 프로덕션 환경 - PostgreSQL 사용
DATABASE_URL="postgresql://user:password@host:5432/database"

# 마이그레이션 생성
npx prisma migrate dev --name add_item_category

# 프로덕션 배포
npx prisma migrate deploy

# 데이터베이스 재설정 (개발 환경)
npx prisma migrate reset
```

---

## 프론트엔드 기술 스택 상세

### React Native + Expo

**React Native를 선택한 이유는 무엇인가요?**

- ✅ **크로스 플랫폼**: 단일 코드로 iOS와 Android에서 실행
- ✅ **네이티브 성능**: WebView가 아닌 네이티브 컴포넌트로 컴파일
- ✅ **핫 업데이트**: Expo는 재배포 없이 업데이트 지원
- ✅ **풍부한 컴포넌트**: 커뮤니티가 제공하는 고품질 컴포넌트

**Expo를 선택한 이유는 무엇인가요?**

- ✅ **빠른 시작**: 복잡한 네이티브 개발 환경 설정 불필요
- ✅ **통일된 도구 체인**: 통합된 개발, 빌드, 배포 프로세스
- ✅ **Expo Go**: QR 코드 스캔으로 실제 기기에서 미리보기
- ✅ **EAS Build**: 클라우드 빌드, App Store 출시 지원

**프로젝트 구조**:

```
src/
├── api/           # API 호출
│   ├── client.ts  # Axios 인스턴스
│   └── items.ts   # Items API
├── components/    # 재사용 가능한 컴포넌트
│   └── ui/        # 기본 UI 컴포넌트
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── hooks/         # 커스텀 Hooks
│   ├── useItems.ts
│   └── useAsync.ts
├── navigation/    # 네비게이션 구성
│   └── RootNavigator.tsx
├── screens/       # 페이지 컴포넌트
│   ├── HomeScreen.tsx
│   ├── DetailScreen.tsx
│   └── __tests__/
├── styles/        # 스타일 및 테마
│   └── theme.ts
└── types/         # TypeScript 유형
    └── index.ts
```

**전형적인 페이지 예시**:

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
    return <Text>로드 실패: {error.message}</Text>;
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

**React Navigation을 선택한 이유는 무엇인가요?**

- ✅ **공식 추천**: React Native 공식 네비게이션 솔루션
- ✅ **유형 안전성**: 완전한 네비게이션 매개변수 유형 지원
- ✅ **네이티브 경험**: 스택 네비게이션, 탭 네비게이션 등 네이티브 네비게이션 모드 제공
- ✅ **딥 링크**: URL Scheme 및 딥 링크 지원

**네비게이션 구성 예시**:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 네비게이션 매개변수 유형 정의
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
          options={{ title: '홈' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({ title: `상세 ${route.params.itemId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 상태 관리

**React Context API (MVP 단계)**

간단한 앱에 적합, 의존성 없음:

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

**Zustand (중등 복잡도 앱)**

경량 상태 관리 라이브러리, API 간결:

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
      { name: 'items-storage' } // AsyncStorage에 지속성 저장
    )
  )
);
```

---

## 개발 도구 체인

### 테스트 프레임워크

**백엔드: Vitest**

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

**프론트엔드: Jest + React Native Testing Library**

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

### API 문서: Swagger/OpenAPI

생성된 앱은 Swagger UI를 자동 포함하며, `http://localhost:3000/api-docs`에서 액세스할 수 있습니다.

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
  apis: ['./src/routes/*.ts'], // 라우터 주석 스캔
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 로깅 및 모니터링

**백엔드 로깅: winston**

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

// 사용 예시
logger.info('Item created', { itemId: 1 });
logger.error('Failed to create item', { error: 'Database error' });
```

**프론트엔드 모니터링**: API 요청 소요 시간, 오류 및 성능 메트릭 기록.

---

## 배포 도구

### Docker + docker-compose

생성된 앱은 `Dockerfile` 및 `docker-compose.yml`을 포함하며, 컨테이너화 배포를 지원합니다.

**docker-compose.yml 예시**:

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

자동화된 테스트, 빌드 및 배포 파이프라인:

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

## 기술 스택 선택 원칙

AI App Factory가 이 기술 스택을 선택한 핵심 원칙:

### 1. 간단함 우선

- 성숙하고 안정적인 기술 선택, 학습 비용 감소
- 과도한 설계 방지, 핵심 기능에 집중
- 설정 불필요 시작, 아이디어 빠른 검증

### 2. 유형 안전성

- 프론트엔드와 백엔드 모두 TypeScript 사용
- Prisma 데이터베이스 유형 자동 생성
- React Navigation 유형 안전 네비게이션 매개변수

### 3. 프로덕션 준비

- 완전한 테스트 커버리지 포함
- 배포 구성 제공 (Docker, CI/CD)
- 로깅, 모니터링, 오류 처리 완비

### 4. 확장성

- 확장 포인트 예약 (예: 캐싱, 메시지 큐)
- 데이터베이스 마이그레이션 지원 (SQLite → PostgreSQL)
- 모듈형 아키텍처, 분리 및 리팩터링 용이

### 5. MVP 중점

- 비목표 명확화, 인증, 권한 등 비핵심 기능 미도입
- 페이지 수 제한 (최대 3페이지)
- 빠른 전달, 이후 반복

---

## 자주 묻는 질문

### Q: NestJS를 사용하지 않는 이유는 무엇인가요?

**A**: NestJS는 우수한 프레임워크지만, MVP 단계에서는 너무 복잡합니다. Express가 더 경량이고 유연하며, 빠른 프로토타이핑에 적합합니다. 이후 프로젝트 규모가 증가하면 NestJS로의 마이그레이션을 고려할 수 있습니다.

### Q: MongoDB를 사용하지 않는 이유는 무엇인가요?

**A**: 대부분의 MVP 앱 데이터 모델은 관계형이며, PostgreSQL 또는 SQLite가 더 적합합니다. MongoDB는 문서형 데이터에 적합하며, 명확한 NoSQL 특성이 필요하지 않은 한 권장되지 않습니다.

### Q: Redux를 사용하지 않는 이유는 무엇인가요?

**A**: Redux는 대형 앱에 적합하지만, 학습 비용이 높습니다. MVP 단계에서 React Context API 또는 Zustand가 충분합니다. 이후 상태 관리가 복잡해지면 Redux Toolkit을 도입할 수 있습니다.

### Q: GraphQL을 사용하지 않는 이유는 무엇인가요?

**A**: RESTful API가 더 간단하며, 대부분의 CRUD 앱에 적합합니다. GraphQL의 장점은 유연한 쿼리와 요청 횟수 감소이지만, MVP 단계에서 REST API가 충분하며, Swagger 문서가 더 완전합니다.

### Q: Next.js를 사용하지 않는 이유는 무엇인가요?

**A**: Next.js는 React 프레임워크로 SSR 및 웹 앱에 적합합니다. 이 프로젝트는 모바일 앱 생성을 목표로 하므로, React Native가 더 적합합니다. 웹 버전이 필요한 경우 React Native Web을 사용할 수 있습니다.

---

## 기술 스택 비교

### 백엔드 프레임워크 비교

| 프레임워크 | 장점 | 단점 | 적용 시나리오 |
|------|------|------|---------|
| **Express** | 경량, 유연, 에코시스템 풍부 | 구조 수동 구성 필요 | 중소형 앱, API 서비스 |
| **NestJS** | 유형 안전, 모듈형, 의존성 주입 | 학습 곡선 가파름, 과도한 설계 | 대형 엔터프라이즈 앱 |
| **Fastify** | 높은 성능, 내장 유효성 검사 | 작은 에코시스템 | 높은 동시성 시나리오 |
| **Koa** | 경량, 우아한 미들웨어 | Express보다 문서 및 에코시스템 낮음 | 세분화된 제어 필요 시나리오 |

### 프론트엔드 프레임워크 비교

| 프레임워크 | 장점 | 단점 | 적용 시나리오 |
|------|------|------|---------|
| **React Native** | 크로스 플랫폼, 네이티브 성능, 에코시스템 풍부 | 네이티브 개발 학습 필요 | iOS + Android 앱 |
| **Flutter** | 우수한 성능, UI 일관성 | Dart 언어 에코시스템 작음 | 극도의 성능 필요 시나리오 |
| **Ionic** | 웹 기술 스택, 빠른 시작 | 네이티브 성능 아님 | 간단한 하이브리드 앱 |

### 데이터베이스 비교

| 데이터베이스 | 장점 | 단점 | 적용 시나리오 |
|--------|------|------|---------|
| **PostgreSQL** | 완전한 기능, 우수한 성능 | 독립 배포 필요 | 프로덕션 환경 |
| **SQLite** | 설정 불필요, 경량 | 동시 쓰기 미지원 | 개발 환경, 소형 앱 |
| **MySQL** | 인기, 풍부한 문서 | PostgreSQL보다 기능 떨어짐 | 전통적 웹 앱 |

---

## 확장 제안

프로젝트 발전에 따라 다음 확장을 고려할 수 있습니다:

### 단기 확장 (v1.1)

- Redis 캐싱 레이어 추가
- Elasticsearch 검색 도입
- 인증 및 권한 구현 (JWT)
- WebSocket 실시간 통신 추가

### 중기 확장 (v2.0)

- 마이크로서비스 아키텍처로 마이그레이션
- 메시지 큐 도입 (RabbitMQ/Kafka)
- CDN 가속 추가
- 다국어 지원 구현

### 장기 확장

- GraphQL API 도입
- Serverless 아키텍처 구현
- AI/ML 기능 추가
- 멀티테넌트 지원 구현

---

## 다음 수업 예고

> 다음 수업에서는 **[CLI 명령 참조](../cli-commands/)**을 학습합니다.
>
> 배우게 될 내용:
> - `factory init`로 프로젝트를 초기화하는 방법
> - `factory run`으로 파이프라인을 실행하는 방법
> - `factory continue`로 새 세션에서 실행을 계속하는 방법
> - 기타 일반 명령의 매개변수 및 사용법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 날짜: 2026-01-29

| 기능        | 파일 경위                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------- |
| 기술 스택 개요   | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L211-L230) (행 211-230) |
| 기술 아키텍처 가이드 | [`skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) |
| 코드 생성 가이드 | [`skills/code/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/skill.md) |
| 백엔드 템플릿     | [`skills/code/references/backend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/backend-template.md) |
| 프론트엔드 템플릿     | [`skills/code/references/frontend-template.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/code/references/frontend-template.md) |

**핵심 기술 스택 구성**:
- **백엔드**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **프론트엔드**: React Native + Expo + React Navigation + Zustand
- **테스트**: Vitest (백엔드) + Jest (프론트엔드)
- **배포**: Docker + GitHub Actions

**이러한 기술을 선택한 이유**:
- **간단함 우선**: 설정 불필요 시작, 아이디어 빠른 검증
- **유형 안전성**: TypeScript + Prisma 유형 자동 생성
- **프로덕션 준비**: 완전한 테스트, 문서, 배포 구성
- **확장성**: 캐싱, 메시지 큐 등 확장 포인트 예약

</details>
