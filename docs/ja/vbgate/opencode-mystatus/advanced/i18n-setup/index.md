---
title: "多言語サポート: 日英自動切り替え | opencode-mystatus"
sidebarTitle: "多言語サポート"
subtitle: "多言語サポート：日本語と英語の自動切り替え"
description: "opencode-mystatusの多言語サポートを理解します。言語検出原理（Intl APIと環境変数）と出力言語の切り替え方法を学びます。"
tags:
  - "i18n"
  - "internationalization"
  - "language-detection"
  - "multi-language"
prerequisite:
  - "start-quick-start"
order: 3
---

# 多言語サポート：日本語と英語の自動切り替え

## 学習後のスキル

- mystatusが自動的にシステム言語を検出する方法を理解
- 出力言語を変更する方法を知る
- 言語検出の優先順位とフォールバックメカニズムを把握

## 核心概念

**多言語サポート**はシステム言語環境に基づいて自動的に日本語または英語の出力を選択し、手動での設定は不要です。検出優先順位は：Intl API → 環境変数 → デフォルト英語。

**検出優先順位**（高い順）：

1. **Intl API**（推奨）→ `Intl.DateTimeFormat().resolvedOptions().locale`
2. **環境変数**（フォールバック）→ `LANG`、`LC_ALL`、`LANGUAGE`
3. **デフォルト英語**（デフォルト）→ `"en"`

**サポートされる言語**：
| 言語 | コード | 検出条件 |
|--- | --- | ---|
| 日本語 | `ja` | localeが `ja` で始まる（`ja-JP` など） |
| 英語 | `en` | その他の場合 |

## 実践

### ステップ1：現在のシステム言語を確認

```bash
echo $LANG
```

**期待される結果**：
- 日本語システム：`ja_JP.UTF-8` など
- 英語システム：`en_US.UTF-8` など

### ステップ2：言語検出をテスト

```bash
/mystatus
```

**期待される結果**：
- システム言語が日本語の場合 → 日本語出力
- システム言語が英語の場合 → 英語出力

### ステップ3：一時的にシステム言語を切り替え（テスト用）

```bash
LANG=en_US.UTF-8 /mystatus
```

## まとめ

- **自動検出**：mystatusは自動的にシステム言語を検出し、手動での設定は不要
- **検出優先順位**：Intl API → 環境変数 → デフォルト英語
- **サポート言語**：日本語（ja）と英語（en）
- **言語切り替え**：システム言語設定を変更し、OpenCodeを再起動

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| 言語検出関数 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |

</details>
