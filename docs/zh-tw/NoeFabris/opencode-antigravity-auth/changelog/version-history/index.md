---
title: "版本歷史: Antigravity Auth 更新日誌 | opencode-antigravity-auth"
sidebarTitle: "新功能一覽"
subtitle: "版本歷史: Antigravity Auth 更新日誌"
description: "了解 Antigravity Auth 插件的版本歷史和重要變更記錄。查看每個版本的新功能、bug 修復、性能改進，獲取升級指南和相容性說明。"
tags:
  - "版本歷史"
  - "更新日誌"
  - "變更記錄"
order: 1
---

# 版本歷史

本文檔記錄了 Antigravity Auth 插件的版本歷史和重要變更。

::: tip 最新版本
當前最新穩定版本：**v1.3.0**（2026-01-17）
:::

## 版本說明

### 穩定版 (Stable)
- 經過充分測試，推薦生產環境使用
- 版本號格式：`vX.Y.Z`（如 v1.3.0）

### 測試版 (Beta)
- 包含最新功能，可能有不穩定因素
- 版本號格式：`vX.Y.Z-beta.N`（如 v1.3.1-beta.3）
- 適合早期體驗和回饋

---

## v1.3.x 系列

### v1.3.1-beta.3
**發布時間**：2026-01-22

**變更**：
- 優化 `MODEL_CAPACITY_EXHAUSTED` 錯誤的退避演算法，增加隨機抖動範圍

### v1.3.1-beta.2
**發布時間**：2026-01-22

**變更**：
- 移除未使用的 `googleSearch` 配置項
- 添加 ToS（服務條款）警告和使用建議到 README

### v1.3.1-beta.1
**發布時間**：2026-01-22

**變更**：
- 改進帳號切換通知的防抖邏輯，減少重複提示

### v1.3.1-beta.0
**發布時間**：2026-01-20

**變更**：
- 移除子倉庫追蹤，恢復 tsconfig.json

### v1.3.0
**發布時間**：2026-01-17

**重要變更**：

**新增功能**：
- 使用 Zod v4 的原生 `toJSONSchema` 方法進行 schema 生成

**修復**：
- 修正 token 消耗測試，使用 `toBeCloseTo` 處理浮點數精度問題
- 改進測試覆蓋率計算

**文檔改進**：
- 增強負載均衡相關文檔
- 添加格式化改進

---

## v1.2.x 系列

### v1.2.9-beta.10
**發布時間**：2026-01-17

**變更**：
- 修正 token 餘額斷言，使用浮點數精度匹配

### v1.2.9-beta.9
**發布時間**：2026-01-16

**變更**：
- 更新 token 消耗測試，使用 `toBeCloseTo` 處理浮點數精度
- 增強 Gemini 工具包裝功能，添加包裝函數數量統計

### v1.2.9-beta.8
**發布時間**：2026-01-16

**變更**：
- 添加新的 issue 模板（bug 報告和功能請求）
- 改進項目 onboarding 邏輯

### v1.2.9-beta.7
**發布時間**：2026-01-16

**變更**：
- 更新 issue 模板，要求提供描述性標題

### v1.2.9-beta.6
**發布時間**：2026-01-16

**變更**：
- 添加可配置的速率限制重試延遲
- 改進 hostname 檢測，支持 OrbStack Docker 環境
- 智能 OAuth 回調伺服器地址綁定
- 澄清 `thinkingLevel` 和 `thinkingBudget` 的優先級

### v1.2.9-beta.5
**發布時間**：2026-01-16

**變更**：
- 改進 Gemini 工具包裝，支持 `functionDeclarations` 格式
- 確保 `normalizeGeminiTools` 中正確創建自定義函數包裝器

### v1.2.9-beta.4
**發布時間**：2026-01-16

**變更**：
- 包裝 Gemini 工具為 `functionDeclarations` 格式
- 在 `wrapToolsAsFunctionDeclarations` 中應用 `toGeminiSchema`

### v1.2.9-beta.3
**發布時間**：2026-01-14

**變更**：
- 更新文檔和代碼註釋，說明 hybrid 策略實現
- 簡化 antigravity 系統指令以用於測試

### v1.2.9-beta.2
**發布時間**：2026-01-12

**變更**：
- 修正 Gemini 3 模型解析邏輯，去重思考塊處理
- 為顯示的思考哈希添加 Gemini 3 模型檢查

### v1.2.9-beta.1
**發布時間**：2026-01-08

**變更**：
- 更新插件安裝說明中的 beta 版本
- 改進帳號管理，確保當前認證被添加到存儲帳號

### v1.2.9-beta.0
**發布時間**：2026-01-08

**變更**：
- 更新 README，修正 Antigravity 插件 URL
- 更新 schema URL 到 NoeFabris 倉庫

### v1.2.8
**發布時間**：2026-01-08

**重要變更**：

**新增功能**：
- Gemini 3 模型支持
- 思考塊去重處理

**修復**：
- 修正 Gemini 3 模型解析邏輯
- 響應轉換中的顯示思考哈希處理

**文檔改進**：
- 更新測試腳本輸出重定向
- 更新模型測試選項

### v1.2.7
**發布時間**：2026-01-01

**重要變更**：

**新增功能**：
- 改進帳號管理，確保當前認證被正確存儲
- 通過 GitHub Actions 自動發布 npm 版本

**修復**：
- 修正 E2E 測試腳本中的輸出重定向

**文檔改進**：
- 更新倉庫 URL 到 NoeFabris

---

## v1.2.6 - v1.2.0 系列

### v1.2.6
**發布時間**：2025-12-26

**變更**：
- 添加工作流自動重新發布 npm 版本

### v1.2.5
**發布時間**：2025-12-26

**變更**：
- 文檔更新，版本號修正為 1.2.6

### v1.2.4 - v1.2.0
**發布時間**：2025 年 12 月

**變更**：
- 多帳號負載均衡功能
- 雙配額系統（Antigravity + Gemini CLI）
- 會話恢復機制
- OAuth 2.0 PKCE 認證
- Thinking 模型支持（Claude 和 Gemini 3）
- Google Search grounding

---

## v1.1.x 系列

### v1.1.0 及後續版本
**發布時間**：2025 年 11 月

**變更**：
- 優化認證流程
- 改進錯誤處理
- 添加更多配置選項

---

## v1.0.x 系列（早期版本）

### v1.0.4 - v1.0.0
**發布時間**：2025 年 10 月及更早

**初始功能**：
- 基礎 Google OAuth 認證
- Antigravity API 訪問
- 簡單的模型支持

---

## 版本升級指南

### 從 v1.2.x 升級到 v1.3.x

**相容性**：完全相容，無需修改配置

**建議操作**：
```bash
# 更新插件
opencode plugin update opencode-antigravity-auth

# 驗證安裝
opencode auth status
```

### 從 v1.1.x 升級到 v1.2.x

**相容性**：需要更新帳號存儲格式

**建議操作**：
```bash
# 備份現有帳號
cp ~/.config/opencode/antigravity-accounts.json ~/.config/opencode/antigravity-accounts.json.bak

# 更新插件
opencode plugin update opencode-antigravity-auth@latest

# 重新登錄（如有問題）
opencode auth login
```

### 從 v1.0.x 升級到 v1.2.x

**相容性**：帳號存儲格式不相容，需要重新認證

**建議操作**：
```bash
# 更新插件
opencode plugin update opencode-antigravity-auth@latest

# 重新登錄
opencode auth login

# 按新版本要求添加模型配置
```

---

## Beta 版本說明

**Beta 版本的使用建議**：

| 使用場景 | 推薦版本 | 說明 |
|---|---|---|
| 生產環境 | 穩定版 (vX.Y.Z) | 經過充分測試，穩定性高 |
| 日常開發 | 最新穩定版 | 功能完整，bug 較少 |
| 早期體驗 | 最新 Beta | 可體驗最新功能，但可能不穩定 |

**安裝 Beta 版本**：

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**升級到穩定版**：

```bash
opencode plugin update opencode-antigravity-auth@latest
```

---

## 版本號說明

版本號遵循 [語義化版本 2.0.0](https://semver.org/lang/zh-CN/) 規範：

- **主版本號 (X)**：不相容的 API 修改
- **次版本號 (Y)**：向下相容的功能性新增
- **修訂號 (Z)**：向下相容的問題修正

**示例**：
- `1.3.0` → 主版本 1，次版本 3，修訂號 0
- `1.3.1-beta.3` → 1.3.1 的第 3 個 Beta 版本

---

## 獲取更新通知

**自動更新**（預設啟用）：

```json
{
  "auto_update": true
}
```

**手動檢查更新**：

```bash
# 查看當前版本
opencode plugin list

# 更新插件
opencode plugin update opencode-antigravity-auth
```

---

## 下載地址

- **NPM 穩定版**：https://www.npmjs.com/package/opencode-antigravity-auth
- **GitHub Releases**：https://github.com/NoeFabris/opencode-antigravity-auth/releases

---

## 貢獻回饋

如果遇到問題或有功能建議，請：

1. 查看 [故障排除指南](../../faq/common-auth-issues/)
2. 在 [GitHub Issues](https://github.com/NoeFabris/opencode-antigravity-auth/issues) 提交問題
3. 使用正確的 issue 模板（Bug Report / Feature Request）
