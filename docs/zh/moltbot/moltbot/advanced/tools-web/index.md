---
title: "Web 搜索与抓取工具：Brave、Perplexity 和网页内容提取 | Clawdbot 教程"
sidebarTitle: "让 AI 上网搜索"
subtitle: "Web 搜索与抓取工具"
description: "学习如何配置和使用 Clawdbot 的 web_search 和 web_fetch 工具，让 AI 助手访问实时网络信息。本教程涵盖 Brave Search API 和 Perplexity Sonar 配置、网页内容提取、缓存机制和常见问题排查。包括 API Key 获取、参数配置、地区语言设置和 Firecrawl 后备配置。"
tags:
  - "advanced"
  - "tools"
  - "web"
  - "search"
  - "fetch"
prerequisite:
  - "start-getting-started"
order: 230
---

# Web 搜索与抓取工具

## 学完你能做什么

- 配置 **web_search** 工具，让 AI 助手使用 Brave Search 或 Perplexity Sonar 进行网络搜索
- 配置 **web_fetch** 工具，让 AI 助手抓取和提取网页内容
- 理解两种工具的区别和使用场景
- 配置 API Key 和高级参数（地区、语言、缓存时间等）
- 排查常见问题（API Key 错误、抓取失败、缓存问题等）

## 你现在的困境

AI 助手的知识库是静态的，无法访问实时网络信息：

- AI 不知道今天发生的新闻
- AI 无法查询最新的 API 文档或技术博客
- AI 无法检索特定网站的最新内容

你想让 AI 助手"联网"，但不知道：

- 应该用 Brave 还是 Perplexity？
- API Key 从哪里获取？如何配置？
- web_search 和 web_fetch 有什么区别？
- 如何处理动态网页或登录保护的站点？

## 什么时候用这一招

- **web_search**：需要快速查找信息、搜索多个网站、获取实时数据（如新闻、价格、天气）
- **web_fetch**：需要提取特定网页的完整内容、读取文档页面、分析博客文章

::: tip 工具选择指南
| 场景 | 推荐工具 | 原因 |
|--- | --- | ---|
| 搜索多个来源 | web_search | 一次查询返回多个结果 |
| 提取单页内容 | web_fetch | 获取完整文本，支持 markdown |
| 动态网页/需登录 | [browser](../tools-browser/) | 需要执行 JavaScript |
| 简单静态页面 | web_fetch | 轻量快速 |
:::

## 🎒 开始前的准备

::: warning 前置条件
本教程假设你已完成 [快速开始](../../start/getting-started/)，已安装并启动了 Gateway。
:::

- Gateway 守护进程正在运行
- 已完成基础渠道配置（至少有一个可用的通信渠道）
- 准备好至少一个搜索提供商的 API Key（Brave 或 Perplexity/OpenRouter）

::: info 注意
web_search 和 web_fetch 是**轻量级工具**，不执行 JavaScript。对于需要登录的网站或复杂动态页面，请使用 [browser 工具](../tools-browser/)。
:::

## 核心思路

### 两个工具的区别

**web_search**：网络搜索工具
- 调用搜索引擎（Brave 或 Perplexity）返回搜索结果
- **Brave**：返回结构化结果（标题、URL、描述、发布时间）
- **Perplexity**：返回 AI 合成的答案，并附带引用链接

**web_fetch**：网页内容抓取工具
- 对指定 URL 发起 HTTP GET 请求
- 使用 Readability 算法提取主要内容（去除导航、广告等）
- 将 HTML 转换为 Markdown 或纯文本
- 不执行 JavaScript

### 为什么需要两个工具？

```
┌─────────────────┐     web_search      ┌──────────────────┐
│  用户问 AI     │ ──────────────────→  │   搜索引擎 API   │
│ "最新的新闻"   │                      │   (Brave/Perplexity) │
└─────────────────┘                      └──────────────────┘
       ↓                                        ↓
  AI 得到 5 个结果                            返回搜索结果
       ↓
┌─────────────────┐     web_fetch       ┌──────────────────┐
│  AI 选择结果   │ ──────────────────→  │   目标网页       │
│ "打开链接 1"   │                      │   (HTTP/HTTPS)   │
└─────────────────┘                      └──────────────────┘
       ↓                                        ↓
  AI 得到完整内容                            提取 Markdown
```

**典型工作流**：
1. AI 使用 **web_search** 查找相关信息
2. AI 从搜索结果中选择合适的链接
3. AI 使用 **web_fetch** 抓取具体页面内容
4. AI 基于内容回答用户问题

### 缓存机制

两个工具都内置缓存以减少重复请求：

| 工具 | 缓存键 | 默认 TTL | 配置项 |
|--- | --- | --- | ---|
| web_search | `provider:query:count:country:search_lang:ui_lang:freshness` | 15 分钟 | `tools.web.search.cacheTtlMinutes` |
| web_fetch | `fetch:url:extractMode:maxChars` | 15 分钟 | `tools.web.fetch.cacheTtlMinutes` |

::: info 缓存的好处
- 减少外部 API 调用次数（节省费用）
- 加快响应速度（相同查询直接返回缓存）
- 避免频繁请求被限流
:::

## 跟我做

### 第 1 步：选择搜索提供商

Clawdbot 支持两种搜索提供商：

| 提供商 | 优势 | 劣势 | API Key |
|--- | --- | --- | ---|
| **Brave**（默认） | 快速、结构化结果、免费层 | 传统搜索结果 | `BRAVE_API_KEY` |
| **Perplexity** | AI 合成答案、引用、实时 | 需要 Perplexity 或 OpenRouter 访问 | `OPENROUTER_API_KEY` 或 `PERPLEXITY_API_KEY` |

::: tip 推荐选择
- **初学者**：推荐使用 Brave（免费层足够日常使用）
- **需要 AI 总结**：选择 Perplexity（返回合成的答案而非原始结果）
:::

### 第 2 步：获取 Brave Search API Key

**为什么用 Brave**：免费层慷慨、速度快、结构化结果易于解析

#### 2.1 注册 Brave Search API

1. 访问 https://brave.com/search/api/
2. 创建账户并登录
3. 在 Dashboard 中选择 **"Data for Search"** 计划（不是"Data for AI"）
4. 生成 API Key

#### 2.2 配置 API Key

**方式 A：使用 CLI（推荐）**

```bash
# 运行交互式配置向导
clawdbot configure --section web
```

CLI 会提示你输入 API Key，并将其保存到 `~/.clawdbot/clawdbot.json`。

**方式 B：使用环境变量**

将 API Key 添加到 Gateway 进程的环境变量：

```bash
# 在 ~/.clawdbot/.env 中添加
echo "BRAVE_API_KEY=你的API密钥" >> ~/.clawdbot/.env

# 重启 Gateway 使环境变量生效
clawdbot gateway restart
```

**方式 C：直接编辑配置文件**

编辑 `~/.clawdbot/clawdbot.json`：

```json5
{
  "tools": {
    "web": {
      "search": {
        "apiKey": "BRAVE_API_KEY_HERE",
        "provider": "brave"
      }
    }
  }
}
```

**你应该看到**：

- 配置保存后，重启 Gateway
- 在已配置的渠道（如 WhatsApp）发送消息："帮我搜索最近的 AI 新闻"
- AI 应该返回搜索结果（标题、URL、描述）

### 第 3 步：配置 web_search 高级参数

在 `~/.clawdbot/clawdbot.json` 中可以配置更多参数：

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,           // 是否启用（默认 true）
        "provider": "brave",       // 搜索提供商
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 5,          // 返回结果数（1-10，默认 5）
        "timeoutSeconds": 30,       // 超时时间（默认 30）
        "cacheTtlMinutes": 15      // 缓存时间（默认 15 分钟）
      }
    }
  }
}
```

#### 3.1 配置地区和语言

让搜索结果更精准：

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 10,
        // 可选：AI 可以在调用时覆盖这些值
        "defaultCountry": "US",   // 默认国家（2 位代码）
        "defaultSearchLang": "en",  // 搜索结果语言
        "defaultUiLang": "en"      // UI 元素语言
      }
    }
  }
}
```

**常用国家代码**：`US`（美国）、`DE`（德国）、`FR`（法国）、`CN`（中国）、`JP`（日本）、`ALL`（全球）

**常用语言代码**：`en`（英语）、`zh`（中文）、`fr`（法语）、`de`（德语）、`es`（西班牙语）

#### 3.2 配置时间过滤（Brave 专属）

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        // 可选：AI 可以在调用时覆盖
        "defaultFreshness": "pw"  // 过滤最近一周的结果
      }
    }
  }
}
```

**Freshness 值**：
- `pd`：过去 24 小时
- `pw`：过去一周
- `pm`：过去一月
- `py`：过去一年
- `YYYY-MM-DDtoYYYY-MM-DD`：自定义日期范围（如 `2024-01-01to2024-12-31`）

### 第 4 步：配置 Perplexity Sonar（可选）

如果你更倾向于 AI 合成的答案，可以使用 Perplexity。

#### 4.1 获取 API Key

**方式 A：Perplexity 直连**

1. 访问 https://www.perplexity.ai/
2. 创建账户并订阅
3. 在 Settings 中生成 API Key（以 `pplx-` 开头）

**方式 B：通过 OpenRouter（无需信用卡）**

1. 访问 https://openrouter.ai/
2. 创建账户并充值（支持加密货币或预付费）
3. 生成 API Key（以 `sk-or-v1-` 开头）

#### 4.2 配置 Perplexity

编辑 `~/.clawdbot/clawdbot.json`：

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "perplexity",
        "perplexity": {
          // API Key（可选，也可通过环境变量设置）
          "apiKey": "sk-or-v1-...",  // 或 "pplx-..."
          // Base URL（可选，Clawdbot 会根据 API Key 自动推断）
          "baseUrl": "https://openrouter.ai/api/v1",  // 或 "https://api.perplexity.ai"
          // 模型（默认 perplexity/sonar-pro）
          "model": "perplexity/sonar-pro"
        }
      }
    }
  }
}
```

::: info 自动推断 Base URL
如果省略 `baseUrl`，Clawdbot 会根据 API Key 前缀自动选择：
- `pplx-...` → `https://api.perplexity.ai`
- `sk-or-...` → `https://openrouter.ai/api/v1`
:::

#### 4.3 选择 Perplexity 模型

| 模型 | 描述 | 适用场景 |
|--- | --- | ---|
| `perplexity/sonar` | 快速问答 + 网络搜索 | 简单查询、快速查找 |
| `perplexity/sonar-pro`（默认） | 多步推理 + 网络搜索 | 复杂问题、需要推理 |
| `perplexity/sonar-reasoning-pro` | 思维链分析 | 深度研究、需要推理过程 |

### 第 5 步：配置 web_fetch 工具

web_fetch 默认启用，无需额外配置即可使用。但你可以调整参数：

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,           // 是否启用（默认 true）
        "maxChars": 50000,        // 最大字符数（默认 50000）
        "timeoutSeconds": 30,       // 超时时间（默认 30）
        "cacheTtlMinutes": 15,     // 缓存时间（默认 15 分钟）
        "maxRedirects": 3,         // 最大重定向次数（默认 3）
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "readability": true         // 是否启用 Readability（默认 true）
      }
    }
  }
}
```

#### 5.1 配置 Firecrawl 后备（可选）

如果 Readability 提取失败，可以使用 Firecrawl 作为后备（需要 API Key）：

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "readability": true,
        "firecrawl": {
          "enabled": true,
          "apiKey": "FIRECRAWL_API_KEY_HERE",  // 或设置 FIRECRAWL_API_KEY 环境变量
          "baseUrl": "https://api.firecrawl.dev",
          "onlyMainContent": true,  // 只提取主要内容
          "maxAgeMs": 86400000,    // 缓存时间（毫秒，默认 1 天）
          "timeoutSeconds": 60
        }
      }
    }
  }
}
```

::: tip Firecrawl 的优势
- 支持渲染 JavaScript（需要启用）
- 更强的反爬虫绕过能力
- 支持复杂网站（SPA、单页应用）
:::

**获取 Firecrawl API Key**：
1. 访问 https://www.firecrawl.dev/
2. 创建账户并生成 API Key
3. 在配置中设置或使用环境变量 `FIRECRAWL_API_KEY`

### 第 6 步：验证配置

**检查 web_search**：

在已配置的渠道（如 WebChat）发送消息：

```
帮我搜索 TypeScript 5.0 的新特性
```

**你应该看到**：
- AI 返回 5 个搜索结果（标题、URL、描述）
- 如果使用 Perplexity，返回 AI 总结的答案 + 引用链接

**检查 web_fetch**：

发送消息：

```
帮我抓取 https://www.typescriptlang.org/docs/handbook/intro.html 的内容
```

**你应该看到**：
- AI 返回该页面的 Markdown 格式内容
- 内容已经去除导航、广告等无关元素

### 第 7 步：测试高级功能

**测试地区过滤**：

```
搜索德国的 TypeScript 培训课程
```

AI 可以使用 `country: "DE"` 参数进行地区特定搜索。

**测试时间过滤**：

```
搜索上周 AI 领域的新闻
```

AI 可以使用 `freshness: "pw"` 参数过滤最近一周的结果。

**测试提取模式**：

```
抓取 https://example.com 并以纯文本格式返回
```

AI 可以使用 `extractMode: "text"` 参数获取纯文本而非 Markdown。

## 检查点 ✅

确保以下配置正确：

- [ ] Gateway 正在运行
- [ ] 已配置至少一个搜索提供商（Brave 或 Perplexity）
- [ ] API Key 已正确保存（通过 CLI 或环境变量）
- [ ] web_search 测试成功（返回搜索结果）
- [ ] web_fetch 测试成功（返回页面内容）
- [ ] 缓存配置合理（避免过度请求）

::: tip 快速验证命令
```bash
# 查看 Gateway 配置
clawdbot configure --show

# 查看 Gateway 日志
clawdbot gateway logs --tail 50
```
:::

## 踩坑提醒

### 常见错误 1：API Key 未设置

**错误信息**：

```json
{
  "error": "missing_brave_api_key",
  "message": "web_search needs a Brave Search API key. Run `clawdbot configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment."
}
```

**解决方案**：

1. 运行 `clawdbot configure --section web`
2. 输入 API Key
3. 重启 Gateway：`clawdbot gateway restart`

### 常见错误 2：抓取失败（动态网页）

**问题**：web_fetch 无法抓取需要 JavaScript 的内容。

**解决方案**：

1. 确认网站是否是 SPA（单页应用）
2. 如果是，使用 [browser 工具](../tools-browser/)
3. 或配置 Firecrawl 后备（需要 API Key）

### 常见错误 3：缓存导致内容过期

**问题**：搜索结果或抓取内容是旧的。

**解决方案**：

1. 调整 `cacheTtlMinutes` 配置
2. 或在 AI 对话中明确要求"不使用缓存"
3. 重启 Gateway 清空内存缓存

### 常见错误 4：请求超时

**问题**：抓取大页面或慢速网站时超时。

**解决方案**：

```json5
{
  "tools": {
    "web": {
      "search": {
        "timeoutSeconds": 60
      },
      "fetch": {
        "timeoutSeconds": 60
      }
    }
  }
}
```

### 常见 错误 5：内网 IP 被 SSRF 阻止

**问题**：抓取内网地址（如 `http://localhost:8080`）被阻止。

**解决方案**：

web_fetch 默认阻止内网 IP 以防止 SSRF 攻击。如果确实需要访问内网：

1. 使用 [browser 工具](../tools-browser/)（更灵活）
2. 或编辑配置允许特定主机（需要修改源码）

## 本课小结

- **web_search**：网络搜索工具，支持 Brave（结构化结果）和 Perplexity（AI 合成答案）
- **web_fetch**：网页内容抓取工具，使用 Readability 提取主要内容（HTML → Markdown/text）
- 两者都内置缓存（默认 15 分钟），减少重复请求
- Brave API Key 可通过 CLI、环境变量或配置文件设置
- Perplexity 支持直连和 OpenRouter 两种方式
- 对于需要 JavaScript 的网站，使用 [browser 工具](../tools-browser/)
- 配置参数包括：结果数、超时时间、地区、语言、时间过滤等

## 下一课预告

> 下一课我们学习 **[Canvas 可视化界面与 A2UI](../canvas/)**。
>
> 你会学到：
> - Canvas A2UI 推送机制
> - 可视化界面操作
> - 如何让 AI 助手控制 Canvas 元素

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| web_search 工具定义 | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 409-483 |
| web_fetch 工具定义 | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 572-624 |
| Brave Search API 调用 | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 309-407 |
| Perplexity API 调用 | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts) | 268-307 |
| Readability 内容提取 | [`src/agents/tools/web-fetch-utils.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch-utils.ts) | - |
| Firecrawl 集成 | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts) | 257-330 |
| 缓存实现 | [`src/agents/tools/web-shared.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-shared.ts) | - |
| SSRF 保护 | [`src/infra/net/ssrf.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/net/ssrf.ts) | - |
| 配置 Schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**关键常量**：

- `DEFAULT_SEARCH_COUNT = 5`：默认搜索结果数
- `MAX_SEARCH_COUNT = 10`：最大搜索结果数
- `DEFAULT_CACHE_TTL_MINUTES = 15`：默认缓存时间（分钟）
- `DEFAULT_TIMEOUT_SECONDS = 30`：默认超时时间（秒）
- `DEFAULT_FETCH_MAX_CHARS = 50_000`：默认最大抓取字符数

**关键函数**：

- `createWebSearchTool()`：创建 web_search 工具实例
- `createWebFetchTool()`：创建 web_fetch 工具实例
- `runWebSearch()`：执行搜索并返回结果
- `runWebFetch()`：执行抓取并提取内容
- `normalizeFreshness()`：规范化时间过滤参数
- `extractReadableContent()`：使用 Readability 提取内容

</details>
