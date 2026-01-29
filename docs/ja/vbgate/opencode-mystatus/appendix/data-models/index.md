---
title: "データモデル: 認証ファイルとAPI応答形式 | opencode-mystatus"
sidebarTitle: "データモデル"
subtitle: "データモデル：認証ファイル構造とAPI応答形式"
description: "opencode-mystatusの認証ファイル構造とAPI応答形式を学びます。auth.jsonなどの読み取り方法と各プラットフォームの応答解析を理解できます。"
tags:
  - "データモデル"
  - "認証ファイル"
  - "API応答"
prerequisite:
  - "start-quick-start"
order: 1
---

# データモデル：認証ファイル構造とAPI応答形式

> 💡 **この付録は開発者向けです**：プラグインがどのように認証ファイルを読み取り・解析するかを理解したい、または新しいプラットフォームのサポートを拡張したい場合に、完全なデータモデル参照資料があります。

## 学習後のスキル

- プラグインがどの認証ファイルを読み取るか理解
- 各プラットフォームAPIの応答形式を理解
- 新しいプラットフォームをサポート拡張する方法を知る

## 認証ファイル構造

### メイン認証ファイル：`~/.local/share/opencode/auth.json`

OpenCode公式認証ストレージ。プラグインはここからOpenAI、Zhipu AI、Z.ai、GitHub Copilotの認証情報を読み取ります。

#### OpenAI認証データ

```typescript
interface OpenAIAuthData {
  type: string;        // 固定値 "oauth"
  access?: string;     // OAuth Access Token
  refresh?: string;    // OAuth Refresh Token
  expires?: number;    // 期限切れタイムスタンプ（ミリ秒）
}
```

#### Zhipu AI / Z.ai認証データ

```typescript
interface ZhipuAuthData {
  type: string;   // 固定値 "api"
  key?: string;    // API Key
}
```

#### GitHub Copilot認証データ

```typescript
interface CopilotAuthData {
  type: string;        // 固定値 "oauth"
  refresh?: string;     // OAuth Token
  access?: string;      // Copilot Session Token（オプション）
  expires?: number;    // 期限切れタイムスタンプ（ミリ秒）
}
```

### Copilot PAT設定：`~/.config/opencode/copilot-quota-token.json`

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT（"Plan"読み取り権限が必要） */
  token: string;

  /** GitHubユーザー名（API呼び出しに必要） */
  username: string;

  /** Copilotサブスクリプションタイプ（月次クォータ上限を決定） */
  tier: CopilotTier;
}
```

### Google Cloudアカウント：`~/.config/opencode/antigravity-accounts.json`

```typescript
interface AntigravityAccountsFile {
  version: number;               // ファイル形式バージョン番号
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Googleメール（表示用） */
  email?: string;

  /** OAuth Refresh Token（必須） */
  refreshToken: string;

  /** GoogleプロジェクトID（二選一） */
  projectId?: string;

  /** マネージドプロジェクトID（二選一） */
  managedProjectId?: string;

  /** アカウント追加タイムスタンプ（ミリ秒） */
  addedAt: number;

  /** 最終使用タイムスタンプ（ミリ秒） */
  lastUsed: number;

  /** 各モデルリセット時間（モデルkey → タイムスタンプ） */
  rateLimitResetTimes?: Record<string, number>;
}
```

## API応答形式

### OpenAI応答形式

**APIエンドポイント**：`GET https://chatgpt.com/backend-api/wham/usage`

```typescript
interface OpenAIUsageResponse {
  /** プランタイプ：plus、team、proなど */
  plan_type: string;

  /** クォータ制限情報 */
  rate_limit: {
    /** 制限に達したか */
    limit_reached: boolean;

    /** メインウィンドウ（3時間） */
    primary_window: RateLimitWindow;

    /** セカンダリウィンドウ（24時間、オプション） */
    secondary_window: RateLimitWindow | null;
  } | null;
}
```

### Zhipu AI / Z.ai応答形式

**APIエンドポイント**：
- Zhipu AI：`GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai：`GET https://api.z.ai/api/monitor/usage/quota/limit`

```typescript
interface QuotaLimitResponse {
  code: number;   // 成功時は200
  msg: string;    // エラーメッセージ（成功時は"success"）
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}
```

### GitHub Copilot応答形式

#### 方式1：内部API（Copilot権限が必要）

**APIエンドポイント**：`GET https://api.github.com/copilot_internal/user`

```typescript
interface CopilotUsageResponse {
  /** SKUタイプ（サブスクリプションを区別するため） */
  access_type_sku: string;

  /** Copilotプランタイプ */
  copilot_plan: string;

  /** クォータリセット日付（形式：YYYY-MM） */
  quota_reset_date: string;

  /** クォータスナップショット */
  quota_snapshots: QuotaSnapshots;
}
```

#### 方式2：公共Billing API（Fine-grained PATが必要）

**APIエンドポイント**：`GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

```typescript
interface BillingUsageResponse {
  /** 時間周期 */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** ユーザー名 */
  user: string;

  /** 使用項目リスト */
  usageItems: BillingUsageItem[];
}
```

### Google Cloud応答形式

**APIエンドポイント**：`POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

```typescript
interface GoogleQuotaResponse {
  /** モデルリスト（keyはモデルID） */
  models: Record<
    string,
    {
      /** クォータ情報（オプション） */
      quotaInfo?: {
        /** 残り比率（0-1） */
        remainingFraction?: number;

        /** リセット時間（ISO 8601形式） */
        resetTime?: string;
      };
    }
  >;
}
```

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| 認証データ型 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 99-104 |

</details>
