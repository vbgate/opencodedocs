---
title: "技能系统 - 扩展 Agent 能力 | OpenClaw 教程"
sidebarTitle: "技能系统"
subtitle: "技能系统 - 扩展 Agent 能力"
description: "深入理解 OpenClaw 技能系统架构，学习如何安装内置技能、创建自定义技能，扩展 AI 助手的能力边界。"
tags:
  - "技能"
  - "扩展"
  - "自定义"
order: 120
---

# 技能系统 - 扩展 Agent 能力

## 学完你能做什么

完成本课程后，你将能够：
- 理解技能系统的架构和工作原理
- 安装和管理内置技能
- 创建自定义技能
- 配置技能的权限和环境

## 核心思路

**技能（Skills）** 是 OpenClaw 扩展 AI 助手能力的核心机制。通过技能，AI 可以调用外部工具、访问特定数据、执行特定领域的任务。

```
┌─────────────────────────────────────────────────────────────┐
│                    技能系统架构                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │               Agent (Pi)                            │  │
│   │  ┌──────────────┐  ┌──────────────┐                │  │
│   │  │ 系统技能     │  │ 用户技能     │                │  │
│   │  │ - 文件操作   │  │ - 数据库连接 │                │  │
│   │  │ - 代码执行   │  │ - API 调用   │                │  │
│   │  │ - 浏览器控制 │  │ - 自定义工具 │                │  │
│   │  └──────┬───────┘  └──────┬───────┘                │  │
│   │         │                 │                        │  │
│   │         └────────┬────────┘                        │  │
│   │                  │                                 │  │
│   │                  ▼                                 │  │
│   │         ┌─────────────────┐                       │  │
│   │         │   技能注册表     │                       │  │
│   │         │   - 元数据管理   │                       │  │
│   │         │   - 权限控制     │                       │  │
│   │         └────────┬────────┘                       │  │
│   └──────────────────┼────────────────────────────────┘  │
│                      │                                    │
│                      ▼                                    │
│   ┌───────────────────────────────────────────────────┐  │
│   │                  技能执行环境                      │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │  │
│   │  │ Node.js  │  │ Python   │  │ Docker   │        │  │
│   │  │ 运行时   │  │ 运行时   │  │ 沙箱     │        │  │
│   │  └──────────┘  └──────────┘  └──────────┘        │  │
│   └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 技能类型

| 类型 | 说明 | 示例 |
|------|------|------|
| **内置技能** | OpenClaw 核心内置 | 文件操作、代码执行 |
| **捆绑技能** | 随 OpenClaw 分发 | 数据库、API 工具 |
| **自定义技能** | 用户开发 | 业务特定工具 |
| **远程技能** | 网络远程提供 | 第三方服务 |

## 跟我做

### 第 1 步：查看可用技能

**为什么**  
了解系统中有哪些技能可用。

```bash
# 列出所有技能
openclaw skills list

# 列出已启用的技能
openclaw skills list --enabled

# 查看技能详情
openclaw skills info filesystem
```

**你应该看到**

```
┌─────────────────────────────────────────────────────────────┐
│  Available Skills                                           │
├─────────────────────────────────────────────────────────────┤
│  ✅ filesystem     文件系统操作 (内置)                       │
│  ✅ code-execution 代码执行 (内置)                         │
│  ✅ browser        浏览器控制 (内置)                       │
│  🔧 postgres       PostgreSQL 连接 (捆绑)                  │
│  🔧 mysql          MySQL 连接 (捆绑)                       │
│  🔧 redis          Redis 操作 (捆绑)                       │
│  📦 my-custom      自定义技能 (自定义)                     │
└─────────────────────────────────────────────────────────────┘
```

### 第 2 步：启用技能

**为什么**  
技能需要显式启用才能在对话中使用。

```bash
# 启用技能
openclaw skills enable postgres

# 禁用技能
openclaw skills disable redis

# 批量启用
openclaw skills enable postgres mysql redis
```

**技能配置** (`src/config/types.skills.ts`)

```typescript
type SkillsConfig = {
  allowBundled?: string[];       // 允许的捆绑技能白名单
  load?: SkillsLoadConfig;       // 加载配置
  install?: SkillsInstallConfig; // 安装配置
  entries?: Record<string, SkillConfig>;  // 技能配置
};

type SkillConfig = {
  enabled?: boolean;             // 是否启用
  apiKey?: string;               // API Key
  env?: Record<string, string>;  // 环境变量
  config?: Record<string, unknown>;  // 自定义配置
};
```

### 第 3 步：配置技能

**为什么**  
每个技能可能需要特定的配置（连接字符串、API Key 等）。

```bash
# 配置 PostgreSQL 技能
openclaw config set skills.entries.postgres.enabled true
openclaw config set skills.entries.postgres.config.connectionString "postgresql://user:pass@localhost/db"

# 配置 API 技能
openclaw config set skills.entries.weather.enabled true
openclaw config set skills.entries.weather.apiKey "your-weather-api-key"
```

**配置文件示例**

```json
{
  "skills": {
    "allowBundled": ["postgres", "mysql", "redis"],
    "entries": {
      "postgres": {
        "enabled": true,
        "config": {
          "connectionString": "postgresql://user:pass@localhost:5432/mydb",
          "maxConnections": 10
        }
      },
      "weather": {
        "enabled": true,
        "apiKey": "${WEATHER_API_KEY}",
        "config": {
          "units": "metric",
          "language": "zh"
        }
      }
    }
  }
}
```

### 第 4 步：配置技能安装偏好

**为什么**  
技能可能依赖外部工具，需要指定安装方式。

```bash
# 配置优先使用 Homebrew
openclaw config set skills.install.preferBrew true

# 配置 Node 包管理器
openclaw config set skills.install.nodeManager pnpm

# 可选: npm, yarn, bun
```

**安装配置** (`src/agents/skills.ts`)

```typescript
export function resolveSkillsInstallPreferences(config?: OpenClawConfig): SkillsInstallPreferences {
  const raw = config?.skills?.install;
  const preferBrew = raw?.preferBrew ?? true;
  const managerRaw = typeof raw?.nodeManager === "string" ? raw.nodeManager.trim() : "";
  const manager = managerRaw.toLowerCase();
  const nodeManager: SkillsInstallPreferences["nodeManager"] =
    manager === "pnpm" || manager === "yarn" || manager === "bun" || manager === "npm"
      ? manager
      : "npm";
  return { preferBrew, nodeManager };
}
```

### 第 5 步：创建自定义技能

**为什么**  
开发针对特定业务需求的工具。

**技能目录结构**

```
skills/my-skill/
├── SKILL.md          # 技能描述文件
├── package.json      # Node.js 项目配置
├── src/
│   └── index.ts      # 技能入口
└── README.md         # 使用说明
```

**SKILL.md 示例**

```markdown
# My Custom Skill

## Description
自定义技能示例，提供业务特定的工具。

## Tools

### get_customer_info
获取客户信息

**Input:**
- customerId: string - 客户 ID

**Output:**
- name: string - 客户名称
- email: string - 客户邮箱
- orders: array - 订单列表

## Configuration
- apiEndpoint: string - API 端点
- apiKey: string - API 密钥
```

**技能代码示例** (`src/index.ts`)

```typescript
import { defineSkill } from 'openclaw/skill-sdk';

export default defineSkill({
  name: 'my-custom',
  version: '1.0.0',
  
  // 配置Schema
  configSchema: {
    apiEndpoint: { type: 'string', required: true },
    apiKey: { type: 'string', required: true },
    timeout: { type: 'number', default: 5000 }
  },
  
  // 定义工具
  tools: [
    {
      name: 'get_customer_info',
      description: '获取客户信息',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: '客户ID' }
        },
        required: ['customerId']
      },
      async handler({ customerId }, { config }) {
        const response = await fetch(`${config.apiEndpoint}/customers/${customerId}`, {
          headers: { 'Authorization': `Bearer ${config.apiKey}` }
        });
        return response.json();
      }
    },
    {
      name: 'create_order',
      description: '创建订单',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          items: { type: 'array', items: { type: 'object' } }
        },
        required: ['customerId', 'items']
      },
      async handler({ customerId, items }, { config }) {
        // 实现创建订单逻辑
      }
    }
  ]
});
```

### 第 6 步：安装自定义技能

**为什么**  
将自定义技能注册到 OpenClaw 中。

```bash
# 从本地目录安装
openclaw skills install ./skills/my-skill

# 从 Git 仓库安装
openclaw skills install https://github.com/user/my-skill.git

# 从 npm 包安装
openclaw skills install my-openclaw-skill

# 启用新安装的技能
openclaw skills enable my-custom
```

### 第 7 步：配置技能白名单

**为什么**  
限制可使用的捆绑技能，控制安全和范围。

```bash
# 只允许特定捆绑技能
openclaw config set skills.allowBundled "["filesystem","code-execution","browser"]"
```

**安全建议**
- 生产环境使用白名单限制技能
- 敏感技能（如代码执行）谨慎启用
- 自定义技能代码审查后再安装

## 检查点 ✅

验证技能配置：

```bash
# 检查技能状态
openclaw skills status

# 预期输出
┌─────────────────────────────────────────────────────────────┐
│  Skills Status                                              │
├─────────────────────────────────────────────────────────────┤
│  ✅ filesystem      enabled (built-in)                     │
│  ✅ code-execution  enabled (built-in)                     │
│  ✅ browser         enabled (built-in)                     │
│  ✅ postgres        enabled (bundled)                      │
│  🔧 mysql           disabled (bundled)                     │
│  ✅ my-custom       enabled (custom)                       │
└─────────────────────────────────────────────────────────────┘

# 测试技能
openclaw skills test postgres
```

## 踩坑提醒

::: warning 常见问题
1. **技能未启用**  
   症状：`Skill not found`  
   解决：运行 `openclaw skills enable <skill-name>`

2. **配置错误**  
   症状：`Config validation failed`  
   解决：检查 SKILL.md 中的配置要求，确保所有必需项已设置

3. **依赖未安装**  
   症状：`Command not found`  
   解决：技能会自动安装依赖，或手动运行 `openclaw skills install <skill>`

4. **权限不足**  
   症状：`Permission denied`  
   解决：检查技能配置中的权限设置，确保白名单包含该技能

5. **API Key 无效**  
   症状：`Authentication failed`  
   解决：检查技能的 API Key 配置，确保使用正确的凭证
:::

## 技能开发最佳实践

### 1. 清晰的描述

在 SKILL.md 中提供：
- 清晰的技能描述
- 每个工具的输入/输出定义
- 配置项说明
- 使用示例

### 2. 错误处理

```typescript
async handler(params, context) {
  try {
    // 业务逻辑
  } catch (error) {
    return {
      error: true,
      message: error.message,
      suggestion: '请检查网络连接或 API 配置'
    };
  }
}
```

### 3. 输入验证

```typescript
inputSchema: {
  type: 'object',
  properties: {
    email: { 
      type: 'string', 
      pattern: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
      description: '有效的邮箱地址'
    }
  }
}
```

### 4. 敏感信息处理

- 使用环境变量存储 API Key
- 不在日志中打印敏感信息
- 支持配置文件中的变量替换 `${ENV_VAR}`

## 本课小结

在本课程中，你学习了：

- ✅ 技能系统的架构和工作原理
- ✅ 查看和启用内置技能
- ✅ 配置技能参数和环境
- ✅ 创建自定义技能
- ✅ 安装本地和远程技能
- ✅ 配置技能白名单
- ✅ 技能开发最佳实践

## 下一课预告

> 下一课我们学习 **[定时任务](../cron-automation/)**。
>
> 你会学到：
> - Cron 作业配置
> - 定时触发 Agent
> - 自动化工作流设计

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 技能系统核心 | [`src/agents/skills.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/skills.ts) | 1-47 |
| 技能工作区管理 | [`src/agents/skills/workspace.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/skills/workspace.ts) | - |
| 技能配置类型 | [`src/config/types.skills.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.skills.ts) | 1-32 |
| 技能刷新 | [`src/agents/skills/refresh.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/skills/refresh.ts) | - |
| 内置技能目录 | [`skills/`](https://github.com/openclaw/openclaw/blob/main/skills/) | - |
| 远程技能 | [`src/infra/skills-remote.ts`](https://github.com/openclaw/openclaw/blob/main/src/infra/skills-remote.ts) | - |

**技能 SDK 导出**：
- `defineSkill()`: 定义技能
- `SkillConfig`: 技能配置类型
- `SkillTool`: 工具定义类型

</details>
