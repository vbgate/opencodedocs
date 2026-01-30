---
title: "Web デザインガイドライン監査：100 の UI ベストプラクティスを適用 | Agent Skills"
sidebarTitle: "100 のルールで UI をチェック"
subtitle: "Web インターフェースデザインガイドライン監査"
description: "Web デザインガイドライン監査でアクセシビリティ、パフォーマンス、UX を学習。100 のルールで aria-labels、フォーム検証、アニメーション、ダークモードをチェックし、UI の品質を向上させます。"
tags:
  - "アクセシビリティ"
  - "UX"
  - "コードレビュー"
  - "Web デザイン"
order: 40
prerequisite:
  - "start-getting-started"
---

# Web インターフェースデザインガイドライン監査

## 学習後にできること

- 🎯 AI に UI コードを自動監査させ、アクセシビリティ、パフォーマンス、UX の問題を発見
- ♿ Web Accessibility (WCAG) のベストプラクティスを適用し、Web サイトのアクセシビリティを向上
- ⚡ アニメーションのパフォーマンスと画像読み込みを最適化し、ユーザー体験を向上
- 🎨 ダークモードとレスポンシブデザインが正しく実装されていることを確認
- 🔍 一般的な UI アンチパターンを修正（`transition: all`、aria-label の欠如など）

## 現在の課題

UI コンポーネントを作成しましたが、どこか違和感があります：

- Web サイトは機能テストに合格しましたが、アクセシビリティ基準を満たしているか不明
- アニメーションパフォーマンスが悪く、ユーザーからページがカクつくとフィードバック
- ダークモードで一部の要素が見えない
- AI が生成したコードは動作するが、必要な aria-labels やセマンティック HTML が欠けている
- 毎回コードレビューで 17 カテゴリのルールを手動チェックする効率の悪さ
- `prefers-reduced-motion`、`tabular-nums` などの CSS プロパティをいつ使うかわからない

実は、Vercel エンジニアリングチームは **100 の** Web インターフェースデザインガイドラインをまとめており、アクセシビリティからパフォーマンス最適化まであらゆるシーンをカバーしています。現在、これらのルールは Agent Skills にパッケージ化されており、AI が自動的に UI 問題の監査と修正をサポートします。

::: info "Web Interface Guidelines"とは
Web Interface Guidelines は Vercel の UI 品質基準のコレクションで、17 カテゴリの 100 のルールが含まれています。これらのルールは WCAG アクセシビリティ基準、パフォーマンスのベストプラクティス、UX デザイン原則に基づいており、Web アプリケーションの品質がプロダクションレベルに達することを保証します。
:::

## このスキルを使うタイミング

Web デザインガイドラインスキルを使用する典型的なシーン：

- ❌ **非適用**：純粋なバックエンドロジック、単純なプロトタイプページ（ユーザーインタラクションを含まない）
- ✅ **適用**：
  - 新しい UI コンポーネント（ボタン、フォーム、カードなど）を作成
  - インタラクティブ機能（モーダル、ドロップダウン、ドラッグ＆ドロップなど）を実装
  - コードレビューまたは UI コンポーネントのリファクタリング
  - 本番前の UI 品質チェック
  - ユーザーからのアクセシビリティまたはパフォーマンス問題のフィードバックを修正

## 🎒 開始前の準備

::: warning 前提条件チェック
開始前に、以下を確認してください：
1. Agent Skills をインストール済み（[インストールガイド](../../start/installation/)を参照）
2. HTML/CSS/React の基本知識がある
3. 監査が必要な UI プロジェクトがある（単一コンポーネントまたはページ全体）
:::

## コアコンセプト

Web インターフェースデザインガイドラインは **17 カテゴリ**をカバーし、優先度に基づいて 3 つのブロックに分類されています：

| カテゴリブロック                 | フォーカス                                       | 典型的なメリット                   |
|--- | --- | ---|
| **アクセシビリティ (Accessibility)** | すべてのユーザーが使用できるように（スクリーンリーダー、キーボードユーザー含む） | WCAG 基準に準拠、ユーザー層の拡大 |
| **パフォーマンス & UX (Performance & UX)** | 読み込み速度、アニメーションの滑らかさ、インタラクティブ体験を最適化 | ユーザー維持率の向上、直帰率の低下 |
| **完全性 & 細部 (Completeness)** | ダークモード、レスポンシブ、フォーム検証、エラー処理 | ユーザー苦情の削減、ブランドイメージの向上 |

**17 のルールカテゴリ**：

| カテゴリ                   | 典型的なルール                              | 優先度   |
|--- | --- | ---|
| Accessibility              | aria-labels、セマンティック HTML、キーボード処理 | ⭐⭐⭐ 最高 |
| Focus States               | 可視フォーカス、:focus-visible で :focus を置換    | ⭐⭐⭐ 最高 |
| Forms                      | autocomplete、検証、エラー処理               | ⭐⭐⭐ 最高 |
| Animation                  | prefers-reduced-motion、transform/opacity  | ⭐⭐ 高    |
| Typography                 | curly quotes、ellipsis、tabular-nums        | ⭐⭐ 高    |
| Content Handling           | テキスト切り捨て、空状態の処理                 | ⭐⭐ 高    |
| Images                     | dimensions、lazy loading、alt text          | ⭐⭐ 高    |
| Performance                | virtualization、事前接続、DOM 操作のバッチ処理 | ⭐⭐ 高    |
| Navigation & State         | URL が状態を反映、ディープリンク             | ⭐⭐ 高    |
| Touch & Interaction        | touch-action、tap-highlight                  | ⭐ 中     |
| Safe Areas & Layout        | セーフエリア、スクロールバー処理            | ⭐ 中     |
| Dark Mode & Theming        | color-scheme、theme-color meta               | ⭐ 中     |
| Locale & i18n              | Intl.DateTimeFormat、Intl.NumberFormat     | ⭐ 中     |
| Hydration Safety           | value + onChange、セル不一致の防止          | ⭐ 中     |
| Hover & Interactive States | hover 状態、コントラストの向上              | ⭐ 中     |
| Content & Copy             | 能動態、特定のボタンラベル                  | ⭐ 低     |
| Anti-patterns              | 一般的なエラーパターンをフラグ               | ⭐⭐⭐ 最高 |

**コア原則**：
1. **アクセシビリティの問題を優先的に修正**——障害を持つユーザーの使用に影響する
2. **パフォーマンス問題はアニメーションと画像から着手**——これらは直接ユーザー体験に影響する
3. **完全性の問題は最後にチェック**——ダークモード、国際化などの細部

## 実践しよう

### ステップ 1：AI UI 監査をトリガー

UI プロジェクトを開き（単一コンポーネントファイルまたはディレクトリ全体）、Claude または Cursor で以下を入力：

```
Review my UI components for accessibility and UX issues
```

または

```
Check accessibility of my site
```

または

```
Audit design and apply Web Interface Guidelines
```

**期待される動作**：AI が `web-design-guidelines` スキルをアクティブにし、GitHub から最新の 100 ルールをプルします。

### ステップ 2：監査対象ファイルを指定（AI が自動検出しない場合）

AI がどのファイルを監査するか尋ねる場合：

```bash
# 単一ファイルを監査
src/components/Button.tsx

# 複数ファイルを監査（スペース区切り）
src/components/Button.tsx src/components/Input.tsx

# ディレクトリ全体を監査（glob パターン）
src/components/**/*.tsx
```

### ステップ 3：AI が問題を自動検出

AI がコードをルールごとにチェックし、問題を見つけると `file:line` 形式で監査結果を出力します。例：

```typescript
// ❌ 元のコード（問題あり）
export function Button({ icon, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded hover:bg-gray-100 transition-all"
    >
      {icon}
    </button>
  )
}
```

**AI の監査結果**：

```
## src/components/Button.tsx

src/components/Button.tsx:8 - icon button missing aria-label
src/components/Button.tsx:8 - animation missing prefers-reduced-motion
src/components/Button.tsx:8 - transition: all → list properties explicitly
src/components/Button.tsx:8 - button needs visible focus
```

**AI による修正コード**：

```typescript
// ✅ 修正後
export function Button({ icon, onClick, ariaLabel }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="p-2 rounded hover:bg-gray-100 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500
                motion-safe:hover:scale-105 active:scale-100
                motion-reduce:transition-none motion-reduce:transform-none"
    >
      {icon}
    </button>
  )
}
```

### ステップ 4：一般的な問題の例

#### 問題 1：フォーム入力に label と autocomplete が欠如

```typescript
// ❌ エラー：label と autocomplete が欠如
<input
  type="text"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

```typescript
// ✅ 正しい：label、name、autocomplete を含む
<label htmlFor="email" className="sr-only">
  Email address
</label>
<input
  id="email"
  type="email"
  name="email"
  autoComplete="email"
  placeholder="your@email.com…"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**ルール**：
- `Form Controls need <label> or aria-label`
- `Inputs need autocomplete and meaningful name`
- `Use correct type (email, tel, url, number) and inputmode`

#### 問題 2：アニメーションが `prefers-reduced-motion` を考慮していない

```css
/* ❌ エラー：すべてのユーザーがアニメーションを見る、前庭障害を持つユーザーに不親切 */
.modal {
  transition: all 0.3s ease-in-out;
}
```

```css
/* ✅ 正しい：ユーザーのアニメーション低減設定を尊重 */
.modal {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .modal {
    transition: none;
  }
}
```

**ルール**：
- `Honor prefers-reduced-motion (provide reduced variant or disable)`
- `Never transition: all—list properties explicitly`

#### 問題 3：画像に dimensions と lazy loading が欠如

```typescript
// ❌ エラー：Cumulative Layout Shift (CLS) を引き起こす
<img src="/hero.jpg" alt="Hero image" />
```

```typescript
// ✅ 正しい：事前にスペースを確保し、レイアウトシフトを防止
<img
  src="/hero.jpg"
  alt="Hero: team working together"
  width={1920}
  height={1080}
  loading="lazy"
  fetchpriority="high"  // ファーストビューのコア画像の場合
/>
```

**ルール**：
- `<img> needs explicit width and height (prevents CLS)`
- `Below-fold images: loading="lazy"`
- `Above-fold critical images: priority or fetchpriority="high"`

#### 問題 4：ダークモードで `color-scheme` が未設定

```html
<!-- ❌ エラー：ダークモードでもネイティブコントロール（select、input など）が白背景のまま -->
<html>
  <body>
    <select>...</select>
  </body>
</html>
```

```html
<!-- ✅ 正しい：ネイティブコントロールがダークテーマに自動適応 -->
<html class="dark">
  <head>
    <meta name="theme-color" content="#0f172a" />
  </head>
  <body style="color-scheme: dark">
    <select style="background-color: #1e293b; color: #e2e8f0">
      ...
    </select>
  </body>
</html>
```

**ルール**：
- `color-scheme: dark on <html> for dark themes (fixes scrollbar, inputs)`
- `<meta name="theme-color"> matches page background`
- `Native <select>: explicit background-color and color (Windows dark mode)`

#### 問題 5：キーボードナビゲーションサポートが不完全

```typescript
// ❌ エラー：マウスのみでクリック可能、キーボードユーザーが使用不可
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

```typescript
// ✅ 正しい：キーボードナビゲーションをサポート（Enter/Space でトリガー）
<button
  onClick={handleClick}
  className="cursor-pointer"
  // 自動でキーボードをサポート、追加コード不要
>
  Click me
</button>

// または div を使用する場合、キーボードサポートを追加：
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }}
  onClick={handleClick}
  className="cursor-pointer"
>
  Click me
</div>
```

**ルール**：
- `Interactive elements need keyboard handlers (onKeyDown/onKeyUp)`
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- `Icon-only buttons need aria-label`

#### 問題 6：長いリストが仮想化されていない

```typescript
// ❌ エラー：1000 項目をレンダリングし、ページがカクつく
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

```typescript
// ✅ 正しい：仮想スクロールを使用し、表示項目のみをレンダリング
import { useVirtualizer } from '@tanstack/react-virtual'

function UserList({ users }: { users: User[] }) {
  const parentRef = useRef<HTMLUListElement>(null)

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,  // 各項目の高さ
    overscan: 5,  // 空白を防ぐために事前にレンダリングする項目数
  })

  return (
    <ul ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {users[virtualItem.index].name}
          </div>
        ))}
      </div>
    </ul>
  )
}
```

**ルール**：
- `Large lists (>50 items): virtualize (virtua, content-visibility: auto)`

#### 問題 7：数値列で `tabular-nums` を使用していない

```css
/* ❌ エラー：数字の幅が固定でなく、整列がずれる */
.table-cell {
  font-family: system-ui;
}
```

```css
/* ✅ 正しい：数字が等幅で、整列が安定 */
.table-cell.number {
  font-variant-numeric: tabular-nums;
}
```

**ルール**：
- `font-variant-numeric: tabular-nums for number columns/comparisons`

### ステップ 5：一般的なアンチパターンを修正

AI はこれらのアンチパターンを自動的にフラグします：

```typescript
// ❌ アンチパターン集
const BadComponent = () => (
  <div>
    {/* アンチパターン 1: transition: all */}
    <div className="transition-all hover:scale-105">...</div>

    {/* アンチパターン 2: アイコンボタンに aria-label が欠如 */}
    <button onClick={handleClose}>✕</button>

    {/* アンチパターン 3: 貼り付けを禁止 */}
    <Input onPaste={(e) => e.preventDefault()} />

    {/* アンチパターン 4: outline-none にフォーカスの代替なし */}
    <button className="focus:outline-none">...</button>

    {/* アンチパターン 5: 画像に dimensions が欠如 */}
    <img src="/logo.png" alt="Logo" />

    {/* アンチパターン 6: button ではなく div を使用 */}
    <div onClick={handleClick}>Submit</div>

    {/* アンチパターン 7: 日付フォーマットをハードコード */}
    <Text>{formatDate(new Date(), 'MM/DD/YYYY')}</Text>

    {/* アンチパターン 8: モバイルで autofocus */}
    <input autoFocus />

    {/* アンチパターン 9: user-scalable=no */}
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />

    {/* アンチパターン 10: 大きなリストを仮想化していない */}
    {largeList.map((item) => (<Item key={item.id} {...item} />))}
  </div>
)
```

```typescript
// ✅ 修正後
const GoodComponent = () => (
  <div>
    {/* 修正 1: 遷移プロパティを明示的にリスト */}
    <div className="transition-transform hover:scale-105">...</div>

    {/* 修正 2: アイコンボタンに aria-label を含む */}
    <button onClick={handleClose} aria-label="Close dialog">✕</button>

    {/* 修正 3: 貼り付けを許可 */}
    <Input />

    {/* 修正 4: focus-visible リングを使用 */}
    <button className="focus:outline-none focus-visible:ring-2">...</button>

    {/* 修正 5: 画像に dimensions を含む */}
    <img src="/logo.png" alt="Logo" width={120} height={40} />

    {/* 修正 6: セマンティック button を使用 */}
    <button onClick={handleClick}>Submit</button>

    {/* 修正 7: Intl でフォーマット */}
    <Text>{new Intl.DateTimeFormat('en-US').format(new Date())}</Text>

    {/* 修正 8: autoFocus はデスクトップのみ */}
    <input autoFocus={isDesktop} />

    {/* 修正 9: 拡大を許可 */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* 修正 10: 仮想化 */}
    <VirtualList items={largeList}>{(item) => <Item {...item} />}</VirtualList>
  </div>
)
```

## チェックポイント ✅

上記のステップを完了した後、以下の内容をマスターしたか確認してください：

- [ ] AI で Web デザインガイドライン監査をトリガーする方法を知っている
- [ ] アクセシビリティ（Accessibility）の重要性を理解している（Accessibility は最高優先度）
- [ ] aria-label とセマンティック HTML を追加する方法を知っている
- [ ] `prefers-reduced-motion` の役割を理解している
- [ ] 画像読み込みを最適化する方法を知っている（dimensions、lazy loading）
- [ ] ダークモードの正しい実装を理解している（`color-scheme`）
- [ ] コード内の一般的な UI アンチパターンを識別できる

## 落とし穴の注意

### 落とし穴 1：視覚のみに集中し、アクセシビリティを無視

::: warning アクセシビリティはオプションではない
アクセシビリティは法的要件（ADA、WCAG など）であり、社会的責任でもあります。

**一般的な見落とし**：
- アイコンボタンに `aria-label` が欠如
- カスタムコントロール（ドロップダウンなど）がキーボードをサポートしていない
- フォーム入力に `<label>` が欠如
- 非同期更新（Toast など）に `aria-live="polite"` が欠如
:::

### 落とし穴 2：`transition: all` の過度な使用

::: danger パフォーマンスキラー
`transition: all` はすべての CSS プロパティの変化を監視し、ブラウザが大量の値を再計算する原因になります。

**誤った使い方**：
```css
.card {
  transition: all 0.3s ease;  // ❌ background、color、transform、padding、margin などが遷移
}
```

**正しい使い方**：
```css
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;  // ✅ 必要なプロパティのみ遷移
}
```
:::

### 落とし穴 3：`outline` の代替を忘れる

::: focus-visible はあってもなくてもよいものではない
デフォルトの `outline` を削除した後、可視のフォーカススタイルを提供する必要があります。そうしないと、キーボードユーザーがフォーカスの位置を認識できません。

**誤ったやり方**：
```css
button {
  outline: none;  // ❌ フォーカスを完全に削除
}
```

**正しいやり方**：
```css
button {
  outline: none;  /* デフォルトの醜い輪郭を削除 */
}

button:focus-visible {
  ring: 2px solid blue;  /* ✅ カスタムフォーカススタイルを追加（キーボードナビゲーション時のみ） */
}

button:focus {
  /* マウスクリック時には表示されない（focus-visible = false なので） */
}
```
:::

### 落とし穴 4：画像に `alt` または `dimensions` が欠如

::: CLS は Core Web Vitals の 1 つ
`width` と `height` が欠如すると、ページ読み込み時にレイアウトシフトが発生し、ユーザー体験と SEO に影響します。

**覚えておくこと**：
- 装飾用画像には `alt=""`（空文字列）を使用
- 情報提供用画像には説明的な `alt`（例："Team photo: Alice and Bob"）を使用
- すべての画像に `width` と `height` を含める
:::

### 落とし穴 5：国際化（i18n）でフォーマットをハードコード

::: Intl API を使用
日付、数値、通貨フォーマットをハードコードせず、ブラウザの組み込み `Intl` API を使用してください。

**誤ったやり方**：
```typescript
const formattedDate = formatDate(date, 'MM/DD/YYYY')  // ❌ 米国形式、他国では混乱する
```

**正しいやり方**：
```typescript
const formattedDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
}).format(date)  // ✅ ユーザーのロケールを自動使用
```
:::

## 本レッスンのまとめ

Web インターフェースデザインガイドラインのコア原則：

1. **アクセシビリティ優先**：すべてのユーザーが使用できるように（キーボード、スクリーンリーダー）
2. **パフォーマンス最適化**：アニメーションは `transform/opacity`、画像は lazy load、長いリストは仮想化
3. **ユーザー設定を尊重**：`prefers-reduced-motion`、`color-scheme`、拡大許可
4. **セマンティック HTML**：`<button>`、`<label>`、`<input>` を使用し、`<div>` は避ける
5. **完全性チェック**：ダークモード、国際化、フォーム検証、エラー処理
6. **AI で自動監査**：Agent Skills に 100 ルールの発見と修正をさせる

Vercel の 100 ルールは基本から細部まであらゆるシーンをカバーしています。AI にこれらのルールを適用させる方法を学べば、UI 品質はプロダクションレベルに到達します。

## 次回の予告

次は **[Vercel ワンクリックデプロイ](../vercel-deploy/)** を学びます。

学習内容：
- プロジェクトを Vercel にワンクリックでデプロイする方法（40 以上のフレームワーク対応）
- フレームワークタイプを自動検出（Next.js、Vue、Svelte など）
- プレビューリンクと所有権移転リンクを取得

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-25

| 機能                     | ファイルパス                                                                                                                                                                           | 行号  |
|--- | --- | ---|
| Web デザインガイドラインスキル定義 | [`skills/web-design-guidelines/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md)                                             | 全文  |
| ルールソース（100 ルール）     | [`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) | 全文  |
| README 概要          | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md)                                                                                                     | 28-50 |

**17 のルールカテゴリ**：

| カテゴリ                   | ルール数 | 典型的なルール                              |
|--- | --- | ---|
| Accessibility              | 10 ルール | aria-labels、セマンティック HTML、キーボード処理 |
| Focus States               | 4 ルール | 可視フォーカス、:focus-visible                  |
| Forms                      | 11 ルール | autocomplete、検証、エラー処理               |
| Animation                  | 6 ルール | prefers-reduced-motion、transform/opacity  |
| Typography                 | 6 ルール | curly quotes、ellipsis、tabular-nums        |
| Content Handling           | 4 ルール | テキスト切り捨て、空状態の処理                 |
| Images                     | 3 ルール | dimensions、lazy loading、alt text          |
| Performance                | 6 ルール | virtualization、事前接続、バッチ処理            |
| Navigation & State         | 4 ルール | URL が状態を反映、ディープリンク             |
| Touch & Interaction        | 5 ルール | touch-action、tap-highlight                  |
| Safe Areas & Layout        | 3 ルール | セーフエリア、スクロールバー処理            |
| Dark Mode & Theming        | 3 ルール | color-scheme、theme-color                 |
| Locale & i18n              | 3 ルール | Intl.DateTimeFormat、Intl.NumberFormat     |
| Hydration Safety           | 3 ルール | value + onChange、セル不一致の防止          |
| Hover & Interactive States | 2 ルール | hover 状態、コントラスト                    |
| Content & Copy             | 7 ルール | 能動態、特定のボタンラベル                  |
| Anti-patterns              | 20 ルール | 一般的なエラーパターンをフラグ               |

**重要な定数**：
- `RULE_SOURCE_URL = "https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md"`：ルールプル元
- `version = "1.0.0"`：スキルバージョン（SKILL.md）

**ワークフロー**：
1. `SKILL.md:23-27`：GitHub から最新ルールをプル
2. `SKILL.md:31-38`：ユーザーファイルを読み込み、すべてのルールを適用
3. `SKILL.md:39`：ファイルが指定されていない場合、ユーザーに問い合わせ

**トリガーキーワード**：
- "Review my UI"
- "Check accessibility"
- "Audit design"
- "Review UX"
- "Check my site against best practices"

</details>
