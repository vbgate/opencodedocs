---
title: "설정: DCP 다중 레벨 구성 | opencode-dcp"
sidebarTitle: "DCP 맞춤 설정"
subtitle: "설정: DCP 다중 레벨 구성"
description: "opencode-dcp의 다중 레벨 설정 시스템을 학습합니다. 전역, 환경, 프로젝트 레벨 설정의 우선순위 규칙, 프루닝 전략 설정, 보호 메커니즘 구성, 알림 레벨 조정 방법을 마스터하세요."
tags:
  - "설정"
  - "DCP"
  - "플러그인 설정"
prerequisite:
  - "start-getting-started"
order: 2
---

# DCP 설정 완벽 가이드

## 이 강의를 마치면 할 수 있는 것

- DCP의 3단계 설정 시스템(전역, 프로젝트, 환경 변수) 마스터
- 설정 우선순위 규칙 이해 및 어떤 설정이 적용되는지 파악
- 필요에 따라 프루닝 전략과 보호 메커니즘 조정
- 알림 레벨 설정으로 프루닝 알림의 상세 수준 제어

## 현재 겪고 있는 문제

DCP는 설치 후 기본 설정으로도 작동하지만, 다음과 같은 상황이 발생할 수 있습니다:

- 프로젝트마다 다른 프루닝 전략을 설정하고 싶음
- 특정 파일이 프루닝되지 않도록 하고 싶음
- 프루닝 알림이 너무 자주 또는 너무 상세함
- 특정 자동 프루닝 전략을 비활성화하고 싶음

이럴 때 DCP의 설정 시스템을 이해해야 합니다.

## 언제 이 방법을 사용하나요

- **프로젝트별 맞춤 설정**: 프로젝트마다 다른 프루닝 요구사항이 있을 때
- **문제 디버깅**: debug 로그를 활성화하여 문제 파악
- **성능 튜닝**: 전략 스위치와 임계값 조정
- **개인화된 경험**: 알림 레벨 변경, 핵심 도구 보호

## 핵심 개념

DCP는 **3단계 설정 시스템**을 사용하며, 우선순위가 낮은 것부터 높은 순서로:

```
기본값(코드 하드코딩) → 전역 설정 → 환경 변수 설정 → 프로젝트 설정
        우선순위 최저                              우선순위 최고
```

각 레벨의 설정은 이전 레벨의 동일한 설정 항목을 덮어쓰므로, 프로젝트 설정의 우선순위가 가장 높습니다.

::: info 왜 다중 레벨 설정이 필요한가요?

이렇게 설계된 목적은:
- **전역 설정**: 모든 프로젝트에 적용되는 공통 기본 동작 설정
- **프로젝트 설정**: 특정 프로젝트에 맞춤 설정, 다른 프로젝트에 영향 없음
- **환경 변수**: 다양한 환경(예: CI/CD)에서 빠르게 설정 전환

:::

## 🎒 시작하기 전 준비

[설치 및 빠른 시작](../getting-started/)을 완료하고, DCP 플러그인이 OpenCode에서 성공적으로 설치되어 실행 중인지 확인하세요.

## 따라하기

### 1단계: 현재 설정 확인

**왜 필요한가요**
기본 설정을 먼저 파악한 후 조정 방법을 결정합니다.

DCP는 처음 실행 시 자동으로 전역 설정 파일을 생성합니다.

```bash
# macOS/Linux
cat ~/.config/opencode/dcp.jsonc

# Windows PowerShell
Get-Content "$env:USERPROFILE\.config\opencode\dcp.jsonc"
```

**예상 결과**: 아래와 유사한 기본 설정

```jsonc
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    "enabled": true,
    "debug": false,
    "pruneNotification": "detailed",
    "commands": {
        "enabled": true,
        "protectedTools": []
    },
    "turnProtection": {
        "enabled": false,
        "turns": 4
    },
    "protectedFilePatterns": [],
    "tools": {
        "settings": {
            "nudgeEnabled": true,
            "nudgeFrequency": 10,
            "protectedTools": []
        },
        "discard": {
            "enabled": true
        },
        "extract": {
            "enabled": true,
            "showDistillation": false
        }
    },
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": []
        },
        "supersedeWrites": {
            "enabled": false
        },
        "purgeErrors": {
            "enabled": true,
            "turns": 4,
            "protectedTools": []
        }
    }
}
```

### 2단계: 설정 파일 위치 이해

DCP는 세 가지 레벨의 설정 파일을 지원합니다:

| 레벨 | 경로 | 우선순위 | 적용 시나리오 |
| --- | --- | --- | --- |
| **전역** | `~/.config/opencode/dcp.jsonc` 또는 `dcp.json` | 2 | 모든 프로젝트의 기본 설정 |
| **환경 변수** | `$OPENCODE_CONFIG_DIR/dcp.jsonc` 또는 `dcp.json` | 3 | 특정 환경의 설정 |
| **프로젝트** | `<project>/.opencode/dcp.jsonc` 또는 `dcp.json` | 4 | 단일 프로젝트의 설정 오버라이드 |

::: tip 설정 파일 형식

DCP는 `.json`과 `.jsonc` 두 가지 형식을 지원합니다:
- `.json`: 표준 JSON 형식, 주석 불가
- `.jsonc`: `//` 주석을 지원하는 JSON 형식 (권장)

:::

### 3단계: 프루닝 알림 설정

**왜 필요한가요**
DCP가 표시하는 프루닝 알림의 상세 수준을 제어하여 과도한 방해를 방지합니다.

전역 설정 파일 편집:

```jsonc
{
    "pruneNotification": "detailed"  // 가능한 값: "off", "minimal", "detailed"
}
```

**알림 레벨 설명**:

| 레벨 | 동작 | 적용 시나리오 |
| --- | --- | --- |
| **off** | 프루닝 알림 표시 안 함 | 개발에 집중, 피드백 불필요 |
| **minimal** | 간단한 통계만 표시 (절약된 토큰 수) | 간단한 피드백 필요, 많은 정보 원치 않음 |
| **detailed** | 프루닝 상세 정보 표시 (도구명, 이유) | 프루닝 동작 파악, 설정 디버깅 |

**예상 결과**: 설정 변경 후 다음 프루닝 발생 시 새로운 레벨로 알림이 표시됩니다.

### 4단계: 자동 프루닝 전략 설정

**왜 필요한가요**
DCP는 세 가지 자동 프루닝 전략을 제공하며, 필요에 따라 켜고 끌 수 있습니다.

설정 파일 편집:

```jsonc
{
    "strategies": {
        // 중복 제거 전략: 중복된 도구 호출 제거
        "deduplication": {
            "enabled": true,           // 활성화/비활성화
            "protectedTools": []         // 추가로 보호할 도구명
        },

        // 쓰기 대체 전략: 읽기로 대체된 쓰기 작업 정리
        "supersedeWrites": {
            "enabled": false          // 기본 비활성화
        },

        // 오류 제거 전략: 오래된 오류 도구의 입력 정리
        "purgeErrors": {
            "enabled": true,           // 활성화/비활성화
            "turns": 4,               // 몇 턴 후 오류 정리
            "protectedTools": []         // 추가로 보호할 도구명
        }
    }
}
```

**전략 상세 설명**:

- **deduplication(중복 제거)**: 기본 활성화. 동일한 도구와 매개변수의 호출을 감지하여 최신 것만 유지.
- **supersedeWrites(쓰기 대체)**: 기본 비활성화. 쓰기 작업 후 후속 읽기가 있으면 해당 쓰기 작업의 입력 정리.
- **purgeErrors(오류 제거)**: 기본 활성화. 지정된 턴 수를 초과한 오류 도구가 프루닝됨 (오류 메시지만 유지, 큰 입력 매개변수 제거).

### 5단계: 보호 메커니즘 설정

**왜 필요한가요**
중요한 콘텐츠(중요 파일, 핵심 도구 등)의 잘못된 프루닝을 방지합니다.

DCP는 세 가지 보호 메커니즘을 제공합니다:

#### 1. 턴 보호 (Turn Protection)

최근 몇 턴의 도구 출력을 보호하여 AI가 참조할 충분한 시간을 제공합니다.

```jsonc
{
    "turnProtection": {
        "enabled": false,   // 활성화 시 최근 4턴 보호
        "turns": 4          // 보호할 턴 수
    }
}
```

**적용 시나리오**: AI가 자주 컨텍스트를 잃어버릴 때 활성화하세요.

#### 2. 보호된 도구 (Protected Tools)

일부 도구는 기본적으로 절대 프루닝되지 않습니다:

```
task, todowrite, todoread, discard, extract, batch, write, edit, plan_enter, plan_exit
```

추가로 보호가 필요한 도구를 추가할 수 있습니다:

```jsonc
{
    "tools": {
        "settings": {
            "protectedTools": [
                "myCustomTool",   // 커스텀 도구 추가
                "databaseQuery"    // 보호가 필요한 도구 추가
            ]
        }
    },
    "strategies": {
        "deduplication": {
            "protectedTools": ["databaseQuery"]  // 특정 전략에 대해 도구 보호
        }
    }
}
```

#### 3. 보호된 파일 패턴 (Protected File Patterns)

glob 패턴을 사용하여 특정 파일을 보호합니다:

```jsonc
{
    "protectedFilePatterns": [
        "**/*.config.ts",           // 모든 .config.ts 파일 보호
        "**/secrets/**",           // secrets 디렉토리의 모든 파일 보호
        "**/*.env",                // 환경 변수 파일 보호
        "**/critical/*.json"        // critical 디렉토리의 JSON 파일 보호
    ]
}
```

::: warning 주의
protectedFilePatterns는 `tool.parameters.filePath`를 매칭하며, 파일의 실제 경로가 아닙니다. 이는 `filePath` 매개변수가 있는 도구(read, write, edit 등)에만 적용됩니다.

:::

### 6단계: 프로젝트 레벨 설정 생성

**왜 필요한가요**
프로젝트마다 다른 프루닝 전략이 필요할 수 있습니다.

프로젝트 루트 디렉토리에 `.opencode` 디렉토리를 생성하고(없는 경우), `dcp.jsonc`를 생성합니다:

```bash
# 프로젝트 루트 디렉토리에서 실행
mkdir -p .opencode
cat > .opencode/dcp.jsonc << 'EOF'
{
    "$schema": "https://raw.githubusercontent.com/Opencode-DCP/opencode-dynamic-context-pruning/master/dcp.schema.json",
    // 이 프로젝트의 특정 설정
    "strategies": {
        "supersedeWrites": {
            "enabled": true   // 이 프로젝트에서 쓰기 대체 전략 활성화
        }
    },
    "protectedFilePatterns": [
        "**/config/**/*.ts"   // 이 프로젝트의 설정 파일 보호
    ]
}
EOF
```

**예상 결과**:
- 프로젝트 레벨 설정이 전역 설정의 동일한 항목을 덮어씀
- 덮어쓰지 않은 항목은 전역 설정을 계속 사용

### 7단계: 디버그 로그 활성화

**왜 필요한가요**
문제 발생 시 상세한 디버그 로그를 확인합니다.

설정 파일 편집:

```jsonc
{
    "debug": true
}
```

**로그 위치**:
```
~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log
```

**예상 결과**: 로그 파일에 상세한 프루닝 작업, 설정 로딩 등의 정보가 포함됩니다.

::: info 프로덕션 환경 권장사항
디버깅 완료 후 `debug`를 `false`로 되돌려 로그 파일이 과도하게 커지는 것을 방지하세요.

:::

## 체크포인트 ✅

위 단계를 완료한 후 다음 내용을 확인하세요:

- [ ] 설정 파일의 세 가지 레벨과 우선순위 이해
- [ ] 알림 레벨 변경 및 효과 확인 가능
- [ ] 세 가지 자동 프루닝 전략의 역할 이해
- [ ] 보호 메커니즘 설정 가능 (턴, 도구, 파일)
- [ ] 프로젝트 레벨 설정으로 전역 설정 오버라이드 가능

## 주의사항

### 설정 변경이 적용되지 않음

**문제**: 설정 파일 변경 후 OpenCode가 반응하지 않음.

**원인**: OpenCode는 설정 파일을 자동으로 다시 로드하지 않습니다.

**해결**: 설정 변경 후 **OpenCode를 재시작**해야 합니다.

### 설정 파일 문법 오류

**문제**: 설정 파일에 문법 오류가 있어 DCP가 파싱할 수 없음.

**증상**: OpenCode가 "Invalid config" Toast 경고를 표시합니다.

**해결**: JSON 문법을 확인하세요, 특히:
- 따옴표, 쉼표, 괄호가 일치하는지
- 불필요한 쉼표가 있는지 (예: 마지막 요소 뒤의 쉼표)
- 불리언 값은 `true`/`false`를 사용하고 따옴표를 사용하지 않음

**권장 방법**: JSONC를 지원하는 에디터 사용 (예: VS Code + JSONC 플러그인).

### 보호된 도구가 작동하지 않음

**문제**: `protectedTools`를 추가했지만 도구가 여전히 프루닝됨.

**원인**:
1. 도구명 철자 오류
2. 잘못된 `protectedTools` 배열에 추가 (예: `tools.settings.protectedTools` vs `strategies.deduplication.protectedTools`)
3. 도구 호출이 턴 보호 기간 내에 있음 (턴 보호가 활성화된 경우)

**해결**:
1. 도구명 철자가 정확한지 확인
2. 올바른 위치에 추가했는지 확인
3. debug 로그를 확인하여 프루닝 이유 파악

## 이번 강의 요약

DCP 설정 시스템의 핵심 포인트:

- **3단계 설정**: 기본값 → 전역 → 환경 변수 → 프로젝트, 우선순위 증가
- **유연한 오버라이드**: 프로젝트 설정이 전역 설정을 덮어쓸 수 있음
- **보호 메커니즘**: 턴 보호, 보호된 도구, 보호된 파일 패턴으로 잘못된 프루닝 방지
- **자동 전략**: 중복 제거, 쓰기 대체, 오류 제거를 필요에 따라 켜고 끔
- **재시작 필요**: 설정 변경 후 OpenCode 재시작 필요

## 다음 강의 예고

> 다음 강의에서는 **[자동 프루닝 전략 상세 설명](../../platforms/auto-pruning/)**을 학습합니다.
>
> 배우게 될 내용:
> - 중복 제거 전략이 중복 도구 호출을 감지하는 방법
> - 쓰기 대체 전략의 작동 원리
> - 오류 제거 전략의 트리거 조건
> - 전략 효과 모니터링 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| 설정 관리 코어 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 1-798 |
| 설정 Schema | [`dcp.schema.json`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/dcp.schema.json) | 1-232 |
| 기본 설정 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L423-L464) | 423-464 |
| 설정 우선순위 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| 설정 검증 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-L375) | 147-375 |
| 설정 파일 경로 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L484-L526) | 484-526 |
| 기본 보호 도구 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-L79) | 68-79 |
| 전략 설정 병합 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L565-L595) | 565-595 |
| 도구 설정 병합 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L597-L622) | 597-622 |

**주요 상수**:
- `DEFAULT_PROTECTED_TOOLS`: 기본 보호 도구명 목록 (`lib/config.ts:68-79`)

**주요 함수**:
- `getConfig()`: 모든 레벨의 설정을 로드하고 병합 (`lib/config.ts:669-797`)
- `getInvalidConfigKeys()`: 설정 파일의 잘못된 키 검증 (`lib/config.ts:135-138`)
- `validateConfigTypes()`: 설정 값의 타입 검증 (`lib/config.ts:147-375`)
- `getConfigPaths()`: 모든 설정 파일의 경로 가져오기 (`lib/config.ts:484-526`)

</details>
