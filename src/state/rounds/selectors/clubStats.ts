import { ClubStats } from "model/ClubStats";
import { RoundsState } from "../roundsState";
import { Club } from "model/Club";
import { StrokeType } from "model/StrokeType";

interface CCSParams {
  dist: number;
  sideDisp: number[];
  distDisp: number[];
  roll: number;
  strikeQuality?: Record<string, number>;
}

const createClubStats = ({
  dist,
  sideDisp,
  distDisp,
  roll,
  strikeQuality,
}: CCSParams) => ({
  medianDistance: dist,
  roll,
  sd1Distances: [
    dist + distDisp[0],
    dist + distDisp[1],
  ] as [number, number],
  sd2Distances: [
    dist + (distDisp[2] ?? distDisp[0]),
    dist + (distDisp[3] ?? distDisp[1]),
  ] as [number, number],
  sd1Side: [sideDisp[0], sideDisp[1]] as [number, number],
  sd2Side: [
    sideDisp[2] ?? sideDisp[0],
    sideDisp[3] ?? sideDisp[1],
  ] as [number, number],
  strikeQuality: strikeQuality ?? {
    CLEAN: 0.3,
    SLICE: 0.5,
    TOPPED: 0.05,
    SKYBALL: 0.03,
    HOOK: 0.12,
  },
});

export const selectClubStats = (state: RoundsState): ClubStats => {
  // todo: read and calculate from state
  // todo: add loft
  return {
    [Club.D]: {
      [StrokeType.FULL]: createClubStats({
        dist: 185,
        roll: 25,
        distDisp: [-5, 20, -30, 30],
        sideDisp: [3, 17, 10, 25],
        strikeQuality: {
          CLEAN: 0.3,
          SLICE: 0.5,
          TOPPED: 0.05,
          SKYBALL: 0.03,
          HOOK: 0.12,
        },
      }),
    },
    [Club["3W"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 175,
        roll: 23,
        distDisp: [-5, 5, -30, 10],
        sideDisp: [4, 7, 6, 12],
        strikeQuality: {
          CLEAN: 0.5,
          SLICE: 0.3,
          TOPPED: 0.05,
          SKYBALL: 0.03,
          HOOK: 0.12,
        },
      }),
    },
    [Club["4H"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 170,
        roll: 15,
        distDisp: [-5, 5, -25, 15],
        sideDisp: [5, 6, 6.5, 8],
        strikeQuality: {
          CLEAN: 0.7,
          SLICE: 0.2,
          HOOK: 0.03,
          THIN: 0.05,
          THICK: 0.02,
        },
      }),
    },
    [Club["4I"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 172,
        roll: 30,
        distDisp: [-5, 5, -10, 10],
        sideDisp: [5, 6, 6.5, 8],
        strikeQuality: {
          CLEAN: 0.7,
          SLICE: 0.2,
          HOOK: 0.03,
          THIN: 0.05,
          THICK: 0.02,
        },
      }),
    },
    [Club["5I"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 150,
        roll: 16,
        distDisp: [-6, 4, -10, 15],
        sideDisp: [5, 5, 7, 7],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
    },
    [Club["6I"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 148,
        roll: 16,
        distDisp: [-10, 5, -16, 16],
        sideDisp: [5, 5, 7, 7],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
    },
    [Club["7I"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 144,
        roll: 16,
        distDisp: [-8, 10, -23, 20],
        sideDisp: [5, 5, 7, 7],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
    },
    [Club["8I"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 134,
        roll: 14,
        distDisp: [-8, 10, -16, 15],
        sideDisp: [4, 4, 5, 5],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
    },
    [Club["9I"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 124,
        roll: 10,
        distDisp: [-11, 5, -14, 8],
        sideDisp: [4, 4, 5, 5],
        strikeQuality: {},
      }),
    },
    [Club["PW"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 110,
        roll: 6,
        distDisp: [-10, 10, -15, 10],
        sideDisp: [3, 3, 4, 4],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
      [StrokeType.THREE_QTR]: createClubStats({
        dist: 95,
        roll: 8,
        distDisp: [-5, 5, -15, 7],
        sideDisp: [2, 2, 3, 3],
        strikeQuality: {
          CLEAN: 0.75,
          SLICE: 0.05,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
      [StrokeType.PITCH]: createClubStats({
        dist: 92,
        roll: 12,
        distDisp: [-8, 5, -15, 7],
        sideDisp: [2, 2, 3, 3],
        strikeQuality: {
          CLEAN: 0.75,
          SLICE: 0.05,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
    },
    [Club["SW"]]: {
      [StrokeType.FULL]: createClubStats({
        dist: 74,
        roll: 3,
        distDisp: [-8, 4, -9, 8],
        sideDisp: [3, 3, 4, 4],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
      [StrokeType.THREE_QTR]: createClubStats({
        dist: 65,
        roll: 10,
        distDisp: [-5, 5, -10, 10],
        sideDisp: [2, 2, 3, 3],
        strikeQuality: {
          CLEAN: 0.75,
          SLICE: 0.05,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      }),
    },
  };
};
