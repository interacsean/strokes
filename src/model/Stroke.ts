import { LatLng } from "./LatLng";
import { Lie } from "./Lie";
import { StrokeType } from "./StrokeType";

export type Stroke = {
  club: string | undefined;
  lie: Lie | undefined;
  liePos: LatLng | undefined;
  strokePos: LatLng | undefined;
  strokeType: StrokeType | undefined;
  intendedPos: LatLng | undefined;
};

export type StrokeWithDerivedFields = Stroke & {
  strokeDistance: number | undefined;
  distanceToHole: number | undefined;
};
