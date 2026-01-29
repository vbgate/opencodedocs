---
title: "Clawdbot 部署完全指南：本地、Docker、Nix、Fly.io、Hetzner VPS 和 exe.dev | Clawdbot 教程"
sidebarTitle: "让 Gateway 24/7 运行"
subtitle: "部署选项"
description: "学习如何在不同平台上部署 Clawdbot：本地安装、Docker 容器化、Nix 声明式配置、Fly.io 云端部署、Hetzner VPS 托管和 exe.dev 虚拟主机。了解各部署方式的特点、适用场景、配置步骤和安全最佳实践。"
tags:
  - "部署"
  - "安装"
  - "Docker"
  - "Nix"
  - "云部署"
prerequisite:
  - "start-getting-started"
order: 360
---

# 部署选项

## 学完你能做什么

学完本课，你将能够：

- 根据需求选择最适合的部署方式（本地、Docker、Nix、云服务）
- 在本地环境安装并运行 Clawdbot
- 使用 Docker 容器化部署 Gateway
- 通过 Nix 声明式管理 Clawdbot
- 将 Gateway 部署到 Fly.io、Hetzner VPS 或 exe.dev
- 配置远程访问和安全最佳实践

## 你现在的困境

想用 Clawdbot 但不确定该选哪种部署方式：

- 本地安装最简单，但机器关机就没法用了
- 想在云端运行 24/7，但不知道哪家云服务合适
- 害怕配置出错，想找最稳妥的部署方案
- 需要多设备访问同一个 Gateway，但不知道怎么实现

## 什么时候用这一招

| 部署方式 | 适用场景 |
|--- | ---|
| **本地安装** | 个人电脑、开发测试、快速上手 |
| **Docker** | 隔离环境、服务器部署、快速重建 |
| **Nix** | 可重现部署、已用 NixOS/Home Manager、需要版本回滚 |
| **Fly.io** | 云端 24/7 运行、自动 HTTPS、简化运维 |
| **Hetzner VPS** | 自有 VPS、完全控制、低成本 24/7 |
| **exe.dev** | 便宜的 Linux 主机、无需自己配置 VPS |

## 🎒 开始前的准备

在开始之前，请确认：

::: warning 环境要求
- Node.js ≥ 22（本地安装必需）
- Docker Desktop + Docker Compose v2（Docker 部署必需）
- Nix flakes + Home Manager（Nix 部署必需）
- SSH 客户端（云部署访问必需）
- 基础终端操作能力（复制、粘贴、执行命令）
:::

::: tip 推荐工具
 - 如果是第一次接触 Clawdbot，建议从[快速开始](../../start/getting-started/)开始
- 使用 AI 助手（如 Claude、Cursor）可以加速配置过程
- 保存好你的 API Key（Anthropic、OpenAI 等）和渠道凭据
:::

## 部署方式对比

### 本地安装

**适用**：个人电脑、开发测试、快速上手

**优点**：
- ✅ 最简单直接，无需额外基础设施
- ✅ 启动快，调试方便
- ✅ 配置修改立即生效

**缺点**：
- ❌ 机器关机就无法使用
- ❌ 不适合 24/7 服务
- ❌ 多设备同步需要额外配置

### Docker 部署

**适用**：服务器部署、隔离环境、CI/CD

**优点**：
- ✅ 环境隔离，易于清理重建
- ✅ 可跨平台统一部署
- ✅ 支持沙箱隔离工具执行
- ✅ 配置可版本控制

**缺点**：
- ❌ 需要 Docker 知识
- ❌ 首次设置稍复杂

### Nix 部署

**适用**：NixOS 用户、Home Manager 用户、需要可重现部署

**优点**：
- ✅ 声明式配置，可重现
- ✅ 快速回滚（`home-manager switch --rollback`）
- ✅ 所有组件版本固定
- ✅ Gateway + macOS app + 工具全托管

**缺点**：
- ❌ 学习曲线较陡
- ❌ 需要熟悉 Nix 生态系统

### 云端部署（Fly.io / Hetzner / exe.dev）

**适用**：24/7 在线、远程访问、团队协作

**优点**：
- ✅ 24/7 在线，不依赖本地机器
- ✅ 自动 HTTPS，无需手动证书
- ✅ 可快速扩展
- ✅ 支持多设备远程访问

**缺点**：
- ❌ 需要支付云服务费用
- ❌ 需要基础运维知识
- ❌ 数据存储在第三方

---

## 本地安装

### npm/pnpm/bun 全局安装（推荐）

从官方 npm 仓库安装最简单：

::: code-group

```bash [npm]
# 使用 npm 安装
npm install -g clawdbot@latest
```

```bash [pnpm]
# 使用 pnpm 安装（推荐）
pnpm add -g clawdbot@latest
```

```bash [bun]
# 使用 bun 安装（最快）
bun add -g clawdbot@latest
```

:::

安装完成后，运行向导：

```bash
clawdbot onboard --install-daemon
```

这个命令会：
- 引导你完成 Gateway、渠道、模型配置
- 安装 Gateway 守护进程（macOS launchd / Linux systemd）
- 设置默认配置文件 `~/.clawdbot/clawdbot.json`

### 从源码构建

如果你需要从源码构建（开发、自定义）：

::: code-group

```bash [macOS/Linux]
# 克隆仓库
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# 安装依赖并构建
pnpm install
pnpm ui:build
pnpm build

# 安装并运行
pnpm clawdbot onboard --install-daemon
```

```bash [Windows (WSL2)]
# 在 WSL2 中构建（推荐）
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

wsl.exe -d Ubuntu bash -c "pnpm install && pnpm ui:build && pnpm build"
```

:::

::: info 开发循环
运行 `pnpm gateway:watch` 可以在代码修改时自动重载 Gateway。
:::

---

## Docker 部署

### 快速开始（推荐）

使用提供的脚本一键部署：

```bash
./docker-setup.sh
```

这个脚本会：
- 构建 Gateway 镜像
- 运行 onboarding 向导
- 打印提供商配置提示
- 通过 Docker Compose 启动 Gateway
- 生成 Gateway token 并写入 `.env`

完成之后：
1. 在浏览器打开 `http://127.0.0.1:18789/`
2. 在 Control UI 的设置中粘贴 token

脚本会在主机上创建：
- `~/.clawdbot/`（配置目录）
- `~/clawd`（工作区目录）

### 手动流程

如果需要自定义 Docker Compose 配置：

```bash
# 构建镜像
docker build -t clawdbot:local -f Dockerfile .

# 运行 CLI 容器完成配置
docker compose run --rm clawdbot-cli onboard

# 启动 Gateway
docker compose up -d clawdbot-gateway
```

### 额外挂载（可选）

如果你想在容器中挂载额外的主机目录，可以在运行 `docker-setup.sh` 之前设置环境变量：

```bash
export CLAWDBOT_EXTRA_MOUNTS="$HOME/.codex:/home/node/.codex:ro,$HOME/github:/home/node/github:rw"
./docker-setup.sh
```

**注意事项**：
- 路径必须与 Docker Desktop 共享（macOS/Windows）
- 如果修改 `CLAWDBOT_EXTRA_MOUNTS`，需要重新运行 `docker-setup.sh` 重新生成 compose 文件

### 持久化容器主目录（可选）

如果希望 `/home/node` 在容器重建时持久化：

```bash
export CLAWDBOT_HOME_VOLUME="clawdbot_home"
./docker-setup.sh
```

**注意事项**：
- 命名卷会持久化直到被 `docker volume rm` 删除
- 可以与 `CLAWDBOT_EXTRA_MOUNTS` 结合使用

### 安装额外的系统包（可选）

如果需要在镜像中安装额外的系统包（例如构建工具、媒体库）：

```bash
export CLAWDBOT_DOCKER_APT_PACKAGES="ffmpeg build-essential"
./docker-setup.sh
```

### 渠道配置（可选）

使用 CLI 容器配置渠道：

::: code-group

```bash [WhatsApp]
# 登录 WhatsApp（会显示 QR 码）
docker compose run --rm clawdbot-cli channels login
```

```bash [Telegram]
# 添加 Telegram bot
docker compose run --rm clawdbot-cli channels add --channel telegram --token "<token>"
```

```bash [Discord]
# 添加 Discord bot
docker compose run --rm clawdbot-cli channels add --channel discord --token "<token>"
```

:::

### 健康检查

```bash
docker compose exec clawdbot-gateway node dist/index.js health --token "$CLAWDBOT_GATEWAY_TOKEN"
```

### Agent Sandbox（主机 Gateway + Docker 工具）

Docker 还可以用于沙箱隔离非 main 会话的工具执行。详见：[Sandboxing](https://docs.clawd.bot/gateway/sandboxing)

---

## Nix 安装

**推荐方式**：使用 [nix-clawdbot](https://github.com/clawdbot/nix-clawdbot) Home Manager 模块

### 快速开始

把这段话粘贴到你的 AI 助手（Claude、Cursor 等）：

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

> **📦 完整指南**：[github.com/clawdbot/nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Nix 模式运行时行为

当设置 `CLAWDBOT_NIX_MODE=1` 时（nix-clawdbot 自动设置）：

- 配置变得确定性，禁用自动安装流程
- 如果缺少依赖，显示 Nix 特定的修复信息
- UI 表面显示只读 Nix 模式横幅

在 macOS 上，GUI 应用不会自动继承 shell 环境变量。你也可以通过 defaults 启用 Nix 模式：

```bash
defaults write com.clawdbot.mac clawdbot.nixMode -bool true
```

### 配置和状态路径

在 Nix 模式下，明确设置这些环境变量：

- `CLAWDBOT_STATE_DIR`（默认：`~/.clawdbot`）
- `CLAWDBOT_CONFIG_PATH`（默认：`$CLAWDBOT_STATE_DIR/clawdbot.json`）

这样运行时状态和配置会保持在 Nix 管理的不可变存储之外。

---

## Fly.io 云部署

**适合**：需要云端 24/7 运行、简化运维、自动 HTTPS

### 你需要什么

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
- Fly.io 账户（免费层级可用）
- 模型认证：Anthropic API Key（或其他提供商 Key）
- 渠道凭据：Discord bot token、Telegram token 等

### 第一步：创建 Fly 应用

```bash
# 克隆仓库
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# 创建新 Fly 应用（选择你自己的名字）
fly apps create my-clawdbot

# 创建持久化卷（1GB 通常足够）
fly volumes create clawdbot_data --size 1 --region iad
```

::: tip 地区选择
选择离你最近的地域。常见选项：
- `lhr`（伦敦）
- `iad`（弗吉尼亚）
- `sjc`（圣何塞）
:::

### 第二步：配置 fly.toml

编辑 `fly.toml` 以匹配你的应用名和需求。

::: warning 安全说明
默认配置会暴露公共 URL。对于没有公共 IP 的加固部署，见 [Private Deployment](#私有部署加固)，或使用 `fly.private.toml`。
:::

```toml
app = "my-clawdbot"  # 你的应用名
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

**关键设置说明**：

| 设置 | 原因 |
|--- | ---|
| `--bind lan` | 绑定到 `0.0.0.0`，让 Fly 的代理可以访问 Gateway |
| `--allow-unconfigured` | 在没有配置文件的情况下启动（你会在之后创建） |
| `internal_port = 3000` | 必须匹配 `--port 3000`（或 `CLAWDBOT_GATEWAY_PORT`）用于 Fly 健康检查 |
| `memory = "2048mb"` | 512MB 太小；推荐 2GB |
| `CLAWDBOT_STATE_DIR = "/data"` | 在卷上持久化状态 |

### 第三步：设置 secrets

```bash
# 必需：Gateway token（用于非 loopback 绑定）
fly secrets set CLAWDBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)

# 模型提供商 API Keys
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# 渠道 tokens
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

::: tip 安全建议
非 loopback 绑定（`--bind lan`）需要 `CLAWDBOT_GATEWAY_TOKEN` 以保证安全。将这些 token 视为密码。对于所有 API keys 和 tokens，优先使用环境变量而不是配置文件，这样可以防止凭据暴露到 `clawdbot.json` 中。
:::

### 第四步：部署

```bash
fly deploy
```

首次部署会构建 Docker 镜像（约 2-3 分钟）。后续部署会更快。

部署后，验证：

```bash
fly status
fly logs
```

你应该看到：

```
[gateway] listening on ws://0.0.0.0:3000 (PID xxx)
[discord] logged in to discord as xxx
```

### 第五步：创建配置文件

SSH 进入机器创建配置文件：

```bash
fly ssh console
```

创建配置目录和文件：

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

重启以应用配置：

```bash
exit
fly machine restart <machine-id>
```

### 第六步：访问 Gateway

**Control UI**：

```bash
fly open
```

或访问：`https://my-clawdbot.fly.dev/`

粘贴你的 Gateway token（来自 `CLAWDBOT_GATEWAY_TOKEN`）以进行身份验证。

**日志**：

```bash
fly logs              # 实时日志
fly logs --no-tail    # 最近日志
```

**SSH 控制台**：

```bash
fly ssh console
```

### 故障排除

**"App is not listening on expected address"**：

Gateway 正在绑定到 `127.0.0.1` 而不是 `0.0.0.0`。

**修复**：在 `fly.toml` 的进程命令中添加 `--bind lan`。

**健康检查失败 / 连接被拒绝**：

Fly 无法在配置的端口上访问 Gateway。

**修复**：确保 `internal_port` 匹配 Gateway 端口（设置 `--port 3000` 或 `CLAWDBOT_GATEWAY_PORT=3000`）。

**OOM / 内存问题**：

容器持续重启或被杀死。迹象：`SIGABRT`、`v8::internal::Runtime_AllocateInYoungGeneration` 或静默重启。

**修复**：在 `fly.toml` 中增加内存：

```toml
[[vm]]
  memory = "2048mb"
```

或更新现有机器：

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

**注意**：512MB 太小。1GB 可能可以但负载或详细日志下可能 OOM。**推荐 2GB**。

**Gateway Lock 问题**：

Gateway 拒绝启动，提示"already running"错误。

这发生在容器重启但 PID lock 文件在卷上持久化时。

**修复**：删除 lock 文件：

```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

Lock 文件位于 `/data/gateway.*.lock`（不在子目录中）。

### 私有部署（加固）

默认情况下，Fly.io 分配公共 IP，使你的 Gateway 在 `https://your-app.fly.dev` 可访问。这很方便，但也意味着你的部署可以被互联网扫描器发现（Shodan、Censys 等）。

**使用私有模板**实现没有公共暴露的加固部署：

::: info 私有部署场景
- 你只进行**出站**调用/消息（没有入站 webhooks）
- 你使用 **ngrok 或 Tailscale** 隧道作为任何 webhook 回调
- 你通过 **SSH、代理或 WireGuard**而不是浏览器访问 Gateway
- 你希望部署**从互联网扫描器隐藏**
:::

**设置**：

使用 `fly.private.toml` 而不是标准配置：

```bash
# 使用私有配置部署
fly deploy -c fly.private.toml
```

或转换现有部署：

```bash
# 列出当前 IP
fly ips list -a my-clawdbot

# 释放公共 IP
fly ips release <public-ipv4> -a my-clawdbot
fly ips release <public-ipv6> -a my-clawdbot

# 切换到私有配置，以便未来部署不会重新分配公共 IP
fly deploy -c fly.private.toml

# 仅分配私有 IPv6
fly ips allocate-v6 --private -a my-clawdbot
```

**访问私有部署**：

由于没有公共 URL，使用以下方法之一：

**选项 1：本地代理（最简单）**

```bash
# 将本地端口 3000 转发到应用
fly proxy 3000:3000 -a my-clawdbot

# 然后在浏览器中打开 http://localhost:3000
```

**选项 2：WireGuard VPN**

```bash
# 创建 WireGuard 配置（一次性）
fly wireguard create

# 导入到 WireGuard 客户端，然后通过内部 IPv6 访问
# 示例：http://[fdaa:x:x:x:x::x]:3000
```

**选项 3：仅 SSH**

```bash
fly ssh console -a my-clawdbot
```

### 成本

使用推荐的配置（`shared-cpu-2x`、2GB RAM）：
- 根据使用情况约为 $10-15/月
- 免费层级包含一些配额

详见：[Fly.io 定价](https://fly.io/docs/about/pricing/)

---

## Hetzner VPS 部署

**适合**：自有 VPS、完全控制、低成本 24/7 运行

### 目标

在 Hetzner VPS 上使用 Docker 运行持久的 Clawdbot Gateway，具有持久化状态、内置二进制文件和安全的重启行为。

如果你想要"Clawdbot 24/7，约 $5/月"，这是最简单可靠的设置。

### 你需要什么

- Hetzner VPS，具有 root 访问权限
- 从你的笔记本电脑进行 SSH 访问
- 基本 SSH + 复制/粘贴舒适度
- 大约 20 分钟
- Docker 和 Docker Compose
- 模型认证凭据
- 可选提供商凭据（WhatsApp QR、Telegram bot token、Gmail OAuth）

### 第一步：配置 VPS

在 Hetzner 中创建 Ubuntu 或 Debian VPS。

以 root 身份连接：

```bash
ssh root@YOUR_VPS_IP
```

本指南假设 VPS 是有状态的。不要将其视为一次性基础设施。

### 第二步：在 VPS 上安装 Docker

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

验证：

```bash
docker --version
docker compose version
```

### 第三步：克隆 Clawdbot 仓库

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

本指南假设你将构建自定义镜像以保证二进制文件持久化。

### 第四步：创建持久化主机目录

Docker 容器是临时的。所有长期运行的状态必须存在于主机上。

```bash
mkdir -p /root/.clawdbot
mkdir -p /root/clawd

# 将所有权设置为容器用户 (uid 1000)：
chown -R 1000:1000 /root/.clawdbot
chown -R 1000:1000 /root/clawd
```

### 第五步：配置环境变量

在仓库根目录中创建 `.env`。

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

生成强 secrets：

```bash
openssl rand -hex 32
```

::: warning 不要提交这个文件
将 `.env` 添加到 `.gitignore`。
:::

### 第六步：Docker Compose 配置

创建或更新 `docker-compose.yml`。

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
      # 推荐：在 VPS 上保持 Gateway 仅 loopback；通过 SSH 隧道访问。
      # 要公开暴露，移除 `127.0.0.1:` 前缀并相应配置防火墙。
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"
      # 可选：仅当你针对此 VPS 运行 iOS/Android 节点并需要 Canvas 主机时。
      # 如果你公开暴露此端口，阅读 /gateway/security 并相应配置防火墙。
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

### 第七步：将所需二进制文件烘焙到镜像（关键）

在运行的容器中安装二进制文件是一个陷阱。运行时安装的任何内容在重启时都会丢失。

技能需要的所有外部二进制文件必须在镜像构建时安装。

以下示例仅显示三个常见二进制文件：
- `gog` 用于 Gmail 访问
- `goplaces` 用于 Google Places
- `wacli` 用于 WhatsApp

这些是示例，不是完整列表。你可以根据需要使用相同模式安装尽可能多的二进制文件。

如果你以后添加依赖于额外二进制文件的新技能，必须：

1. 更新 Dockerfile
2. 重新构建镜像
3. 重启容器

**示例 Dockerfile**：

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# 示例二进制文件 1：Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
|---|

# 示例二进制文件 2：Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
|---|

# 示例二进制文件 3：WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
|---|

# 使用相同模式在下面添加更多二进制文件

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

### 第八步：构建和启动

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

验证二进制文件：

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

预期输出：

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### 第九步：验证 Gateway

```bash
docker compose logs -f clawdbot-gateway
```

成功：

```
[gateway] listening on ws://0.0.0.0:18789
```

从你的笔记本电脑：

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

打开：

`http://127.0.0.1:18789/`

粘贴你的 Gateway token。

### 状态持久化位置（真相源）

Clawdbot 在 Docker 中运行，但 Docker 不是真相源。

所有长期运行的状态必须在重启、重建和重启后保持存活。

| 组件 | 位置 | 持久化机制 | 备注 |
|--- | --- | --- | ---|
| Gateway config | `/home/node/.clawdbot/` | 主机卷挂载 | 包括 `clawdbot.json`、tokens |
| Model auth profiles | `/home/node/.clawdbot/` | 主机卷挂载 | OAuth tokens、API keys |
| Skill configs | `/home/node/.clawdbot/skills/` | 主机卷挂载 | 技能级状态 |
| Agent workspace | `/home/node/clawd/` | 主机卷挂载 | 代码和 agent 工件 |
| WhatsApp session | `/home/node/.clawdbot/` | 主机卷挂载 | 保留 QR 登录 |
| Gmail keyring | `/home/node/.clawdbot/` | 主机卷 + 密码 | 需要 `GOG_KEYRING_PASSWORD` |
| External binaries | `/usr/local/bin/` | Docker 镜像 | 必须在构建时烘焙 |
| Node runtime | 容器文件系统 | Docker 镜像 | 每次镜像构建时重新构建 |
| OS packages | 容器文件系统 | Docker 镜像 | 不要在运行时安装 |
| Docker container | 临时 | 可重新启动 | 安全销毁 |

---

## exe.dev 部署

**适合**：便宜的 Linux 主机、远程访问、无需自己配置 VPS

### 目标

在 exe.dev VM 上运行 Clawdbot Gateway，可以从你的笔记本电脑通过以下方式访问：
- **exe.dev HTTPS 代理**（简单，无需隧道理）
- **SSH 隧道**（最安全；仅 loopback Gateway）

本指南假设 **Ubuntu/Debian**。如果你选择了不同的发行版，相应映射软件包。如果你在任何其他 Linux VPS 上，同样的步骤适用——你只是不会使用 exe.dev 代理命令。

### 你需要什么

- exe.dev 账户 + 可以在你的笔记本电脑上运行的 `ssh exe.dev`
- SSH keys 设置（你的笔记本电脑 → exe.dev）
- 你要使用的模型认证（OAuth 或 API key）
- 可选提供商凭据（WhatsApp QR 扫描、Telegram bot token、Discord bot token 等）

### 第一步：创建 VM

从你的笔记本电脑：

```bash
ssh exe.dev new --name=clawdbot
```

然后连接：

```bash
ssh clawdbot.exe.xyz
```

::: tip 保持 VM 有状态
保持此 VM **有状态**。Clawdbot 在 `~/.clawdbot/` 和 `~/clawd/` 下存储状态。
:::

### 第二步：在 VM 上安装前提条件

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

安装 Node **≥ 22.12**（任何方法都可以）。快速检查：

```bash
node -v
```

如果 VM 上还没有 Node 22，使用你偏好的 Node 管理器或提供 Node 22+ 的发行版软件包源。

### 第三步：安装 Clawdbot

在服务器上推荐使用 npm 全局安装：

```bash
npm i -g clawdbot@latest
clawdbot --version
```

如果原生依赖安装失败（很少见；通常是 `sharp`），添加构建工具：

```bash
sudo apt-get install -y build-essential python3
```

### 第四步：首次设置（向导）

在 VM 上运行 onboarding 向导：

```bash
clawdbot onboard --install-daemon
```

它可以设置：
- `~/clawd` 工作区引导
- `~/.clawdbot/clawdbot.json` 配置
- 模型认证 profiles
- 模型提供商配置/登录
- Linux systemd **user** 服务（service）

如果你在无头 VM 上进行 OAuth，首先在正常机器上进行 OAuth，然后将认证 profile 复制到 VM（见[帮助](https://docs.clawd.bot/help/)）。

### 第五步：远程访问选项

#### 选项 A（推荐）：SSH 隧道（仅 loopback）

保持 Gateway 在 loopback（默认）并从你的笔记本电脑隧道路由它：

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

在本地打开：

- `http://127.0.0.1:18789/`（Control UI）

详见：[远程访问](https://docs.clawd.bot/gateway/remote)

#### 选项 B：exe.dev HTTPS 代理（无需隧道理）

要让 exe.dev 将流量代理到 VM，将 Gateway 绑定到 LAN 接口并设置 token：

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

对于服务运行，将其持久化到 `~/.clawdbot/clawdbot.json`：

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

::: info 重要说明
非 loopback 绑定需要 `gateway.auth.token`（或 `CLAWDBOT_GATEWAY_TOKEN`）。`gateway.remote.token` 仅用于远程 CLI 调用；它不会启用本地认证。
:::

然后在 exe.dev 上将代理指向你选择的端口（本示例中为 `8080`，或任何你选择的端口），并打开你的 VM 的 HTTPS URL：

```bash
ssh exe.dev share port clawdbot 8080
```

打开：

`https://clawdbot.exe.xyz/`

在 Control UI 中，粘贴 token（UI → 设置 → token）。UI 将其作为 `connect.params.auth.token` 发送。

::: tip 代理端口
如果代理期望应用端口，优先使用**非默认**端口（如 `8080`）。将 token 视为密码。
:::

### 第六步：保持运行（服务）

在 Linux 上，Clawdbot 使用 systemd **user** 服务。`--install-daemon` 后，验证：

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

如果服务在注销后死亡，启用 lingering：

```bash
sudo loginctl enable-linger "$USER"
```

### 第七步：更新

```bash
npm i -g clawdbot@latest
clawdbot doctor
clawdbot gateway restart
clawdbot health
```

详见：[更新](https://docs.clawd.bot/install/updating)

---

## 选择建议

### 根据使用场景选择

| 场景 | 推荐部署 | 原因 |
|--- | --- | ---|
| **个人使用、快速上手** | 本地安装 | 最简单，无需基础设施 |
| **多设备访问、偶尔关闭** | Fly.io | 24/7 在线，可从任何地方访问 |
| **完全控制、自有基础设施** | Hetzner VPS | 完全控制、持久化状态、低成本 |
| **低成本、不想管理 VPS** | exe.dev | 廉价主机、快速设置 |
| **需要可重现、快速回滚** | Nix | 声明式配置、版本固定 |
| **测试、隔离环境** | Docker | 易于重建、测试隔离 |

### 安全最佳实践

无论选择哪种部署方式，都应遵循以下安全原则：

::: warning 认证和访问控制
- 始终为 Gateway 设置 token 或密码认证（非 loopback 绑定时）
- 使用环境变量存储敏感凭据（API keys、tokens）
- 对于云部署，避免公开暴露或使用私有网络
:::

::: tip 状态持久化
- 对于容器化部署，确保配置和工作区正确挂载到主机卷
- 对于 VPS 部署，定期备份 `~/.clawdbot/` 和 `~/clawd/` 目录
:::

### 监控和日志

- 定期检查 Gateway 状态：`clawdbot doctor`
- 配置日志轮转以避免磁盘空间耗尽
- 使用健康检查端点验证服务可用性

---

## 检查点 ✅

**本地安装验证**：

```bash
clawdbot --version
clawdbot health
```

你应该看到 Gateway 正在监听的消息。

**Docker 验证**：

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

容器状态应该是 `Up`，日志应显示 `[gateway] listening on ws://...`。

**Nix 验证**：

```bash
# 检查服务状态
systemctl --user status clawdbot-gateway

# 检查 Nix 模式
defaults read com.clawdbot.mac clawdbot.nixMode
```

**云部署验证**：

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

你应该能够通过浏览器访问 Control UI 或通过 SSH 隧道。

---

## 踩坑提醒

::: warning Docker 常见问题
- **挂载路径错误**：确保主机路径在 Docker Desktop 共享中
- **端口冲突**：检查 18789 端口是否被占用
- **权限问题**：容器用户 (uid 1000) 需要对挂载卷的读写权限
:::

::: warning 云部署问题
- **OOM 错误**：增加内存分配（至少 2GB）
- **Gateway Lock**：删除 `/data/gateway.*.lock` 文件后重启容器
- **健康检查失败**：确保 `internal_port` 与 Gateway 端口匹配
:::

::: tip 二进制文件持久化（Hetzner）
不要在运行时安装依赖！所有技能需要的二进制文件必须烘焙到 Docker 镜像中，否则容器重启后会丢失。
:::

---

## 本课小结

本课介绍了 Clawdbot 的多种部署方式：

1. **本地安装**：最简单快速，适合个人使用和开发
2. **Docker 部署**：隔离环境、易于重建、支持沙箱
3. **Nix 部署**：声明式配置、可重现、快速回滚
4. **Fly.io**：云平台、自动 HTTPS、24/7 在线
5. **Hetzner VPS**：自有 VPS、完全控制、持久化状态
6. **exe.dev**：廉价主机、快速设置、简化运维

选择部署方式时，考虑你的使用场景、技术能力和运维需求。确保状态持久化和安全配置是成功部署的关键。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能/章节 | 文件路径 | 行号 |
|--- | --- | ---|
| Docker 部署脚本 | [`docker-setup.sh`](https://github.com/clawdbot/clawdbot/blob/main/docker-setup.sh) | 全文 |
| Docker 镜像定义 | [`Dockerfile`](https://github.com/clawdbot/clawdbot/blob/main/Dockerfile) | 全文 |
| Docker Compose 配置 | [`docker-compose.yml`](https://github.com/clawdbot/clawdbot/blob/main/docker-compose.yml) | 全文 |
| Fly.io 配置 | [`fly.toml`](https://github.com/clawdbot/clawdbot/blob/main/fly.toml) | 全文 |
| Fly 私有配置 | [`fly.private.toml`](https://github.com/clawdbot/clawdbot/blob/main/fly.private.toml) | 全文 |
| Docker 沙箱镜像 | [`Dockerfile.sandbox`](https://github.com/clawdbot/clawdbot/blob/main/Dockerfile.sandbox) | 全文 |
| Nix 集成 | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| 安装脚本 | [`scripts/package-mac-app.sh`](https://github.com/clawdbot/clawdbot/blob/main/scripts/package-mac-app.sh) | 全文 |

**关键配置文件**：
- `~/.clawdbot/clawdbot.json`：主配置文件
- `~/.clawdbot/`：状态目录（sessions、tokens、auth profiles）
- `~/clawd/`：工作区目录

**关键环境变量**：
- `CLAWDBOT_GATEWAY_TOKEN`：Gateway 认证 token
- `CLAWDBOT_STATE_DIR`：状态目录路径
- `CLAWDBOT_CONFIG_PATH`：配置文件路径
- `CLAWDBOT_NIX_MODE`：启用 Nix 模式

**关键脚本**：
- `scripts/sandbox-setup.sh`：构建默认沙箱镜像
- `scripts/sandbox-common-setup.sh`：构建通用沙箱镜像
- `scripts/sandbox-browser-setup.sh`：构建浏览器沙箱镜像

**Docker 环境变量**（.env）：
- `CLAWDBOT_IMAGE`：要使用的镜像名称
- `CLAWDBOT_GATEWAY_BIND`：绑定模式（lan/auto）
- `CLAWDBOT_GATEWAY_PORT`：Gateway 端口
- `CLAWDBOT_CONFIG_DIR`：配置目录挂载
- `CLAWDBOT_WORKSPACE_DIR`：工作区挂载
- `GOG_KEYRING_PASSWORD`：Gmail keyring 密码
- `XDG_CONFIG_HOME`：XDG 配置目录

**Fly.io 环境变量**：
- `NODE_ENV`：运行时环境（production）
- `CLAWDBOT_PREFER_PNPM`：使用 pnpm
- `CLAWDBOT_STATE_DIR`：持久化状态目录
- `NODE_OPTIONS`：Node.js 运行时选项

</details>
