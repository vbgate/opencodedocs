---
title: "故障排查: Hooks 问题 | everything-claude-code"
sidebarTitle: "Hooks 问题 5 分钟修复"
subtitle: "故障排查: Hooks 问题 | everything-claude-code"
description: "学习 Hooks 故障排查方法。系统化诊断环境变量、权限、JSON 语法等问题，确保 SessionStart/End、PreToolUse 正常运行。"
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# Hooks 不工作怎么办

## 你遇到的问题

配置了 Hooks，但发现它们没有按预期工作？你可能会遇到以下情况：

- Dev server 没有被阻止在 tmux 外运行
- 没有看到 SessionStart 或 SessionEnd 的日志
- Prettier 自动格式化没有生效
- TypeScript 检查没有运行
- 看到奇怪的错误消息

别担心，这些问题通常都有明确的解决方法。本课帮你系统地排查和修复 Hooks 相关问题。

## 🎒 开始前的准备

::: warning 前置检查
确保你已经：
1. ✅ 完成了 Everything Claude Code 的[安装](../../start/installation/)
2. ✅ 了解 [Hooks 自动化](../../advanced/hooks-automation/)的基本概念
3. ✅ 阅读过项目 README 中的 Hooks 配置说明
:::

---

## 常见问题 1：Hooks 完全不触发

### 症状
执行命令后，看不到任何 `[Hook]` 日志输出，Hooks 似乎完全没有被调用。

### 可能原因

#### 原因 A：hooks.json 路径错误

**问题**：`hooks.json` 没有放在正确的位置，Claude Code 找不到配置文件。

**解决方案**：

检查 `hooks.json` 的位置是否正确：

```bash
# 应该在以下位置之一：
~/.claude/hooks/hooks.json              # 用户级配置（全局）
.claude/hooks/hooks.json                 # 项目级配置
```

**检查方法**：

```bash
# 查看用户级配置
ls -la ~/.claude/hooks/hooks.json

# 查看项目级配置
ls -la .claude/hooks/hooks.json
```

**如果文件不存在**，从 Everything Claude Code 插件目录复制：

```bash
# 假设插件安装在 ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### 原因 B：JSON 语法错误

**问题**：`hooks.json` 有语法错误，导致 Claude Code 无法解析。

**解决方案**：

验证 JSON 格式：

```bash
# 使用 jq 或 Python 验证 JSON 语法
jq empty ~/.claude/hooks/hooks.json
# 或
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**常见语法错误**：
- 缺少逗号
- 引号未闭合
- 使用了单引号（必须用双引号）
- 注释格式错误（JSON 不支持 `//` 注释）

#### 原因 C：环境变量 CLAUDE_PLUGIN_ROOT 未设置

**问题**：Hook 脚本使用 `${CLAUDE_PLUGIN_ROOT}` 引用路径，但环境变量未设置。

**解决方案**：

检查插件安装路径是否正确：

```bash
# 查看已安装的插件路径
ls -la ~/.claude-plugins/
```

确保 Everything Claude Code 插件已正确安装：

```bash
# 应该看到类似这样的目录
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**如果是插件市场安装**，重启 Claude Code 后环境变量会自动设置。

**如果是手动安装**，检查 `~/.claude/settings.json` 中的插件路径：

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## 常见问题 2：特定 Hook 不触发

### 症状
有些 Hooks 工作（如 SessionStart），但其他 Hooks 不触发（如 PreToolUse 的格式化）。

### 可能原因

#### 原因 A：Matcher 表达式错误

**问题**：Hook 的 `matcher` 表达式有误，导致匹配条件不满足。

**解决方案**：

检查 `hooks.json` 中的 matcher 语法：

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**注意事项**：
- 工具名必须用双引号包裹：`"Edit"`、`"Bash"`
- 正则表达式中的反斜杠需要双重转义：`\\\\.` 而不是 `\\.`
- 文件路径匹配使用 `matches` 关键字

**测试 Matcher**：

你可以手动测试匹配逻辑：

```bash
# 测试文件路径匹配
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# 应该输出：true
```

#### 原因 B：命令执行失败

**问题**：Hook 命令本身执行失败，但没有报错信息。

**解决方案**：

手动运行 Hook 命令测试：

```bash
# 进入插件目录
cd ~/.claude-plugins/everything-claude-code

# 手动运行某个 Hook 脚本
node scripts/hooks/session-start.js

# 检查是否有错误输出
```

**常见失败原因**：
- Node.js 版本不兼容（需要 Node.js 14+）
- 缺少依赖（如未安装 prettier、typescript）
- 脚本权限问题（见下文）

---

## 常见问题 3：权限问题（Linux/macOS）

### 症状
看到类似这样的错误：

```
Permission denied: node scripts/hooks/session-start.js
```

### 解决方案

给 Hook 脚本添加执行权限：

```bash
# 进入插件目录
cd ~/.claude-plugins/everything-claude-code

# 给所有 hooks 脚本添加执行权限
chmod +x scripts/hooks/*.js

# 验证权限
ls -la scripts/hooks/
# 应该看到类似：-rwxr-xr-x  session-start.js
```

**批量修复所有脚本**：

```bash
# 修复所有 scripts 下的 .js 文件
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## 常见问题 4：跨平台兼容性问题

### 症状
在 Windows 上工作正常，但在 macOS/Linux 上失败；或者相反。

### 可能原因

#### 原因 A：路径分隔符

**问题**：Windows 使用反斜杠 `\`，Unix 使用正斜杠 `/`。

**解决方案**：

Everything Claude Code 的脚本已经做了跨平台处理（使用 Node.js `path` 模块），但如果你自定义了 Hook，需要注意：

**错误写法**：
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Windows 风格
}
```

**正确写法**：
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\"  // 使用环境变量和正斜杠
}
```

#### 原因 B：Shell 命令差异

**问题**：不同平台的命令语法不同（如 `which` vs `where`）。

**解决方案**：

Everything Claude Code 的 `scripts/lib/utils.js` 已经处理了这些差异。自定义 Hook 时，参考该文件中的跨平台函数：

```javascript
// utils.js 中的跨平台命令检测
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## 常见问题 5：自动格式化不工作

### 症状
编辑 TypeScript 文件后，Prettier 没有自动格式化代码。

### 可能原因

#### 原因 A：Prettier 未安装

**问题**：PostToolUse Hook 调用 `npx prettier`，但项目中未安装。

**解决方案**：

```bash
# 安装 Prettier（项目级）
npm install --save-dev prettier
# 或
pnpm add -D prettier

# 或全局安装
npm install -g prettier
```

#### 原因 B：Prettier 配置缺失

**问题**：Prettier 找不到配置文件，使用默认格式化规则。

**解决方案**：

创建 Prettier 配置文件：

```bash
# 项目根目录创建 .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### 原因 C：文件类型不匹配

**问题**：编辑的文件扩展名不在 Hook 的匹配规则中。

**当前匹配规则**（`hooks.json` L92-97）：

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**如果需要支持其他文件类型**（如 `.vue`），需要修改配置：

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## 常见问题 6：TypeScript 检查不工作

### 症状
编辑 `.ts` 文件后，没有看到类型检查的错误输出。

### 可能原因

#### 原因 A：tsconfig.json 缺失

**问题**：Hook 脚本向上查找 `tsconfig.json` 文件，但找不到。

**解决方案**：

确保项目根目录或父目录有 `tsconfig.json`：

```bash
# 查找 tsconfig.json
find . -name "tsconfig.json" -type f

# 如果不存在，创建基础配置
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### 原因 B：TypeScript 未安装

**问题**：Hook 调用 `npx tsc`，但未安装 TypeScript。

**解决方案**：

```bash
npm install --save-dev typescript
# 或
pnpm add -D typescript
```

---

## 常见问题 7：SessionStart/SessionEnd 不触发

### 症状
启动或结束会话时，看不到 `[SessionStart]` 或 `[SessionEnd]` 日志。

### 可能原因

#### 原因 A：会话文件目录不存在

**问题**：`~/.claude/sessions/` 目录不存在，Hook 脚本无法创建会话文件。

**解决方案**：

手动创建目录：

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### 原因 B：脚本路径错误

**问题**：`hooks.json` 中引用的脚本路径不正确。

**检查方法**：

```bash
# 验证脚本是否存在
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**如果不存在**，检查插件是否完整安装：

```bash
# 查看插件目录结构
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## 常见问题 8：Dev Server 阻止不工作

### 症状
直接运行 `npm run dev` 没有被阻止，可以启动 dev server。

### 可能原因

#### 原因 A：正则表达式不匹配

**问题**：你的 dev server 命令不在 Hook 的匹配规则中。

**当前匹配规则**（`hooks.json` L6）：

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**测试匹配**：

```bash
# 测试你的命令是否匹配
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**如果需要支持其他命令**（如 `npm start`），修改 `hooks.json`：

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### 原因 B：未在 tmux 中运行但未被阻止

**问题**：Hook 应该阻止 dev server 在 tmux 外运行，但没有生效。

**检查点**：

1. 确认 Hook 命令执行成功：
```bash
# 模拟 Hook 命令
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# 应该看到错误输出并退出码为 1
```

2. 检查 `process.exit(1)` 是否正确阻止了命令：
- Hook 命令中的 `process.exit(1)` 应该会阻止后续命令执行

3. 如果仍然不工作，可能需要升级 Claude Code 版本（Hooks 支持可能需要最新版本）

---

## 诊断工具和技巧

### 启用详细日志

查看 Claude Code 的详细日志，了解 Hook 执行情况：

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### 手动测试 Hook

在终端手动运行 Hook 脚本，验证其功能：

```bash
# 测试 SessionStart
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# 测试 Suggest Compact
node scripts/hooks/suggest-compact.js

# 测试 PreCompact
node scripts/hooks/pre-compact.js
```

### 检查环境变量

查看 Claude Code 的环境变量：

```bash
# 在 Hook 脚本中添加调试输出
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## 检查点 ✅

按以下清单逐一检查：

- [ ] `hooks.json` 在正确位置（`~/.claude/hooks/` 或 `.claude/hooks/`）
- [ ] `hooks.json` JSON 格式正确（通过 `jq` 验证）
- [ ] 插件路径正确（`${CLAUDE_PLUGIN_ROOT}` 已设置）
- [ ] 所有脚本有执行权限（Linux/macOS）
- [ ] 依赖工具已安装（Node.js、Prettier、TypeScript）
- [ ] 会话目录存在（`~/.claude/sessions/`）
- [ ] Matcher 表达式正确（正则转义、引号包裹）
- [ ] 跨平台兼容性（使用 `path` 模块，环境变量）

---

## 何时需要帮助

如果以上方法都无法解决问题：

1. **收集诊断信息**：
   ```bash
   # 输出以下信息
   echo "Node version: $(node -v)"
   echo "Claude Code version: $(claude-code --version)"
   echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
   echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
   ```

2. **查看 GitHub Issues**：
   - 访问 [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - 搜索相似问题

3. **提交 Issue**：
   - 包含完整的错误日志
   - 提供操作系统和版本信息
   - 附上 `hooks.json` 内容（隐藏敏感信息）

---

## 本课小结

Hooks 不工作通常有以下几类原因：

| 问题类型 | 常见原因 | 快速排查 |
|--- | --- | ---|
| **完全不触发** | hooks.json 路径错误、JSON 语法错误 | 检查文件位置、验证 JSON 格式 |
| **特定 Hook 不触发** | Matcher 表达式错误、命令执行失败 | 检查正则语法、手动运行脚本 |
| **权限问题** | 脚本缺少执行权限（Linux/macOS） | `chmod +x scripts/hooks/*.js` |
| **跨平台兼容性** | 路径分隔符、Shell 命令差异 | 使用 `path` 模块、参考 utils.js |
| **功能不工作** | 依赖工具未安装（Prettier、TypeScript） | 安装相应工具、检查配置文件 |

记住：大多数问题都可以通过检查文件路径、验证 JSON 格式、确认依赖安装来解决。

---

## 下一课预告

> 下一课我们学习 **[MCP 连接失败排查](../troubleshooting-mcp/)**。
>
> 你会学到：
> - MCP 服务器配置常见错误
> - 如何调试 MCP 连接问题
> - MCP 环境变量和占位符设置

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能                    | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| Hooks 主配置            | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158   |
| SessionStart Hook       | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62    |
| SessionEnd Hook         | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83    |
| PreCompact Hook         | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49    |
| Suggest Compact Hook    | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61    |
| 跨平台工具函数          | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384   |

**关键函数**：
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()`：获取配置目录路径（utils.js 19-34）
- `ensureDir(dirPath)`：确保目录存在，不存在则创建（utils.js 54-59）
- `log(message)`：输出日志到 stderr（可见于 Claude Code）（utils.js 182-184）
- `findFiles(dir, pattern, options)`：跨平台文件查找（utils.js 102-149）
- `commandExists(cmd)`：检查命令是否存在（跨平台兼容）（utils.js 228-246）

**关键正则表达式**：
- Dev server 阻止：`npm run dev|pnpm( run)? dev|yarn dev|bun run dev`（hooks.json 6）
- 文件编辑匹配：`\\.(ts|tsx|js|jsx)$`（hooks.json 92）
- TypeScript 文件：`\\.(ts|tsx)$`（hooks.json 102）

**环境变量**：
- `${CLAUDE_PLUGIN_ROOT}`：插件根目录路径
- `CLAUD_SESSION_ID`：会话标识符
- `COMPACT_THRESHOLD`：压缩建议阈值（默认 50）

</details>
