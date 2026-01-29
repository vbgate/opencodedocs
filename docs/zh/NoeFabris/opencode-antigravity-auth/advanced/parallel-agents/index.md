---
title: "PID 偏移: 优化并行代理账户分配 | Antigravity Auth"
sidebarTitle: "多代理不抢号"
subtitle: "并行代理优化：PID 偏移与账户分配"
description: "学习 PID 偏移如何优化 oh-my-opencode 并行代理的账户分配。涵盖配置方法、策略配合、效果验证及问题排查。"
tags:
  - "advanced"
  - "parallel-agents"
  - "pid-offset"
  - "oh-my-opencode"
  - "load-balancing"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
  - "advanced-multi-account-setup"
order: 5
---

# 并行代理优化：PID 偏移与账户分配

**PID 偏移**是一种基于进程 ID 的账户分配优化机制,通过 `process.pid % accounts.length` 计算偏移量,让多个 OpenCode 进程或 oh-my-opencode 并行代理优先选择不同的 Google 账户。当多个进程同时运行时,每个进程根据自己 PID 的余数自动选择不同的起始账户,有效避免了多个进程同时挤在同一账户上导致的 429 速率限制错误,显著提升了并行场景下的请求成功率和配额利用率,特别适合需要同时运行多个 Agent 或并行任务的开发者使用。

## 学完你能做什么

- 理解并行代理场景下的账户冲突问题
- 启用 PID 偏移功能,让不同进程优先选择不同账户
- 配合 round-robin 策略,最大化多账户利用率
- 排查并行代理中的速率限制和账户选择问题

## 你现在的困境

使用 oh-my-opencode 或同时运行多个 OpenCode 实例时,你可能会遇到:

- 多个子代理同时使用同一个账户,频繁遇到 429 速率限制
- 即使配置了多个账户,并发请求时仍然挤在同一账户上
- 不同进程启动时都从第一个账户开始,导致账户分配不均匀
- 请求失败后需要等待较长时间才能重试

## 什么时候用这一招

PID 偏移功能适合以下场景:

| 场景 | 是否需要 PID 偏移 | 原因 |
| ---- | --------------- | ---- |
| 单个 OpenCode 实例 | ❌ 不需要 | 单进程,不会账户冲突 |
| 手动切换多个账户 | ❌ 不需要 | 非并发,sticky 策略即可 |
| oh-my-opencode 多 Agent | ✅ 推荐 | 多进程并发,需要分散账户 |
| 同时运行多个 OpenCode | ✅ 推荐 | 不同进程独立 PID,自动分散 |
| CI/CD 并行任务 | ✅ 推荐 | 每个任务独立进程,避免竞争 |

::: warning 前置检查
开始本教程前,请确保你已经完成:
- ✅ 配置了至少 2 个 Google 账户
- ✅ 理解了账户选择策略的工作原理
- ✅ 使用 oh-my-opencode 或需要并行运行多个 OpenCode 实例

[多账户设置教程](../multi-account-setup/) | [账户选择策略教程](../account-selection-strategies/)
:::

## 核心思路

### 什么是 PID 偏移?

**PID (Process ID)** 是操作系统分配给每个进程的唯一标识符。当多个 OpenCode 进程同时运行时,每个进程都有不同的 PID。

**PID 偏移**是一种基于进程 ID 的账户分配优化:

```
假设有 3 个账户 (index: 0, 1, 2):

进程 A (PID=123):
  123 % 3 = 0 → 优先使用账户 0

进程 B (PID=456):
  456 % 3 = 1 → 优先使用账户 1

进程 C (PID=789):
  789 % 3 = 2 → 优先使用账户 2
```

每个进程根据自己 PID 的余数,优先选择不同的账户,避免一开始就挤在同一账户上。

### 为什么需要 PID 偏移?

没有 PID 偏移时,所有进程启动时都会从账户 0 开始:

```
时间线:
T1: 进程 A 启动 → 使用账户 0
T2: 进程 B 启动 → 使用账户 0  ← 冲突!
T3: 进程 C 启动 → 使用账户 0  ← 冲突!
```

启用 PID 偏移后:

```
时间线:
T1: 进程 A 启动 → PID 偏移 → 使用账户 0
T2: 进程 B 启动 → PID 偏移 → 使用账户 1  ← 分散!
T3: 进程 C 启动 → PID 偏移 → 使用账户 2  ← 分散!
```

### 与账户选择策略的配合

PID 偏移只在 sticky 策略的 fallback 阶段生效(round-robin 和 hybrid 策略有自己的分配逻辑):

| 策略 | PID 偏移是否生效 | 推荐场景 |
| ---- | --------------- | -------- |
| `sticky` | ✅ 生效 | 单进程 + prompt cache 优先 |
| `round-robin` | ❌ 不生效 | 多进程/并行代理,最大吞吐 |
| `hybrid` | ❌ 不生效 | 智能分配,健康评分优先 |

**为什么 round-robin 不需要 PID 偏移?**

round-robin 策略本身就会轮换账户:

```typescript
// 每次请求都切换到下一个账户
this.cursor++;
const account = available[this.cursor % available.length];
```

多个进程会自然地分散在不同账户上,不需要额外的 PID 偏移。

::: tip 最佳实践
对于并行代理场景,推荐配置:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // round-robin 不需要
}
```

如果必须使用 sticky 或 hybrid 策略,再启用 PID 偏移。
:::

## 跟我做

### 第 1 步：确认多账户配置

**为什么**
PID 偏移至少需要 2 个账户才能发挥作用。如果只有 1 个账户,无论 PID 余数是什么,都只能使用这个账户。

**操作**

检查当前账户数量:

```bash
opencode auth list
```

你应该看到至少 2 个账户:

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

如果只有 1 个账户,先添加更多账户:

```bash
opencode auth login
```

按照提示选择 `(a)dd new account(s)`。

**你应该看到**: 账户列表显示 2 个或更多账户。

### 第 2 步：配置 PID 偏移

**为什么**
通过配置文件启用 PID 偏移功能,让插件在账户选择时考虑进程 ID。

**操作**

打开 OpenCode 配置文件:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

添加或修改以下配置:

```json
{
  "pid_offset_enabled": true
}
```

完整配置示例(配合 sticky 策略):

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**环境变量方式**(可选):

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**你应该看到**: 配置文件中 `pid_offset_enabled` 设置为 `true`。

### 第 3 步：验证 PID 偏移效果

**为什么**
通过实际运行多个进程,验证 PID 偏移是否生效,不同进程是否优先使用不同账户。

**操作**

打开两个终端窗口,分别运行 OpenCode:

**终端 1**:
```bash
opencode chat
# 发送一个请求,记录使用的账户(查看日志或 toast)
```

**终端 2**:
```bash
opencode chat
# 发送一个请求,记录使用的账户
```

观察账户选择行为:

- ✅ **期望**: 两个终端优先使用不同的账户
- ❌ **问题**: 两个终端都使用同一个账户

如果问题持续,检查:

1. 配置是否正确加载
2. 账户选择策略是否为 `sticky`(round-robin 不需要 PID 偏移)
3. 是否只有 1 个账户

启用调试日志查看详细账户选择过程:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

日志中会显示:

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**你应该看到**: 不同终端优先使用不同的账户,或日志中显示 PID 偏移已应用。

### 第 4 步：(可选)配合 round-robin 策略

**为什么**
round-robin 策略本身会轮换账户,不需要 PID 偏移。但对于高频并发的并行代理,round-robin 是更好的选择。

**操作**

修改配置文件:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

启动多个 oh-my-opencode Agent,观察请求分布:

```
Agent 1 → 账户 0 → 账户 1 → 账户 2 → 账户 0 ...
Agent 2 → 账户 1 → 账户 2 → 账户 0 → 账户 1 ...
```

每个 Agent 都独立轮换,充分利用所有账户的配额。

**你应该看到**: 请求均匀分布在所有账户上,每个 Agent 都独立轮换。

## 检查点 ✅

完成以上步骤后,你应该能够:

- [ ] 成功配置至少 2 个 Google 账户
- [ ] 在 `antigravity.json` 中启用 `pid_offset_enabled`
- [ ] 运行多个 OpenCode 实例时,不同进程优先使用不同账户
- [ ] 理解 round-robin 不需要 PID 偏移的原因
- [ ] 使用调试日志查看账户选择过程

## 踩坑提醒

### 问题 1: 启用后没有效果

**症状**: 配置了 `pid_offset_enabled: true`,但多个进程仍然使用同一个账户。

**原因**: 可能是账户选择策略为 `round-robin` 或 `hybrid`,这两种策略不使用 PID 偏移。

**解决**: 切换到 `sticky` 策略,或理解当前策略不需要 PID 偏移。

```json
{
  "account_selection_strategy": "sticky",  // 改为 sticky
  "pid_offset_enabled": true
}
```

### 问题 2: 只有 1 个账户

**症状**: 启用 PID 偏移后,所有进程仍然使用账户 0。

**原因**: PID 偏移通过 `process.pid % accounts.length` 计算,只有 1 个账户时,余数永远是 0。

**解决**: 添加更多账户:

```bash
opencode auth login
# 选择 (a)dd new account(s)
```

### 问题 3: Prompt cache 失效

**症状**: 启用 PID 偏移后,发现 Anthropic 的 prompt cache 不再生效。

**原因**: PID 偏移可能导致不同进程或会话使用不同账户,而 prompt cache 是按账户共享的。切换账户后,需要重新发送提示词。

**解决**: 这是预期行为。如果 prompt cache 优先级更高,禁用 PID 偏移,使用 sticky 策略:

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### 问题 4: oh-my-opencode 多 Agent 冲突

**症状**: 即使配置了多账户,oh-my-opencode 的多个 Agent 仍然频繁遇到 429 错误。

**原因**: oh-my-opencode 可能按顺序启动 Agent,短时间内多个 Agent 同时请求同一账户。

**解决**:

1. 使用 `round-robin` 策略(推荐):

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. 或增加账户数量,确保每个 Agent 都有独立账户:

```bash
# 如果有 3 个 Agent,建议至少 5 个账户
opencode auth login
```

## 本课小结

PID 偏移功能通过进程 ID (PID) 来优化多进程场景下的账户分配:

- **原理**: `process.pid % accounts.length` 计算偏移量
- **作用**: 让不同进程优先选择不同账户,避免冲突
- **限制**: 只在 sticky 策略下生效,round-robin 和 hybrid 不需要
- **最佳实践**: 并行代理场景推荐 round-robin 策略,无需 PID 偏移

配置多账户后,根据你的使用场景选择合适的策略:

| 场景 | 推荐策略 | PID 偏移 |
| ---- | -------- | -------- |
| 单进程, prompt cache 优先 | sticky | 否 |
| 多进程/并行代理 | round-robin | 否 |
| hybrid 策略 + 分散启动 | hybrid | 可选 |

## 下一课预告

> 下一课我们学习 **[配置选项完整指南](../configuration-guide/)**。
>
> 你会学到：
> - 配置文件的位置和优先级
> - 模型行为、账户轮换和应用行为的配置选项
> - 不同场景下的推荐配置方案
> - 高级配置调优方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| PID 偏移实现 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| 配置 Schema 定义 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| 环境变量支持 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| 配置传入位置 | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| 使用文档 | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| 配置指南 | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**关键函数**:
- `getCurrentOrNextForFamily()`: 账户选择主函数,内部处理 PID 偏移逻辑
- `process.pid % this.accounts.length`: 计算偏移量的核心公式

**关键常量**:
- `sessionOffsetApplied[family]`: 每个模型族的偏移应用标记(每会话只应用一次)

</details>
