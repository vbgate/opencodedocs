---
title: "最佳实践: 高效使用 Agent Skills | Agent Skills"
sidebarTitle: "让AI跑得更快"
subtitle: "使用最佳实践"
description: "学习 Agent Skills 的高效使用方法。掌握触发关键词选择技巧、上下文管理策略、多技能协作场景和性能优化建议，减少Token消耗，提升AI响应速度。"
tags:
  - "最佳实践"
  - "性能优化"
  - "效率提升"
  - "AI使用技巧"
order: 100
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# 使用最佳实践

## 学完你能做什么

学完这节课,你将能够:

- ✅ 精准选择触发关键词,让AI在正确时机激活技能
- ✅ 优化上下文管理,减少Token消耗,提升响应速度
- ✅ 处理多技能协作场景,避免冲突和混淆
- ✅ 掌握常见使用模式,提升工作效率

## 你现在的困境

你可能遇到过这些场景:

- ✗ 输入"帮我部署",但AI没有激活Vercel Deploy技能
- ✗ 同一个任务触发了多个技能,AI不知道该用哪个
- ✗ 技能占用了大量上下文,导致AI"记不住"你的需求
- ✗ 每次都要重新解释任务,不知道如何让AI记住你的习惯

## 什么时候用这一招

当你在使用Agent Skills时遇到:

- 🎯 **触发不准确**:技能没有被激活或激活了错误的技能
- 💾 **上下文压力**:技能占用了太多Token,影响其他对话
- 🔄 **技能冲突**:多个技能同时被激活,AI执行混乱
- ⚡ **性能下降**:AI响应变慢,需要优化使用方式

## 核心思路

**Agent Skills的设计哲学**:

Agent Skills采用**按需加载机制**——Claude在启动时只加载技能的名称和描述(约1-2行),当检测到相关关键词时,才会读取完整的`SKILL.md`内容。这种设计可以最大限度地减少上下文消耗,同时保持技能的精确触发。

**使用效率的三个关键维度**:

1. **触发精准度**:选择合适的触发关键词,让技能在正确时机激活
2. **上下文效率**:控制技能内容长度,避免占用过多Token
3. **协作清晰度**:明确技能边界,避免多技能冲突

---

## 最佳实践1:精准选择触发关键词

### 什么是触发关键词?

触发关键词是在`SKILL.md`的`description`字段中定义的,用于告诉AI何时应该激活这个技能。

**关键原则**:描述要具体,触发要明确

### 如何编写有效的描述?

#### ❌ 错误示例:描述太模糊

```yaml
---
name: my-deploy-tool
description: A deployment tool for applications  # 太模糊,无法触发
---
```

**问题**:
- 没有明确的使用场景
- 没有包含用户可能说的关键词
- AI无法判断何时激活

#### ✅ 正确示例:描述具体且包含触发词

```yaml
---
name: vercel-deploy
description: Deploy applications and websites to Vercel. Use this skill when the user requests deployment actions such as "Deploy my app", "Deploy this to production", "Create a preview deployment", "Deploy and give me the link", or "Push this live". No authentication required.
---
```

**优点**:
- 明确使用场景(Deploy applications)
- 列出具体的触发短语("Deploy my app", "Deploy this to production")
- 说明独特价值(No authentication required)

### 触发关键词选择指南

| 编写场景     | 推荐关键词                                          | 避免使用           |
| ------------ | --------------------------------------------------- | ------------------ |
| **部署操作** | "deploy", "production", "push", "publish"           | "send", "move"     |
| **代码审查** | "review", "check", "audit", "optimize"              | "look at", "see"   |
| **设计检查** | "accessibility", "a11y", "UX check", "design audit" | "design", "style"  |
| **性能优化** | "optimize", "performance", "improve speed"          | "faster", "better" |

### 踩坑提醒:常见错误

::: warning 避免这些错误

❌ **只用通用词**
```yaml
description: A tool for code review  # "code review" 太通用
```

✅ **具体场景 + 关键词**
```yaml
description: Review React components for performance issues. Use when user says "review performance", "check optimization", or "find bottlenecks".
```

❌ **关键词太少**
```yaml
description: Deploy to Vercel  # 只有一个场景
```

✅ **覆盖多种表达**
```yaml
description: Deploy to Vercel. Use when user says "deploy", "push live", "create preview", or "publish".
```

---

## 最佳实践2:上下文管理技巧

### 为什么上下文管理很重要?

Token是有限的资源。如果`SKILL.md`文件太长,会占用大量上下文,导致AI"记不住"你的需求或响应变慢。

### 核心原则:保持SKILL.md简短

::: tip 黄金规则

**保持 SKILL.md 文件在 500 行以内**

:::

根据官方文档,以下策略可以最小化上下文使用:

| 策略                 | 说明                                | 效果              |
| -------------------- | ----------------------------------- | ----------------- |
| **保持SKILL.md简洁** | 将详细参考材料放到单独文件          | 减少初始加载量    |
| **编写具体描述**     | 帮助AI精确判断何时激活              | 避免误触          |
| **渐进式披露**       | 只在需要时读取支持文件              | 控制实际Token消耗 |
| **优先脚本执行**     | 脚本输出不消耗上下文,只有输出结果会 | 大幅减少Token使用 |
| **单层文件引用**     | 从SKILL.md直接链接到支持文件        | 避免多层嵌套      |

### 如何渐进式披露?

**场景**:你的技能需要API文档、配置示例等详细参考

#### ❌ 错误做法:全部写在SKILL.md

```markdown
---
name: my-api-skill
---

# API Skill

## API Reference

(这里写了 2000 行的API文档)


## Configuration Examples

(这里又写了 500 行的示例)


## Usage Guide

(200 行的使用说明)
```

**问题**:
- 文件超过 500 行
- 每次激活都加载全部内容
- 绝大部分内容可能用不到

#### ✅ 正确做法:分离到支持文件

```markdown
---
name: my-api-skill
description: Integrate with My API. Use when user says "call API", "send request", or "fetch data".
---

# API Skill

Quick start guide for My API integration.

## Quick Setup

1. Get API key from https://api.example.com/keys
2. Add to environment: `export MY_API_KEY="your-key"`
3. Run: `bash scripts/api-client.sh`

## Common Operations

### Fetch user data
```bash
bash scripts/api-client.sh get /users/123
```

### Create new resource
```bash
bash scripts/api-client.sh post /users '{"name":"John"}'
```

## Reference Documentation

For complete API reference, see:
- [API Endpoints](references/api-endpoints.md)
- [Configuration Examples](references/config-examples.md)
- [Error Handling](references/errors.md)
```

**优点**:
- `SKILL.md` 只有 30 行
- AI只在需要时读取详细文档
- 大部分Token消耗在脚本输出,而非文档加载

### 实战示例:Vercel Deploy vs React Best Practices

| 技能                  | SKILL.md 行数 | 加载内容            | 优化策略             |
| --------------------- | ------------- | ------------------- | -------------------- |
| Vercel Deploy         | ~60 行        | 简明用法 + 输出格式 | 脚本处理复杂逻辑     |
| React Best Practices  | ~300 行       | 规则索引 + 分类     | 详细规则在 AGENTS.md |
| Web Design Guidelines | ~50 行        | 审计流程            | 动态从GitHub拉取规则 |

**启发**:不要在`SKILL.md`中塞入所有内容,让它成为"入口指南",而非"完整手册"。

---

## 最佳实践3:多技能协作场景

### 场景1:技能A和技能B触发条件有重叠

**问题**:你说"review my code",同时触发了React Best Practices和Web Design Guidelines。

#### ✅ 解决方案:明确区分触发词

```yaml
# React Best Practices
name: react-performance
description: Review React components for performance issues. Use when user says "review performance", "optimize React", "check bottlenecks".

# Web Design Guidelines
name: web-design-audit
description: Audit UI for accessibility and UX issues. Use when user says "check accessibility", "review UX", "audit interface".
```

**结果**:
- "review performance" → 只触发React技能
- "check accessibility" → 只触发Web技能
- "review my code" → 两个都不触发,由AI判断

### 场景2:需要同时使用多个技能

**最佳实践**:明确告诉AI需要哪些技能

**推荐对话方式**:
```
我需要完成两个任务:
1. 部署到Vercel (使用vercel-deploy技能)
2. 检查React性能问题 (使用react-best-practices技能)
```

**原因**:
- 明确技能边界,避免AI混淆
- 让AI按顺序执行,避免资源冲突
- 提高执行效率

### 场景3:技能链式调用(一个技能的输出是另一个的输入)

**示例**:部署前先优化性能

```bash
# 步骤1:使用React Best Practices优化代码
"Review src/components/Header.tsx for performance issues using react-best-practices skill"

# 步骤2:使用Vercel Deploy部署
"Deploy the optimized code to Vercel"
```

**最佳实践**:
- 明确步骤顺序
- 每步骤之间确认完成
- 避免并行处理有依赖的任务

---

## 最佳实践4:性能优化建议

### 1. 精简对话上下文

**问题**:长时间对话后,上下文变得很长,响应变慢。

#### ✅ 解决方案:开启新对话或使用"Clear Context"

```bash
# Claude Code
/clear  # 清除上下文,保留技能
```

### 2. 避免重复加载技能

**问题**:同一个任务多次触发技能,浪费Token。

#### ❌ 错误做法

```
用户: Deploy my app
AI: (加载vercel-deploy,执行)
用户: Deploy to production
AI: (再次加载vercel-deploy,执行)
```

#### ✅ 正确做法

```
用户: Deploy to production
AI: (加载vercel-deploy,执行一次)
```

### 3. 使用脚本而非内联代码

**对比**:完成同样的任务,哪种消耗更少?

| 方式                             | Token消耗                     | 推荐场景        |
| -------------------------------- | ----------------------------- | --------------- |
| **内联代码**(在SKILL.md中写逻辑) | 高(每次触发都加载)            | 简单任务(<10行) |
| **Bash脚本**                     | 低(只加载脚本路径,不加载内容) | 复杂任务(>10行) |

**示例**:

```markdown
## ❌ 内联代码(不推荐)

```bash
# 这段代码每次激活都会加载到上下文
tar -czf package.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  && curl -X POST $API_URL \
  -F "file=@package.tar.gz"
```

## ✅ 脚本(推荐)

```bash
bash scripts/deploy.sh
```

(脚本内容在文件中,不加载到上下文)
```

### 4. 监控Token使用情况

**Claude Code实用命令**:

```bash
# 查看当前Token使用
/token

# 查看技能加载情况
/skills
```

---

## 常见使用模式和示例

### 模式1:快速迭代工作流

```bash
# 1. 编写代码
vim src/App.tsx

# 2. 立即审查性能
"Review this for performance issues"

# 3. 根据建议修改代码
(修改)

# 4. 再次审查
"Review again"

# 5. 部署
"Deploy to production"
```

**关键点**:
- 使用简短指令,因为AI已经知道上下文
- 重复指令可以快速激活相同技能

### 模式2:新项目启动检查清单

```bash
# 创建Next.js项目
npx create-next-app@latest my-app

# 安装Agent Skills
npx add-skill vercel-labs/agent-skills

# 初始审计
"Check accessibility for all UI files"
"Review performance for all components"

# 部署测试
"Deploy to production"
```

### 模式3:团队协作模板

```bash
# Clone团队项目
git clone team-project
cd team-project

1. "Review performance for all new changes"
2. "Check accessibility of modified files"
3. "Deploy to staging"
```

**团队标准**:定义统一的触发关键词,让所有成员使用相同的效率模式。

---

## 踩坑提醒:常见错误

### 坑1:技能激活了但没效果

**症状**:你说"Deploy my app",AI说"会使用vercel-deploy技能",但什么都没发生。

**原因**:
- 技能脚本路径错误
- 脚本没有执行权限
- 文件不在正确位置

**解决**:
```bash
# 检查技能目录
ls -la ~/.claude/skills/vercel-deploy/

# 检查脚本权限
chmod +x ~/.claude/skills/vercel-deploy/scripts/deploy.sh

# 手动测试脚本
bash ~/.claude/skills/vercel-deploy/scripts/deploy.sh .
```

### 坑2:触发了错误的技能

**症状**:说"check code",触发了Web Design而不是React Best Practices。

**原因**:技能描述关键词冲突。

**解决**:修改触发词,更具体:
```yaml
# ❌ 之前
description: "Check code for issues"

# ✅ 之后
description: "Review React code for accessibility and UX"
```

### 坑3:AI"忘记"了技能

**症状**:第一轮对话能用,第二轮就不行了。

**原因**:上下文太长,技能信息被挤出。

**解决**:
```bash
/clear  # 清除上下文保留技能
```

---

## 本课小结

**核心要点**:

1. **触发关键词**:描述要具体,包含用户可能说的多种表达
2. **上下文管理**:保持SKILL.md < 500行,使用渐进式披露,优先脚本
3. **多技能协作**:明确触发词区分技能,明确顺序处理多任务
4. **性能优化**:精简对话上下文,避免重复加载,监控Token使用

**最佳实践口诀**:

> 描述要具体,触发要明确
> 文件别太长,脚本占空间
> 多个技能分边界,任务顺序说清楚
> 上下文要精简,定期清理免卡顿

---

## 下一课预告

> 下一课我们将深入了解 **[Agent Skills 的技术架构与实现细节](../../appendix/architecture/)**。
>
> 你将学到:
> - 构建流程详解(parse → validate → group → sort → generate)
> - 规则解析器如何工作
> - 类型系统和数据模型
> - 测试用例提取机制
> - 部署脚本的框架检测算法

---

## 附录:源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间:2026-01-25

| 功能                | 文件路径                                                                                                              | 行号   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| 上下文管理最佳实践  | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78)                          | 70-78  |
| 技能触发示例        | [`README.md:88-102`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L88-L102)                        | 88-102 |
| React技能触发词     | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md)              | 1-30   |
| Vercel Deploy触发词 | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-30   |

**关键原则**:
- Keep SKILL.md under 500 lines:保持技能文件简短
- Write specific descriptions:编写具体描述帮助AI判断
- Use progressive disclosure:渐进式披露详细内容
- Prefer scripts over inline code:优先脚本执行减少Token消耗

</details>
