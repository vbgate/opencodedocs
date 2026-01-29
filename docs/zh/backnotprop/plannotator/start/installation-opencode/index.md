---
title: "OpenCode: 插件安装 | Plannotator"
sidebarTitle: "装上就能用"
subtitle: "安装 OpenCode 插件"
description: "学习在 OpenCode 中安装 Plannotator 插件。通过配置 openable.json 添加插件，运行安装脚本获取斜杠命令，配置环境变量适配远程模式，验证插件是否正常工作。"
tags:
  - "安装"
  - "配置"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 3
---

# 安装 OpenCode 插件

## 学完你能做什么

- 在 OpenCode 中安装 Plannotator 插件
- 配置 `submit_plan` tool 和 `/plannotator-review` 命令
- 设置环境变量（远程模式、端口、浏览器等）
- 验证插件安装是否成功

## 你现在的困境

在 OpenCode 中使用 AI Agent 时，计划评审需要在终端阅读纯文本计划，难以精确反馈。你想要一个可视化界面来标注计划、添加注释，并自动将反馈结构化地发送回 Agent。

## 什么时候用这一招

**开始使用 Plannotator 前必做**：如果你在 OpenCode 环境中开发，且希望获得交互式计划评审体验。

## 🎒 开始前的准备

- [ ] 已安装 [OpenCode](https://opencode.ai/)
- [ ] 了解基本的 `opencode.json` 配置（OpenCode 插件系统）

::: warning 前置知识
如果你还不了解 OpenCode 的基本操作，建议先阅读 [OpenCode 官方文档](https://opencode.ai/docs)。
:::

## 核心思路

Plannotator 为 OpenCode 提供两个核心功能：

1. **`submit_plan` tool** - 当 Agent 完成计划后调用，打开浏览器进行交互式评审
2. **`/plannotator-review` 命令** - 手动触发 Git diff 代码评审

安装过程分两步：
1. 在 `opencode.json` 中添加插件配置（启用 `submit_plan` tool）
2. 运行安装脚本（获取 `/plannotator-review` 命令）

## 跟我做

### 第 1 步：通过 opencode.json 安装插件

找到你的 OpenCode 配置文件（通常位于项目根目录或用户配置目录），在 `plugin` 数组中添加 Plannotator：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**为什么**
`opencode.json` 是 OpenCode 的插件配置文件，添加插件名后，OpenCode 会自动从 npm 仓库下载并加载插件。

你应该看到：OpenCode 启动时会显示"Loading plugin: @plannotator/opencode..."的消息。

---

### 第 2 步：重启 OpenCode

**为什么**
插件配置修改后需要重启才能生效。

你应该看到：OpenCode 重新加载所有插件。

---

### 第 3 步：运行安装脚本获取斜杠命令

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

:::

**为什么**
这个脚本会：
1. 下载 `plannotator` CLI 工具到你的系统
2. 将 `/plannotator-review` 斜杠命令安装到 OpenCode
3. 清理任何缓存的插件版本

你应该看到：安装成功提示，类似 "Plannotator installed successfully!"

---

### 第 4 步：验证安装

在 OpenCode 中检查插件是否正常工作：

**检查 `submit_plan` tool 是否可用**：
- 在对话中询问 Agent "请使用 submit_plan 提交计划"
- 如果插件正常，Agent 应该能看到并调用这个 tool

**检查 `/plannotator-review` 命令是否可用**：
- 在输入框中输入 `/plannotator-review`
- 如果插件正常，应该能看到命令建议

你应该看到：两个功能都能正常使用，没有错误提示。

---

### 第 5 步：配置环境变量（可选）

Plannotator 支持以下环境变量，根据你的需求配置：

::: details 环境变量说明

| 环境变量 | 用途 | 默认值 | 示例 |
|--- | --- | --- | ---|
| `PLANNOTATOR_REMOTE` | 启用远程模式（devcontainer/SSH） | 未设置 | `export PLANNOTATOR_REMOTE=1` |
| `PLANNOTATOR_PORT` | 固定端口（远程模式必须） | 本地随机，远程 19432 | `export PLANNOTATOR_PORT=9999` |
| `PLANNOTATOR_BROWSER` | 自定义浏览器路径 | 系统默认 | `export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"` |
| `PLANNOTATOR_SHARE` | 禁用 URL 分享 | 启用 | `export PLANNOTATOR_SHARE=disabled` |

:::

**远程模式配置示例**（devcontainer/SSH）：

在 `.devcontainer/devcontainer.json` 中：

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

**为什么**
- 远程模式：在容器或远程机器中运行 OpenCode 时，使用固定端口并自动打开浏览器
- 端口转发：让宿主机能访问容器内的服务

你应该看到：当 Agent 调用 `submit_plan` 时，控制台会显示服务器 URL（而不是自动打开浏览器），例如：
```
Plannotator server running at http://localhost:9999
```

---

### 第 6 步：重启 OpenCode（如修改了环境变量）

如果你在第 5 步配置了环境变量，需要再次重启 OpenCode 让配置生效。

---

## 检查点 ✅

安装完成后，确认以下几点：

- [ ] `opencode.json` 中已添加 `@plannotator/opencode@latest`
- [ ] OpenCode 重启后没有插件加载错误
- [ ] 输入 `/plannotator-review` 能看到命令建议
- [ ] （可选）环境变量配置正确

## 踩坑提醒

### 常见错误 1：插件加载失败

**症状**：OpenCode 启动时提示 "Failed to load plugin @plannotator/opencode"

**可能原因**：
- 网络问题导致无法从 npm 下载
- npm 缓存损坏

**解决方法**：
1. 检查网络连接
2. 运行安装脚本（它会清理插件缓存）
3. 手动清理 npm 缓存：`npm cache clean --force`

---

### 常见错误 2：斜杠命令不可用

**症状**：输入 `/plannotator-review` 没有命令建议

**可能原因**：安装脚本未成功运行

**解决方法**：重新运行安装脚本（步骤 3）

---

### 常见错误 3：远程模式下无法打开浏览器

**症状**：在 devcontainer 中调用 `submit_plan` 时浏览器未打开

**可能原因**：
- 未设置 `PLANNOTATOR_REMOTE=1`
- 未配置端口转发

**解决方法**：
1. 确认 `PLANNOTATOR_REMOTE=1` 已设置
2. 检查 `.devcontainer/devcontainer.json` 中 `forwardPorts` 包含你设置的端口
3. 手动访问显示的 URL：`http://localhost:9999`

---

### 常见错误 4：端口占用

**症状**：服务器启动失败，提示 "Port already in use"

**可能原因**：之前的服务器未正确关闭

**解决方法**：
1. 修改 `PLANNOTATOR_PORT` 为其他端口
2. 或手动关闭占用端口的进程（macOS/Linux: `lsof -ti:9999 | xargs kill`）

---

## 本课小结

本课介绍了如何在 OpenCode 中安装和配置 Plannotator 插件：

1. **通过 `opencode.json` 添加插件** - 启用 `submit_plan` tool
2. **运行安装脚本** - 获取 `/plannotator-review` 斜杠命令
3. **配置环境变量** - 适配远程模式和自定义需求
4. **验证安装** - 确认插件正常工作

安装完成后，你可以：
- 让 Agent 使用 `submit_plan` 提交计划进行交互式评审
- 使用 `/plannotator-review` 手动审查 Git diff

## 下一课预告

> 下一课我们学习 **[计划评审基础](../../platforms/plan-review-basics/)**。
>
> 你会学到：
> - 如何查看 AI 生成的计划
> - 添加不同类型的注释（删除、替换、插入、评论）
> - 批准或拒绝计划

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能                    | 文件路径                                                                                      | 行号       |
|--- | --- | ---|
| 插件入口定义               | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 34-280     |
| `submit_plan` tool 定义 | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 209-252    |
|--- | --- | ---|
| 插件配置（opencode.json）注入 | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 55-63      |
| 环境变量读取               | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51      |
| 计划评审服务器启动            | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts) | 全文        |
| 代码评审服务器启动            | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts) | 全文        |
| 远程模式检测               | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 全文        |

**关键常量**：
- `PLANNOTATOR_REMOTE`: 远程模式标志（设置为 "1" 或 "true" 启用）
- `PLANNOTATOR_PORT`: 固定端口号（本地默认随机，远程默认 19432）

**关键函数**：
- `startPlannotatorServer()`: 启动计划评审服务器
- `startReviewServer()`: 启动代码评审服务器
- `getSharingEnabled()`: 获取 URL 分享开关状态（从 OpenCode 配置或环境变量）

</details>
