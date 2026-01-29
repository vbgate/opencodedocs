---
title: "安装: 快速部署 | oh-my-opencode"
sidebarTitle: "5 分钟跑起来"
subtitle: "快速安装与配置：Provider 设置与验证"
description: "学习 oh-my-opencode 的安装和配置方法。在 5 分钟内完成 AI Provider 配置，支持 Claude、OpenAI、Gemini、GitHub Copilot。"
tags:
  - "installation"
  - "setup"
  - "provider-configuration"
prerequisite: []
order: 10
---

# 快速安装与配置：Provider 设置与验证

## 学完你能做什么

- ✅ 使用推荐的 AI 代理方式自动安装和配置 oh-my-opencode
- ✅ 手动使用 CLI 交互式安装器完成配置
- ✅ 配置 Claude、OpenAI、Gemini、GitHub Copilot 等多个 AI Provider
- ✅ 验证安装是否成功并诊断配置问题
- ✅ 了解 Provider 优先级和降级机制

## 你现在的困境

- 你刚刚安装了 OpenCode，但面对空白配置界面无从下手
- 你有多个 AI 服务订阅（Claude、ChatGPT、Gemini），不知道如何统一配置
- 你想让 AI 帮你安装，但不知道该如何给 AI 提供准确的安装指令
- 你担心配置错误导致插件无法正常工作

## 什么时候用这一招

- **首次安装 oh-my-opencode 时**：这是第一步，必须完成
- **新增 AI Provider 订阅后**：例如新买了 Claude Max 或 ChatGPT Plus
- **更换开发环境时**：在新机器上重新配置开发环境
- **遇到 Provider 连接问题时**：通过诊断命令排查配置问题

## 🎒 开始前的准备

::: warning 前置条件
本教程假设你已经：
1. 安装了 **OpenCode >= 1.0.150**
2. 拥有至少一个 AI Provider 订阅（Claude、OpenAI、Gemini、GitHub Copilot 等）

如果 OpenCode 未安装，请先参考 [OpenCode 官方文档](https://opencode.ai/docs) 完成安装。
:::

::: tip 检查 OpenCode 版本
```bash
opencode --version
# 应该显示 1.0.150 或更高版本
```
:::

## 核心思路

oh-my-opencode 的安装设计有两个核心理念：

**1. AI 代理优先（推荐）**

让 AI 代理帮你安装配置，而不是自己手动操作。为什么？因为：
- AI 不会遗漏步骤（它有完整的安装指南）
- AI 会自动根据你的订阅情况选择最佳配置
- AI 可以在出错时自动诊断和修复

**2. 交互式 vs 非交互式**

- **交互式安装**：运行 `bunx oh-my-opencode install`，通过问答方式配置
- **非交互式安装**：使用命令行参数（适合自动化或 AI 代理）

**3. Provider 优先级**

oh-my-opencode 使用三步模型解析机制：
1. **用户覆盖**：如果配置文件中明确指定了模型，使用该模型
2. **Provider 降级**：按优先级链尝试：`Native（anthropic/openai/google）> GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`
3. **系统默认**：如果所有 Provider 都不可用，使用 OpenCode 默认模型

::: info 什么是 Provider？
Provider 是 AI 模型服务的提供商，例如：
- **Anthropic**：提供 Claude 模型（Opus、Sonnet、Haiku）
- **OpenAI**：提供 GPT 模型（GPT-5.2、GPT-5-nano）
- **Google**：提供 Gemini 模型（Gemini 3 Pro、Flash）
- **GitHub Copilot**：提供 GitHub 托管的多种模型作为 fallback

oh-my-opencode 可以同时配置多个 Provider，根据任务类型和优先级自动选择最优模型。
:::

## 跟我做

### 第 1 步：推荐方式——让 AI 代理安装（人类友好）

**为什么**
这是官方推荐的安装方式，让 AI 代理自动完成配置，避免人为遗漏步骤。

**操作**

打开你的 AI 对话界面（Claude Code、AmpCode、Cursor 等），输入以下提示：

```bash
请按照以下指南安装和配置 oh-my-opencode：
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**你应该看到**
AI 代理会：
1. 询问你的订阅情况（Claude、OpenAI、Gemini、GitHub Copilot 等）
2. 自动执行安装命令
3. 配置 Provider 认证
4. 验证安装结果
5. 告诉你安装完成

::: tip AI 代理的测试口令
AI 代理在完成安装后，会用 "oMoMoMoMo..." 作为测试口令向你确认。
:::

### 第 2 步：手动安装——使用 CLI 交互式安装器

**为什么**
如果你想完全控制安装过程，或者 AI 代理安装失败时使用。

::: code-group

```bash [使用 Bun（推荐）]
bunx oh-my-opencode install
```

```bash [使用 npm]
npx oh-my-opencode install
```

:::

> **注意**：CLI 会自动下载适合你平台的独立二进制文件，安装后无需 Bun/Node.js 运行时。
>
> **支持平台**：macOS (ARM64, x64)、Linux (x64, ARM64, Alpine/musl)、Windows (x64)

**你应该看到**
安装器会询问以下问题：

```
oMoMoMoMo... Install

[?] Do you have a Claude Pro/Max Subscription? (Y/n)
[?] Are you on max20 (20x mode)? (Y/n)
[?] Do you have an OpenAI/ChatGPT Plus Subscription? (Y/n)
[?] Will you integrate Gemini models? (Y/n)
[?] Do you have a GitHub Copilot Subscription? (Y/n)
[?] Do you have access to OpenCode Zen (opencode/ models)? (Y/n)
[?] Do you have a Z.ai Coding Plan subscription? (Y/n)

Configuration Summary
────────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (opencode/ models)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

────────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```

### 第 3 步：配置 Provider 认证

#### 3.1 Claude (Anthropic) 认证

**为什么**
Sisyphus 主代理强烈推荐使用 Opus 4.5 模型，必须先认证。

**操作**

```bash
opencode auth login
```

然后按照提示操作：
1. **选择 Provider**：选择 `Anthropic`
2. **选择登录方式**：选择 `Claude Pro/Max`
3. **完成 OAuth 流程**：在浏览器中登录并授权
4. **等待完成**：终端会显示认证成功

**你应该看到**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Claude OAuth 访问限制
> 截至 2026 年 1 月，Anthropic 已限制第三方 OAuth 访问，引用 ToS 违规。
>
> [**Anthropic 引用本项目 oh-my-opencode 作为封锁 OpenCode 的理由**](https://x.com/thdxr/status/2010149530486911014)
>
> 确实存在一些伪造 Claude Code OAuth 请求签名的插件在社区中。这些工具可能技术上可行，但用户应了解 ToS 影响，我个人不推荐使用。
>
> 本项目不对使用非官方工具引起的任何问题负责，且**我们没有任何自定义的 OAuth 系统实现**。
:::

#### 3.2 Google Gemini (Antigravity OAuth) 认证

**为什么**
Gemini 模型用于 Multimodal Looker（媒体分析）和部分专业任务。

**操作**

**步骤 1**：添加 Antigravity Auth 插件

编辑 `~/.config/opencode/opencode.json`，在 `plugin` 数组中添加 `opencode-antigravity-auth@latest`：

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**步骤 2**：配置 Antigravity 模型（必需）

从 [opencode-antigravity-auth 文档](https://github.com/NoeFabris/opencode-antigravity-auth) 复制完整的模型配置，小心合并到 `~/.config/opencode/oh-my-opencode.json`，避免破坏现有配置。

该插件使用 **variant 系统**——模型如 `antigravity-gemini-3-pro` 支持 `low`/`high` 变体，而不是单独的 `-low`/`-high` 模型条目。

**步骤 3**：覆盖 oh-my-opencode 代理模型

在 `oh-my-opencode.json`（或 `.opencode/oh-my-opencode.json`）中覆盖代理模型：

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**可用模型（Antigravity 配额）**：
- `google/antigravity-gemini-3-pro` — 变体：`low`, `high`
- `google/antigravity-gemini-3-flash` — 变体：`minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — 无变体
- `google/antigravity-claude-sonnet-4-5-thinking` — 变体：`low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — 变体：`low`, `max`

**可用模型（Gemini CLI 配额）**：
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **注意**：传统的带后缀名称如 `google/antigravity-gemini-3-pro-high` 仍然可用，但推荐使用变体。改用 `--variant=high` 和基础模型名称代替。

**步骤 4**：执行认证

```bash
opencode auth login
```

然后按照提示操作：
1. **选择 Provider**：选择 `Google`
2. **选择登录方式**：选择 `OAuth with Google (Antigravity)`
3. **完成浏览器登录**：（自动检测）完成登录
4. **可选**：添加更多 Google 账户实现多账户负载均衡
5. **验证成功**：与用户确认

**你应该看到**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip 多账户负载均衡
该插件支持最多 10 个 Google 账户。当一个账户达到速率限制时，它会自动切换到下一个可用账户。
:::

#### 3.3 GitHub Copilot (Fallback Provider) 认证

**为什么**
GitHub Copilot 作为 **fallback provider**，当 Native providers 不可用时使用。

**优先级**：`Native (anthropic/, openai/, google/) > GitHub Copilot > OpenCode Zen > Z.ai Coding Plan`

**操作**

```bash
opencode auth login
```

然后按照提示操作：
1. **选择 Provider**：选择 `GitHub`
2. **选择认证方式**：选择 `Authenticate via OAuth`
3. **完成浏览器登录**：GitHub OAuth 流程

**你应该看到**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info GitHub Copilot 模型映射
当 GitHub Copilot 是最佳可用 provider 时，oh-my-opencode 使用以下模型分配：

| 代理          | 模型                            |
|--- | ---|
| **Sisyphus**  | `github-copilot/claude-opus-4.5`  |
| **Oracle**    | `github-copilot/gpt-5.2`         |
| **Explore**   | `opencode/gpt-5-nano`             |
| **Librarian** | `zai-coding-plan/glm-4.7`（如果 Z.ai 可用）或 fallback |

GitHub Copilot 作为代理 provider，根据你的订阅路由请求到底层模型。
:::

### 第 4 步：非交互式安装（适合 AI 代理）

**为什么**
AI 代理需要使用非交互式模式，通过命令行参数一次性完成所有配置。

**操作**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=<yes|no|max20> \
  --openai=<yes|no> \
  --gemini=<yes|no> \
  --copilot=<yes|no> \
  [--opencode-zen=<yes|no>] \
  [--zai-coding-plan=<yes|no>]
```

**参数说明**：

| 参数              | 值            | 说明                               |
|--- | --- | ---|
| `--no-tui`        | -             | 禁用交互式界面（必须指定其他参数） |
| `--claude`         | `yes/no/max20` | Claude 订阅状态                          |
| `--openai`         | `yes/no`       | OpenAI/ChatGPT 订阅（GPT-5.2 for Oracle） |
| `--gemini`         | `yes/no`       | Gemini 集成                              |
| `--copilot`        | `yes/no`       | GitHub Copilot 订阅                        |
| `--opencode-zen`   | `yes/no`       | OpenCode Zen 访问（默认 no）                |
| `--zai-coding-plan` | `yes/no`       | Z.ai Coding Plan 订阅（默认 no）         |

**示例**：

```bash
# 用户有所有 native 订阅
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# 用户只有 Claude
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# 用户只有 GitHub Copilot
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# 用户没有订阅
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**你应该看到**
与非交互式安装相同的输出，但无需手动回答问题。

## 检查点 ✅

### 验证安装是否成功

**检查 1**：确认 OpenCode 版本

```bash
opencode --version
```

**预期结果**：显示 `1.0.150` 或更高版本。

::: warning OpenCode 版本要求
如果你在 1.0.132 或更旧版本，OpenCode 的 bug 可能会破坏配置。
>
> 该修复在 1.0.132 之后合并——使用更新的版本。
> 有趣的事实：这个 PR 是由于 OhMyOpenCode 的 Librarian、Explore 和 Oracle 设置而被发现和修复的。
:::

**检查 2**：确认插件已注册

```bash
cat ~/.config/opencode/opencode.json
```

**预期结果**：在 `plugin` 数组中看到 `"oh-my-opencode"`。

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**检查 3**：确认配置文件已生成

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**预期结果**：显示完整的配置结构，包括 `agents`、`categories`、`disabled_agents` 等字段。

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```

### 运行诊断命令

```bash
oh-my-opencode doctor --verbose
```

**你应该看到**：
- 模型解析检查
- 代理配置验证
- MCP 连接状态
- Provider 认证状态

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger 如果诊断失败
如果诊断显示任何错误，请先解决：
1. **Provider 认证失败**：重新运行 `opencode auth login`
2. **配置文件错误**：检查 `oh-my-opencode.json` 语法（JSONC 支持注释和尾随逗号）
3. **版本不兼容**：升级 OpenCode 到最新版本
4. **Plugin 未注册**：重新运行 `bunx oh-my-opencode install`
:::

## 踩坑提醒

### ❌ 错误 1：忘记配置 Provider 认证

**问题**：安装后直接使用，但 AI 模型无法工作。

**原因**：插件已安装，但 Provider 没有通过 OpenCode 认证。

**解决**：
```bash
opencode auth login
# 选择对应的 Provider 并完成认证
```

### ❌ 错误 2：OpenCode 版本过旧

**问题**：配置文件被破坏或无法加载。

**原因**：OpenCode 1.0.132 或更早版本有 bug 会破坏配置。

**解决**：
```bash
# 升级 OpenCode
npm install -g @opencode/cli@latest

# 或使用包管理器（Bun, Homebrew 等）
bun install -g @opencode/cli@latest
```

### ❌ 错误 3：CLI 命令参数错误

**问题**：运行非交互式安装时提示参数错误。

**原因**：`--claude` 是必需参数，必须提供 `yes`、`no` 或 `max20`。

**解决**：
```bash
# ❌ 错误：缺少 --claude 参数
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ 正确：提供所有必需参数
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ 错误 4：Antigravity 配额耗尽

**问题**：Gemini 模型突然停止工作。

**原因**：Antigravity 配额有限，单个账户可能达到速率限制。

**解决**：添加多个 Google 账户实现负载均衡
```bash
opencode auth login
# 选择 Google
# 添加更多账户
```

插件会自动在账户间切换，避免单个账户耗尽。

### ❌ 错误 5：配置文件位置错误

**问题**：修改配置后没有生效。

**原因**：修改了错误的配置文件（项目配置 vs 用户配置）。

**解决**：确认配置文件位置

| 配置类型 | 文件路径 | 优先级 |
|--- | --- | ---|
| **用户配置** | `~/.config/opencode/oh-my-opencode.json` | 高 |
| **项目配置** | `.opencode/oh-my-opencode.json` | 低 |

::: tip 配置合并规则
如果同时存在用户配置和项目配置，**用户配置会覆盖项目配置**。
:::

## 本课小结

- **推荐使用 AI 代理安装**：让 AI 自动完成配置，避免人为遗漏
- **CLI 支持交互式和非交互式模式**：交互式适合人类，非交互式适合 AI
- **Provider 优先级**：Native > Copilot > OpenCode Zen > Z.ai
- **认证是必需的**：安装后必须配置 Provider 认证才能使用
- **诊断命令很重要**：`oh-my-opencode doctor --verbose` 可以快速排查问题
- **支持 JSONC 格式**：配置文件支持注释和尾随逗号

## 下一课预告

> 下一课我们学习 **[初识 Sisyphus：主编排器](../sisyphus-orchestrator/)**。
>
> 你会学到：
> - Sisyphus 代理的核心功能和设计理念
> - 如何使用 Sisyphus 规划和委托任务
> - 并行后台任务的运作机制
> - Todo 强制完成器的原理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能              | 文件路径                                                                                               | 行号    |
|--- | --- | ---|
| CLI 安装入口      | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts)         | 22-60   |
| 交互式安装器      | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts)         | 1-400+  |
| 配置管理器        | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+  |
| 配置 Schema       | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts)       | 1-400+  |
| 诊断命令          | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts)          | 1-200+  |

**关键常量**：
- `VERSION = packageJson.version`：当前 CLI 版本号
- `SYMBOLS`：UI 符号（check、cross、arrow、bullet、info、warn、star）

**关键函数**：
- `install(args: InstallArgs)`：主安装函数，处理交互式和非交互式安装
- `validateNonTuiArgs(args: InstallArgs)`：验证非交互式模式的参数
- `argsToConfig(args: InstallArgs)`：将 CLI 参数转换为配置对象
- `addPluginToOpenCodeConfig()`：将插件注册到 opencode.json
- `writeOmoConfig(config)`：写入 oh-my-opencode.json 配置文件
- `isOpenCodeInstalled()`：检查 OpenCode 是否已安装
- `getOpenCodeVersion()`：获取 OpenCode 版本号

**配置 Schema 字段**：
- `AgentOverrideConfigSchema`：代理覆盖配置（model、variant、skills、temperature、prompt 等）
- `CategoryConfigSchema`：Category 配置（description、model、temperature、thinking 等）
- `ClaudeCodeConfigSchema`：Claude Code 兼容性配置（mcp、commands、skills、agents、hooks、plugins）
- `BuiltinAgentNameSchema`：内置代理枚举（sisyphus、prometheus、oracle、librarian、explore、multimodal-looker、metis、momus、atlas）
- `PermissionValue`：权限值枚举（ask、allow、deny）

**安装支持的平台**（来自 README）：
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Provider 优先级链**（来自 docs/guide/installation.md）：
1. Native（anthropic/, openai/, google/）
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
