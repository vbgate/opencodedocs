---
title: "API 参考: 本地接口文档 | plannotator"
sidebarTitle: "API 一查便知"
subtitle: "API 参考: 本地接口文档 | plannotator"
description: "了解 Plannotator 提供的所有 API 端点和请求/响应格式。详细介绍计划评审、代码评审、图片上传等接口的完整规范，方便集成开发。"
tags:
  - "API"
  - "附录"
prerequisite:
  - "start-getting-started"
order: 1
---

# Plannotator API 参考

## 学完你能做什么

- 了解 Plannotator 本地服务器提供的所有 API 端点
- 查看每个 API 的请求和响应格式
- 理解计划评审和代码评审的接口差异
- 为集成或扩展开发提供参考

## 概述

Plannotator 在本地运行 HTTP 服务器（使用 Bun.serve），为计划评审和代码评审提供 RESTful API。所有 API 响应格式为 JSON，无认证要求（本地隔离环境）。

**服务器启动方式**：
- 随机端口（本地模式）
- 固定端口 19432（远程/Devcontainer 模式，可通过 `PLANNOTATOR_PORT` 覆盖）

**API 基础 URL**：`http://localhost:<PORT>/api/`

::: tip 提示
以下 API 按功能模块分类，相同路径在计划评审和代码评审服务器中的行为可能不同。
:::

## 计划评审 API

### GET /api/plan

获取当前计划内容及相关元信息。

**请求**：无

**响应示例**：

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `plan` | string | 计划的 Markdown 内容 |
| `origin` | string | 来源标识（`"claude-code"` 或 `"opencode"`） |
| `permissionMode` | string | 当前权限模式（Claude Code 专用） |
| `sharingEnabled` | boolean | 是否启用 URL 分享 |

---

### POST /api/approve

批准当前计划，可选保存到笔记应用。

**请求体**：

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "批准时的备注（仅 OpenCode）",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**响应示例**：

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `obsidian` | object | 否 | Obsidian 保存配置 |
| `bear` | object | 否 | Bear 保存配置 |
| `feedback` | string | 否 | 批准时附带的备注（仅 OpenCode） |
| `agentSwitch` | string | 否 | 切换到的 Agent 名称（仅 OpenCode） |
| `permissionMode` | string | 否 | 请求的权限模式（仅 Claude Code） |
| `planSave` | object | 否 | 计划保存配置 |

**Obsidian 配置字段**：

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `vaultPath` | string | 是 | Vault 文件路径 |
| `folder` | string | 否 | 目标文件夹（默认根目录） |
| `tags` | string[] | 否 | 自动生成的标签 |
| `plan` | string | 是 | 计划内容 |

---

### POST /api/deny

拒绝当前计划并反馈意见。

**请求体**：

```json
{
  "feedback": "需要补充单元测试覆盖",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**响应示例**：

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `feedback` | string | 否 | 拒绝理由（默认 "Plan rejected by user"） |
| `planSave` | object | 否 | 计划保存配置 |

---

### GET /api/obsidian/vaults

检测本地已配置的 Obsidian vaults。

**请求**：无

**响应示例**：

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**配置文件路径**：
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## 代码评审 API

### GET /api/diff

获取当前 git diff 内容。

**请求**：无

**响应示例**：

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `rawPatch` | string | Git diff 统一格式 patch |
| `gitRef` | string | 使用的 Git 引用 |
| `origin` | string | 来源标识 |
| `diffType` | string | 当前 diff 类型 |
| `gitContext` | object | Git 上下文信息 |
| `sharingEnabled` | boolean | 是否启用 URL 分享 |

**gitContext 字段说明**：

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `currentBranch` | string | 当前分支名 |
| `defaultBranch` | string | 默认分支名（main 或 master） |
| `diffOptions` | object[] | 可用的 diff 类型选项（包含 id 和 label） |

---

### POST /api/diff/switch

切换到不同类型的 git diff。

**请求体**：

```json
{
  "diffType": "staged"
}
```

**支持的 diff 类型**：

| 类型 | Git 命令 | 说明 |
| ---- | -------- | ---- |
| `uncommitted` | `git diff HEAD` | 未提交的改动（默认） |
| `staged` | `git diff --staged` | 已暂存的改动 |
| `last-commit` | `git diff HEAD~1..HEAD` | 最后一次提交 |
| `vs main` | `git diff main..HEAD` | 当前分支 vs main |

**响应示例**：

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

提交代码评审反馈给 AI Agent。

**请求体**：

```json
{
  "feedback": "建议添加错误处理逻辑",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "这里应该用 try-catch",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `feedback` | string | 否 | 文本反馈（LGTM 或其他） |
| `annotations` | array | 否 | 结构化注释数组 |
| `agentSwitch` | string | 否 | 切换到的 Agent 名称（仅 OpenCode） |

**annotation 对象字段**：

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `id` | string | 是 | 唯一标识 |
| `type` | string | 是 | 类型：`comment`、`suggestion`、`concern` |
| `filePath` | string | 是 | 文件路径 |
| `lineStart` | number | 是 | 起始行号 |
| `lineEnd` | number | 是 | 结束行号 |
| `side` | string | 是 | 侧：`"old"` 或 `"new"` |
| `text` | string | 否 | 评论内容 |
| `suggestedCode` | string | 否 | 建议代码（suggestion 类型） |

**响应示例**：

```json
{
  "ok": true
}
```

---

## 共享 API

### GET /api/image

获取图片（本地文件路径或上传的临时文件）。

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `path` | string | 是 | 图片文件路径 |

**示例请求**：`GET /api/image?path=/tmp/plannotator/abc-123.png`

**响应**：图片文件（PNG/JPEG/WebP）

**错误响应**：
- `400` - 缺少 path 参数
- `404` - 文件不存在
- `500` - 读取文件失败

---

### POST /api/upload

上传图片到临时目录，返回可访问的路径。

**请求**：`multipart/form-data`

| 字段 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| `file` | File | 是 | 图片文件 |

**支持的格式**：PNG、JPEG、WebP

**响应示例**：

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**错误响应**：
- `400` - 未提供文件
- `500` - 上传失败

::: info 说明
上传的图片保存在 `/tmp/plannotator` 目录，服务器关闭后不会自动清理。
:::

---

### GET /api/agents

获取可用的 OpenCode Agents 列表（仅 OpenCode）。

**请求**：无

**响应示例**：

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**过滤规则**：
- 只返回 `mode === "primary"` 的 agents
- 排除 `hidden === true` 的 agents

**错误响应**：

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## 错误处理

### HTTP 状态码

| 状态码 | 说明 |
| ------ | ---- |
| `200` | 请求成功 |
| `400` | 参数校验失败 |
| `404` | 资源不存在 |
| `500` | 服务器内部错误 |

### 错误响应格式

```json
{
  "error": "错误描述信息"
}
```

### 常见错误

| 错误 | 触发条件 |
| ---- | -------- |
| `Missing path parameter` | `/api/image` 缺少 `path` 参数 |
| `File not found` | `/api/image` 指定的文件不存在 |
| `No file provided` | `/api/upload` 未上传文件 |
| `Missing diffType` | `/api/diff/switch` 缺少 `diffType` 字段 |
| `Port ${PORT} in use` | 端口已被占用（服务器启动失败） |

---

## 服务器行为

### 端口重试机制

- 最大重试次数：5 次
- 重试延迟：500 毫秒
- 超时错误：`Port ${PORT} in use after 5 retries`

::: warning 远程模式提示
远程/Devcontainer 模式下，如果端口被占用，可以通过设置 `PLANNOTATOR_PORT` 环境变量使用其他端口。
:::

### 决策等待

服务器启动后进入等待用户决策的状态：

**计划评审服务器**：
- 等待 `/api/approve` 或 `/api/deny` 调用
- 调用后返回决策并关闭服务器

**代码评审服务器**：
- 等待 `/api/feedback` 调用
- 调用后返回反馈并关闭服务器

### SPA 回退

所有未匹配的路径返回嵌入式 HTML（单页应用）：

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

这确保了前端路由正常工作。

---

## 环境变量

| 变量 | 说明 | 默认值 |
| ---- | ---- | ------ |
| `PLANNOTATOR_REMOTE` | 启用远程模式 | 未设置 |
| `PLANNOTATOR_PORT` | 固定端口号 | 随机（本地）/ 19432（远程） |
| `PLANNOTATOR_ORIGIN` | 来源标识 | `"claude-code"` 或 `"opencode"` |
| `PLANNOTATOR_SHARE` | 禁用 URL 分享 | 未设置（启用） |

::: tip 提示
更多环境变量配置详见 [环境变量配置](../../advanced/environment-variables/) 章节。
:::

---

## 本课小结

Plannotator 提供了完整的本地 HTTP API，支持计划评审和代码评审两大核心功能：

- **计划评审 API**：获取计划、批准/拒绝决策、Obsidian/Bear 集成
- **代码评审 API**：获取 diff、切换 diff 类型、提交结构化反馈
- **共享 API**：图片上传下载、Agent 列表查询
- **错误处理**：统一的 HTTP 状态码和错误格式

所有 API 都在本地运行，无数据上传，安全可靠。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 计划评审服务器入口 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents（计划评审） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| 代码评审服务器入口 | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents（代码评审） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**关键常量**：
- `MAX_RETRIES = 5`：服务器启动最大重试次数（`packages/server/index.ts:79`、`packages/server/review.ts:68`）
- `RETRY_DELAY_MS = 500`：端口重试延迟（`packages/server/index.ts:80`、`packages/server/review.ts:69`）

**关键函数**：
- `startPlannotatorServer(options)`：启动计划评审服务器（`packages/server/index.ts:91`）
- `startReviewServer(options)`：启动代码评审服务器（`packages/server/review.ts:79`）

</details>
