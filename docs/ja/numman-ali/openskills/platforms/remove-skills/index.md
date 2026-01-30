---
title: "スキルの削除: インタラクティブおよびスクリプトによる削除 | openskills"
sidebarTitle: "古いスキルの安全な削除"
subtitle: "スキルの削除: インタラクティブおよびスクリプトによる削除"
description: "OpenSkillsの2つのスキル削除方法を学びます：インタラクティブなmanageとスクリプト化されたremove。使用シーン、位置確認、よくある問題のトラブルシューティングを含めて、スキルライブラリを安全に整理します。"
tags:
  - "スキル管理"
  - "コマンド使用"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
  - "platforms-list-skills"
order: 6
---

# スキルの削除

## 学習後の成果

- `openskills manage` を使用して、インタラクティブに複数のスキルを削除する
- `openskills remove` を使用して、スクリプト化して特定のスキルを削除する
- 2つの削除方法の使用シーンを理解する
- 削除対象が project か global かを確認する
- 不要になったスキルを安全に整理する

## 現状の課題

スキルのインストールが増えるにつれて、以下のような問題に遭遇するかもしれません：

- "いくつかのスキルはもう使わないので、削除したいが、一つずつ削除するのは面倒"
- "スクリプトでスキルを自動削除したいが、manage コマンドはインタラクティブな選択が必要"
- "スキルが project にインストールされているのか global にインストールされているのか分からず、削除前に確認したい"
- "複数のスキルを削除する際、まだ使用しているものを誤って削除するのではないかと心配"

OpenSkills では、これらの問題を解決するために2つの削除方法を提供しています：**インタラクティブな manage**（複数のスキルを手動選択するのに適している）と **スクリプト化された remove**（単一のスキルを正確に削除するのに適している）。

## この方法を使用するタイミング

| シーン | 推奨方法 | コマンド |
|------|----------|---------|
| 複数のスキルを手動削除する | インタラクティブ選択 | `openskills manage` |
| スクリプトまたは CI/CD による自動削除 | 正確にスキル名を指定 | `openskills remove <name>` |
| スキル名が分かっていて、迅速に削除したい | 直接削除 | `openskills remove <name>` |
| 削除可能なスキルを確認したい | 先にリスト表示してから削除 | `openskills list` → `openskills manage` |

## 中核となる考え方

OpenSkills の 2 つの削除方法は、異なるシーンに適用されます：

### インタラクティブ削除：`openskills manage`

- **特徴**：すべてのインストール済みスキルを表示し、削除するものをチェックできる
- **適用**：スキルライブラリの手動管理、複数のスキルを一度に削除する
- **利点**：誤って削除するリスクがない、すべてのオプションを事前に確認できる
- **デフォルト動作**：**いずれのスキルも選択されていない**（誤削除を防ぐため）

### スクリプト化削除：`openskills remove <name>`

- **特徴**：指定されたスキルを直接削除する
- **適用**：スクリプト、自動化、正確な削除
- **利点**：高速、インタラクション不要
- **リスク**：スキル名を間違えるとエラーが発生し、他のスキルは誤って削除されない

### 削除の仕組み

どちらの方法も、**スキルディレクトリ全体**（SKILL.md、references/、scripts/、assets/ などすべてのファイルを含む）を削除し、残留物を残しません。

::: tip 削除は元に戻せません
スキルの削除は、スキルディレクトリ全体を削除するため、元に戻すことはできません。削除前に、スキルがもう不要であることを確認するか、必要に応じて再インストールしてください。
:::

## 手順に沿って実践

### ステップ 1：複数のスキルをインタラクティブに削除する

**理由**
複数のスキルを削除する必要がある場合、インタラクティブな選択の方がより安全で直感的です

以下のコマンドを実行します：

```bash
npx openskills manage
```

**確認すべき出力**

まず、すべてのインストール済みスキルのリスト（project/global でソート）が表示されます：

```
? Select skills to remove:
❯◯ pdf                         (project)
 ◯ code-analyzer                (project)
 ◯ email-reader                 (global)
 ◯ git-tools                    (global)
```

- **青** `(project)`：プロジェクトレベルのスキル
- **グレー** `(global)`：グローバルレベルのスキル
- **スペース**：チェック/チェック解除
- **Enter**：削除を確認

`pdf` と `git-tools` をチェックして Enter キーを押したとします：

**確認すべき出力**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info デフォルトで選択されていない
manage コマンドは、誤削除を防ぐため、デフォルトで**いずれのスキルも選択されていません**。削除するスキルをスペースキーで手動でチェックする必要があります。
:::

### ステップ 2：単一のスキルをスクリプト化して削除する

**理由**
スキル名がわかっている場合に、迅速に削除したい場合

以下のコマンドを実行します：

```bash
npx openskills remove pdf
```

**確認すべき出力**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

スキルが存在しない場合：

```
Error: Skill 'pdf' not found
```

プログラムはエラーコード 1 で終了します（スクリプトでの判定に適しています）。

### ステップ 3：削除位置を確認する

**理由**
削除前にスキルの位置（project と global）を確認し、誤削除を防ぐため

スキルを削除するとき、コマンドは削除位置を表示します：

```bash
# スクリプト化された削除では詳細な位置が表示されます
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# インタラクティブな削除でも、各スキルの位置が表示されます
npx openskills manage
# チェックして Enter を押す
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**判定ルール**：
- パスに現在のプロジェクトディレクトリが含まれている場合 → `(project)`
- パスに home ディレクトリが含まれている場合 → `(global)`

### ステップ 4：削除後の検証

**理由**
削除が成功したことを確認し、見落としを防ぐ

スキルを削除した後、list コマンドで検証します：

```bash
npx openskills list
```

**確認すべき出力**

削除したスキルがリストに表示されなくなります。

## チェックポイント ✅

以下を確認してください：

- [ ] `openskills manage` の実行で、すべてのスキルリストが表示される
- [ ] スペースキーでスキルのチェック/チェック解除ができる
- [ ] デフォルトでいずれのスキルも選択されていない（誤削除防止）
- [ ] `openskills remove <name>` の実行で、指定したスキルが削除される
- [ ] 削除時に project か global かが表示される
- [ ] 削除後に `openskills list` でスキルが消えていることを確認できる

## よくある問題と解決方法

### よくある問題 1：まだ使用しているスキルを誤って削除した

**現象**：削除後にスキルがまだ必要だったことに気づく

**解決方法**：

再インストールすればOKです：

```bash
# GitHub からインストールした場合
npx openskills install anthropics/skills

# ローカルパスからインストールした場合
npx openskills install ./path/to/skill
```

OpenSkills はインストール元を記録します（`.openskills.json` ファイル内）、再インストール時に元のパス情報を失うことはありません。

### よくある問題 2：manage コマンドが "No skills installed" と表示される

**現象**：`openskills manage` を実行すると、スキルがインストールされていないと表示される

**原因**：現在のディレクトリにスキルが存在しない

**調査手順**：

1. 正しいプロジェクトディレクトリにいるか確認する
2. グローバルスキルがインストールされているか確認する（`openskills list --global`）
3. スキルをインストールしたディレクトリに移動して再試行する

```bash
# プロジェクトディレクトリに移動
cd /path/to/your/project

# 再試行
npx openskills manage
```

### よくある問題 3：remove コマンドが "Skill not found" エラーを返す

**現象**：`openskills remove <name>` を実行すると、スキルが見つからないと表示される

**原因**：スキル名のスペルミス、またはスキルが既に削除されている

**調査手順**：

1. まず list コマンドで正しいスキル名を確認する：

```bash
npx openskills list
```

2. スキル名のスペルを確認する（大文字小文字とハイフンに注意）

3. スキルが project か global かを確認する（異なるディレクトリで検索）

```bash
# プロジェクトスキルを確認
ls -la .claude/skills/

# グローバルスキルを確認
ls -la ~/.claude/skills/
```

### よくある問題 4：削除後にスキルが AGENTS.md に残っている

**現象**：スキルを削除しても、AGENTS.md にそのスキルの参照が残っている

**原因**：スキルの削除は AGENTS.md を自動更新しない

**解決方法**：

sync コマンドを再実行する：

```bash
npx openskills sync
```

sync はインストール済みのスキルを再スキャンし、AGENTS.md を更新します。削除したスキルは自動的にリストから削除されます。

## レッスンのまとめ

OpenSkills は2つのスキル削除方法を提供しています：

### インタラクティブ削除：`openskills manage`

- 🎯 **適用シーン**：スキルライブラリの手動管理、複数のスキルを削除する
- ✅ **利点**：直感的、誤削除がない、プレビュー可能
- ⚠️ **注意**：デフォルトでいずれのスキルも選択されていない、手動でチェックする必要がある

### スクリプト化削除：`openskills remove <name>`

- 🎯 **適用シーン**：スクリプト、自動化、正確な削除
- ✅ **利点**：高速、インタラクション不要
- ⚠️ **注意**：スキル名を間違えるとエラーが発生する

**中核となるポイント**：

1. どちらの方法も、スキルディレクトリ全体を削除する（元に戻せない）
2. 削除時に project か global かが表示される
3. 削除後は `openskills list` で検証する
4. `openskills sync` を再実行して AGENTS.md を更新することを忘れない

## 次のレッスン予告

> 次のレッスンでは、**[Universal モード：マルチエージェント環境](../../advanced/universal-mode/)** を学習します。
>
> 学習内容：
> - `--universal` フラグを使用して Claude Code との競合を回避する方法
> - マルチエージェント環境での統一スキル管理
> - `.agent/skills` ディレクトリの役割

---

## 付録：ソースコード参照

<details>
<summary><strong>ソースコードの位置を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
|------|-------------|--------|
| manage コマンドの実装 | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62 |
| remove コマンドの実装 | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21 |
| すべてのスキルを検索 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| 指定したスキルを検索 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90 |

**重要な関数**：
- `manageSkills()`：インタラクティブなスキル削除、inquirer checkbox を使用してユーザーに選択させる
- `removeSkill(skillName)`：スクリプト化された指定スキルの削除、見つからない場合はエラーで終了
- `findAllSkills()`：4 つの検索ディレクトリを走査し、すべてのスキルを収集
- `findSkill(skillName)`：指定したスキルを検索し、Skill オブジェクトを返す

**重要な定数**：
- なし（すべてのパスと設定は動的に計算される）

**中核となるロジック**：

1. **manage コマンド**（src/commands/manage.ts）：
   - `findAllSkills()` を呼び出してすべてのスキルを取得（第 11 行）
   - project/global でソート（第 20-25 行）
   - inquirer `checkbox` を使用してユーザーに選択させる（第 33-37 行）
   - デフォルトで `checked: false`、いずれのスキルも選択されていない（第 30 行）
   - 選択したスキルを順に処理し、`rmSync` で削除（第 45-52 行）

2. **remove コマンド**（src/commands/remove.ts）：
   - `findSkill(skillName)` を呼び出してスキルを検索（第 9 行）
   - 見つからない場合、エラーを出力し `process.exit(1)`（第 12-14 行）
   - `rmSync` を呼び出してスキルディレクトリ全体を削除（第 16 行）
   - `homedir()` で project か global かを判定（第 18 行）

3. **削除操作**：
   - `rmSync(baseDir, { recursive: true, force: true })` を使用してスキルディレクトリ全体を削除
   - `recursive: true`：すべての子ファイルと子ディレクトリを再帰的に削除
   - `force: true`：ファイルが存在しないエラーを無視

</details>
