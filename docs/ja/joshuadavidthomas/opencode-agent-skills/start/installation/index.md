---
title: "インストール: Agent Skills プラグイン | opencode-agent-skills"
sidebarTitle: "5分でプラグインをインストール"
subtitle: "インストール: Agent Skills プラグイン | opencode-agent-skills"
description: "opencode-agent-skillsの3つのインストール方法を学習します。基本インストール、固定バージョンインストール、ローカル開発インストールを含み、様々な使用シーンに対応します。"
tags:
  - "インストール"
  - "プラグイン"
  - "クイックスタート"
prerequisite: []
order: 2
---

# OpenCode Agent Skills のインストール

## この章で学べること

- OpenCodeにAgent Skillsプラグインをインストールする3つの方法
- プラグインが正しくインストールされているかどうかを検証する方法
- 固定バージョンと最新バージョンの違いを理解する

## 現在の課題

AI Agentにスキルの再利用を学ばせたいが、OpenCodeでこの機能を有効にする方法がわからない。OpenCodeのプラグインシステムは少し複雑に見え、設定ミスを心配している。

## この方法を使うべき時

**AI Agentに以下の能力を持たせたい場合**：
- 異なるプロジェクト間でスキルを再利用する（コード規約、テンプレートなど）
- Claude Codeのスキルライブラリをロードする
- AIに特定のワークフローに従わせる

## 🎒 始める前の準備

::: warning 事前チェック

開始前に、以下を確認してください：

- [OpenCode](https://opencode.ai/) v1.0.110以降がインストールされている
- `~/.config/opencode/opencode.json`設定ファイルにアクセスできる

:::

## 核心アイデア

OpenCode Agent Skillsはnpmで公開されているプラグインです。インストールは簡単で、設定ファイルにプラグイン名を宣言するだけで、OpenCodeは起動時に自動的にダウンロードして読み込みます。

**3つのインストール方法の使用シーン**：

| 方式 | 使用シーン | 長所と短所 |
|--- | --- | ---|
| **基本インストール** | 起動するたびに最新バージョンを使用 | ✅ 自動更新が便利<br>❌ 破壊的変更に遭遇する可能性がある |
| **固定バージョン** | 安定した本番環境が必要 | ✅ バージョン管理が可能<br>❌ 手動アップグレードが必要 |
| **ローカル開発** | カスタムプラグインまたはコード貢献 | ✅ 柔軟な変更が可能<br>❌ 依存関係の手動管理が必要 |

---

## 実践しよう

### 方法1：基本インストール（推奨）

これは最も簡単な方法で、OpenCodeが起動するたびに最新バージョンをチェックしてダウンロードします。

**なぜこの方法か**
ほとんどのユーザーに適しており、常に最新の機能とバグ修正を使用できます。

**手順**

1. OpenCode設定ファイルを開く

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (メモ帳を使用)
notepad %APPDATA%\opencode\opencode.json
```

2. 設定ファイルにプラグイン名を追加

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

ファイルに既に他のプラグインがある場合は、`plugin`配列に追加します：

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. ファイルを保存してOpenCodeを再起動

**期待される結果**：
- OpenCodeが再起動し、起動ログにプラグインの読み込み成功が表示される
- AIチャットで`get_available_skills`などのツールを使用できる

### 方法2：固定バージョンインストール（本番環境向け）

プラグインのバージョンをロックし、自動更新による予期せぬ問題を避けたい場合にこの方法を使用します。

**なぜこの方法か**
本番環境では通常バージョン管理が必要で、固定バージョンでチームが同じプラグインバージョンを使用していることを確認できます。

**手順**

1. OpenCode設定ファイルを開く

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. 設定ファイルにバージョン番号付きのプラグイン名を追加

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. ファイルを保存してOpenCodeを再起動

**期待される結果**：
- OpenCodeが固定バージョンv0.6.4で起動
- プラグインがローカルにキャッシュされ、毎回のダウンロードが不要

::: tip バージョン管理

固定バージョンのプラグインはOpenCodeのローカルにキャッシュされます。バージョンをアップグレードするには、バージョン番号を手動で変更して再起動する必要があります。[最新バージョン](https://www.npmjs.com/package/opencode-agent-skills)を確認して更新してください。

:::

### 方法3：ローカル開発インストール（貢献者向け）

プラグインをカスタマイズしたり、開発に参加したりしたい場合にこの方法を使用します。

**なぜこの方法か**
開発プロセスでコードの変更をすぐに確認でき、npmの公開を待つ必要がありません。

**手順**

1. リポジトリをOpenCode設定ディレクトリにクローン

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. プロジェクトディレクトリに移動して依存関係をインストール

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info なぜBunを使用するのか

プロジェクトはBunを実行時とパッケージマネージャーとして使用します。package.jsonの`engines`フィールドに従い、Bun >= 1.0.0が必要です。

:::

3. プラグインのシンボリックリンクを作成

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**期待される結果**：
- `~/.config/opencode/plugin/skills.ts`がローカルのプラグインコードを指している
- コードを変更した後、OpenCodeを再起動するとすぐに有効になる

---

## チェックポイント ✅

インストール完了後、以下の方法で検証してください：

**方法1：ツールリストを確認**

OpenCodeでAIに尋ねてください：

```
利用可能なすべてのツールをリストアップしてください。スキル関連のツールはありますか？
```

以下のツールが含まれているはずです：
- `use_skill` - スキルをロード
- `read_skill_file` - スキルファイルを読み込み
- `run_skill_script` - スクリプトを実行
- `get_available_skills` - 利用可能なスキルリストを取得

**方法2：ツールを呼び出す**

```
get_available_skillsを呼び出して、現在どのスキルが利用可能か確認してください
```

スキルリストが表示されるはずです（空の場合もありますが、ツール呼び出しは成功しています）。

**方法3：起動ログを確認**

OpenCodeの起動ログを確認すると、以下のような内容があるはずです：

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## よくある問題

### 問題1：OpenCode起動後にツールが表示されない

**考えられる原因**：
- 設定ファイルのJSON形式エラー（カンマや引用符の欠落など）
- OpenCodeのバージョンが低すぎる（>= v1.0.110が必要）
- プラグイン名の入力ミス

**解決方法**：
1. JSON検証ツールで設定ファイルの構文を確認
2. `opencode --version`を実行してバージョンを確認
3. プラグイン名が`opencode-agent-skills`であることを確認（ハイフンに注意）

### 問題2：固定バージョンをアップグレードしても有効にならない

**原因**：固定バージョンのプラグインはローカルにキャッシュされるため、バージョン番号を更新してもキャッシュをクリアする必要があります。

**解決方法**：
1. 設定ファイルのバージョン番号を変更
2. OpenCodeを再起動
3. まだ有効にならない場合は、OpenCodeのプラグインキャッシュをクリア（場所はシステムによって異なります）

### 問題3：ローカル開発インストール後に変更が有効にならない

**原因**：シンボリックリンクのエラーまたはBun依存関係がインストールされていない。

**解決方法**：
1. シンボリックリンクが正しいか確認：
    ```bash
    ls -la ~/.config/opencode/plugin/skills.ts
    ```
    `~/.config/opencode/opencode-agent-skills/src/plugin.ts`を指しているはずです

2. 依存関係がインストールされているか確認：
    ```bash
    cd ~/.config/opencode/opencode-agent-skills
    bun install
    ```

---

## まとめ

この章では3つのインストール方法を学びました：

- **基本インストール**：設定ファイルに`opencode-agent-skills`を追加、ほとんどの人に適している
- **固定バージョンインストール**：`opencode-agent-skills@バージョン番号`を追加、本番環境に適している
- **ローカル開発インストール**：リポジトリをクローンしてシンボリックリンクを作成、開発者に適している

インストール後は、ツールリスト、ツール呼び出し、または起動ログで検証できます。

---

## 次回の予告

> 次の章では**[最初のスキルを作成する](../creating-your-first-skill/)**を学習します。
>
> 学べること：
> - スキルディレクトリ構造
> - SKILL.mdのYAML frontmatter形式
> - スキルコンテンツの書き方

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能        | ファイルパス                                                                                    | 行番号    |
|--- | --- | ---|
| プラグインエントリ定義 | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18)         | 18      |
| プラグインメインファイル | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts)         | 全ファイル  |
| 依存関係設定    | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32   |
| バージョン要件    | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41   |

**主要な設定**：
- `main: "src/plugin.ts"`：プラグインエントリファイル
- `engines.bun: ">=1.0.0"`：ランタイムバージョン要件

**主要な依存関係**：
- `@opencode-ai/plugin ^1.0.115`：OpenCodeプラグインSDK
- `@huggingface/transformers ^3.8.1`：意味的マッチングモデル
- `zod ^4.1.13`：スキーマ検証
- `yaml ^2.8.2`：YAML解析

</details>
