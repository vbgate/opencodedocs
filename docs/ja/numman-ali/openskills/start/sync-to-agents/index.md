---
title: "スキル同期: AGENTS.md の生成 | openskills"
sidebarTitle: "AI にスキルを知らせる"
subtitle: "スキル同期: AGENTS.md の生成"
description: "openskills sync コマンドを使用して AGENTS.md ファイルを生成し、AI エージェント（Claude Code、Cursor）がインストールされたスキルを理解できるようにする方法を学びます。スキルの選択と同期のテクニックをマスターし、AI コンテキストの使用を最適化します。"
tags:
  - "入門チュートリアル"
  - "スキル同期"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: 5
---

# スキルを AGENTS.md に同期する

## 学習完了後できること

- `openskills sync` を使用して AGENTS.md ファイルを生成する
- AI エージェントが AGENTS.md を通じて利用可能なスキルをどのように認識するかを理解する
- 同期するスキルを選択し、AI コンテキストのサイズを制御する
- カスタム出力パスを使用して既存のドキュメントに統合する
- AGENTS.md の XML 形式と使用方法を理解する

::: info 前提知識

このチュートリアルは、[最初のスキルのインストール](../first-skill/)を完了していることを前提としています。まだスキルをインストールしていない場合は、先にインストール手順を完了してください。

:::

---

## 現在の悩み

既にいくつかのスキルをインストールしているかもしれませんが：

- **AI エージェントが利用可能なスキルを知らない**：スキルはインストールされていますが、AI エージェント（Claude Code など）はその存在を全く知りません
- **AI にスキルを知らせる方法がわからない**：`AGENTS.md` について聞いたことがあるかもしれませんが、それが何か、どう生成するかわかりません
- **スキルが多すぎてコンテキストを占有するのを心配している**：多くのスキルをインストールしたが、選択的に同期し、すべてを一度に AI に知らせたくありません

これらの問題の根本原因は：**スキルのインストールとスキルの利用可能性は別物です**。インストールはファイルを配置するだけで済みますが、AI に知らせるには AGENTS.md に同期する必要があります。

---

## いつこの方法を使うか

**スキルを AGENTS.md に同期する**は、次のようなシナリオに適しています：

- スキルのインストールを完了し、AI エージェントにそれらの存在を知らせたい場合
- 新しいスキルを追加した後、AI の利用可能なスキルリストを更新する場合
- スキルを削除した後、AGENTS.md から削除する場合
- スキルを選択的に同期し、AI のコンテキストサイズを制御したい場合
- 複数のエージェント環境で、統一されたスキルリストが必要な場合

::: tip 推奨される方法

スキルをインストール、更新、削除するたびに `openskills sync` を実行し、AGENTS.md と実際のスキルを常に一致させてください。

:::

---

## 🎒 開始前の準備

開始する前に、以下を確認してください：

- [ ] [少なくとも 1 つのスキルのインストール](../first-skill/)が完了している
- [ ] プロジェクトディレクトリに移動している
- [ ] スキルのインストール場所（project または global）を理解している

::: warning 事前チェック

まだスキルをインストールしていない場合は、先に実行してください：

```bash
npx openskills install anthropics/skills
```

:::

---

## コアの考え方：スキルのインストール ≠ AI が使用可能

OpenSkills のスキル管理は 2 つの段階に分かれています：

```
[インストール段階]            [同期段階]
スキル → .claude/skills/  →  AGENTS.md
   ↓                        ↓
ファイルが存在            AI エージェントが読み取り
   ↓                        ↓
ローカルで使用可能      AI が認識し呼び出し可能
```

**重要ポイント**：

1. **インストール段階**：`openskills install` を使用し、スキルが `.claude/skills/` ディレクトリにコピーされます
2. **同期段階**：`openskills sync` を使用し、スキル情報が `AGENTS.md` に書き込まれます
3. **AI が読み取り**：AI エージェントが `AGENTS.md` を読み取り、どのスキルが利用可能かを知ります
4. **オンデマンドでロード**：AI はタスクの必要性に応じて `openskills read <skill>` を使用して具体的なスキルをロードします

**なぜ AGENTS.md が必要なのか？**

AI エージェント（Claude Code、Cursor など）はファイルシステムを積極的にスキャンしません。それらには、使用できるツールを伝える明確な「スキルリスト」が必要です。このリストが `AGENTS.md` です。

---

## 実践しよう

### ステップ 1：プロジェクトディレクトリに移動

まず、スキルをインストールしたプロジェクトディレクトリに移動します：

```bash
cd /path/to/your/project
```

**なぜ**

`openskills sync` はデフォルトで現在のディレクトリでインストールされたスキルを検索し、現在のディレクトリに `AGENTS.md` を生成または更新します。

**確認すべきこと**：

プロジェクトディレクトリには `.claude/skills/` ディレクトリが含まれているはずです（スキルをインストールした場合）：

```bash
ls -la
# 出力例：
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r--  1 user  staff  package.json
```

---

### ステップ 2：スキルを同期する

次のコマンドを使用して、インストールされたスキルを AGENTS.md に同期します：

```bash
npx openskills sync
```

**なぜ**

`sync` コマンドはすべてのインストールされたスキルを検索し、XML 形式のスキルリストを生成して `AGENTS.md` ファイルに書き込みます。

**確認すべきこと**：

コマンドはインタラクティブな選択画面を起動します：

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◉ check-branch-first          (global)   Git workflow: Always check current branch...

<Space> 選択  <a> 全選択  <i> 反転選択  <Enter> 確認
```

**操作ガイド**：

```
┌─────────────────────────────────────────────────────────────┐
│  操作説明                                                    │
│                                                             │
│  ステップ 1        ステップ 2         ステップ 3            │
│  カーソル移動   →   Space で選択   →   Enter で確認        │
│                                                             │
│  ○ 未選択           ◉ 選択済み                             │
│                                                             │
│  (project)         プロジェクトスキル、青色ハイライト           │
│  (global)          グローバルスキル、グレー表示               │
└─────────────────────────────────────────────────────────────┘

確認すべきこと：
- カーソルを上下に移動できる
- Space キーで選択状態を切り替える（○ ↔ ◉）
- プロジェクトスキルは青色で表示、グローバルスキルはグレーで表示
- Enter で同期を確認
```

::: tip スマートな事前選択

初めて同期する場合、ツールはデフォルトですべての**プロジェクトスキル**を選択します。既存の AGENTS.md を更新する場合、ツールは**ファイル内で有効になっているスキル**を事前に選択します。

:::

---

### ステップ 3：スキルを選択する

インタラクティブな画面で、AI エージェントに知らせたいスキルを選択します。

**例**：

すべてのインストールされたスキルを同期したいとします：

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← このグローバルスキルは選択しない
```

操作：
1. **カーソル移動**：上下矢印キーを使用して移動
2. **選択/選択解除**：**Space キー**を押して選択状態を切り替える（`○` ↔ `◉`）
3. **同期を確認**：**Enter キー**を押して同期を開始

**確認すべきこと**：

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip 選択戦略

- **プロジェクトスキル**：現在のプロジェクト専用のスキル、同期を推奨
- **グローバルスキル**：汎用スキル（コーディング規約など）、必要に応じて同期
- **過度な追加を避ける**：スキルが多すぎると AI コンテキストを占有するため、よく使用するスキルのみを同期することをお勧めします

:::

---

### ステップ 4：AGENTS.md を表示する

同期が完了したら、生成された AGENTS.md ファイルを表示します：

```bash
cat AGENTS.md
```

**確認すべきこと**：

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**重要要素の説明**：

| 要素 | 役割 |
|--- | ---|
| `<skills_system>` | XML タグ、AI にこれがスキルシステム定義であることを伝えます |
| `<usage>` | 使用説明、AI がスキルを呼び出す方法を伝えます |
| `<available_skills>` | 利用可能なスキルリスト |
| `<skill>` | 単一のスキル定義 |
| `<name>` | スキル名 |
| `<description>` | スキルの説明 |
| `<location>` | スキルの場所 |

::: info なぜ XML 形式を使用するのか？

XML 形式は AI エージェント（特に Claude Code）の標準形式であり、解析と理解が容易です。ツールは HTML コメント形式も代替としてサポートしています。

:::

---

### ステップ 5：AI が読み取れるか確認する

次に、AI エージェントに AGENTS.md を読み取らせ、利用可能なスキルを認識しているか確認します。

**対話例**：

```
ユーザー：
PDF ファイルから表データを抽出したい

AI エージェント：
`pdf` スキルを使用して表データを抽出できます。まず、このスキルの詳細内容を読み込みます。

AI が実行：
npx openskills read pdf

出力：
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[PDF スキルの詳細内容...]

AI：
OK、PDF スキルをロードしました。これで表データを抽出できます...
```

**確認すべきこと**：

- AI エージェントが `pdf` スキルを使用できると認識する
- AI が自動的に `npx openskills read pdf` を実行してスキル内容をロードする
- AI がスキルの指示に従ってタスクを実行する

---

### ステップ 6（オプション）：カスタム出力パス

スキルを他のファイル（`.ruler/AGENTS.md` など）に同期したい場合は、`-o` または `--output` オプションを使用します：

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**なぜ**

一部のツール（Windsurf など）は AGENTS.md が特定のディレクトリにあることを期待する場合があります。`-o` を使用すると、出力パスを柔軟にカスタマイズできます。

**確認すべきこと**：

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip 非インタラクティブ同期

CI/CD 環境では、`-y` または `--yes` フラグを使用してインタラクティブな選択をスキップし、すべてのスキルを同期できます：

```bash
npx openskills sync -y
```

:::

---

## チェックポイント ✅

上記のステップを完了したら、以下を確認してください：

- [ ] コマンドラインにインタラクティブな選択画面が表示された
- [ ] 少なくとも 1 つのスキルが正常に選択された（前に `◉` が表示されている）
- [ ] 同期が成功し、`✅ Synced X skill(s) to AGENTS.md` メッセージが表示された
- [ ] `AGENTS.md` ファイルが作成または更新された
- [ ] ファイルに `<skills_system>` XML タグが含まれている
- [ ] ファイルに `<available_skills>` スキルリストが含まれている
- [ ] 各 `<skill>` に `<name>`、`<description>`、`<location>` が含まれている

これらのチェック項目がすべて通過した場合、おめでとうございます！スキルは AGENTS.md に正常に同期され、AI エージェントはこれらのスキルを認識して使用できるようになりました。

---

## よくある落とし穴

### 問題 1：スキルが見つからない

**現象**：

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**原因**：

- 現在のディレクトリまたはグローバルディレクトリにスキルがインストールされていない

**解決方法**：

1. スキルがインストールされているか確認：

```bash
npx openskills list
```

2. されていない場合、先にスキルをインストール：

```bash
npx openskills install anthropics/skills
```

---

### 問題 2：AGENTS.md が更新されない

**現象**：

`openskills sync` を実行した後、AGENTS.md の内容が変更されない。

**原因**：

- `-y` フラグを使用したが、スキルリストが以前と同じである
- AGENTS.md が既に存在し、同じスキルを同期している

**解決方法**：

1. `-y` フラグを使用しているか確認：

```bash
# -y を削除し、インタラクティブモードで再選択
npx openskills sync
```

2. 現在のディレクトリが正しいか確認：

```bash
# スキルをインストールしたプロジェクトディレクトリであることを確認
pwd
ls .claude/skills/
```

---

### 問題 3：AI エージェントがスキルを認識しない

**現象**：

AGENTS.md が生成されたが、AI エージェントは依然としてスキルが利用可能であることを認識していない。

**原因**：

- AI エージェントが AGENTS.md を読み取っていない
- AGENTS.md の形式が正しくない
- AI エージェントがスキルシステムをサポートしていない

**解決方法**：

1. AGENTS.md がプロジェクトルートディレクトリにあることを確認
2. AGENTS.md の形式が正しいか確認（`<skills_system>` タグが含まれているか）
3. AI エージェントが AGENTS.md をサポートしているか確認（Claude Code はサポート、他のツールでは設定が必要な場合があります）

---

### 問題 4：出力ファイルが markdown ではない

**現象**：

```
Error: Output file must be a markdown file (.md)
```

**原因**：

- `-o` オプションを使用したが、指定したファイルが `.md` 拡張子ではない

**解決方法**：

1. 出力ファイルが `.md` で終わっていることを確認

```bash
# ❌ 間違い
npx openskills sync -o skills.txt

# ✅ 正しい
npx openskills sync -o skills.md
```

---

### 問題 5：すべての選択を解除した

**現象**：

インタラクティブな画面ですべてのスキルの選択を解除すると、AGENTS.md のスキルセクションが削除される。

**原因**：

これは正常な動作です。すべてのスキルを選択解除すると、ツールは AGENTS.md からスキルセクションを削除します。

**解決方法**：

誤操作の場合は、`openskills sync` を再実行し、同期するスキルを選択してください。

---

## まとめ

このレッスンでは、以下を学びました：

- **`openskills sync` を使用して** AGENTS.md ファイルを生成する
- **スキル同期のプロセスを理解する**：インストール → 同期 → AI 読み取り → オンデマンドロード
- **インタラクティブにスキルを選択し**、AI コンテキストサイズを制御する
- **カスタム出力パスを使用し**、既存のドキュメントシステムに統合する
- **AGENTS.md 形式を理解し**、`<skills_system>` XML タグとスキルリストを含める

**主要コマンド**：

| コマンド | 役割 |
|--- | ---|
| `npx openskills sync` | スキルをインタラクティブに AGENTS.md に同期 |
| `npx openskills sync -y` | すべてのスキルを非インタラクティブに同期 |
| `npx openskills sync -o custom.md` | カスタムファイルに同期 |
| `cat AGENTS.md` | 生成された AGENTS.md の内容を表示 |

**AGENTS.md 形式の要点**：

- `<skills_system>` XML タグで囲む
- `<usage>` 使用説明を含む
- `<available_skills>` スキルリストを含む
- 各 `<skill>` に `<name>`、`<description>`、`<location>` を含む

---

## 次のレッスンの予告

> 次のレッスンでは **[スキルを使用する](../read-skills/)** 方法を学びます。
>
> 学べること：
> - AI エージェントが `openskills read` コマンドを使用してスキルをロードする方法
> - スキルの完全なロードプロセス
> - 複数のスキルを読み取る方法
> - スキル内容の構造と構成

スキルを同期することで、AI に利用可能なツールを知らせるだけです。実際に使用する際、AI は `openskills read` コマンドを通じて具体的なスキル内容をロードします。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| sync コマンドのエントリーポイント | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| 出力ファイルの検証 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| 存在しないファイルの作成 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| インタラクティブ選択画面 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| 既存の AGENTS.md の解析 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| スキル XML の生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| スキルセクションの置換 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| スキルセクションの削除 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**主要関数**：
- `syncAgentsMd()` - スキルを AGENTS.md ファイルに同期する
- `parseCurrentSkills()` - 既存の AGENTS.md のスキル名を解析する
- `generateSkillsXml()` - XML 形式のスキルリストを生成する
- `replaceSkillsSection()` - スキルセクションをファイルに置換または追加する
- `removeSkillsSection()` - スキルセクションをファイルから削除する

**主要定数**：
- `AGENTS.md` - デフォルト出力ファイル名
- `<skills_system>` - XML タグ、スキルシステム定義のマーク用
- `<available_skills>` - XML タグ、利用可能なスキルリストのマーク用

**重要ロジック**：
- デフォルトでファイル内に既存のスキルを事前選択（増分更新）
- 初回同期ですべてのプロジェクトスキルをデフォルト選択
- XML タグと HTML コメントの 2 つのマーク形式をサポート
- すべての選択を解除した場合、空のリストではなくスキルセクションを削除

</details>
