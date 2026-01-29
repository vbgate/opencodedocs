---
title: "v1.2.0-v1.2.4: Copilot 支援 | opencode-mystatus"
sidebarTitle: "v1.2.0-v1.2.4"
subtitle: "v1.2.0 - v1.2.4：新增 Copilot 支援和文件改進"
description: "瞭解 opencode-mystatus v1.2.0 到 v1.2.4 版本更新，新增 GitHub Copilot Premium Requests 查詢功能，更新中英文文件，改進安裝說明，修復程式碼 lint 錯誤。"
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4：新增 Copilot 支援和文件改進

## 版本概述

本次更新（v1.2.0 - v1.2.4）為 opencode-mystatus 帶來了重要功能增強，最顯著的是**新增了對 GitHub Copilot 的額度查詢支援**。同時改進了安裝文件，修復了程式碼中的 lint 錯誤。

**主要變化**：
- ✅ 新增 GitHub Copilot Premium Requests 查詢
- ✅ 整合 GitHub 內部 API
- ✅ 更新中英文文件
- ✅ 改進安裝說明，移除版本限制
- ✅ 修復程式碼 lint 錯誤

---

## [1.2.2] - 2026-01-14

### 文件改進

- **更新安裝說明**：在 `README.md` 和 `README.zh-CN.md` 中移除了版本限制
- **自動更新支援**：現在使用者可以自動接收最新版本，無需手動修改版本號

**影響**：使用者安裝或升級外掛時，無需再指定具體版本，可以透過 `@latest` 標籤獲得最新版本。

---

## [1.2.1] - 2026-01-14

### Bug 修復

- **修復 lint 錯誤**：移除了 `copilot.ts` 中未使用的 `maskString` 匯入

**影響**：程式碼品質提升，透過 ESLint 檢查，無功能性變化。

---

## [1.2.0] - 2026-01-14

### 新增功能

#### GitHub Copilot 支援

這是本次更新的核心功能：

- **新增 Copilot 額度查詢**：支援查詢 GitHub Copilot Premium Requests 的使用情況
- **整合 GitHub 內部 API**：新增 `copilot.ts` 模組，透過 GitHub API 取得額度資料
- **更新文件**：在 `README.md` 和 `README.zh-CN.md` 中新增了 Copilot 相關文件

**支援的認證方式**：
1. **Fine-grained PAT**（推薦）：使用者建立的 Fine-grained Personal Access Token
2. **OAuth Token**：OpenCode OAuth Token（需有 Copilot 權限）

**查詢內容**：
- Premium Requests 總量與已用量
- 各模型的使用明細
- 訂閱類型識別（free、pro、pro+、business、enterprise）

**使用範例**：

```bash
# 執行 mystatus 指令
/mystatus

# 你會看到輸出中包含 GitHub Copilot 部分
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  模型使用明細:
    gpt-4: 150 Requests
    claude-3.5-sonnet: 75 Requests

  計費週期: 2026-01
```

---

## 升級指南

### 自動升級（推薦）

由於 v1.2.2 更新了安裝說明，移除了版本限制，你現在可以：

```bash
# 使用最新標籤安裝
opencode plugin install vbgate/opencode-mystatus@latest
```

### 手動升級

如果你已經安裝了舊版本，可以直接更新：

```bash
# 解除安裝舊版本
opencode plugin uninstall vbgate/opencode-mystatus

# 安裝新版本
opencode plugin install vbgate/opencode-mystatus@latest
```

### 設定 Copilot

升級後，你可以設定 GitHub Copilot 額度查詢：

#### 方法 1：使用 Fine-grained PAT（推薦）

1. 在 GitHub 上建立 Fine-grained Personal Access Token
2. 建立設定檔 `~/.config/opencode/copilot-quota-token.json`：

```json
{
  "token": "ghp_your_fine_grained_pat_here",
  "username": "your-github-username",
  "tier": "pro"
}
```

3. 執行 `/mystatus` 查詢額度

#### 方法 2：使用 OpenCode OAuth Token

確保你的 OpenCode OAuth Token 有 Copilot 權限，直接執行 `/mystatus` 即可。

::: tip 提示
關於 Copilot 認證的詳細設定，請參閱 [Copilot 認證設定](/zh-tw/vbgate/opencode-mystatus/advanced/copilot-auth/) 教學。
:::

---

## 已知問題

### Copilot 權限問題

如果你的 OpenCode OAuth Token 沒有 Copilot 權限，查詢時會顯示提示資訊。解決方法：

1. 使用 Fine-grained PAT（推薦）
2. 重新授權 OpenCode，確保勾選 Copilot 權限

詳細解決方案請參閱 [Copilot 認證設定](/zh-tw/vbgate/opencode-mystatus/advanced/copilot-auth/) 教學。

---

## 後續計劃

未來版本可能包含以下改進：

- [ ] 支援更多 GitHub Copilot 訂閱類型
- [ ] 優化 Copilot 額度顯示格式
- [ ] 增加額度預警功能
- [ ] 支援更多 AI 平台

---

## 相關文件

- [Copilot 額度查詢](/zh-tw/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Copilot 認證設定](/zh-tw/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [常見問題排查](/zh-tw/vbgate/opencode-mystatus/faq/troubleshooting/)

---

## 完整變更日誌

查看所有版本的變更，請存取 [GitHub Releases](https://github.com/vbgate/opencode-mystatus/releases)。
