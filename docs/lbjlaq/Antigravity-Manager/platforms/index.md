---
title: "平台与集成: 多协议统一网关 | Antigravity Manager"
sidebarTitle: "Platforms"
subtitle: "平台与集成: 多协议统一网关"
description: "学习 Antigravity Manager 的多平台集成方法。支持 OpenAI、Anthropic、Gemini 等协议，统一本地 API 网关访问。"
order: 2
---

# Platforms & Integrations

Antigravity Tools' core capability is converting protocols from multiple AI platforms into a unified local API gateway. This chapter details the integration methods, compatibility boundaries, and best practices for each protocol.

## In This Chapter

| Tutorial | Description |
|--- | ---|
| [OpenAI Compatible API](./openai/) | Implementation strategy for `/v1/chat/completions` and `/v1/responses`, enabling seamless OpenAI SDK integration |
| [Anthropic Compatible API](./anthropic/) | Key contracts for `/v1/messages` and Claude Code, supporting core features like chain-of-thought and system prompts |
| [Gemini Native API](./gemini/) | `/v1beta/models` and Google SDK endpoint integration, supporting `x-goog-api-key` compatibility |
| [Imagen 3 Image Generation](./imagen/) | Automatic mapping of OpenAI Images parameters `size`/`quality`, supporting arbitrary aspect ratios |
| [Audio Transcription](./audio/) | Limitations of `/v1/audio/transcriptions` and handling large payloads |
| [MCP Endpoints](./mcp/) | Expose Web Search/Reader/Vision as callable tools |
| [Cloudflared Tunnel](./cloudflared/) | One-click secure exposure of local API to public internet (not secure by default) |

## Recommended Learning Path

::: tip Recommended Order
1. **Learn the protocol you use first**: If you use Claude Code, start with [Anthropic Compatible API](./anthropic/); if you use OpenAI SDK, start with [OpenAI Compatible API](./openai/)
2. **Then learn Gemini Native**: Understand direct Google SDK integration
3. **Learn extended features as needed**: Image generation, audio transcription, MCP tools
4. **Finally learn tunneling**: Only look at [Cloudflared Tunnel](./cloudflared/) when you need public exposure
:::

**Quick Selection**:

| Your Scenario | Start With |
|--- | ---|
| Using Claude Code CLI | [Anthropic Compatible API](./anthropic/) |
| Using OpenAI Python SDK | [OpenAI Compatible API](./openai/) |
| Using Google Official SDK | [Gemini Native API](./gemini/) |
| Need AI Image Generation | [Imagen 3 Image Generation](./imagen/) |
| Need Speech-to-Text | [Audio Transcription](./audio/) |
| Need Web Search/Reading | [MCP Endpoints](./mcp/) |
| Need Remote Access | [Cloudflared Tunnel](./cloudflared/) |

## Prerequisites

::: warning Before Starting
- Completed [Installation & Upgrades](../start/installation/)
- Completed [Add Accounts](../start/add-account/)
- Completed [Start Local Reverse Proxy](../start/proxy-and-first-client/) (at least able to access `/healthz`)
:::

## Next Steps

After completing this chapter, you can continue learning:

- [Advanced Configuration](../advanced/): Model routing, quota management, high-availability scheduling, and other advanced features
- [FAQ](../faq/): Troubleshooting guide for 401/404/429 and other errors
