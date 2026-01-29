---
title: "对齐方式: Markdown 表格布局 | opencode-md-table-formatter"
subtitle: "对齐方式: Markdown 表格布局 | opencode-md-table-formatter"
sidebarTitle: "让表格对齐更美观"
description: "学习 Markdown 表格的三种对齐方式和分隔行语法。掌握对齐算法实现，让 AI 生成的表格在不同对齐方式下都能美观整齐。"
tags:
  - "左对齐"
  - "居中对齐"
  - "右对齐"
  - "分隔行语法"
prerequisite:
  - "advanced-table-spec"
order: 50
---

# 对齐方式详解：左对齐、居中、右对齐

::: info 学完你能做什么
- 掌握三种对齐方式的语法和效果
- 理解分隔行如何指定对齐方式
- 了解单元格填充算法的工作原理
- 知道为什么分隔行会自动调整宽度
:::

## 你现在的困境

AI 生成了一个表格，但列对齐不太美观：

```markdown
| 名称 | 类型 | 描述 |
|--- | --- | ---|
| 用户 | string | 用户名 |
| 年龄 | number | 年龄 |
| is_active | boolean | 是否激活 |
```

你想让某些列居中或右对齐，让表格更易读，但不知道怎么指定。

## 什么时候用这一招

- 想让表格的某些列居中（如状态、标签）
- 想让数字列右对齐（便于比较大小）
- 想让文本列左对齐（默认行为）
- 想了解对齐的实现原理

## 核心思路：分隔行决定对齐方式

Markdown 表格的对齐方式不是写在每一行的，而是通过**分隔行**统一指定。

分隔行的语法是：`:?-+:?`（冒号 + 短横线 + 冒号）

| 冒号位置 | 对齐方式 | 示例 |
|--- | --- | ---|
| 左右都有 | 居中 | `:---:` |
| 只有右边 | 右对齐 | `---:` |
| 都没有 | 左对齐 | `---` 或 `:---` |

分隔行的每个单元格对应一列的对齐方式，插件会按这个规则格式化整列。

## 跟我做：三种对齐方式

### 第 1 步：左对齐（默认）

**为什么**

左对齐是表格的默认行为，适合文本类数据。

**语法**

```markdown
| 名称 | 描述 |
| :--- | :--- |    ← 左边有冒号或没有冒号都是左对齐
| 用户 | 用户名 |
```

**你应该看到**

```markdown
| 名称   | 描述   |
|--- | ---|
| 用户   | 用户名 |
```

分隔行会显示为 `:---`（左对齐标记），文本靠左对齐。

**源码实现**

```typescript
// getAlignment 函数：解析对齐方式
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"  // 默认返回 left
}
```

源码位置：`index.ts:141-149`

**逻辑解释**

- 左右都有冒号（`:---:`）→ 返回 `"center"`
- 只有右边有冒号（`---:`）→ 返回 `"right"`
- 其他情况（`---` 或 `:---`）→ 返回 `"left"`（默认）

### 第 2 步：居中对齐

**为什么**

居中适合状态标签、短文本、标题等需要视觉居中的内容。

**语法**

```markdown
| 名称 | 状态 | 描述 |
|--- | --- | --- | ---|
| 用户 | 激活 | 用户名 |
```

**你应该看到**

```markdown
| 名称   |  状态  | 描述   |
|--- | --- | ---|
| 用户   |  激活  | 用户名 |
```

中间列的"激活"会居中显示，分隔行会显示为 `:---:`（居中标记）。

**分隔行格式化原理**

分隔行单元格的格式化由 `formatSeparatorCell` 函数处理：

```typescript
function formatSeparatorCell(width: number, align: "left" | "center" | "right"): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":"
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":"
  return "-".repeat(width)
}
```

源码位置：`index.ts:213-217`

**居中对齐的数学原理**

居中的分隔行格式是：`:` + 短横线 + `:`

| 目标宽度 | 计算公式 | 结果 |
|--- | --- | ---|
| 3 | `:` + ` `-`*1 ` + `:` | `:-:` |
| 5 | `:` + `-`*3 + `:` | `:---:` |
| 10 | `:` + `-`*8 + `:` | `:--------:` |

`Math.max(1, width - 2)` 确保至少保留 1 个短横线，避免宽度为 2 时变成 `::`（没有分隔效果）。

### 第 3 步：右对齐

**为什么**

右对齐适合数字、金额、日期等需要从右向左比较的数据。

**语法**

```markdown
| 名称 | 价格 | 数量 |
| :--- | ---: | ---: |    ← 右边有冒号表示右对齐
| 商品 | 99.9 | 100 |
```

**你应该看到**

```markdown
| 名称   | 价格 | 数量 |
|--- | --- | ---|
| 商品   |  99.9 |  100 |
```

数字靠右对齐，方便比较大小。

**右对齐的数学原理**

右对齐的分隔行格式是：短横线 + `:`

| 目标宽度 | 计算公式 | 结果 |
|--- | --- | ---|
| 3 | `-`*2 + `:` | `--:` |
| 5 | `-`*4 + `:` | `----:` |
| 10 | `-`*9 + `:` | `---------:` |

`Math.max(1, width - 1)` 确保至少保留 1 个短横线。

## 单元格填充算法

插件如何决定单元格两边要填多少空格？答案在 `padCell` 函数。

**源码实现**

```typescript
function padCell(text: string, width: number, align: "left" | "center" | "right"): string {
  const displayWidth = calculateDisplayWidth(text)  // 计算显示宽度
  const totalPadding = Math.max(0, width - displayWidth)

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2)
    const rightPad = totalPadding - leftPad
    return " ".repeat(leftPad) + text + " ".repeat(rightPad)
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text
  } else {
    return text + " ".repeat(totalPadding)
  }
}
```

源码位置：`index.ts:198-211`

**填充规则**

| 对齐方式 | 左填充 | 右填充 | 示例（目标宽度 10，文本 "abc"） |
|--- | --- | --- | ---|
| 左对齐 | 0 | totalPadding | `abc       ` |
| 居中 | floor(total/2) | total - floor(total/2) | `   abc    ` |
| 右对齐 | totalPadding | 0 | `       abc` |

**居中对齐的数学细节**

`Math.floor(totalPadding / 2)` 确保左填充是整数，多余的空间加到右边。

| 目标宽度 | 文本宽度 | totalPadding | 左填充 | 右填充 | 结果 |
|--- | --- | --- | --- | --- | ---|
| 10 | 3 | 7 | 3 (7÷2=3.5→3) | 4 (7-3) | `   abc    ` |
| 11 | 3 | 8 | 4 (8÷2=4) | 4 (8-4) | `    abc    ` |
| 12 | 3 | 9 | 4 (9÷2=4.5→4) | 5 (9-4) | `    abc     ` |

## 完整示例

**输入表格**（指定不同列的对齐方式）：

```markdown
| 名称 | 状态 | 价格 | 描述 |
|--- | --- | --- | ---|
| 商品A | 激活 | 99.9 | 这是一个商品 |
| 商品B | 停用 | 199.0 | 这是另一个商品 |
```

**格式化结果**：

```markdown
| 名称   |  状态  | 价格 | 描述         |
|--- | --- | --- | ---|
| 商品A  |  激活  |  99.9 | 这是一个商品 |
| 商品B  |  停用  | 199.0 | 这是另一个商品 |
```

**每一列的对齐方式**：

| 列名 | 分隔行语法 | 对齐方式 | 说明 |
|--- | --- | --- | ---|
| 名称 | `:---` | 左对齐 | 文本靠左 |
| 状态 | `:---:` | 居中 | 文本居中 |
| 价格 | `---:` | 右对齐 | 数字靠右 |
| 描述 | `:---` | 左对齐 | 文本靠左 |

## 检查点

完成本课后，你应该能回答：

- [ ] 如何指定居中对齐？（答：分隔行用 `:---:`）
- [ ] 如何指定右对齐？（答：分隔行用 `---:`）
- [ ] 左对齐的默认语法是什么？（答：`---` 或 `:---`）
- [ ] 为什么居中对齐用 `Math.floor(totalPadding / 2)`？（答：确保左填充为整数，多余空间加到右边）
- [ ] 分隔行的 `:---:` 表示什么？（答：居中对齐标记，左右各一个冒号，中间是短横线）

## 踩坑提醒

::: warning 常见误解
**误解**：每一行都要指定对齐方式

**事实**：不需要。只有分隔行指定对齐方式，数据行会自动按列对齐。

分隔行是"配置"，数据行是"内容"，配置一行就够了。
:::

::: danger 切记
分隔行的冒号位置**必须**与列对应。

| 错误示例 | 问题 |
|--- | ---|
| `| :--- | --- |` | 第一列居中，第二列左对齐（2 列） |
| `| :--- | ---: | :--- |` | 第一列左对齐，第二列右对齐，第三列左对齐（3 列） |

分隔行的列数必须与表头和数据行的列数一致！
:::

## 本课小结

| 对齐方式 | 分隔行语法 | 适用场景 |
|--- | --- | ---|
| 左对齐 | `---` 或 `:---` | 文本、描述类数据（默认） |
| 居中 | `:---:` | 状态标签、短文本、标题 |
| 右对齐 | `---:` | 数字、金额、日期 |

**关键函数**：

| 函数 | 作用 | 源码位置 |
|--- | --- | ---|
| `getAlignment()` | 解析分隔行单元格的对齐方式 | 141-149 |
| `padCell()` | 填充单元格到指定宽度 | 198-211 |
| `formatSeparatorCell()` | 格式化分隔行单元格 | 213-217 |

**记忆口诀**：

> 左右冒号居中放，右边冒号靠右对齐，
> 没有冒号默认左，分隔行里定规矩。

## 下一课预告

> 下一课我们学习 **[常见问题：表格没格式化怎么办](../../faq/troubleshooting/)**。
>
> 你会学到：
> - 如何快速定位 `invalid structure` 错误
> - 配置错误的排查方法
> - 常见表格问题的解决方案

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 对齐方式解析 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| 单元格填充 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L198-L211) | 198-211 |
| 分隔行格式化 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L213-L217) | 213-217 |
| 对齐方式应用 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L107-L113) | 107-113 |

**关键函数**：
- `getAlignment(delimiterCell: string)`：解析分隔行单元格的对齐方式
  - 返回 `"left"` | `"center"` | `"right"`
  - 逻辑：左右都有冒号 → 居中，只有右边有冒号 → 右对齐，其他 → 左对齐

- `padCell(text, width, align)`：填充单元格到指定宽度
  - 计算显示宽度与目标宽度的差值
  - 根据对齐方式分配左右填充
  - 居中用 `Math.floor(totalPadding / 2)` 确保左填充为整数

- `formatSeparatorCell(width, align)`：格式化分隔行单元格
  - 居中：`:` + `-`*(width-2) + `:`
  - 右对齐：`-`*(width-1) + `:`
  - 左对齐：`-`*width
  - 使用 `Math.max(1, ...)` 确保至少保留 1 个短横线

</details>
