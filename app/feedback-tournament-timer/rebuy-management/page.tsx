"use client";

import { TournamentRebuyManagementPage } from "@/components";
import { useFeedbackTournamentGameStore } from "@/store";

export default function FeedbackTournamentRebuyManagementPage() {
  return (
    <TournamentRebuyManagementPage
      memberManagementHref="/feedback-tournament-timer/member-management"
      timerHref="/feedback-tournament-timer"
      timerLabel="피드백 토너먼트 타이머"
      useGameStore={useFeedbackTournamentGameStore}
    />
  );
}
