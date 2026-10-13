"use client";

import { TournamentGameHistoryPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";

export default function FeedbackTournamentGameHistoryPage() {
  return (
    <TournamentGameHistoryPage
      backHref="/podium"
      gameType="FEEDBACK_TOURNAMENT"
      seasonId={CURRENT_SEASON.id}
      title="시즌 2 기록 입력"
    />
  );
}
