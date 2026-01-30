---
title: "Commands: 15個のスラッシュコマンド | Everything Claude Code"
subtitle: "Commands: 15個のスラッシュコマンド | Everything Claude Code"
sidebarTitle: "15個のコマンドで開発を完璧に"
description: "Everything Claude Code の15個のスラッシュコマンドを学習。/plan、/tdd、/code-review、/e2e、/verify などのコアコマンドの使用方法を習得し、開発効率を向上させましょう。"
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# コア Commands 詳解：15個のスラッシュコマンド完全ガイド

## 学習後にできること

- TDD 開発フローを迅速に開始し、高品質なコードを実現
- 体系的な実装計画を作成し、重要なステップの欠落を防ぐ
- 包括的なコードレビューとセキュリティ監査を実行
- E2E テストを生成し、重要なユーザーフローを検証
- ビルドエラーを自動修正し、デバッグ時間を節約
- 安全にデッドコードを削除し、コードベースを簡潔に保つ
- 解決済みの問題からパターンを抽出し、再利用する
- 作業状態とチェックポイントを管理
- 包括的な検証を実行し、コードが準備完了であることを確認

## 現在の課題

開発中に以下のような問題に遭遇するかもしれません：

- **どこから始めればいいかわからない** —— 新しい要件に対して、実装ステップをどう分解すればよいか？
- **テストカバレッジが低い** —— 書いたコードは多いが、テストが不十分で品質が担保できない
- **ビルドエラーが蓄積** —— コードを修正したら、型エラーが次々と発生し、どこから修正すればよいかわからない
- **コードレビューが体系的でない** —— 目視ではセキュリティ問題を見落としがち
- **同じ問題を繰り返し解決** —— 一度遭遇した落とし穴にまた落ちてしまう

Everything Claude Code の15個のスラッシュコマンドは、これらの痛みを解決するために設計されています。

## コアコンセプト

**コマンドはワークフローのエントリーポイント**です。各コマンドは完全な開発フローをカプセル化し、対応するエージェントやスキルを呼び出して、特定のタスクを完了させます。

::: tip コマンド vs Agent vs Skill

- **コマンド**：Claude Code で直接入力するショートカットエントリ（例：`/tdd`、`/plan`）
- **Agent**：コマンドが呼び出す専門サブエージェントで、具体的な実行を担当
- **Skill**：Agent が参照できるワークフロー定義とドメイン知識

コマンドは通常、1つ以上のエージェントを呼び出し、エージェントは関連するスキルを参照する場合があります。

:::

## コマンド概要

15個のコマンドを機能別に分類：

| カテゴリ | コマンド | 用途 |
| --- | --- | --- |
| **開発フロー** | `/plan` | 実装計画の作成 |
| | `/tdd` | テスト駆動開発の実行 |
| | `/orchestrate` | 複数エージェントのシーケンシャル実行 |
| **コード品質** | `/code-review` | コードレビュー |
| | `/build-fix` | ビルドエラーの修正 |
| | `/refactor-clean` | デッドコードの削除 |
| | `/verify` | 包括的検証 |
| **テスト** | `/e2e` | E2E テスト |
| | `/test-coverage` | テストカバレッジ分析 |
| | `/eval` | Eval 駆動開発の管理 |
| **ドキュメントとアーキテクチャ** | `/update-docs` | ドキュメントの同期 |
| | `/update-codemaps` | アーキテクチャドキュメントの更新 |
| **状態管理** | `/checkpoint` | 作業状態の保存 |
| **学習と最適化** | `/learn` | 再利用可能なパターンの抽出 |
| **設定** | `/setup-pm` | パッケージマネージャーの設定 |

## 開発フロー系コマンド

### /plan：複雑な機能の計画

**用途**：コーディング開始前に、詳細な実装計画を作成します。

**適用シナリオ**：
- 新機能開発の開始
- 大規模なアーキテクチャ変更
- 要件が不明確または曖昧な場合
- 複数ファイル/コンポーネントの協調的な修正

**ワークフロー**：

```
1. 要件の再説明
   ↓
2. リスクと依存関係の特定
   ↓
3. 具体的な段階への分割
   ↓
4. 確認待ち
```

::: warning 重要な特性

planner agent は計画を明確に**確認されるまでコードを一切書きません**。

:::

**例**：

```
あなた：/plan リアルタイム通知機能を追加する必要があります

Claude：
# Implementation Plan: Real-Time Market Resolution Notifications

## Requirements Restatement
- Send notifications when markets resolve
- Support multiple channels (in-app, email, webhook)
- Ensure reliable delivery
- Include market outcome and user's position result

## Implementation Phases
### Phase 1: Database Schema
- Add notifications table
- Add user_notification_preferences table
- Create indexes

### Phase 2: Notification Service
- Create notification queue using BullMQ/Redis
- Implement retry logic
- Create notification templates

...

WAITING FOR CONFIRMATION: Proceed with this plan? (yes/no/modify)
```

**ベストプラクティス**：
- ✅ 複雑な機能は先に計画してから実装
- ✅ リスクと依存関係を慎重に確認
- ✅ 段階ごとに実行し、各段階で検証
- ❌ 計画を直接スキップしない

---

### /tdd：テスト駆動開発

**用途**：TDD フローを強制実行し、テストカバレッジ ≥ 80% を保証します。

**適用シナリオ**：
- 新機能の実装
- Bug 修正（まず Bug を再現できるテストを書く）
- 既存コードのリファクタリング
- コアビジネスロジックの作成

**TDD サイクル**：

```
RED → GREEN → REFACTOR → REPEAT

RED:      失敗するテストを書く
GREEN:    テストを通過させる最小限のコードを書く
REFACTOR: テストを通過させたままコードを改善
REPEAT:   次の機能/シナリオへ
```

::: warning 強制要件

**必ずテストを先に書き、コードは後に書きます**。RED 段階をスキップすることはできません。

:::

**例**：

```
あなた：/tdd 市場の流動性スコアを計算する関数が必要です

Claude（tdd-guide agent）：
## Step 1: Define Interface (SCAFFOLD)
```typescript
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}
```

## Step 2: Write Failing Test (RED)
```typescript
test('should return high score for liquid market', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Step 3: Run Tests - Verify FAIL
```bash
npm test lib/liquidity.test.ts
FAIL ✕ should return high score for liquid market
  Error: Not implemented
```

## Step 4: Implement Minimal Code (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // 実装コード...
}
```

## Step 5: Run Tests - Verify PASS
```bash
npm test lib/liquidity.test.ts
PASS ✓ should return high score for liquid market
```

## Step 6: Refactor (IMPROVE)
// コード構造の改善...

## Step 7: Verify Tests Still Pass
```bash
npm test lib/liquidity.test.ts
PASS ✓ all tests passing
```

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)
```

**ベストプラクティス**：
- ✅ インターフェース定義を先に書く
- ✅ テストが失敗してから実装
- ✅ 機能を書き終えたらすぐにテスト
- ✅ リファクタリングの前後でテストの通過を確認
- ✅ カバレッジ ≥ 80%（クリティカルコードは 100%）
- ❌ 大量のコードを書いてからテストしない
- ❌ RED 段階をスキップしない
- ❌ 実装詳細をテストしない

---

### /orchestrate：エージェントのシーケンシャル実行

**用途**：複数エージェントのシーケンスワークフローを自動化実行します。

**適用シナリオ**：
- 完全な機能開発（planner → tdd-guide → code-reviewer → security-reviewer）
- Bug 修正フロー（explorer → tdd-guide → code-reviewer）
- セキュリティレビュー（security-reviewer → code-reviewer → architect）

**ワークフロータイプ**：

| ワークフロータイプ | エージェントシーケンス |
| --- | --- |
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**例**：

```
あなた：/orchestrate feature "ユーザー認証機能の追加"

Claude：
### ORCHESTRATION REPORT
Workflow: feature
Task: ユーザー認証機能の追加
Agents: planner → tdd-guide → code-reviewer → security-reviewer

SUMMARY
-------
ユーザー認証機能の実装に成功。登録、ログイン、セッション管理を含む。

AGENT OUTPUTS
-------------
Planner: 4段階の実装計画を作成
TDD Guide: 認証サービスを実装、カバレッジ 95%
Code Reviewer: 高優先度の問題を3つ発見、修正済み
Security Reviewer: セキュリティ監査に合格、脆弱性なし

FILES CHANGED
-------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

TEST RESULTS
------------
PASS: 24/24 tests (100%)

SECURITY STATUS
---------------
✅ No vulnerabilities found

RECOMMENDATION
--------------
✅ SHIP - Ready for production
```

**ベストプラクティス**：
- ✅ 複雑な機能には orchestrate を使用
- ✅ 各エージェント間に明確なハンドオフドキュメント
- ✅ 独立したチェックは並列実行（code-reviewer と security-reviewer）
- ❌ 単純なタスクに orchestrate を使用しない

---

## コード品質系コマンド

### /code-review：コードレビュー

**用途**：未コミットのコードを包括的にレビューし、セキュリティ問題とコード品質をチェックします。

**適用シナリオ**：
- コードをコミットする前
- PR をマージする前
- 機能開発完了後

**チェック項目**：

| カテゴリ | チェック内容 | 重要度 |
| --- | --- | --- |
| **セキュリティ** | ハードコードされたキー、SQL インジェクション、XSS、入力検証の欠如 | CRITICAL |
| **コード品質** | 関数 > 50 行、ファイル > 800 行、ネスト深度 > 4 | HIGH |
| **ベストプラクティス** | ミューテーションパターン、console.log、テストの欠如、TODO/FIXME | MEDIUM |

**例**：

```
あなた：/code-review

Claude（code-reviewer agent）：
# Code Review Report

## Security Issues (CRITICAL)
🔴 [HIGH] Hardcoded API key
File: src/api/github.ts:15
Issue: GitHub token is hardcoded
Fix: Move to environment variable

## Code Quality (HIGH)
🟡 [MEDIUM] Function exceeds 50 lines
File: src/utils/formatter.ts:62
Lines: 78
Issue: FormatLargeData function is too long
Fix: Split into smaller functions

## Best Practices (MEDIUM)
🟢 [LOW] TODO comment
File: src/services/user.ts:45
Issue: TODO: Add rate limiting
Fix: Implement or remove comment

SUMMARY
--------
CRITICAL: 1 (Must fix before commit)
HIGH: 2 (Should fix)
MEDIUM: 3 (Nice to have)

❌ BLOCKED - Critical security issues found
```

::: danger コミットブロックルール

**CRITICAL** または **HIGH** レベルの問題が発見された場合、コミットはブロックされます。

:::

---

### /build-fix：ビルドエラーの修正

**用途**：TypeScript とビルドエラーを1つずつ修正します。

**適用シナリオ**：
- `npm run build` が失敗した場合
- TypeScript 型エラー
- コンパイルエラー

**ワークフロー**：

```
1. ビルドの実行
   ↓
2. エラー出力の解析、重要度でソート
   ↓
3. 1つずつ修正：
   - エラーコンテキストの表示
   - 問題の説明
   - 修正案の提示
   - 修正の適用
   - ビルドの再実行
   ↓
4. 修正サマリーの生成
```

**例**：

```
あなた：/build-fix

Claude（build-error-resolver agent）：
# Fixing Build Errors

Running build: npm run build
Found 5 errors

## Error 1: Type 'string' is not assignable to type 'number'
File: src/calculator.ts:15
```typescript
const result = add("10", "20")  // Error
```
Issue: add function expects numbers, received strings
Fix: Convert to numbers
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Fixed. Re-running build...

## Error 2: Cannot find module './utils'
File: src/index.ts:3
Issue: Import path is incorrect
Fix: Change to './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Fixed. Re-running build...

...

SUMMARY
-------
Errors Fixed: 5
Errors Remaining: 0
Build Status: ✅ PASS
```

::: tip 安全第一

一度に1つのエラーのみを修正し、新しい問題を導入しないようにします。

:::

---

### /refactor-clean：デッドコードの削除

**用途**：未使用のコードを安全に特定し、削除します。

**適用シナリオ**：
- コードベースに大量の未使用ファイルやエクスポートがある
- メンテナンス負荷の軽減
- コード可読性の向上

**ワークフロー**：

```
1. デッドコード分析ツールの実行
   - knip：未使用のエクスポートとファイルを検索
   - depcheck：未使用の依存関係を検索
   - ts-prune：未使用の TypeScript エクスポートを検索
   ↓
2. 包括的レポートの生成
   ↓
3. 重要度で分類
   - SAFE：テストファイル、未使用のユーティリティ関数
   - CAUTION：API ルート、コンポーネント
   - DANGER：設定ファイル、エントリーポイント
   ↓
4. 1つずつ削除（先にテスト）
   ↓
5. 削除サマリーの生成
```

**例**：

```
あなた：/refactor-clean

Claude（refactor-cleaner agent）：
# Dead Code Analysis

## Tools Run
- ✅ knip: Found 12 unused exports
- ✅ depcheck: Found 5 unused dependencies
- ✅ ts-prune: Found 8 unused TypeScript exports

## Classification

### SAFE (Can delete)
- `src/utils/old-helper.ts` - Unused utility function
- `src/components/Button.tsx` - Not used anywhere
- `lodash` - Unused dependency

### CAUTION (Review first)
- `src/api/users.ts` - Only used in tests
- `@types/node` - May be used in build scripts

### DANGER (Do not delete)
- `src/index.ts` - Main entry point
- `tsconfig.json` - Configuration file

## Deletion Plan

Run full test suite first:
✅ Tests passing (98% coverage)

Deleting SAFE items...

1. Removing src/utils/old-helper.ts
   ✅ Tests still passing

2. Removing src/components/Button.tsx
   ✅ Tests still passing

3. Removing lodash from package.json
   ✅ Tests still passing

SUMMARY
-------
Files deleted: 12
Dependencies removed: 5
Tests still passing: ✅
```

::: warning テスト優先

**コードを削除する前に必ずテストを実行し**、既存の機能を破壊していないことを確認してください。

:::

---

### /verify：包括的検証

**用途**：完全なコード検証チェックを実行します。

**適用シナリオ**：
- コードをコミットする前
- PR をマージする前
- リリース準備時

**チェック項目**（順序付き）：

1. **ビルドチェック** - ビルドコマンドを実行
2. **型チェック** - TypeScript チェッカーを実行
3. **Lint チェック** - linter を実行
4. **テストスイート** - すべてのテストを実行し、カバレッジを報告
5. **Console.log 監査** - ソースファイル内の console.log を検索
6. **Git 状態** - 未コミットの変更を表示

**例**：

```
あなた：/verify pre-pr

Claude：
# Verification Report

VERIFICATION: ✅ PASS

Build:    ✅ OK
Types:    ✅ OK (0 errors)
Lint:     ✅ OK (0 issues)
Tests:    ✅ 142/145 passed, 98% coverage
Secrets:  ✅ OK (0 found)
Logs:     ⚠️ 3 console.logs found

Console.log locations:
- src/utils/logger.ts:15 (intentional logger)
- src/api/webhook.ts:42 (debug, remove before commit)
- src/services/auth.ts:89 (debug, remove before commit)

Ready for PR: ⚠️ YES (remove debug logs)

Files modified since last commit:
- src/api/webhook.ts (new)
- src/services/auth.ts (modified)
- tests/auth.test.ts (modified)
```

**パラメータ**：
- `quick` - ビルド + 型チェックのみ
- `full` - すべてのチェック（デフォルト）
- `pre-commit` - コミット関連チェック
- `pre-pr` - 完全チェック + セキュリティスキャン

---

## テスト系コマンド

### /e2e：E2E テスト

**用途**：Playwright を使用して E2E テストを生成・実行します。

**適用シナリオ**：
- 重要なユーザーフロー（ログイン、取引、支払い）のテスト
- マルチステップフローのエンドツーエンド統合の検証
- UI インタラクションとナビゲーションのテスト
- 本番デプロイの準備

**ワークフロー**：

```
1. ユーザーフローの分析、テストシナリオの特定
   ↓
2. Playwright テストの生成（Page Object パターン使用）
   ↓
3. 複数ブラウザでのテスト実行（Chrome、Firefox、Safari）
   ↓
4. 失敗時のスクリーンショット、動画、トレースのキャプチャ
   ↓
5. 結果とアーティファクトを含むレポートの生成
   ↓
6. 不安定なテストの特定と修正の提案
```

**例**：

```
あなた：/e2e 市場検索と閲覧フローをテスト

Claude（e2e-runner agent）：
# E2E Test Generation: Market Search and View Flow

## Test Scenario Identified
**User Journey:** Market Search → View Results → Click Market → View Details

## Generated Test Code
```typescript
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test('user can search markets and view details', async ({ page }) => {
  const marketsPage = new MarketsPage(page)
  await marketsPage.goto()

  // Perform search
  await marketsPage.searchMarkets('election')
  await page.waitForResponse(resp =>
    resp.url().includes('/api/markets/search') && resp.status() === 200
  )

  // Verify results
  const marketCards = marketsPage.marketCards
  await expect(marketCards.first()).toBeVisible()

  // Click on first result
  await marketCards.first().click()

  // Verify market details page loads
  await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)
  await expect(page.locator('[data-testid="market-name"]')).toBeVisible()
})
```

## Running Tests
```bash
npx playwright test tests/e2e/markets/search-and-view.spec.ts

✓ [chromium] user can search markets and view details (4.2s)
✓ [chromium] search with no results shows empty state (1.8s)

2 passed (6.0s)

Artifacts generated:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Test Report
╔══════════════════════════════════════════════════════╗
║ Status:     ✅ ALL TESTS PASSED                       ║
║ Total:      2 tests                                    ║
║ Passed:     2 (100%)                                   ║
║ Flaky:      0                                           ║
╚══════════════════════════════════════════════════════╝
```

**クイックコマンド**：

```bash
# すべての E2E テストを実行
npx playwright test

# 特定のテストファイルを実行
npx playwright test tests/e2e/markets/search.spec.ts

# headed モードで実行（ブラウザを表示）
npx playwright test --headed

# テストをデバッグ
npx playwright test --debug

# レポートを表示
npx playwright show-report
```

**ベストプラクティス**：
- ✅ Page Object Model を使用して保守性を向上
- ✅ セレクターとして data-testid 属性を使用
- ✅ API レスポンスを待ち、任意のタイムアウトを避ける
- ✅ 重要なユーザーフローをテスト
- ❌ 脆弱なセレクター（CSS クラスは変更される）を使用しない
- ❌ 実装詳細をテストしない

---

### /test-coverage：テストカバレッジ分析

**用途**：テストカバレッジを分析し、欠落しているテストを生成します。

**適用シナリオ**：
- カバレッジが 80% 未満
- テストを追加する必要がある

**ワークフロー**：

```
1. カバレッジ付きでテストを実行
   ↓
2. カバレッジレポートを分析（coverage/coverage-summary.json）
   ↓
3. 80% カバレッジ閾値を下回るファイルを特定
   ↓
4. カバレッジ不足の各ファイルに対して：
   - 未テストのコードパスを分析
   - 関数のユニットテストを生成
   - API の統合テストを生成
   ↓
5. 新しいテストの通過を検証
   ↓
6. 前後のカバレッジ指標を表示
```

**例**：

```
あなた：/test-coverage

Claude：
# Test Coverage Analysis

Running tests with coverage...
npm test --coverage

## Coverage Report

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   65    |   50     |   75    |   63  ⚠️
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   45    |   30     |   50    |   44  ⚠️

Overall                   |   78    |   72     |   85    |   76  ⚠️

Target: 80%
Current: 76% ❌ Need to improve

## Generating Missing Tests

### File: src/utils/formatter.ts (65% coverage)
Untested paths:
- FormatCurrency with negative values
- FormatDate with custom locale
- TruncateText with long strings

Generating tests...
```typescript
describe('formatter', () => {
  it('should format negative currency', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })

  it('should format date with custom locale', () => {
    expect(formatDate(new Date(), 'ja-JP')).toMatch('2024年')
  })

  it('should truncate long text', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe('aaaaaaaaaa...')
  })
})
```

### File: src/components/Button.tsx (45% coverage)
Untested paths:
- Disabled state
- Loading state
- onClick handler

Generating tests...

## After Adding Tests

Running tests again...

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   100   |   95     |   100   |   99  ✅
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   95    |   90     |   100   |   94  ✅

Overall                   |   95    |   92     |   100   |   94  ✅

Target: 80%
Current: 94% ✅ EXCEEDED

Summary: +12 tests added, Coverage: 76% → 94%
```

---

### /eval：評価駆動開発

**用途**：Eval 駆動開発ワークフローを管理します。

**適用シナリオ**：
- 評価駆動開発（EDD）
- 機能受入テスト
- 回帰テスト

**サブコマンド**：

- `define <name>` - 新しい eval 定義を作成
- `check <name>` - eval を実行・確認
- `report <name>` - 完全なレポートを生成
- `list` - すべての eval を表示

**例 - Eval の定義**：

```
あなた：/eval define user-auth

Claude：
Eval 定義を作成...

.claude/evals/user-auth.md:

## EVAL: user-auth
Created: 2026-01-25

### Capability Evals
- [ ] User can register with email and password
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] User can reset password via email

### Regression Evals
- [ ] Existing users can still login
- [ ] Session tokens still work
- [ ] OAuth login still works

### Success Criteria
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals

具体的な評価基準を入力してください...
```

**例 - Eval の確認**：

```
あなた：/eval check user-auth

Claude：
Eval を実行...

EVAL CHECK: user-auth
=======================
Capability: 2/4 passing
Regression: 2/3 passing
Status: IN PROGRESS

Capability Results:
✅ User can register with email and password
✅ User can login with correct credentials
❌ User cannot login with wrong password (fails intermittently)
❌ User can reset password via email (not implemented)

Regression Results:
✅ Existing users can still login
✅ Session tokens still work
❌ OAuth login still works (test failing due to rate limit)

RECOMMENDATION: NEEDS WORK - Fix password validation and implement password reset
```

**例 - Eval レポート**：

```
あなた：/eval report user-auth

Claude：
包括的レポートを生成...

EVAL REPORT: user-auth
=========================
Generated: 2026-01-25

CAPABILITY EVALS
----------------
[register-email-pass]: PASS (pass@1)
[login-credentials-pass]: PASS (pass@2) - required retry
[login-wrong-pass-fail]: FAIL - see notes
[password-reset-pass]: FAIL - not implemented

REGRESSION EVALS
----------------
[existing-users-login]: PASS
[session-tokens]: PASS
[oauth-login]: PASS

METRICS
-------
Capability pass@1: 50%
Capability pass@3: 100%
Regression pass^3: 100%

NOTES
-----
Password validation test is flaky due to timing issue.
Need to implement password reset flow.

RECOMMENDATION
--------------
NEEDS WORK - Complete password reset implementation
```

---

## ドキュメントとアーキテクチャ系コマンド

### /update-docs：ドキュメントの同期

**用途**：ソースコードからドキュメントを同期します。

**適用シナリオ**：
- コード変更後にドキュメントを更新
- ドキュメントとコードの同期を維持

**ワークフロー**：

```
1. package.json の scripts セクションを読み取り
   - スクリプトリファレンス表を生成
   - コメントから説明を抽出
   ↓
2. .env.example を読み取り
   - すべての環境変数を抽出
   - 用途とフォーマットを記録
   ↓
3. docs/CONTRIB.md を生成
   - 開発ワークフロー
   - 利用可能なスクリプト
   - 環境設定
   - テスト手順
   ↓
4. docs/RUNBOOK.md を生成
   - デプロイ手順
   - 監視とアラート
   - よくある問題と修正
   - ロールバック手順
   ↓
5. 古いドキュメントを特定
   - 90日以上更新されていないドキュメントを検索
   - 人手によるレビュー用にリストアップ
   ↓
6. diff サマリーを表示
```

::: tip 単一真実源

package.json と .env.example は唯一の真実源です。

:::

---

### /update-codemaps：アーキテクチャドキュメントの更新

**用途**：コードベース構造を分析し、アーキテクチャドキュメントを更新します。

**適用シナリオ**：
- コード構造変更後
- アーキテクチャドキュメントの更新が必要

**ワークフロー**：

```
1. すべてのソースファイルのインポート、エクスポート、依存関係をスキャン
   ↓
2. 簡潔な codemap を生成：
   - codemaps/architecture.md - 全体アーキテクチャ
   - codemaps/backend.md - バックエンド構造
   - codemaps/frontend.md - フロントエンド構造
   - codemaps/data.md - データモデルとスキーマ
   ↓
3. 前バージョンとの差分率を計算
   ↓
4. 変更が 30% を超える場合、更新前にユーザー承認を要求
   ↓
5. 各 codemap に鮮度タイムスタンプを追加
   ↓
6. レポートを .reports/codemap-diff.txt に保存
```

**例**：

```
あなた：/update-codemaps

Claude：
コードベース構造を分析...

Scanning 156 files...
Found 89 imports and 124 exports

## Codemap Diff

Previous version: 2026-01-20
Current version: 2026-01-25
Diff: 12% (under 30% threshold)

✅ Safe to update

## Updated Codemaps

codemaps/architecture.md
- Updated module dependencies
- Added new services: auth, notifications
- Removed deprecated modules: legacy-db

codemaps/backend.md
- Updated API routes structure
- Added middleware documentation

codemaps/frontend.md
- Updated component hierarchy
- Added new pages: profile, settings

codemaps/data.md
- Updated database schemas
- Added new tables: users, sessions

Summary: 4 codemaps updated, 12% change
```

---

## 状態管理系コマンド

### /checkpoint：作業状態の保存

**用途**：ワークフロー内でチェックポイントを作成または検証します。

**適用シナリオ**：
- 重要な開発段階を保存
- ロールバックと進捗追跡のサポート

**サブコマンド**：

- `create <name>` - 名前付きチェックポイントを作成
- `verify <name>` - チェックポイントを検証
- `list` - すべてのチェックポイントを表示
- `clear` - 古いチェックポイントを削除（最新5つを保持）

**例**：

```
あなた：/checkpoint create feature-start

Claude：
# Creating Checkpoint: feature-start

Running /verify quick...

Build: ✅ OK
Types: ✅ OK

Creating checkpoint...

✅ Checkpoint "feature-start" created
├─ Timestamp: 2026-01-25-14:30
├─ Git SHA: abc1234
└─ Status: Clean (no uncommitted changes)
```

```
あなた：/checkpoint verify feature-start

Claude：
CHECKPOINT COMPARISON: feature-start
===========================
Files changed: 5
Tests: +3 passed / -0 failed
Coverage: +5% / -0%
Build: PASS

Changes since checkpoint:
✅ src/services/auth.ts (modified)
✅ tests/auth.test.ts (added)
✅ src/components/Login.tsx (added)
```

**ワークフロー**：

```
[開始] → /checkpoint create "feature-start"
   |
[実装] → /checkpoint create "core-done"
   |
[テスト] → /checkpoint verify "core-done"
   |
[リファクタ] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## 学習と最適化系コマンド

### /learn：再利用可能なパターンの抽出

**用途**：現在のセッションを分析し、スキルとして保存可能なパターンを抽出します。

**適用シナリオ**：
- 非自明な問題を解決した後
- 再利用可能なエラー解決パターンを発見した場合
- プロジェクト固有の規約を記録する場合

**抽出内容**：

1. **エラー解決パターン**
   - どんなエラーが発生したか？
   - 根本原因は何か？
   - どう修正したか？
   - 類似のエラーに再利用可能か？

2. **デバッグテクニック**
   - 自明でないデバッグステップ
   - 効果的なツールの組み合わせ
   - 診断パターン

3. **Workarounds**
   - ライブラリの quirks
   - API 制限
   - バージョン固有の修正

4. **プロジェクト固有のパターン**
   - 発見したコードベースの規約
   - 行ったアーキテクチャ決定
   - 統合パターン

**例**：

```
あなた：/learn

Claude：
# Extracting Patterns from Session

Reviewing session history...

Found 3 extractable patterns:

## Pattern 1: Supabase Auth Session Recovery
**Type:** Error Resolution
**Reusability:** High (affects all auth endpoints)

### Problem
After user logs in, subsequent API calls fail with 401 Unauthorized.

### Root Cause
Supabase session cookie is not being sent to backend API due to CORS configuration.

### Solution
```typescript
// Configure Supabase with correct URL
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: 'my-app-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

### When to Use
Trigger: Auth endpoints returning 401 unexpectedly

---

## Pattern 2: Playwright Test Flakiness Fix
**Type:** Debugging Technique
**Reusability:** Medium (affects async UI tests)

### Problem
Test "user can click submit button" fails intermittently with timeout.

### Root Cause
Button is disabled initially due to async validation, but test doesn't wait.

### Solution
```typescript
// Use explicit wait with predicate
await page.waitForSelector('[data-testid="submit-btn"]:not(:disabled)', {
  timeout: 10000
})

// Then click
await page.locator('[data-testid="submit-btn"]').click()
```

### When to Use
Trigger: Test timing issues with async UI state

---

Do you want to save these patterns? (yes/no/modify)
```

::: tip フォーカス原則

一度に1つのパターンを抽出し、スキルを集中させましょう。

:::

---

## 設定系コマンド

### /setup-pm：パッケージマネージャーの設定

**用途**：プロジェクトまたはグローバルの優先パッケージマネージャーを設定します。

**適用シナリオ**：
- 現在使用しているパッケージマネージャーを検出
- グローバルまたはプロジェクトの設定

**検出優先度**：

1. 環境変数：`CLAUDE_PACKAGE_MANAGER`
2. プロジェクト設定：`.claude/package-manager.json`
3. package.json：`packageManager` フィールド
4. Lock ファイル：package-lock.json、yarn.lock、pnpm-lock.yaml、bun.lockb
5. グローバル設定：`~/.claude/package-manager.json`
6. フォールバック：利用可能な最初のパッケージマネージャー

**サポートされているパッケージマネージャーの優先度**：pnpm > bun > yarn > npm

**例**：

```bash
# 現在のパッケージマネージャーを検出
node scripts/setup-package-manager.js --detect

# グローバル設定を設定
node scripts/setup-package-manager.js --global pnpm

# プロジェクト設定を設定
node scripts/setup-package-manager.js --project bun

# 利用可能なパッケージマネージャーを一覧表示
node scripts/setup-package-manager.js --list
```

**設定ファイル**：

グローバル設定（`~/.claude/package-manager.json`）：
```json
{
  "packageManager": "pnpm"
}
```

プロジェクト設定（`.claude/package-manager.json`）：
```json
{
  "packageManager": "bun"
}
```

環境変数はすべての検出方法を上書き：
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## コマンド組み合わせワークフロー

### 完全な機能開発フロー

```
1. /plan "ユーザー認証機能の追加"
   ↓ 実装計画の作成
2. /tdd "認証サービスの実装"
   ↓ TDD 開発
3. /test-coverage
   ↓ カバレッジ ≥ 80% を保証
4. /code-review
   ↓ コードレビュー
5. /verify pre-pr
   ↓ 包括的検証
6. /checkpoint create "auth-feature-done"
   ↓ チェックポイントの保存
7. /update-docs
   ↓ ドキュメントの更新
8. /update-codemaps
   ↓ アーキテクチャドキュメントの更新
```

### Bug 修正フロー

```
1. /checkpoint create "bug-start"
   ↓ 現在の状態を保存
2. /orchestrate bugfix "ログインエラーの修正"
   ↓ Bug 修正フローを自動化
3. /test-coverage
   ↓ テストカバレッジを保証
4. /verify quick
   ↓ 修正を検証
5. /checkpoint verify "bug-start"
   ↓ チェックポイントと比較
```

### セキュリティレビューフロー

```
1. /orchestrate security "支払いフローのレビュー"
   ↓ セキュリティ優先のレビューフロー
2. /e2e "支払いフローのテスト"
   ↓ E2E テスト
3. /code-review
   ↓ コードレビュー
4. /verify pre-pr
   ↓ 包括的検証
```

---

## コマンド比較クイックリファレンス

| コマンド | 主な用途 | 呼び出す Agent | 出力 |
| --- | --- | --- | --- |
| `/plan` | 実装計画の作成 | planner | 段階別計画 |
| `/tdd` | TDD 開発 | tdd-guide | テスト + 実装 + カバレッジ |
| `/orchestrate` | エージェントのシーケンシャル実行 | 複数のエージェント | 包括的レポート |
| `/code-review` | コードレビュー | code-reviewer, security-reviewer | セキュリティと品質レポート |
| `/build-fix` | ビルドエラーの修正 | build-error-resolver | 修正サマリー |
| `/refactor-clean` | デッドコードの削除 | refactor-cleaner | 削除サマリー |
| `/verify` | 包括的検証 | Bash | 検証レポート |
| `/e2e` | E2E テスト | e2e-runner | Playwright テスト + アーティファクト |
| `/test-coverage` | カバレッジ分析 | Bash | カバレッジレポート + 欠落テスト |
| `/eval` | 評価駆動開発 | Bash | Eval 状態レポート |
| `/checkpoint` | 状態の保存 | Bash + Git | チェックポイントレポート |
| `/learn` | パターンの抽出 | continuous-learning skill | Skill ファイル |
| `/update-docs` | ドキュメントの同期 | doc-updater agent | ドキュメント更新 |
| `/update-codemaps` | アーキテクチャの更新 | doc-updater agent | Codemap 更新 |
| `/setup-pm` | パッケージマネージャーの設定 | Node.js スクリプト | パッケージマネージャー検出 |

---

## よくある失敗パターン

### ❌ 計画段階をスキップしない

複雑な機能で直接コーディングを始めると：
- 重要な依存関係を見落とす
- アーキテクチャが不統一になる
- 要件の理解に偏りが生じる

**✅ 正しい方法**：詳細な計画を `/plan` で作成し、確認を待ってから実装。

---

### ❌ TDD で RED 段階をスキップしない

コードを先に書いてからテストを書くと、それは TDD ではありません。

**✅ 正しい方法**：RED → GREEN → REFACTOR サイクルを厳密に実行。

---

### ❌ /code-review の CRITICAL 問題を無視しない

セキュリティ脆弱性は、データ漏洩、金銭的損失などの深刻な結果を招く可能性があります。

**✅ 正しい方法**：すべての CRITICAL と HIGH レベルの問題を修正してからコミット。

---

### ❌ コードを削除する前にテストしない

デッドコード分析には誤検出があり、直接削除すると機能を破壊する可能性があります。

**✅ 正しい方法**：削除のたびに先にテストを実行し、既存の機能を破壊していないことを確認。

---

### ❌ /learn の使用を忘れない

非自明な問題を解決した後にパターンを抽出しないと、次に同じ問題に遭遇したときにまた最初から解決する必要があります。

**✅ 正しい方法**：定期的に `/learn` を使用し、再利用可能なパターンを抽出して知見を蓄積。

---

## 本レッスンのまとめ

Everything Claude Code の15個のスラッシュコマンドは、完全な開発ワークフローをサポートします：

- **開発フロー**：`/plan` → `/tdd` → `/orchestrate`
- **コード品質**：`/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **テスト**：`/e2e` → `/test-coverage` → `/eval`
- **ドキュメントとアーキテクチャ**：`/update-docs` → `/update-codemaps`
- **状態管理**：`/checkpoint`
- **学習と最適化**：`/learn`
- **設定**：`/setup-pm`

これらのコマンドを習得すれば、効率的に、安全に、品質を保ちながら開発作業を完了できます。

---

## 次回レッスンの予告

> 次回は **[コア Agents 詳解](../agents-overview/)** を学習します。
>
> 学習内容：
> - 9個の専門エージェントの責務と適用シナリオ
> - どのエージェントをいつ呼び出すか
> - エージェント間の連携方法
> - エージェント設定のカスタマイズ方法

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | ---|
| TDD コマンド | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Plan コマンド | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Code Review コマンド | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| E2E コマンド | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Build Fix コマンド | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Refactor Clean コマンド | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Learn コマンド | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Checkpoint コマンド | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify コマンド | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Test Coverage コマンド | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Setup PM コマンド | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Update Docs コマンド | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Orchestrate コマンド | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Update Codemaps コマンド | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Eval コマンド | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Plugin 定義 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**重要な定数**：
- TDD カバレッジ目標：80%（クリティカルコードは 100%） - `commands/tdd.md:293-300`

**重要な関数**：
- TDD サイクル：RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Plan 確認待ちメカニズム - `commands/plan.md:96`
- Code Review 重要度レベル：CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
