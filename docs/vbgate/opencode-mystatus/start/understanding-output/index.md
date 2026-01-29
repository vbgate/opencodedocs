---
title: "Understanding Output: Format Guide | opencode-mystatus"
sidebarTitle: "Understanding Output"
subtitle: "Understanding Output: Format Guide"
description: "Learn to interpret opencode-mystatus output format. Understand progress bars, reset times, and multi-account display for OpenAI, Zhipu AI, Copilot, and Google Cloud."
tags:
  - "output-format"
  - "progress-bar"
  - "reset-time"
  - "multi-account"
prerequisite:
  - "start-quick-start"
order: 999
---

# Understanding Output: Progress Bars, Reset Times, and Multi-Account

## What You'll Learn

- Understand every piece of information in mystatus output
- Understand progress bar meanings (filled vs hollow)
- Know different platforms' quota cycles (3 hours, 5 hours, monthly)
- Identify quota differences across multiple accounts

## Your Current Challenge

You ran `/mystatus` and saw progress bars, percentages, and countdowns, but couldn't figure out:

- Are full progress bars good or bad?
- What does "Resets in: 2h 30m" mean?
- Why do some platforms show two progress bars while others show only one?
- Why does Google Cloud have multiple accounts?

This lesson breaks down each piece of information for you.

## Core Concept

mystatus output has a consistent format, but varies across platforms:

**Common Elements**:
- Progress bars: `█` (filled) indicates remaining, `░` (hollow) indicates used
- Percentage: calculated as remaining percentage based on usage
- Reset time: countdown to next quota refresh

**Platform Differences**:
| Platform | Quota Cycle | Features |
|--- | --- | ---|
| OpenAI | 3 hours / 24 hours | May show two windows |
| Zhipu AI / Z.ai | 5-hour Token / MCP monthly quota | Two different quota types |
| GitHub Copilot | Monthly | Shows exact values (229/300) |
| Google Cloud | Per-model | Each account shows 4 models |

## Output Structure Breakdown

### Complete Output Example

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
████████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### Understanding Each Section

#### 1. Account Information Line

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**: Shows email + subscription type
- **Zhipu AI / Z.ai**: Shows masked API Key + account type (Coding Plan)
- **Google Cloud**: Shows email, multiple accounts separated by `###`

#### 2. Progress Bar

```
████████████████████████████ 85% remaining
```

- `█` (filled block): **remaining** quota
- `░` (hollow block): **used** quota
- **Percentage**: remaining percentage (higher is better)

::: tip Quick Memory Rule
The more filled blocks, the more remaining → use freely
The more hollow blocks, the more used → be conservative
:::

#### 3. Reset Time Countdown

```
Resets in: 2h 30m
```

Shows how long until the next quota refresh.

**Reset Cycles**:
- **OpenAI**: 3-hour window / 24-hour window
- **Zhipu AI / Z.ai**: 5-hour Token limit / MCP monthly quota
- **GitHub Copilot**: Monthly (shows specific date)
- **Google Cloud**: Each model has its own reset time

#### 4. Value Details (Some Platforms)

Zhipu AI and Copilot show specific values:

```
Used: 0.5M / 10.0M              # Zhipu AI: used / total (unit: million tokens)
Premium        24% (229/300)     # Copilot: remaining percentage (used / total quota)
```

## Platform-Specific Details

### OpenAI: Dual-Window Quota

OpenAI may show two progress bars:

```
3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit**: 3-hour rolling window, suitable for high-frequency usage
- **24-hour limit**: 24-hour rolling window, suitable for long-term planning

**Team Accounts**:
- Has primary and secondary window limits
- Different team members share the same Team quota

**Individual Accounts (Plus)**:
- Usually only shows the 3-hour window

### Zhipu AI / Z.ai: Two Quota Types

```
5-hour token limit
████████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
████████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**: Token usage limit within 5 hours
- **MCP limit**: Model Context Protocol monthly quota, used for search features

::: warning
MCP quota is monthly with a long reset time. If shown as full, you must wait until next month to recover.
:::

### GitHub Copilot: Monthly Quota

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**: Copilot premium feature usage
- Shows specific values (used / total quota)
- Monthly reset, shows specific date

**Subscription Type Differences**:
| Subscription Type | Monthly Quota | Description |
|--- | --- | ---|
| Free | N/A | No quota limit, but limited features |
| Pro | 300 | Standard personal version |
| Pro+ | Higher | Upgraded version |
| Business | Higher | Business version |
| Enterprise | Unlimited | Enterprise version |

### Google Cloud: Multi-Account + Multi-Model

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
```

**Format**: `Model Name | Reset Time | Progress Bar + Percentage`

**4 Models Explanation**:
| Model Name | Corresponding API Key | Purpose |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | Advanced reasoning |
| G3 Image | `gemini-3-pro-image` | Image generation |
| G3 Flash | `gemini-3-flash` | Fast generation |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude models |

**Multi-Account Display**:
- Each Google account separated by `###`
- Each account shows its own 4 model quotas
- Can compare quota usage across different accounts

## Pitfalls to Avoid

### Common Misconceptions

| Misconception | Fact |
|--- | ---|
| All filled progress bars = never used | More filled blocks = **more remaining**, use freely |
| Short reset time = quota almost gone | Short reset time = about to reset, can continue using |
| 100% percentage = all used | 100% percentage = **all remaining** |
| Zhipu AI only shows one quota | Actually has both TOKENS_LIMIT and TIME_LIMIT |

### What to Do When Quota Is Full?

If the progress bars are all hollow (0% remaining):

1. **Short-term quotas** (e.g., 3 hours, 5 hours): wait for reset countdown to complete
2. **Monthly quotas** (e.g., Copilot, MCP): wait until the beginning of next month
3. **Multiple accounts**: switch to another account (Google Cloud supports multiple accounts)

::: info
mystatus is a **read-only tool** that does not consume your quota or trigger any API calls.
:::

## Summary

- **Progress bar**: Filled `█` = remaining, hollow `░` = used
- **Reset time**: countdown to next quota refresh
- **Platform differences**: Different platforms have different quota cycles (3h/5h/monthly)
- **Multiple accounts**: Google Cloud shows multiple accounts for easy quota management

## Coming Up Next

> Next, we'll learn **[OpenAI Quota Query](../../platforms/openai-usage/)**.
>
> You'll learn:
> - The difference between OpenAI's 3-hour and 24-hour limits
> - Team account quota sharing mechanism
> - How to parse JWT tokens to get account information

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Number |
|--- | --- | ---|
| Progress bar generation | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53) | 40-53 |
| Time formatting | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29) | 18-29 |
| Remaining percentage calculation | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65) | 63-65 |
| Token count formatting | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72) | 70-72 |
| OpenAI output formatting | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| Zhipu AI output formatting | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177) | 115-177 |
| Copilot output formatting | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Google Cloud output formatting | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |

**Key Functions**:
- `createProgressBar(percent, width)`: Generates progress bar, filled blocks indicate remaining
- `formatDuration(seconds)`: Converts seconds to human-readable time format (e.g., "2h 30m")
- `calcRemainPercent(usedPercent)`: Calculates remaining percentage (100 - used percentage)
- `formatTokens(tokens)`: Formats token count to millions (e.g., "0.5M")

**Key Constants**:
- Default progress bar width: 30 characters (Google Cloud models use 20 characters)
- Progress bar characters: `█` (filled), `░` (hollow)

</details>
