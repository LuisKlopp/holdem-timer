"use client";

import {
  ArrowLeft,
  Check,
  Loader2,
  Play,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import {
  getGameApiErrorMessage,
  getPodiumApiErrorMessage,
  getTournamentGameDealer,
  getTournamentGamePlayers,
  type HoldemMember,
  type TournamentGameType,
} from "@/api";
import {
  useActiveTournamentGame,
  useCreateTournamentGame,
  useHoldemMembers,
} from "@/hooks";
import type { TournamentGameStore } from "@/store";

type TournamentMemberManagementPageProps = {
  backHref: string;
  gameType: TournamentGameType;
  seasonId: number;
  title: string;
  useGameStore: TournamentGameStore;
};

export function TournamentMemberManagementPage({
  backHref,
  gameType,
  seasonId,
  title,
  useGameStore,
}: TournamentMemberManagementPageProps) {
  const router = useRouter();
  const gameScope = useMemo(
    () => ({ gameType, seasonId }),
    [gameType, seasonId]
  );
  const membersQuery = useHoldemMembers();
  const activeGameQuery = useActiveTournamentGame(gameScope);
  const createGameMutation = useCreateTournamentGame(gameScope);
  const setGameParticipants = useGameStore(
    (state) => state.setGameParticipants
  );
  const [selectionMode, setSelectionMode] = useState<"players" | "dealer">(
    "players"
  );
  const [players, setPlayers] = useState<HoldemMember[]>([]);
  const [dealer, setDealer] = useState<HoldemMember | null>(null);
  const activeGame = activeGameQuery.data ?? null;
  const activePlayers = activeGame ? getTournamentGamePlayers(activeGame) : [];
  const activeDealer = activeGame ? getTournamentGameDealer(activeGame) : null;
  const playerIds = players.map((player) => player.id);
  const canStartGame =
    playerIds.length >= 1 &&
    playerIds.length <= 10 &&
    new Set(playerIds).size === playerIds.length &&
    dealer !== null &&
    !playerIds.includes(dealer.id);

  const handleStartGame = () => {
    if (activeGameQuery.isError) {
      return;
    }

    if (activeGame) {
      router.push(backHref);
      return;
    }

    if (!canStartGame || !dealer) {
      return;
    }

    createGameMutation.mutate(
      {
        ...gameScope,
        dealerId: dealer.id,
        playerIds,
      },
      {
        onSuccess: (game) => {
          const savedPlayers = getTournamentGamePlayers(game);
          const savedDealer = getTournamentGameDealer(game);

          if (savedDealer) {
            setGameParticipants(
              savedPlayers.map((player) => ({
                nickname: player.nicknameSnapshot,
              }))
            );
          }

          router.push(backHref);
        },
      }
    );
  };

  const handleMemberClick = (member: HoldemMember) => {
    if (activeGame || createGameMutation.isPending) {
      return;
    }

    const isPlayer = playerIds.includes(member.id);

    if (selectionMode === "dealer") {
      if (!isPlayer) {
        setDealer((currentDealer) =>
          currentDealer?.id === member.id ? null : member
        );
      }
      return;
    }

    if (dealer?.id === member.id) {
      return;
    }

    if (isPlayer) {
      setPlayers((currentPlayers) =>
        currentPlayers.filter((player) => player.id !== member.id)
      );
      return;
    }

    if (players.length < 10) {
      setPlayers((currentPlayers) => [...currentPlayers, member]);

      if (players.length === 9) {
        setSelectionMode("dealer");
      }
    }
  };

  const displayedPlayerCount = activeGame
    ? activePlayers.length
    : players.length;
  const displayedDealerNickname = activeGame
    ? activeDealer?.nicknameSnapshot
    : dealer?.nickname;

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#050816] px-4 py-5 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-2.5rem)] max-w-3xl flex-col gap-5">
        <header className="flex items-center justify-between gap-3">
          <Link
            className="btn-press-in flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/80 transition hover:bg-white/10"
            href={backHref}
            aria-label={`${title}로 돌아가기`}
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/60 uppercase">
              Member
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">게임 설정</h1>
          </div>

          <div className="w-11" />
        </header>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/58">
                {activeGame ? "진행 중인 게임" : "이번 게임"}
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="text-3xl font-black text-amber-100">
                  {displayedPlayerCount}명 / 최대 10명
                </p>
                <p className="max-w-full text-sm font-bold break-words text-sky-100">
                  딜러 {displayedDealerNickname ?? "미지정"}
                </p>
              </div>
            </div>

            <button
              className="btn-press-in inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-200 px-5 text-base font-black text-black transition disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/35"
              type="button"
              disabled={
                activeGameQuery.isPending ||
                activeGameQuery.isError ||
                createGameMutation.isPending ||
                (!activeGame && !canStartGame)
              }
              onClick={handleStartGame}
            >
              {createGameMutation.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
              {activeGame
                ? "타이머로 돌아가기"
                : createGameMutation.isPending
                  ? "게임 시작 중"
                  : "게임 시작!"}
            </button>
          </div>

          {createGameMutation.isError ? (
            <p className="mt-3 text-sm font-semibold text-rose-200">
              {getGameApiErrorMessage(
                createGameMutation.error,
                "게임을 시작하지 못했습니다."
              )}
            </p>
          ) : null}
        </section>

        {activeGameQuery.isError ? (
          <section className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-center">
            <p className="text-sm font-semibold text-rose-100">
              {getGameApiErrorMessage(
                activeGameQuery.error,
                "진행 중인 게임을 확인하지 못했습니다."
              )}
            </p>
            <button
              className="btn-press-in mt-3 min-h-10 rounded-full border border-rose-200/20 px-4 text-xs font-bold text-rose-100"
              type="button"
              onClick={() => void activeGameQuery.refetch()}
            >
              다시 시도
            </button>
          </section>
        ) : null}

        <section className="min-h-0 flex-1 rounded-[1.5rem] border border-white/10 bg-black/18 p-4 backdrop-blur-sm">
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-black/20 p-1.5">
            <button
              className={
                selectionMode === "players"
                  ? "btn-press-in flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-200 text-sm font-black text-black"
                  : "btn-press-in flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white/50 hover:bg-white/6"
              }
              type="button"
              disabled={Boolean(activeGame)}
              onClick={() => setSelectionMode("players")}
            >
              <Users size={17} />
              플레이어 선택
            </button>
            <button
              className={
                selectionMode === "dealer"
                  ? "btn-press-in flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-200 text-sm font-black text-sky-950"
                  : "btn-press-in flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white/50 hover:bg-white/6"
              }
              type="button"
              disabled={Boolean(activeGame)}
              onClick={() => setSelectionMode("dealer")}
            >
              <UserRound size={17} />
              딜러 선택
            </button>
          </div>

          {activeGame ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {activePlayers.map((participant) => (
                <div
                  className="flex min-h-13 items-center justify-between gap-2 rounded-2xl border border-amber-200/50 bg-amber-200 px-3 text-sm font-black text-black"
                  key={participant.id}
                >
                  <span className="min-w-0 break-words">
                    {participant.nicknameSnapshot}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[10px]">
                    참가 <Check size={16} />
                  </span>
                </div>
              ))}
              {activeDealer ? (
                <div className="flex min-h-13 items-center justify-between gap-2 rounded-2xl border border-sky-200/50 bg-sky-200 px-3 text-sm font-black text-sky-950">
                  <span className="min-w-0 break-words">
                    {activeDealer.nicknameSnapshot}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[10px]">
                    딜러 <Check size={16} />
                  </span>
                </div>
              ) : null}
            </div>
          ) : membersQuery.isPending || activeGameQuery.isPending ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-white/60">
              <Loader2 className="animate-spin" size={28} />
              <p className="text-base font-semibold">
                게임 정보를 불러오는 중입니다.
              </p>
            </div>
          ) : membersQuery.isError ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <p className="text-base font-semibold text-rose-100">
                {getPodiumApiErrorMessage(
                  membersQuery.error,
                  "멤버를 불러오지 못했습니다."
                )}
              </p>
              <button
                className="btn-press-in mt-4 min-h-10 rounded-full border border-rose-200/20 px-4 text-xs font-bold text-rose-100"
                type="button"
                onClick={() => void membersQuery.refetch()}
              >
                다시 시도
              </button>
            </div>
          ) : membersQuery.data.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {membersQuery.data.map((member) => {
                const isSelected = playerIds.includes(member.id);
                const isDealer = dealer?.id === member.id;
                const isRoleConflict =
                  selectionMode === "players" ? isDealer : isSelected;
                const isLimitReached =
                  selectionMode === "players" &&
                  players.length >= 10 &&
                  !isSelected;

                return (
                  <button
                    className={
                      isDealer
                        ? "btn-press-in flex min-h-13 items-center justify-between gap-2 rounded-2xl border border-sky-200/50 bg-sky-200 px-3 text-left text-sm font-black text-sky-950 shadow-[0_10px_26px_rgba(125,211,252,0.16)] disabled:cursor-not-allowed disabled:opacity-35"
                        : isSelected
                          ? "btn-press-in flex min-h-13 items-center justify-between gap-2 rounded-2xl border border-amber-200/50 bg-amber-200 px-3 text-left text-sm font-black text-black shadow-[0_10px_26px_rgba(251,191,36,0.2)] disabled:cursor-not-allowed disabled:opacity-35"
                          : "btn-press-in flex min-h-13 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 text-left text-sm font-bold text-white/82 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                    }
                    type="button"
                    disabled={isRoleConflict || isLimitReached}
                    key={member.id}
                    onClick={() => handleMemberClick(member)}
                  >
                    <span className="min-w-0 break-words">
                      {member.nickname}
                    </span>
                    {isSelected || isDealer ? (
                      <span className="flex shrink-0 items-center gap-1 text-[10px] font-black">
                        {isDealer ? "딜러" : "참가"}
                        <Check size={16} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-80 items-center justify-center text-center">
              <p className="text-base font-semibold text-white/55">
                서버에서 가져온 멤버가 없습니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
