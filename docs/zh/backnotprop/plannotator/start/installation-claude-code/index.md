---
title: "Claude Code: 安装与配置 | Plannotator"
sidebarTitle: "3 分钟装好"
subtitle: "Claude Code: 安装与配置"
description: "学习在 Claude Code 中安装 Plannotator 插件的方法。3 分钟完成配置，支持插件系统和手动 Hook 两种方式，适用于 macOS、Linux 和 Windows 系统，涵盖远程和 Devcontainer 环境配置。"
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# 安装 Claude Code 插件

## 学完你能做什么

- 在 Claude Code 中启用 Plannotator 计划评审功能
- 选择适合你的安装方式（插件系统或手动 Hook）
- 验证安装是否成功
- 在远程/Devcontainer 环境中正确配置 Plannotator

## 你现在的困境

使用 Claude Code 时，AI 生成的计划只能在终端中阅读，难以进行精确的评审和反馈。你想：
- 在浏览器中可视化查看 AI 计划
- 对计划进行删除、替换、插入等精确注释
- 一次性给 AI 清晰的修改指令

## 什么时候用这一招

适合以下场景：
- 你首次使用 Claude Code + Plannotator
- 你需要重新安装或升级 Plannotator
- 你想在远程环境（SSH、Devcontainer、WSL）中使用

## 核心思路

Plannotator 的安装分为两部分：
1. **安装 CLI 命令**：这是核心运行时，负责启动本地服务器和浏览器
2. **配置 Claude Code**：通过插件系统或手动 Hook，让 Claude Code 在完成计划时自动调用 Plannotator

安装完成后，当 Claude Code 调用 `ExitPlanMode` 时，会自动触发 Plannotator，在浏览器中打开计划评审界面。

## 🎒 开始前的准备

::: warning 前置检查

- [ ] 已安装 Claude Code 2.1.7 或更高版本（需要支持 Permission Request Hooks）
- [ ] 有权限在终端中执行命令（Linux/macOS 需要 sudo 或安装到 home 目录）

:::

## 跟我做

### 第 1 步：安装 Plannotator CLI 命令

首先，安装 Plannotator 的命令行工具。

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**你应该看到**：终端显示安装进度，完成后提示 `plannotator {版本号} installed to {安装路径}/plannotator`

**检查点 ✅**：运行以下命令验证安装：

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

你应该看到 Plannotator 命令的安装路径，例如 `/usr/local/bin/plannotator` 或 `$HOME/.local/bin/plannotator`。

### 第 2 步：在 Claude Code 中安装插件

打开 Claude Code，执行以下命令：

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**你应该看到**：插件安装成功的提示信息。

::: danger 重要：必须重启 Claude Code

安装插件后，**必须重启 Claude Code**，否则 Hooks 不会生效。

:::

### 第 3 步：验证安装

重启后，在 Claude Code 中执行以下命令测试代码评审功能：

```bash
/plannotator-review
```

**你应该看到**：
- 浏览器自动打开 Plannotator 的代码评审界面
- 终端显示 "Opening code review..." 并等待你的评审反馈

如果看到以上输出，恭喜你，安装成功！

::: tip 说明
计划评审功能会在 Claude Code 调用 `ExitPlanMode` 时自动触发，无需手动执行测试命令。你可以在实际使用计划模式时测试该功能。
:::

### 第 4 步：（可选）手动 Hook 安装

如果你不想使用插件系统，或者需要在 CI/CD 环境中使用，可以手动配置 Hook。

编辑 `~/.claude/settings.json` 文件（如果文件不存在则创建），添加以下内容：

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**字段说明**：
- `matcher: "ExitPlanMode"` - 当 Claude Code 调用 ExitPlanMode 时触发
- `command: "plannotator"` - 执行安装的 Plannotator CLI 命令
- `timeout: 1800` - 超时时间（30 分钟），给你足够的时间评审计划

**检查点 ✅**：保存文件后，重启 Claude Code，然后执行 `/plannotator-review` 测试。

### 第 5 步：（可选）远程/Devcontainer 配置

如果你在 SSH、Devcontainer 或 WSL 等远程环境中使用 Claude Code，需要设置环境变量以固定端口并禁用自动打开浏览器。

在远程环境中执行：

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # 选择一个你将通过端口转发访问的端口
```

**这些变量会**：
- 使用固定端口（而非随机端口），方便设置端口转发
- 跳过自动打开浏览器（因为浏览器在你的本地机器上）
- 在终端打印 URL，你可以复制到本地浏览器打开

::: tip 端口转发

**VS Code Devcontainer**：端口通常会自动转发，检查 VS Code 的 "Ports" 标签页确认。

**SSH 端口转发**：编辑 `~/.ssh/config`，添加：

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## 踩坑提醒

### 问题 1：安装后 `/plannotator-review` 命令无响应

**原因**：忘记重启 Claude Code，Hooks 未生效。

**解决**：完全退出 Claude Code 并重新打开。

### 问题 2：安装脚本执行失败

**原因**：网络问题或权限不足。

**解决**：
- 检查网络连接，确保能访问 `https://plannotator.ai`
- 如果遇到权限问题，尝试手动下载安装脚本并执行

### 问题 3：远程环境中浏览器无法打开

**原因**：远程环境没有图形界面，浏览器无法启动。

**解决**：设置 `PLANNOTATOR_REMOTE=1` 环境变量，并配置端口转发。

### 问题 4：端口被占用

**原因**：固定端口 `9999` 已被其他程序占用。

**解决**：选择另一个可用端口，例如 `8888` 或 `19432`。

## 本课小结

- ✅ 安装了 Plannotator CLI 命令
- ✅ 通过插件系统或手动 Hook 配置了 Claude Code
- ✅ 验证了安装是否成功
- ✅ （可选）配置了远程/Devcontainer 环境

## 下一课预告

> 下一课我们学习 **[安装 OpenCode 插件](../installation-opencode/)**。
>
> 如果你在使用 OpenCode 而非 Claude Code，下一课会教你在 OpenCode 中完成类似的配置。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能              | 文件路径                                                                                                | 行号    |
|--- | --- | ---|
| 安装脚本入口      | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60)                     | 35-60   |
| Hook 配置说明     | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39)   | 30-39   |
| 手动 Hook 示例    | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62)   | 42-62   |
| 环境变量配置      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79)   | 73-79   |
| 远程模式配置      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94)   | 81-94   |

**关键常量**：
- `PLANNOTATOR_REMOTE = "1"`：启用远程模式，使用固定端口
- `PLANNOTATOR_PORT = 9999`：远程模式使用的固定端口（默认 19432）
- `timeout: 1800`：Hook 超时时间（30 分钟）

**关键环境变量**：
- `PLANNOTATOR_REMOTE`：远程模式标志
- `PLANNOTATOR_PORT`：固定端口号
- `PLANNOTATOR_BROWSER`：自定义浏览器路径

</details>
