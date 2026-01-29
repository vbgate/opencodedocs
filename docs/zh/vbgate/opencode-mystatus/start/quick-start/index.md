---
title: "快速开始: 查询 AI 额度 | opencode-mystatus"
sidebarTitle: "快速开始"
subtitle: "快速开始：一键查询所有 AI 平台额度"
description: "学习 opencode-mystatus 的安装方法。5 分钟内完成插件安装，通过斜杠命令一键查询多平台 AI 额度。"
tags:
  - "快速开始"
  - "安装"
  - "配置"
order: 1
---

# 快速开始：一键查询所有 AI 平台额度

## 学完你能做什么

- 在 5 分钟内完成 opencode-mystatus 插件安装
- 配置斜杠命令 `/mystatus`
- 验证安装成功，查询第一个 AI 平台额度

## 你现在的困境

你在使用多个 AI 平台开发（OpenAI、智谱 AI、GitHub Copilot、Google Cloud 等），每天都需要频繁检查各平台剩余额度。每次都要逐个登录各平台查看，太浪费时间了。

## 什么时候用这一招

- **刚接触 OpenCode 时**：作为新手，第一个安装的插件
- **需要多平台额度管理时**：同时使用 OpenAI、智谱 AI、GitHub Copilot 等多个平台
- **团队协作场景**：团队成员共用多个 AI 账号，需要统一查看额度

## 🎒 开始前的准备

在开始之前，请确认你已经：

::: info 前置条件

- [ ] 已安装 [OpenCode](https://opencode.ai)
- [ ] 已配置至少一个 AI 平台的认证信息（OpenAI、智谱 AI、Z.ai、GitHub Copilot 或 Google Cloud）

:::

如果你还没有配置任何 AI 平台，建议先在 OpenCode 中完成至少一个平台的登录，然后再安装此插件。

## 核心思路

opencode-mystatus 是一个 OpenCode 插件，它的核心价值是：

1. **自动读取认证文件**：从 OpenCode 的官方认证存储中读取所有已配置的账号信息
2. **并行查询各平台**：同时调用 OpenAI、智谱 AI、Z.ai、GitHub Copilot 和 Google Cloud 的官方 API
3. **可视化展示**：用进度条和倒计时直观显示剩余额度

安装流程很简单：
1. 在 OpenCode 配置文件中添加插件和斜杠命令
2. 重启 OpenCode
3. 输入 `/mystatus` 查询额度

## 跟我做

### 第 1 步：选择安装方式

opencode-mystatus 提供三种安装方式，根据你的习惯选择一种即可：

::: code-group

```bash [让 AI 帮你安装（推荐）]
将以下内容粘贴到任意 AI 代理（Claude Code、OpenCode、Cursor 等）：

Install opencode-mystatus plugin by following: https://raw.githubusercontent.com/vbgate/opencode-mystatus/main/README.md
```

```bash [手动安装]
打开 ~/.config/opencode/opencode.json，按第 2 步编辑配置
```

```bash [从本地文件安装]
复制插件文件到 ~/.config/opencode/plugin/ 目录（详见第 4 步）
```

:::

**为什么推荐让 AI 安装**：AI 代理会自动执行所有配置步骤，你只需要确认即可，最快最省事。

---

### 第 2 步：手动安装配置（手动安装必选）

如果你选择手动安装，需要编辑 OpenCode 配置文件。

#### 2.1 打开配置文件

```bash
# macOS/Linux
code ~/.config/opencode/opencode.json

# Windows
code %APPDATA%\opencode\opencode.json
```

#### 2.2 添加插件和斜杠命令

在配置文件中添加以下内容（保持原有的 `plugin` 和 `command` 配置，追加新的配置项）：

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**为什么这样配置**：

| 配置项        | 值                                      | 作用                                 |
| ------------- | --------------------------------------- | ------------------------------------ |
| `plugin` 数组 | `["opencode-mystatus"]`                 | 告诉 OpenCode 加载这个插件           |
| `description` | "Query quota usage for all AI accounts" | 斜杠命令列表中显示的说明             |
| `template`    | "Use the mystatus tool..."              | 提示 OpenCode 如何调用 mystatus 工具 |

**你应该看到**：配置文件包含完整的 `plugin` 和 `command` 字段，格式正确（注意 JSON 的逗号和引号）。

---

### 第 3 步：从本地文件安装（本地安装必选）

如果你选择从本地文件安装，需要手动复制插件文件。

#### 3.1 复制插件文件

```bash
# 假设你已经克隆了 opencode-mystatus 源码到 ~/opencode-mystatus/

# 复制主插件和库文件
cp -r ~/opencode-mystatus/plugin/mystatus.ts ~/.config/opencode/plugin/
cp -r ~/opencode-mystatus/plugin/lib/ ~/.config/opencode/plugin/

# 复制斜杠命令配置
cp ~/opencode-mystatus/command/mystatus.md ~/.config/opencode/command/
```

**为什么需要复制这些文件**：

- `mystatus.ts`：插件主入口文件，包含 mystatus 工具的定义
- `lib/` 目录：包含 OpenAI、智谱 AI、Z.ai、GitHub Copilot 和 Google Cloud 的查询逻辑
- `mystatus.md`：斜杠命令的配置描述

**你应该看到**：`~/.config/opencode/plugin/` 目录下有 `mystatus.ts` 和 `lib/` 子目录，`~/.config/opencode/command/` 目录下有 `mystatus.md`。

---

### 第 4 步：重启 OpenCode

无论你选择哪种安装方式，最后一步都是重启 OpenCode。

**为什么必须重启**：OpenCode 只在启动时读取配置文件，修改配置后需要重启才能生效。

**你应该看到**：OpenCode 重新启动后，可以正常使用。

---

### 第 5 步：验证安装

现在验证安装是否成功。

#### 5.1 测试斜杠命令

在 OpenCode 中输入：

```bash
/mystatus
```

**你应该看到**：

如果已配置至少一个 AI 平台的认证信息，会看到类似这样的输出（以 OpenAI 为例）：

::: code-group

```markdown [中文系统输出]
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
██████████████████████████ 剩余 85%
重置: 2h 30m后
```

```markdown [英文系统输出]
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
██████████████████████████ 85% remaining
Resets in: 2h 30m
```

:::

::: tip 输出语言说明
插件会自动检测你的系统语言（中文系统显示中文，英文系统显示英文），以上两种输出都是正确的。
:::

如果还没有配置任何账号，会看到：

::: code-group

```markdown [中文系统输出]
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

```markdown [英文系统输出]
No configured accounts found.

Supported account types:
- OpenAI (Plus/Team/Pro subscribers)
- Zhipu AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

:::

#### 5.2 理解输出含义

| 元素（中文版本）          | 元素（英文版本）          | 含义                   |
| ------------------------- | ------------------------- | ---------------------- |
| `## OpenAI 账号额度`      | `## OpenAI Account Quota` | 平台标题               |
| `user@example.com (team)` | `user@example.com (team)` | 账号信息（邮箱或团队） |
| `3小时限额`               | `3-hour limit`            | 限额类型（3 小时限额） |
| `剩余 85%`                | `85% remaining`           | 剩余百分比             |
| `重置: 2h 30m后`          | `Resets in: 2h 30m`       | 重置时间倒计时         |

**为什么 API Key 没有完整显示**：为了保护你的隐私，插件会自动脱敏显示（如 `9c89****AQVM`）。

## 检查点 ✅

确认你已经完成以下步骤：

| 步骤          | 检查方法                                | 预期结果                                |
| ------------- | --------------------------------------- | --------------------------------------- |
| 安装插件      | 查看 `~/.config/opencode/opencode.json` | `plugin` 数组包含 `"opencode-mystatus"` |
| 配置斜杠命令  | 查看同一文件                            | `command` 对象包含 `mystatus` 配置      |
| 重启 OpenCode | 查看 OpenCode 进程                      | 已重新启动                              |
| 测试命令      | 输入 `/mystatus`                        | 显示额度信息或"未找到任何已配置的账号"  |

## 踩坑提醒

### 常见错误 1：JSON 格式错误

**现象**：OpenCode 启动失败，报错提示 JSON 格式错误

**原因**：配置文件中多了或少了逗号、引号

**解决方法**：

使用在线 JSON 验证工具检查格式，例如：

```json
// ❌ 错误：最后一项多了逗号
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }  // ← 这里不应该有逗号
}

// ✅ 正确
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool..."
    }
  }
}
```

---

### 常见错误 2：忘记重启 OpenCode

**现象**：配置完成后输入 `/mystatus`，提示"未找到命令"

**原因**：OpenCode 没有重新加载配置文件

**解决方法**：

1. 完全退出 OpenCode（不是最小化）
2. 重新启动 OpenCode
3. 再次尝试 `/mystatus` 命令

---

### 常见错误 3：显示"未找到任何已配置的账号"

**现象**：执行 `/mystatus` 后显示"未找到任何已配置的账号"

**原因**：还没有在 OpenCode 中登录任何 AI 平台

**解决方法**：

1. 在 OpenCode 中登录至少一个 AI 平台（OpenAI、智谱 AI、Z.ai、GitHub Copilot 或 Google Cloud）
2. 认证信息会自动保存到 `~/.local/share/opencode/auth.json`
3. 重新执行 `/mystatus`

---

### 常见错误 4：Google Cloud 额度查询失败

**现象**：其他平台都能正常查询，但 Google Cloud 显示错误

**原因**：Google Cloud 需要额外的认证插件

**解决方法**：

先安装 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 插件来完成 Google 账号认证。

## 本课小结

本课完成了 opencode-mystatus 的安装和初步验证：

1. **三种安装方式**：让 AI 帮你安装（推荐）、手动安装、从本地文件安装
2. **配置文件位置**：`~/.config/opencode/opencode.json`
3. **关键配置项**：
   - `plugin` 数组：添加 `"opencode-mystatus"`
   - `command` 对象：配置 `mystatus` 斜杠命令
4. **验证方法**：重启 OpenCode 后输入 `/mystatus`
5. **自动读取认证**：插件自动从 `~/.local/share/opencode/auth.json` 读取已配置的账号信息

安装完成后，你可以在 OpenCode 中使用 `/mystatus` 命令或自然语言查询所有 AI 平台的额度。

## 下一课预告

> 下一课我们学习 **[使用 mystatus：斜杠命令和自然语言](/zh/vbgate/opencode-mystatus/start/using-mystatus/)**。
>
> 你会学到：
> - 斜杠命令 `/mystatus` 的详细用法
> - 如何用自然语言触发 mystatus 工具
> - 两种触发方式的区别和适用场景
> - 斜杠命令的配置原理解析

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能              | 文件路径                                                                                           | 行号  |
| ----------------- | -------------------------------------------------------------------------------------------------- | ----- |
| 插件入口          | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 26-94 |
| mystatus 工具定义 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 29-33 |
| 读取认证文件      | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 35-46 |
| 并行查询所有平台  | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 49-56 |
| 结果收集和汇总    | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts)   | 58-89 |
| 斜杠命令配置      | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6   |

**关键常量**：
- 认证文件路径：`~/.local/share/opencode/auth.json`（`plugin/mystatus.ts:35`）

**关键函数**：
- `mystatus()`：mystatus 工具的主函数，读取认证文件并并行查询所有平台（`plugin/mystatus.ts:29-33`）
- `collectResult()`：收集查询结果到 results 和 errors 数组（`plugin/mystatus.ts:100-116`）
- `queryOpenAIUsage()`：查询 OpenAI 额度（`plugin/lib/openai.ts`）
- `queryZhipuUsage()`：查询智谱 AI 额度（`plugin/lib/zhipu.ts`）
- `queryZaiUsage()`：查询 Z.ai 额度（`plugin/lib/zhipu.ts`）
- `queryGoogleUsage()`：查询 Google Cloud 额度（`plugin/lib/google.ts`）
- `queryCopilotUsage()`：查询 GitHub Copilot 额度（`plugin/lib/copilot.ts`）

**配置文件格式**：
OpenCode 配置文件 `~/.config/opencode/opencode.json` 中的插件和斜杠命令配置参考 [`README.zh-CN.md`](https://github.com/vbgate/opencode-mystatus/blob/main/README.zh-CN.md#安装) 第 33-82 行。

</details>
