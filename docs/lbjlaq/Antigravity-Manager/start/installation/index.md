---
title: "Installation: Desktop & Server Setup | Antigravity-Manager"
sidebarTitle: "Installation"
subtitle: "Installation: Desktop & Server Setup"
description: "Learn to install Antigravity Tools via Homebrew, GitHub Releases, or Docker. Handle macOS quarantine issues and upgrade smoothly across desktop and server environments."
tags:
  - "Installation"
  - "Upgrade"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 999
---

# Installation & Upgrades: Best Desktop Installation Paths (brew / releases)

If you want to quickly get Antigravity Tools up and running for the upcoming lessons, this lesson focuses on one thing: making "install + launch + know how to upgrade" crystal clear.

## What You'll Learn

- Choose the right installation path: prioritize Homebrew, then GitHub Releases
- Handle common macOS blocks (quarantine / "app damaged")
- Install in special environments: Arch scripts, Headless Xvfb, Docker
- Know the upgrade entry points and self-check methods for each installation method

## Your Current Struggles

- Too many installation methods in the docs, unsure which one to pick
- macOS downloads won't open, prompting "damaged/unable to open"
- Running on NAS/server without desktop, inconvenient for authorization

## When to Use This Approach

- First-time installation of Antigravity Tools
- Restoring environment after computer replacement or OS reinstall
- Encountering system blocks or startup issues after version upgrades

::: warning Prerequisite Knowledge
If you're not sure what problems Antigravity Tools solves, take a quick look at **[What is Antigravity Tools](/lbjlaq/Antigravity-Manager/start/getting-started/)** first, then come back for a smoother installation experience.
:::

## Core Approach

We recommend choosing in the order "desktop first, servers later":

1. Desktop (macOS/Linux): Use Homebrew (fastest, upgrades are hassle-free)
2. Desktop (all platforms): Download from GitHub Releases (suitable if you don't want brew or have network restrictions)
3. Server/NAS: Prioritize Docker; alternatively use Headless Xvfb (more like "running desktop apps on server")

## Follow Along

### Step 1: Choose Your Installation Method First

**Why**
Different installation methods have vastly different "upgrade/rollback/troubleshooting" costs. Choosing the right path early saves you detours.

**Recommendations**:

| Scenario | Recommended Installation Method |
| --- | --- |
| macOS / Linux Desktop | Homebrew (Option A) |
| Windows Desktop | GitHub Releases (Option B) |
| Arch Linux | Official Script (Arch Option) |
| Remote Server without Desktop | Docker (Option D) or Headless Xvfb (Option C-Headless) |

**What you should see**: You can clearly identify which row you belong to.

### Step 2: Install with Homebrew (macOS / Linux)

**Why**
Homebrew is the "automatic download and install" path, and upgrades are the smoothest.

```bash
# 1) Subscribe to this repository's Tap
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

# 2) Install the app
brew install --cask antigravity-tools
```

::: tip macOS Permission Prompt
The README mentions: If you encounter permission/quarantine issues on macOS, you can use:

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**What you should see**: `brew` outputs successful installation, and Antigravity Tools appears in your system.

### Step 3: Manual Installation from GitHub Releases (macOS / Windows / Linux)

**Why**
When you don't use Homebrew, or want to control your installation package source, this path is most direct.

1. Open the project Releases page: `https://github.com/lbjlaq/Antigravity-Manager/releases`
2. Choose the installation package matching your system:
   - macOS: `.dmg` (Apple Silicon / Intel)
   - Windows: `.msi` or portable `.zip`
   - Linux: `.deb` or `AppImage`
3. Complete installation following your system installer prompts

**What you should see**: After installation completes, you can find Antigravity Tools in your system app list and launch it.

### Step 4: Handling macOS "App Damaged, Cannot Open"

**Why**
The README explicitly provides a fix for this scenario; if you encounter the same prompt, just follow it directly.

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**What you should see**: When launching the app again, the "damaged/unable to open" block prompt no longer appears.

### Step 5: Upgrading (Choose Based on Your Installation Method)

**Why**
The most common pitfall during upgrades is "the installation method changed," leaving you unsure where to update.

::: code-group

```bash [Homebrew]
# Update tap information before upgrading
brew update

# Upgrade the cask
brew upgrade --cask antigravity-tools
```

```text [Releases]
Re-download the latest installation package (.dmg/.msi/.deb/AppImage) and follow system prompts to overwrite the installation.
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

# README explains that the container attempts to pull the latest release on startup; the simplest upgrade method is restarting the container
docker compose restart
```

:::

**What you should see**: After upgrade completes, the app can still launch normally; if you're using Docker/Headless, you can continue accessing the health check endpoint.

## Other Installation Methods (Specific Scenarios)

### Arch Linux: Official One-Click Installation Script

The README provides an entry point for the Arch script:

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details What does this script do?
It fetches the latest release via GitHub API, downloads the `.deb` asset to calculate SHA256, then generates PKGBUILD and installs with `makepkg -si`.
:::

### Remote Server: Headless Xvfb

If you need to run a GUI app on a headless Linux server, the project provides Xvfb deployment:

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

After installation, common self-check commands from the docs include:

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/Server: Docker (with Browser VNC)

Docker deployment provides noVNC in the browser (convenient for OAuth/authorization operations), while mapping proxy ports:

```bash
cd deploy/docker
docker compose up -d
```

You should be able to access: `http://localhost:6080/vnc_lite.html`.

## Common Pitfalls

- brew installation fails: First confirm you have Homebrew installed, then retry the `brew tap` / `brew install --cask` from README
- macOS won't open: First try `--no-quarantine`; if already installed, use `xattr` to clear quarantine
- Server deployment limitations: Headless Xvfb is essentially "running desktop apps with a virtual display," which has higher resource usage than pure backend services

## Lesson Summary

- Most recommended for desktop: Homebrew (installation and upgrades are hassle-free)
- Not using brew: Use GitHub Releases directly
- Server/NAS: Prioritize Docker; use Headless Xvfb if you need systemd management

## Next Lesson Preview

In the next lesson, we take "able to launch" one step further: understand **[data directory, logs, tray, and auto-startup](/lbjlaq/Antigravity-Manager/start/first-run-data/)**, so you know where to look when problems arise.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Topic | File Path | Lines |
| --- | --- | --- |
| Homebrew installation (tap + cask) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Releases manual download (all platform packages) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Arch one-click installation script entry | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Arch installation script implementation (GitHub API + makepkg) | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Headless Xvfb installation entry (curl \| sudo bash) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Headless Xvfb deployment/upgrade/ops commands | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh (systemd + 8045 default config) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
| Docker deployment entry (docker compose up -d) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L150-L166) | 150-166 |
| Docker deployment notes (noVNC 6080 / proxy 8045) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Docker port/data volume config (8045 + antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
| macOS "damaged, cannot open" troubleshooting (xattr / --no-quarantine) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L171-L186) | 171-186 |

</details>
