---
title: "模型配置 - 多提供商与故障转移 | OpenClaw 教程"
sidebarTitle: "模型配置"
subtitle: "模型配置 - 多提供商与故障转移"
description: "学习如何配置多模型提供商（Anthropic、OpenAI、vLLM 等），设置模型回退策略，实现高可用的 AI 服务。"
tags:
  - "模型"
  - "配置"
  - "故障转移"
  - "多提供商"
order: 100
---

# 模型配置 - 多提供商与故障转移

## 学完你能做什么

完成本课程后，你将能够：
- 配置多个 AI 模型提供商
- 设置模型故障转移策略
- 自定义模型参数和兼容性配置
- 优化成本和性能平衡

## 核心思路

OpenClaw 支持多种模型提供商，并能在主模型不可用时自动切换到备用模型，确保服务的高可用性。

```
┌─────────────────────────────────────────────────────────────┐
│                   多模型提供商架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    用户请求                                                  │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────┐      │
│   │              模型选择器                          │      │
│   │   ┌──────────────┐  ┌──────────────┐           │      │
│   │   │ 主模型       │  │ 备用模型     │           │      │
│   │   │ Claude       │  │ GPT-4        │           │      │
│   │   └──────┬───────┘  └──────┬───────┘           │      │
│   │          │                 │                   │      │
│   │          ▼                 ▼                   │      │
│   │   ┌─────────────────────────────────────────┐  │      │
│   │   │ 故障检测  →  自动切换  →  降级处理       │  │      │
│   │   └─────────────────────────────────────────┘  │      │
│   └─────────────────────────────────────────────────┘      │
│                          │                                  │
│                          ▼                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │Anthropic │  │ OpenAI   │  │  vLLM    │  │ Bedrock  │   │
│   │  API     │  │  API     │  │  Local   │  │  AWS     │   │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 支持的模型提供商

| 提供商 | API 类型 | 特点 | 适用场景 |
|--------|----------|------|----------|
| **Anthropic** | anthropic-messages | Claude 系列，长上下文 | 复杂推理、代码生成 |
| **OpenAI** | openai-responses | GPT-4/3.5，功能丰富 | 通用任务、快速响应 |
| **vLLM** | openai-completions | 本地部署，隐私优先 | 数据敏感、离线环境 |
| **AWS Bedrock** | bedrock-converse-stream | 企业级，多模型 | 企业合规、多模型 |
| **GitHub Copilot** | github-copilot | IDE 集成 | 代码补全 |
| **Google Gemini** | google-generative-ai | 多模态 | 图像理解 |

## 跟我做

### 第 1 步：配置主模型提供商

**为什么**  
指定默认使用的 AI 模型。

```bash
# 配置 Anthropic Claude
openclaw config set agents.defaults.model.provider anthropic
openclaw config set agents.defaults.model.id claude-3-5-sonnet-20241022
openclaw config set models.providers.anthropic.apiKey "sk-ant-..."

# 或者配置 OpenAI
openclaw config set agents.defaults.model.provider openai
openclaw config set agents.defaults.model.id gpt-4o
openclaw config set models.providers.openai.apiKey "sk-..."
```

**模型配置类型定义** (`src/config/types.models.ts`)

```typescript
type ModelDefinitionConfig = {
  id: string;                    // 模型 ID
  name: string;                  // 显示名称
  api?: ModelApi;                // API 类型
  reasoning: boolean;            // 是否支持推理
  input: Array<"text" | "image">; // 支持的输入类型
  cost: {
    input: number;               // 输入 Token 成本 ($/1M)
    output: number;              // 输出 Token 成本 ($/1M)
    cacheRead: number;           // 缓存读取成本
    cacheWrite: number;          // 缓存写入成本
  };
  contextWindow: number;         // 上下文窗口大小
  maxTokens: number;             // 最大输出 Token
};
```

### 第 2 步：添加备用模型

**为什么**  
当主模型不可用时自动切换到备用模型。

```bash
# 配置备用模型列表
openclaw config set agents.defaults.fallbacks.0.provider openai
openclaw config set agents.defaults.fallbacks.0.model gpt-4o

openclaw config set agents.defaults.fallbacks.1.provider anthropic
openclaw config set agents.defaults.fallbacks.1.model claude-3-haiku-20240307
```

**故障转移配置示例**

```json
{
  "agents": {
    "defaults": {
      "model": {
        "provider": "anthropic",
        "id": "claude-3-5-sonnet-20241022"
      },
      "fallbacks": [
        {
          "provider": "openai",
          "model": "gpt-4o"
        },
        {
          "provider": "anthropic",
          "model": "claude-3-haiku-20240307"
        }
      ]
    }
  }
}
```

### 第 3 步：配置 vLLM 本地模型

**为什么**  
本地部署保护数据隐私，无需联网。

```bash
# 配置 vLLM 提供商
openclaw config set models.providers.vllm.baseUrl "http://localhost:8000/v1"
openclaw config set models.providers.vllm.api "openai-completions"

# 添加本地模型定义
openclaw config set models.providers.vllm.models.0.id "llama-3-8b"
openclaw config set models.providers.vllm.models.0.name "Llama 3 8B"
openclaw config set models.providers.vllm.models.0.reasoning true
openclaw config set models.providers.vllm.models.0.contextWindow 8192
openclaw config set models.providers.vllm.models.0.maxTokens 4096
```

**vLLM 完整配置**

```json
{
  "models": {
    "providers": {
      "vllm": {
        "baseUrl": "http://localhost:8000/v1",
        "api": "openai-completions",
        "models": [
          {
            "id": "llama-3-8b",
            "name": "Llama 3 8B (Local)",
            "api": "openai-completions",
            "reasoning": true,
            "input": ["text"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 8192,
            "maxTokens": 4096
          }
        ]
      }
    }
  }
}
```

### 第 4 步：配置 AWS Bedrock

**为什么**  
AWS Bedrock 提供企业级的多模型访问。

```bash
# 配置 Bedrock 发现
openclaw config set models.bedrockDiscovery.enabled true
openclaw config set models.bedrockDiscovery.region us-east-1
openclaw config set models.bedrockDiscovery.providerFilter "["anthropic","meta"]"

# 或者手动配置 Bedrock
openclaw config set models.providers.bedrock.auth aws-sdk
openclaw config set models.providers.bedrock.baseUrl "https://bedrock-runtime.us-east-1.amazonaws.com"
```

**Bedrock 自动发现配置**

```json
{
  "models": {
    "bedrockDiscovery": {
      "enabled": true,
      "region": "us-east-1",
      "providerFilter": ["anthropic", "meta", "amazon"],
      "refreshInterval": 86400,
      "defaultContextWindow": 200000,
      "defaultMaxTokens": 4096
    }
  }
}
```

### 第 5 步：配置模型白名单

**为什么**  
限制用户可以访问的模型，控制成本。

```bash
# 配置模型白名单
openclaw config set agents.defaults.models.claude-3-5-sonnet-20241022.enabled true
openclaw config set agents.defaults.models.gpt-4o.enabled true
openclaw config set agents.defaults.models.claude-3-haiku-20240307.enabled true
```

**白名单配置示例**

```json
{
  "agents": {
    "defaults": {
      "models": {
        "claude-3-5-sonnet-20241022": {
          "enabled": true,
          "maxCostPerDay": 10.0
        },
        "gpt-4o": {
          "enabled": true,
          "maxCostPerDay": 5.0
        },
        "claude-3-haiku-20240307": {
          "enabled": true,
          "maxCostPerDay": 2.0
        }
      }
    }
  }
}
```

### 第 6 步：配置模型兼容性

**为什么**  
不同模型有不同的功能支持，需要配置兼容性。

```json
{
  "models": {
    "providers": {
      "custom-provider": {
        "baseUrl": "https://api.custom.com",
        "headers": {
          "X-Custom-Header": "value"
        },
        "models": [
          {
            "id": "custom-model",
            "name": "Custom Model",
            "api": "openai-completions",
            "reasoning": true,
            "input": ["text", "image"],
            "compat": {
              "supportsStore": false,
              "supportsDeveloperRole": true,
              "supportsReasoningEffort": true,
              "maxTokensField": "max_completion_tokens"
            },
            "cost": {
              "input": 1.0,
              "output": 3.0,
              "cacheRead": 0.1,
              "cacheWrite": 1.25
            },
            "contextWindow": 128000,
            "maxTokens": 4096
          }
        ]
      }
    }
  }
}
```

## 检查点 ✅

验证模型配置：

```bash
# 列出可用模型
openclaw models list

# 预期输出
┌────────────────────────────────────────────────────────────┐
│  Available Models                                          │
├────────────────────────────────────────────────────────────┤
│  anthropic/claude-3-5-sonnet-20241022  ✅ Active           │
│  anthropic/claude-3-opus-20240229      ✅ Active           │
│  anthropic/claude-3-haiku-20240307     ✅ Active           │
│  openai/gpt-4o                         ✅ Active           │
│  openai/gpt-4o-mini                    ✅ Active           │
│  vllm/llama-3-8b                       ✅ Active           │
└────────────────────────────────────────────────────────────┘

# 测试模型连接
openclaw models test anthropic/claude-3-5-sonnet-20241022
```

## 踩坑提醒

::: warning 常见配置问题
1. **模型 ID 错误**  
   症状：`Model not found`  
   解决：检查模型 ID 拼写，使用 `openclaw models list` 查看可用模型

2. **API Key 无效**  
   症状：`Authentication failed`  
   解决：验证 API Key 是否正确，检查是否有多余空格

3. **上下文超出限制**  
   症状：`Context window exceeded`  
   解决：减小 `contextTokens` 配置，或开启上下文压缩

4. **故障转移不生效**  
   症状：主模型失败时无响应  
   解决：检查 `fallbacks` 配置格式，确保备用模型可用

5. **Bedrock 权限不足**  
   症状：`Access denied`  
   解决：检查 AWS IAM 权限，确保有 `bedrock:InvokeModel` 权限
:::

## 成本优化建议

### 模型选择策略

| 任务类型 | 推荐模型 | 成本指数 | 质量 |
|----------|----------|----------|------|
| 简单问答 | Claude Haiku / GPT-4o-mini | ⭐ | ⭐⭐ |
| 一般任务 | Claude Sonnet / GPT-4o | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 复杂推理 | Claude Opus / GPT-4o | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 代码生成 | Claude Sonnet | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 缓存策略

```json
{
  "agents": {
    "defaults": {
      "cache": {
        "enabled": true,
        "ttl": 3600,
        "maxSize": 1000
      }
    }
  }
}
```

## 本课小结

在本课程中，你学习了：

- ✅ 配置多个模型提供商
- ✅ 设置模型故障转移策略
- ✅ 配置本地 vLLM 模型
- ✅ AWS Bedrock 自动发现
- ✅ 模型白名单和成本控制
- ✅ 模型兼容性配置
- ✅ 成本优化策略

## 下一课预告

> 下一课我们学习 **[浏览器控制](../browser-control/)**。
>
> 你会学到：
> - 自动化 Chrome/Chromium
> - CDP 协议基础
> - 浏览器配置和安全设置

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 模型配置类型 | [`src/config/types.models.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.models.ts) | 1-60 |
| 模型选择逻辑 | [`src/agents/model-selection.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/model-selection.ts) | - |
| 模型故障转移 | [`src/agents/model-fallback.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/model-fallback.ts) | - |
| 模型目录加载 | [`src/agents/model-catalog.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/model-catalog.ts) | - |
| 模型命令 | [`src/commands/models.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/models.ts) | - |

**支持的 API 类型**：
- `openai-completions`: OpenAI 兼容 API
- `openai-responses`: OpenAI Responses API
- `anthropic-messages`: Anthropic Messages API
- `google-generative-ai`: Google Gemini API
- `github-copilot`: GitHub Copilot API
- `bedrock-converse-stream`: AWS Bedrock API

</details>
