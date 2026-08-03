import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { Stroke } from "model/Stroke";
import { PenaltyReasonLabels } from "model/Penalty";

const MAX_PIPS = 6;

type Pip =
  | { kind: "stroke"; label: number; strokeNum: number }
  | { kind: "penalty"; label: string; title: string }
  | { kind: "future"; label: number };

// Pips read left to right as the hole played out: a numbered pip per swing, with
// a flag pip for each penalty stroke sitting after the swing that incurred it.
function buildPips(strokes: Stroke[], par: number | undefined): Pip[] {
  const pips: Pip[] = strokes.flatMap((stroke, i): Pip[] => [
    { kind: "stroke", label: i + 1, strokeNum: i + 1 },
    ...Array(stroke.penalty?.strokes ?? 0).fill(0).map(
      (): Pip => ({
        kind: "penalty",
        label: "⚑",
        title: `${PenaltyReasonLabels[stroke.penalty!.reason]} +${
          stroke.penalty!.strokes
        }`,
      })
    ),
  ]);

  // pad out to par so the player can see what's left in regulation
  const target = Math.max(par || 1, pips.length);
  for (let n = strokes.length + 1; pips.length < target; n++) {
    pips.push({ kind: "future", label: n });
  }
  return pips;
}

export function StrokeCounter({
  par,
  activeStroke,
  strokes,
  strokeClick,
}: {
  par: number | undefined;
  activeStroke: number;
  strokes: Stroke[];
  strokeClick: (stroke: number) => void;
}) {
  const sz = 32; // size
  const pips = buildPips(strokes, par);
  const shownPips = pips.slice(-MAX_PIPS);
  const truncated = pips.length > MAX_PIPS;
  const hiddenPips = pips.length - shownPips.length;

  // todo: consider activeStroke, if user is scrolling back through
  return (
    <Flex alignItems="baseline">
      {shownPips.map((pip, i) => {
        const isActive = pip.kind === "stroke" && pip.strokeNum === activeStroke;
        // a pip's position in the hole, not its label — a penalty pushes every
        // following swing further past par
        const overPar = !!par && hiddenPips + i + 1 > par;
        const txt = (
          <Text
            display="inline-flex"
            justifyContent="center"
            alignItems="center"
            fontWeight="600"
            minWidth={`${sz}px`}
            height={`${sz}px`}
            bgColor={"transparent"}
            opacity={pip.kind === "future" ? 0.4 : 1}
            color={
              pip.kind === "penalty" ? "#FAC775" : overPar ? "pink" : "white"
            }
            borderBottom={`3px solid`}
            borderColor={isActive ? `white` : "transparent"}
            borderRight={!isActive ? "none" : undefined}
            title={pip.kind === "penalty" ? pip.title : undefined}
          >
            {truncated && i === 0 ? "-" : pip.label}
          </Text>
        );

        return pip.kind === "stroke" ? (
          // todo: Kill the 'active' style on buttons
          <Button
            key={`s${pip.strokeNum}`}
            variant="ghost"
            onClick={() => strokeClick(pip.strokeNum)}
            p={0}
            minWidth={`${sz}px`}
            height={`${sz - 3}px`}
          >
            {txt}
          </Button>
        ) : (
          <Box
            key={`${pip.kind}${i}`}
            minWidth={`${sz}px`}
            height={`${sz - 3}px`}
            p={0}
          >
            {txt}
          </Box>
        );
      })}
    </Flex>
  );
}
