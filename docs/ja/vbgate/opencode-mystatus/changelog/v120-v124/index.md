---
title: "v1.2.0-v1.2.4: Copilotサポート追加 | opencode-mystatus"
sidebarTitle: "v1.2.0-v1.2.4"
subtitle: "v1.2.0-v1.2.4: Copilotサポート追加"
description: "opencode-mystatus v1.2.0からv1.2.4の更新内容を学びます。GitHub Copilotクォータクエリ機能の追加、インストール手順の改善を含みます。"
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4：Copilotサポート追加とドキュメント改善

## バージョン概要

今回の更新（v1.2.0 - v1.2.4）はopencode-mystatusに重要な機能拡張をもたらしました。最も顕著なのは**GitHub Copilotのクォータクエリサポートの新規追加**です。同時にインストールドキュメントを改善し、コードのlintエラーを修正しました。

**主な変更**：
- ✅ GitHub Copilot Premium Requestsクエリの新規追加
- ✅ GitHub内部APIの統合
- ✅ 日本語・英語ドキュメントの更新
- ✅ インストール手順の改善、バージョン制限の削除
- ✅ コードlintエラーの修正

---

## [1.2.2] - 2026-01-14

### ドキュメント改善

- **インストール手順の更新**：`README.md` と `README.zh-CN.md` でバージョン制限を削除
- **自動アップデートサポート**：ユーザーは手動でバージョン番号を修正することなく、最新バージョンを自動的に受け取れるようになりました

---

## [1.2.1] - 2026-01-14

### バグ修正

- **lintエラーの修正**：`copilot.ts` で使用されない `maskString` インポートを削除

---

## [1.2.0] - 2026-01-14

### 新機能

#### GitHub Copilotサポート

今回の更新の核心機能：

- **Copilotクォータクエリの新規追加**：GitHub Copilot Premium Requestsの使用状況をクエリする機能をサポート
- **GitHub内部APIの統合**：`copilot.ts` モジュールを新規追加し、GitHub APIを通じてクォータデータを取得
- **ドキュメントの更新**：`README.md` と `README.zh-CN.md` にCopilot関連ドキュメントを追加

**サポートされる認証方式**：
1. **Fine-grained PAT**（推奨）：ユーザーが作成したFine-grained Personal Access Token
2. **OAuth Token**：OpenCode OAuth Token（Copilot権限が必要）

**クエリ内容**：
- Premium Requests総量と使用済み量
- 各モデルの使用詳細
- サブスクリプションタイプの識別（free、pro、pro+、business、enterprise）

---

## アップグレードガイド

### 自動アップグレード（推奨）

v1.2.2でインストール手順を更新し、バージョン制限を削除したため、以下ができます：

```bash
# 最新タグを使用してインストール
opencode plugin install vbgate/opencode-mystatus@latest
```

### 手動アップグレード

古いバージョンを既にインストールしている場合、直接更新できます：

```bash
# 古いバージョンをアンインストール
opencode plugin uninstall vbgate/opencode-mystatus

# 新しいバージョンをインストール
opencode plugin install vbgate/opencode-mystatus@latest
```

---

## 完全な変更ログ

すべてのバージョンの変更を確認するには、[GitHub Releases](https://github.com/vbgate/opencode-mystatus/releases) を参照してください。

