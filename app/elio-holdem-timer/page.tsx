"use client";

import { TournamentTimerPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";
import { useElioHoldemGameStore } from "@/store";

export default function ElioHoldemTimerPage() {
  return (
    <TournamentTimerPage
      gameHistoryHref="/elio-holdem-timer/game-history"
      gameType="ELIO_HOLDEM"
      memberManagementHref="/elio-holdem-timer/member-management"
      podiumSeason={CURRENT_SEASON}
      rebuyManagementHref="/elio-holdem-timer/rebuy-management"
      seasonId={CURRENT_SEASON.id}
      title={`엘리오 홀덤 타이머 - ${CURRENT_SEASON.label}`}
      useGameStore={useElioHoldemGameStore}
    />
  );
}
