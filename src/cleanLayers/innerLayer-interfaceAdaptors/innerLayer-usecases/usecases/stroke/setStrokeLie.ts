import { Lie } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Lie";
import { Stroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Stroke";

export function setStrokeLie(
  setHoleAttr: (partStroke: { lie: Lie | undefined }) => void,
  strokeNum: number,
  lie: Lie | undefined
) {
  const validLie =
    strokeNum === 1
      ? Lie.TEE
      : strokeNum > 1 && lie === Lie.TEE
        ? Lie.FAIRWAY
        : lie;
  return setHoleAttr({ lie: validLie });
}
