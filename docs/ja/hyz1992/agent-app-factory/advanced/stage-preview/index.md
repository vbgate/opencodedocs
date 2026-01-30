---
title: "プレビュー段階：デプロイガイドと実行説明の自動生成 | Agent App Factory チュートリアル"
sidebarTitle: "デプロイガイドの生成"
subtitle: "デプロイガイドの生成：プレビュー段階の完全ガイド"
description: "AI App Factory のプレビュー段階が生成したアプリケーションのために実行ガイドとデプロイ設定をどのように自動的に作成するかを学びます。ローカル起動、Docker コンテナ化、Expo EAS ビルド、CI/CD パイプライン、デモフローの設計を網羅します。"
tags:
  - "デプロイガイド"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# デプロイガイドの生成：プレビュー段階の完全ガイド

## 学んだことでできること

このレッスンを完了すると、以下のことができるようになります：

- プレビューエージェントが生成したアプリケーションのために実行ガイドをどのように記述するかを理解する
- Docker デプロイ設定の生成方法をマスターする
- Expo EAS ビルド設定の役割を理解する
- MVP 向けに簡潔なデモフローを設計できるようになる
- CI/CD と Git Hooks 設定のベストプラクティスを理解する

## 今のあなたの課題

コードは生成され、検証も通過しました。チームやクライアントに MVP を迅速に提示したいが、以下のことがわかりません：

- どのような実行ドキュメントを書けばよいか？
- 他の人がどのように迅速にアプリケーションを起動・実行できるようにするか？
- デモでどの機能を提示すべきか？どのような落とし穴を避けるべきか？
- 本番環境をどのようにデプロイするか？Docker かクラウドプラットフォームか？
- 継続的インテグレーションとコード品質ゲートをどのように確立するか？

プレビュー段階はこれらの問題を解決します——完全な実行説明とデプロイ設定を自動的に生成します。

## いつこの方法を使うべきか

プレビュー段階はパイプラインの第7段階で、最後の段階です。検証段階の直後に続きます。

**典型的な使用シナリオ**：

| シナリオ | 説明 |
| -------- | ---- |
| MVP デモ | チームやクライアントにアプリケーションを提示するため、詳細な実行ガイドが必要 |
| チーム協業 | 新メンバーがプロジェクトに参加し、迅速に開発環境をセットアップする必要がある |
| 本番デプロイ | アプリケーションを本番環境に公開する準備、Docker 設定と CI/CD パイプラインが必要 |
| モバイルアプリ公開 | Expo EAS を設定し、App Store と Google Play への提出準備が必要 |

**適さないシナリオ**：

- コードを見るだけで実行しない（プレビュー段階は必須）
- コードが検証段階を通過していない（問題を修正してからプレビューを実行）

## 🎒 始める前の準備

::: warning 前提条件

このレッスンは、以下を完了していることを想定しています：

1. **検証段階の完了**：`artifacts/validation/report.md` が存在し、検証に合格していること
2. **アーキテクチャの理解**：バックエンドとフロントエンドの技術スタック、データモデル、API エンドポイントを明確に把握していること
3. **基本概念の習得**：Docker、CI/CD、Git Hooks の基本概念を理解していること

:::

**理解しておくべき概念**：

::: info Docker とは？

Docker は、アプリケーションとその依存関係をポータブルなコンテナにパッケージ化するコンテナ化プラットフォームです。

**主なメリット**：

- **環境の一貫性**：開発、テスト、本番環境が完全に一致し、「自分のマシンでは動く」問題を回避
- **高速デプロイ**：1つのコマンドでアプリケーションスタック全体を起動
- **リソース分離**：コンテナ間が互いに影響せず、セキュリティを向上

**基本概念**：

```
Dockerfile → イメージ (Image) → コンテナ (Container)
```

:::

::: info CI/CD とは？

CI/CD（継続的インテグレーション/継続的デプロイ）は、自動化されたソフトウェア開発のプラクティスです。

**CI (Continuous Integration)**：
- 各コミットで自動的にテストとチェックを実行
- コードの問題を早期発見
- コード品質の向上

**CD (Continuous Deployment)**：
- アプリケーションの自動ビルドとデプロイ
- 新機能を迅速に本番環境へ
- 手動操作によるエラーの削減

**GitHub Actions** は GitHub が提供する CI/CD プラットフォームで、`.github/workflows/*.yml` ファイルを設定することで自動化フローを定義します。

:::

::: info Git Hooks とは？

Git Hooks は、Git 操作の特定のタイミングで自動的に実行されるスクリプトです。

**一般的な Hooks**：

- **pre-commit**：コミット前にコードチェックとフォーマットを実行
- **commit-msg**：コミットメッセージの形式を検証
- **pre-push**：プッシュ前に完全なテストを実行

**Husky** は、人気のある Git Hooks 管理ツールで、Hooks の設定と保守を簡素化します。

:::

## コアコンセプト

プレビュー段階の核心は**アプリケーションのための完全な使用とデプロイドキュメントを準備すること**ですが、「ローカルファースト、透明なリスク」の原則に従います。

### 思考フレームワーク

プレビューエージェントは以下の思考フレームワークに従います：

| 原則 | 説明 |
| ---- | ---- |
| **ローカルファースト** | 基本的な開発環境を持つ誰もがローカルで起動できるようにする |
| **デプロイ準備完了** | 本番デプロイに必要なすべての設定ファイルを提供する |
| **ユーザーストーリー** | コア価値を示す簡潔なデモフローを設計する |
| **透明なリスク** | 現在のバージョンの制限や既知の問題を能動的にリストする |

### 出力ファイル構造

プレビューエージェントは2種類のファイルを生成します：

**必須ファイル**（すべてのプロジェクトで必要）：

| ファイル | 説明 | 位置 |
| -------- | ---- | ---- |
| `README.md` | メイン実行説明ドキュメント | `artifacts/preview/README.md` |
| `Dockerfile` | バックエンド Docker 設定 | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | 開発環境 Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | 本番環境変数テンプレート | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS ビルド設定 | `artifacts/client/eas.json` |

**推奨ファイル**（本番環境で必要）：

| ファイル | 説明 | 位置 |
| -------- | ---- | ---- |
| `DEPLOYMENT.md` | 詳細なデプロイガイド | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | 本番環境 Docker Compose | プロジェクトルート |

### README ドキュメント構造

`artifacts/preview/README.md` には以下のセクションが含まれている必要があります：

```markdown
# [プロジェクト名]

## クイックスタート

### 環境要件
- Node.js >= 18
- npm >= 9
- [その他の依存関係]

### バックエンド起動
[依存関係のインストール、環境設定、データベース初期化、サービス起動]

### フロントエンド起動
[依存関係のインストール、環境設定、開発サーバー起動]

### インストールの検証
[テストコマンド、ヘルスチェック]

---

## デモフロー

### 準備作業
### デモ手順
### デモ時の注意点

---

## 既知の問題と制限

### 機能制限
### 技術的負債
### デモ時に避けるべき操作

---

## よくある質問
```

## プレビューエージェントのワークフロー

プレビューエージェントは、生成されたアプリケーションのための実行ガイドとデプロイ設定を作成する AI エージェントです。そのワークフローは以下の通りです：

### 入力ファイル

プレビューエージェントは以下のファイルのみを読み取ることができます：

| ファイル | 説明 | 位置 |
| -------- | ---- | ---- |
| バックエンドコード | 検証済みのバックエンドアプリケーション | `artifacts/backend/` |
| フロントエンドコード | 検証済みのフロントエンドアプリケーション | `artifacts/client/` |

### 出力ファイル

プレビューエージェントは以下のファイルを生成する必要があります：

| ファイル | 説明 | 位置 |
| -------- | ---- | ---- |
| `README.md` | メイン実行説明ドキュメント | `artifacts/preview/README.md` |
| `Dockerfile` | バックエンド Docker 設定 | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | 開発環境 Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | 本番環境変数テンプレート | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS ビルド設定 | `artifacts/client/eas.json` |

### 実行手順

1. **コードを確認**：バックエンドとフロントエンドのディレクトリを分析し、依存関係のインストールと起動コマンドを特定
2. **README を作成**：`skills/preview/skill.md` のガイダンスに従い、明確なインストールと実行ガイドを記述
3. **Docker 設定を生成**：Dockerfile と docker-compose.yml を作成
4. **EAS を設定**：Expo EAS ビルド設定を生成（モバイルアプリケーション）
5. **デモフローを準備**：簡潔なデモシナリオ説明を設計
6. **既知の問題をリスト**：現在のバージョンの欠陥や制限を能動的にリストアップ

## 実践しよう：プレビュー段階を実行

### ステップ 1：検証段階が完了していることを確認

**なぜ必要か**

プレビューエージェントは `artifacts/backend/` と `artifacts/client/` を読み取る必要があります。コードが検証を通過していない場合、プレビュー段階で生成されるドキュメントが正確でない可能性があります。

**操作**

```bash
# 検証レポートを確認
cat artifacts/validation/report.md
```

**期待する結果**：検証レポートがバックエンドとフロントエンドのすべてのチェックが合格していることを示しています。

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```

### ステップ 2：プレビュー段階を実行

**なぜ必要か**

AI アシスタントを使用してプレビューエージェントを実行し、実行ガイドとデプロイ設定を自動生成します。

**操作**

```bash
# Claude Code でプレビュー段階を実行
factory run preview
```

**期待する結果**：

```
✓ 現在の段階: preview
✓ バックエンドコードの読み込み: artifacts/backend/
✓ フロントエンドコードの読み込み: artifacts/client/
✓ プレビューエージェントを起動

プレビューエージェントが実行ガイドとデプロイ設定を生成中...

[AI アシスタントが以下の操作を実行]
1. バックエンドとフロントエンドのプロジェクト構造を分析
2. README.md を生成（インストール、実行、デモフロー）
3. Dockerfile と docker-compose.yml を作成
4. Expo EAS ビルドファイルを設定
5. 本番環境変数テンプレートを準備
6. 既知の問題と制限をリストアップ

エージェントの完了を待機中...
```

### ステップ 3：生成された README を確認

**なぜ必要か**

README が完全かどうかを確認し、インストール手順と実行コマンドが明確かどうかを検証します。

**操作**

```bash
# 実行ガイドを確認
cat artifacts/preview/README.md
```

**期待する結果**：以下のセクションを含む完全な実行ガイド

```markdown
# AI レストラン推薦アシスタント

## クイックスタート

### 環境要件

- Node.js >= 18
- npm >= 9
- Docker（オプション、コンテナ化デプロイ用）

### バックエンド起動

```bash
# バックエンドディレクトリに移動
cd artifacts/backend

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .env を編集して必要な設定を入力

# データベースを初期化
npx prisma migrate dev

# （オプション）シードデータを追加
npm run db:seed

# 開発サーバーを起動
npm run dev
```

バックエンド実行アドレス: http://localhost:3000
ヘルスチェック: http://localhost:3000/health
API ドキュメント: http://localhost:3000/api-docs

### フロントエンド起動

```bash
# フロントエンドディレクトリに移動
cd artifacts/client

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# API_URL を編集してバックエンドアドレスを指定

# 開発サーバーを起動
npm start
```

- iOS シミュレータ: `i` を押す
- Android シミュレータ: `a` を押す
- Web ブラウザ: `w` を押す

### インストールの検証

インストールが成功したかどうかを検証するために、以下のコマンドを実行します：

```bash
# バックエンドテスト
cd artifacts/backend && npm test

# フロントエンドテスト
cd artifacts/client && npm test

# API ヘルスチェック
curl http://localhost:3000/health
```

---

## デモフロー

### 準備作業

1. バックエンドとフロントエンドの両方が起動していることを確認
2. デモデータをクリアまたはリセット（オプション）

### デモ手順

1. **シナリオ紹介** (30秒)
   - ターゲットユーザーの紹介：新しいレストランを試したいユーザー
   - コア問題の紹介：選択肢が多く、何を食べるか決められない

2. **機能デモ** (3-5分)
   - ステップ 1: ユーザーが好みを入力（料理の種類、味、予算）
   - ステップ 2: AI が好みに基づいてレストランを推薦
   - ステップ 3: ユーザーが推薦結果を確認して選択

3. **技術ハイライト** (オプション, 1分)
   - リアルタイム AI 推薦（OpenAI API 呼び出し）
   - モバイル対応レスポンシブデザイン
   - ローカルデータベース永続化

### デモ時の注意点

- ネットワーク接続が正常であることを確認（AI 推薦には API 呼び出しが必要）
- 過度に長い、または曖昧な好みを入力しない（推薦が不正確になる可能性あり）
- デモ中にデータベースを変更しない（デモ効果に影響する可能性あり）

---

## 既知の問題と制限

### 機能制限

- [ ] ユーザー登録とログインはまだサポートされていません
- [ ] お気に入りと履歴はまだサポートされていません
- [ ] AI 推薦はテキスト入力のみで、音声や画像はまだサポートされていません

### 技術的負債

- [ ] フロントエンドのエラーハンドリングが不十分
- [ ] バックエンドのログ記録の最適化が必要
- [ ] データベースインデックスが最適化されていない（データ量が少ない場合は影響なし）

### デモ時に避けるべき操作

- アカウントの登録やログインを試みる - デモが中断する可能性あり
- 特殊文字や過度に長いテキストを入力 - エラーが発生する可能性あり
- 高速連続リクエスト - API レート制限がトリガーされる可能性あり

---

## よくある質問

### Q: ポートが使用中の場合はどうすればよいですか？

A: `.env` の `PORT` 変数を変更するか、ポートを使用しているプロセスを先に終了してください。

### Q: データベース接続が失敗した場合はどうすればよいですか？

A: `.env` の `DATABASE_URL` 設定が正しいかを確認し、データベースが起動していることを確認してください。

### Q: AI 推薦が応答しない場合はどうすればよいですか？

A: `.env` の `OPENAI_API_KEY` が有効か、ネットワーク接続が正常かを確認してください。
```

### ステップ 4：生成された Docker 設定を確認

**なぜ必要か**

Docker 設定が正しいかどうかを確認し、コンテナのビルドと実行がスムーズに行えるようにします。

**操作**

```bash
# Dockerfile を確認
cat artifacts/backend/Dockerfile

# docker-compose.yml を確認
cat artifacts/backend/docker-compose.yml
```

**期待する結果**：Docker のベストプラクティスに準拠した設定ファイル

**Dockerfile の例**：

```dockerfile
# ベースイメージ
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係ファイルをコピー
COPY package*.json ./
COPY prisma ./prisma/

# 依存関係をインストール
RUN npm ci --only=production

# Prisma Client を生成
RUN npx prisma generate

# ソースコードをコピー
COPY . .

# ビルド
RUN npm run build

# 本番イメージ
FROM node:20-alpine AS production

WORKDIR /app

# 本番依存関係をインストール
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# ポートを公開
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 起動コマンド
CMD ["npm", "start"]
```

**docker-compose.yml の例**：

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./dev.db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### ステップ 5：EAS 設定を確認

**なぜ必要か**

Expo EAS 設定が正しいかどうかを確認し、モバイルアプリケーションのビルドと公開がスムーズに行えるようにします。

**操作**

```bash
# EAS 設定を確認
cat artifacts/client/eas.json
```

**期待する結果**：development、preview、production の3つの環境の設定を含む

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-staging.your-domain.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.your-domain.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### ステップ 6：終了条件を検証

**なぜ必要か**

Sisyphus はプレビューエージェントが終了条件を満たしているかを検証し、満たしていない場合は再実行を要求します。

**チェックリスト**

| チェック項目 | 説明 | 合格/不合格 |
| ----------- | ---- | ---------- |
| README にインストール手順が含まれている | バックエンドとフロントエンドに必要な依存関係のインストールコマンドが明確にリストされている | [ ] |
| README に実行コマンドが含まれている | バックエンドとフロントエンドの起動コマンドがそれぞれ提供されている | [ ] |
| README にアクセスアドレスとデモフローがリストされている | デモ時にアクセスする必要のあるアドレスとポートが説明されている | [ ] |
| Docker 設定が正常にビルドできる | Dockerfile と docker-compose.yml に構文エラーがない | [ ] |
| 本番環境変数テンプレートが完全 | .env.production.example に必要なすべての設定が含まれている | [ ] |

**不合格の場合**：

```bash
# プレビュー段階を再実行
factory run preview
```

## チェックポイント ✅

**完了したことを確認してください**：

- [ ] プレビュー段階が正常に実行された
- [ ] `artifacts/preview/README.md` ファイルが存在し、内容が完全
- [ ] `artifacts/backend/Dockerfile` ファイルが存在し、ビルド可能
- [ ] `artifacts/backend/docker-compose.yml` ファイルが存在
- [ ] `artifacts/backend/.env.production.example` ファイルが存在
- [ ] `artifacts/client/eas.json` ファイルが存在（モバイルアプリケーション）
- [ ] README に明確なインストール手順と実行コマンドが含まれている
- [ ] README にデモフローと既知の問題が含まれている

## 落とし穴の注意

### ⚠️ トラップ 1：依存関係インストール手順を無視する

**問題**：README に「サービスを起動」とのみ書き、依存関係をインストールする方法が説明されていない。

**症状**：新メンバーが README に従って操作し、`npm run dev` を実行すると「モジュールが見つからない」というエラーが発生する。

**解決策**：プレビューエージェントの制約「README にはインストール手順が必須」により、各ステップに明確なコマンドを含めることを確実にする。

**正しい例**：

```bash
# ❌ エラー - インストール手順が欠如
npm run dev

# ✅ 正解 - 完全なステップを含む
npm install
npm run dev
```

### ⚠️ トラップ 2：Docker 設定で latest タグを使用する

**問題**：Dockerfile で `FROM node:latest` や `FROM node:alpine` を使用している。

**症状**：各ビルドで異なるバージョンの Node.js が使用される可能性があり、環境の一貫性が失われる。

**解決策**：プレビューエージェントの制約「Docker イメージタグとして latest を使用してはならず、具体的なバージョン番号を使用すべき」。

**正しい例**：

```dockerfile
# ❌ エラー - latest を使用
FROM node:latest

# ❌ エラー - 具体的なバージョンが未指定
FROM node:alpine

# ✅ 正解 - 具体的なバージョンを使用
FROM node:20-alpine
```

### ⚠️ トラップ 3：環境変数のハードコーディング

**問題**：Docker 設定や EAS 設定で機密情報（パスワード、API Key など）をハードコーディングしている。

**症状**：機密情報がコードリポジトリに漏洩し、セキュリティリスクが存在する。

**解決策**：プレビューエージェントの制約「デプロイ設定で機密情報をハードコーディングしてはならず、環境変数テンプレートを使用すべき」。

**正しい例**：

```yaml
# ❌ エラー - データベースパスワードをハードコーディング
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ 正解 - 環境変数を使用
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ トラップ 4：既知の問題を隠してリストしない

**問題**：README に既知の問題と制限がリストされておらず、製品能力を誇張している。

**症状**：デモ中に予期しない問題が発生し、恥ずかしい思いと信頼の低下を招く。

**解決策**：プレビューエージェントの制約「機能を誇張したり欠陥や制限を隠したりしてはならず、現在のバージョンの問題を能動的にリストアップすべき」。

**正しい例**：

```markdown
## 既知の問題と制限

### 機能制限
- [ ] ユーザー登録とログインはまだサポートされていません
- [ ] AI 推薦が正確ではない可能性があります（OpenAI API の応答に依存）
```

### ⚠️ トラップ 5：デモフローが複雑すぎる

**問題**：デモフローに 10 以上のステップが含まれ、10 分以上を要する。

**症状**：デモ担当者がステップを記憶できず、聴衆が忍耐を失う。

**解決策**：プレビューエージェントの制約「デモフローは 3-5 分に制限し、ステップは 5 つ以下にすべき」。

**正しい例**：

```markdown
### デモ手順

1. **シナリオ紹介** (30秒)
   - ターゲットユーザーとコア問題の紹介

2. **機能デモ** (3-5分)
   - ステップ 1: ユーザーが好みを入力
   - ステップ 2: AI が好みに基づいて推薦
   - ステップ 3: ユーザーが結果を確認

3. **技術ハイライト** (オプション, 1分)
   - リアルタイム AI 推薦
   - モバイル対応レスポンシブデザイン
```

## CI/CD 設定テンプレート

プレビューエージェントは `templates/cicd-github-actions.md` を参考にして CI/CD 設定を生成できます。以下が含まれます：

### バックエンド CI パイプライン

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run type check
        working-directory: backend
        run: npx tsc --noEmit

      - name: Validate Prisma schema
        working-directory: backend
        run: npx prisma validate

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run tests
        working-directory: backend
        run: npm test
```

### フロントエンド CI パイプライン

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'client/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'client/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        working-directory: client
        run: npm ci

      - name: Run linter
        working-directory: client
        run: npm run lint

      - name: Run type check
        working-directory: client
        run: npx tsc --noEmit

      - name: Run tests
        working-directory: client
        run: npm test -- --coverage
```

## Git Hooks 設定テンプレート

プレビューエージェントは `templates/git-hooks-husky.md` を参考にして Git Hooks 設定を生成できます。以下が含まれます：

### pre-commit Hook

コミット前にコードチェックとフォーマットを実行します。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# lint-staged を実行
npx lint-staged

# TypeScript 型チェック
echo "📝 Type checking..."
npm run type-check

echo "✅ Pre-commit checks passed!"
```

### commit-msg Hook

コミットメッセージの形式を検証します。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Validating commit message..."

npx --no -- commitlint --edit "$1"

echo "✅ Commit message is valid!"
```

## レッスンのまとめ

プレビュー段階はパイプラインの最後の部分で、生成されたアプリケーションのための完全な使用とデプロイドキュメントを準備します。以下を自動生成します：

- **実行ガイド**：明確なインストール手順、起動コマンド、デモフロー
- **Docker 設定**：Dockerfile と docker-compose.yml、コンテナ化デプロイをサポート
- **EAS 設定**：Expo EAS ビルド設定、モバイルアプリ公開をサポート
- **CI/CD 設定**：GitHub Actions パイプライン、継続的インテグレーションとデプロイをサポート
- **Git Hooks**：Husky 設定、コミット前チェックをサポート

**重要な原則**：

1. **ローカルファースト**：基本的な開発環境を持つ誰もがローカルで起動できるようにする
2. **デプロイ準備完了**：本番デプロイに必要なすべての設定ファイルを提供する
3. **ユーザーストーリー**：コア価値を示す簡潔なデモフローを設計する
4. **透明なリスク**：現在のバージョンの制限や既知の問題を能動的にリストする

プレビュー段階を完了すると、以下が得られます：

- ✅ 完全な実行ガイド（`README.md`）
- ✅ Docker コンテナ化設定（`Dockerfile`, `docker-compose.yml`）
- ✅ 本番環境変数テンプレート（`.env.production.example`）
- ✅ Expo EAS ビルド設定（`eas.json`）
- ✅ オプションの詳細なデプロイガイド（`DEPLOYMENT.md`）

## 次のレッスンへの予告

> おめでとうございます！AI App Factory のすべての 7 段階を完了しました。
>
> パイプラインの調整メカニズムを深く理解したい場合は、**[Sisyphus スケジューラ詳細](../orchestrator/)** を学ぶことができます。
>
> 学ぶこと：
> - スケジューラがパイプライン実行をどのように調整するか
> - 権限チェックと権限越え処理メカニズム
> - 失敗処理とロールバック戦略
> - コンテキスト最適化と Token 節約のヒント

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-29

| 機能 | ファイルパス | 行番号 |
| ---- | ---- | ---- |
| プレビューエージェント定義 | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| プレビュースキルガイド | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| パイプライン設定 | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| CI/CD 設定テンプレート | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Git Hooks 設定テンプレート | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**重要な制約**：
- **ローカルファースト**：基本的な開発環境を持つ誰もがローカルで起動できるようにする
- **デプロイ準備完了**：本番デプロイに必要なすべての設定ファイルを提供する
- **透明なリスク**：現在のバージョンの制限や既知の問題を能動的にリストする

**必須ファイル**：
- `artifacts/preview/README.md` - メイン実行説明ドキュメント
- `artifacts/backend/Dockerfile` - バックエンド Docker 設定
- `artifacts/backend/docker-compose.yml` - 開発環境 Docker Compose
- `artifacts/backend/.env.production.example` - 本番環境変数テンプレート
- `artifacts/client/eas.json` - Expo EAS ビルド設定

**してはならないこと (NEVER)**：
- NEVER 依存関係のインストールや設定手順を無視すると、実行やデプロイが失敗する可能性が高い
- NEVER アプリケーションと無関係な追加の説明やマーケティング用語を提供する
- NEVER 製品能力を誇張し、欠陥や制限を隠す
- NEVER デプロイ設定で機密情報（パスワード、API Key など）をハードコーディングする
- NEVER ヘルスチェック設定を無視すると、本番環境の監視に重要
- NEVER データベースマイグレーションの説明をスキップすると、本番環境への移行の重要なステップ
- NEVER `latest` を Docker イメージタグとして使用し、具体的なバージョン番号を使用すべき
- NEVER 本番環境で SQLite を使用（PostgreSQL に移行すべき）

</details>
