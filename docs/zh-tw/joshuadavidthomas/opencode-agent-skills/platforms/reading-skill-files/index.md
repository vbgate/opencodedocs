---
title: "讀取技能檔案: 存取資源 | opencode-agent-skills"
subtitle: "讀取技能檔案: 存取資源 | opencode-agent-skills"
sidebarTitle: "存取技能額外資源"
description: "學習讀取技能檔案的方法。掌握路徑安全檢查和 XML 注入機制，安全存取技能目錄下的文件與組態。"
tags:
  - "技能檔案"
  - "工具使用"
  - "路徑安全"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: "6"
---

# 讀取技能檔案

## 學完你能做什麼

- 使用 `read_skill_file` 工具讀取技能目錄下的文件、組態和範例檔案
- 理解路徑安全機制，防止目錄穿越攻擊
- 掌握 XML 格式的檔案內容注入方式
- 處理檔案不存在時的錯誤提示和可用檔案清單

## 你現在的困境

技能的 SKILL.md 只包含核心指導，但很多技能會提供配套的文件、組態範例、使用指南等支援檔案。你想要存取這些檔案以取得更詳細的說明，但不知道如何安全地讀取技能目錄下的檔案。

## 什麼時候用這一招

- **查看詳細文件**：技能的 `docs/` 目錄下有詳細的使用指南
- **組態範例**：需要參考 `config/` 目錄下的範例組態檔案
- **程式碼範例**：技能的 `examples/` 目錄包含程式碼範例
- **除錯輔助**：查看技能的 README 或其他說明檔案
- **了解資源結構**：探索技能目錄中有哪些可用檔案

## 核心思路

`read_skill_file` 工具讓你安全地存取技能目錄下的支援檔案。它透過以下機制保證安全性和可用性：

::: info 安全機制
外掛會嚴格檢查檔案路徑，防止目錄穿越攻擊：
- 禁止使用 `..` 存取技能目錄外的檔案
- 禁止使用絕對路徑
- 只允許存取技能目錄及其子目錄中的檔案
:::

工具執行流程：
1. 驗證技能名稱是否存在（支援命名空間）
2. 檢查請求的檔案路徑是否安全
3. 讀取檔案內容
4. 以 XML 格式包裝並注入到工作階段內容
5. 返回載入成功的確認訊息

::: tip 檔案內容持久化
檔案內容透過 `synthetic: true` 和 `noReply: true` 旗標注入，這意味著：
- 檔案內容成為工作階段內容的一部分
- 即使工作階段被壓縮，內容仍然可存取
- 注入不會觸發 AI 的直接回覆
:::

## 跟我做

### 第 1 步：讀取技能文件

假設技能目錄下有詳細的使用文件：

```
使用者輸入：
讀取 git-helper 的文件

系統呼叫：
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

系統回覆：
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

檔案內容會以 XML 格式注入到工作階段內容：

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Git Helper 使用指南

本技能提供 Git 分支管理、提交規範和協作流程的指導...

[文件內容繼續]
  </content>
</skill-file>
```

**你應該看到**：載入成功的訊息，檔案內容已注入到工作階段內容。

### 第 2 步：讀取組態範例

查看技能的範例組態：

```
使用者輸入：
顯示 docker-helper 的組態範例

系統呼叫：
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

系統回覆：
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**你應該看到**：組態檔案內容被注入，AI 可以參考範例為你產生實際的組態。

### 第 3 步：使用命名空間讀取檔案

如果專案級和使用者級有同名技能：

```
使用者輸入：
讀取 project:build-helper 的建置腳本

系統呼叫：
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

系統回覆：
File "scripts/build.sh" from skill "build-helper" loaded.
```

**你應該看到**：透過命名空間明確指定了技能來源。

### 第 4 步：處理檔案不存在的情況

如果你嘗試讀取不存在的檔案：

```
使用者輸入：
讀取 git-helper 的 api-docs.md

系統呼叫：
read_skill_file(skill="git-helper", filename="api-docs.md")

系統回覆：
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

工具會列出技能目錄下的所有可用檔案，幫助你找到正確的檔案名稱。

**你應該看到**：錯誤提示和可用檔案清單。

### 第 5 步：體驗路徑安全保護

嘗試存取技能目錄外的檔案：

```
使用者輸入：
讀取 git-helper 的父目錄檔案

系統呼叫：
read_skill_file(skill="git-helper", filename="../secrets.txt")

系統回覆：
Invalid path: cannot access files outside skill directory.
```

工具會拒絕任何試圖存取技能目錄外的請求。

**你應該看到**：路徑安全錯誤提示。

## 檢查點 ✅

- [ ] 你能使用 `read_skill_file` 讀取技能檔案嗎？
- [ ] 你能理解路徑安全機制的作用嗎？
- [ ] 你能識別檔案內容注入的 XML 格式嗎？
- [ ] 你能從錯誤提示中找到可用檔案清單嗎？
- [ ] 你能使用命名空間精確定位技能嗎？

## 踩坑提醒

### 陷阱 1：檔案路徑錯誤

如果你忘記檔案在子目錄中：

```
使用者輸入：
讀取 git-helper 的 usage-guide.md

系統回覆：
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**原因**：檔案可能在子目錄中，需要指定相對路徑。

**解決**：使用完整路徑，如 `docs/usage-guide.md`。

### 陷阱 2：忽略命名空間衝突

同名技能存在於多個命名空間時：

```
使用者輸入：
讀取 build-helper 的 README

系統回覆：
File "README.md" from skill "build-helper" loaded.
```

你可能讀取的是專案級技能，但期望的是使用者級技能。

**解決**：使用命名空間明確指定，如 `read_skill_file(skill="user:build-helper", filename="README.md")`。

### 陷阱 3：路徑穿越嘗試

嘗試使用 `..` 存取上層目錄：

```
使用者輸入：
讀取技能目錄外的檔案

系統呼叫：
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

系統回覆：
Invalid path: cannot access files outside skill directory.
```

**原因**：這是安全限制，防止目錄穿越攻擊。

**解決**：只能存取技能目錄內的檔案，需要其他檔案時，讓 AI 直接使用 `Read` 工具。

### 陷阱 4：檔案已存在於工作階段內容

如果你已經載入了技能，檔案內容可能在技能的 SKILL.md 或其他已注入內容中：

```
使用者輸入：
讀取技能的核心文件

系統呼叫：
read_skill_file(skill="my-skill", filename="core-guide.md")
```

但這可能是不必要的，因為核心內容通常在 SKILL.md 中。

**解決**：先查看已載入技能的內容，確認是否需要額外檔案。

## 本課小結

`read_skill_file` 工具讓你安全地存取技能目錄下的支援檔案：

- **安全路徑檢查**：防止目錄穿越，只允許存取技能目錄內的檔案
- **XML 注入機制**：檔案內容以 `<skill-file>` XML 標籤包裝，包含中繼資料
- **錯誤友好**：檔案不存在時列出可用檔案，幫助你找到正確路徑
- **命名空間支援**：可以用 `namespace:skill-name` 精確定位同名技能
- **內容持久化**：透過 `synthetic: true` 旗標，檔案內容在工作階段壓縮後仍可存取

這個工具非常適合讀取技能的：
- 詳細文件（`docs/` 目錄）
- 組態範例（`config/` 目錄）
- 程式碼範例（`examples/` 目錄）
- README 和說明檔案
- 腳本原始碼（如果需要查看實作）

## 下一課預告

> 下一課我們學習 **[Claude Code 技能相容性](../../advanced/claude-code-compatibility/)**。
>
> 你會學到：
> - 了解外掛如何相容 Claude Code 的技能和外掛系統
> - 理解工具映射機制（Claude Code 工具到 OpenCode 工具的轉換）
> - 掌握從 Claude Code 安裝位置發現技能的方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| ReadSkillFile 工具定義 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| 路徑安全檢查 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| 列出技能檔案 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |
| resolveSkill 函數 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| injectSyntheticContent 函數 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |

**關鍵類型**：
- `Skill`：技能中繼資料介面（`skills.ts:43-52`）
- `OpencodeClient`：OpenCode SDK 用戶端類型（`utils.ts:140`）
- `SessionContext`：工作階段內容，包含 model 和 agent 資訊（`utils.ts:142-145`）

**關鍵函數**：
- `ReadSkillFile(directory: string, client: OpencodeClient)`：返回工具定義，處理技能檔案讀取
- `isPathSafe(basePath: string, requestedPath: string): boolean`：驗證路徑是否在基目錄內，防止目錄穿越
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`：列出技能目錄下的所有檔案（排除 SKILL.md）
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`：支援 `namespace:skill-name` 格式的技能解析
- `injectSyntheticContent(client, sessionID, text, context)`：透過 `noReply: true` 和 `synthetic: true` 注入內容到工作階段

**業務規則**：
- 路徑安全檢查使用 `path.resolve()` 驗證，確保解析後的路徑以基目錄開頭（`utils.ts:131-132`）
- 檔案不存在時嘗試 `fs.readdir()` 列出可用檔案，提供友善的錯誤提示（`tools.ts:126-131`）
- 檔案內容以 XML 格式包裝，包含 `skill`、`file` 屬性和 `<metadata>`、`<content>` 標籤（`tools.ts:111-119`）
- 注入時取得當前工作階段的 model 和 agent 內容，確保內容注入到正確的內容（`tools.ts:121-122`）

**安全機制**：
- 目錄穿越防護：`isPathSafe()` 檢查路徑是否在基目錄內（`utils.ts:130-133`）
- 技能不存在時提供模糊比對建議（`tools.ts:90-95`）
- 檔案不存在時列出可用檔案，幫助使用者找到正確路徑（`tools.ts:126-131`）

</details>
