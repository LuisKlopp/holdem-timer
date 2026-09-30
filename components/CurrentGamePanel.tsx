"use client";

import { ChevronDown, UserRound, Users } from "lucide-react";
import Link from "next/link";

import {
  getTournamentGameDealer,
  getTournamentGamePlayers,
  type TournamentGameRecord,
} from "@/api";

type CurrentGamePanelProps = {
  game: TournamentGameRecord;
  rebuyManagementHref: string;
};

const formatStartTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function CurrentGamePanel({
  game,
  rebuyManagementHref,
}: CurrentGamePanelProps) {
  const players = getTournamentGamePlayers(game);
  const dealer = getTournamentGameDealer(game);

  return (
    <section className="rounded-[1.4rem] border border-emerald-200/18 bg-emerald-200/8 px-4 py-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
            <p className="text-xs font-black tracking-[0.12em] text-emerald-100 uppercase">
              진행 중인 게임 · {formatStartTime(game.startedAt)} 시작
            </p>
          </div>
          <p className="mt-1.5 text-sm font-bold text-white sm:text-base">
            참가자 {players.length}명 · 딜러{" "}
            {dealer?.nicknameSnapshot ?? "확인 불가"}
          </p>
        </div>

        <Link
          className="btn-press-in inline-flex min-h-10 items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 text-xs font-bold text-white/80 hover:bg-white/10"
          href={rebuyManagementHref}
        >
          리바인 관리
        </Link>
      </div>

      <details className="group mt-2 border-t border-white/8 pt-2">
        <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between text-xs font-bold text-white/55 [&::-webkit-details-marker]:hidden">
          <span>참가자 명단 보기</span>
          <ChevronDown className="transition group-open:rotate-180" size={16} />
        </summary>

        <div className="grid gap-3 pt-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex min-w-0 items-start gap-2">
            <Users className="mt-0.5 shrink-0 text-amber-100/65" size={16} />
            <p className="text-sm leading-6 font-semibold text-white/72">
              {players.map((player) => player.nicknameSnapshot).join(", ")}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <UserRound className="mt-0.5 shrink-0 text-sky-100/65" size={16} />
            <p className="text-sm leading-6 font-semibold text-white/72">
              딜러 {dealer?.nicknameSnapshot ?? "확인 불가"}
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}
