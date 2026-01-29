---
title: "支援框架列表: Vercel 部署 45+ 種方案 | Agent Skills"
sidebarTitle: "框架列表"
subtitle: "支援的框架列表"
description: "了解 Agent Skills Vercel Deploy 功能支援的完整框架列表。涵蓋 React、Vue、Svelte、Angular 等 45+ 種前端框架和靜態站點生成器，包含偵測原理、優先級規則和使用說明。"
tags:
  - "框架"
  - "部署"
  - "相容性"
  - "參考"
prerequisite: []
---

# 支援的框架列表

## 學完你能做什麼

- 了解 Vercel Deploy 技能支援的完整框架列表（45+ 種）
- 理解框架偵測的工作原理
- 判斷你的專案是否支援一鍵部署
- 查看框架偵測的優先級規則

## 你現在的困境

你想使用 Agent Skills 的一鍵部署功能，但不確定你的專案框架是否支援，或者想知道偵測邏輯是如何工作的。

## 核心思路

Vercel Deploy 技能透過掃描專案的 `package.json` 檔案中的 `dependencies` 和 `devDependencies`，逐個偵測預定義的框架特徵套件名稱，來判斷專案使用的框架。

**偵測按優先級順序**：從最具體的框架偵測到最通用，避免誤判。例如：
1. 偵測 `next` → 匹配到 Next.js
2. 即使同時有 `react`，也會優先識別為 Next.js

::: tip 偵測範圍

偵測會同時檢查 `dependencies` 和 `devDependencies`，所以即使框架僅作為開發相依性安裝也能被識別。

:::

## 完整框架列表

### React 生態

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **Next.js** | `next` | `nextjs` |
| **Gatsby** | `gatsby` | `gatsby` |
| **Remix** | `@remix-run/` | `remix` |
| **React Router** | `@react-router/` | `react-router` |
| **Blitz** | `blitz` | `blitzjs` |
| **Create React App** | `react-scripts` | `create-react-app` |
| **Ionic React** | `@ionic/react` | `ionic-react` |
| **Preact** | `preact` | `preact` |

### Vue 生態

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **Nuxt** | `nuxt` | `nuxtjs` |
| **VitePress** | `vitepress` | `vitepress` |
| **VuePress** | `vuepress` | `vuepress` |
| **Gridsome** | `gridsome` | `gridsome` |

### Svelte 生態

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **SvelteKit** | `@sveltejs/kit` | `sveltekit-1` |
| **Svelte** | `svelte` | `svelte` |
| **Sapper** (legacy) | `sapper` | `sapper` |

### Angular

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **Angular** | `@angular/core` | `angular` |
| **Ionic Angular** | `@ionic/angular` | `ionic-angular` |

### 靜態站點生成器

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **Astro** | `astro` | `astro` |
| **Docusaurus** | `@docusaurus/core` | `docusaurus-2` |
| **Hexo** | `hexo` | `hexo` |
| **Eleventy** | `@11ty/eleventy` | `eleventy` |
| **RedwoodJS** | `@redwoodjs/` | `redwoodjs` |

### Node.js 後端框架

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **Express** | `express` | `express` |
| **NestJS** | `@nestjs/core` | `nestjs` |
| **Hono** | `hono` | `hono` |
| **Fastify** | `fastify` | `fastify` |
| **Elysia** | `elysia` | `elysia` |
| **h3** | `h3` | `h3` |
| **Nitro** | `nitropack` | `nitro` |

### 其他框架

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **SolidStart** | `@solidjs/start` | `solidstart-1` |
| **Ember** | `ember-cli`, `ember-source` | `ember` |
| **Dojo** | `@dojo/framework` | `dojo` |
| **Polymer** | `@polymer/` | `polymer` |
| **Stencil** | `@stencil/core` | `stencil` |
| **UmiJS** | `umi` | `umijs` |
| **Saber** | `saber` | `saber` |
| **Sanity** | `sanity`, `@sanity/` | `sanity` 或 `sanity-v3` |
| **Storybook** | `@storybook/` | `storybook` |
| **Hydrogen** (Shopify) | `@shopify/hydrogen` | `hydrogen` |
| **TanStack Start** | `@tanstack/start` | `tanstack-start` |

### 建構工具

| 框架 | 偵測相依性 | 返回值 |
|------|---------|--------|
| **Vite** | `vite` | `vite` |
| **Parcel** | `parcel` | `parcel` |

### 靜態 HTML 專案

如果你的專案**沒有** `package.json`（純靜態網站），框架偵測會返回 `null`。

部署腳本會智慧處理：
- 自動偵測根目錄下的 `.html` 檔案
- 如果只有一個 `.html` 檔案且不是 `index.html`，會自動重新命名為 `index.html`
- 直接作為靜態站點託管到 Vercel

**範例場景**：
```bash
my-static-site/
└── demo.html  # 會自動重新命名為 index.html
```

## 框架偵測原理

### 偵測流程

```
讀取 package.json
    ↓
掃描 dependencies 和 devDependencies
    ↓
按優先級順序匹配預定義的套件名稱
    ↓
找到第一個匹配 → 返回對應框架識別碼
    ↓
未找到匹配 → 返回 null（靜態 HTML 專案）
```

### 偵測順序

偵測按照框架的具體程度排序，**優先匹配更具體的框架**：

```bash
# 範例：Next.js 專案
dependencies:
  next: ^14.0.0        # 匹配到 → nextjs
  react: ^18.0.0       # 跳過（已有更高優先級匹配）
  react-dom: ^18.0.0
```

**部分偵測順序**：
1. Next.js, Gatsby, Remix, Blitz（具體框架）
2. SvelteKit, Nuxt, Astro（元框架）
3. React, Vue, Svelte（基礎庫）
4. Vite, Parcel（通用建構工具）

### 偵測規則

- **同時檢查** `dependencies` 和 `devDependencies`
- **逐個匹配**，找到第一個就返回
- **套件名稱匹配**：精確匹配或前綴匹配
  - 精確匹配：`"next"` → Next.js
  - 前綴匹配：`"@remix-run/"` → Remix

```bash
# shell 偵測邏輯（簡化版）
has_dep() {
    echo "$content" | grep -q "\"$1\""
}

if has_dep "next"; then
    echo "nextjs"
fi
```

## 如何驗證你的專案框架

### 方法 1：查看 package.json

開啟專案的 `package.json`，在 `dependencies` 或 `devDependencies` 中查找上述列表中的套件名稱。

```json
{
  "dependencies": {
    "next": "^14.0.0",  ← Next.js
    "react": "^18.0.0"
  }
}
```

### 方法 2：嘗試部署

直接使用 Vercel Deploy 功能：

```
Deploy my app to Vercel
```

Claude 會輸出偵測到的框架：

```
Detected framework: nextjs
```

### 方法 3：手動執行偵測腳本

如果你想提前測試，可以執行：

```bash
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh
```

會輸出偵測到的框架資訊（stderr）。

## 踩坑提醒

### 問題 1：框架偵測不準確

**現象**：
```
Detected framework: vite
# 但你期待的是 nextjs
```

**原因**：偵測按優先級順序，Vite 偵測在 Next.js 之後，但如果專案同時有 `vite` 和 `next`，可能會匹配到 Vite。

**影響**：通常不影響部署，Vercel 會自動偵測建構設定。

**解決方法**：
- 檢查 `package.json` 中的相依性
- 如果不影響部署，可以忽略
- 部署仍能正常運作，只是使用了不同的設定

### 問題 2：專案不在列表中

**現象**：你的專案框架不在上述列表中。

**可能原因**：
- 這是一個非常新的框架或冷門框架
- 框架使用了不同的套件名稱
- 部署腳本尚未新增支援

**解決方法**：
1. 檢查專案是否使用 **Vite** 或 **Parcel** 等通用建構工具
2. 嘗試部署，Vercel 可能會自動識別
3. 如果是靜態 HTML 專案，直接部署即可
4. 提交 PR 到 [agent-skills](https://github.com/vercel-labs/agent-skills) 新增框架支援

### 問題 3：多框架專案

**現象**：專案同時使用多個框架（如 Remix + Storybook）。

**偵測行為**：按優先級返回第一個匹配的框架。

**影響**：通常不影響部署，主框架會被正確識別。

## 常見問題

### Q：我的框架不在列表中，能部署嗎？

A：可以嘗試。如果專案使用 Vite 或 Parcel 等通用建構工具，可能會被識別為這些工具。Vercel 也會嘗試自動偵測建構設定。

### Q：偵測錯誤會影響部署嗎？

A：通常不會。Vercel 有強大的自動偵測機制，即使框架識別碼不準確，也能正常建構和部署。

### Q：如何新增新框架支援？

A：修改 `deploy.sh` 中的 `detect_framework()` 函式，新增新的偵測規則，然後提交 PR 到 [agent-skills](https://github.com/vercel-labs/agent-skills)。

### Q：靜態 HTML 專案需要 package.json 嗎？

A：不需要。純靜態 HTML 專案（沒有 JavaScript 建構）可以直接部署，腳本會自動處理。

## 本課小結

Agent Skills 的 Vercel Deploy 功能支援 **45+ 種框架**，覆蓋主流前端技術堆疊：

**核心價值**：
- ✅ 廣泛的框架支援，React/Vue/Svelte/Angular 全覆蓋
- ✅ 智慧框架偵測，自動識別專案類型
- ✅ 支援靜態 HTML 專案，零相依性部署
- ✅ 開放原始碼，可擴充新增框架

**偵測原理**：
- 掃描 `package.json` 的 `dependencies` 和 `devDependencies`
- 按優先級匹配預定義的框架特徵套件名稱
- 返回對應的框架識別碼供 Vercel 使用

**下一步**：
查看 [Vercel 一鍵部署教學](../../platforms/vercel-deploy/) 了解如何使用這項功能。

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能        | 檔案路徑                                                                                             | 行號    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| 框架偵測邏輯 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156  |
| 部署腳本入口 | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250   |
| 靜態 HTML 處理 | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**關鍵函式**：
- `detect_framework()`：從 package.json 偵測 45+ 種框架（11-156 行）
- `has_dep()`：檢查相依性是否存在（23-25 行）

**框架偵測順序**（部分）：
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
...（完整列表見 11-156 行）

**返回值範例**：
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- 靜態 HTML: `null`

</details>
