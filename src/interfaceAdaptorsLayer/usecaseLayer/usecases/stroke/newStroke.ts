import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { setStrokeLie } from "./setStrokeLie";

export function newStroke(strokeNum: number): Stroke {
  let stroke: Stroke = {
    lie: undefined,
    club: undefined,
    intendedPos: undefined,
    shotPos: undefined,
  };
  setStrokeLie(
    ({ lie }) => (stroke.lie = lie),
    strokeNum,
    strokeNum === 1 ? Lie.TEE : undefined
  );
  return stroke;
}
