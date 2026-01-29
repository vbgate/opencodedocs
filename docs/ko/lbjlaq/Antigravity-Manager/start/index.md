---
title: "빠른 시작: Antigravity Tools 처음 사용 | Antigravity-Manager"
sidebarTitle: "처음부터 실행하기"
subtitle: "빠른 시작: Antigravity Tools 처음 사용"
description: "Antigravity Tools의 완전한 상용 과정을 학습합니다. 설치 설정부터 첫 API 호출까지, 로컬 게이트웨이의 핵심 사용 방법을 빠르게 마스터합니다."
order: 1
---

# 빠른 시작

이 장에서는 처음부터 Antigravity Tools를 사용하여 설치부터 첫 API 호출까지 완전한 과정을 완료합니다. 핵심 개념, 계정 관리, 데이터 백업, AI 클라이언트를 로컬 게이트웨이에 연결하는 방법을 배웁니다.

## 이 장 내용

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Antigravity Tools란 무엇인가</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">올바른 멘탈 모델 수립: 로컬 게이트웨이, 프로토콜 호환, 계정 풀 스케줄링의 핵심 개념과 사용 경계.</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">설치 및 업그레이드</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">데스크톱 최적 설치 경로(brew / releases), 일반적인 시스템 차단 처리 방식.</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">첫 실행 필수</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">데이터 디렉토리, 로그, 트레이 및 자동 시작, 실수로 삭제 및 되돌릴 수 없는 손실 방지.</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">계정 추가</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">OAuth/Refresh Token 이중 채널과 모범 사례, 가장 안정적인 방법으로 계정 풀 구축.</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">계정 백업 및 마이그레이션</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">가져오기/내보내기, V1/DB 핫 마이그레이션, 다중 기기 재사용 및 서버 배포 시나리오 지원.</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">역방향 프록시 시작 및 클라이언트 연결</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">서비스 시작부터 외부 클라이언트 성공 호출까지, 한 번에 완성 검증 루프.</p>
</a>

</div>

## 학습 경로

::: tip 권장 순서
다음 순서대로 학습하면 가장 빠르게 Antigravity Tools를 상용할 수 있습니다:
:::

```
1. 개념 이해        →  2. 소프트웨어 설치        →  3. 데이터 디렉토리 이해
   getting-started      installation          first-run-data
        ↓                    ↓                      ↓
4. 계정 추가        →  5. 계정 백업        →  6. 역방향 프록시 시작
   add-account          backup-migrate        proxy-and-first-client
```

| 단계 | 과정 | 예상 시간 | 배울 내용 |
|------|------|----------|----------|
| 1 | [개념 이해](./getting-started/) | 5분 | 로컬 게이트웨이란 무엇인가, 계정 풀 왜 필요한가 |
| 2 | [소프트웨어 설치](./installation/) | 3분 | brew 설치 또는 수동 다운로드, 시스템 차단 처리 |
| 3 | [데이터 디렉토리 이해](./first-run-data/) | 5분 | 데이터가 어디에 있는지, 로그 보는 법, 트레이 작동 |
| 4 | [계정 추가](./add-account/) | 10분 | OAuth 권한 부여 또는 수동 Refresh Token 입력 |
| 5 | [계정 백업](./backup-migrate/) | 5분 | 계정 내보내기, 장치 간 마이그레이션 |
| 6 | [역방향 프록시 시작](./proxy-and-first-client/) | 10분 | 서비스 시작, 클라이언트 설정, 호출 검증 |

**최소 사용 가능 경로**: 급하면 1 → 2 → 4 → 6만 완료, 약 25분이면 사용 시작 가능.

## 다음 단계

이 장을 완료하면 Antigravity Tools를 정상적으로 사용할 수 있습니다. 필요에 따라 심층 학습:

- **[플랫폼 및 통합](../platforms/)**: OpenAI, Anthropic, Gemini 등 다른 프로토콜 연결 세부 사항 이해
- **[고급 설정](../advanced/)**: 모델 라우팅, 할당량 보호, 고가용성 스케줄링 등 고급 기능
- **[일반적인 문제](../faq/)**: 401, 429, 404 등 오류 발생 시 문제 해결 가이드
