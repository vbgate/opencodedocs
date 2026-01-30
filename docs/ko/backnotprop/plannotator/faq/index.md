---
title: "자주 묻는 질문: 사용 문제 해결 | opencode-plannotator"
sidebarTitle: "문제가 발생했을 때"
subtitle: "자주 묻는 질문: 사용 문제 해결"
description: "Plannotator의 자주 묻는 질문 해결 방법을 학습하세요. 포트 점유, 브라우저 미열기, 통합 실패 등 문제의 빠른 해결 기술을 마스터하세요."
order: 4
---

# 자주 묻는 질문

이 장에서는 Plannotator 사용 과정에서 발생하는 다양한 문제를 해결하는 방법을 안내합니다. 포트 점유, 브라우저 미열기, 통합 실패 등 문제에 대한 해결 방법과 디버깅 기술을 제공합니다.

## 이 장의 내용

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 자주 묻는 질문</h3>
  <p>포트 점유, 브라우저 미열기, 계획 미표시, Git 오류, 이미지 업로드 실패, Obsidian/Bear 통합 문제 등 사용 과정에서 발생하는 자주 묻는 질문을 해결합니다.</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 문제 해결</h3>
  <p>로그 확인, 오류 처리, 디버깅 기술 등 문제 해결의 기본 방법을 마스터하세요. 로그 출력을 통해 문제의 원인을 빠르게 파악하는 방법을 배웁니다.</p>
</a>

</div>

## 학습 경로

```
자주 묻는 질문 → 문제 해결
   ↓           ↓
  빠른 해결   심층 디버깅
```

**권장 순서**:

1. **먼저 자주 묻는 질문 확인**: 대부분의 문제는 여기에서 해결 방법을 찾을 수 있습니다
2. **다음으로 문제 해결 학습**: 자주 묻는 질문에서 다루지 않은 문제는 로그와 디버깅 기술을 통해 스스로 해결하는 방법을 학습하세요

::: tip 문제 발생 시 제안
「자주 묻는 질문」에서 키워드(예: "포트", "브라우저", "Obsidian")를 검색하여 해당 해결 방법을 찾으세요. 문제가 복잡하거나 목록에 없는 경우, 「문제 해결」을 참조하여 디버깅 방법을 학습하세요.
:::

## 전제 조건

이 장을 학습하기 전에 다음을 완료하는 것이 좋습니다:

- ✅ [빠른 시작](../start/getting-started/) - Plannotator의 기본 개념 이해
- ✅ Claude Code 또는 OpenCode 플러그인 설치(둘 중 하나 선택):
  - [Claude Code 플러그인 설치](../start/installation-claude-code/)
  - [OpenCode 플러그인 설치](../start/installation-opencode/)

## 다음 단계

이 장을 완료한 후 다음 내용을 계속 학습할 수 있습니다:

- [API 참조](../appendix/api-reference/) - 모든 API 엔드포인트 및 요청/응답 형식 이해
- [데이터 모델](../appendix/data-models/) - Plannotator가 사용하는 데이터 구조 이해
- [환경 변수 구성](../advanced/environment-variables/) - 사용 가능한 모든 환경 변수 심층 이해

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
