---
title: "完整配置选项: 30+ 参数详解 | Antigravity Auth"
sidebarTitle: "自定义 30+ 参数"
subtitle: "Antigravity Auth 配置选项完整参考手册"
description: "学习 Antigravity Auth 插件的 30+ 配置选项。涵盖通用设置、会话恢复、账户选择策略、速率限制、令牌刷新等配置项的默认值和最佳实践。"
tags:
  - "配置参考"
  - "高级配置"
  - "完整手册"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Antigravity Auth 配置选项完整参考手册

## 学完你能做什么

- 找到并修改 Antigravity Auth 插件的所有配置选项
- 理解每个配置项的作用和适用场景
- 根据使用场景选择最佳配置组合
- 通过环境变量覆盖配置文件设置

## 核心思路

Antigravity Auth 插件通过配置文件控制几乎所有行为：从日志级别到账户选择策略，从会话恢复到令牌刷新机制。

::: info 配置文件位置（优先级从高到低）
1. **项目配置**：`.opencode/antigravity.json`
2. **用户配置**：
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip 环境变量优先级
所有配置项都可以通过环境变量覆盖，环境变量的优先级**高于**配置文件。
:::

## 配置概览

| 分类 | 配置项数量 | 核心场景 |
| --- | --- | --- |
| 通用设置 | 3 | 日志、调试模式 |
| 思考块 | 1 | 保留思考过程 |
| 会话恢复 | 3 | 错误自动恢复 |
| 签名缓存 | 4 | 思考块签名持久化 |
| 空响应重试 | 2 | 处理空响应 |
| 工具 ID 恢复 | 1 | 工具匹配 |
| 工具幻觉预防 | 1 | 防止参数错误 |
| 令牌刷新 | 3 | 主动刷新机制 |
| 速率限制 | 5 | 账户轮换与等待 |
| 健康评分 | 7 | Hybrid 策略评分 |
| 令牌桶 | 3 | Hybrid 策略令牌 |
| 自动更新 | 1 | 插件自动更新 |
| 网络搜索 | 2 | Gemini 搜索 |

---

## 通用设置

### `quiet_mode`

**类型**：`boolean`  
**默认值**：`false`  
**环境变量**：`OPENCODE_ANTIGRAVITY_QUIET=1`

抑制大多数 toast 通知（速率限制、账户切换等）。恢复通知（会话恢复成功）始终显示。

**适用场景**：
- 多账户高频使用场景，避免频繁通知干扰
- 自动化脚本或后台服务使用

**示例**：
```json
{
  "quiet_mode": true
}
```

### `debug`

**类型**：`boolean`  
**默认值**：`false`  
**环境变量**：`OPENCODE_ANTIGRAVITY_DEBUG=1`

启用调试日志到文件。日志文件默认存储在 `~/.config/opencode/antigravity-logs/`。

**适用场景**：
- 排查问题时启用
- 提交 Bug 报告时提供详细日志

::: danger 调试日志可能包含敏感信息
日志文件包含 API 响应、账户索引等信息，提交前请脱敏。
:::

### `log_dir`

**类型**：`string`  
**默认值**：OS 特定配置目录 + `/antigravity-logs`  
**环境变量**：`OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

自定义调试日志存储目录。

**适用场景**：
- 需要将日志存储到特定位置（如网络共享目录）
- 日志轮转和归档脚本

---

## 思考块设置

### `keep_thinking`

**类型**：`boolean`  
**默认值**：`false`  
**环境变量**：`OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning 实验性功能
保留 Claude 模型的思考块（通过签名缓存）。

**行为说明**：
- `false`（默认）：剥离思考块，避免签名错误，可靠性优先
- `true`：保留完整上下文（包括思考块），但可能遇到签名错误

**适用场景**：
- 需要查看模型的完整推理过程
- 对话中频繁使用思考内容

**不推荐场景**：
- 生产环境（可靠性优先）
- 多轮对话（容易触发签名冲突）

::: tip 搭配 `signature_cache` 使用
启用 `keep_thinking` 时，建议同时配置 `signature_cache` 提升签名命中率。
:::

---

## 会话恢复

### `session_recovery`

**类型**：`boolean`  
**默认值**：`true`

从 `tool_result_missing` 错误自动恢复会话。启用后，遇到可恢复错误时会显示 toast 通知。

**恢复的错误类型**：
- `tool_result_missing`：工具结果缺失（ESC 中断、超时、崩溃）
- `Expected thinking but found text`：思考块顺序错误

**适用场景**：
- 所有使用工具的场景（默认推荐启用）
- 长时间对话或工具执行频繁

### `auto_resume`

**类型**：`boolean`  
**默认值**：`false`

自动发送 "continue" 提示恢复会话。仅在 `session_recovery` 启用时生效。

**行为说明**：
- `false`：仅显示 toast 通知，用户需要手动发送 "continue"
- `true`：自动发送 "continue" 继续会话

**适用场景**：
- 自动化脚本或无人值守场景
- 希望完全自动化恢复流程

**不推荐场景**：
- 需要人工确认恢复结果
- 工具执行中断后需要检查状态再继续

### `resume_text`

**类型**：`string`  
**默认值**：`"continue"`

自动恢复时发送的自定义文本。仅在 `auto_resume` 启用时使用。

**适用场景**：
- 多语言环境（如改为"继续"、"请继续"）
- 需要额外提示词的场景

**示例**：
```json
{
  "auto_resume": true,
  "resume_text": "请继续完成之前的任务"
}
```

---

## 签名缓存

> 仅在 `keep_thinking` 启用时生效

### `signature_cache.enabled`

**类型**：`boolean`  
**默认值**：`true`

启用磁盘缓存思考块签名。

**作用**：缓存签名可以避免多轮对话中重复签名导致的错误。

### `signature_cache.memory_ttl_seconds`

**类型**：`number`（范围：60-86400）  
**默认值**：`3600`（1 小时）

内存缓存的过期时间（秒）。

### `signature_cache.disk_ttl_seconds`

**类型**：`number`（范围：3600-604800）  
**默认值**：`172800`（48 小时）

磁盘缓存的过期时间（秒）。

### `signature_cache.write_interval_seconds`

**类型**：`number`（范围：10-600）  
**默认值**：`60`

后台写入磁盘的间隔时间（秒）。

**示例**：
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## 空响应重试

当 Antigravity 返回空响应（无 candidates/choices）时自动重试。

### `empty_response_max_attempts`

**类型**：`number`（范围：1-10）  
**默认值**：`4`

最大重试次数。

### `empty_response_retry_delay_ms`

**类型**：`number`（范围：500-10000）  
**默认值**：`2000`（2 秒）

每次重试之间的延迟（毫秒）。

**适用场景**：
- 网络不稳定环境（增加重试次数）
- 需要快速失败（减少重试次数和延迟）

---

## 工具 ID 恢复

### `tool_id_recovery`

**类型**：`boolean`  
**默认值**：`true`

启用工具 ID 孤立恢复。当工具响应的 ID 不匹配（由于上下文压缩）时，尝试通过函数名匹配或创建占位符。

**作用**：提升多轮对话中工具调用的可靠性。

**适用场景**：
- 长对话场景（推荐启用）
- 频繁使用工具的场景

---

## 工具幻觉预防

### `claude_tool_hardening`

**类型**：`boolean`  
**默认值**：`true`

为 Claude 模型启用工具幻觉预防。启用后，自动注入：
- 参数签名到工具描述
- 严格的工具使用规则系统指令

**作用**：防止 Claude 使用训练数据中的参数名而非实际 schema 中的参数名。

**适用场景**：
- 使用 MCP 插件或自定义工具（推荐启用）
- 工具 schema 较复杂

**不推荐场景**：
- 确认工具调用完全符合 schema（可以关闭以减少额外提示）

---

## 主动令牌刷新

### `proactive_token_refresh`

**类型**：`boolean`  
**默认值**：`true`

启用主动后台令牌刷新。启用后，令牌会在过期前自动刷新，确保请求不会因刷新令牌而阻塞。

**作用**：避免请求等待令牌刷新的延迟。

### `proactive_refresh_buffer_seconds`

**类型**：`number`（范围：60-7200）  
**默认值**：`1800`（30 分钟）

令牌过期前多久触发主动刷新（秒）。

### `proactive_refresh_check_interval_seconds`

**类型**：`number`（范围：30-1800）  
**默认值**：`300`（5 分钟）

主动刷新检查的间隔时间（秒）。

**适用场景**：
- 高频请求场景（推荐启用主动刷新）
- 希望减少刷新失败风险（增加 buffer 时间）

---

## 速率限制与账户选择

### `max_rate_limit_wait_seconds`

**类型**：`number`（范围：0-3600）  
**默认值**：`300`（5 分钟）

所有账户都限速时的最大等待时间（秒）。如果所有账户的最小等待时间超过此阈值，插件会快速失败而非挂起。

**设置为 0**：禁用超时，无限期等待。

**适用场景**：
- 需要快速失败的场景（减少等待时间）
- 可接受长时间等待的场景（增加等待时间）

### `quota_fallback`

**类型**：`boolean`  
**默认值**：`false`

为 Gemini 模型启用配额回退。当首选配额池（Gemini CLI 或 Antigravity）耗尽时，尝试同一账户的备用配额池。

**适用场景**：
- Gemini 模型高频使用（推荐启用）
- 希望最大化每个账户的配额利用率

::: tip 仅在未显式指定配额后缀时生效
如果模型名显式包含 `:antigravity` 或 `:gemini-cli`，将始终使用指定配额池，不会回退。
:::

### `account_selection_strategy`

**类型**：`string`（枚举：`sticky`、`round-robin`、`hybrid`）  
**默认值**：`"hybrid"`  
**环境变量**：`OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

账户选择策略。

| 策略 | 说明 | 适用场景 |
| --- | --- | --- |
| `sticky` | 使用同一账户直到限速，保留提示缓存 | 单会话、缓存敏感场景 |
| `round-robin` | 每次请求轮换到下一个账户，最大化吞吐 | 多账户高吞吐场景 |
| `hybrid` | 基于健康评分 + 令牌桶 + LRU 的确定性选择 | 通用推荐，平衡性能与可靠性 |

::: info 详细说明
详见 [账户选择策略](/zh/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/) 章节。
:::

### `pid_offset_enabled`

**类型**：`boolean`  
**默认值**：`false`  
**环境变量**：`OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

启用基于 PID 的账户偏移。启用后，不同会话（PIDs）会优先选择不同的起始账户，有助于在运行多个并行代理时分配负载。

**行为说明**：
- `false`（默认）：所有会话从同一账户索引开始，保留 Anthropic 提示缓存（推荐单会话使用）
- `true`：根据 PID 偏移起始账户，分布负载（推荐多会话并行使用）

**适用场景**：
- 运行多个并行 OpenCode 会话
- 使用子代理或并行任务

### `switch_on_first_rate_limit`

**类型**：`boolean`  
**默认值**：`true`

在首次限速时立即切换账户（1 秒延迟后）。禁用后，会先重试同一账户，第二次限速时才切换。

**适用场景**：
- 希望快速切换账户（推荐启用）
- 希望最大化单账户配额（禁用）

---

## 健康评分（Hybrid 策略）

> 仅在 `account_selection_strategy` 为 `hybrid` 时生效

### `health_score.initial`

**类型**：`number`（范围：0-100）  
**默认值**：`70`

账户的初始健康评分。

### `health_score.success_reward`

**类型**：`number`（范围：0-10）  
**默认值**：`1`

每次成功请求增加的健康评分。

### `health_score.rate_limit_penalty`

**类型**：`number`（范围：-50-0）  
**默认值**：`-10`

每次限速扣除的健康评分。

### `health_score.failure_penalty`

**类型**：`number`（范围：-100-0）  
**默认值**：`-20`

每次失败扣除的健康评分。

### `health_score.recovery_rate_per_hour`

**类型**：`number`（范围：0-20）  
**默认值**：`2`

每小时恢复的健康评分。

### `health_score.min_usable`

**类型**：`number`（范围：0-100）  
**默认值**：`50`

账户可用的最低健康评分阈值。

### `health_score.max_score`

**类型**：`number`（范围：50-100）  
**默认值**：`100`

健康评分上限。

**适用场景**：
- 默认配置适用于大多数场景
- 高频限速环境可以降低 `rate_limit_penalty` 或增加 `recovery_rate_per_hour`
- 需要更快切换账户可以降低 `min_usable`

**示例**：
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## 令牌桶（Hybrid 策略）

> 仅在 `account_selection_strategy` 为 `hybrid` 时生效

### `token_bucket.max_tokens`

**类型**：`number`（范围：1-1000）  
**默认值**：`50`

令牌桶的最大容量。

### `token_bucket.regeneration_rate_per_minute`

**类型**：`number`（范围：0.1-60）  
**默认值**：`6`

每分钟生成的令牌数。

### `token_bucket.initial_tokens`

**类型**：`number`（范围：1-1000）  
**默认值**：`50`

账户初始令牌数。

**适用场景**：
- 高频请求场景可以增加 `max_tokens` 和 `regeneration_rate_per_minute`
- 希望更快轮换账户可以降低 `initial_tokens`

---

## 自动更新

### `auto_update`

**类型**：`boolean`  
**默认值**：`true`

启用插件自动更新。

**适用场景**：
- 希望自动获取最新功能（推荐启用）
- 需要固定版本（禁用）

---

## 网络搜索（Gemini Grounding）

### `web_search.default_mode`

**类型**：`string`（枚举：`auto`、`off`）  
**默认值**：`"off"`

网络搜索的默认模式（未通过 variant 指定时）。

| 模式 | 说明 |
| --- | --- |
| `auto` | 模型决定何时搜索（动态检索） |
| `off` | 默认禁用搜索 |

### `web_search.grounding_threshold`

**类型**：`number`（范围：0-1）  
**默认值**：`0.3`

动态检索阈值（0.0 到 1.0）。值越高，模型搜索频率越低（需要更高置信度才会触发搜索）。仅在 `auto` 模式下生效。

**适用场景**：
- 减少不必要搜索（提高阈值，如 0.5）
- 鼓励模型多搜索（降低阈值，如 0.2）

**示例**：
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## 配置示例

### 单账户基础配置

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### 多账户高性能配置

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### 调试与诊断配置

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### 保留思考块配置

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## 常见问题

### Q: 如何临时禁用某个配置？

**A**: 使用环境变量覆盖，无需修改配置文件。

```bash
# 临时启用调试模式
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# 临时启用安静模式
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### Q: 配置文件修改后需要重启 OpenCode 吗？

**A**: 是的，配置文件在 OpenCode 启动时加载，修改后需要重启。

### Q: 如何验证配置是否生效？

**A**: 启用 `debug` 模式，检查日志文件中的配置加载信息。

```json
{
  "debug": true
}
```

日志中会显示加载的配置：
```
[config] Loaded configuration: {...}
```

### Q: 哪些配置项最常需要调整？

**A**:
- `account_selection_strategy`：多账户场景选择合适的策略
- `quiet_mode`：减少通知干扰
- `session_recovery` / `auto_resume`：控制会话恢复行为
- `debug`：排查问题时启用

### Q: 配置文件有 JSON Schema 校验吗？

**A**: 是的，在配置文件中添加 `$schema` 字段可以启用 IDE 自动补全和校验：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| 配置 Schema 定义 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373   |
| JSON Schema  | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157   |
| 配置加载    | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | -       |

**关键常量**：
- `DEFAULT_CONFIG`：默认配置对象（`schema.ts:328-372`）

**关键类型**：
- `AntigravityConfig`：主配置类型（`schema.ts:322`）
- `SignatureCacheConfig`：签名缓存配置类型（`schema.ts:323`）
- `AccountSelectionStrategy`：账户选择策略类型（`schema.ts:22`）

</details>
