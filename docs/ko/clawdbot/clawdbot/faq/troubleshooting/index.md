---
title: "문제 해결: Gateway 시작, 채널 연결, 인증 오류 해결 | Clawdbot 튜토리얼"
sidebarTitle: "문제가 발생하면"
subtitle: "문제 해결: 일반적인 문제 해결"
description: "Clawdbot의 일반적인 문제를 해결하는 방법을 배웁니다. Gateway 시작 실패, 채널 연결 문제, 인증 오류, 도구 호출 실패, 세션 관리, 성능 최적화 등 포괄적인 문제 해결 가이드를 다룹니다."
tags:
  - "문제 해결"
  - "진단"
  - "자주 묻는 질문"
prerequisite: []
order: 310
---

# 문제 해결: 일반적인 문제 해결

Clawdbot에 문제가 발생했나요? 당황하지 마세요. 체계적인 **문제 해결** 방법이 있습니다. 이 튜토리얼은 문제를 빠르게 식별하고 해결책을 찾는 데 도움을 줍니다.

## 이 수업에서 할 수 있는 것

- Gateway 및 시스템 상태를 빠르게 진단
- Gateway 시작 실패, 채널 연결 문제를 식별하고 해결
- 인증 및 모델 구성 오류 수정
- 도구 호출 실패 및 성능 문제 해결

## 첫 번째 문제 해결: 60초 빠른 검사

문제가 발생하면 다음 명령을 순서대로 실행하여 일반적으로 문제의 근본 원인을 빠르게 찾을 수 있습니다:

```bash
# 1. 전체 상태 확인
clawdbot status

# 2. 심층 진단(구성, 실행 상태, 로그 포함)
clawdbot status --all

# 3. Gateway 연결성 테스트
clawdbot gateway probe

# 4. 실시간 로그 보기
clawdbot logs --follow

# 5. 진단 검사 실행
clawdbot doctor
```

Gateway에 연결할 수 있는 경우 심층 테스트를 실행:

```bash
clawdbot status --deep
```

::: tip 명령 설명
| 명령 | 기능 | 사용 시나리오 |
| --- | --- | --- |
| `clawdbot status` | 로컬 요약: 시스템 정보, Gateway 연결, 서비스 상태, Agent 상태, 제공자 구성 | 첫 번째 확인, 빠른 개요 |
| `clawdbot status --all` | 완전 진단(읽기 전용, 공유 가능, 비교적 안전), 로그 꼬리 포함 | 디버그 보고서를 공유해야 할 때 |
| `clawdbot status --deep` | Gateway 헬스 체크 실행(제공자 프로브 포함, 연결 가능한 Gateway 필요) | "구성됨"이지만 "작동 중"이 아닐 때 |
| `clawdbot gateway probe` | Gateway 발견 + 연결성(로컬 + 원격 대상) | 잘못된 Gateway를 프로브한 것 같을 때 |
| `clawdbot channels status --probe` | 실행 중인 Gateway에 채널 상태 요청(선택적 프로브) | Gateway는 도달 가능하지만 채널에 이상이 있을 때 |
| `clawdbot gateway status` | Supervisor 상태(launchd/systemd/schtasks), 런타임 PID/종료, 마지막 Gateway 오류 | 서비스가 "로드된 것처럼 보이지만" 아무것도 실행되지 않을 때 |
:::

::: warning 출력 공유 시
- 우선 `clawdbot status --all` 사용(자동으로 토큰 마스킹)
- 반드시 `clawdbot status`를 붙여넣어야 하는 경우, 먼저 `CLAWDBOT_SHOW_SECRETS=0` 설정(토큰 미리보기 숨김)
:::

## 일반적인 문제 해결

### Gateway 관련 문제

#### "clawdbot: command not found"

**증상**: 터미널에서 명령을 찾을 수 없다고 표시됩니다.

**원인**: 거의 항상 Node/npm PATH 문제입니다.

**해결 방법**:

```bash
# 1. Node.js가 설치되었는지 확인
node --version  # 需要 ≥22

# 2. npm/pnpm이 사용 가능한지 확인
npm --version
# 또는
pnpm --version

# 3. 전역 설치 경로 확인
which clawdbot
npm list -g --depth=0 | grep clawdbot
```

명령을 찾을 수 없는 경우:

```bash
# 재설치
npm install -g clawdbot@latest
# 또는
pnpm add -g clawdbot@latest
```

**관련 문서**: [빠른 시작](../../start/getting-started/)

---

#### Gateway 시작 실패: "configuration invalid" / "set gateway.mode=local"

**증상**: Gateway가 시작을 거부하고 구성이 잘못되었거나 실행 모드가 설정되지 않았다고 표시합니다.

**원인**: 구성 파일이 존재하지만 `gateway.mode`가 설정되지 않았거나(또는 `local`이 아님), Gateway가 시작을 거부합니다.

**해결 방법**(권장):

```bash
# 마법사 실행 및 Gateway 실행 모드를 Local로 설정
clawdbot configure
```

또는 직접 설정:

```bash
clawdbot config set gateway.mode local
```

**원격 Gateway**를 실행하려는 경우:

```bash
clawdbot config set gateway.mode remote
clawdbot config set gateway.remote.url "wss://gateway.example.com"
```

::: info 임시 디버깅 모드
Ad-hoc/개발 시나리오: `--allow-unconfigured` 전달로 Gateway 시작(`gateway.mode=local` 요구 안 함)
:::

아직 구성 파일이 없는 경우:

```bash
clawdbot setup  # 초기 구성 생성, Gateway 재시작
```

---

#### Gateway "unauthorized", 연결할 수 없음, 또는 계속 재연결

**증상**: CLI가 인증되지 않았다고 표시, Gateway에 연결할 수 없음, 또는 계속 재연결.

**원인**: 인증 구성 오류 또는 누락.

**확인 단계**:

```bash
# 1. Gateway 상태 확인
clawdbot gateway status

# 2. 로그 보기
clawdbot logs --follow
```

**해결 방법**:

1. `gateway.auth.mode` 구성 확인(선택 가능한 값: `token`/`password`/`tailscale`)
2. `token` 모드인 경우:
   ```bash
   clawdbot config get gateway.auth.token
   ```
3. `password` 모드인 경우, 비밀번호가 올바른지 확인
4. 비 loopback 바인딩(`lan`/`tailnet`/`custom`)인 경우, `gateway.auth.token`을 구성해야 함

::: warning 바인딩 모드와 인증
- Loopback(기본값): 일반적으로 인증 불필요
- LAN/Tailnet/Custom: `gateway.auth.token` 또는 `CLAWDBOT_GATEWAY_TOKEN`을 구성해야 함
- `gateway.remote.token`은 원격 CLI 호출 전용, 로컬 인증 활성화 안 함
- 무시되는 필드: `gateway.token`(`gateway.auth.token` 사용)
:::

---

#### 서비스가 실행 중인 것으로 표시되지만 포트가 수신 대기하지 않음

**증상**: `clawdbot gateway status`가 `Runtime: running`을 표시하지만 포트 `18789`가 수신 대기하지 않음.

**원인**: Gateway가 바인딩을 거부하거나 구성 불일치.

**확인 목록**:

```bash
# 1. Gateway 상태 확인
clawdbot gateway status

# 2. 마지막 Gateway 오류 보기
clawdbot gateway status | grep "error\|Error\|refusing"

# 3. 포트 점유 확인
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

**일반적인 원인 및 수정**:

1. **포트가 이미 사용 중**:
   ```bash
   # 점유 프로세스 확인
   lsof -nP -iTCP:18789 -sTCP:LISTEN
   
   # 서비스 중지 또는 포트 변경
   clawdbot config set gateway.port 18790
   ```

2. **구성 불일치**:
   - CLI 구성과 Service 구성 불일치
   - 수정: 동일한 `--profile` / `CLAWDBOT_STATE_DIR`에서 재설치
   ```bash
   clawdbot gateway install --force
   ```

3. **비 loopback 바인딩에 인증 누락**:
   - 로그 표시: "refusing to bind … without auth"
   - 수정: `gateway.auth.mode` + `gateway.auth.token` 설정

4. **Tailnet 바인딩 실패**:
   - 로그 표시: "no tailnet interface was found"
   - 수정: Tailscale 시작 또는 `gateway.bind`를 `loopback`/`lan`으로 변경

---

#### Gateway "시작 차단됨: set gateway.mode=local"

**증상**: 구성이 존재하지만 시작이 차단됨.

**원인**: `gateway.mode`가 `local`로 설정되지 않았거나(또는 설정되지 않음).

**해결 방법**:

```bash
# 솔루션 1: 구성 마법사 실행
clawdbot configure

# 솔루션 2: 직접 설정
clawdbot config set gateway.mode local

# 솔루션 3: 임시로 구성되지 않은 시작 허용(개발 전용)
clawdbot gateway --allow-unconfigured
```

---

### 모델 및 인증 문제

#### "No API key found for provider 'anthropic'"

**증상**: Agent가 제공자의 API 키를 찾을 수 없다고 표시함.

**원인**: Agent의 인증 저장소가 비어 있거나 Anthropic 자격 증명이 누락됨. 인증은 **각 Agent마다 독립적**이며, 새 Agent는 기본 Agent의 키를 상속하지 않음.

**해결 방법**:

**옵션 1**: onboarding을 다시 실행하고 해당 Agent에서 **Anthropic** 선택

```bash
clawdbot configure
```

**옵션 2**: **Gateway 호스트**에서 setup-token 붙여넣기:

```bash
clawdbot models auth setup-token --provider anthropic
```

**옵션 3**: `auth-profiles.json`을 기본 Agent 디렉토리에서 새 Agent 디렉토리로 복사

**확인**:

```bash
clawdbot models status
```

**관련 문서**: [AI 모델 및 인증 구성](../../advanced/models-auth/)

---

#### OAuth token refresh failed(Anthropic Claude 구독)

**증상**: 저장된 Anthropic OAuth 토큰이 만료되었고, 새로 고침 실패.

**원인**: 저장된 OAuth 토큰이 만료되었고 새로 고침 실패. Claude 구독(API Key 없음)을 사용하는 경우, 가장 신뢰할 수 있는 수정은 **Claude Code setup-token**으로 전환하거나 **Gateway 호스트**에서 Claude Code CLI OAuth를 다시 동기화하는 것.

**해결 방법**(권장 - setup-token):

```bash
# Gateway 호스트에서 실행(Claude Code CLI 실행)
clawdbot models auth setup-token --provider anthropic
clawdbot models status
```

다른 곳에서 토큰을 생성한 경우:

```bash
clawdbot models auth paste-token --provider anthropic
clawdbot models status
```

**OAuth를 유지하려는 경우**:
Gateway 호스트에서 Claude Code CLI로 로그인한 다음 `clawdbot models status`를 실행하여 새로 고침된 토큰을 Clawdbot 인증 저장소에 동기화.

---

#### "/model"에서 "model not allowed" 표시

**증상**: 모델 전환 시 모델이 허용되지 않는다고 표시됨.

**원인**: 일반적으로 `agents.defaults.models`가 allowlist(화이트리스트)로 구성되어 있음을 의미함. 비어 있지 않을 때 해당 provider/model 키만 선택할 수 있음.

**해결 방법**:

```bash
# 1. allowlist 확인
clawdbot config get agents.defaults.models

# 2. 원하는 모델 추가(또는 allowlist 비우기)
clawdbot config set agents.defaults.models []
# 또는
clawdbot config set agents.defaults.models '["anthropic/claude-sonnet-4-20250514"]'

# 3. /model 명령 재시도
```

`/models`를 사용하여 허용된 제공자/모델 찾아보기.

---

#### "All models failed" — 먼저 무엇을 확인해야 할까요?

**확인 목록**:

1. **자격 증명 존재**: 제공자의 인증 구성 확인(auth profiles + 환경 변수)
2. **모델 라우팅**: `agents.defaults.model.primary` 및 fallback이 액세스 가능한 모델을 가리키는지 확인
3. **Gateway 로그**: `/tmp/clawdbot/...`에서 정확한 제공자 오류 찾기
4. **모델 상태**: `/model status`(채팅) 또는 `clawdbot models status`(CLI) 사용

**상세 명령**:

```bash
# 모든 모델 상태 보기
clawdbot models status

# 특정 모델 테스트
clawdbot models scan

# 상세 로그 보기
clawdbot logs --follow | grep -i "model\|anthropic\|openai"
```

---

### 채널 연결 문제

#### 메시지가 트리거되지 않음

**증상**: 채널에서 메시지를 보냈지만 Agent가 응답하지 않음.

**확인 1**: 발신자가 화이트리스트에 있는가?

```bash
clawdbot status
# 출력에서 "AllowFrom: ..." 확인
```

**확인 2**: 그룹 채팅에서 멘션이 필요한가?

그룹 메시지는 `@mention` 또는 명령 트리거가 필요함. 구성 확인:

```bash
# 전역 또는 특정 채널의 멘션 패턴 확인
grep -E "agents\|groupChat\|mentionPatterns" \
  "${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json}"
```

**확인 3**: 로그 보기

```bash
clawdbot logs --follow
# 또는 빠른 필터:
tail -f "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | grep "blocked\|skip\|unauthorized"
```

**관련 문서**: [DM 페어링 및 액세스 제어](../../start/pairing-approval/)

---

#### 페어링 코드가 도착하지 않음

**증상**: `dmPolicy`가 `pairing`일 때, 알 수 없는 발신자는 코드를 받아야 하지만 승인될 때까지 메시지가 무시됨.

**확인 1**: 대기 중인 요청이 있는가?

```bash
clawdbot pairing list <channel>
```

::: info 페어링 요청 제한
기본적으로 각 채널 최대 **3개의 대기 중인 DM 페어링 요청**이 있음. 목록이 가득 차면 승인 또는 만료될 때까지 새 요청은 코드를 생성하지 않음.
:::

**확인 2**: 요청이 생성되었지만 응답이 전송되지 않았는가?

```bash
clawdbot logs --follow | grep "pairing request"
```

**확인 3**: `dmPolicy`가 `open`/`allowlist`가 아님을 확인

---

#### WhatsApp 연결 끊김

**증상**: WhatsApp이 자주 연결이 끊기거나 연결할 수 없음.

**진단 단계**:

```bash
# 1. 로컬 상태 확인(자격 증명, 세션, 큐 이벤트)
clawdbot status

# 2. 실행 중인 Gateway + 채널(WA 연결 + Telegram + Discord APIs) 프로브
clawdbot status --deep

# 3. 최근 연결 이벤트 확인
clawdbot logs --limit 200 | grep -i "connection\|disconnect\|logout"
```

**해결 방법**:

일반적으로 Gateway가 실행되면 자동으로 재연결. 멈춘 경우:

```bash
# Gateway 프로세스 재시작(감시 방법에 관계없이)
clawdbot gateway restart

# 또는 수동 실행 및 상세 출력 보기
clawdbot gateway --verbose
```

로그아웃/링크 해제된 경우:

```bash
# 다시 로그인 및 QR 코드 스캔
clawdbot channels login --verbose

# 로그아웃이 모든 것을 지울 수 없는 경우, 수동으로 자격 증명 삭제
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}/credentials"
```

---

### 미디어 전송 실패

**증상**: 이미지, 오디오, 비디오 또는 파일 전송 실패.

**확인 1**: 파일 경로가 유효한가?

```bash
ls -la /path/to/your/image.jpg
```

**확인 2**: 파일이 너무 큰가?

- 이미지: 최대 **6MB**
- 오디오/비디오: 최대 **16MB**
- 문서: 최대 **100MB**

**확인 3**: 미디어 로그 보기

```bash
grep "media\|fetch\|download" \
  "$(ls -t /tmp/clawdbot/clawdbot-*.log | head -1)" | tail -20
```

---

### 도구 실행 문제

#### "Agent was aborted"

**증상**: Agent가 중간에 응답 중단.

**원인**: Agent가 중단됨.

**가능한 원인**:
- 사용자가 `stop`, `abort`, `esc`, `wait`, `exit` 전송
- 시간 초과 초과
- 프로세스 충돌

**해결 방법**: 다른 메시지를 보내기만 하면, 세션 계속됨.

---

#### "Agent failed before reply: Unknown model: anthropic/claude-haiku-3-5"

**증상**: 모델이 거부됨.

**원인**: Clawdbot은 **오래된/안전하지 않은 모델**(특히 프롬프트 주입 공격에 취약한 모델)을 거부함. 이 오류가 표시되면 모델 이름은 더 이상 지원되지 않음.

**해결 방법**:

1. 제공자의 **최신** 모델 선택 및 구성 또는 모델 별칭 업데이트
2. 사용 가능한 모델이 확실하지 않은 경우 실행:
   ```bash
   clawdbot models list
   # 또는
   clawdbot models scan
   ```
3. 지원되는 모델 선택

**관련 문서**: [AI 모델 및 인증 구성](../../advanced/models-auth/)

---

#### Skill이 sandbox에서 API 키 누락

**증상**: Skill은 호스트에서 정상 작동하지만 sandbox에서 실패하고 API 키가 누락되었다고 표시함.

**원인**: sandboxed exec는 Docker 내에서 실행되며 호스트 `process.env`를 **상속하지 않음**.

**해결 방법**:

```bash
# sandbox 환경 변수 설정
clawdbot config set agents.defaults.sandbox.docker.env '{"API_KEY": "your-key-here"}'

# 또는 특정 agent에 설정
clawdbot config set agents.list[0].sandbox.docker.env '{"API_KEY": "your-key-here"}'

# sandbox 재생성
clawdbot sandbox recreate --agent <agent-id>
# 또는 모두
clawdbot sandbox recreate --all
```

---

### Control UI 문제

#### Control UI가 HTTP에서 실패("device identity required" / "connect failed")

**증상**: 순수 HTTP로 dashboard 열기(`http://<lan-ip>:18789/` 또는 `http://<tailscale-ip>:18789/` 등) 시 실패.

**원인**: 브라우저가 **안전하지 않은 컨텍스트**에서 실행되며 WebCrypto를 차단하고 장치 ID를 생성할 수 없음.

**해결 방법**:

1. HTTPS 우선([Tailscale Serve](../../advanced/remote-gateway/))
2. 또는 Gateway 호스트에서 로컬로 열기: `http://127.0.0.1:18789/`
3. HTTP를 사용해야 하는 경우, `gateway.controlUi.allowInsecureAuth: true` 활성화 및 Gateway 토큰 사용(토큰만, 장치 ID/페어링 없음):
   ```bash
   clawdbot config set gateway.controlUi.allowInsecureAuth true
   ```

**관련 문서**: [원격 Gateway 및 Tailscale](../../advanced/remote-gateway/)

---

### 세션 및 성능 문제

#### 세션이 복원되지 않음

**증상**: 세션 기록이 손실되거나 복원할 수 없음.

**확인 1**: 세션 파일이 존재하는가?

```bash
ls -la ~/.clawdbot/agents/<agentId>/sessions/
```

**확인 2**: 재설정 창이 너무 짧지 않은가?

```json
{
  "session": {
    "reset": {
      "mode": "daily",
      "atHour": 4,
      "idleMinutes": 10080  // 7일
    }
  }
}
```

**확인 3**: 누군가 `/new`, `/reset` 또는 재설정 트리거를 보냈는가?

---

#### Agent 시간 초과

**증상**: 장기 작업이 중간에 중단됨.

**원인**: 기본 시간 초과는 30분.

**해결 방법**:

장기 작업의 경우:

```json
{
  "reply": {
    "timeoutSeconds": 3600  // 1시간
  }
}
```

또는 `process` 도구를 사용하여 긴 명령을 백그라운드에서 실행.

---

#### 높은 메모리 사용

**증상**: Clawdbot이 많은 메모리를 차지함.

**원인**: Clawdbot은 대화 기록을 메모리에 유지함.

**해결 방법**:

정기적으로 재시작하거나 세션 제한 설정:

```json
{
  "session": {
    "historyLimit": 100  // 유지할 최대 메시지 수
  }
}
```

---

## 디버깅 모드

### 상세 로그 활성화

```bash
# 1. 구성에서 trace 로그 활성화
# ${CLAWDBOT_CONFIG_PATH:-$HOME/.clawdbot/clawdbot.json} 편집
# 추가:
{
  "logging": {
    "level": "trace"
  }
}

# 2. 디버깅 출력을 stdout에 미러링하는 상세 명령 실행
clawdbot gateway --verbose
clawdbot channels login --verbose
```

::: tip 로그 수준 설명
- **Level**은 파일 로그(영구적인 JSONL) 제어
- **consoleLevel**은 콘솔 출력(TTY만) 제어
- `--verbose`는 **콘솔** 출력에만 영향, 파일 로그는 `logging.level`로 제어
:::

### 로그 위치

| 로그 | 위치 |
| --- | --- |
| Gateway 파일 로그(구조화) | `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`(또는 `logging.file`) |
| Gateway 서비스 로그 | macOS: `$CLAWDBOT_STATE_DIR/logs/gateway.log` + `gateway.err.log`<br/>Linux: `journalctl --user -u clawdbot-gateway[-<profile>].service -n 200 --no-pager`<br/>Windows: `schtasks /Query /TN "Clawdbot Gateway (<profile>)" /V /FO LIST` |
| 세션 파일 | `$CLAWDBOT_STATE_DIR/agents/<agentId>/sessions/` |
| 미디어 캐시 | `$CLAWDBOT_STATE_DIR/media/` |
| 자격 증명 | `$CLAWDBOT_STATE_DIR/credentials/` |

### 헬스 체크

```bash
# Supervisor + 프로브 대상 + 구성 경로
clawdbot gateway status

# 시스템 수준 스캔 포함(레거시/추가 서비스, 포트 수신기)
clawdbot gateway status --deep

# Gateway에 도달 가능한가?
clawdbot health --json
# 실패한 경우, 실행 및 연결 세부 정보 보기
clawdbot health --verbose

# 기본 포트에 수신기가 있는가?
lsof -nP -iTCP:18789 -sTCP:LISTEN

# 최근 활동(RPC 로그 꼬리)
clawdbot logs --follow

# RPC가 닫힌 경우 대안
tail -20 /tmp/clawdbot/clawdbot-*.log
```

---

## 모든 구성 재설정

::: warning 위험한 작업
다음 작업은 모든 세션과 구성을 삭제하며 WhatsApp을 다시 페어링해야 함
:::

문제를 해결할 수 없는 경우 전체 재설정 고려:

```bash
# 1. Gateway 중지
clawdbot gateway stop

# 2. 서비스가 설치되었고 깨끗한 설치가 필요한 경우:
# clawdbot gateway uninstall

# 3. 상태 디렉토리 삭제
trash "${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}"

# 4. WhatsApp 다시 로그인
clawdbot channels login

# 5. Gateway 다시 시작
clawdbot gateway restart
# 또는
clawdbot gateway
```

---

## macOS 특정 문제

### 권한 부여 시 앱 충돌(음성/마이크)

**증상**: 개인정보 프롬프트에서 "허용"을 클릭하면 앱이 사라지거나 "Abort trap 6" 표시됨.

**해결 방법 1: TCC 캐시 재설정**

```bash
tccutil reset All com.clawdbot.mac.debug
```

**해결 방법 2: 새 Bundle ID 강제**

재설정이 효과가 없는 경우, [`scripts/package-mac-app.sh`](https://github.com/clawdbot/clawdbot/blob/main/scripts/package-mac-app.sh)의 `BUNDLE_ID` 변경(예: `.test` 접미사 추가) 및 재구축. 이렇게 하면 macOS가 새 앱으로 처리하도록 강제함.

---

#### Gateway가 "시작 중..."에서 멈춤

**증상**: 앱이 로컬 Gateway 포트 `18789`에 연결하지만 계속 멈춤.

**해결 방법 1: supervisor 중지(권장)**

Gateway가 launchd에 의해 감시되는 경우 PID를 종료하면 재시작만 함. 먼저 supervisor 중지:

```bash
# 상태 확인
clawdbot gateway status

# Gateway 중지
clawdbot gateway stop

# 또는 launchctl 사용
launchctl bootout gui/$UID/com.clawdbot.gateway
#(profile을 사용하는 경우, com.clawdbot.<profile>로 교체)
```

**해결 방법 2: 포트 바쁨(수신기 찾기)**

```bash
lsof -nP -iTCP:18789 -sTCP:LISTEN
```

감시되지 않는 프로세스인 경우, 먼저 우아한 종료 시도, 다음 강제 종료:

```bash
kill -TERM <PID>
sleep 1
kill -9 <PID>  # 최후의 수단
```

**해결 방법 3: CLI 설치 확인**

전역 `clawdbot` CLI가 설치되었고 앱 버전과 일치하는지 확인:

```bash
clawdbot --version
npm install -g clawdbot@<version>
```

---

## 도움말 얻기

위의 방법으로 문제를 해결할 수 없는 경우:

1. **먼저 로그 확인**: `/tmp/clawdbot/`(기본값: `clawdbot-YYYY-MM-DD.log`, 또는 구성한 `logging.file`)
2. **기존 issues 검색**: [GitHub Issues](https://github.com/clawdbot/clawdbot/issues)
3. **새 issue 열기** 시 포함:
   - Clawdbot 버전(`clawdbot --version`)
   - 관련 로그 스니펫
   - 재현 단계
   - 귀하의 구성(**민감한 정보 편집!**)

---

## 이 수업의 요약

문제 해결의 중요한 단계:

1. **빠른 진단**: `clawdbot status` → `status --all` → `gateway probe` 사용
2. **로그 보기**: `clawdbot logs --follow`가 가장 직접적인 신호 소스
3. **대상 지정 수정**: 증상에 따라 해당 섹션 확인(Gateway/인증/채널/도구/세션)
4. **심층 확인**: `clawdbot doctor` 및 `status --deep` 사용으로 시스템 수준 진단 획득
5. **필요 시 재설정**: 방법이 없을 때 재설정 사용, 데이터가 손실됨을 기억

기억하세요: 대부분의 문제에는 명확한 원인과 해결 방법이 있으며, 체계적인 문제 해결은 맹목적인 시도보다 효과적.

## 다음 수업 예고

> 다음 수업에서는 **[CLI 명령 참조](../cli-commands/)** 를 학습합니다.
>
> 배우게 될 것:
> - 전체 CLI 명령 목록 및 사용법
> - Gateway 관리, Agent 상호 작용, 구성 관리의 모든 명령
> - 효율적인 명령줄 사용 팁 및 모범 사례

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 문제 해결 명령 | [`src/commands/doctor.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/doctor.ts) | 전체 |
| Gateway 헬스 체크 | [`src/gateway/server-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-channels.ts) | 93+ |
| 로그 시스템 | [`src/logging/index.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/logging/index.ts) | 전체 |
| 인증 처리 | [`src/agents/auth-profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles.ts) | 전체 |
| 구성 검증 | [`src/config/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/config.ts) | 전체 |
| 채널 상태 프로브 | [`src/cli/commands/channels-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/commands/channels-cli.ts) | 전체 |

**중요한 상수**:
- 기본 Gateway 포트: `18789` - Gateway WebSocket 서비스 포트
- 기본 로그 디렉토리: `/tmp/clawdbot/` - 로그 파일 저장 위치
- 페어링 요청 상한: `3` - 각 채널의 최대 대기 페어링 요청 수

**중요한 함수**:
- `doctor()` - 진단 검사 실행 및 문제 보고
- `probeGateway()` - Gateway 연결성 테스트
- `checkAuth()` - 인증 구성 검증
- `validateConfig()` - 구성 파일 완전성 검증

</details>
