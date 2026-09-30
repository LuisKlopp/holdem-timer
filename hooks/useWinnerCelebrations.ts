"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useEffectEvent } from "react";

import {
  createWinnerCelebration,
  getWinnerCelebrationStreamUrl,
  isWinnerCelebration,
  type TournamentGameScope,
  type WinnerCelebration,
} from "@/api";

export const useCreateWinnerCelebration = () =>
  useMutation({
    mutationFn: createWinnerCelebration,
  });

export const useWinnerCelebrationStream = (
  scope: TournamentGameScope,
  onCelebration: (celebration: WinnerCelebration) => void
) => {
  const handleCelebration = useEffectEvent(onCelebration);

  useEffect(() => {
    let eventSource: EventSource;

    try {
      eventSource = new EventSource(getWinnerCelebrationStreamUrl(scope));
    } catch {
      return;
    }

    const handleMessage = (event: MessageEvent<string>) => {
      try {
        const celebration: unknown = JSON.parse(event.data);

        if (isWinnerCelebration(celebration)) {
          handleCelebration(celebration);
        }
      } catch {
        // 잘못된 이벤트 하나가 이후 SSE 수신을 중단시키지 않도록 무시합니다.
      }
    };

    eventSource.addEventListener("winner-celebration", handleMessage);

    return () => {
      eventSource.removeEventListener("winner-celebration", handleMessage);
      eventSource.close();
    };
  }, [scope.gameType, scope.seasonId]);
};
