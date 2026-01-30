---
title: "ファイル構造: ディレクトリ構成 | opencode-openskills"
sidebarTitle: "スキルの配置場所"
subtitle: "ファイル構造: ディレクトリ構成 | opencode-openskills"
description: "OpenSkillsのディレクトリとファイル構成を学びます。スキルインストールディレクトリ、ディレクトリ構造、AGENTS.mdフォーマット規約、および検索優先順位を習得します。"
tags:
  - "付録"
  - "ファイル構造"
  - "ディレクトリ構成"
prerequisite: []
order: 3
---

# ファイル構造

## 概要

OpenSkillsのファイル構造は、**スキルインストールディレクトリ**、**スキルディレクトリ構造**、および**AGENTS.md同期ファイル**の3つに分類されます。これらの構造を理解することで、スキルをより効果的に管理・使用できます。

## スキルインストールディレクトリ

OpenSkillsは、優先順位が高い順に4つのスキルインストール場所をサポートしています：

| 優先順位 | 場所 | 説明 | 使用する場合 |
|---|---|---|---|
| 1 | `./.agent/skills/` | プロジェクトローカルのUniversalモード | マルチエージェント環境、Claude Codeとの競合を回避 |
| 2 | `~/.agent/skills/` | グローバルUniversalモード | マルチエージェント環境 + グローバルインストール |
| 3 | `./.claude/skills/` | プロジェクトローカル（デフォルト） | 標準インストール、プロジェクト固有のスキル |
| 4 | `~/.claude/skills/` | グローバルインストール | すべてのプロジェクトで共有されるスキル |

**選択の推奨事項**：
- シングルエージェント環境：デフォルトの`.claude/skills/`を使用
- マルチエージェント環境：`--universal`フラグ付きで`.agent/skills/`を使用
- プロジェクト間で共通のスキル：`--global`フラグ付きのグローバルインストールを使用

## スキルディレクトリ構造

各スキルは独立したディレクトリであり、必須ファイルとオプションのリソースが含まれます：

```
skill-name/
├── SKILL.md              # 必須：スキルメインファイル
├── .openskills.json      # 必須：インストールメタデータ（自動生成）
├── references/           # オプション：参考ドキュメント
│   └── api-docs.md
├── scripts/             # オプション：実行可能なスクリプト
│   └── helper.py
└── assets/              # オプション：テンプレートと出力ファイル
    └── template.json
```

### ファイルの説明

#### SKILL.md（必須）

スキルメインファイルで、YAMLフロントマターとスキル指示が含まれます：

```yaml
---
name: my-skill
description: スキルの説明
---

## スキルタイトル

スキル指示の内容...
```

**重要なポイント**：
- ファイル名は必ず`SKILL.md`（大文字）である必要があります
- YAMLフロントマターには`name`と`description`が必須です
- 内容は命令形（imperative form）を使用してください

#### .openskills.json（必須、自動生成）

OpenSkillsが自動作成するメタデータファイルで、インストール元を記録します：

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**用途**：
- スキルの更新をサポート（`openskills update`）
- インストールタイムスタンプを記録
- スキルの出所を追跡

**ソース位置**：
- `src/utils/skill-metadata.ts:29-36` - メタデータの書き込み
- `src/utils/skill-metadata.ts:17-27` - メタデータの読み取り

#### references/（オプション）

参考ドキュメントやAPI仕様を保存します：

```
references/
├── skill-format.md      # スキルフォーマット仕様
├── api-docs.md         # APIドキュメント
└── best-practices.md   # ベストプラクティス
```

**使用シナリオ**：
- 詳細な技術ドキュメント（SKILL.mdをシンプルに保つため）
- APIリファレンスマニュアル
- サンプルコードとテンプレート

#### scripts/（オプション）

実行可能なスクリプトを保存します：

```
scripts/
├── extract_text.py      # Pythonスクリプト
├── deploy.sh          # Shellスクリプト
└── build.js          # Node.jsスクリプト
```

**使用シナリオ**：
- スキル実行時に実行する必要がある自動化スクリプト
- データ処理と変換ツール
- デプロイとビルドスクリプト

#### assets/（オプション）

テンプレートと出力ファイルを保存します：

```
assets/
├── template.json      # JSONテンプレート
├── config.yaml       # 設定ファイル
└── output.md        # サンプル出力
```

**使用シナリオ**：
- スキルが生成するコンテンツのテンプレート
- 設定ファイルのサンプル
- 想定される出力の例

## AGENTS.md構造

`openskills sync`が生成するAGENTS.mdファイルには、スキルシステムの説明と利用可能なスキルリストが含まれます：

### 完全なフォーマット

```markdown
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### コンポーネントの説明

| コンポーネント | 説明 |
|---|---|
| `<skills_system>` | XMLタグ、スキルシステム部分をマーク |
| `<usage>` | スキルの使用方法の説明（AIにスキルの呼び出し方を教える） |
| `<available_skills>` | 利用可能なスキルリスト（各スキルは`<skill>`タグ） |
| `<skill>` | 単一のスキル情報（name, description, location） |
| `<!-- SKILLS_TABLE_START -->` | 開始マーク（同期時に定位するため） |
| `<!-- SKILLS_TABLE_END -->` | 終了マーク（同期時に定位するため） |

**locationフィールド**：
- `project` - プロジェクトローカルスキル（`.claude/skills/` または `.agent/skills/`）
- `global` - グローバルスキル（`~/.claude/skills/` または `~/.agent/skills/`）

## ディレクトリ検索の優先順位

OpenSkillsはスキルを検索する際、以下の優先順位でディレクトリを走査します：

```typescript
// ソース位置：src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. プロジェクト Universal
  join(homedir(), '.agent/skills'),        // 2. グローバル Universal
  join(process.cwd(), '.claude/skills'),  // 3. プロジェクト Claude
  join(homedir(), '.claude/skills'),       // 4. グローバル Claude
]
```

**ルール**：
- 最初に一致するスキルを見つけたら、直ちに検索を停止します
- プロジェクトローカルのスキルがグローバルスキルより優先されます
- Universalモードが標準モードより優先されます

**ソース位置**：`src/utils/skills.ts:30-64` - すべてのスキルを検索する実装

## 例：完全なプロジェクト構造

OpenSkillsを使用する典型的なプロジェクト構造：

```
my-project/
├── AGENTS.md                    # 同期生成されたスキルリスト
├── .claude/                     # Claude Code設定
│   └── skills/                  # スキルインストールディレクトリ
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Universalモードディレクトリ（オプション）
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # プロジェクトソースコード
├── package.json
└── README.md
```

## ベストプラクティス

### 1. ディレクトリの選択

| シナリオ | 推奨ディレクトリ | コマンド |
|---|---|---|
| プロジェクト固有のスキル | `.claude/skills/` | `openskills install repo` |
| マルチエージェント共有 | `.agent/skills/` | `openskills install repo --universal` |
| プロジェクト間共通 | `~/.claude/skills/` | `openskills install repo --global` |

### 2. スキルの整理

- **シングルスキルリポジトリ**：ルートディレクトリに`SKILL.md`を配置
- **マルチスキルリポジトリ**：サブディレクトリにそれぞれ`SKILL.md`を含める
- **シンボリックリンク**：開発時はローカルリポジトリにシンボリックリンクを作成（[シンボリックリンクサポート](../../advanced/symlink-support/)を参照）

### 3. AGENTS.mdバージョン管理

- **コミット推奨**：`AGENTS.md`をバージョン管理に追加
- **CI同期**：CI/CDで`openskills sync -y`を実行（[CI/CD統合](../../advanced/ci-integration/)を参照）
- **チーム協力**：チームメンバーは同期のために`openskills sync`を実行

## 本レッスンのまとめ

OpenSkillsのファイル構造はシンプルで明確です：

- **4つのインストールディレクトリ**：プロジェクトローカル、グローバル、Universalモードをサポート
- **スキルディレクトリ**：必須のSKILL.md + 自動生成の`.openskills.json` + オプションの`resources`/`scripts`/`assets`
- **AGENTS.md**：Claude Code形式に従い、同期生成されたスキルリスト

これらの構造を理解することで、スキルをより効率的に管理・使用できます。

## 次のレッスンの予告

> 次のレッスンでは**[用語集](../glossary/)**を学習します。
>
> 学習内容：
> - OpenSkillsとAIスキルシステムの重要な用語
> - 専門概念の正確な定義
> - 一般的な略語の意味

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの位置を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
|---|---|---|
| ディレクトリパスユーティリティ | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| スキル検索 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| メタデータ管理 | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**重要な関数**：
- `getSkillsDir(projectLocal, universal)` - スキルディレクトリパスを取得
- `getSearchDirs()` - 優先順位付きの4つの検索ディレクトリを取得
- `findAllSkills()` - すべてのインストール済みスキルを検索
- `findSkill(skillName)` - 指定したスキルを検索
- `readSkillMetadata(skillDir)` - スキルメタデータを読み取る
- `writeSkillMetadata(skillDir, metadata)` - スキルメタデータを書き込む

</details>
