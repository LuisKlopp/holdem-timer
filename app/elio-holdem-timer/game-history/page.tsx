"use client";

import { TournamentGameHistoryPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";

export default function ElioHoldemGameHistoryPage() {
  return (
    <TournamentGameHistoryPage
      backHref="/podium"
      gameType="ELIO_HOLDEM"
      seasonId={CURRENT_SEASON.id}
      title="시즌 2 기록 입력"
    />
  );
}
