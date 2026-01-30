---
title: "AI 代理: 10 位專家介紹 | oh-my-opencode"
sidebarTitle: "認識 10 位 AI 專家"
subtitle: "AI 代理: 10 位專家介紹"
description: "學習 oh-my-opencode 的 10 個 AI 代理。根據任務類型選擇代理，實現高效協作與平行執行。"
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# AI 代理團隊：10 位專家介紹

## 學完你能做什麼

- 了解 10 個內建 AI 代理的職責和專長
- 根據任務類型快速選擇最合適的代理
- 理解代理之間的協作機制（委派、平行、審查）
- 掌握不同代理的權限限制和使用情境

## 核心思路：像真實團隊一樣協作

**oh-my-opencode** 的核心思想是：**不要把 AI 當成一個全能助手，而是當成一個專業團隊**。

真實開發團隊裡，你需要：
- **主編排器**（Tech Lead）：負責規劃、分配任務、追蹤進度
- **架構顧問**（Architect）：提供技術決策和架構設計建議
- **程式碼審查**（Reviewer）：檢查程式碼品質，發現潛在問題
- **研究專家**（Researcher）：查找文件、搜尋開源實作、調研最佳實踐
- **程式碼偵探**（Searcher）：快速定位程式碼、查找引用、理解現有實作
- **前端設計師**（Frontend Designer）：設計 UI、調整樣式
- **Git 專家**（Git Master）：提交程式碼、管理分支、搜尋歷史

oh-my-opencode 把這些角色做成了 10 個專業 AI 代理，你可以根據任務類型靈活組合使用。

## 10 個代理詳解

### 主編排器（2 個）

#### Sisyphus - 主編排器

**角色**：主編排器，你的首要技術負責人

**能力**：
- 深度推理（32k thinking budget）
- 規劃和委派複雜任務
- 執行程式碼修改和重構
- 管理整個開發流程

**推薦模型**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用情境**：
- 日常開發任務（新增功能、修復 bug）
- 需要深度推理的複雜問題
- 多步驟任務分解和執行
- 需要平行委派其他代理的情境

**呼叫方式**：
- 預設主代理（OpenCode Agent 選擇器中的 "Sisyphus"）
- 提示詞中直接輸入任務，無需特殊觸發詞

**權限**：完整工具權限（write、edit、bash、delegate_task 等）

---

#### Atlas - TODO 管理器

**角色**：主編排器，專注 TODO 清單管理和任務執行追蹤

**能力**：
- 管理和追蹤 TODO 清單
- 系統化執行計畫
- 任務進度監控

**推薦模型**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用情境**：
- 使用 `/start-work` 指令啟動專案執行
- 需要嚴格按照計畫完成任務
- 系統化追蹤任務進度

**呼叫方式**：
- 使用斜線指令 `/start-work`
- 透過 Atlas Hook 自動啟動

**權限**：完整工具權限

---

### 顧問與審查（3 個）

#### Oracle - 策略顧問

**角色**：唯讀技術顧問，高智商推理專家

**能力**：
- 架構決策建議
- 複雜問題診斷
- 程式碼審查（唯讀）
- 多系統權衡分析

**推薦模型**：`openai/gpt-5.2`（temperature: 0.1）

**使用情境**：
- 複雜架構設計
- 完成重要工作後的自我審查
- 2 次以上修復失敗的困難除錯
- 陌生的程式碼模式或架構
- 安全性/效能相關問題

**觸發條件**：
- 提示詞中包含 `@oracle` 或使用 `delegate_task(agent="oracle")`
- 複雜架構決策時自動推薦

**限制**：唯讀權限（禁止 write、edit、task、delegate_task）

**核心原則**：
- **極簡主義**：傾向於最簡單的解決方案
- **利用現有資源**：優先修改當前程式碼，避免引入新依賴
- **開發者體驗優先**：可讀性、可維護性 > 理論效能
- **單一明確路徑**：提供一個主要建議，僅在權衡差異顯著時提替代方案

---

#### Metis - 前規劃分析師

**角色**：規劃前的需求分析和風險評估專家

**能力**：
- 識別隱藏需求和未明確要求
- 檢測可能導致 AI 失敗的模糊性
- 標記潛在 AI-slop 模式（過度工程化、範圍蔓延）
- 為規劃代理準備指令

**推薦模型**：`anthropic/claude-sonnet-4-5`（temperature: 0.3）

**使用情境**：
- 在 Prometheus 規劃之前
- 當使用者請求模糊或開放時
- 防止 AI 過度工程化模式

**呼叫方式**：Prometheus 自動呼叫（面試模式）

**限制**：唯讀權限（禁止 write、edit、task、delegate_task）

**核心流程**：
1. **意圖分類**：重構 / 從零建構 / 中等任務 / 協作 / 架構 / 研究
2. **意圖特定分析**：根據不同類型提供針對性建議
3. **問題生成**：為使用者生成明確問題
4. **指令準備**：為 Prometheus 生成明確的 "MUST" 和 "MUST NOT" 指令

---

#### Momus - 計畫審查者

**角色**：嚴格的計畫評審專家，發現所有遺漏和模糊點

**能力**：
- 驗證計畫的清晰度、可驗證性和完整性
- 檢查所有檔案引用和上下文
- 模擬實際實作步驟
- 識別關鍵遺漏

**推薦模型**：`anthropic/claude-sonnet-4-5`（temperature: 0.1）

**使用情境**：
- Prometheus 建立工作計畫後
- 執行複雜 TODO 清單之前
- 驗證計畫品質

**呼叫方式**：Prometheus 自動呼叫

**限制**：唯讀權限（禁止 write、edit、task、delegate_task）

**四大評審標準**：
1. **工作內容清晰度**：每個任務是否指定了參考來源？
2. **驗證與驗收標準**：是否有具體的成功驗證方法？
3. **上下文完整性**：是否提供足夠上下文（90% 信心度閾值）？
4. **整體理解**：開發者是否理解 WHY、WHAT 和 HOW？

**核心原則**：**文件評審者，不是設計顧問**。評估的是「計畫是否清楚到可以執行」，而不是「選擇的方法是否正確」。

---

### 研究與探索（3 個）

#### Librarian - 多儲存庫研究專家

**角色**：開源程式碼庫理解專家，專門查找文件和實作範例

**能力**：
- GitHub CLI：複製儲存庫、搜尋 issues/PRs、查看歷史
- Context7：查詢官方文件
- Web Search：搜尋最新資訊
- 生成帶永久連結的證據

**推薦模型**：`opencode/big-pickle`（temperature: 0.1）

**使用情境**：
- 「如何使用 [函式庫]？」
- 「[框架特性] 的最佳實踐是什麼？」
- 「[外部依賴] 為什麼會這樣表現？」
- 「查找 [函式庫] 的使用範例」

**觸發條件**：
- 提及外部函式庫/來源時自動觸發
- 提示詞中包含 `@librarian`

**請求類型分類**：
- **Type A（概念性）**：「如何做 X？」、「最佳實踐」
- **Type B（實作參考）**：「X 如何實作 Y？」、「顯示 Z 的原始碼」
- **Type C（上下文與歷史）**：「為什麼會這樣改？」、「X 的歷史？」
- **Type D（綜合研究）**：複雜/模糊請求

**限制**：唯讀權限（禁止 write、edit、task、delegate_task、call_omo_agent）

**強制要求**：所有程式碼聲明必須包含 GitHub 永久連結

---

#### Explore - 快速程式碼庫探索專家

**角色**：上下文感知的程式碼搜尋專家

**能力**：
- LSP 工具：定義、引用、符號導覽
- AST-Grep：結構模式搜尋
- Grep：文字模式搜尋
- Glob：檔案名稱模式比對
- 平行執行（3+ 工具同時執行）

**推薦模型**：`opencode/gpt-5-nano`（temperature: 0.1）

**使用情境**：
- 需要 2+ 個搜尋角度的廣泛搜尋
- 不熟悉的模組結構
- 跨層模式發現
- 查找「X 在哪裡？」、「哪個檔案有 Y？」

**觸發條件**：
- 涉及 2+ 個模組時自動觸發
- 提示詞中包含 `@explore`

**強制輸出格式**：
```
<analysis>
**Literal Request**: [使用者字面請求]
**Actual Need**: [實際需要什麼]
**Success Looks Like**: [成功應該是什麼樣]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [為什麼這個檔案相關]
- /absolute/path/to/file2.ts — [為什麼這個檔案相關]
</files>

<answer>
[直接回答實際需求]
</answer>

<next_steps>
[接下來應該做什麼]
</next_steps>
</results>
```

**限制**：唯讀權限（禁止 write、edit、task、delegate_task、call_omo_agent）

---

#### Multimodal Looker - 媒體分析專家

**角色**：解釋無法作為純文字讀取的媒體檔案

**能力**：
- PDF：擷取文字、結構、表格、特定章節資料
- 圖片：描述版面配置、UI 元素、文字、圖表
- 圖表：解釋關係、流程、架構

**推薦模型**：`google/gemini-3-flash`（temperature: 0.1）

**使用情境**：
- 需要從 PDF 擷取結構化資料
- 描述圖片中的 UI 元素或圖表
- 解析技術文件中的圖表

**呼叫方式**：透過 `look_at` 工具自動觸發

**限制**：**唯讀白名單**（僅允許 read 工具）

---

### 規劃與執行（2 個）

#### Prometheus - 策略規劃師

**角色**：面試式需求收集和工作計畫生成專家

**能力**：
- 面試模式：持續提問直到需求明確
- 工作計畫生成：結構化的 Markdown 計畫文件
- 平行委派：諮詢 Oracle、Metis、Momus 驗證計畫

**推薦模型**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用情境**：
- 為複雜專案制定詳細計畫
- 需要明確需求的專案
- 系統化工作流程

**呼叫方式**：
- 提示詞中包含 `@prometheus` 或「使用 Prometheus」
- 使用斜線指令 `/start-work`

**工作流程**：
1. **面試模式**：持續提問直到需求清晰
2. **起草計畫**：生成結構化 Markdown 計畫
3. **平行委派**：
   - `delegate_task(agent="oracle", prompt="審查架構決策")` → 背景執行
   - `delegate_task(agent="metis", prompt="識別潛在風險")` → 背景執行
   - `delegate_task(agent="momus", prompt="驗證計畫完整性")` → 背景執行
4. **整合回饋**：完善計畫
5. **輸出計畫**：儲存到 `.sisyphus/plans/{name}.md`

**限制**：僅規劃，不實作程式碼（由 `prometheus-md-only` Hook 強制）

---

#### Sisyphus Junior - 任務執行器

**角色**：類別生成的子代理執行器

**能力**：
- 繼承 Category 設定（模型、temperature、prompt_append）
- 載入 Skills（專業技能）
- 執行委派的子任務

**推薦模型**：繼承自 Category（預設 `anthropic/claude-sonnet-4-5`）

**使用情境**：
- 使用 `delegate_task(category="...", skills=["..."])` 時自動生成
- 需要特定 Category 和 Skill 組合的任務
- 輕量級快速任務（"quick" Category 使用 Haiku 模型）

**呼叫方式**：透過 `delegate_task` 工具自動生成

**限制**：禁止 task、delegate_task（不能再次委派）

---

## 代理呼叫方式速查

| 代理 | 呼叫方式 | 觸發條件 |
| --- | --- | --- |
| **Sisyphus** | 預設主代理 | 日常開發任務 |
| **Atlas** | `/start-work` 指令 | 啟動專案執行 |
| **Oracle** | `@oracle` 或 `delegate_task(agent="oracle")` | 複雜架構決策、2+ 次修復失敗 |
| **Librarian** | `@librarian` 或 `delegate_task(agent="librarian")` | 提及外部函式庫/來源時自動觸發 |
| **Explore** | `@explore` 或 `delegate_task(agent="explore")` | 2+ 模組涉及時自動觸發 |
| **Multimodal Looker** | `look_at` 工具 | 需要分析 PDF/圖片時 |
| **Prometheus** | `@prometheus` 或 `/start-work` | 提示詞中包含「Prometheus」或需要規劃 |
| **Metis** | Prometheus 自動呼叫 | 規劃前自動分析 |
| **Momus** | Prometheus 自動呼叫 | 計畫生成後自動審查 |
| **Sisyphus Junior** | `delegate_task(category=...)` | 使用 Category/Skill 時自動生成 |

---

## 什麼時候用哪個代理

::: tip 快速決策樹

**情境 1：日常開發（寫程式碼、修 bug）**
→ **Sisyphus**（預設）

**情境 2：複雜架構決策**
→ **@oracle** 諮詢

**情境 3：需要查找外部函式庫的文件或實作**
→ **@librarian** 或自動觸發

**情境 4：不熟悉的程式碼庫，需要找相關程式碼**
→ **@explore** 或自動觸發（2+ 模組）

**情境 5：複雜專案需要詳細計畫**
→ **@prometheus** 或使用 `/start-work`

**情境 6：需要分析 PDF 或圖片**
→ **look_at** 工具（自動觸發 Multimodal Looker）

**情境 7：快速簡單任務，想省錢**
→ `delegate_task(category="quick")`

**情境 8：需要 Git 專業操作**
→ `delegate_task(category="quick", skills=["git-master"])`

**情境 9：需要前端 UI 設計**
→ `delegate_task(category="visual-engineering")`

**情境 10：需要高智商推理任務**
→ `delegate_task(category="ultrabrain")`

:::

---

## 代理協作範例：完整工作流

### 範例 1：複雜功能開發

```
使用者：開發一個使用者認證系統

→ Sisyphus 接收任務
  → 分析需求，發現需要外部函式庫（JWT）
  → 平行委派：
    - @librarian: "查找 Next.js JWT 最佳實踐" → [背景]
    - @explore: "查找現有認證相關程式碼" → [背景]
  → 等待結果，整合資訊
  → 實作 JWT 認證功能
  → 完成後委派：
    - @oracle: "審查架構設計" → [背景]
  → 根據建議最佳化
```

---

### 範例 2：專案規劃

```
使用者：使用 Prometheus 規劃這個專案

→ Prometheus 接收任務
  → 面試模式：
    - 問題 1：核心功能是什麼？
    - [使用者回答]
    - 問題 2：目標使用者群體？
    - [使用者回答]
    - ...
  → 需求明確後，平行委派：
    - delegate_task(agent="oracle", prompt="審查架構決策") → [背景]
    - delegate_task(agent="metis", prompt="識別潛在風險") → [背景]
    - delegate_task(agent="momus", prompt="驗證計畫完整性") → [背景]
  → 等待所有背景任務完成
  → 整合回饋，完善計畫
  → 輸出 Markdown 計畫文件
→ 使用者查看計畫，確認
→ 使用 /start-work 啟動執行
```

---

## 代理權限與限制

| 代理 | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## 本課小結

oh-my-opencode 的 10 個 AI 代理涵蓋了開發流程的所有環節：

- **編排與執行**：Sisyphus（主編排器）、Atlas（TODO 管理）
- **顧問與審查**：Oracle（策略顧問）、Metis（前規劃分析）、Momus（計畫審查）
- **研究與探索**：Librarian（多儲存庫研究）、Explore（程式碼庫探索）、Multimodal Looker（媒體分析）
- **規劃**：Prometheus（策略規劃）、Sisyphus Junior（子任務執行）

**核心要點**：
1. 不要把 AI 當全能助手，要當成專業團隊
2. 根據任務類型選擇最合適的代理
3. 利用平行委派提升效率（Librarian、Explore、Oracle 都可背景執行）
4. 理解每個代理的權限限制（唯讀代理不能修改程式碼）
5. 代理之間協作可以形成完整工作流（規劃 → 執行 → 審查）

---

## 下一課預告

> 下一課我們學習 **[Prometheus 規劃：面試式需求收集](../prometheus-planning/)**。
>
> 你會學到：
> - 如何使用 Prometheus 進行面試式需求收集
> - 如何生成結構化的工作計畫
> - 如何讓 Metis 和 Momus 驗證計畫
> - 如何取得和取消背景任務

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 代理 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Sisyphus 主編排器 | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas 主編排器 | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle 顧問 | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian 研究專家 | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore 搜尋專家 | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus 規劃師 | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Metis 前規劃分析 | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Momus 計畫審查者 | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| 代理元資料定義 | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| 代理工具限制 | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**關鍵設定**：
- `ORACLE_PROMPT_METADATA`：Oracle 代理的元資料（觸發條件、使用情境）
- `LIBRARIAN_PROMPT_METADATA`：Librarian 代理的元資料
- `EXPLORE_PROMPT_METADATA`：Explore 代理的元資料
- `MULTIMODAL_LOOKER_PROMPT_METADATA`：Multimodal Looker 代理的元資料
- `METIS_SYSTEM_PROMPT`：Metis 代理的系統提示詞
- `MOMUS_SYSTEM_PROMPT`：Momus 代理的系統提示詞

**關鍵函式**：
- `createOracleAgent(model)`：建立 Oracle 代理設定
- `createLibrarianAgent(model)`：建立 Librarian 代理設定
- `createExploreAgent(model)`：建立 Explore 代理設定
- `createMultimodalLookerAgent(model)`：建立 Multimodal Looker 代理設定
- `createMetisAgent(model)`：建立 Metis 代理設定
- `createMomusAgent(model)`：建立 Momus 代理設定

**權限限制**：
- `createAgentToolRestrictions()`：建立代理工具限制（Oracle、Librarian、Explore、Metis、Momus 使用）
- `createAgentToolAllowlist()`：建立代理工具白名單（Multimodal Looker 使用）

</details>
