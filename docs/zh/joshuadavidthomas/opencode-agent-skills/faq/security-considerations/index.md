---
title: "安全机制: 路径保护与验证 | opencode-agent-skills"
sidebarTitle: "安全机制"
subtitle: "安全机制: 路径保护与验证"
description: "了解 OpenCode Agent Skills 插件的安全机制。掌握路径保护、YAML 解析、输入验证和脚本执行保护等安全特性，安全使用技能插件。"
tags:
  - 安全
  - 最佳实践
  - FAQ
prerequisite: []
order: 2
---

# 安全性说明

## 学完你能做什么

- 了解插件如何保护你的系统免受安全威胁
- 知道技能文件需要遵循哪些安全规范
- 掌握使用插件时的安全最佳实践

## 核心思路

OpenCode Agent Skills 插件运行在你的本地环境中，会执行脚本、读取文件、解析配置。虽然它很强大，但如果技能文件来自不可信来源，也可能带来安全风险。

插件在设计时内置了多层安全机制，像一道道防护门，从路径访问、文件解析到脚本执行，层层把关。了解这些机制，可以帮助你更安全地使用插件。

## 安全机制详解

### 1. 路径安全检查：防止目录穿越

**问题**：如果技能文件包含恶意路径（如 `../../etc/passwd`），可能会访问系统敏感文件。

**防护措施**：

插件使用 `isPathSafe()` 函数（`src/utils.ts:130-133`）确保所有文件访问都限制在技能目录内：

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**工作原理**：
1. 将请求路径解析为绝对路径
2. 检查解析后的路径是否以技能目录开头
3. 如果路径尝试跳出技能目录（包含 `..`），直接拒绝

**实际案例**：

当 `read_skill_file` 工具读取文件时（`src/tools.ts:101-103`），会先调用 `isPathSafe`：

```typescript
// Security: ensure path doesn't escape skill directory
if (!isPathSafe(skill.path, args.filename)) {
  return `Invalid path: cannot access files outside skill directory.`;
}
```

这意味着：
- ✅ `docs/guide.md` → 允许（在技能目录内）
- ❌ `../../../etc/passwd` → 拒绝（尝试访问系统文件）
- ❌ `/etc/passwd` → 拒绝（绝对路径）

::: info 为什么这很重要
路径穿越攻击是 Web 应用的常见漏洞。即使插件运行在本地，不可信的技能也可能尝试访问你的 SSH 密钥、项目配置等敏感文件。
:::

### 2. YAML 安全解析：防止代码执行

**问题**：YAML 支持自定义标签和复杂对象，恶意 YAML 可能通过标签执行代码（如 `!!js/function`）。

**防护措施**：

插件使用 `parseYamlFrontmatter()` 函数（`src/utils.ts:41-49`），采用严格的 YAML 解析策略：

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Use core schema which only supports basic JSON-compatible types
      // This prevents custom tags that could execute code
      schema: "core",
      // Limit recursion depth to prevent DoS attacks
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**关键安全设置**：

| 设置          | 作用                                 |
| ------------- | ------------------------------------ |
| `schema: "core"` | 仅支持基本 JSON 类型（字符串、数字、布尔、数组、对象），禁用自定义标签 |
| `maxAliasCount: 100` | 限制 YAML 别名递归深度，防止 DoS 攻击 |

**实际案例**：

```yaml
# 恶意 YAML 示例（会被 core schema 拒绝）
---
!!js/function >
function () { return "malicious code" }
---

# 正确的安全格式
---
name: my-skill
description: A safe skill description
---
```

如果 YAML 解析失败，插件会静默忽略该技能，继续发现其他技能（`src/skills.ts:142-145`）：

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // 解析失败，跳过此技能
}
```

### 3. 输入验证：Zod Schema 严格检查

**问题**：技能的 frontmatter 字段可能不符合规范，导致插件行为异常。

**防护措施**：

插件使用 Zod Schema（`src/skills.ts:105-114`）对 frontmatter 进行严格验证：

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

**验证规则**：

| 字段        | 规则                                                              | 拒绝示例                         |
| ----------- | ----------------------------------------------------------------- | -------------------------------- |
| `name`      | 小写字母、数字、连字符，不能为空                                   | `MySkill`（大写）、`my skill`（空格） |
| `description` | 不能为空                                                         | `""`（空字符串）                    |
| `license`   | 可选的字符串                                                      | -                                |
| `allowed-tools` | 可选的字符串数组                                                | `[123]`（非字符串）                 |
| `metadata`   | 可选的 key-value 对象（值为字符串）                                 | `{key: 123}`（值非字符串）          |

**实际案例**：

```yaml
# ❌ 错误：name 包含大写字母
---
name: GitHelper
description: Git operations helper
---

# ✅ 正确：符合规范
---
name: git-helper
description: Git operations helper
---
```

如果验证失败，插件会跳过该技能（`src/skills.ts:147-152`）：

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // 验证失败，跳过此技能
}
```

### 4. 脚本执行安全：仅执行可执行文件

**问题**：如果插件执行任意文件（如配置文件、文档），可能造成意外后果。

**防护措施**：

插件在发现脚本时（`src/skills.ts:59-99`），只收集有可执行权限的文件：

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... 递归遍历逻辑 ...

  if (stats.isFile()) {
    // 关键：只收集有可执行位的文件
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**安全特性**：

| 检查机制         | 作用                                                              |
| ---------------- | ----------------------------------------------------------------- |
| **可执行位检查** (`stats.mode & 0o111`) | 只执行用户明确标记为可执行的文件，防止误执行文档或配置          |
| **跳过隐藏目录** (`entry.name.startsWith('.')`) | 不扫描 `.git`、`.vscode` 等隐藏目录，避免扫描过多文件          |
| **跳过依赖目录** (`skipDirs.has(entry.name)`) | 跳过 `node_modules`、`__pycache__` 等，避免扫描第三方依赖      |
| **递归深度限制** (`maxDepth: 10`) | 限制递归深度为 10 层，防止恶意技能的深层目录导致性能问题 |

**实际案例**：

在技能目录中：

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ 可执行（被识别为脚本）
├── build.sh           # ✓ 可执行（被识别为脚本）
├── README.md          # ✗ 不可执行（不会被识别为脚本）
├── config.json        # ✗ 不可执行（不会被识别为脚本）
└── node_modules/      # ✗ 跳过（依赖目录）
    └── ...           # ✗ 跳过
```

如果调用 `run_skill_script("my-skill", "README.md")`，会因为 README.md 没有可执行权限未被识别为脚本（`src/skills.ts:86`），从而返回"未找到"错误（`src/tools.ts:165-177`）。

## 安全最佳实践

### 1. 从可信来源获取技能

- ✓ 使用官方技能仓库或可信赖的开发者
- ✓ 检查技能的 GitHub Star 数和贡献者活动
- ✗ 不要随意下载运行来路不明的技能

### 2. 审查技能内容

加载新技能前，快速浏览 SKILL.md 和脚本文件：

```bash
# 查看技能描述和元数据
cat .opencode/skills/skill-name/SKILL.md

# 检查脚本内容
cat .opencode/skills/skill-name/scripts/*.sh
```

特别注意：
- 脚本是否访问系统敏感路径（`/etc`、`~/.ssh`）
- 脚本是否安装外部依赖
- 脚本是否修改系统配置

### 3. 正确设置脚本权限

只有明确需要执行的文件才添加可执行权限：

```bash
# 正确：为脚本添加可执行权限
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# 正确：文档保持默认权限（不可执行）
# README.md、config.json 等不需要执行
```

### 4. 隐藏敏感文件

技能目录中不要包含敏感信息：

- ✗ `.env` 文件（API 密钥）
- ✗ `.pem` 文件（私钥）
- ✗ `credentials.json`（凭证）
- ✓ 使用环境变量或外部配置管理敏感数据

### 5. 项目级技能覆盖用户级技能

技能发现优先级（`src/skills.ts:241-246`）：

1. `.opencode/skills/`（项目级）
2. `.claude/skills/`（项目级，Claude）
3. `~/.config/opencode/skills/`（用户级）
4. `~/.claude/skills/`（用户级，Claude）
5. `~/.claude/plugins/cache/`（插件缓存）
6. `~/.claude/plugins/marketplaces/`（插件市场）

**最佳实践**：

- 项目特定技能放在 `.opencode/skills/`，会自动覆盖同名用户级技能
- 通用技能放在 `~/.config/opencode/skills/`，所有项目可用
- 不推荐全局安装来自不可信来源的技能

## 本课小结

OpenCode Agent Skills 插件内置了多层安全防护：

| 安全机制         | 防护目标                           | 代码位置               |
| ---------------- | ---------------------------------- | ---------------------- |
| 路径安全检查     | 防止目录穿越，限制文件访问范围       | `utils.ts:130-133`     |
| YAML 安全解析     | 防止恶意 YAML 执行代码              | `utils.ts:41-49`       |
| Zod Schema 验证 | 确保技能 frontmatter 符合规范        | `skills.ts:105-114`    |
| 脚本可执行检查   | 只执行用户明确标记为可执行的文件       | `skills.ts:86`         |
| 目录跳过逻辑     | 避免扫描隐藏目录和依赖目录          | `skills.ts:61, 70`     |

记住：安全是共同责任。插件提供了防护机制，但最终决定权在你手中——只使用可信来源的技能，养成审查代码的习惯。

## 下一课预告

> 下一课我们学习 **[技能开发最佳实践](../../appendix/best-practices/)**。
>
> 你会看到：
> - 命名规范和描述编写技巧
> - 目录组织和脚本使用方法
> - Frontmatter 最佳实践
> - 避免常见错误的方法

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 安全机制         | 文件路径                                                                 | 行号    |
| ---------------- | ------------------------------------------------------------------------- | ------- |
| 路径安全检查     | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133)         | 130-133 |
| YAML 安全解析     | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56)           | 41-56   |
| Zod Schema 验证 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114)         | 105-114 |
| 脚本可执行检查   | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86)             | 86      |
| 目录跳过逻辑     | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70)             | 61, 70  |
| 工具中的路径安全 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103)          | 101-103 |

**关键函数**：
- `isPathSafe(basePath, requestedPath)`：验证路径是否安全，防止目录穿越
- `parseYamlFrontmatter(text)`：安全解析 YAML，使用 core schema 和递归限制
- `SkillFrontmatterSchema`：Zod schema，验证技能 frontmatter 字段
- `findScripts(skillPath, maxDepth)`：递归查找可执行脚本，跳过隐藏和依赖目录

**关键常量**：
- `maxAliasCount: 100`：YAML 解析的最大别名数，防止 DoS 攻击
- `maxDepth: 10`：脚本发现的最大递归深度
- `0o111`：可执行位掩码（检查文件是否可执行）

</details>
