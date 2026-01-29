---
title: "DM 페어링 및 접근 제어: AI 어시스턴트 보호 | Clawdbot 튜토리얼"
sidebarTitle: "모르는 발신자 접근 관리"
subtitle: "DM 페어링 및 접근 제어: AI 어시스턴트 보호"
description: "Clawdbot의 DM 페어링 보호 메커니즘을 이해하고, CLI를 통해 모르는 발신자의 페어링 요청을 승인하고, 대기 중인 요청을 나열하며, 허용 목록을 관리하는 방법을 학습합니다. 본 튜토리얼은 페어링 프로세스, CLI 명령 사용, 접근 정책 구성 및 보안 모범 사례를 완전히 소개하며, 일반적인 오류 해결 및 doctor 명령을 포함합니다."
tags:
  - "입문"
  - "보안"
  - "페어링"
  - "접근 제어"
prerequisite:
  - "start-gateway-startup"
order: 50
---

# DM 페어링 및 접근 제어: AI 어시스턴트 보호

## 학습 완료 후 할 수 있는 것

본 튜토리얼을 완료한 후, 다음을 할 수 있게 됩니다:

- ✅ 기본 DM 페어링 보호 메커니즘 이해
- ✅ 모르는 발신자의 페어링 요청 승인
- ✅ 대기 중인 페어링 요청 나열 및 관리
- ✅ 다른 DM 접근 정책 구성 (pairing/allowlist/open)
- ✅ doctor를 실행하여 보안 구성 검사

## 현재 문제 상황

WhatsApp 또는 Telegram 채널을 구성했고 AI 어시스턴트와 대화하고 싶지만 다음 문제에 직면했을 수 있습니다:

- "모르는 사람이 메시지를 보내는데 Clawdbot이 응답하지 않는 이유는 무엇인가요?"
- "페어링 코드를 받았지만 의미를 모릅니다"
- "특정 사람의 요청을 승인하고 싶지만 사용할 명령을 모릅니다"
- "현재 승인 대기 중인 사람이 누구인지 어떻게 확인할 수 있나요?"

좋은 소식은: **Clawdbot은 기본적으로 DM 페어링 보호가 활성화**되어 있습니다. 이는 승인한 발신자만 AI 어시스턴트와 대화할 수 있도록 보장하기 위한 것입니다.

## 언제 사용하는가

다음이 필요할 때:

- 🛡 **개인 정보 보호**: 신뢰할 수 있는 사람만 AI 어시스턴트와 대화할 수 있도록 보장
- ✅ **모르는 사람 승인**: 새로운 발신자가 AI 어시스턴트에 접근할 수 있도록 허용
- 🔒 **엄격한 접근 제어**: 특정 사용자의 접근 권한 제한
- 📋 **일괄 관리**: 모든 대기 중인 페어링 요청 보기 및 관리

---

## 핵심 아이디어

### DM 페어링이란?

Clawdbot은 실제 메시징 플랫폼(WhatsApp, Telegram, Slack 등)에 연결됩니다. 이 플랫폼의 **DM(직접 메시지)은 기본적으로 신뢰할 수 없는 입력으로 간주**됩니다.

AI 어시스턴트를 보호하기 위해 Clawdbot은 **페어링 메커니즘**을 제공합니다:

::: info 페어링 프로세스
1. 모르는 발신자가 메시지를 보냅니다
2. Clawdbot이 해당 발신자가 승인되지 않았음을 감지합니다
3. Clawdbot이 **페어링 코드**(8자)를 반환합니다
4. 발신자가 페어링 코드를 제공해야 합니다
5. CLI를 통해 코드를 승인합니다
6. 발신자 ID가 허용 목록에 추가됩니다
7. 발신자가 AI 어시스턴트와 정상적으로 대화할 수 있습니다
:::

### 기본 DM 정책

**모든 채널은 기본적으로 `dmPolicy="pairing"`을 사용**합니다. 이는 다음을 의미합니다:

| 정책 | 동작 |
| ------ | ---- |
| `pairing` | 알 수 없는 발신자가 페어링 코드를 받고 메시지가 처리되지 않음 (기본값) |
| `allowlist` | `allowFrom` 목록의 발신자만 허용 |
| `open` | 모든 발신자 허용 (명시적으로 `"*"` 구성 필요) |
| `disabled` | DM 기능 완전히 비활성화 |

::: warning 보안 경고
기본 `pairing` 모드가 가장 안전한 선택입니다. 특별한 요구 사항이 없는 한 `open` 모드로 수정하지 마십시오.
:::

---

## 🎒 시작 전 준비

다음을 완료했는지 확인하십시오:

- [x] [빠른 시작](../../getting-started/) 튜토리얼 완료
- [x] [Gateway 시작](../../gateway-startup/) 튜토리얼 완료
- [x] 하나 이상의 메시징 채널 구성 (WhatsApp, Telegram, Slack 등)
- [x] Gateway 실행 중

---

## 따라해보세요

### 1단계: 페어링 코드의 출처 이해

모르는 발신자가 Clawdbot에 메시지를 보낼 때 다음과 같은 응답을 받습니다:

```
Clawdbot: access not configured.

Telegram ID: 123456789

Pairing code: AB3D7X9K

Ask the bot owner to approve with:
clawdbot pairing approve telegram <code>
```

**페어링 코드의 핵심 특성** (출처: `src/pairing/pairing-store.ts`):

- **8자**: 입력 및 기억에 용이
- **대문자와 숫자**: 혼동 방지
- **혼동 문자 제외**: 0, O, 1, I 제외
- **1시간 유효 기간**: 시간 초과 시 자동 만료
- **최대 3개의 대기 중인 요청 보관**: 초과 시 가장 오래된 요청 자동 정리

### 2단계: 대기 중인 페어링 요청 나열

터미널에서 다음 명령을 실행하십시오:

```bash
clawdbot pairing list telegram
```

**다음이 표시되어야 합니다**:

```
Pairing requests (1)

┌──────────────────┬────────────────┬────────┬──────────────────────┐
│ Code            │ ID            │ Meta   │ Requested            │
├──────────────────┼────────────────┼────────┼──────────────────────┤
│ AB3D7X9K        │ 123456789      │        │ 2026-01-27T10:30:00Z │
└──────────────────┴────────────────┴────────┴──────────────────────┘
```

대기 중인 요청이 없으면 다음이 표시됩니다:

```
No pending telegram pairing requests.
```

::: tip 지원되는 채널
페어링 기능은 다음 채널을 지원합니다:
- telegram
- whatsapp
- slack
- discord
- signal
- imessage
- msteams
- googlechat
- bluebubbles
:::

### 3단계: 페어링 요청 승인

발신자가 제공한 페어링 코드를 사용하여 접근을 승인하십시오:

```bash
clawdbot pairing approve telegram AB3D7X9K
```

**다음이 표시되어야 합니다**:

```
✅ Approved telegram sender 123456789
```

::: info 승인 후 효과
승인 후 발신자 ID(123456789)가 해당 채널의 허용 목록에 자동으로 추가되며 다음 위치에 저장됩니다:
`~/.clawdbot/credentials/telegram-allowFrom.json`
:::

### 4단계: 발신자에게 알림 (선택 사항)

발신자에게 자동으로 알리고 싶다면 `--notify` 플래그를 사용하십시오:

```bash
clawdbot pairing approve telegram AB3D7X9K --notify
```

발신자는 다음 메시지를 받습니다 (출처: `src/channels/plugins/pairing-message.ts`):

```
✅ Clawdbot access approved. Send a message to start chatting.
```

**참고**: `--notify` 플래그는 Clawdbot Gateway가 실행 중이고 해당 채널이 활성 상태여야 합니다.

### 5단계: 발신자가 정상적으로 대화할 수 있는지 확인

발신자가 다시 메시지를 보내면 AI 어시스턴트가 정상적으로 응답해야 합니다.

---

## 체크포인트 ✅

다음 검사를 완료하여 구성이 올바른지 확인하십시오:

- [ ] `clawdbot pairing list <channel>`을 실행하여 대기 중인 요청을 볼 수 있음
- [ ] `clawdbot pairing approve <channel> <code>`를 사용하여 성공적으로 승인할 수 있음
- [ ] 승인된 발신자가 AI 어시스턴트와 정상적으로 대화할 수 있음
- [ ] 페어링 코드가 1시간 후에 자동으로 만료됨 (다시 메시지를 보내어 확인 가능)

---

## 일반적인 문제 해결

### 오류 1: 페어링 코드를 찾을 수 없음

**오류 메시지**:
```
No pending pairing request found for code: AB3D7X9K
```

**가능한 원인**:
- 페어링 코드가 이미 만료됨 (1시간 초과)
- 페어링 코드 입력 오류 (대소문자 확인)
- 발신자가 실제로 메시지를 보내지 않음 (페어링 코드는 메시지 수신 시에만 생성됨)

**해결 방법**:
- 발신자가 다시 메시지를 보내 새로운 페어링 코드를 생성하도록 요청
- 페어링 코드를 올바르게 복사했는지 확인 (대소문자 주의)

### 오류 2: 채널이 페어링을 지원하지 않음

**오류 메시지**:
```
Channel xxx does not support pairing
```

**가능한 원인**:
- 채널 이름 철자 오류
- 해당 채널이 페어링 기능을 지원하지 않음

**해결 방법**:
- `clawdbot pairing list`를 실행하여 지원되는 채널 목록 확인
- 올바른 채널 이름 사용

### 오류 3: 알림 실패

**오류 메시지**:
```
Failed to notify requester: <error details>
```

**가능한 원인**:
- Gateway가 실행되지 않음
- 채널 연결 끊김
- 네트워크 문제

**해결 방법**:
- Gateway가 실행 중인지 확인
- 채널 연결 상태 확인: `clawdbot channels status`
- `--notify` 플래그를 사용하지 않고 발신자에게 수동으로 알림

---

## 요약

본 튜토리얼은 Clawdbot의 DM 페어링 보호 메커니즘을 소개했습니다:

- **기본 보안**: 모든 채널은 기본적으로 `pairing` 모드를 사용하여 AI 어시스턴트 보호
- **페어링 프로세스**: 모르는 발신자가 8자 페어링 코드를 받고 CLI를 통해 승인 필요
- **관리 명령**:
  - `clawdbot pairing list <channel>`: 대기 중인 요청 나열
  - `clawdbot pairing approve <channel> <code>`: 페어링 승인
- **저장 위치**: 허용 목록은 `~/.clawdbot/credentials/<channel>-allowFrom.json`에 저장
- **자동 만료**: 페어링 요청은 1시간 후 자동으로 만료

기억하십시오: **페어링 메커니즘은 Clawdbot의 보안 기반**이며, 승인한 사람만 AI 어시스턴트와 대화할 수 있도록 보장합니다.

---

## 다음 튜토리얼 미리보기

> 다음 튜토리얼에서는 **[문제 해결: 일반적인 문제 해결](../../faq/troubleshooting/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - 빠른 진단 및 시스템 상태 검사
> - Gateway 시작, 채널 연결, 인증 오류 등의 문제 해결
> - 도구 호출 실패 및 성능 최적화 문제 해결 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 페어링 코드 생성 (8자, 혼동 문자 제외) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L173-L181) | 173-181 |
| 페어링 요청 저장 및 TTL (1시간) | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L11-L14) | 11-14 |
| 페어링 승인 명령 | [`src/cli/pairing-cli.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/pairing-cli.ts#L107-L143) | 107-143 |
| 페어링 코드 메시지 생성 | [`src/pairing/pairing-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-messages.ts#L4-L20) | 4-20 |
| 허용 목록 저장 | [`src/pairing/pairing-store.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/pairing/pairing-store.ts#L457-L461) | 457-461 |
| `pairing` 지원 채널 목록 | [`src/channels/plugins/pairing.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/pairing.ts#L11-L16) | 11-16 |
| 기본 DM 정책 (pairing) | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L93) | 93 |

**핵심 상수**:
- `PAIRING_CODE_LENGTH = 8`: 페어링 코드 길이
- `PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`: 페어링 코드 문자 집합 (0O1I 제외)
- `PAIRING_PENDING_TTL_MS = 60 * 60 * 1000`: 페어링 요청 유효 기간 (1시간)
- `PAIRING_PENDING_MAX = 3`: 최대 대기 중인 요청 수

**핵심 함수**:
- `approveChannelPairingCode()`: 페어링 코드를 승인하고 허용 목록에 추가
- `listChannelPairingRequests()`: 대기 중인 페어링 요청 나열
- `upsertChannelPairingRequest()`: 페어링 요청 생성 또는 업데이트
- `addChannelAllowFromStoreEntry()`: 허용 목록에 발신자 추가

</details>
