---
title: "使用指南: 斜杠命令和自然语言 | opencode-mystatus"
sidebarTitle: "使用方式"
subtitle: "使用指南: 斜杠命令和自然语言"
description: "学习 opencode-mystatus 的两种使用方式。通过斜杠命令和自然语言提问，快速查询多个 AI 平台的额度使用情况。"
tags:
  - "快速开始"
  - "斜杠命令"
  - "自然语言"
prerequisite:
  - "start-quick-start"
order: 2
---
# 使用 mystatus：斜杠命令和自然语言

## 学完你能做什么

- 使用 `/mystatus` 斜杠命令一键查询所有 AI 平台额度
- 用自然语言提问让 OpenCode 自动调用 mystatus 工具
- 理解斜杠命令和自然语言两种触发方式的区别和适用场景

## 你现在的困境

你在使用多个 AI 平台开发（OpenAI、智谱 AI、GitHub Copilot 等），想知道每个平台还剩多少额度，但不想逐个登录各平台查看——太麻烦了。

## 什么时候用这一招

- **需要快速查看所有平台额度时**：每天开发前检查一下，合理安排使用
- **想知道某个平台具体额度时**：比如想确认 OpenAI 是否快用完了
- **想检查配置是否生效时**：刚配置好新账号，验证一下能否正常查询

::: info 前置检查

本教程假设你已完成[opencode-mystatus 插件安装](/zh/vbgate/opencode-mystatus/start/quick-start/)。如果还没有安装，请先完成安装步骤。

:::

## 核心思路

opencode-mystatus 提供了两种触发 mystatus 工具的方式：

1. **斜杠命令 `/mystatus`**：快速、直接、无歧义，适合频繁查询
2. **自然语言提问**：更灵活，适合结合具体场景的查询

两种方式都会调用同一个 `mystatus` 工具，工具会并行查询所有已配置的 AI 平台额度，返回带进度条、使用统计和重置倒计时的结果。

## 跟我做

### 第 1 步：使用斜杠命令查询额度

在 OpenCode 中输入以下命令：

```bash
/mystatus
```

**为什么**
斜杠命令是 OpenCode 的快捷命令机制，可以快速调用预定义的工具。`/mystatus` 命令会直接调用 mystatus 工具，无需额外参数。

**你应该看到**：
OpenCode 会返回所有已配置平台的额度信息，格式如下：

```
## OpenAI 账号额度

Account:        user@example.com (team)

3小时限额
████████████████████████████ 剩余 85%
重置: 2h 30m后

## 智谱 AI 账号额度

Account:        9c89****AQVM (Coding Plan)

5小时 token 限额
████████████████████████████ 剩余 95%
已用: 0.5M / 10.0M
重置: 4h后
```

每个平台会显示：
- 账号信息（邮箱或脱敏后的 API Key）
- 进度条（可视化显示剩余额度）
- 重置时间倒计时
- 已用量和总用量（部分平台）

### 第 2 步：用自然语言提问

除了斜杠命令，你也可以用自然语言提问，OpenCode 会自动识别意图并调用 mystatus 工具。

试试这些提问方式：

```bash
Check my OpenAI quota
```

或

```bash
How much Codex quota do I have left?
```

或

```bash
Show my AI account status
```

**为什么**
自然语言查询更符合日常对话习惯，适合在具体开发场景中提出问题。OpenCode 会通过语义匹配识别出你想查询额度，并自动调用 mystatus 工具。

**你应该看到**：
与斜杠命令相同的输出结果，只是触发方式不同。

### 第 3 步：理解斜杠命令的配置

斜杠命令 `/mystatus` 是如何工作的？它是在 OpenCode 配置文件中定义的。

打开 `~/.config/opencode/opencode.json`，找到 `command` 部分：

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**关键配置项说明**：

| 配置项 | 值 | 作用 |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | 在命令列表中显示的说明 |
| `template` | "Use to mystatus tool..." | 提示 OpenCode 如何处理这个命令 |

**为什么需要 template**
template 是给 OpenCode 的"指令"，告诉它：当用户输入 `/mystatus` 时，调用 mystatus 工具，并将结果原样返回给用户（不做任何修改）。

## 检查点 ✅

确认你已经掌握了两种使用方式：

| 技能 | 检查方法 | 预期结果 |
|--- | --- | ---|
| 斜杠命令查询 | 输入 `/mystatus` | 显示所有平台的额度信息 |
| 自然语言查询 | 输入 "Check my OpenAI quota" | 显示额度信息 |
| 理解配置 | 查看 opencode.json | 找到 mystatus 命令配置 |

## 踩坑提醒

### 常见错误 1：斜杠命令无响应

**现象**：输入 `/mystatus` 后没有任何反应

**原因**：OpenCode 配置文件没有正确配置斜杠命令

**解决方法**：
1. 打开 `~/.config/opencode/opencode.json`
2. 确认 `command` 部分包含 `mystatus` 配置（见第 3 步）
3. 重启 OpenCode

### 常见错误 2：自然语言提问没有调用 mystatus 工具

**现象**：输入 "Check my OpenAI quota" 后，OpenCode 没有调用 mystatus 工具，而是尝试自己回答

**原因**：OpenCode 没有正确识别你的意图

**解决方法**：
1. 尝试更明确的表达："Use mystatus tool to check my OpenAI quota"
2. 或直接使用斜杠命令 `/mystatus`，更可靠

### 常见错误 3：显示"未找到任何已配置的账号"

**现象**：执行 `/mystatus` 后显示"未找到任何已配置的账号"

**原因**：还没有配置任何平台的认证信息

**解决方法**：
- 至少配置一个平台的认证信息（OpenAI、智谱 AI、Z.ai、GitHub Copilot 或 Google Cloud）
- 详见 [快速开始教程](/zh/vbgate/opencode-mystatus/start/quick-start/) 中的配置说明

## 本课小结

mystatus 工具提供了两种使用方式：
1. **斜杠命令 `/mystatus`**：快速直接，适合频繁查询
2. **自然语言提问**：更灵活，适合结合具体场景

两种方式都会并行查询所有已配置的 AI 平台额度，返回带进度条和重置倒计时的结果。斜杠命令的配置在 `~/.config/opencode/opencode.json` 中定义，通过 template 指示 OpenCode 如何调用 mystatus 工具。

## 下一课预告

> 下一课我们学习 **[解读输出：进度条、重置时间和多账号](/zh/vbgate/opencode-mystatus/start/understanding-output/)**。
>
> 你会学到：
> - 如何解读进度条的含义
> - 重置时间倒计时如何计算
> - 多账号场景下的输出格式
> - 进度条生成原理

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| mystatus 工具定义 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| 工具描述 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| 斜杠命令配置 | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| 并行查询所有平台 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| 结果收集和汇总 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**关键常量**：
无（本节主要介绍调用方式，不涉及具体常量）

**关键函数**：
- `mystatus()`：mystatus 工具的主函数，读取认证文件并并行查询所有平台（`plugin/mystatus.ts:29-33`）
- `collectResult()`：收集查询结果到 results 和 errors 数组（`plugin/mystatus.ts:100-116`）

</details>
