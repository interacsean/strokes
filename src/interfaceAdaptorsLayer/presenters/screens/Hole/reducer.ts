export type HoleState = {
  holeNum: number;
};

type HoleActions = {};

export function holeReducer(state: HoleState, action: HoleActions) {
  return state;
}

export const initialHoleState = {
  holeNum: 1,
};
