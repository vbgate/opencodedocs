---
title: "自訂技能開發: 擴展 Claude 能力 | Agent Skills"
sidebarTitle: "技能開發"
subtitle: "自訂技能開發: 擴展 Claude 能力"
description: "學習為 Claude 開發自訂技能的完整流程。掌握 SKILL.md 格式規範、腳本編寫標準與部署方法，擴展 AI 助手能力，實現功能擴展。"
tags:
  - "技能開發"
  - "Claude"
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# 開發自訂技能

::: tip 簡化說明
完整內容請參考源文件。
:::

## 目錄結構

```
skills/my-custom-skill/
  SKILL.md
  scripts/deploy.sh
```

## SKILL.md 格式

包含 Front Matter、How It Works、Usage、Output 等章節。

## 腳本規範

- 使用 `#!/bin/bash` shebang
- `set -e` 錯誤處理
- 狀態輸出到 stderr
- JSON 輸出到 stdout

