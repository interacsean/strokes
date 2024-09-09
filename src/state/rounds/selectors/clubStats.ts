import { ClubStats } from "model/ClubStats";
import { RoundsState } from "../roundsState";
import { Club } from "model/Club";
import { StrokeType } from "model/StrokeType";

export const selectClubStats = (state: RoundsState): ClubStats => {
  // todo: read and calculate from state
  // todo: add loft
  return {
    [Club.D]: {
      [StrokeType.FULL]: {
        medianDistance: 180,
        sd1Distances: [170, 195] as [number, number],
        sd2Distances: [160, 210] as [number, number],
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
    [Club["3W"]]: {
      [StrokeType.FULL]: {
        medianDistance: 165,
        sd1Distances: [160, 170] as [number, number],
        sd2Distances: [135, 175] as [number, number],
        sd1Side: [4, 7] as [number, number],
        sd2Side: [6, 12] as [number, number],
        strikeQuality: {
          CLEAN: 0.5,
          SLICE: 0.3,
          TOPPED: 0.05,
          SKYBALL: 0.03,
          HOOK: 0.12,
        },
      },
    },
    [Club["4H"]]: {
      [StrokeType.FULL]: {
        medianDistance: 155,
        sd1Distances: [150, 160] as [number, number],
        sd2Distances: [135, 165] as [number, number],
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
    [Club["5I"]]: {
      [StrokeType.FULL]: {
        medianDistance: 140,
        sd1Distances: [130, 150] as [number, number],
        sd2Distances: [130, 155] as [number, number],
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
    [Club["6I"]]: {
      [StrokeType.FULL]: {
        medianDistance: 130,
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
        medianDistance: 120,
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
        medianDistance: 110,
        sd1Distances: [105, 115] as [number, number],
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
    [Club["9I"]]: {
      [StrokeType.FULL]: {
        medianDistance: 101,
        sd1Distances: [96, 106] as [number, number],
        sd2Distances: [96, 106] as [number, number],
        sd1Side: [4, 4] as [number, number],
        sd2Side: [5, 5] as [number, number],
        strikeQuality: {},
      },
    },
    [Club["PW"]]: {
      [StrokeType.FULL]: {
        medianDistance: 90,
        sd1Distances: [85, 95] as [number, number],
        sd2Distances: [85, 110] as [number, number],
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
        sd1Distances: [85, 95] as [number, number],
        sd2Distances: [65, 97] as [number, number],
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
        medianDistance: 75,
        sd1Distances: [70, 80] as [number, number],
        sd2Distances: [65, 82] as [number, number],
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
        medianDistance: 55,
        sd1Distances: [50, 60] as [number, number],
        sd2Distances: [45, 65] as [number, number],
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
