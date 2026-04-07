import type { BlindLevel } from "@/lib/blindLevels";

type LevelInfoProps = {
  animationKey: number;
  currentLevel: BlindLevel;
  levelDurationMinutes: number;
};

const getLevelTitle = (level: BlindLevel) =>
  level.isBreak ? (level.label ?? "BREAK") : `Level ${level.level}`;

export default function LevelInfo({
  animationKey,
  currentLevel,
}: LevelInfoProps) {
  return (
    <section className="mx-auto h-60 w-full">
      <div
        key={animationKey}
        className="animate-level-flash mdl:p-6 flex h-full min-h-[9.5rem] flex-col justify-center rounded-[1.75rem] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3">
          <div className="mdl:text-left space-y-2 text-center">
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
