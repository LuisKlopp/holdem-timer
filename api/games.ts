import axios, { AxiosError } from "axios";

export type TournamentGameType = "ELIO_HOLDEM" | "FEEDBACK_TOURNAMENT";

export type TournamentGameStatus = "ACTIVE" | "COMPLETED";

export type TournamentGameParticipant = {
  id: number;
  memberId: number | null;
  nicknameSnapshot: string;
  role: "PLAYER" | "DEALER";
  sortOrder: number | null;
};

export type TournamentGameRecord = {
  id: string;
  gameType: TournamentGameType;
  seasonId: number;
  status: TournamentGameStatus;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  updatedAt: string;
  participants: TournamentGameParticipant[];
};

export type PaginatedTournamentGames = {
  items: TournamentGameRecord[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export type TournamentGameScope = {
  gameType: TournamentGameType;
  seasonId: number;
};

export type CreateTournamentGameInput = TournamentGameScope & {
  playerIds: number[];
  dealerId: number;
};

type ApiErrorResponse = {
  message?: string | string[];
};

type WrappedResponse<T> = T | { data: T };

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");

const gamesApi = axios.create({
  baseURL: apiUrl,
});

const requireApiUrl = () => {
  if (!apiUrl) {
    throw new Error(
      "홀덤 API 주소가 설정되지 않았습니다. NEXT_PUBLIC_BASE_URL을 확인해 주세요."
    );
  }
};

const unwrapResponse = <T>(response: WrappedResponse<T>): T => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Object.keys(response).length === 1
  ) {
    return response.data;
  }

  return response as T;
};

const validateCreateTournamentGameInput = ({
  dealerId,
  playerIds,
}: CreateTournamentGameInput) => {
  if (playerIds.length < 1 || playerIds.length > 10) {
    throw new Error("플레이어는 1명 이상 10명 이하로 선택해 주세요.");
  }

  if (new Set(playerIds).size !== playerIds.length) {
    throw new Error("같은 플레이어를 중복으로 선택할 수 없습니다.");
  }

  if (!Number.isInteger(dealerId)) {
    throw new Error("딜러를 1명 선택해 주세요.");
  }

  if (playerIds.includes(dealerId)) {
    throw new Error("딜러와 플레이어는 중복될 수 없습니다.");
  }
};

export const getTournamentGamePlayers = (game: TournamentGameRecord) =>
  game.participants
    .filter((participant) => participant.role === "PLAYER")
    .sort(
      (left, right) =>
        (left.sortOrder ?? Number.MAX_SAFE_INTEGER) -
        (right.sortOrder ?? Number.MAX_SAFE_INTEGER)
    );

export const getTournamentGameDealer = (game: TournamentGameRecord) =>
  game.participants.find((participant) => participant.role === "DEALER") ??
  null;

export const createTournamentGame = async (
  input: CreateTournamentGameInput
) => {
  requireApiUrl();
  validateCreateTournamentGameInput(input);

  const response = await gamesApi.post<WrappedResponse<TournamentGameRecord>>(
    "/games",
    input
  );

  return unwrapResponse(response.data);
};

export const getActiveTournamentGame = async ({
  gameType,
  seasonId,
}: TournamentGameScope) => {
  requireApiUrl();
  const response = await gamesApi.get<
    WrappedResponse<TournamentGameRecord | null>
  >("/games/active", {
    params: { gameType, seasonId },
  });

  return unwrapResponse(response.data);
};

export const completeTournamentGame = async (gameId: string) => {
  requireApiUrl();
  const response = await gamesApi.patch<WrappedResponse<TournamentGameRecord>>(
    `/games/${gameId}/complete`
  );

  return unwrapResponse(response.data);
};

export const getTournamentGame = async (gameId: string) => {
  requireApiUrl();
  const response = await gamesApi.get<WrappedResponse<TournamentGameRecord>>(
    `/games/${gameId}`
  );

  return unwrapResponse(response.data);
};

export const getTournamentGames = async ({
  gameType,
  limit = 20,
  page = 1,
  seasonId,
}: TournamentGameScope & { limit?: number; page?: number }) => {
  requireApiUrl();
  const response = await gamesApi.get<
    WrappedResponse<PaginatedTournamentGames>
  >("/games", {
    params: {
      gameType,
      limit,
      page,
      seasonId,
      status: "COMPLETED" satisfies TournamentGameStatus,
    },
  });

  return unwrapResponse(response.data);
};

export const getGameApiErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof Error && !(error instanceof AxiosError)) {
    return error.message;
  }

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  const responseMessage = error.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(" ");
  }

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (!error.response) {
    return "서버에 연결할 수 없습니다. 네트워크와 API 주소를 확인해 주세요.";
  }

  if (error.response.status === 404) {
    return "게임을 찾을 수 없습니다. 게임 상태를 다시 확인해 주세요.";
  }

  if (error.response.status === 409) {
    return "게임 상태가 이미 변경되었습니다. 새로고침 후 다시 시도해 주세요.";
  }

  return fallbackMessage;
};
