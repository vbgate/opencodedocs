---
title: "v1.2.0-v1.2.4: Copilot 지원 추가 | opencode-mystatus"
sidebarTitle: "v1.2.0-v1.2.4"
subtitle: "v1.2.0 - v1.2.4: Copilot 지원 추가"
description: "opencode-mystatus v1.2.0-v1.2.4 업데이트를 이해합니다. GitHub Copilot 할당량 조회 기능이 추가되었으며, 문서 개선 및 코드 버그 수정이 포함됩니다."
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4: Copilot 지원 추가 및 문서 개선

## 버전 개요

이번 업데이트(v1.2.0 - v1.2.4)는 opencode-mystatus에 중요한 기능 향상을 가져왔으며, 가장 두드러진 점은 **GitHub Copilot의 할당량 조회 지원이 새로 추가되었다**는 것입니다. 동시에 설명서를 개선하고 코드의 lint 오류를 수정했습니다.

**주요 변경 사항**:
- ✅ GitHub Copilot Premium Requests 조회 추가
- ✅ GitHub 내부 API 통합
- ✅ 중국어 및 영어 문서 업데이트
- ✅ 설명서 개선, 버전 제한 제거
- ✅ 코드 lint 오류 수정

---

## [1.2.2] - 2026-01-14

### 문서 개선

- **설명서 업데이트**: `README.md` 및 `README.zh-CN.md`에서 버전 제한 제거
- **자동 업데이트 지원**: 이제 사용자는 수동으로 버전 번호를 수정하지 않고 최신 버전을 자동으로 받을 수 있습니다

**영향**: 사용자가 플러그인을 설치하거나 업그레이드할 때, 더 이상 특정 버전을 지정할 필요가 없으며, `@latest` 태그를 통해 최신 버전을 가져올 수 있습니다.

---

## [1.2.1] - 2026-01-14

### 버그 수정

- **lint 오류 수정**: `copilot.ts`에서 사용되지 않는 `maskString` 가져오기 제거

**영향**: 코드 품질 향상, ESLint 검사 통과, 기능적 변화 없음.

---

## [1.2.0] - 2026-01-14

### 새로운 기능

#### GitHub Copilot 지원

이번 업데이트의 핵심 기능입니다:

- **Copilot 할당량 조회 추가**: GitHub Copilot Premium Requests의 사용 현황 조회 지원
- **GitHub 내부 API 통합**: GitHub API에서 할당량 데이터를 가져오는 `copilot.ts` 모듈 추가
- **문서 업데이트**: `README.md` 및 `README.zh-CN.md`에 Copilot 관련 문서 추가

**지원되는 인증 방식**:
1. **Fine-grained PAT**(권장): 사용자가 생성한 Fine-grained Personal Access Token
2. **OAuth 토큰**: OpenCode OAuth 토큰(Copilot 권한 필요)

**조회 내용**:
- Premium Requests 총량 및 사용량
- 각 모델의 사용 상세
- 구독 유형 식별(free, pro, pro+, business, enterprise)

**사용 예시**:

```bash
# mystatus 명령 실행
/mystatus

# 출력에 GitHub Copilot 섹션이 포함된 것을 볼 수 있습니다
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  모델 사용 상세:
    gpt-4o: 150 Requests
    claude-3.5-sonnet: 75 Requests

  청구 주기: 2026-01
```

---

## 업그레이드 가이드

### 자동 업그레이드(권장)

v1.2.2가 설명서를 업데이트하고 버전 제한을 제거했으므로, 이제 다음을 수행할 수 있습니다:

```bash
# 최신 태그 사용하여 설치
opencode plugin install vbgate/opencode-mystatus@latest
```

### 수동 업그레이드

이미 구버전을 설치한 경우, 직접 업데이트할 수 있습니다:

```bash
# 구버전 제거
opencode plugin uninstall vbgate/opencode-mystatus

# 새 버전 설치
opencode plugin install vbgate/opencode-mystatus@latest
```

### Copilot 구성

업그레이드 후 GitHub Copilot 할당량 조회를 구성할 수 있습니다:

#### 방법 1: Fine-grained PAT 사용(권장)

1. GitHub에서 Fine-grained Personal Access Token 생성
2. 구성 파일 `~/.config/opencode/copilot-quota-token.json` 생성:

```json
{
  "token": "ghp_your_fine_grained_pat_here",
  "username": "your-github-username",
  "tier": "pro"
}
```

3. `/mystatus` 실행하여 할당량 조회

#### 방법 2: OpenCode OAuth 토큰 사용

OpenCode OAuth 토큰에 Copilot 권한이 있는지 확인하고, 직접 `/mystatus`를 실행합니다.

::: tip 팁
Copilot 인증의 상세 구성은 [Copilot 인증 구성](/ko/vbgate/opencode-mystatus/advanced/copilot-auth/) 튜토리얼을 참조하세요.
:::

---

## 알려진 문제

### Copilot 권한 문제

OpenCode OAuth 토큰에 Copilot 권한이 없는 경우, 조회 시 메시지가 표시됩니다. 해결 방법:

1. Fine-grained PAT 사용(권장)
2. Copilot 권한을 체크하여 OpenCode 다시 인증

상세 해결 방법은 [Copilot 인증 구성](/ko/vbgate/opencode-mystatus/advanced/copilot-auth/) 튜토리얼을 참조하세요.

---

## 향후 계획

향후 버전에는 다음과 같은 개선이 포함될 수 있습니다:

- [ ] 더 많은 GitHub Copilot 구독 유형 지원
- [ ] Copilot 할당량 표시 형식 최적화
- [ ] 할당량 경고 기능 추가
- [ ] 더 많은 AI 플랫폼 지원

---

## 관련 문서

- [Copilot 할당량 조회](/ko/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Copilot 인증 구성](/ko/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [일반적인 문제 해결](/ko/vbgate/opencode-mystatus/faq/troubleshooting/)

---

## 전체 변경 로그

모든 버전의 변경 사항을 보려면 [GitHub Releases](https://github.com/vbgate/opencode-mystatus/releases)를 방문하세요.
