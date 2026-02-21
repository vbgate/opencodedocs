---
title: "配置基础 - 理解 openclaw.json 配置结构 | OpenClaw 教程"
sidebarTitle: "配置基础"
subtitle: "配置基础 - 理解 openclaw.json 配置结构"
description: "深入理解 OpenClaw 的配置文件结构、环境变量使用方法、关键配置项的详细说明，掌握系统配置的核心知识。"
tags:
  - "配置"
  - "入门"
  - "openclaw.json"
order: 40
---

# 配置基础 - 理解 openclaw.json 配置结构

## 学完你能做什么

完成本课程后，你将能够：
- 理解 `openclaw.json` 配置文件的完整结构
- 使用环境变量覆盖配置
- 配置 Gateway 模式和认证方式
- 管理模型提供商和会话设置

## 核心思路

OpenClaw 使用 JSON 格式的配置文件 `openclaw.json`，位于用户主目录的 `.openclaw/` 文件夹中。配置分为多个模块，每个模块负责不同的功能领域。

```
~/.openclaw/
├── openclaw.json          # 主配置文件
├── sessions/              # 会话数据
├── agents/                # Agent 工作区
├── credentials/           # 凭据存储
└── skills/                # 技能目录
```

### 配置文件结构概览

```typescript
// 配置类型定义 (src/config/types.openclaw.ts)
type OpenClawConfig = {
  meta?: {
    lastTouchedVersion?: string;    // 最后修改版本
    lastTouchedAt?: string;         // 最后修改时间
  };
  auth?: AuthConfig;               // 认证配置
  env?: EnvConfig;                 // 环境变量
  browser?: BrowserConfig;         // 浏览器配置
  gateway?: GatewayConfig;         // Gateway 配置
  agents?: AgentsConfig;           // Agent 配置
  models?: ModelsConfig;           // 模型配置
  channels?: ChannelsConfig;       // 频道配置
  skills?: SkillsConfig;           // 技能配置
  cron?: CronConfig;               // Cron 配置
  tools?: ToolsConfig;             // 工具配置
  session?: SessionConfig;         // 会话配置
  // ... 更多模块
};
```

## 跟我做

### 第 1 步：查看当前配置

**为什么**  
了解当前配置状态是修改配置的前提。

```bash
# 查看完整配置
openclaw config get

# 查看特定路径的配置
openclaw config get gateway.mode
openclaw config get agents.defaults.model

# 以 JSON 格式输出
openclaw config get --json
```

**你应该看到**  
当前配置的 JSON 输出，包含所有已设置的配置项。

### 第 2 步：设置 Gateway 模式

**为什么**  
Gateway 模式决定了服务的运行方式。

```bash
# 设置为本地模式（推荐用于个人使用）
openclaw config set gateway.mode local

# 设置为远程模式（用于服务器部署）
openclaw config set gateway.mode remote

# 验证设置
openclaw config get gateway.mode
```

**模式对比**

| 模式 | 适用场景 | 安全性 | 性能 |
|------|----------|--------|------|
| `local` | 个人设备 | 高（仅限本地访问） | 依赖本地资源 |
| `remote` | 服务器部署 | 需要额外安全配置 | 依赖服务器资源 |

### 第 3 步：配置 Gateway 认证

**为什么**  
认证保护你的 Gateway 服务免受未授权访问。

```bash
# 启用 Token 认证（推荐）
openclaw config set gateway.auth.mode token
openclaw config set gateway.auth.token "your-secure-token"

# 或者使用密码认证
openclaw config set gateway.auth.mode password
openclaw config set gateway.auth.password "your-password"

# 查看认证配置
openclaw config get gateway.auth
```

**认证方式对比**

| 方式 | 安全性 | 使用场景 |
|------|--------|----------|
| `token` | 高 | 生产环境、远程访问 |
| `password` | 中 | 本地开发、测试 |
| `off` | 低 | 仅用于开发测试 |

### 第 4 步：配置模型提供商

**为什么**  
配置模型提供商是使用 AI 功能的基础。

```bash
# 配置 Anthropic Claude
openclaw config set models.providers.anthropic.apiKey "your-anthropic-key"

# 配置 OpenAI
openclaw config set models.providers.openai.apiKey "your-openai-key"

# 配置自定义提供商（如 vLLM）
openclaw config set models.providers.vllm.baseUrl "http://localhost:8000/v1"
openclaw config set models.providers.vllm.apiKey "optional-api-key"
```

**配置文件示例**

```json
{
  "models": {
    "providers": {
      "anthropic": {
        "baseUrl": "https://api.anthropic.com",
        "apiKey": "sk-ant-...",
        "models": [
          {
            "id": "claude-3-5-sonnet-20241022",
            "name": "Claude 3.5 Sonnet",
            "api": "anthropic-messages",
            "reasoning": true,
            "input": ["text", "image"],
            "cost": {
              "input": 3.0,
              "output": 15.0,
              "cacheRead": 0.3,
              "cacheWrite": 3.75
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

### 第 5 步：使用环境变量

**为什么**  
敏感信息（如 API Key）不应直接写在配置文件中。

```bash
# 设置环境变量
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."

# 在配置中引用环境变量
# ~/.openclaw/openclaw.json
{
  "models": {
    "providers": {
      "anthropic": {
        "apiKey": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

**环境变量配置选项** (config.types.openclaw.ts)

```typescript
env?: {
  shellEnv?: {
    enabled?: boolean;     // 从登录 shell 导入环境变量
    timeoutMs?: number;    // 超时时间（默认 15000ms）
  };
  vars?: Record<string, string>;  // 内联环境变量
  [key: string]: string | Record<string, string> | { enabled?: boolean; timeoutMs?: number } | undefined;
};
```

### 第 6 步：配置会话管理

**为什么**  
会话配置影响对话历史的存储和上下文长度。

```bash
# 设置默认上下文长度
openclaw config set agents.defaults.contextTokens 128000

# 启用会话持久化
openclaw config set session.persist true

# 配置会话存储路径
openclaw config set session.store "~/.openclaw/sessions"
```

## 检查点 ✅

运行诊断命令检查配置：

```bash
# 运行配置诊断
openclaw doctor

# 检查配置有效性
openclaw config validate
```

**你应该看到**  
配置验证通过的信息，如果有问题会显示修复建议。

## 踩坑提醒

::: warning 常见配置错误
1. **JSON 语法错误**  
   症状：`Invalid JSON in config file`  
   解决：使用 `openclaw doctor` 修复，或使用 `openclaw config set` 避免手动编辑

2. **环境变量未生效**  
   症状：API Key 显示为空  
   解决：确保环境变量在启动 Gateway 前已设置，使用 `echo $VAR_NAME` 验证

3. **Gateway 模式冲突**  
   症状：无法启动 Gateway  
   解决：确保 `gateway.mode` 设置为 `local` 或 `remote`，不能留空

4. **配置路径错误**  
   症状：`Config file not found`  
   解决：运行 `openclaw setup` 初始化配置目录
:::

## 本课小结

在本课程中，你学习了：

- ✅ `openclaw.json` 配置文件的完整结构
- ✅ 设置 Gateway 运行模式
- ✅ 配置认证方式保护服务
- ✅ 配置模型提供商和 API Key
- ✅ 使用环境变量管理敏感信息
- ✅ 会话管理和上下文配置

## 下一课预告

> 下一课我们学习 **[消息频道概览](../../platforms/channels-overview/)**。
>
> 你会学到：
> - OpenClaw 支持的 12+ 消息频道
> - 各频道的特点和适用场景
> - 如何选择合适的消息频道

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 主配置类型定义 | [`src/config/types.openclaw.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.openclaw.ts) | 28-130 |
| Gateway 配置类型 | [`src/config/types.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.gateway.ts) | - |
| Agent 配置类型 | [`src/config/types.agents.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.agents.ts) | - |
| 配置加载逻辑 | [`src/config/config.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/config.ts) | - |
| 模型配置类型 | [`src/config/types.models.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.models.ts) | 1-60 |
| 频道配置类型 | [`src/config/types.channels.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.channels.ts) | 1-55 |

**关键常量**：
- `CONFIG_PATH`: 配置文件路径 `~/.openclaw/openclaw.json`
- 默认 Gateway 端口：`18789`

</details>
