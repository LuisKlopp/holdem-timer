export const PODIUM_STORAGE_KEY = "holdem-timer-podium";

export type PodiumRecord = {
  id: string;
  firstPlace: string;
  secondPlace: string;
  createdAt: string;
};

type LegacyPodiumPayload = {
  firstPlace?: string;
  secondPlace?: string;
  savedAt?: string;
};

const isPodiumRecord = (value: unknown): value is PodiumRecord => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<PodiumRecord>;

  return (
    typeof record.id === "string" &&
    typeof record.firstPlace === "string" &&
    typeof record.secondPlace === "string" &&
    typeof record.createdAt === "string"
  );
};

const migrateLegacyPayload = (payload: LegacyPodiumPayload): PodiumRecord[] => {
  if (
    typeof payload.firstPlace !== "string" ||
    typeof payload.secondPlace !== "string" ||
    !payload.firstPlace.trim() ||
    !payload.secondPlace.trim()
  ) {
    return [];
  }

  return [
    {
      id: payload.savedAt ?? `${Date.now()}`,
      firstPlace: payload.firstPlace.trim(),
      secondPlace: payload.secondPlace.trim(),
      createdAt: payload.savedAt ?? new Date().toISOString(),
    },
  ];
};

export const readPodiumRecords = (): PodiumRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(PODIUM_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;

    if (Array.isArray(parsedValue)) {
      return parsedValue.filter(isPodiumRecord);
    }

    if (parsedValue && typeof parsedValue === "object") {
      const migratedRecords = migrateLegacyPayload(parsedValue as LegacyPodiumPayload);

      if (migratedRecords.length > 0) {
        window.localStorage.setItem(PODIUM_STORAGE_KEY, JSON.stringify(migratedRecords));
      }

      return migratedRecords;
    }
  } catch {
    window.localStorage.removeItem(PODIUM_STORAGE_KEY);
  }

  return [];
};

export const appendPodiumRecord = (form: {
  firstPlace: string;
  secondPlace: string;
}) => {
  if (typeof window === "undefined") {
    return null;
  }

  const nextRecord: PodiumRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    firstPlace: form.firstPlace.trim(),
    secondPlace: form.secondPlace.trim(),
    createdAt: new Date().toISOString(),
  };
  const currentRecords = readPodiumRecords();
  const nextRecords = [...currentRecords, nextRecord];

  window.localStorage.setItem(PODIUM_STORAGE_KEY, JSON.stringify(nextRecords));

  return nextRecord;
};

export const clearPodiumRecords = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PODIUM_STORAGE_KEY);
};

export const getPodiumStats = (records: PodiumRecord[]) => {
  if (records.length === 0) {
    return {
      recentWinner: null,
      topWinner: null,
      totalGames: 0,
    };
  }

  const winCounts = new Map<string, { wins: number; lastWinAt: string }>();

  for (const record of records) {
    const currentWinner = winCounts.get(record.firstPlace);

    if (currentWinner) {
      currentWinner.wins += 1;
      currentWinner.lastWinAt = record.createdAt;
      continue;
    }

    winCounts.set(record.firstPlace, {
      wins: 1,
      lastWinAt: record.createdAt,
    });
  }

  let topWinner: string | null = null;
  let topWins = 0;
  let latestTopWinAt = "";

  for (const [winner, summary] of winCounts.entries()) {
    const isBetterWinner =
      summary.wins > topWins ||
      (summary.wins === topWins && summary.lastWinAt > latestTopWinAt);

    if (!isBetterWinner) {
      continue;
    }

    topWinner = winner;
    topWins = summary.wins;
    latestTopWinAt = summary.lastWinAt;
  }

  return {
    recentWinner: records[records.length - 1]?.firstPlace ?? null,
    topWinner,
    totalGames: records.length,
  };
};

export const getTopWinnerLeaders = (
  records: PodiumRecord[],
  limit = 2
) => {
  const winCounts = new Map<string, { wins: number; lastWinAt: string }>();

  for (const record of records) {
    const normalizedWinner = record.firstPlace.trim();

    if (!normalizedWinner) {
      continue;
    }

    const existingWinner = winCounts.get(normalizedWinner);

    if (existingWinner) {
      existingWinner.wins += 1;
      existingWinner.lastWinAt = record.createdAt;
      continue;
    }

    winCounts.set(normalizedWinner, {
      wins: 1,
      lastWinAt: record.createdAt,
    });
  }

  return Array.from(winCounts.entries())
    .map(([name, summary]) => ({
      name,
      wins: summary.wins,
      lastWinAt: summary.lastWinAt,
    }))
    .sort((left, right) => {
      if (right.wins !== left.wins) {
        return right.wins - left.wins;
      }

      return right.lastWinAt.localeCompare(left.lastWinAt);
    })
    .slice(0, limit);
};
