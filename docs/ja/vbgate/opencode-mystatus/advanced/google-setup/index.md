---
title: "Google Cloud設定: 複数アカウント管理 | opencode-mystatus"
sidebarTitle: "Google Cloud"
subtitle: "Google Cloud高度な設定：複数アカウントとモデル管理"
description: "Google Cloud Antigravityの複数アカウント設定・管理方法を学びます。4つのモデルのマッピング関係とクォータクエリ方法を理解できます。"
tags:
  - "Google Cloud"
  - "複数アカウント管理"
  - "Antigravity"
  - "モデルマッピング"
prerequisite:
  - "start-quick-start"
order: 1
---

# Google Cloud高度な設定：複数アカウントとモデル管理

## 学習後のスキル

複数のGoogle Cloud Antigravityアカウントを設定し、すべてのアカウントのクォータ使用状況を一括確認し、4つのモデルのマッピング関係（G3 Pro、G3 Image、G3 Flash、Claude）を理解します。

## コア概念

### 複数アカウントサポート

opencode-mystatusは同時に複数のGoogle Cloud Antigravityアカウントをクエリできます。各アカウントは独立して4つのモデルのクォータを表示し、複数プロジェクトのクォータ割り当てを管理するのに便利です。

### モデルマッピング関係

| 表示名 | モデルKey（メイン） | モデルKey（サブ） |
|--- | --- | ---|
| G3 Pro | `gemini-3-pro-high` | `gemini-3-pro-low` |
| G3 Image | `gemini-3-pro-image` | - |
| G3 Flash | `gemini-3-flash` | - |
| Claude | `claude-opus-4-5-thinking` | `claude-opus-4-5` |

## 実践

### ステップ1：最初のGoogle Cloudアカウントを追加

`opencode-antigravity-auth` プラグインを使用してアカウントを追加します。

### ステップ2：Google Cloudクォータをクエリ

```bash
/mystatus
```

### ステップ3：2つ目のGoogle Cloudアカウントを追加

同様の手順で別のGoogleアカウントでログインします。

## よくある落とし穴

### アカウントが表示されない

**原因**：アカウントにemailフィールドがない。

**解決方法**：`antigravity-accounts.json` で各アカウントに `email` フィールドがあることを確認。

### Project IDがない

**原因**：アカウント設定に `projectId` も `managedProjectId` もない。

**解決方法**：アカウント追加時にProject IDを設定する。

## まとめ

- `opencode-antigravity-auth` プラグインのインストールはGoogle Cloudクォータクエリの前提
- 複数アカウントの同時クエリをサポートし、各アカウントは4つのモデルのクォータを表示
- モデルマッピング：G3 Pro（high/lowサポート）、G3 Image、G3 Flash、Claude（thinking/normal）

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| モデル設定マッピング | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 69-78 |
| 複数アカウント並列クエリ | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 327-334 |

</details>
