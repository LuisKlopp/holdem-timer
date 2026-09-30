"use client";

import { TournamentMemberManagementPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";
import { useFeedbackTournamentGameStore } from "@/store";

export default function FeedbackTournamentMemberManagementPage() {
  return (
    <TournamentMemberManagementPage
      backHref="/feedback-tournament-timer"
      gameType="FEEDBACK_TOURNAMENT"
      seasonId={CURRENT_SEASON.id}
      title="피드백 토너먼트 타이머"
      useGameStore={useFeedbackTournamentGameStore}
    />
  );
}
