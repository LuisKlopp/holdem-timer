import axios, { AxiosError } from "axios";

export type PodiumRecord = {
  id: string;
  firstPlace: string;
  secondPlace: string;
  createdAt: string;
};

export type PodiumStats = {
  recentWinner: string | null;
  topWinner: string | null;
  topWinnerWins: number;
  totalGames: number;
};

export type PodiumRanking = {
  name: string;
  wins: number;
  lastWinAt: string;
};

export type PaginatedPodiumRecords = {
  items: PodiumRecord[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

type CreatePodiumRecordRequest = {
  firstPlace: string;
  secondPlace: string;
};

type DeletePodiumRecordsResponse = {
  deletedCount: number;
};

type ApiErrorResponse = {
  message?: string | string[];
};

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "");

const podiumApi = axios.create({
  baseURL: apiUrl,
});

const requireApiUrl = () => {
  if (!apiUrl) {
    throw new Error(
      "홀덤 API 주소가 설정되지 않았습니다. NEXT_PUBLIC_BASE_URL을 확인해 주세요."
    );
  }
};

export const getPodiumRecords = async (page = 1, limit = 20) => {
  requireApiUrl();
  const response = await podiumApi.get<PaginatedPodiumRecords>(
    "/podium-records",
    {
      params: { limit, page },
    }
  );

  return response.data;
};

export const getRecentPodiumRecords = async (limit = 5) => {
  requireApiUrl();
  const response = await podiumApi.get<PodiumRecord[]>(
    "/podium-records/recent",
    {
      params: { limit },
    }
  );

  return response.data;
};

export const getPodiumStats = async () => {
  requireApiUrl();
  const response = await podiumApi.get<PodiumStats>("/podium-records/stats");

  return response.data;
};

export const getPodiumRankings = async (limit = 100) => {
  requireApiUrl();
  const response = await podiumApi.get<PodiumRanking[]>(
    "/podium-records/rankings",
    {
      params: { limit },
    }
  );

  return response.data;
};

export const createPodiumRecord = async (
  request: CreatePodiumRecordRequest
) => {
  requireApiUrl();
  const response = await podiumApi.post<PodiumRecord>(
    "/podium-records",
    request
  );

  return response.data;
};

export const deletePodiumRecords = async () => {
  requireApiUrl();
  const response =
    await podiumApi.delete<DeletePodiumRecordsResponse>("/podium-records");

  return response.data;
};

export const getPodiumApiErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (error instanceof Error && !(error instanceof AxiosError)) {
    return error.message;
  }

  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallbackMessage;
  }

  if (error.response?.status === 403) {
    return "현재 전체 삭제 기능이 비활성화되어 있습니다.";
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

  return fallbackMessage;
};
