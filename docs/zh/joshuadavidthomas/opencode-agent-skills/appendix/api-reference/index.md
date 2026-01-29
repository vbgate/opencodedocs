---
title: "API: 工具参考 | opencode-agent-skills"
sidebarTitle: "调用这 4 个工具"
subtitle: "API: 工具参考 | opencode-agent-skills"
description: "学习 opencode-agent-skills 的 4 个核心 API 工具的使用方法。掌握参数配置、返回值处理和错误排查技巧，了解工具的命名空间支持和安全机制，通过实际示例提升开发效率，在项目中高效调用工具。"
tags:
  - "API"
  - "工具参考"
  - "接口文档"
prerequisite:
  - "start-installation"
order: 2
---

# API 工具参考

## 学完你能做什么

通过本篇 API 参考，你将：

- 了解 4 个核心工具的参数和返回值
- 掌握正确的工具调用方式
- 学会处理常见的错误情况

## 工具概览

OpenCode Agent Skills 插件提供以下 4 个工具：

| 工具名称 | 功能描述 | 使用场景 |
|---------|---------|---------|
| `get_available_skills` | 获取可用技能列表 | 查看所有可用技能，支持搜索过滤 |
| `read_skill_file` | 读取技能文件 | 访问技能的文档、配置等支持文件 |
| `run_skill_script` | 执行技能脚本 | 在技能目录下运行自动化脚本 |
| `use_skill` | 加载技能 | 将技能的 SKILL.md 内容注入到会话上下文 |

---

## get_available_skills

获取可用技能列表，支持可选的搜索过滤。

### 参数

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| `query` | string | 否 | 搜索查询字符串，匹配技能名称和描述（支持 `*` 通配符） |

### 返回值

返回格式化的技能列表，每项包含：

- 技能名称和来源标签（如 `skill-name (project)`）
- 技能描述
- 可用脚本列表（如果有）

**示例返回**：
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### 错误处理

- 无匹配结果时，返回提示信息
- 如果查询参数拼写错误，会返回相似技能建议

### 使用示例

**列出所有技能**：
```
用户输入：
列出所有可用的技能

AI 调用：
get_available_skills()
```

**搜索包含 "git" 的技能**：
```
用户输入：
查找与 git 相关的技能

AI 调用：
get_available_skills({
  "query": "git"
})
```

**使用通配符搜索**：
```
AI 调用：
get_available_skills({
  "query": "code*"
})

返回：
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

读取技能目录下的支持文件（文档、配置、示例等）。

### 参数

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| `skill` | string | 是 | 技能名称 |
| `filename` | string | 是 | 文件路径（相对于技能目录，如 `docs/guide.md`、`scripts/helper.sh`） |

### 返回值

返回文件加载成功的确认消息。

**示例返回**：
```
File "docs/guide.md" from skill "code-review" loaded.
```

文件内容会以 XML 格式注入到会话上下文中：

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[文件实际内容]
  </content>
</skill-file>
```

### 错误处理

| 错误类型 | 返回信息 |
|---------|---------|
| 技能不存在 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| 路径不安全 | `Invalid path: cannot access files outside skill directory.` |
| 文件不存在 | `File "xxx" not found. Available files: file1, file2, ...` |

### 安全机制

- 路径安全检查：防止目录穿越攻击（如 `../../../etc/passwd`）
- 仅限访问技能目录内的文件

### 使用示例

**读取技能文档**：
```
用户输入：
查看 code-review 技能的使用指南

AI 调用：
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**读取配置文件**：
```
AI 调用：
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

在技能目录下执行可执行脚本。

### 参数

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| `skill` | string | 是 | 技能名称 |
| `script` | string | 是 | 脚本相对路径（如 `build.sh`、`tools/deploy.sh`） |
| `arguments` | string[] | 否 | 传递给脚本的命令行参数数组 |

### 返回值

返回脚本的输出内容。

**示例返回**：
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### 错误处理

| 错误类型 | 返回信息 |
|---------|---------|
| 技能不存在 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| 脚本不存在 | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| 执行失败 | `Script failed (exit 1): error message` |

### 脚本发现规则

插件会自动扫描技能目录下的可执行文件：

- 最大递归深度：10 层
- 跳过隐藏目录（以 `.` 开头）
- 跳过常见依赖目录（`node_modules`、`__pycache__`、`.git` 等）
- 仅包含有可执行位（`mode & 0o111`）的文件

### 执行环境

- 工作目录（CWD）切换到技能目录
- 脚本在技能目录上下文中执行
- 输出直接返回给 AI

### 使用示例

**执行构建脚本**：
```
用户输入：
运行项目的构建脚本

AI 调用：
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**带参数执行**：
```
AI 调用：
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

加载技能的 SKILL.md 内容到会话上下文。

### 参数

| 参数名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| `skill` | string | 是 | 技能名称（支持命名空间前缀，如 `project:my-skill`、`user:my-skill`） |

### 返回值

返回技能加载成功的确认消息，包含可用脚本和文件列表。

**示例返回**：
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

技能内容会以 XML 格式注入到会话上下文中：

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Claude Code 工具映射...]
  
  <content>
[SKILL.md 实际内容]
  </content>
</skill>
```

### 命名空间支持

使用命名空间前缀精确指定技能来源：

| 命名空间 | 说明 | 示例 |
|---------|------|------|
| `project:` | 项目级 OpenCode 技能 | `project:my-skill` |
| `user:` | 用户级 OpenCode 技能 | `user:my-skill` |
| `claude-project:` | 项目级 Claude 技能 | `claude-project:my-skill` |
| `claude-user:` | 用户级 Claude 技能 | `claude-user:my-skill` |
| 无前缀 | 使用默认优先级 | `my-skill` |

### 错误处理

| 错误类型 | 返回信息 |
|---------|---------|
| 技能不存在 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### 自动注入功能

加载技能时，插件会自动：

1. 列出技能目录下的所有文件（排除 SKILL.md）
2. 列出所有可执行脚本
3. 注入 Claude Code 工具映射（如果技能需要）

### 使用示例

**加载技能**：
```
用户输入：
帮我进行代码审查

AI 调用：
use_skill({
  "skill": "code-review"
})
```

**使用命名空间指定来源**：
```
AI 调用：
use_skill({
  "skill": "user:git-helper"
})
```

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 工具 | 文件路径 | 行号 |
|------|---------|------|
| GetAvailableSkills 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| ReadSkillFile 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| RunSkillScript 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| UseSkill 工具 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| 工具注册 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Skill 类型定义 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Script 类型定义 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| SkillLabel 类型定义 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| resolveSkill 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**关键类型**：
- `Skill`：技能完整元数据（name, description, path, scripts, template 等）
- `Script`：脚本元数据（relativePath, absolutePath）
- `SkillLabel`：技能来源标识（project, user, claude-project 等）

**关键函数**：
- `resolveSkill()`：解析技能名称，支持命名空间前缀
- `isPathSafe()`：验证路径安全性，防止目录穿越
- `findClosestMatch()`：模糊匹配建议

</details>

---

## 下一课预告

本课程已完成 OpenCode Agent Skills 的 API 工具参考文档。

如需了解更多信息，请查阅：
- [技能开发最佳实践](../best-practices/) - 学习编写高质量技能的技巧和规范
- [常见问题排查](../../faq/troubleshooting/) - 解决使用插件时遇到的常见问题
