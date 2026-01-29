---
title: "表格规范: 格式化条件 | opencode-md-table-formatter"
sidebarTitle: "解决 invalid structure 错误"
subtitle: "表格规范：什么样的表格能被格式化"
description: "学习 Markdown 表格的 4 个有效条件。掌握行首行尾管道符、分隔行语法、列数一致性，解决 invalid structure 错误。"
tags:
  - "表格验证"
  - "分隔行"
  - "列数一致"
  - "对齐语法"
prerequisite:
  - "start-features"
order: 40
---

# 表格规范：什么样的表格能被格式化

::: info 学完你能做什么
- 知道什么样的表格能被插件格式化
- 理解 `invalid structure` 错误的原因
- 写出符合规范的 Markdown 表格
:::

## 你现在的困境

AI 生成了一个表格，但插件没有格式化，还在末尾加了一句：

```markdown
<!-- table not formatted: invalid structure -->
```

什么是"无效结构"？为什么我的表格不行？

## 什么时候用这一招

- 遇到 `invalid structure` 错误，想知道哪里出了问题
- 想确保 AI 生成的表格能被正确格式化
- 想手写一个符合规范的 Markdown 表格

## 核心思路

插件在格式化前会做三层验证：

```
第 1 层：是不是表格行？ → isTableRow()
第 2 层：有没有分隔行？ → isSeparatorRow()
第 3 层：结构是否有效？ → isValidTable()
```

只有三层都通过，才会格式化。任何一层失败，就保留原样并添加错误注释。

## 有效表格的 4 个条件

### 条件 1：每行必须以 `|` 开头和结尾

这是最基本的要求。Markdown 管道表格（Pipe Table）的每一行都必须用 `|` 包裹。

```markdown
✅ 正确
| 名称 | 描述 |

❌ 错误
名称 | 描述      ← 没有开头的 |
| 名称 | 描述     ← 没有结尾的 |
```

::: details 源码实现
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
源码位置：`index.ts:58-61`
:::

### 条件 2：每行至少有 2 个分隔符

`split("|").length > 2` 意味着至少要有 2 个 `|` 把内容分开。

```markdown
✅ 正确（3 个 |，2 个分隔符）
| 名称 | 描述 |

❌ 错误（只有 2 个 |，1 个分隔符）
| 名称 |
```

换句话说，**单列表格是有效的**，但必须写成 `| 内容 |` 的形式。

### 条件 3：必须有分隔行

分隔行是表头和数据行之间的那一行，用来定义对齐方式。

```markdown
| 名称 | 描述 |
| --- | --- |      ← 这就是分隔行
| 值1 | 值2 |
```

**分隔行的语法规则**：

每个单元格必须匹配正则 `/^\s*:?-+:?\s*$/`，翻译成人话就是：

| 组成部分 | 含义 | 示例 |
| --- | --- | --- |
| `\s*` | 可选的空白 | 允许 `| --- |` 或 `|---|` |
| `:?` | 可选的冒号 | 用于指定对齐方式 |
| `-+` | 至少一个短横线 | `-`、`---`、`------` 都行 |

**有效的分隔行示例**：

```markdown
| --- | --- |           ← 最简形式
| :--- | ---: |         ← 带对齐标记
| :---: | :---: |       ← 居中对齐
|---|---|               ← 无空格也行
| -------- | -------- | ← 长短横线也行
```

**无效的分隔行示例**：

```markdown
| === | === |           ← 用了等号，不是短横线
| - - | - - |           ← 短横线中间有空格
| ::: | ::: |           ← 只有冒号，没有短横线
```

::: details 源码实现
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
源码位置：`index.ts:63-68`
:::

### 条件 4：所有行的列数必须一致

如果第一行有 3 列，后面每一行都必须有 3 列。

```markdown
✅ 正确（每行都是 3 列）
| A | B | C |
| --- | --- | --- |
| 1 | 2 | 3 |

❌ 错误（第三行只有 2 列）
| A | B | C |
| --- | --- | --- |
| 1 | 2 |
```

::: details 源码实现
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
源码位置：`index.ts:70-88`
:::

## 对齐语法速查

分隔行不仅用于分隔，还用于指定对齐方式：

| 语法 | 对齐方式 | 效果 |
| --- | --- | --- |
| `---` 或 `:---` | 左对齐 | 文本靠左（默认） |
| `:---:` | 居中 | 文本居中 |
| `---:` | 右对齐 | 文本靠右 |

**示例**：

```markdown
| 左对齐 | 居中 | 右对齐 |
| :--- | :---: | ---: |
| 文本 | 文本 | 文本 |
```

格式化后：

```markdown
| 左对齐 |  居中  | 右对齐 |
| :----- | :----: | -----: |
| 文本   |  文本  |   文本 |
```

::: details 源码实现
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
源码位置：`index.ts:141-149`
:::

## 常见错误排查

| 错误现象 | 可能原因 | 解决方法 |
| --- | --- | --- |
| `invalid structure` | 缺少分隔行 | 在表头后添加 `\| --- \| --- \|` |
| `invalid structure` | 列数不一致 | 检查每行的 `\|` 数量是否相同 |
| `invalid structure` | 行首/行尾缺少 `\|` | 补上缺失的 `\|` |
| 表格没被检测到 | 只有 1 列 | 确保至少有 2 个 `\|` 分隔符 |
| 对齐不生效 | 分隔行语法错误 | 检查是否用了 `-` 而不是其他字符 |

## 检查点

完成本课后，你应该能回答：

- [ ] 表格行必须满足什么条件？（答：以 `|` 开头和结尾，至少 2 个分隔符）
- [ ] 分隔行的正则是什么意思？（答：可选冒号 + 至少一个短横线 + 可选冒号）
- [ ] 为什么会出现 `invalid structure`？（答：缺少分隔行、列数不一致、或行首/行尾缺少 `|`）
- [ ] `:---:` 表示什么对齐方式？（答：居中对齐）

## 本课小结

| 条件 | 要求 |
| --- | --- |
| 行首行尾 | 必须以 `\|` 开头和结尾 |
| 分隔符数量 | 至少 2 个 `\|` |
| 分隔行 | 必须有，格式为 `:?-+:?` |
| 列数一致 | 所有行的列数必须相同 |

**记忆口诀**：

> 管道包裹两边齐，分隔行里短横线，列数一致不能少，四条规则记心间。

## 下一课预告

> 下一课我们学习 **[对齐方式详解](../alignment/)**。
>
> 你会学到：
> - 三种对齐方式的详细用法
> - 分隔行格式化的实现原理
> - 单元格填充算法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 表格行判定 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| 分隔行判定 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| 表格验证 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| 对齐方式解析 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| 无效表格处理 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**关键正则**：
- `/^\s*:?-+:?\s*$/`：分隔行单元格匹配规则

**关键函数**：
- `isTableRow()`：判断是否为表格行
- `isSeparatorRow()`：判断是否为分隔行
- `isValidTable()`：验证表格结构是否有效
- `getAlignment()`：解析对齐方式

</details>
