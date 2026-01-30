---
title: "版本歷程: 功能演進 | opencode-agent-skills"
sidebarTitle: "新版本做了什麼"
subtitle: "版本歷程"
description: "學習 OpenCode Agent Skills 外掛程式的版本演進歷程。本教學整理了從 v0.1.0 到 v0.6.4 的所有主要功能更新、Bug 修復、架構改進和重大變更說明。"
tags:
  - "版本更新"
  - "變更記錄"
  - "發布歷程"
order: 3
---

# 版本歷程

本文檔記錄了 OpenCode Agent Skills 外掛程式的所有版本更新。透過版本歷程，你可以了解功能的演進路徑、修復的問題以及架構改進。

::: tip 當前版本
最新穩定版本是 **v0.6.4** (2026-01-20)
:::

## 版本時間線

| 版本   | 發布日期   | 類型   | 主要內容 |
|--- | --- | --- | ---|
| 0.6.4 | 2026-01-20 | 修復   | YAML 解析、Claude v2 支援 |
| 0.6.3 | 2025-12-16 | 改進   | 優化技能推薦提示 |
| 0.6.2 | 2025-12-15 | 修復   | 技能名稱與目錄名分離 |
| 0.6.1 | 2025-12-13 | 改進   | 避免重複推薦已載入技能 |
| 0.6.0 | 2025-12-12 | 新功能 | 語意匹配、embedding 預先計算 |
| 0.5.0 | 2025-12-11 | 改進   | 模糊比對建議、重構 |
| 0.4.1 | 2025-12-08 | 改進   | 簡化安裝方式 |
| 0.4.0 | 2025-12-05 | 改進   | 腳本遞迴搜尋 |
| 0.3.3 | 2025-12-02 | 修復   | 符號連結處理 |
| 0.3.2 | 2025-11-30 | 修復   | 保留代理模式 |
| 0.3.1 | 2025-11-28 | 修復   | 模型切換問題 |
| 0.3.0 | 2025-11-27 | 新功能 | 檔案列表功能 |
| 0.2.0 | 2025-11-26 | 新功能 | Superpowers 模式 |
| 0.1.0 | 2025-11-26 | 初始   | 4 個工具、多位置發現 |

## 詳細變更記錄

### v0.6.4 (2026-01-20)

**修復**：
- 修復了技能多行描述的 YAML frontmatter 解析（支援 `|` 和 `>` 區塊純量語法），透過用 `yaml` 程式庫替換自訂解析器
- 新增對 Claude 外掛程式 v2 格式的支援，`installed_plugins.json` 現在使用外掛程式安裝陣列而非單一物件

**改進**：
- Claude Code 外掛程式快取發現現在支援新的巢狀目錄結構（`cache/<marketplace>/<plugin>/<version>/skills/`）

### v0.6.3 (2025-12-16)

**改進**：
- 優化了技能評估提示，防止模型向使用者發送"無需技能"類訊息（使用者看不到隱藏的評估提示）

### v0.6.2 (2025-12-15)

**修復**：
- 技能驗證現在允許目錄名稱與 SKILL.md frontmatter 中的 `name` 不同。frontmatter 中的 `name` 是標準識別碼，目錄名稱僅用於組織。這符合 Anthropic Agent Skills 規範。

### v0.6.1 (2025-12-13)

**改進**：
- 動態技能推薦現在會追蹤每個會話已載入的技能，避免重複推薦已載入技能，減少冗餘提示和上下文使用
### v0.6.0 (2025-12-12)

**新增**：
- **語意技能匹配**：在初始技能清單注入後，後續訊息會使用本地 embedding 與技能描述進行比對
- 新增 `@huggingface/transformers` 依賴用於本地 embedding 生成（量化版 all-MiniLM-L6-v2）
- 當訊息比對可用技能時，注入 3 步評估提示（EVALUATE → DECIDE → ACTIVATE），鼓勵載入技能（靈感來自 [@spences10](https://github.com/spences10) 的[部落格文章](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably)）
- 磁碟快取 embedding 以實現低延遲比對（~/.cache/opencode-agent-skills/）
- 在 `session.deleted` 事件上清理會話

### v0.5.0 (2025-12-11)

**新增**：
- 在所有工具（`use_skill`、`read_skill_file`、`run_skill_script`、`get_available_skills`）中新增"你是否指..."模糊比對建議

**改進**：
- **破壞性變更**：將 `find_skills` 工具重新命名為 `get_available_skills`，意圖更明確
- **內部**：將程式庫重組為獨立模組（`claude.ts`、`skills.ts`、`tools.ts`、`utils.ts`、`superpowers.ts`），提高可維護性
- **內部**：透過刪除 AI 生成的註解和不必要的程式碼，提高程式碼品質

### v0.4.1 (2025-12-08)

**改進**：
- 安裝方式現在透過 OpenCode 設定使用 npm 套件，而非 git clone + 符號連結

**移除**：
- 移除了 `INSTALL.md`（簡化安裝後不再需要）

### v0.4.0 (2025-12-05)

**改進**：
- 腳本發現現在遞迴搜尋整個技能目錄（最大深度 10），而非僅根目錄和 `scripts/` 子目錄
- 腳本現在透過相對路徑（如 `tools/build.sh`）而非基本名稱識別
- 在 `read_skill_file`、`run_skill_script` 和 `use_skill` 工具中將 `skill_name` 參數重新命名為 `skill`
- 在 `run_skill_script` 工具中將 `script_name` 參數重新命名為 `script`
### v0.3.3 (2025-12-02)

**修復**：
- 透過使用 `fs.stat` 修復了檔案和目錄偵測以正確處理符號連結

### v0.3.2 (2025-11-30)

**修復**：
- 在會話開始時注入合成訊息時保留代理模式

### v0.3.1 (2025-11-28)

**修復**：
- 透過在 `noReply` 操作中明確傳遞目前模型，修復了使用技能工具時的意外模型切換（針對 opencode issue #4475 的暫時方案）

### v0.3.0 (2025-11-27)

**新增**：
- 在 `use_skill` 輸出中新增檔案列表

### v0.2.0 (2025-11-26)

**新增**：
- 新增 Superpowers 模式支援
- 新增發布證明

### v0.1.0 (2025-11-26)

**新增**：
- 新增 `use_skill` 工具，將技能內容載入到上下文
- 新增 `read_skill_file` 工具，讀取技能目錄中的支援檔案
- 新增 `run_skill_script` 工具，從技能目錄執行腳本
- 新增 `find_skills` 工具，搜尋並列出可用技能
- 新增多位置技能發現（專案級、使用者級和 Claude 相容位置）
- 新增符合 Anthropic Agent Skills Spec v1.0 的 frontmatter 驗證
- 新增會話開始和上下文壓縮後的自動技能清單注入

**新貢獻者**：
- Josh Thomas <josh@joshthomas.dev> (維護者)

## 功能演進概覽

| 功能           | 引入版本 | 演進路徑 |
|--- | --- | ---|
| 4 個基礎工具   | v0.1.0   | v0.5.0 新增模糊比對 |
| 多位置技能發現 | v0.1.0   | v0.4.1 簡化安裝、v0.6.4 支援 Claude v2 |
| 上下文自動注入 | v0.1.0   | v0.3.0 新增檔案列表、v0.6.1 避免重複推薦 |
| Superpowers 模式 | v0.2.0   | 持續穩定 |
| 腳本遞迴搜尋   | v0.4.0   | v0.3.3 修復符號連結 |
| 語意比對推薦   | v0.6.0   | v0.6.1 避免重複、v0.6.3 優化提示 |
| 模糊比對建議   | v0.5.0   | 持續穩定 |
## 重大變更說明

### v0.6.0：語意匹配功能

引入了基於本地 embedding 的語意比對能力，讓 AI 能夠根據使用者訊息內容自動推薦相關技能，無需使用者手動記憶技能名稱。

- **技術細節**：使用 HuggingFace 的 `all-MiniLM-L6-v2` 模型（q8 量化）
- **快取機制**：embedding 結果快取到 `~/.cache/opencode-agent-skills/`，提升後續比對速度
- **比對流程**：使用者訊息 → embedding → 與技能描述計算餘弦相似度 → Top 5 推薦（閾值 0.35）

### v0.5.0：重構與工具重新命名

程式碼架構重構為模組化設計，工具命名更加清晰：

- `find_skills` → `get_available_skills`
- `skill_name` → `skill`
- `script_name` → `script`

### v0.4.0：腳本發現機制升級

腳本發現從"僅根目錄 + scripts/"升級為"遞迴搜尋整個技能目錄"（最大深度 10），支援更靈活的腳本組織方式。

### v0.2.0：Superpowers 整合

新增對 Superpowers 工作流程模式的支援，需要安裝 `using-superpowers` 技能並設定環境變數 `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                    | 行號    |
|--- | --- | ---|
| 目前版本號  | [`package.json`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L3-L3)         | 3       |
| 版本歷程    | [`CHANGELOG.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/CHANGELOG.md#L19-L152) | 19-152  |

**關鍵版本資訊**：
- `v0.6.4`：目前版本 (2026-01-20)
- `v0.6.0`：語意比對引入 (2025-12-12)
- `v0.5.0`：重構版本 (2025-12-11)
- `v0.1.0`：初始版本 (2025-11-26)

</details>
