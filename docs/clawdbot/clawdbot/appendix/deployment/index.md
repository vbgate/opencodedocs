---
title: "Clawdbot Deployment Guide: Local, Docker, Nix, Fly.io, Hetzner VPS, and exe.dev | Clawdbot Tutorial"
sidebarTitle: "Deployment Options"
subtitle: "Deployment Options"
description: "Learn how to deploy Clawdbot on different platforms: local installation, Docker containerization, Nix declarative configuration, Fly.io cloud deployment, Hetzner VPS hosting, and exe.dev virtual hosting. Understand features, use cases, configuration steps, and security best practices for each deployment method."
tags:
  - "deployment"
  - "installation"
  - "Docker"
  - "Nix"
  - "cloud deployment"
prerequisite:
  - "start-getting-started"
order: 360
---

# Deployment Options

## What You'll Learn

After completing this lesson, you will be able to:

- Choose the most suitable deployment method based on your needs (local, Docker, Nix, cloud services)
- Install and run Clawdbot in your local environment
- Deploy Gateway using Docker containerization
- Manage Clawdbot declaratively with Nix
- Deploy Gateway to Fly.io, Hetzner VPS, or exe.dev
- Configure remote access and security best practices

## Your Current Challenge

You want to use Clawdbot but are unsure which deployment method to choose:

- Local installation is simplest, but you can't use it when your machine is off
- You want to run it in the cloud 24/7, but don't know which cloud service is suitable
- You're afraid of configuration errors and want the most reliable deployment solution
- You need to access the same Gateway from multiple devices, but don't know how to implement it

## When to Use This

| Deployment Method | Use Case |
|--- | ---|
| **Local Installation** | Personal computer, development and testing, quick start |
| **Docker** | Isolated environment, server deployment, quick rebuild |
| **Nix** | Reproducible deployment, already using NixOS/Home Manager, need version rollback |
| **Fly.io** | Cloud 24/7 runtime, automatic HTTPS, simplified operations |
| **Hetzner VPS** | Own VPS, full control, low-cost 24/7 |
| **exe.dev** | Cheap Linux host, no need to configure VPS yourself |

## 🎒 Prerequisites

Before you begin, please confirm:

::: warning Environment Requirements
- Node.js ≥ 22 (required for local installation)
- Docker Desktop + Docker Compose v2 (required for Docker deployment)
- Nix flakes + Home Manager (required for Nix deployment)
- SSH client (required for cloud deployment access)
- Basic terminal operation skills (copy, paste, execute commands)
:::

::: tip Recommended Tools
 - If this is your first time with Clawdbot, start with [Quick Start](../../start/getting-started/)
 - Using an AI assistant (like Claude, Cursor) can accelerate the configuration process
 - Keep your API keys (Anthropic, OpenAI, etc.) and channel credentials safe
:::

## Deployment Method Comparison

### Local Installation

**Best For**: Personal computer, development and testing, quick start

**Pros**:
- ✅ Simplest and most direct, no additional infrastructure needed
- ✅ Fast startup, convenient debugging
- ✅ Configuration changes take effect immediately

**Cons**:
- ❌ Cannot be used when your machine is off
- ❌ Not suitable for 24/7 services
- ❌ Multi-device synchronization requires additional configuration

### Docker Deployment

**Best For**: Server deployment, isolated environment, CI/CD

**Pros**:
- ✅ Environment isolation, easy to clean up and rebuild
- ✅ Cross-platform unified deployment
- ✅ Supports sandbox-isolated tool execution
- ✅ Configuration can be version controlled

**Cons**:
- ❌ Requires Docker knowledge
- ❌ Initial setup is slightly more complex

### Nix Deployment

**Best For**: NixOS users, Home Manager users, need reproducible deployment

**Pros**:
- ✅ Declarative configuration, reproducible
- ✅ Quick rollback (`home-manager switch --rollback`)
- ✅ All component versions are pinned
- ✅ Gateway + macOS app + tools all managed together

**Cons**:
- ❌ Steeper learning curve
- ❌ Requires familiarity with the Nix ecosystem

### Cloud Deployment (Fly.io / Hetzner / exe.dev)

**Best For**: 24/7 online, remote access, team collaboration

**Pros**:
- ✅ 24/7 online, doesn't depend on local machine
- ✅ Automatic HTTPS, no manual certificate needed
- ✅ Can scale quickly
- ✅ Supports multi-device remote access

**Cons**:
- ❌ Requires paying for cloud services
- ❌ Requires basic operations knowledge
- ❌ Data stored on third-party servers

---

## Local Installation

### npm/pnpm/bun Global Installation (Recommended)

Installing from the official npm registry is simplest:

::: code-group

```bash [npm]
# Install using npm
npm install -g clawdbot@latest
```

```bash [pnpm]
# Install using pnpm (recommended)
pnpm add -g clawdbot@latest
```

```bash [bun]
# Install using bun (fastest)
bun add -g clawdbot@latest
```

:::

After installation, run the wizard:

```bash
clawdbot onboard --install-daemon
```

This command will:
- Guide you through Gateway, channel, and model configuration
- Install Gateway daemon (macOS launchd / Linux systemd)
- Set up default configuration file `~/.clawdbot/clawdbot.json`

### Building from Source

If you need to build from source (development, customization):

::: code-group

```bash [macOS/Linux]
# Clone repository
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Install dependencies and build
pnpm install
pnpm ui:build
pnpm build

# Install and run
pnpm clawdbot onboard --install-daemon
```

```bash [Windows (WSL2)]
# Build in WSL2 (recommended)
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

wsl.exe -d Ubuntu bash -c "pnpm install && pnpm ui:build && pnpm build"
```

:::

::: info Development Loop
Run `pnpm gateway:watch` to automatically reload Gateway when code changes.
:::

---

## Docker Deployment

### Quick Start (Recommended)

Use the provided script for one-click deployment:

```bash
./docker-setup.sh
```

This script will:
- Build Gateway image
- Run onboarding wizard
- Print provider configuration prompts
- Start Gateway via Docker Compose
- Generate Gateway token and write to `.env`

After completion:
1. Open `http://127.0.0.1:18789/` in your browser
2. Paste the token in Control UI settings

The script will create on your host:
- `~/.clawdbot/` (configuration directory)
- `~/clawd` (workspace directory)

### Manual Process

If you need to customize Docker Compose configuration:

```bash
# Build image
docker build -t clawdbot:local -f Dockerfile .

# Run CLI container to complete configuration
docker compose run --rm clawdbot-cli onboard

# Start Gateway
docker compose up -d clawdbot-gateway
```

### Additional Mounts (Optional)

If you want to mount additional host directories in the container, set environment variables before running `docker-setup.sh`:

```bash
export CLAWDBOT_EXTRA_MOUNTS="$HOME/.codex:/home/node/.codex:ro,$HOME/github:/home/node/github:rw"
./docker-setup.sh
```

**Important**:
- Paths must be shared with Docker Desktop (macOS/Windows)
- If you modify `CLAWDBOT_EXTRA_MOUNTS`, you need to run `docker-setup.sh` again to regenerate the compose file

### Persistent Container Home Directory (Optional)

If you want `/home/node` to persist across container rebuilds:

```bash
export CLAWDBOT_HOME_VOLUME="clawdbot_home"
./docker-setup.sh
```

**Important**:
- Named volumes persist until deleted with `docker volume rm`
- Can be combined with `CLAWDBOT_EXTRA_MOUNTS`

### Installing Additional System Packages (Optional)

If you need to install additional system packages in the image (e.g., build tools, media libraries):

```bash
export CLAWDBOT_DOCKER_APT_PACKAGES="ffmpeg build-essential"
./docker-setup.sh
```

### Channel Configuration (Optional)

Configure channels using the CLI container:

::: code-group

```bash [WhatsApp]
# Login to WhatsApp (will display QR code)
docker compose run --rm clawdbot-cli channels login
```

```bash [Telegram]
# Add Telegram bot
docker compose run --rm clawdbot-cli channels add --channel telegram --token "<token>"
```

```bash [Discord]
# Add Discord bot
docker compose run --rm clawdbot-cli channels add --channel discord --token "<token>"
```

:::

### Health Check

```bash
docker compose exec clawdbot-gateway node dist/index.js health --token "$CLAWDBOT_GATEWAY_TOKEN"
```

### Agent Sandbox (Host Gateway + Docker Tools)

Docker can also be used to sandbox-isolate tool execution for non-main sessions. See: [Sandboxing](https://docs.clawd.bot/gateway/sandboxing)

---

## Nix Installation

**Recommended Method**: Use [nix-clawdbot](https://github.com/clawdbot/nix-clawdbot) Home Manager module

### Quick Start

Paste this into your AI assistant (Claude, Cursor, etc.):

```text
I want to set up nix-clawdbot on my Mac.
Repository: github:clawdbot/nix-clawdbot

What I need you to do:
1. Check if Determinate Nix is installed (if not, install it)
2. Create a local flake at ~/code/clawdbot-local using templates/agent-first/flake.nix
3. Help me create a Telegram bot (@BotFather) and get my chat ID (@userinfobot)
4. Set up secrets (bot token, Anthropic key) - plain files at ~/.secrets/ is fine
5. Fill in the template placeholders and run home-manager switch
6. Verify: launchd running, bot responds to messages

Reference nix-clawdbot README for module options.
```

> **📦 Complete Guide**: [github.com/clawdbot/nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Nix Mode Runtime Behavior

When `CLAWDBOT_NIX_MODE=1` is set (automatically set by nix-clawdbot):

- Configuration becomes deterministic, disables automatic installation flow
- If dependencies are missing, displays Nix-specific fix information
- UI surface shows read-only Nix mode banner

On macOS, GUI apps don't automatically inherit shell environment variables. You can also enable Nix mode via defaults:

```bash
defaults write com.clawdbot.mac clawdbot.nixMode -bool true
```

### Configuration and State Paths

In Nix mode, explicitly set these environment variables:

- `CLAWDBOT_STATE_DIR` (default: `~/.clawdbot`)
- `CLAWDBOT_CONFIG_PATH` (default: `$CLAWDBOT_STATE_DIR/clawdbot.json`)

This ensures runtime state and configuration remain outside the Nix-managed immutable store.

---

## Fly.io Cloud Deployment

**Best For**: Need cloud 24/7 runtime, simplified operations, automatic HTTPS

### What You Need

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
- Fly.io account (free tier available)
- Model authentication: Anthropic API Key (or other provider keys)
- Channel credentials: Discord bot token, Telegram token, etc.

### Step 1: Create Fly App

```bash
# Clone repository
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# Create new Fly app (choose your own name)
fly apps create my-clawdbot

# Create persistent volume (1GB is usually sufficient)
fly volumes create clawdbot_data --size 1 --region iad
```

::: tip Region Selection
Choose the region closest to you. Common options:
- `lhr` (London)
- `iad` (Virginia)
- `sjc` (San Jose)
:::

### Step 2: Configure fly.toml

Edit `fly.toml` to match your app name and requirements.

::: warning Security Note
Default configuration exposes a public URL. For hardened deployment without a public IP, see [Private Deployment](#private-deployment-hardened), or use `fly.private.toml`.
:::

```toml
app = "my-clawdbot"  # Your app name
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  CLAWDBOT_PREFER_PNPM = "1"
  CLAWDBOT_STATE_DIR = "/data"
  NODE_OPTIONS = "--max-old-space-size=1536"

[processes]
  app = "node dist/index.js gateway --allow-unconfigured --port 3000 --bind lan"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  size = "shared-cpu-2x"
  memory = "2048mb"

[mounts]
  source = "clawdbot_data"
  destination = "/data"
```

**Key Settings Explanation**:

| Setting | Reason |
|--- | ---|
| `--bind lan` | Bind to `0.0.0.0` so Fly's proxy can access Gateway |
| `--allow-unconfigured` | Start without a configuration file (you'll create one later) |
| `internal_port = 3000` | Must match `--port 3000` (or `CLAWDBOT_GATEWAY_PORT`) for Fly health checks |
| `memory = "2048mb"` | 512MB is too small; recommend 2GB |
| `CLAWDBOT_STATE_DIR = "/data"` | Persist state on the volume |

### Step 3: Set Secrets

```bash
# Required: Gateway token (for non-loopback binding)
fly secrets set CLAWDBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)

# Model provider API keys
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# Channel tokens
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

::: tip Security Recommendation
Non-loopback binding (`--bind lan`) requires `CLAWDBOT_GATEWAY_TOKEN` for security. Treat these tokens like passwords. For all API keys and tokens, prefer environment variables over configuration files to prevent credential exposure in `clawdbot.json`.
:::

### Step 4: Deploy

```bash
fly deploy
```

First deployment builds the Docker image (about 2-3 minutes). Subsequent deployments are faster.

After deployment, verify:

```bash
fly status
fly logs
```

You should see:

```
[gateway] listening on ws://0.0.0.0:3000 (PID xxx)
[discord] logged in to discord as xxx
```

### Step 5: Create Configuration File

SSH into the machine to create the configuration file:

```bash
fly ssh console
```

Create configuration directory and file:

```bash
mkdir -p /data
cat > /data/clawdbot.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-5",
        "fallbacks": ["anthropic/claude-sonnet-4-5", "openai/gpt-4o"]
      },
      "maxConcurrent": 4
    },
    "list": [
      {
        "id": "main",
        "default": true
      }
    ]
  },
  "auth": {
    "profiles": {
      "anthropic:default": { "mode": "token", "provider": "anthropic" },
      "openai:default": { "mode": "token", "provider": "openai" }
    }
  },
  "bindings": [
    {
      "agentId": "main",
      "match": { "channel": "discord" }
    }
  ],
  "channels": {
    "discord": {
      "enabled": true,
      "groupPolicy": "allowlist",
      "guilds": {
        "YOUR_GUILD_ID": {
          "channels": { "general": { "allow": true } },
          "requireMention": false
        }
      }
    }
  },
  "gateway": {
    "mode": "local",
    "bind": "auto"
  },
  "meta": {
    "lastTouchedVersion": "2026.1.25"
  }
}
EOF
```

Restart to apply configuration:

```bash
exit
fly machine restart <machine-id>
```

### Step 6: Access Gateway

**Control UI**:

```bash
fly open
```

Or visit: `https://my-clawdbot.fly.dev/`

Paste your Gateway token (from `CLAWDBOT_GATEWAY_TOKEN`) to authenticate.

**Logs**:

```bash
fly logs              # Real-time logs
fly logs --no-tail    # Recent logs
```

**SSH Console**:

```bash
fly ssh console
```

### Troubleshooting

**"App is not listening on expected address"**:

Gateway is binding to `127.0.0.1` instead of `0.0.0.0`.

**Fix**: Add `--bind lan` to the process command in `fly.toml`.

**Health check failed / Connection refused**:

Fly cannot access Gateway on the configured port.

**Fix**: Ensure `internal_port` matches the Gateway port (set `--port 3000` or `CLAWDBOT_GATEWAY_PORT=3000`).

**OOM / Memory Issues**:

Container keeps restarting or being killed. Signs: `SIGABRT`, `v8::internal::Runtime_AllocateInYoungGeneration`, or silent restarts.

**Fix**: Increase memory in `fly.toml`:

```toml
[[vm]]
  memory = "2048mb"
```

Or update existing machine:

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

**Note**: 512MB is too small. 1GB might work but may OOM under load or verbose logs. **Recommend 2GB**.

**Gateway Lock Issue**:

Gateway refuses to start, indicating "already running" error.

This happens when container restarts but PID lock file persists on the volume.

**Fix**: Delete lock file:

```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

Lock file is located at `/data/gateway.*.lock` (not in a subdirectory).

### Private Deployment (Hardened)

By default, Fly.io assigns a public IP, making your Gateway accessible at `https://your-app.fly.dev`. This is convenient, but means your deployment can be discovered by internet scanners (Shodan, Censys, etc.).

Use **private template** for hardened deployment without public exposure:

::: info Private Deployment Scenarios
- You only make **outbound** calls/messages (no inbound webhooks)
- You use **ngrok or Tailscale** tunnels for any webhook callbacks
- You access Gateway via **SSH, proxy, or WireGuard**, not browser
- You want deployment **hidden from internet scanners**
:::

**Setup**:

Use `fly.private.toml` instead of the standard configuration:

```bash
# Deploy using private configuration
fly deploy -c fly.private.toml
```

Or convert an existing deployment:

```bash
# List current IPs
fly ips list -a my-clawdbot

# Release public IPs
fly ips release <public-ipv4> -a my-clawdbot
fly ips release <public-ipv6> -a my-clawdbot

# Switch to private config so future deployments don't reassign public IP
fly deploy -c fly.private.toml

# Allocate only private IPv6
fly ips allocate-v6 --private -a my-clawdbot
```

**Accessing Private Deployment**:

Since there's no public URL, use one of these methods:

**Option 1: Local Proxy (Simplest)**

```bash
# Forward local port 3000 to app
fly proxy 3000:3000 -a my-clawdbot

# Then open http://localhost:3000 in your browser
```

**Option 2: WireGuard VPN**

```bash
# Create WireGuard configuration (one-time)
fly wireguard create

# Import into WireGuard client, then access via internal IPv6
# Example: http://[fdaa:x:x:x:x::x]:3000
```

**Option 3: SSH Only**

```bash
fly ssh console -a my-clawdbot
```

### Cost

With recommended configuration (`shared-cpu-2x`, 2GB RAM):
- About $10-15/month depending on usage
- Free tier includes some quota

See: [Fly.io Pricing](https://fly.io/docs/about/pricing/)

---

## Hetzner VPS Deployment

**Best For**: Own VPS, full control, low-cost 24/7 runtime

### Goal

Run persistent Clawdbot Gateway using Docker on Hetzner VPS with persistent state, built-in binaries, and secure restart behavior.

If you want "Clawdbot 24/7, ~$5/month", this is the simplest and most reliable setup.

### What You Need

- Hetzner VPS with root access
- SSH access from your laptop
- Basic SSH + copy/paste comfort
- About 20 minutes
- Docker and Docker Compose
- Model authentication credentials
- Optional provider credentials (WhatsApp QR, Telegram bot token, Gmail OAuth)

### Step 1: Configure VPS

Create an Ubuntu or Debian VPS in Hetzner.

Connect as root:

```bash
ssh root@YOUR_VPS_IP
```

This guide assumes the VPS is stateful. Don't treat it as ephemeral infrastructure.

### Step 2: Install Docker on VPS

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

Verify:

```bash
docker --version
docker compose version
```

### Step 3: Clone Clawdbot Repository

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

This guide assumes you'll build a custom image for binary persistence.

### Step 4: Create Persistent Host Directories

Docker containers are ephemeral. All long-running state must exist on the host.

```bash
mkdir -p /root/.clawdbot
mkdir -p /root/clawd

# Set ownership to container user (uid 1000):
chown -R 1000:1000 /root/.clawdbot
chown -R 1000:1000 /root/clawd
```

### Step 5: Configure Environment Variables

Create `.env` in the repository root.

```bash
CLAWDBOT_IMAGE=clawdbot:latest
CLAWDBOT_GATEWAY_TOKEN=change-me-now
CLAWDBOT_GATEWAY_BIND=lan
CLAWDBOT_GATEWAY_PORT=18789
CLAWDBOT_CONFIG_DIR=/root/.clawdbot
CLAWDBOT_WORKSPACE_DIR=/root/clawd
GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.clawdbot
```

Generate strong secrets:

```bash
openssl rand -hex 32
```

::: warning Don't Commit This File
Add `.env` to `.gitignore`.
:::

### Step 6: Docker Compose Configuration

Create or update `docker-compose.yml`.

```yaml
services:
  clawdbot-gateway:
    image: ${CLAWDBOT_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - CLAWDBOT_GATEWAY_BIND=${CLAWDBOT_GATEWAY_BIND}
      - CLAWDBOT_GATEWAY_PORT=${CLAWDBOT_GATEWAY_PORT}
      - CLAWDBOT_GATEWAY_TOKEN=${CLAWDBOT_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${CLAWDBOT_CONFIG_DIR}:/home/node/.clawdbot
      - ${CLAWDBOT_WORKSPACE_DIR}:/home/node/clawd
    ports:
      # Recommended: Keep Gateway loopback-only on VPS; access via SSH tunnel.
      # To expose publicly, remove `127.0.0.1:` prefix and configure firewall accordingly.
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"
      # Optional: Only if you're running iOS/Android nodes targeting this VPS and need Canvas host.
      # If you expose this port publicly, read /gateway/security and configure firewall accordingly.
      # - "18793:18793"
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "${CLAWDBOT_GATEWAY_BIND}",
        "--port",
        "${CLAWDBOT_GATEWAY_PORT}"
      ]
```

### Step 7: Bake Required Binaries into Image (Critical)

Installing binaries in a running container is a trap. Anything installed at runtime is lost on restart.

All external binaries needed by skills must be installed at image build time.

The following example shows only three common binaries:
- `gog` for Gmail access
- `goplaces` for Google Places
- `wacli` for WhatsApp

These are examples, not a complete list. You can install as many binaries as needed using the same pattern.

If you later add new skills that depend on additional binaries, you must:

1. Update Dockerfile
2. Rebuild image
3. Restart container

**Example Dockerfile**:

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# Example binary 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
|---|

# Example binary 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
|---|

# Example binary 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
|---|

# Add more binaries below using the same pattern

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

### Step 8: Build and Start

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

Verify binaries:

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

Expected output:

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### Step 9: Verify Gateway

```bash
docker compose logs -f clawdbot-gateway
```

Success:

```
[gateway] listening on ws://0.0.0.0:18789
```

From your laptop:

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

Open:

`http://127.0.0.1:18789/`

Paste your Gateway token.

### State Persistence Locations (Source of Truth)

Clawdbot runs in Docker, but Docker is not the source of truth.

All long-running state must survive restarts, rebuilds, and reboots.

| Component | Location | Persistence Mechanism | Notes |
|--- | --- | --- | ---|
| Gateway config | `/home/node/.clawdbot/` | Host volume mount | Includes `clawdbot.json`, tokens |
| Model auth profiles | `/home/node/.clawdbot/` | Host volume mount | OAuth tokens, API keys |
| Skill configs | `/home/node/.clawdbot/skills/` | Host volume mount | Skill-level state |
| Agent workspace | `/home/node/clawd/` | Host volume mount | Code and agent artifacts |
| WhatsApp session | `/home/node/.clawdbot/` | Host volume mount | Preserves QR login |
| Gmail keyring | `/home/node/.clawdbot/` | Host volume mount + password | Requires `GOG_KEYRING_PASSWORD` |
| External binaries | `/usr/local/bin/` | Docker image | Must be baked at build time |
| Node runtime | Container filesystem | Docker image | Rebuilt with every image build |
| OS packages | Container filesystem | Docker image | Don't install at runtime |
| Docker container | Ephemeral | Restartable | Safe to destroy |

---

## exe.dev Deployment

**Best For**: Cheap Linux host, remote access, no need to configure VPS yourself

### Goal

Run Clawdbot Gateway on exe.dev VM, accessible from your laptop via:
- **exe.dev HTTPS proxy** (simple, no tunneling needed)
- **SSH tunnel** (most secure; loopback-only Gateway)

This guide assumes **Ubuntu/Debian**. If you chose a different distro, map packages accordingly. If you're on any other Linux VPS, the same steps apply—you just won't use the exe.dev proxy commands.

### What You Need

- exe.dev account + `ssh exe.dev` runnable on your laptop
- SSH keys set up (your laptop → exe.dev)
- Model authentication you want to use (OAuth or API key)
- Optional provider credentials (WhatsApp QR scan, Telegram bot token, Discord bot token, etc.)

### Step 1: Create VM

From your laptop:

```bash
ssh exe.dev new --name=clawdbot
```

Then connect:

```bash
ssh clawdbot.exe.xyz
```

::: tip Keep VM Stateful
Keep this VM **stateful**. Clawdbot stores state under `~/.clawdbot/` and `~/clawd/`.
:::

### Step 2: Install Prerequisites on VM

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

Install Node **≥ 22.12** (any method works). Quick check:

```bash
node -v
```

If Node 22 is not already on the VM, use your preferred Node manager or distro package sources that provide Node 22+.

### Step 3: Install Clawdbot

Recommended using npm global install on server:

```bash
npm i -g clawdbot@latest
clawdbot --version
```

If native dependency installation fails (rare; usually `sharp`), add build tools:

```bash
sudo apt-get install -y build-essential python3
```

### Step 4: First-time Setup (Wizard)

Run the onboarding wizard on the VM:

```bash
clawdbot onboard --install-daemon
```

It can set up:
- `~/clawd` workspace bootstrapping
- `~/.clawdbot/clawdbot.json` configuration
- Model authentication profiles
- Model provider configuration/login
- Linux systemd **user** service

If you're doing OAuth on a headless VM, first do OAuth on a normal machine, then copy the authentication profile to the VM (see [help](https://docs.clawd.bot/help/)).

### Step 5: Remote Access Options

#### Option A (Recommended): SSH Tunnel (Loopback-Only)

Keep Gateway on loopback (default) and tunnel it from your laptop:

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

Open locally:

- `http://127.0.0.1:18789/` (Control UI)

See: [Remote Access](https://docs.clawd.bot/gateway/remote)

#### Option B: exe.dev HTTPS Proxy (No Tunneling)

To have exe.dev proxy traffic to the VM, bind Gateway to LAN interface and set a token:

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

For service runtime, persist to `~/.clawdbot/clawdbot.json`:

```json5
{
  "gateway": {
    "mode": "local",
    "port": 8080,
    "bind": "lan",
    "auth": { "mode": "token", "token": "YOUR_TOKEN" }
  }
}
```

::: info Important Note
Non-loopback binding requires `gateway.auth.token` (or `CLAWDBOT_GATEWAY_TOKEN`). `gateway.remote.token` is only for remote CLI calls; it doesn't enable local authentication.
:::

Then on exe.dev, point the proxy to your chosen port (`8080` in this example, or whatever port you choose), and open your VM's HTTPS URL:

```bash
ssh exe.dev share port clawdbot 8080
```

Open:

`https://clawdbot.exe.xyz/`

In Control UI, paste the token (UI → Settings → token). The UI sends it as `connect.params.auth.token`.

::: tip Proxy Port
If the proxy expects the app port, prefer using a **non-default** port (like `8080`). Treat the token like a password.
:::

### Step 6: Keep Running (Service)

On Linux, Clawdbot uses systemd **user** services. After `--install-daemon`, verify:

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

If service dies after logout, enable lingering:

```bash
sudo loginctl enable-linger "$USER"
```

### Step 7: Updates

```bash
npm i -g clawdbot@latest
clawdbot doctor
clawdbot gateway restart
clawdbot health
```

See: [Updating](https://docs.clawd.bot/install/updating)

---

## Choosing Recommendations

### Choose by Use Case

| Scenario | Recommended Deployment | Reason |
|--- | --- | ---|
| **Personal use, quick start** | Local Installation | Simplest, no infrastructure needed |
| **Multi-device access, occasional shutdown** | Fly.io | 24/7 online, accessible from anywhere |
| **Full control, own infrastructure** | Hetzner VPS | Full control, persistent state, low cost |
| **Low cost, don't want to manage VPS** | exe.dev | Cheap hosting, quick setup |
| **Need reproducibility, quick rollback** | Nix | Declarative config, version pinning |
| **Testing, isolated environment** | Docker | Easy rebuild, test isolation |

### Security Best Practices

Regardless of which deployment method you choose, follow these security principles:

::: warning Authentication and Access Control
- Always set a token or password authentication for Gateway (when using non-loopback binding)
- Use environment variables to store sensitive credentials (API keys, tokens)
- For cloud deployment, avoid public exposure or use private networks
:::

::: tip State Persistence
- For containerized deployment, ensure configuration and workspace are properly mounted to host volumes
- For VPS deployment, regularly backup `~/.clawdbot/` and `~/clawd/` directories
:::

### Monitoring and Logs

- Regularly check Gateway status: `clawdbot doctor`
- Configure log rotation to avoid disk space exhaustion
- Use health check endpoints to verify service availability

---

## Checkpoint ✅

**Local Installation Verification**:

```bash
clawdbot --version
clawdbot health
```

You should see a message that Gateway is listening.

**Docker Verification**:

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

Container status should be `Up`, and logs should show `[gateway] listening on ws://...`.

**Nix Verification**:

```bash
# Check service status
systemctl --user status clawdbot-gateway

# Check Nix mode
defaults read com.clawdbot.mac clawdbot.nixMode
```

**Cloud Deployment Verification**:

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

You should be able to access Control UI via browser or SSH tunnel.

---

## Common Pitfalls

::: warning Docker Common Issues
- **Incorrect mount paths**: Ensure host paths are shared in Docker Desktop
- **Port conflicts**: Check if port 18789 is already in use
- **Permission issues**: Container user (uid 1000) needs read/write permissions on mounted volumes
:::

::: warning Cloud Deployment Issues
- **OOM errors**: Increase memory allocation (at least 2GB)
- **Gateway Lock**: Delete `/data/gateway.*.lock` file and restart container
- **Health check failure**: Ensure `internal_port` matches Gateway port
:::

::: tip Binary Persistence (Hetzner)
Don't install dependencies at runtime! All binaries needed by skills must be baked into the Docker image, otherwise they'll be lost after container restart.
:::

---

## Lesson Summary

This lesson introduced multiple deployment methods for Clawdbot:

1. **Local Installation**: Simplest and fastest, suitable for personal use and development
2. **Docker Deployment**: Isolated environment, easy rebuild, supports sandboxing
3. **Nix Deployment**: Declarative configuration, reproducible, quick rollback
4. **Fly.io**: Cloud platform, automatic HTTPS, 24/7 online
5. **Hetzner VPS**: Own VPS, full control, persistent state
6. **exe.dev**: Cheap hosting, quick setup, simplified operations

When choosing a deployment method, consider your use case, technical skills, and operations requirements. Ensuring state persistence and security configuration are key to successful deployment.

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-27

| Feature/Section | File Path | Line Number |
|--- | --- | ---|
| Docker deployment script | [`docker-setup.sh`](https://github.com/clawdbot/clawdbot/blob/main/docker-setup.sh) | Full file |
| Docker image definition | [`Dockerfile`](https://github.com/clawdbot/clawdbot/blob/main/Dockerfile) | Full file |
| Docker Compose configuration | [`docker-compose.yml`](https://github.com/clawdbot/clawdbot/blob/main/docker-compose.yml) | Full file |
| Fly.io configuration | [`fly.toml`](https://github.com/clawdbot/clawdbot/blob/main/fly.toml) | Full file |
| Fly private configuration | [`fly.private.toml`](https://github.com/clawdbot/clawdbot/blob/main/fly.private.toml) | Full file |
| Docker sandbox image | [`Dockerfile.sandbox`](https://github.com/clawdbot/clawdbot/blob/main/Dockerfile.sandbox) | Full file |
| Nix integration | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| Installation script | [`scripts/package-mac-app.sh`](https://github.com/clawdbot/clawdbot/blob/main/scripts/package-mac-app.sh) | Full file |

**Key Configuration Files**:
- `~/.clawdbot/clawdbot.json`: Main configuration file
- `~/.clawdbot/`: State directory (sessions, tokens, auth profiles)
- `~/clawd/`: Workspace directory

**Key Environment Variables**:
- `CLAWDBOT_GATEWAY_TOKEN`: Gateway authentication token
- `CLAWDBOT_STATE_DIR`: State directory path
- `CLAWDBOT_CONFIG_PATH`: Configuration file path
- `CLAWDBOT_NIX_MODE`: Enable Nix mode

**Key Scripts**:
- `scripts/sandbox-setup.sh`: Build default sandbox image
- `scripts/sandbox-common-setup.sh`: Build common sandbox image
- `scripts/sandbox-browser-setup.sh`: Build browser sandbox image

**Docker Environment Variables** (.env):
- `CLAWDBOT_IMAGE`: Image name to use
- `CLAWDBOT_GATEWAY_BIND`: Binding mode (lan/auto)
- `CLAWDBOT_GATEWAY_PORT`: Gateway port
- `CLAWDBOT_CONFIG_DIR`: Configuration directory mount
- `CLAWDBOT_WORKSPACE_DIR`: Workspace mount
- `GOG_KEYRING_PASSWORD`: Gmail keyring password
- `XDG_CONFIG_HOME`: XDG configuration directory

**Fly.io Environment Variables**:
- `NODE_ENV`: Runtime environment (production)
- `CLAWDBOT_PREFER_PNPM`: Use pnpm
- `CLAWDBOT_STATE_DIR`: Persistent state directory
- `NODE_OPTIONS`: Node.js runtime options

</details>
