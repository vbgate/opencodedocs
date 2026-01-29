---
title: "隐私安全: 脱敏与密钥 | opencode-supermemory"
sidebarTitle: "保护你的敏感信息"
subtitle: "隐私安全: 脱敏与密钥 | opencode-supermemory"
description: "学习 opencode-supermemory 的隐私保护机制。掌握 private 标签脱敏数据、安全配置 API Key 以及理解数据流向，保护敏感信息不泄露。"
tags:
  - "隐私"
  - "安全"
  - "配置"
prerequisite:
  - "start-getting-started"
order: 1
---

# 隐私与数据安全：如何保护你的敏感信息

## 学完你能做什么

*   **理解数据去哪了**：清楚知道哪些数据会上传到云端，哪些会留在本地。
*   **掌握脱敏技巧**：学会使用 `<private>` 标签防止敏感信息（如密码、密钥）被上传。
*   **安全管理密钥**：学会以最安全的方式配置 `SUPERMEMORY_API_KEY`。

## 核心思路

在使用 opencode-supermemory 时，理解数据流向至关重要：

1.  **云端存储**：你的记忆（Memories）是存储在 Supermemory 的云端数据库中的，而不是本地文件。这意味着你需要网络连接才能存取记忆。
2.  **本地脱敏**：为了保护隐私，插件在将数据发送到云端**之前**，会在本地进行脱敏处理。
3.  **显式控制**：插件不会自动扫描所有文件上传，只有 Agent 显式调用 `add` 工具或触发压缩时，相关内容才会被处理。

### 脱敏机制

插件内置了一个简单的过滤器，专门识别 `<private>` 标签。

*   **输入**：`这里的数据库密码是 <private>123456</private>`
*   **处理**：插件检测到标签，将其内容替换为 `[REDACTED]`。
*   **上传**：`这里的数据库密码是 [REDACTED]`

::: info 提示
这个处理过程发生在插件内部代码中，在数据离开你的电脑之前就已经完成了。
:::

## 跟我做

### 第 1 步：安全配置 API Key

虽然你可以将 API Key 直接写入配置文件，但为了防止意外泄露（比如误把配置文件分享给别人），我们推荐了解优先级的逻辑。

**优先级规则**：
1.  **配置文件** (`~/.config/opencode/supermemory.jsonc`)：优先级最高。
2.  **环境变量** (`SUPERMEMORY_API_KEY`)：如果配置文件中未设置，则使用此变量。

**推荐做法**：
如果你希望灵活切换或在 CI/CD 环境中使用，请使用环境变量。如果你是个人开发者，配置在用户目录的 JSONC 文件中也是安全的（因为它不在你的项目 Git 仓库里）。

### 第 2 步：使用 `<private>` 标签

当你在对话中通过自然语言让 Agent 记住某些包含敏感信息的内容时，可以使用 `<private>` 标签包裹敏感部分。

**操作演示**：

告诉 Agent：
> 请记住，生产环境的数据库 IP 是 192.168.1.10，但 root 密码是 `<private>SuperSecretPwd!</private>`，不要泄露密码。

**你应该看到**：
Agent 会调用 `supermemory` 工具保存记忆。虽然 Agent 的回复可能包含密码（因为它在上下文中），但**实际保存到 Supermemory 云端的记忆**已经被脱敏。

### 第 3 步：验证脱敏结果

我们可以通过搜索来验证刚才的密码是否真的没被存进去。

**操作**：
让 Agent 搜索刚才的记忆：
> 搜索一下生产环境数据库的密码。

**预期结果**：
Agent 从 Supermemory 检索到的内容应该是：
`生产环境的数据库 IP 是 192.168.1.10，但 root 密码是 [REDACTED]...`

如果 Agent 告诉你"密码是 [REDACTED]"，说明脱敏机制工作正常。

## 常见误区

::: warning 误区 1：所有代码都会被上传
**事实**：插件**不会**自动上传你的整个代码库。它只有在执行 `/supermemory-init` 进行初始化扫描，或者 Agent 显式决定"记住"某段代码逻辑时，才会将那特定的片段上传。
:::

::: warning 误区 2：.env 文件会自动加载
**事实**：插件读取的是进程环境中的 `SUPERMEMORY_API_KEY`。如果你在项目根目录放了一个 `.env` 文件，插件**不会**自动读取它，除非你使用的终端或 OpenCode 主程序加载了它。
:::

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 隐私脱敏逻辑 | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| API Key 加载 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| 插件调用脱敏 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**关键函数**：
- `stripPrivateContent(content)`: 执行正则替换，将 `<private>` 内容变为 `[REDACTED]`。
- `loadConfig()`: 加载本地配置文件，优先级高于环境变量。

</details>

## 下一课预告

> 恭喜你完成了 opencode-supermemory 的核心课程！
>
> 接下来你可以：
> - 回顾 [高级配置](/zh/supermemoryai/opencode-supermemory/advanced/configuration/) 了解更多自定义选项。
