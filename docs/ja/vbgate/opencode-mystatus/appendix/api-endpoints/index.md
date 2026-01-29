---
title: "API仕様一覧 | opencode-mystatus"
sidebarTitle: "API仕様"
subtitle: "APIエンドポイント仕様一覧"
description: "opencode-mystatusが使用するAPIエンドポイントを学びます。OpenAI、Zhipu AI、Google Cloud、Copilotの認証方式と応答形式を把握します。"
tags:
  - "api"
  - "endpoints"
  - "reference"
prerequisite:
  - "appendix-data-models"
order: 2
---

# APIエンドポイント集計

## OpenAIインターフェース

### クォータクエリ

**インターフェース情報**：

| 項目 | 値 |
| --- | --- |
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| メソッド | GET |
| 認証方式 | Bearer Token (OAuth) |

**リクエストヘッダー**：

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // オプション、チームアカウントに必要
```

**応答例**：

```json
{
  "plan_type": "Plus",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9180
    },
    "secondary_window": {
      "used_percent": 5,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 82800
    }
  }
}
```

## Zhipu AIインターフェース

### クォータクエリ

**インターフェース情報**：

| 項目 | 値 |
| --- | --- |
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| メソッド | GET |
| 認証方式 | API Key |

**リクエストヘッダー**：

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**応答例**：

```json
{
  "code": 200,
  "msg": "success",
  "success": true,
  "data": {
    "limits": [
      {
        "type": "TOKENS_LIMIT",
        "usage": 10000000,
        "currentValue": 500000,
        "percentage": 5,
        "nextResetTime": 1706200000000
      }
    ]
  }
}
```

## GitHub Copilotインターフェース

### 1. 公共Billing API（推奨）

**インターフェース情報**：

| 項目 | 値 |
| --- | --- |
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| メソッド | GET |
| 認証方式 | Fine-grained PAT (Personal Access Token) |

**リクエストヘッダー**：

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

**応答例**：

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "username",
  "usageItems": [
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4",
      "unitType": "request",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    }
  ]
}
```

## Google Cloudインターフェース

### 1. Access Tokenをリフレッシュ

**インターフェース情報**：

| 項目 | 値 |
| --- | --- |
| URL | `https://oauth2.googleapis.com/token` |
| メソッド | POST |
| 認証方式 | OAuth Refresh Token |

### 2. 利用可能なモデルクォータをクエリ

**インターフェース情報**：

| 項目 | 値 |
| --- | --- |
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| メソッド | POST |
| 認証方式 | Bearer Token (OAuth) |

**リクエストボディ**：

```json
{
  "project": "{project_id}"
}
```

**応答例**：

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    }
  }
}
```

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を展開</strong></summary>

> 更新日時：2026-01-23

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| OpenAIクォータクエリAPI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 127-155 |
| Zhipu AIクォータクエリAPI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-106 |

</details>
