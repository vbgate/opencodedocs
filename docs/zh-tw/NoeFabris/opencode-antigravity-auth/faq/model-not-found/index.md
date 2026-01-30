---
title: "模型錯誤排查: 解決 400 和 MCP 問題 | opencode-antigravity-auth"
sidebarTitle: "模型找不到怎麼辦"
subtitle: "模型未找到和 400 錯誤排查"
description: "學習排查 Antigravity 模型錯誤的方法。涵蓋 Model not found、400 Unknown name parameters 錯誤的診斷和修復流程，以及 MCP 伺服器相容性問題的排查和解決方案，幫助你快速定位問題。"
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# 模型未找到和 400 錯誤排查

## 你遇到的問題

使用 Antigravity 模型時，可能會遇到以下幾種錯誤：

| 錯誤訊息 | 典型症狀 |
|--- | ---|
| `Model not found` | 提示模型不存在，無法發起請求 |
| `Invalid JSON payload received. Unknown name "parameters"` | 400 錯誤，工具呼叫失敗 |
| MCP 伺服器呼叫報錯 | 特定 MCP 工具無法使用 |

這些問題通常與配置、MCP 伺服器相容性或外掛版本有關。

## 快速診斷

在深入排查前，先確認：

**macOS/Linux**：
```bash
# 檢查外掛版本
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# 檢查配置文件
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**：
```powershell
# 檢查外掛版本
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# 檢查配置文件
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## 問題 1：Model not found

**錯誤現象**：

```
Model not found: antigravity-claude-sonnet-4-5
```

**原因**：OpenCode 的 Google provider 配置缺少 `npm` 欄位。

**解決方案**：

在你的 `~/.config/opencode/opencode.json` 中，為 `google` provider 新增 `npm` 欄位：

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**驗證步驟**：

1. 編輯 `~/.config/opencode/opencode.json`
2. 儲存檔案
3. 在 OpenCode 中重新嘗試呼叫模型
4. 檢查是否仍然出現 "Model not found" 錯誤

::: tip 提示
如果不確定配置文件位置，執行：
```bash
opencode config path
```
:::

---

## 問題 2：400 錯誤 - Unknown name 'parameters'

**錯誤現象**：

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**這是什麼問題？**

Gemini 3 模型使用**嚴格的 protobuf 驗證**，而 Antigravity API 要求工具定義使用特定格式：

```json
// ❌ 錯誤格式（會被拒絕）
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← 這個欄位不被接受
    }
  ]
}

// ✅ 正確格式
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← 在 functionDeclarations 內部
        }
      ]
    }
  ]
}
```

外掛會自動轉換格式，但某些 **MCP 伺服器返回的 Schema 包含不相容欄位**（如 `const`、`$ref`、`$defs`），導致清理失敗。

### 解決方案 1：更新到最新 beta 版本

最新的 beta 版本包含 Schema 清理修復：

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**：
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**：
```powershell
npm install -g opencode-antigravity-auth@beta
```

### 解決方案 2：禁用 MCP 伺服器逐個排查

某些 MCP 伺服器返回的 Schema 格式不符合 Antigravity 要求。

**步驟**：

1. 開啟 `~/.config/opencode/opencode.json`
2. 找到 `mcpServers` 配置
3. **禁用所有 MCP 伺服器**（註釋掉或刪除）
4. 重新嘗試呼叫模型
5. 如果成功，逐個**啟用 MCP 伺服器**，每次啟用一個後測試
6. 找出導致錯誤的 MCP 伺服器後，禁用它或向該專案的維護者報告問題

**示例配置**：

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← 暫時禁用
    // "github": { ... },       ← 暫時禁用
    "brave-search": { ... }     ← 先測試這一個
  }
}
```

### 解決方案 3：添加 npm override

如果以上方法無效，在 `google` provider 配置中強制使用 `@ai-sdk/google`：

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## 問題 3：MCP 伺服器導致工具呼叫失敗

**錯誤現象**：

- 特定工具無法使用（如 WebFetch、檔案操作等）
- 錯誤提示 Schema 相關問題
- 其他工具正常工作

**原因**：MCP 伺服器返回的 JSON Schema 包含 Antigravity API 不支援的欄位。

### 不相容的 Schema 特徵

外掛會自動清理以下不相容特性（原始碼 `src/plugin/request-helpers.ts:24-37`）：

| 特性 | 轉換方式 | 示例 |
|--- | --- | ---|
| `const` | 轉換為 `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | 轉換為 description hint | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "See: Foo" }` |
| `$defs` / `definitions` | 展開到 schema 中 | 不再使用引用 |
| `minLength` / `maxLength` / `pattern` | 移到 description | 新增到 `description` 提示 |
| `additionalProperties` | 移到 description | 新增到 `description` 提示 |

但如果 Schema 結構過於複雜（如多層巢狀的 `anyOf`/`oneOf`），清理可能失敗。

### 排查流程

```bash
# 啟用偵錯日誌
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# 重啟 OpenCode

# 檢視日誌中的 Schema 轉換錯誤
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**日誌中查詢的關鍵詞**：

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### 報告問題

如果確定某個 MCP 伺服器導致問題，請提交 [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues)，包含：

1. **MCP 伺服器名稱和版本**
2. **完整的錯誤日誌**（從 `~/.config/opencode/antigravity-logs/`）
3. **觸發問題的工具示例**
4. **外掛版本**（執行 `opencode --version`）

---

## 踩坑提醒

::: warning 禁用外掛順序

如果你同時使用 `opencode-antigravity-auth` 和 `@tarquinen/opencode-dcp`，**將 Antigravity Auth 外掛放在前面**：

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← 必須在 DCP 之前
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP 會建立缺乏思考塊的合成 assistant 訊息，可能導致簽名驗證錯誤。
:::

::: warning 配置鍵名錯誤

確保使用 `plugin`（單數），不是 `plugins`（複數）：

```json
// ❌ 錯誤
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ 正確
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## 何時尋求幫助

如果嘗試以上所有方法後問題仍然存在：

**檢查日誌檔案**：
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**重置帳戶**（清除所有狀態）：
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**提交 GitHub issue**，包含：
- 完整的錯誤資訊
- 外掛版本（`opencode --version`）
- `~/.config/opencode/antigravity.json` 配置（**刪除敏感資訊如 refreshToken**）
- 除錯日誌（`~/.config/opencode/antigravity-logs/latest.log`）

---

## 相關課程

- [快速安裝指南](/zh-tw/NoeFabris/opencode-antigravity-auth/start/quick-install/) - 基礎配置
- [外掛相容性](/zh-tw/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - 其他外掛衝突排查
- [除錯日誌](/zh-tw/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - 啟用詳細日誌

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| JSON Schema 清理主函式 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| 轉換 const 為 enum | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| 轉換 $ref 為 hints | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| 展平 anyOf/oneOf | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Gemini 工具格式轉換 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**關鍵常數**：
- `UNSUPPORTED_KEYWORDS`：被移除的 Schema 關鍵字（`request-helpers.ts:33-37`）
- `UNSUPPORTED_CONSTRAINTS`：移到 description 的約束（`request-helpers.ts:24-28`）

**關鍵函式**：
- `cleanJSONSchemaForAntigravity(schema)`：清理不相容的 JSON Schema
- `convertConstToEnum(schema)`：將 `const` 轉換為 `enum`
- `convertRefsToHints(schema)`：將 `$ref` 轉換為 description hints
- `flattenAnyOfOneOf(schema)`：展平 `anyOf`/`oneOf` 結構

</details>
