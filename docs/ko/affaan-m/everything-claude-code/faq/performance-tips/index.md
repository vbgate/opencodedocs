---
title: "성능 최적화: 모델과 컨텍스트 | Everything Claude Code"
sidebarTitle: "응답 속도 10배 향상 비결"
subtitle: "성능 최적화: 응답 속도 향상하기"
description: "Everything Claude Code의 성능 최적화 전략을 학습합니다. 모델 선택, 컨텍스트 윈도우 관리, MCP 설정, 전략적 압축을 마스터하여 응답 속도와 개발 효율성을 높이세요."
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "start-quick-start"
order: 180
---

# 성능 최적화: 응답 속도 향상하기

## 이 강의를 마치면

- 작업 복잡도에 따라 적절한 모델을 선택하여 비용과 성능의 균형을 맞출 수 있습니다
- 컨텍스트 윈도우를 효과적으로 관리하여 한계에 도달하는 것을 방지할 수 있습니다
- MCP 서버를 합리적으로 설정하여 사용 가능한 컨텍스트를 최대화할 수 있습니다
- 전략적 압축을 사용하여 대화 논리의 일관성을 유지할 수 있습니다

## 현재 겪고 있는 문제

Claude Code 응답이 느려졌나요? 컨텍스트 윈도우가 금방 가득 차나요? Haiku, Sonnet, Opus 중 언제 어떤 것을 사용해야 할지 모르겠나요? 이러한 문제들은 개발 효율성에 심각한 영향을 미칩니다.

## 핵심 개념

성능 최적화의 핵심은 **적절한 시점에 적절한 도구를 사용하는 것**입니다. 모델 선택, 컨텍스트 관리, MCP 설정 모두 속도 vs 지능, 비용 vs 품질 사이의 균형을 맞추는 작업입니다.

::: info 주요 개념

**컨텍스트 윈도우**는 Claude가 "기억"할 수 있는 대화 기록의 길이입니다. 현재 모델은 약 200k 토큰을 지원하지만, MCP 서버 수, 도구 호출 횟수 등의 요인에 따라 영향을 받습니다.

:::

## 일반적인 성능 문제

### 문제 1: 응답 속도 저하

**증상**: 간단한 작업도 오래 기다려야 함

**가능한 원인**:
- 간단한 작업에 Opus 사용
- 컨텍스트가 너무 길어 대량의 기록 정보 처리 필요
- 너무 많은 MCP 서버 활성화

**해결 방법**:
- 가벼운 작업에는 Haiku 사용
- 정기적으로 컨텍스트 압축
- 활성화된 MCP 수 줄이기

### 문제 2: 컨텍스트 윈도우가 빠르게 가득 참

**증상**: 개발 중 얼마 지나지 않아 압축하거나 세션을 재시작해야 함

**가능한 원인**:
- 너무 많은 MCP 서버 활성화 (각 MCP가 컨텍스트를 차지함)
- 대화 기록을 제때 압축하지 않음
- 복잡한 도구 호출 체인 사용

**해결 방법**:
- 필요에 따라 MCP 활성화, `disabledMcpServers`로 사용하지 않는 것 비활성화
- 전략적 압축 사용, 작업 경계에서 수동 압축
- 불필요한 파일 읽기 및 검색 피하기

### 문제 3: 토큰 소비가 빠름

**증상**: 할당량이 빠르게 소진되고 비용이 높음

**가능한 원인**:
- 항상 Opus로 작업 처리
- 대량의 파일을 반복적으로 읽음
- 압축을 합리적으로 사용하지 않음

**해결 방법**:
- 작업 복잡도에 따라 모델 선택
- `/compact`로 능동적으로 압축
- strategic-compact hooks로 스마트 알림 사용

## 모델 선택 전략

작업 복잡도에 따라 적절한 모델을 선택하면 성능을 크게 향상시키고 비용을 절감할 수 있습니다.

### Haiku 4.5 (Sonnet 능력의 90%, 비용 3배 절감)

**적용 시나리오**:
- 경량 Agent, 빈번한 호출
- 페어 프로그래밍 및 코드 생성
- 멀티 Agent 시스템의 Worker agents

**예시**:
```markdown
간단한 코드 수정, 포맷팅, 주석 생성
Haiku 사용
```

### Sonnet 4.5 (최고의 코딩 모델)

**적용 시나리오**:
- 주요 개발 작업
- 멀티 Agent 워크플로우 조율
- 복잡한 코딩 작업

**예시**:
```markdown
새 기능 구현, 리팩토링, 복잡한 버그 수정
Sonnet 사용
```

### Opus 4.5 (최강의 추론 능력)

**적용 시나리오**:
- 복잡한 아키텍처 결정
- 최대 추론 깊이가 필요한 작업
- 연구 및 분석 작업

**예시**:
```markdown
시스템 설계, 보안 감사, 복잡한 문제 해결
Opus 사용
```

::: tip 모델 선택 팁

agent 설정에서 `model` 필드로 지정:
```markdown
---
name: my-agent
model: haiku  # 또는 sonnet, opus
---
```

:::

## 컨텍스트 윈도우 관리

컨텍스트 윈도우를 과도하게 사용하면 성능에 영향을 미치고 작업 실패로 이어질 수 있습니다.

### 컨텍스트 윈도우 후반 20%에서 피해야 할 작업

이러한 작업은 먼저 컨텍스트를 압축하는 것이 좋습니다:
- 대규모 리팩토링
- 여러 파일에 걸친 기능 구현
- 복잡한 상호작용 디버깅

### 컨텍스트 민감도가 낮은 작업

이러한 작업은 컨텍스트 요구가 높지 않아 한계에 가까워도 계속할 수 있습니다:
- 단일 파일 편집
- 독립적인 도구 생성
- 문서 업데이트
- 간단한 버그 수정

::: warning 중요 알림

컨텍스트 윈도우는 다음 요인의 영향을 받습니다:
- 활성화된 MCP 서버 수
- 도구 호출 횟수
- 대화 기록 길이
- 현재 세션의 파일 작업

:::

## MCP 설정 최적화

MCP 서버는 Claude Code 기능을 확장하는 중요한 방법이지만, 각 MCP는 컨텍스트를 차지합니다.

### 기본 원칙

README의 권장 사항에 따르면:

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... 추가 설정
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // 사용하지 않는 MCP 비활성화
  ]
}
```

**모범 사례**:
- 20-30개의 MCP 서버 설정 가능
- 프로젝트당 10개 이하 활성화
- 활성 도구 수를 80개 미만으로 유지

### 필요에 따라 MCP 활성화

프로젝트 유형에 따라 관련 MCP 선택:

| 프로젝트 유형 | 권장 활성화 | 선택 사항 |
| --- | --- | --- |
| 프론트엔드 프로젝트 | Vercel, Magic | Filesystem, GitHub |
| 백엔드 프로젝트 | Supabase, ClickHouse | GitHub, Railway |
| 풀스택 프로젝트 | 전체 | - |
| 도구 라이브러리 | GitHub | Filesystem |

::: tip MCP 전환 방법

프로젝트 설정(`~/.claude/settings.json`)에서 `disabledMcpServers` 사용:
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## 전략적 압축

자동 압축은 임의의 시점에 트리거되어 작업 논리를 중단시킬 수 있습니다. 전략적 압축은 작업 경계에서 수동으로 실행하여 논리적 일관성을 유지합니다.

### 전략적 압축이 필요한 이유

**자동 압축의 문제점**:
- 작업 중간에 트리거되어 중요한 컨텍스트 손실
- 작업 논리 경계를 이해하지 못함
- 복잡한 다단계 작업을 중단시킬 수 있음

**전략적 압축의 장점**:
- 작업 경계에서 압축하여 핵심 정보 보존
- 논리가 더 명확함
- 중요한 프로세스 중단 방지

### 최적의 압축 시점

1. **탐색 완료 후, 실행 전** - 연구 컨텍스트를 압축하고 구현 계획 보존
2. **마일스톤 완료 후** - 다음 단계를 위해 새로 시작
3. **작업 전환 전** - 탐색 컨텍스트를 정리하고 새 작업 준비

### Strategic Compact Hook

이 플러그인에는 `strategic-compact` skill이 포함되어 있어 압축해야 할 시점을 자동으로 알려줍니다.

**Hook 작동 원리**:
- 도구 호출 횟수 추적
- 임계값 도달 시 알림 (기본값 50회 호출)
- 이후 25회 호출마다 알림

**임계값 설정**:
```bash
# 환경 변수 설정
export COMPACT_THRESHOLD=40
```

**Hook 설정** (`hooks/hooks.json`에 포함됨):
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### 사용 팁

1. **계획 후 압축** - 계획이 확정되면 압축하고 새로 시작
2. **디버깅 후 압축** - 오류 해결 컨텍스트를 정리하고 다음 단계 진행
3. **구현 중에는 압축하지 않기** - 관련 변경 사항의 컨텍스트 유지
4. **알림에 주의** - Hook이 "언제"를 알려주고, 당신이 "압축 여부"를 결정

::: tip 현재 상태 확인

`/checkpoint` 명령을 사용하여 현재 상태를 저장한 후 세션을 압축할 수 있습니다.

:::

## 성능 체크리스트

일상적인 사용에서 다음 항목을 정기적으로 확인하세요:

### 모델 사용
- [ ] 간단한 작업에 Sonnet/Opus 대신 Haiku 사용
- [ ] 복잡한 추론에 Sonnet 대신 Opus 사용
- [ ] Agent 설정에 적절한 model 지정

### 컨텍스트 관리
- [ ] 활성화된 MCP가 10개 이하
- [ ] 정기적으로 `/compact`로 압축
- [ ] 작업 중간이 아닌 작업 경계에서 압축

### MCP 설정
- [ ] 프로젝트에 필요한 MCP만 활성화
- [ ] `disabledMcpServers`로 사용하지 않는 MCP 관리
- [ ] 활성 도구 수 정기 확인 (권장 < 80)

## 자주 묻는 질문

### Q: Haiku, Sonnet, Opus를 언제 사용해야 하나요?

**A**: 작업 복잡도에 따라:
- **Haiku**: 가벼운 작업, 빈번한 호출 (예: 코드 포맷팅, 주석 생성)
- **Sonnet**: 주요 개발 작업, Agent 조율 (예: 기능 구현, 리팩토링)
- **Opus**: 복잡한 추론, 아키텍처 결정 (예: 시스템 설계, 보안 감사)

### Q: 컨텍스트 윈도우가 가득 차면 어떻게 하나요?

**A**: 즉시 `/compact`로 세션을 압축하세요. strategic-compact hook을 활성화했다면 적절한 시점에 알려줍니다. 압축 전에 `/checkpoint`로 중요한 상태를 저장할 수 있습니다.

### Q: 활성화된 MCP 수를 어떻게 확인하나요?

**A**: `~/.claude/settings.json`의 `mcpServers`와 `disabledMcpServers` 설정을 확인하세요. 활성 MCP 수 = 총 수 - `disabledMcpServers`의 수.

### Q: 응답이 특히 느린 이유는 무엇인가요?

**A**: 다음 사항을 확인하세요:
1. 간단한 작업에 Opus를 사용하고 있나요?
2. 컨텍스트 윈도우가 거의 가득 찼나요?
3. 너무 많은 MCP 서버를 활성화했나요?
4. 대규모 파일 작업을 실행 중인가요?

## 이 강의 요약

성능 최적화의 핵심은 "적절한 시점에 적절한 도구를 사용하는 것"입니다:

- **모델 선택**: 작업 복잡도에 따라 Haiku/Sonnet/Opus 선택
- **컨텍스트 관리**: 윈도우 후반 20% 피하기, 적시에 압축
- **MCP 설정**: 필요에 따라 활성화, 10개 이하
- **전략적 압축**: 작업 경계에서 수동 압축, 논리적 일관성 유지

## 관련 강의

- [토큰 최적화 전략](../../advanced/token-optimization/) - 컨텍스트 윈도우 관리 심화 학습
- [Hooks 자동화](../../advanced/hooks-automation/) - strategic-compact hook 설정 이해
- [MCP 서버 설정](../../start/mcp-setup/) - MCP 서버 설정 방법 학습

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-25

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| 성능 최적화 규칙 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| 전략적 압축 Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Hooks 설정 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Strategic Compact Hook | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Suggest Compact 스크립트 | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| MCP 설정 예시 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**핵심 규칙**:
- **모델 선택**: Haiku(가벼운 작업), Sonnet(주요 개발), Opus(복잡한 추론)
- **컨텍스트 윈도우**: 후반 20% 사용 피하기, 적시에 압축
- **MCP 설정**: 프로젝트당 10개 이하 활성화, 활성 도구 < 80개
- **전략적 압축**: 작업 경계에서 수동 압축, 자동 압축 중단 방지

**핵심 환경 변수**:
- `COMPACT_THRESHOLD`: 도구 호출 횟수 임계값 (기본값: 50)

</details>
