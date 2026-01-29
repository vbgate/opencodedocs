---
title: "I18n: Language Detection | opencode-mystatus"
sidebarTitle: "I18n"
subtitle: "I18n: Language Detection"
description: "Learn how opencode-mystatus automatically detects system language and switches between Chinese and English output using Intl API and environment variables."
tags:
  - "i18n"
  - "internationalization"
  - "language-detection"
  - "multi-language"
prerequisite:
  - "/vbgate/opencode-mystatus/start/quick-start"
order: 999
---

# Internationalization Support: Automatic Chinese/English Switching

## What You'll Learn

- Understand how mystatus automatically detects system language
- Know how to switch system language to change output language
- Understand language detection priority and fallback mechanisms
- Master how Intl API and environment variables work

## Your Current Pain Point

You may have noticed that mystatus's **internationalization support** sometimes displays in Chinese, sometimes in English:

```
# Chinese output
3小时限额
███████████████████████████ 剩余 85%
重置: 2小时30分钟后

# English output
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m
```

But you don't know:
- How does the plugin know which language to use?
- Can I manually switch to Chinese or English?
- What if detection is wrong?

This lesson helps you understand the language detection mechanism.

## Core Concept

**Internationalization support** automatically selects Chinese or English output based on your system language environment, requiring no manual configuration. Detection priority is: Intl API → Environment Variables → Default English.

**Detection Priority** (highest to lowest):

1. **Intl API** (recommended) → `Intl.DateTimeFormat().resolvedOptions().locale`
2. **Environment Variables** (fallback) → `LANG`, `LC_ALL`, `LANGUAGE`
3. **Default English** (fallback) → `"en"`

::: tip Why no manual configuration needed?
Because language detection is based on the system environment. The plugin automatically identifies it on startup—users don't need to modify any configuration files.
:::

**Supported Languages**:
| Language | Code | Detection Condition |
|--- | --- | ---|
| Chinese | `zh` | locale starts with `zh` (e.g., `zh-CN`, `zh-TW`) |
| English | `en` | Other cases |

**Translated Content Coverage**:
- Time units (days, hours, minutes)
- Quota-related (remaining percentage, reset time)
- Error messages (authentication failure, API error, timeout)
- Platform titles (OpenAI, Zhipu AI, Z.ai, Google Cloud, GitHub Copilot)

## Follow Along

### Step 1: Check Current System Language

First, confirm your system language settings:

::: code-group

```bash [macOS/Linux]
echo $LANG
```

```powershell [Windows]
Get-ChildItem Env:LANG
```

:::

**You Should See**:

- Chinese system: `zh_CN.UTF-8`, `zh_TW.UTF-8`, or similar
- English system: `en_US.UTF-8`, `en_GB.UTF-8`, or similar

### Step 2: Test Language Detection

Run the `/mystatus` command and observe the output language:

```
/mystatus
```

**You Should See**:

- If system language is Chinese → Output in Chinese (e.g., `3小时限额`, `重置: 2小时30分钟后`)
- If system language is English → Output in English (e.g., `3-hour limit`, `Resets in: 2h 30m`)

### Step 3: Temporarily Switch System Language (for testing)

If you want to test different language outputs, you can temporarily modify environment variables:

::: code-group

```bash [macOS/Linux (temporarily switch to English)]
LANG=en_US.UTF-8 /mystatus
```

```powershell [Windows (temporarily switch to English)]
$env:LANG="en_US.UTF-8"; /mystatus
```

:::

**You Should See**:

Even if your system is Chinese, the output will switch to English format.

::: warning
This is only for temporary testing and won't permanently change your system language. Original settings are restored after closing the terminal.
:::

### Step 4: Understand Intl API Detection Mechanism

Intl API is the internationalization standard interface provided by browsers and Node.js. The plugin prioritizes using it for language detection:

**Detection Code** (simplified):

```javascript
// 1. Priority: use Intl API
const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
if (intlLocale.startsWith("zh")) {
  return "zh";  // Chinese
}

// 2. Fallback to environment variables
const lang = process.env.LANG || process.env.LC_ALL || "";
if (lang.startsWith("zh")) {
  return "zh";
}

// 3. Default English
return "en";
```

**Advantages of Intl API**:
- More reliable, based on actual system settings
- Supports both browser and Node.js environments
- Provides complete locale information (e.g., `zh-CN`, `en-US`)

**Environment Variables as Fallback**:
- Compatible with environments that don't support Intl API
- Provides manual language control (by modifying environment variables)

### Step 5: Permanently Switch System Language (if needed)

If you want mystatus to always use a specific language, you can modify system language settings:

::: info
Modifying system language affects all applications, not just mystatus.
:::

**macOS**:
1. Open "System Settings" → "General" → "Language & Region"
2. Add the desired language and drag it to the top
3. Restart OpenCode

**Linux**:
```bash
# Modify ~/.bashrc or ~/.zshrc
export LANG=zh_CN.UTF-8

# Reload configuration
source ~/.bashrc
```

**Windows**:
1. Open "Settings" → "Time & Language" → "Language & Region"
2. Add the desired language and set it as default
3. Restart OpenCode

## Checkpoint ✅

Verify language detection is working correctly:

| Test Item | Action | Expected Result |
|--- | --- | ---|
| Chinese system | Run `/mystatus` | Output in Chinese (e.g., `3小时限额`) |
| English system | Run `/mystatus` | Output in English (e.g., `3-hour limit`) |
| Temporary switch | Run command after modifying `LANG` env var | Output language changes accordingly |

## Common Pitfalls

### Common Issues

| Issue | Cause | Solution |
|--- | --- | ---|
| Output language doesn't match expectations | System language setting incorrect | Check `LANG` environment variable or system language settings |
| Intl API unavailable | Node.js version too low or environment doesn't support it | Plugin automatically falls back to environment variable detection |
| Chinese system showing English | Environment variable `LANG` not set to `zh_*` | Set correct `LANG` value (e.g., `zh_CN.UTF-8`) |

### Detection Logic Explanation

**When to use Intl API**:
- Node.js ≥ 0.12 (supports Intl API)
- Browser environment (all modern browsers)

**When to fall back to environment variables**:
- Intl API throws an exception
- Environment doesn't support Intl API

**When to use default English**:
- Environment variables not set
- Environment variables don't start with `zh`

::: tip
The plugin detects language **only once** when the module loads. After modifying system language, you need to restart OpenCode for changes to take effect.
:::

## Summary

- **Automatic Detection**: mystatus automatically detects system language, no manual configuration required
- **Detection Priority**: Intl API → Environment Variables → Default English
- **Supported Languages**: Chinese (zh) and English (en)
- **Translation Coverage**: Time units, quota-related, error messages, platform titles
- **Switch Language**: Modify system language settings, restart OpenCode

## Next Lesson Preview

> In the next lesson, we'll learn **[Common Issues: Unable to Query Quota, Token Expired, Permission Problems](/vbgate/opencode-mystatus/faq/troubleshooting/)**.
>
> You'll learn:
> - How to troubleshoot authentication file reading issues
> - Solutions when tokens expire
> - Configuration recommendations for insufficient permissions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Line Numbers |
|--- | --- | ---|
| Language detection function | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |
| Chinese translation definitions | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L46-L124) | 46-124 |
| English translation definitions | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L125-L203) | 125-203 |
| Current language export | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L210) | 210 |
| Translation function export | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L213) | 213 |

**Key Functions**:
- `detectLanguage()`: Detects user system language, prioritizes Intl API, falls back to environment variables, defaults to English
- `currentLang`: Current language (detected once at module load)
- `t`: Translation function that returns corresponding translation content based on current language

**Key Constants**:
- `translations`: Translation dictionary containing `zh` and `en` language packs
- Supported translation types: Time units (days, hours, minutes), quota-related (hourLimit, dayLimit, remaining, resetIn), error messages (authError, apiError, timeoutError), platform titles (openaiTitle, zhipuTitle, googleTitle, copilotTitle)

**Detection Logic**:
1. Prioritize using `Intl.DateTimeFormat().resolvedOptions().locale` for language detection
2. If Intl API unavailable, fall back to environment variables `LANG`, `LC_ALL`, `LANGUAGE`
3. If environment variables also don't exist or don't start with `zh`, default to English

</details>
