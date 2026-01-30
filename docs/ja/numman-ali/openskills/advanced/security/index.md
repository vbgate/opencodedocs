---
title: "セキュリティ保護: パストラバーサルとシンボリックリンク | OpenSkills"
sidebarTitle: "パストラバーサルの防止"
subtitle: "セキュリティ保護: パストラバーサルとシンボリックリンク | OpenSkills"
description: "OpenSkillsの3層セキュリティ保護メカニズムを学びます。パストラバーサル保護、シンボリックリンクの安全な処理、YAML解析のセキュリティについて理解し、スキルのインストールと使用の安全性を確保します。"
tags:
  - "セキュリティ"
  - "パストラバーサル"
  - "シンボリックリンク"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# OpenSkills セキュリティ解説

## 学習目標

- OpenSkillsの3層セキュリティ保護メカニズムを理解する
- パストラバーサル攻撃の原理と防御方法を学ぶ
- シンボリックリンクの安全な処理方法を習得する
- YAML解析におけるReDoSリスクと防御策を認識する

## 現在の課題

「ローカル実行はより安全」という説を聞いたことがあるかもしれませんが、具体的なセキュリティ保護措置が不明確かもしれません。または、スキルをインストールする際に以下の懸念を抱いているかもしれません：
- ファイルがシステムディレクトリに書き込まれることはないか？
- シンボリックリンクがセキュリティリスクを引き起こすことはないか？
- SKILL.mdのYAMLを解析する際に脆弱性はないか？

## いつこの方法を使用するか

以下が必要な場合：
- 企業環境でOpenSkillsをデプロイする場合
- OpenSkillsのセキュリティを監査する場合
- セキュリティの観点からスキル管理ソリューションを評価する場合
- セキュリティチームによる技術レビューに対処する場合

## 核心アイデア

OpenSkillsのセキュリティ設計は3つの原則に従います：

::: info 3層セキュリティ保護
1. **入力検証** - すべての外部入力（パス、URL、YAML）をチェックする
2. **分離実行** - 操作が予期されたディレクトリ内で行われることを確保する
3. **安全な解析** - パーサーの脆弱性（ReDoS）を防ぐ
:::

ローカル実行 + データなしアップロード + 入力検証 + パス分離 = 安全なスキル管理

## パストラバーサル保護

### パストラバーサル攻撃とは

**パストラバーサル（Path Traversal）**攻撃とは、攻撃者が`../`などのシーケンスを使用して、予期されたディレクトリ外のファイルにアクセスする攻撃です。

**例**：防御なしの場合、攻撃者が以下を試みる可能性があります：
```bash
# システムディレクトリにインストールしようとする
openskills install malicious/skill --target ../../../etc/

# 設定ファイルを上書きしようとする
openskills install malicious/skill --target ../../../../.ssh/
```

### OpenSkillsの防御メカニズム

OpenSkillsは`isPathInside`関数を使用して、インストールパスがターゲットディレクトリ内にあることを検証します。

**ソースコードの場所**：[`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**動作原理**：
1. `resolve()`を使用してすべての相対パスを絶対パスに解決する
2. ターゲットディレクトリを正規化し、パス区切り文字で終わることを確保する
3. ターゲットパスがターゲットディレクトリで始まるかをチェックする

**インストール時の検証**（[`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)）：
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('Security error: Installation path outside target directory'));
  process.exit(1);
}
```

### 防御効果の検証

**テストシナリオ**：パストラバーサル攻撃を試みる

```bash
# 正常なインストール（成功）
openskills install anthropics/skills

# ../ を使用しようとする（失敗）
openskills install malicious/skill --target ../../../etc/
# Security error: Installation path outside target directory
```

**期待される結果**：ターゲットディレクトリ外へのインストールを試みる操作はすべて拒否され、セキュリティエラーが表示されます。

## シンボリックリンクのセキュリティ

### シンボリックリンクのリスク

**シンボリックリンク（Symlink）**は、他のファイルまたはディレクトリを指すショートカットです。不適切に処理すると、以下の問題が発生する可能性があります：

1. **情報漏洩** - 攻撃者が機密ファイルを指すシンボリックリンクを作成する
2. **ファイル上書き** - シンボリックリンクがシステムファイルを指し、インストール操作で上書きされる
3. **循環参照** - シンボリックリンクが自身を指し、無限再帰を引き起こす

### インストール時のデリファレンス

OpenSkillsはファイルをコピーする際に`dereference: true`を使用してシンボリックリンクをデリファレンスし、ターゲットファイルを直接コピーします。

**ソースコードの場所**：[`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**作用**：
- シンボリックリンクは実際のファイルに置き換えられます
- シンボリックリンク自体はコピーされません
- シンボリックリンクが指すファイルが上書きされるのを防ぎます

### スキル検索時のシンボリックリンクチェック

OpenSkillsはシンボリックリンク形式のスキルをサポートしますが、破損しているかどうかをチェックします。

**ソースコードの場所**：[`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSyncはシンボリックリンクをたどる
      return stats.isDirectory();
    } catch {
      // 破損したシンボリックリンクまたは権限エラー
      return false;
    }
  }
  return false;
}
```

**セキュリティ特性**：
- `statSync()`を使用してシンボリックリンクを自動的にたどり、ターゲットをチェックする
- 破損したシンボリックリンクはスキップされます（`catch`ブロック）
- クラッシュせず、静かに処理されます

::: tip 使用シナリオ
シンボリックリンクサポートにより、以下が可能になります：
- gitリポジトリから直接スキルを使用する（コピー不要）
- ローカル開発時に変更を同期する
- 複数のプロジェクトでスキルライブラリを共有する
:::

## YAML解析のセキュリティ

### ReDoSリスク

**正規表現拒否サービス（ReDoS）**とは、悪意のある入力によって正規表現のマッチング時間が指数関数的に増大し、CPUリソースを消費する攻撃です。

OpenSkillsはSKILL.mdのYAML frontmatterを解析する必要があります：
```yaml
---
name: skill-name
description: Skill description
---
```

### 非貪欲正規表現による防御

OpenSkillsは非貪欲正規表現を使用してReDoSを回避します。

**ソースコードの場所**：[`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**重要なポイント**：
- `+?`は**非貪欲**量詞で、最短の可能な一致を探します
- `^`と`$`で行頭と行末を固定します
- 単一行のみを一致させ、複雑な入れ子を回避します

**誤った例（貪欲一致）**：
```typescript
// ❌ 危険：+は貪欲に一致し、バックトラック爆発を引き起こす可能性がある
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**正しい例（非貪欲一致）**：
```typescript
// ✅ 安全：+?は非貪欲で、最初の改行文字に遭遇すると停止する
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## ファイル権限とソース検証

### システム権限の継承

OpenSkillsはファイル権限を管理せず、オペレーティングシステムの権限制御を直接継承します：

- ファイルの所有者はOpenSkillsを実行するユーザーと同じです
- ディレクトリ権限はシステムのumask設定に従います
- 権限管理はファイルシステムで統一されて制御されます

### プライベートリポジトリのソース検証

プライベートgitリポジトリからインストールする場合、OpenSkillsはgitのSSH鍵認証に依存します。

**ソースコードの場所**：[`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip 推奨事項
SSH鍵の設定が正しく、gitサーバーの認証済み鍵リストに追加されていることを確認してください。
:::

## ローカル実行のセキュリティ

OpenSkillsは純粋にローカルなツールであり、（gitリポジトリのクローンを除き）ネットワーク通信を伴いません：

### データなしアップロード

| 操作 | データフロー |
|--- | ---|
| スキルのインストール | Gitリポジトリ → ローカル |
| スキルの読み取り | ローカル → 標準出力 |
| AGENTS.mdの同期 | ローカル → ローカルファイル |
| スキルの更新 | Gitリポジトリ → ローカル |

### プライバシー保護

- すべてのスキルファイルはローカルに保存されます
- AIエージェントはローカルファイルシステムを通じてファイルを読み取ります
- クラウド依存やテレメトリ収集はありません

::: info Marketplaceとの違い
OpenSkillsはAnthropic Marketplaceに依存せず、完全にローカルで実行されます。
:::

## このレッスンのまとめ

OpenSkillsの3層セキュリティ保護：

| セキュリティレベル | 防御措置 | ソースコードの場所 |
|--- | --- | ---|
| **パストラバーサル保護** | `isPathInside()`でパスがターゲットディレクトリ内にあることを検証する | `install.ts:71-78` |
| **シンボリックリンクのセキュリティ** | `dereference: true`でシンボリックリンクをデリファレンスする | `install.ts:262` |
| **YAML解析のセキュリティ** | 非貪欲正規表現`+?`でReDoSを防ぐ | `yaml.ts:4` |

**覚えておくこと**：
- パストラバーサル攻撃は`../`シーケンスを使用して予期されたディレクトリ外のファイルにアクセスします
- シンボリックリンクはデリファレンスまたはチェックが必要で、情報漏洩とファイル上書きを回避します
- YAML解析は非貪欲正規表現を使用してReDoSを回避します
- ローカル実行 + データなしアップロード = より高いプライバシーセキュリティ

## 次のレッスンのプレビュー

> 次のレッスンでは**[ベストプラクティス](../best-practices/)**を学習します。
>
> 学べること：
> - プロジェクト設定のベストプラクティス
> - スキル管理のチームコラボレーションソリューション
> - マルチエージェント環境の使用テクニック
> - 一般的な落とし穴と回避方法

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能          | ファイルパス                                                                                     | 行番号     |
|--- | --- | ---|
| パストラバーサル保護   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78    |
| インストールパスチェック   | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260  |
| シンボリックリンクデリファレンス | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262      |
| 更新パスチェック   | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172  |
| シンボリックリンクチェック   | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25    |
| YAML解析のセキュリティ  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4        |

**重要な関数**：
- `isPathInside(targetPath, targetDir)`：ターゲットパスがターゲットディレクトリ内にあるかを検証する（パストラバーサルを防止）
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`：ディレクトリまたはシンボリックリンクがディレクトリを指しているかをチェックする
- `extractYamlField(content, field)`：非貪欲正規表現を使用してYAMLフィールドを抽出する（ReDoSを防止）

**更新履歴**：
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - v1.5.0 セキュリティ更新の説明

</details>
