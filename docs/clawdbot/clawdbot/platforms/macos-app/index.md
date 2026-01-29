---
title: "macOS App Guide: Menu Bar, Voice Wake, Talk Mode, and Node Mode | Clawdbot Tutorial"
sidebarTitle: "macOS App"
subtitle: "Complete Guide to Clawdbot macOS App: Menu Bar Control, Voice Wake, Talk Mode, and Node Mode"
description: "Learn the complete features of Clawdbot macOS app, including menu bar status management, embedded WebChat window, Voice Wake activation, Talk Mode continuous conversation, Node Mode execution, Exec Approvals security control, and SSH/Tailscale remote access configuration. Master local vs remote mode switching and permission management best practices."
tags:
  - "macOS"
  - "Menu Bar App"
  - "Voice Wake"
  - "Talk Mode"
  - "Node Mode"
prerequisite:
  - "start-getting-started"
order: 160
---

# macOS App: Menu Bar Control and Voice Interaction

## What You'll Learn

After completing this tutorial, you will be able to:

- ✅ Understand the core functionality of Clawdbot macOS app as a menu bar control plane
- ✅ Master the use of Voice Wake activation and Talk Mode continuous conversation
- ✅ Understand capabilities in Node Mode: `system.run`, Canvas, Camera, and more
- ✅ Configure local vs remote mode to adapt to different deployment scenarios
- ✅ Manage Exec Approvals approval mechanism to control command execution permissions
- ✅ Use deep links to quickly trigger AI assistant
- ✅ Access and control Gateway remotely via SSH/Tailscale

## Your Current Challenge

You might be thinking:

- "What exactly does the macOS app do? Is it the Gateway itself?"
- "How do I use Voice Wake and Talk Mode? Do I need extra hardware?"
- "What's the difference between Node Mode and regular mode? When should I use each?"
- "How do I manage permissions and security settings on macOS?"
- "Can I run Gateway on another machine?"

Good news: **Clawdbot macOS app is the graphical control plane for Gateway**. It doesn't run the Gateway service itself but connects to, manages, and monitors it. At the same time, it acts as a node exposing macOS-specific features (like `system.run`, Canvas, Camera) to remote Gateways.

## When to Use This

When you need:

- 🖥️ **macOS Graphical Management** — Menu bar status and control, more intuitive than command line
- 🎙️ **Voice Interaction** — Voice Wake activation + Talk Mode continuous conversation
- 💻 **Local Command Execution** — Run commands like `system.run` on macOS node
- 🎨 **Canvas Visualization** — Render AI-driven visual interfaces on macOS
- 📷 **Device Features** — Camera photo capture, video recording, and screen recording
- 🌐 **Remote Access** — Control remote Gateway via SSH/Tailscale

::: info Node vs Gateway Difference
- **Gateway**: Runs AI models, manages sessions, processes messages (can run on any machine)
- **Node**: Exposes device-local features (Canvas, Camera, system.run) to Gateway
- **macOS App**: Can be both a Gateway client and a node
:::

---

## Core Concepts

Clawdbot macOS app is a **dual-role** system:

```
┌──────────────────────────────────────────┐
│     Clawdbot.app (macOS App)       │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Menu Bar Control Plane  │      │
│   │  • Gateway connection mgmt │◄────► Gateway WebSocket
│   │  • Embedded WebChat        │      │
│   │  • Settings & config       │      │
│   │  • Voice Wake/Talk Mode    │      │
│   └────────────────────────────┘      │
│                                      │
│   ┌────────────────────────────┐      │
│   │  Node Service             │      │
│   │  • system.run              │◄────► Gateway node protocol
│   │  • Canvas                 │      │
│   │  • Camera/Screen          │      │
│   └────────────────────────────┘      │
└──────────────────────────────────────────┘
```

**Two Operating Modes**:

| Mode | Gateway Location | Node Service | Use Case |
| ----- | -------------- | --------- | -------- |
| **Local Mode** (default) | Local machine (launchd daemon) | Not started | Gateway runs on this Mac |
| **Remote Mode** | Remote machine (via SSH/Tailscale) | Started | Gateway runs on another machine |

**Core Feature Modules**:

1. **Menu Bar Control** — Gateway connection status, WebChat, configuration, session management
2. **Voice Wake** — Global voice wake word listening
3. **Talk Mode** — Continuous voice conversation loop (voice input → AI response → TTS playback)
4. **Node Mode** — Expose macOS-specific commands (`system.run`, `canvas.*`, `camera.*`)
5. **Exec Approvals** — `system.run` command execution approval and security control
6. **Deep Links** — `clawdbot://` protocol for quick feature triggering

---

## Follow Along

### Step 1: Install and Launch the macOS App

**Why**
You need to install the Clawdbot macOS app to get menu bar control and voice features.

**Installation Methods**:

::: code-group

```bash [Install with Homebrew]
brew install --cask clawdbot
```

```bash [Manual download .dmg]
# Download latest Clawdbot.app.dmg from https://github.com/clawdbot/clawdbot/releases
# Drag to Applications folder
```

:::

**First Launch**:

```bash
open /Applications/Clawdbot.app
```

**You should see**:
- 🦞 icon appears in macOS top menu bar
- Clicking the icon expands the dropdown menu
- System prompts TCC permission request dialogs

::: tip Permission Requests on First Launch
The macOS app needs the following permissions (system will prompt automatically):
- **Notification permission** — Display system notifications
- **Accessibility permission** — For Voice Wake and system operations
- **Microphone permission** — Required for Voice Wake and Talk Mode
- **Screen Recording permission** — For Canvas and screen recording features
- **Speech Recognition permission** — Voice input for Voice Wake
- **Automation permission** — AppleScript control (if needed)

All these permissions are used **entirely locally** and are not uploaded to any server.
:::

---

### Step 2: Configure Connection Mode (Local vs Remote)

**Why**
Choose local or remote mode based on your deployment needs.

#### Mode A: Local Mode (Default)

Use case: Gateway and macOS app run on the same machine.

**Configuration Steps**:

1. Ensure the menu bar app displays **Local** mode
2. If Gateway is not running, the app will automatically start the `com.clawdbot.gateway` launchd service
3. The app will connect to `ws://127.0.0.1:18789`

**You should see**:
- Menu bar icon shows green (connected status)
- Gateway status card displays "Local"
- Node service **not started** (node mode is only needed in remote mode)

#### Mode B: Remote Mode

Use case: Gateway runs on another machine (e.g., a server or Linux VPS), and you want to control it from your Mac.

**Configuration Steps**:

1. Switch to **Remote** mode in the menu bar app
2. Enter the remote Gateway's WebSocket address (e.g., `ws://your-server:18789`)
3. Select authentication method (Token or Password)
4. The app will automatically establish an SSH tunnel to connect to the remote Gateway

**You should see**:
- Menu bar icon displays connection status (yellow/green/red)
- Gateway status card shows the remote server address
- Node service **automatically started** (so remote Gateway can call local features)

**Remote Mode Tunnel Mechanism**:

```
macOS App                     Remote Gateway
    │                                  │
    ├── SSH tunnel ───────────────────► ws://remote:18789
    │                                  │
    └── Node service ◄───────────────── node.invoke
```

::: tip Advantages of Remote Mode
- **Centralized Management**: Run Gateway on a powerful machine, accessed by multiple clients
- **Resource Optimization**: Mac stays lightweight, Gateway runs on a high-performance server
- **Device Localization**: Canvas, Camera and other features still execute locally on the Mac
:::

---

### Step 3: Use the Menu Bar Control Plane

**Why**
The menu bar app provides a quick-access interface for all core features.

**Core Menu Items**:

After clicking the menu bar icon, you'll see:

1. **Status Card**
   - Gateway connection status (connected/disconnected/connecting)
   - Current mode (Local/Remote)
   - List of running channels (WhatsApp, Telegram, etc.)

2. **Quick Actions**
   - **Agent** — Open AI conversation window (call Gateway)
   - **WebChat** — Open embedded WebChat interface
   - **Canvas** — Open Canvas visualization window
   - **Settings** — Open configuration interface

3. **Feature Toggles**
   - **Talk** — Enable/Disable Talk Mode
   - **Voice Wake** — Enable/Disable Voice Wake

4. **Info Menu**
   - **Usage** — View usage statistics and costs
   - **Sessions** — Manage session list
   - **Channels** — View channel status
   - **Skills** — Manage skill packages

**You should see**:
- Real-time status indicators (green = normal, red = disconnected)
- Hovering displays detailed connection information
- Clicking any menu item quickly opens the corresponding feature

---

### Step 4: Configure and Use Voice Wake

**Why**
Voice Wake allows you to trigger the AI assistant through voice wake words, without clicking or typing.

**How Voice Wake Works**:

```
┌──────────────────────────────────┐
│   Voice Wake Runtime          │
│                              │
│   Listen to mic ──► Detect wake word │
│                              │
│   Wake word matched?               │
│       │                       │
│       ├─ Yes ──► Trigger Agent  │
│       │                       │
│       └─ No ──► Continue listening  │
└──────────────────────────────────┘
```

**Configure Voice Wake**:

1. Open **Settings** → **Voice Wake**
2. Enter wake words (default: `clawd`, `claude`, `computer`)
3. You can add multiple wake words (separated by commas)
4. Enable the **Enable Voice Wake** switch

**Wake Word Rules**:
- Wake words are stored in Gateway: `~/.clawdbot/settings/voicewake.json`
- All nodes share the **same global wake word list**
- Changes are broadcast to all connected devices (macOS, iOS, Android)

**Usage Flow**:

1. Ensure microphone permission is granted
2. Enable Voice Wake in the menu bar
3. Speak the wake word into the microphone (e.g., "Hey clawd")
4. Wait to hear a "ding" notification sound (indicates successful activation)
5. Speak your command or question

**You should see**:
- Voice Wake overlay appears in the center of the screen
- Microphone volume waveform is displayed
- "Listening" status text is shown
- AI begins processing your voice input

::: tip Global Nature of Voice Wake
Wake words are **Gateway-level global configuration**, not limited to a single device. This means:
- Modifying wake words on macOS syncs them to iOS and Android devices
- All devices use the same set of wake words
- But each device can individually enable/disable Voice Wake (based on permissions and user preferences)
:::

---

### Step 5: Use Talk Mode for Continuous Conversation

**Why**
Talk Mode provides a continuous voice conversation experience similar to Siri/Alexa, without needing to wake it up each time.

**Talk Mode Loop**:

```
Listen ──► AI Process ──► TTS Play ──► Listen
  │                                              │
  └────────────────────────────────────────┘
```

**Enable Talk Mode**:

1. Click the **Talk** button in the menu bar
2. Or use a keyboard shortcut (default: none, can be set in Settings)
3. Talk Mode overlay appears

**Talk Mode Interface States**:

| State | Display | Description |
| ----- | ---- | ---- |
| **Listening** | Cloud pulse animation + mic volume | Waiting for you to speak |
| **Thinking** | Sinking animation | AI is thinking |
| **Speaking** | Radiating ring animation + ripples | AI is replying (TTS playing) |

**Interaction Controls**:

- **Stop Speaking**: Click the cloud icon to stop TTS playback
- **Exit Talk Mode**: Click the X button in the top right corner
- **Voice Interruption**: If you start speaking while AI is talking, playback automatically stops

**Configure TTS**:

Talk Mode uses ElevenLabs for text-to-speech. Configuration location: `~/.clawdbot/clawdbot.json`

```yaml
talk:
  voiceId: "elevenlabs_voice_id"  # ElevenLabs voice ID
  modelId: "eleven_v3"            # Model version
  apiKey: "elevenlabs_api_key"     # API key (or use environment variable)
  interruptOnSpeech: true           # Interrupt on speech
  outputFormat: "mp3_44100_128"   # Output format
```

::: tip ElevenLabs Configuration
If no API key is configured, Talk Mode will try to use:
1. `ELEVENLABS_API_KEY` environment variable
2. Key in Gateway shell profile
3. First available ElevenLabs voice as default
:::

---

### Step 6: Use Node Mode

**Why**
Node Mode allows the macOS app to expose local capabilities to a remote Gateway, enabling true cross-device collaboration.

**Available Commands in Node Mode**:

| Command Category | Command Examples | Function Description |
| --------- | ---------- | -------- |
| **Canvas** | `canvas.present`, `canvas.navigate`, `canvas.eval` | Render visual interfaces on macOS |
| **Camera** | `camera.snap`, `camera.clip` | Take photos or videos |
| **Screen** | `screen.record` | Screen recording |
| **System** | `system.run`, `system.notify` | Execute Shell commands or send notifications |

**Enable Node Mode**:

Node mode automatically starts in **remote mode** because the remote Gateway needs to call local features.

You can also manually start the node service:

```bash
clawdbot node run --display-name "My Mac"
```

**Node Permission Management**:

The macOS app reports which features are available through the permission system:

```json
{
  "canvas": true,
  "camera": true,
  "screen": true,
  "system": {
    "run": true,
    "notify": true
  }
}
```

The AI will automatically select available tools based on permissions.

---

### Step 7: Configure Exec Approvals (`system.run` Security Control)

**Why**
`system.run` can execute arbitrary Shell commands, so an approval mechanism is needed to prevent accidental or abusive use.

**Exec Approvals Three-Layer Security Model**:

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",          // Default policy: deny
    "ask": "on-miss"           // Ask when command not in allowlist
  },
  "agents": {
    "main": {
      "security": "allowlist",    // Main session: only allow allowlist
      "ask": "on-miss",
      "allowlist": [
        { "pattern": "/usr/bin/git" },
        { "pattern": "/opt/homebrew/*/rg" }
      ]
    }
  }
}
```

**Security Policy Types**:

| Policy | Behavior | Use Case |
| ----- | ---- | -------- |
| `deny` | Deny all `system.run` calls | High security, disable all commands |
| `allowlist` | Only allow commands in the allowlist | Balance security and convenience |
| `ask` | Prompt user for approval when not in allowlist | Flexible but requires confirmation |

**Approval Flow**:

When AI attempts to execute an unauthorized command:

1. macOS app displays an approval dialog
2. Shows the complete command path and arguments
3. Provides three options:
   - **Allow Once** — Allow only this time
   - **Always Allow** — Add to allowlist
   - **Deny** — Deny execution

**You should see**:
- Approval dialog displays command details (e.g., `/usr/bin/ls -la ~`)
- After selecting "Always Allow", it won't ask again next time
- After selecting "Deny", command execution fails and returns an error to AI

**Configuration Location**:

Exec Approvals are stored locally on macOS:
- File: `~/.clawdbot/exec-approvals.json`
- Approval history: View all approved/denied commands in the app

---

### Step 8: Use Deep Links

**Why**
Deep links provide the ability to quickly trigger Clawdbot features from other apps.

**Supported Deep Link Protocol**: `clawdbot://`

#### `clawdbot://agent`

Triggers Gateway `agent` request, equivalent to running `clawdbot agent` in the terminal.

**Parameters**:

| Parameter | Description | Example |
| ----- | ---- | ---- |
| `message` (required) | Message to send to AI | `message=Hello%20from%20deep%20link` |
| `sessionKey` (optional) | Target session key, default `main` | `sessionKey=main` |
| `thinking` (optional) | Thinking level: off\|minimal\|low\|medium\|high\|xhigh | `thinking=high` |
| `deliver`/`to`/`channel` (optional) | Delivery channel | `channel=telegram` |
| `timeoutSeconds` (optional) | Timeout in seconds | `timeoutSeconds=30` |
| `key` (optional) | No-confirmation key for automation | `key=your-secret-key` |

**Examples**:

```bash
# Basic: Send message
open 'clawdbot://agent?message=Hello%20from%20deep%20link'

# Advanced: Send to Telegram, high thinking level, 30 second timeout
open 'clawdbot://agent?message=Summarize%20my%20day&to=telegram&thinking=high&timeoutSeconds=30'

# Automation: Use key to skip confirmation (only use securely in your scripts)
open 'clawdbot://agent?message=Automated%20task&key=secure-random-string'
```

**You should see**:
- Clawdbot macOS app opens automatically (if not running)
- Agent window appears and displays the message
- AI begins processing and returns a response

::: warning Deep Link Security
- When no `key` parameter is present, the app will show a confirmation dialog
- When a valid `key` is provided, the request executes silently (for automation scripts)
- Never use deep links from untrusted sources
:::

---

## Checkpoint ✅

After completing the above steps, verify the following:

### Installation and Connection

- [ ] macOS app successfully installed and appears in Applications folder
- [ ] All required permissions granted on first launch
- [ ] Menu bar icon displays correctly
- [ ] Can connect to Gateway in Local mode
- [ ] Can connect to Gateway in Remote mode

### Voice Wake and Talk Mode

- [ ] Voice Wake wake words configured successfully (e.g., "clawd", "claude")
- [ ] Speaking the wake word triggers the AI assistant
- [ ] Talk Mode overlay opens and closes normally
- [ ] TTS playback is clear (requires ElevenLabs API key)
- [ ] Voice interruption works correctly (stops playback when you speak)

### Node Mode and Exec Approvals

- [ ] Node service automatically starts in remote mode
- [ ] `system.run` commands execute and return results
- [ ] Exec Approvals dialog displays correctly
- [ ] "Always Allow" correctly adds to allowlist
- [ ] "Deny" correctly denies command execution

### Advanced Features

- [ ] Deep links can trigger from terminal or other apps
- [ ] Settings interface correctly saves configuration
- [ ] Embedded WebChat window opens normally
- [ ] Canvas window displays AI-generated visual content

---

## Common Pitfalls

### ❌ Permission Denied or Not Granted

**Problem**:
- Voice Wake cannot listen to microphone
- Canvas cannot display content
- `system.run` command execution fails

**Solution**:
1. Open **System Settings** → **Privacy & Security**
2. Find **Clawdbot** or **Clawdbot.app**
3. Ensure **Microphone**, **Accessibility**, **Screen Recording**, **Automation** and other permissions are enabled
4. Restart the Clawdbot app

::: tip TCC Permission Troubleshooting
If the permission toggle cannot be enabled or immediately disables:
- Check if any security tools are enabled (e.g., Little Snitch)
- Try completely uninstalling and reinstalling the app
- Check TCC denial logs in Console.app
:::

### ❌ Gateway Connection Failed

**Problem**:
- Menu bar icon shows red (disconnected status)
- Status card displays "Connection Failed"
- WebChat cannot open

**Possible Causes and Solutions**:

| Cause | Check Method | Solution |
| ----- | -------- | -------- |
| Gateway not started | Run `clawdbot gateway status` | Start Gateway service |
| Wrong address | Check WebSocket URL | Confirm `ws://127.0.0.1:18789` or remote address is correct |
| Port occupied | Run `lsof -i :18789` | Close process occupying the port |
| Authentication failed | Check Token/Password | Confirm authentication credentials are correct |

### ❌ Talk Mode Cannot Be Used

**Problem**:
- No response after enabling Talk Mode
- TTS cannot play
- Microphone cannot input

**Solution**:

1. **Check ElevenLabs Configuration**:
   - Confirm API key is set
   - Test if key is valid: Visit ElevenLabs console

2. **Check Network Connection**:
   - TTS requires internet connection
   - Check if firewall blocks API requests

3. **Check Audio Output**:
   - Confirm system volume is turned up
   - Check if default output device is correct

### ❌ Node Cannot Connect in Remote Mode

**Problem**:
- Remote Gateway cannot call commands like `system.run` on macOS
- Error log shows "Node not found" or "Node offline"

**Solution**:

1. **Confirm Node Service Running**:
   ```bash
   clawdbot nodes list
   # Should see macOS node displayed as "paired"
   ```

2. **Check SSH Tunnel**:
   - View SSH connection status in macOS app settings
   - Confirm you can manually SSH to remote Gateway

3. **Restart Node Service**:
   ```bash
   # On macOS
   clawdbot node restart
   ```

---

## Summary

In this lesson, you learned:

1. ✅ **macOS App Architecture** — Dual role as Gateway control plane and node
2. ✅ **Local vs Remote Mode** — How to configure for different deployment scenarios
3. ✅ **Menu Bar Features** — Quick access to status management, WebChat, Canvas, settings, etc.
4. ✅ **Voice Wake** — Trigger AI assistant through wake words
5. ✅ **Talk Mode** — Continuous voice conversation experience
6. ✅ **Node Mode** — Expose macOS-specific capabilities (`system.run`, Canvas, Camera)
7. ✅ **Exec Approvals** — Three-layer security control mechanism for `system.run`
8. ✅ **Deep Links** — `clawdbot://` protocol for quick feature triggering

**Best Practices**:
- 🚀 Local deployment: Use the default Local mode
- 🌐 Remote deployment: Configure SSH/Tailscale for centralized management
- 🔐 Security first: Configure reasonable allowlist policies for `system.run`
- 🎙️ Voice interaction: Pair with ElevenLabs for optimal TTS experience

---

## Preview of Next Lesson

> In the next lesson, we'll learn **[iOS Node](../ios-node/)**.
>
> You'll learn:
> - How to configure iOS node to connect to Gateway
> - iOS node features (Canvas, Camera, Location, Voice Wake)
> - How to pair iOS devices through Gateway
> - iOS node permission management and security control
> - Bonjour discovery and Tailscale remote connection

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature        | File Path                                                                                    | Line    |
| ----------- | --------------------------------------------------------------------------------------- | ------- |
| App Entry     | [`apps/macos/Sources/Clawdbot/ClawdbotApp.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ClawdbotApp.swift) | Entire file   |
| Gateway Connection | [`apps/macos/Sources/Clawdbot/GatewayConnection.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/GatewayConnection.swift) | 1-500   |
| Voice Wake Runtime | [`apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeRuntime.swift) | Entire file   |
| Talk Mode Types | [`apps/macos/Sources/Clawdbot/TalkModeTypes.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/TalkModeTypes.swift) | Entire file   |
| Voice Wake Overlay | [`apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/VoiceWakeOverlayView.swift) | Entire file   |
| Node Mode Coordinator | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeModeCoordinator.swift) | Entire file   |
| Node Runtime | [`apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/NodeMode/MacNodeRuntime.swift) | Entire file   |
| Permission Manager | [`apps/macos/Sources/Clawdbot/PermissionManager.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/PermissionManager.swift) | Entire file   |
| Exec Approvals | [`apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/ExecApprovalsGatewayPrompter.swift) | Entire file   |
| Menu Bar | [`apps/macos/Sources/Clawdbot/MenuBar.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuBar.swift) | Entire file   |
| Menu Injector | [`apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/Sources/Clawdbot/MenuSessionsInjector.swift) | Entire file   |

**Key Constants**:
- `GatewayConnection.shared`: Singleton Gateway connection manager (`GatewayConnection.swift:48`)
- `VoiceWakeRuntime`: Voice Wake core runtime (singleton)
- `MacNodeModeCoordinator`: Node mode coordinator, manages local service startup

**Key Types**:
- `GatewayAgentChannel`: Gateway agent channel enum (`GatewayConnection.swift:9-30`)
- `GatewayAgentInvocation`: Gateway agent invocation struct (`GatewayConnection.swift:32-41`)
- `ExecApprovalsConfig`: Exec Approvals configuration struct (JSON Schema)
- `VoiceWakeSettings`: Voice Wake configuration struct

**Key Functions**:
- `GatewayConnection.sendAgent()`: Send agent request to Gateway
- `GatewayConnection.setVoiceWakeTriggers()`: Update global wake word list
- `PermissionManager.checkPermission()`: Check TCC permission status
- `ExecApprovalsGatewayPrompter.prompt()`: Display approval dialog

**Documentation Locations**:
- [macOS App Documentation](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/macos.md)
- [Voice Wake Documentation](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/voicewake.md)
- [Talk Mode Documentation](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/talk.md)
- [Node Documentation](https://github.com/clawdbot/clawdbot/blob/main/docs/nodes/index.md)

</details>
