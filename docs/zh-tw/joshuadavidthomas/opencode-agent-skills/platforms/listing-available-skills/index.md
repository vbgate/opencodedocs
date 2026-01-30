---
title: "技能管理: 查詢可用技能 | opencode-agent-skills"
sidebarTitle: "快速找技能"
subtitle: "技能管理: 查詢可用技能"
description: "學習 get_available_skills 工具的使用方法。透過搜尋、命名空間和過濾快速定位技能，掌握技能發現和管理的核心功能。"
tags:
  - "技能管理"
  - "工具使用"
  - "命名空間"
prerequisite:
  - "start-installation"
order: 2
---

# 查詢和列出可用技能

## 學完你能做什麼

- 使用 `get_available_skills` 工具列出所有可用技能
- 透過搜尋查詢過濾特定技能
- 使用命名空間（如 `project:skill-name`）精確定位技能
- 識別技能來源和可執行腳本清單

## 你現在的困境

你想使用某個技能，但記不清它的確切名稱。也許你知道它是專案裡的某個技能，但不知道在哪個發現路徑下。或者你只是想快速瀏覽一下當前專案有哪些技能可用。

## 什麼時候用這一招

- **探索新專案**：加入一個新專案時，快速了解有哪些可用的技能
- **技能名稱不確定**：只記得技能的部分名稱或描述，需要模糊匹配
- **多命名空間衝突**：專案級和使用者級有同名技能，需要明確指定使用哪個
- **查找腳本**：想知道技能目錄下有哪些可執行的自動化腳本

## 核心思路

`get_available_skills` 工具幫你查看當前會話可用的所有技能。外掛會自動從 6 個發現路徑掃描技能：

::: info 技能發現優先順序
1. `.opencode/skills/` (專案級 OpenCode)
2. `.claude/skills/` (專案級 Claude)
3. `~/.config/opencode/skills/` (使用者級 OpenCode)
4. `~/.claude/skills/` (使用者級 Claude)
5. `~/.claude/plugins/cache/` (外掛快取)
6. `~/.claude/plugins/marketplaces/` (已安裝外掛)
:::

同名技能按優先順序只保留第一個，後續的被忽略。

工具返回的資訊包括：
- **技能名稱**
- **來源標籤**（project、user、claude-project 等）
- **描述**
- **可執行腳本清單**（如果有）

::: tip 命名空間語法
你可以用 `namespace:skill-name` 格式明確指定來源：
- `project:my-skill` - 使用專案級 OpenCode 技能（`.opencode/skills/`）
- `claude-project:my-skill` - 使用專案級 Claude 技能（`.claude/skills/`）
- `user:my-skill` - 使用使用者級 OpenCode 技能（`~/.config/opencode/skills/`）
- `claude-user:my-skill` - 使用使用者級 Claude 技能（`~/.claude/skills/`）
- `claude-plugins:my-skill` - 使用 Claude 外掛中的技能
:::

## 跟我做

### 第 1 步：列出所有可用技能

在 OpenCode 中直接讓 AI 列出技能：

```
使用者輸入：
列出所有可用的技能

系統回應：
skill-helper (project)
  Git 操作和分支管理助手 [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  單元測試和覆蓋率分析工具

docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  完整的軟體開發工作流程
```

**你應該看到**：一個技能清單，每個技能顯示名稱、來源標籤、描述和腳本清單。

### 第 2 步：使用搜尋查詢過濾

如果你只記得技能的部分名稱：

```
使用者輸入：
查找包含 "docker" 的技能

系統回應：
docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]
```

搜尋會匹配技能名稱和描述中的關鍵字，支援 `*` 萬用字元：

```
使用者輸入：
查找以 "test" 開頭的技能

系統回應：
test-helper (user)
  單元測試和覆蓋率分析工具
```

**你應該看到**：只顯示符合查詢條件的技能。

### 第 3 步：體驗模糊匹配建議

如果你輸入了錯誤的技能名稱：

```
使用者輸入：
我想用 docker-asistant

系統回應：
No skills found matching "docker-asistant". Did you mean "docker-helper"?
```

外掛會基於 Levenshtein 距離計算相似度，自動建議最接近的技能名稱。

**你應該看到**：錯誤提示和正確的技能建議。

### 第 4 步：使用命名空間精確定位

假設專案級和使用者級都有名為 `build-helper` 的技能：

```
使用者輸入：
列出 build-helper 的詳細資訊

系統回應：
build-helper (project)
  專案特定的建構配置和編譯優化 [scripts: build.sh, optimize.sh]
```

如果使用者想要使用者級的技能：

```
使用者輸入：
使用 user:build-helper

系統回應：
build-helper (user)
  通用建構工具鏈和持續整合配置 [scripts: ci.sh, test.sh]
```

**你應該看到**：透過命名空間前綴可以存取不同來源的同名技能。

### 第 5 步：檢查可執行腳本

查看技能目錄下有哪些腳本：

```
使用者輸入：
docker-helper 有哪些腳本？

系統回應：
docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]
```

腳本會顯示在技能資訊的方括號中，用逗號分隔。你可以用 `run_skill_script` 工具執行這些腳本。

**你應該看到**：技能名稱後面跟著 `[scripts: 腳本路徑1, 腳本路徑2, ...]` 格式的清單。

## 檢查點 ✅

- [ ] 你能列出所有可用的技能嗎？
- [ ] 你能用搜尋查詢過濾特定技能嗎？
- [ ] 你能理解技能來源標籤的含義嗎（project、user、claude-project 等）？
- [ ] 你能說出技能命名空間的作用和語法嗎？
- [ ] 你能從技能資訊中識別可執行腳本清單嗎？

## 踩坑提醒

### 陷阱 1：同名技能的覆蓋

如果專案級和使用者級有同名技能，你可能會困惑為什麼載入的不是你期望的技能。

**原因**：技能按優先順序發現，專案級優先於使用者級，同名只保留第一個。

**解決**：使用命名空間明確指定，如 `user:my-skill` 而不是 `my-skill`。

### 陷阱 2：搜尋大小寫敏感

搜尋查詢使用正則運算式，但設定了 `i` 標誌，所以是不區分大小寫的。

```bash
# 這些搜尋是等效的
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### 陷阱 3：萬用字元的轉義

搜尋中的 `*` 會自動轉換為 `.*` 正則運算式，不需要手動轉義：

```bash
# 搜尋以 "test" 開頭的技能
get_available_skills(query="test*")

# 等同於正則運算式 /test.*/i
```

## 本課小結

`get_available_skills` 是探索技能生態的工具，支援：

- **列出所有技能**：不加參數呼叫
- **搜尋過濾**：透過 `query` 參數符合名稱和描述
- **命名空間**：用 `namespace:skill-name` 精確定位
- **模糊匹配建議**：拼字錯誤時自動提示正確名稱
- **腳本清單**：顯示可執行的自動化腳本

外掛會在會話開始時自動注入技能清單，所以你通常不需要手動呼叫這個工具。但在以下場景下它很有用：
- 想快速瀏覽可用技能
- 記不清技能的確切名稱
- 需要區分同名技能的不同來源
- 想查看某個技能的腳本清單

## 下一課預告

> 下一課我們學習 **[載入技能到會話上下文](../loading-skills-into-context/)**。
>
> 你會學到：
> - 使用 use_skill 工具載入技能到當前會話
> - 理解技能內容如何以 XML 格式注入到上下文
> - 掌握 Synthetic Message Injection 机制（synthetic 訊息注入）
> - 了解技能在會話壓縮後如何保持可用

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                    | 行號    |
|--- | --- | ---|
| GetAvailableSkills 工具定義 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72)         | 29-72   |
| discoverAllSkills 函數 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| resolveSkill 函數 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| findClosestMatch 函數 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125)    | 88-125  |

**關鍵類型**：
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`：技能來源標籤列舉

**關鍵常量**：
- 模糊匹配閾值：`0.4`（`utils.ts:124`）- 相似度低於此值不返回建議

**關鍵函數**：
- `GetAvailableSkills()`：返回格式化的技能清單，支援查詢過濾和模糊匹配建議
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`：支援 `namespace:skill-name` 格式的技能解析
- `findClosestMatch(input: string, candidates: string[])`：基於多種匹配策略（前綴、包含、編輯距離）計算最佳匹配

**業務規則**：
- 同名技能按發現順序去重，僅保留第一個（`skills.ts:258`）
- 搜尋查詢支援萬用字元 `*`，自動轉換為正則運算式（`tools.ts:43`）
- 模糊匹配建議只在有查詢參數且無結果時觸發（`tools.ts:49-57`）

</details>
