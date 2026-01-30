---
title: "技術アーキテクチャの設計：Tech ステージ完全ガイド | Agent App Factory チュートリアル"
sidebarTitle: "技術アーキテクチャの設計"
subtitle: "技術アーキテクチャの設計：Tech ステージ完全ガイド"
description: "AI App Factory の Tech ステージで PRD から最小限の実用的な技術アーキテクチャと Prisma データモデルを設計する方法を学びます。技術スタックの選択、データモデル設計、API 定義、データベース移行戦略を含みます。"
tags:
- "技術アーキテクチャ"
- "データモデル"
- "Prisma"
prerequisite:
- "advanced-stage-prd"
order: 110
---

# 技術アーキテクチャの設計：Tech ステージ完全ガイド

## 学習後にできること

本レッスンを完了すると、以下ができるようになります：

- Tech Agent が PRD に基づいて技術アーキテクチャを設計する方法を理解する
- Prisma Schema の設計方法と制約を習得する
- 技術スタック選択の決定原則を理解する
- MVP に適したデータモデルと API 設計を作成する方法を学ぶ
- SQLite 開発環境と PostgreSQL 本番環境の移行戦略を理解する

## 現在の課題

PRD は作成済みで、どの機能を実装するかは明確ですが、以下がわかりません：

- どの技術スタックを選ぶべきか？Node.js か Python か？
- データテーブルはどう設計するか？リレーションはどう定義するか？
- API エンドポイントはどれが必要か？どの規格に従うべきか？
- 迅速なデリバリーと将来の拡張性の両方をどう保証するか？

Tech ステージはこれらの問題を解決するためのものです——PRD に基づいて技術アーキテクチャとデータモデルを自動生成します。

## いつこの手法を使うか

Tech ステージはパイプラインの第4ステージで、UI ステージの直後、Code ステージの前に位置します。

**典型的な使用シナリオ**：

| シナリオ | 説明 |
| ---- | ---- |
| 新規プロジェクト開始 | PRD 確定後、技術設計が必要な場合 |
| MVP 高速プロトタイプ | 過度な設計を避け、最小限の実用的な技術アーキテクチャが必要な場合 |
| 技術スタック決定 | どの技術の組み合わせが最適か不明な場合 |
| データモデル設計 | 明確なエンティティ関係とフィールドの定義が必要な場合 |

**適用外のシナリオ**：

- 既に明確な技術アーキテクチャがあるプロジェクト（Tech ステージは再設計する）
- フロントエンド/バックエンドの一方のみ（Tech ステージはフルスタックアーキテクチャを設計する）
- マイクロサービスアーキテクチャが必要な場合（MVP ステージでは推奨しない）

## 開始前の準備

::: warning 前提条件

本レッスンでは以下を前提としています：

1. **PRD ステージの完了**：`artifacts/prd/prd.md` が存在し、検証に合格していること
2. **製品要件の理解**：コア機能、ユーザーストーリー、MVP 範囲を明確に理解していること
3. **基本概念の理解**：RESTful API、リレーショナルデータベース、ORM の基本概念を知っていること

:::

**理解が必要な概念**：

::: info Prisma とは？

Prisma は、TypeScript/Node.js でデータベースを操作するためのモダンな ORM（オブジェクトリレーショナルマッピング）ツールです。

**主な利点**：

- **型安全性**：TypeScript 型を自動生成し、開発時に完全な補完を提供
- **移行管理**：`prisma migrate dev` でデータベース変更を自動管理
- **開発体験**：Prisma Studio でデータを視覚的に確認・編集

**基本的なワークフロー**：

```
schema.prisma を定義 → 移行を実行 → Client を生成 → コードで使用
```

:::

::: info なぜ MVP は SQLite を、本番は PostgreSQL を使うのか？

**SQLite（開発環境）**：

- ゼロ設定、ファイルベースのデータベース（`dev.db`）
- 軽量で高速、ローカル開発とデモに適している
- 同時書き込みをサポートしない

**PostgreSQL（本番環境）**：

- 機能が完全で、並列処理や複雑なクエリをサポート
- パフォーマンスが優秀で、本番デプロイに適している
- Prisma 移行はシームレス：`DATABASE_URL` を変更するだけ

**移行戦略**：Prisma は `DATABASE_URL` に基づいて自動的にデータベースプロバイダーに適応し、Schema を手動で変更する必要はありません。

:::

## 核心的な考え方

Tech ステージの核心は**製品要件を技術ソリューションに変換すること**ですが、「MVP 優先」の原則に従う必要があります。

### 思考フレームワーク

Tech Agent は以下の思考フレームワークに従います：

| 原則 | 説明 |
| ---- | ---- |
| **目標対応** | 技術ソリューションは製品のコアバリューに奉仕する必要がある |
| **シンプル優先** | シンプルで成熟した技術スタックを選択し、迅速にデリバリー |
| **拡張性** | 設計に拡張ポイントを確保し、将来の進化をサポート |
| **データ駆動** | 明確なデータモデルでエンティティと関係を表現 |

### 技術選定決定木

**バックエンド技術スタック**：

| コンポーネント | 推奨 | 代替案 | 説明 |
| ---- | ---- | ---- | ---- |
| **ランタイム** | Node.js + TypeScript | Python + FastAPI | Node.js エコシステムが豊富で、フロントエンドと統一 |
| **Web フレームワーク** | Express | Fastify | Express は成熟して安定し、ミドルウェアが豊富 |
| **ORM** | Prisma 5.x | TypeORM | Prisma は型安全で、移行管理が優秀 |
| **データベース** | SQLite（開発）/ PostgreSQL（本番） | - | SQLite はゼロ設定、PostgreSQL は本番対応 |

**フロントエンド技術スタック**：

| シナリオ | 推奨 | 説明 |
| ---- | ---- | ---- |
| モバイルのみ | React Native + Expo | クロスプラットフォーム、ホットリロード |
| モバイル + Web | React Native Web | 1つのコードで複数のプラットフォームを実行 |
| Web のみ | React + Vite | パフォーマンスが優秀で、エコシステムが成熟 |

**状態管理**：

| 複雑さ | 推奨 | 説明 |
| ---- | ---- | ---- |
| シンプル（グローバル状態 < 5 個） | React Context API | 依存関係ゼロ、学習コストが低い |
| 中程度の複雑さ | Zustand | 軽量、API がシンプル、パフォーマンスが良い |
| 複雑なアプリケーション | Redux Toolkit | ⚠️ MVP ステージでは推奨しない、複雑すぎる |

### データモデル設計原則

**エンティティ識別**：

1. PRD のユーザーストーリーから名詞を抽出 → 候補エンティティ
2. コアエンティティ（必須）と補助エンティティ（オプション）を区別
3. 各エンティティは明確なビジネス意味を持つ必要がある

**リレーション設計**：

| リレーションタイプ | 例 | 説明 |
| ---- | ---- | ---- |
| 一対多（1:N） | User → Posts | ユーザーが複数の記事を持つ |
| 多対多（M:N） | Posts ↔ Tags | 記事とタグ（中間テーブル経由） |
| 一対一（1:1） | User → UserProfile | ⚠️ 少用、通常は統合可能 |

**フィールド原則**：

- **必須フィールド**：`id`, `createdAt`, `updatedAt`
- **冗長性を避ける**：計算または関連で取得できるフィールドは保存しない
- **適切な型**：String, Int, Float, Boolean, DateTime
- **機密フィールドのマーク**：パスワードなどは直接保存しない

### ⚠️ SQLite 互換性制約

Tech Agent は Prisma Schema を生成する際、SQLite 互換性要件を遵守する必要があります：

#### Composite Types の使用禁止

SQLite は Prisma の `type` 定義をサポートしていないため、JSON 文字列を `String` で保存する必要があります。

```prisma
// ❌ エラー - SQLite はサポートしていない
type UserProfile {
identity String
ageRange String
}

model User {
id Int @id @default(autoincrement())
profile UserProfile
}

// ✅ 正しい - String を使用して JSON を保存
model User {
id Int @id @default(autoincrement())
profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### JSON フィールドコメント規格

Schema でコメントを使用して JSON 構造を説明：

```prisma
model User {
id Int @id @default(autoincrement())
// JSON 形式: {"identity":"student","ageRange":"18-25"}
profile String
}
```

TypeScript コードで対応するインターフェースを定義：

```typescript
// src/types/index.ts
export interface UserProfile {
identity: string;
ageRange: string;
}
```

#### Prisma バージョン固定

Prisma 5.x を使用する必要があり、7.x は使用しない（互換性の問題がある）：

```json
{
"dependencies": {
"@prisma/client": "5.22.0",
"prisma": "5.22.0"
}
}
```

## Tech Agent のワークフロー

Tech Agent は PRD に基づいて技術アーキテクチャを設計する AI Agent です。ワークフローは以下の通りです：

### 入力ファイル

Tech Agent は以下のファイルのみ読み取ることができます：

| ファイル | 説明 | 位置 |
| ---- | ---- | ---- |
| `prd.md` | 製品要件ドキュメント | `artifacts/prd/prd.md` |

### 出力ファイル

Tech Agent は以下のファイルを生成する必要があります：

| ファイル | 説明 | 位置 |
| ---- | ---- | ---- |
| `tech.md` | 技術ソリューションとアーキテクチャドキュメント | `artifacts/tech/tech.md` |
| `schema.prisma` | データモデル定義 | `artifacts/backend/prisma/schema.prisma` |

### 実行ステップ

1. **PRD の読み取り**：コア機能、データフロー、制約条件を識別
2. **技術スタックの選択**：`skills/tech/skill.md` に基づき、言語、フレームワーク、データベースを選択
3. **データモデルの設計**：エンティティ、属性、リレーションを定義し、Prisma schema で表現
4. **技術ドキュメントの作成**：`tech.md` で選択理由、拡張戦略、非目標を説明
5. **出力ファイルの生成**：設計を指定パスに書き込み、アップストリームファイルは変更しない

### 終了条件

Sisyphus スケジューラは Tech Agent が以下の条件を満たしているか検証します：

- ✅ 技術スタックが明確に宣言されている（バックエンド、フロントエンド、データベース）
- ✅ データモデルが PRD と一致している（すべてのエンティティが PRD から来ている）
- ✅ 早すぎる最適化や過度な設計が行われていない

## 実践：Tech ステージの実行

### ステップ 1：PRD ステージの完了を確認

**なぜ**

Tech Agent は `artifacts/prd/prd.md` を読み取る必要があり、ファイルが存在しない場合は Tech ステージを実行できません。

**操作**

```bash
# PRD ファイルが存在するか確認
cat artifacts/prd/prd.md
```

**確認すべき内容**：構造化された PRD ドキュメントで、ターゲットユーザー、機能リスト、非目標などを含む。

### ステップ 2：Tech ステージの実行

**なぜ**

AI アシスタントを使用して Tech Agent を実行し、技術アーキテクチャとデータモデルを自動生成します。

**操作**

```bash
# Claude Code を使用して tech ステージを実行
factory run tech
```

**確認すべき内容**：

```
✓ 現在のステージ: tech
✓ PRD ドキュメントの読み込み: artifacts/prd/prd.md
✓ Tech Agent の起動

Tech Agent が技術アーキテクチャを設計中...

[AI アシスタントが以下の操作を実行します]
1. PRD を分析し、エンティティと機能を抽出
2. 技術スタックを選択（Node.js + Express + Prisma）
3. データモデルを設計（User、Post などのエンティティ）
4. API エンドポイントを定義
5. tech.md と schema.prisma を生成

Agent の完了を待っています...
```

### ステップ 3：生成された技術ドキュメントの確認

**なぜ**

技術ドキュメントが完全かどうかを確認し、設計が適切かどうかを検証します。

**操作**

```bash
# 技術ドキュメントを確認
cat artifacts/tech/tech.md
```

**確認すべき内容**：以下のセクションを含む完全な技術ドキュメント

```markdown
## 技術スタック

**バックエンド**
- ランタイム: Node.js 20+
- 言語: TypeScript 5+
- フレームワーク: Express 4.x
- ORM: Prisma 5.x
- データベース: SQLite (開発) / PostgreSQL (本番)

**フロントエンド**
- フレームワーク: React Native + Expo
- 言語: TypeScript
- ナビゲーション: React Navigation 6
- 状態管理: React Context API
- HTTP クライアント: Axios

## アーキテクチャ設計

**レイヤー構造**
- ルーティング層 (routes/): API エンドポイントを定義
- コントローラー層 (controllers/): リクエストとレスポンスを処理
- サービス層 (services/): ビジネスロジック
- データアクセス層: Prisma ORM

**データフロー**
Client → API Gateway → Controller → Service → Prisma → Database

## API エンドポイント設計

| エンドポイント | メソッド | 説明 | リクエストボディ | レスポンス |
|------|------|------|--------|------|
| /api/items | GET | リストを取得 | - | Item[] |
| /api/items/:id | GET | 詳細を取得 | - | Item |
| /api/items | POST | 作成 | CreateItemDto | Item |
| /api/items/:id | PUT | 更新 | UpdateItemDto | Item |
| /api/items/:id | DELETE | 削除 | - | { deleted: true } |

## データモデル

### User
- id: 主キー
- email: メールアドレス（必須）
- name: 名前（必須）
- createdAt: 作成日時
- updatedAt: 更新日時

**リレーション**:
- posts: 一対多（ユーザーが複数の記事を持つ）

## 環境変数

**バックエンド (.env)**
- PORT: サービスポート（デフォルト 3000）
- DATABASE_URL: データベース接続文字列
- NODE_ENV: 環境 (development/production)
- CORS_ORIGINS: 許可されたクロスオリジン

**フロントエンド (.env)**
- EXPO_PUBLIC_API_URL: バックエンド API アドレス

## 将来の拡張ポイント

**短期 (v1.1)**
- ページネーションとフィルタリングを追加
- データエクスポート機能を実装

**中期 (v2.0)**
- PostgreSQL への移行
- ユーザー認証を追加

**長期**
- マイクロサービスに分割
- キャッシュ層を追加 (Redis)
```

### ステップ 4：生成された Prisma Schema の確認

**なぜ**

データモデルが PRD に準拠しているか、SQLite 互換性制約に従っているかを確認します。

**操作**

```bash
# Prisma Schema を確認
cat artifacts/backend/prisma/schema.prisma
```

**確認すべき内容**：Prisma 5.x 構文に準拠した Schema で、完全なエンティティ定義とリレーションを含む

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "sqlite" // 開発環境
url = "file:./dev.db"
}

model User {
id Int @id @default(autoincrement())
email String @unique
name String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

posts Post[]
}

model Post {
id Int @id @default(autoincrement())
title String
content String
published Boolean @default(false)
authorId Int
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

author User @relation(fields: [authorId], references: [id])
}
```

### ステップ 5：終了条件の検証

**なぜ**

Sisyphus は Tech Agent が終了条件を満たしているか検証し、満たしていない場合は再実行を要求します。

**チェックリスト**

| チェック項目 | 説明 | 合格/不合格 |
| ---- | ---- | ---- |
| 技術スタックが明確に宣言されている | バックエンド、フロントエンド、データベースが明確に定義されている | [ ] |
| データモデルが PRD と一致している | すべてのエンティティが PRD から来ており、追加フィールドがない | [ ] |
| 早すぎる最適化や過度な設計が行われていない | MVP 範囲に準拠し、未検証の機能がない | [ ] |

**失敗した場合**：

```bash
# Tech ステージを再実行
factory run tech
```

## チェックポイント ✅

**完了を確認**：

- [ ] Tech ステージが正常に実行された
- [ ] `artifacts/tech/tech.md` ファイルが存在し、内容が完全である
- [ ] `artifacts/backend/prisma/schema.prisma` ファイルが存在し、構文が正しい
- [ ] 技術スタックの選択が適切である（Node.js + Express + Prisma）
- [ ] データモデルが PRD と一致し、追加フィールドがない
- [ ] Schema が SQLite 互換性制約に従っている（Composite Types なし）

## よくある落とし穴

### ⚠️ 落とし穴 1：過度な設計

**問題**：MVP ステージでマイクロサービス、複雑なキャッシュ、または高度な機能を導入する。

**症状**：`tech.md` に「マイクロサービスアーキテクチャ」「Redis キャッシュ」「メッセージキュー」などが含まれる。

**解決**：Tech Agent には `NEVER` リストがあり、過度な設計を明確に禁止しています。これらの内容が見られた場合は、再実行してください。

```markdown
## やらないこと (NEVER)
* **NEVER** 過度な設計、例：MVP ステージでマイクロサービス、複雑なメッセージキュー、または高性能キャッシュを導入
* **NEVER** 未確定のシナリオのために冗長なコードを作成
```

### ⚠️ 落とし穴 2：SQLite 互換性エラー

**問題**：Prisma Schema が SQLite でサポートされていない機能を使用している。

**症状**：Validation ステージでエラーが発生する、または `npx prisma generate` が失敗する。

**一般的なエラー**：

```prisma
// ❌ エラー - SQLite は Composite Types をサポートしていない
type UserProfile {
identity String
ageRange String
}

model User {
profile UserProfile
}

// ❌ エラー - 7.x バージョンを使用
{
"prisma": "^7.0.0"
}
```

**解決**：Schema を確認し、JSON を String で保存し、Prisma バージョンを 5.x に固定してください。

### ⚠️ 落とし穴 3：データモデルが MVP 範囲を超える

**問題**：Schema が PRD で定義されていないエンティティやフィールドを含む。

**症状**：`tech.md` のエンティティ数が PRD のコアエンティティ数より明らかに多い。

**解決**：Tech Agent の制約「データモデルは MVP 機能に必要なすべてのエンティティとリレーションをカバーする必要があり、未検証のフィールドを事前に追加してはならない」。追加フィールドが見つかった場合は、削除するか「将来の拡張ポイント」としてマークしてください。

### ⚠️ 落とし穴 4：リレーション設計エラー

**問題**：リレーション定義が実際のビジネスロジックに準拠していない。

**症状**：一対多が多対多として書かれている、または必要なリレーションが欠けている。

**エラーの例**：

```prisma
// ❌ エラー - ユーザーと記事は一対多であるべきで、一対一ではない
model User {
id Int @id @default(autoincrement())
post Post? // 一対一リレーション
}

model Post {
id Int @id @default(autoincrement())
author User? // @relation を使用するべき
}
```

**正しい書き方**：

```prisma
// ✅ 正しい - 一対多リレーション
model User {
id Int @id @default(autoincrement())
posts Post[]
}

model Post {
id Int @id @default(autoincrement())
authorId Int
author User @relation(fields: [authorId], references: [id])
}
```

## 本レッスンのまとめ

Tech ステージはパイプラインで「製品要件」と「コード実装」をつなぐ架け橋です。PRD に基づいて自動的に設計します：

- **技術スタック**：Node.js + Express + Prisma（バックエンド）、React Native + Expo（フロントエンド）
- **データモデル**：SQLite 互換性要件に準拠した Prisma Schema
- **アーキテクチャ設計**：レイヤー構造（ルーティング → コントローラー → サービス → データ）
- **API 定義**：RESTful エンドポイントとデータフロー

**重要な原則**：

1. **MVP 優先**：コアに必要な機能のみを設計し、過度な設計を避ける
2. **シンプル優先**：成熟した技術スタックを選択
3. **データ駆動**：明確なデータモデルでエンティティとリレーションを表現
4. **拡張性**：ドキュメントに将来の拡張ポイントをマークするが、事前に実装しない

Tech ステージの完了後、以下が得られます：

- ✅ 完全な技術ソリューションドキュメント（`tech.md`）
- ✅ Prisma 5.x 仕様に準拠したデータモデル（`schema.prisma`）
- ✅ 明確な API 設計と環境設定

## 次のレッスンの予告

> 次のレッスンでは **[Code ステージ：実行可能なコードの生成](../stage-code/)** を学びます。
>
> 学べる内容：
> - Code Agent が UI Schema と Tech 設計に基づいてフロントエンドとバックエンドのコードを生成する方法
> - 生成されたアプリケーションに含まれる機能（テスト、ドキュメント、CI/CD）
> - 生成されたコード品質を検証する方法
> - Code Agent の特殊要件と出力仕様

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの位置を表示</strong></summary>

> 更新日時：2026-01-29

| 機能 | ファイルパス | 行番号 |
| ---- | ---- | ---- |
| Tech Agent 定義 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Tech スキルガイド | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Pipeline 設定 | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| SQLite 互換性制約 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**重要な制約**：
- **Composite Types の使用禁止**：SQLite はサポートしていないため、JSON を String で保存する必要がある
- **Prisma バージョン固定**：5.x を使用する必要があり、7.x は使用しない
- **MVP 範囲**：データモデルは MVP 機能に必要なすべてのエンティティをカバーする必要があり、未検証のフィールドを事前に追加してはならない

**技術スタック決定原則**：
- コミュニティが活発でドキュメントが充実している言語とフレームワークを優先して選択
- MVP ステージでは軽量なデータベース（SQLite）を選択し、後期に PostgreSQL に移行可能
- システムレイヤーはルーティング層→ビジネスロジック層→データアクセス層に従う

**やらないこと (NEVER)**：
- NEVER 過度な設計、例：MVP ステージでマイクロサービス、複雑なメッセージキュー、または高性能キャッシュを導入
- NEVER マイナーまたはメンテナンスされていない技術を選択
- NEVER 製品検証を通過していないフィールドやリレーションをデータモデルに追加
- NEVER 技術ドキュメントに具体的なコード実装を含める

</details>
