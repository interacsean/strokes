import { LatLng } from "./LatLng";
import { Lie } from "./Lie";

export type Stroke = {
  club: string | undefined;
  lie: Lie | undefined;
  ballPos: LatLng | undefined;
  intendedPos: LatLng | undefined;
};

export type StrokeWithDerivedFields = Stroke & {
  strokeDistance?: number,
}
