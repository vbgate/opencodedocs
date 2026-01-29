---
title: "常見問題: 解決使用疑難 | opencode-plannotator"
sidebarTitle: "遇到問題怎麼辦"
subtitle: "常見問題: 解決使用疑難"
description: "學習 Plannotator 常見問題的解決方法。掌握連接埠佔用、瀏覽器未開啟、整合失敗等問題的快速排除技巧。"
order: 4
---

# 常見問題

本章節幫助你解決使用 Plannotator 過程中遇到的各種問題。無論是連接埠佔用、瀏覽器未開啟，還是整合失敗，這裡都有對應的解決方案和除錯技巧。

## 本章內容

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 常見問題</h3>
  <p>解決使用過程中遇到的常見問題，包括連接埠佔用、瀏覽器未開啟、計畫未顯示、Git 錯誤、圖片上傳失敗、Obsidian/Bear 整合問題等。</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 故障排除</h3>
  <p>掌握故障排除的基本方法，包括日誌查看、錯誤處理和除錯技巧。學會透過日誌輸出快速定位問題來源。</p>
</a>

</div>

## 學習路徑

```
常見問題 → 故障排除
   ↓           ↓
 快速解決    深入除錯
```

**建議順序**：

1. **先看常見問題**：大多數問題都能在這裡找到現成的解決方案
2. **再學故障排除**：如果常見問題沒有涵蓋，學習如何透過日誌和除錯技巧自行排查

::: tip 遇到問題時的建議
先在「常見問題」中搜尋關鍵字（如「連接埠」、「瀏覽器」、「Obsidian」），找到對應的解決方案。如果問題比較複雜或不在清單中，再參考「故障排除」學習除錯方法。
:::

## 前置條件

在學習本章節之前，建議你已經完成：

- ✅ [快速開始](../start/getting-started/) - 瞭解 Plannotator 的基本概念
- ✅ 安裝了 Claude Code 或 OpenCode 外掛（二選一）：
  - [安裝 Claude Code 外掛](../start/installation-claude-code/)
  - [安裝 OpenCode 外掛](../start/installation-opencode/)

## 下一步

完成本章節後，你可以繼續學習：

- [API 參考](../appendix/api-reference/) - 瞭解所有 API 端點和請求/回應格式
- [資料模型](../appendix/data-models/) - 瞭解 Plannotator 使用的資料結構
- [環境變數設定](../advanced/environment-variables/) - 深入瞭解所有可用的環境變數

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
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
