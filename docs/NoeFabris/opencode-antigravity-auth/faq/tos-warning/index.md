---
title: "ToS Warning: Account Risks | opencode-antigravity-auth"
sidebarTitle: "ToS Warning"
subtitle: "ToS Warning: Account Risks"
description: "Learn the risks of using Antigravity Auth plugin. Understand Google's ToS restrictions, identify high-risk scenarios, and master best practices to avoid account bans and protect your Google account security."
tags:
  - "FAQ"
  - "risk-warning"
  - "account-security"
prerequisite:
  - "start-quick-install"
order: 5
---

# ToS Warning

By completing this lesson, you'll understand the potential risks of using the Antigravity Auth plugin and how to protect your Google account security.

## Your Current Challenge

You're considering using the Antigravity Auth plugin to access Google Antigravity's AI models, but you have some concerns:

- You've seen community reports of account bans or shadow bans
- You're worried that using unofficial tools violates Google's Terms of Service
- You're unsure whether to use a new account or an existing account
- You want to know how to minimize the risk

These concerns are reasonable. Using any unofficial tool carries some risk. This article will help you understand the specific risks and mitigation strategies.

## When to Use This Lesson

- **Before installing the plugin**: Understand the risks before deciding whether to use it
- **When choosing an account**: Decide which Google account to use for authentication
- **When encountering a ban**: Understand possible causes and preventive measures
- **When registering new users**: Avoid high-risk usage patterns

---

## Core Risk Overview

::: danger Important Warning

**Using this plugin may violate Google's Terms of Service.**

A small number of users have reported their Google accounts being banned or shadow banned (Shadow Ban—restricted access without explicit notification).

**By using this plugin, you accept the following statements:**
1. This is an unofficial tool, not endorsed or approved by Google
2. Your Google account may be suspended or permanently banned
3. You assume all risks and consequences of using this plugin

:::

### What Is Shadow Banning?

**Shadow Banning** is a restriction measure Google takes against suspicious accounts. Unlike direct bans, shadow banning doesn't display explicit error messages. Instead:
- API requests return 403 or 429 errors
- Quota appears available but actual calls fail
- Other accounts work normally, only the flagged account is affected

Shadow banning typically lasts for an extended period (days to weeks) and cannot be recovered through appeals.

---

## High-Risk Scenarios

The following scenarios significantly increase the risk of accounts being flagged or banned:

### 🚨 Scenario 1: Brand New Google Account

**Risk Level: Very High**

Using a newly registered Google account with this plugin carries a very high probability of being banned. Reasons:
- New accounts lack historical behavior data and are easily flagged by Google's abuse detection system
- Heavy API usage on new accounts is seen as abnormal behavior
- Google scrutinizes new accounts more strictly

**Recommendation**: Do not create a new account specifically for this plugin.

### 🚨 Scenario 2: New Account + Pro/Ultra Subscription

**Risk Level: Very High**

Newly registered accounts that immediately subscribe to Google's Pro or Ultra services are often flagged and banned. Reasons:
- High-usage patterns after subscription appear as abuse on new accounts
- Google scrutinizes new paid users more strictly
- This pattern differs too much from normal user growth paths

**Recommendation**: Let the account "naturally grow" for a period (at least several months) before considering subscription.

### 🟡 Scenario 3: High Volume Requests in a Short Time

**Risk Level: High**

Making a large number of API requests in a short time, or frequently using parallel proxies/multiple sessions, triggers rate limiting and abuse detection. Reasons:
- OpenCode's request pattern is more intensive than native applications (tool calls, retries, streaming, etc.)
- High concurrent requests trigger Google's protection mechanisms

**Recommendations**:
- Control request frequency and concurrency
- Avoid launching multiple parallel agents simultaneously
- Use multiple account rotation to distribute requests

### 🟡 Scenario 4: Using a Single Google Account

**Risk Level: Medium**

If you only have one Google account and rely on it for critical services (Gmail, Drive, etc.), the risk is higher. Reasons:
- Account ban affects your daily work
- Cannot recover through appeals
- Lack of backup plans

**Recommendation**: Use a separate account that doesn't depend on critical services.

---

## Best Practice Recommendations

### ✅ Recommended Practices

**1. Use Established Google Accounts**

Prioritize Google accounts that have been in use for some time (recommended 6 months or more):
- Have normal Google service usage history (Gmail, Drive, Google Search, etc.)
- No history of violations
- Account linked to a phone number and verified

**2. Configure Multiple Accounts**

Add multiple Google accounts and distribute requests through rotation:
- Configure at least 2-3 accounts
- Use `account_selection_strategy: "hybrid"` strategy (default)
- Automatically switch accounts when encountering rate limits

**3. Control Usage**

- Avoid intensive requests in short periods
- Reduce the number of parallel agents
- Set `max_rate_limit_wait_seconds: 0` in `antigravity.json` to fail fast instead of retrying

**4. Monitor Account Status**

Regularly check account status:
- View `rateLimitResetTimes` in `~/.config/opencode/antigravity-accounts.json`
- Enable debug logging: `OPENCODE_ANTIGRAVITY_DEBUG=1 opencode`
- Pause usage for 24-48 hours when encountering 403/429 errors

**5. "Warm Up" in the Official Interface First**

Effective method reported by community users:
1. Log in to [Antigravity IDE](https://idx.google.com/) in your browser
2. Run a few simple prompts (such as "Hello", "What is 2+2")
3. Use the plugin after 5-10 successful calls

**Principle**: Using the account through the official interface signals to Google that this is normal user behavior, reducing the risk of being flagged.

### ❌ Practices to Avoid

- ❌ Create a brand new Google account specifically for this plugin
- ❌ Subscribe to Pro/Ultra immediately on newly registered accounts
- ❌ Use your only critical service account (such as work email)
- ❌ Repeatedly retry after triggering 429 limits
- ❌ Launch a large number of parallel agents simultaneously
- ❌ Commit `antigravity-accounts.json` to version control

---

## Frequently Asked Questions

### Q: My account has been banned. Can I appeal?

**A: No.**

If a ban or shadow ban is triggered by Google's abuse detection through this plugin, it typically cannot be recovered through appeals. Reasons:
- Bans are automatically triggered based on API usage patterns
- Google takes a strict stance on the use of unofficial tools
- Appeals require explaining the tool's purpose, but this plugin itself may be considered a violation

**Recommendations**:
- Use other unaffected accounts
- If all accounts are banned, use [Antigravity IDE](https://idx.google.com/) directly
- Avoid continuing to try on banned accounts

### Q: Will using this plugin definitely result in a ban?

**A: Not necessarily.**

Most users use this plugin without issues. Risk depends on:
- Account age and historical behavior
- Usage frequency and request patterns
- Whether best practices are followed

**Risk Assessment**:
- Old account + moderate usage + multi-account rotation → Low risk
- New account + intensive requests + single account → High risk

### Q: What's the difference between shadow banning and rate limiting?

**A: Fundamentally different, with different recovery methods.**

| Feature | Shadow Ban | Rate Limiting (429) |
|--- | --- | ---|
| Trigger Cause | Abuse detection, flagged as suspicious | Request frequency exceeds quota |
| Error Code | 403 or silent failure | 429 Too Many Requests |
| Duration | Days to weeks | Hours to a day |
| Recovery Method | Cannot recover, need to use other accounts | Wait for reset or switch accounts |
| Preventable | Follow best practices to reduce risk | Control request frequency |

### Q: Can I use an enterprise Google account?

**A: Not recommended.**

Enterprise accounts are typically tied to critical services and data, making bans more severe. Additionally:
- Enterprise accounts are scrutinized more strictly
- May violate the organization's IT policies
- Risk is borne personally but affects the team

**Recommendation**: Use personal accounts.

### Q: Can multiple accounts completely avoid bans?

**A: Cannot completely avoid, but can reduce impact.**

The role of multiple accounts:
- Distribute requests, reducing the probability of single accounts triggering limits
- When one account is banned, other accounts remain available
- Automatically switch when encountering limits, improving availability

**But multiple accounts are not a "silver bullet"**:
- If all accounts trigger abuse detection, they may all be banned
- Don't abuse multiple accounts for intensive requests
- Each account still needs to follow best practices

---

## Checkpoint ✅

After reading this lesson, you should know:
- [ ] Using this plugin may violate Google ToS, use at your own risk
- [ ] New account + Pro/Ultra subscription is a high-risk scenario
- [ ] Using established Google accounts is recommended
- [ ] Configuring multiple accounts can distribute risk
- [ ] Accounts cannot be recovered through appeals after being banned
- [ ] Controlling request frequency and usage is important

---

## Lesson Summary

This lesson introduced the potential risks of using the Antigravity Auth plugin:

1. **Core Risk**: May violate Google ToS, accounts may be banned or shadow banned
2. **High-Risk Scenarios**: New accounts, new account + subscription, intensive requests, single critical account
3. **Best Practices**: Use established accounts, configure multiple accounts, control usage, monitor status, "warm up" first
4. **FAQ**: Cannot appeal, risk varies by individual, multiple accounts can reduce impact

Before using this plugin, carefully evaluate the risk. If you cannot accept the potential consequences of account bans, we recommend using [Antigravity IDE](https://idx.google.com/) directly.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

This lesson content is based on the risk warning section of the project README documentation (README.md:23-40), and does not involve specific code implementation.

| Feature | File Path | Lines |
|--- | --- | ---|
| ToS Warning Statement | [`README.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L23-L40) | 23-40   |

</details>
