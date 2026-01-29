---
title: "v1.0.0-v1.0.1: 初始版本發布 | opencode-mystatus"
sidebarTitle: "v1.0.0-v1.0.1"
description: "瞭解 opencode-mystatus v1.0.0 初始版本的新功能，包括 OpenAI、智證 AI、Google Cloud 額度查詢、可視化進度條、多語言支援，以及 v1.0.1 的斜線指令修復。"
subtitle: "v1.0.0-v1.0.1: 初始版本發布"
tags:
  - "版本"
  - "更新日誌"
  - "v1.0.0"
  - "v1.0.1"
order: 2
---

# v1.0.0 - v1.0.1：初始版本發布和斜線指令修復

## 版本概述

**v1.0.0**（2026-01-11）是 opencode-mystatus 的初始版本，帶來了多平台額度查詢的核心功能。

**v1.0.1**（2026-01-11）立即跟進，修復了斜線指令支援的關鍵問題。

---

## v1.0.1 - 斜線指令修復

### 修復問題

**包含 `command/` 目錄到 npm 套件**

- **問題描述**：v1.0.0 發布後，發現斜線指令 `/mystatus` 無法正常工作
- **原因分析**：npm 打包時遺漏了 `command/` 目錄，導致 OpenCode 無法識別斜線指令
- **修復方案**：更新 `package.json` 的 `files` 欄位，確保 `command/` 目錄被包含在發布套件中
- **影響範圍**：僅影響透過 npm 安裝的使用者，手動安裝不受影響

### 升級建議

如果你已經安裝了 v1.0.0，建議立即升級到 v1.0.1 以獲得完整的斜線指令支援：

```bash
## 升級到最新版本
npm update @vbgate/opencode-mystatus
```

---

## v1.0.0 - 初始版本發布

### 新增功能

**1. 多平台額度查詢**

支援一鍵查詢以下平台的額度使用情況：

| 平台 | 支援的訂閱類型 | 額度類型 |
|--- | --- | ---|
| OpenAI | Plus/Team/Pro | 3 小時限額、24 小時限額 |
| 智證 AI | Coding Plan | 5 小時 Token 限額、MCP 月度配額 |
| Google Cloud | Antigravity | G3 Pro、G3 Image、G3 Flash、Claude |

**2. 可視化進度條**

直觀展示額度使用情況：

```
OpenAI (user@example.com)
━━━━━━━━━━━━━━━━━━━ 75%
已用 750 / 1000 次請求
```

**3. 多語言支援**

- 中文（繁體）
- 英文

語言自動偵測，無需手動切換。

**4. API Key 安全脫敏**

所有敏感資訊（API Key、OAuth Token）自動脫敏顯示：

```
智證 AI (zhipuai-coding-plan)
API Key: sk-a1b2****xyz
```

---

## 使用方式

### 斜線指令（推薦）

在 OpenCode 中輸入：

```
/mystatus
```

### 自然語言

你也可以用自然語言詢問：

```
查看我的所有 AI 平台額度
```

---

## 升級指南

### 從 v1.0.0 升級到 v1.0.1

```bash
npm update @vbgate/opencode-mystatus
```

升級後，重新啟動 OpenCode 即可使用斜線指令 `/mystatus`。

### 首次安裝

```bash
npm install -g @vbgate/opencode-mystatus
```

安裝完成後，在 OpenCode 中輸入 `/mystatus` 即可查詢所有平台的額度。

---

## 已知限制

- v1.0.0 不支援 GitHub Copilot（v1.2.0 新增）
- v1.0.0 不支援 Z.ai（v1.1.0 新增）

如需使用這些功能，請升級到最新版本。

---

## 下一步

查看 [v1.2.0 - v1.2.4 更新日誌](../v120-v124/) 瞭解 GitHub Copilot 支援等新功能。
