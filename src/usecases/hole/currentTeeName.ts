import { Hole } from "model/Hole";

/** What a hole's only tee is called when the player sets it up themselves. */
export const DEFAULT_TEE_NAME = "tee";

/**
 * The key of the tee being played, so that everything set on the tee — its par,
 * its position — lands on the same one. A hole the player is setting up as they
 * go has no tees yet, so the first thing set on it starts the default one.
 */
export const currentTeeName = (hole: Pick<Hole, "teePlayed" | "tees">) =>
  hole.teePlayed ?? Object.keys(hole.tees)[0] ?? DEFAULT_TEE_NAME;
