import { Stroke } from "./Stroke";
import { LatLng } from "model/LatLng";

export type HoleDef = {
  holeNum: number;
  tees: Record<
    string,
    | {
        par: number | undefined;
        nominalDistance: number;
        pos: LatLng;
      }
    | undefined
  >;
  pins: Record<string, LatLng | undefined>;
  green?: {
    front: LatLng;
    back: LatLng;
  };
  waypoints?: Partial<LatLng>[];
};

export type Hole = HoleDef & {
  strokes: Stroke[];
  teePlayed: string | undefined;
  pinPlayed: string | undefined;
  completed: boolean;
  // todo: waypoints (for targets)
};
