export enum Lie {
  TEE_HIGH = "Tee (High)",
  TEE_MEDIUM = "Tee (Medium)",
  TEE_LOW = "Tee (Low)",
  TEE_GRASS = "Tee (Grass)",
  TEE_ARTIFICIAL_GRASS = "Tee (Artificial Grass)",
  FAIRWAY = "Fairway",
  WRONG_FAIRWAY = "Wrong Fairway",
  LIGHT_ROUGH = "Light rough",
  DEEP_ROUGH = "Deep rough",
  BUNKER = "Bunker",
  GREEN = "Green",
  FRINGE = "Fringe",
  WATER = "Water hazard",
  HAZARD = "Hazard / Out of bounds",
}

export const TeeLies = [
  Lie.TEE_HIGH,
  Lie.TEE_MEDIUM,
  Lie.TEE_LOW,
  Lie.TEE_GRASS,
  Lie.TEE_ARTIFICIAL_GRASS,
];

export const PuttableLies = [
  Lie.GREEN,
  Lie.FRINGE,
  Lie.FAIRWAY,
  Lie.LIGHT_ROUGH,
];
