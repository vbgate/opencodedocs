---
title: "SKILL.md構造 仕様とリソース | OpenSkills"
sidebarTitle: "スキル構造の理解"
subtitle: "SKILL.md構造 仕様とリソース"
description: "SKILL.mdの完全なフィールド仕様、YAML frontmatter要件、Bundled Resourcesの設計を習得。references/、scripts/、assets/のユースケース、ファイルサイズガイドライン、リソース解決メカニズムを学習。"
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "advanced-create-skills"
order: 5
---

# スキル構造の詳細解説

## 学習後にできること

- SKILL.mdのすべてのフィールド要件とフォーマット仕様を正確に理解する
- references/、scripts/、assets/の設計原理と使用シナリオを習得する
- スキルのtoken使用量と読み込みパフォーマンスを最適化する
- 一般的なフォーマットエラーとパス解決問題を回避する
- 段階的読み込みを使用してAIコンテキスト効率を向上させる

## 現在の課題

基本的なスキル作成方法は学びましたが、SKILL.mdの完全な仕様についてはまだ理解が不十分です。あなたのスキルは以下の問題に直面している可能性があります：

- SKILL.mdが長すぎてtoken消費が過剰になる
- どのコンテンツをreferences/に配置すべきかSKILL.mdに配置すべきか判断できない
- AIエージェントがscripts/やassets/のリソースを正しく読み込めない
- YAML frontmatterのフォーマットエラーでインストールに失敗する

## このスキルを使うタイミング

- **スキルレビュー**：既存のスキルがAnthropic仕様に準拠しているか確認する
- **パフォーマンス最適化**：スキルの読み込みが遅い、またはtoken制限を超える問題を解決する
- **リソース再構成**：大規模スキルをSKILL.md + bundled resourcesに分割する
- **複雑なスキル開発**：APIドキュメントや実行可能なスクリプトを含む完全なスキルを作成する

## 🎒 開始前の準備

::: warning 前提条件チェック

開始前に以下を確認してください：

- ✅ [カスタムスキルの作成](../create-skills/)を読了済み
- ✅ スキルを少なくとも1つインストールしたことがある（基本フローを理解）
- ✅ YAMLとMarkdownの基礎構文に精通している

:::

## 中核となる考え方

### SKILL.mdの設計哲学

**SKILL.md**はAnthropicスキルシステムの中核であり、**段階的読み込み**設計を採用しています：

```mermaid
graph LR
    A[Metadata<br/>name + description] -->|常に読み込み| B[Context]
    B -->|AIが必要と判断| C[SKILL.md<br/>中核インストラクション]
    C -->|オンデマンドで参照| D[Resources<br/>references/scripts/assets]
```

**3層読み込みの利点**：

1. **Metadata層**：すべてのスキルの`name`と`description`は常にコンテキストにあり、AIが利用可能なスキルを迅速に理解できる
2. **SKILL.md層**：関連する場合のみ読み込まれ、中核インストラクションを含む（< 5,000語）
3. **Resources層**：詳細ドキュメントと実行可能ファイルはオンデマンドで読み込まれ、tokenの浪費を回避

### Bundled Resourcesの分類

| ディレクトリ | コンテキストに読み込み | 使用シナリオ | 例の種類 |
| --- | --- | --- | --- |
| `references/` | ✅ オンデマンドで読み込み | 詳細ドキュメント、API説明 | API docs、データベースschema |
| `scripts/` | ❌ 読み込まない | 実行可能コード | Python/Bashスクリプト |
| `assets/` | ❌ 読み込まない | テンプレート、出力ファイル、画像 | JSONテンプレート、ボイラープレートコード |

## 実践編

### ステップ1：YAML Frontmatter完全仕様の理解

**理由**：YAML frontmatterはスキルのメタデータであり、厳格な仕様に準拠する必要がある

SKILL.mdは`---`で始まり`---`で終わる必要があります：

```yaml
---
name: my-skill
description: Use this skill when you need to demonstrate proper format.
---
```

**必須フィールド**：

| フィールド | 型 | フォーマット要件 | 例 |
| --- | --- | --- | --- |
| `name` | string | kebab-case（ハイフン形式）、スペースなし | `pdf-editor`、`api-client` |
| `description` | string | 1-2文、三人称 | `Use this skill to edit PDF files` |

::: danger よくある間違い

| 間違った例 | 問題 | 修正方法 |
| --- | --- | --- |
| `name: My Skill` | スペースを含む | `name: my-skill`に変更 |
| `name: my_skill` | アンダースコア形式 | `name: my-skill`に変更 |
| `description: You should use this when...` | 二人称 | `description: Use this skill when...`に変更 |
| `description:` 長すぎ | 100語を超える | 1-2文の概要に簡潔化 |
| 終了`---`が欠けている | YAMLが正しく閉じられていない | 終了セパレータを追加 |

:::

**ソース検証**：OpenSkillsは非貪欲正規表現を使用してフォーマットを検証

```typescript
// src/utils/yaml.ts
export function hasValidFrontmatter(content: string): boolean {
  return content.trim().startsWith('---');
}

export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

---

### ステップ2：SKILL.md本文の作成（命令形）

**理由**：AIエージェントは対話式の説明ではなく命令式のインストラクションを期待する

**正しいアプローチ**：

```markdown
## Instructions

To execute this task:

1. Read the input file
2. Process data using the algorithm
3. Generate output in specified format
```

**間違ったアプローチ**（避けるべき）：

```markdown
## Instructions

You should execute this task by:

1. Reading the input file
2. Processing data using the algorithm
3. Generating output in specified format
```

**対照表**：

| ✅ 正しい（命令形/不定形） | ❌ 間違った（二人称） |
| --- | --- |
| "Load this skill when X" | "If you need Y" |
| "To accomplish Z, execute A" | "You should do Z" |
| "See references/guide.md" | "When you want to Z" |

**執筆のコツ**：

1. **動詞で始める**：`Create` → `Use` → `Return`
2. **"You"を省略**："You should"と言わない
3. **明確なパス**：リソースを参照する際は`references/`、`scripts/`、`assets/`プレフィックスを使用

---

### ステップ3：references/を使用した詳細ドキュメントの管理

**理由**：SKILL.mdをシンプルに保ち、詳細ドキュメントはオンデマンドで読み込む

**適用シナリオ**：

- APIドキュメント（500語を超えるエンドポイント説明）
- データベースschema（テーブル構造、フィールド定義）
- 詳細ガイド（設定項目の説明、よくある質問）
- コード例（大きなコードスニペット）

**ディレクトリ構造**：

```
my-skill/
├── SKILL.md              (~2,000語、中核インストラクション)
└── references/
    ├── api-docs.md       (詳細APIドキュメント)
    ├── database-schema.md (データベース構造)
    └── troubleshooting.md (トラブルシューティングガイド)
```

**SKILL.mdでの参照方法**：

```markdown
## Instructions

To interact with the API:

1. Read the request parameters
2. Call the API endpoint
3. For detailed response format, see `references/api-docs.md`
4. Parse the response
5. Handle errors (see `references/troubleshooting.md`)
```

**references/api-docs.mdの例**：

```markdown
# API Documentation

## Overview

This API provides endpoints for data processing.

## Endpoints

### POST /api/process

**Request:**
```json
{
  "input": "data to process",
  "options": {
    "format": "json"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "result": {
    "output": "processed data"
  }
}
```

**Error Codes:**
- `400`: Invalid input format
- `500`: Server error
```

::: tip ベストプラクティス

**references/のファイルサイズ推奨**：
- 単一ファイル：推奨 < 10,000語
- 合計サイズ：推奨 < 50,000語（複数ファイルに分割）
- 命名：ハイフン形式を使用（`api-docs.md`ではなく`API_Docs.md`）

:::

---

### ステップ4：scripts/を使用した決定性タスクの実行

**理由**：実行可能なスクリプトはコンテキストに読み込む必要がなく、反復的タスクに適している

**適用シナリオ**：

- データ変換（JSON → CSV、フォーマット変換）
- ファイル処理（圧縮、解凍、リネーム）
- コード生成（テンプレートからのコード生成）
- テスト実行（ユニットテスト、統合テスト）

**ディレクトリ構造**：

```
my-skill/
├── SKILL.md
└── scripts/
    ├── process.py       (Pythonスクリプト)
    ├── transform.sh     (Bashスクリプト)
    └── validate.js      (Node.jsスクリプト)
```

**SKILL.mdでの参照方法**：

```markdown
## Instructions

To process the input data:

1. Validate the input file format
2. Execute the processing script:
   ```bash
   python scripts/process.py --input data.json --output result.json
   ```
3. Verify the output file
4. If validation fails, see `scripts/validate.py` for error messages
```

**scripts/process.pyの例**：

```python
#!/usr/bin/env python3
import json
import sys

def main():
    input_file = sys.argv[1]
    output_file = sys.argv[2]

    with open(input_file, 'r') as f:
        data = json.load(f)

    # Processing logic
    result = transform_data(data)

    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)

    print(f"✅ Processed {input_file} → {output_file}")

if __name__ == "__main__":
    main()
```

::: info scripts/の利点

SKILL.mdにコードをインライン化する場合と比較：

| 特性 | インラインコード | scripts/ |
| --- | --- | --- |
| Token消費 | ✅ 高い | ❌ 低い |
| 再利用性 | ❌ 悪い | ✅ 良い |
| テスト容易性 | ❌ 難しい | ✅ 容易 |
| 複雑性制限 | ❌ token制限あり | ✅ 制限なし |

:::

---
