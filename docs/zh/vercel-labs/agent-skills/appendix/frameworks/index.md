---
title: "支持的框架: 40+ 部署方案 | Agent Skills"
sidebarTitle: "你的框架能部署吗"
subtitle: "支持的框架列表"
description: "查看 Agent Skills 支持的完整框架列表。涵盖 React、Vue、Svelte 等 40+ 种框架，以及框架检测原理和使用说明。"
tags:
  - "框架"
  - "部署"
  - "兼容性"
  - "参考"
order: 130
prerequisite: []
---

# 支持的框架列表

## 学完你能做什么

- 了解 Vercel Deploy 技能支持的完整框架列表（45+ 种）
- 理解框架检测的工作原理
- 判断你的项目是否支持一键部署
- 查看框架检测的优先级规则

## 你现在的困境

你想使用 Agent Skills 的一键部署功能，但不确定你的项目框架是否支持，或者想知道检测逻辑是如何工作的。

## 核心思路

Vercel Deploy 技能通过扫描项目的 `package.json` 文件中的 `dependencies` 和 `devDependencies`，逐个检测预定义的框架特征包名，来判断项目使用的框架。

**检测按优先级顺序**：从最具体的框架检测到最通用，避免误判。例如：
1. 检测 `next` → 匹配到 Next.js
2. 即使同时有 `react`，也会优先识别为 Next.js

::: tip 检测范围

检测会同时检查 `dependencies` 和 `devDependencies`，所以即使框架仅作为开发依赖安装也能被识别。

:::

## 完整框架列表

### React 生态

| 框架                 | 检测依赖         | 返回值             |
|--- | --- | ---|
| **Next.js**          | `next`           | `nextjs`           |
| **Gatsby**           | `gatsby`         | `gatsby`           |
| **Remix**            | `@remix-run/`    | `remix`            |
| **React Router**     | `@react-router/` | `react-router`     |
| **Blitz**            | `blitz`          | `blitzjs`          |
| **Create React App** | `react-scripts`  | `create-react-app` |
| **Ionic React**      | `@ionic/react`   | `ionic-react`      |
| **Preact**           | `preact`         | `preact`           |

### Vue 生态

| 框架          | 检测依赖    | 返回值      |
|--- | --- | ---|
| **Nuxt**      | `nuxt`      | `nuxtjs`    |
| **VitePress** | `vitepress` | `vitepress` |
| **VuePress**  | `vuepress`  | `vuepress`  |
| **Gridsome**  | `gridsome`  | `gridsome`  |

### Svelte 生态

| 框架                | 检测依赖        | 返回值        |
|--- | --- | ---|
| **SvelteKit**       | `@sveltejs/kit` | `sveltekit-1` |
| **Svelte**          | `svelte`        | `svelte`      |
| **Sapper** (legacy) | `sapper`        | `sapper`      |

### Angular

| 框架              | 检测依赖         | 返回值          |
|--- | --- | ---|
| **Angular**       | `@angular/core`  | `angular`       |
| **Ionic Angular** | `@ionic/angular` | `ionic-angular` |

### 静态站点生成器

| 框架           | 检测依赖           | 返回值         |
|--- | --- | ---|
| **Astro**      | `astro`            | `astro`        |
| **Docusaurus** | `@docusaurus/core` | `docusaurus-2` |
| **Hexo**       | `hexo`             | `hexo`         |
| **Eleventy**   | `@11ty/eleventy`   | `eleventy`     |
| **RedwoodJS**  | `@redwoodjs/`      | `redwoodjs`    |

### Node.js 后端框架

| 框架        | 检测依赖       | 返回值    |
|--- | --- | ---|
| **Express** | `express`      | `express` |
| **NestJS**  | `@nestjs/core` | `nestjs`  |
| **Hono**    | `hono`         | `hono`    |
| **Fastify** | `fastify`      | `fastify` |
| **Elysia**  | `elysia`       | `elysia`  |
| **h3**      | `h3`           | `h3`      |
| **Nitro**   | `nitropack`    | `nitro`   |

### 其他框架

| 框架                   | 检测依赖                    | 返回值                  |
|--- | --- | ---|
| **SolidStart**         | `@solidjs/start`            | `solidstart-1`          |
| **Ember**              | `ember-cli`, `ember-source` | `ember`                 |
| **Dojo**               | `@dojo/framework`           | `dojo`                  |
| **Polymer**            | `@polymer/`                 | `polymer`               |
| **Stencil**            | `@stencil/core`             | `stencil`               |
| **UmiJS**              | `umi`                       | `umijs`                 |
| **Saber**              | `saber`                     | `saber`                 |
| **Sanity**             | `sanity`, `@sanity/`        | `sanity` 或 `sanity-v3` |
| **Storybook**          | `@storybook/`               | `storybook`             |
| **Hydrogen** (Shopify) | `@shopify/hydrogen`         | `hydrogen`              |
| **TanStack Start**     | `@tanstack/start`           | `tanstack-start`        |

### 构建工具

| 框架       | 检测依赖 | 返回值   |
|--- | --- | ---|
| **Vite**   | `vite`   | `vite`   |
| **Parcel** | `parcel` | `parcel` |

### 静态 HTML 项目

如果你的项目**没有** `package.json`（纯静态网站），框架检测会返回 `null`。

部署脚本会智能处理：
- 自动检测根目录下的 `.html` 文件
- 如果只有一个 `.html` 文件且不是 `index.html`，会自动重命名为 `index.html`
- 直接作为静态站点托管到 Vercel

**示例场景**：
```bash
my-static-site/
└── demo.html  # 会自动重命名为 index.html
```

## 框架检测原理

### 检测流程

```
读取 package.json
    ↓
扫描 dependencies 和 devDependencies
    ↓
按优先级顺序匹配预定义的包名
    ↓
找到第一个匹配 → 返回对应框架标识
    ↓
未找到匹配 → 返回 null（静态 HTML 项目）
```

### 检测顺序

检测按照框架的具体程度排序，**优先匹配更具体的框架**：

```bash
# 示例：Next.js 项目
dependencies:
  next: ^14.0.0        # 匹配到 → nextjs
  react: ^18.0.0       # 跳过（已有更高优先级匹配）
  react-dom: ^18.0.0
```

**部分检测顺序**：
1. Next.js, Gatsby, Remix, Blitz（具体框架）
2. SvelteKit, Nuxt, Astro（元框架）
3. React, Vue, Svelte（基础库）
4. Vite, Parcel（通用构建工具）

### 检测规则

- **同时检查** `dependencies` 和 `devDependencies`
- **逐个匹配**，找到第一个就返回
- **包名匹配**：精确匹配或前缀匹配
  - 精确匹配：`"next"` → Next.js
  - 前缀匹配：`"@remix-run/"` → Remix

```bash
# shell 检测逻辑（简化版）
has_dep() {
    echo "$content" | grep -q "\"$1\""
}

if has_dep "next"; then
    echo "nextjs"
fi
```

## 如何验证你的项目框架

### 方法 1：查看 package.json

打开项目的 `package.json`，在 `dependencies` 或 `devDependencies` 中查找上述列表中的包名。

```json
{
  "dependencies": {
    "next": "^14.0.0",  ← Next.js
    "react": "^18.0.0"
  }
}
```

### 方法 2：尝试部署

直接使用 Vercel Deploy 功能：

```
Deploy my app to Vercel
```

Claude 会输出检测到的框架：

```
Detected framework: nextjs
```

### 方法 3：手动运行检测脚本

如果你想提前测试，可以运行：

```bash
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh
```

会输出检测到的框架信息（stderr）。

## 踩坑提醒

### 问题 1：框架检测不准确

**现象**：
```
Detected framework: vite
# 但你期待的是 nextjs
```

**原因**：检测按优先级顺序，Vite 检测在 Next.js 之后，但如果项目同时有 `vite` 和 `next`，可能会匹配到 Vite。

**影响**：通常不影响部署，Vercel 会自动检测构建配置。

**解决方法**：
- 检查 `package.json` 中的依赖
- 如果不影响部署，可以忽略
- 部署仍能正常工作，只是使用了不同的配置

### 问题 2：项目不在列表中

**现象**：你的项目框架不在上述列表中。

**可能原因**：
- 这是一个非常新的框架或冷门框架
- 框架使用了不同的包名
- 部署脚本尚未添加支持

**解决方法**：
1. 检查项目是否使用 **Vite** 或 **Parcel** 等通用构建工具
2. 尝试部署，Vercel 可能会自动识别
3. 如果是静态 HTML 项目，直接部署即可
4. 提交 PR 到 [agent-skills](https://github.com/vercel-labs/agent-skills) 添加框架支持

### 问题 3：多框架项目

**现象**：项目同时使用多个框架（如 Remix + Storybook）。

**检测行为**：按优先级返回第一个匹配的框架。

**影响**：通常不影响部署，主框架会被正确识别。

## 常见问题

### Q：我的框架不在列表中，能部署吗？

A：可以尝试。如果项目使用 Vite 或 Parcel 等通用构建工具，可能会被识别为这些工具。Vercel 也会尝试自动检测构建配置。

### Q：检测错误会影响部署吗？

A：通常不会。Vercel 有强大的自动检测机制，即使框架标识不准确，也能正常构建和部署。

### Q：如何添加新框架支持？

A：修改 `deploy.sh` 中的 `detect_framework()` 函数，添加新的检测规则，然后提交 PR 到 [agent-skills](https://github.com/vercel-labs/agent-skills)。

### Q：静态 HTML 项目需要 package.json 吗？

A：不需要。纯静态 HTML 项目（没有 JavaScript 构建）可以直接部署，脚本会自动处理。

## 本课小结

Agent Skills 的 Vercel Deploy 功能支持 **45+ 种框架**，覆盖主流前端技术栈：

**核心价值**：
- ✅ 广泛的框架支持，React/Vue/Svelte/Angular 全覆盖
- ✅ 智能框架检测，自动识别项目类型
- ✅ 支持静态 HTML 项目，零依赖部署
- ✅ 开放源码，可扩展添加新框架

**检测原理**：
- 扫描 `package.json` 的 `dependencies` 和 `devDependencies`
- 按优先级匹配预定义的框架特征包名
- 返回对应的框架标识供 Vercel 使用

**下一步**：
查看 [Vercel 一键部署教程](../../platforms/vercel-deploy/) 了解如何使用这项功能。

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能           | 文件路径                                                                                                                                                                         | 行号    |
|--- | --- | ---|
| 框架检测逻辑   | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156  |
| 部署脚本入口   | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)                                                  | 1-250   |
| 静态 HTML 处理 | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)                                                  | 192-205 |

**关键函数**：
- `detect_framework()`：从 package.json 检测 45+ 种框架（11-156 行）
- `has_dep()`：检查依赖是否存在（23-25 行）

**框架检测顺序**（部分）：
1. Blitz (blitzjs)
2. Next.js (nextjs)
3. Gatsby (gatsby)
4. Remix (remix)
5. React Router (react-router)
6. TanStack Start (tanstack-start)
7. Astro (astro)
8. Hydrogen (hydrogen)
9. SvelteKit (sveltekit-1)
10. Svelte (svelte)
...（完整列表见 11-156 行）

**返回值示例**：
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- 静态 HTML: `null`

</details>
