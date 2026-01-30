---
title: "高級: 技能生態管理 | opencode-agent-skills"
sidebarTitle: "搞定複雜技能生態"
subtitle: "高級功能"
order: 3
description: "掌握 opencode-agent-skills 的高級特性，包括 Claude Code 相容性、Superpowers 整合、命名空間和上下文壓縮機制，提升技能管理能力。"
---

# 高級功能

本章節深入講解 OpenCode Agent Skills 的高級特性，包括 Claude Code 相容性、Superpowers 工作流程整合、命名空間優先級系統和上下文壓縮恢復機制。掌握這些內容後，你能更好地管理複雜的技能生態，並確保長會話中技能始終可用。

## 前置條件

::: warning 開始前請確認
在學習本章節之前，請確保你已完成：

- [安裝 OpenCode Agent Skills](../start/installation/) - 插件已正確安裝並執行
- [建立你的第一個技能](../start/creating-your-first-skill/) - 了解技能的基本結構
- [技能探索機制詳解](../platforms/skill-discovery-mechanism/) - 理解技能從哪些位置被探索
- [載入技能到會話上下文](../platforms/loading-skills-into-context/) - 掌握 `use_skill` 工具的使用
:::

## 本章內容

<div class="grid-cards">

<a href="./claude-code-compatibility/" class="card">
  <h3>Claude Code 技能相容性</h3>
  <p>了解插件如何相容 Claude Code 的技能和插件系統，掌握工具對應機制，複用 Claude 技能生態。</p>
</a>

<a href="./superpowers-integration/" class="card">
  <h3>Superpowers 工作流程整合</h3>
  <p>設定和使用 Superpowers 模式，獲得嚴格的軟體開發工作流程指導，提升開發效率和程式碼品質。</p>
</a>

<a href="./namespaces-and-priority/" class="card">
  <h3>命名空間與技能優先級</h3>
  <p>理解技能的命名空間系統和探索優先級規則，解決同名技能衝突，精確控制技能來源。</p>
</a>

<a href="./context-compaction-resilience/" class="card">
  <h3>上下文壓縮恢復機制</h3>
  <p>了解技能如何在長會話中保持可用性，掌握壓縮恢復的觸發時機和執行流程。</p>
</a>

</div>

## 學習路徑

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           推薦學習順序                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Claude Code 相容  ──→  2. Superpowers 整合  ──→  3. 命名空間       │
│         │                        │                        │             │
│         ▼                        ▼                        ▼             │
│   複用 Claude 技能          啟用工作流程指導          精確控制技能來源     │
│                                                                         │
│                                  │                                      │
│                                  ▼                                      │
│                                                                         │
│                         4. 上下文壓縮恢復                                │
│                                  │                                      │
│                                  ▼                                      │
│                         長會話技能持久化                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**建議按順序學習**：

1. **先學 Claude Code 相容** - 如果你有 Claude Code 技能或想用 Claude 插件市集的技能，這是第一步
2. **再學 Superpowers 整合** - 想要嚴格工作流程指導的使用者，了解如何啟用和設定
3. **然後學命名空間** - 當技能數量增多、出現同名衝突時，這個知識點很關鍵
4. **最後學壓縮恢復** - 了解長會話中技能如何保持可用，偏原理性內容

::: tip 按需學習
- **從 Claude Code 遷移**：重點學習第 1 課（相容性）和第 3 課（命名空間）
- **想要工作流程規範**：重點學習第 2 課（Superpowers）
- **遇到技能衝突**：直接看第 3 課（命名空間）
- **長會話技能遺失**：直接看第 4 課（壓縮恢復）
:::

## 下一步

完成本章節後，你可以繼續學習：

- [常見問題排查](../faq/troubleshooting/) - 遇到問題時查閱故障排查指南
- [安全性說明](../faq/security-considerations/) - 了解插件的安全機制和最佳實踐
- [API 工具參考](../appendix/api-reference/) - 查看所有可用工具的詳細參數和返回值
- [技能開發最佳實踐](../appendix/best-practices/) - 掌握撰寫高品質技能的技巧和規範

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
