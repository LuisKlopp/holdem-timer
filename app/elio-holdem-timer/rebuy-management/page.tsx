"use client";

import { TournamentRebuyManagementPage } from "@/components";
import { useElioHoldemRebuyStore } from "@/store";

export default function ElioHoldemRebuyManagementPage() {
  return (
    <TournamentRebuyManagementPage
      timerHref="/elio-holdem-timer"
      timerLabel="홀덤 타이머"
      useRebuyStore={useElioHoldemRebuyStore}
    />
  );
}
