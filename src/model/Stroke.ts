import { LatLng } from "./LatLng";
import { Lie } from "./Lie";
import { PosOption, PosOptionMethods } from "./PosOptions";
import { StrokeType } from "./StrokeType";

export type Stroke = {
  club: string | undefined;
  fromPos: LatLng | undefined;
  fromPosSetMethod: PosOptionMethods;
  fromLie: Lie | string | undefined;
  toPos: LatLng | undefined;
  toPosSetMethod: PosOptionMethods;
  toLie: Lie | undefined | null;
  strokeType: StrokeType | undefined;
  intendedPos: LatLng | undefined;
};

export type StrokeWithDerivedFields = Stroke & {
  strokeDistance: number | undefined;
  distanceToHole: number | undefined;
};
