---
title: "API: Plannotator Endpoints | Plannotator"
sidebarTitle: "API Reference"
subtitle: "API: Plannotator Endpoints | Plannotator"
description: "Learn all Plannotator API endpoints and request/response formats. Covers plan review, code review, and image upload APIs with complete specifications."
tags:
  - "API"
  - "Appendix"
prerequisite:
  - "start-getting-started"
order: 1
---

# Plannotator API Reference

## What You'll Learn

- Understand all API endpoints provided by the Plannotator local server
- View request and response formats for each API
- Understand the differences between plan review and code review interfaces
- Get references for integration or extension development

## Overview

Plannotator runs a local HTTP server (using Bun.serve) to provide RESTful APIs for plan review and code review. All API responses are in JSON format, with no authentication required (local isolated environment).

**Server Startup Modes**:
- Random port (local mode)
- Fixed port 19432 (remote/Devcontainer mode, overrideable via `PLANNOTATOR_PORT`)

**API Base URL**: `http://localhost:<PORT>/api/`

::: tip Note
The APIs below are categorized by functional modules. The same path may have different behaviors in plan review and code review servers.
:::

## Plan Review APIs

### GET /api/plan

Get the current plan content and related metadata.

**Request**: None

**Response Example**:

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| Field | Type | Description |
|--- | --- | ---|
| `plan` | string | Plan Markdown content |
| `origin` | string | Source identifier (`"claude-code"` or `"opencode"`) |
| `permissionMode` | string | Current permission mode (Claude Code specific) |
| `sharingEnabled` | boolean | Whether URL sharing is enabled |

---

### POST /api/approve

Approve the current plan, optionally saving to a note-taking app.

**Request Body**:

```json
{
  "obsidian": {
    "vaultPath": "/Users/xxx/Documents/Obsidian",
    "folder": "Plans",
    "tags": ["plannotator"],
    "plan": "Plan content..."
  },
  "bear": {
    "plan": "Plan content..."
  },
  "feedback": "Note when approving (OpenCode only)",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Response Example**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**Field Description**:

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `obsidian` | object | No | Obsidian save configuration |
| `bear` | object | No | Bear save configuration |
| `feedback` | string | No | Note when approving (OpenCode only) |
| `agentSwitch` | string | No | Agent name to switch to (OpenCode only) |
| `permissionMode` | string | No | Requested permission mode (Claude Code only) |
| `planSave` | object | No | Plan save configuration |

**Obsidian Configuration Fields**:

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `vaultPath` | string | Yes | Vault file path |
| `folder` | string | No | Target folder (default: root) |
| `tags` | string[] | No | Auto-generated tags |
| `plan` | string | Yes | Plan content |

---

### POST /api/deny

Reject the current plan and provide feedback.

**Request Body**:

```json
{
  "feedback": "Need to add unit test coverage",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**Response Example**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**Field Description**:

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `feedback` | string | No | Reason for rejection (default: "Plan rejected by user") |
| `planSave` | object | No | Plan save configuration |

---

### GET /api/obsidian/vaults

Detect locally configured Obsidian vaults.

**Request**: None

**Response Example**:

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**Configuration File Path**:
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## Code Review APIs

### GET /api/diff

Get the current git diff content.

**Request**: None

**Response Example**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "HEAD",
  "origin": "opencode",
  "diffType": "uncommitted",
  "gitContext": {
    "currentBranch": "feature/auth",
    "defaultBranch": "main",
    "diffOptions": [
      { "id": "uncommitted", "label": "Uncommitted changes" },
      { "id": "last-commit", "label": "Last commit" },
      { "id": "branch", "label": "vs main" }
    ]
  },
  "sharingEnabled": true
}
```

| Field | Type | Description |
|--- | --- | ---|
| `rawPatch` | string | Git diff unified format patch |
| `gitRef` | string | Git reference used |
| `origin` | string | Source identifier |
| `diffType` | string | Current diff type |
| `gitContext` | object | Git context information |
| `sharingEnabled` | boolean | Whether URL sharing is enabled |

**gitContext Field Description**:

| Field | Type | Description |
|--- | --- | ---|
| `currentBranch` | string | Current branch name |
| `defaultBranch` | string | Default branch name (main or master) |
| `diffOptions` | object[] | Available diff type options (contains id and label) |

---

### POST /api/diff/switch

Switch to a different type of git diff.

**Request Body**:

```json
{
  "diffType": "staged"
}
```

**Supported Diff Types**:

| Type | Git Command | Description |
|--- | --- | ---|
| `uncommitted` | `git diff HEAD` | Uncommitted changes (default) |
| `staged` | `git diff --staged` | Staged changes |
| `last-commit` | `git diff HEAD~1..HEAD` | Last commit |
| `vs main` | `git diff main..HEAD` | Current branch vs main |

**Response Example**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

Submit code review feedback to the AI Agent.

**Request Body**:

```json
{
  "feedback": "Suggest adding error handling logic",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "Should use try-catch here",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**Field Description**:

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `feedback` | string | No | Text feedback (LGTM or other) |
| `annotations` | array | No | Structured annotation array |
| `agentSwitch` | string | No | Agent name to switch to (OpenCode only) |

**Annotation Object Fields**:

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `id` | string | Yes | Unique identifier |
| `type` | string | Yes | Type: `comment`, `suggestion`, `concern` |
| `filePath` | string | Yes | File path |
| `lineStart` | number | Yes | Start line number |
| `lineEnd` | number | Yes | End line number |
| `side` | string | Yes | Side: `"old"` or `"new"` |
| `text` | string | No | Comment content |
| `suggestedCode` | string | No | Suggested code (for suggestion type) |

**Response Example**:

```json
{
  "ok": true
}
```

---

## Shared APIs

### GET /api/image

Get an image (local file path or uploaded temporary file).

**Request Parameters**:

| Parameter | Type | Required | Description |
|--- | --- | --- | ---|
| `path` | string | Yes | Image file path |

**Example Request**: `GET /api/image?path=/tmp/plannotator/abc-123.png`

**Response**: Image file (PNG/JPEG/WebP)

**Error Responses**:
- `400` - Missing path parameter
- `404` - File not found
- `500` - Failed to read file

---

### POST /api/upload

Upload an image to a temporary directory and return an accessible path.

**Request**: `multipart/form-data`

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `file` | File | Yes | Image file |

**Supported Formats**: PNG, JPEG, WebP

**Response Example**:

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**Error Responses**:
- `400` - No file provided
- `500` - Upload failed

::: info Note
Uploaded images are saved in the `/tmp/plannotator` directory and will not be automatically cleaned up after the server closes.
:::

---

### GET /api/agents

Get the list of available OpenCode Agents (OpenCode only).

**Request**: None

**Response Example**:

```json
{
  "agents": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable model for complex tasks"
    },
    {
      "id": "gpt-4o",
      "name": "GPT-4o",
      "description": "Fast and efficient multimodal model"
    }
  ]
}
```

**Filtering Rules**:
- Only return agents with `mode === "primary"`
- Exclude agents with `hidden === true`

**Error Response**:

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|--- | ---|
| `200` | Request successful |
| `400` | Parameter validation failed |
| `404` | Resource not found |
| `500` | Internal server error |

### Error Response Format

```json
{
  "error": "Error description message"
}
```

### Common Errors

| Error | Trigger Condition |
|--- | ---|
| `Missing path parameter` | `/api/image` missing `path` parameter |
| `File not found` | File specified by `/api/image` does not exist |
| `No file provided` | `/api/upload` no file uploaded |
| `Missing diffType` | `/api/diff/switch` missing `diffType` field |
| `Port ${PORT} in use` | Port already in use (server startup failed) |

---

## Server Behavior

### Port Retry Mechanism

- Maximum retries: 5 times
- Retry delay: 500ms
- Timeout error: `Port ${PORT} in use after 5 retries`

::: warning Remote Mode Note
In remote/Devcontainer mode, if the port is occupied, you can use a different port by setting the `PLANNOTATOR_PORT` environment variable.
:::

### Decision Waiting

After the server starts, it enters a state waiting for user decisions:

**Plan Review Server**:
- Waits for `/api/approve` or `/api/deny` calls
- Returns decision and closes server after call

**Code Review Server**:
- Waits for `/api/feedback` calls
- Returns feedback and closes server after call

### SPA Fallback

All unmatched paths return embedded HTML (single-page application):

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

This ensures frontend routing works correctly.

---

## Environment Variables

| Variable | Description | Default |
|--- | --- | ---|
| `PLANNOTATOR_REMOTE` | Enable remote mode | Not set |
| `PLANNOTATOR_PORT` | Fixed port number | Random (local) / 19432 (remote) |
| `PLANNOTATOR_ORIGIN` | Source identifier | `"claude-code"` or `"opencode"` |
| `PLANNOTATOR_SHARE` | Disable URL sharing | Not set (enabled) |

::: tip Tip
For more environment variable configuration, see the [Environment Variables](../../advanced/environment-variables/) chapter.
:::

---

## Summary

Plannotator provides a complete local HTTP API supporting two core features: plan review and code review:

- **Plan Review APIs**: Get plan, approve/deny decisions, Obsidian/Bear integration
- **Code Review APIs**: Get diff, switch diff types, submit structured feedback
- **Shared APIs**: Image upload/download, agent list query
- **Error Handling**: Unified HTTP status codes and error format

All APIs run locally with no data uploads, ensuring security and reliability.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Number |
|--- | --- | ---|
| Plan review server entry | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents (plan review) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| Code review server entry | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents (code review) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**Key Constants**:
- `MAX_RETRIES = 5`: Maximum server startup retry count (`packages/server/index.ts:79`, `packages/server/review.ts:68`)
- `RETRY_DELAY_MS = 500`: Port retry delay (`packages/server/index.ts:80`, `packages/server/review.ts:69`)

**Key Functions**:
- `startPlannotatorServer(options)`: Start plan review server (`packages/server/index.ts:91`)
- `startReviewServer(options)`: Start code review server (`packages/server/review.ts:79`)

</details>
