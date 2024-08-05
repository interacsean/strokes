import { Hole } from "model/Hole";

export const newHole = (): Hole => ({
  holeNum: 1,
  strokes: [],
  pinPlayed: "pin",
  pins: {},
  tees: {},
  completed: false,
  teePlayed: undefined,
});
