---
title: "スキルファイルの読み取り: リソースへのアクセス | opencode-agent-skills"
subtitle: "スキルファイルの読み取り: リソースへのアクセス | opencode-agent-skills"
sidebarTitle: "スキルの追加リソースへのアクセス"
description: "スキルファイルの読み取り方法を学びます。パスの安全性チェックとXML注入メカニズムを習得し、スキルディレクトリ内のドキュメントや設定ファイルに安全にアクセスします。"
tags:
  - "スキルファイル"
  - "ツール使用"
  - "パスの安全性"
prerequisite:
  - "/ja/joshuadavidthomas/opencode-agent-skills/start-installation/"
  - "/ja/joshuadavidthomas/opencode-agent-skills/platforms-listing-available-skills/"
order: 6
---

# スキルファイルの読み取り

## 学習後にできること

- `read_skill_file` ツールを使用して、スキルディレクトリ内のドキュメント、設定、サンプルファイルを読み取る
- パスセキュリティメカニズムを理解し、ディレクトリトラバーサル攻撃を防ぐ
- XML形式のファイル内容注入方法を習得する
- ファイルが存在しない場合のエラーメッセージと利用可能なファイルリストを処理する

## 現在の課題

スキルの SKILL.md はコアガイダンスのみを含みますが、多くのスキルは追加のドキュメント、設定サンプル、使用ガイドなどのサポートファイルを提供しています。より詳細な説明を取得するためにこれらのファイルにアクセスしたいが、スキルディレクトリ内のファイルを安全に読み取る方法がわかりません。

## いつこの手法を使用するか

- **詳細なドキュメントを確認する場合**：スキルの `docs/` ディレクトリに詳細な使用ガイドがある
- **設定サンプルを参照する場合**：`config/` ディレクトリ内のサンプル設定ファイルが必要
- **コードサンプルを確認する場合**：スキルの `examples/` ディレクトリにコード例がある
- **デバッグ支援**：スキルの README やその他の説明ファイルを確認する
- **リソース構造を理解する**：スキルディレクトリにどのファイルが利用可能かを探索する

## コア概念

`read_skill_file` ツールを使用すると、スキルディレクトリ内のサポートファイルに安全にアクセスできます。このツールは以下のメカニズムによって安全性と可用性を確保します：

::: info セキュリティメカニズム
プラグインはファイルパスを厳密にチェックし、ディレクトリトラバーサル攻撃を防止します：
- `..` を使用したスキルディレクトリ外のファイルへのアクセスを禁止
- 絶対パスの使用を禁止
- スキルディレクトリとそのサブディレクトリ内のファイルへのアクセスのみを許可
:::

ツールの実行フロー：
1. スキル名が存在するか検証（名前空間をサポート）
2. 要求されたファイルパスが安全かチェック
3. ファイル内容を読み取る
4. XML形式でラップし、セッションコンテキストに注入
5. 読み込み成功の確認メッセージを返す

::: tip ファイル内容の永続化
ファイル内容は `synthetic: true` と `noReply: true` フラグを通じて注入されます。これは：
- ファイル内容がセッションコンテキストの一部になる
- セッションが圧縮されても内容にアクセス可能
- 注入がAIの直接応答をトリガーしないことを意味します
:::

## 実践ガイド

### ステップ1：スキルドキュメントを読み取る

スキルディレクトリに詳細な使用ドキュメントがあると仮定します：

```
ユーザー入力：
git-helperのドキュメントを読み取る

システムコール：
read_skill_file(skill="git-helper", filename="docs/usage-guide.md")

システム応答：
File "docs/usage-guide.md" from skill "git-helper" loaded.
```

ファイル内容はXML形式でセッションコンテキストに注入されます：

```xml
<skill-file skill="git-helper" file="docs/usage-guide.md">
  <metadata>
    <directory>/path/to/project/.opencode/skills/git-helper</directory>
  </metadata>

  <content>
# Git Helper 使用ガイド

このスキルはGitブランチ管理、コミット規約、コラボレーションフローのガイダンスを提供します...

[ドキュメント内容が続きます]
  </content>
</skill-file>
```

**期待される結果**：読み込み成功メッセージと、ファイル内容がセッションコンテキストに注入されたことを確認できます。

### ステップ2：設定サンプルを確認する

スキルのサンプル設定を表示：

```
ユーザー入力：
docker-helperの設定サンプルを表示

システムコール：
read_skill_file(skill="docker-helper", filename="config/docker-compose.yml.example")

システム応答：
File "config/docker-compose.yml.example" from skill "docker-helper" loaded.
```

**期待される結果**：設定ファイル内容が注入され、AIがサンプルを参考に実際の設定を生成できます。

### ステップ3：名前空間を使用してファイルを読み取る

プロジェクトレベルとユーザーレベルで同名のスキルが存在する場合：

```
ユーザー入力：
project:build-helperのビルドスクリプトを読み取る

システムコール：
read_skill_file(skill="project:build-helper", filename="scripts/build.sh")

システム応答：
File "scripts/build.sh" from skill "build-helper" loaded.
```

**期待される結果**：名前空間を通じてスキルのソースを明確に指定できます。

### ステップ4：ファイルが存在しない場合の処理

存在しないファイルを読み取ろうとした場合：

```
ユーザー入力：
git-helperのapi-docs.mdを読み取る

システムコール：
read_skill_file(skill="git-helper", filename="api-docs.md")

システム応答：
File "api-docs.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md, SKILL.md
```

ツールはスキルディレクトリ内のすべての利用可能なファイルをリストアップし、正しいファイル名を見つけやすくします。

**期待される結果**：エラーメッセージと利用可能なファイルリストが表示されます。

### ステップ5：パスセキュリティ保護を体験する

スキルディレクトリ外のファイルにアクセスしようとする：

```
ユーザー入力：
git-helperの親ディレクトリのファイルを読み取る

システムコール：
read_skill_file(skill="git-helper", filename="../secrets.txt")

システム応答：
Invalid path: cannot access files outside skill directory.
```

ツールはスキルディレクトリ外へのアクセスを試みるあらゆるリクエストを拒否します。

**期待される結果**：パスセキュリティエラーメッセージが表示されます。

## チェックポイント ✅

- [ ] `read_skill_file` を使用してスキルファイルを読み取れますか？
- [ ] パスセキュリティメカニズムの役割を理解できますか？
- [ ] ファイル内容注入のXML形式を認識できますか？
- [ ] エラーメッセージから利用可能なファイルリストを見つけられますか？
- [ ] 名前空間を使用してスキルを正確に特定できますか？

## 一般的な落とし穴

### 落とし穴1：ファイルパスの誤り

ファイルがサブディレクトリ内にあることを忘れた場合：

```
ユーザー入力：
git-helperのusage-guide.mdを読み取る

システム応答：
File "usage-guide.md" not found. Available files: docs/usage-guide.md, examples/branch-flow.md, README.md
```

**原因**：ファイルはサブディレクトリ内に存在し、相対パスを指定する必要があります。

**解決策**：`docs/usage-guide.md` のように完全パスを使用します。

### 落とし穴2：名前空間の競合を無視する

同名のスキルが複数の名前空間に存在する場合：

```
ユーザー入力：
build-helperのREADMEを読み取る

システム応答：
File "README.md" from skill "build-helper" loaded.
```

プロジェクトレベルのスキルが読み取られているが、ユーザーレベルのスキルを期待している可能性があります。

**解決策**：名前空間を明確に指定します。例：`read_skill_file(skill="user:build-helper", filename="README.md")`。

### 落とし穴3：ディレクトリトラバーサルの試行

`..` を使用して上位ディレクトリにアクセスしようとする：

```
ユーザー入力：
スキルディレクトリ外のファイルを読み取る

システムコール：
read_skill_file(skill="my-skill", filename="../../../etc/passwd")

システム応答：
Invalid path: cannot access files outside skill directory.
```

**原因**：これはディレクトリトラバーサル攻撃を防止するためのセキュリティ制限です。

**解決策**：スキルディレクトリ内のファイルのみアクセス可能です。他のファイルが必要な場合は、AIに直接 `Read` ツールを使用させます。

### 落とし穴4：ファイルがすでにセッションコンテキスト内に存在する

すでにスキルを読み込んでいる場合、ファイル内容はスキルの SKILL.md や他の注入済み内容に含まれている可能性があります：

```
ユーザー入力：
スキルのコアドキュメントを読み取る

システムコール：
read_skill_file(skill="my-skill", filename="core-guide.md")
```

しかし、これは不要な可能性があります。コア内容は通常 SKILL.md に含まれているためです。

**解決策**：まず読み込み済みスキルの内容を確認し、追加のファイルが必要かどうかを判断します。

## このレッスンのまとめ

`read_skill_file` ツールは、スキルディレクトリ内のサポートファイルに安全にアクセスできます：

- **安全なパスチェック**：ディレクトリトラバーサルを防止し、スキルディレクトリ内のファイルのみアクセス可能
- **XML注入メカニズム**：ファイル内容は `<skill-file>` XMLタグでラップされ、メタデータを含む
- **エラーフレンドリ**：ファイルが存在しない場合、利用可能なファイルをリストアップし、正しいパスを見つけやすくする
- **名前空間サポート**：`namespace:skill-name` 形式で同名スキルを正確に特定可能
- **コンテキスト永続化**：`synthetic: true` フラグを通じて、セッション圧縮後もファイル内容にアクセス可能

このツールは以下のスキルファイルの読み取りに最適です：
- 詳細なドキュメント（`docs/` ディレクトリ）
- 設定サンプル（`config/` ディレクトリ）
- コードサンプル（`examples/` ディレクトリ）
- README と説明ファイル
- スクリプトソースコード（実装を確認する必要がある場合）

## 次のレッスンの予告

> 次のレッスンでは **[Claude Code スキル互換性](../../advanced/claude-code-compatibility/)** を学習します。
>
> 学習内容：
> - プラグインがClaude Codeのスキルとプラグインシステムと互換性を持つ方法
> - ツールマッピングメカニズム（Claude CodeツールからOpenCodeツールへの変換）
> - Claude Codeのインストール場所からスキルを発見する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能        | ファイルパス                                                                                    | 行番号    |
|--- | --- | ---|
| ReadSkillFile ツール定義 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135)         | 74-135   |
| パスセキュリティチェック | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133)    | 130-133  |
| スキルファイル一覧表示 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L289-L316) | 289-316  |
| resolveSkill 関数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283  |
| injectSyntheticContent 関数 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162)    | 147-162  |

**主要な型**：
- `Skill`：スキルメタデータインターフェース（`skills.ts:43-52`）
- `OpencodeClient`：OpenCode SDK クライアント型（`utils.ts:140`）
- `SessionContext`：セッションコンテキスト、modelとagent情報を含む（`utils.ts:142-145`）

**主要な関数**：
- `ReadSkillFile(directory: string, client: OpencodeClient)`：ツール定義を返し、スキルファイルの読み取りを処理
- `isPathSafe(basePath: string, requestedPath: string): boolean`：パスがベースディレクトリ内にあるか検証し、ディレクトリトラバーサルを防止
- `listSkillFiles(skillPath: string, maxDepth: number = 3): Promise<string[]>`：スキルディレクトリ内のすべてのファイルをリストアップ（SKILL.mdを除く）
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>): Skill | null`：`namespace:skill-name` 形式のスキル解析をサポート
- `injectSyntheticContent(client, sessionID, text, context)`：`noReply: true` と `synthetic: true` を通じて内容をセッションに注入

**ビジネスルール**：
- パスセキュリティチェックは `path.resolve()` を使用して検証し、解析後のパスがベースディレクトリで始まることを確認（`utils.ts:131-132`）
- ファイルが存在しない場合、`fs.readdir()` を使用して利用可能なファイルをリストアップし、フレンドリーなエラーメッセージを提供（`tools.ts:126-131`）
- ファイル内容はXML形式でラップされ、`skill`、`file` 属性と `<metadata>`、`<content>` タグを含む（`tools.ts:111-119`）
- 注入時に現在のセッションの model と agent コンテキストを取得し、内容が正しいコンテキストに注入されることを確認（`tools.ts:121-122`）

**セキュリティメカニズム**：
- ディレクトリトラバーサル防止：`isPathSafe()` がパスがベースディレクトリ内にあるかチェック（`utils.ts:130-133`）
- スキルが存在しない場合、あいまい一致の提案を提供（`tools.ts:90-95`）
- ファイルが存在しない場合、利用可能なファイルをリストアップし、ユーザーが正しいパスを見つけやすくする（`tools.ts:126-131`）

</details>
