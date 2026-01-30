---
title: "토큰 최적화: 컨텍스트 창 | Everything Claude Code"
sidebarTitle: "컨텍스트 창이 포화되면 어떻게 해야 할까요"
subtitle: "토큰 최적화: 컨텍스트 창"
description: "Claude Code 토큰 최적화 전략을 학습하세요. 모델 선택, 전략적 압축, MCP 구성을 마스터하여 컨텍스트 창 효율을 극대화하고 응답 품질을 향상시키세요."
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# 토큰 최적화 전략: 컨텍스트 창 관리

## 학습 후 할 수 있는 것

- 작업 유형에 따라 적절한 모델을 선택하여 비용과 성능의 균형을 맞추세요
- 전략적 압축을 사용하여 논리적 경계에서 중요한 컨텍스트를 보존하세요
- MCP 서버를 합리적으로 구성하여 컨텍스트 창 과도 소비를 피하세요
- 컨텍스트 창 포화를 방지하고 응답 품질을 유지하세요

## 현재 겪고 있는 문제

다음 문제들을 겪어보셨나요?

- 대화 중간에 갑자기 컨텍스트가 압축되어 중요한 정보가 손실됨
- 너무 많은 MCP 서버를 활성화하여 컨텍스트 창이 200k에서 70k로 감으로
- 대규모 리팩토링 시 모델이 이전 논의를 "잊어버림"
- 언제 압축해야 하고 언제 하지 말아야 할지 모름

## 언제 이 방법을 사용해야 할까요

- **복잡한 작업을 처리해야 할 때** - 적절한 모델과 컨텍스트 관리 전략 선택
- **컨텍스트 창이 포화에 근접할 때** - 전략적 압축으로 중요한 정보 보존
- **MCP 서버를 구성할 때** - 도구 수와 컨텍스트 용량의 균형
- **장기 세션일 때** - 논리적 경계에서 압축하여 자동 압축으로 인한 정보 손실 방지

## 핵심 아이디어

토큰 최적화의 핵심은 "사용량을 줄이는 것"이 아니라 **중요한 순간에 가치 있는 정보를 보존하는 것**입니다.

### 세 가지 최적화 기둥

1. **모델 선택 전략** - 다른 작업에 다른 모델 사용, "총으로 참새 잡기" 방지
2. **전략적 압축** - 임의의 순간이 아닌 논리적 경계에서 압축
3. **MCP 구성 관리** - 활성화된 도구 수를 제어하여 컨텍스트 창 보초

### 핵심 개념

::: info 컨텍스트 창이란 무엇인가요?

컨텍스트 창은 Claude Code가 "기억할 수 있는" 대화 기록 길이입니다. 현재 모델은 약 200k 토큰을 지원하지만 다음 요인의 영향을 받습니다:

- **활성화된 MCP 서버** - 각 MCP는 시스템 프롬프트 공간을 소비
- **로드된 Skills** - 스킬 정의가 컨텍스트를 점유
- **대화 기록** - Claude와의 대화 기록

컨텍스트가 포화에 근접하면 Claude는 자동으로 기록을 압축하여 중요한 정보가 손실될 수 있습니다.
:::

::: tip 왜 수동 압축이 더 나을까요?

Claude의 자동 압축은 임의의 순간에 트리거되어 종종 작업 중간에 흐름을 끊습니다. 전략적 압축은 **논리적 경계**(계획 완료 후, 작업 전환 전)에서 능동적으로 압축하여 중요한 컨텍스트를 보존할 수 있습니다.
:::

## 따라해 보세요

### 1단계: 적절한 모델 선택

작업 복잡도에 따라 모델을 선택하여 비용과 컨텍스트 낭비를 피하세요.

**이유**

다른 모델의 추론 능력과 비용 차이가 크므로 합리적인 선택으로 대량의 토큰을 절약할 수 있습니다.

**모델 선택 가이드**

| 모델 | 적용 시나리오 | 비용 | 추론 능력 |
|--- | --- | --- | ---|
| **Haiku 4.5** | 가벼운 에이전트, 빈번한 호출, 코드 생성 | 낮음(Sonnet의 1/3) | Sonnet 능력의 90% |
| **Sonnet 4.5** | 메인 개발 작업, 복잡한 코딩 작업, 오케스트레이션 | 중간 | 최고 코딩 모델 |
| **Opus 4.5** | 아키텍처 결정, 깊은 추론, 연구 분석 | 높음 | 최강 추론 능력 |

**구성 방법**

`agents/` 디렉터리의 에이전트 파일에서 설정:

```markdown
---
name: planner
description: 복잡한 기능 구현 단계 계획
model: opus
---

당신은 고급 플래너입니다...
```

**확인해야 할 것**:
- 고추론 작업(아키텍처 설계 등)은 Opus 사용으로 품질 향상
- 코딩 작업은 Sonnet 사용으로 가성비 최적
- 빈번히 호출되는 워커 에이전트는 Haiku 사용으로 비용 절감

### 2단계: 전략적 압축 Hook 활성화

Hook을 구성하여 논리적 경계에서 컨텍스트 압축을 알리세요.

**이유**

자동 압축은 임의의 순간에 트리거되어 중요한 정보가 손실될 수 있습니다. 전략적 압축은 압축 시기를 결정할 수 있습니다.

**구성 단계**

`hooks/hooks.json`에 PreToolUse와 PreCompact 구성이 있는지 확인:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**사용자 정의 임계값**

환경 변수 `COMPACT_THRESHOLD`로 제안 빈도 제어(기본값 50회 도구 호출):

```json
// ~/.claude/settings.json에 추가
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // 50회 도구 호출 후 첫 번째 제안
  }
}
```

**확인해야 할 것**:
- 파일 편집 또는 쓰기 후마다 Hook이 도구 호출 횟수 통계
- 임계값 도달(기본값 50회) 후 프롬프트 표시:
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- 이후 25회 도구 호출마다 프롬프트 표시:
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### 3단계: 논리적 경계에서 압축

Hook의 프롬프트에 따라 적절한 시기에 수동으로 압축하세요.

**이유**

작업 전환 또한 마일스톤 완료 후 압축하면 중요한 컨텍스트를 보존하고 중복 정보를 제거할 수 있습니다.

**압축 시기 가이드**

✅ **압축을 권장하는 시기**:
- 계획 완료 후, 구현 시작 전
- 기능 마일스톤 완료 후, 다음 작업 시작 전
- 디버깅 완료 후, 개발 계속 전
- 다른 작업 유형으로 전환할 때

❌ **압축을 피해야 할 시기**:
- 기능 구현 중
- 디버깅 중
- 여러 관련 파일 수정 중

**작업 단계**

Hook 프롬프트 표시 후:

1. 현재 작업 단계 평가
2. 압축이 적절하면 실행:
    ```bash
    /compact
    ```
3. Claude가 컨텍스트 요약할 때까지 대기
4. 중요한 정보가 보존되었는지 확인

**확인해야 할 것**:
- 압축 후 컨텍스트 창에서 대량 공간 확보
- 중요한 정보(구현 계획, 완료된 기능 등)가 보존됨
- 새로운 상호작용이 간결한 컨텍스트로 시작

### 4단계: MCP 구성 최적화

활성화된 MCP 서버 수를 제어하여 컨텍스트 창을 보호하세요.

**이유**

각 MCP 서버는 시스템 프롬프트 공간을 소비합니다. 너무 많이 활성화하면 컨텍스트 창이 크게 압축됩니다.

**구성 원칙**

README의 경험에 따라:

```json
{
  "mcpServers": {
    // 20-30개 MCP를 구성할 수 있습니다...
    "github": { ... },
    "supabase": { ... },
    // ...더 많은 구성
  },
  "disabledMcpServers": [
    "firecrawl",       // 자주 사용하지 않는 MCP 비활성화
    "clickhouse",
    // ...프로젝트 요구에 따라 비활성화
  ]
}
```

**모범 사례**:

- **모든 MCP 구성**(20-30개), 프로젝트에서 유연하게 전환
- **< 10개 MCP 활성화**, 활성 도구 < 80개 유지
- **프로젝트에 따라 선택**: 백엔드 개발 시 데이터베이스 관련 활성화, 프론트엔드 시 빌드 관련 활성화

**검증 방법**

도구 수 확인:

```bash
// Claude Code가 현재 활성화된 도구 표시
/tool list
```

**확인해야 할 것**:
- 도구 총수 < 80개
- 컨텍스트 창이 180k+ 유지(70k 미만으로 떨어지는 것 방지)
- 프로젝트 요구에 따라 활성화 목록 동적 조정

### 5단계: Memory Persistence와 결합

Hooks를 사용하여 압축 후에도 중요한 상태를 보존하세요.

**이유**

전략적 압축은 컨텍스트를 손실하지만 중요한 상태(구현 계획, 체크포인트 등)는 보존되어야 합니다.

**Hooks 구성**

다음 Hook이 활성화되어 있는지 확인:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**작업 흐름**:

1. 작업 완료 후 `/checkpoint`로 상태 저장
2. 컨텍스트 압축 전 PreCompact Hook이 자동 저장
3. 새 세션 시작 시 SessionStart Hook이 자동 로드
4. 중요한 정보(계획, 상태)가 영구화되어 압축 영향 없음

**확인해야 할 것**:
- 압축 후 중요한 상태 여전히 사용 가능
- 새 세션이 이전 컨텍스트 자동 복구
- 중요한 결정과 구현 계획이 손실되지 않음

## 체크포인트 ✅

- [ ] `strategic-compact` Hook 구성 완료
- [ ] 작업에 따라 적절한 모델 선택(Haiku/Sonnet/Opus)
- [ ] 활성화된 MCP < 10개, 도구 총수 < 80개
- [ ] 논리적 경계(계획 완료/마일스톤)에서 압축
- [ ] Memory Persistence Hooks 활성화, 중요한 상태 보존 가능

## 함정 경고

### ❌ 일반적인 오류 1: 모든 작업에 Opus 사용

**문제**: Opus는 가장 강력하지만 비용은 Sonnet의 10배, Haiku의 30배입니다.

**수정**: 작업 유형에 따라 모델 선택:
- 빈번히 호출되는 에이전트(코드 검토, 포맷팅 등)는 Haiku 사용
- 메인 개발 작업은 Sonnet 사용
- 아키텍처 결정, 깊은 추론은 Opus 사용

### ❌ 일반적인 오류 2: Hook 압축 프롬프트 무시

**문제**: `[StrategicCompact]` 프롬프트 표시 후 계속 작업하여 컨텍스트가 결국 자동 압축되고 중요한 정보가 손실됨.

**수정**: 작업 단계를 평가하고 적절한 시기에 프롬프트에 응답하여 `/compact` 실행.

### ❌ 일반적인 오류 3: 모든 MCP 서버 활성화

**문제**: 20+개 MCP를 구성하고 모두 활성화하여 컨텍스트 창이 200k에서 70k로 감소.

**수정**: `disabledMcpServers`를 사용하여 자주 사용하지 않는 MCP 비활성화, < 10개 활성 MCP 유지.

### ❌ 일반적인 오류 4: 구현 중 압축

**문제**: 기능 구현 중인 컨텍스트를 압축하여 모델이 이전 논의를 "잊어버림".

**수정**: 논리적 경계(계획 완료, 작업 전환, 마일스톤 완료)에서만 압축.

## 이 수업 요약

토큰 최적화의 핵심은 **중요한 순간에 가치 있는 정보를 보존하는 것**입니다:

1. **모델 선택** - Haiku/Sonnet/Opus 각각 적용 시나리오가 있으며 합리적 선택으로 비용 절감
2. **전략적 압축** - 논리적 경계에서 수동 압축으로 자동 압축으로 인한 정보 손실 방지
3. **MCP 관리** - 활성화 수 제어로 컨텍스트 창 보호
4. **Memory Persistence** - 압축 후에도 중요한 상태 사용 가능

이 전략을 따르면 Claude Code의 컨텍스트 효율을 극대화하고 컨텍스트 포화로 인한 품질 저하를 방지할 수 있습니다.

## 다음 수업 예고

> 다음 수업에서는 **[검증 루프: Checkpoint와 Evals](../verification-loop/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - Checkpoint를 사용하여 작업 상태를 저장하고 복구하는 방법
> - 지속적 검증의 Eval Harness 방법
> - Grader 유형과 Pass@K 지표
> - TDD에서의 검증 루프 적용

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 행号 |
|--- | --- | ---|
| 전략적 압축 Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| 압축 제안 Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| 압축 전 저장 Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| 성능 최적화 규칙 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Hooks 구성 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| 컨텍스트 창 설명 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**핵심 상수**:
- `COMPACT_THRESHOLD = 50`: 도구 호출 임계값(기본값)
- `MCP_LIMIT = 10`: 권장 활성화 MCP 수 상한
- `TOOL_LIMIT = 80`: 권장 도구 총수 상한

**핵심 함수**:
- `suggest-compact.js:main()`: 도구 호출 횟수 통계 및 압축 제안
- `pre-compact.js:main()`: 압축 전 세션 상태 저장

</details>
