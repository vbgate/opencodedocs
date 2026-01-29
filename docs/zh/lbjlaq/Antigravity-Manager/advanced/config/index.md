---
title: "配置: 热更新与迁移 | Antigravity-Manager"
subtitle: "配置: 热更新与迁移 | Antigravity-Manager"
sidebarTitle: "配置不生效怎么办"
description: "学习配置系统的落盘、热更新与迁移机制。掌握字段默认值与鉴权验证方法，避免常见坑。"
tags:
  - "配置"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "热更新"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---
# 配置全解：AppConfig/ProxyConfig、落盘位置与热更新语义

你改了 `auth_mode` 但客户端还是 401；你开了 `allow_lan_access`，同网段设备却连不上；你想把配置迁到新机器，却不知道该拷哪些文件。

这节课把 Antigravity Tools 的配置系统一次讲透：配置存在哪、默认值是什么、哪些能热更新、哪些必须重启反代。

## 什么是 AppConfig/ProxyConfig？

**AppConfig/ProxyConfig**是 Antigravity Tools 的配置数据模型：AppConfig 管桌面端的通用设置（语言、主题、预热、配额保护等），ProxyConfig 管本地反代服务的运行参数（端口、鉴权、模型映射、上游代理等）。它们最终都序列化到同一个 `gui_config.json` 文件，反代启动时读取其中的 ProxyConfig。

## 学完你能做什么

- 找到配置文件 `gui_config.json` 的真实落盘位置，并能做备份/迁移
- 读懂 AppConfig/ProxyConfig 的核心字段与默认值（以源码为准）
- 明确哪些配置保存后会热更新，哪些必须重启反代才能生效
- 看懂一次“配置迁移”（旧字段被自动合并/删除）的发生条件

## 你现在的困境

- 改了配置却“不生效”，你不知道是没保存、没热更新，还是需要重启
- 你只想把“反代配置”带到新机器，但又担心把账号数据一起带出去
- 升级后出现旧字段，你担心配置文件格式“坏了”

## 什么时候用这一招

- 你准备把反代从“仅本机”切到“局域网可访问”
- 你要改鉴权策略（`auth_mode`/`api_key`），并想立刻验证生效
- 你要批量维护模型映射/上游代理/z.ai 配置

## 🎒 开始前的准备

- 你已经知道数据目录是什么（见 [首次启动必懂：数据目录、日志、托盘与自动启动](../../start/first-run-data/)）
- 你能启动一次反代服务（见 [启动本地反代并接入第一个客户端](../../start/proxy-and-first-client/)）

::: warning 先说个边界
本课会教你读/备份/迁移 `gui_config.json`，但不建议你把它当成“长期手写维护的配置文件”。因为后端保存配置时会按 Rust 的 `AppConfig` 结构重新序列化，手动塞进去的未知字段，很可能在下一次保存时被自动丢掉。
:::

## 核心思路

配置这件事，先记住三句话：

1. AppConfig 是持久化配置的根对象，落在 `gui_config.json`。
2. ProxyConfig 是 `AppConfig.proxy` 的子对象，反代启动/热更新都围绕它。
3. 热更新是“只更新内存状态”：能热更的不代表能改监听端口/监听地址。

## 跟我做

### 第 1 步：定位 `gui_config.json`（配置的单一真相源）

**为什么**
你后面所有的“备份/迁移/排障”，都要以这个文件为准。

后端的数据目录是你的 Home 目录下的 `.antigravity_tools`（不存在会自动创建），配置文件名固定为 `gui_config.json`。

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**你应该看到**：
- 如果你还没启动过反代，这个文件可能不存在（后端会直接用默认配置）。
- 启动反代服务或保存设置时，它会被自动创建并写入 JSON。

### 第 2 步：先备份一份（防手滑 + 方便回滚）

**为什么**
配置里可能包含 `proxy.api_key`、z.ai 的 `api_key` 等敏感字段。你想迁移/对比时，备份比“记忆”可靠。

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**你应该看到**：备份目录里出现了一个带时间戳的 JSON 文件。

### 第 3 步：搞清默认值（别凭感觉猜）

**为什么**
很多“怎么都配不对”的问题，其实是你对默认值的预期不对。

下面这些默认值来自后端 `AppConfig::new()` 和 `ProxyConfig::default()`：

| 配置块 | 字段 | 默认值（源码） | 你需要记住的点 |
|--- | --- | --- | ---|
| AppConfig | `language` | `"zh"` | 默认中文 |
| AppConfig | `theme` | `"system"` | 跟随系统 |
| AppConfig | `auto_refresh` | `true` | 默认会自动刷新配额 |
| AppConfig | `refresh_interval` | `15` | 单位：分钟 |
| ProxyConfig | `enabled` | `false` | 默认不启动反代 |
| ProxyConfig | `allow_lan_access` | `false` | 默认只绑定本机（隐私优先） |
| ProxyConfig | `auth_mode` | `"off"` | 默认不鉴权（仅本机场景） |
| ProxyConfig | `port` | `8045` | 这是你最常改的字段 |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | 默认会生成随机 key |
| ProxyConfig | `request_timeout` | `120` | 单位：秒（注意：反代内部目前不一定用到它） |
| ProxyConfig | `enable_logging` | `true` | 默认开启监控/统计依赖的日志采集 |
| StickySessionConfig | `mode` | `Balance` | 调度策略默认平衡 |
| StickySessionConfig | `max_wait_seconds` | `60` | 仅 CacheFirst 模式才有意义 |

::: tip 想看完整字段怎么办？
你可以直接打开 `gui_config.json` 对照源码：`src-tauri/src/models/config.rs`（AppConfig）和 `src-tauri/src/proxy/config.rs`（ProxyConfig）。本课末尾的“源码参考”给了可点击的行号链接。
:::

### 第 4 步：改一个“确定会热更新”的配置并立刻验证（以鉴权为例）

**为什么**
你需要一个“改了立刻能验证”的闭环，避免在 UI 里盲改。

当反代正在运行时，后端 `save_config` 会把这些内容热更新到内存：

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key`（安全策略）
- `proxy.zai`
- `proxy.experimental`

这里我们用 `auth_mode` 做例子：

1. 打开 `API Proxy` 页面，确保反代服务处于 Running。
2. 把 `auth_mode` 设为 `all_except_health`，并确认你知道当前 `api_key`。
3. 用下面的请求验证“健康检查放行、其他接口拦截”。

::: code-group

```bash [macOS/Linux]
#不带 key 请求 /healthz：应成功
curl -sS "http://127.0.0.1:8045/healthz" && echo

#不带 key 请求 /v1/models：应 401
curl -sS -i "http://127.0.0.1:8045/v1/models"

#带 key 再请求 /v1/models：应成功
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
#不带 key 请求 /healthz：应成功
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

#不带 key 请求 /v1/models：应 401
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

#带 key 再请求 /v1/models：应成功
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**你应该看到**：`/healthz` 返回 200；`/v1/models` 在不带 key 时返回 401，带 key 时成功。

### 第 5 步：改一个“必须重启反代”的配置（端口 / 监听地址）

**为什么**
很多配置是“保存了但不生效”，根因不是 bug，而是它决定了 TCP Listener 怎么绑定。

在启动反代时，后端会用 `allow_lan_access` 计算监听地址（`127.0.0.1` 或 `0.0.0.0`），并用 `port` 绑定端口；这一步只发生在 `start_proxy_service`。

操作建议：

1. 在 `API Proxy` 页面把 `port` 改成一个新值（比如 `8050`），保存。
2. 停止反代服务，然后重新启动。
3. 用新端口验证 `/healthz`。

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**你应该看到**：新端口可访问；旧端口连接失败或返回空。

::: warning 关于 `allow_lan_access`
源码里 `allow_lan_access` 同时影响两件事：

1. **监听地址**：决定绑定 `127.0.0.1` 还是 `0.0.0.0`（需要重启反代才能重新 bind）。
2. **auto 鉴权策略**：当 `auth_mode=auto` 时，局域网场景会自动转成 `all_except_health`（这部分能热更新）。
:::

### 第 6 步：看懂一次“配置迁移”（旧字段会被自动清理）

**为什么**
你升级后可能会在 `gui_config.json` 里看到老字段，担心“坏了”。实际上，后端加载配置时会做一次迁移：把 `anthropic_mapping/openai_mapping` 合并到 `custom_mapping`，并删除旧字段，然后自动保存一次。

你可以用这个规律自检：

- 如果你在文件里看见 `proxy.anthropic_mapping` 或 `proxy.openai_mapping`，下次启动/加载配置后，它们会被移除。
- 合并时会跳过以 `-series` 结尾的 key（这些现在交给 preset/builtin 逻辑处理）。

**你应该看到**：迁移发生后，`gui_config.json` 里只留下 `proxy.custom_mapping`。

## 检查点 ✅

- 你能在本机找到 `$HOME/.antigravity_tools/gui_config.json`
- 你能说清：`auth_mode/api_key/custom_mapping` 这类配置为什么能热更新
- 你能说清：`port/allow_lan_access` 这类配置为什么必须重启反代

## 踩坑提醒

1. `save_config` 的热更新只覆盖少数字段：它不会帮你重启 listener，也不会把 `scheduling` 之类的配置推给 TokenManager。
2. `request_timeout` 在反代内部当前实现里并没有真正生效：AxumServer 的 `start` 参数里是 `_request_timeout`，而状态里把超时写死成了 `300` 秒。
3. 手动往 `gui_config.json` 里塞“自定义字段”不可靠：后端保存时会把它重新序列化成 `AppConfig`，未知字段会被丢弃。

## 本课小结

- 配置落盘只有一个入口：`$HOME/.antigravity_tools/gui_config.json`
- ProxyConfig 的“能热更新”不等于“能改端口/改监听地址”；涉及 bind 的都要重启反代
- 看到旧映射字段别慌：加载配置时会自动迁移到 `custom_mapping` 并清理旧字段

## 下一课预告

> 下一课我们学习 **[安全与隐私：auth_mode、allow_lan_access、以及“不要泄露账号信息”的设计](../security/)**。
>
> 你会学到：
> - 什么时候必须开鉴权（以及为什么 `auto` 在 LAN 场景会更严格）
> - 把本地反代暴露到局域网/公网时的最小暴露策略
> - 哪些数据会被发送到上游，哪些只保存在本机

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 主题 | 文件路径 | 行号 |
|--- | --- | ---|
| AppConfig 默认值（`AppConfig::new()`） | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| ProxyConfig 默认值（端口/鉴权/监听地址） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| StickySessionConfig 默认值（调度） | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| 配置落盘文件名 + 迁移逻辑（`gui_config.json`） | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| 数据目录（`$HOME/.antigravity_tools`） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config`：保存配置 + 热更新哪些字段 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer：`update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| `allow_lan_access` 的监听地址选择 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Proxy 启动时 bind 地址与端口（必须重启才会变） | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| `auth_mode=auto` 的实际规则 | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| 前端保存调度配置（只保存，不会推送到后端运行时） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Monitor 页面动态开启/关闭日志采集 | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
