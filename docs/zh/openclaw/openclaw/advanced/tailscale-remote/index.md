---
title: "Tailscale 远程访问 - 安全暴露 Gateway | OpenClaw 教程"
sidebarTitle: "Tailscale 远程访问"
subtitle: "Tailscale 远程访问 - 安全暴露 Gateway"
description: "学习如何配置 Tailscale Serve/Funnel，实现安全的远程访问，以及 mDNS/Bonjour 设备发现。"
tags:
  - "Tailscale"
  - "远程访问"
  - "安全"
  - "组网"
order: 140
---

# Tailscale 远程访问 - 安全暴露 Gateway

## 学完你能做什么

完成本课程后，你将能够：
- 配置 Tailscale 集成
- 使用 Tailscale Serve/Funnel 暴露 Gateway
- 实现安全的远程访问
- 配置 mDNS/Bonjour 设备发现

## 核心思路

Tailscale 是一个基于 WireGuard 的零配置 VPN 解决方案，让你可以安全地从任何地方访问 OpenClaw Gateway。

```
┌─────────────────────────────────────────────────────────────┐
│                 Tailscale 组网架构                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   外部用户                                                   │
│       │                                                     │
│       │  Tailscale Funnel (可选)                           │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Tailscale 网络                         │  │
│   │                                                   │  │
│   │  ┌─────────────┐         ┌─────────────────────┐  │  │
│   │  │  你的设备    │ ←────→ │  OpenClaw Gateway   │  │  │
│   │  │  (手机/PC)  │  WireGuard │  (家中服务器)     │  │  │
│   │  └─────────────┘   隧道   └─────────┬───────────┘  │  │
│   │                                      │              │  │
│   │                           ┌──────────┴──────────┐   │  │
│   │                           │  Tailscale Coord    │   │  │
│   │                           │  (DERP 中继)        │   │  │
│   │                           └─────────────────────┘   │  │
│   │                                                     │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   特点：                                                     │
│   - 端到端加密                                              │
│   - 无需公网 IP                                             │
│   - NAT 穿透                                                │
│   - 细粒度访问控制                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 三种访问模式

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| **Tailscale VPN** | 加入同一 Tailnet 访问 | 团队/家庭使用 |
| **Tailscale Serve** | 向 Tailnet 暴露服务 | 局域网内共享 |
| **Tailscale Funnel** | 向互联网暴露服务 | 对外提供服务 |

## 前置要求

1. **Tailscale 账户**  
   访问 [tailscale.com](https://tailscale.com) 注册免费账户

2. **安装 Tailscale**  
   在 Gateway 主机和用户设备上安装 Tailscale

```bash
# macOS
brew install tailscale

# Linux
curl -fsSL https://tailscale.com/install.sh | sh

# 其他系统参见 https://tailscale.com/download
```

3. **登录 Tailscale**

```bash
sudo tailscale up
# 按提示在浏览器中完成登录
```

## 跟我做

### 第 1 步：启用 Tailscale 集成

**为什么**  
OpenClaw 需要知道是否使用 Tailscale 进行网络配置。

```bash
# 启用 Tailscale 模式
openclaw config set gateway.tailscale.mode serve

# 可选模式: off, serve, funnel
# - off: 不使用 Tailscale
# - serve: 仅向 Tailnet 暴露
# - funnel: 向互联网暴露

# 验证配置
openclaw config get gateway.tailscale
```

**Tailscale 配置选项**

```json
{
  "gateway": {
    "tailscale": {
      "mode": "serve",
      "resetOnExit": false
    }
  }
}
```

### 第 2 步：配置 Tailscale Serve

**为什么**  
将 Gateway 服务安全地暴露给 Tailnet 中的其他设备。

```bash
# 在 Gateway 主机上配置 Serve
sudo tailscale serve --https 18789 localhost:18789

# 验证服务已暴露
sudo tailscale serve status
```

**你应该看到**

```
┌─────────────────────────────────────┐
│  Tailscale Serve Status             │
├─────────────────────────────────────┤
│  https://openclaw-gateway.tailnet   │
│  └── /  proxy http://localhost:18789│
│                                     │
│  Funnel: not configured             │
└─────────────────────────────────────┘
```

### 第 3 步：从其他设备访问

**为什么**  
验证 Tailscale 连接是否正常工作。

在另一台已加入同一 Tailnet 的设备上：

```bash
# 获取 Gateway 主机的 Tailscale IP
ping openclaw-gateway

# 测试 Gateway 连接
curl https://openclaw-gateway.tailnet-xyz.ts.net/status

# 配置 OpenClaw CLI 使用远程 Gateway
openclaw config set gateway.host "openclaw-gateway.tailnet-xyz.ts.net"
openclaw config set gateway.port 443
openclaw config set gateway.tls true

# 测试连接
openclaw status
```

### 第 4 步：配置 Tailscale Funnel（可选）

**为什么**  
如果需要从 Tailnet 外部访问（如没有安装 Tailscale 的朋友）。

::: warning 安全警告
Funnel 会向公共互联网暴露你的服务，请确保已配置强认证。
:::

```bash
# 启用 Funnel
sudo tailscale funnel --https 18789 localhost:18789

# 验证 Funnel 状态
sudo tailscale funnel status
```

**配置强认证**

```bash
# 配置 Token 认证（强烈推荐）
openclaw config set gateway.auth.mode token
openclaw config set gateway.auth.token "$(openssl rand -hex 32)"

# 或者配置密码认证
openclaw config set gateway.auth.mode password
openclaw config set gateway.auth.password "your-strong-password"
```

### 第 5 步：配置 mDNS/Bonjour 发现

**为什么**  
让局域网内的设备自动发现 Gateway。

```bash
# 启用 mDNS 发现
openclaw config set discovery.mdns.mode auto

# 配置设备显示名称
openclaw config set discovery.mdns.name "My OpenClaw Gateway"

# 启用 Bonjour（macOS/iOS）
openclaw config set discovery.bonjour.enabled true
```

**发现配置示例**

```json
{
  "discovery": {
    "mdns": {
      "mode": "auto",
      "name": "OpenClaw Gateway"
    },
    "bonjour": {
      "enabled": true
    },
    "wideArea": {
      "enabled": false,
      "domain": ""
    }
  }
}
```

### 第 6 步：配置访问控制

**为什么**  
限制谁可以访问你的 Gateway。

**Tailscale ACL 配置**

在 Tailscale 管理控制台中配置 ACL：

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:family"],
      "dst": ["tag:openclaw:18789"]
    }
  ],
  "tagOwners": {
    "tag:openclaw": ["autogroup:admin"]
  }
}
```

**OpenClaw 访问控制**

```bash
# 配置频道允许列表
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx"

# 配置 Agent 访问控制
openclaw config set agents.defaults.allowList "["user1@tailnet","user2@tailnet"]"
```

## 检查点 ✅

验证 Tailscale 集成：

```bash
# 检查 Tailscale 状态
sudo tailscale status

# 预期输出
┌────────────────────────────────────────────────────────────┐
│  Tailscale Status                                          │
├────────────────────────────────────────────────────────────┤
│  openclaw-gateway  100.x.x.x    linux   -                  │
│  my-laptop         100.x.x.y    macOS   active  direct     │
│  my-phone          100.x.x.z    iOS     active  relay      │
└────────────────────────────────────────────────────────────┘

# 检查 OpenClaw Tailscale 集成
openclaw status

# 预期输出
┌─────────────────────────────────────┐
│  OpenClaw Status                    │
├─────────────────────────────────────┤
│  Gateway:     ✅ Running            │
│  Port:        18789                 │
│  Tailscale:   ✅ Serve mode         │
│  Tailnet:     xxxxx.tailnet-xyz.ts.net │
│  mDNS:        ✅ Active             │
└─────────────────────────────────────┘
```

## 移动端访问配置

### iOS 配置

1. 安装 [Tailscale iOS App](https://apps.apple.com/app/tailscale/id1470499037)
2. 使用相同账户登录
3. 打开 Safari，访问 `https://openclaw-gateway.tailnet-xyz.ts.net`

### Android 配置

1. 安装 [Tailscale Android App](https://play.google.com/store/apps/details?id=com.tailscale.ipn)
2. 使用相同账户登录
3. 使用浏览器或 HTTP 客户端访问 Gateway

## 踩坑提醒

::: warning 常见问题
1. **Tailscale 未连接**  
   症状：`tailscale status` 显示离线  
   解决：运行 `sudo tailscale up` 确保已登录

2. **防火墙阻止**  
   症状：Tailscale 连接但无法访问 Gateway  
   解决：检查本地防火墙规则，允许 Tailscale 接口 (tailscale0)

3. **证书错误**  
   症状：`certificate not trusted`  
   解决：Tailscale 使用自有 CA，确保设备已安装 Tailscale 证书

4. **Funnel 限制**  
   症状：Funnel 无法启用  
   解决：免费账户有带宽限制，检查 Tailscale 控制台

5. **mDNS 不工作**  
   症状：设备无法自动发现  
   解决：检查本地网络是否支持多播，尝试 `discovery.mdns.mode: "off"` 使用 IP 直连
:::

## 高级配置

### 使用 MagicDNS

Tailscale 的 MagicDNS 为每个设备分配域名：

```bash
# 启用 MagicDNS
# 在 Tailscale 管理控制台中启用

# 然后可以直接使用主机名访问
curl https://openclaw-gateway.tailnet-xyz.ts.net:18789/status
```

### 配置 HTTPS 证书

Tailscale 自动为设备提供 HTTPS 证书：

```bash
# 获取 HTTPS 证书
sudo tailscale cert openclaw-gateway.tailnet-xyz.ts.net

# 证书位置
# /var/lib/tailscale/certs/openclaw-gateway.tailnet-xyz.ts.net.crt
# /var/lib/tailscale/certs/openclaw-gateway.tailnet-xyz.ts.net.key
```

### 子网路由

如果需要访问局域网内的其他设备：

```bash
# 启用子网路由
sudo tailscale up --advertise-routes=192.168.1.0/24

# 在管理控制台批准路由
```

## 本课小结

在本课程中，你学习了：

- ✅ Tailscale 的工作原理和优势
- ✅ 配置 Tailscale Serve 暴露 Gateway
- ✅ 从其他设备安全访问 Gateway
- ✅ 配置 Tailscale Funnel（谨慎使用）
- ✅ 启用 mDNS/Bonjour 设备发现
- ✅ 配置访问控制策略
- ✅ 移动端访问配置

## 下一课预告

> 下一课我们学习 **[故障排查](../../faq/troubleshooting/)**。
>
> 你会学到：
> - 常见问题的诊断方法
> - 使用 doctor 命令修复问题
> - 日志分析和调试技巧

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Tailscale 集成 | [`src/gateway/server-tailscale.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-tailscale.ts) | - |
| 发现服务 | [`src/gateway/server-discovery.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-discovery.ts) | - |
| 发现运行时 | [`src/gateway/server-discovery-runtime.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-discovery-runtime.ts) | - |
| mDNS/Bonjour | [`src/gateway/server-discovery.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-discovery.ts) | - |

**Tailscale 模式**：
- `off`: 不使用 Tailscale
- `serve`: 向 Tailnet 暴露服务
- `funnel`: 向互联网暴露服务

**发现协议**：
- mDNS: 多播 DNS（跨平台）
- Bonjour: Apple 的设备发现协议
- Wide Area: 广域网发现

</details>
