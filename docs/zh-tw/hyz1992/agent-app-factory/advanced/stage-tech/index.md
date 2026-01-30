---
title: "設計技術架構：Tech 階段完整指南 | Agent App Factory 教學"
sidebarTitle: "設計技術架構"
subtitle: "設計技術架構：Tech 階段完整指南"
description: "學習 AI App Factory Tech 階段如何根據 PRD 設計最小可行的技術架構和 Prisma 資料模型，包括技術棧選擇、資料模型設計、API 定義和資料庫遷移策略。"
tags:
  - "技術架構"
  - "資料模型"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
order: 110
---

# 設計技術架構：Tech 階段完整指南

## 學完你能做什麼

完成本課，你將能夠：

- 理解 Tech Agent 如何根據 PRD 設計技術架構
- 掌握 Prisma Schema 的設計方法和約束
- 了解技術棧選擇的決策原則
- 學會為 MVP 制定合理的資料模型和 API 設計
- 理解 SQLite 開發環境和 PostgreSQL 生產環境的遷移策略

## 你現在的困境

PRD 已經寫好，你清楚要做什麼功能，但不知道：

- 該選什麼技術棧？Node.js 還是 Python？
- 資料表該怎麼設計？怎麼定義關係？
- API 端點該有哪些？遵循什麼規範？
- 如何保證設計既能快速交付，又能支援未來擴展？

Tech 階段就是解決這些問題的——它根據 PRD 自動生成技術架構和資料模型。

## 什麼時候用這一招

Tech 階段是流水線的第 4 個階段，緊接在 UI 階段之後，Code 階段之前。

**典型使用場景**：

| 場景 | 說明 |
| ---- | ---- |
| 新專案啟動 | PRD 確認後，需要設計技術方案 |
| MVP 快速原型 | 需要最小可行的技術架構，避免過度設計 |
| 技術棧決策 | 不確定選擇什麼技術組合最合適 |
| 資料模型設計 | 需要定義清晰的實體關係和欄位 |

**不適用場景**：

- 已有明確技術架構的專案（Tech 階段會重新設計）
- 只做前端/後端之一（Tech 階段設計全端架構）
- 需要微服務架構（MVP 階段不推薦）

## 🎒 開始前的準備

::: warning 前置要求

本課假設你已經：

1. **完成 PRD 階段**：`artifacts/prd/prd.md` 必須存在且通過驗證
2. **理解產品需求**：清楚核心功能、使用者故事和 MVP 範圍
3. **熟悉基礎概念**：了解 RESTful API、關聯式資料庫、ORM 的基本概念

:::

**需要了解的概念**：

::: info 什麼是 Prisma？

Prisma 是一個現代化的 ORM（物件關係對應）工具，用於在 TypeScript/Node.js 中操作資料庫。

**核心優勢**：

- **型別安全**：自動生成 TypeScript 型別，開發時獲得完整提示
- **遷移管理**：`prisma migrate dev` 自動管理資料庫變更
- **開發體驗**：Prisma Studio 視覺化檢視和編輯資料

**基本工作流程**：

```
定義 schema.prisma → 執行遷移 → 生成 Client → 程式碼中使用
```

:::

::: info 為什麼 MVP 用 SQLite，生產用 PostgreSQL？

**SQLite（開發環境）**：

- 零配置，檔案資料庫（`dev.db`）
- 輕量快速，適合本地開發和展示
- 不支援並發寫入

**PostgreSQL（生產環境）**：

- 功能完整，支援並發、複雜查詢
- 效能優秀，適合生產部署
- Prisma 遷移無縫切換：只需修改 `DATABASE_URL`

**遷移策略**：Prisma 會根據 `DATABASE_URL` 自動適配資料庫提供商，無需手動修改 Schema。

:::

## 核心思路

Tech 階段的核心是**將產品需求轉化為技術方案**，但要遵循「MVP 至上」原則。

### 思維框架

Tech Agent 遵循以下思維框架：

| 原則 | 說明 |
| ---- | ---- |
| **目標對應** | 技術方案必須服務於產品核心價值 |
| **簡單優先** | 選擇簡潔成熟的技術棧，快速交付 |
| **可擴展性** | 在設計中預留擴展點，支援未來演進 |
| **資料驅動** | 通過清晰的資料模型表達實體和關係 |

### 技術選型決策樹

**後端技術棧**：

| 元件 | 推薦 | 備選 | 說明 |
| ---- | ---- | ---- | ---- |
| **執行時** | Node.js + TypeScript | Python + FastAPI | Node.js 生態豐富，前後端統一 |
| **Web 框架** | Express | Fastify | Express 成熟穩定，中介軟體豐富 |
| **ORM** | Prisma 5.x | TypeORM | Prisma 型別安全，遷移管理優秀 |
| **資料庫** | SQLite（開發）/ PostgreSQL（生產） | - | SQLite 零配置，PostgreSQL 生產就緒 |

**前端技術棧**：

| 場景 | 推薦 | 說明 |
| ---- | ---- | ---- |
| 僅行動裝置 | React Native + Expo | 跨平台，熱更新 |
| 行動裝置 + Web | React Native Web | 一套程式碼多端執行 |
| 僅 Web | React + Vite | 效能優秀，生態成熟 |

**狀態管理**：

| 複雜度 | 推薦 | 說明 |
| ---- | ---- | ---- |
| 簡單（< 5 個全域狀態） | React Context API | 零依賴，學習成本低 |
| 中等複雜度 | Zustand | 輕量、API 簡潔、效能好 |
| 複雜應用 | Redux Toolkit | ⚠️ MVP 階段不推薦，過於複雜 |

### 資料模型設計原則

**實體識別**：

1. 從 PRD 的使用者故事中提取名詞 → 候選實體
2. 區分核心實體（必須）和輔助實體（可選）
3. 每個實體必須有明確的業務含義

**關係設計**：

| 關係類型 | 範例 | 說明 |
| ---- | ---- | ---- |
| 一對多（1:N） | User → Posts | 使用者有多篇文章 |
| 多對多（M:N） | Posts ↔ Tags | 文章和標籤（通過中間表） |
| 一對一（1:1） | User → UserProfile | ⚠️ 少用，通常可合併 |

**欄位原則**：

- **必須欄位**：`id`, `createdAt`, `updatedAt`
- **避免冗餘**：可通過計算或關聯獲取的欄位不儲存
- **合適型別**：String, Int, Float, Boolean, DateTime
- **敏感欄位標註**：密碼等不應直接儲存

### ⚠️ SQLite 相容性約束

Tech Agent 生成 Prisma Schema 時必須遵守 SQLite 相容性要求：

#### 禁止使用 Composite Types

SQLite 不支援 Prisma 的 `type` 定義，必須用 `String` 儲存 JSON 字串。

```prisma
// ❌ 錯誤 - SQLite 不支援
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ 正確 - 使用 String 儲存 JSON
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### JSON 欄位註釋規範

在 Schema 中用註釋說明 JSON 結構：

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // JSON 格式: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

在 TypeScript 程式碼中定義對應介面：

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Prisma 版本鎖定

必須使用 Prisma 5.x，不使用 7.x（有相容性問題）：

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```

## Tech Agent 的工作流程

Tech Agent 是一個 AI Agent，負責根據 PRD 設計技術架構。它的工作流程如下：

### 輸入檔案

Tech Agent 只能讀取以下檔案：

| 檔案 | 說明 | 位置 |
| ---- | ---- | ---- |
| `prd.md` | 產品需求文件 | `artifacts/prd/prd.md` |

### 輸出檔案

Tech Agent 必須生成以下檔案：

| 檔案 | 說明 | 位置 |
| ---- | ---- | ---- |
| `tech.md` | 技術方案和架構文件 | `artifacts/tech/tech.md` |
| `schema.prisma` | 資料模型定義 | `artifacts/backend/prisma/schema.prisma` |

### 執行步驟

1. **閱讀 PRD**：識別核心功能、資料流和約束條件
2. **選擇技術棧**：根據 `skills/tech/skill.md`，選擇語言、框架和資料庫
3. **設計資料模型**：定義實體、屬性和關係，使用 Prisma schema 表達
4. **編寫技術文件**：在 `tech.md` 中解釋選擇理由、擴展策略和非目標
5. **生成輸出檔案**：將設計寫入指定路徑，不得修改上游檔案

### 退出條件

Sisyphus 排程器會驗證 Tech Agent 是否滿足以下條件：

- ✅ 技術棧明確宣告（後端、前端、資料庫）
- ✅ 資料模型與 PRD 一致（所有實體來自 PRD）
- ✅ 未進行過早最佳化或過度設計

## 跟我做：執行 Tech 階段

### 第 1 步：確認 PRD 階段已完成

**為什麼**

Tech Agent 需要讀取 `artifacts/prd/prd.md`，如果檔案不存在，Tech 階段無法執行。

**操作**

```bash
# 檢查 PRD 檔案是否存在
cat artifacts/prd/prd.md
```

**你應該看到**：結構化的 PRD 文件，包含目標使用者、功能列表、非目標等內容。

### 第 2 步：執行 Tech 階段

**為什麼**

使用 AI 助手執行 Tech Agent，自動生成技術架構和資料模型。

**操作**

```bash
# 使用 Claude Code 執行 tech 階段
factory run tech
```

**你應該看到**：

```
✓ 當前階段: tech
✓ 載入 PRD 文件: artifacts/prd/prd.md
✓ 啟動 Tech Agent

Tech Agent 正在設計技術架構...

[AI 助手會執行以下操作]
1. 分析 PRD，提取實體和功能
2. 選擇技術棧（Node.js + Express + Prisma）
3. 設計資料模型（User, Post 等實體）
4. 定義 API 端點
5. 生成 tech.md 和 schema.prisma

等待 Agent 完成...
```

### 第 3 步：檢視生成的技術文件

**為什麼**

檢查技術文件是否完整，驗證設計是否合理。

**操作**

```bash
# 檢視技術文件
cat artifacts/tech/tech.md
```

**你應該看到**：包含以下章節的完整技術文件

```markdown
## 技術棧

**後端**
- 執行時: Node.js 20+
- 語言: TypeScript 5+
- 框架: Express 4.x
- ORM: Prisma 5.x
- 資料庫: SQLite (開發) / PostgreSQL (生產)

**前端**
- 框架: React Native + Expo
- 語言: TypeScript
- 導覽: React Navigation 6
- 狀態管理: React Context API
- HTTP 客戶端: Axios

## 架構設計

**分層結構**
- 路由層 (routes/): 定義 API 端點
- 控制器層 (controllers/): 處理請求和回應
- 服務層 (services/): 業務邏輯
- 資料存取層: Prisma ORM

**資料流**
Client → API Gateway → Controller → Service → Prisma → Database

## API 端點設計

| 端點 | 方法 | 描述 | 請求體 | 回應 |
|------|------|------|--------|------|
| /api/items | GET | 取得列表 | - | Item[] |
| /api/items/:id | GET | 取得詳情 | - | Item |
| /api/items | POST | 建立 | CreateItemDto | Item |
| /api/items/:id | PUT | 更新 | UpdateItemDto | Item |
| /api/items/:id | DELETE | 刪除 | - | { deleted: true } |

## 資料模型

### User
- id: 主鍵
- email: 電子郵件（必填）
- name: 名稱（必填）
- createdAt: 建立時間
- updatedAt: 更新時間

**關係**:
- posts: 一對多（使用者有多篇文章）

## 環境變數

**後端 (.env)**
- PORT: 服務埠 (預設 3000)
- DATABASE_URL: 資料庫連線字串
- NODE_ENV: 環境 (development/production)
- CORS_ORIGINS: 允許的跨域來源

**前端 (.env)**
- EXPO_PUBLIC_API_URL: 後端 API 位址

## 未來擴展點

**短期 (v1.1)**
- 加入分頁和篩選
- 實現資料匯出功能

**中期 (v2.0)**
- 遷移到 PostgreSQL
- 加入使用者認證

**長期**
- 拆分為微服務
- 加入快取層 (Redis)
```

### 第 4 步：檢視生成的 Prisma Schema

**為什麼**

檢查資料模型是否符合 PRD，是否遵循 SQLite 相容性約束。

**操作**

```bash
# 檢視 Prisma Schema
cat artifacts/backend/prisma/schema.prisma
```

**你應該看到**：符合 Prisma 5.x 語法的 Schema，包含完整的實體定義和關係

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 開發環境
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

### 第 5 步：驗證退出條件

**為什麼**

Sisyphus 會驗證 Tech Agent 是否滿足退出條件，不滿足則要求重新執行。

**檢查清單**

| 檢查項 | 說明 | 通過/失敗 |
| ---- | ---- | ---- |
| 技術棧明確宣告 | 後端、前端、資料庫都清晰定義 | [ ] |
| 資料模型與 PRD 一致 | 所有實體來自 PRD，無額外欄位 | [ ] |
| 未進行過早最佳化或過度設計 | 符合 MVP 範圍，無未驗證的功能 | [ ] |

**如果失敗**：

```bash
# 重新執行 Tech 階段
factory run tech
```

## 檢查點 ✅

**確認你已完成**：

- [ ] Tech 階段成功執行
- [ ] `artifacts/tech/tech.md` 檔案存在且內容完整
- [ ] `artifacts/backend/prisma/schema.prisma` 檔案存在且語法正確
- [ ] 技術棧選擇合理（Node.js + Express + Prisma）
- [ ] 資料模型與 PRD 一致，無額外欄位
- [ ] Schema 遵循 SQLite 相容性約束（無 Composite Types）

## 踩坑提醒

### ⚠️ 陷阱 1：過度設計

**問題**：在 MVP 階段引入微服務、複雜快取或高階功能。

**症狀**：`tech.md` 中包含「微服務架構」「Redis 快取」「訊息佇列」等。

**解決**：Tech Agent 有 `NEVER` 列表，明確禁止過度設計。如果看到這些內容，重新執行。

```markdown
## 不要做 (NEVER)
* **NEVER** 過度設計，如在 MVP 階段引入微服務、複雜訊息佇列或高效能快取
* **NEVER** 為尚未確定的場景編寫冗餘程式碼
```

### ⚠️ 陷阱 2：SQLite 相容性錯誤

**問題**：Prisma Schema 使用了 SQLite 不支援的特性。

**症狀**：Validation 階段報錯，或 `npx prisma generate` 失敗。

**常見錯誤**：

```prisma
// ❌ 錯誤 - SQLite 不支援 Composite Types
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ 錯誤 - 使用了 7.x 版本
{
  "prisma": "^7.0.0"
}
```

**解決**：檢查 Schema，確保使用 String 儲存 JSON，鎖定 Prisma 版本為 5.x。

### ⚠️ 陷阱 3：資料模型超出 MVP 範圍

**問題**：Schema 包含 PRD 中未定義的實體或欄位。

**症狀**：`tech.md` 中的實體數量明顯多於 PRD 中的核心實體。

**解決**：Tech Agent 約束「資料模型應覆蓋所有 MVP 功能所需的實體及關係，不得提前加入未驗證的欄位」。如果發現額外欄位，刪除或標記為「未來擴展點」。

### ⚠️ 陷阱 4：關係設計錯誤

**問題**：關係定義不符合實際業務邏輯。

**症狀**：一對多寫成了多對多，或缺少必要的關係。

**示例錯誤**：

```prisma
// ❌ 錯誤 - 使用者和文章應該是一對多，不是一對一
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // 一對一關係
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // 應該使用 @relation
}
```

**正確寫法**：

```prisma
// ✅ 正確 - 一對多關係
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

## 本課小結

Tech 階段是流水線中連接「產品需求」和「程式碼實現」的橋樑。它根據 PRD 自動設計：

- **技術棧**：Node.js + Express + Prisma（後端），React Native + Expo（前端）
- **資料模型**：符合 SQLite 相容性要求的 Prisma Schema
- **架構設計**：分層結構（路由 → 控制器 → 服務 → 資料）
- **API 定義**：RESTful 端點和資料流

**關鍵原則**：

1. **MVP 至上**：只設計核心必需功能，避免過度設計
2. **簡單優先**：選擇成熟穩定的技術棧
3. **資料驅動**：通過清晰的資料模型表達實體和關係
4. **可擴展性**：在文件中標註未來擴展點，但不提前實現

完成 Tech 階段後，你將獲得：

- ✅ 完整的技術方案文件（`tech.md`）
- ✅ 符合 Prisma 5.x 規範的資料模型（`schema.prisma`）
- ✅ 清晰的 API 設計和環境配置

## 下一課預告

> 下一課我們學習 **[Code 階段：生成可執行程式碼](../stage-code/)**。
>
> 你會學到：
> - Code Agent 如何根據 UI Schema 和 Tech 設計生成前後端程式碼
> - 生成的應用包含哪些功能（測試、文件、CI/CD）
> - 如何驗證生成的程式碼品質
> - Code Agent 的特殊要求和輸出規範

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 功能 | 檔案路徑 | 行號 |
| ---- | ---- | ---- |
| Tech Agent 定義 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Tech 技能指南 | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Pipeline 配置 | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| SQLite 相容性約束 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**關鍵約束**：
- **禁止使用 Composite Types**：SQLite 不支援，必須用 String 儲存 JSON
- **Prisma 版本鎖定**：必須使用 5.x，不使用 7.x
- **MVP 範圍**：資料模型應覆蓋所有 MVP 功能所需的實體，不得提前加入未驗證的欄位

**技術棧決策原則**：
- 優先選用社群活躍、文件齊全的語言和框架
- 在 MVP 階段選擇輕量資料庫（SQLite），後期可遷移至 PostgreSQL
- 系統分層遵循路由層→業務邏輯層→資料存取層

**不要做 (NEVER)**：
- NEVER 過度設計，如在 MVP 階段引入微服務、複雜訊息佇列或高效能快取
- NEVER 選擇冷門或維護不佳的技術
- NEVER 在資料模型中新增未通過產品驗證的欄位或關係
- NEVER 在技術文件中包含具體程式碼實現

</details>
