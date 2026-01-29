---
title: "OpenAI Images で Imagen 3 を呼び出す: パラメータマッピング | Antigravity"
sidebarTitle: "OpenAI の習慣で呼び出す"
subtitle: "Imagen 3 画像生成：OpenAI Images パラメータ size/quality 自動マッピング"
description: "OpenAI Images API を使用して Imagen 3 を呼び出す方法を学習します。パラメータマッピングをマスターします。size(幅x高さ)で比率を制御し、qualityで画質を制御し、b64_json と url 返却をサポートします。"
tags:
  - "Imagen 3"
  - "OpenAI Images API"
  - "画像生成"
  - "Gemini"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-security"
duration: 12
order: 4
---

# Imagen 3 画像生成：OpenAI Images パラメータ size/quality 自動マッピング

OpenAI Images API の習慣を使用して Imagen 3 を呼び出したいですか？Antigravity Tools のローカルリバースプロキシは `/v1/images/generations` を提供し、`size` / `quality` を Imagen 3 に必要な画像比率と解像度設定に自動的にマッピングします。

## 学習後、できること

- `POST /v1/images/generations` を使用して Imagen 3 画像を生成し、既存の OpenAI クライアント/SDK の呼び出し習慣を変更しない
- `size: "WIDTHxHEIGHT"` を使用して `aspectRatio`（16:9、9:16 など）を安定して制御する
- `quality: "standard" | "medium" | "hd"` を使用して `imageSize`（標準/2K/4K）を制御する
- 返された `b64_json` / `url(data:...)` を理解し、レスポンスヘッダーで実際に使用されたアカウントを確認する

## 現在の課題

次のような状況に遭遇したことがあるかもしれません：

- クライアントが OpenAI の `/v1/images/generations` のみを呼び出すが、使用したいのは Imagen 3
- 同じ prompt でも、時々正方形、時々横の図になり、比率の制御が不安定
- `size` を `16:9` に書いたが、結果は 1:1 のままで（なぜかわからない）

## いつこの手法を使うか

- Antigravity Tools のローカルリバースプロキシを使用しており、「画像生成」も同じゲートウェイ経由に統一したい
- OpenAI Images API をサポートするツール（Cherry Studio、Kilo Code など）を使用して、直接 Imagen 3 画像を生成させたい

## 🎒 始める前の準備

::: warning 前提チェック
この授業では、ローカルリバースプロキシを起動でき、自分の Base URL（例：`http://127.0.0.1:<port>`）を知っていることを前提としています。まだ動作していない場合は、「ローカルリバースプロキシを起動し、最初のクライアントを接続する」を先に完了してください。
:::

::: info 認証リマインダー
`proxy.auth_mode`（例：`strict` / `all_except_health`）を有効にした場合、`/v1/images/generations` を呼び出すときに次を含める必要があります：

- `Authorization: Bearer <proxy.api_key>`
:::

## コアな考え方

### この「自動マッピング」は何をしているのか？

**Imagen 3 の OpenAI Images マッピング** は次を指します：OpenAI Images API に従って `prompt/size/quality` を送信し、プロキシが `size` を標準アスペクト比（例：16:9）に解析し、`quality` を解像度グレード（2K/4K）に解析し、内部リクエスト形式を使用して上流 `gemini-3-pro-image` を呼び出します。

::: info モデル説明
`gemini-3-pro-image` は Google Imagen 3 画像生成のモデル名です（プロジェクト README ドキュメントから）。ソースコードではデフォルトでこのモデルを使用して画像生成を行います。
:::

### 1) size -> aspectRatio（動的計算）

- プロキシは `size` を `WIDTHxHEIGHT` として解析し、アスペクト比に基づいて標準比率にマッチします。
- `size` の解析に失敗した場合（例：`x` で区切られていない、または数値が不正）、`1:1` にフォールバックします。

### 2) quality -> imageSize（解像度グレード）

- `quality: "hd"` -> `imageSize: "4K"`
- `quality: "medium"` -> `imageSize: "2K"`
- `quality: "standard"`（または他の値）-> `imageSize` を設定しない（デフォルトを保持）

### 3) n 複数枚は「n 回同時リクエスト」

この実装は上流の `candidateCount > 1` に依存せず、`n` 回の生成を並列の複数リクエストに分割し、結果をマージして OpenAI スタイルの `data[]` で返します。

## 実践してみましょう

### ステップ1：リバースプロキシが起動していることを確認する（推奨だが必須ではない）

**なぜ**
まず Base URL と認証モードを確認し、後で問題を「画像生成失敗」と誤判断するのを避けます。

::: code-group

```bash [macOS/Linux]
 # チェック（auth_mode=all_except_health 時も認証なしでアクセス可）
curl -sS http://127.0.0.1:PORT/healthz
```

```powershell [Windows]
 # チェック（auth_mode=all_except_health 時も認証なしでアクセス可）
curl.exe -sS http://127.0.0.1:PORT/healthz
```

:::

**次のように見えるはずです**：JSON が返され、`"status": "ok"` が含まれる。

### ステップ2：最小使用可能な画像生成リクエストを発行する

**なぜ**
まず最小フィールドでチェーンを動作させ、その後で比率/画質/数量などのパラメータを重ねます。

::: code-group

```bash [macOS/Linux]
curl -sS http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

```powershell [Windows]
curl.exe -sS http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{
    "model": "gemini-3-pro-image",
    "prompt": "A minimal icon of a rocket, flat design",
    "n": 1,
    "size": "1024x1024",
    "quality": "standard",
    "style": "vivid",
    "response_format": "b64_json"
  }'
```

:::

**次のように見えるはずです**：レスポンス JSON に `data` 配列が含まれ、配列に `b64_json` フィールド（内容は長い）が含まれる。

### ステップ3：使用しているアカウントを確認する（レスポンスヘッダーを確認）

**なぜ**
画像生成もアカウントプールスケジューリングを通過します。トラブルシューティング時、「どのアカウントで生成しているのか」を確認することが重要です。

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:PORT/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" \
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

```powershell [Windows]
curl.exe -i http://127.0.0.1:PORT/v1/images/generations `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_PROXY_API_KEY" `
  -d '{"prompt":"test","n":1,"size":"1024x1024"}'
```

:::

**次のように見えるはずです**：レスポンスヘッダに `X-Account-Email: ...` が含まれる。

### ステップ4：size を使用してアスペクト比を制御する（WIDTHxHEIGHT のみを推奨）

**なぜ**
Imagen 3 上流は標準化された `aspectRatio` を受け取ります。`size` を一般的な幅と高さのセットにするだけで、安定して標準比率にマッピングできます。

| あなたが送る size | プロキシが計算する aspectRatio |
|--- | ---|
| `"1024x1024"` | `1:1` |
| `"1920x1080"` / `"1280x720"` | `16:9` |
| `"1080x1920"` / `"720x1280"` | `9:16` |
| `"800x600"` | `4:3` |
| `"600x800"` | `3:4` |
| `"2560x1080"` | `21:9` |

**次のように見えるはずです**：画像の比率が `size` に応じて変更されます。

### ステップ5：quality を使用して解像度グレードを制御する（standard/medium/hd）

**なぜ**
Imagen 3 の内部フィールドを覚える必要はなく、OpenAI Images の `quality` を使用するだけで解像度グレードを切り替えられます。

| あなたが送る quality | プロキシが書き込む imageSize |
|--- | ---|
| `"standard"` | 設定しない（上流デフォルト） |
| `"medium"` | `"2K"` |
| `"hd"` | `"4K"` |

**次のように見えるはずです**：`hd` の詳細がより豊富（同時に遅く/リソース消費が大きくなるが、これは上流の動作、実際の返り値による）。

### ステップ6：b64_json か url を決める

**なぜ**
この実装では `response_format: "url"` はパブリックからアクセス可能な URL を提供せず、`data:<mime>;base64,...` の Data URI を返します。多くのツールは `b64_json` を直接使用する方が適しています。

| response_format | data[] のフィールド |
|--- | ---|
| `"b64_json"`（デフォルト） | `{ "b64_json": "..." }` |
| `"url"` | `{ "url": "data:image/png;base64,..." }` |

## チェックポイント ✅

- `/v1/images/generations` を使用して少なくとも1枚の画像を返せる（`data.length >= 1`）
- レスポンスヘッダで `X-Account-Email` を確認でき、必要なときに同じアカウント問題を再現できる
- `size` を `1920x1080` に変更すると、画像の比率が横の図（16:9）になる
- `quality` を `hd` に変更すると、プロキシはそれを `imageSize: "4K"` にマッピングする

## よくある落とし穴

### 1) size を 16:9 に書いても 16:9 にならない

ここでの `size` 解析ロジックは `WIDTHxHEIGHT` で分割されます。`size` がこの形式でない場合、直接 `1:1` にフォールバックします。

| 書き方 | 結果 |
|--- | ---|
| ✓ `"1920x1080"` | 16:9 |
| ❌ `"16:9"` | フォールバック 1:1 |

### 2) 認証を有効にしていないが Authorization を持っていても、成功しない

認証は「必須かどうか」の問題です：

- `proxy.auth_mode=off`：Authorization を持っていてもいなくても可
- `proxy.auth_mode=strict/all_except_health`：Authorization を持っていないと拒否される

### 3) n > 1 の場合、「部分成功」が発生する可能性がある

実装は並列リクエストを行い結果をマージします：部分リクエストが失敗しても、部分画像が返される可能性があり、失敗原因がログに記録されます。

## この授業のまとめ

- `/v1/images/generations` を使用して Imagen 3 を呼び出すには、次を覚える：`size` は `WIDTHxHEIGHT`、`quality` は `standard/medium/hd`
- `size` が制御するのは `aspectRatio`、`quality` が制御するのは `imageSize(2K/4K)`
- `response_format=url` が返すのは Data URI で、パブリック URL ではない

## 次の授業の予告

> 次の授業では、**[音声認識：/v1/audio/transcriptions の制限と大きなペイロードの処理](../audio/)** を学習します。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| OpenAI Images ルートを公開 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L123-L146) | 123-146 |
| Images 生成エンドポイント：prompt/size/quality を解析 + OpenAI レスポンスを構築 | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1104-L1333) | 1104-1333 |
|--- | --- | ---|
| OpenAIRequest 宣言 size/quality（プロトコル層互換用） | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L6-L38) | 6-38 |
|--- | --- | ---|

**重要なフィールド（ソースコードから）**：
- `size`：`WIDTHxHEIGHT` として `aspectRatio` に解析
- `quality`：`hd -> 4K`、`medium -> 2K`、他は設定しない

</details>
