---
title: "Solução de Problemas: Resolução de falhas de inicialização do Gateway, problemas de conexão de canais, erros de autenticação | Tutorial do Clawdbot"
sidebarTitle: "O que fazer se houver problemas"
subtitle: "Solução de Problemas: Resolução de problemas comuns"
description: "Aprenda como resolver problemas comuns do Clawdbot, incluindo falhas de inicialização do Gateway, problemas de conexão de canais, erros de autenticação, falhas na invocação de ferramentas, gerenciamento de sessões e otimização de desempenho. Guia completo de solução de problemas."
tags:
  - "Solução de Problemas"
  - "Diagnóstico"
  - "Perguntas Frequentes"
prerequisite: []
order: 310
---
title: "故障排除：解决 Gateway 启动、渠道连接、认证错误等问题 | Clawdbot 教程"
sidebarTitle: "出问题了怎么办"
subtitle: "故障排除：解决常见问题"
description: "学习如何解决 Clawdbot 的常见问题，包括 Gateway 启动失败、渠道连接问题、认证错误、工具调用失败、会话管理和性能优化等全面排查指南。"
tags:
  - "故障排除"
  - "诊断"
  - "常见问题"
prerequisite: []
order: 310
---

# 故障排除：解决常见问题

Clawdbot 出问题了？别慌，这里有系统的**故障排除**方法。本教程帮你快速定位问题并找到解决方案。

## 学完你能做什么

- 快速诊断 Gateway 和系统状态
- 识别并解决 Gateway 启动失败、渠道连接问题
- 修复认证和模型配置错误
- 解决工具调用失败和性能问题

## 首次排查：60 秒速检

遇到问题时，按顺序执行这些命令，通常能快速定位问题根因：

```bash
# 1. 检查整体状态
clawdbot status

# 2. 深度诊断（包含配置、运行状态、日志）
clawdbot status --all

# 3. 探测 Gateway 连通性
clawdbot gateway probe

# 4. 实时查看日志
clawdbot logs --follow

# 5. 运行诊断检查
clawdbot doctor
```

如果 Gateway 可连接，需要深度探测：

```bash
clawdbot status --deep
```

::: tip 命令说明
| 命令 | 功能 | 使用场景 |
| --- | --- | --- |
| `clawdbot status` | 本地摘要：系统信息、Gateway 连接、服务状态、Agent 状态、提供商配置 | 首次检查，快速概览 |
| `clawdbot status --all` | 完整诊断（只读、可分享、相对安全），包含日志尾部 | 需要分享调试报告时 |
| `clawdbot status --deep` | 运行 Gateway 健康检查（包括提供商探测，需要可连接的 Gateway） | "已配置"但不等于"工作"时 |
| `clawdbot gateway probe` | Gateway 发现 + 连通性（本地 + 远程目标） | 怀疑探测了错误的 Gateway |
| `clawdbot channels status --probe` | 请求运行中的 Gateway 获取渠道状态（可选探测） | Gateway 可达但渠道异常 |
| `clawdbot gateway status` | Supervisor 状态（launchd/systemd/schtasks）、运行时 PID/退出、最后的 Gateway 错误 | 服务"看起来加载了"但什么都没运行 |
:::

::: warning 分享输出时
- 优先使用 `clawdbot status --all`（会自动脱敏 token）
- 如果必须粘贴 `clawdbot status`，先设置 `CLAWDBOT_SHOW_SECRETS=0`（隐藏 token 预览）
:::

## 常见问题排查

### Gateway 相关问题

#### "clawdbot: command not found"

**症状**：终端提示命令未找到。

**原因**：几乎总是 Node/npm PATH 问题。

**解决方案**：

```bash
# 1. 验证 Node.js 是否安装
node --version  # 需要 ≥22

# 2. 验证 npm/pnpm 是否可用
npm --version
# 或
pnpm --version

# 3. 检查全局安装路径
which clawdbot
npm list -g --depth=0 | grep clawdbot
```

如果命令未找到：

```bash
# 重新安装
npm install -g clawdbot@latest
# 或
pnpm add -g clawdbot@latest
```

**相关文档**：[快速开始](../../start/getting-started/)

---

#### Gateway 启动失败："configuration invalid" / "set gateway.mode=local"

**症状**：Gateway 拒绝启动，提示配置无效或未设置运行模式。

**原因**：配置文件存在但 `gateway.mode` 未设置（或不是 `local`），Gateway 拒绝启动。

**解决方案**（推荐）：

```bash
# 运行向导并设置 Gateway 运行模式为 Local
clawdbot configure
```

或直接设置：

```bash
clawdbot config set gateway.mode local
```

如果你打算运行**远程 Gateway**：

```bash
clawdbot config set gateway.mode remote
clawdbot config set gateway.remote.url "wss://gateway.example.com"
```

::: info 临时调试模式
Ad-hoc/开发场景：传递 `--allow-unconfigured` 启动 Gateway（不要求 `gateway.mode=local`）
:::

如果还没配置文件：

```bash
clawdbot setup  # 创建初始配置，然后重启 Gateway
```

---

#### Gateway "unauthorized"，无法连接，或不断重连

**症状**：CLI 提示未授权，无法连接 Gateway，或反复重连。

**原因**：认证配置错误或缺失。

**检查步骤**：

```bash
# 1. 检查 Gateway 状态
clawdbot gateway status

# 2. 查看日志
clawdbot logs --follow
```

**解决方案**：

1. 检查 `gateway.auth.mode` 配置（可选值：`token`/`password`/`tailscale`）
2. 如果是 `token` 模式：
   ```bash
   clawdbot config get gateway.auth.token
   ```
3. 如果是 `password` 模式，确认密码正确
4. 如果是非 loopback 绑定（`lan`/`tailnet`/`custom`），必须配置 `gateway.auth.token`

::: warning 绑定模式与认证
- Loopback（默认）：通常不需要认证
- LAN/Tailnet/Custom：必须配置 `gateway.auth.token` 或 `CLAWDBOT_GATEWAY_TOKEN`
- `gateway.remote.token` 仅用于远程 CLI 调用，不启用本地认证
- 忽略的字段：`gateway.token`（请用 `gateway.auth.token`）
:::

---

#### 服务显示运行但端口未监听

**症状**：`clawdbot gateway status` 显示 `Runtime: running`，但端口 `18789` 未监听。

**原因**：Gateway 拒绝绑定或配置不匹配。

**检查清单**：

```bash
# 1. 检查 Gateway 状态
clawdbot gateway status

# 2. 查看最后的 Gateway 错误
clawdbot gateway status | grep "error\|Error\|refusing"

# 3. 检查端口占用
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

**常见原因和修复**：

1. **端口已被占用**：
   ```bash
   # 查看占用进程
   lsof -nP -iTCP:18789 -sTCP:LISTEN
   
   # 停止服务或更换端口
   clawdbot config set gateway.port 18790
   ```

2. **配置不匹配**：
   - CLI 配置和 Service 配置不一致
   - 修复：从相同 `--profile` / `CLAWDBOT_STATE_DIR` 重新安装
   ```bash
   clawdbot gateway install --force
   ```

3. **非 loopback 绑定缺少认证**：
   - 日志显示："refusing to bind … without auth"
   - 修复：设置 `gateway.auth.mode` + `gateway.auth.token`

4. **Tailnet 绑定失败**：
   - 日志显示："no tailnet interface was found"
   - 修复：启动 Tailscale 或更改 `gateway.bind` 为 `loopback`/`lan`

---

#### Gateway "启动被阻塞：set gateway.mode=local"

**症状**：配置存在但启动被阻止。

**原因**：`gateway.mode` 未设置为 `local`（或未设置）。

**解决方案**：

```bash
# 方案 1：运行配置向导
clawdbot configure

# 方案 2：直接设置
clawdbot config set gateway.mode local

# 方案 3：临时允许未配置启动（仅限开发）
clawdbot gateway --allow-unconfigured
```

---

### 模型和认证问题

#### "No API key found for provider 'anthropic'"

**症状**：Agent 提示找不到提供商的 API 密钥。

**原因**：Agent 的认证存储为空或缺少 Anthropic 凭据。认证是**每个 Agent 独立**的，新 Agent 不会继承主 Agent 的密钥。

**解决方案**：

**选项 1**：重新运行 onboarding 并为该 Agent 选择 **Anthropic**

```bash
clawdbot configure
```

**选项 2**：在 **Gateway 主机**粘贴 setup-token：

```bash
clawdbot models auth setup-token --provider anthropic
```

**选项 3**：复制 `auth-profiles.json` 从主 Agent 目录到新 Agent 目录

**验证**：

```bash
clawdbot models status
```

**相关文档**：[AI 模型与认证配置](../../advanced/models-auth/)

---

#### OAuth token refresh failed（Anthropic Claude 订阅）

**症状**：存储的 Anthropic OAuth token 过期，刷新失败。

**原因**：存储的 OAuth token 已过期且刷新失败。如果你使用 Claude 订阅（无 API Key），最可靠的修复是切换到 **Claude Code setup-token** 或在 **Gateway 主机**重新同步 Claude Code CLI OAuth。

**解决方案（推荐 - setup-token）**：

```bash
# 在 Gateway 主机运行（执行 Claude Code CLI）
clawdbot models auth setup-token --provider anthropic
clawdbot models status
```

如果你在其他地方生成了 token：

```bash
clawdbot models auth paste-token --provider anthropic
clawdbot models status
```

**如果想要保持 OAuth 复用**：
在 Gateway 主机通过 Claude Code CLI 登录，然后运行 `clawdbot models status` 同步刷新的 token 到 Clawdbot 的认证存储。

---

#### "/model" 提示 "model not allowed"

**症状**：切换模型时提示模型不被允许。

**原因**：通常意味着 `agents.defaults.models` 配置为 allowlist（白名单）。当它非空时，只能选择那些 provider/model 密钥。

**解决方案**：

```bash
# 1. 检查 allowlist
clawdbot config get agents.defaults.models

# 2. 添加你想要的模型（或清空 allowlist）
clawdbot config set agents.defaults.models []
# 或
clawdbot config set agents.defaults.models '["anthropic/claude-sonnet-4-20250514"]'

# 3. 重试 /model 命令
```

使用 `/models` 浏览允许的提供商/模型。

---

#### "All models failed" — 该先检查什么？

**检查清单**：

1. **凭据存在**：确认提供商的认证配置（auth profiles + 环境变量）
2. **模型路由**：确认 `agents.defaults.model.primary` 和 fallback 指向你可以访问的模型
3. **Gateway 日志**：`/tmp/clawdbot/...` 中查找确切的提供商错误
4. **模型状态**：使用 `/model status`（聊天）或 `clawdbot models status`（CLI）

**详细命令**：

```bash
# 查看所有模型状态
clawdbot models status

# 测试特定模型
clawdbot models scan

# 查看详细日志
clawdbot logs --follow | grep -i "model\|anthropic\|openai"
```

---

### 渠道连接问题

#### 消息未触发

**症状**：在渠道发送消息，但 Agent 无响应。

**检查 1**：发送者是否在白名单？

```bash
clawdbot status
# 查看输出中的 "AllowFrom: ..."
```

**检查 2**：群聊是否需要提及？

群组消息需要 `@mention` 或命令触发。查看配置：

```bash
# 检查全局或特定渠道的提及模式
grep -E "agents\|groupChat\|mentionPatterns" \
  "${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}"
```

**检查 3**：查看日志

```bash
clawdbot logs --follow
# 或快速过滤：
tail -f "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | grep "blocked\|skip\|unauthorized"
```

**相关文档**：[DM 配对与访问控制](../../start/pairing-approval/)

---

#### 配对代码未到达

**症状**：`dmPolicy` 为 `pairing` 时，未知发送者应该收到代码，但消息被忽略直到批准。

**检查 1**：是否已有等待的请求？

```bash
clawdbot pairing list <channel>
```

::: info 配对请求限制
默认情况下，每个渠道最多有 **3 个待处理的 DM 配对请求**。如果列表已满，新请求不会生成代码，直到一个被批准或过期。
:::

**检查 2**：请求是否创建但没有发送回复？

```bash
clawdbot logs --follow | grep "pairing request"
```

**检查 3**：确认 `dmPolicy` 不是 `open`/`allowlist`

---

#### WhatsApp 断开连接

**症状**：WhatsApp 频繁断开或无法连接。

**诊断步骤**：

```bash
# 1. 检查本地状态（凭据、会话、队列事件）
clawdbot status

# 2. 探测运行中的 Gateway + 渠道（WA 连接 + Telegram + Discord APIs）
clawdbot status --deep

# 3. 查看最近的连接事件
clawdbot logs --limit 200 | grep -i "connection\|disconnect\|logout"
```

**解决方案**：

通常一旦 Gateway 运行会自动重连。如果卡住：

```bash
# 重启 Gateway 进程（无论你如何监督它）
clawdbot gateway restart

# 或手动运行并查看详细输出
clawdbot gateway --verbose
```

如果已登出/取消链接：

```bash
# 重新登录并扫描 QR 码
clawdbot channels login --verbose

# 如果登出无法清除所有内容，手动删除凭证
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}/credentials"
```

---

### 媒体发送失败

**症状**：发送图片、音频、视频或文件时失败。

**检查 1**：文件路径是否有效？

```bash
ls -la /path/to/your/image.jpg
```

**检查 2**：文件是否过大？

- 图片：最大 **6MB**
- 音频/视频：最大 **16MB**
- 文档：最大 **100MB**

**检查 3**：查看媒体日志

```bash
grep "media\|fetch\|download" \
  "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | tail -20
```

---

### 工具执行问题

#### "Agent was aborted"

**症状**：Agent 中途停止响应。

**原因**：Agent 被中断。

**可能原因**：
- 用户发送了 `stop`、`abort`、`esc`、`wait`、`exit`
- 超时超出
- 进程崩溃

**解决方案**：只需发送另一条消息，会话继续。

---

#### "Agent failed before reply: Unknown model: anthropic/claude-haiku-3-5"

**症状**：模型被拒绝。

**原因**：Clawdbot 拒绝**较旧/不安全的模型**（尤其是那些更容易受到提示注入攻击的）。如果你看到此错误，模型名称不再被支持。

**解决方案**：

1. 选择提供商的**最新**模型，并更新配置或模型别名
2. 如果你不确定哪些模型可用，运行：
   ```bash
   clawdbot models list
   # 或
   clawdbot models scan
   ```
3. 选择支持的模型

**相关文档**：[AI 模型与认证配置](../../advanced/models-auth/)

---

#### Skill 在 sandbox 中缺少 API 密钥

**症状**：Skill 在主机上正常工作，但在 sandbox 中失败，提示缺少 API 密钥。

**原因**：sandboxed exec 在 Docker 内运行，**不**继承主机 `process.env`。

**解决方案**：

```bash
# 设置 sandbox 环境变量
clawdbot config set agents.defaults.sandbox.docker.env '{"API_KEY": "your-key-here"}'

# 或为特定 agent 设置
clawdbot config set agents.list[0].sandbox.docker.env '{"API_KEY": "your-key-here"}'

# 重新创建 sandbox
clawdbot sandbox recreate --agent <agent-id>
# 或所有
clawdbot sandbox recreate --all
```

---

### Control UI 问题

#### Control UI 在 HTTP 上失败（"device identity required" / "connect failed"）

**症状**：通过纯 HTTP 打开 dashboard（如 `http://<lan-ip>:18789/` 或 `http://<tailscale-ip>:18789/`）时失败。

**原因**：浏览器运行在**不安全上下文**，阻塞 WebCrypto，无法生成设备身份。

**解决方案**：

1. 优先使用 HTTPS（[Tailscale Serve](../../advanced/remote-gateway/)）
2. 或在 Gateway 主机上本地打开：`http://127.0.0.1:18789/`
3. 如果必须使用 HTTP，启用 `gateway.controlUi.allowInsecureAuth: true` 并使用 Gateway token（仅 token；无设备身份/配对）：
   ```bash
   clawdbot config set gateway.controlUi.allowInsecureAuth true
   ```

**相关文档**：[远程 Gateway 与 Tailscale](../../advanced/remote-gateway/)

---

### 会话和性能问题

#### 会话未恢复

**症状**：会话历史丢失或无法恢复。

**检查 1**：会话文件是否存在？

```bash
ls -la ~/.clawdbot/agents/<agentId>/sessions/
```

**检查 2**：重置窗口是否太短？

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

**检查 3**：是否有人发送了 `/new`、`/reset` 或重置触发器？

---

#### Agent 超时

**症状**：长时间任务中途停止。

**原因**：默认超时为 30 分钟。

**解决方案**：

对于长时间任务：

```json
{
  "reply": {
    "timeoutSeconds": 3600  // 1 小时
  }
}
```

或使用 `process` 工具后台运行长命令。

---

#### 高内存使用

**症状**：Clawdbot 占用大量内存。

**原因**：Clawdbot 将对话历史保留在内存中。

**解决方案**：

定期重启或设置会话限制：

```json
{
  "session": {
    "historyLimit": 100  // 保留的最大消息数
  }
}
```

---

## 调试模式

### 启用详细日志

```bash
# 1. 在配置中启用 trace 日志
# 编辑 ${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}
# 添加：
{
  "logging": {
    "level": "trace"
  }
}

# 2. 运行详细命令以镜像调试输出到 stdout
clawdbot gateway --verbose
clawdbot channels login --verbose
```

::: tip 日志级别说明
- **Level** 控制文件日志（持久的 JSONL）
- **consoleLevel** 控制控制台输出（仅 TTY）
- `--verbose` 仅影响 **控制台**输出，文件日志由 `logging.level` 控制
:::

### 日志位置

| 日志 | 位置 |
| --- | --- |
| Gateway 文件日志（结构化） | `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`（或 `logging.file`） |
| Gateway 服务日志 | macOS: `$CLAWDBOT_STATE_DIR/logs/gateway.log` + `gateway.err.log`<br/>Linux: `journalctl --user -u clawdbot-gateway[-<profile>].service -n 200 --no-pager`<br/>Windows: `schtasks /Query /TN "Clawdbot Gateway (<profile>)" /V /FO LIST` |
| 会话文件 | `$CLAWDBOT_STATE_DIR/agents/<agentId>/sessions/` |
| 媒体缓存 | `$CLAWDBOT_STATE_DIR/media/` |
| 凭据 | `$CLAWDBOT_STATE_DIR/credentials/` |

### 健康检查

```bash
# Supervisor + 探测目标 + 配置路径
clawdbot gateway status

# 包含系统级扫描（遗留/额外服务、端口监听器）
clawdbot gateway status --deep

# Gateway 是否可达？
clawdbot health --json
# 如果失败，运行并查看连接详情
clawdbot health --verbose

# 默认端口是否有监听器？
lsof -nP -iTCP:18789 -sTCP:LISTEN

# 最近活动（RPC 日志尾部）
clawdbot logs --follow

# 如果 RPC 已关闭的备用方案
tail -20 /tmp/clawdbot/clawdbot-*.log
```

---

## 重置所有配置

::: warning 危险操作
以下操作会删除所有会话和配置，需要重新配对 WhatsApp
:::

如果问题无法解决，可以考虑完全重置：

```bash
# 1. 停止 Gateway
clawdbot gateway stop

# 2. 如果安装了服务并想要干净安装：
# clawdbot gateway uninstall

# 3. 删除状态目录
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}"

# 4. 重新登录 WhatsApp
clawdbot channels login

# 5. 重新启动 Gateway
clawdbot gateway restart
# 或
clawdbot gateway
```

---

## macOS 特定问题

### 授权时应用崩溃（语音/麦克风）

**症状**：点击隐私提示中的"允许"时，应用消失或显示"Abort trap 6"。

**解决方案 1：重置 TCC 缓存**

```bash
tccutil reset All com.clawdbot.mac.debug
```

**解决方案 2：强制新 Bundle ID**

如果重置无效，更改 [`scripts/package-mac-app.sh`](https://github.com/clawdbot/clawdbot/blob/main/scripts/package-mac-app.sh) 中的 `BUNDLE_ID`（如添加 `.test` 后缀）并重新构建。这会强制 macOS 将其视为新应用。

---

### Gateway 卡在"启动中..."

**症状**：应用连接到本地 Gateway 端口 `18789`，但一直卡住。

**解决方案 1：停止 supervisor（推荐）**

如果 Gateway 由 launchd 监督，杀死 PID 只会重启它。先停止 supervisor：

```bash
# 查看状态
clawdbot gateway status

# 停止 Gateway
clawdbot gateway stop

# 或使用 launchctl
launchctl bootout gui/$UID/com.clawdbot.gateway
#（如果使用 profile，替换为 com.clawdbot.<profile>）
```

**解决方案 2：端口忙碌（查找监听器）**

```bash
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

如果是一个未监督的进程，先尝试优雅停止，然后升级：

```bash
kill -TERM <PID>
sleep 1
kill -9 <PID>  # 最后手段
```

**解决方案 3：检查 CLI 安装**

确保全局 `clawdbot` CLI 已安装并匹配应用版本：

```bash
clawdbot --version
npm install -g clawdbot@<version>
```

---

## 获取帮助

如果以上方法都无法解决问题：

1. **首先检查日志**：`/tmp/clawdbot/`（默认：`clawdbot-YYYY-MM-DD.log`，或你配置的 `logging.file`）
2. **搜索现有 issues**：[GitHub Issues](https://github.com/clawdbot/clawdbot/issues)
3. **打开新 issue**时包含：
   - Clawdbot 版本（`clawdbot --version`）
   - 相关日志片段
   - 复现步骤
   - 你的配置（**脱敏敏感信息！**）

---

## 本课小结

故障排查的关键步骤：

1. **快速诊断**：使用 `clawdbot status` → `status --all` → `gateway probe`
2. **查看日志**：`clawdbot logs --follow` 是最直接的信号来源
3. **针对性修复**：根据症状查阅对应章节（Gateway/认证/渠道/工具/会话）
4. **深度检查**：使用 `clawdbot doctor` 和 `status --deep` 获取系统级诊断
5. **必要重置**：无计可施时使用重置方案，但记住会丢失数据

记住：大多数问题都有明确的原因和解决方案，系统化地排查比盲目尝试有效。

## 下一课预告

> 下一课我们将学习 **[CLI 命令参考](../cli-commands/)**。
>
> 你会学到：
> - 完整的 CLI 命令列表和用法说明
> - Gateway 管理、Agent 交互、配置管理的所有命令
> - 高效使用命令行的技巧和最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 故障排除命令 | [`src/commands/doctor.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/doctor.ts) | 全文 |
| Gateway 健康检查 | [`src/gateway/server-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-channels.ts) | 93+ |
| 日志系统 | [`src/logging/index.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/logging/index.ts) | 全文 |
| 认证处理 | [`src/agents/auth-profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles.ts) | 全文 |
| 配置验证 | [`src/config/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/config.ts) | 全文 |
| 渠道状态探测 | [`src/cli/commands/channels-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/commands/channels-cli.ts) | 全文 |

**关键常量**：
- 默认 Gateway 端口：`18789` - Gateway WebSocket 服务端口
- 默认日志目录：`/tmp/clawdbot/` - 日志文件存储位置
- 配对请求上限：`3` - 每个渠道的最大待处理配对请求数

**关键函数**：
- `doctor()` - 运行诊断检查并报告问题
- `probeGateway()` - 测试 Gateway 连通性
- `checkAuth()` - 验证认证配置
- `validateConfig()` - 验证配置文件完整性

</details>
