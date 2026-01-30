---
title: "AGENTS.md 形式: スキル仕様 | openskills"
sidebarTitle: "AI にあなたのスキルを認識させる"
subtitle: "AGENTS.md 形式仕様"
description: "AGENTS.md ファイルの XML タグ構造とスキルリスト定義を学びます。フィールドの意味、生成メカニズム、ベストプラクティスを理解し、スキルシステムの動作原理をマスターします。"
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "sync-to-agents"
order: 2
---

# AGENTS.md 形式仕様

**AGENTS.md** は OpenSkills が生成するスキル記述ファイルであり、AI エージェント（Claude Code、Cursor、Windsurf など）にどのようなスキルが利用可能か、それらをどのように呼び出すかを伝えます。

## 学習後の目標

- AGENTS.md の XML 構造と各タグの意味を理解できる
- スキルリストのフィールド定義と使用制限を理解できる
- AGENTS.md を手動で編集する方法を知る（推奨されませんが、必要な場合があります）
- OpenSkills がこのファイルを生成・更新する方法を理解できる

## 完全な形式の例

以下は完全な AGENTS.md ファイルの例です：

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## タグ構造の詳細

### 外側のコンテナ：`<skills_system>`

```xml
<skills_system priority="1">
  <!-- スキルの内容 -->
</skills_system>
```

- **priority**：優先度マーカー（固定値 `"1"`）。AI エージェントにこのスキルシステムの重要度を伝えます

::: tip 説明
`priority` 属性は将来の拡張のために予約されており、すべての AGENTS.md は固定値 `"1"` を使用します。
:::

### 使用方法：`<usage>`

`<usage>` タグには、AI エージェントがスキルを使用すべき方法のガイダンスが含まれています：

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**重要なポイント**：
- **トリガー条件**：ユーザーのタスクをスキルでより効率的に完了できるかチェックする
- **呼び出し方法**：`npx openskills read <skill-name>` コマンドを使用
- **バッチ呼び出し**：カンマで区切られた複数のスキル名をサポート
- **ベースディレクトリ**：出力には `base_dir` フィールドが含まれ、スキル内の参照ファイル（`references/`、`scripts/`、`assets/` など）の解決に使用されます
- **使用制限**：
  - `<available_skills>` にリストされたスキルのみを使用
  - 既にコンテキストにロードされているスキルを再度呼び出さない
  - 各スキルの呼び出しはステートレス

### スキルリスト：`<available_skills>`

`<available_skills>` にはすべての利用可能なスキルのリストが含まれ、各スキルは `<skill>` タグで定義されます：

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>スキルの説明...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>別のスキルの説明...</description>
<location>global</location>
</skill>

</available_skills>
```

#### `<skill>` タグのフィールド

各 `<skill>` には以下の必須フィールドが含まれます：

| フィールド | 型 | 可能な値 | 説明 |
|--- | --- | --- | ---|
| `<name>` | string | - | スキル名（SKILL.md のファイル名または YAML の `name` と一致） |
| `<description>` | string | - | スキルの説明（SKILL.md の YAML frontmatter から取得） |
| `<location>` | string | `project` \| `global` | スキルのインストール位置マーカー（AI エージェントがスキルのソースを理解するために使用） |

**フィールドの説明**：

- **`<name>`**：スキルの一意の識別子。AI エージェントはこの名前でスキルを呼び出します
- **`<description>`**：スキルの機能と使用シーンを詳細に説明し、AI がこのスキルを使用する必要があるかどうかを判断するのに役立ちます
- **`<location>`**：
  - `project`：プロジェクトローカルにインストール（`.claude/skills/` または `.agent/skills/`）
  - `global`：グローバルディレクトリにインストール（`~/.claude/skills/`）

::: info location マーカーが必要な理由
`<location>` マーカーは、AI エージェントがスキルの可視範囲を理解するのに役立ちます：
- `project` スキルは現在のプロジェクトでのみ利用可能
- `global` スキルはすべてのプロジェクトで利用可能
これは AI エージェントのスキル選択戦略に影響します。
:::

## マークアップ方法

AGENTS.md は 2 種類のマークアップ方法をサポートしており、OpenSkills は自動的に認識します：

### 方法 1：XML タグ（推奨）

```xml
<skills_system priority="1">
  <!-- スキルの内容 -->
</skills_system>
```

これがデフォルトの方法であり、標準の XML タグでスキルシステムの開始と終了をマークします。

### 方法 2：HTML コメントマークアップ（互換モード）

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- 使用方法 -->
</usage>

<available_skills>
  <!-- スキルリスト -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

この形式では外側の `<skills_system>` コンテナを削除し、HTML コメントのみでスキル領域の開始と終了をマークします。

::: tip OpenSkills の処理ロジック
`replaceSkillsSection()` 関数（`src/utils/agents-md.ts:67-93`）は以下の優先度でマークアップを検索します：
1. まず `<skills_system>` XML タグを検索
2. 見つからない場合、`<!-- SKILLS_TABLE_START -->` HTML コメントを検索
3. どちらも見つからない場合、内容をファイルの末尾に追加
:::

## OpenSkills が AGENTS.md を生成する方法

`openskills sync` を実行すると、OpenSkills は次の処理を行います：

1. **すべてのインストール済みスキルを検索**（`findAllSkills()`）
2. **インタラクティブにスキルを選択**（`-y` フラグを使用しない場合）
3. **XML コンテンツを生成**（`generateSkillsXml()`）
   - `<usage>` 使用方法を構築
   - 各スキルの `<skill>` タグを生成
4. **ファイルのスキル部分を置換**（`replaceSkillsSection()`）
   - 既存のマークアップ（XML または HTML コメント）を検索
   - マークアップ間のコンテンツを置換
   - マークアップがない場合、ファイルの末尾に追加

### ソースコードの場所

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| XML を生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| スキル部分を置換 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 既存のスキルを解析 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |

## 手動編集の注意点

::: warning 手動編集は推奨されません
AGENTS.md を手動で編集することは可能ですが、以下をお勧めします：
1. `openskills sync` コマンドを使用して生成・更新する
2. 手動編集した内容は次回の `sync` 時に上書きされます
3. スキルリストをカスタマイズする必要がある場合、インタラクティブ選択を使用する（`-y` フラグなし）
:::

どうしても手動で編集する必要がある場合、以下に注意してください：

1. **XML 構文の正確さを維持**：すべてのタグが正しく閉じられていることを確認
2. **マークアップを変更しない**：`<skills_system>` または `<!-- SKILLS_TABLE_START -->` などのマークアップを保持
3. **フィールドの完全性**：各 `<skill>` には `<name>`、`<description>`、`<location>` の 3 つのフィールドが必須
4. **重複するスキルを避ける**：同じ名前のスキルを重複して追加しない

## よくある質問

### Q1：AGENTS.md に `<skills_system>` タグがない場合がありますが、なぜですか？

**A**：これは互換モードです。ファイルが HTML コメントマークアップ（`<!-- SKILLS_TABLE_START -->`）を使用している場合でも、OpenSkills は認識します。次回の `sync` 時に自動的に XML タグに変換されます。

### Q2：すべてのスキルを削除するにはどうすればよいですか？

**A**：`openskills sync` を実行し、インタラクティブ画面ですべてのスキルの選択を解除するか、以下を実行します：

```bash
openskills sync -y --output /dev/null
```

これにより AGENTS.md 内のスキル部分がクリアされます（ただしマークアップは保持されます）。

### Q3：location フィールドは AI エージェントに実際の影響を与えますか？

**A**：これは具体的な AI エージェントの実装に依存します。一般的には：
- `location="project"` はスキルが現在のプロジェクトコンテキストでのみ意味を持つことを示します
- `location="global"` はスキルが汎用ツールであり、どのプロジェクトでも使用できることを示します

AI エージェントはこのマークに基づいてスキルロード戦略を調整する場合がありますが、ほとんどのエージェント（Claude Code など）はこのフィールドを無視し、直接 `openskills read` を呼び出します。

### Q4：スキルの説明はどのくらいの長さにすべきですか？

**A**：スキルの説明は以下の通りであるべきです：
- **簡潔だが完全**：スキルの核機能と主な使用シーンを説明
- **短すぎない**：1 行の説明では AI がいつ使用するかを理解するのが難しい
- **長すぎない**：長すぎる説明はコンテキストを無駄にし、AI は注意深く読みません

推奨される長さ：**50-150 語**。

## ベストプラクティス

1. **sync コマンドを使用する**：常に `openskills sync` を使用して AGENTS.md を生成し、手動編集は避ける
2. **定期的に更新する**：スキルをインストールまたは更新した後、`openskills sync` を実行することを忘れない
3. **適切なスキルを選択する**：インストール済みのすべてのスキルを AGENTS.md に配置する必要はありません。プロジェクトの要件に応じて選択
4. **形式をチェックする**：AI エージェントがスキルを認識できない場合、AGENTS.md の XML タグが正しいかチェックする

## 次のレッスンの予告

> 次のレッスンでは **[ファイル構造](../file-structure/)** を学習します。
>
> 学習内容：
> - OpenSkills が生成するディレクトリとファイル構造
> - 各ファイルの役割と場所
> - スキルディレクトリの理解と管理方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| スキル XML を生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| スキル部分を置換 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 既存のスキルを解析 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Skill タイプ定義 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |

**重要な定数**：
- `priority="1"`：スキルシステム優先度マーカー（固定値）

**重要な関数**：
- `generateSkillsXml(skills: Skill[])`：XML 形式のスキルリストを生成
- `replaceSkillsSection(content: string, newSection: string)`：スキル部分を置換または追加
- `parseCurrentSkills(content: string)`：AGENTS.md から有効なスキル名を解析

</details>
