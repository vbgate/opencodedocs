---
title: "更新日誌: 版本歷史 | Plannotator"
sidebarTitle: "看看新功能"
subtitle: "更新日誌: 版本歷史 | Plannotator"
description: "瞭解 Plannotator 版本歷史和新功能。檢視主要更新、Bug 修復和效能改進，掌握程式碼審查、圖像標註、Obsidian 整合等新特性。"
tags:
  - "更新日誌"
  - "版本歷史"
  - "新功能"
  - "Bug 修復"
order: 1
---

# 更新日誌：Plannotator 版本歷史和新功能

## 學完你能做什麼

- ✅ 瞭解 Plannotator 的版本歷史和新功能
- ✅ 掌握每個版本的主要更新和改進
- ✅ 瞭解 Bug 修復和效能最佳化

---

## 最新版本

### v0.6.7 (2026-01-24)

**新增功能**：
- **Comment mode**：新增 Comment 模式，支援在計畫中直接輸入評論
- **Type-to-comment shortcut**：新增快速鍵支援，直接輸入評論內容

**改進**：
- 修復 OpenCode 外掛的 sub-agent blocking 問題
- 修復 prompt injection 安全漏洞（CVE）
- 改進 OpenCode 中的 agent switching 智慧偵測

**原始碼參考**：
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**修復**：
- 修復 OpenCode plugin 的 CVE 安全漏洞
- 修復 sub-agent blocking 問題，防止 prompt injection
- 改進 agent switching 的智慧偵測邏輯

**原始碼參考**：
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**改進**：
- **Hook timeout 增加**：將 hook timeout 從預設值增加到 4 天，適應長時間執行的 AI 計畫
- **修復 copy 功能**：保留 copy 操作中的 newlines
- **新增 Cmd+C 快速鍵**：新增 Cmd+C 快速鍵支援

**原始碼參考**：
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**新增功能**：
- **Cmd+Enter 快速鍵**：支援使用 Cmd+Enter（Windows: Ctrl+Enter）提交核准或回饋

**改進**：
- 最佳化鍵盤操作體驗

**原始碼參考**：
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (Cmd+Enter 快速鍵功能在各元件中直接實作)

---

### v0.6.3 (2026-01-05)

**修復**：
- 修復 skip-title-generation-prompt 問題

**原始碼參考**：
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**修復**：
- 修復 OpenCode 外掛中 HTML 檔案未包含在 npm 套件中的問題

**原始碼參考**：
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**新增功能**：
- **Bear 整合**：支援將核准的計畫自動儲存到 Bear 筆記 App

**改進**：
- 改進 Obsidian 整合的標籤產生邏輯
- 最佳化 Obsidian vault 偵測機制

**原始碼參考**：
- Bear 整合: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Obsidian 整合: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## 重大功能發佈

### Code Review 功能 (2026-01)

**新增功能**：
- **程式碼審查工具**：執行 `/plannotator-review` 指令，視覺化審查 Git diff
- **行級註解**：點擊行號選擇程式碼範圍，新增 comment/suggestion/concern 類型的註解
- **多種 diff 檢視**：支援切換 uncommitted/staged/last-commit/branch 等不同的 diff 類型
- **Agent 整合**：傳送結構化回饋給 AI agent，支援自動回應

**使用方法**：
```bash
# 在專案目錄中執行
/plannotator-review
```

**相關教學**：
- [程式碼審查基礎](../../platforms/code-review-basics/)
- [新增程式碼註解](../../platforms/code-review-annotations/)
- [切換 Diff 檢視](../../platforms/code-review-diff-types/)

**原始碼參考**：
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Git diff 工具: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### 圖像標註功能 (2026-01)

**新增功能**：
- **上傳圖片**：在計畫和程式碼審查中上傳圖片附件
- **標註工具**：提供畫筆、箭頭、圓形三種標註工具
- **視覺化標註**：在圖片上直接標註，增強審查回饋效果

**相關教學**：
- [新增圖像標註](../../platforms/plan-review-images/)

**原始碼參考**：
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Obsidian 整合 (2025-12)

**新增功能**：
- **自動偵測 vaults**：自動偵測 Obsidian vault 設定檔路徑
- **自動儲存計畫**：核准的計畫自動儲存到 Obsidian
- **產生 frontmatter**：自動包含 created、source、tags 等 frontmatter
- **智慧標籤擷取**：從計畫內容中擷取關鍵字作為標籤

**設定方式**：
無需額外設定，Plannotator 會自動偵測 Obsidian 安裝路徑。

**相關教學**：
- [Obsidian 整合](../../advanced/obsidian-integration/)

**原始碼參考**：
- Obsidian 偵測: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Obsidian 儲存: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Frontmatter 產生: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### URL 分享功能 (2025-11)

**新增功能**：
- **無後端分享**：將計畫和註解壓縮到 URL hash 中，無需後端伺服器
- **一鍵分享**：點擊 Export → Share as URL，產生分享連結
- **唯讀模式**：協作者開啟 URL 後可檢視但無法提交決策

**技術實作**：
- 使用 Deflate 壓縮演算法
- Base64 編碼 + URL 安全字元替換
- 支援最大 payload 約 7 個標籤

**相關教學**：
- [URL 分享](../../advanced/url-sharing/)

**原始碼參考**：
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### 遠端/Devcontainer 模式 (2025-10)

**新增功能**：
- **遠端模式支援**：在 SSH、devcontainer、WSL 等遠端環境中使用 Plannotator
- **固定連接埠**：透過環境變數設定固定連接埠
- **連接埠轉發**：自動輸出 URL 供使用者手動開啟瀏覽器
- **瀏覽器控制**：透過 `PLANNOTATOR_BROWSER` 環境變數控制是否開啟瀏覽器

**環境變數**：
- `PLANNOTATOR_REMOTE=1`：啟用遠端模式
- `PLANNOTATOR_PORT=3000`：設定固定連接埠
- `PLANNOTATOR_BROWSER=disabled`：停用自動開啟瀏覽器

**相關教學**：
- [遠端/Devcontainer 模式](../../advanced/remote-mode/)
- [環境變數設定](../../advanced/environment-variables/)

**原始碼參考**：
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## 版本相容��

| Plannotator 版本 | Claude Code | OpenCode | Bun 最低版本 |
| ---------------- | ----------- | -------- | ------------ |
| v0.6.x           | 2.1.7+      | 1.0+     | 1.0+         |
| v0.5.x           | 2.1.0+      | 0.9+     | 0.7+         |

**升級建議**：
- 保持 Plannotator 為最新版本，以取得最新功能和安全修復
- Claude Code 和 OpenCode 也應保持最新版本

---

## 授權條款變更

**目前版本（v0.6.7+）**：Business Source License 1.1 (BSL-1.1)

**授權條款詳情**：
- 允許：個人使用、內部商業使用
- 限制：提供託管服務、SaaS 產品
- 詳情見 [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

---

## 回饋與支援

**回報問題**：
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**功能建議**：
- 在 GitHub Issues 中提交 feature request

**安全漏洞**：
- 請透過私密管道回報安全漏洞

---

## 下一課預告

> 你已經瞭解了 Plannotator 的版本歷史和新功能。
>
> 接下來可以：
> - 返回 [快速開始](../../start/getting-started/) 學習如何安裝和使用
> - 檢視 [常見問題](../../faq/common-problems/) 解決使用中的問題
> - 閱讀 [API 參考](../../appendix/api-reference/) 瞭解所有 API 端點
