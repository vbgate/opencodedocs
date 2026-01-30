---
title: "계정 마이그레이션: 장치 간 설정 | Antigravity Auth"
sidebarTitle: "다른 컴퓨터에서 계속 사용"
subtitle: "계정 마이그레이션: 여러 머신 설정 및 버전 업그레이드"
description: "macOS/Linux/Windows 간에 Antigravity Auth 계정 파일을 마이그레이션하는 방법, 자동 저장 형식 업그레이드 메커니즘 이해, 마이그레이션 후 인증 문제 해결 방법을 배우세요."
tags:
  - "마이그레이션"
  - "여러 머신"
  - "버전 업그레이드"
  - "계정 관리"
prerequisite:
  - "quick-install"
order: 2
---

# 계정 마이그레이션: 여러 머신 설정 및 버전 업그레이드

## 학습 완료 후 할 수 있는 것

- ✅ 한 머신에서 다른 머신으로 계정 마이그레이션
- ✅ 저장 형식 버전 변경 이해 (v1/v2/v3)
- ✅ 마이그레이션 후 인증 문제 해결 (invalid_grant 오류)
- ✅ 여러 디바이스에서 동일한 계정 공유

## 현재의 어려움

새 컴퓨터를 구매했고 그 위에서 Antigravity Auth를 사용하여 Claude와 Gemini 3에 접근하고 싶지만, 다시 OAuth 인증 프로세스를 거치고 싶지 않습니다. 또는 플러그인을 업그레이드한 후 원래 계정 데이터를 사용할 수 없게 되었습니다.

## 이 방법을 사용할 때

- 📦 **새 디바이스**: 이전 컴퓨터에서 새 컴퓨터로
- 🔄 **여러 디바이스 동기화**: 데스크탑과 노트북 간에 계정 공유
- 🆙 **버전 업그레이드**: 플러그인 업그레이드 후 저장 형식 변경
- 💾 **백업 복구**: 정기적으로 계정 데이터 백업

## 핵심 아이디어

**계정 마이그레이션**은 계정 파일(`antigravity-accounts.json`)을 한 머신에서 다른 머신으로 복사하는 프로세스입니다. 플러그인은 자동으로 저장 형식 버전 업그레이드를 처리합니다.

### 마이그레이션 메커니즘 개요

저장 형식에는 버전 관리가 있으며(현재 v3), 플러그인은 **자동 버전 마이그레이션**을 처리합니다:

| 버전 | 주요 변경 사항 | 현재 상태 |
| --- | --- | ---|
| v1 → v2 | 속도 제한 상태 구조화 | ✅ 자동 마이그레이션 |
| v2 → v3 | 듀얼 할당량 풀 지원 (gemini-antigravity/gemini-cli) | ✅ 자동 마이그레이션 |

저장 파일 위치 (크로스 플랫폼):

| 플랫폼 | 경로 |
| --- | --- |
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip 보안 알림
계정 파일에는 OAuth refresh token이 포함되어 있어 **비밀번호와 동등**합니다. 전송 시 SFTP, 암호화 ZIP 등 암호화 방법을 사용하세요.
:::

## 🎒 시작 전 준비

- [ ] 대상 머신에 OpenCode가 설치됨
- [ ] 대상 머신에 Antigravity Auth 플러그인 설치: `opencode plugin add opencode-antigravity-auth@beta`
- [ ] 두 머신이 파일을 안전하게 전송할 수 있음 (SSH, USB 등)

## 따라 하기

### 1단계: 소스 머신에서 계정 파일 찾기

**이유**
계정 정보가 포함된 JSON 파일을 찾아야 합니다.

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**볼 것**: 파일이 존재하며 다음과 같은 내용을 포함합니다:

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

파일이 존재하지 않으면 계정이 아직 추가되지 않은 것이므로 먼저 `opencode auth login`을 실행하세요.

### 2단계: 계정 파일을 대상 머신에 복사

**이유**
계정 정보(refresh token과 Project ID)를 새 디바이스로 전송합니다.

::: code-group

```bash [macOS/Linux]
# 방법 1: scp 사용 (SSH 통해)
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# 방법 2: USB 사용
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# 방법 1: PowerShell Copy-Item 사용 (SMB 통해)
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# 방법 2: USB 사용
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**볼 것**: 파일이 대상 머신의 임시 디렉토리(예: `/tmp/` 또는 `Downloads/`)에 성공적으로 복사되었습니다.

### 3단계: 대상 머신에 플러그인 설치

**이유**
대상 머신의 플러그인 버전이 호환되는지 확인합니다.

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**볼 것**: 플러그인 설치 성공 메시지.

### 4단계: 파일을 올바른 위치에 배치

**이유**
플러그인은 고정된 경로에서만 계정 파일을 찾습니다.

::: code-group

```bash [macOS/Linux]
# 디렉토리 생성 (존재하지 않는 경우)
mkdir -p ~/.config/opencode

# 파일 복사
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# 권한 확인
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# 파일 복사 (디렉토리가 자동으로 생성됨)
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# 확인
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**볼 것**: 파일이 구성 디렉토리에 존재합니다.

### 5단계: 마이그레이션 결과 검증

**이유**
계정이 올바르게 로드되었는지 확인합니다.

```bash
# 계정 나열 (플러그인이 계정 파일을 로드하도록 트리거)
opencode auth login

# 이미 계정이 있으면 다음이 표시됩니다:
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

`Ctrl+C`를 눌러 종료합니다 (새 계정을 추가할 필요가 없음).

**볼 것**: 플러그인이 마이그레이션된 계정 이메일을 포함하여 계정 목록을 성공적으로 인식합니다.

### 6단계: 첫 요청 테스트

**이유**
refresh token이 여전히 유효한지 검증합니다.

```bash
# OpenCode에서 테스트 요청 시작
# 선택: google/antigravity-gemini-3-flash
```

**볼 것**: 모델이 정상적으로 응답합니다.

## 체크포인트 ✅

- [ ] 대상 머신이 마이그레이션된 계정을 나열할 수 있음
- [ ] 테스트 요청 성공 (인증 오류 없음)
- [ ] 플러그인 로그에 오류 메시지 없음

## 주의사항

### 문제 1: "API key missing" 오류

**증상**: 마이그레이션 후 요청이 `API key missing` 오류를 반환합니다.

**원인**: refresh token이 만료되었거나 Google에 의해 취소되었을 수 있습니다 (예: 비밀번호 변경, 보안 이벤트).

**해결책**:

```bash
# 계정 파일을 지우고 다시 인증
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### 문제 2: 플러그인 버전 불호환

**증상**: 마이그레이션 후 계정 파일을 로드할 수 없고, 로그에 `Unknown storage version`이 표시됩니다.

**원인**: 대상 머신의 플러그인 버전이 너무 오래되어 현재 저장 형식을 지원하지 않습니다.

**해결책**:

```bash
# 최신 버전으로 업그레이드
opencode plugin add opencode-antigravity-auth@latest

# 다시 테스트
opencode auth login
```

### 문제 3: 듀얼 할당량 풀 데이터 손실

**증상**: 마이그레이션 후 Gemini 모델이 하나의 할당량 풀만 사용하고 자동 fallback이 없습니다.

**원인**: 마이그레이션 시 `antigravity-accounts.json`만 복사했지만, `quota_fallback`이 활성화된 경우 구성 파일 `antigravity.json`은 복사되지 않았습니다.

**해결책**:

구성 파일도 함께 복사합니다 (만약 `quota_fallback`을 활성화한 경우):

::: code-group

```bash [macOS/Linux]
# 구성 파일 복사
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# 구성 파일 복사
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### 문제 4: 파일 권한 오류

**증상**: macOS/Linux에서 `Permission denied`가 표시됩니다.

**원인**: 파일 권한이 올바르지 않아 플러그인이 읽을 수 없습니다.

**해결책**:

```bash
# 권한 수정
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## 저장 형식 자동 마이그레이션 상세 설명

플러그인이 계정을 로드할 때, 저장 버전을 자동으로 감지하고 마이그레이션합니다:

```
v1 (이전 버전)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (현재 버전)
```

**마이그레이션 규칙**:
- v1 → v2: `rateLimitResetTime`을 `claude`와 `gemini` 두 필드로 분할
- v2 → v3: `gemini`를 `gemini-antigravity`와 `gemini-cli`로 분할 (듀얼 할당량 풀 지원)
- 자동 정리: 만료된 속도 제한 시간은 필터링됩니다 (`> Date.now()`)

::: info 자동 중복 제거
계정을 로드할 때, 플러그인은 이메일을 기준으로 자동으로 중복을 제거하고, 가장 최신의 계정을 유지합니다 (`lastUsed`와 `addedAt`으로 정렬).
:::

## 수업 요약

계정 마이그레이션의 핵심 단계:

1. **파일 위치**: 소스 머신에서 `antigravity-accounts.json` 찾기
2. **복사 전송**: 대상 머신으로 안전하게 전송
3. **올바른 배치**: 구성 디렉토리에 배치 (`~/.config/opencode/` 또는 `%APPDATA%\opencode\`)
4. **검증 테스트**: `opencode auth login`을 실행하여 인식 확인

플러그인은 저장 파일 형식을 수동으로 수정할 필요 없이 **자동으로 버전 마이그레이션을 처리**합니다. 그러나 `invalid_grant` 오류가 발생하면 재인증만 가능합니다.

## 다음 수업 예고

> 다음 수업에서는 **[ToS 경고](../tos-warning/)**를 배웁니다.
>
> 배울 내용:
> - Antigravity Auth 사용과 관련된 잠재적 위험
> - 계정 금지를 피하는 방법
> - Google의 서비스 약관 제한 사항
