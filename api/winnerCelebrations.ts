import axios from "axios";

import type { TournamentGameScope } from "./games";

export type WinnerCelebration = TournamentGameScope & {
  id: string;
  memberId: number;
  nicknameSnapshot: string;
};

export type CreateWinnerCelebrationInput = TournamentGameScope & {
  memberId: number;
};

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");

const winnerCelebrationsApi = axios.create({
  baseURL: apiUrl,
});

const requireApiUrl = () => {
  if (!apiUrl) {
    throw new Error(
      "홀덤 API 주소가 설정되지 않았습니다. NEXT_PUBLIC_BASE_URL을 확인해 주세요."
    );
  }

  return apiUrl;
};

export const createWinnerCelebration = async (
  input: CreateWinnerCelebrationInput
) => {
  requireApiUrl();
  const response = await winnerCelebrationsApi.post<WinnerCelebration>(
    "/winner-celebrations",
    input
  );

  return response.data;
};

export const getWinnerCelebrationStreamUrl = ({
  gameType,
  seasonId,
}: TournamentGameScope) => {
  const searchParams = new URLSearchParams({
    gameType,
    seasonId: String(seasonId),
  });

  return `${requireApiUrl()}/winner-celebrations/stream?${searchParams.toString()}`;
};

export const isWinnerCelebration = (
  value: unknown
): value is WinnerCelebration => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const celebration = value as Partial<WinnerCelebration>;

  return (
    typeof celebration.id === "string" &&
    typeof celebration.memberId === "number" &&
    typeof celebration.nicknameSnapshot === "string" &&
    typeof celebration.gameType === "string" &&
    typeof celebration.seasonId === "number"
  );
};
