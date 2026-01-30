---
title: "CLI vs MCP: 設計選擇 | OpenSkills"
sidebarTitle: "為何選 CLI 而非 MCP"
subtitle: "為什麼是 CLI 而不是 MCP？"
description: "學習 OpenSkills 選擇 CLI 而非 MCP 的設計理由。對比兩者的定位差異，了解技能系統為什麼適合靜態檔案模式，以及如何實作多代理通用性和零配置部署。"
tags:
  - "FAQ"
  - "設計理念"
  - "MCP"
prerequisite:
  - "start-what-is-openskills"
order: 3
---

# 為什麼是 CLI 而不是 MCP？

## 學完你能做什麼

本課幫你理解：

- ✅ 了解 MCP 和技能系統的定位差異
- ✅ 理解為什麼 CLI 更適合技能載入
- ✅ 掌握 OpenSkills 的設計哲學
- ✅ 理解技能系統的技術原理

## 你現在的困境

你可能會想：

- "為什麼不用更先進的 MCP 協定？"
- "CLI 方式是不是太老舊了？"
- "MCP 不是更符合 AI 時代的設計嗎？"

本課幫你理解這些設計決策背後的技術考量。

---

## 核心問題：技能是什麼？

在討論 CLI vs MCP 之前，先理解「技能」的本質。

### 技能的本質

::: info 技能的定義
技能是**靜態指令 + 資源**的組合，包括：
- `SKILL.md`：詳細的操作指南和提示詞
- `references/`：參考文件
- `scripts/`：可執行腳本
- `assets/`：圖片、範本等資源

技能**不是**動態服務、即時 API 或需要伺服器運行的工具。
:::

### Anthropic 的官方設計

Anthropic 的技能系統本身就是基於**檔案系統**設計的：

- 技能以 `SKILL.md` 檔案形式存在
- 透過 `<available_skills>` XML 區塊描述可用技能
- AI 代理按需求取檔案內容到上下文

這決定了技能系統的技術選型必須與檔案系統相容。

---

## MCP vs OpenSkills：定位對比

| 對比維度 | MCP（Model Context Protocol） | OpenSkills（CLI） |
|--- | --- | ---|
| **適用場景** | 動態工具、即時 API 呼叫 | 靜態指令、文件、腳本 |
| **運行要求** | 需要 MCP 伺服器 | 無需伺服器（純檔案） |
| **代理支援** | 僅支援 MCP 的代理 | 所有能讀 `AGENTS.md` 的代理 |
| **複雜度** | 需要伺服器部署和維護 | 零配置，開箱即用 |
| **資料來源** | 即時從伺服器取得 | 從本地檔案系統讀取 |
| **網路依賴** | 需要 | 不需要 |
| **技能載入** | 透過協定呼叫 | 透過檔案讀取 |

---

## 為什麼 CLI 更適合技能系統？

### 1. 技能就是檔案

**MCP 需要伺服器**：需要部署 MCP 伺服器，處理請求、回應、協定握手...

**CLI 只需檔案**：

```bash
# 技能儲存在檔案系統中
.claude/skills/pdf/
├── SKILL.md              # 主指令檔案
├── references/           # 參考文件
│   └── pdf-format-spec.md
├── scripts/             # 可執行腳本
│   └── extract-pdf.py
└── assets/              # 資源檔案
    └── pdf-icon.png
```

**優勢**：
- ✅ 零配置，無需伺服器
- ✅ 技能可以被版本控制
- ✅ 離線可用
- ✅ 部署簡單

### 2. 通用性：所有代理都能用

**MCP 的限制**：

只有支援 MCP 協定的代理才能使用。如果 Cursor、Windsurf、Aider 等代理各自實作 MCP，會帶來：
- 重複開發工作
- 協定相容性問題
- 版本同步困難

**CLI 的優勢**：

任何能執行 shell 指令的代理都能用：

```bash
# Claude Code 呼叫
npx openskills read pdf

# Cursor 呼叫
npx openskills read pdf

# Windsurf 呼叫
npx openskills read pdf
```

**零整合成本**：只需要代理能執行 shell 指令即可。

### 3. 符合官方設計

Anthropic 的技能系統本身就是**檔案系統設計**，不是 MCP 設計：

```xml
<!-- AGENTS.md 中的技能描述 -->
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>
</available_skills>
```

**呼叫方式**：

```bash
# 官方設計的呼叫方式
npx openskills read pdf
```

OpenSkills 完全遵循 Anthropic 的官方設計，保持了相容性。

### 4. 漸進式載入（Progressive Disclosure）

**技能系統的核心優勢**：按需載入，保持上下文精簡。

**CLI 的實作**：

```bash
# 只在需要時才載入技能內容
npx openskills read pdf
# 輸出：SKILL.md 的完整內容到標準輸出
```

**MCP 的挑戰**：

如果用 MCP 實作，需要：
- 伺服器管理技能列表
- 實作按需載入邏輯
- 處理上下文管理

而 CLI 方式天然支援漸進式載入。

---

## MCP 的適用場景

MCP 解決的問題與技能系統**不同**：

| MCP 解決的問題 | 範例 |
|--- | ---|
| **即時 API 呼叫** | 呼叫 OpenAI API、資料庫查詢 |
| **動態工具** | 計算器、資料轉換服務 |
| **遠端服務整合** | Git 操作、CI/CD 系統 |
| **狀態管理** | 需要維護伺服器狀態的工具 |

這些場景需要**伺服器**和**協定**，MCP 是正確的選擇。

---

## 技能系統 vs MCP：不是競爭關係

**核心觀點**：MCP 和技能系統解決不同問題，不是非此即彼。

### 技能系統的定位

```
[靜態指令] → [SKILL.md] → [檔案系統] → [CLI 載入]
```

適用場景：
- 操作指南和最佳實踐
- 文件和參考資料
- 靜態腳本和範本
- 需要版本控制的配置

### MCP 的定位

```
[動態工具] → [MCP 伺服器] → [協定呼叫] → [即時回應]
```

適用場景：
- 即時 API 呼叫
- 資料庫查詢
- 需要狀態的遠端服務
- 複雜的計算和轉換

### 互補關係

OpenSkills 不排斥 MCP，而是**專注於技能載入**：

```
AI 代理
  ├─ 技能系統（OpenSkills CLI）→ 載入靜態指令
  └─ MCP 工具 → 呼叫動態服務
```

它們是互補的，不是替代的。

---

## 實際案例：什麼時候用哪個？

### 案例 1：呼叫 Git 操作

❌ **不適合技能系統**：
- Git 操作是動態的，需要即時互動
- 依賴 Git 伺服器狀態

✅ **適合 MCP**：
```bash
# 透過 MCP 工具呼叫
git:checkout(branch="main")
```

### 案例 2：PDF 處理指南

❌ **不適合 MCP**：
- 操作指南是靜態的
- 不需要伺服器運行

✅ **適合技能系統**：
```bash
# 透過 CLI 載入
npx openskills read pdf
# 輸出：詳細的 PDF 處理步驟和最佳實踐
```

### 案例 3：資料庫查詢

❌ **不適合技能系統**：
- 需要連接資料庫
- 結果是動態的

✅ **適合 MCP**：
```bash
# 透過 MCP 工具呼叫
database:query(sql="SELECT * FROM users")
```

### 案例 4：程式碼審查規範

❌ **不適合 MCP**：
- 審查規範是靜態文件
- 需要版本控制

✅ **適合技能系統**：
```bash
# 透過 CLI 載入
npx openskills read code-review
# 輸出：詳細的程式碼審查清單和範例
```

---

## 未來：MCP 和技能系統的融合

### 可能的演進方向

**MCP + 技能系統**：

```bash
# 技能中引用 MCP 工具
npx openskills read pdf-tool

# SKILL.md 內容
本技能需要使用 MCP 工具：

1. 使用 mcp:pdf-extract 提取文字
2. 使用 mcp:pdf-parse 解析結構
3. 使用本技能提供的腳本處理結果
```

**優勢**：
- 技能提供高級指令和最佳實踐
- MCP 提供底層動態工具
- 两者結合，功能更強大

### 當前階段

OpenSkills 選擇 CLI 是因為：
1. 技能系統已經是成熟的檔案系統設計
2. CLI 方式實作簡單、通用性強
3. 無需等待各個代理實作 MCP 支援

---

## 本課小結

OpenSkills 選擇 CLI 而非 MCP 的核心理由：

### 核心原因

- ✅ **技能是靜態檔案**：無需伺服器，檔案系統儲存
- ✅ **通用性更強**：所有代理都能用，不依賴 MCP 協定
- ✅ **符合官方設計**：Anthropic 技能系統本身就是檔案系統設計
- ✅ **零配置部署**：無需伺服器，開箱即用

### MCP vs 技能系統

| MCP | 技能系統（CLI） |
|--- | ---|
| 動態工具 | 靜態指令 |
| 需要伺服器 | 純檔案系統 |
| 即時 API | 文件和腳本 |
| 需要協定支援 | 零整合成本 |

### 不是競爭，是互補

- MCP 解決動態工具問題
- 技能系統解決靜態指令問題
- 兩者可以結合使用

---

## 相關閱讀

- [什麼是 OpenSkills？](../../start/what-is-openskills/)
- [指令詳解](../../platforms/cli-commands/)
- [建立自訂技能](../../advanced/create-skills/)

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                      | 行號    |
|--- | --- | ---|
| CLI 入口    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)                     | 39-80   |
| 讀取指令    | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50    |
| AGENTS.md 生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93   |

**關鍵設計決策**：
- CLI 方式：透過 `npx openskills read <name>` 載入技能
- 檔案系統儲存：技能儲存在 `.claude/skills/` 或 `.agent/skills/`
- 通用相容性：輸出與 Claude Code 完全一致的 XML 格式

</details>
