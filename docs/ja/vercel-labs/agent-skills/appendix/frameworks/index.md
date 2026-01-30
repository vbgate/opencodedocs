---
title: "対応フレームワーク: 40以上のデプロイ方法 | Agent Skills"
sidebarTitle: "あなたのフレームワークはデプロイ可能ですか"
subtitle: "対応フレームワーク一覧"
description: "Agent Skills が対応する完全なフレームワーク一覧を確認できます。React、Vue、Svelte など40種類以上のフレームワークをカバーし、フレームワーク検出の原理と使用方法を説明します。"
tags:
  - "フレームワーク"
  - "デプロイ"
  - "互換性"
  - "リファレンス"
order: 130
prerequisite: []
---

# 対応フレームワーク一覧

## この章でできること

- Vercel Deploy スキルが対応する完全なフレームワーク一覧（45種類以上）を理解する
- フレームワーク検出の動作原理を理解する
- プロジェクトがワンクリックデプロイに対応しているか判断する
- フレームワーク検出の優先順位ルールを確認する

## 今の悩み

Agent Skills のワンクリックデプロイ機能を使いたいが、プロジェクトのフレームワークが対応しているかどうか不明、または検出ロジックがどのように動作するか知りたい。

## 核心概念

Vercel Deploy スキルは、プロジェクトの `package.json` ファイル内の `dependencies` と `devDependencies` をスキャンし、事前に定義されたフレームワーク特徴パッケージ名を1つずつ検出して、プロジェクトで使用されているフレームワークを判断します。

**検出は優先順位順に行われます**：最も具体的なフレームワークから最も汎用的なものまで、誤判定を防ぎます。例えば：
1. `next` を検出 → Next.js に一致
2. 同時に `react` があっても、Next.js を優先して認識します

::: tip 検出範囲

検出は `dependencies` と `devDependencies` の両方をチェックするため、フレームワークが開発依存としてのみインストールされていても認識されます。

:::

## 完全なフレームワーク一覧

### React エコシステム

| フレームワーク          | 検出依存              | 戻り値             |
|--- | --- | ---|
| **Next.js**            | `next`               | `nextjs`           |
| **Gatsby**             | `gatsby`             | `gatsby`           |
| **Remix**              | `@remix-run/`        | `remix`            |
| **React Router**       | `@react-router/`     | `react-router`     |
| **Blitz**              | `blitz`              | `blitzjs`          |
| **Create React App**   | `react-scripts`      | `create-react-app` |
| **Ionic React**        | `@ionic/react`       | `ionic-react`      |
| **Preact**             | `preact`             | `preact`           |

### Vue エコシステム

| フレームワーク | 検出依存    | 戻り値      |
|--- | --- | ---|
| **Nuxt**       | `nuxt`      | `nuxtjs`    |
| **VitePress**  | `vitepress` | `vitepress` |
| **VuePress**   | `vuepress`  | `vuepress`  |
| **Gridsome**   | `gridsome`  | `gridsome`  |

### Svelte エコシステム

| フレームワーク            | 検出依存           | 戻り値         |
|--- | --- | ---|
| **SvelteKit**             | `@sveltejs/kit`   | `sveltekit-1` |
| **Svelte**                | `svelte`          | `svelte`      |
| **Sapper** (レガシー)      | `sapper`          | `sapper`      |

### Angular

| フレームワーク    | 検出依存            | 戻り値          |
|--- | --- | ---|
| **Angular**     | `@angular/core`    | `angular`       |
| **Ionic Angular** | `@ionic/angular`  | `ionic-angular` |

### 静的サイトジェネレーター

| フレームワーク   | 検出依存            | 戻り値        |
|--- | --- | ---|
| **Astro**       | `astro`            | `astro`       |
| **Docusaurus**  | `@docusaurus/core` | `docusaurus-2` |
| **Hexo**        | `hexo`             | `hexo`        |
| **Eleventy**    | `@11ty/eleventy`   | `eleventy`    |
| **RedwoodJS**   | `@redwoodjs/`      | `redwoodjs`   |

### Node.js バックエンドフレームワーク

| フレームワーク | 検出依存      | 戻り値    |
|--- | --- | ---|
| **Express**    | `express`     | `express` |
| **NestJS**     | `@nestjs/core` | `nestjs`  |
| **Hono**       | `hono`        | `hono`    |
| **Fastify**    | `fastify`     | `fastify` |
| **Elysia**     | `elysia`      | `elysia`  |
| **h3**         | `h3`          | `h3`      |
| **Nitro**      | `nitropack`   | `nitro`   |
### その他のフレームワーク

| フレームワーク              | 検出依存                   | 戻り値                |
|--- | --- | ---|
| **SolidStart**             | `@solidjs/start`          | `solidstart-1`        |
| **Ember**                  | `ember-cli`, `ember-source` | `ember`              |
| **Dojo**                   | `@dojo/framework`          | `dojo`               |
| **Polymer**                | `@polymer/`                | `polymer`            |
| **Stencil**                | `@stencil/core`            | `stencil`            |
| **UmiJS**                  | `umi`                      | `umijs`              |
| **Saber**                  | `saber`                    | `saber`              |
| **Sanity**                 | `sanity`, `@sanity/`       | `sanity` または `sanity-v3` |
| **Storybook**              | `@storybook/`              | `storybook`          |
| **Hydrogen** (Shopify)     | `@shopify/hydrogen`        | `hydrogen`           |
| **TanStack Start**         | `@tanstack/start`          | `tanstack-start`     |

### ビルドツール

| フレームワーク | 検出依存 | 戻り値  |
|--- | --- | ---|
| **Vite**       | `vite`   | `vite`  |
| **Parcel**     | `parcel` | `parcel` |

### 静的 HTML プロジェクト

プロジェクトに `package.json` がない場合（純粋な静的ウェブサイト）、フレームワーク検出は `null` を返します。

デプロイスクリプトは以下をスマートに処理します：
- ルートディレクトリの `.html` ファイルを自動検出
- 1つの `.html` ファイルのみで `index.html` でない場合、自動的に `index.html` にリネーム
- 静的サイトとして Vercel に直接ホスト

**例シナリオ**：
```bash
my-static-site/
└── demo.html  # index.html に自動リネームされます
```
## フレームワーク検出原理

### 検出フロー

```
package.json を読み込み
    ↓
dependencies と devDependencies をスキャン
    ↓
優先順位順に事前定義されたパッケージ名をマッチング
    ↓
最初の一致を発見 → 対応するフレームワーク識別子を返す
    ↓
一致なし → null を返す（静的 HTML プロジェクト）
```

### 検出順序

検出はフレームワークの具体度に基づいてソートされ、**より具体的なフレームワークを優先的にマッチング**します：

```bash
# 例：Next.js プロジェクト
dependencies:
  next: ^14.0.0        # 一致 → nextjs
  react: ^18.0.0       # スキップ（より高優先度の一致あり）
  react-dom: ^18.0.0
```

**検出順序の一部**：
1. Next.js, Gatsby, Remix, Blitz（具体的なフレームワーク）
2. SvelteKit, Nuxt, Astro（メタフレームワーク）
3. React, Vue, Svelte（基本ライブラリ）
4. Vite, Parcel（汎用ビルドツール）

### 検出ルール

- **同時にチェック** `dependencies` と `devDependencies`
- **1つずつマッチング**、最初のものを見つけたら返す
- **パッケージ名マッチング**：完全一致またはプレフィックス一致
  - 完全一致：`"next"` → Next.js
  - プレフィックス一致：`"@remix-run/"` → Remix

```bash
# shell 検出ロジック（簡略版）
has_dep() {
    echo "$content" | grep -q "\"$1\""
}

if has_dep "next"; then
    echo "nextjs"
fi
```

## プロジェクトのフレームワークを検証する方法

### 方法 1：package.json を確認

プロジェクトの `package.json` を開き、`dependencies` または `devDependencies` 内で上記リストのパッケージ名を探します。

```json
{
  "dependencies": {
    "next": "^14.0.0",  ← Next.js
    "react": "^18.0.0"
  }
}
```

### 方法 2：デプロイを試みる

Vercel Deploy 機能を直接使用します：

```
Deploy my app to Vercel
```

Claude は検出されたフレームワークを出力します：

```
Detected framework: nextjs
```
### 方法 3：検出スクリプトを手動実行

事前にテストしたい場合、以下を実行できます：

```bash
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh
```

検出されたフレームワーク情報が（stderr に）出力されます。

## トラブルシューティング

### 問題 1：フレームワーク検出が正確ではない

**現象**：
```
Detected framework: vite
# しかし期待しているのは nextjs
```

**原因**：検出は優先順位順に行われ、Vite の検出は Next.js の後ですが、プロジェクトに `vite` と `next` の両方がある場合、Vite にマッチする可能性があります。

**影響**：通常、デプロイには影響しません。Vercel は自動的にビルド設定を検出します。

**解決方法**：
- `package.json` の依存関係を確認
- デプロイに影響しない場合は無視可能
- デプロイは正常に動作しますが、異なる設定を使用するだけです

### 問題 2：プロジェクトがリストにない

**現象**：プロジェクトのフレームワークが上記リストにない。

**可能な原因**：
- 非常に新しいフレームワークやニッチなフレームワーク
- フレームワークが異なるパッケージ名を使用している
- デプロイスクリプトにまだサポートが追加されていない

**解決方法**：
1. プロジェクトが **Vite** や **Parcel** などの汎用ビルドツールを使用しているか確認
2. デプロイを試みる。Vercel が自動的に認識する可能性があります
3. 静的 HTML プロジェクトの場合、直接デプロイできます
4. [agent-skills](https://github.com/vercel-labs/agent-skills) に PR を提出してフレームワークサポートを追加

### 問題 3：マルチフレームワークプロジェクト

**現象**：プロジェクトが複数のフレームワークを同時に使用している（例：Remix + Storybook）。

**検出動作**：優先順位に従って最初に一致したフレームワークを返します。

**影響**：通常、デプロイには影響しません。メインフレームワークが正しく認識されます。

## よくある質問

### Q：私のフレームワークがリストにありませんが、デプロイできますか？

A：試してみてください。Vite や Parcel などの汎用ビルドツールを使用している場合、これらのツールとして認識される可能性があります。Vercel もビルド設定を自動検出しようとします。

### Q：検出エラーはデプロイに影響しますか？

A：通常、影響しません。Vercel には強力な自動検出機能があり、フレームワーク識別子が不正確でも、正常にビルドおよびデプロイできます。

### Q：新しいフレームワークサポートを追加するには？

A：`deploy.sh` 内の `detect_framework()` 関数を変更して新しい検出ルールを追加し、[agent-skills](https://github.com/vercel-labs/agent-skills) に PR を提出してください。

### Q：静的 HTML プロジェクトには package.json が必要ですか？

A：いいえ。純粋な静的 HTML プロジェクト（JavaScript ビルドなし）は直接デプロイでき、スクリプトが自動的に処理します。
## この章のまとめ

Agent Skills の Vercel Deploy 機能は **45種類以上のフレームワーク** に対応し、主流のフロントエンド技術スタックを網羅しています：

**核心価値**：
- ✅ 幅広いフレームワーク対応、React/Vue/Svelte/Angular 全カバー
- ✅ スマートなフレームワーク検出、プロジェクトタイプの自動認識
- ✅ 静的 HTML プロジェクトに対応、依存関係なしでデプロイ
- ✅ オープンソース、新規フレームワークの追加が可能

**検出原理**：
- `package.json` の `dependencies` と `devDependencies` をスキャン
- 優先順位順に事前定義されたフレームワーク特徴パッケージ名をマッチング
- 対応するフレームワーク識別子を返して Vercel で使用

**次のステップ**：
[Vercel ワンクリックデプロイチュートリアル](../../platforms/vercel-deploy/) を確認して、この機能の使い方を学んでください。

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新時間：2026-01-25

| 機能              | ファイルパス                                                                                                                                                                         | 行番号    |
|--- | --- | ---|
| フレームワーク検出ロジック | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156  |
| デプロイスクリプトエントリ | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)                                                  | 1-250   |
| 静的 HTML 処理      | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)                                                  | 192-205 |

**主要な関数**：
- `detect_framework()`：package.json から 45種類以上のフレームワークを検出（11-156 行）
- `has_dep()`：依存関係が存在するかチェック（23-25 行）

**フレームワーク検出順序**（一部）：
1. Blitz (blitzjs)
2. Next.js (nextjs)
3. Gatsby (gatsby)
4. Remix (remix)
5. React Router (react-router)
6. TanStack Start (tanstack-start)
7. Astro (astro)
8. Hydrogen (hydrogen)
9. SvelteKit (sveltekit-1)
10. Svelte (svelte)
...（完全なリストは 11-156 行を参照）

**戻り値の例**：
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- 静的 HTML: `null`

</details>
