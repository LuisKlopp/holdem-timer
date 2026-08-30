"use client";

import { TournamentRebuyManagementPage } from "@/components";
import { useElioHoldemGameStore } from "@/store";

export default function ElioHoldemRebuyManagementPage() {
  return (
    <TournamentRebuyManagementPage
      memberManagementHref="/elio-holdem-timer/member-management"
      timerHref="/elio-holdem-timer"
      timerLabel="홀덤 타이머"
      useGameStore={useElioHoldemGameStore}
    />
  );
}
