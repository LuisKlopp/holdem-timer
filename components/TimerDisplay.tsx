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
    <section className="h-48 mdl:h-42">
      <div
        key={animationKey}
        className="animate-level-flash mdl:p-5 mdl:text-left relative flex h-full min-h-[8.5rem] flex-col justify-center rounded-[1.75rem] p-4 text-center sm:p-5"
      >
        <div className="space-y-2 sm:space-y-2.5">
          <p className="text-[14px] font-semibold tracking-[0.18em] text-amber-200/70 uppercase sm:text-sm">
            {isBreak ? "Break Time" : "Time Remaining"}
          </p>
          <div className="font-dmdisplay text-[2.7rem] leading-none tracking-[0.02em] text-amber-200 drop-shadow-[0_0_30px_rgba(245,158,11,0.18)] sm:text-5xl mdl:text-[3.1rem]">
            {formattedTime}
          </div>
        </div>
      </div>
    </section>
  );
}
