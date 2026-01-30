---
title: "모델 오류 해결: 400 및 MCP 문제 해결 | opencode-antigravity-auth"
sidebarTitle: "모델을 찾을 수 없을 때"
subtitle: "모델을 찾을 수 없음 및 400 오류 해결"
description: "Antigravity 모델 오류를 해결하는 방법을 학습합니다. Model not found, 400 Unknown name parameters 오류의 진단 및 수정 절차, MCP 서버 호환성 문제 해결을 다루어 문제를 신속하게 해결합니다."
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# 모델을 찾을 수 없음 및 400 오류 해결

## 발생하는 문제

Antigravity 모델을 사용할 때 다음과 같은 오류들이 발생할 수 있습니다:

| 오류 메시지 | 전형적인 증상 |
| --- | --- |
| `Model not found` | 모델이 존재하지 않는다는 메시지와 함께 요청을 시작할 수 없음 |
| `Invalid JSON payload received. Unknown name "parameters"` | 400 오류, 도구 호출 실패 |
| MCP 서버 호출 오류 | 특정 MCP 도구를 사용할 수 없음 |

이러한 문제들은 일반적으로 설정, MCP 서버 호환성 또는 플러그인 버전과 관련이 있습니다.

## 빠른 진단

심층 검사를 진행하기 전에 다음을 확인하세요:

**macOS/Linux**:
```bash
# 플러그인 버전 확인
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# 설정 파일 확인
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**:
```powershell
# 플러그인 버전 확인
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# 설정 파일 확인
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## 문제 1: Model not found

**오류 현상**:

```
Model not found: antigravity-claude-sonnet-4-5
```

**원인**: OpenCode의 Google provider 설정에 `npm` 필드가 없습니다.

**해결 방법**:

`~/.config/opencode/opencode.json`에서 `google` provider에 `npm` 필드를 추가하세요:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**검증 절차**:

1. `~/.config/opencode/opencode.json`을 편집하세요
2. 파일을 저장하세요
3. OpenCode에서 모델을 다시 호출해 보세요
4. "Model not found" 오류가 여전히 발생하는지 확인하세요

::: tip 팁
설정 파일 위치가 확실하지 않으면 다음을 실행하세요:
```bash
opencode config path
```
:::

---

## 문제 2: 400 오류 - Unknown name 'parameters'

**오류 현상**:

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**이 문제가 무엇인가요?**

Gemini 3 모델은 **엄격한 protobuf 검증**을 사용하고, Antigravity API는 도구 정의에 특정 형식을 요구합니다:

```json
// ❌ 잘못된 형식(거부됨)
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← 이 필드는 허용되지 않음
    }
  ]
}

// ✅ 올바른 형식
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← functionDeclarations 내부에 있음
        }
      ]
    }
  ]
}
```

플러그인은 자동으로 형식을 변환하지만, 특정 **MCP 서버가 호환되지 않는 필드를 포함한 Schema를 반환**하면(`const`, `$ref`, `$defs` 등) 정리가 실패할 수 있습니다.

### 해결 방법 1: 최신 beta 버전으로 업데이트

최신 beta 버전에는 Schema 정리 수정 사항이 포함되어 있습니다:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**:
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**:
```powershell
npm install -g opencode-antigravity-auth@beta
```

### 해결 방법 2: MCP 서버를 비활성화하고 하나씩 테스트

특정 MCP 서버가 반환한 Schema 형식이 Antigravity 요구 사항을 충족하지 못할 수 있습니다.

**절차**:

1. `~/.config/opencode/opencode.json`을 엽니다
2. `mcpServers` 설정을 찾습니다
3. **모든 MCP 서버를 비활성화**합니다(주석 처리 또는 삭제)
4. 모델을 다시 호출해 보세요
5. 성공하면 **한 번에 하나씩 MCP 서버를 활성화**하면서 테스트하세요
6. 오류를 유발하는 MCP 서버를 찾으면 비활성화하거나 해당 프로젝트의 유지 관리자에게 문제를 보고하세요

**예제 설정**:

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← 일시적으로 비활성화
    // "github": { ... },       ← 일시적으로 비활성화
    "brave-search": { ... }     ← 이것부터 테스트
  }
}
```

### 해결 방법 3: npm override 추가

위의 방법이 효과가 없다면 `google` provider 설정에서 `@ai-sdk/google`를 강제로 사용하세요:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## 문제 3: MCP 서버로 인한 도구 호출 실패

**오류 현상**:

- 특정 도구를 사용할 수 없음(WebFetch, 파일 작업 등)
- Schema 관련 문제를 나타내는 오류 메시지
- 다른 도구는 정상 작동

**원인**: MCP 서버가 반환한 JSON Schema에 Antigravity API에서 지원하지 않는 필드가 포함되어 있습니다.

### 호환되지 않는 Schema 특징

플러그인은 다음과 같은 비호환 기능을 자동으로 정리합니다(소스 `src/plugin/request-helpers.ts:24-37`):

| 특징 | 변환 방식 | 예시 |
| --- | --- | --- |
| `const` | `enum`으로 변환 | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | description hint로 변환 | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "See: Foo" }` |
| `$defs` / `definitions` | schema 내부로 펼치기 | 더 이상 참조 사용하지 않음 |
| `minLength` / `maxLength` / `pattern` | description으로 이동 | `description`에 힌트로 추가 |
| `additionalProperties` | description으로 이동 | `description`에 힌트로 추가 |

그러나 Schema 구조가 너무 복잡한 경우(예: 다층 중첩된 `anyOf`/`oneOf`) 정리에 실패할 수 있습니다.

### 조사 절차

```bash
# 디버그 로그 활성화
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# OpenCode 재시작

# Schema 변환 오류 로그 확인
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**로그에서 찾을 키워드**:

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### 문제 보고

특정 MCP 서버가 문제를 일으키는 것으로 확인된 경우 [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues)를 제출하세요. 다음을 포함해야 합니다:

1. **MCP 서버 이름 및 버전**
2. **전체 오류 로그**(`~/.config/opencode/antigravity-logs/`에서)
3. **문제를 트리거하는 도구 예제**
4. **플러그인 버전**(`opencode --version` 실행)

---

## 주의 사항

::: warning 플러그인 순서 비활성화

`opencode-antigravity-auth`와 `@tarquinen/opencode-dcp`를 동시에 사용하는 경우 **Antigravity Auth 플러그인을 먼저 배치**하세요:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← DCP 이전에 있어야 함
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP는 사고 블록이 없는 합성 assistant 메시지를 생성하여 서명 검증 오류를 일으킬 수 있습니다.
:::

::: warning 잘못된 설정 키 이름

`plugin`(단수)를 사용해야 하며 `plugins`(복수)가 아닙니다:

```json
// ❌ 잘못됨
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ 올바름
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## 도움 요청이 필요한 경우

위의 모든 방법을 시도한 후에도 문제가 지속되는 경우:

**로그 파일 확인**:
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**계정 재설정**(모든 상태 지우기):
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**GitHub issue 제출**, 다음을 포함해야 합니다:
- 전체 오류 메시지
- 플러그인 버전(`opencode --version`)
- `~/.config/opencode/antigravity.json` 설정(**refreshToken 같은 민감한 정보는 삭제**)
- 디버그 로그(`~/.config/opencode/antigravity-logs/latest.log`)

---

## 관련 과정

- [빠른 설치 가이드](/ko/NoeFabris/opencode-antigravity-auth/start/quick-install/) - 기본 설정
- [플러그인 호환성](/ko/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - 다른 플러그인 충돌 문제 해결
- [디버그 로그](/ko/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - 자세한 로그 활성화

---

## 부록: 소스 참고

<details>
<summary><strong>소스 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-23

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| JSON Schema 정리 메인 함수 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| const를 enum으로 변환 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| $ref를 hints로 변환 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| anyOf/oneOf 펼치기 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Gemini 도구 형식 변환 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**주요 상수**:
- `UNSUPPORTED_KEYWORDS`: 제거된 Schema 키워드(`request-helpers.ts:33-37`)
- `UNSUPPORTED_CONSTRAINTS`: description으로 이동된 제약(`request-helpers.ts:24-28`)

**주요 함수**:
- `cleanJSONSchemaForAntigravity(schema)`: 호환되지 않는 JSON Schema 정리
- `convertConstToEnum(schema)`: `const`를 `enum`으로 변환
- `convertRefsToHints(schema)`: `$ref`를 description hints로 변환
- `flattenAnyOfOneOf(schema)`: `anyOf`/`oneOf` 구조 펼치기

</details>
