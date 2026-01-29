---
title: "快速开始: 安装与配置 | opencode-md-table-formatter"
sidebarTitle: "1 分钟让表格对齐"
subtitle: "一分钟上手：安装与配置"
description: "学习 opencode-md-table-formatter 的安装配置方法。在 1 分钟内完成插件安装，通过配置文件让 AI 生成的表格自动对齐。"
tags:
  - "installation"
  - "configuration"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# 一分钟上手：安装与配置

::: info 学完你能做什么
- 在 OpenCode 中安装表格格式化插件
- 让 AI 生成的 Markdown 表格自动对齐
- 验证插件是否正常工作
:::

## 你现在的困境

AI 生成的 Markdown 表格经常是这样的：

```markdown
| 名称 | 描述 | 状态 |
|---|---|---|
| 功能A | 这是一个很长的描述文本 | 已完成 |
| B | 短 | 进行中 |
```

列宽参差不齐，看着难受。手动调整？太费时间了。

## 什么时候用这一招

- 你经常让 AI 生成表格（对比、清单、配置说明）
- 你希望表格在 OpenCode 里显示整齐
- 你不想每次都手动调整列宽

## 🎒 开始前的准备

::: warning 前置条件
- 已安装 OpenCode（版本 >= 1.0.137）
- 知道 `.opencode/opencode.jsonc` 配置文件在哪里
:::

## 跟我做

### 第 1 步：打开配置文件

**为什么**：插件通过配置文件声明，OpenCode 启动时会自动加载。

找到你的 OpenCode 配置文件：

::: code-group

```bash [macOS/Linux]
# 配置文件通常在项目根目录
ls -la .opencode/opencode.jsonc

# 或者在用户目录
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# 配置文件通常在项目根目录
Get-ChildItem .opencode\opencode.jsonc

# 或者在用户目录
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

用你喜欢的编辑器打开这个文件。

### 第 2 步：添加插件配置

**为什么**：告诉 OpenCode 加载表格格式化插件。

在配置文件中添加 `plugin` 字段：

```jsonc
{
  // ... 其他配置 ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip 已有其他插件？
如果你已经有 `plugin` 数组，把新插件加到数组里：

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // 加在这里
  ]
}
```
:::

**你应该看到**：配置文件保存成功，没有语法错误提示。

### 第 3 步：重启 OpenCode

**为什么**：插件在 OpenCode 启动时加载，修改配置后需要重启才能生效。

关闭当前的 OpenCode 会话，重新启动。

**你应该看到**：OpenCode 正常启动，没有报错。

### 第 4 步：验证插件生效

**为什么**：确认插件已正确加载并工作。

让 AI 生成一个表格，比如输入：

```
帮我生成一个表格，对比 React、Vue、Angular 三个框架的特点
```

**你应该看到**：AI 生成的表格列宽整齐，像这样：

```markdown
| 框架    | 特点                     | 学习曲线 |
| ------- | ------------------------ | -------- |
| React   | 组件化、虚拟 DOM         | 中等     |
| Vue     | 渐进式、双向绑定         | 较低     |
| Angular | 全功能框架、TypeScript   | 较高     |
```

## 检查点 ✅

完成上述步骤后，检查以下几点：

| 检查项                   | 预期结果                       |
| ------------------------ | ------------------------------ |
| 配置文件语法             | 无报错                         |
| OpenCode 启动            | 正常启动，无插件加载错误       |
| AI 生成表格              | 列宽自动对齐，分隔行格式统一   |

## 踩坑提醒

### 表格没有格式化？

1. **检查配置文件路径**：确保修改的是 OpenCode 实际读取的配置文件
2. **检查插件名称**：必须是 `@franlol/opencode-md-table-formatter@0.0.3`，注意 `@` 符号
3. **重启 OpenCode**：修改配置后必须重启

### 看到 "invalid structure" 注释？

这说明表格结构不符合 Markdown 规范。常见原因：

- 缺少分隔行（`|---|---|`）
- 各行列数不一致

详见 [常见问题](../../faq/troubleshooting/) 章节。

## 本课小结

- 插件通过 `.opencode/opencode.jsonc` 的 `plugin` 字段配置
- 版本号 `@0.0.3` 确保使用稳定版本
- 修改配置后需要重启 OpenCode
- 插件会自动格式化 AI 生成的所有 Markdown 表格

## 下一课预告

> 下一课我们学习 **[功能全览](../features/)**。
>
> 你会学到：
> - 插件的 8 大核心功能
> - 隐藏模式下的宽度计算原理
> - 哪些表格能格式化，哪些不能

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能           | 文件路径                                                                                     | 行号    |
| -------------- | -------------------------------------------------------------------------------------------- | ------- |
| 插件入口       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23    |
| 钩子注册       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L11-L13) | 11-13   |
| 包配置         | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41    |

**关键常量**：
- `@franlol/opencode-md-table-formatter@0.0.3`：npm 包名和版本
- `experimental.text.complete`：插件监听的钩子名称

**依赖要求**：
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>
