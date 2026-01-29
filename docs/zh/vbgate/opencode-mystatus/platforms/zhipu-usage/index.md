---
title: "智谱 AI: 额度查询 | opencode-mystatus"
sidebarTitle: "智谱 AI"
subtitle: "智谱 AI: 额度查询"
description: "学习如何使用 opencode-mystatus 查询智谱 AI 和 Z.ai 的 5 小时 Token 限额、MCP 月度配额，掌握进度条解读和重置时间计算，避免超额影响开发。"
tags:
  - "智谱 AI"
  - "Z.ai"
  - "额度查询"
  - "Token 限额"
  - "MCP 配额"
prerequisite:
  - "start-quick-start"
order: 2
---

# 智谱 AI 和 Z.ai 额度查询：5 小时 Token 限额和 MCP 月度配额

## 学完你能做什么

- 查看**智谱 AI** 和 **Z.ai** 的 5 小时 Token 限额使用情况
- 理解 **MCP 月度配额**的含义和重置规则
- 读懂额度输出中的**进度条、已用量、总量**等信息
- 知道何时会触发**使用率警告**

## 你现在的困境

你使用智谱 AI 或 Z.ai 开发应用，但经常遇到这些问题：

- 不知道**5 小时 Token 限额**还有多少剩余
- 超过限额后请求失败，影响开发进度
- 不清楚 **MCP 月度配额**的具体含义
- 需要登录两个平台分别查看额度，很麻烦

## 什么时候用这一招

当你：

- 使用智谱 AI / Z.ai 的 API 开发应用
- 需要监控 Token 使用量，避免超额
- 想了解 MCP 搜索功能的月度配额
- 同时使用智谱 AI 和 Z.ai，想统一管理额度

## 核心思路

**智谱 AI**和**Z.ai**的额度系统分为两种类型：

| 额度类型 | 含义 | 重置周期 |
| -------- | ---- | -------- |
| **5 小时 Token 限额** | API 请求的 Token 使用量限制 | 5 小时自动重置 |
| **MCP 月度配额** | MCP（Model Context Protocol）搜索次数的月度限制 | 每月重置 |

插件调用官方 API 实时查询这些数据，并用**进度条**和**百分比**直观展示剩余额度。

::: info 什么是 MCP？

**MCP**（Model Context Protocol）是智谱 AI 提供的模型上下文协议，允许 AI 模型搜索和引用外部资源。MCP 月度配额限制了每月可进行的搜索次数。

:::

## 跟我做

### 第 1 步：配置智谱 AI / Z.ai 账号

**为什么**
插件需要 API Key 才能查询你的额度。智谱 AI 和 Z.ai 使用**API Key 认证方式**。

**操作**

1. 打开 `~/.local/share/opencode/auth.json` 文件

2. 添加智谱 AI 或 Z.ai 的 API Key 配置：

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的智谱 AI API Key"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "你的 Z.ai API Key"
  }
}
```

**你应该看到**：
- 配置文件中包含 `zhipuai-coding-plan` 或 `zai-coding-plan` 字段
- 每个字段都有 `type: "api"` 和 `key` 字段

### 第 2 步：查询额度

**为什么**
调用官方 API 获取实时的额度使用情况。

**操作**

在 OpenCode 中执行斜杠命令：

```bash
/mystatus
```

或用自然语言提问：

```
查看我的智谱 AI 额度
```

**你应该看到**类似这样的输出：

```
## 智谱 AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5 小时 Token 限额
████████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后

MCP 月度配额
███████████████████░░░░░░░ 剩余 60%
已用: 200 / 500

## Z.ai 账号额度

Account:        9c89****AQVM (Z.ai)

5 小时 Token 限额
████████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4小时后
```

### 第 3 步：解读输出

**为什么**
理解每行输出的含义，才能有效管理额度。

**操作**

对照以下说明查看你的输出：

| 输出字段 | 含义 | 示例 |
| -------- | ---- | ---- |
| **Account** | 脱敏后的 API Key 和账号类型 | `9c89****AQVM (Coding Plan)` |
| **5 小时 Token 限额** | 当前 5 小时周期内的 Token 使用情况 | 进度条 + 百分比 |
| **已用: X / Y** | 已使用 Token / 总配额 | `0.5M / 10.0M` |
| **重置: X小时后** | 下次重置的倒计时 | `4小时后` |
| **MCP 月度配额** | 当月 MCP 搜索次数的使用情况 | 进度条 + 百分比 |
| **已用: X / Y** | 已用次数 / 总配额 | `200 / 500` |

**你应该看到**：
- 5 小时 Token 限额部分有**重置时间倒计时**
- MCP 月度配额部分**没有重置时间**（因为它是月度重置）
- 如果使用率超过 80%，底部会显示**警告提示**

## 检查点 ✅

确认你理解了以下内容：

- [ ] 5 小时 Token 限额有重置时间倒计时
- [ ] MCP 月度配额是每月重置，不显示倒计时
- [ ] 使用率超过 80% 会触发警告
- [ ] API Key 已脱敏显示（只显示前 4 位和后 4 位）

## 踩坑提醒

### ❌ 常见错误 1：配置文件中缺少 `type` 字段

**错误现象**：查询时提示"未找到任何已配置的账号"

**原因**：`auth.json` 中缺少 `type: "api"` 字段

**修正**：

```json
// ❌ 错误
{
  "zhipuai-coding-plan": {
    "key": "你的 API Key"
  }
}

// ✅ 正确
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的 API Key"
  }
}
```

### ❌ 常见错误 2：API Key 过期或无效

**错误现象**：显示 "API 请求失败" 或 "鉴权失败"

**原因**：API Key 已过期或被撤销

**修正**：
- 登录智谱 AI / Z.ai 控制台
- 重新生成 API Key
- 更新 `auth.json` 中的 `key` 字段

### ❌ 常见错误 3：混淆两种额度类型

**错误现象**：以为 Token 限额和 MCP 配额是同一个东西

**修正**：
- **Token 限额**：API 调用的 Token 使用量，5 小时重置
- **MCP 配额**：MCP 搜索次数，每月重置
- 这是**两个独立的限额**，互不影响

## 本课小结

本课学习了如何使用 opencode-mystatus 查询智谱 AI 和 Z.ai 的额度：

**核心概念**：
- 5 小时 Token 限额：API 调用限制，有重置倒计时
- MCP 月度配额：MCP 搜索次数，每月重置

**操作步骤**：
1. 配置 `auth.json` 中的 `zhipuai-coding-plan` 或 `zai-coding-plan`
2. 执行 `/mystatus` 查询额度
3. 解读输出中的进度条、已用量、重置时间

**关键点**：
- 使用率超过 80% 会触发警告
- API Key 自动脱敏显示
- Token 限额和 MCP 配额是两个独立的限额

## 下一课预告

> 下一课我们学习 **[GitHub Copilot 额度查询](../copilot-usage/)**。
>
> 你会学到：
> - 如何查看 Premium Requests 使用情况
> - 不同订阅类型的月度配额差异
> - 模型使用明细的解读方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 查询智谱 AI 额度 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| 查询 Z.ai 额度 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| 格式化输出 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| API 端点配置 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| ZhipuAuthData 类型定义 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| 高使用率警告阈值 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**关键常量**：
- `HIGH_USAGE_THRESHOLD = 80`：使用率超过 80% 时显示警告（`types.ts:111`）

**关键函数**：
- `queryZhipuUsage(authData)`: 查询智谱 AI 账号额度（`zhipu.ts:213-217`）
- `queryZaiUsage(authData)`: 查询 Z.ai 账号额度（`zhipu.ts:224-228`）
- `formatZhipuUsage(data, apiKey, accountLabel)`: 格式化额度输出（`zhipu.ts:115-177`）
- `fetchUsage(apiKey, config)`: 调用官方 API 获取额度数据（`zhipu.ts:81-106`）

**API 端点**：
- 智谱 AI: `https://bigmodel.cn/api/monitor/usage/quota/limit`（`zhipu.ts:63`）
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit`（`zhipu.ts:64`）

</details>
