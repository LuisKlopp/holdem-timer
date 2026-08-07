"use client";

import { Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { getPodiumApiErrorMessage } from "@/api";
import { BlindInfo, ControlPanel, LevelInfo, TimerDisplay } from "@/components";
import { useBlindTimer, usePodiumStats } from "@/hooks";

type GameMembers = {
  round: string;
  members: string[];
  savedAt: string;
};

const GAME_MEMBERS_STORAGE_KEY = "elio-holdem-game-members";
const DEFAULT_MEMBER_INPUT_COUNT = 6;

const createMemberInputs = (members: string[] = []) => {
  const size = Math.max(DEFAULT_MEMBER_INPUT_COUNT, members.length || 0);

  return Array.from({ length: size }, (_, index) => members[index] ?? "");
};

export default function Home() {
  const podiumStatsQuery = usePodiumStats();
  const podiumStats = podiumStatsQuery.data;
  const [gameMembers, setGameMembers] = useState<GameMembers | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [draftRound, setDraftRound] = useState("");
  const [draftMembers, setDraftMembers] = useState<string[]>(
    createMemberInputs()
  );

  const {
    animationKey,
    currentLevel,
    formattedTime,
    goToNextLevel,
    goToPreviousLevel,
    isRunning,
    levelDurationMinutes,
    pause,
    reset,
    soundEnabled,
    start,
    toggleSound,
  } = useBlindTimer();

  useEffect(() => {
    try {
      const savedGameMembers = window.localStorage.getItem(
        GAME_MEMBERS_STORAGE_KEY
      );

      if (!savedGameMembers) {
        return;
      }

      const parsedGameMembers = JSON.parse(savedGameMembers) as GameMembers;

      if (
        typeof parsedGameMembers.round === "string" &&
        Array.isArray(parsedGameMembers.members)
      ) {
        setGameMembers(parsedGameMembers);
      }
    } catch {
      window.localStorage.removeItem(GAME_MEMBERS_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!isMemberModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMemberModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMemberModalOpen]);

  const openMemberModal = () => {
    setDraftRound(gameMembers?.round ?? "");
    setDraftMembers(createMemberInputs(gameMembers?.members ?? []));
    setIsMemberModalOpen(true);
  };

  const handleMemberChange = (index: number, value: string) => {
    setDraftMembers((members) =>
      members.map((member, memberIndex) =>
        memberIndex === index ? value : member
      )
    );
  };

  const handleAddMemberInput = () => {
    setDraftMembers((members) => [...members, ""]);
  };

  const handleRemoveMemberInput = (index: number) => {
    setDraftMembers((members) =>
      members.length <= 1
        ? [""]
        : members.filter((_, memberIndex) => memberIndex !== index)
    );
  };

  const handleSaveMembers = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextGameMembers = {
      round: draftRound.trim(),
      members: draftMembers
        .map((member) => member.trim())
        .filter((member) => member.length > 0),
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      GAME_MEMBERS_STORAGE_KEY,
      JSON.stringify(nextGameMembers)
    );
    setGameMembers(nextGameMembers);
    setIsMemberModalOpen(false);
  };

  const handleClearMembers = () => {
    window.localStorage.removeItem(GAME_MEMBERS_STORAGE_KEY);
    setGameMembers(null);
    setDraftRound("");
    setDraftMembers(createMemberInputs());
  };

  const handleDeleteSavedMember = (index: number) => {
    if (!gameMembers) {
      return;
    }

    const nextGameMembers = {
      ...gameMembers,
      members: gameMembers.members.filter(
        (_, memberIndex) => memberIndex !== index
      ),
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      GAME_MEMBERS_STORAGE_KEY,
      JSON.stringify(nextGameMembers)
    );
    setGameMembers(nextGameMembers);
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#050816] px-3 text-white sm:px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="mdl:gap-8 mdl:pt-7 relative mx-auto flex max-w-7xl flex-col gap-6 pt-6 pb-6 lg:gap-12 lg:pt-10 lg:pb-10">
        <header className="flex flex-col gap-3.5">
          <p className="text-center text-4xl font-semibold tracking-[0.08em] text-amber-200/65 uppercase sm:text-4xl lg:text-left">
            엘리오 홀덤 타이머
          </p>

          <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
            <Link
              className="btn-press-in inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              href="/podium"
            >
              우승 기록 입력
            </Link>
            <button
              className="btn-press-in inline-flex items-center justify-center rounded-full border border-amber-200/25 bg-amber-200/12 px-4 py-1.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/18"
              type="button"
              onClick={openMemberModal}
            >
              게임 멤버 입력
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-7 mdl:gap-9 lg:gap-14">
          <section className="mdl:grid-cols-[minmax(0,1.5fr)_minmax(27rem,1.55fr)] grid gap-3.5 lg:grid-cols-[minmax(0,2.18fr)_minmax(0,1.44fr)]">
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <TimerDisplay
                animationKey={animationKey}
                formattedTime={formattedTime}
                isBreak={currentLevel.isBreak}
                isRunning={isRunning}
              />

              <LevelInfo
                animationKey={animationKey}
                currentLevel={currentLevel}
                levelDurationMinutes={levelDurationMinutes}
              />
            </div>

            <div className="grid min-w-0 gap-2.5 sm:grid-cols-2">
              <div className="min-w-0">
                <div className="mdl:min-h-[9.2rem] flex min-h-[10rem] flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 px-4 py-2.5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <p className="text-lg font-semibold whitespace-nowrap text-white/78 sm:text-xl">
                    시즌1 최근 우승자
                  </p>
                  <p className="mt-1.5 text-xl leading-tight font-semibold break-words text-white">
                    {podiumStatsQuery.isPending
                      ? "불러오는 중"
                      : (podiumStats?.recentWinner ?? "기록 없음")}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <div className="mdl:min-h-[9.2rem] relative flex min-h-[10rem] flex-col items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/6 px-4 py-2.5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-6xl leading-none drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] mdl:block"
                  >
                    👑
                  </span>
                  <p className="text-lg font-semibold whitespace-nowrap text-amber-200 sm:text-xl">
                    <span className="mdl:hidden">시즌1 최다 우승자 👑</span>
                    <span className="hidden mdl:inline">시즌1 최다 우승자</span>
                  </p>
                  <p className="mt-1.5 text-xl leading-tight font-semibold break-words text-white">
                    {podiumStatsQuery.isPending
                      ? "불러오는 중"
                      : (podiumStats?.topWinner ?? "기록 없음")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {podiumStatsQuery.isError ? (
            <p className="mt-3 text-center text-xs text-rose-200 lg:text-right">
              {getPodiumApiErrorMessage(
                podiumStatsQuery.error,
                "우승 통계를 불러오지 못했습니다."
              )}
            </p>
          ) : null}

          <div className="grid items-stretch gap-3.5 lg:grid-cols-2">
            <BlindInfo
              animationKey={animationKey}
              currentLevel={currentLevel}
            />

            <section className="h-full w-full">
              <div className="mdl:py-2.5 flex h-full min-h-32 flex-col justify-center rounded-[1.5rem] border border-white/8 bg-black/18 px-3 py-3 text-center backdrop-blur-sm lg:min-h-60">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                  <p className="text-sm font-semibold tracking-[0.18em] text-white/45 uppercase sm:text-base">
                    Members
                  </p>
                  {gameMembers?.round ? (
                    <p className="rounded-full border border-amber-200/20 bg-amber-200/10 px-2.5 py-0.5 text-xs font-semibold text-amber-100">
                      시즌1 - {gameMembers.round}회차
                    </p>
                  ) : null}
                </div>

                {gameMembers && gameMembers.members.length > 0 ? (
                  <div className="mdl:max-lg:gap-2 mt-3 grid grid-cols-5 gap-1.5">
                    {gameMembers.members.map((member, index) => (
                      <div
                        className="mdl:max-lg:px-1 relative min-h-10 rounded-lg border border-white/8 bg-white/6 px-2.5 py-2 pr-7 text-sm font-semibold break-words text-white sm:text-base"
                        key={`${member}-${index}`}
                      >
                        {member}
                        <button
                          className="btn-press-in absolute -top-1 -right-1 size-5 rounded-full bg-red-500 shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition hover:bg-red-400 focus:ring-2 focus:ring-red-200/60 focus:outline-none"
                          type="button"
                          aria-label={`${member} 닉네임 삭제`}
                          onClick={() => handleDeleteSavedMember(index)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-base font-semibold text-white/55">
                    이번 회차 멤버를 입력해주세요.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        <div>
          <ControlPanel
            isRunning={isRunning}
            onNext={goToNextLevel}
            onPause={pause}
            onPrevious={goToPreviousLevel}
            onReset={reset}
            onStart={start}
            onToggleSound={toggleSound}
            soundEnabled={soundEnabled}
          />
        </div>
      </div>

      {isMemberModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-modal-title"
          onMouseDown={() => setIsMemberModalOpen(false)}
        >
          <form
            className="w-full max-w-2xl rounded-[1.5rem] border border-white/12 bg-[#0b0d18] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            onSubmit={handleSaveMembers}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className="text-2xl font-bold text-amber-100"
                  id="member-modal-title"
                >
                  게임 멤버 입력
                </p>
                <p className="mt-1 text-sm font-medium text-white/55">
                  오늘 회차와 이번 게임 멤버 닉네임을 저장합니다.
                </p>
              </div>

              <button
                className="btn-press-in flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/75 transition hover:bg-white/12"
                type="button"
                aria-label="모달 닫기"
                onClick={() => setIsMemberModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold tracking-[0.12em] text-white/45 uppercase">
                Game Round
              </span>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
                <input
                  className="min-w-0 flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-white/25"
                  min="1"
                  inputMode="numeric"
                  placeholder="예: 12"
                  type="number"
                  value={draftRound}
                  onChange={(event) => setDraftRound(event.target.value)}
                />
                <span className="text-lg font-semibold text-white/55">회차</span>
              </div>
            </label>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-[0.12em] text-white/45 uppercase">
                  Nicknames
                </p>
                <button
                  className="btn-press-in inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/16"
                  type="button"
                  onClick={handleAddMemberInput}
                >
                  <Plus size={16} />
                  추가
                </button>
              </div>

              <div className="mt-2 grid max-h-[42svh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {draftMembers.map((member, index) => (
                  <label
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2"
                    key={index}
                  >
                    <span className="w-7 shrink-0 text-center text-sm font-bold text-amber-100/80">
                      {index + 1}
                    </span>
                    <input
                      className="min-w-0 flex-1 bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/25"
                      placeholder="닉네임"
                      type="text"
                      value={member}
                      onChange={(event) =>
                        handleMemberChange(index, event.target.value)
                      }
                    />
                    <button
                      className="btn-press-in flex size-8 shrink-0 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-rose-100"
                      type="button"
                      aria-label={`${index + 1}번 멤버 입력칸 삭제`}
                      onClick={() => handleRemoveMemberInput(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
              <button
                className="btn-press-in inline-flex items-center justify-center rounded-full border border-rose-300/25 bg-rose-300/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/16"
                type="button"
                onClick={handleClearMembers}
              >
                로컬스토리지 초기화
              </button>

              <div className="flex gap-2">
                <button
                  className="btn-press-in inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white/72 transition hover:bg-white/12"
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className="btn-press-in inline-flex items-center justify-center rounded-full bg-amber-200 px-5 py-2 text-sm font-bold text-black transition hover:bg-amber-100"
                  type="submit"
                >
                  저장
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
