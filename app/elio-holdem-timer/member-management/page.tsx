"use client";

import { TournamentMemberManagementPage } from "@/components";
import { useElioHoldemGameStore } from "@/store";

export default function ElioHoldemMemberManagementPage() {
  return (
    <TournamentMemberManagementPage
      backHref="/elio-holdem-timer"
      rebuyManagementHref="/elio-holdem-timer/rebuy-management"
      title="홀덤 타이머"
      useGameStore={useElioHoldemGameStore}
    />
  );
}
