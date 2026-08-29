export const CURRENT_SEASON_ID = 2;

export const HOLD_EM_SEASONS = [
  {
    id: 1,
    label: "시즌 1",
    period: "2026년 5월 ~ 8월",
    prize: {
      firstPlace: "신세계 상품권 7만원",
      secondPlace: "신세계 상품권 3만원",
    },
    status: "closed",
  },
  {
    id: 2,
    label: "시즌 2",
    period: "진행 중",
    prize: null,
    status: "active",
  },
] as const;

export const CURRENT_SEASON = HOLD_EM_SEASONS.find(
  (season) => season.id === CURRENT_SEASON_ID
)!;

export const SEASON_ONE = HOLD_EM_SEASONS[0];
