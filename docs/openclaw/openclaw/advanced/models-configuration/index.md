---
title: "Model Configuration - Multi-Provider & Failover | OpenClaw Tutorial"
sidebarTitle: "Model Configuration"
subtitle: "Model Configuration - Multi-Provider & Failover"
description: "Learn how to configure multiple model providers (Anthropic, OpenAI, vLLM, etc.), set up model fallback strategies, and build highly available AI services."
tags:
  - "Models"
  - "Configuration"
  - "Failover"
  - "Multi-Provider"
order: 100
---

# Model Configuration - Multi-Provider & Failover

## What You'll Learn

After completing this lesson, you will be able to:
- Configure multiple AI model providers
- Set up model failover strategies
- Customize model parameters and compatibility settings
- Optimize the cost-performance balance

## Core Concepts

OpenClaw supports multiple model providers and automatically switches to backup models when the primary model becomes unavailable, ensuring high service availability.

```
┌─────────────────────────────────────────────────────────────┐
│              Multi-Model Provider Architecture              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    User Request                                             │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────┐      │
│   │              Model Selector                      │      │
│   │   ┌──────────────┐  ┌──────────────┐           │      │
│   │   │ Primary      │  │ Backup       │           │      │
│   │   │ Model        │  │ Model        │           │      │
│   │   │ Claude       │  │ GPT-4        │           │      │
│   │   └──────┬───────┘  └──────┬───────┘           │      │
│   │          │                 │                   │      │
│   │          ▼                 ▼                   │      │
│   │   ┌─────────────────────────────────────────┐  │      │
│   │   │ Failure Detection → Auto Switch →       │  │      │
│   │   │ Degradation Handling                    │  │      │
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

### Supported Model Providers

| Provider | API Type | Features | Best For |
|----------|----------|----------|----------|
| **Anthropic** | anthropic-messages | Claude series, long context | Complex reasoning, code generation |
| **OpenAI** | openai-responses | GPT-4/3.5, feature-rich | General tasks, quick responses |
| **vLLM** | openai-completions | Local deployment, privacy-first | Data-sensitive, offline environments |
| **AWS Bedrock** | bedrock-converse-stream | Enterprise-grade, multi-model | Enterprise compliance, multi-model |
| **GitHub Copilot** | github-copilot | IDE integration | Code completion |
| **Google Gemini** | google-generative-ai | Multimodal | Image understanding |

## Let's Do This

### Step 1: Configure Primary Model Provider

**Why**  
Specify the default AI model to use.

```bash
# Configure Anthropic Claude
openclaw config set agents.defaults.model.provider anthropic
openclaw config set agents.defaults.model.id claude-3-5-sonnet-20241022
openclaw config set models.providers.anthropic.apiKey "sk-ant-..."

# Or configure OpenAI
openclaw config set agents.defaults.model.provider openai
openclaw config set agents.defaults.model.id gpt-4o
openclaw config set models.providers.openai.apiKey "sk-..."
```

**Model Configuration Type Definition** (`src/config/types.models.ts`)

```typescript
type ModelDefinitionConfig = {
  id: string;                    // Model ID
  name: string;                  // Display name
  api?: ModelApi;                // API type
  reasoning: boolean;            // Supports reasoning
  input: Array<"text" | "image">; // Supported input types
  cost: {
    input: number;               // Input token cost ($/1M)
    output: number;              // Output token cost ($/1M)
    cacheRead: number;           // Cache read cost
    cacheWrite: number;          // Cache write cost
  };
  contextWindow: number;         // Context window size
  maxTokens: number;             // Maximum output tokens
};
```

### Step 2: Add Backup Models

**Why**  
Automatically switch to backup models when the primary model is unavailable.

```bash
# Configure backup model list
openclaw config set agents.defaults.fallbacks.0.provider openai
openclaw config set agents.defaults.fallbacks.0.model gpt-4o

openclaw config set agents.defaults.fallbacks.1.provider anthropic
openclaw config set agents.defaults.fallbacks.1.model claude-3-haiku-20240307
```

**Failover Configuration Example**

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

### Step 3: Configure vLLM Local Models

**Why**  
Local deployment protects data privacy and works without internet connectivity.

```bash
# Configure vLLM provider
openclaw config set models.providers.vllm.baseUrl "http://localhost:8000/v1"
openclaw config set models.providers.vllm.api "openai-completions"

# Add local model definition
openclaw config set models.providers.vllm.models.0.id "llama-3-8b"
openclaw config set models.providers.vllm.models.0.name "Llama 3 8B"
openclaw config set models.providers.vllm.models.0.reasoning true
openclaw config set models.providers.vllm.models.0.contextWindow 8192
openclaw config set models.providers.vllm.models.0.maxTokens 4096
```

**Complete vLLM Configuration**

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

### Step 4: Configure AWS Bedrock

**Why**  
AWS Bedrock provides enterprise-grade multi-model access.

```bash
# Configure Bedrock discovery
openclaw config set models.bedrockDiscovery.enabled true
openclaw config set models.bedrockDiscovery.region us-east-1
openclaw config set models.bedrockDiscovery.providerFilter "["anthropic","meta"]"

# Or manually configure Bedrock
openclaw config set models.providers.bedrock.auth aws-sdk
openclaw config set models.providers.bedrock.baseUrl "https://bedrock-runtime.us-east-1.amazonaws.com"
```

**Bedrock Auto-Discovery Configuration**

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

### Step 5: Configure Model Allowlist

**Why**  
Limit the models users can access to control costs.

```bash
# Configure model allowlist
openclaw config set agents.defaults.models.claude-3-5-sonnet-20241022.enabled true
openclaw config set agents.defaults.models.gpt-4o.enabled true
openclaw config set agents.defaults.models.claude-3-haiku-20240307.enabled true
```

**Allowlist Configuration Example**

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

### Step 6: Configure Model Compatibility

**Why**  
Different models have different feature support and require compatibility configuration.

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

## Checkpoint ✅

Verify model configuration:

```bash
# List available models
openclaw models list

# Expected output
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

# Test model connection
openclaw models test anthropic/claude-3-5-sonnet-20241022
```

## Common Pitfalls

::: warning Common Configuration Issues
1. **Incorrect Model ID**  
   Symptom: `Model not found`  
   Solution: Check the model ID spelling, use `openclaw models list` to view available models

2. **Invalid API Key**  
   Symptom: `Authentication failed`  
   Solution: Verify the API key is correct, check for extra whitespace

3. **Context Limit Exceeded**  
   Symptom: `Context window exceeded`  
   Solution: Reduce `contextTokens` configuration, or enable context compression

4. **Failover Not Working**  
   Symptom: No response when primary model fails  
   Solution: Check `fallbacks` configuration format, ensure backup models are available

5. **Insufficient Bedrock Permissions**  
   Symptom: `Access denied`  
   Solution: Check AWS IAM permissions, ensure you have `bedrock:InvokeModel` permission
:::

## Cost Optimization Recommendations

### Model Selection Strategy

| Task Type | Recommended Model | Cost Index | Quality |
|-----------|-------------------|------------|---------|
| Simple Q&A | Claude Haiku / GPT-4o-mini | ⭐ | ⭐⭐ |
| General Tasks | Claude Sonnet / GPT-4o | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Complex Reasoning | Claude Opus / GPT-4o | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Code Generation | Claude Sonnet | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Caching Strategy

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

## Lesson Summary

In this lesson, you learned:

- ✅ How to configure multiple model providers
- ✅ How to set up model failover strategies
- ✅ How to configure local vLLM models
- ✅ AWS Bedrock auto-discovery
- ✅ Model allowlist and cost control
- ✅ Model compatibility configuration
- ✅ Cost optimization strategies

## Next Lesson Preview

> In the next lesson, we'll cover **[Browser Control](../browser-control/)**.
>
> You'll learn:
> - How to automate Chrome/Chromium
> - CDP protocol basics
> - Browser configuration and security settings

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
|---------|-----------|--------------|
| Model Configuration Types | [`src/config/types.models.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.models.ts) | 1-60 |
| Model Selection Logic | [`src/agents/model-selection.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/model-selection.ts) | - |
| Model Failover | [`src/agents/model-fallback.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/model-fallback.ts) | - |
| Model Catalog Loading | [`src/agents/model-catalog.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/model-catalog.ts) | - |
| Model Commands | [`src/commands/models.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/models.ts) | - |

**Supported API Types**:
- `openai-completions`: OpenAI-compatible API
- `openai-responses`: OpenAI Responses API
- `anthropic-messages`: Anthropic Messages API
- `google-generative-ai`: Google Gemini API
- `github-copilot`: GitHub Copilot API
- `bedrock-converse-stream`: AWS Bedrock API

</details>
