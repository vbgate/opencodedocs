---
title: "Advanced: Config & Security | Antigravity-Manager"
sidebarTitle: "Advanced"
subtitle: "Advanced Configuration"
description: "Learn Antigravity Tools advanced configuration. Master security policies, scheduling, routing, monitoring, and deployment to build a stable production system."
order: 3
---

# Advanced Configuration

This chapter dives deep into Antigravity Tools' advanced features: configuration management, security policies, account scheduling, model routing, quota management, monitoring and statistics, and server deployment solutions. After mastering these topics, you can upgrade Antigravity Tools from "working" to "easy-to-use, stable, and operable."

## In This Chapter

| Tutorial | Description |
|----------|-------------|
| [Configuration Guide](./config/) | Complete fields of AppConfig/ProxyConfig, disk persistence locations, and hot reload semantics |
| [Security & Privacy](./security/) | `auth_mode`, `allow_lan_access`, and security baseline design |
| [High-Availability Scheduling](./scheduling/) | Rotation, pinned accounts, sticky sessions, and failure retry mechanisms |
| [Model Routing](./model-router/) | Custom mapping, wildcard priority, and preset strategies |
| [Quota Management](./quota/) | Combination of Quota Protection + Smart Warmup |
| [Proxy Monitor](./monitoring/) | Request logs, filtering, detail restoration, and export |
| [Token Stats](./token-stats/) | Cost-based statistical metrics and chart interpretation |
| [Long Session Stability](./context-compression/) | Context compression, signature caching, and tool result compression |
| [System Features](./system/) | Multi-language, themes, updates, startup items, and HTTP API Server |
| [Server Deployment](./deployment/) | Docker noVNC vs Headless Xvfb selection and operations |

## Recommended Learning Path

::: tip Recommended Order
This chapter covers a lot of content. It's recommended to learn in batches by module:
:::

**Phase 1: Configuration & Security (Required)**

```
Configuration Guide → Security & Privacy
config               security
```

First understand the configuration system (which settings require restart, which support hot reload), then learn security settings (especially when exposing to LAN/public internet).

**Phase 2: Scheduling & Routing (Recommended)**

```
High-Availability Scheduling → Model Routing
scheduling                   model-router
```

Learn to get maximum stability with minimum accounts, then use model routing to shield from upstream changes.

**Phase 3: Quota & Monitoring (As Needed)**

```
Quota Management → Proxy Monitor → Token Stats
quota               monitoring       token-stats
```

Prevent silent quota exhaustion, transform call blackbox into observable system, and optimize costs quantitatively.

**Phase 4: Stability & Deployment (Advanced)**

```
Long Session Stability → System Features → Server Deployment
context-compression        system          deployment
```

Solve hidden issues in long sessions, make the client more product-like, and finally learn server deployment.

**Quick Selection**:

| Your Scenario | Start With |
|---------------|------------|
| Unstable multi-account rotation | [High-Availability Scheduling](./scheduling/) |
| Want to pin a specific model name | [Model Routing](./model-router/) |
| Always running out of quota | [Quota Management](./quota/) |
| Want to view request logs | [Proxy Monitor](./monitoring/) |
| Want to track Token consumption | [Token Stats](./token-stats/) |
| Frequent errors in long conversations | [Long Session Stability](./context-compression/) |
| Need to expose to LAN | [Security & Privacy](./security/) |
| Need to deploy to server | [Server Deployment](./deployment/) |

## Prerequisites

::: warning Before Starting
- Completed [Getting Started](../start/) chapter (at least installation, add accounts, and start proxy)
- Completed at least one protocol integration in [Platforms & Integrations](../platforms/) (e.g., OpenAI or Anthropic)
- Local reverse proxy can respond to requests normally
:::

## Next Steps

After completing this chapter, you can continue learning:

- [FAQ](../faq/): Troubleshooting guide for 401/404/429/streaming interruption and other issues
- [Appendix](../appendix/): Reference materials like endpoint quick reference, data models, z.ai capability boundaries, etc.
