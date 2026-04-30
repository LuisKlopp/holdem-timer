export type BlindLevel = {
  level: number;
  sb: number;
  bb: number;
  duration: number;
  isBreak: boolean;
  label?: string;
};

export const blindLevels: BlindLevel[] = [
  { level: 1, sb: 100, bb: 200, duration: 480, isBreak: false },
  { level: 2, sb: 200, bb: 400, duration: 480, isBreak: false },
  { level: 3, sb: 300, bb: 600, duration: 480, isBreak: false },
  { level: 4, sb: 400, bb: 800, duration: 480, isBreak: false },
  { level: 5, sb: 500, bb: 1000, duration: 480, isBreak: false },
  { level: 6, sb: 600, bb: 1200, duration: 480, isBreak: false },
  { level: 7, sb: 800, bb: 1600, duration: 480, isBreak: false },
  { level: 8, sb: 1000, bb: 2000, duration: 480, isBreak: false },
  { level: 9, sb: 1500, bb: 3000, duration: 480, isBreak: false },
  { level: 10, sb: 2000, bb: 4000, duration: 480, isBreak: false },
  { level: 11, sb: 0, bb: 0, duration: 300, isBreak: true, label: "BREAK" },
  { level: 12, sb: 2500, bb: 5000, duration: 480, isBreak: false },
  { level: 13, sb: 3000, bb: 6000, duration: 480, isBreak: false },
  { level: 14, sb: 4000, bb: 8000, duration: 480, isBreak: false },
  { level: 15, sb: 5000, bb: 10000, duration: 480, isBreak: false },
  { level: 16, sb: 8000, bb: 16000, duration: 480, isBreak: false },
  { level: 17, sb: 10000, bb: 20000, duration: 480, isBreak: false },
  { level: 18, sb: 15000, bb: 30000, duration: 480, isBreak: false },
  { level: 19, sb: 20000, bb: 40000, duration: 480, isBreak: false },
  { level: 20, sb: 30000, bb: 60000, duration: 480, isBreak: false },
];
