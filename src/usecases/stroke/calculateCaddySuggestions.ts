import { Club } from "model/Club";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { LatLng } from "model/LatLng";
import { ClubStats } from "model/ClubStats";
import { Lie, PuttableLies } from "model/Lie";

export type CaddySuggestion = {
  club: Club;
  clubDistance: [number, [number, number]];
  deltaAvg?: number;
};

export function calculateCaddySuggestions(
  clubStats: ClubStats,
  lie: Lie | undefined,
  fromPos: LatLng,
  targetPos: LatLng
): CaddySuggestion[] {
  if (lie && [Lie.GREEN, Lie.FRINGE].includes(lie)) {
    return [
      {
        club: Club.P,
        clubDistance: [10, [0, 20]] as [number, [number, number]], // todo: get from stats I guess
        deltaAvg: 0,
      },
    ];
  }
  const distanceToTarget = calculateDistanceBetweenPositions(
    fromPos,
    targetPos
  );

  const clubRanges = Object.entries(clubStats)
    .map((clubStats) => ({
      club: clubStats[0] as Club,
      clubStats: clubStats[1],
      deltaLow: clubStats[1].Full
        ? distanceToTarget - clubStats[1].Full.sd1Distances[0]
        : 0,
      deltaHigh: clubStats[1].Full
        ? distanceToTarget - clubStats[1].Full.sd1Distances[1]
        : 0,
      deltaAvg: clubStats[1].Full
        ? distanceToTarget - clubStats[1].Full.medianDistance
        : 0,
    }))
    .filter((clubStats) => !!clubStats.clubStats.Full)
    // .filter((info) => (info.deltaLow > 0 && info.deltaHigh < 0) || info.club === Club.D) // todo: always include driver as long option
    // .filter todo: take lie and club type into account
    // .map todo: account for wind (i.e. tail/head wind)
    // .map todo: account for slope (i.e. distance played)
    .sort((infoA, infoB) => {
      // if one club can't make the distance but the other can, prefer the one that can
      if (infoA.deltaHigh < 0 && infoB.deltaHigh > 0) return -1;
      if (infoB.deltaHigh < 0 && infoA.deltaHigh > 0) return 1;

      // if they both can/can't make distance, prefer the one that is closer
      // todo: consider if we should use have some preference for the one that is within average range
      const deltaResult = Math.round(
        Math.abs(infoA.deltaAvg) - Math.abs(infoB.deltaAvg)
      );

      // todo: Take club loft into account for preference
      // if (deltaResult === 0) return infoB.clubStats.loft - infoA.clubStats.loft;
      return deltaResult;
    })
    .map(({ club, clubStats, deltaAvg }) => {
      if (clubStats.Full) {
        return {
          club,
          clubDistance: [
            clubStats.Full.medianDistance,
            [clubStats.Full.sd1Distances[0], clubStats.Full.sd1Distances[1]],
          ],
          deltaAvg,
        };
      } else {
        return null;
      }
    })
    .filter((info) => info !== null) as unknown as CaddySuggestion[];

  // todo: Short range
  // if distance is less than best club's lower bound, suggest THREE_QTR, PITCH, CHIP

  return clubRanges;
}
