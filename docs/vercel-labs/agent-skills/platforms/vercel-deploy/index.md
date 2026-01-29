---
title: "One-Click Vercel Deployment: Zero-Auth Publishing | Agent Skills"
sidebarTitle: "Vercel Deploy"
subtitle: "One-Click Vercel Deployment: Zero-Auth Publishing"
description: "Learn Agent Skills' Vercel Deploy for one-click deployment. Auto-detects frameworks, supports 40+ stacks, and provides zero-auth publishing with instant preview URLs."
tags:
  - "Vercel"
  - "Deployment"
  - "One-Click Deployment"
  - "Frontend Frameworks"
order: 50
prerequisite:
  - "start-installation"
---

# One-Click Vercel Deployment: Publish Apps Fast with Zero Auth

## What You'll Learn

- Deploy projects to Vercel with a single prompt, no manual configuration needed
- Get accessible preview URLs and ownership transfer links
- Auto-detect project frameworks (Next.js, React, Vue, Svelte, and 40+ others)
- Handle static HTML websites, including single-file renaming

## Your Current Problem

Every time you want to share a project, you need to:

1. Manually log in to Vercel website
2. Create a new project
3. Connect Git repository
4. Wait for build completion
5. Remember a long URL to share with others

If you just want to quickly show a demo or prototype, these steps are too cumbersome.

## When to Use This

 Suitable for these scenarios:

- 🚀 Quickly create project previews to share with your team
- 📦 Show demos to clients or friends
- 🔄 Automatically generate preview deployments in CI/CD
- 🌐 Deploy static HTML pages or single-page applications

## Core Concept

The workflow for the Vercel Deploy skill is simple:

```
Your speech → Claude detects keyword → Activates deployment skill
      ↓
          Detect framework type (from package.json)
      ↓
          Package project (exclude node_modules and .git)
      ↓
          Upload to Vercel API
      ↓
          Return two links (preview + claim)
```

**Why do you need two links?**

- **Preview URL**: Immediately accessible preview address
- **Claim URL**: Transfer this deployment to your Vercel account for management

The benefit of this design: the deployer (Agent) doesn't need your account permissions, and you can claim ownership later through the Claim URL.

## 🎒 Preparation

::: warning Prerequisites

- ✅ Completed [Agent Skills Installation](../../installation/)
- ✅ Complete project directory structure (has `package.json` or is a static HTML project)
- ✅ Claude.ai network permissions configured (if using claude.ai)

:::

::: info Network Permissions Reminder

If you're using **claude.ai** (web version), you need to allow access to `*.vercel.com` domain:

1. Go to [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Add `*.vercel.com` to the whitelist
3. Save settings and retry

If your deployment fails with a network error, check this setting.

:::

## Follow Along

### Step 1: Switch to Project Directory

```bash
# Enter your project directory
cd /path/to/your/project
```

**Why**
The deployment script needs to find your project's `package.json` and source files, so directory positioning is important.

### Step 2: Tell Claude to Deploy

Enter in Claude conversation:

```
Deploy my app to Vercel
```

You can also try these trigger words:

- "Deploy this to production"
- "Deploy and give me the link"
- "Push this live"
- "Create a preview deployment"

### Step 3: Observe Deployment Process

You'll see similar output:

```
Preparing deployment...
Detected framework: nextjs
Creating deployment package...
Deploying...
✓ Deployment successful!

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...

View your site at the Preview URL.
To transfer this deployment to your Vercel account, visit the Claim URL.
```

At the same time, Claude will also output in JSON format (convenient for script parsing):

```json
{
  "previewUrl": "https://skill-deploy-abc123.vercel.app",
  "claimUrl": "https://vercel.com/claim-deployment?code=...",
  "deploymentId": "dpl_...",
  "projectId": "prj_..."
}
```

**What you should see**:
- Deployment success message ✓
- Two URLs (preview and claim)
- If it's a code project, it will also show the detected framework name

### Step 4: Access Preview Link

**Click Preview URL**, and you can see the website live!

If this is a demo or temporary display, the task is complete.

### Step 5: (Optional) Transfer Ownership

If you want to manage this deployment long-term:

1. Click **Claim URL**
2. Log in to your Vercel account
3. Confirm transfer
4. Deployment now belongs to your account, you can continue editing and managing

**What you should see**:
- Deployment appears under your Vercel account
- You can view logs, redeploy, etc. in Vercel Dashboard

## Checkpoint ✅

After deployment is complete, confirm the following:

- [ ] Preview URL is accessible in browser
- [ ] Page displays normally (no 404 or build errors)
- [ ] If it's a code project, framework detection is correct (Next.js, Vite, etc.)
- [ ] If long-term management is needed, ownership has been transferred via Claim URL

## Supported Frameworks

The Vercel Deploy skill can automatically detect **40+ frameworks**:

| Category | Frameworks (partial examples) |
|--- | ---|
| **React** | Next.js, Gatsby, Create React App, Remix |
| **Vue** | Nuxt, Vitepress, Vuepress |
| **Svelte** | SvelteKit, Svelte |
| **Angular** | Angular, Ionic Angular |
| **Node.js Backend** | Express, Hono, Fastify, NestJS |
| **Build Tools** | Vite, Parcel |
| **Other** | Astro, Solid Start, Ember, Astro, Hexo, Eleventy |

::: tip Framework Detection Principle

The script reads your `package.json` and checks package names in `dependencies` and `devDependencies`.

If multiple matches exist, the script will select the most specific framework by priority (e.g., Next.js takes priority over generic React).

:::

## Static HTML Projects

If your project **does not** have `package.json` (pure static website), the deployment skill will handle it intelligently:

- **Auto-detect**: Detect `.html` files in the root directory
- **Rename**: If there's only one `.html` file and it's not `index.html`, it will automatically be renamed to `index.html`
- **Direct deploy**: Host as a static site on Vercel

**Example scenario**:
```bash
my-static-site/
└── demo.html  # Will automatically be renamed to index.html
```

After deployment, visit the preview link to see the content of `demo.html`.

## Common Pitfalls

### Issue 1: Deployment Failed with Network Error

**Symptom**:
```
Error: Network Egress Error
```

**Cause**: claude.ai blocks access to external domains by default.

**Solution**:
1. Go to [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Add `*.vercel.com` to whitelist
3. Retry deployment

### Issue 2: Inaccurate Framework Detection

**Symptom**:
```
Detected framework: vite
# But you expected nextjs
```

**Cause**: The script matches by dependency priority and may stop after detecting `vite`.

**Solution**:
- Check the dependency order in `package.json`
- If it doesn't affect deployment, you can ignore it (Vercel will build automatically)
- The project can still deploy normally, just possibly using default Vite configuration

### Issue 3: Static Website 404

**Symptom**:
Single `.html` file returns 404 after deployment.

**Solution**:
Ensure the HTML file is in the project root. If the file is in a subdirectory, Vercel won't route it to the root path by default.

**Correct structure**:
```
project/
└── my-site.html  # Single file in root, will automatically be renamed to index.html
```

**Incorrect structure**:
```
project/
└── dist/
    └── my-site.html  # Won't auto-rename, access will return 404
```

### Issue 4: Deployment Successful but Page Errors

**Symptom**:
Deployment successful, but page shows build error or runtime error when accessed.

**Solution**:
- Run `npm run build` locally to check if it passes
- Check deployment logs (if transferred to your own Vercel account)
- Check environment variables (if project depends on `.env`)

::: tip Auto-excluded Files

The deployment script automatically excludes:
- `node_modules/` (avoid uploading dependencies)
- `.git/` (avoid uploading version history)

If your project needs to exclude other files (like `.env`), it's recommended to handle them when manually packaging.

:::

## Advanced Usage

### Specify Deployment Path

You can also specify deployments for other directories:

```
Deploy the project at ./my-app
```

Claude will use that path for deployment.

### Deploy from Existing tarball

If you already have a packaged `.tgz` file:

```
Deploy /path/to/project.tgz to Vercel
```

The script will directly upload the existing archive, skipping the packaging step.

## Summary

The Vercel Deploy skill makes deployment simpler than ever:

**Core Value**:
- ✅ Deploy with a single prompt, no manual configuration needed
- ✅ Auto-detect frameworks, support 40+ tech stacks
- ✅ Zero-auth deployment, high security
- ✅ Return preview link + ownership transfer link

**Use Cases**:
- 🚀 Quickly share demos or prototypes
- 📦 Internal team previews
- 🔄 Automated CI/CD workflows
- 🌐 Static site hosting

**Next Steps**:
If you want to delve deeper into how the skill works, check out [React Performance Best Practices](../react-best-practices/) or learn how to [develop custom skills](../../advanced/skill-development/).

## Next Lesson Preview

> In the next lesson, we'll learn **[React/Next.js Performance Best Practices](../react-best-practices/)**.
>
> You'll learn:
> - 57 React performance optimization rules
> - How to eliminate waterfalls and optimize bundle size
> - How Agent automatically checks code and provides fix suggestions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Function              | File Path                                                                                             | Lines     |
|--- | --- | ---|
| Deployment script entry      | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250    |
| Framework detection logic      | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156   |
| Package and upload to API  | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 208-222  |
| Static HTML rename  | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205  |
| Skill definition document      | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-113    |
| Network error troubleshooting      | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 102-112  |

**Key constants**:
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`: Vercel deployment API endpoint

**Key functions**:
- `detect_framework()`: Detect 40+ frameworks from package.json

**Supported framework detection** (sorted by priority):
- React family: Next.js, Gatsby, Remix, React Router
- Vue family: Nuxt, Vitepress, Vuepress
- Svelte family: SvelteKit, Svelte
- Others: Astro, Angular, Express, Hono, Vite, Parcel, etc.

</details>
