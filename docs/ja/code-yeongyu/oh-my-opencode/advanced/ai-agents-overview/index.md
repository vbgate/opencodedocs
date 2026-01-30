---
title: "AIエージェント: 10名の専門家紹介 | oh-my-opencode"
sidebarTitle: "10名のAI専門家を知る"
subtitle: "AIエージェント: 10名の専門家紹介"
description: "oh-my-opencodeの10個のAIエージェントを学習。タスクタイプに応じてエージェントを選択し、効率的な協働と並列実行を実現する。"
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# AIエージェントチーム：10名の専門家紹介

## 学習後にできること

- 10個の組み込みAIエージェントの責務と専門性を理解する
- タスクタイプに応じて最適なエージェントを迅速に選択する
- エージェント間の協働メカニズム（委任、並列、レビュー）を理解する
- 異なるエージェントの権限制限と使用シナリオを習得する

## 核心的な考え方：実在のチームのように協働する

**oh-my-opencode**の核となる考え方は：**AIを万能なアシスタントとして扱わず、専門チームとして扱う**ことです。

実際の開発チームでは、以下のような役割が必要です：
- **主オーケストレーター**（Tech Lead）：計画、タスク割り当て、進捗管理を担当
- **アーキテクチャアドバイザー**（Architect）：技術的決定とアーキテクチャ設計アドバイスを提供
- **コードレビュー担当**（Reviewer）：コード品質を確認し、潜在的な問題を発見
- **リサーチ専門家**（Researcher）：ドキュメントを検索、オープンソース実装を調査、ベストプラクティスを調査
- **コード探偵**（Searcher）：コードを迅速に特定、参照を検索、既存の実装を理解
- **フロントエンドデザイナー**（Frontend Designer）：UIを設計、スタイルを調整
- **Git専門家**（Git Master）：コードをコミット、ブランチを管理、履歴を検索

oh-my-opencodeはこれらの役割を10の専門AIエージェントとして実装し、タスクタイプに応じて柔軟に組み合わせて使用できます。

## 10個のエージェント詳細

### 主オーケストレーター（2個）

#### Sisyphus - 主オーケストレーター

**役割**：主オーケストレーター、あなたの主要テックリード

**能力**：
- 深度推論（32k thinking budget）
- 複雑なタスクの計画と委任
- コードの変更とリファクタリングの実行
- 開発プロセス全体の管理

**推奨モデル**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用シナリオ**：
- 日常的な開発タスク（新機能の追加、バグの修正）
- 深度推論が必要な複雑な問題
- マルチステップタスクの分解と実行
- 他のエージェントへの並列委任が必要なシナリオ

**呼び出し方法**：
- デフォルトの主エージェント（OpenCode Agent セレクターの「Sisyphus」）
- プロンプトにタスクを直接入力、特別なトリガーワードは不要

**権限**：完全なツール権限（write、edit、bash、delegate_task など）

---

#### Atlas - TODOマネージャー

**役割**：主オーケストレーター、TODOリスト管理とタスク実行追跡に特化

**能力**：
- TODOリストの管理と追跡
- システマティックな実行計画
- タスク進捗のモニタリング

**推奨モデル**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用シナリオ**：
- `/start-work` コマンドを使用してプロジェクト実行を開始
- 計画に従って厳密にタスクを完了する必要がある場合
- システマティックにタスク進捗を追跡する場合

**呼び出し方法**：
- スラッシュコマンド `/start-work` を使用
- Atlas Hook 経由で自動アクティベーション

**権限**：完全なツール権限

---

### アドバイザーとレビュー担当（3個）

#### Oracle - 戦略アドバイザー

**役割**：読み取り専用技術アドバイザー、高知能推論の専門家

**能力**：
- アーキテクチャ決定のアドバイス
- 複雑な問題の診断
- コードレビュー（読み取り専用）
- マルチシステムのトレードオフ分析

**推奨モデル**：`openai/gpt-5.2`（temperature: 0.1）

**使用シナリオ**：
- 複雑なアーキテクチャ設計
- 重要な作業完了後の自己レビュー
- 2回以上の修正に失敗した困難なデバッグ
- 慣れないコードパターンやアーキテクチャ
- セキュリティ/パフォーマンス関連の問題

**トリガー条件**：
- プロンプトに `@oracle` が含まれる、または `delegate_task(agent="oracle")` を使用
- 複雑なアーキテクチャ決定時に自動推奨

**制限**：読み取り専用権限（write、edit、task、delegate_taskは禁止）

**基本原則**：
- **ミニマリズム**：最もシンプルな解決策を好む
- **既存リソースの活用**：新しい依存関係を導入せず、現在のコードを優先して修正
- **開発者体験優先**：可読性、保守性 > 理論上のパフォーマンス
- **単一の明確なパス**：主なアドバイスを1つ提供し、トレードオフの差が顕著な場合のみ代替案を提示

---

#### Metis - 事前計画アナリスト

**役割**：計画前の要件分析とリスク評価の専門家

**能力**：
- 隠れた要件と明示されていない要件の特定
- AI失敗を引き起こす曖昧さの検出
- AIスロップパターン（過度なエンジニアリング、スコープクリープ）のマーキング
- 計画エージェント向けの指示準備

**推奨モデル**：`anthropic/claude-sonnet-4-5`（temperature: 0.3）

**使用シナリオ**：
- Prometheus計画の前
- ユーザーリクエストが曖昧またはオープンな場合
- AIの過度なエンジニアリングパターンを防止する場合

**呼び出し方法**：Prometheusが自動呼び出し（面接モード）

**制限**：読み取り専用権限（write、edit、task、delegate_taskは禁止）

**基本フロー**：
1. **意図分類**：リファクタリング / ゼロから構築 / 中程度のタスク / 協働 / アーキテクチャ / 調査
2. **意図固有の分析**：タイプに応じた対象的なアドバイスを提供
3. **質問生成**：ユーザーに対して明確な質問を生成
4. **指示準備**：Prometheus向けの明確な「MUST」と「MUST NOT」指示を生成

---

#### Momus - 計画レビュアー

**役割**：厳格な計画レビューの専門家、すべての欠落と曖昧さを発見

**能力**：
- 計画の明確性、検証可能性、完全性を検証
- すべてのファイル参照とコンテキストを確認
- 実際の実装ステップをシミュレート
- 重要な欠落を特定

**推奨モデル**：`anthropic/claude-sonnet-4-5`（temperature: 0.1）

**使用シナリオ**：
- Prometheusが作業計画を作成した後
- 複雑なTODOリストを実行する前
- 計画品質を検証する場合

**呼び出し方法**：Prometheusが自動呼び出し

**制限**：読み取り専用権限（write、edit、task、delegate_taskは禁止）

**4つのレビュー基準**：
1. **作業内容の明確性**：各タスクは参照ソースを指定しているか？
2. **検証と受入基準**：具体的な成功検証方法はあるか？
3. **コンテキストの完全性**：十分なコンテキストが提供されているか（90%信頼度の閾値）？
4. **全体理解**：開発者はWHY、WHAT、HOWを理解しているか？

**基本原則**：**ドキュメントレビュアーであり、設計アドバイザーではない**。評価するのは「計画が実行可能なほど明確かどうか」であり、「選択した方法が正しいかどうか」ではない。

---

### 調査と探索（3個）

#### Librarian - マルチリポジトリ調査の専門家

**役割**：オープンソースコードベース理解の専門家、ドキュメントと実装例の検索に特化

**能力**：
- GitHub CLI：リポジトリのクローン、issues/PRsの検索、履歴の確認
- Context7：公式ドキュメントのクエリ
- Web Search：最新情報の検索
- パーマリンク付きの証拠を生成

**推奨モデル**：`opencode/big-pickle`（temperature: 0.1）

**使用シナリオ**：
- 「[ライブラリ]の使い方は？」
- 「[フレームワーク機能]のベストプラクティスは？」
- 「[外部依存]なぜこのような動作をする？」
- 「[ライブラリ]の使用例を検索」

**トリガー条件**：
- 外部ライブラリ/ソースに言及した際に自動トリガー
- プロンプトに `@librarian` が含まれる

**リクエストタイプ分類**：
- **Type A（概念的）**：「Xの方法は？」、「ベストプラクティス」
- **Type B（実装リファレンス）**：「XはYをどう実装する？」、「Zのソースを表示」
- **Type C（コンテキストと履歴）**：「なぜこのような変更が？」、「Xの歴史は？」
- **Type D（総合調査）**：複雑/曖昧なリクエスト

**制限**：読み取り専用権限（write、edit、task、delegate_task、call_omo_agentは禁止）

**強制要件**：すべてのコード宣言はGitHubパーマリンクを含める必要がある

---

#### Explore - 高速コードベース探索の専門家

**役割**：コンテキストを認識したコード検索の専門家

**能力**：
- LSPツール：定義、参照、シンボルナビゲーション
- AST-Grep：構造パターン検索
- Grep：テキストパターン検索
- Glob：ファイル名パターンマッチング
- 並列実行（3つ以上のツールを同時実行）

**推奨モデル**：`opencode/gpt-5-nano`（temperature: 0.1）

**使用シナリオ**：
- 2つ以上の検索アングルが必要な広範な検索
- 慣れないモジュール構造
- クロスレイヤーパターン発見
- 「Xはどこに？」、「どのファイルにYがある？」の検索

**トリガー条件**：
- 2つ以上のモジュールに関与する場合に自動トリガー
- プロンプトに `@explore` が含まれる

**強制出力フォーマット**：
```
<analysis>
**Literal Request**: [ユーザーの文字通りのリクエスト]
**Actual Need**: [実際に必要なもの]
**Success Looks Like**: [成功はどのように見えるか]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [なぜこのファイルが関連するか]
- /absolute/path/to/file2.ts — [なぜこのファイルが関連するか]
</files>

<answer>
[実際のニーズに直接回答]
</answer>

<next_steps>
[次に何をすべきか]
</next_steps>
</results>
```

**制限**：読み取り専用権限（write、edit、task、delegate_task、call_omo_agentは禁止）

---

#### Multimodal Looker - メディア分析の専門家

**役割**：純テキストとして読み取れないメディアファイルを解釈

**能力**：
- PDF：テキスト、構造、テーブル、特定セクションのデータを抽出
- 画像：レイアウト、UI要素、テキスト、グラフを記述
- ダイアグラム：関係性、フロー、アーキテクチャを解釈

**推奨モデル**：`google/gemini-3-flash`（temperature: 0.1）

**使用シナリオ**：
- PDFから構造化データを抽出する必要がある場合
- 画像内のUI要素やグラフを記述する場合
- 技術文書のダイアグラムを解析する場合

**呼び出し方法**：`look_at` ツール経由で自動トリガー

**制限**：**読み取り専用ホワイトリスト**（readツールのみ許可）

---

### 計画と実行（2個）

#### Prometheus - 戦略プランナー

**役割**：面接式のニーズ収集と作業計画生成の専門家

**能力**：
- 面接モード：ニーズが明確になるまで継続的に質問
- 作業計画生成：構造化されたMarkdown計画ドキュメント
- 並列委任：Oracle、Metis、Momusに計画を検証してもらう

**推奨モデル**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用シナリオ**：
- 複雑なプロジェクトの詳細計画を作成
- 要件を明確にする必要があるプロジェクト
- システマティックなワークフロー

**呼び出し方法**：
- プロンプトに `@prometheus` または「Prometheusを使用」が含まれる
- スラッシュコマンド `/start-work` を使用

**ワークフロー**：
1. **面接モード**：ニーズが明確になるまで継続的に質問
2. **計画の起草**：構造化されたMarkdown計画を生成
3. **並列委任**：
   - `delegate_task(agent="oracle", prompt="アーキテクチャ決定をレビュー")` → バックグラウンド実行
   - `delegate_task(agent="metis", prompt="潜在的リスクを特定")` → バックグラウンド実行
   - `delegate_task(agent="momus", prompt="計画の完全性を検証")` → バックグラウンド実行
4. **フィードバックの統合**：計画を改善
5. **計画の出力**：`.sisyphus/plans/{name}.md` に保存

**制限**：計画のみ、コードの実装はしない（`prometheus-md-only` Hookで強制）

---

#### Sisyphus Junior - タスクエクゼキューター

**役割**：カテゴリ生成のサブエージェントエクゼキューター

**能力**：
- カテゴリ設定を継承（モデル、temperature、prompt_append）
- スキル（専門スキル）をロード
- 委任されたサブタスクを実行

**推奨モデル**：カテゴリから継承（デフォルト `anthropic/claude-sonnet-4-5`）

**使用シナリオ**：
- `delegate_task(category="...", skills=["..."])` を使用する際に自動生成
- 特定のカテゴリとスキルの組み合わせが必要なタスク
- 軽量な高速タスク（「quick」カテゴリはHaikuモデルを使用）

**呼び出し方法**：`delegate_task` ツール経由で自動生成

**制限**：task、delegate_taskは禁止（再度の委任は不可）

---

## エージェント呼び出し方法クイックリファレンス

| エージェント | 呼び出し方法 | トリガー条件 |
|---|---|---|
| **Sisyphus** | デフォルト主エージェント | 日常的な開発タスク |
| **Atlas** | `/start-work` コマンド | プロジェクト実行を開始 |
| **Oracle** | `@oracle` または `delegate_task(agent="oracle")` | 複雑なアーキテクチャ決定、2+回の修正失敗 |
| **Librarian** | `@librarian` または `delegate_task(agent="librarian")` | 外部ライブラリ/ソースに言及時に自動トリガー |
| **Explore** | `@explore` または `delegate_task(agent="explore")` | 2+モジュールに関与時に自動トリガー |
| **Multimodal Looker** | `look_at` ツール | PDF/画像を分析する必要がある場合 |
| **Prometheus** | `@prometheus` または `/start-work` | プロンプトに「Prometheus」が含まれるか、計画が必要 |
| **Metis** | Prometheus自動呼び出し | 計画前に自動分析 |
| **Momus** | Prometheus自動呼び出し | 計画生成後に自動レビュー |
| **Sisyphus Junior** | `delegate_task(category=...)` | カテゴリ/スキルを使用時に自動生成 |

---

## どのエージェントをいつ使うか

::: tip クイック決定木

**シナリオ1：日常的な開発（コードの作成、バグの修正）**
→ **Sisyphus**（デフォルト）

**シナリオ2：複雑なアーキテクチャ決定**
→ **@oracle** コンサルティング

**シナリオ3：外部ライブラリのドキュメントや実装を検索する必要がある場合**
→ **@librarian** または自動トリガー

**シナリオ4：慣れないコードベースで、関連コードを見つける必要がある場合**
→ **@explore** または自動トリガー（2+モジュール）

**シナリオ5：複雑なプロジェクトで詳細な計画が必要な場合**
→ **@prometheus** または `/start-work` を使用

**シナリオ6：PDFまたは画像を分析する必要がある場合**
→ **look_at** ツール（Multimodal Lookerを自動トリガー）

**シナリオ7：高速でシンプルなタスクで、コストを節約したい場合**
→ `delegate_task(category="quick")`

**シナリオ8：Gitの専門的操作が必要な場合**
→ `delegate_task(category="quick", skills=["git-master"])`

**シナリオ9：フロントエンドUIデザインが必要な場合**
→ `delegate_task(category="visual-engineering")`

**シナリオ10：高知能推論タスクが必要な場合**
→ `delegate_task(category="ultrabrain")`

:::

---

## エージェント協働例：完全なワークフロー

### 例1：複雑な機能開発

```
ユーザー：ユーザー認証システムを開発する

→ Sisyphusがタスクを受信
  → 要件を分析し、外部ライブラリ（JWT）が必要と判断
  → 並列委任：
    - @librarian: "Next.js JWTのベストプラクティスを検索" → [バックグラウンド]
    - @explore: "既存の認証関連コードを検索" → [バックグラウンド]
  → 結果を待機し、情報を統合
  → JWT認証機能を実装
  → 完了後に委任：
    - @oracle: "アーキテクチャ設計をレビュー" → [バックグラウンド]
  → アドバイスに基づいて最適化
```

---

### 例2：プロジェクト計画

```
ユーザー：Prometheusを使用してこのプロジェクトを計画する

→ Prometheusがタスクを受信
  → 面接モード：
    - 質問1：コア機能は何ですか？
    - [ユーザー回答]
    - 質問2：ターゲットユーザーグループは？
    - [ユーザー回答]
    - ...
  → 要件が明確になった後、並列委任：
    - delegate_task(agent="oracle", prompt="アーキテクチャ決定をレビュー") → [バックグラウンド]
    - delegate_task(agent="metis", prompt="潜在的リスクを特定") → [バックグラウンド]
    - delegate_task(agent="momus", prompt="計画の完全性を検証") → [バックグラウンド]
  → すべてのバックグラウンドタスクが完了するのを待機
  → フィードバックを統合し、計画を改善
  → Markdown計画ドキュメントを出力
→ ユーザーが計画を確認、承認
→ /start-workを使用して実行を開始
```

---

## エージェント権限と制限

| エージェント | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
|---|---|---|---|---|---|---|---|---|
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## 本レッスンのまとめ

oh-my-opencodeの10個のAIエージェントは、開発プロセスのすべての段階をカバーしています：

- **オーケストレーションと実行**：Sisyphus（主オーケストレーター）、Atlas（TODOマネージャー）
- **アドバイザーとレビュー**：Oracle（戦略アドバイザー）、Metis（事前計画分析）、Momus（計画レビュアー）
- **調査と探索**：Librarian（マルチリポジトリ調査）、Explore（コードベース探索）、Multimodal Looker（メディア分析）
- **計画**：Prometheus（戦略プランニング）、Sisyphus Junior（サブタスク実行）

**核心ポイント**：
1. AIを万能なアシスタントではなく、専門チームとして扱う
2. タスクタイプに応じて最適なエージェントを選択する
3. 並列委任を活用して効率を向上させる（Librarian、Explore、Oracleはすべてバックグラウンドで実行可能）
4. 各エージェントの権限制限を理解する（読み取り専用エージェントはコードを修正できない）
5. エージェント間の協働は完全なワークフローを形成できる（計画 → 実行 → レビュー）

---

## 次のレッスン予告

> 次のレッスンでは **[Prometheus プランニング：面接式ニーズ収集](../prometheus-planning/)** を学習します。
>
> 学習内容：
> - Prometheusを使用した面接式ニーズ収集の方法
> - 構造化された作業計画の生成方法
> - MetisとMomusによる計画の検証方法
> - バックグラウンドタスクの取得とキャンセル方法

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-26

| エージェント | ファイルパス | 行番号 |
|---|---|---|
| Sisyphus 主オーケストレーター | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas 主オーケストレーター | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle アドバイザー | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian 調査専門家 | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore 検索専門家 | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus プランナー | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Metis 事前計画分析 | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Momus 計画レビュアー | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| エージェントメタデータ定義 | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| エージェントツール制限 | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**重要な設定**：
- `ORACLE_PROMPT_METADATA`：Oracleエージェントのメタデータ（トリガー条件、使用シナリオ）
- `LIBRARIAN_PROMPT_METADATA`：Librarianエージェントのメタデータ
- `EXPLORE_PROMPT_METADATA`：Exploreエージェントのメタデータ
- `MULTIMODAL_LOOKER_PROMPT_METADATA`：Multimodal Lookerエージェントのメタデータ
- `METIS_SYSTEM_PROMPT`：Metisエージェントのシステムプロンプト
- `MOMUS_SYSTEM_PROMPT`：Momusエージェントのシステムプロンプト

**重要な関数**：
- `createOracleAgent(model)`：Oracleエージェント設定を作成
- `createLibrarianAgent(model)`：Librarianエージェント設定を作成
- `createExploreAgent(model)`：Exploreエージェント設定を作成
- `createMultimodalLookerAgent(model)`：Multimodal Lookerエージェント設定を作成
- `createMetisAgent(model)`：Metisエージェント設定を作成
- `createMomusAgent(model)`：Momusエージェント設定を作成

**権限制限**：
- `createAgentToolRestrictions()`：エージェントツール制限を作成（Oracle、Librarian、Explore、Metis、Momusが使用）
- `createAgentToolAllowlist()`：エージェントツールホワイトリストを作成（Multimodal Lookerが使用）

</details>
