"use client";

import { Check, Loader2, Search, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getPodiumApiErrorMessage, type HoldemMember } from "@/api";
import { useHoldemMembers } from "@/hooks";

type WinnerCelebrationModalProps = {
  errorMessage?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: (winner: HoldemMember) => void;
};

export default function WinnerCelebrationModal({
  errorMessage,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: WinnerCelebrationModalProps) {
  const membersQuery = useHoldemMembers();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedWinner, setSelectedWinner] = useState<HoldemMember | null>(
    null
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const filteredMembers = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return membersQuery.data ?? [];
    }

    return (membersQuery.data ?? []).filter((member) =>
      member.nickname.toLowerCase().includes(normalizedKeyword)
    );
  }, [membersQuery.data, searchKeyword]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-celebration-title"
      onMouseDown={onCancel}
    >
      <div
        className="flex h-[88svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border-white/12 bg-[#0b0d18] shadow-[0_24px_90px_rgba(0,0,0,0.7)] sm:max-h-[calc(100svh-3rem)] sm:rounded-[2rem] sm:border"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] text-amber-200/70 uppercase">
              <Trophy size={14} />
              Winner Celebration
            </p>
            <h2
              className="mt-1 text-2xl font-black text-white"
              id="winner-celebration-title"
            >
              우승자 선택
            </h2>
          </div>

          <button
            className="btn-press-in flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 hover:bg-white/10"
            type="button"
            aria-label="우승자 선택 닫기"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            <X size={21} />
          </button>
        </header>

        <div className="border-b border-white/8 px-4 py-3 sm:px-6">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-white/35"
              size={18}
            />
            <span className="sr-only">멤버 검색</span>
            <input
              className="h-12 w-full rounded-full border border-white/10 bg-white/6 pr-4 pl-11 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-amber-200/40"
              type="search"
              value={searchKeyword}
              placeholder="닉네임으로 멤버 검색"
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <p className="mb-3 text-sm font-semibold text-white/55">
            축하 화면에 표시할 우승자 한 명을 선택하세요.
          </p>

          {membersQuery.isPending ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-white/55">
              <Loader2 className="animate-spin" size={28} />
              <p className="font-semibold">멤버를 불러오는 중입니다.</p>
            </div>
          ) : membersQuery.isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center text-sm font-semibold text-rose-100">
              <p>
                {getPodiumApiErrorMessage(
                  membersQuery.error,
                  "멤버를 불러오지 못했습니다."
                )}
              </p>
              <button
                className="btn-press-in mt-4 min-h-10 rounded-full border border-rose-200/20 px-4 text-xs font-bold"
                type="button"
                onClick={() => void membersQuery.refetch()}
              >
                다시 시도
              </button>
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filteredMembers.map((member) => {
                const isSelected = selectedWinner?.id === member.id;

                return (
                  <button
                    className={
                      isSelected
                        ? "btn-press-in flex min-h-16 items-center justify-between gap-2 rounded-2xl border border-amber-200/60 bg-amber-200 px-3 text-left text-sm font-black text-black shadow-[0_12px_28px_rgba(251,191,36,0.2)]"
                        : "btn-press-in flex min-h-16 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 text-left text-sm font-bold text-white/82 transition hover:bg-white/10"
                    }
                    type="button"
                    disabled={isSubmitting}
                    key={member.id}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedWinner(member)}
                  >
                    <span className="min-w-0 break-words">
                      {member.nickname}
                    </span>
                    {isSelected ? (
                      <Check className="shrink-0" size={17} />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center text-center text-sm font-semibold text-white/45">
              {searchKeyword
                ? "검색 결과가 없습니다."
                : "서버에서 가져온 멤버가 없습니다."}
            </div>
          )}
        </div>

        <footer className="border-t border-white/10 bg-black/20 p-4 sm:px-6">
          {errorMessage ? (
            <p className="mb-3 text-center text-sm font-semibold text-rose-200">
              {errorMessage}
            </p>
          ) : null}
          <button
            className="btn-press-in flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-amber-200 px-6 text-base font-black text-black shadow-[0_12px_32px_rgba(251,191,36,0.22)] disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/30 disabled:shadow-none"
            type="button"
            disabled={!selectedWinner || isSubmitting}
            onClick={() => selectedWinner && onConfirm(selectedWinner)}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={19} />
            ) : (
              <Trophy size={19} fill="currentColor" />
            )}
            {isSubmitting
              ? "우승 축하 전송 중..."
              : selectedWinner
                ? `${selectedWinner.nickname} 우승!`
                : "우승자를 선택해 주세요"}
          </button>
        </footer>
      </div>
    </div>
  );
}
