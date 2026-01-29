---
title: "Platform Features: Models & Quota | opencode-antigravity-auth"
sidebarTitle: "Platform Features"
subtitle: "Platform Features: Models & Quota"
description: "Learn about Antigravity Auth's platform features including available models, dual quota system, Google Search grounding, and Thinking models configuration."
order: 2
---

# Platform Features

This section helps you gain a deep understanding of the models, quota system, and platform features supported by the Antigravity Auth plugin. You'll learn how to select the right model, configure Thinking capabilities, enable Google Search, and maximize quota utilization.

## Prerequisites

::: warning Before You Begin
Before proceeding with this section, ensure you have completed:
- [Quick Installation](../start/quick-install/): Complete plugin installation and initial authentication
- [First Request](../start/first-request/): Successfully send your first model request
:::

## Learning Path

Follow this sequence to progressively master platform features:

### 1. [Available Models](./available-models/)

Learn about all available models and their variant configurations.

- Get to know Claude Opus 4.5, Sonnet 4.5, and Gemini 3 Pro/Flash
- Understand the model distribution across Antigravity and Gemini CLI quota pools
- Master the use of the `--variant` parameter

### 2. [Dual Quota System](./dual-quota-system/)

Understand how the Antigravity and Gemini CLI dual quota pools work.

- Learn how each account has two independent Gemini quota pools
- Enable automatic fallback configuration to double your quota
- Explicitly specify models to use specific quota pools

### 3. [Google Search Grounding](./google-search-grounding/)

Enable Google Search for Gemini models to improve factual accuracy.

- Allow Gemini to search real-time web information
- Adjust search thresholds to control search frequency
- Choose appropriate configurations based on task requirements

### 4. [Thinking Models](./thinking-models/)

Master the configuration and usage of Claude and Gemini 3 Thinking models.

- Configure Claude's thinking budget
- Use Gemini 3's thinking level (minimal/low/medium/high)
- Understand interleaved thinking and thinking block retention strategies

## Next Steps

After completing this section, you can continue learning:

- [Multi-Account Setup](../advanced/multi-account-setup/): Configure multiple Google accounts to implement quota pooling and load balancing
- [Account Selection Strategies](../advanced/account-selection-strategies/): Master best practices for sticky, round-robin, and hybrid strategies
- [Configuration Guide](../advanced/configuration-guide/): Master all configuration options and customize plugin behavior as needed
