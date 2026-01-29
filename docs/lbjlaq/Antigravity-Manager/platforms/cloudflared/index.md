---
title: "Cloudflared: One-Click Tunnel | Antigravity Manager"
sidebarTitle: "Cloudflared"
subtitle: "Cloudflared: One-Click Tunnel"
description: "Learn Antigravity Cloudflared one-click tunnel: expose local APIs securely to public internet with Quick/Auth modes."
tags:
  - "Cloudflared"
  - "Intranet Penetration"
  - "Public Access"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 999
---

# Cloudflared One-Click Tunnel: Securely Expose Local APIs to Public Internet (Not Secure by Default)

You'll use **Cloudflared one-click tunnel** to expose your local Antigravity Tools API gateway to the public internet (only when explicitly enabled), allowing remote devices to call it. You'll also understand the behavioral differences and risk boundaries between Quick and Auth modes.

## What You'll Learn

- Install and start Cloudflared tunnel with one click
- Choose Quick mode (temporary URL) or Auth mode (named tunnel)
- Copy public URLs for remote devices to access local APIs
- Understand tunnel security risks and apply minimum exposure strategy

## Your Current Challenge

You're running the Antigravity Tools API gateway locally, but only your local machine or LAN can access it. You want remote servers, mobile devices, or cloud services to call this gateway too, but you don't have a public IP and don't want to deal with complex server deployment solutions.

## When to Use This

- You don't have a public IP but need remote devices to access local APIs
- You're in testing/development phase and want to quickly expose services externally
- You don't want to purchase server deployment, just want to use existing machines

::: warning Security Warning
Exposing to public internet has risks! Make sure to:
1. Configure strong API Key (`proxy.auth_mode=strict/all_except_health`)
2. Only enable tunnel when necessary, close immediately after use
3. Regularly check Monitor logs, stop immediately if anomalies detected
:::

## 🎒 Prerequisites

::: warning Prerequisites
- You've started the local reverse proxy service (the toggle on "API Proxy" page is on)
- You've added at least one available account
:::

## What is Cloudflared?

**Cloudflared** is a tunnel client provided by Cloudflare. It establishes an encrypted channel between your machine and Cloudflare, mapping your local HTTP service to a publicly accessible URL. Antigravity Tools provides UI operations for installation, startup, stop, and URL copying, making it easy to quickly run through the verification loop.

### Supported Platforms

The project's built-in "auto-download + install" logic only covers the following OS/architecture combinations (other platforms will report `Unsupported platform`).

| Operating System | Architecture | Support Status |
| --- | --- | --- |
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### Two Modes Comparison

| Feature | Quick Mode | Auth Mode |
| --- | --- | --- |
| **URL Type** | `https://xxx.trycloudflare.com` (temporary URL extracted from logs) | App may not automatically extract URL (depends on cloudflared logs); ingress domain based on your Cloudflare configuration |
| **Requires Token** | ❌ No | ✅ Yes (obtained from Cloudflare console) |
| **Stability** | URL may change with process restart | Depends on your Cloudflare configuration (app only responsible for starting process) |
| **Use Case** | Temporary testing, quick verification | Long-term stable service, production environment |
| **Recommendation** | ⭐⭐⭐ For testing | ⭐⭐⭐⭐⭐ For production |

::: info Quick Mode URL Characteristics
Quick mode URLs may change each time you start, and are randomly generated `*.trycloudflare.com` subdomains. If you need a fixed URL, you must use Auth mode and bind a domain in the Cloudflare console.
:::

## Follow Along

### Step 1: Open API Proxy Page

**Why**
Find the Cloudflared configuration entry point.

1. Open Antigravity Tools
2. Click **"API Proxy"** in the left navigation (API reverse proxy)
3. Find the **"Public Access (Cloudflared)"** card (bottom of page, orange icon)

**You should see**: An expandable card showing "Cloudflared not installed" or "Installed: xxx".

### Step 2: Install Cloudflared

**Why**
Download and install the Cloudflared binary to the `bin` folder in the data directory.

#### If Not Installed

1. Click the **"Install"** button
2. Wait for download to complete (about 10-30 seconds depending on network speed)

**You should see**:
- Button shows loading animation
- After completion, prompts "Cloudflared installed successfully"
- Card displays "Installed: cloudflared version 202X.X.X"

#### If Already Installed

Skip this step and go directly to Step 3.

::: tip Installation Location
The Cloudflared binary will be installed under `bin/` in the "data directory" (data directory name is `.antigravity_tools`).

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

If you're not sure where the data directory is, first read **[First Run Essentials: Data Directory, Logs, Tray & Auto-Start](../../start/first-run-data/)**.
:::

### Step 3: Choose Tunnel Mode

**Why**
Choose the appropriate mode based on your use case.

1. Find the mode selection area in the card (two large buttons)
2. Click to select:

| Mode | Description | When to Choose |
| --- | --- | --- |
| **Quick Tunnel** | Automatically generates temporary URL (`*.trycloudflare.com`) | Quick testing, temporary access |
| **Named Tunnel** | Use Cloudflare account and custom domain | Production environment, fixed domain requirement |

::: tip Recommendation
If this is your first time using it, **choose Quick mode first** to quickly verify if the functionality meets your needs.
:::

### Step 4: Configure Parameters

**Why**
Fill in required parameters and options based on the mode.

#### Quick Mode

1. Port automatically uses your current Proxy port (default is `8045`, subject to actual configuration)
2. Check **"Use HTTP/2"** (checked by default)

#### Auth Mode

1. Enter **Tunnel Token** (obtained from Cloudflare console)
2. Port also uses your current Proxy port (subject to actual configuration)
3. Check **"Use HTTP/2"** (checked by default)

::: info How to Get Tunnel Token?
1. Log in to [Cloudflare Zero Trust Console](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust)
2. Go to **"Networks"** → **"Tunnels"**
3. Click **"Create a tunnel"** → **"Remote browser"** or **"Cloudflared"**
4. Copy the generated Token (long string like `eyJhIjoiNj...`)
:::

#### HTTP/2 Option Explanation

`Use HTTP/2` will start cloudflared with `--protocol http2`. The project's text describes it as "more compatible (recommended for mainland China users)" and enables it by default.

::: tip Recommendation
**The HTTP/2 option is recommended to be checked by default**, especially in domestic network environments.
:::

### Step 5: Start Tunnel

**Why**
Establish an encrypted tunnel from local to Cloudflare.

1. Click the toggle in the top-right corner of the card (or **"Start Tunnel"** button after expanding)
2. Wait for tunnel to start (about 5-10 seconds)

**You should see**:
- Green dot appears on the right side of the card title
- Shows **"Tunnel Running"**
- Displays public URL (like `https://random-name.trycloudflare.com`)
- Copy button on the right: button shows only the first 20 characters of the URL, but clicking copies the complete URL

::: warning Auth Mode May Not Show URL
The current app only extracts `*.trycloudflare.com` type URLs from cloudflared logs for display. Auth mode typically doesn't output such domain names, so you may only see "Running" but no URL. In this case, the ingress domain is based on your Cloudflare-side configuration.
:::

### Step 6: Test Public Access

**Why**
Verify that the tunnel is working properly.

#### Health Check

::: code-group

```bash [macOS/Linux]
# Replace with your actual tunnel URL
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**You should see**: `{"status":"ok"}`

#### Model List Query

::: code-group

```bash [macOS/Linux]
# If you enabled authentication, replace <proxy_api_key> with your key
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**You should see**: Returns model list JSON.

::: tip HTTPS Note
Tunnel URLs use HTTPS protocol, no additional certificate configuration needed.
:::

#### Using OpenAI SDK to Call (Example)

```python
import openai

# Use public URL
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # If authentication is enabled
    base_url="https://your-url.trycloudflare.com/v1"
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Hello"}]
)

print(response.choices[0].message.content)
```

::: warning Authentication Reminder
If you enabled authentication on the "API Proxy" page (`proxy.auth_mode=strict/all_except_health`), requests must carry API Key:
- Header: `Authorization: Bearer your-api-key`
- Or: `x-api-key: your-api-key`
:::

### Step 7: Stop Tunnel

**Why**
Close immediately after use to reduce security exposure time.

1. Click the toggle in the top-right corner of the card (or **"Stop Tunnel"** button after expanding)
2. Wait for stop to complete (about 2 seconds)

**You should see**:
- Green dot disappears
- Shows **"Tunnel Stopped"**
- Public URL disappears

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Install Cloudflared binary
- [ ] Switch between Quick and Auth modes
- [ ] Start tunnel and get public URL
- [ ] Call local API via public URL
- [ ] Stop tunnel

## Common Pitfalls

### Problem 1: Installation Failed (Download Timeout)

**Symptom**: After clicking "Install", no response for a long time or download fails.

**Cause**: Network issues (especially accessing GitHub Releases from mainland China).

**Solution**:
1. Check network connection
2. Use VPN or proxy
3. Manual download: [Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases), select the corresponding platform version, manually place in the `bin` folder of the data directory, and grant execute permissions (macOS/Linux).

### Problem 2: Failed to Start Tunnel

**Symptom**: After clicking start, URL doesn't display or shows error.

**Cause**:
- Invalid Token in Auth mode
- Local reverse proxy service not started
- Port already in use

**Solution**:
1. Auth mode: Check if Token is correct and not expired
2. Check if reverse proxy toggle on "API Proxy" page is on
3. Check if port `8045` is occupied by other programs

### Problem 3: Public URL Not Accessible

**Symptom**: curl or SDK calling public URL times out.

**Cause**:
- Tunnel process unexpectedly exited
- Cloudflare network issues
- Local firewall blocking

**Solution**:
1. Check if card shows "Tunnel Running"
2. Check if card has error prompts (red text)
3. Check local firewall settings
4. Try restarting the tunnel

### Problem 4: Authentication Failed (401)

**Symptom**: Request returns 401 error.

**Cause**: Proxy has authentication enabled, but request doesn't carry API Key.

**Solution**:
1. Check authentication mode on "API Proxy" page
2. Add correct Header in request:
    ```bash
    curl -H "Authorization: Bearer your-api-key" \
          https://your-url.trycloudflare.com/v1/models
    ```

## Lesson Summary

Cloudflared tunnel is a powerful tool for quickly exposing local services. Through this lesson, you've learned:

- **One-click installation**: Automatic download and installation of Cloudflared within UI
- **Two modes**: Choice between Quick (temporary) and Auth (named)
- **Public access**: Copy HTTPS URL, remote devices can call directly
- **Security awareness**: Enable authentication, close after use, regularly check logs

Remember: **Tunnels are a double-edged sword**—use them wisely for convenience, but be aware of risks if misused. Always follow the principle of minimum exposure.

## Coming Up Next

In the next lesson, we'll learn about **[Configuration Guide: AppConfig/ProxyConfig, Storage Location & Hot Reload Semantics](/lbjlaq/Antigravity-Manager/advanced/config/)**.

You'll learn:
- Complete fields of AppConfig and ProxyConfig
- Configuration file storage locations
- Which configurations require restart, which can be hot-reloaded

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
| --- | --- | --- |
| Cloudflared installation logic | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs) | 147-211 |
| Quick mode startup command | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs) | 238-247 |
| Auth mode startup command | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs) | 249-262 |
| Process monitoring & status update | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs) | 290-347 |
| Tauri command interface | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs) | 29-119 |
| UI configuration interface | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx) | 1598-1750 |
| Download URL generation logic | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs) | 370-388 |

**Key data structures**:
- `TunnelMode`: Tunnel mode enum (Quick/Auth)
- `CloudflaredConfig`: Configuration structure (enabled, mode, port, token, use_http2)
- `CloudflaredStatus`: Status structure (installed, version, running, url, error)

**Key functions**:
- `install()`: Download and install Cloudflared binary
- `start(config)`: Start tunnel process based on configuration
- `stop()`: Stop tunnel process
- `check_installed()`: Check if installed and version info
- `get_download_url()`: Generate download link based on platform

</details>
