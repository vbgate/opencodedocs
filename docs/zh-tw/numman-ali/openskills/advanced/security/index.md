---
title: "安全防護: 路徑遍歷與符號連結 | OpenSkills"
sidebarTitle: "防止路徑遍歷"
subtitle: "安全防護: 路徑遍歷與符號連結 | OpenSkills"
description: "學習 OpenSkills 的三層安全防護機制。了解路徑遍歷防護、符號連結安全處理、YAML 解析安全，確保技能安裝和使用的安全性。"
tags:
  - "安全性"
  - "路徑遍歷"
  - "符號連結"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# OpenSkills 安全性說明

## 學完你能做什麼

- 理解 OpenSkills 的三層安全防護機制
- 了解路徑遍歷攻擊的原理和防護方法
- 掌握符號連結的安全處理方式
- 認識 YAML 解析中的 ReDoS 風險及防護措施

## 你現在的困境

你可能聽過「本地執行更安全」的說法，但不清楚具體有哪些安全防護措施。或者你在安裝技能時擔心：
- 會不會把檔案寫到系統目錄裡？
- 符號連結會不會帶來安全風險？
- 解析 SKILL.md 的 YAML 時會不會有漏洞？

## 什麼時候用這一招

當你需要：
- 在企業環境中部署 OpenSkills
- 審計 OpenSkills 的安全性
- 從安全角度評估技能管理方案
- 對抗安全團隊的技術審查

## 核心思路

OpenSkills 的安全設計遵循三個原則：

::: info 三層安全防護
1. **輸入驗證** - 檢查所有外部輸入（路徑、URL、YAML）
2. **隔離執行** - 確保操作在預期目錄內
3. **安全解析** - 防止解析器漏洞（ReDoS）
:::

本地執行 + 無資料上傳 + 輸入驗證 + 路徑隔離 = 安全的技能管理

## 路徑遍歷防護

### 什麼是路徑遍歷攻擊

**路徑遍歷（Path Traversal）**攻擊是指攻擊者通過使用 `../` 等序列訪問預期目錄之外的檔案。

**範例**：如果不加防護，攻擊者可能嘗試：
```bash
# 試圖安裝到系統目錄
openskills install malicious/skill --target ../../../etc/

# 試圖覆蓋設定檔
openskills install malicious/skill --target ../../../../.ssh/
```

### OpenSkills 的防護機制

OpenSkills 使用 `isPathInside` 函數驗證安裝路徑必須在目標目錄內。

**原始碼位置**：[`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**工作原理**：
1. 使用 `resolve()` 解析所有相對路徑為絕對路徑
2. 規範化目標目錄，確保以路徑分隔符結尾
3. 檢查目標路徑是否以目標目錄開頭

**安裝時驗證**（[`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)）：
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### 驗證防護效果

**測試場景**：嘗試路徑遍歷攻擊

```bash
# 正常安裝（成功）
openskills install anthropics/skills

# 嘗試使用 ../ （失敗）
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**你應該看到**：任何試圖跳出目標目錄的安裝都會被拒絕，顯示安全錯誤。

## 符號連結安全

### 符號連結的風險

**符號連結（Symlink）**是指向其他檔案或目錄的快捷方式。如果處理不當，可能導致：

1. **資訊洩露** - 攻擊者創建指向敏感檔案的符號連結
2. **檔案覆蓋** - 符號連結指向系統檔案，被安裝操作覆蓋
3. **循環引用** - 符號連結指向自身，導致無限遞迴

### 安裝時的解引用

OpenSkills 在複製檔案時使用 `dereference: true` 解引用符號連結，直接複製目標檔案。

**原始碼位置**：[`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**作用**：
- 符號連結被替換為實際檔案
- 不會複製符號連結本身
- 避免符號連結指向的檔案被覆蓋

### 查找技能時的符號連結檢查

OpenSkills 支援符號連結形式的技能，但會檢查是否損壞。

**原始碼位置**：[`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync follows symlinks
      return stats.isDirectory();
    } catch {
      // Broken symlink or permission error
      return false;
    }
  }
  return false;
}
```

**安全特性**：
- 使用 `statSync()` 跟隨符號連結檢查目標
- 損壞的符號連結會被跳過（`catch` 塊）
- 不崩潰，靜默處理

::: tip 使用場景
符號連結支援可以讓你：
- 從 git 倉庫直接使用技能（無需複製）
- 在本地開發時同步修改
- 多個專案共享技能庫
:::

## YAML 解析安全

### ReDoS 風險

**正規表示式拒絕服務（ReDoS）**是指惡意構造的輸入導致正規表示式指數級匹配時間，消耗 CPU 資源。

OpenSkills 需要解析 SKILL.md 的 YAML frontmatter：
```yaml
---
name: skill-name
description: Skill description
---
```

### 非貪婪正規表示式防護

OpenSkills 使用非貪婪正規表示式避免 ReDoS。

**原始碼位置**：[`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**關鍵點**：
- `+?` 是**非貪婪**量詞，匹配最短可能
- `^` 和 `$` 鎖定行首行尾
- 只匹配單行，避免複雜嵌套

**錯誤範例（貪婪匹配）**：
```typescript
// ❌ 危險：+ 會貪婪匹配，可能遇到回溯爆炸
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**正確範例（非貪婪匹配）**：
```typescript
// ✅ 安全：+? 非貪婪，遇到第一個換行符就停止
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## 檔案權限與源驗證

### 繼承系統權限

OpenSkills 不管理檔案權限，直接繼承作業系統的權限控制：

- 檔案歸屬者與執行 OpenSkills 的使用者相同
- 目錄權限遵循系統 umask 設定
- 權限管理由檔案系統統一控制

### 私有倉庫的源驗證

從私有 git 倉庫安裝時，OpenSkills 依賴 git 的 SSH 金鑰驗證。

**原始碼位置**：[`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip 建議
確保你的 SSH 金鑰設定正確，並已新增到 git 伺服器的授權金鑰清單中。
:::

## 本地執行的安全性

OpenSkills 是純本地工具，不涉及網路通訊（除了複製 git 倉庫）：

### 無資料上傳

| 操作 | 資料流向 |
|--- | ---|
| 安裝技能 | Git 倉庫 → 本地 |
| 讀取技能 | 本地 → 標準輸出 |
| 同步 AGENTS.md | 本地 → 本地檔案 |
| 更新技能 | Git 倉庫 → 本地 |

### 隱私保護

- 所有技能檔案儲存在本地
- AI 代理通過本地檔案系統讀取
- 無雲端依賴或遙測收集

::: info 與 Marketplace 的區別
OpenSkills 不依賴 Anthropic Marketplace，完全本地執行。
:::

## 本課小結

OpenSkills 的三層安全防護：

| 安全層級 | 防護措施 | 原始碼位置 |
|--- | --- | ---|
| **路徑遍歷防護** | `isPathInside()` 驗證路徑在目標目錄內 | `install.ts:71-78` |
| **符號連結安全** | `dereference: true` 解引用符號連結 | `install.ts:262` |
| **YAML 解析安全** | 非貪婪正規表示式 `+?` 防止 ReDoS | `yaml.ts:4` |

**記住**：
- 路徑遍歷攻擊通過 `../` 序列訪問預期目錄外的檔案
- 符號連結需要解引用或檢查，避免資訊洩露和檔案覆蓋
- YAML 解析使用非貪婪正規表示式避免 ReDoS
- 本地執行 + 無資料上傳 = 更高的隱私安全

## 下一課預告

> 下一課我們學習 **[最佳實踐](../../best-practices/)**。
>
> 你會學到：
> - 專案配置的最佳實踐
> - 技能管理的團隊協作方案
> - 多代理環境的使用技巧
> - 常見陷阱和避免方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能          | 檔案路徑                                                                                     | 行號     |
|--- | --- | ---|
| 路徑遍歷防護   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78    |
| 安裝路徑檢查   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260  |
| 符號連結解引用 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262      |
| 更新路徑檢查   | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172  |
| 符號連結檢查   | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25    |
| YAML 解析安全  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4        |

**關鍵函式**：
- `isPathInside(targetPath, targetDir)`：驗證目標路徑是否在目標目錄內（防止路徑遍歷）
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`：檢查目錄或符號連結是否指向目錄
- `extractYamlField(content, field)`：使用非貪婪正規表示式提取 YAML 欄位（防止 ReDoS）

**更新日誌**：
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - v1.5.0 安全更新說明

</details>
