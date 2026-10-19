const ISO_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?/;

export const TOURNAMENT_DISPLAY_TIME_ZONE = "UTC";

// API 응답의 시간대 접미사 유무와 관계없이 서버가 기록한 시각 자체를 표시한다.
export const parseTournamentDateTimeForDisplay = (value: string) => {
  const match = ISO_DATE_TIME_PATTERN.exec(value);

  if (!match) {
    return new Date(value);
  }

  const [, year, month, day, hour, minute, second = "0", fraction = "0"] =
    match;

  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      Number(fraction.padEnd(3, "0"))
    )
  );
};
