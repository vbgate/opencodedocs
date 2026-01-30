---
title: "FAQ: 일반적인 문제 해결 | opencode-dcp"
sidebarTitle: "문제가 발생했을 때"
subtitle: "일반적인 문제 및 오류 해결"
description: "OpenCode DCP 사용 중 발생하는 일반적인 문제를 해결하는 방법을 배우세요. 구성 오류 수정, 디버깅 방법 활성화, 토큰이 감소하지 않는 원인 등의 문제 해결 기술을 다룹니다."
tags:
  - "FAQ"
  - "troubleshooting"
  - "구성"
  - "디버깅"
prerequisite:
  - "start-getting-started"
order: 1
---

# 일반적인 문제 및 오류 해결

## 구성 관련 문제

### 내 구성이 적용되지 않는 이유는 무엇인가요?

DCP 구성 파일은 우선순위에 따라 병합됩니다: **기본값 < 전역 < 환경 변수 < 프로젝트**. 프로젝트 수준 구성의 우선순위가 가장 높습니다.

**확인 단계**:

1. **구성 파일 위치 확인**:
   ```bash
   # macOS/Linux
   ls -la ~/.config/opencode/dcp.jsonc
   ls -la ~/.config/opencode/dcp.json

   # 또는 프로젝트 루트 디렉토리
   ls -la .opencode/dcp.jsonc
   ```

2. **적용된 구성 확인**:
   디버그 모드를 활성화하면 DCP가 처음 구성을 로드할 때 구성 정보를 로그 파일에 출력합니다.

3. **OpenCode 다시 시작**:
   구성을 수정한 후에는 OpenCode를 다시 시작해야 적용됩니다.

::: tip 구성 우선순위
여러 구성 파일이 동시에 존재하는 경우, 프로젝트 수준 구성(`.opencode/dcp.jsonc`)이 전역 구성을 재정의합니다.
:::

### 구성 파일 오류가 발생하면 어떻게 하나요?

DCP는 구성 오류를 감지하면 Toast 경고를 표시하고(7초 후 표시), 기본값을 사용하도록 강등합니다.

**일반적인 오류 유형**:

| 오류 유형 | 문제 설명 | 해결 방법 |
|--- | --- | ---|
| 유형 오류 | `pruneNotification`는 `"off" | "minimal" | "detailed"`여야 함 | 열거형 값 철자 확인 |
| 배열 오류 | `protectedFilePatterns`는 문자열 배열이어야 함 | `["pattern1", "pattern2"]` 형식 사용 확인 |
| 알 수 없는 키 | 구성 파일에 지원되지 않는 키 포함 | 알 수 없는 키 삭제 또는 주석 처리 |

**자세한 오류를 보려면 디버그 로그 활성화**:

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true  // 디버그 로그 활성화
}
```

로그 파일 위치: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`

---

## 기능 관련 문제

### 토큰 사용량이 감소하지 않는 이유는 무엇인가요?

DCP는 **도구 호출** 콘텐츠만修剪합니다. 대화에서 도구를 사용하지 않거나 모두 보호된 도구를 사용하는 경우 토큰이 감소하지 않습니다.

**가능한 원인**:

1. **보호된 도구**
   기본적으로 보호된 도구: `task`, `write`, `edit`, `batch`, `discard`, `extract`, `todowrite`, `todoread`, `plan_enter`, `plan_exit`

2. **턴 보호가 만료되지 않음**
   `turnProtection`을 활성화한 경우, 도구는 보호 기간 동안修剪되지 않습니다.

3. **대화에 중복 또는修剪 가능한 콘텐츠가 없음**
   DCP의 자동 전략은 다음에만 적용됩니다:
   - 중복 도구 호출(중복 제거)
   - 이미 읽기로 덮어쓴 쓰기 작업(덮어쓰기)
   - 만료된 잘못된 도구 입력(오류 정리)

**확인 방법**:

```bash
# OpenCode에서 입력
/dcp context
```

출력에서 `Pruned` 필드를 확인하여修剪된 도구 수와 절약된 토큰을 확인합니다.

::: info 수동修剪
자동 전략이 트리거되지 않은 경우 `/dcp sweep`을 사용하여 도구를 수동으로修剪할 수 있습니다.
:::

### 하위 에이전트 세션이修剪되지 않는 이유는 무엇인가요?

**이것은 예상된 동작입니다**. DCP는 하위 에이전트 세션에서 완전히 비활성화됩니다.

**이유**: 하위 에이전트의 설계 목표는 토큰 사용을 최적화하는 것이 아니라 간결한 발견 요약을 반환하는 것입니다. DCP의修剪은 하위 에이전트의 요약 동작을 방해할 수 있습니다.

**하위 에이전트 세션인지 판단하는 방법**:
- 세션 메타데이터의 `parentID` 필드 확인
- 디버그 로그를 활성화하면 `isSubAgent: true` 표시가 표시됨

---

## 디버깅 및 로그

### 디버그 로그를 활성화하는 방법은 무엇인가요?

```jsonc
// ~/.config/opencode/dcp.jsonc
{
    "debug": true
}
```

**로그 파일 위치**:
- **일일 로그**: `~/.config/opencode/logs/dcp/daily/YYYY-MM-DD.log`
- **컨텍스트 스냅샷**: `~/.config/opencode/logs/dcp/context/{sessionId}/{timestamp}.json`

::: warning 성능 영향
디버그 로그는 디스크 파일에 쓰기 때문에 성능에 영향을 줄 수 있습니다. 프로덕션 환경에서는 비활성화하는 것을 권장합니다.
:::

### 현재 세션의 토큰 분포를 보는 방법은 무엇인가요?

```bash
# OpenCode에서 입력
/dcp context
```

**출력 예시**:

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

### 누적修剪 통계를 보는 방법은 무엇인가요?

```bash
# OpenCode에서 입력
/dcp stats
```

이 명령은 모든 기록 세션의 누적修剪 토큰 수를 표시합니다.

---

## Prompt Caching 관련

### DCP가 Prompt Caching에 영향을 미치나요?

**영향을 받지만**, 전반적으로는 긍정적인 이득입니다.

LLM 제공업체(Anthropic, OpenAI 등)는 **정확한 접두사 일치**를 기반으로 prompt를 캐싱합니다. DCP가 도구 출력을修剪하면 메시지 내용이 변경되고, 해당 지점부터 캐싱이 무효화됩니다.

**실제 테스트 결과**:
- DCP 없음: 캐시 적중률 약 85%
- DCP 활성화: 캐시 적중률 약 65%

**하지만 토큰 절약은 일반적으로 캐싱 손실을 상회합니다**, 특히 긴 대화에서 더욱 그렇습니다.

**최적 사용 시나리오**:
- 요청당 과금 서비스(GitHub Copilot, Google Antigravity 등)를 사용하는 경우, 캐싱 손실은 부정적인 영향이 없음

---

## 고급 구성

### 특정 파일이修剪되지 않도록 보호하는 방법은 무엇인가요?

`protectedFilePatterns`를 사용하여 glob 패턴을 구성하세요:

```jsonc
{
    "protectedFilePatterns": [
        "src/config/*",     // config 디렉토리 보호
        "*.env",           // 모든 .env 파일 보호
        "**/secrets/**"    // secrets 디렉토리 보호
    ]
}
```

패턴은 도구 매개변수의 `filePath` 필드(`read`, `write`, `edit` 도구 등)와 일치합니다.

### 보호된 도구를 사용자 정의하는 방법은 무엇인가요?

각 전략과 도구 구성에는 `protectedTools` 배열이 있습니다:

```jsonc
{
    "strategies": {
        "deduplication": {
            "enabled": true,
            "protectedTools": ["custom_tool"]  // 추가로 보호할 도구
        }
    },
    "tools": {
        "settings": {
            "protectedTools": ["another_tool"]
        }
    },
    "commands": {
        "protectedTools": ["sweep_protected"]
    }
}
```

이러한 구성은 기본 보호된 도구 목록에 **누적**됩니다.

---

## 일반적인 오류 시나리오

### 오류: DCP가 로드되지 않음

**가능한 원인**:
1. `opencode.jsonc`에서 플러그인이 등록되지 않음
2. 플러그인 설치 실패
3. OpenCode 버전 호환성 문제

**해결 방법**:
1. `opencode.jsonc`에 `"plugin": ["@tarquinen/opencode-dcp@latest"]`가 포함되어 있는지 확인
2. OpenCode 다시 시작
3. 로그 파일을 확인하여 로드 상태 확인

### 오류: 구성 파일이 유효하지 않은 JSON

**가능한 원인**:
- 쉼표 누락
- 불필요한 쉼표
- 문자열이 큰따옴표로 묶이지 않음
- JSONC 주석 형식 오류

**해결 방법**:
JSONC를 지원하는 편집기(VS Code 등)를 사용하여 편집하거나, 온라인 JSON 유효성 검사 도구를 사용하여 구문을 확인하세요.

### 오류: /dcp 명령이 응답하지 않음

**가능한 원인**:
- `commands.enabled`가 `false`로 설정됨
- 플러그인이 올바르게 로드되지 않음

**해결 방법**:
1. 구성 파일에서 `"commands.enabled"`가 `true`인지 확인
2. 플러그인이 로드되었는지 확인(로그 확인)

---

## 도움말

위의 방법으로 문제가 해결되지 않는 경우:

1. **디�버그 로그를 활성화**하고 문제를 재현
2. **컨텍스트 스냅샷 확인**: `~/.config/opencode/logs/dcp/context/{sessionId}/`
3. **GitHub에 Issue 제출**:
   - 로그 파일 첨부(민감 정보 삭제)
   - 재현 단계 설명
   - 예상 동작과 실제 동작 설명

---

## 다음 레슨 예고

> 다음 레슨에서는 **[DCP 모범 사례](../best-practices/)**를 학습합니다.
>
> 배우게 될 내용:
> - Prompt Caching과 토큰 절약 간의 트레이드오프 관계
> - 구성 우선순위 규칙 및 사용 전략
> - 보호 메커니즘의 선택 및 구성
> - 명령 사용 팁 및 최적화 제안

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 확인을 위해 클릭하여 펼치기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능        | 파일 경로                                                                                      | 행 번호        |
|--- | --- | ---|
| 구성 유효성 검사     | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L147-375)  | 147-375    |
| 구성 오류 처리 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L391-421)  | 391-421    |
| 로그 시스템     | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L6-109)      | 6-109      |
| 컨텍스트 스냅샷   | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts#L196-210)    | 196-210    |
| 하위 에이전트 감지   | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts#L1-8)      | 1-8        |
| 보호된 도구   | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L68-79)   | 68-79      |

**핵심 함수**:
- `validateConfigTypes()`: 구성 항목 유형 유효성 검사
- `getInvalidConfigKeys()`: 구성 파일의 알 수 없는 키 감지
- `Logger.saveContext()`: 디버깅을 위한 컨텍스트 스냅샷 저장
- `isSubAgentSession()`: 하위 에이전트 세션 감지

</details>
