---
title: "Multi-Channel and Platform Integration"
sidebarTitle: "Platforms and Channels"
subtitle: "Multi-Channel and Platform Integration"
description: "Learn how to configure and use Clawdbot's multi-channel system, including WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE, WebChat, macOS, iOS, and Android platforms."
tags:
  - "channels"
  - "platforms"
  - "integration"
order: 60
---

# Multi-Channel and Platform Integration

Clawdbot supports multiple communication channels and platforms through a unified Gateway control plane, enabling you to interact with your AI assistant on the interface you're familiar with.

## Chapter Overview

This chapter introduces all communication channels and platforms supported by Clawdbot, including instant messaging apps (WhatsApp, Telegram, Slack, Discord, etc.), mobile nodes (iOS, Android), and desktop applications (macOS). Learn how to configure these channels to seamlessly integrate your AI assistant into your daily workflow.

## Subpage Navigation

### Channel Overview

- **[Multi-Channel System Overview](channels-overview/)** - Learn about all communication channels supported by Clawdbot and their features, and master the basic concepts of channel configuration.

### Instant Messaging Channels

- **[WhatsApp](whatsapp/)** - Configure and use the WhatsApp channel (based on Baileys), supporting device linking and group management.
- **[Telegram](telegram/)** - Configure and use the Telegram channel (based on grammY Bot API), setting up Bot Token and Webhook.
- **[Slack](slack/)** - Configure and use the Slack channel (based on Bolt), integrating into your workspace.
- **[Discord](discord/)** - Configure and use the Discord channel (based on discord.js), supporting servers and channels.
- **[Google Chat](googlechat/)** - Configure and use the Google Chat channel, integrating with Google Workspace.
- **[Signal](signal/)** - Configure and use the Signal channel (based on signal-cli), for privacy-protected communication.
- **[iMessage](imessage/)** - Configure and use the iMessage channel (macOS exclusive), integrating with the macOS Messages app.
- **[LINE](line/)** - Configure and use the LINE channel (Messaging API), interacting with LINE users.

### Web and Native Apps

- **[WebChat Interface](webchat/)** - Use the built-in WebChat interface to interact with your AI assistant without configuring external channels.
- **[macOS Application](macos-app/)** - Learn about the macOS menu bar app features, including Voice Wake, Talk Mode, and remote control.
- **[iOS Node](ios-node/)** - Configure the iOS node to perform device-local operations (Camera, Canvas, Voice Wake).
- **[Android Node](android-node/)** - Configure the Android node to perform device-local operations (Camera, Canvas).

## Recommended Learning Path

Based on your use case, we recommend the following learning order:

### Quick Start for Beginners

If you're using Clawdbot for the first time, we recommend learning in the following order:

1. **[Multi-Channel System Overview](channels-overview/)** - First, understand the overall architecture and channel concepts
2. **[WebChat Interface](webchat/)** - The simplest way, no configuration required to get started
3. **Choose a Common Channel** - Select based on your daily habits:
   - Daily chat → [WhatsApp](whatsapp/) or [Telegram](telegram/)
   - Team collaboration → [Slack](slack/) or [Discord](discord/)
   - macOS users → [iMessage](imessage/)

### Mobile Integration

If you want to use Clawdbot on your phone:

1. **[iOS Node](ios-node/)** - Configure local functionality on iPhone/iPad
2. **[Android Node](android-node/)** - Configure local functionality on Android devices
3. **[macOS Application](macos-app/)** - Use the macOS app as a control center

### Enterprise Deployment

If you need to deploy in a team environment:

1. **[Slack](slack/)** - Integrate with team workspaces
2. **[Discord](discord/)** - Set up community servers
3. **[Google Chat](googlechat/)** - Integrate with Google Workspace

## Prerequisites

Before starting this chapter, we recommend completing:

- **[Quick Start](../start/getting-started/)** - Complete Clawdbot installation and basic configuration
- **[Onboarding Wizard](../start/onboarding-wizard/)** - Complete basic Gateway and channel setup through the wizard

::: tip Tip
If you've already completed the onboarding wizard, some channels may already be configured automatically. You can skip duplicate configuration steps and directly explore advanced features for specific channels.
:::

## Next Steps

After completing this chapter, you can continue exploring:

- **[AI Model and Authentication Configuration](../advanced/models-auth/)** - Configure different AI model providers
- **[Session Management and Multi-Agent](../advanced/session-management/)** - Learn about session isolation and sub-agent collaboration
- **[Tool System](../advanced/tools-browser/)** - Use browser automation, command execution, and other tools

## Frequently Asked Questions

::: details Can I use multiple channels simultaneously?
Yes! Clawdbot supports enabling multiple channels at the same time. You can receive and send messages across different channels, all processed through the unified Gateway.
:::

::: details Which channel is most recommended?
It depends on your use case:
- **WebChat** - Simplest, no configuration required
- **WhatsApp** - Suitable for chatting with friends and family
- **Telegram** - Stable Bot API, suitable for automated replies
- **Slack/Discord** - Suitable for team collaboration
:::

::: details Does configuring channels require payment?
Most channels themselves are free, but some channels may have costs:
- WhatsApp Business API - May incur fees
- Google Chat - Requires a Google Workspace account
- Other channels - Usually free, just need to apply for a Bot Token
:::
