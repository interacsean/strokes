import { Club, ClubCategories, PitchableClubs } from "model/Club";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { LatLng } from "model/LatLng";
import { ClubStats } from "model/ClubStats";
import { Lie } from "model/Lie";
import { StrokeType } from "model/StrokeType";

export type CaddySuggestion = {
  club: Club;
  clubDistance: [number, [number, number]];
  strokeType: StrokeType;
  deltaAvg?: number;
};

export function calculateCaddySuggestions(
  clubStats: ClubStats,
  lie: Lie | undefined,
  fromPos: LatLng,
  targetPos: LatLng
): CaddySuggestion[] {
  // todo: get this passed in
  const preferences = {
    noDoD: true,
  };

  if (lie && [Lie.GREEN, Lie.FRINGE].includes(lie)) {
    return [
      {
        club: Club.P,
        clubDistance: [0, [0, 0]] as [number, [number, number]], // todo: get from stats I guess
        strokeType: StrokeType.PUTT,
        deltaAvg: 0,
      },
    ];
  }
  const distanceToTarget = calculateDistanceBetweenPositions(
    fromPos,
    targetPos
  );

  /**
   * if deltaHigh > 0, the club can't make the distance
   * if deltaLow < 0, a full swing is too big
   */
  const clubRanges = Object.entries(clubStats)
    .map((clubStats) => ({
      club: clubStats[0] as Club,
      clubStats: clubStats[1],
      deltaLow: clubStats[1][StrokeType.FULL]
        ? distanceToTarget - clubStats[1][StrokeType.FULL].sd1Distances[0]
        : 0,
      deltaHigh: clubStats[1][StrokeType.FULL]
        ? distanceToTarget - clubStats[1][StrokeType.FULL].sd1Distances[1]
        : 0,
      deltaAvg: clubStats[1][StrokeType.FULL]
        ? distanceToTarget - clubStats[1][StrokeType.FULL].medianDistance
        : 0,
    }))
    .filter((clubStats) => {
      if (!clubStats.clubStats[StrokeType.FULL]) return false;
      // todo: better way to rule out clubs based on lie / preferences
      if (
        lie &&
        ![Lie.TEE_HIGH, Lie.TEE_MEDIUM, Lie.TEE_LOW].includes(lie) &&
        clubStats.club === Club.D &&
        preferences.noDoD
      )
        return false;
      if (
        lie &&
        [Lie.DEEP_ROUGH, Lie.BUNKER].includes(lie) &&
        [
          ...ClubCategories["Woods/Hybrids"],
          Club["2I"],
          Club["3I"],
          Club["4I"],
        ].includes(clubStats.club)
      )
        return false;
      return true;
    })
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
    .map(({ club, clubStats, deltaAvg, deltaLow, deltaHigh }) => {
      const recStrokeType = !clubStats[StrokeType.FULL]
        ? StrokeType.FULL // shouldn't happen as we've filtered out clubs without full stats
        : deltaLow > 0
        ? StrokeType.FULL
        : -deltaAvg / clubStats[StrokeType.FULL]?.medianDistance < 0.3
        ? StrokeType.THREE_QTR
        : lie === Lie.BUNKER && [Club.SW, Club.LW, Club.HLW].includes(club)
        ? StrokeType.FLOP
        : !PitchableClubs.includes(club)
        ? StrokeType.THREE_QTR
        : distanceToTarget < 20
        ? StrokeType.CHIP
        : StrokeType.PITCH;

      if (clubStats[StrokeType.FULL]) {
        return {
          club,
          // todo: return Pitch/Chip distances?
          clubDistance: [
            clubStats[recStrokeType]?.medianDistance || 0,
            [
              clubStats[recStrokeType]?.sd1Distances[0] || 0,
              clubStats[recStrokeType]?.sd1Distances[1] || 0,
            ],
          ] as [number, [number, number]],
          strokeType: recStrokeType,
          deltaAvg,
        };
      } else {
        return null;
      }
    })
    .filter((info) => info !== null) as CaddySuggestion[];

  // todo: Short range
  // if distance is less than best club's lower bound, suggest THREE_QTR, PITCH, CHIP

  return clubRanges;
}
