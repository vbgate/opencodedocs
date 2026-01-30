---
title: "問題診断: トラブルシューティング | Agent Skills"
sidebarTitle: "デプロイ/スキルのトラブルシューティング"
subtitle: "問題診断: トラブルシューティング"
description: "Agent Skillsのネットワークエラー、スキル未アクティブ、ルール検証失敗などの障害を解決。高速な診断方法と修復手順を習得し、一般的な問題を効率的に特定します。"
tags:
  - "FAQ"
  - "トラブルシューティング"
  - "デバッグ"
  - "ネットワーク設定"
order: 90
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# よくある問題の診断

## この章でできること

- デプロイ時のネットワークエラーを高速に診断・解決
- スキルがアクティブにならない問題を修正
- ルール検証失敗のエラーを処理
- フレームワーク検出が不正確な原因を特定

## デプロイ関連の問題

### Network Egress Error（ネットワークエラー）

**問題**：Vercelへのデプロイ時にネットワークエラーが発生し、外部ネットワークへのアクセスができないと表示される。

**原因**：claude.ai環境では、デフォルトでネットワークアクセス権限が制限されています。`vercel-deploy-claimable`スキルはファイルをアップロードするために`*.vercel.com`ドメインへのアクセスが必要です。

**解決策**：

::: tip claude.aiでネットワーク権限を設定

1. [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)にアクセス
2. "Allowed Domains"に`*.vercel.com`を追加
3. 設定を保存して再度デプロイ

:::

**検証方法**：

```bash
# ネットワーク接続のテスト（デプロイは実行しない）
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**期待する出力**：
```bash
HTTP/2 200
```

### デプロイ失敗：プレビューURLを取得できない

**問題**：デプロイスクリプトは実行完了するが、"Error: Could not extract preview URL from response"というエラーが表示される。

**原因**：デプロイAPIがエラー応答（`"error"`フィールドを含む）を返しているが、スクリプトはまずURLの取得失敗をチェックします。

ソースコード[`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229)に基づき：

```bash
# Check for error in response
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "Error: $ERROR_MSG" >&2
    exit 1
fi
```

**解決策**：

1. 完全なエラー応答を確認：
```bash
# プロジェクトルートで再度デプロイを実行し、エラーメッセージに注意
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. 一般的なエラーの種類：

| エラーメッセージ | 可能な原因 | 解決策 |
|--- | --- | ---|
| "File too large" | プロジェクトサイズ超過 | 不要なファイルを除外（`*.log`、`*.test.ts`など） |
| "Invalid framework" | フレームワーク識別失敗 | `package.json`を追加するか、手動でフレームワークを指定 |
| "Network timeout" | ネットワークタイムアウト | ネットワーク接続を確認し、再度デプロイ |

**予防策**：

デプロイスクリプトは自動的に`node_modules`と`.git`を除外します（ソースコード[`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)を参照）。さらに最適化できます：

```bash
# deploy.shを変更して除外項目を追加
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='coverage' \
  --exclude='.next' \
  .
```

### フレームワーク検出が不正確

**問題**：デプロイ時に検出されたフレームワークが実際と異なる、または`null`が返される。

**原因**：フレームワーク検出は`package.json`の依存リストに依存します。依存がないか、プロジェクトタイプが特殊な場合、検出が失敗する可能性があります。

ソースコード[`deploy.sh:12-156`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L12-L156)に基づき、検出ロジック：

1. `package.json`を読み込む
2. 特定の依存パッケージ名を確認
3. 優先順位順にマッチ（Blitz → Next.js → Gatsby → ...）

**解決策**：

| シナリオ | 解決方法 |
|--- | ---|
| `package.json`は存在するが検出失敗 | 依存が`dependencies`または`devDependencies`にあるか確認 |
| 純粋な静的HTMLプロジェクト | ルートディレクトリに`index.html`があるか確認。スクリプトは単一のHTMLファイルを自動的にリネームします（ソースコード[`deploy.sh:198-205`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L198-L205)を参照） |
| サポートされていないフレームワーク | 直接デプロイ（frameworkはnull）。Vercelが自動的に検出 |

**手動でのフレームワーク検出確認**：

```bash
# フレームワーク検出のシミュレーション（bash環境が必要）
grep -E '"(next|gatsby|vite|astro)"' package.json
```

## スキルアクティベーション問題

### スキルがアクティブにならない

**問題**：Claudeで関連するプロンプト（"Deploy my app"など）を使用するが、スキルがアクティブにならない。

**原因**：スキルのアクティベーションはプロンプト内のキーワードマッチングに依存します。キーワードが明確でないか、スキルが正しく読み込まれていない場合、AIは使用すべきスキルを識別できません。

**解決策**：

::: warning チェックリスト

1. **スキルがインストールされていることを確認**：
   ```bash
   # Claude Desktopユーザー
   ls ~/.claude/skills/ | grep agent-skills

   # claude.aiユーザー
   プロジェクトナレッジベースにagent-skillsが含まれているか確認
   ```

2. **明確なキーワードを使用**：
   - ✅ 利用可能：`Deploy my app to Vercel`
   - ✅ 利用可能：`Review this React component for performance`
   - ✅ 利用可能：`Check accessibility of my site`
   - ❌ 利用不可：`帮我部署`（キーワード不足）

3. **スキルを再読み込み**：
   - Claude Desktop：終了して再起動
   - claude.ai：ページをリフレッシュ、またはスキルをプロジェクトに再追加

:::

**スキルの説明を確認**：

各スキルの`SKILL.md`ファイルの先頭には、トリガーキーワードを説明する説明が含まれています。例：

- `vercel-deploy`：キーワードには"Deploy"、"deploy"、"production"が含まれる
- `react-best-practices`：キーワードには"React"、"component"、"performance"が含まれる

### Webデザインガイドラインのルール取得不可

**問題**：`web-design-guidelines`スキル使用時、GitHubからルールを取得できないというエラーが表示される。

**原因**：このスキルは最新のルールを取得するためにGitHubリポジトリへのアクセスが必要ですが、claude.aiはデフォルトでネットワークアクセスを制限しています。

**解決策**：

1. [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)に以下を追加：
   - `raw.githubusercontent.com`
   - `github.com`

2. ネットワークアクセスを検証：
```bash
# ルールソースにアクセスできるかテスト
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**代替案**：ネットワークが制限されている場合、ルールファイルを手動でダウンロードしてローカルに配置し、スキル定義をローカルパスに向けて変更します。

## ルール検証問題

### VALIDATION_ERROR

**問題**：`pnpm validate`実行時にエラーが発生し、ルール検証失敗と表示される。

**原因**：ルールファイルのフォーマットが規格に準拠していない、必須フィールドが欠けている、またはサンプルコードがない。

ソースコード[`validate.ts:21-66`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66)に基づき、検証ルール：

1. **title非空**：ルールにはタイトルが必要
2. **explanation非空**：ルールには説明が必要
3. **examples非空**：少なくとも1つのコード例を含む
4. **impactレベル有効**：`CRITICAL`/`HIGH`/`MEDIUM-HIGH`/`MEDIUM`/`LOW-MEDIUM`/`LOW`のいずれかである必要がある
5. **サンプルコード完全**：少なくとも"Incorrect/Correct"の比較を含む

**解決策**：

::: tip 検証エラーの例と修正方法

| エラーメッセージ | 原因 | 修正方法 |
|--- | --- | ---|
| `Missing or empty title` | frontmatterに`title`がない | ルールファイルの先頭に追加：<br>`---`<br>`title: "ルールタイトル"`<br>`---` |
| `Missing or empty explanation` | ルール説明がない | frontmatterに`explanation`フィールドを追加 |
| `Missing examples` | コード例がない | `**Incorrect:**`と`**Correct:**`コードブロックを追加 |
| `Invalid impact level` | impact値が間違っている | frontmatterの`impact`が有効な列挙値か確認 |
| `Missing bad/incorrect or good/correct examples` | サンプルラベルが一致しない | サンプルラベルに"Incorrect"または"Correct"が含まれているか確認 |

:::

**完全なデモ**：

```markdown
---
title: "My Rule"
impact: "CRITICAL"
explanation: "ルールの説明文"
---

## My Rule

**Incorrect:**
\`\`\`typescript
// 間違った例
\`\`\`

**Correct:**
\`\`\`typescript
// 正しい例
\`\`\`
```

**検証の実行**：

```bash
cd packages/react-best-practices-build
pnpm validate
```

**期待する出力**：
```
Validating rule files...
Rules directory: ../../skills/react-best-practices/rules
✓ All 57 rule files are valid
```

### ルールファイルの解析失敗

**問題**：検証時に`Failed to parse: ...`というエラーが表示される。通常はMarkdownフォーマットエラーが原因。

**原因**：frontmatter YAMLフォーマットエラー、見出しレベルの不適切さ、またはコードブロックの構文エラー。

**解決策**：

1. **frontmatterの確認**：
   - 三つのハイフン`---`で囲む
   - コロンの後にスペースが必要
   - 文字列値は二重引用符を使用することを推奨

2. **見出しレベルの確認**：
   - ルールタイトルは`##`（H2）を使用
   - サンプルラベルは`**Incorrect:**`と`**Correct:**`を使用

3. **コードブロックの確認**：
   - 三つのバッククォート\`\`\`でコードを囲む
   - 言語タイプを指定（例：`typescript`）

**よくあるエラーの例**：

```markdown
# ❌ エラー：frontmatterのコロンの後にスペースがない
---
title:"my rule"
---

# ✅ 正解
---
title: "my rule"
---

# ❌ エラー：サンプルラベルにコロンがない
**Incorrect**
\`\`\`typescript
code
\`\`\`

# ✅ 正解
**Incorrect:**
\`\`\`typescript
code
\`\`\`
```

## ファイル権限の問題

### ~/.claude/skills/に書き込めない

**問題**：インストールコマンド実行時に権限エラーが表示される。

**原因**：`~/.claude`ディレクトリが存在しない、または現在のユーザーに書き込み権限がない。

**解決策**：

```bash
# ディレクトリを手動で作成
mkdir -p ~/.claude/skills

# スキルパッケージをコピー
cp -r agent-skills/* ~/.claude/skills/

# 権限を確認
ls -la ~/.claude/skills/
```

**期待する出力**：
```
drwxr-xr-x  user group  size  date  react-best-practices/
drwxr-xr-x  user group  size  date  web-design-guidelines/
drwxr-xr-x  user group  size  date  vercel-deploy-claimable/
```

### Windowsユーザーのパス問題

**問題**：Windowsでデプロイスクリプトを実行する際、パス形式が間違っている。

**原因**：Windowsはパス区切り文字としてバックスラッシュ`\`を使用しますが、Bashスクリプトはスラッシュ`/`を期待しています。

**解決策**：

::: code-group

```bash [Git Bash / WSL]
# パス形式の変換
INPUT_PATH=$(pwd | sed 's/\\/\//g')
bash deploy.sh "$INPUT_PATH"
```

```powershell [PowerShell]
# PowerShellでパスを変換
$INPUT_PATH = $PWD.Path -replace '\\', '/'
bash deploy.sh "$INPUT_PATH"
```

:::

**ベストプラクティス**：WindowsではGit BashまたはWSLを使用してデプロイスクリプトを実行することを推奨。

## パフォーマンスの問題

### ビルド速度が遅い

**問題**：`pnpm build`の実行速度が遅い。特にルール数が多い場合に顕著。

**原因**：ビルドツールはルールファイルを1つずつ解析します（[`build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)を参照）。並列処理は使用されていません。

**解決策**：

1. **不要なステップをスキップ**：
```bash
# ビルドのみ、検証はしない
pnpm build

# 検証のみ、ビルドはしない
pnpm validate
```

2. **キャッシュをクリア**：
```bash
rm -rf node_modules/.cache
pnpm build
```

3. **ハードウェアの最適化**：
   - SSDストレージを使用
   - Node.jsバージョンが20以上であることを確認

### デプロイアップロードが遅い

**問題**：Vercelへのtarballアップロード速度が遅い。

**原因**：プロジェクトサイズが大きい、またはネットワーク帯域幅が不足している。

**解決策**：

1. **プロジェクトサイズを縮小**：
```bash
# tarballサイズを確認
ls -lh .tgz

# 50MBを超える場合は最適化を検討
```

2. **除外ルールを最適化**：

[`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)を変更して除外項目を追加：

```bash
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.vscode' \
  --exclude='dist' \
  --exclude='build' \
  .
```

## まとめ

Agent Skillsのよくある問題は主に以下に集中しています：

1. **ネットワーク権限**：claude.aiではアクセスを許可するドメインを設定する必要がある
2. **スキルアクティベーション**：明確なキーワードを使用してスキルをトリガーする
3. **ルール検証**：`_template.md`テンプレートに従ってフォーマットが正しいことを確認する
4. **フレームワーク検出**：`package.json`に正しい依存関係が含まれていることを確認する

問題が発生した場合、まずエラーメッセージとソースコード内のエラー処理ロジック（`validate.ts`や`deploy.sh`など）を確認することを推奨します。

## ヘルプの入手

上記の方法で問題が解決できない場合：

1. **ソースコードを確認**：
   - デプロイスクリプト：[`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
   - 検証スクリプト：[`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
   - スキル定義：[`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **GitHub Issues**：[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues)で問題を報告

3. **コミュニティディスカッション**：関連技術フォーラム（Twitter、Discordなど）でヘルプを求める

## 次回の予告

> 次回は**[ベストプラクティスの使用](../best-practices/)**を学びます。
>
> 学ぶこと：
> > - スキルを効率的にトリガーするキーワードの選択
> > - コンテキスト管理のテクニック
> > - 複数スキルの連携シナリオ
> > - パフォーマンス最適化の提案

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| ネットワークエラー処理 | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113) | 100-113 |
| ルール検証ロジック | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66 |
| フレームワーク検出ロジック | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156 |
| デプロイエラー処理 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239 |
| 静的HTML処理 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**重要な定数**：
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`：デプロイAPIエンドポイント

**重要な関数**：
- `detect_framework()`：package.jsonからフレームワークタイプを検出
- `validateRule()`：ルールファイルフォーマットの完全性を検証
- `cleanup()`：一時ファイルをクリーンアップ

**エラーコード**：
- `VALIDATION_ERROR`：ルール検証失敗
- `INPUT_INVALID`：デプロイ入力無効（ディレクトリまたは.tgzではない）
- `API_ERROR`：デプロイAPIがエラーを返した

</details>
