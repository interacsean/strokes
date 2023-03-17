import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";

export function setStrokeLie(
  setHoleAttr: (partStroke: { lie: Lie | undefined }) => void,
  strokeNum: number,
  lie: Lie | undefined,
) {
  const validLie = strokeNum === 1 ? Lie.TEE
    : (strokeNum > 1 && lie === Lie.TEE) ? Lie.FAIRWAY
    : lie;
  return setHoleAttr({ lie: validLie });
};
