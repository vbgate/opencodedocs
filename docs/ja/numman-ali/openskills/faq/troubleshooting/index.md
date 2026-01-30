---
title: "トラブルシューティング: OpenSkills の一般的な問題を解決する | openskills"
sidebarTitle: "エラーが発生したらどうするか"
subtitle: "トラブルシューティング: OpenSkills の一般的な問題を解決する"
description: "OpenSkills の一般的なエラーを解決します。このチュートリアルでは、Git clone の失敗、SKILL.md が見つからない、スキルが見つからない、パーミッションエラー、更新のスキップなどの問題を網羅し、詳細なトラブルシューティングの手順と修正方法を提供して、使用中のさまざまな問題を迅速に解決します。"
tags:
  - FAQ
  - トラブルシューティング
  - エラー解決
prerequisite:
  - "start-quick-start"
  - "start-installation"
order: 2
---

# トラブルシューティング：OpenSkills の一般的な問題を解決する

## 学習後にできること

- OpenSkills の使用中の一般的な問題を迅速に診断して修正する
- エラーメッセージの背後にある原因を理解する
- Git クローン、パーミッション、ファイルフォーマットなどの問題をトラブルシューティングする技術を習得する
- スキルを再インストールする必要があるタイミングを知る

## 現在の課題

OpenSkills を使用中にエラーが発生し、どうすればよいか分からない：

```
Error: No SKILL.md files found in repository
```

または git clone が失敗する、パーミッションエラー、ファイルフォーマットが正しくない……これらの問題はすべて、スキルが正常に使用できない原因となることがあります。

## いつこのチュートリアルを参照すべきか

以下の状況に遭遇した場合：

- **インストール失敗**：GitHub またはローカルパスからのインストール時にエラーが発生する
- **読み取り失敗**：`openskills read` でスキルが見つからないというエラーが表示される
- **同期失敗**：`openskills sync` でスキルがない、またはファイルフォーマットエラーが表示される
- **更新失敗**：`openskills update` で一部のスキルがスキップされる
- **パーミッションエラー**：パスアクセスが制限されている、またはセキュリティエラーが表示される

## 基本的なアプローチ

OpenSkills のエラーは主に 4 つのカテゴリに分類されます：

| エラータイプ | 一般的な原因 | 解決のアプローチ |
|--- | --- | ---|
| **Git 関連** | ネットワーク問題、SSH 設定、リポジトリが存在しない | ネットワークを確認、Git 資格情報を設定、リポジトリ URL を検証 |
| **ファイル関連** | SKILL.md が見つからない、フォーマットエラー、パスエラー | ファイルの存在を確認、YAML フォーマットを検証 |
| **パーミッション関連** | ディレクトリパーミッション、パス遍歴、シンボリックリンク | ディレクトリパーミッションを確認、インストールパスを検証 |
| **メタデータ関連** | 更新時にメタデータが失われる、ソースパスが変更される | スキルを再インストールしてメタデータを復元 |

**トラブルシューティングのヒント**：
1. **エラーメッセージを確認する**：赤色の出力には通常、具体的な原因が含まれています
2. **黄色のヒントを確認する**：通常、警告と提案です（例：`Tip: For private repos...`）
3. **ディレクトリ構造を確認する**：`openskills list` でインストール済みスキルを確認する
4. **ソースコードの場所を確認する**：エラーメッセージに検索パス（4つのディレクトリ）が表示されます

---

## インストール失敗

### 問題 1：Git clone が失敗する

**エラーメッセージ**：
```
Failed to clone repository
fatal: repository '...' not found
Tip: For private repos, ensure git SSH keys or credentials are configured
```

**可能な原因**：

| 原因 | シナリオ |
|--- | ---|
| リポジトリが存在しない | owner/repo のスペルミス |
| プライベートリポジトリ | SSH キーまたは Git 資格情報が設定されていない |
| ネットワーク問題 | GitHub にアクセスできない |

**解決方法**：

1. **リポジトリ URL を検証**：
   ```bash
   # ブラウザでリポジトリ URL にアクセスする
   https://github.com/owner/repo
   ```

2. **Git 設定を確認**（プライベートリポジトリ）：
   ```bash
   # SSH 設定を確認
   ssh -T git@github.com

   # Git 資格情報を設定
   git config --global credential.helper store
   ```

3. **クローンをテスト**：
   ```bash
   git clone https://github.com/owner/repo.git
   ```

**期待される結果**：
- リポジトリがローカルディレクトリに正常にクローンされる

---

### 問題 2：SKILL.md が見つからない

**エラーメッセージ**：
```
Error: No SKILL.md files found in repository
Error: No valid SKILL.md files found
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| リポジトリに SKILL.md がない | リポジトリがスキルリポジトリではない |
| SKILL.md に frontmatter がない | YAML メタデータが欠けている |
| SKILL.md のフォーマットエラー | YAML 構文エラー |

**解決方法**：

1. **リポジトリ構造を確認**：
   ```bash
   # リポジトリのルートディレクトリを表示
   ls -la

   # SKILL.md があるか確認
   find . -name "SKILL.md"
   ```

2. **SKILL.md フォーマットを検証**：
   ```markdown
   ---
   name: スキル名
   description: スキルの説明
   ---

   スキルの内容...
   ```

   **必須**：
   - `---` で区切られた YAML frontmatter がある
   - `name` と `description` フィールドが含まれている

3. **公式サンプルを確認**：
   ```bash
   git clone https://github.com/anthropics/skills.git
   cd skills
   ls -la
   ```

**期待される結果**：
- リポジトリに 1 つ以上の `SKILL.md` ファイルが含まれている
- 各 SKILL.md の先頭に YAML frontmatter がある

---

### 問題 3：パスが存在しない、またはディレクトリではない

**エラーメッセージ**：
```
Error: Path does not exist: /path/to/skill
Error: Path must be a directory
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| パスのスペルミス | 間違ったパスを入力した |
| パスがファイルを指している | ディレクトリではなくファイルであるべき |
| パスが展開されていない | `~` を使用する場合は展開が必要 |

**解決方法**：

1. **パスの存在を確認**：
   ```bash
   # パスを確認
   ls -la /path/to/skill

   # ディレクトリかどうかを確認
   file /path/to/skill
   ```

2. **絶対パスを使用**：
   ```bash
   # 絶対パスを取得
   realpath /path/to/skill

   # インストール時に絶対パスを使用
   openskills install /absolute/path/to/skill
   ```

3. **相対パスを使用**：
   ```bash
   # プロジェクトディレクトリ内で
   openskills install ./skills/my-skill
   ```

**期待される結果**：
- パスが存在し、ディレクトリである
- ディレクトリに `SKILL.md` ファイルが含まれている

---

### 問題 4：SKILL.md が無効

**エラーメッセージ**：
```
Error: Invalid SKILL.md (missing YAML frontmatter)
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
|--- | ---|
| 必須フィールドが欠けている | `name` と `description` が必要 |
| YAML 構文エラー | コロン、引用符などのフォーマット問題 |

**解決方法**：

1. **YAML frontmatter を確認**：
   ```markdown
   ---              ← 開始デリミタ
   name: my-skill   ← 必須
   description: スキルの説明  ← 必須
   ---              ← 終了デリミタ
   ```

2. **オンライン YAML 検証ツールを使用**：
   - YAML Lint または同様のツールで構文を検証する

3. **公式サンプルを参照**：
   ```bash
   openskills install anthropics/skills
   cat .claude/skills/*/SKILL.md | head -20
   ```

**期待される結果**：
- SKILL.md の先頭に正しい YAML frontmatter がある
- `name` と `description` フィールドが含まれている

---

### 問題 5：パス遍歴セキュリティエラー

**エラーメッセージ**：
```
Security error: Installation path outside target directory
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| スキル名に `..` が含まれている | ターゲットディレクトリ外のパスにアクセスしようとしている |
| シンボリックリンクが外部を指している | symlink がターゲットディレクトリ外を指している |
| 悪意のあるスキル | スキルがセキュリティ制限を回避しようとしている |

**解決方法**：

1. **スキル名を確認**：
   - スキル名に `..`、`/` などの特殊文字が含まれていないことを確認する

2. **シンボリックリンクを確認**：
   ```bash
   # スキルディレクトリ内のシンボリックリンクを表示
   find .claude/skills/skill-name -type l

   # シンボリックリンクのターゲットを表示
   ls -la .claude/skills/skill-name
   ```

3. **安全なスキルを使用**：
   - 信頼できるソースからのみスキルをインストールする
   - インストール前にスキルコードをレビューする

**期待される結果**：
- スキル名に文字、数字、ハイフンのみが含まれている
- 外部を指すシンボリックリンクがない

---

## 読み取り失敗

### 問題 6：スキルが見つからない

**エラーメッセージ**：
```
Error: Skill(s) not found: my-skill

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| スキルがインストールされていない | いずれのディレクトリにもスキルがインストールされていない |
| スキル名のスペルミス | 名前が一致しない |
| 別の場所にインストールされている | スキルが非標準ディレクトリにインストールされている |

**解決方法**：

1. **インストール済みスキルを表示**：
   ```bash
   openskills list
   ```

2. **スキル名を確認**：
   - `openskills list` の出力と比較する
   - 名前が完全に一致していることを確認する（大文字小文字を区別）

3. **欠けているスキルをインストール**：
   ```bash
   openskills install owner/repo
   ```

4. **すべてのディレクトリを検索**：
   ```bash
   # 4 つのスキルディレクトリを確認
   ls -la .agent/skills/
   ls -la ~/.agent/skills/
   ls -la .claude/skills/
   ls -la ~/.claude/skills/
   ```

**期待される結果**：
- `openskills list` にターゲットスキルが表示される
- スキルが 4 つのディレクトリのいずれかに存在する

---

### 問題 7：スキル名が提供されていない

**エラーメッセージ**：
```
Error: No skill names provided
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| 引数の指定忘れ | `openskills read` の後に引数がない |
| 空文字列 | 空文字列を渡した |

**解決方法**：

1. **スキル名を提供**：
   ```bash
   # 単一のスキル
   openskills read my-skill

   # 複数のスキル（カンマ区切り）
   openskills read skill1,skill2,skill3
   ```

2. **まず利用可能なスキルを確認**：
   ```bash
   openskills list
   ```

**期待される結果**：
- スキルの内容が標準出力に正常に読み込まれる

---

## 同期失敗

### 問題 8：出力ファイルが Markdown ではない

**エラーメッセージ**：
```
Error: Output file must be a markdown file (.md)
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| 出力ファイルが .md ではない | .txt、.json などのフォーマットが指定されている |
| --output パラメータエラー | パスが .md で終わっていない |

**解決方法**：

1. **.md ファイルを使用**：
   ```bash
   # 正しい
   openskills sync -o AGENTS.md
   openskills sync -o custom.md

   # 間違い
   openskills sync -o AGENTS.txt
   openskills sync -o AGENTS
   ```

2. **カスタム出力パス**：
   ```bash
   # サブディレクトリに出力
   openskills sync -o .ruler/AGENTS.md
   openskills sync -o docs/agents.md
   ```

**期待される結果**：
- .md ファイルが正常に生成される
- ファイルにスキルの XML 部分が含まれている

---

### 問題 9：スキルがインストールされていない

**エラーメッセージ**：
```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| スキルをインストールしていない | OpenSkills を初めて使用する |
| スキルディレクトリを削除した | スキルファイルを手動で削除した |

**解決方法**：

1. **スキルをインストール**：
   ```bash
   # 公式スキルをインストール
   openskills install anthropics/skills

   # 他のリポジトリからインストール
   openskills install owner/repo
   ```

2. **インストールを検証**：
   ```bash
   openskills list
   ```

**期待される結果**：
- `openskills list` に少なくとも 1 つのスキルが表示される
- 同期が成功する

---

## 更新失敗

### 問題 10：ソースメタデータがない

**エラーメッセージ**：
```
Skipped: my-skill (no source metadata; re-install once to enable updates)
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| 古いバージョンでインストールされた | メタデータ機能の前にスキルがインストールされた |
| 手動でコピーされた | スキルディレクトリを直接コピーし、OpenSkills 経由でインストールしていない |
| メタデータファイルが破損している | `.openskills.json` が破損または失われている |

**解決方法**：

1. **スキルを再インストール**：
   ```bash
   # 古いスキルを削除
   openskills remove my-skill

   # 再インストール
   openskills install owner/repo
   ```

2. **メタデータファイルを確認**：
   ```bash
   # スキルメタデータを表示
   cat .claude/skills/my-skill/.openskills.json
   ```

3. **スキルを保持してメタデータを追加**：
   - `.openskills.json` を手動で作成する（推奨しない）
   - 再インストールの方が簡単で信頼性が高い

**期待される結果**：
- 更新が成功し、スキップ警告がない

---

### 問題 11：ローカルソースが見つからない

**エラーメッセージ**：
```
Skipped: my-skill (local source missing)
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| ローカルパスが移動された | ソースディレクトリの場所が変更された |
| ローカルパスが削除された | ソースディレクトリが存在しない |
| パスが展開されていない | `~` を使用しているが、メタデータには展開されたパスが格納されている |

**解決方法**：

1. **メタデータ内のローカルパスを確認**：
   ```bash
   cat .claude/skills/my-skill/.openskills.json
   ```

2. **ソースディレクトリを復元またはメタデータを更新**：
   ```bash
   # ソースディレクトリが移動された場合
   openskills remove my-skill
   openskills install /new/path/to/skill

   # またはメタデータを手動で編集（推奨しない）
   vi .claude/skills/my-skill/.openskills.json
   ```

**期待される結果**：
- ローカルソースパスが存在し、`SKILL.md` が含まれている

---

### 問題 12：リポジトリ内に SKILL.md が見つからない

**エラーメッセージ**：
```
SKILL.md missing for my-skill
Skipped: my-skill (SKILL.md not found in repo at subpath)
```

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| リポジトリ構造が変更された | スキルのサブパスまたは名前が変更された |
| スキルが削除された | リポジトリにスキルが含まれていない |
| サブパスエラー | メタデータに記録されたサブパスが正しくない |

**解決方法**：

1. **リポジトリにアクセスして構造を確認**：
   ```bash
   # リポジトリをクローンして確認
   git clone https://github.com/owner/repo.git
   cd repo
   ls -la
   find . -name "SKILL.md"
   ```

2. **スキルを再インストール**：
   ```bash
   openskills remove my-skill
   openskills install owner/repo/subpath
   ```

3. **リポジトリの更新履歴を確認**：
   - GitHub でリポジトリのコミット履歴を確認する
   - スキルの移動または削除の記録を探す

**期待される結果**：
- 更新が成功する
- SKILL.md が記録されたサブパスに存在する

---

## パーミッション問題

### 問題 13：ディレクトリパーミッションが制限されている

**現象**：

| 操作 | 現象 |
|--- | ---|
| インストール失敗 | パーミッションエラーが表示される |
| 削除失敗 | ファイルを削除できないというエラーが表示される |
| 読み取り失敗 | ファイルアクセスが制限されているというエラーが表示される |

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| ディレクトリパーミッションが不足している | ユーザーに書き込み権限がない |
| ファイルパーミッションが不足している | ファイルが読み取り専用 |
| システム保護 | macOS SIP、Windows UAC による制限 |

**解決方法**：

1. **ディレクトリパーミッションを確認**：
   ```bash
   # パーミッションを表示
   ls -la .claude/skills/

   # パーミッションを変更（慎重に使用）
   chmod -R 755 .claude/skills/
   ```

2. **sudo を使用（推奨しない）**：
   ```bash
   # 最後の手段
   sudo openskills install owner/repo
   ```

3. **システム保護を確認**：
   ```bash
   # macOS：SIP ステータスを確認
   csrutil status

   # SIP を無効にする必要がある場合（リカバリモードが必要）
   # 推奨しない、必要な場合のみ使用
   ```

**期待される結果**：
- ディレクトリとファイルを正常に読み書きできる

---

## シンボリックリンク問題

### 問題 14：シンボリックリンクが破損している

**現象**：

| 現象 | 説明 |
|--- | ---|
| リスト時にスキルがスキップされる | `openskills list` にスキルが表示されない |
| 読み取り失敗 | ファイルが存在しないというエラーが表示される |
| 更新失敗 | ソースパスが無効 |

**可能な原因**：

| 原因 | 説明 |
|--- | ---|
| ターゲットディレクトリが削除された | シンボリックリンクが存在しないパスを指している |
| シンボリックリンクが破損している | リンクファイル自体が破損している |
| デバイス間リンク | 一部のシステムはデバイス間のシンボリックリンクをサポートしていない |

**解決方法**：

1. **シンボリックリンクを確認**：
   ```bash
   # すべてのシンボリックリンクを検索
   find .claude/skills -type l

   # リンクのターゲットを表示
   ls -la .claude/skills/my-skill

   # リンクをテスト
   readlink .claude/skills/my-skill
   ```

2. **破損したシンボリックリンクを削除**：
   ```bash
   openskills remove my-skill
   ```

3. **再インストール**：
   ```bash
   openskills install owner/repo
   ```

**期待される結果**：
- 破損したシンボリックリンクがない
- スキルが正常に表示され、読み取れる

---

## 注意すべき点

::: warning 一般的なエラー操作

**❌ しないでください**：

- **スキルディレクトリを直接コピーする** → メタデータが欠如し、更新が失敗する
- **`.openskills.json` を手動で編集する** → フォーマットを破壊しやすく、更新が失敗する
- **sudo を使用してスキルをインストールする** → root 所有のファイルが作成され、以降の操作で sudo が必要になる可能性がある
- **`.openskills.json` を削除する** → 更新時にスキルがスキップされる

**✅ すべきこと**：

- `openskills install` 経由でインストールする → メタデータが自動的に作成される
- `openskills remove` 経由で削除する → ファイルが正しくクリーンアップされる
- `openskills update` 経由で更新する → ソースから自動的にリフレッシュされる
- `openskills list` 経由で確認する → スキルのステータスを確認する

:::

::: tip トラブルシューティングのヒント

1. **単純から始める**：まず `openskills list` を実行してステータスを確認する
2. **完全なエラーメッセージを確認する**：黄色のヒントには通常、解決策の提案が含まれている
3. **ディレクトリ構造を確認する**：`ls -la` でファイルとパーミッションを確認する
4. **ソースコードの場所を検証する**：エラーメッセージに 4 つの検索ディレクトリが表示される
5. **-y でインタラクティブをスキップ**：CI/CD またはスクリプトで `-y` フラグを使用する

:::

---

## まとめ

このレッスンでは、OpenSkills の一般的な問題をトラブルシューティングして修正する方法を学びました：

| 問題タイプ | 主な解決方法 |
|--- | ---|
| Git clone が失敗する | ネットワークを確認、資格情報を設定、リポジトリ URL を検証 |
| SKILL.md が見つからない | リポジトリ構造を確認、YAML フォーマットを検証 |
| 読み取り失敗 | `openskills list` でスキルステータスを確認 |
| 更新失敗 | スキルを再インストールしてメタデータを復元 |
| パーミッション問題 | ディレクトリパーミッションを確認、sudo の使用を回避 |

**覚えておいてください**：
- エラーメッセージには通常、明確なヒントが含まれています
- 再インストールはメタデータ問題を解決する最も簡単な方法です
- 信頼できるソースからのみスキルをインストールしてください

## 次のステップ

- **[よくある質問 (FAQ)](../faq/) を確認する** → 他の疑問に対する回答
- **[ベストプラクティス](../../advanced/best-practices/) を学ぶ** → 一般的なエラーを回避する
- **[セキュリティの説明](../../advanced/security/) を探索する** → セキュリティメカニズムを理解する

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-24

| 機能                | ファイルパス                                                                                   | 行号     |
|--- | --- | ---|
| Git clone 失敗の処理   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L162-L168) | 162-168  |
| パスが存在しないエラー       | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L205-L207) | 205-207  |
| ディレクトリではないエラー         | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L210-L213) | 210-213  |
| SKILL.md が無効       | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L241-L243) | 241-243  |
| パス遍歴セキュリティエラー     | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L256-L259) | 256-259  |
| SKILL.md が見つからない     | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L378-L380) | 378-380  |
| スキル名が提供されていない         | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L10-L12)        | 10-12    |
| スキルが見つからない           | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L26-L34)        | 26-34    |
| 出力ファイルが Markdown ではない | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L23-L25)        | 23-25    |
| スキルがインストールされていない           | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L40-L43)        | 40-43    |
| ソースメタデータなしでスキップ       | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L57-L61)      | 57-61    |
| ローカルソースが見つからない           | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L66-L71)      | 66-71    |
| リポジトリ内に SKILL.md が見つからない | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L102-L107)     | 102-107  |

**主要な関数**：
- `hasValidFrontmatter(content)`: SKILL.md に有効な YAML frontmatter があるか検証
- `isPathInside(targetPath, targetDir)`: パスがターゲットディレクトリ内にあるか検証（セキュリティチェック）
- `findSkill(name)`: 4 つのディレクトリを優先度順にスキルを検索
- `readSkillMetadata(path)`: スキルのインストールソースメタデータを読み取り

**主要な定数**：
- 検索ディレクトリの順序（`src/utils/skills.ts`）：
  1. `.agent/skills/` (project universal)
  2. `~/.agent/skills/` (global universal)
  3. `.claude/skills/` (project)
  4. `~/.claude/skills/` (global)

</details>
