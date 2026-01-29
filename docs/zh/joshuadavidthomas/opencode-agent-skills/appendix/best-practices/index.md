---
title: "最佳实践: 技能开发 | opencode-agent-skills"
sidebarTitle: "写出高质量技能"
subtitle: "最佳实践: 技能开发"
description: "掌握 OpenCode Agent Skills 的开发规范。学习命名、描述、目录、脚本、Frontmatter 等最佳实践，提升技能质量和 AI 使用效率。"
tags:
  - "最佳实践"
  - "技能开发"
  - "规范"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# 技能开发最佳实践

## 学完你能做什么

完成本教程后，你将能够：
- 编写符合命名规范的技能名称
- 撰写易于被自动推荐识别的描述
- 组织清晰的技能目录结构
- 合理使用脚本功能
- 避免 Frontmatter 常见错误
- 提高技能的发现率和可用性

## 为什么需要最佳实践

OpenCode Agent Skills 插件不仅仅是存储技能，还会：
- **自动发现**：从多个位置扫描技能目录
- **语义匹配**：根据技能描述与用户消息的相似度推荐技能
- **命名空间管理**：支持多个来源的技能共存
- **脚本执行**：自动扫描并执行可执行脚本

遵循最佳实践可以让你的技能：
- ✅ 被插件正确识别和加载
- ✅ 在语义匹配时获得更高推荐优先级
- ✅ 避免与其他技能冲突
- ✅ 更容易被团队成员理解和使用

---

## 命名规范

### 技能名称规则

技能名称必须符合以下规范：

::: tip 命名规则
- ✅ 使用小写字母、数字和连字符
- ✅ 以字母开头
- ✅ 使用连字符分隔单词
- ❌ 不使用大写字母或下划线
- ❌ 不使用空格或特殊字符
:::

**示例**：

| ✅ 正确示例 | ❌ 错误示例 | 原因 |
|--- | --- | ---|
| `git-helper` | `GitHelper` | 包含大写字母 |
| `docker-build` | `docker_build` | 使用了下划线 |
| `code-review` | `code review` | 包含空格 |
| `test-utils` | `1-test` | 以数字开头 |

**源码依据**：`src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### 目录命名与 frontmatter 的关系

技能目录名和 frontmatter 中的 `name` 字段可以不同：

```yaml
---
# 目录是 my-git-tools，但 frontmatter 的 name 是 git-helper
name: git-helper
description: Git 常用操作助手
---
```

**推荐做法**：
- 保持目录名和 `name` 字段一致，便于维护
- 目录名使用简短易记的标识
- `name` 字段可以更具体描述技能用途

**源码依据**：`src/skills.ts:155-158`

---

## 描述编写技巧

### 描述的作用

技能描述不仅仅是对用户的说明，还会用于：

1. **语义匹配**：插件会计算描述与用户消息的相似度
2. **技能推荐**：根据相似度自动推荐相关技能
3. **模糊匹配**：当技能名称拼写错误时，用于推荐近似技能

### 好的描述 vs 差的描述

| ✅ 好的描述 | ❌ 差的描述 | 原因 |
|--- | --- | ---|
| "自动化 Git 分支管理和提交流程，支持自动生成 commit 信息" | "Git 工具" | 太模糊，缺乏具体功能 |
| "为 Node.js 项目生成类型安全的 API 客户端代码" | "一个有用的工具" | 未说明适用场景 |
| "将 PDF 翻译成中文并保留原始排版格式" | "翻译工具" | 未说明特殊能力 |

### 描述编写原则

::: tip 描述编写原则
1. **具体化**：说明技能的具体用途和适用场景
2. **包含关键词**：包含用户可能搜索的关键词（如 "Git"、"Docker"、"翻译"）
3. **突出独特价值**：说明这个技能相比其他同类技能的优势
4. **避免冗余**：不要重复技能名称
:::

**示例**：

```markdown
---
name: pdf-translator
description: 将英文 PDF 文档翻译成中文，保留原始排版格式、图片位置和表格结构。支持批量翻译和自定义术语表。
---
```

这个描述包含了：
- ✅ 具体功能（翻译 PDF、保留格式）
- ✅ 适用场景（英文文档）
- ✅ 独特价值（保留格式、批量、术语表）

**源码依据**：`src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## 目录组织

### 基本结构

一个标准的技能目录包含：

```
my-skill/
├── SKILL.md              # 技能主文件（必需）
├── README.md             # 详细文档（可选）
├── tools/                # 可执行脚本（可选）
│   ├── setup.sh
│   └── run.sh
└── docs/                 # 支持文档（可选）
    ├── guide.md
    └── examples.md
```

### 跳过的目录

插件会自动跳过以下目录（不扫描脚本）：

::: warning 自动跳过的目录
- `node_modules` - Node.js 依赖
- `__pycache__` - Python 字节码缓存
- `.git` - Git 版本控制
- `.venv`, `venv` - Python 虚拟环境
- `.tox`, `.nox` - Python 测试环境
- 任何以 `.` 开头的隐藏目录
:::

**源码依据**：`src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### 推荐的目录命名

| 用途 | 推荐目录名 | 说明 |
|--- | --- | ---|
| 脚本文件 | `tools/` 或 `scripts/` | 存放可执行脚本 |
| 文档 | `docs/` 或 `examples/` | 存放辅助文档 |
| 配置 | `config/` | 存放配置文件 |
| 模板 | `templates/` | 存放模板文件 |

---

## 脚本使用

### 脚本发现规则

插件会自动扫描技能目录下的可执行文件：

::: tip 脚本发现规则
- ✅ 脚本必须有可执行权限（`chmod +x script.sh`）
- ✅ 最大递归深度为 10 层
- ✅ 跳过隐藏目录和依赖目录
- ❌ 不可执行的文件不会被识别为脚本
:::

**源码依据**：`src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### 设置脚本权限

**Bash 脚本**：
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Python 脚本**：
```bash
chmod +x tools/scan.py
```

并在文件开头添加 shebang：
```python
#!/usr/bin/env python3
import sys
# ...
```

### 脚本调用示例

当技能被加载时，AI 会看到可用的脚本列表：

```
Available scripts:
- tools/setup.sh: 初始化开发环境
- tools/build.sh: 构建项目
- tools/deploy.sh: 部署到生产环境
```

AI 可以通过 `run_skill_script` 工具调用这些脚本：

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Frontmatter 最佳实践

### 必需字段

**name**：技能唯一标识
- 小写字母数字连字符
- 简短但具有描述性
- 避免通用名称（如 `helper`、`tool`）

**description**：技能描述
- 具体说明功能
- 包含适用场景
- 长度适中（1-2 句话）

### 可选字段

**license**：许可证信息
```yaml
license: MIT
```

**allowed-tools**：限制技能可使用的工具
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**：自定义元数据
```yaml
metadata:
  author: "Your Name"
  version: "1.0.0"
  category: "development"
```

**源码依据**：`src/skills.ts:105-114`

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

### 完整示例

```markdown
---
name: docker-deploy
description: 自动化 Docker 镜像构建和部署流程，支持多环境配置、健康检查和回滚
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Docker 自动部署

本技能帮助你自动化 Docker 镜像的构建、推送和部署流程。

## 使用方式

...
```

---

## 避免常见错误

### 错误 1：名称不符合规范

**错误示例**：
```yaml
name: MyAwesomeSkill  # ❌ 大写字母
```

**修正**：
```yaml
name: my-awesome-skill  # ✅ 小写字母 + 连字符
```

### 错误 2：描述太模糊

**错误示例**：
```yaml
description: "一个有用的工具"  # ❌ 太模糊
```

**修正**：
```yaml
description: "自动化 Git 提交流程，自动生成符合规范的 commit 信息"  # ✅ 具体明确
```

### 错误 3：脚本没有执行权限

**问题**：脚本没有被识别为可执行脚本

**解决**：
```bash
chmod +x tools/setup.sh
```

**验证**：
```bash
ls -l tools/setup.sh
# 应该显示：-rwxr-xr-x（有 x 权限）
```

### 错误 4：目录命名冲突

**问题**：多个技能使用相同的名称

**解决方案**：
- 使用命名空间（通过插件配置或目录结构）
- 或使用更具描述性的名称

**源码依据**：`src/skills.ts:258-259`

```typescript
// 同名技能仅保留首个，后续被忽略
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## 提高发现率

### 1. 优化描述关键词

在描述中包含用户可能搜索的关键词：

```yaml
---
name: code-reviewer
description: 自动化代码审查工具，检查代码质量、潜在 Bug、安全漏洞和性能问题。支持 JavaScript、TypeScript、Python 等多种语言。
---
```

关键词：代码审查、代码质量、Bug、安全漏洞、性能问题、JavaScript、TypeScript、Python

### 2. 使用规范的技能位置

插件按以下优先级发现技能：

1. `.opencode/skills/` - 项目级（优先级最高）
2. `.claude/skills/` - 项目级 Claude
3. `~/.config/opencode/skills/` - 用户级
4. `~/.claude/skills/` - 用户级 Claude

**推荐做法**：
- 项目特定技能 → 放在项目级
- 通用技能 → 放在用户级

### 3. 提供详细的文档

除了 SKILL.md，还可以提供：
- `README.md` - 详细说明和使用示例
- `docs/guide.md` - 完整使用指南
- `docs/examples.md` - 实战示例

---

## 本课小结

本教程介绍了技能开发的最佳实践：

- **命名规范**：使用小写字母数字连字符
- **描述编写**：具体化、包含关键词、突出独特价值
- **目录组织**：清晰的结构、跳过不必要的目录
- **脚本使用**：设置可执行权限、注意深度限制
- **Frontmatter 规范**：正确填写必需和可选字段
- **避免错误**：常见问题及解决方法

遵循这些最佳实践，可以让你的技能：
- ✅ 被插件正确识别和加载
- ✅ 在语义匹配时获得更高推荐优先级
- ✅ 避免与其他技能冲突
- ✅ 更容易被团队成员理解和使用

## 下一课预告

> 下一课我们学习 **[API 工具参考](../api-reference/)**。
>
> 你会看到：
> - 所有可用工具的详细参数说明
> - 工具调用示例和返回值格式
> - 高级用法和注意事项

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 技能名称验证 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| 技能描述验证 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Frontmatter Schema 定义 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| 跳过的目录列表 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| 脚本可执行权限检查 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| 同名技能去重逻辑 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**关键常量**：
- 跳过的目录：`['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**关键函数**：
- `findScripts(skillPath: string, maxDepth: number = 10)`：递归查找技能目录下的可执行脚本
- `parseSkillFile(skillPath: string)`：解析 SKILL.md 并验证 frontmatter

</details>
