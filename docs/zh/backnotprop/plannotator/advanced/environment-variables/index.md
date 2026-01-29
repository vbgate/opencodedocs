---
title: "环境变量: 远程模式与端口配置 | plannotator"
sidebarTitle: "5 分钟搞定远程配置"
subtitle: "环境变量: 远程模式与端口配置"
description: "学习 plannotator 环境变量配置方法。设置远程模式、固定端口、自定义浏览器和分享开关，适配 SSH、Devcontainer 和 WSL 环境。"
tags:
  - "环境变量"
  - "远程模式"
  - "端口配置"
  - "浏览器配置"
  - "URL 分享"
  - "Devcontainer"
  - "WSL"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 5
---

# 环境变量配置

## 学完你能做什么

- ✅ 在 SSH、Devcontainer、WSL 等远程环境中正确配置 Plannotator
- ✅ 使用固定端口避免端口冲突和频繁配置端口转发
- ✅ 指定自定义浏览器打开计划评审界面
- ✅ 启用或禁用 URL 分享功能
- ✅ 理解每个环境变量的默认值和行为

## 你现在的困境

**问题 1**：在 SSH 或 Devcontainer 中使用 Plannotator，浏览器没有自动打开，或者无法访问本地服务器。

**问题 2**：每次重启 Plannotator 都使用随机端口，需要不断更新端口转发配置。

**问题 3**：系统默认浏览器不符合你的使用习惯，希望在特定浏览器中查看计划。

**问题 4**：出于安全考虑，想禁用 URL 分享功能，防止计划被意外分享。

**Plannotator 能帮你**：
- 通过环境变量自动检测远程环境并禁用浏览器自动打开
- 固定端口方便端口转发配置
- 支持自定义浏览器
- 提供环境变量控制 URL 分享开关

## 什么时候用这一招

**使用场景**：
- 在 SSH 远程服务器上使用 Claude Code 或 OpenCode
- 在 Devcontainer 容器中开发
- 在 WSL（Windows Subsystem for Linux）环境中工作
- 需要固定端口简化端口转发配置
- 希望使用特定浏览器（如 Chrome、Firefox）
- 企业安全策略要求禁用 URL 分享功能

**不适用场景**：
- 本地开发且使用默认浏览器（无需任何环境变量）
- 不需要端口转发（如完全本地开发）

## 核心思路

### 环境变量是什么

**环境变量**是操作系统提供的键值对配置机制。Plannotator 通过读取环境变量适配不同的运行环境（本地或远程）。

::: info 为什么需要环境变量？

Plannotator 默认假设你在本地开发环境中使用：
- 本地模式：随机端口（避免端口冲突）
- 本地模式：自动打开系统默认浏览器
- 本地模式：启用 URL 分享功能

但在远程环境（SSH、Devcontainer、WSL）中，这些默认行为需要调整：
- 远程模式：使用固定端口（方便端口转发）
- 远程模式：不自动打开浏览器（需要在宿主机打开）
- 远程模式：可能需要禁用 URL 分享（安全考虑）

环境变量让你无需修改代码，就能在不同环境中调整 Plannotator 的行为。
:::

### 环境变量优先级

Plannotator 读取环境变量的优先级：

```
显式环境变量 > 默认行为

例如：
PLANNOTATOR_PORT=3000 > 远程模式默认端口 19432 > 本地模式随机端口
```

这意味着：
- 如果设置了 `PLANNOTATOR_PORT`，无论是否是远程模式，都使用该端口
- 如果未设置 `PLANNOTATOR_PORT`，远程模式使用 19432，本地模式使用随机端口

## 🎒 开始前的准备

在配置环境变量前，确认：

- [ ] 已完成 Plannotator 安装（[Claude Code 安装](../installation-claude-code/) 或 [OpenCode 安装](../installation-opencode/)）
- [ ] 了解你当前的运行环境（本地、SSH、Devcontainer、WSL）
- [ ] （远程环境）已配置端口转发（如 SSH 的 `-L` 参数或 Devcontainer 的 `forwardPorts`）

## 跟我做

### 第 1 步：配置远程模式（SSH、Devcontainer、WSL）

**为什么**
远程模式会自动使用固定端口并禁用浏览器自动打开，适合 SSH、Devcontainer、WSL 等环境。

**操作方式**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
export PLANNOTATOR_REMOTE=1
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_REMOTE="1"
```

```cmd [Windows CMD]
set PLANNOTATOR_REMOTE=1
```

:::

**你应该看到**：没有视觉反馈，环境变量已设置。

**永久生效**（推荐）：

::: code-group

```bash [~/.bashrc 或 ~/.zshrc]
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
source ~/.bashrc
```

```powershell [PowerShell Profile]
[Environment]::SetEnvironmentVariable('PLANNOTATOR_REMOTE', '1', 'User')
```

```cmd [系统环境变量]
# 通过"系统属性 > 环境变量"界面添加
```

:::

### 第 2 步：配置固定端口（远程环境必需）

**为什么**
远程环境需要固定端口才能配置端口转发。本地环境如需固定端口也可以设置。

**默认端口规则**：
- 本地模式（未设置 `PLANNOTATOR_REMOTE`）：随机端口（`0`）
- 远程模式（`PLANNOTATOR_REMOTE=1`）：默认 `19432`
- 显式设置 `PLANNOTATOR_PORT`：使用指定端口

**操作方式**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# 设置为 19432（远程模式默认）
export PLANNOTATOR_PORT=19432

# 或自定义端口
export PLANNOTATOR_PORT=3000
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT="19432"
```

```cmd [Windows CMD]
set PLANNOTATOR_PORT=19432
```

:::

**你应该看到**：没有视觉反馈，环境变量已设置。

**检查点 ✅**：验证端口是否生效

重启 Claude Code 或 OpenCode 后，触发计划评审，查看终端输出的 URL：

```bash
# 本地模式输出（随机端口）
http://localhost:54321

# 远程模式输出（固定端口 19432）
http://localhost:19432
```

**端口转发配置示例**：

SSH 远程开发：
```bash
ssh -L 19432:localhost:19432 user@remote-server
```

Devcontainer（`.devcontainer/devcontainer.json`）：
```json
{
  "forwardPorts": [19432]
}
```

### 第 3 步：配置自定义浏览器

**为什么**
系统默认浏览器可能不是你希望的（例如你在 Chrome 上工作，但默认是 Safari）。

**操作方式**

::: code-group

```bash [macOS (Bash)]
# 使用应用名称（macOS 支持）
export PLANNOTATOR_BROWSER="Google Chrome"

# 或使用完整路径
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

```bash [Linux (Bash)]
# 使用可执行文件路径
export PLANNOTATOR_BROWSER="/usr/bin/firefox"

# 或使用相对路径（如果在 PATH 中）
export PLANNOTATOR_BROWSER="firefox"
```

```powershell [Windows PowerShell]
# 使用可执行文件路径
$env:PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```cmd [Windows CMD]
set PLANNOTATOR_BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
```

:::

**你应该看到**：下次触发计划评审时，Plannotator 会在指定的浏览器中打开。

**检查点 ✅**：验证浏览器是否生效

重启后触发计划评审，观察：
- macOS：指定的应用会打开
- Windows：指定的浏览器进程会启动
- Linux：指定的浏览器命令会执行

**常见浏览器路径**：

| 操作系统 | 浏览器 | 路径/命令 |
| -------- | ------ | --------- |
| macOS | Chrome | `Google Chrome` 或 `/Applications/Google Chrome.app` |
| macOS | Firefox | `Firefox` 或 `/Applications/Firefox.app` |
| macOS | Safari | `Safari` |
| Linux | Chrome | `google-chrome` 或 `/usr/bin/google-chrome` |
| Linux | Firefox | `firefox` 或 `/usr/bin/firefox` |
| Windows | Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Windows | Firefox | `C:\Program Files\Mozilla Firefox\firefox.exe` |

### 第 4 步：配置 URL 分享开关

**为什么**
URL 分享功能默认启用，但出于安全考虑（如企业环境），你可能需要禁用此功能。

**默认行为**：
- 未设置 `PLANNOTATOR_SHARE`：启用 URL 分享
- 设置为 `disabled`：禁用 URL 分享

**操作方式**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# 禁用 URL 分享
export PLANNOTATOR_SHARE="disabled"
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_SHARE="disabled"
```

```cmd [Windows CMD]
set PLANNOTATOR_SHARE=disabled
```

:::

**你应该看到**：Export 按钮点击后，"Share as URL" 选项消失或不可用。

**检查点 ✅**：验证 URL 分享是否禁用

1. 重启 Claude Code 或 OpenCode
2. 打开任意计划评审
3. 点击右上角 "Export" 按钮
4. 观察选项列表

**启用状态**（默认）：
- ✅ 显示 "Share" 和 "Raw Diff" 两个选项卡
- ✅ "Share" 选项卡显示可分享 URL 和复制按钮

**禁用状态**（`PLANNOTATOR_SHARE="disabled"`）：
- ✅ 直接显示 "Raw Diff" 内容
- ✅ 显示 "Copy" 和 "Download .diff" 按钮
- ❌ 无 "Share" 选项卡和分享 URL 功能

### 第 5 步：验证所有环境变量

**为什么**
确保所有环境变量正确设置，并按预期生效。

**验证方法**

```bash
# macOS/Linux/WSL
echo "PLANNOTATOR_REMOTE=$PLANNOTATOR_REMOTE"
echo "PLANNOTATOR_PORT=$PLANNOTATOR_PORT"
echo "PLANNOTATOR_BROWSER=$PLANNOTATOR_BROWSER"
echo "PLANNOTATOR_SHARE=$PLANNOTATOR_SHARE"
```

```powershell
# Windows PowerShell
Write-Host "PLANNOTATOR_REMOTE=$env:PLANNOTATOR_REMOTE"
Write-Host "PLANNOTATOR_PORT=$env:PLANNOTATOR_PORT"
Write-Host "PLANNOTATOR_BROWSER=$env:PLANNOTATOR_BROWSER"
Write-Host "PLANNOTATOR_SHARE=$env:PLANNOTATOR_SHARE"
```

**你应该看到**：所有设置的环境变量及其值。

**预期输出示例**（远程环境配置）：
```bash
PLANNOTATOR_REMOTE=1
PLANNOTATOR_PORT=19432
PLANNOTATOR_BROWSER=
PLANNOTATOR_SHARE=
```

**预期输出示例**（本地环境配置）：
```bash
PLANNOTATOR_REMOTE=
PLANNOTATOR_PORT=
PLANNOTATOR_BROWSER=Google Chrome
PLANNOTATOR_SHARE=disabled
```

## 踩坑提醒

### 坑 1：环境变量未生效

**症状**：设置环境变量后，Plannotator 行为未改变。

**原因**：环境变量只在新的终端会话中生效，或者需要重启应用。

**解决**：
- 确认环境变量已永久写入配置文件（如 `~/.bashrc`）
- 重启终端或运行 `source ~/.bashrc`
- 重启 Claude Code 或 OpenCode

### 坑 2：端口被占用

**症状**：设置 `PLANNOTATOR_PORT` 后，启动失败。

**原因**：指定端口已被其他进程占用。

**解决**：
```bash
# 检查端口占用（macOS/Linux）
lsof -i :19432

# 更换端口
export PLANNOTATOR_PORT=19433
```

### 坑 3：浏览器路径错误

**症状**：设置 `PLANNOTATOR_BROWSER` 后，浏览器未打开。

**原因**：路径不正确或文件不存在。

**解决**：
- macOS：使用应用名称而非完整路径（如 `Google Chrome`）
- Linux/Windows：使用 `which` 或 `where` 命令确认可执行文件路径
  ```bash
  which firefox  # Linux
  where chrome   # Windows
  ```

### 坑 4：远程模式浏览器意外打开

**症状**：设置 `PLANNOTATOR_REMOTE=1` 后，浏览器仍在远程服务器上打开。

**原因**：`PLANNOTATOR_REMOTE` 的值不是 `"1"` 或 `"true"`。

**解决**：
```bash
# 正确的值
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_REMOTE=true

# 错误的值（不会生效）
export PLANNOTATOR_REMOTE=yes
export PLANNOTATOR_REMOTE=enabled
```

### 坑 5：URL 分享禁用后仍显示选项

**症状**：设置 `PLANNOTATOR_SHARE=disabled` 后，"Share as URL" 仍可见。

**原因**：需要重启应用才能生效。

**解决**：重启 Claude Code 或 OpenCode。

## 本课小结

本课学习了 Plannotator 的 4 个核心环境变量：

| 环境变量 | 用途 | 默认值 | 适用场景 |
| --------- | ---- | ------ | -------- |
| `PLANNOTATOR_REMOTE` | 远程模式开关 | 未设置（本地模式） | SSH、Devcontainer、WSL |
| `PLANNOTATOR_PORT` | 固定端口 | 远程模式 19432，本地模式随机 | 需要端口转发或避免端口冲突 |
| `PLANNOTATOR_BROWSER` | 自定义浏览器 | 系统默认浏览器 | 希望使用特定浏览器 |
| `PLANNOTATOR_SHARE` | URL 分享开关 | 未设置（启用） | 需要禁用分享功能 |

**核心要点**：
- 远程模式会自动使用固定端口并禁用浏览器自动打开
- 显式设置的环境变量优先级高于默认行为
- 环境变量修改后需要重启应用才能生效
- 企业环境可能需要禁用 URL 分享功能

## 下一课预告

> 下一课我们学习 **[常见问题排查](../../faq/common-problems/)**。
>
> 你会学到：
> - 如何解决端口占用问题
> - 处理浏览器未打开的情况
> - 修复计划未显示的错误
> - 调试技巧和日志查看方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 远程模式检测 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 16-29 |
| 端口获取逻辑 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 34-49 |
| 浏览器打开逻辑 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 45-74 |
| URL 分享开关（Hook） | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts) | 44 |
| URL 分享开关（OpenCode） | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |

**关键常量**：
- `DEFAULT_REMOTE_PORT = 19432`：远程模式默认端口

**关键函数**：
- `isRemoteSession()`：检测是否运行在远程环境（SSH、Devcontainer、WSL）
- `getServerPort()`：获取服务器端口（优先环境变量，其次远程模式默认，最后随机）
- `openBrowser(url)`：在指定浏览器或系统默认浏览器中打开 URL

</details>
