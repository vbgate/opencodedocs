---
title: "기술 아키텍처 설계: Tech 단계 완전 가이드 | Agent App Factory 튜토리얼"
sidebarTitle: "기술 아키텍처 설계"
subtitle: "기술 아키텍처 설계: Tech 단계 완전 가이드"
description: "AI App Factory의 Tech 단계에서 PRD를 기반으로 최소 실행 가능한 기술 아키텍처와 Prisma 데이터 모델을 설계하는 방법을 학습하세요. 기술 스택 선택, 데이터 모델 설계, API 정의 및 데이터베이스 마이그레이션 전략을 포함합니다."
tags:
  - "기술 아키텍처"
  - "데이터 모델"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
order: 110
---

# 기술 아키텍처 설계: Tech 단계 완전 가이드

## 이 챕터에서 배우는 것

이 챕터를 완료하면 다음을 수행할 수 있습니다:

- Tech Agent가 PRD를 기반으로 기술 아키텍처를 설계하는 방법 이해
- Prisma 스키마 설계 방법과 제약 조건 마스터
- 기술 스택 선택의 의사결정 원칙 이해
- MVP에 적합한 데이터 모델과 API 설계 방법 학습
- SQLite 개발 환경과 PostgreSQL 프로덕션 환경 간의 마이그레이션 전략 이해

## 현재 당신이 직면한 문제

PRD가 이미 작성되어 있고, 어떤 기능을 구현해야 하는지는 알지만 다음을 모릅니다:

- 어떤 기술 스택을 선택해야 할까요? Node.js인가요 Python인가요?
- 데이터 테이블을 어떻게 설계해야 할까요? 관계는 어떻게 정의할까요?
- API 엔드포인트에는 어떤 것들이 있어야 할까요? 어떤 표준을 따라야 할까요?
- 빠른 배포와 미래 확장을 모두 보장하는 설계는 어떻게 해야 할까요?

Tech 단계는 이러한 문제를 해결합니다. PRD를 기반으로 자동으로 기술 아키텍처와 데이터 모델을 생성합니다.

## 언제 사용하는가

Tech 단계는 파이프라인의 4번째 단계로, UI 단계 다음에 오며 Code 단계 이전에 실행됩니다.

**일반적인 사용 시나리오**:

| 시나리오 | 설명 |
| ---- | ---- |
| 새 프로젝트 시작 | PRD가 확정된 후 기술 방안 설계가 필요함 |
| MVP 빠른 프로토타입 | 최소 실행 가능한 기술 아키텍처 필요, 과도 설계 방지 |
| 기술 스택 의사결정 | 어떤 기술 조합이 가장 적합한지 불확실함 |
| 데이터 모델 설계 | 명확한 엔티티 관계와 필드 정의 필요 |

**적용되지 않는 시나리오**:

- 이미 명확한 기술 아키텍처가 있는 프로젝트 (Tech 단계가 다시 설계함)
- 프론트엔드 또는 백엔드 중 하나만 개발 (Tech 단계는 전체 스택 아키텍처를 설계함)
- 마이크로서비스 아키텍처 필요 (MVP 단계에서 권장하지 않음)

## 🎒 시작 전 준비

::: warning 전제 조건

이 챕터는 다음을 이미 완료했다고 가정합니다:

1. **PRD 단계 완료**: `artifacts/prd/prd.md` 파일이 존재하고 검증을 통과해야 함
2. **제품 요구사항 이해**: 핵심 기능, 사용자 스토리, MVP 범위를 명확히 이해
3. **기본 개념 숙지**: RESTful API, 관계형 데이터베이스, ORM의 기본 개념 이해

:::

**이해해야 할 개념**:

::: info Prisma란?

Prisma는 TypeScript/Node.js에서 데이터베이스를 조작하는 현대적인 ORM(객체 관계 매핑) 도구입니다.

**핵심 장점**:

- **타입 안전성**: TypeScript 타입을 자동 생성하여 개발 시 완전한 자동 완성 제공
- **마이그레이션 관리**: `prisma migrate dev`로 데이터베이스 변경 사항을 자동으로 관리
- **개발 경험**: Prisma Studio로 데이터를 시각적으로 확인하고 편집 가능

**기본 워크플로우**:

```
schema.prisma 정의 → 마이그레이션 실행 → Client 생성 → 코드에서 사용
```

:::

::: info MVP에는 SQLite를 사용하고 프로덕션에는 PostgreSQL을 사용하는 이유는 무엇인가요?

**SQLite (개발 환경)**:

- 제로 구성, 파일 기반 데이터베이스 (`dev.db`)
- 가볍고 빠르며, 로컬 개발과 데모에 적합
- 동시 쓰기 불가

**PostgreSQL (프로덕션 환경)**:

- 기능 완전, 동시 쓰기 및 복잡한 쿼리 지원
- 우수한 성능, 프로덕션 배포에 적합
- Prisma 마이그레이션으로 무중단 전환: `DATABASE_URL`만 수정하면 됨

**마이그레이션 전략**: Prisma는 `DATABASE_URL`에 따라 자동으로 데이터베이스 제공자를 적용하며, Schema를 수동으로 수정할 필요가 없습니다.

:::

## 핵심 접근 방식

Tech 단계의 핵심은 **제품 요구사항을 기술 방안으로 변환**하는 것이지만, 'MVP 우선' 원칙을 따라야 합니다.

### 사고 프레임워크

Tech Agent는 다음 사고 프레임워크를 따릅니다:

| 원칙 | 설명 |
| ---- | ---- |
| **목표 대응** | 기술 방안은 제품 핵심 가치를 뒷받침해야 함 |
| **단순성 우선** | 간단하고 성숙한 기술 스택을 선택하여 빠르게 배포 |
| **확장성** | 설계에 확장 포인트를 예약하여 미래 진화 지원 |
| **데이터 중심** | 명확한 데이터 모델을 통해 엔티티와 관계를 표현 |

### 기술 선정 의사결정 트리

**백엔드 기술 스택**:

| 구성 요소 | 추천 | 대안 | 설명 |
| ---- | ---- | ---- | ---- |
| **런타임** | Node.js + TypeScript | Python + FastAPI | Node.js 생태계가 풍부하고 프론트엔드/백엔드 통합 |
| **웹 프레임워크** | Express | Fastify | Express는 성숙하고 안정적이며 미들웨어 풍부 |
| **ORM** | Prisma 5.x | TypeORM | Prisma는 타입 안전하고 마이그레이션 관리 우수 |
| **데이터베이스** | SQLite(개발)/PostgreSQL(프로덕션) | - | SQLite는 제로 구성, PostgreSQL은 프로덕션 준비 완료 |

**프론트엔드 기술 스택**:

| 시나리오 | 추천 | 설명 |
| ---- | ---- | ---- |
| 모바일 전용 | React Native + Expo | 크로스 플랫폼, 핫 업데이트 |
| 모바일 + 웹 | React Native Web | 한 번의 코드로 여러 플랫폼 실행 |
| 웹 전용 | React + Vite | 우수한 성능, 성숙한 생태계 |

**상태 관리**:

| 복잡도 | 추천 | 설명 |
| ---- | ---- | ---- |
| 단순(< 5개 전역 상태) | React Context API | 제로 의존성, 학습 곡선 낮음 |
| 중간 복잡도 | Zustand | 가볍고 API 간결하며 성능 우수 |
| 복잡한 앱 | Redux Toolkit | ⚠️ MVP 단계에서 권장하지 않음, 너무 복잡함 |

### 데이터 모델 설계 원칙

**엔티티 식별**:

1. PRD의 사용자 스토리에서 명사를 추출 → 후보 엔티티
2. 핵심 엔티티(필수)와 보조 엔티티(선택) 구분
3. 각 엔티티는 명확한 비즈니스 의미를 가져야 함

**관계 설계**:

| 관계 유형 | 예시 | 설명 |
| ---- | ---- | ---- |
| 일대다(1:N) | User → Posts | 사용자는 여러 게시물을 가짐 |
| 다대다(M:N) | Posts ↔ Tags | 게시물과 태그(중간 테이블 통해) |
| 일대일(1:1) | User → UserProfile | ⚠️ 드물게 사용, 일반적으로 병합 가능 |

**필드 원칙**:

- **필수 필드**: `id`, `createdAt`, `updatedAt`
- **중복 회피**: 계산 또는 연관을 통해 얻을 수 있는 필드는 저장하지 않음
- **적절한 타입**: String, Int, Float, Boolean, DateTime
- **민감 필드 표시**: 비밀번호 등은 직접 저장하면 안 됨

### ⚠️ SQLite 호환성 제약 조건

Tech Agent가 Prisma 스키마를 생성할 때 SQLite 호환성 요구 사항을 준수해야 합니다:
#### 복합 타입(Composite Types) 금지

SQLite는 Prisma의 `type` 정의를 지원하지 않으므로, JSON 문자열을 저장하려면 `String`을 사용해야 합니다.

```prisma
// ❌ 오류 - SQLite에서 지원하지 않음
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ 정상 - String으로 JSON 저장
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### JSON 필드 주석 규범

스키마에서 주석으로 JSON 구조를 설명합니다:

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // JSON 형식: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

TypeScript 코드에서 해당 인터페이스를 정의합니다:

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Prisma 버전 고정

Prisma 5.x를 사용해야 하며 7.x는 사용하지 않아야 합니다(호환성 문제 있음):

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```

## Tech Agent의 워크플로우

Tech Agent는 PRD를 기반으로 기술 아키텍처를 설계하는 AI 에이전트입니다. 워크플로우는 다음과 같습니다:

### 입력 파일

Tech Agent는 다음 파일만 읽을 수 있습니다:

| 파일 | 설명 | 위치 |
| ---- | ---- | ---- |
| `prd.md` | 제품 요구사항 문서 | `artifacts/prd/prd.md` |

### 출력 파일

Tech Agent는 다음 파일을 생성해야 합니다:

| 파일 | 설명 | 위치 |
| ---- | ---- | ---- |
| `tech.md` | 기술 방안 및 아키텍처 문서 | `artifacts/tech/tech.md` |
| `schema.prisma` | 데이터 모델 정의 | `artifacts/backend/prisma/schema.prisma` |

### 실행 단계

1. **PRD 읽기**: 핵심 기능, 데이터 흐름, 제약 조건 식별
2. **기술 스택 선택**: `skills/tech/skill.md`에 따라 언어, 프레임워크, 데이터베이스 선택
3. **데이터 모델 설계**: 엔티티, 속성, 관계를 정의하고 Prisma 스키마로 표현
4. **기술 문서 작성**: `tech.md`에서 선택 이유, 확장 전략, 비목표 설명
5. **출력 파일 생성**: 설계를 지정된 경로에 기록하며 업스트림 파일 수정 금지

### 종료 조건

Sisyphus 스케줄러는 Tech Agent가 다음 조건을 충족하는지 검증합니다:

- ✅ 기술 스택 명확히 선언(백엔드, 프론트엔드, 데이터베이스)
- ✅ 데이터 모델이 PRD와 일치(모든 엔티티는 PRD에서 유래)
- ✅ 조기 최적화나 과도 설계 수행하지 않음
## 따라하기: Tech 단계 실행

### 1단계: PRD 단계 완료 확인

**이유**

Tech Agent는 `artifacts/prd/prd.md`를 읽어야 하며, 파일이 없으면 Tech 단계를 실행할 수 없습니다.

**작업**

```bash
# PRD 파일 존재 여부 확인
cat artifacts/prd/prd.md
```

**예상 결과**: 구조화된 PRD 문서로, 대상 사용자, 기능 목록, 비목표 등을 포함합니다.

### 2단계: Tech 단계 실행

**이유**

AI 어시스턴트를 사용하여 Tech Agent를 실행하고 기술 아키텍처와 데이터 모델을 자동으로 생성합니다.

**작업**

```bash
# Claude Code로 tech 단계 실행
factory run tech
```

**예상 결과**:

```
✓ 현재 단계: tech
✓ PRD 문서 로드: artifacts/prd/prd.md
✓ Tech Agent 시작

Tech Agent가 기술 아키텍처를 설계 중입니다...

[AI 어시스턴트가 다음 작업을 수행합니다]
1. PRD 분석, 엔티티 및 기능 추출
2. 기술 스택 선택(Node.js + Express + Prisma)
3. 데이터 모델 설계(User, Post 등 엔티티)
4. API 엔드포인트 정의
5. tech.md 및 schema.prisma 생성

Agent 완료 대기 중...
```

### 3단계: 생성된 기술 문서 확인

**이유**

기술 문서가 완전한지 확인하고 설계가 합리적인지 검증합니다.

**작업**

```bash
# 기술 문서 확인
cat artifacts/tech/tech.md
```

**예상 결과**: 다음 챕터를 포함하는 완전한 기술 문서

```markdown
## 기술 스택

**백엔드**
- 런타임: Node.js 20+
- 언어: TypeScript 5+
- 프레임워크: Express 4.x
- ORM: Prisma 5.x
- 데이터베이스: SQLite (개발) / PostgreSQL (프로덕션)

**프론트엔드**
- 프레임워크: React Native + Expo
- 언어: TypeScript
- 내비게이션: React Navigation 6
- 상태 관리: React Context API
- HTTP 클라이언트: Axios

## 아키텍처 설계

**계층 구조**
- 라우트 계층(routes/): API 엔드포인트 정의
- 컨트롤러 계층(controllers/): 요청 및 응답 처리
- 서비스 계층(services/): 비즈니스 로직
- 데이터 액세스 계층: Prisma ORM

**데이터 흐름**
Client → API Gateway → Controller → Service → Prisma → Database

## API 엔드포인트 설계

| 엔드포인트 | 메서드 | 설명 | 요청 본문 | 응답 |
|------|------|------|--------|------|
| /api/items | GET | 목록 조회 | - | Item[] |
| /api/items/:id | GET | 상세 조회 | - | Item |
| /api/items | POST | 생성 | CreateItemDto | Item |
| /api/items/:id | PUT | 업데이트 | UpdateItemDto | Item |
| /api/items/:id | DELETE | 삭제 | - | { deleted: true } |

## 데이터 모델

### User
- id: 기본 키
- email: 이메일(필수)
- name: 이름(필수)
- createdAt: 생성 시간
- updatedAt: 업데이트 시간

**관계**:
- posts: 일대다(사용자는 여러 게시물을 가짐)

## 환경 변수

**백엔드 (.env)**
- PORT: 서비스 포트(기본값 3000)
- DATABASE_URL: 데이터베이스 연결 문자열
- NODE_ENV: 환경(development/production)
- CORS_ORIGINS: 허용된 CORS 출처

**프론트엔드 (.env)**
- EXPO_PUBLIC_API_URL: 백엔드 API 주소

## 미래 확장 포인트

**단기(v1.1)**
- 페이지네이션 및 필터링 추가
- 데이터 내보내기 기능 구현

**중기(v2.0)**
- PostgreSQL로 마이그레이션
- 사용자 인증 추가

**장기**
- 마이크로서비스로 분리
- 캐싱 계층 추가(Redis)
```

### 4단계: 생성된 Prisma 스키마 확인

**이유**

데이터 모델이 PRD와 일치하는지, SQLite 호환성 제약 조건을 준수하는지 확인합니다.

**작업**

```bash
# Prisma 스키마 확인
cat artifacts/backend/prisma/schema.prisma
```

**예상 결과**: Prisma 5.x 구문을 준수하는 스키마로, 완전한 엔티티 정의와 관계 포함

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 개발 환경
  url      = "file:./dev.db"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
}
```
### 5단계: 종료 조건 검증

**이유**

Sisyphus는 Tech Agent가 종료 조건을 충족하는지 검증하며, 충족하지 않으면 재실행을 요구합니다.

**체크리스트**

| 항목 | 설명 | 통과/실패 |
| ---- | ---- | ---- |
| 기술 스택 명확히 선언 | 백엔드, 프론트엔드, 데이터베이스가 명확하게 정의됨 | [ ] |
| 데이터 모델이 PRD와 일치 | 모든 엔티티는 PRD에서 유래하며 추가 필드 없음 | [ ] |
| 조기 최적화나 과도 설계 수행하지 않음 | MVP 범위에 부합하며 검증되지 않은 기능 없음 | [ ] |

**실패 시**:

```bash
# Tech 단계 재실행
factory run tech
```

## 체크포인트 ✅

**완료 여부 확인**:

- [ ] Tech 단계 성공적으로 실행됨
- [ ] `artifacts/tech/tech.md` 파일이 존재하고 내용이 완전함
- [ ] `artifacts/backend/prisma/schema.prisma` 파일이 존재하고 구문이 올바름
- [ ] 기술 스택 선택이 합리적임(Node.js + Express + Prisma)
- [ ] 데이터 모델이 PRD와 일치하며 추가 필드 없음
- [ ] 스키마가 SQLite 호환성 제약 조건을 준수함(Composite Types 없음)

## 주의할 점

### ⚠️ 함정 1: 과도 설계

**문제**: MVP 단계에서 마이크로서비스, 복잡한 캐싱 또는 고급 기능을 도입함.

**증상**: `tech.md`에 '마이크로서비스 아키텍처', 'Redis 캐싱', '메시지 큐' 등이 포함됨.

**해결**: Tech Agent에는 `NEVER` 목록이 있으며 과도 설계를 명확히 금지합니다. 이러한 내용이 보이면 재실행하세요.

```markdown
## 하지 말 것(NEVER)
* **NEVER** 과도 설계, 예를 들어 MVP 단계에서 마이크로서비스, 복잡한 메시지 큐 또는 고성능 캐싱 도입
* **NEVER** 아직 확정되지 않은 시나리오를 위한 중복 코드 작성
```

### ⚠️ 함정 2: SQLite 호환성 오류

**문제**: Prisma 스키마가 SQLite에서 지원하지 않는 기능을 사용함.

**증상**: Validation 단계에서 오류가 발생하거나 `npx prisma generate`가 실패함.

**일반적인 오류**:

```prisma
// ❌ 오류 - SQLite는 Composite Types를 지원하지 않음
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ 오류 - 7.x 버전 사용
{
  "prisma": "^7.0.0"
}
```

**해결**: 스키마를 확인하여 JSON 저장에 String을 사용하고, Prisma 버전을 5.x로 고정하십시오.

### ⚠️ 함정 3: 데이터 모델이 MVP 범위를 초과함

**문제**: 스키마에 PRD에 정의되지 않은 엔티티 또는 필드가 포함됨.

**증상**: `tech.md`의 엔티티 수가 PRD의 핵심 엔티티보다 현저히 많음.

**해결**: Tech Agent는 '데이터 모델은 MVP 기능에 필요한 모든 엔티티와 관계를 포함해야 하며, 검증되지 않은 필드를 미리 추가해서는 안 됩니다'라는 제약 조건을 가집니다. 추가 필드를 발견하면 삭제하거나 '미래 확장 포인트'로 표시하십시오.

### ⚠️ 함정 4: 관계 설계 오류

**문제**: 관계 정의가 실제 비즈니스 로직에 부합하지 않음.

**증상**: 일대다가 다대다로 작성되었거나 필요한 관계가 누락됨.

**예시 오류**:

```prisma
// ❌ 오류 - 사용자와 게시물은 일대다여야 함, 일대일이 아님
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // 일대일 관계
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // @relation을 사용해야 함
}
```

**올바른 작성법**:

```prisma
// ✅ 정상 - 일대다 관계
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```
## 챕터 요약

Tech 단계는 파이프라인에서 '제품 요구사항'과 '코드 구현'을 연결하는 다리입니다. PRD를 기반으로 자동 설계합니다:

- **기술 스택**: Node.js + Express + Prisma(백엔드), React Native + Expo(프론트엔드)
- **데이터 모델**: SQLite 호환성 요구 사항을 충족하는 Prisma 스키마
- **아키텍처 설계**: 계층 구조(라우트 → 컨트롤러 → 서비스 → 데이터)
- **API 정의**: RESTful 엔드포인트 및 데이터 흐름

**핵심 원칙**:

1. **MVP 우선**: 핵심 필수 기능만 설계하고 과도 설계 방지
2. **단순성 우선**: 성숙하고 안정적인 기술 스택 선택
3. **데이터 중심**: 명확한 데이터 모델을 통해 엔티티와 관계 표현
4. **확장성**: 미래 확장 포인트를 문서에 표시하되 미리 구현하지 않음

Tech 단계를 완료하면 다음을 얻게 됩니다:

- ✅ 완전한 기술 방안 문서(`tech.md`)
- ✅ Prisma 5.x 규범을 준수하는 데이터 모델(`schema.prisma`)
- ✅ 명확한 API 설계 및 환경 설정

## 다음 챕터 미리보기

> 다음 챕터에서는 **[Code 단계: 실행 가능한 코드 생성](../stage-code/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - Code Agent가 UI 스키마와 Tech 설계를 기반으로 프론트엔드/백엔드 코드를 생성하는 방법
> - 생성된 애플리케이션에 포함된 기능(테스트, 문서, CI/CD)
> - 생성된 코드 품질을 검증하는 방법
> - Code Agent의 특별 요구 사항 및 출력 규범

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 날짜: 2026-01-29

| 기능 | 파일 경로 | 행 번호 |
| ---- | ---- | ---- |
| Tech Agent 정의 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Tech 스킬 가이드 | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| 파이프라인 설정 | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| SQLite 호환성 제약 조건 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**핵심 제약 조건**:
- **Composite Types 사용 금지**: SQLite에서 지원하지 않으므로 JSON을 저장하려면 String을 사용해야 함
- **Prisma 버전 고정**: 5.x를 사용하고 7.x를 사용하지 않아야 함
- **MVP 범위**: 데이터 모델은 MVP 기능에 필요한 모든 엔티티를 포함해야 하며, 검증되지 않은 필드를 미리 추가해서는 안 됨

**기술 스택 의사결정 원칙**:
- 커뮤니티가 활발하고 문서가 완전한 언어와 프레임워크를 우선적으로 선택
- MVP 단계에서 가벼운 데이터베이스(SQLite)를 선택하고, 후기에 PostgreSQL로 마이그레이션 가능
- 시스템 계층화는 라우트 계층 → 비즈니스 로직 계층 → 데이터 액세스 계층을 따름

**하지 말 것(NEVER)**:
- NEVER 과도 설계, 예를 들어 MVP 단계에서 마이크로서비스, 복잡한 메시지 큐 또는 고성능 캐싱 도입
- NEVER 인기 없거나 유지 관리가 부족한 기술 선택
- NEVER 제품 검증을 통과하지 않은 필드 또는 관계를 데이터 모델에 추가
- NEVER 기술 문서에 구체적인 코드 구현 포함

</details>
