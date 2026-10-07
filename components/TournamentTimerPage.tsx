"use client";

import { History, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

import {
  getGameApiErrorMessage,
  getPodiumApiErrorMessage,
  getTournamentGameDealer,
  getTournamentGamePlayers,
  type HoldemMember,
  type TournamentGameType,
  type WinnerCelebration,
} from "@/api";
import { CURRENT_SEASON } from "@/constants";
import {
  useActiveTournamentGame,
  useBlindTimer,
  useCreateTournamentGame,
  useCreateWinnerCelebration,
  useEndTournamentGame,
  useHoldemMembers,
  usePodiumStats,
  useWinnerCelebrationStream,
} from "@/hooks";
import type { BlindLevel } from "@/lib";
import type { TournamentGameStore } from "@/store";

import BlindInfo from "./BlindInfo";
import ControlPanel from "./ControlPanel";
import CurrentGamePanel from "./CurrentGamePanel";
import GameEndConfirmModal from "./GameEndConfirmModal";
import GameSetupModal from "./GameSetupModal";
import LevelInfo from "./LevelInfo";
import TimerDisplay from "./TimerDisplay";
import WinnerCelebrationModal from "./WinnerCelebrationModal";
import WinnerCelebrationOverlay from "./WinnerCelebrationOverlay";

type TournamentTimerPageProps = {
  blindMessage?: string;
  blindLevels?: BlindLevel[];
  gameHistoryHref: string;
  gameType: TournamentGameType;
  rebuyManagementHref: string;
  seasonId: number;
  title: string;
  useGameStore: TournamentGameStore;
  podiumSeason?: {
    id: number;
    label: string;
  };
};

export function TournamentTimerPage({
  blindMessage,
  blindLevels,
  gameHistoryHref,
  gameType,
  podiumSeason,
  rebuyManagementHref,
  seasonId,
  title,
  useGameStore,
}: TournamentTimerPageProps) {
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [isGameSetupOpen, setIsGameSetupOpen] = useState(false);
  const [isWinnerCelebrationOpen, setIsWinnerCelebrationOpen] = useState(false);
  const [celebrationWinner, setCelebrationWinner] =
    useState<WinnerCelebration | null>(null);
  const lastCelebrationIdRef = useRef<string | null>(null);
  const gameScope = useMemo(
    () => ({ gameType, seasonId }),
    [gameType, seasonId]
  );
  const hasPodiumStats = Boolean(podiumSeason);
  const podiumStatsQuery = usePodiumStats(
    podiumSeason?.id ?? CURRENT_SEASON.id,
    hasPodiumStats
  );
  const podiumStats = podiumStatsQuery.data;
  useHoldemMembers();
  const activeGameQuery = useActiveTournamentGame(gameScope);
  const createGameMutation = useCreateTournamentGame(gameScope);
  const endGameMutation = useEndTournamentGame(gameScope);
  const winnerCelebrationMutation = useCreateWinnerCelebration();
  const clearGame = useGameStore((state) => state.clearGame);
  const setGameParticipants = useGameStore(
    (state) => state.setGameParticipants
  );
  const currentGame = activeGameQuery.data ?? null;

  const showWinnerCelebration = (celebration: WinnerCelebration) => {
    if (
      celebration.gameType !== gameType ||
      celebration.seasonId !== seasonId ||
      lastCelebrationIdRef.current === celebration.id
    ) {
      return;
    }

    lastCelebrationIdRef.current = celebration.id;
    setCelebrationWinner(celebration);
  };

  useWinnerCelebrationStream(gameScope, showWinnerCelebration);

  const {
    alertVolume,
    animationKey,
    currentLevel,
    formattedTime,
    goToNextLevel,
    goToPreviousLevel,
    isRunning,
    levelDurationMinutes,
    pause,
    reset,
    resumeFromStartedAt,
    setAlertVolume,
    soundEnabled,
    start,
    toggleSound,
  } = useBlindTimer(blindLevels);

  const syncActiveGame = useEffectEvent(() => {
    if (!currentGame) {
      clearGame();
      reset();
      return;
    }

    const players = getTournamentGamePlayers(currentGame);
    const dealer = getTournamentGameDealer(currentGame);

    if (dealer) {
      setGameParticipants(
        players.map((player) => ({
          nickname: player.nicknameSnapshot,
        }))
      );
    }

    resumeFromStartedAt(currentGame.startedAt);
  });

  useEffect(() => {
    if (!activeGameQuery.isSuccess) {
      return;
    }

    syncActiveGame();
  }, [
    activeGameQuery.isSuccess,
    currentGame?.id,
    currentGame?.startedAt,
    currentGame?.updatedAt,
  ]);

  const handleStart = () => {
    if (activeGameQuery.isPending || activeGameQuery.isError) {
      return;
    }

    if (!currentGame) {
      createGameMutation.reset();
      setIsGameSetupOpen(true);
      return;
    }

    void start();
  };

  const handleGameSetupConfirm = (
    players: HoldemMember[],
    dealer: HoldemMember
  ) => {
    createGameMutation.mutate(
      {
        ...gameScope,
        dealerId: dealer.id,
        playerIds: players.map((player) => player.id),
      },
      {
        onSuccess: () => {
          setIsGameSetupOpen(false);
        },
      }
    );
  };

  const handleGameEndConfirm = () => {
    if (!currentGame) {
      return;
    }

    endGameMutation.mutate(currentGame.id, {
      onSuccess: () => {
        clearGame();
        reset();
        setIsEndConfirmOpen(false);
      },
    });
  };

  return (
    <main className="relative min-h-svh overflow-x-hidden bg-[#050816] px-2.5 text-white sm:px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-136 w-136 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-96 w-[24rem] rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-[20%] -right-20 h-80 w-[20rem] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="mdl:gap-8 mdl:pt-7 relative mx-auto flex max-w-7xl flex-col gap-4 pt-4 pb-4 sm:gap-6 sm:pt-6 sm:pb-6 lg:gap-12 lg:pt-10 lg:pb-10">
        <header className="flex flex-col gap-2.5 sm:gap-3.5">
          <p className="mdl:text-left text-center text-[clamp(1.35rem,6.6vw,1.85rem)] leading-[1.15] font-semibold tracking-[0.04em] text-amber-200/65 uppercase sm:text-4xl sm:tracking-[0.08em]">
            {title}
          </p>

          <div className="mdl:justify-start flex flex-wrap justify-center gap-2">
            <Link
              className="btn-press-in inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/85 transition hover:bg-white/10 sm:px-4 sm:text-sm"
              href="/"
            >
              타이머 선택
            </Link>
            {podiumSeason ? (
              <Link
                className="btn-press-in mdl:inline-flex hidden items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                href="/podium"
              >
                {podiumSeason.label} 기록 입력
              </Link>
            ) : null}
            <Link
              className="btn-press-in mdl:hidden inline-flex items-center justify-center rounded-full border border-sky-200/25 bg-sky-200/10 px-3 py-1.5 text-xs font-semibold text-sky-100 transition hover:bg-sky-200/16 sm:px-4 sm:text-sm"
              href={rebuyManagementHref}
            >
              리바인 관리
            </Link>
            <button
              className="btn-press-in mdl:hidden inline-flex items-center justify-center gap-1 rounded-full border border-amber-200/35 bg-amber-200/14 px-3 py-1.5 text-xs font-bold text-amber-100 transition hover:bg-amber-200/20 sm:gap-1.5 sm:px-4 sm:text-sm"
              type="button"
              onClick={() => {
                winnerCelebrationMutation.reset();
                setIsWinnerCelebrationOpen(true);
              }}
            >
              <Trophy size={15} />
              우승 축하
            </button>
            <Link
              className="btn-press-in mdl:inline-flex hidden items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/6 px-4 py-1.5 text-sm font-semibold text-white/85 transition hover:bg-white/10"
              href={gameHistoryHref}
            >
              <History size={15} />
              게임 기록
            </Link>
          </div>
        </header>

        {currentGame ? <CurrentGamePanel game={currentGame} /> : null}

        {activeGameQuery.isError ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-300/20 bg-rose-300/10 px-4 py-3">
            <p className="text-sm font-semibold text-rose-100">
              {getGameApiErrorMessage(
                activeGameQuery.error,
                "진행 중인 게임을 확인하지 못했습니다."
              )}
            </p>
            <button
              className="btn-press-in min-h-9 rounded-full border border-rose-200/20 px-4 text-xs font-bold text-rose-100"
              type="button"
              onClick={() => void activeGameQuery.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : null}

        <div className="mdl:gap-9 flex flex-col gap-4 sm:gap-7 lg:gap-14">
          <section
            className={
              hasPodiumStats
                ? "mdl:grid-cols-[minmax(0,1.5fr)_minmax(27rem,1.55fr)] grid gap-2.5 sm:gap-3.5 lg:grid-cols-[minmax(0,2.18fr)_minmax(0,1.44fr)]"
                : "grid gap-2.5 sm:gap-3.5"
            }
          >
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

            {podiumSeason ? (
              <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-2.5">
                <div className="min-w-0">
                  <div className="mdl:min-h-[9.2rem] flex min-h-[7.25rem] flex-col items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/6 px-2.5 py-2 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:min-h-[8.5rem] sm:rounded-[1.75rem] sm:px-4 sm:py-2.5">
                    <p className="text-sm leading-snug font-semibold break-keep text-white/78 sm:text-xl">
                      {podiumSeason.label} 최근 우승자
                    </p>
                    <p className="mt-1 text-lg leading-tight font-semibold break-words text-white sm:mt-1.5 sm:text-xl">
                      {podiumStatsQuery.isPending
                        ? "불러오는 중"
                        : (podiumStats?.recentWinner ?? "기록 없음")}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="mdl:min-h-[9.2rem] relative flex min-h-[7.25rem] flex-col items-center justify-center rounded-[1.25rem] border border-white/10 bg-white/6 px-2.5 py-2 text-center shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:min-h-[8.5rem] sm:rounded-[1.75rem] sm:px-4 sm:py-2.5">
                    <Image
                      aria-hidden="true"
                      className="mdl:block pointer-events-none absolute top-0 left-1/2 z-10 hidden h-18 w-auto -translate-x-1/2 -translate-y-1/2"
                      src="/ranking/crown-gold-hd.png"
                      alt=""
                      width={96}
                      height={87}
                    />
                    <p className="text-sm leading-snug font-semibold break-keep text-amber-200 sm:text-xl">
                      <span className="mdl:hidden inline-flex items-center justify-center gap-1">
                        {podiumSeason.label} 최다 우승자
                        <Image
                          aria-hidden="true"
                          className="h-5 w-auto shrink-0 sm:h-6"
                          src="/ranking/crown-gold-hd.png"
                          alt=""
                          width={96}
                          height={87}
                        />
                      </span>
                      <span className="mdl:inline hidden">
                        {podiumSeason.label} 최다 우승자
                      </span>
                    </p>
                    <p className="mt-1 text-lg leading-tight font-semibold break-words text-white sm:mt-1.5 sm:text-xl">
                      {podiumStatsQuery.isPending
                        ? "불러오는 중"
                        : (podiumStats?.topWinner ?? "기록 없음")}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {podiumSeason && podiumStatsQuery.isError ? (
            <p className="mt-3 text-center text-xs text-rose-200 lg:text-right">
              {getPodiumApiErrorMessage(
                podiumStatsQuery.error,
                "우승 통계를 불러오지 못했습니다."
              )}
            </p>
          ) : null}

          <BlindInfo
            animationKey={animationKey}
            currentLevel={currentLevel}
            message={blindMessage}
          />
        </div>

        <div>
          <ControlPanel
            alertVolume={alertVolume}
            canEndGame={currentGame !== null}
            isGameLoading={activeGameQuery.isPending}
            isRunning={isRunning}
            onAlertVolumeChange={setAlertVolume}
            onEndGame={() => setIsEndConfirmOpen(true)}
            onNext={goToNextLevel}
            onPause={pause}
            onPrevious={goToPreviousLevel}
            onReset={reset}
            onStart={handleStart}
            onToggleSound={toggleSound}
            soundEnabled={soundEnabled}
          />
        </div>
      </div>

      {isGameSetupOpen ? (
        <GameSetupModal
          errorMessage={
            createGameMutation.isError
              ? getGameApiErrorMessage(
                  createGameMutation.error,
                  "게임을 시작하지 못했습니다."
                )
              : undefined
          }
          isSubmitting={createGameMutation.isPending}
          onCancel={() => {
            if (!createGameMutation.isPending) {
              setIsGameSetupOpen(false);
            }
          }}
          onConfirm={handleGameSetupConfirm}
        />
      ) : null}

      {isEndConfirmOpen && currentGame ? (
        <GameEndConfirmModal
          errorMessage={
            endGameMutation.isError
              ? getGameApiErrorMessage(
                  endGameMutation.error,
                  "게임을 종료하지 못했습니다."
                )
              : undefined
          }
          game={currentGame}
          isSubmitting={endGameMutation.isPending}
          onCancel={() => {
            if (!endGameMutation.isPending) {
              setIsEndConfirmOpen(false);
            }
          }}
          onConfirm={handleGameEndConfirm}
        />
      ) : null}

      {isWinnerCelebrationOpen ? (
        <WinnerCelebrationModal
          errorMessage={
            winnerCelebrationMutation.isError
              ? getPodiumApiErrorMessage(
                  winnerCelebrationMutation.error,
                  "우승 축하를 전송하지 못했습니다."
                )
              : undefined
          }
          isSubmitting={winnerCelebrationMutation.isPending}
          onCancel={() => {
            if (!winnerCelebrationMutation.isPending) {
              setIsWinnerCelebrationOpen(false);
            }
          }}
          onConfirm={(winner) => {
            winnerCelebrationMutation.mutate(
              {
                ...gameScope,
                memberId: winner.id,
              },
              {
                onSuccess: (celebration) => {
                  showWinnerCelebration(celebration);
                  setIsWinnerCelebrationOpen(false);
                },
              }
            );
          }}
        />
      ) : null}

      {celebrationWinner ? (
        <WinnerCelebrationOverlay
          gender={celebrationWinner.gender}
          key={celebrationWinner.id}
          nickname={celebrationWinner.nicknameSnapshot}
          onClose={() => setCelebrationWinner(null)}
          soundEnabled={soundEnabled}
        />
      ) : null}
    </main>
  );
}
