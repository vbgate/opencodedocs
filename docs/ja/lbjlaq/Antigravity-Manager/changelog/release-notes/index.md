---
title: "リリースノート: バージョン進化 | Antigravity-Manager"
sidebarTitle: "3 分でバージョン更新を理解"
subtitle: "バージョン進化：README 内蔵 Changelog を基準とする"
description: "Antigravity-Manager のバージョン進化方法を理解します。Settings ページでバージョンを確認して更新をチェックし、README Changelog で修正とリマインダーを確認し、/healthz でアップグレード後の可用性を検証します。"
tags:
  - "changelog"
  - "release"
  - "upgrade"
  - "troubleshooting"
prerequisite:
  - "start-installation"
  - "start-proxy-and-first-client"
order: 1
---

# バージョン進化：README 内蔵 Changelog を基準とする

Antigravity Tools をアップグレードする準備をしている場合、最も恐れているのは「更新されていないこと」ではなく、「更新してから互換性の変更に気づくこと」です。このページでは **Antigravity Tools Changelog（バージョン進化）** の読み方を明確にし、アップグレード前に判断できるようにします：今回の更新があなたにどのような影響を与えるか。

## 学べること

- Settings の About ページで現在のバージョンを素早く確認し、更新をチェックしてダウンロードエントリを取得する
- README の Changelog で自分に影響のあるバージョン段落のみを読む（最初から最後まで読むのではなく）
- アップグレード前に一つのことを行う：設定/モデルマッピングを手動で変更する必要があるというリマインダーがあるかどうかを確認する
- アップグレード後に最小検証（`/healthz`）を一度実行し、プロキシがまだ使用できることを確認する

## Changelog とは何か？

**Changelog** はバージョン別に「今回何が変更されたか」を記録したリストです。Antigravity Tools はこれを README の「バージョン進化」に直接記述し、各バージョンで日付と重要な変更を明記します。アップグレード前に Changelog を確認すると、互換性の変更や回帰問題に遭遇する可能性を減らすことができます。

## このページをいつ使用するか

- 旧バージョンから新バージョンにアップグレードする準備をしており、リスクポイントを事前に確認したい場合
- 特定の問題（例：429/0 Token/Cloudflared）に遭遇し、最近のバージョンで修正されたかどうかを確認したい場合
- チームで統一バージョンを維持しており、同僚に「バージョン別に変更を確認する」方法を提供する必要がある場合

## 🎒 開始前の準備

::: warning アップグレードパスを事前に準備することをおすすめします
インストール/アップグレードの方法は多数あります（brew、Releases 手動ダウンロード、アプリ内更新）。まだ自分がどの方法を使用するか決めていない場合は、**[インストールとアップグレード：デスクトップ版のベストインストールパス（brew / releases）](/ja/lbjlaq/Antigravity-Manager/start/installation/)** を確認してください。
:::

## やってみよう

### ステップ 1：About ページで現在のバージョンを確認する

**なぜ**
Changelog はバージョン別に整理されています。現在のバージョンを最初に知ることで、「どこから読み始めるべきか」がわかります。

操作パス：**Settings** → **About**。

**表示されるべきもの**：ページタイトルエリアにアプリ名とバージョン番号が表示されます（例：`v3.3.49`）。

### ステップ 2：「更新をチェック」をクリックし、最新バージョンとダウンロードエントリを取得する

**なぜ**
まず「最新バージョン番号は何か」を知る必要があり、それから Changelog で中間のスキップされたバージョン段落を選び出すことができます。

About ページで「更新をチェック」をクリックします。

**表示されるべきもの**：
- 更新がある場合：「new version available」が提示され、ダウンロードボタン（`download_url` を開く）が表示されます
- すでに最新の場合：「latest version」が提示されます

### ステップ 3：README の Changelog でスキップしたバージョンのみを確認する

**なぜ**
あなたは「現在のバージョンから最新バージョンまでの間」の変更のみに気にする必要があり、他の履歴バージョンはとりあえずスキップできます。

README を開き、**「バージョン進化 (Changelog)」** に移動し、最新バージョンから見始め、現在のバージョンが見えるまで下にスクロールします。

**表示されるべきもの**：バージョンは `vX.Y.Z (YYYY-MM-DD)` の形式でリストされ、各バージョンにはグループ化された説明（例：コア修正/機能強化）があります。

### ステップ 4：アップグレード後に最小検証を一度行う

**なぜ**
アップグレード後の最初の作業は「複雑なシナリオを実行する」ことではなく、プロキシが正常に起動し、クライアントが生きていることを確認することです。

**[ローカルリバースプロキシの起動と最初のクライアント接続（/healthz + SDK 設定）](/ja/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)** のフローに従い、少なくとも一度 `GET /healthz` を検証します。

**表示されるべきもの**：`/healthz` が成功を返す（サービスが使用可能であることを確認するために使用されます）。

## 最近のバージョンの要約（README から抜粋）

| バージョン | 日付 | 気にするべき点 |
| --- | --- | --- |
| `v3.3.49` | 2026-01-22 | 思考中断と 0 Token 防御；`gemini-2.5-flash-lite` を削除し、カスタムマッピングを手動で置換するようリマインダー；言語/テーマなどの設定が即時反映される；監視ダッシュボードの強化；OAuth 互換性の向上 |
| `v3.3.48` | 2026-01-21 | Windows プラットフォームでバックグラウンドプロセスをサイレント実行（コンソールの点滅を修正） |
| `v3.3.47` | 2026-01-21 | 画像生成パラメータマッピングの強化（`size`/`quality`）；Cloudflared トンネルのサポート；マージ競合による起動失敗の修正；3 層漸進的コンテキスト圧縮 |

::: tip 「今回の更新が自分に影響するかどうか」を素早く判断する方法
まずこの 2 種類の文章を探してください：

- **ユーザーリマインダー/あなたが変更する必要がある**：例えば、特定のデフォルトモデルが削除され、カスタムマッピングを手動で調整する必要があることが明示的に名指しされている
- **コア修正/互換性修正**：例：0 Token、429、Windows 点滅、起動失敗など「あなたが使用できなくなる」問題
:::

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新時間：2026-01-23

| 内容 | ファイルパス | 行番号 |
| --- | --- | --- |
| README 内蔵 Changelog（バージョン進化） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L324-L455) | 324-455 |
| About ページにバージョン番号と「更新をチェック」ボタンを表示 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L821-L954) | 821-954 |
| About ページ「更新をチェック」コマンドの返却構造 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L187-L215) | 187-215 |
| 自動更新通知（ダウンロードして再起動） | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L33-L96) | 33-96 |
| 現在のバージョン番号（ビルドメタデータ） | [`package.json`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/package.json#L1-L4) | 1-4 |

</details>
