---
title: "必需插件安装：superpowers 与 ui-ux-pro-max | AI App Factory 教程"
sidebarTitle: "5 分钟安装插件"
subtitle: "必需插件安装：superpowers 与 ui-ux-pro-max | AI App Factory 教程"
description: "学习如何安装和验证 AI App Factory 的两个必需插件：superpowers（用于 Bootstrap 头脑风暴）和 ui-ux-pro-max（用于 UI 设计系统）。本教程涵盖自动安装、手动安装、验证方法以及常见问题排查，确保流水线能够顺利运行并生成高质量、可运行的应用。"
tags:
  - "插件安装"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "start-installation"
  - "start-init-project"
  - "platforms-claude-code"
order: 70
---

# 必需插件安装：superpowers 与 ui-ux-pro-max | AI App Factory 教程

## 学完你能做什么

- 检查 superpowers 和 ui-ux-pro-max 插件是否已安装
- 手动安装这两个必需插件（如果自动安装失败）
- 验证插件是否正确启用
- 理解为什么这两个插件是流水线运行的前提条件
- 排查插件安装失败的常见问题

## 你现在的困境

运行 Factory 流水线时，你可能会遇到：

- **Bootstrap 阶段失败**：提示「未使用 superpowers:brainstorm 技能」
- **UI 阶段失败**：提示「未使用 ui-ux-pro-max 技能」
- **自动安装失败**：`factory init` 时插件安装出现错误
- **插件冲突**：已有同名插件但版本不对
- **权限问题**：插件安装后未被正确启用

其实，Factory 在初始化时会**自动尝试安装**这两个插件，但如果失败，你需要手动处理。

## 什么时候用这一招

当出现以下情况时，需要手动安装插件：

- `factory init` 时提示插件安装失败
- Bootstrap 或 UI 阶段检测到未使用必需技能
- 首次使用 Factory，确保流水线能正常运行
- 插件版本过旧，需要重新安装

## 为什么需要这两个插件

Factory 的流水线依赖两个关键的 Claude Code 插件：

| 插件 | 用途 | 流水线阶段 | 提供的技能 |
| --- | --- | --- | --- |
| **superpowers** | 深入挖掘产品想法 | Bootstrap | `superpowers:brainstorm` - 系统化头脑风暴，分析问题、用户、价值、假设 |
| **ui-ux-pro-max** | 生成专业设计系统 | UI | `ui-ux-pro-max` - 67 种样式、96 种调色板、100 条行业规则 |

::: warning 强制要求
根据 `agents/orchestrator.checkpoint.md` 的定义，这两个插件是**强制要求**：
- **Bootstrap 阶段**：必须使用 `superpowers:brainstorm` 技能，否则拒绝产物
- **UI 阶段**：必须使用 `ui-ux-pro-max` 技能，否则拒绝产物

:::

## 🎒 开始前的准备

在开始之前，请确保：

- [ ] 已安装 Claude CLI（`claude --version` 可用）
- [ ] 已完成 `factory init` 初始化项目
- [ ] 已配置 Claude Code 权限（参考 [Claude Code 集成指南](../claude-code/)）
- [ ] 网络连接正常（需要访问 GitHub 插件市场）

## 核心思路

插件安装采用**检查→添加市场→安装→验证**四步流程：

1. **检查**：查看插件是否已安装
2. **添加市场**：将插件仓库添加到 Claude Code 插件市场
3. **安装**：执行安装命令
4. **验证**：确认插件已启用

Factory 的自动安装脚本（`cli/scripts/check-and-install-*.js`）会自动执行这些步骤，但你需要了解手动方法以应对失败情况。

## 跟我做

### 第 1 步：检查插件状态

**为什么**
先确认是否已安装，避免重复操作。

打开终端，在项目根目录执行：

```bash
claude plugin list
```

**你应该看到**：已安装插件的列表，如果包含以下内容则说明已安装：

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

如果看不到这两个插件，或显示 `disabled`，则需要继续下面的步骤。

::: info factory init 的自动安装
`factory init` 命令会自动执行插件安装检查（第 360-392 行的 `init.js`）。如果成功，你会看到：

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### 第 2 步：安装 superpowers 插件

**为什么**
Bootstrap 阶段需要使用 `superpowers:brainstorm` 技能进行头脑风暴。

#### 添加到插件市场

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**你应该看到**：

```
✅ Plugin marketplace added successfully
```

::: tip 市场添加失败
如果提示「插件市场已存在」，可以忽略，继续执行安装步骤。
:::

#### 安装插件

```bash
claude plugin install superpowers@superpowers-marketplace
```

**你应该看到**：

```
✅ Plugin installed successfully
```

#### 验证安装

```bash
claude plugin list
```

**你应该看到**：列表中包含 `superpowers (enabled)`。

### 第 3 步：安装 ui-ux-pro-max 插件

**为什么**
UI 阶段需要使用 `ui-ux-pro-max` 技能生成设计系统。

#### 添加到插件市场

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**你应该看到**：

```
✅ Plugin marketplace added successfully
```

#### 安装插件

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**你应该看到**：

```
✅ Plugin installed successfully
```

#### 验证安装

```bash
claude plugin list
```

**你应该看到**：列表中包含 `ui-ux-pro-max (enabled)`。

### 第 4 步：验证两个插件都正常工作

**为什么**
确保流水线可以正常调用这两个插件的技能。

#### 验证 superpowers

在 Claude Code 中执行：

```
请使用 superpowers:brainstorm 技能帮我分析以下产品想法：[你的想法]
```

**你应该看到**：Claude 开始使用 brainstorm 技能，系统地分析问题、用户、价值和假设。

#### 验证 ui-ux-pro-max

在 Claude Code 中执行：

```
请使用 ui-ux-pro-max 技能为我的应用设计一个配色方案
```

**你应该看到**：Claude 返回一个包含多种设计选项的专业配色建议。

## 检查点 ✅

完成上述步骤后，确认以下几点：

- [ ] 执行 `claude plugin list` 能看到两个插件都标记为 `enabled`
- [ ] 在 Claude Code 中可以调用 `superpowers:brainstorm` 技能
- [ ] 在 Claude Code 中可以调用 `ui-ux-pro-max` 技能
- [ ] 执行 `factory run` 时不再提示缺少插件

## 踩坑提醒

### ❌ 插件已安装但未启用

**现象**：`claude plugin list` 显示插件存在但没有 `enabled` 标记。

**解决方法**：重新执行安装命令：

```bash
claude plugin install <插件 ID>
```

### ❌ 权限被阻止

**现象**：提示「Permission denied: Skill(superpowers:brainstorming)」

**原因**：Claude Code 的权限配置中未包含 `Skill` 权限。

**解决方法**：检查 `.claude/settings.local.json` 中是否包含：

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

参考 [Claude Code 集成指南](../claude-code/) 重新生成权限配置。

### ❌ 市场添加失败

**现象**：`claude plugin marketplace add` 失败，提示「not found」或网络错误。

**解决方法**：

1. 检查网络连接
2. 确认 Claude CLI 版本最新：`npm update -g @anthropic-ai/claude-code`
3. 尝试直接安装：跳过市场添加，直接执行 `claude plugin install <插件 ID>`

### ❌ 插件版本冲突

**现象**：已安装同名插件，但版本不对导致流水线失败。

**解决方法**：

```bash
# 卸载旧版本
claude plugin uninstall <插件名称>

# 重新安装
claude plugin install <插件 ID>
```

### ❌ Windows 路径问题

**现象**：在 Windows 上执行脚本时提示「命令未找到」。

**解决方法**：

使用 Node.js 直接运行安装脚本：

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## 自动安装失败的应对

如果 `factory init` 时的自动安装失败，你可以：

1. **查看错误信息**：终端会显示具体失败原因
2. **手动安装**：按照上面的步骤手动安装两个插件
3. **重新运行**：`factory run` 会检测插件状态，如果已安装则继续流水线

::: warning 不影响流水线启动
即使插件安装失败，`factory init` 仍会完成初始化。你可以在后续手动安装插件，不影响后续操作。
:::

## 插件在流水线中的作用

### Bootstrap 阶段（必需 superpowers）

- **技能调用**：`superpowers:brainstorm`
- **输出**：`input/idea.md` - 结构化的产品想法文档
- **验证点**：检查 Agent 是否明确说明使用了该技能（`orchestrator.checkpoint.md:60-70`）

### UI 阶段（必需 ui-ux-pro-max）

- **技能调用**：`ui-ux-pro-max`
- **输出**：`artifacts/ui/ui.schema.yaml` - 包含设计系统的 UI Schema
- **验证点**：检查设计系统配置是否来自该技能（`orchestrator.checkpoint.md:72-84`）

## 本课小结

- Factory 依赖两个必需插件：`superpowers` 和 `ui-ux-pro-max`
- `factory init` 会自动尝试安装，但失败时需要手动处理
- 插件安装流程：检查→添加市场→安装→验证
- 确保两个插件都处于 `enabled` 状态，并且权限配置正确
- 流水线的 Bootstrap 和 UI 阶段会强制检查这两个插件的使用情况

## 下一课预告

> 下一课我们学习 **[7 阶段流水线概览](../../start/pipeline-overview/)**。
>
> 你会学到：
> - 流水线的完整执行流程
> - 每个阶段的输入输出和职责
> - 检查点机制如何确保质量
> - 如何从一个失败的阶段恢复

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| Superpowers 插件检查脚本 | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| UI/UX Pro Max 插件检查脚本 | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| 自动插件安装逻辑 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Bootstrap 阶段技能验证 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| UI 阶段技能验证 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**关键常量**：
- `PLUGIN_NAME = 'superpowers'`：superpowers 插件名称
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'`：superpowers 完整 ID
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'`：插件市场仓库
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'`：UI 插件名称
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'`：UI 插件完整 ID
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'`：UI 插件市场仓库

**关键函数**：
- `isPluginInstalled()`：检查插件是否已安装（通过 `claude plugin list` 输出）
- `addToMarketplace()`：添加插件到市场（`claude plugin marketplace add`）
- `installPlugin()`：安装插件（`claude plugin install`）
- `verifyPlugin()`：验证插件已安装并启用
- `main()`：主函数，执行完整的检查→添加→安装→验证流程

</details>
