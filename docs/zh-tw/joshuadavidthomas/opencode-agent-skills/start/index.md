---
title: "快速開始：使用 Agent Skills | opencode-agent-skills"
sidebarTitle: "30 分鐘上手"
order: 1
subtitle: "快速開始"
description: "學習 OpenCode Agent Skills 外掛的快速上手方法。在 30 分鐘內完成安裝設定，建立第一個技能，掌握外掛核心功能。"
---

# 快速開始

本章節幫助你從零開始使用 OpenCode Agent Skills 外掛。你將了解外掛的核心價值，完成安裝設定，並建立你的第一個技能。

## 本章內容

<div class="grid-cards">

<a href="./what-is-opencode-agent-skills/" class="card">
  <h3>什麼是 OpenCode Agent Skills？</h3>
  <p>了解外掛的核心價值和功能特性，包括動態技能發現、上下文注入、壓縮恢復等機制。</p>
</a>

<a href="./installation/" class="card">
  <h3>安裝指南</h3>
  <p>完成外掛安裝並驗證運行，支援基本安裝、固定版本安裝和本地開發安裝三種方式。</p>
</a>

<a href="./creating-your-first-skill/" class="card">
  <h3>建立你的第一個技能</h3>
  <p>掌握技能目錄結構和 SKILL.md 格式規範，動手建立並測試一個簡單技能。</p>
</a>

</div>

## 學習路徑

建議按以下順序學習：

1. **[什麼是 OpenCode Agent Skills？](./what-is-opencode-agent-skills/)** — 先了解外掛能做什麼，建立整體認知
2. **[安裝指南](./installation/)** — 安裝外掛，讓 OpenCode 具備技能管理能力
3. **[建立你的第一個技能](./creating-your-first-skill/)** — 動手實作，建立屬於你的第一個技能

::: tip 預計時間
完成本章節大約需要 30-45 分鐘。
:::

## 下一步

完成本章節後，你可以繼續學習 **[平台功能](../platforms/)**，深入了解技能發現機制、技能載入、自動匹配等進階功能。

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
