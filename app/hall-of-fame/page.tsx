"use client";

import { ArrowLeft, Medal, Trophy } from "lucide-react";
import Link from "next/link";

import { getPodiumApiErrorMessage } from "@/api";
import { SEASON_ONE } from "@/constants";
import { usePodiumRankings, usePodiumStats } from "@/hooks";
import { getPodiumRankRows } from "@/lib";

const formatNames = (names: string[]) =>
  names.length > 0 ? names.join(", ") : "기록 없음";

export default function HallOfFamePage() {
  const rankingsQuery = usePodiumRankings(SEASON_ONE.id, 100);
  const statsQuery = usePodiumStats(SEASON_ONE.id);

  const rankings = rankingsQuery.data ?? [];
  const rankRows = getPodiumRankRows(rankings);
  const champion = rankRows[0];
  const runnerUp = rankRows[1];
  const totalGames = statsQuery.data?.totalGames ?? 0;
  const queryError = rankingsQuery.error ?? statsQuery.error;
  const isLoading = rankingsQuery.isPending || statsQuery.isPending;

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050816] px-3 py-4 text-white sm:px-4 sm:py-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-6xl flex-col gap-5">
        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.26em] text-amber-200/60 uppercase">
              Hall of Fame
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[0.08em] text-white sm:text-4xl">
              엘리오 홀덤 명예의전당
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              className="btn-press-in inline-flex items-center gap-2 rounded-full border border-amber-200/24 bg-amber-200/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/16"
              href="/elio-holdem-timer"
            >
              <ArrowLeft size={16} />
              엘리오 타이머
            </Link>
            <Link
              className="btn-press-in inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              href="/podium"
            >
              시즌2 기록 입력
            </Link>
          </div>
        </header>

        <section className="rounded-[2rem] border border-amber-200/18 bg-[linear-gradient(135deg,rgba(245,158,11,0.18),rgba(255,255,255,0.05))] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-amber-100/70 uppercase">
                {SEASON_ONE.label}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-5xl">
                시즌 1 명예의전당
              </h2>
              <div className="mt-5 grid gap-2 text-sm font-semibold text-amber-50/78 sm:text-base">
                <p>기간: {SEASON_ONE.period}</p>
                <p>총 경기: {isLoading ? "불러오는 중" : `${totalGames}경기`}</p>
                {SEASON_ONE.prize ? (
                  <>
                    <p>1위 상품: {SEASON_ONE.prize.firstPlace}</p>
                    <p>2위 상품: {SEASON_ONE.prize.secondPlace}</p>
                  </>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <article className="min-h-48 rounded-[1.5rem] border border-amber-200/24 bg-black/22 p-5">
                <div className="flex items-center gap-2 text-amber-100">
                  <Trophy size={22} />
                  <p className="text-sm font-semibold tracking-[0.18em] uppercase">
                    Champion
                  </p>
                </div>
                <p className="mt-5 text-sm font-semibold text-white/48">
                  시즌1 우승자
                </p>
                <p className="mt-2 text-3xl leading-tight font-bold break-words text-white">
                  {isLoading ? "불러오는 중" : formatNames(champion?.names ?? [])}
                </p>
                <p className="mt-3 text-sm font-semibold text-amber-100/75">
                  {champion ? `${champion.wins}회 우승` : "누적 기록 없음"}
                </p>
              </article>

              <article className="min-h-48 rounded-[1.5rem] border border-sky-200/20 bg-black/22 p-5">
                <div className="flex items-center gap-2 text-sky-100">
                  <Medal size={22} />
                  <p className="text-sm font-semibold tracking-[0.18em] uppercase">
                    Runner-up
                  </p>
                </div>
                <p className="mt-5 text-sm font-semibold text-white/48">
                  시즌1 준우승자
                </p>
                <p className="mt-2 text-3xl leading-tight font-bold break-words text-white">
                  {isLoading
                    ? "불러오는 중"
                    : formatNames(runnerUp?.names ?? [])}
                </p>
                <p className="mt-3 text-sm font-semibold text-sky-100/75">
                  {runnerUp ? `${runnerUp.wins}회 우승` : "2위 기록 없음"}
                </p>
              </article>
            </div>
          </div>

          {queryError ? (
            <p className="mt-4 text-sm text-rose-200" role="alert">
              {getPodiumApiErrorMessage(
                queryError,
                "시즌1 기록을 불러오지 못했습니다."
              )}
            </p>
          ) : null}
        </section>

        <section>
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/65 uppercase">
              Season Ranking
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              시즌1 전체 순위
            </h2>

            <div className="mt-5 grid gap-2">
              {rankingsQuery.isPending ? (
                <p className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-5 text-center text-sm text-white/50">
                  순위를 불러오는 중입니다.
                </p>
              ) : rankRows.length > 0 ? (
                rankRows.map((row) => (
                  <div
                    className="flex min-w-0 items-center gap-3 rounded-[1.25rem] border border-white/8 bg-white/6 px-3 py-2.5"
                    key={row.wins}
                  >
                    <span className="shrink-0 text-sm font-bold text-amber-100">
                      {row.rankLabel}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                      {row.names.map((name) => (
                        <span
                          className="max-w-full rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-base font-semibold break-words text-white"
                          key={name}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-200/12 px-2.5 py-1.5 text-xs font-bold text-amber-100">
                      {row.wins}회
                    </span>
                  </div>
                ))
              ) : (
                <p className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-5 text-center text-sm text-white/50">
                  시즌1 순위 기록이 없습니다.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
