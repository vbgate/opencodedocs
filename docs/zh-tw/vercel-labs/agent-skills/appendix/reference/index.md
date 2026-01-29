---
title: "API 參考: 命令與類型定義 | Agent Skills"
sidebarTitle: "API 參考"
subtitle: "API 參考: 命令與類型定義"
description: "了解 Agent Skills 的命令、配置和類型定義。包含建構工具鍊命令、TypeScript 類型定義、SKILL.md 模板和 Impact 級別枚舉值。"
tags:
  - "參考"
  - "API"
  - "命令列"
  - "類型定義"
prerequisite: []
---

# API 和命令參考

::: tip 簡化說明
由於篇幅限制，本文件使用簡化版本。完整內容請參考源文件。
:::

## TypeScript 類型定義

### ImpactLevel（影響級別）

| 值 | 說明 |
|--- | ---|
| CRITICAL | 關鍵瓶頸 |
| HIGH | 重要改進 |
| MEDIUM-HIGH | 中高優先級 |
| MEDIUM | 中等改進 |
| LOW-MEDIUM | 低中優先級 |
| LOW | 增量改進 |

### Rule（規則）

| 欄位 | 類型 | 必填 |
|--- | --- | ---|
| id | string | ✅ |
| title | string | ✅ |
| section | number | ✅ |
| subsection | number | ❌ |
| impact | ImpactLevel | ✅ |
| explanation | string | ✅ |
| examples | CodeExample[] | ✅ |
| references | string[] | ❌ |
| tags | string[] | ❌ |

## 建構工具鍊命令

### pnpm build

建構規則文檔並提取測試用例。

### pnpm validate

驗證所有規則檔案的格式和完整性。

### pnpm dev

開發流程（建構 + 驗證）。

### pnpm extract-tests

從規則中提取測試用例。

## 參考資源

- [類型定義](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts)
- [建構腳本](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)
- [驗證腳本](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
