import { Club } from "./Club";
import { LatLng } from "./LatLng";
import { Lie } from "./Lie";
import { PosOptionMethods } from "./PosOptions";
import { Strike } from "./Strike";
import { StrokeType } from "./StrokeType";

export type Stroke = {
  club: Club | undefined;
  fromPos: LatLng | undefined;
  fromPosSetMethod: PosOptionMethods;
  fromLie: Lie | string | undefined;
  toPos: LatLng | undefined;
  toPosSetMethod: PosOptionMethods;
  toLie: Lie | undefined | null;
  strokeType: StrokeType | undefined;
  strike: Strike | undefined;
  intendedPos: LatLng | undefined;
};

export type StrokeWithDerivedFields = Stroke & {
  strokeDistance: number | undefined;
  distanceToHole: number | undefined;
};
