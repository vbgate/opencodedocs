---
title: "필수 플러그인 설치: superpowers 및 ui-ux-pro-max | AI App Factory 튜토리얼"
sidebarTitle: "5분 만에 플러그인 설치"
subtitle: "필수 플러그인 설치: superpowers 및 ui-ux-pro-max | AI App Factory 튜토리얼"
description: "AI App Factory의 두 가지 필수 플러그인인 superpowers(Bootstrap 브레인스토밍용)와 ui-ux-pro-max(UI 디자인 시스템용)를 설치하고 검증하는 방법을 배웁니다. 이 튜토리얼은 자동 설치, 수동 설치, 검증 방법 및 일반적인 문제 해결을 다루며, 파이프라인이 원활하게 실행되고 고품질의 실행 가능한 앱을 생성할 수 있도록 하고, 플러그인 누락으로 인한 실패를 방지합니다."
tags:
  - "플러그인 설치"
  - "Claude Code"
  - "superpowers"
  - "ui-ux-pro-max"
prerequisite:
  - "start-installation"
  - "start-init-project"
  - "platforms-claude-code"
order: 70
---

# 필수 플러그인 설치: superpowers 및 ui-ux-pro-max | AI App Factory 튜토리얼

## 학습 후 할 수 있는 것

- superpowers 및 ui-ux-pro-max 플러그인 설치 여부 확인
- 자동 설치 실패 시 두 필수 플러그인 수동 설치
- 플러그인이 올바르게 활성화되었는지 확인
- 이 두 플러그인이 파이프라인 실행의 전제 조건인 이유 이해
- 플러그인 설치 실패의 일반적인 문제 해결

## 현재 겪고 있는 문제

Factory 파이프라인을 실행할 때 다음과 같은 문제를 겪을 수 있습니다:

- **Bootstrap 단계 실패**: 「superpowers:brainstorm 스킬을 사용하지 않았습니다」라는 메시지
- **UI 단계 실패**: 「ui-ux-pro-max 스킬을 사용하지 않았습니다」라는 메시지
- **자동 설치 실패**: `factory init` 시 플러그인 설치 오류 발생
- **플러그인 충돌**: 동일한 이름의 플러그인이 이미 있지만 버전이 올바르지 않음
- **권한 문제**: 플러그인 설치 후 올바르게 활성화되지 않음

사실 Factory는 초기화 시 **자동으로 이 두 플러그인을 설치하려고 시도**하지만, 실패할 경우 수동으로 처리해야 합니다.

## 언제 사용해야 하나요

다음과 같은 상황에서는 플러그인을 수동으로 설치해야 합니다:

- `factory init` 시 플러그인 설치 실패 메시지
- Bootstrap 또는 UI 단계에서 필수 스킬을 사용하지 않음을 감지
- Factory를 처음 사용하여 파이프라인이 정상적으로 실행되도록 보장
- 플러그인 버전이 너무 오래되어 재설치 필요

## 왜 이 두 플러그인이 필요한가요

Factory의 파이프라인은 두 가지 핵심 Claude Code 플러그인에 의존합니다:

| 플러그인 | 용도 | 파이프라인 단계 | 제공하는 스킬 |
| --- | --- | --- | --- |
| **superpowers** | 제품 아이디어 심층 탐색 | Bootstrap | `superpowers:brainstorm` - 체계적인 브레인스토밍, 문제, 사용자, 가치, 가정 분석 |
| **ui-ux-pro-max** | 전문 디자인 시스템 생성 | UI | `ui-ux-pro-max` - 67가지 스타일, 96가지 색상 팔레트, 100개 업계 규칙 |

::: warning 필수 요구사항
`agents/orchestrator.checkpoint.md`의 정의에 따라 이 두 플러그인은 **필수**입니다:
- **Bootstrap 단계**: `superpowers:brainstorm` 스킬을 사용해야 합니다. 그렇지 않으면 결과물이 거부됩니다.
- **UI 단계**: `ui-ux-pro-max` 스킬을 사용해야 합니다. 그렇지 않으면 결과물이 거부됩니다.

:::

## 🎒 시작 전 준비

시작하기 전에 다음을 확인하세요:

- [ ] Claude CLI가 설치됨(`claude --version` 사용 가능)
- [ ] `factory init`으로 프로젝트 초기화 완료
- [ ] Claude Code 권한이 구성됨([Claude Code 통합 가이드](../claude-code/) 참조)
- [ ] 네트워크 연결이 정상(GitHub 플러그인 마켓에 액세스 필요)

## 핵심 개념

플러그인 설치는 **확인→마켓 추가→설치→검증**의 4단계 프로세스를 따릅니다:

1. **확인**: 플러그인이 설치되었는지 확인
2. **마켓 추가**: 플러그인 저장소를 Claude Code 플러그인 마켓에 추가
3. **설치**: 설치 명령 실행
4. **검증**: 플러그인이 활성화되었는지 확인

Factory의 자동 설치 스크립트(`cli/scripts/check-and-install-*.js`)는 이러한 단계를 자동으로 실행하지만, 실패 상황에 대비해 수동 방법을 알아야 합니다.

## 따라 하기

### 1단계: 플러그인 상태 확인

**왜 필요한가요**
이미 설치되어 있는지 먼저 확인하여 중복 작업을 피합니다.

터미널을 열고 프로젝트 루트 디렉터리에서 다음을 실행하세요:

```bash
claude plugin list
```

**다음을 볼 수 있습니다**: 설치된 플러그인 목록이 표시됩니다. 다음 내용이 포함되어 있으면 설치된 것입니다:

```
✅ superpowers (enabled)
✅ ui-ux-pro-max (enabled)
```

이 두 플러그인이 보이지 않거나 `disabled`로 표시되면 아래 단계를 계속 진행해야 합니다.

::: info factory init의 자동 설치
`factory init` 명령은 자동으로 플러그인 설치 확인을 실행합니다(`init.js`의 360-392행). 성공하면 다음을 볼 수 있습니다:

```
📦 Installing superpowers plugin... ✓
📦 Installing ui-ux-pro-max-skill plugin... ✓
✅ Plugins installed!
```
:::

### 2단계: superpowers 플러그인 설치

**왜 필요한가요**
Bootstrap 단계에서는 `superpowers:brainstorm` 스킬을 사용하여 브레인스토밍을 수행해야 합니다.

#### 플러그인 마켓에 추가

```bash
claude plugin marketplace add obra/superpowers-marketplace
```

**다음을 볼 수 있습니다**:

```
✅ Plugin marketplace added successfully
```

::: tip 마켓 추가 실패
「플러그인 마켓이 이미 존재합니다」라는 메시지가 표시되면 무시하고 설치 단계를 계속 진행하세요.
:::

#### 플러그인 설치

```bash
claude plugin install superpowers@superpowers-marketplace
```

**다음을 볼 수 있습니다**:

```
✅ Plugin installed successfully
```

#### 설치 확인

```bash
claude plugin list
```

**다음을 볼 수 있습니다**: 목록에 `superpowers (enabled)`가 포함되어 있습니다.

### 3단계: ui-ux-pro-max 플러그인 설치

**왜 필요한가요**
UI 단계에서는 `ui-ux-pro-max` 스킬을 사용하여 디자인 시스템을 생성해야 합니다.

#### 플러그인 마켓에 추가

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

**다음을 볼 수 있습니다**:

```
✅ Plugin marketplace added successfully
```

#### 플러그인 설치

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**다음을 볼 수 있습니다**:

```
✅ Plugin installed successfully
```

#### 설치 확인

```bash
claude plugin list
```

**다음을 볼 수 있습니다**: 목록에 `ui-ux-pro-max (enabled)`가 포함되어 있습니다.

### 4단계: 두 플러그인이 모두 정상적으로 작동하는지 확인

**왜 필요한가요**
파이프라인이 이 두 플러그인의 스킬을 정상적으로 호출할 수 있는지 확인합니다.

#### superpowers 확인

Claude Code에서 다음을 실행하세요:

```
superpowers:brainstorm 스킬을 사용하여 다음 제품 아이디어를 분석해 주세요: [당신의 아이디어]
```

**다음을 볼 수 있습니다**: Claude가 브레인스토밍 스킬을 사용하여 문제, 사용자, 가치, 가정을 체계적으로 분석하기 시작합니다.

#### ui-ux-pro-max 확인

Claude Code에서 다음을 실행하세요:

```
ui-ux-pro-max 스킬을 사용하여 내 애플리케이션의 색상 구성을 설계해 주세요
```

**다음을 볼 수 있습니다**: Claude가 다양한 디자인 옵션이 포함된 전문적인 색상 제안을 반환합니다.

## 확인점 ✅

위 단계를 완료한 후 다음 사항을 확인하세요:

- [ ] `claude plugin list`를 실행하면 두 플러그인이 모두 `enabled`로 표시됨
- [ ] Claude Code에서 `superpowers:brainstorm` 스킬을 호출할 수 있음
- [ ] Claude Code에서 `ui-ux-pro-max` 스킬을 호출할 수 있음
- [ ] `factory run`을 실행할 때 플러그이 누락에 대한 메시지가 더 이상 표시되지 않음

## 일반적인 문제 해결

### ❌ 플러그인이 설치되었지만 활성화되지 않음

**현상**: `claude plugin list`가 플러그인이 존재한다고 표시하지만 `enabled` 표시가 없습니다.

**해결 방법**: 설치 명령을 다시 실행하세요:

```bash
claude plugin install <플러그인 ID>
```

### ❌ 권한이 차단됨

**현상**: 「Permission denied: Skill(superpowers:brainstorming)」이라는 메시지

**원인**: Claude Code 권한 구성에 `Skill` 권한이 포함되지 않았습니다.

**해결 방법**: `.claude/settings.local.json`에 다음 내용이 포함되어 있는지 확인하세요:

```json
{
  "permissions": [
    "Skill(superpowers:brainstorming)",
    "Skill(ui-ux-pro-max)"
  ]
}
```

::: info 전체 권한 구성
이것은 최소 권한 구성 예시입니다. Factory의 `init` 명령은 전체 권한 구성 파일(`Skill(superpowers:brainstorm)` 및 기타 필요한 권한 포함)을 자동으로 생성하므로 일반적으로 수동으로 편집할 필요가 없습니다.

권한 구성을 다시 생성해야 하는 경우 프로젝트 루트 디렉터리에서 다음을 실행하세요:
```bash
factory init --force-permissions
```
:::

[Claude Code 통합 가이드](../claude-code/)를 참조하여 권한 구성을 다시 생성하세요.

### ❌ 마켓 추가 실패

**현상**: `claude plugin marketplace add`가 실패하고 「not found」 또는 네트워크 오류를 표시합니다.

**해결 방법**:

1. 네트워크 연결 확인
2. Claude CLI 버전이 최신인지 확인: `npm update -g @anthropic-ai/claude-code`
3. 직접 설치 시도: 마켓 추가를 건너뛰고 `claude plugin install <플러그인 ID>`를 직접 실행

### ❌ 플러그인 버전 충돌

**현상**: 동일한 이름의 플러그인이 이미 설치되어 있지만 버전이 올바르지 않아 파이프라인이 실패합니다.

**해결 방법**:

```bash
# 이전 버전 제거
claude plugin uninstall <플러그인 이름>

# 재설치
claude plugin install <플러그인 ID>
```

### ❌ Windows 경로 문제

**현상**: Windows에서 스크립트를 실행할 때 「명령을 찾을 수 없습니다」라는 메시지가 표시됩니다.

**해결 방법**:

Node.js를 사용하여 설치 스크립트를 직접 실행하세요:

```bash
node cli/scripts/check-and-install-superpowers.js
node cli/scripts/check-and-install-ui-skill.js
```

## 자동 설치 실패 시 대처 방법

`factory init` 시 자동 설치가 실패한 경우 다음을 수행할 수 있습니다:

1. **오류 메시지 확인**: 터미널에 구체적인 실패 원인이 표시됩니다
2. **수동 설치**: 위 단계에 따라 두 플러그인을 수동으로 설치하세요
3. **다시 실행**: `factory run`은 플러그인 상태를 확인하고, 설치된 경우 파이프라인을 계속 진행합니다

::: warning 파이프라인 시작에 영향 없음
플러그인 설치가 실패하더라도 `factory init`은 초기화를 완료합니다. 이후에 플러그인을 수동으로 설치할 수 있으며, 후속 작업에 영향을 주지 않습니다.
:::

## 파이프라인에서의 플러그인 역할

### Bootstrap 단계(superpowers 필수)

- **스�킬 호출**: `superpowers:brainstorm`
- **출력**: `input/idea.md` - 구조화된 제품 아이디어 문서
- **검증점**: Agent가 해당 스킬을 사용했다고 명시적으로 설명했는지 확인(`orchestrator.checkpoint.md:60-70`)

### UI 단계(ui-ux-pro-max 필수)

- **스킬 호출**: `ui-ux-pro-max`
- **출력**: `artifacts/ui/ui.schema.yaml` - 디자인 시스템이 포함된 UI 스키마
- **검증점**: 디자인 시스템 구성이 해당 스킬에서 왔는지 확인(`orchestrator.checkpoint.md:72-84`)

## 이 레슨 요약

- Factory는 두 가지 필수 플러그인에 의존합니다: `superpowers` 및 `ui-ux-pro-max`
- `factory init`은 자동으로 설치를 시도하지만 실패 시 수동으로 처리해야 합니다
- 플러그인 설치 프로세스: 확인→마켓 추가→설치→검증
- 두 플러그인이 모두 `enabled` 상태이고 권한 구성이 올바른지 확인하세요
- 파이프라인의 Bootstrap 및 UI 단계는 이 두 플러그인의 사용을 강제로 검사합니다

## 다음 레슨 예고

> 다음 레슨에서 **[7단계 파이프라인 개요](../../start/pipeline-overview/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - 파이프라인의 전체 실행 프로세스
> - 각 단계의 입력/출력 및 역할
> - 확인점 메커니즘이 품질을 보장하는 방법
> - 실패한 단계에서 복구하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-29

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| Superpowers 플러그인 확인 스크립트 | [`cli/scripts/check-and-install-superpowers.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-superpowers.js) | 1-208 |
| UI/UX Pro Max 플러그인 확인 스크립트 | [`cli/scripts/check-and-install-ui-skill.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/scripts/check-and-install-ui-skill.js) | 1-209 |
| 자동 플러그인 설치 로직 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 360-392 |
| Bootstrap 단계 스킬 검증 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 60-70 |
| UI 단계 스킬 검증 | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 72-84 |

**핵심 상수**:
- `PLUGIN_NAME = 'superpowers'`: superpowers 플러그인 이름
- `PLUGIN_ID = 'superpowers@superpowers-marketplace'`: superpowers 전체 ID
- `PLUGIN_MARKETPLACE = 'obra/superpowers-marketplace'`: 플러그인 마켓 저장소
- `UI_PLUGIN_NAME = 'ui-ux-pro-max'`: UI 플러그인 이름
- `UI_PLUGIN_ID = 'ui-ux-pro-max@ui-ux-pro-max-skill'`: UI 플러그인 전체 ID
- `UI_PLUGIN_MARKETPLACE = 'nextlevelbuilder/ui-ux-pro-max-skill'`: UI 플러그인 마켓 저장소

**핵심 함수**:
- `isPluginInstalled()`: 플러그인이 설치되었는지 확인(`claude plugin list` 출력 통해)
- `addToMarketplace()`: 플러그인을 마켓에 추가(`claude plugin marketplace add`)
- `installPlugin()`: 플러그인 설치(`claude plugin install`)
- `verifyPlugin()`: 플러그인이 설치되고 활성화되었는지 확인
- `main()`: 메인 함수, 전체 확인→추가→설치→검증 프로세스 실행

</details>
