---
title: "API: ツールリファレンス | opencode-agent-skills"
sidebarTitle: "4つのツールを呼び出す"
subtitle: "API: ツールリファレンス | opencode-agent-skills"
description: "opencode-agent-skills の 4 つのコア API ツールの使用方法を学びます。パラメータ設定、戻り値の処理、エラーのトラブルシューティングをマスターし、ツールの名前空間サポートとセキュリティメカニズムを理解して、実践的な例で開発効率を向上させましょう。"
tags:
  - "API"
  - "ツールリファレンス"
  - "インターフェースドキュメント"
prerequisite:
  - "start-installation"
order: 2
---

# API ツールリファレンス

## 学習後にできること

この API リファレンスを通じて、以下のことができるようになります：

- 4 つのコアツールのパラメータと戻り値を理解する
- 正しいツール呼び出し方法をマスターする
- 一般的なエラー状況に対処できるようになる

## ツール概要

OpenCode Agent Skills プラグインは以下の 4 つのツールを提供します：

| ツール名 | 機能説明 | 使用シーン |
| --- | --- | --- |
| `get_available_skills` | 利用可能なスキル一覧を取得 | すべての利用可能なスキルを表示、検索フィルタリングをサポート |
| `read_skill_file` | スキルファイルを読み取る | スキルのドキュメント、設定などのサポートファイルにアクセス |
| `run_skill_script` | スキルスクリプトを実行 | スキルディレクトリで自動化スクリプトを実行 |
| `use_skill` | スキルをロード | スキルの SKILL.md コンテンツをセッションコンテキストに注入 |

---

## get_available_skills

利用可能なスキル一覧を取得します。オプションの検索フィルタリングをサポートしています。

### パラメータ

| パラメータ名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `query` | string | いいえ | 検索クエリ文字列、スキル名と説明にマッチ（`*` ワイルドカードをサポート） |

### 戻り値

フォーマットされたスキル一覧を返します。各項目には以下が含まれます：

- スキル名とソースラベル（例：`skill-name (project)`）
- スキルの説明
- 利用可能なスクリプト一覧（存在する場合）

**戻り値の例**：
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### エラー処理

- マッチする結果がない場合、ヒントメッセージを返す
- クエリパラメータのスペルミスがある場合、類似スキルの提案を返す

### 使用例

**すべてのスキルを一覧表示**：
```
ユーザー入力：
利用可能なすべてのスキルを一覧表示

AI 呼び出し：
get_available_skills()
```

**"git" を含むスキルを検索**：
```
ユーザー入力：
git 関連のスキルを検索

AI 呼び出し：
get_available_skills({
  "query": "git"
})
```

**ワイルドカードを使用した検索**：
```
AI 呼び出し：
get_available_skills({
  "query": "code*"
})

戻り値：
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

スキルディレクトリ内のサポートファイル（ドキュメント、設定、サンプルなど）を読み取ります。

### パラメータ

| パラメータ名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `skill` | string | はい | スキル名 |
| `filename` | string | はい | ファイルパス（スキルディレクトリからの相対パス、例：`docs/guide.md`、`scripts/helper.sh`） |

### 戻り値

ファイルのロード成功確認メッセージを返します。

**戻り値の例**：
```
File "docs/guide.md" from skill "code-review" loaded.
```

ファイルの内容は XML 形式でセッションコンテキストに注入されます：

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[ファイルの実際の内容]
  </content>
</skill-file>
```

### エラー処理

| エラータイプ | 戻りメッセージ |
| --- | --- |
| スキルが存在しない | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| パスが安全でない | `Invalid path: cannot access files outside skill directory.` |
| ファイルが存在しない | `File "xxx" not found. Available files: file1, file2, ...` |

### セキュリティメカニズム

- パス安全性チェック：ディレクトリトラバーサル攻撃を防止（例：`../../../etc/passwd`）
- スキルディレクトリ内のファイルのみアクセス可能

### 使用例

**スキルドキュメントを読み取る**：
```
ユーザー入力：
code-review スキルの使用ガイドを表示

AI 呼び出し：
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**設定ファイルを読み取る**：
```
AI 呼び出し：
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

スキルディレクトリで実行可能なスクリプトを実行します。

### パラメータ

| パラメータ名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `skill` | string | はい | スキル名 |
| `script` | string | はい | スクリプトの相対パス（例：`build.sh`、`tools/deploy.sh`） |
| `arguments` | string[] | いいえ | スクリプトに渡すコマンドライン引数の配列 |

### 戻り値

スクリプトの出力内容を返します。

**戻り値の例**：
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### エラー処理

| エラータイプ | 戻りメッセージ |
| --- | --- |
| スキルが存在しない | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| スクリプトが存在しない | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| 実行失敗 | `Script failed (exit 1): error message` |

### スクリプト検出ルール

プラグインはスキルディレクトリ内の実行可能ファイルを自動的にスキャンします：

- 最大再帰深度：10 階層
- 隠しディレクトリをスキップ（`.` で始まるもの）
- 一般的な依存関係ディレクトリをスキップ（`node_modules`、`__pycache__`、`.git` など）
- 実行可能ビット（`mode & 0o111`）を持つファイルのみ含む

### 実行環境

- 作業ディレクトリ（CWD）はスキルディレクトリに切り替わる
- スクリプトはスキルディレクトリのコンテキストで実行される
- 出力は直接 AI に返される

### 使用例

**ビルドスクリプトを実行**：
```
ユーザー入力：
プロジェクトのビルドスクリプトを実行

AI 呼び出し：
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**引数付きで実行**：
```
AI 呼び出し：
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

スキルの SKILL.md コンテンツをセッションコンテキストにロードします。

### パラメータ

| パラメータ名 | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `skill` | string | はい | スキル名（名前空間プレフィックスをサポート、例：`project:my-skill`、`user:my-skill`） |

### 戻り値

スキルのロード成功確認メッセージを返します。利用可能なスクリプトとファイル一覧が含まれます。

**戻り値の例**：
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

スキルの内容は XML 形式でセッションコンテキストに注入されます：

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Claude Code ツールマッピング...]
  
  <content>
[SKILL.md の実際の内容]
  </content>
</skill>
```

### 名前空間サポート

名前空間プレフィックスを使用してスキルのソースを正確に指定できます：

| 名前空間 | 説明 | 例 |
| --- | --- | --- |
| `project:` | プロジェクトレベルの OpenCode スキル | `project:my-skill` |
| `user:` | ユーザーレベルの OpenCode スキル | `user:my-skill` |
| `claude-project:` | プロジェクトレベルの Claude スキル | `claude-project:my-skill` |
| `claude-user:` | ユーザーレベルの Claude スキル | `claude-user:my-skill` |
| プレフィックスなし | デフォルトの優先順位を使用 | `my-skill` |

### エラー処理

| エラータイプ | 戻りメッセージ |
| --- | --- |
| スキルが存在しない | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### 自動注入機能

スキルをロードする際、プラグインは自動的に以下を行います：

1. スキルディレクトリ内のすべてのファイルを一覧表示（SKILL.md を除く）
2. すべての実行可能スクリプトを一覧表示
3. Claude Code ツールマッピングを注入（スキルが必要とする場合）

### 使用例

**スキルをロード**：
```
ユーザー入力：
コードレビューを手伝って

AI 呼び出し：
use_skill({
  "skill": "code-review"
})
```

**名前空間を使用してソースを指定**：
```
AI 呼び出し：
use_skill({
  "skill": "user:git-helper"
})
```

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| ツール | ファイルパス | 行番号 |
| --- | --- | --- |
| GetAvailableSkills ツール | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| ReadSkillFile ツール | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| RunSkillScript ツール | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| UseSkill ツール | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| ツール登録 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Skill 型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Script 型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| SkillLabel 型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| resolveSkill 関数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**主要な型**：
- `Skill`：スキルの完全なメタデータ（name, description, path, scripts, template など）
- `Script`：スクリプトのメタデータ（relativePath, absolutePath）
- `SkillLabel`：スキルのソース識別子（project, user, claude-project など）

**主要な関数**：
- `resolveSkill()`：スキル名を解決、名前空間プレフィックスをサポート
- `isPathSafe()`：パスの安全性を検証、ディレクトリトラバーサルを防止
- `findClosestMatch()`：ファジーマッチによる提案

</details>

---

## 次のレッスンの予告

このコースでは OpenCode Agent Skills の API ツールリファレンスドキュメントを完了しました。

詳細については、以下を参照してください：
- [スキル開発のベストプラクティス](../best-practices/) - 高品質なスキルを作成するためのヒントと規範を学ぶ
- [よくある問題のトラブルシューティング](../../faq/troubleshooting/) - プラグイン使用時によくある問題を解決する
