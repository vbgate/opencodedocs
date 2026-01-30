

## 따라하기

### 1단계: 권장 방법 - AI 에이전트 설치(사용자 친화적)

**이유**
이것이 공식적으로 권장하는 설치 방법으로, AI 에이전트가 자동으로 구성을 완료하므로 인간이 단계를 놓치는 것을 방지합니다.

**작업**

AI 대화 인터페이스(Claude Code, AmpCode, Cursor 등)를 열고 다음 프롬프트를 입력하세요:

```bash
다음 가이드를 참조하여 oh-my-opencode을 설치 및 구성해주세요:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**예상 결과**
AI 에이전트가:
1. 구독 상황 묻기(Claude, OpenAI, Gemini, GitHub Copilot 등)
2. 설치 명령 자동 실행
3. Provider 인증 구성
4. 설치 결과 검증
5. 완료 여부 알림

::: tip AI 에이전트 테스트 구호
AI 에이전트는 설치 완료 후 "oMoMoMoMo..."라는 테스트 구호로 완료 여부를 확인합니다.
:::

### 2단계: 수동 설치 - CLI 대화형 설치기 사용

**이유**
설치 과정을 완전히 제어하거나 AI 에이전트 설치가 실패할 때 사용합니다.

::: code-group

```bash [Bun 사용(권장)]
bunx oh-my-opencode install
```

```bash [npm 사용]
npx oh-my-opencode install
```

:::

> **참고**: CLI는 플랫폼에 맞는 독립 실행형 바이너리를 자동 다운로드하며, 설치 후에는 Bun/Node.js 런타임이 필요 없습니다.
>
> **지원 플랫폼**: macOS (ARM64, x64), Linux (x64, ARM64, Alpine/musl), Windows (x64)

**예상 결과**
설치기가 다음 질문을 합니다:

```
oMoMoMoMo... Install

[?] Do you have a Claude Pro/Max Subscription? (Y/n)
[?] Are you on max20 (20x mode)? (Y/n)
[?] Do you have an OpenAI/ChatGPT Plus Subscription? (Y/n)
[?] Will you integrate Gemini models? (Y/n)
[?] Do you have a GitHub Copilot Subscription? (Y/n)
[?] Do you have access to OpenCode Zen (opencode/ models)? (Y/n)
[?] Do you have a Z.ai Coding Plan subscription? (Y/n)

Configuration Summary
────────────────────────────────────────────────

  [OK] Claude (max20)
  [OK] OpenAI/ChatGPT (GPT-5.2 for Oracle)
  [OK] Gemini
  [OK] GitHub Copilot (fallback)
  ○ OpenCode Zen (opencode/ models)
  ○ Z.ai Coding Plan (Librarian/Multimodal)

────────────────────────────────────────────────

Model Assignment

  [i] Models auto-configured based on provider priority
  * Priority: Native > Copilot > OpenCode Zen > Z.ai

✓ Plugin registered in opencode.json
✓ Configuration written to ~/.config/opencode/oh-my-opencode.json
✓ Auth setup hints displayed

[!] Please configure authentication for your providers:

1. Anthropic (Claude): Run 'opencode auth login' → Select Anthropic
2. Google (Gemini): Run 'opencode auth login' → Select Google → Choose OAuth with Google (Antigravity)
3. GitHub (Copilot): Run 'opencode auth login' → Select GitHub

Done! 🎉
```

### 3단계: Provider 인증 구성

#### 3.1 Claude (Anthropic) 인증

**이유**
Sisyphus 메인 에이전트는 Opus 4.5 모델을 강력하게 권장하므로 먼저 인증해야 합니다.

**작업**

```bash
opencode auth login
```

그런 다음 다음 단계를 따르세요:
1. **Provider 선택**: `Anthropic` 선택
2. **로그인 방식 선택**: `Claude Pro/Max` 선택
3. **OAuth 완료**: 브라우저에서 로그인 및 권한 부여
4. **완료 대기**: 터미널에 인증 성공 표시

**예상 결과**
```
✓ Authentication successful
✓ Anthropic provider configured
```

::: warning Claude OAuth 접근 제한
> 2026년 1월 기준으로 Anthropic은 ToS 위반을 이유로 서드파티 OAuth 접근을 제한했습니다.
>
> [**Anthropic은 OpenCode를 차단할 근거로 본 프로젝트 oh-my-opencode을 인용했습니다**](https://x.com/thdxr/status/2010149530486911014)
>
> 실제로 커뮤니티에는 위조된 Claude Code OAuth 요청 서명을 사용하는 플러그인이 존재합니다. 이러한 도구는 기술적으로 가능할 수 있지만, 사용자는 ToS 영향을 이해해야 하며 개인적으로는 권장하지 않습니다.
>
> 본 프로젝트는 비공식 도구 사용으로 인한 어떤 문제에도 책임을 지지 않으며, **우리는 커스텀 OAuth 시스템 구현을 전혀 가지고 있지 않습니다**.
:::

#### 3.2 Google Gemini (Antigravity OAuth) 인증

**이유**
Gemini 모델은 Multimodal Looker(미디어 분석)와 일부 전문 작업에 사용됩니다.

**작업**

**단계 1**: Antigravity Auth 플러그인 추가

`~/.config/opencode/opencode.json`을 편집하고 `plugin` 배열에 `opencode-antigravity-auth@latest`를 추가하세요:

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**단계 2**: Antigravity 모델 구성(필수)

[opencode-antigravity-auth 문서](https://github.com/NoeFabris/opencode-antigravity-auth)에서 전체 모델 구성을 복사하고, 기존 구성을 손상시키지 않도록 주의하여 `~/.config/opencode/oh-my-opencode.json`에 병합하세요.

이 플러그인은 **variant 시스템**을 사용합니다—`antigravity-gemini-3-pro`와 같은 모델은 별도의 `-low`/`-high` 모델 항목 대신 `low`/`high` variant를 지원합니다.

**단계 3**: oh-my-opencode 에이전트 모델 덮어쓰기

`oh-my-opencode.json`(또는 `.opencode/oh-my-opencode.json`)에서 에이전트 모델을 덮어쓰세요:

```json
{
  "agents": {
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**사용 가능한 모델(Antigravity 할당량)**:
- `google/antigravity-gemini-3-pro` — variant: `low`, `high`
- `google/antigravity-gemini-3-flash` — variant: `minimal`, `low`, `medium`, `high`
- `google/antigravity-claude-sonnet-4-5` — variant 없음
- `google/antigravity-claude-sonnet-4-5-thinking` — variant: `low`, `max`
- `google/antigravity-claude-opus-4-5-thinking` — variant: `low`, `max`

**사용 가능한 모델(Gemini CLI 할당량)**:
- `google/gemini-2.5-flash`, `google/gemini-2.5-pro`
- `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

> **참고**: `google/antigravity-gemini-3-pro-high`와 같은 기존 접미사 이름도 여전히 사용 가능하지만, `--variant=high`와 기본 모델 이름을 대신 사용하는 것을 권장합니다.

**단계 4**: 인증 실행

```bash
opencode auth login
```

그런 다음 다음 단계를 따르세요:
1. **Provider 선택**: `Google` 선택
2. **로그인 방식 선택**: `OAuth with Google (Antigravity)` 선택
3. **브라우저 로그인 완료**: (자동 감지) 로그인 완료
4. **선택**: 다중 계정 로드 밸런싱을 위해 더 많은 Google 계정 추가(선택 사항)
5. **성공 검증**: 사용자와 확인

**예상 결과**
```
✓ Authentication successful
✓ Google provider configured (Antigravity)
✓ Multiple accounts available for load balancing
```

::: tip 다중 계정 로드 밸런싱
이 플러그인은 최대 10개의 Google 계정을 지원합니다. 한 계정이 속도 제한에 도달하면 자동으로 다음 사용 가능한 계정으로 전환됩니다.
:::

#### 3.3 GitHub Copilot (Fallback Provider) 인증

**이유**
GitHub Copilot은 **fallback provider**로, Native provider를 사용할 수 없을 때 사용됩니다.

**우선순위**: `Native (anthropic/, openai/, google/) \u003e GitHub Copilot \u003e OpenCode Zen \u003e Z.ai Coding Plan`

**작업**

```bash
opencode auth login
```

그런 다음 다음 단계를 따르세요:
1. **Provider 선택**: `GitHub` 선택
2. **인증 방식 선택**: `Authenticate via OAuth` 선택
3. **브라우저 로그인 완료**: GitHub OAuth 흐름

**예상 결과**
```
✓ Authentication successful
✓ GitHub Copilot configured as fallback
```

::: info GitHub Copilot 모델 매핑
GitHub Copilot이 최상의 사용 가능한 provider일 때, oh-my-opencode은 다음 모델 할당을 사용합니다:

| 에이전트       | 모델                             |
|--- | ---|
| **Sisyphus**  | `github-copilot/claude-opus-4.5`  |
| **Oracle**    | `github-copilot/gpt-5.2`         |
| **Explore**   | `opencode/gpt-5-nano`             |
| **Librarian** | `zai-coding-plan/glm-4.7`(Z.ai 사용 가능 시) 또는 fallback |

GitHub Copilot은 에이전트 provider로서, 구독에 따라 요청을 기본 모델로 라우팅합니다.
:::

### 4단계: 비대화형 설치(AI 에이전트에 적합)

**이유**
AI 에이전트는 명령줄 매개변수를 통해 모든 구성을 한 번에 완료하는 비대화형 모드를 사용해야 합니다.

**작업**

```bash
bunx oh-my-opencode install --no-tui \
  --claude=\u003cyes|no|max20\u003e \
  --openai=\u003cyes|no\u003e \
  --gemini=\u003cyes|no\u003e \
  --copilot=\u003cyes|no\u003e \
  [--opencode-zen=\u003cyes|no\u003e] \
  [--zai-coding-plan=\u003cyes|no\u003e]
```

**매개변수 설명**:

| 매개변수           | 값            | 설명                               |
|--- | --- | ---|
| `--no-tui`        | -             | 대화형 인터페이스 비활성화(다른 매개변수 지정 필요) |
| `--claude`         | `yes/no/max20` | Claude 구독 상태                          |
| `--openai`         | `yes/no`       | OpenAI/ChatGPT 구독(GPT-5.2 for Oracle) |
| `--gemini`         | `yes/no`       | Gemini 통합                              |
| `--copilot`        | `yes/no`       | GitHub Copilot 구독                        |
| `--opencode-zen`   | `yes/no`       | OpenCode Zen 접근(기본값 no)                |
| `--zai-coding-plan` | `yes/no`       | Z.ai Coding Plan 구독(기본값 no)         |

**예시**:

```bash
# 모든 native 구독 보유
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no

# Claude만 보유
bunx oh-my-opencode install --no-tui \
  --claude=yes \
  --openai=no \
  --gemini=no \
  --copilot=no

# GitHub Copilot만 보유
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=yes

# 구독 없음
bunx oh-my-opencode install --no-tui \
  --claude=no \
  --openai=no \
  --gemini=no \
  --copilot=no
```

**예상 결과**
비대화형 설치와 동일한 출력이지만 수동으로 질문에 답할 필요가 없습니다.

## 체크포인트 ✅

### 설치 성공 여부 검증

**검사 1**: OpenCode 버전 확인

```bash
opencode --version
```

**예상 결과**: `1.0.150` 이상 버전 표시.

::: warning OpenCode 버전 요구사항
OpenCode 1.0.132 이하 버전에서 버그로 인해 구성이 손상될 수 있습니다.
>
> 이 수정사항은 1.0.132 이후에 병합되었습니다—더 새로운 버전을 사용하세요.
> 흥미로운 사실: 이 PR은 OhMyOpenCode의 Librarian, Explore, Oracle 설정으로 인해 발견되고 수정되었습니다.
:::

**검사 2**: 플러그인 등록 확인

```bash
cat ~/.config/opencode/opencode.json
```

**예상 결과**: `plugin` 배열에 `"oh-my-opencode"`가 표시됩니다.

```json
{
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@latest"
  ]
}
```

**검사 3**: 구성 파일 생성 확인

```bash
cat ~/.config/opencode/oh-my-opencode.json
```

**예상 결과**: `agents`, `categories`, `disabled_agents` 등의 필드를 포함한 전체 구조가 표시됩니다.

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5"
    },
    "oracle": {
      "model": "openai/gpt-5.2"
    },
    ...
  },
  "categories": {
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1
    },
    ...
  },
  "disabled_agents": [],
  "disabled_skills": [],
  "disabled_hooks": [],
  "disabled_mcps": []
}
```

### 진단 명령 실행

```bash
oh-my-opencode doctor --verbose
```

**예상 결과**:
- 모델 해석 검사
- 에이전트 구성 검증
- MCP 연결 상태
- Provider 인증 상태

```bash
✓ OpenCode version: 1.0.150 (required: >=1.0.150)
✓ Plugin registered: oh-my-opencode
✓ Config file found: ~/.config/opencode/oh-my-opencode.json
✓ Anthropic provider: authenticated
✓ OpenAI provider: authenticated
✓ Google provider: authenticated (Antigravity)
✓ GitHub Copilot: authenticated (fallback)
✓ MCP servers: 3 connected (websearch, context7, grep_app)
✓ Agents: 10 enabled
✓ Hooks: 32 enabled
```

::: danger 진단 실패 시
진단에 오류가 표시되면 먼저 다음을 해결하세요:
1. **Provider 인증 실패**: `opencode auth login` 다시 실행
2. **구성 파일 오류**: `oh-my-opencode.json` 구문 확인(JSONC는 주석과 후행 쉼표 지원)
3. **버전 비호환**: OpenCode를 최신 버전으로 업그레이드
4. **Plugin 미등록**: `bunx oh-my-opencode install` 다시 실행
:::

## 문제 해결 팁

### ❌ 오류 1: Provider 인증 구성 잊음

**문제**: 설치 후 바로 사용했지만 AI 모델이 작동하지 않습니다.

**원인**: 플러그인은 설치되었지만 Provider가 OpenCode를 통해 인증되지 않았습니다.

**해결**:
```bash
opencode auth login
# 해당 Provider 선택 및 인증 완료
```

### ❌ 오류 2: OpenCode 버전이 너무 오래됨

**문제**: 구성 파일이 손상되었거나 로드할 수 없습니다.

**원인**: OpenCode 1.0.132 이하 버전의 버그로 구성이 손상될 수 있습니다.

**해결**:
```bash
# OpenCode 업그레이드
npm install -g @opencode/cli@latest

# 또는 패키지 관리자 사용(Bun, Homebrew 등)
bun install -g @opencode/cli@latest
```

### ❌ 오류 3: CLI 명령 매개변수 오류

**문제**: 비대화형 설치 실행 시 매개변수 오류가 표시됩니다.

**원인**: `--claude`는 필수 매개변수이며 `yes`, `no`, `max20` 중 하나를 제공해야 합니다.

**해결**:
```bash
# ❌ 오류: --claude 매개변수 누락
bunx oh-my-opencode install --no-tui --gemini=yes

# ✅ 올바름: 모든 필수 매개변수 제공
bunx oh-my-opencode install --no-tui --claude=yes --gemini=yes
```

### ❌ 오류 4: Antigravity 할당량 소진

**문제**: Gemini 모델이 갑자기 작동을 멈춥니다.

**원인**: Antigravity 할당량은 제한되어 있으며, 단일 계정이 속도 제한에 도달할 수 있습니다.

**해결**: 부하 분산을 위해 여러 Google 계정 추가
```bash
opencode auth login
# Google 선택
# 더 많은 계정 추가
```

플러그인은 자동으로 계정 간 전환되어 단일 계정 소진을 방지합니다.

### ❌ 오류 5: 구성 파일 위치 오류

**문제**: 구성을 수정했지만 적용되지 않습니다.

**원인**: 잘못된 구성 파일을 수정했습니다(프로젝트 구성 vs 사용자 구성).

**해결**: 구성 파일 위치 확인

| 구성 유형 | 파일 경로 | 우선순위 |
|--- | --- | ---|
| **사용자 구성** | `~/.config/opencode/oh-my-opencode.json` | 높음 |
| **프로젝트 구성** | `.opencode/oh-my-opencode.json` | 낮음 |

::: tip 구성 병합 규칙
사용자 구성과 프로젝트 구성이 모두 존재하는 경우, **사용자 구성이 프로젝트 구성을 덮어씁니다**.
:::

## 강의 요약

- **AI 에이전트 설치 권장**: AI가 자동으로 구성하도록 하여 인간이 놓치는 것 방지
- **CLI는 대화형 및 비대화형 모드 지원**: 대화형은 인간에게, 비대화형은 AI에 적합
- **Provider 우선순위**: Native > Copilot > OpenCode Zen > Z.ai
- **인증은 필수**: 설치 후 Provider 인증을 구성해야 사용 가능
- **진단 명령이 중요**: `oh-my-opencode doctor --verbose`로 빠르게 문제 해결
- **JSONC 형식 지원**: 구성 파일은 주석과 후행 쉼표 지원

## 다음 강의 예고

> 다음 강의에서는 **[Sisyphus 소개: 메인 오케스트레이터](../sisyphus-orchestrator/)**를 배웁니다.
>
> 배울 내용:
> - Sisyphus 에이전트의 핵심 기능과 설계 철학
> - Sisyphus를 사용하여 작업을 계획하고 위임하는 방법
> - 병렬 백그라운드 작업의 작동 메커니즘
> - Todo 강제 완료기의 원리

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-26

| 기능              | 파일 경로                                                                                               | 행 번호    |
|--- | --- | ---|
| CLI 설치 진입점      | [`src/cli/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/index.ts)         | 22-60   |
| 대화형 설치기      | [`src/cli/install.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/install.ts)         | 1-400+  |
| 구성 관리자        | [`src/cli/config-manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/config-manager.ts) | 1-200+  |
| 구성 Schema       | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts)       | 1-400+  |
| 진단 명령          | [`src/cli/doctor.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/cli/doctor.ts)          | 1-200+  |

**주요 상수**:
- `VERSION = packageJson.version`: 현재 CLI 버전 번호
- `SYMBOLS`: UI 기호(check, cross, arrow, bullet, info, warn, star)

**주요 함수**:
- `install(args: InstallArgs)`: 대화형 및 비대화형 설치를 처리하는 메인 설치 함수
- `validateNonTuiArgs(args: InstallArgs)`: 비대화형 모드의 매개변수 검증
- `argsToConfig(args: InstallArgs)`: CLI 매개변수를 구성 객체로 변환
- `addPluginToOpenCodeConfig()`: opencode.json에 플러그인 등록
- `writeOmoConfig(config)`: oh-my-opencode.json 구성 파일 쓰기
- `isOpenCodeInstalled()`: OpenCode 설치 여부 확인
- `getOpenCodeVersion()`: OpenCode 버전 번호 가져오기

**구성 Schema 필드**:
- `AgentOverrideConfigSchema`: 에이전트 덮어쓰기 구성(model, variant, skills, temperature, prompt 등)
- `CategoryConfigSchema`: Category 구성(description, model, temperature, thinking 등)
- `ClaudeCodeConfigSchema`: Claude Code 호환성 구성(mcp, commands, skills, agents, hooks, plugins)
- `BuiltinAgentNameSchema`: 내장 에이전트 열거(sisyphus, prometheus, oracle, librarian, explore, multimodal-looker, metis, momus, atlas)
- `PermissionValue`: 권한 값 열거(ask, allow, deny)

**설치 지원 플랫폼**(README에서):
- macOS (ARM64, x64)
- Linux (x64, ARM64, Alpine/musl)
- Windows (x64)

**Provider 우선순위 체인**(docs/guide/installation.md에서):
1. Native (anthropic/, openai/, google/)
2. GitHub Copilot
3. OpenCode Zen
4. Z.ai Coding Plan

</details>
