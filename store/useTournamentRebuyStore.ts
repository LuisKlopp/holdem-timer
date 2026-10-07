import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { HoldemMember } from "@/api";

type RebuyEntry = {
  count: number;
  memberId: number;
  nicknameSnapshot: string;
};

type TodayMember = Pick<HoldemMember, "id" | "nickname">;

export type TournamentRebuyState = {
  entries: Record<string, RebuyEntry>;
  hasHydrated: boolean;
  todayMembers: TodayMember[];
  decrementRebuy: (memberId: number) => void;
  incrementRebuy: (member: TodayMember) => void;
  resetRebuys: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setTodayMembers: (members: TodayMember[]) => void;
};

const createTournamentRebuyStore = (storageKey: string) =>
  create<TournamentRebuyState>()(
    persist(
      (set) => ({
        entries: {},
        hasHydrated: false,
        todayMembers: [],
        decrementRebuy: (memberId) =>
          set((state) => {
            const key = String(memberId);
            const entry = state.entries[key];

            if (!entry) {
              return state;
            }

            if (entry.count <= 1) {
              const entries = { ...state.entries };
              delete entries[key];

              return { entries };
            }

            return {
              entries: {
                ...state.entries,
                [key]: {
                  ...entry,
                  count: entry.count - 1,
                },
              },
            };
          }),
        incrementRebuy: (member) =>
          set((state) => {
            const key = String(member.id);
            const entry = state.entries[key];

            return {
              entries: {
                ...state.entries,
                [key]: {
                  count: (entry?.count ?? 0) + 1,
                  memberId: member.id,
                  nicknameSnapshot: member.nickname,
                },
              },
            };
          }),
        resetRebuys: () => set({ entries: {}, todayMembers: [] }),
        setHasHydrated: (hasHydrated) => set({ hasHydrated }),
        setTodayMembers: (members) =>
          set((state) => {
            const uniqueMembers = Array.from(
              new Map(members.map((member) => [member.id, member])).values()
            );

            if (uniqueMembers.length === 0) {
              return state;
            }

            return {
              todayMembers: uniqueMembers.map((member) => ({
                id: member.id,
                nickname: member.nickname,
              })),
            };
          }),
      }),
      {
        name: storageKey,
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
        partialize: (state) => ({
          entries: state.entries,
          todayMembers: state.todayMembers,
        }),
        skipHydration: true,
        storage: createJSONStorage(() => localStorage),
      }
    )
  );

export type TournamentRebuyStore = ReturnType<
  typeof createTournamentRebuyStore
>;

export const useElioHoldemRebuyStore = createTournamentRebuyStore(
  "holdem-timer:rebuy:elio-holdem"
);

export const useFeedbackTournamentRebuyStore = createTournamentRebuyStore(
  "holdem-timer:rebuy:feedback-tournament"
);
