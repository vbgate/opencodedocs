---
title: "Android 节点：设备本地操作配置 | Clawdbot 教程"
sidebarTitle: "让 AI 控制你的手机"
subtitle: "Android 节点：设备本地操作配置 | Clawdbot 教程"
description: "学习如何配置 Android 节点以执行设备本地操作（Camera、Canvas、Screen）。本教程介绍 Android 节点的连接流程、配对机制和可用命令。"
tags:
  - "Android"
  - "节点"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Android 节点：设备本地操作配置

## 学完你能做什么

- 将 Android 设备连接到 Gateway，作为节点执行设备本地操作
- 通过 AI 助手控制 Android 设备的摄像头拍照和录像
- 使用 Canvas 可视化界面在 Android 上显示实时内容
- 管理屏幕录制、位置获取和 SMS 发送功能

## 你现在的困境

你想让 AI 助手能够访问你的 Android 设备——拍照、录制视频、显示 Canvas 界面——但不知道如何安全地将设备连接到 Gateway。

直接安装 Android 应用可能无法发现 Gateway，或者配置后无法配对成功。你需要一个清晰的连接流程。

## 什么时候用这一招

- **需要设备本地操作**：你想通过 AI 助手让 Android 设备执行本地操作（拍照、录像、屏幕录制）
- **跨网络访问**：Android 设备和 Gateway 在不同网络，需要通过 Tailscale 连接
- **Canvas 可视化**：需要在 Android 上显示 AI 生成的实时 HTML/CSS/JS 界面

## 🎒 开始前的准备

::: warning 前置要求

在开始之前，请确保：

- ✅ **Gateway 已安装并运行**：在 macOS、Linux 或 Windows (WSL2) 上运行 Gateway
- ✅ **Android 设备可用**：Android 8.0+ 设备或模拟器
- ✅ **网络连接正常**：Android 设备可以访问 Gateway 的 WebSocket 端口（默认 18789）
- ✅ **CLI 可用**：在 Gateway 主机上可以使用 `clawdbot` 命令

:::

## 核心思路

**Android 节点**是一个 companion app（伴侣应用），它通过 WebSocket 连接到 Gateway，并暴露设备本地操作的能力给 AI 助手使用。

### 架构概览

```
Android 设备（节点应用）
        ↓
    WebSocket 连接
        ↓
    Gateway（控制平面）
        ↓
    AI 助手 + 工具调用
```

**关键点**：
- Android **不托管** Gateway，只作为节点连接到已运行的 Gateway
- 所有命令通过 Gateway 的 `node.invoke` 方法路由到 Android 节点
- 节点需要配对（pairing）才能获得访问权限

### 支持的功能

Android 节点支持以下设备本地操作：

| 功能 | 命令 | 说明 |
|--- | --- | ---|
| **Canvas** | `canvas.*` | 显示实时可视化界面（A2UI） |
| **Camera** | `camera.*` | 拍照（JPG）和录像（MP4） |
| **Screen** | `screen.*` | 屏幕录制 |
| **Location** | `location.*` | 获取 GPS 位置 |
| **SMS** | `sms.*` | 发送短信 |

::: tip 前台限制

所有设备本地操作（Canvas、Camera、Screen）都需要 Android 应用处于**前台运行状态**。后台调用会返回 `NODE_BACKGROUND_UNAVAILABLE` 错误。

:::

## 跟我做

### 第 1 步：启动 Gateway

**为什么**
Android 节点需要连接到一个运行中的 Gateway 才能工作。Gateway 提供 WebSocket 控制平面和配对服务。

```bash
clawdbot gateway --port 18789 --verbose
```

**你应该看到**：
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Tailscale 模式（推荐）

如果 Gateway 和 Android 设备在不同网络但通过 Tailscale 连接，将 Gateway 绑定到 tailnet IP：

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

重启 Gateway 后，Android 节点可以通过 Wide-Area Bonjour 发现。

:::

### 第 2 步：验证发现（可选）

**为什么**
确认 Gateway 的 Bonjour/mDNS 服务正常工作，方便 Android 应用发现。

在 Gateway 主机上运行：

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**你应该看到**：
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

如果看到类似输出，说明 Gateway 正在广告发现服务。

::: details 调试 Bonjour 问题

如果发现失败，可能的原因：

- **mDNS 被阻止**：某些 Wi-Fi 网络禁用 mDNS
- **防火墙**：阻止 UDP 端口 5353
- **网络隔离**：设备在不同 VLAN 或子网

解决方案：使用 Tailscale + Wide-Area Bonjour，或手动配置 Gateway 地址。

:::

### 第 3 步：从 Android 连接

**为什么**
Android 应用通过 mDNS/NSD 发现 Gateway，建立 WebSocket 连接。

在 Android 应用中：

1. 打开 **设置**（Settings）
2. 在 **Discovered Gateways** 中选择你的 Gateway
3. 点击 **Connect**

**如果 mDNS 被阻止**：
- 进入 **Advanced → Manual Gateway**
- 输入 Gateway 的 **主机名和端口**（如 `192.168.1.100:18789`）
- 点击 **Connect (Manual)**

::: tip 自动重连

首次成功配对后，Android 应用会在启动时自动重连：
- 如果启用了手动端点，使用手动端点
- 否则，使用上次发现的 Gateway（尽力而为）

:::

**检查点 ✅**
- Android 应用显示 "Connected" 状态
- 应用显示 Gateway 的显示名称
- 应用显示配对状态（Pending 或 Paired）

### 第 4 步：批准配对（CLI）

**为什么**
Gateway 需要你批准节点的配对请求，才能授予访问权限。

在 Gateway 主机上：

```bash
# 查看待处理的配对请求
clawdbot nodes pending

# 批准配对
clawdbot nodes approve <requestId>
```

::: details 配对流程

Gateway-owned pairing 工作流程：

1. Android 节点连接 Gateway，请求配对
2. Gateway 存储 **pending request** 并发出 `node.pair.requested` 事件
3. 你通过 CLI 批准或拒绝请求
4. 批准后，Gateway 颁发新的 **auth token**
5. Android 节点使用 token 重新连接，变为 "paired" 状态

Pending 请求在 **5 分钟**后自动过期。

:::

**你应该看到**：
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

Android 应用会自动重连并显示 "Paired" 状态。

### 第 5 步：验证节点已连接

**为什么**
确认 Android 节点成功配对并连接到 Gateway。

通过 CLI 验证：

```bash
clawdbot nodes status
```

**你应该看到**：
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

或者通过 Gateway API：

```bash
clawdbot gateway call node.list --params '{}'
```

### 第 6 步：测试 Camera 功能

**为什么**
验证 Android 节点的 Camera 命令正常工作，权限已授予。

通过 CLI 测试拍照：

```bash
# 拍照（默认前置摄像头）
clawdbot nodes camera snap --node "android-node"

# 指定后置摄像头
clawdbot nodes camera snap --node "android-node" --facing back

# 录制视频（3 秒）
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**你应该看到**：
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Camera 权限

Android 节点需要以下运行时权限：

- **CAMERA**：用于 `camera.snap` 和 `camera.clip`
- **RECORD_AUDIO**：用于 `camera.clip`（当 `includeAudio=true`）

首次调用 Camera 命令时，应用会提示授予权限。如果拒绝，命令会返回 `CAMERA_PERMISSION_REQUIRED` 或 `AUDIO_PERMISSION_REQUIRED` 错误。

:::

### 第 7 步：测试 Canvas 功能

**为什么**
验证 Canvas 可视化界面可以在 Android 设备上显示。

::: info Canvas Host

Canvas 需要一个 HTTP 服务器来提供 HTML/CSS/JS 内容。Gateway 默认在端口 18793 上运行 Canvas Host。

:::

在 Gateway 主机上创建 Canvas 文件：

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

在 Android 应用中导航到 Canvas：

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**你应该看到**：
Android 应用中显示 "Hello from AI!" 页面。

::: tip Tailscale 环境

如果 Android 设备和 Gateway 都在 Tailscale 网络中，使用 MagicDNS 名称或 tailnet IP 替代 `.local`：

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### 第 8 步：测试 Screen 和 Location 功能

**为什么**
验证屏幕录制和位置获取功能正常。

屏幕录制：

```bash
# 录制 10 秒屏幕
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**你应该看到**：
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

位置获取：

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**你应该看到**：
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning 权限要求

屏幕录制需要 Android **RECORD_AUDIO** 权限（如果启用音频）和前台访问。位置获取需要 **LOCATION** 权限。

首次调用时，应用会提示授予权限。

:::

## 踩坑提醒

### 问题 1：无法发现 Gateway

**症状**：Android 应用中看不到 Gateway

**可能原因**：
- Gateway 未启动或绑定到 loopback
- mDNS 在网络中被阻止
- 防火墙阻止 UDP 5353 端口

**解决方案**：
1. 检查 Gateway 是否运行：`clawdbot nodes status`
2. 使用手动 Gateway 地址：在 Android 应用中输入 Gateway IP 和端口
3. 配置 Tailscale + Wide-Area Bonjour（推荐）

### 问题 2：配对后连接失败

**症状**：显示 "Paired" 但无法连接

**可能原因**：
- Token 过期（每次配对后 token 会旋转）
- Gateway 重启但节点未重连
- 网络变化

**解决方案**：
1. 在 Android 应用中手动点击 "Reconnect"
2. 检查 Gateway 日志：`bonjour: client disconnected ...`
3. 重新配对：删除节点并重新批准

### 问题 3：Camera 命令返回权限错误

**症状**：`camera.snap` 返回 `CAMERA_PERMISSION_REQUIRED`

**可能原因**：
- 用户拒绝了权限
- 权限被系统策略禁用

**解决方案**：
1. 在 Android 设置中查找 "Clawdbot" 应用
2. 进入 "Permissions"
3. 授予 Camera 和 Microphone 权限
4. 重试 Camera 命令

### 问题 4：后台调用失败

**症状**：后台调用返回 `NODE_BACKGROUND_UNAVAILABLE`

**原因**：Android 节点仅允许前台调用设备本地命令

**解决方案**：
1. 确保应用在前台运行（打开应用）
2. 检查应用是否被系统优化（电池优化）
3. 关闭 "省电模式" 对应用的限制

## 本课小结

本课介绍了如何配置 Android 节点以执行设备本地操作：

- **连接流程**：通过 mDNS/NSD 或手动配置连接 Android 节点到 Gateway
- **配对机制**：使用 Gateway-owned pairing 批准节点访问权限
- **可用功能**：Camera、Canvas、Screen、Location、SMS
- **CLI 工具**：使用 `clawdbot nodes` 命令管理节点和调用功能
- **权限要求**：Android 应用需要 Camera、Audio、Location 等运行时权限

**关键点**：
- Android 节点是 companion app，不托管 Gateway
- 所有设备本地操作需要应用在前台运行
- 配对请求在 5 分钟后自动过期
- 支持 Tailscale 网络的 Wide-Area Bonjour 发现

## 下一课预告

> 下一课我们学习 **[Canvas 可视化界面与 A2UI](../../advanced/canvas/)**。
>
> 你会学到：
> - Canvas A2UI 推送机制
> - 如何在 Canvas 上显示实时内容
> - Canvas 命令完整列表

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| 节点命令策略 | [`src/gateway/node-command-policy.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| 节点协议 Schema | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Android 文档  | [`docs/platforms/android.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/android.md) | 1-142   |
| 节点 CLI  | [`docs/cli/nodes.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/nodes.md) | 1-69    |

**关键常量**：
- `PLATFORM_DEFAULTS`：定义各平台支持的命令列表（`node-command-policy.ts:32-58`）
- Android 支持的命令：Canvas、Camera、Screen、Location、SMS（`node-command-policy.ts:34-40`）

**关键函数**：
- `resolveNodeCommandAllowlist()`：根据平台解析允许的命令列表（`node-command-policy.ts:77-91`）
- `normalizePlatformId()`：规范化平台 ID（`node-command-policy.ts:60-75`）

**Android 节点特点**：
- 客户端 ID：`clawdbot-android`（`gateway/protocol/client-info.ts:9`）
- 设备系列检测：通过 `deviceFamily` 字段识别 Android（`node-command-policy.ts:70`）
- 默认启用 Canvas 和 Camera 功能（`docs/platforms/android.md`）

</details>
