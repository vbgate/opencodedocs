---
title: "授權條款: BSL 條款說明 | Plannotator"
sidebarTitle: "了解商業使用規則"
subtitle: "授權條款: BSL 條款說明"
description: "學習 Plannotator 的 Business Source License 1.1 (BSL) 授權條款和商業使用限制。了解允許的使用情境、未來變更計畫及 2030 年轉為 Apache 2.0 的時程表。"
tags:
  - "授權條款"
  - "BSL-1.1"
  - "商業使用"
prerequisite: []
order: 3
---

# Plannotator 授權條款說明

## 學完你能做什麼

- 了解 Plannotator 使用的授權條款類型和核心條款
- 明確哪些使用情境是被允許的，哪些是受限的
- 知道授權條款的未來變更時程表
- 了解如何取得商業授權或聯絡授權方

## 你現在需要了解

Plannotator 採用 **Business Source License 1.1 (BSL)** 作為其開源授權條款。這是一種特殊的授權條款，旨在保護商業價值的同時，最終讓專案完全開源。

## 核心條款

### 授權條款類型

| 項目 | 內容 |
| --- | --- |
| **授權條款名稱** | Business Source License 1.1 (BSL) |
| **版權方** | backnotprop (2025) |
| **授權專案** | plannotator |
| **變更日期** | 2030-01-01 |
| **變更後授權條款** | Apache License, Version 2.0 |

::: info 什麼是 BSL？
Business Source License 是一種由 MariaDB 開發的特殊授權條款。它在短期內限制了某些商業用途，但承諾在特定日期後將軟體轉換為完全開源的授權條款（如 Apache 2.0）。這種模式讓開源專案能夠在商業化過程中獲得可持續的收益，同時確保長期對社群開放。
:::

### 允許的使用方式

根據 BSL 1.1 條款，你可以：

- ✅ **複製、修改和建立衍生作品**
  - 你可以基於 Plannotator 進行二次開發
  - 可以修改原始碼以適應你的需求

- ✅ **重新散布**
  - 可以散布原始或修改後的版本
  - 必須保留原始的授權條款聲明

- ✅ **非正式環境使用**
  - 內部開發、測試和評估
  - 個人學習和研究

::: tip 個人和企業內部的廣泛使用
BSL 對「非正式環境使用」的定義很寬泛，包括個人和公司內部的各種情境。你和你的團隊成員（包括獨立承包商）都可以自由使用 Plannotator 進行開發、測試和部署。
:::

### 使用限制（重要！）

**核心限制**：不得將 Plannotator 用於 **計畫、上下文或審批服務（Planning, Context, or Approval Service）**。

#### 什麼是「計畫、上下文或審批服務」？

任何允許**第三方**（除員工和獨立承包商外）透過直接或間接操作存取 Plannotator 功能的商業產品，都屬於受限服務。具體包括但不限於：

- **雲端服務供應商**
  - SaaS 平台提供 Plannotator 功能作為其服務的一部分
  - 託管服務供應商向客戶或訂閱者提供 Plannotator

- **基礎架構服務**
  - 資料中心服務供應商
  - 雲端運算平台供應商

- **類似服務的第三方**
  - 包括上述實體及其關聯公司提供的任何服務

::: warning 商業使用警告
如果你計畫將 Plannotator 作為商業服務的一部分提供給第三方使用，必須提前取得商業授權。違反此條款將自動終止你對當前及所有版本 Plannotator 的使用權利。
:::

## 授權條款變更時程表

| 時間節點 | 授權條款類型 | 說明 |
| --- | --- | --- |
| **當前 - 2030-01-01** | BSL 1.1 | 受限的開源授權條款 |
| **2030-01-01 起** | Apache 2.0 | 完全開源，無商業限制 |

### 變更後會發生什麼？

從 2030 年 1 月 1 日起，Plannotator 將自動轉換為 **Apache License 2.0**。這意味著：

- ✅ 所有商業限制將取消
- ✅ 可以自由地用於任何商業目的
- ✅ 可以將其整合到任何 SaaS 服務中
- ✅ 符合寬鬆的開源授權條款標準

## 商業授權

如果你需要在不遵守 BSL 限制的情況下使用 Plannotator（例如用於計畫、上下文或審批服務），可以：

1. **購買商業授權**
   - 從 backnotprop 或其授權經銷商購買
   - 獲得不受 BSL 限制的使用權利

2. **聯絡授權方**
   - 發送電子郵件至：backnotprop
   - 說明你的使用情境和需求

## 常見問題

### 我可以在公司內部使用 Plannotator 嗎？

**可以。** BSL 明確允許你和你的員工、獨立承包商使用 Plannotator 進行內部開發、測試和部署。限制僅適用於向**第三方**（非員工和承包商）提供服務的情境。

### 我可以基於 Plannotator 開發自己的產品嗎？

**可以，但有條件。** 如果你的產品是：
- 內部工具：✅ 允許
- 個人專案：✅ 允許
- 開源專案：✅ 允許（保留 BSL 授權條款）
- 商業產品：❓ 需要評估是否屬於「計畫、上下文或審批服務」

### 我的公司是 SaaS 供應商，可以使用嗎？

**需要商業授權。** 如果你的 SaaS 產品將 Plannotator 的功能提供給客戶使用（即使作為功能的一部分），這屬於受限的商業服務，必須購買商業授權。

### 2030 年之後我可以將 Plannotator 用於任何用途嗎？

**是的。** 從變更日期起，Plannotator 將採用 Apache 2.0 授權條款，所有商業限制都將取消，你可以自由地用於任何用途。

## 授權條款完整文字

完整的 Business Source License 1.1 文字請參閱專案根目錄的 `LICENSE` 檔案。

## 聯絡方式

如需商業授權或有其他問題，請聯絡：
- **授權方**：backnotprop
- **專案儲存庫**：[backnotprop/plannotator](https://github.com/backnotprop/plannotator)

## 下一課預告

> 下一課我們查看 **[更新日誌](../../changelog/release-notes/)**。
>
> 你會看到：
> - Plannotator 的版本歷史
> - 每個版本的新功能和改進
> - 重要的 bug 修復

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 授權條款聲明 | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L100-L104) | 100-104 |
| 完整授權條款文字 | [`LICENSE`](https://github.com/backnotprop/plannotator/blob/main/LICENSE) | 1-115 |

**關鍵資訊**：
- 授權條款類型：Business Source License 1.1 (BSL)
- 版權方：backnotprop (c) 2025
- 變更日期：2030-01-01
- 變更後授權條款：Apache License, Version 2.0
- 主要限制：不得用於計畫、上下文或審批服務

</details>
