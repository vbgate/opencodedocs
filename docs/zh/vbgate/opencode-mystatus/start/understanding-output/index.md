---
title: "输出解读: 理解进度条 | opencode-mystatus"
sidebarTitle: "输出解读"
subtitle: "输出解读: 理解进度条"
description: "学习 opencode-mystatus 输出格式，理解进度条、重置时间和各平台限额周期说明。"
tags:
  - "output-format"
  - "progress-bar"
  - "reset-time"
  - "multi-account"
prerequisite:
  - "start-quick-start"
order: 3
---

# 解读输出：进度条、重置时间和多账号

## 学完你能做什么

- 读懂 mystatus 输出中的每项信息
- 理解进度条显示的含义（实心 vs 空心）
- 知道不同平台的限额周期（3 小时、5 小时、月度）
- 识别多个账号的额度差异

## 你现在的困境

你执行了 `/mystatus`，看到一堆进度条、百分比、倒计时，但搞不清楚：

- 进度条是满的好还是空的好？
- "Resets in: 2h 30m" 是什么意思？
- 为什么有的平台显示两个进度条，有的只显示一个？
- Google Cloud 怎么有好几个账号？

本课帮你把这些信息一一拆解。

## 核心思路

mystatus 的输出有统一格式，但不同平台有差异：

**统一元素**：
- 进度条：`█`（实心）表示剩余，`░`（空心）表示已用
- 百分比：基于已用量计算剩余百分比
- 重置时间：距离下次额度刷新的倒计时

**平台差异**：
| 平台           | 限额周期                    | 特点                    |
|--- | --- | ---|
| OpenAI         | 3 小时 / 24 小时            | 可能显示两个窗口        |
| 智谱 AI / Z.ai | 5 小时 Token / MCP 月度配额 | 两个不同的限额类型      |
| GitHub Copilot | 月度                        | 显示具体数值（229/300） |
| Google Cloud   | 按模型                      | 每个账号显示 4 个模型   |

## 输出结构解析

### 完整输出示例

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
██████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
████████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### 各部分含义

#### 1. 账号信息行

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**：显示邮箱 + 订阅类型
- **智谱 AI / Z.ai**：显示脱敏后的 API Key + 账号类型（Coding Plan）
- **Google Cloud**：显示邮箱，多账号用 `###` 分隔

#### 2. 进度条

```
████████████████████████████ 85% remaining
```

- `█`（实心块）：**剩余**的额度
- `░`（空心块）：**已使用**的额度
- **百分比**：剩余百分比（越大越好）

::: tip 记忆口诀
实心块越满，剩余越多 → 继续用放心
空心块越满，用得越多 → 注意省着点
:::

#### 3. 重置时间倒计时

```
Resets in: 2h 30m
```

表示距离下次额度刷新还有多长时间。

**重置周期**：
- **OpenAI**：3 小时窗口 / 24 小时窗口
- **智谱 AI / Z.ai**：5 小时 Token 限额 / MCP 月度配额
- **GitHub Copilot**：月度（显示具体日期）
- **Google Cloud**：每个模型有独立的重置时间

#### 4. 数值明细（部分平台）

智谱 AI 和 Copilot 会显示具体数值：

```
Used: 0.5M / 10.0M              # 智谱 AI：已用 / 总量（单位：百万 Token）
Premium        24% (229/300)     # Copilot：剩余百分比（已用 / 总配额）
```

## 平台差异详解

### OpenAI：双窗口限额

OpenAI 可能显示两个进度条：

```
3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
██████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit**：3 小时滑动窗口，适合高频使用
- **24-hour limit**：24 小时滑动窗口，适合长期规划

**团队账号**（Team）：
- 有主窗口和次窗口两个限额
- 不同成员共享同一个 Team 额度

**个人账号**（Plus）：
- 通常只显示 3 小时窗口

### 智谱 AI / Z.ai：两种限额类型

```
5-hour token limit
████████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
████████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**：5 小时内的 Token 使用限额
- **MCP limit**：Model Context Protocol（模型上下文协议）月度配额，用于搜索功能

::: warning
MCP 配额是月度的，重置时间较长。如果显示已满，需要等下个月才能恢复。
:::

### GitHub Copilot：月度配额

```
Premium        ████░░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**：Copilot 高级功能使用量
- 显示具体数值（已用 / 总配额）
- 月度重置，显示具体日期

**订阅类型差异**：
| 订阅类型   | 月度配额 | 说明                   |
|--- | --- | ---|
| Free       | N/A      | 无额度限制，但功能受限 |
| Pro        | 300      | 标准个人版             |
| Pro+       | 更高     | 升级版                 |
| Business   | 更高     | 企业版                 |
| Enterprise | 无限     | 企业版                 |

### Google Cloud：多账号 + 多模型

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
```

**格式**：`模型名 | 重置时间 | 进度条 + 百分比`

**4 个模型说明**：
| 模型名   | 对应 API Key                                   | 用途        |
|--- | --- | ---|
| G3 Pro   | `gemini-3-pro-high` / `gemini-3-pro-low`       | 高级推理    |
| G3 Image | `gemini-3-pro-image`                           | 图像生成    |
| G3 Flash | `gemini-3-flash`                               | 快速生成    |
| Claude   | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude 模型 |

**多账号显示**：
- 每个 Google 账号用 `###` 分隔
- 每个账号显示自己的 4 个模型额度
- 可以比较不同账号的额度使用情况

## 踩坑提醒

### 常见误解

| 误解                      | 事实                                   |
|--- | ---|
| 进度条全是实心 = 没有用过 | 实心块多 = **剩余多**，可以放心用      |
| 重置时间短 = 额度快没了   | 重置时间短 = 快重置了，可以续用        |
| 百分比 100% = 已用完      | 百分比 100% = **全部剩余**             |
| 智谱 AI 只显示一个限额    | 实际有 TOKENS_LIMIT 和 TIME_LIMIT 两种 |

### 限额满了怎么办？

如果进度条全是空心块（0% remaining）：

1. **短期限额**（如 3 小时、5 小时）：等重置时间倒计时结束
2. **月度限额**（如 Copilot、MCP）：等下个月初
3. **多账号**：切换到其他账号（Google Cloud 支持多账号）

::: info
mystatus 是**只读工具**，不会消耗你的额度，也不会触发任何 API 调用。
:::

## 本课小结

- **进度条**：实心 `█` = 剩余，空心 `░` = 已用
- **重置时间**：距离下次额度刷新的倒计时
- **平台差异**：不同平台有不同限额周期（3h/5h/月度）
- **多账号**：Google Cloud 显示多个账号，方便额度管理

## 下一课预告

> 下一课我们学习 **[OpenAI 额度查询](../../platforms/openai-usage/)**。
>
> 你会学到：
> - OpenAI 的 3 小时和 24 小时限额的区别
> - 团队账号的额度共享机制
> - 如何解析 JWT Token 获取账号信息

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能                    | 文件路径                                                                                                         | 行号    |
|--- | --- | ---|
| 进度条生成              | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53)       | 40-53   |
| 时间格式化              | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29)       | 18-29   |
| 剩余百分比计算          | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65)       | 63-65   |
| Token 数量格式化        | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72)       | 70-72   |
| OpenAI 输出格式化       | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194)   | 164-194 |
| 智谱 AI 输出格式化      | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177)     | 115-177 |
| Copilot 输出格式化      | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Google Cloud 输出格式化 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294)   | 265-294 |

**关键函数**：
- `createProgressBar(percent, width)`：生成进度条，实心块表示剩余
- `formatDuration(seconds)`：将秒数转换为人类可读的时间格式（如 "2h 30m"）
- `calcRemainPercent(usedPercent)`：计算剩余百分比（100 - 已用百分比）
- `formatTokens(tokens)`：将 Token 数量格式化为百万单位（如 "0.5M"）

**关键常量**：
- 进度条默认宽度：30 个字符（Google Cloud 模型使用 20 个字符）
- 进度条字符：`█`（实心）、`░`（空心）

</details>
