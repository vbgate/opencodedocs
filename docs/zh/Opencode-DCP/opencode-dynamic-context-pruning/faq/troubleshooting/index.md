---
title: "FAQ: 常见问题排查 | opencode-dcp"
sidebarTitle: "遇到问题怎么办"
subtitle: "常见问题与排错"
description: "学习如何解决 OpenCode DCP 使用中的常见问题，包括配置错误修复、调试方法启用、Token 未减少原因等故障排除技巧。"
tags:
  - "FAQ"
  - "troubleshooting"
  - "配置"
  - "调试"
prerequisite:
  - "start-getting-started"
order: 1
---

# 常见问题与排错

## 配置相关问题

### 为什么我的配置没有生效？

DCP 配置文件按优先级合并：**默认值 < 全局 < 环境变量 < 项目**。项目级配置优先级最高。

**检查步骤**：

1. **确认配置文件位置**：
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # 或在项目根目录
   ls -la .opencode/dcp.jsonc
   ```

2. **查看生效的配置**：
   启用调试模式后，DCP 会在首次加载配置时输出配置信息到日志文件。

3. **重启 OpenCode**：
   修改配置后必须重启 OpenCode 才能生效。

::: tip 配置优先级
如果你同时存在多个配置文件，项目级配置（`.opencode/dcp.jsonc`）会覆盖全局配置。
:::

### 配置文件报错怎么办？

DCP 会在检测到配置错误时显示 Toast 警告（7 秒后显示），并降级使用默认值。

**常见错误类型**：

| 错误类型 | 问题描述 | 解决方法 |
|---------|---------|---------|
| 类型错误 | `pruneNotification` 应为 `"off" | "minimal" | "detailed"` | 检查枚举值拼写 |
| 数组错误 | `protectedFilePatterns` 必须是字符串数组 | 确保使用 `["pattern1", "pattern2"]` 格式 |
| 未知键 | 配置文件包含不支持的键 | 删除或注释掉未知键 |

**启用调试日志查看详细错误**：

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // 启用调试日志
}
```

日志文件位置：`~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## 功能相关问题

### 为什么 Token 使用量没有减少？

DCP 只修剪**工具调用**内容，如果你的对话没有使用工具，或者使用的都是受保护工具，Token 不会减少。

**可能原因**：

1. **受保护工具**
   默认受保护的工具包括：`task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **回合保护未过期**
   如果启用了 `turnProtection`，工具在保护期内不会被修剪。

3. **对话中没有重复或可修剪的内容**
   DCP 的自动策略只针对：
   - 重复的工具调用（去重）
   - 已被读取覆盖的写操作（覆盖写入）
   - 过期的错误工具输入（清除错误）

**检查方法**：

```bash
# 在 OpenCode 中输入
/dcp context
```

查看输出中的 `Pruned` 字段，了解已修剪的工具数量和节省的 Token。

::: info 手动修剪
如果自动策略没有触发，可以使用 `/dcp sweep` 手动修剪工具。
:::

### 子代理会话为什么没有修剪？

**这是预期行为**。DCP 在子代理会话中完全禁用。

**原因**：子代理的设计目标是返回简洁的发现摘要，而不是优化 Token 使用。DCP 的修剪可能干扰子代理的总结行为。

**如何判断是否为子代理会话**：
- 检查会话元数据中的 `parentID` 字段
- 启用调试日志后，会看到 `isSubAgent: true` 的标记

---

## 调试和日志

### 如何启用调试日志？

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**日志文件位置**：
- **每日日志**：`~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **上下文快照**：`~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning 性能影响
调试日志会写入磁盘文件，可能影响性能。生产环境建议关闭。
:::

### 如何查看当前会话的 Token 分布？

```bash
# 在 OpenCode 中输入
/dcp context
```

**输出示例**：

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

### 如何查看累计修剪统计？

```bash
# 在 OpenCode 中输入
/dcp stats
```

这会显示所有历史会话的累计修剪 Token 数。

---

## Prompt Caching 相关

### DCP 会影响 Prompt Caching 吗？

**会**，但权衡后通常是正收益。

LLM 提供商（如 Anthropic、OpenAI）基于**精确前缀匹配**缓存 prompt。当 DCP 修剪工具输出时，会改变消息内容，从该点向前缓存失效。

**实际测试结果**：
- 无 DCP：缓存命中率约 85%
- 启用 DCP：缓存命中率约 65%

**但 Token 节省通常超过缓存损失**，特别是在长对话中。

**最佳使用场景**：
- 使用按请求计费的服务（如 GitHub Copilot、Google Antigravity）时，缓存损失无负面影响

---

## 高级配置

### 如何保护特定文件不被修剪？

使用 `protectedFilePatterns` 配置 glob 模式：

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // 保护 config 目录
        "*.env",           // 保护所有 .env 文件
        "**/secrets/**"    // 保护 secrets 目录
    ]
}
```

模式匹配工具参数中的 `filePath` 字段（如 `read`、`write`、`edit` 工具）。

### 如何自定义受保护工具？

每个策略和工具配置都有 `protectedTools` 数组：

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // 额外保护的工具
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

这些配置会**累加**到默认受保护工具列表。

---

## 常见错误场景

### 错误：DCP 未加载

**可能原因**：
1. 插件未在 `opencode.jsonc` 中注册
2. 插件安装失败
3. OpenCode 版本不兼容

**解决方法**：
1. 检查 `opencode.jsonc` 是否包含 `"plugin": ["@tarquinen/opencode-dcp@latest"]`
2. 重启 OpenCode
3. 查看日志文件确认加载状态

### 错误：配置文件无效 JSON

**可能原因**：
- 缺少逗号
- 多余逗号
- 字符串未使用双引号
- JSONC 注释格式错误

**解决方法**：
使用支持 JSONC 的编辑器（如 VS Code）编辑，或使用在线 JSON 验证工具检查语法。

### 错误：/dcp 命令不响应

**可能原因**：
- `commands.enabled` 设为 `false`
- 插件未正确加载

**解决方法**：
1. 检查配置文件中 `"commands.enabled"` 是否为 `true`
2. 确认插件已加载（查看日志）

---

## 获取帮助

如果以上方法无法解决问题：

1. **启用调试日志**并重现问题
2. **查看上下文快照**：`~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **在 GitHub 提交 Issue**：
   - 附带日志文件（删除敏感信息）
   - 描述复现步骤
    - 说明预期行为和实际行为

---

## 下一课预告

> 下一课我们学习 **[DCP 最佳实践](../best-practices/)**。
>
> 你会学到：
> - Prompt Caching 与 Token 节省的权衡关系
> - 配置优先级规则和使用策略
> - 保护机制的选择和配置
> - 命令使用技巧和优化建议

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                      | 行号        |
| ----------- | ------------------------------------------------------------------------------------------- | ----------- |
| 配置验证     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)  | 147-375    |
| 配置错误处理 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421)  | 391-421    |
| 日志系统     | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109)      | 6-109      |
| 上下文快照   | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210)    | 196-210    |
| 子代理检测   | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8        |
| 受保护工具   | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)   | 68-79      |

**关键函数**：
- `validateConfigTypes()`：验证配置项类型
- `getInvalidConfigKeys()`：检测配置文件中的未知键
- `Logger.saveContext()`：保存上下文快照用于调试
- `isSubAgentSession()`：检测子代理会话

</details>
