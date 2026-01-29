---
title: "故障排查: 表格格式化问题 | opencode-md-table-formatter"
sidebarTitle: "表格没格式化怎么办"
subtitle: "故障排查: 表格格式化问题"
description: "学习 opencode-md-table-formatter 插件的故障排查方法。快速定位表格不格式化、无效结构等常见问题，掌握配置检查和解决方案。"
tags:
  - "troubleshooting"
  - "常见问题"
prerequisite:
  - "start-getting-started"
order: 60
---

# 常见问题：表格没格式化怎么办

## 学完你能做什么

本课将帮你快速诊断和解决插件使用中的常见问题：

- 找出表格不格式化的原因
- 理解"无效表格结构"错误的含义
- 了解插件的已知限制和不适用的场景
- 快速验证配置是否正确

---

## 问题 1：表格没有自动格式化

### 症状

AI 生成了表格，但表格列宽不一致，没有对齐。

### 可能原因与解决方案

#### 原因 1：插件未配置

**检查步骤**：

1. 打开 `.opencode/opencode.jsonc` 文件
2. 确认插件是否在 `plugin` 数组中：

```jsonc
{
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

3. 如果没有，添加插件配置
4. **重启 OpenCode** 使配置生效

::: tip 配置格式
确保版本号和包名正确，使用 `@franlol/opencode-md-table-formatter` + `@` + 版本号的格式。
:::

#### 原因 2：OpenCode 未重启

**解决方案**：

添加插件后，必须完全重启 OpenCode（不是刷新页面），插件才会加载。

#### 原因 3：表格缺少分隔行

**症状示例**：

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

这种表格不会被格式化。

**解决方案**：

添加分隔行（第二行，用 `|---|` 格式）：

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

::: info 分隔行作用
分隔行是 Markdown 表格的标准语法，用于区分表头和内容行，也用于指定对齐方式。插件**必须**检测到分隔行才会格式化表格。
:::

#### 原因 4：OpenCode 版本过低

**检查步骤**：

1. 打开 OpenCode 帮助菜单
2. 查看当前版本号
3. 确认版本 >= 1.0.137

**解决方案**：

升级到最新版本的 OpenCode。

::: warning 版本要求
插件使用 `experimental.text.complete` 钩子，该 API 在 OpenCode 1.0.137+ 版本可用。
:::

---

## 问题 2：看到 "invalid structure" 注释

### 症状

表格末尾出现：

```markdown
<!-- table not formatted: invalid structure -->
```

### 什么是"无效表格结构"

插件会对每个 Markdown 表格进行验证，只有通过验证的表格才会被格式化。如果表格结构不符合规范，插件会保留原文并添加这条注释。

### 常见原因

#### 原因 1：表格行数不足

**错误示例**：

```markdown
| Name |
```

只有 1 行，格式不完整。

**正确示例**：

```markdown
| Name |
|---|
```

至少需要 2 行（包括分隔行）。

#### 原因 2：列数不一致

**错误示例**：

```markdown
| Name | Age |
|--- | ---|
| Alice |
```

第一行 2 列，第二行 1 列，列数不一致。

**正确示例**：

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
```

所有行的列数必须相同。

#### 原因 3：缺少分隔行

**错误示例**：

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

没有 `|---|---|` 这样的分隔行。

**正确示例**：

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

### 如何快速诊断

使用以下检查清单：

- [ ] 表格至少有 2 行
- [ ] 所有行的列数相同（数一下每行有几个 `|`）
- [ ] 存在分隔行（第二行通常是 `|---|` 格式）

如果以上都满足但仍然报错，请检查是否有隐藏字符或多余的空格导致列数计算错误。

---

## 问题 3：看到 "table formatting failed" 注释

### 症状

文本末尾出现：

```markdown
<!-- table formatting failed: {错误信息} -->
```

### 原因

这是插件内部抛出了未预期的异常。

### 解决方案

1. **查看错误信息**：注释中的 `{错误信息}` 部分会说明具体问题
2. **检查表格内容**：确认是否有极端特殊情况（如超长单行、特殊字符组合）
3. **保留原文**：即使失败，插件也不会破坏原文，你的内容是安全的
4. **报告问题**：如果问题反复出现，可以在 [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) 提交问题报告

::: tip 错误隔离
插件使用 try-catch 包裹格式化逻辑，即使出错也不会中断 OpenCode 的工作流。
:::

---

## 问题 4：某些表格类型不支持

### 不支持的表格类型

#### HTML 表格

**不支持**：

```html
<table>
  <tr><th>Name</th></tr>
  <tr><td>Alice</td></tr>
</table>
```

**只支持**：Markdown 管道表格（Pipe Table）

#### 多行单元格

**不支持**：

```markdown
| Name | Description |
|--- | ---|
| Alice | Line 1<br>Line 2 |
```

::: info 为什么不支持
插件设计用于 AI 生成的简单表格，多行单元格需要更复杂的布局逻辑。
:::

#### 无分隔行的表格

**不支持**：

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

必须有分隔行（见上文"原因 3"）。

---

## 问题 5：表格格式化后仍然不对齐

### 可能原因

#### 原因 1：隐藏模式未启用

插件是为 OpenCode 的隐藏模式（Concealment Mode）优化的，该模式会隐藏 Markdown 符号（如 `**`、`*`）。

如果你的编辑器没有启用隐藏模式，表格看起来可能会"不对齐"，因为 Markdown 符号占用了实际宽度。

**解决方案**：

确认 OpenCode 隐藏模式已启用（默认启用）。

#### 原因 2：单元格内容超长

如果某个单元格内容非常长，表格可能会拉伸得很宽。

这是正常行为，插件不会截断内容。

#### 原因 3：行内代码中的符号

行内代码（`` `**code**` ``）中的 Markdown 符号会**按字面宽度**计算，不会被剥离。

**示例**：

```
| 符号 | 宽度 |
|--- | ---|
| 普通文本 | 4 |
| `**bold**` | 8 |
```

这是正确行为，因为隐藏模式下代码块内的符号是可见的。

---

## 本课小结

通过本课，你学会了：

- **诊断表格不格式化**：检查配置、重启、版本要求、分隔行
- **理解无效表格错误**：行数、列数、分隔行验证
- **识别已知限制**：HTML 表格、多行单元格、无分隔行表格不支持
- **快速自检**：使用检查清单验证表格结构

---

## 还没解决？

如果以上问题都排查了但问题仍然存在：

1. **查看完整日志**：插件默认静默运行，没有详细日志
2. **提交 Issue**：在 [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) 提供你的表格示例和错误信息
3. **参考进阶课程**：阅读 [表格规范](../../advanced/table-spec/) 和 [隐藏模式原理](../../advanced/concealment-mode/) 了解更多技术细节

---

## 下一课预告

> 下一课我们学习 **[已知限制：插件的边界在哪里](../../appendix/limitations/)**。
>
> 你会学到：
> - 插件的设计边界和约束
> - 未来可能的增强功能
> - 如何判断一个场景是否适合使用本插件

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能            | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| 表格验证逻辑    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88)     | 70-88   |
| 表格行检测      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61)     | 58-61   |
| 分隔行检测      | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68)     | 63-68   |
| 错误处理        | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L15-L20)     | 15-20   |
| 无效表格注释    | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47)     | 44-47   |

**关键业务规则**：
- `isValidTable()`：验证表格必须至少 2 行、所有行列数一致、存在分隔行（第 70-88 行）
- `isSeparatorRow()`：使用正则 `/^\s*:?-+:?\s*$/` 检测分隔行（第 63-68 行）
- 列最小宽度：3 字符（第 115 行）

**错误处理机制**：
- try-catch 包裹主处理函数（第 15-20 行）
- 格式化失败：保留原文 + 添加 `<!-- table formatting failed: {message} -->` 注释
- 验证失败：保留原文 + 添加 `<!-- table not formatted: invalid structure -->` 注释

</details>
