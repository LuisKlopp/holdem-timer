import type { BlindLevel } from "@/lib/blindLevels";

type LevelInfoProps = {
  animationKey: number;
  currentLevel: BlindLevel;
  levelDurationMinutes: number;
};

const formatBlind = (value: number) => value.toLocaleString("en-US");

const getLevelTitle = (level: BlindLevel) =>
  level.isBreak ? (level.label ?? "BREAK") : `Level ${level.level}`;

export default function LevelInfo({
  animationKey,
  currentLevel,
}: LevelInfoProps) {
  return (
    <section className="mx-auto mt-24 flex w-full max-w-6xl flex-col gap-4">
      <div
        key={`blinds-${animationKey}`}
        className="animate-level-flash grid gap-3 text-center sm:grid-cols-2"
      >
        <div className="rounded-[1.5rem] border border-white/8 bg-black/18 px-4 py-4 backdrop-blur-sm">
          <p className="text-2xl font-semibold tracking-widest text-white/50 uppercase">
            스몰 블라인드 (SB)
          </p>
          <p className="mt-2 text-[clamp(2.8rem,7vw,5.5rem)] leading-none font-bold text-white">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.sb)}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/8 bg-black/18 px-4 py-4 backdrop-blur-sm">
          <p className="text-2xl font-semibold tracking-widest text-white/50 uppercase">
            빅 블라인드 (BB)
          </p>
          <p className="mt-2 text-[clamp(2.8rem,7vw,5.5rem)] leading-none font-bold text-white">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.bb)}
          </p>
        </div>
      </div>

      <div
        key={animationKey}
        className="animate-level-flash rounded-[1.75rem] border border-amber-200/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-2 text-center lg:text-left">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/70 uppercase sm:text-sm">
              Current Stage
            </p>
            <h1 className="font-dmdisplay text-5xl leading-none text-amber-50">
              {getLevelTitle(currentLevel)}
            </h1>
          </div>

          {currentLevel.isBreak ? (
            <div className="rounded-[1.25rem] border border-amber-300/20 bg-amber-300/10 p-3 text-center text-base font-semibold text-amber-100 sm:text-lg">
              BREAK TIME
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
