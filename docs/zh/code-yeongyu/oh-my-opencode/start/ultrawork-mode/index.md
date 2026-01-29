---
title: "Ultrawork模式: 一键激活全部功能 | oh-my-opencode"
sidebarTitle: "一键激活全部功能"
subtitle: "Ultrawork模式: 一键激活全部功能"
description: "学习 oh-my-opencode 的 Ultrawork 模式与核心特性，包括 ultrawork 关键词使用方法、激活行为变化、并行探索机制、强制完成验证及代理协作等，快速激活所有高级功能。"
tags:
  - "ultrawork"
  - "后台任务"
  - "代理协作"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Ultrawork模式：一键激活全部功能

## 学完你能做什么

- 用一句话激活 oh-my-opencode 的全部高级功能
- 让多个 AI 代理像真实团队一样并行工作
- 避免手动配置多个代理和后台任务
- 理解 Ultrawork 模式的设计哲学和最佳实践

## 你现在的困境

你可能在开发过程中遇到过这些情况：

- **功能太多不知道怎么用**：有 10 个专业代理、后台任务、LSP 工具，但不知道如何快速激活
- **需要手动配置**：每次复杂任务都要手动指定代理、后台并发等配置
- **代理协作不高效**：串行调用代理，浪费时间和成本
- **任务中途卡住**：代理没有足够的动力和约束去完成任务

这些都在影响你发挥 oh-my-opencode 的真正威力。

## 核心思路

**Ultrawork 模式**是 oh-my-opencode 的"一键全员激活"机制。

::: info 什么是 Ultrawork 模式？
Ultrawork 模式是一个关键词触发的特殊工作模式。当你在提示词中包含 `ultrawork` 或缩写 `ulw` 时，系统会自动激活所有高级功能：并行后台任务、深度探索、强制完成、多代理协作等。
:::

### 设计哲学

Ultrawork 模式基于以下核心原则（来自 [Ultrawork Manifesto](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)）：

| 原则 | 说明 |
|--- | ---|
| **人类干预是失败信号** | 如果需要你不断修正 AI 的输出，说明系统设计有问题 |
| **不可区分的代码** | AI 写的代码应该和资深工程师写的没有区别 |
| **最小化认知负担** | 你只需要说"做什么"，代理负责"怎么做" |
| **可预测、持续、可委托** | 代理应该像编译器一样稳定可靠 |

### 激活机制

当系统检测到 `ultrawork` 或 `ulw` 关键词时：

1. **设置最大精度模式**：`message.variant = "max"`
2. **显示 Toast 通知**："Ultrawork Mode Activated - Maximum precision engaged. All agents at your disposal."
3. **注入完整指令**：向代理注入 200+ 行的 ULTRAWORK 指令，包括：
   - 强制 100% 确定才开始实现
   - 要求并行使用后台任务
   - 强制使用 Category + Skills 系统
   - 强制完成验证（TDD 工作流）
   - 禁止任何"我做不到"的借口

## 跟我做

### 第 1 步：触发 Ultrawork 模式

在 OpenCode 中输入包含 `ultrawork` 或 `ulw` 关键词的提示词：

```
ultrawork 开发一个 REST API
```

或者更简洁：

```
ulw 添加用户认证
```

**你应该看到**：
- 界面弹出 Toast 通知："Ultrawork Mode Activated"
- 代理回复以 "ULTRAWORK MODE ENABLED!" 开头

### 第 2 步：观察代理行为变化

激活 Ultrawork 模式后，代理会：

1. **并行探索代码库**
   ```
   delegate_task(agent="explore", prompt="查找现有 API 模式", background=true)
   delegate_task(agent="explore", prompt="查找测试基础设施", background=true)
   delegate_task(agent="librarian", prompt="查找认证最佳实践", background=true)
   ```

2. **调用 Plan 代理制定工作计划**
   ```
   delegate_task(subagent_type="plan", prompt="基于收集的上下文，制定详细计划")
   ```

3. **使用 Category + Skills 执行任务**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**你应该看到**：
- 多个后台任务同时运行
- 代理主动调用专业代理（Oracle、Librarian、Explore）
- 完整的测试计划和工作分解
- 任务持续执行直到 100% 完成

### 第 3 步：验证任务完成

代理完成后会：

1. **展示验证证据**：实际运行测试的输出、手动验证的描述
2. **确认所有 TODO 完成**：不会提前声明完成
3. **总结工作内容**：列出做了什么、为什么这样做

**你应该看到**：
- 明确的测试结果（不是"应该可以"）
- 所有问题都已解决
- 没有未完成的 TODO 列表

## 检查点 ✅

完成上述步骤后，确认：

- [ ] 输入 `ulw` 后看到 Toast 通知
- [ ] 代理回复以 "ULTRAWORK MODE ENABLED!" 开头
- [ ] 观察到并行后台任务运行
- [ ] 代理使用 Category + Skills 系统
- [ ] 任务完成后有验证证据

如果任何一项未通过，检查：
- 关键词是否正确拼写（`ultrawork` 或 `ulw`）
- 是否在主会话中（后台任务不会触发模式）
- 配置文件是否启用了相关功能

## 什么时候用这一招

| 场景 | 使用 Ultrawork | 普通模式 |
|--- | --- | ---|
| **复杂新功能** | ✅ 推荐（需要多代理协作） | ❌ 可能不够高效 |
| **紧急修复** | ✅ 推荐（需要快速诊断和探索） | ❌ 可能遗漏上下文 |
| **简单修改** | ❌ 过度（浪费资源） | ✅ 更合适 |
| **快速验证想法** | ❌ 过度 | ✅ 更合适 |

**经验法则**：
- 任务涉及多个模块或系统 → 用 `ulw`
- 需要深入研究代码库 → 用 `ulw`
- 需要调用多个专业代理 → 用 `ulw`
- 单文件小改动 → 不需要 `ulw`

## 踩坑提醒

::: warning 注意事项

**1. 不要在每个提示词中都使用 `ulw`**

Ultrawork 模式会注入大量指令，对于简单任务来说是过度设计。只有真正需要多代理协作、并行探索、深度分析的复杂任务才使用。

**2. 后台任务不会触发 Ultrawork 模式**

关键词检测器会跳过后台会话，避免模式错误注入到子代理。Ultrawork 模式只在主会话中有效。

**3. 确保 Provider 配置正确**

Ultrawork 模式依赖多个 AI 模型并行工作。如果某些 Provider 未配置或不可用，代理可能无法调用专业代理。
:::

## 本课小结

Ultrawork 模式通过关键词触发，实现了"一句话激活全部功能"的设计目标：

- **简单易用**：输入 `ulw` 即可激活
- **自动协作**：代理自动调用其他代理、并行执行后台任务
- **强制完成**：完整的验证机制确保 100% 完成
- **零配置**：无需手动设置代理优先级、并发限制等

记住：Ultrawork 模式是为了让代理像真实团队一样工作，你只需要表达意图，代理负责执行。

## 下一课预告

> 下一课我们学习 **[Provider 配置](../../platforms/provider-setup/)**。
>
> 你会学到：
> - 如何配置 Anthropic、OpenAI、Google 等多个 Provider
> - 多模型策略如何自动降级和选择最优模型
> - 如何测试 Provider 连接和额度使用

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Ultrawork 设计哲学 | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| 关键词检测器 Hook | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| ULTRAWORK 指令模板 | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| 关键词检测逻辑 | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**关键常量**：
- `KEYWORD_DETECTORS`：关键词检测器配置，包含 ultrawork、search、analyze 三个模式
- `CODE_BLOCK_PATTERN`：代码块正则表达式，用于过滤代码块中的关键词
- `INLINE_CODE_PATTERN`：行内代码正则表达式，用于过滤行内代码中的关键词

**关键函数**：
- `createKeywordDetectorHook()`：创建关键词检测器 Hook，监听 UserPromptSubmit 事件
- `detectKeywordsWithType()`：检测文本中的关键词并返回类型（ultrawork/search/analyze）
- `getUltraworkMessage()`：生成 ULTRAWORK 模式的完整指令（根据代理类型选择 Planner 或普通模式）
- `removeCodeBlocks()`：从文本中移除代码块，避免在代码块中误触发关键词

**业务规则**：
| 规则ID | 规则描述 | 标记 |
|--- | --- | ---|
| BR-4.8.4-1 | 检测到 "ultrawork" 或 "ulw" 时激活 Ultrawork 模式 | 【事实】 |
| BR-4.8.4-2 | Ultrawork 模式设置 `message.variant = "max"` | 【事实】 |
| BR-4.8.4-3 | Ultrawork 模式显示 Toast 通知："Ultrawork Mode Activated" | 【事实】 |
| BR-4.8.4-4 | 后台任务会话跳过关键词检测，避免模式注入 | 【事实】 |
| BR-4.8.4-5 | 非主会话只允许 ultrawork 关键词，阻止其他模式注入 | 【事实】 |

</details>
