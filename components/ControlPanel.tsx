import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

type ControlPanelProps = {
  animationKey: number;
  currentLevelNumber: number;
  isRunning: boolean;
  levelDurationMinutes: number;
  remainingTime: number;
  soundEnabled: boolean;
  totalLevels: number;
  onJump: (levelNumber: number, remainingSeconds: number) => void;
  onNext: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onSetLevelDuration: (minutes: number) => void;
  onStart: () => void;
  onToggleSound: () => void;
};

type ButtonProps = {
  icon: ReactNode;
  isPrimary?: boolean;
  label: string;
  onClick: () => void;
};

const splitRemainingTime = (timeMs: number) => {
  const totalSeconds = Math.max(0, Math.ceil(timeMs / 1000));

  return {
    minutes: Math.floor(totalSeconds / 60).toString(),
    seconds: (totalSeconds % 60).toString().padStart(2, "0"),
  };
};

function ControlButton({
  icon,
  isPrimary = false,
  label,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`btn-press-in inline-flex min-w-0 items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-[11px] font-semibold transition hover:-translate-y-0.5 sm:text-sm ${
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

function JumpInput({
  label,
  max,
  min = 0,
  onChange,
  value,
}: {
  label: string;
  max?: number;
  min?: number;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="flex min-w-[4.25rem] flex-col gap-1.5 sm:min-w-[4.75rem]">
      <span className="text-[10px] font-semibold tracking-[0.14em] text-white/45 uppercase">
        {label}
      </span>
      <input
        className="rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-sm font-semibold text-white transition outline-none placeholder:text-white/25 focus:border-amber-300/50 focus:bg-white/12 sm:text-base"
        inputMode="numeric"
        max={max}
        min={min}
        onChange={(event) =>
          onChange(event.target.value.replace(/[^0-9]/g, ""))
        }
        placeholder="0"
        type="text"
        value={value}
      />
    </label>
  );
}

export default function ControlPanel({
  animationKey,
  currentLevelNumber,
  isRunning,
  levelDurationMinutes,
  remainingTime,
  soundEnabled,
  totalLevels,
  onJump,
  onNext,
  onPause,
  onPrevious,
  onReset,
  onSetLevelDuration,
  onStart,
  onToggleSound,
}: ControlPanelProps) {
  const [levelValue, setLevelValue] = useState(currentLevelNumber.toString());
  const [durationValue, setDurationValue] = useState(
    levelDurationMinutes.toString()
  );
  const [minuteValue, setMinuteValue] = useState(
    splitRemainingTime(remainingTime).minutes
  );
  const [secondValue, setSecondValue] = useState(
    splitRemainingTime(remainingTime).seconds
  );

  useEffect(() => {
    const nextTime = splitRemainingTime(remainingTime);

    setLevelValue(currentLevelNumber.toString());
    setDurationValue(levelDurationMinutes.toString());
    setMinuteValue(nextTime.minutes);
    setSecondValue(nextTime.seconds);
  }, [animationKey, currentLevelNumber, levelDurationMinutes]);

  const applyJump = () => {
    const parsedLevel = Number(levelValue || "1");
    const parsedMinutes = Number(minuteValue || "0");
    const parsedSeconds = Number(secondValue || "0");
    const normalizedSeconds = parsedMinutes * 60 + Math.min(parsedSeconds, 59);

    onJump(parsedLevel, normalizedSeconds);
  };

  const applyDuration = () => {
    onSetLevelDuration(Number(durationValue || "8"));
  };

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2.5 rounded-[1.5rem] border border-white/10 bg-black/35 p-2.5 backdrop-blur-md sm:gap-3 sm:p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mdl:grid-cols-5">
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

        <div className="grid gap-3 mdl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col gap-2 rounded-[1.25rem] border border-white/8 bg-white/5 px-3 py-2.5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-amber-200/65 uppercase">
                Jump Control
              </p>
              <p className="text-xs text-white/55 sm:text-sm">
                원하는 레벨과 남은 시간을 입력해서 바로 이동합니다.
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-center gap-2.5 mdl:justify-start">
              <JumpInput
                label={`Level 1-${totalLevels}`}
                max={totalLevels}
                min={1}
                onChange={setLevelValue}
                value={levelValue}
              />
              <JumpInput
                label="Minutes"
                onChange={setMinuteValue}
                value={minuteValue}
              />
              <JumpInput
                label="Seconds"
                max={59}
                onChange={setSecondValue}
                value={secondValue}
              />
              <button
                className="btn-press-in inline-flex min-w-24 items-center justify-center rounded-full border border-amber-300/50 bg-amber-300/12 px-4 py-2.5 text-xs font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:bg-amber-300/18 sm:min-w-[7rem] sm:text-sm"
                onClick={applyJump}
                type="button"
              >
                점프 적용
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-[1.25rem] border border-white/8 bg-white/5 px-3 py-2.5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-amber-200/65 uppercase">
                Level Duration
              </p>
              <p className="text-xs text-white/55 sm:text-sm">
                일반 레벨 기본 시간은 현재 {levelDurationMinutes}분입니다.
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-center gap-2.5 mdl:justify-start">
              <JumpInput
                label="Minutes"
                min={1}
                onChange={setDurationValue}
                value={durationValue}
              />
              <button
                className="btn-press-in inline-flex min-w-24 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/12 px-4 py-2.5 text-xs font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-300/18 sm:min-w-[7rem] sm:text-sm"
                onClick={applyDuration}
                type="button"
              >
                듀레이션 적용
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
