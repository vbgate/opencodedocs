---
title: "命令执行工具与审批完全指南：安全机制、配置和故障排查 | Clawdbot 教程"
sidebarTitle: "安全地让 AI 跑命令"
subtitle: "命令执行工具与审批"
description: "学习如何配置和使用 Clawdbot 的 exec 工具执行 Shell 命令，了解三种执行模式（sandbox/gateway/node）、安全审批机制、允许列表配置和审批流程。本教程包含实际配置示例、CLI 命令和故障排查，帮助您安全地扩展 AI 助手能力。"
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# 命令执行工具与审批

## 学完你能做什么

- 配置 exec 工具在三种执行模式（sandbox/gateway/node）下运行
- 理解并配置安全审批机制（deny/allowlist/full）
- 管理允许列表（Allowlist）和安全 bins
- 通过 UI 或聊天渠道审批 exec 请求
- 排查 exec 工具常见问题和安全错误

## 你现在的困境

exec 工具让 AI 助手可以执行 Shell 命令，这既强大又危险：

- AI 会不会删除我系统上的重要文件？
- 如何限制 AI 只能执行安全的命令？
- 不同执行模式有什么区别？
- 审批流程如何工作？
- 允列表应该怎么配置？

## 什么时候用这一招

- 需要让 AI 执行系统操作（如文件管理、代码构建）
- 想让 AI 调用自定义脚本或工具
- 需要精细控制 AI 的执行权限
- 需要安全地允许特定命令

## 🎒 开始前的准备

::: warning 前置条件
本教程假设你已完成 [启动 Gateway](../../start/gateway-startup/)，Gateway 守护进程正在运行。
:::

- 确保 Node ≥22 已安装
- Gateway 守护进程正在运行
- 了解基本的 Shell 命令和 Linux/Unix 文件系统

## 核心思路

### Exec 工具的安全三层防护

exec 工具采用三层安全机制，从粗粒度到细粒度控制 AI 的执行权限：

1. **工具策略（Tool Policy）**：在 `tools.policy` 中控制是否允许 `exec` 工具
2. **执行主机（Host）**：命令在 sandbox/gateway/node 三种环境运行
3. **审批机制（Approvals）**：在 gateway/node 模式下，可通过 allowlist 和审批提示进一步限制

::: info 为什么需要多层防护？
单层防护容易绕过或配置错误。多层防护确保即使某一层失效，其他层仍能提供保护。
:::

### 三种执行模式对比

| 执行模式 | 运行位置 | 安全级别 | 典型场景 | 是否需要审批 |
|---------|---------|---------|-----------|------------|
| **sandbox** | 容器内（如 Docker） | 高 | 隔离环境、测试 | 否 |
| **gateway** | Gateway 守护进程所在机器 | 中 | 本地开发、集成 | 是（allowlist + 审批） |
| **node** | 配对的设备节点（macOS/iOS/Android） | 中 | 设备本地操作 | 是（allowlist + 审批） |

**关键区别**：
- sandbox 模式默认**不需要审批**（但可能受 Sandbox 限制）
- gateway 和 node 模式默认**需要审批**（除非配置为 `full`）

## 跟我做

### 第 1 步：了解 exec 工具参数

**为什么**
了解 exec 工具的参数是安全配置的基础。

exec 工具支持以下参数：

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**参数说明**：

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `command` | string | 必填 | 要执行的 Shell 命令 |
| `workdir` | string | 当前工作目录 | 执行目录 |
| `env` | object | 继承环境 | 环境变量覆盖 |
| `yieldMs` | number | 10000 | 超时后自动转为后台（毫秒） |
| `background` | boolean | false | 立即后台执行 |
| `timeout` | number | 1800 | 执行超时（秒） |
| `pty` | boolean | false | 在伪终端中运行（支持 TTY） |
| `host` | string | sandbox | 执行主机：`sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | 安全策略：`deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | 审批策略：`off` \| `on-miss` \| `always` |
| `node` | string | - | node 模式下的目标节点 ID 或名称 |

**你应该看到**：参数列表清晰说明了每种执行模式的控制方式。

### 第 2 步：配置默认执行模式

**为什么**
通过配置文件设置全局默认值，避免每次 exec 调用都指定参数。

编辑 `~/.clawdbot/clawdbot.json`：

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**配置项说明**：

| 配置项 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `host` | string | sandbox | 默认执行主机 |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | 默认安全策略 |
| `ask` | string | on-miss | 默认审批策略 |
| `node` | string | - | node 模式下的默认节点 |
| `notifyOnExit` | boolean | true | 后台任务退出时发送系统事件 |
| `approvalRunningNoticeMs` | number | 10000 | 超时后发送"运行中"通知（0 禁用） |
| `pathPrepend` | string[] | - | 预置到 PATH 的目录列表 |
| `safeBins` | string[] | [默认列表] | 安全二进制列表（仅 stdin 操作） |

**你应该看到**：配置保存后，exec 工具使用这些默认值。

### 第 3 步：使用 `/exec` 会话覆盖

**为什么**
会话覆盖让你在不修改配置文件的情况下临时调整执行参数。

在聊天中发送：

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

查看当前覆盖值：

```
/exec
```

**你应该看到**：当前会话的 exec 参数配置。

### 第 4 步：配置允许列表（Allowlist）

**为什么**
allowlist 是 gateway/node 模式下的核心安全机制，只允许特定命令执行。

#### 编辑 allowlist

**通过 UI 编辑**：

1. 打开 Control UI
2. 进入 **Nodes** 标签
3. 找到 **Exec approvals** 卡片
4. 选择目标（Gateway 或 Node）
5. 选择 Agent（如 `main`）
6. 点击 **Add pattern** 添加命令模式
7. 点击 **Save** 保存

**通过 CLI 编辑**：

```bash
clawdbot approvals
```

**通过 JSON 文件编辑**：

编辑 `~/.clawdbot/exec-approvals.json`：

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Allowlist 模式说明**：

allowlist 使用 **glob 模式匹配**（不区分大小写）：

| 模式 | 匹配 | 说明 |
|------|------|------|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | 匹配所有子目录 |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | 匹配本地 bin |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | 绝对路径匹配 |

::: warning 重要规则
- **只匹配解析后的二进制路径**，不支持 basename 匹配（如 `rg`）
- Shell 链接（`&&`、`||`、`;`）需要每个段都满足 allowlist
- 重定向（`>`、`<`）在 allowlist 模式下不支持
:::

**你应该看到**：allowlist 配置后，只有匹配的命令可以执行。

### 第 5 步：了解安全 bins（Safe Bins）

**为什么**
safe bins 是一组仅支持 stdin 操作的安全二进制，可以在 allowlist 模式下无需显式 allowlist。

**默认安全 bins**：

`jq`、`grep`、`cut`、`sort`、`uniq`、`head`、`tail`、`tr`、`wc`

**安全 bin 的安全特性**：

- 拒绝位置文件参数
- 拒绝路径-like 标记
- 只能操作传入流（stdin）

**配置自定义 safe bins**：

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**你应该看到**：safe bins 命令可以在 allowlist 模式下直接执行。

### 第 6 步：通过聊天渠道审批 exec 请求

**为什么**
当 UI 不可用时，可以通过任何聊天渠道（WhatsApp、Telegram、Slack 等）审批 exec 请求。

#### 启用审批转发

编辑 `~/.clawdbot/clawdbot.json`：

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**配置项说明**：

| 配置项 | 说明 |
|-------|------|
| `enabled` | 是否启用 exec 审批转发 |
| `mode` | `"session"` \| `"targets"` \| `"both"` - 审批目标模式 |
| `agentFilter` | 只处理特定 agent 的审批请求 |
| `sessionFilter` | 会话过滤（substring 或 regex） |
| `targets` | 目标渠道列表（`channel` + `to`） |

#### 审批请求

当 exec 工具需要审批时，你会收到包含以下信息的消息：

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**审批选项**：

```
/approve abc-123 allow-once     # 允许一次
/approve abc-123 allow-always    # 总是允许（添加到 allowlist）
/approve abc-123 deny           # 拒绝
```

**你应该看到**：审批后，命令执行或被拒绝。

## 检查点 ✅

- [ ] 理解三种执行模式（sandbox/gateway/node）的区别
- [ ] 配置了全局 exec 默认参数
- [ ] 能使用 `/exec` 命令会话覆盖
- [ ] 配置了 allowlist（至少一条模式）
- [ ] 了解 safe bins 的安全特性
- [ ] 能通过聊天渠道审批 exec 请求

## 踩坑提醒

### 常见错误

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `Command not allowed by exec policy` | `security=deny` 或 allowlist 不匹配 | 检查 `tools.exec.security` 和 allowlist 配置 |
| `Approval timeout` | UI 不可用，`askFallback=deny` | 设置 `askFallback=allowlist` 或启用 UI |
| `Pattern does not resolve to binary` | allowlist 模式使用 basename | 使用完整路径（如 `/opt/homebrew/bin/rg`） |
| `Unsupported shell token` | allowlist 模式使用了 `>` 或 `&&` | 拆分命令或使用 `security=full` |
| `Node not found` | node 模式下节点未配对 | 先完成节点配对 |

### Shell 链接和重定向

::: danger 警告
在 `security=allowlist` 模式下，以下 Shell 特性**不支持**：
- 管道：`|`（但 `||` 支持）
- 重定向：`>`、`<`、`>>`
- 命令替换：`$()`、`` ` ` ``
- 后台：`&`、`;`
:::

**解决方法**：
- 使用 `security=full`（谨慎）
- 拆分为多个 exec 调用
- 编写包装脚本并 allowlist 脚本路径

### PATH 环境变量

不同执行模式的 PATH 处理方式不同：

| 执行模式 | PATH 处理 | 说明 |
|---------|-----------|------|
| `sandbox` | 继承 shell login，可能被 `/etc/profile` 重置 | `pathPrepend` 会在 profile 之后应用 |
| `gateway` | 合并登录 shell PATH 到 exec 环境 | daemon 保持最小 PATH，但 exec 继承用户 PATH |
| `node` | 只使用传递的环境变量覆盖 | macOS 节点会丢弃 `PATH` 覆盖，headless 节点支持 prepend |

**你应该看到**：PATH 配置正确影响命令查找。

## 本课小结

exec 工具通过三层防护机制（工具策略、执行主机、审批）让 AI 助手可以安全地执行 Shell 命令：

- **执行模式**：sandbox（容器隔离）、gateway（本地执行）、node（设备操作）
- **安全策略**：deny（完全禁止）、allowlist（白名单）、full（完全允许）
- **审批机制**：off（不提示）、on-miss（未匹配时提示）、always（总是提示）
- **允许列表**：glob 模式匹配解析后的二进制路径
- **安全 bins**：仅 stdin 操作的二进制可在 allowlist 模式下免审批

## 下一课预告

> 下一课我们学习 **[Web 搜索与抓取工具](../tools-web/)**
>
> 你会学到：
> - 如何使用 `web_search` 工具进行网络搜索
> - 如何使用 `web_fetch` 工具抓取网页内容
> - 如何配置搜索引擎提供商（Brave、Perplexity）
> - 如何处理搜索结果和网页抓取错误

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|------|---------|------|
| exec 工具定义 | [`src/agents/bash-tools.exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/bash-tools.exec.ts) | 1-500+ |
| exec 审批逻辑 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1-1268 |
| Shell 命令分析 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 500-1100 |
| Allowlist 匹配 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 507-521 |
| Safe bins 验证 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 836-873 |
| 审批 Socket 通信 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1210-1267 |
| 进程执行 | [`src/process/exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/process/exec.ts) | 1-125 |
| 工具配置 Schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**关键类型**：
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - 执行主机类型
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - 安全策略
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - 审批策略
- `ExecAllowlistEntry`: allowlist 条目类型（包含 `pattern`、`lastUsedAt` 等）

**关键常量**：
- `DEFAULT_SECURITY = "deny"` - 默认安全策略
- `DEFAULT_ASK = "on-miss"` - 默认审批策略
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - 默认安全 bins

**关键函数**：
- `resolveExecApprovals()`: 解析 exec-approvals.json 配置
- `evaluateShellAllowlist()`: 评估 Shell 命令是否满足 allowlist
- `matchAllowlist()`: 检查命令路径是否匹配 allowlist 模式
- `isSafeBinUsage()`: 验证命令是否为安全 bin 使用
- `requestExecApprovalViaSocket()`: 通过 Unix socket 请求审批

</details>
