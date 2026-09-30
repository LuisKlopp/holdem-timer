import type { BlindLevel } from "@/lib/blindLevels";

type BlindInfoProps = {
  animationKey: number;
  currentLevel: BlindLevel;
  message?: string;
};

const formatBlind = (value: number) => value.toLocaleString("en-US");

export default function BlindInfo({
  animationKey,
  currentLevel,
  message,
}: BlindInfoProps) {
  return (
    <section
      key={`blinds-${animationKey}`}
      className="animate-level-flash h-full w-full"
    >
      <div className="mdl:min-h-60 mdl:py-3.5 flex h-full min-h-32 flex-col justify-center rounded-[1.25rem] border border-white/8 bg-black/18 px-2.5 py-3 text-center backdrop-blur-sm sm:min-h-39 sm:rounded-[1.5rem] sm:px-4 sm:py-4">
        {message ? (
          <p className="mb-2 text-base font-semibold text-amber-100/85 sm:mb-3 sm:text-2xl">
            {message}
          </p>
        ) : null}
        <p className="text-xs font-semibold tracking-[0.16em] text-white/45 uppercase sm:text-lg sm:tracking-[0.18em]">
          Blinds
        </p>
        <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-end gap-x-1.5 text-white sm:mt-2.5 sm:gap-x-3">
          <span className="pb-0.5 text-[10px] font-semibold tracking-[0.1em] text-white/55 uppercase sm:text-xl sm:tracking-[0.16em]">
            (SB)
          </span>
          <span className="text-[clamp(2.5rem,13vw,4.5rem)] leading-none font-bold sm:text-7xl">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.sb)}
          </span>
          <span className="text-[clamp(1.35rem,5vw,3.2rem)] leading-none font-medium text-white/45">
            /
          </span>
          <span className="text-[clamp(2.5rem,13vw,4.5rem)] leading-none font-bold sm:text-7xl">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.bb)}
          </span>
          <span className="pb-0.5 text-[10px] font-semibold tracking-[0.1em] text-white/55 uppercase sm:text-xl sm:tracking-[0.16em]">
            (BB)
          </span>
        </div>
      </div>
    </section>
  );
}
