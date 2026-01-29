---
title: "存储模型: 数据结构 | Antigravity Tools"
sidebarTitle: "数据都在哪"
subtitle: "数据与模型：账号文件、SQLite 统计库与关键字段口径"
description: "学习 Antigravity Tools 的数据存储结构。掌握 accounts.json、账号文件、token_stats.db/proxy_logs.db 的位置与字段含义。"
tags:
  - "附录"
  - "数据模型"
  - "存储结构"
  - "备份"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# 数据与模型：账号文件、SQLite 统计库与关键字段口径

## 学完你能做什么

- 快速定位账号数据、统计库、配置文件、日志目录的存储位置
- 理解账号文件的 JSON 结构与关键字段含义
- 通过 SQLite 直接查询代理请求日志和 Token 消耗统计
- 在备份、迁移、故障排查时知道该看哪些文件

## 你现在的困境

当你需要：
- **迁移账号到新机器**：不知道该复制哪些文件
- **排查账号异常**：账号文件里有哪些字段可以判断账号状态
- **导出 Token 消耗**：想直接从数据库查询，不知道表结构
- **清理历史数据**：担心删错文件导致数据丢失

本附录会帮你建立完整的数据模型认知。

---

## 数据目录结构

Antigravity Tools 的核心数据默认存储在「用户主目录」下的 `.antigravity_tools` 目录里（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`）。

::: warning 先说清楚安全边界
这个目录里会包含 `refresh_token`/`access_token` 等敏感信息（来源：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`）。备份/拷贝/共享前，先确认你的目标环境是可信的。
:::

### 我应该去哪里找这个目录？

::: code-group

```bash [macOS/Linux]
## 进入数据目录
cd ~/.antigravity_tools

## 或者在 Finder 打开（macOS）
open ~/.antigravity_tools
```

```powershell [Windows]
## 进入数据目录
Set-Location "$env:USERPROFILE\.antigravity_tools"

## 或者在资源管理器打开
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### 目录树概览

```
~/.antigravity_tools/
├── accounts.json          # 账号索引（版本 2.0）
├── accounts/              # 账号目录
│   └── <account_id>.json  # 每个账号一个文件
├── gui_config.json        # 应用配置（GUI 写入）
├── token_stats.db         # Token 统计库（SQLite）
├── proxy_logs.db          # Proxy 监控日志库（SQLite）
├── logs/                  # 应用日志目录
│   └── app.log*           # 按天滚动（文件名随日期变化）
├── bin/                   # 外部工具（如 cloudflared）
│   └── cloudflared(.exe)
└── device_original.json   # 设备指纹基线（可选）
```

**数据目录路径规则**：取 `dirs::home_dir()`，拼上 `.antigravity_tools`（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`）。

::: tip 备份建议
定期备份 `accounts/` 目录、`accounts.json`、`token_stats.db` 和 `proxy_logs.db` 即可保存所有核心数据。
:::

---

## 账号数据模型

### accounts.json（账号索引）

账号索引文件记录了所有账号的摘要信息和当前选中的账号。

**位置**：`~/.antigravity_tools/accounts.json`

**Schema**（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`）：

```json
{
  "version": "2.0",                  // 索引版本
  "accounts": [                       // 账号摘要列表
    {
      "id": "uuid-v4",              // 账号唯一 ID
      "email": "user@gmail.com",     // 账号邮箱
      "name": "Display Name",        // 显示名称（可选）
      "created_at": 1704067200,      // 创建时间（Unix 时间戳）
      "last_used": 1704067200       // 最后使用时间（Unix 时间戳）
    }
  ],
  "current_account_id": "uuid-v4"    // 当前选中的账号 ID
}
```

### 账号文件（{account_id}.json）

每个账号的完整数据以 JSON 格式独立存储在 `accounts/` 目录下。

**位置**：`~/.antigravity_tools/accounts/{account_id}.json`

**Schema**（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`；前端类型：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`）：

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // OAuth Token 数据
    "access_token": "ya29...",      // 当前访问令牌
    "refresh_token": "1//...",      // 刷新令牌（最重要）
    "expires_in": 3600,            // 过期时间（秒）
    "expiry_timestamp": 1704070800, // 过期时间戳
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // 可选：Google Cloud 项目ID
    "session_id": "..."            // 可选：Antigravity sessionId
  },

  "device_profile": {               // 设备指纹（可选）
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // 设备指纹历史版本
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // 配额数据（可选）
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // 剩余配额百分比
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // 订阅类型：FREE/PRO/ULTRA
  },

  "disabled": false,                // 账号是否彻底禁用
  "disabled_reason": null,          // 禁用原因（如 invalid_grant）
  "disabled_at": null,             // 禁用时间戳

  "proxy_disabled": false,         // 是否禁用代理功能
  "proxy_disabled_reason": null,   // 代理禁用原因
  "proxy_disabled_at": null,       // 代理禁用时间戳

  "protected_models": [             // 受配额保护的模型列表
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### 关键字段说明

| 字段 | 类型 | 业务含义 | 触发条件 |
|--- | --- | --- | ---|
| `disabled` | bool | 账号被彻底禁用（如 refresh_token 失效） | `invalid_grant` 时自动设为 `true` |
| `proxy_disabled` | bool | 仅禁用代理功能，不影响 GUI 使用 | 手动禁用或配额保护触发 |
| `protected_models` | string[] | 模型级配额保护的“受限模型列表” | 由配额保护逻辑更新 |
| `quota.models[].percentage` | number | 剩余配额百分比（0-100） | 每次刷新配额时更新 |
| `token.refresh_token` | string | 用于获取 access_token 的凭据 | OAuth 授权时获取，长期有效 |

**重要规则 1：invalid_grant 会触发禁用**（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`；写盘：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`）：

- 当 token 刷新失败且错误包含 `invalid_grant` 时，TokenManager 会把账号文件写入 `disabled=true` / `disabled_at` / `disabled_reason`，并把账号从 token 池移除。

**重要规则 2：protected_models 的语义**（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`；配额保护写入：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`）：

- `protected_models` 里存的是“标准化后的模型 ID”，用来做模型级的配额保护与调度跳过。

---

## Token 统计数据库

Token 统计库记录了每次代理请求的 Token 消耗，用于成本监控与趋势分析。

**位置**：`~/.antigravity_tools/token_stats.db`

**数据库引擎**：SQLite + WAL 模式（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`）

### 表结构

#### token_usage（原始使用记录）

| 字段 | 类型 | 说明 |
|--- | --- | ---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 自增主键 |
| timestamp | INTEGER | 请求时间戳 |
| account_email | TEXT | 账号邮箱 |
| model | TEXT | 模型名称 |
| input_tokens | INTEGER | 输入 Token 数 |
| output_tokens | INTEGER | 输出 Token 数 |
| total_tokens | INTEGER | 总 Token 数 |

**建表语句**（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`）：

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly（小时聚合表）

每小时聚合一次 Token 使用量，用于快速查询趋势数据。

**建表语句**（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`）：

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- 时间桶（格式：YYYY-MM-DD HH:00）
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### 索引

为了提升查询性能，数据库建立了以下索引（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`）：

```sql
-- 按时间降序索引
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- 按账号索引
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### 常用查询示例

#### 查询最近 24 小时的 Token 消耗

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### 按模型统计消耗

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info 时间字段的口径
`token_usage.timestamp` 是 `chrono::Utc::now().timestamp()` 写入的 Unix 时间戳（秒），`token_stats_hourly.hour_bucket` 也是按 UTC 生成的字符串（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`）。
:::

---

## Proxy 监控日志数据库

Proxy 日志库记录了每次代理请求的详细信息，用于故障排查与请求审计。

**位置**：`~/.antigravity_tools/proxy_logs.db`

**数据库引擎**：SQLite + WAL 模式（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`）

### 表结构：request_logs

| 字段 | 类型 | 说明 |
|--- | --- | ---|
| id | TEXT PRIMARY KEY | 请求唯一 ID（UUID） |
| timestamp | INTEGER | 请求时间戳 |
| method | TEXT | HTTP 方法（GET/POST） |
| url | TEXT | 请求 URL |
| status | INTEGER | HTTP 状态码 |
| duration | INTEGER | 请求耗时（毫秒） |
| model | TEXT | 客户端请求的模型名 |
| mapped_model | TEXT | 实际路由后使用的模型名 |
| account_email | TEXT | 使用的账号邮箱 |
| error | TEXT | 错误信息（如有） |
| request_body | TEXT | 请求体（可选，占用空间大） |
| response_body | TEXT | 响应体（可选，占用空间大） |
| input_tokens | INTEGER | 输入 Token 数 |
| output_tokens | INTEGER | 输出 Token 数 |
| protocol | TEXT | 协议类型（openai/anthropic/gemini） |

**建表语句**（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`）：

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- 兼容性：通过 ALTER TABLE 逐步添加新字段
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### 索引

```sql
-- 按时间降序索引
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- 按状态码索引
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### 自动清理

系统启动 ProxyMonitor 时，会自动清理 30 天前的日志，并对数据库做 `VACUUM`（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`；实现：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`）。

### 常用查询示例

#### 查询最近的失败请求

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### 统计每个账号的请求成功率

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## 配置文件

### gui_config.json

存储应用的配置信息，包括代理设置、模型映射、鉴权模式等。

**位置**：`~/.antigravity_tools/gui_config.json`（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`）

这个文件的结构以 `AppConfig` 为准（来源：`source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`）。

::: tip 你需要“只为备份/迁移”时
最省心的做法是：关掉应用后直接打包整个 `~/.antigravity_tools/`。配置热更新/重启语义属于“运行时行为”，建议看进阶课 **[配置全解](../../advanced/config/)**。
:::

---

## 日志文件

### 应用日志

**位置**：`~/.antigravity_tools/logs/`（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`）

日志使用按天滚动文件，基础文件名是 `app.log`（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`）。

**日志级别**：INFO/WARN/ERROR

**用途**：记录应用运行时的关键事件、错误信息和调试信息，用于故障排查。

---

## 数据迁移与备份

### 备份核心数据

::: code-group

```bash [macOS/Linux]
## 备份整个数据目录（最稳）
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## 备份整个数据目录（最稳）
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### 迁移到新机器

1. 关闭 Antigravity Tools（避免写盘中途被拷走）
2. 复制源机器的 `.antigravity_tools` 到目标机器的用户主目录下
3. 启动 Antigravity Tools

::: tip 跨平台迁移
如果从 Windows 迁移到 macOS/Linux（或反之），只需复制整个 `.antigravity_tools` 目录即可，数据格式跨平台兼容。
:::

### 清理历史数据

::: info 先说结论
- `proxy_logs.db`：有自动清理 30 天（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`）。
- `token_stats.db`：启动时会初始化表结构（来源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`），但源码里没有看到“按天自动清理历史记录”的逻辑。
:::

::: danger 只在你确认不需要历史数据时做
清空统计/日志会让你失去历史排障与成本分析数据。动手前先备份整个 `.antigravity_tools`。
:::

如果你只是想“清空历史并重新开始”，最稳的方式是关掉应用后直接删掉 DB 文件（下次启动会重建表结构）。

::: code-group

```bash [macOS/Linux]
## 清空 Token 统计（会丢失历史）
rm -f ~/.antigravity_tools/token_stats.db

## 清空 Proxy 监控日志（会丢失历史）
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## 清空 Token 统计（会丢失历史）
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## 清空 Proxy 监控日志（会丢失历史）
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## 常见字段口径说明

### Unix 时间戳

所有时间相关字段（如 `created_at`、`last_used`、`timestamp`）使用 Unix 时间戳（秒级精度）。

**转换为可读时间**：

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## SQLite 查询（示例：把 request_logs.timestamp 转成人类可读时间）
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### 配额百分比

`quota.models[].percentage` 表示剩余配额百分比（0-100）（来源：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`；后端模型：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`）。

是否触发“配额保护”，由 `quota_protection.enabled/threshold_percentage/monitored_models` 决定（来源：`source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`；写入 `protected_models`：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`）。

---

## 本课小结

- Antigravity Tools 的数据目录在用户主目录下的 `.antigravity_tools`
- 账号数据：`accounts.json`（索引）+ `accounts/<account_id>.json`（单账号完整数据）
- 统计数据：`token_stats.db`（Token 统计）+ `proxy_logs.db`（Proxy 监控日志）
- 配置与运维：`gui_config.json`、`logs/`、`bin/cloudflared*`、`device_original.json`
- 备份/迁移最稳的方式是“关闭应用后整体打包 `.antigravity_tools`”

---

## 下一课预告

> 下一课我们学习 **[z.ai 集成能力边界](../zai-boundaries/)**。
>
> 你会学到：
> - z.ai 集成的已实现功能清单
> - 明确未实现的功能与使用限制
> - Vision MCP 的实验性实现说明

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 数据目录（.antigravity_tools） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| 账号目录（accounts/） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| accounts.json 结构 | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Account 结构（后端） | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Account 结构（前端） | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| TokenData/QuotaData 结构 | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| TokenData/QuotaData 结构 | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Token 统计库初始化（schema） | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Proxy 日志库初始化（schema） | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Proxy 日志自动清理（30天） | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Proxy 日志自动清理实现 | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| gui_config.json 读写 | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| logs/ 目录与 app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| bin/cloudflared 路径 | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
|--- | --- | ---|

**关键常量**：
- `DATA_DIR = ".antigravity_tools"`：数据目录名称（`src-tauri/src/modules/account.rs:16-18`）
- `ACCOUNTS_INDEX = "accounts.json"`：账号索引文件名（`src-tauri/src/modules/account.rs:16-18`）
- `CONFIG_FILE = "gui_config.json"`：配置文件名（`src-tauri/src/modules/config.rs:7`）

**关键函数**：
- `get_data_dir()`：获取数据目录路径（`src-tauri/src/modules/account.rs`）
- `record_usage()`：写入 `token_usage`/`token_stats_hourly`（`src-tauri/src/modules/token_stats.rs`）
- `save_log()`：写入 `request_logs`（`src-tauri/src/modules/proxy_db.rs`）
- `cleanup_old_logs(days)`：删除旧 `request_logs` 并 `VACUUM`（`src-tauri/src/modules/proxy_db.rs`）

</details>
