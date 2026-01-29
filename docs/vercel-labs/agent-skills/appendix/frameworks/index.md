---
title: "Supported Frameworks List: 40+ Deployment Options | Agent Skills Tutorial"
sidebarTitle: "Supported Frameworks"
subtitle: "Supported Frameworks List"
description: "View complete list of frameworks supported by Agent Skills' Vercel Deploy feature. Covers 45+ frontend frameworks and static site generators including React, Vue, Svelte, Angular, plus detection principles and usage instructions."
tags:
  - "Frameworks"
  - "Deployment"
  - "Compatibility"
  - "Reference"
order: 130
prerequisite: []
---

# Supported Frameworks List

## What You'll Learn

- Understand the complete list of frameworks supported by the Vercel Deploy skill (45+ types)
- Learn how framework detection works internally
- Determine if your project is supported for one-click deployment
- View framework detection priority rules

## Your Current Problem

You want to use Agent Skills' one-click deployment feature, but you're unsure if your project's framework is supported, or you want to understand how the detection logic works.

## Core Concept

The Vercel Deploy skill scans the `package.json` file's `dependencies` and `devDependencies` to detect a list of predefined framework-specific package names, identifying the framework used by the project.

**Detection follows priority order**: From the most specific frameworks to the most generic ones, avoiding misidentification. For example:
1. Detect `next` → Matches Next.js
2. Even if `react` is also present, it will be identified as Next.js first

::: tip Detection Scope

Detection checks both `dependencies` and `devDependencies`, so frameworks installed only as dev dependencies can also be identified.

:::

## Complete Framework List

### React Ecosystem

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **Next.js** | `next` | `nextjs` |
| **Gatsby** | `gatsby` | `gatsby` |
| **Remix** | `@remix-run/` | `remix` |
| **React Router** | `@react-router/` | `react-router` |
| **Blitz** | `blitz` | `blitzjs` |
| **Create React App** | `react-scripts` | `create-react-app` |
| **Ionic React** | `@ionic/react` | `ionic-react` |
| **Preact** | `preact` | `preact` |

### Vue Ecosystem

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **Nuxt** | `nuxt` | `nuxtjs` |
| **VitePress** | `vitepress` | `vitepress` |
| **VuePress** | `vuepress` | `vuepress` |
| **Gridsome** | `gridsome` | `gridsome` |

### Svelte Ecosystem

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **SvelteKit** | `@sveltejs/kit` | `sveltekit-1` |
| **Svelte** | `svelte` | `svelte` |
| **Sapper** (legacy) | `sapper` | `sapper` |

### Angular

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **Angular** | `@angular/core` | `angular` |
| **Ionic Angular** | `@ionic/angular` | `ionic-angular` |

### Static Site Generators

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **Astro** | `astro` | `astro` |
| **Docusaurus** | `@docusaurus/core` | `docusaurus-2` |
| **Hexo** | `hexo` | `hexo` |
| **Eleventy** | `@11ty/eleventy` | `eleventy` |
| **RedwoodJS** | `@redwoodjs/` | `redwoodjs` |

### Node.js Backend Frameworks

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **Express** | `express` | `express` |
| **NestJS** | `@nestjs/core` | `nestjs` |
| **Hono** | `hono` | `hono` |
| **Fastify** | `fastify` | `fastify` |
| **Elysia** | `elysia` | `elysia` |
| **h3** | `h3` | `h3` |
| **Nitro** | `nitropack` | `nitro` |

### Other Frameworks

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **SolidStart** | `@solidjs/start` | `solidstart-1` |
| **Ember** | `ember-cli`, `ember-source` | `ember` |
| **Dojo** | `@dojo/framework` | `dojo` |
| **Polymer** | `@polymer/` | `polymer` |
| **Stencil** | `@stencil/core` | `stencil` |
| **UmiJS** | `umi` | `umijs` |
| **Saber** | `saber` | `saber` |
| **Sanity** | `sanity`, `@sanity/` | `sanity` or `sanity-v3` |
| **Storybook** | `@storybook/` | `storybook` |
| **Hydrogen** (Shopify) | `@shopify/hydrogen` | `hydrogen` |
| **TanStack Start** | `@tanstack/start` | `tanstack-start` |

### Build Tools

| Framework | Detection Dependency | Return Value |
|--- | --- | ---|
| **Vite** | `vite` | `vite` |
| **Parcel** | `parcel` | `parcel` |

### Static HTML Projects

If your project **does not** have `package.json` (pure static website), framework detection will return `null`.

The deployment script intelligently handles this:
- Automatically detects `.html` files in the root directory
- If there's only one `.html` file and it's not `index.html`, it will automatically be renamed to `index.html`
- Directly hosts it as a static site on Vercel

**Example scenario**:
```bash
my-static-site/
└── demo.html  # Will automatically be renamed to index.html
```

## Framework Detection Principles

### Detection Flow

```
Read package.json
    ↓
Scan dependencies and devDependencies
    ↓
Match predefined package names in priority order
    ↓
Found first match → Return corresponding framework identifier
    ↓
No match → Return null (static HTML project)
```

### Detection Order

Detection is ordered by framework specificity, **prioritizing more specific frameworks**:

```bash
# Example: Next.js project
dependencies:
  next: ^14.0.0        # Matches → nextjs
  react: ^18.0.0       # Skipped (higher priority match exists)
  react-dom: ^18.0.0
```

**Partial detection order**:
1. Next.js, Gatsby, Remix, Blitz (specific frameworks)
2. SvelteKit, Nuxt, Astro (meta-frameworks)
3. React, Vue, Svelte (base libraries)
4. Vite, Parcel (generic build tools)

### Detection Rules

- **Check both** `dependencies` and `devDependencies`
- **Match one by one**, return on first find
- **Package name matching**: Exact match or prefix match
  - Exact match: `"next"` → Next.js
  - Prefix match: `"@remix-run/"` → Remix

```bash
# Shell detection logic (simplified)
has_dep() {
    echo "$content" | grep -q "\"$1\""
}

if has_dep "next"; then
    echo "nextjs"
fi
```

## How to Verify Your Project's Framework

### Method 1: Check package.json

Open your project's `package.json` and look for package names from the above list in `dependencies` or `devDependencies`.

```json
{
  "dependencies": {
    "next": "^14.0.0",  ← Next.js
    "react": "^18.0.0"
  }
}
```

### Method 2: Try Deploying

Simply use the Vercel Deploy feature:

```
Deploy my app to Vercel
```

Claude will output the detected framework:

```
Detected framework: nextjs
```

### Method 3: Manually Run Detection Script

If you want to test beforehand, you can run:

```bash
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh
```

It will output the detected framework information (stderr).

## Common Pitfalls

### Issue 1: Inaccurate Framework Detection

**Symptom**:
```
Detected framework: vite
# But you expected nextjs
```

**Cause**: Detection follows priority order. Vite detection is after Next.js, but if the project has both `vite` and `next`, it might match Vite.

**Impact**: Usually doesn't affect deployment. Vercel will automatically detect build configuration.

**Solution**:
- Check dependencies in `package.json`
- If it doesn't affect deployment, you can ignore it
- Deployment will still work normally, just using a different configuration

### Issue 2: Project Not in List

**Symptom**: Your project's framework isn't in the list above.

**Possible reasons**:
- It's a very new or niche framework
- The framework uses a different package name
- The deployment script hasn't added support yet

**Solution**:
1. Check if the project uses generic build tools like **Vite** or **Parcel**
2. Try deploying - Vercel may auto-detect it
3. If it's a static HTML project, deploy directly
4. Submit a PR to [agent-skills](https://github.com/vercel-labs/agent-skills) to add framework support

### Issue 3: Multi-Framework Projects

**Symptom**: Project uses multiple frameworks simultaneously (e.g., Remix + Storybook).

**Detection behavior**: Returns the first matching framework by priority.

**Impact**: Usually doesn't affect deployment. The main framework will be correctly identified.

## FAQ

### Q: My framework isn't in the list, can I deploy?

A: You can try. If the project uses generic build tools like Vite or Parcel, it may be recognized as one of those. Vercel will also attempt to auto-detect build configuration.

### Q: Will a detection error affect deployment?

A: Usually not. Vercel has powerful auto-detection mechanisms. Even if the framework identifier is inaccurate, it can still build and deploy normally.

### Q: How do I add new framework support?

A: Modify the `detect_framework()` function in `deploy.sh`, add new detection rules, then submit a PR to [agent-skills](https://github.com/vercel-labs/agent-skills).

### Q: Do static HTML projects need package.json?

A: No. Pure static HTML projects (without JavaScript build) can be deployed directly. The script will handle it automatically.

## Summary

Agent Skills' Vercel Deploy feature supports **45+ frameworks**, covering mainstream frontend tech stacks:

**Core Value**:
- ✅ Broad framework support - React/Vue/Svelte/Angular fully covered
- ✅ Intelligent framework detection - automatically identifies project type
- ✅ Supports static HTML projects - zero-dependency deployment
- ✅ Open source - extensible to add new frameworks

**Detection Principle**:
- Scan `package.json`'s `dependencies` and `devDependencies`
- Match predefined framework-specific package names by priority
- Return corresponding framework identifier for Vercel use

**Next Steps**:
Check out [Vercel One-Click Deployment Tutorial](../../platforms/vercel-deploy/) to learn how to use this feature.

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Function        | File Path                                                                                             | Lines    |
|--- | --- | ---|
| Framework detection logic | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156  |
| Deployment script entry | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250   |
| Static HTML handling | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**Key functions**:
- `detect_framework()`: Detect 45+ frameworks from package.json (lines 11-156)
- `has_dep()`: Check if dependency exists (lines 23-25)

**Framework detection order** (partial):
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
... (see lines 11-156 for full list)

**Return value examples**:
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- Static HTML: `null`

</details>
