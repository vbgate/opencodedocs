---
title: "多语言: 中英文自动切换 | opencode-mystatus"
sidebarTitle: "多语言"
subtitle: "多语言: 中英文自动切换"
description: "学习 opencode-mystatus 的多语言支持机制。掌握语言检测原理，包括 Intl API 和环境变量回退，以及输出语言切换方法。"
tags:
  - "i18n"
  - "internationalization"
  - "language-detection"
  - "multi-language"
prerequisite:
  - "start-quick-start"
order: 3
---

# 多语言支持：中文和英文自动切换

## 学完你能做什么

- 了解 mystatus 如何自动检测系统语言
- 知道如何切换系统语言来改变输出语言
- 理解语言检测的优先级和回退机制
- 掌握 Intl API 和环境变量的工作原理

## 你现在的困境

你可能注意到 mystatus 的**多语言支持**有时候是中文，有时候是英文：

```
# 中文输出
3小时限额
█████████████████████████████ 剩余 85%
重置: 2小时30分钟后

# 英文输出
3-hour limit
█████████████████████████████ 85% remaining
Resets in: 2h 30m
```

但你不知道：
- 插件是怎么知道该用哪种语言的？
- 能不能手动切换到中文或英文？
- 如果检测错了怎么办？

本课帮你搞清楚语言检测的机制。

## 核心思路

**多语言支持**根据系统语言环境自动选择中文或英文输出，无需手动配置。检测优先级为：Intl API → 环境变量 → 默认英文。

**检测优先级**（从高到低）：

1. **Intl API**（推荐）→ `Intl.DateTimeFormat().resolvedOptions().locale`
2. **环境变量**（回退）→ `LANG`、`LC_ALL`、`LANGUAGE`
3. **默认英文**（兜底）→ `"en"`

::: tip 为什么不需要手动配置？
因为语言检测基于系统环境，插件在启动时自动识别，用户无需修改任何配置文件。
:::

**支持的语言**：
| 语言 | 代码 | 检测条件 |
| ---- | ---- | -------- |
| 中文 | `zh` | locale 以 `zh` 开头（如 `zh-CN`、`zh-TW`） |
| 英文 | `en` | 其他情况 |

**翻译内容覆盖**：
- 时间单位（天、小时、分钟）
- 限额相关（剩余百分比、重置时间）
- 错误信息（认证失败、API 错误、超时）
- 平台标题（OpenAI、智谱 AI、Z.ai、Google Cloud、GitHub Copilot）

## 跟我做

### 第 1 步：查看当前系统语言

首先确认你的系统语言设置：

::: code-group

```bash [macOS/Linux]
echo $LANG
```

```powershell [Windows]
Get-ChildItem Env:LANG
```

:::

**你应该看到**：

- 中文系统：`zh_CN.UTF-8`、`zh_TW.UTF-8` 或类似
- 英文系统：`en_US.UTF-8`、`en_GB.UTF-8` 或类似

### 第 2 步：测试语言检测

执行 `/mystatus` 命令，观察输出语言：

```
/mystatus
```

**你应该看到**：

- 如果系统语言是中文 → 输出为中文（如 `3小时限额`、`重置: 2小时30分钟后`）
- 如果系统语言是英文 → 输出为英文（如 `3-hour limit`、`Resets in: 2h 30m`）

### 第 3 步：临时切换系统语言（测试用）

如果你想测试不同语言的输出效果，可以临时修改环境变量：

::: code-group

```bash [macOS/Linux (临时切换为英文)]
LANG=en_US.UTF-8 /mystatus
```

```powershell [Windows (临时切换为英文)]
$env:LANG="en_US.UTF-8"; /mystatus
```

:::

**你应该看到**：

即使你的系统是中文，输出也会变成英文格式。

::: warning
这只是临时测试，不会永久改变系统语言。关闭终端后恢复原设置。
:::

### 第 4 步：理解 Intl API 检测机制

Intl API 是浏览器和 Node.js 提供的国际化标准接口。插件会优先使用它检测语言：

**检测代码**（简化版）：

```javascript
// 1. 优先使用 Intl API
const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
if (intlLocale.startsWith("zh")) {
  return "zh";  // 中文
}

// 2. 回退到环境变量
const lang = process.env.LANG || process.env.LC_ALL || "";
if (lang.startsWith("zh")) {
  return "zh";
}

// 3. 默认英文
return "en";
```

**Intl API 的优势**：
- 更可靠，基于系统实际设置
- 支持浏览器和 Node.js 环境
- 提供完整的 locale 信息（如 `zh-CN`、`en-US`）

**环境变量作为回退**：
- 兼容不支持 Intl API 的环境
- 提供手动控制语言的方式（通过修改环境变量）

### 第 5 步：永久切换系统语言（如需）

如果你希望 mystatus 始终使用某种语言，可以修改系统语言设置：

::: info
修改系统语言会影响所有应用程序，不仅仅是 mystatus。
:::

**macOS**：
1. 打开「系统设置」→「通用」→「语言与地区」
2. 添加所需语言并拖到最上方
3. 重启 OpenCode

**Linux**：
```bash
# 修改 ~/.bashrc 或 ~/.zshrc
export LANG=zh_CN.UTF-8

# 重新加载配置
source ~/.bashrc
```

**Windows**：
1. 打开「设置」→「时间和语言」→「语言和区域」
2. 添加所需语言并设为默认
3. 重启 OpenCode

## 检查点 ✅

验证语言检测是否正确：

| 测试项 | 操作 | 预期结果 |
| ------ | ---- | -------- |
| 中文系统 | 执行 `/mystatus` | 输出为中文（如 `3小时限额`） |
| 英文系统 | 执行 `/mystatus` | 输出为英文（如 `3-hour limit`） |
| 临时切换 | 修改 `LANG` 环境变量后执行命令 | 输出语言随之改变 |

## 踩坑提醒

### 常见问题

| 问题 | 原因 | 解决方法 |
| ---- | ---- | -------- |
| 输出语言不符合预期 | 系统语言设置错误 | 检查 `LANG` 环境变量或系统语言设置 |
| Intl API 不可用 | Node.js 版本过低或环境不支持 | 插件会自动回退到环境变量检测 |
| 中文系统显示英文 | 环境变量 `LANG` 未设置为 `zh_*` | 设置正确的 `LANG` 值（如 `zh_CN.UTF-8`） |

### 检测逻辑说明

**何时使用 Intl API**：
- Node.js ≥ 0.12（支持 Intl API）
- 浏览器环境（所有现代浏览器）

**何时回退到环境变量**：
- Intl API 抛出异常
- 环境不支持 Intl API

**何时使用默认英文**：
- 环境变量未设置
- 环境变量不以 `zh` 开头

::: tip
插件在模块加载时**只检测一次**语言。修改系统语言后需要重启 OpenCode 才能生效。
:::

## 本课小结

- **自动检测**：mystatus 自动检测系统语言，无需手动配置
- **检测优先级**：Intl API → 环境变量 → 默认英文
- **支持语言**：中文（zh）和英文（en）
- **翻译覆盖**：时间单位、限额相关、错误信息、平台标题
- **切换语言**：修改系统语言设置，重启 OpenCode

## 下一课预告

> 下一课我们学习 **[常见问题：无法查询额度、Token 过期、权限问题](../../faq/troubleshooting/)**。
>
> 你会学到：
> - 如何排查无法读取认证文件的问题
> - Token 过期时的解决方法
> - 权限不足时的配置建议

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 语言检测函数 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |
| 中文翻译定义 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L46-L124) | 46-124 |
| 英文翻译定义 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L125-L203) | 125-203 |
| 当前语言导出 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L210) | 210 |
| 翻译函数导出 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L213) | 213 |

**关键函数**：
- `detectLanguage()`: 检测用户系统语言，优先使用 Intl API，回退到环境变量，默认英文
- `currentLang`: 当前语言（模块加载时检测一次）
- `t`: 翻译函数，根据当前语言返回对应的翻译内容

**关键常量**：
- `translations`: 翻译字典，包含 `zh` 和 `en` 两个语言包
- 支持的翻译类型：时间单位（days、hours、minutes）、限额相关（hourLimit、dayLimit、remaining、resetIn）、错误信息（authError、apiError、timeoutError）、平台标题（openaiTitle、zhipuTitle、googleTitle、copilotTitle）

**检测逻辑**：
1. 优先使用 `Intl.DateTimeFormat().resolvedOptions().locale` 检测语言
2. 如果 Intl API 不可用，回退到环境变量 `LANG`、`LC_ALL`、`LANGUAGE`
3. 如果环境变量也不存在或不以 `zh` 开头，默认英文

</details>
