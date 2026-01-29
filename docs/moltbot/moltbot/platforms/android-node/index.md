---
title: "Android Node: Device Local Operations Configuration | Clawdbot Tutorial"
sidebarTitle: "Android Node"
subtitle: "Android Node: Device Local Operations Configuration | Clawdbot Tutorial"
description: "Learn how to configure Android nodes to execute device local operations (Camera, Canvas, Screen). This tutorial introduces the Android node connection process, pairing mechanism, and available commands."
tags:
  - "Android"
  - "Node"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Android Node: Device Local Operations Configuration

## What You'll Learn

After completing this lesson, you will be able to:

- Connect Android devices to Gateway as nodes to execute device local operations
- Control Android device camera to take photos and record videos via AI assistant
- Display real-time content on Android using Canvas visualization interface
- Manage screen recording, location retrieval, and SMS sending functionality

## Your Current Challenge

You want your AI assistant to access your Android devices—capture photos, record videos, display Canvas interfaces—but don't know how to securely connect the device to Gateway.

Directly installing the Android app may fail to discover Gateway, or configuration may result in unsuccessful pairing. You need a clear connection process.

## When to Use This

- **Need device local operations**: You want Android devices to execute local operations (capture photos, record videos, screen recording) via AI assistant
- **Cross-network access**: Android device and Gateway are on different networks, need to connect via Tailscale
- **Canvas visualization**: Need to display AI-generated real-time HTML/CSS/JS interfaces on Android

## 🎒 Prerequisites

::: warning Prerequisites Check

Before starting, ensure:

- ✅ **Gateway installed and running**: Running Gateway on macOS, Linux, or Windows (WSL2)
- ✅ **Android device available**: Android 8.0+ device or emulator
- ✅ **Network connection normal**: Android device can access Gateway's WebSocket port (default 18789)
- ✅ **CLI available**: `clawdbot` command can be used on Gateway host

:::

## Core Concepts

**Android Node** is a companion app that connects to Gateway via WebSocket and exposes device local operation capabilities for AI assistant use.

### Architecture Overview

```
Android Device (Node App)
        ↓
    WebSocket Connection
        ↓
    Gateway (Control Plane)
        ↓
    AI Assistant + Tool Calls
```

**Key Points**:
- Android does **NOT** host Gateway, only connects as a node to a running Gateway
- All commands are routed to Android nodes via Gateway's `node.invoke` method
- Nodes require pairing to obtain access permissions

### Supported Capabilities

Android nodes support the following device local operations:

| Capability | Command | Description |
|--- | --- | ---|
| **Canvas** | `canvas.*` | Display real-time visualization interface (A2UI) |
| **Camera** | `camera.*` | Take photos (JPG) and record videos (MP4) |
| **Screen** | `screen.*` | Screen recording |
| **Location** | `location.*` | Get GPS location |
| **SMS** | `sms.*` | Send text messages |

::: tip Foreground Requirement

All device local operations (Canvas, Camera, Screen) require the Android app to be in the **foreground running state**. Background calls will return `NODE_BACKGROUND_UNAVAILABLE` error.

:::

## Follow Along

### Step 1: Start Gateway

**Why**
Android node needs to connect to a running Gateway to function. Gateway provides WebSocket control plane and pairing service.

```bash
clawdbot gateway --port 18789 --verbose
```

**You should see**:
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Tailscale Mode (Recommended)

If Gateway and Android device are on different networks but connected via Tailscale, bind Gateway to tailnet IP:

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

After restarting Gateway, Android nodes can be discovered via Wide-Area Bonjour.

:::

### Step 2: Verify Discovery (Optional)

**Why**
Confirm Gateway's Bonjour/mDNS service is working properly for Android app discovery.

Run on Gateway host:

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**You should see**:
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

If you see similar output, Gateway is advertising discovery service.

::: details Debugging Bonjour Issues

If discovery fails, possible causes:

- **mDNS blocked**: Some Wi-Fi networks disable mDNS
- **Firewall**: Blocking UDP port 5353
- **Network isolation**: Devices on different VLANs or subnets

Solution: Use Tailscale + Wide-Area Bonjour, or manually configure Gateway address.

:::

### Step 3: Connect from Android

**Why**
Android app discovers Gateway via mDNS/NSD and establishes WebSocket connection.

In Android app:

1. Open **Settings**
2. Select your Gateway in **Discovered Gateways**
3. Click **Connect**

**If mDNS is blocked**:
- Go to **Advanced → Manual Gateway**
- Enter Gateway's **hostname and port** (e.g., `192.168.1.100:18789`)
- Click **Connect (Manual)**

::: tip Auto-Reconnect

After successful pairing for the first time, Android app will automatically reconnect on startup:
- If manual endpoint is enabled, use manual endpoint
- Otherwise, use last discovered Gateway (best effort)

:::

**Checkpoint ✅**
- Android app shows "Connected" status
- App displays Gateway's display name
- App shows pairing status (Pending or Paired)

### Step 4: Approve Pairing (CLI)

**Why**
Gateway needs you to approve node pairing requests to grant access permissions.

On Gateway host:

```bash
# View pending pairing requests
clawdbot nodes pending

# Approve pairing
clawdbot nodes approve <requestId>
```

::: details Pairing Flow

Gateway-owned pairing workflow:

1. Android node connects to Gateway, requests pairing
2. Gateway stores **pending request** and emits `node.pair.requested` event
3. You approve or reject request via CLI
4. After approval, Gateway issues new **auth token**
5. Android node reconnects using token, becomes "paired" state

Pending requests automatically expire after **5 minutes**.

:::

**You should see**:
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

Android app will automatically reconnect and display "Paired" status.

### Step 5: Verify Node Connected

**Why**
Confirm Android node has successfully paired and connected to Gateway.

Verify via CLI:

```bash
clawdbot nodes status
```

**You should see**:
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

Or via Gateway API:

```bash
clawdbot gateway call node.list --params '{}'
```

### Step 6: Test Camera Functionality

**Why**
Verify Android node's Camera commands work properly and permissions are granted.

Test photo capture via CLI:

```bash
# Take photo (default front camera)
clawdbot nodes camera snap --node "android-node"

# Specify rear camera
clawdbot nodes camera snap --node "android-node" --facing back

# Record video (3 seconds)
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**You should see**:
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Camera Permissions

Android node requires the following runtime permissions:

- **CAMERA**: For `camera.snap` and `camera.clip`
- **RECORD_AUDIO**: For `camera.clip` (when `includeAudio=true`)

On first Camera command call, app will prompt for permission. If denied, command will return `CAMERA_PERMISSION_REQUIRED` or `AUDIO_PERMISSION_REQUIRED` error.

:::

### Step 7: Test Canvas Functionality

**Why**
Verify Canvas visualization interface can be displayed on Android device.

::: info Canvas Host

Canvas needs an HTTP server to serve HTML/CSS/JS content. Gateway runs Canvas Host on port 18793 by default.

:::

Create Canvas file on Gateway host:

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

Navigate to Canvas in Android app:

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**You should see**:
Android app displays "Hello from AI!" page.

::: tip Tailscale Environment

If Android device and Gateway are both on Tailscale network, use MagicDNS name or tailnet IP instead of `.local`:

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### Step 8: Test Screen and Location Functionality

**Why**
Verify screen recording and location retrieval functions work properly.

Screen recording:

```bash
# Record 10 seconds of screen
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**You should see**:
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

Location retrieval:

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**You should see**:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning Permission Requirements

Screen recording requires Android **RECORD_AUDIO** permission (if audio enabled) and foreground access. Location retrieval requires **LOCATION** permission.

On first call, app will prompt for permission.

:::

## Common Pitfalls

### Problem 1: Cannot Discover Gateway

**Symptom**: Cannot see Gateway in Android app

**Possible Causes**:
- Gateway not started or bound to loopback
- mDNS blocked on network
- Firewall blocking UDP port 5353

**Solutions**:
1. Check if Gateway is running: `clawdbot nodes status`
2. Use manual Gateway address: Enter Gateway IP and port in Android app
3. Configure Tailscale + Wide-Area Bonjour (recommended)

### Problem 2: Connection Fails After Pairing

**Symptom**: Shows "Paired" but cannot connect

**Possible Causes**:
- Token expired (token rotates after each pairing)
- Gateway restarted but node didn't reconnect
- Network changed

**Solutions**:
1. Manually click "Reconnect" in Android app
2. Check Gateway logs: `bonjour: client disconnected ...`
3. Re-pair: Delete node and re-approve

### Problem 3: Camera Commands Return Permission Error

**Symptom**: `camera.snap` returns `CAMERA_PERMISSION_REQUIRED`

**Possible Causes**:
- User denied permission
- Permission disabled by system policy

**Solutions**:
1. Find "Clawdbot" app in Android settings
2. Go to "Permissions"
3. Grant Camera and Microphone permissions
4. Retry Camera command

### Problem 4: Background Call Fails

**Symptom**: Background call returns `NODE_BACKGROUND_UNAVAILABLE`

**Cause**: Android node only allows foreground calls for device local commands

**Solutions**:
1. Ensure app is running in foreground (open app)
2. Check if app is optimized by system (battery optimization)
3. Disable "power saving mode" restrictions for app

## Summary

In this lesson, you learned how to configure Android nodes to execute device local operations:

- **Connection Process**: Connect Android nodes to Gateway via mDNS/NSD or manual configuration
- **Pairing Mechanism**: Use Gateway-owned pairing to approve node access permissions
- **Available Capabilities**: Camera, Canvas, Screen, Location, SMS
- **CLI Tools**: Use `clawdbot nodes` commands to manage nodes and invoke capabilities
- **Permission Requirements**: Android app requires Camera, Audio, Location and other runtime permissions

**Key Points**:
- Android node is a companion app, does not host Gateway
- All device local operations require app to run in foreground
- Pairing requests automatically expire after 5 minutes
- Supports Wide-Area Bonjour discovery for Tailscale networks

## Next Lesson

> In the next lesson, we'll learn **[Canvas Visualization Interface and A2UI](../../advanced/canvas/)**.
>
> You'll learn:
> - Canvas A2UI push mechanism
> - How to display real-time content on Canvas
> - Complete list of Canvas commands

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Capability        | File Path                                                                                    | Lines   |
|--- | --- | ---|
| Node Command Policy | [`src/gateway/node-command-policy.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| Node Protocol Schema | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Android Documentation  | [`docs/platforms/android.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/android.md) | 1-142   |
| Node CLI  | [`docs/cli/nodes.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/nodes.md) | 1-69    |

**Key Constants**:
- `PLATFORM_DEFAULTS`: Defines command list supported by each platform (`node-command-policy.ts:32-58`)
- Commands supported by Android: Canvas, Camera, Screen, Location, SMS (`node-command-policy.ts:34-40`)

**Key Functions**:
- `resolveNodeCommandAllowlist()`: Parse allowed command list based on platform (`node-command-policy.ts:77-91`)
- `normalizePlatformId()`: Normalize platform ID (`node-command-policy.ts:60-75`)

**Android Node Features**:
- Client ID: `clawdbot-android` (`gateway/protocol/client-info.ts:9`)
- Device family detection: Identify Android via `deviceFamily` field (`node-command-policy.ts:70`)
- Canvas and Camera capabilities enabled by default (`docs/platforms/android.md`)

</details>
