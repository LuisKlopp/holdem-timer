"use client";

import { TournamentRebuyManagementPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";
import { useFeedbackTournamentGameStore } from "@/store";

export default function FeedbackTournamentRebuyManagementPage() {
  return (
    <TournamentRebuyManagementPage
      gameType="FEEDBACK_TOURNAMENT"
      memberManagementHref="/feedback-tournament-timer/member-management"
      seasonId={CURRENT_SEASON.id}
      timerHref="/feedback-tournament-timer"
      timerLabel="피드백 토너먼트 타이머"
      useGameStore={useFeedbackTournamentGameStore}
    />
  );
}
