---
title: "故障排除：問題診斷 | oh-my-opencode"
sidebarTitle: "遇到問題怎麼辦"
subtitle: "故障排除：問題診斷 | oh-my-opencode"
description: "學習 oh-my-opencode 的故障排除方法。透過 Doctor 指令進行 17+ 項設定診斷，快速定位和解決安裝、認證、相依性等問題。"
order: 150
---

# 常見問題與故障排除

本章節協助您解決使用 oh-my-opencode 過程中遇到的常見問題，從設定診斷到使用技巧，再到安全建議，讓您能夠快速定位問題並找到解決方案。

## 學習路徑

按照以下順序學習，循序漸進掌握問題排查與最佳實踐：

### 1. [設定診斷與故障排除](./troubleshooting/)

學習使用 Doctor 指令快速診斷和解決設定問題。
- 執行 Doctor 指令進行完整健康檢查
- 解讀 17+ 項檢查結果（安裝、設定、認證、相依性、工具、更新）
- 定位和修復常見設定問題
- 使用詳細模式和 JSON 輸出進行進階診斷

### 2. [常見問題解答](./faq/)

查找和解決使用過程中的常見問題。
- 安裝與設定問題的快速解答
- 使用技巧和最佳實踐（ultrawork、代理呼叫、背景任務）
- Claude Code 相容性說明
- 安全警示和效能優化建議
- 貢獻和說明資源

## 前置條件

開始學習本章節前，請確保：
- 已完成 [快速安裝與設定](../start/installation/)
- 熟悉 oh-my-opencode 的基礎設定檔結構
- 遇到了具體的問題或想了解最佳實踐

::: tip 推薦閱讀時機
建議在完成基礎安裝後，先通讀一遍常見問題解答（FAQ），了解常見陷阱和最佳實踐，遇到具體問題時再使用故障排除工具進行診斷。
:::

## 快速排查指南

如果您遇到了緊急問題，可以按以下步驟快速排查：

```bash
# 第 1 步：執行完整診斷
bunx oh-my-opencode doctor

# 第 2 步：查看詳細錯誤資訊
bunx oh-my-opencode doctor --verbose

# 第 3 步：檢查特定類別（如認證）
bunx oh-my-opencode doctor --category authentication

# 第 4 步：如果還是無法解決，查看常見問題解答
# 或到 GitHub Issues 尋求協助
```

## 下一步

完成本章節後，您可以繼續學習：
- **[Claude Code 相容性](../appendix/claude-code-compatibility/)** - 了解與 Claude Code 的完整相容性支援
- **[設定參考](../appendix/configuration-reference/)** - 查看完整的設定檔 Schema 和欄位說明
- **[內建 MCP 伺服器](../appendix/builtin-mcps/)** - 學習如何使用內建的 MCP 伺服器
