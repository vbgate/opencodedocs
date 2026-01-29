---
title: "技能管理: 查询可用技能 | opencode-agent-skills"
sidebarTitle: "快速找技能"
subtitle: "技能管理: 查询可用技能"
description: "学习 get_available_skills 工具的使用方法。通过搜索、命名空间和过滤快速定位技能，掌握技能发现和管理的核心功能。"
tags:
  - "技能管理"
  - "工具使用"
  - "命名空间"
prerequisite:
  - "start-installation"
order: 2
---

# 查询和列出可用技能

## 学完你能做什么

- 使用 `get_available_skills` 工具列出所有可用技能
- 通过搜索查询过滤特定技能
- 使用命名空间（如 `project:skill-name`）精确定位技能
- 识别技能来源和可执行脚本列表

## 你现在的困境

你想使用某个技能，但记不清它的确切名称。也许你知道它是项目里的某个技能，但不知道在哪个发现路径下。或者你只是想快速浏览一下当前项目有哪些技能可用。

## 什么时候用这一招

- **探索新项目**：加入一个新项目时，快速了解有哪些可用的技能
- **技能名称不确定**：只记得技能的部分名称或描述，需要模糊匹配
- **多命名空间冲突**：项目级和用户级有同名技能，需要明确指定使用哪个
- **查找脚本**：想知道技能目录下有哪些可执行的自动化脚本

## 核心思路

`get_available_skills` 工具帮你查看当前会话可用的所有技能。插件会自动从 6 个发现路径扫描技能：

::: info 技能发现优先级
1. `.opencode/skills/` (项目级 OpenCode)
2. `.claude/skills/` (项目级 Claude)
3. `~/.config/opencode/skills/` (用户级 OpenCode)
4. `~/.claude/skills/` (用户级 Claude)
5. `~/.claude/plugins/cache/` (插件缓存)
6. `~/.claude/plugins/marketplaces/` (已安装插件)
:::

同名技能按优先级只保留第一个，后续的被忽略。

工具返回的信息包括：
- **技能名称**
- **来源标签**（project、user、claude-project 等）
- **描述**
- **可执行脚本列表**（如果有）

::: tip 命名空间语法
你可以用 `namespace:skill-name` 格式明确指定来源：
- `project:my-skill` - 使用项目级 OpenCode 技能（`.opencode/skills/`）
- `claude-project:my-skill` - 使用项目级 Claude 技能（`.claude/skills/`）
- `user:my-skill` - 使用用户级 OpenCode 技能（`~/.config/opencode/skills/`）
- `claude-user:my-skill` - 使用用户级 Claude 技能（`~/.claude/skills/`）
- `claude-plugins:my-skill` - 使用 Claude 插件中的技能
:::

## 跟我做

### 第 1 步：列出所有可用技能

在 OpenCode 中直接让 AI 列出技能：

```
用户输入：
列出所有可用的技能

系统回复：
skill-helper (project)
  Git 操作和分支管理助手 [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  单元测试和覆盖率分析工具

docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  完整的软件开发工作流
```

**你应该看到**：一个技能列表，每个技能显示名称、来源标签、描述和脚本列表。

### 第 2 步：使用搜索查询过滤

如果你只记得技能的部分名称：

```
用户输入：
查找包含 "docker" 的技能

系统回复：
docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]
```

搜索会匹配技能名称和描述中的关键词，支持 `*` 通配符：

```
用户输入：
查找以 "test" 开头的技能

系统回复：
test-helper (user)
  单元测试和覆盖率分析工具
```

**你应该看到**：只显示匹配查询条件的技能。

### 第 3 步：体验模糊匹配建议

如果你输入了错误的技能名称：

```
用户输入：
我想用 docker-asistant

系统回复：
No skills found matching "docker-asistant". Did you mean "docker-helper"?
```

插件会基于 Levenshtein 距离计算相似度，自动建议最接近的技能名称。

**你应该看到**：错误提示和正确的技能建议。

### 第 4 步：使用命名空间精确定位

假设项目级和用户级都有名为 `build-helper` 的技能：

```
用户输入：
列出 build-helper 的详细信息

系统回复：
build-helper (project)
  项目特定的构建配置和编译优化 [scripts: build.sh, optimize.sh]
```

如果用户想要用户级的技能：

```
用户输入：
使用 user:build-helper

系统回复：
build-helper (user)
  通用构建工具链和持续集成配置 [scripts: ci.sh, test.sh]
```

**你应该看到**：通过命名空间前缀可以访问不同来源的同名技能。

### 第 5 步：检查可执行脚本

查看技能目录下有哪些脚本：

```
用户输入：
docker-helper 有哪些脚本？

系统回复：
docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]
```

脚本会显示在技能信息的方括号中，用逗号分隔。你可以用 `run_skill_script` 工具执行这些脚本。

**你应该看到**：技能名称后面跟着 `[scripts: 脚本路径1, 脚本路径2, ...]` 格式的列表。

## 检查点 ✅

- [ ] 你能列出所有可用的技能吗？
- [ ] 你能用搜索查询过滤特定技能吗？
- [ ] 你能理解技能来源标签的含义吗（project、user、claude-project 等）？
- [ ] 你能说出技能命名空间的作用和语法吗？
- [ ] 你能从技能信息中识别可执行脚本列表吗？

## 踩坑提醒

### 陷阱 1：同名技能的覆盖

如果项目级和用户级有同名技能，你可能会困惑为什么加载的不是你期望的技能。

**原因**：技能按优先级发现，项目级优先于用户级，同名只保留第一个。

**解决**：使用命名空间明确指定，如 `user:my-skill` 而不是 `my-skill`。

### 陷阱 2：搜索大小写敏感

搜索查询使用正则表达式，但设置了 `i` 标志，所以是不区分大小写的。

```bash
# 这些搜索是等效的
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### 陷阱 3：通配符的转义

搜索中的 `*` 会被自动转换为 `.*` 正则表达式，不需要手动转义：

```bash
# 搜索以 "test" 开头的技能
get_available_skills(query="test*")

# 等同于正则表达式 /test.*/i
```

## 本课小结

`get_available_skills` 是探索技能生态的工具，支持：

- **列出所有技能**：不加参数调用
- **搜索过滤**：通过 `query` 参数匹配名称和描述
- **命名空间**：用 `namespace:skill-name` 精确定位
- **模糊匹配建议**：拼写错误时自动提示正确名称
- **脚本列表**：显示可执行的自动化脚本

插件会在会话开始时自动注入技能列表，所以你通常不需要手动调用这个工具。但在以下场景下它很有用：
- 想快速浏览可用技能
- 记不清技能的确切名称
- 需要区分同名技能的不同来源
- 想查看某个技能的脚本列表

## 下一课预告

> 下一课我们学习 **[加载技能到会话上下文](../loading-skills-into-context/)**。
>
> 你会学到：
> - 使用 use_skill 工具加载技能到当前会话
> - 理解技能内容如何以 XML 格式注入到上下文
> - 掌握 Synthetic Message Injection 机制（synthetic 消息注入）
> - 了解技能在会话压缩后如何保持可用

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| GetAvailableSkills 工具定义 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72)         | 29-72   |
| discoverAllSkills 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| resolveSkill 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| findClosestMatch 函数 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125)    | 88-125  |

**关键类型**：
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`：技能来源标签枚举

**关键常量**：
- 模糊匹配阈值：`0.4`（`utils.ts:124`）- 相似度低于此值不返回建议

**关键函数**：
- `GetAvailableSkills()`：返回格式化的技能列表，支持查询过滤和模糊匹配建议
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`：支持 `namespace:skill-name` 格式的技能解析
- `findClosestMatch(input: string, candidates: string[])`：基于多种匹配策略（前缀、包含、编辑距离）计算最佳匹配

**业务规则**：
- 同名技能按发现顺序去重，仅保留第一个（`skills.ts:258`）
- 搜索查询支持通配符 `*`，自动转换为正则表达式（`tools.ts:43`）
- 模糊匹配建议只在有查询参数且无结果时触发（`tools.ts:49-57`）

</details>
