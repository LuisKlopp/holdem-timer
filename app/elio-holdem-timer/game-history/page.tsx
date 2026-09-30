"use client";

import { TournamentGameHistoryPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";

export default function ElioHoldemGameHistoryPage() {
  return (
    <TournamentGameHistoryPage
      backHref="/elio-holdem-timer"
      gameType="ELIO_HOLDEM"
      seasonId={CURRENT_SEASON.id}
      title="홀덤 타이머"
    />
  );
}
