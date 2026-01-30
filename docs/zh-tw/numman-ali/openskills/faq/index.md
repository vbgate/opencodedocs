---
title: "FAQ: 常見問題與故障排除 | OpenSkills"
sidebarTitle: "遇到問題怎麼辦"
subtitle: "FAQ: 常見問題與故障排除"
description: "學習 OpenSkills 的常見問題解答和故障排除方法。快速定位並解決安裝配置問題，了解 CLI 設計理念的技術決策。"
order: 4
---

# 常見問題

本章節收集了 OpenSkills 使用過程中的常見問題、故障排除方案和設計理念解釋，幫助你快速定位和解決問題。

## 本章內容

<div class="grid-cards">

### [常見問題解答](./faq/)

解答安裝、配置、使用等方面的常見疑問。包括 OpenSkills 與 Claude Code 的區別、技能安裝位置、AGENTS.md 同步問題、多專案共享技能等。

### [故障排除](./troubleshooting/)

提供常見錯誤的診斷和修復方法。涵蓋 Git clone 失敗、找不到 SKILL.md、技能未找到、權限錯誤、更新跳過等問題的詳細解決步驟。

### [為什麼是 CLI？](./why-cli-not-mcp/)

解釋 OpenSkills 選擇 CLI 而非 MCP 的設計理由。深入對比兩者的定位差異，理解技能系統為什麼更適合靜態檔案模式。

</div>

## 學習路徑

```
遇到問題？
│
├─ 不知道怎麼用 ──────────→ 常見問題解答
│ （概念、配置、使用技巧）
│
├─ 報錯了 ────────────────→ 故障排除
│ （錯誤診斷、修復步驟）
│
└─ 想了解設計理念 ────────→ 為什麼是 CLI？
  （技術選型、架構決策）
```

**推薦順序**：

1. **先看常見問題** → 快速了解核心概念和使用技巧
2. **遇到報錯看故障排除** → 按錯誤資訊查找解決方案
3. **想深入了解看設計理念** → 理解 CLI vs MCP 的技術考量

## 前置條件

::: tip 建議先完成
- [快速開始](../start/quick-start/) - 了解基本使用流程
- [安裝 OpenSkills](../start/installation/) - 確保環境配置正確
:::

## 下一步

完成本章節後，你可以：

- **探索進階功能** → [進階教程](../advanced/) 學習 Universal 模式、自定義技能等
- **查閱命令參考** → [CLI API 參考](../appendix/cli-api/) 獲取完整命令文件
- **了解版本更新** → [更新日誌](../changelog/changelog/) 查看新功能和變更

---

## 快速導航

| 問題類型 | 去哪裡找答案 |
| --- | --- |
| "OpenSkills 是什麼？" | [常見問題解答](./faq/) |
| "技能裝在哪？" | [常見問題解答](./faq/) |
| "Git clone 失敗" | [故障排除](./troubleshooting/) |
| "找不到 SKILL.md" | [故障排除](./troubleshooting/) |
| "為什麼不用 MCP？" | [為什麼是 CLI？](./why-cli-not-mcp/) |
