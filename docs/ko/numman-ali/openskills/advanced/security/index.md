---
title: "보안 보호: 경로 순회 및 심볼릭 링크 | OpenSkills"
sidebarTitle: "경로 순회 방지"
subtitle: "보안 보호: 경로 순회 및 심볼릭 링크 | OpenSkills"
description: "OpenSkills의 3층 보안 보호 메커니즘을 배웁니다. 경로 순회 보호, 심볼릭 링크 안전한 처리, YAML 파싱 보안에 대해 알아보고 스킬 설치와 사용의 보안성을 보장하세요."
tags:
  - "보안성"
  - "경로 순회"
  - "심볼릭 링크"
  - "YAML"
prerequisite:
  - "advanced-ci-integration"
order: 7
---

# OpenSkills 보안 안내

## 배우기 전 알아두기

- OpenSkills의 3층 보안 보호 메커니즘을 이해할 수 있습니다
- 경로 순회 공격의 원리와 보호 방법을 알 수 있습니다
- 심볼릭 링크의 안전한 처리 방식을 익힙니다
- YAML 파싱에서의 ReDoS 위험과 보호 조치를 인식합니다

## 당신의 현재 어려움

"로컬에서 실행하면 더 안전하다"는 말을 들어봤을 것입니다. 하지만 구체적인 보안 조치들은 무엇인지 모를 수 있습니다. 또는 스킬을 설치할 때 이런 걱정이 들 수 있습니다:
- 파일을 시스템 디렉터리에 쓰지는 않을까?
- 심볼릭 링크가 보안 위험을 초래하진 않을까?
- SKILL.md의 YAML 파싱에 취약점이 있지 않을까?

## 이 기술을 언제 사용하나요

다음과 같은 경우에 사용합니다:
- 기업 환경에 OpenSkills를 배포할 때
- OpenSkills의 보안을 감사할 때
- 보안 관점에서 스킬 관리 방안을 평가할 때
- 보안 팀의 기술 심사에 대응할 때

## 핵심 개념

OpenSkills의 보안 설계는 3가지 원칙을 따릅니다:

::: info 3층 보안 보호
1. **입력 검증** - 모든 외부 입력(경로, URL, YAML)을 검사
2. **격리 실행** - 작업이 예상 디렉터리 내에서 실행되도록 보장
3. **안전한 파싱** - 파서 취약점(ReDoS) 방지
:::

로컬 실행 + 데이터 업로드 없음 + 입력 검증 + 경로 격리 = 안전한 스킬 관리

## 경로 순회 방호

### 경로 순회 공격이란

**경로 순회(Path Traversal)** 공격은 공격자가 `../` 등의 시퀀스를 사용하여 예상 디렉터리 외부의 파일에 접근하는 것을 의미합니다.

**예시**: 보호 조치 없이 공격자는 다음을 시도할 수 있습니다:
```bash
# 시스템 디렉터리에 설치 시도
openskills install malicious/skill --target ../../../etc/

# 설정 파일 덮어쓰기 시도
openskills install malicious/skill --target ../../../../.ssh/
```

### OpenSkills의 보호 메커니즘

OpenSkills는 `isPathInside` 함수를 사용하여 설치 경로가 대상 디렉터리 내에 있는지 검증합니다.

**소스 위치**: [`src/commands/install.ts:71-78`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78)

```typescript
function isPathInside(targetPath: string, targetDir: string): boolean {
  const resolvedTargetPath = resolve(targetPath);
  const resolvedTargetDir = resolve(targetDir);
  const resolvedTargetDirWithSep = resolvedTargetDir.endsWith(sep)
    ? resolvedTargetDir
    : resolvedTargetDir + sep;
  return resolvedTargetPath.startsWith(resolvedTargetDirWithSep);
}
```

**작동 원리**:
1. `resolve()`를 사용하여 모든 상대 경로를 절대 경로로 변환
2. 대상 디렉터리를 정규화하여 경로 구분자로 끝나도록 함
3. 대상 경로가 대상 디렉터리로 시작하는지 확인

**설치 시 검증**([`src/commands/install.ts:257-260`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260)):
```typescript
if (!isPathInside(targetPath, targetDir)) {
  console.error(chalk.red('보안 오류: 설치 경로가 대상 디렉터리 밖입니다'));
  process.exit(1);
}
```

### 보호 효과 검증

**테스트 시나리오**: 경로 순회 공격 시도

```bash
# 정상 설치(성공)
openskills install anthropics/skills

# ../ 사용 시도(실패)
openskills install malicious/skill --target ../../../etc/
# 보안 오류: 설치 경로가 대상 디렉터리 밖입니다
```

**확인해야 할 사항**: 대상 디렉터리 밖으로 나가려는 설치는 모두 거부되며 보안 오류가 표시됩니다.

## 심볼릭 링크 보안

### 심볼릭 링크의 위험

**심볼릭 링크(Symbolic Link)**는 다른 파일이나 디렉터리를 가리키는 바로가기입니다. 제대로 처리하지 않으면 다음과 같은 문제가 발생할 수 있습니다:

1. **정보 유출** - 공격자가 민감한 파일을 가리키는 심볼릭 링크 생성
2. **파일 덮어쓰기** - 심볼릭 링크가 시스템 파일을 가리켜 덮어쓰기 발생
3. **순환 참조** - 심볼릭 링크가 자신을 가리켜 무한 재귀 발생

### 설치 시 역참조

OpenSkills는 파일 복사 시 `dereference: true`를 사용하여 심볼릭 링크를 역참조하고 실제 파일을 복사합니다.

**소스 위치**: [`src/commands/install.ts:262`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262)

```typescript
cpSync(skillDir, targetPath, { recursive: true, dereference: true });
```

**역할**:
- 심볼릭 링크가 실제 파일로 대체됨
- 심볼릭 링크 자체가 복사되지 않음
- 심볼릭 링크가 가리키는 파일이 덮어써지지 않음

### 스킬 찾기 시 심볼릭 링크 검사

OpenSkills는 심볼릭 링크 형태의 스킬을 지원하지만 손상 여부를 검사합니다.

**소스 위치**: [`src/utils/skills.ts:10-25`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync가 심볼릭 링크를 따라감
      return stats.isDirectory();
    } catch {
      // 손상된 심볼릭 링크 또는 권한 오류
      return false;
    }
  }
  return false;
}
```

**보안 특성**:
- `statSync()`를 사용하여 심볼릭 링크를 따라 대상 검사
- 손상된 심볼릭 링크는 건너뜀(`catch` 블록)
- 충돌 없이 조용히 처리됨

::: tip 사용 시나리오
심볼릭 링크 지원을 통해 다음을 할 수 있습니다:
- git 저장소에서 직접 스킬 사용(복사 필요 없음)
- 로컬 개발 시 변경 사항 동기화
- 여러 프로젝트에서 스킬 라이브러리 공유
:::

## YAML 파싱 보안

### ReDoS 위험

**정규표현식 거부 서비스(ReDoS)**는 악의적으로 구성된 입력이 정규표현식의 지수적 일치 시간을 유발하여 CPU 리소스를 소모하는 것을 의미합니다.

OpenSkills는 SKILL.md의 YAML 프론트매터를 파싱해야 합니다:
```yaml
---
name: skill-name
description: Skill description
---
```

### 비탐욕적 정규표현식 보호

OpenSkills는 ReDoS를 피하기 위해 비탐욕적 정규표현식을 사용합니다.

**소스 위치**: [`src/utils/yaml.ts:4`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4)

```typescript
export function extractYamlField(content: string, field: string): string {
  const match = content.match(new RegExp(`^${field}:\\s*(.+?)$`, 'm'));
  return match ? match[1].trim() : '';
}
```

**핵심 포인트**:
- `+?`는 **비탐욕적** 수량사로 가장 짧은 일치만 함
- `^`와 `$`는 행의 시작과 끝을 고정
- 단일 행만 일치시켜 복잡한 중첩 회피

**잘못된 예시(탐욕적 일치)**:
```typescript
// ❌ 위험: +는 탐욕적 일치로 백트래킹 폭발 가능
new RegExp(`^${field}:\\s*(.+)$`, 'm')
```

**올바른 예시(비탐욕적 일치)**:
```typescript
// ✅ 안전: +? 비탐욕적, 첫 번째 줄바꿈에서 중지
new RegExp(`^${field}:\\s*(.+?)$`, 'm')
```

## 파일 권한 및 소스 검증

### 시스템 권한 상속

OpenSkills는 파일 권한을 직접 관리하지 않고 운영체제의 권한 제어를 상속합니다:

- 파일 소유자는 OpenSkills를 실행하는 사용자와 동일
- 디렉터리 권한은 시스템 umask 설정을 따름
- 권한 관리는 파일 시스템에서 일원화하여 제어

### 비공개 저장소의 소스 검증

비공개 git 저장소에서 설치할 때 OpenSkills는 git의 SSH 키 검증에 의존합니다.

**소스 위치**: [`src/commands/install.ts:167`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167)

::: tip 제안
SSH 키가 올바르게 구성되었는지 확인하고 git 서버의 인증 키 목록에 추가되었는지 확인하세요.
:::

## 로컬 실행의 보안성

OpenSkills는 순수 로컬 도구로 git 저장소 클론 외에는 네트워크 통신이 없습니다:

### 데이터 업로드 없음

| 작업 | 데이터 흐름 |
|---|---|
| 스킬 설치 | Git 저장소 → 로컬 |
| 스킬 읽기 | 로컬 → 표준 출력 |
| AGENTS.md 동기화 | 로컬 → 로컬 파일 |
| 스킬 업데이트 | Git 저장소 → 로컬 |

### 프라이버시 보호

- 모든 스킬 파일은 로컬에 저장
- AI 에이전트는 로컬 파일 시스템을 통해 읽음
- 클라우드 의존성이나 원격 측정 수집 없음

::: info Marketplace와의 차이점
OpenSkills는 Anthropic Marketplace에 의존하지 않고 완전히 로컬에서 실행됩니다.
:::

## 수업 요약

OpenSkills의 3층 보안 보호:

| 보안 계층 | 보호 조치 | 소스 위치 |
|---|---|---|
| **경로 순회 보호** | `isPathInside()`로 경로가 대상 디렉터리 내에 있는지 검증 | `install.ts:71-78` |
| **심볼릭 링크 보안** | `dereference: true`로 심볼릭 링크 역참조 | `install.ts:262` |
| **YAML 파싱 보안** | 비탐욕적 정규표현식 `+?`로 ReDoS 방지 | `yaml.ts:4` |

**기억하세요**:
- 경로 순회 공격은 `../` 시퀀스를 통해 예상 디렉터리 외부의 파일에 접근
- 심볼릭 링크는 정보 유출 및 파일 덮어쓰기를 방지하기 위해 역참조되거나 검사되어야 함
- YAML 파싱은 ReDoS를 피하기 위해 비탐욕적 정규표현식을 사용
- 로컬 실행 + 데이터 업로드 없음 = 더 높은 프라이버시 보안

## 다음 수업 예고

> 다음 수업에서는 **[모범 사례](../best-practices/)**를 배웁니다.
>
> 배울 내용:
> - 프로젝트 설정의 모범 사례
> - 스킬 관리의 팀 협업 방안
> - 다중 에이전트 환경 사용 팁
> - 일반적인 함정과 회피 방법

---

## 부록: 소스 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|---|---|---|
| 경로 순회 보호 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L71-L78) | 71-78 |
| 설치 경로 검사 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L257-L260) | 257-260 |
| 심볼릭 링크 역참조 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L262) | 262 |
| 업데이트 경로 검사 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts#L156-L172) | 156-172 |
| 심볼릭 링크 검사 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25) | 10-25 |
| YAML 파싱 보안 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts#L4) | 4 |

**주요 함수**:
- `isPathInside(targetPath, targetDir)`: 대상 경로가 대상 디렉터리 내에 있는지 검증(경로 순회 방지)
- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`: 디렉터리 또는 디렉터리를 가리키는 심볼릭 링크인지 검사
- `extractYamlField(content, field)`: 비탐욕적 정규표현식을 사용하여 YAML 필드 추출(ReDoS 방지)

**업데이트 로그**:
- [`CHANGELOG.md:64-68`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md#L64-L68) - v1.5.0 보안 업데이트 안내

</details>
