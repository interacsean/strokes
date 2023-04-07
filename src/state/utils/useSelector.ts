import { useMemo } from "react";

export const useSelector = <T, U>(selector: (state: T) => U, state: T) => useMemo(
  () => selector(state),
  [selector, state]
);
