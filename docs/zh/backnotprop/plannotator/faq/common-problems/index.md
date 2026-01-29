---
title: "常见问题: 故障排查指南 | Plannotator"
sidebarTitle: "遇到问题怎么办"
subtitle: "常见问题: 故障排查指南"
description: "学习 Plannotator 常见问题排查和故障解决方法。快速解决端口占用、浏览器未打开、Git 命令失败、图片上传和集成问题。"
tags:
  - "常见问题"
  - "故障排查"
  - "端口占用"
  - "浏览器"
  - "Git"
  - "远程环境"
  - "集成问题"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# 常见问题

## 学完你能做什么

- ✅ 快速诊断并解决端口占用问题
- ✅ 理解为什么浏览器未自动打开，并知道如何访问
- ✅ 排查计划或代码评审未显示的问题
- ✅ 处理 Git 命令执行失败的情况
- ✅ 解决图片上传相关的错误
- ✅ 排查 Obsidian/Bear 集成失败的原因
- ✅ 在远程环境中正确访问 Plannotator

## 你现在的困境

在使用 Plannotator 时，你可能遇到这些问题：

- **问题 1**：启动时提示端口被占用，服务器无法启动
- **问题 2**：浏览器没有自动打开，不知道如何访问评审界面
- **问题 3**：计划或代码评审页面显示空白，内容未加载
- **问题 4**：执行 `/plannotator-review` 时提示 Git 错误
- **问题 5**：上传图片失败或图片无法显示
- **问题 6**：配置了 Obsidian/Bear 集成，但计划没有自动保存
- **问题 7**：在远程环境中无法访问本地服务器

这些问题会中断你的工作流程，影响使用体验。

## 核心思路

::: info 错误处理机制

Plannotator 的服务器实现了**自动重试机制**：

- **最大重试次数**：5 次
- **重试延迟**：500 毫秒
- **适用场景**：端口占用（EADDRINUSE 错误）

如果端口冲突，系统会自动尝试其他端口。5 次重试后仍失败才会报错。

:::

Plannotator 的错误处理遵循以下原则：

1. **本地优先**：所有错误信息都会输出到终端或控制台
2. **优雅降级**：集成失败（如 Obsidian 保存失败）不会阻塞主流程
3. **明确提示**：提供具体的错误信息和建议解决方案

## 常见问题与解决方案

### 问题 1：端口占用

**错误信息**：

```
Port 19432 in use after 5 retries
```

**原因分析**：

- 端口已被其他进程占用
- 远程模式下配置了固定端口但端口冲突
- 上次 Plannotator 进程未正常退出

**解决方案**：

#### 方法 1：等待自动重试（仅限本地模式）

本地模式下，Plannotator 会自动尝试随机端口。如果看到端口占用错误，通常意味着：

- 5 次随机端口都被占用（极罕见）
- 配置了固定端口（`PLANNOTATOR_PORT`）但冲突

**你应该看到**：终端显示 "Port X in use after 5 retries"

#### 方法 2：使用固定端口（远程模式）

在远程环境中，需要配置 `PLANNOTATOR_PORT`：

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip 端口选择建议

- 选择 1024-49151 范围内的端口（用户端口）
- 避免使用常见服务端口（80, 443, 3000, 5000 等）
- 确保端口未被防火墙拦截

:::

#### 方法 3：清理占用端口的进程

```bash
# 查找占用端口的进程（替换 19432 为你的端口）
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# 终止进程（将 PID 替换为实际进程 ID）
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning 注意事项

终止进程前，确认该进程不是其他重要应用。Plannotator 会在收到决策后自动关闭服务器，通常不需要手动终止。

:::

---

### 问题 2：浏览器未自动打开

**现象**：终端显示服务器已启动，但浏览器没有打开。

**原因分析**：

| 场景 | 原因 |
|--- | ---|
| 远程环境 | Plannotator 检测到远程模式，跳过浏览器自动打开 |
| `PLANNOTATOR_BROWSER` 配置错误 | 浏览器路径或名称不正确 |
| 浏览器未安装 | 系统默认浏览器不存在 |

**解决方案**：

#### 场景 1：远程环境（SSH、Devcontainer、WSL）

**检查是否为远程环境**：

```bash
echo $PLANNOTATOR_REMOTE
# 输出为 "1" 或 "true" 表示远程模式
```

**在远程环境中**：

1. **终端会显示访问 URL**：

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **手动打开浏览器**，访问显示的 URL

3. **配置端口转发**（如果需要从本地访问）

**你应该看到**：终端输出类似 "Plannotator running at: http://localhost:19432"

#### 场景 2：本地模式但浏览器未打开

**检查 `PLANNOTATOR_BROWSER` 配置**：

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# 应该输出浏览器名称或路径
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**清除自定义浏览器配置**：

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**配置正确的浏览器**（如果需要自定义）：

```bash
# macOS：使用应用名称
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux：使用可执行文件路径
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows：使用可执行文件路径
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### 问题 3：计划或代码评审未显示

**现象**：浏览器打开，但页面显示空白或加载失败。

**可能原因**：

| 原因 | 计划评审 | 代码评审 |
|--- | --- | ---|
| Plan 参数为空 | ✅ 常见 | ❌ 不适用 |
| Git 仓库问题 | ❌ 不适用 | ✅ 常见 |
| 无 diff 可显示 | ❌ 不适用 | ✅ 常见 |
| 服务器启动失败 | ✅ 可能 | ✅ 可能 |

**解决方案**：

#### 情况 1：计划评审未显示

**检查终端输出**：

```bash
# 查找错误信息
plannotator start 2>&1 | grep -i error
```

**常见错误 1**：Plan 参数为空

**错误信息**：

```
400 Bad Request - Missing plan or plan is empty
```

**原因**：Claude Code 或 OpenCode 传递的 plan 为空字符串。

**解决方法**：

- 确认 AI Agent 生成了有效的计划内容
- 检查 Hook 或 Plugin 配置是否正确
- 查看 Claude Code/OpenCode 日志获取更多信息

**常见错误 2**：服务器未正常启动

**解决方法**：

- 检查终端是否显示 "Plannotator running at" 消息
- 如果没有，参考"问题 1：端口占用"
- 查看 [环境变量配置](../../advanced/environment-variables/) 确认配置正确

#### 情况 2：代码评审未显示

**检查终端输出**：

```bash
/plannotator-review 2>&1 | grep -i error
```

**常见错误 1**：无 Git 仓库

**错误信息**：

```
fatal: not a git repository
```

**解决方法**：

```bash
# 初始化 Git 仓库
git init

# 添加文件并提交（如果有未提交的更改）
git add .
git commit -m "Initial commit"

# 再次运行
/plannotator-review
```

**你应该看到**：浏览器显示 diff viewer

**常见错误 2**：无 diff 可显示

**现象**：页面显示 "No changes" 或类似提示。

**解决方法**：

```bash
# 检查是否有未提交的更改
git status

# 检查是否有 staged 更改
git diff --staged

# 检查是否有 commit
git log --oneline

# 切换 diff 类型查看不同范围
# 在代码评审界面点击下拉菜单切换：
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main (如果在分支上)
```

**你应该看到**：diff viewer 显示代码变更或提示"No changes"

**常见错误 3**：Git 命令执行失败

**错误信息**：

```
Git diff error for uncommitted: [具体错误信息]
```

**可能原因**：

- Git 未安装
- Git 版本过旧
- Git 配置问题

**解决方法**：

```bash
# 检查 Git 版本
git --version

# 测试 Git diff 命令
git diff HEAD

# 如果 Git 正常工作，问题可能是 Plannotator 内部错误
# 查看完整错误信息并报告 Bug
```

---

### 问题 4：图片上传失败

**错误信息**：

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**可能原因**：

| 原因 | 解决方法 |
|--- | ---|
| 未选择文件 | 点击上传按钮并选择图片 |
| 文件格式不支持 | 使用 png/jpeg/webp 格式 |
| 文件过大 | 压缩图片后再上传 |
| 临时目录权限问题 | 检查 /tmp/plannotator 目录权限 |

**解决方案**：

#### 检查上传的文件

**支持的格式**：

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**不支持的格式**：

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**你应该看到**：上传成功后，图片显示在评审界面中

#### 检查临时目录权限

Plannotator 会自动创建 `/tmp/plannotator` 目录。如果仍然上传失败，请检查系统临时目录权限。

**如果需要手动检查**：

```bash
# 检查目录权限
ls -la /tmp/plannotator

# Windows 检查
dir %TEMP%\plannotator
```

**你应该看到**：`drwxr-xr-x`（或类似权限）表示目录可写

#### 查看浏览器开发者工具

1. 按 F12 打开开发者工具
2. 切换到 "Network" 标签
3. 点击上传按钮
4. 查找 `/api/upload` 请求
5. 检查请求状态和响应

**你应该看到**：
- 状态码：200 OK（成功）
- 响应：`{"path": "/tmp/plannotator/xxx.png"}`

---

### 问题 5：Obsidian/Bear 集成失败

**现象**：批准计划后，笔记应用中没有保存的计划。

**可能原因**：

| 原因 | Obsidian | Bear |
|--- | --- | ---|
| 集成未启用 | ✅ | ✅ |
| Vault/App 未检测到 | ✅ | N/A |
| 路径配置错误 | ✅ | ✅ |
| 文件名冲突 | ✅ | ✅ |
| x-callback-url 失败 | N/A | ✅ |

**解决方案**：

#### Obsidian 集成问题

**步骤 1：检查集成是否启用**

1. 在 Plannotator UI 中点击设置（齿轮图标）
2. 查找 "Obsidian Integration" 部分
3. 确保开关已打开

**你应该看到**：开关显示为蓝色（启用状态）

**步骤 2：检查 Vault 检测**

**自动检测**：

- Plannotator 会自动读取 Obsidian 配置文件
- 配置文件位置：
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**手动验证**：

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**你应该看到**：包含 `vaults` 字段的 JSON 文件

**步骤 3：手动配置 Vault 路径**

如果自动检测失败：

1. 在 Plannotator 设置中
2. 点击 "Manually enter vault path"
3. 输入完整 Vault 路径

**示例路径**：

- macOS: `/Users/yourname/Documents/ObsidianVault`
- Windows: `C:\Users\yourname\Documents\ObsidianVault`
- Linux: `/home/yourname/Documents/ObsidianVault`

**你应该看到**：下拉菜单显示你输入的 Vault 名称

**步骤 4：检查终端输出**

Obsidian 保存结果会输出到终端：

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**错误信息**：

```
[Obsidian] Save failed: [具体错误信息]
```

**常见错误**：

- 权限不足 → 检查 Vault 目录权限
- 磁盘空间不足 → 释放空间
- 路径无效 → 确认路径拼写正确

#### Bear 集成问题

**检查 Bear 应用**

- 确保已在 macOS 上安装 Bear
- 确保 Bear 应用正在运行

**测试 x-callback-url**：

```bash
# 在终端中测试
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**你应该看到**：Bear 打开并创建新笔记

**检查终端输出**：

```bash
[Bear] Saved plan to Bear
```

**错误信息**：

```
[Bear] Save failed: [具体错误信息]
```

**解决方法**：

- 重启 Bear 应用
- 确认 Bear 是最新版本
- 检查 macOS 权限设置（允许 Bear 访问文件）

---

### 问题 6：远程环境访问问题

**现象**：在 SSH、Devcontainer 或 WSL 中，无法从本地浏览器访问服务器。

**核心概念**：

::: info 什么是远程环境

远程环境是指通过 SSH、Devcontainer 或 WSL 访问的远程计算环境。在这种环境中，你需要通过**端口转发**将远程端口映射到本地，才能在本地浏览器中访问远程服务器。

:::

**解决方案**：

#### 步骤 1：配置远程模式

在远程环境中设置环境变量：

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**你应该看到**：终端输出 "Using remote mode with fixed port: 9999"

#### 步骤 2：配置端口转发

**场景 1：SSH 远程服务器**

编辑 `~/.ssh/config`：

```
Host your-server
    HostName server.example.com
    User yourname
    LocalForward 9999 localhost:9999
```

**连接到服务器**：

```bash
ssh your-server
```

**你应该看到**：SSH 连接建立后，本地 9999 端口转发到远程 9999 端口

**场景 2：VS Code Devcontainer**

VS Code Devcontainer 通常会自动转发端口。

**检查方法**：

1. 在 VS Code 中打开 "Ports" 标签
2. 查找 9999 端口
3. 确保端口状态为 "Forwarded"

**你应该看到**：Ports 标签显示 "Local Address: localhost:9999"

**场景 3：WSL（Windows Subsystem for Linux）**

WSL 默认使用 `localhost` 转发。

**访问方法**：

在 Windows 浏览器中直接访问：

```
http://localhost:9999
```

**你应该看到**：Plannotator UI 正常显示

#### 步骤 3：验证访问

1. 在远程环境中启动 Plannotator
2. 在本地浏览器中访问 `http://localhost:9999`
3. 确认页面正常显示

**你应该看到**：计划评审或代码评审界面正常加载

---

### 问题 7：计划/注释未正确保存

**现象**：批准或拒绝计划后，注释没有保存，或保存位置不正确。

**可能原因**：

| 原因 | 解决方法 |
|--- | ---|
| 计划保存被禁用 | 检查设置中的 "Plan Save" 选项 |
| 自定义路径无效 | 验证路径是否可写 |
| 注释内容为空 | 这是正常行为（仅当有注释时才保存） |
| 服务器权限问题 | 检查保存目录权限 |

**解决方案**：

#### 检查计划保存设置

1. 在 Plannotator UI 中点击设置（齿轮图标）
2. 查看 "Plan Save" 部分
3. 确认开关已启用

**你应该看到**："Save plans and annotations" 开关为蓝色（启用状态）

#### 检查保存路径

**默认保存位置**：

```bash
~/.plannotator/plans/  # 计划和注释都保存在此目录
```

**自定义路径**：

在设置中可以配置自定义保存路径。

**验证路径可写**：

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**你应该看到**：命令执行成功，没有权限错误

#### 查看终端输出

保存结果会输出到终端：

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**你应该看到**：类似的成功消息

---

## 本课小结

通过本课，你学会了：

- **诊断端口占用问题**：使用固定端口或清理占用进程
- **处理浏览器未打开**：识别远程模式，手动访问或配置浏览器
- **排查内容未显示**：检查 Plan 参数、Git 仓库、diff 状态
- **解决图片上传失败**：检查文件格式、目录权限、开发者工具
- **修复集成失败**：检查配置、路径、权限和终端输出
- **配置远程访问**：使用 PLANNOTATOR_REMOTE 和端口转发
- **保存计划与注释**：启用计划保存并验证路径权限

**记住**：

1. 终端输出是最好的调试信息来源
2. 远程环境需要端口转发
3. 集成失败不会阻塞主流程
4. 使用开发者工具查看网络请求详情

## 下一步

如果你遇到的问题未在本课中覆盖，可以查看：

- [故障排查](../troubleshooting/) - 深入的调试技巧和日志分析方法
- [API 参考](../../appendix/api-reference/) - 了解所有 API 端点和错误码
- [数据模型](../../appendix/data-models/) - 了解 Plannotator 的数据结构

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 服务器启动与重试逻辑 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| 端口占用错误处理（计划评审） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| 端口占用错误处理（代码评审） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| 远程模式检测 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 全文 |
| 浏览器打开逻辑 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 全文 |
| Git 命令执行与错误处理 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| 图片上传处理（计划评审） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| 图片上传处理（代码评审） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Obsidian 集成 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | 全文 |
| 计划保存 | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | 全文 |

**关键常量**：

| 常量 | 值 | 说明 |
|--- | --- | ---|
| `MAX_RETRIES` | 5 | 服务器启动最大重试次数 |
| `RETRY_DELAY_MS` | 500 | 重试延迟（毫秒） |

**关键函数**：

- `startPlannotatorServer()` - 启动计划评审服务器
- `startReviewServer()` - 启动代码评审服务器
- `isRemoteSession()` - 检测是否为远程环境
- `getServerPort()` - 获取服务器端口
- `openBrowser()` - 打开浏览器
- `runGitDiff()` - 执行 Git diff 命令
- `detectObsidianVaults()` - 检测 Obsidian vaults
- `saveToObsidian()` - 保存计划到 Obsidian
- `saveToBear()` - 保存计划到 Bear

</details>
