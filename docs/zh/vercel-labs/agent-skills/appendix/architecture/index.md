---
title: "架构与实现细节：Agent Skills 技术原理 | Agent Skills 教程"
sidebarTitle: "看懂底层实现"
subtitle: "架构与实现细节"
description: "了解 Agent Skills 的技术架构、构建流程、规则解析器和部署机制。深入解析类型系统、测试用例提取和框架检测算法，帮助开发者理解底层实现原理。"
tags:
  - "架构"
  - "构建流程"
  - "规则解析"
  - "类型系统"
order: 110
prerequisite:
  - "start-getting-started"
---

# 架构与实现细节

## 学完你能做什么

- 理解 Agent Skills 构建工具链的工作原理
- 掌握规则文件解析的核心逻辑
- 了解类型系统和数据流设计
- 学习框架检测算法的实现细节

## 核心架构概览

Agent Skills 由三个主要部分组成：

**1. 构建工具链**（`packages/react-best-practices-build/`）
- 解析规则文件
- 生成 AGENTS.md
- 提取测试用例

**2. 规则文件**（`skills/react-best-practices/rules/`）
- 57 条 React 性能优化规则
- Markdown 格式，遵循模板规范

**3. 部署脚本**（`skills/claude.ai/vercel-deploy-claimable/`）
- 一键部署到 Vercel
- 自动框架检测

::: info 为什么需要了解架构？
如果你只是使用 Agent Skills，你可能不需要深入了解这些细节。但如果你要：
- 开发自定义技能
- 编写新的性能优化规则
- 排查构建或部署问题

了解架构会非常有帮助。
:::

## 构建流程详解

构建流程将分散的规则文件编译成 AIAgent 可读的 AGENTS.md 文档。流程分为五个阶段：

```mermaid
graph LR
    A[解析规则文件] --> B[验证完整性]
    B --> C[按 section 分组]
    C --> D[按 title 排序]
    D --> E[生成文档]
```

### 阶段 1：解析规则文件（parse）

每个规则文件（`.md`）通过 `parseRuleFile()` 函数解析成 `Rule` 对象。

**解析顺序**（源码位置：`parser.ts:18-238`）：

1. **提取 Frontmatter**（如果存在）
   - 解析 YAML 格式的元数据
   - 支持字段：`title`、`impact`、`tags`、`section`、`explanation`、`references`

2. **提取标题**
   - 查找第一个 `##` 或 `###` 标题
   - 如果 Frontmatter 没有 title，使用这里的内容

3. **提取 Impact**
   - 匹配 `**Impact:**` 行
   - 格式：`**Impact:** CRITICAL (2-10× improvement)`
   - 提取级别和描述

4. **提取代码示例**
   - 查找 `**Label:**` 标记（如 `**Incorrect:**`、`**Correct:**`）
   - 收集后续的代码块
   - 捕获 code block 后的补充说明

5. **提取参考文献**
   - 查找 `Reference:` 或 `References:` 行
   - 解析 Markdown 链接 `[text](url)`

6. **推断 Section**
   - 从文件名前缀提取（源码位置：`parser.ts:201-210`）
   - 映射表：
     - `async-*` → Section 1（消除瀑布）
     - `bundle-*` → Section 2（打包优化）
     - `server-*` → Section 3（服务端性能）
     - `client-*` → Section 4（客户端数据获取）
     - `rerender-*` → Section 5（Re-render 优化）
     - `rendering-*` → Section 6（渲染性能）
     - `js-*` → Section 7（JavaScript 性能）
     - `advanced-*` → Section 8（高级模式）

### 阶段 2：验证完整性（validate）

验证逻辑在 `validate.ts` 中实现，确保规则文件符合规范。

**验证项**：

| 检查项       | 说明                                   | 失败时输出                           |
| ------------ | -------------------------------------- | ------------------------------------ |
| Title 非空   | 必须有标题（Frontmatter 或 `##` 标题） | `Missing or empty title`             |
| 至少一个示例 | `examples` 数组不为空                  | `At least one code example required` |
| Impact 合法  | 必须是有效的 `ImpactLevel` 枚举值      | `Invalid impact level`               |
| Code 不空    | 每个示例必须有代码内容                 | `Empty code block`                   |

### 阶段 3：按 Section 分组（group）

将所有规则按 section 分组，每个 section 包含：

- `number`：章节号（1-8）
- `title`：章节标题（从 `_sections.md` 读取）
- `impact`：整体影响级别
- `introduction`：章节简介（可选）
- `rules[]`：包含的规则数组

（源码位置：`build.ts:156-169`）

### 阶段 4：按 Title 排序（sort）

每个 section 内的规则按标题字母顺序排序。

**排序规则**（源码位置：`build.ts:172-175`）：
```typescript
section.rules.sort((a, b) =>
  a.title.localeCompare(b.title, 'en-US', { sensitivity: 'base' })
)
```

使用 `en-US` locale 确保跨环境一致排序。

**分配 ID**（源码位置：`build.ts:178-180）：
```typescript
section.rules.forEach((rule, index) => {
  rule.id = `${section.number}.${index + 1}`
  rule.subsection = index + 1
})
```

排序后分配 ID，如 `1.1`、`1.2`...

### 阶段 5：生成文档（generate）

`generateMarkdown()` 函数将 `Section[]` 数组转换为 Markdown 文档。

**输出结构**（源码位置：`build.ts:29-126`）：

```markdown
# React Best Practices
**Version 1.0**
Vercel Engineering
January 25, 2026

## Abstract
...

## Table of Contents
1. 消除瀑布 - CRITICAL
   - 1.1 [并行请求](#11-parallel-requests)
   - 1.2 [Defer Await](#12-defer-await)
...

## 1. 消除瀑布
**Impact: CRITICAL**

### 1.1 并行请求
**Impact: CRITICAL**

**Incorrect:**
```typescript
// 代码
```
```

## 规则解析器细节

### Frontmatter 解析

Frontmatter 是 Markdown 文件顶部的 YAML 块：

```markdown
---
title: 并行请求
impact: CRITICAL
impactDescription: 2-10× improvement
tags: async, waterfall
---
```

**解析逻辑**（源码位置：`parser.ts:28-41`）：
- 检测 `---` 开头和第二个 `---` 结尾
- 按 `:` 分割键值对
- 去除引号包裹
- 存储到 `frontmatter` 对象

### 代码示例解析

每个规则包含多个代码示例，用 `**Label:**` 标记。

**解析状态机**（源码位置：`parser.ts:66-188`）：

```
初始状态 → 读到 **Label:** → currentExample.label = "标签"
           → 读到 ``` → inCodeBlock = true，收集代码
           → 读到 ``` → inCodeBlock = false，currentExample.code = 收集的代码
           → 读到文本 → 如果 afterCodeBlock，存入 additionalText
           → 读到 **Reference:** → currentExample 推入 examples[]
```

**支持的 Label 类型**：
- `Incorrect`：错误示例
- `Correct`：正确示例
- `Example`：通用示例
- `Usage`：用法示例
- `Implementation`：实现示例

**补充说明捕获**（源码位置：`parser.ts:182-186`）：
```typescript
// Text after a code block, or text in a section without a code block
// (e.g., "When NOT to use this pattern:" with bullet points instead of code)
else if (currentExample && (afterCodeBlock || !hasCodeBlockForCurrentExample)) {
  additionalText.push(line)
}
```

这支持代码块后添加补充说明，或纯文本示例（如列表）。

### 参考文献解析

参考文献在文件末尾，格式为：

```markdown
Reference: [React文档](https://react.dev), [Next.js指南](https://nextjs.org/docs)
```

**解析逻辑**（源码位置：`parser.ts:154-174`）：
- 正则匹配 `[text](url)` 模式
- 提取所有 URL 到 `references[]` 数组

## 类型系统

类型定义在 `types.ts` 中（源码位置：`types.ts:1-54`）。

### ImpactLevel 枚举

```typescript
export type ImpactLevel =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM-HIGH'
  | 'MEDIUM'
  | 'LOW-MEDIUM'
  | 'LOW'
```

**级别说明**：

| 级别        | 影响               | 示例规则                     |
| ----------- | ------------------ | ---------------------------- |
| CRITICAL    | 关键瓶颈，必须修复 | async-parallel               |
| HIGH        | 重要改进，建议优先 | server-cache-react           |
| MEDIUM-HIGH | 中高优先级         | client-data-fetch            |
| MEDIUM      | 中等改进           | rerender-memo                |
| LOW-MEDIUM  | 低中优先级         | js-use-memo                  |
| LOW         | 增量改进，可选     | advanced-suspense-boundaries |

### Rule 接口

```typescript
export interface Rule {
  id: string                    // 自动生成，如 "1.1"
  title: string                 // 规则标题
  section: number              // 所属章节（1-8）
  subsection?: number          // 子章节序号
  impact: ImpactLevel          // 影响级别
  impactDescription?: string  // 影响描述，如 "2-10× improvement"
  explanation: string          // 规则说明
  examples: CodeExample[]      // 代码示例数组
  references?: string[]        // 参考链接
  tags?: string[]              // 标签
}
```

### CodeExample 接口

```typescript
export interface CodeExample {
  label: string              // "Incorrect", "Correct", "Example"
  description?: string       // 标签描述（可选）
  code: string              // 代码内容
  language?: string         // 代码语言，默认 typescript
  additionalText?: string   // 代码后的补充说明
}
```

### Section 接口

```typescript
export interface Section {
  number: number              // 章节号（1-8）
  title: string              // 章节标题
  impact: ImpactLevel        // 整体影响级别
  impactDescription?: string // 影响描述
  introduction?: string      // 章节简介
  rules: Rule[]             // 包含的规则
}
```

### GuidelinesDocument 接口

```typescript
export interface GuidelinesDocument {
  version: string          // 版本号，如 "1.0"
  organization: string     // 组织名称
  date: string            // 日期
  abstract: string        // 摘要
  sections: Section[]     // 章节
  references?: string[]   // 全局参考文献
}
```

### TestCase 接口

用于 LLM 自动评估的测试用例。

```typescript
export interface TestCase {
  ruleId: string          // 规则 ID，如 "1.1"
  ruleTitle: string       // 规则标题
  type: 'bad' | 'good'   // 示例类型
  code: string           // 代码内容
  language: string       // 代码语言
  description?: string   // 描述
}
```

## 测试用例提取机制

测试用例提取功能将规则中的代码示例转换为可评测的测试用例，用于 LLM 自动评估规则遵循度。

### 提取逻辑（源码位置：`extract-tests.ts:15-38`）

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

**支持的示例类型**：
- `Incorrect` / `Wrong` / `Bad` → type = 'bad'
- `Correct` / `Good` → type = 'good'

**输出文件**：`test-cases.json`

**数据结构**：
```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "并行请求",
    "type": "bad",
    "code": "const data = await fetch(url);\nconst result = await process(data);",
    "language": "typescript",
    "description": "Incorrect example for 并行请求"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "并行请求",
    "type": "good",
    "code": "const [data, processed] = await Promise.all([\n  fetch(url),\n  process(data)\n]);",
    "language": "typescript",
    "description": "Correct example for 并行请求"
  }
]
```

**统计数据**（源码位置：`extract-tests.ts:68-70`）：
```bash
✓ Extracted 120 test cases to test-cases.json
  - Bad examples: 60
  - Good examples: 60
```

## 部署脚本框架检测

Vercel 部署脚本支持 40+ 种框架的自动检测。

### 检测逻辑（源码位置：`deploy.sh:12-156`）

```bash
detect_framework() {
    local pkg_json="$1"
    local content=$(cat "$pkg_json")

    has_dep() {
        echo "$content" | grep -q "\"$1\""
    }

    # 检查依赖，按优先级顺序
    if has_dep "blitz"; then echo "blitzjs"; return; fi
    if has_dep "next"; then echo "nextjs"; return; fi
    if has_dep "gatsby"; then echo "gatsby"; return; fi
    # ... 更多框架检测
}
```

**检测顺序**：
- 从特殊到通用
- 检查 `dependencies` 和 `devDependencies`
- 使用 `grep -q` 快速匹配

### 支持的框架

| 类别         | 框架列表                                                      | 检测关键词                    |
| ------------ | ------------------------------------------------------------- | ----------------------------- |
| React        | Next.js, Gatsby, Create React App, Remix, React Router, Blitz | `next`, `gatsby`, `remix-run` |
| Vue          | Nuxt, Vitepress, Vuepress, Gridsome                           | `nuxt`, `vitepress`           |
| Svelte       | SvelteKit, Svelte, Sapper                                     | `@sveltejs/kit`, `svelte`     |
| Angular      | Angular, Ionic Angular                                        | `@angular/core`               |
| Node.js 后端 | Express, Hono, Fastify, NestJS, Elysia, h3, Nitro             | `express`, `hono`, `nestjs`   |
| 构建工具     | Vite, Parcel                                                  | `vite`, `parcel`              |
| 静态 HTML    | 无 package.json                                               | 返回 `null`                   |

### 静态 HTML 项目处理（源码位置：`deploy.sh:192-206`）

静态 HTML 项目（无 `package.json`）需要特殊处理：

```bash
if [ ! -f "$PROJECT_PATH/package.json" ]; then
  # 查找根目录的 HTML 文件
  HTML_FILES=$(find "$PROJECT_PATH" -maxdepth 1 -name "*.html" -type f)
  HTML_COUNT=$(echo "$HTML_FILES" | grep -c . || echo 0)

  # 如果只有一个 HTML 文件且不是 index.html，重命名为 index.html
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

**为什么需要重命名？**
Vercel 默认查找 `index.html` 作为静态站点的入口文件。

### 部署流程（源码位置：`deploy.sh:158-249`）

```bash
# 1. 解析参数
INPUT_PATH="${1:-.}"

# 2. 创建临时目录
TEMP_DIR=$(mktemp -d)

# 3. 检测框架
FRAMEWORK=$(detect_framework "$PROJECT_PATH/package.json")

# 4. 创建 tarball（排除 node_modules 和 .git）
tar -czf "$TARBALL" -C "$PROJECT_PATH" --exclude='node_modules' --exclude='.git' .

# 5. 上传到 API
RESPONSE=$(curl -s -X POST "$DEPLOY_ENDPOINT" -F "file=@$TARBALL" -F "framework=$FRAMEWORK")

# 6. 解析响应
PREVIEW_URL=$(echo "$RESPONSE" | grep -o '"previewUrl":"[^"]*"' | cut -d'"' -f4)
CLAIM_URL=$(echo "$RESPONSE" | grep -o '"claimUrl":"[^"]*"' | cut -d'"' -f4)

# 7. 输出结果
echo "Preview URL: $PREVIEW_URL"
echo "Claim URL:   $CLAIM_URL"
echo "$RESPONSE"  # JSON 格式供程序使用
```

**错误处理**（源码位置：`deploy.sh:224-239`）：
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

理解架构后，你可以：

- [开发自定义技能](../../advanced/skill-development/)
- [编写 React 最佳实践规则](../../advanced/rule-authoring/)
- [查看 API 和命令参考](../reference/)

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能             | 文件路径                                                                                                                                                                         | 行号    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 类型系统         | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts)                     | 1-54    |
| 路径配置         | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts)                   | 1-18    |
| 规则解析器       | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts)                   | 18-238  |
| 构建脚本         | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)                     | 131-287 |
| 测试用例提取     | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts)     | 15-38   |
| 部署脚本框架检测 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156  |

**关键常量**：
- `ImpactLevel` 枚举值：CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM, LOW（`types.ts:5`）
- `SKILL_DIR`：技能目录路径（`config.ts:11`）
- `RULES_DIR`：规则文件目录（`config.ts:13`）
- `DEPLOY_ENDPOINT`：`https://claude-skills-deploy.vercel.com/api/deploy`（`deploy.sh:9`）

**关键函数**：
- `parseRuleFile()`: 解析 Markdown 规则文件为 Rule 对象（`parser.ts:18`）
- `extractTestCases()`: 从规则提取测试用例（`extract-tests.ts:15`）
- `generateMarkdown()`: 将 Section[] 生成 Markdown 文档（`build.ts:29`）
- `detect_framework()`: 检测项目框架（`deploy.sh:12`）

</details>
