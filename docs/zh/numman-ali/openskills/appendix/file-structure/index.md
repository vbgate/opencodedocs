---
title: "文件结构: 目录组织 | opencode-openskills"
sidebarTitle: "技能放哪"
subtitle: "文件结构: 目录组织 | opencode-openskills"
description: "学习 OpenSkills 的目录和文件组织方式。掌握技能安装目录、目录结构、AGENTS.md 格式规范及查找优先级。"
tags:
  - "附录"
  - "文件结构"
  - "目录组织"
prerequisite: []
order: 3
---

# 文件结构

## 概览

OpenSkills 的文件结构分为三类：**技能安装目录**、**技能目录结构**和 **AGENTS.md 同步文件**。理解这些结构有助于你更好地管理和使用技能。

## 技能安装目录

OpenSkills 支持 4 个技能安装位置，按优先级从高到低排列：

| 优先级 | 位置 | 说明 | 何时使用 |
| ------ | ---- | ---- | -------- |
| 1 | `./.agent/skills/` | 项目本地 Universal 模式 | 多代理环境，避免与 Claude Code 冲突 |
| 2 | `~/.agent/skills/` | 全局 Universal 模式 | 多代理环境 + 全局安装 |
| 3 | `./.claude/skills/` | 项目本地（默认） | 标准安装，项目特定技能 |
| 4 | `~/.claude/skills/` | 全局安装 | 所有项目共享的技能 |

**选择建议**：
- 单代理环境：使用默认的 `.claude/skills/`
- 多代理环境：使用 `.agent/skills/`（`--universal` 标志）
- 跨项目通用技能：使用全局安装（`--global` 标志）

## 技能目录结构

每个技能都是一个独立的目录，包含必需文件和可选资源：

```
skill-name/
├── SKILL.md              # 必需：技能主文件
├── .openskills.json      # 必需：安装元数据（自动生成）
├── references/           # 可选：参考文档
│   └── api-docs.md
├── scripts/             # 可选：可执行脚本
│   └── helper.py
└── assets/              # 可选：模板和输出文件
    └── template.json
```

### 文件说明

#### SKILL.md（必需）

技能主文件，包含 YAML frontmatter 和技能指令：

```yaml
---
name: my-skill
description: 技能描述
---

## 技能标题

技能指令内容...
```

**关键点**：
- 文件名必须为 `SKILL.md`（大写）
- YAML frontmatter 必须包含 `name` 和 `description`
- 内容使用祈使语气（imperative form）

#### .openskills.json（必需，自动生成）

OpenSkills 自动创建的元数据文件，记录安装来源：

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**用途**：
- 支持技能更新（`openskills update`）
- 记录安装时间戳
- 追踪技能来源

**源位置**：
- `src/utils/skill-metadata.ts:29-36` - 写入元数据
- `src/utils/skill-metadata.ts:17-27` - 读取元数据

#### references/（可选）

存放参考文档和 API 规范：

```
references/
├── skill-format.md      # 技能格式规范
├── api-docs.md         # API 文档
└── best-practices.md   # 最佳实践
```

**使用场景**：
- 详细的技术文档（保持 SKILL.md 简洁）
- API 参考手册
- 示例代码和模板

#### scripts/（可选）

存放可执行脚本：

```
scripts/
├── extract_text.py      # Python 脚本
├── deploy.sh          # Shell 脚本
└── build.js          # Node.js 脚本
```

**使用场景**：
- 技能执行时需要运行的自动化脚本
- 数据处理和转换工具
- 部署和构建脚本

#### assets/（可选）

存放模板和输出文件：

```
assets/
├── template.json      # JSON 模板
├── config.yaml       # 配置文件
└── output.md        # 示例输出
```

**使用场景**：
- 技能生成内容的模板
- 配置文件样例
- 预期的输出示例

## AGENTS.md 结构

`openskills sync` 生成的 AGENTS.md 文件包含技能系统说明和可用技能列表：

### 完整格式

```markdown
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### 组件说明

| 组件 | 说明 |
| ---- | ---- |
| `<skills_system>` | XML 标签，标记技能系统部分 |
| `<usage>` | 技能使用说明（告诉 AI 如何调用技能） |
| `<available_skills>` | 可用技能列表（每个技能一个 `<skill>` 标签） |
| `<skill>` | 单个技能信息（name, description, location） |
| `<!-- SKILLS_TABLE_START -->` | 开始标记（用于同步时定位） |
| `<!-- SKILLS_TABLE_END -->` | 结束标记（用于同步时定位） |

**location 字段**：
- `project` - 项目本地技能（`.claude/skills/` 或 `.agent/skills/`）
- `global` - 全局技能（`~/.claude/skills/` 或 `~/.agent/skills/`）

## 目录查找优先级

OpenSkills 在查找技能时，按以下优先级遍历目录：

```typescript
// 源位置：src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. 项目 Universal
  join(homedir(), '.agent/skills'),        // 2. 全局 Universal
  join(process.cwd(), '.claude/skills'),  // 3. 项目 Claude
  join(homedir(), '.claude/skills'),       // 4. 全局 Claude
]
```

**规则**：
- 找到第一个匹配的技能后立即停止查找
- 项目本地技能优先于全局技能
- Universal 模式优先于标准模式

**源位置**：`src/utils/skills.ts:30-64` - 查找所有技能的实现

## 示例：完整项目结构

一个使用 OpenSkills 的典型项目结构：

```
my-project/
├── AGENTS.md                    # 同步生成的技能列表
├── .claude/                     # Claude Code 配置
│   └── skills/                  # 技能安装目录
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Universal 模式目录（可选）
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # 项目源代码
├── package.json
└── README.md
```

## 最佳实践

### 1. 目录选择

| 场景 | 推荐目录 | 命令 |
| ---- | -------- | ---- |
| 项目特定技能 | `.claude/skills/` | `openskills install repo` |
| 多代理共享 | `.agent/skills/` | `openskills install repo --universal` |
| 跨项目通用 | `~/.claude/skills/` | `openskills install repo --global` |

### 2. 技能组织

- **单技能仓库**：根目录放 `SKILL.md`
- **多技能仓库**：子目录各自包含 `SKILL.md`
- **符号链接**：开发时用 symlink 链接到本地仓库（见 [符号链接支持](../../advanced/symlink-support/)）

### 3. AGENTS.md 版本控制

- **建议提交**：将 `AGENTS.md` 加入版本控制
- **CI 同步**：在 CI/CD 中运行 `openskills sync -y`（见 [CI/CD 集成](../../advanced/ci-integration/)）
- **团队协作**：团队成员同步运行 `openskills sync` 保持一致

## 本课小结

OpenSkills 的文件结构设计简洁清晰：

- **4 个安装目录**：支持项目本地、全局、Universal 模式
- **技能目录**：必需的 SKILL.md + 自动生成的 .openskills.json + 可选的 resources/scripts/assets
- **AGENTS.md**：同步生成的技能列表，遵循 Claude Code 格式

理解这些结构有助于你更高效地管理和使用技能。

## 下一课预告

> 下一课我们学习 **[术语表](../glossary/)**。
>
> 你会学到：
> - OpenSkills 和 AI 技能系统的关键术语
> - 专业概念的准确定义
> - 常见缩写的含义

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| ---- | -------- | ---- |
| 目录路径工具 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| 技能查找 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| 元数据管理 | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**关键函数**：
- `getSkillsDir(projectLocal, universal)` - 获取技能目录路径
- `getSearchDirs()` - 获取 4 个查找目录（按优先级）
- `findAllSkills()` - 查找所有已安装技能
- `findSkill(skillName)` - 查找指定技能
- `readSkillMetadata(skillDir)` - 读取技能元数据
- `writeSkillMetadata(skillDir, metadata)` - 写入技能元数据

</details>
