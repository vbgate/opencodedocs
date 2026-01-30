---
title: "故障排除：解決常見問題 | opencode-agent-skills"
subtitle: "故障排除：解決常見問題"
sidebarTitle: "遇到問題怎麼辦"
description: "學習 opencode-agent-skills 的故障排除方法。涵蓋技能載入失敗、腳本執行錯誤、路徑安全問題等 9 類常見問題的解決方案。"
tags:
  - "troubleshooting"
  - "faq"
  - "故障排除"
prerequisite: []
order: 1
---

# 常見問題排除

::: info
本課程適合所有遇到使用問題的使用者，無論你是否已經熟悉擴充功能的基本功能。如果你遇到了技能載入失敗、腳本執行錯誤等問題，或者想了解常見問題的排除方法，本課程會幫助你快速定位並解決這些常見問題。
:::

## 學完你能做什麼

- 快速定位技能載入失敗的原因
- 解決腳本執行錯誤和權限問題
- 理解路徑安全限制的原理
- 排除語意匹配和模型載入問題

## 技能查詢不到

### 症狀
呼叫 `get_available_skills` 時回傳 `No skills found matching your query`。

### 可能原因
1. 技能未安裝在探索路徑中
2. 技能名稱拼寫錯誤
3. SKILL.md 格式不符合規範

### 解決方法

**檢查技能是否在探索路徑中**：

擴充功能按以下優先順序查找技能（首個匹配生效）：

| 優先順序 | 路徑 | 類型 |
| --- | --- | --- |
| 1 | `.opencode/skills/` | 專案級（OpenCode）|
| 2 | `.claude/skills/` | 專案級（Claude）|
| 3 | `~/.config/opencode/skills/` | 使用者級（OpenCode）|
| 4 | `~/.claude/skills/` | 使用者級（Claude）|
| 5 | `~/.claude/plugins/cache/` | 擴充功能快取 |
| 6 | `~/.claude/plugins/marketplaces/` | 已安裝擴充功能 |

驗證命令：
```bash
# 檢查專案級技能
ls -la .opencode/skills/
ls -la .claude/skills/

# 檢查使用者級技能
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**驗證 SKILL.md 格式**：

技能目錄必須包含 `SKILL.md` 檔案，且格式符合 Anthropic Skills Spec：

```yaml
---
name: skill-name
description: 技能的簡短描述
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

技能內容部分...
```

必檢項目：
- ✅ `name` 必須是小寫字母、數字和連字符（如 `git-helper`）
- ✅ `description` 不能為空
- ✅ YAML frontmatter 必須用 `---` 包圍
- ✅ 技能內容必須跟在第二個 `---` 後

**利用模糊匹配**：

擴充功能會提供拼寫建議。例如：
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

如果看到類似提示，使用建議的名稱重試。

---

## 技能不存在錯誤

### 症狀
呼叫 `use_skill("skill-name")` 時回傳 `Skill "skill-name" not found`。

### 可能原因
1. 技能名稱拼寫錯誤
2. 技能已被同名技能覆蓋（優先順序衝突）
3. 技能目錄缺少 SKILL.md 或格式錯誤

### 解決方法

**查看所有可用技能**：

```bash
使用 get_available_skills 工具列出所有技能
```

**理解優先順序覆蓋規則**：

如果多個路徑存在同名技能，僅**優先順序最高**的生效。例如：
- 專案級 `.opencode/skills/git-helper/` → ✅ 生效
- 使用者級 `~/.config/opencode/skills/git-helper/` → ❌ 被覆蓋

檢查同名衝突：
```bash
# 搜尋所有同名技能
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**驗證 SKILL.md 是否存在**：

```bash
# 進入技能目錄
cd .opencode/skills/git-helper/

# 檢查 SKILL.md
ls -la SKILL.md

# 查看 YAML 格式是否正確
head -10 SKILL.md
```

---

## 腳本執行失敗

### 症狀
呼叫 `run_skill_script` 時回傳腳本錯誤或退出碼非零。

### 可能原因
1. 腳本路徑不正確
2. 腳本沒有可執行權限
3. 腳本本身有邏輯錯誤

### 解決方法

**檢查腳本是否在技能的 scripts 清單中**：

載入技能時會列出可用腳本：
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

如果呼叫時指定了不存在的腳本：
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**使用正確的相對路徑**：

腳本的路徑是相對於技能目錄的，不要包含前導 `/`：
- ✅ 正確：`tools/build.sh`
- ❌ 錯誤：`/tools/build.sh`

**賦予腳本可執行權限**：

擴充功能只執行有可執行位的檔案（`mode & 0o111`）。

::: code-group

```bash [macOS/Linux]
# 賦予可執行權限
chmod +x .opencode/skills/my-skill/tools/build.sh

# 驗證權限
ls -la .opencode/skills/my-skill/tools/build.sh
# 輸出應包含：-rwxr-xr-x
```

```powershell [Windows]
# Windows 不使用 Unix 權限位，確保腳本副檔名關聯正確
# PowerShell 腳本：.ps1
# Bash 腳本（透過 Git Bash）：.sh
```

:::

**除錯腳本執行錯誤**：

如果腳本返回錯誤，擴充功能會顯示退出碼和輸出：
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

手動除錯：
```bash
# 進入技能目錄
cd .opencode/skills/my-skill/

# 直接執行腳本查看詳細錯誤
./tools/build.sh
```

---

## 路徑不安全錯誤

### 症狀
呼叫 `read_skill_file` 或 `run_skill_script` 時回傳路徑不安全錯誤。

### 可能原因
1. 路徑包含 `..`（目錄穿越）
2. 路徑是絕對路徑
3. 路徑包含不規範的字元

### 解決方法

**理解路徑安全規則**：

擴充功能禁止存取技能目錄以外的檔案，防止目錄穿越攻擊。

允許的路徑範例（相對於技能目錄）：
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

禁止的路徑範例：
- ❌ `../../../etc/passwd`（目錄穿越）
- ❌ `/tmp/file.txt`（絕對路徑）
- ❌ `./../other-skill/file.md`（穿越到其他目錄）

**使用相對路徑**：

始終使用相對於技能目錄的路徑，不要以 `/` 或 `../` 開頭：
```bash
# 讀取技能文件
read_skill_file("my-skill", "docs/guide.md")

# 執行技能腳本
run_skill_script("my-skill", "tools/build.sh")
```

**列出可用檔案**：

如果不確定檔案名稱，先查看技能檔案清單：
```
呼叫 use_skill 後會回傳：
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Embedding 模型載入失敗

### 症狀
語意匹配功能失效，日誌顯示 `Model failed to load`。

### 可能原因
1. 網路連線問題（首次下載模型）
2. 模型檔案損壞
3. 快取目錄權限問題

### 解決方法

**檢查網路連線**：

首次使用時，擴充功能需要從 Hugging Face 下載 `all-MiniLM-L6-v2` 模型（約 238MB）。確保網路可以存取 Hugging Face。

**清理並重新下載模型**：

模型快取在 `~/.cache/opencode-agent-skills/`：

```bash
# 刪除快取目錄
rm -rf ~/.cache/opencode-agent-skills/

# 重啟 OpenCode，擴充功能會自動重新下載模型
```

**檢查快取目錄權限**：

```bash
# 查看快取目錄
ls -la ~/.cache/opencode-agent-skills/

# 確保有讀寫權限
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**手動驗證模型載入**：

如果問題持續，可以在擴充功能日誌中查看詳細錯誤：
```
查看 OpenCode 日誌，搜尋 "embedding" 或 "model"
```

---

## SKILL.md 解析失敗

### 症狀
技能目錄存在但未被擴充功能發現，或者載入時回傳格式錯誤。

### 可能原因
1. YAML frontmatter 格式錯誤
2. 必填欄位缺失
3. 欄位值不符合驗證規則

### 解決方法

**檢查 YAML 格式**：

SKILL.md 的結構必須如下：

```markdown
---
name: my-skill
description: 技能描述
---

技能內容...
```

常見錯誤：
- ❌ 缺少 `---` 分隔符
- ❌ YAML 縮排不正確（YAML 使用 2 空格縮排）
- ❌ 冒號後缺少空格

**驗證必填欄位**：

| 欄位 | 類型 | 必填 | 約束 |
| --- | --- | --- | --- |
| name | string | ✅ | 小寫字母數字連字符，非空 |
| description | string | ✅ | 非空 |

**測試 YAML 有效性**：

使用線上工具驗證 YAML 格式：
- [YAML Lint](https://www.yamllint.com/)

或使用命令列工具：
```bash
# 安裝 yamllint
pip install yamllint

# 驗證檔案
yamllint SKILL.md
```

**檢查技能內容區域**：

技能內容必須跟在第二個 `---` 之後：

```markdown
---
name: my-skill
description: 技能描述
---

這裡開始是技能內容，會被注入到 AI 的上下文中...
```

如果技能內容為空，擴充功能會忽略該技能。

---

## 自動推薦不生效

### 症狀
傳送相關訊息後，AI 沒有收到技能推薦提示。

### 可能原因
1. 相似度低於閾值（預設 0.35）
2. 技能描述不夠詳細
3. 模型未載入

### 解決方法

**提高技能描述品質**：

技能描述越具體，語意匹配越準確。

| ❌ 糟糕的描述 | ✅ 好的描述 |
| --- | --- |
| "Git 工具" | "幫助執行 Git 操作：建立分支、提交程式碼、合併 PR、解決衝突" |
| "測試輔助" | "產生單元測試、執行測試套件、分析測試覆蓋率、修復失敗的測試" |

**手動呼叫技能**：

如果自動推薦不生效，可以手動載入：

```
使用 use_skill("skill-name") 工具
```

**調整相似度閾值**（進階）：

預設閾值為 0.35，如果覺得推薦太少，可以在原始碼中調整（`src/embeddings.ts:10`）：

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // 降低此值會增加推薦
```

::: warning
修改原始碼需要重新編譯擴充功能，不推薦一般使用者操作。
:::

---

## 上下文壓縮後技能失效

### 症狀
長對話後，AI 好像「忘記」了已載入的技能。

### 可能原因
1. 擴充功能版本低於 v0.1.0
2. 對話初始化未完成

### 解決方法

**驗證擴充功能版本**：

壓縮恢復功能在 v0.1.0+ 均支援。如果擴充功能透過 npm 安裝，檢查版本：

```bash
# 查看 OpenCode 擴充功能目錄中的 package.json
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**確認對話初始化完成**：

擴充功能在首次訊息時會注入技能清單。如果對話初始化未完成，壓縮恢復可能失效。

症狀：
- 首次訊息後沒有看到技能清單
- AI 不了解可用技能

**重新啟動對話**：

如果問題持續，刪除目前對話並新建：
```
在 OpenCode 中刪除對話，重新開始對話
```

---

## 腳本遞迴搜尋失敗

### 症狀
技能包含深層嵌套的腳本，但未被擴充功能發現。

### 可能原因
1. 遞迴深度超過 10 層
2. 腳本在隱藏目錄中（以 `.` 開頭）
3. 腳本在相依目錄中（如 `node_modules`）

### 解決方法

**了解遞迴搜尋規則**：

擴充功能遞迴搜尋腳本時：
- 最大深度：10 層
- 跳過隱藏目錄（目錄名以 `.` 開頭）：`.git`、`.vscode` 等
- 跳過相依目錄：`node_modules`、`__pycache__`、`vendor`、`.venv`、`venv`、`.tox`、`.nox`

**調整腳本位置**：

如果腳本在深層目錄，可以：
- 提升到更淺的目錄（如 `tools/` 而非 `src/lib/utils/tools/`）
- 使用軟連結到腳本位置（Unix 系統）

```bash
# 建立軟連結
ln -s ../../../scripts/build.sh tools/build.sh
```

**列出已發現的腳本**：

載入技能後，擴充功能會回傳腳本清單。如果腳本不在清單中，檢查：
1. 檔案是否有可執行權限
2. 目錄是否被跳過規則匹配

---

## 本課程小結

本課程涵蓋了使用 OpenCode Agent Skills 擴充功能時常見的 9 類問題：

| 問題類型 | 關鍵檢查點 |
| --- | --- |
| 技能查詢不到 | 探索路徑、SKILL.md 格式、拼寫 |
| 技能不存在 | 名稱正確性、優先順序覆蓋、檔案存在性 |
| 腳本執行失敗 | 腳本路徑、可執行權限、腳本邏輯 |
| 路徑不安全 | 相對路徑、無 `..`、無絕對路徑 |
| 模型載入失敗 | 網路連線、快取清理、目錄權限 |
| 解析失敗 | YAML 格式、必填欄位、スキル內容 |
| 自動推薦不生效 | 描述品質、相似度閾值、手動呼叫 |
| 上下文壓縮後失效 | 擴充功能版本、對話初始化 |
| 腳本遞迴搜尋失敗 | 深度限制、目錄跳過規則、可執行權限 |

---

## 下一課預告

> 下一課我們學習 **[安全性說明](../security-considerations/)**。
>
> 你會學到：
> - 擴充功能的安全機制設計
> - 如何撰寫安全的技能
> - 路徑驗證和權限控制原理
> - 安全最佳實踐

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 技能查詢模糊匹配建議 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| 技能不存在錯誤處理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| 腳本不存在錯誤處理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| 腳本執行失敗錯誤處理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| 路徑安全檢查 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| SKILL.md 解析錯誤處理 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| 模型載入失敗錯誤 | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| 模糊匹配演算法 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**關鍵常數**：
- `SIMILARITY_THRESHOLD = 0.35`（相似度閾值）：`src/embeddings.ts:10`
- `TOP_K = 5`（回傳最相似的技能數量）：`src/embeddings.ts:11`

**其他重要值**：
- `maxDepth = 10`（腳本遞迴最大深度，findScripts 函數預設參數）：`src/skills.ts:59`
- `0.4`（模糊匹配閾值，findClosestMatch 函數回傳條件）：`src/utils.ts:124`

**關鍵函數**：
- `findClosestMatch()`：模糊匹配演算法，用於產生拼寫建議
- `isPathSafe()`：路徑安全檢查，防止目錄穿越
- `ensureModel()`：確保 embedding 模型已載入
- `parseSkillFile()`：解析 SKILL.md 並驗證格式

</details>
