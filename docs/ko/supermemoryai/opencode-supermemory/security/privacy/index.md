---
title: "프라이버시: 민감 정보 보호 | opencode-supermemory"
sidebarTitle: "프라이버시 보호"
subtitle: "프라이버시와 데이터 보안: 민감한 정보 보호 방법"
description: "opencode-supermemory 프라이버시 보호 메커니즘을 학습하세요. private 태그로 데이터 마스킹, API Key 안전 설정 방법을 익힙니다."
tags:
  - "프라이버시"
  - "보안"
  - "설정"
prerequisite:
  - "start-getting-started"
order: 1
---

# 프라이버시와 데이터 보안: 민감한 정보 보호 방법

## 학습 완료 후 할 수 있는 것

*   **데이터가 어디로 가는지 이해**: 어떤 데이터가 클라우드에 업로드되고, 어떤 데이터가 로컬에 남아있는지 명확히 이해.
*   **마스킹 기술 마스터**: `<private>` 태그를 사용하여 민감한 정보(예: 비밀번호, 키)가 업로드되지 않도록 방지.
*   **키 안전 관리**: 가장 안전한 방식으로 `SUPERMEMORY_API_KEY`를 설정.

## 핵심 아이디어

opencode-supermemory를 사용할 때, 데이터 흐름을 이해하는 것이 매우 중요합니다:

1.  **클라우드 저장**: 메모리(Memories)는 로컬 파일이 아닌 Supermemory의 클라우드 데이터베이스에 저장됩니다. 이는 메모리에 접근하려면 네트워크 연결이 필요함을 의미합니다.
2.  **로컬 마스킹**: 프라이버시 보호를 위해, 플러그인은 데이터를 클라우드로 전송하기 **전**에 로컬에서 마스킹 처리를 수행합니다.
3.  **명시적 제어**: 플러그인은 자동으로 모든 파일을 스캔하여 업로드하지 않습니다. Agent가 명시적으로 `add` 도구를 호출하거나 압축을 트리거할 때만 관련 콘텐츠가 처리됩니다.

### 마스킹 메커니즘

플러그인은 `<private>` 태그를 인식하는 간단한 필터를 내장하고 있습니다.

*   **입력**: `여기 데이터베이스 비밀번호는 <private>123456</private>`
*   **처리**: 플러그인이 태그를 감지하고, 그 내용을 `[REDACTED]`로 교체.
*   **업로드**: `여기 데이터베이스 비밀번호는 [REDACTED]`

::: info 팁
이 처리 과정은 플러그인 내부 코드에서 발생하며, 데이터가 컴퓨터를 떠나기 전에 이미 완료됩니다.
:::

## 함께 따라하세요

### 1단계: API Key 안전 설정

API Key를 설정 파일에 직접 작성할 수 있지만, 실수로 유출되는 것을 방지하기 위해(예: 설정 파일을 타인과 공유), 우선순위 논리를 이해하는 것이 좋습니다.

**우선순위 규칙**:
1.  **설정 파일** (`~/.config/opencode/supermemory.jsonc`): 우선순위 가장 높음.
2.  **환경 변수** (`SUPERMEMORY_API_KEY`): 설정 파일에 설정되지 않은 경우 이 변수를 사용.

**권장 방법**:
CI/CD 환경에서 유연하게 전환하거나 사용하려면 환경 변수를 사용하세요. 개인 개발자라면, 사용자 디렉토리의 JSONC 파일에 설정하는 것도 안전합니다(프로젝트 Git 저장소에 없으므로).

### 2단계: `<private>` 태그 사용

자연어로 Agent에게 민감한 정보를 포함하는 콘텐츠를 기억하게 할 때, 민감한 부분을 `<private>` 태그로 감쌀 수 있습니다.

**작업 데모**:

Agent에게 말하세요:
> 기억해 주세요, 프로덕션 환경 데이터베이스 IP는 192.168.1.10이지만, root 비밀번호는 `<private>SuperSecretPwd!</private>`이며, 비밀번호를 유출하지 마세요.

**다음을 보아야 합니다**:
Agent는 `supermemory` 도구를 호출하여 메모리를 저장합니다. Agent의 응답에 비밀번호가 포함될 수 있지만(컨텍스트에 있으므로), **Supermemory 클라우드에 실제로 저장된 메모리**는 이미 마스킹되어 있습니다.

### 3단계: 마스킹 결과 확인

검색을 통해 방금의 비밀번호가 실제로 저장되지 않았는지 확인할 수 있습니다.

**작업**:
Agent에게 방금의 메모리를 검색하도록 요청:
> 프로덕션 데이터베이스의 비밀번호를 검색해 주세요.

**예상 결과**:
Agent가 Supermemory에서 검색한 콘텐츠는 다음이어야 함:
`프로덕션 환경 데이터베이스 IP는 192.168.1.10이지만, root 비밀번호는 [REDACTED]...`

Agent가 "비밀번호는 [REDACTED]"라고 알려주면, 마스킹 메커니즘이 정상 작동함을 의미합니다.

## 일반적인 오해

::: warning 오해 1: 모든 코드가 업로드됩니다
**사실**: 플러그인은 코드베이스 전체를 자동으로 업로드하지 **않습니다**. `/supermemory-init`을 실행하여 초기화 스캔을 수행하거나, Agent가 명시적으로 "이 코드 로직을 기억하기로" 결정할 때만 특정 세그먼트를 업로드합니다.
:::

::: warning 오해 2: .env 파일이 자동으로 로드됩니다
**사실**: 플러그인은 프로세스 환경의 `SUPERMEMORY_API_KEY`를 읽습니다. 프로젝트 루트 디렉토리에 `.env` 파일을 넣어도, 플러그인은 사용하는 터미널 또는 OpenCode 메인 프로그램이 로드하지 않는 한 **자동으로 읽지 않습니다**.
:::

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보려면 클릭</strong></summary>

> 업데이트: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 프라이버시 마스킹 로직 | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| API Key 로드 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| 플러그인 호출 마스킹 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**핵심 함수**:
- `stripPrivateContent(content)`: 정규 표현식 치환을 수행하여 `<private>` 내용을 `[REDACTED]`로 변환.
- `loadConfig()`: 로컬 설정 파일 로드, 환경 변수보다 우선순위 높음.

</details>

## 다음 수업 예고

> 축하합니다! opencode-supermemory의 핵심 수업을 완료했습니다!
>
> 이제 다음을 할 수 있습니다:
> - [고급 설정](/ko/supermemoryai/opencode-supermemory/advanced/configuration/)을 검토하여 더 많은 사용자 정의 옵션 이해.
