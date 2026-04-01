type TimerDisplayProps = {
  animationKey: number;
  formattedTime: string;
  isBreak: boolean;
  isRunning: boolean;
};

export default function TimerDisplay({
  animationKey,
  formattedTime,
  isBreak,
  isRunning,
}: TimerDisplayProps) {
  return (
    <section className="flex w-full flex-col items-center gap-4 text-center lg:items-start lg:text-left">
      <div
        key={animationKey}
        className="animate-level-flash space-y-4"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.55em] text-amber-200/70 sm:text-sm">
          {isBreak ? "Break Time" : "Time Remaining"}
        </p>
        <div className="font-dmdisplay text-[clamp(4rem,14vw,9rem)] leading-none tracking-[0.03em] text-amber-50 drop-shadow-[0_0_30px_rgba(245,158,11,0.18)]">
          {formattedTime}
        </div>
      </div>

      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur sm:text-sm">
        {isRunning ? "Running" : "Paused"}
      </div>
    </section>
  );
}
