import { TournamentTimerPage } from "@/components";
import { feedbackTournamentBlindLevels } from "@/lib";

export default function FeedbackTournamentTimerPage() {
  return (
    <TournamentTimerPage
      blindLevels={feedbackTournamentBlindLevels}
      memberManagementHref="/feedback-tournament-timer/member-management"
      storageKey="feedback-tournament-game-members"
      title="피드백 토너먼트 타이머"
    />
  );
}
