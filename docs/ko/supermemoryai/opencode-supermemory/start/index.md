---
title: "빠른 시작: 플러그인 설치 | opencode-supermemory"
sidebarTitle: "빠른 시작"
subtitle: "빠른 시작: 설치 및 설정 가이드"
description: "opencode-supermemory 플러그인의 설치 및 설정 방법을 배웁니다. API Key 설정, 플러그인 충돌 해결, 프로젝트 초기화까지 단계별로 안내합니다."
order: 1
---

# 빠른 시작

이 장에서는 처음부터 opencode-supermemory 플러그인을 설치하고 설정하는 방법을 안내합니다. OpenCode Agent에 지속적인 메모리 능력을 부여하여 프로젝트 아키텍처와 사용자의 기본 설정을 기억할 수 있게 됩니다.

## 이 장의 내용

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">빠른 시작: 설치 및 설정</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">플러그인 설치, API Key 설정, 플러그인 충돌 해결, Agent를 클라우드 메모리 저장소에 연결.</p>
</a>

<a href="./initialization/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">프로젝트 초기화: 첫인상 형성</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">/supermemory-init 명령어로 Agent가 코드베이스를 심층 스캔하여 프로젝트 아키텍처와 규칙을 자동으로 기억하게 함.</p>
</a>

</div>

## 학습 경로

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. 빠른 시작          2. 프로젝트 초기화                         │
│   ─────────────   →   ─────────────                             │
│   플러그인 설치          Agent가 기억하게                          │
│   API Key 설정          프로젝트 아키텍처                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**순서대로 학습을 권장합니다**:

1. **[빠른 시작](./getting-started/)**: 먼저 플러그인 설치와 API Key 설정을 완료하세요. 모든 기능을 사용하기 위한 전제조건입니다.
2. **[프로젝트 초기화](./initialization/)**: 설치 완료 후, 초기화 명령어를 실행하여 Agent가 프로젝트에 익숙해지게 하세요.

## 전제조건

이 장을 시작하기 전에 다음을 확인하세요:

- ✅ [OpenCode](https://opencode.ai)가 설치되었으며, 터미널에서 `opencode` 명령어를 사용할 수 있음
- ✅ [Supermemory](https://console.supermemory.ai) 계정이 등록되었으며 API Key를 확보함

## 다음 단계

이 장을 완료한 후, 다음을 계속 학습할 수 있습니다:

- **[핵심 기능](../core/)**: 컨텍스트 주입 메커니즘, 도구 세트 사용, 메모리 관리를 자세히 이해
- **[고급 설정](../advanced/)**: 압축 임계값 커스터마이제이션, 키워드 트리거 규칙 등 고급 설정
