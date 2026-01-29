---
title: "Server Deployment: Docker vs Xvfb | Antigravity-Manager"
sidebarTitle: "Deployment"
subtitle: "Server Deployment: Docker vs Xvfb"
description: "Learn Antigravity-Manager server deployment methods. Compare Docker noVNC and Headless Xvfb approaches, complete installation, upgrade, and account sync with scripts, configure data persistence and backup, and establish health checks and troubleshooting workflows."
tags:
  - "deployment"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "backup"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 999
---

# Server Deployment: Docker noVNC vs Headless Xvfb (Selection & Operations)

You want to deploy Antigravity Tools on a NAS/server to run it as a long-term local API gateway: always online, health-checkable, upgradeable, backup-capable, and troubleshootable when issues arise—not just to "remotely open the GUI and take a look."

This lesson only covers two battle-tested approaches provided by the project: Docker (with noVNC) and Headless Xvfb (systemd-managed). All commands and default values follow the deployment files in the repository.

::: tip If you just want to "get it running once"
The installation lesson already covers Docker and Headless Xvfb entry commands. You can start with **[Getting Started: Installation & Upgrades](/lbjlaq/Antigravity-Manager/start/installation/)**, then come back here to complete the "operations loop."
:::

## What You'll Learn

- Choose the right deployment pattern: understand what Docker noVNC and Headless Xvfb each solve
- Run through a complete loop: deployment → sync account data → health check `/healthz` → view logs → backup
- Make upgrades controllable: understand the difference between Docker's "auto-update on start" and Xvfb's `upgrade.sh`

## Your Current Struggles

- Your server has no desktop, but you can't do without OAuth/authorization operations that "require a browser"
- Running it once isn't enough—you want: automatic recovery after power loss, health check capability, and backup
- You're worried about exposing port 8045 to security risks but don't know where to start hardening

## When to Use This

- NAS/home servers: want to open GUI in a browser to complete authorization (Docker/noVNC is hassle-free)
- Long-running servers: prefer systemd process management, log persistence, and scripted upgrades (Headless Xvfb feels more like "operations on a project")

## What is "Server Deployment" Mode?

**Server deployment** means: instead of running Antigravity Tools on your local desktop, you run it on a machine that's always online, and expose the reverse proxy port (default 8045) as your external service entry. Its core isn't "remote GUI viewing"—it's establishing a stable operations loop: data persistence, health checks, logging, upgrades, and backups.

## Core Approach

1. First choose "the capability you lack most": if you lack browser authorization, pick Docker/noVNC; if you lack operational control, pick Headless Xvfb.
2. Then "lock down your data": accounts and configuration live in `.antigravity_tools/`—either use Docker volumes or fix it to `/opt/antigravity/.antigravity_tools/`.
3. Finally "build an operable loop": use `/healthz` for health checks, check logs first when troubleshooting, then decide whether to restart or upgrade.

::: warning Prerequisite: Set your security baseline first
If you're going to expose 8045 to your LAN or the public, first review **[Security & Privacy: auth_mode, allow_lan_access, and the 'Don't Leak Account Info' Design](/lbjlaq/Antigravity-Manager/advanced/security/)**.
:::

## Quick Selection Guide: Docker vs Headless Xvfb

| What matters most | Recommended choice | Why |
|--- | --- | ---|
| Need browser for OAuth/authorization | Docker (noVNC) | Container comes with Firefox ESR built-in, operate directly in browser (see `deploy/docker/README.md`) |
| Want systemd management/log persistence | Headless Xvfb | install script installs systemd service and appends logs to `logs/app.log` (see `deploy/headless-xvfb/install.sh`) |
| Want isolation and resource limits | Docker | Compose approach natively isolates and makes resource limits easier to configure (see `deploy/docker/README.md`) |

## Follow Along

### Step 1: First confirm where your "data directory" is

**Why**
Deployment succeeds but "no accounts/configuration" essentially means the data directory wasn't brought over or persisted.

- Docker approach mounts data to `/home/antigravity/.antigravity_tools` inside the container (compose volume)
- Headless Xvfb approach puts data in `/opt/antigravity/.antigravity_tools` (and fixes write location via `HOME=$(pwd)`)

**What you should see**
- Docker: `docker volume ls` shows `antigravity_data`
- Xvfb: `/opt/antigravity/.antigravity_tools/` exists and contains `accounts/` and `gui_config.json`

### Step 2: Get Docker/noVNC running (for scenarios requiring browser authorization)

**Why**
The Docker approach packages "virtual display + window manager + noVNC + application + browser" into a container, saving you from installing a bunch of graphical dependencies on your server.

Execute on your server:

```bash
cd deploy/docker
docker compose up -d
```

Open noVNC:

```text
http://<server-ip>:6080/vnc_lite.html
```

**What you should see**
- `docker compose ps` shows the container running
- Browser can open the noVNC page

::: tip About noVNC ports (recommended to keep default)
`deploy/docker/README.md` mentions using `NOVNC_PORT` to customize the port, but in the current implementation `start.sh` launches `websockify` listening on the hardcoded port 6080. To change the port, you need to adjust both the docker-compose port mapping and the `start.sh` listen port.

To avoid configuration inconsistency, recommend using the default 6080 directly.
:::

### Step 3: Docker persistence, health checks, and backup

**Why**
Container availability depends on two things: process health (is it still running) and data persistence (accounts survive restarts).

1) Confirm persistence volume is mounted:

```bash
cd deploy/docker
docker compose ps
```

2) Backup volume (project README provides tar backup method):

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) Container health check (Dockerfile has HEALTHCHECK):

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**What you should see**
- `.State.Health.Status` is `healthy`
- Current directory generates `antigravity-backup.tar.gz`

### Step 4: One-click install Headless Xvfb (for scenarios wanting systemd operations)

**Why**
Headless Xvfb isn't "pure backend mode"—it runs GUI programs on the server using a virtual display—but it trades that for a more familiar operations style: systemd, fixed directories, log persistence.

Execute on your server (one-click script provided by the project):

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**What you should see**
- Directory `/opt/antigravity/` exists
- `systemctl status antigravity` shows service running

::: tip More stable approach: review script first
`curl -O .../install.sh` to download, read it first, then `sudo bash install.sh`.
:::

### Step 5: Sync local accounts to server (required for Xvfb approach)

**Why**
Xvfb installation just gets the program running. To make the reverse proxy actually usable, you need to sync your existing accounts/configuration from your local machine to the server's data directory.

The project provides `sync.sh`, which automatically searches your data directory on your machine by priority (like `~/.antigravity_tools`, `~/Library/Application Support/Antigravity Tools`), then rsyncs to the server:

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**What you should see**
- Terminal output similar to: `Syncing: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- Remote service attempts restart (script calls `systemctl restart antigravity`)

### Step 6: Health checks and troubleshooting (both approaches)

**Why**
The first thing after deployment isn't "connect a client"—it's establishing an entry point for quickly judging health status.

1) Health check (reverse proxy service provides `/healthz`):

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) View logs:

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**What you should see**
- `/healthz` returns 200 (actual response body depends on implementation)
- Logs show reverse proxy service startup information

### Step 7: Upgrade strategy (don't treat "auto-update" as the only solution)

**Why**
Upgrades are the most likely action to "upgrade your system to unusable." You need to know exactly what each approach's upgrade does.

- Docker: on container startup, attempts to pull latest `.deb` via GitHub API and install (if rate-limited or network error, continues using cached version).
- Headless Xvfb: uses `upgrade.sh` to pull latest AppImage, and rolls back to backup if restart fails.

Headless Xvfb upgrade command (from project README):

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**What you should see**
- Output similar to: `Upgrading: v<current> -> v<latest>`
- Service remains active after upgrade (script calls `systemctl restart antigravity` and checks status)

## Pitfall Warnings

| Scenario | Common Error (❌) | Recommended Practice (✓) |
|--- | --- | ---|
| Lost accounts/config | ❌ Only care about "getting program running" | ✓ First confirm `.antigravity_tools/` is persisted (volume or `/opt/antigravity`) |
| noVNC port change doesn't take effect | ❌ Only change `NOVNC_PORT` | ✓ Keep default 6080; to change, also verify `websockify` port in `start.sh` |
| Exposing 8045 to public | ❌ Don't set `api_key`/don't review auth_mode | ✓ First follow **[Security & Privacy](/lbjlaq/Antigravity-Manager/advanced/security/)** for baseline, then consider tunnel/reverse proxy |

## Lesson Summary

- Docker/noVNC solves the "server has no browser/desktop but needs authorization" problem, suitable for NAS scenarios
- Headless Xvfb feels more like standard operations: fixed directories, systemd management, scripted upgrades/rollbacks
- Whatever approach, get the loop right first: data → health check → logs → backup → upgrade

## Recommended Next Steps

- You want to expose service to LAN/public: **[Security & Privacy: auth_mode, allow_lan_access](/lbjlaq/Antigravity-Manager/advanced/security/)**
- Encountered 401 after deployment: **[401/Auth Failure: auth_mode, Header Compatibility, and Client Configuration Checklist](/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- You want to expose service via tunnel: **[Cloudflared One-Click Tunnel](/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Docker deployment entry and noVNC URL | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Docker deployment environment variable description (VNC_PASSWORD/RESOLUTION/NOVNC_PORT) | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Docker compose port mapping and data volume (antigravity_data) | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
|--- | --- | ---|
| Docker startup script: launch Xtigervnc/Openbox/noVNC/application | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Docker health check: confirm Xtigervnc/websockify/antigravity_tools processes exist | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb: directory structure and operations commands (systemctl/healthz) | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb: install.sh installs dependencies and initializes gui_config.json (default 8045) | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb: sync.sh automatically discovers local data directory and rsyncs to server | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb: upgrade.sh downloads new version and rolls back on failure | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| Reverse proxy service health check endpoint `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>
