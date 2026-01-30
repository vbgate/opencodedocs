---
title: "ベストプラクティス: Agent Skillsを効率的に使用する | Agent Skills"
sidebarTitle: "AIを高速化する"
subtitle: "ベストプラクティスの使用"
description: "Agent Skillsの効率的な使用方法を学びます。トリガーキーワードの選択テクニック、コンテキスト管理戦略、複数スキルの連携シナリオ、パフォーマンス最適化の提案を習得し、Tokenの消費を削減してAIの応答速度を向上させます。"
tags:
  - "ベストプラクティス"
  - "パフォーマンス最適化"
  - "効率向上"
  - "AI使用テクニック"
order: 100
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# ベストプラクティスの使用

## 学んだら何ができるようになりますか

このレッスンを学習すると、以下のことができるようになります：

- ✅ 正確なトリガーキーワードを選択し、AIが適切なタイミングでスキルをアクティブにする
- ✅ コンテキスト管理を最適化し、Token消費を削減して応答速度を向上させる
- ✅ 複数スキルの連携シナリオを処理し、競合と混乱を回避する
- ✅ よくある使用パターンを習得し、作業効率を向上させる

## 現在直面している課題

以下のようなシナリオに遭遇したことはありませんか：

- ✗ 「デプロイを手伝って」と入力したのに、AIがVercel Deployスキルをアクティブにしない
- ✗ 同じタスクで複数のスキルがトリガーされ、AIがどれを使用すべきかわからない
- ✗ スキルが大量のコンテキストを占有し、AIがあなたの要件を「覚えていられない」
- ✗ 毎回タスクを最初から説明しなければならず、AIに習慣を覚えさせる方法がわからない

## いつこの方法を使用すべきか

Agent Skillsを使用しているときに以下の問題に直面した場合：

- 🎯 **トリガーの不正確**: スキルがアクティブにならない、または間違ったスキルがアクティブになる
- 💾 **コンテキストの圧力**: スキルが多くのTokenを占有し、他の対話に影響する
- 🔄 **スキルの競合**: 複数のスキルが同時にアクティブになり、AIの実行が混乱する
- ⚡ **パフォーマンスの低下**: AIの応答が遅くなり、使用方法を最適化する必要がある

## 核心アプローチ

**Agent Skillsの設計哲学**:

Agent Skillsは**オンデマンド読み込みメカニズム**を採用しています——Claudeは起動時にスキルの名前と説明（約1-2行）のみを読み込み、関連キーワードを検出したときにのみ完全な`SKILL.md`コンテンツを読み取ります。この設計により、コンテキスト消費を最小限に抑えながら、スキルの正確なトリガーを維持できます。

**使用効率の3つの重要な次元**:

1. **トリガーの精度**: 適切なトリガーキーワードを選択し、スキルを正しいタイミングでアクティブにする
2. **コンテキスト効率**: スキルコンテンツの長さを制御し、過剰なToken占有を回避する
3. **連携の明確さ**: スキルの境界を明確にし、複数スキルの競合を回避する

---

## ベストプラクティス1: トリガーキーワードの正確な選択

### トリガーキーワードとは？

トリガーキーワードは、`SKILL.md`の`description`フィールドで定義され、AIにこのスキルをいつアクティブにすべきかを伝えます。

**重要な原則**: 説明は具体的に、トリガーは明確に

### 効果的な説明の書き方

#### ❌ 誤った例: 説明が曖昧すぎる

```yaml
---
name: my-deploy-tool
description: A deployment tool for applications  # 曖昧すぎてトリガーできない
---
```

**問題**:
- 明確な使用シナリオがない
- ユーザーが言う可能性のあるキーワードが含まれていない
- AIがいつアクティブにすべきか判断できない

#### ✅ 正しい例: 具体的でトリガーワードを含む説明

```yaml
---
name: vercel-deploy
description: Deploy applications and websites to Vercel. Use this skill when the user requests deployment actions such as "Deploy my app", "Deploy this to production", "Create a preview deployment", "Deploy and give me the link", or "Push this live". No authentication required.
---
```

**メリット**:
- 使用シナリオが明確
- 具体的なトリガーフレーズがリストされている
- ユニークな価値が説明されている

### トリガーキーワードの選択ガイド

| 作成シナリオ | 推奨キーワード | 回避すべきキーワード |
|--- | --- | ---|
| **デプロイ操作** | "deploy", "production", "push", "publish" | "send", "move" |
| **コードレビュー** | "review", "check", "audit", "optimize" | "look at", "see" |
| **デザインチェック** | "accessibility", "a11y", "UX check", "design audit" | "design", "style" |
| **パフォーマンス最適化** | "optimize", "performance", "improve speed" | "faster", "better" |

### 落とし穴の警告: よくある間違い

::: warning これらの間違いを避ける

❌ **一般的な単語のみを使用**
```yaml
description: A tool for code review  # "code review" が一般的すぎる
```

✅ **具体的なシナリオ + キーワード**
```yaml
description: Review React components for performance issues. Use when user says "review performance", "check optimization", or "find bottlenecks".
```

❌ **キーワードが少なすぎる**
```yaml
description: Deploy to Vercel  # 1つのシナリオのみ
```

✅ **複数の表現をカバー**
```yaml
description: Deploy to Vercel. Use when user says "deploy", "push live", "create preview", or "publish".
```

---

## ベストプラクティス2: コンテキスト管理のテクニック

### なぜコンテキスト管理が重要なのか？

Tokenは限られたリソースです。`SKILL.md`ファイルが長すぎると、大量のコンテキストを占有し、AIがあなたの要件を「覚えていられなかったり」、応答が遅くなったりします。

### 重要な原則: SKILL.mdを簡潔に保つ

::: tip 黄金のルール

**SKILL.mdファイルを500行以内に保つ**

:::

公式ドキュメントによると、以下の戦略でコンテキスト使用を最小化できます：

| 戦略 | 説明 | 効果 |
|--- | --- | --- |
| **SKILL.mdを簡潔に保つ** | 詳細な参考資料を別ファイルに配置する | 初期読み込み量を削減 |
| **具体的な説明を書く** | AIが正確にいつアクティブにすべきか判断するのを助ける | 誤ったトリガーを回避 |
| **漸進的な開示** | 必要なときのみサポートファイルを読み取る | 実際のToken消費を制御 |
| **スクリプト実行を優先** | スクリプト出力はコンテキストを消費せず、出力結果のみ消費する | Token使用を大幅に削減 |
| **単一レベルのファイル参照** | SKILL.mdから直接サポートファイルにリンクする | 多層ネストを回避 |

### 漸進的な開示の方法

**シナリオ**: スキルでAPIドキュメント、設定例などの詳細な参考資料が必要

#### ❌ 誤った方法: 全てSKILL.mdに記述

```markdown
---
name: my-api-skill
---

# API Skill

## API Reference

(ここに2000行のAPIドキュメントを記述)


## Configuration Examples

(ここに500行の例を記述)


## Usage Guide

(200行の使用ガイド)
```

**問題**:
- ファイルが500行を超えている
- アクティブ化するたびに全内容が読み込まれる
- 大部分のコンテンツが使用されない可能性がある

#### ✅ 正しい方法: サポートファイルに分離

```markdown
---
name: my-api-skill
description: Integrate with My API. Use when user says "call API", "send request", or "fetch data".
---

# API Skill

Quick start guide for My API integration.

## Quick Setup

1. Get API key from https://api.example.com/keys
2. Add to environment: `export MY_API_KEY="your-key"`
3. Run: `bash scripts/api-client.sh`

## Common Operations

### Fetch user data
```bash
bash scripts/api-client.sh get /users/123
```

### Create new resource
```bash
bash scripts/api-client.sh post /users '{"name":"John"}'
```

## Reference Documentation

For complete API reference, see:
- [API Endpoints](references/api-endpoints.md)
- [Configuration Examples](references/config-examples.md)
- [Error Handling](references/errors.md)
```

**メリット**:
- `SKILL.md`はわずか30行
- AIは必要な場合のみ詳細なドキュメントを読み取る
- 大部分のToken消費はスクリプト出力にあり、ドキュメント読み込みにはない

### 実戦例: Vercel Deploy vs React Best Practices

| スキル | SKILL.md 行数 | 読み込み内容 | 最適化戦略 |
|--- | --- | --- | ---|
| Vercel Deploy | ~60行 | 簡潔な使用法 + 出力形式 | スクリプトで複雑なロジックを処理 |
| React Best Practices | ~300行 | ルール索引 + 分類 | 詳細ルールはAGENTS.mdに |
| Web Design Guidelines | ~50行 | 監査プロセス | 動的にGitHubからルールを取得 |

**ヒント**: `SKILL.md`に全ての内容を詰め込まず、それを「入口ガイド」とし、「完全なマニュアル」にしないこと。

---

## ベストプラクティス3: 複数スキルの連携シナリオ

### シナリオ1: スキルAとスキルBのトリガー条件が重複している

**問題**: 「コードをレビューして」と言うと、React Best PracticesとWeb Design Guidelinesの両方がトリガーされた。

#### ✅ 解決策: トリガーワードを明確に区別する

```yaml
# React Best Practices
name: react-performance
description: Review React components for performance issues. Use when user says "review performance", "optimize React", "check bottlenecks".

# Web Design Guidelines
name: web-design-audit
description: Audit UI for accessibility and UX issues. Use when user says "check accessibility", "review UX", "audit interface".
```

**結果**:
- "review performance" → Reactスキルのみトリガー
- "check accessibility" → Webスキルのみトリガー
- "review my code" → どちらもトリガーされず、AIが判断

### シナリオ2: 複数のスキルを同時に使用する必要がある

**ベストプラクティス**: AIに必要なスキルを明確に伝える

**推奨される対話方法**:
```
2つのタスクを完了する必要があります:
1. Vercelにデプロイ (vercel-deployスキルを使用)
2. Reactのパフォーマンス問題をチェック (react-best-practicesスキルを使用)
```

**理由**:
- スキルの境界を明確にし、AIの混乱を回避する
- AIが順序通りに実行し、リソース競合を回避する
- 実行効率を向上させる

### シナリオ3: スキルのチェーン呼び出し（1つのスキルの出力が別のスキルの入力）

**例**: デプロイ前にパフォーマンスを最適化する

```bash
# ステップ1: React Best Practicesでコードを最適化
"Review src/components/Header.tsx for performance issues using react-best-practices skill"

# ステップ2: Vercel Deployでデプロイ
"Deploy the optimized code to Vercel"
```

**ベストプラクティス**:
- ステップの順序を明確にする
- 各ステップ間で完了を確認する
- 依存関係のあるタスクを並列処理しない

---

## ベストプラクティス4: パフォーマンス最適化の提案

### 1. コンテキストを簡潔にする

**問題**: 長時間の対話後、コンテキストが長くなり、応答が遅くなる。

#### ✅ 解決策: 新しい対話を開始するか「Clear Context」を使用する

```bash
# Claude Code
/clear  # コンテキストをクリアし、スキルを保持
```

### 2. スキルの重複読み込みを回避する

**問題**: 同じタスクで複数回スキルがトリガーされ、Tokenを浪費する。

#### ❌ 誤った方法

```
ユーザー: Deploy my app
AI: (vercel-deployをロードして実行)
ユーザー: Deploy to production
AI: (再びvercel-deployをロードして実行)
```

#### ✅ 正しい方法

```
ユーザー: Deploy to production
AI: (vercel-deployを1回ロードして実行)
```

### 3. スクリプトを使用し、インラインコードを使用しない

**比較**: 同じタスクを完了する場合、どちらの消費が少ないか？

| 方法 | Token消費 | 推奨シナリオ |
|--- | --- | --- |
| **インラインコード**(SKILL.mdでロジックを記述) | 高(トリガーのたびにロードされる) | 単純なタスク(<10行) |
| **Bashスクリプト** | 低(スクリプトパスのみロード、コンテンツはロードされない) | 複雑なタスク(>10行) |

**例**:

```markdown
## ❌ インラインコード(非推奨)

```bash
# このコードはアクティブ化するたびにコンテキストに読み込まれる
tar -czf package.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  && curl -X POST $API_URL \
  -F "file=@package.tar.gz"
```

## ✅ スクリプト(推奨)

```bash
bash scripts/deploy.sh
```

(スクリプトコンテンツはファイル内にあり、コンテキストには読み込まれない)
```

### 4. Token使用状況を監視する

**Claude Codeの実用的なコマンド**:

```bash
# 現在のToken使用状況を確認
/token

# スキルの読み込み状況を確認
/skills
```

---

## よくある使用パターンと例

### パターン1: 高速反復ワークフロー

```bash
# 1. コードを記述
vim src/App.tsx

# 2. パフォーマンスを即座にレビュー
"Review this for performance issues"

# 3. 提案に基づいてコードを修正
(修正)

# 4. 再レビュー
"Review again"

# 5. デプロイ
"Deploy to production"
```

**重要な点**:
- AIがすでにコンテキストを知っているため、簡潔な指示を使用する
- 同じ指示を繰り返すことで同じスキルを素早くアクティブにできる

### パターン2: 新規プロジェクト開始チェックリスト

```bash
# Next.jsプロジェクトを作成
npx create-next-app@latest my-app

# Agent Skillsをインストール
npx add-skill vercel-labs/agent-skills

# 初期監査
"Check accessibility for all UI files"
"Review performance for all components"

# デプロイテスト
"Deploy to production"
```

### パターン3: チーム協力テンプレート

```bash
# チームプロジェクトをクローン
git clone team-project
cd team-project

1. "Review performance for all new changes"
2. "Check accessibility of modified files"
3. "Deploy to staging"
```

**チーム標準**: 統一されたトリガーキーワードを定義し、全メンバーが同じ効率モードを使用するようにする。

---

## 落とし穴の警告: よくある間違い

### ピットホール1: スキルがアクティブになったが効果がない

**症状**: 「アプリをデプロイして」と言うと、AIが「vercel-deployスキルを使用します」と言うが、何も起こらない。

**原因**:
- スキルスクリプトパスが間違っている
- スクリプトに実行権限がない
- ファイルが正しい位置にない

**解決策**:
```bash
# スキルディレクトリを確認
ls -la ~/.claude/skills/vercel-deploy/

# スクリプト権限を確認
chmod +x ~/.claude/skills/vercel-deploy/scripts/deploy.sh

# スクリプトを手動でテスト
bash ~/.claude/skills/vercel-deploy/scripts/deploy.sh .
```

### ピットホール2: 間違ったスキルがトリガーされた

**症状**: 「コードをチェックして」と言うと、Web DesignではなくReact Best Practicesがトリガーされた。

**原因**: スキル説明キーワードが競合している。

**解決策**: トリガーワードを修正し、より具体的にする:
```yaml
# ❌ 修正前
description: "Check code for issues"

# ✅ 修正後
description: "Review React code for accessibility and UX"
```

### ピットホール3: AIがスキルを「忘れた」

**症状**: 1回目の対話では使用できるが、2回目は動作しない。

**原因**: コンテキストが長すぎ、スキル情報が押し出された。

**解決策**:
```bash
/clear  # コンテキストをクリアし、スキルを保持
```

---

## 本レッスンのまとめ

**重要なポイント**:

1. **トリガーキーワード**: 説明は具体的に、ユーザーが言う可能性のある複数の表現を含める
2. **コンテキスト管理**: SKILL.md < 500行、漸進的な開示を使用、スクリプトを優先
3. **複数スキルの連携**: トリガーワードでスキルを明確に区別し、複数タスクの順序を明確にする
4. **パフォーマンス最適化**: コンテキストを簡潔にし、重複読み込みを回避し、Token使用を監視する

**ベストプラクティスの口诀**:

> 説明は具体的に、トリガーは明確に
> ファイルは長すぎないように、スクリプトがスペースを占有
> 複数のスキルに境界を設定し、タスクの順序を明確に伝える
> コンテキストを簡潔にし、定期的にクリアして遅延を回避する

---

## 次のレッスンのプレビュー

> 次のレッスンでは、**[Agent Skillsの技術アーキテクチャと実装の詳細](../../appendix/architecture/)** について詳しく学びます。
>
> 学習内容:
> - 構築プロセスの詳細解説(parse → validate → group → sort → generate)
> - ルールパーサーの動作方法
> - 型システムとデータモデル
> - テストケース抽出メカニズム
> - デプロイスクリプトのフレームワーク検出アルゴリズム

---

## 付録: ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日: 2026-01-25

| 機能 | ファイルパス | 行号 |
|--- | --- | --- |
| コンテキスト管理のベストプラクティス | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78) | 70-78 |
| スキルトリガーの例 | [`README.md:88-102`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L88-L102) | 88-102 |
| Reactスキルトリガーワード | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | 1-30 |
| Vercel Deployトリガーワード | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-30 |

**重要な原則**:
- Keep SKILL.md under 500 lines: スキルファイルを簡潔に保つ
- Write specific descriptions: 具体的な説明を書き、AIが判断するのを助ける
- Use progressive disclosure: 詳細な内容を漸進的に開示する
- Prefer scripts over inline code: スクリプト実行を優先し、Token消費を削減する

</details>
