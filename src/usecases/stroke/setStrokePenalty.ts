import { Penalty, PenaltyRules } from "model/Penalty";
import { Stroke } from "model/Stroke";

// Keeps reason and relief coherent: each reason only permits the relief the
// rules allow, so switching reason snaps relief to something legal.
export function setStrokePenalty(
  setStrokeAttr: (partStroke: Partial<Stroke>) => void,
  strokeNum: number,
  stroke: Stroke | undefined,
  penalty: Penalty | undefined
) {
  if (!penalty) {
    return setStrokeAttr({ penalty: undefined });
  }

  const { reliefOptions } = PenaltyRules[penalty.reason];
  const relief =
    penalty.relief && reliefOptions.includes(penalty.relief)
      ? penalty.relief
      : reliefOptions[0];

  return setStrokeAttr({ penalty: { ...penalty, relief } });
}
