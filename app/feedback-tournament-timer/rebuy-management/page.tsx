"use client";

import { TournamentRebuyManagementPage } from "@/components";
import { useFeedbackTournamentRebuyStore } from "@/store";

export default function FeedbackTournamentRebuyManagementPage() {
  return (
    <TournamentRebuyManagementPage
      timerHref="/feedback-tournament-timer"
      timerLabel="피드백 토너먼트 타이머"
      useRebuyStore={useFeedbackTournamentRebuyStore}
    />
  );
}
