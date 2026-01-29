---
title: "常見問題: 故障排除與安全隱私 | opencode-mystatus"
sidebarTitle: "常見問題"
subtitle: "常見問題: 故障排除與安全隱私"
description: "瞭解 opencode-mystatus 的常見問題解決方案。涵蓋故障排除、安全排除、安全隱私、權限設定等問題，快速定位並解決使用中的疑難雜症。"
order: 4
---

# 常見問題

本章節收集了使用 opencode-mystatus 時的常見問題和解決方案。

## 問題分類

### [故障排除](./troubleshooting/)

解決各種查詢失敗的問題：

- 無法讀取認證檔
- Token 過期或權限不足
- API 請求失敗或逾時
- 各平台特定的錯誤處理

### [安全與隱私](./security/)

瞭解外掛的安全機制：

- 本地檔案唯讀存取
- API Key 自動脫敏
- 僅呼叫官方介面
- 無資料上傳或儲存

## 快速定位

根據錯誤訊息快速找到解決方案：

| 錯誤關鍵詞 | 可能原因 | 解決方案 |
|-----------|---------|---------|
| `auth.json not found` | 認證檔不存在 | [故障排除](./troubleshooting/) |
| `Token expired` | Token 已過期 | [故障排除](./troubleshooting/) |
| `Permission denied` | 權限不足 | [Copilot 認證設定](../advanced/copilot-auth/) |
| `project_id missing` | Google Cloud 設定不完整 | [Google Cloud 設定](../advanced/google-setup/) |
| `Request timeout` | 網路問題 | [故障排除](./troubleshooting/) |

## 獲得幫助

如果本章節沒有解決你的問題：

- 提交 [Issue](https://github.com/vbgate/opencode-mystatus/issues) - 報告 Bug 或請求新功能
- 查看 [GitHub 儲存庫](https://github.com/vbgate/opencode-mystatus) - 獲得最新版本和原始碼
