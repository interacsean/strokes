import { LatLng } from "types/LatLng";
import { Lie } from "types/Lie";

export interface StrokeModel {
  club: string | undefined;
  lie: Lie | undefined;
  shotPos: LatLng | undefined;
  intendedPos: LatLng | undefined;
}

export interface StrokesModel {
  strokes: StrokeModel[];
  teePos: LatLng | undefined;
}
