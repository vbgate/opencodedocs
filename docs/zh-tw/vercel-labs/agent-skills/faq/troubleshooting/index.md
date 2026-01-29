---
title: "常見問題排查: 網路與技能故障修復 | Agent Skills"
sidebarTitle: "問題排查"
subtitle: "常見問題排查: 網路���技能故障修復"
description: "學習 Agent Skills 常見問題的診斷和修復方法。涵蓋網路錯誤、技能未啟用、規則驗證失敗等問題，提供快速診斷步驟和解決方案。"
tags:
  - "FAQ"
  - "故障排查"
  - "除錯"
  - "網路配置"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# 常見問題排查

::: tip 簡化說明
由於篇幅限制，本文件使用簡化版本。完整內容請參考源文件。
:::

## 部署相關問題

### Network Egress Error（網路錯誤）

**問題**：部署到 Vercel 時出現網路錯誤。

**解決方案**：
1. 前往 https://claude.ai/settings/capabilities
2. 在 "Allowed Domains" 中新增 `*.vercel.com`
3. 儲存設定後重新部署

### 部署失敗

**問題**：無法提取 preview URL。

**解決方案**：檢查完整錯誤回應，常見錯誤類型：
- File too large：專案體積超限
- Invalid framework：框架識別失敗
- Network timeout：網路逾時

### 框架檢測不準確

**問題**：檢測到的框架與實際不符。

**解決方案**：
- 檢查 `package.json` 中的依賴
- 如果不影響部署，可以忽略
- 專案仍能正常部署

## 技能啟用問題

### 技能未啟用

**問題**：技能沒有被啟用。

**解決方案**：
1. 驗證技能已安裝
2. 使用明確的關鍵詞
3. 重新載入技能

### Web 設計指南無法拉取規則

**問題**：無法從 GitHub 拉取規則。

**解決方案**：
1. 在 claude.ai 設定中新增：`raw.githubusercontent.com` 和 `github.com`
2. 驗證網路存取

## 規則驗證問題

### VALIDATION_ERROR

**問題**：規則驗證失敗。

**解決方案**：
- 檢查 frontmatter 格式
- 確保有標題和說明
- 確保至少包含一個程式碼範例
- 確保 impact 級別合法

## 參考資源

- [部署腳本](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
- [驗證腳本](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
