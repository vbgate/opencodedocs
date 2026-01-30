---
title: "패키지 매니저 설정: 자동 감지 | Everything Claude Code"
sidebarTitle: "통합 프로젝트 명령"
subtitle: "패키지 매니저 설정: 자동 감지 | Everything Claude Code"
description: "패키지 매니저 자동 감지 설정 방법을 학습하세요. 6단계 우선순위 메커니즘을 이해하고, npm/pnpm/yarn/bun을 지원하며, 다중 프로젝트 명령을 통합합니다."
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# 패키지 매니저 설정: 자동 감지 및 커스텀

## 이 수업을 마치면 할 수 있는 것

- ✅ 현재 프로젝트에서 사용하는 패키지 매니저 자동 감지 (npm/pnpm/yarn/bun)
- ✅ 6단계 감지 우선순위 메커니즘 이해
- ✅ 전역 및 프로젝트 레벨에서 패키지 매니저 설정
- ✅ `/setup-pm` 명령으로 빠른 설정
- ✅ 다중 프로젝트 환경에서 서로 다른 패키지 매니저 처리

## 지금 당신이 겪는 문제

프로젝트가 점점 많아지고, 일부는 npm을, 일부는 pnpm을, 또 다른 일부는 yarn이나 bun을 사용합니다. 매번 Claude Code에서 명령을 입력할 때마다 기억해야 합니다:

- 이 프로젝트는 `npm install`을 사용하나요 아니면 `pnpm install`을 사용하나요?
- `npx`, `pnpm dlx`, `bunx` 중 어떤 것을 사용해야 하나요?
- 스크립트는 `npm run dev`, `pnpm dev`, `bun run dev` 중 어떤 것을 사용해야 하나요?

한 번이라도 틀리면 명령이 오류를 내며 시간을 낭비하게 됩니다.

## 이 기술을 사용해야 할 때

- **새 프로젝트 시작 시**: 사용할 패키지 매니저를 결정한 후 즉시 설정
- **프로젝트 전환 시**: 현재 감지가 올바른지 검증
- **팀 협업 시**: 모든 팀원이 동일한 명령 스타일을 사용하도록 보장
- **다중 패키지 매니저 환경**: 전역 설정 + 프로젝트 오버라이드로 유연하게 관리

::: tip 왜 패키지 매니저를 설정해야 하나요?
Everything Claude Code의 hooks와 agents는 패키지 매니저 관련 명령을 자동으로 생성합니다. 감지가 잘못되면 모든 명령이 잘못된 도구를 사용하게 되어 작업이 실패합니다.
:::

## 🎒 시작하기 전 준비

::: warning 전제 조건 확인
이 수업을 시작하기 전, [설치 가이드](../../installation/)를 완료했는지 확인하세요. 플러그인이 Claude Code에 올바르게 설치되어 있어야 합니다.
:::

시스템에 패키지 매니저가 설치되어 있는지 확인하세요:

```bash
# 설치된 패키지 매니저 확인
which npm pnpm yarn bun

# 또는 Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

다음과 유사한 출력을 본다면 설치된 것입니다:

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

특정 패키지 매니저를 찾을 수 없다면 먼저 설치해야 합니다 (이 수업에서는 설치 방법을 다루지 않습니다).

## 핵심 개념

Everything Claude Code는 **스마트 감지 메커니즘**을 사용하여 6단계 우선순위로 패키지 매니저를 자동 선택합니다. 한 번 가장 적합한 곳에만 설정하면 모든 시나리오에서 올바르게 작동합니다.

### 감지 우선순위 (높음에서 낮음으로)

```
1. 환경 변수 CLAUDE_PACKAGE_MANAGER  ─── 최우선, 임시 오버라이드
2. 프로젝트 설정 .claude/package-manager.json  ─── 프로젝트 레벨 오버라이드
3. package.json의 packageManager 필드  ─── 프로젝트 규격
4. Lock 파일 (pnpm-lock.yaml 등)  ─── 자동 감지
5. 전역 설정 ~/.claude/package-manager.json  ─── 전역 기본값
6. Fallback: 순서대로 첫 번째 사용 가능한 것 찾기  ─── 안전장치
```

### 왜 이런 순서를 사용하나요?

- **환경 변수 최우선**: 임시 전환에 편리함 (예: CI/CD 환경)
- **프로젝트 설정 그 다음**: 동일한 프로젝트에서 강제 통일
- **package.json 필드**: Node.js 표준 규격
- **Lock 파일**: 프로젝트에서 실제로 사용하는 파일
- **전역 설정**: 개인 기본 선호도
- **Fallback**: 항상 사용 가능한 도구 보장

## 따라 해보기

### 1단계: 현재 설정 감지

**왜 하는가**
현재 감지 상태를 이해하고, 수동 설정이 필요한지 확인합니다.

```bash
# 현재 패키지 매니저 감지
node scripts/setup-package-manager.js --detect
```

**보게 될 출력**:

```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

표시된 패키지 매니저가 예상과 일치한다면, 감지가 올바른 것이며 수동 설정이 필요하지 않습니다.

### 2단계: 전역 기본 패키지 매니저 설정

**왜 하는가**
모든 프로젝트에 대한 전역 기본값을 설정하여 반복적인 설정을 줄입니다.

```bash
# 전역 기본값을 pnpm으로 설정
node scripts/setup-package-manager.js --global pnpm
```

**보게 될 출력**:

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

생성된 설정 파일 확인:

```bash
cat ~/.claude/package-manager.json
```

**보게 될 출력**:

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

### 3단계: 프로젝트 레벨 패키지 매니저 설정

**왜 하는가**
특정 프로젝트는 특정 패키지 매니저가 필요할 수 있습니다 (예: 특정 기능에 의존하는 경우). 프로젝트 레벨 설정은 전역 설정을 오버라이드합니다.

```bash
# 현재 프로젝트를 bun으로 설정
node scripts/setup-package-manager.js --project bun
```

**보게 될 출력**:

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

생성된 설정 파일 확인:

```bash
cat .claude/package-manager.json
```

**보게 될 출력**:

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip 프로젝트 vs 전역 설정
- **전역 설정**: ~/.claude/package-manager.json, 모든 프로젝트에 영향
- **프로젝트 설정**: .claude/package-manager.json, 현재 프로젝트에만 영향, 더 높은 우선순위
:::

### 4단계: /setup-pm 명령 사용 (선택사항)

**왜 하는가**
스크립트를 수동으로 실행하고 싶지 않다면, Claude Code에서 슬래시 명령을 사용할 수 있습니다.

Claude Code에서 입력:

```
/setup-pm
```

Claude Code는 스크립트를 호출하고 상호작용 옵션을 표시합니다.

**유사한 감지 출력**을 보게 될 것입니다:

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```

### 5단계: 감지 로직 검증

**왜 하는가**
감지 우선순위를 이해하면 다양한 상황에서 결과를 예측할 수 있습니다.

몇 가지 시나리오를 테스트해보겠습니다:

**시나리오 1: Lock 파일 감지**

```bash
# 프로젝트 설정 삭제
rm .claude/package-manager.json

# 감지
node scripts/setup-package-manager.js --detect
```

**보게 될 것입니다** `Source: lock-file` (lock 파일이 존재하는 경우)

**시나리오 2: package.json 필드**

```bash
# package.json에 추가
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# 감지
node scripts/setup-package-manager.js --detect
```

**보게 될 것입니다** `From package.json: pnpm@8.6.0`

**시나리오 3: 환경 변수 오버라이드**

```bash
# 임시 환경 변수 설정
export CLAUDE_PACKAGE_MANAGER=yarn

# 감지
node scripts/setup-package-manager.js --detect
```

**보게 될 것입니다** `Source: environment` 그리고 `Package Manager: yarn`

```bash
# 환경 변수 제거
unset CLAUDE_PACKAGE_MANAGER
```

## 체크포인트 ✅

다음 체크포인트가 모두 통과하는지 확인하세요:

- [ ] `--detect` 명령을 실행하면 현재 패키지 매니저가 올바르게 식별됨
- [ ] 전역 설정 파일이 생성됨: `~/.claude/package-manager.json`
- [ ] 프로젝트 설정 파일이 생성됨 (필요한 경우): `.claude/package-manager.json`
- [ ] 다양한 우선순위의 오버라이드 관계가 예상대로 작동함
- [ ] 나열된 사용 가능한 패키지 매니저가 실제 설치된 것과 일치함

## 자주 발생하는 문제

### ❌ 오류 1: 설정했지만 적용되지 않음

**현상**: `pnpm`을 설정했는데 감지 결과가 `npm`으로 표시됨.

**원인**:
- Lock 파일이 전역 설정보다 높은 우선순위를 가짐 (lock 파일이 존재하는 경우)
- package.json의 `packageManager` 필드도 전역 설정보다 높은 우선순위를 가짐

**해결**:
```bash
# 감지 소스 확인
node scripts/setup-package-manager.js --detect

# lock file이나 package.json인 경우, 이러한 파일 확인
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ 오류 2: 존재하지 않는 패키지 매니저 설정

**현상**: `bun`을 설정했지만 시스템에 설치되지 않음.

**감지 결과**에 다음과 같이 표시됨:

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← 주목: current로 표시되었지만 설치되지 않음
```

**해결**: 먼저 패키지 매니저를 설치하거나, 다른 설치된 것으로 설정하세요.

```bash
# 사용 가능한 패키지 매니저 감지
node scripts/setup-package-manager.js --list

# 설치된 것으로 전환
node scripts/setup-package-manager.js --global npm
```

### ❌ 오류 3: Windows 경로 문제

**현상**: Windows에서 스크립트를 실행할 때 파일을 찾을 수 없다는 오류.

**원인**: Node.js 스크립트 경로 구분자 문제 (소스 코드에서 이미 처리됨, 하지만 올바른 명령 사용 필요).

**해결**: PowerShell이나 Git Bash를 사용하고 경로가 올바른지 확인하세요:

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ 오류 4: 프로젝트 설정이 다른 프로젝트에 영향을 줌

**현상**: 프로젝트 A에 `bun`을 설정했는데, 프로젝트 B로 전환한 후에도 여전히 `bun`을 사용함.

**원인**: 프로젝트 설정은 현재 프로젝트 디렉토리에서만 적용되며, 디렉토리를 전환하면 다시 감지됩니다.

**해결**: 이것은 정상적인 동작입니다. 프로젝트 설정은 현재 프로젝트에만 영향을 주며 다른 프로젝트를 오염시키지 않습니다.

## 수업 요약

Everything Claude Code의 패키지 매니저 감지 메커니즘은 매우 스마트합니다:

- **6단계 우선순위**: 환경 변수 > 프로젝트 설정 > package.json > lock 파일 > 전역 설정 > fallback
- **유연한 설정**: 전역 기본값과 프로젝트 오버라이드 지원
- **자동 감지**: 대부분의 경우 수동 설정 필요 없음
- **명령 통합**: 설정 후 모든 hooks와 agents가 올바른 명령을 사용

**권장 설정 전략**:

1. 가장 많이 사용하는 패키지 매니저로 전역 설정 (예: `pnpm`)
2. 특수 프로젝트는 프로젝트 레벨에서 오버라이드 (예: `bun`의 성능에 의존하는 경우)
3. 다른 경우는 자동 감지에 맡기기

## 다음 수업 예고

> 다음 수업에서는 **[MCP 서버 설정](../../mcp-setup/)**을 학습합니다.
>
> 배울 내용:
> - 15개 이상의 사전 구성된 MCP 서버를 설정하는 방법
> - MCP 서버가 Claude Code의 기능을 확장하는 방법
> - MCP 서버의 활성화 상태 및 Token 사용량 관리 방법

---

## 부록: 소스 코드 참고

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 패키지 매니저 감지 핵심 로직 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236) | 157-236 |
| Lock 파일 감지 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102) | 92-102 |
| package.json 감지 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126) | 107-126 |
| 패키지 매니저 정의 (설정) | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54) | 13-54 |
| 감지 우선순위 정의 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57) | 57 |
| 전역 설정 저장 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252) | 241-252 |
| 프로젝트 설정 저장 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272) | 257-272 |
| 명령줄 스크립트 진입점 | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206) | 158-206 |
| 감지 명령 구현 | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95) | 62-95 |

**핵심 상수**:
- `PACKAGE_MANAGERS`: 지원하는 패키지 매니저 및 명령 설정 (13-54행)
- `DETECTION_PRIORITY`: 감지 우선순위 순서 `['pnpm', 'bun', 'yarn', 'npm']` (57행)

**핵심 함수**:
- `getPackageManager()`: 핵심 감지 로직, 우선순위에 따라 패키지 매니저 반환 (157-236행)
- `detectFromLockFile()`: lock 파일에서 패키지 매니저 감지 (92-102행)
- `detectFromPackageJson()`: package.json에서 패키지 매니저 감지 (107-126행)
- `setPreferredPackageManager()`: 전역 설정 저장 (241-252행)
- `setProjectPackageManager()`: 프로젝트 설정 저장 (257-272행)

**감지 우선순위 구현** (소스 157-236행):
```javascript
function getPackageManager(options = {}) {
  // 1. 환경 변수 (최우선)
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. 프로젝트 설정
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. package.json 필드
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Lock 파일
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. 전역 설정
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback: 우선순위에 따라 첫 번째 사용 가능한 것 찾기
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // 기본 npm
  return { name: 'npm', source: 'default' };
}
```

</details>
