---
title: "架構與實作細節：Agent Skills 技術原理 | Agent Skills 教程"
sidebarTitle: "看懂底層實作"
subtitle: "架構與實作細節"
description: "了解 Agent Skills 的技術架構、建構流程、規則解析器和部署機制。深入解析型別系統、測試用例提取和框架檢測演算法，幫助開發者理解底層實作原理。"
tags:
  - "架構"
  - "建構流程"
  - "規則解析"
  - "型別系統"
order: 110
prerequisite:
  - "start-getting-started"
---

# 架構與實作細節

## 學完你能做什麼

- 理解 Agent Skills 建構工具鏈的工作原理
- 掌握規則檔案解析的核心邏輯
- 了解型別系統和資料流設計
- 學習框架檢測演算法的實作細節

## 核心架構概覽

Agent Skills 由三個主要部分組成：

**1. 建構工具鏈**（`packages/react-best-practices-build/`）
- 解析規則檔案
- 生成 AGENTS.md
- 提取測試用例

**2. 規則檔案**（`skills/react-best-practices/rules/`）
- 57 條 React 效能最佳化規則
- Markdown 格式，遵循模板規範

**3. 部署腳本**（`skills/claude.ai/vercel-deploy-claimable/`）
- 一鍵部署到 Vercel
- 自動框架檢測

::: info 為什麼需要了解架構？
如果你只是使用 Agent Skills，你可能不需要深入了解這些細節。但如果你要：
- 開發自訂技能
- 撰寫新的效能最佳化規則
- 排查建構或部署問題

了解架構會非常有幫助。
:::

## 建構流程詳解

建構流程將分散的規則檔案編譯成 AIAgent 可讀的 AGENTS.md 文件。流程分為五個階段：

```mermaid
graph LR
    A[解析規則檔案] --> B[驗證完整性]
    B --> C[按 section 分組]
    C --> D[按 title 排序]
    D --> E[生成文件]
```

### 階段 1：解析規則檔案（parse）

每個規則檔案（`.md`）透過 `parseRuleFile()` 函式解析成 `Rule` 物件。

**解析順序**（原始碼位置：`parser.ts:18-238`）：

1. **提取 Frontmatter**（如果存在）
   - 解析 YAML 格式的元資料
   - 支援欄位：`title`、`impact`、`tags`、`section`、`explanation`、`references`

2. **提取標題**
   - 查找第一個 `##` 或 `###` 標題
   - 如果 Frontmatter 沒有 title，使用這裡的內容

3. **提取 Impact**
   - 匹配 `**Impact:**` 行
   - 格式：`**Impact:** CRITICAL (2-10× improvement)`
   - 提取級別和描述

4. **提取程式碼範例**
   - 查找 `**Label:**` 標記（如 `**Incorrect:**`、`**Correct:**`）
   - 收集後續的程式碼區塊
   - 捕獲 code block 後的補充說明

5. **提取參考文獻**
   - 查找 `Reference:` 或 `References:` 行
   - 解析 Markdown 連結 `[text](url)`

6. **推斷 Section**
   - 從檔名前綴提取（原始碼位置：`parser.ts:201-210`）
   - 對應表：
     - `async-*` → Section 1（消除瀑布）
     - `bundle-*` → Section 2（打包最佳化）
     - `server-*` → Section 3（伺服器端效能）
     - `client-*` → Section 4（客戶端資料獲取）
     - `rerender-*` → Section 5（Re-render 最佳化）
     - `rendering-*` → Section 6（渲染效能）
     - `js-*` → Section 7（JavaScript 效能）
     - `advanced-*` → Section 8（進階模式）

### 階段 2：驗證完整性（validate）

驗證邏輯在 `validate.ts` 中實作，確保規則檔案符合規範。

**驗證項**：

| 檢查項       | 說明                                   | 失敗時輸出                           |
|--- | --- | ---|
| Title 非空   | 必須有標題（Frontmatter 或 `##` 標題） | `Missing or empty title`             |
| 至少一個範例 | `examples` 陣列不為空                  | `At least one code example required` |
| Impact 合法  | 必須是有效的 `ImpactLevel` 列舉值      | `Invalid impact level`               |
| Code 不空    | 每個範例必須有程式碼內容                 | `Empty code block`                   |

### 階段 3：按 Section 分組（group）

將所有規則按 section 分組，每個 section 包含：

- `number`：章節號（1-8）
- `title`：章節標題（從 `_sections.md` 讀取）
- `impact`：整體影響級別
- `introduction`：章節簡介（可選）
- `rules[]`：包含的規則陣列

（原始碼位置：`build.ts:156-169`）

### 階段 4：按 Title 排序（sort）

每個 section 內的規則按標題字母順序排序。

**排序規則**（原始碼位置：`build.ts:172-175`）：
```typescript
section.rules.sort((a, b) =>
  a.title.localeCompare(b.title, 'en-US', { sensitivity: 'base' })
)
```

使用 `en-US` locale 確保跨環境一致排序。

**分配 ID**（原始碼位置：`build.ts:178-180）：
```typescript
section.rules.forEach((rule, index) => {
  rule.id = `${section.number}.${index + 1}`
  rule.subsection = index + 1
})
```

排序後分配 ID，如 `1.1`、`1.2`...

### 階段 5：生成文件（generate）

`generateMarkdown()` 函式將 `Section[]` 陣列轉換為 Markdown 文件。

**輸出結構**（原始碼位置：`build.ts:29-126`）：

```markdown
# React Best Practices
**Version 1.0**
Vercel Engineering
January 25, 2026

## Abstract
...

## Table of Contents
1. 消除瀑布 - CRITICAL
   - 1.1 [並行請求](#11-parallel-requests)
   - 1.2 [Defer Await](#12-defer-await)
...

## 1. 消除瀑布
**Impact: CRITICAL**

### 1.1 並行請求
**Impact: CRITICAL**

**Incorrect:**
```typescript
// 程式碼
```
```

## 規則解析器細節

### Frontmatter 解析

Frontmatter 是 Markdown 檔案頂部的 YAML 區塊：

```markdown
---
title: 並行請求
impact: CRITICAL
impactDescription: 2-10× improvement
tags: async, waterfall
---
```

**解析邏輯**（原始碼位置：`parser.ts:28-41`）：
- 檢測 `---` 開頭和第二個 `---` 結尾
- 按 `:` 分割鍵值對
- 去除引號包裹
- 儲存到 `frontmatter` 物件

### 程式碼範例解析

每個規則包含多個程式碼範例，用 `**Label:**` 標記。

**解析狀態機**（原始碼位置：`parser.ts:66-188`）：

```
初始狀態 → 讀到 **Label:** → currentExample.label = "標籤"
           → 讀到 ``` → inCodeBlock = true，收集程式碼
           → 讀到 ``` → inCodeBlock = false，currentExample.code = 收集的程式碼
           → 讀到文字 → 如果 afterCodeBlock，存入 additionalText
           → 讀到 **Reference:** → currentExample 推入 examples[]
```

**支援的 Label 類型**：
- `Incorrect`：錯誤範例
- `Correct`：正確範例
- `Example`：通用範例
- `Usage`：用法範例
- `Implementation`：實作範例

**補充說明捕獲**（原始碼位置：`parser.ts:182-186`）：
```typescript
// Text after a code block, or text in a section without a code block
// (e.g., "When NOT to use this pattern:" with bullet points instead of code)
else if (currentExample && (afterCodeBlock || !hasCodeBlockForCurrentExample)) {
  additionalText.push(line)
}
```

這支援程式碼區塊後添加補充說明，或純文字範例（如列表）。

### 參考文獻解析

參考文獻在檔案末尾，格式為：

```markdown
Reference: [React文件](https://react.dev), [Next.js指南](https://nextjs.org/docs)
```

**解析邏輯**（原始碼位置：`parser.ts:154-174`）：
- 正則匹配 `[text](url)` 模式
- 提取所有 URL 到 `references[]` 陣列

## 型別系統

型別定義在 `types.ts` 中（原始碼位置：`types.ts:1-54`）。

### ImpactLevel 列舉

```typescript
export type ImpactLevel =
  | 'CRITICAL'
  | 'HIGH'
|---|
  | 'MEDIUM'
|---|
  | 'LOW'
```

**級別說明**：

| 級別        | 影響               | 範例規則                     |
|--- | --- | ---|
| CRITICAL    | 關鍵瓶頸，必須修復 | async-parallel               |
| HIGH        | 重要改進，建議優先 | server-cache-react           |
| MEDIUM-HIGH | 中高優先級         | client-data-fetch            |
| MEDIUM      | 中等改進           | rerender-memo                |
| LOW-MEDIUM  | 低中優先級         | js-use-memo                  |
| LOW         | 增量改進，可選     | advanced-suspense-boundaries |

### Rule 介面

```typescript
export interface Rule {
  id: string                    // 自動生成，如 "1.1"
  title: string                 // 規則標題
  section: number              // 所屬章節（1-8）
  subsection?: number          // 子章節序號
  impact: ImpactLevel          // 影響級別
  impactDescription?: string  // 影響描述，如 "2-10× improvement"
  explanation: string          // 規則說明
  examples: CodeExample[]      // 程式碼範例陣列
  references?: string[]        // 參考連結
  tags?: string[]              // 標籤
}
```

### CodeExample 介面

```typescript
export interface CodeExample {
  label: string              // "Incorrect", "Correct", "Example"
  description?: string       // 標籤描述（可選）
  code: string              // 程式碼內容
  language?: string         // 程式碼語言，預設 typescript
  additionalText?: string   // 程式碼後的補充說明
}
```

### Section 介面

```typescript
export interface Section {
  number: number              // 章節號（1-8）
  title: string              // 章節標題
  impact: ImpactLevel        // 整體影響級別
  impactDescription?: string // 影響描述
  introduction?: string      // 章節簡介
  rules: Rule[]             // 包含的規則
}
```

### GuidelinesDocument 介面

```typescript
export interface GuidelinesDocument {
  version: string          // 版本號，如 "1.0"
  organization: string     // 組織名稱
  date: string            // 日期
  abstract: string        // 摘要
  sections: Section[]     // 章節
  references?: string[]   // 全域參考文獻
}
```

### TestCase 介面

用於 LLM 自動評估的測試用例。

```typescript
export interface TestCase {
  ruleId: string          // 規則 ID，如 "1.1"
  ruleTitle: string       // 規則標題
  type: 'bad' | 'good'   // 範例類型
  code: string           // 程式碼內容
  language: string       // 程式碼語言
  description?: string   // 描述
}
```

## 測試用例提取機制

測試用例提取功能將規則中的程式碼範例轉換為可評測的測試用例，用於 LLM 自動評估規則遵循度。

### 提取邏輯（原始碼位置：`extract-tests.ts:15-38`）

```typescript
function extractTestCases(rule: Rule): TestCase[] {
  const testCases: TestCase[] = []

  rule.examples.forEach((example, index) => {
    const isBad = example.label.toLowerCase().includes('incorrect') ||
                  example.label.toLowerCase().includes('wrong') ||
                  example.label.toLowerCase().includes('bad')
    const isGood = example.label.toLowerCase().includes('correct') ||
                   example.label.toLowerCase().includes('good')

    if (isBad || isGood) {
      testCases.push({
        ruleId: rule.id,
        ruleTitle: rule.title,
        type: isBad ? 'bad' : 'good',
        code: example.code,
        language: example.language || 'typescript',
        description: example.description || `${example.label} example for ${rule.title}`
      })
    }
  })

  return testCases
}
```

**支援的範例類型**：
- `Incorrect` / `Wrong` / `Bad` → type = 'bad'
- `Correct` / `Good` → type = 'good'

**輸出檔案**：`test-cases.json`

**資料結構**：
```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "並行請求",
    "type": "bad",
    "code": "const data = await fetch(url);\nconst result = await process(data);",
    "language": "typescript",
    "description": "Incorrect example for 並行請求"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "並行請求",
    "type": "good",
    "code": "const [data, processed] = await Promise.all([\n  fetch(url),\n  process(data)\n]);",
    "language": "typescript",
    "description": "Correct example for 並行請求"
  }
]
```

**統計資料**（原始碼位置：`extract-tests.ts:68-70`）：
```bash
✓ Extracted 120 test cases to test-cases.json
  - Bad examples: 60
  - Good examples: 60
```

## 部署腳本框架檢測

Vercel 部署腳本支援 40+ 種框架的自動檢測。

### 檢測邏輯（原始碼位置：`deploy.sh:12-156`）

```bash
detect_framework() {
    local pkg_json="$1"
    local content=$(cat "$pkg_json")

    has_dep() {
        echo "$content" | grep -q "\"$1\""
    }

    # 檢查依賴，按優先級順序
    if has_dep "blitz"; then echo "blitzjs"; return; fi
    if has_dep "next"; then echo "nextjs"; return; fi
    if has_dep "gatsby"; then echo "gatsby"; return; fi
    # ... 更多框架檢測
}
```

**檢測順序**：
- 從特殊到通用
- 檢查 `dependencies` 和 `devDependencies`
- 使用 `grep -q` 快速匹配

### 支援的框架

| 類別         | 框架列表                                                      | 檢測關鍵字                    |
|--- | --- | ---|
| React        | Next.js, Gatsby, Create React App, Remix, React Router, Blitz | `next`, `gatsby`, `remix-run` |
| Vue          | Nuxt, Vitepress, Vuepress, Gridsome                           | `nuxt`, `vitepress`           |
| Svelte       | SvelteKit, Svelte, Sapper                                     | `@sveltejs/kit`, `svelte`     |
| Angular      | Angular, Ionic Angular                                        | `@angular/core`               |
| Node.js 後端 | Express, Hono, Fastify, NestJS, Elysia, h3, Nitro             | `express`, `hono`, `nestjs`   |
| 建構工具     | Vite, Parcel                                                  | `vite`, `parcel`              |
| 靜態 HTML    | 無 package.json                                               | 返回 `null`                   |

### 靜態 HTML 專案處理（原始碼位置：`deploy.sh:192-206`）

靜態 HTML 專案（無 `package.json`）需要特殊處理：

```bash
if [ ! -f "$PROJECT_PATH/package.json" ]; then
  # 查找根目錄的 HTML 檔案
  HTML_FILES=$(find "$PROJECT_PATH" -maxdepth 1 -name "*.html" -type f)
  HTML_COUNT=$(echo "$HTML_FILES" | grep -c . || echo 0)

  # 如果只有一個 HTML 檔案且不是 index.html，重新命名為 index.html
  if [ "$HTML_COUNT" -eq 1 ]; then
    HTML_FILE=$(echo "$HTML_FILES" | head -1)
    BASENAME=$(basename "$HTML_FILE")
    if [ "$BASENAME" != "index.html" ]; then
      echo "Renaming $BASENAME to index.html..." >&2
      mv "$HTML_FILE" "$PROJECT_PATH/index.html"
    fi
  fi
fi
```

**為什麼需要重新命名？**
Vercel 預設查找 `index.html` 作為靜態站點的入口檔案。

### 部署流程（原始碼位置：`deploy.sh:158-249`）

```bash
# 1. 解析參數
INPUT_PATH="${1:-.}"

# 2. 建立暫存目錄
TEMP_DIR=$(mktemp -d)

# 3. 檢測框架
FRAMEWORK=$(detect_framework "$PROJECT_PATH/package.json")

# 4. 建立 tarball（排除 node_modules 和 .git）
tar -czf "$TARBALL" -C "$PROJECT_PATH" --exclude='node_modules' --exclude='.git' .

# 5. 上傳到 API
RESPONSE=$(curl -s -X POST "$DEPLOY_ENDPOINT" -F "file=@$TARBALL" -F "framework=$FRAMEWORK")

# 6. 解析回應
PREVIEW_URL=$(echo "$RESPONSE" | grep -o '"previewUrl":"[^"]*"' | cut -d'"' -f4)
CLAIM_URL=$(echo "$RESPONSE" | grep -o '"claimUrl":"[^"]*"' | cut -d'"' -f4)

# 7. 輸出結果
echo "Preview URL: $PREVIEW_URL"
echo "Claim URL:   $CLAIM_URL"
echo "$RESPONSE"  # JSON 格式供程式使用
```

**錯誤處理**（原始碼位置：`deploy.sh:224-239`）：
```bash
if echo "$RESPONSE" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Error: $ERROR_MSG" >&2
  exit 1
fi

if [ -z "$PREVIEW_URL" ]; then
  echo "Error: Could not extract preview URL from response" >&2
  exit 1
fi
```

## 下一步

理解架構後，你可以：

- [開發自訂技能](../../advanced/skill-development/)
- [撰寫 React 最佳實務規則](../../advanced/rule-authoring/)
- [查看 API 和命令參考](../reference/)

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能             | 檔案路徑                                                                                                                                                                         | 行號    |
|--- | --- | ---|
| 型別系統         | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts)                     | 1-54    |
| 路徑配置         | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts)                   | 1-18    |
| 規則解析器       | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts)                   | 18-238  |
| 建構腳本         | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)                     | 131-287 |
| 測試用例提取     | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts)     | 15-38   |
| 部署腳本框架檢測 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156  |

**關鍵常數**：
- `ImpactLevel` 列舉值：CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM, LOW（`types.ts:5`）
- `SKILL_DIR`：技能目錄路徑（`config.ts:11`）
- `RULES_DIR`：規則檔案目錄（`config.ts:13`）
- `DEPLOY_ENDPOINT`：`https://claude-skills-deploy.vercel.com/api/deploy`（`deploy.sh:9`）

**關鍵函式**：
- `parseRuleFile()`: 解析 Markdown 規則檔案為 Rule 物件（`parser.ts:18`）
- `extractTestCases()`: 從規則提取測試用例（`extract-tests.ts:15`）
- `generateMarkdown()`: 將 Section[] 生成 Markdown 文件（`build.ts:29`）
- `detect_framework()`: 檢測專案框架（`deploy.sh:12`）

</details>
