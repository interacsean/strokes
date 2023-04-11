import { Lie } from "model/Lie";

export function setStrokeLie(
  setHoleAttr: (partStroke: { lie: Lie | undefined }) => void,
  strokeNum: number,
  lie: Lie | undefined
) {
  const validLie =
    strokeNum === 1 && (!lie || ![Lie.TEE, Lie.TEE_GRASS].includes(lie))
      ? Lie.TEE
      : strokeNum > 1 && lie === Lie.TEE
      ? Lie.FAIRWAY
      : lie;
  return setHoleAttr({ lie: validLie });
}
