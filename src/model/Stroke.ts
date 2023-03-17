import { LatLng } from "./LatLng";
import { Lie } from "./Lie";

export type Stroke = {
  club: string | undefined;
  lie: Lie | undefined;
  shotPos: LatLng | undefined;
  intendedPos: LatLng | undefined;
};
