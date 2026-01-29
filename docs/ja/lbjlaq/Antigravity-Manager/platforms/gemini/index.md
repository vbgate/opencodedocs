---
title: "Gemini API: ローカルゲートウェイ接続 | Antigravity-Manager"
subtitle: "Gemini API 接続：Google SDK をローカルゲートウェイに直接接続"
sidebarTitle: "ローカル Gemini に直接接続"
description: "Antigravity-Manager の Gemini ローカルゲートウェイ接続を学習します。/v1beta/models エンドポイントを使用して、generateContent と streamGenerateContent 呼び出しをマスターし、cURL と Python で検証します。"
tags:
  - "Gemini"
  - "Google SDK"
  - "API Proxy"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 3
---

# Gemini API 接続：Google SDK をローカルゲートウェイに直接接続

## 学習後、できること

- Antigravity Tools が公開する Gemini ネイティブエンドポイント（`/v1beta/models/*`）を使用してクライアントを接続する
- Google スタイルの `:generateContent` / `:streamGenerateContent` パスを使用してローカルゲートウェイを呼び出す
- Proxy 認証を有効にした場合、`x-goog-api-key` が直接使用できる理由を理解する

## 現在の課題

ローカルリバースプロキシは既に実行しましたが、Gemini に行き詰まります：

- Google SDK はデフォルトで `generativelanguage.googleapis.com` を叩き、自分の `http://127.0.0.1:<port>` にどう変更すればよいか不明
- Gemini のパスにはコロンが含まれ（`models/<model>:generateContent`）、多くのクライアントが連結すると 404 になる
- プロキシ認証を有効にしたが、Google クライアントは `x-api-key` を送信しないため、常に 401 になる

## いつこの手法を使うか

- 「Gemini ネイティブプロトコル」を使用したい場合、OpenAI/Anthropic 互換層ではない
- 手元に Google/サードパーティの Gemini スタイルクライアントがあり、最小コストでローカルゲートウェイに移行したい場合

## 🎒 始める前の準備

::: warning 前提条件
- アプリに少なくとも1つのアカウントを追加済み（そうしないとバックエンドが上流 access token を取得できない）
- ローカルリバースプロキシサービスを起動済み、リスニングポートを知っている（デフォルトは `8045`）
:::

## コアな考え方

Antigravity Tools はローカル Axum サーバー上で Gemini ネイティブパスを公開しています：

- リスト：`GET /v1beta/models`
- 呼び出し：`POST /v1beta/models/<model>:generateContent`
- ストリーミング：`POST /v1beta/models/<model>:streamGenerateContent`

バックエンドは Gemini ネイティブリクエストボディを v1internal 構造でラップし（`project`、`requestId`、`requestType` などを注入）、Google の v1internal 上流エンドポイントに転送します（アカウント access token を添付）。（ソースコード：`src-tauri/src/proxy/mappers/gemini/wrapper.rs`、`src-tauri/src/proxy/upstream/client.rs`）

::: info なぜチュートリアルの base URL は 127.0.0.1 を推奨するのか？
アプリのクイック統合例では 127.0.0.1 を推奨として固定しています。理由は「一部環境の IPv6 解析遅延問題を回避するため」。（ソースコード：`src/pages/ApiProxy.tsx`）
:::

## 実践してみましょう

### ステップ1：ゲートウェイがオンラインであることを確認する（/healthz）

**なぜ**
まずサービスがオンラインであることを確認し、その後でプロトコル/認証問題をトラブルシューティングすると時間を節約できます。

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**次のように見えるはずです**：JSON が返され、`{"status":"ok"}` が含まれる（ソースコード：`src-tauri/src/proxy/server.rs`）。

### ステップ2：Gemini モデルを一覧表示する（/v1beta/models）

**なぜ**
まず「外部に公開されるモデル ID」が何かを確認する必要があり、後の `<model>` はこれに依存します。

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**次のように見えるはずです**：レスポンスに `models` 配列が含まれ、各要素の `name` は `models/<id>` のような形式です（ソースコード：`src-tauri/src/proxy/handlers/gemini.rs`）。

::: tip 重要
モデル ID にどのフィールドを使用するか？
- ✅ `displayName` フィールドを使用する（例：`gemini-2.0-flash`）
- ✅ または `name` フィールドから `models/` プレフィックスを削除
- ❌ `name` フィールドの完全な値を直接コピーしない（パスエラーになる）

`name` フィールドをコピーした場合（例：`models/gemini-2.0-flash`）をモデル ID として使用すると、リクエストパスが `/v1beta/models/models/gemini-2.0-flash:generateContent` になり、これは間違っています。（ソースコード：`src-tauri/src/proxy/common/model_mapping.rs`）
:::

::: warning 重要
現在の `/v1beta/models` は「ローカル動的モデルリストを Gemini models リストに偽装して返す」実装で、上流からリアルタイムで取得するものではありません。（ソースコード：`src-tauri/src/proxy/handlers/gemini.rs`）
:::

### ステップ3：generateContent を呼び出す（コロンを含むパス）

**なぜ**
Gemini ネイティブ REST API の要点は `:generateContent` のような「コロンを含む action」です。バックエンドは同じルートで `model:method` を解析します。（ソースコード：`src-tauri/src/proxy/handlers/gemini.rs`）

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "こんにちは"}]}
    ]
  }'
```

**次のように見えるはずです**：レスポンス JSON に `candidates` が含まれる（または外層に `response.candidates` があり、プロキシはアンラップする）。

### ステップ4：streamGenerateContent を呼び出す（SSE）

**なぜ**
ストリーミングは「長い出力/大モデル」でより安定しています。プロキシは上流 SSE をクライアントに転送し、`Content-Type: text/event-stream` を設定します。（ソースコード：`src-tauri/src/proxy/handlers/gemini.rs`）

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "短い話を教えて"}]}
    ]
  }'
```

**次のように見えるはずです**：ターミナルが継続的に `data: {...}` 形式の SSE 行を出力し、正常な場合は最後に `data: [DONE]` が表示されます（ストリーム終了を示す）。

::: tip 注意
`data: [DONE]` は SSE の標準終了マークですが、**必ずしも表示されません**：
- 上流が正常に終了し `[DONE]` を送信した場合、プロキシはそれを転送します
- 上流が異常切断、タイムアウト、または他の終了信号を送信した場合、プロキシは `[DONE]` を補送しません

クライアントコードは SSE 標準に従って処理する必要があります：`data: [DONE]` または接続切断が発生したら、ストリーム終了とみなします。（ソースコード：`src-tauri/src/proxy/handlers/gemini.rs`）
:::

### ステップ5：Python Google SDK を使用してローカルゲートウェイに直接接続する

**なぜ**
これはプロジェクト UI で提供される「クイック統合」例パスです：Google Generative AI Python パッケージを使用して `api_endpoint` をローカルリバースプロキシアドレスに向ける。（ソースコード：`src/pages/ApiProxy.tsx`）

```python
#インストールが必要: pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("こんにちは")
print(response.text)
```

**次のように見えるはずです**：プログラムがモデル返信テキストを出力します。

## チェックポイント ✅

- `/healthz` が `{"status":"ok"}` を返す
- `/v1beta/models` がモデルを一覧表示できる（少なくとも1つ）
- `:generateContent` が `candidates` を返す
- `:streamGenerateContent` が `Content-Type: text/event-stream` を返し、継続的に出力できる

## よくある落とし穴

- **401 がずっと通らない**：認証を有効にしたが、`proxy.api_key` が空の場合、バックエンドはリクエストを直接拒否します。（ソースコード：`src-tauri/src/proxy/middleware/auth.rs`）
- **Header にどの key を持たせるか**：プロキシは `Authorization`、`x-api-key`、`x-goog-api-key` を同時に認識します。したがって、「Google スタイルクライアントが `x-goog-api-key` のみを送信する」でも通過できます。（ソースコード：`src-tauri/src/proxy/middleware/auth.rs`）
- **countTokens 結果が常に 0**：現在の `POST /v1beta/models/<model>/countTokens` は固定 `{"totalTokens":0}` を返し、プレースホルダー実装です。（ソースコード：`src-tauri/src/proxy/handlers/gemini.rs`）

## この授業のまとめ

- 接続するのは `/v1beta/models/*` であり、`/v1/*` ではない
- 重要なパスの書き方は `models/<modelId>:generateContent` / `:streamGenerateContent`
- 認証を有効にした場合、`x-goog-api-key` はプロキシが明確にサポートするリクエストヘッダー

## 次の授業の予告

> 次の授業では、**[Imagen 3 画像生成：OpenAI Images パラメータ size/quality の自動マッピング](../imagen/)** を学習します。

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Gemini ルーティング登録（/v1beta/models/*） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| モデル ID 解析とルーティング（なぜ `models/` プレフィックスがルーティングエラーになるか） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| `model:method` 解析 + generate/stream メインロジック | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| SSE 出力ロジック（`[DONE]` を転送し、自動補送しない） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| `/v1beta/models` 返り構造（動的モデルリスト偽装） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| `countTokens` プレースホルダー実装（固定 0） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
|--- | --- | ---|
| Google SDK Python 例（`api_endpoint` をローカルゲートウェイに向ける） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Gemini セッションフィンガープリント（スティッキ/キャッシュ用 session_id） | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Gemini リクエスト v1internal ラッピング（project/requestId/requestType などを注入） | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| 上流 v1internal エンドポイントと fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**重要な定数**：
- `MAX_RETRY_ATTEMPTS = 3`：Gemini リクエスト最大ローテーション回数上限（ソースコード：`src-tauri/src/proxy/handlers/gemini.rs`）

</details>
