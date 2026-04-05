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
      <div className="flex min-h-[12rem] flex-col justify-center rounded-[1.5rem] border border-white/8 bg-black/18 px-4 py-5 text-center backdrop-blur-sm sm:py-6">
        <p className="text-lg font-semibold tracking-[0.18em] text-white/45 uppercase sm:text-xl">
          Blinds
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-center gap-x-4 gap-y-2 text-white">
          <span className="text-lg font-semibold tracking-[0.16em] text-white/55 uppercase sm:text-2xl">
            (SB)
          </span>
          <span className="text-[clamp(2.8rem,7vw,5.4rem)] leading-none font-bold">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.sb)}
          </span>
          <span className="text-[clamp(2.1rem,5vw,3.8rem)] leading-none font-medium text-white/45">
            /
          </span>
          <span className="text-[clamp(2.8rem,7vw,5.4rem)] leading-none font-bold">
            {currentLevel.isBreak ? "-" : formatBlind(currentLevel.bb)}
          </span>
          <span className="text-lg font-semibold tracking-[0.16em] text-white/55 uppercase sm:text-2xl">
            (BB)
          </span>
        </div>
      </div>
    </section>
  );
}
