import { Lie } from "model/Lie";
import { StrokeType } from "model/StrokeType";

export function setStrokeType(
  setHoleAttr: (partStroke: { strokeType: StrokeType | undefined }) => void,
  strokeNum: number,
  lie: Lie | undefined,
  strokeType: StrokeType | undefined
) {
  const validStrokeType =
    strokeNum === 1 && strokeType === StrokeType.PUTT
      ? StrokeType.FULL
      : strokeNum > 1 && lie === Lie.GREEN
      ? StrokeType.PUTT
      : strokeType;
  return setHoleAttr({ strokeType: validStrokeType });
}
