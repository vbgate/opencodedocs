---
title: "WebChat 界面：浏览器内的 AI 助手 | Clawdbot 教程"
sidebarTitle: "试试网页版 AI"
subtitle: "WebChat 界面：浏览器内的 AI 助手"
description: "学习如何使用 Clawdbot 内置的 WebChat 界面与 AI 助手对话。本教程介绍 WebChat 的访问方式、核心功能（会话管理、附件上传、Markdown 支持）和远程访问配置（SSH 隧道、Tailscale），无需额外端口或单独配置。"
tags:
  - "WebChat"
  - "浏览器界面"
  - "聊天"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# WebChat 界面：浏览器内的 AI 助手

## 学完你能做什么

完成本教程后，你将能够：

- ✅ 通过浏览器访问 WebChat 界面
- ✅ 在 WebChat 中发送消息并接收 AI 回复
- ✅ 管理会话历史和切换会话
- ✅ 上传附件（图片、音频、视频）
- ✅ 配置远程访问（Tailscale/SSH 隧道）
- ✅ 理解 WebChat 与其他渠道的区别

## 你现在的困境

你可能已经启动了 Gateway，但希望能有更直观的图形界面与 AI 助手对话，而不是只使用命令行。

你可能想知道：

- "有没有类似 ChatGPT 的网页界面？"
- "WebChat 和 WhatsApp/Telegram 渠道有什么区别？"
- "WebChat 需要单独配置吗？"
- "如何在远程服务器上使用 WebChat？"

好消息是：**WebChat 是 Clawdbot 内置的聊天界面**，无需单独安装或配置，启动 Gateway 后即可使用。

## 什么时候用这一招

当你需要：

- 🖥️ **图形界面对话**：偏好浏览器内的聊天体验，而非命令行
- 📊 **会话管理**：查看历史记录、切换不同会话
- 🌐 **本地访问**：在同一台设备上与 AI 对话
- 🔄 **远程访问**：通过 SSH/Tailscale 隧道访问远程 Gateway
- 💬 **富文本交互**：支持 Markdown 格式和附件

---

## 🎒 开始前的准备

在使用 WebChat 之前，请确认：

### 必需条件

| 条件                     | 如何检查                                        |
|--- | ---|
| **Gateway 已启动**   | `clawdbot gateway status` 或查看进程是否在运行 |
| **端口可访问**       | 确认 18789 端口（或自定义端口）未被占用 |
| **AI 模型已配置** | `clawdbot models list` 查看是否有可用模型      |

::: warning 前置课程
本教程假设你已经完成了：
- [快速开始](../../start/getting-started/) - 安装、配置和启动 Clawdbot
- [启动 Gateway](../../start/gateway-startup/) - 了解 Gateway 的不同启动模式

如果还没完成，请先返回这些课程。
:::

### 可选：配置认证

WebChat 默认需要认证（即使在本地访问），以保护你的 AI 助手。

快速检查：

```bash
## 查看当前认证配置
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

如果未配置，建议先设置：

```bash
## 设置 token 认证（推荐）
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

详细说明：[Gateway 认证配置](../../advanced/security-sandbox/)。

---

## 核心思路

### 什么是 WebChat

**WebChat** 是 Clawdbot 内置的聊天界面，通过 Gateway WebSocket 直接与 AI 助手交互。

**关键特点**：

```
┌─────────────────────────────────────────────────────┐
│              WebChat 架构                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  浏览器/客户端                                     │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → 处理消息              │
│      ├─ chat.history → 返回会话历史               │
│      ├─ chat.inject → 添加系统备注              │
│      └─ 事件流 → 实时更新                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**与其他渠道的区别**：

| 特性         | WebChat                          | WhatsApp/Telegram 等                |
|--- | --- | ---|
| **接入方式** | 浏览器直接访问 Gateway           | 需要第三方 APP 和登录         |
| **配置需求** | 无需单独配置，复用 Gateway 端口   | 需要渠道特定的 API Key/Token  |
| **回复路由** | 确定性路由回 WebChat          | 路由到对应的渠道              |
| **远程访问** | 通过 SSH/Tailscale 隧道       | 由渠道平台提供远程访问         |
| **会话模型** | 使用 Gateway 的会话管理        | 使用 Gateway 的会话管理        |

### WebChat 的工作原理

WebChat 不需要单独的 HTTP 服务器或端口配置，它直接使用 Gateway 的 WebSocket 服务。

**关键点**：
- **共享端口**：WebChat 使用与 Gateway 相同的端口（默认 18789）
- **无额外配置**：没有专门的 `webchat.*` 配置块
- **实时同步**：历史记录从 Gateway 实时获取，本地不缓存
- **只读模式**：如果 Gateway 不可达，WebChat 变为只读

::: info WebChat vs 控制界面
WebChat 专注于聊天体验，而 **Control UI** 提供完整的 Gateway 控制面板（配置、会话管理、技能管理等）。

- WebChat：`http://localhost:18789/chat` 或 macOS app 中的聊天视图
- Control UI：`http://localhost:18789/` 完整控制面板
:::

---

## 跟我做

### 第 1 步：访问 WebChat

**为什么**
WebChat 是 Gateway 内置的聊天界面，无需安装额外软件。

#### 方式 1：浏览器访问

打开浏览器，访问：

```bash
## 默认地址（使用默认端口 18789）
http://localhost:18789

## 或使用回环地址（更可靠）
http://127.0.0.1:18789
```

**你应该看到**：
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [会话列表]  [设置]      │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  你好！我是你的 AI 助手。       │   │
│  │  有什么我可以帮你的吗？        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [输入消息...]                  [发送]   │
└─────────────────────────────────────────────┘
```

#### 方式 2：macOS 应用

如果你安装了 Clawdbot macOS 菜单栏应用：

1. 点击菜单栏图标
2. 选择 "Open WebChat" 或点击聊天图标
3. WebChat 会在独立的窗口中打开

**优势**：
- 原生 macOS 体验
- 快捷键支持
- 与 Voice Wake 和 Talk Mode 集成

#### 方式 3：命令行快捷

```bash
## 自动打开浏览器到 WebChat
clawdbot web
```

**你应该看到**：默认浏览器自动打开并导航到 `http://localhost:18789`

---

### 第 2 步：发送第一条消息

**为什么**
验证 WebChat 与 Gateway 的连接是否正常，AI 助手是否能正确响应。

1. 在输入框中输入你的第一条消息
2. 点击"发送"按钮或按 `Enter`
3. 观察聊天界面的响应

**示例消息**：
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**你应该看到**：
```
┌─────────────────────────────────────────────┐
│  你 → AI: Hello! I'm testing...      │
│                                             │
│  AI → 你: 你好！我是 Clawdbot AI    │
│  助手。我可以帮你解答问题、          │
│  编写代码、管理任务等。              │
│  有什么我可以帮你的吗？            │
│                                             │
│  [输入消息...]                  [发送]   │
└─────────────────────────────────────────────┘
```

::: tip 认证提示
如果 Gateway 配置了认证，访问 WebChat 时会提示输入 token 或密码：

```
┌─────────────────────────────────────────────┐
│          Gateway 认证                    │
│                                             │
│  请输入 Token:                             │
│  [•••••••••••••]              │
│                                             │
│              [取消]  [登录]               │
└─────────────────────────────────────────────┘
```

输入你配置的 `gateway.auth.token` 或 `gateway.auth.password` 即可。
:::

---

### 第 3 步：使用 WebChat 功能

**为什么**
WebChat 提供丰富的交互功能，熟悉这些功能能提升使用体验。

#### 会话管理

WebChat 支持多会话管理，让你在不同上下文中与 AI 对话。

**操作步骤**：

1. 点击左侧会话列表（或 "新建会话" 按钮）
2. 选择或创建新会话
3. 在新会话中继续对话

**会话特点**：
- ✅ 独立上下文：每个会话的消息历史是隔离的
- ✅ 自动保存：所有会话由 Gateway 管理，持久化存储
- ✅ 跨平台同步：与 CLI、macOS app、iOS/Android 节点共享同一会话数据

::: info 主会话
WebChat 默认使用 Gateway 的 **主会话键**（`main`），这意味着所有客户端（CLI、WebChat、macOS app、iOS/Android 节点）共享同一个主会话历史。

如果需要隔离的上下文，可以在配置中设置不同的会话键。
:::

#### 附件上传

WebChat 支持上传图片、音频、视频等附件。

**操作步骤**：

1. 点击输入框旁的"附件"图标（通常是 📎 或 📎️）
2. 选择要上传的文件（或拖拽文件到聊天区域）
3. 输入相关的文字描述
4. 点击"发送"

**支持的格式**：
- 📷 **图片**：JPEG、PNG、GIF
- 🎵 **音频**：MP3、WAV、M4A
- 🎬 **视频**：MP4、MOV
- 📄 **文档**：PDF、TXT 等（具体取决于 Gateway 配置）

**你应该看到**：
```
┌─────────────────────────────────────────────┐
│  你 → AI: 请分析这张图片         │
│  [📎 photo.jpg]                         │
│                                             │
│  AI → 你: 我看到这是一张...        │
│  [分析结果...]                              │
└─────────────────────────────────────────────┘
```

::: warning 文件大小限制
WebChat 和 Gateway 对上传的文件大小有限制（通常为几 MB）。如果上传失败，检查文件大小或 Gateway 的媒体配置。
:::

#### Markdown 支持

WebChat 支持 Markdown 格式，让你可以格式化消息。

**示例**：

```markdown
# 标题
## 二级标题
- 列表项 1
- 列表项 2

**粗体** 和 *斜体*
`代码`
```

**预览效果**：
```
# 标题
## 二级标题
- 列表项 1
- 列表项 2

**粗体** 和 *斜体*
`代码`
```

#### 命令快捷方式

WebChat 支持斜杠命令，快速执行特定操作。

**常用命令**：

| 命令             | 功能                         |
|--- | ---|
| `/new`          | 创建新会话                   |
| `/reset`        | 重置当前会话的历史           |
| `/clear`        | 清空当前会话的所有消息       |
| `/status`       | 显示 Gateway 和渠道状态       |
| `/models`       | 列出可用的 AI 模型         |
| `/help`         | 显示帮助信息                 |

**使用示例**：

```
/new
## 创建新会话

/reset
## 重置当前会话
```

---

### 第 4 步（可选）：配置远程访问

**为什么**
如果你在远程服务器上运行 Gateway，或者想从其他设备访问 WebChat，需要配置远程访问。

#### 通过 SSH 隧道访问

**适用场景**：Gateway 在远程服务器，你想从本地机器访问 WebChat。

**操作步骤**：

1. 建立 SSH 隧道，将远程 Gateway 端口映射到本地：

```bash
## 将远程的 18789 端口映射到本地的 18789 端口
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. 保持 SSH 连接打开（或使用 `-N` 参数不执行远程命令）

3. 在本地浏览器访问：`http://localhost:18789`

**你应该看到**：与本地访问相同的 WebChat 界面

::: tip SSH 隧道保持
SSH 隧道在连接断开时会失效。如果需要持久化访问：

- 使用 `autossh` 自动重连
- 配置 SSH Config 中的 `LocalForward`
- 使用 systemd/launchd 自动启动隧道
:::

#### 通过 Tailscale 访问

**适用场景**：使用 Tailscale 组建私有网络，Gateway 和客户端在同一 tailnet。

**配置步骤**：

1. 在 Gateway 机器上启用 Tailscale Serve 或 Funnel：

```bash
## 编辑配置文件
clawdbot config set gateway.tailscale.mode serve
## 或
clawdbot config set gateway.tailscale.mode funnel
```

2. 重启 Gateway

```bash
## 重启 Gateway 以应用配置
clawdbot gateway restart
```

3. 获取 Gateway 的 Tailscale 地址

```bash
## 查看状态（会显示 Tailscale URL）
clawdbot gateway status
```

4. 在客户端设备（同一 tailnet）访问：

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve**：仅在 tailnet 内可访问，更安全
- **Funnel**：公开访问到互联网，需要 `gateway.auth` 保护

推荐使用 Serve 模式，除非你需要从公网访问。
:::

#### 远程访问认证

无论使用 SSH 隧道还是 Tailscale，如果 Gateway 配置了认证，你仍需提供 token 或密码。

**检查认证配置**：

```bash
## 查看认证模式
clawdbot config get gateway.auth.mode

## 如果是 token 模式，确认 token 已设置
clawdbot config get gateway.auth.token
```

---

## 检查点 ✅

完成上述步骤后，你应该能够：

- [ ] 在浏览器中访问 WebChat（`http://localhost:18789`）
- [ ] 发送消息并收到 AI 回复
- [ ] 使用会话管理功能（新建、切换、重置会话）
- [ ] 上传附件并让 AI 分析
- [ ] （可选）通过 SSH 隧道远程访问 WebChat
- [ ] （可选）通过 Tailscale 访问 WebChat

::: tip 验证连接
如果 WebChat 无法访问或消息发送失败，检查：

1. Gateway 是否在运行：`clawdbot gateway status`
2. 端口是否正确：确认访问 `http://127.0.0.1:18789`（而不是 `localhost:18789`）
3. 认证是否配置：`clawdbot config get gateway.auth.*`
4. 查看详细日志：`clawdbot gateway --verbose`
:::

---

## 踩坑提醒

### ❌ Gateway 未启动

**错误做法**：
```
直接访问 http://localhost:18789
## 结果：连接失败或无法加载
```

**正确做法**：
```bash
## 先启动 Gateway
clawdbot gateway --port 18789

## 再访问 WebChat
open http://localhost:18789
```

::: warning Gateway 必须先启动
WebChat 依赖 Gateway 的 WebSocket 服务。没有运行的 Gateway，WebChat 无法正常工作。
:::

### ❌ 端口配置错误

**错误做法**：
```
访问 http://localhost:8888
## Gateway 实际运行在 18789 端口
## 结果：连接被拒绝
```

**正确做法**：
```bash
## 1. 查看 Gateway 实际端口
clawdbot config get gateway.port

## 2. 使用正确的端口访问
open http://localhost:<gateway.port>
```

### ❌ 认证配置遗漏

**错误做法**：
```
未设置 gateway.auth.mode 或 token
## 结果：WebChat 提示认证失败
```

**正确做法**：
```bash
## 设置 token 认证（推荐）
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## 重启 Gateway
clawdbot gateway restart

## 访问 WebChat 时输入 token
```

### ❌ 远程访问未配置

**错误做法**：
```
从本地直接访问远程服务器 IP
http://remote-server-ip:18789
## 结果：连接超时（防火墙阻止）
```

**正确做法**：
```bash
## 使用 SSH 隧道
ssh -L 18789:localhost:18789 user@remote-server.com

## 或使用 Tailscale Serve
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## 从本地浏览器访问
http://localhost:18789
```

---

## 本课小结

本课你学会了：

1. ✅ **WebChat 简介**：基于 Gateway WebSocket 的内置聊天界面，无需单独配置
2. ✅ **访问方式**：浏览器访问、macOS 应用、命令行快捷
3. ✅ **核心功能**：会话管理、附件上传、Markdown 支持、斜杠命令
4. ✅ **远程访问**：通过 SSH 隧道或 Tailscale 访问远程 Gateway
5. ✅ **认证配置**：理解 Gateway 认证模式（token/password/Tailscale）
6. ✅ **故障排查**：常见问题和解决方案

**关键概念回顾**：

- WebChat 使用与 Gateway 相同的端口，无需单独的 HTTP 服务器
- 历史记录由 Gateway 管理，实时同步，本地不缓存
- 如果 Gateway 不可达，WebChat 变为只读模式
- 回复确定性路由回 WebChat，与其他渠道不同

**下一步**：

- 探索 [macOS 应用](../macos-app/)，了解菜单栏控制和 Voice Wake 功能
- 学习 [iOS 节点](../ios-node/)，配置移动设备执行本地操作
- 了解 [Canvas 可视化界面](../../advanced/canvas/)，体验 AI 驱动的可视化工作空间

---

## 下一课预告

> 下一课我们学习 **[macOS 应用](../macos-app/)**。
>
> 你会学到：
> - macOS 菜单栏应用的功能和布局
> - Voice Wake 和 Talk Mode 的使用
> - WebChat 与 macOS 应用的集成方式
> - 调试工具和远程 Gateway 控制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能                  | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| WebChat 原理说明     | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | 全文件   |
| Gateway WebSocket API | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | 全目录   |
| chat.send 方法        | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380  |
| chat.history 方法     | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295    |
| chat.inject 方法      | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450  |
| Web UI 入口         | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15     |
| Gateway 认证配置     | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-100    |
| Tailscale 集成       | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 全文件   |
| macOS WebChat 集成  | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | 全目录   |

**关键常量**：
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`：WebChat 内部消息渠道标识符（来自 `src/utils/message-channel.ts:17`）

**关键配置项**：
- `gateway.port`：WebSocket 端口（默认 18789）
- `gateway.auth.mode`：认证模式（token/password/tailscale）
- `gateway.auth.token`：Token 认证的令牌值
- `gateway.auth.password`：密码认证的密码值
- `gateway.tailscale.mode`：Tailscale 模式（serve/funnel/disabled）
- `gateway.remote.url`：远程 Gateway 的 WebSocket 地址
- `gateway.remote.token`：远程 Gateway 认证令牌
- `gateway.remote.password`：远程 Gateway 认证密码

**关键 WebSocket 方法**：
- `chat.send(message)`：发送消息到 Agent（来自 `src/gateway/server-methods/chat.ts`）
- `chat.history(sessionId)`：获取会话历史（来自 `src/gateway/server-methods/chat.ts`）
- `chat.inject(message)`：直接注入系统备注到会话，不经过 Agent（来自 `src/gateway/server-methods/chat.ts`）

**架构特点**：
- WebChat 不需要单独的 HTTP 服务器或端口配置
- 使用与 Gateway 相同的端口（默认 18789）
- 历史记录实时从 Gateway 获取，本地不缓存
- 回复确定性路由回 WebChat（与其他渠道不同）

</details>
