---
title: "API 참조: 로컬 인터페이스 문서 | plannotator"
sidebarTitle: "API 한눈에 보기"
subtitle: "API 참조: 로컬 인터페이스 문서 | plannotator"
description: "Plannotator가 제공하는 모든 API 엔드포인트와 요청/응답 형식을 알아보세요. 계획 검토, 코드 검토, 이미지 업로드 등 인터페이스의 완전한 사양을 자세히 설명하여 통합 개발을 용이하게 합니다."
tags:
  - "API"
  - "부록"
prerequisite:
  - "start-getting-started"
order: 1
---

# Plannotator API 참조

## 학습 후 할 수 있는 것

- Plannotator 로컬 서버가 제공하는 모든 API 엔드포인트 이해
- 각 API의 요청 및 응답 형식 확인
- 계획 검토와 코드 검토의 인터페이스 차이점 이해
- 통합 또는 확장 개발을 위한 참고 자료 제공

## 개요

Plannotator는 로컬에서 HTTP 서버(Bun.serve 사용)를 실행하여 계획 검토와 코드 검토를 위한 RESTful API를 제공합니다. 모든 API 응답 형식은 JSON이며 인증이 필요 없습니다(로컬 격리 환경).

**서버 시작 방식**:
- 랜덤 포트(로컬 모드)
- 고정 포트 19432(원격/Devcontainer 모드, `PLANNOTATOR_PORT`로 재정의 가능)

**API 기본 URL**: `http://localhost:<PORT>/api/`

::: tip 팁
아래 API는 기능 모듈별로 분류되어 있으며, 동일한 경로가 계획 검토와 코드 검토 서버에서 다르게 동작할 수 있습니다.
:::

## 계획 검토 API

### GET /api/plan

현재 계획 내용 및 관련 메타 정보를 가져옵니다.

**요청**: 없음

**응답 예시**:

```json
{
  "plan": "# Implementation Plan: User Authentication\n...",
  "origin": "claude-code",
  "permissionMode": "read-write",
  "sharingEnabled": true
}
```

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `plan` | string | 계획의 Markdown 내용 |
| `origin` | string | 출처 식별자(`"claude-code"` 또는 `"opencode"`) |
| `permissionMode` | string | 현재 권한 모드(Claude Code 전용) |
| `sharingEnabled` | boolean | URL 공유 활성화 여부 |

---

### POST /api/approve

현재 계획을 승인하고 선택적으로 메모 앱에 저장합니다.

**요청 본문**:

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
  "feedback": "승인 시 비고(OpenCode 전용)",
  "agentSwitch": "gpt-4",
  "permissionMode": "read-write",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**응답 예시**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/approved-plan-20260124.md"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `obsidian` | object | 아니요 | Obsidian 저장 설정 |
| `bear` | object | 아니요 | Bear 저장 설정 |
| `feedback` | string | 아니요 | 승인 시 첨부된 비고(OpenCode 전용) |
| `agentSwitch` | string | 아니요 | 전환할 Agent 이름(OpenCode 전용) |
| `permissionMode` | string | 아니요 | 요청된 권한 모드(Claude Code 전용) |
| `planSave` | object | 아니요 | 계획 저장 설정 |

**Obsidian 설정 필드**:

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `vaultPath` | string | 예 | Vault 파일 경로 |
| `folder` | string | 아니요 | 대상 폴더(기본값 루트 디렉토리) |
| `tags` | string[] | 아니요 | 자동 생성된 태그 |
| `plan` | string | 예 | 계획 내용 |

---

### POST /api/deny

현재 계획을 거부하고 의견을 피드백합니다.

**요청 본문**:

```json
{
  "feedback": "단위 테스트 커버리지 보완 필요",
  "planSave": {
    "enabled": true,
    "customPath": "/path/to/custom/folder"
  }
}
```

**응답 예시**:

```json
{
  "ok": true,
  "savedPath": "/Users/xxx/.plannotator/plans/denied-plan-20260124.md"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `feedback` | string | 아니요 | 거부 사유(기본값 "Plan rejected by user") |
| `planSave` | object | 아니요 | 계획 저장 설정 |

---

### GET /api/obsidian/vaults

로컬에 구성된 Obsidian vaults를 감지합니다.

**요청**: 없음

**응답 예시**:

```json
{
  "vaults": [
    "/Users/xxx/Documents/Obsidian",
    "/Users/xxx/Documents/OtherVault"
  ]
}
```

**구성 파일 경로**:
- macOS: `~/Library/Application Support/obsidian/obsidian.json`
- Windows: `%APPDATA%\obsidian\obsidian.json`
- Linux: `~/.config/obsidian/obsidian.json`

---

## 코드 검토 API

### GET /api/diff

현재 git diff 내용을 가져옵니다.

**요청**: 없음

**응답 예시**:

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

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `rawPatch` | string | Git diff 통일 형식 patch |
| `gitRef` | string | 사용된 Git 참조 |
| `origin` | string | 출처 식별자 |
| `diffType` | string | 현재 diff 타입 |
| `gitContext` | object | Git 컨텍스트 정보 |
| `sharingEnabled` | boolean | URL 공유 활성화 여부 |

**gitContext 필드 설명**:

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `currentBranch` | string | 현재 브랜치 이름 |
| `defaultBranch` | string | 기본 브랜치 이름(main 또는 master) |
| `diffOptions` | object[] | 사용 가능한 diff 타입 옵션(id와 label 포함) |

---

### POST /api/diff/switch

다른 타입의 git diff로 전환합니다.

**요청 본문**:

```json
{
  "diffType": "staged"
}
```

**지원하는 diff 타입**:

| 타입 | Git 명령 | 설명 |
|--- | --- | ---|
| `uncommitted` | `git diff HEAD` | 커밋되지 않은 변경(기본값) |
| `staged` | `git diff --staged` | 스테이징된 변경 |
| `last-commit` | `git diff HEAD~1..HEAD` | 마지막 커밋 |
| `vs main` | `git diff main..HEAD` | 현재 브랜치 vs main |

**응답 예시**:

```json
{
  "rawPatch": "diff --git a/src/index.ts b/src/index.ts\n...",
  "gitRef": "--staged",
  "diffType": "staged"
}
```

---

### POST /api/feedback

코드 검토 피드백을 AI Agent에 제출합니다.

**요청 본문**:

```json
{
  "feedback": "오류 처리 로직 추가 제안",
  "annotations": [
    {
      "id": "1",
      "type": "suggestion",
      "filePath": "src/index.ts",
      "lineStart": 42,
      "lineEnd": 45,
      "side": "new",
      "text": "여기는 try-catch를 사용해야 함",
      "suggestedCode": "try {\n  // ...\n} catch (err) {\n  console.error(err);\n}"
    }
  ],
  "agentSwitch": "gpt-4"
}
```

**필드 설명**:

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `feedback` | string | 아니요 | 텍스트 피드백(LGTM 또는 기타) |
| `annotations` | array | 아니요 | 구조화된 주석 배열 |
| `agentSwitch` | string | 아니요 | 전환할 Agent 이름(OpenCode 전용) |

**annotation 객체 필드**:

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `id` | string | 예 | 고유 식별자 |
| `type` | string | 예 | 타입: `comment`, `suggestion`, `concern` |
| `filePath` | string | 예 | 파일 경로 |
| `lineStart` | number | 예 | 시작 행 번호 |
| `lineEnd` | number | 예 | 끝 행 번호 |
| `side` | string | 예 | 측: `"old"` 또는 `"new"` |
| `text` | string | 아니요 | 댓글 내용 |
| `suggestedCode` | string | 아니요 | 제안 코드(suggestion 타입) |

**응답 예시**:

```json
{
  "ok": true
}
```

---

## 공유 API

### GET /api/image

이미지를 가져옵니다(로컬 파일 경로 또는 업로드된 임시 파일).

**요청 매개변수**:

| 매개변수 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `path` | string | 예 | 이미지 파일 경로 |

**요청 예시**: `GET /api/image?path=/tmp/plannotator/abc-123.png`

**응답**: 이미지 파일(PNG/JPEG/WebP)

**오류 응답**:
- `400` - path 매개변수 누락
- `404` - 파일 존재하지 않음
- `500` - 파일 읽기 실패

---

### POST /api/upload

이미지를 임시 디렉토리에 업로드하고 접근 가능한 경로를 반환합니다.

**요청**: `multipart/form-data`

| 필드 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `file` | File | 예 | 이미지 파일 |

**지원하는 형식**: PNG, JPEG, WebP

**응답 예시**:

```json
{
  "path": "/tmp/plannotator/abc-123-def456.png"
}
```

**오류 응답**:
- `400` - 파일 제공되지 않음
- `500` - 업로드 실패

::: info 참고
업로드된 이미지는 `/tmp/plannotator` 디렉토리에 저장되며, 서버가 닫힌 후 자동으로 정리되지 않습니다.
:::

---

### GET /api/agents

사용 가능한 OpenCode Agents 목록을 가져옵니다(OpenCode 전용).

**요청**: 없음

**응답 예시**:

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

**필터링 규칙**:
- `mode === "primary"`인 agents만 반환
- `hidden === true`인 agents 제외

**오류 응답**:

```json
{
  "agents": [],
  "error": "Failed to fetch agents"
}
```

---

## 오류 처리

### HTTP 상태 코드

| 상태 코드 | 설명 |
|--- | ---|
| `200` | 요청 성공 |
| `400` | 매개변수 검증 실패 |
| `404` | 리소스 존재하지 않음 |
| `500` | 서버 내부 오류 |

### 오류 응답 형식

```json
{
  "error": "오류 설명 메시지"
}
```

### 일반적인 오류

| 오류 | 트리거 조건 |
|--- | ---|
| `Missing path parameter` | `/api/image`에 `path` 매개변수 누락 |
| `File not found` | `/api/image`에서 지정된 파일 존재하지 않음 |
| `No file provided` | `/api/upload`에 파일 업로드되지 않음 |
| `Missing diffType` | `/api/diff/switch`에 `diffType` 필드 누락 |
| `Port ${PORT} in use` | 포트 이미 사용 중(서버 시작 실패) |

---

## 서버 동작

### 포트 재시도 메커니즘

- 최대 재시도 횟수: 5회
- 재시도 지연: 500밀리초
- 시간 초과 오류: `Port ${PORT} in use after 5 retries`

::: warning 원격 모드 팁
원격/Devcontainer 모드에서 포트가 사용 중인 경우 `PLANNOTATOR_PORT` 환경 변수를 설정하여 다른 포트를 사용할 수 있습니다.
:::

### 의사결정 대기

서버가 시작된 후 사용자 의사결정 대기 상태로 진입:

**계획 검토 서버**:
- `/api/approve` 또는 `/api/deny` 호출 대기
- 호출 후 의사결정 반환 및 서버 종료

**코드 검토 서버**:
- `/api/feedback` 호출 대기
- 호출 후 피드백 반환 및 서버 종료

### SPA 폴백

일치하지 않는 모든 경로는 임베디드 HTML(단일 페이지 애플리케이션)을 반환:

```http
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
...
</html>
```

이는 프론트엔드 라우팅이 정상적으로 작동하도록 보장합니다.

---

## 환경 변수

| 변수 | 설명 | 기본값 |
|--- | --- | ---|
| `PLANNOTATOR_REMOTE` | 원격 모드 활성화 | 설정되지 않음 |
| `PLANNOTATOR_PORT` | 고정 포트 번호 | 랜덤(로컬) / 19432(원격) |
| `PLANNOTATOR_ORIGIN` | 출처 식별자 | `"claude-code"` 또는 `"opencode"` |
| `PLANNOTATOR_SHARE` | URL 공유 비활성화 | 설정되지 않음(활성화) |

::: tip 팁
더 많은 환경 변수 구성은 [환경 변수 구성](../../advanced/environment-variables/) 장을 참조하세요.
:::

---

## 요약

Plannotator는 계획 검토와 코드 검토 두 가지 핵심 기능을 지원하는 완전한 로컬 HTTP API를 제공합니다:

- **계획 검토 API**: 계획 가져오기, 승인/거부 의사결정, Obsidian/Bear 통합
- **코드 검토 API**: diff 가져오기, diff 타입 전환, 구조화된 피드백 제출
- **공유 API**: 이미지 업로드/다운로드, Agent 목록 조회
- **오류 처리**: 통합된 HTTP 상태 코드 및 오류 형식

모든 API는 로컬에서 실행되며 데이터 업로드가 없어 안전하고 신뢰할 수 있습니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 계획 검토 서버 진입점 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L355) | 91-355 |
| GET /api/plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L-L134) | 132-134 |
| POST /api/approve | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L200-L277) | 200-277 |
| POST /api/deny | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L279-L309) | 279-309 |
| GET /api/image | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L136-L151) | 136-151 |
| POST /api/upload | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| GET /api/obsidian/vaults | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L176-L180) | 176-180 |
| GET /api/agents(계획 검토) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L182-L198) | 182-198 |
| 코드 검토 서버 진입점 | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79-L288) | 79-288 |
| GET /api/diff | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L117-L127) | 117-127 |
| POST /api/diff/switch | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L129-L161) | 129-161 |
| POST /api/feedback | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L221-L242) | 221-242 |
| GET /api/agents(코드 검토) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L203-L219) | 203-219 |

**주요 상수**:
- `MAX_RETRIES = 5`: 서버 시작 최대 재시도 횟수(`packages/server/index.ts:79`, `packages/server/review.ts:68`)
- `RETRY_DELAY_MS = 500`: 포트 재시도 지연(`packages/server/index.ts:80`, `packages/server/review.ts:69`)

**주요 함수**:
- `startPlannotatorServer(options)`: 계획 검토 서버 시작(`packages/server/index.ts:91`)
- `startReviewServer(options)`: 코드 검토 서버 시작(`packages/server/review.ts:79`)

</details>
