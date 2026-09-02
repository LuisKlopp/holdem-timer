"use client";

import { ArrowLeft, Minus, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { TournamentGameStore } from "@/store";

type TournamentRebuyManagementPageProps = {
  memberManagementHref: string;
  timerHref: string;
  timerLabel: string;
  useGameStore: TournamentGameStore;
};

export function TournamentRebuyManagementPage({
  memberManagementHref,
  timerHref,
  timerLabel,
  useGameStore,
}: TournamentRebuyManagementPageProps) {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const clearGame = useGameStore((state) => state.clearGame);
  const decrementRebuy = useGameStore((state) => state.decrementRebuy);
  const incrementRebuy = useGameStore((state) => state.incrementRebuy);
  const rebuyCounts = useGameStore((state) => state.rebuyCounts);
  const selectedMembers = useGameStore((state) => state.selectedMembers);

  const totalRebuys = selectedMembers.reduce(
    (total, member) => total + (rebuyCounts[member] ?? 0),
    0
  );

  const handleConfirmReset = () => {
    clearGame();
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
            href={memberManagementHref}
            aria-label="멤버 관리로 돌아가기"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/60 uppercase">
              Rebuy
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">리바인 관리</h1>
          </div>

          <Link
            className="btn-press-in flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/80 transition hover:bg-white/10"
            href={timerHref}
            aria-label={`${timerLabel}로 이동`}
          >
            <Users size={19} />
          </Link>
        </header>

        <section className="grid grid-cols-2 gap-2">
          <div className="rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
            <p className="text-sm font-semibold text-white/55">참여 인원</p>
            <p className="mt-1 text-3xl font-black text-white">
              {selectedMembers.length}명
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-amber-200/18 bg-amber-200/10 p-4">
            <p className="text-sm font-semibold text-amber-100/75">총 리바인</p>
            <p className="mt-1 text-3xl font-black text-amber-100">
              {totalRebuys}회
            </p>
          </div>
        </section>

        {selectedMembers.length > 0 ? (
          <section className="grid gap-2">
            {selectedMembers.map((member) => {
              const rebuyCount = rebuyCounts[member] ?? 0;

              return (
                <div
                  className="grid min-h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[1.25rem] border border-white/10 bg-black/22 px-3 py-3 backdrop-blur-sm"
                  key={member}
                >
                  <div className="min-w-0">
                    <p className="text-lg font-black break-words text-white">
                      {member}
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
                      aria-label={`${member} 리바인 1회 차감`}
                      onClick={() => decrementRebuy(member)}
                    >
                      <Minus size={19} />
                    </button>
                    <div className="text-center text-3xl font-black text-amber-100">
                      {rebuyCount}
                    </div>
                    <button
                      className="btn-press-in flex size-11 items-center justify-center rounded-full bg-amber-200 text-black transition hover:bg-amber-100"
                      type="button"
                      aria-label={`${member} 리바인 1회 추가`}
                      onClick={() => incrementRebuy(member)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        ) : (
          <section className="flex min-h-80 flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/18 p-5 text-center">
            <p className="text-lg font-bold text-white">참여 멤버가 없습니다.</p>
            <Link
              className="btn-press-in mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-amber-200 px-5 text-base font-black text-black"
              href={memberManagementHref}
            >
              멤버 선택하기
            </Link>
          </section>
        )}

        {selectedMembers.length > 0 ? (
          <button
            className="btn-press-in mt-auto min-h-10 self-start rounded-full border border-rose-300/25 bg-rose-300/10 px-4 text-xs font-bold text-rose-100 transition hover:bg-rose-300/16"
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
          >
            게임 초기화
          </button>
        ) : null}
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
              게임을 초기화할까요?
            </p>
            <p className="mt-2 text-sm leading-6 font-medium text-white/55">
              선택된 멤버와 리바인 기록이 모두 삭제됩니다.
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
