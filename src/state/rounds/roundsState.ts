import { Course } from "model/Course";
import { localStoragePersistenceEffect } from "persistence/localStoragePersistence";
import { useMemo } from "react";
import { atom, useRecoilState } from "recoil";

export type RoundsStateSetters = ReturnType<typeof useRoundsState>;

export type RoundsState = Course[];

export type HoleState = {
  strokes: number[]; // todo: update,
};

export function useRoundsState() {
  const [state, setState] = useRecoilState(roundsAtom);

  return useMemo(
    () => ({
      state,
      setState,
      // addRound: (round: Course) => {
      //   setState((currentState) => {
      //     return currentState ? [...currentState, round] : [round];
      //   });
      // },
      upsertRound: (round: Course) => {
        setState((currentState) => {
          let updated = false;
          const updatedRounds = currentState.map((r) => {
            if (r.timePlayed === round.timePlayed) {
              updated = true;
              return round;
            }
            return r;
          });
          return updated ? updatedRounds : [...currentState, round];
        });
      },
    }),
    // eslint-disable-next-line
    [setState, ...Object.values(state || {})]
  );
}

const roundsAtom = atom<RoundsState>({
  key: "rounds",
  default: [],
  effects: [localStoragePersistenceEffect("strokes_0.2_rounds")],
});
