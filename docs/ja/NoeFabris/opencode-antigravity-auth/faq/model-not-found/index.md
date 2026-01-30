---
title: "モデルエラーのトラブルシューティング: 400 と MCP の問題を解決 | opencode-antigravity-auth"
sidebarTitle: "モデルが見つからない時の対処法"
subtitle: "モデル未検出と 400 エラーのトラブルシューティング"
description: "Antigravity モデルエラーのトラブルシューティング方法を学びます。Model not found、400 Unknown name parameters エラーの診断と修正手順、および MCP サーバー互換性問題の調査と解決策を網羅し、問題を素早く特定する方法を解説します。"
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# モデル未検出と 400 エラーのトラブルシューティング

## あなたが直面している問題

Antigravity モデルを使用すると、以下のエラーが発生する場合があります：

| エラーメッセージ | 典型的な症状 |
|--- | ---|
| `Model not found` | モデルが存在しないと表示され、リクエストを送信できない |
| `Invalid JSON payload received. Unknown name "parameters"` | 400 エラー、ツール呼び出しに失敗 |
| MCP サーバー呼び出しエラー | 特定の MCP ツールが使用できない |

これらの問題は通常、設定、MCP サーバーとの互換性、またはプラグインのバージョンに関連しています。

## クイック診断

詳細なトラブルシューティングに入る前に、まず以下を確認してください：

**macOS/Linux**：
```bash
# プラグインバージョンを確認
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# 設定ファイルを確認
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**：
```powershell
# プラグインバージョンを確認
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# 設定ファイルを確認
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## 問題 1：Model not found

**エラー現象**：

```
Model not found: antigravity-claude-sonnet-4-5
```

**原因**：OpenCode の Google provider 設定に `npm` フィールドが不足しています。

**解決策**：

`~/.config/opencode/opencode.json` で、`google` provider に `npm` フィールドを追加してください：

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

**確認手順**：

1. `~/.config/opencode/opencode.json` を編集する
2. ファイルを保存する
3. OpenCode でモデルを再度呼び出す
4. "Model not found" エラーがまだ発生するか確認する

::: tip ヒント
設定ファイルの場所が不明な場合は、以下を実行してください：
```bash
opencode config path
```
:::

---

## 問題 2：400 エラー - Unknown name 'parameters'

**エラー現象**：

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**これはどのような問題ですか？**

Gemini 3 モデルは**厳格な protobuf バリデーション**を使用しており、Antigravity API はツール定義に特定の形式を要求します：

```json
// ❌ 誤った形式（拒否されます）
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← このフィールドは受け付けられません
    }
  ]
}

// ✅ 正しい形式
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← functionDeclarations 内部
        }
      ]
    }
  ]
}
```

プラグインは自動的に形式を変換しますが、一部の **MCP サーバーが返す Schema に互換性のないフィールド**（`const`、`$ref`、`$defs` など）が含まれており、クリーンアップが失敗することがあります。

### 解決策 1：最新の beta バージョンに更新する

最新の beta バージョンには、Schema クリーンアップの修正が含まれています：

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

### 解決策 2：MCP サーバーを 1 つずつ無効化して調査する

一部の MCP サーバーが返す Schema 形式が Antigravity の要件に適合していない場合があります。

**手順**：

1. `~/.config/opencode/opencode.json` を開く
2. `mcpServers` 設定を見つける
3. **すべての MCP サーバーを無効化する**（コメントアウトまたは削除）
4. モデルを再度呼び出してみる
5. 成功した場合、MCP サーバーを**1 つずつ有効化**し、各有効化後にテストする
6. エラーを引き起こしている MCP サーバーを特定したら、それを無効化するか、そのプロジェクトのメンテナーに問題を報告する

**設定例**：

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← 一時的に無効化
    // "github": { ... },       ← 一時的に無効化
    "brave-search": { ... }     ← まずこれをテスト
  }
}
```

### 解決策 3：npm override を追加する

上記の方法が効果がない場合、`google` provider 設定で `@ai-sdk/google` を強制的に使用する：

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

## 問題 3：MCP サーバーによるツール呼び出しの失敗

**エラー現象**：

- 特定のツールが使用できない（WebFetch、ファイル操作など）
- Schema 関連のエラーメッセージが表示される
- 他のツールは正常に動作する

**原因**：MCP サーバーが返す JSON Schema に、Antigravity API がサポートしていないフィールドが含まれています。

### 非互換の Schema 特徴

プラグインは以下の非互換特性を自動的にクリーンアップします（ソースコード `src/plugin/request-helpers.ts:24-37`）：

| 特徴 | 変換方法 | 例 |
|--- | --- | ---|
| `const` | `enum` に変換 | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | description hint に変換 | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "参照: Foo" }` |
| `$defs` / `definitions` | schema に展開 | 参照は使用されなくなります |
| `minLength` / `maxLength` / `pattern` | description に移動 | `description` にヒントを追加 |
| `additionalProperties` | description に移動 | `description` にヒントを追加 |

ただし、Schema 構造が複雑すぎる場合（例えば、多層のネストされた `anyOf`/`oneOf`）、クリーンアップが失敗することがあります。

### トラブルシューティング手順

```bash
# デバッグログを有効化
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# OpenCode を再起動

# ログ内の Schema 変換エラーを確認
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**ログで探すべきキーワード**：

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### 問題を報告する

特定の MCP サーバーが問題を引き起こしていると判断した場合、[GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues) を提出してください。以下を含めてください：

1. **MCP サーバー名とバージョン**
2. **完全なエラーログ**（`~/.config/opencode/antigravity-logs/` から）
3. **問題を引き起こすツールの例**
4. **プラグインバージョン**（`opencode --version` を実行）

---

## トラップ回避の注意点

::: warning プラグインの無効化順序

`opencode-antigravity-auth` と `@tarquinen/opencode-dcp` を同時に使用する場合、**Antigravity Auth プラグインを前に配置してください**：

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← DCP の前に配置
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP は思考ブロックを欠いた合成 assistant メッセージを作成し、署名検証エラーを引き起こす可能性があります。
:::

::: warning 設定キー名の誤り

`plugin`（単数形）を使用してください。`plugins`（複数形）ではありません：

```json
// ❌ 誤り
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ 正解
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## いつヘルプを求めるべきか

上記のすべての方法を試しても問題が解決しない場合：

**ログファイルを確認する**：
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**アカウントをリセットする**（すべての状態をクリア）：
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**GitHub issue を提出する**。以下を含めてください：
- 完全なエラーメッセージ
- プラグインバージョン（`opencode --version`）
- `~/.config/opencode/antigravity.json` 設定（**refreshToken などの機密情報は削除してください**）
- デバッグログ（`~/.config/opencode/antigravity-logs/latest.log`）

---

## 関連コース

- [クイックインストールガイド](/ja/NoeFabris/opencode-antigravity-auth/start/quick-install/) - 基本設定
- [プラグイン互換性](/ja/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - 他のプラグインとの競合トラブルシューティング
- [デバッグログ](/ja/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - 詳細ログの有効化

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| JSON Schema クリーンアップ主関数 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| const を enum に変換 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| $ref を hints に変換 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| anyOf/oneOf の平坦化 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Gemini ツール形式変換 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**重要な定数**：
- `UNSUPPORTED_KEYWORDS`：削除される Schema キーワード（`request-helpers.ts:33-37`）
- `UNSUPPORTED_CONSTRAINTS`：description に移動される制約（`request-helpers.ts:24-28`）

**重要な関数**：
- `cleanJSONSchemaForAntigravity(schema)`：互換性のない JSON Schema をクリーンアップ
- `convertConstToEnum(schema)`：`const` を `enum` に変換
- `convertRefsToHints(schema)`：`$ref` を description hints に変換
- `flattenAnyOfOneOf(schema)`：`anyOf`/`oneOf` 構造を平坦化

</details>
