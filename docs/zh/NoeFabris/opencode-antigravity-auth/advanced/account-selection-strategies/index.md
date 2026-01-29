---
title: "账户选择策略: 多账户轮换配置 | Antigravity Auth"
sidebarTitle: "选对策略不浪费配额"
subtitle: "账户选择策略：sticky、round-robin、hybrid 最佳实践"
description: "学习 sticky、round-robin、hybrid 三种账户选择策略。根据账户数量选择最佳配置，优化配额利用率和请求分布，避免被限速。"
tags:
  - "多账户"
  - "负载均衡"
  - "配置"
  - "进阶"
prerequisite:
  - "advanced-multi-account-setup"
order: 1
---

# 账户选择策略：sticky、round-robin、hybrid 最佳实践

## 学完你能做什么

根据你的 Google 账户数量和使用场景，选择并配置合适的账户选择策略：
- 1 个账户 → 用 `sticky` 策略保留 prompt 缓存
- 2-3 个账户 → 用 `hybrid` 策略智能分布请求
- 4+ 个账户 → 用 `round-robin` 策略最大化吞吐量

避免"所有账户都被限速，但实际配额没用完"的尴尬。

## 你现在的困境

配置了多个 Google 账户，但：
- 不确定该用哪种策略才能最大化配额利用率
- 经常遇到所有账户都被限速，但某个账户的配额还没用完
- 并行代理场景下，多个子进程总是用同一个账户，导致限速

## 核心思路

### 什么是账户选择策略

Antigravity Auth 插件支持三种账户选择策略，决定如何在多个 Google 账户之间分配模型请求：

| 策略 | 行为 | 适用场景 |
|--- | --- | ---|
| `sticky` | 除非当前账户被限速，否则一直用同一个账户 | 单账户、需要 prompt 缓存 |
| `round-robin` | 每次请求轮换到下一个可用账户 | 多账户、最大化吞吐量 |
| `hybrid`（默认） | 结合健康评分 + Token bucket + LRU 智能选择 | 2-3 个账户、平衡性能与稳定性 |

::: info 为什么需要策略？
Google 对每个账户都有速率限制。如果只有一个账户，频繁请求很容易被限速。多账户可以通过轮换或智能选择，分散请求，避免单个账户过度消耗配额。
:::

### 三种策略的工作原理

#### 1. Sticky 策略（粘性）

**核心逻辑**：保持当前账户，直到它被限速才切换。

**优点**：
- 保留 prompt 缓存，相同上下文响应更快
- 账户使用模式稳定，不容易触发风控

**缺点**：
- 多账户配额利用不均衡
- 限速恢复前无法使用其他账户

**适用场景**：
- 只有一个账户
- 重视 prompt 缓存（如长期对话）

#### 2. Round-Robin 策略（轮询）

**核心逻辑**：每次请求轮换到下一个可用账户，循环使用。

**优点**：
- 配额利用最均衡
- 最大化并发吞吐量
- 适合高并发场景

**缺点**：
- 不考虑账户健康状况，可能选择刚从限速恢复的账户
- 无法利用 prompt 缓存

**适用场景**：
- 4 个或更多账户
- 需要最大吞吐量的批量任务
- 并行代理场景（配合 `pid_offset_enabled`）

#### 3. Hybrid 策略（混合，默认）

**核心逻辑**：综合考虑三个因素，选择最优账户：

**评分公式**：
```
总分 = 健康分 × 2 + Token 分 × 5 + 新鲜度分 × 0.1
```

- **健康分**（0-200）：基于账户的成功/失败历史
  - 成功请求：+1 分
  - 速率限制：-10 分
  - 其他失败（认证、网络）：-20 分
  - 初始值：70 分，最低 0 分，最高 100 分
  - 每小时恢复 2 分（即使不使用）

- **Token 分**（0-500）：基于 Token bucket 算法
  - 每个账户最大 50 token，初始 50 token
  - 每分钟恢复 6 token
  - 每次请求消耗 1 token
  - Token 分 = (当前 token / 50) × 100 × 5

- **新鲜度分**（0-360）：基于距离上次使用的时间
  - 距离上次使用时间越长，分数越高
  - 最多 3600 秒（1 小时）后达到最大值

**优点**：
- 智能避开健康度低的账户
- Token bucket 避免密集请求导致的限速
- LRU（最久未使用优先）让账户有充分休息时间
- 综合考虑性能与稳定性

**缺点**：
- 算法较复杂，不如 round-robin 直观
- 2 个账户时效果不明显

**适用场景**：
- 2-3 个账户（默认策略）
- 需要平衡配额利用率和稳定性

### 策略选择速查表

根据 README 和 CONFIGURATION.md 的推荐：

| 你的设置 | 推荐策略 | 原因 |
|--- | --- | ---|
| **1 个账户** | `sticky` | 无需轮换，保留 prompt 缓存 |
| **2-3 个账户** | `hybrid`（默认） | 智能轮换，避免过度限速 |
| **4+ 个账户** | `round-robin` | 最大化吞吐量，配额利用最均衡 |
| **并行代理** | `round-robin` + `pid_offset_enabled: true` | 不同进程使用不同账户 |

## 🎒 开始前的准备

::: warning 前置检查
确保你已完成：
- [x] 多账户设置（至少 2 个 Google 账户）
- [x] 理解 [双配额系统](/zh/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)
:::

## 跟我做

### 第 1 步：检查当前配置

**为什么**
先了解当前的配置状态，避免重复修改。

**操作**

检查你的插件配置文件：

```bash
cat ~/.config/opencode/antigravity.json
```

**你应该看到**：
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

如果文件不存在，插件使用默认配置（`account_selection_strategy` = `"hybrid"`）。

### 第 2 步：根据账户数量配置策略

**为什么**
不同账户数量适合不同策略，选择错误的策略可能导致配额浪费或频繁限速。

::: code-group

```bash [1 个账户 - Sticky 策略]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3 个账户 - Hybrid 策略（默认）]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+ 个账户 - Round-Robin 策略]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**你应该看到**：配置文件已更新为对应的策略。

### 第 3 步：启用 PID 偏移（并行代理场景）

**为什么**
如果你使用 oh-my-opencode 等插件生成并行代理，多个子进程可能同时发起请求。默认情况下，它们会从同一个起始账户开始选择，导致账户竞争和限速。

**操作**

修改配置，添加 PID 偏移：

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**你应该看到**：`pid_offset_enabled` 设置为 `true`。

**工作原理**：
- 每个进程根据其 PID（进程 ID）计算偏移量
- 偏移量 = `PID % 账户数`
- 不同进程会优先使用不同的起始账户
- 示例：3 个账户，PID 100、101、102 的进程分别使用账户 1、2、0

### 第 4 步：验证策略生效

**为什么**
确认配置正确，策略按预期工作。

**操作**

发起多个并发请求，观察账户切换：

```bash
# 开启调试日志
export OPENCODE_ANTIGRAVITY_DEBUG=1

# 发起 5 个请求
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**你应该看到**：
- 日志中显示不同请求使用不同账户
- `account-switch` 事件记录账户切换

示例日志（round-robin 策略）：
```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### 第 5 步：监控账户健康状态（Hybrid 策略）

**为什么**
Hybrid 策略基于健康评分选择账户，了解健康状态有助于判断配置是否合理。

**操作**

查看调试日志中的健康评分：

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**你应该看到**：
```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**解读**：
- 账户 0：健康分 85（优秀）
- 账户 1：健康分 60（可用，但有 2 次连续失败）
- 账户 2：健康分 70（良好）
- 最终选择账户 0，综合评分 270.2

## 检查点 ✅

::: tip 如何验证配置生效？
1. 查看配置文件确认 `account_selection_strategy` 值
2. 发起多个请求，观察日志中的账户切换行为
3. Hybrid 策略：健康评分低的账户被选择频率应更低
4. Round-robin 策略：账户应循环使用，无明显偏好
:::

## 踩坑提醒

### ❌ 账户数量与策略不匹配

**错误行为**：
- 只有 2 个账户却使用 round-robin，导致频繁切换
- 有 5 个账户却用 sticky，配额利用不均衡

**正确做法**：按照速查表选择策略。

### ❌ 并行代理未启用 PID 偏移

**错误行为**：
- 多个并行代理同时使用同一个账户
- 导致账户被快速限速

**正确做法**：设置 `pid_offset_enabled: true`。

### ❌ 忽略健康评分（Hybrid 策略）

**错误行为**：
- 某个账户频繁限速，但仍被高频使用
- 没有利用健康评分避开问题账户

**正确做法**：定期检查调试日志中的健康评分，如有异常（如某账户连续失败次数 > 5），考虑移除该账户或切换策略。

### ❌ 混用双配额池和单配额策略

**错误行为**：
- Gemini 模型使用 `:antigravity` 后缀强制使用 Antigravity 配额池
- 同时配置了 `quota_fallback: false`
- 导致某个配额池用完后，无法 fallback 到另一个池

**正确做法**：理解 [双配额系统](/zh/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)，根据需求配置 `quota_fallback`。

## 本课小结

| 策略 | 核心特点 | 适用场景 |
|--- | --- | ---|
| `sticky` | 保持账户直到限速 | 1 个账户、需要 prompt 缓存 |
| `round-robin` | 循环轮换账户 | 4+ 个账户、最大化吞吐量 |
| `hybrid` | 健康 + Token + LRU 智能选择 | 2-3 个账户、平衡性能与稳定性 |

**关键配置**：
- `account_selection_strategy`：设置策略（`sticky` / `round-robin` / `hybrid`）
- `pid_offset_enabled`：并行代理场景启用（`true`）
- `quota_fallback`：Gemini 双配额池 fallback（`true` / `false`）

**验证方法**：
- 开启调试日志：`OPENCODE_ANTIGRAVITY_DEBUG=1`
- 查看账户切换日志和健康评分
- 观察不同请求使用的账户索引

## 下一课预告

> 下一课我们学习 **[速率限制处理](/zh/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)**。
>
> 你会学到：
> - 如何理解不同类型的 429 错误（配额耗尽、速率限制、容量耗尽）
> - 自动重试和退避算法的工作原理
> - 何时切换账户，何时等待重置

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 账户选择策略入口 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Sticky 策略实现 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
|--- | --- | ---|
| Hybrid 策略实现 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| 健康评分系统 | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Token bucket 系统 | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| LRU 选择算法 | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| PID 偏移逻辑 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| 配置 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 见文件 |

**关键常量**：
- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70`：新账户初始健康分
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50`：账户最小可用健康分
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50`：每个账户最大 token 数
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6`：每分钟恢复 token 数

**关键函数**：
- `getCurrentOrNextForFamily()`：根据策略选择账户
- `selectHybridAccount()`：Hybrid 策略评分选择算法
- `getScore()`：获取账户健康分（含时间恢复）
- `hasTokens()` / `consume()`：Token bucket 检查和消费
- `sortByLruWithHealth()`：LRU + 健康分排序

</details>
