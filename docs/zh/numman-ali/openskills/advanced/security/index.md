---
title: "安全防护: 路径遍历与符号链接 | OpenSkills"
sidebarTitle: "防止路径遍历"
subtitle: "安全防护: 路径遍历与符号链接 | OpenSkills"
description: "学习 OpenSkills 的三层安全防护机制。了解路径遍历防护、符号链接安全处理、YAML 解析安全，确保技能安装和使用的安全性。"
tags:
  - "安全性"
  - "路径遍历"
  - "符号链接"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# OpenSkills 安全性说明

## 学完你能做什么

- 理解 OpenSkills 的三层安全防护机制
- 了解路径遍历攻击的原理和防护方法
- 掌握符号链接的安全处理方式
- 认识 YAML 解析中的 ReDoS 风险及防护措施

## 你现在的困境

你可能听过"本地运行更安全"的说法，但不清楚具体有哪些安全防护措施。或者你在安装技能时担心：
- 会不会把文件写到系统目录里？
- 符号链接会不会带来安全风险？
- 解析 SKILL.md 的 YAML 时会不会有漏洞？

## 什么时候用这一招

当你需要：
- 在企业环境中部署 OpenSkills
- 审计 OpenSkills 的安全性
- 从安全角度评估技能管理方案
- 对抗安全团队的技术审查

## 核心思路

OpenSkills 的安全设计遵循三个原则：

::: info 三层安全防护
1. **输入验证** - 检查所有外部输入（路径、URL、YAML）
2. **隔离执行** - 确保操作在预期目录内
3. **安全解析** - 防止解析器漏洞（ReDoS）
:::

本地运行 + 无数据上传 + 输入验证 + 路径隔离 = 安全的技能管理

## 路径遍历防护

### 什么是路径遍历攻击

**路径遍历（Path Traversal）**攻击是指攻击者通过使用 `../` 等序列访问预期目录之外的文件。

**示例**：如果不加防护，攻击者可能尝试：
```bash
# 试图安装到系统目录
openskills install malicious/skill --target ../../../etc/

# 试图覆盖配置文件
openskills install malicious/skill --target ../../../../.ssh/
```

### OpenSkills 的防护机制

OpenSkills 使用 `isPathInside` 函数验证安装路径必须在目标目录内。

**源码位置**：[`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**工作原理**：
1. 使用 `resolve()` 解析所有相对路径为绝对路径
2. 规范化目标目录，确保以路径分隔符结尾
3. 检查目标路径是否以目标目录开头

**安装时验证**（[`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)）：
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### 验证防护效果

**测试场景**：尝试路径遍历攻击

```bash
# 正常安装（成功）
openskills install anthropics/skills

# 尝试使用 ../ （失败）
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**你应该看到**：任何试图跳出目标目录的安装都会被拒绝，显示安全错误。

## 符号链接安全

### 符号链接的风险

**符号链接（Symlink）**是指向其他文件或目录的快捷方式。如果处理不当，可能导致：

1. **信息泄露** - 攻击者创建指向敏感文件的符号链接
2. **文件覆盖** - 符号链接指向系统文件，被安装操作覆盖
3. **循环引用** - 符号链接指向自身，导致无限递归

### 安装时的解引用

OpenSkills 在复制文件时使用 `dereference: true` 解引用符号链接，直接复制目标文件。

**源码位置**：[`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**作用**：
- 符号链接被替换为实际文件
- 不会复制符号链接本身
- 避免符号链接指向的文件被覆盖

### 查找技能时的符号链接检查

OpenSkills 支持符号链接形式的技能，但会检查是否损坏。

**源码位置**：[`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync follows symlinks
      return stats.isDirectory();
    } catch {
      // Broken symlink or permission error
      return false;
    }
  }
  return false;
}
```

**安全特性**：
- 使用 `statSync()` 跟随符号链接检查目标
- 损坏的符号链接会被跳过（`catch` 块）
- 不崩溃，静默处理

::: tip 使用场景
符号链接支持可以让你：
- 从 git 仓库直接使用技能（无需复制）
- 在本地开发时同步修改
- 多个项目共享技能库
:::

## YAML 解析安全

### ReDoS 风险

**正则表达式拒绝服务（ReDoS）**是指恶意构造的输入导致正则表达式指数级匹配时间，消耗 CPU 资源。

OpenSkills 需要解析 SKILL.md 的 YAML frontmatter：
```yaml
---
name: skill-name
description: Skill description
---
```

### 非贪婪正则防护

OpenSkills 使用非贪婪正则表达式避免 ReDoS。

**源码位置**：[`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**关键点**：
- `+?` 是**非贪婪**量词，匹配最短可能
- `^` 和 `$` 锁定行首行尾
- 只匹配单行，避免复杂嵌套

**错误示例（贪婪匹配）**：
```typescript
// ❌ 危险：+ 会贪婪匹配，可能遇到回溯爆炸
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**正确示例（非贪婪匹配）**：
```typescript
// ✅ 安全：+? 非贪婪，遇到第一个换行符就停止
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## 文件权限与源验证

### 继承系统权限

OpenSkills 不管理文件权限，直接继承操作系统的权限控制：

- 文件归属者与运行 OpenSkills 的用户相同
- 目录权限遵循系统 umask 设置
- 权限管理由文件系统统一控制

### 私有仓库的源验证

从私有 git 仓库安装时，OpenSkills 依赖 git 的 SSH 密钥验证。

**源码位置**：[`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip 建议
确保你的 SSH 密钥配置正确，并已添加到 git 服务器的授权密钥列表中。
:::

## 本地运行的安全性

OpenSkills 是纯本地工具，不涉及网络通信（除了克隆 git 仓库）：

### 无数据上传

| 操作 | 数据流向 |
| ---- | -------- |
| 安装技能 | Git 仓库 → 本地 |
| 读取技能 | 本地 → 标准输出 |
| 同步 AGENTS.md | 本地 → 本地文件 |
| 更新技能 | Git 仓库 → 本地 |

### 隐私保护

- 所有技能文件存储在本地
- AI 代理通过本地文件系统读取
- 无云端依赖或遥测收集

::: info 与 Marketplace 的区别
OpenSkills 不依赖 Anthropic Marketplace，完全本地运行。
:::

## 本课小结

OpenSkills 的三层安全防护：

| 安全层级 | 防护措施 | 源码位置 |
| -------- | -------- | -------- |
| **路径遍历防护** | `isPathInside()` 验证路径在目标目录内 | `install.ts:71-78` |
| **符号链接安全** | `dereference: true` 解引用符号链接 | `install.ts:262` |
| **YAML 解析安全** | 非贪婪正则 `+?` 防止 ReDoS | `yaml.ts:4` |

**记住**：
- 路径遍历攻击通过 `../` 序列访问预期目录外的文件
- 符号链接需要解引用或检查，避免信息泄露和文件覆盖
- YAML 解析使用非贪婪正则避免 ReDoS
- 本地运行 + 无数据上传 = 更高的隐私安全

## 下一课预告

> 下一课我们学习 **[最佳实践](../best-practices/)**。
>
> 你会学到：
> - 项目配置的最佳实践
> - 技能管理的团队协作方案
> - 多代理环境的使用技巧
> - 常见陷阱和避免方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能          | 文件路径                                                                                     | 行号     |
| ------------- | -------------------------------------------------------------------------------------------- | -------- |
| 路径遍历防护   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78    |
| 安装路径检查   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260  |
| 符号链接解引用 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262      |
| 更新路径检查   | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172  |
| 符号链接检查   | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25    |
| YAML 解析安全  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4        |

**关键函数**：
- `isPathInside(targetPath, targetDir)`：验证目标路径是否在目标目录内（防止路径遍历）
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`：检查目录或符号链接是否指向目录
- `extractYamlField(content, field)`：使用非贪婪正则提取 YAML 字段（防止 ReDoS）

**更新日志**：
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - v1.5.0 安全更新说明

</details>
