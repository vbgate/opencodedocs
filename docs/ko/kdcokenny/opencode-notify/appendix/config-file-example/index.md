---
title: "설정 파일 예제: notifyChildSessions 및 sounds 설명 | opencode-notify 튜토리얼"
sidebarTitle: "사용자 정의 설정 파일"
subtitle: "설정 파일 예제: notifyChildSessions 및 sounds 설명"
description: "opencode-notify의 완전한 설정 파일 예제를 확인하고, notifyChildSessions, sounds, quietHours, terminal 등 모든 설정 필드의 상세 주석, 기본값 설정, 최소 설정 예제, macOS 사용 가능한 사운드 전체 목록 및 플러그인 비활성화 방법을 학습하세요. 버전 히스토리와 새로운 기능 개선 사항은 변경 로그를 참조하세요."
tags:
  - "설정"
  - "예제"
  - "부록"
order: 140
---

# 설정 파일 예제

## 전체 설정 예제

다음 내용을 `~/.config/opencode/kdco-notify.json`에 저장하세요:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "Ghostty"
}
```

## 필드 설명

### notifyChildSessions

- **타입**: boolean
- **기본값**: `false`
- **설명**: 자식 세션(하위 작업)에 대한 알림 여부

기본적으로 플러그인은 부모 세션만 알림하여 하위 작업으로 인한 알림 노이즈를 방지합니다. 모든 하위 작업의 완료 상태를 추적해야 하는 경우 `true`로 설정하세요.

```json
{
  "notifyChildSessions": false  // 부모 세션만 알림 (권장)
}
```

### sounds

사운드 설정은 macOS 플랫폼에서만 적용됩니다.

#### sounds.idle

- **타입**: string
- **기본값**: `"Glass"`
- **설명**: 작업 완료 시 재생되는 사운드

AI 세션이 유휴 상태(작업 완료)가 되면 재생됩니다.

#### sounds.error

- **타입**: string
- **기본값**: `"Basso"`
- **설명**: 오류 발생 시 재생되는 사운드

AI 세션 실행 중 오류가 발생하면 재생됩니다.

#### sounds.permission

- **타입**: string
- **기본값**: `"Submarine"`
- **설명**: 권한 요청 시 재생되는 사운드

AI가 특정 작업 실행을 위해 사용자 승인이 필요할 때 재생됩니다.

#### sounds.question

- **타입**: string (선택 사항)
- **기본값**: 미설정 (permission 사운드 사용)
- **설명**: 질문 시 재생되는 사운드

AI가 사용자에게 질문할 때 재생됩니다. 설정하지 않으면 `permission` 사운드가 사용됩니다.

### quietHours

방해 금지 시간대 설정으로, 지정된 시간대에 알림을 받지 않도록 합니다.

#### quietHours.enabled

- **타입**: boolean
- **기본값**: `false`
- **설명**: 방해 금지 시간대 활성화 여부

#### quietHours.start

- **타입**: string
- **기본값**: `"22:00"`
- **설명**: 방해 금지 시작 시간 (24시간제, HH:MM 형식)

#### quietHours.end

- **타입**: string
- **기본값**: `"08:00"`
- **설명**: 방해 금지 종료 시간 (24시간제, HH:MM 형식)

자정을 넘는 시간대를 지원합니다. 예를 들어 `"22:00"`부터 `"08:00"`까지는 밤 10시부터 다음 날 오전 8시까지 알림을 보내지 않습니다.

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **타입**: string (선택 사항)
- **기본값**: 미설정 (자동 감지)
- **설명**: 터미널 유형을 수동으로 지정하여 자동 감지 결과를 덮어씁니다

자동 감지가 실패하거나 수동으로 지정해야 하는 경우, 사용 중인 터미널 이름으로 설정하세요.

```json
{
  "terminal": "Ghostty"  // 또는 "iTerm", "Kitty", "WezTerm" 등
}
```

## macOS 사용 가능한 사운드 목록

다음은 `sounds` 설정에 사용할 수 있는 macOS 시스템 내장 알림 사운드입니다:

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## 최소 설정 예제

일부 설정만 변경하려면 수정이 필요한 필드만 포함하면 됩니다. 나머지 필드는 기본값이 사용됩니다:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## 플러그인 비활성화

플러그인을 일시적으로 비활성화하려면 설정 파일을 삭제하면 됩니다. 플러그인은 기본 설정으로 복원됩니다.

## 다음 강의 예고

> 다음 강의에서는 **[변경 로그](../changelog/release-notes/)**를 학습합니다.
>
> 배우게 될 내용:
> - 버전 히스토리 및 주요 변경 사항
> - 새로운 기능 및 개선 기록
