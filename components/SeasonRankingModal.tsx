"use client";

import Image from "next/image";
import { useEffect, useEffectEvent } from "react";

import { getPodiumApiErrorMessage } from "@/api";
import { usePodiumRankings } from "@/hooks";
import { getPodiumRankRows } from "@/lib";

type SeasonRankingModalProps = {
  onClose: () => void;
  season: {
    id: number;
    label: string;
    period: string;
  };
};

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
  const rankingsQuery = usePodiumRankings(season.id, 100);
  const rankRows = getPodiumRankRows(rankingsQuery.data ?? []);
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
            {season.period}
          </p>
        </div>

        <div className="mt-4 min-h-0 overflow-y-auto overscroll-contain">
          {rankingsQuery.isPending ? (
            <p className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-5 text-center text-sm text-white/50">
              우승자 명단을 불러오는 중입니다.
            </p>
          ) : rankingsQuery.isError ? (
            <div className="rounded-[1.25rem] border border-rose-300/18 bg-rose-300/8 px-4 py-5 text-center">
              <p className="text-sm leading-6 font-semibold text-rose-100">
                {getPodiumApiErrorMessage(
                  rankingsQuery.error,
                  "순위를 불러오지 못했습니다."
                )}
              </p>
              <button
                className="btn-press-in mt-3 rounded-full border border-rose-200/20 px-4 py-2 text-sm font-bold text-rose-100"
                onClick={() => void rankingsQuery.refetch()}
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
                      const crownSrc = getNicknameCrownSrc(winner.rank);

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
                    {winner.wins}회 우승
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-5 text-center text-sm text-white/50">
              아직 누적된 우승 기록이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
