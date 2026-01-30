---
title: "コードレビュー: /code-review ワークフロー | Everything Claude Code"
subtitle: "コードレビュー: /code-review ワークフロー"
sidebarTitle: "コミット前にコードを確認"
description: "/code-review コマンドの使用方法を学びます。code-reviewer と security-reviewer agent のコード品質とセキュリティチェックを習得し、コミット前にセキュリティ脆弱性とコード問題を発見します。"
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# コードレビューワークフロー：/code-review とセキュリティ監査

## この章でできること

**コードレビュー**はコード品質とセキュリティを確保するための重要なプロセスです。このチュートリアルでは以下のことを学びます：

- ✅ `/code-review` コマンドを使用してコード変更を自動チェックする
- ✅ code-reviewer agent と security-reviewer agent の違いを理解する
- ✅ セキュリティチェックリスト（OWASP Top 10）を習得する
- ✅ 一般的なセキュリティ脆弱性（SQL インジェクション、XSS、ハードコードされたキーなど）を検出・修正する
- ✅ コード品質基準（関数サイズ、ファイル長、テストカバレッジなど）を適用する
- ✅ 承認基準（CRITICAL、HIGH、MEDIUM、LOW）を理解する

## あなたの現在の悩み

コードを書き終え、コミットしようとしていますが：

- ❌ コードにセキュリティ脆弱性があるかわからない
- ❌ コード品質の問題を見逃しているのではないかと心配
- ❌ ベストプラクティスに従っているか不確実
- ❌ 手動チェックは時間がかかり、見落としがち
- ❌ コミット前に自動的に問題を発見したい

**Everything Claude Code** のコードレビューワークフローはこれらの問題を解決します：

- **自動チェック**：`/code-review` コマンドですべての変更を自動分析
- **専門的レビュー**：code-reviewer agent はコード品質、security-reviewer agent はセキュリティに特化
- **標準分類**：問題は重要度で分類（CRITICAL、HIGH、MEDIUM、LOW）
- **詳細な提案**：各問題には具体的な修正提案が含まれる

## この機能を使うべきタイミング

**コードをコミットするたびに**コードレビューを実行すべきです：

- ✅ 新しい機能コードの実装後
- ✅ バグ修正後
- ✅ コードリファクタリング後
- ✅ API エンドポイント追加時（security-reviewer を必須実行）
- ✅ ユーザー入力を処理するコード（security-reviewer を必須実行）
- ✅ 認証/認可に関わるコード（security-reviewer を必須実行）

::: tip ベストプラクティス
習慣づけ：毎回 `git commit` の前に、まず `/code-review` を実行してください。CRITICAL または HIGH の問題がある場合、修正してからコミットしてください。
:::

## 🎒 事前の準備

**必要なもの**：
- Everything Claude Code がインストール済み（まだの場合は[クイックスタート](../../start/quickstart/)を確認）
- コード変更がある（`/tdd` を使ってコードを書く）
- Git の基本操作を理解している

**不要なもの**：
- セキュリティエキスパートである必要はない（agent が検出してくれる）
- すべてのセキュリティベストプラクティスを覚えておく必要はない（agent が提醒してくれる）

---

## 核心となる考え方

Everything Claude Code は2つの専門的なレビュー agent を提供します：

### code-reviewer agent

**コード品質とベストプラクティスに焦点を当て**、以下をチェックします：

- **コード品質**：関数サイズ（>50 行）、ファイル長（>800 行）、ネスト深度（>4 層）
- **エラーハンドリング**：try/catch の欠如、console.log ステートメント
- **コード規約**：命名規約、重複コード、イミュータブルパターン
- **ベストプラクティス**：Emoji 使用、TODO/FIXME にチケット欠如、JSDoc 欠如
- **テストカバレッジ**：新しいコードにテストがない

**使用シナリオ**：すべてのコード変更は code-reviewer を通すべきです。

### security-reviewer agent

**セキュリティ脆弱性と脅威に焦点を当て**、以下をチェックします：

- **OWASP Top 10**：SQL インジェクション、XSS、CSRF、認証回避など
- **シークレット漏洩**：ハードコードされた API keys、パスワード、tokens
- **入力検証**：欠如または不適切なユーザー入力検証
- **認証認可**：不適切なアイデンティティ検証と権限チェック
- **依存関係セキュリティ**：古いまたは既知の脆弱性がある依存パッケージ

**使用シナリオ**：セキュリティに敏感なコード（API、認証、支払い、ユーザー入力）は security-reviewer を必須で通すべきです。

### 問題の重要度分類

| レベル | 意味 | コミットを阻止するか | 例 |
|--- | --- | --- | ---|
| **CRITICAL** | 重大なセキュリティ脆弱性または重大な品質問題 | ❌ 必須阻止 | ハードコードされた API key、SQL インジェクション |
| HIGH | 重要なセキュリティまたはコード品質問題 | ❌ 必須阻止 | エラーハンドリング欠如、XSS 脆弱性 |
| MEDIUM | 中程度の優先度の問題 | ⚠️ 注意してコミット可 | Emoji 使用、JSDoc 欠如 |
| LOW | 軽微な問題 | ✓ 後で修正可 | フォーマット不一致、マジックナンバー |

---

## 手順：初めてのコードレビュー

### ステップ 1：コード変更を作成する

まず `/tdd` を使って簡単な API エンドポイントを書きます（いくつかのセキュリティ上の問題を含む）：

```bash
/tdd
```

Claude Code にユーザーログイン API を作成させると、コードは次のようになります：

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ SQL インジェクションリスク
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ 平文パスワード比較
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ ログでパスワード漏洩
    return { token }
  }
}
```

**理由**
このコードは複数のセキュリティ上の問題とコード品質問題を含んでおり、コードレビュー機能のデモンストレーションに適しています。

**期待される結果**：コードファイルが作成されます。

---

### ステップ 2：コードレビューを実行する

ここで `/code-review` コマンドを実行します：

```bash
/code-review
```

**理由**
`/code-review` は自動的に code-reviewer agent を呼び出し、コミットされていないすべての変更をチェックします。

**期待される結果**：agent がコードの分析を開始し、レビューレポートを出力します。

---

### ステップ 3：レビューレポートを確認する

code-reviewer は次のようなレポートを出力します：

```markdown
# Code Review Report

## Critical Issues (Fix Immediately)

### 1. [CRITICAL] Hardcoded credentials
**File:** src/api/login.ts:3
**Issue:** Password logging in console
**Fix:** Remove password from logs, only log user ID

```typescript
// ❌ Bad
console.log('User logged in:', { email, password })

// ✓ Good
console.log('User logged in:', { email, userId: user.id })
```

---

### 2. [CRITICAL] SQL injection vulnerability
**File:** src/api/login.ts:2
**Issue:** String concatenation in SQL query
**Fix:** Use parameterized queries

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✓ Good
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

---

## High Issues (Fix Before Production)

### 3. [HIGH] Plaintext password comparison
**File:** src/api/login.ts:4
**Issue:** Password stored in plaintext
**Fix:** Use bcrypt to hash passwords

```typescript
// ❌ Bad
if (user.password === password) {

// ✓ Good
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.password)
```

---

## Recommendations

1. Add input validation for email format
2. Add rate limiting to prevent brute force attacks
3. Use JWT tokens instead of generating custom tokens

## Approval Status

❌ BLOCKED - 2 CRITICAL issues found

Please fix all CRITICAL and HIGH issues before committing.
```

**理由**
レポートは重要度別に分類され、各問題には場所、説明、修正提案、コード例が含まれます。

**期待される結果**：すべての問題と修正提案を指摘する明確なレビューレポート。

---

### ステップ 4：問題を修正する

レポートに基づいてコードを修正します：

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // 入力検証
  const validated = LoginSchema.parse(input)
  
  // パラメータ化クエリ（SQL インジェクション防止）
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // ハッシュパスワード比較
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**理由**
すべての CRITICAL および HIGH 問題を修正し、入力検証とハッシュパスワード比較を追加します。

**期待される結果**：コードが更新され、セキュリティ上の問題が解消されます。

---

### ステップ 5：再度レビューする

再び `/code-review` を実行します：

```bash
/code-review
```

**理由**
すべての問題が修正されたことを確認し、コードがコミット可能か確認します。

**期待される結果**：次のような合格レポートが表示されます：

```markdown
# Code Review Report

## Summary

- **Critical Issues:** 0 ✓
- **High Issues:** 0 ✓
- **Medium Issues:** 1 ⚠️
- **Low Issues:** 1 💡

## Medium Issues (Fix When Possible)

### 1. [MEDIUM] Missing JSDoc for public API
**File:** src/api/login.ts:9
**Issue:** loginUser function missing documentation
**Fix:** Add JSDoc comments

```typescript
/**
 * Authenticates a user with email and password
 * @param input - Login credentials (email, password)
 * @returns Object with JWT token
 * @throws Error if credentials invalid
 */
export async function loginUser(input: unknown) {
```

---

## Low Issues (Consider Fixing)

### 2. [LOW] Add rate limiting
**File:** src/api/login.ts:9
**Issue:** Login endpoint lacks rate limiting
**Fix:** Add express-rate-limit middleware

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
})

app.post('/api/login', loginLimiter, loginUser)
```

---

## Approval Status

✅ APPROVED - No CRITICAL or HIGH issues

**Note:** Medium and Low issues can be fixed in follow-up commits.
```

**期待される結果**：レビューに合格し、コードをコミットできます。

---

### ステップ 6：セキュリティ専門レビュー（オプション）

コードに API エンドポイント、認証、支払いなどのセキュリティに敏感な機能が含まれる場合、security-reviewer を個別に呼び出すことができます：

```bash
/security-reviewer
```

**理由**
security-reviewer はより深い OWASP Top 10 分析を行い、より多くのセキュリティ脆弱性パターンをチェックします。

**期待される結果**：詳細なセキュリティレビューレポート（OWASP 分析、依存関係脆弱性チェック、セキュリティツール推奨などを含む）。

---

## チェックポイント ✅

上記の手順を完了すると、以下のことができるようになっているはずです：

- ✅ `/code-review` コマンドを実行できる
- ✅ レビューレポートの構造と内容を理解する
- ✅ レポートに基づいてコード問題を修正できる
- ✅ CRITICAL および HIGH 問題は必須修正であることを知る
- ✅ code-reviewer と security-reviewer の違いを理解する
- ✅ コミット前にレビューする習慣を身につける

---

## よくある落とし穴

### よくあるエラー 1：コードレビューをスキップする

**問題**：コードが単純だと思って、レビューせずに直接コミットする。

**結果**：セキュリティ脆弱性を見逃す可能性があり、CI/CD で拒否されたり、本番事故につながったりする。

**正しいアプローチ**：習慣を身につける。毎回コミット前に `/code-review` を実行する。

---

### よくあるエラー 2：MEDIUM 問題を無視する

**問題**：MEDIUM 問題を見てもそのままにして、積み上げていく。

**結果**：コード品質が低下し、技術的負債が蓄積し、メンテナンスが困難になる。

**正しいアプローチ**：MEDIUM 問題はコミットを阻止しませんが、合理的な時間内に修正すべきです。

---

### よくあるエラー 3：SQL インジェクションを手動で修正する

**問題**：パラメータ化クエリではなく、自分で文字列エスケープを書く。

**結果**：エスケープが不完全で、まだ SQL インジェクションのリスクがある。

**正しいアプローチ**：常に ORM またはパラメータ化クエリを使用し、手動で SQL を連結しない。

---

### よくあるエラー 4：2つの reviewer を混同する

**問題**：すべてのコードで code-reviewer だけを実行し、security-reviewer を無視する。

**結果**：セキュリティ脆弱性が見逃される可能性がある。特に API、認証、支払いに関わるコードで。

**正しいアプローチ**：
- 一般的なコード：code-reviewer で十分
- セキュリティに敏感なコード：security-reviewer も必須実行

---

## まとめ

**コードレビューワークフロー**は Everything Claude Code の中核機能の一つです：

| 機能 | agent | チェック内容 | 重要度 |
|--- | --- | --- | ---|
| **コード品質レビュー** | code-reviewer | 関数サイズ、エラーハンドリング、ベストプラクティス | HIGH/MEDIUM/LOW |
| **セキュリティレビュー** | security-reviewer | OWASP Top 10、シークレット漏洩、インジェクション脆弱性 | CRITICAL/HIGH/MEDIUM |

**重要ポイント**：

1. **毎回コミット前に** `/code-review` を実行する
2. **CRITICAL/HIGH 問題**は修正してからコミットする
3. **セキュリティに敏感なコード**は security-reviewer を必須で通す
4. **レビューレポート**には詳細な場所と修正提案が含まれる
5. **習慣を身につける**：レビュー → 修正 → 再レビュー → コミット

---

## 次の章への予告

> 次の章では **[Hooks 自動化](../../advanced/hooks-automation/)** を学びます。
>
> 学べること：
> - Hooks とは何か、開発ワークフローを自動化する方法
> - 15以上の自動化フックの使用方法
> - プロジェクトのニーズに合わせて Hooks をカスタマイズする方法
> - SessionStart、SessionEnd、PreToolUse などのフックの使用シナリオ

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**主要定数**：
- 関数サイズ制限：50 行（code-reviewer.md:47）
- ファイルサイズ制限：800 行（code-reviewer.md:48）
- ネスト深度制限：4 層（code-reviewer.md:49）

**主要関数**：
- `/code-review`：code-reviewer agent を呼び出してコード品質レビューを行う
- `/security-reviewer`：security-reviewer agent を呼び出してセキュリティ監査を行う
- `git diff --name-only HEAD`：コミットされていない変更ファイルを取得（code-review.md:5）

**承認基準**（code-reviewer.md:90-92）：
- ✅ Approve: CRITICAL または HIGH 問題がない
- ⚠️ Warning: MEDIUM 問題のみ（注意してマージ可）
- ❌ Block: CRITICAL または HIGH 問題がある

</details>
