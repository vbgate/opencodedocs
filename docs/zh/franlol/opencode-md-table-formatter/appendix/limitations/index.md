---
title: "已知限制: HTML 表格等不支持 | opencode-md-table-formatter"
sidebarTitle: "表格格式失败怎么办"
subtitle: "已知限制: HTML 表格等不支持"
description: "了解 opencode-md-table-formatter 的技术边界，包括不支持 HTML 表格和多行单元格。避免在不支持的场景下使用，提升工作效率。"
tags:
  - "已知限制"
  - "HTML 表格"
  - "多行单元格"
  - "无分隔行表格"
prerequisite:
  - "start-features"
order: 70
---

# 已知限制：插件的边界在哪里

::: info 学完你能做什么
- 知道插件不支持哪些表格类型
- 避免在不支持的场景下使用插件
- 理解插件的技术边界和设计取舍
:::

## 核心思路

这个插件专注于一个目标：**为 OpenCode 的隐藏模式优化 Markdown 管道表格格式化**。

为此，我们有意限制了一些功能，确保核心场景的可靠性和性能。

## 已知限制一览

| 限制 | 说明 | 是否计划支持 |
| --- | --- | --- |
| **HTML 表格** | 只支持 Markdown 管道表格（`\| ... \|`） | ❌ 不支持 |
| **多行单元格** | 单元格内不能包含 `<br>` 等换行标签 | ❌ 不支持 |
| **无分隔行表格** | 必须有 `|---|` 分隔行 | ❌ 不支持 |
| **合并单元格** | 不支持跨行或跨列合并 | ❌ 不支持 |
| **无表头表格** | 分隔行被视为表头，无法创建无表头表格 | ❌ 不支持 |
| **配置选项** | 无法自定义列宽、禁用功能等 | 🤔 未来可能 |
| **超大表格** | 100+ 行表格的性能未验证 | 🤔 未来优化 |

---

## 限制详解

### 1. 不支持 HTML 表格

**现象**

```html
<!-- 这种表格不会被格式化 -->
<table>
  <tr>
    <th>列 1</th>
    <th>列 2</th>
  </tr>
  <tr>
    <td>数据 1</td>
    <td>数据 2</td>
  </tr>
</table>
```

**原因**

插件只处理 Markdown 管道表格（Pipe Table），即用 `|` 分隔的格式：

```markdown
| 列 1 | 列 2 |
| --- | --- |
| 数据 1 | 数据 2 |
```

**源码依据**

```typescript
// index.ts:58-61
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```

检测逻辑只匹配以 `|` 开头和结尾的行，HTML 表格会被直接跳过。

**替代方案**

如果需要格式化 HTML 表格，建议：
- 使用其他专门的 HTML 格式化工具
- 将 HTML 表格转换为 Markdown 管道表格

---

### 2. 不支持多行单元格

**现象**

```markdown
| 列 1 | 列 2 |
| --- | --- |
| 第 1 行<br>第 2 行 | 单行 |
```

输出时会看到 `<!-- table not formatted: invalid structure -->` 注释。

**原因**

插件逐行处理表格，不支持单元格内换行。

**源码依据**

```typescript
// index.ts:25-56
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n")
  // ... 逐行扫描，没有合并多行的逻辑
}
```

**替代方案**

- 将多行内容拆分成多行数据
- 或者接受表格变宽，让内容在一行内显示

---

### 3. 不支持无分隔行表格

**现象**

```markdown
<!-- 缺少分隔行 -->
| 列 1 | 列 2 |
| 数据 1 | 数据 2 |
| 数据 3 | 数据 4 |
```

会看到 `<!-- table not formatted: invalid structure -->` 注释。

**原因**

Markdown 管道表格必须包含分隔行（Separator Row），用于定义列数和对齐方式。

**源码依据**

```typescript
// index.ts:86-87
const hasSeparator = lines.some((line) => isSeparatorRow(line))
return hasSeparator  // 无分隔行返回 false
```

**正确写法**

```markdown
| 列 1 | 列 2 |
| --- | --- |  ← 分隔行
| 数据 1 | 数据 2 |
| 数据 3 | 数据 4 |
```

---

### 4. 不支持合并单元格

**现象**

```markdown
| 列 1 | 列 2 |
| --- | --- |
| 合并两列 |  ← 期望跨越列 1 和列 2
| 数据 1 | 数据 2 |
```

**原因**

Markdown 标准不支持合并单元格语法，插件也没有实现任何合并逻辑。

**替代方案**

- 使用空白单元格占位：`| 合并两列 | |`
- 或者接受 Markdown 的限制，改用 HTML 表格

---

### 5. 分隔行被视为表头

**现象**

```markdown
| :--- | :---: | ---: |
| 左对齐 | 居中 | 右对齐 |
| 数据 1 | 数据 2 | 数据 3 |
```

分隔行会被视为表头行，无法创建"无表头"的纯数据表格。

**原因**

Markdown 规范将分隔行后的第一行视为表头（Table Header）。

**替代方案**

- 这是 Markdown 本身的限制，并非插件特有
- 如需无表头表格，可以考虑其他格式（如 CSV）

---

### 6. 无配置选项

**现象**

无法通过配置文件调整：
- 最小/最大列宽
- 禁用特定功能
- 自定义缓存策略

**原因**

当前版本（v0.0.3）未提供配置接口，所有参数硬编码在源码中。

::: tip 版本说明
当前插件版本为 v0.0.3（package.json 声明）。CHANGELOG.md 中记录的 v0.1.0 是未来的版本规划，尚未发布。
:::

**源码依据**

```typescript
// index.ts:115 - 列最小宽度硬编码为 3
const colWidths: number[] = Array(colCount).fill(3)

// index.ts:222 - 缓存阈值硬编码
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**未来规划**

CHANGELOG 中提到了未来可能的支持：
> Configuration options (min/max column width, disable features)

---

### 7. 超大表格性能未验证

**现象**

对于 100+ 行的表格，格式化可能较慢，或占用较多内存。

**原因**

插件使用逐行扫描和缓存机制，理论上能处理大表格，但未进行专门的性能优化。

**源码依据**

```typescript
// index.ts:5-7
const widthCache = new Map<string, number>()
let cacheOperationCount = 0

// 缓存会在 100 次操作或 1000 条目后清空
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**建议**

- 对于超大表格，建议拆分成多个小表格
- 或者等待未来的性能优化版本

---

## 检查点

完成本课后，你应该能回答：

- [ ] 插件支持哪些表格格式？（答：只支持 Markdown 管道表格）
- [ ] 为什么不能格式化多行单元格？（答：插件逐行处理，没有合并逻辑）
- [ ] 分隔行的作用是什么？（答：定义列数和对齐方式，必需）
- [ ] 能否自定义列宽？（答：当前版本不支持）

---

## 踩坑提醒

::: warning 常见错误

**错误 1**：期望 HTML 表格被格式化

插件只处理 Markdown 管道表格，HTML 表格需要手动格式化或使用其他工具。

**错误 2**：表格没有分隔行

分隔行是 Markdown 表格的必需部分，缺少会导致"无效结构"错误。

**错误 3**：单元格内容太长，导致表格过宽

插件没有最大列宽限制，如果单元格内容过长，整个表格会变得很宽。建议手动换行或精简内容。

:::

---

## 本课小结

| 限制 | 原因 | 替代方案 |
| --- | --- | --- |
| HTML 表格不支持 | 插件专注 Markdown 管道表格 | 使用 HTML 格式化工具 |
| 多行单元格不支持 | 逐行处理逻辑 | 拆分成多行或接受变宽 |
| 无分隔行不支持 | Markdown 规范要求 | 添加 `|---|` 分隔行 |
| 无配置选项 | 当前版本未实现 | 等待未来版本更新 |

## 下一课预告

> 下一课我们学习 **[技术细节](../tech-details/)**。
>
> 你会学到：
> - 插件的缓存机制如何工作
> - 性能优化策略
> - 为什么缓存会在 100 次操作后清空

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 限制 | 文件路径 | 行号 |
| --- | --- | --- |
| HTML 表格检测 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| 分隔行检测 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| 表格验证（必须包含分隔行） | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| 列最小宽度硬编码 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L115) | 115 |
| 缓存阈值硬编码 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L222-L224) | 222-224 |

**关键函数**：
- `isTableRow()`：检测是否为 Markdown 管道表格行
- `isSeparatorRow()`：检测分隔行
- `isValidTable()`：验证表格结构有效性

**关键常量**：
- `colWidths 最小宽度 = 3`：列的最小显示宽度
- `缓存阈值 = 100 次操作或 1000 条目`：触发缓存清理的条件

**CHANGELOG 参考**：
- 已知限制章节：[`CHANGELOG.md`](https://github.com/franlol/opencode-md-table-formatter/blob/main/CHANGELOG.md#L31-L36) 第 31-36 行

</details>
