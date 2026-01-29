---
title: "ツール詳解: Agent の記憶操作を制御 | opencode-supermemory"
sidebarTitle: "ツールセット"
subtitle: "ツールセット詳解: Agent に記憶を教える"
description: "supermemory の 5 つのコアモード（add, search, profile, list, forget）を学び、自然言語で Agent の記憶を制御する方法を習得します。"
tags:
  - "ツール使用"
  - "記憶管理"
  - "コア機能"
prerequisite:
  - "start-getting-started"
order: 2
---

# ツールセット詳解：Agent に記憶を教える

## この章で学べること

この章では、`supermemory` プラグインのコアインタラクション方法を習得します。Agent は通常記憶を自動的に管理しますが、開発者として、手動で介入する必要がよくあります。

この章を完了すると、以下のことができるようになります：

1. `add` モードを使用して、重要な技術的決定を手動で保存します。
2. `search` モードを使用して、Agent が設定を記憶しているかを確認します。
3. `profile` を使用して、Agent の視点から見た「あなた」を確認します。
4. `list` と `forget` を使用して、古い、または間違った記憶をクリーンアップします。

## 基本的な考え方

opencode-supermemory はブラックボックスではなく、標準の OpenCode Tool プロトコルを通じて Agent と対話します。つまり、関数呼び出しのように呼び出したり、自然言語で Agent に使用を指示したりできます。

プラグインは `supermemory` という名前のツールを Agent に登録します。これはスイスアーミーナイフのように、6 つのモードを持っています：

| モード | 役割 | 典型的なシナリオ |
| :--- | :--- | :--- |
| **add** | 記憶を追加 | "このプロジェクトは Bun で実行する必要があることを覚えておいて" |
| **search** | 記憶を検索 | "認証の処理方法について以前言いましたっけ？" |
| **profile** | ユーザープロファイル | Agent がまとめたコーディング習慣を確認 |
| **list** | 記憶をリストアップ | 最近保存された 10 件の記憶を監査 |
| **forget** | 記憶を削除 | 間違った設定レコードを削除 |
| **help** | 使用ガイド | ツールのヘルプドキュメントを表示 |

::: info 自動トリガーメカニズム
手動呼び出しに加えて、プラグインはチャット内容を監視します。"Remember this" や "Save this" などの自然言語で言うと、プラグインはキーワードを自動的に検出し、`add` ツールを呼び出すように Agent に強制します。
:::

## 実践：手動で記憶を管理する

通常は Agent に自動操作させますが、デバッグや初期記憶の作成時に、手動でツールを呼び出すと非常に便利です。OpenCode のダイアログボックスで、自然言語を使用して直接 Agent にこれらの操作を実行させることができます。

### 1. 記憶を追加 (Add)

最もよく使用される機能です。記憶の内容、タイプ、スコープを指定できます。

**操作**：プロジェクトアーキテクチャに関する記憶を Agent に保存させます。

**入力コマンド**：
```text
supermemory ツールを使用して記憶を保存してください：
内容：「このプロジェクトのすべてのサービス層コードは src/services ディレクトリに配置する必要があります」
タイプ：architecture
範囲：project
```

**Agent の内部動作**（ソースコードロジック）：
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "このプロジェクトのすべてのサービス層コードは src/services ディレクトリに配置する必要があります",
    "type": "architecture",
    "scope": "project"
  }
}
```

**期待される出力**：
Agent は次のような確認情報を返します：
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip 記憶タイプ（Type）の選択
検索をより正確にするために、正確なタイプを使用することをお勧めします：
- `project-config`: 技術スタック、ツールチェーン設定
- `architecture`: アーキテクチャパターン、ディレクトリ構造
- `preference`: 個人的なコーディングの好み（例：「矢印関数を好む」）
- `error-solution`: 特定のエラーの解決策
- `learned-pattern`: Agent が観察したコードパターン
:::

### 2. 記憶を検索 (Search)

Agent が何かを「知っている」かどうか確認したい場合、検索機能を使用できます。

**操作**：「サービス」に関する記憶を検索します。

**入力コマンド**：
```text
supermemory をクエリしてください。キーワードは "services"、範囲は project です
```

**Agent の内部動作**：
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**期待される出力**：
Agent は関連する記憶フラグメントとその類似度（Similarity）をリストアップします。

### 3. ユーザープロファイルを表示 (Profile)

Supermemory は「ユーザープロファイル」を自動的に維持し、長期の好みを含みます。

**操作**：プロファイルを確認します。

**入力コマンド**：
```text
supermemory ツールの profile モードを呼び出し、私についてどの程度知っているか見てください
```

**期待される出力**：
2 種類の情報が返されます：
- **Static**: 静的な事実（例：「ユーザーはフルスタックエンジニア」）
- **Dynamic**: 動的な好み（例：「ユーザーは最近 Rust に注目している」）

### 4. 監査と削除 (List & Forget)

Agent が間違った情報を覚えている場合（例：廃止された API Key）、削除する必要があります。

**ステップ 1：最近の記憶をリスト**
```text
最近の 5 件のプロジェクト記憶をリストアップしてください
```
*(Agent が `mode: "list", limit: 5` を呼び出します)*

**ステップ 2：ID を取得して削除**
間違った記憶 ID が `mem_abc123` だと仮定します。

```text
記憶 ID mem_abc123 のレコードを削除してください
```
*(Agent が `mode: "forget", memoryId: "mem_abc123"` を呼び出します)*

**期待される出力**：
> ✅ Memory mem_abc123 removed from project scope

## 発展：自然言語トリガー

毎回ツールパラメータを詳細に説明する必要はありません。プラグインにはキーワード検出メカニズムが組み込まれています。

**試してみてください**：
会話で直接言ってください：
> **Remember this**: すべての日付処理には date-fns ライブラリを使用し、moment.js の使用は禁止します。

**何が起こりましたか？**
1. プラグインの `chat.message` フックがキーワード "Remember this" を検出しました。
2. プラグインは Agent にシステムプロンプトを注入しました：`[MEMORY TRIGGER DETECTED]`。
3. Agent は命令を受け取りました："You MUST use the supermemory tool with mode: 'add'..."。
4. Agent は自動的に内容を抽出し、ツールを呼び出しました。

これは非常に自然なインタラクション方法で、コーディングプロセス中にいつでも知識を「固定化」できます。

## よくある質問 (FAQ)

**Q: `scope` のデフォルトは何ですか？**
A: デフォルトは `project` です。クロスプロジェクトで有効な好み（例：「TypeScript を常に使用」）を保存したい場合は、`scope: "user"` を明示的に指定してください。

**Q: 追加した記憶がすぐに反映されないのはなぜですか？**
A: `add` 操作は非同期です。通常、Agent はツール呼び出しが成功した直後にこの新しい記憶を「知る」ようになりますが、極端なネットワーク遅延下では数秒かかる場合があります。

**Q: センシティブな情報はアップロードされますか？**
A: プラグインは `<private>` タグ内の内容を自動的に検閲します。しかし、安全のため、パスワードや API Key を記憶に含めないことをお勧めします。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-23

| 機能 | ファイルパス | 行番号 |
| :--- | :--- | :--- |
| ツール定義 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| キーワード検出 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| トリガープロンプト | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| クライアントの実装 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 全文 |

**重要な型定義**：
- `MemoryType`: [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) で定義
- `MemoryScope`: [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) で定義

</details>

## 次の章の予告

> 次の章では **[記憶スコープとライフサイクル](../memory-management/index.md)** を学びます。
>
> 以下のことができるようになります：
> - User Scope と Project Scope の底層分離メカニズム
> - 効率的な記憶パーティション戦略の設計
> - 記憶のライフサイクル管理
