import { Club } from "model/Club";
import { Stroke } from "model/Stroke";
import { Hole } from "model/Hole";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";

export type CaddySuggestion = {
  club: Club;
  clubDistance: [number, number];
};

type ClubStat = { loft: number; distances: [number, number] };
// todo: fix loft numbers
const TEMP_clubStatistics: Partial<Record<Club, ClubStat>> = {
  [Club.D]: { loft: 10.5, distances: [180, 205] as [number, number] },
  [Club["3W"]]: { loft: 15, distances: [155, 175] as [number, number] },
  [Club["5W"]]: { loft: 21, distances: [150, 170] as [number, number] },
  [Club["6I"]]: { loft: 23, distances: [135, 148] as [number, number] },
  [Club["7I"]]: { loft: 27, distances: [125, 140] as [number, number] },
  [Club["8I"]]: { loft: 30, distances: [115, 130] as [number, number] },
  [Club["9I"]]: { loft: 33, distances: [105, 115] as [number, number] },
  [Club["PW"]]: { loft: 40, distances: [92, 105] as [number, number] },
  [Club["SW"]]: { loft: 45, distances: [80, 90] as [number, number] },
};

// todo: accept clubStatistics
export function calculateCaddySuggestions(
  hole: Pick<Hole, "holePos">,
  currentStroke: Pick<Stroke, "strokePos" | "intendedPos">,
  clubStatistics = TEMP_clubStatistics
) {
  const holePos = hole.holePos;
  if (!holePos || !currentStroke.strokePos) return [];
  const targetPos = currentStroke.intendedPos || holePos;

  const distanceToTarget = calculateDistanceBetweenPositions(
    currentStroke.strokePos,
    targetPos
  );

  const clubRanges = Object.entries(clubStatistics)
    .map((clubStats) => ({
      club: clubStats[0] as Club,
      clubStats: clubStats[1],
      deltaLow: distanceToTarget - clubStats[1].distances[0],
      deltaHigh: distanceToTarget - clubStats[1].distances[1],
      deltaAvg:
        distanceToTarget -
        (clubStats[1].distances[0] + clubStats[1].distances[1]) / 2,
    }))
    .filter((info) => info.deltaLow > 0 && info.deltaHigh < 0)
    .sort((infoA, infoB) => {
      const deltaResult =
        Math.round(infoB.deltaAvg) - Math.round(infoB.deltaLow);
      if (deltaResult === 0) return infoB.clubStats.loft - infoA.clubStats.loft;
      return deltaResult;
    })
    .map(({ club, clubStats }) => ({
      club,
      clubDistance: clubStats.distances,
    }));

  return clubRanges;
}
