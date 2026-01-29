---
title: "安全隐私: 本地访问与 API 遮罩 | opencode-mystatus"
sidebarTitle: "安全隐私"
subtitle: "安全隐私: 本地访问与 API 遮罩"
description: "了解 opencode-mystatus 的安全隐私机制，包括本地只读访问、API Key 自动遮罩、官方 API 调用，确保零数据存储和隐私保护。"
tags:
  - "Security"
  - "Privacy"
  - "FAQ"
prerequisite: []
order: 999
---

# Security & Privacy: Local File Access, API Masking, Official APIs

## Your Current Concerns

When using third-party tools, what worries you most?

- "Will it read my API Key?"
- "Will my authentication information be uploaded to a server?"
- "Is there a risk of data leakage?"
- "What if it modifies my configuration files?"

These concerns are entirely reasonable, especially when handling sensitive AI platform authentication information. This tutorial explains in detail how the opencode-mystatus plugin protects your data and privacy through its design.

::: info Local-First Principle
opencode-mystatus follows a "read-only local files + direct official API queries" principle. All sensitive operations are completed on your machine, without passing through any third-party servers.
:::

## Core Principles

The plugin's security design revolves around three core principles:

1. **Read-Only Principle**: Only reads local authentication files, never writes or modifies anything
2. **Official APIs**: Only calls official APIs from each platform, never uses third-party services
3. **Data Masking**: Automatically hides sensitive information (such as API Keys) in display output

These three principles work together to ensure your data is secure throughout the entire process from reading to display.

---

## Local File Access (Read-Only)

### Which Files Does the Plugin Read?

The plugin only reads two local configuration files, both in **read-only mode**:

| File Path | Purpose | Source Location |
|--- | --- | ---|
| `~/.local/share/opencode/auth.json` | OpenCode official authentication storage | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Antigravity plugin account storage | `google.ts` (read logic) |

::: tip No File Modifications
The source code only uses the `readFile` function to read files, with no `writeFile` or other modification operations. This means the plugin will not accidentally overwrite your configuration.
:::

### Source Code Evidence

```typescript
// mystatus.ts lines 38-40
const content = await readFile(authPath, "utf-8");
authData = JSON.parse(content);
```

Here we use Node.js's `fs/promises.readFile`, which is a **read-only operation**. If the file doesn't exist or has formatting errors, the plugin will return a friendly error message instead of creating or modifying the file.

---

## Automatic API Key Masking

### What Is Masking?

Masking refers to showing only a portion of characters when displaying sensitive information, hiding the key parts.

For example, your Zhipu AI API Key might be:
```
sk-9c89abc1234567890abcdefAQVM
```

After masking, it displays as:
```
sk-9c8****fAQVM
```

### Masking Rules

The plugin uses the `maskString` function to process all sensitive information:

```typescript
// utils.ts lines 130-135
export function maskString(str: string, showChars: number = 4): string {
  if (str.length <= showChars * 2) {
    return str;
  }
  return `${str.slice(0, showChars)}****${str.slice(-showChars)}`;
}
```

**Rule Explanation**:
- By default, shows the first 4 and last 4 characters
- The middle portion is replaced with `****`
- If the string is too short (≤ 8 characters), returns it unchanged

### Practical Usage Example

In Zhipu AI quota queries, the masked API Key appears in the output:

```typescript
// zhipu.ts line 124
const maskedKey = maskString(apiKey);
lines.push(`${t.account}        ${maskedKey} (${accountLabel})`);
```

Output effect:
```
Account:        9c89****AQVM (Coding Plan)
```

::: tip Purpose of Masking
Even if you share a screenshot of the query results with others, your real API Key will not be leaked. Only the "first and last 4 characters" are visible, with the key middle portion hidden.
:::

---

## Official API Calls

### Which APIs Does the Plugin Call?

The plugin only calls **official APIs** from each platform, without passing through any third-party servers:

| Platform | API Endpoint | Purpose |
|--- | --- | ---|
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | Quota query |
| Zhipu AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | Token limit query |
| Z.ai | `https://api.z.ai/api/monitor/usage/quota/limit` | Token limit query |
| GitHub Copilot | `https://api.github.com/copilot_internal/user` | Quota query |
| GitHub Copilot | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` | Public API query |
| Google Cloud | `https://oauth2.googleapis.com/token` | OAuth token refresh |
| Google Cloud | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` | Model quota query |

::: info Security of Official APIs
These API endpoints are official interfaces from each platform, using HTTPS encrypted transmission. The plugin simply acts as a "client" sending requests, without storing or forwarding any data.
:::

### Request Timeout Protection

To prevent network requests from hanging, the plugin sets a 10-second timeout:

```typescript
// types.ts line 114
export const REQUEST_TIMEOUT_MS = 10000;

// utils.ts lines 84-106
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

**Purpose of Timeout Mechanism**:
- Prevents network failures from causing the plugin to wait indefinitely
- Protects your system resources from being occupied
- Automatically cancels requests after 10-second timeout and returns error information

---

## Privacy Protection Summary

### What the Plugin Will NOT Do

| Operation | Plugin Behavior |
|--- | ---|
| Store data | ❌ Does not store any user data |
| Upload data | ❌ Does not upload any data to third-party servers |
| Cache results | ❌ Does not cache query results |
| Modify files | ❌ Does not modify any local configuration files |
| Log usage | ❌ Does not log any usage data |

### What the Plugin WILL Do

| Operation | Plugin Behavior |
|--- | ---|
| Read files | ✅ Read-only local authentication files |
| Call APIs | ✅ Only call official API endpoints |
| Mask display | ✅ Automatically hide sensitive information like API Keys |
| Open source audit | ✅ Source code is fully open source and can be audited independently |

### Auditable Source Code

All plugin code is open source. You can:
- View the GitHub source repository
- Check the endpoint for each API call
- Verify if there's any data storage logic
- Confirm the implementation of the masking function

---

## FAQ

::: details Will the plugin steal my API Key?
No. The plugin only uses API Keys to send requests to official APIs. It does not store or forward them to any third-party servers. All code is open source and can be audited.
:::

::: details Why is the masked API Key displayed?
This is to protect your privacy. Even if you share a screenshot of query results, the complete API Key will not be leaked. After masking, only the first 4 and last 4 characters are shown, with the middle portion hidden.
:::

::: details Will the plugin modify my configuration files?
No. The plugin only uses `readFile` to read files and does not perform any write operations. If your configuration file has formatting errors, the plugin will return an error message rather than attempting to fix or overwrite it.
:::

::: details Are query results cached in the plugin?
No. The plugin reads files and queries APIs in real-time each time it's called. No results are cached. All data is immediately discarded after the query completes.
:::

::: details Does the plugin collect usage data?
No. The plugin has no telemetry or data collection functionality and does not track your usage behavior.
:::

---

## Lesson Summary

- **Read-Only Principle**: The plugin only reads local authentication files and does not modify anything
- **API Masking**: Automatically hides key portions of API Keys in display output
- **Official APIs**: Only calls official APIs from each platform, without using third-party services
- **Open Source Transparency**: All code is open source and security mechanisms can be audited independently

## Next Lesson Preview

> In the next lesson, we'll learn **[Data Models: Auth File Structure and API Response Format](/vbgate/opencode-mystatus/appendix/data-models/)**
>
> You'll learn:
> - Complete structure definition of AuthData
> - Field meanings of authentication data for each platform
> - Data format of API responses

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
|--- | --- | ---|
| Authentication file reading | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| API masking function | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |
| Request timeout configuration | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |
| Request timeout implementation | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L84-L106) | 84-106 |
| Zhipu AI masking example | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L124) | 124 |

**Key Functions**:
- `maskString(str, showChars = 4)`: Masks sensitive strings by displaying `showChars` characters at the beginning and end, with the middle replaced by `****`

**Key Constants**:
- `REQUEST_TIMEOUT_MS = 10000`: API request timeout (10 seconds)

</details>
