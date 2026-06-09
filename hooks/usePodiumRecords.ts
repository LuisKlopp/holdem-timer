import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPodiumRecord,
  deletePodiumRecords,
  getPodiumRankings,
  getPodiumRecords,
  getPodiumStats,
  getRecentPodiumRecords,
} from "@/api";

export const podiumQueryKeys = {
  all: ["podium"] as const,
  rankings: (limit: number) =>
    [...podiumQueryKeys.all, "rankings", limit] as const,
  recent: (limit: number) => [...podiumQueryKeys.all, "recent", limit] as const,
  records: (page: number, limit: number) =>
    [...podiumQueryKeys.all, "records", page, limit] as const,
  stats: () => [...podiumQueryKeys.all, "stats"] as const,
};

export const usePodiumRecords = (page = 1, limit = 20) =>
  useQuery({
    queryFn: () => getPodiumRecords(page, limit),
    queryKey: podiumQueryKeys.records(page, limit),
  });

export const useRecentPodiumRecords = (limit = 5) =>
  useQuery({
    queryFn: () => getRecentPodiumRecords(limit),
    queryKey: podiumQueryKeys.recent(limit),
  });

export const usePodiumStats = () =>
  useQuery({
    queryFn: getPodiumStats,
    queryKey: podiumQueryKeys.stats(),
  });

export const usePodiumRankings = (limit = 100) =>
  useQuery({
    queryFn: () => getPodiumRankings(limit),
    queryKey: podiumQueryKeys.rankings(limit),
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

export const useDeletePodiumRecords = () => {
  const invalidatePodiumQueries = useInvalidatePodiumQueries();

  return useMutation({
    mutationFn: deletePodiumRecords,
    onSuccess: invalidatePodiumQueries,
  });
};
