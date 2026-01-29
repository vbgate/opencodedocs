---
title: "附錄: 技術參考與 API 文件 | opencode-mystatus"
sidebarTitle: "附錄"
subtitle: "附錄: 技術參考與 API 文件"
description: "瞭解 opencode-mystatus 的技術參考資料，包含資料模型和 API 介面總覽，適合開發者和高級使用者擴充支援新平台。"
order: 5
---

# 附錄

本章節提供 opencode-mystatus 的技術參考資料，適合開發者和高級使用者。

## 參考文件

### [資料模型](./data-models/)

瞭解外掛的資料結構：

- 認證檔案結構（`auth.json`、`antigravity-accounts.json`、`copilot-quota-token.json`）
- 各平台 API 回應格式
- 內部資料類型定義
- 如何擴充支援新平台

### [API 介面總覽](./api-endpoints/)

查看外掛呼叫的所有官方 API：

- OpenAI 額度查詢介面
- 智證 AI / Z.ai 額度查詢介面
- GitHub Copilot 額度查詢介面
- Google Cloud Antigravity 額度查詢介面
- 認證方式和請求格式

## 適用場景

| 場景 | 推薦文件 |
|------|---------|
| 想瞭解外掛如何工作 | [資料模型](./data-models/) |
| 想手動呼叫 API | [API 介面總覽](./api-endpoints/) |
| 想擴充支援新平台 | 兩個文件都需要 |
| 排查資料格式問題 | [資料模型](./data-models/) |

## 相關連結

- [GitHub 儲存庫](https://github.com/vbgate/opencode-mystatus) - 完整原始碼
- [NPM 套件](https://www.npmjs.com/package/opencode-mystatus) - 版本和相依性
- [更新日誌](../changelog/) - 版本歷史
