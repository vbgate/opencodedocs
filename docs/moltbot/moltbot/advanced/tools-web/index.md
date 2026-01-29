---
title: "Web Search and Fetch Tools: Brave, Perplexity, and Content Extraction"
sidebarTitle: "Web Search and Fetch"
subtitle: "Web Search and Fetch Tools"
description: "Learn how to configure and use Clawdbot's web_search and web_fetch tools to enable AI assistant access to real-time web information. Covers Brave Search API and Perplexity Sonar configuration, web content extraction, caching mechanisms, and troubleshooting. Includes API key setup, parameter configuration, region and language settings, and Firecrawl fallback configuration."
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

# Web Search and Fetch Tools

## What You'll Learn

After completing this lesson, you will be able to:

- Configure **web_search** tool to enable AI assistant to use Brave Search or Perplexity Sonar for web searching
- Configure **web_fetch** tool to enable AI assistant to scrape and extract web page content
- Understand the differences between the two tools and their use cases
- Configure API keys and advanced parameters (region, language, cache duration, etc.)
- Troubleshoot common issues (API key errors, fetch failures, cache problems, etc.)

## Your Current Challenge

The AI assistant's knowledge base is static and cannot access real-time web information:

- AI doesn't know news happening today
- AI cannot query the latest API documentation or technical blogs
- AI cannot retrieve the latest content from specific websites

You want to enable your AI assistant to "go online," but you're unsure about:

- Should you use Brave or Perplexity?
- Where to get API keys and how to configure them?
- What's the difference between web_search and web_fetch?
- How to handle dynamic web pages or login-protected sites?

## When to Use This

- **web_search**: When you need to quickly find information, search multiple websites, or get real-time data (news, prices, weather)
- **web_fetch**: When you need to extract complete content from a specific web page, read documentation pages, or analyze blog posts

::: tip Tool Selection Guide
| Scenario | Recommended Tool | Reason |
|--- | --- | ---|
| Search multiple sources | web_search | Returns multiple results in one query |
| Extract single-page content | web_fetch | Gets complete text, supports markdown |
| Dynamic pages / Login required | [browser](../tools-browser/) | Requires JavaScript execution |
| Simple static pages | web_fetch | Lightweight and fast |
:::

## 🎒 Prerequisites

::: warning Prerequisites
This tutorial assumes you have completed [Quick Start](../../start/getting-started/) and have installed and started the Gateway.
:::

- Gateway daemon is running
- Basic channel configuration completed (at least one working communication channel)
- Prepare at least one search provider's API key (Brave or Perplexity/OpenRouter)

::: info Note
web_search and web_fetch are **lightweight tools** that do not execute JavaScript. For websites requiring login or complex dynamic pages, please use the [browser tool](../tools-browser/).
:::

## Core Concepts

### Difference Between the Two Tools

**web_search**: Web search tool
- Calls search engines (Brave or Perplexity) to return search results
- **Brave**: Returns structured results (title, URL, description, publication date)
- **Perplexity**: Returns AI-synthesized answers with citation links

**web_fetch**: Web page content scraping tool
- Makes HTTP GET requests to specified URLs
- Uses Readability algorithm to extract main content (removes navigation, ads, etc.)
- Converts HTML to Markdown or plain text
- Does not execute JavaScript

### Why Do We Need Two Tools?

```
┌─────────────────┐     web_search      ┌──────────────────┐
│  User asks AI   │ ──────────────────→  │   Search Engine API   │
│  "Latest news"  │                      │   (Brave/Perplexity) │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   AI gets 5 results                          Return search results
        ↓
┌─────────────────┐     web_fetch       ┌──────────────────┐
│  AI selects result │ ──────────────────→  │   Target Web Page     │
│  "Open link 1"   │                      │   (HTTP/HTTPS)   │
└─────────────────┘                      └──────────────────┘
        ↓                                        ↓
   AI gets complete content                    Extract Markdown
```

**Typical Workflow**:
1. AI uses **web_search** to find relevant information
2. AI selects appropriate links from search results
3. AI uses **web_fetch** to scrape specific page content
4. AI answers user questions based on the content

### Caching Mechanism

Both tools have built-in caching to reduce duplicate requests:

| Tool | Cache Key | Default TTL | Config Item |
|--- | --- | --- | ---|
| web_search | `provider:query:count:country:search_lang:ui_lang:freshness` | 15 minutes | `tools.web.search.cacheTtlMinutes` |
| web_fetch | `fetch:url:extractMode:maxChars` | 15 minutes | `tools.web.fetch.cacheTtlMinutes` |

::: info Benefits of Caching
- Reduces external API calls (saves costs)
- Speeds up response time (same queries return cached results)
- Avoids rate limiting from frequent requests
:::

## Follow Along

### Step 1: Choose a Search Provider

Clawdbot supports two search providers:

| Provider | Advantages | Disadvantages | API Key |
|--- | --- | --- | ---|
| **Brave** (default) | Fast, structured results, free tier | Traditional search results | `BRAVE_API_KEY` |
| **Perplexity** | AI-synthesized answers, citations, real-time | Requires Perplexity or OpenRouter access | `OPENROUTER_API_KEY` or `PERPLEXITY_API_KEY` |

::: tip Recommendation
- **Beginners**: Recommend using Brave (free tier sufficient for daily use)
- **Need AI summaries**: Choose Perplexity (returns synthesized answers instead of raw results)
:::

### Step 2: Get Brave Search API Key

**Why Use Brave**: Generous free tier, fast speed, structured results easy to parse

#### 2.1 Register for Brave Search API

1. Visit https://brave.com/search/api/
2. Create an account and log in
3. In Dashboard, select **"Data for Search"** plan (not "Data for AI")
4. Generate API Key

#### 2.2 Configure API Key

**Method A: Using CLI (Recommended)**

```bash
# Run interactive configuration wizard
clawdbot configure --section web
```

The CLI will prompt you to enter the API key and save it to `~/.clawdbot/clawdbot.json`.

**Method B: Using Environment Variables**

Add the API key to the Gateway process environment:

```bash
# Add to ~/.clawdbot/.env
echo "BRAVE_API_KEY=your_api_key_here" >> ~/.clawdbot/.env

# Restart Gateway for environment variables to take effect
clawdbot gateway restart
```

**Method C: Directly Edit Configuration File**

Edit `~/.clawdbot/clawdbot.json`:

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

**You Should See**:

- After saving configuration, restart Gateway
- Send a message in configured channel (e.g., WhatsApp): "Help me search for recent AI news"
- AI should return search results (titles, URLs, descriptions)

### Step 3: Configure web_search Advanced Parameters

You can configure more parameters in `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,           // Whether enabled (default true)
        "provider": "brave",       // Search provider
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 5,          // Number of results to return (1-10, default 5)
        "timeoutSeconds": 30,       // Timeout duration (default 30)
        "cacheTtlMinutes": 15      // Cache duration (default 15 minutes)
      }
    }
  }
}
```

#### 3.1 Configure Region and Language

Make search results more precise:

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        "maxResults": 10,
        // Optional: AI can override these values when calling
        "defaultCountry": "US",   // Default country (2-letter code)
        "defaultSearchLang": "en",  // Search result language
        "defaultUiLang": "en"      // UI element language
      }
    }
  }
}
```

**Common country codes**: `US` (United States), `DE` (Germany), `FR` (France), `CN` (China), `JP` (Japan), `ALL` (Global)

**Common language codes**: `en` (English), `zh` (Chinese), `fr` (French), `de` (German), `es` (Spanish)

#### 3.2 Configure Time Filtering (Brave Exclusive)

```json5
{
  "tools": {
    "web": {
      "search": {
        "provider": "brave",
        "apiKey": "BRAVE_API_KEY_HERE",
        // Optional: AI can override when calling
        "defaultFreshness": "pw"  // Filter results from past week
      }
    }
  }
}
```

**Freshness values**:
- `pd`: Past 24 hours
- `pw`: Past week
- `pm`: Past month
- `py`: Past year
- `YYYY-MM-DDtoYYYY-MM-DD`: Custom date range (e.g., `2024-01-01to2024-12-31`)

### Step 4: Configure Perplexity Sonar (Optional)

If you prefer AI-synthesized answers, you can use Perplexity.

#### 4.1 Get API Key

**Method A: Perplexity Direct**

1. Visit https://www.perplexity.ai/
2. Create an account and subscribe
3. Generate API key in Settings (starts with `pplx-`)

**Method B: Through OpenRouter (No Credit Card)**

1. Visit https://openrouter.ai/
2. Create an account and top up (supports crypto or prepaid)
3. Generate API key (starts with `sk-or-v1-`)

#### 4.2 Configure Perplexity

Edit `~/.clawdbot/clawdbot.json`:

```json5
{
  "tools": {
    "web": {
      "search": {
        "enabled": true,
        "provider": "perplexity",
        "perplexity": {
          // API key (optional, can also be set via environment variable)
          "apiKey": "sk-or-v1-...",  // or "pplx-..."
          // Base URL (optional, Clawdbot auto-infers from API key)
          "baseUrl": "https://openrouter.ai/api/v1",  // or "https://api.perplexity.ai"
          // Model (default perplexity/sonar-pro)
          "model": "perplexity/sonar-pro"
        }
      }
    }
  }
}
```

::: info Auto-Detect Base URL
If you omit `baseUrl`, Clawdbot will auto-select based on API key prefix:
- `pplx-...` → `https://api.perplexity.ai`
- `sk-or-...` → `https://openrouter.ai/api/v1`
:::

#### 4.3 Choose Perplexity Model

| Model | Description | Use Case |
|--- | --- | ---|
| `perplexity/sonar` | Fast Q&A + web search | Simple queries, quick lookups |
| `perplexity/sonar-pro` (default) | Multi-step reasoning + web search | Complex questions, need reasoning |
| `perplexity/sonar-reasoning-pro` | Chain-of-thought analysis | Deep research, need reasoning process |

### Step 5: Configure web_fetch Tool

web_fetch is enabled by default and can be used without additional configuration. But you can adjust parameters:

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "enabled": true,           // Whether enabled (default true)
        "maxChars": 50000,        // Maximum character count (default 50000)
        "timeoutSeconds": 30,       // Timeout duration (default 30)
        "cacheTtlMinutes": 15,     // Cache duration (default 15 minutes)
        "maxRedirects": 3,         // Maximum redirect count (default 3)
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "readability": true         // Whether to enable Readability (default true)
      }
    }
  }
}
```

#### 5.1 Configure Firecrawl Fallback (Optional)

If Readability extraction fails, you can use Firecrawl as a fallback (requires API key):

```json5
{
  "tools": {
    "web": {
      "fetch": {
        "readability": true,
        "firecrawl": {
          "enabled": true,
          "apiKey": "FIRECRAWL_API_KEY_HERE",  // or set FIRECRAWL_API_KEY environment variable
          "baseUrl": "https://api.firecrawl.dev",
          "onlyMainContent": true,  // Extract only main content
          "maxAgeMs": 86400000,    // Cache duration (ms, default 1 day)
          "timeoutSeconds": 60
        }
      }
    }
  }
}
```

::: tip Advantages of Firecrawl
- Supports JavaScript rendering (needs to be enabled)
- Stronger anti-crawling bypass capability
- Supports complex websites (SPA, single-page applications)
:::

**Get Firecrawl API Key**:
1. Visit https://www.firecrawl.dev/
2. Create an account and generate API key
3. Set in configuration or use environment variable `FIRECRAWL_API_KEY`

### Step 6: Verify Configuration

**Check web_search**:

Send a message in configured channel (e.g., WebChat):

```
Help me search for new features in TypeScript 5.0
```

**You Should See**:
- AI returns 5 search results (titles, URLs, descriptions)
- If using Perplexity, returns AI-summarized answer + citation links

**Check web_fetch**:

Send a message:

```
Help me fetch content from https://www.typescriptlang.org/docs/handbook/intro.html
```

**You Should See**:
- AI returns Markdown-formatted content from that page
- Content has navigation, ads, and other irrelevant elements removed

### Step 7: Test Advanced Features

**Test Region Filtering**:

```
Search for TypeScript training courses in Germany
```

AI can use `country: "DE"` parameter for region-specific search.

**Test Time Filtering**:

```
Search for AI news from last week
```

AI can use `freshness: "pw"` parameter to filter results from the past week.

**Test Extraction Mode**:

```
Fetch https://example.com and return in plain text format
```

AI can use `extractMode: "text"` parameter to get plain text instead of Markdown.

## Checkpoint ✅

Ensure the following configurations are correct:

- [ ] Gateway is running
- [ ] At least one search provider configured (Brave or Perplexity)
- [ ] API key correctly saved (via CLI or environment variable)
- [ ] web_search test successful (returns search results)
- [ ] web_fetch test successful (returns page content)
- [ ] Cache configuration reasonable (avoid excessive requests)

::: tip Quick Verification Commands
```bash
# View Gateway configuration
clawdbot configure --show

# View Gateway logs
clawdbot gateway logs --tail 50
```
:::

## Common Pitfalls

### Common Error 1: API Key Not Set

**Error Message**:

```json
{
  "error": "missing_brave_api_key",
  "message": "web_search needs a Brave Search API key. Run `clawdbot configure --section web` to store it, or set BRAVE_API_KEY in Gateway environment."
}
```

**Solution**:

1. Run `clawdbot configure --section web`
2. Enter API key
3. Restart Gateway: `clawdbot gateway restart`

### Common Error 2: Fetch Failure (Dynamic Web Pages)

**Problem**: web_fetch cannot scrape content that requires JavaScript.

**Solution**:

1. Confirm if the website is a SPA (single-page application)
2. If so, use [browser tool](../tools-browser/)
3. Or configure Firecrawl fallback (requires API key)

### Common Error 3: Cache Causes Stale Content

**Problem**: Search results or fetched content are outdated.

**Solution**:

1. Adjust `cacheTtlMinutes` configuration
2. Or explicitly request "don't use cache" in AI conversation
3. Restart Gateway to clear in-memory cache

### Common Error 4: Request Timeout

**Problem**: Timeout when fetching large pages or slow websites.

**Solution**:

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

### Common Error 5: Intranet IP Blocked by SSRF

**Problem**: Fetching intranet addresses (e.g., `http://localhost:8080`) is blocked.

**Solution**:

web_fetch blocks intranet IPs by default to prevent SSRF attacks. If you really need to access the intranet:

1. Use [browser tool](../tools-browser/) (more flexible)
2. Or edit configuration to allow specific hosts (requires source code modification)

## Lesson Summary

- **web_search**: Web search tool supporting Brave (structured results) and Perplexity (AI-synthesized answers)
- **web_fetch**: Web page content scraping tool using Readability to extract main content (HTML → Markdown/text)
- Both have built-in caching (default 15 minutes) to reduce duplicate requests
- Brave API key can be set via CLI, environment variable, or configuration file
- Perplexity supports both direct connection and OpenRouter methods
- For websites requiring JavaScript, use [browser tool](../tools-browser/)
- Configuration parameters include: result count, timeout, region, language, time filtering, etc.

## Coming Up Next

> In the next lesson, we'll learn **[Canvas Visualization and A2UI](../canvas/)**.
>
> You'll learn:
> - Canvas A2UI push mechanism
> - Visual interface operations
> - How to let AI assistant control Canvas elements

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Feature | File Path | Line |
|--- | --- | ---|
| web_search tool definition | [`src/agents/tools/web-search.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-search.ts) | 409-483 |
| web_fetch tool definition | [`src/agents/tools/web-fetch.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-fetch.ts) | 572-624 |
| Brave Search API call | [`src/agents/tools/web-search.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-search.ts) | 309-407 |
| Perplexity API call | [`src/agents/tools/web-search.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-search.ts) | 268-307 |
| Readability content extraction | [`src/agents/tools/web-fetch-utils.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-fetch-utils.ts) | - |
| Firecrawl integration | [`src/agents/tools/web-fetch.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-fetch.ts) | 257-330 |
| Cache implementation | [`src/agents/tools/web-shared.ts`](https://github.com/moltbot/moltbot/blob/main/src/agents/tools/web-shared.ts) | - |
| SSRF protection | [`src/infra/net/ssrf.ts`](https://github.com/moltbot/moltbot/blob/main/src/infra/net/ssrf.ts) | - |
| Configuration Schema | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts) | - |

**Key Constants**:

- `DEFAULT_SEARCH_COUNT = 5`: Default search result count
- `MAX_SEARCH_COUNT = 10`: Maximum search result count
- `DEFAULT_CACHE_TTL_MINUTES = 15`: Default cache duration (minutes)
- `DEFAULT_TIMEOUT_SECONDS = 30`: Default timeout duration (seconds)
- `DEFAULT_FETCH_MAX_CHARS = 50_000`: Default maximum fetch character count

**Key Functions**:

- `createWebSearchTool()`: Create web_search tool instance
- `createWebFetchTool()`: Create web_fetch tool instance
- `runWebSearch()`: Execute search and return results
- `runWebFetch()`: Execute fetch and extract content
- `normalizeFreshness()`: Normalize time filtering parameter
- `extractReadableContent()`: Extract content using Readability

</details>
