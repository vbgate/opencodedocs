---
title: "故障排除: Doctor 诊断配置 | oh-my-opencode"
sidebarTitle: "5 分钟定位问题"
subtitle: "故障排除: Doctor 诊断配置"
description: "学习 Doctor 命令诊断方法，涵盖版本、插件、认证、依赖等 17+ 项检查，使用 --verbose、--json、--category 选项快速定位配置问题。"
tags:
  - "troubleshooting"
  - "diagnostics"
  - "configuration"
prerequisite:
  - "start-installation"
order: 150
---

# 配置诊断与故障排除：使用 Doctor 命令快速解决问题

## 学完你能做什么

- 运行 `oh-my-opencode doctor` 快速诊断 17+ 项健康检查
- 定位和修复 OpenCode 版本过低、插件未注册、Provider 配置等问题
- 理解模型解析机制，检查代理和 Categories 的模型分配
- 使用详细模式获取问题诊断的完整信息

## 你现在的困境

安装完 oh-my-opencode 后，遇到以下情况怎么办？

- OpenCode 提示插件未加载，但配置文件看起来没问题
- 某些 AI 代理总是报错"Model not found"
- 想确认所有 Provider（Claude、OpenAI、Gemini）都配置正确
- 不确定问题出在安装、配置还是认证环节

逐个排查太耗时，你需要一个**一键诊断工具**。

## 核心思路

**Doctor 命令是 oh-my-opencode 的健康检查系统**，类似 Mac 的 Disk Utility 或汽车的故障检测仪。它会逐项检查你的环境，告诉你哪里正常、哪里有问题。

Doctor 的检查逻辑完全来自源码实现（`src/cli/doctor/checks/`），包括：
- ✅ **installation**：OpenCode 版本、插件注册
- ✅ **configuration**：配置文件格式、Schema 验证
- ✅ **authentication**：Anthropic、OpenAI、Google 认证插件
- ✅ **dependencies**：Bun、Node.js、Git 依赖
- ✅ **tools**：LSP 和 MCP 服务器状态
- ✅ **updates**：版本更新检查

## 跟我做

### 第 1 步：运行基础诊断

**为什么**
先跑一遍完整检查，了解整体健康状况。

```bash
bunx oh-my-opencode doctor
```

**你应该看到**：

```
┌──────────────────────────────────────────────────┐
│  Oh-My-OpenCode Doctor                           │
└──────────────────────────────────────────────────┘

Installation
  ✓ OpenCode version: 1.0.155 (>= 1.0.150)
  ✓ Plugin registered in opencode.json

Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ categories.visual-engineering: using default model

Authentication
  ✓ Anthropic API key configured
  ✓ OpenAI API key configured
  ✗ Google API key not found

Dependencies
  ✓ Bun 1.2.5 installed
  ✓ Node.js 22.0.0 installed
  ✓ Git 2.45.0 installed

Summary: 10 passed, 1 warning, 1 failed
```

**检查点 ✅**：
- [ ] 看到 6 个分类的检查结果
- [ ] 每项前面有 ✓（通过）、⚠（警告）、✗（失败）标记
- [ ] 底部有汇总统计

### 第 2 步：解读常见问题

根据诊断结果，你可以快速定位问题。以下是常见错误及解决方案：

#### ✗ "OpenCode version too old"

**问题**：OpenCode 版本低于 1.0.150（最低要求）

**原因**：oh-my-opencode 依赖 OpenCode 的新功能，旧版本不支持

**解决方法**：

```bash
# 更新 OpenCode
npm install -g opencode@latest
# 或使用 Bun
bun install -g opencode@latest
```

**验证**：重新运行 `bunx oh-my-opencode doctor`

#### ✗ "Plugin not registered"

**问题**：插件未在 `opencode.json` 的 `plugin` 数组中注册

**原因**：安装过程被中断，或手动编辑了配置文件

**解决方法**：

```bash
# 重新运行安装程序
bunx oh-my-opencode install
```

**源码依据**（`src/cli/doctor/checks/plugin.ts:79-117`）：
- 检查插件是否在 `opencode.json` 的 `plugin` 数组中
- 支持格式：`oh-my-opencode` 或 `oh-my-opencode@version` 或 `file://` 路径

#### ✗ "Configuration has validation errors"

**问题**：配置文件不符合 Schema 定义

**原因**：手动编辑时引入了错误（如拼写错误、类型不匹配）

**解决方法**：

1. 使用 `--verbose` 查看详细错误信息：

```bash
bunx oh-my-opencode doctor --verbose
```

2. 常见错误类型（来自 `src/config/schema.ts`）：

| 错误信息 | 原因 | 修正方法 |
|--- | --- | ---|
| `agents.sisyphus.mode: Invalid enum value` | `mode` 只能是 `subagent`/`primary`/`all` | 改为 `primary` |
| `categories.quick.model: Expected string` | `model` 必须是字符串 | 加引号：`"anthropic/claude-haiku-4-5"` |
| `background_task.defaultConcurrency: Expected number` | 并发数必须是数字 | 改为数字：`3` |

3. 参考 [配置参考](../../appendix/configuration-reference/) 验证字段定义

#### ⚠ "Auth plugin not installed"

**问题**：Provider 对应的认证插件未安装

**原因**：安装时跳过了该 Provider，或手动卸载了插件

**解决方法**：

```bash
# 重新安装并选择缺失的 Provider
bunx oh-my-opencode install
```

**源码依据**（`src/cli/doctor/checks/auth.ts:11-15`）：

```typescript
const AUTH_PLUGINS: Record<AuthProviderId, { plugin: string; name: string }> = {
  anthropic: { plugin: "builtin", name: "Anthropic (Claude)" },
  openai: { plugin: "opencode-openai-codex-auth", name: "OpenAI (ChatGPT)" },
  google: { plugin: "opencode-antigravity-auth", name: "Google (Gemini)" },
}
```

### 第 3 步：检查模型解析

模型解析是 oh-my-opencode 的核心机制，检查代理和 Categories 的模型分配是否正确。

```bash
bunx oh-my-opencode doctor --category configuration
```

**你应该看到**：

```
Configuration
  ✓ oh-my-opencode.json is valid
  ⚠ Model Resolution: 9 agents, 7 categories (0 overrides), 15 available

Details:
  ═══ Available Models (from cache) ═══
  
    Providers in cache: anthropic, openai, google
    Sample: anthropic, openai, google
    Total models: 15
    Cache: ~/.cache/opencode/models.json
    ℹ Runtime: only connected providers used
    Refresh: opencode models --refresh
  
  ═══ Configured Models ═══
  
  Agents:
    ○ sisyphus: anthropic/claude-opus-4-5
    ○ oracle: openai/gpt-5.2
    ○ librarian: opencode/big-pickle
    ...
  
  Categories:
    ○ visual-engineering: google/gemini-3-pro
    ○ ultrabrain: openai/gpt-5.2-codex
    ...
  
  ○ = provider fallback
```

**检查点 ✅**：
- [ ] 看到 Agent 和 Categories 的模型分配
- [ ] `○` 表示使用 Provider 降级机制（未手动覆盖）
- [ ] `●` 表示用户在配置中覆盖了默认模型

**常见问题**：

| 问题 | 原因 | 解决方法 |
|--- | --- | ---|
| `unknown` 模型 | Provider 降级链为空 | 确保至少有一个 Provider 可用 |
| 模型未被使用 | Provider 未连接 | 运行 `opencode` 连接 Provider |
| 想覆盖模型 | 使用默认模型 | 在 `oh-my-opencode.json` 中设置 `agents.<name>.model` |

**源码依据**（`src/cli/doctor/checks/model-resolution.ts:129-148`）：
- 从 `~/.cache/opencode/models.json` 读取可用模型
- 代理模型要求：`AGENT_MODEL_REQUIREMENTS`（`src/shared/model-requirements.ts`）
- Category 模型要求：`CATEGORY_MODEL_REQUIREMENTS`

### 第 4 步：使用 JSON 输出（脚本化）

如果你想在 CI/CD 中自动化诊断，使用 JSON 格式：

```bash
bunx oh-my-opencode doctor --json
```

**你应该看到**：

```json
{
  "results": [
    {
      "name": "OpenCode version",
      "status": "pass",
      "message": "1.0.155 (>= 1.0.150)",
      "duration": 5
    },
    {
      "name": "Plugin registration",
      "status": "pass",
      "message": "Registered",
      "details": ["Config: /Users/xxx/.config/opencode/opencode.json"],
      "duration": 12
    }
  ],
  "summary": {
    "total": 17,
    "passed": 15,
    "failed": 1,
    "warnings": 1,
    "skipped": 0,
    "duration": 1234
  },
  "exitCode": 1
}
```

**使用场景**：

```bash
# 保存诊断报告到文件
bunx oh-my-opencode doctor --json > doctor-report.json

# 在 CI/CD 中检查健康状态
bunx oh-my-opencode doctor --json | jq -e '.summary.failed == 0'
if [ $? -eq 0 ]; then
  echo "All checks passed"
else
  echo "Some checks failed"
  exit 1
fi
```

## 踩坑提醒

### ❌ 错误 1：忽略警告信息

**问题**：看到 `⚠` 标记以为是"可选"的，实际上可能是重要提示

**修正方法**：
- 例如："using default model" 警告表示你未配置 Category 模型，可能不是最优选择
- 使用 `--verbose` 查看详细信息，判断是否需要处理

### ❌ 错误 2：手动编辑 opencode.json

**问题**：直接修改 OpenCode 的 `opencode.json`，破坏了插件注册

**修正方法**：
- 使用 `bunx oh-my-opencode install` 重新注册
- 或者只修改 `oh-my-opencode.json`，不动 OpenCode 的配置文件

### ❌ 错误 3：缓存未刷新

**问题**：模型解析显示"cache not found"，但 Provider 已配置

**修正方法**：

```bash
# 启动 OpenCode 以刷新模型缓存
opencode

# 或手动刷新（如果有 opencode models 命令）
opencode models --refresh
```

## 本课小结

Doctor 命令是 oh-my-opencode 的瑞士军刀，帮你快速定位问题：

| 命令 | 用途 | 何时使用 |
|--- | --- | ---|
| `bunx oh-my-opencode doctor` | 完整诊断 | 首次安装后、遇到问题时 |
| `--verbose` | 详细信息 | 需要查看错误详情 |
| `--json` | JSON 输出 | CI/CD、脚本自动化 |
| `--category <name>` | 单类别检查 | 只想检查特定环节 |

**记住**：每次遇到问题，先跑 `doctor`，看清楚错误再动手。

## 下一课预告

> 下一课我们学习 **[常见问题解答](../faq/)**。
>
> 你会学到：
> - oh-my-opencode 与其他 AI 工具的区别
> - 如何优化模型使用成本
> - 后台任务并发控制的最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Doctor 命令入口 | [`src/cli/doctor/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/index.ts#L1-L11) | 1-11 |
| 所有检查项注册 | [`src/cli/doctor/checks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/index.ts#L24-L37) | 24-37 |
| 插件注册检查 | [`src/cli/doctor/checks/plugin.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/plugin.ts#L79-L117) | 79-117 |
| 配置验证检查 | [`src/cli/doctor/checks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/config.ts#L82-L112) | 82-112 |
| 认证检查 | [`src/cli/doctor/checks/auth.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/auth.ts#L49-L76) | 49-76 |
| 模型解析检查 | [`src/cli/doctor/checks/model-resolution.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/cli/doctor/checks/model-resolution.ts#L234-L254) | 234-254 |
| 配置 Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L1-L50) | 1-50 |
| 模型要求定义 | [`src/shared/model-requirements.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/model-requirements.ts) | 全文 |

**关键常量**：
- `MIN_OPENCODE_VERSION = "1.0.150"`：OpenCode 最低版本要求
- `AUTH_PLUGINS`：认证插件映射（Anthropic=内置，OpenAI/GitHub=插件）
- `AGENT_MODEL_REQUIREMENTS`：代理模型要求（每个代理的优先级链）
- `CATEGORY_MODEL_REQUIREMENTS`：Category 模型要求（visual、quick 等）

**关键函数**：
- `doctor(options)`：运行诊断命令，返回退出码
- `getAllCheckDefinitions()`：获取所有 17+ 个检查项定义
- `checkPluginRegistration()`：检查插件是否在 opencode.json 中注册
- `validateConfig(configPath)`：验证配置文件符合 Schema
- `checkAuthProvider(providerId)`：检查 Provider 认证插件状态
- `checkModelResolution()`：检查模型解析和分配

</details>
