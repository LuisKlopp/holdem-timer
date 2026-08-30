"use client";

import { TournamentMemberManagementPage } from "@/components";
import { useFeedbackTournamentGameStore } from "@/store";

export default function FeedbackTournamentMemberManagementPage() {
  return (
    <TournamentMemberManagementPage
      backHref="/feedback-tournament-timer"
      rebuyManagementHref="/feedback-tournament-timer/rebuy-management"
      title="피드백 토너먼트 타이머"
      useGameStore={useFeedbackTournamentGameStore}
    />
  );
}
