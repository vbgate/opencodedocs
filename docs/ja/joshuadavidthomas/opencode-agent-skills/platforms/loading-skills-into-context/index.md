---
title: "スキルの読み込み: XMLコンテンツ注入 | opencode-agent-skills"
sidebarTitle: "AIがスキルを使えるようにする"
subtitle: "セッションコンテキストへのスキル読み込み"
description: "use_skillツールを使ってスキルをセッションコンテキストに読み込む方法を習得。XML注入とSynthetic Message Injectionの仕組みを理解し、スキルメタデータ管理を学習します。"
tags:
  - "スキル読み込み"
  - "XML注入"
  - "コンテキスト管理"
prerequisite:
  - "start-creating-your-first-skill"
  - "platforms-listing-available-skills"
order: 3
---

# セッションコンテキストへのスキル読み込み

## 学習後にできること

- `use_skill` ツールを使用してスキルを現在のセッションに読み込む
- スキルコンテンツがXML形式でコンテキストに注入される仕組みを理解する
- Synthetic Message Injection メカニズム（syntheticメッセージ注入）を習得する
- スキルメタデータ構造（ソース、ディレクトリ、スクリプト、ファイル）を理解する
- スキルがセッション圧縮後も使用可能であることを理解する

## 現在直面している課題

スキルを作成したが、AIがそのコンテンツにアクセスできないようです。または、長い会話の中でスキルガイダンスが突然消え、AIが以前のルールを忘れてしまいました。これらはすべてスキル読み込みメカニズムに関係しています。

## このテクニックを使うタイミング

- **手動スキル読み込み**: AIの自動推薦が適切でない場合、必要なスキルを直接指定する
- **長時間セッションの維持**: スキルコンテンツがコンテキスト圧縮後もアクセス可能であることを保証する
- **Claude Code互換**: Claude形式のスキルを読み込み、ツールマッピングを取得する
- **精密制御**: 特定バージョンのスキルを読み込む必要がある場合（名前空間経由）

## 核心アイデア

`use_skill` ツールは、スキルのSKILL.mdコンテンツをセッションコンテキストに注入し、AIがスキルで定義されたルールとワークフローに従えるようにします。

### XMLコンテンツ注入

スキルコンテンツは構造化されたXML形式で注入され、3つの部分から構成されます：

```xml
<skill name="skill-name">
  <metadata>
    <source>スキルソースタグ</source>
    <directory>スキルディレクトリパス</directory>
    <scripts>
      <script>tools/script1.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
    </files>
  </metadata>

  <tool-mapping>
    <!-- Claude Code ツールマッピング -->
  </tool-mapping>

  <content>
    SKILL.mdの完全なコンテンツ
  </content>
</skill>
```

### Synthetic Message Injection

プラグインはOpenCode SDKの `session.prompt()` メソッドを使用してスキルコンテンツを注入し、2つの重要なフラグを設定します：

::: info Synthetic Message Injection
- `noReply: true` - AIはこの注入自体には応答しない
- `synthetic: true` - メッセージをシステム生成としてマーク（ユーザーには非表示、ユーザー入力にカウントしない）
:::

これは以下を意味します：
- **ユーザーに非表示**: スキル注入は会話履歴に表示されない
- **入力を消費しない**: ユーザーメッセージカウントに含まれない
- **永続的に利用可能**: セッション圧縮後もスキルコンテンツはコンテキストに残る

### セッションライフサイクル

1. **初回メッセージ時**: プラグインは自動的に `<available-skills>` リストを注入し、すべての利用可能なスキルを表示する
2. **`use_skill` の使用**: 選択したスキルのXMLコンテンツをコンテキストに注入する
3. **セッション圧縮後**: プラグインは `session.compacted` イベントをリッスンし、スキルリストを再注入する

## 実践編

### ステップ 1：基本スキルの読み込み

OpenCodeでAIにスキルを読み込ませます：

```
ユーザー入力：
読み込むスキル: brainstorming

システム応答：
Skill "brainstorming" loaded.
```

**確認すべきこと**: AIが読み込み成功のメッセージを返し、スキルコンテンツがコンテキストに注入されたこと。

これでAIがスキルルールに従っているかテストできます：

```
ユーザー入力：
製品説明を書くのを手伝って

システム応答：
（AIはbrainstormingスキルのルールに従ってコンテンツを生成し、そこで定義されたテクニックとワークフローに従う）
```

### ステップ 2：読み込み後の利用可能リソースの確認

スキルを読み込むと、システムは利用可能なスクリプトとファイルのリストを返します：

```
ユーザー入力：
読み込むスキル: git-helper

システム応答：
Skill "git-helper" loaded.
Available scripts: tools/branch.sh, tools/commit.sh
Available files: docs/usage.md, examples/workflow.md
```

この情報は、スキルディレクトリにどのような利用可能なリソースがあるかを示します：
- **スクリプト**: `run_skill_script` ツールで実行可能
- **ファイル**: `read_skill_file` ツールで読み込み可能

**確認すべきこと**: 読み込み成功メッセージの後に、利用可能なスクリプトとファイルのリストが表示されること。

### ステップ 3：同名スキルの名前空間を使用した読み込み

プロジェクトレベルとユーザーレベルの両方に `build-helper` スキルがあるとします：

```
ユーザー入力：
読み込むスキル: build-helper

システム応答：
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh

ユーザー入力：
（どのバージョンのbuild-helperが読み込まれたか確認）
```

スキル検出の優先順位に従い、デフォルトではプロジェクトレベルのスキルが読み込まれます。ユーザーレベルのスキルが必要な場合：

```
ユーザー入力：
読み込むスキル: user:build-helper

システム応答：
Skill "build-helper" loaded.
Available scripts: ci.sh, test.sh
Available files: README.md
```

**確認すべきこと**: `namespace:skill-name` 形式を使用して、異なるソースから同名のスキルを読み込めること。

### ステップ 4：スキルガイダンス効果の体験

スキルを読み込んだ後、AIの動作はスキルで定義されたルールに従うはずです。brainstormingスキルを例に：

```
ユーザー入力：
読み込むスキル: brainstorming
スマートホーム製品の中核的セリングポイントを考えて

システム応答：
（AIはbrainstormingスキルで定義されたテクニックを使用します：
- まず可能な方向をリストアップし、掘り下げる
- 早すぎるアイデアの批判を避ける
- "はい、それに加えて..."を使ってアイデアを拡張する
- すべてのアイデアを記録してから選別する）

まず可能な方向をリストアップしましょう：
1. 利便性コントロール
2. エネルギー管理
3. セキュリティ保護
...
```

**確認すべきこと**: AIの回答スタイルとフローがスキルで定義されたものと一致していること。

### ステップ 5：長時間セッションでのスキルの持続性を理解する

長時間の会話を行い、スキルが有効なままかどうかを観察します：

```
ユーザー入力：
読み込むスキル: docker-helper
（ビルド、デプロイなどの操作を含む複数ラウンドの会話）
...
（会話が長く、OpenCodeのコンテキスト圧縮がトリガーされたと仮定）
ユーザー入力：
前のDockerデプロイを続けて

システム応答：
（AIはまだdocker-helperのコンテンツにアクセスできます。
プラグインは圧縮後にスキルリストを再注入するため）
```

::: tip 圧縮回復メカニズム
プラグインは `session.compacted` イベントをリッスンし、セッションが圧縮されるとスキルリストを再注入して、読み込まれたスキルが圧縮後もアクセス可能であることを保証します。
:::

**確認すべきこと**: 会話が長く、コンテキストが圧縮された後でも、AIはスキルコンテンツにアクセスできること。

### ステップ 6：Claude Code形式のスキルの読み込み

Claude Codeスキルがある場合、それらは自動的に検出されます：

```
ユーザー入力：
利用可能なすべてのスキルをリストする

システム応答：
...
claude-code-superpowers (claude-plugins)
  完全なソフトウェア開発ワークフロー

ユーザー入力：
読み込むスキル: claude-code-superpowers

システム応答：
Skill "claude-code-superpowers" loaded.
```

Claude形式のスキルを読み込むと、toolTranslationが自動的に注入され、Claudeのツール名をOpenCodeのツールにマッピングします：

::: info ツールマッピング例
- Claudeの `TodoWrite` → OpenCodeの `todowrite`
- Claudeの `Task` → OpenCodeの `task`（サブエージェント）
- Claudeの `Bash` → OpenCodeの `bash`
:::

**確認すべきこと**: スキルが正常に読み込まれ、AIがClaude形式のワークフローを理解して使用できること。

## チェックポイント ✅

- [ ] `use_skill` を使ってスキルを読み込めますか？
- [ ] スキルコンテンツがXML形式で注入されるメカニズムを理解できますか？
- [ ] syntheticメッセージの2つの重要なフラグを言えますか？
- [ ] なぜスキルがセッション圧縮後も利用可能であるか説明できますか？
- [ ] 名前空間を使用して同名スキルの異なるバージョンを読み込めますか？

## よくある落とし穴

### 落とし穴 1：スキル名のスペルミス

誤ったスキル名を入力した場合：

```
ユーザー入力：
読み込むスキル: brainstormig

システム応答：
Skill "brainstormig" not found. Did you mean "brainstorming"?
```

プラグインは編集距離に基づいてあいまい一致の提案を提供します。

**解決策**：スペルを確認するか、`get_available_skills` を使用して正しい名前を確認してください。

### 落とし穴 2：同名スキルの混同

プロジェクトレベルとユーザーレベルの両方に同名のスキルがある場合、間違ったバージョンが読み込まれる可能性があります：

```
ユーザー入力：
読み込むスキル: build-helper

システム応答：
Skill "build-helper" loaded.
Available scripts: build.sh, optimize.sh  # これはプロジェクトレベル

ユーザーレベルを読み込みたかったが、デフォルトではプロジェクトレベルが読み込まれる
```

**解決策**：名前空間を使用して明確に指定してください。例：`user:build-helper`。

### 落とし穴 3：スキルコンテンツが有効にならない

スキルを読み込んでも、AIがルールに従っていないように見える場合があります：

```
ユーザー入力：
読み込むスキル: my-conventions
（コード規約に従うことを期待）
ユーザー入力：
関数を書いて

システム応答：
（AIが書いたコードが期待される規約に従っていない）
```

**考えられる原因**：
- スキルのSKILL.mdコンテンツが明確でない
- スキル説明が詳細でなく、AIの理解に誤差がある
- 長い会話でコンテキストが圧縮され、スキルリストの再注入が必要

**解決策**：
- スキルのfrontmatterとコンテンツが明確かどうか確認する
- AIに明示的に特定のルールを使用するよう伝える：「my-conventionsスキルのルールを使用してください」
- 圧縮後にスキルを再読み込みする

### 落とし穴 4：Claudeスキルのツールマッピング問題

Claude Codeスキルを読み込んでも、AIが依然として誤ったツール名を使用する可能性があります：

```
ユーザー入力：
読み込むスキル: claude-code-superpowers
TodoWriteツールを使用

システム応答：
（AIはマッピングが正しく行われていないため、誤ったツール名を使用しようとする可能性がある）
```

**原因**：スキル読み込み時にツールマッピングが自動的に注入されますが、AIには明示的なプロンプトが必要な場合があります。

**解決策**：スキルを読み込んだ後、AIにマッピングされたツールを使用するよう明示的に伝えます：

```
ユーザー入力：
読み込むスキル: claude-code-superpowers
注意: todowriteツールを使用（TodoWriteではなく）
```

## レッスンサマリー

`use_skill` ツールは、スキルコンテンツをXML形式でセッションコンテキストに注入し、Synthetic Message Injectionメカニズムを通じて実現されます：

- **XML構造化注入**: メタデータ、ツールマッピング、スキルコンテンツを含む
- **Syntheticメッセージ**: `noReply: true` と `synthetic: true` でメッセージがユーザーに非表示になることを保証
- **永続的に利用可能**: コンテキストが圧縮されても、スキルコンテンツはアクセス可能
- **名前空間サポート**: `namespace:skill-name` 形式でスキルソースを正確に指定
- **Claude互換**: ツールマッピングを自動注入し、Claude Codeスキルをサポート

スキル読み込みは、AIが特定のワークフローとルールに従うための重要なメカニズムであり、コンテンツ注入を通じて、AIは会話全体を通じて一貫した動作スタイルを維持できます。

## 次のレッスン予告

> 次のレッスンでは **[自動スキル推薦：セマンティックマッチングの原理](../automatic-skill-matching/)** を学習します。
>
> 学習内容：
> - プラグインがセマンティック類似度に基づいて関連スキルを自動推薦する仕組み
> - embeddingモデルとコサイン類似度計算の基本原
理
> - より良い推薦効果を得るためのスキル説明の最適化テクニック
> - embeddingキャッシュメカニズムによるパフォーマンス向上

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>ソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| UseSkill ツール定義 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| injectSyntheticContent 関数 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| injectSkillsList 関数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L345-L370) | 345-370 |
| resolveSkill 関数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| listSkillFiles 関数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316 |

**重要な定数**：
- なし

**重要な関数**：
- `UseSkill()`: `skill` パラメータを受け取り、XML形式のスキルコンテンツを構築してセッションに注入
- `injectSyntheticContent(client, sessionID, text, context)`: `client.session.prompt()` を通じてsyntheticメッセージを注入し、`noReply: true` と `synthetic: true` を設定
- `injectSkillsList()`: 初回メッセージ時に `<available-skills>` リストを注入
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`: `namespace:skill-name` 形式のスキル解決をサポート
- `listSkillFiles(skillPath: string, maxDepth: number)`: スキルディレクトリ内のすべてのファイルを再帰的にリストアップ（SKILL.mdを除く）

**ビジネスルール**：
- スキルコンテンツはXML形式で注入され、メタデータ、ツールマッピング、コンテンツを含む（`tools.ts:238-249`）
- 注入メッセージはsyntheticとしてマークされ、ユーザー入力にカウントされない（`utils.ts:159`）
- 読み込まれたスキルは現在のセッションでは推薦されない（`plugin.ts:128-132`）
- スキルリストは初回メッセージ時に自動的に注入される（`plugin.ts:70-105`）
- セッション圧縮後にスキルリストを再注入する（`plugin.ts:145-151`）

**XMLコンテンツ形式**：
```xml
<skill name="${skill.name}">
  <metadata>
    <source>${skill.label}</source>
    <directory>${skill.path}</directory>
    <scripts>
      <script>${script.relativePath}</script>
    </scripts>
    <files>
      <file>${file}</file>
    </files>
  </metadata>

  ${toolTranslation}

  <content>
  ${skill.template}
  </content>
</skill>
```

</details>
