---
title: "目錄結構詳解：Factory 專案完整結構與檔案用途 | AI App Factory 教程"
sidebarTitle: "目錄結構詳解"
subtitle: "目錄結構詳解：Factory 專案完整指南"
description: "學習 AI App Factory 專案的完整目錄結構和各檔案用途。本教程詳細解釋 agents、skills、policies、artifacts 等核心目錄的作用和檔案功能，幫助你深入理解 Factory 專案的工作原理，快速定位和修改設定檔，以及除錯流水線問題。"
tags:
  - "附錄"
  - "目錄結構"
  - "專案架構"
prerequisite:
  - "/start-init-project"
order: 220
---

# 目錄結構詳解：Factory 專案完整指南

## 學完你能做什麼

- ✅ 了解 Factory 專案的完整目錄結構
- ✅ 知道每個目錄和檔案的用途
- ✅ 理解產物（artifacts）的儲存方式
- ✅ 掌握設定檔的作用和修改方法

## 核心思路

Factory 專案採用清晰的目錄分層結構，將設定、程式碼、產物和文件分離。理解這些目錄結構，有助於你快速定位檔案、修改設定和除錯問題。

Factory 專案有兩種形態：

**形態 1：原始碼倉庫**（你從 GitHub 克隆的）
**形態 2：初始化後的專案**（`factory init` 生成的）

本教程重點講解**形態 2**——初始化後的 Factory 專案結構，因為這是你日常工作的目錄。

---

## Factory 專案完整結構

```
my-app/                          # 你的 Factory 專案根目錄
|-- .factory/                    # Factory 核心設定目錄（不要手動修改）
|   |-- pipeline.yaml             # 流水線定義（7 個階段）
|   |-- config.yaml               # 專案設定檔（技術堆疊、MVP 約束等）
|   |-- state.json                # 流水線執行狀態（當前階段、已完成階段）
|   |-- agents/                   # Agent 定義（AI 助手的任務說明）
|   |-- skills/                   # 技能模組（可複用的知識）
|   |-- policies/                 # 策略文件（權限、失敗處理、程式碼規範）
|   |-- templates/                # 設定範本（CI/CD、Git Hooks）
|-- .claude/                      # Claude Code 設定目錄（自動生成）
|   '-- settings.local.json       # Claude Code 權限設定
|-- input/                        # 使用者輸入目錄
|   '-- idea.md                   # 結構化的產品想法（由 Bootstrap 生成）
'-- artifacts/                    # 流水線產物目錄（7 個階段的輸出）
    |-- prd/                      # PRD 產物
    |   '-- prd.md                # 產品需求文件
    |-- ui/                       # UI 產物
    |   |-- ui.schema.yaml        # UI 結構定義
    |   '-- preview.web/          # 可預覽的 HTML 原型
    |       '-- index.html
    |-- tech/                     # Tech 產物
    |   '-- tech.md               # 技術架構文件
    |-- backend/                  # 後端程式碼（Express + Prisma）
    |   |-- src/                  # 原始碼
    |   |-- prisma/               # 資料庫設定
    |   |   |-- schema.prisma     # Prisma 資料模型
    |   |   '-- seed.ts           # 種子資料
    |   |-- tests/                # 測試
    |   |-- docs/                 # API 文件
    |   |-- package.json
    |   |-- tsconfig.json
    |   '-- README.md
    |-- client/                   # 前端程式碼（React Native）
    |   |-- src/                  # 原始碼
    |   |-- __tests__/            # 測試
    |   |-- app.json
    |   |-- package.json
    |   '-- README.md
    |-- validation/               # 驗證產物
    |   '-- report.md             # 程式碼品質驗證報告
    |-- preview/                  # Preview 產物
    |   |-- README.md             # 部署和執行指南
    |   '-- GETTING_STARTED.md    # 快速啟動指南
    |-- _failed/                  # 失敗產物歸檔
    |   '-- <stage-id>/           # 失敗階段的產物
    '-- _untrusted/               # 越權產物隔離
        '-- <stage-id>/           # 越權 Agent 寫入的檔案
```

---

## .factory/ 目錄詳解

`.factory/` 目錄是 Factory 專案的核心，包含了流水線定義、Agent 設定和策略文件。這個目錄由 `factory init` 指令自動建立，通常不需要手動修改。

### pipeline.yaml - 流水線定義

**用途**：定義 7 個階段的執行順序、輸入輸出和退出條件。

**關鍵內容**：
- 7 個階段：bootstrap、prd、ui、tech、code、validation、preview
- 每個階段的 Agent、輸入檔案、輸出檔案
- 退出條件（exit_criteria）：階段完成的驗證標準

**範例**：
```yaml
stages:
  - id: bootstrap
    description: 初始化專案想法
    agent: agents/bootstrap.agent.md
    inputs: []
    outputs:
      - input/idea.md
    exit_criteria:
      - idea.md 存在
      - idea.md 描述了一個連貫的產品想法
```

**何時修改**：通常不需要修改，除非你要自訂流水線流程。

### config.yaml - 專案設定檔

**用途**：設定技術堆疊、MVP 約束、UI 偏好等全域設定。

**主要設定項**：
- `preferences`：技術堆疊偏好（後端語言、資料庫、前端框架等）
- `mvp_constraints`：MVP 範圍控制（最大頁面數、最大模型數等）
- `ui_preferences`：UI 設計偏好（審美方向、顏色方案）
- `pipeline`：流水線行為（檢查點模式、失敗處理）
- `advanced`：進階選項（Agent 逾時、並發控制）

**範例**：
```yaml
preferences:
  backend:
    language: typescript
    framework: express
    database: sqlite
  mvp_constraints:
    max_pages: 3
    enable_auth: false
```

**何時修改**：當你想調整技術堆疊或改變 MVP 範圍時。

### state.json - 流水線狀態

**用途**：記錄流水線的執行狀態，支援斷點續傳。

**關鍵內容**：
- `status`：當前狀態（idle/running/waiting_for_confirmation/paused/failed）
- `current_stage`：當前執行到的階段
- `completed_stages`：已完成的階段列表
- `last_updated`：最後更新時間

**何時修改**：自動更新，不要手動修改。

### agents/ - Agent 定義目錄

**用途**：定義每個 Agent 的職責、輸入輸出和執行約束。

**檔案列表**：
| 檔案 | 說明 |
|------|------|
| `orchestrator.checkpoint.md` | 排程器核心定義（流水線協調） |
| `orchestrator-implementation.md` | 排程器實作指南（開發參考） |
| `bootstrap.agent.md` | Bootstrap Agent（結構化產品想法） |
| `prd.agent.md` | PRD Agent（生成需求文件） |
| `ui.agent.md` | UI Agent（設計 UI 原型） |
| `tech.agent.md` | Tech Agent（設計技術架構） |
| `code.agent.md` | Code Agent（生成程式碼） |
| `validation.agent.md` | Validation Agent（驗證程式碼品質） |
| `preview.agent.md` | Preview Agent（生成部署指南） |

**何時修改**：通常不需要修改，除非你要自訂某個 Agent 的行為。

### skills/ - 技能模組目錄

**用途**：可複用的知識模組，每個 Agent 會載入對應的 Skill 檔案。

**目錄結構**：
```
skills/
|-- bootstrap/skill.md         # 產品想法結構化
|-- prd/skill.md               # PRD 生成
|-- ui/skill.md                # UI 設計
|-- tech/skill.md              # 技術架構 + 資料庫遷移
|-- code/skill.md              # 程式碼生成 + 測試 + 日誌
|   '-- references/            # 程式碼生成參考範本
|       |-- backend-template.md   # 生產就緒後端範本
|       '-- frontend-template.md  # 生產就緒前端範本
'-- preview/skill.md           # 部署設定 + 快速啟動指南
```

**何時修改**：通常不需要修改，除非你要擴充某個 Skill 的能力。

### policies/ - 策略文件目錄

**用途**：定義權限、失敗處理、程式碼規範等策略。

**檔案列表**：
| 檔案 | 說明 |
|------|------|
| `capability.matrix.md` | 能力邊界矩陣（Agent 讀寫權限） |
| `failure.policy.md` | 失敗處理策略（重試、還原、人工介入） |
| `context-isolation.md` | 上下文隔離策略（節省 Token） |
| `error-codes.md` | 統一錯誤碼規範 |
| `code-standards.md` | 程式碼規範（編碼風格、檔案結構） |
| `pr-template.md` | PR 範本和程式碼審查清單 |
| `changelog.md` | Changelog 生成規範 |

**何時修改**：通常不需要修改，除非你要調整策略或規範。

### templates/ - 設定範本目錄

**用途**：CI/CD、Git Hooks 等設定範本。

**檔案列表**：
| 檔案 | 說明 |
|------|------|
| `cicd-github-actions.md` | CI/CD 設定（GitHub Actions） |
| `git-hooks-husky.md` | Git Hooks 設定（Husky） |

**何時修改**：通常不需要修改，除非你要自訂 CI/CD 流程。

---

## .claude/ 目錄詳解

### settings.local.json - Claude Code 權限設定

**用途**：定義 Claude Code 可以存取的目錄和操作權限。

**何時生成**：`factory init` 時自動生成。

**何時修改**：通常不需要修改，除非你要調整權限範圍。

---

## input/ 目錄詳解

### idea.md - 結構化的產品想法

**用途**：儲存結構化的產品想法，由 Bootstrap Agent 生成。

**生成時機**：Bootstrap 階段完成後。

**內容結構**：
- 問題定義（Problem）
- 目標使用者（Target Users）
- 核心價值（Core Value）
- 假設（Assumptions）
- 非目標（Out of Scope）

**何時修改**：如果你想調整產品方向，可以手動編輯，然後重新執行 Bootstrap 或後續階段。

---

## artifacts/ 目錄詳解

`artifacts/` 目錄是流水線產物的存放位置，每個階段會將產物寫入對應的子目錄。

### prd/ - PRD 產物目錄

**產物檔案**：
- `prd.md`：產品需求文件

**內容**：
- 使用者故事（User Stories）
- 功能列表（Features）
- 非功能需求（Non-functional Requirements）
- 非目標（Out of Scope）

**生成時機**：PRD 階段完成後。

### ui/ - UI 產物目錄

**產物檔案**：
- `ui.schema.yaml`：UI 結構定義（頁面、元件、互動）
- `preview.web/index.html`：可預覽的 HTML 原型

**內容**：
- 頁面結構（頁面數量、佈局）
- 元件定義（按鈕、表單、列表等）
- 互動流程（導航、跳轉）
- 設計系統（配色、字型、間距）

**生成時機**：UI 階段完成後。

**預覽方式**：在瀏覽器中開啟 `preview.web/index.html`。

### tech/ - Tech 產物目錄

**產物檔案**：
- `tech.md`：技術架構文件

**內容**：
- 技術堆疊選擇（後端、前端、資料庫）
- 資料模型設計
- API 端點設計
- 安全策略
- 效能最佳化建議

**生成時機**：Tech 階段完成後。

### backend/ - 後端程式碼目錄

**產物檔案**：
```
backend/
|-- src/                      # 原始碼
|   |-- routes/               # API 路由
|   |-- services/             # 業務邏輯
|   |-- middleware/           # 中介軟體
|   '-- utils/               # 工具函式
|-- prisma/                   # Prisma 設定
|   |-- schema.prisma         # Prisma 資料模型
|   '-- seed.ts              # 種子資料
|-- tests/                    # 測試
|   |-- unit/                 # 單元測試
|   '-- integration/          # 整合測試
|-- docs/                     # 文件
|   '-- api-spec.yaml        # API 規範（Swagger）
|-- package.json
|-- tsconfig.json
|-- vitest.config.ts
'-- README.md
```

**內容**：
- Express 後端伺服器
- Prisma ORM（SQLite/PostgreSQL）
- Vitest 測試框架
- Swagger API 文件

**生成時機**：Code 階段完成後。

### client/ - 前端程式碼目錄

**產物檔案**：
```
client/
|-- src/                      # 原始碼
|   |-- screens/              # 頁面
|   |-- components/           # 元件
|   |-- navigation/           # 導航設定
|   |-- services/             # API 服務
|   '-- utils/               # 工具函式
|-- __tests__/               # 測試
|   '-- components/          # 元件測試
|-- assets/                  # 靜態資源
|-- app.json                 # Expo 設定
|-- package.json
|-- tsconfig.json
'-- README.md
```

**內容**：
- React Native + Expo
- React Navigation
- Jest + React Testing Library
- TypeScript

**生成時機**：Code 階段完成後。

### validation/ - 驗證產物目錄

**產物檔案**：
- `report.md`：程式碼品質驗證報告

**內容**：
- 套件安裝驗證
- TypeScript 類型檢查
- Prisma schema 驗證
- 測試覆蓋率

**生成時機**：Validation 階段完成後。

### preview/ - Preview 產物目錄

**產物檔案**：
- `README.md`：部署和執行指南
- `GETTING_STARTED.md`：快速啟動指南

**內容**：
- 本地執行步驟
- Docker 部署設定
- CI/CD 流水線
- 存取位址和演示流程

**生成時機**：Preview 階段完成後。

### _failed/ - 失敗產物歸檔

**用途**：存放失敗階段的產物，便於除錯。

**目錄結構**：
```
_failed/
|-- bootstrap/
|-- prd/
|-- ui/
|-- tech/
|-- code/
|-- validation/
'-- preview/
```

**何時生成**：某個階段連續失敗兩次後。

### _untrusted/ - 越權產物隔離

**用途**：存放越權 Agent 寫入的檔案，防止污染主產物。

**目錄結構**：
```
_untrusted/
|-- bootstrap/
|-- prd/
|-- ui/
|-- tech/
|-- code/
|-- validation/
'-- preview/
```

**何時生成**：Agent 嘗試寫入未授權目錄時。

---

## 常見問題

### 1. 我可以手動修改 .factory/ 下的檔案嗎？

::: warning 謹慎修改
**不推薦**直接修改 `.factory/` 下的檔案，除非你非常清楚自己在做什麼。錯誤的修改可能導致流水線無法正常執行。

如果你需要自訂設定，優先考慮修改 `config.yaml` 檔案。
:::

### 2. artifacts/ 下的檔案可以手動修改嗎？

**可以**。`artifacts/` 下的檔案是流水線的輸出產物，你可以：

- 修改 `input/idea.md` 或 `artifacts/prd/prd.md` 來調整產品方向
- 手動修復 `artifacts/backend/` 或 `artifacts/client/` 中的程式碼
- 調整 `artifacts/ui/preview.web/index.html` 中的樣式

修改後，可以從相應階段重新執行流水線。

### 3. _failed/ 和 _untrusted/ 下的檔案如何處理？

- **_failed/**：檢查失敗原因，修復問題後重新執行該階段。
- **_untrusted/**：確認檔案是否應該存在，如果是，將檔案移動到正確的目錄。

### 4. state.json 檔案損壞了怎麼辦？

如果 `state.json` 損壞，可以執行以下指令重設：

```bash
factory reset
```

### 5. 如何查看流水線的當前狀態？

執行以下指令查看當前狀態：

```bash
factory status
```

---

## 本課小結

本課我們詳細講解了 Factory 專案的完整目錄結構：

- ✅ `.factory/`：Factory 核心設定（pipeline、agents、skills、policies）
- ✅ `.claude/`：Claude Code 權限設定
- ✅ `input/`：使用者輸入（idea.md）
- ✅ `artifacts/`：流水線產物（prd、ui、tech、backend、client、validation、preview）
- ✅ `_failed/` 和 `_untrusted/`：失敗和越權產物歸檔

理解這些目錄結構，有助於你快速定位檔案、修改設定和除錯問題。

---

## 下一課預告

> 下一課我們學習 **[程式碼規範](../code-standards/)**。
>
> 你會學到：
> - TypeScript 編碼規範
> - 檔案結構和命名約定
> - 註解和文件要求
> - Git 提交訊息規範
