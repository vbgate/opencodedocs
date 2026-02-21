---
title: "安全指南 - 保护你的 AI 助手 | OpenClaw 教程"
sidebarTitle: "安全指南"
subtitle: "安全指南 - 保护你的 AI 助手"
description: "深入理解 OpenClaw 安全模型、DM 配对机制、沙箱执行和访问控制，学习如何保护你的 AI 助手和数据安全。"
tags:
  - "安全"
  - "认证"
  - "沙箱"
  - "访问控制"
order: 160
---

# 安全指南 - 保护你的 AI 助手

## 学完你能做什么

完成本课程后，你将能够：
- 理解 OpenClaw 的安全模型
- 配置 DM 配对保护机制
- 设置沙箱执行环境
- 实施全面的访问控制策略

## 核心思路

OpenClaw 采用多层安全架构，从网络、认证、执行到数据全方位保护你的 AI 助手。

```
┌─────────────────────────────────────────────────────────────┐
│                  OpenClaw 安全架构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 1: 网络安全                                    │  │
│   │  - Tailscale VPN                                     │  │
│   │  - mTLS/TLS 加密                                     │  │
│   │  - 防火墙规则                                        │  │
│   └─────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 2: 认证与授权                                  │  │
│   │  - Token/Password 认证                               │  │
│   │  - 频道允许列表                                      │  │
│   │  - DM 配对机制                                       │  │
│   └─────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 3: 执行安全                                    │  │
│   │  - 沙箱执行 (Docker)                                 │  │
│   │  - 代码隔离                                          │  │
│   │  - 资源限制                                          │  │
│   └─────────────────────────────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Layer 4: 数据安全                                    │  │
│   │  - 本地优先存储                                      │  │
│   │  - 加密存储                                          │  │
│   │  - 会话隔离                                          │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 安全设计原则

| 原则 | 说明 | 实现 |
|------|------|------|
| **本地优先** | 数据保留在用户设备 | 自托管架构 |
| **最小权限** | 仅授予必要权限 | 白名单机制 |
| **深度防御** | 多层安全控制 | 4 层安全架构 |
| **透明可审计** | 操作可追踪 | 详细日志 |

## 跟我做

### 第 1 步：配置强认证

**为什么**  
防止未授权访问 Gateway 服务。

```bash
# 生成安全 Token
export GATEWAY_TOKEN=$(openssl rand -hex 32)
echo "Generated Token: $GATEWAY_TOKEN"

# 配置 Token 认证
openclaw config set gateway.auth.mode token
openclaw config set gateway.auth.token "$GATEWAY_TOKEN"

# 或者配置强密码
openclaw config set gateway.auth.mode password
openclaw config set gateway.auth.password "$(openssl rand -base64 24)"
```

**认证方式对比**

| 方式 | 安全性 | 适用场景 | 配置 |
|------|--------|----------|------|
| **Token** | ⭐⭐⭐⭐⭐ | 生产环境推荐 | `mode: token` |
| **Password** | ⭐⭐⭐ | 本地开发 | `mode: password` |
| **Off** | ⭐ | 仅测试 | `mode: off` |

### 第 2 步：配置频道访问控制

**为什么**  
限制哪些用户可以触发 AI 助手。

```bash
# WhatsApp 允许列表
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx,+86139xxxxxxxx"

# Telegram 允许列表
openclaw config set channels.telegram.allowFrom "@username1,@username2"

# Discord 允许列表（用户 ID）
openclaw config set channels.discord.allowFrom "123456789,987654321"
```

**群组安全策略**

```bash
# 设置群组策略
openclaw config set channels.whatsapp.groupPolicy "owner-only"
openclaw config set channels.telegram.groupPolicy "admins"
openclaw config set channels.discord.guildPolicy "admins"

# 策略选项
# "owner-only": 仅所有者
# "admins": 管理员和所有者
# "everyone": 所有成员（不推荐）
# "none": 群组中禁用
```

### 第 3 步：启用 DM 配对

**为什么**  
DM 配对是一种安全机制，防止陌生人直接私聊 AI 助手。

```bash
# 启用 DM 配对（推荐）
openclaw config set channels.whatsapp.dmPolicy "pairing"
openclaw config set channels.telegram.dmPolicy "pairing"
openclaw config set channels.discord.dmPolicy "pairing"
```

**DM 配对流程**

```
用户首次发送 DM
      │
      ▼
┌─────────────────────┐
│  AI: 请完成配对验证  │
│  验证码: ABC123      │
└─────────────────────┘
      │
      ▼
用户在 Gateway UI 或 CLI 确认配对
      │
      ▼
┌─────────────────────┐
│  配对成功            │
│  后续对话正常进行    │
└─────────────────────┘
```

**管理已配对用户**

```bash
# 查看已配对用户
openclaw pairing list

# 取消配对
openclaw pairing remove whatsapp:+86138xxxxxxxx

# 清除所有配对
openclaw pairing clear
```

### 第 4 步：配置沙箱执行

**为什么**  
代码执行可能带来安全风险，需要隔离环境。

```bash
# 启用 Docker 沙箱
openclaw config set tools.codeExecution.sandbox.enabled true

# 配置资源限制
openclaw config set tools.codeExecution.sandbox.memoryLimit "512m"
openclaw config set tools.codeExecution.sandbox.cpuLimit "1.0"
openclaw config set tools.codeExecution.sandbox.timeout 30000

# 禁用危险操作
openclaw config set tools.codeExecution.allowNetwork false
openclaw config set tools.codeExecution.allowFileWrite false
```

**沙箱配置示例**

```json
{
  "tools": {
    "codeExecution": {
      "sandbox": {
        "enabled": true,
        "image": "openclaw/sandbox:latest",
        "memoryLimit": "512m",
        "cpuLimit": "1.0",
        "timeout": 30000,
        "readOnly": true
      },
      "allowNetwork": false,
      "allowFileWrite": false,
      "allowedPaths": ["/tmp", "/workspace"]
    }
  }
}
```

### 第 5 步：配置执行审批

**为什么**  
敏感操作需要人工确认，防止 AI 误操作。

```bash
# 启用执行审批
openclaw config set approvals.enabled true

# 配置需要审批的操作
openclaw config set approvals.requireFor "["file-delete","network-request","system-command"]"

# 配置审批超时
openclaw config set approvals.timeout 300000
```

**审批流程**

```
AI 请求执行敏感操作
      │
      ▼
┌─────────────────────┐
│  操作待审批          │
│  类型: file-delete   │
│  目标: /important    │
└─────────────────────┘
      │
      ▼
等待用户确认（Gateway UI/通知）
      │
      ▼
┌─────────────────────┐
│  ✅ 批准  /  ❌ 拒绝 │
└─────────────────────┘
```

### 第 6 步：配置网络隔离

**为什么**  
限制 AI 可以访问的网络资源。

```bash
# 配置 Gateway 绑定地址
openclaw config set gateway.bind "loopback"  # 仅本地访问

# 或者使用 Tailscale 网络
openclaw config set gateway.bind "tailnet"
```

**绑定模式对比**

| 模式 | 说明 | 安全性 |
|------|------|--------|
| `loopback` | 仅 127.0.0.1 | ⭐⭐⭐⭐⭐ |
| `lan` | 局域网 0.0.0.0 | ⭐⭐⭐ |
| `tailnet` | Tailscale 网络 | ⭐⭐⭐⭐⭐ |
| `auto` | 自动选择 | ⭐⭐⭐ |

### 第 7 步：数据加密和备份

**为什么**  
保护敏感配置和对话数据。

```bash
# 配置凭据存储（使用系统钥匙串）
openclaw config set auth.useKeychain true

# 配置会话加密
openclaw config set session.encryption.enabled true

# 定期备份配置
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d)
```

## 安全检查清单

### 生产环境配置

```yaml
✅ 网络安全:
  - [ ] 使用 Tailscale VPN 或 HTTPS
  - [ ] Gateway 绑定到非公共地址
  - [ ] 防火墙限制入站连接

✅ 认证:
  - [ ] 启用 Token 或强密码认证
  - [ ] 定期轮换凭证
  - [ ] API Key 存储在环境变量

✅ 访问控制:
  - [ ] 配置频道允许列表
  - [ ] 启用 DM 配对
  - [ ] 设置适当的群组策略

✅ 执行安全:
  - [ ] 启用 Docker 沙箱
  - [ ] 配置资源限制
  - [ ] 禁用不必要的网络访问

✅ 审批:
  - [ ] 启用敏感操作审批
  - [ ] 配置审批通知
  - [ ] 设置审批超时

✅ 日志:
  - [ ] 启用审计日志
  - [ ] 配置日志保留策略
  - [ ] 监控异常活动
```

## 安全最佳实践

### 1. 定期更新

```bash
# 检查更新
openclaw update check

# 更新到最新版本
npm install -g openclaw@latest
```

### 2. 最小权限原则

- 仅启用需要的频道
- 仅允许信任的用户访问
- 仅授予必要的技能权限

### 3. 监控和审计

```bash
# 查看安全日志
openclaw logs --level warn

# 检查访问记录
openclaw auth logs

# 查看配对历史
openclaw pairing history
```

### 4. 应急响应

```bash
# 紧急禁用所有频道
openclaw channels disable-all

# 重置所有配对
openclaw pairing clear

# 轮换 Gateway Token
openclaw config set gateway.auth.token "$(openssl rand -hex 32)"
```

## 常见安全威胁

| 威胁 | 风险 | 防护措施 |
|------|------|----------|
| 未授权访问 | 数据泄露 | Token 认证 + 允许列表 |
| 提示注入 | 恶意操作 | 输入验证 + 审批机制 |
| 资源耗尽 | DoS 攻击 | 速率限制 + 资源配额 |
| 代码执行 | 系统入侵 | 沙箱隔离 |
| 会话劫持 | 身份冒充 | TLS + 会话验证 |

## 本课小结

在本课程中，你学习了：

- ✅ OpenClaw 的 4 层安全架构
- ✅ 配置强认证方式
- ✅ 实施频道访问控制
- ✅ 启用 DM 配对机制
- ✅ 配置沙箱执行环境
- ✅ 设置执行审批流程
- ✅ 数据加密和备份
- ✅ 安全最佳实践

## 下一课预告

> 下一课我们学习 **[CLI 命令参考](../commands-reference/)**。
>
> 你会学到：
> - 所有 CLI 命令的详细说明
> - 命令参数和选项
> - 使用示例

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Gateway 认证 | [`src/gateway/auth-*.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/) | - |
| 执行审批管理 | [`src/gateway/exec-approval-manager.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/exec-approval-manager.ts) | - |
| Agent 沙箱 | [`src/agents/sandbox*.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/) | - |
| 安全模块 | [`src/security/`](https://github.com/openclaw/openclaw/blob/main/src/security/) | - |
| 频道配对 | [`src/channels/plugins/pairing.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/pairing.ts) | - |
| 安全配置 | [`src/config/types.auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.auth.ts) | - |

**安全相关配置**：
- `gateway.auth.mode`: 认证模式
- `gateway.auth.token`: Token 凭证
- `gateway.auth.password`: 密码凭证
- `channels.*.allowFrom`: 允许列表
- `channels.*.dmPolicy`: DM 配对策略
- `tools.codeExecution.sandbox`: 沙箱配置
- `approvals.enabled`: 审批开关

</details>
