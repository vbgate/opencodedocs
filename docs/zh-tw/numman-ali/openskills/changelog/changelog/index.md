---
title: "版本日誌：功能更新 | OpenSkills"
sidebarTitle: "看看新功能"
subtitle: "版本日誌：功能更新 | OpenSkills"
description: "查看 OpenSkills 版本變更歷史，了解 update 指令、符號連結、私有倉庫等新功能，以及路徑遍歷防護等重要改進和問題修復。"
tags:
  - "changelog"
  - "version history"
order: 1
---

# 更新日誌

本頁面記錄 OpenSkills 的版本變更歷史，幫助你了解每個版本的新功能、改進和問題修復。

---

## [1.5.0] - 2026-01-17

### 新增功能

- **`openskills update`** - 從記錄的來源重新整理已安裝技能（預設：全部重新整理）
- **源元數據追蹤** - 安裝時現在記錄來源資訊，用於可靠地更新技能

### 改進

- **多技能讀取** - `openskills read` 指令現在支援逗號分隔的技能名稱列表
- **生成使用說明** - 優化了 shell 環境下的 read 指令呼叫提示
- **README** - 新增了更新指南和人工使用提示

### 問題修復

- **更新體驗優化** - 跳過沒有源元數據的技能，並列出這些技能提示重新安裝

---

## [1.4.0] - 2026-01-17

### 改進

- **README** - 明確專案本地預設安裝方式，移除冗餘的 sync 提示
- **安裝訊息** - 安裝程式現在明確區分專案本地預設安裝與 `--global` 選項

---

## [1.3.2] - 2026-01-17

### 改進

- **文件與 AGENTS.md 指引** - 所有指令範例和生成的使用說明統一使用 `npx openskills`

---

## [1.3.1] - 2026-01-17

### 問題修復

- **Windows 安裝** - 修復了 Windows 系統上的路徑驗證問題（"Security error: Installation path outside target directory"）
- **CLI 版本** - `npx openskills --version` 現在正確讀取 package.json 中的版本號
- **根目錄 SKILL.md** - 修復了 SKILL.md 在倉庫根目錄的單技能倉庫安裝問題

---

## [1.3.0] - 2025-12-14

### 新增功能

- **符號連結支援** - 技能現在可以透過符號連結安裝到技能目錄 ([#3](https://github.com/numman-ali/openskills/issues/3))
  - 支援透過從複製倉庫建立符號連結來實現基於 git 的技能更新
  - 支援本地技能開發工作流程
  - 損壞的符號連結會被優雅地跳過

- **可配置輸出路徑** - sync 指令新增 `--output` / `-o` 選項 ([#5](https://github.com/numman-ali/openskills/issues/5))
  - 可同步到任意 `.md` 檔案（如 `.ruler/AGENTS.md`）
  - 如果檔案不存在，自動建立檔案並新增標題
  - 如果需要，自動建立巢狀目錄

- **本地路徑安裝** - 支援從本地目錄安裝技能 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - 支援絕對路徑（`/path/to/skill`）
  - 支援相對路徑（`./skill`、`../skill`）
  - 支援波浪號擴充（`~/my-skills/skill`）

- **私有 git 倉庫支援** - 支援從私有倉庫安裝技能 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - SSH URLs（`git@github.com:org/private-skills.git`）
  - 帶認證的 HTTPS URLs
  - 自動使用系統 SSH 金鑰

- **全面的測試套件** - 跨 6 個測試檔案的 88 個測試
  - 符號連結偵測、YAML 解析的單元測試
  - install、sync 指令的整合測試
  - 完整 CLI 工作流程的端對端測試

### 改進

- **`--yes` 標誌現在跳過所有提示** - 完全非互動模式，適用於 CI/CD ([#6](https://github.com/numman-ali/openskills/issues/6))
  - 覆寫現有技能時不提示
  - 跳過提示時顯示 `Overwriting: <skill-name>` 訊息
  - 所有指令現在都可以在無頭環境中執行

- **CI 工作流程重排** - 建置步驟現在在測試之前執行
  - 確保 `dist/cli.js` 存在，用於端對端測試

### 安全性

- **路徑遍歷防護** - 驗證安裝路徑保持在目標目錄內
- **符號連結解參照** - `cpSync` 使用 `dereference: true` 安全地複製符號連結目標
- **非貪婪 YAML 正則** - 防止 frontmatter 解析中潛在的 ReDoS 攻擊

---

## [1.2.1] - 2025-10-27

### 問題修復

- README 文件清理 - 移除了重複部分和錯誤的標誌

---

## [1.2.0] - 2025-10-27

### 新增功能

- `--universal` 標誌，將技能安裝到 `.agent/skills/` 而非 `.claude/skills/`
  - 適用於多代理環境（Claude Code + Cursor/Windsurf/Aider）
  - 避免與 Claude Code 原生市集外掛衝突

### 改進

- 專案本地安裝現在是預設選項（之前是全域安裝）
- 技能預設安裝到 `./.claude/skills/`

---

## [1.1.0] - 2025-10-27

### 新增功能

- 全面的單頁 README，包含技術深度解析
- 與 Claude Code 的並列對比

### 問題修復

- 位置標籤現在根據安裝位置正確顯示 `project` 或 `global`

---

## [1.0.0] - 2025-10-26

### 新增功能

- 初始發布
- `npx openskills install <source>` - 從 GitHub 倉庫安裝技能
- `npx openskills sync` - 為 AGENTS.md 生成 `<available_skills>` XML
- `npx openskills list` - 顯示已安裝的技能
- `npx openskills read <name>` - 為代理載入技能內容
- `npx openskills manage` - 互動式技能刪除
- `npx openskills remove <name>` - 刪除指定技能
- 所有指令的互動式 TUI 介面
- 支援 Anthropic 的 SKILL.md 格式
- 漸進式揭露（按需載入技能）
- 打包資源支援（references/、scripts/、assets/）

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能           | 檔案路徑                                                                      |
|--- | ---|
| 更新日誌原文   | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
