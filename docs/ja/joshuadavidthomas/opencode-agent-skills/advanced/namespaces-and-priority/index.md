---
title: "名前空間: スキル優先順位 | opencode-agent-skills"
sidebarTitle: "スキル競合の解決"
subtitle: "名前空間: スキル優先順位 | opencode-agent-skills"
description: "名前空間システムとスキル発見優先順位ルールを学習します。5 種類のラベル、6 段階の優先順位を習得し、名前空間で同名スキルを区別して競合問題を解決します。"
tags:
  - "上級"
  - "名前空間"
  - "スキル管理"
prerequisite:
  - "start-what-is-opencode-agent-skills"
  - "platforms-skill-discovery-mechanism"
  - "platforms-listing-available-skills"
order: 3
---

# 名前空間とスキル優先順位

## 本レッスンでできること

- スキルの名前空間システムを理解し、異なるソースの同名スキルを区別する
- スキル発見の優先順位ルールを習得し、どのスキルが読み込まれるかを予測する
- 名前空間プレフィックスを使用してスキルソースを正確に指定する
- 同名スキル競合問題を解決する

## 現在の課題

スキル数が増えるにつれて、以下のような困惑に遭遇する可能性があります：

- **同名スキル競合**：プロジェクトディレクトリとユーザーディレクトリの両方に `git-helper` という名前のスキルがあり、どちらが読み込まれたか分からない
- **スキルソースの混乱**：どのスキルがプロジェクトレベルで、どのスキルがユーザーレベルまたはプラグインキャッシュから来ているか不明
- **上書き動作の理解不足**：ユーザーレベルスキルを修正したが効果がなく、プロジェクトレベルスキルに上書きされていた
- **正確な制御が困難**：特定のソースのスキルを強制的に使用したいが、指定方法が分からない

これらの問題は、スキルの名前空間と優先順位ルールの理解不足に起因しています。

## 核心的なアプローチ

**名前空間**は、OpenCode Agent Skills が異なるソースの同名スキルを区別するために使用するメカニズムです。各スキルには、そのソースを識別するラベル（label）があり、これらのラベルがスキルの名前空間を構成します。

::: info なぜ名前空間が必要なのか？

2 つの同名スキルがあると想像してください：
- プロジェクトレベル `.opencode/skills/git-helper/`（現在のプロジェクト用にカスタマイズ）
- ユーザーレベル `~/.config/opencode/skills/git-helper/`（汎用バージョン）

名前空間がなければ、システムはどちらを使用すべきか分かりません。名前空間があれば、明確に指定できます：
- `project:git-helper` - プロジェクトレベルバージョンを強制使用
- `user:git-helper` - ユーザーレベルバージョンを強制使用
:::

**優先順位ルール**は、名前空間が指定されていない場合に、システムが合理的な選択を行うことを保証します。プロジェクトレベルスキルはユーザーレベルスキルよりも優先されるため、グローバル設定に影響を与えることなく、プロジェクト内で特定の動作をカスタマイズできます。

## スキルソースとラベル

OpenCode Agent Skills は複数のスキルソースをサポートしており、各ソースには対応するラベルがあります：

| ソース | ラベル（label） | パス | 説明 |
| --- | --- | --- | --- |
| **OpenCode プロジェクトレベル** | `project` | `.opencode/skills/` | 現在のプロジェクト専用のスキル |
| **Claude プロジェクトレベル** | `claude-project` | `.claude/skills/` | Claude Code 互換のプロジェクトスキル |
| **OpenCode ユーザーレベル** | `user` | `~/.config/opencode/skills/` | すべてのプロジェクトで共有される汎用スキル |
| **Claude ユーザーレベル** | `claude-user` | `~/.claude/skills/` | Claude Code 互換のユーザースキル |
| **Claude プラグインキャッシュ** | `claude-plugins` | `~/.claude/plugins/cache/` | インストール済みの Claude プラグイン |
| **Claude プラグインマーケットプレイス** | `claude-plugins` | `~/.claude/plugins/marketplaces/` | マーケットプレイスからインストールされた Claude プラグイン |

::: tip 実用的なアドバイス
- プロジェクト固有の設定：`.opencode/skills/` に配置
- 汎用ツールスキル：`~/.config/opencode/skills/` に配置
- Claude Code からの移行：移動不要、システムが自動的に発見
:::

## スキル発見優先順位

システムがスキルを発見する際、以下の順序で各場所をスキャンします：

```
1. .opencode/skills/              (project)        ← 最高優先順位
2. .claude/skills/                (claude-project)
3. ~/.config/opencode/skills/     (user)
4. ~/.claude/skills/              (claude-user)
5. ~/.claude/plugins/cache/       (claude-plugins)
6. ~/.claude/plugins/marketplaces/ (claude-plugins)  ← 最低優先順位
```

**重要なルール**：
- **最初のマッチが有効**：最初に見つかったスキルが保持される
- **同名スキルの重複排除**：後続の同名スキルは無視される（ただし警告が発行される）
- **プロジェクトレベル優先**：プロジェクトレベルスキルがユーザーレベルスキルを上書き

### 優先順位の例

以下のようなスキル分布があると仮定します：

```
プロジェクトディレクトリ：
.opencode/skills/
  └── git-helper/              ← バージョン A（プロジェクトカスタマイズ）

ユーザーディレクトリ：
~/.config/opencode/skills/
  └── git-helper/              ← バージョン B（汎用）

プラグインキャッシュ：
~/.claude/plugins/cache/xxx/skills/
  └── git-helper/              ← バージョン C（Claude プラグイン）
```

結果：システムが読み込むのは **バージョン A**（`project:git-helper`）で、後続の 2 つの同名スキルは無視されます。

## 名前空間を使用したスキル指定

`use_skill` やその他のツールを呼び出す際、名前空間プレフィックスを使用してスキルソースを正確に指定できます。

### 構文形式

```
namespace:skill-name
```

または

```
skill-name  # 名前空間を指定しない場合、デフォルトの優先順位を使用
```

### 名前空間リスト

```
project:skill-name         # プロジェクトレベル OpenCode スキル
claude-project:skill-name  # プロジェクトレベル Claude スキル
user:skill-name            # ユーザーレベル OpenCode スキル
claude-user:skill-name     # ユーザーレベル Claude スキル
claude-plugins:skill-name  # Claude プラグインスキル
```

### 使用例

**シナリオ 1：デフォルト読み込み（優先順位に従う）**

```
use_skill("git-helper")
```

- システムは優先順位に従って検索し、最初にマッチしたスキルを読み込む
- つまり `project:git-helper`（存在する場合）

**シナリオ 2：ユーザーレベルスキルを強制使用**

```
use_skill("user:git-helper")
```

- 優先順位ルールをスキップし、ユーザーレベルスキルを直接読み込む
- ユーザーレベルがプロジェクトレベルに上書きされていても、アクセス可能

**シナリオ 3：Claude プラグインスキルを読み込む**

```
use_skill("claude-plugins:git-helper")
```

- Claude プラグインからのスキルを明示的に読み込む
- 特定のプラグイン機能が必要なシナリオに適用

## 名前空間マッチングロジック

`namespace:skill-name` 形式を使用する場合、システムのマッチングロジックは以下の通りです：

1. **入力を解析**：名前空間とスキル名を分離
2. **すべてのスキルを走査**：マッチするスキルを検索
3. **マッチング条件**：
   - スキル名がマッチ
   - スキルの `label` フィールドが指定された名前空間と等しい
   - またはスキルの `namespace` カスタムフィールドが指定された名前空間と等しい
4. **結果を返す**：条件を満たす最初のスキル

::: details マッチングロジックのソースコード

```typescript
export function resolveSkill(
  skillName: string,
  skillsByName: Map<string, Skill>
): Skill | null {
  if (skillName.includes(':')) {
    const [namespace, name] = skillName.split(':');
    for (const skill of skillsByName.values()) {
      if (skill.name === name &&
          (skill.label === namespace || skill.namespace === namespace)) {
        return skill;
      }
    }
    return null;
  }
  return skillsByName.get(skillName) || null;
}
```

:::

## Superpowers モードでの名前空間

Superpowers モードを有効にすると、システムはセッション初期化時に名前空間優先順位の説明を注入します：

```markdown
**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
```

これにより、AI がスキルを選択する際に正しい優先順位ルールに従うことが保証されます。

::: tip Superpowers モードを有効にする方法

環境変数を設定：

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

:::

## 一般的な使用シナリオ

### シナリオ 1：プロジェクトカスタマイズで汎用スキルを上書き

**要件**：プロジェクトに特別な Git ワークフローが必要だが、ユーザーレベルにはすでに汎用の `git-helper` スキルがある。

**解決策**：
1. プロジェクトディレクトリに `.opencode/skills/git-helper/` を作成
2. プロジェクト固有の Git ワークフローを設定
3. デフォルトで `use_skill("git-helper")` を呼び出すと、自動的にプロジェクトレベルバージョンが使用される

**検証**：

```bash
## スキルリストを確認し、ラベルに注意
get_available_skills("git-helper")
```

出力例：
```
git-helper (project)
  Project-specific Git workflow
```

### シナリオ 2：一時的に汎用スキルに切り替え

**要件**：あるタスクでユーザーレベル汎用スキルを使用する必要があり、プロジェクトカスタマイズバージョンではない。

**解決策**：

```
use_skill("user:git-helper")
```

`user:` 名前空間を明示的に指定し、プロジェクトレベルの上書きを回避します。

### シナリオ 3：Claude プラグインからスキルを読み込む

**要件**：Claude Code から移行してきて、特定の Claude プラグインスキルを引き続き使用したい。

**解決策**：

1. Claude プラグインキャッシュパスが正しいことを確認：`~/.claude/plugins/cache/`
2. スキルリストを確認：

```
get_available_skills()
```

3. 名前空間を使用して読み込む：

```
use_skill("claude-plugins:plugin-name")
```

## よくある落とし穴

### ❌ エラー 1：同名スキルが上書きされていることに気づかない

**症状**：ユーザーレベルスキルを修正したが、AI は依然として古いバージョンを使用している。

**原因**：プロジェクトレベルの同名スキルの優先順位が高く、ユーザーレベルスキルを上書きしている。

**解決策**：
1. プロジェクトディレクトリに同名スキルがあるか確認
2. 名前空間を使用して強制指定：`use_skill("user:skill-name")`
3. またはプロジェクトレベルの同名スキルを削除

### ❌ エラー 2：名前空間のスペルミス

**症状**：`use_skill("project:git-helper")` を使用すると 404 が返される。

**原因**：名前空間のスペルミス（`projcet` と書いた）または大文字小文字が間違っている。

**解決策**：
1. まずスキルリストを確認：`get_available_skills()`
2. 括弧内のラベル（例：`(project)`）に注意
3. 正しい名前空間名を使用

### ❌ エラー 3：ラベルとカスタム名前空間の混同

**症状**：`use_skill("project:custom-skill")` を使用してもスキルが見つからない。

**原因**：`project` はラベル（label）であり、カスタム名前空間ではない。スキルの `namespace` フィールドが明示的に `project` に設定されていない限り、マッチしない。

**解決策**：
- スキル名を直接使用：`use_skill("custom-skill")`
- またはスキルの `label` フィールドを確認し、正しい名前空間を使用

## 本レッスンのまとめ

OpenCode Agent Skills の名前空間システムは、ラベルと優先順位ルールを通じて、複数ソースのスキルの統一管理を実現します：

- **5 種類のソースラベル**：`project`、`claude-project`、`user`、`claude-user`、`claude-plugins`
- **6 段階の優先順位**：プロジェクトレベル > Claude プロジェクトレベル > ユーザーレベル > Claude ユーザーレベル > プラグインキャッシュ > プラグインマーケットプレイス
- **最初のマッチが有効**：同名スキルは優先順位に従って読み込まれ、後続は無視される
- **名前空間プレフィックス**：`namespace:skill-name` 形式を使用してスキルソースを正確に指定

このメカニズムにより、自動発見の利便性を享受しながら、必要に応じてスキルソースを正確に制御できます。

## 次のレッスンの予告

> 次のレッスンでは **[コンテキスト圧縮復元メカニズム](../context-compaction-resilience/)** を学習します。
>
> 以下の内容を学びます：
> - コンテキスト圧縮がスキルに与える影響
> - プラグインがスキルリストを自動的に復元する方法
> - 長時間セッションでスキルを利用可能に保つテクニック

---

## 付録：ソースコード参照

<details>
<summary><strong>展開してソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| SkillLabel 型定義 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| 発見優先順位リスト | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| 同名スキル重複排除ロジック | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |
| resolveSkill 名前空間処理 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |
| Superpowers 名前空間説明 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |

**主要な型**：
- `SkillLabel`：スキルソースラベル列挙型
- `Skill`：スキルメタデータインターフェース（`namespace` と `label` フィールドを含む）

**主要な関数**：
- `discoverAllSkills()`：優先順位に従ってスキルを発見し、自動的に重複排除
- `resolveSkill()`：名前空間プレフィックスを解析し、スキルを検索
- `maybeInjectSuperpowersBootstrap()`：名前空間優先順位の説明を注入

**発見パスリスト**（優先順位順）：
1. `project` - `.opencode/skills/`
2. `claude-project` - `.claude/skills/`
3. `user` - `~/.config/opencode/skills/`
4. `claude-user` - `~/.claude/skills/`
5. `claude-plugins` - `~/.claude/plugins/cache/` と `~/.claude/plugins/marketplaces/`

</details>
