---
title: "CLI vs MCP: 设计选择 | OpenSkills"
sidebarTitle: "为什么选 CLI 而非 MCP"
subtitle: "为什么是 CLI 而不是 MCP？"
description: "学习 OpenSkills 选择 CLI 而非 MCP 的设计理由。对比两者的定位差异，了解技能系统为什么适合静态文件模式，以及如何实现多代理通用性和零配置部署。"
tags:
  - "FAQ"
  - "设计理念"
  - "MCP"
prerequisite:
  - "start-what-is-openskills"
order: 3
---

# 为什么是 CLI 而不是 MCP？

## 学完你能做什么

本课帮你理解：

- ✅ 了解 MCP 和技能系统的定位差异
- ✅ 理解为什么 CLI 更适合技能加载
- ✅ 掌握 OpenSkills 的设计哲学
- ✅ 理解技能系统的技术原理

## 你现在的困境

你可能会想：

- "为什么不用更先进的 MCP 协议？"
- "CLI 方式是不是太老旧了？"
- "MCP 不是更符合 AI 时代的设计吗？"

本课帮你理解这些设计决策背后的技术考量。

---

## 核心问题：技能是什么？

在讨论 CLI vs MCP 之前，先理解"技能"的本质。

### 技能的本质

::: info 技能的定义
技能是**静态指令 + 资源**的组合，包括：
- `SKILL.md`：详细的操作指南和提示词
- `references/`：参考文档
- `scripts/`：可执行脚本
- `assets/`：图片、模板等资源

技能**不是**动态服务、实时 API 或需要服务器运行的工具。
:::

### Anthropic 的官方设计

Anthropic 的技能系统本身就是基于**文件系统**设计的：

- 技能以 `SKILL.md` 文件形式存在
- 通过 `<available_skills>` XML 块描述可用技能
- AI 代理按需读取文件内容到上下文

这决定了技能系统的技术选型必须与文件系统兼容。

---

## MCP vs OpenSkills：定位对比

| 对比维度 | MCP（Model Context Protocol） | OpenSkills（CLI） |
|--- | --- | ---|
| **适用场景** | 动态工具、实时 API 调用 | 静态指令、文档、脚本 |
| **运行要求** | 需要 MCP 服务器 | 无需服务器（纯文件） |
| **代理支持** | 仅支持 MCP 的代理 | 所有能读 `AGENTS.md` 的代理 |
| **复杂度** | 需要服务器部署和维护 | 零配置，开箱即用 |
| **数据来源** | 实时从服务器获取 | 从本地文件系统读取 |
| **网络依赖** | 需要 | 不需要 |
| **技能加载** | 通过协议调用 | 通过文件读取 |

---

## 为什么 CLI 更适合技能系统？

### 1. 技能就是文件

**MCP 需要服务器**：需要部署 MCP 服务器，处理请求、响应、协议握手...

**CLI 只需文件**：

```bash
# 技能存储在文件系统中
.claude/skills/pdf/
├── SKILL.md              # 主指令文件
├── references/           # 参考文档
│   └── pdf-format-spec.md
├── scripts/             # 可执行脚本
│   └── extract-pdf.py
└── assets/              # 资源文件
    └── pdf-icon.png
```

**优势**：
- ✅ 零配置，无需服务器
- ✅ 技能可以被版本控制
- ✅ 离线可用
- ✅ 部署简单

### 2. 通用性：所有代理都能用

**MCP 的限制**：

只有支持 MCP 协议的代理才能使用。如果 Cursor、Windsurf、Aider 等代理各自实现 MCP，会带来：
- 重复开发工作
- 协议兼容性问题
- 版本同步困难

**CLI 的优势**：

任何能执行 shell 命令的代理都能用：

```bash
# Claude Code 调用
npx openskills read pdf

# Cursor 调用
npx openskills read pdf

# Windsurf 调用
npx openskills read pdf
```

**零集成成本**：只需要代理能执行 shell 命令即可。

### 3. 符合官方设计

Anthropic 的技能系统本身就是**文件系统设计**，不是 MCP 设计：

```xml
<!-- AGENTS.md 中的技能描述 -->
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>
</available_skills>
```

**调用方式**：

```bash
# 官方设计的调用方式
npx openskills read pdf
```

OpenSkills 完全遵循 Anthropic 的官方设计，保持了兼容性。

### 4. 渐进式加载（Progressive Disclosure）

**技能系统的核心优势**：按需加载，保持上下文精简。

**CLI 的实现**：

```bash
# 只在需要时才加载技能内容
npx openskills read pdf
# 输出：SKILL.md 的完整内容到标准输出
```

**MCP 的挑战**：

如果用 MCP 实现，需要：
- 服务器管理技能列表
- 实现按需加载逻辑
- 处理上下文管理

而 CLI 方式天然支持渐进式加载。

---

## MCP 的适用场景

MCP 解决的问题与技能系统**不同**：

| MCP 解决的问题 | 示例 |
|--- | ---|
| **实时 API 调用** | 调用 OpenAI API、数据库查询 |
| **动态工具** | 计算器、数据转换服务 |
| **远程服务集成** | Git 操作、CI/CD 系统 |
| **状态管理** | 需要维护服务器状态的工具 |

这些场景需要**服务器**和**协议**，MCP 是正确的选择。

---

## 技能系统 vs MCP：不是竞争关系

**核心观点**：MCP 和技能系统解决不同问题，不是非此即彼。

### 技能系统的定位

```
[静态指令] → [SKILL.md] → [文件系统] → [CLI 加载]
```

适用场景：
- 操作指南和最佳实践
- 文档和参考资料
- 静态脚本和模板
- 需要版本控制的配置

### MCP 的定位

```
[动态工具] → [MCP 服务器] → [协议调用] → [实时响应]
```

适用场景：
- 实时 API 调用
- 数据库查询
- 需要状态的远程服务
- 复杂的计算和转换

### 互补关系

OpenSkills 不排斥 MCP，而是**专注于技能加载**：

```
AI 代理
  ├─ 技能系统（OpenSkills CLI）→ 加载静态指令
  └─ MCP 工具 → 调用动态服务
```

它们是互补的，不是替代的。

---

## 实际案例：什么时候用哪个？

### 案例 1：调用 Git 操作

❌ **不适合技能系统**：
- Git 操作是动态的，需要实时交互
- 依赖 Git 服务器状态

✅ **适合 MCP**：
```bash
# 通过 MCP 工具调用
git:checkout(branch="main")
```

### 案例 2：PDF 处理指南

❌ **不适合 MCP**：
- 操作指南是静态的
- 不需要服务器运行

✅ **适合技能系统**：
```bash
# 通过 CLI 加载
npx openskills read pdf
# 输出：详细的 PDF 处理步骤和最佳实践
```

### 案例 3：数据库查询

❌ **不适合技能系统**：
- 需要连接数据库
- 结果是动态的

✅ **适合 MCP**：
```bash
# 通过 MCP 工具调用
database:query(sql="SELECT * FROM users")
```

### 案例 4：代码审查规范

❌ **不适合 MCP**：
- 审查规范是静态文档
- 需要版本控制

✅ **适合技能系统**：
```bash
# 通过 CLI 加载
npx openskills read code-review
# 输出：详细的代码审查清单和示例
```

---

## 未来：MCP 和技能系统的融合

### 可能的演进方向

**MCP + 技能系统**：

```bash
# 技能中引用 MCP 工具
npx openskills read pdf-tool

# SKILL.md 内容
本技能需要使用 MCP 工具：

1. 使用 mcp:pdf-extract 提取文本
2. 使用 mcp:pdf-parse 解析结构
3. 使用本技能提供的脚本处理结果
```

**优势**：
- 技能提供高级指令和最佳实践
- MCP 提供底层动态工具
- 两者结合，功能更强大

### 当前阶段

OpenSkills 选择 CLI 是因为：
1. 技能系统已经是成熟的文件系统设计
2. CLI 方式实现简单、通用性强
3. 无需等待各个代理实现 MCP 支持

---

## 本课小结

OpenSkills 选择 CLI 而非 MCP 的核心理由：

### 核心原因

- ✅ **技能是静态文件**：无需服务器，文件系统存储
- ✅ **通用性更强**：所有代理都能用，不依赖 MCP 协议
- ✅ **符合官方设计**：Anthropic 技能系统本身就是文件系统设计
- ✅ **零配置部署**：无需服务器，开箱即用

### MCP vs 技能系统

| MCP | 技能系统（CLI） |
|--- | ---|
| 动态工具 | 静态指令 |
| 需要服务器 | 纯文件系统 |
| 实时 API | 文档和脚本 |
| 需要协议支持 | 零集成成本 |

### 不是竞争，是互补

- MCP 解决动态工具问题
- 技能系统解决静态指令问题
- 两者可以结合使用

---

## 相关阅读

- [什么是 OpenSkills？](../../start/what-is-openskills/)
- [命令详解](../../platforms/cli-commands/)
- [创建自定义技能](../../advanced/create-skills/)

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                      | 行号    |
|--- | --- | ---|
| CLI 入口    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)                     | 39-80   |
| 读取命令    | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50    |
| AGENTS.md 生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts) | 23-93   |

**关键设计决策**：
- CLI 方式：通过 `npx openskills read <name>` 加载技能
- 文件系统存储：技能存储在 `.claude/skills/` 或 `.agent/skills/`
- 通用兼容性：输出与 Claude Code 完全一致的 XML 格式

</details>
