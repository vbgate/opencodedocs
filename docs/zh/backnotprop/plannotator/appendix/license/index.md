---
title: "许可证: BSL条款说明 | Plannotator"
sidebarTitle: "了解商业使用规则"
subtitle: "许可证: BSL条款说明"
description: "学习 Plannotator 的 Business Source License 1.1 (BSL) 许可证条款和商业使用限制。了解允许的使用场景、未来变更计划及 2030 年转为 Apache 2.0 的时间表。"
tags:
  - "许可证"
  - "BSL-1.1"
  - "商业使用"
prerequisite: []
order: 3
---

# Plannotator 许可证说明

## 学完你能做什么

- 了解 Plannotator 使用的许可证类型和核心条款
- 明确哪些使用场景是被允许的，哪些是受限的
- 知道许可证的未来变更时间表
- 了解如何获取商业许可或联系授权方

## 你现在需要了解

Plannotator 采用 **Business Source License 1.1 (BSL)** 作为其开源许可证。这是一种特殊的许可证，旨在在保护商业价值的同时，最终让项目完全开源。

## 核心条款

### 许可证类型

| 项目 | 内容 |
| ---- | ---- |
| **许可证名称** | Business Source License 1.1 (BSL) |
| **版权方** | backnotprop (2025) |
| **授权项目** | plannotator |
| **变更日期** | 2030-01-01 |
| **变更后许可证** | Apache License, Version 2.0 |

::: info 什么是 BSL？
Business Source License 是一种由 MariaDB 开发的特殊许可证。它在短期内限制了某些商业用途，但承诺在特定日期后将软件转换为完全开源的许可证（如 Apache 2.0）。这种模式让开源项目能够在商业化过程中获得可持续的收益，同时确保长期对社区开放。
:::

### 允许的使用方式

根据 BSL 1.1 条款，你可以：

- ✅ **复制、修改和创建衍生作品**
  - 你可以基于 Plannotator 进行二次开发
  - 可以修改源代码以适应你的需求

- ✅ **重新分发**
  - 可以分发原始或修改后的版本
  - 必须保留原始的许可证声明

- ✅ **非生产环境使用**
  - 内部开发、测试和评估
  - 个人学习和研究

::: tip 个人和企业内部的广泛使用
BSL 对"非生产环境使用"的定义很宽泛，包括个人和公司内部的各种场景。你和你的团队成员（包括独立承包商）都可以自由使用 Plannotator 进行开发、测试和部署。
:::

### 使用限制（重要！）

**核心限制**：不得将 Plannotator 用于 **计划、上下文或审批服务（Planning, Context, or Approval Service）**。

#### 什么是"计划、上下文或审批服务"？

任何允许**第三方**（除员工和独立承包商外）通过直接或间接操作访问 Plannotator 功能的商业产品，都属于受限服务。具体包括但不限于：

- **云服务提供商**
  - SaaS 平台提供 Plannotator 功能作为其服务的一部分
  - 托管服务提供商向客户或订阅者提供 Plannotator

- **基础设施服务**
  - 数据中心服务提供商
  - 云计算平台提供商

- **类似服务的第三方**
  - 包括上述实体及其关联公司提供的任何服务

::: warning 商业使用警告
如果你计划将 Plannotator 作为商业服务的一部分提供给第三方使用，必须提前获取商业许可。违反此条款将自动终止你对当前及所有版本 Plannotator 的使用权利。
:::

## 许可证变更时间表

| 时间节点 | 许可证类型 | 说明 |
| -------- | ---------- | ---- |
| **当前 - 2030-01-01** | BSL 1.1 | 受限的开源许可证 |
| **2030-01-01 起** | Apache 2.0 | 完全开源，无商业限制 |

### 变更后会发生什么？

从 2030 年 1 月 1 日起，Plannotator 将自动转换为 **Apache License 2.0**。这意味着：

- ✅ 所有商业限制将取消
- ✅ 可以自由地用于任何商业目的
- ✅ 可以将其集成到任何 SaaS 服务中
- ✅ 符合宽松的开源许可证标准

## 商业许可

如果你需要在不遵守 BSL 限制的情况下使用 Plannotator（例如用于计划、上下文或审批服务），可以：

1. **购买商业许可**
   - 从 backnotprop 或其授权经销商购买
   - 获得不受 BSL 限制的使用权利

2. **联系授权方**
   - 发邮件至：backnotprop
   - 说明你的使用场景和需求

## 常见问题

### 我可以在公司内部使用 Plannotator 吗？

**可以。** BSL 明确允许你和你的员工、独立承包商使用 Plannotator 进行内部开发、测试和部署。限制仅适用于向**第三方**（非员工和承包商）提供服务的场景。

### 我可以基于 Plannotator 开发自己的产品吗？

**可以，但有条件。** 如果你的产品是：
- 内部工具：✅ 允许
- 个人项目：✅ 允许
- 开源项目：✅ 允许（保留 BSL 许可证）
- 商业产品：❓ 需要评估是否属于"计划、上下文或审批服务"

### 我的公司是 SaaS 提供商，可以使用吗？

**需要商业许可。** 如果你的 SaaS 产品将 Plannotator 的功能提供给客户使用（即使作为功能的一部分），这属于受限的商业服务，必须购买商业许可。

### 2030 年之后我可以将 Plannotator 用于任何用途吗？

**是的。** 从变更日期起，Plannotator 将采用 Apache 2.0 许可证，所有商业限制都将取消，你可以自由地用于任何用途。

## 许可证完整文本

完整的 Business Source License 1.1 文本请参阅项目根目录的 `LICENSE` 文件。

## 联系方式

如需商业许可或有其他问题，请联系：
- **授权方**：backnotprop
- **项目仓库**：[backnotprop/plannotator](https://github.com/backnotprop/plannotator)

## 下一课预告

> 下一课我们查看 **[更新日志](../../changelog/release-notes/)**。
>
> 你会看到：
> - Plannotator 的版本历史
> - 每个版本的新功能和改进
> - 重要的 bug 修复

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                 | 行号    |
| ----------- | ------------------------------------------------------------------------ | ------- |
| 许可证声明   | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L100-L104) | 100-104 |
| 完整许可证文本 | [`LICENSE`](https://github.com/backnotprop/plannotator/blob/main/LICENSE)         | 1-115   |

**关键信息**：
- 许可证类型：Business Source License 1.1 (BSL)
- 版权方：backnotprop (c) 2025
- 变更日期：2030-01-01
- 变更后许可证：Apache License, Version 2.0
- 主要限制：不得用于计划、上下文或审批服务

</details>
