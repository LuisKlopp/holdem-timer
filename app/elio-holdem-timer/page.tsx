import { TournamentTimerPage } from "@/components";
import { CURRENT_SEASON } from "@/constants";

export default function ElioHoldemTimerPage() {
  return (
    <TournamentTimerPage
      podiumSeason={CURRENT_SEASON}
      storageKey={`elio-holdem-game-members-season-${CURRENT_SEASON.id}`}
      title={`엘리오 홀덤 타이머 - ${CURRENT_SEASON.label}`}
    />
  );
}
