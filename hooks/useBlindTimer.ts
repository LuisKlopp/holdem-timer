"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { blindLevels } from "@/lib/blindLevels";

const TICK_INTERVAL_MS = 250;
const ALERT_VOLUME_GAIN = 1.4;

type TimerState = {
  currentLevelIndex: number;
  remainingTime: number;
  isRunning: boolean;
  endTime: number | null;
  runStartedAt: number | null;
  elapsedBeforeRun: number;
  levelDurationSeconds: number;
  soundEnabled: boolean;
  animationKey: number;
  isHydrated: boolean;
};

const clampLevelIndex = (levelIndex: number) =>
  Math.min(Math.max(levelIndex, 0), blindLevels.length - 1);

const getLevelDurationMs = (
  levelIndex: number,
  levelDurationSeconds: number,
) => {
  const level = blindLevels[clampLevelIndex(levelIndex)];

  return (level.isBreak ? level.duration : levelDurationSeconds) * 1000;
};

const formatTime = (timeMs: number) => {
  const totalSeconds = Math.max(0, Math.ceil(timeMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const formatElapsedTime = (timeMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(timeMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const createInitialState = (): TimerState => ({
  currentLevelIndex: 0,
  remainingTime: getLevelDurationMs(0, 480),
  isRunning: false,
  endTime: null,
  runStartedAt: null,
  elapsedBeforeRun: 0,
  levelDurationSeconds: 480,
  soundEnabled: true,
  animationKey: 0,
  isHydrated: true,
});

const resolveRunningState = (
  currentLevelIndex: number,
  endTime: number,
  levelDurationSeconds: number,
  now: number,
) => {
  let nextLevelIndex = clampLevelIndex(currentLevelIndex);
  let nextEndTime = endTime;
  let didAdvance = false;

  while (nextLevelIndex < blindLevels.length - 1 && now >= nextEndTime) {
    nextLevelIndex += 1;
    nextEndTime += getLevelDurationMs(nextLevelIndex, levelDurationSeconds);
    didAdvance = true;
  }

  if (now >= nextEndTime) {
    return {
      currentLevelIndex: nextLevelIndex,
      remainingTime: 0,
      isRunning: false,
      endTime: null,
      didAdvance,
    };
  }

  return {
    currentLevelIndex: nextLevelIndex,
    remainingTime: Math.max(0, nextEndTime - now),
    isRunning: true,
    endTime: nextEndTime,
    didAdvance,
  };
};

export const useBlindTimer = () => {
  const [state, setState] = useState<TimerState>(createInitialState);
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousLevelIndexRef = useRef<number | null>(null);

  const prepareAudio = useEffectEvent(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  });

  const playAlertSound = useEffectEvent(async () => {
    if (!state.soundEnabled) {
      return;
    }

    try {
      await prepareAudio();
    } catch {
      return;
    }

    const audioContext = audioContextRef.current;

    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime;
    const masterGain = audioContext.createGain();
    const compressor = audioContext.createDynamicsCompressor();

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(
      0.34 * ALERT_VOLUME_GAIN,
      now + 0.01,
    );
    masterGain.gain.exponentialRampToValueAtTime(
      0.2 * ALERT_VOLUME_GAIN,
      now + 0.2,
    );
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);

    compressor.threshold.setValueAtTime(-18, now);
    compressor.knee.setValueAtTime(16, now);
    compressor.ratio.setValueAtTime(3, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.2, now);

    masterGain.connect(compressor);
    compressor.connect(audioContext.destination);

    const createRingTone = (
      startAt: number,
      leadFrequency: number,
      ringFrequency: number,
      duration: number,
    ) => {
      const leadOscillator = audioContext.createOscillator();
      const ringOscillator = audioContext.createOscillator();
      const shimmerOscillator = audioContext.createOscillator();
      const noteGain = audioContext.createGain();

      leadOscillator.type = "triangle";
      leadOscillator.frequency.setValueAtTime(leadFrequency, startAt);
      leadOscillator.frequency.exponentialRampToValueAtTime(
        leadFrequency * 0.995,
        startAt + duration * 0.35,
      );

      ringOscillator.type = "sine";
      ringOscillator.frequency.setValueAtTime(ringFrequency, startAt + 0.06);
      ringOscillator.frequency.exponentialRampToValueAtTime(
        ringFrequency * 0.992,
        startAt + duration,
      );

      shimmerOscillator.type = "triangle";
      shimmerOscillator.frequency.setValueAtTime(ringFrequency * 2, startAt + 0.06);
      shimmerOscillator.detune.setValueAtTime(6, startAt + 0.06);

      noteGain.gain.setValueAtTime(0.0001, startAt);
      noteGain.gain.linearRampToValueAtTime(0.82, startAt + 0.012);
      noteGain.gain.exponentialRampToValueAtTime(0.34, startAt + 0.09);
      noteGain.gain.exponentialRampToValueAtTime(0.18, startAt + duration * 0.5);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      leadOscillator.connect(noteGain);
      ringOscillator.connect(noteGain);
      shimmerOscillator.connect(noteGain);
      noteGain.connect(masterGain);

      leadOscillator.start(startAt);
      ringOscillator.start(startAt + 0.06);
      shimmerOscillator.start(startAt + 0.06);
      leadOscillator.stop(startAt + duration * 0.4);
      ringOscillator.stop(startAt + duration);
      shimmerOscillator.stop(startAt + duration * 0.92);
    };

    createRingTone(now, 1396.91, 1760, 0.34);
    createRingTone(now + 0.34, 1318.51, 1661.22, 0.38);
    createRingTone(now + 0.82, 1396.91, 1760, 0.34);
    createRingTone(now + 1.16, 1318.51, 1661.22, 0.44);
  });

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }

    const tick = () => {
      const now = Date.now();

      setState((previousState) => {
        if (!previousState.isRunning || previousState.endTime === null) {
          return previousState;
        }

        const resolvedState = resolveRunningState(
          previousState.currentLevelIndex,
          previousState.endTime,
          previousState.levelDurationSeconds,
          now,
        );

        const nextAnimationKey = resolvedState.didAdvance
          ? previousState.animationKey + 1
          : previousState.animationKey;

        if (
          previousState.currentLevelIndex === resolvedState.currentLevelIndex &&
          previousState.remainingTime === resolvedState.remainingTime &&
          previousState.isRunning === resolvedState.isRunning &&
          previousState.endTime === resolvedState.endTime
        ) {
          return previousState;
        }

        return {
          ...previousState,
          ...resolvedState,
          runStartedAt:
            previousState.isRunning && !resolvedState.isRunning
              ? null
              : previousState.runStartedAt,
          elapsedBeforeRun:
            previousState.isRunning &&
            !resolvedState.isRunning &&
            previousState.runStartedAt !== null
              ? previousState.elapsedBeforeRun +
                (now - previousState.runStartedAt)
              : previousState.elapsedBeforeRun,
          animationKey: nextAnimationKey,
        };
      });
    };

    tick();

    const intervalId = window.setInterval(tick, TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [state.isRunning]);

  useEffect(() => {
    const syncWithClock = () => {
      setState((previousState) => {
        if (!previousState.isRunning || previousState.endTime === null) {
          return previousState;
        }

        const resolvedState = resolveRunningState(
          previousState.currentLevelIndex,
          previousState.endTime,
          previousState.levelDurationSeconds,
          Date.now(),
        );

        return {
          ...previousState,
          ...resolvedState,
          animationKey: resolvedState.didAdvance
            ? previousState.animationKey + 1
            : previousState.animationKey,
        };
      });
    };

    document.addEventListener("visibilitychange", syncWithClock);
    window.addEventListener("focus", syncWithClock);

    return () => {
      document.removeEventListener("visibilitychange", syncWithClock);
      window.removeEventListener("focus", syncWithClock);
    };
  }, []);

  useEffect(() => {
    const previousLevelIndex = previousLevelIndexRef.current;

    if (
      previousLevelIndex !== null &&
      previousLevelIndex !== state.currentLevelIndex
    ) {
      void playAlertSound();
    }

    previousLevelIndexRef.current = state.currentLevelIndex;
  }, [playAlertSound, state.currentLevelIndex]);

  const moveToLevel = useEffectEvent((targetLevelIndex: number) => {
    const now = Date.now();

    setState((previousState) => {
      const nextLevelIndex = clampLevelIndex(targetLevelIndex);
      const nextDuration = getLevelDurationMs(
        nextLevelIndex,
        previousState.levelDurationSeconds,
      );

      if (previousState.currentLevelIndex === nextLevelIndex) {
        return {
          ...previousState,
          remainingTime: nextDuration,
          endTime: previousState.isRunning ? now + nextDuration : null,
        };
      }

      return {
        ...previousState,
        currentLevelIndex: nextLevelIndex,
        remainingTime: nextDuration,
        isRunning: previousState.isRunning,
        endTime: previousState.isRunning ? now + nextDuration : null,
        animationKey: previousState.animationKey + 1,
      };
    });
  });

  const jumpTo = useEffectEvent((levelNumber: number, remainingSeconds: number) => {
    const safeLevelNumber = Number.isFinite(levelNumber)
      ? Math.floor(levelNumber)
      : 1;
    const safeSeconds = Number.isFinite(remainingSeconds)
      ? Math.max(0, Math.floor(remainingSeconds))
      : 0;
    const nextLevelIndex = clampLevelIndex(safeLevelNumber - 1);
    const nextRemainingTime = safeSeconds * 1000;
    const now = Date.now();

    setState((previousState) => ({
      ...previousState,
      currentLevelIndex: nextLevelIndex,
      remainingTime: nextRemainingTime,
      endTime: previousState.isRunning ? now + nextRemainingTime : null,
      animationKey: previousState.animationKey + 1,
    }));
  });

  const setLevelDuration = useEffectEvent((minutes: number) => {
    const safeMinutes = Number.isFinite(minutes) ? Math.max(1, Math.floor(minutes)) : 8;
    const nextLevelDurationSeconds = safeMinutes * 60;
    const now = Date.now();

    setState((previousState) => {
      if (previousState.levelDurationSeconds === nextLevelDurationSeconds) {
        return previousState;
      }

      const currentLevel = blindLevels[previousState.currentLevelIndex];

      if (currentLevel.isBreak) {
        return {
          ...previousState,
          levelDurationSeconds: nextLevelDurationSeconds,
        };
      }

      const previousDuration = getLevelDurationMs(
        previousState.currentLevelIndex,
        previousState.levelDurationSeconds,
      );
      const nextDuration = getLevelDurationMs(
        previousState.currentLevelIndex,
        nextLevelDurationSeconds,
      );
      const elapsedTime = Math.min(
        Math.max(previousDuration - previousState.remainingTime, 0),
        previousDuration,
      );
      const nextRemainingTime = Math.max(0, nextDuration - elapsedTime);

      return {
        ...previousState,
        levelDurationSeconds: nextLevelDurationSeconds,
        remainingTime: nextRemainingTime,
        endTime: previousState.isRunning ? now + nextRemainingTime : null,
      };
    });
  });

  const start = useEffectEvent(async () => {
    await prepareAudio().catch(() => undefined);

    setState((previousState) => {
      if (previousState.isRunning) {
        return previousState;
      }

      const nextRemainingTime =
        previousState.remainingTime > 0
          ? previousState.remainingTime
          : getLevelDurationMs(
              previousState.currentLevelIndex,
              previousState.levelDurationSeconds,
            );

      return {
        ...previousState,
        remainingTime: nextRemainingTime,
        isRunning: true,
        endTime: Date.now() + nextRemainingTime,
        runStartedAt: Date.now(),
      };
    });
  });

  const pause = useEffectEvent(() => {
    setState((previousState) => {
      if (!previousState.isRunning || previousState.endTime === null) {
        return previousState;
      }

      return {
        ...previousState,
        remainingTime: Math.max(0, previousState.endTime - Date.now()),
        isRunning: false,
        endTime: null,
        runStartedAt: null,
        elapsedBeforeRun:
          previousState.runStartedAt === null
            ? previousState.elapsedBeforeRun
            : previousState.elapsedBeforeRun +
              (Date.now() - previousState.runStartedAt),
      };
    });
  });

  const reset = useEffectEvent(() => {
    setState((previousState) => ({
      ...createInitialState(),
      soundEnabled: previousState.soundEnabled,
      animationKey: previousState.animationKey + 1,
    }));
  });

  const toggleSound = useEffectEvent(async () => {
    await prepareAudio().catch(() => undefined);

    setState((previousState) => ({
      ...previousState,
      soundEnabled: !previousState.soundEnabled,
    }));
  });

  const currentLevel = blindLevels[state.currentLevelIndex];
  const nextLevels = blindLevels.slice(
    state.currentLevelIndex + 1,
    state.currentLevelIndex + 3,
  );
  const totalElapsedMs =
    state.elapsedBeforeRun +
    (state.isRunning && state.runStartedAt !== null
      ? Date.now() - state.runStartedAt
      : 0);

  return {
    blindLevels,
    currentLevel,
    currentLevelIndex: state.currentLevelIndex,
    currentLevelNumber: currentLevel.level,
    endTime: state.endTime,
    formattedTime: formatTime(state.remainingTime),
    isHydrated: state.isHydrated,
    isRunning: state.isRunning,
    levelDurationMinutes: Math.floor(state.levelDurationSeconds / 60),
    levelDurationSeconds: state.levelDurationSeconds,
    nextLevels,
    remainingTime: state.remainingTime,
    totalElapsedTime: formatElapsedTime(totalElapsedMs),
    soundEnabled: state.soundEnabled,
    animationKey: state.animationKey,
    totalLevels: blindLevels.length,
    goToNextLevel: () => moveToLevel(state.currentLevelIndex + 1),
    goToPreviousLevel: () => moveToLevel(state.currentLevelIndex - 1),
    jumpTo,
    pause,
    reset,
    setLevelDuration,
    start,
    toggleSound,
  };
};
