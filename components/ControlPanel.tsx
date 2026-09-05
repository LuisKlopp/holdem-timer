"use client";

import {
  BellRing,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";
import { type ChangeEvent, type ReactNode, useState } from "react";

type ControlPanelProps = {
  isRunning: boolean;
  alertVolume: number;
  soundEnabled: boolean;
  onAlertVolumeChange: (volume: number) => void;
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

type ChimeVolumeControlProps = {
  alertVolume: number;
  onAlertVolumeChange: (volume: number) => void;
};

function ChimeVolumeControl({
  alertVolume,
  onAlertVolumeChange,
}: ChimeVolumeControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAlertVolumeChange(Number(event.target.value));
  };

  return (
    <div className="relative hidden mdl:block">
      <button
        className="btn-press-in inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-sm font-semibold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/12"
        type="button"
        aria-controls="chime-volume-panel"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <BellRing className="h-4 w-4" />
        <span>차임벨</span>
        <SlidersHorizontal className="h-4 w-4 text-amber-100/75" />
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 bottom-full z-20 mb-2 w-64 rounded-2xl border border-white/12 bg-[#0b0d18] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
          id="chime-volume-panel"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-amber-100">차임벨 볼륨</p>
            <p className="text-sm font-black text-white">{alertVolume}%</p>
          </div>

          <input
            className="mt-3 h-2 w-full cursor-pointer accent-amber-200"
            type="range"
            min="10"
            max="100"
            step="10"
            value={alertVolume}
            aria-label="차임벨 볼륨"
            onChange={handleVolumeChange}
          />

          <div className="mt-2 flex justify-between text-xs font-semibold text-white/40">
            <span>작게</span>
            <span>크게</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ControlPanel({
  alertVolume,
  isRunning,
  soundEnabled,
  onAlertVolumeChange,
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
        <div className="mdl:grid-cols-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
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
          <ChimeVolumeControl
            alertVolume={alertVolume}
            onAlertVolumeChange={onAlertVolumeChange}
          />
        </div>
      </div>
    </section>
  );
}
