import { create } from "zustand";

type GameMember = {
  nickname: string;
};

export type TournamentGameState = {
  selectedMembers: string[];
  clearGame: () => void;
  setGameParticipants: (players: GameMember[]) => void;
};

const createTournamentGameStore = () =>
  create<TournamentGameState>((set) => ({
    selectedMembers: [],
    clearGame: () =>
      set((state) => {
        if (state.selectedMembers.length === 0) {
          return state;
        }

        return {
          selectedMembers: [],
        };
      }),
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
          selectedMembers: playerNicknames,
        };
      }),
  }));

export type TournamentGameStore = ReturnType<typeof createTournamentGameStore>;

export const useElioHoldemGameStore = createTournamentGameStore();

export const useFeedbackTournamentGameStore = createTournamentGameStore();
