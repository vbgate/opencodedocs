---
title: "最佳实践: 配置优化 | opencode-dynamic-context-pruning"
subtitle: "最佳实践: 配置优化"
sidebarTitle: "省 40% Token"
description: "学习 DCP 最佳实践配置方法。掌握策略选择、回合保护、工具保护及通知模式配置，优化 Token 使用。"
tags:
  - "最佳实践"
  - "Token 节省"
  - "配置"
  - "优化"
prerequisite:
  - "start-configuration"
  - "platforms-auto-pruning"
order: 2
---

# DCP 最佳实践

## 学完你能做什么

- 了解 Prompt Caching 与 Token 节省的权衡关系
- 选择适合你的保护策略（回合保护、受保护工具、文件模式）
- 使用命令手动优化 Token 使用
- 根据项目需求定制 DCP 配置

## Prompt Caching 权衡

### 理解缓存与修剪的权衡

DCP 修剪工具输出时会改变消息内容，这会导致基于**精确前缀匹配**的 Prompt Caching 从该点向前失效。

**测试数据对比**：

| 场景           | 缓存命中率 | Token 节省 | 综合收益 |
|--- | --- | --- | ---|
| 无 DCP         | ~85%      | 0%        | 基线   |
| 启用 DCP       | ~65%      | 20-40%    | ✅ 正收益 |

### 何时应该忽略缓存损失

**推荐使用 DCP 的场景**：

- ✅ **长对话**（超过 20 轮）：上下文膨胀显著，Token 节省远超缓存损失
- ✅ **按请求计费**的服务：GitHub Copilot、Google Antigravity 等缓存损失无负面影响
- ✅ **密集工具调用**：频繁读取文件、执行搜索等场景
- ✅ **代码重构任务**：重复读取同一文件的场景频繁

**可能需要关闭 DCP 的场景**：

- ⚠️ **短对话**（< 10 轮）：修剪收益有限，缓存损失可能更明显
- ⚠️ **缓存敏感型任务**：需要最大化缓存命中率的场景（如批处理任务）

::: tip 灵活配置
你可以根据项目需求动态调整 DCP 配置，甚至在项目级配置中禁用特定策略。
:::

---

## 配置优先级最佳实践

### 多层级配置的正确使用

DCP 配置按以下优先级合并：

```
默认值 < 全局配置 < 自定义配置目录 < 项目配置
```

::: info 配置目录说明
"自定义配置目录"是通过设置 `$OPENCODE_CONFIG_DIR` 环境变量来指定的目录。该目录下需要放置 `dcp.jsonc` 或 `dcp.json` 文件。
:::

### 推荐的配置策略

| 场景             | 推荐配置位置 | 示例配置重点                     |
|--- | --- | ---|
| **个人开发环境**   | 全局配置    | 启用自动策略、禁用调试日志          |
| **团队协作项目**   | 项目配置    | 项目特定的受保护文件、策略开关         |
| **CI/CD 环境**   | 自定义配置目录  | 禁用通知、启用调试日志             |
| **临时调试**       | 项目配置    | 启用 `debug`、详细通知模式           |

**示例：项目级配置覆盖**

```jsonc
// ~/.config/opencode/dcp.jsonc（全局配置）
{
    "enabled": true,
    "strategies": {
        "deduplication": {
            "enabled": true
        }
    }
}
```

```jsonc
// .opencode/dcp.jsonc（项目配置）
{
    "strategies": {
        // 项目级覆盖：禁用去重（比如项目需要保留历史上下文）
        "deduplication": {
            "enabled": false
        }
    }
}
```

::: warning 修改配置后重启
配置修改后必须重启 OpenCode 才能生效。
:::

---

## 保护策略选择

### 回合保护的使用场景

**回合保护**（Turn Protection）防止工具在指定回合数内被修剪，给 AI 足够时间引用最近的内容。

**推荐设置**：

| 场景                   | 推荐值    | 原因                     |
|--- | --- | ---|
| **复杂问题解决**       | 4-6 回合 | AI 需要多次迭代分析工具输出      |
| **代码重构**           | 2-3 回合 | 上下文切换较快，保护期过长影响效果    |
| **快速原型开发**       | 2-4 回合 | 平衡保护和 Token 节省        |
| **默认配置**           | 4 回合    | 经过测试的平衡点              |

**何时启用回合保护**：

```jsonc
{
    "turnProtection": {
        "enabled": true,   // 启用回合保护
        "turns": 6        // 保护 6 回合（适合复杂任务）
    }
}
```

**何时不建议启用**：

- 简单问答场景（AI 直接回答，不需要工具）
- 高频短对话（保护期过长导致修剪不及时）

### 受保护工具的配置

**默认受保护工具**（无需额外配置）：
- `task`、`write`、`edit`、`batch`、`discard`、`extract`、`todowrite`、`todoread`、`plan_enter`、`plan_exit`

::: warning Schema 默认值说明
如果你使用 IDE 的自动补全功能，Schema 文件（`dcp.schema.json`）中的默认受保护工具列表可能显示不完整。实际以源码定义的 `DEFAULT_PROTECTED_TOOLS` 为准，包含所有 10 个工具。
:::

**何时添加额外受保护工具**：

| 场景                   | 示例配置                              | 原因                     |
|--- | --- | ---|
| **关键业务工具**       | `protectedTools: ["critical_tool"]` | 确保关键操作始终可见            |
| **需要历史上下文的工具** | `protectedTools: ["analyze_history"]` | 保留完整历史用于分析            |
| **自定义任务工具**     | `protectedTools: ["custom_task"]` | 保护自定义任务的工作流            |

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_analyze"]  // 额外保护特定工具
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["important_check"]  // LLM 工具额外保护
        }
    }
}
```

### 受保护文件模式的使用

**推荐的保护模式**：

| 文件类型             | 推荐模式                     | 保护原因                 |
|--- | --- | ---|
| **配置文件**           | `"*.env"`, `".env*"`        | 防止敏感信息被修剪丢失          |
| **数据库配置**          | `"**/config/database/*"`    | 确保数据库连接配置始终可用        |
| **密钥文件**           | `"**/secrets/**"`          | 保护所有密钥和证书            |
| **核心业务逻辑**        | `"src/core/*"`            | 防止关键代码上下文丢失          |

```jsonc
{
    "protectedFilePatterns": [
        "*.env",                // 保护所有环境变量文件
        ".env.*",              // 包括 .env.local 等
        "**/secrets/**",       // 保护 secrets 目录
        "**/config/*.json",    // 保护配置文件
        "src/auth/**"          // 保护认证相关代码
    ]
}
```

::: tip 模式匹配规则
`protectedFilePatterns` 匹配工具参数中的 `filePath` 字段（如 `read`、`write`、`edit` 工具）。
:::

---

## 自动策略的选择

### 去重策略（Deduplication）

**默认启用**，适合大多数场景。

**适用场景**：
- 重复读取同一文件（如代码审查、多轮调试）
- 执行相同的搜索或分析命令

**何时不建议启用**：
- 需要保留每次调用的精确输出（如性能监控）
- 工具输出包含时间戳或随机值（每次调用都不同）

### 覆盖写入策略（Supersede Writes）

**默认禁用**，需要根据项目需求决定是否启用。

**推荐启用场景**：
- 文件修改后立即读取验证（重构、批量处理）
- 写操作输出很大，读取后会覆盖其价值

```jsonc
{
    "strategies": {
        "supersedeWrites": {
            "enabled": true  // 启用覆盖写入策略
        }
    }
}
```

**何时不建议启用**：
- 需要追踪文件修改历史（代码审计）
- 写操作包含重要元数据（如变更原因）

### 清除错误策略（Purge Errors）

**默认启用**，推荐保持启用状态。

**配置建议**：

| 场景                   | 推荐值  | 原因                     |
|--- | --- | ---|
| **默认配置**           | 4 回合 | 经过测试的平衡点              |
| **快速失败场景**       | 2 回合 | 尽早清理错误输入，减少上下文污染       |
| **需要错误历史**       | 6-8 回合 | 保留更多错误信息用于调试          |

```jsonc
{
    "strategies": {
        "purgeErrors": {
            "enabled": true,
            "turns": 2  // 快速失败场景：2 回合后清理错误输入
        }
    }
}
```

---

## LLM 驱动工具的最佳使用

### 提醒功能的优化

DCP 默认每 10 次工具调用后提醒 AI 使用修剪工具。

**推荐配置**：

| 场景                   | nudgeFrequency | 效果说明                |
|--- | --- | ---|
| **密集工具调用**       | 8-12          | 及时提醒 AI 清理            |
| **低频工具调用**       | 15-20         | 减少提醒干扰              |
| **禁用提醒**           | Infinity      | 完全依赖 AI 自主判断         |

```jsonc
{
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 15  // 低频场景：15 次工具调用后提醒
        }
    }
}
```

### Extract 工具的使用

**何时使用 Extract**：
- 工具输出包含关键发现或数据，需要保留摘要
- 原始输出很大，但提取的信息足以支撑后续推理

**配置建议**：

```jsonc
{
    "tools": {
        "extract": {
            "enabled": true,
            "showDistillation": false  // 默认不显示提取内容（减少干扰）
        }
    }
}
```

**何时启用 `showDistillation`**：
- 需要查看 AI 提取了哪些关键信息
- 调试或验证 Extract 工具的行为

### Discard 工具的使用

**何时使用 Discard**：
- 工具输出只是临时状态或噪声
- 任务完成后不需要保留工具输出

**配置建议**：

```jsonc
{
    "tools": {
        "discard": {
            "enabled": true
        }
    }
}
```

---

## 命令使用技巧

### 何时使用 `/dcp context`

**推荐使用场景**：
- 怀疑 Token 使用量异常
- 需要了解当前会话的上下文分布
- 评估 DCP 的修剪效果

**最佳实践**：
- 在长对话中期检查一次，了解上下文构成
- 在对话结束时检查，查看总 Token 消耗

### 何时使用 `/dcp stats`

**推荐使用场景**：
- 需要了解长期 Token 节省效果
- 评估 DCP 的整体价值
- 对比不同配置的节省效果

**最佳实践**：
- 每周查看一次累计统计数据
- 优化配置后对比前后效果

### 何时使用 `/dcp sweep`

**推荐使用场景**：
- 上下文过大导致响应变慢
- 需要立即减少 Token 消耗
- 自动策略没有触发修剪

**使用技巧**：

| 命令              | 用途               |
|--- | ---|
| `/dcp sweep`      | 修剪上一条用户消息后的所有工具 |
| `/dcp sweep 10`   | 只修剪最后 10 个工具      |
| `/dcp sweep 5`    | 只修剪最后 5 个工具       |

**推荐工作流**：
1. 先使用 `/dcp context` 查看当前状态
2. 根据情况决定修剪数量
3. 使用 `/dcp sweep N` 执行修剪
4. 再次使用 `/dcp context` 确认效果

---

## 通知模式的选择

### 三种通知模式的对比

| 模式       | 显示内容                          | 适用场景             |
|--- | --- | ---|
| **off**   | 不显示任何通知                       | 不需要干扰的工作环境      |
| **minimal** | 只显示修剪数量和 Token 节省             | 需要了解效果但不关注细节    |
| **detailed** | 显示修剪的每个工具和原因（默认）          | 调试或需要详细监控的场景   |

### 推荐配置

| 场景             | 推荐模式   | 原因               |
|--- | --- | ---|
| **日常开发**       | minimal | 关注效果，减少干扰        |
| **调试问题**       | detailed | 查看每个修剪操作的原因      |
| **演示或演示录制**  | off     | 避免通知干扰演示流程       |

```jsonc
{
    "pruneNotification": "minimal"  // 日常开发推荐
}
```

---

## 子代理场景的处理

### 理解子代理限制

**DCP 在子代理会话中完全禁用**。

**原因**：
- 子代理的目标是返回简洁的发现摘要
- DCP 的修剪可能干扰子代理的总结行为
- 子代理通常执行时间短，上下文膨胀有限

### 如何判断是否为子代理会话

1. **启用调试日志**：
   ```jsonc
   {
       "debug": true
   }
   ```

2. **查看日志**：
   日志中会显示 `isSubAgent: true` 标记

### 子代理的 Token 优化建议

虽然 DCP 在子代理中禁用，但你仍可以：

- 优化子代理的提示词，减少输出长度
- 限制子代理的工具调用范围
- 使用 `task` 工具的 `max_length` 参数控制输出

---

## 本课小结

| 最佳实践领域       | 核心建议                          |
|--- | ---|
| **Prompt Caching**  | 长对话中 Token 节省通常超过缓存损失          |
| **配置优先级**      | 全局配置用于通用设置，项目配置用于特定需求         |
| **回合保护**       | 复杂任务 4-6 回合，快速任务 2-3 回合         |
| **受保护工具**     | 默认保护已足够，按需添加关键业务工具             |
| **受保护文件**     | 保护配置、密钥、核心业务逻辑文件               |
| **自动策略**       | 去重和清除错误默认启用，覆盖写入按需启用           |
| **LLM 工具**     | 提醒频率 10-15 次，Extract 调试时显示提取内容    |
| **命令使用**     | 定期检查上下文，按需手动修剪                |
| **通知模式**       | 日常开发用 minimal，调试用 detailed       |

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能         | 文件路径                                                                                              | 行号        |
|--- | --- | ---|
| 配置合并      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L691-794)    | 691-794     |
| 配置验证      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)    | 147-375     |
| 默认配置      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-134)     | 68-134      |
| 回合保护      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L432-437)   | 432-437     |
| 受保护工具     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)     | 68-79       |
| 受保护文件模式   | [`protected-file-patterns.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/protected-file-patterns.ts#L1-60) | 1-60        |
| 子代理检测     | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8         |
| 提醒功能      | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L438-441)   | 438-441     |

**关键常量**：
- `MAX_TOOL_CACHE_SIZE = 1000`：工具缓存最大条目数
- `turnProtection.turns`：默认 4 回合保护

**关键函数**：
- `getConfig()`：加载并合并多层级配置
- `validateConfigTypes()`：验证配置项类型
- `mergeConfig()`：按优先级合并配置
- `isSubAgentSession()`：检测子代理会话

</details>
