---
title: "版本历史: 追踪 DCP 演进 | opencode-dynamic-context-pruning"
sidebarTitle: "查看新功能"
subtitle: "版本历史: 追踪 DCP 演进"
description: "了解 OpenCode DCP 插件从 v1.0.1 到 v1.2.7 的所有版本更新，掌握新功能、修复和优化，及时升级获取 Token 节省改进。"
tags:
  - "版本历史"
  - "更新日志"
  - "DCP"
prerequisite: []
order: 1
---

# DCP 版本历史

本文档记录了 OpenCode Dynamic Context Pruning (DCP) 插件的完整版本更新记录。

---

## [v1.2.7] - 2026-01-22

**新增功能**
- ✨ 显示提取内容的 Token 计数（在修剪通知中）
- 🛡️ 改进上下文注入防御机制（添加数组检查）
- 📝 优化：当最后一条消息是用户消息时，将上下文作为用户消息注入
- ⚙️ 简化默认配置（仅包含 schema URL）

---

## [v1.2.6] - 2026-01-21

**新增功能**
- ✨ 添加 `/dcp sweep` 命令，支持手动修剪上下文

**命令详情**
- `/dcp sweep` - 修剪上一条用户消息后的所有工具
- `/dcp sweep N` - 修剪最后 N 个工具

---

## [v1.2.5] - 2026-01-20

**新增功能**
- ✨ 在 `/dcp context` 命令中显示工具计数
- ✨ 优化 `/dcp context` 命令的 UI：
  - 显示已修剪工具计数
  - 改进进度条准确性

**性能优化**
- 🚀 优化上下文命令中的 Token 计算

---

## [v1.2.4] - 2026-01-20

**新增功能**
- ✨ 统一 DCP 命令到单个 `/dcp` 命令（子命令结构）：
  - `/dcp` - 显示帮助
  - `/dcp context` - 上下文分析
  - `/dcp stats` - 统计信息
- ✨ 添加 `commands` 配置段：
  - 可启用/禁用 slash 命令
  - 支持配置受保护工具列表

**改进**
- 📝 简化上下文命令 UI
- 📝 文档更新：阐明 context_info 工具注入机制

**修复**
- 🐛 修复修剪工具错误处理（失败时抛出错误而非返回字符串）

**文档**
- 📚 添加缓存命中率统计到 README

---

## [v1.2.3] - 2026-01-16

**新增功能**
- ✨ 简化提示词加载（将提示词移至 TS 文件）

**改进**
- 🔧 Gemini 兼容性：使用 `thoughtSignature` 绕过工具部分注入验证

---

## [v1.2.2] - 2026-01-15

**修复**
- 🐛 简化注入时机（等待 assistant 轮次）
- 🐛 Gemini 兼容性修复：使用文本注入避免 thought signature 错误

---

## [v1.2.1] - 2026-01-14

**修复**
- 🐛 Anthropic 模型：在注入上下文前要求 reasoning block
- 🐛 GitHub Copilot：跳过用户角色的合成消息注入

---

## [v1.2.0] - 2026-01-13

**新增功能**
- ✨ 添加 `plan_enter` 和 `plan_exit` 到默认受保护工具列表
- ✨ 支持问题工具（question tool）用于修剪

**改进**
- 🔧 统一注入机制（带 isAnthropic 检查）
- 🔧 扁平化提示词目录结构
- 🔧 简化和统一 prune.ts 检查顺序
- 🔧 将系统提示词处理程序提取到 hooks.ts

**修复**
- 🐛 跳过子代理会话的系统提示词注入
- 🐛 GitHub Copilot：当最后一条消息是用户角色时跳过注入

---

## [v1.1.6] - 2026-01-12

**修复**
- 🐛 **GitHub Copilot 用户关键修复**：使用 completed assistant message 和 tool part 注入可修剪工具列表

**影响范围**
- 此修复解决了 GitHub Copilot 用户使用 DCP 时的关键问题

---

## [v1.1.5] - 2026-01-10

**新增功能**
- ✨ 添加 JSON Schema 支持配置文件自动补全
- ✨ 添加受保护文件模式配置（protectedFilePatterns）
- ✨ 支持通过 glob 模式保护文件操作（read/write/edit）

**改进**
- 📝 文档：记录子代理限制

**修复**
- 🐛 修复 schema URL 使用 master 分支
- 🐛 添加 `$schema` 到有效配置键列表

---

## [v1.1.4] - 2026-01-06

**修复**
- 🐛 移除 `isInternalAgent` 标志（由于 hook 顺序竞争条件）

**改进**
- 🔧 优化内部代理检测逻辑

---

## [v1.1.3] - 2026-01-05

**修复**
- 🐛 为内部代理（title、summary、compaction）跳过 DCP 注入
- 🐛 禁用 write/edit 工具的修剪

**改进**
- 🔧 改进子代理限制检测

---

## [v1.1.2] - 2025-12-26

**改进**
- 🔧 将 distillation 合并为统一通知
- 🔧 简化 distillation UI

---

## [v1.1.1] - 2025-12-25

**新增功能**
- ✨ 添加 purge errors 策略，在失败的工具调用后修剪输入
- ✨ 添加 skill 工具支持到 `extractParameterKey`

**改进**
- 📝 改进错误修剪的替换文本
- 📝 文档：更新关于 context poisoning 和 OAuth 的提示

---

## [v1.1.0] - 2025-12-24

**新增功能**
- ✨ 主要功能版本更新
- ✨ 添加自动修剪策略：
  - 去重策略
  - 覆盖写入策略
  - 清除错误策略

**新增工具**
- ✨ LLM 驱动修剪工具：
  - `discard` - 移除工具内容
  - `extract` - 提取关键发现

**配置系统**
- ✨ 多层级配置支持（全局/环境变量/项目）
- ✨ 回合保护功能
- ✨ 受保护工具配置

---

## [v1.0.4] - 2025-12-18

**修复**
- 🐛 不修剪 pending 或 running 的工具输入

**改进**
- 🔧 优化工具状态检测逻辑

---

## [v1.0.3] - 2025-12-18

**新增功能**
- ✅ 基于消息的压缩检测

**改进**
- 🔧 在会话初始化时检查压缩时间戳

---

## [v1.0.2] - 2025-12-17

**新增功能**
- ✅ 基于消息的压缩检测

**改进**
- 🔧 清理代码结构

---

## [v1.0.1] - 2025-12-16

**初始版本**

- ✅ 核心功能实现
- ✅ OpenCode 插件集成
- ✅ 基本的上下文修剪能力

---

## 版本命名规则

- **主版本号**（如 1.x）- 不兼容的重大更新
- **次版本号**（如 1.2.x）- 向下兼容的功能性新增
- **修订号**（如 1.2.7）- 向下兼容的问题修正

---

## 获取最新版本

推荐在 OpenCode 配置中使用 `@latest` 标签，确保自动获取最新版本：

```jsonc
// opencode.jsonc
{
    "plugin": ["@tarquinen/opencode-dcp@latest"],
}
```

查看最新发布版本：[npm package](https://www.npmjs.com/package/@tarquinen/opencode-dcp)
