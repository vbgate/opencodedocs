---
title: "读取技能文件: 访问资源 | opencode-agent-skills"
subtitle: "读取技能文件: 访问资源 | opencode-agent-skills"
sidebarTitle: "访问技能额外资源"
description: "学习读取技能文件的方法。掌握路径安全检查和 XML 注入机制，安全访问技能目录下的文档和配置。"
tags:
  - "技能文件"
  - "工具使用"
  - "路径安全"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 6
---

# 读取技能文件

## 学完你能做什么

- 使用 `read_skill_file` 工具读取技能目录下的文档、配置和示例文件
- 理解路径安全机制，防止目录穿越攻击
- 掌握 XML 格式的文件内容注入方式
- 处理文件不存在时的错误提示和可用文件列表

## 你现在的困境

技能的 SKILL.md 只包含核心指导，但很多技能会提供配套的文档、配置示例、使用指南等支持文件。你想要访问这些文件以获取更详细的说明，但不知道如何安全地读取技能目录下的文件。

## 什么时候用这一招

- **查看详细文档**：技能的 `docs/` 目录下有详细的使用指南
- **配置示例**：需要参考 `config/` 目录下的示例配置文件
- **代码示例**：技能的 `examples/` 目录包含代码示例
- **调试辅助**：查看技能的 README 或其他说明文件
- **了解资源结构**：探索技能目录中有哪些可用文件

## 核心思路

`read_skill_file` 工具让你安全地访问技能目录下的支持文件。它通过以下机制保证安全性和可用性：

::: info 安全机制
插件会严格检查文件路径，防止目录穿越攻击：
- 禁止使用 `..` 访问技能目录外的文件
- 禁止使用绝对路径
- 只允许访问技能目录及其子目录中的文件
:::

工具执行流程：
1. 验证技能名称是否存在（支持命名空间）
2. 检查请求的文件路径是否安全
3. 读取文件内容
4. 以 XML 格式包装并注入到会话上下文
5. 返回加载成功的确认消息

::: tip 文件内容持久化
文件内容通过 `synthetic: true` 和 `noReply: true` 标志注入，这意味着：
- 文件内容成为会话上下文的一部分
- 即使会话被压缩，内容仍然可访问
- 注入不会触发 AI 的直接回复
:::

## 跟我做

### 第 1 步：读取技能文档

假设技能目录下有详细的使用文档：

```
用户输入：
读取 git-helper 的文档

系统调用：
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

系统回复：
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

文件内容会以 XML 格式注入到会话上下文：

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Git Helper 使用指南

本技能提供 Git 分支管理、提交规范和协作流程的指导...

[文档内容继续]
  </content>
</skill-file>
```

**你应该看到**：加载成功的消息，文件内容已注入到会话上下文。

### 第 2 步：读取配置示例

查看技能的示例配置：

```
用户输入：
显示 docker-helper 的配置示例

系统调用：
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

系统回复：
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**你应该看到**：配置文件内容被注入，AI 可以参考示例为你生成实际的配置。

### 第 3 步：使用命名空间读取文件

如果项目级和用户级有同名技能：

```
用户输入：
读取 project:build-helper 的构建脚本

系统调用：
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

系统回复：
File "scripts/build.sh" from skill "build-helper" loaded.
```

**你应该看到**：通过命名空间明确指定了技能来源。

### 第 4 步：处理文件不存在的情况

如果你尝试读取不存在的文件：

```
用户输入：
读取 git-helper 的 api-docs.md

系统调用：
read_skill_file(skill="git-helper", filename="api-docs.md")

系统回复：
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

工具会列出技能目录下的所有可用文件，帮助你找到正确的文件名。

**你应该看到**：错误提示和可用文件列表。

### 第 5 步：体验路径安全保护

尝试访问技能目录外的文件：

```
用户输入：
读取 git-helper 的父目录文件

系统调用：
read_skill_file(skill="git-helper", filename="../secrets.txt")

系统回复：
Invalid path: cannot access files outside skill directory.
```

工具会拒绝任何试图访问技能目录外的请求。

**你应该看到**：路径安全错误提示。

## 检查点 ✅

- [ ] 你能使用 `read_skill_file` 读取技能文件吗？
- [ ] 你能理解路径安全机制的作用吗？
- [ ] 你能识别文件内容注入的 XML 格式吗？
- [ ] 你能从错误提示中找到可用文件列表吗？
- [ ] 你能使用命名空间精确定位技能吗？

## 踩坑提醒

### 陷阱 1：文件路径错误

如果你忘记文件在子目录中：

```
用户输入：
读取 git-helper 的 usage-guide.md

系统回复：
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**原因**：文件可能在子目录中，需要指定相对路径。

**解决**：使用完整路径，如 `docs/usage-guide.md`。

### 陷阱 2：忽略命名空间冲突

同名技能存在于多个命名空间时：

```
用户输入：
读取 build-helper 的 README

系统回复：
File "README.md" from skill "build-helper" loaded.
```

你可能读取的是项目级技能，但期望的是用户级技能。

**解决**：使用命名空间明确指定，如 `read_skill_file(skill="user:build-helper", filename="README.md")`。

### 陷阱 3：路径穿越尝试

尝试使用 `..` 访问上级目录：

```
用户输入：
读取技能目录外的文件

系统调用：
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

系统回复：
Invalid path: cannot access files outside skill directory.
```

**原因**：这是安全限制，防止目录穿越攻击。

**解决**：只能访问技能目录内的文件，需要其他文件时，让 AI 直接使用 `Read` 工具。

### 陷阱 4：文件已存在于会话上下文

如果你已经加载了技能，文件内容可能在技能的 SKILL.md 或其他已注入内容中：

```
用户输入：
读取技能的核心文档

系统调用：
read_skill_file(skill="my-skill", filename="core-guide.md")
```

但这可能是不必要的，因为核心内容通常在 SKILL.md 中。

**解决**：先查看已加载技能的内容，确认是否需要额外文件。

## 本课小结

`read_skill_file` 工具让你安全地访问技能目录下的支持文件：

- **安全路径检查**：防止目录穿越，只允许访问技能目录内的文件
- **XML 注入机制**：文件内容以 `<skill-file>` XML 标签包装，包含元数据
- **错误友好**：文件不存在时列出可用文件，帮助你找到正确路径
- **命名空间支持**：可以用 `namespace:skill-name` 精确定位同名技能
- **上下文持久化**：通过 `synthetic: true` 标志，文件内容在会话压缩后仍可访问

这个工具非常适合读取技能的：
- 详细文档（`docs/` 目录）
- 配置示例（`config/` 目录）
- 代码示例（`examples/` 目录）
- README 和说明文件
- 脚本源码（如果需要查看实现）

## 下一课预告

> 下一课我们学习 **[Claude Code 技能兼容性](../../advanced/claude-code-compatibility/)**。
>
> 你会学到：
> - 了解插件如何兼容 Claude Code 的技能和插件系统
> - 理解工具映射机制（Claude Code 工具到 OpenCode 工具的转换）
> - 掌握从 Claude Code 安装位置发现技能的方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| ReadSkillFile 工具定义 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135)         | 74-135   |
| 路径安全检查 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133)    | 130-133  |
| 列出技能文件 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316  |
| resolveSkill 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283  |
| injectSyntheticContent 函数 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162  |

**关键类型**：
- `Skill`：技能元数据接口（`skills.ts:43-52`）
- `OpencodeClient`：OpenCode SDK 客户端类型（`utils.ts:140`）
- `SessionContext`：会话上下文，包含 model 和 agent 信息（`utils.ts:142-145`）

**关键函数**：
- `ReadSkillFile(directory: string, client: OpencodeClient)`：返回工具定义，处理技能文件读取
- `isPathSafe(basePath: string, requestedPath: string): boolean`：验证路径是否在基目录内，防止目录穿越
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`：列出技能目录下的所有文件（排除 SKILL.md）
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`：支持 `namespace:skill-name` 格式的技能解析
- `injectSyntheticContent(client, sessionID, text, context)`：通过 `noReply: true` 和 `synthetic: true` 注入内容到会话

**业务规则**：
- 路径安全检查使用 `path.resolve()` 验证，确保解析后的路径以基目录开头（`utils.ts:131-132`）
- 文件不存在时尝试 `fs.readdir()` 列出可用文件，提供友好的错误提示（`tools.ts:126-131`）
- 文件内容以 XML 格式包装，包含 `skill`、`file` 属性和 `<metadata>`、`<content>` 标签（`tools.ts:111-119`）
- 注入时获取当前会话的 model 和 agent 上下文，确保内容注入到正确的上下文（`tools.ts:121-122`）

**安全机制**：
- 目录穿越防护：`isPathSafe()` 检查路径是否在基目录内（`utils.ts:130-133`）
- 技能不存在时提供模糊匹配建议（`tools.ts:90-95`）
- 文件不存在时列出可用文件，帮助用户找到正确路径（`tools.ts:126-131`）

</details>
