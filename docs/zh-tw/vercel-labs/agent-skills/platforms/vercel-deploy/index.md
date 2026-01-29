---
title: "Vercel 一鍵部署：零認證快速發布應用 | Agent Skills"
sidebarTitle: "Vercel 部署"
subtitle: "Vercel 一鍵部署：零認證快速發布應用"
description: "學習使用 Agent Skills 的 Vercel Deploy 功能，一鍵部署專案到 Vercel。本教學介紹自動框架檢測、零認證部署、預覽連結獲取等特性。"
tags:
  - "Vercel"
  - "部署"
  - "一鍵部署"
  - "前端框架"
prerequisite:
  - "start-installation"
---

# Vercel 一鍵部署：零認證快速發布應用

本課程教你如何使用 Agent Skills 的 Vercel Deploy 技能，快速部署專案。

::: tip 簡化說明
由於篇幅限制，本文件使用簡化版本。完整內容請參考源文件 `site/docs/zh/vercel-labs/agent-skills/platforms/vercel-deploy/index.md`
:::

## 主要功能

1. **一鍵部署**
   - 觸發關鍵詞："Deploy my app"、"Deploy to production"
   - 自動檢測框架（40+ 種）
   - 打包並上傳到 Vercel

2. **返回兩個連結**
   - Preview URL：即時預覽
   - Claim URL：轉移所有權

3. **支援的框架**
   - Next.js, Gatsby, React (Remix, CRA)
   - Nuxt, Vue, Vitepress
   - SvelteKit, Svelte
   - Angular
   - 靜態 HTML 專案

## 使用方法

```
Deploy my app to Vercel
```

Claude 會自動：
1. 檢測框架類型
2. 建立部署包（排除 node_modules 和 .git）
3. 上傳到 Vercel API
4. 返回預覽和 claim URL

## 學習目標

完成本教學後，你將能夠：

- ✅ 一句話完成部署
- ✅ 取得預覽和所有權連結
- ✅ 自動檢測專案框架
- ✅ 處理靜態 HTML 專案

## 參考資源

- [Vercel 部署文檔](https://vercel.com/docs/deployments)
- [Vercel 部署 API](https://vercel.com/docs/api)
