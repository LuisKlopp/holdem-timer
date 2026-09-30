import { create } from "zustand";

type RebuyCounts = Record<string, number>;

type GameMember = {
  nickname: string;
};

export type TournamentGameState = {
  rebuyCounts: RebuyCounts;
  selectedMembers: string[];
  clearGame: () => void;
  decrementRebuy: (nickname: string) => void;
  incrementRebuy: (nickname: string) => void;
  resetRebuys: () => void;
  setGameParticipants: (players: GameMember[]) => void;
};

const createInitialRebuyCounts = (
  members: string[],
  currentCounts: RebuyCounts
) =>
  members.reduce<RebuyCounts>((counts, member) => {
    counts[member] = currentCounts[member] ?? 0;

    return counts;
  }, {});

const createTournamentGameStore = () =>
  create<TournamentGameState>((set) => ({
    rebuyCounts: {},
    selectedMembers: [],
    clearGame: () =>
      set((state) => {
        if (
          state.selectedMembers.length === 0 &&
          Object.keys(state.rebuyCounts).length === 0
        ) {
          return state;
        }

        return {
          rebuyCounts: {},
          selectedMembers: [],
        };
      }),
    decrementRebuy: (nickname) =>
      set((state) => ({
        rebuyCounts: {
          ...state.rebuyCounts,
          [nickname]: Math.max(0, (state.rebuyCounts[nickname] ?? 0) - 1),
        },
      })),
    incrementRebuy: (nickname) =>
      set((state) => ({
        rebuyCounts: {
          ...state.rebuyCounts,
          [nickname]: (state.rebuyCounts[nickname] ?? 0) + 1,
        },
      })),
    resetRebuys: () =>
      set((state) => ({
        rebuyCounts: createInitialRebuyCounts(state.selectedMembers, {}),
      })),
    setGameParticipants: (players) =>
      set((state) => {
        const playerNicknames = players.map((player) => player.nickname);
        const hasSamePlayers =
          state.selectedMembers.length === playerNicknames.length &&
          state.selectedMembers.every(
            (nickname, index) => nickname === playerNicknames[index]
          );

        if (hasSamePlayers) {
          return state;
        }

        return {
          rebuyCounts: createInitialRebuyCounts(
            playerNicknames,
            state.rebuyCounts
          ),
          selectedMembers: playerNicknames,
        };
      }),
  }));

export type TournamentGameStore = ReturnType<typeof createTournamentGameStore>;

export const useElioHoldemGameStore = createTournamentGameStore();

export const useFeedbackTournamentGameStore = createTournamentGameStore();
