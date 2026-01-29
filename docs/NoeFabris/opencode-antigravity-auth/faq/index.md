---
title: "FAQ: 常见问题解答 | opencode-antigravity-auth"
sidebarTitle: "FAQ"
subtitle: "FAQ: 常见问题解答"
description: "学习 opencode-antigravity-auth 的常见问题排查方法。涵盖 OAuth 认证失败、模型请求错误、插件兼容性等问题的解决方案。"
order: 4
---

# Frequently Asked Questions

This section compiles the most common problems and solutions encountered when using the Antigravity Auth plugin. Whether it's OAuth authentication failures, model request errors, or plugin compatibility issues, you'll find corresponding troubleshooting guides here.

## Prerequisites

::: warning Before You Begin
- ✅ Completed [Quick Installation](../start/quick-install/) and successfully added an account
- ✅ Completed [First Authentication](../start/first-auth-login/) and understand the OAuth flow
:::

## Learning Path

Choose the corresponding troubleshooting guide based on the type of problem you encounter:

### 1. [OAuth Authentication Failure Troubleshooting](./common-auth-issues/)

Solve common issues related to OAuth authentication, token refresh, and accounts.

- Browser authorization succeeds but terminal shows "Authorization failed"
- Sudden error "Permission Denied" or "invalid_grant"
- Safari browser OAuth callback failure
- Unable to complete authentication in WSL2/Docker environments

### 2. [Account Migration](./migration-guide/)

Migrate accounts between different machines and handle version upgrades.

- Migrate accounts from an old computer to a new one
- Understand storage format version changes (v1/v2/v3)
- Resolve invalid_grant errors after migration

### 3. [Model Not Found Troubleshooting](./model-not-found/)

Solve model-related issues such as model not found, 400 errors, etc.

- `Model not found` error troubleshooting
- `Invalid JSON payload received. Unknown name "parameters"` 400 error
- MCP server call errors

### 4. [Plugin Compatibility](./plugin-compatibility/)

Solve compatibility issues with plugins like oh-my-opencode, DCP, etc.

- Correctly configure plugin loading order
- Disable conflicting authentication methods in oh-my-opencode
- Enable PID offset for parallel agent scenarios

### 5. [ToS Warning](./tos-warning/)

Understand usage risks to avoid account suspension.

- Learn about Google Terms of Service restrictions
- Identify high-risk scenarios (new accounts, intensive requests)
- Master best practices to avoid account suspension

## Quick Problem Location

| Error Symptom | Recommended Reading |
| ------------- | ------------------ |
| Authentication failure, authorization timeout | [OAuth Authentication Failure Troubleshooting](./common-auth-issues/) |
| invalid_grant, Permission Denied | [OAuth Authentication Failure Troubleshooting](./common-auth-issues/) |
| Model not found, 400 errors | [Model Not Found Troubleshooting](./model-not-found/) |
| Conflicts with other plugins | [Plugin Compatibility](./plugin-compatibility/) |
| Switching to new computer, version upgrade | [Account Migration](./migration-guide/) |
| Concerned about account security | [ToS Warning](./tos-warning/) |

## Next Steps

After resolving issues, you can:

- 📖 Read [Advanced Features](../advanced/) to deeply master features like multi-account, session recovery, etc.
- 📚 Check [Appendix](../appendix/) to understand architecture design and complete configuration reference
- 🔄 Follow [Changelog](../changelog/) to get the latest features and changes
