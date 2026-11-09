const ISO_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?/;
const KOREA_TIME_OFFSET_MS = 9 * 60 * 60 * 1000;

export const TOURNAMENT_DISPLAY_TIME_ZONE = "UTC";

const getTournamentDateTimeParts = (value: string) => {
  const match = ISO_DATE_TIME_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second = "0", fraction = "0"] =
    match;

  return {
    day: Number(day),
    hour: Number(hour),
    milliseconds: Number(fraction.padEnd(3, "0")),
    minute: Number(minute),
    monthIndex: Number(month) - 1,
    second: Number(second),
    year: Number(year),
  };
};

const getTournamentUtcTime = (value: string) => {
  const parts = getTournamentDateTimeParts(value);

  if (!parts) {
    return null;
  }

  return Date.UTC(
    parts.year,
    parts.monthIndex,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.milliseconds
  );
};

// API 응답의 시간대 접미사 유무와 관계없이 서버가 기록한 시각 자체를 표시한다.
export const parseTournamentDateTimeForDisplay = (value: string) => {
  const utcTime = getTournamentUtcTime(value);

  return new Date(utcTime ?? value);
};

// 서버가 기록한 한국 시각을 실제 타이머 계산에 사용할 절대 시각으로 변환한다.
export const parseTournamentDateTimeAsKoreaInstant = (value: string) => {
  const utcTime = getTournamentUtcTime(value);

  return utcTime === null ? Date.parse(value) : utcTime - KOREA_TIME_OFFSET_MS;
};
