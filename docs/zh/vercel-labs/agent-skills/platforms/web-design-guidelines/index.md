---
title: "Web 设计指南审计：应用 100 条界面最佳实践 | Agent Skills"
sidebarTitle: "100 条规则查 UI"
subtitle: "Web 界面设计指南审计"
description: "学习 Web 设计指南审计可访问性、性能和 UX。用 100 条规则检查 aria-labels、表单验证、动画和深色模式，提升界面品质。"
tags:
  - "可访问性"
  - "UX"
  - "代码审查"
  - "Web 设计"
order: 40
prerequisite:
  - "start-getting-started"
---

# Web 界面设计指南审计

## 学完你能做什么

- 🎯 让 AI 自动审计 UI 代码，发现可访问性、性能和 UX 问题
- ♿ 应用 Web Accessibility (WCAG) 最佳实践，提升网站可访问性
- ⚡ 优化动画性能和图片加载，提升用户体验
- 🎨 确保深色模式和响应式设计的正确实现
- 🔍 修复常见的 UI 反模式（如 `transition: all`、缺少 aria-label 等）

## 你现在的困境

你写了 UI 组件，但总觉得哪里不对劲：

- 网站通过了功能测试，但不知道是否符合可访问性标准
- 动画性能差，用户反馈页面卡顿
- 深色模式下某些元素看不清
- AI 生成的代码能用，但缺少必要的 aria-labels 或语义化 HTML
- 每次代码审查都要手动检查 17 个类别的规则，效率低下
- 不知道 `prefers-reduced-motion`、`tabular-nums` 这些 CSS 属性什么时候用

其实，Vercel 工程团队已经总结了一套 **100 条** Web 界面设计指南，涵盖了从可访问性到性能优化的所有场景。现在，这些规则已经被打包到 Agent Skills 中，你可以让 AI 自动帮你审计并修复 UI 问题。

::: info 什么是"Web Interface Guidelines"
Web Interface Guidelines 是 Vercel 的 UI 质量标准集合，包含 17 个类别的 100 条规则。这些规则基于 WCAG 可访问性标准、性能最佳实践和 UX 设计原则，确保 Web 应用的品质达到生产级水准。
:::

## 什么时候用这一招

使用 Web 设计指南技能的典型场景：

- ❌ **不适用**：纯后端逻辑、简单的原型页面（未涉及用户交互）
- ✅ **适用**：
  - 编写新的 UI 组件（按钮、表单、卡片等）
  - 实现交互功能（模态框、下拉菜单、拖拽等）
  - 代码审查或重构 UI 组件
  - 上线前的 UI 质量检查
  - 修复用户反馈的可访问性或性能问题

## 🎒 开始前的准备

::: warning 前置检查
在开始之前，请确保你已经：
1. 安装了 Agent Skills（参考 [安装指南](../../start/installation/)）
2. 了解基本的 HTML/CSS/React 知识
3. 有一个 UI 项目需要审计（可以是单个组件或整个页面）
:::

## 核心思路

Web 界面设计指南涵盖 **17 个类别**，按优先级分为三大块：

| 类别块                           | 关注点                                           | 典型收益                     |
|--- | --- | ---|
| **可访问性 (Accessibility)**     | 确保所有用户都能使用（包括屏幕阅读器、键盘用户） | 符合 WCAG 标准，扩大用户群体 |
| **性能 & UX (Performance & UX)** | 优化加载速度、动画流畅度、交互体验               | 提升用户留存率，降低跳出率   |
| **完整性 & 细节 (Completeness)** | 深色模式、响应式、表单验证、错误处理             | 减少用户投诉，提升品牌形象   |

**17 个规则类别**：

| 类别                       | 典型规则                                  | 优先级   |
|--- | --- | ---|
| Accessibility              | aria-labels、语义化 HTML、键盘处理        | ⭐⭐⭐ 最高 |
| Focus States               | 可见焦点、:focus-visible 代替 :focus      | ⭐⭐⭐ 最高 |
| Forms                      | autocomplete、验证、错误处理              | ⭐⭐⭐ 最高 |
| Animation                  | prefers-reduced-motion、transform/opacity | ⭐⭐ 高    |
| Typography                 | curly quotes、ellipsis、tabular-nums      | ⭐⭐ 高    |
| Content Handling           | 文本截断、空状态处理                      | ⭐⭐ 高    |
| Images                     | dimensions、lazy loading、alt text        | ⭐⭐ 高    |
| Performance                | virtualization、预连接、批处理 DOM 操作   | ⭐⭐ 高    |
| Navigation & State         | URL 反映状态、深度链接                    | ⭐⭐ 高    |
| Touch & Interaction        | touch-action、tap-highlight               | ⭐ 中     |
| Safe Areas & Layout        | 安全区域、滚动条处理                      | ⭐ 中     |
| Dark Mode & Theming        | color-scheme、theme-color meta            | ⭐ 中     |
| Locale & i18n              | Intl.DateTimeFormat、Intl.NumberFormat    | ⭐ 中     |
| Hydration Safety           | value + onChange、防止单元格不匹配        | ⭐ 中     |
| Hover & Interactive States | hover 状态、对比度提升                    | ⭐ 中     |
| Content & Copy             | 主动语态、特定按钮标签                    | ⭐ 低     |
| Anti-patterns              | flag 常见错误模式                         | ⭐⭐⭐ 最高 |

**核心原则**：
1. **优先修复 Accessibility 类问题**——这些影响残障用户的使用
2. **性能问题从动画和图片入手**——这些直接影响用户体验
3. **完整性问题最后检查**——深色模式、国际化等细节

## 跟我做

### 第 1 步：触发 AI UI 审计

打开你的 UI 项目（可以是单个组件文件或整个目录），在 Claude 或 Cursor 中输入：

```
Review my UI components for accessibility and UX issues
```

或

```
Check accessibility of my site
```

或

```
Audit design and apply Web Interface Guidelines
```

**你应该看到**：AI 会激活 `web-design-guidelines` 技能，并从 GitHub 拉取最新的 100 条规则。

### 第 2 步：指定审计文件（如果 AI 没有自动检测）

如果 AI 询问你要审计哪些文件，你可以：

```bash
# 审计单个文件
src/components/Button.tsx

# 审计多个文件（用空格分隔）
src/components/Button.tsx src/components/Input.tsx

# 审计整个目录（用 glob 模式）
src/components/**/*.tsx
```

### 第 3 步：AI 自动检测问题

AI 会逐条检查代码，发现问题后输出 `file:line` 格式的审计结果。例如：

```typescript
// ❌ 你的原始代码（存在问题）
export function Button({ icon, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-100 transition-all"
    >
      {icon}
    </button>
  )
}
```

**AI 的审计结果**：

```
## src/components/Button.tsx

src/components/Button.tsx:8 - icon button missing aria-label
src/components/Button.tsx:8 - animation missing prefers-reduced-motion
src/components/Button.tsx:8 - transition: all → list properties explicitly
src/components/Button.tsx:8 - button needs visible focus
```

**AI 给出的修复代码**：

```typescript
// ✅ 修复后
export function Button({ icon, onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 rounded hover:bg-gray-100 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                motion-safe:hover:scale-105 active:scale-100
                motion-reduce:transition-none motion-reduce:transform-none"
    >
      {icon}
    </button>
  )
}
```

### 第 4 步：常见问题示例

#### 问题 1：表单输入缺少 label 和 autocomplete

```typescript
// ❌ 错误：缺少 label 和 autocomplete
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

```typescript
// ✅ 正确：包含 label、name、autocomplete
<label htmlFor="email" className="sr-only">
  Email address
</label>
<input
  id="email"
  type="email"
  name="email"
  autoComplete="email"
  placeholder="your@email.com…"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**规则**：
- `Form Controls need <label> or aria-label`
- `Inputs need autocomplete and meaningful name`
- `Use correct type (email, tel, url, number) and inputmode`

#### 问题 2：动画未考虑 `prefers-reduced-motion`

```css
/* ❌ 错误：所有用户都看到动画，对 vestibular disorder 用户不友好 */
.modal {
  transition: all 0.3s ease-in-out;
}
```

```css
/* ✅ 正确：尊重用户的减少动画偏好 */
.modal {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
}
```

**规则**：
- `Honor prefers-reduced-motion (provide reduced variant or disable)`
- `Never transition: all—list properties explicitly`

#### 问题 3：图片缺少 dimensions 和 lazy loading

```typescript
// ❌ 错误：会导致 Cumulative Layout Shift (CLS)
<img src="/hero.jpg" alt="Hero image" />
```

```typescript
// ✅ 正确：提前预留空间，防止布局跳动
<img
  src="/hero.jpg"
  alt="Hero: team working together"
  width={1920}
  height={1080}
  loading="lazy"
  fetchpriority="high"  // 对于首屏核心图片
/>
```

**规则**：
- `<img> needs explicit width and height (prevents CLS)`
- `Below-fold images: loading="lazy"`
- `Above-fold critical images: priority or fetchpriority="high"`

#### 问题 4：深色模式未设置 `color-scheme`

```html
<!-- ❌ 错误：深色模式下原生控件（如 select、input）仍然是白色背景 -->
<html>
  <body>
    <select>...</select>
  </body>
</html>
```

```html
<!-- ✅ 正确：原生控件自动适配深色主题 -->
<html class="dark">
  <head>
    <meta name="theme-color" content="#0f172a" />
  </head>
  <body style="color-scheme: dark">
    <select style="background-color: #1e293b; color: #e2e8f0">
      ...
    </select>
  </body>
</html>
```

**规则**：
- `color-scheme: dark on <html> for dark themes (fixes scrollbar, inputs)`
- `<meta name="theme-color"> matches page background`
- `Native <select>: explicit background-color and color (Windows dark mode)`

#### 问题 5：键盘导航支持不完整

```typescript
// ❌ 错误：只有鼠标能点击，键盘用户无法使用
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

```typescript
// ✅ 正确：支持键盘导航（Enter/Space 触发）
<button
  onClick={handleClick}
  className="cursor-pointer"
  // 自动支持键盘，无需额外代码
>
  Click me
</button>

// 或如果必须用 div，添加键盘支持：
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }}
  onClick={handleClick}
  className="cursor-pointer"
>
  Click me
</div>
```

**规则**：
- `Interactive elements need keyboard handlers (onKeyDown/onKeyUp)`
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- `Icon-only buttons need aria-label`

#### 问题 6：长列表未虚拟化

```typescript
// ❌ 错误：渲染 1000 个项目，导致页面卡顿
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

```typescript
// ✅ 正确：使用虚拟滚动，只渲染可见项目
import { useVirtualizer } from '@tanstack/react-virtual'

function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,  // 每项高度
    overscan: 5,  // 预渲染几项防止空白
  })

  return (
    <ul ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {users[virtualItem.index].name}
          </div>
        ))}
      </div>
    </ul>
  )
}
```

**规则**：
- `Large lists (>50 items): virtualize (virtua, content-visibility: auto)`

#### 问题 7：数字列未使用 `tabular-nums`

```css
/* ❌ 错误：数字宽度不固定，导致对齐跳动 */
.table-cell {
  font-family: system-ui;
}
```

```css
/* ✅ 正确：数字等宽，对齐稳定 */
.table-cell.number {
  font-variant-numeric: tabular-nums;
}
```

**规则**：
- `font-variant-numeric: tabular-nums for number columns/comparisons`

### 第 5 步：修复常见反模式

AI 会自动标记这些反模式：

```typescript
// ❌ 反模式集合
const BadComponent = () => (
  <div>
    {/* 反模式 1: transition: all */}
    <div className="transition-all hover:scale-105">...</div>

    {/* 反模式 2: 图标按钮缺少 aria-label */}
    <button onClick={handleClose}>✕</button>

    {/* 反模式 3: 禁止粘贴 */}
    <Input onPaste={(e) => e.preventDefault()} />

    {/* 反模式 4: outline-none 不带焦点替代 */}
    <button className="focus:outline-none">...</button>

    {/* 反模式 5: 图片缺少 dimensions */}
    <img src="/logo.png" alt="Logo" />

    {/* 反模式 6: 使用 div 而不是 button */}
    <div onClick={handleClick}>Submit</div>

    {/* 反模式 7: 硬编码日期格式 */}
    <Text>{formatDate(new Date(), 'MM/DD/YYYY')}</Text>

    {/* 反模式 8: autofocus 在移动端 */}
    <input autoFocus />

    {/* 反模式 9: user-scalable=no */}
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

    {/* 反模式 10: 大列表未虚拟化 */}
    {largeList.map((item) => (<Item key={item.id} {...item} />))}
  </div>
)
```

```typescript
// ✅ 修复后
const GoodComponent = () => (
  <div>
    {/* 修复 1: 明确列出过渡属性 */}
    <div className="transition-transform hover:scale-105">...</div>

    {/* 修复 2: 图标按钮包含 aria-label */}
    <button onClick={handleClose} aria-label="Close dialog">✕</button>

    {/* 修复 3: 允许粘贴 */}
    <Input />

    {/* 修复 4: 使用 focus-visible 链环 */}
    <button className="focus:outline-none focus-visible:ring-2">...</button>

    {/* 修复 5: 图片包含 dimensions */}
    <img src="/logo.png" alt="Logo" width={120} height={40} />

    {/* 修复 6: 使用语义化 button */}
    <button onClick={handleClick}>Submit</button>

    {/* 修复 7: 使用 Intl 格式化 */}
    <Text>{new Intl.DateTimeFormat('en-US').format(new Date())}</Text>

    {/* 修复 8: autoFocus 仅在桌面端 */}
    <input autoFocus={isDesktop} />

    {/* 修复 9: 允许缩放 */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* 修复 10: 虚拟化 */}
    <VirtualList items={largeList}>{(item) => <Item {...item} />}</VirtualList>
  </div>
)
```

## 检查点 ✅

完成上述步骤后，检查自己是否掌握了：

- [ ] 知道如何触发 AI 进行 Web 设计指南审计
- [ ] 理解可访问性（Accessibility）的重要性（Accessibility 最高优先级）
- [ ] 知道如何添加 aria-label 和语义化 HTML
- [ ] 理解 `prefers-reduced-motion` 的作用
- [ ] 知道如何优化图片加载（dimensions、lazy loading）
- [ ] 理解深色模式的正确实现（`color-scheme`）
- [ ] 能够识别代码中的常见的 UI 反模式

## 踩坑提醒

### 坑 1：只关注视觉，忽略可访问性

::: warning 可访问性不是可选的
可访问性是法律要求（如 ADA、WCAG），也是社会责任。

**常见遗漏**：
- 图标按钮缺少 `aria-label`
- 自定义控件（如下拉菜单）不支持键盘
- 表单输入缺少 `<label>`
- 异步更新（如 Toast）缺少 `aria-live="polite"`
:::

### 坑 2：过度使用 `transition: all`

::: danger 性能杀手
`transition: all` 会监听所有 CSS 属性变化，导致浏览器重新计算大量值。

**错误用法**：
```css
.card {
  transition: all 0.3s ease;  // ❌ 会过渡 background、color、transform、padding、margin 等
}
```

**正确用法**：
```css
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;  // ✅ 只过渡需要的属性
}
```
:::

### 坑 3：忘记 `outline` 替代方案

::: focus-visible 不是可有可无的
移除默认 `outline` 后，必须提供可见的焦点样式，否则键盘用户无法知道焦点在哪里。

**错误做法**：
```css
button {
  outline: none;  // ❌ 完全移除焦点
}
```

**正确做法**：
```css
button {
  outline: none;  /* 移除默认丑陋的轮廓 */
}

button:focus-visible {
  ring: 2px solid blue;  /* ✅ 添加自定义焦点样式（仅在键盘导航时） */
}

button:focus {
  /* 鼠标点击时不显示（因为 focus-visible = false） */
}
```
:::

### 坑 4：图片缺少 `alt` 或 `dimensions`

::: CLS 是 Core Web Vitals 之一
缺少 `width` 和 `height` 会导致页面加载时布局跳动，影响用户体验和 SEO。

**记住**：
- 装饰性图片用 `alt=""`（空字符串）
- 信息性图片用描述性 `alt`（如 "Team photo: Alice and Bob"）
- 所有图片都包含 `width` 和 `height`
:::

### 坑 5：国际化（i18n）硬编码格式

::: 使用 Intl API
不要硬编码日期、数字、货币格式，使用浏览器内置的 `Intl` API。

**错误做法**：
```typescript
const formattedDate = formatDate(date, 'MM/DD/YYYY')  // ❌ 美式格式，其他国家会困惑
```

**正确做法**：
```typescript
const formattedDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
}).format(date)  // ✅ 自动使用用户的语言环境
```
:::

## 本课小结

Web 界面设计指南的核心原则：

1. **可访问性优先**：确保所有用户都能使用（键盘、屏幕阅读器）
2. **性能优化**：动画用 `transform/opacity`，图片 lazy load，大列表虚拟化
3. **尊重用户偏好**：`prefers-reduced-motion`、`color-scheme`、允许缩放
4. **语义化 HTML**：用 `<button>`、`<label>`、`<input>` 而不是 `<div>`
5. **完整性检查**：深色模式、国际化、表单验证、错误处理
6. **用 AI 自动化审计**：让 Agent Skills 帮你发现并修复 100 条规则

Vercel 的 100 条规则覆盖了从基础到细节的所有场景，学会触发 AI 应用这些规则，你的 UI 质量会达到生产级水准。

## 下一课预告

接下来，我们学习 **[Vercel 一键部署](../vercel-deploy/)**。

你会学到：
- 如何一键部署项目到 Vercel（支持 40+ 种框架）
- 自动检测框架类型（Next.js、Vue、Svelte 等）
- 获取预览链接和所有权转移链接

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能                 | 文件路径                                                                                                                                                                           | 行号  |
|--- | --- | ---|
| Web 设计指南技能定义 | [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)                                             | 全文  |
| 规则源（100 条）     | [`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | 全文  |
| README 概述          | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md)                                                                                                     | 28-50 |

**17 个规则类别**：

| 类别                       | 覆盖规则数 | 典型规则                                  |
|--- | --- | ---|
| Accessibility              | 10 条      | aria-labels、语义化 HTML、键盘处理        |
| Focus States               | 4 条       | 可见焦点、:focus-visible                  |
| Forms                      | 11 条      | autocomplete、验证、错误处理              |
| Animation                  | 6 条       | prefers-reduced-motion、transform/opacity |
| Typography                 | 6 条       | curly quotes、ellipsis、tabular-nums      |
| Content Handling           | 4 条       | 文本截断、空状态处理                      |
| Images                     | 3 条       | dimensions、lazy loading、alt text        |
| Performance                | 6 条       | virtualization、预连接、批处理            |
| Navigation & State         | 4 条       | URL 反映状态、深度链接                    |
| Touch & Interaction        | 5 条       | touch-action、tap-highlight               |
| Safe Areas & Layout        | 3 条       | 安全区域、滚动条处理                      |
| Dark Mode & Theming        | 3 条       | color-scheme、theme-color                 |
| Locale & i18n              | 3 条       | Intl.DateTimeFormat、Intl.NumberFormat    |
| Hydration Safety           | 3 条       | value + onChange、防止单元格不匹配        |
| Hover & Interactive States | 2 条       | hover 状态、对比度                        |
| Content & Copy             | 7 条       | 主动语态、特定按钮标签                    |
| Anti-patterns              | 20 条      | flag 常见错误模式                         |

**关键常量**：
- `RULE_SOURCE_URL = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"`：规则拉取源
- `version = "1.0.0"`：技能版本号（SKILL.md）

**工作流程**：
1. `SKILL.md:23-27`：从 GitHub 拉取最新规则
2. `SKILL.md:31-38`：读取用户文件并应用所有规则
3. `SKILL.md:39`：如果未指定文件，询问用户

**触发关键词**：
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

</details>
