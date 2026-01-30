---
title: "버전 업데이트 로그: 새 기능, 개선사항 및 주요 변경사항 이해 | Clawdbot 튜토리얼"
sidebarTitle: "새 버전의 내용"
subtitle: "버전 업데이트 로그: 새 기능, 개선사항 및 주요 변경사항 이해"
description: "Clawdbot의 버전 업데이트 기록을 학습하여 각 버전의 새 기능, 개선사항, 버그 수정 및 주요 변경사항을 이해하세요. 이 튜토리얼은 사용자가 기능 발전 과정을 추적하고 최신 기능과 보안 수정을 얻기 위해 시스템을 최신 상태로 유지하도록 도와줍니다."
tags:
  - "업데이트 로그"
  - "버전 기록"
  - "changelog"
prerequisite: []
order: 380
---

# 버전 업데이트 로그: 새 기능, 개선사항 및 주요 변경사항 이해

Clawdbot은 지속적으로 반복되며 업데이트되며, 각 버전마다 새로운 기능과 성능 개선, 보안 강화를 제공합니다. 이 로그는 버전 발전 과정을 빠르게 파악하고, 언제 업그레이드할지, 업그레이드 시 주의할 점을 결정하는 데 도움을 줍니다.

## 학습 후 가능한 작업

- 최신 버전의 새로운 기능과 하이라이트 이해
- 버전별 주요 변경사항을 파악하여 업그레이드 중단 방지
- 문제 수정 목록을 확인하여 현재 문제 해결 여부 검증
- 기능 발전 로드맵 추적 및 새로운 기능 활용 계획

::: tip 버전 넘버링 설명
버전 형식: `YYYY.M.D` (연도.월.일)

- **메이저 버전**: 연도 또는 월 숫자 변경은 일반적으로 주요 기능 업데이트를 나타냅니다
- **패치 버전**: `-1`, `-2`, `-3`은 수정 버전을 나타내며, 버그 수정만 포함합니다
:::

---

## 2026.1.25
**상태**: 릴리스되지 않음

### 하이라이트 (Highlights)

없음

### 변경사항 (Changes)

- **Agents**: exec allowlist 확인에서 `tools.exec.safeBins` 준수 (#2281)
- **Docs**: Fly 프라이빗 배포 단계 강화 (#2289) - @dguido 님 감사합니다
- **Gateway**: 쿼리 매개변수를 통해 전달되는 hook 토큰에 대해 경고 발생; header 인증 방식 문서화 (#2200) - @YuriNachos 님 감사합니다
- **Gateway**: 위험한 Control UI 장치 인증 우회 플래그 추가 + 감사 경고 (#2248)
- **Doctor**: 인증되지 않은 gateway 노출 시 경고 발생 (#2016) - @Alex-Alaniz 님 감사합니다
- **Discord**: 구성 가능한 특권 gateway intents(presences/members) 추가 (#2266) - @kentaro 님 감사합니다
- **Docs**: providers 사이드바에 Vercel AI Gateway 추가 (#1901) - @jerilynzheng 님 감사합니다
- **Agents**: cron 도구 설명 확장하여 전체 schema 문서 포함 (#1988) - @tomascupr 님 감사합니다
- **Skills**: GitHub, Notion, Slack, Discord에 누락된 종속성 메타데이터 추가 (#1995) - @jackheuberger 님 감사합니다
- **Docs**: Render 배포 가이드 추가 (#1975) - @anurag 님 감사합니다
- **Docs**: Claude Max API 프록시 가이드 추가 (#1875) - @atalovesyou 님 감사합니다
- **Docs**: DigitalOcean 배포 가이드 추가 (#1870) - @0xJonHoldsCrypto 님 감사합니다
- **Docs**: Raspberry Pi 설치 가이드 추가 (#1871) - @0xJonHoldsCrypto 님 감사합니다
- **Docs**: GCP Compute Engine 배포 가이드 추가 (#1848) - @hougangdev 님 감사합니다
- **Docs**: LINE 채널 가이드 추가 - @thewilloftheshadow 님 감사합니다
- **Docs**: Control UI 새로고침에 대한 두 기여자에게 공로 부여 (#1852) - @EnzeD 님 감사합니다
- **Onboarding**: Venice API 키를 비대화형 흐름에 추가 (#1893) - @jonisjongithub 님 감사합니다
- **Onboarding**: 베타 보안 경고 문구 강화 + 액세스 제어 예상
- **Tlon**: 스레드 응답 ID를 `@ud` 형식으로 지정 (#1837) - @wca4a 님 감사합니다
- **Gateway**: 스토리지 병합 시 최신 세션 메타데이터 우선 사용 (#1823) - @emanuelst 님 감사합니다
- **Web UI**: WebChat에서 하위 에이전트 알림 응답을 계속 표시 (#1977) - @andrescardonas7 님 감사합니다
- **CI**: macOS 확인을 위한 Node 힙 크기 증가 (#1890) - @realZachi 님 감사합니다
- **macOS**: Textual을 0.3.1로 업그레이드하여 코드 블록 렌더링 시 중단 방지 (#2033) - @garricn 님 감사합니다
- **Browser**: 확장 중계 대상 확인을 위해 URL 매칭으로 대체 (#1999) - @jonit-dev 님 감사합니다
- **Update**: 더티 확인에서 dist/control-ui를 무시하고 UI 빌드 후 복원 (#1976) - @Glucksberg 님 감사합니다
- **Telegram**: 미디어 전송 시 caption 매개변수 사용 허용 (#1888) - @mguellsegarra 님 감사합니다
- **Telegram**: 플러그인 sendPayload channelData(미디어/버튼) 지원 및 플러그인 명령 유효성 검사 (#1917) - @JoshuaLelon 님 감사합니다
- **Telegram**: 스트리밍이 비활성화되었을 때 블록 응답 방지 (#1885) - @ivancasco 님 감사합니다
- **Auth**: ASCII 프롬프트 후 복사 가능한 Google 인증 URL 표시 (#1787) - @robbyczgw-cla 님 감사합니다
- **Routing**: 세션 키 정규 표현식 미리 컴파일 (#1697) - @Ray0907 님 감사합니다
- **TUI**: 선택 목록 렌더링 시 너비 오버플로우 방지 (#1686) - @mossein 님 감사합니다
- **Telegram**: 재시작 센티널 알림에서 주제 ID 유지 (#1807) - @hsrvc 님 감사합니다
- **Config**: `${VAR}` 대체 전에 `config.env` 적용 (#1813) - @spanishflu-est1918 님 감사합니다
- **Slack**: 스트리밍 응답 후 ack 반응 제거 (#2044) - @fancyboi999 님 감사합니다
- **macOS**: 원격 대상에서 사용자 정의 SSH 사용자 이름 유지 (#2046) - @algal 님 감사합니다

### 수정사항 (Fixes)

- **Telegram**: 밑줄을 방지하기 위해 각 줄에 reasoning 이탤릭체 래핑 (#2181) - @YuriNachos 님 감사합니다
- **Voice Call**: ngrok URL에 대해 Twilio 웹훅 서명 확인 강제 수행; 기본적으로 ngrok 무료 계층 우회 비활성화
- **Security**: headers를 신뢰하기 전에 로컬 tailscaled의 신원을 확인하여 Tailscale Serve 인증 강화
- **Build**: 잠금 파일과 일치하도록 memory-core 동종 종속성 조정
- **Security**: 정보 유출을 줄이기 위해 mDNS 발견 모드 추가, 기본값 최소화 (#1882) - @orlyjamie 님 감사합니다
- **Security**: 리바인딩 위험을 줄이기 위해 DNS 고정을 통해 URL 가져오기 강화 - Chris Zheng 님 감사합니다
- **Web UI**: WebChat 이미지 붙여넣기 미리보기 개선 및 이미지만 전송 허용 (#1925) - @smartprogrammer93 님 감사합니다
- **Security**: 기본적으로 훅별 종료 옵션으로 외부 hook 콘텐츠 래핑 (#1827) - @mertcicekci0 님 감사합니다
- **Gateway**: 기본 인증은 이제 실패 닫기(토큰/비밀번호 필요; Tailscale Serve ID는 여전히 허용됨)
- **Onboarding**: 온보딩/구성 흐름 및 CLI 플래그에서 지원되지 않는 gateway 인증 "off" 선택 제거

---

## 2026.1.24-3

### 수정사항 (Fixes)

- **Slack**: 크로스 도메인 리디렉션 시 Authorization header 누락으로 인한 이미지 다운로드 실패 수정 (#1936) - @sanderhelgesen 님 감사합니다
- **Gateway**: 로컬 클라이언트 확인 강화 및 인증되지 않은 프록시 연결의 역방향 프록시 처리 (#1795) - @orlyjamie 님 감사합니다
- **Security audit**: 인증이 비활성화된 루프백 Control UI를 중요로 표시 (#1795) - @orlyjamie 님 감사합니다
- **CLI**: claude-cli 세션 복원 및 TUI 클라이언트로 CLI 응답 스트리밍 (#1921) - @rmorse 님 감사합니다

---

## 2026.1.24-2

### 수정사항 (Fixes)

- **Packaging**: npm tarball에 dist/link-understanding 출력 포함(설치 시 누락된 apply.js 가져오기 수정)

---

## 2026.1.24-1

### 수정사항 (Fixes)

- **Packaging**: npm tarball에 dist/shared 출력 포함(설치 시 누락된 reasoning-tags 가져오기 수정)

---

## 2026.1.24

### 하이라이트 (Highlights)

- **Providers**: Ollama 발견 + 문서; Venice 가이드 업그레이드 + 교차 링크 (#1606) - @abhaymundhara 님 감사합니다
- **Channels**: LINE 플러그인(Messaging API) 리치 응답 + 빠른 응답 지원 (#1630) - @plum-dawg 님 감사합니다
- **TTS**: Edge 대체(키 없음) + `/tts` 자동 모드 (#1668, #1667) - @steipete, @sebslight 님 감사합니다
- **Exec approvals**: `/approve`를 통해 모든 채널(플러그인 포함)에서 채팅 내 승인 (#1621) - @czekaj 님 감사합니다
- **Telegram**: DM 주제를 독립 세션으로 + 아웃바운드 링크 미리보기 토글 (#1597, #1700) - @rohannagpal, @zerone0x 님 감사합니다

### 변경사항 (Changes)

- **Channels**: LINE 플러그인(Messaging API) 추가, 리치 응답, 빠른 응답 및 플러그인 HTTP 레지스트리 지원 (#1630) - @plum-dawg 님 감사합니다
- **TTS**: Edge TTS 제공자 대체 추가, 기본값은 키 없는 Edge, 형식 실패 시 MP3 재시도 (#1668) - @steipete 님 감사합니다
- **TTS**: 자동 모드 열거형(off/always/inbound/tagged) 추가, 세션별 `/tts` 재정의 지원 (#1667) - @sebslight 님 감사합니다
- **Telegram**: DM 주제를 독립 세션으로 처리하고 스레드 접미사를 사용하여 DM 기록 제한을 안정적으로 유지 (#1597) - @rohannagpal 님 감사합니다
- **Telegram**: `channels.telegram.linkPreview` 토글 추가하여 아웃바운드 링크 미리보기 (#1700) - @zerone0x 님 감사합니다
- **Web search**: 시간 제한 결과를 위한 Brave 신선도 필터 매개변수 추가 (#1688) - @JonUleis 님 감사합니다
- **UI**: Control UI 대시보드 디자인 시스템 새로고침(색상, 아이콘, 타이포그래피) (#1745, #1786) - @EnzeD, @mousberg 님 감사합니다
- **Exec approvals**: 승인 프롬프트를 채팅으로 전달, `/approve`를 통해 모든 채널(플러그인 포함) 지원 (#1621) - @czekaj 님 감사합니다
- **Gateway**: gateway 도구에 `config.patch` 노출, 안전한 부분 업데이트 + 재시작 센티널 지원 (#1653) - @Glucksberg 님 감사합니다
- **Diagnostics**: 대상 디버깅 로그를 위한 진단 플래그 추가(config + env 재정의)
- **Docs**: FAQ 확장(마이그레이션, 스케줄링, 동시성, 모델 권장, OpenAI 구독 인증, Pi 크기, 허치 설치, docs SSL 우회)
- **Docs**: 상세한 설치 프로그램 문제 해결 가이드 추가
- **Docs**: 로컬/호스팅 옵션 + VPS/노드 지침이 포함된 macOS VM 가이드 추가 (#1693) - @f-trycua 님 감사합니다
- **Docs**: Bedrock EC2 인스턴스 역할 설정 + IAM 단계 추가 (#1625) - @sergical 님 감사합니다
- **Docs**: Fly.io 가이드 설명 업데이트
- **Dev**: prek pre-commit hooks + 종속성의 주간 업데이트 구성 추가 (#1720) - @dguido 님 감사합니다

### 수정사항 (Fixes)

- **Web UI**: config/debug 레이아웃 오버플로우, 스크롤 및 코드 블록 크기 수정 (#1715) - @saipreetham589 님 감사합니다
- **Web UI**: 활동 실행 중 정지 버튼 표시, 유휴 시 새 세션으로 다시 전환 (#1664) - @ndbroadbent 님 감사합니다
- **Web UI**: 재연결 시 오래된 연결 해제 배너 지우기; schema 경로를 지원하지 않는 양식 저장 허용하지만 누락된 schema 차단 (#1707) - @Glucksberg 님 감사합니다
- **Web UI**: 채팅 버블에서 내부 `message_id` 힌트 숨기기
- **Gateway**: 장치 ID가 존재하더라도 Control UI 토큰 전용 인증이 장치 페어링을 건너뛰도록 허용(`gateway.controlUi.allowInsecureAuth`) (#1679) - @steipete 님 감사합니다
- **Matrix**: 사전 확인 크기로 E2EE 미디어 첨부 파일 해제 보호 (#1744) - @araa47 님 감사합니다
- **BlueBubbles**: 전화번호 대상을 DM으로 라우팅하여 라우팅 ID 유출 방지, 누락된 DM 자동 생성(Private API 필요) (#1751) - @tyler6204 님 감사합니다
- **BlueBubbles**: 짧은 ID가 누락된 경우 응답 태그에 part-index GUID 유지
- **iMessage**: chat_id/chat_guid/chat_identifier 접두사를 대소문자 구분 없이 정규화하고 서비스 접두사 핸들을 안정적으로 유지 (#1708) - @aaronn 님 감사합니다
- **Signal**: reaction 전송 수정(그룹/UUID 대상 + CLI 작성자 플래그) (#1651) - @vilkasdev 님 감사합니다
- **Signal**: 구성 가능한 signal-cli 시작 시간 제한 추가 + 외부 데몬 모드 문서화 (#1677)
- **Telegram**: Node 22에서 업로드를 위해 fetch duplex="half" 설정하여 sendPhoto 실패 방지 (#1684) - @commdata2338 님 감사합니다
- **Telegram**: Node에서 래핑된 fetch를 사용하여 긴 폴링 수행하여 AbortSignal 처리 정규화 (#1639)
- **Telegram**: 아웃바운드 API 호출에 대해 계정별 프록시 준수 (#1774) - @radek-paclt 님 감사합니다
- **Telegram**: 음성 메모가 개인정보 설정에 의해 차단된 경우 텍스트로 대체 (#1725) - @foeken 님 감사합니다
- **Voice Call**: 초기 Twilio 웹훅에서 아웃바운드 세션 호출을 위한 스트리밍 TwiML 반환 (#1634)
- **Voice Call**: Twilio TTS 재생 직렬화 및 끼어들 때 취소하여 겹침 방지 (#1713) - @dguido 님 감사합니다
- **Google Chat**: 이메일 allowlist 일치 강화, 입력 정리, 미디어 상한 및 온보딩/문서/테스트 (#1635) - @iHildy 님 감사합니다
- **Google Chat**: 이중 `spaces/` 접두사가 없는 공간 대상 정규화
- **Agents**: 컨텍스트 오버플로우 프롬프트 오류 시 자동 압축 (#1627) - @rodrigouroz 님 감사합니다
- **Agents**: 활성 인증 구성 파일을 사용하여 자동 압축 복구
- **Media understanding**: 기본 모델이 이미 시각을 지원하는 경우 이미지 이해 건너뛰기 (#1747) - @tyler6204 님 감사합니다
- **Models**: 최소 구성을 허용하도록 누락된 사용자 정의 제공자 필드 기본값 설정
- **Messaging**: 개행 블록 분할을 펜스 markdown 블록에 대해 채널 간에 안전하게 유지
- **Messaging**: 개행 블록을 단락 인식(빈 줄 분할)으로 처리하여 목록 및 제목을 함께 유지 (#1726) - @tyler6204 님 감사합니다
- **TUI**: gateway 재연결 후 기록 다시 로드하여 세션 상태 복원 (#1663)
- **Heartbeat**: 라우팅 일관성을 위해 대상 식별자 정규화
- **Exec**: 완전 모드가 아닌 한 승격된 ask에 대해 승인 유지 (#1616) - @ivancasco 님 감사합니다
- **Exec**: 노드 셸 선택을 위해 Windows 플랫폼 태그를 Windows로 처리 (#1760) - @ymat19 님 감사합니다
- **Gateway**: 서비스 설치 환경에 인라인 구성 env 변수 포함 (#1735) - @Seredeep 님 감사합니다
- **Gateway**: tailscale.mode가 off인 경우 Tailscale DNS 탐지 건너뛰기 (#1671)
- **Gateway**: 지연 호출 + 원격 노드 탐지의 로그 노이즈 감소; 기술 새로고침 디바운스 (#1607) - @petter-b 님 감사합니다
- **Gateway**: 토큰이 누락된 Control UI/WebChat 인증 오류 프롬프트 명확화 (#1690)
- **Gateway**: localhost webhooks가 작동하도록 127.0.0.1에 바인딩될 때 IPv6 루프백에서 수신 대기
- **Gateway**: 지속 볼륨의 오래된 잠금을 방지하기 위해 임시 디렉토리에 잠금 파일 저장 (#1676)
- **macOS**: 직접 전송 `ws://` URL은 기본적으로 포트 18789로; `gateway.remote.transport` 문서화 (#1603) - @ngutman 님 감사합니다
- **Tests**: CI macOS에서 Vitest 워커 제한하여 시간 초과 감소 (#1597) - @rohannagpal 님 감사합니다
- **Tests**: CI 불안정성을 줄이기 위해 내장형 실행기 스트림 시뮬레이션에서 fake-timer 종속성 방지 (#1597) - @rohannagpal 님 감사합니다
- **Tests**: CI 불안정성을 줄이기 위해 내장형 실행기 정렬 테스트 시간 제한 증가 (#1597) - @rohannagpal 님 감사합니다

---

## 2026.1.23-1

### 수정사항 (Fixes)

- **Packaging**: npm tarball에 dist/tts 출력 포함(누락된 dist/tts/tts.js 수정)

---

## 2026.1.23

### 하이라이트 (Highlights)

- **TTS**: Telegram TTS를 코어로 이동 + 표현형 오디오 응답 지원을 위해 기본적으로 모델 기반 TTS 태그 활성화 (#1559) - @Glucksberg 님 감사합니다
- **Gateway**: 직접 도구 호출을 위한 `/tools/invoke` HTTP 엔드포인트 추가(인증 + 도구 정책 강제) (#1575) - @vignesh07 님 감사합니다
- **Heartbeat**: 채널별 가시성 제어(OK/alerts/indicator) (#1452) - @dlauer 님 감사합니다
- **Deploy**: Fly.io 배포 지원 + 가이드 추가 (#1570)
- **Channels**: Tlon/Urbit 채널 플러그인 추가(DM, 그룹 멘션, 스레드 응답) (#1544) - @wca4a 님 감사합니다

### 변경사항 (Changes)

- **Channels**: 내장 + 플러그인 채널에서 도구 그룹별 허용/거부 정책 허용 (#1546) - @adam91holt 님 감사합니다
- **Agents**: Bedrock 자동 발견 기본값 + 구성 재정의 추가 (#1553) - @fal3 님 감사합니다
- **CLI**: 시스템 이벤트 + 하트비트 제어를 위한 `clawdbot system` 추가; 독립적인 `wake` 제거
- **CLI**: 프로필별 확인을 위해 `clawdbot models status`에 실시간 인증 탐지 추가
- **CLI**: `clawdbot update` 후 기본적으로 gateway 재시작; 건너뛰려면 `--no-restart` 추가
- **Browser**: 원격 gateway를 위한 노드 호스트 프록시 자동 라우팅 추가(gateway/node별 구성 가능)
- **Plugins**: 워크플로우에 선택적 `llm-task` JSON 전용 도구 추가 (#1498) - @vignesh07 님 감사합니다
- **Markdown**: 채널별 테이블 변환 추가(Signal/WhatsApp은 글머리 기호 사용, 다른 것은 코드 블록 사용) (#1495) - @odysseus0 님 감사합니다
- **Agents**: 시스템 프롬프트를 시간대 전용으로 유지하고 현재 시간을 `session_status`로 이동하여 더 나은 캐시 적중 달성
- **Agents**: 도구 등록/표시에서 중복된 bash 도구 별칭 제거 (#1571) - @Takhoffman 님 감사합니다
- **Docs**: cron vs 하트비트 결정 가이드 추가(Lobster 워크플로우 노트 포함) (#1533) - @JustYannicc 님 감사합니다
- **Docs**: 빈 HEARTBEAT.md 파일이 하트비트를 건너뛰고 누락된 파일은 계속 실행됨 명확화 (#1535) - @JustYannicc 님 감사합니다

### 수정사항 (Fixes)

- **Sessions**: 기록/전송/상태에 대해 UUID가 아닌 sessionIds 허용하면서 에이전트 범위 유지
- **Heartbeat**: 하트비트 대상 확인 + UI 프롬프트에 플러그인 채널 ids 허용
- **Messaging/Sessions**: 아웃바운드 전송을 대상 세션 키(스레드 + dmScope)에 미러링하고, 전송 시 세션 항목 생성, 세션 키 대소문자 정규화 (#1520)
- **Sessions**: 지원되는 세션 스토리지의 배열 수용을 거부하여 자동 삭제 방지 (#1469)
- **Gateway**: PID 재활용 잠금 루프를 피하기 위해 Linux 프로세스 시작 시간 비교; 오래되지 않은 경우 잠금 유지 (#1572) - @steipete 님 감사합니다
- **Gateway**: exec 승인 요청에서 null 선택적 필드 허용 (#1511) - @pvoo 님 감사합니다
- **Exec approvals**: macOS allowlist 동작 안정성을 위해 allowlist 항목 id 유지 (#1521) - @ngutman 님 감사합니다
- **Exec**: 승격된 승인에 대해 tools.exec ask/security 기본값 준수(불필요한 프롬프트 방지)
- **Daemon**: 최소 서비스 경로 구축 시 플랫폼 PATH 구분자 사용
- **Linux**: systemd PATH에 env 구성된 사용자 bin 루트 포함 및 PATH 감사 정렬 (#1512) - @robbyczgw-cla 님 감사합니다
- **Tailscale**: 권한 오류 시에만 sudo 재시도를 사용하여 serve/funnel 및 원래 실패 세부정보 유지 (#1551) - @sweepies 님 감사합니다
- **Docker**: docker-compose 및 Hetzner 가이드에서 gateway 명령어 업데이트 (#1514)
- **Agents**: 마지막 어시스턴트 라운드가 도구만 호출할 때 도구 오류 대체 표시(자동 중지 방지)
- **Agents**: IDENTITY.md 템플릿 자리 표시자 무시하여 ID 구문 분석 (#1556)
- **Agents**: 모델 전환 시 고립된 OpenAI Responses reasoning 블록 삭제 (#1562) - @roshanasingh4 님 감사합니다
- **Agents**: "에이전트가 응답 전에 실패함" 메시지에 CLI 로그 힌트 추가 (#1550) - @sweepies 님 감사합니다
- **Agents**: 알 수 없거나 로드되지 않은 플러그인 도구만 참조하는 도구 allowlists에 대해 경고 및 무시 (#1566)
- **Agents**: 플러그인 전용 도구 allowlists를 선택적 참여로 처리; 핵심 도구 활성화 상태로 유지 (#1467)
- **Agents**: 테스트에서 교착 상태를 피하기 위해 내장형 실행의 enqueue 재정의 준수
- **Slack**: 메시지 + 슬래시 게이트에서 나열되지 않은 채널에 대해 열린 groupPolicy 준수 (#1563) - @itsjaydesu 님 감사합니다
- **Discord**: 봇이 소유한 스레드로 자동 스레드 멘션 우회 제한; ack 반응 멘션 게이팅 유지 (#1511) - @pvoo 님 감사합니다
- **Discord**: 속도 제한 allowlist 구문 분석 + 명령 배포 재시도하여 gateway 중단 방지
- **Mentions**: 그룹 채팅에서 또 다른 명시적 멘션이 존재하는 경우 mentionPattern 일치 무시(Slack/Discord/Telegram/WhatsApp)
- **Telegram**: 미디어 캡션에서 markdown 렌더링 (#1478)
- **MS Teams**: Graph 범위 및 Bot Framework 탐지 범위에서 `.default` 접미사 제거 (#1507, #1574) - @Evizero 님 감사합니다
- **Browser**: 확장이 탭 전환 후 세션 id를 재사용할 때 확장 중레이 탭을 제어 가능하게 유지 (#1160)
- **Voice wake**: 모호/제출 시 iOS/Android 간에 자동으로 웨이크워드 저장 및 macOS와 제한 조정
- **UI**: 긴 페이지를 스크롤할 때 Control UI 사이드바 표시 유지 (#1515) - @pookNast 님 감사합니다
- **UI**: Safari 입력 지터를 줄이기 위해 Control UI markdown 렌더링 캐시 + 채팅 텍스트 추출 메모이제이션
- **TUI**: 알 수 없는 슬래시 명령 전달, 자동 완성에 Gateway 명령 포함, 슬래시 응답을 시스템 출력으로 렌더링
- **CLI**: 인증 탐지 출력 다듬기(테이블 출력, 인라인 오류, 노이즈 감소 및 `clawdbot models status`에서 줄바꿈 수정)
- **Media`: 행으로 시작하는 경우에만 `MEDIA:` 태그 구문 분석하여 산문 멘션 스트립 방지 (#1206)
- **Media`: 가능한 경우 PNG 알파 유지; 여전히 크기 상한을 초과하면 JPEG로 대체 (#1491) - @robbyczgw-cla 님 감사합니다
- **Skills**: bird Homebrew 설치를 macOS로 게이트 (#1569) - @bradleypriest 님 감사합니다

---

## 업데이트 권장 사항

### 업그레이드 전 확인

새 버전으로 업그레이드하기 전에 다음을 수행하는 것이 좋습니다:

1. **주요 변경사항 읽기**: 구성에 영향을 미치는 주요 변경사항이 있는지 확인
2. **구성 백업**: `~/.clawdbot/clawdbot.json` 백업
3. **진단 실행**: `clawdbot doctor`를 실행하여 현재 시스템 상태가 정상인지 확인
4. **종속성 확인**: Node.js 버전이 요구 사항을 충족하는지 확인(≥22)

### 업그레이드 후 확인

업그레이드가 완료되면 다음 확인을 수행하세요:

```bash
# 1. 버전 확인
clawdbot --version

# 2. 상태 확인
clawdbot status

# 3. 채널 연결 확인
clawdbot channels status

# 4. 메시지 전송 테스트
clawdbot message "Hello" --target=<your-channel>
```

### 전체 업데이트 로그 보기

더 자세한 버전 기록 및 이슈 링크를 보려면 다음을 방문하세요:

- **GitHub Releases**: https://github.com/moltbot/moltbot/releases
- **공식 문서**: https://docs.clawd.bot

---

## 과거 버전

더 이른 버전 업데이트를 보려면 [GitHub Releases](https://github.com/moltbot/moltbot/releases) 또는 프로젝트 루트 디렉토리의 [CHANGELOG.md](https://github.com/moltbot/moltbot/blob/main/CHANGELOG.md)를 방문하세요.

::: tip 기여 참여
버그를 발견하거나 기능 제안이 있으시면 [GitHub Issues](https://github.com/moltbot/moltbot/issues)에 제출해 주세요.
:::
