import { TournamentTimerPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";

export default function ElioHoldemTimerPage() {
  return (
    <TournamentTimerPage
      memberManagementHref="/elio-holdem-timer/member-management"
      podiumSeason={CURRENT_SEASON}
      title={`엘리오 홀덤 타이머 - ${CURRENT_SEASON.label}`}
    />
  );
}
