export enum PosOptionMethods {
  GPS = "Gps",
  LAST_SHOT = "Last Shot",
  CUSTOM = "Custom",
  DROP = "Drop",
  NEAR_PIN = "Near Pin",
  HOLE = "Hole",
  TEE = "Tee",
}

export type PosOption = {
  buttonText: string,
  label: string,
  value: string,
}

export const PosOptions: Record<PosOptionMethods, PosOption> = {
  [PosOptionMethods.GPS]: { buttonText: "Set Pos", label: "Set Position from GPS", value: PosOptionMethods.GPS },
  [PosOptionMethods.LAST_SHOT]: {
    buttonText: "Update Last Shot",
    label: "Use Last Shot",
    value: PosOptionMethods.LAST_SHOT,
  },
  [PosOptionMethods.TEE]: { buttonText: "Tee", label: "Tee", value: PosOptionMethods.TEE },
  [PosOptionMethods.CUSTOM]: { buttonText: "Map Pos", label: "Choose on Map", value: PosOptionMethods.CUSTOM },
  [PosOptionMethods.DROP]: { buttonText: "Set Pos", label: "Take Drop", value: PosOptionMethods.DROP },
  [PosOptionMethods.NEAR_PIN]: { buttonText: "Near Pin", label: "Near Pin", value: PosOptionMethods.NEAR_PIN },
  [PosOptionMethods.HOLE]: { buttonText: "In Hole", label: "In Hole", value: PosOptionMethods.HOLE },
};
