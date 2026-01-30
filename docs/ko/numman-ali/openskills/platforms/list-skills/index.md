
---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트: 2026-01-24

| 기능        | 파일 경로                                                                                   | 행 번호    |
|--- | --- | ---|
| list 명령 구현 | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 7-43    |
| 모든 스킬 찾기 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64   |
| 검색 디렉토리 설정 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 18-25   |
| Skill 타입 정의 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-6     |

**핵심 함수**:
- `listSkills()`: 설치된 모든 스킬 나열, 형식화된 출력
- `findAllSkills()`: 4개 검색 디렉토리 순회, 모든 스킬 수집
- `getSearchDirs()`: 4개 검색 디렉토리 경로 반환(우선순위 순)

**핵심 상수**:
- 없음(검색 디렉토리 경로는 동적으로 계산됨)

**핵심 로직**:
1. **중복 제거 메커니즘**: `Set`을 사용하여 이미 처리된 스킬 이름 기록(skills.ts:32-33, 43, 57)
2. **위치 판단**: `dir.includes(process.cwd())`를 통해 project 디렉토리인지 판단(skills.ts:48)
3. **정렬 규칙**: project 우선, 동일 위치 내에서는 알파벳 순서(list.ts:21-26)

</details>
