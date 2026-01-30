---
title: "Claude Code: 설치 및 설정 | Plannotator"
sidebarTitle: "3분 설치"
subtitle: "Claude Code: 설치 및 설정"
description: "Claude Code에서 Plannotator 플러그인을 설치하는 방법을 배웁니다. 3분 만에 설정 완료, 플러그인 시스템과 수동 Hook 두 가지 방식을 지원하며, macOS, Linux, Windows 시스템과 원격 및 Devcontainer 환경 설정을 다룹니다."
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# Claude Code 플러그인 설치

## 학습 목표

- Claude Code에서 Plannotator 계획 검토 기능 활성화
- 적합한 설치 방식 선택 (플러그인 시스템 또는 수동 Hook)
- 설치 성공 여부 확인
- 원격/Devcontainer 환경에서 Plannotator 올바르게 설정

## 현재 겪고 있는 문제

Claude Code를 사용할 때, AI가 생성한 계획은 터미널에서만 읽을 수 있어 정밀한 검토와 피드백이 어렵습니다. 다음과 같은 기능이 필요합니다:
- 브라우저에서 AI 계획을 시각적으로 확인
- 계획에 대해 삭제, 교체, 삽입 등 정밀한 주석 추가
- AI에게 명확한 수정 지시를 한 번에 전달

## 이 방법이 필요한 상황

다음 상황에 적합합니다:
- Claude Code + Plannotator를 처음 사용하는 경우
- Plannotator를 재설치하거나 업그레이드해야 하는 경우
- 원격 환경(SSH, Devcontainer, WSL)에서 사용하려는 경우

## 핵심 개념

Plannotator 설치는 두 부분으로 나뉩니다:
1. **CLI 명령어 설치**: 로컬 서버와 브라우저를 시작하는 핵심 런타임
2. **Claude Code 설정**: 플러그인 시스템 또는 수동 Hook을 통해 Claude Code가 계획 완료 시 자동으로 Plannotator를 호출하도록 설정

설치가 완료되면, Claude Code가 `ExitPlanMode`를 호출할 때 자동으로 Plannotator가 실행되어 브라우저에서 계획 검토 인터페이스가 열립니다.

## 🎒 시작 전 준비

::: warning 사전 확인 사항

- [ ] Claude Code 2.1.7 이상 버전 설치 완료 (Permission Request Hooks 지원 필요)
- [ ] 터미널에서 명령어 실행 권한 보유 (Linux/macOS는 sudo 또는 home 디렉토리 설치 필요)

:::

## 따라하기

### 1단계: Plannotator CLI 명령어 설치

먼저 Plannotator 명령줄 도구를 설치합니다.

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**예상 결과**: 터미널에 설치 진행 상황이 표시되고, 완료 후 `plannotator {버전} installed to {설치경로}/plannotator` 메시지가 나타납니다.

**체크포인트 ✅**: 다음 명령어로 설치를 확인합니다:

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

Plannotator 명령어의 설치 경로가 표시되어야 합니다. 예: `/usr/local/bin/plannotator` 또는 `$HOME/.local/bin/plannotator`

### 2단계: Claude Code에 플러그인 설치

Claude Code를 열고 다음 명령어를 실행합니다:

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**예상 결과**: 플러그인 설치 성공 메시지가 표시됩니다.

::: danger 중요: Claude Code 재시작 필수

플러그인 설치 후 **반드시 Claude Code를 재시작**해야 합니다. 그렇지 않으면 Hooks가 적용되지 않습니다.

:::

### 3단계: 설치 확인

재시작 후 Claude Code에서 다음 명령어를 실행하여 코드 검토 기능을 테스트합니다:

```bash
/plannotator-review
```

**예상 결과**:
- 브라우저가 자동으로 열리며 Plannotator 코드 검토 인터페이스가 표시됨
- 터미널에 "Opening code review..." 메시지가 표시되고 검토 피드백을 기다림

위 결과가 나타나면 설치 성공입니다!

::: tip 참고
계획 검토 기능은 Claude Code가 `ExitPlanMode`를 호출할 때 자동으로 실행되므로 테스트 명령어를 수동으로 실행할 필요가 없습니다. 실제로 계획 모드를 사용할 때 이 기능을 테스트할 수 있습니다.
:::

### 4단계: (선택) 수동 Hook 설치

플러그인 시스템을 사용하지 않거나 CI/CD 환경에서 사용해야 하는 경우, Hook을 수동으로 설정할 수 있습니다.

`~/.claude/settings.json` 파일을 편집(파일이 없으면 생성)하고 다음 내용을 추가합니다:

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**필드 설명**:
- `matcher: "ExitPlanMode"` - Claude Code가 ExitPlanMode를 호출할 때 트리거
- `command: "plannotator"` - 설치된 Plannotator CLI 명령어 실행
- `timeout: 1800` - 타임아웃 시간(30분), 계획 검토에 충분한 시간 제공

**체크포인트 ✅**: 파일 저장 후 Claude Code를 재시작하고 `/plannotator-review`로 테스트합니다.

### 5단계: (선택) 원격/Devcontainer 설정

SSH, Devcontainer, WSL 등 원격 환경에서 Claude Code를 사용하는 경우, 고정 포트 설정과 브라우저 자동 열기 비활성화를 위해 환경 변수를 설정해야 합니다.

원격 환경에서 실행:

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # 포트 포워딩으로 접근할 포트 선택
```

**이 변수들의 역할**:
- 고정 포트 사용 (랜덤 포트 대신), 포트 포워딩 설정 용이
- 브라우저 자동 열기 건너뛰기 (브라우저는 로컬 머신에 있으므로)
- 터미널에 URL 출력, 로컬 브라우저에 복사하여 열기 가능

::: tip 포트 포워딩

**VS Code Devcontainer**: 포트가 보통 자동으로 포워딩됩니다. VS Code의 "Ports" 탭에서 확인하세요.

**SSH 포트 포워딩**: `~/.ssh/config`를 편집하고 다음을 추가합니다:

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## 문제 해결

### 문제 1: 설치 후 `/plannotator-review` 명령어가 응답하지 않음

**원인**: Claude Code를 재시작하지 않아 Hooks가 적용되지 않음.

**해결**: Claude Code를 완전히 종료하고 다시 엽니다.

### 문제 2: 설치 스크립트 실행 실패

**원인**: 네트워크 문제 또는 권한 부족.

**해결**:
- 네트워크 연결을 확인하고 `https://plannotator.ai`에 접근 가능한지 확인
- 권한 문제가 발생하면 설치 스크립트를 수동으로 다운로드하여 실행

### 문제 3: 원격 환경에서 브라우저가 열리지 않음

**원인**: 원격 환경에 그래픽 인터페이스가 없어 브라우저를 시작할 수 없음.

**해결**: `PLANNOTATOR_REMOTE=1` 환경 변수를 설정하고 포트 포워딩을 구성합니다.

### 문제 4: 포트가 이미 사용 중

**원인**: 고정 포트 `9999`가 다른 프로그램에서 이미 사용 중.

**해결**: 다른 사용 가능한 포트를 선택합니다. 예: `8888` 또는 `19432`.

## 이번 강의 요약

- ✅ Plannotator CLI 명령어 설치 완료
- ✅ 플러그인 시스템 또는 수동 Hook으로 Claude Code 설정 완료
- ✅ 설치 성공 여부 확인 완료
- ✅ (선택) 원격/Devcontainer 환경 설정 완료

## 다음 강의 예고

> 다음 강의에서는 **[OpenCode 플러그인 설치](../installation-opencode/)**를 배웁니다.
>
> Claude Code 대신 OpenCode를 사용하고 있다면, 다음 강의에서 OpenCode에서 유사한 설정을 완료하는 방법을 알려드립니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-24

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 설치 스크립트 진입점 | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60) | 35-60 |
| Hook 설정 설명 | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39) | 30-39 |
| 수동 Hook 예제 | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62) | 42-62 |
| 환경 변수 설정 | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79) | 73-79 |
| 원격 모드 설정 | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94) | 81-94 |

**주요 상수**:
- `PLANNOTATOR_REMOTE = "1"`: 원격 모드 활성화, 고정 포트 사용
- `PLANNOTATOR_PORT = 9999`: 원격 모드에서 사용하는 고정 포트 (기본값 19432)
- `timeout: 1800`: Hook 타임아웃 시간 (30분)

**주요 환경 변수**:
- `PLANNOTATOR_REMOTE`: 원격 모드 플래그
- `PLANNOTATOR_PORT`: 고정 포트 번호
- `PLANNOTATOR_BROWSER`: 사용자 지정 브라우저 경로

</details>
