---
title: "APIリファレンス: コマンドとタイプ | Agent Skills"
sidebarTitle: "コマンドとタイプを調べる"
subtitle: "APIリファレンス: コマンドとタイプ"
description: "Agent Skillsのビルドコマンドとタイプ定義を調べます。pnpmツールチェーン、TypeScriptインターフェース、SKILL.mdテンプレート、Impact列挙値を含みます。"
tags:
  - "リファレンス"
  - "API"
  - "コマンドライン"
  - "タイプ定義"
order: 120
prerequisite: []
---

# API・コマンドリファレンス

本ページでは、Agent Skillsの完全なAPIとコマンドリファレンスを提供します。ビルドツールチェーンコマンド、TypeScriptタイプ定義、SKILL.mdテンプレート形式、影響レベル列挙値について説明します。

## TypeScriptタイプ定義

### ImpactLevel（影響レベル）

影響レベルは規則の性能影響度を示すために使用され、6つのレベルがあります。

| 値 | 説明 | 適用シーン |
| --- | --- | --- |
| `CRITICAL` | クリティカルなボトルネック | 必ず修正が必要。ユーザーの体験に深刻な影響を与える問題（例：ウォータフォールリクエスト、最適化されていないバンドルサイズ） |
| `HIGH` | 重要な改善 | 顕著な性能向上が見込める最適化（例：サーバーサイドキャッシュ、重複propsの排除） |
| `MEDIUM-HIGH` | 中〜高優先度 | 明確な性能向上（例：データ取得の最適化） |
| `MEDIUM` | 中程度の改善 | 測定可能な性能向上（例：Memo最適化、Re-renderの削減） |
| `LOW-MEDIUM` | 低〜中優先度 | 軽微な性能向上（例：レンダリングの最適化） |
| `LOW` | 漸進的な改善 | 微細な最適化（例：コードスタイル、高度なパターン） |

**ソース位置**：`types.ts:5`

### CodeExample（コードサンプル）

規則内のコードサンプル構造：

| フィールド | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `label` | string | ✅ | サンプルラベル（例：「Incorrect」「Correct」） |
| `description` | string | ❌ | ラベル説明（オプション） |
| `code` | string | ✅ | コード内容 |
| `language` | string | ❌ | コード言語（デフォルト'typescript'） |
| `additionalText` | string | ❌ | 補足説明（オプション） |

**ソース位置**：`types.ts:7-13`

### Rule（規則）

単一の性能最適化規則の完全な構造：

| フィールド | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 規則ID（自動生成 例：「1.1」「2.3」） |
| `title` | string | ✅ | 規則タイトル |
| `section` | number | ✅ | 所属章（1-8） |
| `subsection` | number | ❌ | 小章番号（自動生成） |
| `impact` | ImpactLevel | ✅ | 影響レベル |
| `impactDescription` | string | ❌ | 影響説明（例：「2-10× improvement」） |
| `explanation` | string | ✅ | 規則説明 |
| `examples` | CodeExample[] | ✅ | コードサンプル配列（最低1つ） |
| `references` | string[] | ❌ | 参考リンク |
| `tags` | string[] | ❌ | タグ（検索用） |

**ソース位置**：`types.ts:15-26`

### Section（章）

規則章構造：

| フィールド | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `number` | number | ✅ | 章番号（1-8） |
| `title` | string | ✅ | 章タイトル |
| `impact` | ImpactLevel | ✅ | 全体影響レベル |
| `impactDescription` | string | ❌ | 影響説明 |
| `introduction` | string | ❌ | 章概要 |
| `rules` | Rule[] | ✅ | 含まれる規則配列 |

**ソース位置**：`types.ts:28-35`

### GuidelinesDocument（ガイドライン文書）

完全なガイドライン文書構造：

| フィールド | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `version` | string | ✅ | バージョン番号 |
| `organization` | string | ✅ | 組織名 |
| `date` | string | ✅ | 日付 |
| `abstract` | string | ✅ | 要約 |
| `sections` | Section[] | ✅ | 章配列 |
| `references` | string[] | ❌ | 参考文献 |

**ソース位置**：`types.ts:37-44`

### TestCase（テストケース）

規則から抽出されたテストケース構造：

| フィールド | タイプ | 必須 | 説明 |
| --- | --- | --- | --- |
| `ruleId` | string | ✅ | 規則ID |
| `ruleTitle` | string | ✅ | 規則タイトル |
| `type` | 'bad' \| 'good' | ✅ | テストケースタイプ |
| `code` | string | ✅ | コード内容 |
| `language` | string | ✅ | コード言語 |
| `description` | string | ❌ | 説明 |

**ソース位置**：`types.ts:46-53`

## ビルドツールチェーンコマンド

### pnpm build

規則文書を構築し、テストケースを抽出します。

**コマンド**：
```bash
pnpm build
```

**機能**：
1. 全規則ファイルを解析（`rules/*.md`）
2. 章ごとにグループ化してソート
3. 完全なガイド`AGENTS.md`を生成
4. テストケースを`test-cases.json`に抽出

**出力**：
```bash
Processed 57 rules
Generated AGENTS.md
Extracted 114 test cases
```

**ソース位置**：`build.ts`

### pnpm build --upgrade-version

構築と同時にバージョンを自動アップグレードします。

**コマンド**：
```bash
pnpm build --upgrade-version
```

**機能**：
1. `pnpm build`の全操作を実行
2. `metadata.json`内のバージョンを自動インクリメント
   - 形式：`0.1.0` → `0.1.1`
   - 最後の数字をインクリメント

**ソース位置**：`build.ts:19-24, 255-273`

### pnpm validate

全規則ファイルの形式と完全性を検証します。

**コマンド**：
```bash
pnpm validate
```

**チェック項目**：
- ✅ 規則タイトルが空でない
- ✅ 規則説明が空でない
- ✅ 最低1つのコードサンプルを含む
- ✅ Bad/IncorrectとGood/Correctサンプルを含む
- ✅ Impactレベルが有効（CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW）

**成功時の出力**：
```bash
✓ All 57 rules are valid
```

**失敗時の出力**：
```bash
✗ Validation failed

✖ [async-parallel.md]: Missing or empty title
   rules/async-parallel.md:2

2 errors found
```

**ソース位置**：`validate.ts`

### pnpm extract-tests

規則からテストケースを抽出します。

**コマンド**：
```bash
pnpm extract-tests
```

**機能**：
1. 全規則ファイルを読み込む
2. `Bad/Incorrect`と`Good/Correct`サンプルを抽出
3. `test-cases.json`ファイルを生成

**出力**：
```bash
Extracted 114 test cases (57 bad, 57 good)
```

**ソース位置**：`extract-tests.ts`

### pnpm dev

開発フロー（構築＋検証）。

**コマンド**：
```bash
pnpm dev
```

**機能**：
1. `pnpm build`を実行
2. `pnpm validate`を実行
3. 開発時に規則形式が正しいことを確認

**適用シーン**：
- 新規規則作成後の検証
- 規則修正後の完全性チェック

**ソース位置**：`package.json:12`

## SKILL.mdテンプレート

### Claude.ai Skill定義テンプレート

各Claude.ai Skillには`SKILL.md`ファイルを含める必要があります：

````markdown
---
name: {skill-name}
description: {このスキルを使うタイミングを説明する1文。「Deploy my app」「Check logs」などのトリガーフレーズを含めること}
---

# {スキルタイトル}

{スキルの機能の概要説明}

## 仕組み

{スキルのワークフローを説明する番号付きリスト}

## 使い方

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**引数：**
- `arg1` - 説明（デフォルトX）

**例：**
{2-3つの一般的な使用パターンを表示}

## 出力

{ユーザーが見る出力例}

## ユーザーに結果を表示

{ユーザーに結果をフォーマットする方法のテンプレート}

## トラブルシューティング

{一般的な問題と解決策、特にネットワーク/権限エラー}
````

**ソース位置**：`AGENTS.md:29-69`

### 必須フィールド説明

| フィールド | 説明 | 例 |
| --- | --- | --- |
| `name` | Skill名（ディレクトリ名） | `vercel-deploy` |
| `description` | 1文の説明、トリガーフレーズ含む | ユーザーの「Deploy my app」というリクエスト時にVercelにアプリケーションをデプロイ |
| `title` | Skillタイトル | `Vercelデプロイ` |
| `How It Works` | ワークフロー説明 | 番号付きリスト、4-6ステップの説明 |
| `Usage` | 使い方 | コマンドライン例と引数説明含む |
| `Output` | 出力例 | ユーザーが見る結果を表示 |
| `Present Results to User` | 結果フォーマットテンプレート | Claudeが結果を表示する標準形式 |

**ソース位置**：`skills/claude.ai/vercel-deploy-claimable/SKILL.md`

## Impactレベルマッピング規則

### 規則ファイル名プレフィックス → 章 → レベル

| ファイルプレフィックス | 章番号 | 章タイトル | デフォルトレベル |
| --- | --- | --- | --- |
| `async-` | 1 | ウォータフォール解消 | CRITICAL |
| `bundle-` | 2 | バンドル最適化 | CRITICAL |
| `server-` | 3 | サーバーサイド性能 | HIGH |
| `client-` | 4 | クライアントデータ取得 | MEDIUM-HIGH |
| `rerender-` | 5 | Re-render最適化 | MEDIUM |
| `rendering-` | 6 | レンダリング性能 | MEDIUM |
| `js-` | 7 | JavaScript性能 | LOW-MEDIUM |
| `advanced-` | 8 | 高度なパターン | LOW |

### サンプルファイル

| ファイル名 | 自動推論された章 | 自動推論されたレベル |
| --- | --- | --- |
| `async-parallel.md` | 1（ウォータフォール解消） | CRITICAL |
| `bundle-dynamic-imports.md` | 2（バンドル最適化） | CRITICAL |
| `server-cache-react.md` | 3（サーバーサイド性能） | HIGH |
| `rerender-memo.md` | 5（Re-render最適化） | MEDIUM |

**ソース位置**：`parser.ts:201-210`

## デプロイコマンドリファレンス

### bash deploy.sh [path]

Vercelデプロイスクリプトコマンド。

**コマンド**：
```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**引数**：
- `path` - デプロイディレクトリまたは`.tgz`ファイル（デフォルト現在ディレクトリ）

**例**：
```bash
# 現在ディレクトリをデプロイ
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh

# 指定プロジェクトをデプロイ
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project

# 既存のtarballをデプロイ
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project.tgz
```

**出力形式**：
- **人間が読取可能**（stderr）：プレビューURLと所有権移転リンク
- **JSON**（stdout）：構造化データ（deploymentId、projectId含む）

**ソース位置**：`skills/claude.ai/vercel-deploy-claimable/SKILL.md:20-65`

---

## 付録：ソースリファレンス

<details>
<summary><strong>クリックしてソース位置を表示</strong></summary>

> 更新日時：2026-01-25

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| ImpactLevelタイプ | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5) | 5 |
| CodeExampleインターフェース | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13) | 7-13 |
| Ruleインターフェース | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L15-L26) | 15-26 |
| Sectionインターフェース | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L28-L35) | 28-35 |
| GuidelinesDocumentインターフェース | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L37-L44) | 37-44 |
| TestCaseインターフェース | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L46-L53) | 46-53 |
| build.tsコマンドライン引数 | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L12-L14) | 12-14 |
| ビルドスクリプトバージョンアップグレードロジック | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L19-L24) | 19-24 |
| validate.ts検証ロジック | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66) | 21-66 |
| 規則テンプレートファイル | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | 全文 |
| SKILL.mdテンプレート形式 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L31-L69) | 31-69 |
| Vercel Deploy SKILL | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 全文 |
| ファイルプレフィックスマッピング | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts#L201-L210) | 201-210 |

**重要な定数**：
- `ImpactLevel`列挙：`'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**重要な関数**：
- `incrementVersion(version: string)`：バージョンをインクリメント（build.ts）
- `generateMarkdown(sections, metadata)`：AGENTS.mdを生成（build.ts）
- `validateRule(rule, file)`：規則の完全性を検証（validate.ts）

</details>
