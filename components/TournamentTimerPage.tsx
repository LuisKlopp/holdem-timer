"use client";

import Link from "next/link";

import { getPodiumApiErrorMessage } from "@/api";
import { CURRENT_SEASON } from "@/constants";
import { useBlindTimer, usePodiumStats } from "@/hooks";
import type { BlindLevel } from "@/lib";

import BlindInfo from "./BlindInfo";
import ControlPanel from "./ControlPanel";
import LevelInfo from "./LevelInfo";
import TimerDisplay from "./TimerDisplay";

type TournamentTimerPageProps = {
  blindLevels?: BlindLevel[];
  memberManagementHref?: string;
  title: string;
  podiumSeason?: {
    id: number;
    label: string;
  };
};

export function TournamentTimerPage({
  blindLevels,
  memberManagementHref,
  podiumSeason,
  title,
}: TournamentTimerPageProps) {
  const hasPodiumStats = Boolean(podiumSeason);
  const podiumStatsQuery = usePodiumStats(
    podiumSeason?.id ?? CURRENT_SEASON.id,
    hasPodiumStats
  );
  const podiumStats = podiumStatsQuery.data;

  const {
    alertVolume,
    animationKey,
    currentLevel,
    formattedTime,
    goToNextLevel,
    goToPreviousLevel,
    isRunning,
    levelDurationMinutes,
    pause,
    reset,
    setAlertVolume,
    soundEnabled,
    start,
    toggleSound,
  } = useBlindTimer(blindLevels);

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#050816] px-3 text-white sm:px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="mdl:gap-8 mdl:pt-7 relative mx-auto flex max-w-7xl flex-col gap-6 pt-6 pb-6 lg:gap-12 lg:pt-10 lg:pb-10">
        <header className="flex flex-col gap-3.5">
          <p className="text-center text-4xl font-semibold tracking-[0.08em] text-amber-200/65 uppercase sm:text-4xl mdl:text-left">
            {title}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mdl:justify-start">
            <Link
              className="btn-press-in inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              href="/"
            >
              타이머 선택
            </Link>
            {podiumSeason ? (
              <>
                <Link
                  className="btn-press-in hidden items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/10 mdl:inline-flex"
                  href="/podium"
                >
                  {podiumSeason.label} 기록 입력
                </Link>
                <Link
                  className="btn-press-in hidden items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/10 mdl:inline-flex"
                  href="/hall-of-fame"
                >
                  명예의전당
                </Link>
                <Link
                  className="btn-press-in inline-flex items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/12 px-4 py-1.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/18 mdl:hidden"
                  href={memberManagementHref ?? "/elio-holdem-timer/member-management"}
                >
                  멤버 관리
                </Link>
              </>
            ) : null}
            {!podiumSeason && memberManagementHref ? (
              <Link
                className="btn-press-in inline-flex items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/12 px-4 py-1.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/18 mdl:hidden"
                href={memberManagementHref}
              >
                멤버 관리
              </Link>
            ) : null}
          </div>
        </header>

        <div className="flex flex-col gap-7 mdl:gap-9 lg:gap-14">
          <section
            className={
              hasPodiumStats
                ? "mdl:grid-cols-[minmax(0,1.5fr)_minmax(27rem,1.55fr)] grid gap-3.5 lg:grid-cols-[minmax(0,2.18fr)_minmax(0,1.44fr)]"
                : "grid gap-3.5"
            }
          >
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <TimerDisplay
                animationKey={animationKey}
                formattedTime={formattedTime}
                isBreak={currentLevel.isBreak}
                isRunning={isRunning}
              />

              <LevelInfo
                animationKey={animationKey}
                currentLevel={currentLevel}
                levelDurationMinutes={levelDurationMinutes}
              />
            </div>

            {podiumSeason ? (
              <div className="grid min-w-0 gap-2.5 sm:grid-cols-2">
              <div className="min-w-0">
                <div className="mdl:min-h-[9.2rem] flex min-h-[10rem] flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 px-4 py-2.5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <p className="text-lg font-semibold whitespace-nowrap text-white/78 sm:text-xl">
                    {podiumSeason.label} 최근 우승자
                  </p>
                  <p className="mt-1.5 text-xl leading-tight font-semibold break-words text-white">
                    {podiumStatsQuery.isPending
                      ? "불러오는 중"
                      : (podiumStats?.recentWinner ?? "기록 없음")}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <div className="mdl:min-h-[9.2rem] relative flex min-h-[10rem] flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 px-4 py-2.5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-6xl leading-none drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] mdl:block"
                  >
                    👑
                  </span>
                  <p className="text-lg font-semibold whitespace-nowrap text-amber-200 sm:text-xl">
                    <span className="mdl:hidden">
                      {podiumSeason.label} 최다 우승자 👑
                    </span>
                    <span className="hidden mdl:inline">
                      {podiumSeason.label} 최다 우승자
                    </span>
                  </p>
                  <p className="mt-1.5 text-xl leading-tight font-semibold break-words text-white">
                    {podiumStatsQuery.isPending
                      ? "불러오는 중"
                      : (podiumStats?.topWinner ?? "기록 없음")}
                  </p>
                </div>
              </div>
              </div>
            ) : null}
          </section>

          {podiumSeason && podiumStatsQuery.isError ? (
            <p className="mt-3 text-center text-xs text-rose-200 lg:text-right">
              {getPodiumApiErrorMessage(
                podiumStatsQuery.error,
                "우승 통계를 불러오지 못했습니다."
              )}
            </p>
          ) : null}

          <BlindInfo animationKey={animationKey} currentLevel={currentLevel} />
        </div>

        <div>
          <ControlPanel
            alertVolume={alertVolume}
            isRunning={isRunning}
            onAlertVolumeChange={setAlertVolume}
            onNext={goToNextLevel}
            onPause={pause}
            onPrevious={goToPreviousLevel}
            onReset={reset}
            onStart={start}
            onToggleSound={toggleSound}
            soundEnabled={soundEnabled}
          />
        </div>
      </div>

    </main>
  );
}
