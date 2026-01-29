---
title: "iOS Node Setup: Connect Gateway with Camera Canvas Voice Wake | Clawdbot Tutorial"
sidebarTitle: "iOS Node"
subtitle: "iOS Node Configuration Guide"
description: "Learn how to configure an iOS node to connect to Gateway, use camera for photos, Canvas visualization interface, Voice Wake for voice activation, Talk Mode for continuous conversation, and location retrieval. Enable device local operations with automatic discovery via Bonjour and Tailscale, pairing authentication, and security controls for multi-device AI collaboration, supporting foreground/background modes and permission management."
tags:
  - "iOS Node"
  - "Device Node"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "start-gateway-startup"
order: 170
---

# iOS Node Configuration Guide

## What You'll Learn

After configuring an iOS node, you will be able to:

- ✅ Let the AI assistant call the iOS device's camera to take photos or record videos
- ✅ Render Canvas visualization interfaces on iOS devices
- ✅ Use Voice Wake and Talk Mode for voice interactions
- ✅ Get location information from iOS devices
- ✅ Manage multiple device nodes through Gateway

## Your Current Challenge

You want to extend your AI assistant's capabilities on your iOS device, enabling it to:

- **Call camera for photos or video recording**: When you say "take a photo," the AI automatically uses iPhone to capture
- **Display visualization interfaces**: Show AI-generated charts, forms, or control panels on iPhone
- **Voice wake and continuous conversation**: Wake up the assistant by simply saying "Clawd" without touching anything
- **Get device information**: Let AI know your location, screen status, and other information

## When to Use This

- **Mobile scenarios**: You want AI to use iPhone's camera, screen, and other capabilities
- **Multi-device collaboration**: Gateway runs on a server, but needs to call local device features
- **Voice interaction**: You want to use iPhone as a portable voice assistant terminal

::: info What is an iOS Node?
An iOS node is a Companion application running on iPhone/iPad that connects to Clawdbot Gateway via WebSocket. It is not the Gateway itself, but acts as a "peripheral" providing device local operation capabilities.

**Differences from Gateway**:
- **Gateway**: Runs on server/macOS, responsible for message routing, AI model calls, tool distribution
- **iOS Node**: Runs on iPhone, responsible for executing device local operations (camera, Canvas, location, etc.)
:::

---

## 🎒 Prerequisites

::: warning Prerequisites

Before starting, please confirm:

1. **Gateway is up and running**
   - Ensure Gateway is running on another device (macOS, Linux, or Windows via WSL2)
   - Gateway is bound to an accessible network address (LAN or Tailscale)

2. **Network connectivity**
   - iOS device and Gateway are on the same LAN (recommended), or connected via Tailscale
   - iOS device can access Gateway's IP address and port (default 18789)

3. **Get iOS application**
   - The iOS app is currently in **internal preview**, not publicly distributed
   - Need to build from source or get TestFlight beta
:::

## Core Concepts

**iOS node workflow**:

```
[Gateway] ←→ [iOS Node]
     ↓            ↓
  [AI Model]   [Device Capabilities]
     ↓            ↓
  [Decision Execution]   [Camera/Canvas/Voice]
```

**Key technical points**:

1. **Automatic discovery**: Automatically discover Gateway via Bonjour (LAN) or Tailscale (cross-network)
2. **Pairing authentication**: First-time connection requires manual approval on Gateway to establish trust relationship
3. **Protocol communication**: Use WebSocket protocol (`node.invoke`) to send commands
4. **Permission control**: Device local commands require user authorization (camera, location, etc.)

**Architecture characteristics**:

- **Security**: All device operations require explicit user authorization on iOS
- **Isolation**: Node doesn't run Gateway, only executes local operations
- **Flexibility**: Supports foreground, background, remote, and other usage scenarios

---

## Follow Along

### Step 1: Start Gateway

Start the service on the Gateway host:

```bash
clawdbot gateway --port 18789
```

**You should see**:

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip Cross-network access
If Gateway and iOS device are not on the same LAN, use **Tailscale Serve/Funnel**:

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

The iOS device will automatically discover Gateway via Tailscale.
:::

### Step 2: iOS App Connection

In the iOS app:

1. Open **Settings**
2. Find the **Gateway** section
3. Select an auto-discovered Gateway (or enable **Manual Host** below to manually enter host and port)

**You should see**:

- The app attempts to connect to Gateway
- Status shows as "Connected" or "Pairing pending"

::: details Manual Host Configuration

If auto-discovery fails, manually enter the Gateway address:

1. Enable **Manual Host**
2. Enter Gateway host (e.g., `192.168.1.100`)
3. Enter port (default `18789`)
4. Click "Connect"

:::

### Step 3: Approve Pairing Request

**On the Gateway host**, approve the iOS node's pairing request:

```bash
# View pending nodes
clawdbot nodes pending

# Approve specific node (replace <requestId>)
clawdbot nodes approve <requestId>
```

**You should see**:

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip Reject Pairing
If you want to reject a node's connection request:

```bash
clawdbot nodes reject <requestId>
```

:::

**Checkpoint ✅**: Verify node status on Gateway

```bash
clawdbot nodes status
```

You should see your iOS node showing as `paired` status.

### Step 4: Test Node Connection

**Test node communication from Gateway**:

```bash
# Call node command via Gateway
clawdbot gateway call node.list --params "{}"
```

**You should see**:

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## Using Node Features

### Camera Photo

iOS node supports camera photo and video recording:

```bash
# Take photo (default front-facing camera)
clawdbot nodes camera snap --node "iPhone (iOS)"

# Take photo (back-facing camera, custom resolution)
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# Record video (5 seconds)
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**You should see**:

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning Foreground Requirement
Camera commands require the iOS app to be in the **foreground**. If the app is in the background, it will return a `NODE_BACKGROUND_UNAVAILABLE` error.

:::

**iOS Camera Parameters**:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `facing` | `front\|back` | `front` | Camera facing direction |
| `maxWidth` | number | `1600` | Maximum width (pixels) |
| `quality` | `0..1` | `0.9` | JPEG quality (0-1) |
| `durationMs` | number | `3000` | Video duration (milliseconds) |
| `includeAudio` | boolean | `true` | Whether to include audio |

### Canvas Visualization Interface

iOS node can display Canvas visualization interfaces:

```bash
# Navigate to URL
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# Execute JavaScript
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# Take screenshot (save as JPEG)
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**You should see**:

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip A2UI Auto-push
If Gateway has configured `canvasHost`, the iOS node will automatically navigate to the A2UI interface upon connection.
:::

### Voice Wake Voice Activation

Enable Voice Wake in the iOS app's **Settings**:

1. Turn on the **Voice Wake** switch
2. Set wake word (default: "clawd", "claude", "computer")
3. Ensure iOS has authorized microphone permission

::: info Global Wake Words
Clawdbot's wake words are **globally configured**, managed by Gateway. All nodes (iOS, Android, macOS) use the same wake word list.

Modifying wake words automatically syncs to all devices.
:::

### Talk Mode Continuous Conversation

After enabling Talk Mode, AI will continuously read responses via TTS and continuously listen for voice input:

1. Enable **Talk Mode** in iOS app **Settings**
2. AI responses will be automatically read aloud
3. You can converse continuously via voice without manual clicks

::: warning Background Limitations
iOS may suspend background audio. Voice features are **best-effort** when the app is not in the foreground.
:::

---

## Common Issues

### Pairing Prompt Never Appears

**Problem**: iOS app shows "Connected", but Gateway doesn't show a pairing prompt.

**Solution**:

```bash
# 1. Manually view pending nodes
clawdbot nodes pending

# 2. Approve node
clawdbot nodes approve <requestId>

# 3. Verify connection
clawdbot nodes status
```

### Connection Failure (After Reinstall)

**Problem**: Unable to connect to Gateway after reinstalling the iOS app.

**Cause**: Pairing Token in Keychain has been cleared.

**Solution**: Re-run the pairing process (Step 3).

### A2UI_HOST_NOT_CONFIGURED

**Problem**: Canvas command fails with error `A2UI_HOST_NOT_CONFIGURED`.

**Cause**: Gateway has not configured the `canvasHost` URL.

**Solution**:

Set Canvas host in Gateway configuration:

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**Problem**: Camera/Canvas command fails, returning `NODE_BACKGROUND_UNAVAILABLE`.

**Cause**: iOS app is not in the foreground.

**Solution**: Switch iOS app to foreground, then retry the command.

---

## Summary

In this lesson, you learned:

✅ The concept and architecture of iOS nodes
✅ How to automatically discover and connect to Gateway
✅ Pairing authentication process
✅ Using camera, Canvas, Voice Wake, and other features
✅ Troubleshooting common issues

**Key Points**:

- iOS node provides device local operation capabilities, not the Gateway itself
- All device operations require user authorization and foreground status
- Pairing is a necessary security step, only trusting approved nodes
- Voice Wake and Talk Mode require microphone permissions

## Next Lesson

> In the next lesson, we'll learn **[Android Node Configuration](../android-node/)**.
>
> You'll learn:
> - How to configure an Android node to connect to Gateway
> - Using Android device's camera, screen recording, and Canvas features
> - Handling Android-specific permissions and compatibility issues

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Lines |
| --- | --- | --- |
| iOS App Entry | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Canvas Rendering | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Gateway Connection | [`apps/ios/Sources/Gateway/`](https://github.com/clawdbot/clawdbot/blob/main/apps/ios/Sources/Gateway/) | - |
| Node Protocol Runner | [`src/node-host/runner.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| Node Configuration | [`src/node-host/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/node-host/config.ts) | 1-50 |
| iOS Platform Documentation | [`docs/platforms/ios.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/ios.md) | 1-105 |
| Node System Documentation | [`docs/nodes/index.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md) | 1-306 |

**Key Constants**:
- `GATEWAY_DEFAULT_PORT = 18789`: Gateway default port
- `NODE_ROLE = "node"`: Node connection role identifier

**Key Commands**:
- `clawdbot nodes pending`: List pending nodes
- `clawdbot nodes approve <requestId>`: Approve node pairing
- `clawdbot nodes invoke --node <id> --command <cmd>`: Invoke node command
- `clawdbot nodes camera snap --node <id>`: Take photo
- `clawdbot nodes canvas navigate --node <id> --target <url>`: Navigate Canvas

**Protocol Methods**:
- `node.invoke.request`: Node command invocation request
- `node.invoke.result`: Node command execution result
- `voicewake.get`: Get wake word list
- `voicewake.set`: Set wake word list
- `voicewake.changed`: Wake word change event

</details>
