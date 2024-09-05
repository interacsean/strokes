import { ClubStats } from "model/ClubStats";
import { RoundsState } from "../roundsState";
import { Club } from "model/Club";
import { StrokeType } from "model/StrokeType";

export const selectClubStats = (state: RoundsState): ClubStats => {
  // todo: read and calculate from state
  return {
    [Club.D]: {
      [StrokeType.FULL]: {
        medianDistance: 190,
        sd1Distances: [160, 203] as [number, number],
        sd2Distances: [132, 210] as [number, number],
        sd1Side: [-3, 17] as [number, number],
        sd2Side: [10, 25] as [number, number],
        strikeQuality: {
          CLEAN: 0.3,
          SLICE: 0.5,
          TOPPED: 0.05,
          SKYBALL: 0.03,
          HOOK: 0.12,
        },
      },
    },
    [Club["4H"]]: {
      [StrokeType.FULL]: {
        medianDistance: 165,
        sd1Distances: [150, 170] as [number, number],
        sd2Distances: [135, 174] as [number, number],
        sd1Side: [5, 6] as [number, number],
        sd2Side: [6.5, 8] as [number, number],
        strikeQuality: {
          CLEAN: 0.7,
          SLICE: 0.2,
          HOOK: 0.03,
          THIN: 0.05,
          THICK: 0.02,
        },
      },
    },
    [Club["6I"]]: {
      [StrokeType.FULL]: {
        medianDistance: 135,
        sd1Distances: [120, 140] as [number, number],
        sd2Distances: [110, 145] as [number, number],
        sd1Side: [5, 5] as [number, number],
        sd2Side: [7, 7] as [number, number],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      },
    },
    [Club["7I"]]: {
      [StrokeType.FULL]: {
        medianDistance: 125,
        sd1Distances: [110, 130] as [number, number],
        sd2Distances: [100, 135] as [number, number],
        sd1Side: [5, 5] as [number, number],
        sd2Side: [7, 7] as [number, number],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      },
    },
    [Club["8I"]]: {
      [StrokeType.FULL]: {
        medianDistance: 115,
        sd1Distances: [100, 120] as [number, number],
        sd2Distances: [90, 125] as [number, number],
        sd1Side: [4, 4] as [number, number],
        sd2Side: [5, 5] as [number, number],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      },
    },
    [Club["PW"]]: {
      [StrokeType.FULL]: {
        medianDistance: 105,
        sd1Distances: [95, 115] as [number, number],
        sd2Distances: [90, 120] as [number, number],
        sd1Side: [3, 3] as [number, number],
        sd2Side: [4, 4] as [number, number],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      },
      [StrokeType.THREE_QTR]: {
        medianDistance: 90,
        sd1Distances: [85, 100] as [number, number],
        sd2Distances: [85, 105] as [number, number],
        sd1Side: [2, 2] as [number, number],
        sd2Side: [3, 3] as [number, number],
        strikeQuality: {
          CLEAN: 0.75,
          SLICE: 0.05,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      },
    },
    [Club["SW"]]: {
      [StrokeType.FULL]: {
        medianDistance: 95,
        sd1Distances: [85, 100] as [number, number],
        sd2Distances: [80, 105] as [number, number],
        sd1Side: [3, 3] as [number, number],
        sd2Side: [4, 4] as [number, number],
        strikeQuality: {
          CLEAN: 0.65,
          SLICE: 0.15,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      },
      [StrokeType.THREE_QTR]: {
        medianDistance: 70,
        sd1Distances: [65, 80] as [number, number],
        sd2Distances: [55, 85] as [number, number],
        sd1Side: [2, 2] as [number, number],
        sd2Side: [3, 3] as [number, number],
        strikeQuality: {
          CLEAN: 0.75,
          SLICE: 0.05,
          HOOK: 0.05,
          THIN: 0.1,
          THICK: 0.05,
        },
      },
    },
  };
};
