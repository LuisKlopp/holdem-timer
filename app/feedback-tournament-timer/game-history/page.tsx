"use client";

import { TournamentGameHistoryPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";

export default function FeedbackTournamentGameHistoryPage() {
  return (
    <TournamentGameHistoryPage
      backHref="/feedback-tournament-timer"
      gameType="FEEDBACK_TOURNAMENT"
      seasonId={CURRENT_SEASON.id}
      title="피드백 토너먼트 타이머"
    />
  );
}
