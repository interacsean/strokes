import { Club } from "./Club";
import { LatLng } from "./LatLng";
import { Lie } from "./Lie";
import { Penalty } from "./Penalty";
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
  // A stroke is a swing; a penalty incurred by that swing rides along with it so
  // that strokes.length keeps meaning "swings taken". Optional, so rounds saved
  // before penalties existed load unchanged.
  penalty?: Penalty;
};

export type StrokeWithDerivedFields = Stroke & {
  strokeDistance: number | undefined;
  distanceToHole: number | undefined;
};
