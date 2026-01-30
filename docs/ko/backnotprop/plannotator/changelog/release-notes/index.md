---
title: "업데이트 로그: 버전 기록 | Plannotator"
sidebarTitle: "새로운 기능 보기"
subtitle: "업데이트 로그: 버전 기록 | Plannotator"
description: "Plannotator 버전 기록과 새로운 기능을 알아보세요. 주요 업데이트, 버그 수정 및 성능 개선을 확인하고, 코드 리뷰, 이미지 주석어노테이션, Obsidian 통합 등 새로운 기능을 마스터하세요."
tags:
  - "업데이트 로그"
  - "버전 기록"
  - "새로운 기능"
  - "버그 수정"
order: 1
---

# 업데이트 로그: Plannotator 버전 기록과 새로운 기능

## 학습 후 할 수 있는 것

- ✅ Plannotator의 버전 기록과 새로운 기능 이해하기
- ✅ 각 버전의 주요 업데이트와 개선 사항 마스터하기
- ✅ 버그 수정 및 성능 최적화 이해하기

---

## 최신 버전

### v0.6.7 (2026-01-24)

**새로운 기능**:
- **Comment mode**: 계획에서 직접 댓글을 입력할 수 있는 Comment 모드 추가
- **Type-to-comment shortcut**: 댓글 내용을 직접 입력하는 단축키 지원 추가

**개선 사항**:
- OpenCode 플러그인의 sub-agent blocking 문제 수정
- prompt injection 보안 취약점 수정 (CVE)
- OpenCode에서 agent switching 지능형 감지 개선

**소스 코드 참조**:
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**수정 사항**:
- OpenCode 플러그인의 CVE 보안 취약점 수정
- sub-agent blocking 문제 수정, prompt injection 방지
- agent switching의 지능형 감지 로직 개선

**소스 코드 참조**:
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**개선 사항**:
- **Hook timeout 증가**: hook timeout을 기본값에서 4일로 증가하여 장기 실행되는 AI 계획에 적응
- **Copy 기능 수정**: copy 작업에서 newlines 유지
- **Cmd+C 단축키 추가**: Cmd+C 단축키 지원 추가

**소스 코드 참조**:
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**새로운 기능**:
- **Cmd+Enter 단축키**: Cmd+Enter (Windows: Ctrl+Enter)를 사용하여 승인 또는 피드백 제출 지원

**개선 사항**:
- 키보드 조작 경험 최적화

**소스 코드 참조**:
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (Cmd+Enter 단축키 기능은 각 컴포넌트에서 직접 구현됨)

---

### v0.6.3 (2026-01-05)

**수정 사항**:
- skip-title-generation-prompt 문제 수정

**소스 코드 참조**:
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**수정 사항**:
- OpenCode 플러그인에서 HTML 파일이 npm 패키지에 포함되지 않는 문제 수정

**소스 코드 참조**:
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**새로운 기능**:
- **Bear 통합**: 승인된 계획을 Bear 메모 앱에 자동으로 저장

**개선 사항**:
- Obsidian 통합의 태그 생성 로직 개선
- Obsidian vault 감지 메커니즘 최적화

**소스 코드 참조**:
- Bear 통합: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Obsidian 통합: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## 주요 기능 릴리스

### Code Review 기능 (2026-01)

**새로운 기능**:
- **코드 리뷰 도구**: `/plannotator-review` 명령을 실행하여 Git diff를 시각적으로 리뷰
- **행 수준 주석**: 행 번호를 클릭하여 코드 범위를 선택하고 comment/suggestion/concern 유형의 주석 추가
- **다양한 diff 뷰**: uncommitted/staged/last-commit/branch 등 다른 diff 유형 전환 지원
- **Agent 통합**: 구조화된 피드백을 AI agent에 전송하여 자동 응답 지원

**사용 방법**:
```bash
# 프로젝트 디렉토리에서 실행
/plannotator-review
```

**관련 튜토리얼**:
- [코드 리뷰 기초](../../platforms/code-review-basics/)
- [코드 주석 추가](../../platforms/code-review-annotations/)
- [Diff 뷰 전환](../../platforms/code-review-diff-types/)

**소스 코드 참조**:
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Git diff 도구: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### 이미지 주석어노테이션 기능 (2026-01)

**새로운 기능**:
- **이미지 업로드**: 계획 및 코드 리뷰에 이미지 첨부물 업로드
- **주석어노테이션 도구**: 브러시, 화살표, 원형 세 가지 주석어노테이션 도구 제공
- **시각적 주석어노테이션**: 이미지에 직접 주석어노테이션하여 리뷰 피드백 효과 향상

**관련 튜토리얼**:
- [이미지 주석어노테이션 추가](../../platforms/plan-review-images/)

**소스 코드 참조**:
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Obsidian 통합 (2025-12)

**새로운 기능**:
- **자동 vault 감지**: Obsidian vault 구성 파일 경로 자동 감지
- **자동 계획 저장**: 승인된 계획을 Obsidian에 자동으로 저장
- **Frontmatter 생성**: created, source, tags 등 frontmatter 자동 포함
- **지능형 태그 추출**: 계획 내용에서 키워드를 추출하여 태그로 사용

**구성 방법**:
추가 구성이 필요하지 않습니다. Plannotator가 Obsidian 설치 경로를 자동으로 감지합니다.

**관련 튜토리얼**:
- [Obsidian 통합](../../advanced/obsidian-integration/)

**소스 코드 참조**:
- Obsidian 감지: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Obsidian 저장: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Frontmatter 생성: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### URL 공유 기능 (2025-11)

**새로운 기능**:
- **백엔드 없는 공유**: 계획과 주석을 URL hash에 압축하여 백엔드 서버 없이 공유
- **원클릭 공유**: Export → Share as URL을 클릭하여 공유 링크 생성
- **읽기 전용 모드**: 협업자가 URL을 열면 볼 수 있지만 결정을 제출할 수 없음

**기술적 구현**:
- Deflate 압축 알고리즘 사용
- Base64 인코딩 + URL 안전 문자열 교체
- 최대 약 7개 탭까지 payload 지원

**관련 튜토리얼**:
- [URL 공유](../../advanced/url-sharing/)

**소스 코드 참조ories**:
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### 원격/Devcontainer 모드 (2025-10)

**새로운 기능**:
- **원격 모드 지원**: SSH, devcontainer, WSL 등 원격 환경에서 Plannotator 사용
- **고정 포트**: 환경 변수를 통해 고정 포트 설정
- **포트 포워딩**: 사용자가 브라우저를 수동으로 열 수 있도록 URL 자동 출력
- **브라우저 제어**: `PLANNOTATOR_BROWSER` 환경 변수로 브라우저 열기 여부 제어

**환경 변수**:
- `PLANNOTATOR_REMOTE=1`: 원격 모드 활성화
- `PLANNOTATOR_PORT=3000`: 고정 포트 설정
- `PLANNOTATOR_BROWSER=disabled`: 자동 브라우저 열기 비활성화

**관련 튜토리얼**:
- [원격/Devcontainer 모드](../../advanced/remote-mode/)
- [환경 변수 구성](../../advanced/environment-variables/)

**소스 코드 참조**:
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## 버전 호환성

| Plannotator 버전 | Claude Code | OpenCode | Bun 최소 버전 |
|--- | --- | --- | ---|
| v0.6.x           | 2.1.7+      | 1.0+     | 1.0+         |
| v0.5.x           | 2.1.0+      | 0.9+     | 0.7+         |

**업그레이드 권장 사항**:
- 최신 기능과 보안 수정을 위해 Plannotator를 최신 버전으로 유지하세요
- Claude Code와 OpenCode도 최신 버전으로 유지하세요

---

## 라이선스 변경 사항

**현재 버전(v0.6.7+)**: Business Source License 1.1 (BSL-1.1)

**라이선스 세부 정보**:
- 허용: 개인 사용, 내부 상업적 사용
- 제한: 호스팅 서비스 제공, SaaS 제품
- 자세한 내용은 [LICENSE](https://github.com/backnotprop/plannotator/blob/main/main/LICENSE) 참조

---

## 피드백 및 지원

**문제 보고**:
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**기능 제안**:
- GitHub Issues에 feature request 제출

**보안 취약점**:
- 보안 취약점은 비공개 채널을 통해 보고해주세요

---

## 다음 수업 미리보기

> Plannotator의 버전 기록과 새로운 기능을 이해했습니다.
>
> 다음으로 할 수 있는 일:
> - [빠른 시작](../../start/getting-started/)으로 돌아가 설치 및 사용 방법 학습
> - [자주 묻는 질문](../../faq/common-problems/)을 확인하여 사용 중 문제 해결
> - [API 참조](../../appendix/api-reference/)를 읽어 모든 API 엔드포인트 이해
