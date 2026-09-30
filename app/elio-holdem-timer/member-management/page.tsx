"use client";

import { TournamentMemberManagementPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";
import { useElioHoldemGameStore } from "@/store";

export default function ElioHoldemMemberManagementPage() {
  return (
    <TournamentMemberManagementPage
      backHref="/elio-holdem-timer"
      gameType="ELIO_HOLDEM"
      seasonId={CURRENT_SEASON.id}
      title="홀덤 타이머"
      useGameStore={useElioHoldemGameStore}
    />
  );
}
