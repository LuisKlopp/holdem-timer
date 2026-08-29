홀덤 토너먼트 블라인드 타이머 웹앱입니다. 패키지 매니저는 `pnpm` 기준으로 사용합니다.

## Getting Started

의존성 설치:

```bash
pnpm install
```

개발 서버 실행:

```bash
pnpm dev
```

검증 명령어:

```bash
pnpm lint
pnpm build
```

브라우저에서 `http://localhost:1235` 를 열면 타이머 선택 화면이 열립니다.

주요 경로:

- `/`: 타이머 선택
- `/elio-holdem-timer`: 엘리오 홀덤 타이머 - 시즌 2
- `/feedback-tournament-timer`: 피드백 토너먼트 타이머
- `/hall-of-fame`: 시즌 1 명예의전당
- `/podium`: 시즌 2 우승 기록 입력

## 시즌 기록 API

현재 시즌은 `constants/index.ts`의 `CURRENT_SEASON_ID`로 관리합니다.
프론트는 우승 기록 조회/저장/삭제 요청에 `season` 값을 함께 전달합니다.
백엔드는 `/podium-records`, `/podium-records/recent`, `/podium-records/stats`,
`/podium-records/rankings`의 query parameter와 `POST /podium-records` body에서
`season`을 기준으로 기록을 분리해야 합니다.

## 주요 파일

- `app/page.tsx`
- `app/elio-holdem-timer/page.tsx`
- `app/feedback-tournament-timer/page.tsx`
- `app/hall-of-fame/page.tsx`
- `app/podium/page.tsx`
- `components/TournamentTimerPage.tsx`
- `components/TimerDisplay.tsx`
- `components/LevelInfo.tsx`
- `components/ControlPanel.tsx`
- `hooks/useBlindTimer.ts`
- `lib/blindLevels.ts`
