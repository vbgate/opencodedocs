---
title: "故障排查: 常见问题解决 | opencode-mystatus"
sidebarTitle: "故障排查"
subtitle: "故障排查: 常见问题解决"
description: "学习 opencode-mystatus 的故障排查方法。解决认证、权限、API 失败等问题，涵盖 OpenAI、Zhipu AI、GitHub Copilot 平台。"
tags:
  - "Troubleshooting"
  - "FAQ"
  - "Token Expiration"
  - "Permission Issues"
prerequisite:
  - "start-quick-start"
order: 999
---

# FAQ: Troubleshooting Quota Query Issues, Token Expiration, Permissions

When using the opencode-mystatus plugin, you may encounter various errors: unable to read authentication files, OAuth token expiration, GitHub Copilot permission issues, API request failures, etc. These common problems can usually be resolved through simple configuration or re-authorization. This tutorial compiles troubleshooting steps for all common errors to help you quickly identify the root cause.

## What You'll Learn

- Quickly identify why mystatus queries fail
- Resolve OpenAI token expiration issues
- Configure GitHub Copilot fine-grained PAT
- Handle missing Google Cloud project_id
- Address various API request failures and timeouts

## Your Current Pain Point

You execute `/mystatus` to query quotas but see various error messages, unsure where to start troubleshooting.

## When to Use This

- **When you see any error messages**: This tutorial covers all common errors
- **When configuring new accounts**: Verify configuration is correct
- **When quota queries suddenly fail**: May be token expiration or permission changes

::: tip Troubleshooting Principle

When encountering errors, first identify keywords in the error message, then refer to the corresponding solution in this tutorial. Most errors have clear提示信息.

:::

## Core Concept

mystatus tool's error handling mechanism consists of three layers:

1. **Auth File Reading Layer**: Checks if `auth.json` exists and has correct format
2. **Platform Query Layer**: Each platform queries independently; one platform's failure doesn't affect others
3. **API Request Layer**: Network requests may timeout or return errors, but the tool continues trying other platforms

This means:
- One platform's failure won't prevent other platforms from displaying
- Error messages clearly indicate which platform has issues
- Most errors can be resolved through configuration or re-authorization


## Troubleshooting Checklist

### Issue 1: Unable to Read Authentication File

**Error Message**:

```
❌ 无法读取认证文件: ~/.local/share/opencode/auth.json
错误: ENOENT: no such file or directory
```

**Cause**:
- OpenCode's authentication file doesn't exist
- No platform accounts have been configured yet

**Solution**:

1. **Confirm OpenCode is installed and configured**
   - Confirm you've configured at least one platform in OpenCode (OpenAI, Zhipu AI, etc.)
   - If not, complete authorization in OpenCode first

2. **Check file path**
   - OpenCode's authentication file should be at `~/.local/share/opencode/auth.json`
   - If using a custom configuration directory, verify the file path is correct

3. **Verify file format**
   - Confirm `auth.json` is a valid JSON file
   - File content should contain authentication info for at least one platform

**You Should See**:
After re-executing `/mystatus`, you should see quota information for at least one platform.

---

### Issue 2: No Configured Accounts Found

**Error Message**:

```
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

**Cause**:
- `auth.json` exists but contains no valid configuration
- Existing configuration format is incorrect (missing required fields)

**Solution**:

1. **Check auth.json content**
   Open `~/.local/share/opencode/auth.json`, confirm at least one platform configuration:

   ```json
   {
     "openai": {
       "type": "oauth",
       "access": "eyJ...",
       "expires": 1738000000000
     }
   }
   ```

2. **Configure at least one platform**
   - Complete OAuth authorization in OpenCode
   - Or manually add platform API key (Zhipu AI, Z.ai)

3. **Reference configuration format**
   Platform configuration requirements:
   - OpenAI: Must have `type: "oauth"` and `access` token
   - Zhipu AI / Z.ai: Must have `type: "api"` and `key`
   - GitHub Copilot: Must have `type: "oauth"` and `refresh` token
   - Google Cloud: Doesn't depend on `auth.json`, requires separate configuration (see Issue 6)

---

### Issue 3: OpenAI OAuth Token Expired

**Error Message**:

```
⚠️ OAuth 授权已过期，请在 OpenCode 中使用一次 OpenAI 模型以刷新授权。
```

**Cause**:
- OpenAI's OAuth token has limited validity and expires after a period
- Token expiration time is stored in the `expires` field of `auth.json`

**Solution**:

1. **Use an OpenAI model once in OpenCode**
   - Ask ChatGPT or Codex a question
   - OpenCode will automatically refresh the token and update `auth.json`

2. **Confirm token has been updated**
   - Check the `expires` field in `auth.json`
   - Confirm it's a future timestamp

3. **Re-execute /mystatus**
   - Now you should be able to query OpenAI quota normally

**Why you need to use the model again**:
OpenAI's OAuth token has an expiration mechanism, and using the model triggers token refresh. This is a security feature of OpenCode's official authentication process.

---

### Issue 4: API Request Failed (General)

**Error Message**:

```
OpenAI API 请求失败 (401): Unauthorized
智谱 API 请求失败 (403): Forbidden
Google API 请求失败 (500): Internal Server Error
```

**Cause**:
- Token or API key is invalid
- Network connection issues
- API service temporarily unavailable
- Insufficient permissions (some platforms require specific permissions)

**Solution**:

1. **Check token or API key**
   - OpenAI: Confirm `access` token hasn't expired (see Issue 3)
   - Zhipu AI / Z.ai: Confirm `key` is correct, no extra spaces
   - GitHub Copilot: Confirm `refresh` token is valid

2. **Check network connection**
   - Confirm network is working normally
   - Some platforms may have regional restrictions (e.g., Google Cloud)

3. **Try re-authorization**
   - Re-do OAuth authorization in OpenCode
   - Or manually update API key

4. **Check specific HTTP status codes**
   - `401` / `403`: Permission issue, usually invalid token or API key
   - `500` / `503`: Server error, usually API temporarily unavailable, retry later
   - `429`: Too many requests, need to wait for a period

---

### Issue 5: Request Timeout

**Error Message**:

```
请求超时 (10秒)
```

**Cause**:
- Slow network connection
- API response time too long
- Firewall or proxy blocking request

**Solution**:

1. **Check network connection**
   - Confirm network is stable
   - Try accessing the platform's website to confirm normal access

2. **Check proxy settings**
   - If using a proxy, confirm proxy configuration is correct
   - Some platforms may require special proxy configuration

3. **Retry once**
   - Sometimes it's just temporary network fluctuation
   - Retrying once usually solves the problem

---

### Issue 6: GitHub Copilot Quota Query Unavailable

**Error Message**:

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
3. 创建配置文件并填写以下内容（包含必需的 `tier` 字段）：
   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的用户名",
     "tier": "pro"
   }
   ```

其他方法:
• 在 VS Code 中点击状态栏的 Copilot 图标查看配额
• 访问 https://github.com/settings/billing 查看使用情况
```

**Cause**:
- OpenCode's official OAuth integration uses a new authentication flow
- New OAuth tokens don't have `copilot` permission and can't call internal quota API
- This is OpenCode's official security restriction

**Solution** (Recommended):

1. **Create Fine-grained PAT**
   - Visit https://github.com/settings/tokens?type=beta
   - Click "Generate new token" → "Fine-grained token"
   - Fill in token name (e.g., "OpenCode Copilot Quota")

2. **Configure permissions**
   - In "Account permissions", find "Plan" permission
   - Set to "Read-only"
   - Click "Generate token"

3. **Create configuration file**
   Create `~/.config/opencode/copilot-quota-token.json`:

   ```json
   {
     "token": "github_pat_xxx...",
     "username": "your GitHub username",
     "tier": "pro"
   }
   ```

   **tier field description**:
   - `free`: Copilot Free (50 requests/month)
   - `pro`: Copilot Pro (300 requests/month)
   - `pro+`: Copilot Pro+ (1500 requests/month)
   - `business`: Copilot Business (300 requests/month)
   - `enterprise`: Copilot Enterprise (1000 requests/month)

4. **Re-execute /mystatus**
   - Now you should be able to query GitHub Copilot quota normally

**Alternative Solution**:

If you don't want to configure PAT, you can:
- Click the Copilot icon in VS Code's status bar to view quota
- Visit https://github.com/settings/billing to view usage

---

### Issue 7: Google Cloud Missing project_id

**Error Message**:

```
⚠️ 缺少 project_id，无法查询额度。
```

**Cause**:
- Google Cloud account configuration is missing `projectId` or `managedProjectId`
- mystatus requires project ID to call Google Cloud API

**Solution**:

1. **Check antigravity-accounts.json**
   Open the configuration file, confirm account configuration includes `projectId` or `managedProjectId`:

::: code-group

```bash [macOS/Linux]
~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
%APPDATA%\opencode\antigravity-accounts.json
```

:::

   ```json
   {
     "accounts": [
       {
         "email": "your-email@gmail.com",
         "refreshToken": "1//xxx",
         "projectId": "your-project-id",
         "addedAt": 1738000000000,
         "lastUsed": 1738000000000,
         "rateLimitResetTimes": {}
       }
     ]
   }
   ```

2. **How to get project_id**
   - Visit https://console.cloud.google.com/
   - Select your project
   - Find "Project ID" in project information
   - Copy it to the configuration file

3. **If you don't have project_id**
   - If you're using a managed project, you may need to use `managedProjectId`
   - Contact your Google Cloud administrator to confirm project ID

---

### Issue 8: Zhipu AI / Z.ai API Returns Invalid Data

**Error Message**:

```
智谱 API 请求失败 (200): {"code": 401, "msg": "Invalid API key"}
Z.ai API 请求失败 (200): {"code": 400, "msg": "Bad request"}
```

**Cause**:
- API key is invalid or has incorrect format
- API key has expired or been revoked
- Account doesn't have permission for corresponding service

**Solution**:

1. **Confirm API key is correct**
   - Log in to Zhipu AI or Z.ai console
   - Check if your API key is valid
   - Confirm no extra spaces or newlines

2. **Check API key permissions**
   - Zhipu AI: Confirm you have "Coding Plan" permission
   - Z.ai: Confirm you have "Coding Plan" permission

3. **Regenerate API key**
   - If API key has issues, you can regenerate in the console
   - Update the `key` field in `auth.json`

---

## Checkpoint ✅

Confirm you can independently resolve common issues:

| Skill | Check Method | Expected Result |
| ----- | ----------- | --------------- |
| Troubleshoot auth file issues | Check if auth.json exists and has correct format | File exists, JSON format is correct |
| Refresh OpenAI token | Use an OpenAI model once in OpenCode | Token updated, quota queries work normally |
| Configure Copilot PAT | Create copilot-quota-token.json | Can query Copilot quota normally |
| Handle API errors | Check HTTP status codes and take corresponding action | Know the meaning of 401/403/500 error codes |
| Configure Google project_id | Add projectId to antigravity-accounts.json | Can query Google Cloud quota normally |

---

## Summary

mystatus error handling consists of three layers: auth file reading, platform querying, and API requests. When encountering errors, first identify keywords in the error message, then refer to the corresponding solution. The most common issues include:

1. **Auth file issues**: Check if `auth.json` exists and has correct format
2. **Token expiration**: Use the corresponding model once in OpenCode to refresh token
3. **API errors**: Based on HTTP status codes, determine if it's a permission issue or server-side issue
4. **Copilot special permissions**: New OAuth integration requires configuring fine-grained PAT
5. **Google configuration**: Requires project_id to query quota

Most errors can be resolved through configuration or re-authorization, and one platform's failure won't affect other platforms' queries.

## Next Lesson Preview

> In the next lesson, we'll learn **[Security & Privacy: Local File Access, API Redaction, Official APIs](/vbgate/opencode-mystatus/faq/security/)**.
>
> You'll learn:
> - How mystatus protects your sensitive data
> - Principles of automatic API key redaction
> - Why the plugin is a secure local tool
> - Guarantees of no data storage or upload

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Error handling main logic | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |
| Auth file reading | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 38-46 |
| No account found prompt | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 78-80 |
| Result collection and summary | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| OpenAI token expiration check | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 216-221 |
| API error handling | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 149-152 |
| Copilot PAT reading | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Copilot OAuth failure prompt | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 298-303 |
| Google project_id check | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 232-234 |
| Zhipu API error handling | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 94-103 |
| Error message definitions | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts) | 66-123 (Chinese), 144-201 (English) |

**Key Constants**:

- `HIGH_USAGE_THRESHOLD = 80`: High usage warning threshold (`plugin/lib/types.ts:111`)

**Key Functions**:

- `collectResult()`: Collects query results into results and errors arrays (`plugin/mystatus.ts:100-116`)
- `queryOpenAIUsage()`: Queries OpenAI quota, includes token expiration check (`plugin/lib/openai.ts:207-236`)
- `readQuotaConfig()`: Reads Copilot PAT configuration (`plugin/lib/copilot.ts:122-151`)
- `fetchAccountQuota()`: Queries single Google Cloud account quota (`plugin/lib/google.ts:218-256`)
- `fetchUsage()`: Queries Zhipu/Z.ai usage (`plugin/lib/zhipu.ts:81-106`)

</details>
