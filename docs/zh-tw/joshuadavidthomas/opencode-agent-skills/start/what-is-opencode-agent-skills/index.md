---
title: "介紹: OpenCode Agent Skills | opencode-agent-skills"
sidebarTitle: "讓 AI 懂你的技能"
subtitle: "介紹: OpenCode Agent Skills"
description: "學習 OpenCode Agent Skills 的核心價值與主要功能。掌握動態技能發現、上下文注入、壓縮恢復等特性，支援 Claude Code 相容和自動推薦。"
tags:
  - "入門指南"
  - "外掛介紹"
prerequisite: []
order: 1
---

# 什麼是 OpenCode Agent Skills？

## 學完你能做什麼

- 了解 OpenCode Agent Skills 外掛的核心價值
- 掌握外掛提供的主要功能特性
- 理解技能如何自動發現和載入
- 區分本外掛與其他技能管理方案的差異

## 你現在的困境

你可能遇到過這些情況：

- **技能分散管理困難**：技能散落在專案、使用者目錄、外掛快取等多個位置，找不到合適的技能
- **對話越長越麻煩**：長時間對話後，之前載入的技能因上下文壓縮而失效
- **相容性焦慮**：擔心從 Claude Code 遷移後，現有的技能和外掛無法使用
- **需要重複設定**：每個專案都要重新設定技能，缺乏統一的技能管理機制

這些問題都在影響你使用 AI 助手的效率。

## 核心思路

**OpenCode Agent Skills** 是一個為 OpenCode 提供動態技能發現和管理能力的外掛系統。

::: info 什麼是技能？
技能（Skill）是包含 AI 工作流程指導的可複用模組。它通常是一個目錄，包含 `SKILL.md` 檔案（描述技能的功能和使用方法），以及可能的輔助檔案（文件、指令碼等）。
:::

**核心價值**：透過標準化技能格式（SKILL.md），實現跨專案、跨對話的技能複用。

### 技術架構

外掛基於 TypeScript + Bun + Zod 開發，提供 4 個核心工具：

| 工具 | 功能 |
| --- | --- |
| `use_skill` | 將技能的 SKILL.md 內容注入到對話上下文 |
| `read_skill_file` | 讀取技能目錄下的支援檔案（文件、設定等） |
| `run_skill_script` | 在技能目錄上下文中執行可執行指令碼 |
| `get_available_skills` | 取得目前可用的技能清單 |

## 主要功能特性

### 1. 動態技能發現

外掛會從多個位置自動發現技能，按優先順序排序：

```
1. .opencode/skills/              (專案級 - OpenCode)
2. .claude/skills/                (專案級 - Claude Code)
3. ~/.config/opencode/skills/     (使用者級 - OpenCode)
4. ~/.claude/skills/              (使用者級 - Claude Code)
5. ~/.claude/plugins/cache/        (外掛快取)
6. ~/.claude/plugins/marketplaces/ (已安裝外掛)
```

**規則**：第一個匹配的技能生效，後續同名技能被忽略。

> 為什麼這樣設計？
>
> 專案級技能優先於使用者級技能，這樣你可以在專案中自訂特定行為，而不會影響全域設定。

### 2. 上下文注入

當你呼叫 `use_skill` 時，技能內容以 XML 格式注入到對話上下文：

- `noReply: true` - AI 不會對注入的訊息做出回應
- `synthetic: true` - 標記為系統產生的訊息（不在 UI 顯示，不計入使用者輸入）

這意味著技能內容會持久存在於對話上下文中，即使對話增長並發生上下文壓縮，技能仍然可用。

### 3. 壓縮恢復機制

當 OpenCode 執行上下文壓縮時（長時間對話常見操作），外掛會監聽 `session.compacted` 事件，自動重新注入可用技能清單。

這確保了 AI 在長時間對話中始終知道有哪些技能可用，不會因為壓縮而遺失技能存取能力。

### 4. Claude Code 相容

外掛完全相容 Claude Code 的技能和外掛系統，支援：

- Claude Code 技能（`.claude/skills/<skill-name>/SKILL.md`）
- Claude 外掛快取（`~/.claude/plugins/cache/...`）
- Claude 外掛市場（`~/.claude/plugins/marketplaces/...`）

這意味著如果你之前使用 Claude Code，遷移到 OpenCode 後仍然可以使用現有的技能和外掛。

### 5. 自動技能推薦

外掛會監控你的訊息，使用語意相似度檢測是否與某個可用技能相關：

- 計算訊息的 embedding 向量
- 與所有技能的描述計算餘弦相似度
- 當相似度超過閾值時，注入評估提示建議 AI 載入相關技能

這個過程完全自動，你不需要記住技能名稱或明確請求。

### 6. Superpowers 整合（可選）

外掛支援 Superpowers 工作流程，透過環境變數啟用：

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

啟用後，外掛會自動檢測 `using-superpowers` 技能，並在對話初始化時注入完整的工作流程指導。

## 與其他方案對比

| 方案 | 特點 | 適用場景 |
| --- | --- | --- |
| **opencode-agent-skills** | 動態發現、壓縮恢復、自動推薦 | 需要統一管理和自動推薦的場景 |
| **opencode-skills** | 自動註冊為 `skills_{{name}}` 工具 | 需要獨立工具呼叫的場景 |
| **superpowers** | 完整軟體開發工作流程 | 需要嚴格流程規範的專案 |
| **skillz** | MCP 伺服器模式 | 需要跨工具使用技能的場景 |

選擇本外掛的理由：

- ✅ **零設定**：自動發現和管理技能
- ✅ **智慧推薦**：基於語意匹配自動推薦相關技能
- ✅ **壓縮恢復**：長時間對話穩定可靠
- ✅ **相容性**：無縫遷移 Claude Code 技能

## 本課小結

OpenCode Agent Skills 外掛透過動態發現、上下文注入、壓縮恢復等核心機制，為 OpenCode 提供了完整的技能管理能力。它的核心價值在於：

- **自動化**：減少手動設定和記憶技能名稱的負擔
- **穩定性**：長時間對話中技能始終可用
- **相容性**：與現有 Claude Code 生態無縫整合

## 下一課預告

> 下一課我們學習 **[安裝 OpenCode Agent Skills](../installation/)**。
>
> 你會學到：
> - 如何在 OpenCode 設定中新增外掛
> - 如何驗證外掛是否正確安裝
> - 本機開發模式的設定方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 外掛入口和功能概述 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| 核心功能特性清單 | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| 技能發現優先順序 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| 合成訊息注入 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| 壓縮恢復機制 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| 語意匹配模組 | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**關鍵常數**：
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`：使用的 embedding 模型
- `SIMILARITY_THRESHOLD = 0.35`：語意相似度閾值
- `TOP_K = 5`：自動推薦回傳的技能數量上限

**關鍵函式**：
- `discoverAllSkills()`：從多個位置發現技能
- `use_skill()`：將技能內容注入到對話上下文
- `matchSkills()`：基於語意相似度匹配相關技能
- `injectSyntheticContent()`：注入合成訊息到對話

</details>
