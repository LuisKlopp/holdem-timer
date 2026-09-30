"use client";

import { Check, Loader2, Search, UserRound, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getPodiumApiErrorMessage, type HoldemMember } from "@/api";
import { useHoldemMembers } from "@/hooks";

const MAX_PLAYER_COUNT = 10;

type SelectionMode = "players" | "dealer";

type GameSetupModalProps = {
  onCancel: () => void;
  onConfirm: (players: HoldemMember[], dealer: HoldemMember) => void;
  errorMessage?: string;
  isSubmitting?: boolean;
};

const getMemberKey = (member: HoldemMember) => member.id;

export default function GameSetupModal({
  errorMessage,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: GameSetupModalProps) {
  const membersQuery = useHoldemMembers();
  const [dealer, setDealer] = useState<HoldemMember | null>(null);
  const [players, setPlayers] = useState<HoldemMember[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("players");

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

  const isPlayerSelected = (member: HoldemMember) =>
    players.some((player) => getMemberKey(player) === getMemberKey(member));

  const isDealerSelected = (member: HoldemMember) =>
    dealer ? getMemberKey(dealer) === getMemberKey(member) : false;

  const handleMemberClick = (member: HoldemMember) => {
    if (selectionMode === "dealer") {
      if (isPlayerSelected(member)) {
        return;
      }

      setDealer((currentDealer) =>
        currentDealer && getMemberKey(currentDealer) === getMemberKey(member)
          ? null
          : member
      );
      return;
    }

    if (isDealerSelected(member)) {
      return;
    }

    if (isPlayerSelected(member)) {
      setPlayers((currentPlayers) =>
        currentPlayers.filter(
          (player) => getMemberKey(player) !== getMemberKey(member)
        )
      );
      return;
    }

    if (players.length >= MAX_PLAYER_COUNT) {
      return;
    }

    const nextPlayers = [...players, member];
    setPlayers(nextPlayers);

    if (nextPlayers.length === MAX_PLAYER_COUNT) {
      setSelectionMode("dealer");
    }
  };

  const canStartGame =
    players.length > 0 &&
    players.length <= MAX_PLAYER_COUNT &&
    new Set(players.map((player) => player.id)).size === players.length &&
    dealer !== null &&
    !players.some((player) => player.id === dealer.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/78 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-setup-title"
      onMouseDown={onCancel}
    >
      <div
        className="flex h-[100svh] w-full max-w-4xl flex-col overflow-hidden border-white/12 bg-[#0b0d18] shadow-[0_24px_90px_rgba(0,0,0,0.65)] sm:max-h-[calc(100svh-3rem)] sm:rounded-[2rem] sm:border"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-amber-200/60 uppercase">
              New Game
            </p>
            <h2
              className="mt-1 text-2xl font-black text-white"
              id="game-setup-title"
            >
              게임 멤버 선택
            </h2>
          </div>

          <button
            className="btn-press-in flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 hover:bg-white/10"
            type="button"
            aria-label="게임 멤버 선택 닫기"
            onClick={onCancel}
          >
            <X size={21} />
          </button>
        </header>

        <div className="grid grid-cols-2 border-b border-white/10 p-2">
          <button
            className={
              selectionMode === "players"
                ? "btn-press-in flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-200 text-sm font-black text-black"
                : "btn-press-in flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white/55 hover:bg-white/6"
            }
            type="button"
            onClick={() => setSelectionMode("players")}
          >
            <Users size={18} />
            플레이어 {players.length}/{MAX_PLAYER_COUNT}
          </button>
          <button
            className={
              selectionMode === "dealer"
                ? "btn-press-in flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-200 text-sm font-black text-sky-950"
                : "btn-press-in flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white/55 hover:bg-white/6"
            }
            type="button"
            onClick={() => setSelectionMode("dealer")}
          >
            <UserRound size={18} />
            딜러 {dealer?.nickname ?? "미지정"}
          </button>
        </div>

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
            {selectionMode === "players"
              ? "게임에 참여할 플레이어를 선택하세요. 최대 10명까지 가능합니다."
              : "플레이어를 제외한 멤버 중 딜러 1명을 선택하세요."}
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {filteredMembers.map((member) => {
                const playerSelected = isPlayerSelected(member);
                const dealerSelected = isDealerSelected(member);
                const isRoleConflict =
                  selectionMode === "players" ? dealerSelected : playerSelected;
                const isLimitReached =
                  selectionMode === "players" &&
                  players.length >= MAX_PLAYER_COUNT &&
                  !playerSelected;
                const isDisabled = isRoleConflict || isLimitReached;
                const isSelected = playerSelected || dealerSelected;

                return (
                  <button
                    className={`btn-press-in flex min-h-16 items-center justify-between gap-2 rounded-2xl border px-3 text-left transition disabled:cursor-not-allowed disabled:opacity-35 ${
                      dealerSelected
                        ? "border-sky-200/55 bg-sky-200 text-sky-950"
                        : playerSelected
                          ? "border-amber-200/55 bg-amber-200 text-black"
                          : "border-white/10 bg-white/6 text-white/82 hover:bg-white/10"
                    }`}
                    type="button"
                    disabled={isDisabled}
                    key={getMemberKey(member)}
                    onClick={() => handleMemberClick(member)}
                  >
                    <span className="min-w-0 text-sm font-black break-words">
                      {member.nickname}
                    </span>
                    {isSelected ? (
                      <span className="flex shrink-0 items-center gap-1 text-[10px] font-black">
                        {dealerSelected ? "딜러" : "참가"}
                        <Check size={15} />
                      </span>
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
            <p className="mb-3 text-center text-sm font-semibold text-rose-200 sm:text-right">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              className="btn-press-in min-h-12 rounded-full border border-white/10 bg-white/6 px-6 text-sm font-bold text-white/70 hover:bg-white/10"
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              취소
            </button>
            <button
              className="btn-press-in min-h-12 rounded-full bg-amber-200 px-7 text-sm font-black text-black shadow-[0_12px_30px_rgba(251,191,36,0.2)] disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/30 disabled:shadow-none"
              type="button"
              disabled={!canStartGame || isSubmitting}
              onClick={() => dealer && onConfirm(players, dealer)}
            >
              {isSubmitting ? "서버에 저장 중..." : "멤버와 딜러 확정 후 시작"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
