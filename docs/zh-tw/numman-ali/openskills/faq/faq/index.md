---
title: "常見問題: 故障排除指南 | opencode"
subtitle: "常見問題: 故障排除指南"
sidebarTitle: "遇到問題怎麼辦"
description: "學習 OpenSkills 常見問題的解決方案。快速排查安裝失敗、技能未載入、AGENTS.md 同步等故障，提升技能管理效率。"
tags:
  - "FAQ"
  - "故障排除"
  - "常見問題"
prerequisite:
  - "start-quick-start"
order: 1
---

# 常見問題解答

## 學完你能做什麼

本課解答 OpenSkills 使用中的常見問題，幫你：

- ✅ 快速定位和解決安裝失敗問題
- ✅ 理解 OpenSkills 與 Claude Code 的關係
- ✅ 解決技能未出現在 AGENTS.md 的問題
- ✅ 處理技能更新和刪除相關的疑問
- ✅ 在多代理環境中正確設定技能

## 你現在的困境

使用 OpenSkills 時，你可能會遇到：

- "安裝總是失敗，不知道哪裡出錯了"
- "AGENTS.md 裡看不到剛安裝的技能"
- "不知道技能到底裝在哪裡"
- "想用 OpenSkills，但怕和 Claude Code 衝突"

本課幫你快速找到問題的根源和解決方案。

---

## 核心概念類問題

### OpenSkills 和 Claude Code 有什麼區別？

**簡短回答**：OpenSkills 是"通用安裝程式"，Claude Code 是"官方代理"。

**詳細說明**：

| 對比項 | OpenSkills | Claude Code |
|--- | --- | ---|
| **定位** | 通用技能載入器 | Anthropic 官方 AI 編碼代理 |
| **支援範圍** | 所有 AI 代理（Cursor、Windsurf、Aider 等） | 僅 Claude Code |
| **技能格式** | 與 Claude Code 完全一致（`SKILL.md`） | 官方規範 |
| **安裝方式** | 從 GitHub、本機路徑、私有倉庫安裝 | 從內建 Marketplace 安裝 |
| **技能儲存** | `.claude/skills/` 或 `.agent/skills/` | `.claude/skills/` |
| **呼叫方式** | `npx openskills read <name>` | 內建 `Skill()` 工具 |

**核心價值**：OpenSkills 讓其他代理也能使用 Anthropic 的技能系統，無需等待每個代理單獨實作。

### 為什麼是 CLI 而不是 MCP？

**核心原因**：技能是靜態檔案，MCP 是動態工具，兩者解決不同問題。

| 對比維度 | MCP（Model Context Protocol） | OpenSkills（CLI） |
|--- | --- | ---|
| **適用場景** | 動態工具、即時 API 呼叫 | 靜態指令、文件、腳本 |
| **執行要求** | 需要 MCP 伺服器 | 無需伺服器（純檔案） |
| **代理支援** | 僅支援 MCP 的代理 | 所有能讀 `AGENTS.md` 的代理 |
| **複雜度** | 需要伺服器部署 | 零設定 |

**關鍵點**：

- **技能就是檔案**：SKILL.md 是靜態指令 + 資源（references/、scripts/、assets/），不需要伺服器
- **無需代理支援**：任何能執行 shell 指令的代理都能用
- **符合官方設計**：Anthropic 的技能系統本身就是檔案系統設計，不是 MCP 設計

**總結**：MCP 和技能系統解決不同問題。OpenSkills 保持技能的輕量級和通用性，不需要讓每個代理都支援 MCP。

---

## 安裝與設定類問題

### 安裝失敗怎麼辦？

**常見錯誤和解決方案**：

#### 錯誤 1：複製失敗

```bash
Error: Git clone failed
```

**可能原因**：
- 網路問題（無法存取 GitHub）
- Git 未安裝或版本過舊
- 私有倉庫未設定 SSH 金鑰

**解決方案**：

1. 檢查 Git 是否安裝：
   ```bash
   git --version
   # 應該顯示：git version 2.x.x
   ```

2. 檢查網路連線：
   ```bash
   # 測試是否能存取 GitHub
   ping github.com
   ```

3. 私有倉庫需設定 SSH：
   ```bash
   # 測試 SSH 連線
   ssh -T git@github.com
   ```

#### 錯誤 2：路徑不存在

```bash
Error: Path does not exist: ./nonexistent-path
```

**解決方案**：
- 確認本機路徑正確
- 使用絕對路徑或相對路徑：
  ```bash
  # 絕對路徑
  npx openskills install /Users/dev/my-skills

  # 相對路徑
  npx openskills install ./my-skills
  ```

#### 錯誤 3：找不到 SKILL.md

```bash
Error: No valid SKILL.md found
```

**解決方案**：

1. 檢查技能目錄結構：
   ```bash
   ls -la ./my-skill
   # 必須包含 SKILL.md
   ```

2. 確認 SKILL.md 有有效的 YAML frontmatter：
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### 技能安裝在哪個目錄？

**預設安裝位置**（專案本機）：
```bash
.claude/skills/
```

**全域安裝位置**（使用 `--global`）：
```bash
~/.claude/skills/
```

**Universal 模式**（使用 `--universal`）：
```bash
.agent/skills/
```

**技能查找優先順序**（從高到低）：
1. `./.agent/skills/` （專案本機，Universal）
2. `~/.agent/skills/` （全域，Universal）
3. `./.claude/skills/` （專案本機，預設）
4. `~/.claude/skills/` （全域，預設）

**查看已安裝技能位置**：
```bash
npx openskills list
# 輸出顯示 [project] 或 [global] 標籤
```

### 如何與 Claude Code Marketplace 共存？

**問題**：既想用 Claude Code，又想用 OpenSkills，如何避免衝突？

**解決方案**：使用 Universal 模式

```bash
# 安裝到 .agent/skills/ 而不是 .claude/skills/
npx openskills install anthropics/skills --universal
```

**為什麼有效**：

| 目錄 | 誰用 | 說明 |
|--- | --- | ---|
| `.claude/skills/` | Claude Code | Claude Code Marketplace 使用 |
| `.agent/skills/` | OpenSkills | 其他代理（Cursor、Windsurf）使用 |

**衝突警告**：

從官方倉庫安裝時，OpenSkills 會提示：
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## 使用類問題

### 技能沒有出現在 AGENTS.md 中？

**症狀**：安裝技能後，AGENTS.md 中沒有該技能。

**排查步驟**：

#### 1. 確認已同步

安裝技能後，需要執行 `sync` 指令：

```bash
npx openskills install anthropics/skills
# 選擇技能...

# 必須執行 sync！
npx openskills sync
```

#### 2. 檢查 AGENTS.md 位置

```bash
# 預設 AGENTS.md 在專案根目錄
cat AGENTS.md
```

如果使用自訂輸出路徑，確認路徑正確：
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. 檢查技能是否被選中

`sync` 指令是互動式的，需要確認你選擇了要同步的技能：

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [已選中]
  ◯ check-branch-first   [未選中]
```

#### 4. 查看 AGENTS.md 內容

確認 XML 標籤正確：

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### 如何更新技能？

**更新所有技能**：
```bash
npx openskills update
```

**更新指定技能**（逗號分隔）：
```bash
npx openskills update pdf,git-workflow
```

**常見問題**：

#### 技能未被更新

**症狀**：執行 `update` 後提示 "skipped"

**原因**：技能安裝時未記錄來源資訊（舊版本行為）

**解決方案**：
```bash
# 重新安裝以記錄來源
npx openskills install anthropics/skills
```

#### 本機技能無法更新

**症狀**：從本機路徑安裝的技能，update 時報錯

**原因**：本機路徑技能需要手動更新

**解決方案**：
```bash
# 重新從本機路徑安裝
npx openskills install ./my-skill
```

### 如何刪除技能？

**方法 1：互動式刪除**

```bash
npx openskills manage
```

選擇要刪除的技能，按空白鍵選中，Enter 確認。

**方法 2：直接刪除**

```bash
npx openskills remove <skill-name>
```

**刪除後**：記得執行 `sync` 更新 AGENTS.md：
```bash
npx openskills sync
```

**常見問題**：

#### 誤刪技能

**恢復方法**：
```bash
# 從來源重新安裝
npx openskills install anthropics/skills
# 選擇被誤刪的技能
```

#### 刪除後 AGENTS.md 中仍顯示

**解決方案**：重新同步
```bash
npx openskills sync
```

---

## 進階類問題

### 技能在多專案中如何共享？

**場景**：多個專案都需要用同一套技能，不想重複安裝。

**解決方案 1：全域安裝**

```bash
# 全域安裝一次
npx openskills install anthropics/skills --global

# 所有專案都能使用
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**優點**：
- 一次安裝，處處可用
- 減少磁碟佔用

**缺點**：
- 技能不在專案中，版本控制不包含

**解決方案 2：符號連結**

```bash
# 1. 全域安裝技能
npx openskills install anthropics/skills --global

# 2. 在專案中建立符號連結
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. sync 時會識別為 [project] 位置
npx openskills sync
```

**優點**：
- 技能在專案中（`[project]` 標籤）
- 版本控制可以包含符號連結
- 一次安裝，多處使用

**缺點**：
- 符號連結在某些系統上需要權限

**解決方案 3：Git Submodule**

```bash
# 在專案中新增技能倉庫為 submodule
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# 安裝 submodule 中的技能
npx openskills install .claude/skills-repo/pdf
```

**優點**：
- 完全版本控制
- 可指定技能版本

**缺點**：
- 設定較複雜

### 符號連結無法存取？

**症狀**：

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**按系統解決方案**：

#### macOS

1. 開啟「系統偏好設定」
2. 進入「安全與隱私」
3. 在「完全磁碟存取權限」中，允許你的終端應用

#### Windows

Windows 原生不支援符號連結，建議：
- **使用 Git Bash**：內建符號連結支援
- **使用 WSL**： Linux 子系統支援符號連結
- **啟用開發者模式**：設定 → 更新與安全 → 開發者模式

```bash
# Git Bash 中建立符號連結
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

檢查檔案系統權限：

```bash
# 檢查目錄權限
ls -la .claude/

# 新增寫入權限
chmod +w .claude/
```

### 技能找不到？

**症狀**：

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**排查步驟**：

#### 1. 確認技能已安裝

```bash
npx openskills list
```

#### 2. 檢查技能名稱大小寫

```bash
# ❌ 錯誤（大寫）
npx openskills read My-Skill

# ✅ 正確（小寫）
npx openskills read my-skill
```

#### 3. 檢查技能被更高優先順序的技能覆蓋

```bash
# 查看所有技能位置
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**技能查找規則**：優先順序最高的位置會覆蓋其他位置的同名技能。

---

## 本課小結

OpenSkills 常見問題核心要點：

### 核心概念

- ✅ OpenSkills 是通用安裝程式，Claude Code 是官方代理
- ✅ CLI 比 MCP 更適合技能系統（靜態檔案）

### 安裝設定

- ✅ 技能預設安裝到 `.claude/skills/`
- ✅ 使用 `--universal` 避免與 Claude Code 衝突
- ✅ 安裝失敗通常是網路、Git、路徑問題

### 使用技巧

- ✅ 安裝後必須 `sync` 才會出現在 AGENTS.md
- ✅ `update` 指令只更新有來源資訊的技能
- ✅ 刪除技能後記得 `sync`

### 進階場景

- ✅ 多專案共享技能：全域安裝、符號連結、Git Submodule
- ✅ 符號連結問題：按系統設定權限
- ✅ 技能找不到：檢查名稱、查看優先順序

## 下一課預告

> 下一課我們學習 **[故障排除](../troubleshooting/)**。
>
> 你會學到：
> - 常見錯誤的快速診斷和解決方法
> - 路徑錯誤、複製失敗、SKILL.md 無效等問題的處理
> - 權限問題和符號連結故障的排查技巧

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能        | 檔案路徑                                                                                                   | 行號    |
|--- | --- | ---|
| 安裝指令    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts)              | 1-424   |
| 同步指令    | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)                  | 1-99    |
| 更新指令    | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts)              | 1-113   |
| 刪除指令    | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts)              | 1-30    |
| 技能查找    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts)                    | 1-50    |
| 目錄優先順序  | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts)                      | 14-25   |
| AGENTS.md 生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts)            | 23-93   |

**關鍵函數**：
- `findAllSkills()`：查找所有技能（按優先順序排序）
- `findSkill(name)`：查找指定技能
- `generateSkillsXml()`：生成 AGENTS.md XML 格式
- `updateSkillFromDir()`：從目錄更新技能

</details>
