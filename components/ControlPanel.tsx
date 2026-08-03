import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { type ReactNode } from "react";

type ControlPanelProps = {
  isRunning: boolean;
  soundEnabled: boolean;
  onNext: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onStart: () => void;
  onToggleSound: () => void;
};

type ButtonProps = {
  icon: ReactNode;
  isPrimary?: boolean;
  label: string;
  onClick: () => void;
};

function ControlButton({
  icon,
  isPrimary = false,
  label,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn-press-in mdl:py-2 inline-flex min-w-0 items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-[11px] font-semibold transition hover:-translate-y-0.5 sm:text-sm ${
        isPrimary
          ? "border-amber-300/60 bg-amber-200 text-neutral-950 shadow-[0_12px_36px_rgba(251,191,36,0.25)]"
          : "border-white/12 bg-white/8 text-white/90 hover:bg-white/12"
      }`}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function ControlPanel({
  isRunning,
  soundEnabled,
  onNext,
  onPause,
  onPrevious,
  onReset,
  onStart,
  onToggleSound,
}: ControlPanelProps) {
  return (
    <section className="w-full">
      <div className="mdl:gap-2 mdl:p-2.5 mx-auto flex w-full max-w-6xl flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/35 p-2.5 backdrop-blur-md">
        <div className="mdl:grid-cols-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          <ControlButton
            icon={<SkipBack className="h-4 w-4" />}
            label="이전"
            onClick={onPrevious}
          />
          {isRunning ? (
            <ControlButton
              icon={<Pause className="h-4 w-4" />}
              isPrimary
              label="일시정지"
              onClick={onPause}
            />
          ) : (
            <ControlButton
              icon={<Play className="h-4 w-4" />}
              isPrimary
              label="시작 / 재생"
              onClick={onStart}
            />
          )}
          <ControlButton
            icon={<SkipForward className="h-4 w-4" />}
            label="다음"
            onClick={onNext}
          />
          <ControlButton
            icon={<RotateCcw className="h-4 w-4" />}
            label="리셋"
            onClick={onReset}
          />
          <ControlButton
            icon={
              soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )
            }
            label={soundEnabled ? "사운드 ON" : "사운드 OFF"}
            onClick={onToggleSound}
          />
        </div>
      </div>
    </section>
  );
}
