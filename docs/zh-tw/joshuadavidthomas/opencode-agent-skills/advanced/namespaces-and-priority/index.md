---
title: "命名空間: 技能優先級 | opencode-agent-skills"
sidebarTitle: "解決技能衝突"
subtitle: "命名空間: 技能優先級 | opencode-agent-skills"
description: "學習命名空間系統和技能發現優先級規則。掌握 5 種標籤、6 級優先級，用命名空間區分同名技能，解決衝突問題。"
tags:
  - "進階"
  - "命名空間"
  - "技能管理"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# 命名空間與技能優先級

## 學完你能做什麼

- 理解技能的命名空間系統，區分不同來源的同名技能
- 掌握技能發現的優先級規則，預判哪個技能會被載入
- 使用命名空間前綴精確指定技能來源
- 解決同名技能衝突問題

## 你現在的困境

隨著技能數量增長，你可能遇到這些困惑：

- **同名技能衝突**：專案目錄和使用者目錄都叫 `git-helper` 的技能，不知道載入了哪個
- **技能來源混亂**：不清楚哪些技能來自專案級，哪些來自使用者級或外掛快取
- **覆蓋行為不理解**：修改了使用者級技能卻發現不生效，被專案級技能覆蓋了
- **難以精確控制**：想強制使用某個特定來源的技能，但不知道如何指定

這些問題源於對技能命名空間和優先級規則的不理解。

## 核心思路

**命名空間**是 OpenCode Agent Skills 用來區分不同來源同名技能的機制。每個技能都有一個標籤（label）標識其來源，這些標籤構成了技能的命名空間。

::: info 為什麼需要命名空間？

想像你有兩個同名技能：
- 專案級 `.opencode/skills/git-helper/`（針對目前專案客製）
- 使用者級 `~/.config/opencode/skills/git-helper/`（通用版本）

沒有命名空間，系統就不知道该用哪個。有了命名空間，你可以明確指定：
- `project:git-helper` - 強制使用專案級版本
- `user:git-helper` - 強制使用使用者級版本
:::

**優先級規則**確保了在未指定命名空間時，系統能做出合理的選擇。專案級技能優先於使用者級技能，這樣你可以在專案中客製特定行為，而不會影響全域配置。

## 技能來源與標籤

OpenCode Agent Skills 支援多個技能來源，每個來源都有對應的標籤：

| 來源 | 標籤（label） | 路徑 | 說明 |
| --- | --- | --- | ---|
| **OpenCode 專案級** | `project` | `.opencode/skills/` | 目前專案專用的技能 |
| **Claude 專案級** | `claude-project` | `.claude/skills/` | Claude Code 相容的專案技能 |
| **OpenCode 使用者級** | `user` | `~/.config/opencode/skills/` | 所有專案共享的通用技能 |
| **Claude 使用者級** | `claude-user` | `~/.claude/skills/` | Claude Code 相容的使用者技能 |
| **Claude 外掛快取** | `claude-plugins` | `~/.claude/plugins/cache/` | 已安裝的 Claude 外掛 |
| **Claude 外掛市場** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | 從市場安裝的 Claude 外掛 |

::: tip 實際建議
- 專案特定配置：放在 `.opencode/skills/`
- 通用工具技能：放在 `~/.config/opencode/skills/`
- 從 Claude Code 遷移：無需移動，系統會自動發現
:::

## 技能發現優先級

當系統發現技能時，會按以下順序掃描各位置：

```
1. .opencode/skills/              (project)        ← 優先級最高
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← 優先級最低
```

**關鍵規則**：
- **首個匹配生效**：第一個找到的技能被保留
- **同名技能去重**：後續同名技能被忽略（但會發出警告）
- **專案級優先**：專案級技能覆蓋使用者級技能

### 優先級範例

假設你有以下技能分布：

```
專案目錄：
.opencode/skills/
  └── git-helper/              ← 版本 A（專案客製）

使用者目錄：
~/.config/opencode/skills/
  └── git-helper/              ← 版本 B（通用）

外掛快取：
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← 版本 C（Claude 外掛）
```

結果：系統載入的是 **版本 A**（`project:git-helper`），後續兩個同名技能被忽略。

## 使用命名空間指定技能

當你呼叫 `use_skill` 或其他工具時，可以使用命名空間前綴精確指定技能來源。

### 語法格式

```
namespace:skill-name
```

或

```
skill-name  # 不指定命名空間，使用預設優先級
```

### 命名空間列表

```
project:skill-name         # 專案級 OpenCode 技能
claude-project:skill-name  # 專案級 Claude 技能
user:skill-name            # 使用者級 OpenCode 技能
claude-user:skill-name     # 使用者級 Claude 技能
claude-plugins:skill-name  # Claude 外掛技能
```

### 使用範例

**場景 1：預設載入（按優先級）**

```
use_skill("git-helper")
```

- 系統按優先級查找，載入第一個匹配的技能
- 即 `project:git-helper`（如果存在）

**場景 2：強制使用使用者級技能**

```
use_skill("user:git-helper")
```

- 跳過優先級規則，直接載入使用者級技能
- 即使用使用者級被專案級覆蓋，仍可存取

**場景 3：載入 Claude 外掛技能**

```
use_skill("claude-plugins:git-helper")
```

- 明確載入來自 Claude 外掛的技能
- 適用於需要特定外掛功能的場景

## 命名空間匹配邏輯

當使用 `namespace:skill-name` 格式時，系統的匹配邏輯如下：

1. **解析輸入**：分離命名空間和技能名稱
2. **遍歷所有技能**：查找匹配的技能
3. **匹配條件**：
   - 技能名稱匹配
   - 技能的 `label` 欄位等於指定的命名空間
   - 或技能的 `namespace` 自訂欄位等於指定的命名空間
4. **返回結果**：第一個滿足條件的技能

::: details 匹配邏輯原始碼

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Superpowers 模式下的命名空間

當你啟用 Superpowers 模式時，系統會在會話初始化時注入命名空間優先級說明：

```markdown
**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
```

這確保了 AI 在選擇技能時遵循正確的優先級規則。

::: tip 如何啟用 Superpowers 模式

設定環境變數：

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## 常見使用場景

### 場景 1：專案客製覆蓋通用技能

**需求**：你的專案需要特殊的 Git 工作流程，但使用者級已有通用的 `git-helper` 技能。

**解決方案**：
1. 在專案目錄建立 `.opencode/skills/git-helper/`
2. 設定專案特定的 Git 工作流程
3. 預設呼叫 `use_skill("git-helper")` 會自動使用專案級版本

**驗證**：

```bash
## 檢視技能列表，注意標籤
get_available_skills("git-helper")
```

輸出範例：
```
git-helper (project)
  Project-specific Git workflow
```

### 場景 2：暫時切換到通用技能

**需求**：某個任務需要使用使用者級通用技能，而不是專案客製版本。

**解決方案**：

```
use_skill("user:git-helper")
```

明確指定 `user:` 命名空間，繞過專案級覆蓋。

### 場景 3：從 Claude 外掛載入技能

**需求**：你從 Claude Code 遷移過來，想繼續使用某個 Claude 外掛技能。

**解決方案**：

1. 確保 Claude 外掛快取路徑正確：`~/.claude/plugins/cache/`
2. 檢視技能列表：

```
get_available_skills()
```

3. 使用命名空間載入：

```
use_skill("claude-plugins:plugin-name")
```

## 踩坑提醒

### ❌ 錯誤 1：不知道同名技能被覆蓋

**症狀**：修改了使用者級技能，但 AI 還是用舊版本。

**原因**：專案級同名技能優先級更高，覆蓋了使用者級技能。

**解決**：
1. 檢查專案目錄是否有同名技能
2. 使用命名空間強制指定：`use_skill("user:skill-name")`
3. 或者刪除專案級同名技能

### ❌ 錯誤 2：命名空間拼寫錯誤

**症狀**：使用 `use_skill("project:git-helper")` 返回 404。

**原因**：命名空間拼寫錯誤（如寫成 `projcet`）或大小寫不對。

**解決**：
1. 先檢視技能列表：`get_available_skills()`
2. 注意括號中的標籤（如 `(project)`）
3. 使用正確的命名空間名稱

### ❌ 錯誤 3：混淆標籤和自訂命名空間

**症狀**：使用 `use_skill("project:custom-skill")` 找不到技能。

**原因**：`project` 是標籤（label），不是自訂命名空間。除非技能的 `namespace` 欄位明確設定為 `project`，否則不會匹配。

**解決**：
- 直接使用技能名稱：`use_skill("custom-skill")`
- 或檢視技能的 `label` 欄位，使用正確的命名空間

## 本課小結

OpenCode Agent Skills 的命名空間系統透過標籤和優先級規則，實現了對多來源技能的統一管理：

- **5 種來源標籤**：`project`、`claude-project`、`user`、`claude-user`、`claude-plugins`
- **6 級優先級**：專案級 > Claude 專案級 > 使用者級 > Claude 使用者級 > 外掛快取 > 外掛市場
- **首個匹配生效**：同名技能按優先級載入，後續被忽略
- **命名空間前綴**：使用 `namespace:skill-name` 格式精確指定技能來源

這套機制讓你既能享受自動發現的便利，又能在需要時精確控制技能來源。

## 下一課預告

> 下一課我們學習 **[上下文壓縮恢復機制](../context-compaction-resilience/)**。
>
> 你會學到：
> - 上下文壓縮對技能的影響
> - 外掛如何自動恢復技能列表
> - 長時間會話保持技能可用的技巧

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| SkillLabel 類型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| 發現優先級列表 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| 同名技能去重邏輯 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| resolveSkill 命名空間處理 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Superpowers 命名空間說明 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**關鍵類型**：
- `SkillLabel`：技能來源標籤列舉
- `Skill`：技能元資料介面（包含 `namespace` 和 `label` 欄位）

**關鍵函式**：
- `discoverAllSkills()`：按優先級發現技能，自動去重
- `resolveSkill()`：解析命名空間前綴，查詢技能
- `maybeInjectSuperpowersBootstrap()`：注入命名空間優先級說明

**發現路徑列表**（按優先級順序）：
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` 和 `~/.claude/plugins/marketplaces/`

</details>
