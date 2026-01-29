---
title: "Ultraworkモード：ワンクリックで全機能を有効化 | oh-my-opencode"
sidebarTitle: "ワンクリックで全機能を有効化"
subtitle: "Ultraworkモード：ワンクリックで全機能を有効化"
description: "oh-my-opencodeのUltraworkモードとコア機能を学びます。ultraworkキーワードの使用方法、有効化時の動作変化、並列探索メカニズム、強制完了検証、エージェント連携などについて解説し、すべての高度な機能を素早く有効化する方法を習得します。"
tags:
  - "ultrawork"
  - "バックグラウンドタスク"
  - "エージェント連携"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Ultraworkモード：ワンクリックで全機能を有効化

## この章で学べること

- 一言でoh-my-opencodeのすべての高度な機能を有効化する
- 複数のAIエージェントを本物のチームのように並列で動作させる
- 複数のエージェントとバックグラウンドタスクの手動設定を回避する
- Ultraworkモードの設計哲学とベストプラクティスを理解する

## 現在の課題

開発プロセスで次のような状況に遭遇したことはありませんか？

- **機能が多くて使い方がわからない**：10個の専門エージェント、バックグラウンドタスク、LSPツールがあるが、素早く有効化する方法がわからない
- **手動設定が必要**：複雑なタスクのたびにエージェント、バックグラウンド並列実行などの設定を手動で指定する必要がある
- **エージェント連携が非効率**：エージェントをシリアルに呼び出し、時間とコストを浪費している
- **タスクが途中で停滞する**：エージェントにタスクを完了させる十分な動機と制約がない

これらがoh-my-opencodeの真の威力を発揮するのを妨げています。

## コアコンセプト

**Ultraworkモード**はoh-my-opencodeの「ワンクリック全員有効化」メカニズムです。

::: info Ultraworkモードとは？
Ultraworkモードはキーワードでトリガーされる特別な動作モードです。プロンプトに`ultrawork`または省略形の`ulw`を含めると、システムは自動的にすべての高度な機能を有効化します：並列バックグラウンドタスク、深層探索、強制完了、マルチエージェント連携など。
:::

### 設計哲学

Ultraworkモードは次のコア原則に基づいています（[Ultrawork Manifesto](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)から）：

| 原則 | 説明 |
|------|------|
| **人間の介入は失敗のシグナル** | AIの出力を絶えず修正する必要がある場合、システム設計に問題があることを示している |
| **区別できないコード** | AIが書いたコードはシニアエンジニアが書いたコードと区別がつかないべきである |
| **認知的負荷の最小化** | あなたは「何をするか」を言うだけでよく、エージェントが「どう実装するか」を担当する |
| **予測可能、継続的、委譲可能** | エージェントはコンパイラのように安定して信頼できるべきである |

### 有効化メカニズム

システムが`ultrawork`または`ulw`キーワードを検出すると：

1. **最大精度モードを設定**：`message.variant = "max"`
2. **Toast通知を表示**："Ultrawork Mode Activated - Maximum precision engaged. All agents at your disposal."
3. **完全な指令を注入**：エージェントに200行以上のULTRAWORK指令を注入します。これには以下が含まれます：
   - 実装を開始する前に100%の確実性を強制する
   - バックグラウンドタスクの並列使用を要求する
   - Category + Skillsシステムの使用を強制する
   - 強制完了検証（TDDワークフロー）
   - 「できない」という言い訳を一切禁止する

## 実践してみよう

### ステップ1：Ultraworkモードをトリガーする

OpenCodeで`ultrawork`または`ulw`キーワードを含むプロンプトを入力します：

```
ultrawork REST APIを開発する
```

またはより簡潔に：

```
ulw ユーザー認証を追加する
```

**確認できること**：
- インターフェースにToast通知が表示される："Ultrawork Mode Activated"
- エージェントの応答が "ULTRAWORK MODE ENABLED!" で始まる

### ステップ2：エージェントの動作変化を観察する

Ultraworkモードが有効化されると、エージェントは次のようになります：

1. **コードベースを並列探索**
   ```
   delegate_task(agent="explore", prompt="既存のAPIパターンを検索", background=true)
   delegate_task(agent="explore", prompt="テストインフラストラクチャを検索", background=true)
   delegate_task(agent="librarian", prompt="認証のベストプラクティスを検索", background=true)
   ```

2. **Planエージェントを呼び出して作業計画を作成**
   ```
   delegate_task(subagent_type="plan", prompt="収集したコンテキストに基づいて詳細な計画を作成")
   ```

3. **Category + Skillsを使用してタスクを実行**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**確認できること**：
- 複数のバックグラウンドタスクが同時に実行されている
- エージェントが能動的に専門エージェント（Oracle、Librarian、Explore）を呼び出している
- 完全なテスト計画と作業分解
- タスクが100%完了するまで継続的に実行される

### ステップ3：タスク完了を検証する

エージェントが完了すると次のようになります：

1. **検証の証拠を提示**：実際にテストを実行した出力、手動検証の説明
2. **すべてのTODOが完了したことを確認**：事前に完了を宣言しない
3. **作業内容を要約**：何をしたか、なぜそうしたかをリストアップ

**確認できること**：
- 明確なテスト結果（「たぶんできる」ではなく）
- すべての問題が解決されている
- 未完了のTODOリストがない

## チェックポイント ✅

上記の手順を完了したら、次のことを確認します：

- [ ] `ulw`を入力した後にToast通知が表示される
- [ ] エージェントの応答が "ULTRAWORK MODE ENABLED!" で始まる
- [ ] 並列バックグラウンドタスクが実行されているのを観察できる
- [ ] エージェントがCategory + Skillsシステムを使用している
- [ ] タスク完了後に検証の証拠がある

いずれかの項目が通らない場合、次のことを確認します：
- キーワードが正しくスペルされているか（`ultrawork`または`ulw`）
- メインセッション内で実行しているか（バックグラウンドタスクはモードをトリガーしない）
- 設定ファイルで関連機能が有効になっているか

## いつ使うべきか

| シナリオ | Ultraworkを使用 | 通常モード |
|------|--------------|---------|
| **複雑な新機能** | ✅ 推奨（マルチエージェント連携が必要） | ❌ 効率が不十分な可能性がある |
| **緊急修正** | ✅ 推奨（迅速な診断と探索が必要） | ❌ コンテキストを見落とす可能性がある |
| **単純な修正** | ❌ 過剰（リソースの浪費） | ✅ 適している |
| **アイデアの迅速な検証** | ❌ 過剰 | ✅ 適している |

**経験則**：
- タスクが複数のモジュールまたはシステムに関わる → `ulw`を使用
- コードベースを深く調査する必要がある → `ulw`を使用
- 複数の専門エージェントを呼び出す必要がある → `ulw`を使用
- 単一ファイルの小さな変更 → `ulw`は不要

## 注意点

::: warning 注意事項

**1. すべてのプロンプトで`ulw`を使用しないでください**

Ultraworkモードは大量の指令を注入するため、単純なタスクには過剰設計です。本当にマルチエージェント連携、並列探索、深層分析が必要な複雑なタスクにのみ使用してください。

**2. バックグラウンドタスクはUltraworkモードをトリガーしません**

キーワード検出器はバックグラウンドセッションをスキップし、モードが子エージェントに誤って注入されるのを防ぎます。Ultraworkモードはメインセッションでのみ有効です。

**3. Provider設定が正しいことを確認してください**

Ultraworkモードは複数のAIモデルが並列で動作することに依存しています。一部のProviderが設定されていないか利用できない場合、エージェントは専門エージェントを呼び出せない可能性があります。
:::

## この章のまとめ

Ultraworkモードはキーワードでトリガーされ、「一言で全機能を有効化」という設計目標を実現しています：

- **シンプルで使いやすい**：`ulw`を入力するだけで有効化
- **自動連携**：エージェントが自動的に他のエージェントを呼び出し、バックグラウンドタスクを並列実行
- **強制完了**：完全な検証メカニズムにより100%の完了を保証
- **設定不要**：エージェントの優先度、並列制限などの手動設定は不要

覚えておいてください：Ultraworkモードはエージェントを本物のチームのように動作させるためのもので、あなたは意図を表現するだけでよく、エージェントが実行を担当します。

## 次の章の予告

> 次の章では **[Provider設定](../../platforms/provider-setup/)** を学びます。
>
> 学べること：
> - Anthropic、OpenAI、Googleなど複数のProviderを設定する方法
> - マルチモデル戦略が自動的にダウングレードし、最適なモデルを選択する仕組み
> - Provider接続とクォータ使用をテストする方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-26

| 機能 | ファイルパス | 行番号 |
|------|---------|------|
| Ultrawork設計哲学 | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| キーワード検出器Hook | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| ULTRAWORK指令テンプレート | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| キーワード検出ロジック | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**主要な定数**：
- `KEYWORD_DETECTORS`：キーワード検出器設定。ultrawork、search、analyzeの3つのモードを含む
- `CODE_BLOCK_PATTERN`：コードブロックの正規表現。コードブロック内のキーワードをフィルタリングするために使用
- `INLINE_CODE_PATTERN`：インラインコードの正規表現。インラインコード内のキーワードをフィルタリングするために使用

**主要な関数**：
- `createKeywordDetectorHook()`：キーワード検出器Hookを作成し、UserPromptSubmitイベントを監視
- `detectKeywordsWithType()`：テキスト内のキーワードを検出し、タイプ（ultrawork/search/analyze）を返す
- `getUltraworkMessage()`：Ultraworkモードの完全な指令を生成（エージェントタイプに基づいてPlannerまたは通常モードを選択）
- `removeCodeBlocks()`：テキストからコードブロックを削除し、コードブロック内でキーワードが誤ってトリガーされるのを防ぐ

**ビジネスルール**：
| ルールID | ルール説明 | マーク |
|---------|----------|------|
| BR-4.8.4-1 | "ultrawork"または"ulw"が検出されるとUltraworkモードを有効化 | 【事実】 |
| BR-4.8.4-2 | Ultraworkモードは`message.variant = "max"`を設定 | 【事実】 |
| BR-4.8.4-3 | UltraworkモードはToast通知を表示："Ultrawork Mode Activated" | 【事実】 |
| BR-4.8.4-4 | バックグラウンドタスクセッションはキーワード検出をスキップし、モードの注入を回避 | 【事実】 |
| BR-4.8.4-5 | 非メインセッションではultraworkキーワードのみを許可し、他のモードの注入をブロック | 【事実】 |

</details>
