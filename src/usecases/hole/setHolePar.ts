import { Hole } from "model/Hole";
import { DeepPartial } from "types/DeepPartial";

// todo: accept teePlayed
export function setHolePar(
  setHoleAttr: (partHole: DeepPartial<Hole>) => void,
  par: number
) {
  const cleanPar = Math.min(5, Math.max(3, par));
  setHoleAttr({ tees: { tee: { par: cleanPar } } });
}
