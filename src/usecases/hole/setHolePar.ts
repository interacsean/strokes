import { Hole } from "model/Hole";
import { DeepPartial } from "types/DeepPartial";
import { currentTeeName } from "./currentTeeName";

export function setHolePar(
  setHoleAttr: (partHole: DeepPartial<Hole>) => void,
  hole: Pick<Hole, "teePlayed" | "tees">,
  par: number
) {
  const cleanPar = Math.min(5, Math.max(3, par));
  setHoleAttr({ tees: { [currentTeeName(hole)]: { par: cleanPar } } });
}
