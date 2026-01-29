---
title: "故障排除：解決 Gateway 啟動、渠道連接、認證錯誤等問題 | Clawdbot 教程"
sidebarTitle: "出問題了怎麼辦"
subtitle: "故障排除：解決常見問題"
description: "學習如何解決 Clawdbot 的常見問題，包括 Gateway 啟動失敗、渠道連接問題、認證錯誤、工具調用失敗、會話管理和性能優化等全面排查指南。"
tags:
  - "故障排除"
  - "診斷"
  - "常見問題"
prerequisite: []
order: 310
---

# 故障排除：解決常見問題

Clawdbot 出問題了？別慌，這裡有系統的**故障排除**方法。本教程幫你快速定位問題並找到解決方案。

## 學完你能做什麼

- 快速診斷 Gateway 和系統狀態
- 識別並解決 Gateway 啟動失敗、渠道連接問題
- 修復認證和模型配置錯誤
- 解決工具調用失敗和性能問題

## 首次排查：60 秒速檢

遇到問題時，按順序執行這些命令，通常能快速定位問題根因：

```bash
# 1. 檢查整體狀態
clawdbot status

# 2. 深度診斷（包含配置、運行狀態、日誌）
clawdbot status --all

# 3. 探測 Gateway 連通性
clawdbot gateway probe

# 4. 實時查看日誌
clawdbot logs --follow

# 5. 運行診斷檢查
clawdbot doctor
```

如果 Gateway 可連接，需要深度探測：

```bash
clawdbot status --deep
```

::: tip 命令說明
| 命令 | 功能 | 使用場景 |
|--- | --- | ---|
| `clawdbot status` | 本地摘要：系統資訊、Gateway 連接、服務狀態、Agent 狀態、提供商配置 | 首次檢查，快速概覽 |
| `clawdbot status --all` | 完整診斷（唯讀、可分享、相對安全），包含日誌尾部 | 需要分享調試報告時 |
| `clawdbot status --deep` | 運行 Gateway 健康檢查（包括提供商探測，需要可連接的 Gateway） | "已配置"但不等於"工作"時 |
| `clawdbot gateway probe` | Gateway 發現 + 連通性（本地 + 遠程目標） | 懷疑探測了錯誤的 Gateway |
| `clawdbot channels status --probe` | 請求運行中的 Gateway 獲取渠道狀態（可選探測） | Gateway 可達但渠道異常 |
| `clawdbot gateway status` | Supervisor 狀態（launchd/systemd/schtasks）、運行時 PID/退出、最後的 Gateway 錯誤 | 服務"看起來加載了"但什麼都沒運行 |
:::

::: warning 分享輸出時
- 優先使用 `clawdbot status --all`（會自動脫敏 token）
- 如果必須粘貼 `clawdbot status`，先設置 `CLAWDBOT_SHOW_SECRETS=0`（隱藏 token 預覽）
:::

## 常見問題排查

### Gateway 相關問題

#### "clawdbot: command not found"

**症狀**：終端提示命令未找到。

**原因**：幾乎總是 Node/npm PATH 問題。

**解決方案**：

```bash
# 1. 驗證 Node.js 是否安裝
node --version  # 需要 ≥22

# 2. 驗證 npm/pnpm 是否可用
npm --version
# 或
pnpm --version

# 3. 檢查全域安裝路徑
which clawdbot
npm list -g --depth=0 | grep clawdbot
```

如果命令未找到：

```bash
# 重新安裝
npm install -g clawdbot@latest
# 或
pnpm add -g clawdbot@latest
```

**相關文檔**：[快速開始](../../start/getting-started/)

---

#### Gateway 啟動失敗："configuration invalid" / "set gateway.mode=local"

**症狀**：Gateway 拒絕啟動，提示配置無效或未設置運行模式。

**原因**：配置文件存在但 `gateway.mode` 未設置（或不是 `local`），Gateway 拒絕啟動。

**解決方案**（推薦）：

```bash
# 運行精靈並設置 Gateway 運行模式為 Local
clawdbot configure
```

或直接設置：

```bash
clawdbot config set gateway.mode local
```

如果你打算運行**遠程 Gateway**：

```bash
clawdbot config set gateway.mode remote
clawdbot config set gateway.remote.url "wss://gateway.example.com"
```

::: info 臨時調試模式
Ad-hoc/開發場景：傳遞 `--allow-unconfigured` 啟動 Gateway（不要求 `gateway.mode=local`）
:::

如果還沒配置文件：

```bash
clawdbot setup  # 創建初始配置，然後重啟 Gateway
```

---

#### Gateway "unauthorized"，無法連接，或不斷重連

**症狀**：CLI 提示未授權，無法連接 Gateway，或反復重連。

**原因**：認證配置錯誤或缺失。

**檢查步驟**：

```bash
# 1. 檢查 Gateway 狀態
clawdbot gateway status

# 2. 查看日誌
clawdbot logs --follow
```

**解決方案**：

1. 檢查 `gateway.auth.mode` 配置（可選值：`token`/`password`/`tailscale`）
2. 如果是 `token` 模式：
   ```bash
   clawdbot config get gateway.auth.token
   ```
3. 如果是 `password` 模式，確認密碼正確
4. 如果是非 loopback 綁定（`lan`/`tailnet`/`custom`），必須配置 `gateway.auth.token`

::: warning 綁定模式與認證
- Loopback（預設）：通常不需要認證
- LAN/Tailnet/Custom：必須配置 `gateway.auth.token` 或 `CLAWDBOT_GATEWAY_TOKEN`
- `gateway.remote.token` 僅用於遠程 CLI 調用，不啟用本地認證
- 忽略的字段：`gateway.token`（請用 `gateway.auth.token`）
:::

---

#### 服務顯示運行但端口未監聽

**症狀**：`clawdbot gateway status` 顯示 `Runtime: running`，但端口 `18789` 未監聽。

**原因**：Gateway 拒絕綁定或配置不匹配。

**檢查清單**：

```bash
# 1. 檢查 Gateway 狀態
clawdbot gateway status

# 2. 查看最後的 Gateway 錯誤
clawdbot gateway status | grep "error\|Error\|refusing"

# 3. 檢查端口佔用
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

**常見原因和修復**：

1. **端口已被佔用**：
   ```bash
   # 查看佔用進程
   lsof -nP -iTCP:18789 -sTCP:LISTEN
   
   # 停止服務或更換端口
   clawdbot config set gateway.port 18790
   ```

2. **配置不匹配**：
   - CLI 配置和 Service 配置不一致
   - 修復：從相同 `--profile` / `CLAWDBOT_STATE_DIR` 重新安裝
   ```bash
   clawdbot gateway install --force
   ```

3. **非 loopback 綁定缺少認證**：
   - 日誌顯示："refusing to bind … without auth"
   - 修復：設置 `gateway.auth.mode` + `gateway.auth.token`

4. **Tailnet 綁定失敗**：
   - 日誌顯示："no tailnet interface was found"
   - 修復：啟動 Tailscale 或更改 `gateway.bind` 為 `loopback`/`lan`

---

#### Gateway "啟動被阻塞：set gateway.mode=local"

**症狀**：配置存在但啟動被阻止。

**原因**：`gateway.mode` 未設置為 `local`（或未設置）。

**解決方案**：

```bash
# 方案 1：運行配置精靈
clawdbot configure

# 方案 2：直接設置
clawdbot config set gateway.mode local

# 方案 3：臨時允許未配置啟動（僅限開發）
clawdbot gateway --allow-unconfigured
```

---

### 模型和認證問題

#### "No API key found for provider 'anthropic'"

**症狀**：Agent 提示找不到提供商的 API 密鑰。

**原因**：Agent 的認證存儲為空或缺少 Anthropic 憑證。認證是**每個 Agent 獨立**的，新 Agent 不會繼承主 Agent 的密鑰。

**解決方案**：

**選項 1**：重新運行 onboarding 並為該 Agent 選擇 **Anthropic**

```bash
clawdbot configure
```

**選項 2**：在 **Gateway 主機**粘貼 setup-token：

```bash
clawdbot models auth setup-token --provider anthropic
```

**選項 3**：復制 `auth-profiles.json` 從主 Agent 目錄到新 Agent 目錄

**驗證**：

```bash
clawdbot models status
```

**相關文檔**：[AI 模型與認證配置](../../advanced/models-auth/)

---

#### OAuth token refresh failed（Anthropic Claude 訂閱）

**症狀**：存儲的 Anthropic OAuth token 過期，刷新失敗。

**原因**：存儲的 OAuth token 已過期且刷新失敗。如果你使用 Claude 訂閱（無 API Key），最可靠的修復是切換到 **Claude Code setup-token** 或在 **Gateway 主機**重新同步 Claude Code CLI OAuth。

**解決方案（推薦 - setup-token）**：

```bash
# 在 Gateway 主機運行（執行 Claude Code CLI）
clawdbot models auth setup-token --provider anthropic
clawdbot models status
```

如果你在其他地方生成了 token：

```bash
clawdbot models auth paste-token --provider anthropic
clawdbot models status
```

**如果想要保持 OAuth 復用**：
在 Gateway 主機通過 Claude Code CLI 登錄，然後運行 `clawdbot models status` 同步刷新的 token 到 Clawdbot 的認證存儲。

---

#### "/model" 提示 "model not allowed"

**症狀**：切換模型時提示模型不被允許。

**原因**：通常意味著 `agents.defaults.models` 配置為 allowlist（白名單）。當它非空時，只能選擇那些 provider/model 密鑰。

**解決方案**：

```bash
# 1. 檢查 allowlist
clawdbot config get agents.defaults.models

# 2. 添加你想要的模型（或清空 allowlist）
clawdbot config set agents.defaults.models []
# 或
clawdbot config set agents.defaults.models '["anthropic/claude-sonnet-4-20250514"]'

# 3. 重試 /model 命令
```

使用 `/models` 瀏覽允許的提供商/模型。

---

#### "All models failed" — 該先檢查什麼？

**檢查清單**：

1. **憑證存在**：確認提供商的認證配置（auth profiles + 環境變量）
2. **模型路由**：確認 `agents.defaults.model.primary` 和 fallback 指向你可以訪問的模型
3. **Gateway 日誌**：`/tmp/clawdbot/...` 中查找確切的提供商錯誤
4. **模型狀態**：使用 `/model status`（聊天）或 `clawdbot models status`（CLI）

**詳細命令**：

```bash
# 查看所有模型狀態
clawdbot models status

# 測試特定模型
clawdbot models scan

# 查看詳細日誌
clawdbot logs --follow | grep -i "model\|anthropic\|openai"
```

---

### 渠道連接問題

#### 消息未觸發

**症狀**：在渠道發送消息，但 Agent 無響應。

**檢查 1**：發送者是否在白名單？

```bash
clawdbot status
# 查看輸出中的 "AllowFrom: ..."
```

**檢查 2**：群聊是否需要提及？

群組消息需要 `@mention` 或命令觸發。查看配置：

```bash
# 檢查全域或特定渠道的提及模式
grep -E "agents\|groupChat\|mentionPatterns" \
  "${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}"
```

**檢查 3**：查看日誌

```bash
clawdbot logs --follow
# 或快速過濾：
tail -f "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | grep "blocked\|skip\|unauthorized"
```

**相關文檔**：[DM 配對與訪問控制](../../start/pairing-approval/)

---

#### 配對代碼未到達

**症狀**：`dmPolicy` 為 `pairing` 時，未知發送者應該收到代碼，但消息被忽略直到批准。

**檢查 1**：是否已有等待的請求？

```bash
clawdbot pairing list <channel>
```

::: info 配對請求限制
默認情況下，每個渠道最多有 **3 個待處理的 DM 配對請求**。如果列表已滿，新請求不會生成代碼，直到一個被批准或過期。
:::

**檢查 2**：請求是否創建但沒有發送回覆？

```bash
clawdbot logs --follow | grep "pairing request"
```

**檢查 3**：確認 `dmPolicy` 不是 `open`/`allowlist`

---

#### WhatsApp 斷開連接

**症狀**：WhatsApp 頻繁斷開或無法連接。

**診斷步驟**：

```bash
# 1. 檢查本地狀態（憑證、會話、隊列事件）
clawdbot status

# 2. 探測運行中的 Gateway + 渠道（WA 連接 + Telegram + Discord APIs）
clawdbot status --deep

# 3. 查看最近的連接事件
clawdbot logs --limit 200 | grep -i "connection\|disconnect\|logout"
```

**解決方案**：

通常一旦 Gateway 運行會自動重連。如果卡住：

```bash
# 重啟 Gateway 進程（無論你如何監督它）
clawdbot gateway restart

# 或手動運行並查看詳細輸出
clawdbot gateway --verbose
```

如果已登出/取消鏈接：

```bash
# 重新登錄並掃描 QR 碼
clawdbot channels login --verbose

# 如果登出無法清除所有內容，手動刪除憑證
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}/credentials"
```

---

### 媒體發送失敗

**症狀**：發送圖片、音頻、視頻或文件時失敗。

**檢查 1**：文件路徑是否有效？

```bash
ls -la /path/to/your/image.jpg
```

**檢查 2**：文件是否過大？

- 圖片：最大 **6MB**
- 音頻/視頻：最大 **16MB**
- 文檔：最大 **100MB**

**檢查 3**：查看媒體日誌

```bash
grep "media\|fetch\|download" \
  "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | tail -20
```

---

### 工具執行問題

#### "Agent was aborted"

**症狀**：Agent 中途停止響應。

**原因**：Agent 被中斷。

**可能原因**：
- 用戶發送了 `stop`、`abort`、`esc`、`wait`、`exit`
- 超時超出
- 進程崩潰

**解決方案**：只需發送另一條消息，會話繼續。

---

#### "Agent failed before reply: Unknown model: anthropic/claude-haiku-3-5"

**症狀**：模型被拒絕。

**原因**：Clawdbot 拒絕**較舊/不安全的模型**（尤其是那些更容易受到提示注入攻擊的）。如果你看到此錯誤，模型名稱不再被支持。

**解決方案**：

1. 選擇提供商的**最新**模型，並更新配置或模型別名
2. 如果你不確定哪些模型可用，運行：
   ```bash
   clawdbot models list
   # 或
   clawdbot models scan
   ```
3. 選擇支持的模型

**相關文檔**：[AI 模型與認證配置](../../advanced/models-auth/)

---

#### Skill 在 sandbox 中缺少 API 密鑰

**症狀**：Skill 在主機上正常工作，但在 sandbox 中失敗，提示缺少 API 密鑰。

**原因**：sandboxed exec 在 Docker 內運行，**不**繼承主機 `process.env`。

**解決方案**：

```bash
# 設置 sandbox 環境變量
clawdbot config set agents.defaults.sandbox.docker.env '{"API_KEY": "your-key-here"}'

# 或為特定 agent 設置
clawdbot config set agents.list[0].sandbox.docker.env '{"API_KEY": "your-key-here"}'

# 重新創建 sandbox
clawdbot sandbox recreate --agent <agent-id>
# 或所有
clawdbot sandbox recreate --all
```

---

### Control UI 問題

#### Control UI 在 HTTP 上失敗（"device identity required" / "connect failed"）

**症狀**：通過純 HTTP 打開 dashboard（如 `http://<lan-ip>:18789/` 或 `http://<tailscale-ip>:18789/`）時失敗。

**原因**：瀏覽器運行在**不安全上下文**，阻塞 WebCrypto，無法生成設備身份。

**解決方案**：

1. 優先使用 HTTPS（[Tailscale Serve](../../advanced/remote-gateway/)）
2. 或在 Gateway 主機上本地打開：`http://127.0.0.1:18789/`
3. 如果必須使用 HTTP，啟用 `gateway.controlUi.allowInsecureAuth: true` 並使用 Gateway token（僅 token；無設備身份/配對）：
   ```bash
   clawdbot config set gateway.controlUi.allowInsecureAuth true
   ```

**相關文檔**：[遠程 Gateway 與 Tailscale](../../advanced/remote-gateway/)

---

### 會話和性能問題

#### 會話未恢復

**症狀**：會話歷史丟失或無法恢復。

**檢查 1**：會話文件是否存在？

```bash
ls -la ~/.clawdbot/agents/<agentId>/sessions/
```

**檢查 2**：重置窗口是否太短？

```json
{
  "session": {
    "reset": {
      "mode": "daily",
      "atHour": 4,
      "idleMinutes": 10080  // 7 天
    }
  }
}
```

**檢查 3**：是否有人發送了 `/new`、`/reset` 或重置觸發器？

---

#### Agent 超時

**症狀**：長時間任務中途停止。

**原因**：預設超時為 30 分鐘。

**解決方案**：

對於長時間任務：

```json
{
  "reply": {
    "timeoutSeconds": 3600  // 1 小時
  }
}
```

或使用 `process` 工具後台運行長命令。

---

#### 高記憶體使用

**症狀**：Clawdbot 佔用大量記憶體。

**原因**：Clawdbot 將對話歷史保留在記憶體中。

**解決方案**：

定期重啟或設置會話限制：

```json
{
  "session": {
    "historyLimit": 100  // 保留的最大消息數
  }
}
```

---

## 調試模式

### 啟用詳細日誌

```bash
# 1. 在配置中啟用 trace 日誌
# 編輯 ${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}
# 添加：
{
  "logging": {
    "level": "trace"
  }
}

# 2. 運行詳細命令以鏡像調試輸出到 stdout
clawdbot gateway --verbose
clawdbot channels login --verbose
```

::: tip 日誌級別說明
- **Level** 控制文件日誌（持久的 JSONL）
- **consoleLevel** 控制控制台輸出（僅 TTY）
- `--verbose` 僅影響 **控制台**輸出，文件日誌由 `logging.level` 控制
:::

### 日誌位置

| 日誌 | 位置 |
|--- | ---|
| Gateway 文件日誌（結構化） | `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`（或 `logging.file`） |
| Gateway 服務日誌 | macOS: `$CLAWDBOT_STATE_DIR/logs/gateway.log` + `gateway.err.log`<br/>Linux: `journalctl --user -u clawdbot-gateway[-<profile>].service -n 200 --no-pager`<br/>Windows: `schtasks /Query /TN "Clawdbot Gateway (<profile>)" /V /FO LIST` |
| 會話文件 | `$CLAWDBOT_STATE_DIR/agents/<agentId>/sessions/` |
| 媒體緩存 | `$CLAWDBOT_STATE_DIR/media/` |
| 憑證 | `$CLAWDBOT_STATE_DIR/credentials/` |

### 健康檢查

```bash
# Supervisor + 探測目標 + 配置路徑
clawdbot gateway status

# 包含系統級掃描（遺留/額外服務、端口監聽器）
clawdbot gateway status --deep

# Gateway 是否可達？
clawdbot health --json
# 如果失敗，運行並查看連接詳情
clawdbot health --verbose

# 預設端口是否有監聽器？
lsof -nP -iTCP:18789 -sTCP:LISTEN

# 最近活動（RPC 日誌尾部）
clawdbot logs --follow

# 如果 RPC 已關閉的備用方案
tail -20 /tmp/clawdbot/clawdbot-*.log
```

---

## 重置所有配置

::: warning 危險操作
以下操作會刪除所有會話和配置，需要重新配對 WhatsApp
:::

如果問題無法解決，可以考慮完全重置：

```bash
# 1. 停止 Gateway
clawdbot gateway stop

# 2. 如果安裝了服務並想要乾淨安裝：
# clawdbot gateway uninstall

# 3. 刪除狀態目錄
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}"

# 4. 重新登錄 WhatsApp
clawdbot channels login

# 5. 重新啟動 Gateway
clawdbot gateway restart
# 或
clawdbot gateway
```

---

## macOS 特定問題

### 授權時應用崩潰（語音/麥克風）

**症狀**：點擊隱私提示中的"允許"時，應用消失或顯示"Abort trap 6"。

**解決方案 1：重置 TCC 緩存**

```bash
tccutil reset All com.clawdbot.mac.debug
```

**解決方案 2：強制新 Bundle ID**

如果重置無效，更改 [`scripts/package-mac-app.sh`](https://github.com/clawdbot/clawdbot/blob/main/scripts/package-mac-app.sh) 中的 `BUNDLE_ID`（如添加 `.test` 後綴）並重新構建。這會強制 macOS 將其視為新應用。

---

### Gateway 卡在"啟動中..."

**症狀**：應用連接到本地 Gateway 端口 `18789`，但一直卡住。

**解決方案 1：停止 supervisor（推薦）**

如果 Gateway 由 launchd 監督，殺死 PID 只會重啟它。先停止 supervisor：

```bash
# 查看狀態
clawdbot gateway status

# 停止 Gateway
clawdbot gateway stop

# 或使用 launchctl
launchctl bootout gui/$UID/com.clawdbot.gateway
#（如果使用 profile，替換為 com.clawdbot.<profile>）
```

**解決方案 2：端口忙碌（查找監聽器）**

```bash
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

如果是一個未監督的進程，先嘗試優雅停止，然後升級：

```bash
kill -TERM <PID>
sleep 1
kill -9 <PID>  # 最後手段
```

**解決方案 3：檢查 CLI 安裝**

確保全域 `clawdbot` CLI 已安裝並匹配應用版本：

```bash
clawdbot --version
npm install -g clawdbot@<version>
```

---

## 獲取幫助

如果以上方法都無法解決問題：

1. **首先檢查日誌**：`/tmp/clawdbot/`（預設：`clawdbot-YYYY-MM-DD.log`，或你配置的 `logging.file`）
2. **搜索現有 issues**：[GitHub Issues](https://github.com/clawdbot/clawdbot/issues)
3. **打開新 issue**時包含：
   - Clawdbot 版本（`clawdbot --version`）
   - 相關日誌片段
   - 複現步驟
   - 你的配置（**脫敏敏感資訊！**）

---

## 本課小結

故障排查的關鍵步驟：

1. **快速診斷**：使用 `clawdbot status` → `status --all` → `gateway probe`
2. **查看日誌**：`clawdbot logs --follow` 是最直接的訊號來源
3. **針對性修復**：根據症狀查閱對應章節（Gateway/認證/渠道/工具/會話）
4. **深度檢查**：使用 `clawdbot doctor` 和 `status --deep` 獲取系統級診斷
5. **必要重置**：無計可施時使用重置方案，但記住會丟失數據

記住：大多數問題都有明確的原因和解決方案，系統化地排查比盲目嘗試有效。

## 下一課預告

> 下一課我們將學習 **[CLI 命令參考](../cli-commands/)**。
>
> 你會學到：
> - 完整的 CLI 命令列表和用法說明
> - Gateway 管理、Agent 交互、配置管理的所有命令
> - 高效使用命令行的技巧和最佳實踐

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 文件路徑 | 行號 |
|--- | --- | ---|
| 故障排除命令 | [`src/commands/doctor.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/doctor.ts) | 全文 |
| Gateway 健康檢查 | [`src/gateway/server-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-channels.ts) | 93+ |
| 日誌系統 | [`src/logging/index.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/logging/index.ts) | 全文 |
| 認證處理 | [`src/agents/auth-profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles.ts) | 全文 |
| 配置驗證 | [`src/config/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/config.ts) | 全文 |
| 渠道狀態探測 | [`src/cli/commands/channels-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/commands/channels-cli.ts) | 全文 |

**關鍵常量**：
- 預設 Gateway 端口：`18789` - Gateway WebSocket 服務端口
- 預設日誌目錄：`/tmp/clawdbot/` - 日誌文件存儲位置
- 配對請求上限：`3` - 每個渠道的最大待處理配對請求數

**關鍵函數**：
- `doctor()` - 運行診斷檢查並報告問題
- `probeGateway()` - 測試 Gateway 連通性
- `checkAuth()` - 驗證認證配置
- `validateConfig()` - 驗證配置文件完整性

</details>
