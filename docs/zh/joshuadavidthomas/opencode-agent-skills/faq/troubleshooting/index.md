---
title: "故障排查: 解决常见问题 | opencode-agent-skills"
subtitle: "故障排查: 解决常见问题"
sidebarTitle: "遇到问题怎么办"
description: "学习 opencode-agent-skills 的故障排查方法。涵盖技能加载失败、脚本执行错误、路径安全问题等9类常见问题的解决方案。"
tags:
  - "troubleshooting"
  - "faq"
  - "故障排除"
prerequisite: []
order: 1
---

# 常见问题排查

::: info
本课适合所有遇到使用问题的用户，无论你是否已经熟悉插件的基本功能。如果你遇到了技能加载失败、脚本执行错误等问题，或者想了解常见问题的排查方法，本课会帮助你快速定位并解决这些常见问题。
:::

## 学完你能做什么

- 快速定位技能加载失败的原因
- 解决脚本执行错误和权限问题
- 理解路径安全限制的原理
- 排查语义匹配和模型加载问题

## 技能查询不到

### 症状
调用 `get_available_skills` 时返回 `No skills found matching your query`。

### 可能原因
1. 技能未安装在发现路径中
2. 技能名称拼写错误
3. SKILL.md 格式不符合规范

### 解决方法

**检查技能是否在发现路径中**：

插件按以下优先级查找技能（首个匹配生效）：

| 优先级 | 路径 | 类型 |
|--- | --- | ---|
| 1 | `.opencode/skills/` | 项目级（OpenCode）|
| 2 | `.claude/skills/` | 项目级（Claude）|
| 3 | `~/.config/opencode/skills/` | 用户级（OpenCode）|
| 4 | `~/.claude/skills/` | 用户级（Claude）|
| 5 | `~/.claude/plugins/cache/` | 插件缓存 |
| 6 | `~/.claude/plugins/marketplaces/` | 已安装插件 |

验证命令：
```bash
# 检查项目级技能
ls -la .opencode/skills/
ls -la .claude/skills/

# 检查用户级技能
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**验证 SKILL.md 格式**：

技能目录必须包含 `SKILL.md` 文件，且格式符合 Anthropic Skills Spec：

```yaml
---
name: skill-name
description: 技能的简短描述
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

技能内容部分...
```

必检项：
- ✅ `name` 必须是小写字母、数字和连字符（如 `git-helper`）
- ✅ `description` 不能为空
- ✅ YAML frontmatter 必须用 `---` 包围
- ✅ 技能内容必须跟在第二个 `---` 后

**利用模糊匹配**：

插件会提供拼写建议。例如：
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

如果看到类似提示，使用建议的名称重试。

---

## 技能不存在错误

### 症状
调用 `use_skill("skill-name")` 时返回 `Skill "skill-name" not found`。

### 可能原因
1. 技能名称拼写错误
2. 技能已被同名技能覆盖（优先级冲突）
3. 技能目录缺少 SKILL.md 或格式错误

### 解决方法

**查看所有可用技能**：

```bash
使用 get_available_skills 工具列出所有技能
```

**理解优先级覆盖规则**：

如果多个路径存在同名技能，仅**优先级最高**的生效。例如：
- 项目级 `.opencode/skills/git-helper/` → ✅ 生效
- 用户级 `~/.config/opencode/skills/git-helper/` → ❌ 被覆盖

检查同名冲突：
```bash
# 搜索所有同名技能
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**验证 SKILL.md 是否存在**：

```bash
# 进入技能目录
cd .opencode/skills/git-helper/

# 检查 SKILL.md
ls -la SKILL.md

# 查看 YAML 格式是否正确
head -10 SKILL.md
```

---

## 脚本执行失败

### 症状
调用 `run_skill_script` 时返回脚本错误或退出码非零。

### 可能原因
1. 脚本路径不正确
2. 脚本没有可执行权限
3. 脚本本身有逻辑错误

### 解决方法

**检查脚本是否在技能的 scripts 列表中**：

加载技能时会列出可用脚本：
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

如果调用时指定了不存在的脚本：
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**使用正确的相对路径**：

脚本的路径是相对于技能目录的，不要包含前导 `/`：
- ✅ 正确：`tools/build.sh`
- ❌ 错误：`/tools/build.sh`

**赋予脚本可执行权限**：

插件只执行有可执行位的文件（`mode & 0o111`）。

::: code-group

```bash [macOS/Linux]
# 赋予可执行权限
chmod +x .opencode/skills/my-skill/tools/build.sh

# 验证权限
ls -la .opencode/skills/my-skill/tools/build.sh
# 输出应包含：-rwxr-xr-x
```

```powershell [Windows]
# Windows 不使用 Unix 权限位，确保脚本扩展名关联正确
# PowerShell 脚本：.ps1
# Bash 脚本（通过 Git Bash）：.sh
```

:::

**调试脚本执行错误**：

如果脚本返回错误，插件会显示退出码和输出：
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

手动调试：
```bash
# 进入技能目录
cd .opencode/skills/my-skill/

# 直接执行脚本查看详细错误
./tools/build.sh
```

---

## 路径不安全错误

### 症状
调用 `read_skill_file` 或 `run_skill_script` 时返回路径不安全错误。

### 可能原因
1. 路径包含 `..`（目录穿越）
2. 路径是绝对路径
3. 路径包含不规范的字符

### 解决方法

**理解路径安全规则**：

插件禁止访问技能目录以外的文件，防止目录穿越攻击。

允许的路径示例（相对于技能目录）：
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

禁止的路径示例：
- ❌ `../../../etc/passwd`（目录穿越）
- ❌ `/tmp/file.txt`（绝对路径）
- ❌ `./../other-skill/file.md`（穿越到其他目录）

**使用相对路径**：

始终使用相对于技能目录的路径，不要以 `/` 或 `../` 开头：
```bash
# 读取技能文档
read_skill_file("my-skill", "docs/guide.md")

# 执行技能脚本
run_skill_script("my-skill", "tools/build.sh")
```

**列出可用文件**：

如果不确定文件名，先查看技能文件列表：
```
调用 use_skill 后会返回：
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Embedding 模型加载失败

### 症状
语义匹配功能失效，日志显示 `Model failed to load`。

### 可能原因
1. 网络连接问题（首次下载模型）
2. 模型文件损坏
3. 缓存目录权限问题

### 解决方法

**检查网络连接**：

首次使用时，插件需要从 Hugging Face 下载 `all-MiniLM-L6-v2` 模型（约 238MB）。确保网络可以访问 Hugging Face。

**清理并重新下载模型**：

模型缓存在 `~/.cache/opencode-agent-skills/`：

```bash
# 删除缓存目录
rm -rf ~/.cache/opencode-agent-skills/

# 重启 OpenCode，插件会自动重新下载模型
```

**检查缓存目录权限**：

```bash
# 查看缓存目录
ls -la ~/.cache/opencode-agent-skills/

# 确保有读写权限
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**手动验证模型加载**：

如果问题持续，可以在插件日志中查看详细错误：
```
查看 OpenCode 日志，搜索 "embedding" 或 "model"
```

---

## SKILL.md 解析失败

### 症状
技能目录存在但未被插件发现，或者加载时返回格式错误。

### 可能原因
1. YAML frontmatter 格式错误
2. 必填字段缺失
3. 字段值不符合验证规则

### 解决方法

**检查 YAML 格式**：

SKILL.md 的结构必须如下：

```markdown
---
name: my-skill
description: 技能描述
---

技能内容...
```

常见错误：
- ❌ 缺少 `---` 分隔符
- ❌ YAML 缩进不正确（YAML 使用 2 空格缩进）
- ❌ 冒号后缺少空格

**验证必填字段**：

| 字段 | 类型 | 必填 | 约束 |
|--- | --- | --- | ---|
| name | string | ✅ | 小写字母数字连字符，非空 |
| description | string | ✅ | 非空 |

**测试 YAML 有效性**：

使用在线工具验证 YAML 格式：
- [YAML Lint](https://www.yamllint.com/)

或使用命令行工具：
```bash
# 安装 yamllint
pip install yamllint

# 验证文件
yamllint SKILL.md
```

**检查技能内容区域**：

技能内容必须跟在第二个 `---` 之后：

```markdown
---
name: my-skill
description: 技能描述
---

这里开始是技能内容，会被注入到 AI 的上下文中...
```

如果技能内容为空，插件会忽略该技能。

---

## 自动推荐不生效

### 症状
发送相关消息后，AI 没有收到技能推荐提示。

### 可能原因
1. 相似度低于阈值（默认 0.35）
2. 技能描述不够详细
3. 模型未加载

### 解决方法

**提高技能描述质量**：

技能描述越具体，语义匹配越准确。

| ❌ 糟糕的描述 | ✅ 好的描述 |
|--- | ---|
| "Git 工具" | "帮助执行 Git 操作：创建分支、提交代码、合并 PR、解决冲突" |
| "测试辅助" | "生成单元测试、运行测试套件、分析测试覆盖率、修复失败的测试" |

**手动调用技能**：

如果自动推荐不生效，可以手动加载：

```
使用 use_skill("skill-name") 工具
```

**调整相似度阈值**（高级）：

默认阈值为 0.35，如果觉得推荐太少，可以在源码中调整（`src/embeddings.ts:10`）：

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // 降低此值会增加推荐
```

::: warning
修改源码需要重新编译插件，不推荐普通用户操作。
:::

---

## 上下文压缩后技能失效

### 症状
长对话后，AI 好像"忘记"了已加载的技能。

### 可能原因
1. 插件版本低于 v0.1.0
2. 会话初始化未完成

### 解决方法

**验证插件版本**：

压缩恢复功能在 v0.1.0+ 均支持。如果插件通过 npm 安装，检查版本：

```bash
# 查看 OpenCode 插件目录中的 package.json
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**确认会话初始化完成**：

插件在首次消息时会注入技能列表。如果会话初始化未完成，压缩恢复可能失效。

症状：
- 首次消息后没有看到技能列表
- AI 不了解可用技能

**重新启动会话**：

如果问题持续，删除当前会话并新建：
```
在 OpenCode 中删除会话，重新开始对话
```

---

## 脚本递归搜索失败

### 症状
技能包含深层嵌套的脚本，但未被插件发现。

### 可能原因
1. 递归深度超过 10 层
2. 脚本在隐藏目录中（以 `.` 开头）
3. 脚本在依赖目录中（如 `node_modules`）

### 解决方法

**了解递归搜索规则**：

插件递归搜索脚本时：
- 最大深度：10 层
- 跳过隐藏目录（目录名以 `.` 开头）：`.git`、`.vscode` 等
- 跳过依赖目录：`node_modules`、`__pycache__`、`vendor`、`.venv`、`venv`、`.tox`、`.nox`

**调整脚本位置**：

如果脚本在深层目录，可以：
- 提升到更浅的目录（如 `tools/` 而非 `src/lib/utils/tools/`）
- 使用软链接到脚本位置（Unix 系统）

```bash
# 创建软链接
ln -s ../../../scripts/build.sh tools/build.sh
```

**列出已发现的脚本**：

加载技能后，插件会返回脚本列表。如果脚本不在列表中，检查：
1. 文件是否有可执行权限
2. 目录是否被跳过规则匹配

---

## 本课小结

本课涵盖了使用 OpenCode Agent Skills 插件时常见的 9 类问题：

| 问题类型 | 关键检查点 |
|--- | ---|
| 技能查询不到 | 发现路径、SKILL.md 格式、拼写 |
| 技能不存在 | 名称正确性、优先级覆盖、文件存在性 |
| 脚本执行失败 | 脚本路径、可执行权限、脚本逻辑 |
| 路径不安全 | 相对路径、无 `..`、无绝对路径 |
| 模型加载失败 | 网络连接、缓存清理、目录权限 |
| 解析失败 | YAML 格式、必填字段、技能内容 |
| 自动推荐不生效 | 描述质量、相似度阈值、手动调用 |
| 上下文压缩后失效 | 插件版本、会话初始化 |
| 脚本递归搜索失败 | 深度限制、目录跳过规则、可执行权限 |

---

## 下一课预告

> 下一课我们学习 **[安全性说明](../security-considerations/)**。
>
> 你会学到：
> - 插件的安全机制设计
> - 如何编写安全的技能
> - 路径验证和权限控制原理
> - 安全最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 技能查询模糊匹配建议 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| 技能不存在错误处理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| 脚本不存在错误处理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| 脚本执行失败错误处理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| 路径安全检查 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| SKILL.md 解析错误处理 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| 模型加载失败错误 | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| 模糊匹配算法 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**关键常量**：
- `SIMILARITY_THRESHOLD = 0.35`（相似度阈值）：`src/embeddings.ts:10`
- `TOP_K = 5`（返回最相似的技能数量）：`src/embeddings.ts:11`

**其他重要值**：
- `maxDepth = 10`（脚本递归最大深度，findScripts 函数默认参数）：`src/skills.ts:59`
- `0.4`（模糊匹配阈值，findClosestMatch 函数返回条件）：`src/utils.ts:124`

**关键函数**：
- `findClosestMatch()`：模糊匹配算法，用于生成拼写建议
- `isPathSafe()`：路径安全检查，防止目录穿越
- `ensureModel()`：确保 embedding 模型已加载
- `parseSkillFile()`：解析 SKILL.md 并验证格式

</details>
