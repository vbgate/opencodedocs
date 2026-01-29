---
title: "音声 API: Whisper 互換エンドポイント | Antigravity-Manager"
subtitle: "音声 API: Whisper 互換エンドポイント"
sidebarTitle: "5分で音声をテキストに"
description: "Antigravity-Manager 音声認識 API の使用方法を学習します。6種類のフォーマットサポート、15MB 制限、大きなペイロードの処理方法をマスターし、音声をテキストに迅速に変換します。"
tags:
  - "音声認識"
  - "OpenAI"
  - "Whisper"
  - "Gemini"
  - "API Proxy"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 5
---
# 音声認識：/v1/audio/transcriptions の制限と大きなペイロードの処理

**`POST /v1/audio/transcriptions 音声認識エンドポイント`** を使用して、音声ファイルをテキストに変換できます。OpenAI Whisper API のように見えますが、ローカルゲートウェイでフォーマット検証、ファイルサイズ制限を行い、音声を Gemini の `inlineData` として上流リクエストに送信します。

## 学習後、できること

- curl / OpenAI SDK を使用して `POST /v1/audio/transcriptions` を呼び出し、音声を `{"text":"..."}` に変換する
- サポートされている6種類の音声フォーマットと **15MB のハード制限** の実際のエラー形態を理解する
- `model` / `prompt` のデフォルト値と転送方法を理解する（上流ルールを推測しない）
- Proxy Monitor で音声リクエストを特定し、`[Binary Request Data]` の由来を理解する

## 現在の課題

会議の録音、ポッドキャスト、またはカスタマーサポート通話をテキストに変換したいが、よく次のような点で行き詰まります：

- 異なるツールで音声フォーマット/インターフェースの形状が異なり、スクリプトや SDK を再利用しにくい
- アップロードに失敗すると「悪いリクエスト/ゲートウェイエラー」しか見えず、フォーマットが違うのかファイルが大きすぎるのかわからない
- 認識を Antigravity Tools の「ローカルゲートウェイ」で統一的にスケジュール・監視したいが、どの程度互換しているか不确定

## 🎒 始める前の準備

::: warning 前提条件
- [ローカルリバースプロキシを起動し、最初のクライアントを接続する](/ja/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/) が動作しており、リバースプロキシポートを知っている（このページでは `8045` を例として使用）
- [アカウントを追加](/ja/lbjlaq/Antigravity-Manager/start/add-account/) が動作しており、少なくとも1つの利用可能なアカウントがある
:::

## 音声認識エンドポイント（/v1/audio/transcriptions）とは？

**音声認識エンドポイント** は、Antigravity Tools が公開する OpenAI Whisper 互換ルートです。クライアントは `multipart/form-data` を使用して音声ファイルをアップロードし、サーバーは拡張子とサイズを検証した後、音声を Base64 の `inlineData` に変換して、上流 `generateContent` を呼び出し、最後に `text` フィールドのみを返します。

## エンドポイントと制限の概要

| 項目 | 結論 | コード証拠 |
|--- | --- | ---|
| エントリールート | `POST /v1/audio/transcriptions` | `src-tauri/src/proxy/server.rs` でルートを `handlers::audio::handle_audio_transcription` に登録 |
| サポートフォーマット | ファイル拡張子で認識：`mp3/wav/m4a/ogg/flac/aiff(aif)` | `src-tauri/src/proxy/audio/mod.rs` `detect_mime_type()` |
| ファイルサイズ | **15MB ハード制限**（超過すると 413 + テキストエラーを返す） | `src-tauri/src/proxy/audio/mod.rs` `exceeds_size_limit()`；`src-tauri/src/proxy/handlers/audio.rs` |
| リバースプロキシ全体の body 制限 | Axum レベルで 100MB まで許可 | `src-tauri/src/proxy/server.rs` `DefaultBodyLimit::max(100 * 1024 * 1024)` |
| デフォルトパラメータ | `model="gemini-2.0-flash-exp"`；`prompt="Generate a transcript of the speech."` | `src-tauri/src/proxy/handlers/audio.rs` |

## 実践してみましょう

### ステップ1：ゲートウェイが動作していることを確認する（/healthz）

**なぜ**
ポートが間違っている/サービスが起動していないなどの問題を先に排除します。

::: code-group

```bash [macOS/Linux]
curl -s http://127.0.0.1:8045/healthz
```

```powershell [Windows]
curl http://127.0.0.1:8045/healthz
```

:::

**次のように見えるはずです**：`{"status":"ok"}` のような JSON。

### ステップ2：15MB を超えない音声ファイルを準備する

**なぜ**
サーバーはハンドラーで 15MB 検証を行い、超過すると直接 413 を返します。

::: code-group

```bash [macOS/Linux]
ls -lh audio.mp3
```

```powershell [Windows]
Get-Item audio.mp3 | Select-Object Length
```

:::

**次のように見えるはずです**：ファイルサイズが `15MB` を超えていない。

### ステップ3：curl で /v1/audio/transcriptions を呼び出す

**なぜ**
curl が最も直接的で、プロトコルの形状とエラーメッセージを最初に確認するのに便利です。

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3" \
  -F "model=gemini-2.0-flash-exp" \
  -F "prompt=Generate a transcript of the speech."
```

**次のように見えるはずです**：JSON が返され、`text` フィールドのみが含まれます。

```json
{
  "text": "..."
}
```

### ステップ4：OpenAI Python SDK を使用して呼び出す

```python
from openai import OpenAI

client = OpenAI(
  base_url="http://127.0.0.1:8045/v1",
  api_key="your-proxy-api-key"  # 認証を有効にした場合
)

audio_file = open("audio.mp3", "rb")
transcript = client.audio.transcriptions.create(
  model="gemini-2.0-flash-exp",
  file=audio_file
)

print(transcript.text)
```

**次のように見えるはずです**：`print(transcript.text)` が認識テキストを出力します。

## サポートされている音声フォーマット

Antigravity Tools はファイル拡張子で MIME タイプを決定します（ファイル内容のスニッフィングではありません）。

| フォーマット | MIME タイプ | 拡張子 |
|--- | --- | ---|
| MP3 | `audio/mp3` | `.mp3` |
| WAV | `audio/wav` | `.wav` |
| AAC (M4A) | `audio/aac` | `.m4a` |
| OGG | `audio/ogg` | `.ogg` |
| FLAC | `audio/flac` | `.flac` |
| AIFF | `audio/aiff` | `.aiff`, `.aif` |

::: warning サポートされていないフォーマット
拡張子が表にない場合、`400` が返され、レスポンスボディはテキストで、例：`不支持的音频格式: txt`。
:::

## チェックポイント ✅

- [ ] 返り体が `{"text":"..."}`（`segments`、`verbose_json` などの追加構造なし）
- [ ] レスポンスヘッダに `X-Account-Email` が含まれる（実際に使用されたアカウントをマーク）
- [ ] 「Monitor」ページでこのリクエスト記録を確認できる

## 大きなペイロードの処理：なぜ 100MB が見えても 15MB で止まるのか

サーバーは Axum レベルでリクエスト body の上限を 100MB に設定しています（一部の大きなリクエストがフレームワークによって直接拒否されるのを防ぐため）。しかし、音声認識ハンドラーは追加で **15MB 検証** を行います。

つまり：

- `15MB < ファイル <= 100MB`：リクエストはハンドラーに入りますが、`413` + テキストエラーが返されます
- `ファイル > 100MB`：リクエストはフレームワークレベルで直接失敗する可能性があります（具体的なエラー形態は保証されません）

### 15MB を超えた場合に見えるもの

ステータスコード `413 Payload Too Large` が返され、レスポンスボディはテキスト（JSON ではありません）で、内容は次のようになります：

```
音频文件过大 (18.5 MB)。最大支持 15 MB (约 16 分钟 MP3)。建议: 1) 压缩音频质量 2) 分段上传
```

### 2つの実行可能な分割方法

1) 音声品質を圧縮する（WAV をより小さな MP3 に変換）

```bash
ffmpeg -i input.wav -b:a 64k -ac 1 output.mp3
```

2) 分割する（長い音声を複数のセグメントにカット）

```bash
ffmpeg -i long_audio.mp3 -f segment -segment_time 600 -c copy segment_%03d.mp3
```

## ログ収集の注意点

### なぜ Monitor で実際のリクエストボディがよく見えないのか

Monitor ミドルウェアは **POST リクエストボディ** を先に読み出してログ記録します：

- リクエストボディが UTF-8 テキストとして解析できる場合は、元のテキストを記録
- それ以外の場合は `[Binary Request Data]` と記録

音声認識は `multipart/form-data` を使用し、バイナリ音声内容が含まれるため、2番目の場合になりやすいです。

### Monitor で見えるはずのもの

```
URL: /v1/audio/transcriptions
Request Body: [Binary Request Data]
Response Body: {"text":"..."}
```

::: info ログ制限の説明
ログに音声本体は見えませんが、`status/duration/X-Account-Email` を使用して、プロトコル互換性、ファイルサイズが大きすぎる、上流失敗のどれかを迅速に判断できます。
:::

## パラメータ説明（「経験的補完」をしない）

このエンドポイントは明示的に3つのフォームフィールドのみを読み取ります：

| フィールド | 必須 | デフォルト値 | 処理方法 |
|--- | --- | --- | ---|
| `file` | ✅ | なし | 必須提供；欠落すると `400` + テキスト `缺少音频文件` を返す |
| `model` | ❌ | `gemini-2.0-flash-exp` | 文字列として転送し、トークン取得に参加（具体的な上流ルールは実際のレスポンスに依存） |
| `prompt` | ❌ | `Generate a transcript of the speech.` | 最初の `text` として上流に送信し、認識をガイドする |

## よくある落とし穴

### ❌ エラー1：curl パラメータを間違え、multipart にならない

```bash
#エラー：-d を直接使用
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -d "file=@audio.mp3"
```

正しい方法：

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@audio.mp3"
```

### ❌ エラー2：ファイル拡張子がサポートリストにない

```bash
curl -sS -X POST http://127.0.0.1:8045/v1/audio/transcriptions \
  -F "file=@document.txt"
```

正しい方法：音声ファイル（`.mp3`、`.wav` など）のみをアップロードする。

### ❌ エラー3：413 を「ゲートウェイの故障」と見なす

`413` は通常、15MB 検証がトリガーされたことを示します。圧縮/分割を先に行う方が、盲目的に再試行するより早いです。

## この授業のまとめ

- **コアエンドポイント**：`POST /v1/audio/transcriptions`（Whisper 互換形状）
- **フォーマットサポート**：mp3、wav、m4a、ogg、flac、aiff（aif）
- **サイズ制限**：15MB（超過すると `413` + テキストエラーを返す）
- **ログ動作**：multipart にバイナリ内容が含まれる場合、Monitor は `[Binary Request Data]` を表示
- **重要なパラメータ**：`file` / `model` / `prompt`（デフォルト値は上の表を参照）

## 次の授業の予告

> 次の授業では、**[MCP エンドポイント：Web Search/Reader/Vision を呼び出し可能なツールとして公開する](/ja/lbjlaq/Antigravity-Manager/platforms/mcp/)** を学習します。
>
> 学習内容：
> - MCP エンドポイントのルート形状と認証戦略
> - Web Search/Web Reader/Vision が「上流転送」か「内蔵ツール」か
> - どの能力が実験的で、本番で踏まないようにすべきか

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| ルート登録（/v1/audio/transcriptions + body limit） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 音声認識ハンドラー（multipart/15MB/inlineData） | [`src-tauri/src/proxy/handlers/audio.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/audio.rs#L16-L162) | 16-162 |
|--- | --- | ---|
| Monitor ミドルウェア（Binary Request Data） | [`src-tauri/src/proxy/middleware/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/monitor.rs#L13-L337) | 13-337 |

**重要な定数**：
- `MAX_SIZE = 15 * 1024 * 1024`：音声ファイルサイズ制限（15MB）
- `MAX_REQUEST_LOG_SIZE = 100 * 1024 * 1024`：Monitor が POST リクエストボディを読み取る上限（100MB）
- `MAX_RESPONSE_LOG_SIZE = 100 * 1024 * 1024`：Monitor がレスポンスボディを読み取る上限（100MB）

**重要な関数**：
- `handle_audio_transcription()`：multipart を解析、拡張子とサイズを検証、`inlineData` を構築して上流を呼び出す
- `AudioProcessor::detect_mime_type()`：拡張子 -> MIME
- `AudioProcessor::exceeds_size_limit()`：15MB 検証
- `monitor_middleware()`：リクエスト/レスポンスボディを Proxy Monitor に記録（UTF-8 の場合のみ完全に記録）

</details>
