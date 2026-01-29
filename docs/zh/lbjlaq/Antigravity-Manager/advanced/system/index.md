---
title: "系统能力: 语言/主题/API | Antigravity-Manager"
sidebarTitle: "5 分钟搞定系统设置"
subtitle: "系统能力: 语言/主题/API | Antigravity-Manager"
description: "学习 Antigravity Tools 的语言、主题、托盘和 API Server。掌握 i18n fallback、开机自启、HTTP 接口调用和重启生效规则。"
tags:
  - "系统设置"
  - "i18n"
  - "主题"
  - "更新"
  - "托盘"
  - "HTTP API"
prerequisite:
  - "start-first-run-data"
  - "advanced-config"
order: 9
---

# 系统能力：多语言/主题/更新/开机自启/HTTP API Server

你把主题切到 dark，界面却还是亮色；你明明关了窗口，进程却还在后台；你想让外部工具切换当前账号，但又不想把反代暴露到局域网。

这节课聚焦 Antigravity Tools 的“系统能力”：语言、主题、更新、托盘/开机自启，以及给外部程序调用的 HTTP API Server。

## 什么是系统能力？

**系统能力**指的是 Antigravity Tools 作为桌面应用的“产品化能力”：界面多语言与主题切换、更新检查与升级、关闭窗口后的托盘驻留与开机自启，以及提供一个仅绑定 `127.0.0.1` 的 HTTP API Server 供外部程序调用。

## 学完你能做什么

- 切换语言/主题，并弄清哪些是“立刻生效”
- 明确“关闭窗口”和“退出程序”的区别，以及托盘菜单能做什么
- 知道自动更新检查的触发条件、间隔与落盘文件
- 启用 HTTP API Server 并用 `curl` 跑通探活与账号切换

## 🎒 开始前的准备

- 你知道数据目录在哪里（见 [首次启动必懂：数据目录、日志、托盘与自动启动](../../start/first-run-data/)）
- 你知道 `gui_config.json` 是配置落盘的单一真相源（见 [配置全解：AppConfig/ProxyConfig、落盘位置与热更新语义](../config/)）

## 核心思路

把这几个能力分成两类，会更好记：

1. “配置驱动”的能力：语言、主题会写进 `gui_config.json`（前端调用 `save_config`）。
2. “独立落盘”的能力：更新设置与 HTTP API 设置各自有单独的 JSON 文件；托盘与关闭行为由 Tauri 侧控制。

## 跟我做

### 第 1 步：切换语言（立即生效 + 自动持久化）

**为什么**
语言切换最容易让人误以为“需要重启”。这里的实现是：UI 立即切换，同时把 `language` 写回配置。

操作：打开 `Settings` -> `General`，在语言下拉框里选择一个语言。

你会看到两件事几乎同时发生：

- UI 立即变成新语言（前端直接调用 `i18n.changeLanguage(newLang)`）。
- 配置被持久化（前端调用 `updateLanguage(newLang)`，内部会触发 `save_config`）。

::: info 语言包从哪里来？
前端用 `i18next` 初始化了多语言资源，并设置 `fallbackLng: "en"`。也就是说：某个 key 缺翻译时，会回落到英文。
:::

### 第 2 步：切换主题（light/dark/system）

**为什么**
主题不仅影响 CSS，还会影响 Tauri 窗口背景色、DaisyUI 的 `data-theme` 和 Tailwind 的 `dark` class。

操作：在 `Settings` -> `General` 里把主题切到 `light` / `dark` / `system`。

你应该看到：

- 主题立即生效（`ThemeManager` 会读取配置并应用到 `document.documentElement`）。
- 当主题是 `system` 时，系统深浅色变化会实时同步到应用（监听 `prefers-color-scheme`）。

::: warning Linux 的一个例外
`ThemeManager` 会尝试调用 `getCurrentWindow().setBackgroundColor(...)` 设置窗口背景色，但在 Linux 平台会跳过这一步（源码里有注释说明：透明窗口 + softbuffer 可能导致崩溃）。
:::

### 第 3 步：开机自启（以及为什么会带 `--minimized`）

**为什么**
开机自启不是“配置字段”，而是系统级注册项（Tauri autostart 插件）。

操作：在 `Settings` -> `General` 里，把“开机自动启动”设为启用/禁用。

你应该看到：

- 切换时会直接调用后端 `toggle_auto_launch(enable)`。
- 页面初始化时会调用 `is_auto_launch_enabled()`，显示真实状态（不靠本地缓存）。

补充：应用初始化 autostart 插件时传入了 `--minimized` 参数，所以“随开机启动”通常会以最小化/后台形态启动（具体表现取决于前端如何处理该参数）。

### 第 4 步：弄清“关闭窗口”和“退出程序”

**为什么**
很多桌面应用是“关闭即退出”，但 Antigravity Tools 的默认行为是“关闭即隐藏到托盘”。

你应该知道：

- 点击窗口的关闭按钮后，Tauri 会拦截关闭事件并 `hide()`，而不是退出进程。
- 托盘菜单里有 `Show`/`Quit`：想彻底退出，应该用 `Quit`。
- 托盘显示文案会跟随 `config.language`（托盘创建时会读取配置语言并取翻译文本；配置更新后会监听 `config://updated` 事件刷新托盘菜单）。

### 第 5 步：更新检查（自动触发 + 手动检查）

**为什么**
更新这块同时用了两套东西：

- 自定义的“版本检查”逻辑：拉 GitHub Releases 最新版本，判断是否有更新。
- Tauri Updater：负责下载并安装，然后 `relaunch()`。

你可以这么用：

1. 自动检查：应用启动后会调用 `should_check_updates`，若需要检查则弹出 `UpdateNotification`，并立刻更新 `last_check_time`。
2. 手动检查：在 `Settings` 页面点“检查更新”（调用 `check_for_updates`，并在 UI 展示结果）。

::: tip 更新间隔从哪来？
后端把更新设置落盘到数据目录下的 `update_settings.json`，默认 `auto_check=true`、`check_interval_hours=24`。
:::

### 第 6 步：启用 HTTP API Server（只绑定本机）

**为什么**
如果你想让外部程序（比如 VS Code 插件）“切换账号/刷新配额/读取日志”，HTTP API Server 比反代端口更合适：它固定绑定 `127.0.0.1`，只对本机开放。

操作：在 `Settings` -> `Advanced` 的 “HTTP API” 区域里：

1. 打开启用开关。
2. 设定端口并点保存。

你应该看到：UI 会提示“需要重启”（因为后端只在启动时读取 `http_api_settings.json` 并启动服务）。

### 第 7 步：用 curl 验证 HTTP API（探活/账号/切换/日志）

**为什么**
你需要一个可重复的验证闭环：能打通 `health`、能列出账号、能触发切换/刷新并理解它们是异步任务。

默认端口是 `19527`。如果你改过端口，把下面的 `19527` 换成你的实际值。

::: code-group

```bash [macOS/Linux]
 # 探活
curl -sS "http://127.0.0.1:19527/health" && echo

 # 列出账号（含 quota 摘要）
curl -sS "http://127.0.0.1:19527/accounts" | head -n 5

 # 获取当前账号
curl -sS "http://127.0.0.1:19527/accounts/current" | head -n 5

 # 触发切换账号（注意：返回 202，后台异步执行）
curl -sS -i \
  -H 'Content-Type: application/json' \
  -d '{"account_id":"<account_id>"}' \
  "http://127.0.0.1:19527/accounts/switch"

 # 触发刷新所有配额（同样是 202，异步执行）
curl -sS -i -X POST "http://127.0.0.1:19527/accounts/refresh"

 # 读取代理日志（limit/offset/filter/errors_only）
curl -sS "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | head -n 5
```

```powershell [Windows]
 # 探活
Invoke-RestMethod "http://127.0.0.1:19527/health"

 # 列出账号
Invoke-RestMethod "http://127.0.0.1:19527/accounts" | ConvertTo-Json -Depth 5

 # 获取当前账号
Invoke-RestMethod "http://127.0.0.1:19527/accounts/current" | ConvertTo-Json -Depth 5

 # 触发切换账号（返回 202）
$body = @{ account_id = "<account_id>" } | ConvertTo-Json
Invoke-WebRequest -Method Post -ContentType "application/json" -Body $body "http://127.0.0.1:19527/accounts/switch" | Select-Object -ExpandProperty StatusCode

 # 触发刷新所有配额（返回 202）
Invoke-WebRequest -Method Post "http://127.0.0.1:19527/accounts/refresh" | Select-Object -ExpandProperty StatusCode

 # 读取代理日志
Invoke-RestMethod "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | ConvertTo-Json -Depth 5
```

:::

**你应该看到**：

- `/health` 返回 `{"status":"ok","version":"..."}` 风格的 JSON。
- `/accounts/switch` 返回 202（Accepted），并提示“task started”。真正的切换在后台执行。

## 检查点 ✅

- 你能解释：语言/主题为什么“改了立刻生效”，而 HTTP API 端口需要重启
- 你能解释：关窗口为什么不会退出，以及从哪里真正退出
- 你能用 `curl` 打通 `/health` 和 `/accounts`，并理解 `/accounts/switch` 是异步

## 踩坑提醒

1. HTTP API Server 固定绑定 `127.0.0.1`，它和 `proxy.allow_lan_access` 是两回事。
2. 更新检查的“是否检查”逻辑在 App 启动时就决定了；一旦触发，会先更新 `last_check_time`，即便后续检查失败也不会在短时间内重复弹窗。
3. “关窗口不退出”是设计如此：要释放进程资源，用托盘的 `Quit`。

## 本课小结

- 语言：UI 立即切换 + 写回配置（`i18n.changeLanguage` + `save_config`）
- 主题：由 `ThemeManager` 统一落地到 `data-theme`、`dark` class 和窗口背景色（Linux 有例外）
- 更新：启动时按 `update_settings.json` 决定是否弹窗，安装由 Tauri Updater 负责
- HTTP API：默认启用、只本机可访问，配置落盘 `http_api_settings.json`，改端口需重启

## 下一课预告

> 下一课会进入 **服务器部署：Docker noVNC vs Headless Xvfb（advanced-deployment）**，把桌面端搬到 NAS/服务器上跑。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 主题 | 文件路径 | 行号 |
| --- | --- | --- |
| i18n 初始化与 fallback | [`src/i18n.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/i18n.ts#L1-L67) | 1-67 |
| Settings：语言/主题/开机自启/更新设置/HTTP API 设置 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L16-L730) | 16-730 |
| App：同步语言 + 启动时触发更新检查 | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L52-L124) | 52-124 |
| ThemeManager：应用主题、监听 system theme、写入 localStorage | [`src/components/common/ThemeManager.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/ThemeManager.tsx#L1-L82) | 1-82 |
| UpdateNotification：检查更新、自动下载安装并 relaunch | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L1-L217) | 1-217 |
| 更新检查：GitHub Releases + check interval | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L1-L187) | 1-187 |
| 托盘：按语言生成菜单 + 监听 `config://updated` 刷新 | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L1-L255) | 1-255 |
| 配置保存：发出 `config://updated` + 热更新运行中的反代 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| 开机自启命令：toggle/is_enabled（Windows disable 兼容） | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L1-L39) | 1-39 |
| Tauri：初始化 autostart/updater + 关闭窗口转 hide + 启动 HTTP API | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L160) | 50-160 |
| HTTP API：设置落盘 + 路由（health/accounts/switch/refresh/logs）+ 只绑定 127.0.0.1 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L1-L95) | 1-95 |
| HTTP API：Server bind 与路由注册 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L51-L94) | 51-94 |
| HTTP API 设置命令：get/save | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L773-L789) | 773-789 |

</details>
