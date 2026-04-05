"use client";

import { BlindInfo, ControlPanel, LevelInfo, TimerDisplay } from "@/components";
import { useBlindTimer } from "@/hooks";

export default function Home() {
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
    totalElapsedTime,
    totalLevels,
    toggleSound,
  } = useBlindTimer();

  return (
    <main className="relative h-svh overflow-hidden bg-[#050816] px-3 py-2 text-white sm:px-4 sm:py-3">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_minmax(0,1fr)_auto] gap-2 sm:gap-3">
        <header className="text-center">
          <p className="mdl:text-lg text-4xl font-semibold tracking-[0.08em] text-amber-200/65 uppercase sm:text-2xl">
            엘리오 홀덤 타이머
          </p>
        </header>

        <div className="">
          <div className="flex">
            <TimerDisplay
              animationKey={animationKey}
              formattedTime={formattedTime}
              isBreak={currentLevel.isBreak}
              isRunning={isRunning}
              totalElapsedTime={totalElapsedTime}
            />

            <LevelInfo
              animationKey={animationKey}
              currentLevel={currentLevel}
              levelDurationMinutes={levelDurationMinutes}
            />
          </div>

          <BlindInfo animationKey={animationKey} currentLevel={currentLevel} />
        </div>

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
    </main>
  );
}
