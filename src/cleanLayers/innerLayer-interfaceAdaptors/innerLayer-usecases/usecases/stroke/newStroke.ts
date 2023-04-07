import { Lie } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Lie";
import { Stroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Stroke";
import { setStrokeLie } from "./setStrokeLie";

export function newStroke(strokeNum: number): Stroke {
  let stroke: Stroke = {
    lie: undefined,
    liePos: undefined,
    club: undefined,
    intendedPos: undefined,
    strokePos: undefined,
  };
  setStrokeLie(
    ({ lie }) => (stroke.lie = lie),
    strokeNum,
    strokeNum === 1 ? Lie.TEE : undefined
  );
  return stroke;
}
