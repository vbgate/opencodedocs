---
title: "更新日誌：版本歷史和功能變更 | Agent App Factory"
sidebarTitle: "更新日誌"
subtitle: "更新日誌：版本歷史和功能變更 | Agent App Factory"
description: "了解 Agent App Factory 的版本更新歷史、功能變更、bug 修復和重大改進。本頁面詳細記錄從 1.0.0 版本開始的完整變更歷史，包括 7 階段流水線系統、Sisyphus 調度器、權限管理、上下文優化和失敗處理策略等核心功能和改進。"
tags:
  - "更新日誌"
  - "版本歷史"
prerequisite: []
order: 250
---

# 更新日誌

本頁面記錄 Agent App Factory 的版本更新歷史，包括新增功能、改進、bug 修復和破壞性變更。

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/) 規範，版本號遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2024-01-29

### 新增

**核心功能**
- **7 階段流水線系統**：從想法到可執行應用的完整自動化流程
  - Bootstrap - 結構化產品想法（input/idea.md）
  - PRD - 生成產品需求文檔（artifacts/prd/prd.md）
  - UI - 設計 UI 結構和可預覽原型（artifacts/ui/）
  - Tech - 設計技術架構和 Prisma 資料模型（artifacts/tech/）
  - Code - 生成前後端代碼（artifacts/backend/, artifacts/client/）
  - Validation - 驗證代碼品質（artifacts/validation/report.md）
  - Preview - 生成部署指南（artifacts/preview/README.md）

- **Sisyphus 調度器**：流水線核心控制組件
  - 按順序執行 pipeline.yaml 定義的各個 Stage
  - 驗證每個階段的輸入/輸出和退出條件
  - 維護流水線狀態（.factory/state.json）
  - 執行權限檢查，防止 Agent 越權讀寫
  - 根據失敗策略處理異常情況
  - 在每個檢查點暫停，等待人工確認後繼續

**CLI 工具**
- `factory init` - 初始化 Factory 專案
- `factory run [stage]` - 執行流水線（從當前或指定階段）
- `factory continue` - 在新會話中繼續執行（節省 Token）
- `factory status` - 查看當前專案狀態
- `factory list` - 列出所有 Factory 專案
- `factory reset` - 重置當前專案狀態

**權限與安全**
- **能力邊界矩陣**（capability.matrix.md）：定義每個 Agent 嚴格的讀寫權限
  - 每個 Agent 只能存取已授權目錄
  - 越權寫入檔案移至 artifacts/_untrusted/
  - 失敗後自動暫停流水線，等待人工介入

**上下文優化**
- **分會話執行**：每個階段在新會話中執行
  - 避免上下文累積，節省 Token
  - 支援中斷恢復
  - 適用於所有 AI 助手（Claude Code、OpenCode、Cursor）

**失敗處理策略**
- 自動重試機制：每個階段允許重試一次
- 失敗歸檔：失敗的產物移至 artifacts/_failed/
- 回滾機制：回滾到最近成功檢查點
- 人工介入：連續失敗兩次後暫停

**品質保證**
- **代碼規範**（code-standards.md）
  - TypeScript 編碼規範和最佳實踐
  - 檔案結構和命名約定
  - 註解和文檔要求
  - Git 提交訊息規範（Conventional Commits）

- **錯誤碼規範**（error-codes.md）
  - 統一錯誤碼結構：[MODULE]_[ERROR_TYPE]_[SPECIFIC]
  - 標準錯誤類型：VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR
  - 前後端錯誤碼映射和用戶友善提示

**Changelog 管理**
- 遵循 Keep a Changelog 格式
- 與 Conventional Commits 整合
- 自動化工具支援：conventional-changelog-cli, release-it

**配置模板**
- CI/CD 配置（GitHub Actions）
- Git Hooks 配置（Husky）

**生成的應用特性**
- 完整的前後端代碼（Express + Prisma + React Native）
- 單元測試和整合測試（Vitest + Jest）
- API 文檔（Swagger/OpenAPI）
- 資料庫種子資料
- Docker 部署配置
- 錯誤處理和日誌監控
- 效能優化和安全檢查

### 改進

**MVP 聚焦**
- 明確列出非目標（Non-Goals），防止範圍蔓延
- 頁面數量限制在 3 頁以內
- 專注核心功能，避免過度設計

**職責分離**
- 每個 Agent 只負責自己的領域，不越界
- PRD 不包含技術細節，Tech 不涉及 UI 設計
- Code Agent 嚴格按照 UI Schema 和 Tech 設計實作

**可驗證性**
- 每個階段定義明確的 exit_criteria
- 所有功能可測試、可本地執行
- 產物必須結構化、可被下游消費

### 技術堆疊

**CLI 工具**
- Node.js >= 16.0.0
- Commander.js - 命令列框架
- Chalk - 彩色終端輸出
- Ora - 進度指示器
- Inquirer - 互動式命令列
- fs-extra - 檔案系統操作
- YAML - YAML 解析

**生成的應用**
- 後端：Node.js + Express + Prisma + TypeScript + Vitest
- 前端：React Native + Expo + TypeScript + Jest + React Testing Library
- 部署：Docker + GitHub Actions

### 依賴

- `chalk@^4.1.2` - 終端顏色樣式
- `commander@^11.0.0` - 命令列參數解析
- `fs-extra@^11.1.1` - 檔案系統擴展
- `inquirer@^8.2.5` - 互動式命令列
- `ora@^5.4.1` - 優雅的終端載入器
- `yaml@^2.3.4` - YAML 解析和序列化

## 版本說明

### Semantic Versioning

本專案遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 版本號格式：MAJOR.MINOR.PATCH

- **MAJOR**：不相容的 API 變更
- **MINOR**：向後相容的新增功能
- **PATCH**：向後相容的 bug 修復

### 變更類型

- **新增**（Added）：新功能
- **變更**（Changed）：現有功能的變更
- **棄用**（Deprecated）：即將移除的功能
- **移除**（Removed）：已移除的功能
- **修復**（Fixed）：bug 修復
- **安全**（Security）：安全修復

## 相關資源

- [GitHub Releases](https://github.com/hyz1992/agent-app-factory/releases) - 官方發布頁面
- [專案倉庫](https://github.com/hyz1992/agent-app-factory) - 源代碼
- [問題追蹤](https://github.com/hyz1992/agent-app-factory/issues) - 反饋問題和建議
- [貢獻指南](https://github.com/hyz1992/agent-app-factory/blob/main/CONTRIBUTING.md) - 如何貢獻

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2024-01-29

| 功能        | 檔案路徑                                                                                                                               | 行號    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| package.json | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                                                  | 1-52    |
| CLI 入口     | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)                                        | 1-123   |
| 初始化命令   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)                                  | 1-427   |
| 執行命令     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)                                     | 1-294   |
| 繼續命令     | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js)                            | 1-87    |
| 流水線定義   | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)                                               | 1-87    |
| 調度器定義   | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md)          | 1-301   |
| 權限矩陣     | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md)                  | 1-44    |
| 失敗策略     | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md)                        | 1-200   |
| 代碼規範     | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md)                        | 1-287   |
| 錯誤碼規範   | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md)                              | 1-134   |
| Changelog 規範 | [`policies/changelog.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/changelog.md)                                  | 1-87    |

**關鍵版本資訊**：
- `version = "1.0.0"`：初始發布版本
- `engines.node = ">=16.0.0"`：最低 Node.js 版本要求

**依賴版本**：
- `chalk@^4.1.2`：終端顏色樣式
- `commander@^11.0.0`：命令列參數解析
- `fs-extra@^11.1.1`：檔案系統擴展
- `inquirer@^8.2.5`：互動式命令列
- `ora@^5.4.1`：優雅的終端載入器
- `yaml@^2.3.4`：YAML 解析和序列化

</details>
