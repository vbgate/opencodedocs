---
title: "Getting Started: Quick Setup | Antigravity-Manager"
sidebarTitle: "Getting Started"
subtitle: "Getting Started: Quick Setup"
description: "Learn Antigravity Tools setup. Install, configure accounts, and connect AI clients in 30 minutes."
order: 1
---

# Getting Started

This chapter guides you through using Antigravity Tools from scratch, covering the complete workflow from installation to your first successful API call. You'll learn core concepts, account management, data backup, and how to connect your AI client to the local gateway.

## In This Chapter

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">What is Antigravity Tools</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Build the right mental model: core concepts and usage boundaries of local gateway, protocol compatibility, and account pool scheduling.</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Installation & Upgrades</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Best installation paths for desktop (brew / releases), and handling common system interceptions.</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">First Run Essentials</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Data directory, logs, tray icon, and auto-startup to avoid accidental deletion and irreversible loss.</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Add Accounts</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">OAuth/Refresh Token dual channels and best practices for building your account pool reliably.</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Backup & Migration</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">Import/export, V1/DB hot migration, supporting multi-machine reuse and server deployment scenarios.</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Start Reverse Proxy & Connect Client</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">From starting the service to successful external client calls, complete the verification loop in one go.</p>
</a>

</div>

## Learning Path

::: tip Recommended Order
Follow this order to get started with Antigravity Tools quickly:
:::

```
1. Concepts        →  2. Installation     →  3. Data Directory
   getting-started      installation          first-run-data
        ↓                    ↓                      ↓
4. Add Accounts     →  5. Backup         →  6. Start Proxy
   add-account          backup-migrate        proxy-and-first-client
```

| Step | Lesson | Estimated Time | What You'll Learn |
|------|--------|----------------|-------------------|
| 1 | [Concepts](./getting-started/) | 5 min | What is a local gateway, why you need an account pool |
| 2 | [Installation](./installation/) | 3 min | brew install or manual download, handling system interception |
| 3 | [Data Directory](./first-run-data/) | 5 min | Where data is stored, how to read logs, tray operations |
| 4 | [Add Accounts](./add-account/) | 10 min | OAuth authorization or manual Refresh Token entry |
| 5 | [Backup](./backup-migrate/) | 5 min | Export accounts, cross-device migration |
| 6 | [Start Proxy](./proxy-and-first-client/) | 10 min | Start service, configure client, verify calls |

**Minimum viable path**: If you're in a rush, you can complete 1 → 2 → 4 → 6 in about 25 minutes to get started.

## Next Steps

After completing this chapter, you should be able to use Antigravity Tools normally. Next, you can dive deeper based on your needs:

- **[Platforms & Integrations](../platforms/)**: Learn integration details for OpenAI, Anthropic, Gemini, and other protocols
- **[Advanced Configuration](../advanced/)**: Model routing, quota protection, high-availability scheduling, and other advanced features
- **[FAQ](../faq/)**: Troubleshooting guide for 401, 429, 404, and other errors
