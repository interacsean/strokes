import { LatLng } from "./LatLng";
import { Lie } from "./Lie";

export type Stroke = {
  club: string | undefined;
  lie: Lie | undefined;
  liePos: LatLng | undefined;
  strokePos: LatLng | undefined;
  intendedPos: LatLng | undefined;
};

export type StrokeWithDerivedFields = Stroke & {
  strokeDistance: number | undefined;
  distanceToHole: number | undefined;
};
