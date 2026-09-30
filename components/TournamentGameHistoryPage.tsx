"use client";

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  History,
  Loader2,
  UserRound,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  getGameApiErrorMessage,
  getTournamentGameDealer,
  getTournamentGamePlayers,
  type TournamentGameRecord,
  type TournamentGameType,
} from "@/api";
import { useTournamentGames } from "@/hooks";

type TournamentGameHistoryPageProps = {
  backHref: string;
  gameType: TournamentGameType;
  seasonId: number;
  title: string;
};

const formatGameDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(value));

const formatGameTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

function GameHistoryCard({ game }: { game: TournamentGameRecord }) {
  const players = getTournamentGamePlayers(game);
  const dealer = getTournamentGameDealer(game);

  return (
    <details className="group rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm sm:p-5">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-amber-100/70">
              <CalendarDays size={16} />
              <p className="text-xs font-bold">
                {formatGameDate(game.startedAt)}
              </p>
            </div>
            <p className="mt-2 text-xl font-black text-white">
              {formatGameTime(game.startedAt)}
              <span className="mx-2 text-white/25">–</span>
              {game.endedAt ? formatGameTime(game.endedAt) : "진행 중"}
            </p>
            <p className="mt-2 text-sm font-semibold text-white/52">
              참가자 {players.length}명 · 딜러{" "}
              {dealer?.nicknameSnapshot ?? "확인 불가"}
            </p>
          </div>
          <ChevronDown
            className="mt-1 shrink-0 text-white/45 transition group-open:rotate-180"
            size={20}
          />
        </div>
      </summary>

      <div className="mt-4 grid gap-4 border-t border-white/8 pt-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.08em] text-white/40 uppercase">
            <Users size={15} />
            플레이어
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {players.map((player) => (
              <div
                className="rounded-xl bg-black/22 px-3 py-2.5"
                key={player.id}
              >
                <span className="block min-w-0 truncate text-sm font-bold text-white/80">
                  {player.nicknameSnapshot}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-sky-200/12 bg-sky-200/8 px-3 py-3">
          <UserRound className="shrink-0 text-sky-100/65" size={17} />
          <p className="text-sm font-bold text-white/75">
            딜러{" "}
            <span className="text-sky-100">
              {dealer?.nicknameSnapshot ?? "확인 불가"}
            </span>
          </p>
        </div>
      </div>
    </details>
  );
}

export function TournamentGameHistoryPage({
  backHref,
  gameType,
  seasonId,
  title,
}: TournamentGameHistoryPageProps) {
  const [page, setPage] = useState(1);
  const gameScope = useMemo(
    () => ({ gameType, seasonId }),
    [gameType, seasonId]
  );
  const gamesQuery = useTournamentGames(gameScope, page, 20);
  const gameHistory = gamesQuery.data?.items ?? [];
  const pagination = gamesQuery.data?.pagination;

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
              Game History
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">게임 기록</h1>
          </div>

          <div className="w-11" />
        </header>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <p className="text-sm font-semibold text-white/55">완료된 게임</p>
          <p className="mt-1 text-3xl font-black text-amber-100">
            {gamesQuery.isPending
              ? "확인 중"
              : `${pagination?.totalItems ?? gameHistory.length}게임`}
          </p>
        </section>

        {gamesQuery.isPending ? (
          <section className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-white/10 bg-black/18 p-6 text-white/55 backdrop-blur-sm">
            <Loader2 className="animate-spin" size={28} />
            <p className="text-sm font-semibold">
              게임 기록을 불러오는 중입니다.
            </p>
          </section>
        ) : gamesQuery.isError ? (
          <section className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] border border-rose-300/18 bg-rose-300/8 p-6 text-center backdrop-blur-sm">
            <p className="text-sm leading-6 font-semibold text-rose-100">
              {getGameApiErrorMessage(
                gamesQuery.error,
                "게임 기록을 불러오지 못했습니다."
              )}
            </p>
            <button
              className="btn-press-in mt-4 min-h-11 rounded-full border border-rose-200/20 px-5 text-sm font-bold text-rose-100"
              type="button"
              onClick={() => void gamesQuery.refetch()}
            >
              다시 시도
            </button>
          </section>
        ) : gameHistory.length > 0 ? (
          <section className="grid gap-3">
            {gameHistory.map((game) => (
              <GameHistoryCard game={game} key={game.id} />
            ))}

            {pagination && pagination.totalPages > 1 ? (
              <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <button
                  className="btn-press-in min-h-11 rounded-full border border-white/10 bg-white/6 px-4 text-sm font-bold text-white/75 disabled:cursor-not-allowed disabled:opacity-30"
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                >
                  이전
                </button>
                <p className="text-sm font-bold text-white/50">
                  {pagination.page} / {pagination.totalPages}
                </p>
                <button
                  className="btn-press-in min-h-11 rounded-full border border-white/10 bg-white/6 px-4 text-sm font-bold text-white/75 disabled:cursor-not-allowed disabled:opacity-30"
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                  다음
                </button>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/18 p-6 text-center backdrop-blur-sm">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/6 text-white/35">
              <History size={26} />
            </div>
            <p className="mt-4 text-lg font-black text-white">
              아직 완료된 게임이 없습니다.
            </p>
            <p className="mt-2 text-sm leading-6 font-medium text-white/45">
              게임 종료를 확정하면 참가자와 딜러 기록이 여기에 보관됩니다.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
