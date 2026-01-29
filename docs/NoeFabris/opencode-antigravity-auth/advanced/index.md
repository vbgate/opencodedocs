---
title: "Advanced: Multi-Account & Rate Limits | opencode-antigravity-auth"
sidebarTitle: "Advanced"
subtitle: "Advanced Features"
description: "Master advanced features including multi-account load balancing, intelligent account selection, rate limit handling, and session recovery mechanisms for optimal performance."
order: 3
---

# Advanced Features

This section helps you deeply master the advanced features of the Antigravity Auth plugin, including multi-account load balancing, intelligent account selection, rate limit handling, session recovery, request transformation, and other core mechanisms. Whether optimizing quota utilization or troubleshooting complex issues, you'll find the answers you need here.

## Prerequisites

::: warning Before You Begin
- ✅ Completed [Quick Installation](../start/quick-install/) and successfully added the first account
- ✅ Completed [First Authentication](../start/first-auth-login/) and understand the OAuth flow
- ✅ Completed [First Request](../start/first-request/) and verified the plugin is working correctly
:::

## Learning Path

### 1. [Multi-Account Setup](./multi-account-setup/)

Configure multiple Google accounts to implement quota pooling and load balancing.

- Add multiple accounts to increase overall quota limits
- Understand the dual quota system (Antigravity + Gemini CLI)
- Choose the appropriate number of accounts based on your scenario

### 2. [Account Selection Strategies](./account-selection-strategies/)

Master best practices for sticky, round-robin, and hybrid account selection strategies.

- 1 account → sticky strategy preserves prompt cache
- 2-3 accounts → hybrid strategy intelligently distributes requests
- 4+ accounts → round-robin strategy maximizes throughput

### 3. [Rate Limit Handling](./rate-limit-handling/)

Understand rate limit detection, automatic retry, and account switching mechanisms.

- Distinguish between 5 different types of 429 errors
- Understand the exponential backoff algorithm for automatic retries
- Master automatic switching logic in multi-account scenarios

### 4. [Session Recovery](./session-recovery/)

Learn about session recovery mechanisms to automatically handle tool call failures and interruptions.

- Automatically handle tool_result_missing errors
- Fix thinking_block_order issues
- Configure auto_resume and session_recovery options

### 5. [Request Transformation Mechanism](./request-transformation/)

Gain a deep understanding of request transformation mechanisms and how to handle protocol differences between different AI models.

- Understand protocol differences between Claude and Gemini models
- Troubleshoot 400 errors caused by Schema incompatibilities
- Optimize Thinking configuration for best performance

### 6. [Configuration Guide](./configuration-guide/)

Master all configuration options to customize plugin behavior as needed.

- Configuration file locations and priorities
- Model behavior, account rotation, and application behavior settings
- Recommended configurations for single-account/multi-account/parallel agent scenarios

### 7. [Parallel Agents Optimization](./parallel-agents/)

Optimize account allocation for parallel agent scenarios by enabling PID offset.

- Understand account conflicts in parallel agent scenarios
- Enable PID offset so different processes prioritize different accounts
- Coordinate with round-robin strategy to maximize multi-account utilization

### 8. [Debug Logging](./debug-logging/)

Enable debug logging to troubleshoot issues and monitor runtime status.

- Enable debug logging to record detailed information
- Understand different log levels and applicable scenarios
- Interpret log content to quickly locate problems

## Next Steps

After completing advanced features learning, you can:

- 📖 Check [Frequently Asked Questions](../faq/) to resolve issues encountered during usage
- 📚 Read [Appendix](../appendix/) to understand architecture design and complete configuration reference
- 🔄 Follow [Changelog](../changelog/) to get the latest features and changes
