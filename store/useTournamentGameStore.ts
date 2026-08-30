import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type RebuyCounts = Record<string, number>;

export type TournamentGameState = {
  rebuyCounts: RebuyCounts;
  selectedMembers: string[];
  gameStartedAt: string | null;
  clearGame: () => void;
  decrementRebuy: (nickname: string) => void;
  incrementRebuy: (nickname: string) => void;
  startGame: (members: string[]) => void;
  toggleSelectedMember: (nickname: string) => void;
};

const createInitialRebuyCounts = (
  members: string[],
  currentCounts: RebuyCounts
) =>
  members.reduce<RebuyCounts>((counts, member) => {
    counts[member] = currentCounts[member] ?? 0;

    return counts;
  }, {});

const createTournamentGameStore = (storageKey: string) =>
  create<TournamentGameState>()(
    persist(
      (set) => ({
        gameStartedAt: null,
        rebuyCounts: {},
        selectedMembers: [],
        clearGame: () =>
          set({
            gameStartedAt: null,
            rebuyCounts: {},
            selectedMembers: [],
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
        startGame: (members) =>
          set((state) => ({
            gameStartedAt: new Date().toISOString(),
            rebuyCounts: createInitialRebuyCounts(members, state.rebuyCounts),
            selectedMembers: members,
          })),
        toggleSelectedMember: (nickname) =>
          set((state) => ({
            selectedMembers: state.selectedMembers.includes(nickname)
              ? state.selectedMembers.filter((member) => member !== nickname)
              : [...state.selectedMembers, nickname],
          })),
      }),
      {
        name: storageKey,
        storage: createJSONStorage(() => localStorage),
      }
    )
  );

export type TournamentGameStore = ReturnType<typeof createTournamentGameStore>;

export const useElioHoldemGameStore = createTournamentGameStore(
  "elio-holdem-game-state"
);

export const useFeedbackTournamentGameStore = createTournamentGameStore(
  "feedback-tournament-game-state"
);
