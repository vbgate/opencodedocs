---
title: "插件兼容性: 解决常见插件冲突 | Antigravity Auth"
sidebarTitle: "插件冲突怎么办"
subtitle: "解决与其他插件的兼容性问题"
description: "学习如何解决 Antigravity Auth 与 oh-my-opencode、DCP 等插件的兼容性问题。配置正确的插件顺序，禁用冲突的认证方式。"
tags:
  - "FAQ"
  - "插件配置"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# 解决与其他插件的兼容性问题

**插件兼容性**是使用 Antigravity Auth 时常见的问题。不同的插件可能会相互冲突，导致认证失败、thinking blocks 丢失或请求格式错误。本教程帮你解决与 oh-my-opencode、DCP 等插件的兼容性问题。

## 学完你能做什么

- 正确配置插件加载顺序，避免 DCP 的问题
- 在 oh-my-opencode 中禁用冲突的认证方式
- 识别并移除不必要的插件
- 为并行代理场景启用 PID 偏移

## 常见兼容性问题

### 问题 1：与 oh-my-opencode 冲突

**现象**：
- 认证失败或重复弹出 OAuth 授权窗口
- 模型请求返回 400 或 401 错误
- Agent 模型配置不生效

**原因**：oh-my-opencode 默认启用了内置的 Google 认证，与 Antigravity Auth 的 OAuth 流程冲突。

::: warning 核心问题
oh-my-opencode 会拦截所有 Google 模型请求，并使用自己的认证方式。这会导致 Antigravity Auth 的 OAuth 令牌无法使用。
:::

**解决方案**：

编辑 `~/.config/opencode/oh-my-opencode.json`，添加以下配置：

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**配置说明**：

| 配置项 | 值 | 说明 |
|--- | --- | ---|
| `google_auth` | `false` | 禁用 oh-my-opencode 的内置 Google 认证 |
| `agents.<agent-name>.model` | `google/antigravity-*` | 覆盖 Agent 模型为 Antigravity 模型 |

**检查点 ✅**：

- 保存配置后重启 OpenCode
- 测试 Agent 是否使用 Antigravity 模型
- 检查是否不再弹出 OAuth 授权窗口

---

### 问题 2：与 DCP（@tarquinen/opencode-dcp）冲突

**现象**：
- Claude Thinking 模型返回错误：`thinking must be first block in message`
- 对话历史中缺少 thinking blocks
- 思考内容无法显示

**原因**：DCP 创建的 synthetic assistant messages（合成助手消息）缺少 thinking blocks，这与 Claude API 的要求冲突。

::: info 什么是 synthetic messages？
Synthetic messages 是由插件或系统自动生成的消息，用于修复对话历史或补全缺失的消息。DCP 在某些场景下会创建这些消息，但不会添加 thinking blocks。
:::

**解决方案**：

确保 Antigravity Auth 在 DCP **之前**加载。编辑 `~/.config/opencode/config.json`：

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**为什么需要这个顺序**：

- Antigravity Auth 会处理和修复 thinking blocks
- DCP 会创建 synthetic messages（可能缺少 thinking blocks）
- 如果 DCP 先加载，Antigravity Auth 无法修复 DCP 创建的消息

**检查点 ✅**：

- 检查 `opencode-antigravity-auth` 是否在 `@tarquinen/opencode-dcp` 之前
- 重启 OpenCode
- 测试 Thinking 模型是否正常显示思考内容

---

### 问题 3：并行代理场景下的账户分配

**现象**：
- 多个并行代理使用同一个账户
- 遇到速率限制时所有代理同时失败
- 配额利用率低

**原因**：默认情况下，多个并行代理会共享同一个账户选择逻辑，导致它们可能同时使用同一个账户。

::: tip 并行代理场景
当你使用 Cursor 的并行功能（如同时运行多个 Agent）时，每个 Agent 会独立发起模型请求。如果没有正确的账户分配，它们可能会"撞车"。
:::

**解决方案**：

编辑 `~/.config/opencode/antigravity.json`，启用 PID 偏移：

```json
{
  "pid_offset_enabled": true
}
```

**什么是 PID 偏移？**

PID（Process ID）偏移让每个并行代理使用不同的账户起始索引：

```
代理 1 (PID 100) → 账户 0
代理 2 (PID 101) → 账户 1
代理 3 (PID 102) → 账户 2
```

这样即使同时发起请求，也不会使用同一个账户。

**前提条件**：
- 需要至少 2 个 Google 账户
- 建议启用 `account_selection_strategy: "round-robin"` 或 `"hybrid"`

**检查点 ✅**：

- 确认已配置多个账户（运行 `opencode auth list`）
- 启用 `pid_offset_enabled: true`
- 测试并行代理是否使用不同账户（查看调试日志）

---

### 问题 4：不需要的插件

**现象**：
- 认证冲突或重复认证
- 插件加载失败或警告信息
- 配置混乱，不知道哪些插件在生效

**原因**：安装了功能重叠的插件。

::: tip 冗余插件检查
定期检查 `config.json` 中的 plugin 列表，移除不需要的插件可以避免冲突和性能问题。
:::

**不需要的插件**：

| 插件类型 | 示例 | 原因 |
|--- | --- | ---|
| **gemini-auth 插件** | `opencode-gemini-auth`、`@username/gemini-auth` | Antigravity Auth 已处理所有 Google OAuth |
| **Claude 认证插件** | `opencode-claude-auth` | Antigravity Auth 不使用 Claude 认证 |

**解决方案**：

从 `~/.config/opencode/config.json` 中移除这些插件：

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // 移除这些：
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**检查点 ✅**：

- 查看 `~/.config/opencode/config.json` 中的 plugin 列表
- 移除所有 gemini-auth 相关插件
- 重启 OpenCode，确认没有认证冲突

---

## 常见错误排查

### 错误 1：`thinking must be first block in message`

**可能原因**：
- DCP 在 Antigravity Auth 之前加载
- oh-my-opencode 的 session recovery 与 Antigravity Auth 冲突

**排查步骤**：

1. 检查插件加载顺序：
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. 确保 Antigravity Auth 在 DCP 之前

3. 如果问题仍然存在，尝试禁用 oh-my-opencode 的 session recovery（如果存在）

### 错误 2：`invalid_grant` 或认证失败

**可能原因**：
- oh-my-opencode 的 `google_auth` 未禁用
- 多个认证插件同时尝试处理请求

**排查步骤**：

1. 检查 oh-my-opencode 配置：
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. 确保值为 `false`

3. 移除其他 gemini-auth 插件

### 错误 3：并行代理都使用同一个账户

**可能原因**：
- `pid_offset_enabled` 未启用
- 账户数量少于代理数量

**排查步骤**：

1. 检查 Antigravity 配置：
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. 确保值为 `true`

3. 检查账户数量：
   ```bash
   opencode auth list
   ```

4. 如果账户少于代理数量，建议添加更多账户

---

## 配置示例

### 完整的配置示例（包含 oh-my-opencode）

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## 本课小结

插件兼容性问题通常源于认证冲突、插件加载顺序或功能重叠。通过正确配置：

- ✅ 禁用 oh-my-opencode 的内置 Google 认证（`google_auth: false`）
- ✅ 确保 Antigravity Auth 在 DCP 之前加载
- ✅ 为并行代理启用 PID 偏移（`pid_offset_enabled: true`）
- ✅ 移除冗余的 gemini-auth 插件

这些配置可以避免大多数兼容性问题，让你的 OpenCode 环境稳定运行。

## 下一课预告

> 下一课我们学习 **[迁移指南](../migration-guide/)**。
>
> 你会学到：
> - 在不同机器间迁移账户配置
> - 处理版本升级时的配置变更
> - 备份和恢复账户数据

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| Thinking blocks 处理 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930)         | 898-930 |
| 思考块签名缓存 | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | 全文件 |
| PID 偏移配置 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72)               | 69-72   |
| Session recovery（基于 oh-my-opencode） | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts)          | 全文件   |

**关键配置**：
- `pid_offset_enabled: true`：启用进程 ID 偏移，为并行代理分配不同账户
- `account_selection_strategy: "hybrid"`：智能混合账户选择策略

**关键函数**：
- `deepFilterThinkingBlocks()`：移除所有 thinking blocks（request-helpers.ts:898）
- `filterThinkingBlocksWithSignatureCache()`：根据签名缓存过滤 thinking blocks（request-helpers.ts:1183）

</details>
