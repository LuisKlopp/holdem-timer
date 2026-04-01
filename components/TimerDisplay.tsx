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
    <section className="mt-24 w-full">
      <div
        key={animationKey}
        className="animate-level-flash rounded-[1.75rem] border border-amber-200/10 bg-white/6 p-5 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6 lg:text-left"
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-amber-200/70 uppercase sm:text-sm">
            {isBreak ? "Break Time" : "Time Remaining"}
          </p>
          <div className="font-dmdisplay text-7xl leading-none tracking-[0.02em] text-amber-50 drop-shadow-[0_0_30px_rgba(245,158,11,0.18)]">
            {formattedTime}
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur sm:inline-flex sm:text-sm">
            {isRunning ? "Running" : "Paused"}
          </div>
        </div>
      </div>
    </section>
  );
}
