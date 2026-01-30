---
title: "セキュリティメカニズム: パス保護と検証 | opencode-agent-skills"
sidebarTitle: "セキュリティメカニズム"
subtitle: "セキュリティメカニズム: パス保護と検証"
description: "OpenCode Agent Skills プラグインのセキュリティメカニズムを理解します。パス保護、YAML解析、入力検証、スクリプト実行保護などのセキュリティ機能を習得し、スキルプラグインを安全に使用します。"
tags:
  - セキュリティ
  - ベストプラクティス
  - FAQ
prerequisite: []
order: 2
---

# セキュリティの説明

## 学習後の目標

- プラグインがどのようにシステムをセキュリティ脅威から保護するかを理解する
- スキルファイルが従うべきセキュリティ規範を知る
- プラグイン使用時のセキュリティベストプラクティスを習得する

## コア概念

OpenCode Agent Skills プラグインはローカル環境で実行され、スクリプトの実行、ファイルの読み取り、設定の解析を行います。非常に強力ですが、スキルファイルが信頼できないソースからのものである場合、セキュリティリスクをもたらす可能性があります。

プラグインは多層的なセキュリティメカニズムを組み込んでおり、パスアクセス、ファイル解析、スクリプト実行の各段階で厳重な保護を行っています。これらのメカニズムを理解することで、より安全にプラグインを活用できます。

## セキュリティメカニズムの詳細

### 1. パスセキュリティチェック: ディレクトリトラバーサルの防止

**問題**：スキルファイルに悪意のあるパス（例: `../../etc/passwd`）が含まれている場合、システムの機密ファイルにアクセスされる可能性があります。

**保護策**：

プラグインは `isPathSafe()` 関数（`src/utils.ts:130-133`）を使用して、すべてのファイルアクセスがスキルディレクトリ内に制限されることを保証します：

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**動作原理**：
1. リクエストされたパスを絶対パスに解決
2. 解決されたパスがスキルディレクトリで始まるかを確認
3. パスがスキルディレクトリの外へ出ようとする場合（`..` を含む）、直接拒否

**実際のケース**：

`read_skill_file` ツールがファイルを読み取る際（`src/tools.ts:101-103`）、まず `isPathSafe` を呼び出します：

```typescript
// セキュリティ：パスがスキルディレクトリの外に出ないことを保証
if (!isPathSafe(skill.path, args.filename)) {
  return `Invalid path: cannot access files outside skill directory.`;
}
```

これは以下を意味します：
- ✅ `docs/guide.md` → 許可（スキルディレクトリ内）
- ❌ `../../../etc/passwd` → 拒否（システムファイルへのアクセス試行）
- ❌ `/etc/passwd` → 拒否（絶対パス）

::: info なぜこれが重要か
パストラバーサル攻撃は Web アプリケーションの一般的な脆弱性です。プラグインがローカルで実行されていても、信頼できないスキルが SSH 秘密鍵、プロジェクト設定などの機密ファイルへのアクセスを試みる可能性があります。
:::

### 2. YAML セキュリティ解析: コード実行の防止

**問題**：YAML はカスタムタグと複雑なオブジェクトをサポートしており、悪意のある YAML がタグを通じてコードを実行する可能性があります（例: `!!js/function`）。

**保護策**：

プラグインは `parseYamlFrontmatter()` 関数（`src/utils.ts:41-49`）を使用し、厳格な YAML 解析戦略を採用します：

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // 基本的な JSON 互換タイプのみをサポートする core スキーマを使用
      // コード実行の可能性があるカスタムタグを防止
      schema: "core",
      // DoS 攻撃を防ぐために再帰の深さを制限
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**重要なセキュリティ設定**：

| 設定               | 作用                                                   |
| ------------------ | ------------------------------------------------------ |
| `schema: "core"`   | 基本的な JSON タイプのみをサポート（文字列、数値、ブール、配列、オブジェクト）、カスタムタグを無効化 |
| `maxAliasCount: 100` | YAML エイリアスの再帰の深さを制限し、DoS 攻撃を防止      |

**実際のケース**：

```yaml
# 悪意のある YAML 例（core スキーマによって拒否されます）
---
!!js/function >
function () { return "malicious code" }
---

# 正しいセキュアな形式
---
name: my-skill
description: A safe skill description
---
```

YAML 解析が失敗した場合、プラグインはそのスキルを黙って無視し、他のスキルの検出を続けます（`src/skills.ts:142-145`）：

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // 解析に失敗した場合、このスキルをスキップ
}
```

### 3. 入力検証: Zod Schema による厳格なチェック

**問題**：スキルの frontmatter フィールドが規範に従っていない場合、プラグインの動作が異常になる可能性があります。

**保護策**：

プラグインは Zod Schema（`src/skills.ts:105-114`）を使用して、frontmatter を厳格に検証します：

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

**検証ルール**：

| フィールド         | ルール                                                     | 拒否例                               |
| ---------------- | ---------------------------------------------------------- | ------------------------------------ |
| `name`           | 小文字、数字、ハイフン、空を許可しない                      | `MySkill`（大文字）、`my skill`（スペース） |
| `description`    | 空を許可しない                                             | `""`（空文字列）                       |
| `license`        | オプションの文字列                                         | -                                    |
| `allowed-tools`  | オプションの文字列配列                                      | `[123]`（文字列以外）                 |
| `metadata`       | オプションのキーバリューオブジェクト（値は文字列）          | `{key: 123}`（値が文字列以外）        |

**実際のケース**：

```yaml
# ❌ エラー: name に大文字が含まれている
---
name: GitHelper
description: Git operations helper
---

# ✅ 正しい: 規範に従っている
---
name: git-helper
description: Git operations helper
---
```

検証に失敗した場合、プラグインはそのスキルをスキップします（`src/skills.ts:147-152`）：

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // 検証に失敗した場合、このスキルをスキップ
}
```

### 4. スクリプト実行セキュリティ: 実行可能ファイルのみ実行

**問題**：プラグインが任意のファイル（設定ファイル、ドキュメントなど）を実行する場合、予期せぬ結果を招く可能性があります。

**保護策**：

プラグインはスクリプトを発見する際（`src/skills.ts:59-99`）、実行可能権限を持つファイルのみを収集します：

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... 再帰的な走査ロジック ...

  if (stats.isFile()) {
    // 重要：実行可能ビットを持つファイルのみを収集
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**セキュリティ特性**：

| チェック機構                | 作用                                                   |
| ------------------------- | ------------------------------------------------------ |
| **実行可能ビットチェック** (`stats.mode & 0o111`) | ユーザーが明示的に実行可能とマークしたファイルのみを実行し、ドキュメントや設定の誤実行を防止 |
| **隠しディレクトリをスキップ** (`entry.name.startsWith('.')`) | `.git`、`.vscode` などの隠しディレクトリをスキャンせず、過剰なファイルスキャンを回避 |
| **依存ディレクトリをスキップ** (`skipDirs.has(entry.name)`) | `node_modules`、`__pycache__` などをスキップし、サードパーティ依存のスキャンを回避 |
| **再帰の深さを制限** (`maxDepth: 10`) | 再帰の深さを 10 層に制限し、悪意のあるスキルの深層ディレクトリによるパフォーマンス問題を防止 |

**実際のケース**：

スキルディレクトリ内：

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ 実行可能（スクリプトとして認識）
├── build.sh           # ✓ 実行可能（スクリプトとして認識）
├── README.md          # ✗ 実行不可（スクリプトとして認識されない）
├── config.json        # ✗ 実行不可（スクリプトとして認識されない）
└── node_modules/      # ✗ スキップ（依存ディレクトリ）
    └── ...           # ✗ スキップ
```

`run_skill_script("my-skill", "README.md")` を呼び出す場合、README.md に実行可能権限がないためスクリプトとして認識されず（`src/skills.ts:86`）、「見つかりません」エラーが返されます（`src/tools.ts:165-177`）。

## セキュリティベストプラクティス

### 1. 信頼できるソースからスキルを取得

- ✓ 公式スキルリポジトリや信頼できる開発者を使用
- ✓ スキルの GitHub Star 数と貢献者アクティビティを確認
- ✗ 出所不明のスキルをダウンロードして実行しない

### 2. スキル内容をレビュー

新しいスキルをロードする前に、SKILL.md とスクリプトファイルを素早く確認します：

```bash
# スキルの説明とメタデータを確認
cat .opencode/skills/skill-name/SKILL.md

# スクリプト内容を確認
cat .opencode/skills/skill-name/scripts/*.sh
```

特に注意：
- スクリプトがシステムの機密パス（`/etc`、`~/.ssh`）にアクセスするか
- スクリプトが外部依存をインストールするか
- スクリプトがシステム設定を変更するか

### 3. スクリプト権限を正しく設定

実行する必要があるファイルにのみ実行可能権限を追加します：

```bash
# 正しい: スクリプトに実行可能権限を追加
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# 正しい: ドキュメントはデフォルト権限のまま（実行不可）
# README.md、config.json などは実行不要
```

### 4. 機密ファイルを隠す

スキルディレクトリに機密情報を含めないでください：

- ✗ `.env` ファイル（API キー）
- ✗ `.pem` ファイル（秘密鍵）
- ✗ `credentials.json`（認証情報）
- ✓ 環境変数または外部設定を使用して機密データを管理

### 5. プロジェクトレベルスキルがユーザーレベルスキルを上書き

スキル検出の優先順位（`src/skills.ts:241-246`）：

1. `.opencode/skills/`（プロジェクトレベル）
2. `.claude/skills/`（プロジェクトレベル、Claude）
3. `~/.config/opencode/skills/`（ユーザーレベル）
4. `~/.claude/skills/`（ユーザーレベル、Claude）
5. `~/.claude/plugins/cache/`（プラグインキャッシュ）
6. `~/.claude/plugins/marketplaces/`（プラグインマーケットプレイス）

**ベストプラクティス**：

- プロジェクト固有のスキルは `.opencode/skills/` に配置すると、同名のユーザーレベルスキルを自動的に上書き
- 汎用スキルは `~/.config/opencode/skills/` に配置すると、すべてのプロジェクトで使用可能
- 信頼できないソースからのスキルはグローバルインストールしない

## この章のまとめ

OpenCode Agent Skills プラグインには多層的なセキュリティ保護が組み込まれています：

| セキュリティメカニズム   | 保護対象                                         | コードの場所            |
| -------------------- | ------------------------------------------------ | --------------------- |
| パスセキュリティチェック   | ディレクトリトラバーサルを防止し、ファイルアクセス範囲を制限   | `utils.ts:130-133`    |
| YAML セキュリティ解析   | 悪意のある YAML によるコード実行を防止                | `utils.ts:41-49`      |
| Zod Schema 検証      | スキル frontmatter が規範に従っていることを確認         | `skills.ts:105-114`   |
| スクリプト実行可能チェック  | ユーザーが明示的に実行可能とマークしたファイルのみ実行        | `skills.ts:86`        |
| ディレクトリスキップロジック | 隠しディレクトリと依存ディレクトリのスキャンを回避        | `skills.ts:61, 70`    |

覚えておいてください：セキュリティは共同の責任です。プラグインは保護メカニズムを提供しますが、最終的な決定権はあなたの手にあります。信頼できるソースのスキルのみを使用し、コードをレビューする習慣を身につけてください。

## 次の章の予告

> 次の章では **[スキル開発のベストプラクティス](../../appendix/best-practices/)** を学びます。
>
> 次の内容が含まれます：
> - 命名規則と説明の記述テクニック
> - ディレクトリ構成とスクリプトの使用方法
> - Frontmatter のベストプラクティス
> - 一般的なエラーを回避する方法

## 付録: ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| セキュリティメカニズム   | ファイルパス                                                                                                    | 行番号   |
| -------------------- | ------------------------------------------------------------------------------------------------------------- | ------ |
| パスセキュリティチェック   | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133)         | 130-133 |
| YAML セキュリティ解析   | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56)           | 41-56   |
| Zod Schema 検証      | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114)         | 105-114 |
| スクリプト実行可能チェック  | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86)             | 86      |
| ディレクトリスキップロジック | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70)             | 61, 70  |
| ツール内のパスセキュリティ | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103)          | 101-103 |

**重要な関数**：
- `isPathSafe(basePath, requestedPath)`：パスが安全かどうかを検証し、ディレクトリトラバーサルを防止
- `parseYamlFrontmatter(text)`：core スキーマと再帰制限を使用して YAML を安全に解析
- `SkillFrontmatterSchema`：スキル frontmatter フィールドを検証する Zod スキーマ
- `findScripts(skillPath, maxDepth)`：実行可能なスクリプトを再帰的に検索し、隠し・依存ディレクトリをスキップ

**重要な定数**：
- `maxAliasCount: 100`：YAML 解析の最大エイリアス数、DoS 攻撃を防止
- `maxDepth: 10`：スクリプト発見の最大再帰深度
- `0o111`：実行可能ビットマスク（ファイルが実行可能かどうかをチェック）

</details>
