---
title: "検証ループ: Checkpoint と Evals | Everything Claude Code"
subtitle: "検証ループ: Checkpoint と Evals"
sidebarTitle: "PR前のチェックで失敗を防ぐ"
description: "Everything Claude Code の検証ループメカニズムを学習。Checkpoint の管理、Evals の定義と継続的検証をマスター。checkpoint で状態を保存・巻き戻し、evals でコード品質を確保。"
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# 検証ループ：Checkpoint と Evals

## 学習後にできること

検証ループメカニズムを学習すると、以下が可能になります：

- `/checkpoint` を使用して作業状態を保存・復元する
- `/verify` を使用して包括的なコード品質チェックを実行する
- Eval-Driven Development（EDD）の概念を理解し、evals を定義・実行する
- 継続的検証ループを構築し、開発過程でコード品質を維持する

## 現在の課題

機能を完成させたが、PR を提出するのが怖い理由：
- 既存機能を破壊していないか確信がない
- テストカバレッジが低下しているのではないか
- 最初の目標を忘れてしまい、方向を逸脱していないかわからない
- 安定した状態に戻りたいが、記録がない

重要な時点で「スナップショット」を撮り、開発過程で継続的に検証するメカニズムがあれば、これらの問題は解決します。

## いつこの手法を使うか

- **新機能開始前**：checkpoint を作成し、開始状態を記録する
- **マイルストーン完了後**：進捗を保存し、巻き戻しと比較を容易にする
- **PR 提出前**：包括的な検証を実行し、コード品質を確保する
- **リファクタリング時**：頻繁に検証し、既存機能を破壊しないようにする
- **複数人での協働時**：checkpoint を共有し、作業状態を同期する

## 🎒 開始前の準備

::: warning 前提条件

本チュートリアルでは以下を前提としています：

- ✅ [TDD ワークフロー](../../platforms/tdd-workflow/) の学習を完了している
- ✅ 基本的な Git 操作に精通している
- ✅ Everything Claude Code の基本コマンドの使用方法を理解している

:::

---

## 核心的な考え方

**検証ループ**は品質保証メカニズムであり、「コードを書く → テストする → 検証する」というサイクルをシステマティックなプロセスに変換します。

### 3層の検証体系

Everything Claude Code は3層の検証を提供します：

| レベル | メカニズム | 目的 | 使用タイミング |
| --- | --- | --- | --- |
| **リアルタイム検証** | PostToolUse Hooks | 型エラー、console.log などを即座に検出 | ツール呼び出しのたびに |
| **定期検証** | `/verify` コマンド | 包括的チェック：ビルド、型、テスト、セキュリティ | 15分ごとまたは大きな変更後 |
| **マイルストーン検証** | `/checkpoint` | 状態の差分を比較し、品質トレンドを追跡 | マイルストーン完了時、PR 提出前 |

### Checkpoint：コードの「セーブポイント」

Checkpoint は重要な時点で「スナップショット」を撮ります：

- Git SHA を記録
- テスト通過率を記録
- コードカバレッジを記録
- タイムスタンプを記録

検証時に、現在の状態と任意の checkpoint の差分を比較できます。

### Evals：AI 開発の「ユニットテスト」

**Eval-Driven Development（EDD）**は、evals を AI 開発のユニットテストとして扱います：

1. **まず成功基準を定義する**（evals を書く）
2. **次にコードを書く**（機能を実装）
3. **継続的に evals を実行する**（正確性を検証）
4. **リグレッションを追跡する**（既存機能を破壊しないように）

これは TDD（テスト駆動開発）の概念と一致しますが、AI 支援開発向けです。

---

## 実践：Checkpoint の使用

### ステップ 1：初期 checkpoint の作成

新機能開始前に、まず checkpoint を作成します：

```bash
/checkpoint create "feature-start"
```

**理由**
開始状態を記録し、後続の比較を容易にします。

**表示されるべき内容**：

```
VERIFICATION: Running quick checks...
Build: OK
Types: OK

CHECKPOINT CREATED: feature-start
Time: 2026-01-25-14:30
Git SHA: abc1234
Logged to: .claude/checkpoints.log
```

Checkpoint は以下を実行します：
1. まず `/verify quick` を実行（ビルドと型のみチェック）
2. git stash または commit を作成（名前：`checkpoint-feature-start`）
3. `.claude/checkpoints.log` に記録

### ステップ 2：コア機能の実装

コードを書き始め、コアロジックを完成させます。

### ステップ 3：マイルストーン checkpoint の作成

コア機能完了後：

```bash
/checkpoint create "core-done"
```

**理由**
マイルストーンを記録し、巻き戻しを容易にします。

**表示されるべき内容**：

```
CHECKPOINT CREATED: core-done
Time: 2026-01-25-16:45
Git SHA: def5678
Logged to: .claude/checkpoints.log
```

### ステップ 4：検証と比較

現在の状態が目標から逸脱していないか検証します：

```bash
/checkpoint verify "feature-start"
```

**理由**
開始時から現在までの品質指標の変化を比較します。

**表示されるべき内容**：

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### ステップ 5：すべての checkpoint を表示

履歴 checkpoint を確認します：

```bash
/checkpoint list
```

**表示されるべき内容**：

```
CHECKPOINTS HISTORY
===================
Name | Time | Git SHA | Status
---------------|------------------|----------|--------
feature-start | 2026-01-25-14:30 | abc1234 | behind
core-done | 2026-01-25-16:45 | def5678 | current
```

**チェックポイント ✅**：理解の確認

- Checkpoint は自動的に `/verify quick` を実行しますか？✅ はい
- Checkpoint はどのファイルに記録されますか？✅ `.claude/checkpoints.log`
- `/checkpoint verify` はどの指標を比較しますか？✅ ファイル変更、テスト通過率、カバレッジ

---

## 実践：Verify コマンドの使用

### ステップ 1：クイック検証の実行

開発過程で、頻繁にクイック検証を実行します：

```bash
/verify quick
```

**理由**
ビルドと型のみチェックし、最速で実行します。

**表示されるべき内容**：

```
VERIFICATION: PASS

Build: OK
Types: OK

Ready for next task: YES
```

### ステップ 2：フル検証の実行

PR 提出準備前に、完全なチェックを実行します：

```bash
/verify full
```

**理由**
すべての品質ゲートを包括的にチェックします。

**表示されるべき内容**：

```
VERIFICATION: PASS

Build: OK
Types: OK
Lint: OK (2 warnings)
Tests: 120/125 passed, 76% coverage
Secrets: OK
Logs: 3 console.logs found in src/

Ready for PR: NO

Issues to Fix:
1. Remove console.log statements before PR
Found in: src/utils/logger.ts:15, src/api/client.ts:23, src/ui/button.ts:8
2. Increase test coverage from 76% to 80% (target)
Missing coverage in: src/components/Form.tsx
```

### ステップ 3：PR 前検証の実行

最も厳格なチェックで、セキュリティスキャンを含みます：

```bash
/verify pre-pr
```

**表示されるべき内容**：

```
VERIFICATION: FAIL

Build: OK
Types: OK (1 error)
Lint: OK
Tests: 120/125 passed, 76% coverage
Secrets: ❌ FOUND (2 API keys)
Logs: 3 console.logs

Security Issues Found:
1. Hardcoded API key in src/api/config.ts:10
2. Secret key in .env.example

Ready for PR: NO

Critical Issues:
1. Remove hardcoded secrets
2. Fix type error in src/components/Form.tsx:45
3. Remove console.logs
4. Increase coverage to 80%
```

### ステップ 4：問題修正後の再検証

問題を修正後、再度検証を実行します：

```bash
/verify full
```

**表示されるべき内容**：

```
VERIFICATION: PASS

Build: OK
Types: OK
Lint: OK
Tests: 125/125 passed, 81% coverage
Secrets: OK
Logs: OK

Ready for PR: YES
```

**チェックポイント ✅**：理解の確認

- `/verify quick` は何のみをチェックしますか？✅ ビルドと型
- `/verify full` はどの項目をチェックしますか？✅ ビルド、型、Lint、テスト、Secrets、Console.log、Git 状態
- どの検証モードがセキュリティスキャンを含みますか？✅ `pre-pr`

---

## 実践：Evals の使用（Eval-Driven Development）

### ステップ 1：Evals の定義（コード作成前）

**コーディング開始前に、まず成功基準を定義します**：

```markdown
## EVAL: user-authentication

### Capability Evals
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

### Regression Evals
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

**理由**
まず成功基準を定義することで、「完了の基準は何か」を考えることを強制します。

保存先：`.claude/evals/user-authentication.md`

### ステップ 2：機能の実装

evals に従ってコードを記述します。

### ステップ 3：Capability Evals の実行

新機能が evals を満たしているかテストします：

```markdown
[CERTAIN CAPABILITY EVAL: user-authentication]

Test 1: User can register with email/password
Task: Call registration API with valid credentials
Expected: User account created, token returned
Actual: PASS

Test 2: User can login with valid credentials
Task: Call login API with registered credentials
Expected: JWT token returned
Actual: PASS

Test 3: Invalid credentials rejected
Task: Call login API with wrong password
Expected: 401 Unauthorized with error message
Actual: PASS

Overall: 3/3 passed
```

### ステップ 4：Regression Evals の実行

既存機能を破壊していないことを確認します：

```bash
npm test -- --testPathPattern="existing"
```

**表示されるべき内容**：

```
PASS existing/auth.test.ts
PASS existing/api.test.ts
PASS existing/db.test.ts

All regression tests: 15/15 passed
```

### ステップ 5：Eval レポートの生成

結果を要約します：

```markdown
EVAL REPORT: user-authentication
=================================

Capability Evals:
register-user: PASS (pass@1)
login-user: PASS (pass@2)
reject-invalid: PASS (pass@1)
session-persistence: PASS (pass@1)
logout-clears: PASS (pass@1)
Overall: 5/5 passed

Regression Evals:
public-routes: PASS
api-responses: PASS
db-schema: PASS
Overall: 3/3 passed

Metrics:
pass@1: 80% (4/5)
pass@3: 100% (5/5)
pass^3: 100% (3/3)

Status: READY FOR REVIEW
```

**チェックポイント ✅**：理解の確認

- Evals はいつ定義すべきですか？✅ コードを書く前
- capability evals と regression evals の違いは？✅ 前者は新機能をテストし、後者は既存機能を破壊しないことを確認する
- pass@3 の意味は？✅ 3回の試行内で成功する確率

---

## よくある落とし穴

### 落とし穴 1：Checkpoint の作成を忘れる

**問題**：しばらく開発した後、ある状態に戻りたいが記録がない。

**解決**：各新機能開始前に checkpoint を作成します：

```bash
# 良い習慣：新機能開始前
/checkpoint create "feature-name-start"

# 良い習慣：各マイルストーン
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### 落とし穴 2：Evals の定義が曖昧すぎる

**問題**：Evals が曖昧に書かれており、検証できない。

**誤った例**：
```markdown
- [ ] ユーザーはログインできる
```

**正しい例**：
```markdown
- [ ] User can login with valid credentials
Task: POST /api/login with email="test@example.com", password="Test123!"
Expected: HTTP 200 with JWT token in response body
Actual: ___________
```

### 落とし穴 3：PR 提出前のみ検証を実行する

**問題**：PR 前になって初めて問題を発見し、修正コストが高い。

**解決**：継続的な検証の習慣を構築します：

```
15分ごとに実行：/verify quick
機能完了のたびに：/checkpoint create "milestone"
PR 提出前： /verify pre-pr
```

### 落とし穴 4：Evals を更新しない

**問題**：要件が変更された後も Evals が古いままで、検証が無効になる。

**解決**：Evals は「ファーストクラスコード」であり、要件変更時に同期して更新します：

```bash
# 要件変更 → Evals の更新 → コードの更新
1. .claude/evals/feature-name.md を修正
2. 新しい evals に従ってコードを修正
3. evals を再実行
```

---

## 本レッスンのまとめ

検証ループはコード品質を維持するシステマティックな方法です：

| メカニズム | 役割 | 使用頻度 |
| --- | --- | --- |
| **PostToolUse Hooks** | エラーをリアルタイムで検出 | ツール呼び出しのたびに |
| **`/verify`** | 定期的な包括的チェック | 15分ごと |
| **`/checkpoint`** | マイルストーンの記録と比較 | 各機能フェーズ |
| **Evals** | 機能検証とリグレッションテスト | 各新機能 |

核心原則：
1. **先に定義し、後に実装する**（Evals）
2. **頻繁に検証し、継続的に改善する**（`/verify`）
3. **マイルストーンを記録し、巻き戻しを容易にする**（`/checkpoint`）

---

## 次のレッスンの予告

> 次のレッスンでは **[カスタム Rules：プロジェクト固有の規約の構築](../custom-rules/)** を学習します。
>
> 学習内容：
> - カスタム Rules ファイルの作成方法
> - Rule ファイルのフォーマットとチェックリストの記述
> - プロジェクト固有のセキュリティルールの定義
> - チーム規約をコードレビュープロセスに統合する方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| Checkpoint コマンド定義 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify コマンド定義 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**主要フロー**：
- Checkpoint 作成フロー：まず `/verify quick` を実行 → git stash/commit を作成 → `.claude/checkpoints.log` に記録
- Verify 検証フロー：Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Eval ワークフロー：Define（evals を定義）→ Implement（コードを実装）→ Evaluate（evals を実行）→ Report（レポートを生成）

**主要パラメータ**：
- `/checkpoint [create\|verify\|list] [name]` - Checkpoint 操作
- `/verify [quick\|full\|pre-commit\|pre-pr]` - 検証モード
- pass@3 - 3回の試行内で成功する目標（>90%）
- pass^3 - 3回連続で成功（100%、重要パス用）

</details>
