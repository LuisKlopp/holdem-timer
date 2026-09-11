import { TournamentTimerPage } from "@/components";
import { feedbackTournamentBlindLevels } from "@/lib";

export default function FeedbackTournamentTimerPage() {
  return (
    <TournamentTimerPage
      blindMessage="상엽님 핸드 잘부탁드립니다 ^^"
      blindLevels={feedbackTournamentBlindLevels}
      memberManagementHref="/feedback-tournament-timer/member-management"
      title="피드백 토너먼트 타이머"
    />
  );
}
