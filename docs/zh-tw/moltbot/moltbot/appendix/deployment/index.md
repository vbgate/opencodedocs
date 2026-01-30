---
title: "Clawdbot 部署完全指南：本機、Docker、Nix、Fly.io、Hetzner VPS 和 exe.dev | Clawdbot 教學"
sidebarTitle: "讓 Gateway 24/7 運行"
subtitle: "部署選項"
description: "學習如何在不同平台上部署 Clawdbot：本機安裝、Docker 容器化、Nix 宣告式配置、Fly.io 雲端部署、Hetzner VPS 託管和 exe.dev 虛擬主機。了解各部署方式的特點、適用情境、配置步驟和安全最佳實踐。"
tags:
  - "部署"
  - "安裝"
  - "Docker"
  - "Nix"
  - "雲端部署"
prerequisite:
  - "start-getting-started"
order: 360
---

# 部署選項

## 學完你能做什麼

學完本課，你將能夠：

- 根據需求選擇最適合的部署方式（本機、Docker、Nix、雲端服務）
- 在本機環境安裝並執行 Clawdbot
- 使用 Docker 容器化部署 Gateway
- 透過 Nix 宣告式管理 Clawdbot
- 將 Gateway 部署到 Fly.io、Hetzner VPS 或 exe.dev
- 配置遠端存取和安全最佳實踐

## 你現在的困境

想用 Clawdbot 但不確定該選哪種部署方式：

- 本機安裝最簡單，但電腦關機就沒法用了
- 想在雲端執行 24/7，但不知道哪家雲端服務合適
- 害怕配置出錯，想找最穩妥的部署方案
- 需要多裝置存取同一個 Gateway，但不知道怎麼實現

## 什麼時候用這一招

| 部署方式 | 適用情境 |
| --- | --- |
| **本機安裝** | 個人電腦、開發測試、快速上手 |
| **Docker** | 隔離環境、伺服器部署、快速重建 |
| **Nix** | 可重現部署、已用 NixOS/Home Manager、需要版本回滾 |
| **Fly.io** | 雲端 24/7 執行、自動 HTTPS、簡化維運 |
| **Hetzner VPS** | 自有 VPS、完全控制、低成本 24/7 |
| **exe.dev** | 便宜的 Linux 主機、無需自己配置 VPS |

## 🎒 開始前的準備

在開始之前，請確認：

::: warning 環境要求
- Node.js ≥ 22（本機安裝必需）
- Docker Desktop + Docker Compose v2（Docker 部署必需）
- Nix flakes + Home Manager（Nix 部署必需）
- SSH 用戶端（雲端部署存取必需）
- 基礎終端機操作能力（複製、貼上、執行命令）
:::

::: tip 推薦工具
 - 如果是第一次接觸 Clawdbot，建議從[快速開始](../../start/getting-started/)開始
- 使用 AI 助手（如 Claude、Cursor）可以加速配置過程
- 保存好你的 API Key（Anthropic、OpenAI 等）和頻道憑證
:::

## 部署方式對比

### 本機安裝

**適用**：個人電腦、開發測試、快速上手

**優點**：
- ✅ 最簡單直接，無需額外基礎設施
- ✅ 啟動快，除錯方便
- ✅ 配置修改立即生效

**缺點**：
- ❌ 電腦關機就無法使用
- ❌ 不適合 24/7 服務
- ❌ 多裝置同步需要額外配置

### Docker 部署

**適用**：伺服器部署、隔離環境、CI/CD

**優點**：
- ✅ 環境隔離，易於清理重建
- ✅ 可跨平台統一部署
- ✅ 支援沙箱隔離工具執行
- ✅ 配置可版本控制

**缺點**：
- ❌ 需要 Docker 知識
- ❌ 首次設定稍複雜

### Nix 部署

**適用**：NixOS 使用者、Home Manager 使用者、需要可重現部署

**優點**：
- ✅ 宣告式配置，可重現
- ✅ 快速回滾（`home-manager switch --rollback`）
- ✅ 所有元件版本固定
- ✅ Gateway + macOS app + 工具全託管

**缺點**：
- ❌ 學習曲線較陡
- ❌ 需要熟悉 Nix 生態系統

### 雲端部署（Fly.io / Hetzner / exe.dev）

**適用**：24/7 上線、遠端存取、團隊協作

**優點**：
- ✅ 24/7 上線，不依賴本機電腦
- ✅ 自動 HTTPS，無需手動憑證
- ✅ 可快速擴展
- ✅ 支援多裝置遠端存取

**缺點**：
- ❌ 需要支付雲端服務費用
- ❌ 需要基礎維運知識
- ❌ 資料儲存在第三方

---

## 本機安裝

### npm/pnpm/bun 全域安裝（推薦）

從官方 npm 倉庫安裝最簡單：

::: code-group

```bash [npm]
# 使用 npm 安裝
npm install -g clawdbot@latest
```

```bash [pnpm]
# 使用 pnpm 安裝（推薦）
pnpm add -g clawdbot@latest
```

```bash [bun]
# 使用 bun 安裝（最快）
bun add -g clawdbot@latest
```

:::

安裝完成後，執行引導精靈：

```bash
clawdbot onboard --install-daemon
```

這個命令會：
- 引導你完成 Gateway、頻道、模型配置
- 安裝 Gateway 守護程序（macOS launchd / Linux systemd）
- 設定預設配置檔 `~/.clawdbot/clawdbot.json`

### 從原始碼建置

如果你需要從原始碼建置（開發、自訂）：

::: code-group

```bash [macOS/Linux]
# 複製倉庫
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# 安裝相依套件並建置
pnpm install
pnpm ui:build
pnpm build

# 安裝並執行
pnpm clawdbot onboard --install-daemon
```

```bash [Windows (WSL2)]
# 在 WSL2 中建置（推薦）
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

wsl.exe -d Ubuntu bash -c "pnpm install && pnpm ui:build && pnpm build"
```

:::

::: info 開發循環
執行 `pnpm gateway:watch` 可以在程式碼修改時自動重新載入 Gateway。
:::

---

## Docker 部署

### 快速開始（推薦）

使用提供的腳本一鍵部署：

```bash
./docker-setup.sh
```

這個腳本會：
- 建置 Gateway 映像檔
- 執行 onboarding 引導精靈
- 列印提供商配置提示
- 透過 Docker Compose 啟動 Gateway
- 產生 Gateway token 並寫入 `.env`

完成之後：
1. 在瀏覽器開啟 `http://127.0.0.1:18789/`
2. 在 Control UI 的設定中貼上 token

腳本會在主機上建立：
- `~/.clawdbot/`（配置目錄）
- `~/clawd`（工作區目錄）

### 手動流程

如果需要自訂 Docker Compose 配置：

```bash
# 建置映像檔
docker build -t clawdbot:local -f Dockerfile .

# 執行 CLI 容器完成配置
docker compose run --rm clawdbot-cli onboard

# 啟動 Gateway
docker compose up -d clawdbot-gateway
```

### 額外掛載（選用）

如果你想在容器中掛載額外的主機目錄，可以在執行 `docker-setup.sh` 之前設定環境變數：

```bash
export CLAWDBOT_EXTRA_MOUNTS="$HOME/.codex:/home/node/.codex:ro,$HOME/github:/home/node/github:rw"
./docker-setup.sh
```

**注意事項**：
- 路徑必須與 Docker Desktop 共享（macOS/Windows）
- 如果修改 `CLAWDBOT_EXTRA_MOUNTS`，需要重新執行 `docker-setup.sh` 重新產生 compose 檔案

### 持久化容器主目錄（選用）

如果希望 `/home/node` 在容器重建時持久化：

```bash
export CLAWDBOT_HOME_VOLUME="clawdbot_home"
./docker-setup.sh
```

**注意事項**：
- 命名卷會持久化直到被 `docker volume rm` 刪除
- 可以與 `CLAWDBOT_EXTRA_MOUNTS` 結合使用

### 安裝額外的系統套件（選用）

如果需要在映像檔中安裝額外的系統套件（例如建置工具、媒體函式庫）：

```bash
export CLAWDBOT_DOCKER_APT_PACKAGES="ffmpeg build-essential"
./docker-setup.sh
```

### 頻道配置（選用）

使用 CLI 容器配置頻道：

::: code-group

```bash [WhatsApp]
# 登入 WhatsApp（會顯示 QR 碼）
docker compose run --rm clawdbot-cli channels login
```

```bash [Telegram]
# 新增 Telegram bot
docker compose run --rm clawdbot-cli channels add --channel telegram --token "<token>"
```

```bash [Discord]
# 新增 Discord bot
docker compose run --rm clawdbot-cli channels add --channel discord --token "<token>"
```

:::

### 健康檢查

```bash
docker compose exec clawdbot-gateway node dist/index.js health --token "$CLAWDBOT_GATEWAY_TOKEN"
```

### Agent Sandbox（主機 Gateway + Docker 工具）

Docker 還可以用於沙箱隔離非 main 會話的工具執行。詳見：[Sandboxing](https://docs.clawd.bot/gateway/sandboxing)

---

## Nix 安裝

**推薦方式**：使用 [nix-clawdbot](https://github.com/clawdbot/nix-clawdbot) Home Manager 模組

### 快速開始

把這段話貼到你的 AI 助手（Claude、Cursor 等）：

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

### Nix 模式執行時行為

當設定 `CLAWDBOT_NIX_MODE=1` 時（nix-clawdbot 自動設定）：

- 配置變得確定性，停用自動安裝流程
- 如果缺少相依套件，顯示 Nix 特定的修復資訊
- UI 介面顯示唯讀 Nix 模式橫幅

在 macOS 上，GUI 應用程式不會自動繼承 shell 環境變數。你也可以透過 defaults 啟用 Nix 模式：

```bash
defaults write com.clawdbot.mac clawdbot.nixMode -bool true
```

### 配置和狀態路徑

在 Nix 模式下，明確設定這些環境變數：

- `CLAWDBOT_STATE_DIR`（預設：`~/.clawdbot`）
- `CLAWDBOT_CONFIG_PATH`（預設：`$CLAWDBOT_STATE_DIR/clawdbot.json`）

這樣執行時狀態和配置會保持在 Nix 管理的不可變儲存之外。

---

## Fly.io 雲端部署

**適合**：需要雲端 24/7 執行、簡化維運、自動 HTTPS

### 你需要什麼

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
- Fly.io 帳戶（免費方案可用）
- 模型認證：Anthropic API Key（或其他提供商 Key）
- 頻道憑證：Discord bot token、Telegram token 等

### 第一步：建立 Fly 應用程式

```bash
# 複製倉庫
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# 建立新 Fly 應用程式（選擇你自己的名稱）
fly apps create my-clawdbot

# 建立持久化卷（1GB 通常足夠）
fly volumes create clawdbot_data --size 1 --region iad
```

::: tip 地區選擇
選擇離你最近的地區。常見選項：
- `lhr`（倫敦）
- `iad`（維吉尼亞）
- `sjc`（聖荷西）
:::

### 第二步：配置 fly.toml

編輯 `fly.toml` 以符合你的應用程式名稱和需求。

::: warning 安全說明
預設配置會暴露公開 URL。對於沒有公開 IP 的加固部署，見 [Private Deployment](#私有部署加固)，或使用 `fly.private.toml`。
:::

```toml
app = "my-clawdbot"  # 你的應用程式名稱
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

**關鍵設定說明**：

| 設定 | 原因 |
| --- | --- |
| `--bind lan` | 繫結到 `0.0.0.0`，讓 Fly 的代理可以存取 Gateway |
| `--allow-unconfigured` | 在沒有配置檔的情況下啟動（你會在之後建立） |
| `internal_port = 3000` | 必須符合 `--port 3000`（或 `CLAWDBOT_GATEWAY_PORT`）用於 Fly 健康檢查 |
| `memory = "2048mb"` | 512MB 太小；推薦 2GB |
| `CLAWDBOT_STATE_DIR = "/data"` | 在卷上持久化狀態 |

### 第三步：設定 secrets

```bash
# 必需：Gateway token（用於非 loopback 繫結）
fly secrets set CLAWDBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)

# 模型提供商 API Keys
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# 頻道 tokens
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

::: tip 安全建議
非 loopback 繫結（`--bind lan`）需要 `CLAWDBOT_GATEWAY_TOKEN` 以保證安全。將這些 token 視為密碼。對於所有 API keys 和 tokens，優先使用環境變數而不是配置檔，這樣可以防止憑證暴露到 `clawdbot.json` 中。
:::

### 第四步：部署

```bash
fly deploy
```

首次部署會建置 Docker 映像檔（約 2-3 分鐘）。後續部署會更快。

部署後，驗證：

```bash
fly status
fly logs
```

你應該看到：

```
[gateway] listening on ws://0.0.0.0:3000 (PID xxx)
[discord] logged in to discord as xxx
```

### 第五步：建立配置檔

SSH 進入機器建立配置檔：

```bash
fly ssh console
```

建立配置目錄和檔案：

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

重新啟動以套用配置：

```bash
exit
fly machine restart <machine-id>
```

### 第六步：存取 Gateway

**Control UI**：

```bash
fly open
```

或存取：`https://my-clawdbot.fly.dev/`

貼上你的 Gateway token（來自 `CLAWDBOT_GATEWAY_TOKEN`）以進行身份驗證。

**日誌**：

```bash
fly logs              # 即時日誌
fly logs --no-tail    # 最近日誌
```

**SSH 主控台**：

```bash
fly ssh console
```

### 故障排除

**"App is not listening on expected address"**：

Gateway 正在繫結到 `127.0.0.1` 而不是 `0.0.0.0`。

**修復**：在 `fly.toml` 的程序命令中新增 `--bind lan`。

**健康檢查失敗 / 連線被拒絕**：

Fly 無法在配置的連接埠上存取 Gateway。

**修復**：確保 `internal_port` 符合 Gateway 連接埠（設定 `--port 3000` 或 `CLAWDBOT_GATEWAY_PORT=3000`）。

**OOM / 記憶體問題**：

容器持續重新啟動或被終止。跡象：`SIGABRT`、`v8::internal::Runtime_AllocateInYoungGeneration` 或靜默重新啟動。

**修復**：在 `fly.toml` 中增加記憶體：

```toml
[[vm]]
  memory = "2048mb"
```

或更新現有機器：

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

**注意**：512MB 太小。1GB 可能可以但負載或詳細日誌下可能 OOM。**推薦 2GB**。

**Gateway Lock 問題**：

Gateway 拒絕啟動，提示"already running"錯誤。

這發生在容器重新啟動但 PID lock 檔案在卷上持久化時。

**修復**：刪除 lock 檔案：

```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

Lock 檔案位於 `/data/gateway.*.lock`（不在子目錄中）。

### 私有部署（加固）

預設情況下，Fly.io 分配公開 IP，使你的 Gateway 在 `https://your-app.fly.dev` 可存取。這很方便，但也意味著你的部署可以被網際網路掃描器發現（Shodan、Censys 等）。

**使用私有範本**實現沒有公開暴露的加固部署：

::: info 私有部署情境
- 你只進行**出站**呼叫/訊息（沒有入站 webhooks）
- 你使用 **ngrok 或 Tailscale** 通道作為任何 webhook 回呼
- 你透過 **SSH、代理或 WireGuard** 而不是瀏覽器存取 Gateway
- 你希望部署**從網際網路掃描器隱藏**
:::

**設定**：

使用 `fly.private.toml` 而不是標準配置：

```bash
# 使用私有配置部署
fly deploy -c fly.private.toml
```

或轉換現有部署：

```bash
# 列出目前 IP
fly ips list -a my-clawdbot

# 釋放公開 IP
fly ips release <public-ipv4> -a my-clawdbot
fly ips release <public-ipv6> -a my-clawdbot

# 切換到私有配置，以便未來部署不會重新分配公開 IP
fly deploy -c fly.private.toml

# 僅分配私有 IPv6
fly ips allocate-v6 --private -a my-clawdbot
```

**存取私有部署**：

由於沒有公開 URL，使用以下方法之一：

**選項 1：本機代理（最簡單）**

```bash
# 將本機連接埠 3000 轉發到應用程式
fly proxy 3000:3000 -a my-clawdbot

# 然後在瀏覽器中開啟 http://localhost:3000
```

**選項 2：WireGuard VPN**

```bash
# 建立 WireGuard 配置（一次性）
fly wireguard create

# 匯入到 WireGuard 用戶端，然後透過內部 IPv6 存取
# 範例：http://[fdaa:x:x:x:x::x]:3000
```

**選項 3：僅 SSH**

```bash
fly ssh console -a my-clawdbot
```

### 成本

使用推薦的配置（`shared-cpu-2x`、2GB RAM）：
- 根據使用情況約為 $10-15/月
- 免費方案包含一些配額

詳見：[Fly.io 定價](https://fly.io/docs/about/pricing/)

---

## Hetzner VPS 部署

**適合**：自有 VPS、完全控制、低成本 24/7 執行

### 目標

在 Hetzner VPS 上使用 Docker 執行持久的 Clawdbot Gateway，具有持久化狀態、內建二進位檔和安全的重新啟動行為。

如果你想要「Clawdbot 24/7，約 $5/月」，這是最簡單可靠的設定。

### 你需要什麼

- Hetzner VPS，具有 root 存取權限
- 從你的筆記型電腦進行 SSH 存取
- 基本 SSH + 複製/貼上熟練度
- 大約 20 分鐘
- Docker 和 Docker Compose
- 模型認證憑證
- 選用提供商憑證（WhatsApp QR、Telegram bot token、Gmail OAuth）

### 第一步：配置 VPS

在 Hetzner 中建立 Ubuntu 或 Debian VPS。

以 root 身份連線：

```bash
ssh root@YOUR_VPS_IP
```

本指南假設 VPS 是有狀態的。不要將其視為一次性基礎設施。

### 第二步：在 VPS 上安裝 Docker

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

驗證：

```bash
docker --version
docker compose version
```

### 第三步：複製 Clawdbot 倉庫

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

本指南假設你將建置自訂映像檔以保證二進位檔持久化。

### 第四步：建立持久化主機目錄

Docker 容器是臨時的。所有長期執行的狀態必須存在於主機上。

```bash
mkdir -p /root/.clawdbot
mkdir -p /root/clawd

# 將所有權設定為容器使用者 (uid 1000)：
chown -R 1000:1000 /root/.clawdbot
chown -R 1000:1000 /root/clawd
```

### 第五步：配置環境變數

在倉庫根目錄中建立 `.env`。

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

產生強 secrets：

```bash
openssl rand -hex 32
```

::: warning 不要提交這個檔案
將 `.env` 新增到 `.gitignore`。
:::

### 第六步：Docker Compose 配置

建立或更新 `docker-compose.yml`。

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
      # 推薦：在 VPS 上保持 Gateway 僅 loopback；透過 SSH 通道存取。
      # 要公開暴露，移除 `127.0.0.1:` 前綴並相應配置防火牆。
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"
      # 選用：僅當你針對此 VPS 執行 iOS/Android 節點並需要 Canvas 主機時。
      # 如果你公開暴露此連接埠，閱讀 /gateway/security 並相應配置防火牆。
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

### 第七步：將所需二進位檔烘焙到映像檔（關鍵）

在執行中的容器中安裝二進位檔是一個陷阱。執行時安裝的任何內容在重新啟動時都會遺失。

技能需要的所有外部二進位檔必須在映像檔建置時安裝。

以下範例僅顯示三個常見二進位檔：
- `gog` 用於 Gmail 存取
- `goplaces` 用於 Google Places
- `wacli` 用於 WhatsApp

這些是範例，不是完整清單。你可以根據需要使用相同模式安裝盡可能多的二進位檔。

如果你以後新增依賴於額外二進位檔的新技能，必須：

1. 更新 Dockerfile
2. 重新建置映像檔
3. 重新啟動容器

**範例 Dockerfile**：

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# 範例二進位檔 1：Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin

# 範例二進位檔 2：Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin

# 範例二進位檔 3：WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
| tar -xz -C /usr/local/bin

# 使用相同模式在下面新增更多二進位檔

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

### 第八步：建置和啟動

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

驗證二進位檔：

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

預期輸出：

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### 第九步：驗證 Gateway

```bash
docker compose logs -f clawdbot-gateway
```

成功：

```
[gateway] listening on ws://0.0.0.0:18789
```

從你的筆記型電腦：

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

開啟：

`http://127.0.0.1:18789/`

貼上你的 Gateway token。

### 狀態持久化位置（真相來源）

Clawdbot 在 Docker 中執行，但 Docker 不是真相來源。

所有長期執行的狀態必須在重新啟動、重建和重新啟動後保持存活。

| 元件 | 位置 | 持久化機制 | 備註 |
| --- | --- | --- | --- |
| Gateway config | `/home/node/.clawdbot/` | 主機卷掛載 | 包括 `clawdbot.json`、tokens |
| Model auth profiles | `/home/node/.clawdbot/` | 主機卷掛載 | OAuth tokens、API keys |
| Skill configs | `/home/node/.clawdbot/skills/` | 主機卷掛載 | 技能級狀態 |
| Agent workspace | `/home/node/clawd/` | 主機卷掛載 | 程式碼和 agent 產出物 |
| WhatsApp session | `/home/node/.clawdbot/` | 主機卷掛載 | 保留 QR 登入 |
| Gmail keyring | `/home/node/.clawdbot/` | 主機卷 + 密碼 | 需要 `GOG_KEYRING_PASSWORD` |
| External binaries | `/usr/local/bin/` | Docker 映像檔 | 必須在建置時烘焙 |
| Node runtime | 容器檔案系統 | Docker 映像檔 | 每次映像檔建置時重新建置 |
| OS packages | 容器檔案系統 | Docker 映像檔 | 不要在執行時安裝 |
| Docker container | 臨時 | 可重新啟動 | 安全銷毀 |

---

## exe.dev 部署

**適合**：便宜的 Linux 主機、遠端存取、無需自己配置 VPS

### 目標

在 exe.dev VM 上執行 Clawdbot Gateway，可以從你的筆記型電腦透過以下方式存取：
- **exe.dev HTTPS 代理**（簡單，無需通道）
- **SSH 通道**（最安全；僅 loopback Gateway）

本指南假設 **Ubuntu/Debian**。如果你選擇了不同的發行版，相應對應套件。如果你在任何其他 Linux VPS 上，同樣的步驟適用——你只是不會使用 exe.dev 代理命令。

### 你需要什麼

- exe.dev 帳戶 + 可以在你的筆記型電腦上執行的 `ssh exe.dev`
- SSH keys 設定（你的筆記型電腦 → exe.dev）
- 你要使用的模型認證（OAuth 或 API key）
- 選用提供商憑證（WhatsApp QR 掃描、Telegram bot token、Discord bot token 等）

### 第一步：建立 VM

從你的筆記型電腦：

```bash
ssh exe.dev new --name=clawdbot
```

然後連線：

```bash
ssh clawdbot.exe.xyz
```

::: tip 保持 VM 有狀態
保持此 VM **有狀態**。Clawdbot 在 `~/.clawdbot/` 和 `~/clawd/` 下儲存狀態。
:::

### 第二步：在 VM 上安裝前置條件

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

安裝 Node **≥ 22.12**（任何方法都可以）。快速檢查：

```bash
node -v
```

如果 VM 上還沒有 Node 22，使用你偏好的 Node 管理器或提供 Node 22+ 的發行版套件來源。

### 第三步：安裝 Clawdbot

在伺服器上推薦使用 npm 全域安裝：

```bash
npm i -g clawdbot@latest
clawdbot --version
```

如果原生相依套件安裝失敗（很少見；通常是 `sharp`），新增建置工具：

```bash
sudo apt-get install -y build-essential python3
```

### 第四步：首次設定（引導精靈）

在 VM 上執行 onboarding 引導精靈：

```bash
clawdbot onboard --install-daemon
```

它可以設定：
- `~/clawd` 工作區引導
- `~/.clawdbot/clawdbot.json` 配置
- 模型認證 profiles
- 模型提供商配置/登入
- Linux systemd **user** 服務（service）

如果你在無頭 VM 上進行 OAuth，首先在正常機器上進行 OAuth，然後將認證 profile 複製到 VM（見[說明](https://docs.clawd.bot/help/)）。

### 第五步：遠端存取選項

#### 選項 A（推薦）：SSH 通道（僅 loopback）

保持 Gateway 在 loopback（預設）並從你的筆記型電腦通道路由它：

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

在本機開啟：

- `http://127.0.0.1:18789/`（Control UI）

詳見：[遠端存取](https://docs.clawd.bot/gateway/remote)

#### 選項 B：exe.dev HTTPS 代理（無需通道）

要讓 exe.dev 將流量代理到 VM，將 Gateway 繫結到 LAN 介面並設定 token：

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

對於服務執行，將其持久化到 `~/.clawdbot/clawdbot.json`：

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

::: info 重要說明
非 loopback 繫結需要 `gateway.auth.token`（或 `CLAWDBOT_GATEWAY_TOKEN`）。`gateway.remote.token` 僅用於遠端 CLI 呼叫；它不會啟用本機認證。
:::

然後在 exe.dev 上將代理指向你選擇的連接埠（本範例中為 `8080`，或任何你選擇的連接埠），並開啟你的 VM 的 HTTPS URL：

```bash
ssh exe.dev share port clawdbot 8080
```

開啟：

`https://clawdbot.exe.xyz/`

在 Control UI 中，貼上 token（UI → 設定 → token）。UI 將其作為 `connect.params.auth.token` 傳送。

::: tip 代理連接埠
如果代理期望應用程式連接埠，優先使用**非預設**連接埠（如 `8080`）。將 token 視為密碼。
:::

### 第六步：保持執行（服務）

在 Linux 上，Clawdbot 使用 systemd **user** 服務。`--install-daemon` 後，驗證：

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

如果服務在登出後終止，啟用 lingering：

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

詳見：[更新](https://docs.clawd.bot/install/updating)

---

## 選擇建議

### 根據使用情境選擇

| 情境 | 推薦部署 | 原因 |
| --- | --- | --- |
| **個人使用、快速上手** | 本機安裝 | 最簡單，無需基礎設施 |
| **多裝置存取、偶爾關閉** | Fly.io | 24/7 上線，可從任何地方存取 |
| **完全控制、自有基礎設施** | Hetzner VPS | 完全控制、持久化狀態、低成本 |
| **低成本、不想管理 VPS** | exe.dev | 廉價主機、快速設定 |
| **需要可重現、快速回滾** | Nix | 宣告式配置、版本固定 |
| **測試、隔離環境** | Docker | 易於重建、測試隔離 |

### 安全最佳實踐

無論選擇哪種部署方式，都應遵循以下安全原則：

::: warning 認證和存取控制
- 始終為 Gateway 設定 token 或密碼認證（非 loopback 繫結時）
- 使用環境變數儲存敏感憑證（API keys、tokens）
- 對於雲端部署，避免公開暴露或使用私有網路
:::

::: tip 狀態持久化
- 對於容器化部署，確保配置和工作區正確掛載到主機卷
- 對於 VPS 部署，定期備份 `~/.clawdbot/` 和 `~/clawd/` 目錄
:::

### 監控和日誌

- 定期檢查 Gateway 狀態：`clawdbot doctor`
- 配置日誌輪替以避免磁碟空間耗盡
- 使用健康檢查端點驗證服務可用性

---

## 檢查點 ✅

**本機安裝驗證**：

```bash
clawdbot --version
clawdbot health
```

你應該看到 Gateway 正在監聽的訊息。

**Docker 驗證**：

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

容器狀態應該是 `Up`，日誌應顯示 `[gateway] listening on ws://...`。

**Nix 驗證**：

```bash
# 檢查服務狀態
systemctl --user status clawdbot-gateway

# 檢查 Nix 模式
defaults read com.clawdbot.mac clawdbot.nixMode
```

**雲端部署驗證**：

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

你應該能夠透過瀏覽器存取 Control UI 或透過 SSH 通道。

---

## 踩坑提醒

::: warning Docker 常見問題
- **掛載路徑錯誤**：確保主機路徑在 Docker Desktop 共享中
- **連接埠衝突**：檢查 18789 連接埠是否被佔用
- **權限問題**：容器使用者 (uid 1000) 需要對掛載卷的讀寫權限
:::

::: warning 雲端部署問題
- **OOM 錯誤**：增加記憶體分配（至少 2GB）
- **Gateway Lock**：刪除 `/data/gateway.*.lock` 檔案後重新啟動容器
- **健康檢查失敗**：確保 `internal_port` 與 Gateway 連接埠符合
:::

::: tip 二進位檔持久化（Hetzner）
不要在執行時安裝相依套件！所有技能需要的二進位檔必須烘焙到 Docker 映像檔中，否則容器重新啟動後會遺失。
:::

---

## 本課小結

本課介紹了 Clawdbot 的多種部署方式：

1. **本機安裝**：最簡單快速，適合個人使用和開發
2. **Docker 部署**：隔離環境、易於重建、支援沙箱
3. **Nix 部署**：宣告式配置、可重現、快速回滾
4. **Fly.io**：雲端平台、自動 HTTPS、24/7 上線
5. **Hetzner VPS**：自有 VPS、完全控制、持久化狀態
6. **exe.dev**：廉價主機、快速設定、簡化維運

選擇部署方式時，考慮你的使用情境、技術能力和維運需求。確保狀態持久化和安全配置是成功部署的關鍵。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能/章節 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Docker 部署腳本 | [`docker-setup.sh`](https://github.com/moltbot/moltbot/blob/main/docker-setup.sh) | 全文 |
| Docker 映像檔定義 | [`Dockerfile`](https://github.com/moltbot/moltbot/blob/main/Dockerfile) | 全文 |
| Docker Compose 配置 | [`docker-compose.yml`](https://github.com/moltbot/moltbot/blob/main/docker-compose.yml) | 全文 |
| Fly.io 配置 | [`fly.toml`](https://github.com/moltbot/moltbot/blob/main/fly.toml) | 全文 |
| Fly 私有配置 | [`fly.private.toml`](https://github.com/moltbot/moltbot/blob/main/fly.private.toml) | 全文 |
| Docker 沙箱映像檔 | [`Dockerfile.sandbox`](https://github.com/moltbot/moltbot/blob/main/Dockerfile.sandbox) | 全文 |
| Nix 整合 | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| 安裝腳本 | [`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) | 全文 |

**關鍵配置檔**：
- `~/.clawdbot/clawdbot.json`：主配置檔
- `~/.clawdbot/`：狀態目錄（sessions、tokens、auth profiles）
- `~/clawd/`：工作區目錄

**關鍵環境變數**：
- `CLAWDBOT_GATEWAY_TOKEN`：Gateway 認證 token
- `CLAWDBOT_STATE_DIR`：狀態目錄路徑
- `CLAWDBOT_CONFIG_PATH`：配置檔路徑
- `CLAWDBOT_NIX_MODE`：啟用 Nix 模式

**關鍵腳本**：
- `scripts/sandbox-setup.sh`：建置預設沙箱映像檔
- `scripts/sandbox-common-setup.sh`：建置通用沙箱映像檔
- `scripts/sandbox-browser-setup.sh`：建置瀏覽器沙箱映像檔

**Docker 環境變數**（.env）：
- `CLAWDBOT_IMAGE`：要使用的映像檔名稱
- `CLAWDBOT_GATEWAY_BIND`：繫結模式（lan/auto）
- `CLAWDBOT_GATEWAY_PORT`：Gateway 連接埠
- `CLAWDBOT_CONFIG_DIR`：配置目錄掛載
- `CLAWDBOT_WORKSPACE_DIR`：工作區掛載
- `GOG_KEYRING_PASSWORD`：Gmail keyring 密碼
- `XDG_CONFIG_HOME`：XDG 配置目錄

**Fly.io 環境變數**：
- `NODE_ENV`：執行時環境（production）
- `CLAWDBOT_PREFER_PNPM`：使用 pnpm
- `CLAWDBOT_STATE_DIR`：持久化狀態目錄
- `NODE_OPTIONS`：Node.js 執行時選項

</details>
