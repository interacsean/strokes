import { Club } from "./Club";
import { StrokeType } from "./StrokeType";

export type ClubStats = Partial<
  Record<
    Club,
    Partial<
      Record<
        StrokeType,
        {
          medianDistance: number;
          sd1Distances: [number, number];
          sd2Distances: [number, number];
          sd1Side: [number, number];
          sd2Side: [number, number];
          strikeQuality: Partial<Record<string, number>>;
        }
      >
    >
  >
>;
