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
    <section className="mx-auto h-48 mdl:h-42">
      <div
        key={animationKey}
        className="animate-level-flash mdl:p-5 flex h-full min-h-[8.5rem] flex-col justify-center rounded-[1.75rem] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-2.5">
          <div className="mdl:text-left space-y-2 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/70 uppercase sm:text-sm">
              Current Stage
            </p>
            <h1 className="font-dmdisplay text-[2.4rem] leading-none text-amber-50 sm:text-5xl mdl:text-[2.9rem]">
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
