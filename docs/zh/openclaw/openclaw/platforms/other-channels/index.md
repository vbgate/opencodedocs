---
title: "其他频道配置 - Signal、BlueBubbles、Teams 等 | OpenClaw 教程"
sidebarTitle: "其他频道配置"
subtitle: "其他频道配置 - Signal、BlueBubbles、Teams 等"
description: "了解其他消息频道的配置方法，包括 Signal、BlueBubbles、MS Teams、Matrix、Zalo 等平台的集成指南。"
tags:
  - "Signal"
  - "BlueBubbles"
  - "Teams"
  - "Matrix"
  - "Zalo"
order: 90
---

# 其他频道配置 - Signal、BlueBubbles、Teams 等

## 学完你能做什么

完成本课程后，你将能够：
- 配置 Signal、BlueBubbles、MS Teams 等频道
- 了解各平台的特殊要求和限制
- 根据需求选择合适的通讯平台
- 扩展自定义频道支持

## 支持的扩展频道

除核心频道外，OpenClaw 通过扩展支持更多平台：

| 频道 | 技术方案 | 特点 | 安装方式 |
|------|----------|------|----------|
| **Signal** | libsignal | 高隐私、端到端加密 | 内置 |
| **BlueBubbles** | BlueBubbles API | iMessage 桥接 | 扩展 |
| **MS Teams** | Microsoft Graph | 企业集成 | 扩展 |
| **Matrix** | Matrix JS SDK | 去中心化、联邦 | 扩展 |
| **Zalo** | Zalo API | 越南主流平台 | 扩展 |
| **IRC** | irc-framework | 经典协议 | 内置 |
| **Google Chat** | Google APIs | Google 工作区 | 内置 |

## Signal 配置

### 为什么使用 Signal

- **隐私优先**：端到端加密，开源协议
- **安全设计**：开源代码，社区审计
- **去中心化**：不依赖单一公司

### 配置步骤

1. **安装 Signal CLI**（依赖）

```bash
# macOS
brew install signal-cli

# Linux
# 下载 signal-cli 并安装
wget https://github.com/AsamK/signal-cli/releases/download/v0.13.0/signal-cli-0.13.0.tar.gz
```

2. **注册 Signal 号码**

```bash
# 注册新号码
signal-cli -u +86138xxxxxxxx register

# 验证验证码
signal-cli -u +86138xxxxxxxx verify 123456
```

3. **配置 OpenClaw**

```bash
# 启用 Signal 频道
openclaw config set channels.signal.enabled true

# 配置 Signal 号码
openclaw config set channels.signal.phoneNumber "+86138xxxxxxxx"

# 配置 signal-cli 路径
openclaw config set channels.signal.cliPath "/usr/local/bin/signal-cli"

# 配置允许列表
openclaw config set channels.signal.allowFrom "+86139xxxxxxxx"
```

### Signal 配置选项

```json
{
  "channels": {
    "signal": {
      "enabled": true,
      "phoneNumber": "+86138xxxxxxxx",
      "cliPath": "/usr/local/bin/signal-cli",
      "dataPath": "~/.local/share/signal-cli",
      "allowFrom": ["+86139xxxxxxxx"],
      "dmPolicy": "pairing",
      "groupPolicy": "owner-only"
    }
  }
}
```

## BlueBubbles 配置

### 什么是 BlueBubbles

BlueBubbles 是一个 iMessage 桥接方案，让你在非 Apple 设备上使用 iMessage。

**架构**：
```
iPhone/Mac (BlueBubbles 服务器) ←→ 你的设备 (OpenClaw)
         ↓
     iMessage 网络
```

### 前置要求

1. **Mac 设备**（作为服务器）
2. **iMessage 账户**
3. **BlueBubbles 服务器** 安装在 Mac 上

### 配置步骤

1. **在 Mac 上安装 BlueBubbles**

   访问 [bluebubbles.app](https://bluebubbles.app) 下载并安装。

2. **配置 BlueBubbles 服务器**

   - 打开 BlueBubbles 应用
   - 启用服务器功能
   - 记录服务器 URL 和密码

3. **安装 OpenClaw 扩展**

```bash
# 安装 BlueBubbles 扩展
openclaw plugins install bluebubbles
```

4. **配置 OpenClaw**

```bash
# 启用 BlueBubbles
openclaw config set bluebubbles.enabled true

# 配置服务器地址
openclaw config set bluebubbles.serverUrl "http://192.168.1.100:1234"

# 配置密码
openclaw config set bluebubbles.password "your-server-password"

# 配置允许列表
openclaw config set bluebubbles.allowFrom "+86138xxxxxxxx"
```

### BlueBubbles 配置示例

```json
{
  "bluebubbles": {
    "enabled": true,
    "serverUrl": "http://192.168.1.100:1234",
    "password": "${BLUEBUBBLES_PASSWORD}",
    "allowFrom": ["+86138xxxxxxxx"],
    "dmPolicy": "allow",
    "groupPolicy": "admins"
  }
}
```

## MS Teams 配置

### 前置要求

1. **Microsoft 365 开发者账户**
2. **Azure AD 应用注册**
3. **Teams 管理员权限**

### 配置步骤

1. **注册 Azure AD 应用**

   - 访问 [Azure Portal](https://portal.azure.com)
   - 进入 **Azure Active Directory** → **App registrations**
   - 点击 **New registration**
   - 输入应用名称，选择 **Accounts in this organizational directory only**
   - 点击 **Register**

2. **添加 API 权限**

   在 **API permissions** 中添加：
   - `ChannelMessage.Read.All`
   - `ChannelMessage.Send`
   - `Chat.Read`
   - `Chat.ReadWrite`
   - `Group.Read.All`
   - `User.Read.All`

3. **创建客户端密钥**

   - 进入 **Certificates & secrets**
   - 点击 **New client secret**
   - 复制生成的密钥值

4. **安装扩展并配置**

```bash
# 安装 MS Teams 扩展
openclaw plugins install msteams

# 配置 Azure AD 凭据
openclaw config set msteams.tenantId "your-tenant-id"
openclaw config set msteams.clientId "your-client-id"
openclaw config set msteams.clientSecret "your-client-secret"

# 启用频道
openclaw config set msteams.enabled true
```

## Matrix 配置

### 什么是 Matrix

Matrix 是一个开放的去中心化通信协议，支持联邦（不同服务器间的通信）。

### 配置步骤

1. **安装 Matrix 扩展**

```bash
openclaw plugins install matrix
```

2. **获取 Matrix 账户**

   可以在 matrix.org 注册，或自建 Synapse 服务器。

3. **配置 OpenClaw**

```bash
# 配置 Homeserver
openclaw config set matrix.homeserver "https://matrix.org"

# 配置用户凭据
openclaw config set matrix.userId "@youruser:matrix.org"
openclaw config set matrix.accessToken "your-access-token"

# 启用频道
openclaw config set matrix.enabled true
```

4. **获取 Access Token**

```bash
# 使用 curl 获取 token
curl -X POST \
  https://matrix.org/_matrix/client/r0/login \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "m.login.password",
    "user": "youruser",
    "password": "yourpassword"
  }'
```

### Matrix 配置示例

```json
{
  "matrix": {
    "enabled": true,
    "homeserver": "https://matrix.org",
    "userId": "@youruser:matrix.org",
    "accessToken": "${MATRIX_ACCESS_TOKEN}",
    "rooms": ["!roomid:matrix.org"],
    "allowFrom": ["@friend:matrix.org"],
    "dmPolicy": "allow",
    "groupPolicy": "admins"
  }
}
```

## Zalo 配置

Zalo 是越南流行的即时通讯应用，OpenClaw 通过扩展支持。

### 配置步骤

```bash
# 安装 Zalo 扩展
openclaw plugins install zalo

# 配置 Zalo
openclaw config set zalo.enabled true
openclaw config set zalo.cookie "your-zalo-cookie"
openclaw config set zalo.imei "your-device-imei"

# 配置允许列表
openclaw config set zalo.allowFrom "user_id_1"
```

::: warning 注意
Zalo 集成需要提取浏览器 Cookie，请确保遵守 Zalo 的服务条款。
:::

## IRC 配置

IRC 是经典的互联网聊天协议，OpenClaw 内置支持。

```bash
# 启用 IRC
openclaw config set channels.irc.enabled true

# 配置服务器
openclaw config set channels.irc.server "irc.libera.chat"
openclaw config set channels.irc.port 6667

# 配置昵称
openclaw config set channels.irc.nickname "OpenClawBot"

# 配置加入的频道
openclaw config set channels.irc.channels "#openclaw,#general"

# 启用 SSL
openclaw config set channels.irc.secure true
```

## Google Chat 配置

### 创建 Google Chat Bot

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 **Google Chat API**
4. 在 **Configuration** 中创建 Bot
5. 记录 **Bot URL** 和 **Verification Token**

### 配置 OpenClaw

```bash
# 启用 Google Chat
openclaw config set channels.googlechat.enabled true

# 配置 Bot URL
openclaw config set channels.googlechat.webhookUrl "https://chat.googleapis.com/v1/spaces/..."

# 配置验证 Token
openclaw config set channels.googlechat.verificationToken "your-verification-token"
```

## 扩展频道开发入门

如果你想开发自定义频道扩展，可以参考以下结构：

```typescript
// 扩展目录结构
extensions/my-channel/
├── package.json
├── src/
│   ├── index.ts          # 扩展入口
│   ├── config.ts         # 配置类型
│   ├── client.ts         # 客户端实现
│   └── outbound.ts       # 消息发送
└── README.md

// 基本扩展结构
export default definePlugin({
  name: 'my-channel',
  version: '1.0.0',
  
  configSchema: {
    enabled: { type: 'boolean', default: false },
    apiKey: { type: 'string', required: true },
    allowFrom: { type: 'array', items: 'string' }
  },
  
  async onLoad(context) {
    // 初始化连接
    const client = new MyChannelClient(context.config);
    await client.connect();
    
    // 注册消息处理器
    client.onMessage((message) => {
      context.handleIncoming(message);
    });
  },
  
  async sendMessage(message) {
    // 实现消息发送
  }
});
```

## 检查点 ✅

验证扩展频道状态：

```bash
# 查看所有频道状态
openclaw channels status --all

# 查看特定扩展频道
openclaw channels status bluebubbles
openclaw channels status msteams

# 预期输出
┌─────────────────────────────────────┐
│  Channel Status                     │
├─────────────────────────────────────┤
│  whatsapp:    ✅ Connected           │
│  telegram:    ✅ Connected           │
│  signal:      ✅ Connected           │
│  bluebubbles: ✅ Connected           │
│  msteams:     🔧 Extension           │
│  matrix:      🔧 Extension           │
└─────────────────────────────────────┘
```

## 踩坑提醒

::: warning Signal 常见问题
1. **signal-cli 未安装**  
   症状：`signal-cli not found`  
   解决：安装 signal-cli 并配置正确路径

2. **号码未注册**  
   症状：`Number not registered`  
   解决：先运行 `signal-cli register` 注册号码

3. ** captcha 要求**  
   症状：`Captcha required`  
   解决：按提示完成 captcha 验证
:::

::: warning BlueBubbles 常见问题
1. **服务器不可达**  
   症状：`Connection refused`  
   解决：检查 Mac 服务器 IP 和端口，确保在同一网络

2. **Mac 进入睡眠**  
   症状：连接时断时续  
   解决：在 Mac 系统设置中禁用睡眠

3. **iMessage 未登录**  
   症状：消息发送失败  
   解决：在 Mac 上确保 iMessage 已登录
:::

::: warning MS Teams 常见问题
1. **权限不足**  
   症状：`Forbidden`  
   解决：检查 Azure AD 中的 API 权限设置

2. **Token 过期**  
   症状：`Unauthorized`  
   解决：重新生成 client secret

3. **Bot 未添加到团队**  
   症状：收不到消息  
   解决：在 Teams 中将应用添加到目标团队
:::

## 本课小结

在本课程中，你学习了：

- ✅ Signal 配置（高隐私优先）
- ✅ BlueBubbles iMessage 桥接
- ✅ MS Teams 企业集成
- ✅ Matrix 去中心化通信
- ✅ Zalo 和 IRC 配置
- ✅ Google Chat Bot 设置
- ✅ 自定义频道开发入门

## 下一课预告

> 下一课我们学习 **[模型配置](../../advanced/models-configuration/)**。
>
> 你会学到：
> - 配置多模型提供商
> - 设置模型故障转移
> - 自定义模型参数

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Signal 实现 | [`src/signal/`](https://github.com/openclaw/openclaw/blob/main/src/signal/) | - |
| iMessage (legacy) | [`src/imessage/`](https://github.com/openclaw/openclaw/blob/main/src/imessage/) | - |
| BlueBubbles 扩展 | [`extensions/bluebubbles/`](https://github.com/openclaw/openclaw/blob/main/extensions/bluebubbles/) | - |
| MS Teams 扩展 | [`extensions/msteams/`](https://github.com/openclaw/openclaw/blob/main/extensions/msteams/) | - |
| Matrix 扩展 | [`extensions/matrix/`](https://github.com/openclaw/openclaw/blob/main/extensions/matrix/) | - |
| Zalo 扩展 | [`extensions/zalo/`](https://github.com/openclaw/openclaw/blob/main/extensions/zalo/) | - |
| 扩展插件系统 | [`src/plugins/`](https://github.com/openclaw/openclaw/blob/main/src/plugins/) | - |

**扩展开发文档**：
- 扩展结构参考 `extensions/` 目录下的现有扩展
- 使用 `definePlugin()` API 定义扩展
- 实现 `onLoad` 和 `sendMessage` 方法

</details>
