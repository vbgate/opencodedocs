---
title: "빠른 시작: 설치 및 설정 | opencode-dynamic-context-pruning"
sidebarTitle: "5분 완성"
subtitle: "빠른 시작: 설치 및 설정"
description: "OpenCode DCP 플러그인의 설치 및 설정 방법을 학습합니다. 5분 안에 플러그인 설치를 완료하고 Token 절약 효과를 경험하며 3단계 설정 시스템을 마스터합니다."
order: 1
---

# 빠른 시작

본 장은 처음부터 DCP 플러그인을 사용할 수 있도록 도와줍니다. 플러그인 설치, 효과 확인, 요구에 맞는 사용자 정의 설정을 학습하게 됩니다.

## 본 장 내용

<div class="vp-card-container">

<a href="./getting-started/" class="vp-card">
  <h3>설치 및 빠른 시작</h3>
  <p>5분 안에 DCP 플러그인 설치를 완료하고 Token 절약 효과를 즉시 확인합니다. /dcp 명령을 사용하여 자르기 통계를 모니터링하는 방법을 학습합니다.</p>
</a>

<a href="./configuration/" class="vp-card">
  <h3>설정 상세</h3>
  <p>3단계 설정 시스템(전역, 환경 변수, 프로젝트 레벨)을 마스터하고 설정 우선순위를 이해하며 필요에 따라 자르기 전략과 보호 메커니즘을 조정합니다.</p>
</a>

</div>

## 학습 경로

```
설치 및 빠른 시작 → 설정 상세
      ↓              ↓
   플러그인 사용 가능   조정 방법 습득
```

**권장 순서**：

1. **먼저 [설치 및 빠른 시작](./getting-started/) 완료**: 플러그인이 정상적으로 작동하는지 확인하고 기본 자르기 효과를 경험
2. **그 다음 [설정 상세](./configuration/) 학습**: 프로젝트 요구에 맞게 자르기 전략 사용자 정의

::: tip 초보자 제안
DCP를 처음 사용하는 경우, 먼저 기본 설정으로一段时间 동안 실행하여 자르기 효과를 관찰한 후 설정을 조정하는 것을 권장합니다.
:::

## 전제 조건

본 장 학습을 시작하기 전에 다음을 확인하세요:

- [x] **OpenCode**가 설치됨 (플러그인 기능을 지원하는 버전)
- [x] 기본적인 **JSONC 문법** 이해 (주석을 지원하는 JSON)
- [x] **OpenCode 구성 파일**을 편집하는 방법을 알고 있음

## 다음 단계

본 장을 완료한 후 다음 학습을 계속할 수 있습니다:

- **[자동 자르기 전략 상세](../platforms/auto-pruning/)**: 중복 제거, 덮어쓰기, 오류 제거 세 가지 전략의 작동 원리를 깊이 이해
- **[LLM 기반 자르기 도구](../platforms/llm-tools/)**: AI가 어떻게 능동적으로 discard 및 extract 도구를 호출하여 컨텍스트를 최적화하는지 학습
- **[슬래시 명령 사용](../platforms/commands/)**: /dcp context, /dcp stats, /dcp sweep 등 명령의 사용법을 마스터

<style>
.vp-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin: 16px 0;
}

.vp-card {
  display: block;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.vp-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.vp-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.vp-card p {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
