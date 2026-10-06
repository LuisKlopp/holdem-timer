"use client";

import { TournamentTimerPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";
import { feedbackTournamentBlindLevels } from "@/lib";
import { useFeedbackTournamentGameStore } from "@/store";

export default function FeedbackTournamentTimerPage() {
  return (
    <TournamentTimerPage
      blindMessage="상엽님 핸드 잘부탁드립니다 ^^"
      blindLevels={feedbackTournamentBlindLevels}
      gameHistoryHref="/feedback-tournament-timer/game-history"
      gameType="FEEDBACK_TOURNAMENT"
      rebuyManagementHref="/feedback-tournament-timer/rebuy-management"
      seasonId={CURRENT_SEASON.id}
      title="피드백 토너먼트 타이머"
      useGameStore={useFeedbackTournamentGameStore}
    />
  );
}
