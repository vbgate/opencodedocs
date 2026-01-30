---
title: "opencode-notify 更新日誌：版本歷史與功能變更記錄"
sidebarTitle: "了解新功能"
subtitle: "更新日誌"
description: "查看 opencode-notify 外掛的版本歷史和重要變更記錄。了解每個版本的功能更新、問題修復和設定改進。"
tags:
  - "更新日誌"
  - "版本歷史"
order: 150
---

# 更新日誌

## 版本說明

本外掛透過 OCX 發布，沒有傳統版本號。以下按時間倒序記錄重要變更。

---

## 2026-01-23

**變更類型**: 同步更新

- 保持與 kdcokenny/ocx 主倉庫同步

---

## 2026-01-22

**變更類型**: 同步更新

- 保持與 kdcokenny/ocx 主倉庫同步

---

## 2026-01-13

**變更類型**: 同步更新

- 保持與 kdcokenny/ocx 主倉庫同步

---

## 2026-01-12

**變更類型**: 同步更新

- 保持與 kdcokenny/ocx 主倉庫同步

---

## 2026-01-08

**變更類型**: 同步更新

- 保持與 kdcokenny/ocx 主倉庫同步

---

## 2026-01-07

**變更類型**: 同步更新

- 更新自 ocx@30a9af5
- 跳過 CI 建置

---

## 2026-01-01

### 修復：Cargo 風格命名空間語法

**變更內容**：
- 更新命名空間語法：`ocx add kdco-notify` → `ocx add kdco/notify`
- 更新命名空間語法：`ocx add kdco-workspace` → `ocx add kdco/workspace`
- 重新命名原始檔：`kdco-notify.ts` → `notify.ts`

**影響**：
- 安裝指令從 `ocx add kdco-notify` 改為 `ocx add kdco/notify`
- 原始碼檔案結構更清晰，符合 Cargo 命名風格

---

### 最佳化：README 文件

**變更內容**：
- 最佳化 README 文件，增加價值主張說明
- 新增 FAQ 章節，回答常見問題
- 改進「智慧通知」相關說明文案
- 簡化安裝步驟說明

**新增內容**：
- 價值主張表格（事件、是否通知、音效、原因）
- 常見問題：是否增加上下文、是否會收到垃圾通知、如何暫時停用

---

## 2025-12-31

### 文件：簡化 README

**變更內容**：
- 移除無效的圖示和深色模式參照
- 簡化 README 文件，聚焦核心功能說明

### 移除：圖示支援

**變更內容**：
- 移除 OpenCode 圖示支援（跨平台深色模式偵測）
- 簡化通知流程，移除不穩定的圖示功能
- 清理 `src/plugin/assets/` 目錄

**移除檔案**：
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**影響**：
- 通知不再顯示自訂圖示
- 通知流程更穩定，減少平台相容性問題

### 新增：OpenCode 圖示（已移除）

**變更內容**：
- 新增 OpenCode 圖示支援
- 實作跨平台深色模式偵測

::: info
此功能在後續版本中已移除，見 2025-12-31「移除：圖示支援」。
:::

### 新增：終端機偵測與焦點感知

**變更內容**：
- 新增終端機自動偵測功能（支援 37+ 終端機）
- 新增焦點偵測功能（僅 macOS）
- 新增點擊聚焦功能（僅 macOS）

**新增功能**：
- 自動識別終端機模擬器
- 終端機聚焦時抑制通知
- 點擊通知聚焦終端機視窗（macOS）

**技術細節**：
- 使用 `detect-terminal` 函式庫偵測終端機類型
- 透過 macOS osascript 取得前景應用程式
- 使用 node-notifier 的 activate 選項實作點擊聚焦

### 新增：初始版本

**變更內容**：
- 初始提交：kdco-notify 外掛
- 基礎原生通知功能
- 基礎設定系統

**核心功能**：
- session.idle 事件通知（任務完成）
- session.error 事件通知（錯誤）
- permission.updated 事件通知（權限請求）
- node-notifier 整合（跨平台原生通知）

**初始檔案**：
- `LICENSE` - MIT 授權條款
- `README.md` - 專案文件
- `registry.json` - OCX 註冊設定
- `src/plugin/kdco-notify.ts` - 主外掛程式碼

---

## 相關資源

- **GitHub 倉庫**: https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **提交歷史**: https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **OCX 文件**: https://github.com/kdcokenny/ocx

---

## 版本策略

本外掛作為 OCX 生態系統的一部分，採用以下版本策略：

- **無版本號**: 透過 Git 提交歷史追蹤變更
- **持續交付**: 隨 OCX 主倉庫同步更新
- **向後相容**: 保持設定格式和 API 的向後相容性

如有破壞性變更，將在更新日誌中明確標註。

---

**最後更新**: 2026-01-27
