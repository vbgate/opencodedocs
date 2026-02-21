---
title: "Browser Control - Automating Chrome/Chromium | OpenClaw Tutorial"
sidebarTitle: "Browser Control"
subtitle: "Browser Control - Automating Chrome/Chromium"
description: "Learn how to configure browser control, understand CDP protocol, automate web operations, and enable AI assistants to browse and interact with web pages."
tags:
  - "Browser"
  - "Automation"
  - "CDP"
  - "Playwright"
order: 110
---

# Browser Control - Automating Chrome/Chromium

## What You'll Learn

After completing this course, you will be able to:
- Configure browser control and CDP connections
- Use AI assistants to automate web operations
- Set up browser security policies
- Manage multiple browser profiles

## Core Concepts

OpenClaw uses **Playwright** and **Chrome DevTools Protocol (CDP)** to control the browser, enabling AI assistants to browse web pages, perform actions, and extract information.

```
┌─────────────────────────────────────────────────────────────┐
│                  Browser Control Architecture                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   AI Assistant Request                                      │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────┐              │
│   │      OpenClaw Browser Service          │              │
│   │         (Express HTTP Server)          │              │
│   └───────────────┬─────────────────────────┘              │
│                   │                                         │
│       ┌───────────┴───────────┐                            │
│       │                       │                            │
│       ▼                       ▼                            │
│   ┌──────────┐           ┌──────────┐                     │
│   │Playwright│           │  CDP     │                     │
│   │ Control  │           │ Protocol │                     │
│   └────┬─────┘           └────┬─────┘                     │
│        │                       │                           │
│        └───────────┬───────────┘                           │
│                    │                                       │
│                    ▼                                       │
│        ┌──────────────────────┐                           │
│        │  Chrome/Chromium     │                           │
│        │  ┌────────────────┐  │                           │
│        │  │ Profile: default│ │                           │
│        │  │ Profile: work   │ │                           │
│        │  └────────────────┘  │                           │
│        └──────────────────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Browser Control Features

| Feature | Description | Use Case |
| --- | --- | --- |
| **Page Navigation** | Open, refresh, forward, back | Browse web pages, fetch information |
| **Element Interaction** | Click, input, scroll | Form filling, button clicking |
| **Screenshot** | Full page, element, viewport capture | Visual feedback, debugging |
| **PDF Generation** | Convert page to PDF | Save web content |
| **Download Management** | File download, save | Retrieve resource files |
| **Cookie/Storage** | Read/write localStorage, Cookie | State management |
| **JS Execution** | Run custom JavaScript | Complex operations |

## Follow Along

### Step 1: Enable Browser Control

**Why**  
Browser control may be disabled by default and needs to be explicitly enabled.

```bash
# Enable browser control
openclaw config set browser.enabled true

# Configure default headless mode (optional)
openclaw config set browser.headless false

# Verify configuration
openclaw config get browser
```

### Step 2: Configure Browser Path

**Why**  
You need to specify the location of the Chrome/Chromium executable.

```bash
# macOS
openclaw config set browser.executablePath "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Linux
openclaw config set browser.executablePath "/usr/bin/google-chrome"

# Windows
openclaw config set browser.executablePath "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

# Or use Chromium
openclaw config set browser.executablePath "/usr/bin/chromium"
```

**Auto Detection**  
If `executablePath` is not configured, OpenClaw will attempt to auto-detect installed Chrome/Chromium.

### Step 3: Configure Browser Profiles

**Why**  
Multiple profiles can isolate browser state (cookies, login status, etc.) for different tasks.

```bash
# Create a new profile
openclaw browser profile create work

# Configure profile-specific CDP port
openclaw config set browser.profiles.work.cdpPort 9223

# Configure profile color (UI display)
openclaw config set browser.profiles.work.color "#FF5733"

# Use extension driver (requires Chrome extension)
openclaw config set browser.profiles.extension.driver "extension"
openclaw config set browser.profiles.extension.cdpUrl "ws://localhost:9222/devtools/browser/..."
```

**Profile Configuration Example** (`src/config/types.browser.ts`)

```typescript
type BrowserProfileConfig = {
  cdpPort?: number;      // CDP port
  cdpUrl?: string;       // CDP URL (for remote browsers)
  driver?: "openclaw" | "extension";  // Driver type
  color: string;         // Profile color
};
```

### Step 4: Start Browser Service

**Why**  
The browser service needs to run alongside the Gateway.

```bash
# Start Gateway (browser service starts automatically)
openclaw gateway run

# Check browser service status
openclaw status
```

**You Should See**

```
┌─────────────────────────────────────┐
│  OpenClaw Gateway Status            │
├─────────────────────────────────────┤
│  Gateway:    ✅ Running (port 18789)│
│  Browser:    ✅ Running (port 18790)│
│  Auth:       token                  │
└─────────────────────────────────────┘
```

### Step 5: Use Browser Tools

**Why**  
AI assistants can control the browser through tool calls.

Browser tool endpoints (default port 18790):

```bash
# Get browser status
curl http://localhost:18790/status

# Open new tab
curl -X POST http://localhost:18790/tabs \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Take screenshot
curl -X POST http://localhost:18790/screenshot \
  -H "Content-Type: application/json" \
  -d '{"selector": "body", "fullPage": true}'
```

### Step 6: Configure Browser Security

**Why**  
Browser control involves executing JavaScript and requires security restrictions.

```bash
# Disable arbitrary JavaScript execution (whitelist operations only)
openclaw config set browser.evaluateEnabled false

# Enable sandbox mode (Linux container environments)
openclaw config set browser.noSandbox false

# Configure remote CDP timeout
openclaw config set browser.remoteCdpTimeoutMs 1500
```

**Security Configuration Options**

```json
{
  "browser": {
    "enabled": true,
    "evaluateEnabled": false,
    "noSandbox": false,
    "headless": true,
    "remoteCdpTimeoutMs": 1500,
    "remoteCdpHandshakeTimeoutMs": 3000
  }
}
```

### Step 7: Connect to Remote Browser

**Why**  
You can connect to a running Chrome instance or use remote browser services.

```bash
# Configure remote CDP URL
openclaw config set browser.cdpUrl "ws://remote-server:9222/devtools/browser/..."

# Or configure profile remote URL
openclaw config set browser.profiles.remote.cdpUrl "ws://browserless:3000"
```

**Start Chrome with CDP Enabled**

```bash
# macOS
/Applications/Google\\ Chrome.app/Contents/MacOS/Google Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-dev-profile

# Linux
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-dev-profile
```

## Checkpoint ✅

Verify browser control:

```bash
# Check browser status
openclaw browser status

# Expected output
┌─────────────────────────────────────┐
│  Browser Control Status             │
├─────────────────────────────────────┤
│  Status:     ✅ Running              │
│  Port:       18790                   │
│  Auth:       token                   │
│  Profiles:   default, work           │
└─────────────────────────────────────┘

# List open pages
openclaw browser tabs list
```

## Troubleshooting

::: warning Common Issues
1. **Chrome Not Found**  
   Symptom: `Chrome executable not found`  
   Solution: Install Chrome or Chromium, or configure the correct `executablePath`

2. **CDP Port Occupied**  
   Symptom: `Port already in use`  
   Solution: Change the `cdpPort` configuration, or close the process using the port

3. **Browser Launch Failed**  
   Symptom: `Failed to launch browser`  
   Solution: Use `noSandbox: true` in Linux containers, check permissions

4. **Screenshot Failed**  
   Symptom: `Screenshot timeout`  
   Solution: Increase timeout, check if page is fully loaded

5. **JS Execution Denied**  
   Symptom: `evaluate is disabled`  
   Solution: Set `evaluateEnabled: true` (be aware of security risks)
:::

## Browser Profile Management

### Common Commands

```bash
# List all profiles
openclaw browser profile list

# Create new profile
openclaw browser profile create shopping

# Delete profile
openclaw browser profile delete shopping

# Reset profile
openclaw browser profile reset default
```

### Profile Use Cases

| Profile | Purpose | Configuration |
| --- | --- | --- |
| `default` | General browsing | Default settings |
| `work` | Work-related | Logged into work accounts |
| `personal` | Personal use | Logged into personal accounts |
| `incognito` | Private browsing | Incognito mode |

## AI Integration

### AI Tool Call Examples

When an AI assistant needs to browse a webpage, it will call browser tools:

```json
{
  "tool": "browser_navigate",
  "params": {
    "url": "https://www.example.com",
    "profile": "default"
  }
}

{
  "tool": "browser_screenshot",
  "params": {
    "selector": "#main-content",
    "fullPage": false
  }
}

{
  "tool": "browser_click",
  "params": {
    "selector": "button[type=submit]"
  }
}
```

## Summary

In this course, you learned:

- ✅ Browser control architecture and how it works
- ✅ Enabling and configuring browser control
- ✅ Managing multiple browser profiles
- ✅ Configuring browser security policies
- ✅ Connecting to remote browsers
- ✅ Using browser tool endpoints
- ✅ Integration methods with AI assistants

## Next Lesson Preview

> Next we learn **[Skills System](../skills-system/)**.
>
> You will learn:
> - Skills system architecture
> - Installing and creating custom skills
> - Skill development and publishing

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line |
| --- | --- | --- |
| Browser Implementation | [`src/browser/`](https://github.com/openclaw/openclaw/blob/main/src/browser/) | - |
| Browser Service | [`src/browser/server.ts`](https://github.com/openclaw/openclaw/blob/main/src/browser/server.ts) | 1-200 |
| Browser Config Types | [`src/config/types.browser.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.browser.ts) | 1-42 |
| Gateway Browser Service | [`src/gateway/server-browser.ts`](https://github.com/openclaw/openclaw/blob/main/src/gateway/server-browser.ts) | - |
| Playwright Tools | [`src/browser/pw-tools-core.ts`](https://github.com/openclaw/openclaw/blob/main/src/browser/pw-tools-core.ts) | - |
| Chrome Launcher | [`src/browser/chrome.ts`](https://github.com/openclaw/openclaw/blob/main/src/browser/chrome.ts) | - |

**Key Dependencies**:
- `playwright`: Browser automation
- `express`: HTTP server
- CDP: Chrome DevTools Protocol

</details>
