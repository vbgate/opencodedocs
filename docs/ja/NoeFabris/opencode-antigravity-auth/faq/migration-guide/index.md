---
title: "アカウント移行: デバイス間の設定 | Antigravity Auth"
sidebarTitle: "新しいコンピュータに移行"
subtitle: "アカウント移行: マシン間設定とバージョンアップ"
description: "macOS/Linux/Windows間でAntigravity Authアカウントファイルを移行する方法、ストレージ形式の自動アップグレードメカニズム、移行後の認証問題の解決方法を学びます。"
tags:
  - "移行"
  - "マシン間"
  - "バージョンアップ"
  - "アカウント管理"
prerequisite:
  - "quick-install"
order: 2
---

# アカウント移行: マシン間設定とバージョンアップ

## 学習後にできること

- ✅ アカウントを1台のマシンから別のマシンに移行する
- ✅ ストレージ形式のバージョン変更を理解する（v1/v2/v3）
- ✅ 移行後の認証問題を解決する（invalid_grant エラー）
- ✅ 複数のデバイスで同じアカウントを共有する

## 現在の問題状況

新しいコンピュータを購入し、そこで Antigravity Auth を使って Claude と Gemini 3 にアクセスする必要がありますが、OAuth 認証フローを最初からやり直したくありません。または、プラグインバージョンをアップグレードした後、元のアカウントデータが使用できなくなりました。

## この方法を使用するタイミング

- 📦 **新しいデバイスへの切り替え**: 古いコンピュータから新しいコンピュータへの移行
- 🔄 **マルチデバイス同期**: デスクトップとノートブック間でアカウントを共有
- 🆙 **バージョンアップ**: プラグインアップグレード後のストレージ形式の変更
- 💾 **バックアップ復元**: アカウントデータの定期的なバックアップ

## 核心的な考え方

**アカウント移行**は、アカウントファイル（antigravity-accounts.json）を1台のマシンから別のマシンにコピーするプロセスです。プラグインはストレージ形式のバージョンアップを自動的に処理します。

### 移行メカニズムの概要

ストレージ形式はバージョン管理されており（現在はv3）、プラグインは**自動的にバージョン移行を処理**します：

| バージョン | 主な変更点 | 現在の状態 |
| --- | --- | ---|
| v1 → v2 | レート制限状態の構造化 | ✅ 自動移行 |
| v2 → v3 | デュアルクォータプールのサポート（gemini-antigravity/gemini-cli） | ✅ 自動移行 |

ストレージファイルの場所（クロスプラットフォーム）：

| プラットフォーム | パス |
| --- | ---|
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip セキュリティリマインダー
アカウントファイルには OAuth refresh token が含まれており、**これはパスワードと同等**です。転送時は暗号化された方法（SFTP、暗号化ZIPなど）を使用してください。
:::

## 🎒 開始前の準備

- [ ] ターゲットマシンに OpenCode がインストールされている
- [ ] ターゲットマシンに Antigravity Auth プラグインがインストールされている：`opencode plugin add opencode-antigravity-auth@beta`
- [ ] 両マシン間でファイルを安全に転送できる（SSH、USBメモリなど）

## 手順

### ステップ 1：ソースマシンでアカウントファイルを見つける

**理由**
アカウント情報を含む JSON ファイルを特定する必要があります。

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**期待される結果**：ファイルが存在し、以下のような内容が含まれていること：

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

ファイルが存在しない場合、アカウントがまだ追加されていないため、`opencode auth login` を実行してください。

### ステップ 2：アカウントファイルをターゲットマシンにコピー

**理由**
アカウント情報（refresh token と Project ID）を新しいデバイスに転送します。

::: code-group

```bash [macOS/Linux]
# 方法 1: scp を使用（SSH経由）
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# 方法 2: USBメモリを使用
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# 方法 1: PowerShell Copy-Item を使用（SMB経由）
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# 方法 2: USBメモリを使用
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**期待される結果**：ファイルがターゲットマシンの一時ディレクトリ（例：/tmp/ または Downloads/）に正常にコピーされる。

### ステップ 3：ターゲットマシンでプラグインをインストール

**理由**
ターゲットマシンのプラグインバージョンが互換性があることを確認します。

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**期待される結果**：プラグインが正常にインストールされたことを示すメッセージが表示される。

### ステップ 4：ファイルを正しい場所に配置

**理由**
プラグインはアカウントファイルを固定パスでのみ検索します。

::: code-group

```bash [macOS/Linux]
# ディレクトリを作成（存在しない場合）
mkdir -p ~/.config/opencode

# ファイルをコピー
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# 権限を確認
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# ファイルをコピー（ディレクトリは自動作成）
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# 確認
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**期待される結果**：ファイルが設定ディレクトリに存在する。

### ステップ 5：移行結果を確認

**理由**
アカウントが正しくロードされたことを確認します。

```bash
# アカウントをリスト（プラグインがアカウントファイルをロードすることをトリガー）
opencode auth login

# アカウントが既にある場合、以下が表示される：
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

`Ctrl+C` を押して終了します（新しいアカウントを追加する必要はありません）。

**期待される結果**：プラグインがアカウントリストを正常に識別し、移行したアカウントのメールアドレスを含む。

### ステップ 6：最初のリクエストをテスト

**理由**
refresh token が依然として有効であることを検証します。

```bash
# OpenCode でテストリクエストを開始
# 選択：google/antigravity-gemini-3-flash
```

**期待される結果**：モデルが正常に応答する。

## チェックポイント ✅

- [ ] ターゲットマシンが移行したアカウントをリストできる
- [ ] テストリクエストが成功した（認証エラーなし）
- [ ] プラグインログにエラーメッセージがない

## トラブルシューティング

### 問題 1: "API key missing" エラー

**現象**：移行後、リクエストで `API key missing` エラーが発生する。

**原因**：refresh token が期限切れになっているか、Google によって無効化された可能性がある（パスワード変更、セキュリティイベントなど）。

**解決策**：

```bash
# アカウントファイルをクリアし、再認証
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### 問題 2: プラグインバージョンの互換性

**現象**：移行後、アカウントファイルがロードできず、ログに `Unknown storage version` と表示される。

**原因**：ターゲットマシンのプラグインバージョンが古すぎて、現在のストレージ形式をサポートしていない。

**解決策**：

```bash
# 最新バージョンにアップグレード
opencode plugin add opencode-antigravity-auth@latest

# 再テスト
opencode auth login
```

### 問題 3: デュアルクォータプールデータの消失

**現象**：移行後、Gemini モデルが1つのクォータプールのみを使用し、自動的に fallback しない。

**原因**：移行時に `antigravity-accounts.json` のみをコピーしたが、設定ファイル `antigravity.json` は移行されていない。

**解決策**：

設定ファイルも同時にコピーする（`quota_fallback` が有効な場合）：

::: code-group

```bash [macOS/Linux]
# 設定ファイルをコピー
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# 設定ファイルをコピー
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### 問題 4: ファイル権限エラー

**現象**：macOS/Linux で `Permission denied` と表示される。

**原因**：ファイル権限が正しくなく、プラグインが読み取れない。

**解決策**：

```bash
# 権限を修復
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## ストレージ形式自動移行の詳細

プラグインは、アカウントをロードするときに自動的にストレージバージョンを検出し、移行します：

```
v1 (旧バージョン)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (現在のバージョン)
```

**移行ルール**：
- v1 → v2: `rateLimitResetTime` を `claude` と `gemini` の2つのフィールドに分割
- v2 → v3: `gemini` を `gemini-antigravity` と `gemini-cli` に分割（デュアルクォータプールをサポート）
- 自動クリーンアップ: 期限切れのレート制限時間はフィルタリングされる（`> Date.now()`）

::: info 自動重複排除
アカウントをロードする際、プラグインはメールアドレスに基づいて自動的に重複を排除し、最新のアカウントを保持します（`lastUsed` と `addedAt` でソート）。
:::

## レッスンのサマリー

アカウントを移行するためのコアステップ：

1. **ファイルの特定**: ソースマシンで `antigravity-accounts.json` を見つける
2. **コピー転送**: ターゲットマシンに安全に転送する
3. **正確な配置**: 設定ディレクトリ（`~/.config/opencode/` または `%APPDATA%\opencode\`）に配置
4. **検証テスト**: `opencode auth login` を実行して認識を確認

プラグインは**ストレージファイル形式のバージョン移行を自動的に処理**するため、手動で修正する必要はありません。ただし、`invalid_grant` エラーが発生した場合は、再認証のみが可能です。

## 次のレッスン予告

> 次のレッスンでは **[ToS 警告](../tos-warning/)** を学習します。
>
> 学習内容：
> - Antigravity Auth の使用に伴う潜在的リスク
> - アカウントのバンを回避する方法
> - Google のサービス条項の制限

---

## 付録: ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-23

| 機能        | ファイルパス                                                                                               | 行番号    |
| --- | --- | ---|
| ストレージ形式定義 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198)         | 128-198 |
| v1→v2 移行 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395)         | 366-395 |
| v2→v3 移行 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431)         | 397-431 |
| アカウントロード（自動移行含む） | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| 設定ディレクトリパス | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213)         | 202-213 |
| ファイル重複排除ロジック | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364)         | 301-364 |

**重要なインターフェース**：

- `AccountStorageV3`（v3 ストレージ形式）：
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3`（アカウントメタデータ）：
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // Google アカウントメール
    refreshToken: string;              // OAuth refresh token（核心）
    projectId?: string;                // GCP プロジェクト ID
    managedProjectId?: string;         // マネージドプロジェクト ID
    addedAt: number;                   // 追加タイムスタンプ
    lastUsed: number;                  // 最終使用時間
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // レート制限リセット時間（v3はデュアルクォータプールをサポート）
    coolingDownUntil?: number;          // クールダウン終了時間
    cooldownReason?: CooldownReason;   // クールダウン理由
  }
  ```

- `RateLimitStateV3`（v3 レート制限状態）：
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Claude クォータリセット時間
    "gemini-antigravity"?: number;    // Gemini Antigravity クォータリセット時間
    "gemini-cli"?: number;            // Gemini CLI クォータリセット時間
  }
  ```

**重要な関数**：
- `loadAccounts()`：アカウントファイルをロードし、バージョンを自動検出して移行する（storage.ts:433）
- `migrateV1ToV2()`：v1 形式を v2 に移行する（storage.ts:366）
- `migrateV2ToV3()`：v2 形式を v3 に移行する（storage.ts:397）
- `deduplicateAccountsByEmail()`：メールアドレスに基づいて重複を排除し、最新のアカウントを保持する（storage.ts:301）
- `getStoragePath()`：クロスプラットフォーム互換のストレージファイルパスを取得する（storage.ts:215）

**移行ロジック**：
- `data.version` フィールドを検出する（storage.ts:446）
- v1：v2 に移行してから v3 に移行する（storage.ts:447-457）
- v2：直接 v3 に移行する（storage.ts:458-468）
- v3：移行は不要、直接ロードする（storage.ts:469-470）
- 自動クリーンアップ：期限切れのレート制限時間（`> Date.now()`）がフィルタリングされる（storage.ts:404-410）

</details>
