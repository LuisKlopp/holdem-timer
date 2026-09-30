"use client";

import { CircleStop, X } from "lucide-react";
import { useEffect } from "react";

import {
  getTournamentGameDealer,
  getTournamentGamePlayers,
  type TournamentGameRecord,
} from "@/api";

type GameEndConfirmModalProps = {
  game: TournamentGameRecord;
  errorMessage?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function GameEndConfirmModal({
  errorMessage,
  game,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: GameEndConfirmModalProps) {
  const players = getTournamentGamePlayers(game);
  const dealer = getTournamentGameDealer(game);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/78 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-end-title"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-md rounded-[1.75rem] border border-white/12 bg-[#0b0d18] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.6)] sm:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-200/12 text-rose-100">
            <CircleStop size={24} />
          </div>
          <button
            className="btn-press-in flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/60 hover:bg-white/10"
            type="button"
            aria-label="게임 종료 확인 닫기"
            onClick={onCancel}
          >
            <X size={19} />
          </button>
        </div>

        <h2 className="mt-5 text-2xl font-black text-white" id="game-end-title">
          현재 게임을 종료할까요?
        </h2>
        <p className="mt-2 text-sm leading-6 font-medium text-white/55">
          참가자와 딜러 기록이 확정되어 서버의 게임 기록에 보관됩니다.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/6 p-3 text-center">
            <p className="text-xs font-semibold text-white/40">참가자</p>
            <p className="mt-1 text-xl font-black text-white">
              {players.length}명
            </p>
          </div>
          <div className="rounded-2xl bg-white/6 p-3 text-center">
            <p className="text-xs font-semibold text-white/40">딜러</p>
            <p className="mt-1 truncate text-base font-black text-sky-100">
              {dealer?.nicknameSnapshot ?? "확인 불가"}
            </p>
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-sm font-semibold text-rose-200">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            className="btn-press-in min-h-12 rounded-full border border-white/10 bg-white/6 px-4 text-sm font-bold text-white/70 hover:bg-white/10"
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            계속 진행
          </button>
          <button
            className="btn-press-in min-h-12 rounded-full bg-rose-200 px-4 text-sm font-black text-rose-950 hover:bg-rose-100"
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? "종료 처리 중..." : "게임 종료"}
          </button>
        </div>
      </div>
    </div>
  );
}
