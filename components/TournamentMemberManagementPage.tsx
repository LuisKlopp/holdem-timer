"use client";

import { ArrowLeft, Check, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getPodiumApiErrorMessage } from "@/api";
import { useHoldemMembers } from "@/hooks";
import type { TournamentGameStore } from "@/store";

type TournamentMemberManagementPageProps = {
  backHref: string;
  rebuyManagementHref: string;
  title: string;
  useGameStore: TournamentGameStore;
};

export function TournamentMemberManagementPage({
  backHref,
  rebuyManagementHref,
  title,
  useGameStore,
}: TournamentMemberManagementPageProps) {
  const router = useRouter();
  const membersQuery = useHoldemMembers();
  const selectedMembers = useGameStore((state) => state.selectedMembers);
  const startGame = useGameStore((state) => state.startGame);
  const toggleSelectedMember = useGameStore(
    (state) => state.toggleSelectedMember
  );

  const handleStartGame = () => {
    if (selectedMembers.length === 0) {
      return;
    }

    startGame(selectedMembers);
    router.push(rebuyManagementHref);
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
            href={backHref}
            aria-label={`${title}로 돌아가기`}
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/60 uppercase">
              Member
            </p>
            <h1 className="mt-1 text-2xl font-bold text-white">멤버 관리</h1>
          </div>

          <div className="w-11" />
        </header>

        <section className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white/58">이번 게임</p>
              <p className="mt-1 text-3xl font-black text-amber-100">
                {selectedMembers.length}명
              </p>
            </div>

            <button
              className="btn-press-in inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-200 px-5 text-base font-black text-black transition disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/35"
              type="button"
              disabled={selectedMembers.length === 0}
              onClick={handleStartGame}
            >
              <Play size={18} fill="currentColor" />
              게임 시작!
            </button>
          </div>
        </section>

        <section className="min-h-0 flex-1 rounded-[1.5rem] border border-white/10 bg-black/18 p-4 backdrop-blur-sm">
          {membersQuery.isPending ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-white/60">
              <Loader2 className="animate-spin" size={28} />
              <p className="text-base font-semibold">멤버를 불러오는 중입니다.</p>
            </div>
          ) : membersQuery.isError ? (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <p className="text-base font-semibold text-rose-100">
                {getPodiumApiErrorMessage(
                  membersQuery.error,
                  "멤버를 불러오지 못했습니다."
                )}
              </p>
            </div>
          ) : membersQuery.data.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {membersQuery.data.map((member) => {
                const isSelected = selectedMembers.includes(member.nickname);

                return (
                  <button
                    className={
                      isSelected
                        ? "btn-press-in flex min-h-13 items-center justify-between gap-2 rounded-2xl border border-amber-200/50 bg-amber-200 px-3 text-left text-sm font-black text-black shadow-[0_10px_26px_rgba(251,191,36,0.2)]"
                        : "btn-press-in flex min-h-13 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 text-left text-sm font-bold text-white/82 transition hover:bg-white/10"
                    }
                    type="button"
                    key={`${member.id ?? member.nickname}-${member.nickname}`}
                    onClick={() => toggleSelectedMember(member.nickname)}
                  >
                    <span className="min-w-0 break-words">{member.nickname}</span>
                    {isSelected ? <Check className="shrink-0" size={17} /> : null}
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
