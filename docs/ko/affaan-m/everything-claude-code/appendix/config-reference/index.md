---
title: "설정 파일 상세 가이드: settings.json 완전 참조 | Everything Claude Code"
sidebarTitle: "모든 설정 커스터마이징"
subtitle: "설정 파일 상세 가이드 settings.json 완전 참조"
description: "Everything Claude Code의 완전한 설정 옵션을 학습합니다. Hooks 자동화, MCP 서버 및 플러그인 설정을 마스터하고, 설정 충돌을 빠르게 해결하세요."
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "start-installation"
  - "start-mcp-setup"
order: 190
---

# 설정 파일 상세 가이드: settings.json 완전 참조

## 학습 목표

- `~/.claude/settings.json`의 모든 설정 옵션을 완전히 이해
- Hooks 자동화 워크플로우 커스터마이징
- MCP 서버 설정 및 관리
- 플러그인 매니페스트 및 경로 설정 수정
- 설정 충돌 및 장애 해결

## 현재 겪고 있는 문제

Everything Claude Code를 사용하면서 이런 문제를 겪고 계신가요:
- "왜 특정 Hook이 트리거되지 않을까?"
- "MCP 서버 연결이 실패하는데, 설정이 어디가 잘못됐지?"
- "특정 기능을 커스터마이징하고 싶은데, 어떤 설정 파일을 수정해야 하지?"
- "여러 설정 파일이 서로 덮어쓰는데, 우선순위가 어떻게 되지?"

이 튜토리얼에서 완전한 설정 참조 매뉴얼을 제공합니다.

## 핵심 개념

Claude Code의 설정 시스템은 세 단계로 나뉘며, 우선순위는 높은 것부터 낮은 순으로:

1. **프로젝트 레벨 설정** (`.claude/settings.json`) - 현재 프로젝트에만 적용
2. **전역 설정** (`~/.claude/settings.json`) - 모든 프로젝트에 적용
3. **플러그인 내장 설정** (Everything Claude Code의 기본 설정)

::: tip 설정 우선순위
설정은 **덮어쓰기**가 아닌 **병합**됩니다. 프로젝트 레벨 설정은 전역 설정의 동일한 이름의 옵션을 덮어쓰지만, 다른 옵션은 유지됩니다.
:::

설정 파일은 JSON 형식을 사용하며, Claude Code Settings Schema를 따릅니다:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

이 schema는 자동 완성과 유효성 검사를 제공하므로, 항상 포함하는 것을 권장합니다.

## 설정 파일 구조

### 완전한 설정 템플릿

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning JSON 문법 규칙
- 모든 키 이름과 문자열 값은 **큰따옴표**로 감싸야 합니다
- 마지막 키-값 쌍 뒤에 **쉼표를 넣지 마세요**
- 주석은 표준 JSON 문법이 아니므로, `"_comments"` 필드를 대신 사용하세요
:::

## Hooks 설정 상세 가이드

Hooks는 Everything Claude Code의 핵심 자동화 메커니즘으로, 특정 이벤트에서 트리거되는 자동화 스크립트를 정의합니다.

### Hook 유형과 트리거 시점

| Hook 유형 | 트리거 시점 | 용도 |
| --- | --- | --- |
| `SessionStart` | Claude Code 세션 시작 시 | 컨텍스트 로드, 패키지 매니저 감지 |
| `SessionEnd` | Claude Code 세션 종료 시 | 세션 상태 저장, 패턴 추출 평가 |
| `PreToolUse` | 도구 호출 전 | 명령 검증, 위험한 작업 차단 |
| `PostToolUse` | 도구 호출 후 | 코드 포맷팅, 타입 검사 |
| `PreCompact` | 컨텍스트 압축 전 | 상태 스냅샷 저장 |
| `Stop` | 매 AI 응답 종료 시 | console.log 등 문제 검사 |

### Hook 설정 구조

각 Hook 항목은 다음 필드를 포함합니다:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Hook 설명 (선택사항)"
}
```

#### matcher 필드

트리거 조건을 정의하며, 다음 변수를 지원합니다:

| 변수 | 의미 | 예시 값 |
| --- | --- | --- |
| `tool` | 도구 이름 | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Bash 명령 내용 | `"npm run dev"` |
| `tool_input.file_path` | Write/Edit의 파일 경로 | `"/path/to/file.ts"` |

**매칭 연산자**:

```javascript
// 동등 비교
tool == "Bash"

// 정규식 매칭
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// 논리 연산
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### hooks 배열

실행할 동작을 정의하며, 두 가지 유형을 지원합니다:

**Type 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` 플러그인 루트 디렉토리 변수
- 명령은 프로젝트 루트 디렉토리에서 실행됩니다
- 표준 JSON 형식 출력은 Claude Code로 전달됩니다

**Type 2: prompt** (이 설정에서는 사용되지 않음)

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### 완전한 Hooks 설정 예시

Everything Claude Code는 15개 이상의 사전 설정된 Hooks를 제공합니다. 다음은 완전한 설정 설명입니다:

#### PreToolUse Hooks

**1. Tmux Dev Server Block**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**용도**: 개발 서버를 tmux에서 실행하도록 강제하여 로그 접근을 보장합니다.

**매칭 명령**:
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Tmux Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Consider running in tmux for session persistence');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**용도**: 장시간 실행되는 명령에 tmux 사용을 권장합니다.

**매칭 명령**:
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Git Push Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**용도**: 푸시 전 변경 사항 검토를 권장합니다.

**4. Block Random MD Files**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOCKED: Unnecessary documentation file creation');console.error('[Hook] File: '+p);console.error('[Hook] Use README.md for documentation instead');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**용도**: 임의의 .md 파일 생성을 차단하여 문서를 통합 관리합니다.

**허용되는 파일**:
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggest Compact**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**용도**: 논리적 간격에서 수동 컨텍스트 압축을 제안합니다.

#### SessionStart Hook

**Load Previous Context**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**용도**: 이전 세션 컨텍스트를 로드하고 패키지 매니저를 감지합니다.

#### PostToolUse Hooks

**1. Log PR URL**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] To review: gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**용도**: PR 생성 후 URL을 기록하고 리뷰 명령을 제공합니다.

**2. Auto Format**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**용도**: Prettier를 사용하여 JS/TS 파일을 자동 포맷팅합니다.

**3. TypeScript Check**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**용도**: TypeScript 파일 편집 후 타입 검사를 실행합니다.

**4. Console.log Warning**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] WARNING: console.log found in '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Remove console.log before committing')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**용도**: 파일 내 console.log 문을 감지하고 경고합니다.

#### Stop Hook

**Check Console.log in Modified Files**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=>/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Remove console.log statements before committing')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**용도**: 수정된 파일에서 console.log를 검사합니다.

#### PreCompact Hook

**Save State Before Compaction**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**용도**: 컨텍스트 압축 전 상태를 저장합니다.

#### SessionEnd Hooks

**1. Persist Session State**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**용도**: 세션 상태를 영구 저장합니다.

**2. Evaluate Session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**용도**: 재사용 가능한 패턴을 추출하기 위해 세션을 평가합니다.

### 커스텀 Hooks

다음 방법으로 Hooks를 커스터마이징할 수 있습니다:

#### 방법 1: settings.json 수정

```bash
# 전역 설정 편집
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Your custom hook')\""
          }
        ],
        "description": "Your custom hook"
      }
    ]
  }
}
```

#### 방법 2: 프로젝트 레벨 설정 오버라이드

프로젝트 루트 디렉토리에 `.claude/settings.json` 생성:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_custom_command\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Project-specific hook')\""
          }
        ]
      }
    ]
  }
}
```

::: tip 프로젝트 레벨 설정의 장점
- 전역 설정에 영향을 주지 않음
- 특정 프로젝트에서만 적용
- 버전 관리에 커밋 가능
:::

## MCP 서버 설정 상세 가이드

MCP(Model Context Protocol) 서버는 Claude Code의 외부 서비스 통합 기능을 확장합니다.

### MCP 설정 구조

```json
{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "your_value"
      },
      "description": "Server description"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "HTTP server description"
    }
  }
}
```

### MCP 서버 유형

#### 유형 1: npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub operations - PRs, issues, repos"
  }
}
```

**필드 설명**:
- `command`: 실행 명령, 일반적으로 `npx`
- `args`: 인수 배열, `-y`는 설치 자동 확인
- `env`: 환경 변수 객체
- `description`: 설명 텍스트

#### 유형 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**필드 설명**:
- `type`: 반드시 `"http"`
- `url`: 서버 URL
- `description`: 설명 텍스트

### Everything Claude Code 사전 설정 MCP 서버

다음은 모든 사전 설정된 MCP 서버 목록입니다:

| 서버명 | 유형 | 설명 | 설정 필요 |
| --- | --- | --- | --- |
| `github` | npx | GitHub 작업 (PR, Issues, Repos) | GitHub PAT |
| `firecrawl` | npx | 웹 스크래핑 및 크롤링 | Firecrawl API Key |
| `supabase` | npx | Supabase 데이터베이스 작업 | Project Ref |
| `memory` | npx | 세션 간 영구 메모리 | 없음 |
| `sequential-thinking` | npx | 체인 추론 | 없음 |
| `vercel` | http | Vercel 배포 및 프로젝트 관리 | 없음 |
| `railway` | npx | Railway 배포 | 없음 |
| `cloudflare-docs` | http | Cloudflare 문서 검색 | 없음 |
| `cloudflare-workers-builds` | http | Cloudflare Workers 빌드 | 없음 |
| `cloudflare-workers-bindings` | http | Cloudflare Workers 바인딩 | 없음 |
| `cloudflare-observability` | http | Cloudflare 로그 및 모니터링 | 없음 |
| `clickhouse` | http | ClickHouse 분석 쿼리 | 없음 |
| `context7` | npx | 실시간 문서 조회 | 없음 |
| `magic` | npx | Magic UI 컴포넌트 | 없음 |
| `filesystem` | npx | 파일 시스템 작업 | 경로 설정 |

### MCP 서버 추가

#### 사전 설정에서 추가

1. `mcp-configs/mcp-servers.json`에서 서버 설정 복사
2. `~/.claude/settings.json`에 붙여넣기

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

3. `YOUR_*_HERE` 플레이스홀더를 실제 값으로 교체

#### 커스텀 MCP 서버 추가

```json
{
  "mcpServers": {
    "my_custom_server": {
      "command": "npx",
      "args": ["-y", "@your-org/your-server"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "description": "Custom MCP server"
    }
  }
}
```

### MCP 서버 비활성화

`disabledMcpServers` 배열을 사용하여 특정 서버를 비활성화합니다:

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning 컨텍스트 윈도우 경고
너무 많은 MCP 서버를 활성화하면 컨텍스트 윈도우를 많이 차지합니다. **10개 미만**의 MCP 서버를 활성화하는 것을 권장합니다.
:::

## 플러그인 설정 상세 가이드

### plugin.json 구조

`.claude-plugin/plugin.json`은 플러그인 매니페스트 파일로, 플러그인 메타데이터와 컴포넌트 경로를 정의합니다.

```json
{
  "name": "everything-claude-code",
  "description": "Complete collection of battle-tested Claude Code configs",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `name` | string | Y | 플러그인 이름 |
| `description` | string | Y | 플러그인 설명 |
| `author.name` | string | Y | 작성자 이름 |
| `author.url` | string | N | 작성자 홈페이지 URL |
| `homepage` | string | N | 플러그인 홈페이지 |
| `repository` | string | N | 저장소 URL |
| `license` | string | N | 라이선스 |
| `keywords` | string[] | N | 키워드 배열 |
| `commands` | string | Y | 명령 디렉토리 경로 |
| `skills` | string | Y | 스킬 디렉토리 경로 |

### 플러그인 경로 수정

컴포넌트 경로를 커스터마이징해야 하는 경우, `plugin.json`을 수정합니다:

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## 기타 설정 파일

### package-manager.json

패키지 매니저 설정으로, 프로젝트 레벨과 전역 레벨을 지원합니다:

```json
{
  "packageManager": "pnpm"
}
```

**위치**:
- 전역: `~/.claude/package-manager.json`
- 프로젝트: `.claude/package-manager.json`

### marketplace.json

플러그인 마켓플레이스 매니페스트로, `/plugin marketplace add` 명령에 사용됩니다:

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

상태 표시줄 설정 예시:

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## 설정 파일 병합과 우선순위

### 병합 전략

설정 파일은 다음 순서로 병합됩니다 (나중 것이 우선):

1. 플러그인 내장 설정
2. 전역 설정 (`~/.claude/settings.json`)
3. 프로젝트 설정 (`.claude/settings.json`)

**예시**:

```json
// 플러그인 내장
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// 전역 설정
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// 프로젝트 설정
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// 최종 병합 결과 (프로젝트 설정 우선)
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C가 A와 B를 덮어씀
  }
}
```

::: warning 주의사항
- **동일한 이름의 배열은 완전히 덮어쓰기**되며, 추가되지 않습니다
- 프로젝트 설정에서는 덮어쓰기가 필요한 부분만 정의하는 것을 권장합니다
- 전체 설정을 확인하려면 `/debug config` 명령을 사용하세요
:::

### 환경 변수 설정

`settings.json`에서 환경 변수를 정의합니다:

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip 보안 알림
- 환경 변수는 설정 파일에 노출됩니다
- 설정 파일에 민감한 정보를 저장하지 마세요
- 시스템 환경 변수나 `.env` 파일을 사용하여 비밀 키를 관리하세요
:::

## 일반적인 설정 문제 해결

### 문제 1: Hook이 트리거되지 않음

**가능한 원인**:
1. Matcher 표현식 오류
2. Hook 설정 형식 오류
3. 설정 파일이 올바르게 저장되지 않음

**해결 단계**:

```bash
# 설정 문법 검사
cat ~/.claude/settings.json | python -m json.tool

# Hook 로드 확인
# Claude Code에서 실행
/debug config
```

**일반적인 수정**:

```json
// ❌ 오류: 작은따옴표
{
  "matcher": "tool == 'Bash'"
}

// ✅ 정확: 큰따옴표
{
  "matcher": "tool == \"Bash\""
}
```

### 문제 2: MCP 서버 연결 실패

**가능한 원인**:
1. 환경 변수 미설정
2. 네트워크 문제
3. 서버 URL 오류

**해결 단계**:

```bash
# MCP 서버 테스트
npx @modelcontextprotocol/server-github --help

# 환경 변수 확인
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**일반적인 수정**:

```json
// ❌ 오류: 환경 변수 이름 오류
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // GITHUB_PERSONAL_ACCESS_TOKEN이어야 함
  }
}

// ✅ 정확
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### 문제 3: 설정 충돌

**증상**: 일부 설정 항목이 적용되지 않음

**원인**: 프로젝트 레벨 설정이 전역 설정을 덮어씀

**해결 방법**:

```bash
# 프로젝트 설정 확인
cat .claude/settings.json

# 전역 설정 확인
cat ~/.claude/settings.json

# 프로젝트 설정 삭제 (필요 없는 경우)
rm .claude/settings.json
```

### 문제 4: JSON 형식 오류

**증상**: Claude Code가 설정을 읽지 못함

**해결 도구**:

```bash
# jq로 검증
cat ~/.claude/settings.json | jq '.'

# Python으로 검증
cat ~/.claude/settings.json | python -m json.tool

# 온라인 도구 사용
# https://jsonlint.com/
```

**일반적인 오류**:

```json
// ❌ 오류: 끝에 쉼표
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ 오류: 작은따옴표
{
  "description": 'Hooks configuration'
}

// ❌ 오류: 주석
{
  "hooks": {
    // This is a comment
  }
}

// ✅ 정확
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## 이번 강의 요약

이번 강의에서는 Everything Claude Code의 완전한 설정 체계를 체계적으로 설명했습니다:

**핵심 개념**:
- 설정은 세 단계로 나뉨: 프로젝트 레벨, 전역 레벨, 플러그인 레벨
- 설정 우선순위: 프로젝트 > 전역 > 플러그인
- JSON 형식이 엄격하므로, 큰따옴표와 문법에 주의

**Hooks 설정**:
- 6가지 Hook 유형, 15개 이상의 사전 설정 Hook
- Matcher 표현식으로 트리거 조건 정의
- 커스텀 Hook 및 프로젝트 레벨 오버라이드 지원

**MCP 서버**:
- 두 가지 유형: npx와 http
- 15개 이상의 사전 설정 서버
- 비활성화 및 커스터마이징 지원

**플러그인 설정**:
- plugin.json으로 플러그인 메타데이터 정의
- 커스텀 컴포넌트 경로 지원
- marketplace.json은 플러그인 마켓플레이스용

**기타 설정**:
- package-manager.json: 패키지 매니저 설정
- statusline.json: 상태 표시줄 설정
- environmentVariables: 환경 변수 정의

**일반적인 문제**:
- Hook이 트리거되지 않음 → matcher와 JSON 형식 확인
- MCP 연결 실패 → 환경 변수와 네트워크 확인
- 설정 충돌 → 프로젝트 레벨과 전역 레벨 설정 확인
- JSON 형식 오류 → jq 또는 온라인 도구로 검증

## 다음 강의 예고

> 다음 강의에서는 **[Rules 완전 참조: 8가지 규칙 세트 상세 가이드](../rules-reference/)**를 학습합니다.
>
> 배우게 될 내용:
> - Security 규칙: 민감한 데이터 유출 방지
> - Coding Style 규칙: 코드 스타일과 모범 사례
> - Testing 규칙: 테스트 커버리지와 TDD 요구사항
> - Git Workflow 규칙: 커밋 규칙과 PR 프로세스
> - 프로젝트 요구사항에 맞게 규칙 세트 커스터마이징 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| Hooks 설정 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| 플러그인 매니페스트 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| MCP 서버 설정 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| 플러그인 마켓플레이스 매니페스트 | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | - |

**주요 Hook 스크립트**:
- `session-start.js`: 세션 시작 시 컨텍스트 로드
- `session-end.js`: 세션 종료 시 상태 저장
- `suggest-compact.js`: 수동 컨텍스트 압축 제안
- `pre-compact.js`: 압축 전 상태 저장
- `evaluate-session.js`: 세션 평가 및 패턴 추출

**주요 환경 변수**:
- `CLAUDE_PLUGIN_ROOT`: 플러그인 루트 디렉토리
- `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub API 인증
- `FIRECRAWL_API_KEY`: Firecrawl API 인증

</details>
