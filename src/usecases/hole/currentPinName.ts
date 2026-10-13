import { Hole } from "model/Hole";

/** What a hole's only pin is called when the player sets it up themselves. */
export const DEFAULT_PIN_NAME = "pin";

/** The key of the pin being played, so that moving it moves that one rather
 * than adding another alongside it. */
export const currentPinName = (hole: Pick<Hole, "pinPlayed" | "pins">) =>
  hole.pinPlayed ?? Object.keys(hole.pins)[0] ?? DEFAULT_PIN_NAME;
