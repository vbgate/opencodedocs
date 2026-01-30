---
title: "Provider 設定: AI 多模型策略 | oh-my-opencode"
sidebarTitle: "連接多個 AI 服務"
subtitle: "Provider 設定: AI 多模型策略"
description: "學習如何設定 oh-my-opencode 的各類 AI Provider，包括 Anthropic、OpenAI、Google 和 GitHub Copilot，以及多模型自動降級機制的工作原理。"
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Provider 設定：Claude、OpenAI、Gemini 與多模型策略

## 學完你能做什麼

- 設定 Anthropic Claude、OpenAI、Google Gemini、GitHub Copilot 等多種 AI Provider
- 理解多模型優先級降級機制，讓系統自動選擇最佳可用模型
- 為不同的 AI 代理和任務類型指定最合適的模型
- 設定 Z.ai Coding Plan 和 OpenCode Zen 等第三方服務
- 使用 doctor 命令診斷模型解析設定

## 你現在的困境

你安裝了 oh-my-opencode，但不太清楚：
- 如何添加多個 AI Provider（Claude、OpenAI、Gemini 等）
- 為什麼有時候代理使用的模型不是你想像的
- 如何為不同任務設定不同的模型（比如研究任務用便宜的，程式任務用強的）
- 當某個 Provider 不可用時，系統如何自動切換到備用模型
- 模型設定在 `opencode.json` 和 `oh-my-opencode.json` 中如何協同工作

## 什麼時候用這一招

- **首次設定**：剛安裝完 oh-my-opencode，需要添加或調整 AI Provider
- **添加新訂閱**：購買了新的 AI 服務訂閱（比如 Gemini Pro），想整合進來
- **最佳化成本**：想讓特定代理使用更便宜或更快的模型
- **故障排查**：發現某個代理沒按預期使用模型，需要診斷問題
- **多模型編排**：希望充分利用不同模型的優勢，構建智慧的開發工作流程

## 🎒 開始前的準備

::: warning 前置檢查
本教程假設你已經：
- ✅ 完成了 [安裝和初始設定](../installation/)
- ✅ 安裝了 OpenCode（版本 >= 1.0.150）
- ✅ 了解基本的 JSON/JSONC 設定檔案格式
:::

## 核心思路

oh-my-opencode 使用 **多模型編排系統**，根據你的訂閱和設定，為不同的 AI 代理和任務類型選擇最合適的模型。

**為什麼需要多模型？**

不同的模型有不同的優勢：
- **Claude Opus 4.5**：擅長複雜的推理和架構設計（成本高，但品質好）
- **GPT-5.2**：擅長程式除錯和戰略諮詢
- **Gemini 3 Pro**：擅長前端和 UI/UX 任務（視覺能力強）
- **GPT-5 Nano**：快速且免費，適合程式搜尋和簡單探索
- **GLM-4.7**：價效比高，適合研究和文件查找

oh-my-opencode 的智慧之處在於：**讓每個任務用最合適的模型，而不是所有任務都用同一個模型**。

## 設定檔案位置

oh-my-opencode 的設定支援兩個層級：

| 位置 | 路徑 | 優先級 | 適用場景 |
|---|---|---|---|
| **專案設定** | `.opencode/oh-my-opencode.json` | 低 | 專案特定設定（隨程式碼庫提交） |
| **使用者設定** | `~/.config/opencode/oh-my-opencode.json` | 高 | 全域設定（所有專案共用） |

**設定合併規則**：使用者設定覆蓋專案設定。

**推薦設定檔案結構**：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // 啟用 JSON Schema 自動補全

  "agents": {
    // 代理模型覆蓋
  },
  "categories": {
    // 類別模型覆蓋
  }
}
```

::: tip Schema 自動補全
在 VS Code 等編輯器中，添加 `$schema` 欄位後，輸入設定時會獲得完整的自動補全和類型檢查。
:::

## Provider 設定方法

oh-my-opencode 支援 6 種主要 Provider。設定方法因 Provider 而異。

### Anthropic Claude（推薦）

**適用場景**：主編排器 Sisyphus 和大部分核心代理

**設定步驟**：

1. **執行 OpenCode 認證**：
   ```bash
   opencode auth login
   ```

2. **選擇 Provider**：
   - `Provider`: 選擇 `Anthropic`
   - `Login method`: 選擇 `Claude Pro/Max`

3. **完成 OAuth 流程**：
   - 系統會自動開啟瀏覽器
   - 登入你的 Claude 帳號
   - 等待認證完成

4. **驗證成功**：
   ```bash
   opencode models | grep anthropic
   ```

   你應該看到：
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**模型映射**（Sisyphus 預設設定）：

| 代理 | 預設模型 | 用途 |
|---|---|---|
| Sisyphus | `anthropic/claude-opus-4-5` | 主編排器，複雜推理 |
| Prometheus | `anthropic/claude-opus-4-5` | 專案規劃 |
| Metis | `anthropic/claude-sonnet-4-5` | 前規劃分析 |
| Momus | `anthropic/claude-opus-4-5` | 計劃審查 |

### OpenAI（ChatGPT Plus）

**適用場景**：Oracle 代理（架構審查、除錯）

**設定步驟**：

1. **執行 OpenCode 認證**：
   ```bash
   opencode auth login
   ```

2. **選擇 Provider**：
   - `Provider`: 選擇 `OpenAI`
   - `Login method`: 選擇 OAuth 或 API Key

3. **完成認證流程**（根據選擇的方法）

4. **驗證成功**：
   ```bash
   opencode models | grep openai
   ```

**模型映射**（Oracle 預設設定）：

| 代理 | 預設模型 | 用途 |
|---|---|---|
| Oracle | `openai/gpt-5.2` | 架構審查、除錯 |

**手動覆蓋範例**：

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // 使用 GPT 進行戰略推理
      "temperature": 0.1
    }
  }
}
```

### Google Gemini（推薦）

**適用場景**：Multimodal Looker（媒體分析）、Frontend UI/UX 任務

::: tip 強烈推薦
對於 Gemini 認證，強烈推薦安裝 [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth) 插件。它提供：
- 多帳號負載均衡（最多 10 個帳號）
- Variant 系統支援（`low`/`high` 變體）
- 雙額度系統（Antigravity + Gemini CLI）
:::

**設定步驟**：

1. **添加 Antigravity 認證插件**：
   
   編輯 `~/.config/opencode/opencode.json`：
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **設定 Gemini 模型**（重要）：
   
   Antigravity 插件使用不同的模型名稱。需要複製完整的模型設定到 `opencode.json`，小心合併避免破壞現有設定。

   可用模型（Antigravity 額度）：
   - `google/antigravity-gemini-3-pro` — variants: `low`, `high`
   - `google/antigravity-gemini-3-flash` — variants: `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — no variants
   - `google/antigravity-claude-sonnet-4-5-thinking` — variants: `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — variants: `low`, `max`

   可用模型（Gemini CLI 額度）：
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **覆蓋代理模型**（在 `oh-my-opencode.json` 中）：
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **執行認證**：
   ```bash
   opencode auth login
   ```

5. **選擇 Provider**：
   - `Provider`: 選擇 `Google`
   - `Login method`: 選擇 `OAuth with Google (Antigravity)`

6. **完成認證流程**：
   - 系統會自動開啟瀏覽器
   - 完成 Google 登入
   - 可選：添加更多 Google 帳號用於負載均衡

**模型映射**（預設設定）：

| 代理 | 預設模型 | 用途 |
|---|---|---|
| Multimodal Looker | `google/antigravity-gemini-3-flash` | PDF、圖片分析 |

### GitHub Copilot（備用 Provider）

**適用場景**：當原生 Provider 不可用時的備用選項

::: info 備用 Provider
GitHub Copilot 作為代理 Provider，將請求路由到你訂閱的底層模型。
:::

**設定步驟**：

1. **執行 OpenCode 認證**：
   ```bash
   opencode auth login
   ```

2. **選擇 Provider**：
   - `Provider`: 選擇 `GitHub`
   - `Login method`: 選擇 `Authenticate via OAuth`

3. **完成 GitHub OAuth 流程**

4. **驗證成功**：
   ```bash
   opencode models | grep github-copilot
   ```

**模型映射**（當 GitHub Copilot 是最佳可用 Provider 時）：

| 代理 | 模型 | 用途 |
|---|---|---|
| Sisyphus | `github-copilot/claude-opus-4-5` | 主編排器 |
| Oracle | `github-copilot/gpt-5.2` | 架構審查 |
| Explore | `opencode/gpt-5-nano` | 快速探索 |
| Librarian | `zai-coding-plan/glm-4-7` (如果 Z.ai 可用) | 文件查找 |

### Z.ai Coding Plan（可選）

**適用場景**：Librarian 代理（多倉庫研究、文件查找）

**特點**：
- 提供 GLM-4.7 模型
- 高性價比
- 當啟用時，**Librarian 代理總是使用** `zai-coding-plan/glm-4.7`，不管其他可用 Provider

**設定步驟**：

使用互動式安裝器：

```bash
bunx oh-my-opencode install
# 當提示: "Do you have a Z.ai Coding Plan subscription?" → 選擇 "Yes"
```

**模型映射**（當 Z.ai 是唯一可用 Provider 時）：

| 代理 | 模型 | 用途 |
|---|---|---|
| Sisyphus | `zai-coding-plan/glm-4-7` | 主編排器 |
| Oracle | `zai-coding-plan/glm-4-7` | 架構審查 |
| Explore | `zai-coding-plan/glm-4-7-flash` | 快速探索 |
| Librarian | `zai-coding-plan/glm-4-7` | 文件查找 |

### OpenCode Zen（可選）

**適用場景**：提供 `opencode/` 前綴模型（Claude Opus 4.5、GPT-5.2、GPT-5 Nano、Big Pickle）

**設定步驟**：

```bash
bunx oh-my-opencode install
# 當提示: "Do you have access to OpenCode Zen (opencode/ models)?" → 選擇 "Yes"
```

**模型映射**（當 OpenCode Zen 是最佳可用 Provider 時）：

| 代理 | 模型 | 用途 |
|---|---|---|
| Sisyphus | `opencode/claude-opus-4-5` | 主編排器 |
| Oracle | `opencode/gpt-5.2` | 架構審查 |
| Explore | `opencode/gpt-5-nano` | 快速探索 |
| Librarian | `opencode/big-pickle` | 文件查找 |

## 模型解析系統（3 步優先級）

oh-my-opencode 使用 **3 步優先級機制**來決定每個代理和類別使用的模型。這個機制確保系統總能找到可用的模型。

### 步驟 1：使用者覆蓋

如果使用者在 `oh-my-opencode.json` 中明確指定了模型，使用該模型。

**範例**：
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // 使用者明確指定
    }
  }
}
```

在這種情況：
- ✅ 直接使用 `openai/gpt-5.2`
- ❌ 跳過 Provider 降級步驟

### 步驟 2：Provider 降級

如果使用者沒有明確指定模型，系統會按照代理定義的 Provider 優先級鏈逐個嘗試，直到找到可用的模型。

**Sisyphus 的 Provider 優先級鏈**：

```
anthropic → github-copilot → opencode → antigravity → google
```

**解析流程**：
1. 嘗試 `anthropic/claude-opus-4-5`
   - 可用？→ 返回該模型
   - 不可用？→ 繼續下一步
2. 嘗試 `github-copilot/claude-opus-4-5`
   - 可用？→ 返回該模型
   - 不可用？→ 繼續下一步
3. 嘗試 `opencode/claude-opus-4-5`
   - ...
4. 嘗試 `google/antigravity-claude-opus-4-5-thinking`（如果設定了）
   - ...
5. 返回系統預設模型

**所有代理的 Provider 優先級鏈**：

| 代理 | 模型（無前綴） | Provider 優先級鏈 |
|---|---|---|
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**Category（類別）的 Provider 優先級鏈**：

| Category | 模型（無前綴） | Provider 優先級鏈 |
|---|---|---|
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### 步驟 3：系統預設

如果所有 Provider 都不可用，使用 OpenCode 的預設模型（從 `opencode.json` 讀取）。

**全域優先級順序**：

```
使用者覆蓋 > Provider 降級 > 系統預設
```


## 跟我一起做：設定多個 Provider

### 第 1 步：規劃你的訂閱

在開始設定前，先整理好你的訂閱情況：

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### 第 2 步：使用互動式安裝器（推薦）

oh-my-opencode 提供互動式安裝器，自動處理大部分設定：

```bash
bunx oh-my-opencode install
```

安裝器會詢問：
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**非互動模式**（適合腳本化安裝）：

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### 第 3 步：認證各個 Provider

安裝器設定完成後，逐個認證：

```bash
# 認證 Anthropic
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# 完成 OAuth 流程

# 認證 OpenAI
opencode auth login
# Provider: OpenAI
# 完成 OAuth 流程

# 認證 Google Gemini（需先安裝 antigravity 插件）
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# 完成 OAuth 流程

# 認證 GitHub Copilot
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# 完成 GitHub OAuth
```

### 第 4 步：驗證設定

```bash
# 檢查 OpenCode 版本
opencode --version
# 應該 >= 1.0.150

# 查看所有可用的模型
opencode models

# 執行 doctor 診斷
bunx oh-my-opencode doctor --verbose
```

**你應該看到**（doctor 輸出範例）：

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### 第 5 步：自定義代理模型（可選）

如果你想為特定代理指定不同的模型：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle 使用 GPT 進行架構審查
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian 使用更便宜的模型進行研究
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker 使用 Antigravity Gemini
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### 第 6 步：自定義 Category 模型（可選）

為不同類型的任務指定模型：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // 快速任務使用廉價模型
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // 前端任務使用 Gemini
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // 高智商推理任務使用 GPT Codex
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**使用 Category**：

```markdown
// 在對話中使用 delegate_task
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## 檢查點 ✅

- [ ] `opencode --version` 顯示版本 >= 1.0.150
- [ ] `opencode models` 列出了你設定的所有 Provider 的模型
- [ ] `bunx oh-my-opencode doctor --verbose` 顯示所有代理的模型都已正確解析
- [ ] 可以在 `opencode.json` 中看到 `"oh-my-opencode"` 在 `plugin` 陣列中
- [ ] 嘗試使用一個代理（比如 Sisyphus），確認模型工作正常

## 踩坑提醒

### ❌ 陷阱 1：忘記認證 Provider

**症狀**：設定了 Provider，但模型解析失敗。

**原因**：安裝器設定了模型，但沒有完成認證。

**解決**：
```bash
opencode auth login
# 選擇對應的 Provider 並完成認證
```

### ❌ 陷阱 2：Antigravity 模型名稱錯誤

**症狀**：設定了 Gemini，但代理不使用。

**原因**：Antigravity 插件使用不同的模型名稱（`google/antigravity-gemini-3-pro` 而不是 `google/gemini-3-pro`）。

**解決**：
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // 正確
      // model: "google/gemini-3-flash"  // ❌ 錯誤
    }
  }
}
```

### ❌ 陷阱 3：設定檔案位置錯誤

**症狀**：修改了設定，但系統沒有生效。

**原因**：修改了錯誤的設定檔案（使用者設定 vs 專案設定）。

**解決**：
```bash
# 使用者設定（全域，優先級高）
~/.config/opencode/oh-my-opencode.json

# 專案設定（本地，優先級低）
.opencode/oh-my-opencode.json

# 驗證哪個檔案在被使用
bunx oh-my-opencode doctor --verbose
```

### ❌ 陷阱 4：Provider 優先級鏈被打斷

**症狀**：某個代理總是使用錯誤的模型。

**原因**：使用者覆蓋（Step 1）會完全跳過 Provider 降級（Step 2）。

**解決**：如果你想利用自動降級，不要在 `oh-my-opencode.json` 中硬編碼模型，而是讓系統根據優先級鏈自動選擇。

**範例**：
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ 硬編碼：永遠用 GPT，即使 Anthropic 可用
      "model": "openai/gpt-5.2"
    }
  }
}
```

如果想利用降級，刪除 `model` 欄位，讓系統自動選擇：
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ 自動：anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ 陷阱 5：Z.ai 永遠佔用 Librarian

**症狀**：即使設定了其他 Provider，Librarian 還是使用 GLM-4.7。

**原因**：當 Z.ai 啟用時，Librarian 被硬編碼為使用 `zai-coding-plan/glm-4.7`。

**解決**：如果不需要這個行為，禁用 Z.ai：
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

或手動覆蓋：
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // 覆蓋 Z.ai 的硬編碼
    }
  }
}
```

## 本課小結

- oh-my-opencode 支援 6 種主要 Provider：Anthropic、OpenAI、Google、GitHub Copilot、Z.ai、OpenCode Zen
- 使用互動式安裝器 `bunx oh-my-opencode install` 可以快速設定多個 Provider
- 模型解析系統通過 3 步優先級（使用者覆蓋 → Provider 降級 → 系統預設）動態選擇模型
- 每個代理和 Category 都有自己的 Provider 優先級鏈，確保總能找到可用模型
- 使用 `doctor --verbose` 命令可以診斷模型解析設定
- 自定義代理和 Category 模型時，需要小心不要打破自動降級機制

## 下一課預告

> 下一課我們學習 **[多模型策略：自動降級與優先級](../model-resolution/)**。
>
> 你會學到：
> - 模型解析系統的完整工作流程
> - 如何為不同任務設計最優的模型組合
> - 背景任務中的並發控制策略
> - 如何診斷模型解析問題

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
|---|---|---|
| 設定 Schema 定義 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| 安裝指南（Provider 設定） | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| 設定參考（模型解析） | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| 代理覆蓋設定 Schema | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| Category 設定 Schema | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Provider 優先級鏈文件 | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**關鍵常量**：
- 無：Provider 優先級鏈在設定文件中硬編碼，非程式碼常量

**關鍵函數**：
- 無：模型解析邏輯由 OpenCode 核心處理，oh-my-opencode 提供設定和優先級定義

</details>
