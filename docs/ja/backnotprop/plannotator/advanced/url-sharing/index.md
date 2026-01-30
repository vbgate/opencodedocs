---
title: "URL共有: バックエンド不要のコラボレーション | Plannotator"
sidebarTitle: "チームと共有する"
subtitle: "URL共有: バックエンド不要のコラボレーション"
description: "PlannotatorのURL共有機能を学びます。deflate圧縮とBase64エンコードによるバックエンド不要のコラボレーション、環境変数の設定、共有時のよくある問題の解決方法を習得します。"
tags:
  - "URL共有"
  - "チームコラボレーション"
  - "バックエンド不要"
  - "deflate圧縮"
  - "Base64エンコード"
  - "セキュリティ"
prerequisite:
  - "start-getting-started"
  - "platforms-plan-review-basics"
order: 1
---

# URL共有：バックエンド不要のプランコラボレーション

## この章で学べること

- ✅ URLでプランとアノテーションを共有し、アカウントログインやサーバー不要でコラボレーション
- ✅ deflate圧縮とBase64エンコードがデータをURLハッシュに埋め込む仕組みを理解
- ✅ 共有モード（読み取り専用）とローカルモード（編集可能）を区別
- ✅ `PLANNOTATOR_SHARE`環境変数で共有機能を制御
- ✅ URL長さの制限と共有失敗の対処

## 現在の課題

**課題1**：チームメンバーにAIが生成したプランのレビューを依頼したいが、コラボレーションプラットフォームがない。

**課題2**：スクリーンショットやテキストコピーでレビュー内容を共有しても、相手があなたのアノテーションを直接見られない。

**課題3**：オンラインコラボレーションサーバーを展開するコストが高い、または企業セキュリティポリシーで許可されない。

**課題4**：シンプルで迅速な共有方法が必要だが、データプライバシーを確保する方法がわからない。

**Plannotatorでできること**：
- バックエンドサーバー不要、すべてのデータをURLに圧縮
- 共有リンクに完全なプランとアノテーションが含まれ、受信者が閲覧可能
- データはローカルデバイスから出ないためプライバシー安全
- 生成されたURLは任意のコミュニケーションツールにコピー可能

## こんなときに使う

**適した使用シナリオ**：
- チームメンバーにAIが生成した実装プランのレビューを依頼する場合
- コードレビューの結果を同僚と共有したい場合
- レビュー内容をノートに保存したい場合（Obsidian/Bear統合と組み合わせ）
- 他者からプランへのフィードバックを迅速に得たい場合

**適さないシナリオ**：
- リアルタイムのコラボレーション編集が必要な場合（Plannotatorの共有は読み取り専用）
- プラン内容がURL長さの制限を超える場合（通常数千行）
- 共有内容に機密情報が含まれる場合（URL自体は暗号化されない）

::: warning セキュリティ注意
共有URLには完全なプランとアノテーションが含まれるため、APIキーやパスワードなどの機密情報を含む内容は共有しないでください。共有URLは誰でもアクセス可能で、自動的に期限切れになりません。
:::
## コアコンセプト

### URL共有とは

**URL共有**はPlannotatorが提供するバックエンド不要のコラボレーション方式で、プランとアノテーションをURLハッシュに圧縮して埋め込み、サーバーなしで共有機能を実現します。

::: info なぜ「バックエンド不要」なのか？
従来のコラボレーション方式は、プランとアノテーションを保存するバックエンドサーバーが必要で、ユーザーはIDやtokenでアクセスします。PlannotatorのURL共有はどのようなバックエンドにも依存しません——すべてのデータがURLに含まれ、受信者がリンクを開くだけで内容を解析できます。これによりプライバシー（データがアップロードされない）とシンプルさ（サーバーの展開不要）が保証されます。
:::

### 動作原理

```
┌─────────────────────────────────────────────────────────┐
│  ユーザーA（共有者）                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. プランをレビューし、アノテーションを追加             │
│     ┌──────────────────────┐                           │
│     │ Plan: 実施プラン       │                           │
│     │ Annotations: [       │                           │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│              │                                         │
│              ▼                                         │
│  2. Export → Shareをクリック                           │
│              │                                         │
│              ▼                                         │
│  3. データを圧縮                                       │
│     JSON → deflate → Base64 → URLセーフ文字          │
│     ↓                                                │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ URLをコピー
                          ▼
┌─────────────────────────────────────────────────────────┐
│  ユーザーB（受信者）                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. 共有URLを開く                                      │
│     https://share.plannotator.ai/#eJyrVkrLz1...       │
│              │                                         │
│              ▼                                         │
│  2. ブラウザがhashを解析                               │
│     URLセーフ文字 → Base64デコード → deflate解凍 → JSON│
│              │                                         │
│              ▼                                         │
│  3. プランとアノテーションを復元                       │
│     ┌──────────────────────┐                           │
│     │ Plan: 実施プラン       │  ✅ 読み取り専用モード    │
│     │ Annotations: [       │  （決定の送信不可）        │
│     │   {type: 'REPLACE'},│                           │
│     │   {type: 'COMMENT'}  │                           │
│     │ ]                   │                           │
│     └──────────────────────┘                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 圧縮アルゴリズムの詳細

**ステップ1：JSONシリアライズ**
```json
{
  "p": "# Plan\n\nStep 1...",
  "a": [
    ["R", "old text", "new text", null, null],
    ["C", "context", "comment text", null, null]
  ],
  "g": ["image1.png", "image2.png"]
}
```

**ステップ2：Deflate-raw圧縮**
- ネイティブ`CompressionStream('deflate-raw')` APIを使用
- 圧縮率はテキストの繰り返し度合いに依存し、典型的に60-80%（ソースコード定義ではない）
- ソースコードの場所：`packages/ui/utils/sharing.ts:34`

**ステップ3：Base64エンコード**
```typescript
const base64 = btoa(String.fromCharCode(...compressed));
```

**ステップ4：URLセーフ文字の置換**
```typescript
base64
  .replace(/\+/g, '-')   // + → -
  .replace(/\//g, '_')   // / → _
  .replace(/=/g, '');    // = → ''（パディング削除）
```

::: tip なぜ特殊文字を置換するのか？
URLには特殊な意味を持つ文字が含まれます（例：`+`は空白を表し、`/`はパスセパレータ）。Base64エンコード後にこれらの文字が含まれると、URL解析エラーが発生します。`-`と`_`に置換すると、URLが安全でコピー可能になります。
:::

### アノテーション形式の最適化

圧縮効率のため、Plannotatorは簡潔なアノテーション形式（`ShareableAnnotation`）を使用します：

| 元のAnnotation | 簡潔な形式 | 説明 |
|--- | --- | ---|
| `{type: 'DELETION', originalText: '...', text: undefined, ...}` | `['D', 'old text', null, images?]` | D = Deletion、nullはtextなし |
| `{type: 'REPLACEMENT', originalText: '...', text: 'new...', ...}` | `['R', 'old text', 'new text', null, images?]` | R = Replacement |
| `{type: 'COMMENT', originalText: '...', text: 'comment...', ...}` | `['C', 'old text', 'comment text', null, images?]` | C = Comment |
| `{type: 'INSERTION', originalText: '...', text: 'new...', ...}` | `['I', 'context', 'new text', null, images?]` | I = Insertion |
| `{type: 'GLOBAL_COMMENT', text: '...', ...}` | `['G', 'comment text', null, images?]` | G = Global comment |

フィールド順序は固定で、キー名を省略することでデータ量を大幅に削減します。ソースコードの場所：`packages/ui/utils/sharing.ts:76`

### 共有URLの構造

```
https://share.plannotator.ai/#<compressed_data>
                             ↑
                         hash部分
```

- **ベースドメイン**：`share.plannotator.ai`（独立した共有ページ）
- **ハッシュ区切り**：`#`（サーバーに送信されず、完全にフロントエンドで解析）
- **圧縮データ**：Base64urlエンコードされた圧縮JSON

## 🎒 始める前の準備

**前提条件**：
- ✅ [プランレビュー基礎](../../platforms/plan-review-basics/)を完了し、アノテーションの追加方法を理解している
- ✅ [プランアノテーションチュートリアル](../../platforms/plan-review-annotations/)を完了し、アノテーションタイプを理解している
- ✅ ブラウザが`CompressionStream` APIをサポートしている（すべてのモダンブラウザでサポート）

**共有機能が有効か確認**：
```bash
# デフォルトで有効
echo $PLANNOTATOR_SHARE

# 共有を無効にする必要がある場合（例：企業セキュリティポリシー）
export PLANNOTATOR_SHARE=disabled
```

::: info 環境変数の説明
`PLANNOTATOR_SHARE`は共有機能の有効状態を制御します：
- **未設定または"disabled"以外**：共有機能を有効化
- **"disabled"に設定**：共有を無効化（Export ModalにRaw Diffタブのみ表示）

ソースコードの場所：`apps/hook/server/index.ts:44`、`apps/opencode-plugin/index.ts:50`
:::

**ブラウザ互換性の確認**：
```bash
# ブラウザコンソールで実行
const stream = new CompressionStream('deflate-raw');
console.log('CompressionStream supported');
```

`CompressionStream supported`が出力されれば、ブラウザがサポートしています。モダンブラウザ（Chrome 80+、Firefox 113+、Safari 16.4+）はすべてサポートしています。

## ステップバイステップ

### ステップ1：プランレビューを完了

**なぜ**
共有前にレビューを完了する必要があり、アノテーションの追加も含まれます。

**操作**：
1. Claude CodeまたはOpenCodeでプランレビューをトリガー
2. プラン内容を確認し、修正が必要なテキストを選択
3. アノテーションを追加（削除、置換、コメントなど）
4. （オプション）画像アタッチメントをアップロード

**期待される結果**：
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                                              │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│                    └─────────────────────┘               │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [Approve] [Request Changes] [Export]                   │
└─────────────────────────────────────────────────────────────┘
```

### ステップ2：Export Modalを開く

**なぜ**
Export Modalは共有URLを生成するエントリポイントを提供します。

**操作**：
1. 右上の**Export**ボタンをクリック
2. Export Modalが開くのを待つ

**期待される結果**：
```
┌─────────────────────────────────────────────────────────────┐
│  Export                                     ×             │
│  1 annotation                          Share | Raw Diff   │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                              [Copy] │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                           │
│  This URL contains full plan and all annotations.          │
│  Anyone with this link can view and add to your annotations.│
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

::: tip URLサイズのヒント
右下にURLのバイト数が表示されます（例：3.2 KB）。URLが長すぎる場合（8 KBを超える）、アノテーションの数や画像アタッチメントを減らすことを検討してください。
:::
### ステップ3：共有URLをコピー

**なぜ**
URLをコピーした後、任意のコミュニケーションツール（Slack、Email、WeChatなど）に貼り付けられます。

**操作**：
1. **Copy**ボタンをクリック
2. ボタンが**Copied!**に変わるのを待つ
3. URLがクリップボードにコピーされた

**期待される結果**：
```
┌─────────────────────────────────────────────────────────────┐
│  Shareable URL                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ https://share.plannotator.ai/#eJyrVkrLz1...        │ │
│  │                                    ✓ Copied         │ │
│  │                                           3.2 KB    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

::: tip 自動選択
URL入力フィールドをクリックすると全内容が自動選択され、手動でコピーしやすくなります（Copyボタンを使用しない場合）。
:::

### ステップ4：コラボレーターとURLを共有

**なぜ**
コラボレーターがURLを開くと、プランとアノテーションを閲覧できます。

**操作**：
1. URLをコミュニケーションツール（Slack、Emailなど）に貼り付け
2. チームメンバーに送信

**メッセージ例**：
```
Hi @チーム、

この実装プランのレビューをお願いします：
https://share.plannotator.ai/#eJyrVkrLz1...

フェーズ2に「JWTは複雑すぎる」という置換アノテーションを追加しました。

フィードバックをお願いします、ありがとうございます！
```

### ステップ5：コラボレーターが共有URLを開く（受信者側）

**なぜ**
コラボレーターがブラウザでURLを開き、内容を閲覧する必要があります。

**操作**（コラボレーターが実行）：
1. 共有URLをクリック
2. ページが読み込まれるのを待つ

**期待される結果**（コラボレーターの視点）：
```
┌─────────────────────────────────────────────────────────────┐
│  Plan Review                               Read-only     │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│  # Implementation Plan                                    │
│                                                           │
│  ## Phase 1: Setup                                      │
│  Set up WebSocket server on port 8080                    │
│                                                           │
│  ## Phase 2: Authentication                             │
│  Implement JWT authentication middleware                   │
│                    ┌─────────────────────┐               │
│  ━━━━━━━━━━━━━━━━│ Replace: "implement" │               │
│  │                  └─────────────────────┘               │
│  │ This annotation was shared by [Your Name]             │
│                                                           │
│  Annotation Panel                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ REPLACE: "implement" → "add"                      │  │
│  │ JWT is overkill, use simple session tokens         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                           │
│  [View Only Mode - Approve and Deny disabled]            │
└─────────────────────────────────────────────────────────────┘
```

::: warning 読み取り専用モード
共有URLを開くと、インターフェースの右上に「Read-only」タグが表示され、ApproveとDenyボタンが無効化されます。コラボレーターはプランとアノテーションを閲覧できますが、決定を送信できません。
:::

::: info 解凍プロセス
コラボレーターがURLを開くと、ブラウザが自動的に以下のステップを実行します（`useSharing` Hookがトリガー）：
1. `window.location.hash`から圧縮データを抽出
2. Base64デコード → deflate解凍 → JSON解析を逆順に実行
3. プランとアノテーションを復元
4. URL hashをクリア（リフレッシュ時の再ロードを回避）

ソースコードの場所：`packages/ui/hooks/useSharing.ts:67`
:::

### チェックポイント ✅

**共有URLが有効か確認**：
1. 共有URLをコピー
2. 新しいタブまたはシークレットモードで開く
3. 同じプランとアノテーションが表示されることを確認

**読み取り専用モードを確認**：
1. コラボレーターが共有URLを開く
2. 右上に「Read-only」タグがあるか確認
3. ApproveとDenyボタンが無効化されているか確認

**URL長さを確認**：
1. Export ModalのURLサイズを確認
2. 8 KBを超えていないか確認（超えている場合、アノテーションを減らすことを検討）

## よくあるトラブル

### 問題1：URL共有ボタンが表示されない

**現象**：Export ModalにShareタブがなく、Raw Diffのみ表示される。

**原因**：`PLANNOTATOR_SHARE`環境変数が"disabled"に設定されている。

**解決方法**：
```bash
# 現在の値を確認
echo $PLANNOTATOR_SHARE

# 削除または別の値に設定
unset PLANNOTATOR_SHARE
# または
export PLANNOTATOR_SHARE=enabled
```

ソースコードの場所：`apps/hook/server/index.ts:44`

### 問題2：共有URLを開くと空白ページが表示される

**現象**：コラボレーターがURLを開くが、ページにコンテンツがない。

**原因**：URL hashがコピー中に失われたり切り詰められたりした。

**解決方法**：
1. 完全なURLをコピーしているか確認（`#`とその後のすべての文字を含む）
2. 短縮リンクサービスを使用しない（hashを切り詰める可能性がある）
3. Export ModalのCopyボタンを使用し、手動コピーを避ける

::: tip URL hashの長さ
共有URLのhash部分は通常数千文字あり、手動コピーで見落としが発生しやすいです。Copyボタンの使用、またはコピー→貼り付けの2回実行で完全性を検証することをお勧めします。
:::

### 問題3：URLが長すぎて送信できない

**現象**：URLがコミュニケーションツールの文字制限（WeChat、Slackなど）を超えている。

**原因**：プラン内容が長すぎるか、アノテーションの数が多すぎる。

**解決方法**：
1. 不要なアノテーションを削除
2. 画像アタッチメントを減らす
3. Raw Diffエクスポートを使用してファイルとして保存することを検討
4. コードレビュー機能を使用する（diffモードの圧縮率が高い）

### 問題4：コラボレーターが私の画像を見られない

**現象**：共有URLに画像パスが含まれているが、コラボレーターが開くと「Image not found」と表示される。

**原因**：画像はローカルの`/tmp/plannotator/`ディレクトリに保存されており、コラボレーターはアクセスできない。

**解決方法**：
- PlannotatorのURL共有はクロスデバイスの画像アクセスをサポートしていない
- Obsidian統合を使用し、画像をvaultに保存すると共有可能
- またはスクリーンショットを撮り、アノテーションに埋め込む（テキスト記述）

ソースコードの場所：`packages/server/index.ts:163`（画像保存パス）

### 問題5：共有後にアノテーションを変更してもURLが更新されない

**現象**：新しいアノテーションを追加しても、Export ModalのURLが変更されない。

**原因**：`shareUrl`状態が自動的にリフレッシュされない（稀なケースで、通常はReactの状態更新問題）。

**解決方法**：
1. Export Modalを閉じる
2. Export Modalを再度開く
3. URLが自動的に最新の内容に更新されるはず

ソースコードの場所：`packages/ui/hooks/useSharing.ts:128`（`refreshShareUrl`関数）

## この章のまとめ

**URL共有機能**により、バックエンドサーバーなしでプランとアノテーションを共有できます：

- ✅ **バックエンド不要**：データはURL hashに圧縮され、サーバーに依存しない
- ✅ **プライバシー安全**：データはアップロードされず、ローカルとコラボレーターの間でのみ転送される
- ✅ **シンプルで効率的**：ワンクリックでURLを生成し、コピー＆ペーストで共有
- ✅ **読み取り専用モード**：コラボレーターはアノテーションの閲覧と追加が可能だが、決定を送信できない

**技術原理**：
1. **Deflate-raw圧縮**：JSONデータを約60-80%圧縮
2. **Base64エンコード**：バイナリデータをテキストに変換
3. **URLセーフ文字の置換**：`+` → `-`、`/` → `_`、`=` → `''`
4. **ハッシュ解析**：フロントエンドが自動的に解凍してコンテンツを復元

**設定オプション**：
- `PLANNOTATOR_SHARE=disabled`：共有機能を無効化
- デフォルトで有効：共有機能が使用可能

## 次の章の予告

> 次の章では**[Obsidian統合](../obsidian-integration/)**を学びます。
>
> 学べる内容：
> - Obsidian vaultsを自動検出
> - 承認されたプランをObsidianに保存
> - frontmatterとタグを自動生成
> - URL共有とObsidianナレッジマネジメントの組み合わせ

## 次の章の予告

> 次の章では**[Obsidian統合](../obsidian-integration/)**を学びます。
>
> 学べる内容：
> - Obsidian統合を設定し、プランを自動的にvaultに保存する方法
> - frontmatterとタグ生成の仕組みを理解
> - backlinkを活用してナレッジグラフを構築

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| データ圧縮（deflate + Base64） | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L30-L48) | 30-48 |
| データ解凍 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L53-L71) | 53-71 |
| アノテーション形式の変換（簡潔化） | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| アノテーション形式の復元 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| 共有URLの生成 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L162-L175) | 162-175 |
| URL hashの解析 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L181-L194) | 181-194 |
| URLサイズのフォーマット | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L199-L205) | 199-205 |
| URL共有Hook | [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts#L45-L155) | 45-155 |
| Export Modal UI | [`packages/ui/components/ExportModal.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ExportModal.tsx#L1-L196) | 1-196 |
| 共有スイッチ設定（Hook） | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44) | 44 |
| 共有スイッチ設定（OpenCode） | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L50) | 50 |

**主要な定数**：
- `SHARE_BASE_URL = 'https://share.plannotator.ai'`：共有ページのベースドメイン

**主要な関数**：
- `compress(payload: SharePayload): Promise<string>`：payloadをbase64url文字列に圧縮
- `decompress(b64: string): Promise<SharePayload>`：base64url文字列をpayloadに解凍
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`：完全なアノテーションを簡潔な形式に変換
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`：簡潔な形式を完全なアノテーションに復元
- `generateShareUrl(markdown, annotations, attachments): Promise<string>`：完全な共有URLを生成
- `parseShareHash(): Promise<SharePayload | null>`：現在のURLのhashを解析

**データ型**：
```typescript
interface SharePayload {
  p: string;  // plan markdown
  a: ShareableAnnotation[];
  g?: string[];  // global attachments
}

type ShareableAnnotation =
  | ['D', string, string | null, string[]?]  // Deletion
  | ['R', string, string, string | null, string[]?]  // Replacement
  | ['C', string, string, string | null, string[]?]  // Comment
  | ['I', string, string, string | null, string[]?]  // Insertion
  | ['G', string, string | null, string[]?];  // Global Comment
```

</details>
