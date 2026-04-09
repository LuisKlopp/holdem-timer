import type { BlindLevel } from "@/lib/blindLevels";

type BlindInfoProps = {
  animationKey: number;
  currentLevel: BlindLevel;
};

const formatBlind = (value: number) => value.toLocaleString("en-US");

export default function BlindInfo({
  animationKey,
  currentLevel,
}: BlindInfoProps) {
  return (
    <section
      key={`blinds-${animationKey}`}
      className="animate-level-flash w-full"
    >
      <div className="mdl:min-h-60 mdl:py-3.5 flex min-h-39 flex-col justify-center rounded-[1.5rem] border border-white/8 bg-black/18 px-4 py-4 text-center backdrop-blur-sm">
        <p className="text-base font-semibold tracking-[0.18em] text-white/45 uppercase sm:text-lg">
          Blinds
        </p>
        <div className="mt-2.5 flex flex-wrap items-end justify-center gap-x-3 gap-y-2 text-white">
          <span className="text-base font-semibold tracking-[0.16em] text-white/55 uppercase sm:text-xl">
            (SB)
          </span>
          <span className="text-7xl leading-none font-bold">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.sb)}
          </span>
          <span className="text-[clamp(1.8rem,4vw,3.2rem)] leading-none font-medium text-white/45">
            /
          </span>
          <span className="text-7xl leading-none font-bold">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.bb)}
          </span>
          <span className="text-base font-semibold tracking-[0.16em] text-white/55 uppercase sm:text-xl">
            (BB)
          </span>
        </div>
      </div>
    </section>
  );
}
