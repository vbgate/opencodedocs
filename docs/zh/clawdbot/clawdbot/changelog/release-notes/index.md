---
title: "版本更新日志：了解新功能、改进和破坏性变更 | Clawdbot 教程"
sidebarTitle: "新版本有什么"
subtitle: "版本更新日志：了解新功能、改进和破坏性变更"
description: "学习 Clawdbot 的版本更新历史，了解各版本的新功能、改进、修复和破坏性变更。本教程帮助用户追踪功能演进，保持系统更新以获得最新特性和安全修复。"
tags:
  - "更新日志"
  - "版本历史"
  - "changelog"
prerequisite: []
order: 380
---

# 版本更新日志：了解新功能、改进和破坏性变更

Clawdbot 持续迭代更新，每个版本都带来新功能、性能改进和安全增强。本日志帮你快速了解版本演进，决定何时升级以及升级时需要注意什么。

## 学完你能做什么

- 了解最新版本的新功能和亮点
- 掌握各版本的破坏性变更，避免升级中断
- 查看问题修复列表，确认你的问题是否已解决
- 追踪功能演进路线，规划使用新特性

::: tip 版本号说明
版本号格式：`YYYY.M.D`（年份.月.日）

- **主版本**：年份或月份数字变化通常代表重大功能更新
- **补丁版本**：`-1`, `-2`, `-3` 代表修复版本，仅包含 bug 修复
:::

---

## 2026.1.25
**状态**：未发布

### 亮点（Highlights）

暂无

### 改进（Changes）

- **Agents**：在 exec allowlist 检查中遵守 `tools.exec.safeBins` (#2281)
- **Docs**：收紧 Fly 私有部署步骤 (#2289) - 感谢 @dguido
- **Gateway**：对通过查询参数传递的 hook token 发出警告；文档化首选 header 认证方式 (#2200) - 感谢 @YuriNachos
- **Gateway**：添加危险的 Control UI 设备认证绕过标志 + 审计警告 (#2248)
- **Doctor**：在无认证的 gateway 暴露时发出警告 (#2016) - 感谢 @Alex-Alaniz
- **Discord**：添加可配置的特权 gateway intents（presences/members）(#2266) - 感谢 @kentaro
- **Docs**：在 providers 侧边栏添加 Vercel AI Gateway (#1901) - 感谢 @jerilynzheng
- **Agents**：扩展 cron 工具描述，包含完整的 schema 文档 (#1988) - 感谢 @tomascupr
- **Skills**：添加 GitHub、Notion、Slack、Discord 的缺失依赖元数据 (#1995) - 感谢 @jackheuberger
- **Docs**：添加 Render 部署指南 (#1975) - 感谢 @anurag
- **Docs**：添加 Claude Max API 代理指南 (#1875) - 感谢 @atalovesyou
- **Docs**：添加 DigitalOcean 部署指南 (#1870) - 感谢 @0xJonHoldsCrypto
- **Docs**：添加 Raspberry Pi 安装指南 (#1871) - 感谢 @0xJonHoldsCrypto
- **Docs**：添加 GCP Compute Engine 部署指南 (#1848) - 感谢 @hougangdev
- **Docs**：添加 LINE 渠道指南 - 感谢 @thewilloftheshadow
- **Docs**：为 Control UI 刷新归功两位贡献者 (#1852) - 感谢 @EnzeD
- **Onboarding**：将 Venice API key 添加到非交互式流程 (#1893) - 感谢 @jonisjongithub
- **Onboarding**：加强 beta 版安全警告文案 + 访问控制预期
- **Tlon**：将线程回复 ID 格式化为 `@ud` (#1837) - 感谢 @wca4a
- **Gateway**：合并存储时优先使用最新的会话元数据 (#1823) - 感谢 @emanuelst
- **Web UI**：在 WebChat 中保持子 agent 通告回复可见 (#1977) - 感谢 @andrescardonas7
- **CI**：增加 macOS 检查的 Node 堆大小 (#1890) - 感谢 @realZachi
- **macOS**：通过升级 Textual 到 0.3.1 避免渲染代码块时崩溃 (#2033) - 感谢 @garricn
- **Browser**：回退到 URL 匹配用于扩展中继目标解析 (#1999) - 感谢 @jonit-dev
- **Update**：在脏检查中忽略 dist/control-ui 并在 UI 构建后恢复 (#1976) - 感谢 @Glucksberg
- **Telegram**：允许媒体发送时使用 caption 参数 (#1888) - 感谢 @mguellsegarra
- **Telegram**：支持插件 sendPayload channelData（媒体/按钮）并验证插件命令 (#1917) - 感谢 @JoshuaLelon
- **Telegram**：当流式传输被禁用时避免块回复 (#1885) - 感谢 @ivancasco
- **Auth**：在 ASCII 提示后显示可复制的 Google auth URL (#1787) - 感谢 @robbyczgw-cla
- **Routing**：预编译会话键正则表达式 (#1697) - 感谢 @Ray0907
- **TUI**：避免渲染选择列表时宽度溢出 (#1686) - 感谢 @mossein
- **Telegram**：在重启哨兵通知中保留主题 ID (#1807) - 感谢 @hsrvc
- **Config**：在 `${VAR}` 替换之前应用 `config.env` (#1813) - 感谢 @spanishflu-est1918
- **Slack**：在流式回复后清除 ack 反应 (#2044) - 感谢 @fancyboi999
- **macOS**：在远程目标中保持自定义 SSH 用户名 (#2046) - 感谢 @algal

### 修复（Fixes）

- **Telegram**：每行包装 reasoning 斜体以避免原始下划线 (#2181) - 感谢 @YuriNachos
- **Voice Call**：对 ngrok URL 强制执行 Twilio webhook 签名验证；默认禁用 ngrok 免费层绕过
- **Security**：通过在信任 headers 之前验证本地 tailscaled 的身份来强化 Tailscale Serve 认证
- **Build**：使 memory-core 对等依赖与锁文件对齐
- **Security**：添加 mDNS 发现模式，默认最小化以减少信息泄露 (#1882) - 感谢 @orlyjamie
- **Security**：通过 DNS pinning 强化 URL 获取以减少重新绑定风险 - 感谢 Chris Zheng
- **Web UI**：改进 WebChat 图片粘贴预览并允许仅发送图片 (#1925) - 感谢 @smartprogrammer93
- **Security**：默认用 per-hook 退出选项包装外部 hook 内容 (#1827) - 感谢 @mertcicekci0
- **Gateway**：默认认证现在失败关闭（需要 token/password；Tailscale Serve 身份仍然允许）
- **Onboarding**：从 onboarding/configure 流程和 CLI 标志中移除不支持的 gateway auth "off" 选择

---

## 2026.1.24-3

### 修复（Fixes）

- **Slack**：修复由于跨域重定向时缺少 Authorization header 导致的图片下载失败 (#1936) - 感谢 @sanderhelgesen
- **Gateway**：强化本地客户端检测和未认证代理连接的反向代理处理 (#1795) - 感谢 @orlyjamie
- **Security audit**：将禁用认证的 loopback Control UI 标记为关键 (#1795) - 感谢 @orlyjamie
- **CLI**：恢复 claude-cli 会话并将 CLI 回复流式传输到 TUI 客户端 (#1921) - 感谢 @rmorse

---

## 2026.1.24-2

### 修复（Fixes）

- **Packaging**：在 npm tarball 中包含 dist/link-understanding 输出（修复安装时缺失 apply.js 导入）

---

## 2026.1.24-1

### 修复（Fixes）

- **Packaging**：在 npm tarball 中包含 dist/shared 输出（修复安装时缺失 reasoning-tags 导入）

---

## 2026.1.24

### 亮点（Highlights）

- **Providers**：Ollama 发现 + 文档；Venice 指南升级 + 交叉链接 (#1606) - 感谢 @abhaymundhara
- **Channels**：LINE 插件（Messaging API）支持富回复 + 快速回复 (#1630) - 感谢 @plum-dawg
- **TTS**：Edge 回退（无 key）+ `/tts` 自动模式 (#1668, #1667) - 感谢 @steipete, @sebslight
- **Exec approvals**：通过 `/approve` 在所有渠道中（包括插件）进行聊天内审批 (#1621) - 感谢 @czekaj
- **Telegram**：DM 主题作为独立会话 + 出站链接预览切换 (#1597, #1700) - 感谢 @rohannagpal, @zerone0x

### 改进（Changes）

- **Channels**：添加 LINE 插件（Messaging API），支持富回复、快速回复和插件 HTTP 注册表 (#1630) - 感谢 @plum-dawg
- **TTS**：添加 Edge TTS 提供商回退，默认为无 key 的 Edge，格式失败时重试 MP3 (#1668) - 感谢 @steipete
- **TTS**：添加自动模式枚举（off/always/inbound/tagged），支持每会话 `/tts` 覆盖 (#1667) - 感谢 @sebslight
- **Telegram**：将 DM 主题视为独立会话，并使用线程后缀保持 DM 历史限制稳定 (#1597) - 感谢 @rohannagpal
- **Telegram**：添加 `channels.telegram.linkPreview` 切换出站链接预览 (#1700) - 感谢 @zerone0x
- **Web search**：为时间限定结果添加 Brave 新鲜度过滤器参数 (#1688) - 感谢 @JonUleis
- **UI**：刷新 Control UI 仪表板设计系统（颜色、图标、排版）(#1745, #1786) - 感谢 @EnzeD, @mousberg
- **Exec approvals**：将审批提示转发到聊天，通过 `/approve` 支持所有渠道（包括插件）(#1621) - 感谢 @czekaj
- **Gateway**：在 gateway 工具中暴露 `config.patch`，支持安全部分更新 + 重启哨兵 (#1653) - 感谢 @Glucksberg
- **Diagnostics**：添加诊断标志用于定向调试日志（config + env 覆盖）
- **Docs**：扩展 FAQ（迁移、调度、并发、模型推荐、OpenAI 订阅认证、Pi 大小、可黑安装、docs SSL 变通方案）
- **Docs**：添加详细的安装程序故障排除指南
- **Docs**：添加 macOS VM 指南，包含本地/托管选项 + VPS/节点指导 (#1693) - 感谢 @f-trycua
- **Docs**：添加 Bedrock EC2 实例角色设置 + IAM 步骤 (#1625) - 感谢 @sergical
- **Docs**：更新 Fly.io 指南说明
- **Dev**：添加 prek pre-commit hooks + 依赖的每周更新配置 (#1720) - 感谢 @dguido

### 修复（Fixes）

- **Web UI**：修复 config/debug 布局溢出、滚动和代码块大小 (#1715) - 感谢 @saipreetham589
- **Web UI**：在活动运行期间显示停止按钮，空闲时切换回新会话 (#1664) - 感谢 @ndbroadbent
- **Web UI**：在重新连接时清除过时的断开横幅；允许保存不支持 schema 路径的表单但阻止缺失 schema (#1707) - 感谢 @Glucksberg
- **Web UI**：在聊天气泡中隐藏内部 `message_id` 提示
- **Gateway**：允许 Control UI 仅 token 认证跳过设备配对，即使设备身份存在（`gateway.controlUi.allowInsecureAuth`）(#1679) - 感谢 @steipete
- **Matrix**：使用预检大小保护解密 E2EE 媒体附件 (#1744) - 感谢 @araa47
- **BlueBubbles**：将电话号码目标路由到 DM，避免泄露路由 ID，并自动创建缺失的 DM（需要 Private API）(#1751) - 感谢 @tyler6204
- **BlueBubbles**：当短 ID 缺失时，在回复标签中保留 part-index GUID
- **iMessage**：不区分大小写地规范化 chat_id/chat_guid/chat_identifier 前缀，并保持服务前缀句柄稳定 (#1708) - 感谢 @aaronn
- **Signal**：修复 reaction 发送（group/UUID 目标 + CLI author 标志）(#1651) - 感谢 @vilkasdev
- **Signal**：添加可配置的 signal-cli 启动超时 + 外部守护进程模式文档 (#1677)
- **Telegram**：在 Node 22 上为上传设置 fetch duplex="half" 以避免 sendPhoto 失败 (#1684) - 感谢 @commdata2338
- **Telegram**：在 Node 上使用包装的 fetch 进行长轮询以规范化 AbortSignal 处理 (#1639)
- **Telegram**：为出站 API 调用遵守每账户代理 (#1774) - 感谢 @radek-paclt
- **Telegram**：当语音笔记被隐私设置阻止时回退到文本 (#1725) - 感谢 @foeken
- **Voice Call**：在初始 Twilio webhook 时返回流式 TwiML 用于出站会话调用 (#1634)
- **Voice Call**：序列化 Twilio TTS 播放并在插话时取消以防止重叠 (#1713) - 感谢 @dguido
- **Google Chat**：收紧邮箱 allowlist 匹配、清理输入、媒体上限和 onboarding/docs/tests (#1635) - 感谢 @iHildy
- **Google Chat**：规范不带双 `spaces/` 前缀的空间目标
- **Agents**：在上下文溢出提示错误时自动压缩 (#1627) - 感谢 @rodrigouroz
- **Agents**：使用活动 auth 配置文件进行自动压缩恢复
- **Media understanding**：当主模型已支持视觉时跳过图像理解 (#1747) - 感谢 @tyler6204
- **Models**：默认缺失的自定义提供商字段，以便接受最小配置
- **Messaging**：保持换行块分割对跨渠道的围栏 markdown 块安全
- **Messaging**：将换行块处理为段落感知（空行分割），以保持列表和标题在一起 (#1726) - 感谢 @tyler6204
- **TUI**：在 gateway 重新连接后重新加载历史以恢复会话状态 (#1663)
- **Heartbeat**：规范目标标识符以保持路由一致
- **Exec**：对于提升的 ask 保持审批，除非是完全模式 (#1616) - 感谢 @ivancasco
- **Exec**：将 Windows 平台标签视为 Windows 用于节点 shell 选择 (#1760) - 感谢 @ymat19
- **Gateway**：在服务安装环境中包含内联配置 env 变量 (#1735) - 感谢 @Seredeep
- **Gateway**：当 tailscale.mode 为 off 时跳过 Tailscale DNS 探测 (#1671)
- **Gateway**：减少延迟调用 + 远程节点探测的日志噪音；去抖动技能刷新 (#1607) - 感谢 @petter-b
- **Gateway**：阐明缺少 token 的 Control UI/WebChat 认证错误提示 (#1690)
- **Gateway**：当绑定到 127.0.0.1 时监听 IPv6 loopback，以便 localhost webhooks 工作
- **Gateway**：将锁文件存储在临时目录中以避免持久卷上的陈旧锁 (#1676)
- **macOS**：直接传输 `ws://` URL 默认到端口 18789；文档化 `gateway.remote.transport` (#1603) - 感谢 @ngutman
- **Tests**：在 CI macOS 上限制 Vitest worker 以减少超时 (#1597) - 感谢 @rohannagpal
- **Tests**：在嵌入式运行器流模拟中避免 fake-timer 依赖以减少 CI 不稳定 (#1597) - 感谢 @rohannagpal
- **Tests**：增加嵌入式运行器排序测试超时以减少 CI 不稳定 (#1597) - 感谢 @rohannagpal

---

## 2026.1.23-1

### 修复（Fixes）

- **Packaging**：在 npm tarball 中包含 dist/tts 输出（修复缺失 dist/tts/tts.js）

---

## 2026.1.23

### 亮点（Highlights）

- **TTS**：将 Telegram TTS 移至核心 + 默认启用模型驱动的 TTS 标签以支持表达性音频回复 (#1559) - 感谢 @Glucksberg
- **Gateway**：添加 `/tools/invoke` HTTP 端点用于直接工具调用（强制执行认证 + 工具策略）(#1575) - 感谢 @vignesh07
- **Heartbeat**：每渠道可见性控制（OK/alerts/indicator）(#1452) - 感谢 @dlauer
- **Deploy**：添加 Fly.io 部署支持 + 指南 (#1570)
- **Channels**：添加 Tlon/Urbit 渠道插件（DM、群组提及、线程回复）(#1544) - 感谢 @wca4a

### 改进（Changes）

- **Channels**：在内置 + 插件渠道中允许每组工具允许/拒绝策略 (#1546) - 感谢 @adam91holt
- **Agents**：添加 Bedrock 自动发现默认值 + 配置覆盖 (#1553) - 感谢 @fal3
- **CLI**：添加 `clawdbot system` 用于系统事件 + 心跳控制；移除独立的 `wake`
- **CLI**：向 `clawdbot models status` 添加实时认证探测以进行每配置文件验证
- **CLI**：在 `clawdbot update` 后默认重启 gateway；添加 `--no-restart` 跳过
- **Browser**：为远程网关添加节点主机代理自动路由（每个 gateway/node 可配置）
- **Plugins**：为工作流添加可选的 `llm-task` JSON-only 工具 (#1498) - 感谢 @vignesh07
- **Markdown**：添加每渠道表转换（Signal/WhatsApp 使用项目符号，其他使用代码块）(#1495) - 感谢 @odysseus0
- **Agents**：保持系统提示词仅时区并将当前时间移动到 `session_status` 以获得更好的缓存命中
- **Agents**：从工具注册/显示中移除冗余的 bash 工具别名 (#1571) - 感谢 @Takhoffman
- **Docs**：添加 cron vs heartbeat 决策指南（包含 Lobster 工作流笔记）(#1533) - 感谢 @JustYannicc
- **Docs**：阐明空 HEARTBEAT.md 文件跳过心跳，缺失文件仍会运行 (#1535) - 感谢 @JustYannicc

### 修复（Fixes）

- **Sessions**：接受非 UUID sessionIds 用于历史/发送/状态，同时保留 agent 范围
- **Heartbeat**：接受插件 channel ids 用于心跳目标验证 + UI 提示
- **Messaging/Sessions**：将出站发送镜像到目标会话键（线程 + dmScope），创建发送时的会话条目，并规范化会话键大小写 (#1520)
- **Sessions**：拒绝数组支持的会话存储以防止静默擦除 (#1469)
- **Gateway**：比较 Linux 进程启动时间以避免 PID 回收锁循环；除非陈旧，否则保持锁 (#1572) - 感谢 @steipete
- **Gateway**：在 exec 审批请求中接受 null 可选字段 (#1511) - 感谢 @pvoo
- **Exec approvals**：持久化 allowlist 条目 id 以保持 macOS allowlist 行稳定 (#1521) - 感谢 @ngutman
- **Exec**：遵守 tools.exec ask/security 默认值用于提升的审批（避免不需要的提示）
- **Daemon**：在构建最小服务路径时使用平台 PATH 分隔符
- **Linux**：在 systemd PATH 中包含 env 配置的用户 bin 根目录并对齐 PATH 审核 (#1512) - 感谢 @robbyczgw-cla
- **Tailscale**：仅在权限错误时使用 sudo 重试 serve/funnel 并保持原始失败详情 (#1551) - 感谢 @sweepies
- **Docker**：更新 docker-compose 和 Hetzner 指南中的 gateway 命令 (#1514)
- **Agents**：当最后一个助手回合仅调用工具时显示工具错误回退（防止静默停止）
- **Agents**：解析身份时忽略 IDENTITY.md 模板占位符 (#1556)
- **Agents**：在模型切换时删除孤立的 OpenAI Responses reasoning 块 (#1562) - 感谢 @roshanasingh4
- **Agents**：在"agent 在回复前失败"消息中添加 CLI 日志提示 (#1550) - 感谢 @sweepies
- **Agents**：警告并忽略仅引用未知或未加载插件工具的工具 allowlists (#1566)
- **Agents**：将仅插件工具 allowlists 视为选择性加入；保持核心工具启用 (#1467)
- **Agents**：遵守嵌入式运行的 enqueue 覆盖以避免测试中的队列死锁
- **Slack**：遵守开放 groupPolicy 用于消息 + slash gate 中的未列出通道 (#1563) - 感谢 @itsjaydesu
- **Discord**：将自动线程提及绕过限制为 bot 拥有的线程；保持 ack 反应提及门控 (#1511) - 感谢 @pvoo
- **Discord**：重试速率限制的 allowlist 解析 + 命令部署以避免 gateway 崩溃
- **Mentions**：在群组聊天中当存在另一个明确提及时忽略 mentionPattern 匹配（Slack/Discord/Telegram/WhatsApp）
- **Telegram**：在媒体标题中渲染 markdown (#1478)
- **MS Teams**：从 Graph 作用域和 Bot Framework 探测作用域中移除 `.default` 后缀 (#1507, #1574) - 感谢 @Evizero
- **Browser**：当扩展在切换标签页后重用会话 id 时保持扩展中继标签可控制 (#1160)
- **Voice wake**：在模糊/提交时跨 iOS/Android 自动保存唤醒词并与 macOS 对齐限制
- **UI**：滚动长页面时保持 Control UI 侧边栏可见 (#1515) - 感谢 @pookNast
- **UI**：缓存 Control UI markdown 渲染 + 记忆化聊天文本提取以减少 Safari 输入抖动
- **TUI**：转发未知斜杠命令，在自动完成中包含 Gateway 命令，并将斜杠回复渲染为系统输出
- **CLI**：认证探测输出润色（表格输出、内联错误、减少噪音和 `clawdbot models status` 中的换行修复）
- **Media**：仅在它们以行开头时解析 `MEDIA:` 标签，以避免剥离散文提及 (#1206)
- **Media**：尽可能保留 PNG alpha；当仍超过大小上限时回退到 JPEG (#1491) - 感谢 @robbyczgw-cla
- **Skills**：将 bird Homebrew 安装门控到 macOS (#1569) - 感谢 @bradleypriest

---

## 更新建议

### 升级前检查

在升级到新版本之前，建议：

1. **阅读破坏性变更**：检查是否有破坏性变更会影响你的配置
2. **备份配置**：备份 `~/.clawdbot/clawdbot.json`
3. **运行诊断**：`clawdbot doctor` 确保当前系统状态健康
4. **检查依赖**：确保 Node.js 版本符合要求（≥22）

### 升级后验证

升级完成后，执行以下验证：

```bash
# 1. 检查版本
clawdbot --version

# 2. 检查状态
clawdbot status

# 3. 验证渠道连接
clawdbot channels status

# 4. 测试消息发送
clawdbot message "Hello" --target=<your-channel>
```

### 查看完整更新日志

要查看更详细的版本历史和 issue 链接，请访问：

- **GitHub Releases**：https://github.com/clawdbot/clawdbot/releases
- **官方文档**：https://docs.clawd.bot

---

## 历史版本

查看更早的版本更新，请访问 [GitHub Releases](https://github.com/clawdbot/clawdbot/releases) 或项目根目录的 [CHANGELOG.md](https://github.com/clawdbot/clawdbot/blob/main/CHANGELOG.md)。

::: tip 参与贡献
如果你发现了 bug 或有功能建议，欢迎在 [GitHub Issues](https://github.com/clawdbot/clawdbot/issues) 中提交。
:::
