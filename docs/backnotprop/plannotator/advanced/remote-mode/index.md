---
title: "Remote Mode: Setup SSH and WSL | Plannotator"
sidebarTitle: "Remote Mode"
subtitle: "Remote Mode: Setup SSH and WSL | Plannotator"
description: "Configure Plannotator for remote environments. Set up port forwarding in SSH, devcontainer, and WSL to securely access review interfaces from your local browser."
tags:
  - "Remote Development"
  - "Devcontainer"
  - "Port Forwarding"
  - "SSH"
  - "WSL"
prerequisite:
  - "start-getting-started"
order: 4
---

# Remote/Devcontainer Mode Setup

## What You'll Learn

- Use Plannotator on a remote server connected via SSH
- Configure and access Plannotator in VS Code devcontainer
- Use Plannotator in WSL (Windows Subsystem for Linux) environments
- Set up port forwarding to access Plannotator in remote environments from your local browser

## The Problem

You're using Claude Code or OpenCode in a remote server, devcontainer, or WSL environment. When AI generates a plan or needs code review, Plannotator attempts to open a browser in the remote environment—but there's no graphical interface, or you prefer to view the review interface in your local browser.

## When to Use This

Typical scenarios requiring Remote/Devcontainer mode:

| Scenario | Description |
|--- | ---|
| **SSH Connection** | You connect to a remote development server via SSH |
| **Devcontainer** | You use devcontainer in VS Code for development |
| **WSL** | You use WSL on Windows for Linux development |
| **Cloud Environment** | Your code runs in cloud containers or virtual machines |

## Core Concepts

Using Plannotator in remote environments requires solving two problems:

1. **Fixed Port**: Remote environments cannot automatically select random ports, as port forwarding configuration is required
2. **Browser Access**: Remote environments lack graphical interfaces, requiring access via a local machine's browser

Plannotator automatically enters "remote mode" when it detects the `PLANNOTATOR_REMOTE` environment variable:
- Uses a fixed port (default 19432) instead of random ports
- Skips automatically opening the browser
- Outputs the URL in the terminal for manual access in your local browser

## 🎒 Prerequisites

::: warning Prerequisites

Before starting this tutorial, ensure:
- You've completed [Quick Start](../start/getting-started/)
- You've installed and configured the [Claude Code plugin](../start/installation-claude-code/) or [OpenCode plugin](../start/installation-opencode/)
- You understand basic SSH or devcontainer configuration concepts

:::

---

## Follow Along

### Step 1: Understanding Remote Mode Environment Variables

Plannotator remote mode relies on three environment variables:

| Environment Variable | Description | Default Value |
|--- | --- | ---|
| `PLANNOTATOR_REMOTE` | Enable remote mode | Not set (local mode) |
| `PLANNOTATOR_PORT` | Fixed port number | Random (local) / 19432 (remote) |
| `PLANNOTATOR_BROWSER` | Custom browser path | System default browser |

**Why**
- `PLANNOTATOR_REMOTE` tells Plannotator it's in a remote environment and should not attempt to open a browser
- `PLANNOTATOR_PORT` sets a fixed port for easy port forwarding configuration
- `PLANNOTATOR_BROWSER` (optional) specifies the browser path to use on your local machine

---

### Step 2: Configuring on SSH Remote Server

#### Configure SSH Port Forwarding

Edit your SSH configuration file `~/.ssh/config`:

```bash
Host your-server
    HostName your-server.com
    User your-username
    LocalForward 9999 localhost:9999
```

**What You Should See**:
- Added the line `LocalForward 9999 localhost:9999`
- This forwards traffic from local port 9999 to port 9999 on the remote server

#### Set Environment Variables on Remote Server

After connecting to the remote server, set environment variables in the terminal:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

**Why**
- `PLANNOTATOR_REMOTE=1` enables remote mode
- `PLANNOTATOR_PORT=9999` uses fixed port 9999 (matching the port number in SSH configuration)

::: tip Persistent Configuration
If manually setting environment variables each time you connect is tedious, you can add these to your shell configuration file (`~/.bashrc` or `~/.zshrc`):

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Using Plannotator

Now you can use Claude Code or OpenCode normally on the remote server. When AI generates a plan or needs code review:

```bash
# On remote server, terminal will output similar information:
[Plannotator] Server running at http://localhost:9999
[Plannotator] Access from your local machine: http://localhost:9999
```

**What You Should See**:
- Terminal displays Plannotator's URL
- Remote environment doesn't open a browser (expected behavior)

#### Accessing in Local Browser

Open in your local machine's browser:

```
http://localhost:9999
```

**What You Should See**:
- Plannotator's review interface displays normally
- You can perform plan review or code review just like in a local environment

**Checkpoint ✅**:
- [ ] SSH port forwarding configured
- [ ] Environment variables set
- [ ] Remote server terminal outputs URL
- [ ] Local browser can access review interface

---

### Step 3: Configuring in VS Code Devcontainer

#### Configure devcontainer

Edit your `.devcontainer/devcontainer.json` file:

```json
{
  "name": "Your Devcontainer",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",

  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },

  "forwardPorts": [9999]
}
```

**Why**
- `containerEnv` sets environment variables inside the container
- `forwardPorts` tells VS Code to automatically forward container ports to local

#### Rebuild and Start devcontainer

1. Open VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Enter `Dev Containers: Rebuild Container` and execute
3. Wait for container rebuild to complete

**What You Should See**:
- VS Code shows port forwarding status in the bottom right (usually a small icon)
- Clicking it shows "Port 9999" has been forwarded

#### Using Plannotator

Use Claude Code or OpenCode normally in devcontainer. When AI generates a plan:

```bash
# Container terminal output:
[Plannotator] Server running at http://localhost:9999
```

**What You Should See**:
- Terminal displays Plannotator's URL
- Container doesn't open a browser (expected behavior)

#### Accessing in Local Browser

Open in your local machine's browser:

```
http://localhost:9999
```

**What You Should See**:
- Plannotator's review interface displays normally

**Checkpoint ✅**:
- [ ] devcontainer configuration includes environment variables and port forwarding
- [ ] Container rebuilt
- [ ] VS Code shows port forwarded
- [ ] Local browser can access review interface

---

### Step 4: Configuring in WSL Environment

WSL environment configuration is similar to SSH connection, but doesn't require manual port forwarding setup—WSL automatically forwards localhost traffic to the Windows system.

#### Set Environment Variables

Set environment variables in WSL terminal:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

::: tip Persistent Configuration
Add these environment variables to your WSL shell configuration file (`~/.bashrc` or `~/.zshrc`):

```bash
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
echo 'export PLANNOTATOR_PORT=9999' >> ~/.bashrc
source ~/.bashrc
```
:::

#### Using Plannotator

Use Claude Code or OpenCode normally in WSL:

```bash
# WSL terminal output:
[Plannotator] Server running at http://localhost:9999
```

**What You Should See**:
- Terminal displays Plannotator's URL
- WSL doesn't open a browser (expected behavior)

#### Accessing in Windows Browser

Open in Windows browser:

```
http://localhost:9999
```

**What You Should See**:
- Plannotator's review interface displays normally

**Checkpoint ✅**:
- [ ] Environment variables set
- [ ] WSL terminal outputs URL
- [ ] Windows browser can access review interface

---

## Common Pitfalls

### Port Already in Use

If you see an error like:

```
Error: bind: EADDRINUSE: address already in use :::9999
```

**Solution**:
1. Change port number:
   ```bash
   export PLANNOTATOR_PORT=10000  # Use an unoccupied port
   ```
2. Or stop the process occupying port 9999:
   ```bash
   lsof -ti:9999 | xargs kill -9
   ```

### SSH Port Forwarding Not Working

If local browser cannot access Plannotator:

**Checklist**:
- [ ] `LocalForward` port number in SSH config matches `PLANNOTATOR_PORT`
- [ ] Disconnected and reconnected SSH
- [ ] Firewall isn't blocking port forwarding

### Devcontainer Port Forwarding Not Working

If VS Code doesn't automatically forward port:

**Solution**:
1. Check `forwardPorts` configuration in `.devcontainer/devcontainer.json`
2. Manually forward port:
   - Open VS Code Command Palette
   - Execute `Forward a Port`
   - Enter port number `9999`

### Cannot Access in WSL

If Windows browser cannot access Plannotator in WSL:

**Solution**:
1. Check if environment variables are set correctly
2. Try using `0.0.0.0` instead of `localhost` (depends on WSL version and network configuration)
3. Check Windows firewall settings

---

## Summary

Core points of Remote/Devcontainer mode:

| Point | Description |
|--- | ---|
| **Environment Variables** | `PLANNOTATOR_REMOTE=1` enables remote mode |
| **Fixed Port** | Use `PLANNOTATOR_PORT` to set fixed port (default 19432) |
| **Port Forwarding** | SSH/Devcontainer require port forwarding configuration, WSL forwards automatically |
| **Manual Access** | Remote mode doesn't automatically open browser; manual access in local browser required |
| **Persistence** | Add environment variables to configuration files to avoid repeated setup |

---

## Next Up

> In the next lesson, we'll learn **[Environment Variables Configuration](../environment-variables/)**.
>
> You'll learn:
> - All available Plannotator environment variables
> - The purpose and default values of each environment variable
> - How to combine environment variables for different scenarios

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Number |
|--- | --- | ---|
| Remote session detection | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L16-L29) | 16-29 |
| Server port retrieval | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts#L34-L49) | 34-49 |
| Server startup logic | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L97) | 91-97 |
| Browser open logic | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| WSL detection | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L11-L34) | 11-34 |

**Key Constants**:
- `DEFAULT_REMOTE_PORT = 19432`: Default port number for remote mode

**Key Functions**:
- `isRemoteSession()`: Detect if running in a remote session
- `getServerPort()`: Get server port (fixed for remote, random for local)
- `openBrowser(url)`: Open browser cross-platform

</details>
