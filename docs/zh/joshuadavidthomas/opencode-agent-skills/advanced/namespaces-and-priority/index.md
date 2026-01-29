---
title: "命名空间: 技能优先级 | opencode-agent-skills"
sidebarTitle: "解决技能冲突"
subtitle: "命名空间: 技能优先级 | opencode-agent-skills"
description: "学习命名空间系统和技能发现优先级规则。掌握 5 种标签、6 级优先级，用命名空间区分同名技能，解决冲突问题。"
tags:
  - "进阶"
  - "命名空间"
  - "技能管理"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# 命名空间与技能优先级

## 学完你能做什么

- 理解技能的命名空间系统，区分不同来源的同名技能
- 掌握技能发现的优先级规则，预判哪个技能会被加载
- 使用命名空间前缀精确指定技能来源
- 解决同名技能冲突问题

## 你现在的困境

随着技能数量增长，你可能遇到这些困惑：

- **同名技能冲突**：项目目录和用户目录都叫 `git-helper` 的技能，不知道加载了哪个
- **技能来源混乱**：不清楚哪些技能来自项目级，哪些来自用户级或插件缓存
- **覆盖行为不理解**：修改了用户级技能却发现不生效，被项目级技能覆盖了
- **难以精确控制**：想强制使用某个特定来源的技能，但不知道如何指定

这些问题源于对技能命名空间和优先级规则的不理解。

## 核心思路

**命名空间**是 OpenCode Agent Skills 用来区分不同来源同名技能的机制。每个技能都有一个标签（label）标识其来源，这些标签构成了技能的命名空间。

::: info 为什么需要命名空间？

想象你有两个同名技能：
- 项目级 `.opencode/skills/git-helper/`（针对当前项目定制）
- 用户级 `~/.config/opencode/skills/git-helper/`（通用版本）

没有命名空间，系统就不知道该用哪个。有了命名空间，你可以明确指定：
- `project:git-helper` - 强制使用项目级版本
- `user:git-helper` - 强制使用用户级版本
:::

**优先级规则**确保了在未指定命名空间时，系统能做出合理的选择。项目级技能优先于用户级技能，这样你可以在项目中定制特定行为，而不会影响全局配置。

## 技能来源与标签

OpenCode Agent Skills 支持多个技能来源，每个来源都有对应的标签：

| 来源 | 标签（label） | 路径 | 说明 |
|--- | --- | --- | ---|
| **OpenCode 项目级** | `project` | `.opencode/skills/` | 当前项目专用的技能 |
| **Claude 项目级** | `claude-project` | `.claude/skills/` | Claude Code 兼容的项目技能 |
| **OpenCode 用户级** | `user` | `~/.config/opencode/skills/` | 所有项目共享的通用技能 |
| **Claude 用户级** | `claude-user` | `~/.claude/skills/` | Claude Code 兼容的用户技能 |
| **Claude 插件缓存** | `claude-plugins` | `~/.claude/plugins/cache/` | 已安装的 Claude 插件 |
| **Claude 插件市场** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | 从市场安装的 Claude 插件 |

::: tip 实际建议
- 项目特定配置：放在 `.opencode/skills/`
- 通用工具技能：放在 `~/.config/opencode/skills/`
- 从 Claude Code 迁移：无需移动，系统会自动发现
:::

## 技能发现优先级

当系统发现技能时，会按以下顺序扫描各位置：

```
1. .opencode/skills/              (project)        ← 优先级最高
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← 优先级最低
```

**关键规则**：
- **首个匹配生效**：第一个找到的技能被保留
- **同名技能去重**：后续同名技能被忽略（但会发出警告）
- **项目级优先**：项目级技能覆盖用户级技能

### 优先级示例

假设你有以下技能分布：

```
项目目录：
.opencode/skills/
  └── git-helper/              ← 版本 A（项目定制）

用户目录：
~/.config/opencode/skills/
  └── git-helper/              ← 版本 B（通用）

插件缓存：
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← 版本 C（Claude 插件）
```

结果：系统加载的是 **版本 A**（`project:git-helper`），后续两个同名技能被忽略。

## 使用命名空间指定技能

当你调用 `use_skill` 或其他工具时，可以使用命名空间前缀精确指定技能来源。

### 语法格式

```
namespace:skill-name
```

或

```
skill-name  # 不指定命名空间，使用默认优先级
```

### 命名空间列表

```
project:skill-name         # 项目级 OpenCode 技能
claude-project:skill-name  # 项目级 Claude 技能
user:skill-name            # 用户级 OpenCode 技能
claude-user:skill-name     # 用户级 Claude 技能
claude-plugins:skill-name  # Claude 插件技能
```

### 使用示例

**场景 1：默认加载（按优先级）**

```
use_skill("git-helper")
```

- 系统按优先级查找，加载第一个匹配的技能
- 即 `project:git-helper`（如果存在）

**场景 2：强制使用用户级技能**

```
use_skill("user:git-helper")
```

- 跳过优先级规则，直接加载用户级技能
- 即使用户级被项目级覆盖，仍可访问

**场景 3：加载 Claude 插件技能**

```
use_skill("claude-plugins:git-helper")
```

- 明确加载来自 Claude 插件的技能
- 适用于需要特定插件功能的场景

## 命名空间匹配逻辑

当使用 `namespace:skill-name` 格式时，系统的匹配逻辑如下：

1. **解析输入**：分离命名空间和技能名称
2. **遍历所有技能**：查找匹配的技能
3. **匹配条件**：
   - 技能名称匹配
   - 技能的 `label` 字段等于指定的命名空间
   - 或技能的 `namespace` 自定义字段等于指定的命名空间
4. **返回结果**：第一个满足条件的技能

::: details 匹配逻辑源码

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Superpowers 模式下的命名空间

当你启用 Superpowers 模式时，系统会在会话初始化时注入命名空间优先级说明：

```markdown
**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
```

这确保了 AI 在选择技能时遵循正确的优先级规则。

::: tip 如何启用 Superpowers 模式

设置环境变量：

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## 常见使用场景

### 场景 1：项目定制覆盖通用技能

**需求**：你的项目需要特殊的 Git 工作流，但用户级已有通用的 `git-helper` 技能。

**解决方案**：
1. 在项目目录创建 `.opencode/skills/git-helper/`
2. 配置项目特定的 Git 工作流
3. 默认调用 `use_skill("git-helper")` 会自动使用项目级版本

**验证**：

```bash
## 查看技能列表，注意标签
get_available_skills("git-helper")
```

输出示例：
```
git-helper (project)
  Project-specific Git workflow
```

### 场景 2：临时切换到通用技能

**需求**：某个任务需要使用用户级通用技能，而不是项目定制版本。

**解决方案**：

```
use_skill("user:git-helper")
```

明确指定 `user:` 命名空间，绕过项目级覆盖。

### 场景 3：从 Claude 插件加载技能

**需求**：你从 Claude Code 迁移过来，想继续使用某个 Claude 插件技能。

**解决方案**：

1. 确保 Claude 插件缓存路径正确：`~/.claude/plugins/cache/`
2. 查看技能列表：

```
get_available_skills()
```

3. 使用命名空间加载：

```
use_skill("claude-plugins:plugin-name")
```

## 踩坑提醒

### ❌ 错误 1：不知道同名技能被覆盖

**症状**：修改了用户级技能，但 AI 还是用旧版本。

**原因**：项目级同名技能优先级更高，覆盖了用户级技能。

**解决**：
1. 检查项目目录是否有同名技能
2. 使用命名空间强制指定：`use_skill("user:skill-name")`
3. 或者删除项目级同名技能

### ❌ 错误 2：命名空间拼写错误

**症状**：使用 `use_skill("project:git-helper")` 返回 404。

**原因**：命名空间拼写错误（如写成 `projcet`）或大小写不对。

**解决**：
1. 先查看技能列表：`get_available_skills()`
2. 注意括号中的标签（如 `(project)`）
3. 使用正确的命名空间名称

### ❌ 错误 3：混淆标签和自定义命名空间

**症状**：使用 `use_skill("project:custom-skill")` 找不到技能。

**原因**：`project` 是标签（label），不是自定义命名空间。除非技能的 `namespace` 字段明确设置为 `project`，否则不会匹配。

**解决**：
- 直接使用技能名称：`use_skill("custom-skill")`
- 或查看技能的 `label` 字段，使用正确的命名空间

## 本课小结

OpenCode Agent Skills 的命名空间系统通过标签和优先级规则，实现了对多来源技能的统一管理：

- **5 种来源标签**：`project`、`claude-project`、`user`、`claude-user`、`claude-plugins`
- **6 级优先级**：项目级 > Claude 项目级 > 用户级 > Claude 用户级 > 插件缓存 > 插件市场
- **首个匹配生效**：同名技能按优先级加载，后续被忽略
- **命名空间前缀**：使用 `namespace:skill-name` 格式精确指定技能来源

这套机制让你既能享受自动发现的便利，又能在需要时精确控制技能来源。

## 下一课预告

> 下一课我们学习 **[上下文压缩恢复机制](../context-compaction-resilience/)**。
>
> 你会学到：
> - 上下文压缩对技能的影响
> - 插件如何自动恢复技能列表
> - 长时间会话保持技能可用的技巧

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| SkillLabel 类型定义 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| 发现优先级列表 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| 同名技能去重逻辑 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| resolveSkill 命名空间处理 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Superpowers 命名空间说明 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**关键类型**：
- `SkillLabel`：技能来源标签枚举
- `Skill`：技能元数据接口（包含 `namespace` 和 `label` 字段）

**关键函数**：
- `discoverAllSkills()`：按优先级发现技能，自动去重
- `resolveSkill()`：解析命名空间前缀，查找技能
- `maybeInjectSuperpowersBootstrap()`：注入命名空间优先级说明

**发现路径列表**（按优先级顺序）：
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` 和 `~/.claude/plugins/marketplaces/`

</details>
