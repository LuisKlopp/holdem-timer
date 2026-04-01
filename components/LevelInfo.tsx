import type { BlindLevel } from "@/lib/blindLevels";

type LevelInfoProps = {
  animationKey: number;
  currentLevel: BlindLevel;
  levelDurationMinutes: number;
  nextLevel?: BlindLevel;
};

const formatBlind = (value: number) => value.toLocaleString("en-US");

const getLevelTitle = (level: BlindLevel) =>
  level.isBreak ? (level.label ?? "BREAK") : `Level ${level.level}`;

export default function LevelInfo({
  animationKey,
  currentLevel,
  levelDurationMinutes,
  nextLevel,
}: LevelInfoProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[1.4fr_0.85fr]">
      <div
        key={animationKey}
        className="animate-level-flash rounded-[1.75rem] border border-amber-200/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-2 text-center lg:text-left">
            <p className="text-xs font-semibold tracking-[0.4em] text-amber-200/70 uppercase sm:text-sm">
              Current Stage
            </p>
            <h1 className="font-dmdisplay text-[clamp(2.2rem,6vw,4.25rem)] leading-none text-amber-50">
              {getLevelTitle(currentLevel)}
            </h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                Small Blind
              </p>
              <p className="mt-2 text-[clamp(1.8rem,4vw,3.2rem)] leading-none font-bold text-white">
                {currentLevel.isBreak ? "-" : formatBlind(currentLevel.sb)}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                Big Blind
              </p>
              <p className="mt-2 text-[clamp(1.8rem,4vw,3.2rem)] leading-none font-bold text-white">
                {currentLevel.isBreak ? "-" : formatBlind(currentLevel.bb)}
              </p>
            </div>
          </div>

          {currentLevel.isBreak ? (
            <div className="rounded-[1.25rem] border border-amber-300/20 bg-amber-300/10 p-3 text-center text-base font-semibold text-amber-100 sm:text-lg">
              BREAK TIME
            </div>
          ) : null}
        </div>
      </div>

      <aside className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm sm:p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.4em] text-amber-200/70 uppercase sm:text-sm">
              Upcoming
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              Next Level
            </h2>
          </div>

          <div className="space-y-3">
            {nextLevel ? (
              <div className="rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-4">
                <p className="text-sm font-semibold tracking-[0.3em] text-white/55 uppercase">
                  {getLevelTitle(nextLevel)}
                </p>
                <p className="mt-2 text-lg font-semibold text-amber-50 sm:text-xl">
                  {nextLevel.isBreak
                    ? "Pause / Rest"
                    : `${formatBlind(nextLevel.sb)} / ${formatBlind(nextLevel.bb)}`}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  {nextLevel.isBreak
                    ? `${Math.floor(nextLevel.duration / 60)} min`
                    : `${levelDurationMinutes} min`}
                </p>
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-white/10 bg-black/20 px-4 py-5 text-center text-sm text-white/50">
                더 이상 예정된 레벨이 없습니다.
              </div>
            )}
          </div>
        </div>
      </aside>
    </section>
  );
}
