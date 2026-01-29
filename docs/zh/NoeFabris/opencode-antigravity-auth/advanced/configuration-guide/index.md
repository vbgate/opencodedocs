---
title: "配置指南: 完整配置选项详解 | Antigravity Auth"
sidebarTitle: "配置全搞定"
subtitle: "配置选项完整指南"
description: "掌握 Antigravity Auth 插件的完整配置选项。详解配置文件位置、模型行为、账户轮换策略和应用行为设置，提供单账户、多账户和并行代理场景的推荐配置方案。"
tags:
  - "配置"
  - "高级配置"
  - "多账户"
  - "账户轮换"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# 配置选项完整指南

## 学完你能做什么

- ✅ 在正确的位置创建配置文件
- ✅ 根据使用场景选择合适的配置方案
- ✅ 理解所有配置选项的作用和默认值
- ✅ 使用环境变量临时覆盖配置
- ✅ 调整模型行为、账户轮换和插件行为

## 你现在的困境

配置选项太多，不知道从哪里开始？默认配置能用，但想进一步优化？多账户场景下不清楚应该用哪种轮换策略？

## 核心思路

配置文件就像给插件写「使用说明书」——你告诉它怎么工作，它就按你的方式执行。Antigravity Auth 插件提供了丰富的配置选项，但大多数用户只需要配置几个核心选项。

### 配置文件优先级

配置项的优先级从高到低：

1. **环境变量**（临时覆盖）
2. **项目级配置** `.opencode/antigravity.json`（当前项目）
3. **用户级配置** `~/.config/opencode/antigravity.json`（全局）

::: info
环境变量优先级最高，适合临时测试。配置文件适合持久化设置。
:::

### 配置文件位置

根据操作系统，用户级配置文件位置不同：

| 系统 | 路径 |
|------|------|
| Linux/macOS | `~/.config/opencode/antigravity.json` |
| Windows | `%APPDATA%\opencode\antigravity.json` |

项目级配置文件始终在项目根目录的 `.opencode/antigravity.json`。

### 配置选项分类

配置选项分为四大类：

1. **模型行为**：思考块、会话恢复、Google Search
2. **账户轮换**：多账户管理、选择策略、PID 偏移
3. **应用行为**：调试日志、自动更新、通知静默
4. **高级设置**：错误恢复、令牌管理、健康评分

---

## 🎒 开始前的准备

- [x] 已完成插件安装（参考[快速安装](../../start/quick-install/)）
- [x] 已配置至少一个 Google 账户
- [x] 了解 JSON 基本语法

---

## 跟我做

### 第 1 步：创建配置文件

**为什么**：配置文件让插件按你的需求工作

根据操作系统选择对应路径创建配置文件：

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## 使用 PowerShell
$env:APPDATA\opencode\antigravity.json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**你应该看到**：文件创建成功，内容只有 `$schema` 字段。

::: tip
添加 `$schema` 字段后，VS Code 会自动提供智能提示和类型检查。
:::

### 第 2 步：配置基础选项

**为什么**：根据你的使用场景优化插件行为

根据你的配置选择以下方案之一：

**场景 A：单账户 + 需要 Google Search**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**场景 B：2-3 个账户 + 智能轮换**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**场景 C：多账户 + 并行代理**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**你应该看到**：配置文件保存成功，OpenCode 自动重新加载插件配置。

### 第 3 步：验证配置

**为什么**：确认配置生效

在 OpenCode 中发起一个模型请求，观察：

1. 单账户使用 `sticky` 策略：所有请求使用同一账户
2. 多账户使用 `hybrid` 策略：请求会智能分配到不同账户
3. Gemini 模型启用 `web_search`：模型在需要时会搜索网络

**你应该看到**：插件行为符合你的配置预期。

---

## 配置选项详解

### 模型行为

这些选项影响模型的思考和响应方式。

#### keep_thinking

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | - | 保留 Claude 思考块，跨轮次保持连贯性 |
| `false` | ✓ | 剥离思考块，更稳定，上下文更小 |

::: warning 注意
启用 `keep_thinking` 可能导致模型稳定性下降和签名错误。推荐保持 `false`。
:::

#### session_recovery

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | ✓ | 自动恢复工具调用中断的会话 |
| `false` | - | 遇到错误时不自动恢复 |

#### auto_resume

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | - | 恢复后自动发送 "continue" |
| `false` | ✓ | 恢复后只显示提示，手动继续 |

#### resume_text

自定义恢复时发送的文本。默认为 `"continue"`，你可以改为任何文本。

#### web_search

| 选项 | 默认值 | 说明 |
|------|-------|------|
| `default_mode` | `"off"` | `"auto"` 或 `"off"` |
| `grounding_threshold` | `0.3` | 搜索阈值（0=总是搜索，1=从不搜索） |

::: info
`grounding_threshold` 仅在 `default_mode: "auto"` 时生效。值越大，模型搜索越保守。
:::

---

### 账户轮换

这些选项管理多账户的请求分配。

#### account_selection_strategy

| 策略 | 默认值 | 适用场景 |
|------|-------|---------|
| `sticky` | - | 单账户，保留 prompt cache |
| `round-robin` | - | 4+ 账户，最大化吞吐量 |
| `hybrid` | ✓ | 2-3 账户，智能轮换 |

::: tip
不同账户数的推荐策略：
- 1 个账户 → `sticky`
- 2-3 个账户 → `hybrid`
- 4+ 个账户 → `round-robin`
- 并行代理 → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | ✓ | 第一次遇到 429 立即切换账户 |
| `false` | - | 先重试当前账户，第二次 429 才切换 |

#### pid_offset_enabled

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | - | 不同会话（PID）使用不同起始账户 |
| `false` | ✓ | 所有会话从同一账户开始 |

::: tip
单会话使用保持 `false`，保留 Anthropic prompt cache。多会话并行建议启用 `true`。
:::

#### quota_fallback

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | - | Gemini 模型配额池 fallback |
| `false` | ✓ | 不启用 fallback |

::: info
仅适用于 Gemini 模型。当主配额池耗尽时，尝试同一账户的备用配额池。
:::

---

### 应用行为

这些选项控制插件本身的行为。

#### quiet_mode

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | - | 静默大多数 toast 通知（恢复通知除外） |
| `false` | ✓ | 显示所有通知 |

#### debug

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | - | 启用调试日志 |
| `false` | ✓ | 不记录调试日志 |

::: tip
临时启用调试日志无需修改配置文件，使用环境变量：
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # 基础日志
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # 详细日志
```
:::

#### log_dir

自定义调试日志目录。默认为 `~/.config/opencode/antigravity-logs/`。

#### auto_update

| 值 | 默认值 | 说明 |
|----|-------|------|
| `true` | ✓ | 自动检查并更新插件 |
| `false` | - | 不自动更新 |

---

### 高级设置

这些选项用于边缘场景，大多数用户不需要修改。

<details>
<summary><strong>展开查看高级设置</strong></summary>

#### 错误恢复

| 选项 | 默认值 | 说明 |
|------|-------|------|
| `empty_response_max_attempts` | `4` | 空响应重试次数 |
| `empty_response_retry_delay_ms` | `2000` | 重试间隔（毫秒） |
| `tool_id_recovery` | `true` | 修复工具 ID 不匹配 |
| `claude_tool_hardening` | `true` | 防止工具参数幻觉 |
| `max_rate_limit_wait_seconds` | `300` | 限速最大等待时间（0=无限） |

#### 令牌管理

| 选项 | 默认值 | 说明 |
|------|-------|------|
| `proactive_token_refresh` | `true` | 过期前主动刷新令牌 |
| `proactive_refresh_buffer_seconds` | `1800` | 提前 30 分钟刷新 |
| `proactive_refresh_check_interval_seconds` | `300` | 刷新检查间隔（秒） |

#### 签名缓存（`keep_thinking: true` 时生效）

| 选项 | 默认值 | 说明 |
|------|-------|------|
| `signature_cache.enabled` | `true` | 启用磁盘缓存 |
| `signature_cache.memory_ttl_seconds` | `3600` | 内存缓存 TTL（1 小时） |
| `signature_cache.disk_ttl_seconds` | `172800` | 磁盘缓存 TTL（48 小时） |
| `signature_cache.write_interval_seconds` | `60` | 后台写入间隔（秒） |

#### 健康评分（`hybrid` 策略使用）

| 选项 | 默认值 | 说明 |
|------|-------|------|
| `health_score.initial` | `70` | 初始健康分 |
| `health_score.success_reward` | `1` | 成功奖励分数 |
| `health_score.rate_limit_penalty` | `-10` | 限速惩罚分数 |
| `health_score.failure_penalty` | `-20` | 失败惩罚分数 |
| `health_score.recovery_rate_per_hour` | `2` | 每小时恢复分数 |
| `health_score.min_usable` | `50` | 可用账户最低分数 |
| `health_score.max_score` | `100` | 健康分上限 |

#### Token Bucket（`hybrid` 策略使用）

| 选项 | 默认值 | 说明 |
|------|-------|------|
| `token_bucket.max_tokens` | `50` | 桶最大容量 |
| `token_bucket.regeneration_rate_per_minute` | `6` | 每分钟恢复速度 |
| `token_bucket.initial_tokens` | `50` | 初始令牌数 |

</details>

---

## 推荐配置方案

### 单账户配置

适合：只有一个 Google 账户的用户

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**配置说明**：
- `sticky`：不轮换，保留 Anthropic prompt cache
- `web_search: auto`：Gemini 可根据需要搜索

### 2-3 账户配置

适合：小团队或需要一定弹性的用户

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**配置说明**：
- `hybrid`：智能轮换，健康评分选择最佳账户
- `web_search: auto`：Gemini 可根据需要搜索

### 多账户 + 并行代理配置

适合：运行多个并发代理的用户

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**配置说明**：
- `round-robin`：每次请求轮换账户
- `switch_on_first_rate_limit: true`：第一次 429 立即切换
- `pid_offset_enabled: true`：不同会话使用不同起始账户
- `web_search: auto`：Gemini 可根据需要搜索

---

## 踩坑提醒

### ❌ 错误：修改配置后没有生效

**原因**：OpenCode 可能没有重新加载配置文件。

**解决方法**：重启 OpenCode 或检查 JSON 语法是否正确。

### ❌ 错误：配置文件 JSON 格式错误

**原因**：JSON 语法错误（缺少逗号、多余的逗号、注释等）。

**解决方法**：使用 JSON 验证工具检查，或添加 `$schema` 字段启用 IDE 智能提示。

### ❌ 错误：环境变量没有生效

**原因**：环境变量名拼写错误或没有重启 OpenCode。

**解决方法**：确认变量名为 `OPENCODE_ANTIGRAVITY_*`（全大写，前缀正确），重启 OpenCode。

### ❌ 错误：启用 `keep_thinking: true` 后频繁出错

**原因**：思考块签名不匹配。

**解决方法**：保持 `keep_thinking: false`（默认值），或调整 `signature_cache` 配置。

---

## 本课小结

配置文件位置优先级：环境变量 > 项目级 > 用户级。

核心配置项：
- 模型行为：`keep_thinking`、`session_recovery`、`web_search`
- 账户轮换：`account_selection_strategy`、`pid_offset_enabled`
- 应用行为：`debug`、`quiet_mode`、`auto_update`

不同场景推荐配置：
- 单账户：`sticky`
- 2-3 账户：`hybrid`
- 4+ 账户：`round-robin`
- 并行代理：`round-robin` + `pid_offset_enabled: true`

---

## 下一课预告

> 下一课我们学习 **[调试日志](../debug-logging/)**。
>
> 你会学到：
> - 如何启用调试日志
> - 如何解读日志内容
> - 如何排查常见问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 配置 Schema 定义 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| 默认配置值 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| 配置加载逻辑 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**关键常量**：
- `DEFAULT_CONFIG`: 所有配置项的默认值

**关键类型**：
- `AntigravityConfig`: 配置对象类型
- `AccountSelectionStrategy`: 账户选择策略类型
- `SignatureCacheConfig`: 签名缓存配置类型

</details>
