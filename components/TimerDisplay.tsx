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
}: TimerDisplayProps) {
  return (
    <section className="mdl:h-42 h-32 sm:h-40">
      <div
        key={animationKey}
        className="animate-level-flash mdl:p-5 mdl:text-left relative flex h-full flex-col justify-center rounded-[1.25rem] p-2 text-center sm:rounded-[1.75rem] sm:p-4"
      >
        <div className="space-y-1.5 sm:space-y-2.5">
          <p className="mdl:text-sm text-[10px] font-semibold tracking-[0.14em] text-amber-200/70 uppercase sm:text-xs sm:tracking-[0.18em]">
            {isBreak ? "Break Time" : "Time Remaining"}
          </p>
          <div className="font-dmdisplay mdl:text-[3.1rem] text-[2.15rem] leading-none tracking-[0.02em] text-amber-200 drop-shadow-[0_0_30px_rgba(245,158,11,0.18)] sm:text-5xl">
            {formattedTime}
          </div>
        </div>
      </div>
    </section>
  );
}
