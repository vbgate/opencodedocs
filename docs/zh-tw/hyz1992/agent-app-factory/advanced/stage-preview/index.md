---
title: "Preview 階段：自動生成部署指南和運行說明 | Agent App Factory 教程"
sidebarTitle: "生成部署指南"
subtitle: "生成部署指南：Preview 階段完整指南"
description: "學習 AI App Factory Preview 階段如何為生成的應用自動編寫運行指南和部署配置，涵蓋本地啟動、Docker 容器化、Expo EAS 建構、CI/CD 流水線和演示流程設計。"
tags:
  - "部署指南"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# 生成部署指南：Preview 階段完整指南

## 學完你能做什麼

完成本課，你將能夠：

- 理解 Preview Agent 如何為生成的應用編寫運行指南
- 掌握 Docker 部署配置的生成方法
- 了解 Expo EAS 建構配置的作用
- 學會為 MVP 設計簡短的演示流程
- 理解 CI/CD 和 Git Hooks 配置的最佳實踐

## 你現在的困境

程式碼已經生成並通過驗證，你想快速向團隊或客戶展示 MVP，但不知道：

- 該寫什麼樣的運行文檔？
- 如何讓別人快速啟動和運行應用？
- 演示時該展示哪些功能？避免哪些坑？
- 生產環境該怎麼部署？Docker 還是雲端平台？
- 怎麼建立持續整合和程式碼品質門禁？

Preview 階段就是解決這些問題的——它自動生成完整的運行說明和部署配置。

## 什麼時候用這一招

Preview 階段是流水線的第 7 個階段，也是最後一個階段，緊接在 Validation 階段之後。

**典型使用場景**：

| 場景 | 說明 |
| ---- | ---- |
| MVP 演示 | 需要向團隊或客戶展示應用，需要詳細的運行指南 |
| 團隊協作 | 新成員加入專案，需要快速上手開發環境 |
| 生產部署 | 準備將應用上線，需要 Docker 配置和 CI/CD 流水線 |
| 行動應用發布 | 需要配置 Expo EAS，準備提交到 App Store 和 Google Play |

**不適用場景**：

- 只看程式碼不運行（Preview 階段是必須的）
- 程式碼未通過 Validation 階段（先修復問題再執行 Preview）

## 🎒 開始前的準備

::: warning 前置要求

本課假設你已經：

1. **完成 Validation 階段**：`artifacts/validation/report.md` 必須存在且通過驗證
2. **理解應用架構**：清楚後端和前端的技術堆疊、資料模型和 API 端點
3. **熟悉基礎概念**：了解 Docker、CI/CD、Git Hooks 的基本概念

:::

**需要了解的概念**：

::: info 什麼是 Docker？

Docker 是一個容器化平台，可以將應用及其依賴打包成一個可移植的容器。

**核心優勢**：

- **環境一致性**：開發、測試、生產環境完全一致，避免「在我的機器上能跑」
- **快速部署**：一條指令即可啟動整個應用堆疊
- **資源隔離**：容器之間互不影響，提高安全性

**基本概念**：

```
Dockerfile → 映像檔 (Image) → 容器 (Container)
```

:::

::: info 什麼是 CI/CD？

CI/CD（持續整合/持續部署）是自動化的軟體開發實踐。

**CI (Continuous Integration)**：
- 每次提交自動執行測試和檢查
- 盡早發現程式碼問題
- 提高程式碼品質

**CD (Continuous Deployment)**：
- 自動建構和部署應用
- 快速將新功能推向生產
- 減少手動操作錯誤

**GitHub Actions** 是 GitHub 提供的 CI/CD 平台，透過配置 `.github/workflows/*.yml` 檔案定義自動化流程。

:::

::: info 什麼是 Git Hooks？

Git Hooks 是在 Git 操作的特定時間點自動執行的腳本。

**常用 Hooks**：

- **pre-commit**：提交前執行程式碼檢查和格式化
- **commit-msg**：校驗提交訊息格式
- **pre-push**：推送前執行完整測試

**Husky** 是一個流行的 Git Hooks 管理工具，用於簡化 Hooks 的配置和維護。

:::

## 核心思路

Preview 階段的核心是**為應用準備完整的使用和部署文檔**，但遵循「本地優先、透明風險」原則。

### 思維框架

Preview Agent 遵循以下思維框架：

| 原則 | 說明 |
| ---- | ---- |
| **本地優先** | 確保任何具有基本開發環境的人都能在本地啟動 |
| **部署就緒** | 提供生產環境部署所需的所有配置檔案 |
| **使用者故事** | 設計簡短的演示流程，展示核心價值 |
| **透明風險** | 主動列出當前版本存在的限制或已知問題 |

### 輸出檔案結構

Preview Agent 會生成兩類檔案：

**必須檔案**（每個專案都需要）：

| 檔案 | 說明 | 位置 |
| ---- | ---- | ---- |
| `README.md` | 主運行說明文檔 | `artifacts/preview/README.md` |
| `Dockerfile` | 後端 Docker 配置 | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | 開發環境 Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | 生產環境變數模板 | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS 建構配置 | `artifacts/client/eas.json` |

**推薦檔案**（生產環境需要）：

| 檔案 | 說明 | 位置 |
| ---- | ---- | ---- |
| `DEPLOYMENT.md` | 詳細部署指南 | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | 生產環境 Docker Compose | 專案根目錄 |

### README 文檔結構

`artifacts/preview/README.md` 必須包含以下章節：

```markdown
# [專案名稱]

## 快速開始

### 環境要求
- Node.js >= 18
- npm >= 9
- [其他依賴]

### 後端啟動
[安裝依賴、配置環境、初始化資料庫、啟動服務]

### 前端啟動
[安裝依賴、配置環境、啟動開發伺服器]

### 驗證安裝
[測試指令、健康檢查]

---

## 演示流程

### 準備工作
### 演示步驟
### 演示注意事項

---

## 已知問題與限制

### 功能限制
### 技術債
### 演示時需避免的操作

---

## 常見問題
```

## Preview Agent 的工作流程

Preview Agent 是一個 AI Agent，負責為生成的應用編寫運行指南和部署配置。它的工作流程如下：

### 輸入檔案

Preview Agent 只能讀取以下檔案：

| 檔案 | 說明 | 位置 |
| ---- | ---- | ---- |
| 後端程式碼 | 已驗證的後端應用 | `artifacts/backend/` |
| 前端程式碼 | 已驗證的前端應用 | `artifacts/client/` |

### 輸出檔案

Preview Agent 必須生成以下檔案：

| 檔案 | 說明 | 位置 |
| ---- | ---- | ---- |
| `README.md` | 主運行說明文檔 | `artifacts/preview/README.md` |
| `Dockerfile` | 後端 Docker 配置 | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | 開發環境 Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | 生產環境變數模板 | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS 建構配置 | `artifacts/client/eas.json` |

### 執行步驟

1. **瀏覽程式碼**：分析後端和前端目錄，確定安裝依賴和啟動指令
2. **編寫 README**：按照 `skills/preview/skill.md` 的指導，編寫清晰的安裝與運行指南
3. **生成 Docker 配置**：建立 Dockerfile 和 docker-compose.yml
4. **配置 EAS**：生成 Expo EAS 建構配置（行動應用）
5. **準備演示流程**：設計簡短的演示場景說明
6. **列出已知問題**：主動列出當前版本存在的缺陷或限制

## 跟我做：執行 Preview 階段

### 第 1 步：確認 Validation 階段已完成

**為什麼**

Preview Agent 需要讀取 `artifacts/backend/` 和 `artifacts/client/`，如果程式碼未通過驗證，Preview 階段生成的文檔可能不準確。

**操作**

```bash
# 檢查驗證報告
cat artifacts/validation/report.md
```

**你應該看到**：驗證報告顯示後端和前端的所有檢查都通過。

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```

### 第 2 步：執行 Preview 階段

**為什麼**

使用 AI 助手執行 Preview Agent，自動生成運行指南和部署配置。

**操作**

```bash
# 使用 Claude Code 執行 preview 階段
factory run preview
```

**你應該看到**：

```
✓ 當前階段: preview
✓ 載入後端程式碼: artifacts/backend/
✓ 載入前端程式碼: artifacts/client/
✓ 啟動 Preview Agent

Preview Agent 正在生成運行指南和部署配置...

[AI 助手會執行以下操作]
1. 分析後端和前端的專案結構
2. 生成 README.md（安裝、運行、演示流程）
3. 建立 Dockerfile 和 docker-compose.yml
4. 配置 Expo EAS 建構檔案
5. 準備生產環境變數模板
6. 列出已知問題和限制

等待 Agent 完成...
```

### 第 3 步：查看生成的 README

**為什麼**

檢查 README 是否完整，驗證安裝步驟和運行指令是否清晰。

**操作**

```bash
# 查看運行指南
cat artifacts/preview/README.md
```

**你應該看到**：包含以下章節的完整運行指南

```markdown
# AI 推薦餐廳助手

## 快速開始

### 環境要求

- Node.js >= 18
- npm >= 9
- Docker（可選，用於容器化部署）

### 後端啟動

```bash
# 進入後端目錄
cd artifacts/backend

# 安裝依賴
npm install

# 配置環境變數
cp .env.example .env
# 編輯 .env 填入必要配置

# 初始化資料庫
npx prisma migrate dev

# (可選) 填充種子資料
npm run db:seed

# 啟動開發伺服器
npm run dev
```

後端運行於: http://localhost:3000
健康檢查: http://localhost:3000/health
API 文檔: http://localhost:3000/api-docs

### 前端啟動

```bash
# 進入前端目錄
cd artifacts/client

# 安裝依賴
npm install

# 配置環境變數
cp .env.example .env
# 編輯 API_URL 指向後端位址

# 啟動開發伺服器
npm start
```

- iOS 模擬器: 按 `i`
- Android 模擬器: 按 `a`
- Web 瀏覽器: 按 `w`

### 驗證安裝

執行以下指令驗證安裝是否成功：

```bash
# 後端測試
cd artifacts/backend && npm test

# 前端測試
cd artifacts/client && npm test

# API 健康檢查
curl http://localhost:3000/health
```

---

## 演示流程

### 準備工作

1. 確保後端和前端都已啟動
2. 清空或重置演示資料（可選）

### 演示步驟

1. **場景介紹** (30秒)
   - 介紹目標使用者：想嘗試新餐廳的使用者
   - 介紹核心問題：選擇困難，不知道吃什麼

2. **功能演示** (3-5分鐘)
   - 步驟 1: 使用者輸入偏好（菜系、口味、預算）
   - 步驟 2: AI 基於偏好推薦餐廳
   - 步驟 3: 使用者查看推薦結果並選擇

3. **技術亮點** (可選, 1分鐘)
   - 即時 AI 推薦（呼叫 OpenAI API）
   - 行動端響應式設計
   - 本地資料庫持久化

### 演示注意事項

- 確保網路連線正常（AI 推薦需要呼叫 API）
- 避免輸入過長或模糊的偏好（可能導致推薦不準確）
- 演示時不要修改資料庫（可能影響演示效果）

---

## 已知問題與限制

### 功能限制

- [ ] 暫不支援使用者註冊和登入
- [ ] 暫不支援收藏和歷史記錄
- [ ] AI 推薦僅支援文字輸入，暫不支援語音或圖片

### 技術債

- [ ] 前端錯誤處理不夠完善
- [ ] 後端日誌記錄需要優化
- [ ] 資料庫索引未優化（小資料量無影響）

### 演示時需避免的操作

- 嘗試註冊或登入帳號 - 可能導致演示中斷
- 輸入特殊字元或超長文字 - 可能觸發錯誤
- 快速連續請求 - 可能觸發 API 限流

---

## 常見問題

### Q: 連接埠被佔用怎麼辦?

A: 修改 `.env` 中的 `PORT` 變數，或先終止佔用連接埠的進程。

### Q: 資料庫連線失敗怎麼辦?

A: 檢查 `.env` 中的 `DATABASE_URL` 配置是否正確，確保資料庫已啟動。

### Q: AI 推薦不回應怎麼辦?

A: 檢查 `.env` 中的 `OPENAI_API_KEY` 是否有效，網路連線是否正常。
```

### 第 4 步：查看生成的 Docker 配置

**為什麼**

檢查 Docker 配置是否正確，確保可以順利建構和運行容器。

**操作**

```bash
# 查看 Dockerfile
cat artifacts/backend/Dockerfile

# 查看 docker-compose.yml
cat artifacts/backend/docker-compose.yml
```

**你應該看到**：符合 Docker 最佳實踐的配置檔案

**Dockerfile 範例**：

```dockerfile
# 基礎映像檔
FROM node:20-alpine AS builder

WORKDIR /app

# 複製依賴檔案
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci --only=production

# 生成 Prisma Client
RUN npx prisma generate

# 複製原始碼
COPY . .

# 建構
RUN npm run build

# 生產映像檔
FROM node:20-alpine AS production

WORKDIR /app

# 安裝生產依賴
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# 暴露連接埠
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 啟動指令
CMD ["npm", "start"]
```

**docker-compose.yml 範例**：

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./dev.db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### 第 5 步：查看 EAS 配置

**為什麼**

檢查 Expo EAS 配置是否正確，確保可以順利建構和發布行動應用。

**操作**

```bash
# 查看 EAS 配置
cat artifacts/client/eas.json
```

**你應該看到**：包含 development、preview、production 三個環境的配置

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-staging.your-domain.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.your-domain.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 第 6 步：驗證退出條件

**為什麼**

Sisyphus 會驗證 Preview Agent 是否滿足退出條件，不滿足則要求重新執行。

**檢查清單**

| 檢查項 | 說明 | 通過/失敗 |
| ---- | ---- | ---- |
| README 包含安裝步驟 | 清晰列出後端和前端所需的依賴安裝指令 | [ ] |
| README 包含運行指令 | 分別提供啟動後端和前端的指令 | [ ] |
| README 列出訪問位址和演示流程 | 說明演示時需要訪問的位址和連接埠 | [ ] |
| Docker 配置可正常建構 | Dockerfile 和 docker-compose.yml 無語法錯誤 | [ ] |
| 生產環境變數模板完整 | .env.production.example 包含所有必需配置 | [ ] |

**如果失敗**：

```bash
# 重新執行 Preview 階段
factory run preview
```

## 檢查點 ✅

**確認你已完成**：

- [ ] Preview 階段成功執行
- [ ] `artifacts/preview/README.md` 檔案存在且內容完整
- [ ] `artifacts/backend/Dockerfile` 檔案存在且可建構
- [ ] `artifacts/backend/docker-compose.yml` 檔案存在
- [ ] `artifacts/backend/.env.production.example` 檔案存在
- [ ] `artifacts/client/eas.json` 檔案存在（行動應用）
- [ ] README 包含清晰的安裝步驟和運行指令
- [ ] README 包含演示流程和已知問題

## 踩坑提醒

### ⚠️ 陷阱 1：忽略依賴安裝步驟

**問題**：README 中只寫「啟動服務」，沒有說明如何安裝依賴。

**症狀**：新成員按照 README 操作，執行 `npm run dev` 時報錯「找不到模組」。

**解決**：Preview Agent 約束「README 必須包含安裝步驟」，確保每步都有明確的指令。

**正確範例**：

```bash
# ❌ 錯誤 - 缺少安裝步驟
npm run dev

# ✅ 正確 - 包含完整步驟
npm install
npm run dev
```

### ⚠️ 陷阱 2：Docker 配置使用 latest 標籤

**問題**：Dockerfile 中使用 `FROM node:latest` 或 `FROM node:alpine`。

**症狀**：每次建構可能使用不同版本的 Node.js，導致環境不一致。

**解決**：Preview Agent 約束「NEVER 使用 latest 作為 Docker 映像檔標籤，應使用具體版本號」。

**正確範例**：

```dockerfile
# ❌ 錯誤 - 使用 latest
FROM node:latest

# ❌ 錯誤 - 未指定具體版本
FROM node:alpine

# ✅ 正確 - 使用具體版本
FROM node:20-alpine
```

### ⚠️ 陷阱 3：環境變數硬編碼

**問題**：在 Docker 配置或 EAS 配置中硬編碼敏感資訊（密碼、API Key 等）。

**症狀**：敏感資訊洩露到程式碼倉庫，存在安全風險。

**解決**：Preview Agent 約束「NEVER 在部署配置中硬編碼敏感資訊」，使用環境變數模板。

**正確範例**：

```yaml
# ❌ 錯誤 - 硬編碼資料庫密碼
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ 正確 - 使用環境變數
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ 陷阱 4：已知問題隱藏不列

**問題**：README 中沒有列出已知問題和限制，誇大產品能力。

**症狀**：演示時出現意外，導致尷尬和信任度下降。

**解決**：Preview Agent 約束「NEVER 誇大功能或隱藏缺陷」，主動列出當前版本存在的問題。

**正確範例**：

```markdown
## 已知問題與限制

### 功能限制
- [ ] 暫不支援使用者註冊和登入
- [ ] AI 推薦可能不準確（取決於 OpenAI API 傳回結果）
```

### ⚠️ 陷阱 5：演示流程過於複雜

**問題**：演示流程包含 10+ 個步驟，需要 10 分鐘以上。

**症狀**：演示者記不住步驟，觀眾失去耐心。

**解決**：Preview Agent 約束「演示流程應控制在 3-5 分鐘，步驟不超過 5 個」。

**正確範例**：

```markdown
### 演示步驟

1. **場景介紹** (30秒)
   - 介紹目標使用者和核心問題

2. **功能演示** (3-5分鐘)
   - 步驟 1: 使用者輸入偏好
   - 步驟 2: AI 基於偏好推薦
   - 步驟 3: 使用者查看結果

3. **技術亮點** (可選, 1分鐘)
   - 即時 AI 推薦
   - 行動端響應式設計
```

## CI/CD 配置模板

Preview Agent 可以參考 `templates/cicd-github-actions.md` 生成 CI/CD 配置，包括：

### 後端 CI 流水線

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run type check
        working-directory: backend
        run: npx tsc --noEmit

      - name: Validate Prisma schema
        working-directory: backend
        run: npx prisma validate

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run tests
        working-directory: backend
        run: npm test
```

### 前端 CI 流水線

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'client/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'client/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        working-directory: client
        run: npm ci

      - name: Run linter
        working-directory: client
        run: npm run lint

      - name: Run type check
        working-directory: client
        run: npx tsc --noEmit

      - name: Run tests
        working-directory: client
        run: npm test -- --coverage
```

## Git Hooks 配置模板

Preview Agent 可以參考 `templates/git-hooks-husky.md` 生成 Git Hooks 配置，包括：

### pre-commit Hook

在提交前執行程式碼檢查和格式化。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 執行 lint-staged
npx lint-staged

# 檢查 TypeScript 類型
echo "📝 Type checking..."
npm run type-check

echo "✅ Pre-commit checks passed!"
```

### commit-msg Hook

校驗提交訊息格式。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Validating commit message..."

npx --no -- commitlint --edit "$1"

echo "✅ Commit message is valid!"
```

## 本課小結

Preview 階段是流水線的最後一環，負責為生成的應用準備完整的使用和部署文檔。它自動生成：

- **運行指南**：清晰的安裝步驟、啟動指令和演示流程
- **Docker 配置**：Dockerfile 和 docker-compose.yml，支援容器化部署
- **EAS 配置**：Expo EAS 建構配置，支援行動應用發布
- **CI/CD 配置**：GitHub Actions 流水線，支援持續整合和部署
- **Git Hooks**：Husky 配置，支援提交前檢查

**關鍵原則**：

1. **本地優先**：確保任何具有基本開發環境的人都能在本地啟動
2. **部署就緒**：提供生產環境部署所需的所有配置檔案
3. **使用者故事**：設計簡短的演示流程，展示核心價值
4. **透明風險**：主動列出當前版本存在的限制或已知問題

完成 Preview 階段後，你將獲得：

- ✅ 完整的運行指南（`README.md`）
- ✅ Docker 容器化配置（`Dockerfile`, `docker-compose.yml`）
- ✅ 生產環境變數模板（`.env.production.example`）
- ✅ Expo EAS 建構配置（`eas.json`）
- ✅ 可選的詳細部署指南（`DEPLOYMENT.md`）

## 下一課預告

> 恭喜你！你已經完成了 AI App Factory 的所有 7 個階段。
>
> 如果你想深入了解流水線的協調機制，可以學習 **[Sisyphus 調度器詳解](../orchestrator/)**。
>
> 你會學到：
> - 調度器如何協調流水線執行
> - 權限檢查和越權處理機制
> - 失敗處理和回滾策略
> - 上下文優化和 Token 節省技巧

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 功能 | 檔案路徑 | 行號 |
| ---- | ---- | ---- |
| Preview Agent 定義 | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| Preview 技能指南 | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| Pipeline 配置 | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| CI/CD 配置模板 | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Git Hooks 配置模板 | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**關鍵約束**：
- **本地優先**：確保任何具有基本開發環境的人都能在本地啟動
- **部署就緒**：提供生產環境部署所需的所有配置檔案
- **透明風險**：主動列出當前版本存在的限制或已知問題

**必須生成的檔案**：
- `artifacts/preview/README.md` - 主運行說明文檔
- `artifacts/backend/Dockerfile` - 後端 Docker 配置
- `artifacts/backend/docker-compose.yml` - 開發環境 Docker Compose
- `artifacts/backend/.env.production.example` - 生產環境變數模板
- `artifacts/client/eas.json` - Expo EAS 建構配置

**不要做 (NEVER)**：
- NEVER 忽略依賴安裝或配置步驟，否則運行或部署很可能失敗
- NEVER 提供與應用無關的額外說明或行銷語言
- NEVER 誇大產品能力，隱瞞缺陷或限制
- NEVER 在部署配置中硬編碼敏感資訊（密碼、API Key 等）
- NEVER 忽略健康檢查配置，這對生產環境監控至關重要
- NEVER 跳過資料庫遷移說明，這是上線的關鍵步驟
- NEVER 使用 `latest` 作為 Docker 映像檔標籤，應使用具體版本號
- NEVER 在生產環境使用 SQLite（應遷移到 PostgreSQL）

</details>
