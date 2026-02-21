---
title: "架构设计 - OpenClaw 内部原理 | OpenClaw 教程"
sidebarTitle: "架构设计"
subtitle: "架构设计 - OpenClaw 内部原理"
description: "深入理解 OpenClaw 的系统架构、数据流、模块关系，了解 Gateway、Agent、频道等核心组件的工作原理。"
tags:
  - "架构"
  - "原理"
  - "内部"
order: 180
---

# 架构设计 - OpenClaw 内部原理

## 学完你能做什么

完成本课程后，你将能够：
- 理解 OpenClaw 的整体架构设计
- 掌握各核心组件的工作原理
- 理解数据流和消息处理流程
- 为二次开发和扩展奠定基础

## 系统架构概览

OpenClaw 采用模块化设计，由多个松耦合的子系统组成：

```
┌─────────────────────────────────────────────────────────────────┐
│                     OpenClaw 系统架构                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      CLI Layer                            │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │  │
│  │  │  agent  │ │ gateway │ │ config  │ │ doctor  │ ...    │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │  │
│  └───────┼───────────┼───────────┼───────────┼─────────────┘  │
│          │           │           │           │                  │
│          └───────────┴─────┬─────┴───────────┘                  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Gateway Service                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ WebSocket    │  │ HTTP API     │  │ Control UI   │   │  │
│  │  │ Control      │  │ (OpenAI      │  │ (Web UI)     │   │  │
│  │  │ Channel      │  │ Compatible)  │  │              │   │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │  │
│  │         │                 │                 │            │  │
│  │         └─────────────────┴─────────────────┘            │  │
│  │                           │                              │  │
│  │                           ▼                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │              Core Runtime                           │ │  │
│  │  │  - Message Routing                                  │ │  │
│  │  │  - Session Management                               │ │  │
│  │  │  - Plugin System                                    │ │  │
│  │  │  - Event Bus                                        │ │  │
│  │  └──────────────────────┬─────────────────────────────┘ │  │
│  └─────────────────────────┼───────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Agent Layer                          │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  Pi Agent (Embedded)                                │ │  │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │ │  │
│  │  │  │  LLM Call   │ │  Skills     │ │  Tools      │   │ │  │
│  │  │  │  ├─ Model   │ │  ├─ Builtin │ │  ├─ Browser │   │ │  │
│  │  │  │  ├─ Prompt  │ │  ├─ Custom  │ │  ├─ Code    │   │ │  │
│  │  │  │  ├─ Stream  │ │  ├─ Remote  │ │  ├─ File    │   │ │  │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘   │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Channel Layer                          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  │ WhatsApp │ │ Telegram │ │ Discord  │ │  Slack   │    │  │
│  │  │ (Baileys)│ │ (grammY) │ │ (discord│ │ (Bolt)   │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │  │
│  │  │  Signal  │ │BlueBubble│ │  Matrix  │ │  Others  │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 核心组件

### 1. Gateway Service

Gateway 是 OpenClaw 的核心服务，负责消息路由、API 提供和 UI 服务。

**主要职责**：
- WebSocket 控制通道
- HTTP API（OpenAI 兼容）
- Web Control UI
- 频道管理
- 会话管理

**关键文件**：
- `src/gateway/server.impl.ts` - Gateway 主实现
- `src/gateway/server-channels.ts` - 频道管理
- `src/gateway/server-chat.ts` - 聊天处理
- `src/gateway/server-methods.ts` - WebSocket 方法

### 2. Agent Layer (Pi)

Pi Agent 是 OpenClaw 的 AI 运行时，负责调用 LLM、执行技能和工具。

**主要职责**：
- LLM 调用和流式处理
- 技能加载和执行
- 工具调用（浏览器、代码执行等）
- 上下文管理

**关键文件**：
- `src/agents/pi-embedded.ts` - Pi Agent 主实现
- `src/agents/model-selection.ts` - 模型选择
- `src/agents/model-fallback.ts` - 故障转移
- `src/agents/skills.ts` - 技能系统

### 3. Channel Layer

频道层处理与各种消息平台的集成。

**主要职责**：
- 消息收发
- 协议适配
- 配对管理
- 消息规范化

**关键文件**：
- `src/channels/plugins/index.ts` - 频道插件入口
- `src/channels/plugins/outbound/*.ts` - 消息发送
- `src/channels/plugins/pairing.ts` - 配对逻辑

### 4. Configuration System

配置系统管理 OpenClaw 的所有设置。

**配置层次**：
1. 默认配置
2. 文件配置 (`~/.openclaw/openclaw.json`)
3. 环境变量
4. 命令行参数

**关键文件**：
- `src/config/config.ts` - 配置加载
- `src/config/types.*.ts` - 类型定义

## 数据流

### 消息流入流程

```
用户消息 (WhatsApp/Telegram/...)
         │
         ▼
┌─────────────────┐
│  Channel Adapter│  协议适配、消息解析
│  (normalize)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gateway Router │  路由到会话/Agent
│  (routing)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Session Manager│  会话状态管理
│  (session)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pi Agent       │  LLM 调用
│  (agent)        │  技能执行
└────────┬────────┘
         │
         ▼
    AI 响应
```

### 消息流出流程

```
AI 响应
    │
    ▼
┌─────────────────┐
│  Response       │  格式化响应
│  Formatter      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Channel        │  选择目标频道
│  Selector       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Outbound       │  发送消息
│  Adapter        │
└────────┬────────┘
         │
         ▼
   用户收到消息
```

## 插件系统

OpenClaw 使用插件架构实现可扩展性：

```typescript
// 插件生命周期
interface OpenClawPlugin {
  // 元数据
  name: string;
  version: string;
  
  // 生命周期钩子
  onLoad?: (context: PluginContext) => Promise<void>;
  onUnload?: () => Promise<void>;
  
  // Gateway 钩子
  onGatewayStart?: (event: GatewayStartEvent) => Promise<void>;
  onGatewayStop?: (event: GatewayStopEvent) => Promise<void>;
  
  // 可选功能
  gatewayMethods?: GatewayMethod[];
  channels?: ChannelDefinition[];
  skills?: SkillDefinition[];
}
```

**插件类型**：
- **Channel 插件**：添加新的消息频道
- **Skill 插件**：添加新的技能
- **Tool 插件**：添加新的工具
- **Hook 插件**：扩展 Gateway 生命周期

## 会话管理

会话是 OpenClaw 中对话的基本单位：

```typescript
// 会话数据结构
interface Session {
  sessionId: string;           // 唯一 ID
  sessionKey: string;          // 会话密钥
  agentId: string;             // 关联 Agent
  channel: string;             // 来源频道
  chatType: 'dm' | 'group';    // 聊天类型
  
  // 状态
  context: Message[];          // 对话上下文
  modelOverride?: string;      // 模型覆盖
  thinkingLevel?: string;      // 思考级别
  
  // 元数据
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
}
```

**会话存储**：
- 默认位置：`~/.openclaw/sessions/`
- 格式：JSONL（每行一个会话记录）
- 自动持久化

## 关键设计决策

### 1. 本地优先

- 所有数据默认存储在本地
- 无需云服务即可运行
- 可选远程模型 API 调用

### 2. 多频道抽象

- 统一的频道接口
- 适配器模式处理不同协议
- 规范化消息格式

### 3. 技能即代码

- 技能是可安装、可更新的代码包
- 支持多种运行时（Node.js、Python、Docker）
- 版本管理和依赖解析

### 4. 流式响应

- LLM 响应实时流式输出
- WebSocket 推送状态更新
- 渐进式 UI 渲染

## 扩展点

OpenClaw 提供多个扩展点供开发者使用：

| 扩展点 | 接口 | 示例 |
|--------|------|------|
| 频道 | `ChannelPlugin` | 自定义消息平台 |
| 技能 | `SkillPlugin` | 自定义工具 |
| Gateway 钩子 | `GatewayHook` | 启动/停止事件 |
| 工具 | `ToolDefinition` | 浏览器、代码执行 |
| 模型 | `ModelProvider` | 自定义 LLM 接口 |

## 性能考虑

### 扩展性

- Gateway 支持水平扩展（通过负载均衡）
- 会话状态可外部化（Redis 等）
- 模型调用可异步化

### 资源管理

- 自动清理过期会话
- 浏览器连接池管理
- 内存使用监控

### 缓存策略

- 模型响应缓存
- 技能元数据缓存
- 配置缓存

## 本课小结

在本课程中，你学习了：

- ✅ OpenClaw 的整体架构设计
- ✅ Gateway、Agent、频道层的职责
- ✅ 消息流入流出的完整流程
- ✅ 插件系统的工作原理
- ✅ 会话管理机制
- ✅ 关键设计决策和扩展点

## 下一课预告

> 下一课我们学习 **[API 参考](../api-reference/)**。
>
> 你会学到：
> - WebSocket API 详细说明
> - HTTP API 端点
> - OpenAI 兼容接口

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Gateway 入口 | [`src/index.ts`](https://github.com/openclaw/openclaw/blob/main/src/index.ts) | 程序入口 |
| Gateway 实现 | [`src/gateway/server.impl.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server.impl.ts) | 核心服务 |
| Pi Agent | [`src/agents/pi-embedded.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-embedded.ts) | AI 运行时 |
| 频道插件 | [`src/channels/plugins/`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/) | 频道集成 |
| 插件系统 | [`src/plugins/`](https://github.com/openclaw/openclaw/blob/main/src/plugins/) | 扩展框架 |
| 配置系统 | [`src/config/`](https://github.com/openclaw/openclaw/blob/main/src/config/) | 配置管理 |
| 工具实现 | [`src/tools/`](https://github.com/openclaw/openclaw/blob/main/src/tools/) | 内置工具 |

**架构特点**：
- ESM 模块系统
- TypeScript 全栈
- 依赖注入模式
- 事件驱动架构

</details>
