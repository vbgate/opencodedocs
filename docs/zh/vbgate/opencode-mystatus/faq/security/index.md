---
title: "安全: 本地访问与 API 脱敏 | opencode-mystatus"
sidebarTitle: "安全"
subtitle: "安全: 本地访问与 API 脱敏"
description: "学习 opencode-mystatus 安全机制：只读本地文件、API Key 自动脱敏、仅调用官方接口、无数据存储。"
tags:
  - "安全"
  - "隐私"
  - "FAQ"
prerequisite: []
order: 2
---

# 安全与隐私：本地文件访问、API 脱敏、官方接口

## 你现在的困境

使用第三方工具时，你最担心的是什么？

- "它会读取我的 API Key 吗？"
- "我的认证信息会被上传到服务器吗？"
- "会不会有数据泄露的风险？"
- "它修改了我的配置文件怎么办？"

这些问题都很合理，尤其是在处理敏感的 AI 平台认证信息时。本教程将详细解释 opencode-mystatus 插件如何通过设计保护你的数据和隐私。

::: info 本地优先原则
opencode-mystatus 遵循「只读本地文件 + 官方 API 直接查询」的原则，所有敏感操作都在你的机器上完成，不经过任何第三方服务器。
:::

## 核心思路

插件的安全设计围绕三个核心原则：

1. **只读原则**：只读取本地认证文件，不写入或修改任何内容
2. **官方接口**：仅调用各平台的官方 API，不使用第三方服务
3. **数据脱敏**：显示输出时自动隐藏敏感信息（如 API Key）

这三个原则层层叠加，确保你的数据从读取到展示的整个流程都是安全的。

---

## 本地文件访问（只读）

### 插件读取哪些文件

插件只读取两个本地配置文件，并且都是**只读模式**：

| 文件路径 | 用途 | 源码位置 |
| -------- | ---- | -------- |
| `~/.local/share/opencode/auth.json` | OpenCode 官方认证存储 | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Antigravity 插件账号存储 | `google.ts`（读取逻辑） |

::: tip 不修改文件
源码中只使用了 `readFile` 函数读取文件，没有任何 `writeFile` 或其他修改操作。这意味着插件不会意外覆盖你的配置。
:::

### 源码证据

```typescript
// mystatus.ts 第 38-40 行
const content = await readFile(authPath, "utf-8");
authData = JSON.parse(content);
```

这里使用 Node.js 的 `fs/promises.readFile`，这是一个**只读操作**。如果文件不存在或格式错误，插件会返回友好的错误提示，而不是创建或修改文件。

---

## API Key 自动脱敏

### 什么是脱敏

脱敏（Masking）是指在显示敏感信息时，只显示部分字符，隐藏关键部分。

例如，你的智谱 AI API Key 可能是：
```
sk-9c89abc1234567890abcdefAQVM
```

脱敏后显示为：
```
sk-9c8****fAQVM
```

### 脱敏规则

插件使用 `maskString` 函数处理所有敏感信息：

```typescript
// utils.ts 第 130-135 行
export function maskString(str: string, showChars: number = 4): string {
  if (str.length <= showChars * 2) {
    return str;
  }
  return `${str.slice(0, showChars)}****${str.slice(-showChars)}`;
}
```

**规则说明**：
- 默认显示前 4 位和后 4 位
- 中间部分用 `****` 替代
- 如果字符串太短（≤ 8 位），则原样返回

### 实际使用示例

在智谱 AI 额度查询中，脱敏后的 API Key 会出现在输出中：

```typescript
// zhipu.ts 第 124 行
const maskedKey = maskString(apiKey);
lines.push(`${t.account}        ${maskedKey} (${accountLabel})`);
```

输出效果：
```
Account:        9c89****AQVM (Coding Plan)
```

::: tip 脱敏的作用
即使你分享查询结果截图给他人，也不会泄露你的真实 API Key。只有显示的「前后 4 位」是可见的，中间的关键部分已被隐藏。
:::

---

## 官方接口调用

### 插件调用哪些 API

插件仅调用各平台的**官方 API**，不经过任何第三方服务器：

| 平台 | API 端点 | 用途 |
| ---- | -------- | ---- |
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | 额度查询 |
| 智谱 AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | Token 限额查询 |
| Z.ai | `https://api.z.ai/api/monitor/usage/quota/limit` | Token 限额查询 |
| GitHub Copilot | `https://api.github.com/copilot_internal/user` | 额度查询 |
| GitHub Copilot | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` | 公开 API 查询 |
| Google Cloud | `https://oauth2.googleapis.com/token` | OAuth Token 刷新 |
| Google Cloud | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` | 模型额度查询 |

::: info 官方 API 的安全性
这些 API 端点都是各平台的官方接口，使用 HTTPS 加密传输。插件只是作为「客户端」发送请求，不存储或转发任何数据。
:::

### 请求超时保护

为了防止网络请求卡住，插件设置了 10 秒超时：

```typescript
// types.ts 第 114 行
export const REQUEST_TIMEOUT_MS = 10000;

// utils.ts 第 84-106 行
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(t.timeoutError(Math.round(timeoutMs / 1000)));
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**超时机制的作用**：
- 防止网络故障导致插件无限等待
- 保护你的系统资源不被占用
- 10 秒超时后自动取消请求，返回错误信息

---

## 隐私保护总结

### 插件不会做的事情

| 操作 | 插件行为 |
| ---- | -------- |
| 存储数据 | ❌ 不存储任何用户数据 |
| 上传数据 | ❌ 不上传任何数据到第三方服务器 |
| 缓存结果 | ❌ 不缓存查询结果 |
| 修改文件 | ❌ 不修改任何本地配置文件 |
| 记录日志 | ❌ 不记录任何使用日志 |

### 插件会做的事情

| 操作 | 插件行为 |
| ---- | -------- |
| 读取文件 | ✅ 只读本地认证文件 |
| 调用 API | ✅ 仅调用官方 API 端点 |
| 脱敏显示 | ✅ 自动隐藏 API Key 等敏感信息 |
| 开源审查 | ✅ 源码完全开源，可自行审计 |

### 源码可审计

插件的所有代码都是开源的，你可以：
- 查看 GitHub 源码仓库
- 检查每个 API 调用的端点
- 验证是否有数据存储逻辑
- 确认脱敏函数的实现方式

---

## 常见疑问解答

::: details 插件会窃取我的 API Key 吗？
不会。插件只使用 API Key 向官方 API 发送请求，不会存储或转发到任何第三方服务器。所有代码都是开源的，你可以审查。
:::

::: details 为什么显示脱敏后的 API Key？
这是为了保护你的隐私。即使你分享查询结果截图，也不会泄露完整的 API Key。脱敏后只显示前 4 位和后 4 位，中间部分已被隐藏。
:::

::: details 插件会修改我的配置文件吗？
不会。插件只使用 `readFile` 读取文件，不执行任何写入操作。如果你的配置文件格式错误，插件会返回错误提示，而不会尝试修复或覆盖。
:::

::: details 查询结果会缓存在插件中吗？
不会。插件每次调用时都实时读取文件并查询 API，不缓存任何结果。查询完成后立即丢弃所有数据。
:::

::: details 插件会收集使用数据吗？
不会。插件没有任何埋点或数据收集功能，不会追踪你的使用行为。
:::

---

## 本课小结

- **只读原则**：插件只读取本地认证文件，不修改任何内容
- **API 脱敏**：显示输出时自动隐藏 API Key 的关键部分
- **官方接口**：仅调用各平台的官方 API，不使用第三方服务
- **开源透明**：所有代码都是开源的，可以自行审查安全机制

## 下一课预告

> 下一课我们学习 **[数据模型：认证文件结构和 API 响应格式](/zh/vbgate/opencode-mystatus/appendix/data-models/)**
>
> 你会学到：
> - AuthData 的完整结构定义
> - 各平台认证数据的字段含义
> - API 响应的数据格式

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 认证文件读取 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| API 脱敏函数 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |
| 请求超时配置 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |
| 请求超时实现 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L84-L106) | 84-106 |
| 智谱 AI 脱敏示例 | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L124) | 124 |

**关键函数**：
- `maskString(str, showChars = 4)`：脱敏显示敏感字符串，显示前后各 `showChars` 位，中间用 `****` 替代

**关键常量**：
- `REQUEST_TIMEOUT_MS = 10000`：API 请求超时时间（10 秒）

</details>
