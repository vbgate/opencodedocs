---
title: "Copilot認証: OAuthとPAT設定方法 | opencode-mystatus"
sidebarTitle: "Copilot認証"
subtitle: "Copilot認証設定：OAuth TokenとFine-grained PAT"
description: "GitHub Copilotの2つの認証方式（OAuth TokenとFine-grained PAT）の設定方法を学びます。権限問題の解決とクォータクエリを実現します。"
tags:
  - "GitHub Copilot"
  - "OAuth認証"
  - "PAT設定"
  - "権限問題"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Copilot認証設定：OAuth TokenとFine-grained PAT

## 学習後のスキル

- Copilotの2つの認証方式：OAuth TokenとFine-grained PATを理解
- OAuth Token権限不足の問題を解決
- Fine-grained PATを作成してサブスクリプションタイプを設定
- Copilot Premium Requestsクォータを順調にクエリ

## 核心概念

mystatusは**2つのCopilot認証方式**をサポートします：

| 認証方式 | 説明 | 利点 | 欠点 |
|--- | --- | --- | ---|
| **OAuth Token**（デフォルト） | OpenCodeログイン時に取得されるGitHub OAuth Token | 追加設定不要、即座に使用可能 | 新版OpenCodeのOAuth TokenにはCopilot権限がない場合がある |
| **Fine-grained PAT**（推奨） | ユーザーが手動作成したFine-grained Personal Access Token | 安定で信頼性高く、OAuth権限に依存しない | 手動で一度設定が必要 |

**優先順位ルール**：
1. mystatusはFine-grained PATを優先使用（設定されている場合）
2. PATが設定されていない場合のみ、OAuth Tokenにフォールバック

## 実践

### ステップ1：Fine-grained PATが設定されているか確認

```bash
ls -la ~/.config/opencode/copilot-quota-token.json
```

### ステップ2：Fine-grained PATを作成（未設定の場合）

1. https://github.com/settings/tokens?type=beta にアクセス
2. "Generate new token"をクリック
3. **Account permissions**で、**Plan**を**Read-only**に設定
4. Tokenを生成

### ステップ3：設定ファイルを作成

`~/.config/opencode/copilot-quota-token.json` を作成：

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

**tierフィールドの説明**：
- `free`：Copilot Free（50回/月）
- `pro`：Copilot Pro（300回/月）
- `pro+`：Copilot Pro+（1500回/月）
- `business`：Copilot Business（300回/月）
- `enterprise`：Copilot Enterprise（1000回/月）

## まとめ

mystatusは2つのCopilot認証方式をサポート：

1. **OAuth Token**（デフォルト）：自動取得、ただし権限問題がある可能性
2. **Fine-grained PAT**（推奨）：手動設定、安定で信頼性高い

推奨されるFine-grained PATの設定手順：
1. GitHub SettingsでFine-grained PATを作成
2. "Plan: Read"権限を設定
3. GitHubユーザー名とサブスクリプションタイプを記録
4. `~/.config/opencode/copilot-quota-token.json` 設定ファイルを作成
5. 設定を検証

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Copilot認証戦略エントリ | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
|--- | --- | ---|

</details>
