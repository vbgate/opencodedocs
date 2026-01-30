---
title: "よくある質問とトラブルシューティング：様々な問題を迅速に解決する | AI App Factory チュートリアル"
sidebarTitle: "問題が発生した場合の対処"
subtitle: "よくある質問とトラブルシューティング"
description: "AI App Factory の使用中に発生する一般的な問題を迅速に特定して解決する方法を学びます。このチュートリアルでは、初期化ディレクトリの問題、AI アシスタントの起動失敗、ステージ失敗の処理、依存関係のバージョン競合、権限エラーなど、様々なトラブルの調査方法と修復手順を詳細に解説し、アプリケーション開発を効率的に完了させることを支援します。"
tags:
  - "トラブルシューティング"
  - "FAQ"
  - "デバッグ"
prerequisite:
  - "../../start/installation/"
  - "../../start/init-project/"
order: 190
---

# よくある質問とトラブルシューティング

## 学習完了後にできること

- 初期化時のディレクトリ問題を迅速に特定して解決する
- AI アシスタントの起動失敗の原因を調査する
- ステージ失敗の処理フローを理解する（再試行/ロールバック/手動介入）
- 依存関係のインストールとバージョン競合の問題を解決する
- Agent の権限侵害エラーを処理する
- `factory continue` を使用してセッションをまたいで実行を再開する

## 現在直面している課題

以下のような問題に遭遇しているかもしれません：

- ❌ `factory init` を実行した際に"ディレクトリが空ではありません"というエラーが表示される
- ❌ AI アシスタントが起動せず、権限の設定方法がわからない
- ❌ パイプラインの実行が特定のステージで突然失敗し、どう続ければよいかわからない
- ❌ 依存関係のインストールでエラーが発生し、バージョン競合が深刻である
- ❌ Agent が生成した成果物が"権限侵害"としてマークされる
- ❌ チェックポイントと再試行メカニズムが理解できない

心配いりません。これらの問題にはすべて明確な解決策があります。このチュートリアルで、様々なトラブルを迅速に調査して修復する方法を学びます。

---

## 🎒 開始前の準備

::: warning 前提知識

開始する前に、以下が完了していることを確認してください：

- [ ] [インストールと設定](../../start/installation/)を完了した
- [ ] [Factory プロジェクトの初期化](../../start/init-project/)を完了した
- [ ] [7 ステージパイプラインの概要](../../start/pipeline-overview/)を理解した
- [ ] [Claude Code 連携](../../platforms/claude-code/)の使用方法を知っている

:::

## 基本的な考え方

AI App Factory の障害処理は厳密な戦略に従っており、このメカニズムを理解すると、問題が発生した際にパニックになることがなくなります。

### 失敗処理の3つの階層

1. **自動再試行**：各ステージで1回の再試行が許可される
2. **ロールバックとアーカイブ**：失敗した成果物は `_failed/` に移動され、最後の成功したチェックポイントにロールバックされる
3. **手動介入**：2回連続で失敗すると一時停止し、手動での修復が必要になる

### 権限侵害の処理ルール

- Agent が許可されていないディレクトリに書き込む → `_untrusted/` に移動
- パイプラインが一時停止し、審査を待機
- 必要に応じて権限を調整または Agent の動作を修正

### 権限の境界

各 Agent には厳格な読み書き権限の範囲があります：

| Agent       | 読み取り可能                     | 書き込み可能                       |
| ----------- | -------------------------- | ---------------------------- |
| bootstrap   | なし                         | `input/`                     |
| prd         | `input/`                   | `artifacts/prd/`              |
| ui          | `artifacts/prd/`            | `artifacts/ui/`               |
| tech        | `artifacts/prd/`            | `artifacts/tech/`, `artifacts/backend/prisma/` |
| code        | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/` |
| validation  | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/`      |
| preview     | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/`         |

---

## 初期化の問題

### 問題 1：ディレクトリ非空エラー

**症状**：

```bash
$ factory init
Error: Directory is not empty or contains conflicting files
```

**原因**：現在のディレクトリに競合するファイルが含まれている（`.git`、`README.md` などの許可されたファイルではない）。

**解決策**：

1. **ディレクトリの内容を確認**：

```bash
ls -la
```

2. **競合するファイルをクリーンアップ**：

```bash
# 方法 1：競合するファイルを削除
rm -rf <conflicting-files>

# 方法 2：新しいディレクトリに移動
mkdir ../my-app && mv . ../my-app/
cd ../my-app
```

3. **再初期化**：

```bash
factory init
```

**許可されたファイル**：`.git`、`.gitignore`、`README.md`、`.vscode/*`、`.idea/*`

### 問題 2：既存の Factory プロジェクト

**症状**：

```bash
$ factory init
Error: This is already a Factory project
```

**原因**：ディレクトリに既に `.factory/` または `artifacts/` ディレクトリが含まれている。

**解決策**：

- 新しいプロジェクトの場合は、クリーンアップしてから初期化する：

```bash
rm -rf .factory artifacts
factory init
```

- 旧プロジェクトを復元する場合は、直接 `factory run` を実行する

### 問題 3：AI アシスタントの起動失敗

**症状**：

```bash
$ factory init
✓ Factory project initialized
Could not find Claude Code installation.
```

**原因**：Claude Code がインストールされていないか、正しく設定されていない。

**解決策**：

1. **Claude Code をインストール**：

```bash
# macOS
brew install claude

# Linux (公式サイトからダウンロード)
# https://claude.ai/code
```

2. **インストールを確認**：

```bash
claude --version
```

3. **手動起動**：

```bash
# Factory プロジェクトディレクトリ内で
claude ".factory/pipeline.yamlと.factory/agents/orchestrator.checkpoint.mdを読み、パイプラインを起動してください"
```

**手動起動フロー**：1. `pipeline.yaml` を読む → 2. `orchestrator.checkpoint.md` を読む → 3. AI の実行を待つ

---

## パイプライン実行の問題

### 問題 4：プロジェクトディレクトリエラー

**症状**：

```bash
$ factory run
Error: Not a Factory project. Run 'factory init' first.
```

**原因**：現在のディレクトリが Factory プロジェクトではない（`.factory/` ディレクトリがない）。

**解決策**：

1. **プロジェクト構造を確認**：

```bash
ls -la .factory/
```

2. **正しいディレクトリに切り替える**または**再初期化する**：

```bash
# プロジェクトディレクトリに切り替え
cd /path/to/project

# または再初期化
factory init
```

### 問題 5：Pipeline ファイルが見つからない

**症状**：

```bash
$ factory run
Error: Pipeline configuration not found
```

**原因**：`pipeline.yaml` ファイルが欠落しているか、パスが間違っている。

**解決策**：

1. **ファイルが存在するか確認**：

```bash
ls -la .factory/pipeline.yaml
ls -la pipeline.yaml
```

2. **手動コピー**（ファイルが失われた場合）：

```bash
cp /path/to/factory/source/hyz1992/agent-app-factory/pipeline.yaml .factory/
```

3. **再初期化**（最も確実）：

```bash
rm -rf .factory
factory init
```

---

## ステージ失敗の処理

### 問題 6：Bootstrap ステージの失敗

**症状**：

- `input/idea.md` が存在しない
- `idea.md` に重要なセクションが欠けている（ターゲットユーザー、コア価値、仮説）

**原因**：ユーザー入力が不十分、または Agent が正しくファイルを書き込めなかった。

**処理フロー**：

```
1. input/ ディレクトリが存在するか確認 → 存在しない場合は作成
2. 再試行して、Agent に正しいテンプレートを使用するよう指示
3. 失敗が続く場合、ユーザーに詳細な製品説明を依頼
```

**手動修正**：

1. **成果物ディレクトリを確認**：

```bash
ls -la artifacts/_failed/bootstrap/
```

2. **input/ ディレクトリを作成**：

```bash
mkdir -p input
```

3. **詳細な製品説明を提供**：

AI に明確で詳細な製品アイデアを提供し、以下を含める：
- ターゲットユーザーは誰か（具体的なペルソナ）
- コアの悩みは何か
- 何を解決したいのか
- 初期的な機能アイデア

### 問題 7：PRD ステージの失敗

**症状**：

- PRD に技術的な詳細が含まれている（責任境界に違反）
- Must Have 機能が 7 つを超えている（スコープの肥大化）
- 非ターゲットが欠けている（境界が明確ではない）

**原因**：Agent が範囲を超えているか、スコープ制御が不十分。

**処理フロー**：

```
1. prd.md に技術的なキーワードが含まれていないことを確認
2. Must Have 機能数が 7 以下であることを確認
3. ターゲットユーザーに具体的なペルソナがあることを確認
4. 再試行時に具体的な修正要求を提供
```

**よくあるエラーの例**：

| エラーの種類 | エラーの例 | 正しい例 |
|---------|---------|---------|
| 技術的な詳細が含まれる | "React Native を使用して実装" | "iOS および Android プラットフォームをサポート" |
| スコープの肥大化 | "決済、ソーシャル、メッセージなど 10 個の機能を含む" | "コア機能は 7 個以下" |
| ターゲットが不明確 | "すべての人が使用できる" | "25-35 歳の都市部のビジネスマン" |

**手動修正**：

1. **失敗した PRD を確認**：

```bash
cat artifacts/_failed/prd/prd.md
```

2. **内容を修正**：

- 技術スタックの説明を削除
- 機能リストを 7 個以下に簡素化
- 非ターゲットリストを追加

3. **正しい位置に手動で移動**：

```bash
mv artifacts/_failed/prd/prd.md artifacts/prd/prd.md
```

### 問題 8：UI ステージの失敗

**症状**：

- ページ数が 8 を超えている（スコープの肥大化）
- プレビュー HTML ファイルが破損している
- AI スタイルを使用している（Inter フォント + 紫色のグラデーション）
- YAML 解析に失敗している

**原因**：UI スコープが大きすぎるか、デザインガイドラインに従っていない。

**処理フロー**：

```
1. ui.schema.yaml のページ数をカウント
2. ブラウザで preview.web/index.html を開いてみる
3. YAML 構文を検証
4. 禁止された AI スタイル要素が使用されていないか確認
```

**手動修正**：

1. **YAML 構文を検証**：

```bash
npx js-yaml .factory/artifacts/ui/ui.schema.yaml
```

2. **ブラウザでプレビューを開く**：

```bash
open artifacts/ui/preview.web/index.html  # macOS
xdg-open artifacts/ui/preview.web/index.html  # Linux
```

3. **ページ数を簡素化**：`ui.schema.yaml` を確認し、ページ数が 8 以下であることを確認

### 問題 9：Tech ステージの失敗

**症状**：

- Prisma schema 構文エラー
- マイクロサービス、キャッシュなどの過剰な設計の導入
- データモデルが多すぎる（テーブル数が 10 を超えている）
- API 定義が欠けている

**原因**：アーキテクチャが複雑すぎるか、データベース設計に問題がある。

**処理フロー**：

```
1. npx prisma validate を実行して schema を検証
2. tech.md に必要なセクションが含まれているか確認
3. データモデルの数をカウント
4. 不必要な複雑な技術が導入されていないか確認
```

**手動修正**：

1. **Prisma Schema を検証**：

```bash
cd artifacts/backend/
npx prisma validate
```

2. **アーキテクチャを簡素化**：`artifacts/tech/tech.md` を確認し、不必要な技術（マイクロサービス、キャッシュなど）を削除

3. **API 定義を補充**：`tech.md` にすべての必要な API エンドポイントが含まれていることを確認

### 問題 10：Code ステージの失敗

**症状**：

- 依存関係のインストールに失敗
- TypeScript コンパイルエラー
- 必要なファイルが欠けている
- テストが失敗している
- API が起動できない

**原因**：依存関係のバージョン競合、型の問題、またはコードロジックのエラー。

**処理フロー**：

```
1. npm install --dry-run を実行して依存関係を確認
2. npx tsc --noEmit を実行して型を確認
3. ファイルリストと照らし合わせてディレクトリ構造を確認
4. npm test を実行してテストを確認
5. すべて通過した場合、サービスの起動を試みる
```

**よくある依存関係問題の修正**：

```bash
# バージョン競合
rm -rf node_modules package-lock.json
npm install

# Prisma バージョンの不一致
npm install @prisma/client@latest prisma@latest

# React Native 依存関係の問題
npx expo install --fix
```

**TypeScript エラーの処理**：

```bash
# 型エラーを確認
npx tsc --noEmit

# 修正後に再検証
npx tsc --noEmit
```

**ディレクトリ構造の確認**：

以下の必須ファイル/ディレクトリが含まれていることを確認：

```
artifacts/backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── lib/
│   └── routes/
└── vitest.config.ts

artifacts/client/
├── package.json
├── tsconfig.json
├── app.json
└── src/
```

### 問題 11：Validation ステージの失敗

**症状**：

- 検証レポートが不完全
- 重大な問題が多すぎる（エラー数が 10 を超えている）
- セキュリティ問題（ハードコードされたキーが検出された）

**原因**：Code ステージの品質が低い、またはセキュリティ上の問題がある。

**処理フロー**：

```
1. report.md を解析してすべてのセクションが存在することを確認
2. 重大な問題の数をカウント
3. 重大な問題が 10 を超える場合、Code ステージへのロールバックを推奨
4. セキュリティスキャン結果を確認
```

**手動修正**：

1. **検証レポートを確認**：

```bash
cat artifacts/validation/report.md
```

2. **重大な問題を修正**：レポートに従って項目ごとに修正

3. **Code ステージにロールバック**（問題が多すぎる場合）：

```bash
factory run code  # Code ステージからやり直し
```

### 問題 12：Preview ステージの失敗

**症状**：

- README が不完全（インストール手順が欠けている）
- Docker ビルドが失敗
- デプロイ設定が欠けている

**原因**：内容の欠落または設定の問題。

**処理フロー**：

```
1. README.md にすべての必要なセクションが含まれているか確認
2. docker build を試して Dockerfile を検証
3. デプロイ設定ファイルが存在するか確認
```

**手動修正**：

1. **Docker 設定を検証**：

```bash
cd artifacts/preview/
docker build -t my-app .
```

2. **デプロイファイルを確認**：

以下のファイルが存在することを確認：

```
artifacts/preview/
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml  # CI/CD 設定
```

---

## 権限侵害エラーの処理

### 問題 13：Agent の権限侵害書き込み

**症状**：

```bash
Error: Unauthorized write to <path>
Artifacts moved to: artifacts/_untrusted/<stage-id>/
Pipeline paused. Manual intervention required.
```

**原因**：Agent が許可されていないディレクトリまたはファイルに書き込みを行った。

**解決策**：

1. **権限侵害ファイルを確認**：

```bash
ls -la artifacts/_untrusted/<stage-id>/
```

2. **権限マトリクスを審査**：その Agent の書き込み可能範囲を確認

3. **処理方法を選択**：

   - **方法 A：Agent の動作を修正**（推奨）

   AI アシスタントで権限侵害の問題を明確に指摘し、修正を依頼。

   - **方法 B：ファイルを正しい位置に移動**（注意）

   ファイルが存在すべきだと確信している場合、手動で移動：

   ```bash
   mv artifacts/_untrusted/<stage-id>/<file> artifacts/<target-stage>/
   ```

   - **方法 C：権限マトリクスを調整**（高度）

   `.factory/policies/capability.matrix.md` を変更し、その Agent の書き込み権限を追加。

4. **実行を継続**：

```bash
factory continue
```

**例シナリオ**：

- Code Agent が `artifacts/prd/prd.md` を変更しようとする（責任境界違反）
- UI Agent が `artifacts/backend/` ディレクトリを作成しようとする（権限範囲を超えている）
- Tech Agent が `artifacts/ui/` ディレクトリに書き込もうとする（境界を超えている）

---

## セッション分割実行の問題

### 問題 14：Token 不足またはコンテキストの蓄積

**症状**：

- AI の応答が遅くなる
- コンテキストが長すぎてモデルパフォーマンスが低下する
- Token 消費が大きすぎる

**原因**：同じセッション内で会話履歴が蓄積しすぎている。

**解決策：`factory continue` を使用**

`factory continue` コマンドを使用すると、以下が可能になります：

1. 現在の状態を `.factory/state.json` に**保存**
2. 新しい Claude Code ウィンドウを**起動**
3. 現在のステージから**実行を継続**

**実行手順**：

1. **現在の状態を確認**：

```bash
factory status
```

出力例：

```bash
Pipeline Status:
───────────────────────────────────────
Project: my-app
Status: Waiting
Current Stage: tech
Completed: bootstrap, prd, ui
```

2. **新しいセッションで継続**：

```bash
factory continue
```

**効果**：

- 各ステージがクリーンなコンテキストを独占
- Token の蓄積を回避
- 中断からの復旧をサポート

**手動で新しいセッションを起動**（`factory continue` が失敗した場合）：

```bash
# 権限設定を再生成
claude ".claude/settings.local.jsonを再生成し、Read/Write/Glob/Bash 操作を許可してください"

# 手動で新しいセッションを起動
claude "パイプラインの実行を継続してください。現在のステージは tech です"
```

---

## 環境と権限の問題

### 問題 15：Node.js バージョンが古すぎる

**症状**：

```bash
Error: Node.js version must be >= 16.0.0
```

**原因**：Node.js バージョンが要件を満たしていない。

**解決策**：

1. **バージョンを確認**：

```bash
node --version
```

2. **Node.js をアップグレード**：

```bash
# macOS
brew install node@18
brew link --overwrite node@18

# Linux (nvm を使用)
nvm install 18
nvm use 18

# Windows (公式サイトからダウンロード)
# https://nodejs.org/
```

### 問題 16：Claude Code 権限の問題

**症状**：

- AI が"読み書き権限がない"と警告する
- AI が `.factory/` ディレクトリにアクセスできない

**原因**：`.claude/settings.local.json` 権限設定が正しくない。

**解決策**：

1. **権限ファイルを確認**：

```bash
cat .claude/settings.local.json
```

2. **権限を再生成**：

```bash
factory continue  # 自動再生成
```

または手動で実行：

```bash
node -e "
const { generateClaudeSettings } = require('./cli/utils/claude-settings');
generateClaudeSettings(process.cwd());
"
```

3. **正しい権限設定の例**：

```json
{
  "allowedCommands": ["npm", "npx", "node", "git"],
  "allowedPaths": [
    "/absolute/path/to/project/.factory",
    "/absolute/path/to/project/artifacts",
    "/absolute/path/to/project/input",
    "/absolute/path/to/project/node_modules"
  ]
}
```

### 問題 17：ネットワーク問題による依存関係インストール失敗

**症状**：

```bash
Error: Network request failed
npm ERR! code ECONNREFUSED
```

**原因**：ネットワーク接続の問題または npm ソースへのアクセス失敗。

**解決策**：

1. **ネットワーク接続を確認**：

```bash
ping registry.npmjs.org
```

2. **npm ソースを切り替え**：

```bash
# 淘宝ミラーを使用
npm config set registry https://registry.npmmirror.com

# 確認
npm config get registry
```

3. **依存関係を再インストール**：

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 手動介入の決定木

```
Stage 失敗
    │
    ▼
最初の失敗か?
    ├─ Yes → 自動再試行
    │         │
    │         ▼
    │     再試行成功? → Yes → フローを継続
    │            │
    │            No → 2 回目の失敗
    │
    └─ No → 失敗の原因を分析
              │
              ▼
          入力問題か?
              ├─ Yes → 入力ファイルを修正
              │         └─ 上流 Stage へロールバック
              │
              └─ No → 手動介入を要求
```

**決定の要点**：

- **最初の失敗**：自動再試行を許可し、エラーが消えるかを観察
- **2 回目の失敗**：自動処理を停止し、手動での審査が必要
- **入力問題**：`input/idea.md` または上流の成果物を修正
- **技術問題**：依存関係、設定、またはコードロジックを確認
- **権限侵害問題**：権限マトリクスまたは Agent の動作を審査

---

## よくある落とし穴

### ❌ よくある間違い

1. **上流の成果物を直接修正**

   間違った方法：PRD ステージで `input/idea.md` を修正
   
   正しい方法：Bootstrap ステージにロールバック

2. **チェックポイントの確認を無視**

   間違った方法：すべてのチェックポイントを素通り
   
   正しい方法：各ステージの成果物が期待通りかを慎重に確認

3. **失敗した成果物を手動で削除**

   間違った方法：`_failed/` ディレクトリを削除
   
   正しい方法：失敗した成果物を比較分析のために保持

4. **修正後に権限を再生成しない**

   間違った方法：プロジェクト構造を修正した後に `.claude/settings.local.json` を更新しない
   
   正しい方法：`factory continue` を実行して権限を自動更新

### ✅ ベストプラクティス

1. **早期の失敗**：問題を早期に発見し、後続のステージでの無駄な時間を回避

2. **詳細なログ**：完全なエラーログを保持し、問題の調査に活用

3. **アトミック操作**：各ステージの出力はアトミックであり、ロールバックしやすい

4. **証拠の保持**：失敗した成果物をアーカイブしてから再試行し、比較分析を容易にする

5. **段階的な再試行**：再試行時に具体的なガイダンスを提供し、単純な繰り返しではない

---

## このレッスンのまとめ

このコースでは、AI App Factory の使用中に発生する様々な一般的な問題を取り上げました：

| カテゴリ | 問題数 | コアの解決方法 |
|-----|--------|-------------|
| 初期化 | 3 | ディレクトリのクリーンアップ、AI アシスタントのインストール、手動起動 |
| パイプライン実行 | 2 | プロジェクト構造の確認、設定ファイルの確認 |
| ステージ失敗 | 7 | 再試行、ロールバック、修正後に再実行 |
| 権限侵害の処理 | 1 | 権限マトリクスの審査、ファイルの移動または権限調整 |
| セッション分割実行 | 1 | `factory continue` を使用して新しいセッションを起動 |
| 環境と権限 | 3 | Node.js のアップグレード、権限の再生成、npm ソースの切り替え |

**重要なポイント**：

- 各ステージでは**自動再試行が 1 回**許可される
- 2 回連続で失敗した後は**手動介入**が必要
- 失敗した成果物は自動的に `_failed/` にアーカイブされる
- 権限侵害ファイルは `_untrusted/` に移動される
- `factory continue` を使用して Token を節約

**覚えておいてください**：

問題が発生しても慌てないでください。まずエラーログを確認し、対応する成果物ディレクトリを確認して、このレッスンの解決策を参照して段階的に調査してください。ほとんどの問題は再試行、ロールバック、または入力ファイルの修正で解決できます。

## 次のレッスンのプレビュー

> 次のレッスンでは **[ベストプラクティス](../best-practices/)** を学びます。
>
> 以下を学びます：
> - 明確な製品説明を提供する方法
> - チェックポイントメカニズムを活用する方法
> - プロジェクトスコープを制御する方法
> - 段階的な反復と最適化を行う方法

**関連記事**：

- [失敗処理とロールバック](../../advanced/failure-handling/) - 失敗処理戦略の詳細
- [権限とセキュリティメカニズム](../../advanced/security-permissions/) - 能力境界マトリクスの理解
- [コンテキスト最適化](../../advanced/context-optimization/) - Token 節約のテクニック

---

## 付録：ソースコードの参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-29

| 機能 | ファイルパス | 行号 |
|------|----------|------|
| 初期化ディレクトリチェック | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| AI アシスタント起動 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| 失敗戦略定義 | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-276 |
| エラーコード規約 | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |
| 能力境界マトリクス | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-23 |
| パイプライン設定 | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 全文 |
| スケジューラコア | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Continue コマンド | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |

**重要な定数**：
- 許可される Must Have 機能数：≤ 7
- 許可される UI ページ数：≤ 8
- 許可されるデータモデル数：≤ 10
- 再試行回数：各ステージで 1 回の再試行が許可される

**重要な関数**：
- `isFactoryProject(dir)` - Factory プロジェクトかどうかを確認
- `isDirectorySafeToInit(dir)` - ディレクトリが初期化可能かどうかを確認
- `generateClaudeSettings(projectDir)` - Claude Code 権限設定を生成
- `factory continue` - 新しいセッションでパイプラインの実行を継続

</details>
