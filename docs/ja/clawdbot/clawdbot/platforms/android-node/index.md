---
title: "Android ノード：デバイスローカル操作設定 | Clawdbot チュートリアル"
sidebarTitle: "AI でスマホを操作する"
subtitle: "Android ノード：デバイスローカル操作設定 | Clawdbot チュートリアル"
description: "Android ノードを設定してデバイスローカル操作（Camera、Canvas、Screen）を実行する方法を学びます。本チュートリアルでは、Android ノードの接続フロー、ペアリングメカニズム、使用可能なコマンドについて解説します。"
tags:
  - "Android"
  - "ノード"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Android ノード：デバイスローカル操作設定

## 学習目標

- Android デバイスを Gateway に接続し、ノードとしてデバイスローカル操作を実行する
- AI アシスタントを通じて Android デバイスのカメラで写真や動画を撮影する
- Canvas 可視化インターフェースを使用して Android 上でリアルタイムコンテンツを表示する
- 画面録画、位置情報取得、SMS 送信機能を管理する

## 現在の課題

AI アシスタントが Android デバイスにアクセスできるようにしたい——写真の撮影、動画の録画、Canvas インターフェースの表示——が、Gateway にデバイスを安全に接続する方法がわかりません。

Android アプリを直接インストールしても Gateway を検出できない場合があり、設定後にペアリングが失敗することもあります。明確な接続フローが必要です。

## いつ使うか

- **デバイスローカル操作が必要な場合**：AI アシスタントを通じて Android デバイスでローカル操作（写真撮影、動画録画、画面録画）を実行したい
- **ネットワーク間アクセス**：Android デバイスと Gateway が異なるネットワークにあり、Tailscale 経由で接続する必要がある
- **Canvas 可視化**：Android 上で AI が生成したリアルタイム HTML/CSS/JS インターフェースを表示したい

## 🎒 開始前の準備

::: warning 前提条件

開始する前に、以下を確認してください：

- ✅ **Gateway がインストールされ実行中**：macOS、Linux、または Windows (WSL2) で Gateway を実行
- ✅ **Android デバイスが使用可能**：Android 8.0+ デバイスまたはエミュレータ
- ✅ **ネットワーク接続が正常**：Android デバイスが Gateway の WebSocket ポート（デフォルト 18789）にアクセスできる
- ✅ **CLI が使用可能**：Gateway ホストで `clawdbot` コマンドを使用できる

:::

## 基本概念

**Android ノード**は companion app（コンパニオンアプリ）であり、WebSocket 経由で Gateway に接続し、AI アシスタントが使用できるデバイスローカル操作の機能を公開します。

### アーキテクチャ概要

```
Android デバイス（ノードアプリ）
        ↓
    WebSocket 接続
        ↓
    Gateway（制御プレーン）
        ↓
    AI アシスタント + ツール呼び出し
```

**重要なポイント**：
- Android は Gateway を**ホストしません**、実行中の Gateway にノードとして接続するだけです
- すべてのコマンドは Gateway の `node.invoke` メソッド経由で Android ノードにルーティングされます
- ノードはペアリング（pairing）を行う必要があります

### サポートされる機能

Android ノードは以下のデバイスローカル操作をサポートします：

| 機能 | コマンド | 説明 |
| ---- | ------ | ---- |
| **Canvas** | `canvas.*` | リアルタイム可視化インターフェースを表示（A2UI） |
| **Camera** | `camera.*` | 写真撮影（JPG）と動画録画（MP4） |
| **Screen** | `screen.*` | 画面録画 |
| **Location** | `location.*` | GPS 位置情報を取得 |
| **SMS** | `sms.*` | SMS 送信 |

::: tip フォアグラウンド制限

すべてのデバイスローカル操作（Canvas、Camera、Screen）は、Android アプリが**フォアグラウンドで実行中**である必要があります。バックグラウンドでの呼び出しは `NODE_BACKGROUND_UNAVAILABLE` エラーを返します。

:::

## 手順

### ステップ 1：Gateway を起動

**理由**
Android ノードは動作中の Gateway に接続する必要があります。Gateway は WebSocket 制御プレーンとペアリングサービスを提供します。

```bash
clawdbot gateway --port 18789 --verbose
```

**表示されるべきもの**：
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Tailscale モード（推奨）

Gateway と Android デバイスが異なるネットワークにあるが Tailscale 経由で接続されている場合、Gateway を tailnet IP にバインドします：

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

Gateway を再起動すると、Android ノードは Wide-Area Bonjour 経由で検出できるようになります。

:::

### ステップ 2：検出を確認（オプション）

**理由**
Gateway の Bonjour/mDNS サービスが正常に動作していることを確認し、Android アプリが検出できるようにします。

Gateway ホストで以下を実行：

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**表示されるべきもの**：
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

同様の出力が表示されれば、Gateway は検出サービスをアドバタイズしています。

::: details Bonjour の問題のデバッグ

検出に失敗する場合の考えられる原因：

- **mDNS がブロックされている**：一部の Wi-Fi ネットワークは mDNS を無効にしています
- **ファイアウォール**：UDP ポート 5353 をブロックしている
- **ネットワーク分離**：デバイスが異なる VLAN またはサブネットにある

解決策：Tailscale + Wide-Area Bonjour を使用するか、手動で Gateway アドレスを設定します。

:::

### ステップ 3：Android から接続

**理由**
Android アプリは mDNS/NSD 経由で Gateway を検出し、WebSocket 接続を確立します。

Android アプリで：

1. **設定**（Settings）を開く
2. **Discovered Gateways** で Gateway を選択
3. **Connect** をタップ

**mDNS がブロックされている場合**：
- **Advanced → Manual Gateway** に移動
- Gateway の**ホスト名とポート**を入力（例：`192.168.1.100:18789`）
- **Connect (Manual)** をタップ

::: tip 自動再接続

初回のペアリングが成功すると、Android アプリは起動時に自動的に再接続します：
- 手動エンドポイントが有効な場合は手動エンドポイントを使用
- そうでない場合、最後に検出された Gateway を使用（ベストエフォート）

:::

**チェックポイント ✅**
- Android アプリが "Connected" 状態を表示
- アプリが Gateway の表示名を表示
- アプリがペアリング状態（Pending または Paired）を表示

### ステップ 4：ペアリングを承認（CLI）

**理由**
Gateway はノードのペアリングリクエストを承認し、アクセス権限を付与する必要があります。

Gateway ホストで：

```bash
# 保留中のペアリングリクエストを表示
clawdbot nodes pending

# ペアリングを承認
clawdbot nodes approve <requestId>
```

::: details ペアリングフロー

Gateway-owned pairing ワークフロー：

1. Android ノードが Gateway に接続し、ペアリングを要求
2. Gateway が **pending request** を保存し、`node.pair.requested` イベントを発行
3. CLI 経由でリクエストを承認または拒否
4. 承認後、Gateway が新しい **auth token** を発行
5. Android ノードが token を使用して再接続し、"paired" 状態になる

Pending リクエストは **5 分**後に自動的に期限切れになります。

:::

**表示されるべきもの**：
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

Android アプリは自動的に再接続し、"Paired" 状態を表示します。

### ステップ 5：ノードが接続されていることを確認

**理由**
Android ノードが正常にペアリングされ、Gateway に接続されていることを確認します。

CLI 経由で確認：

```bash
clawdbot nodes status
```

**表示されるべきもの**：
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

または Gateway API 経由：

```bash
clawdbot gateway call node.list --params '{}'
```

### ステップ 6：Camera 機能をテスト

**理由**
Android ノードの Camera コマンドが正常に動作し、権限が付与されていることを確認します。

CLI 経由で写真撮影をテスト：

```bash
# 写真を撮影（デフォルト：フロントカメラ）
clawdbot nodes camera snap --node "android-node"

# バックカメラを指定
clawdbot nodes camera snap --node "android-node" --facing back

# 動画を録画（3秒）
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**表示されるべきもの**：
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Camera 権限

Android ノードには以下の実行時権限が必要です：

- **CAMERA**：`camera.snap` および `camera.clip` に使用
- **RECORD_AUDIO**：`camera.clip` に使用（`includeAudio=true` の場合）

Camera コマンドを初めて呼び出すとき、アプリは権限の付与を求めます。拒否された場合、コマンドは `CAMERA_PERMISSION_REQUIRED` または `AUDIO_PERMISSION_REQUIRED` エラーを返します。

:::

### ステップ 7：Canvas 機能をテスト

**理由**
Canvas 可視化インターフェースが Android デバイスで表示できることを確認します。

::: info Canvas Host

Canvas は HTML/CSS/JS コンテンツを提供する HTTP サーバーが必要です。Gateway はデフォルトでポート 18793 で Canvas Host を実行します。

:::

Gateway ホストで Canvas ファイルを作成：

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

Android アプリで Canvas に移動：

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**表示されるべきもの**：
Android アプリに "Hello from AI!" ページが表示されます。

::: tip Tailscale 環境

Android デバイスと Gateway の両方が Tailscale ネットワークにある場合、`.local` の代わりに MagicDNS 名または tailnet IP を使用します：

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### ステップ 8：Screen と Location 機能をテスト

**理由**
画面録画と位置情報取得機能が正常に動作することを確認します。

画面録画：

```bash
# 10秒間画面を録画
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**表示されるべきもの**：
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

位置情報取得：

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**表示されるべきもの**：
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning 権限要件

画面録画には Android の **RECORD_AUDIO** 権限（オーディオが有効な場合）とフォアグラウンドアクセスが必要です。位置情報取得には **LOCATION** 権限が必要です。

初回の呼び出し時に、アプリは権限の付与を求めます。

:::

## よくある問題

### 問題 1：Gateway を検出できない

**症状**：Android アプリで Gateway が表示されない

**考えられる原因**：
- Gateway が起動していない、または loopback にバインドされている
- mDNS がネットワークでブロックされている
- ファイアウォールが UDP ポート 5353 をブロックしている

**解決策**：
1. Gateway が実行中か確認：`clawdbot nodes status`
2. 手動の Gateway アドレスを使用：Android アプリで Gateway IP とポートを入力
3. Tailscale + Wide-Area Bonjour を設定（推奨）

### 問題 2：ペアリング後に接続に失敗

**症状**："Paired" と表示されるが接続できない

**考えられる原因**：
- Token が期限切れ（ペアリングごとに token はローテーションされます）
- Gateway が再起動したがノードが再接続していない
- ネットワークが変更された

**解決策**：
1. Android アプリで手動で "Reconnect" をタップ
2. Gateway ログを確認：`bonjour: client disconnected ...`
3. ペアリングし直す：ノードを削除して再承認

### 問題 3：Camera コマンドが権限エラーを返す

**症状**：`camera.snap` が `CAMERA_PERMISSION_REQUIRED` を返す

**考えられる原因**：
- ユーザーが権限を拒否した
- 権限がシステムポリシーによって無効になっている

**解決策**：
1. Android 設定で "Clawdbot" アプリを見つける
2. "Permissions" に移動
3. Camera と Microphone 権限を付与
4. Camera コマンドを再試行

### 問題 4：バックグラウンド呼び出しが失敗

**症状**：バックグラウンド呼び出しが `NODE_BACKGROUND_UNAVAILABLE` を返す

**原因**：Android ノードはフォアグラウンドでのデバイスローカルコマンドのみを許可します

**解決策**：
1. アプリがフォアグラウンドで実行中であることを確認（アプリを開く）
2. アプリがシステムによって最適化されているか確認（バッテリー最適化）
3. "省電モード" のアプリ制限をオフにする

## まとめ

このレッスンでは、デバイスローカル操作を実行するために Android ノードを設定する方法について学びました：

- **接続フロー**：mDNS/NSD または手動設定で Android ノードを Gateway に接続
- **ペアリングメカニズム**：Gateway-owned pairing を使用してノードアクセス権限を承認
- **利用可能な機能**：Camera、Canvas、Screen、Location、SMS
- **CLI ツール**：`clawdbot nodes` コマンドを使用してノードを管理し機能を呼び出す
- **権限要件**：Android アプリには Camera、Audio、Location などの実行時権限が必要

**重要なポイント**：
- Android ノードは companion app であり、Gateway をホストしません
- すべてのデバイスローカル操作にはアプリがフォアグラウンドで実行中である必要があります
- ペアリングリクエストは 5 分後に自動的に期限切れになります
- Tailscale ネットワークの Wide-Area Bonjour 検出をサポート

## 次のレッスン

> 次のレッスンでは **[Canvas 可視化インターフェースと A2UI](../../advanced/canvas/)** について学びます。
>
> 学習内容：
> - Canvas A2UI プッシュメカニズム
> - Canvas 上でリアルタイムコンテンツを表示する方法
> - Canvas コマンドの完全なリスト

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-27

| 機能        | ファイルパス                                                                                    | 行番号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| ノードコマンドポリシー | [`src/gateway/node-command-policy.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| ノードプロトコル Schema | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Android ドキュメント  | [`docs/platforms/android.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/platforms/android.md) | 1-142   |
| ノード CLI  | [`docs/cli/nodes.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/cli/nodes.md) | 1-69    |

**重要な定数**：
- `PLATFORM_DEFAULTS`：各プラットフォームでサポートされるコマンドリストを定義（`node-command-policy.ts:32-58`）
- Android でサポートされるコマンド：Canvas、Camera、Screen、Location、SMS（`node-command-policy.ts:34-40`）

**重要な関数**：
- `resolveNodeCommandAllowlist()`：プラットフォームに基づいて許可されるコマンドリストを解決（`node-command-policy.ts:77-91`）
- `normalizePlatformId()`：プラットフォーム ID を正規化（`node-command-policy.ts:60-75`）

**Android ノードの特徴**：
- クライアント ID：`clawdbot-android`（`gateway/protocol/client-info.ts:9`）
- デバイスファミリー検出：`deviceFamily` フィールドを通じて Android を識別（`node-command-policy.ts:70`）
- Canvas と Camera 機能がデフォルトで有効（`docs/platforms/android.md`）

</details>
