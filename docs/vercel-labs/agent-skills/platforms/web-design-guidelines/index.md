---
title: "Web Design Guidelines: Apply 100 UI Best Practices | Agent Skills"
sidebarTitle: "Web Design Guidelines"
subtitle: "Web Design Guidelines: Apply 100 UI Best Practices"
description: "Learn Web Design Guidelines audit for accessibility, performance, and UX. Use 100 rules to check aria-labels, form validation, animations, and dark mode to improve UI quality."
tags:
  - "Accessibility"
  - "UX"
  - "Code Review"
  - "Web Design"
order: 40
prerequisite:
  - "start-getting-started"
---

# Web Interface Design Guidelines Audit

## What You'll Learn

- 🎯 Let AI automatically audit UI code to discover accessibility, performance, and UX issues
- ♿ Apply Web Accessibility (WCAG) best practices to improve website accessibility
- ⚡ Optimize animation performance and image loading to enhance user experience
- 🎨 Ensure correct implementation of dark mode and responsive design
- 🔍 Fix common UI anti-patterns (e.g., `transition: all`, missing aria-label, etc.)

## Your Current Struggle

You've written UI components, but something feels off:

- Your site passes functional tests, but you're not sure if it meets accessibility standards
- Poor animation performance, users report stuttering pages
- Some elements are hard to see in dark mode
- AI-generated code works, but lacks necessary aria-labels or semantic HTML
- Manually checking 17 categories of rules during every code review is inefficient
- Unsure when to use CSS properties like `prefers-reduced-motion` or `tabular-nums`

In reality, the Vercel engineering team has summarized a set of **100** Web Interface Design Guidelines, covering every scenario from accessibility to performance optimization. Now, these rules are packaged into Agent Skills, and you can have AI automatically help you audit and fix UI issues.

::: info What are "Web Interface Guidelines"
Web Interface Guidelines is Vercel's collection of UI quality standards, containing 100 rules across 17 categories. These rules are based on WCAG accessibility standards, performance best practices, and UX design principles, ensuring web applications meet production-level quality.
:::

## When to Use This

Typical scenarios for using the Web Design Guidelines skill:

- ❌ **Not applicable**: Pure backend logic, simple prototype pages (without user interaction)
- ✅ **Applicable**:
  - Writing new UI components (buttons, forms, cards, etc.)
  - Implementing interactive features (modals, dropdown menus, drag-and-drop, etc.)
  - Code review or refactoring UI components
  - Pre-launch UI quality checks
  - Fixing user-reported accessibility or performance issues

## 🎒 Preparation Before Starting

::: warning Prerequisites
Before starting, ensure you:
1. Have installed Agent Skills (see [Installation Guide](../../start/installation/))
2. Understand basic HTML/CSS/React knowledge
3. Have a UI project to audit (can be a single component or entire page)
:::

## Core Concepts

Web Interface Design Guidelines cover **17 categories**, divided into three main blocks by priority:

| Block | Focus | Typical Benefits |
| ------ | ----- | ---------------- |
| **Accessibility** | Ensure all users can use it (including screen readers, keyboard users) | Complies with WCAG standards, expands user base |
| **Performance & UX** | Optimize load speed, animation smoothness, interaction experience | Improves user retention, reduces bounce rate |
| **Completeness & Details** | Dark mode, responsive, form validation, error handling | Reduces user complaints, enhances brand image |

**17 Rule Categories**:

| Category | Typical Rules | Priority |
| -------- | ------------- | -------- |
| Accessibility | aria-labels, semantic HTML, keyboard handling | ⭐⭐⭐ Highest |
| Focus States | Visible focus, :focus-visible instead of :focus | ⭐⭐⭐ Highest |
| Forms | autocomplete, validation, error handling | ⭐⭐⭐ Highest |
| Animation | prefers-reduced-motion, transform/opacity | ⭐⭐ High |
| Typography | curly quotes, ellipsis, tabular-nums | ⭐⭐ High |
| Content Handling | text truncation, empty state handling | ⭐⭐ High |
| Images | dimensions, lazy loading, alt text | ⭐⭐ High |
| Performance | virtualization, preconnect, batch DOM operations | ⭐⭐ High |
| Navigation & State | URL reflects state, deep linking | ⭐⭐ High |
| Touch & Interaction | touch-action, tap-highlight | ⭐ Medium |
| Safe Areas & Layout | safe areas, scrollbar handling | ⭐ Medium |
| Dark Mode & Theming | color-scheme, theme-color meta | ⭐ Medium |
| Locale & i18n | Intl.DateTimeFormat, Intl.NumberFormat | ⭐ Medium |
| Hydration Safety | value + onChange, prevent cell mismatch | ⭐ Medium |
| Hover & Interactive States | hover states, contrast enhancement | ⭐ Medium |
| Content & Copy | active voice, specific button labels | ⭐ Low |
| Anti-patterns | Flag common error patterns | ⭐⭐⭐ Highest |

**Core Principles**:
1. **Prioritize fixing Accessibility issues**—these affect disabled users' ability to use the product
2. **Start performance issues with animations and images**—these directly impact user experience
3. **Check completeness issues last**—dark mode, internationalization, and other details

## Follow Along

### Step 1: Trigger AI UI Audit

Open your UI project (can be a single component file or entire directory), type in Claude or Cursor:

```
Review my UI components for accessibility and UX issues
```

or

```
Check accessibility of my site
```

or

```
Audit design and apply Web Interface Guidelines
```

**You should see**: AI will activate the `web-design-guidelines` skill and pull the latest 100 rules from GitHub.

### Step 2: Specify Audit Files (if AI didn't auto-detect)

If AI asks which files to audit, you can:

```bash
# Audit a single file
src/components/Button.tsx

# Audit multiple files (separated by spaces)
src/components/Button.tsx src/components/Input.tsx

# Audit entire directory (using glob pattern)
src/components/**/*.tsx
```

### Step 3: AI Auto-Detects Issues

AI will check the code line by line, discovering issues and outputting audit results in `file:line` format. For example:

```typescript
// ❌ Your original code (has issues)
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

**AI's audit results**:

```
## src/components/Button.tsx

src/components/Button.tsx:8 - icon button missing aria-label
src/components/Button.tsx:8 - animation missing prefers-reduced-motion
src/components/Button.tsx:8 - transition: all → list properties explicitly
src/components/Button.tsx:8 - button needs visible focus
```

**Fix code provided by AI**:

```typescript
// ✅ Fixed
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

### Step 4: Common Issue Examples

#### Issue 1: Form input missing label and autocomplete

```typescript
// ❌ Error: missing label and autocomplete
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

```typescript
// ✅ Correct: includes label, name, autocomplete
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

**Rules**:
- `Form Controls need <label> or aria-label`
- `Inputs need autocomplete and meaningful name`
- `Use correct type (email, tel, url, number) and inputmode`

#### Issue 2: Animation doesn't consider `prefers-reduced-motion`

```css
/* ❌ Error: all users see animation, unfriendly to vestibular disorder users */
.modal {
  transition: all 0.3s ease-in-out;
}
```

```css
/* ✅ Correct: respects user's reduced motion preference */
.modal {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
}
```

**Rules**:
- `Honor prefers-reduced-motion (provide reduced variant or disable)`
- `Never transition: all—list properties explicitly`

#### Issue 3: Image missing dimensions and lazy loading

```typescript
// ❌ Error: causes Cumulative Layout Shift (CLS)
<img src="/hero.jpg" alt="Hero image" />
```

```typescript
// ✅ Correct: reserves space in advance, prevents layout shift
<img
  src="/hero.jpg"
  alt="Hero: team working together"
  width={1920}
  height={1080}
  loading="lazy"
  fetchpriority="high"  // For above-fold core images
/>
```

**Rules**:
- `<img> needs explicit width and height (prevents CLS)`
- `Below-fold images: loading="lazy"`
- `Above-fold critical images: priority or fetchpriority="high"`

#### Issue 4: Dark mode doesn't set `color-scheme`

```html
<!-- ❌ Error: native controls (like select, input) still have white background in dark mode -->
<html>
  <body>
    <select>...</select>
  </body>
</html>
```

```html
<!-- ✅ Correct: native controls automatically adapt to dark theme -->
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

**Rules**:
- `color-scheme: dark on <html> for dark themes (fixes scrollbar, inputs)`
- `<meta name="theme-color"> matches page background`
- `Native <select>: explicit background-color and color (Windows dark mode)`

#### Issue 5: Incomplete keyboard navigation support

```typescript
// ❌ Error: only mouse can click, keyboard users cannot use it
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

```typescript
// ✅ Correct: supports keyboard navigation (Enter/Space triggers)
<button
  onClick={handleClick}
  className="cursor-pointer"
  // Automatically supports keyboard, no extra code needed
>
  Click me
</button>

// Or if you must use div, add keyboard support:
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

**Rules**:
- `Interactive elements need keyboard handlers (onKeyDown/onKeyUp)`
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- `Icon-only buttons need aria-label`

#### Issue 6: Long list not virtualized

```typescript
// ❌ Error: rendering 1000 items causes page stuttering
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
// ✅ Correct: use virtual scrolling, only render visible items
import { useVirtualizer } from '@tanstack/react-virtual'

function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,  // Height per item
    overscan: 5,  // Pre-render a few items to prevent whitespace
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

**Rules**:
- `Large lists (>50 items): virtualize (virtua, content-visibility: auto)`

#### Issue 7: Number columns don't use `tabular-nums`

```css
/* ❌ Error: number width varies, causing alignment jump */
.table-cell {
  font-family: system-ui;
}
```

```css
/* ✅ Correct: monospaced numbers, stable alignment */
.table-cell.number {
  font-variant-numeric: tabular-nums;
}
```

**Rules**:
- `font-variant-numeric: tabular-nums for number columns/comparisons`

### Step 5: Fix Common Anti-patterns

AI will automatically flag these anti-patterns:

```typescript
// ❌ Anti-pattern collection
const BadComponent = () => (
  <div>
    {/* Anti-pattern 1: transition: all */}
    <div className="transition-all hover:scale-105">...</div>

    {/* Anti-pattern 2: icon button missing aria-label */}
    <button onClick={handleClose}>✕</button>

    {/* Anti-pattern 3:禁止粘贴 */}
    <Input onPaste={(e) => e.preventDefault()} />

    {/* Anti-pattern 4: outline-none without focus alternative */}
    <button className="focus:outline-none">...</button>

    {/* Anti-pattern 5: image missing dimensions */}
    <img src="/logo.png" alt="Logo" />

    {/* Anti-pattern 6: using div instead of button */}
    <div onClick={handleClick}>Submit</div>

    {/* Anti-pattern 7: hardcoded date format */}
    <Text>{formatDate(new Date(), 'MM/DD/YYYY')}</Text>

    {/* Anti-pattern 8: autofocus on mobile */}
    <input autoFocus />

    {/* Anti-pattern 9: user-scalable=no */}
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

    {/* Anti-pattern 10: large list not virtualized */}
    {largeList.map((item) => (<Item key={item.id} {...item} />))}
  </div>
)
```

```typescript
// ✅ Fixed
const GoodComponent = () => (
  <div>
    {/* Fix 1: explicitly list transition properties */}
    <div className="transition-transform hover:scale-105">...</div>

    {/* Fix 2: icon button includes aria-label */}
    <button onClick={handleClose} aria-label="Close dialog">✕</button>

    {/* Fix 3: allow pasting */}
    <Input />

    {/* Fix 4: use focus-visible ring */}
    <button className="focus:outline-none focus-visible:ring-2">...</button>

    {/* Fix 5: image includes dimensions */}
    <img src="/logo.png" alt="Logo" width={120} height={40} />

    {/* Fix 6: use semantic button */}
    <button onClick={handleClick}>Submit</button>

    {/* Fix 7: use Intl formatting */}
    <Text>{new Intl.DateTimeFormat('en-US').format(new Date())}</Text>

    {/* Fix 8: autoFocus only on desktop */}
    <input autoFocus={isDesktop} />

    {/* Fix 9: allow scaling */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* Fix 10: virtualize */}
    <VirtualList items={largeList}>{(item) => <Item {...item} />}</VirtualList>
  </div>
)
```

## Checkpoint ✅

After completing the above steps, check if you've mastered:

- [ ] Know how to trigger AI for Web Design Guidelines audit
- [ ] Understand the importance of Accessibility (Accessibility is highest priority)
- [ ] Know how to add aria-label and semantic HTML
- [ ] Understand the role of `prefers-reduced-motion`
- [ ] Know how to optimize image loading (dimensions, lazy loading)
- [ ] Understand correct implementation of dark mode (`color-scheme`)
- [ ] Able to identify common UI anti-patterns in code

## Pitfall Alerts

### Pitfall 1: Focus only on visuals, ignore accessibility

::: warning Accessibility is not optional
Accessibility is a legal requirement (like ADA, WCAG) and a social responsibility.

**Common omissions**:
- Icon buttons missing `aria-label`
- Custom controls (like dropdown menus) don't support keyboard
- Form inputs missing `<label>`
- Async updates (like Toast) missing `aria-live="polite"`
:::

### Pitfall 2: Overusing `transition: all`

::: danger Performance Killer
`transition: all` monitors all CSS property changes, causing browsers to recalculate many values.

**Wrong usage**:
```css
.card {
  transition: all 0.3s ease;  // ❌ Will transition background, color, transform, padding, margin, etc.
}
```

**Correct usage**:
```css
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;  // ✅ Only transition needed properties
}
```
:::

### Pitfall 3: Forget `outline` alternative

::: focus-visible is not optional
After removing default `outline`, you must provide visible focus styles, otherwise keyboard users won't know where the focus is.

**Wrong approach**:
```css
button {
  outline: none;  // ❌ Completely removes focus
}
```

**Correct approach**:
```css
button {
  outline: none;  /* Remove default ugly outline */
}

button:focus-visible {
  ring: 2px solid blue;  /* ✅ Add custom focus style (only during keyboard navigation) */
}

button:focus {
  /* Don't show on mouse click (because focus-visible = false) */
}
```
:::

### Pitfall 4: Images missing `alt` or `dimensions`

::: CLS is one of Core Web Vitals
Missing `width` and `height` causes layout shifts during page load, affecting user experience and SEO.

**Remember**:
- Decorative images use `alt=""` (empty string)
- Informational images use descriptive `alt` (e.g., "Team photo: Alice and Bob")
- All images include `width` and `height`
:::

### Pitfall 5: Internationalization (i18n) hardcoded formats

::: Use Intl API
Don't hardcode date, number, currency formats; use browser's built-in `Intl` API.

**Wrong approach**:
```typescript
const formattedDate = formatDate(date, 'MM/DD/YYYY')  // ❌ US format, confusing for other countries
```

**Correct approach**:
```typescript
const formattedDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
}).format(date)  // ✅ Automatically uses user's locale
```
:::

## Lesson Summary

Core principles of Web Interface Design Guidelines:

1. **Accessibility First**: Ensure all users can use it (keyboard, screen readers)
2. **Performance Optimization**: Use `transform/opacity` for animations, lazy load images, virtualize large lists
3. **Respect User Preferences**: `prefers-reduced-motion`, `color-scheme`, allow scaling
4. **Semantic HTML**: Use `<button>`, `<label>`, `<input>` instead of `<div>`
5. **Completeness Checks**: Dark mode, internationalization, form validation, error handling
6. **AI Automated Audit**: Let Agent Skills help you discover and fix 100 rules

Vercel's 100 rules cover all scenarios from basics to details. Learning how to trigger AI to apply these rules will bring your UI quality to production-level standards.

## Next Lesson Preview

Next, we'll learn **[Vercel One-Click Deploy](../vercel-deploy/)**.

You'll learn:
- How to deploy projects to Vercel with one click (supports 40+ frameworks)
- Auto-detect framework types (Next.js, Vue, Svelte, etc.)
- Get preview links and ownership transfer links

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Feature | File Path | Line |
| ------- | --------- | ---- |
| Web Design Guidelines skill definition | [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Full text |
| Rules source (100 rules) | [`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | Full text |
| README overview | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md) | 28-50 |

**17 Rule Categories**:

| Category | Rules Covered | Typical Rules |
| -------- | ------------- | ------------- |
| Accessibility | 10 rules | aria-labels, semantic HTML, keyboard handling |
| Focus States | 4 rules | Visible focus, :focus-visible |
| Forms | 11 rules | autocomplete, validation, error handling |
| Animation | 6 rules | prefers-reduced-motion, transform/opacity |
| Typography | 6 rules | curly quotes, ellipsis, tabular-nums |
| Content Handling | 4 rules | Text truncation, empty state handling |
| Images | 3 rules | dimensions, lazy loading, alt text |
| Performance | 6 rules | virtualization, preconnect, batching |
| Navigation & State | 4 rules | URL reflects state, deep linking |
| Touch & Interaction | 5 rules | touch-action, tap-highlight |
| Safe Areas & Layout | 3 rules | Safe areas, scrollbar handling |
| Dark Mode & Theming | 3 rules | color-scheme, theme-color |
| Locale & i18n | 3 rules | Intl.DateTimeFormat, Intl.NumberFormat |
| Hydration Safety | 3 rules | value + onChange, prevent cell mismatch |
| Hover & Interactive States | 2 rules | Hover states, contrast |
| Content & Copy | 7 rules | Active voice, specific button labels |
| Anti-patterns | 20 rules | Flag common error patterns |

**Key Constants**:
- `RULE_SOURCE_URL = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"`: Rules pull source
- `version = "1.0.0"`: Skill version number (SKILL.md)

**Workflow**:
1. `SKILL.md:23-27`: Pull latest rules from GitHub
2. `SKILL.md:31-38`: Read user files and apply all rules
3. `SKILL.md:39`: If no files specified, ask user

**Trigger Keywords**:
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

</details>
