---
title: "MCP 연결 실패: 설정 문제 해결 | Everything Claude Code"
sidebarTitle: "MCP 연결 문제 해결"
subtitle: "MCP 연결 실패: 설정 문제 해결"
description: "MCP 서버 연결 문제 해결 방법을 학습합니다. API 키 오류, 컨텍스트 윈도우 부족, 서버 타입 설정 오류 등 6가지 일반적인 문제와 체계적인 해결 방법을 제공합니다."
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# 자주 발생하는 문제 해결: MCP 연결 실패

## 현재 겪고 있는 문제

MCP 서버를 설정한 후 다음과 같은 문제가 발생할 수 있습니다:

- ❌ Claude Code에서 "Failed to connect to MCP server" 오류 표시
- ❌ GitHub/Supabase 관련 명령이 작동하지 않음
- ❌ 컨텍스트 윈도우가 갑자기 줄어들고 도구 호출이 느려짐
- ❌ Filesystem MCP가 파일에 접근하지 못함
- ❌ 활성화된 MCP 서버가 너무 많아 시스템이 느려짐

걱정하지 마세요. 이러한 문제들은 모두 명확한 해결책이 있습니다. 이 강의에서는 MCP 연결 문제를 체계적으로 해결하는 방법을 알려드립니다.

---

## 일반적인 문제 1: API 키 미설정 또는 유효하지 않음

### 증상

GitHub, Firecrawl 등의 MCP 서버를 사용하려고 할 때 Claude Code에서 다음과 같은 오류가 표시됩니다:

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

또는

```
Failed to connect to MCP server: Authentication failed
```

### 원인

MCP 설정 파일의 `YOUR_*_HERE` 플레이스홀더가 실제 API 키로 교체되지 않았습니다.

### 해결 방법

**1단계: 설정 파일 확인**

`~/.claude.json`을 열고 해당 MCP 서버의 설정을 찾습니다:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← 여기를 확인하세요
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**2단계: 플레이스홀더 교체**

`YOUR_GITHUB_PAT_HERE`를 실제 API 키로 교체합니다:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**3단계: 주요 MCP 서버의 키 발급 위치**

| MCP 서버 | 환경 변수명 | 발급 위치 |
| --- | --- | --- |
| GitHub | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl | `FIRECRAWL_API_KEY` | Firecrawl Dashboard → API Keys |
| Supabase | 프로젝트 참조 | Supabase Dashboard → Settings → API |

**예상 결과**: Claude Code를 재시작하면 관련 도구가 정상적으로 호출됩니다.

### 주의사항

::: danger 보안 주의
실제 API 키가 포함된 설정 파일을 Git 저장소에 커밋하지 마세요. `~/.claude.json`이 `.gitignore`에 포함되어 있는지 확인하세요.
:::

---

## 일반적인 문제 2: 컨텍스트 윈도우 부족

### 증상

- 도구 호출 목록이 갑자기 짧아짐
- Claude에서 "Context window exceeded" 오류 표시
- 응답 속도가 눈에 띄게 느려짐

### 원인

너무 많은 MCP 서버가 활성화되어 컨텍스트 윈도우가 점유되었습니다. 프로젝트 README에 따르면, **200k 컨텍스트 윈도우가 너무 많은 MCP 활성화로 인해 70k로 줄어들 수 있습니다**.

### 해결 방법

**1단계: 활성화된 MCP 수 확인**

`~/.claude.json`의 `mcpServers` 섹션을 확인하고 활성화된 서버 수를 파악합니다.

**2단계: `disabledMcpServers`로 불필요한 서버 비활성화**

프로젝트 레벨 설정(`~/.claude/settings.json` 또는 프로젝트의 `.claude/settings.json`)에 다음을 추가합니다:

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**3단계: 모범 사례 준수**

README의 권장 사항에 따르면:

- 설정 파일에 20-30개의 MCP 서버 정의
- 프로젝트당 10개 미만의 MCP 서버 활성화
- 활성 도구 수 80개 미만 유지

**예상 결과**: 도구 목록이 정상 길이로 복구되고 응답 속도가 향상됩니다.

### 주의사항

::: tip 실전 팁
프로젝트 유형에 따라 다른 MCP 조합을 활성화하는 것이 좋습니다. 예를 들어:
- 웹 프로젝트: GitHub, Firecrawl, Memory, Context7
- 데이터 프로젝트: Supabase, ClickHouse, Sequential-thinking
:::

---

## 일반적인 문제 3: 서버 타입 설정 오류

### 증상

```
Failed to start MCP server: Command not found
```

또는

```
Failed to connect: Invalid server type
```

### 원인

`npx`와 `http` 두 가지 MCP 서버 타입을 혼동했습니다.

### 해결 방법

**1단계: 서버 타입 확인**

`mcp-configs/mcp-servers.json`을 확인하고 두 가지 타입을 구분합니다:

**npx 타입** (`command`와 `args` 필요):
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**http 타입** (`url` 필요):
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**2단계: 설정 수정**

| MCP 서버 | 올바른 타입 | 올바른 설정 |
| --- | --- | --- |
| GitHub | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel | http | `type: "http"`, `url: "https://mcp.vercel.com"` |
| Cloudflare Docs | http | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"` |
| Memory | npx | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**예상 결과**: 재시작 후 MCP 서버가 정상적으로 시작됩니다.

---

## 일반적인 문제 4: Filesystem MCP 경로 설정 오류

### 증상

- Filesystem 도구가 어떤 파일에도 접근하지 못함
- "Path not accessible" 또는 "Permission denied" 오류 표시

### 원인

Filesystem MCP의 경로 매개변수가 실제 프로젝트 경로로 교체되지 않았습니다.

### 해결 방법

**1단계: 설정 확인**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**2단계: 실제 경로로 교체**

운영 체제에 따라 경로를 교체합니다:

**macOS/Linux**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**3단계: 권한 확인**

설정된 경로에 대한 읽기/쓰기 권한이 있는지 확인합니다.

**예상 결과**: Filesystem 도구가 지정된 경로의 파일에 정상적으로 접근하고 조작할 수 있습니다.

### 주의사항

::: warning 주의 사항
- `~` 기호를 사용하지 말고 전체 경로를 사용하세요
- Windows 경로의 백슬래시는 `\\`로 이스케이프해야 합니다
- 경로 끝에 불필요한 구분자가 없는지 확인하세요
:::

---

## 일반적인 문제 5: Supabase 프로젝트 참조 미설정

### 증상

Supabase MCP 연결 실패, "Missing project reference" 오류 표시.

### 원인

Supabase MCP의 `--project-ref` 매개변수가 설정되지 않았습니다.

### 해결 방법

**1단계: 프로젝트 참조 가져오기**

Supabase Dashboard에서:
1. 프로젝트 설정으로 이동
2. "Project Reference" 또는 "API" 섹션 찾기
3. 프로젝트 ID 복사 (형식: `xxxxxxxxxxxxxxxx`)

**2단계: 설정 업데이트**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**예상 결과**: Supabase 도구가 데이터베이스를 정상적으로 쿼리할 수 있습니다.

---

## 일반적인 문제 6: npx 명령을 찾을 수 없음

### 증상

```
Failed to start MCP server: npx: command not found
```

### 원인

시스템에 Node.js가 설치되지 않았거나 npx가 PATH에 없습니다.

### 해결 방법

**1단계: Node.js 버전 확인**

```bash
node --version
```

**2단계: Node.js 설치 (없는 경우)**

[nodejs.org](https://nodejs.org/)에서 최신 LTS 버전을 다운로드하여 설치합니다.

**3단계: npx 확인**

```bash
npx --version
```

**예상 결과**: npx 버전 번호가 정상적으로 표시됩니다.

---

## 문제 해결 플로우차트

MCP 문제가 발생하면 다음 순서로 확인하세요:

```
1. API 키가 설정되어 있는지 확인
   ↓ (설정됨)
2. 활성화된 MCP 수가 10개 미만인지 확인
   ↓ (수량 정상)
3. 서버 타입 확인 (npx vs http)
   ↓ (타입 정확)
4. 경로 매개변수 확인 (Filesystem, Supabase)
   ↓ (경로 정확)
5. Node.js와 npx가 사용 가능한지 확인
   ↓ (사용 가능)
문제 해결 완료!
```

---

## 이번 강의 요약

MCP 연결 문제는 대부분 설정과 관련이 있습니다. 다음 핵심 사항을 기억하세요:

- ✅ **API 키**: 모든 `YOUR_*_HERE` 플레이스홀더 교체
- ✅ **컨텍스트 관리**: 10개 미만의 MCP 활성화, `disabledMcpServers`로 불필요한 서버 비활성화
- ✅ **서버 타입**: npx와 http 타입 구분
- ✅ **경로 설정**: Filesystem과 Supabase는 구체적인 경로/참조 설정 필요
- ✅ **환경 의존성**: Node.js와 npx 사용 가능 여부 확인

문제가 여전히 해결되지 않으면 `~/.claude/settings.json`과 프로젝트 레벨 설정 간의 충돌이 있는지 확인하세요.

---



## 다음 강의 예고

> 다음 강의에서는 **[Agent 호출 실패 문제 해결](../troubleshooting-agents/)**을 학습합니다.
>
> 배우게 될 내용:
> - Agent 미로드 및 설정 오류 해결 방법
> - 도구 권한 부족 해결 전략
> - Agent 실행 타임아웃 및 예상과 다른 출력 진단

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| MCP 설정 파일 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91 |
| 컨텍스트 윈도우 경고 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 67-75 |

**주요 설정**:
- `mcpServers.mcpServers.*.command`: npx 타입 서버의 시작 명령
- `mcpServers.mcpServers.*.args`: 시작 매개변수
- `mcpServers.mcpServers.*.env`: 환경 변수 (API 키)
- `mcpServers.mcpServers.*.type`: 서버 타입 ("npx" 또는 "http")
- `mcpServers.mcpServers.*.url`: http 타입 서버의 URL

**중요 주석**:
- `mcpServers._comments.env_vars`: `YOUR_*_HERE` 플레이스홀더 교체
- `mcpServers._comments.disabling`: `disabledMcpServers`로 서버 비활성화
- `mcpServers._comments.context_warning`: 컨텍스트 윈도우 유지를 위해 10개 미만의 MCP 활성화

</details>
