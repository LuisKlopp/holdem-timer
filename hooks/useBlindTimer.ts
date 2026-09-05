"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { type BlindLevel, blindLevels } from "@/lib/blindLevels";

const TICK_INTERVAL_MS = 250;
const ALERT_VOLUME_GAIN = 4.5;
const DEFAULT_ALERT_VOLUME = 80;

type TimerState = {
  currentLevelIndex: number;
  remainingTime: number;
  isRunning: boolean;
  endTime: number | null;
  runStartedAt: number | null;
  elapsedBeforeRun: number;
  levelDurationOverrideSeconds: number | null;
  soundEnabled: boolean;
  alertVolume: number;
  animationKey: number;
  isHydrated: boolean;
};

const clampLevelIndex = (levels: BlindLevel[], levelIndex: number) =>
  Math.min(Math.max(levelIndex, 0), levels.length - 1);

const getLevelDurationMs = (
  levels: BlindLevel[],
  levelIndex: number,
  levelDurationOverrideSeconds: number | null,
) => {
  const level = levels[clampLevelIndex(levels, levelIndex)];
  const durationSeconds =
    level.isBreak || levelDurationOverrideSeconds === null
      ? level.duration
      : levelDurationOverrideSeconds;

  return durationSeconds * 1000;
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

const createInitialState = (levels: BlindLevel[]): TimerState => ({
  currentLevelIndex: 0,
  remainingTime: getLevelDurationMs(levels, 0, null),
  isRunning: false,
  endTime: null,
  runStartedAt: null,
  elapsedBeforeRun: 0,
  levelDurationOverrideSeconds: null,
  soundEnabled: true,
  alertVolume: DEFAULT_ALERT_VOLUME,
  animationKey: 0,
  isHydrated: true,
});

const resolveRunningState = (
  levels: BlindLevel[],
  currentLevelIndex: number,
  endTime: number,
  levelDurationOverrideSeconds: number | null,
  now: number,
) => {
  let nextLevelIndex = clampLevelIndex(levels, currentLevelIndex);
  let nextEndTime = endTime;
  let didAdvance = false;

  while (nextLevelIndex < levels.length - 1 && now >= nextEndTime) {
    nextLevelIndex += 1;
    nextEndTime += getLevelDurationMs(
      levels,
      nextLevelIndex,
      levelDurationOverrideSeconds,
    );
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

export const useBlindTimer = (levels = blindLevels) => {
  const [state, setState] = useState<TimerState>(() =>
    createInitialState(levels),
  );
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
    const volumeScale = state.alertVolume / 100;
    const masterGain = audioContext.createGain();
    const compressor = audioContext.createDynamicsCompressor();
    const shimmerFilter = audioContext.createBiquadFilter();
    const transientFilter = audioContext.createBiquadFilter();
    const notePattern = [
      { frequency: 987.77, startOffset: 0, duration: 0.18 },
      { frequency: 1244.51, startOffset: 0.13, duration: 0.2 },
      { frequency: 1479.98, startOffset: 0.27, duration: 0.22 },
      { frequency: 1975.53, startOffset: 0.48, duration: 0.34 },
    ];
    const totalDuration = 1.05;

    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(
      0.28 * ALERT_VOLUME_GAIN * volumeScale,
      now + 0.014,
    );
    masterGain.gain.exponentialRampToValueAtTime(
      0.12 * ALERT_VOLUME_GAIN * volumeScale,
      now + totalDuration * 0.68,
    );
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + totalDuration);

    compressor.threshold.setValueAtTime(-17, now);
    compressor.knee.setValueAtTime(14, now);
    compressor.ratio.setValueAtTime(2.8, now);
    compressor.attack.setValueAtTime(0.006, now);
    compressor.release.setValueAtTime(0.18, now);

    shimmerFilter.type = "highpass";
    shimmerFilter.frequency.setValueAtTime(620, now);
    shimmerFilter.Q.setValueAtTime(0.72, now);

    transientFilter.type = "bandpass";
    transientFilter.frequency.setValueAtTime(2600, now);
    transientFilter.Q.setValueAtTime(2.2, now);

    masterGain.connect(shimmerFilter);
    shimmerFilter.connect(compressor);
    compressor.connect(audioContext.destination);

    const createGlassNote = (
      startAt: number,
      frequency: number,
      duration: number,
    ) => {
      const bodyOscillator = audioContext.createOscillator();
      const shineOscillator = audioContext.createOscillator();
      const noteGain = audioContext.createGain();

      bodyOscillator.type = "triangle";
      bodyOscillator.frequency.setValueAtTime(frequency, startAt);
      bodyOscillator.frequency.exponentialRampToValueAtTime(
        frequency * 1.035,
        startAt + duration * 0.42,
      );

      shineOscillator.type = "sine";
      shineOscillator.frequency.setValueAtTime(frequency * 2.01, startAt);
      shineOscillator.detune.setValueAtTime(7, startAt);

      noteGain.gain.setValueAtTime(0.0001, startAt);
      noteGain.gain.linearRampToValueAtTime(0.34, startAt + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.11, startAt + duration * 0.48);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      bodyOscillator.connect(noteGain);
      shineOscillator.connect(noteGain);
      noteGain.connect(masterGain);

      bodyOscillator.start(startAt);
      shineOscillator.start(startAt + 0.004);
      bodyOscillator.stop(startAt + duration);
      shineOscillator.stop(startAt + duration * 0.82);
    };

    const createTransient = (startAt: number) => {
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, sampleRate * 0.025, sampleRate);
      const output = buffer.getChannelData(0);

      for (let index = 0; index < output.length; index += 1) {
        output[index] = (Math.random() * 2 - 1) * (1 - index / output.length);
      }

      const noise = audioContext.createBufferSource();
      const noiseGain = audioContext.createGain();

      noise.buffer = buffer;
      noiseGain.gain.setValueAtTime(0.28, startAt);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.025);

      noise.connect(noiseGain);
      noiseGain.connect(transientFilter);
      transientFilter.connect(compressor);

      noise.start(startAt);
      noise.stop(startAt + 0.025);
    };

    notePattern.forEach(({ duration, frequency, startOffset }, index) => {
      const startAt = now + startOffset;

      createGlassNote(startAt, frequency, duration);

      if (index < 3) {
        createTransient(startAt);
      }
    });
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
          levels,
          previousState.currentLevelIndex,
          previousState.endTime,
          previousState.levelDurationOverrideSeconds,
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
  }, [levels, state.isRunning]);

  useEffect(() => {
    const syncWithClock = () => {
      setState((previousState) => {
        if (!previousState.isRunning || previousState.endTime === null) {
          return previousState;
        }

        const resolvedState = resolveRunningState(
          levels,
          previousState.currentLevelIndex,
          previousState.endTime,
          previousState.levelDurationOverrideSeconds,
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
  }, [levels]);

  useEffect(() => {
    const previousLevelIndex = previousLevelIndexRef.current;

    if (
      previousLevelIndex !== null &&
      previousLevelIndex !== state.currentLevelIndex
    ) {
      void playAlertSound();
      window.setTimeout(() => {
        void playAlertSound();
      }, 1200);
    }

    previousLevelIndexRef.current = state.currentLevelIndex;
  }, [playAlertSound, state.currentLevelIndex]);

  const moveToLevel = useEffectEvent((targetLevelIndex: number) => {
    const now = Date.now();

    setState((previousState) => {
      const nextLevelIndex = clampLevelIndex(levels, targetLevelIndex);
      const nextDuration = getLevelDurationMs(
        levels,
        nextLevelIndex,
        previousState.levelDurationOverrideSeconds,
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
    const nextLevelIndex = clampLevelIndex(levels, safeLevelNumber - 1);
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
      if (
        previousState.levelDurationOverrideSeconds ===
        nextLevelDurationSeconds
      ) {
        return previousState;
      }

      const currentLevel = levels[previousState.currentLevelIndex];

      if (currentLevel.isBreak) {
        return {
          ...previousState,
          levelDurationOverrideSeconds: nextLevelDurationSeconds,
        };
      }

      const previousDuration = getLevelDurationMs(
        levels,
        previousState.currentLevelIndex,
        previousState.levelDurationOverrideSeconds,
      );
      const nextDuration = getLevelDurationMs(
        levels,
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
        levelDurationOverrideSeconds: nextLevelDurationSeconds,
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
              levels,
              previousState.currentLevelIndex,
              previousState.levelDurationOverrideSeconds,
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
      ...createInitialState(levels),
      soundEnabled: previousState.soundEnabled,
      alertVolume: previousState.alertVolume,
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

  const setAlertVolume = useEffectEvent((volume: number) => {
    const safeVolume = Number.isFinite(volume)
      ? Math.min(Math.max(Math.round(volume), 10), 100)
      : DEFAULT_ALERT_VOLUME;

    setState((previousState) => ({
      ...previousState,
      alertVolume: safeVolume,
      soundEnabled: safeVolume > 0 ? true : previousState.soundEnabled,
    }));
  });

  const currentLevel = levels[state.currentLevelIndex];
  const currentLevelDurationSeconds =
    getLevelDurationMs(
      levels,
      state.currentLevelIndex,
      state.levelDurationOverrideSeconds,
    ) / 1000;
  const nextLevels = levels.slice(
    state.currentLevelIndex + 1,
    state.currentLevelIndex + 3,
  );
  const totalElapsedMs =
    state.elapsedBeforeRun +
    (state.isRunning && state.runStartedAt !== null
      ? Date.now() - state.runStartedAt
      : 0);

  return {
    blindLevels: levels,
    currentLevel,
    currentLevelIndex: state.currentLevelIndex,
    currentLevelNumber: currentLevel.level,
    endTime: state.endTime,
    formattedTime: formatTime(state.remainingTime),
    isHydrated: state.isHydrated,
    isRunning: state.isRunning,
    levelDurationMinutes: Math.floor(currentLevelDurationSeconds / 60),
    levelDurationSeconds: currentLevelDurationSeconds,
    nextLevels,
    remainingTime: state.remainingTime,
    totalElapsedTime: formatElapsedTime(totalElapsedMs),
    alertVolume: state.alertVolume,
    soundEnabled: state.soundEnabled,
    animationKey: state.animationKey,
    totalLevels: levels.length,
    goToNextLevel: () => moveToLevel(state.currentLevelIndex + 1),
    goToPreviousLevel: () => moveToLevel(state.currentLevelIndex - 1),
    jumpTo,
    pause,
    reset,
    setAlertVolume,
    setLevelDuration,
    start,
    toggleSound,
  };
};
