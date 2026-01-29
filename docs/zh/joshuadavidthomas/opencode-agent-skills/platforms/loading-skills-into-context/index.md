---
title: "加载技能: 注入 XML 内容 | opencode-agent-skills"
sidebarTitle: "让 AI 能用你的技能"
subtitle: "加载技能到会话上下文"
description: "掌握 use_skill 工具加载技能到会话上下文。理解 XML 注入和 Synthetic Message Injection 机制，学习技能元数据管理。"
tags:
  - "技能加载"
  - "XML 注入"
  - "上下文管理"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: 3
---

# 加载技能到会话上下文

## 学完你能做什么

- 使用 `use_skill` 工具加载技能到当前会话
- 理解技能内容如何以 XML 格式注入到上下文
- 掌握 Synthetic Message Injection 机制（synthetic 消息注入）
- 理解技能元数据结构（来源、目录、脚本、文件）
- 了解技能在会话压缩后如何保持可用

## 你现在的困境

你创建了一个技能，但 AI 似乎无法访问它的内容。或者在长对话中，技能指导突然消失了，AI 忘记了之前的规则。这些都与技能加载机制有关。

## 什么时候用这一招

- **手动加载技能**：AI 自动推荐不合适时，直接指定需要的技能
- **长会话保持**：确保技能内容在上下文压缩后仍可访问
- **Claude Code 兼容**：加载 Claude 格式的技能，获得工具映射
- **精确控制**：需要加载特定版本的技能（通过命名空间）

## 核心思路

`use_skill` 工具将技能的 SKILL.md 内容注入到会话上下文中，让 AI 能够遵循技能中定义的规则和工作流。

### XML 内容注入

技能内容以结构化的 XML 格式注入，包含三个部分：

```xml
<skill name="skill-name">
  <metadata>
    <source>技能来源标签</source>
    <directory>技能目录路径</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Claude Code 工具映射 -->
  </tool-mapping>

  <content>
    SKILL.md 的完整内容
  </content>
</skill>
```

### Synthetic Message Injection

插件使用 OpenCode SDK 的 `session.prompt()` 方法注入技能内容，并设置两个关键标志：

::: info Synthetic Message Injection
- `noReply: true` - AI 不会响应这个注入本身
- `synthetic: true` - 标记消息为系统生成（对用户隐藏，不计入用户输入）
:::

这意味着：
- **对用户不可见**：技能注入不会显示在对话历史中
- **不消耗输入**：不计入用户消息计数
- **持久可用**：即使会话压缩，技能内容仍在上下文中

### 会话生命周期

1. **首次消息时**：插件自动注入 `<available-skills>` 列表，展示所有可用技能
2. **使用 `use_skill`**：将选定技能的 XML 内容注入到上下文
3. **会话压缩后**：插件监听 `session.compacted` 事件，重新注入技能列表

## 跟我做

### 第 1 步：加载基本技能

在 OpenCode 中让 AI 加载一个技能：

```
用户输入：
加载 brainstorming 技能

系统回复：
Skill "brainstorming" loaded.
```

**你应该看到**：AI 返回加载成功的提示，技能内容已注入到上下文。

现在你可以测试 AI 是否遵循技能规则：

```
用户输入：
帮我写一段产品描述

系统回复：
（AI 会根据 brainstorming 技能的规则生成内容，遵循其中的技巧和流程）
```

### 第 2 步：查看加载后的可用资源

加载技能时，系统会返回可用的脚本和文件列表：

```
用户输入：
加载 git-helper

系统回复：
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

这些信息告诉你技能目录下有哪些可用的资源：
- **脚本**：可以用 `run_skill_script` 工具执行
- **文件**：可以用 `read_skill_file` 工具读取

**你应该看到**：加载成功的消息，后面跟着可选的脚本和文件列表。

### 第 3 步：使用命名空间加载同名技能

假设项目级和用户级都有 `build-helper` 技能：

```
用户输入：
加载 build-helper

系统回复：
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

用户输入：
（检查加载的是哪个版本的 build-helper）
```

根据技能发现优先级，默认加载项目级技能。如果你需要用户级的：

```
用户输入：
加载 user:build-helper

系统回复：
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**你应该看到**：通过 `namespace:skill-name` 格式加载不同来源的同名技能。

### 第 4 步：体验技能指导效果

加载技能后，AI 的行为应该遵循技能定义的规则。以 brainstorming 技能为例：

```
用户输入：
加载 brainstorming
帮我构思一个智能家居产品的核心卖点

系统回复：
（AI 会使用 brainstorming 技能中定义的技巧，如：
- 先列出可能的方向，再深入探索
- 避免过早评判想法
- 使用"是的，而且..."扩展思路
- 记录所有想法后再筛选）

让我们先列出可能的方向：
1. 便利性控制
2. 能源管理
3. 安全防护
...
```

**你应该看到**：AI 的回答风格和流程与技能中定义的一致。

### 第 5 步：理解技能在长会话中的持久性

进行长时间的对话，观察技能是否保持有效：

```
用户输入：
加载 docker-helper
（进行多轮对话，涉及构建、部署等操作）
...
（假设对话很长，触发了 OpenCode 的上下文压缩）
用户输入：
继续之前的 Docker 部署

系统回复：
（AI 仍然能够访问 docker-helper 的内容，
因为插件在压缩后重新注入了技能列表）
```

::: tip 压缩恢复机制
插件监听 `session.compacted` 事件，当会话压缩时会重新注入技能列表，确保已加载的技能在压缩后仍可访问。
:::

**你应该看到**：即使对话很长、上下文被压缩，AI 仍能访问技能内容。

### 第 6 步：加载 Claude Code 格式的技能

如果你有 Claude Code 技能，它们会被自动发现：

```
用户输入：
列出所有可用技能

系统回复：
...
claude-code-superpowers (claude-plugins)
  完整的软件开发工作流

用户输入：
加载 claude-code-superpowers

系统回复：
Skill "claude-code-superpowers" loaded.
```

加载 Claude 格式技能时，会自动注入工具映射（toolTranslation），将 Claude 的工具名称映射到 OpenCode 的工具：

::: info 工具映射示例
- Claude 的 `TodoWrite` → OpenCode 的 `todowrite`
- Claude 的 `Task` → OpenCode 的 `task`（子代理）
- Claude 的 `Bash` → OpenCode 的 `bash`
:::

**你应该看到**：技能加载成功，AI 可以理解并使用 Claude 格式的工作流。

## 检查点 ✅

- [ ] 你能使用 `use_skill` 加载技能吗？
- [ ] 你能理解技能内容以 XML 格式注入的机制吗？
- [ ] 你能说出 synthetic 消息的两个关键标志吗？
- [ ] 你能解释为什么技能在会话压缩后仍可用吗？
- [ ] 你能使用命名空间加载同名技能的不同版本吗？

## 踩坑提醒

### 陷阱 1：技能名称拼写错误

如果输入了错误的技能名称：

```
用户输入：
加载 brainstormig

系统回复：
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

插件会基于编辑距离提供模糊匹配建议。

**解决**：检查拼写或使用 `get_available_skills` 查看正确的名称。

### 陷阱 2：同名技能的混淆

如果项目级和用户级有同名技能，你可能会加载到错误的版本：

```
用户输入：
加载 build-helper

系统回复：
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # 这是项目级的

用户期望加载用户级的，但默认加载的是项目级
```

**解决**：使用命名空间明确指定，如 `user:build-helper`。

### 陷阱 3：技能内容未生效

有时候你加载了技能，但 AI 似乎没有遵循规则：

```
用户输入：
加载 my-conventions
（期望 AI 遵循代码规范）
用户输入：
写一个函数

系统回复：
（AI 写的代码不符合预期规范）
```

**可能原因**：
- 技能 SKILL.md 的内容不够明确
- 技能描述不够详细，AI 理解有偏差
- 长对话中上下文被压缩，技能列表需要重新注入

**解决**：
- 检查技能的 frontmatter 和内容是否清晰
- 明确告诉 AI 使用特定规则："请使用 my-conventions 技能中的规则"
- 在压缩后重新加载技能

### 陷阱 4：Claude 技能的工具映射问题

加载 Claude Code 技能后，AI 可能仍然使用错误的工具名称：

```
用户输入：
加载 claude-code-superpowers
使用 TodoWrite 工具

系统回复：
（AI 可能尝试使用错误的工具名称，因为没有正确映射）
```

**原因**：技能加载时会自动注入工具映射，但 AI 可能需要明确提示。

**解决**：在加载技能后，明确告诉 AI 使用映射后的工具：

```
用户输入：
加载 claude-code-superpowers
注意使用 todowrite 工具（而不是 TodoWrite）
```

## 本课小结

`use_skill` 工具将技能内容以 XML 格式注入到会话上下文中，通过 Synthetic Message Injection 机制实现：

- **XML 结构化注入**：包含元数据、工具映射和技能内容
- **Synthetic 消息**：`noReply: true` 和 `synthetic: true` 确保消息对用户隐藏
- **持久可用**：即使上下文压缩，技能内容仍可访问
- **命名空间支持**：`namespace:skill-name` 格式精确指定技能来源
- **Claude 兼容**：自动注入工具映射，支持 Claude Code 技能

技能加载是让 AI 遵循特定工作流和规则的关键机制，通过内容注入，AI 可以在整个对话过程中保持一致的行为风格。

## 下一课预告

> 下一课我们学习 **[自动技能推荐：语义匹配原理](../automatic-skill-matching/)**。
>
> 你会学到：
> - 理解插件如何基于语义相似度自动推荐相关技能
> - 掌握 embedding 模型和余弦相似度计算的基本原理
> - 了解技能描述优化技巧以获得更好的推荐效果
> - 理解 embedding 缓存机制如何提升性能

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| UseSkill 工具定义 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267)         | 200-267 |
| injectSyntheticContent 函数 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162 |
| injectSkillsList 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| resolveSkill 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| listSkillFiles 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**关键常量**：
- 无

**关键函数**：
- `UseSkill()`：接受 `skill` 参数，构建 XML 格式的技能内容并注入到会话
- `injectSyntheticContent(client, sessionID, text, context)`：通过 `client.session.prompt()` 注入 synthetic 消息，设置 `noReply: true` 和 `synthetic: true`
- `injectSkillsList()`：在首次消息时注入 `<available-skills>` 列表
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`：支持 `namespace:skill-name` 格式的技能解析
- `listSkillFiles(skillPath: string, maxDepth: number)`：递归列出技能目录下的所有文件（排除 SKILL.md）

**业务规则**：
- 技能内容以 XML 格式注入，包含元数据、工具映射和内容（`tools.ts:238-249`）
- 注入消息标记为 synthetic，不计入用户输入（`utils.ts:159`）
- 已加载的技能在当前会话中不再推荐（`plugin.ts:128-132`）
- 技能列表在首次消息时自动注入（`plugin.ts:70-105`）
- 会话压缩后重新注入技能列表（`plugin.ts:145-151`）

**XML 内容格式**：
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>
