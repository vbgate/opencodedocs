---
title: "Agent Skills 入門: 擴展 AI 代理能力 | Agent Skills"
sidebarTitle: "入門"
subtitle: "Agent Skills 入門: 擴展 AI 代理能力"
description: "了解 Agent Skills，學會擴展 Claude、Cursor 等 AI 代理的技能包。本教學介紹 React 效能優化、Web 設計指南和一鍵部署功能，提升開發效率。"
tags:
  - "入門"
  - "AI 編碼代理"
  - "Claude"
  - "技能包"
prerequisite: []
---

# Agent Skills 入門

## 學完你能做什麼

- 理解 Agent Skills 是什麼，以及它如何擴展 AI 編碼代理的能力
- 了解三大核心技能包的功能和使用場景
- 知道什麼時候適合使用 Agent Skills 來提升開發效率

## 你現在的困境

你日常使用 Claude、Cursor 或其他 AI 編碼代理時，可能會遇到這些問題：
- 希望遵循最佳實踐，但不知道該記住哪些規則
- 經常重複類似的部署操作，希望自動化
- AI 生成的程式碼品質參差不齊，缺少統一標準

## 核心思路

**Agent Skills 是技能包系統**——為 AI 編碼代理提供可擴展的「外掛」。每個技能包含：

- **SKILL.md**：技能定義文件，告訴 AI 代理什麼時候啟用該技能
- **scripts/**：輔助腳本（如部署腳本），執行具體任務
- **references/**：輔助文件（選用），提供詳細參考資料

::: tip 設計理念
技能採用**按需載入**機制：只有技能名稱和描述在啟動時載入，完整內容在 AI 判斷需要時才讀取。這樣可以減少上下文佔用，提高效率。
:::

## 可用的技能包

專案提供三大技能包，每個都針對特定場景：

### react-best-practices

React 和 Next.js 效能優化指南，來自 Vercel Engineering 標準。包含 50+ 條規則，按影響層級排序。

**使用場景**：
- 編寫新的 React 元件或 Next.js 頁面
- 審查程式碼效能問題
- 優化打包大小或載入時間

**覆蓋類別**：
- 消除瀑布
- 打包大小優化
- 伺服器端效能
- 客戶端資料獲取
- Re-render 優化
- 渲染效能
- JavaScript 微優化
- 高級模式

### web-design-guidelines

Web 介面設計指南審計，檢查程式碼是否符合近百條最佳實踐。

**使用場景**：
- 提示詞："Review my UI"
- 檢查可訪問性
- 審計設計一致性
- 檢查效能和 UX

**覆蓋類別**：
- 可訪問性（aria-labels、語義化 HTML、鍵盤處理）
- Focus 狀態（可見焦點、focus-visible 模式）
- 表單（自動完成、驗證、錯誤處理）
- 動畫（prefers-reduced-motion、合成友好的變換）
- 圖片（尺寸、懶載入、alt 文字）
- 排版、效能、導航等

### vercel-deploy-claimable

一鍵部署應用和網站到 Vercel，返回預覽連結和所有權轉移連結。

**使用場景**：
- 提示詞："Deploy my app"
- 快速分享專案預覽
- 無需配置，零認證部署

**核心特性**：
- 自動檢測 40+ 種框架（Next.js、Vite、Astro 等）
- 返回預覽 URL（即時站點）和 claim URL（轉移所有權）
- 自動處理靜態 HTML 專案
- 上傳時排除 `node_modules` 和 `.git`

## 技能的工作原理

當你使用 Claude 或其他 AI 代理時，技能啟用流程如下：

```mermaid
graph LR
    A[使用者輸入任務] --> B[AI 檢測關鍵詞<br/>如 Deploy, Review, Optimize]
    B --> C[匹配技能描述]
    C --> D[載入 SKILL.md 完整內容]
    D --> E[執行腳本或應用規則]
    E --> F[輸出結果給使用者]
```

**示例流程**：

1. **使用者輸入**："Deploy my app"
2. **AI 檢測**：識別關鍵詞 "Deploy"，匹配 `vercel-deploy` 技能
3. **載入技能**：讀取 `SKILL.md` 完整內容
4. **執行部署**：
   - 執行 `deploy.sh` 腳本
   - 檢測框架（讀取 package.json）
   - 打包專案為 tarball
   - 上傳到 Vercel API
5. **返回結果**：
   ```json
   {
     "previewUrl": "https://skill-deploy-abc123.vercel.app",
     "claimUrl": "https://vercel.com/claim-deployment?code=..."
   }
   ```

## 什麼時候用這一招

使用 Agent Skills 的最佳時機：

| 場景 | 使用的技能 | 觸發提示詞示例 |
|--- | --- | ---|
| 編寫 React 元件 | react-best-practices | "Review this React component for performance issues" |
| 優化 Next.js 頁面 | react-best-practices | "Help me optimize this Next.js page" |
| 檢查 UI 品質 | web-design-guidelines | "Check accessibility of my site" |
| 部署專案 | vercel-deploy-claimable | "Deploy my app to production" |

## 安全模型

::: info 安全說明
- **本機執行**：所有技能在本機執行，無資料上傳至第三方服務（Vercel 部署 API 除外）
- **按需啟用**：技能僅在 AI 判斷相關時載入詳細內容，減少隱私洩漏風險
- **開源透明**：所有技能和腳本開源可審計
:::

## 踩坑提醒

### 技能未啟用

如果技能沒有被啟用，檢查：
- 提示詞是否包含足夠的關鍵詞（如 "Deploy"、"Review"）
- 技能是否正確安裝到 `~/.claude/skills/` 目錄
- 如果使用 claude.ai，確認技能已新增到專案知識庫

### 網路權限

某些技能需要網路存取：
- `vercel-deploy-claimable` 需要存取 Vercel 部署 API
- `web-design-guidelines` 需要從 GitHub 拉取最新規則

**解決方案**：在 claude.ai/settings/capabilities 中新增所需網域。

## 本課小結

Agent Skills 是為 AI 編碼代理設計的技能包系統，提供：
- **react-best-practices**：50+ 條 React/Next.js 效能優化規則
- **web-design-guidelines**：近百條 Web 設計最佳實踐
- **vercel-deploy-claimable**：一鍵部署到 Vercel

技能採用按需載入機制，減少上下文佔用。安裝後，AI 代理會自動在相關任務中啟用對應的技能。

## 下一課預告

> 下一課我們將學習 **[安裝 Agent Skills](../installation/)**。
>
> 你將學到：
> - 兩種安裝方法：Claude Code 和 claude.ai
> - 配置網路權限
> - 驗證技能是否正確安裝

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能        | 檔案路徑                                                              | 行號    |
|--- | --- | ---|
| 技能包列表   | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L7-L80) | 7-80    |
| 技能結構說明 | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L103-L110) | 103-110 |
| AGENTS.md 規範 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md) | 全文    |
| 技能目錄結構 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20) | 11-20   |
| SKILL.md 格式 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68) | 29-68   |
| 技能打包命令 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L93-L96) | 93-96   |
| 使用者安裝方法 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110  |
| 按需載入機制 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L72-L78) | 72-78   |
| 建構工具腳本 | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json) | 全文    |

**關鍵常量**：
- 無硬編碼常量

**關鍵函數**：
- `build.ts`：建構 AGENTS.md 和測試用例
- `validate.ts`：驗證規則檔案完整性
- `extract-tests.ts`：從規則中提取測試用例

</details>
