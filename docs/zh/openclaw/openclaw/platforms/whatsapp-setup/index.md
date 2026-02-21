---
title: "WhatsApp 集成 - 配置 Baileys 连接 | OpenClaw 教程"
sidebarTitle: "WhatsApp 集成"
subtitle: "WhatsApp 集成 - 配置 Baileys 连接"
description: "详细指导如何配置 WhatsApp 频道，使用 Baileys 库进行连接，完成配对流程并设置安全措施。"
tags:
  - "WhatsApp"
  - "Baileys"
  - "频道配置"
order: 60
---

# WhatsApp 集成 - 配置 Baileys 连接

## 学完你能做什么

完成本课程后，你将能够：
- 使用 Baileys 库连接 WhatsApp
- 完成 WhatsApp 配对流程
- 配置安全设置保护账户
- 管理 WhatsApp 连接状态

## 你现在的困境

想要通过 WhatsApp 与 AI 助手对话，但你可能遇到：
- 不知道如何开始 WhatsApp 配对
- 担心账户安全问题
- 不清楚如何管理多设备连接

## 核心思路

OpenClaw 使用 **Baileys** 库与 WhatsApp 通信。Baileys 是一个开源的 WhatsApp Web API 实现，无需官方 Business API 即可连接。

```
┌─────────────────────────────────────────────────────────────┐
│                  WhatsApp 连接流程                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐      ┌─────────────┐      ┌──────────┐   │
│   │  OpenClaw   │      │   Baileys   │      │ WhatsApp │   │
│   │   Gateway   │ ───→ │    库       │ ───→ │  服务器  │   │
│   └──────┬──────┘      └─────────────┘      └──────────┘   │
│          │                                                  │
│          │  1. 生成 QR 码                                    │
│          │  2. 手机扫描                                      │
│          │  3. 建立连接                                      │
│          │  4. 同步消息                                      │
│          │                                                  │
└─────────────────────────────────────────────────────────────┘
```

### 配对机制

WhatsApp 使用多设备架构：
- 手机作为主设备
- OpenClaw 作为连接设备
- 配对后无需手机在线即可收发消息

## 跟我做

### 第 1 步：启用 WhatsApp 频道

**为什么**  
首先需要在配置中启用 WhatsApp 功能。

```bash
# 启用 WhatsApp 频道
openclaw config set channels.whatsapp.enabled true

# 验证配置
openclaw config get channels.whatsapp.enabled
```

### 第 2 步：启动配对流程

**为什么**  
需要通过 WhatsApp 手机应用扫描二维码完成配对。

```bash
# 启动 WhatsApp 登录流程
openclaw channels add whatsapp

# 或者使用专用命令
openclaw whatsapp login
```

**你应该看到**  
终端显示二维码：

```
┌─────────────────────────────────────┐
│  WhatsApp Pairing                   │
├─────────────────────────────────────┤
│                                     │
│  ████████████████████████████████  │
│  ██  ▄▄▄▄▄  █▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀  ██  │
│  ██  █   █  █                  ██  │
│  ██  █   █  █  QR Code here    ██  │
│  ██  ▀▀▀▀▀  █                  ██  │
│  ████████████████████████████████  │
│                                     │
│  1. 打开 WhatsApp 手机应用          │
│  2. 设置 → 已关联设备 → 关联设备    │
│  3. 扫描上方二维码                  │
│                                     │
└─────────────────────────────────────┘
```

### 第 3 步：手机扫描并确认

**为什么**  
WhatsApp 需要用户明确授权新设备连接。

操作步骤：
1. 打开 WhatsApp 手机应用
2. 点击右上角 ⋮ → **已关联设备**
3. 点击 **关联设备**
4. 扫描终端显示的二维码
5. 等待连接建立

**你应该看到**  
终端显示连接成功：

```
✅ WhatsApp connected successfully!
   Phone: +86 138 **** xxxx
   Name: Your Name
   Device: OpenClaw Gateway
```

### 第 4 步：配置允许列表

**为什么**  
限制哪些用户可以触发 AI 助手响应。

```bash
# 添加允许的电话号码
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx"

# 允许多个号码
openclaw config set channels.whatsapp.allowFrom "+86138xxxxxxxx,+86139xxxxxxxx"

# 允许所有人（不推荐用于生产）
openclaw config set channels.whatsapp.allowFrom "*"
```

**配置示例**

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["+86138xxxxxxxx", "+86139xxxxxxxx"],
      "dmPolicy": "allow",
      "groupPolicy": "owner-only",
      "accounts": {
        "default": {
          "phoneNumber": "+86138xxxxxxxx"
        }
      }
    }
  }
}
```

### 第 5 步：配置 DM 配对

**为什么**  
DM（Direct Message）配对是一种安全机制，防止未授权访问。

```bash
# 启用 DM 配对
openclaw config set channels.whatsapp.dmPolicy "pairing"

# 配对模式选项
# "allow"    - 允许所有人 DM
# "deny"     - 拒绝所有 DM
# "pairing"  - 需要配对验证
```

**DM 配对流程**

当用户首次发送 DM 时：
1. AI 回复配对验证码请求
2. 用户在 Gateway 界面或 CLI 确认配对
3. 后续对话正常进行

### 第 6 步：测试消息发送

**为什么**  
验证 WhatsApp 连接正常工作。

```bash
# 通过 WhatsApp 发送测试消息
openclaw message send --channel whatsapp --to "+86138xxxxxxxx" --text "Hello from OpenClaw!"

# 或者使用 agent 命令
openclaw agent --to "+86138xxxxxxxx" --message "你好，这是测试消息"
```

## 检查点 ✅

验证 WhatsApp 连接状态：

```bash
# 检查 WhatsApp 状态
openclaw channels status whatsapp

# 预期输出
┌─────────────────────────────────────┐
│  WhatsApp Status                    │
├─────────────────────────────────────┤
│  Status:     ✅ Connected            │
│  Phone:      +86 138 **** xxxx      │
│  Name:       Your Name              │
│  Last seen:  Just now               │
└─────────────────────────────────────┘
```

## 踩坑提醒

::: warning 常见问题
1. **二维码过期**  
   症状：`QR code expired`  
   解决：二维码有效期约 1 分钟，超时后重新生成

2. **手机无法扫描**  
   症状：扫描二维码无反应  
   解决：确保 WhatsApp 已更新到最新版本，检查相机权限

3. **连接断开**  
   症状：`Disconnected from WhatsApp`  
   解决：检查网络连接，重新运行登录流程

4. **多设备限制**  
   症状：`Max devices reached`  
   解决：在 WhatsApp 手机应用中移除不用的已关联设备

5. **号码格式错误**  
   症状：`Invalid phone number`  
   解决：使用国际格式 `+86138xxxxxxxx`，包含国家代码
:::

## 安全配置建议

### 生产环境配置

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["+86138xxxxxxxx"],
      "dmPolicy": "pairing",
      "groupPolicy": "owner-only",
      "heartbeat": {
        "showOk": false,
        "showAlerts": true,
        "useIndicator": true
      }
    }
  }
}
```

### 隐私保护

- 使用 `allowFrom` 限制可访问用户
- 启用 `dmPolicy: "pairing"` 防止陌生人访问
- 定期检查已配对设备列表
- 不在日志中存储敏感消息内容

## 本课小结

在本课程中，你学习了：

- ✅ WhatsApp 与 Baileys 的连接原理
- ✅ 完整的配对流程操作
- ✅ 配置允许列表控制访问
- ✅ DM 配对安全机制
- ✅ 测试消息发送验证连接
- ✅ 生产环境安全配置建议

## 下一课预告

> 下一课我们学习 **[Telegram 集成](../telegram-setup/)**。
>
> 你会学到：
> - 创建 Telegram Bot
> - 配置 Bot Token
> - 群组管理和权限设置

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| WhatsApp 实现 | [`src/whatsapp/`](https://github.com/openclaw/openclaw/blob/main/src/whatsapp/) | - |
| WhatsApp 配置类型 | [`src/config/types.whatsapp.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.whatsapp.ts) | - |
| Baileys 集成 | [`src/channels/plugins/outbound/whatsapp.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/outbound/whatsapp.ts) | - |
| 配对逻辑 | [`src/channels/plugins/pairing.ts`](https://github.com/openclaw/openclaw/blob/main/src/channels/plugins/pairing.ts) | - |
| WhatsApp 扩展 | [`extensions/whatsapp/`](https://github.com/openclaw/openclaw/blob/main/extensions/whatsapp/) | - |

**Baileys 关键配置**：
- 使用 `@whiskeysockets/baileys` 库
- 支持多设备架构
- 自动重连机制
- 消息去重处理

</details>
