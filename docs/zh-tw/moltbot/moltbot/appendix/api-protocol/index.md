---
title: "Gateway WebSocket API 協議完整指南 | Clawdbot 教學"
sidebarTitle: "開發自訂客戶端"
subtitle: "Gateway WebSocket API 協議完整指南"
description: "學習 Clawdbot Gateway WebSocket 協議的完整規範，包括連線交握、訊息幀格式、請求/回應模型、事件推送、權限系統和所有可用方法。本教學提供完整的 API 參考和客戶端整合範例，幫助你快速實作自訂客戶端與 Gateway 的整合。"
tags:
  - "API"
  - "WebSocket"
  - "協議"
  - "開發者"
prerequisite:
  - "/zh-tw/moltbot/moltbot/start-gateway-startup"
  - "/zh-tw/moltbot/moltbot/advanced-session-management"
order: 350
---

# Gateway WebSocket API 協議完整指南

## 學完你能做什麼

- 📡 成功連線到 Gateway WebSocket 伺服器
- 🔄 發送請求並處理回應
- 📡 接收伺服器推送的事件
- 🔐 理解權限系統並進行認證
- 🛠️ 呼叫所有可用的 Gateway 方法
- 📖 理解訊息幀格式和錯誤處理

## 你現在的困境

你可能正在開發一個自訂客戶端（如行動應用程式、Web 應用程式或命令列工具），需要與 Clawdbot Gateway 通訊。Gateway 的 WebSocket 協議似乎很複雜，你需要：

- 了解如何建立連線和認證
- 理解請求/回應的訊息格式
- 知道可用的方法及其參數
- 處理伺服器推送的事件
- 理解權限系統

**好消息**：Gateway WebSocket API 協議設計得很清晰，本教學將為你提供完整的參考指南。

## 什麼時候用這一招

::: info 適用場景
使用本協議當你需要：
- 開發自訂客戶端連線 Gateway
- 實作 WebChat 或行動應用程式
- 建立監控或管理工具
- 整合 Gateway 到現有系統
- 除錯和測試 Gateway 功能
:::

## 核心思路

Clawdbot Gateway 使用 WebSocket 協議提供即時雙向通訊。協議基於 JSON 格式的訊息幀，分為三種類型：

1. **請求幀（Request Frame）**：客戶端發送請求
2. **回應幀（Response Frame）**：伺服端回傳回應
3. **事件幀（Event Frame）**：伺服端主動推送事件

::: tip 設計哲學
協議採用「請求-回應」模型 + 「事件推送」模式：
- 客戶端主動發起請求，伺服端回傳回應
- 伺服端可以主動推送事件，無需客戶端請求
- 所有操作都透過統一的 WebSocket 連線進行
:::

## 連線握手

### 步驟 1：建立 WebSocket 連線

Gateway 預設監聽 `ws://127.0.0.1:18789`（可透過設定修改）。

::: code-group

```javascript [JavaScript]
// 建立 WebSocket 連線
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket 已連線');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket 已連線")
```

```bash [Bash]
# 使用 wscat 工具測試連線
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### 步驟 2：發送握手訊息

連線建立後，客戶端需要發送握手訊息以完成認證和版本協商。

```json
{
  "minProtocol": 1,
  "maxProtocol": 3,
  "client": {
    "id": "my-app-v1",
    "displayName": "My Custom Client",
    "version": "1.0.0",
    "platform": "web",
    "mode": "operator",
    "instanceId": "unique-instance-id"
  },
  "caps": [],
  "commands": [],
  "auth": {
    "token": "your-token-here"
  }
}
```

**為什麼**：握手訊息告訴伺服器：
- 客戶端支援的協議版本範圍
- 客戶端的基本資訊
- 認證憑證（token 或 password）

**你應該看到**：伺服器回傳 `hello-ok` 訊息

```json
{
  "type": "hello-ok",
  "protocol": 3,
  "server": {
    "version": "v2026.1.24",
    "commit": "abc123",
    "host": "my-mac",
    "connId": "conn-123456"
  },
  "features": {
    "methods": ["agent", "send", "chat.send", ...],
    "events": ["agent.event", "chat.event", ...]
  },
  "snapshot": {
    "presence": [...],
    "health": {...},
    "stateVersion": {...},
    "uptimeMs": 12345678
  },
  "auth": {
    "deviceToken": "device-token-here",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  },
  "policy": {
    "maxPayload": 1048576,
    "maxBufferedBytes": 10485760,
    "tickIntervalMs": 30000
  }
}
```

::: info Hello-Ok 欄位說明
- `protocol`：伺服端使用的協議版本
- `server.version`：Gateway 版本號
- `features.methods`：所有可用方法清單
- `features.events`：所有可訂閱事件清單
- `snapshot`：目前狀態快照
- `auth.scopes`：客戶端被授予的權限範圍
- `policy.maxPayload`：單一訊息的最大大小
- `policy.tickIntervalMs`：心跳間隔
:::

### 步驟 3：驗證連線狀態

握手成功後，你可以發送健康檢查請求驗證連線：

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**你應該看到**：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "status": "ok",
    "uptimeMs": 12345678
  }
}
```

## 訊息幀格式

### 請求幀（Request Frame）

客戶端發送的所有請求都遵循請求幀格式：

```json
{
  "type": "req",
  "id": "unique-request-id",
  "method": "method.name",
  "params": {
    // 方法參數
  }
}
```

| 欄位 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `type` | string | 是 | 固定值 `"req"` |
| `id` | string | 是 | 請求唯一識別碼，用於匹配回應 |
| `method` | string | 是 | 方法名稱，如 `"agent"`、`"send"` |
| `params` | object | 否 | 方法參數，具體格式取決於方法 |

::: warning 請求 ID 的重要性
每個請求必須有唯一的 `id`。伺服器使用 `id` 將回應與請求關聯。如果多個請求使用相同的 `id`，回應將無法正確匹配。
:::

### 回應幀（Response Frame）

伺服器對每個請求回傳回應幀：

```json
{
  "type": "res",
  "id": "unique-request-id",
  "ok": true,
  "payload": {
    // 回應資料
  },
  "error": {
    // 錯誤資訊（僅當 ok=false 時）
  }
}
```

| 欄位 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `type` | string | 是 | 固定值 `"res"` |
| `id` | string | 是 | 對應的請求 ID |
| `ok` | boolean | 是 | 請求是否成功 |
| `payload` | any | 否 | 成功時的回應資料 |
| `error` | object | 否 | 失敗時的錯誤資訊 |

**成功回應範例**：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "agents": [
      { "id": "agent-1", "name": "Default Agent" }
    ]
  }
}
```

**失敗回應範例**：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: message",
    "retryable": false
  }
}
```

### 事件幀（Event Frame）

伺服器可以主動推送事件，無需客戶端請求：

```json
{
  "type": "event",
  "event": "event.name",
  "payload": {
    // 事件資料
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| 欄位 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `type` | string | 是 | 固定值 `"event"` |
| `event` | string | 是 | 事件名稱 |
| `payload` | any | 否 | 事件資料 |
| `seq` | number | 否 | 事件序列號 |
| `stateVersion` | object | 否 | 狀態版本號 |

**常見事件範例**：

```json
// 心跳事件
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Agent 事件
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "思考中..."
    }
  }
}

// 聊天事件
{
  "type": "event",
  "event": "chat.event",
  "payload": {
    "runId": "run-123",
    "sessionKey": "main",
    "seq": 1,
    "state": "delta",
    "message": {
      "role": "assistant",
      "content": "你好！"
    }
  }
}

// 關機事件
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "系統重啟",
    "restartExpectedMs": 5000
  }
}
```

## 認證與權限

### 認證方式

Gateway 支援三種認證方式：

#### 1. Token 認證（推薦）

在握手訊息中提供 token：

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

Token 在設定檔中定義：

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secret-token-here"
    }
  }
}
```

#### 2. Password 認證

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

Password 在設定檔中定義：

```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "password": "your-password-here"
    }
  }
}
```

#### 3. Tailscale Identity（網路認證）

當使用 Tailscale Serve/Funnel 時，可以透過 Tailscale Identity 認證：

```json
{
  "client": {
    "mode": "operator"
  },
  "device": {
    "id": "device-id",
    "publicKey": "public-key",
    "signature": "signature",
    "signedAt": 1706707200000
  }
}
```

### 權限範圍（Scopes）

客戶端在握手後會獲得一組權限範圍，決定其可呼叫的方法：

| 範圍 | 權限 | 可用方法 |
| --- | --- | --- |
| `operator.admin` | 管理員 | 所有方法，包括設定修改、Wizard、更新等 |
| `operator.write` | 寫入 | 發送訊息、呼叫 Agent、修改工作階段等 |
| `operator.read` | 唯讀 | 查詢狀態、日誌、設定等 |
| `operator.approvals` | 審批 | Exec 審批相關方法 |
| `operator.pairing` | 配對 | 節點和裝置配對相關方法 |

::: info 權限檢查
伺服器在每個請求時都會檢查權限。如果客戶端缺少必要權限，請求將被拒絕：

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "missing scope: operator.admin"
  }
}
```
:::

### 角色系統

除了範圍，協議還支援角色系統：

| 角色 | 說明 | 特殊權限 |
| --- | --- | --- |
| `operator` | 操作員 | 可呼叫所有 Operator 方法 |
| `node` | 裝置節點 | 僅可呼叫 Node 專屬方法 |
| `device` | 裝置 | 可呼叫裝置相關方法 |

節點角色在裝置配對時自動分配，用於裝置節點與 Gateway 的通訊。

## 核心方法參考

### Agent 方法

#### `agent` - 發送訊息到 Agent

發送訊息到 AI Agent 並取得串流回應。

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "你好，請幫我寫一個 Hello World",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**參數說明**：

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `message` | string | 是 | 使用者訊息內容 |
| `agentId` | string | 否 | Agent ID，預設使用設定的預設 Agent |
| `sessionId` | string | 否 | 工作階段 ID |
| `sessionKey` | string | 否 | 工作階段鍵 |
| `to` | string | 否 | 發送目標（頻道） |
| `channel` | string | 否 | 頻道名稱 |
| `accountId` | string | 否 | 帳戶 ID |
| `thinking` | string | 否 | 思考內容 |
| `deliver` | boolean | 否 | 是否發送到頻道 |
| `attachments` | array | 否 | 附件清單 |
| `timeout` | number | 否 | 逾時時間（毫秒） |
| `lane` | string | 否 | 排程通道 |
| `extraSystemPrompt` | string | 否 | 額外系統提示 |
| `idempotencyKey` | string | 是 | 冪等鍵，防止重複 |

**回應**：

Agent 回應透過事件幀串流推送：

```json
// thinking 事件
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "正在思考..."
    }
  }
}

// message 事件
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 1,
    "stream": "message",
    "ts": 1706707200000,
    "data": {
      "role": "assistant",
      "content": "你好！這是一個 Hello World..."
    }
  }
}
```

#### `agent.wait` - 等待 Agent 完成

等待 Agent 任務完成。

```json
{
  "type": "req",
  "id": "req-2",
  "method": "agent.wait",
  "params": {
    "runId": "run-123",
    "timeoutMs": 30000
  }
}
```

### Send 方法

#### `send` - 發送訊息到頻道

發送訊息到指定的頻道。

```json
{
  "type": "req",
  "id": "req-3",
  "method": "send",
  "params": {
    "to": "+1234567890",
    "message": "Hello from Clawdbot!",
    "channel": "whatsapp",
    "idempotencyKey": "send-123"
  }
}
```

**參數說明**：

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `to` | string | 是 | 接收者識別碼（手機號碼、使用者 ID 等） |
| `message` | string | 是 | 訊息內容 |
| `mediaUrl` | string | 否 | 媒體 URL |
| `mediaUrls` | array | 否 | 媒體 URL 清單 |
| `channel` | string | 否 | 頻道名稱 |
| `accountId` | string | 否 | 帳戶 ID |
| `sessionKey` | string | 否 | 工作階段鍵（用於鏡像輸出） |
| `idempotencyKey` | string | 是 | 冪等鍵 |

### Poll 方法

#### `poll` - 建立投票

建立投票並發送到頻道。

```json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "你喜歡的程式語言是什麼？",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
```

### Sessions 方法

#### `sessions.list` - 列出工作階段

列出所有活躍的工作階段。

```json
{
  "type": "req",
  "id": "req-5",
  "method": "sessions.list",
  "params": {
    "limit": 50,
    "activeMinutes": 60,
    "includeDerivedTitles": true,
    "includeLastMessage": true
  }
}
```

**參數說明**：

| 參數 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `limit` | number | 否 | 最大回傳數量 |
| `activeMinutes` | number | 否 | 篩選最近活躍的工作階段（分鐘） |
| `includeGlobal` | boolean | 否 | 包含全域工作階段 |
| `includeUnknown` | boolean | 否 | 包含未知工作階段 |
| `includeDerivedTitles` | boolean | 否 | 從第一行訊息推導標題 |
| `includeLastMessage` | boolean | 否 | 包含最後一則訊息預覽 |
| `label` | string | 否 | 按標籤篩選 |
| `agentId` | string | 否 | 按 Agent ID 篩選 |
| `search` | string | 否 | 搜尋關鍵字 |

#### `sessions.patch` - 修改工作階段設定

修改工作階段的設定參數。

```json
{
  "type": "req",
  "id": "req-6",
  "method": "sessions.patch",
  "params": {
    "key": "main",
    "label": "Main Session",
    "thinkingLevel": "minimal",
    "responseUsage": "tokens",
    "model": "claude-sonnet-4-20250514"
  }
}
```

#### `sessions.reset` - 重設工作階段

清空工作階段歷史。

```json
{
  "type": "req",
  "id": "req-7",
  "method": "sessions.reset",
  "params": {
    "key": "main"
  }
}
```

#### `sessions.delete` - 刪除工作階段

刪除工作階段及其歷史。

```json
{
  "type": "req",
  "id": "req-8",
  "method": "sessions.delete",
  "params": {
    "key": "session-123",
    "deleteTranscript": true
  }
}
```

#### `sessions.compact` - 壓縮工作階段歷史

壓縮工作階段歷史以減少上下文大小。

```json
{
  "type": "req",
  "id": "req-9",
  "method": "sessions.compact",
  "params": {
    "key": "main",
    "maxLines": 100
  }
}
```

### Config 方法

#### `config.get` - 取得設定

取得目前設定。

```json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
```

#### `config.set` - 設定設定

設定新設定。

```json
{
  "type": "req",
  "id": "req-11",
  "method": "config.set",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash"
  }
}
```

#### `config.apply` - 套用設定並重啟

套用設定並重啟 Gateway。

```json
{
  "type": "req",
  "id": "req-12",
  "method": "config.apply",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash",
    "restartDelayMs": 1000
  }
}
```

#### `config.schema` - 取得設定 Schema

取得設定的 Schema 定義。

```json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
```

### Channels 方法

#### `channels.status` - 取得頻道狀態

取得所有頻道的狀態。

```json
{
  "type": "req",
  "id": "req-14",
  "method": "channels.status",
  "params": {
    "probe": true,
    "timeoutMs": 5000
  }
}
```

**回應範例**：

```json
{
  "type": "res",
  "id": "req-14",
  "ok": true,
  "payload": {
    "ts": 1706707200000,
    "channelOrder": ["whatsapp", "telegram", "slack"],
    "channelLabels": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "slack": "Slack"
    },
    "channelAccounts": {
      "whatsapp": [
        {
          "accountId": "wa-123",
          "enabled": true,
          "linked": true,
          "connected": true,
          "lastConnectedAt": 1706707200000
        }
      ]
    }
  }
}
```

#### `channels.logout` - 登出頻道

登出指定頻道。

```json
{
  "type": "req",
  "id": "req-15",
  "method": "channels.logout",
  "params": {
    "channel": "whatsapp",
    "accountId": "wa-123"
  }
}
```

### Models 方法

#### `models.list` - 列出可用模型

列出所有可用的 AI 模型。

```json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
```

**回應範例**：

```json
{
  "type": "res",
  "id": "req-16",
  "ok": true,
  "payload": {
    "models": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "contextWindow": 200000,
        "reasoning": true
      },
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "openai",
        "contextWindow": 128000,
        "reasoning": false
      }
    ]
  }
}
```

### Agents 方法

#### `agents.list` - 列出所有 Agent

列出所有可用的 Agent。

```json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
```

**回應範例**：

```json
{
  "type": "res",
  "id": "req-17",
  "ok": true,
  "payload": {
    "defaultId": "default",
    "mainKey": "main",
    "scope": "per-sender",
    "agents": [
      {
        "id": "default",
        "name": "Default Agent",
        "identity": {
          "name": "Clawdbot",
          "theme": "default",
          "emoji": "🤖"
        }
      }
    ]
  }
}
```

### Cron 方法

#### `cron.list` - 列出排程任務

列出所有排程任務。

```json
{
  "type": "req",
  "id": "req-18",
  "method": "cron.list",
  "params": {
    "includeDisabled": true
  }
}
```

#### `cron.add` - 新增排程任務

新增新的排程任務。

```json
{
  "type": "req",
  "id": "req-19",
  "method": "cron.add",
  "params": {
    "name": "每日報告",
    "description": "每天早上 8 點產生日報",
    "enabled": true,
    "schedule": {
      "kind": "cron",
      "expr": "0 8 * * *",
      "tz": "Asia/Taipei"
    },
    "sessionTarget": "main",
    "wakeMode": "now",
    "payload": {
      "kind": "agentTurn",
      "message": "請產生今日工作日報",
      "channel": "last"
    }
  }
}
```

#### `cron.run` - 手動執行排程任務

手動執行指定的排程任務。

```json
{
  "type": "req",
  "id": "req-20",
  "method": "cron.run",
  "params": {
    "id": "cron-123",
    "mode": "force"
  }
}
```

### Nodes 方法

#### `nodes.list` - 列出所有節點

列出所有已配對的裝置節點。

```json
{
  "type": "req",
  "id": "req-21",
  "method": "nodes.list",
  "params": {}
}
```

#### `nodes.describe` - 取得節點詳情

取得指定節點的詳細資訊。

```json
{
  "type": "req",
  "id": "req-22",
  "method": "nodes.describe",
  "params": {
    "nodeId": "ios-node-123"
  }
}
```

#### `nodes.invoke` - 呼叫節點命令

在節點上執行命令。

```json
{
  "type": "req",
  "id": "req-23",
  "method": "nodes.invoke",
  "params": {
    "nodeId": "ios-node-123",
    "command": "camera.snap",
    "params": {
      "quality": "high"
    },
    "timeoutMs": 10000,
    "idempotencyKey": "invoke-123"
  }
}
```

#### `nodes.pair.list` - 列出待配對的節點

列出所有等待配對的節點請求。

```json
{
  "type": "req",
  "id": "req-24",
  "method": "nodes.pair.list",
  "params": {}
}
```

#### `nodes.pair.approve` - 核准節點配對

核准節點配對請求。

```json
{
  "type": "req",
  "id": "req-25",
  "method": "nodes.pair.approve",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.pair.reject` - 拒絕節點配對

拒絕節點配對請求。

```json
{
  "type": "req",
  "id": "req-26",
  "method": "nodes.pair.reject",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.rename` - 重新命名節點

重新命名節點。

```json
{
  "type": "req",
  "id": "req-27",
  "method": "nodes.rename",
  "params": {
    "nodeId": "ios-node-123",
    "displayName": "My iPhone"
  }
}
```

### Logs 方法

#### `logs.tail` - 取得日誌

取得 Gateway 日誌。

```json
{
  "type": "req",
  "id": "req-28",
  "method": "logs.tail",
  "params": {
    "cursor": 0,
    "limit": 100,
    "maxBytes": 100000
  }
}
```

**回應範例**：

```json
{
  "type": "res",
  "id": "req-28",
  "ok": true,
  "payload": {
    "file": "/path/to/gateway.log",
    "cursor": 123456,
    "size": 4567890,
    "lines": [
      "[2025-01-27 10:00:00] INFO: Starting Gateway...",
      "[2025-01-27 10:00:01] INFO: Connected to WhatsApp"
    ],
    "truncated": false
  }
}
```

### Skills 方法

#### `skills.status` - 取得技能狀態

取得所有技能的狀態。

```json
{
  "type": "req",
  "id": "req-29",
  "method": "skills.status",
  "params": {}
}
```

#### `skills.bins` - 列出技能庫

列出可用的技能庫。

```json
{
  "type": "req",
  "id": "req-30",
  "method": "skills.bins",
  "params": {}
}
```

#### `skills.install` - 安裝技能

安裝指定的技能。

```json
{
  "type": "req",
  "id": "req-31",
  "method": "skills.install",
  "params": {
    "name": "my-custom-skill",
    "installId": "install-123",
    "timeoutMs": 60000
  }
}
```

### WebChat 方法

#### `chat.send` - 發送聊天訊息（WebChat）

WebChat 專用聊天方法。

```json
{
  "type": "req",
  "id": "req-32",
  "method": "chat.send",
  "params": {
    "sessionKey": "main",
    "message": "Hello from WebChat!",
    "thinking": "正在回覆...",
    "deliver": true,
    "idempotencyKey": "chat-123"
  }
}
```

#### `chat.history` - 取得聊天歷史

取得指定工作階段的歷史訊息。

```json
{
  "type": "req",
  "id": "req-33",
  "method": "chat.history",
  "params": {
    "sessionKey": "main",
    "limit": 50
  }
}
```

#### `chat.abort` - 中止聊天

中止正在進行的聊天。

```json
{
  "type": "req",
  "id": "req-34",
  "method": "chat.abort",
  "params": {
    "sessionKey": "main",
    "runId": "run-123"
  }
}
```

### Wizard 方法

#### `wizard.start` - 啟動精靈

啟動設定精靈。

```json
{
  "type": "req",
  "id": "req-35",
  "method": "wizard.start",
  "params": {}
}
```

#### `wizard.next` - 精靈下一步

執行精靈的下一步。

```json
{
  "type": "req",
  "id": "req-36",
  "method": "wizard.next",
  "params": {
    "stepId": "step-1",
    "response": {
      "selectedOption": "option-1"
    }
  }
}
```

#### `wizard.cancel` - 取消精靈

取消正在進行的精靈。

```json
{
  "type": "req",
  "id": "req-37",
  "method": "wizard.cancel",
  "params": {}
}
```

### System 方法

#### `status` - 取得系統狀態

取得 Gateway 系統狀態。

```json
{
  "type": "req",
  "id": "req-38",
  "method": "status",
  "params": {}
}
```

#### `last-heartbeat` - 取得最後心跳時間

取得 Gateway 最後一次心跳時間。

```json
{
  "type": "req",
  "id": "req-39",
  "method": "last-heartbeat",
  "params": {}
}
```

### Usage 方法

#### `usage.status` - 取得使用統計

取得 Token 使用統計。

```json
{
  "type": "req",
  "id": "req-40",
  "method": "usage.status",
  "params": {}
}
```

#### `usage.cost` - 取得成本統計

取得 API 呼叫成本統計。

```json
{
  "type": "req",
  "id": "req-41",
  "method": "usage.cost",
  "params": {}
}
```

## 錯誤處理

### 錯誤碼

所有錯誤回應都包含錯誤碼和描述：

| 錯誤碼 | 說明 | 可重試 |
| --- | --- | --- |
| `NOT_LINKED` | 節點未連結 | 是 |
| `NOT_PAIRED` | 節點未配對 | 否 |
| `AGENT_TIMEOUT` | Agent 逾時 | 是 |
| `INVALID_REQUEST` | 請求無效 | 否 |
| `UNAVAILABLE` | 服務不可用 | 是 |

### 錯誤回應格式

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "AGENT_TIMEOUT",
    "message": "Agent response timeout",
    "retryable": true,
    "retryAfterMs": 5000
  }
}
```

### 錯誤處理建議

1. **檢查 `retryable` 欄位**：如果為 `true`，可以按 `retryAfterMs` 延遲後重試
2. **記錄錯誤詳情**：記錄 `code` 和 `message` 以便除錯
3. **驗證參數**：`INVALID_REQUEST` 通常表示參數驗證失敗
4. **檢查連線狀態**：`NOT_LINKED` 表示連線已斷開，需要重新連線

## 心跳機制

Gateway 會定期發送心跳事件：

```json
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}
```

::: tip 心跳處理
客戶端應：
1. 監聽 `tick` 事件
2. 更新最後心跳時間
3. 如果超過 `3 * tickIntervalMs` 未收到心跳，考慮重連
:::

## 完整範例

### JavaScript 客戶端範例

```javascript
const WebSocket = require('ws');

class GatewayClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        // 發送握手訊息
        this.sendHandshake();
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data));
      });

      this.ws.on('error', (error) => {
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket 已斷開');
      });
    });
  }

  sendHandshake() {
    this.ws.send(JSON.stringify({
      minProtocol: 1,
      maxProtocol: 3,
      client: {
        id: 'my-client',
        displayName: 'My Gateway Client',
        version: '1.0.0',
        platform: 'node',
        mode: 'operator'
      },
      auth: {
        token: this.token
      }
    }));
  }

  async request(method, params = {}) {
    const id = `req-${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'req',
        id,
        method,
        params
      }));

      // 設定逾時
      setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('請求逾時'));
      }, 30000);
    });
  }

  handleMessage(message) {
    if (message.type === 'res') {
      const { id, ok, payload, error } = message;
      const pending = this.pendingRequests.get(id);
      
      if (pending) {
        this.pendingRequests.delete(id);
        if (ok) {
          pending.resolve(payload);
        } else {
          pending.reject(new Error(`${error.code}: ${error.message}`));
        }
      }
    } else if (message.type === 'event') {
      this.handleEvent(message);
    }
  }

  handleEvent(event) {
    console.log('收到事件:', event.event, event.payload);
  }

  async sendAgentMessage(message) {
    return this.request('agent', {
      message,
      idempotencyKey: `msg-${Date.now()}`
    });
  }

  async listSessions() {
    return this.request('sessions.list', {
      limit: 50,
      includeLastMessage: true
    });
  }

  async getChannelsStatus() {
    return this.request('channels.status', {
      probe: true
    });
  }
}

// 使用範例
(async () => {
  const client = new GatewayClient('ws://127.0.0.1:18789/v1/connect', 'your-token');
  await client.connect();

  // 發送訊息到 Agent
  const response = await client.sendAgentMessage('你好！');
  console.log('Agent 回應:', response);

  // 列出工作階段
  const sessions = await client.listSessions();
  console.log('工作階段清單:', sessions);

  // 取得頻道狀態
  const channels = await client.getChannelsStatus();
  console.log('頻道狀態:', channels);
})();
```

## 本課小結

本教學詳細介紹了 Clawdbot Gateway WebSocket API 協議，包括：

- ✅ 連線握手流程和認證機制
- ✅ 三種訊息幀類型（請求、回應、事件）
- ✅ 核心方法參考（Agent、Send、Sessions、Config 等）
- ✅ 權限系統和角色管理
- ✅ 錯誤處理和重試策略
- ✅ 心跳機制和連線管理
- ✅ 完整的 JavaScript 客戶端範例

## 下一課預告

> 下一課我們學習 **[完整設定參考](../config-reference/)**。
>
> 你會學到：
> - 所有設定項的詳細說明
> - 設定 Schema 和預設值
> - 環境變數替換機制
> - 設定驗證和錯誤處理

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 協議入口和驗證器 | `src/gateway/protocol/index.ts` | 1-521 |
| 基本幀類型定義 | `src/gateway/protocol/schema/frames.ts` | 1-165 |
| 協議版本定義 | `src/gateway/protocol/schema/protocol-schemas.ts` | 231 |
| 錯誤碼定義 | `src/gateway/protocol/schema/error-codes.ts` | 3-24 |
| Agent 相關 Schema | `src/gateway/protocol/schema/agent.ts` | 1-107 |
| Chat/Logs Schema | `src/gateway/protocol/schema/logs-chat.ts` | 1-83 |
| Sessions Schema | `src/gateway/protocol/schema/sessions.ts` | 1-105 |
| Config Schema | `src/gateway/protocol/schema/config.ts` | 1-72 |
| Nodes Schema | `src/gateway/protocol/schema/nodes.ts` | 1-103 |
| Cron Schema | `src/gateway/protocol/schema/cron.ts` | 1-246 |
| Channels Schema | `src/gateway/protocol/schema/channels.ts` | 1-108 |
| Models/Agents/Skills Schema | `src/gateway/protocol/schema/agents-models-skills.ts` | 1-86 |
| 請求處理器 | `src/gateway/server-methods.ts` | 1-200 |
| 權限驗證邏輯 | `src/gateway/server-methods.ts` | 91-144 |
| 狀態快照定義 | `src/gateway/protocol/schema/snapshot.ts` | 1-58 |

**關鍵常數**：
- `PROTOCOL_VERSION = 3`：目前協議版本
- `ErrorCodes`：錯誤碼列舉（NOT_LINKED、NOT_PAIRED、AGENT_TIMEOUT、INVALID_REQUEST、UNAVAILABLE）

**關鍵類型**：
- `GatewayFrame`：閘道幀聯合類型（RequestFrame | ResponseFrame | EventFrame）
- `RequestFrame`：請求幀類型
- `ResponseFrame`：回應幀類型
- `EventFrame`：事件幀類型
- `HelloOk`：握手成功回應類型
- `ErrorShape`：錯誤形狀類型

</details>
