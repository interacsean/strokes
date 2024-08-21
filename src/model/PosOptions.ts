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
  buttonText: string;
  buttonTextSmall?: string;
  actionable?: boolean;
  label: string;
  value: string;
};

export const PosOptions: Record<PosOptionMethods, PosOption> = {
  [PosOptionMethods.GPS]: {
    buttonText: "Set Pos",
    label: "Set Position from GPS",
    value: PosOptionMethods.GPS,
    actionable: true,
  },
  [PosOptionMethods.LAST_SHOT]: {
    buttonText: "Last Shot",
    buttonTextSmall: "Update",
    label: "Use Last Shot",
    value: PosOptionMethods.LAST_SHOT,
    actionable: true,
  },
  [PosOptionMethods.TEE]: {
    buttonText: "Tee",
    label: "Tee",
    value: PosOptionMethods.TEE,
    actionable: false,
  },
  [PosOptionMethods.CUSTOM]: {
    buttonText: "Map Pos",
    label: "Choose on Map",
    value: PosOptionMethods.CUSTOM,
    actionable: true,
  },
  [PosOptionMethods.DROP]: {
    buttonText: "Set Pos",
    label: "Take Drop",
    value: PosOptionMethods.DROP,
    actionable: true,
  },
  [PosOptionMethods.NEAR_PIN]: {
    buttonText: "Near Pin",
    label: "Near Pin",
    value: PosOptionMethods.NEAR_PIN,
    actionable: false,
  },
  [PosOptionMethods.HOLE]: {
    buttonText: "In Hole",
    label: "In Hole",
    value: PosOptionMethods.HOLE,
    actionable: false,
  },
};
