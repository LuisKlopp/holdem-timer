import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPodiumRecord,
  deletePodiumRecords,
  getPodiumRankings,
  getPodiumRecords,
  getPodiumStats,
  getRecentPodiumRecords,
} from "@/api";
import { CURRENT_SEASON_ID } from "@/constants";

export const podiumQueryKeys = {
  all: ["podium"] as const,
  rankings: (season: number, limit: number) =>
    [...podiumQueryKeys.all, "season", season, "rankings", limit] as const,
  recent: (season: number, limit: number) =>
    [...podiumQueryKeys.all, "season", season, "recent", limit] as const,
  records: (season: number, page: number, limit: number) =>
    [...podiumQueryKeys.all, "season", season, "records", page, limit] as const,
  stats: (season: number) =>
    [...podiumQueryKeys.all, "season", season, "stats"] as const,
};

export const usePodiumRecords = (
  season = CURRENT_SEASON_ID,
  page = 1,
  limit = 20
) =>
  useQuery({
    queryFn: () => getPodiumRecords(season, page, limit),
    queryKey: podiumQueryKeys.records(season, page, limit),
  });

export const useRecentPodiumRecords = (season = CURRENT_SEASON_ID, limit = 5) =>
  useQuery({
    queryFn: () => getRecentPodiumRecords(season, limit),
    queryKey: podiumQueryKeys.recent(season, limit),
  });

export const usePodiumStats = (season = CURRENT_SEASON_ID, enabled = true) =>
  useQuery({
    enabled,
    queryFn: () => getPodiumStats(season),
    queryKey: podiumQueryKeys.stats(season),
  });

export const usePodiumRankings = (season = CURRENT_SEASON_ID, limit = 100) =>
  useQuery({
    queryFn: () => getPodiumRankings(season, limit),
    queryKey: podiumQueryKeys.rankings(season, limit),
  });

const useInvalidatePodiumQueries = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: podiumQueryKeys.all,
    });
};

export const useCreatePodiumRecord = () => {
  const invalidatePodiumQueries = useInvalidatePodiumQueries();

  return useMutation({
    mutationFn: createPodiumRecord,
    onSuccess: invalidatePodiumQueries,
  });
};

export const useDeletePodiumRecords = (season = CURRENT_SEASON_ID) => {
  const invalidatePodiumQueries = useInvalidatePodiumQueries();

  return useMutation({
    mutationFn: () => deletePodiumRecords(season),
    onSuccess: invalidatePodiumQueries,
  });
};
