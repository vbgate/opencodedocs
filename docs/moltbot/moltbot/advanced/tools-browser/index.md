---
title: "Browser Automation Tools: Web Control and UI Automation | Clawdbot Tutorial"
sidebarTitle: "Browser Tools"
subtitle: "Browser Automation Tools: Web Control and UI Automation"
description: "Learn how to use Clawdbot's browser tools for web automation, screenshots, form manipulation, and UI control. This tutorial covers browser startup, page snapshots, UI interactions (click/type/drag etc.), file uploads, dialog handling, and remote browser control. Master the complete workflow, including Chrome extension relay mode and standalone browser configuration, as well as executing browser operations on iOS/Android nodes."
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# Browser Automation Tools: Web Control and UI Automation

## What You'll Learn

After completing this lesson, you will be able to:

- Start and control Clawdbot-managed browsers
- Take over your existing Chrome tabs using the Chrome extension relay
- Capture web page snapshots (AI/ARIA format) and screenshots (PNG/JPEG)
- Execute UI automation actions: click, type text, drag, select, fill forms
- Handle file uploads and dialogs (alert/confirm/prompt)
- Control distributed browsers via remote browser control servers
- Execute browser operations on iOS/Android devices using node proxies

## Your Current Challenge

You've already started the Gateway and configured AI models, but browser tool usage still raises questions:

- AI cannot access web page content, relying on you to describe page structure?
- Want AI to automatically fill forms and click buttons, but don't know how?
- Want to take screenshots or save web pages, but need manual operations every time?
- Want to use your own Chrome tabs (with logged-in sessions) instead of launching a new browser?
- Want to execute browser operations on remote devices (like iOS/Android nodes)?

## When to Use This

**Browser tool suitable scenarios**:

| Scenario | Action | Example |
|--- | --- | ---|
| Automated Forms | `act` + `fill` | Fill registration forms, submit orders |
| Web Scraping | `snapshot` | Extract web structure, scrape data |
| Screenshot Saving | `screenshot` | Save web screenshots, save evidence |
| File Upload | `upload` | Upload resumes, upload attachments |
| Dialog Handling | `dialog` | Accept/reject alert/confirm |
| Use Existing Sessions | `profile="chrome"` | Operate on logged-in Chrome tabs |
| Remote Control | `target="node"` | Execute on iOS/Android nodes |

## 🎒 Prerequisites

::: warning Prerequisites Check

Before using browser tools, ensure:

1. ✅ Gateway is started (`clawdbot gateway start`)
2. ✅ AI model is configured (Anthropic / OpenAI / OpenRouter, etc.)
3. ✅ Browser tools are enabled (`browser.enabled=true`)
4. ✅ Understand the target you want to use (sandbox/host/custom/node)
5. ✅ If using Chrome extension relay, extension is installed and enabled

:::

## Core Concepts

**What are browser tools?**

Browser tools are built-in automation tools in Clawdbot that allow AI to control browsers via CDP (Chrome DevTools Protocol):

- **Control Server**: `http://127.0.0.1:18791` (default)
- **UI Automation**: Element location and operations based on Playwright
- **Snapshot Mechanism**: AI format or ARIA format, returns page structure and element references
- **Multi-target Support**: sandbox (default), host (Chrome relay), custom (remote), node (device node)

**Two Browser Modes**:

| Mode | Profile | Driver | Description |
|--- | --- | --- | ---|
| **Standalone Browser** | `clawd` (default) | clawd | Clawdbot launches a standalone Chrome/Chromium instance |
| **Chrome Relay** | `chrome` | extension | Takes over your existing Chrome tabs (requires extension installation) |

**Workflow**:

```
1. Start browser (start)
   ↓
2. Open tab (open)
   ↓
3. Get page snapshot (snapshot) → Get element reference (ref)
   ↓
4. Execute UI operations (act: click/type/fill/drag)
   ↓
5. Verify results (screenshot/snapshot)
```

## Follow Along

### Step 1: Start Browser

**Why**

First time using browser tools, you need to start the browser control server.

```bash
# Tell AI to start browser in chat
Please start browser

# Or use browser tool
action: start
profile: clawd  # or chrome (Chrome extension relay)
target: sandbox
```

**You should see**:

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip Checkpoint

- Seeing `Browser control server` indicates successful startup
- Default uses `clawd` profile (standalone browser)
- To use Chrome extension relay, use `profile="chrome"`
- Browser window opens automatically (non-headless mode)

:::
### Step 2: Open Web Page

**Why**

Open target web page, prepare for automation operations.

```bash
# In chat
Please open https://example.com

# Or use browser tool
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**You should see**:

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip Element Reference (targetId)

Each time you open or focus a tab, a `targetId` is returned. This ID is used for subsequent operations (snapshot/act/screenshot).

:::

### Step 3: Get Page Snapshot

**Why**

Snapshot lets AI understand page structure, returns actionable element references (ref).

```bash
# Get AI format snapshot (default)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # Use Playwright aria-ref ids (stable across calls)

# Or get ARIA format snapshot (structured output)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**You should see** (AI format):

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip Snapshot Format Selection

| Format | Use Case | Features |
|--- | --- | ---|
| `ai` | Default, AI understanding | Good readability, suitable for AI parsing |
| `aria` | Structured output | Suitable for scenarios requiring precise structure |
| `refs="aria"` | Cross-call stable | Recommended for multi-step operations (snapshot → act) |

:::

### Step 4: Execute UI Operations (act)

**Why**

Use element references (ref) returned from snapshot to execute automation operations.

```bash
# Click button
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Type text
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Fill form (multiple fields)
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# Click submit button
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**You should see**:

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip Common UI Operations

| Operation | Kind | Parameters |
|--- | --- | ---|
| Click | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| Type Text | `type` | `ref`, `text`, `submit`, `slowly` |
| Press Key | `press` | `key`, `targetId` |
| Hover | `hover` | `ref`, `targetId` |
| Drag | `drag` | `startRef`, `endRef`, `targetId` |
| Select | `select` | `ref`, `values` |
| Fill Form | `fill` | `fields` (array) |
| Wait | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| Execute JS | `evaluate` | `fn`, `ref`, `targetId` |

:::
### Step 5: Take Web Page Screenshot

**Why**

Verify operation results or save web page screenshots.

```bash
# Screenshot current tab
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# Screenshot full page
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# Screenshot specific element
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # Use ref from snapshot
type: jpeg
```

**You should see**:

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip Screenshot Format

| Format | Use Case |
|--- | ---|
| `png` | Default, lossless compression, suitable for documentation |
| `jpeg` | Lossy compression, smaller file size, suitable for storage |

:::

### Step 6: Handle File Upload

**Why**

Automate file upload operations in forms.

```bash
# First trigger file selector (click upload button)
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# Then upload files
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # Optional: specify ref of file selector
targetId: tab_abc123
profile: clawd
```

**You should see**:

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning File Path Notes

- Use absolute paths, relative paths not supported
- Ensure files exist and have read permissions
- Multiple files uploaded in array order

:::

### Step 7: Handle Dialogs

**Why**

Automatically handle alert, confirm, prompt dialogs in web pages.

```bash
# Accept dialog (alert/confirm)
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# Reject dialog (confirm)
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# Answer prompt dialog
action: dialog
accept: true
promptText: "User's answer"
targetId: tab_abc123
profile: clawd
```

**You should see**:

```
✓ Dialog handled: accepted (prompt: "User's answer")
```

## Common Pitfalls

### ❌ Error: Chrome Extension Relay Not Connected

**Error message**:
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**Cause**: Used `profile="chrome"` but no tabs attached

**Solution**:

1. Install Clawdbot Browser Relay extension (Chrome Web Store)
2. Click extension icon on the tab you want to control (badge shows ON)
3. Re-run `action: snapshot profile="chrome"`

### ❌ Error: Element Reference Expired (stale targetId)

**Error message**:
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**Cause**: Tab closed or targetId expired

**Solution**:

```bash
# Re-fetch tab list
action: tabs
profile: chrome

# Use new targetId
action: snapshot
targetId: "new_targetId"
profile: chrome
```

### ❌ Error: Browser Control Server Not Started

**Error message**:
```
Browser control server not available. Run action=start first.
```

**Cause**: Browser control server not started

**Solution**:

```bash
# Start browser
action: start
profile: clawd
target: sandbox
```

### ❌ Error: Remote Browser Connection Timeout

**Error message**:
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**Cause**: Remote browser connection timeout

**Solution**:

```bash
# Increase timeout in configuration file
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```
### ❌ Error: Node Browser Proxy Unavailable

**Error message**:
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**Cause**: Node browser proxy is disabled

**Solution**:

```bash
# Enable node browser in configuration file
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # or "manual"
      }
    }
  }
}
```

## Summary

In this lesson, you learned:

✅ **Browser Control**: Start/stop/status check
✅ **Tab Management**: Open/focus/close tabs
✅ **Page Snapshots**: AI/ARIA formats, get element references
✅ **UI Automation**: click/type/drag/fill/wait/evaluate
✅ **Screenshot Functions**: PNG/JPEG formats, full page or element screenshots
✅ **File Uploads**: Handle file selectors, support multiple files
✅ **Dialog Handling**: accept/reject/alert/confirm/prompt
✅ **Chrome Relay**: Use `profile="chrome"` to take over existing tabs
✅ **Node Proxies**: Execute on device nodes via `target="node"`

**Quick Reference**:

| Operation | Action | Key Parameters |
|--- | --- | ---|
| Start Browser | `start` | `profile` (clawd/chrome) |
| Open Web Page | `open` | `targetUrl` |
| Get Snapshot | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| UI Operations | `act` | `request.kind`, `request.ref` |
| Screenshot | `screenshot` | `targetId`, `fullPage`, `ref` |
| File Upload | `upload` | `paths`, `ref` |
| Dialog | `dialog` | `accept`, `promptText` |

## Next Lesson

> In the next lesson, we'll learn **[Command Execution Tools and Approval](../tools-exec/)**.
>
> You'll learn:
> - Configure and use exec tools
> - Understand security approval mechanisms
> - Set up allowlist to control executable commands
> - Use sandbox to isolate risky operations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
|--- | --- | ---|
| Browser Tool Definition | [`src/agents/tools/browser-tool.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Action Type Definition | [`src/browser/client-actions-core.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| Browser Configuration Parsing | [`src/browser/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/config.ts) | 140-231 |
| Browser Constants | [`src/browser/constants.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/constants.ts) | 1-9 |
| CDP Client | [`src/browser/cdp.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Chrome Executable Detection | [`src/browser/chrome.executables.ts`](https://github.com/moltbot/moltbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**Key Constants**:
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`: Default control server address (source: `src/browser/constants.ts:2`)
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`: AI snapshot default max characters (source: `src/browser/constants.ts:6`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`: efficient mode max characters (source: `src/browser/constants.ts:7`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`: efficient mode depth (source: `src/browser/constants.ts:8`)

**Key Functions**:
- `createBrowserTool()`: Create browser tool, define all actions and parameter handling
- `browserSnapshot()`: Get page snapshot, supports AI/ARIA formats
- `browserScreenshotAction()`: Execute screenshot operation, supports full page and element screenshots
- `browserAct()`: Execute UI automation operations (click/type/drag/fill/wait/evaluate, etc.)
- `browserArmFileChooser()`: Handle file upload, trigger file selector
- `browserArmDialog()`: Handle dialogs (alert/confirm/prompt)
- `resolveBrowserConfig()`: Parse browser configuration, return control server address and port
- `resolveProfile()`: Parse profile configuration (clawd/chrome)

**Browser Actions Kind** (source: `src/agents/tools/browser-tool.schema.ts:5-17`):
- `click`: Click element
- `type`: Type text
- `press`: Press key
- `hover`: Hover
- `drag`: Drag
- `select`: Select dropdown option
- `fill`: Fill form (multiple fields)
- `resize`: Resize window
- `wait`: Wait
- `evaluate`: Execute JavaScript
- `close`: Close tab

**Browser Tool Actions** (source: `src/agents/tools/browser-tool.schema.ts:19-36`):
- `status`: Get browser status
- `start`: Start browser
- `stop`: Stop browser
- `profiles`: List all profiles
- `tabs`: List all tabs
- `open`: Open new tab
- `focus`: Focus tab
- `close`: Close tab
- `snapshot`: Get page snapshot
- `screenshot`: Take screenshot
- `navigate`: Navigate to URL
- `console`: Get console messages
- `pdf`: Save page as PDF
- `upload`: Upload files
- `dialog`: Handle dialog
- `act`: Execute UI operations

</details>
