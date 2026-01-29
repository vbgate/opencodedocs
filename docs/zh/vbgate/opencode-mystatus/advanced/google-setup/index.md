---
title: "Google Cloud: 多账号管理 | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Google Cloud: 多账号管理 | opencode-mystatus"
description: "学习 Google Cloud Antigravity 多账号管理。添加多个账号，查看 4 个模型的额度使用情况，理解 Project ID 的区别和模型映射关系。"
tags:
  - "Google Cloud"
  - "多账号管理"
  - "Antigravity"
  - "模型映射"
prerequisite:
  - "start-quick-start"
order: 1
---

# Google Cloud 高级配置：多账号和模型管理

## 学完你能做什么

配置多个 Google Cloud 账号，一键查看所有账号的额度使用情况，了解 4 个模型的映射关系（G3 Pro、G3 Image、G3 Flash、Claude），解决单账号模型额度不足的问题。

## 核心思路

### 多账号支持

opencode-mystatus 支持同时查询多个 Google Cloud Antigravity 账号。每个账号独立显示其 4 个模型的额度，方便你管理多个项目的额度分配。

账号存储在 `~/.config/opencode/antigravity-accounts.json` 中，由 `opencode-antigravity-auth` 插件管理。你需要先安装该插件才能添加 Google Cloud 账号。

### 模型映射关系

Google Cloud Antigravity 提供多个模型，插件会显示其中 4 个最常用的：

| 显示名称 | 模型 Key（主） | 模型 Key（备选） |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

**为什么有备选 Key？**

某些模型有两个版本（high/low），插件会优先显示主 key 的数据，如果主 key 没有额度信息，会自动使用备选 key 的数据。

### Project ID 的使用

查询额度时需要提供 Project ID，插件会优先使用 `projectId`，如果不存在则使用 `managedProjectId`。这两个 ID 都可以在添加账号时配置。

## 🎒 开始前的准备

::: warning 前置条件
确保你已经：
- [x] 完成快速开始教程（[Quick Start](/zh/vbgate/opencode-mystatus/start/quick-start/)）
- [x] 已安装 opencode-mystatus 插件
- [x] 安装了 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 插件
:::

## 跟我做

### 第 1 步：添加第一个 Google Cloud 账号

**为什么**
第一个账号是基础，添加成功后才能测试多账号查询。

使用 `opencode-antigravity-auth` 插件添加账号。假设你已经安装了该插件：

```bash
# 让 AI 帮你安装（推荐）
# 在 Claude/OpenCode 中输入：
Install the opencode-antigravity-auth plugin from: https://github.com/NoeFabris/opencode-antigravity-auth
```

安装完成后，按照该插件的文档完成 Google OAuth 认证。

**你应该看到**：
- 账号信息已保存到 `~/.config/opencode/antigravity-accounts.json`
- 文件内容类似：
  ```json
  {
    "version": 1,
    "accounts": [
      {
        "email": "user1@gmail.com",
        "refreshToken": "1//...",
        "projectId": "my-project-123",
        "managedProjectId": "managed-project-456",
        "addedAt": 1737600000000,
        "lastUsed": 1737600000000
      }
    ]
  }
  ```

### 第 2 步：查询 Google Cloud 额度

**为什么**
验证第一个账号配置是否正确，查看 4 个模型的额度情况。

```bash
/mystatus
```

**你应该看到**：

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### 第 3 步：添加第二个 Google Cloud 账号

**为什么**
当你有多个 Google Cloud 账号时，可以同时管理多个项目的额度分配。

重复第 1 步的流程，使用另一个 Google 账号登录。

添加完成后，`antigravity-accounts.json` 文件会变成：

```json
{
  "version": 1,
  "accounts": [
    {
      "email": "user1@gmail.com",
      "refreshToken": "1//...",
      "projectId": "my-project-123",
      "addedAt": 1737600000000,
      "lastUsed": 1737600000000
    },
    {
      "email": "user2@gmail.com",
      "refreshToken": "2//...",
      "projectId": "another-project-456",
      "addedAt": 1737700000000,
      "lastUsed": 1737700000000
    }
  ]
}
```

### 第 4 步：查看多账号额度

**为什么**
确认两个账号的额度都正确显示，方便你规划各账号的使用。

```bash
/mystatus
```

**你应该看到**：

```
## Google Cloud Account Quota

### user1@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### user2@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 65%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
G3 Flash   2h 30m     ██████████████░░░░░░ 80%
Claude     1d 5h      ████████░░░░░░░░░░░ 35%
```

## 踩坑提醒

### 账号不显示

**问题**：添加了账号，但 `mystatus` 没有显示。

**原因**：账号没有邮箱字段。插件会过滤掉没有 `email` 的账号（见源码 `google.ts:318`）。

**解决方法**：确保 `antigravity-accounts.json` 中每个账号都有 `email` 字段。

### 缺少 Project ID

**问题**：显示错误 "No project ID found"。

**原因**：账号配置中既没有 `projectId` 也没有 `managedProjectId`。

**解决方法**：重新添加账号时确保填写了 Project ID。

### 模型数据为空

**问题**：某个模型显示为 0% 或没有数据。

**原因**：
1. 该账号确实没有使用过该模型
2. 该模型的额度信息没有返回（某些模型可能需要特殊权限）

**解决方法**：
- 这是正常情况，只要账号有额度数据即可
- 如果所有模型都是 0%，检查账号权限是否正确

## 本课小结

- 安装 `opencode-antigravity-auth` 插件是使用 Google Cloud 额度查询的前提
- 支持多账号同时查询，每个账号独立显示 4 个模型的额度
- 模型映射关系：G3 Pro（支持 high/low）、G3 Image、G3 Flash、Claude（支持 thinking/normal）
- 插件优先使用 `projectId`，不存在则使用 `managedProjectId`
- 账号必须包含 `email` 字段才会被查询

## 下一课预告

> 下一课我们学习 **[GitHub Copilot 认证配置](/zh/vbgate/opencode-mystatus/advanced/copilot-auth/)**。
>
> 你会学到：
> - 两种 Copilot 认证方式：OAuth Token 和 Fine-grained PAT
> - 如何解决 Copilot 权限问题
> - 不同订阅类型的额度差异

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 模型配置映射 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |
| 多账号并行查询 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 327-334 |
| 账号过滤（必须有邮箱） | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 318 |
| Project ID 优先级 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 231 |
| 模型额度提取 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 132-157 |
| AntigravityAccount 类型定义 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 78-86 |

**关键常量**：
- `MODELS_TO_DISPLAY`：4 个模型的配置（key、altKey、display）
- `GOOGLE_QUOTA_API_URL`：Google Cloud 额度 API 地址
- `USER_AGENT`：请求 User-Agent（antigravity/1.11.9）

**关键函数**：
- `queryGoogleUsage()`：查询所有 Google Cloud 账号的额度
- `fetchAccountQuota()`：查询单个账号的额度（包含 Token 刷新）
- `extractModelQuotas()`：从 API 响应中提取 4 个模型的额度信息
- `formatAccountQuota()`：格式化单个账号的额度输出

</details>
