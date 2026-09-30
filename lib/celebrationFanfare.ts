type StopFanfare = () => void;

const createTone = (
  audioContext: AudioContext,
  destination: AudioNode,
  frequency: number,
  startsAt: number,
  duration: number,
  volume: number
) => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  oscillator.detune.setValueAtTime(-3, startsAt);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2800, startsAt);
  filter.frequency.exponentialRampToValueAtTime(1500, startsAt + duration);

  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(volume, startsAt + 0.035);
  gain.gain.setValueAtTime(volume * 0.72, startsAt + duration * 0.52);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration + 0.02);
};

const createCymbal = (
  audioContext: AudioContext,
  destination: AudioNode,
  startsAt: number
) => {
  const duration = 0.9;
  const frameCount = Math.floor(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(
    1,
    frameCount,
    audioContext.sampleRate
  );
  const output = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    output[index] = (Math.random() * 2 - 1) * (1 - index / frameCount);
  }

  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();

  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.setValueAtTime(4200, startsAt);
  gain.gain.setValueAtTime(0.16, startsAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(startsAt);
};

export const playCelebrationFanfare = async (): Promise<StopFanfare> => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) {
    return () => undefined;
  }

  const audioContext = new AudioContextClass();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const masterGain = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();
  const startsAt = audioContext.currentTime + 0.06;

  masterGain.gain.setValueAtTime(0.18, startsAt);
  masterGain.gain.setValueAtTime(0.18, startsAt + 1.7);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 2.8);

  compressor.threshold.setValueAtTime(-20, startsAt);
  compressor.knee.setValueAtTime(18, startsAt);
  compressor.ratio.setValueAtTime(4, startsAt);
  compressor.attack.setValueAtTime(0.005, startsAt);
  compressor.release.setValueAtTime(0.2, startsAt);

  masterGain.connect(compressor);
  compressor.connect(audioContext.destination);

  const melody = [
    { frequency: 392, offset: 0, duration: 0.28 },
    { frequency: 523.25, offset: 0.22, duration: 0.3 },
    { frequency: 659.25, offset: 0.44, duration: 0.32 },
    { frequency: 783.99, offset: 0.66, duration: 0.38 },
    { frequency: 1046.5, offset: 1.02, duration: 1.45 },
  ];

  melody.forEach(({ duration, frequency, offset }) => {
    createTone(
      audioContext,
      masterGain,
      frequency,
      startsAt + offset,
      duration,
      0.22
    );
  });

  [261.63, 392, 523.25, 659.25, 783.99].forEach((frequency, index) => {
    createTone(
      audioContext,
      masterGain,
      frequency,
      startsAt + 1.02,
      1.55,
      index === 0 ? 0.2 : 0.11
    );
  });

  createCymbal(audioContext, masterGain, startsAt + 1.02);

  const closeTimer = window.setTimeout(() => {
    if (audioContext.state !== "closed") {
      void audioContext.close();
    }
  }, 3200);

  return () => {
    window.clearTimeout(closeTimer);

    if (audioContext.state !== "closed") {
      void audioContext.close();
    }
  };
};
