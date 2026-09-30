import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  completeTournamentGame,
  createTournamentGame,
  getActiveTournamentGame,
  getTournamentGames,
  type TournamentGameScope,
} from "@/api";

const getScopeKey = ({ gameType, seasonId }: TournamentGameScope) =>
  [gameType, seasonId] as const;

export const tournamentGameQueryKeys = {
  all: ["tournament-games"] as const,
  active: (scope: TournamentGameScope) =>
    [...tournamentGameQueryKeys.all, ...getScopeKey(scope), "active"] as const,
  detail: (gameId: string) =>
    [...tournamentGameQueryKeys.all, "detail", gameId] as const,
  records: (scope: TournamentGameScope, page: number, limit: number) =>
    [
      ...tournamentGameQueryKeys.all,
      ...getScopeKey(scope),
      "records",
      page,
      limit,
    ] as const,
};

export const useActiveTournamentGame = (scope: TournamentGameScope) =>
  useQuery({
    queryFn: () => getActiveTournamentGame(scope),
    queryKey: tournamentGameQueryKeys.active(scope),
  });

export const useTournamentGames = (
  scope: TournamentGameScope,
  page = 1,
  limit = 20
) =>
  useQuery({
    queryFn: () => getTournamentGames({ ...scope, limit, page }),
    queryKey: tournamentGameQueryKeys.records(scope, page, limit),
  });

const useInvalidateTournamentGames = (scope: TournamentGameScope) => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: [
        ...tournamentGameQueryKeys.all,
        ...getScopeKey(scope),
        "records",
      ],
    });
};

export const useCreateTournamentGame = (scope: TournamentGameScope) => {
  const queryClient = useQueryClient();
  const invalidateTournamentGames = useInvalidateTournamentGames(scope);

  return useMutation({
    mutationFn: createTournamentGame,
    onSuccess: (game) => {
      queryClient.setQueryData(tournamentGameQueryKeys.active(scope), game);
      return invalidateTournamentGames();
    },
  });
};

export const useEndTournamentGame = (scope: TournamentGameScope) => {
  const queryClient = useQueryClient();
  const invalidateTournamentGames = useInvalidateTournamentGames(scope);

  return useMutation({
    mutationFn: completeTournamentGame,
    onSuccess: (game) => {
      queryClient.setQueryData(tournamentGameQueryKeys.active(scope), null);
      queryClient.setQueryData(
        tournamentGameQueryKeys.detail(game.id),
        game
      );
      return invalidateTournamentGames();
    },
  });
};
