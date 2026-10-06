"use client";

import { ArrowLeft, Check, Loader2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getGameApiErrorMessage } from "@/api";
import { useHoldemMembers } from "@/hooks";
import type { TournamentRebuyStore } from "@/store";

type TournamentRebuyManagementPageProps = {
  timerHref: string;
  timerLabel: string;
  useRebuyStore: TournamentRebuyStore;
};

export function TournamentRebuyManagementPage({
  timerHref,
  timerLabel,
  useRebuyStore,
}: TournamentRebuyManagementPageProps) {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const decrementRebuy = useRebuyStore((state) => state.decrementRebuy);
  const entries = useRebuyStore((state) => state.entries);
  const hasHydrated = useRebuyStore((state) => state.hasHydrated);
  const incrementRebuy = useRebuyStore((state) => state.incrementRebuy);
  const resetRebuys = useRebuyStore((state) => state.resetRebuys);
  const setTodayMembers = useRebuyStore((state) => state.setTodayMembers);
  const todayMembers = useRebuyStore((state) => state.todayMembers);
  const isSelectingTodayMembers = todayMembers.length === 0;
  const membersQuery = useHoldemMembers(
    hasHydrated && isSelectingTodayMembers
  );
  const canConfirmTodayMembers = selectedMemberIds.length > 0;
  const totalRebuys = todayMembers.reduce(
    (total, member) => total + (entries[String(member.id)]?.count ?? 0),
    0
  );

  useEffect(() => {
    void useRebuyStore.persist.rehydrate();
  }, [useRebuyStore]);

  const handleMemberToggle = (memberId: number) => {
    setSelectedMemberIds((currentMemberIds) => {
      if (currentMemberIds.includes(memberId)) {
        return currentMemberIds.filter((id) => id !== memberId);
      }

      return [...currentMemberIds, memberId];
    });
  };

  const handleConfirmTodayMembers = () => {
    if (!canConfirmTodayMembers || !membersQuery.data) {
      return;
    }

    const selectedIds = new Set(selectedMemberIds);
    setTodayMembers(
      membersQuery.data.filter((member) => selectedIds.has(member.id))
    );
  };

  const handleConfirmReset = () => {
    resetRebuys();
    setSelectedMemberIds([]);
    setIsResetConfirmOpen(false);
  };

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
            href={timerHref}
            aria-label={`${timerLabel}로 돌아가기`}
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/60 uppercase">
              Rebuy
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">리바인 관리</h1>
          </div>

          <div className="size-11 shrink-0" aria-hidden="true" />
        </header>

        {!hasHydrated ? (
          <section className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/18 p-5 text-center">
            <Loader2 className="animate-spin text-amber-100" size={28} />
            <p className="mt-3 text-sm font-semibold text-white/55">
              저장된 리바인 정보를 불러오는 중입니다.
            </p>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-2">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
                <p className="text-sm font-semibold text-white/55">
                  {isSelectingTodayMembers ? "선택 인원" : "오늘의 멤버"}
                </p>
                <p className="mt-1 text-3xl font-black text-white">
                  {isSelectingTodayMembers
                    ? selectedMemberIds.length
                    : todayMembers.length}
                  명
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-amber-200/18 bg-amber-200/10 p-4">
                <p className="text-sm font-semibold text-amber-100/75">
                  총 리바인
                </p>
                <p className="mt-1 text-3xl font-black text-amber-100">
                  {totalRebuys}회
                </p>
              </div>
            </section>

            {isSelectingTodayMembers ? (
              <>
                {membersQuery.isPending ? (
                  <section className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/18 p-5 text-center">
                    <Loader2
                      className="animate-spin text-amber-100"
                      size={28}
                    />
                    <p className="mt-3 text-sm font-semibold text-white/55">
                      멤버 목록을 불러오는 중입니다.
                    </p>
                  </section>
                ) : membersQuery.isError ? (
                  <section className="flex min-h-56 flex-col items-center justify-center rounded-[1.5rem] border border-rose-300/20 bg-rose-300/10 p-5 text-center">
                    <p className="text-sm font-semibold text-rose-100">
                      {getGameApiErrorMessage(
                        membersQuery.error,
                        "멤버 목록을 불러오지 못했습니다."
                      )}
                    </p>
                    <button
                      className="btn-press-in mt-4 min-h-10 rounded-full border border-rose-200/20 px-4 text-xs font-bold text-rose-100"
                      type="button"
                      onClick={() => void membersQuery.refetch()}
                    >
                      다시 시도
                    </button>
                  </section>
                ) : membersQuery.data.length > 0 ? (
                  <section className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {membersQuery.data.map((member) => {
                      const isSelected = selectedMemberIds.includes(member.id);

                      return (
                        <button
                          className={`btn-press-in flex min-h-15 min-w-0 items-center justify-between gap-2 rounded-[1.1rem] border px-3 py-2.5 text-left transition ${
                            isSelected
                              ? "border-amber-200/55 bg-amber-200/16 text-amber-50"
                              : "border-white/10 bg-black/22 text-white/72 hover:bg-white/8"
                          }`}
                          type="button"
                          key={member.id}
                          aria-pressed={isSelected}
                          onClick={() => handleMemberToggle(member.id)}
                        >
                          <span className="min-w-0 text-sm font-bold break-words">
                            {member.nickname}
                          </span>
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-amber-100 bg-amber-100 text-amber-950"
                                : "border-white/15 text-transparent"
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </span>
                        </button>
                      );
                    })}
                  </section>
                ) : (
                  <section className="flex min-h-56 items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/18 p-5 text-center">
                    <p className="text-lg font-bold text-white">
                      등록된 멤버가 없습니다.
                    </p>
                  </section>
                )}

                <button
                  className="btn-press-in sticky bottom-4 mt-auto min-h-13 w-full rounded-full bg-amber-200 px-5 text-base font-black text-amber-950 shadow-[0_16px_45px_rgba(0,0,0,0.45)] transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                  type="button"
                  disabled={!canConfirmTodayMembers}
                  onClick={handleConfirmTodayMembers}
                >
                  오늘의 멤버 선택 ({selectedMemberIds.length}명)
                </button>
              </>
            ) : (
              <>
                <section className="grid gap-2">
                  {todayMembers.map((member) => {
                    const rebuyCount = entries[String(member.id)]?.count ?? 0;

                    return (
                      <div
                        className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[1.25rem] border border-white/10 bg-black/22 px-3 py-3 backdrop-blur-sm"
                        key={member.id}
                      >
                        <div className="min-w-0">
                          <p className="text-lg font-black break-words text-white">
                            {member.nickname}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white/45">
                            리바인 {rebuyCount}회
                          </p>
                        </div>

                        <div className="grid grid-cols-[2.75rem_3.25rem_2.75rem] items-center gap-2">
                          <button
                            className="btn-press-in flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:text-white/25"
                            type="button"
                            disabled={rebuyCount === 0}
                            aria-label={`${member.nickname} 리바인 1회 차감`}
                            onClick={() => decrementRebuy(member.id)}
                          >
                            <Minus size={19} />
                          </button>
                          <div className="text-center text-3xl font-black text-amber-100">
                            {rebuyCount}
                          </div>
                          <button
                            className="btn-press-in flex size-11 items-center justify-center rounded-full bg-amber-200 text-black transition hover:bg-amber-100"
                            type="button"
                            aria-label={`${member.nickname} 리바인 1회 추가`}
                            onClick={() => incrementRebuy(member)}
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </section>

                <button
                  className="btn-press-in mt-auto min-h-10 self-start rounded-full border border-rose-300/25 bg-rose-300/10 px-4 text-xs font-bold text-rose-100 transition hover:bg-rose-300/16"
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                >
                  오늘 기록 초기화
                </button>
              </>
            )}
          </>
        )}
      </div>

      {isResetConfirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-confirm-title"
          onMouseDown={() => setIsResetConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[1.5rem] border border-white/12 bg-[#0b0d18] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p
              className="text-xl font-bold text-rose-100"
              id="reset-confirm-title"
            >
              오늘 기록을 초기화할까요?
            </p>
            <p className="mt-2 text-sm leading-6 font-medium text-white/55">
              오늘의 멤버 선택과 누적된 모든 리바인 횟수가 함께
              초기화됩니다.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                className="btn-press-in min-h-11 rounded-full border border-white/10 bg-white/6 px-4 text-sm font-bold text-white/75 transition hover:bg-white/12"
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                취소
              </button>
              <button
                className="btn-press-in min-h-11 rounded-full bg-rose-200 px-4 text-sm font-black text-rose-950 transition hover:bg-rose-100"
                type="button"
                onClick={handleConfirmReset}
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
