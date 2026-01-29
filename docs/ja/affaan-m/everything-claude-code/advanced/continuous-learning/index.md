---
title: "継続学習: パターンの自動抽出 | Everything Claude Code"
sidebarTitle: "Claude Code を賢くする"
subtitle: "継続学習: 再利用可能なパターンの自動抽出"
description: "Everything Claude Code の継続学習メカニズムを学びます。/learn でパターンを抽出し、自動評価を設定し、Stop hook を設定することで、Claude Code が経験を蓄積し、開発効率を向上させます。"
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# 継続学習メカニズム：再利用可能なパターンの自動抽出

## このコースでできること

- `/learn` コマンドを使用してセッションから再利用可能なパターンを手動で抽出
- continuous-learning skill を設定してセッション終了時に自動評価
- Stop hook を設定してパターン抽出を自動トリガー
- 抽出したパターンを learned skills として保存し、将来のセッションで再利用
- 抽出しきい値、セッション長要件などのパラメータを設定

## 今の課題

Claude Code で開発する際、次のような状況に遭遇したことはありませんか：

- 複雑な問題を解決したが、次回似たような問題に直面すると再度摸索が必要
- 特定のフレームワークのデバッグテクニックを学んだが、時間が経つと忘れてしまう
- プロジェクト固有のコーディング規約を発見したが、体系的に記録できない
- 回避策を見つけたが、次回似たような問題に直面すると思い出せない

これらの問題により、経験と知識が有効に蓄積されず、毎回最初からやり直すことになります。

## いつ使うべきか

継続学習メカニズムを使用するシナリオ：

- **複雑な問題を解決する時**：半日デバッグしたバグ、解決方法を記憶する必要がある
- **新しいフレームワークを学習する時**：フレームワークのクセやベストプラクティスを発見した
- **プロジェクト開発中期**：プロジェクト固有の規約やパターンを徐々に発見した
- **コードレビュー後**：新しいセキュリティチェック方法やコーディング規約を学んだ
- **パフォーマンス最適化時**：有効な最適化テクニックやツールの組み合わせを見つけた

::: tip コア価値
継続学習メカニズムは、Claude Code を使うほど賢くします。経験豊富なメンターのように、問題解決の過程で有用なパターンを自動的に記録し、将来の類似状況で提案を提供します。
:::

## コアコンセプト

継続学習メカニズムは3つのコアコンポーネントで構成されます：

```
1. /learn コマンド     → 手動抽出：いつでも実行し、現在の価値あるパターンを保存
2. Continuous Learning Skill → 自動評価：Stop hook がトリガーし、セッションを分析
3. Learned Skills   → 知識ベース：パターンを保存し、将来自動的にロード
```

**動作原理**：

- **手動抽出**：重要な問題を解決した後、能動的に `/learn` を使用してパターンを抽出
- **自動評価**：セッション終了時、Stop hook スクリプトがセッション長をチェックし、Claude に評価を促す
- **知識の蓄積**：抽出したパターンを learned skills として `~/.claude/skills/learned/` ディレクトリに保存
- **将来の再利用**：Claude Code は将来のセッションでこれらのスキルを自動的にロード

**なぜ Stop hook を選ぶのか**：

- **軽量**：セッション終了時に1回だけ実行され、インタラクション応答速度に影響しない
- **完全なコンテキスト**：完全なセッション履歴にアクセスでき、価値あるパターンを見つけやすい
- **非ブロッキング**：メッセージ送信ごとに実行されず、遅延を増やさない

## 🎒 事前準備

継続学習メカニズムを使用する前に、以下を確認してください：

- ✅ Everything Claude Code プラグインがインストール済み
- ✅ [コア Commands 詳解](../../platforms/commands-overview/) の `/learn` コマンドを理解済み
- ✅ [Hooks 自動化](../hooks-automation/) の Stop hook コンセプトを理解済み

::: warning 前提条件
このチュートリアルでは、Claude Code の基本操作と hooks の概念に精通していることを前提としています。まだインストールが完了していない場合は、まず[クイックスタート](../../start/quickstart/)を読んでください。
:::

## 実践：完全な継続学習フロー

実際の例で全体のフローを学びましょう。TypeScript 型エラーをデバッグし、最終的に解決策を見つけたと仮定します。

### ステップ1：/learn で手動パターン抽出

**理由**
手動抽出は、重要な問題を解決した直後に適用し、忘れを防ぐためにすぐに保存できます。

**操作**
Claude Code で次を入力します：

```
/learn
```

**期待される結果**
Claude が現在のセッションを分析し、抽出可能なパターンがあるか尋ねます：

```markdown
現在のセッションを分析し、次の抽出可能なパターンを発見しました：

1. TypeScript 型エラー：ジェネリック制約で解決
   - 問題の説明：関数パラメータの型推論が正しくない
   - 解決方法：明示的なジェネリック制約 `<T extends ...>` を追加
   - 適用シナリオ：複雑な型推論、コールバック関数

これらのパターンを抽出しますか？(yes/no/skip)
```

**チェックポイント ✅**
- Claude があなたが解決した問題を認識したか
- 抽出されたパターンの説明が正確か
- 適用シナリオが合理的か

**次のステップ**
パターンが正しければ、`yes` と返信します。修正が必要な場合は、具体的な変更を説明します。

---

### ステップ2：learned skill として保存

**理由**
skill ファイルとして保存すると、将来のセッションで自動的にこれらの知識をロードできます。

**操作**
抽出を確認すると、Claude が skill ファイルを作成します：

```markdown
パターンを保存先：~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**抽出日時:** 2026-01-25
**コンテキスト:** 複雑な型推論問題の解決

## Problem
TypeScript 関数パラメータの型推論が正しくなく、型エラーが発生。

## Solution
明示的なジェネリック制約 `<T extends ...>` を追加して型関係を明確化。

## Example
```typescript
// Before
function process(data) { ... }  // 型推論失敗

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- 複雑な型推論シナリオ
- コールバック関数の型定義
- ジェネリック関数パラメータ制約
```

**期待される結果**
Claude がファイル保存を促します：

```markdown
✅ Skill が保存されました：~/.claude/skills/learned/typescript-generic-constraints.md

将来、類似の型問題に遭遇した際、Claude はこのスキルを自動的にロードします。
```

**チェックポイント ✅**
- ファイルが正常に作成されたか
- ファイルパスが `~/.claude/skills/learned/` ディレクトリにあるか
- skill の内容が正確か

---

### ステップ3：Continuous Learning Skill の設定

**理由**
自動評価を設定すると、Claude が各セッション終了時に自動的に抽出可能なパターンがあるかチェックします。

**操作**

設定ファイル `~/.claude/skills/continuous-learning/config.json` を作成します：

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**設定説明**：

| フィールド | 説明 | 推奨値 |
|--- | --- | ---|
| `min_session_length` | 最小セッション長（ユーザーメッセージ数） | 10 |
| `extraction_threshold` | 抽出しきい値 | medium |
| `auto_approve` | 自動保存するか（推奨 false） | false |
| `learned_skills_path` | learned skills の保存パス | `~/.claude/skills/learned/` |
| `patterns_to_detect` | 検出するパターンタイプ | 上記参照 |
| `ignore_patterns` | 無視するパターンタイプ | 上記参照 |

**期待される結果**
設定ファイルが `~/.claude/skills/continuous-learning/config.json` に作成されます。

**チェックポイント ✅**
- 設定ファイルの形式が正しい（JSON が有効）
- `learned_skills_path` に `~` 記号が含まれている（実際の home ディレクトリに置換される）
- `auto_approve` が `false` に設定されている（推奨）

---

### ステップ4：Stop Hook の自動トリガーを設定

**理由**
Stop hook を設定すると、各セッション終了時に自動的にトリガーされ、手動で `/learn` を実行する必要がなくなります。

**操作**

`~/.claude/settings.json` を編集し、Stop hook を追加します：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**スクリプトパスの説明**：

| プラットフォーム | スクリプトパス |
|--- | ---|
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\YourName\.claude\skills\continuous-learning\evaluate-session.cmd` |

**期待される結果**
Stop hook が `~/.claude/settings.json` に追加されます。

**チェックポイント ✅**
- hooks 構造が正しい（Stop → matcher → hooks）
- command パスが正しいスクリプトを指している
- matcher が `"*"` に設定されている（すべてのセッションにマッチ）

---

### ステップ5：Stop Hook が正常に動作することを確認

**理由**
設定が正しいことを確認すると、自動抽出機能を安心して使用できます。

**操作**
1. 新しい Claude Code セッションを開く
2. 開発作業を行う（少なくとも 10 回メッセージを送信）
3. セッションを閉じる

**期待される結果**
Stop hook スクリプトがログを出力します：

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/yourname/.claude/skills/learned/
```

**チェックポイント ✅**
- ログにセッションメッセージ数 ≥ 10 が表示されている
- ログに learned skills のパスが正しく表示されている
- エラーメッセージがない

---

### ステップ6：将来のセッションで learned skills を自動ロード

**理由**
保存された skills は、将来の類似シナリオで自動的にロードされ、コンテキストを提供します。

**操作**
将来のセッションで類似の問題に遭遇した際、Claude は自動的に関連する learned skills をロードします。

**期待される結果**
Claude がロードされた skills を促します：

```markdown
このシナリオは以前解決した型推論問題と類似していることに気づきました。

saved skill (typescript-generic-constraints) に基づき、明示的なジェネリック制約の使用を推奨します：

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**チェックポイント ✅**
- Claude が saved skill を参照している
- 提案された解決策が正確
- 問題解決の効率が向上した

## チェックポイント ✅：設定の確認

上記の手順を完了後、次のチェックを実行してすべてが正常か確認します：

1. **設定ファイルの存在を確認**：
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **Stop hook 設定を確認**：
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **learned skills ディレクトリを確認**：
```bash
ls -la ~/.claude/skills/learned/
```

4. **Stop hook を手動でテスト**：
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## 注意点

### ポイント1：セッションが短すぎて抽出がトリガーされない

**問題**：
Stop hook スクリプトがセッション長をチェックし、`min_session_length` 未満の場合はスキップする。

**原因**：
デフォルト `min_session_length: 10` で、短いセッションは評価をトリガーしない。

**解決方法**：
```json
{
  "min_session_length": 5  // しきい値を下げる
}
```

::: warning 注意
あまり低く設定しないでください（5 未満）。そうすると、無意味なパターン（単純な構文エラーの修正など）が大量に抽出されます。
:::

---

### ポイント2：`auto_approve: true` で低品質なパターンが自動保存される

**問題**：
自動保存モードでは、Claude が低品質な patterns を保存する可能性がある。

**原因**：
`auto_approve: true` が手動確認プロセスをスキップする。

**解決方法**：
```json
{
  "auto_approve": false  // 常に false を維持
}
```

**推奨方法**：
抽出されたパターンを常に手動で確認し、品質を保証する。

---

### ポイント3：learned skills ディレクトリが存在しないため保存に失敗する

**問題**：
Stop hook は正常に実行されるが、skill ファイルが作成されない。

**原因**：
`learned_skills_path` が指すディレクトリが存在しない。

**解決方法**：
```bash
# 手動でディレクトリを作成
mkdir -p ~/.claude/skills/learned/

# または設定で絶対パスを使用
{
  "learned_skills_path": "/absolute/path/to/learned/"
}
```

---

### ポイント4：Stop hook スクリプトパスが間違っている（Windows）

**問題**：
Windows で Stop hook がトリガーされない。

**原因**：
設定ファイルが Unix 風のパス（`~/.claude/...`）を使用しているが、Windows の実際のパスは異なる。

**解決方法**：
```json
{
  "command": "C:\\Users\\YourName\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**推奨方法**：
Node.js スクリプト（クロスプラットフォーム）を使用し、Shell スクリプトは使用しない。

---

### ポイント5：抽出されたパターンがあまりに一般化されており、再利用性が低い

**問題**：
抽出されたパターンの説明があまりに一般的（例："型エラーの修正"）で、具体的なコンテキストが欠けている。

**原因**：
抽出時に十分なコンテキスト情報（エラーメッセージ、コード例、適用シナリオ）が含まれていない。

**解決方法**：
`/learn` でより詳細なコンテキストを提供します：

```
/learn TypeScript 型エラーを解決しました：Property 'xxx' does not exist on type 'yyy'。型アサーション as で一時的に解決しましたが、より良い方法はジェネリック制約を使用することです。
```

**チェックリスト**：
- [ ] 問題の説明が具体的（エラーメッセージを含む）
- [ ] 解決方法が詳細（コード例を含む）
- [ ] 適用シナリオが明確（いつこのパターンを使用するか）
- [ ] 命名が具体的（"typescript-generic-constraints" など、"type-fix" ではない）

---

### ポイント6：learned skills の数が多すぎて管理が困難

**問題**：
時間の経過とともに、`learned/` ディレクトリに大量の skills が蓄積され、検索や管理が困難になる。

**原因**：
低品質または古い skills を定期的にクリーンアップしていない。

**解決方法**：

1. **定期的なレビュー**：毎月 learned skills をチェック
```bash
# すべての skills を一覧表示
ls -la ~/.claude/skills/learned/

# skill の内容を確認
cat ~/.claude/skills/learned/pattern-name.md
```

2. **低品質 skills のマーク**：ファイル名の前に `deprecated-` プレフィックスを追加
```bash
mv ~/.claude/skills/learned/old-pattern.md \
   ~/.claude/skills/learned/deprecated-old-pattern.md
```

3. **カテゴリ別管理**：サブディレクトリを使用して分類
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**推奨方法**：
四半期ごとにクリーンアップし、learned skills を簡潔かつ有効に保つ。

---

## まとめ

継続学習メカニズムは3つのコアコンポーネントで動作します：

1. **`/learn` コマンド**：セッションから再利用可能なパターンを手動で抽出
2. **Continuous Learning Skill**：自動評価パラメータを設定（セッション長、抽出しきい値）
3. **Stop Hook**：セッション終了時に自動的に評価をトリガー

**重要なポイント**：

- ✅ 手動抽出は重要な問題を解決した直後に適用
- ✅ 自動評価は Stop hook でセッション終了時にトリガー
- ✅ 抽出されたパターンは learned skills として `~/.claude/skills/learned/` ディレクトリに保存
- ✅ `min_session_length` を設定して最小セッション長を制御（推奨 10）
- ✅ 常に `auto_approve: false` を維持し、抽出の品質を手動で確認
- ✅ 低品質または古い learned skills を定期的にクリーンアップ

**ベストプラクティス**：

- 重要な問題を解決した後、すぐに `/learn` を使用してパターンを抽出
- 詳細なコンテキストを提供（問題の説明、解決策、コード例、適用シナリオ）
- 具体的な skill 命名を使用（"typescript-generic-constraints" など、"type-fix" ではない）
- learned skills を定期的にレビューし、クリーンアップして知識ベースを簡潔に保つ

## 次回の予告

> 次回は **[Token 最適化戦略](../token-optimization/)** を学びます。
>
> 学ぶこと：
> - Token 使用を最適化し、コンテキストウィンドウの効率を最大化する方法
> - strategic-compact skill の設定と使用
> - PreCompact と PostToolUse hooks の自動化
> - 適切なモデル（opus vs sonnet）を選択してコストと品質をバランスさせる方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-25

| 機能                  | ファイルパス                                                                                                  | 行番号     |
|--- | --- | ---|
| /learn コマンド定義       | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md)         | 1-71     |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81     |
| Stop Hook スクリプト        | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79     |
| Checkpoint コマンド        | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75     |

**重要な定数**：
- `min_session_length = 10`：デフォルトの最小セッション長（ユーザーメッセージ数）
- `CLAUDE_TRANSCRIPT_PATH`：環境変数、セッション記録パス
- `learned_skills_path`：learned skills 保存パス、デフォルト `~/.claude/skills/learned/`

**重要な関数**：
- `main()`：evaluate-session.js のメイン関数、設定の読み込み、セッション長のチェック、ログ出力
- `getLearnedSkillsDir()`：learned skills ディレクトリパスの取得（`~` の展開を処理）
- `countInFile()`：ファイル内の一致パターンの出現回数をカウント

**設定項目**：
| 設定項目                | タイプ    | デフォルト                      | 説明                               |
|--- | --- | --- | ---|
| `min_session_length`  | number  | 10                          | 最小セッション長（ユーザーメッセージ数）          |
| `extraction_threshold` | string  | "medium"                    | 抽出しきい値                           |
| `auto_approve`        | boolean | false                       | 自動保存するか（推奨 false）          |
| `learned_skills_path`  | string  | "~/.claude/skills/learned/" | learned skills 保存パス             |
| `patterns_to_detect`   | array   | ソースコード参照                       | 検出するパターンタイプ                   |
| `ignore_patterns`      | array   | ソースコード参照                       | 無視するパターンタイプ                     |

**パターンタイプ**：
- `error_resolution`：エラー解決パターン
- `user_corrections`：ユーザー修正パターン
- `workarounds`：回避策
- `debugging_techniques`：デバッグテクニック
- `project_specific`：プロジェクト固有パターン

**Hook タイプ**：
- Stop：セッション終了時に実行（evaluate-session.js）

</details>
