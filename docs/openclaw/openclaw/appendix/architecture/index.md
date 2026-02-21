---
title: "Architecture - OpenClaw Internal Principles | OpenClaw Tutorial"
sidebarTitle: "Architecture"
subtitle: "Architecture Design - OpenClaw Internal Principles"
description: "Deep dive into OpenClaw's system architecture, data flow, module relationships. Understand core components like Gateway, Agent, and Channels."
tags:
  - "Architecture"
  - "Principles"
  - "Internals"
order: 180
---

# Architecture Design - OpenClaw Internal Principles

## What You'll Learn

After completing this course, you will be able to:
- Understand OpenClaw's overall architecture design
- Master how each core component works
- Understand data flow and message processing
- Lay the foundation for secondary development and extension

## System Architecture Overview

OpenClaw adopts a modular design consisting of multiple loosely coupled subsystems:

```
┌─────────────────────────────────────────────────────────────────┐
│                  OpenClaw System Architecture                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      CLI Layer                            │  │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │  │
│  │  │  agent  │ │ gateway │ │ config  │ │ doctor  │ ...    │  │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │  │
│  └───────┼───────────┼───────────┼───────────┼─────────────┘  │
│          │           │           │           │                 │
│          └───────────┴─────┬─────┴───────────┘                 │
│                            │                                   │
│                            ▼                                   │
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
│                            │                                   │
│                            ▼                                   │
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
│                            │                                   │
│                            ▼                                   │
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
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Gateway Service

Gateway is OpenClaw's core service responsible for message routing, API provision, and UI services.

**Main Responsibilities**:
- WebSocket control channel
- HTTP API (OpenAI compatible)
- Web Control UI
- Channel management
- Session management

**Key Files**:
- `src/gateway/server.impl.ts` - Gateway main implementation
- `src/gateway/server-channels.ts` - Channel management
- `src/gateway/server-chat.ts` - Chat processing
- `src/gateway/server-methods.ts` - WebSocket methods

### 2. Agent Layer (Pi)

Pi Agent is OpenClaw's AI runtime, responsible for calling LLMs, executing skills, and tools.

**Main Responsibilities**:
- LLM calls and streaming processing
- Skill loading and execution
- Tool invocation (browser, code execution, etc.)
- Context management

**Key Files**:
- `src/agents/pi-embedded.ts` - Pi Agent main implementation
- `src/agents/model-selection.ts` - Model selection
- `src/agents/model-fallback.ts` - Failover handling
- `src/agents/skills.ts` - Skill system

### 3. Channel Layer

The Channel layer handles integration with various messaging platforms.

**Main Responsibilities**:
- Message sending and receiving
- Protocol adaptation
- Pairing management
- Message normalization

**Key Files**:
- `src/channels/plugins/index.ts` - Channel plugin entry
- `src/channels/plugins/outbound/*.ts` - Message sending
- `src/channels/plugins/pairing.ts` - Pairing logic

### 4. Configuration System

The configuration system manages all OpenClaw settings.

**Configuration Hierarchy**:
1. Default configuration
2. File configuration (`~/.openclaw/openclaw.json`)
3. Environment variables
4. Command line arguments

**Key Files**:
- `src/config/config.ts` - Configuration loading
- `src/config/types.*.ts` - Type definitions

## Data Flow

### Message Inflow Process

```
User Message (WhatsApp/Telegram/...)
         │
         ▼
┌─────────────────┐
│  Channel Adapter│  Protocol adaptation, message parsing
│  (normalize)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gateway Router │  Route to session/agent
│  (routing)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Session Manager│  Session state management
│  (session)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pi Agent       │  LLM invocation
│  (agent)        │  Skill execution
└────────┬────────┘
         │
         ▼
    AI Response
```

### Message Outflow Process

```
AI Response
    │
    ▼
┌─────────────────┐
│  Response       │  Format response
│  Formatter      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Channel        │  Select target channel
│  Selector       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Outbound       │  Send message
│  Adapter        │
└────────┬────────┘
         │
         ▼
   User receives message
```

## Plugin System

OpenClaw uses a plugin architecture for extensibility:

```typescript
// Plugin lifecycle
interface OpenClawPlugin {
  // Metadata
  name: string;
  version: string;
  
  // Lifecycle hooks
  onLoad?: (context: PluginContext) => Promise<void>;
  onUnload?: () => Promise<void>;
  
  // Gateway hooks
  onGatewayStart?: (event: GatewayStartEvent) => Promise<void>;
  onGatewayStop?: (event: GatewayStopEvent) => Promise<void>;
  
  // Optional features
  gatewayMethods?: GatewayMethod[];
  channels?: ChannelDefinition[];
  skills?: SkillDefinition[];
}
```

**Plugin Types**:
- **Channel Plugins**: Add new messaging channels
- **Skill Plugins**: Add new skills
- **Tool Plugins**: Add new tools
- **Hook Plugins**: Extend Gateway lifecycle

## Session Management

Sessions are the basic unit of conversation in OpenClaw:

```typescript
// Session data structure
interface Session {
  sessionId: string;           // Unique ID
  sessionKey: string;          // Session key
  agentId: string;             // Associated Agent
  channel: string;             // Source channel
  chatType: 'dm' | 'group';    // Chat type
  
  // State
  context: Message[];          // Conversation context
  modelOverride?: string;      // Model override
  thinkingLevel?: string;      // Thinking level
  
  // Metadata
  createdAt: number;
  updatedAt: number;
  lastMessageAt?: number;
}
```

**Session Storage**:
- Default location: `~/.openclaw/sessions/`
- Format: JSONL (one session record per line)
- Automatic persistence

## Key Design Decisions

### 1. Local-First

- All data is stored locally by default
- No cloud service required to run
- Optional remote model API calls

### 2. Multi-Channel Abstraction

- Unified channel interface
- Adapter pattern for handling different protocols
- Normalized message format

### 3. Skills as Code

- Skills are installable, updatable code packages
- Support for multiple runtimes (Node.js, Python, Docker)
- Version management and dependency resolution

### 4. Streaming Response

- LLM responses streamed in real-time
- WebSocket pushes status updates
- Progressive UI rendering

## Extension Points

OpenClaw provides multiple extension points for developers:

| Extension Point | Interface | Example |
| --- | --- | --- |
| Channel | `ChannelPlugin` | Custom messaging platform |
| Skill | `SkillPlugin` | Custom tool |
| Gateway Hook | `GatewayHook` | Start/stop events |
| Tool | `ToolDefinition` | Browser, code execution |
| Model | `ModelProvider` | Custom LLM interface |

## Performance Considerations

### Scalability

- Gateway supports horizontal scaling (via load balancing)
- Session state can be externalized (Redis, etc.)
- Model calls can be asynchronous

### Resource Management

- Automatic cleanup of expired sessions
- Browser connection pool management
- Memory usage monitoring

### Caching Strategy

- Model response caching
- Skill metadata caching
- Configuration caching

## Lesson Summary

In this course, you learned:

- ✅ OpenClaw's overall architecture design
- ✅ Responsibilities of Gateway, Agent, and Channel layers
- ✅ Complete message inflow and outflow process
- ✅ How the plugin system works
- ✅ Session management mechanism
- ✅ Key design decisions and extension points

## Next Lesson

> In the next lesson, we'll cover **[API Reference](../api-reference/)**.
>
> You'll learn:
> - WebSocket API detailed documentation
> - HTTP API endpoints
> - OpenAI compatible interface

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand and view source locations</strong></summary>

> Last updated: 2026-02-14

| Component | File Path | Description |
| --- | --- | --- |
| Gateway Entry | [`src/index.ts`](https://github.com/openclaw/openclaw/blob/main/src/index.ts) | Program entry point |
| Gateway Implementation | [`src/gateway/server.impl.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server.impl.ts) | Core service |
| Pi Agent | [`src/agents/pi-embedded.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-embedded.ts) | AI runtime |
| Channel Plugins | [`src/channels/plugins/`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/) | Channel integration |
| Plugin System | [`src/plugins/`](https://github.com/openclaw/openclaw/blob/main/src/plugins/) | Extension framework |
| Configuration System | [`src/config/`](https://github.com/openclaw/openclaw/blob/main/src/config/) | Configuration management |
| Tool Implementation | [`src/tools/`](https://github.com/openclaw/openclaw/blob/main/src/tools/) | Built-in tools |

**Architecture Features**:
- ESM module system
- TypeScript full-stack
- Dependency injection pattern
- Event-driven architecture

</details>
