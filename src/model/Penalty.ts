export enum PenaltyReason {
  PENALTY_AREA = "PENALTY_AREA",
  OUT_OF_BOUNDS = "OUT_OF_BOUNDS",
  LOST_BALL = "LOST_BALL",
  UNPLAYABLE = "UNPLAYABLE",
  BALL_MOVED = "BALL_MOVED",
  GROUNDED_CLUB = "GROUNDED_CLUB",
  WRONG_BALL = "WRONG_BALL",
  OTHER = "OTHER",
}

export const PenaltyReasonLabels: Record<PenaltyReason, string> = {
  [PenaltyReason.PENALTY_AREA]: "Penalty area",
  [PenaltyReason.OUT_OF_BOUNDS]: "Out of bounds",
  [PenaltyReason.LOST_BALL]: "Lost ball",
  [PenaltyReason.UNPLAYABLE]: "Unplayable",
  [PenaltyReason.BALL_MOVED]: "Moved ball at rest",
  [PenaltyReason.GROUNDED_CLUB]: "Grounded club",
  [PenaltyReason.WRONG_BALL]: "Wrong ball",
  [PenaltyReason.OTHER]: "Other",
};

// Where the next stroke is played from. Only the two cases that the app can act
// on: REPLAY is the one relief the app can derive a position for (the previous
// stroke's fromPos), DROP covers everything else — lateral, back-on-the-line,
// drop zones, nearest point of relief — all of which need a fresh position.
export enum ReliefMethod {
  REPLAY = "REPLAY",
  DROP = "DROP",
}

export const ReliefMethodLabels: Record<ReliefMethod, string> = {
  [ReliefMethod.REPLAY]: "Replay",
  [ReliefMethod.DROP]: "Drop",
};

export type Penalty = {
  reason: PenaltyReason;
  strokes: number;
  // Omitted for score-only penalties, which leave the ball where it is.
  relief?: ReliefMethod;
};

type PenaltyRule = {
  strokes: number;
  // Empty means score-only — no relief taken, ball stays put.
  reliefOptions: ReliefMethod[];
};

export const PenaltyRules: Record<PenaltyReason, PenaltyRule> = {
  // Rule 17.1d — stroke and distance, back-on-the-line, or lateral (red only)
  [PenaltyReason.PENALTY_AREA]: {
    strokes: 1,
    reliefOptions: [ReliefMethod.DROP, ReliefMethod.REPLAY],
  },
  // Rule 18.2 — stroke and distance is the only option
  [PenaltyReason.OUT_OF_BOUNDS]: {
    strokes: 1,
    reliefOptions: [ReliefMethod.REPLAY],
  },
  [PenaltyReason.LOST_BALL]: {
    strokes: 1,
    reliefOptions: [ReliefMethod.REPLAY],
  },
  // Rule 19.2 — stroke and distance, back-on-the-line, or lateral
  [PenaltyReason.UNPLAYABLE]: {
    strokes: 1,
    reliefOptions: [ReliefMethod.DROP, ReliefMethod.REPLAY],
  },
  // Rule 9.4 — ball is replaced, no relief
  [PenaltyReason.BALL_MOVED]: {
    strokes: 1,
    reliefOptions: [],
  },
  // Rules 12.2b / 8.1 — general penalty, play on
  [PenaltyReason.GROUNDED_CLUB]: {
    strokes: 2,
    reliefOptions: [],
  },
  // Rule 6.3c — general penalty, play on with the right ball
  [PenaltyReason.WRONG_BALL]: {
    strokes: 2,
    reliefOptions: [],
  },
  [PenaltyReason.OTHER]: {
    strokes: 1,
    reliefOptions: [ReliefMethod.DROP, ReliefMethod.REPLAY],
  },
};

export function newPenalty(reason: PenaltyReason): Penalty {
  const rule = PenaltyRules[reason];
  return {
    reason,
    strokes: rule.strokes,
    relief: rule.reliefOptions[0],
  };
}
