---
title: "更新ログ: バージョン履歴 | Plannotator"
sidebarTitle: "新機能を確認"
subtitle: "更新ログ: バージョン履歴 | Plannotator"
description: "Plannotator のバージョン履歴と新機能を学びます。メジャーアップデート、バグ修正、パフォーマンス改善を確認し、コードレビュー、画像アノテーション、Obsidian 統合などの新機能を把握します。"
tags:
  - "更新ログ"
  - "バージョン履歴"
  - "新機能"
  - "バグ修正"
order: 1
---

# 更新ログ：Plannotator バージョン履歴と新機能

## 学習目標

- ✅ Plannotator のバージョン履歴と新機能を理解する
- ✅ 各バージョンのメジャーアップデートと改善点を把握する
- ✅ バグ修正とパフォーマンス最適化を理解する

---

## 最新バージョン

### v0.6.7 (2026-01-24)

**新機能**：
- **Comment mode**：プラン内で直接コメントを入力できる Comment モードを追加
- **Type-to-comment shortcut**：コメント内容を直接入力するためのショートカットキーを追加

**改善**：
- OpenCode プラグインの sub-agent blocking 問題を修正
- prompt injection セキュリティ脆弱性（CVE）を修正
- OpenCode での agent switching のインテリジェント検出を改善

**ソースコード参照**：
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**修正**：
- OpenCode プラグインの CVE セキュリティ脆弱性を修正
- prompt injection を防ぐための sub-agent blocking 問題を修正
- agent switching のインテリジェント検出ロジックを改善

**ソースコード参照**：
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**改善**：
- **Hook timeout の増加**：長時間実行される AI プランに対応するため、hook timeout をデフォルト値から 4 日に増加
- **Copy 機能の修正**：コピー操作での改行を維持
- **Cmd+C ショートカットキーの追加**：Cmd+C ショートカットキーを追加

**ソースコード参照**：
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**新機能**：
- **Cmd+Enter ショートカットキー**：Cmd+Enter（Windows: Ctrl+Enter）で承認やフィードバックを送信できるように

**改善**：
- キーボード操作のエクスペリエンスを最適化

**ソースコード参照**：
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  （Cmd+Enter ショートカット機能は各コンポーネントで直接実装されています）

---

### v0.6.3 (2026-01-05)

**修正**：
- skip-title-generation-prompt の問題を修正

**ソースコード参照**：
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**修正**：
- OpenCode プラグインで HTML ファイルが npm パッケージに含まれていない問題を修正

**ソースコード参照**：
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**新機能**：
- **Bear 統合**：承認されたプランを Bear ノートアプリに自動保存

**改善**：
- Obsidian 統合のタグ生成ロジックを改善
- Obsidian vault 検出メカニズムを最適化

**ソースコード参照**：
- Bear 統合: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Obsidian 統合: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## メジャー機能リリース

### Code Review 機能 (2026-01)

**新機能**：
- **コードレビューツール**：`/plannotator-review` コマンドを実行して、Git diff を視覚的にレビュー
- **行レベルコメント**：行番号をクリックしてコード範囲を選択し、comment/suggestion/concern タイプのコメントを追加
- **複数の diff ビュー**：uncommitted/staged/last-commit/branch など、異なる diff タイプを切り替え可能
- **Agent 統合**：構造化されたフィードバックを AI agent に送信し、自動応答をサポート

**使用方法**：
```bash
# プロジェクトディレクトリで実行
/plannotator-review
```

**関連チュートリアル**：
- [コードレビューの基礎](../../platforms/code-review-basics/)
- [コードコメントの追加](../../platforms/code-review-annotations/)
- [Diff ビューの切り替え](../../platforms/code-review-diff-types/)

**ソースコード参照**：
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Git diff ツール: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### 画像アノテーション機能 (2026-01)

**新機能**：
- **画像アップロード**：プランやコードレビューに画像添付をアップロード
- **アノテーションツール**：ペン、矢印、円の 3 種類のアノテーションツールを提供
- **視覚的アノテーション**：画像上で直接アノテーションを行い、レビューフィードバックの効果を強化

**関連チュートリアル**：
- [画像アノテーションの追加](../../platforms/plan-review-images/)

**ソースコード参照**：
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Obsidian 統合 (2025-12)

**新機能**：
- **Vault の自動検出**：Obsidian vault 設定ファイルパスを自動検出
- **プランの自動保存**：承認されたプランを Obsidian に自動保存
- **Frontmatter の自動生成**：created、source、tags などの frontmatter を自動含める
- **インテリジェントタグ抽出**：プランの内容からキーワードを抽出してタグとして設定

**設定方法**：
追加の設定は不要です。Plannotator は Obsidian のインストールパスを自動検出します。

**関連チュートリアル**：
- [Obsidian 統合](../../advanced/obsidian-integration/)

**ソースコード参照**：
- Obsidian 検出: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Obsidian 保存: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Frontmatter 生成: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### URL 共有機能 (2025-11)

**新機能**：
- **バックエンドなしの共有**：プランとコメントを URL hash に圧縮して、バックエンドサーバーなしで共有
- **ワンクリック共有**：Export → Share as URL をクリックして共有リンクを生成
- **読み取り専用モード**：共同作業者が URL を開いて閲覧できますが、決定を送信することはできません

**技術実装**：
- Deflate 圧縮アルゴリズムを使用
- Base64 エンコード + URL 安全文字の置換
- 最大約 7 タブの payload をサポート

**関連チュートリアル**：
- [URL 共有](../../advanced/url-sharing/)

**ソースコード参照**：
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### リモート/Devcontainer モード (2025-10)

**新機能**：
- **リモートモードサポート**：SSH、devcontainer、WSL などのリモート環境で Plannotator を使用
- **固定ポート**：環境変数で固定ポートを設定
- **ポート転送**：ユーザーがブラウザを手動で開くための URL を自動出力
- **ブラウザ制御**：`PLANNOTATOR_BROWSER` 環境変数でブラウザを開くかどうかを制御

**環境変数**：
- `PLANNOTATOR_REMOTE=1`：リモートモードを有効化
- `PLANNOTATOR_PORT=3000`：固定ポートを設定
- `PLANNOTATOR_BROWSER=disabled`：ブラウザの自動起動を無効化

**関連チュートリアル**：
- [リモート/Devcontainer モード](../../advanced/remote-mode/)
- [環境変数の設定](../../advanced/environment-variables/)

**ソースコード参照**：
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## バージョン互換性

| Plannotator バージョン | Claude Code | OpenCode | Bun 最低バージョン |
|--- | --- | --- | ---|
| v0.6.x | 2.1.7+ | 1.0+ | 1.0+ |
| v0.5.x | 2.1.0+ | 0.9+ | 0.7+ |

**アップグレードの推奨**：
- 最新の機能とセキュリティ修正を取得するため、Plannotator を最新バージョンに保ってください
- Claude Code と OpenCode も最新バージョンに保つことが推奨されます

---

## ライセンスの変更

**現在のバージョン（v0.6.7+）**：Business Source License 1.1 (BSL-1.1)

**ライセンス詳細**：
- 許可：個人利用、内部商用利用
- 制限：ホスティングサービス、SaaS 製品の提供
- 詳細は [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE) を参照

---

## フィードバックとサポート

**問題の報告**：
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**機能の提案**：
- GitHub Issues で feature request を送信

**セキュリティ脆弱性**：
- セキュリティ脆弱性はプライベートなチャンネルを通じて報告してください

---

## 次のレッスンの予告

> Plannotator のバージョン履歴と新機能を理解しました。
>
> 次は：
> - [クイックスタート](../../start/getting-started/) に戻ってインストールと使用方法を学ぶ
> - [よくある問題](../../faq/common-problems/) を見て使用中の問題を解決する
> - [API リファレンス](../../appendix/api-reference/) を読んですべての API エンドポイントを理解する
