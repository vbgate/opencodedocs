---
title: "核心概念: 統一技能生態 | OpenSkills"
sidebarTitle: "讓 AI 工具共享技能"
subtitle: "核心概念: 統一技能生態 | OpenSkills"
description: "學習 OpenSkills 的核心概念和工作原理。作為統一技能加載器，支援多代理共享技能，實現漸進式加載。"
tags:
  - "概念介紹"
  - "核心概念"
prerequisite: []
order: 2
---

# 什麼是 OpenSkills？

## 學完你能做什麼

- 理解 OpenSkills 的核心價值和工作原理
- 知道 OpenSkills 和 Claude Code 的關係
- 判斷何時使用 OpenSkills 而不是內建技能系統
- 了解如何讓多個 AI 編碼代理共享技能生態

::: info 前置知識
本教程假設你了解基本的 AI 編碼工具（如 Claude Code、Cursor 等），但不要求你有任何 OpenSkills 使用經驗。
:::

---

## 你現在的困境

你可能遇到這些場景：

- **在 Claude Code 用順手的技能，換了 AI 工具就沒了**：比如 Claude Code 裡的 PDF 處理技能，到了 Cursor 就用不了
- **不同工具重複安裝技能**：每個 AI 工具都要單獨配置技能，管理成本高
- **想用私有技能，但官方 Marketplace 不支援**：公司內部或自己開發的技能，無法方便地分享給團隊

這些問題本質上都是：**技能格式不統一，無法跨工具共享**。

---

## 核心思路：統一技能格式

OpenSkills 的核心思想很簡單：**把 Claude Code 的技能系統變成通用的技能加載器**。

### 它是什麼

**OpenSkills** 是 Anthropic 技能系統的通用加載器，讓任何 AI 編碼代理（Claude Code、Cursor、Windsurf、Aider 等）都能使用標準的 SKILL.md 格式技能。

簡單說：**一個安裝器，服務所有 AI 編碼工具**。

### 它解決了什麼問題

| 問題 | 解決方案 |
|--- | ---|
| 技能格式不統一 | 使用 Claude Code 的標準 SKILL.md 格式 |
| 技能無法跨工具共享 | 生成統一的 AGENTS.md，所有工具都能讀取 |
| 技能管理分散 | 統一的安裝、更新、刪除命令 |
| 私有技能難分享 | 支援從本地路徑和私有 git 倉庫安裝 |

---

## 核心價值

OpenSkills 提供以下核心價值：

### 1. 統一標準

所有代理使用相同的技能格式和 AGENTS.md 描述，無需學習新格式。

- **與 Claude Code 完全兼容**：相同的提示格式、相同的 Marketplace、相同的資料夾結構
- **標準化的 SKILL.md**：技能定義清晰，易於開發和維護

### 2. 漸進式加載

按需加載技能，保持 AI 上下文精簡。

- 不需要一次性加載所有技能
- AI 代理根據任務需求動態加載相關技能
- 避免上下文爆炸，提升響應品質

### 3. 多代理支援

一套技能服務多個代理，無需重複安裝。

- Claude Code、Cursor、Windsurf、Aider 共享同一套技能
- 統一的技能管理介面
- 減少配置和維護成本

### 4. 開源友善

支援本地路徑和私有 git 倉庫，適合團隊協作。

- 從本地檔案系統安裝技能（開發中）
- 從私有 git 倉庫安裝（公司內部共享）
- 技能可以和專案一起版本管理

### 5. 本地執行

無資料上傳，隱私安全。

- 所有技能檔案存儲在本地
- 不依賴雲端服務，無資料洩露風險
- 適合敏感專案和企業環境

---

## 工作原理

OpenSkills 的工作流程很簡單，分為三步：

### 第一步：安裝技能

從 GitHub、本地路徑或私有 git 倉庫安裝技能到你的專案。

```bash
# 從 Anthropic 官方倉庫安裝
openskills install anthropics/skills

# 從本地路徑安裝
openskills install ./my-skills
```

技能會被安裝到專案的 `.claude/skills/` 目錄（預設），或 `.agent/skills/` 目錄（使用 `--universal` 時）。

### 第二步：同步到 AGENTS.md

將已安裝技能同步到 AGENTS.md 檔案，生成 AI 代理可讀取的技能列表。

```bash
openskills sync
```

AGENTS.md 會包含類似這樣的 XML：

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### 第三步：AI 代理加載技能

當 AI 代理需要使用技能時，通過以下命令加載技能內容：

```bash
openskills read <skill-name>
```

AI 代理會將技能內容動態加載到上下文中，執行任務。

---

## 與 Claude Code 的關係

OpenSkills 和 Claude Code 是互補關係，不是替代關係。

### 格式完全兼容

| Aspect | Claude Code | OpenSkills |
|--- | --- | ---|
| **提示格式** | `<available_skills>` XML | 相同的 XML |
| **技能存儲** | `.claude/skills/` | `.claude/skills/` (預設) |
| **技能調用** | `Skill("name")` tool | `npx openskills read <name>` |
| **Marketplace** | Anthropic marketplace | GitHub (anthropics/skills) |
| **漸進式加載** | ✅ | ✅ |

### 使用場景對比

| 場景 | 推薦工具 | 原因 |
|--- | --- | ---|
| 只用 Claude Code | Claude Code 內建 | 無需額外安裝，官方支援 |
| 多個 AI 工具混用 | OpenSkills | 統一管理，避免重複 |
| 需要私有技能 | OpenSkills | 支援本地和私有倉庫 |
| 團隊協作 | OpenSkills | 技能可版本管理，易於分享 |

---

## 安裝位置說明

OpenSkills 支援三種安裝位置：

| 安裝位置 | 命令 | 適用場景 |
|--- | --- | ---|
| **專案本地** | 預設 | 單一專案使用，技能隨專案版本管理 |
| **全域安裝** | `--global` | 所有專案共享常用技能 |
| **Universal 模式** | `--universal` | 多代理環境，避免與 Claude Code 衝突 |

::: tip 什麼時候用 Universal 模式？
如果你同時使用 Claude Code 和其他 AI 編碼代理（如 Cursor、Windsurf），使用 `--universal` 安裝到 `.agent/skills/`，可以讓多個代理共享同一套技能，避免衝突。
:::

---

## 技能生態系統

OpenSkills 使用與 Claude Code 相同的技能生態系統：

### 官方技能庫

Anthropic 官方維護的技能倉庫：[anthropics/skills](https://github.com/anthropics/skills)

包含常用技能：
- PDF 處理
- 圖片生成
- 數據分析
- 等等...

### 社區技能

任何 GitHub 倉庫都可以作為技能來源，只需包含 SKILL.md 檔案即可。

### 自定義技能

你可以創建自己的技能，使用標準格式，並與團隊共享。

---

## 本課小結

OpenSkills 的核心思想是：

1. **統一標準**：使用 Claude Code 的 SKILL.md 格式
2. **多代理支援**：讓所有 AI 編碼工具共享技能生態
3. **漸進式加載**：按需加載，保持上下文精簡
4. **本地執行**：無資料上傳，隱私安全
5. **開源友善**：支援本地和私有倉庫

通過 OpenSkills，你可以：
- 在不同 AI 工具間無縫切換
- 統一管理所有技能
- 使用和分享私有技能
- 提升開發效率

---

## 下一課預告

> 下一課我們學習 **[安裝OpenSkills工具](../installation/)**
>
> 你會學到：
> - 如何檢查 Node.js 和 Git 環境
> - 使用 npx 或全域安裝 OpenSkills
> - 驗證安裝是否成功
> - 解決常見的安裝問題

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 核心類型定義 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| 技能介面（Skill） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| 技能位置介面（SkillLocation） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| 安裝選項介面（InstallOptions） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| 技能元數據介面（SkillMetadata） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**關鍵介面**：
- `Skill`：已安裝的技能信息（name, description, location, path）
- `SkillLocation`：技能查找位置信息（path, baseDir, source）
- `InstallOptions`：安裝命令選項（global, universal, yes）
- `SkillMetadata`：技能元數據（name, description, context）

**核心概念來源**：
- README.md:22-86 - "What Is OpenSkills?" 章节

</details>
