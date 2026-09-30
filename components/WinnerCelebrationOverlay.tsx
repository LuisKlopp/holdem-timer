"use client";

import { Trophy, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

type WinnerCelebrationOverlayProps = {
  nickname: string;
  onClose: () => void;
};

export default function WinnerCelebrationOverlay({
  nickname,
  onClose,
}: WinnerCelebrationOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex min-h-svh items-center justify-center overflow-hidden bg-black/96 px-5 py-12 text-center text-white backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-winner-name"
      onMouseDown={onClose}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 size-[34rem] max-h-[80vw] max-w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/14 blur-3xl" />
        <div className="absolute top-[12%] left-[12%] size-2 rounded-full bg-amber-200 shadow-[0_0_24px_rgba(253,230,138,0.95)]" />
        <div className="absolute top-[24%] right-[14%] size-3 rotate-45 bg-yellow-300/80" />
        <div className="absolute bottom-[18%] left-[18%] h-3 w-1.5 rotate-12 bg-rose-300/80" />
        <div className="absolute right-[20%] bottom-[13%] size-2 rounded-full bg-sky-300/90" />
      </div>

      <button
        className="btn-press-in absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/70 hover:bg-white/14 sm:top-6 sm:right-6"
        type="button"
        aria-label="우승 축하 화면 닫기"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={onClose}
      >
        <X size={21} />
      </button>

      <div
        className="relative flex w-full max-w-5xl flex-col items-center"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Image
          className="h-24 w-auto drop-shadow-[0_0_34px_rgba(251,191,36,0.5)] sm:h-32 lg:h-40"
          src="/ranking/crown-gold.png"
          alt="우승 왕관"
          width={192}
          height={174}
          priority
        />
        <p className="mt-6 flex items-center justify-center gap-2 text-sm font-black tracking-[0.32em] text-amber-200 uppercase sm:text-lg lg:text-xl">
          <Trophy size={20} />
          Winner
          <Trophy size={20} />
        </p>
        <h2
          className="mt-5 max-w-full text-5xl leading-tight font-black break-words text-amber-100 drop-shadow-[0_0_28px_rgba(251,191,36,0.34)] sm:text-7xl lg:text-9xl"
          id="celebration-winner-name"
        >
          {nickname}
        </h2>
        <p className="mt-6 text-xl font-bold tracking-[0.08em] text-white/72 sm:text-2xl lg:text-3xl">
          우승을 축하합니다!
        </p>
        <p className="mt-10 text-xs font-semibold text-white/30 sm:text-sm">
          화면을 누르면 닫힙니다
        </p>
      </div>
    </div>
  );
}
