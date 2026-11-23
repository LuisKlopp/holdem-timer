"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useState } from "react";

import { getPodiumApiErrorMessage } from "@/api";
import { usePodiumRankings, usePodiumRunnerUpRankings } from "@/hooks";
import { getPodiumRankRows } from "@/lib";

type SeasonRankingModalProps = {
  onClose: () => void;
  season: {
    id: number;
    label: string;
    period: string;
  };
};

type RankingTab = "winner" | "runner-up";

const NICKNAME_CROWN_CLASS_NAME =
  "pointer-events-none absolute -top-4 -right-2.5 h-6.5 w-auto rotate-[27deg]";

const getRankTextClassName = (rank: number) => {
  if (rank === 1) {
    return "text-amber-200";
  }

  if (rank === 2) {
    return "text-slate-100";
  }

  if (rank === 3) {
    return "text-orange-200";
  }

  return "text-amber-100/80";
};

const getNicknameChipClassName = (rank: number) => {
  if (rank === 1) {
    return "border-amber-200/45 bg-amber-200/18 text-amber-50";
  }

  if (rank === 2) {
    return "border-slate-100/35 bg-slate-100/14 text-slate-50";
  }

  if (rank === 3) {
    return "border-orange-300/40 bg-orange-300/14 text-orange-50";
  }

  return "border-white/10 bg-white/8 text-white";
};

const getNicknameCrownSrc = (rank: number) => {
  if (rank === 1) {
    return "/ranking/crown-gold-hd.png";
  }

  if (rank === 2) {
    return "/ranking/crown-silver.png";
  }

  return null;
};

export default function SeasonRankingModal({
  onClose,
  season,
}: SeasonRankingModalProps) {
  const [activeTab, setActiveTab] = useState<RankingTab>("winner");
  const rankingsQuery = usePodiumRankings(season.id, 100);
  const runnerUpRankingsQuery = usePodiumRunnerUpRankings(
    season.id,
    100,
    activeTab === "runner-up"
  );
  const isRunnerUpTab = activeTab === "runner-up";
  const activeRankings = isRunnerUpTab
    ? (runnerUpRankingsQuery.data ?? []).map((ranking) => ({
        name: ranking.name,
        wins: ranking.runnerUps,
      }))
    : (rankingsQuery.data ?? []);
  const activeIsPending = isRunnerUpTab
    ? runnerUpRankingsQuery.isPending
    : rankingsQuery.isPending;
  const activeIsError = isRunnerUpTab
    ? runnerUpRankingsQuery.isError
    : rankingsQuery.isError;
  const activeError = isRunnerUpTab
    ? runnerUpRankingsQuery.error
    : rankingsQuery.error;
  const refetchActiveRankings = isRunnerUpTab
    ? runnerUpRankingsQuery.refetch
    : rankingsQuery.refetch;
  const rankRows = getPodiumRankRows(activeRankings);
  const placementLabel = isRunnerUpTab ? "준우승" : "우승";
  const rankingPeriod = isRunnerUpTab
    ? "준우승 1등 - 신세계 상품권 2만원"
    : season.period;
  const closeOnEscape = useEffectEvent(onClose);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOnEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      aria-labelledby="season-ranking-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/68 px-3 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label={`${season.label} 순위 닫기`}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />

      <section className="relative flex max-h-[calc(100svh-3rem)] w-full max-w-lg flex-col rounded-[2rem] border border-white/12 bg-[#0c1022] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/65 uppercase">
              Current Ranking
            </p>
            <h2
              className="mt-2 text-2xl font-semibold text-white"
              id="season-ranking-modal-title"
            >
              {season.label} 순위
            </h2>
          </div>
          <button
            className="btn-press-in rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>

        <div className="mt-5 rounded-[1.25rem] border border-amber-200/24 bg-amber-200/10 px-4 py-3.5 sm:px-5">
          <p className="text-center text-2xl leading-tight font-bold text-amber-50 sm:text-3xl">
            {season.label}
          </p>
          <p className="mt-1 whitespace-pre-line text-center text-sm leading-6 font-semibold text-amber-50 sm:text-base sm:leading-7">
            {rankingPeriod}
          </p>
        </div>

        <div
          aria-label={`${season.label} 순위 종류`}
          className="mt-4 grid grid-cols-2 gap-2 rounded-[1.25rem] border border-white/8 bg-black/20 p-1.5"
          role="tablist"
        >
          <button
            aria-controls="season-ranking-panel"
            aria-selected={!isRunnerUpTab}
            className={`btn-press-in min-h-11 rounded-2xl px-3 text-sm font-bold transition ${
              !isRunnerUpTab
                ? "bg-amber-200 text-slate-950 shadow-[0_8px_24px_rgba(251,191,36,0.16)]"
                : "text-white/55 hover:bg-white/6 hover:text-white/85"
            }`}
            id="winner-ranking-tab"
            onClick={() => setActiveTab("winner")}
            role="tab"
            type="button"
          >
            우승 순위
          </button>
          <button
            aria-controls="season-ranking-panel"
            aria-selected={isRunnerUpTab}
            className={`btn-press-in min-h-11 rounded-2xl px-3 text-sm font-bold transition ${
              isRunnerUpTab
                ? "bg-sky-200 text-slate-950 shadow-[0_8px_24px_rgba(125,211,252,0.16)]"
                : "text-white/55 hover:bg-white/6 hover:text-white/85"
            }`}
            id="runner-up-ranking-tab"
            onClick={() => setActiveTab("runner-up")}
            role="tab"
            type="button"
          >
            준우승 순위
          </button>
        </div>

        <div
          aria-labelledby={
            isRunnerUpTab ? "runner-up-ranking-tab" : "winner-ranking-tab"
          }
          className="mt-3 min-h-0 overflow-y-auto overscroll-contain"
          id="season-ranking-panel"
          role="tabpanel"
        >
          {activeIsPending ? (
            <p className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-5 text-center text-sm text-white/50">
              {placementLabel} 순위를 불러오는 중입니다.
            </p>
          ) : activeIsError ? (
            <div className="rounded-[1.25rem] border border-rose-300/18 bg-rose-300/8 px-4 py-5 text-center">
              <p className="text-sm leading-6 font-semibold text-rose-100">
                {getPodiumApiErrorMessage(
                  activeError,
                  `${placementLabel} 순위를 불러오지 못했습니다.`
                )}
              </p>
              <button
                className="btn-press-in mt-3 rounded-full border border-rose-200/20 px-4 py-2 text-sm font-bold text-rose-100"
                onClick={() => void refetchActiveRankings()}
                type="button"
              >
                다시 시도
              </button>
            </div>
          ) : rankRows.length > 0 ? (
            <div className="grid gap-2">
              {rankRows.map((winner) => (
                <div
                  className="flex min-w-0 items-center gap-3 rounded-[1.25rem] border border-white/8 bg-white/6 px-3 py-2.5"
                  key={winner.wins}
                >
                  <span
                    className={`shrink-0 text-sm font-bold ${getRankTextClassName(winner.rank)}`}
                  >
                    {winner.rankLabel}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {winner.names.map((name) => {
                      const crownSrc = isRunnerUpTab
                        ? null
                        : getNicknameCrownSrc(winner.rank);

                      return (
                        <span
                          className={`relative inline-flex max-w-full items-center justify-center rounded-full border px-2.5 py-1 text-base font-semibold break-words ${getNicknameChipClassName(winner.rank)}`}
                          key={name}
                        >
                          {crownSrc ? (
                            <Image
                              aria-hidden="true"
                              className={NICKNAME_CROWN_CLASS_NAME}
                              src={crownSrc}
                              alt=""
                              width={96}
                              height={87}
                            />
                          ) : null}
                          {name}
                        </span>
                      );
                    })}
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-200/12 px-2.5 py-1.5 text-xs font-bold text-amber-100">
                    {winner.wins}회 {placementLabel}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-5 text-center text-sm text-white/50">
              아직 누적된 {placementLabel} 기록이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
