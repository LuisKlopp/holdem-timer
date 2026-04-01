"use client";

import { ControlPanel, LevelInfo, TimerDisplay } from "@/components";
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
    nextLevels,
    pause,
    remainingTime,
    reset,
    setLevelDuration,
    soundEnabled,
    start,
    totalLevels,
    toggleSound,
  } = useBlindTimer();

  return (
    <main className="relative h-screen overflow-hidden bg-[#050816] px-3 py-3 text-white sm:px-5 sm:py-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex h-full max-w-7xl flex-col gap-4">
        <div className="flex-1 space-y-4 overflow-hidden">
          <header className="text-center">
            <p className="text-6xl font-semibold tracking-[0.2em] text-amber-200/65 uppercase sm:text-3xl">
              엘리오 홀덤 타이머
            </p>
          </header>

          <div className="grid h-[calc(100%-1.75rem)] items-center gap-4 lg:grid-cols-[0.9fr_1.1fr]">
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
              nextLevel={nextLevels[0]}
            />
          </div>
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
