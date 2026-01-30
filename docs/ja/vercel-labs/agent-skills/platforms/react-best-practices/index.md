---
title: "React パフォーマンス最適化：Vercel 57 のルールを適用 | Agent Skills"
sidebarTitle: "React を 2-10 倍高速化"
subtitle: "React/Next.js パフォーマンス最適化のベストプラクティス"
description: "React と Next.js のパフォーマンス最適化を学び、Vercel エンジニアリング標準の 57 のルールを適用します。ウォーターフォールを解消し、バンドルを最適化し、再レンダリングを減らして、アプリケーションのパフォーマンスを向上させます。"
tags:
  - "React"
  - "Next.js"
  - "パフォーマンス最適化"
  - "コードレビュー"
order: 30
prerequisite:
  - "start-getting-started"
---

# React/Next.js パフォーマンス最適化のベストプラクティス

## 学習後できること

- 🎯 AI が React コードのパフォーマンス問題を自動検出し、最適化提案を提供
- ⚡ ウォーターフォールを解消し、ページ読み込み速度を 2-10 倍高速化
- 📦 バンドルサイズを最適化し、初期読み込み時間を短縮
- 🔄 再レンダリングを減らし、ページ応答速度を向上
- 🏗️ Vercel エンジニアリングチームのプロダクションレベルのベストプラクティスを適用

## 現在の課題

React コードを書いていて、どこか違和感を感じることはありませんか？

- ページの読み込みが遅いが、Developer Tools を見ても問題が見つからない
- AI が生成したコードは動くが、パフォーマンスのベストプラクティスに従っているか不明
- 他人の Next.js アプリケーションは高速だが、自分のはカクつく
- 最適化テクニック（`useMemo`、`useCallback` など）を知っているが、いつ使うべきかわからない
- 毎回のコードレビューで手動でパフォーマンス問題をチェックし、効率が悪い

実は、Vercel エンジニアリングチームは実戦で検証された **57 のルール** をまとめています。これには「ウォーターフォールの解消」から「高度なパターン」までのすべてのシナリオが網羅されています。これらのルールは Agent Skills にパッケージ化されており、AI が自動的にコードのチェックと最適化を行えるようになりました。

::: info 「Agent Skills」とは
Agent Skills は AI コーディングエージェント（Claude、Cursor、Copilot など）向けの拡張スキルパックです。インストール後、AI は関連タスクでこれらのルールを自動的に適用し、まるで Vercel エンジニアの脳を持っているかのように動作します。
:::

## このアプローチを使うタイミング

React ベストプラクティススキルを使用する典型的なシナリオ：

- ❌ **非推奨**：単純な静的ページ、複雑なインタラクションのないコンポーネント
- ✅ **推奨**：
  - 新しい React コンポーネントまたは Next.js ページを作成する場合
  - クライアントサイドまたはサーバーサイドのデータフェッチを実装する場合
  - コードレビューまたは既存コードのリファクタリングを行う場合
  - バンドルサイズまたは読み込み時間を最適化する場合
  - ユーザーからページのカクつきに関するフィードバックがある場合

## 🎒 開始前の準備

::: warning 事前確認
開始前に、以下を確認してください：
1. Agent Skills をインストール済み（[インストールガイド](../../start/installation/) を参照）
2. React と Next.js の基礎知識がある
3. 最適化が必要な React/Next.js プロジェクトがある
:::

## コアコンセプト

React パフォーマンス最適化は単にいくつかの Hook を使うことではなく、**アーキテクチャレベル**で問題を解決することです。Vercel の 57 のルールは優先度に基づいて 8 つのカテゴリに分類されます：

| 優先度          | カテゴリ            | フォーカス               | 典型的な効果         |
|--- | --- | --- | ---|
| **CRITICAL**    | ウォーターフォール解消 | 連続的な async 操作を回避 | 2-10× の向上       |
| **CRITICAL**    | バンドル最適化        | 初期バンドルサイズを削減 | TTI/LCP の大幅改善 |
| **HIGH**        | サーバーサイドパフォーマンス | データフェッチとキャッシュを最適化 | サーバー負荷の軽減 |
| **MEDIUM-HIGH** | クライアントサイドデータフェッチ | 重複リクエストを回避 | ネットワークトラフィックの削減 |
| **MEDIUM**      | 再レンダリング最適化 | 不要な再レンダリングを削減 | インタラクション応答速度の向上 |
| **MEDIUM**      | レンダリングパフォーマンス | CSS と JS の実行を最適化 | フレームレートの向上 |
| **LOW-MEDIUM**  | JavaScript パフォーマンス | コード実行のマイクロ最適化 | 5-20% の向上       |
| **LOW**         | 高度なパターン        | 特殊シナリオの最適化       | エッジケース       |

**コア原則**：
1. **CRITICAL と HIGH レベルの問題を優先的に解決**——これらの変更は最大の効果をもたらします
2. **データフローから始める**——まず非同期操作とデータフェッチを最適化
3. **その後にレンダリングを最適化**——最後に `useMemo`、`useCallback` などを検討

## 実践チュートリアル

### ステップ 1：AI パフォーマンスレビューをトリガー

React/Next.js プロジェクトを開き、Claude または Cursor で以下を入力：

```
Review this React component for performance issues
```

または

```
Apply React best practices to optimize this code
```

**期待される動作**：AI が `vercel-react-best-practices` スキルをアクティブにし、ルールを適用してコードチェックを開始します。

### ステップ 2：AI による問題の自動検出

AI がコードを 1 行ずつチェックし、問題が見つかると修正提案を提供します。例：

```typescript
// ❌ 元のコード（問題あり）
async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <div>...</div>
}
```

**AI のフィードバック**：
```
⚠️ async-parallel: 3 つの独立したリクエストが連続的に実行され、ウォーターフォールが発生
影響：CRITICAL（2-10× 向上）

提案：
Promise.all() を使用して独立したリクエストを並列実行し、3 回のネットワーク往復を 1 回に削減します。
```

**AI が提供する最適化コード**：
```typescript
// ✅ 最適化後（並列フェッチ）
async function UserProfile({ userId }: { userId: string }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId),
  ])

  return <div>...</div>
}
```

### ステップ 3：一般的な問題の例

いくつかの典型的なパフォーマンス問題と修正ソリューションを紹介します：

#### 問題 1：大きなコンポーネントによる初期バンドルの肥大化

```typescript
// ❌ 誤り：Monaco エディタがメインバンドルと共に読み込まれる（~300KB）
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

```typescript
// ✅ 正解：動的インポート、オンデマンドロード
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**ルール**：`bundle-dynamic-imports`（CRITICAL）

#### 問題 2：不要な再レンダリング

```typescript
// ❌ 誤り：親コンポーネントの更新ごとに ExpensiveList が再レンダリングされる
function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

```typescript
// ✅ 正解：React.memo でラップして不要な再レンダリングを回避
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  // ...
})

function Parent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveList items={largeArray} />
    </div>
  )
}
```

**ルール**：`rerender-memo`（MEDIUM）

#### 問題 3：Effect で派生状態を作成

```typescript
// ❌ 誤り：不要な Effect と追加の再レンダリング
function Component({ items }: { items: Item[] }) {
  const [filteredItems, setFilteredItems] = useState<Item[]>([])

  useEffect(() => {
    setFilteredItems(items.filter(item => item.isActive))
  }, [items])

  return <div>{filteredItems.map(...)}</div>
}
```

```typescript
// ✅ 正解：レンダリング時に派生状態を計算、Effect 不要
function Component({ items }: { items: Item[] }) {
  const filteredItems = items.filter(item => item.isActive)

  return <div>{filteredItems.map(...)}</div>
}
```

**ルール**：`rerender-derived-state-no-effect`（MEDIUM）

### ステップ 4：サーバーサイドパフォーマンス最適化（Next.js 固有）

Next.js を使用している場合、AI はサーバーサイドパフォーマンスもチェックします：

```typescript
// ❌ 誤り：複数の独立した fetch が連続的に実行される
async function Dashboard() {
  const user = await fetchUser()
  const stats = await fetchStats()
  const notifications = await fetchNotifications()

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

```typescript
// ✅ 正解：すべてのデータを並列フェッチ
async function Dashboard() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
  ])

  return <DashboardLayout user={user} stats={stats} notifications={notifications} />
}
```

**ルール**：`server-parallel-fetching`（**CRITICAL**）

### ステップ 5：React.cache による重複計算のキャッシュ

```typescript
// ❌ 誤り：レンダリングごとに再計算
async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchUser(userId)

  const posts = await fetchUserPosts(userId)
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

```typescript
// ✅ 正解：React.cache でキャッシュ、同一リクエストは一度のみ実行
const fetchCachedUser = React.cache(async (userId: string) => {
  return await fetchUser(userId)
})

async function UserProfile({ userId }: { userId: string }) {
  const userData = await fetchCachedUser(userId)

  const posts = await fetchUserPosts(userId)  // userData を再利用可能
  const comments = await fetchUserComments(userId)

  return <Dashboard userData={userData} posts={posts} comments={comments} />
}
```

**ルール**：`server-cache-react`（**MEDIUM**）

## チェックポイント ✅

上記の手順を完了した後、以下を理解しているか確認してください：

- [ ] AI による React パフォーマンスレビューをトリガーする方法を知っている
- [ ] 「ウォーターフォールの解消」の重要性を理解している（CRITICAL レベル）
- [ ] いつ `Promise.all()` を使用して並列リクエストを行うべきか知っている
- [ ] 動的インポート（`next/dynamic`）の役割を理解している
- [ ] 不要な再レンダリングを減らす方法を知っている
- [ ] サーバーサイドにおける React.cache の役割を理解している
- [ ] コード内のパフォーマンス問題を特定できる

## よくある落とし穴

### 落とし穴 1：過度な最適化

::: warning 過度な最適化を避ける
実際にパフォーマンス問題が存在する場合にのみ最適化を行ってください。早すぎる `useMemo`、`useCallback` の使用はコードを読みにくくし、悪影響をもたらす可能性があります。

**覚えておくこと**：
- まず React DevTools Profiler で計測
- CRITICAL と HIGH レベルの問題を優先
- `useMemo` は「レンダリング時の計算コストが高い」場合にのみ使用
:::

### 落とし穴 2：サーバーサイドパフォーマンスの無視

::: tip Next.js の特殊性
Next.js には多くのサーバーサイド最適化テクニック（React.cache、parallel fetching、after()）があり、これらはクライアントサイド最適化より大きな効果をもたらします。

**優先順位**：サーバーサイド最適化 > クライアントサイド最適化 > マイクロ最適化
:::

### 落とし穴 3：すべてのコンポーネントに `React.memo` を追加

::: danger React.memo は万能薬ではない
`React.memo` は「prop は変わらないが親コンポーネントが頻繁に更新される」場合にのみ有効です。

**誤った使い方**：
- 単純なコンポーネント（レンダリング時間 < 1ms）
- props が頻繁に変更されるコンポーネント
- 本質的に親コンポーネントの更新に応答する必要があるコンポーネント
:::

### 落とし穴 4：`useEffect` に依存した派生状態

派生状態（derived state）はレンダリング時に計算すべきであり、`useEffect` + `setState` を使用すべきではありません。

```typescript
// ❌ 誤り：Effect による派生状態（追加の再レンダリング）
useEffect(() => {
  setFiltered(items.filter(...))
}, [items])

// ✅ 正解：レンダリング時の計算（追加オーバーヘッドなし）
const filtered = items.filter(...)
```

## まとめ

React パフォーマンス最適化の重要な原則：

1. **ウォーターフォールの解消**：独立した操作は `Promise.all()` で並列実行
2. **バンドルサイズの削減**：大きなコンポーネントは `next/dynamic` で動的インポート
3. **再レンダリングの削減**：純粋なコンポーネントは `React.memo` でラップ、不要な Effect を回避
4. **サーバーサイド最適化の優先**：Next.js の `React.cache` と並列フェッチが最大の効果
5. **AI による自動化レビュー**：Agent Skills で問題の発見と修正を自動化

Vercel の 57 のルールはアーキテクチャからマイクロ最適化までのすべてのシナリオを網羅しており、AI にこれらのルールを適用させる方法を習得すれば、コード品質は大幅に向上します。

## 次のレッスンの予告

次は、**[Web インターフェースデザインガイドライン監査](../web-design-guidelines/)** を学びます。

以下を学びます：
- 100 以上のルールを使用してアクセシビリティ（a11y）を監査する方法
- アニメーションパフォーマンスと Focus States のチェック
- フォーム検証とダークモード対応の監査

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能                   | ファイルパス                                                                                                                                                 | 行番号 |
|--- | --- | ---|
| React ベストプラクティススキル定義 | [`skills/react-best-practices/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md)                     | 全文 |
| 完全なルールドキュメント       | [`skills/react-best-practices/AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md)                   | 全文 |
| 57 ルールファイル          | [`skills/react-best-practices/rules/*.md`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices/rules)                      | -    |
| ルールテンプレート           | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | 全文 |
| メタデータ                 | [`skills/react-best-practices/metadata.json`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/metadata.json)           | 全文 |
| README 概要            | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md)                                                                           | 9-27 |

**重要ファイル（CRITICAL レベルルールの例）**：

| ルール                   | ファイルパス                                                                                                                                         | 説明             |
|--- | --- | ---|
| Promise.all() 並列リクエスト | [`async-parallel.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-parallel.md)                 | ウォーターフォールの解消       |
| 大きなコンポーネントの動的インポート         | [`bundle-dynamic-imports.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/bundle-dynamic-imports.md) | バンドルサイズの削減 |
| Defer await            | [`async-defer-await.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/async-defer-await.md)           | 非同期操作の遅延実行 |

**重要な定数**：
- `version = "1.0.0"`：ルールライブラリのバージョン番号（metadata.json）
- `organization = "Vercel Engineering"`：メンテナンス組織

**8 つのルールカテゴリ**：
- `async-`（ウォーターフォールの解消、5 ルール、CRITICAL）
- `bundle-`（バンドル最適化、5 ルール、CRITICAL）
- `server-`（サーバーサイドパフォーマンス、7 ルール、HIGH）
- `client-`（クライアントサイドデータフェッチ、4 ルール、MEDIUM-HIGH）
- `rerender-`（再レンダリング最適化、12 ルール、MEDIUM）
- `rendering-`（レンダリングパフォーマンス、9 ルール、MEDIUM）
- `js-`（JavaScript パフォーマンス、12 ルール、LOW-MEDIUM）
- `advanced-`（高度なパターン、3 ルール、LOW）

</details>
