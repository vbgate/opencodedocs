---
title: "包管理器配置: 自动检测 | Everything Claude Code"
sidebarTitle: "统一项目命令"
subtitle: "包管理器配置: 自动检测 | Everything Claude Code"
description: "学习包管理器自动检测配置方法。掌握 6 层优先级机制，支持 npm/pnpm/yarn/bun，统一多项目命令。"
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# 包管理器配置：自动化检测与自定义

## 学完你能做什么

- ✅ 自动检测当前项目使用的包管理器（npm/pnpm/yarn/bun）
- ✅ 理解 6 层检测优先级机制
- ✅ 在全局和项目级别配置包管理器
- ✅ 使用 `/setup-pm` 命令快速设置
- ✅ 处理多项目环境下不同包管理器的场景

## 你现在的困境

你的项目越来越多，有的用 npm，有的用 pnpm，还有的用 yarn 或 bun。每次在 Claude Code 中输入命令时，你都要回忆：

- 这个项目用 `npm install` 还是 `pnpm install`？
- 要用 `npx`、`pnpm dlx` 还是 `bunx`？
- 脚本是用 `npm run dev`、`pnpm dev` 还是 `bun run dev`？

记错一次，命令就报错，浪费时间。

## 什么时候用这一招

- **新项目启动时**：确定使用哪个包管理器后立即配置
- **切换项目时**：验证当前检测是否正确
- **团队协作时**：确保所有成员使用同一命令风格
- **多包管理器环境**：全局配置 + 项目覆盖，灵活管理

::: tip 为什么需要配置包管理器？
Everything Claude Code 的 hooks 和 agents 会自动生成包管理器相关的命令。如果检测错误，所有命令都会使用错误的工具，导致操作失败。
:::

## 🎒 开始前的准备

::: warning 前置检查
开始本课之前，请确保已完成 [安装指南](../installation/)，插件已正确安装到 Claude Code。
:::

检查一下你的系统是否已安装包管理器：

```bash
# 检查已安装的包管理器
which npm pnpm yarn bun

# 或在 Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

如果你看到类似输出，说明已安装：

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

如果某个包管理器未找到，需要先安装（本课不涵盖安装教程）。

## 核心思路

Everything Claude Code 使用**智能检测机制**，按 6 层优先级自动选择包管理器。你只需要在最合适的地方配置一次，它就能在所有场景下正确工作。

### 检测优先级（从高到低）

```
1. 环境变量 CLAUDE_PACKAGE_MANAGER  ─── 最高优先级，临时覆盖
2. 项目配置 .claude/package-manager.json  ─── 项目级覆盖
3. package.json 的 packageManager 字段  ─── 项目规范
4. Lock 文件（pnpm-lock.yaml 等）  ─── 自动检测
5. 全局配置 ~/.claude/package-manager.json  ─── 全局默认
6. Fallback：按顺序找第一个可用的  ─── 兜底方案
```

### 为什么用这个顺序？

- **环境变量最高**：方便临时切换（如 CI/CD 环境）
- **项目配置其次**：同一项目强制统一
- **package.json 字段**：这是 Node.js 的标准规范
- **Lock 文件**：项目实际使用的文件
- **全局配置**：个人默认偏好
- **Fallback**：确保永远有可用的工具

## 跟我做

### 第 1 步：检测当前设置

**为什么**
先了解当前的检测情况，确认是否需要手动配置。

```bash
# 检测当前包管理器
node scripts/setup-package-manager.js --detect
```

**你应该看到**：

```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

如果显示的包管理器和你预期的一致，说明检测正确，无需手动配置。

### 第 2 步：配置全局默认包管理器

**为什么**
为你的所有项目设置一个全局默认，减少重复配置。

```bash
# 设置全局默认为 pnpm
node scripts/setup-package-manager.js --global pnpm
```

**你应该看到**：

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

检查生成的配置文件：

```bash
cat ~/.claude/package-manager.json
```

**你应该看到**：

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

### 第 3 步：配置项目级包管理器

**为什么**
某些项目可能需要使用特定包管理器（如依赖特定功能），项目级配置会覆盖全局设置。

```bash
# 为当前项目设置 bun
node scripts/setup-package-manager.js --project bun
```

**你应该看到**：

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

检查生成的配置文件：

```bash
cat .claude/package-manager.json
```

**你应该看到**：

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip 项目级 vs 全局配置
- **全局配置**：~/.claude/package-manager.json，影响所有项目
- **项目配置**：.claude/package-manager.json，只影响当前项目，优先级更高
:::

### 第 4 步：使用 /setup-pm 命令（可选）

**为什么**
如果你不想手动运行脚本，可以直接在 Claude Code 中使用斜杠命令。

在 Claude Code 中输入：

```
/setup-pm
```

Claude Code 会调用脚本并展示交互式选项。

**你应该看到**类似的检测输出：

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```

### 第 5 步：验证检测逻辑

**为什么**
理解检测优先级后，你可以预测不同情况下的结果。

让我们测试几种场景：

**场景 1：Lock 文件检测**

```bash
# 删除项目配置
rm .claude/package-manager.json

# 检测
node scripts/setup-package-manager.js --detect
```

**你应该看到** `Source: lock-file`（如果存在 lock 文件）

**场景 2：package.json 字段**

```bash
# 在 package.json 中添加
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# 检测
node scripts/setup-package-manager.js --detect
```

**你应该看到** `From package.json: pnpm@8.6.0`

**场景 3：环境变量覆盖**

```bash
# 临时设置环境变量
export CLAUDE_PACKAGE_MANAGER=yarn

# 检测
node scripts/setup-package-manager.js --detect
```

**你应该看到** `Source: environment` 和 `Package Manager: yarn`

```bash
# 清除环境变量
unset CLAUDE_PACKAGE_MANAGER
```

## 检查点 ✅

确保以下检查点都通过：

- [ ] 运行 `--detect` 命令能正确识别当前包管理器
- [ ] 全局配置文件已创建：`~/.claude/package-manager.json`
- [ ] 项目配置文件已创建（如需要）：`.claude/package-manager.json`
- [ ] 不同优先级的覆盖关系符合预期
- [ ] 列出的可用包管理器与实际安装的一致

## 踩坑提醒

### ❌ 错误 1：设置了配置但未生效

**现象**：明明配置了 `pnpm`，检测却显示 `npm`。

**原因**：
- Lock 文件优先级高于全局配置（如果存在 lock 文件）
- package.json 的 `packageManager` 字段优先级也高于全局配置

**解决**：
```bash
# 检查检测来源
node scripts/setup-package-manager.js --detect

# 如果是 lock file 或 package.json，检查这些文件
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ 错误 2：配置了不存在的包管理器

**现象**：配置了 `bun`，但系统未安装。

**检测结果**会显示：

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← 注意：虽然标记为 current，但未安装
```

**解决**：先安装包管理器，或配置其他已安装的。

```bash
# 检测可用的包管理器
node scripts/setup-package-manager.js --list

# 切换到已安装的
node scripts/setup-package-manager.js --global npm
```

### ❌ 错误 3：Windows 路径问题

**现象**：Windows 上运行脚本报错找不到文件。

**原因**：Node.js 脚本路径分隔符问题（源码已处理，但需确保使用正确的命令）。

**解决**：使用 PowerShell 或 Git Bash，确保路径正确：

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ 错误 4：项目配置影响其他项目

**现象**：项目 A 配置了 `bun`，切换到项目 B 后仍然使用 `bun`。

**原因**：项目配置只在当前项目目录生效，切换目录后会重新检测。

**解决**：这是正常行为。项目配置仅影响当前项目，不会污染其他项目。

## 本课小结

Everything Claude Code 的包管理器检测机制非常智能：

- **6 层优先级**：环境变量 > 项目配置 > package.json > lock 文件 > 全局配置 > fallback
- **灵活配置**：支持全局默认和项目覆盖
- **自动检测**：大多数情况下无需手动配置
- **命令统一**：配置后，所有 hooks 和 agents 都会使用正确的命令

**推荐配置策略**：

1. 全局设置你最常用的包管理器（如 `pnpm`）
2. 特殊项目在项目级别覆盖（如依赖 `bun` 的性能）
3. 让自动检测处理其他情况

## 下一课预告

> 下一课我们学习 **[MCP 服务器配置](../mcp-setup/)**。
>
> 你会学到：
> - 如何配置 15+ 个预置的 MCP 服务器
> - MCP 服务器如何扩展 Claude Code 的能力
> - 如何管理 MCP 服务器的启用状态和 Token 使用

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能                    | 文件路径                                                                                      | 行号    |
|--- | --- | ---|
| 包管理器检测核心逻辑     | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236)         | 157-236 |
| Lock 文件检测          | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102)          | 92-102  |
| package.json 检测      | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126)          | 107-126 |
| 包管理器定义（配置）    | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54)           | 13-54   |
| 检测优先级定义          | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57)                | 57      |
| 全局配置保存            | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252)         | 241-252 |
| 项目配置保存            | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272)         | 257-272 |
| 命令行脚本入口          | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206)   | 158-206 |
| 检测命令实现            | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95)    | 62-95   |
|--- | --- | ---|

**关键常量**：
- `PACKAGE_MANAGERS`：支持的包管理器及其命令配置（第 13-54 行）
- `DETECTION_PRIORITY`：检测优先级顺序 `['pnpm', 'bun', 'yarn', 'npm']`（第 57 行）

**关键函数**：
- `getPackageManager()`：核心检测逻辑，按优先级返回包管理器（第 157-236 行）
- `detectFromLockFile()`：从 lock 文件检测包管理器（第 92-102 行）
- `detectFromPackageJson()`：从 package.json 检测包管理器（第 107-126 行）
- `setPreferredPackageManager()`：保存全局配置（第 241-252 行）
- `setProjectPackageManager()`：保存项目配置（第 257-272 行）

**检测优先级实现**（源码第 157-236 行）：
```javascript
function getPackageManager(options = {}) {
  // 1. 环境变量（最高优先级）
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. 项目配置
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. package.json 字段
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Lock 文件
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. 全局配置
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback：按优先级找第一个可用的
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // 默认 npm
  return { name: 'npm', source: 'default' };
}
```

</details>
