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
    <section className="mdl:h-42 h-32 sm:h-40">
      <div
        key={animationKey}
        className="animate-level-flash mdl:p-5 flex h-full flex-col justify-center rounded-[1.25rem] p-2 sm:rounded-[1.75rem] sm:p-4"
      >
        <div className="flex flex-col gap-1.5 sm:gap-2.5">
          <div className="mdl:text-left space-y-1.5 text-center sm:space-y-2">
            <p className="mdl:text-sm text-[10px] font-semibold tracking-[0.14em] text-amber-200/70 uppercase sm:text-xs sm:tracking-[0.22em]">
              Current Stage
            </p>
            <h1 className="font-dmdisplay mdl:text-[2.9rem] text-[2.05rem] leading-none text-amber-50 sm:text-5xl">
              {getLevelTitle(currentLevel)}
            </h1>
          </div>

          {currentLevel.isBreak ? (
            <div className="rounded-[1.25rem] border border-amber-300/20 bg-amber-300/10 p-2.5 text-center text-sm font-semibold text-amber-100 sm:text-base">
              BREAK TIME
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
