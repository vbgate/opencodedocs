---
title: "API 参考: 命令与类型 | Agent Skills"
sidebarTitle: "查命令和类型"
subtitle: "API 参考: 命令与类型"
description: "查阅 Agent Skills 的构建命令和类型定义。包含 pnpm 工具链、TypeScript 接口、SKILL.md 模板和 Impact 枚举值。"
tags:
  - "参考"
  - "API"
  - "命令行"
  - "类型定义"
order: 120
prerequisite: []
---

# API 和命令参考

本页提供 Agent Skills 的完整 API 和命令参考，包括构建工具链命令、TypeScript 类型定义、SKILL.md 模板格式和影响级别枚举值。

## TypeScript 类型定义

### ImpactLevel（影响级别）

影响级别用于标识规则的性能影响程度，有 6 个级别：

| 值            | 说明       | 适用场景                                                         |
| ------------- | ---------- | ---------------------------------------------------------------- |
| `CRITICAL`    | 关键瓶颈   | 必须修复，否则严重影响用户体验（如瀑布式请求、未优化的打包体积） |
| `HIGH`        | 重要改进   | 显著提升性能（如服务端缓存、重复 props 消除）                    |
| `MEDIUM-HIGH` | 中高优先级 | 明显性能提升（如数据获取优化）                                   |
| `MEDIUM`      | 中等改进   | 可衡量性能提升（如 Memo 优化、减少 Re-render）                   |
| `LOW-MEDIUM`  | 低中优先级 | 轻微性能提升（如渲染优化）                                       |
| `LOW`         | 增量改进   | 微优化（如代码风格、高级模式）                                   |

**源码位置**：`types.ts:5`

### CodeExample（代码示例）

规则中的代码示例结构：

| 字段             | 类型   | 必填 | 说明                                  |
| ---------------- | ------ | ---- | ------------------------------------- |
| `label`          | string | ✅    | 示例标签（如 "Incorrect"、"Correct"） |
| `description`    | string | ❌    | 标签描述（可选）                      |
| `code`           | string | ✅    | 代码内容                              |
| `language`       | string | ❌    | 代码语言（默认 'typescript'）         |
| `additionalText` | string | ❌    | 补充说明（可选）                      |

**源码位置**：`types.ts:7-13`

### Rule（规则）

单条性能优化规则的完整结构：

| 字段                | 类型          | 必填 | 说明                                 |
| ------------------- | ------------- | ---- | ------------------------------------ |
| `id`                | string        | ✅    | 规则 ID（自动生成，如 "1.1"、"2.3"） |
| `title`             | string        | ✅    | 规则标题                             |
| `section`           | number        | ✅    | 所属章节（1-8）                      |
| `subsection`        | number        | ❌    | 子章节序号（自动生成）               |
| `impact`            | ImpactLevel   | ✅    | 影响级别                             |
| `impactDescription` | string        | ❌    | 影响描述（如 "2-10× improvement"）   |
| `explanation`       | string        | ✅    | 规则说明                             |
| `examples`          | CodeExample[] | ✅    | 代码示例数组（至少 1 个）            |
| `references`        | string[]      | ❌    | 参考链接                             |
| `tags`              | string[]      | ❌    | 标签（用于搜索）                     |

**源码位置**：`types.ts:15-26`

### Section（章节）

规则章节结构：

| 字段                | 类型        | 必填 | 说明           |
| ------------------- | ----------- | ---- | -------------- |
| `number`            | number      | ✅    | 章节号（1-8）  |
| `title`             | string      | ✅    | 章节标题       |
| `impact`            | ImpactLevel | ✅    | 整体影响级别   |
| `impactDescription` | string      | ❌    | 影响描述       |
| `introduction`      | string      | ❌    | 章节简介       |
| `rules`             | Rule[]      | ✅    | 包含的规则数组 |

**源码位置**：`types.ts:28-35`

### GuidelinesDocument（指南文档）

完整的指南文档结构：

| 字段           | 类型      | 必填 | 说明     |
| -------------- | --------- | ---- | -------- |
| `version`      | string    | ✅    | 版本号   |
| `organization` | string    | ✅    | 组织名称 |
| `date`         | string    | ✅    | 日期     |
| `abstract`     | string    | ✅    | 摘要     |
| `sections`     | Section[] | ✅    | 章节数组 |
| `references`   | string[]  | ❌    | 参考文献 |

**源码位置**：`types.ts:37-44`

### TestCase（测试用例）

从规则中提取的测试用例结构：

| 字段          | 类型            | 必填 | 说明         |
| ------------- | --------------- | ---- | ------------ |
| `ruleId`      | string          | ✅    | 规则 ID      |
| `ruleTitle`   | string          | ✅    | 规则标题     |
| `type`        | 'bad' \| 'good' | ✅    | 测试用例类型 |
| `code`        | string          | ✅    | 代码内容     |
| `language`    | string          | ✅    | 代码语言     |
| `description` | string          | ❌    | 描述         |

**源码位置**：`types.ts:46-53`

## 构建工具链命令

### pnpm build

构建规则文档并提取测试用例。

**命令**：
```bash
pnpm build
```

**功能**：
1. 解析所有规则文件（`rules/*.md`）
2. 按章节分组并排序
3. 生成 `AGENTS.md` 完整指南
4. 提取测试用例到 `test-cases.json`

**输出**：
```bash
Processed 57 rules
Generated AGENTS.md
Extracted 114 test cases
```

**源码位置**：`build.ts`

### pnpm build --upgrade-version

构建并自动升级版本号。

**命令**：
```bash
pnpm build --upgrade-version
```

**功能**：
1. 执行 `pnpm build` 的所有操作
2. 自动递增 `metadata.json` 中的版本号
   - 格式：`0.1.0` → `0.1.1`
   - 递增最后一位数字

**源码位置**：`build.ts:19-24, 255-273`

### pnpm validate

验证所有规则文件的格式和完整性。

**命令**：
```bash
pnpm validate
```

**检查项**：
- ✅ 规则标题非空
- ✅ 规则说明非空
- ✅ 至少包含一个代码示例
- ✅ 包含 Bad/Incorrect 和 Good/Correct 示例
- ✅ Impact 级别合法（CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW）

**成功输出**：
```bash
✓ All 57 rules are valid
```

**失败输出**：
```bash
✗ Validation failed

✖ [async-parallel.md]: Missing or empty title
   rules/async-parallel.md:2

2 errors found
```

**源码位置**：`validate.ts`

### pnpm extract-tests

从规则中提取测试用例。

**命令**：
```bash
pnpm extract-tests
```

**功能**：
1. 读取所有规则文件
2. 提取 `Bad/Incorrect` 和 `Good/Correct` 示例
3. 生成 `test-cases.json` 文件

**输出**：
```bash
Extracted 114 test cases (57 bad, 57 good)
```

**源码位置**：`extract-tests.ts`

### pnpm dev

开发流程（构建 + 验证）。

**命令**：
```bash
pnpm dev
```

**功能**：
1. 执行 `pnpm build`
2. 执行 `pnpm validate`
3. 在开发时确保规则格式正确

**适用场景**：
- 编写新规则后验证
- 修改规则后检查完整性

**源码位置**：`package.json:12`

## SKILL.md 模板

### Claude.ai Skill 定义模板

每个 Claude.ai Skill 必须包含 `SKILL.md` 文件：

```markdown
---
name: {skill-name}
description: {One sentence describing when to use this skill. Include trigger phrases like "Deploy my app", "Check logs", etc.}
---

# {Skill Title}

{Brief description of what the skill does.}

## How It Works

{Numbered list explaining the skill's workflow}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - Description (defaults to X)

**Examples:**
{Show 2-3 common usage patterns}

## Output

{Show example output users will see}

## Present Results to User

{Template for how Claude should format results when presenting to users}

## Troubleshooting

{Common issues and solutions, especially network/permissions errors}
```

**源码位置**：`AGENTS.md:29-69`

### 必填字段说明

| 字段                      | 说明                   | 示例                                                               |
| ------------------------- | ---------------------- | ------------------------------------------------------------------ |
| `name`                    | Skill 名称（目录名）   | `vercel-deploy`                                                    |
| `description`             | 单句描述，包含触发短语 | `Deploy applications to Vercel when user requests "Deploy my app"` |
| `title`                   | Skill 标题             | `Vercel Deploy`                                                    |
| `How It Works`            | 工作流程说明           | 编号列表，解释 4-6 个步骤                                          |
| `Usage`                   | 使用方法               | 包含命令行示例和参数说明                                           |
| `Output`                  | 输出示例               | 展示用户看到的输出结果                                             |
| `Present Results to User` | 结果格式化模板         | Claude 展示结果的标准格式                                          |

**源码位置**：`skills/claude.ai/vercel-deploy-claimable/SKILL.md`

## Impact 级别映射规则

### 规则文件名前缀 → 章节 → 级别

| 文件前缀     | 章节号 | 章节标题        | 默认级别    |
| ------------ | ------ | --------------- | ----------- |
| `async-`     | 1      | 消除瀑布        | CRITICAL    |
| `bundle-`    | 2      | 打包优化        | CRITICAL    |
| `server-`    | 3      | 服务端性能      | HIGH        |
| `client-`    | 4      | 客户端数据获取  | MEDIUM-HIGH |
| `rerender-`  | 5      | Re-render 优化  | MEDIUM      |
| `rendering-` | 6      | 渲染性能        | MEDIUM      |
| `js-`        | 7      | JavaScript 性能 | LOW-MEDIUM  |
| `advanced-`  | 8      | 高级模式        | LOW         |

### 示例文件

| 文件名                      | 自动推断的章节      | 自动推断的级别 |
| --------------------------- | ------------------- | -------------- |
| `async-parallel.md`         | 1（消除瀑布）       | CRITICAL       |
| `bundle-dynamic-imports.md` | 2（打包优化）       | CRITICAL       |
| `server-cache-react.md`     | 3（服务端性能）     | HIGH           |
| `rerender-memo.md`          | 5（Re-render 优化） | MEDIUM         |

**源码位置**：`parser.ts:201-210`

## 部署命令参考

### bash deploy.sh [path]

Vercel 部署脚本命令。

**命令**：
```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**参数**：
- `path` - 部署目录或 `.tgz` 文件（默认当前目录）

**示例**：
```bash
# 部署当前目录
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh

# 部署指定项目
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project

# 部署已有 tarball
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project.tgz
```

**输出格式**：
- **人类可读**（stderr）：预览 URL 和所有权转移链接
- **JSON**（stdout）：结构化数据（包含 deploymentId、projectId）

**源码位置**：`skills/claude.ai/vercel-deploy-claimable/SKILL.md:20-65`

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能                    | 文件路径                                                                                                                                                                   | 行号    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| ImpactLevel 类型        | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5)            | 5       |
| CodeExample 接口        | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13)        | 7-13    |
| Rule 接口               | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L15-L26)       | 15-26   |
| Section 接口            | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L28-L35)       | 28-35   |
| GuidelinesDocument 接口 | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L37-L44)       | 37-44   |
| TestCase 接口           | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L46-L53)       | 46-53   |
| build.ts 命令行参数     | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L12-L14)       | 12-14   |
| 构建脚本版本升级逻辑    | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L19-L24)       | 19-24   |
| validate.ts 验证逻辑    | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66) | 21-66   |
| 规则模板文件            | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md)                   | 全文    |
| SKILL.md 模板格式       | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L31-L69)                                                                                     | 31-69   |
| Vercel Deploy SKILL     | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md)             | 全文    |
| 文件前缀映射            | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts#L201-L210)   | 201-210 |

**关键常量**：
- `ImpactLevel` 枚举：`'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**关键函数**：
- `incrementVersion(version: string)`：递增版本号（build.ts）
- `generateMarkdown(sections, metadata)`：生成 AGENTS.md（build.ts）
- `validateRule(rule, file)`：验证规则完整性（validate.ts）

</details>
