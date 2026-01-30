---
title: "Hooks 자동화: 15개 이상의 훅 분석 | Everything Claude Code"
sidebarTitle: "Claude 자동 작업 설정"
subtitle: "Hooks 자동화: 15개 이상의 훅 심층 분석"
description: "Everything Claude Code의 15개 이상의 자동화 훅 메커니즘을 학습합니다. 6가지 Hook 유형, 14개 핵심 기능 및 Node.js 스크립트 구현을 다루는 튜토리얼입니다."
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Hooks 자동화: 15개 이상의 훅 심층 분석

## 학습 목표

- Claude Code의 6가지 Hook 유형과 트리거 메커니즘 이해
- 14개 내장 Hooks의 기능과 설정 방법 숙달
- Node.js 스크립트를 사용한 커스텀 Hooks 작성법 학습
- 세션 시작/종료 시 자동으로 컨텍스트 저장 및 로드
- 스마트 압축 제안, 코드 자동 포맷팅 등 자동화 기능 구현

## 현재 겪고 있는 문제

Claude Code가 특정 이벤트 발생 시 자동으로 작업을 수행하길 원합니다. 예를 들어:
- 세션 시작 시 이전 컨텍스트 자동 로드
- 코드 편집 후 자동 포맷팅
- 코드 푸시 전 변경사항 검토 알림
- 적절한 시점에 컨텍스트 압축 제안

하지만 이러한 기능들은 수동으로 트리거해야 하거나, Claude Code의 Hooks 시스템을 깊이 이해해야만 구현할 수 있습니다. 이 강의에서 이러한 자동화 기능을 마스터할 수 있도록 도와드리겠습니다.

## 언제 사용하면 좋을까요

- 세션 간 컨텍스트와 작업 상태를 유지해야 할 때
- 코드 품질 검사(포맷팅, TypeScript 검사)를 자동으로 실행하고 싶을 때
- 특정 작업 전에 알림을 받고 싶을 때(예: git push 전 변경사항 검토)
- 토큰 사용을 최적화하고 적절한 시점에 컨텍스트를 압축해야 할 때
- 세션에서 재사용 가능한 패턴을 자동으로 추출하고 싶을 때

## 핵심 개념

**Hooks란 무엇인가**

**Hooks**는 Claude Code가 제공하는 자동화 메커니즘으로, 특정 이벤트 발생 시 커스텀 스크립트를 트리거할 수 있습니다. 조건이 충족되면 미리 정의된 작업을 자동으로 실행하는 "이벤트 리스너"와 같습니다.

::: info Hook의 작동 원리

```
사용자 작업 → 이벤트 트리거 → Hook 검사 → 스크립트 실행 → 결과 반환
     ↓            ↓             ↓            ↓            ↓
  도구 사용   PreToolUse    조건 매칭   Node.js 스크립트   콘솔 출력
```

예를 들어, Bash 도구로 `npm run dev`를 실행할 때:
1. PreToolUse Hook이 명령 패턴을 감지
2. tmux 내부가 아니면 자동으로 차단하고 안내 메시지 표시
3. 안내를 확인한 후 올바른 방법으로 시작

:::

**6가지 Hook 유형**

Everything Claude Code는 6가지 Hook 유형을 사용합니다:

| Hook 유형 | 트리거 시점 | 사용 사례 |
| --- | --- | --- |
| **PreToolUse** | 모든 도구 실행 전 | 명령 검증, 작업 차단, 제안 표시 |
| **PostToolUse** | 모든 도구 실행 후 | 자동 포맷팅, 타입 검사, 로그 기록 |
| **PreCompact** | 컨텍스트 압축 전 | 상태 저장, 압축 이벤트 기록 |
| **SessionStart** | 새 세션 시작 시 | 컨텍스트 로드, 패키지 매니저 감지 |
| **SessionEnd** | 세션 종료 시 | 상태 저장, 세션 평가, 패턴 추출 |
| **Stop** | 각 응답 종료 시 | 수정된 파일 검사, 정리 알림 |

::: tip Hook 실행 순서

완전한 세션 생명주기에서 Hooks는 다음 순서로 실행됩니다:

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

`[PreToolUse → PostToolUse]`는 도구를 사용할 때마다 반복 실행됩니다.

:::

**Hooks 매칭 규칙**

각 Hook은 `matcher` 표현식을 사용하여 실행 여부를 결정합니다. Claude Code는 JavaScript 표현식을 사용하며 다음을 검사할 수 있습니다:

- 도구 유형: `tool == "Bash"`, `tool == "Edit"`
- 명령 내용: `tool_input.command matches "npm run dev"`
- 파일 경로: `tool_input.file_path matches "\\.ts$"`
- 조합 조건: `tool == "Bash" && tool_input.command matches "git push"`

**왜 Node.js 스크립트를 사용하는가**

Everything Claude Code의 모든 Hooks는 Shell 스크립트가 아닌 Node.js 스크립트로 구현되어 있습니다. 그 이유는:

| 장점 | Shell 스크립트 | Node.js 스크립트 |
| --- | --- | --- |
| **크로스 플랫폼** | ❌ Windows/macOS/Linux 분기 필요 | ✅ 자동 크로스 플랫폼 |
| **JSON 처리** | ❌ 추가 도구(jq) 필요 | ✅ 네이티브 지원 |
| **파일 작업** | ⚠️ 명령이 복잡함 | ✅ fs API가 간결함 |
| **에러 처리** | ❌ 수동 구현 필요 | ✅ try/catch 네이티브 지원 |

## 따라하기

### 1단계: 현재 Hooks 설정 확인

**왜 필요한가**
기존 Hooks 설정을 파악하여 어떤 자동화 기능이 이미 활성화되어 있는지 확인

```bash
## hooks.json 설정 확인
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**예상 결과**: 6가지 Hook 유형 정의가 포함된 JSON 설정 파일

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### 2단계: PreToolUse Hooks 이해하기

**왜 필요한가**
PreToolUse는 가장 많이 사용되는 Hook 유형으로, 작업을 차단하거나 안내를 제공할 수 있습니다

Everything Claude Code의 5개 PreToolUse Hooks를 살펴보겠습니다:

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**기능**: tmux 외부에서 dev server 시작 차단

**왜 필요한가**: tmux에서 dev server를 실행하면 세션을 분리할 수 있어, Claude Code를 닫아도 로그를 계속 확인할 수 있습니다

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**기능**: `git push` 전에 변경사항 검토 알림

**왜 필요한가**: 검토하지 않은 코드를 실수로 커밋하는 것을 방지

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**기능**: 문서 외 .md 파일 생성 차단

**왜 필요한가**: 문서가 분산되는 것을 방지하고 프로젝트를 깔끔하게 유지

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**기능**: 파일 편집 또는 작성 시 컨텍스트 압축 제안

**왜 필요한가**: 적절한 시점에 수동 압축하여 컨텍스트를 간결하게 유지

### 3단계: PostToolUse Hooks 이해하기

**왜 필요한가**
PostToolUse는 작업 완료 후 자동으로 실행되며, 자동화된 품질 검사에 적합합니다

Everything Claude Code에는 4개의 PostToolUse Hooks가 있습니다:

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**기능**: .js/.ts/.jsx/.tsx 파일 편집 후 자동으로 Prettier 포맷팅 실행

**왜 필요한가**: 일관된 코드 스타일 유지

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**기능**: .ts/.tsx 파일 편집 후 자동으로 TypeScript 타입 검사 실행

**왜 필요한가**: 타입 오류 조기 발견

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**기능**: 파일 편집 후 console.log 문이 있는지 검사

**왜 필요한가**: 디버그 코드 커밋 방지

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**기능**: PR 생성 후 자동으로 PR URL과 리뷰 명령어 출력

**왜 필요한가**: 새로 생성된 PR에 빠르게 접근

### 4단계: 세션 생명주기 Hooks 이해하기

**왜 필요한가**
SessionStart와 SessionEnd Hook은 세션 간 컨텍스트 영속화에 사용됩니다

#### SessionStart Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**기능**:
- 최근 7일간의 세션 파일 확인
- 학습된 skills 확인
- 패키지 매니저 감지
- 로드 가능한 컨텍스트 정보 출력

**스크립트 로직**(`session-start.js`):

```javascript
// 최근 7일간의 세션 파일 확인
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// 학습된 skills 확인
const learnedSkills = findFiles(learnedDir, '*.md');

// 패키지 매니저 감지
const pm = getPackageManager();

// 기본값 사용 시 선택 안내
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### SessionEnd Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**기능**:
- 세션 파일 생성 또는 업데이트
- 세션 시작 및 종료 시간 기록
- 세션 템플릿 생성(Completed, In Progress, Notes)

**세션 파일 템플릿**(`session-end.js`):

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
[relevant files]
```

템플릿의 `[Session context goes here]`와 `[relevant files]`는 플레이스홀더로, 실제 세션 내용과 관련 파일을 직접 입력해야 합니다.

### 5단계: 압축 관련 Hooks 이해하기

**왜 필요한가**
PreCompact와 Stop Hook은 컨텍스트 관리 및 압축 결정에 사용됩니다

#### PreCompact Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**기능**:
- 압축 이벤트를 로그에 기록
- 활성 세션 파일에 압축 발생 시간 표시

**스크립트 로직**(`pre-compact.js`):

```javascript
// 압축 이벤트 기록
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// 세션 파일에 표시
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Stop Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**기능**: 수정된 모든 파일에서 console.log 확인

**왜 필요한가**: 디버그 코드 커밋을 방지하는 최후의 방어선

### 6단계: 지속적 학습 Hook 이해하기

**왜 필요한가**
Evaluate Session Hook은 세션에서 재사용 가능한 패턴을 추출합니다

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**기능**:
- 세션 기록(transcript) 읽기
- 사용자 메시지 수 집계
- 세션 길이가 충분하면(기본값 > 10개 메시지) 추출 가능한 패턴 평가 안내

**스크립트 로직**(`evaluate-session.js`):

```javascript
// 설정 읽기
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// 사용자 메시지 집계
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// 짧은 세션 건너뛰기
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// 평가 안내
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### 7단계: 커스텀 Hook 만들기

**왜 필요한가**
프로젝트 요구사항에 맞는 자체 자동화 규칙 생성

**예시: 프로덕션 환경에서 위험한 명령 차단**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**설정 단계**:

1. 커스텀 Hook 스크립트 생성:
   ```bash
   # scripts/hooks/custom-hook.js 생성
   vi scripts/hooks/custom-hook.js
   ```

2. `~/.claude/settings.json` 편집:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. Claude Code 재시작

**예상 결과**: Hook 트리거 시 출력 메시지 확인

## 체크포인트 ✅

다음 핵심 사항을 이해했는지 확인하세요:

- [ ] Hook은 이벤트 기반 자동화 메커니즘이다
- [ ] Claude Code에는 6가지 Hook 유형이 있다
- [ ] PreToolUse는 도구 실행 전에 트리거되며 작업을 차단할 수 있다
- [ ] PostToolUse는 도구 실행 후에 트리거되며 자동화 검사에 적합하다
- [ ] SessionStart/SessionEnd는 세션 간 컨텍스트 영속화에 사용된다
- [ ] Everything Claude Code는 크로스 플랫폼 호환성을 위해 Node.js 스크립트를 사용한다
- [ ] `~/.claude/settings.json`을 수정하여 커스텀 Hooks를 추가할 수 있다

## 주의사항

### ❌ Hook 스크립트 오류로 세션 멈춤

**문제**: Hook 스크립트가 예외를 던진 후 올바르게 종료되지 않아 Claude Code가 타임아웃 대기

**원인**: Node.js 스크립트의 오류가 올바르게 캐치되지 않음

**해결**:
```javascript
// 잘못된 예시
main();  // 예외 발생 시 문제 유발

// 올바른 예시
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // 오류가 발생해도 정상 종료
});
```

### ❌ Shell 스크립트로 인한 크로스 플랫폼 문제

**문제**: Windows에서 실행 시 Shell 스크립트 실패

**원인**: Shell 명령이 다른 운영체제에서 호환되지 않음

**해결**: Shell 스크립트 대신 Node.js 스크립트 사용

| 기능 | Shell 스크립트 | Node.js 스크립트 |
| --- | --- | --- |
| 파일 읽기 | `cat file.txt` | `fs.readFileSync('file.txt')` |
| 디렉토리 확인 | `[ -d dir ]` | `fs.existsSync(dir)` |
| 환경 변수 | `$VAR` | `process.env.VAR` |

### ❌ Hook 출력 과다로 컨텍스트 팽창

**문제**: 매 작업마다 대량의 디버그 정보 출력으로 컨텍스트가 빠르게 팽창

**원인**: Hook 스크립트에서 console.log를 과도하게 사용

**해결**:
- 필요한 정보만 출력
- `console.error`로 중요한 안내 출력(Claude Code에서 하이라이트 표시)
- 조건부 출력으로 필요할 때만 출력

```javascript
// 잘못된 예시
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // 출력 과다

// 올바른 예시
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUse Hook이 필요한 작업을 차단

**문제**: Hook의 매칭 규칙이 너무 광범위하여 정상 작업을 잘못 차단

**원인**: matcher 표현식이 시나리오를 정확하게 매칭하지 않음

**해결**:
- matcher 표현식의 정확성 테스트
- 더 많은 조건을 추가하여 트리거 범위 제한
- 명확한 오류 메시지와 해결 방법 제공

```json
// 잘못된 예시: 모든 npm 명령 매칭
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// 올바른 예시: dev 명령만 매칭
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## 이번 강의 요약

**6가지 Hook 유형 요약**:

| Hook 유형 | 트리거 시점 | 대표적 용도 | Everything Claude Code 개수 |
| --- | --- | --- | --- |
| PreToolUse | 도구 실행 전 | 검증, 차단, 안내 | 5개 |
| PostToolUse | 도구 실행 후 | 포맷팅, 검사, 기록 | 4개 |
| PreCompact | 컨텍스트 압축 전 | 상태 저장 | 1개 |
| SessionStart | 새 세션 시작 | 컨텍스트 로드, PM 감지 | 1개 |
| SessionEnd | 세션 종료 | 상태 저장, 세션 평가 | 2개 |
| Stop | 응답 종료 | 수정 사항 검사 | 1개 |

**핵심 포인트**:

1. **Hook은 이벤트 기반**: 특정 이벤트 발생 시 자동 실행
2. **Matcher가 트리거 결정**: JavaScript 표현식으로 조건 매칭
3. **Node.js 스크립트 구현**: 크로스 플랫폼 호환, Shell 스크립트 회피
4. **에러 처리 중요**: 스크립트 오류 시에도 정상 종료 필요
5. **출력은 간결하게**: 과도한 로그로 인한 컨텍스트 팽창 방지
6. **settings.json에서 설정**: `~/.claude/settings.json` 수정으로 커스텀 Hook 추가

**모범 사례**:

```
1. PreToolUse로 위험한 작업 검증
2. PostToolUse로 품질 검사 자동화
3. SessionStart/End로 컨텍스트 영속화
4. 커스텀 Hook 작성 시 matcher 표현식 먼저 테스트
5. 스크립트에서 try/catch와 process.exit(0) 사용
6. 필요한 정보만 출력하여 컨텍스트 팽창 방지
```

## 다음 강의 예고

> 다음 강의에서는 **[지속적 학습 메커니즘](../continuous-learning/)**을 배웁니다.
>
> 배울 내용:
> - Continuous Learning이 재사용 가능한 패턴을 자동으로 추출하는 방법
> - `/learn` 명령으로 수동 패턴 추출
> - 세션 평가의 최소 길이 설정
> - learned skills 디렉토리 관리

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-25

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| Hooks 메인 설정 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart 스크립트 | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd 스크립트 | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact 스크립트 | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact 스크립트 | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session 스크립트 | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| 유틸리티 라이브러리 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| 패키지 매니저 감지 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**주요 상수**:
- 없음(설정은 동적으로 로드)

**주요 함수**:
- `getSessionsDir()`: 세션 디렉토리 경로 가져오기
- `getLearnedSkillsDir()`: learned skills 디렉토리 경로 가져오기
- `findFiles(dir, pattern, options)`: 파일 찾기, 시간 기준 필터링 지원
- `ensureDir(path)`: 디렉토리 존재 확인, 없으면 생성
- `getPackageManager()`: 패키지 매니저 감지(6가지 우선순위 지원)
- `log(message)`: Hook 로그 메시지 출력

**주요 설정**:
- `min_session_length`: 세션 평가 최소 메시지 수(기본값 10)
- `COMPACT_THRESHOLD`: 압축 제안 도구 호출 임계값(기본값 50)
- `CLAUDE_PLUGIN_ROOT`: 플러그인 루트 디렉토리 환경 변수

**14개 핵심 Hooks**:
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
