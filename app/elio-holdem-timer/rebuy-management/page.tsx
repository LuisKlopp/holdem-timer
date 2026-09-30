"use client";

import { TournamentRebuyManagementPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";
import { useElioHoldemGameStore } from "@/store";

export default function ElioHoldemRebuyManagementPage() {
  return (
    <TournamentRebuyManagementPage
      gameType="ELIO_HOLDEM"
      memberManagementHref="/elio-holdem-timer/member-management"
      seasonId={CURRENT_SEASON.id}
      timerHref="/elio-holdem-timer"
      timerLabel="홀덤 타이머"
      useGameStore={useElioHoldemGameStore}
    />
  );
}
