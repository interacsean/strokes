import { Hole } from "model/Hole";

export function setHolePar(
  setHoleAttr: (partHole: Partial<Hole>) => void,
  par: number,
) {
  const cleanPar = Math.min(5, Math.max(3, par));
  setHoleAttr({ par: cleanPar });
};
