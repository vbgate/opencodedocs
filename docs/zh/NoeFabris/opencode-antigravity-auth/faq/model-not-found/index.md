---
title: "模型错误排查: 解决 400 和 MCP 问题 | opencode-antigravity-auth"
sidebarTitle: "模型找不到怎么办"
subtitle: "模型未找到和 400 错误排查"
description: "学习排查 Antigravity 模型错误的方法。涵盖 Model not found、400 Unknown name parameters 错误的诊断和修复流程，以及 MCP 服务器兼容性问题的排查和解决方案，帮助你快速定位问题。"
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# 模型未找到和 400 错误排查

## 你遇到的问题

使用 Antigravity 模型时，可能会遇到以下几种错误：

| 错误信息 | 典型症状 |
| --------- | --------- |
| `Model not found` | 提示模型不存在，无法发起请求 |
| `Invalid JSON payload received. Unknown name "parameters"` | 400 错误，工具调用失败 |
| MCP 服务器调用报错 | 特定 MCP 工具无法使用 |

这些问题通常与配置、MCP 服务器兼容性或插件版本有关。

## 快速诊断

在深入排查前，先确认：

**macOS/Linux**：
```bash
# 检查插件版本
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# 检查配置文件
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**：
```powershell
# 检查插件版本
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# 检查配置文件
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## 问题 1：Model not found

**错误现象**：

```
Model not found: antigravity-claude-sonnet-4-5
```

**原因**：OpenCode 的 Google provider 配置缺少 `npm` 字段。

**解决方案**：

在你的 `~/.config/opencode/opencode.json` 中，为 `google` provider 添加 `npm` 字段：

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**验证步骤**：

1. 编辑 `~/.config/opencode/opencode.json`
2. 保存文件
3. 在 OpenCode 中重新尝试调用模型
4. 检查是否仍然出现 "Model not found" 错误

::: tip 提示
如果不确定配置文件位置，运行：
```bash
opencode config path
```
:::

---

## 问题 2：400 错误 - Unknown name 'parameters'

**错误现象**：

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**这是什么问题？**

Gemini 3 模型使用**严格的 protobuf 验证**，而 Antigravity API 要求工具定义使用特定格式：

```json
// ❌ 错误格式（会被拒绝）
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← 这个字段不被接受
    }
  ]
}

// ✅ 正确格式
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← 在 functionDeclarations 内部
        }
      ]
    }
  ]
}
```

插件会自动转换格式，但某些 **MCP 服务器返回的 Schema 包含不兼容字段**（如 `const`、`$ref`、`$defs`），导致清理失败。

### 解决方案 1：更新到最新 beta 版本

最新的 beta 版本包含 Schema 清理修复：

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**：
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**：
```powershell
npm install -g opencode-antigravity-auth@beta
```

### 解决方案 2：禁用 MCP 服务器逐个排查

某些 MCP 服务器返回的 Schema 格式不符合 Antigravity 要求。

**步骤**：

1. 打开 `~/.config/opencode/opencode.json`
2. 找到 `mcpServers` 配置
3. **禁用所有 MCP 服务器**（注释掉或删除）
4. 重新尝试调用模型
5. 如果成功，逐个**启用 MCP 服务器**，每次启用一个后测试
6. 找出导致错误的 MCP 服务器后，禁用它或向该项目的维护者报告问题

**示例配置**：

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← 暂时禁用
    // "github": { ... },       ← 暂时禁用
    "brave-search": { ... }     ← 先测试这一个
  }
}
```

### 解决方案 3：添加 npm override

如果以上方法无效，在 `google` provider 配置中强制使用 `@ai-sdk/google`：

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## 问题 3：MCP 服务器导致工具调用失败

**错误现象**：

- 特定工具无法使用（如 WebFetch、文件操作等）
- 错误提示 Schema 相关问题
- 其他工具正常工作

**原因**：MCP 服务器返回的 JSON Schema 包含 Antigravity API 不支持的字段。

### 不兼容的 Schema 特征

插件会自动清理以下不兼容特性（源码 `src/plugin/request-helpers.ts:24-37`）：

| 特性 | 转换方式 | 示例 |
| ---- | --------- | ---- |
| `const` | 转换为 `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | 转换为 description hint | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "See: Foo" }` |
| `$defs` / `definitions` | 展开到 schema 中 | 不再使用引用 |
| `minLength` / `maxLength` / `pattern` | 移到 description | 添加到 `description` 提示 |
| `additionalProperties` | 移到 description | 添加到 `description` 提示 |

但如果 Schema 结构过于复杂（如多层嵌套的 `anyOf`/`oneOf`），清理可能失败。

### 排查流程

```bash
# 启用调试日志
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# 重启 OpenCode

# 查看日志中的 Schema 转换错误
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**日志中查找的关键词**：

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### 报告问题

如果确定某个 MCP 服务器导致问题，请提交 [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues)，包含：

1. **MCP 服务器名称和版本**
2. **完整的错误日志**（从 `~/.config/opencode/antigravity-logs/`）
3. **触发问题的工具示例**
4. **插件版本**（运行 `opencode --version`）

---

## 踩坑提醒

::: warning 禁用插件顺序

如果你同时使用 `opencode-antigravity-auth` 和 `@tarquinen/opencode-dcp`，**将 Antigravity Auth 插件放在前面**：

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← 必须在 DCP 之前
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP 会创建缺乏思考块的合成 assistant 消息，可能导致签名验证错误。
:::

::: warning 配置键名错误

确保使用 `plugin`（单数），不是 `plugins`（复数）：

```json
// ❌ 错误
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ 正确
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## 何时寻求帮助

如果尝试以上所有方法后问题仍然存在：

**检查日志文件**：
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**重置账户**（清除所有状态）：
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**提交 GitHub issue**，包含：
- 完整的错误信息
- 插件版本（`opencode --version`）
- `~/.config/opencode/antigravity.json` 配置（**删除敏感信息如 refreshToken**）
- 调试日志（`~/.config/opencode/antigravity-logs/latest.log`）

---

## 相关课程

- [快速安装指南](/zh/NoeFabris/opencode-antigravity-auth/start/quick-install/) - 基础配置
- [插件兼容性](/zh/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - 其他插件冲突排查
- [调试日志](/zh/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - 启用详细日志

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| ---- | --------- | ---- |
| JSON Schema 清理主函数 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| 转换 const 为 enum | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| 转换 $ref 为 hints | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| 展平 anyOf/oneOf | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Gemini 工具格式转换 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**关键常量**：
- `UNSUPPORTED_KEYWORDS`：被移除的 Schema 关键字（`request-helpers.ts:33-37`）
- `UNSUPPORTED_CONSTRAINTS`：移到 description 的约束（`request-helpers.ts:24-28`）

**关键函数**：
- `cleanJSONSchemaForAntigravity(schema)`：清理不兼容的 JSON Schema
- `convertConstToEnum(schema)`：将 `const` 转换为 `enum`
- `convertRefsToHints(schema)`：将 `$ref` 转换为 description hints
- `flattenAnyOfOneOf(schema)`：展平 `anyOf`/`oneOf` 结构

</details>
