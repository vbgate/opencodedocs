---
title: "基本概念: スキルの統合エコシステム | OpenSkills"
sidebarTitle: "AIツール間でスキルを共有"
subtitle: "基本概念: スキルの統合エコシステム | OpenSkills"
description: "OpenSkillsの基本概念と動作原理を学習します。スキルの統合ローダーとして、複数のエージェント間でのスキル共有や段階的な読み込みに対応しています。"
tags:
  - "概念説明"
  - "基本概念"
prerequisite: []
order: 2
---

# OpenSkillsとは？

## 学習後にできること

- OpenSkillsの核心的な価値と動作原理を理解する
- OpenSkillsとClaude Codeの関係性を把握する
- いつOpenSkillsを使用すべきか、組み込みスキルシステムとの使い分けができる
- 複数のAIコーディングエージェント間でスキルエコシステムを共有する方法を理解する

::: info 前提知識
本チュートリアルでは、AIコーディングツール（Claude Code、Cursorなど）の基本的な知識を持っていることを前提としていますが、OpenSkillsの使用経験は必要ありません。
:::

---

## 現在の課題

あなたはこんな状況に遭遇しているかもしれません：

- **Claude Codeで使い慣れたスキルが、別のAIツールでは使えない**：例えばClaude CodeのPDF処理スキルは、Cursorでは使用できない
- **異なるツールでスキルを個別にインストール**：各AIツールに個別にスキルを設定する必要があり、管理コストが高い
- **プライベートスキルを使いたいが、公式Marketplaceが対応していない**：社内や個人で開発したスキルを、チームと簡単に共有する方法がない

これらの問題の本質は：**スキルフォーマットが統一されておらず、ツール間での共有ができない**ことです。

---

## 核心的アプローチ：スキルフォーマットの統一

OpenSkillsの核心的なアイデアは非常にシンプルです：**Claude Codeのスキルシステムを汎用的なスキルローダーにする**ことです。

### それは何か

**OpenSkills**は、Anthropicのスキルシステムの汎用ローダーであり、あらゆるAIコーディングエージェント（Claude Code、Cursor、Windsurf、Aiderなど）が標準のSKILL.md形式のスキルを使用できるようにします。

簡単に言えば：**1つのインストーラーで、すべてのAIコーディングツールに対応**します。

### どんな問題を解決するか

| 問題 | 解決策 |
| --- | --- |
| スキルフォーマットが統一されていない | Claude Codeの標準SKILL.md形式を使用 |
| スキルがツール間で共有できない | 統一されたAGENTS.mdを生成し、すべてのツールが読み取り可能 |
| スキル管理が分散している | 統一されたインストール、更新、削除コマンド |
| プライベートスキルの共有が困難 | ローカルパスとプライベートgitリポジトリからのインストールに対応 |

---

## 核心的価値

OpenSkillsは以下の核心的な価値を提供します：

### 1. 統一された標準

すべてのエージェントが同じスキル形式とAGENTS.md記述を使用するため、新しい形式を学ぶ必要がありません。

- **Claude Codeとの完全な互換性**：同じプロンプト形式、同じMarketplace、同じフォルダ構造
- **標準化されたSKILL.md**：スキル定義が明確で、開発と保守が容易

### 2. 段階的な読み込み

必要に応じてスキルを読み込み、AIのコンテキストを簡潔に保ちます。

- すべてのスキルを一度に読み込む必要がない
- AIエージェントはタスクの要件に基づいて動的に関連スキルを読み込む
- コンテキスト爆発を回避し、応答品質を向上させる

### 3. マルチエージェント対応

1セットのスキルで複数のエージェントに対応し、繰り返しインストールする必要がありません。

- Claude Code、Cursor、Windsurf、Aiderが同じスキルセットを共有
- 統一されたスキル管理インターフェース
- 設定と保守のコストを削減

### 4. オープンソースフレンドリー

ローカルパスとプライベートgitリポジトリをサポートし、チームコラボレーションに適しています。

- ローカルファイルシステムからスキルをインストール（開発中）
- プライベートgitリポジトリからインストール（社内共有）
- スキルをプロジェクトと一緒にバージョン管理可能

### 5. ローカル実行

データがアップロードされず、プライバシーが保護されます。

- すべてのスキルファイルはローカルに保存
- クラウドサービスに依存せず、データ漏洩のリスクがない
- 機密性の高いプロジェクトやエンタープライズ環境に適している

---

## 動作原理

OpenSkillsのワークフローは非常にシンプルで、3つのステップに分かれています：

### ステップ1：スキルのインストール

GitHub、ローカルパス、またはプライベートgitリポジトリからスキルをプロジェクトにインストールします。

```bash
# Anthropicの公式リポジトリからインストール
openskills install anthropics/skills

# ローカルパスからインストール
openskills install ./my-skills
```

スキルはプロジェクトの`.claude/skills/`ディレクトリ（デフォルト）または`.agent/skills/`ディレクトリ（`--universal`使用時）にインストールされます。

### ステップ2：AGENTS.mdへの同期

インストールされたスキルをAGENTS.mdファイルに同期し、AIエージェントが読み取り可能なスキルリストを生成します。

```bash
openskills sync
```

AGENTS.mdには、このようなXMLが含まれます：

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### ステップ3：AIエージェントによるスキルの読み込み

AIエージェントがスキルを使用する必要があるとき、以下のコマンドでスキル内容を読み込みます：

```bash
openskills read <skill-name>
```

AIエージェントはスキル内容を動的にコンテキストに読み込み、タスクを実行します。

---

## Claude Codeとの関係

OpenSkillsとClaude Codeは補完関係にあり、代替関係ではありません。

### 完全なフォーマット互換性

| 側面 | Claude Code | OpenSkills |
| --- | --- | ---|
| **プロンプトフォーマット** | `<available_skills>` XML | 同じXML |
| **スキルストレージ** | `.claude/skills/` | `.claude/skills/` (デフォルト) |
| **スキル呼び出し** | `Skill("name")` ツール | `npx openskills read <name>` |
| **Marketplace** | Anthropic marketplace | GitHub (anthropics/skills) |
| **段階的な読み込み** | ✅ | ✅ |

### 使用シナリオの比較

| シナリオ | 推奨ツール | 理由 |
| --- | --- | ---|
| Claude Codeのみを使用 | Claude Codeの組み込み機能 | 追加インストール不要、公式サポート |
| 複数のAIツールを混在して使用 | OpenSkills | 統一管理、重複を回避 |
| プライベートスキルが必要 | OpenSkills | ローカルとプライベートリポジトリに対応 |
| チームでの協業 | OpenSkills | スキルのバージョン管理が可能、共有が容易 |

---

## インストール場所の説明

OpenSkillsは3つのインストール場所に対応しています：

| インストール場所 | コマンド | 適用シナリオ |
| --- | --- | ---|
| **プロジェクトローカル** | デフォルト | 単一プロジェクトで使用、スキルをプロジェクトと一緒にバージョン管理 |
| **グローバルインストール** | `--global` | すべてのプロジェクトで共通のスキルを共有 |
| **Universalモード** | `--universal` | マルチエージェント環境、Claude Codeとの競合を回避 |

::: tip いつUniversalモードを使用すべきか？
Claude Codeとその他のAIコーディングエージェント（Cursor、Windsurfなど）を同時に使用する場合は、`--universal`を使用して`.agent/skills/`にインストールすることで、複数のエージェントが同じスキルセットを共有でき、競合を回避できます。
:::

---

## スキルエコシステム

OpenSkillsはClaude Codeと同じスキルエコシステムを使用します：

### 公式スキルライブラリ

Anthropicが公式にメンテナンスするスキルリポジトリ：[anthropics/skills](https://github.com/anthropics/skills)

以下のようなスキルを含みます：
- PDF処理
- 画像生成
- データ分析
- その他...

### コミュニティスキル

SKILL.mdファイルを含むあらゆるGitHubリポジトリが、スキルソースとして使用できます。

### カスタムスキル

標準形式を使用して独自のスキルを作成し、チームと共有することができます。

---

## レッスンのまとめ

OpenSkillsの核心的なアイデアは：

1. **統一された標準**：Claude CodeのSKILL.md形式を使用
2. **マルチエージェント対応**：すべてのAIコーディングツールがスキルエコシステムを共有
3. **段階的な読み込み**：必要に応じて読み込み、コンテキストを簡潔に保つ
4. **ローカル実行**：データがアップロードされず、プライバシーが保護される
5. **オープンソースフレンドリー**：ローカルとプライベートリポジトリに対応

OpenSkillsを使用することで：
- 異なるAIツール間でシームレスに切り替え
- すべてのスキルを統一管理
- プライベートスキルを使用して共有
- 開発効率を向上

---

## 次のレッスンの予告

> 次のレッスンでは、**[OpenSkillsツールのインストール](../installation/)**を学習します。
>
> 学べる内容：
> - Node.jsとGit環境の確認方法
> - npxまたはグローバルでのOpenSkillsインストール方法
> - インストールの成功確認方法
> - 一般的なインストール問題の解決方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | ---|
| コア型定義 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| スキルインターフェース（Skill） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| スキル位置インターフェース（SkillLocation） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| インストールオプションインターフェース（InstallOptions） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| スキルメタデータインターフェース（SkillMetadata） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**重要なインターフェース**：
- `Skill`：インストール済みスキル情報（name, description, location, path）
- `SkillLocation`：スキル検索位置情報（path, baseDir, source）
- `InstallOptions`：インストールコマンドオプション（global, universal, yes）
- `SkillMetadata`：スキルメタデータ（name, description, context）

**核心概念の出典**：
- README.md:22-86 - "What Is OpenSkills?" 章

</details>
