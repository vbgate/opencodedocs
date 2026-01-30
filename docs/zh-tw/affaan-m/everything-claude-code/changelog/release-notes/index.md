---
title: "更新日誌：版本歷程 | everything-claude-code"
sidebarTitle: "看看最近更新了什麼"
subtitle: "更新日誌：版本歷程"
description: "了解 everything-claude-code 的版本歷程與重要異動。追蹤新功能、資安修補與文件更新，評估是否需要升級。"
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# 更新日誌：版本歷程與異動

## 學完你能做什麼

- 了解每個版本的重要異動
- 追蹤新功能和修補項目
- 評估是否需要升級

## 版本歷程

### 2026-01-24 - 資安修補與文件修正

**修補內容**：
- 🔒 **資安修補**：防止 `commandExists()` 中的指令注入弱點
  - 使用 `spawnSync` 取代 `execSync`
  - 驗證輸入僅允許英數字元、連字號、底線、句點
- 📝 **文件修正**：新增 `runCommand()` 的資安文件警語
- 🐛 **XSS 掃描器誤判修正**：將 `<script>` 和 `<binary>` 替換為 `[script-name]` 和 `[binary-name]`
- 📚 **文件修正**：修正 `doc-updater.md` 中的 `npx ts-morph` 為正確的 `npx tsx scripts/codemaps/generate.ts`

**影響**：#42, #43, #51

---

### 2026-01-22 - 跨平台支援與外掛化

**新功能**：
- 🌐 **跨平台支援**：所有 hooks 和指令稿重寫為 Node.js，支援 Windows、macOS 和 Linux
- 📦 **外掛封裝**：以 Claude Code 外掛形式發布，支援外掛市集安裝
- 🎯 **套件管理器自動偵測**：支援 6 種偵測優先順序
  - 環境變數 `CLAUDE_PACKAGE_MANAGER`
  - 專案組態 `.claude/package-manager.json`
  - `package.json` 的 `packageManager` 欄位
  - Lock 檔偵測（package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb）
  - 全域組態 `~/.claude/package-manager.json`
  - 降級至第一個可用的套件管理器

**修補內容**：
- 🔄 **Hook 載入**：自動依慣例載入 hooks，移除 `plugin.json` 中的 hooks 宣告
- 📌 **Hook 路徑**：使用 `${CLAUDE_PLUGIN_ROOT}` 與相對路徑
- 🎨 **介面改善**：新增 star 歷程圖表與 badge bar
- 📖 **Hook 整理**：將 session-end hooks 從 Stop 移至 SessionEnd

---

### 2026-01-20 - 功能強化

**新功能**：
- 💾 **Memory Persistence Hooks**：跨工作階段自動儲存與載入上下文
- 🧠 **Strategic Compact Hook**：智慧型上下文壓縮建議
- 📚 **Continuous Learning Skill**：從工作階段中自動萃取可重複使用的模式
- 🎯 **Strategic Compact Skill**：Token 最佳化策略

---

### 2026-01-17 - 首次發布

**初始功能**：
- ✨ 完整的 Claude Code 組態集合
- 🤖 9 個專業化 agents
- ⚡ 14 個斜線指令
- 📋 8 套規則集
- 🔄 自動化 hooks
- 🎨 11 個技能庫
- 🌐 15+ 個 MCP 伺服器預設組態
- 📖 完整的 README 文件

---

## 版本命名說明

本專案不使用傳統的語意化版本號，而是採用**日期版本**格式（`YYYY-MM-DD`）。

### 版本類型

| 類型 | 說明 | 範例 |
| --- | --- | --- |
| **新功能** | 新增功能或重大改善 | `feat: add new agent` |
| **修補** | 修正 bug 或問題 | `fix: resolve hook loading issue` |
| **文件** | 文件更新 | `docs: update README` |
| **樣式** | 格式化或程式碼風格 | `style: fix indentation` |
| **重構** | 程式碼重構 | `refactor: simplify hook logic` |
| **效能** | 效能最佳化 | `perf: improve context loading` |
| **測試** | 測試相關 | `test: add unit tests` |
| **建置** | 建置系統或相依套件 | `build: update package.json` |
| **復原** | 復原先前的提交 | `revert: remove version field` |

---

## 如何取得更新

### 外掛市集更新

如果你透過外掛市集安裝了 Everything Claude Code：

1. 開啟 Claude Code
2. 執行 `/plugin update everything-claude-code`
3. 等待更新完成

### 手動更新

如果你手動複製了儲存庫：

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### 從市集安裝

首次安裝：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## 異動影響分析

### 資安修補（必須升級）

- **2026-01-24**：指令注入弱點修補，強烈建議升級

### 功能強化（選擇性升級）

- **2026-01-22**：跨平台支援，Windows 使用者必須升級
- **2026-01-20**：新功能強化，依需求升級

### 文件更新（無需升級）

- 文件更新不影響功能，可手動查閱 README

---

## 已知問題

### 目前版本（2026-01-24）

- 無已知嚴重問題

### 先前版本

- 2026-01-22 之前：Hooks 載入需要手動組態（已於 2026-01-22 修正）
- 2026-01-20 之前：不支援 Windows（已於 2026-01-22 修正）

---

## 貢獻與意見回饋

### 回報問題

如果你發現了 bug 或有功能建議，請：

1. 在 [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues) 搜尋是否已有類似問題
2. 如果沒有，建立新 Issue，並提供：
   - 版本資訊
   - 作業系統
   - 重現步驟
   - 預期行為 vs 實際行為

### 提交 PR

歡迎貢獻！請參閱 [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) 了解詳情。

---

## 本課小結

- Everything Claude Code 使用日期版本號（`YYYY-MM-DD`）
- 資安修補（如 2026-01-24）必須升級
- 功能強化可依需求升級
- 外掛市集使用者使用 `/plugin update` 更新
- 手動安裝使用者使用 `git pull` 更新
- 回報問題與提交 PR 請遵循專案指南

## 下一課預告

> 下一課我們學習 **[組態檔詳解](../../appendix/config-reference/)**。
>
> 你會學到：
> - `settings.json` 的完整欄位說明
> - Hooks 組態的進階選項
> - MCP 伺服器組態詳解
> - 自訂組態的最佳實務
