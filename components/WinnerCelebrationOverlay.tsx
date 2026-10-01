"use client";

import { Trophy, X } from "lucide-react";
import Image from "next/image";
import { type CSSProperties, useEffect } from "react";

import { playCelebrationFanfare } from "@/lib/celebrationFanfare";

type WinnerCelebrationOverlayProps = {
  nickname: string;
  onClose: () => void;
  soundEnabled?: boolean;
};

type ConfettiStyle = CSSProperties & {
  "--confetti-delay": string;
  "--confetti-duration": string;
  "--confetti-rotation": string;
  "--confetti-apex-x": string;
  "--confetti-apex-y": string;
  "--confetti-end-x": string;
  "--confetti-end-y": string;
};

const confettiColors = [
  "#fde68a",
  "#fda4af",
  "#7dd3fc",
  "#fcd34d",
  "#c4b5fd",
  "#6ee7b7",
  "#fb7185",
  "#fef08a",
  "#93c5fd",
  "#f9a8d4",
];
const confettiApexX = [55, 62, 52, 66, 58, 64, 50, 68, 56, 62];
const confettiApexY = [-76, -88, -68, -82, -96, -72, -84, -92, -70, -86];
const confettiEndX = [62, 68, 58, 72, 66, 70, 56, 76, 62, 70];
const confettiEndY = [-12, -20, -8, -16, -28, -6, -18, -24, -10, -22];
const confettiDurations = [2.2, 2.45, 2.05, 2.35, 2.55, 2.15, 2.4, 2.5, 2.1, 2.3];
const rightApexXJitter = [-4.2, 2.8, -1.6, 5.1, -3.3, 1.4, 4.4, -2.5, 3.6, -0.8];
const rightApexYJitter = [5, -4, 2, -6, 3, -2, 6, -3, 1, -5];
const rightEndXJitter = [2.5, -4.4, 3.2, -1.8, 5, -3, 1.2, -5.2, 3.8, -2.1];
const rightEndYJitter = [-4, 5, -2, 6, -5, 3, -1, 4, -3, 2];
const rightStartJitter = [0.7, -0.4, 1.1, -0.8, 0.3, -1.2, 0.9, -0.2, 1.3, -0.6];

const createConfettiBurst = (direction: 1 | -1): ConfettiStyle[] =>
  Array.from({ length: 40 }, (_, index) => {
    const lane = index % 10;
    const variation = Math.floor(index / 10);
    const apexSpread = [-2.5, 0.8, 3.2, -4.4][variation];
    const apexHeightSpread = [3, -2, 1, -5][variation];
    const fallSpread = [-2, 1.2, 4, -4.8][variation];
    const fallHeightSpread = [3, -3, 1, -5][variation];
    const startSpread = [-1.8, -0.1, 1.65, -2.7][variation];
    const delayOffset = [0, 0.09, 0.18, 0.045][variation];
    const durationOffset = [0, 0.11, 0.22, 0.06][variation];
    const crossTravel = [8, 14, 11, 17][variation];
    const width = [0.44, 0.55, 0.66][(lane + variation) % 3];
    const rotationDirection = (lane + variation) % 2 === 0 ? 1 : -1;
    const isRight = direction === -1;
    const apexXJitter = isRight ? rightApexXJitter[lane] : 0;
    const apexYJitter = isRight ? rightApexYJitter[lane] : 0;
    const endXJitter = isRight ? rightEndXJitter[lane] : 0;
    const endYJitter = isRight ? rightEndYJitter[lane] : 0;
    const startJitter = isRight ? rightStartJitter[lane] : 0;

    return {
      "--confetti-delay": `${lane * 0.035 + delayOffset + (lane % 3) * 0.008}s`,
      "--confetti-duration": `${confettiDurations[lane] + durationOffset}s`,
      "--confetti-rotation": `${(760 + ((lane * 83 + variation * 127) % 300)) * rotationDirection * direction}deg`,
      "--confetti-apex-x": `${(confettiApexX[lane] + apexSpread + apexXJitter + crossTravel) * direction}vw`,
      "--confetti-apex-y": `${confettiApexY[lane] + apexHeightSpread + apexYJitter}vh`,
      "--confetti-end-x": `${(confettiEndX[lane] + fallSpread + endXJitter + crossTravel) * direction}vw`,
      "--confetti-end-y": `${confettiEndY[lane] + fallHeightSpread + endYJitter}vh`,
      left: `${(startSpread + ((lane % 4) - 1.5) * 0.16 + startJitter) * direction}rem`,
      width: `${width}rem`,
      height: `${width * (1.55 + (lane % 3) * 0.12)}rem`,
      backgroundColor:
        confettiColors[
          (lane + variation * 3 + (direction === -1 ? 2 : 0)) %
            confettiColors.length
        ],
    };
  });

const leftConfetti = createConfettiBurst(1);
const rightConfetti = createConfettiBurst(-1);

export default function WinnerCelebrationOverlay({
  nickname,
  onClose,
  soundEnabled = true,
}: WinnerCelebrationOverlayProps) {
  useEffect(() => {
    if (!soundEnabled) {
      return;
    }

    let stopFanfare: (() => void) | undefined;
    let isDisposed = false;

    void playCelebrationFanfare()
      .then((stop) => {
        if (isDisposed) {
          stop();
          return;
        }

        stopFanfare = stop;
      })
      .catch(() => undefined);

    return () => {
      isDisposed = true;
      stopFanfare?.();
    };
  }, [soundEnabled]);

  return (
    <div
      className="celebration-overlay fixed inset-0 z-[80] flex min-h-svh items-center justify-center overflow-hidden bg-black px-5 py-12 text-center text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-winner-name"
    >
      <div className="celebration-effects pointer-events-none absolute inset-0">
        <div className="celebration-glow absolute top-1/2 left-1/2 h-[min(80vh,48rem)] w-[min(90vw,60rem)] -translate-x-1/2 -translate-y-1/2 rounded-[50%]" />

        <div className="celebration-confetti-launcher celebration-confetti-launcher-left">
          {leftConfetti.map((style, index) => (
            <span
              className="celebration-confetti"
              key={`left-${index}`}
              style={style}
            />
          ))}
        </div>
        <div className="celebration-confetti-launcher celebration-confetti-launcher-right">
          {rightConfetti.map((style, index) => (
            <span
              className="celebration-confetti"
              key={`right-${index}`}
              style={style}
            />
          ))}
        </div>
      </div>

      <button
        className="celebration-close btn-press-in absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/70 hover:bg-white/14 sm:top-6 sm:right-6"
        type="button"
        aria-label="우승 축하 화면 닫기"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={onClose}
      >
        <X size={21} />
      </button>

      <div className="relative flex w-full max-w-5xl flex-col items-center">
        <div className="celebration-crown-entry">
          <Image
            className="celebration-crown-float h-24 w-auto drop-shadow-[0_0_34px_rgba(251,191,36,0.5)] sm:h-32 lg:h-40"
            src="/ranking/crown-gold-hd.png"
            alt="우승 왕관"
            width={1317}
            height={1194}
            sizes="(min-width: 1024px) 177px, (min-width: 640px) 141px, 106px"
            unoptimized
            priority
          />
        </div>
        <p className="celebration-kicker mt-6 flex items-center justify-center gap-2 text-sm font-black tracking-[0.32em] text-amber-200 uppercase sm:text-lg lg:text-xl">
          <Trophy size={20} />
          Winner
          <Trophy size={20} />
        </p>
        <h2
          className="celebration-name mt-5 max-w-full text-5xl leading-tight font-black break-words text-amber-100 drop-shadow-[0_0_28px_rgba(251,191,36,0.34)] sm:text-7xl lg:text-[112px]"
          id="celebration-winner-name"
        >
          {nickname}
        </h2>
        <p className="celebration-message mt-6 text-xl font-bold tracking-[0.08em] text-white/72 sm:text-2xl lg:text-3xl">
          우승을 축하합니다!
        </p>
      </div>
    </div>
  );
}
