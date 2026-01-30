---
title: "対応ターミナル：37以上のターミナルエミュレータ完全対応と自動検出の仕組み | opencode-notify チュートリアル"
sidebarTitle: "対応ターミナル一覧"
subtitle: "対応ターミナル一覧：37以上のターミナルエミュレータを完全サポート"
description: "opencode-notify が対応する37以上のターミナルエミュレータについて学びます。macOS、Windows、Linux プラットフォームの完全なターミナル一覧を紹介。ターミナル自動検出の仕組み、手動指定方法、ターミナル認識失敗時の解決策を解説し、通知体験の最適化、スマートフィルタリング機能の有効化、通知ノイズの削減、ウィンドウ切り替えの最小化、集中作業状態の維持、作業効率と体験の向上をサポートします。"
tags:
  - "ターミナル"
  - "ターミナル検出"
  - "プラットフォーム対応"
prerequisite:
  - "start-quick-start"
order: 60
---

# 対応ターミナル一覧：37以上のターミナルエミュレータを完全サポート

## このチュートリアルで学べること

- opencode-notify が対応するすべてのターミナルエミュレータを把握する
- 使用中のターミナルが対応リストに含まれているか確認する
- ターミナル自動検出の仕組みを理解する
- ターミナルタイプを手動で指定する方法を習得する

## 現在の課題

opencode-notify をインストールしたものの、通知機能が正常に動作しない。ターミナルが認識されない、またはフォーカス検出が機能しない可能性があります。Alacritty / Windows Terminal / tmux を使用しているが、対応しているか不明。ターミナル認識に失敗すると、スマートフィルタリング機能が無効になり、使用体験に影響します。

## この機能を使うタイミング

**以下のシナリオで対応ターミナル一覧を確認してください**：
- 使用中のターミナルが対応しているか知りたい
- ターミナル自動検出が失敗し、手動設定が必要
- 複数のターミナルを切り替えて使用しており、互換性を確認したい
- ターミナル検出の技術的な仕組みを知りたい

## 基本コンセプト

opencode-notify は `detect-terminal` ライブラリを使用してターミナルエミュレータを自動認識し、**37以上のターミナルに対応**しています。検出に成功すると、プラグインは以下の機能を提供できます：
- **フォーカス検出**（macOS のみ）：ターミナルがフォアグラウンドにある時は通知を抑制
- **クリックでフォーカス**（macOS のみ）：通知をクリックするとターミナルウィンドウに切り替え

::: info なぜターミナル検出が重要なのか？

ターミナル検出はスマートフィルタリングの基盤です：
- **フォーカス検出**：ターミナルを見ている時に通知が表示されるのを防ぐ
- **クリックでフォーカス**：macOS ユーザーは通知をクリックして直接ターミナルに戻れる
- **パフォーマンス最適化**：ターミナルによって特別な処理が必要な場合がある

検出に失敗しても通知機能は使用可能ですが、スマートフィルタリングは無効になります。
:::

## 対応ターミナル一覧

### macOS ターミナル

| ターミナル名 | プロセス名 | 機能 |
| --- | --- | --- |
| **Ghostty** | Ghostty | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **iTerm2** | iTerm2 | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **Kitty** | kitty | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **WezTerm** | WezTerm | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **Alacritty** | Alacritty | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **Terminal.app** | Terminal | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **Hyper** | Hyper | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **Warp** | Warp | ✅ フォーカス検出 + ✅ クリックでフォーカス |
| **VS Code 統合ターミナル** | Code / Code - Insiders | ✅ フォーカス検出 + ✅ クリックでフォーカス |

::: tip macOS ターミナルの特徴
macOS ターミナルはフル機能をサポート：
- ネイティブ通知（Notification Center）
- フォーカス検出（AppleScript 経由）
- 通知クリックでターミナルに自動フォーカス
- カスタムシステムサウンド

すべてのターミナルは macOS Notification Center を使用して通知を送信します。
:::

### Windows ターミナル

| ターミナル名 | 機能 |
| --- | --- |
| **Windows Terminal** | ✅ ネイティブ通知（Toast） |
| **Git Bash** | ✅ ネイティブ通知（Toast） |
| **ConEmu** | ✅ ネイティブ通知（Toast） |
| **Cmder** | ✅ ネイティブ通知（Toast） |
| **PowerShell** | ✅ ネイティブ通知（Toast） |
| **VS Code 統合ターミナル** | ✅ ネイティブ通知（Toast） |
| **その他の Windows ターミナル** | ✅ ネイティブ通知（Toast） |

::: details Windows ターミナルの制限
Windows プラットフォームの機能は比較的基本的です：
- ✅ ネイティブ通知（Windows Toast）
- ✅ ターミナル検出
- ❌ フォーカス検出（システム制限）
- ❌ クリックでフォーカス（システム制限）

すべての Windows ターミナルは Windows Toast で通知を送信し、システムデフォルトのサウンドを使用します。
:::

### Linux ターミナル

| ターミナル名 | 機能 |
| --- | --- |
| **konsole** | ✅ ネイティブ通知（notify-send） |
| **xterm** | ✅ ネイティブ通知（notify-send） |
| **lxterminal** | ✅ ネイティブ通知（notify-send） |
| **alacritty** | ✅ ネイティブ通知（notify-send） |
| **kitty** | ✅ ネイティブ通知（notify-send） |
| **wezterm** | ✅ ネイティブ通知（notify-send） |
| **VS Code 統合ターミナル** | ✅ ネイティブ通知（notify-send） |
| **その他の Linux ターミナル** | ✅ ネイティブ通知（notify-send） |

::: details Linux ターミナルの制限
Linux プラットフォームの機能は比較的基本的です：
- ✅ ネイティブ通知（notify-send）
- ✅ ターミナル検出
- ❌ フォーカス検出（システム制限）
- ❌ クリックでフォーカス（システム制限）

すべての Linux ターミナルは notify-send で通知を送信し、デスクトップ環境のデフォルトサウンドを使用します。
:::

### その他の対応ターミナル

`detect-terminal` ライブラリは以下のターミナルにも対応しています（完全なリストではない場合があります）：

**Windows / WSL**：
- WSL ターミナル
- Windows Command Prompt (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**：
- tmux（環境変数で検出）
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip ターミナル数の統計
opencode-notify は `detect-terminal` ライブラリを通じて **37以上のターミナルエミュレータ** に対応しています。
使用中のターミナルがリストにない場合は、[detect-terminal 完全リスト](https://github.com/jonschlinkert/detect-terminal#supported-terminals)を参照してください。
:::

## ターミナル検出の仕組み

### 自動検出フロー

プラグイン起動時にターミナルタイプを自動検出します：

```
1. detect-terminal() ライブラリを呼び出し
    ↓
2. システムプロセスをスキャンし、現在のターミナルを識別
    ↓
3. ターミナル名を返す（例："ghostty", "kitty"）
    ↓
4. マッピングテーブルを検索し、macOS プロセス名を取得
    ↓
5. macOS: Bundle ID を動的に取得
    ↓
6. ターミナル情報を保存し、以降の通知に使用
```

### macOS ターミナルマッピングテーブル

ソースコードには一般的なターミナルのプロセス名マッピングが事前定義されています：

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details 検出ソースコード
完全なターミナル検出ロジック：

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null
    
    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }
    
    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName
    
    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)
    
    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### macOS 特有の処理

macOS プラットフォームには追加の検出ステップがあります：

1. **Bundle ID の取得**：`osascript` を使用してアプリケーションの Bundle ID を動的に取得（例：`com.mitchellh.ghostty`）
2. **フォーカス検出**：`osascript` を使用してフォアグラウンドアプリのプロセス名を取得
3. **クリックでフォーカス**：通知に `activate` パラメータを設定し、クリック時に Bundle ID でターミナルに切り替え

::: info 動的 Bundle ID のメリット
ソースコードは Bundle ID をハードコードせず、`osascript` で動的に取得します。これにより：
- ✅ ターミナルのアップデートに対応（Bundle ID が変わらない限り）
- ✅ メンテナンスコストの削減（リストの手動更新が不要）
- ✅ 互換性の向上（理論上すべての macOS ターミナルに対応）
:::

### tmux ターミナルのサポート

tmux はターミナルマルチプレクサで、プラグインは環境変数で tmux セッションを検出します：

```bash
# tmux セッション内
echo $TMUX
# 出力: /tmp/tmux-1000/default,1234,0

# tmux 外
echo $TMUX
# 出力: (空)
```

::: tip tmux ワークフローのサポート
tmux ユーザーは通知機能を正常に使用できます：
- tmux セッションを自動検出
- 現在のターミナルウィンドウに通知を送信
- **フォーカス検出は行わない**（tmux マルチウィンドウワークフローをサポート）
:::

## ターミナルの手動指定

自動検出が失敗した場合、設定ファイルでターミナルタイプを手動で指定できます。

### 手動指定が必要なケース

以下の場合は手動設定が必要です：
- 使用中のターミナルが `detect-terminal` の対応リストにない
- あるターミナル内で別のターミナルをネストして使用している（例：tmux + Alacritty）
- 自動検出結果が正しくない（別のターミナルとして誤認識）

### 設定方法

**ステップ 1：設定ファイルを開く**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**ステップ 2：terminal 設定を追加**

```json
{
  "terminal": "ghostty"
}
```

**ステップ 3：保存して OpenCode を再起動**

### 使用可能なターミナル名

ターミナル名は `detect-terminal` ライブラリが認識する名前である必要があります。一般的な名前：

| ターミナル | 設定値 |
| --- | --- |
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` または `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` または `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` または `"Windows Terminal"` |

::: details 完全な使用可能名リスト
完全なリストは [detect-terminal ソースコード](https://github.com/jonschlinkert/detect-terminal)を参照してください。
:::

### macOS ターミナルのフル機能設定例

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Windows/Linux ターミナルの設定例

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Windows/Linux の設定制限
Windows と Linux は `sounds` 設定項目に対応していません（システムデフォルトサウンドを使用）。また、フォーカス検出にも対応していません（システム制限）。
:::

## チェックポイント ✅

読了後、以下を確認してください：

- [ ] 使用中のターミナルが対応しているか把握した
- [ ] ターミナル自動検出の仕組みを理解した
- [ ] ターミナルタイプを手動で指定する方法を把握した
- [ ] プラットフォーム間の機能差異を理解した

## よくある問題と解決策

### よくある問題 1：ターミナル検出の失敗

**症状**：通知が表示されない、またはフォーカス検出が機能しない。

**原因**：`detect-terminal` がターミナルを認識できない。

**解決方法**：

1. ターミナル名が正しいか確認（大文字小文字を区別）
2. 設定ファイルで手動指定：

```json
{
  "terminal": "ターミナル名"
}
```

3. [detect-terminal 対応リスト](https://github.com/jonschlinkert/detect-terminal#supported-terminals)を確認

### よくある問題 2：macOS でクリックフォーカスが機能しない

**症状**：通知をクリックしてもターミナルウィンドウに切り替わらない。

**原因**：Bundle ID の取得に失敗、またはターミナルがマッピングテーブルにない。

**解決方法**：

1. ターミナルが `TERMINAL_PROCESS_NAMES` マッピングテーブルにあるか確認
2. ない場合は、ターミナル名を手動で指定

**検証方法**：

```typescript
// 一時的なデバッグ（notify.ts に console.log を追加）
console.log("Terminal info:", terminalInfo)
// 期待される出力: { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### よくある問題 3：tmux ターミナルでフォーカス検出が機能しない

**症状**：tmux セッション内で、ターミナルがフォアグラウンドにあっても通知が表示される。

**原因**：tmux は独自のセッション管理を持ち、フォーカス検出が正確でない場合がある。

**説明**：これは正常な動作です。tmux ワークフローではフォーカス検出機能に制限がありますが、通知は正常に受信できます。

### よくある問題 4：VS Code 統合ターミナルが Code として認識される

**症状**：設定で `"vscode"` と `"vscode-insiders"` の両方が有効だが、どちらを使うべきか不明。

**説明**：
- **VS Code Stable** を使用 → `"vscode"` を設定
- **VS Code Insiders** を使用 → `"vscode-insiders"` を設定

自動検出はインストールされているバージョンに基づいて正しいプロセス名を自動選択します。

### よくある問題 5：Windows Terminal の認識失敗

**症状**：Windows Terminal で "windows-terminal" という名前を使用しているが、検出されない。

**原因**：Windows Terminal のプロセス名は `WindowsTerminal.exe` または `Windows Terminal` の場合がある。

**解決方法**：異なる設定値を試す：

```json
{
  "terminal": "windows-terminal"  // または "Windows Terminal"
}
```

## このチュートリアルのまとめ

このチュートリアルで学んだこと：

- ✅ opencode-notify は 37以上のターミナルエミュレータに対応
- ✅ macOS ターミナルはフル機能をサポート（フォーカス検出 + クリックでフォーカス）
- ✅ Windows/Linux ターミナルは基本的な通知をサポート
- ✅ ターミナル自動検出の仕組みとソースコード実装
- ✅ ターミナルタイプを手動で指定する方法
- ✅ よくあるターミナル認識問題の解決方法

**重要ポイント**：
1. ターミナル検出はスマートフィルタリングの基盤、37以上のターミナルに対応
2. macOS ターミナルが最も機能豊富、Windows/Linux は比較的基本的
3. 自動検出が失敗した場合、ターミナル名を手動で設定可能
4. tmux ユーザーは通知を正常に使用可能だが、フォーカス検出には制限あり
5. macOS の Bundle ID は動的取得で、互換性が向上

## 次のチュートリアル

> 次のチュートリアルでは **[設定リファレンス](../../advanced/config-reference/)** を学びます。
>
> 学べる内容：
> - 完全な設定項目の説明とデフォルト値
> - サウンドのカスタマイズ（macOS）
> - おやすみモードの設定
> - 子セッション通知のオン/オフ
> - ターミナルタイプの上書き
> - 高度な設定テクニック

---

## 付録：ソースコードリファレンス

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日：2026-01-27

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| ターミナルマッピングテーブル | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| ターミナル検出関数 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS Bundle ID 取得 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| macOS フォアグラウンドアプリ検出 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| macOS フォーカス検出 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**主要な定数**：
- `TERMINAL_PROCESS_NAMES`：ターミナル名から macOS プロセス名へのマッピングテーブル

**主要な関数**：
- `detectTerminalInfo()`：ターミナル情報を検出（名前、Bundle ID、プロセス名）
- `detectTerminal()`：detect-terminal ライブラリを呼び出してターミナルを識別
- `getBundleId()`：osascript を使用して macOS アプリの Bundle ID を動的に取得
- `getFrontmostApp()`：現在のフォアグラウンドアプリ名を取得
- `isTerminalFocused()`：ターミナルがフォアグラウンドウィンドウかどうかを検出（macOS のみ）

**外部依存関係**：
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal)：ターミナル検出ライブラリ、37以上のターミナルに対応

</details>
