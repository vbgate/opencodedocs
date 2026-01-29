---
title: "平台与集成: 多模型 AI 配置 | oh-my-opencode"
sidebarTitle: "连接你的 AI 账号"
subtitle: "平台与集成: 多模型 AI 配置"
description: "学习配置和管理多个 AI 平台（Anthropic、OpenAI、Google、Copilot），掌握自动降级机制和智能模型选择。"
order: 40
---

# 平台与集成

本章节介绍如何配置和管理多个 AI Provider（Anthropic、OpenAI、Google、GitHub Copilot 等），以及 oh-my-opencode 的多模型自动降级机制。

通过学习本章节，你将掌握如何让系统根据任务类型和可用模型，智能选择最合适的 AI 模型，构建高效、可靠的多模型编排工作流。

## 本章节包含

本章节分为两部分：

### 1. [Provider 配置](provider-setup/)

学习如何配置多种 AI Provider，包括：
- Anthropic Claude（主编排器首选）
- OpenAI ChatGPT（架构审查专用）
- Google Gemini（前端和媒体分析）
- GitHub Copilot（备用 Provider）
- Z.ai Coding Plan 和 OpenCode Zen（可选服务）

**学完你能做什么**：
- ✅ 配置 6 种主流 AI Provider
- ✅ 使用交互式安装器快速设置
- ✅ 为不同代理指定最适合的模型
- ✅ 使用 `doctor` 命令诊断配置问题

**预计时间**：25-30 分钟

### 2. [多模型策略](model-resolution/)

深入理解模型解析系统的三步优先级机制：
- 用户覆盖（精确控制）
- Provider 降级（自动容错）
- 系统默认（兜底方案）

**学完你能做什么**：
- ✅ 理解模型解析的完整工作流程
- ✅ 根据任务需求手动指定模型
- ✅ 利用 Provider 降级提高系统鲁棒性
- ✅ 诊断和解决模型解析问题

**预计时间**：30-35 分钟

## 学习路径建议

我们建议按以下顺序学习本章节：

```mermaid
flowchart LR
    A[安装配置完成] --> B[Provider 配置]
    B --> C[多模型策略]
    C --> D[进阶功能]

    style A fill:#e0f2fe
    style B fill:#dbeafe
    style C fill:#bfdbfe
    style D fill:#93c5fd
```

**为什么这个顺序？**

1. **先配置，再理解**：先学会如何配置各个 Provider，再理解背后的解析机制
2. **从简单到复杂**：Provider 配置是基础操作，多模型策略是进阶概念
3. **实践验证理论**：配置完 Provider 后，可以用 `doctor` 命令验证多模型策略的效果

::: tip 快速入门路径
如果你只想快速上手，可以先完成 [Provider 配置](provider-setup/) 的第 1-4 步（配置基础 Provider），其他内容可以后续按需学习。
:::

## 前置条件

在学习本章节之前，请确保：

- ✅ 已完成 [安装和初始配置](../installation/)
- ✅ 安装了 OpenCode（版本 >= 1.0.150）
- ✅ 了解基本的 JSON/JSONC 配置文件格式
- ✅ 拥有至少一个 AI Provider 的账号订阅（推荐 Anthropic Claude）

::: warning 如果没有 Provider 账号怎么办？
你可以先学习配置步骤，但不实际连接 Provider。系统会使用 OpenCode 的默认模型作为兜底。
:::

## 常见问题

<details>
<summary><strong>我需要配置所有 Provider 吗？</strong></summary>

不需要。你可以只配置你最常用的 Provider（比如只配置 Anthropic Claude）。oh-my-opencode 的 Provider 降级机制会自动使用可用的 Provider。

但如果你想充分利用多模型编排的优势，建议至少配置 2-3 个 Provider，这样系统可以根据任务类型自动选择最合适的模型。
</details>

<details>
<summary><strong>Provider 配置和模型解析有什么区别？</strong></summary>

- **Provider 配置**：是"安装步骤"，告诉系统你有哪些 AI 服务可用
- **模型解析**：是"决策逻辑"，系统如何为每个代理选择使用哪个 Provider

比喻：Provider 配置是"招聘团队成员"，模型解析是"分配任务"。
</details>

<details>
<summary><strong>我可以随时修改配置吗？</strong></summary>

可以随时修改配置文件：
- 用户配置：`~/.config/opencode/oh-my-opencode.json`
- 项目配置：`.opencode/oh-my-opencode.json`

修改后无需重启，下次使用代理时自动生效。如果修改了 Provider 认证，需要运行 `opencode auth login` 重新认证。
</details>

## 下一步指引

完成本章节后，你可以：

### 推荐路径：学习 AI 代理团队

继续学习 [AI 代理团队：10 位专家介绍](../../advanced/ai-agents-overview/)，了解如何使用不同的代理完成专业任务。

### 进阶路径：深度定制配置

如果你已经熟悉基础配置，可以跳到 [配置深度定制：代理与权限管理](../../advanced/advanced-configuration/)，学习：
- 如何自定义代理的提示词
- 如何设置代理的权限和访问范围
- 如何创建自定义的代理和 Category

### 实战路径：使用 Prometheus 规划

开始使用 [Prometheus 规划：面试式需求收集](../../advanced/prometheus-planning/)，通过实际的代理协作体验多模型编排的威力。

---

**开始学习**：从 [Provider 配置](provider-setup/) 开始你的多模型编排之旅吧！
