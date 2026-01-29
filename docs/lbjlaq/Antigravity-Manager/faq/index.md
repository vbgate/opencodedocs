---
title: "FAQ: Error Codes & Solutions | Antigravity Manager"
sidebarTitle: "FAQ"
subtitle: "FAQ: Error Codes & Solutions"
description: "Learn to troubleshoot common Antigravity Tools errors. This chapter covers OAuth failures, auth issues, rate limits, path errors, and streaming exceptions with quick solutions."
order: 4
---

# FAQ

This chapter collects the most frequently encountered error codes and exceptional scenarios when using Antigravity Tools, helping you quickly identify root causes and find solutions.

## In This Chapter

| Issue Type | Page | Description |
|--- | --- | ---|
| Account Invalid | [invalid_grant & Auto-Disable](./invalid-grant/) | Account suddenly unavailable? Understand OAuth Token failure causes and recovery process |
| Auth Failure | [401/Auth Failed](./auth-401/) | Request rejected? Check auth_mode configuration and Header format |
| Rate Limit Errors | [429/Capacity Errors](./429-rotation/) | Frequent 429s? Distinguish quota exhaustion from upstream rate limiting, use rotation to reduce impact |
| Path Errors | [404/Path Incompatible](./404-base-url/) | Endpoint 404? Resolve Base URL and /v1 prefix concatenation issues |
| Streaming Exceptions | [Streaming Interruption/0 Token/Signature Invalid](./streaming-0token/) | Response interrupted or empty? Understand proxy self-healing mechanisms and troubleshooting paths |

## Recommended Learning Path

**Troubleshoot by error code**: When encountering a specific error, jump directly to the corresponding page.

**Systematic learning**: If you want a comprehensive understanding of potential issues, it's recommended to read in the following order:

1. **[404/Path Incompatible](./404-base-url/)** — The most common integration issue, usually the first pitfall
2. **[401/Auth Failed](./auth-401/)** — Path is correct but request rejected, check auth configuration
3. **[invalid_grant & Auto-Disable](./invalid-grant/)** — Account-level issues
4. **[429/Capacity Errors](./429-rotation/)** — Request succeeds but is rate limited
5. **[Streaming Interruption/0 Token/Signature Invalid](./streaming-0token/)** — Advanced issues involving streaming responses and signature mechanisms

## Prerequisites

::: warning Recommended First
- [Start Local Reverse Proxy & Connect First Client](../start/proxy-and-first-client/) — Ensure basic environment is working
- [Add Accounts](../start/add-account/) — Understand the correct way to add accounts
:::

## Next Steps

After troubleshooting issues, you can continue deep learning:

- **[High-Availability Scheduling](../advanced/scheduling/)** — Use rotation and retry strategies to reduce error occurrence
- **[Proxy Monitor](../advanced/monitoring/)** — Use the logging system to track request details
- **[Configuration Guide](../advanced/config/)** — Understand the purpose of all configuration options
