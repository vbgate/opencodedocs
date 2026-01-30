---
title: "スキル管理: 利用可能なスキルの照会 | opencode-agent-skills"
sidebarTitle: "スキルを素早く見つける"
subtitle: "スキル管理: 利用可能なスキルの照会"
description: "get_available_skills ツールの使用方法を学びます。検索、名前空間、フィルタリングでスキルを素早く見つけ、スキル発見と管理の主要機能を習得します。"
tags:
  - "スキル管理"
  - "ツールの活用"
  - "名前空間"
prerequisite:
  - "start-installation"
order: 2
---

# 利用可能なスキルの照会と一覧表示

## 本レッスンでできること

- `get_available_skills` ツールを使用して、利用可能なすべてのスキルを一覧表示する
- 検索クエリを使用して特定のスキルをフィルタリングする
- 名前空間（`project:skill-name` など）を使用してスキルを正確に特定する
- スキルのソースと実行可能スクリプトリストを識別する

## 現在の課題

特定のスキルを使用したいが、その正確な名前を思い出せない。プロジェクト内のスキルであることはわかっているが、どの発見パスにあるかわからない。あるいは、単に現在のプロジェクトでどのようなスキルが利用可能かを素早く確認したい。

## この機能を使う場面

- **新しいプロジェクトの探索**: 新しいプロジェクトに参加したとき、利用可能なスキルを素早く把握する
- **スキル名が不明確**: スキル名の一部や説明しか覚えていない場合、あいまい一致で検索する
- **名前空間の衝突**: プロジェクトレベルとユーザーレベルに同名のスキルがあり、どちらを使用するか明確に指定する必要がある
- **スクリプトの検索**: スキルディレクトリ下にどのような実行可能スクリプトがあるか知りたい

## 核心的なアプローチ

`get_available_skills` ツールを使用すると、現在のセッションで利用可能なすべてのスキルを確認できます。プラグインは 6 つの発見パスから自動的にスキルをスキャンします：

::: info スキル発見の優先順位
1. `.opencode/skills/` (プロジェクトレベル OpenCode)
2. `.claude/skills/` (プロジェクトレベル Claude)
3. `~/.config/opencode/skills/` (ユーザーレベル OpenCode)
4. `~/.claude/skills/` (ユーザーレベル Claude)
5. `~/.claude/plugins/cache/` (プラグインキャッシュ)
6. `~/.claude/plugins/marketplaces/` (インストール済みプラグイン)
:::

同名のスキルは優先順位に従って最初のもののみが保持され、後続のものは無視されます。

ツールが返す情報には以下が含まれます：
- **スキル名**
- **ソースタグ**（project、user、claude-project など）
- **説明**
- **実行可能スクリプトリスト**（ある場合）

::: tip 名前空間の構文
`namespace:skill-name` 形式を使用してソースを明示的に指定できます：
- `project:my-skill` - プロジェクトレベル OpenCode スキルを使用（`.opencode/skills/`）
- `claude-project:my-skill` - プロジェクトレベル Claude スキルを使用（`.claude/skills/`）
- `user:my-skill` - ユーザーレベル OpenCode スキルを使用（`~/.config/opencode/skills/`）
- `claude-user:my-skill` - ユーザーレベル Claude スキルを使用（`~/.claude/skills/`）
- `claude-plugins:my-skill` - Claude プラグイン内のスキルを使用
:::

## ハンズオン

### ステップ 1: 利用可能なすべてのスキルを一覧表示

OpenCode で AI に直接スキルの一覧を要求します：

```
ユーザー入力：
列出所有可用的技能

システム応答：
skill-helper (project)
  Git 操作和分支管理助手 [scripts: tools/branch.sh, tools/commit.sh]

test-helper (user)
  单元测试和覆盖率分析工具

docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]

claude-code-superpowers (claude-plugins)
  完整的软件开发工作流
```

**確認できること**: スキルの一覧が表示され、各スキルは名前、ソースタグ、説明、スクリプトリストを表示します。

### ステップ 2: 検索クエリを使用したフィルタリング

スキル名の一部しか覚えていない場合：

```
ユーザー入力：
查找包含 "docker" 的技能

システム応答：
docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]
```

検索はスキル名と説明のキーワードに一致し、`*` ワイルドカードをサポートします：

```
ユーザー入力：
查找以 "test" 开头的技能

システム応答：
test-helper (user)
  单元测试和覆盖率分析工具
```

**確認できること**: クエリ条件に一致するスキルのみが表示されます。

### ステップ 3: あいまい一致の推奨を体験

間違ったスキル名を入力した場合：

```
ユーザー入力：
我想用 docker-asistant

システム応答：
No skills found matching "docker-asistant". Did you mean "docker-helper"?
```

プラグインは Levenshtein 距離に基づいて類似度を計算し、最も近いスキル名を自動的に推奨します。

**確認できること**: エラーメッセージと正しいスキル名の推奨が表示されます。

### ステップ 4: 名前空間を使用した正確な特定

プロジェクトレベルとユーザーレベルの両方に `build-helper` という名前のスキルがあると仮定します：

```
ユーザー入力：
列出 build-helper 的详细信息

システム応答：
build-helper (project)
  项目特定的构建配置和编译优化 [scripts: build.sh, optimize.sh]
```

ユーザーがユーザーレベルのスキルを要求する場合：

```
ユーザー入力：
使用 user:build-helper

システム応答：
build-helper (user)
  通用构建工具链和持续集成配置 [scripts: ci.sh, test.sh]
```

**確認できること**: 名前空間プレフィックスを使用して、異なるソースの同名スキルにアクセスできます。

### ステップ 5: 実行可能スクリプトの確認

スキルディレクトリ下にどのようなスクリプトがあるかを確認します：

```
ユーザー入力：
docker-helper 有哪些脚本？

システム応答：
docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]
```

スクリプトはスキル情報の角括弧内に表示され、カンマで区切られます。これらのスクリプトは `run_skill_script` ツールを使用して実行できます。

**確認できること**: スキル名の後に `[scripts: スクリプトパス1, スクリプトパス2, ...]` 形式のリストが表示されます。

## チェックポイント ✅

- [ ] 利用可能なすべてのスキルを一覧表示できますか？
- [ ] 検索クエリを使用して特定のスキルをフィルタリングできますか？
- [ ] スキルのソースタグの意味を理解していますか（project、user、claude-project など）？
- [ ] スキル名前空間の役割と構文を説明できますか？
- [ ] スキル情報から実行可能スクリプトリストを識別できますか？

## よくある落とし穴

### トラップ 1: 同名スキルの上書き

プロジェクトレベルとユーザーレベルに同名のスキルがある場合、期待したスキルがロードされないことに困惑するかもしれません。

**原因**: スキルは優先順位に従って発見され、プロジェクトレベルがユーザーレベルより優先され、同名のものは最初のもののみが保持されます。

**解決策**: 名前空間を明示的に指定します。例：`user:my-skill` ではなく `my-skill` を使用します。

### トラップ 2: 検索の大文字小文字の区別

検索クエリは正規表現を使用しますが、`i` フラグが設定されているため、大文字小文字は区別されません。

```bash
# これらの検索は等価
get_available_skills(query="docker")
get_available_skills(query="DOCKER")
get_available_skills(query="Docker")
```

### トラップ 3: ワイルドカードのエスケープ

検索内の `*` は自動的に `.*` 正規表現に変換されるため、手動でエスケープする必要はありません：

```bash
# "test" で始まるスキルを検索
get_available_skills(query="test*")

# 正規表現 /test.*/i と同等
```

## 本レッスンのまとめ

`get_available_skills` はスキルエコシステムを探索するツールで、以下をサポートします：

- **すべてのスキルの一覧表示**: 引数なしで呼び出す
- **検索フィルタリング**: `query` パラメータを使用して名前と説明に一致させる
- **名前空間**: `namespace:skill-name` 形式で正確に特定する
- **あいまい一致の推奨**: スペルミス時に正しい名前を自動的に提示する
- **スクリプトリスト**: 実行可能な自動化スクリプトを表示する

プラグインはセッション開始時に自動的にスキルリストを注入するため、通常はこのツールを手動で呼び出す必要はありません。ただし、以下のシナリオでは非常に役立ちます：
- 利用可能なスキルを素早く確認したい場合
- スキルの正確な名前を思い出せない場合
- 同名スキルの異なるソースを区別する必要がある場合
- 特定のスキルのスクリプトリストを確認したい場合

## 次のレッスンの予告

> 次のレッスンでは **[スキルをセッションコンテキストに読み込む](../loading-skills-into-context/)** を学習します。
>
> 以下の内容を学びます：
> - use_skill ツールを使用してスキルを現在のセッションに読み込む
> - スキル内容が XML 形式でコンテキストに注入される仕組みを理解する
> - Synthetic Message Injection メカニズム（合成メッセージ注入）を習得する
> - セッション圧縮後にスキルがどのように利用可能になるかを理解する

---

## 付録: ソースコード参照

<details>
<summary><strong>展開してソースコードの場所を表示</strong></summary>

> 更新日時: 2026-01-24

| 機能        | ファイルパス                                                                                    | 行番号    |
|--- | --- | ---|
| GetAvailableSkills ツール定義 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72)         | 29-72   |
| discoverAllSkills 関数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L240-L263) | 240-263 |
| resolveSkill 関数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| findClosestMatch 関数 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125)    | 88-125  |

**主要な型**：
- `SkillLabel = "project" | "user" | "claude-project" | "claude-user" | "claude-plugins"`：スキルソースタグの列挙型

**主要な定数**：
- あいまい一致のしきい値：`0.4`（`utils.ts:124`）- 類似度がこの値を下回る場合、推奨を返さない

**主要な関数**：
- `GetAvailableSkills()`：フォーマットされたスキルリストを返し、クエリフィルタリングとあいまい一致の推奨をサポート
- `resolveSkill(skillName: string, skillsByName: Map<string, Skill>)`：`namespace:skill-name` 形式のスキル解析をサポート
- `findClosestMatch(input: string, candidates: string[])`：複数の一致戦略（プレフィックス、包含、編集距離）に基づいて最適な一致を計算

**ビジネスルール**：
- 同名スキルは発見順に重複排除され、最初のもののみが保持される（`skills.ts:258`）
- 検索クエリはワイルドカード `*` をサポートし、自動的に正規表現に変換される（`tools.ts:43`）
- あいまい一致の推奨はクエリパラメータがあり結果がない場合にのみトリガーされる（`tools.ts:49-57`）

</details>
