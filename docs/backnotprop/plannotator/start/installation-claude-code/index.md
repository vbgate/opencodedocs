---
title: "安装: Claude Code 插件 | Plannotator"
sidebarTitle: "Claude Code 安装"
subtitle: "安装 Claude Code 插件"
description: "学习 Plannotator 的安装方法。快速配置 CLI 和 Claude Code 插件，支持插件和手动 Hook 方式，涵盖远程环境设置。"
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "getting-started"
order: 2
---

# Install Claude Code Plugin

## What You'll Learn

- Enable Plannotator plan review functionality in Claude Code
- Choose the installation method that works for you (plugin system or manual Hook)
- Verify that installation was successful
- Properly configure Plannotator for remote/Devcontainer environments

## Your Current Struggle

When using Claude Code, AI-generated plans can only be read in the terminal, making it difficult to provide precise review and feedback. You want to:

- Visually review AI plans in your browser
- Add precise annotations (delete, replace, insert) to plans
- Give AI clear modification instructions all at once

## When to Use This

Perfect for these scenarios:

- First-time setup of Claude Code + Plannotator
- Reinstalling or upgrading Plannotator
- Using in remote environments (SSH, Devcontainer, WSL)

## Core Concept

Plannotator installation consists of two parts:

1. **Install CLI command**: The core runtime that starts the local server and browser
2. **Configure Claude Code**: Use plugin system or manual Hook to automatically trigger Plannotator when Claude Code completes a plan

After installation, when Claude Code calls `ExitPlanMode`, it will automatically trigger Plannotator and open the plan review interface in your browser.

## 🎒 Prerequisites

::: warning Prerequisite Check

- [ ] Claude Code 2.1.7 or higher installed (must support Permission Request Hooks)
- [ ] Permission to execute commands in terminal (Linux/macOS requires sudo or installation to home directory)

:::

## Follow Along

### Step 1: Install Plannotator CLI

First, install the Plannotator command-line tool.

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**You should see**: Terminal displays installation progress, then shows `plannotator {version} installed to {path}/plannotator`

**Checkpoint ✅**: Run the following command to verify installation:

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

You should see the installation path of Plannotator, such as `/usr/local/bin/plannotator` or `$HOME/.local/bin/plannotator`.

### Step 2: Install Plugin in Claude Code

Open Claude Code and run the following commands:

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**You should see**: Plugin installation success message.

::: danger Important: Must Restart Claude Code

After installing the plugin, **you must restart Claude Code**, otherwise the Hooks will not take effect.

:::

### Step 3: Verify Installation

After restarting, run the following command in Claude Code to test the code review functionality:

```bash
/plannotator-review
```

**You should see**:

- Browser automatically opens Plannotator's code review interface
- Terminal displays "Opening code review..." and waits for your review feedback

If you see the above output, congratulations—installation was successful!

::: tip Note
Plan review functionality will automatically trigger when Claude Code calls `ExitPlanMode`, so you don't need to manually run the test command. You can test this feature when using plan mode in practice.
:::

### Step 4: (Optional) Manual Hook Installation

If you don't want to use the plugin system, or need to use it in a CI/CD environment, you can manually configure the Hook.

Edit the `~/.claude/settings.json` file (create it if it doesn't exist) and add the following:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**Field explanations**:

- `matcher: "ExitPlanMode"` - Triggers when Claude Code calls ExitPlanMode
- `command: "plannotator"` - Executes the installed Plannotator CLI command
- `timeout: 1800` - Timeout (30 minutes), giving you sufficient time to review the plan

**Checkpoint ✅**: After saving the file, restart Claude Code, then run `/plannotator-review` to test.

### Step 5: (Optional) Remote/Devcontainer Configuration

If you're using Claude Code in a remote environment such as SSH, Devcontainer, or WSL, you need to set environment variables to use a fixed port and disable automatic browser opening.

Run this in the remote environment:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # Choose a port you will access via port forwarding
```

**These variables will**:

- Use a fixed port (instead of random port) for easy port forwarding setup
- Skip automatic browser opening (because browser is on your local machine)
- Print URL in terminal, which you can copy to your local browser

::: tip Port Forwarding

**VS Code Devcontainer**: Ports are usually automatically forwarded—check the "Ports" tab in VS Code to confirm.

**SSH Port Forwarding**: Edit `~/.ssh/config`, add:

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## Common Pitfalls

### Issue 1: `/plannotator-review` command doesn't respond after installation

**Cause**: Forgot to restart Claude Code, Hooks not effective.

**Solution**: Completely exit Claude Code and reopen.

### Issue 2: Installation script execution fails

**Cause**: Network issues or insufficient permissions.

**Solution**:

- Check network connection, ensure `https://plannotator.ai` is accessible
- If encountering permission issues, try manually downloading the installation script and executing it

### Issue 3: Browser cannot open in remote environment

**Cause**: Remote environment has no GUI, browser cannot start.

**Solution**: Set `PLANNOTATOR_REMOTE=1` environment variable and configure port forwarding.

### Issue 4: Port already in use

**Cause**: Fixed port `9999` is already occupied by another program.

**Solution**: Choose another available port, such as `8888` or `19432`.

## Summary

- ✅ Installed Plannotator CLI command
- ✅ Configured Claude Code via plugin system or manual Hook
- ✅ Verified installation success
- ✅ (Optional) Configured remote/Devcontainer environment

## Next Steps

> Next, we'll learn **[Install OpenCode Plugin](../installation-opencode/)**.
>
> If you're using OpenCode instead of Claude Code, the next lesson will teach you how to complete similar configuration in OpenCode.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Feature           | File Path                                                                                              | Lines   |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| Installation script entry | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60)                     | 35-60   |
| Hook configuration docs  | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39)   | 30-39   |
| Manual Hook example     | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62)   | 42-62   |
| Environment variable config | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79)   | 73-79   |
| Remote mode config      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94)   | 81-94   |

**Key constants**:
- `PLANNOTATOR_REMOTE = "1"`: Enable remote mode, use fixed port
- `PLANNOTATOR_PORT = 9999`: Fixed port for remote mode (default 19432)
- `timeout: 1800`: Hook timeout (30 minutes)

**Key environment variables**:
- `PLANNOTATOR_REMOTE`: Remote mode flag
- `PLANNOTATOR_PORT`: Fixed port number
- `PLANNOTATOR_BROWSER`: Custom browser path

</details>
