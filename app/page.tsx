"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BlindInfo, ControlPanel, LevelInfo, TimerDisplay } from "@/components";
import { useBlindTimer } from "@/hooks";
import { getPodiumStats, readPodiumRecords } from "@/lib/podiumStorage";

export default function Home() {
  const [podiumStats, setPodiumStats] = useState(() => getPodiumStats([]));

  const {
    animationKey,
    currentLevel,
    currentLevelNumber,
    formattedTime,
    goToNextLevel,
    goToPreviousLevel,
    isRunning,
    jumpTo,
    levelDurationMinutes,
    pause,
    remainingTime,
    reset,
    setLevelDuration,
    soundEnabled,
    start,
    totalLevels,
    toggleSound,
  } = useBlindTimer();

  useEffect(() => {
    const syncPodiumStats = () => {
      setPodiumStats(getPodiumStats(readPodiumRecords()));
    };

    syncPodiumStats();

    window.addEventListener("focus", syncPodiumStats);
    window.addEventListener("storage", syncPodiumStats);

    return () => {
      window.removeEventListener("focus", syncPodiumStats);
      window.removeEventListener("storage", syncPodiumStats);
    };
  }, []);

  return (
    <main className="relative h-svh overflow-hidden bg-[#050816] px-3 text-white sm:px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="mdl:gap-3.5 mdl:pt-7 relative mx-auto flex h-full max-w-7xl flex-col gap-3 pt-6 pb-3">
        <header className="flex flex-col gap-2.5">
          <p className="text-center text-4xl font-semibold tracking-[0.08em] text-amber-200/65 uppercase sm:text-4xl lg:text-left">
            엘리오 홀덤 타이머
          </p>

          <div className="flex justify-center lg:justify-start">
            <Link
              className="btn-press-in inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              href="/podium"
            >
              우승 기록 입력
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          <section className="mdl:grid-cols-[minmax(0,2.18fr)_minmax(0,1.44fr)] translate-y-2 grid gap-2.5 sm:translate-y-3">
            <div className="flex gap-2">
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

            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="">
                <div className="mdl:min-h-[9.2rem] flex min-h-[10rem] flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 px-4 py-2.5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <p className="text-lg font-semibold text-white/78 sm:text-xl">
                    최근 우승자
                  </p>
                  <p className="mt-1.5 text-xl leading-tight font-semibold break-words text-white">
                    {podiumStats.recentWinner ?? "기록 없음"}
                  </p>
                </div>
              </div>

              <div className="">
                <div className="mdl:min-h-[9.2rem] flex min-h-[10rem] flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 px-4 py-2.5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <p className="text-lg font-semibold text-amber-200 sm:text-xl">
                    최다 우승자 👑
                  </p>
                  <p className="mt-1.5 text-xl leading-tight font-semibold break-words text-white">
                    {podiumStats.topWinner ?? "기록 없음"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-1 items-center py-3">
            <BlindInfo
              animationKey={animationKey}
              currentLevel={currentLevel}
            />
          </div>
        </div>

        <div className="mt-auto -translate-y-2 sm:-translate-y-3">
          <ControlPanel
            animationKey={animationKey}
            currentLevelNumber={currentLevelNumber}
            isRunning={isRunning}
            levelDurationMinutes={levelDurationMinutes}
            onJump={jumpTo}
            onNext={goToNextLevel}
            onPause={pause}
            onPrevious={goToPreviousLevel}
            onReset={reset}
            onSetLevelDuration={setLevelDuration}
            onStart={start}
            onToggleSound={toggleSound}
            remainingTime={remainingTime}
            soundEnabled={soundEnabled}
            totalLevels={totalLevels}
          />
        </div>
      </div>
    </main>
  );
}
