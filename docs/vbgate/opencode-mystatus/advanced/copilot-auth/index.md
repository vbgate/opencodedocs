---
title: "配置 Copilot 认证: OAuth 和 PAT | opencode-mystatus"
sidebarTitle: "Copilot 认证"
subtitle: "配置 Copilot 认证: OAuth Token 和 Fine-grained PAT"
description: "学习配置 GitHub Copilot 的两种认证方法。通过 OAuth Token 和 Fine-grained PAT 解决权限问题，配置订阅类型，成功查询 Copilot 配额。"
tags:
  - "GitHub Copilot"
  - "OAuth Authentication"
  - "PAT Configuration"
  - "Permission Issues"
prerequisite:
  - "/vbgate/opencode-mystatus/start/quick-start"
  - "/vbgate/opencode-mystatus/platforms/copilot-usage"
order: 999
---

# Copilot Authentication Configuration: OAuth Token and Fine-grained PAT

## What You'll Learn

- Understand Copilot's two authentication methods: OAuth Token and Fine-grained PAT
- Solve OAuth Token permission issues
- Create a Fine-grained PAT and configure subscription types
- Successfully query Copilot Premium Requests quota

## Your Current Pain Point

When running `/mystatus` to query Copilot quota, you might see an error message like this:

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
3. 创建配置文件 ~/.config/opencode/copilot-quota-token.json:
   {"token": "github_pat_xxx...", "username": "你的用户名"}
```

You don't know:
- What is OAuth Token? What is Fine-grained PAT?
- Why doesn't the OAuth integration support accessing the quota API?
- How to create a Fine-grained PAT?
- How to choose subscription types (free, pro, pro+, etc.)?

These issues block you from viewing Copilot quota.

## When to Use This Approach

When you:
- See the message "OpenCode 的新 OAuth 集成不支持访问配额 API"
- Want to use the more stable Fine-grained PAT method to query quota
- Need to configure Copilot quota query for team or enterprise accounts

## Core Concept

mystatus supports **two Copilot authentication methods**:

| Authentication Method | Description | Advantages | Disadvantages |
|---------------------|-------------|------------|---------------|
| **OAuth Token** (default) | GitHub OAuth Token obtained when logging into OpenCode | No additional configuration, works out of the box | New OpenCode OAuth Token might lack Copilot permissions |
| **Fine-grained PAT** (recommended) | Fine-grained Personal Access Token manually created by user | Stable and reliable, doesn't depend on OAuth permissions | Needs one-time manual setup |

**Priority Rules**:
1. mystatus prioritizes using Fine-grained PAT (if configured)
2. Falls back to OAuth Token only if PAT is not configured

::: tip Recommended Approach
If your OAuth Token has permission issues, creating a Fine-grained PAT is the most stable solution.
:::

### Differences Between the Two Methods

**OAuth Token**:
- Storage location: `~/.local/share/opencode/auth.json`
- Obtaining method: Automatically acquired when logging into GitHub in OpenCode
- Permission issue: New OpenCode uses a different OAuth client and might not grant Copilot-related permissions

**Fine-grained PAT**:
- Storage location: `~/.config/opencode/copilot-quota-token.json`
- Obtaining method: Manually created in GitHub Developer Settings
- Permission requirement: Requires checking "Plan" (subscription information) read permission

## Follow Along

### Step 1: Check if Fine-grained PAT is Already Configured

Run the following command in the terminal to check if the configuration file exists:

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**You Should See**:
- If the file exists, Fine-grained PAT is already configured
- If the file doesn't exist or shows an error, you need to create one

### Step 2: Create Fine-grained PAT (if not configured)

If the file doesn't exist in Step 1, follow these steps to create one:

#### 2.1 Visit GitHub PAT Creation Page

Visit in your browser:
```
https://github.com/settings/tokens?type=beta
```

This is GitHub's Fine-grained PAT creation page.

#### 2.2 Create New Fine-grained PAT

Click **Generate new token (classic)** or **Generate new token (beta)**. Fine-grained (beta) is recommended.

**Configuration Parameters**:

| Field | Value |
|-------|-------|
| **Name** | `mystatus-copilot` (or any name you prefer) |
| **Expiration** | Select expiration time (e.g., 90 days or No expiration) |
| **Resource owner** | No need to select (default) |

**Permission Configuration** (Important!):

In the **Account permissions** section, check:
- ✅ **Plan** → Select **Read** (this permission is required for quota query)

::: warning Important Note
Only check the "Plan" Read permission. Don't check other unnecessary permissions to protect account security.
:::

**You Should See**:
- "Plan: Read" is checked
- No other permissions are checked (follow least privilege principle)

#### 2.3 Generate and Save Token

Click the **Generate token** button at the bottom of the page.

**You Should See**:
- Page displays the newly generated Token (like `github_pat_xxxxxxxxxxxx`)
- ⚠️ **Copy this Token immediately**—you won't see it again after page refresh

### Step 3: Get GitHub Username

Visit your GitHub homepage in your browser:
```
https://github.com/
```

**You Should See**:
- Your username displayed in the top-right or top-left corner (e.g., `john-doe`)

Record this username—you'll need it for configuration.

### Step 4: Determine Copilot Subscription Type

You need to know your Copilot subscription type because different types have different monthly quotas:

| Subscription Type | Monthly Quota | Use Case |
|------------------|---------------|----------|
| `free` | 50 | Copilot Free (free users) |
| `pro` | 300 | Copilot Pro (individual professional edition) |
| `pro+` | 1500 | Copilot Pro+ (individual enhanced edition) |
| `business` | 300 | Copilot Business (team business edition) |
| `enterprise` | 1000 | Copilot Enterprise (enterprise edition) |

::: tip How to determine subscription type?
1. Visit [GitHub Copilot subscription page](https://github.com/settings/copilot)
2. Check the currently displayed subscription plan
3. Select the corresponding type from the table above
:::

### Step 5: Create Configuration File

Create a configuration file and fill in the information based on your operating system.

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "your_PAT_token",
  "username": "your_GitHub_username",
  "tier": "subscription_type"
}
EOF
```

```powershell [Windows]
# Create directory (if it doesn't exist)
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# Create configuration file
@"
{
  "token": "your_PAT_token",
  "username": "your_GitHub_username",
  "tier": "subscription_type"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**Configuration Example**:

Assuming your PAT is `github_pat_abc123`, username is `johndoe`, and subscription type is `pro`:

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger Security Reminder
- Don't commit Token to Git repository or share it with others
- Token is your credential to access GitHub account—leaking it may cause security issues
:::

### Step 6: Verify Configuration

Run the `/mystatus` command in OpenCode.

**You Should See**:
- Copilot section displays quota information normally
- No more permission error messages
- Content similar to this:

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (@johndoe)

Premium requests
████████████████████░░░░░░░░ 70% (90/300)

Period: 2026-01
```

## Checkpoint ✅

Verify your understanding:

| Scenario | You Should See/Do |
|----------|-------------------|
| Configuration file exists | `ls ~/.config/opencode/copilot-quota-token.json` shows the file |
| PAT created successfully | Token starts with `github_pat_` |
| Subscription type correct | `tier` value in configuration is one of free/pro/pro+/business/enterprise |
| Verification successful | After running `/mystatus`, you see Copilot quota information |

## Common Pitfalls

### ❌ Mistake: Forgot to Check "Plan: Read" Permission

**Error Symptom**: See API error (403 or 401) when running `/mystatus`

**Cause**: Necessary permission wasn't checked when creating PAT.

**Correct Approach**:
1. Delete old Token (in GitHub Settings)
2. Recreate it, ensuring **Plan: Read** is checked
3. Update the `token` field in configuration file

### ❌ Mistake: Wrong Subscription Type

**Error Symptom**: Quota displays incorrectly (e.g., Free user shows 300 quota)

**Cause**: `tier` field was filled incorrectly (e.g., filled `pro` but actually `free`).

**Correct Approach**:
1. Visit GitHub Copilot settings page to confirm subscription type
2. Modify the `tier` field in configuration file

### ❌ Mistake: Token Expired

**Error Symptom**: See 401 error when running `/mystatus`

**Cause**: Fine-grained PAT has expiration time set and has expired.

**Correct Approach**:
1. Visit GitHub Settings → Tokens page
2. Find expired Token and delete it
3. Create new Token and update configuration file

### ❌ Mistake: Username Case Error

**Error Symptom**: See 404 or user not found error

**Cause**: GitHub usernames are case-sensitive (e.g., `Johndoe` and `johndoe` are different users).

**Correct Approach**:
1. Copy the username from GitHub homepage (exactly matching)
2. Don't type it manually to avoid case errors

::: tip Pro Tip
If you encounter a 404 error, copy your username directly from GitHub URL. For example, visit `https://github.com/YourName`, and `YourName` in the URL is your username.
:::

## Summary

mystatus supports two Copilot authentication methods:

1. **OAuth Token** (default): Automatically obtained but may have permission issues
2. **Fine-grained PAT** (recommended): Manually configured, stable and reliable

Recommended steps for configuring Fine-grained PAT:
1. Create Fine-grained PAT in GitHub Settings
2. Check "Plan: Read" permission
3. Record GitHub username and subscription type
4. Create `~/.config/opencode/copilot-quota-token.json` configuration file
5. Verify configuration is successful

After configuration, mystatus will prioritize using PAT to query Copilot quota, avoiding OAuth permission issues.

## Next Lesson Preview

> In the next lesson, we'll learn **[Multi-language Support: Automatic Chinese/English Switching](/vbgate/opencode-mystatus/advanced/i18n-setup/)**.
>
> You'll learn:
> - Language detection mechanisms (Intl API, environment variables)
> - How to manually switch languages
> - Chinese-English comparison table

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Numbers |
|----------|-----------|--------------|
| Copilot authentication strategy entry | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
| Read Fine-grained PAT configuration | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L122-L151) | 122-151 |
| Public Billing API call | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| OAuth Token exchange | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Internal API call (OAuth) | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| Format public Billing API output | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| CopilotAuthData type definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51) | 46-51 |
| CopilotQuotaConfig type definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73) | 66-73 |
| CopilotTier enum definition | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57) | 57 |
| Copilot subscription type quotas | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**Key Constants**:
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"`: Fine-grained PAT configuration file path
- `COPILOT_PLAN_LIMITS`: Monthly quota limits for each subscription type (lines 397-403)

**Key Functions**:
- `queryCopilotUsage(authData)`: Main function to query Copilot quota, contains two authentication strategies
- `readQuotaConfig()`: Read Fine-grained PAT configuration file
- `fetchPublicBillingUsage(config)`: Call GitHub public Billing API (using PAT)
- `fetchCopilotUsage(authData)`: Call GitHub internal API (using OAuth Token)
- `exchangeForCopilotToken(oauthToken)`: Exchange OAuth Token for Copilot Session Token
- `formatPublicBillingUsage(data, tier)`: Format public Billing API response
- `formatCopilotUsage(data)`: Format internal API response

**Authentication Flow Comparison**:

| Strategy | Token Type | API Endpoint | Priority |
|----------|-----------|--------------|----------|
| Fine-grained PAT | Fine-grained PAT | `/users/{username}/settings/billing/premium_request/usage` | 1 (highest) |
| OAuth Token (cached) | Copilot Session Token | `/copilot_internal/user` | 2 |
| OAuth Token (direct) | GitHub OAuth Token | `/copilot_internal/user` | 3 |
| OAuth Token (exchange) | Copilot Session Token (after exchange) | `/copilot_internal/v2/token` | 4 |

</details>
