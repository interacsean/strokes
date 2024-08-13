import { LatLng } from "./LatLng";
import { Lie } from "./Lie";
import { StrokeType } from "./StrokeType";

export type Stroke = {
  club: string | undefined;
  fromLie: Lie | undefined;
  fromPos: LatLng | undefined;
  toPos: LatLng | undefined;
  toLie: Lie | undefined | null;
  strokeType: StrokeType | undefined;
  intendedPos: LatLng | undefined;
};

export type StrokeWithDerivedFields = Stroke & {
  strokeDistance: number | undefined;
  distanceToHole: number | undefined;
};
