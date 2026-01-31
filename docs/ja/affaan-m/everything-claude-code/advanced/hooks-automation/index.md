---
title: "フック自動化: 15+フックの詳細解説 | Everything Claude Code"
sidebarTitle: "Claudeに自動で作業させる"
subtitle: "フック自動化：15以上のフックの詳細解説"
description: "Everything Claude Codeの15以上の自動化フックメカニズムを学習します。チュートリアルでは6種類のフックタイプ、14のコア機能、Node.jsスクリプト実装を解説します。"
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# フック自動化：15以上のフックの詳細解説

## 学習後の到達目標

- Claude Codeの6種類のフックタイプとそのトリガーメカニズムを理解する
- 14の組み込みフックの機能と設定方法を習得する
- Node.jsスクリプトを使用してカスタムフックを作成できるようになる
- セッション開始/終了時に自動でコンテキストを保存・読み込みする
- インテリジェントな圧縮提案、コード自動フォーマットなどの自動化機能を実装する

## 現在直面している課題

Claude Codeが特定のイベントで自動的に操作を実行できるようにしたいと考えています：
- セッション開始時に以前のコンテキストを自動的に読み込む
- コード編集後に自動的にフォーマットする
- コードプッシュ前に変更を確認するよう促す
- 適切なタイミングでコンテキストの圧縮を提案する

しかし、これらの機能は手動でトリガーする必要があります。または、Claude Codeのフックシステムを深く理解して実装する必要があります。このレッスンでは、これらの自動化能力を習得します。

## この機能を使用するタイミング

- セッション間でコンテキストと作業状態を維持したい場合
- コード品質チェック（フォーマット、TypeScriptチェック）を自動実行したい場合
- 特定の操作前にリマインダーを受けたい場合（git push前の変更確認など）
- Token使用量を最適化し、適切なタイミングでコンテキストを圧縮したい場合
- セッションから再利用可能なパターンを自動抽出したい場合

## コアコンセプト

**フックとは**

**フック**はClaude Codeが提供する自動化メカニズムで、特定のイベント発生時にカスタムスクリプトをトリガーできます。これは「イベントリスナー」のようなもので、条件が満たされると自動的に事前に定義された操作を実行します。

::: info フックの仕組み

```
ユーザー操作 → イベントトリガー → フックチェック → スクリプト実行 → 結果出力
    ↓           ↓            ↓           ↓           ↓
   ツール使用   PreToolUse   条件一致   Node.jsスクリプト   コンソール出力
```

例えば、Bashツールで`npm run dev`を実行した場合：
1. PreToolUseフックがコマンドパターンを検出
2. tmux内でない場合、自動的にブロックしてプロンプトを表示
3. プロンプトを確認した後、正しい方法で起動

:::

**6種類のフックタイプ**

Everything Claude Codeは6種類のフックタイプを使用します：

| フックタイプ | トリガータイミング | 使用シナリオ |
|--- | --- | ---|
| **PreToolUse** | ツール実行前 | コマンド検証、操作ブロック、提案プロンプト |
| **PostToolUse** | ツール実行後 | 自動フォーマット、タイプチェック、ログ記録 |
| **PreCompact** | コンテキスト圧縮前 | 状態保存、圧縮イベント記録 |
| **SessionStart** | 新しいセッション開始時 | コンテキスト読み込み、パッケージマネージャー検出 |
| **SessionEnd** | セッション終了時 | 状態保存、セッション評価、パターン抽出 |
| **Stop** | 各レスポンス終了時 | 変更ファイルチェック、クリーンアップ促し |

::: tip フックの実行順序

完全なセッションライフサイクルでは、フックは以下の順序で実行されます：

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

ここで`[PreToolUse → PostToolUse]`はツール使用ごとに繰り返し実行されます。

:::

**フックのマッチングルール**

各フックは`matcher`式を使用して実行するかどうかを決定します。Claude CodeはJavaScript式を使用し、以下をチェックできます：

- ツールタイプ：`tool == "Bash"`、`tool == "Edit"`
- コマンド内容：`tool_input.command matches "npm run dev"`
- ファイルパス：`tool_input.file_path matches "\\.ts$"`
- 複合条件：`tool == "Bash" && tool_input.command matches "git push"`

**Node.jsスクリプトを使用する理由**

Everything Claude Codeのすべてのフックは、ShellスクリプトではなくNode.jsスクリプトで実装されています。理由は以下の通りです：

| 優位性 | Shellスクリプト | Node.jsスクリプト |
|--- | --- | ---|
| **クロスプラットフォーム** | ❌ Windows/macOS/Linuxごとの分岐が必要 | ✅ 自動クロスプラットフォーム |
| **JSON処理** | ❌ 追加ツール（jq）が必要 | ✅ ネイティブサポート |
| **ファイル操作** | ⚠️ コマンドが複雑 | ✅ fs APIが簡潔 |
| **エラーハンドリング** | ❌ 手動実装が必要 | ✅ try/catchネイティブサポート |

## 実践チュートリアル

### 手順1：現在のフック設定を確認

**なぜ必要か**
既存のフック設定を理解し、どの自動化機能が有効になっているかを把握するため

```bash
## hooks.json設定を確認
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**期待される出力**：6種類のフックタイプ定義を含むJSON設定ファイル

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### 手順2：PreToolUseフックを理解

**なぜ必要か**
PreToolUseは最も一般的に使用されるフックタイプで、操作をブロックしたりプロンプトを提供したりできます

Everything Claude Codeの5つのPreToolUseフックを見てみましょう：

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**機能**：tmux外でのdev server起動をブロック

**なぜ必要か**：tmuxでdev serverを実行するとセッションを分離でき、Claude Codeを閉じてもログを確認し続けることができます

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**機能**：`git push`前に変更を確認するようリマインダー

**なぜ必要か**：未レビューのコードを誤ってコミットするのを防ぐため

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**機能**：ドキュメント以外の.mdファイル作成をブロック

**なぜ必要か**：ドキュメントが分散するのを防ぎ、プロジェクトを整理された状態に保つため

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**機能**：ファイル編集または書き込み時にコンテキスト圧縮を提案

**なぜ必要か**：適切なタイミングで手動圧縮を行い、コンテキストを簡潔に保つため

### 手順3：PostToolUseフックを理解

**なぜ必要か**
PostToolUseは操作完了後に自動実行され、自動品質チェックに適しています

Everything Claude Codeには4つのPostToolUseフックがあります：

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**機能**：.js/.ts/.jsx/.tsxファイル編集後に自動でPrettierを実行してフォーマット

**なぜ必要か**：コードスタイルを一貫させるため

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**機能**：.ts/.tsxファイル編集後に自動でTypeScriptタイプチェックを実行

**なぜ必要か**：タイプエラーを早期発見するため

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**機能**：ファイル編集後にconsole.logステートメントがあるかチェック

**なぜ必要か**：デバッグコードをコミットするのを防ぐため

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**機能**：PR作成後に自動でPR URLとレビューコマンドを出力

**なぜ必要か**：新しく作成したPRに素早くアクセスできるようにするため

### 手順4：セッションライフサイクルフックを理解

**なぜ必要か**
SessionStartとSessionEndフックはセッション間のコンテキスト永続化に使用されます

#### SessionStart Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**機能**：
- 過去7日間のセッションファイルをチェック
- 学習したskillsをチェック
- パッケージマネージャーを検出
- 読み込み可能なコンテキスト情報を出力

**スクリプトロジック**（`session-start.js`）：

```javascript
// 過去7日間のセッションファイルをチェック
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// 学習したskillsをチェック
const learnedSkills = findFiles(learnedDir, '*.md');

// パッケージマネージャーを検出
const pm = getPackageManager();

// デフォルト値が使用されている場合、選択を促す
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### SessionEnd Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**機能**：
- セッションファイルの作成または更新
- セッションの開始時刻と終了時刻を記録
- セッションテンプレートの生成（完了、進行中、メモ）

**セッションファイルテンプレート**（`session-end.js`）：

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
[relevant files]
```

テンプレートの`[Session context goes here]`と`[relevant files]`はプレースホルダーで、実際のセッション内容と関連ファイルを手動で入力する必要があります。

### 手順5：圧縮関連フックを理解

**なぜ必要か**
PreCompactとStopフックはコンテキスト管理と圧縮判断に使用されます

#### PreCompact Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**機能**：
- 圧縮イベントをログに記録
- アクティブなセッションファイルに圧縮が発生した時刻をマーク

**スクリプトロジック**（`pre-compact.js`）：

```javascript
// 圧縮イベントを記録
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// セッションファイルにマーク
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Stop Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**機能**：変更されたすべてのファイルにconsole.logがあるかチェック

**なぜ必要か**：最後の防衛線として、デバッグコードのコミットを防ぐため

### 手順6：継続的学習フックを理解

**なぜ必要か**
Evaluate Sessionフックはセッションから再利用可能なパターンを抽出するために使用されます

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**機能**：
- セッション記録（transcript）を読み込む
- ユーザーメッセージ数を統計
- セッション長が十分である場合（デフォルト > 10メッセージ）、抽出可能なパターンの評価を促す

**スクリプトロジック**（`evaluate-session.js`）：

```javascript
// 設定を読み込み
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// ユーザーメッセージを統計
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// 短いセッションはスキップ
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// 評価を促す
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### 手順7：カスタムフックの作成

**なぜ必要か**
プロジェクトの要件に応じて、独自の自動化ルールを作成するため

**例：本番環境での危険なコマンド実行をブロック**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**設定手順**：

1. カスタムフックスクリプトを作成：
   ```bash
   # scripts/hooks/custom-hook.jsを作成
   vi scripts/hooks/custom-hook.js
   ```

2. `~/.claude/settings.json`を編集：
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Claude Codeを再起動

**期待される出力**：フックトリガー時の出力情報

## チェックポイント ✅

以下の要点を理解しているか確認してください：

- [ ] フックはイベント駆動の自動化メカニズムである
- [ ] Claude Codeには6種類のフックタイプがある
- [ ] PreToolUseはツール実行前にトリガーされ、操作をブロックできる
- [ ] PostToolUseはツール実行後にトリガーされ、自動チェックに適している
- [ ] SessionStart/SessionEndはセッション間のコンテキスト永続化に使用される
- [ ] Everything Claude CodeはNode.jsスクリプトを使用してクロスプラットフォーム互換性を実現している
- [ ] `~/.claude/settings.json`を変更することでフックをカスタマイズできる

## よくある落とし穴

### ❌ フックスクリプトのエラーでセッションがフリーズ

**問題**：フックスクリプトが例外をスローした後、適切に終了しないため、Claude Codeがタイムアウトまで待機する

**原因**：Node.jsスクリプトのエラーが適切にキャッチされていない

**解決方法**：
```javascript
// エラー例
main();  // 例外がスローされると問題が発生

// 正しい例
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // エラーが発生しても正常に終了
});
```

### ❌ Shellスクリプト使用によるクロスプラットフォーム問題

**問題**：Windowsで実行時にShellスクリプトが失敗する

**原因**：Shellコマンドが異なるOSで互換性がない

**解決方法**：Shellスクリプトの代わりにNode.jsスクリプトを使用する

| 機能 | Shellスクリプト | Node.jsスクリプト |
|--- | --- | ---|
| ファイル読み取り | `cat file.txt` | `fs.readFileSync('file.txt')` |
| ディレクトリチェック | `[ -d dir ]` | `fs.existsSync(dir)` |
| 環境変数 | `$VAR` | `process.env.VAR` |

### ❌ フック出力過多によるコンテキスト肥大化

**問題**：各操作で大量のデバッグ情報が出力され、コンテキストが急速に肥大化する

**原因**：フックスクリプトが過度にconsole.logを使用している

**解決方法**：
- 必要な情報のみを出力
- 重要なプロンプトには`console.error`を使用（Claude Codeでハイライト表示される）
- 必要時のみ出力する条件出力を使用

```javascript
// エラー例
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // 出力過多

// 正しい例
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUseフックが必要な操作をブロック

**問題**：フックのマッチングルールが広すぎて、正常な操作を誤ってブロックする

**原因**：matcher式がシナリオを正確にマッチしていない

**解決方法**：
- matcher式の正確性をテスト
- トリガー範囲を制限するための条件を追加
- 明確なエラーメッセージと解決策を提供

```json
// エラー例：すべてのnpmコマンドにマッチ
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// 正しい例：devコマンドのみにマッチ
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## まとめ

**6種類のフックタイプの要約**：

| フックタイプ | トリガータイミング | 典型的な用途 | Everything Claude Codeの数 |
|--- | --- | --- | ---|
| PreToolUse | ツール実行前 | 検証、ブロック、プロンプト | 5個 |
| PostToolUse | ツール実行後 | フォーマット、チェック、記録 | 4個 |
| PreCompact | コンテキスト圧縮前 | 状態保存 | 1個 |
| SessionStart | 新セッション開始 | コンテキスト読み込み、PM検出 | 1個 |
| SessionEnd | セッション終了 | 状態保存、セッション評価 | 2個 |
| Stop | レスポンス終了 | 変更チェック | 1個 |

**コア要点**：

1. **フックはイベント駆動**：特定のイベント時に自動実行
2. **Matcherがトリガーを決定**：JavaScript式を使用して条件をマッチ
3. **Node.jsスクリプトで実装**：クロスプラットフォーム互換、Shellスクリプトを回避
4. **エラーハンドリングが重要**：スクリプトエラーでも正常終了が必要
5. **出力は簡潔に**：過度なログによるコンテキスト肥大化を回避
6. **設定はsettings.jsonに**：`~/.claude/settings.json`を変更してカスタムフックを追加

**ベストプラクティス**：

```
1. PreToolUseを使用して危険な操作を検証
2. PostToolUseを使用して品質チェックを自動化
3. SessionStart/Endを使用してコンテキストを永続化
4. カスタムフック作成時にmatcher式をテスト
5. スクリプトでtry/catchとprocess.exit(0)を使用
6. 必要な情報のみを出力し、コンテキスト肥大化を回避
```

## 次回のレッスン

> 次回のレッスンでは**[継続的学習メカニズム](../continuous-learning/)**を学習します。
>
> 学習できること：
> - Continuous Learningがどのように再利用可能なパターンを自動抽出するか
> - `/learn`コマンドを使用してパターンを手動抽出する方法
> - セッション評価の最小長を設定する方法
> - learned skillsディレクトリを管理する方法

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-25

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| フックメイン設定 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStartスクリプト | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEndスクリプト | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompactスクリプト | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compactスクリプト | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Sessionスクリプト | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| ユーティリティライブラリ | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| パッケージマネージャー検出 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**重要な定数**：
- なし（設定は動的に読み込まれる）

**重要な関数**：
- `getSessionsDir()`：セッションディレクトリパスを取得
- `getLearnedSkillsDir()`：learned skillsディレクトリパスを取得
- `findFiles(dir, pattern, options)`：ファイルを検索、時間によるフィルタリングをサポート
- `ensureDir(path)`：ディレクトリが存在することを確認、存在しない場合は作成
- `getPackageManager()`：パッケージマネージャーを検出（6種類の優先度をサポート）
- `log(message)`：フックログ情報を出力

**重要な設定**：
- `min_session_length`：セッション評価の最小メッセージ数（デフォルト10）
- `COMPACT_THRESHOLD`：圧縮提案のツール呼び出ししきい値（デフォルト50）
- `CLAUDE_PLUGIN_ROOT`：プラグインルートディレクトリ環境変数

**14のコアフック**：
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
