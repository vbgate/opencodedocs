---
title: "安全機制: 路徑保護與驗證 | opencode-agent-skills"
sidebarTitle: "安全機制"
subtitle: "安全機制: 路徑保護與驗證"
description: "了解 OpenCode Agent Skills 外掛程式的安全機制。掌握路徑保護、YAML 解析、輸入驗證和指令碼執行保護等安全特性，安全使用技能外掛程式。"
tags:
  - 安全
  - 最佳實踐
  - FAQ
prerequisite: []
order: 2
---

# 安全性說明

## 學完你能做什麼

- 了解外掛程式如何保護你的系統免受安全威脅
- 知道技能檔案需要遵循哪些安全規範
- 掌握使用外掛程式時的安全最佳實踐

## 核心思路

OpenCode Agent Skills 外掛程式執行在你的本地環境中，會執行指令碼、讀取檔案、解析設定。雖然它很強大，但如果技能檔案來自不可信來源，也可能帶來安全風險。

外掛程式在設計時內建了多層安全機制，像一道道防護門，從路徑存取、檔案解析到指令碼執行，層層把關。了解這些機制，可以幫助你更安全地使用外掛程式。

## 安全機制詳解

### 1. 路徑安全檢查：防止目錄穿越

**問題**：如果技能檔案包含惡意路徑（如 `../../etc/passwd`），可能會存取系統敏感檔案。

**防護措施**：

外掛程式使用 `isPathSafe()` 函式（`src/utils.ts:130-133`）確保所有檔案存取都限制在技能目錄內：

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**工作原理**：
1. 將請求路徑解析為絕對路徑
2. 檢查解析後的路徑是否以技能目錄開頭
3. 如果路徑嘗試跳出技能目錄（包含 `..`），直接拒絕

**實際案例**：

當 `read_skill_file` 工具讀取檔案時（`src/tools.ts:101-103`），會先呼叫 `isPathSafe`：

```typescript
// Security: ensure path doesn't escape skill directory
if (!isPathSafe(skill.path, args.filename)) {
  return `Invalid path: cannot access files outside skill directory.`;
}
```

這意味著：
- ✅ `docs/guide.md` → 允許（在技能目錄內）
- ❌ `../../../etc/passwd` → 拒絕（嘗試存取系統檔案）
- ❌ `/etc/passwd` → 拒絕（絕對路徑）

::: info 為什麼這很重要
路徑穿越攻擊是 Web 應用程式的常見漏洞。即使外掛程式執行在本地，不可信的技能也可能嘗試存取你的 SSH 金鑰、專案設定等敏感檔案。
:::

### 2. YAML 安全解析：防止程式碼執行

**問題**：YAML 支援自訂標籤和複雜物件，惡意 YAML 可能透過標籤執行程式碼（如 `!!js/function`）。

**防護措施**：

外掛程式使用 `parseYamlFrontmatter()` 函式（`src/utils.ts:41-49`），採用嚴格的 YAML 解析策略：

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Use core schema which only supports basic JSON-compatible types
      // This prevents custom tags that could execute code
      schema: "core",
      // Limit recursion depth to prevent DoS attacks
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**關鍵安全設定**：

| 設定          | 作用                                 |
| --- | --- |
| `schema: "core"` | 僅支援基本 JSON 型別（字串、數字、布林、陣列、物件），停用自訂標籤 |
| `maxAliasCount: 100` | 限制 YAML 別名遞迴深度，防止 DoS 攻擊 |

**實際案例**：

```yaml
# 惡意 YAML 範例（會被 core schema 拒絕）
---
!!js/function >
function () { return "malicious code" }
---

# 正確的安全格式
---
name: my-skill
description: A safe skill description
---
```

如果 YAML 解析失敗，外掛程式會靜默忽略該技能，繼續發現其他技能（`src/skills.ts:142-145`）：

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // 解析失敗，跳過此技能
}
```

### 3. 輸入驗證：Zod Schema 嚴格檢查

**問題**：技能的 frontmatter 欄位可能不符合規範，導致外掛程式行為異常。

**防護措施**：

外掛程式使用 Zod Schema（`src/skills.ts:105-114`）對 frontmatter 進行嚴格驗證：

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

**驗證規則**：

| 欄位        | 規則                                                              | 拒絕範例                         |
| --- | --- | --- |
| `name`      | 小寫字母、數字、連字號，不能為空                                   | `MySkill`（大寫）、`my skill`（空格） |
| `description` | 不能為空                                                         | `""`（空字串）                    |
| `license`   | 選用的字串                                                      | -                                |
| `allowed-tools` | 選用的字串陣列                                                | `[123]`（非字串）                 |
| `metadata`   | 選用的 key-value 物件（值為字串）                                 | `{key: 123}`（值非字串）          |

**實際案例**：

```yaml
# ❌ 錯誤：name 包含大寫字母
---
name: GitHelper
description: Git operations helper
---

# ✅ 正確：符合規範
---
name: git-helper
description: Git operations helper
---
```

如果驗證失敗，外掛程式會跳過該技能（`src/skills.ts:147-152`）：

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // 驗證失敗，跳過此技能
}
```

### 4. 指令碼執行安全：僅執行可執行檔案

**問題**：如果外掛程式執行任意檔案（如設定檔、說明文件），可能造成意外後果。

**防護措施**：

外掛程式在發現指令碼時（`src/skills.ts:59-99`），只收集有可執行權限的檔案：

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... 遞迴遍歷邏輯 ...

  if (stats.isFile()) {
    // 關鍵：只收集有可執行位的檔案
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**安全特性**：

| 檢查機制         | 作用                                                              |
| --- | --- |
| **可執行位檢查** (`stats.mode & 0o111`) | 只執行使用者明確標記為可執行的檔案，防止誤執行說明文件或設定          |
| **跳過隱藏目錄** (`entry.name.startsWith('.')`) | 不掃描 `.git`、`.vscode` 等隱藏目錄，避免掃描過多檔案          |
| **跳過相依目錄** (`skipDirs.has(entry.name)`) | 跳過 `node_modules`、`__pycache__` 等，避免掃描第三方相依      |
| **遞迴深度限制** (`maxDepth: 10`) | 限制遞迴深度為 10 層，防止惡意技能的深層目錄導致效能問題 |

**實際案例**：

在技能目錄中：

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ 可執行（被識別為指令碼）
├── build.sh           # ✓ 可執行（被識別為指令碼）
├── README.md          # ✗ 不可執行（不會被識別為指令碼）
├── config.json        # ✗ 不可執行（不會被識別為指令碼）
└── node_modules/      # ✗ 跳過（相依目錄）
    └── ...           # ✗ 跳過
```

如果呼叫 `run_skill_script("my-skill", "README.md")`，會因為 README.md 沒有可執行權限未被識別為指令碼（`src/skills.ts:86`），從而回傳"未找到"錯誤（`src/tools.ts:165-177`）。

## 安全最佳實踐

### 1. 從可信來源取得技能

- ✓ 使用官方技能倉庫或可信賴的開發者
- ✓ 檢查技能的 GitHub Star 數和貢獻者活動
- ✗ 不要隨意下載執行來路不明的技能

### 2. 審查技能內容

載入新技能前，快速瀏覽 SKILL.md 和指令碼檔案：

```bash
# 檢視技能描述和後設資料
cat .opencode/skills/skill-name/SKILL.md

# 檢查指令碼內容
cat .opencode/skills/skill-name/scripts/*.sh
```

特別注意：
- 指令碼是否存取系統敏感路徑（`/etc`、`~/.ssh`）
- 指令碼是否安裝外部相依
- 指令碼是否修改系統設定

### 3. 正確設定指令碼權限

只有明確需要執行的檔案才新增可執行權限：

```bash
# 正確：為指令碼新增可執行權限
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# 正確：說明文件保持預設權限（不可執行）
# README.md、config.json 等不需要執行
```

### 4. 隱藏敏感檔案

技能目錄中不要包含敏感資訊：

- ✗ `.env` 檔案（API 金鑰）
- ✗ `.pem` 檔案（私鑰）
- ✗ `credentials.json`（憑證）
- ✓ 使用環境變數或外部設定管理敏感資料

### 5. 專案級技能覆蓋使用者級技能

技能發現優先順序（`src/skills.ts:241-246`）：

1. `.opencode/skills/`（專案級）
2. `.claude/skills/`（專案級，Claude）
3. `~/.config/opencode/skills/`（使用者級）
4. `~/.claude/skills/`（使用者級，Claude）
5. `~/.claude/plugins/cache/`（外掛程式快取）
6. `~/.claude/plugins/marketplaces/`（外掛程式市集）

**最佳實踐**：

- 專案特定技能放在 `.opencode/skills/`，會自動覆蓋同名使用者級技能
- 通用技能放在 `~/.config/opencode/skills/`，所有專案可用
- 不推薦全域安裝來自不可信來源的技能

## 本課小結

OpenCode Agent Skills 外掛程式內建了多層安全防護：

| 安全機制         | 防護目標                           | 程式碼位置               |
| --- | --- | --- |
| 路徑安全檢查     | 防止目錄穿越，限制檔案存取範圍       | `utils.ts:130-133`     |
| YAML 安全解析     | 防止惡意 YAML 執行程式碼              | `utils.ts:41-49`       |
| Zod Schema 驗證 | 確保技能 frontmatter 符合規範        | `skills.ts:105-114`    |
| 指令碼可執行檢查   | 只執行使用者明確標記為可執行的檔案       | `skills.ts:86`         |
| 目錄跳過邏輯     | 避免掃描隱藏目錄和相依目錄          | `skills.ts:61, 70`     |

記住：安全是共同責任。外掛程式提供了防護機制，但最終決定權在你手中——只使用可信來源的技能，養成審查程式碼的習慣。

## 下一課預告

> 下一課我們學習 **[技能開發最佳實踐](../../appendix/best-practices/)**。
>
> 你會看到：
> - 命名規範和描述編寫技巧
> - 目錄組織和指令碼使用方法
> - Frontmatter 最佳實踐
> - 避免常見錯誤的方法

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 安全機制         | 檔案路徑                                                                 | 行號    |
| --- | --- | --- |
| 路徑安全檢查     | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133)         | 130-133 |
| YAML 安全解析     | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56)           | 41-56   |
| Zod Schema 驗證 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114)         | 105-114 |
| 指令碼可執行檢查   | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86)             | 86      |
| 目錄跳過邏輯     | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70)             | 61, 70  |
| 工具中的路徑安全 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103)          | 101-103 |

**關鍵函式**：
- `isPathSafe(basePath, requestedPath)`：驗證路徑是否安全，防止目錄穿越
- `parseYamlFrontmatter(text)`：安全解析 YAML，使用 core schema 和遞迴限制
- `SkillFrontmatterSchema`：Zod schema，驗證技能 frontmatter 欄位
- `findScripts(skillPath, maxDepth)`：遞迴尋找可執行指令碼，跳過隱藏和相依目錄

**關鍵常數**：
- `maxAliasCount: 100`：YAML 解析的最大別名數，防止 DoS 攻擊
- `maxDepth: 10`：指令碼發現的最大遞迴深度
- `0o111`：可執行位元遮罩（檢查檔案是否可執行）

</details>
