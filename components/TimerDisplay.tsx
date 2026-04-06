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
    <section className="h-60 w-full">
      <div
        key={animationKey}
        className="animate-level-flash mdl:p-6 mdl:text-left relative flex h-full min-h-[9.5rem] flex-col justify-center rounded-[1.75rem] p-4 text-center sm:p-5"
      >
        <div className="space-y-2 sm:space-y-2.5">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-amber-200/70 uppercase sm:text-xs">
            {isBreak ? "Break Time" : "Time Remaining"}
          </p>
          <div className="font-dmdisplay text-6xl leading-none tracking-[0.02em] text-amber-50 drop-shadow-[0_0_30px_rgba(245,158,11,0.18)]">
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
