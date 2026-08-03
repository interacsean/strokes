import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { Stroke } from "model/Stroke";
import { PenaltyReasonLabels } from "model/Penalty";

const MAX_PIPS = 6;

type Pip =
  | { kind: "stroke"; strokeNum: number }
  | { kind: "penalty"; title: string }
  | { kind: "future" };

type NumberedPip = Pip & { label: number };

// Pips read left to right as the hole played out: one per swing, followed by one
// per penalty stroke it incurred. Every pip is one stroke on the card, so the
// labels are just the sequence — which is what makes a penalty take a number of
// its own and the swing after it count on from there.
function buildPips(
  strokes: Stroke[],
  par: number | undefined
): NumberedPip[] {
  const pips: Pip[] = strokes.flatMap((stroke, i): Pip[] => [
    { kind: "stroke", strokeNum: i + 1 },
    ...Array(stroke.penalty?.strokes ?? 0).fill(0).map(
      (): Pip => ({
        kind: "penalty",
        title: `${PenaltyReasonLabels[stroke.penalty!.reason]} +${
          stroke.penalty!.strokes
        }`,
      })
    ),
  ]);

  // pad out to par so the player can see what's left in regulation
  const target = Math.max(par || 1, pips.length);
  while (pips.length < target) {
    pips.push({ kind: "future" });
  }
  return pips.map((pip, i) => ({ ...pip, label: i + 1 }));
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

  return (
    <Flex alignItems="baseline">
      {shownPips.map((pip, i) => {
        const isActive = pip.kind === "stroke" && pip.strokeNum === activeStroke;
        const overPar = !!par && pip.label > par;
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
              pip.kind === "penalty"
                ? "penalty.300"
                : overPar
                ? "pink"
                : "white"
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
