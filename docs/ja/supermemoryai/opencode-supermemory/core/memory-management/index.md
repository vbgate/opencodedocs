---
title: "記憶管理: スコープとライフサイクル | opencode-supermemory"
sidebarTitle: "記憶管理"
subtitle: "記憶スコープとライフサイクル：デジタルブレインを管理する"
description: "記憶スコープの仕組みを学び、User と Project の違いを理解して、CRUD 操作でクロスプロジェクト経験の再利用を実現します。"
tags:
  - "memory-management"
  - "scope"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# 記憶スコープとライフサイクル：デジタルブレインを管理する

## この章で学べること

- **スコープを区別する**：どの記憶が「あなたと一緒に移動する」（クロスプロジェクト）ものか、「プロジェクトと一緒に移動する」（プロジェクト専用）ものかを理解します。
- **記憶を管理する**：記憶を手動で確認、追加、削除する方法を学び、Agent の認知を整理しておきます。
- **Agent をデバッグする**：Agent が「間違った」ものを覚えている場合、どこを修正すべきかを知ります。

## 基本的な考え方

opencode-supermemory は記憶を 2 つの分離された **スコープ (Scope)** に分けます。これはプログラミング言語のグローバル変数とローカル変数に似ています。

### 1. 2 種類のスコープ

| スコープ | 識別子 (Scope ID) | ライフサイクル | 典型的な用途 |
| :--- | :--- | :--- | :--- |
| **User Scope**<br>(ユーザースコープ) | `user` | **常にあなたと共に**<br>すべてのプロジェクトで共有 | • コーディングスタイルの好み（例：「TypeScript を好む」）<br>• 個人的な習慣（例：「常にコメントを書く」）<br>• 一般的な知識 |
| **Project Scope**<br>(プロジェクトスコープ) | `project` | **現在のプロジェクトのみ**<br>ディレクトリを切り替えると無効になる | • プロジェクトのアーキテクチャ設計<br>• ビジネスロジックの説明<br>• 特定の Bug の修正方案 |

::: info スコープはどのように生成されるのですか？
プラグインは `src/services/tags.ts` を通じて一意のタグを自動的に生成します：
- **User Scope**: Git メールアドレスのハッシュに基づいて生成されます (`opencode_user_{hash}`)。
- **Project Scope**: 現在のプロジェクトパスのハッシュに基づいて生成されます (`opencode_project_{hash}`)。
:::

### 2. 記憶のライフサイクル

1. **作成 (Add)**: CLI 初期化または Agent 対話 (`Remember this...`) を通じて書き込まれます。
2. **有効化 (Inject)**: 新しいセッションを開始するたびに、プラグインは関連する User と Project 記憶を自動的に取得してコンテキストに注入します。
3. **検索 (Search)**: 会話中に Agent は特定の記憶を能動的に検索できます。
4. **忘却 (Forget)**: 記憶が古くなったり間違っていたりする場合、ID を通じて削除します。

---

## 実践：記憶を管理する

Agent との対話を通じて、これら 2 つのスコープの記憶を手動で管理します。

### ステップ 1：既存の記憶を確認

まず、Agent が現在何を記憶しているかを見てみましょう。

**操作**：OpenCode チャットボックスに以下を入力します：

```text
現在のプロジェクトのすべての記憶をリストアップしてください (List memories in project scope)
```

**期待される出力**：
Agent は `supermemory` ツールの `list` モードを呼び出し、リストを返します：

```json
// 出力例
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "プロジェクトは MVC アーキテクチャを使用し、Service レイヤーはビジネスロジックを担当します",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### ステップ 2：クロスプロジェクト記憶を追加 (User Scope)

**すべて**のプロジェクトで Agent に日本語で返信してほしいと仮定します。これは User Scope に適した記憶です。

**操作**：以下のコマンドを入力します：

```text
私の個人的な好みを覚えておいてください：どのプロジェクトでも、常に日本語で返信してください。
これを User Scope に保存してください。
```

**期待される出力**：
Agent は `add` ツールを呼び出し、パラメータ `scope: "user"` を渡します：

```json
{
  "mode": "add",
  "content": "User prefers responses in Japanese across all projects",
  "scope": "user",
  "type": "preference"
}
```

システムは記憶が追加されたことを確認し、`id` を返します。

### ステップ 3：プロジェクト専用記憶を追加 (Project Scope)

次に、**現在のプロジェクト**に特定のルールを追加します。

**操作**：以下のコマンドを入力します：

```text
覚えておいてください：このプロジェクトでは、すべての日付形式は YYYY-MM-DD である必要があります。
Project Scope に保存してください。
```

**期待される出力**：
Agent は `add` ツールを呼び出し、パラメータ `scope: "project"` を渡します（これはデフォルト値なので、Agent は省略するかもしれません）：

```json
{
  "mode": "add",
  "content": "Date format must be YYYY-MM-DD in this project",
  "scope": "project",
  "type": "project-config"
}
```

### ステップ 4：分離性を確認

スコープが有効であるか確認するために、検索を試みることができます。

**操作**：以下を入力します：

```text
「日付形式」に関する記憶を検索してください
```

**期待される出力**：
Agent は `search` ツールを呼び出します。`scope: "project"` を指定しているか、混合検索を行っている場合、先ほどの記憶が見つかるはずです。

::: tip クロスプロジェクト能力の確認
新しいターミナルウィンドウを開き、別の異なるプロジェクトディレクトリに入り、「日付形式」を尋ねると、Agent はこの記憶を**見つけられない**はずです（元のプロジェクトの Project Scope に分離されているため）。しかし、「どの言語で返信してほしいか」と尋ねると、User Scope から「日本語で返信」の好みを取り出せるはずです。
:::

### ステップ 5：古い記憶を削除

プロジェクトの規約が変更された場合、古い記憶を削除する必要があります。

**操作**：
1. **ステップ 1** を実行して記憶 ID を取得します（例：`mem_987654`）。
2. 以下のコマンドを入力します：

```text
ID が mem_987654 の日付形式に関する記憶を忘れてください。
```

**期待される出力**：
Agent は `forget` ツールを呼び出します：

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

システムは `success: true` を返します。

---

## よくある質問 (FAQ)

### Q: コンピューターを変えた場合、User Scope の記憶は残っていますか？
**A: Git 設定によります。**
User Scope は `git config user.email` に基づいて生成されます。2 台のコンピューターで同じ Git メールアドレスを使用し、同じ Supermemory アカウント（同じ API Key を使用）に接続している場合、記憶は**同期**されます。

### Q: 追加したばかりの記憶が見えないのはなぜですか？
**A: キャッシュまたはインデックスの遅延の可能性があります。**
Supermemory のベクトルインデックスは通常秒単位ですが、ネットワークの不安定さにより一時的な遅延が発生する場合があります。また、Agent がセッションの開始時に注入するコンテキストは**静的**（スナップショット）であるため、新しく追加された記憶はセッションを再起動（`/clear` または OpenCode の再起動）しないと「自動注入」で有効にならない場合がありますが、`search` ツールを通じてすぐに見つけることができます。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| :--- | :--- | :--- |
| Scope 生成ロジック | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| 記憶ツールの定義 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| 記憶タイプの定義 | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| クライアントの実装 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**重要な関数**：
- `getUserTag()`: Git メールアドレスに基づいてユーザータグを生成
- `getProjectTag()`: ディレクトリパスに基づいてプロジェクトタグを生成
- `supermemoryClient.addMemory()`: 記憶の追加 API 呼び出し
- `supermemoryClient.deleteMemory()`: 記憶の削除 API 呼び出し

</details>

## 次の章の予告

> 次の章では **[先制圧縮の原理](../../advanced/compaction/index.md)** を学びます。
>
> 以下のことができるようになります：
> - なぜ Agent が「記憶を忘れる」のか（コンテキストオーバーフロー）
> - プラグインが Token 使用率を自動的に検出する方法
> - 重要な情報を失わずにセッションを圧縮する方法
