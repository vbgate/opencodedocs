---
title: "명령 실행 도구 및 승인 완전 가이드: 보안 메커니즘, 구성, 문제 해결 | Clawdbot 튜토리얼"
sidebarTitle: "AI에 안전하게 명령 실행하기"
subtitle: "명령 실행 도구 및 승인"
description: "Clawdbot의 exec 도구를 사용하여 Shell 명령을 실행하는 방법, 3가지 실행 모드(sandbox/gateway/node), 보안 승인 메커니즘, 허용 목록 구성, 승인 흐름을 학습합니다. 이 튜토리얼에는 실제 구성 예제, CLI 명령 및 문제 해결이 포함되어 있어 AI 어시스턴트의 기능을 안전하게 확장하는 데 도움이 됩니다."
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# 명령 실행 도구 및 승인

## 학습 후 할 수 있는 것

- 3가지 실행 모드(sandbox/gateway/node)에서 exec 도구 구성
- 보안 승인 메커니즘(deny/allowlist/full) 이해 및 구성
- 허용 목록(Allowlist) 및 안전한 bins 관리
- UI 또는 채팅 채널을 통해 exec 요청 승인
- exec 도구 일반적인 문제 및 보안 오류 문제 해결

## 현재의 딜레마

exec 도구는 AI 어시스턴트가 Shell 명령을 실행할 수 있게 하지만, 이는 강력하면서도 위험합니다：

- AI가 시스템의 중요한 파일을 삭제할까요?
- AI가 안전한 명령만 실행하도록 제한하려면 어떻게 해야 할까요?
- 다른 실행 모드의 차이점은 무엇인가요?
- 승인 흐름은 어떻게 작동하나요?
- 허용 목록을 어떻게 구성해야 할까요?

## 언제 이 방법을 사용해야 할까요

- AI에 시스템 작업(파일 관리, 코드 빌드)을 실행하고 싶을 때
- AI에 사용자 정의 스크립트나 도구를 호출하고 싶을 때
- AI의 실행 권한을 세밀하게 제어해야 할 때
- 특정 명령을 안전하게 허용해야 할 때

## 🎒 시작 전 준비

::: warning 전제 조건
이 튜토리얼은 [Gateway 시작](../../start/gateway-startup/)을 완료했으며, Gateway 데몬이 실행 중인 것으로 가정합니다.
:::

- Node ≥22 설치 확인
- Gateway 데몬 실행 중
- 기본 Shell 명령 및 Linux/Unix 파일 시스템 이해

## 핵심 개념

### Exec 도구의 3계층 보안 보호

exec 도구는 거친 입자에서 미세한 입자까지의 3계층 보안 메커니즘을 채택하여 AI의 실행 권한을 제어합니다：

1. **도구 정책(Tool Policy)**：`tools.policy`에서 `exec` 도구 허용 제어
2. **실행 호스트(Host)**：명령은 sandbox/gateway/node 3가지 환경에서 실행
3. **승인 메커니즘(Approvals)**：gateway/node 모드에서 allowlist 및 승인 프롬프트로 추가 제한 가능

::: info 왜 다층 보호가 필요한가요?
단일 계층 보호는 우회하거나 구성 오류를 일으키기 쉽습니다. 다층 보호는某一 계층이 실패하더라도 다른 계층이 보호를 제공합니다.
:::

### 3가지 실행 모드 비교

| 실행 모드 | 실행 위치 | 보안 수준 | 일반적인 시나리오 | 승인 필요 여부 |
|--- | --- | --- | --- | ---|
| **sandbox** | 컨테이너 내(Docker 등) | 높음 | 격리 환경, 테스트 | 아니오 |
| **gateway** | Gateway 데몬이 있는 시스템 | 중간 | 로컬 개발, 통합 | 예(allowlist + 승인) |
| **node** | 페어링된 디바이스 노드(macOS/iOS/Android) | 중간 | 디바이스 로컬 작업 | 예(allowlist + 승인) |

**핵심 차이점**：
- sandbox 모드는 기본적으로 **승인이 필요하지 않음**(단 Sandbox 제한을 받을 수 있음)
- gateway 및 node 모드는 기본적으로 **승인이 필요함**(`full`로 설정하지 않는 한)

## 따라해 보세요

### 1단계: exec 도구 매개변수 이해

**왜**
exec 도구 매개변수를 이해하는 것은 보안 구성의 기초입니다.

exec 도구는 다음 매개변수를 지원합니다：

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**매개변수 설명**：

| 매개변수 | 유형 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `command` | string | 필수 | 실행할 Shell 명령 |
| `workdir` | string | 현재 작업 디렉토리 | 실행 디렉토리 |
| `env` | object | 환경 상속 | 환경 변수 재정의 |
| `yieldMs` | number | 10000 | 타임아웃 후 자동으로 백그라운드 전환(밀리초) |
| `background` | boolean | false | 즉시 백그라운드 실행 |
| `timeout` | number | 1800 | 실행 타임아웃(초) |
| `pty` | boolean | false | 가상 터미널에서 실행(TTY 지원) |
| `host` | string | sandbox | 실행 호스트：`sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | 보안 정책：`deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | 승인 정책：`off` \| `on-miss` \| `always` |
| `node` | string | - | node 모드의 대상 노드 ID 또는 이름 |

**확인해야 할 것**：매개변수 목록은 각 실행 모드의 제어 방식을 명확하게 설명합니다.

### 2단계: 기본 실행 모드 구성

**왜**
구성 파일을 통해 전역 기본값을 설정하면 모든 exec 호출 시 매개변수를 지정할 필요가 없습니다.

`~/.clawdbot/clawdbot.json` 편집：

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**구성 항목 설명**：

| 구성 항목 | 유형 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `host` | string | sandbox | 기본 실행 호스트 |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | 기본 보안 정책 |
| `ask` | string | on-miss | 기본 승인 정책 |
| `node` | string | - | node 모드의 기본 노드 |
| `notifyOnExit` | boolean | true | 백그라운드 작업 종료 시 시스템 이벤트 전송 |
| `approvalRunningNoticeMs` | number | 10000 | 타임아웃 후 "실행 중" 알림 전송(0으로 비활성화) |
| `pathPrepend` | string[] | - | PATH에 추가할 디렉토리 목록 |
| `safeBins` | string[] | [기본 목록] | 안전한 바이너리 목록(stdin 작업만) |

**확인해야 할 것**：구성 저장 후 exec 도구는 이러한 기본값을 사용합니다.

### 3단계: `/exec` 세션 재정의 사용

**왜**
세션 재정의를 사용하면 구성 파일을 편집하지 않고도 실행 매개변수를 일시적으로 조정할 수 있습니다.

채팅에서 전송：

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

현재 재정의 값 확인：

```
/exec
```

**확인해야 할 것**：현재 세션의 exec 매개변수 구성이 표시됩니다.

### 4단계: 허용 목록(Allowlist) 구성

**왜**
allowlist는 gateway/node 모드의 핵심 보안 메커니즘으로, 특정 명령만 실행을 허용합니다.

#### allowlist 편집

**UI로 편집**：

1. Control UI 열기
2. **Nodes** 탭으로 이동
3. **Exec approvals** 카드 찾기
4. 대상(Gateway 또는 Node) 선택
5. Agent 선택(예：`main`)
6. **Add pattern** 클릭하여 명령 패턴 추가
7. **Save** 클릭하여 저장

**CLI로 편집**：

```bash
clawdbot approvals
```

**JSON 파일로 편집**：

`~/.clawdbot/exec-approvals.json` 편집：

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Allowlist 모드 설명**：

allowlist는 **glob 패턴 매칭**(대소문자 구분 안 함)을 사용합니다：

| 패턴 | 일치 | 설명 |
|--- | --- | ---|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | 모든 하위 디렉토리 매칭 |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | 로컬 bin 매칭 |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | 절대 경로 매칭 |

::: warning 중요한 규칙
- **해석된 바이너리 경로만 매칭**，basename 매칭 지원하지 않음(예：`rg`)
- Shell 연결(`&&`、`||`、`;`)은 각 세그먼트가 allowlist를 충족해야 함
- 리디렉션(`>`、`<`)은 allowlist 모드에서 지원되지 않음
:::

**확인해야 할 것**：allowlist 구성 후 일치하는 명령만 실행할 수 있습니다.

### 5단계: 안전한 bins(Safe Bins) 이해

**왜**
safe bins는 stdin 작업만 지원하는 안전한 바이너리의 세트로, allowlist 모드에서 명시적 allowlist 없이 사용할 수 있습니다.

**기본 안전한 bins**：

`jq`、`grep`、`cut`、`sort`、`uniq`、`head`、`tail`、`tr`、`wc`

**안전한 bin의 보안 특성**：

- 위치 파일 인수 거부
- 경로와 유사한 플래그 거부
- 전달된 스트림(stdin)만 작업 가능

**사용자 정의 안전한 bins 구성**：

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**확인해야 할 것**：safe bins 명령은 allowlist 모드에서 직접 실행할 수 있습니다.

### 6단계: 채팅 채널을 통해 exec 요청 승인

**왜**
UI를 사용할 수 없는 경우, 채팅 채널(WhatsApp, Telegram, Slack 등)을 통해 exec 요청을 승인할 수 있습니다.

#### 승인 전달 활성화

`~/.clawdbot/clawdbot.json` 편집：

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**구성 항목 설명**：

| 구성 항목 | 설명 |
|--- | ---|
| `enabled` | exec 승인 전달 활성화 여부 |
| `mode` | `"session"` \| `"targets"` \| `"both"` - 승인 대상 모드 |
| `agentFilter` | 특정 agent의 승인 요청만 처리 |
| `sessionFilter` | 세션 필터(substring 또는 regex) |
| `targets` | 대상 채널 목록(`channel` + `to`) |

#### 요청 승인

exec 도구가 승인이 필요할 때 다음 정보가 포함된 메시지를 받게 됩니다：

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**승인 옵션**：

```
/approve abc-123 allow-once     # 한 번만 허용
/approve abc-123 allow-always    # 항상 허용(allowlist에 추가)
/approve abc-123 deny           # 거부
```

**확인해야 할 것**：승인 후 명령이 실행되거나 거부됩니다.

## 체크포인트 ✅

- [ ] 3가지 실행 모드(sandbox/gateway/node)의 차이 이해
- [ ] 전역 exec 기본 매개변수 구성
- [ ] `/exec` 명령 세션 재정의 사용 가능
- [ ] allowlist 구성(최소 하나의 패턴)
- [ ] safe bins의 보안 특성 이해
- [ ] 채팅 채널을 통해 exec 요청 승인 가능

## 일반적인 문제 해결

### 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|--- | --- | ---|
| `Command not allowed by exec policy` | `security=deny` 또는 allowlist 불일치 | `tools.exec.security` 및 allowlist 구성 확인 |
| `Approval timeout` | UI 사용 불가, `askFallback=deny` | `askFallback=allowlist` 설정 또는 UI 활성화 |
| `Pattern does not resolve to binary` | allowlist 모드에서 basename 사용 | 전체 경로 사용(예：`/opt/homebrew/bin/rg`) |
| `Unsupported shell token` | allowlist 모드에서 `>` 또는 `&&` 사용 | 명령 분리 또는 `security=full` 사용 |
| `Node not found` | node 모드에서 노드 페어링되지 않음 | 먼저 노드 페어링 완료 |

### Shell 연결 및 리디렉션

::: danger 경고
`security=allowlist` 모드에서 다음 Shell 기능은 **지원되지 않습니다**：
- 파이프：`|`(단 `||`는 지원)
- 리디렉션：`>`、`<`、`>>`
- 명령 대체：`$()`、`` ` ` ``
- 백그라운드：`&`、`;`
:::

**해결 방법**：
- `security=full` 사용(신중하게)
- 여러 exec 호출로 분리
- 래퍼 스크립트 작성 및 스크립트 경로 allowlist에 추가

### PATH 환경 변수

실행 모드에 따라 PATH 처리 방식이 다릅니다：

| 실행 모드 | PATH 처리 | 설명 |
|--- | --- | ---|
| `sandbox` | shell login 상속, `/etc/profile`로 재설정될 수 있음 | `pathPrepend`는 profile 다음에 적용 |
| `gateway` | 로그인 shell PATH를 exec 환경으로 병합 | daemon은 최소 PATH 유지, exec는 사용자 PATH 상속 |
| `node` | 전달된 환경 변수 재정의만 사용 | macOS 노드는 `PATH` 재정의 폐기, headless 노드는 prepend 지원 |

**확인해야 할 것**：PATH 구성이 명령 검색에 올바르게 영향을 줍니다.

## 요약

exec 도구는 3계층 보호 메커니즘(도구 정책, 실행 호스트, 승인)을 통해 AI 어시스턴트가 Shell 명령을 안전하게 실행할 수 있게 합니다：

- **실행 모드**：sandbox(컨테이너 격리), gateway(로컬 실행), node(디바이스 작업)
- **보안 정책**：deny(완전히 금지), allowlist(허용 목록), full(완전 허용)
- **승인 메커니즘**：off(프롬프트 없음), on-miss(불일치 시 프롬프트), always(항상 프롬프트)
- **허용 목록**：glob 패턴 매칭 해석된 바이너리 경로
- **안전한 bins**：stdin 작업만 하는 바이너리는 allowlist 모드에서 승인 없음

## 다음 레슨 예고

> 다음 레슨에서는 **[웹 검색 및 스크래핑 도구](../tools-web/)**를 학습합니다
>
> 학습 내용：
> - `web_search` 도구를 사용하여 웹 검색하는 방법
> - `web_fetch` 도구를 사용하여 웹 페이지 콘텐츠 스크래핑하는 방법
> - 검색 엔진 제공업체(Brave, Perplexity) 구성하는 방법
> - 검색 결과 및 웹 스크래핑 오류 처리하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확장</strong></summary>

> 업데이트: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| exec 도구 정의 | [`src/agents/bash-tools.exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/bash-tools.exec.ts) | 1-500+ |
| exec 승인 로직 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1-1268 |
| Shell 명령 분석 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 500-1100 |
| Allowlist 매칭 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 507-521 |
| Safe bins 검증 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 836-873 |
| 승인 Socket 통신 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1210-1267 |
| 프로세스 실행 | [`src/process/exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/process/exec.ts) | 1-125 |
| 도구 구성 Schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**중요한 유형**：
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - 실행 호스트 유형
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - 보안 정책
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - 승인 정책
- `ExecAllowlistEntry`: allowlist 항목 유형(`pattern`, `lastUsedAt` 등 포함)

**중요한 상수**：
- `DEFAULT_SECURITY = "deny"` - 기본 보안 정책
- `DEFAULT_ASK = "on-miss"` - 기본 승인 정책
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - 기본 안전한 bins

**중요한 함수**：
- `resolveExecApprovals()`: exec-approvals.json 구성 해석
- `evaluateShellAllowlist()`: Shell 명령이 allowlist를 충족하는지 평가
- `matchAllowlist()`: 명령 경로가 allowlist 패턴과 일치하는지 확인
- `isSafeBinUsage()`: 명령이 안전한 bin 사용인지 검증
- `requestExecApprovalViaSocket()`: Unix 소켓을 통해 승인 요청

</details>
