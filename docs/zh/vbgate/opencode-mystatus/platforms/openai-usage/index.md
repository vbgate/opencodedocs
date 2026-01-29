---
title: "OpenAI 额度: 查询 3 小时和 24 小时限额 | opencode-mystatus"
subtitle: "OpenAI 额度: 查询 3 小时和 24 小时限额"
sidebarTitle: "OpenAI 额度"
description: "学习如何查询 OpenAI 的 3 小时和 24 小时限额。解读主窗口和次窗口信息，了解 Token 过期处理方法，掌握 Plus/Team/Pro 订阅额度差异。"
tags:
  - "OpenAI"
  - "额度查询"
  - "API 配额"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# OpenAI 额度查询：3 小时和 24 小时限额

## 学完你能做什么

- 使用 `/mystatus` 查询 OpenAI Plus/Team/Pro 订阅的额度
- 看懂输出中的 3 小时和 24 小时限额信息
- 理解主窗口和次窗口的区别
- 了解 Token 过期时的处理方式

## 你现在的困境

OpenAI 的 API 调用有限额，超额后会被临时限制访问。但你不知道：
- 当前还剩多少额度？
- 3 小时和 24 小时窗口哪个在用？
- 什么时候会重置？
- 为什么有时候看到两个窗口的数据？

这些信息如果不及时掌握，可能影响你用 ChatGPT 写代码或做项目的进度。

## 什么时候用这一招

当你：
- 需要频繁使用 OpenAI API 进行开发
- 发现响应变慢或被限流
- 想了解团队账号的使用情况
- 想知道什么时候额度会刷新

## 核心思路

OpenAI 对 API 调用有两种限流窗口：

| 窗口类型 | 时长 | 作用 |
|---------|------|------|
| **主窗口**（primary） | 由 OpenAI 服务端返回 | 防止短时间内大量调用 |
| **次窗口**（secondary） | 由 OpenAI 服务端返回（可能不存在） | 防止长期超额使用 |

mystatus 会并行查询这两个窗口，显示各自的：
- 已使用百分比
- 剩余额度进度条
- 距离重置的时间

::: info
窗口时长由 OpenAI 服务端返回，不同订阅类型（Plus、Team、Pro）可能不同。
:::

## 跟我做

### 第 1 步：执行查询命令

在 OpenCode 中输入 `/mystatus`，系统会自动查询所有已配置平台的额度。

**你应该看到**：
包含 OpenAI、智谱 AI、Z.ai、Copilot、Google Cloud 等平台的额度信息（取决于你配置了哪些平台）。

### 第 2 步：找到 OpenAI 部分

在输出中找到 `## OpenAI Account Quota` 部分。

**你应该看到**：
类似这样的内容：

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
████████████████░░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### 第 3 步：解读主窗口信息

**主窗口**（primary_window）通常显示：
- **窗口名称**：如 `3-hour limit` 或 `24-hour limit`
- **进度条**：直观显示剩余额度的比例
- **剩余百分比**：如 `60% remaining`
- **重置时间**：如 `Resets in: 2h 30m`

**你应该看到**：
- 窗口名称显示时长（3 小时 / 24 小时）
- 进度条越满代表剩余越多，越空代表越快用完
- 重置时间是倒计时，归零后额度会刷新

::: warning
如果看到提示 `Limit reached!`，说明当前窗口额度已用完，需要等待重置。
:::

### 第 4 步：查看次窗口（如果有）

如果 OpenAI 返回了次窗口数据，你会看到：

```
24-hour limit
█████████████████████████████ 90% remaining
Resets in: 20h 45m
```

**你应该看到**：
- 次窗口显示另一个时间维度的额度（通常是 24 小时）
- 可能与主窗口不同的剩余百分比

::: tip
次窗口是独立的额度池，主窗口用完不影响次窗口，反之亦然。
:::

### 第 5 步：查看订阅类型

在 `Account` 行可以看到订阅类型：

```
Account:        user@example.com (plus)
                                  ^^^^^
                                  订阅类型
```

**常见的订阅类型**：
- `plus`：个人 Plus 订阅
- `team`：团队/组织订阅
- `pro`：Pro 订阅

**你应该看到**：
- 你的账号类型显示在邮箱后的括号里
- 不同类型的限额可能不同

## 检查点 ✅

验证一下你理解了：

| 场景 | 你应该看到 |
|------|----------|
| 主窗口剩余 60% | 进度条大约 60% 满，显示 `60% remaining` |
| 2.5 小时后重置 | 显示 `Resets in: 2h 30m` |
| 达到限额 | 显示 `Limit reached!` |
| 有次窗口 | 主窗口和次窗口各有一行数据 |

## 踩坑提醒

### ❌ 错误操作：Token 过期后不刷新

**错误现象**：看到提示 `⚠️ OAuth 授权已过期`（中文）或 `⚠️ OAuth token expired`（英文）

**原因**：OAuth Token 已过期（由服务端控制的具体时长），过期后无法查询额度。

**正确做法**：
1. 在 OpenCode 中重新登录 OpenAI
2. Token 会自动刷新
3. 再次执行 `/mystatus` 查询

### ❌ 错误操作：混淆主窗口和次窗口

**错误现象**：以为只有一个窗口额度，结果主窗口用完次窗口还在用

**原因**：两个窗口是独立的额度池。

**正确做法**：
- 关注两个窗口各自的重置时间
- 主窗口重置快，次窗口重置慢
- 合理分配使用，避免某个窗口长期超额

### ❌ 错误操作：忽略团队账号 ID

**错误现象**：Team 订阅显示的不是自己的使用情况

**原因**：Team 订阅需要传递团队账号 ID，否则可能查询的是默认账号。

**正确做法**：
- 确保在 OpenCode 中登录了正确的团队账号
- Token 中会自动包含 `chatgpt_account_id`

## 本课小结

mystatus 通过调用 OpenAI 官方 API 查询额度：
- 支持 OAuth 认证（Plus/Team/Pro）
- 显示主窗口和次窗口（如果存在）
- 进度条可视化剩余额度
- 倒计时显示重置时间
- 自动检测 Token 过期

## 下一课预告

> 下一课我们学习 **[智谱 AI 和 Z.ai 额度查询](../zhipu-usage/)**。
>
> 你会学到：
> - 5 小时 Token 限额是什么
> - MCP 月度配额怎么查看
> - 使用率超过 80% 时的警告提示

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能                    | 文件路径                                                                                      | 行号    |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------- |
| OpenAI 额度查询入口   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| OpenAI API 调用       | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| 格式化输出             | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| JWT Token 解析         | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73)   | 64-73   |
| 提取用户邮箱           | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81)   | 78-81   |
| Token 过期检查         | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| OpenAIAuthData 类型定义 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)       | 28-33   |

**常量**：
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`：OpenAI 官方额度查询 API

**关键函数**：
- `queryOpenAIUsage(authData)`：查询 OpenAI 额度的主函数
- `fetchOpenAIUsage(accessToken)`：调用 OpenAI API
- `formatOpenAIUsage(data, email)`：格式化输出
- `parseJwt(token)`：解析 JWT Token（非标准库实现）
- `getEmailFromJwt(token)`：从 Token 提取用户邮箱
- `getAccountIdFromJwt(token)`：从 Token 提取团队账号 ID

</details>
