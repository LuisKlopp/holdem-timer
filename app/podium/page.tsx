"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

import { getPodiumApiErrorMessage } from "@/api";
import { CURRENT_SEASON } from "@/constants";
import {
  useCreatePodiumRecord,
  useDeletePodiumRecords,
  usePodiumRankings,
  usePodiumRecords,
  usePodiumStats,
  useRecentPodiumRecords,
} from "@/hooks";
import { getPodiumRankRows } from "@/lib";

type PodiumForm = {
  firstPlace: string;
  secondPlace: string;
};

const INITIAL_FORM: PodiumForm = {
  firstPlace: "",
  secondPlace: "",
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
    return "/ranking/crown-gold.png";
  }

  if (rank === 2) {
    return "/ranking/crown-silver.png";
  }

  return null;
};

export default function PodiumPage() {
  const [form, setForm] = useState<PodiumForm>(INITIAL_FORM);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const recordsQuery = usePodiumRecords(CURRENT_SEASON.id, 1, 20);
  const recentRecordsQuery = useRecentPodiumRecords(CURRENT_SEASON.id, 5);
  const statsQuery = usePodiumStats(CURRENT_SEASON.id);
  const rankingsQuery = usePodiumRankings(CURRENT_SEASON.id, 100);
  const createRecordMutation = useCreatePodiumRecord();
  const deleteRecordsMutation = useDeletePodiumRecords(CURRENT_SEASON.id);

  useEffect(() => {
    if (!isWinnerModalOpen) {
      return;
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isWinnerModalOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMutationError(null);

    try {
      await createRecordMutation.mutateAsync({
        ...form,
        season: CURRENT_SEASON.id,
      });
      setForm(INITIAL_FORM);
    } catch (error) {
      setMutationError(
        getPodiumApiErrorMessage(error, "경기 기록을 추가하지 못했습니다.")
      );
    }
  };

  const handleClearInputs = () => {
    setForm(INITIAL_FORM);
  };

  const handleReset = async () => {
    const shouldReset = window.confirm(
      `${CURRENT_SEASON.label} 경기 기록이 모두 삭제됩니다. 계속하시겠습니까?`
    );

    if (!shouldReset) {
      return;
    }

    setMutationError(null);

    try {
      await deleteRecordsMutation.mutateAsync();
      setForm(INITIAL_FORM);
      setIsWinnerModalOpen(false);
    } catch (error) {
      setMutationError(
        getPodiumApiErrorMessage(error, "전체 경기 기록을 삭제하지 못했습니다.")
      );
    }
  };

  const records = recordsQuery.data?.items ?? [];
  const recentRecords = recentRecordsQuery.data ?? [];
  const rankings = rankingsQuery.data ?? [];
  const savedAt = recentRecords[0]?.createdAt ?? records[0]?.createdAt ?? null;
  const formattedSavedAt = savedAt
    ? new Date(savedAt).toLocaleString("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;
  const topLeaders = rankings.slice(0, 2);
  const winnerRankRows = getPodiumRankRows(rankings);
  const queryError =
    recordsQuery.error ??
    recentRecordsQuery.error ??
    statsQuery.error ??
    rankingsQuery.error;
  const isInitialLoading =
    recordsQuery.isPending ||
    recentRecordsQuery.isPending ||
    statsQuery.isPending ||
    rankingsQuery.isPending;

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050816] px-3 py-4 text-white sm:px-4 sm:py-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-2rem)] max-w-5xl flex-col gap-5">
        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.26em] text-amber-200/60 uppercase">
              Podium Entry
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[0.08em] text-white sm:text-4xl">
              {CURRENT_SEASON.label} 1등 / 2등 입력
            </h1>
            <p className="mt-2 text-sm text-white/55 sm:text-base">
              게임이 끝날 때마다 현재 시즌 기록으로 누적 저장됩니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn-press-in inline-flex items-center justify-center rounded-full border border-amber-200/24 bg-amber-200/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/16"
              onClick={() => setIsWinnerModalOpen(true)}
              type="button"
            >
              {CURRENT_SEASON.label} 순위 보기
            </button>
            <Link
              className="btn-press-in inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/85 transition hover:bg-white/10"
              href="/elio-holdem-timer"
              aria-label="엘리오 타이머로 돌아가기"
            >
              <ArrowLeft size={18} />
            </Link>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
          <form
            className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6"
            onSubmit={handleSubmit}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/65 uppercase">
                  Server Form
                </p>
                <p className="mt-2 text-sm text-white/55">
                  저장할 때마다 기록이 하나씩 누적됩니다.
                </p>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                {statsQuery.data?.totalGames ??
                  recordsQuery.data?.pagination.totalItems ??
                  0}
                경기
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="rounded-[1.5rem] border border-amber-300/16 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold tracking-[0.18em] text-amber-200 uppercase">
                    1st Place
                  </span>
                  <span className="rounded-full bg-amber-300/14 px-2.5 py-1 text-xs font-semibold text-amber-100">
                    Winner
                  </span>
                </div>
                <input
                  className="mt-3 w-full border-none bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/28"
                  maxLength={24}
                  onChange={(event) =>
                    setForm((previousForm) => ({
                      ...previousForm,
                      firstPlace: event.target.value,
                    }))
                  }
                  placeholder="1등 닉네임"
                  required
                  value={form.firstPlace}
                />
              </label>

              <label className="rounded-[1.5rem] border border-sky-300/16 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold tracking-[0.18em] text-sky-200 uppercase">
                    2nd Place
                  </span>
                  <span className="rounded-full bg-sky-300/14 px-2.5 py-1 text-xs font-semibold text-sky-100">
                    Runner-up
                  </span>
                </div>
                <input
                  className="mt-3 w-full border-none bg-transparent text-2xl font-semibold text-white outline-none placeholder:text-white/28"
                  maxLength={24}
                  onChange={(event) =>
                    setForm((previousForm) => ({
                      ...previousForm,
                      secondPlace: event.target.value,
                    }))
                  }
                  placeholder="2등 닉네임"
                  required
                  value={form.secondPlace}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="btn-press-in rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-100 px-5 py-3 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-55"
                disabled={createRecordMutation.isPending}
                type="submit"
              >
                {createRecordMutation.isPending ? "저장 중..." : "기록 추가"}
              </button>
              <button
                className="btn-press-in rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white/82 disabled:cursor-not-allowed disabled:opacity-55"
                disabled={createRecordMutation.isPending}
                onClick={handleClearInputs}
                type="button"
              >
                입력 비우기
              </button>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-white/42">
                  {isInitialLoading
                    ? "경기 기록을 불러오는 중입니다."
                    : formattedSavedAt
                      ? `마지막 기록: ${formattedSavedAt}`
                      : "아직 저장된 경기 결과가 없습니다."}
                </p>
                {mutationError ? (
                  <p className="mt-1 text-xs text-rose-200" role="alert">
                    {mutationError}
                  </p>
                ) : null}
                {queryError ? (
                  <p className="mt-1 text-xs text-rose-200" role="alert">
                    {getPodiumApiErrorMessage(
                      queryError,
                      "경기 기록을 불러오지 못했습니다."
                    )}
                  </p>
                ) : null}
              </div>

              <button
                className="btn-press-in rounded-full border border-white/8 bg-transparent px-2.5 py-1 text-[11px] font-medium text-white/28 transition hover:border-rose-300/20 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-45"
                disabled={
                  createRecordMutation.isPending ||
                  deleteRecordsMutation.isPending
                }
                onClick={handleReset}
                type="button"
              >
                {deleteRecordsMutation.isPending
                  ? "삭제 중..."
                  : "기록 전체 삭제"}
              </button>
            </div>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/65 uppercase">
              Winner Ranking
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              {CURRENT_SEASON.label} 우승횟수 1위, 2위
            </h2>

            <div className="mt-5 grid gap-4">
              <article className="relative overflow-hidden rounded-[1.75rem] border border-amber-200/15 bg-[linear-gradient(135deg,rgba(245,158,11,0.22),rgba(255,255,255,0.04))] p-5">
                <div className="absolute -top-6 right-4 h-20 w-20 rounded-full bg-amber-200/14 blur-2xl" />
                <p className="text-xs font-semibold tracking-[0.24em] text-amber-100/75 uppercase">
                  Top 1
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {rankingsQuery.isPending
                    ? "불러오는 중"
                    : topLeaders[0]
                      ? topLeaders[0].name
                      : "아직 없음"}
                </p>
                <p className="mt-2 text-sm text-amber-50/70">
                  {topLeaders[0]
                    ? `${topLeaders[0].wins}회 우승`
                    : "누적된 우승 기록이 없습니다."}
                </p>
              </article>

              <article className="relative overflow-hidden rounded-[1.75rem] border border-sky-200/15 bg-[linear-gradient(135deg,rgba(56,189,248,0.2),rgba(255,255,255,0.04))] p-5">
                <div className="absolute -top-6 right-4 h-20 w-20 rounded-full bg-sky-200/14 blur-2xl" />
                <p className="text-xs font-semibold tracking-[0.24em] text-sky-100/75 uppercase">
                  Top 2
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {rankingsQuery.isPending
                    ? "불러오는 중"
                    : topLeaders[1]
                      ? topLeaders[1].name
                      : "아직 없음"}
                </p>
                <p className="mt-2 text-sm text-sky-50/70">
                  {topLeaders[1]
                    ? `${topLeaders[1].wins}회 우승`
                    : "두 번째 랭킹 데이터가 없습니다."}
                </p>
              </article>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-[0.18em] text-white/82 uppercase">
                  Recent Results
                </p>
                <span className="text-xs text-white/45">최신순</span>
              </div>

              <div className="mt-4 space-y-2">
                {recentRecordsQuery.isPending ? (
                  <p className="text-sm text-white/45">
                    최근 경기 결과를 불러오는 중입니다.
                  </p>
                ) : recentRecords.length > 0 ? (
                  recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-[1.1rem] border border-white/8 bg-white/5 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          1등 {record.firstPlace}
                        </p>
                        <p className="truncate text-xs text-white/45">
                          2등 {record.secondPlace}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-white/40">
                        {new Date(record.createdAt).toLocaleDateString(
                          "ko-KR",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/45">
                    아직 누적된 경기 결과가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </section>
        </section>
      </div>

      {isWinnerModalOpen ? (
        <div
          aria-labelledby="winner-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/68 px-3 py-6 backdrop-blur-sm"
          role="dialog"
        >
          <button
            aria-label="우승자 목록 닫기"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsWinnerModalOpen(false)}
            type="button"
          />

          <section className="relative flex w-full max-w-lg flex-col rounded-[2rem] border border-white/12 bg-[#0c1022] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/65 uppercase">
                  Current Ranking
                </p>
                <h2
                  className="mt-2 text-2xl font-semibold text-white"
                  id="winner-modal-title"
                >
                  {CURRENT_SEASON.label} 순위
                </h2>
              </div>
              <button
                className="btn-press-in rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white"
                onClick={() => setIsWinnerModalOpen(false)}
                type="button"
              >
                닫기
              </button>
            </div>

            <div className="mt-5 rounded-[1.25rem] border border-amber-200/24 bg-amber-200/10 px-4 py-3.5 sm:px-5">
              <p className="text-center text-2xl leading-tight font-bold text-amber-50 sm:text-3xl">
                {CURRENT_SEASON.label}
              </p>
              <p className="mt-1 text-center text-sm leading-6 font-semibold text-amber-50 sm:text-base sm:leading-7">
                {CURRENT_SEASON.period}
              </p>
            </div>

            <div className="mt-4">
              {rankingsQuery.isPending ? (
                <p className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-5 text-center text-sm text-white/50">
                  우승자 명단을 불러오는 중입니다.
                </p>
              ) : winnerRankRows.length > 0 ? (
                <div className="grid gap-2">
                  {winnerRankRows.map((winner) => (
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
      ) : null}
    </main>
  );
}
