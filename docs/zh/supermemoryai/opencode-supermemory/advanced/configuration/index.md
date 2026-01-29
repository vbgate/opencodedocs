---
title: "深度配置: 高级选项 | opencode-supermemory"
sidebarTitle: "定制专属记忆引擎"
subtitle: "深度配置详解：定制你的记忆引擎"
description: "掌握 opencode-supermemory 的高级配置选项。本教程教你如何自定义记忆触发词、调整上下文注入策略、优化压缩阈值以及管理环境变量。"
tags:
  - "配置"
  - "高级"
  - "自定义"
prerequisite:
  - "start-getting-started"
order: 2
---

# 深度配置详解：定制你的记忆引擎

## 学完你能做什么

- **自定义触发词**：让 Agent 听懂你的专属指令（如 "记一下"、"mark"）。
- **调整记忆容量**：控制注入到上下文中的记忆数量，平衡 Token 消耗与信息量。
- **优化压缩策略**：根据项目规模调整抢占式压缩的触发时机。
- **多环境管理**：通过环境变量灵活切换 API Key。

## 配置文件位置

opencode-supermemory 会按顺序查找以下配置文件，**找到即止**：

1. `~/.config/opencode/supermemory.jsonc`（推荐，支持注释）
2. `~/.config/opencode/supermemory.json`

::: tip 为什么推荐 .jsonc？
`.jsonc` 格式允许在 JSON 中写注释（`//`），非常适合用来解释配置项的用途。
:::

## 核心配置详解

以下是一个完整的配置示例，包含了所有可用选项及其默认值。

### 基础配置

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // 优先级：配置文件 > 环境变量 SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // 语义搜索的相似度阈值 (0.0 - 1.0)
  // 值越高，检索结果越精准但数量越少；值越低，结果越发散
  "similarityThreshold": 0.6
}
```

### 上下文注入控制

这些设置决定了 Agent 在启动会话时，会自动读取多少记忆注入到 Prompt 中。

```jsonc
{
  // 是否自动注入用户画像（User Profile）
  // 设为 false 可节省 Token，但 Agent 可能忘记你的基本偏好
  "injectProfile": true,

  // 注入的用户画像条目最大数量
  "maxProfileItems": 5,

  // 注入的用户级记忆（User Scope）最大数量
  // 这些是跨项目共享的通用记忆
  "maxMemories": 5,

  // 注入的项目级记忆（Project Scope）最大数量
  // 这些是当前项目特有的记忆
  "maxProjectMemories": 10
}
```

### 自定义触发词

你可以添加自定义的正则表达式，让 Agent 识别特定的指令并自动保存记忆。

```jsonc
{
  // 自定义触发词列表（支持正则表达式）
  // 这些词会与内置的默认触发词合并生效
  "keywordPatterns": [
    "记一下",           // 简单匹配
    "mark\\s+this",     // 正则匹配：mark this
    "重要[:：]",         // 匹配 "重要:" 或 "重要："
    "TODO\\(memory\\)"  // 匹配特定标记
  ]
}
```

::: details 查看内置默认触发词
插件内置了以下触发词，无需配置即可使用：
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### 抢占式压缩 (Preemptive Compaction)

当会话上下文过长时，插件会自动触发压缩机制。

```jsonc
{
  // 压缩触发阈值 (0.0 - 1.0)
  // 当 Token 使用率超过此比例时触发压缩
  // 默认 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning 阈值设置建议
- **不要设得太高**（如 > 0.95）：可能导致在压缩完成前就耗尽上下文窗口。
- **不要设得太低**（如 < 0.50）：会导致频繁压缩，打断心流且浪费 Token。
- **推荐值**：0.70 - 0.85 之间。
:::

## 环境变量支持

除了配置文件，你也可以使用环境变量来管理敏感信息或覆盖默认行为。

| 环境变量 | 描述 | 优先级 |
|--- | --- | ---|
| `SUPERMEMORY_API_KEY` | Supermemory API 密钥 | 低于配置文件 |
| `USER` 或 `USERNAME` | 用于生成用户作用域 Hash 的标识 | 系统默认 |

### 使用场景：多环境切换

如果你在公司和个人项目中使用不同的 Supermemory 账号，可以利用环境变量：

::: code-group

```bash [macOS/Linux]
# 在 .zshrc 或 .bashrc 中设置默认 Key
export SUPERMEMORY_API_KEY="key_personal"

# 在公司项目目录下，临时覆盖 Key
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# 设置环境变量
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## 跟我做：定制你的专属配置

让我们来创建一个适合大多数开发者的优化配置。

### 第 1 步：创建配置文件

如果文件不存在，请创建它。

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### 第 2 步：写入优化配置

将以下内容复制到 `supermemory.jsonc` 中。这个配置增加了项目记忆的权重，并添加了中文触发词。

```jsonc
{
  // 保持默认相似度
  "similarityThreshold": 0.6,

  // 增加项目记忆数量，减少通用记忆，更适合深度开发
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // 添加中文习惯的触发词
  "keywordPatterns": [
    "记一下",
    "记住",
    "保存记忆",
    "别忘了"
  ],

  // 稍微提前触发压缩，预留更多安全空间
  "compactionThreshold": 0.75
}
```

### 第 3 步：验证配置

重启 OpenCode，在对话中尝试使用新定义的触发词：

```
用户输入：
记一下：这个项目的 API 基础路径是 /api/v2

系统回复（预期）：
(Agent 调用 supermemory 工具保存记忆)
已保存记忆：这个项目的 API 基础路径是 /api/v2
```

## 常见问题

### Q: 修改配置后需要重启吗？
**A: 需要。** 插件在启动时加载配置，修改 `supermemory.jsonc` 后必须重启 OpenCode 才能生效。

### Q: `keywordPatterns` 支持中文正则吗？
**A: 支持。** 底层使用 JavaScript 的 `new RegExp()`，完全支持 Unicode 字符。

### Q: 如果配置文件格式错了会怎样？
**A: 插件会回退到默认值。** 如果 JSON 格式无效（如多余的逗号），插件会捕获错误并使用内置的 `DEFAULTS`，不会导致 OpenCode 崩溃。

## 下一课预告

> 下一课我们学习 **[隐私与数据安全](../../security/privacy/)**。
>
> 你会学到：
> - 敏感数据自动脱敏机制
> - 如何使用 `<private>` 标签保护隐私
> - 数据存储的安全边界

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 配置接口定义 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| 默认值定义 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| 默认触发词 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| 配置文件加载 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| 环境变量读取 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>
