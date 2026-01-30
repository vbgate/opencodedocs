---
title: "Ultrawork 模式：一鍵啟動全部功能 | oh-my-opencode"
sidebarTitle: "一鍵啟動全部功能"
subtitle: "Ultrawork 模式：一鍵啟動全部功能"
description: "學習 oh-my-opencode 的 Ultrawork 模式與核心特性，包括 ultrawork 關鍵詞使用方法、啟動行為變化、平行探索機制、強制完成驗證及代理協作等，快速啟動所有進階功能。"
tags:
  - "ultrawork"
  - "背景任務"
  - "代理協作"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Ultrawork 模式：一鍵啟動全部功能

## 學完你能做什麼

- 用一句話啟動 oh-my-opencode 的全部進階功能
- 讓多個 AI 代理像真實團隊一樣平行工作
- 避免手動配置多個代理和背景任務
- 理解 Ultrawork 模式的設計哲學和最佳實踐

## 你現在的困境

你可能在開發過程中遇到過這些情況：

- **功能太多不知道怎麼用**：有 10 個專業代理、背景任務、LSP 工具，但不知道如何快速啟動
- **需要手動配置**：每次複雜任務都要手動指定代理、背景併發等配置
- **代理協作不高效**：串行呼叫代理，浪費時間和成本
- **任務中途卡住**：代理沒有足夠的動力和約束去完成任務

這些都在影響你發揮 oh-my-opencode 的真正威力。

## 核心思路

**Ultrawork 模式**是 oh-my-opencode 的「一鍵全員啟動」機制。

::: info 什麼是 Ultrawork 模式？
Ultrawork 模式是一個關鍵詞觸發的特殊工作模式。當你在提示詞中包含 `ultrawork` 或縮寫 `ulw` 時，系統會自動啟動所有進階功能：平行背景任務、深度探索、強制完成、多代理協作等。
:::

### 設計哲學

Ultrawork 模式基於以下核心原則（來自 [Ultrawork Manifesto](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)）：

| 原則 | 說明 |
| --- | ---|
| **人類干預是失敗信號** | 如果你需要不斷修正 AI 的輸出，說明系統設計有問題 |
| **無法區分的程式碼** | AI 寫的程式碼應該和資深工程師寫的沒有區別 |
| **最小化認知負擔** | 你只需要說「做什麼」，代理負責「怎麼做」 |
| **可預測、持續、可委託** | 代理應該像編譯器一樣穩定可靠 |

### 啟動機制

當系統檢測到 `ultrawork` 或 `ulw` 關鍵詞時：

1. **設定最大精度模式**：`message.variant = "max"`
2. **顯示 Toast 通知**：「Ultrawork Mode Activated - Maximum precision engaged. All agents at your disposal.」
3. **注入完整指令**：向代理注入 200+ 行的 ULTRAWORK 指令，包括：
   - 強制 100% 確定才開始實現
   - 要求平行使用背景任務
   - 強制使用 Category + Skills 系統
   - 強制完成驗證（TDD 工作流）
   - 禁止任何「我做不到」的藉口

## 跟我做

### 第 1 步：觸發 Ultrawork 模式

在 OpenCode 中輸入包含 `ultrawork` 或 `ulw` 關鍵詞的提示詞：

```
ultrawork 開發一個 REST API
```

或者更簡潔：

```
ulw 新增用戶認證
```

**你應該看到**：
- 介面彈出 Toast 通知：「Ultrawork Mode Activated」
- 代理回覆以「ULTRAWORK MODE ENABLED!」開頭

### 第 2 步：觀察代理行為變化

啟動 Ultrawork 模式後，代理會：

1. **平行探索程式碼庫**
   ```
   delegate_task(agent="explore", prompt="尋找現有 API 模式", background=true)
   delegate_task(agent="explore", prompt="尋找測試基礎設施", background=true)
   delegate_task(agent="librarian", prompt="尋找認證最佳實踐", background=true)
   ```

2. **呼叫 Plan 代理制定工作計劃**
   ```
   delegate_task(subagent_type="plan", prompt="基於收集的上下文，制定詳細計劃")
   ```

3. **使用 Category + Skills 執行任務**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**你應該看到**：
- 多個背景任務同時執行
- 代理主動呼叫專業代理（Oracle、Librarian、Explore）
- 完整的測試計劃和工作分解
- 任務持續執行直到 100% 完成

### 第 3 步：驗證任務完成

代理完成後會：

1. **展示驗證證據**：實際執行測試的輸出、手動驗證的描述
2. **確認所有 TODO 完成**：不會提前宣告完成
3. **總結工作內容**：列出做了什麼、為什麼這樣做

**你應該看到**：
- 明確的測試結果（不是「應該可以」）
- 所有問題都已解決
- 沒有未完成的 TODO 列表

## 檢查點 ✅

完成上述步驟後，確認：

- [ ] 輸入 `ulw` 後看到 Toast 通知
- [ ] 代理回覆以「ULTRAWORK MODE ENABLED!」開頭
- [ ] 觀察到平行背景任務執行
- [ ] 代理使用 Category + Skills 系統
- [ ] 任務完成後有驗證證據

如果任何一項未通過，檢查：
- 關鍵詞是否正確拼寫（`ultrawork` 或 `ulw`）
- 是否在主會話中（背景任務不會觸發模式）
- 配置文件是否啟動了相關功能

## 什麼時候用這一招

| 場景 | 使用 Ultrawork | 普通模式 |
| --- | --- | ---|
| **複雜新功能** | ✅ 推薦（需要多代理協作） | ❌ 可能不夠高效 |
| **緊急修復** | ✅ 推薦（需要快速診斷和探索） | ❌ 可能遺漏上下文 |
| **簡單修改** | ❌ 過度（浪費資源） | ✅ 更合適 |
| **快速驗證想法** | ❌ 過度 | ✅ 更合適 |

**經驗法則**：
- 任務涉及多個模組或系統 → 用 `ulw`
- 需要深入研究程式碼庫 → 用 `ulw`
- 需要呼叫多個專業代理 → 用 `ulw`
- 單檔案小改動 → 不需要 `ulw`

## 踩坑提醒

::: warning 注意事項

**1. 不要在每個提示詞中都使用 `ulw`**

Ultrawork 模式會注入大量指令，對於簡單任務來說是過度設計。只有真正需要多代理協作、平行探索、深度分析的複雜任務才使用。

**2. 背景任務不會觸發 Ultrawork 模式**

關鍵詞檢測器會跳過背景會話，避免模式錯誤注入到子代理。Ultrawork 模式只在主會話中有效。

**3. 確保 Provider 配置正確**

Ultrawork 模式依賴多個 AI 模型平行工作。如果某些 Provider 未配置或不可用，代理可能無法呼叫專業代理。
:::

## 本課小結

Ultrawork 模式透過關鍵詞觸發，實現了「一句話啟動全部功能」的設計目標：

- **簡單易用**：輸入 `ulw` 即可啟動
- **自動協作**：代理自動呼叫其他代理、平行執行背景任務
- **強制完成**：完整的驗證機制確保 100% 完成
- **零配置**：無需手動設定代理優先順序、併發限制等

記住：Ultrawork 模式是為了讓代理像真實團隊一樣工作，你只需要表達意圖，代理負責執行。

## 下一課預告

> 下一課我們學習 **[Provider 配置](../../platforms/provider-setup/)**。
>
> 你會學到：
> - 如何配置 Anthropic、OpenAI、Google 等多個 Provider
> - 多模型策略如何自動降級和選擇最優模型
> - 如何測試 Provider 連接和額度使用

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| Ultrawork 設計哲學 | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| 關鍵詞檢測器 Hook | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| ULTRAWORK 指令模板 | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| 關鍵詞檢測邏輯 | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**關鍵常數**：
- `KEYWORD_DETECTORS`：關鍵詞檢測器配置，包含 ultrawork、search、analyze 三個模式
- `CODE_BLOCK_PATTERN`：程式碼區塊正規表示式，用於過濾程式碼區塊中的關鍵詞
- `INLINE_CODE_PATTERN`：行內程式碼正規表示式，用於過濾行內程式碼中的關鍵詞

**關鍵函式**：
- `createKeywordDetectorHook()`：建立關鍵詞檢測器 Hook，監聽 UserPromptSubmit 事件
- `detectKeywordsWithType()`：檢測文字中的關鍵詞並返回類型（ultrawork/search/analyze）
- `getUltraworkMessage()`：生成 ULTRAWORK 模式的完整指令（根據代理類型選擇 Planner 或普通模式）
- `removeCodeBlocks()`：從文字中移除程式碼區塊，避免在程式碼區塊中誤觸發關鍵詞

**業務規則**：
| 規則ID | 規則描述 | 標記 |
| --- | --- | ---|
| BR-4.8.4-1 | 檢測到 "ultrawork" 或 "ulw" 時啟動 Ultrawork 模式 | 【事實】 |
| BR-4.8.4-2 | Ultrawork 模式設定 `message.variant = "max"` | 【事實】 |
| BR-4.8.4-3 | Ultrawork 模式顯示 Toast 通知："Ultrawork Mode Activated" | 【事實】 |
| BR-4.8.4-4 | 背景任務會話跳過關鍵詞檢測，避免模式注入 | 【事實】 |
| BR-4.8.4-5 | 非主會話只允許 ultrawork 關鍵詞，阻止其他模式注入 | 【事實】 |

</details>
