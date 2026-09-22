import { useEffect, useRef } from "react";
import { atom, useRecoilState } from "recoil";
import { localStoragePersistenceEffect } from "persistence/localStoragePersistence";
import { LatLng } from "model/LatLng";
import { Wind } from "model/Wind";
import { fetchWind } from "usecases/wind/fetchWind";
import { shouldRefetchWind } from "usecases/wind/shouldRefetchWind";

/** How often we re-run the freshness check. The check itself rarely decides to
 * fetch, so this only needs to be fine enough that a reading falling due is
 * picked up promptly while the player stands still over a shot. */
const CHECK_INTERVAL_MS = 30_000;

/** Both maps can be mounted at once, so the request is shared rather than made
 * once per map. */
let inFlight: Promise<Wind> | null = null;

type WindAttempt = {
  at: number;
  failed: boolean;
};

/**
 * The wind at the ball, kept current without asking the API more than it has
 * anything new to say. Every mounted caller shares the one reading and the one
 * request.
 */
export function useWind(pos: LatLng | null | undefined): Wind | null {
  const [wind, setWind] = useRecoilState(windAtom);

  // The GPS hands us a new position object on every tick; holding it in a ref
  // keeps the polling effect from being torn down and rebuilt each time.
  const posRef = useRef(pos);
  posRef.current = pos;
  const windRef = useRef(wind);
  windRef.current = wind;
  const attemptRef = useRef<WindAttempt | null>(null);

  useEffect(
    function keepWindCurrent() {
      let cancelled = false;

      const check = () => {
        const at = posRef.current;
        if (
          !at ||
          !shouldRefetchWind({
            wind: windRef.current,
            pos: at,
            lastAttemptAt: attemptRef.current?.at ?? null,
            lastAttemptFailed: !!attemptRef.current?.failed,
            now: Date.now(),
          })
        ) {
          return;
        }

        attemptRef.current = { at: Date.now(), failed: false };
        const request = (inFlight ??= fetchWind(at).finally(() => {
          inFlight = null;
        }));

        request
          .then((next) => {
            if (!cancelled) setWind(next);
          })
          .catch(() => {
            attemptRef.current = { at: Date.now(), failed: true };
          });
      };

      check();
      const timer = window.setInterval(check, CHECK_INTERVAL_MS);
      return () => {
        cancelled = true;
        window.clearInterval(timer);
      };
    },
    // Walking far enough to matter is what the gate checks; re-running on a
    // coarse position keeps a big move from waiting out the interval.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coarsePositionKey(pos), setWind]
  );

  return wind;
}

/** ~100m of latitude, and no more than that of longitude, so a move worth
 * refetching for always changes this. */
function coarsePositionKey(pos: LatLng | null | undefined): string {
  if (!pos) return "";
  return `${Math.round(pos.lat * 1000)}|${Math.round(pos.lng * 1000)}`;
}

const windAtom = atom<Wind | null>({
  key: "wind",
  default: null,
  effects: [localStoragePersistenceEffect("strokes_0.2_wind")],
});
