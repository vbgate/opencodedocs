---
title: "平台集成: 多种协议接入 | Antigravity-Manager"
sidebarTitle: "接入你的 AI 平台"
subtitle: "平台集成: 多种协议接入"
description: "学习 Antigravity Tools 的平台协议接入方法。支持 OpenAI、Anthropic、Gemini 等 7 种协议的统一 API 网关转换。"
order: 200
---

# 平台与集成

Antigravity Tools 的核心能力是把多家 AI 平台的协议转换为统一的本地 API 网关。本章节详细介绍每种协议的接入方式、兼容边界和最佳实践。

## 本章包含

| 教程 | 说明 |
|--- | ---|
| [OpenAI 兼容 API](./openai/) | `/v1/chat/completions` 与 `/v1/responses` 的落地策略，让 OpenAI SDK 无感接入 |
| [Anthropic 兼容 API](./anthropic/) | `/v1/messages` 与 Claude Code 的关键契约，支撑思维链、系统提示词等核心能力 |
| [Gemini 原生 API](./gemini/) | `/v1beta/models` 以及 Google SDK 的端点接入，支持 `x-goog-api-key` 兼容 |
| [Imagen 3 图片生成](./imagen/) | OpenAI Images 参数 `size`/`quality` 的自动映射，支持任意宽高比 |
| [音频转录](./audio/) | `/v1/audio/transcriptions` 的限制与大包体处理 |
| [MCP 端点](./mcp/) | 把 Web Search/Reader/Vision 作为可调用工具暴露出去 |
| [Cloudflared 隧道](./cloudflared/) | 一键把本地 API 安全暴露到公网（并非默认安全） |

## 学习路径建议

::: tip 推荐顺序
1. **先学你要用的协议**：如果你用 Claude Code，先看 [Anthropic 兼容 API](./anthropic/)；如果用 OpenAI SDK，先看 [OpenAI 兼容 API](./openai/)
2. **再学 Gemini 原生**：了解 Google SDK 的直接接入方式
3. **按需学习扩展功能**：图片生成、音频转录、MCP 工具
4. **最后学隧道**：需要公网暴露时再看 [Cloudflared 隧道](./cloudflared/)
:::

**快速选择**：

| 你的场景 | 推荐先看 |
|--- | ---|
| 使用 Claude Code CLI | [Anthropic 兼容 API](./anthropic/) |
| 使用 OpenAI Python SDK | [OpenAI 兼容 API](./openai/) |
| 使用 Google 官方 SDK | [Gemini 原生 API](./gemini/) |
| 需要 AI 画图 | [Imagen 3 图片生成](./imagen/) |
| 需要语音转文字 | [音频转录](./audio/) |
| 需要联网搜索/网页阅读 | [MCP 端点](./mcp/) |
| 需要远程访问 | [Cloudflared 隧道](./cloudflared/) |

## 前置条件

::: warning 开始前请确认
- 已完成 [安装与升级](../start/installation/)
- 已完成 [添加账号](../start/add-account/)
- 已完成 [启动本地反代](../start/proxy-and-first-client/)（至少能访问 `/healthz`）
:::

## 下一步

学完本章节后，你可以继续学习：

- [进阶配置](../advanced/)：模型路由、配额治理、高可用调度等高级功能
- [常见问题](../faq/)：遇到 401/404/429 等错误时的排查指南
