---
title: "平台與整合：多模型 AI 設定 | oh-my-opencode"
sidebarTitle: "連接你的 AI 帳號"
subtitle: "平台與整合：多模型 AI 設定"
description: "學習設定和管理多個 AI 平台（Anthropic、OpenAI、Google、Copilot），掌握自動降級機制和智慧模型選擇。"
order: 40
---

# 平台與整合

本章節介紹如何設定和管理多個 AI Provider（Anthropic、OpenAI、Google、GitHub Copilot 等），以及 oh-my-opencode 的多模型自動降級機制。

透過學習本章節，你將掌握如何讓系統根據任務類型和可用模型，智慧選擇最適合的 AI 模型，建構高效、可靠的多模型編排工作流程。

## 本章節包含

本章節分為兩部分：

### 1. [Provider 設定](provider-setup/)

學習如何設定多種 AI Provider，包括：
- Anthropic Claude（主編排器首選）
- OpenAI ChatGPT（架構審查專用）
- Google Gemini（前端和媒體分析）
- GitHub Copilot（備用 Provider）
- Z.ai Coding Plan 和 OpenCode Zen（選用服務）

**學完你能做什麼**：
- ✅ 設定 6 種主流 AI Provider
- ✅ 使用互動式安裝程式快速設定
- ✅ 為不同代理指定最適合的模型
- ✅ 使用 `doctor` 指令診斷設定問題

**預計時間**：25-30 分鐘

### 2. [多模型策略](model-resolution/)

深入理解模型解析系統的三步優先級機制：
- 使用者覆蓋（精確控制）
- Provider 降級（自動容錯）
- 系統預設（兜底方案）

**學完你能做什麼**：
- ✅ 理解模型解析的完整工作流程
- ✅ 根據任務需求手動指定模型
- ✅ 利用 Provider 降級提高系統強健性
- ✅ 診斷和解決模型解析問題

**預計時間**：30-35 分鐘

## 學習路徑建議

我們建議按以下順序學習本章節：

```mermaid
flowchart LR
    A[安裝設定完成] --> B[Provider 設定]
    B --> C[多模型策略]
    C --> D[進階功能]

    style A fill:#e0f2fe
    style B fill:#dbeafe
    style C fill:#bfdbfe
    style D fill:#93c5fd
```

**為什麼這個順序？**

1. **先設定，再理解**：先學會如何設定各個 Provider，再理解背後的解析機制
2. **從簡單到複雜**：Provider 設定是基礎操作，多模型策略是進階概念
3. **實作驗證理論**：設定完 Provider 後，可以用 `doctor` 指令驗證多模型策略的效果

::: tip 快速入門路徑
如果你只想快速上手，可以先完成 [Provider 設定](provider-setup/) 的第 1-4 步（設定基礎 Provider），其他內容可以後續按需學習。
:::

## 前置條件

在學習本章節之前，請確保：

- ✅ 已完成 [安裝和初始設定](../installation/)
- ✅ 安裝了 OpenCode（版本 >= 1.0.150）
- ✅ 了解基本的 JSON/JSONC 設定檔格式
- ✅ 擁有至少一個 AI Provider 的帳號訂閱（推薦 Anthropic Claude）

::: warning 如果沒有 Provider 帳號怎麼辦？
你可以先學習設定步驟，但不實際連接 Provider。系統會使用 OpenCode 的預設模型作為兜底。
:::

## 常見問題

<details>
<summary><strong>我需要設定所有 Provider 嗎？</strong></summary>

不需要。你可以只設定你最常用的 Provider（比如只設定 Anthropic Claude）。oh-my-opencode 的 Provider 降級機制會自動使用可用的 Provider。

但如果你想充分利用多模型編排的優勢，建議至少設定 2-3 個 Provider，這樣系統可以根據任務類型自動選擇最適合的模型。
</details>

<details>
<summary><strong>Provider 設定和模型解析有什麼區別？</strong></summary>

- **Provider 設定**：是「安裝步驟」，告訴系統你有哪些 AI 服務可用
- **模型解析**：是「決策邏輯」，系統如何為每個代理選擇使用哪個 Provider

比喻：Provider 設定是「招募團隊成員」，模型解析是「分配任務」。
</details>

<details>
<summary><strong>我可以隨時修改設定嗎？</strong></summary>

可以隨時修改設定檔：
- 使用者設定：`~/.config/opencode/oh-my-opencode.json`
- 專案設定：`.opencode/oh-my-opencode.json`

修改後無需重啟，下次使用代理時自動生效。如果修改了 Provider 認證，需要執行 `opencode auth login` 重新認證。
</details>

## 下一步指引

完成本章節後，你可以：

### 推薦路徑：學習 AI 代理團隊

繼續學習 [AI 代理團隊：10 位專家介紹](../../advanced/ai-agents-overview/)，了解如何使用不同的代理完成專業任務。

### 進階路徑：深度客製化設定

如果你已經熟悉基礎設定，可以跳到 [設定深度客製化：代理與權限管理](../../advanced/advanced-configuration/)，學習：
- 如何自訂代理的提示詞
- 如何設定代理的權限和存取範圍
- 如何建立自訂的代理和 Category

### 實戰路徑：使用 Prometheus 規劃

開始使用 [Prometheus 規劃：面試式需求收集](../../advanced/prometheus-planning/)，透過實際的代理協作體驗多模型編排的威力。

---

**開始學習**：從 [Provider 設定](provider-setup/) 開始你的多模型編排之旅吧！
