import { ArrowRight, MessageSquareText, Timer } from "lucide-react";
import Link from "next/link";

import { CURRENT_SEASON } from "@/constants";

const timerRoutes = [
  {
    description: "시즌2 우승 기록과 멤버를 함께 관리합니다.",
    href: "/elio-holdem-timer",
    icon: Timer,
    title: `엘리오 홀덤 타이머 - ${CURRENT_SEASON.label}`,
  },
  {
    description: "피드백 토너먼트 진행용 독립 타이머입니다.",
    href: "/feedback-tournament-timer",
    icon: MessageSquareText,
    title: "피드백 토너먼트 타이머",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#050816] px-4 py-6 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[18%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-3rem)] max-w-5xl flex-col justify-center gap-8">
        <header className="text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-amber-200/60 uppercase">
            Tournament Timer
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[0.08em] text-white sm:text-5xl">
            타이머 선택
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
            진행할 토너먼트에 맞는 타이머를 선택하세요.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {timerRoutes.map((route) => {
            const Icon = route.icon;

            return (
              <Link
                className="btn-press-in group flex min-h-56 flex-col justify-between rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-amber-200/30 hover:bg-white/10 sm:p-7"
                href={route.href}
                key={route.href}
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-200/24 bg-amber-200/10 text-amber-100">
                    <Icon size={24} />
                  </div>
                  <h2 className="mt-5 text-2xl leading-tight font-bold break-keep text-white sm:text-3xl">
                    {route.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {route.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/8 pt-4">
                  <span className="text-sm font-semibold text-amber-100">
                    열기
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/75 transition group-hover:border-amber-200/25 group-hover:text-amber-100">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
