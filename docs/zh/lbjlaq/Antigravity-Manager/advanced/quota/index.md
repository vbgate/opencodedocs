---
title: "配额治理: Quota Protection 与预热 | Antigravity-Manager"
subtitle: "配额治理: Quota Protection 与预热 | Antigravity-Manager"
sidebarTitle: "保护你的模型配额"
description: "学习 Antigravity-Manager 配额治理机制。使用 Quota Protection 按阈值保护模型，Smart Warmup 自动预热，支持定时扫描与冷却控制。"
tags:
  - "quota"
  - "warmup"
  - "accounts"
  - "proxy"
prerequisite:
  - "start-add-account"
  - "start-proxy-and-first-client"
order: 5
---

# 配额治理：Quota Protection + Smart Warmup 的组合打法

你用 Antigravity Tools 跑代理跑得挺稳，但最怕的还是一件事：主力模型的配额被"悄悄吃光"，等你真要用的时候才发现已经低到没法打。

这一课专讲 **配额治理**：用 Quota Protection 把关键模型留住；用 Smart Warmup 在配额回满时做一次"轻量热身"，减少临时掉链子。

## 什么是配额治理？

**配额治理**是指在 Antigravity Tools 里用两套联动机制控制"配额怎么花"：当某个模型的剩余配额低到阈值以下时，Quota Protection 会把该模型加入账号的 `protected_models`，请求该模型时会优先避开；当配额回到 100% 时，Smart Warmup 会触发一次极小流量的预热请求，并用本地历史文件做 4 小时冷却。

## 学完你能做什么

- 开启 Quota Protection，让低配额账号自动"让路"，把高价值模型留给关键请求
- 开启 Smart Warmup，让配额回满后自动预热（并知道 4 小时冷却怎么影响触发频率）
- 搞清楚 `quota_protection` / `scheduled_warmup` / `protected_models` 三个字段分别在哪里生效
- 知道哪些模型名会被归一化成"保护组"（以及哪些不会）

## 你现在的困境

- 你以为自己在"轮换账号"，但其实一直在消耗同一类高价值模型
- 配额低了才发现，甚至是 Claude Code/客户端在后台 warmup 把额度啃掉
- 你开了预热，但不知道它到底何时触发、有没有冷却、是否会影响配额

## 什么时候用这一招

- 你有多个账号池，希望关键模型在"重要时刻"还有余粮
- 你不想手动盯着配额回满时间，想让系统自动做"回满后的轻量验证"

## 🎒 开始前的准备

::: warning 前置条件
本课默认你已经能：

- 在 **Accounts** 页面看到账号列表，并能手动刷新配额
- 已经启动过本地反代（至少能访问 `/healthz`）

如果还没跑通，先看 **[启动本地反代并接入第一个客户端](/zh/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**。
:::

另外，Smart Warmup 会写入本地历史文件 `warmup_history.json`。它放在数据目录里，数据目录位置和备份方式可以先看 **[首次启动必懂：数据目录、日志、托盘与自动启动](/zh/lbjlaq/Antigravity-Manager/start/first-run-data/)**。

## 核心思路

这套"组合打法"背后其实很朴素：

- Quota Protection 负责"别再浪费"：当某个模型低于阈值，就把它标记为受保护，请求该模型时优先避开（模型级别，而不是一刀切禁用账号）。
- Smart Warmup 负责"配额回满就验一下"：当模型回到 100% 时，触发一次轻量请求，确认链路可用，并用 4 小时冷却避免反复打扰。

它们对应的配置字段都在前端的 `AppConfig` 里：

- `quota_protection.enabled / threshold_percentage / monitored_models`（见 `src/types/config.ts`）
- `scheduled_warmup.enabled / monitored_models`（见 `src/types/config.ts`）

而真正决定"请求该模型时要不要跳过该账号"的逻辑在后端 TokenManager：

- 账号文件里的 `protected_models` 会在 `get_token(..., target_model)` 里参与过滤（见 `src-tauri/src/proxy/token_manager.rs`）
- `target_model` 会先做一次归一化（`normalize_to_standard_id`），所以 `claude-sonnet-4-5-thinking` 这类变体会被折叠到同一个"保护组"（见 `src-tauri/src/proxy/common/model_mapping.rs`）

## 下一课预告

> 下一课我们学习 **[Proxy Monitor：请求日志、筛选、详情还原与导出](/zh/lbjlaq/Antigravity-Manager/advanced/monitoring/)**，把调用黑盒变成可复盘的证据链。

## 跟我做

### 第 1 步：先把配额刷到"有数"

**为什么**
Quota Protection 是基于账号的 `quota.models[].percentage` 做判断的。你配额没刷出来，保护逻辑就没法对你做任何事。

操作路径：打开 **Accounts** 页面，点工具栏的刷新按钮（单个账号或全量都行）。

**你应该看到**：账号行里出现各模型的配额百分比（例如 0-100）和 reset time。

### 第 2 步：在 Settings 里打开 Smart Warmup（可选，但推荐）

**为什么**
Smart Warmup 的目标不是"省配额"，而是"配额回满就自检一下链路"。它只在模型配额到 100% 时触发，而且有 4 小时冷却。

操作路径：进入 **Settings**，切到账号相关设置区域，打开 **Smart Warmup** 开关，然后勾选你要监控的模型。

别忘了保存设置。

**你应该看到**：Smart Warmup 展开后出现模型列表；至少保留 1 个模型被勾选。

### 第 3 步：打开 Quota Protection，并设置阈值与监控模型

**为什么**
Quota Protection 是"留余粮"的核心：当监控模型的配额百分比 `<= threshold_percentage` 时，会把该模型写进账号文件的 `protected_models`，后续请求该模型会优先避开这类账号。

操作路径：在 **Settings** 里打开 **Quota Protection**。

1. 设置阈值（`1-99`）
2. 勾选你要监控的模型（至少 1 个）

::: tip 一个很好用的起手配置
如果你不想纠结，从默认 `threshold_percentage=10` 开始就行（见 `src/pages/Settings.tsx`）。
:::

**你应该看到**：Quota Protection 的模型勾选至少保留 1 个（UI 会阻止你把最后一个也取消掉）。

### 第 4 步：确认"保护组归一化"不会让你踩坑

**为什么**
TokenManager 做配额保护判断时，会先把 `target_model` 归一化成标准 ID（`normalize_to_standard_id`）。例如 `claude-sonnet-4-5-thinking` 会被归一到 `claude-sonnet-4-5`。

这意味着：

- 你在 Quota Protection 里勾选 `claude-sonnet-4-5`
- 当你实际请求 `claude-sonnet-4-5-thinking`

仍然会命中保护（因为它们属于同一组）。

**你应该看到**：当某账号的 `protected_models` 里包含 `claude-sonnet-4-5` 时，对 `claude-sonnet-4-5-thinking` 的请求会优先避开该账号。

### 第 5 步：需要立刻验证时，用"手动预热"触发一次 warmup

**为什么**
定时 Smart Warmup 的扫描周期是 10 分钟一次（见 `src-tauri/src/modules/scheduler.rs`）。你想立刻验证链路，手动预热更直接。

操作路径：打开 **Accounts** 页面，点工具栏的"预热"按钮：

- 不选账号：触发全量预热（调用 `warm_up_all_accounts`）
- 选中账号：对选中的账号逐个触发预热（调用 `warm_up_account`）

**你应该看到**：出现 toast，内容来自后端返回的字符串（例如 "Warmup task triggered ..."）。

## 检查点 ✅

- 你能在 Accounts 页面看到每个账号的模型配额百分比（证明配额数据链路 OK）
- 你能在 Settings 里打开 Quota Protection / Smart Warmup，并成功保存配置
- 你理解 `protected_models` 是"模型级"限制：一个账号可能只对某些模型被避开
- 你知道 warmup 有 4 小时冷却：短时间内重复点预热，可能会看到"skipped/cooldown"相关提示

## 踩坑提醒

### 1) 你开了 Quota Protection，但一直没生效

最常见原因是：账号没有 `quota` 数据。保护逻辑在后端需要先读取 `quota.models[]` 才能判断阈值（见 `src-tauri/src/proxy/token_manager.rs`）。

你可以回到 **第 1 步**，先把配额刷新出来。

### 2) 为什么只有少数模型会被当成"保护组"？

TokenManager 对 `target_model` 的归一化是"白名单式"的：只有明确列出来的模型名才会被映射到标准 ID（见 `src-tauri/src/proxy/common/model_mapping.rs`）。

归一化后的逻辑是：用归一化后的名称（标准 ID 或原始模型名）去匹配账号的 `protected_models` 字段。如果匹配成功，该账号会被跳过（见 `src-tauri/src/proxy/token_manager.rs:555-560, 716-719`）。这意味着：

- 白名单内的模型（如 `claude-sonnet-4-5-thinking`）会被归一化为标准 ID（`claude-sonnet-4-5`），然后判断是否在 `protected_models` 中
- 白名单外的模型归一化失败时，回退到原始模型名，仍然会去匹配 `protected_models`

换句话说，配额保护判断对"所有模型名"都生效，只是白名单内的模型会先归一化。

### 3) 手动/定时预热为什么需要代理在跑？

预热请求最终会打到本地代理的内部端点：`POST /internal/warmup`（见 `src-tauri/src/proxy/server.rs` 的路由，以及 `src-tauri/src/proxy/handlers/warmup.rs` 的实现）。如果你没启动代理服务，warmup 会失败。

另外，预热调用的端口来自配置：`proxy.port`（如果读取配置失败，会回退到 `8045`，见 `src-tauri/src/modules/quota.rs`）。

## 本课小结

- Quota Protection 做"止损"：阈值以下就把模型写进 `protected_models`，请求该模型时优先避开
- Smart Warmup 做"回满自检"：只在 100% 时触发，10 分钟扫描一次，4 小时冷却
- 两者都依赖"配额刷新"链路：先有 `quota.models[]`，治理才有基础

## 下一课预告

配额治理解决的是"怎么花更稳"。下一课建议接着看 **Proxy Monitor**，把请求日志、账号命中、模型映射都变成可回放的证据链。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Quota Protection UI（阈值、模型勾选、至少保留 1 个） | [`src/components/settings/QuotaProtection.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/QuotaProtection.tsx#L13-L168) | 13-168 |
| Smart Warmup UI（启用后默认勾选、至少保留 1 个） | [`src/components/settings/SmartWarmup.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/settings/SmartWarmup.tsx#L14-L120) | 14-120 |
| 配额治理配置字段（`quota_protection` / `scheduled_warmup`） | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L54-L94) | 54-94 |
| 默认阈值与默认配置（`threshold_percentage: 10`） | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L20-L51) | 20-51 |
| 写入/恢复 `protected_models`（阈值判断与落盘） | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L254-L467) | 254-467 |
| 请求侧配额保护过滤（`get_token(..., target_model)`） | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L470-L674) | 470-674 |
| 保护组归一化（`normalize_to_standard_id`） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L230-L254) | 230-254 |
| Smart Warmup 定时扫描（10 分钟一次 + 4 小时冷却 + `warmup_history.json`） | [`src-tauri/src/modules/scheduler.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/scheduler.rs#L11-L221) | 11-221 |
| 手动预热命令（`warm_up_all_accounts` / `warm_up_account`） | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L167-L212) | 167-212 |
| 预热实现（调用内部端点 `/internal/warmup`） | [`src-tauri/src/modules/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/quota.rs#L271-L512) | 271-512 |
| 内部预热端点实现（构造请求 + 调用上游） | [`src-tauri/src/proxy/handlers/warmup.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/warmup.rs#L3-L220) | 3-220 |

</details>
