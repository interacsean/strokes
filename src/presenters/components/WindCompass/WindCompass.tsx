import { Box } from "@chakra-ui/react";
import { Wind, WIND_SPEED_UNIT } from "model/Wind";

type WindCompassProps = {
  wind: Wind | null;
  /** The map's heading, degrees clockwise from north. The dial turns against it
   * so north on the dial points north on the imagery. */
  mapHeading: number;
  /** Rendered width and height, in px. */
  size: number;
};

const CARDINALS: [string, number][] = [
  ["N", 0],
  ["E", 90],
  ["S", 180],
  ["W", 270],
];

/** Everything below is in the 100x100 user space the SVG scales from. */
const CENTRE = 50;
const CARDINAL_RADIUS = 41;
const DISC_RADIUS = 21;

/** Head and tail of one arrow running through the middle; the disc covers the
 * shaft between them, leaving a head outside it and a tail opposite. It stops
 * short of the cardinals so the two don't run into each other. */
const ARROW_PATH = "M50 19 L59 34 L53.5 34 L53.5 81 L46.5 81 L46.5 34 L41 34 Z";

/** Below this the wind is not worth playing for, and an arrow would point a
 * direction the player would be wrong to trust. */
const CALM_SPEED = 1;

/**
 * Wind at the ball, laid over the map: a dial turned to match the map's
 * orientation, an arrow showing which way the wind is pushing the ball, and the
 * speed on the disc in the middle.
 */
export function WindCompass({ wind, mapHeading, size }: WindCompassProps) {
  if (!wind) return null;

  // The API reports where the wind comes from; what matters over a shot is
  // where it is pushing the ball.
  const blowingTowards = wind.fromBearing + 180;
  const speed = Math.round(wind.speed);

  return (
    <Box
      as="svg"
      // @ts-ignore chakra passes svg attributes through
      viewBox="0 0 100 100"
      width={`${size}px`}
      height={`${size}px`}
      role="img"
      aria-label={`Wind ${speed} ${WIND_SPEED_UNIT} from ${Math.round(
        wind.fromBearing
      )} degrees`}
      pointerEvents="none"
      display="block"
    >
      <circle cx={CENTRE} cy={CENTRE} r={CENTRE} fill="rgba(0, 0, 0, 0.6)" />

      <g transform={`rotate(${-mapHeading} ${CENTRE} ${CENTRE})`}>
        {wind.speed >= CALM_SPEED && (
          <path
            transform={`rotate(${blowingTowards} ${CENTRE} ${CENTRE})`}
            d={ARROW_PATH}
            fill="#ffd400"
          />
        )}

        {CARDINALS.map(([label, bearing]) => (
          <text
            key={label}
            // Placed around the dial, then turned back upright so the letters
            // stay readable however the map is oriented.
            transform={`rotate(${bearing} ${CENTRE} ${CENTRE}) rotate(${
              mapHeading - bearing
            } ${CENTRE} ${CENTRE - CARDINAL_RADIUS})`}
            x={CENTRE}
            y={CENTRE - CARDINAL_RADIUS}
            fill={label === "N" ? "#ffffff" : "rgba(255, 255, 255, 0.65)"}
            fontSize={13}
            fontWeight={800}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {label}
          </text>
        ))}
      </g>

      <circle cx={CENTRE} cy={CENTRE} r={DISC_RADIUS} fill="#ffffff" />
      <text
        x={CENTRE}
        y={CENTRE}
        fill="#111111"
        fontSize={speed >= 100 ? 20 : 25}
        fontWeight={800}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {speed}
      </text>
    </Box>
  );
}
