---
title: "トラブルシューティング：よくある問題の解決 | opencode-agent-skills"
subtitle: "トラブルシューティング：よくある問題の解決"
sidebarTitle: "問題が起きたときは"
description: "opencode-agent-skillsのトラブルシューティング方法を学びます。スキルのロード失敗、スクリプト実行エラー、パスのセキュリティ問題など、9種類の一般的な問題の解決策を網羅しています。"
tags:
  - "troubleshooting"
  - "faq"
  - "トラブルシューティング"
prerequisite: []
order: 1
---

# よくある問題のトラブルシューティング

::: info
このレッスンは、使用上の問題に直面しているすべてのユーザーに適しています。プラグインの基本的な機能にすでに慣れているかどうかに関係なく、スキルのロード失敗やスクリプト実行エラーなどの問題に遭遇している場合、または一般的な問題のトラブルシューティング方法を知りたい場合、このレッスンはこれらの一般的な問題をすばやく特定して解決するのに役立ちます。
:::

## 学習目標

- スキルのロード失敗の原因をすばやく特定する
- スクリプト実行エラーと権限の問題を解決する
- パスセキュリティ制限の仕組みを理解する
- セマンティックマッチングとモデルのロード問題をトラブルシューティングする

## スキルが見つからない

### 症状
`get_available_skills` を呼び出すと `No skills found matching your query` が返されます。

### 可能な原因
1. スキルが検索パスにインストールされていない
2. スキル名のスペルミス
3. SKILL.md 形式が仕様に準拠していない

### 解決策

**スキルが検索パス内にあるか確認**：

プラグインは以下の優先順位でスキルを検索します（最初に一致したものが有効になります）：

| 優先順位 | パス | 種類 |
|--- | --- | ---|
| 1 | `.opencode/skills/` | プロジェクトレベル（OpenCode）|
| 2 | `.claude/skills/` | プロジェクトレベル（Claude）|
| 3 | `~/.config/opencode/skills/` | ユーザーレベル（OpenCode）|
| 4 | `~/.claude/skills/` | ユーザーレベル（Claude）|
| 5 | `~/.claude/plugins/cache/` | プラグインキャッシュ |
| 6 | `~/.claude/plugins/marketplaces/` | インストール済みプラグイン |

検証コマンド：
```bash
# プロジェクトレベルのスキルを確認
ls -la .opencode/skills/
ls -la .claude/skills/

# ユーザーレベルのスキルを確認
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**SKILL.md 形式を確認**：

スキルディレクトリには `SKILL.md` ファイルが含まれている必要があり、その形式は Anthropic Skills Spec に準拠している必要があります：

```yaml
---
name: skill-name
description: スキルの簡潔な説明
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

スキル内容...
```

必須チェック：
- ✅ `name` は小文字、数字、ハイフンのみ（例：`git-helper`）
- ✅ `description` は空にできない
- ✅ YAML frontmatter は `---` で囲む必要がある
- ✅ スキル内容は 2 番目の `---` の後に続く必要がある

**曖昧一致を活用**：

プラグインはスペルの修正候補を提供します。例：
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

このようなメッセージが表示された場合、提案された名前を使用して再試行してください。

---

## スキルが存在しないエラー

### 症状
`use_skill("skill-name")` を呼び出すと `Skill "skill-name" not found` が返されます。

### 可能な原因
1. スキル名のスペルミス
2. 同名のスキルによって上書きされている（優先順位の競合）
3. SKILL.md がないか形式が正しくない

### 解決策

**利用可能なすべてのスキルを確認**：

```bash
使用 get_available_skills 工具列出所有技能
```

**優先順位の上書きルールを理解**：

複数のパスに同じ名前のスキルが存在する場合、**優先順位が最も高いものだけ**が有効になります。例：
- プロジェクトレベル `.opencode/skills/git-helper/` → ✅ 有効
- ユーザーレベル `~/.config/opencode/skills/git-helper/` → ❌ 上書きされる

同じ名前の競合を確認：
```bash
# 同じ名前のスキルをすべて検索
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**SKILL.md が存在するか確認**：

```bash
# スキルディレクトリに移動
cd .opencode/skills/git-helper/

# SKILL.md を確認
ls -la SKILL.md

# YAML 形式が正しいか確認
head -10 SKILL.md
```

---

## スクリプト実行失敗

### 症状
`run_skill_script` を呼び出すとスクリプトエラーまたは非ゼロの終了コードが返されます。

### 可能な原因
1. スクリプトパスが正しくない
2. スクリプトに実行権限がない
3. スクリプト自体にロジックエラーがある

### 解決策

**スクリプトがスキルの scripts リストにあるか確認**：

スキルをロードすると利用可能なスクリプトが表示されます：
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

存在しないスクリプトを呼び出すと：
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**正しい相対パスを使用**：

スクリプトパスはスキルディレクトリに対する相対パスで、先頭の `/` を含めないでください：
- ✅ 正しい：`tools/build.sh`
- ❌ 間違い：`/tools/build.sh`

**スクリプトに実行権限を付与**：

プラグインは実行ビットがあるファイルのみを実行します（`mode & 0o111`）。

::: code-group

```bash [macOS/Linux]
# 実行権限を付与
chmod +x .opencode/skills/my-skill/tools/build.sh

# 権限を確認
ls -la .opencode/skills/my-skill/tools/build.sh
# 出力に以下が含まれるはず：-rwxr-xr-x
```

```powershell [Windows]
# Windows は Unix 権限ビットを使用しないため、スクリプト拡張子が正しく関連付けられていることを確認
# PowerShell スクリプト：.ps1
# Bash スクリプト（Git Bash 経由）：.sh
```

:::

**スクリプト実行エラーをデバッグ**：

スクリプトがエラーを返す場合、プラグインは終了コードと出力を表示します：
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

手動デバッグ：
```bash
# スキルディレクトリに移動
cd .opencode/skills/my-skill/

# 直接スクリプトを実行して詳細なエラーを確認
./tools/build.sh
```

---

## パスが安全でないエラー

### 症状
`read_skill_file` または `run_skill_script` を呼び出すとパス安全エラーが返されます。

### 可能な原因
1. パスに `..`（ディレクトリトラバーサル）が含まれている
2. パスが絶対パスである
3. パスに不正な文字が含まれている

### 解決策

**パスセキュリティルールを理解**：

プラグインはディレクトリトラバーサル攻撃を防ぐため、スキルディレクトリ外のファイルへのアクセスを禁止しています。

許可されるパスの例（スキルディレクトリに対して）：
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

禁止されるパスの例：
- ❌ `../../../etc/passwd`（ディレクトリトラバーサル）
- ❌ `/tmp/file.txt`（絶対パス）
- ❌ `./../other-skill/file.md`（他のディレクトリへのトラバーサル）

**相対パスを使用**：

常にスキルディレクトリに対する相対パスを使用し、`/` または `../` で始めないでください：
```bash
# スキルドキュメントを読み込む
read_skill_file("my-skill", "docs/guide.md")

# スキルスクリプトを実行
run_skill_script("my-skill", "tools/build.sh")
```

**利用可能なファイルを一覧表示**：

ファイル名が不明な場合は、まずスキルファイルリストを確認してください：
```
use_skill を呼び出すと以下が返されます：
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Embedding モデルのロード失敗

### 症状
セマンティックマッチング機能が動作せず、ログに `Model failed to load` と表示されます。

### 可能な原因
1. ネットワーク接続の問題（モデルの初回ダウンロード）
2. モデルファイルが破損している
3. キャッシュディレクトリの権限の問題

### 解決策

**ネットワーク接続を確認**：

初回使用時、プラグインは Hugging Face から `all-MiniLM-L6-v2` モデル（約 238MB）をダウンロードする必要があります。ネットワークが Hugging Face にアクセスできることを確認してください。

**モデルをクリアして再ダウンロード**：

モデルは `~/.cache/opencode-agent-skills/` にキャッシュされます：

```bash
# キャッシュディレクトリを削除
rm -rf ~/.cache/opencode-agent-skills/

# OpenCode を再起動すると、プラグインがモデルを自動的に再ダウンロードします
```

**キャッシュディレクトリの権限を確認**：

```bash
# キャッシュディレクトリを確認
ls -la ~/.cache/opencode-agent-skills/

# 読み書き権限があることを確認
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**モデルのロードを手動で確認**：

問題が続く場合は、プラグインログで詳細なエラーを確認できます：
```
OpenCode ログを確認し、"embedding" または "model" を検索
```

---

## SKILL.md の解析失敗

### 症状
スキルディレクトリは存在しますがプラグインによって見つからない、またはロード時に形式エラーが返されます。

### 可能な原因
1. YAML frontmatter の形式エラー
2. 必須フィールドが欠落している
3. フィールド値が検証ルールに準拠していない

### 解決策

**YAML 形式を確認**：

SKILL.md の構造は以下のようになっている必要があります：

```markdown
---
name: my-skill
description: スキルの説明
---

スキル内容...
```

一般的なエラー：
- ❌ `---` 区切り文字が欠けている
- ❌ YAML インデントが正しくない（YAML は 2 スペースのインデントを使用）
- ❌ コロンの後にスペースがない

**必須フィールドを確認**：

| フィールド | タイプ | 必須 | 制約 |
|--- | --- | --- | ---|
| name | string | ✅ | 小文字英数字ハイフン、空不可 |
| description | string | ✅ | 空不可 |

**YAML 有効性をテスト**：

オンラインツールで YAML 形式を確認：
- [YAML Lint](https://www.yamllint.com/)

またはコマンドラインツールを使用：
```bash
# yamllint をインストール
pip install yamllint

# ファイルを検証
yamllint SKILL.md
```

**スキル内容領域を確認**：

スキル内容は 2 番目の `---` の後に続く必要があります：

```markdown
---
name: my-skill
description: スキルの説明
---

ここからスキル内容が始まり、AI のコンテキストに注入されます...
```

スキル内容が空の場合、プラグインはそのスキルを無視します。

---

## 自動推奨が動作しない

### 症状
関連メッセージを送信しても、AI がスキル推奨を受け取りません。

### 可能な原因
1. 類似度が閾値未満（デフォルト 0.35）
2. スキルの説明が詳細でない
3. モデルがロードされていない

### 解決策

**スキル説明の質を向上**：

スキルの説明が具体的であるほど、セマンティックマッチングが正確になります。

| ❌ 悪い説明 | ✅ 良い説明 |
|--- | ---|
| "Git ツール" | "Git 操作の実行を支援：ブランチの作成、コードのコミット、PR のマージ、競合の解決" |
| "テスト支援" | "単体テストの生成、テストスイートの実行、テストカバレッジの分析、失敗したテストの修正" |

**スキルを手動で呼び出す**：

自動推奨が動作しない場合、手動でロードできます：

```
use_skill("skill-name") 工具を使用
```

**類似度閾値を調整**（上級）：

デフォルトの閾値は 0.35 です。推奨が少ないと感じる場合、ソースコードで調整できます（`src/embeddings.ts:10`）：

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // この値を下げると推奨が増えます
```

::: warning
ソースコードの変更にはプラグインの再コンパイルが必要です。一般ユーザーには推奨されません。
:::

---

## コンテキスト圧縮後にスキルが動作しない

### 症状
長い会話の後、AI がロードされたスキルを「忘れた」ように見えます。

### 可能な原因
1. プラグインバージョンが v0.1.0 未満
2. セッション初期化が完了していない

### 解決策

**プラグインバージョンを確認**：

圧縮回復機能は v0.1.0+ でサポートされています。npm でプラグインをインストールした場合、バージョンを確認します：

```bash
# OpenCode プラグインディレクトリの package.json を確認
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**セッション初期化が完了していることを確認**：

プラグインは最初のメッセージでスキルリストを注入します。セッション初期化が完了していない場合、圧縮回復が機能しない可能性があります。

症状：
- 最初のメッセージ後にスキルリストが表示されない
- AI が利用可能なスキルを知らない

**セッションを再起動**：

問題が続く場合、現在のセッションを削除して新規作成します：
```
OpenCode でセッションを削除し、会話を再開
```

---

## スクリプト再帰検索失敗

### 症状
スキルに深くネストされたスクリプトが含まれていますが、プラグインによって見つかりません。

### 可能な原因
1. 再帰深度が 10 層を超えている
2. スクリプトが隠しディレクトリにある（`.` で始まる）
3. スクリプトが依存ディレクトリにある（`node_modules` など）

### 解決策

**再帰検索ルールを理解**：

プラグインがスクリプトを再帰検索する場合：
- 最大深度：10 層
- 隠しディレクトリをスキップ（ディレクトリ名が `.` で始まる）：`.git`、`.vscode` など
- 依存ディレクトリをスキップ：`node_modules`、`__pycache__`、`vendor`、`.venv`、`venv`、`.tox`、`.nox`

**スクリプトの場所を調整**：

スクリプトが深いディレクトリにある場合：
- より浅いディレクトリに移動（`src/lib/utils/tools/` ではなく `tools/`）
- スクリプトの場所へのシンボリックリンクを使用（Unix システム）

```bash
# シンボリックリンクを作成
ln -s ../../../scripts/build.sh tools/build.sh
```

**見つかったスクリプトを一覧表示**：

スキルをロードすると、プラグインはスクリプトリストを返します。スクリプトがリストにない場合、以下を確認します：
1. ファイルに実行権限があるか
2. ディレクトリがスキップルールに一致しているか

---

## まとめ

このレッスンでは、OpenCode Agent Skills プラグイン使用時の 9 種類の一般的な問題を扱いました：

| 問題の種類 | 主な確認ポイント |
|--- | ---|
| スキルが見つからない | 検索パス、SKILL.md 形式、スペル |
| スキルが存在しない | 名前の正確性、優先順位の上書き、ファイルの存在 |
| スクリプト実行失敗 | スクリプトパス、実行権限、スクリプトロジック |
| パスが安全でない | 相対パス、`..` なし、絶対パスなし |
| モデルのロード失敗 | ネットワーク接続、キャッシュクリア、ディレクトリ権限 |
| 解析失敗 | YAML 形式、必須フィールド、スキル内容 |
| 自動推奨が動作しない | 説明の品質、類似度閾値、手動呼び出し |
| コンテキスト圧縮後に動作しない | プラグインバージョン、セッション初期化 |
| スクリプト再帰検索失敗 | 深度制限、ディレクトリスキップルール、実行権限 |

---

## 次のレッスンのプレビュー

> 次のレッスンでは **[セキュリティに関する考慮事項](../security-considerations/)** を学習します。
>
> 学ぶこと：
> - プラグインのセキュリティメカニズムの設計
> - 安全なスキルの書き方
> - パス検証と権限制御の仕組み
> - セキュリティのベストプラクティス

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| スキルクエリの曖昧一致候補 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| スキルが存在しないエラー処理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| スクリプトが存在しないエラー処理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| スクリプト実行失敗エラー処理 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| パスセキュリティチェック | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| SKILL.md 解析エラー処理 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| モデルロード失敗エラー | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| 曖昧一致アルゴリズム | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**重要な定数**：
- `SIMILARITY_THRESHOLD = 0.35`（類似度閾値）：`src/embeddings.ts:10`
- `TOP_K = 5`（最も類似したスキルの返却数）：`src/embeddings.ts:11`

**その他の重要な値**：
- `maxDepth = 10`（スクリプト再帰の最大深度、findScripts 関数のデフォルトパラメータ）：`src/skills.ts:59`
- `0.4`（曖昧一致閾値、findClosestMatch 関数の返却条件）：`src/utils.ts:124`

**重要な関数**：
- `findClosestMatch()`：曖昧一致アルゴリズム、スペル候補の生成に使用
- `isPathSafe()`：パスセキュリティチェック、ディレクトリトラバーサルを防止
- `ensureModel()`：embedding モデルがロードされていることを確認
- `parseSkillFile()`：SKILL.md を解析して形式を検証

</details>
