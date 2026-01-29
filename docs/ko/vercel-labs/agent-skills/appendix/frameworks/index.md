---
title: "지원 프레임워크: 45+ 배포 솔루션 목록 | Agent Skills"
sidebarTitle: "프레임워크 목록"
subtitle: "지원 프레임워크 목록"
description: "학습하세요: Agent Skills가 지원하는 45+ 프레임워크 목록과 감지 원리. React, Vue, Svelte 등 주요 프레임워크 배포 방법을 다룹니다."
tags:
  - "프레임워크"
  - "배포"
  - "호환성"
  - "참고"
prerequisite: []
---

# 지원 프레임워크 목록

## 학습 후 할 수 있는 것

- Vercel Deploy 스킬이 지원하는 완전 프레임워크 목록(45+개) 이해
- 프레임워크 감지 작업 원리 이해
- 프로젝트가 원클릭 배포를 지원하는지 판단
- 프레임워크 감지 우선순위 규칙 확인

## 현재 당면한 문제

Agent Skills 원클릭 배포 기능을 사용하고 싶지만, 프로젝트 프레임워크가 지원되는지 확실하지 않거나, 감지 로직이 어떻게 작동하는지 알고 싶습니다.

## 핵심 아이디어

Vercel Deploy 스킬은 프로젝트의 `package.json` 파일에서 `dependencies`와 `devDependencies`를 스캔하여 미리 정의된 프레임워크 특징 패키지 이름을 하나씩 감지하여 프로젝트에서 사용하는 프레임워크를 판단합니다.

**감지 우선순위**: 가장 구체적인 프레임워크 감지부터 가장 일반적인 것까지, 오인을 피합니다. 예를 들어:
1. 감지 `next` → Next.js 일치
2. 동시에 `react`가 있어도 우선적으로 Next.js로 인식

::: tip 감지 범위

감지는 `dependencies`와 `devDependencies`를 동시에 확인하므로, 프레임워크가 개발 의존성으로만 설치되어도 인식될 수 있습니다.

:::

## 완전 프레임워크 목록

### React 생태계

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **Next.js** | `next` | `nextjs` |
| **Gatsby** | `gatsby` | `gatsby` |
| **Remix** | `@remix-run/` | `remix` |
| **React Router** | `@react-router/` | `react-router` |
| **Blitz** | `blitz` | `blitzjs` |
| **Create React App** | `react-scripts` | `create-react-app` |
| **Ionic React** | `@ionic/react` | `ionic-react` |
| **Preact** | `preact` | `preact` |

### Vue 생태계

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **Nuxt** | `nuxt` | `nuxtjs` |
| **VitePress** | `vitepress` | `vitepress` |
| **VuePress** | `vuepress` | `vuepress` |
| **Gridsome** | `gridsome` | `gridsome` |

### Svelte 생태계

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **SvelteKit** | `@sveltejs/kit` | `sveltekit-1` |
| **Svelte** | `svelte` | `svelte` |
| **Sapper** (legacy) | `sapper` | `sapper` |

### Angular

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **Angular** | `@angular/core` | `angular` |
| **Ionic Angular** | `@ionic/angular` | `ionic-angular` |

### 정적 사이트 생성기

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **Astro** | `astro` | `astro` |
| **Docusaurus** | `@docusaurus/core` | `docusaurus-2` |
| **Hexo** | `hexo` | `hexo` |
| **Eleventy** | `@11ty/eleventy` | `eleventy` |
| **RedwoodJS** | `@redwoodjs/` | `redwoodjs` |

### Node.js 백엔드 프레임워크

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **Express** | `express` | `express` |
| **NestJS** | `@nestjs/core` | `nestjs` |
| **Hono** | `hono` | `hono` |
| **Fastify** | `fastify` | `fastify` |
| **Elysia** | `elysia` | `elysia` |
| **h3** | `h3` | `h3` |
| **Nitro** | `nitropack` | `nitro` |

### 기타 프레임워크

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **SolidStart** | `@solidjs/start` | `solidstart-1` |
| **Ember** | `ember-cli`, `ember-source` | `ember` |
| **Dojo** | `@dojo/framework` | `dojo` |
| **Polymer** | `@polymer/` | `polymer` |
| **Stencil** | `@stencil/core` | `stencil` |
| **UmiJS** | `umi` | `umijs` |
| **Saber** | `saber` | `saber` |
| **Sanity** | `sanity`, `@sanity/` | `sanity` 또는 `sanity-v3` |
| **Storybook** | `@storybook/` | `storybook` |
| **Hydrogen** (Shopify) | `@shopify/hydrogen` | `hydrogen` |
| **TanStack Start** | `@tanstack/start` | `tanstack-start` |

### 빌드 툴

| 프레임워크 | 감지 의존성 | 반환값 |
|------|---------|--------|
| **Vite** | `vite` | `vite` |
| **Parcel** | `parcel` | `parcel` |

### 정적 HTML 프로젝트

프로젝트에 `package.json`이 없는 경우(순수 정적 사이트), 프레임워크 감지는 `null`을 반환합니다.

배포 스크립트는 지능적으로 처리합니다:
- 루트 디렉토리의 `.html` 파일 자동 감지
- `.html` 파일이 하나만 있고 `index.html`이 아닌 경우, 자동으로 `index.html`로 이름 변경
- 정적 사이트로 직접 Vercel에 호스팅

**예시 시나리오**:
```bash
my-static-site/
└── demo.html  # 자동으로 index.html로 이름 변경
```

## 프레임워크 감지 원리

### 감지 프로세스

```
package.json 읽기
    ↓
dependencies 및 devDependencies 스캔
    ↓
우선순위 순으로 미리 정의된 패키지 이름 일치
    ↓
첫 번째 일치 발견 → 해당 프레임워크 식별자 반환
    ↓
일치 없음 → null 반환(정적 HTML 프로젝트)
```

### 감지 순서

감지는 프레임워크의 구체성으로 정렬되며, **더 구체적인 프레임워크를 우선 매칭**합니다:

```bash
# 예: Next.js 프로젝트
dependencies:
  next: ^14.0.0        # 일치 → nextjs
  react: ^18.0.0       # 건너뜀(더 높은 우선순위 일치 존재)
  react-dom: ^18.0.0
```

**부분 감지 순서**:
1. Next.js, Gatsby, Remix, Blitz(구체적 프레임워크)
2. SvelteKit, Nuxt, Astro(메타 프레임워크)
3. React, Vue, Svelte(기본 라이브러리)
4. Vite, Parcel(일반 빌드 툴)

### 감지 규칙

- **동시에 확인** `dependencies`와 `devDependencies`
- **순차적으로 매칭**, 첫 번째 발견 시 반환
- **패키지 이름 매칭**: 정확 매칭 또는 접두사 매칭
  - 정확 매칭: `"next"` → Next.js
  - 접두사 매칭: `"@remix-run/"` → Remix

```bash
# shell 감지 로직(간소화)
has_dep() {
    echo "$content" | grep -q "\"$1\""
}

if has_dep "next"; then
    echo "nextjs"
fi
```

## 프로젝트 프레임워크 검증 방법

### 방법 1: package.json 확인

프로젝트의 `package.json`을 열고, `dependencies`나 `devDependencies`에서 위 목록의 패키지 이름을 찾습니다.

```json
{
  "dependencies": {
    "next": "^14.0.0",  ← Next.js
    "react": "^18.0.0"
  }
}
```

### 방법 2: 배포 시도

Vercel Deploy 기능을 직접 사용합니다:

```
Deploy my app to Vercel
```

Claude가 감지된 프레임워크를 출력합니다:

```
Detected framework: nextjs
```

### 방법 3: 수동 감지 스크립트 실행

미리 테스트하고 싶다면 실행합니다:

```bash
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh
```

감지된 프레임워크 정보를 출력(stderr)합니다.

## 일반적인 문제 해결

### 문제 1: 프레임워크 감지 부정확

**현상**:
```
Detected framework: vite
# 하지만 기대하는 것은 nextjs
```

**원인**: 감지가 우선순위 순으로, Vite 감지가 Next.js 뒤에 있지만, 프로젝트에 `vite`와 `next`가 동시에 있으면 Vite에 매칭될 수 있습니다.

**영향**: 보통 배포에 영향 없음, Vercel이 자동으로 빌드 구성을 감지.

**해결 방법**:
- `package.json`에서 의존성 확인
- 배포에 영향 없다면 무시 가능
- 배포는 정상 작동하며, 다른 구성만 사용

### 문제 2: 프로젝트가 목록에 없음

**현상**: 프로젝트 프레임워크가 위 목록에 없습니다.

**가능한 원인**:
- 매우 새로운 프레임워크 또는 희귀한 프레임워크
- 프레임워크가 다른 패키지 이름 사용
- 배포 스크립트가 아직 지원을 추가하지 않음

**해결 방법**:
1. 프로젝트가 **Vite** 또는 **Parcel** 등 일반 빌드 툴 사용하는지 확인
2. 배포 시도, Vercel이 자동으로 인식할 수 있음
3. 정적 HTML 프로젝트인 경우 직접 배포
4. [agent-skills](https://github.com/vercel-labs/agent-skills)에 PR 제출하여 프레임워크 지원 추가

### 문제 3: 다중 프레임워크 프로젝트

**현상**: 프로젝트가 여러 프레임워크(예: Remix + Storybook)를 동시에 사용.

**감지 동작**: 우선순위별로 첫 번째 매칭 프레임워크 반환.

**영향**: 보통 배포에 영향 없음, 주 프레임워크가 정확히 인식.

## 자주 묻는 질문

### Q: 내 프레임워크가 목록에 없는데 배포할 수 있나요?

A: 시도해 볼 수 있습니다. 프로젝트가 Vite나 Parcel 등 일반 빌드 툴을 사용한다면 이 도구로 인식될 수 있습니다. Vercel도 자동 빌드 구성을 시도합니다.

### Q: 감지 오류가 배포에 영향을 줍니까?

A: 보통 아닙니다. Vercel에는 강력한 자동 감지 메커니즘이 있어, 프레임워크 식별자가 부정확해도 정상 빌드 및 배포 가능합니다.

### Q: 새 프레임워크 지원을 어떻게 추가하나요?

A: `deploy.sh`에서 `detect_framework()` 함수를 수정하여 새 감지 규칙을 추가한 후, [agent-skills](https://github.com/vercel-labs/agent-skills)에 PR을 제출합니다.

### Q: 정적 HTML 프로젝트에 package.json이 필요한가요?

A: 아닙니다. 순수 정적 HTML 프로젝트(JavaScript 빌드 없음)는 직접 배포 가능하며, 스크립트가 자동으로 처리합니다.

## 이 과정 요약

Agent Skills Vercel Deploy 기능은 **45+ 개 프레임워크**를 지원하며, 주요 프론트엔드 기술 스택을 포괄합니다:

**핵심 가치**:
- ✅ 광범위한 프레임워크 지원, React/Vue/Svelte/Angular 전체 포괄
- ✅ 지능형 프레임워크 감지, 자동 프로젝트 유형 식별
- ✅ 정적 HTML 프로젝트 지원, 의존성 없는 배포
- ✅ 오픈 소스, 새 프레임워크 추가 확장 가능

**감지 원리**:
- `package.json`의 `dependencies`와 `devDependencies` 스캔
- 우선순위별로 미리 정의된 프레임워크 특징 패키지 이름 매칭
- Vercel 사용을 위해 해당 프레임워크 식별자 반환

**다음 단계**:
[Vercel 원클릭 배포 튜토리얼](../../platforms/vercel-deploy/)을 보고 이 기능을 사용하는 방법을 알아보세요.

## 부록: 소스 참고

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 날짜: 2026-01-25

| 기능        | 파일 경로                                                                                             | 행번호    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| 프레임워크 감지 로직 | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 11-156  |
| 배포 스크립트 진입점 | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 1-250   |
| 정적 HTML 처리 | [`deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205 |

**핵심 함수**:
- `detect_framework()`: package.json에서 45+ 개 프레임워크 감지(11-156행)
- `has_dep()`: 의존성 존재 여부 확인(23-25행)

**프레임워크 감지 순서**(부분):
1. Blitz (blitzjs)
2. Next.js (nextjs)
3. Gatsby (gatsby)
4. Remix (remix)
5. React Router (react-router)
6. TanStack Start (tanstack-start)
7. Astro (astro)
8. Hydrogen (hydrogen)
9. SvelteKit (sveltekit-1)
10. Svelte (svelte)
...(전체 목록은 11-156행 참고)

**반환값 예시**:
- Next.js: `nextjs`
- Nuxt: `nuxtjs`
- 정적 HTML: `null`

</details>
