---
title: "ベストプラクティス: スキル開発 | opencode-agent-skills"
sidebarTitle: "高品質なスキルを書く"
subtitle: "ベストプラクティス: スキル開発"
description: "OpenCode Agent Skills の開発規範をマスターしましょう。命名、説明、ディレクトリ、スクリプト、Frontmatter などのベストプラクティスを学び、スキルの品質と AI の使用効率を向上させます。"
tags:
  - "ベストプラクティス"
  - "スキル開発"
  - "規範"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# スキル開発のベストプラクティス

## 学習後にできること

このチュートリアルを完了すると、以下のことができるようになります：
- 命名規則に準拠したスキル名を作成する
- 自動推薦で認識されやすい説明を書く
- 明確なスキルディレクトリ構造を整理する
- スクリプト機能を適切に使用する
- Frontmatter のよくある間違いを避ける
- スキルの発見率と使いやすさを向上させる

## なぜベストプラクティスが必要なのか

OpenCode Agent Skills プラグインは単にスキルを保存するだけでなく、以下のことも行います：
- **自動発見**：複数の場所からスキルディレクトリをスキャン
- **セマンティックマッチング**：スキルの説明とユーザーメッセージの類似度に基づいてスキルを推薦
- **名前空間管理**：複数のソースからのスキルの共存をサポート
- **スクリプト実行**：実行可能スクリプトを自動的にスキャンして実行

ベストプラクティスに従うことで、あなたのスキルは：
- ✅ プラグインに正しく認識・ロードされる
- ✅ セマンティックマッチングでより高い推薦優先度を獲得
- ✅ 他のスキルとの競合を回避
- ✅ チームメンバーにとって理解・使用しやすくなる

---

## 命名規則

### スキル名のルール

スキル名は以下の規則に準拠する必要があります：

::: tip 命名ルール
- ✅ 小文字、数字、ハイフンを使用
- ✅ 文字で始める
- ✅ 単語の区切りにハイフンを使用
- ❌ 大文字やアンダースコアは使用しない
- ❌ スペースや特殊文字は使用しない
:::

**例**：

| ✅ 正しい例 | ❌ 間違った例 | 理由 |
| --- | --- | --- |
| `git-helper` | `GitHelper` | 大文字を含む |
| `docker-build` | `docker_build` | アンダースコアを使用 |
| `code-review` | `code review` | スペースを含む |
| `test-utils` | `1-test` | 数字で始まる |

**ソースコード参照**：`src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### ディレクトリ名と frontmatter の関係

スキルのディレクトリ名と frontmatter の `name` フィールドは異なっていても構いません：

```yaml
---
# ディレクトリは my-git-tools だが、frontmatter の name は git-helper
name: git-helper
description: Git 一般操作アシスタント
---
```

**推奨される方法**：
- ディレクトリ名と `name` フィールドを一致させ、メンテナンスを容易にする
- ディレクトリ名は短く覚えやすい識別子を使用
- `name` フィールドはスキルの用途をより具体的に説明できる

**ソースコード参照**：`src/skills.ts:155-158`

---

## 説明の書き方のコツ

### 説明の役割

スキルの説明はユーザーへの説明だけでなく、以下の用途にも使用されます：

1. **セマンティックマッチング**：プラグインが説明とユーザーメッセージの類似度を計算
2. **スキル推薦**：類似度に基づいて関連スキルを自動推薦
3. **ファジーマッチング**：スキル名のスペルミス時に類似スキルを推薦

### 良い説明 vs 悪い説明

| ✅ 良い説明 | ❌ 悪い説明 | 理由 |
| --- | --- | --- |
| "Git ブランチ管理とコミットフローを自動化し、コミットメッセージの自動生成をサポート" | "Git ツール" | 曖昧すぎ、具体的な機能がない |
| "Node.js プロジェクト用の型安全な API クライアントコードを生成" | "便利なツール" | 適用シーンが不明 |
| "PDF を中国語に翻訳し、元のレイアウト形式を保持" | "翻訳ツール" | 特別な機能が不明 |

### 説明を書く原則

::: tip 説明を書く原則
1. **具体化**：スキルの具体的な用途と適用シーンを説明
2. **キーワードを含める**：ユーザーが検索しそうなキーワードを含める（例："Git"、"Docker"、"翻訳"）
3. **独自の価値を強調**：他の類似スキルと比較した優位性を説明
4. **冗長を避ける**：スキル名を繰り返さない
:::

**例**：

```markdown
---
name: pdf-translator
description: 英語の PDF ドキュメントを中国語に翻訳し、元のレイアウト形式、画像位置、表構造を保持します。バッチ翻訳とカスタム用語集をサポート。
---
```

この説明には以下が含まれています：
- ✅ 具体的な機能（PDF 翻訳、形式保持）
- ✅ 適用シーン（英語ドキュメント）
- ✅ 独自の価値（形式保持、バッチ処理、用語集）

**ソースコード参照**：`src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## ディレクトリ構成

### 基本構造

標準的なスキルディレクトリには以下が含まれます：

```
my-skill/
├── SKILL.md              # スキルメインファイル（必須）
├── README.md             # 詳細ドキュメント（オプション）
├── tools/                # 実行可能スクリプト（オプション）
│   ├── setup.sh
│   └── run.sh
└── docs/                 # サポートドキュメント（オプション）
    ├── guide.md
    └── examples.md
```

### スキップされるディレクトリ

プラグインは以下のディレクトリを自動的にスキップします（スクリプトをスキャンしません）：

::: warning 自動スキップされるディレクトリ
- `node_modules` - Node.js 依存関係
- `__pycache__` - Python バイトコードキャッシュ
- `.git` - Git バージョン管理
- `.venv`, `venv` - Python 仮想環境
- `.tox`, `.nox` - Python テスト環境
- `.` で始まる隠しディレクトリ
:::

**ソースコード参照**：`src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### 推奨されるディレクトリ名

| 用途 | 推奨ディレクトリ名 | 説明 |
| --- | --- | --- |
| スクリプトファイル | `tools/` または `scripts/` | 実行可能スクリプトを格納 |
| ドキュメント | `docs/` または `examples/` | 補助ドキュメントを格納 |
| 設定 | `config/` | 設定ファイルを格納 |
| テンプレート | `templates/` | テンプレートファイルを格納 |

---

## スクリプトの使用

### スクリプト発見ルール

プラグインはスキルディレクトリ内の実行可能ファイルを自動的にスキャンします：

::: tip スクリプト発見ルール
- ✅ スクリプトには実行権限が必要（`chmod +x script.sh`）
- ✅ 最大再帰深度は 10 階層
- ✅ 隠しディレクトリと依存関係ディレクトリをスキップ
- ❌ 実行不可能なファイルはスクリプトとして認識されない
:::

**ソースコード参照**：`src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### スクリプト権限の設定

**Bash スクリプト**：
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Python スクリプト**：
```bash
chmod +x tools/scan.py
```

ファイルの先頭に shebang を追加：
```python
#!/usr/bin/env python3
import sys
# ...
```

### スクリプト呼び出しの例

スキルがロードされると、AI は利用可能なスクリプトのリストを確認できます：

```
Available scripts:
- tools/setup.sh: 開発環境を初期化
- tools/build.sh: プロジェクトをビルド
- tools/deploy.sh: 本番環境にデプロイ
```

AI は `run_skill_script` ツールを使用してこれらのスクリプトを呼び出すことができます：

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Frontmatter のベストプラクティス

### 必須フィールド

**name**：スキルの一意識別子
- 小文字、数字、ハイフン
- 短いが説明的
- 汎用的な名前を避ける（例：`helper`、`tool`）

**description**：スキルの説明
- 機能を具体的に説明
- 適用シーンを含める
- 適度な長さ（1〜2 文）

### オプションフィールド

**license**：ライセンス情報
```yaml
license: MIT
```

**allowed-tools**：スキルが使用できるツールを制限
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**：カスタムメタデータ
```yaml
metadata:
  author: "Your Name"
  version: "1.0.0"
  category: "development"
```

**ソースコード参照**：`src/skills.ts:105-114`

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

### 完全な例

```markdown
---
name: docker-deploy
description: Docker イメージのビルドとデプロイフローを自動化し、マルチ環境設定、ヘルスチェック、ロールバックをサポート
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Docker 自動デプロイ

このスキルは Docker イメージのビルド、プッシュ、デプロイフローを自動化するのに役立ちます。

## 使用方法

...
```

---

## よくある間違いを避ける

### 間違い 1：名前が規則に準拠していない

**間違った例**：
```yaml
name: MyAwesomeSkill  # ❌ 大文字
```

**修正**：
```yaml
name: my-awesome-skill  # ✅ 小文字 + ハイフン
```

### 間違い 2：説明が曖昧すぎる

**間違った例**：
```yaml
description: "便利なツール"  # ❌ 曖昧すぎる
```

**修正**：
```yaml
description: "Git コミットフローを自動化し、規約に準拠したコミットメッセージを自動生成"  # ✅ 具体的で明確
```

### 間違い 3：スクリプトに実行権限がない

**問題**：スクリプトが実行可能スクリプトとして認識されない

**解決策**：
```bash
chmod +x tools/setup.sh
```

**確認**：
```bash
ls -l tools/setup.sh
# 表示されるべき：-rwxr-xr-x（x 権限あり）
```

### 間違い 4：ディレクトリ名の競合

**問題**：複数のスキルが同じ名前を使用

**解決策**：
- 名前空間を使用（プラグイン設定またはディレクトリ構造を通じて）
- またはより説明的な名前を使用

**ソースコード参照**：`src/skills.ts:258-259`

```typescript
// 同名スキルは最初のもののみ保持、後続は無視
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## 発見率を向上させる

### 1. 説明のキーワードを最適化

説明にユーザーが検索しそうなキーワードを含める：

```yaml
---
name: code-reviewer
description: 自動化コードレビューツール。コード品質、潜在的なバグ、セキュリティ脆弱性、パフォーマンス問題をチェック。JavaScript、TypeScript、Python など複数の言語をサポート。
---
```

キーワード：コードレビュー、コード品質、バグ、セキュリティ脆弱性、パフォーマンス問題、JavaScript、TypeScript、Python

### 2. 標準的なスキル配置場所を使用

プラグインは以下の優先順位でスキルを発見します：

1. `.opencode/skills/` - プロジェクトレベル（最高優先度）
2. `.claude/skills/` - プロジェクトレベル Claude
3. `~/.config/opencode/skills/` - ユーザーレベル
4. `~/.claude/skills/` - ユーザーレベル Claude

**推奨される方法**：
- プロジェクト固有のスキル → プロジェクトレベルに配置
- 汎用スキル → ユーザーレベルに配置

### 3. 詳細なドキュメントを提供

SKILL.md に加えて、以下も提供できます：
- `README.md` - 詳細な説明と使用例
- `docs/guide.md` - 完全な使用ガイド
- `docs/examples.md` - 実践的な例

---

## このレッスンのまとめ

このチュートリアルでは、スキル開発のベストプラクティスを紹介しました：

- **命名規則**：小文字、数字、ハイフンを使用
- **説明の書き方**：具体化、キーワードを含める、独自の価値を強調
- **ディレクトリ構成**：明確な構造、不要なディレクトリをスキップ
- **スクリプトの使用**：実行権限を設定、深度制限に注意
- **Frontmatter 規範**：必須フィールドとオプションフィールドを正しく記入
- **間違いを避ける**：よくある問題と解決方法

これらのベストプラクティスに従うことで、あなたのスキルは：
- ✅ プラグインに正しく認識・ロードされる
- ✅ セマンティックマッチングでより高い推薦優先度を獲得
- ✅ 他のスキルとの競合を回避
- ✅ チームメンバーにとって理解・使用しやすくなる

## 次のレッスンの予告

> 次のレッスンでは **[API ツールリファレンス](../api-reference/)** を学びます。
>
> 学習内容：
> - すべての利用可能なツールの詳細なパラメータ説明
> - ツール呼び出しの例と戻り値の形式
> - 高度な使用法と注意事項

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| スキル名検証 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| スキル説明検証 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Frontmatter Schema 定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| スキップされるディレクトリリスト | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| スクリプト実行権限チェック | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| 同名スキル重複排除ロジック | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**主要な定数**：
- スキップされるディレクトリ：`['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**主要な関数**：
- `findScripts(skillPath: string, maxDepth: number = 10)`：スキルディレクトリ内の実行可能スクリプトを再帰的に検索
- `parseSkillFile(skillPath: string)`：SKILL.md を解析し frontmatter を検証

</details>
