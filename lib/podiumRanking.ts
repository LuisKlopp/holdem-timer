import type { PodiumRanking } from "@/api";

export type PodiumRankRow = {
  names: string[];
  rank: number;
  rankLabel: string;
  wins: number;
};

export const getPodiumRankRows = (
  rankings: Pick<PodiumRanking, "name" | "wins">[]
) =>
  rankings.reduce<PodiumRankRow[]>((rows, winner) => {
    if (rows.some((row) => row.wins === winner.wins)) {
      return rows;
    }

    const tiedNames = rankings
      .filter((leader) => leader.wins === winner.wins)
      .map((leader) => leader.name);

    rows.push({
      names: tiedNames,
      rank: rows.length + 1,
      rankLabel: `${rows.length + 1}위`,
      wins: winner.wins,
    });

    return rows;
  }, []);
