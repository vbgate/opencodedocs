---
title: "紹介: OpenCode Agent Skills | opencode-agent-skills"
sidebarTitle: "AIにスキルを理解させる"
subtitle: "紹介: OpenCode Agent Skills"
description: "OpenCode Agent Skillsの核心価値と主要機能を学びます。動的スキル検出、コンテキスト注入、圧縮回復などの特性をマスターし、Claude Code互換と自動推奨をサポートします。"
tags:
  - "入門ガイド"
  - "プラグイン紹介"
prerequisite: []
order: 1
---

# OpenCode Agent Skillsとは？

## このコースでできること

- OpenCode Agent Skillsプラグインの核心価値を理解する
- プラグインが提供する主要機能特性を習得する
- スキルが自動的に検出・ロードされる仕組みを理解する
- 本プラグインと他のスキル管理ソリューションの違いを区別する

## 今の課題

以下のような状況に遭遇したことがあるかもしれません：

- **スキルの分散管理が困難**：スキルがプロジェクト、ユーザーディレクトリ、プラグインキャッシュなど複数の場所に散らばっており、適切なスキルが見つからない
- **セッションが長くなると手間が増える**：長時間のセッション後、以前ロードしたスキルがコンテキスト圧縮により無効になる
- **互換性への懸念**：Claude Codeから移行した後、既存のスキルやプラグインが使えなくなるのではないかと心配
- **設定を繰り返す必要がある**：各プロジェクトでスキルを再設定する必要があり、統一されたスキル管理メカニズムが不足している

これらの問題がAIアシスタントの使用効率に影響を与えています。

## コアコンセプト

**OpenCode Agent Skills**は、OpenCodeに動的スキル検出・管理能力を提供するプラグインシステムです。

::: info スキルとは？
スキル（Skill）は、AIワークフローのガイダンスを含む再利用可能なモジュールです。通常は `SKILL.md` ファイル（スキルの機能と使用方法を記述）を含むディレクトリであり、補助ファイル（ドキュメント、スクリプトなど）が含まれる場合もあります。
:::

**核心価値**：標準化されたスキル形式（SKILL.md）を通じて、プロジェクト間・セッション間でのスキル再利用を実現します。

### 技術アーキテクチャ

プラグインは TypeScript + Bun + Zod で開発され、4つのコアツールを提供します：

| ツール | 機能 |
|--- | ---|
| `use_skill` | スキルのSKILL.md内容をセッションコンテキストに注入 |
| `read_skill_file` | スキルディレクトリ内のサポートファイル（ドキュメント、設定など）を読み取り |
| `run_skill_script` | スキルディレクトリのコンテキストで実行可能なスクリプトを実行 |
| `get_available_skills` | 現在使用可能なスキルリストを取得 |

## 主要機能特性

### 1. 動的スキル検出

プラグインは複数の場所から自動的にスキルを検出し、優先順位でソートします：

```
1. .opencode/skills/              (プロジェクトレベル - OpenCode)
2. .claude/skills/                (プロジェクトレベル - Claude Code)
3. ~/.config/opencode/skills/     (ユーザーレベル - OpenCode)
4. ~/.claude/skills/              (ユーザーレベル - Claude Code)
5. ~/.claude/plugins/cache/        (プラグインキャッシュ)
6. ~/.claude/plugins/marketplaces/ (インストール済みプラグイン)
```

**ルール**：最初に一致したスキルが有効になり、後続の同名スキルは無視されます。

> なぜこの設計に？
>
> プロジェクトレベルのスキルがユーザーレベルのスキルより優先されるため、プロジェクトで特定の動作をカスタマイズしても、グローバル設定には影響しません。

### 2. コンテキスト注入

`use_skill` を呼び出すと、スキル内容がXML形式でセッションコンテキストに注入されます：

- `noReply: true` - AIは注入されたメッセージに応答しない
- `synthetic: true` - システムが生成したメッセージとしてマーク（UIに表示されず、ユーザー入力にはカウントされない）

つまり、スキル内容はセッションコンテキストに永続的に存在し、セッションが成長してコンテキスト圧縮が発生しても、スキルは引き続き使用可能です。

### 3. 圧縮回復メカニズム

OpenCodeがコンテキスト圧縮を実行すると（長時間セッションでよく行われる操作）、プラグインは `session.compacted` イベントを監視し、自動的に使用可能なスキルリストを再注入します。

これにより、AIは長時間セッションでも常に使用可能なスキルを認識し、圧縮によってスキルアクセス能力を失うことがありません。

### 4. Claude Code互換

プラグインはClaude Codeのスキル・プラグインシステムと完全に互換しており、以下をサポートしています：

- Claude Codeスキル（`.claude/skills/<skill-name>/SKILL.md`）
- Claudeプラグインキャッシュ（`~/.claude/plugins/cache/...`）
- Claudeプラグインマーケットプレース（`~/.claude/plugins/marketplaces/...`）

つまり、以前Claude Codeを使用していた場合、OpenCodeに移行した後でも既存のスキルとプラグインを使用できます。

### 5. 自動スキル推奨

プラグインはメッセージを監視し、意味的類似度を使用して使用可能なスキルに関連しているかを検出します：

- メッセージのembeddingベクトルを計算
- すべてのスキルの説明と余弦類似度を計算
- 類似度がしきい値を超えた場合、AIが関連スキルをロードするよう推奨する評価プロンプトを注入

このプロセスは完全に自動化されており、スキル名を記憶したり明示的に要求したりする必要はありません。

### 6. Superpowers統合（オプション）

プラグインはSuperpowersワークフローをサポートし、環境変数で有効化できます：

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

有効化すると、プラグインは自動的に `using-superpowers` スキルを検出し、セッション初期化時に完全なワークフローガイダンスを注入します。

## 他のソリューションとの比較

| ソリューション | 特徴 | 適用シーン |
|--- | --- | ---|
| **opencode-agent-skills** | 動的検出、圧縮回復、自動推奨 | 統一管理と自動推奨が必要なシーン |
| **opencode-skills** | 自動的に `skills_{{name}}` ツールとして登録 | 独立したツール呼び出しが必要なシーン |
| **superpowers** | 完全なソフトウェア開発ワークフロー | 厳密なプロセス規範が必要なプロジェクト |
| **skillz** | MCPサーバーモード | ツールをまたいでスキルを使用するシーン |

本プラグインを選ぶ理由：

- ✅ **設定不要**：スキルの自動検出・管理
- ✅ **スマートな推奨**：意味的マッチングに基づく自動推奨
- ✅ **圧縮回復**：長時間セッションで安定・信頼性が高い
- ✅ **互換性**：Claude Codeスキルのシームレスな移行

## 本講のまとめ

OpenCode Agent Skillsプラグインは、動的検出、コンテキスト注入、圧縮回復などのコアメカニズムを通じて、OpenCodeに完全なスキル管理能力を提供します。その核心価値は：

- **自動化**：手動設定とスキル名の記憶を軽減
- **安定性**：長時間セッションでもスキルは常に使用可能
- **互換性**：既存のClaude Codeエコシステムとシームレスに統合

## 次回の予告

> 次回は **[OpenCode Agent Skillsのインストール](../installation/)** を学びます。
>
> 学ぶこと：
> - OpenCode設定にプラグインを追加する方法
> - プラグインが正しくインストールされているか確認する方法
> - ローカル開発モードの設定方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| プラグインエントリと機能概要 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| コア機能特性リスト | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| スキル検出優先順位 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| 合成メッセージ注入 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| 圧縮回復メカニズム | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| 意味的マッチングモジュール | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**重要な定数**：
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`：使用するembeddingモデル
- `SIMILARITY_THRESHOLD = 0.35`：意味的類似度のしきい値
- `TOP_K = 5`：自動推奨で返すスキル数の上限

**重要な関数**：
- `discoverAllSkills()`：複数の場所からスキルを検出
- `use_skill()`：スキル内容をセッションコンテキストに注入
- `matchSkills()`：意味的類似度に基づいて関連スキルをマッチング
- `injectSyntheticContent()`：合成メッセージをセッションに注入

</details>
