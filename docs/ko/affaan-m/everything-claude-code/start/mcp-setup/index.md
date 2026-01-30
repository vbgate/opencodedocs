---
title: "MCP 설정: 외부 서비스 확장 | Everything Claude Code"
sidebarTitle: "외부 서비스 연결"
subtitle: "MCP 서버 설정: Claude Code의 외부 서비스 통합 기능 확장"
description: "MCP 설정 방법을 배웁니다. 15개의 사전 구성된 서버에서 프로젝트에 적합한 서버를 선택하고, API 키와 환경 변수를 구성하며, 컨텍스트 윈도우 사용을 최적화하세요."
tags:
  - "mcp"
  - "configuration"
  - "integration"
prerequisite:
  - "start-installation"
order: 40
---
# MCP 서버 설정: Claude Code의 외부 서비스 통합 기능 확장

## 이 강의를 마치면 할 수 있는 것

- MCP가 무엇이며 Claude Code의 기능을 어떻게 확장하는지 이해
- 15개의 사전 구성된 MCP 서버 중 프로젝트에 적합한 서버 선택
- API 키와 환경 변수를 올바르게 구성
- MCP 사용을 최적화하여 컨텍스트 윈도우가 점유되지 않도록 방지

## 현재 당신의 상황

Claude Code는 기본적으로 파일 작업과 명령 실행 기능만 제공하지만, 다음과 같은 기능이 필요할 수 있습니다:

- GitHub PR 및 Issues 조회
- 웹 페이지 콘텐츠 가져오기
- Supabase 데이터베이스 작업
- 실시간 문서 조회
- 세션 간 영구적인 기억 유지

이러한 작업을 수동으로 처리하려면 도구를 자주 전환하고 복사-붙여넣기를 반복해야 하며 효율성이 떨어집니다. MCP(Model Context Protocol) 서버는 이러한 외부 서비스 통합을 자동으로 수행할 수 있습니다.

## 이 기능을 사용하는 시기

**MCP 서버를 사용하기 적합한 경우**:
- 프로젝트가 GitHub, Vercel, Supabase 등의 타사 서비스를 포함하는 경우
- 실시간 문서 조회가 필요한 경우(예: Cloudflare, ClickHouse)
- 세션 간 상태나 기억을 유지해야 하는 경우
- 웹 스크래핑이나 UI 컴포넌트 생성이 필요한 경우

**MCP가 필요 없는 경우**:
- 로컬 파일 작업만 포함하는 경우
- 외부 서비스 통합이 없는 순수 프론트엔드 개발
- 간단한 CRUD 애플리케이션으로 데이터베이스 작업이 적은 경우

## 🎒 시작 전 준비사항

구성을 시작하기 전 다음 사항을 확인하세요:

::: warning 사전 확인

- ✅ [플러그인 설치](../installation/) 완료
- ✅ 기본 JSON 구문에 익숙함
- ✅ 통합할 서비스의 API 키가 있음(GitHub PAT, Firecrawl API Key 등)
- ✅ `~/.claude.json` 구성 파일 위치를 알고 있음

:::

## 핵심 개념

### MCP란 무엇인가

**MCP(Model Context Protocol)**는 Claude Code가 외부 서비스에 연결하는 데 사용하는 프로토콜입니다. 이를 통해 AI는 GitHub, 데이터베이스, 문서 조회 등의 외부 리소스에 접근할 수 있으며, 마치 확장 기능처럼 동작합니다.

**작동 원리**:

```
Claude Code ←→ MCP Server ←→ External Service
   (로컬)        (미들웨어)         (GitHub/Supabase/...)
```

### MCP 구성 구조

각 MCP 서버 구성은 다음을 포함합니다:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",          // 시작 명령어
      "args": ["-y", "package"],  // 명령어 인자
      "env": {                   // 환경 변수
        "API_KEY": "YOUR_KEY"
      },
      "description": "기능 설명"   // 설명
    }
  }
}
```

**유형**:
- **npx 유형**: npm 패키지를 사용하여 실행(GitHub, Firecrawl 등)
- **http 유형**: HTTP 엔드포인트에 연결(Vercel, Cloudflare 등)

### 컨텍스트 윈도우 관리(중요!)

::: warning 컨텍스트 경고

활성화된 각 MCP 서버는 컨텍스트 윈도우를 점유합니다. 너무 많이 활성화하면 200K 컨텍스트가 70K로 줄어들 수 있습니다.

**골든 룰**:
- 20-30개의 MCP 서버 구성(모두 사용 가능)
- 프로젝트당 활성화 < 10개
- 활성 도구 총수 < 80

프로젝트 구성에서 필요 없는 MCP를 비활성화하려면 `disabledMcpServers`를 사용하세요.

:::

## 따라하기

### 1단계: 사용 가능한 MCP 서버 확인

Everything Claude Code는 **15개의 사전 구성된 MCP 서버**를 제공합니다:

| MCP 서버 | 유형 | 키 필요 | 용도 |
| --- | --- | --- | --- |
| **github** | npx | ✅ GitHub PAT | PR, Issues, Repos 작업 |
| **firecrawl** | npx | ✅ API Key | 웹 스크래핑 및 크롤링 |
| **supabase** | npx | ✅ Project Ref | 데이터베이스 작업 |
| **memory** | npx | ❌ | 세션 간 영구적인 기억 |
| **sequential-thinking** | npx | ❌ | 체인 추론 향상 |
| **vercel** | http | ❌ | 배포 및 프로젝트 관리 |
| **railway** | npx | ❌ | Railway 배포 |
| **cloudflare-docs** | http | ❌ | 문서 검색 |
| **cloudflare-workers-builds** | http | ❌ | Workers 빌드 |
| **cloudflare-workers-bindings** | http | ❌ | Workers 바인딩 |
| **cloudflare-observability** | http | ❌ | 로그 및 모니터링 |
| **clickhouse** | http | ❌ | 분석 쿼리 |
| **context7** | npx | ❌ | 실시간 문서 조회 |
| **magic** | npx | ❌ | UI 컴포넌트 생성 |
| **filesystem** | npx | ❌(경로 필요) | 파일 시스템 작업 |

**보게 될 것**: GitHub, 배포, 데이터베이스, 문서 조회 등 일반적인 시나리오를 다루는 15개 MCP 서버의 완전한 목록입니다.

---

### 2단계: MCP 구성을 Claude Code에 복사

소스 디렉토리에서 구성을 복사합니다:

```bash
# MCP 구성 템플릿 복사
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**이유**: 원본 구성을 백업하여 후속 참조와 비교를 용이하게 합니다.

---

### 3단계: 필요한 MCP 서버 선택

프로젝트 요구사항에 따라 필요한 MCP 서버를 선택하세요.

**예제 시나리오**:

| 프로젝트 유형 | 권장 활성화 MCP |
| --- | --- |
| **풀스택 앱**(GitHub + Supabase + Vercel) | github, supabase, vercel, memory, context7 |
| **프론트엔드 프로젝트**(Vercel + 문서 조회) | vercel, cloudflare-docs, context7, magic |
| **데이터 프로젝트**(ClickHouse + 분석) | clickhouse, sequential-thinking, memory |
| **일반 개발** | github, filesystem, memory, context7 |

**보게 될 것**: 명확한 프로젝트 유형과 MCP 서버 간의 대응 관계입니다.

---

### 4단계: `~/.claude.json` 구성 파일 편집

Claude Code 구성 파일을 엽니다:

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

`~/.claude.json`에 `mcpServers` 섹션을 추가합니다:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
      },
      "description": "GitHub 작업 - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "세션 간 영구적인 기억"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "실시간 문서 조회"
    }
  }
}
```

**이유**: 이것은 Claude Code에 어떤 MCP 서버를 시작할지 알려주는 핵심 구성입니다.

**보게 될 것**: 선택한 MCP 서버 구성을 포함하는 `mcpServers` 객체입니다.

---

### 5단계: API 키 플레이스홀더 교체

API 키가 필요한 MCP 서버의 경우 `YOUR_*_HERE` 플레이스홀더를 교체합니다:

**GitHub MCP 예제**:

1. GitHub Personal Access Token 생성:
   - https://github.com/settings/tokens 방문
   - `repo` 권한을 선택하여 새 Token 생성

2. 구성의 플레이스홀더 교체:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // 실제 Token으로 교체
  }
}
```

**다른 키가 필요한 MCP**:

| MCP | 키 이름 | 획득 주소 |
| --- | --- | --- |
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**이유**: 실제 키 없이는 MCP 서버가 외부 서비스에 연결할 수 없습니다.

**보게 될 것**: 모든 `YOUR_*_HERE` 플레이스홀더가 실제 키로 교첩니다.

---

### 6단계: 프로젝트 레벨 MCP 비활성화 구성(권장)

모든 프로젝트에서 모든 MCP를 활성화하지 않도록 프로젝트 루트에 `.claude/config.json`을 생성합니다:

```json
{
  "disabledMcpServers": [
    "supabase",      // 필요 없는 MCP 비활성화
    "railway",
    "firecrawl"
  ]
}
```

**이유**: 이를 통해 프로젝트 수준에서 어떤 MCP가 활성화되는지 유연하게 제어하여 컨텍스트 윈도우가 점유되지 않도록 방지할 수 있습니다.

**보게 될 것**: `disabledMcpServers` 배열을 포함하는 `.claude/config.json` 파일입니다.

---

### 7단계: Claude Code 재시작

구성을 적용하려면 Claude Code를 재시작합니다:

```bash
# Claude Code 중지(실행 중인 경우)
# 그런 다음 다시 시작
claude
```

**이유**: MCP 구성은 시작 시 로드되므로 재시작해야 적용됩니다.

**보게 될 것**: Claude Code 시작 후 MCP 서버가 자동으로 로드됩니다.

## 체크포인트 ✅

MCP 구성이 성공했는지 확인합니다:

1. **MCP 로드 상태 확인**:

Claude Code에서 입력:

```bash
/tool list
```

**예상 결과**: 로드된 MCP 서버와 도구 목록을 확인합니다.

2. **MCP 기능 테스트**:

GitHub MCP를 활성화한 경우, 쿼리를 테스트합니다:

```bash
# GitHub Issues 조회
@mcp list issues
```

**예상 결과**: 저장소의 Issues 목록이 반환됩니다.

3. **컨텍스트 윈도우 확인**:

`~/.claude.json`의 도구 수를 확인합니다:

```bash
jq '.mcpServers | length' ~/.claude.json
```

**예상 결과**: 활성화된 MCP 서버 수가 < 10입니다.

::: tip 디버깅 팁

MCP가 성공적으로 로드되지 않은 경우 Claude Code의 로그 파일을 확인하세요:
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## 함정 경고

### 함정 1: 너무 많은 MCP 활성화로 인한 컨텍스트 부족

**증상**: 대화 시작 시 컨텍스트 윈도우가 200K가 아닌 70K입니다.

**원인**: 각 MCP 활성화 도구는 컨텍스트 윈도우를 점유합니다.

**해결책**:
1. 활성화된 MCP 수 확인(`~/.claude.json`)
2. 프로젝트 레벨 `disabledMcpServers`를 사용하여 필요 없는 MCP 비활성화
3. 활성 도구 총수 < 80 유지

---

### 함정 2: API 키가 올바르게 구성되지 않음

**증상**: MCP 기능 호출 시 권한 오류 또는 연결 실패 메시지.

**원인**: `YOUR_*_HERE` 플레이스홀더가 교첰이 안 된 경우.

**해결책**:
1. `~/.claude.json`의 `env` 필드 확인
2. 모든 플레이스홀더가 실제 키로 교첐었는지 확인
3. 키에 충분한 권한이 있는지 확인(예: GitHub Token에는 `repo` 권한 필요)

---

### 함정 3: Filesystem MCP 경로 오류

**증상**: Filesystem MCP가 지정된 디렉토리에 접근할 수 없음.

**원인**: `args`의 경로가 실제 경로로 교첰이 안 된 경우.

**해결책**:
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"],  // 프로젝트 경로로 교체
    "description": "파일 시스템 작업"
  }
}
```

---

### 함정 4: 프로젝트 레벨 구성이 적용되지 않음

**증상**: 프로젝트 루트의 `disabledMcpServers`가 MCP를 비활성화하지 않음.

**원인**: `.claude/config.json` 경로 또는 형식 오류.

**해결책**:
1. 파일이 프로젝트 루트에 있는지 확인: `.claude/config.json`
2. JSON 형식이 올바른지 확인(`jq .`로 검증)
3. `disabledMcpServers`가 문자열 배열인지 확인

## 강의 요약

이 강의에서는 MCP 서버 구성 방법을 배웠습니다:

**핵심 포인트**:
- MCP는 Claude Code의 외부 서비스 통합 기능을 확장
- 15개의 사전 구성된 MCP 중 적합한 것을 선택(권장 < 10개)
- `YOUR_*_HERE` 플레이스홀더를 실제 API 키로 교체
- 프로젝트 레벨 `disabledMcpServers`를 사용하여 활성화 수 제어
- 활성 도구 총수 < 80 유지하여 컨텍스트 윈도우가 점유되지 않도록 방지

**다음 단계**: 이제 MCP 서버를 구성했으므로 다음 강의에서 핵심 Commands 사용 방법을 배웁니다.

## 다음 강의 예고

> 다음 강의에서 **[핵심 Commands 상세](../../platforms/commands-overview/)**를 배웁니다.
>
> 배울 내용:
> - 14개의 슬래시 명령의 기능과 사용 시나리오
> - `/plan` 명령이 구현 계획을 생성하는 방법
> - `/tdd` 명령이 테스트 주도 개발을 실행하는 방법
> - 명령을 통해 복잡한 워크플로우를 빠르게 트리거하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| MCP 구성 템플릿 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| README 중요 안내 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |
| --- | --- | --- |

**핵심 구성**:
- 15개 MCP 서버(GitHub, Firecrawl, Supabase, Memory, Sequential-thinking, Vercel, Railway, Cloudflare 시리즈, ClickHouse, Context7, Magic, Filesystem)
- 두 가지 유형 지원: npx(명령줄) 및 http(엔드포인트 연결)
- `disabledMcpServers` 프로젝트 레벨 구성을 사용하여 활성화 수 제어

**핵심 규칙**:
- 20-30개 MCP 서버 구성
- 프로젝트당 활성화 < 10개
- 활성 도구 총수 < 80
- 컨텍스트 윈도우가 200K에서 70K로 줄어들 위험

</details>
