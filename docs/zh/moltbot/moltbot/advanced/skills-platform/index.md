---
title: "技能平台与 ClawdHub：集成扩展 AI 助手 | Clawdbot 教程 | Clawdbot"
sidebarTitle: "扩展 AI 能力"
subtitle: "技能平台与 ClawdHub：集成扩展 AI 助手 | Clawdbot 教程 | Clawdbot"
description: "学习 Clawdbot 技能系统架构，掌握 Bundled、Managed、Workspace 技能的三种加载优先级。使用 ClawdHub 安装和更新技能，配置技能门控规则与环境变量注入机制。"
tags:
  - "技能系统"
  - "ClawdHub"
  - "AI 扩展"
  - "技能配置"
prerequisite:
  - "start-getting-start"
order: 280
---

# 技能平台与 ClawdHub 集成扩展 AI 助手 | Clawdbot 教程

## 学完你能做什么

学完这一课，你将能够：

- 理解 Clawdbot 的技能系统架构（Bundled、Managed、Workspace 三种技能类型）
- 从 ClawdHub 发现、安装、更新技能，扩展 AI 助手能力
- 配置技能的启用状态、环境变量和 API 密钥
- 使用技能门控（Gating）规则，确保技能只在满足条件时加载
- 管理多 Agent 场景下的技能共享和覆盖优先级

## 你现在的困境

Clawdbot 本身已经提供了丰富的内置工具（浏览器、命令执行、Web 搜索等），但当你需要：

- 调用第三方 CLI 工具（如 `gemini`、`peekaboo`）
- 添加特定领域的自动化脚本
- 让 AI 学习使用你自定义的工具集

你可能会想："要怎么告诉 AI 有哪些工具可以用？这些工具应该放在哪里？多个 Agent 能否共享技能？"

Clawdbot 的技能系统就是为此设计的：**通过 SKILL.md 文件声明技能，由 Agent 自动加载和使用**。

## 什么时候用这一招

- **需要扩展 AI 能力时**：想添加新的工具或自动化流程
- **多 Agent 协作时**：不同 Agent 需要共享或独占技能
- **技能版本管理时**：从 ClawdHub 安装、更新、同步技能
- **技能门控时**：确保技能只在特定环境（OS、二进制、配置）下加载

## 🎒 开始前的准备

开始前，请确认：

- [ ] 已完成 [快速开始](../../start/getting-start/)，Gateway 正常运行
- [ ] 已配置至少一个 AI 模型（Anthropic、OpenAI、Ollama 等）
- [ ] 了解基本的命令行操作（`mkdir`、`cp`、`rm`）

## 核心思路

### 技能是什么？

技能是一个目录，包含 `SKILL.md` 文件（给 LLM 的指令和工具定义），以及可选的脚本或资源。`SKILL.md` 使用 YAML frontmatter 定义元数据，用 Markdown 描述技能用法。

Clawdbot 兼容 [AgentSkills](https://agentskills.io) 规范，技能可以被其他遵循该规范的工具加载。

#### 技能加载的三个位置

技能从三个地方加载，按优先级从高到低：

1. **Workspace 技能**：`<workspace>/skills`（优先级最高）
2. **Managed/本地技能**：`~/.clawdbot/skills`
3. **Bundled 技能**：随安装包一起提供（优先级最低）

::: info 优先级规则
如果同名的技能存在于多个位置，Workspace 技能会覆盖 Managed 和 Bundled 技能。
:::

此外，你还可以通过 `skills.load.extraDirs` 配置额外的技能目录（优先级最低）。

#### 多 Agent 场景下的技能共享

在多 Agent 设置中，每个 Agent 都有自己的 workspace：

- **Per-agent 技能**：位于 `<workspace>/skills`，仅对该 Agent 可见
- **共享技能**：位于 `~/.clawdbot/skills`，对同一台机器上的所有 Agent 可见
- **共享文件夹**：可以通过 `skills.load.extraDirs` 添加（优先级最低），用于多个 Agent 共用同一个技能包

同名冲突时，优先级规则同样适用：Workspace > Managed > Bundled。

#### 技能门控（Gating）

Clawdbot 在加载时根据 `metadata` 字段过滤技能，确保技能只在满足条件时加载：

```markdown
---
name: nano-banana-pro
description: Generate or edit images via Gemini 3 Pro Image
metadata: {"clawdbot":{"requires":{"bins":["uv"],"env":["GEMINI_API_KEY"],"config":["browser.enabled"]},"primaryEnv":"GEMINI_API_KEY"}}
---
```

`metadata.clawdbot` 下的字段：

- `always: true`：总是加载技能（跳过其他门控）
- `emoji`：macOS Skills UI 中显示的 emoji
- `homepage`：macOS Skills UI 中显示的网站链接
- `os`：平台列表（`darwin`、`linux`、`win32`），技能仅在这些 OS 上可用
- `requires.bins`：列表，每个必须在 `PATH` 中存在
- `requires.anyBins`：列表，至少一个在 `PATH` 中存在
- `requires.env`：列表，环境变量必须存在或在配置中提供
- `requires.config`：`clawdbot.json` 路径列表，必须为真值
- `primaryEnv`：与 `skills.entries.<name>.apiKey` 关联的环境变量名
- `install`：可选的安装器规范数组（供 macOS Skills UI 使用）

::: warning 沙箱环境下的二进制检查
`requires.bins` 在技能加载时在**主机**上检查。如果 Agent 在沙箱中运行，二进制必须也存在于容器内。
可通过 `agents.defaults.sandbox.docker.setupCommand` 安装依赖。
:::

### 环境变量注入

当 Agent 运行开始时，Clawdbot：

1. 读取技能元数据
2. 应用任何 `skills.entries.<key>.env` 或 `skills.entries.<key>.apiKey` 到 `process.env`
3. 使用符合条件的技能构建系统提示词
4. Agent 运行结束后恢复原始环境

这是**限定在 Agent 运行范围**，不是全局 Shell 环境。

## 跟我做

### 第 1 步：查看已安装的技能

使用 CLI 列出当前可用的技能：

```bash
clawdbot skills list
```

或只查看满足条件的技能：

```bash
clawdbot skills list --eligible
```

**你应该看到**：技能列表，包括名称、描述、是否满足条件（如二进制、环境变量）。

### 第 2 步：从 ClawdHub 安装技能

ClawdHub 是 Clawdbot 的公共技能注册表，你可以浏览、安装、更新和发布技能。

#### 安装 CLI

选择一种方式安装 ClawdHub CLI：

```bash
npm i -g clawdhub
```

或

```bash
pnpm add -g clawdhub
```

#### 搜索技能

```bash
clawdhub search "postgres backups"
```

#### 安装技能

```bash
clawdhub install <skill-slug>
```

默认情况下，CLI 安装到当前工作目录的 `./skills` 子目录（或回退到配置的 Clawdbot workspace）。Clawdbot 会在下一次会话中将其作为 `<workspace>/skills` 加载。

**你应该看到**：安装输出，显示技能文件夹和版本信息。

### 第 3 步：更新已安装的技能

更新所有已安装的技能：

```bash
clawdhub update --all
```

或更新特定技能：

```bash
clawdhub update <slug>
```

**你应该看到**：每个技能的更新状态，包括版本变更。

### 第 4 步：配置技能覆盖

在 `~/.clawdbot/clawdbot.json` 中配置技能的启用状态、环境变量等：

```json5
{
  "skills": {
    "entries": {
      "nano-banana-pro": {
        "enabled": true,
        "apiKey": "GEMINI_KEY_HERE",
        "env": {
          "GEMINI_API_KEY": "GEMINI_KEY_HERE"
        },
        "config": {
          "endpoint": "https://example.invalid",
          "model": "nano-pro"
        }
      },
      "peekaboo": { "enabled": true },
      "sag": { "enabled": false }
    }
  }
}
```

**规则**：

- `enabled: false`：禁用技能，即使它是 Bundled 或已安装的
- `env`：注入环境变量（仅当变量未在进程中设置时）
- `apiKey`：便捷字段，用于声明了 `metadata.clawdbot.primaryEnv` 的技能
- `config`：可选的自定义字段包，自定义键必须放在这里

**你应该看到**：配置保存后，Clawdbot 会在下次 Agent 运行时应用这些设置。

### 第 5 步：启用技能监视器（可选）

默认情况下，Clawdbot 监视技能文件夹，在 `SKILL.md` 文件变化时刷新技能快照。你可以在 `skills.load` 下配置：

```json5
{
  "skills": {
    "load": {
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

**你应该看到**：修改技能文件后，无需重启 Gateway，Clawdbot 会在下一次 Agent 轮次中自动刷新技能列表。

### 第 6 步：调试技能问题

检查技能的详细信息和缺失的依赖：

```bash
clawdbot skills info <name>
```

检查所有技能的依赖状态：

```bash
clawdbot skills check
```

**你应该看到**：技能的详细信息，包括二进制、环境变量、配置状态，以及缺失的条件。

## 检查点 ✅

完成上述步骤后，你应该能够：

- [ ] 使用 `clawdbot skills list` 查看所有可用技能
- [ ] 从 ClawdHub 安装新技能
- [ ] 更新已安装的技能
- [ ] 在 `clawdbot.json` 中配置技能覆盖
- [ ] 使用 `skills check` 调试技能依赖问题

## 踩坑提醒

### 常见错误 1：技能名称包含连字符

**问题**：`skills.entries` 中使用带连字符的技能名作为键

```json
// ❌ 错误：未加引号
{
  "skills": {
    "entries": {
      nano-banana-pro: { "enabled": true }  // JSON 语法错误
    }
  }
}
```

**修正**：使用引号包裹键（JSON5 支持带引号的键）

```json
// ✅ 正确：加引号
{
  "skills": {
    "entries": {
      "nano-banana-pro": { "enabled": true }
    }
  }
}
```

### 常见错误 2：沙箱环境下的环境变量

**问题**：技能在沙箱中运行，但 `skills.entries.<skill>.env` 或 `apiKey` 没有生效

**原因**：全局 `env` 和 `skills.entries.<skill>.env/apiKey` 只应用于**主机运行**，沙箱不继承主机 `process.env`。

**修正**：使用以下方式之一：

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "docker": {
          "env": {
            "GEMINI_API_KEY": "your_key_here"
          }
        }
      }
    }
  }
}
```

或将环境变量 baked 进自定义沙箱镜像。

### 常见错误 3：技能不显示在列表中

**问题**：已安装技能，但 `clawdbot skills list` 不显示

**可能原因**：

1. 技能不满足门控条件（缺少二进制、环境变量、配置）
2. 技能已禁用（`enabled: false`）
3. 技能不在 Clawdbot 扫描的目录中

**排查步骤**：

```bash
# 检查技能依赖
clawdbot skills check

# 检查技能目录是否被扫描
ls -la ~/.clawdbot/skills/
ls -la <workspace>/skills/
```

### 常见错误 4：技能冲突和优先级混淆

**问题**：同名的技能存在于多个位置，加载的是哪个？

**记住优先级**：

`<workspace>/skills` (最高) → `~/.clawdbot/skills` → bundled skills (最低)

如果想使用 Bundled 技能而非 Workspace 覆盖：

1. 删除或重命名 `<workspace>/skills/<skill-name>`
2. 或在 `skills.entries` 中禁用该技能

## 本课小结

本课学习了 Clawdbot 技能平台的核心概念：

- **三种技能类型**：Bundled、Managed、Workspace，按优先级加载
- **ClawdHub 集成**：搜索、安装、更新、发布技能的公共注册表
- **技能门控**：通过 metadata 的 `requires` 字段过滤技能
- **配置覆盖**：在 `clawdbot.json` 中控制技能的启用、环境变量和自定义配置
- **技能监视器**：自动刷新技能列表，无需重启 Gateway

技能系统是扩展 Clawdbot 能力的核心机制，掌握它可以让你的 AI 助手适应更多场景和工具。

## 下一课预告

> 下一课我们学习 **[安全与沙箱隔离](../security-sandbox/)**。

> 你会学到：
> - 安全模型和权限控制
> - 工具权限的 allowlist/denylist
> - Docker 沙箱隔离机制
> - 远程 Gateway 的安全配置

---

#### 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 技能配置类型定义 | [`src/config/types.skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.skills.ts) | 1-32 |
| 技能系统文档 | [`docs/tools/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills.md) | 1-260 |
| 技能配置参考 | [`docs/tools/skills-config.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/skills-config.md) | 1-76 |
| ClawdHub 文档 | [`docs/tools/clawdhub.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/clawdhub.md) | 1-202 |
| 创建技能指南 | [`docs/tools/creating-skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/tools/creating-skills.md) | 1-42 |
| CLI 命令 | [`docs/cli/skills.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/skills.md) | 1-26 |

**关键类型**：

- `SkillConfig`：单个技能的配置（enabled、apiKey、env、config）
- `SkillsLoadConfig`：技能加载配置（extraDirs、watch、watchDebounceMs）
- `SkillsInstallConfig`：技能安装配置（preferBrew、nodeManager）
- `SkillsConfig`：顶层技能配置（allowBundled、load、install、entries）

**内置技能示例**：

- `skills/gemini/SKILL.md`：Gemini CLI 技能
- `skills/peekaboo/SKILL.md`：Peekaboo macOS UI 自动化技能

</details>
